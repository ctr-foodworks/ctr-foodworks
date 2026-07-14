import { count, desc, gte, sql } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "./db";

/**
 * Analytics data layer for the admin "Reports & Analytics" page.
 *
 * Everything is computed in a handful of small aggregate queries (fine on the
 * Neon HTTP driver) and zero-filled in JS so the series always have a fixed
 * length. Without a DB the whole structure degrades to zeros — the reports
 * page never crashes.
 */

export type MonthDelta = {
  thisMonth: number;
  lastMonth: number;
  /** Percent change vs last month; null when last month had no rows. */
  pctChange: number | null;
};

export type WeeklyPoint = {
  /** Monday of the ISO week, `YYYY-MM-DD` (UTC). */
  weekStart: string;
  contacts: number;
  waitlist: number;
};

export type LabelCount = { label: string; count: number };

export type MonthlyPoint = {
  /** Calendar month key, `YYYY-MM` (UTC). */
  key: string;
  /** Display label, e.g. "Feb 2026". */
  label: string;
  contacts: number;
  waitlist: number;
  events: number;
};

export type RecentItem = {
  type: "contact" | "waitlist";
  title: string;
  detail: string;
  /** ISO timestamp string. */
  createdAt: string;
};

export type DashboardMetrics = {
  totals: {
    contacts: number;
    contactsUnread: number;
    needsReply: number;
    waitlist: number;
    waitlistUnread: number;
    events: number;
    eventsUpcoming: number;
  };
  contactsMonth: MonthDelta;
  waitlistMonth: MonthDelta;
  /** Last 12 ISO weeks including the current one, oldest first. Always 12. */
  weekly: WeeklyPoint[];
  /** Contact messages by meta->>'category' (fallback "General"), count desc. */
  categories: LabelCount[];
  /** Waitlist signups by source (fallback "unknown"), count desc. */
  sources: LabelCount[];
  /** Last 6 calendar months including the current one, oldest first. Always 6. */
  monthly: MonthlyPoint[];
  replyRate: { replied: number; total: number; pct: number };
  /** Newest 8 across contacts + waitlist, newest first. */
  recent: RecentItem[];
};

// ── Date helpers (all UTC) ───────────────────────────────────────────────────

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday 00:00 UTC of the ISO week containing `d`. */
function utcWeekStart(d: Date): Date {
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - daysSinceMonday),
  );
}

/** The last `n` ISO week starts including the current week, oldest first. */
function lastWeekStarts(n: number): string[] {
  const current = utcWeekStart(new Date());
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(isoDate(new Date(current.getTime() - i * 7 * 86400000)));
  }
  return out;
}

/** The last `n` calendar months including the current one, oldest first. */
function lastMonths(n: number): { key: string; label: string }[] {
  const now = new Date();
  const out: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    out.push({
      key: isoDate(d).slice(0, 7),
      label: d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
    });
  }
  return out;
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function metaCategory(meta: unknown): string {
  if (meta && typeof meta === "object" && "category" in meta) {
    const c = (meta as { category?: unknown }).category;
    if (typeof c === "string" && c) return c;
  }
  return "General";
}

function zeroedMetrics(): DashboardMetrics {
  return {
    totals: {
      contacts: 0,
      contactsUnread: 0,
      needsReply: 0,
      waitlist: 0,
      waitlistUnread: 0,
      events: 0,
      eventsUpcoming: 0,
    },
    contactsMonth: { thisMonth: 0, lastMonth: 0, pctChange: null },
    waitlistMonth: { thisMonth: 0, lastMonth: 0, pctChange: null },
    weekly: lastWeekStarts(12).map((weekStart) => ({
      weekStart,
      contacts: 0,
      waitlist: 0,
    })),
    categories: [],
    sources: [],
    monthly: lastMonths(6).map((m) => ({
      ...m,
      contacts: 0,
      waitlist: 0,
      events: 0,
    })),
    replyRate: { replied: 0, total: 0, pct: 0 },
    recent: [],
  };
}

