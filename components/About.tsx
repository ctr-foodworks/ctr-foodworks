/**
 * Home page "About CTR Food Works" panel.
 *
 * Layout: navy text panel LEFT, atrium rendering RIGHT (paired full-bleed).
 * The text column uses flex justify-end + inner max-w-[560px] so the copy
 * anchors to the right edge of its half (= screen midline on wide screens).
 * Background sprawls edge-to-edge; readable content stays anchored at the
 * design width regardless of viewport.
 *
 * Alternates with <SignupBreak /> below, which mirrors the layout
 * (image LEFT, red panel RIGHT) for visual rhythm down the home page.
 */
export function About() {
  return (
    <section className="grid w-full bg-[var(--secondary-navy)] lg:min-h-[680px] lg:grid-cols-2">
      {/* LEFT — text, anchored to the right edge of its column */}
      <div className="flex justify-start px-6 py-16 lg:justify-end lg:px-[60px] lg:py-[100px]">
        <div className="flex w-full flex-col gap-7 lg:max-w-[560px]">
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

          <div className="h-px w-10 bg-[var(--primary)]" />

          <p className="text-[15px] font-light leading-[1.9] text-white/70">
            A great food hall is more than a collection of vendors, it&apos;s a living, evolving experience. At CTR Food Works, culinary concepts, music, culture, and community come together in one dynamic space designed for discovery.
          </p>

          <p className="text-[15px] font-light leading-[1.9] text-white/70">
            Every visit offers something different: a new flavor, a familiar face, a live performance, a conversation that lasts longer than expected. The result is an atmosphere that feels distinctly urban, social, and alive from day to night.
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
      </div>

      {/* RIGHT — image fills */}
      <div className="relative min-h-[360px] w-full overflow-hidden lg:min-h-0">
        <img
          src="/images/260218 Food Hall Rendering_View_002 (1).webp"
          alt="The Center atrium"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
