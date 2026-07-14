import { count, desc, eq, gte, sql } from "drizzle-orm";
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

export type DailyPoint = {
  /** UTC calendar day, `YYYY-MM-DD`. */
  day: string;
  contacts: number;
  waitlist: number;
};

export type QuickCounts = { contacts: number; waitlist: number };

export type CumulativePoint = {
  /** Monday of the ISO week, `YYYY-MM-DD` (UTC). */
  weekStart: string;
  /** Running total of ALL waitlist signups up to this week's end. */
  total: number;
};

export type HeatmapData = {
  /** 7 rows (Sun..Sat) x 24 cols (UTC hour 0..23) of contact+waitlist counts. */
  grid: number[][];
  /** e.g. "Tuesday" — null when there is no data at all. */
  busiestDay: string | null;
  /** e.g. "2 PM" (UTC) — null when there is no data at all. */
  busiestHour: string | null;
};

export type ResponseTime = {
  /** Average hours from a message arriving to its first staff reply. */
  avgHours: number | null;
  /** Number of messages that have at least one staff reply. */
  replied: number;
};

export type RangeDays = 7 | 30 | 90;

export type DashboardMetrics = {
  /** The selected range in days (echo of the argument). */
  rangeDays: RangeDays;
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
  /** Last `rangeDays` UTC days including today, oldest first. Zero-filled. */
  daily: DailyPoint[];
  /** Totals across the `daily` window. */
  period: QuickCounts;
  /** The equal-length window immediately before `daily`, plus pct deltas. */
  prevPeriod: {
    contacts: number;
    waitlist: number;
    /** null when the previous period had 0 contacts. */
    contactsPct: number | null;
    /** null when the previous period had 0 waitlist signups. */
    waitlistPct: number | null;
  };
  quick: { today: QuickCounts; last7: QuickCounts; last30: QuickCounts };
  /** Last 12 ISO weeks, running total of all waitlist signups. Always 12. */
  cumulativeWaitlist: CumulativePoint[];
  /** Day-of-week x hour submission heatmap (UTC, all time). */
  heatmap: HeatmapData;
  /** Events by category enum (public/private/recurring), zero-filled. */
  eventsByCategory: LabelCount[];
  responseTime: ResponseTime;
};

