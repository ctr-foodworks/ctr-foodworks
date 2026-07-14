import { Download } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import {
  getDashboardMetrics,
  type DashboardMetrics,
  type LabelCount,
  type WeeklyPoint,
} from "@/lib/metrics-db";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Admin data should always be current.
export const dynamic = "force-dynamic";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
      {children}
    </h2>
  );
}

function StatCard({
  value,
  label,
  pctChange,
}: {
  value: string | number;
  label: string;
  pctChange?: number | null;
}) {
  return (
    <div className="border border-[var(--text-dark)]/10 p-5">
      <p className="font-display text-[32px] font-black leading-none">{value}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
        {label}
      </p>
      {pctChange !== undefined && pctChange !== null && (
        <p
          className={`mt-2 text-[12px] ${
            pctChange >= 0
              ? "text-[var(--primary)]"
              : "text-[var(--text-muted-dark)]"
          }`}
        >
          {pctChange >= 0 ? "▲" : "▼"} {Math.abs(Math.round(pctChange))}% vs last
          month
        </p>
      )}
    </div>
  );
}

/** Pure server-rendered grouped bar chart of the last 12 ISO weeks. */
function WeeklyChart({ weekly }: { weekly: WeeklyPoint[] }) {
  const width = 720;
  const top = 12;
  const baseline = 156;
  const left = 12;
  const plotWidth = width - left * 2;
  const groupWidth = plotWidth / weekly.length;
  const barWidth = 16;
  const barGap = 4;
  const pairOffset = (groupWidth - (barWidth * 2 + barGap)) / 2;
  const max = Math.max(
    4,
    ...weekly.map((w) => Math.max(w.contacts, w.waitlist)),
  );
  const h = (v: number) => (v / max) * (baseline - top);
  const mmdd = (weekStart: string) =>
    `${weekStart.slice(5, 7)}/${weekStart.slice(8, 10)}`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-5">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
          <span className="h-[10px] w-[10px] bg-[var(--primary)]" />
          Inquiries
        </span>
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
          <span className="h-[10px] w-[10px] bg-[var(--primary)] opacity-35" />
          Waitlist
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} 190`}
        width="100%"
        role="img"
        aria-label="Weekly inquiries and waitlist signups, last 12 weeks"
      >
        {weekly.map((w, i) => {
          const groupX = left + i * groupWidth;
          const cH = h(w.contacts);
          const wH = h(w.waitlist);
          return (
            <g key={w.weekStart}>
              <rect
                x={groupX + pairOffset}
                y={baseline - cH}
                width={barWidth}
                height={cH}
                fill="var(--primary)"
              >
                <title>{`Week of ${w.weekStart}: ${w.contacts} inquiries`}</title>
              </rect>
              <rect
                x={groupX + pairOffset + barWidth + barGap}
                y={baseline - wH}
                width={barWidth}
                height={wH}
                fill="var(--primary)"
                fillOpacity={0.35}
              >
                <title>{`Week of ${w.weekStart}: ${w.waitlist} waitlist signups`}</title>
              </rect>
              {i % 2 === 0 && (
                <text
                  x={groupX + groupWidth / 2}
                  y={176}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-muted-dark)"
                >
                  {mmdd(w.weekStart)}
                </text>
              )}
            </g>
          );
        })}
        <line
          x1={left}
          y1={baseline}
          x2={width - left}
          y2={baseline}
          stroke="var(--text-dark)"
          strokeOpacity={0.15}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}

/** Bordered panel with label/count rows and an accent meter under each. */
function BreakdownPanel({
  title,
  items,
}: {
  title: string;
  items: LabelCount[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="border border-[var(--text-dark)]/10 p-5">
      <SectionHeader>{title}</SectionHeader>
      {items.length === 0 ? (
        <p className="mt-4 text-[14px] font-light text-[var(--text-muted-dark)]">
          No data yet.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.label}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[14px] text-[var(--text-dark)]">
                  {item.label}
                </span>
                <span className="font-mono text-[13px] text-[var(--text-dark)]">
                  {item.count}
                </span>
              </div>
              <div className="mt-2 h-[6px] bg-[var(--text-dark)]/10">
                <div
                  className="h-full bg-[var(--primary)]"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const exportButtonClass =
  "inline-flex h-[44px] items-center gap-2 border border-[var(--text-dark)]/20 px-5 text-[12px] font-semibold tracking-[3px] uppercase transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]";

export default async function ReportsPage() {
  if (!isDbConfigured()) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <Eyebrow tone="primary">Setup needed</Eyebrow>
        <h1 className="mt-3 font-display text-[32px] font-black uppercase leading-[1] tracking-[-0.5px]">
          Database not connected
        </h1>
        <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
        <p className="mt-5 max-w-[640px] text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
          Set <code className="font-mono text-[13px]">DATABASE_URL</code> (and the
          other env vars in <code className="font-mono text-[13px]">SETUP.md</code>),
          run <code className="font-mono text-[13px]">npm run db:push</code> and{" "}
          <code className="font-mono text-[13px]">npm run db:seed</code>, then reload.
        </p>
      </main>
    );
  }

  const metrics: DashboardMetrics = await getDashboardMetrics();
  const { totals, contactsMonth, waitlistMonth, weekly, replyRate } = metrics;
  const weeklyEmpty = weekly.every((w) => w.contacts === 0 && w.waitlist === 0);

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <div className="mb-8">
        <Eyebrow tone="primary">Insights</Eyebrow>
        <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
          Reports &amp; Analytics
        </h1>
        <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={totals.contacts} label="Total inquiries" />
        <StatCard value={totals.contactsUnread} label="Unread inquiries" />
        <StatCard value={totals.needsReply} label="Needs reply" />
        <StatCard value={`${replyRate.pct}%`} label="Reply rate" />
        <StatCard value={totals.waitlist} label="Waitlist signups" />
        <StatCard
          value={contactsMonth.thisMonth}
          label="Inquiries this month"
          pctChange={contactsMonth.pctChange}
        />
        <StatCard
          value={waitlistMonth.thisMonth}
          label="Waitlist this month"
          pctChange={waitlistMonth.pctChange}
        />
        <StatCard value={totals.eventsUpcoming} label="Upcoming events" />
      </div>

      <section className="mt-12">
        <SectionHeader>Weekly activity</SectionHeader>
        <div className="mt-5">
          {weeklyEmpty ? (
            <p className="border border-[var(--text-dark)]/10 p-8 text-[14px] font-light text-[var(--text-muted-dark)]">
              No activity in the last 12 weeks yet.
            </p>
          ) : (
            <WeeklyChart weekly={weekly} />
          )}
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <BreakdownPanel title="Inquiries by category" items={metrics.categories} />
        <BreakdownPanel title="Waitlist by source" items={metrics.sources} />
      </section>

      <section className="mt-14">
        <SectionHeader>Monthly summary</SectionHeader>
        <ul className="mt-5 flex flex-col border-t border-[var(--text-dark)]/10">
          <li className="flex items-center gap-4 border-b border-[var(--text-dark)]/10 py-3">
            <span className="min-w-[120px] flex-1 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
              Month
            </span>
            <span className="w-[90px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
              Inquiries
            </span>
            <span className="w-[90px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
              Waitlist
            </span>
            <span className="w-[90px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-muted-dark)]">
              Events
            </span>
          </li>
          {metrics.monthly.map((m) => (
            <li
              key={m.key}
              className="flex items-center gap-4 border-b border-[var(--text-dark)]/10 py-3"
            >
              <span className="min-w-[120px] flex-1 text-[14px] font-medium text-[var(--text-dark)]">
                {m.label}
              </span>
              <span className="w-[90px] shrink-0 text-right font-mono text-[13px] text-[var(--text-dark)]">
                {m.contacts}
              </span>
              <span className="w-[90px] shrink-0 text-right font-mono text-[13px] text-[var(--text-dark)]">
                {m.waitlist}
              </span>
              <span className="w-[90px] shrink-0 text-right font-mono text-[13px] text-[var(--text-dark)]">
                {m.events}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <SectionHeader>Recent activity</SectionHeader>
        {metrics.recent.length === 0 ? (
          <p className="mt-5 text-[15px] font-light text-[var(--text-muted-dark)]">
            No activity yet.
          </p>
        ) : (
          <ul className="mt-5 flex flex-col border-t border-[var(--text-dark)]/10">
            {metrics.recent.map((item, i) => (
              <li
                key={`${item.type}-${item.createdAt}-${i}`}
                className="flex flex-wrap items-center gap-3 border-b border-[var(--text-dark)]/10 py-3"
              >
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[2px] ${
                    item.type === "contact"
                      ? "border border-[var(--primary)]/40 text-[var(--primary)]"
                      : "border border-[var(--text-dark)]/20 text-[var(--text-muted-dark)]"
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-[14px] font-medium text-[var(--text-dark)]">
                  {item.title}
                </span>
                <span className="text-[13px] font-light text-[var(--text-muted-dark)]">
                  {item.detail}
                </span>
                <span className="ml-auto text-right font-mono text-[13px] text-[var(--text-muted-dark)]">
                  {fmtDate(item.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <SectionHeader>Export data</SectionHeader>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href="/api/admin/export/contacts" className={exportButtonClass}>
            <Download className="h-4 w-4" />
            Contacts CSV
          </a>
          <a href="/api/admin/export/waitlist" className={exportButtonClass}>
            <Download className="h-4 w-4" />
            Waitlist CSV
          </a>
          <a href="/api/admin/export/events" className={exportButtonClass}>
            <Download className="h-4 w-4" />
            Events CSV
          </a>
        </div>
        <p className="mt-3 text-[12px] text-[var(--text-muted-dark)]">
          CSV files open directly in Excel.
        </p>
      </section>
    </main>
  );
}