// ── Metrics ──────────────────────────────────────────────────────────────────

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (!isDbConfigured()) return zeroedMetrics();

  const db = getDb();
  const todayStr = isoDate(new Date());
  const weekStarts = lastWeekStarts(12);
  const months = lastMonths(6);
  const weeklySince = new Date(`${weekStarts[0]}T00:00:00.000Z`);
  const monthlySince = new Date(`${months[0].key}-01T00:00:00.000Z`);

  // Postgres date_trunc('week', …) truncates to Monday, matching the JS ISO
  // week starts above. `at time zone 'UTC'` pins the bucket to UTC days.
  const contactWeek = sql<string>`to_char(date_trunc('week', ${schema.contactMessages.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  const waitlistWeek = sql<string>`to_char(date_trunc('week', ${schema.waitlistSignups.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  const contactMonth = sql<string>`to_char(date_trunc('month', ${schema.contactMessages.createdAt} at time zone 'UTC'), 'YYYY-MM')`;
  const waitlistMonth = sql<string>`to_char(date_trunc('month', ${schema.waitlistSignups.createdAt} at time zone 'UTC'), 'YYYY-MM')`;
  // events.date is a `YYYY-MM-DD` text column — left(date, 7) is the month key.
  const eventMonth = sql<string>`left(${schema.events.date}, 7)`;
  const categoryExpr = sql<string>`coalesce(${schema.contactMessages.meta} ->> 'category', 'General')`;
  const sourceExpr = sql<string>`coalesce(${schema.waitlistSignups.source}, 'unknown')`;

  const [
    [contactTotals],
    [waitlistTotals],
    [eventTotals],
    contactWeeks,
    waitlistWeeks,
    contactMonths,
    waitlistMonths,
    eventMonths,
    categoryRows,
    sourceRows,
    recentContacts,
    recentWaitlist,
  ] = await Promise.all([
    db
      .select({
        total: count(),
        unread: sql<number>`count(*) filter (where ${schema.contactMessages.read} = false)`.mapWith(Number),
        needsReply: sql<number>`count(*) filter (where ${schema.contactMessages.responded} = false)`.mapWith(Number),
        replied: sql<number>`count(*) filter (where ${schema.contactMessages.responded} = true)`.mapWith(Number),
      })
      .from(schema.contactMessages),
    db
      .select({
        total: count(),
        unread: sql<number>`count(*) filter (where ${schema.waitlistSignups.read} = false)`.mapWith(Number),
      })
      .from(schema.waitlistSignups),
    db
      .select({
        total: count(),
        upcoming: sql<number>`count(*) filter (where ${schema.events.date} >= ${todayStr})`.mapWith(Number),
      })
      .from(schema.events),
    db
      .select({ bucket: contactWeek, n: count() })
      .from(schema.contactMessages)
      .where(gte(schema.contactMessages.createdAt, weeklySince))
      .groupBy(contactWeek),
    db
      .select({ bucket: waitlistWeek, n: count() })
      .from(schema.waitlistSignups)
      .where(gte(schema.waitlistSignups.createdAt, weeklySince))
      .groupBy(waitlistWeek),
    db
      .select({ bucket: contactMonth, n: count() })
      .from(schema.contactMessages)
      .where(gte(schema.contactMessages.createdAt, monthlySince))
      .groupBy(contactMonth),
    db
      .select({ bucket: waitlistMonth, n: count() })
      .from(schema.waitlistSignups)
      .where(gte(schema.waitlistSignups.createdAt, monthlySince))
      .groupBy(waitlistMonth),
    db
      .select({ bucket: eventMonth, n: count() })
      .from(schema.events)
      .groupBy(eventMonth),
    db
      .select({ label: categoryExpr, n: count() })
      .from(schema.contactMessages)
      .groupBy(categoryExpr),
    db
      .select({ label: sourceExpr, n: count() })
      .from(schema.waitlistSignups)
      .groupBy(sourceExpr),
    db
      .select({
        name: schema.contactMessages.name,
        email: schema.contactMessages.email,
        meta: schema.contactMessages.meta,
        createdAt: schema.contactMessages.createdAt,
      })
      .from(schema.contactMessages)
      .orderBy(desc(schema.contactMessages.createdAt))
      .limit(8),
    db
      .select({
        email: schema.waitlistSignups.email,
        source: schema.waitlistSignups.source,
        createdAt: schema.waitlistSignups.createdAt,
      })
      .from(schema.waitlistSignups)
      .orderBy(desc(schema.waitlistSignups.createdAt))
      .limit(8),
  ]);

  const toMap = (rows: { bucket: string; n: number }[]) =>
    new Map(rows.map((r) => [r.bucket, Number(r.n)]));

  const contactByWeek = toMap(contactWeeks);
  const waitlistByWeek = toMap(waitlistWeeks);
  const contactByMonth = toMap(contactMonths);
  const waitlistByMonth = toMap(waitlistMonths);
  const eventsByMonth = toMap(eventMonths);

  const weekly: WeeklyPoint[] = weekStarts.map((weekStart) => ({
    weekStart,
    contacts: contactByWeek.get(weekStart) ?? 0,
    waitlist: waitlistByWeek.get(weekStart) ?? 0,
  }));

  const monthly: MonthlyPoint[] = months.map((m) => ({
    ...m,
    contacts: contactByMonth.get(m.key) ?? 0,
    waitlist: waitlistByMonth.get(m.key) ?? 0,
    events: eventsByMonth.get(m.key) ?? 0,
  }));

  const thisKey = months[months.length - 1].key;
  const lastKey = months[months.length - 2].key;
  const contactsThis = contactByMonth.get(thisKey) ?? 0;
  const contactsLast = contactByMonth.get(lastKey) ?? 0;
  const waitlistThis = waitlistByMonth.get(thisKey) ?? 0;
  const waitlistLast = waitlistByMonth.get(lastKey) ?? 0;

  const byCountDesc = (a: LabelCount, b: LabelCount) => b.count - a.count;

  const recent: RecentItem[] = [
    ...recentContacts.map((r) => ({
      type: "contact" as const,
      title: r.name || r.email,
      detail: metaCategory(r.meta),
      createdAt: r.createdAt.toISOString(),
    })),
    ...recentWaitlist.map((r) => ({
      type: "waitlist" as const,
      title: r.email,
      detail: r.source || "unknown",
      createdAt: r.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 8);

  const contactsTotal = Number(contactTotals?.total ?? 0);
  const replied = Number(contactTotals?.replied ?? 0);

  return {
    totals: {
      contacts: contactsTotal,
      contactsUnread: Number(contactTotals?.unread ?? 0),
      needsReply: Number(contactTotals?.needsReply ?? 0),
      waitlist: Number(waitlistTotals?.total ?? 0),
      waitlistUnread: Number(waitlistTotals?.unread ?? 0),
      events: Number(eventTotals?.total ?? 0),
      eventsUpcoming: Number(eventTotals?.upcoming ?? 0),
    },
    contactsMonth: {
      thisMonth: contactsThis,
      lastMonth: contactsLast,
      pctChange: pctChange(contactsThis, contactsLast),
    },
    waitlistMonth: {
      thisMonth: waitlistThis,
      lastMonth: waitlistLast,
      pctChange: pctChange(waitlistThis, waitlistLast),
    },
    weekly,
    categories: categoryRows
      .map((r) => ({ label: r.label, count: Number(r.n) }))
      .sort(byCountDesc),
    sources: sourceRows
      .map((r) => ({ label: r.label, count: Number(r.n) }))
      .sort(byCountDesc),
    monthly,
    replyRate: {
      replied,
      total: contactsTotal,
      pct: contactsTotal === 0 ? 0 : Math.round((replied / contactsTotal) * 100),
    },
    recent,
  };
}
