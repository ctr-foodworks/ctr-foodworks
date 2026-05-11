import { WaitlistForm } from "./WaitlistForm";

export function SignupBreak() {
  return (
    <section id="waitlist" className="relative w-full overflow-hidden bg-[var(--primary)]">
      <div className="relative flex flex-col items-stretch lg:flex-row">
        {/* Left — bold statement */}
        <div className="flex flex-col justify-center gap-6 px-6 py-16 lg:w-[720px] lg:px-[60px] lg:py-[100px] xl:w-[800px]">
          <span className="text-[11px] font-semibold tracking-[6px] uppercase text-white/60">
            Atlanta · Spring 2026
          </span>
          <h2 className="break-words font-display text-[48px] font-black leading-[0.9] tracking-[-1px] text-white sm:text-[56px] lg:text-[72px] xl:text-[84px]">
            ENTERTAINMENT.
            <br />
            CULTURE.
            <br />
            COMMUNITY.
          </h2>
          <p className="max-w-[420px] text-[14px] font-light leading-[1.8] text-white/70">
            CTR Food Works sits at the center of Atlanta&apos;s downtown district, surrounded by major sports venues, cultural landmarks, and some of the city&apos;s most exciting destinations. Whether you&apos;re heading to a game, exploring the city, or meeting friends downtown, CTR Food Works is the perfect place to start — or end — the night.
          </p>
        </div>

        {/* Right — image */}
        <div className="relative min-h-[400px] overflow-hidden lg:flex-1">
          <img
            src="/images/S_Entry_02_hires-scaled.jpeg"
            alt="The Center atrium rendering"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Form strip below */}
      <div className="flex flex-col gap-8 bg-[var(--secondary-plum)] px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-[60px]">
        <div className="flex max-w-[480px] flex-col gap-1.5">
          <span className="text-[11px] font-semibold tracking-[5px] uppercase text-white/60">
            Join Us
          </span>
          <p className="text-[14px] font-light leading-[1.7] text-white/70">
            Opening events, brand activations, dining previews, and your invitation to opening night.
          </p>
        </div>

        <WaitlistForm variant="dark" buttonLabel="Join" />
      </div>
    </section>
  );
}
