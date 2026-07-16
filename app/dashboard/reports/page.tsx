import Link from "next/link";
import {
  Activity,
  BarChart3,
  CalendarClock,
  CalendarDays,
  Clock,
  Download,
  Gauge,
  LineChart,
  Mail,
  MessageCircle,
  PieChart,
  Reply,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { getDashboardMetrics, type RangeDays } from "@/lib/metrics-db";
import { CountUp } from "@/components/admin/count-up";

// Live analytics — always fresh.
export const dynamic = "force-dynamic";

/* ── Ghostline-style tokens (light SaaS look; accent = CTR brick red) ───── */
const ACCENT = "#c43725";
const ACCENT_RGB = "196, 55, 37";
const TINT = "#fbeeeb";
const FG = "#1c2130";
const MUTED = "#828b9e";
const BORDER = "#e4e8f1";
const TRACK = "#eef1f7";
const GREEN = "#35b57c";
const RED = "#e4524e";
const TEAL = "#39c6b2";
const CHART_PALETTE = [ACCENT, "#f29a1f", GREEN, TEAL, "#8b5cf6", "#e4524e"];

const nf = new Intl.NumberFormat("en-US");

/* ── Small building blocks ────────────────────────────────────────────────── */

function KpiCard({
  icon,
  label,
  value,
  suffix,
  delta,
  deltaLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  delta?: number | null;
  deltaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white px-4 py-3" style={{ borderColor: BORDER }}>
      <div
        className="flex items-center gap-1.5 text-xs uppercase tracking-wide"
        style={{ color: MUTED }}
      >
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums" style={{ color: FG }}>
        <CountUp value={value} suffix={suffix} />
      </p>
      {delta !== undefined && delta !== null && (
        <p
          className="mt-1 flex items-center gap-1 text-xs font-medium tabular-nums"
          style={{ color: delta >= 0 ? GREEN : RED }}
        >
          {delta >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {delta >= 0 ? "+" : ""}
          {delta}% {deltaLabel}
        </p>
      )}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border bg-white p-5 ${className}`}
      style={{ borderColor: BORDER }}
    >
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold" style={{ color: FG }}>
          <span style={{ color: ACCENT }}>{icon}</span>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs" style={{ color: MUTED }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-10 text-center text-sm" style={{ color: MUTED }}>
      {children}
    </p>
  );
}

function MeterRows({
  data,
  color = ACCENT,
}: {
  data: { label: string; count: number }[];
  color?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  if (data.length === 0) return <EmptyNote>No data yet.</EmptyNote>;
  return (
    <ul className="flex flex-col gap-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="truncate text-sm" style={{ color: FG }}>
              {d.label}
            </span>
            <span className="text-sm font-medium tabular-nums" style={{ color: MUTED }}>
              {nf.format(d.count)}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full" style={{ background: TRACK }}>
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${(d.count / max) * 100}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── SVG chart builders (server-rendered, no chart libraries) ─────────────── */

const CHART_W = 1000;
const CHART_H = 240;
const PAD = { l: 36, r: 10, t: 12, b: 26 };

function linePoints(values: number[], yMax: number): [number, number][] {
  const innerW = CHART_W - PAD.l - PAD.r;
  const innerH = CHART_H - PAD.t - PAD.b;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;
  return values.map((v, i) => [
    PAD.l + i * step,
    PAD.t + innerH - (v / yMax) * innerH,
  ]);
}

function toPolyline(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function toAreaPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  const baseline = CHART_H - PAD.b;
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  return `${line} L${pts[pts.length - 1][0].toFixed(1)} ${baseline} L${pts[0][0].toFixed(1)} ${baseline} Z`;
}

function TrendChart({
  daily,
}: {
  daily: { day: string; contacts: number; waitlist: number }[];
}) {
  const allZero = daily.every((d) => d.contacts === 0 && d.waitlist === 0);
  if (allZero) return <EmptyNote>No activity in this period yet.</EmptyNote>;

  const yMax = Math.max(4, ...daily.map((d) => Math.max(d.contacts, d.waitlist)));
  const cPts = linePoints(daily.map((d) => d.contacts), yMax);
  const wPts = linePoints(daily.map((d) => d.waitlist), yMax);
  const innerH = CHART_H - PAD.t - PAD.b;
  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((f) => PAD.t + innerH - f * innerH);
  const labelEvery = Math.max(1, Math.ceil(daily.length / 8));

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs" style={{ color: MUTED }}>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: ACCENT }} />
          Inquiries
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: TEAL }} />
          Waitlist
        </span>
      </div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" role="img" aria-label="Daily activity trend">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.18" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridYs.map((y, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={CHART_W - PAD.r} y1={y} y2={y} stroke={TRACK} strokeWidth="1" />
            <text x={PAD.l - 8} y={y + 3} textAnchor="end" fontSize="10" fill={MUTED}>
              {Math.round((yMax * i) / 4)}
            </text>
          </g>
        ))}
        <path d={toAreaPath(cPts)} fill="url(#areaFill)" />
        <polyline
          points={toPolyline(cPts)}
          fill="none"
          stroke={ACCENT}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          className="gl-draw"
        />
        <polyline
          points={toPolyline(wPts)}
          fill="none"
          stroke={TEAL}
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {cPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill={ACCENT}>
            <title>{`${daily[i].day}: ${daily[i].contacts} inquiries, ${daily[i].waitlist} waitlist`}</title>
          </circle>
        ))}
        {daily.map((d, i) =>
          i % labelEvery === 0 ? (
            <text
              key={d.day}
              x={cPts[i][0]}
              y={CHART_H - 8}
              textAnchor="middle"
              fontSize="10"
              fill={MUTED}
            >
              {d.day.slice(5).replace("-", "/")}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

function Donut({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return <EmptyNote>No inquiries yet.</EmptyNote>;
  const R = 52;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Inquiries by category">
        <circle cx="70" cy="70" r={R} fill="none" stroke={TRACK} strokeWidth="16" />
        {data.map((d, i) => {
          const frac = d.count / total;
          const seg = (
            <circle
              key={d.label}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={CHART_PALETTE[i % CHART_PALETTE.length]}
              strokeWidth="16"
              strokeDasharray={`${(frac * C).toFixed(2)} ${C.toFixed(2)}`}
              strokeDashoffset={(-acc * C).toFixed(2)}
              transform="rotate(-90 70 70)"
            >
              <title>{`${d.label}: ${d.count}`}</title>
            </circle>
          );
          acc += frac;
          return seg;
        })}
        <text x="70" y="66" textAnchor="middle" fontSize="24" fontWeight="600" fill={FG}>
          {nf.format(total)}
        </text>
        <text x="70" y="84" textAnchor="middle" fontSize="10" fill={MUTED}>
          total
        </text>
      </svg>
      <ul className="flex min-w-[140px] flex-col gap-1.5">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: CHART_PALETTE[i % CHART_PALETTE.length] }}
            />
            <span className="truncate" style={{ color: FG }}>
              {d.label}
            </span>
            <span className="ml-auto font-medium tabular-nums" style={{ color: MUTED }}>
              {nf.format(d.count)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReplyGauge({
  pct,
  replied,
  total,
  avgHours,
}: {
  pct: number;
  replied: number;
  total: number;
  avgHours: number | null;
}) {
  // Semicircle gauge: r=56, half-circumference = PI * r.
  const R = 56;
  const HALF = Math.PI * R;
  const frac = Math.min(1, Math.max(0, pct / 100));
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 84" width="170" role="img" aria-label="Reply rate">
        <path
          d={`M 14 76 A ${R} ${R} 0 0 1 126 76`}
          fill="none"
          stroke={TRACK}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M 14 76 A ${R} ${R} 0 0 1 126 76`}
          fill="none"
          stroke={ACCENT}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(frac * HALF).toFixed(1)} ${HALF.toFixed(1)}`}
        />
        <text x="70" y="66" textAnchor="middle" fontSize="26" fontWeight="600" fill={FG}>
          {Math.round(pct)}%
        </text>
        <text x="70" y="80" textAnchor="middle" fontSize="9" fill={MUTED}>
          reply rate
        </text>
      </svg>
      <p className="mt-3 text-sm" style={{ color: FG }}>
        {avgHours !== null ? (
          <>
            Avg first response:{" "}
            <span className="font-semibold tabular-nums">{avgHours.toFixed(1)}h</span>
          </>
        ) : (
          "No replies yet"
        )}
      </p>
      <p className="mt-0.5 text-xs tabular-nums" style={{ color: MUTED }}>
        {nf.format(replied)} of {nf.format(total)} messages answered
      </p>
    </div>
  );
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Heatmap({
  matrix,
  busiestDay,
  busiestHour,
}: {
  matrix: number[][];
  busiestDay: string | null;
  busiestHour: string | null;
}) {
  const max = Math.max(0, ...matrix.flat());
  if (max === 0) return <EmptyNote>No submissions recorded yet.</EmptyNote>;
  return (
    <div>
      {busiestDay && busiestHour && (
        <span
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: TINT, color: ACCENT }}
        >
          <Clock size={12} />
          Busiest: {busiestDay} around {busiestHour}
        </span>
      )}
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {matrix.map((row, d) => (
            <div key={d} className="mb-[3px] flex items-center gap-[3px]">
              <span className="w-8 shrink-0 text-[10px]" style={{ color: MUTED }}>
                {DOW[d]}
              </span>
              {row.map((v, h) => (
                <div
                  key={h}
                  className="h-3.5 flex-1 rounded-[3px]"
                  style={{
                    background:
                      v === 0 ? TRACK : `rgba(${ACCENT_RGB}, ${0.15 + 0.85 * (v / max)})`,
                  }}
                  title={`${DOW[d]} ${h}:00 UTC — ${v} submission${v === 1 ? "" : "s"}`}
                />
              ))}
            </div>
          ))}
          <div className="ml-8 flex gap-[3px]">
            {Array.from({ length: 24 }).map((_, h) => (
              <span
                key={h}
                className="flex-1 text-center text-[9px]"
                style={{ color: h % 4 === 0 ? MUTED : "transparent" }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-2 text-[11px]" style={{ color: MUTED }}>
        Hours shown in UTC.
      </p>
    </div>
  );
}

function CumulativeChart({ points }: { points: { weekStart: string; total: number }[] }) {
  const finalTotal = points.length ? points[points.length - 1].total : 0;
  if (finalTotal === 0) return <EmptyNote>No waitlist signups yet.</EmptyNote>;
  const yMax = Math.max(4, ...points.map((p) => p.total));
  const pts = linePoints(points.map((p) => p.total), yMax);
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold tabular-nums" style={{ color: FG }}>
        <CountUp value={finalTotal} />{" "}
        <span className="text-sm font-normal" style={{ color: MUTED }}>
          total signups
        </span>
      </p>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" role="img" aria-label="Waitlist growth">
        <defs>
          <linearGradient id="cumFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.2" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={toAreaPath(pts)} fill="url(#cumFill)" />
        <polyline
          points={toPolyline(pts)}
          fill="none"
          stroke={TEAL}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          className="gl-draw"
        />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill={TEAL}>
            <title>{`Week of ${points[i].weekStart}: ${points[i].total} total`}</title>
          </circle>
        ))}
        {points.map((p, i) =>
          i % 2 === 0 ? (
            <text key={p.weekStart} x={pts[i][0]} y={CHART_H - 8} textAnchor="middle" fontSize="10" fill={MUTED}>
              {p.weekStart.slice(5).replace("-", "/")}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

const RANGES: RangeDays[] = [7, 30, 90];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const range: RangeDays = sp.range === "7" ? 7 : sp.range === "90" ? 90 : 30;
  const m = await getDashboardMetrics(range);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#f4f6fa]">
    <main className="mx-auto max-w-[1200px] px-6 py-8" style={{ color: FG }}>
      <style>{`
        @keyframes glFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes glDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        .gl-fade { animation: glFadeUp .5s ease-out both; }
        .gl-draw { stroke-dasharray: 1; animation: glDraw 1.2s ease-out .15s both; }
        @media (prefers-reduced-motion: reduce) { .gl-fade, .gl-draw { animation: none; stroke-dasharray: none; } }
      `}</style>

      {/* Header */}
      <div className="gl-fade mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports &amp; Analytics</h1>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>
            Live overview of inquiries, waitlist signups and events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/dashboard/reports?range=${r}`}
                className="inline-flex h-9 items-center rounded-xl border px-3.5 text-[13px] font-medium transition-colors"
                style={
                  r === range
                    ? { background: ACCENT, borderColor: ACCENT, color: "#fff" }
                    : { background: "#fff", borderColor: BORDER, color: MUTED }
                }
              >
                {r}D
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="gl-fade mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3" style={{ animationDelay: "60ms" }}>
        {(
          [
            ["Today", m.quick.today],
            ["Last 7 days", m.quick.last7],
            ["Last 30 days", m.quick.last30],
          ] as const
        ).map(([label, q]) => (
          <div key={label} className="rounded-2xl border bg-white px-4 py-3" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide" style={{ color: MUTED }}>
              <CalendarClock size={14} />
              {label}
            </div>
            <div className="mt-1.5 flex items-baseline gap-4">
              <span className="text-xl font-semibold tabular-nums">
                <CountUp value={q.contacts} />{" "}
                <span className="text-xs font-normal" style={{ color: MUTED }}>
                  inquiries
                </span>
              </span>
              <span className="text-xl font-semibold tabular-nums">
                <CountUp value={q.waitlist} />{" "}
                <span className="text-xs font-normal" style={{ color: MUTED }}>
                  waitlist
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* KPI grid */}
      <div className="gl-fade mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4" style={{ animationDelay: "120ms" }}>
        <KpiCard icon={<MessageCircle size={14} />} label="Total inquiries" value={m.totals.contacts} />
        <KpiCard icon={<Mail size={14} />} label="Unread" value={m.totals.contactsUnread} />
        <KpiCard icon={<Reply size={14} />} label="Needs reply" value={m.totals.needsReply} />
        <KpiCard icon={<Gauge size={14} />} label="Reply rate" value={m.replyRate.pct} suffix="%" />
        <KpiCard icon={<Users size={14} />} label="Waitlist signups" value={m.totals.waitlist} />
        <KpiCard
          icon={<MessageCircle size={14} />}
          label={`Inquiries · ${range}d`}
          value={m.period.contacts}
          delta={m.prevPeriod.contactsPct}
          deltaLabel="vs prev period"
        />
        <KpiCard
          icon={<UserPlus size={14} />}
          label={`Waitlist · ${range}d`}
          value={m.period.waitlist}
          delta={m.prevPeriod.waitlistPct}
          deltaLabel="vs prev period"
        />
        <KpiCard icon={<CalendarDays size={14} />} label="Upcoming events" value={m.totals.eventsUpcoming} />
      </div>

      {/* Trend */}
      <div className="gl-fade mb-4" style={{ animationDelay: "180ms" }}>
        <Panel
          title="Daily activity"
          subtitle={`Inquiries vs waitlist signups over the last ${range} days`}
          icon={<LineChart size={16} />}
        >
          <TrendChart daily={m.daily} />
        </Panel>
      </div>

      {/* Breakdown row */}
      <div className="gl-fade mb-4 grid gap-4 md:grid-cols-3" style={{ animationDelay: "240ms" }}>
        <Panel title="Inquiries by category" icon={<PieChart size={16} />}>
          <Donut data={m.categories} />
        </Panel>
        <Panel title="Waitlist by source" icon={<Users size={16} />}>
          <MeterRows data={m.sources} />
        </Panel>
        <Panel title="Response performance" icon={<Gauge size={16} />}>
          <ReplyGauge
            pct={m.replyRate.pct}
            replied={m.replyRate.replied}
            total={m.replyRate.total}
            avgHours={m.responseTime.avgHours}
          />
        </Panel>
      </div>

      {/* Heatmap */}
      <div className="gl-fade mb-4" style={{ animationDelay: "300ms" }}>
        <Panel
          title="When people reach out"
          subtitle="Submissions by day of week and hour"
          icon={<Clock size={16} />}
        >
          <Heatmap
            matrix={m.heatmap.grid}
            busiestDay={m.heatmap.busiestDay}
            busiestHour={m.heatmap.busiestHour}
          />
        </Panel>
      </div>

      {/* Growth + events */}
      <div className="gl-fade mb-4 grid gap-4 md:grid-cols-2" style={{ animationDelay: "360ms" }}>
        <Panel title="Waitlist growth" subtitle="Running total, last 12 weeks" icon={<TrendingUp size={16} />}>
          <CumulativeChart points={m.cumulativeWaitlist} />
        </Panel>
        <Panel title="Events by category" icon={<CalendarDays size={16} />}>
          <MeterRows data={m.eventsByCategory} />
          <p className="mt-4 text-xs" style={{ color: MUTED }}>
            {nf.format(m.totals.eventsUpcoming)} upcoming · {nf.format(m.totals.events)} total events
          </p>
        </Panel>
      </div>

      {/* Monthly + recent */}
      <div className="gl-fade mb-4 grid gap-4 md:grid-cols-2" style={{ animationDelay: "420ms" }}>
        <Panel title="Monthly summary" subtitle="Last 6 months" icon={<BarChart3 size={16} />}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide" style={{ color: MUTED }}>
                <th className="pb-2 font-medium">Month</th>
                <th className="pb-2 text-right font-medium">Inquiries</th>
                <th className="pb-2 text-right font-medium">Waitlist</th>
                <th className="pb-2 text-right font-medium">Events</th>
              </tr>
            </thead>
            <tbody>
              {m.monthly.map((row) => (
                <tr key={row.key} className="border-t" style={{ borderColor: TRACK }}>
                  <td className="py-2.5" style={{ color: FG }}>
                    {row.label}
                  </td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: FG }}>
                    {nf.format(row.contacts)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: FG }}>
                    {nf.format(row.waitlist)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: FG }}>
                    {nf.format(row.events)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Recent activity" subtitle="Latest inquiries and signups" icon={<Activity size={16} />}>
          {m.recent.length === 0 ? (
            <EmptyNote>Nothing yet.</EmptyNote>
          ) : (
            <ul>
              {m.recent.map((item, i) => (
                <li
                  key={`${item.type}-${item.createdAt}-${i}`}
                  className={`flex items-center gap-3 py-2.5 ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: TRACK }}
                >
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={
                      item.type === "contact"
                        ? { background: TINT, color: ACCENT }
                        : { background: TRACK, color: MUTED }
                    }
                  >
                    {item.type === "contact" ? "Inquiry" : "Waitlist"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium" style={{ color: FG }}>
                      {item.title}
                    </span>
                    <span className="block truncate text-xs" style={{ color: MUTED }}>
                      {item.detail}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums" style={{ color: MUTED }}>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Exports */}
      <div className="gl-fade" style={{ animationDelay: "480ms" }}>
        <Panel title="Export data" subtitle="Branded Excel workbooks (.xlsx)" icon={<Download size={16} />}>
          <div className="flex flex-wrap gap-3">
            {(
              [
                ["Contacts Excel", "/api/admin/export/contacts"],
                ["Waitlist Excel", "/api/admin/export/waitlist"],
                ["Events Excel", "/api/admin/export/events"],
              ] as const
            ).map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-[13px] font-medium transition-colors hover:opacity-80"
                style={{ borderColor: BORDER, color: FG }}
              >
                <Download size={15} style={{ color: ACCENT }} />
                {label}
              </a>
            ))}
          </div>
        </Panel>
      </div>
    </main>
    </div>
  );
}
