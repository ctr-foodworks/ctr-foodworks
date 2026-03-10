"use client";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg-warm-white)] lg:h-[900px]">
      <nav className="absolute left-0 top-0 z-10 flex h-[80px] w-full items-center justify-between px-6 lg:px-[60px]">
        <img
          src="/logos/ctr-inline-black.svg"
          alt="CTR Food Works"
          className="h-4 w-auto lg:h-7"
        />
      </nav>

      <div className="flex flex-col lg:h-full lg:flex-row">
        {/* Left panel */}
        <div className="flex h-[100svh] w-full flex-col justify-between px-6 pb-12 pt-[80px] lg:h-full lg:w-[820px] lg:px-[60px] lg:pb-[100px] lg:justify-end lg:gap-7">
          {/* Spacer for nav on mobile */}
          <div className="lg:hidden" />

          <div className="flex flex-col gap-6 lg:gap-7">
            <h1 className="text-[80px] font-black leading-[0.85] tracking-[-3px] text-[var(--text-dark)] sm:text-[110px] lg:text-[170px] lg:tracking-[-5px]">
              THE
              <br />
              CENTER
            </h1>

            <div className="flex items-center gap-4">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              <span className="text-[13px] font-semibold tracking-[4px] text-[var(--primary)]">
                OPENING MAY 2026
              </span>
            </div>

            <p className="font-display text-[24px] text-[var(--text-dark)] lg:text-[32px]">
              Downtown Atlanta&apos;s common ground
            </p>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-light text-[var(--text-muted-dark)]">
                Downtown Atlanta
              </span>
              <span className="text-[13px] font-light text-[var(--text-muted-dark)]">
                190 Marietta St. NW, Atlanta, GA 30303
              </span>
            </div>
          </div>

          {/* Scroll hint on mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-px w-8 bg-[var(--primary)]" />
            <span className="text-[11px] font-medium tracking-[4px] text-[var(--text-muted-dark)]">
              JOIN THE WAITLIST
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--bg-dark)] lg:min-h-0 lg:flex-1">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 lg:opacity-30"
            style={{ backgroundImage: "url('/images/CNN_Atrium Rendering_2026-01-09.jpg')" }}
          />

          <div className="relative flex h-full flex-col justify-end gap-8 px-6 pb-16 pt-20 lg:justify-center lg:px-[60px] lg:py-16">
            <span className="text-[11px] font-medium tracking-[5px] text-white/60">
              BE THE FIRST TO KNOW
            </span>

            <h2 className="max-w-[500px] text-[52px] font-extrabold leading-[0.9] tracking-[-1px] text-white lg:text-[56px]">
              JOIN THE
              <br />
              WAITLIST
            </h2>

            <div className="h-0.5 w-10 bg-[var(--primary)]" />

            <p className="max-w-[420px] text-[15px] font-light leading-[1.7] text-white/80">
              Get exclusive access to opening events, dining previews, and brand activations at Atlanta&apos;s reimagined landmark.
            </p>

            <form className="flex w-full max-w-[420px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="h-[52px] flex-1 rounded-l-[4px] border-none bg-white/10 px-5 text-[14px] font-light text-white outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                className="h-[52px] cursor-pointer rounded-r-[4px] bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[2px] text-white transition-opacity hover:opacity-90"
              >
                NOTIFY ME
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
