"use client";

export function SignupBreak() {
  return (
    <section className="relative w-full bg-[var(--primary)] overflow-hidden">
      <div className="relative flex flex-col lg:flex-row items-stretch">
        {/* Left — bold statement */}
        <div className="flex flex-col justify-center gap-6 px-6 py-16 lg:px-[60px] lg:py-[100px] lg:w-[720px] xl:w-[800px]">
          <span className="text-[11px] font-semibold tracking-[6px] text-white/60">
            ATLANTA &nbsp;&middot;&nbsp; MAY 2026
          </span>
          <h2 className="font-display text-[48px] sm:text-[56px] font-black leading-[0.9] tracking-[-1px] text-white lg:text-[72px] xl:text-[84px] break-words">
            ENTERTAINMENT.
            <br />
            CULTURE.
            <br />
            COMMUNITY.
          </h2>
          <p className="text-[14px] font-light leading-[1.8] text-white/70 max-w-[380px]">
            CTR Food Works sits at the center of Atlanta’s downtown district, surrounded by major sports venues, cultural landmarks, and some of the city’s most exciting destinations. Whether you&apos;re heading to a game, exploring the city, or meeting friends downtown, CTR Food Works is the perfect place to start — or end — the night.
          </p>
        </div>

        {/* Right — image */}
        <div className="relative min-h-[400px] lg:flex-1 overflow-hidden">
          <img
            src="/images/S_Entry_02_hires-scaled.jpeg"
            alt="The Center atrium rendering"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Form strip below */}
      <div className="flex flex-col items-center gap-6 px-6 py-12 bg-[var(--secondary-plum)] lg:flex-row lg:justify-between lg:px-[60px]">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-[5px] text-white/60">
            REQUEST EARLY ACCESS
          </span>
          <p className="text-[14px] font-light text-white/70">
            Opening events, brand activations, dining previews, and your invitation to opening night.
          </p>
        </div>

        <form className="flex w-full max-w-[400px]" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 h-[52px] bg-white/10 rounded-l-[4px] px-5 text-[14px] font-light text-white placeholder:text-white/40 outline-none border-none"
          />
          <button
            type="submit"
            className="h-[52px] px-7 bg-[var(--primary)] rounded-r-[4px] text-[12px] font-semibold tracking-[2px] text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            JOIN
          </button>
        </form>
      </div>
    </section>
  );
}
