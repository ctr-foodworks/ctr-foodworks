export function About() {
  return (
    <section className="w-full bg-[var(--secondary-navy)] flex flex-col lg:flex-row lg:min-h-[680px]">
      {/* Left — text */}
      <div className="flex flex-col justify-center gap-8 px-6 py-16 lg:w-[700px] lg:flex-shrink-0 lg:px-[60px] lg:py-[100px]">
        <span className="text-[11px] font-semibold tracking-[6px] text-white/50">
          ABOUT CTR FOOD WORKS
        </span>

        <h2 className="font-display text-[52px] font-black leading-[0.9] text-white lg:text-[72px]">
          FOOD.
          <br />
          ENERGY.
          <br />
          CONNECTION.
        </h2>

        <div className="w-10 h-px bg-[var(--primary)]" />

        <p className="text-[15px] font-light leading-[1.9] text-white/70 max-w-[460px]">
          Located inside the reimagined former CNN Center, CTR Food Works transforms one of the city’s most recognizable landmarks into a lively culinary destination for locals and visitors alike. Guests can explore diverse food concepts, meet friends at the bar, and experience the energy of Atlanta’s evolving food scene.
        </p>

        <p className="text-[15px] font-light leading-[1.9] text-white/70 max-w-[460px]">
          With major events like the FIFA World Cup 2026&trade; on the horizon, CTR Food Works is poised to become a central gathering place downtown — a destination built for everyday dining, celebration, and discovery.
        </p>

        <div className="flex flex-col gap-1.5 pt-2">
          <span className="text-[11px] font-semibold tracking-[4px] text-white/40">
            LOCATION
          </span>
          <span className="text-[13px] font-light text-white/80">
            190 Marietta St. NW, Atlanta, GA 30303
          </span>
        </div>
      </div>

      {/* Right — image */}
      <div className="relative min-h-[300px] w-full overflow-hidden lg:flex-1">
        <img
          src="/images/260218 Food Hall Rendering_View_002 (1).webp"
          alt="The Center atrium"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
