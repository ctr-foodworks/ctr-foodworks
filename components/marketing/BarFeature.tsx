import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

const pour = [
  { label: "Draft Beer", val: "6 rotating Georgia taps" },
  { label: "Cocktails", val: "Seasonal craft menu" },
  { label: "Wine", val: "Natural & biodynamic" },
  { label: "N/A Options", val: "House sodas & shrubs" },
];

export function BarFeature() {
  return (
    <section
      id="bar"
      className="w-full scroll-mt-24 bg-[#161616] text-white"
    >
      {/* Inner grid capped to match the vendor grid width above so the bar
          section reads as part of the same rhythm instead of a separate
          full-bleed block. Background still bleeds to viewport edges. */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2 xl:max-w-[1600px]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[680px]">
        <img
          src="/images/CNN_Atrium Rendering_2026-01-09.jpg"
          alt="CTR Food Works atrium with the central bar"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>

      {/* Copy — anchored to the LEFT edge of this column (= screen midline
          on 4K) so the bar copy doesn't drift into the middle of the right
          half on wide screens. */}
      <div className="flex justify-start px-6 py-[80px] lg:px-[60px] lg:py-[120px] xl:px-[80px]">
        <div className="flex w-full flex-col justify-center gap-7 lg:max-w-[640px] xl:max-w-[720px]">
        <Eyebrow tone="primary">The Bar</Eyebrow>
        <DisplayHeading size="lg" as="h2" className="text-white">
          CTR BAR.
        </DisplayHeading>
        <div className="h-[2px] w-12 bg-[var(--primary)]" />
        <p className="max-w-[480px] text-[15px] font-light leading-[1.8] text-white/65 lg:text-[16px]">
          The heartbeat of the hall, and the largest bar in Georgia. Anchoring the atrium at the center of CTR Food Works, it&apos;s where cocktails flow, conversations linger, and every great story begins — and usually ends.
        </p>

        <div className="mt-2 flex flex-col">
          <span className="border-t border-white/10 pb-4 pt-6 text-[10px] font-semibold tracking-[4px] uppercase text-white/35">
            What we&apos;re pouring
          </span>
          <ul className="flex flex-col">
            {pour.map((row) => (
              <li
                key={row.label}
                className="flex items-baseline justify-between gap-6 border-b border-white/10 py-4"
              >
                <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/45">
                  {row.label}
                </span>
                <span className="text-right text-[14px] font-light text-white/80">
                  {row.val}
                </span>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
      </div>
    </section>
  );
}
