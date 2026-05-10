import { cuisineLabels } from "@/lib/cuisines";

export function Ticker() {
  const doubled = [...cuisineLabels, ...cuisineLabels];
  return (
    <div className="relative w-full overflow-hidden bg-[var(--primary)] py-3">
      <div className="flex animate-[ticker_45s_linear_infinite] whitespace-nowrap">
        {doubled.map((label, i) => (
          <span key={`${label}-${i}`} className="flex items-center px-7">
            <span className="text-[12px] font-semibold tracking-[5px] uppercase text-white/85">
              {label}
            </span>
            <span className="ml-7 text-[8px] text-white/40">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
