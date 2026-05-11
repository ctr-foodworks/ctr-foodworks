import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { happyHour } from "@/lib/hours";

const pour = [
  { label: "Draft Beer", val: "8 rotating Georgia taps" },
  { label: "Cocktails", val: "Seasonal craft menu" },
  { label: "Wine", val: "Natural & biodynamic" },
  { label: "N/A Options", val: "House sodas & shrubs" },
];

export function BarFeature() {
  return (
    <section className="grid w-full grid-cols-1 bg-[var(--bg-dark)] text-white lg:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[680px]">
        <img
          src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
          alt="Backlit bar at night with stocked bottle shelves"
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

      {/* Copy */}
      <div className="flex flex-col justify-center gap-7 px-6 py-[80px] lg:px-[60px] lg:py-[120px]">
        <Eyebrow tone="light" className="!text-[var(--secondary-ochre)]">
          The Bar
        </Eyebrow>
        <DisplayHeading size="lg" as="h2" className="text-white">
          CTR BAR.
        </DisplayHeading>
        <div className="h-[2px] w-12 bg-[var(--secondary-ochre)]" />
        <p className="max-w-[480px] text-[15px] font-light leading-[1.8] text-white/65 lg:text-[16px]">
          The heartbeat of the hall. Rotating Georgia craft beers, thoughtfully built seasonal cocktails, and natural wines for the adventurous palate. The place where every great food-hall story begins — and usually ends.
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
            <li className="flex items-baseline justify-between gap-6 py-4">
              <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/45">
                Happy Hour
              </span>
              <span className="text-[14px] font-medium text-[var(--secondary-ochre)]">
                {happyHour}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
