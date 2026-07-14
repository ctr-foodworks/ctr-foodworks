import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import {
  getDashboardMetrics,
  type CumulativePoint,
  type DailyPoint,
  type DashboardMetrics,
  type HeatmapData,
  type LabelCount,
  type QuickCounts,
  type RangeDays,
  type ResponseTime,
} from "@/lib/metrics-db";
import { CountUp } from "@/components/admin/count-up";
import { AutoRefresh } from "@/components/admin/auto-refresh";

// Admin data should always be current.
export const dynamic = "force-dynamic";

/* ── Palette (validated for CVD separation + contrast on #0B1220) ──────────── */

const CANVAS = "#0B1220";
const BRAND = "#c43725"; // brick red — fills, pills
const ACCENT = "#ec5b41"; // brightened brick for strokes on the dark canvas
const AMBER = "#c9820a";
const ROSE = "#ef4d71";
const SKY = "#1d9bd1";
const GREEN = "#34d399"; // status: up
const ROSE_DOWN = "#fb7185"; // status: down
const SERIES = [ACCENT, AMBER, ROSE, SKY, "rgba(255,255,255,0.35)"];

const nf = new Intl.NumberFormat("en-US");

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtDay(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Tiny presentational helpers ───────────────────────────────────────────── */

function Panel({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <section
      className={`a-fadeUp rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10 md:p-6 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[2px] text-white/40">
      {children}
    </h2>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center">
      <p className="text-[13px] font-light text-white/35">{children}</p>
    </div>
  );
}

function Delta({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <span className="text-[11px] text-white/35">no prior data</span>;
  }
  const rounded = Math.round(Math.abs(pct));
  if (pct === 0) return <span className="text-[11px] text-white/35">±0%</span>;
  const up = pct > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[11px] font-semibold"
      style={{ color: up ? GREEN : ROSE_DOWN }}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {nf.format(rounded)}%
    </span>
  );
}

function Sparkline({
  series,
  color,
  delay,
}: {
  series: number[];
  color: string;
  delay: number;
}) {
  const W = 90;
  const H = 28;
  const P = 2;
  const n = series.length;
  const max = Math.max(1, ...series);
  const x = (i: number) => (n <= 1 ? W / 2 : P + (i / (n - 1)) * (W - P * 2));
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const d = series
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" className="shrink-0">
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="a-draw"
        style={{ animationDelay: `${delay}ms` }}
      />
    </svg>
  );
}

function KpiCard({
  label,
  value,
  suffix = "",
  delay,
  delta,
  spark,
  sparkColor = ACCENT,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay: number;
  /** undefined = no delta row; null = "no prior data". */
  delta?: number | null;
  spark?: number[];
  sparkColor?: string;
}) {
  return (
    <div
      className="a-fadeUp rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-end justify-between gap-2">
        <CountUp
          value={value}
          suffix={suffix}
          className="font-display text-[30px] font-black leading-none text-white"
        />
        {spark && <Sparkline series={spark} color={sparkColor} delay={delay + 500} />}
      </div>
      <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[2px] text-white/40">
        {label}
      </p>
      {delta !== undefined && (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/35">
          <Delta pct={delta} />
          <span>vs prev. period</span>
        </p>
      )}
    </div>
  );
}

function QuickStat({
  label,
  counts,
  delay,
}: {
  label: string;
  counts: QuickCounts;
  delay: number;
}) {
  return (
    <div
      className="a-fadeUp flex items-center justify-between gap-4 rounded-xl bg-white/[0.04] px-5 py-4 ring-1 ring-white/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[2px] text-white/40">
        {label}
      </span>
      <span className="flex items-baseline gap-5">
        <span className="flex items-baseline gap-1.5">
          <CountUp
            value={counts.contacts}
            className="font-display text-[22px] font-black leading-none text-white"
          />
          <span className="text-[10px] uppercase tracking-[1px] text-white/40">
            inquiries
          </span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <CountUp
            value={counts.waitlist}
            className="font-display text-[22px] font-black leading-none text-white"
          />
          <span className="text-[10px] uppercase tracking-[1px] text-white/40">
            waitlist
          </span>
        </span>
      </span>
    </div>
  );
}

/* ── Main trend chart ──────────────────────────────────────────────────────── */

function TrendChart({ daily }: { daily: DailyPoint[] }) {
  const W = 1000;
  const H = 280;
  const padL = 46;
  const padR = 14;
  const padT = 14;
  const padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = daily.length;
  const maxVal = Math.max(0, ...daily.map((d) => Math.max(d.contacts, d.waitlist)));
  const yMax = Math.max(4, Math.ceil(maxVal / 4) * 4);
  const x = (i: number) => (n <= 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / yMax) * innerH;
  const toPath = (get: (d: DailyPoint) => number) =>
    daily
      .map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(get(d)).toFixed(1)}`)
      .join(" ");
  const lineC = toPath((d) => d.contacts);
  const lineW = toPath((d) => d.waitlist);
  const areaC = `${lineC} L${x(n - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;
  const labelStep = n <= 7 ? 1 : n <= 30 ? 5 : 15;
  const bandW = n <= 1 ? innerW : innerW / (n - 1);
  const gridTicks = [0, 1, 2, 3, 4];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-4 w-full"
      role="img"
      aria-label={`Daily inquiries and waitlist signups, last ${n} days`}
    >
      <defs>
        <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.32" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
        <mask id="trend-wl-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <path
            d={lineW}
            fill="none"
            stroke="#fff"
            strokeWidth="8"
            strokeLinecap="round"
            pathLength={1}
            className="a-draw"
            style={{ animationDelay: "650ms" }}
          />
        </mask>
      </defs>

      {gridTicks.map((k) => {
        const v = (yMax / 4) * k;
        const gy = y(v);
        return (
          <g key={k}>
            <line
              x1={padL}
              y1={gy}
              x2={W - padR}
              y2={gy}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
            <text
              x={padL - 8}
              y={gy + 3.5}
              textAnchor="end"
              fontSize="11"
              fill="rgba(255,255,255,0.35)"
            >
              {nf.format(v)}
            </text>
          </g>
        );
      })}

      {daily.map((d, i) =>
        i % labelStep === 0 ? (
          <text
            key={d.day}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize="11"
            fill="rgba(255,255,255,0.35)"
          >
            {fmtDay(d.day)}
          </text>
        ) : null,
      )}

      <path
        d={areaC}
        fill="url(#trend-grad)"
        className="a-fadeIn"
        style={{ animationDelay: "1300ms" }}
      />
      <path
        d={lineC}
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="a-draw"
        style={{
          animationDelay: "450ms",
          filter: "drop-shadow(0 0 6px rgba(236,91,65,0.5))",
        }}
      />
      <g mask="url(#trend-wl-mask)">
        <path
          d={lineW}
          fill="none"
          stroke={AMBER}
          strokeWidth="2"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="0.015 0.01"
        />
      </g>

      {daily.map((d, i) => (
        <g key={d.day} className="pt-band">
          <rect
            x={x(i) - bandW / 2}
            y={padT}
            width={bandW}
            height={innerH}
            fill="transparent"
          >
            <title>{`${fmtDay(d.day)} — ${nf.format(d.contacts)} inquiries · ${nf.format(d.waitlist)} waitlist`}</title>
          </rect>
          <circle
            className="pt-dot"
            cx={x(i)}
            cy={y(d.contacts)}
            r="3.5"
            fill={ACCENT}
            stroke={CANVAS}
            strokeWidth="1.5"
          />
          <circle
            className="pt-dot"
            cx={x(i)}
            cy={y(d.waitlist)}
            r="3.5"
            fill={AMBER}
            stroke={CANVAS}
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Donut ─────────────────────────────────────────────────────────────────── */

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function CategoryDonut({ items }: { items: LabelCount[] }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (total === 0) return <EmptyNote>No inquiries yet.</EmptyNote>;

  const shown = items.slice(0, 4);
  const restCount = items.slice(4).reduce((s, i) => s + i.count, 0);
  if (restCount > 0) shown.push({ label: "Other", count: restCount });

  const TAU = Math.PI * 2;
  const gap = shown.length > 1 ? 0.06 : 0.04;
  let acc = 0;
  const segs = shown.map((s, i) => {
    const frac = s.count / total;
    const a0 = acc * TAU - Math.PI / 2 + gap / 2;
    let a1 = (acc + frac) * TAU - Math.PI / 2 - gap / 2;
    if (a1 <= a0) a1 = a0 + 0.02;
    acc += frac;
    return {
      ...s,
      pct: Math.round(frac * 100),
      color: SERIES[i] ?? SERIES[SERIES.length - 1],
      d: arcPath(100, 100, 72, a0, a1),
    };
  });

  return (
    <div className="mt-5 flex flex-wrap items-center gap-6">
      <div className="relative h-[168px] w-[168px] shrink-0">
        <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="Inquiries by category">
          {segs.map((s, i) => (
            <path
              key={s.label}
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeWidth="22"
              pathLength={1}
              className="a-draw"
              style={{ animationDelay: `${400 + i * 150}ms`, animationDuration: "0.9s" }}
            >
              <title>{`${s.label}: ${nf.format(s.count)} (${s.pct}%)`}</title>
            </path>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CountUp
            value={total}
            className="font-display text-[30px] font-black leading-none text-white"
          />
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-white/40">
            inquiries
          </span>
        </div>
      </div>
      <ul className="min-w-[140px] flex-1 space-y-2.5">
        {segs.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: s.color }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-[13px] text-white/75">
              {s.label}
            </span>
            <span className="font-mono text-[12px] text-white/50">
              {nf.format(s.count)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Horizontal bars ───────────────────────────────────────────────────────── */

function BarList({
  items,
  baseDelay = 350,
  capitalize = false,
}: {
  items: LabelCount[];
  baseDelay?: number;
  capitalize?: boolean;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <ul className="mt-5 space-y-4">
      {items.map((item, i) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`min-w-0 truncate text-[13px] text-white/75 ${capitalize ? "capitalize" : ""}`}
            >
              {item.label}
            </span>
            <span className="font-mono text-[12px] text-white/50">
              {nf.format(item.count)}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="a-grow h-full rounded-full"
              style={{
                width: `${Math.max(1.5, (item.count / max) * 100)}%`,
                background: `linear-gradient(90deg, #8a2416, ${ACCENT})`,
                animationDelay: `${baseDelay + i * 90}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Reply-rate gauge ──────────────────────────────────────────────────────── */

function ReplyGauge({
  replyRate,
  responseTime,
}: {
  replyRate: DashboardMetrics["replyRate"];
  responseTime: ResponseTime;
}) {
  const frac = Math.min(1, Math.max(0, replyRate.pct / 100));
  const gaugeArc = "M 16 100 A 84 84 0 0 1 184 100";
  return (
    <div className="mt-5 flex flex-col items-center">
      <div className="relative w-full max-w-[230px]">
        <svg
          viewBox="0 0 200 112"
          className="w-full"
          role="img"
          aria-label={`Reply rate ${replyRate.pct}%`}
        >
          <path
            d={gaugeArc}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {frac > 0 && (
            <path
              d={gaugeArc}
              fill="none"
              stroke={ACCENT}
              strokeWidth="14"
              strokeLinecap="round"
              pathLength={1}
              className="a-sweep"
              style={{
                strokeDasharray: `${frac.toFixed(4)} 1`,
                animationDelay: "500ms",
                filter: "drop-shadow(0 0 8px rgba(236,91,65,0.45))",
              }}
            />
          )}
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <CountUp
            value={replyRate.pct}
            suffix="%"
            className="font-display text-[34px] font-black leading-none text-white"
          />
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-white/40">
            reply rate
          </span>
        </div>
      </div>
      <p className="mt-5 text-[13px] text-white/75">
        {responseTime.avgHours === null
          ? "No replies yet"
          : `Avg first response: ${responseTime.avgHours.toFixed(1)}h`}
      </p>
      <p className="mt-1 text-[11px] text-white/40">
        {nf.format(replyRate.replied)} of {nf.format(replyRate.total)} inquiries
        replied
      </p>
    </div>
  );
}

/* ── Heatmap ───────────────────────────────────────────────────────────────── */

function SubmissionHeatmap({ heatmap }: { heatmap: HeatmapData }) {
  const max = Math.max(0, ...heatmap.grid.flat());
  return (
    <div className="mt-5 overflow-x-auto">
      <div
        className="grid min-w-[620px] gap-[3px]"
        style={{ gridTemplateColumns: "34px repeat(24, minmax(0, 1fr))" }}
      >
        {heatmap.grid.map((row, r) => (
          <div key={r} className="contents">
            <div className="flex items-center text-[10px] font-medium text-white/35">
              {DAYS_SHORT[r]}
            </div>
            {row.map((n, c) => (
              <div
                key={c}
                className="a-cell h-4 rounded-[3px]"
                title={`${DAYS_SHORT[r]} ${String(c).padStart(2, "0")}:00 UTC — ${nf.format(n)} submission${n === 1 ? "" : "s"}`}
                style={{
                  backgroundColor:
                    n > 0 && max > 0
                      ? `rgba(236, 91, 65, ${(0.12 + 0.78 * (n / max)).toFixed(3)})`
                      : "rgba(255,255,255,0.05)",
                  animationDelay: `${Math.min(1000, (r * 24 + c) * 6)}ms`,
                }}
              />
            ))}
          </div>
        ))}
        <div className="contents">
          <div />
          {Array.from({ length: 24 }, (_, c) => (
            <div key={c} className="pt-1 text-[9px] text-white/30">
              {c % 4 === 0 ? `${String(c).padStart(2, "0")}h` : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Cumulative waitlist chart ─────────────────────────────────────────────── */

function CumulativeChart({ series }: { series: CumulativePoint[] }) {
  const W = 1000;
  const H = 200;
  const padL = 46;
  const padR = 14;
  const padT = 14;
  const padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = series.length;
  const maxVal = Math.max(0, ...series.map((p) => p.total));
  const yMax = Math.max(4, Math.ceil(maxVal / 4) * 4);
  const x = (i: number) => (n <= 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / yMax) * innerH;
  const line = series
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.total).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;
  const bandW = n <= 1 ? innerW : innerW / (n - 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-4 w-full"
      role="img"
      aria-label="Cumulative waitlist signups, last 12 weeks"
    >
      <defs>
        <linearGradient id="cume-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.28" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 2, 4].map((k) => {
        const v = (yMax / 4) * k;
        const gy = y(v);
        return (
          <g key={k}>
            <line
              x1={padL}
              y1={gy}
              x2={W - padR}
              y2={gy}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
            <text
              x={padL - 8}
              y={gy + 3.5}
              textAnchor="end"
              fontSize="11"
              fill="rgba(255,255,255,0.35)"
            >
              {nf.format(v)}
            </text>
          </g>
        );
      })}
      {series.map((p, i) =>
        i % 2 === 0 ? (
          <text
            key={p.weekStart}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize="11"
            fill="rgba(255,255,255,0.35)"
          >
            {fmtDay(p.weekStart)}
          </text>
        ) : null,
      )}
      <path
        d={area}
        fill="url(#cume-grad)"
        className="a-fadeIn"
        style={{ animationDelay: "1300ms" }}
      />
      <path
        d={line}
        fill="none"
        stroke={AMBER}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="a-draw"
        style={{ animationDelay: "500ms" }}
      />
      {series.map((p, i) => (
        <g key={p.weekStart} className="pt-band">
          <rect
            x={x(i) - bandW / 2}
            y={padT}
            width={bandW}
            height={innerH}
            fill="transparent"
          >
            <title>{`Week of ${fmtDay(p.weekStart)} — ${nf.format(p.total)} total signups`}</title>
          </rect>
          <circle
            className="pt-dot"
            cx={x(i)}
            cy={y(p.total)}
            r="3.5"
            fill={AMBER}
            stroke={CANVAS}
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */

const RANGES: { days: RangeDays; label: string }[] = [
  { days: 7, label: "7D" },
  { days: 30, label: "30D" },
  { days: 90, label: "90D" },
];

const exportButtonClass =
  "inline-flex h-[44px] items-center gap-2 rounded-lg px-5 text-[11px] font-semibold uppercase tracking-[2px] text-white/70 ring-1 ring-white/15 transition-colors hover:bg-white/[0.06] hover:text-white hover:ring-white/30";

const styles = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } }
@keyframes growBar { from { transform: scaleX(0); } }
@keyframes drawLine { from { stroke-dashoffset: 1; } }
@keyframes sweep { from { stroke-dasharray: 0 1; } }
@keyframes fadeCell { from { opacity: 0; transform: scale(0.5); } }
@keyframes fadeIn { from { opacity: 0; } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.9); } }
.a-fadeUp { animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
.a-grow { transform-origin: left; animation: growBar 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
.a-draw { stroke-dasharray: 1; animation: drawLine 1.2s cubic-bezier(0.33, 1, 0.68, 1) both; }
.a-sweep { animation: sweep 1s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
.a-cell { animation: fadeCell 0.5s ease-out both; }
.a-fadeIn { animation: fadeIn 0.8s ease-out both; }
.a-pulse { animation: pulse 2s ease-in-out infinite; }
.pt-dot { opacity: 0; transition: opacity 0.15s ease; }
.pt-band:hover .pt-dot { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .a-fadeUp, .a-grow, .a-draw, .a-sweep, .a-cell, .a-fadeIn, .a-pulse { animation: none !important; }
  .pt-dot { transition: none; }
}
`;

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const rawRange = Array.isArray(sp.range) ? sp.range[0] : sp.range;
  const range: RangeDays = rawRange === "7" ? 7 : rawRange === "90" ? 90 : 30;

  if (!isDbConfigured()) {
    return (
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="rounded-2xl bg-[#0B1220] p-6 text-white ring-1 ring-white/10 md:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#f08a75]">
            Setup needed
          </p>
          <h1 className="mt-3 font-display text-[32px] font-black uppercase leading-[1] tracking-[-0.5px]">
            Database not connected
          </h1>
          <div className="mt-3 h-[2px] w-12 bg-[#c43725]" />
          <p className="mt-5 max-w-[640px] text-[15px] font-light leading-[1.8] text-white/50">
            Set <code className="font-mono text-[13px] text-white/80">DATABASE_URL</code>{" "}
            (and the other env vars in{" "}
            <code className="font-mono text-[13px] text-white/80">SETUP.md</code>), run{" "}
            <code className="font-mono text-[13px] text-white/80">npm run db:push</code>{" "}
            and <code className="font-mono text-[13px] text-white/80">npm run db:seed</code>,
            then reload.
          </p>
        </div>
      </main>
    );
  }

  const metrics = await getDashboardMetrics(range);
  const {
    totals,
    daily,
    period,
    prevPeriod,
    quick,
    replyRate,
    responseTime,
    heatmap,
    cumulativeWaitlist,
    eventsByCategory,
  } = metrics;

  const trendEmpty = daily.every((d) => d.contacts === 0 && d.waitlist === 0);
  const dailyContacts = daily.map((d) => d.contacts);
  const dailyWaitlist = daily.map((d) => d.waitlist);
  const heatmapEmpty = heatmap.grid.every((row) => row.every((n) => n === 0));
  const cumeTotal = cumulativeWaitlist[cumulativeWaitlist.length - 1]?.total ?? 0;
  const eventsEmpty = eventsByCategory.every((c) => c.count === 0);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#0B1220] p-6 text-white ring-1 ring-white/10 md:p-10">
        <style>{styles}</style>

        {/* Ambient accent glow */}
        <div
          className="pointer-events-none absolute -top-28 right-[-60px] h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(196,55,37,0.18)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-[-80px] h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(196,55,37,0.08)" }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-8">
          {/* ── a. Header ─────────────────────────────────────────────────── */}
          <header className="a-fadeUp flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#f08a75]">
                Insights
              </p>
              <h1 className="mt-3 font-display text-[34px] font-black uppercase leading-[1] tracking-[-0.5px] md:text-[38px]">
                Reports &amp; Analytics
              </h1>
              <div className="mt-3 h-[2px] w-12" style={{ backgroundColor: BRAND }} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <AutoRefresh />
              <nav
                className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10"
                aria-label="Date range"
              >
                {RANGES.map((r) => {
                  const active = r.days === range;
                  return (
                    <Link
                      key={r.days}
                      href={`/dashboard/reports?range=${r.days}`}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] transition-colors ${
                        active
                          ? "text-white"
                          : "text-white/50 ring-1 ring-inset ring-white/15 hover:text-white hover:ring-white/30"
                      }`}
                      style={active ? { backgroundColor: BRAND } : undefined}
                    >
                      {r.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          {/* ── b. Quick stats ────────────────────────────────────────────── */}
          <div className="grid gap-3 sm:grid-cols-3">
            <QuickStat label="Today" counts={quick.today} delay={80} />
            <QuickStat label="Last 7 days" counts={quick.last7} delay={140} />
            <QuickStat label="Last 30 days" counts={quick.last30} delay={200} />
          </div>

          {/* ── c. KPI grid ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Total inquiries" value={totals.contacts} delay={160} />
            <KpiCard label="Unread" value={totals.contactsUnread} delay={210} />
            <KpiCard label="Needs reply" value={totals.needsReply} delay={260} />
            <KpiCard label="Reply rate" value={replyRate.pct} suffix="%" delay={310} />
            <KpiCard label="Waitlist total" value={totals.waitlist} delay={360} />
            <KpiCard
              label={`Inquiries · last ${range}d`}
              value={period.contacts}
              delay={410}
              delta={prevPeriod.contactsPct}
              spark={dailyContacts}
              sparkColor={ACCENT}
            />
            <KpiCard
              label={`Waitlist · last ${range}d`}
              value={period.waitlist}
              delay={460}
              delta={prevPeriod.waitlistPct}
              spark={dailyWaitlist}
              sparkColor={AMBER}
            />
            <KpiCard label="Upcoming events" value={totals.eventsUpcoming} delay={510} />
          </div>

          {/* ── d. Main trend chart ───────────────────────────────────────── */}
          <Panel delay={240}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PanelTitle>Daily activity — last {range} days</PanelTitle>
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2 text-[11px] text-white/50">
                  <span
                    className="inline-block h-[2px] w-4 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden="true"
                  />
                  Inquiries
                </span>
                <span className="flex items-center gap-2 text-[11px] text-white/50">
                  <span
                    className="inline-block w-4 border-t-2 border-dashed"
                    style={{ borderColor: AMBER }}
                    aria-hidden="true"
                  />
                  Waitlist
                </span>
              </div>
            </div>
            {trendEmpty ? (
              <EmptyNote>No activity in the last {range} days yet.</EmptyNote>
            ) : (
              <TrendChart daily={daily} />
            )}
          </Panel>

          {/* ── e. Donut / sources / gauge ────────────────────────────────── */}
          <div className="grid gap-3 lg:grid-cols-3">
            <Panel delay={320}>
              <PanelTitle>Inquiries by category</PanelTitle>
              <CategoryDonut items={metrics.categories} />
            </Panel>
            <Panel delay={380}>
              <PanelTitle>Waitlist by source</PanelTitle>
              {metrics.sources.length === 0 ? (
                <EmptyNote>No signups yet.</EmptyNote>
              ) : (
                <BarList items={metrics.sources} />
              )}
            </Panel>
            <Panel delay={440}>
              <PanelTitle>Response performance</PanelTitle>
              <ReplyGauge replyRate={replyRate} responseTime={responseTime} />
            </Panel>
          </div>

          {/* ── f. Heatmap ────────────────────────────────────────────────── */}
          <Panel delay={500}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PanelTitle>When people reach out</PanelTitle>
              {heatmap.busiestDay && heatmap.busiestHour ? (
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-medium"
                  style={{
                    color: "#f08a75",
                    backgroundColor: "rgba(236,91,65,0.10)",
                    boxShadow: "inset 0 0 0 1px rgba(236,91,65,0.3)",
                  }}
                >
                  Busiest: {heatmap.busiestDay} around {heatmap.busiestHour}
                </span>
              ) : (
                <span className="text-[11px] text-white/35">No submissions yet</span>
              )}
            </div>
            <SubmissionHeatmap heatmap={heatmap} />
            <p className="mt-3 text-[10px] text-white/30">
              Submissions per hour of day{heatmapEmpty ? "" : " — darker is busier"}. All
              times UTC.
            </p>
          </Panel>

          {/* ── g. Waitlist growth ────────────────────────────────────────── */}
          <Panel delay={560}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PanelTitle>Waitlist growth — last 12 weeks</PanelTitle>
              <span className="flex items-baseline gap-2">
                <CountUp
                  value={cumeTotal}
                  className="font-display text-[24px] font-black leading-none text-white"
                />
                <span className="text-[10px] uppercase tracking-[1px] text-white/40">
                  on the waitlist
                </span>
              </span>
            </div>
            {cumeTotal === 0 ? (
              <EmptyNote>No waitlist signups yet.</EmptyNote>
            ) : (
              <CumulativeChart series={cumulativeWaitlist} />
            )}
          </Panel>

          {/* ── h. Events by category ─────────────────────────────────────── */}
          <div className="grid gap-3 lg:grid-cols-2">
            <Panel delay={620}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <PanelTitle>Events by category</PanelTitle>
                <span className="text-[11px] text-white/40">
                  {nf.format(totals.eventsUpcoming)} upcoming ·{" "}
                  {nf.format(totals.events)} total
                </span>
              </div>
              {eventsEmpty ? (
                <EmptyNote>No events yet.</EmptyNote>
              ) : (
                <BarList items={eventsByCategory} capitalize />
              )}
            </Panel>

            {/* ── i. Monthly summary ──────────────────────────────────────── */}
            <Panel delay={680}>
              <PanelTitle>Monthly summary</PanelTitle>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[380px] text-left">
                  <thead>
                    <tr className="text-[10px] font-semibold uppercase tracking-[2px] text-white/35">
                      <th className="pb-2 font-semibold">Month</th>
                      <th className="pb-2 text-right font-semibold">Inquiries</th>
                      <th className="pb-2 text-right font-semibold">Waitlist</th>
                      <th className="pb-2 text-right font-semibold">Events</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 border-t border-white/10">
                    {metrics.monthly.map((m) => (
                      <tr key={m.key}>
                        <td className="py-2.5 text-[13px] font-medium text-white/80">
                          {m.label}
                        </td>
                        <td className="py-2.5 text-right font-mono text-[12px] text-white/60">
                          {nf.format(m.contacts)}
                        </td>
                        <td className="py-2.5 text-right font-mono text-[12px] text-white/60">
                          {nf.format(m.waitlist)}
                        </td>
                        <td className="py-2.5 text-right font-mono text-[12px] text-white/60">
                          {nf.format(m.events)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* ── j. Recent activity ────────────────────────────────────────── */}
          <Panel delay={740}>
            <PanelTitle>Recent activity</PanelTitle>
            {metrics.recent.length === 0 ? (
              <EmptyNote>No activity yet.</EmptyNote>
            ) : (
              <ul className="mt-4 divide-y divide-white/10 border-t border-white/10">
                {metrics.recent.map((item, i) => (
                  <li
                    key={`${item.type}-${item.createdAt}-${i}`}
                    className="flex flex-wrap items-center gap-3 py-3"
                  >
                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[2px] ${
                        item.type === "contact" ? "" : "text-white/50 ring-1 ring-white/20"
                      }`}
                      style={
                        item.type === "contact"
                          ? {
                              color: "#f08a75",
                              backgroundColor: "rgba(236,91,65,0.12)",
                              boxShadow: "inset 0 0 0 1px rgba(236,91,65,0.35)",
                            }
                          : undefined
                      }
                    >
                      {item.type}
                    </span>
                    <span className="text-[13px] font-medium text-white/85">
                      {item.title}
                    </span>
                    <span className="text-[12px] font-light text-white/45">
                      {item.detail}
                    </span>
                    <span className="ml-auto font-mono text-[12px] text-white/40">
                      {fmtDate(item.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* ── k. Export center ──────────────────────────────────────────── */}
          <Panel delay={800}>
            <PanelTitle>Export center</PanelTitle>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a href="/api/admin/export/contacts" className={exportButtonClass}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Contacts CSV
              </a>
              <a href="/api/admin/export/waitlist" className={exportButtonClass}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Waitlist CSV
              </a>
              <a href="/api/admin/export/events" className={exportButtonClass}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Events CSV
              </a>
            </div>
            <p className="mt-3 text-[11px] text-white/40">
              CSV files open directly in Excel.
            </p>
          </Panel>
        </div>
      </div>
    </main>
  );
}
