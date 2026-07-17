import Link from "next/link";
import { vendors } from "@/lib/vendors";
import { VendorLogo } from "./VendorLogo";

/**
 * Two vendor-logo bands scrolling in opposite directions.
 * Top band: left → (default keyframe, translateX 0 → -50%)
 * Bottom band: right → (same keyframe with animation-direction: reverse)
 *
 * Each row is duplicated in JSX so the loop is seamless — the keyframe
 * translates the row by exactly the width of one copy.
 */
export function LogoBands() {
  const half = Math.ceil(vendors.length / 2);
  const top = vendors.slice(0, half);
  const bottom = vendors.slice(half);

  return (
    <section
      aria-label="Meet the kitchens"
      className="w-full overflow-hidden bg-[#f9f4f0] py-8 lg:py-10"
    >
      <div className="flex flex-col gap-6 lg:gap-8">
        <Band vendors={top} direction="left" />
        <Band vendors={bottom} direction="right" />
      </div>
    </section>
  );
}

type BandProps = {
  vendors: typeof vendors;
  direction: "left" | "right";
};

function Band({ vendors, direction }: BandProps) {
  // Duplicate for seamless loop
  const doubled = [...vendors, ...vendors];
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex w-max items-center gap-6 lg:gap-10"
        style={{
          animation: "ticker 36s linear infinite",
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {doubled.map((v, i) => {
          // The marquee duplicates each vendor for a seamless loop. Only the
          // first copy is a real, focusable, crawlable link; the duplicate half
          // (i >= vendors.length) is hidden from assistive tech and the tab
          // order so focus never lands on invisible content (WCAG).
          const isDuplicate = i >= vendors.length;
          return (
          <Link
            key={`${v.slug}-${i}`}
            href={`/food-and-drinks/${v.slug}`}
            aria-label={v.name}
            aria-hidden={isDuplicate || undefined}
            tabIndex={isDuplicate ? -1 : undefined}
            className="flex flex-shrink-0 items-center gap-4 rounded-md bg-[var(--primary)] px-5 py-4 shadow-[0_10px_24px_-12px_rgba(196,55,37,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#a82d1d] lg:gap-5 lg:px-6 lg:py-5"
          >
            <VendorLogo
              name={v.name}
              logoUrl={v.logoUrl}
              size="sm"
              className="!h-12 !w-12 lg:!h-14 lg:!w-14"
            />
            <div className="flex flex-col gap-1 pr-2">
              <span className="font-display text-[18px] font-black uppercase leading-[1] tracking-[-0.5px] text-white lg:text-[20px]">
                {v.name}
              </span>
              <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/75">
                {v.tagline}
              </span>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
