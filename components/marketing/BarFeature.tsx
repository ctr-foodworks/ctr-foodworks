import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { happyHour } from "@/lib/hours";

const pour = [
  { label: "Draft Beer", val: "8 Rotating Georgia Taps" },
  { label: "Cocktails", val: "Seasonal Craft Menu" },
  { label: "Wine", val: "Natural & Biodynamic" },
  { label: "N/A Options", val: "House Sodas & Shrubs" },
];

export function BarFeature() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a08] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.8fr]">
        {/* Main copy */}
        <div className="flex flex-col gap-5 border-b border-white/[0.07] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <Eyebrow tone="dark" className="!text-[var(--secondary-ochre)]">
            The Bar
          </Eyebrow>
          <DisplayHeading size="md" as="h3" className="text-white">
            CTR BAR
          </DisplayHeading>
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--secondary-ochre)]">
            Craft Cocktails · Georgia Drafts · Natural Wine
          </span>
          <p className="max-w-[420px] text-[14px] font-light leading-[1.8] text-white/60">
            The heartbeat of the hall. Rotating Georgia-made craft beers, thoughtfully built seasonal cocktails, and natural wines for the adventurous palate. The place where every great food hall story begins — and usually ends.
          </p>
        </div>

        {/* Pouring list */}
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <span className="text-[10px] font-semibold tracking-[4px] uppercase text-white/30">
            What We&apos;re Pouring
          </span>
          <ul className="flex flex-col">
            {pour.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-white/[0.07] py-4 last:border-b-0"
              >
                <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/40">
                  {row.label}
                </span>
                <span className="text-right text-[13px] font-light text-white/65">
                  {row.val}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 py-4">
              <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/40">
                Happy Hour
              </span>
              <span className="text-[13px] font-medium text-[var(--secondary-ochre)]">
                {happyHour}
              </span>
            </li>
          </ul>
        </div>

        {/* Decorative */}
        <div className="hidden items-end justify-end overflow-hidden p-12 lg:flex">
          <span className="select-none font-display text-[160px] font-black leading-[0.85] text-white/[0.04]">
            BAR
          </span>
        </div>
      </div>
    </section>
  );
}
