export function About() {
  return (
    <section className="w-full bg-[var(--secondary-navy)] flex flex-col lg:flex-row lg:min-h-[680px]">
      {/* Left — text */}
      <div className="flex flex-col justify-center gap-8 px-6 py-16 lg:w-[700px] lg:flex-shrink-0 lg:px-[60px] lg:py-[100px]">
        <span className="text-[11px] font-semibold tracking-[6px] text-white/50">
          ABOUT THE CENTER
        </span>

        <h2 className="font-display text-[52px] font-black leading-[0.9] text-white lg:text-[72px]">
          ENTERTAINMENT.
          <br />
          CULTURE.
          <br />
          COMMUNITY.
        </h2>

        <div className="w-10 h-px bg-[var(--primary)]" />

        <p className="text-[15px] font-light leading-[1.9] text-white/70 max-w-[460px]">
          Atlanta&apos;s reimagined downtown landmark is where world-class
          entertainment, vibrant retail, and a thriving business community
          converge. As home to CTR Culture — a platform for civic storytelling
          and public art — The Center transforms this historic space into a
          living stage for creativity and connection.
        </p>

        <p className="text-[15px] font-light leading-[1.9] text-white/70 max-w-[460px]">
          With major events like the FIFA World Cup and Super Bowl LXII on the
          horizon, The Center pulses with energy — hosting watch parties,
          showcasing local talent, and welcoming brands and changemakers to be
          part of Atlanta&apos;s cultural future.
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
          src="/images/CNN_Atrium Rendering_2026-01-09.jpg"
          alt="The Center atrium"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
