import { Eyebrow } from "@/components/ui/Eyebrow";

export function FifaBanner() {
  return (
    <section
      id="fifa"
      className="w-full bg-[var(--bg-dark)] text-white"
    >
      <div className="flex flex-col items-center gap-8 px-6 py-10 sm:flex-row sm:items-center sm:gap-10 sm:py-8 lg:gap-14 lg:px-[60px] lg:py-10">
        {/* Trophy */}
        <div className="flex-shrink-0">
          <img
            src="/images/fifa-trophy.png"
            alt="FIFA World Cup 2026™ trophy"
            className="h-28 w-auto sm:h-32 lg:h-40"
          />
        </div>

        {/* Vertical divider on desktop */}
        <div className="hidden h-24 w-px bg-white/10 sm:block" />

        {/* Copy */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <Eyebrow tone="light" className="!text-[var(--secondary-ochre)]">
            FIFA World Cup 2026™ · Host City
          </Eyebrow>
          <p className="text-[14px] font-light leading-[1.7] text-white/70 lg:max-w-[820px] lg:text-[15px]">
            <span className="font-medium text-white">
              Atlanta is a FIFA World Cup 2026™ host city.
            </span>{" "}
            CTR Food Works opens just in time — positioned at the center of downtown, surrounded by major sports venues and cultural landmarks. The perfect place to gather before the match, celebrate the win, and be part of history.
          </p>
        </div>
      </div>
    </section>
  );
}