// ── Date helpers (all UTC) ───────────────────────────────────────────────────

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Midnight UTC of the calendar day containing `d`. */
function utcDayStart(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * `n` consecutive UTC day keys ending `endDaysAgo` days before today
 * (0 = the window ends today), oldest first.
 */
function dayKeys(n: number, endDaysAgo = 0): string[] {
  const end = utcDayStart(new Date()).getTime() - endDaysAgo * 86400000;
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(isoDate(new Date(end - i * 86400000)));
  }
  return out;
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

/** 0..23 → "12 AM" / "2 PM" style label. */
function hourLabel(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function metaCategory(meta: unknown): string {
  if (meta && typeof meta === "object" && "category" in meta) {
    const c = (meta as { category?: unknown }).category;
    if (typeof c === "string" && c) return c;
  }
  return "General";
}

function emptyHeatmapGrid(): number[][] {
  return Array.from({ length: 7 }, () => Array<number>(24).fill(0));
}

function zeroedMetrics(rangeDays: RangeDays): DashboardMetrics {
  return {
    rangeDays,
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
    daily: dayKeys(rangeDays).map((day) => ({ day, contacts: 0, waitlist: 0 })),
    period: { contacts: 0, waitlist: 0 },
    prevPeriod: { contacts: 0, waitlist: 0, contactsPct: null, waitlistPct: null },
    quick: {
      today: { contacts: 0, waitlist: 0 },
      last7: { contacts: 0, waitlist: 0 },
      last30: { contacts: 0, waitlist: 0 },
    },
    cumulativeWaitlist: lastWeekStarts(12).map((weekStart) => ({
      weekStart,
      total: 0,
    })),
    heatmap: { grid: emptyHeatmapGrid(), busiestDay: null, busiestHour: null },
    eventsByCategory: schema.eventCategory.enumValues.map((label) => ({
      label,
      count: 0,
    })),
    responseTime: { avgHours: null, replied: 0 },
  };
}

// ── Metrics ──────────────────────────────────────────────────────────────────

export async function getDashboardMetrics(
  rangeDays: RangeDays = 30,
): Promise<DashboardMetrics> {
  if (!isDbConfigured()) return zeroedMetrics(rangeDays);

  const db = getDb();
  const todayStr = isoDate(new Date());
  const weekStarts = lastWeekStarts(12);
  const months = lastMonths(6);
  const weeklySince = new Date(`${weekStarts[0]}T00:00:00.000Z`);
  const monthlySince = new Date(`${months[0].key}-01T00:00:00.000Z`);

  // Daily windows: the selected range ending today, and the equal-length
  // window immediately before it. One grouped query covers both.
  const currentDays = dayKeys(rangeDays);
  const prevDays = dayKeys(rangeDays, rangeDays);
  const dailySinceIso = `${prevDays[0]}T00:00:00.000Z`;

  // Quick-stat cutoffs (UTC midnights).
  const todayStartMs = utcDayStart(new Date()).getTime();
  const todayIso = new Date(todayStartMs).toISOString();
  const last7Iso = new Date(todayStartMs - 6 * 86400000).toISOString();
  const last30Iso = new Date(todayStartMs - 29 * 86400000).toISOString();

  // Postgres date_trunc('week', …) truncates to Monday, matching the JS ISO
  // week starts above. `at time zone 'UTC'` pins the bucket to UTC days.
  const contactWeek = sql<string>`to_char(date_trunc('week', ${schema.contactMessages.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  const waitlistWeek = sql<string>`to_char(date_trunc('week', ${schema.waitlistSignups.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  const contactMonth = sql<string>`to_char(date_trunc('month', ${schema.contactMessages.createdAt} at time zone 'UTC'), 'YYYY-MM')`;
  const waitlistMonth = sql<string>`to_char(date_trunc('month', ${schema.waitlistSignups.createdAt} at time zone 'UTC'), 'YYYY-MM')`;
  const contactDayExpr = sql<string>`to_char(date_trunc('day', ${schema.contactMessages.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  const waitlistDayExpr = sql<string>`to_char(date_trunc('day', ${schema.waitlistSignups.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  // events.date is a `YYYY-MM-DD` text column — left(date, 7) is the month key.
  const eventMonth = sql<string>`left(${schema.events.date}, 7)`;
  const categoryExpr = sql<string>`coalesce(${schema.contactMessages.meta} ->> 'category', 'General')`;
  const sourceExpr = sql<string>`coalesce(${schema.waitlistSignups.source}, 'unknown')`;
  // Heatmap buckets: dow 0=Sunday..6=Saturday, hour 0..23, both in UTC.
  const contactDow = sql<number>`extract(dow from (${schema.contactMessages.createdAt} at time zone 'UTC'))::int`.mapWith(Number);
  const contactHour = sql<number>`extract(hour from (${schema.contactMessages.createdAt} at time zone 'UTC'))::int`.mapWith(Number);
  const waitlistDow = sql<number>`extract(dow from (${schema.waitlistSignups.createdAt} at time zone 'UTC'))::int`.mapWith(Number);
  const waitlistHour = sql<number>`extract(hour from (${schema.waitlistSignups.createdAt} at time zone 'UTC'))::int`.mapWith(Number);

  // First staff reply per message → joined back for time-to-first-response.
  const firstStaffReplies = db
    .select({
      messageId: schema.contactReplies.messageId,
      firstReplyAt: sql`min(${schema.contactReplies.createdAt})`.as("first_reply_at"),
    })
    .from(schema.contactReplies)
    .where(eq(schema.contactReplies.direction, "staff"))
    .groupBy(schema.contactReplies.messageId)
    .as("first_staff_replies");

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
    contactDaily,
    waitlistDaily,
    [contactQuick],
    [waitlistQuick],
    contactHeat,
    waitlistHeat,
    eventCatRows,
    [responseRow],
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
      // Only the last 6 months feed the monthly table — skip older rows.
      .where(gte(schema.events.date, `${months[0].key}-01`))
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
    db
      .select({ bucket: contactDayExpr, n: count() })
      .from(schema.contactMessages)
      .where(sql`${schema.contactMessages.createdAt} >= ${dailySinceIso}`)
      .groupBy(contactDayExpr),
    db
      .select({ bucket: waitlistDayExpr, n: count() })
      .from(schema.waitlistSignups)
      .where(sql`${schema.waitlistSignups.createdAt} >= ${dailySinceIso}`)
      .groupBy(waitlistDayExpr),
    db
      .select({
        today: sql<number>`count(*) filter (where ${schema.contactMessages.createdAt} >= ${todayIso})`.mapWith(Number),
        last7: sql<number>`count(*) filter (where ${schema.contactMessages.createdAt} >= ${last7Iso})`.mapWith(Number),
        last30: sql<number>`count(*) filter (where ${schema.contactMessages.createdAt} >= ${last30Iso})`.mapWith(Number),
      })
      .from(schema.contactMessages),
    db
      .select({
        today: sql<number>`count(*) filter (where ${schema.waitlistSignups.createdAt} >= ${todayIso})`.mapWith(Number),
        last7: sql<number>`count(*) filter (where ${schema.waitlistSignups.createdAt} >= ${last7Iso})`.mapWith(Number),
        last30: sql<number>`count(*) filter (where ${schema.waitlistSignups.createdAt} >= ${last30Iso})`.mapWith(Number),
      })
      .from(schema.waitlistSignups),
    db
      .select({ dow: contactDow, hour: contactHour, n: count() })
      .from(schema.contactMessages)
      .groupBy(contactDow, contactHour),
    db
      .select({ dow: waitlistDow, hour: waitlistHour, n: count() })
      .from(schema.waitlistSignups)
      .groupBy(waitlistDow, waitlistHour),
    db
      .select({ label: schema.events.category, n: count() })
      .from(schema.events)
      .groupBy(schema.events.category),
    db
      .select({
        avgHours: sql<
          string | null
        >`avg(extract(epoch from (${firstStaffReplies.firstReplyAt} - ${schema.contactMessages.createdAt})) / 3600.0)`,
        replied: count(),
      })
      .from(firstStaffReplies)
      .innerJoin(
        schema.contactMessages,
        eq(schema.contactMessages.id, firstStaffReplies.messageId),
      ),
  ]);

  const toMap = (rows: { bucket: string; n: number }[]) =>
    new Map(rows.map((r) => [r.bucket, Number(r.n)]));

  const contactByWeek = toMap(contactWeeks);
  const waitlistByWeek = toMap(waitlistWeeks);
  const contactByMonth = toMap(contactMonths);
  const waitlistByMonth = toMap(waitlistMonths);
  const eventsByMonth = toMap(eventMonths);
  const contactByDay = toMap(contactDaily);
  const waitlistByDay = toMap(waitlistDaily);

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
  const waitlistTotal = Number(waitlistTotals?.total ?? 0);

  // Daily series (selected range) + previous-period comparison.
  const daily: DailyPoint[] = currentDays.map((day) => ({
    day,
    contacts: contactByDay.get(day) ?? 0,
    waitlist: waitlistByDay.get(day) ?? 0,
  }));
  const periodContacts = daily.reduce((s, d) => s + d.contacts, 0);
  const periodWaitlist = daily.reduce((s, d) => s + d.waitlist, 0);
  const prevContacts = prevDays.reduce(
    (s, day) => s + (contactByDay.get(day) ?? 0),
    0,
  );
  const prevWaitlist = prevDays.reduce(
    (s, day) => s + (waitlistByDay.get(day) ?? 0),
    0,
  );

  // Cumulative waitlist: signups before the 12-week window seed the baseline;
  // each week adds its own count. The current week's "end" is simply now.
  const windowWaitlistSum = weekly.reduce((s, w) => s + w.waitlist, 0);
  let running = Math.max(0, waitlistTotal - windowWaitlistSum);
  const cumulativeWaitlist: CumulativePoint[] = weekly.map((w) => {
    running += w.waitlist;
    return { weekStart: w.weekStart, total: running };
  });

  // Heatmap: combine both tables into one 7x24 grid.
  const grid = emptyHeatmapGrid();
  for (const rows of [contactHeat, waitlistHeat]) {
    for (const r of rows) {
      const d = Number(r.dow);
      const h = Number(r.hour);
      if (Number.isInteger(d) && d >= 0 && d < 7 && Number.isInteger(h) && h >= 0 && h < 24) {
        grid[d][h] += Number(r.n);
      }
    }
  }
  let bestD = -1;
  let bestH = -1;
  let bestN = 0;
  grid.forEach((row, d) =>
    row.forEach((n, h) => {
      if (n > bestN) {
        bestN = n;
        bestD = d;
        bestH = h;
      }
    }),
  );

  const catCounts = new Map(eventCatRows.map((r) => [r.label, Number(r.n)]));
  const eventsByCategory: LabelCount[] = schema.eventCategory.enumValues.map(
    (label) => ({ label, count: catCounts.get(label) ?? 0 }),
  );

  const avgRaw = responseRow?.avgHours;
  const avgNum = avgRaw === null || avgRaw === undefined ? null : Number(avgRaw);

  return {
    rangeDays,
    totals: {
      contacts: contactsTotal,
      contactsUnread: Number(contactTotals?.unread ?? 0),
      needsReply: Number(contactTotals?.needsReply ?? 0),
      waitlist: waitlistTotal,
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
    daily,
    period: { contacts: periodContacts, waitlist: periodWaitlist },
    prevPeriod: {
      contacts: prevContacts,
      waitlist: prevWaitlist,
      contactsPct: pctChange(periodContacts, prevContacts),
      waitlistPct: pctChange(periodWaitlist, prevWaitlist),
    },
    quick: {
      today: {
        contacts: Number(contactQuick?.today ?? 0),
        waitlist: Number(waitlistQuick?.today ?? 0),
      },
      last7: {
        contacts: Number(contactQuick?.last7 ?? 0),
        waitlist: Number(waitlistQuick?.last7 ?? 0),
      },
      last30: {
        contacts: Number(contactQuick?.last30 ?? 0),
        waitlist: Number(waitlistQuick?.last30 ?? 0),
      },
    },
    cumulativeWaitlist,
    heatmap: {
      grid,
      busiestDay: bestN > 0 ? DAY_NAMES[bestD] : null,
      busiestHour: bestN > 0 ? hourLabel(bestH) : null,
    },
    eventsByCategory,
    responseTime: {
      avgHours: avgNum !== null && Number.isFinite(avgNum) ? avgNum : null,
      replied: Number(responseRow?.replied ?? 0),
    },
  };
}
