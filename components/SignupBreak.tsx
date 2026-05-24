import { WaitlistForm } from "./WaitlistForm";

/**
 * Home page "Entertainment / Culture / Community" panel + waitlist signup.
 *
 * Mirrors <About /> above: image LEFT, red panel RIGHT (text anchored to
 * the LEFT edge of its column = screen midline on wide screens). The
 * WaitlistForm lives inside the red panel directly instead of a separate
 * plum strip below, which collapses what used to be two stacked sections
 * into one cohesive rhythm with the blue About panel above.
 *
 * Section anchor id="waitlist" is kept so existing nav/footer/CTA links to
 * /#waitlist still scroll here.
 */
export function SignupBreak() {
  return (
    <section
      id="waitlist"
      className="grid w-full bg-[var(--primary)] lg:min-h-[680px] lg:grid-cols-2"
    >
      {/* LEFT — image fills (mirrored from About) */}
      <div className="relative min-h-[360px] w-full overflow-hidden lg:min-h-0 lg:order-1">
        <img
          src="/images/S_Entry_02_hires-scaled.jpeg"
          alt="The Center atrium rendering"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* RIGHT — red text + form, anchored to the LEFT edge of its column.
          max-w widens at xl+ so headline gets to breathe on wide screens. */}
      <div className="flex justify-start px-6 py-16 lg:order-2 lg:px-[60px] lg:py-[100px] xl:px-[80px]">
        <div className="flex w-full flex-col gap-7 lg:max-w-[640px] xl:max-w-[720px]">
          <span className="text-[11px] font-semibold tracking-[6px] uppercase text-white/60">
            Atlanta · Spring 2026
          </span>
          <h2 className="break-words font-display text-[48px] font-black leading-[0.9] tracking-[-1px] text-white sm:text-[56px] lg:text-[72px] xl:text-[88px]">
            ENTERTAINMENT.
            <br />
            CULTURE.
            <br />
            COMMUNITY.
          </h2>
          <div className="h-px w-10 bg-white/40" />
          <p className="text-[14px] font-light leading-[1.8] text-white/75 lg:text-[15px]">
            CTR Food Works sits at the center of Atlanta&apos;s downtown district, surrounded by major sports venues, cultural landmarks, and some of the city&apos;s most exciting destinations. Whether you&apos;re heading to a game, exploring the city, or meeting friends downtown, CTR Food Works is the perfect place to start — or end — the night.
          </p>

          {/* Waitlist signup — absorbed into the red panel */}
          <div className="mt-2 flex flex-col gap-3">
            <span className="text-[11px] font-semibold tracking-[5px] uppercase text-white/65">
              Join Us
            </span>
            <p className="max-w-[440px] text-[13px] font-light leading-[1.7] text-white/70">
              Opening events, brand activations, dining previews, and your invitation to opening night.
            </p>
            <WaitlistForm variant="dark" buttonLabel="Join" showHelper={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
