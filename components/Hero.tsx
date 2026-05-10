import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg-warm-white)] lg:h-[100svh] lg:min-h-[760px]">
      <div className="flex flex-col lg:h-full lg:flex-row">
        {/* Left panel — brand + statement */}
        <div className="flex h-[100svh] w-full flex-col justify-between px-6 pb-12 pt-[100px] lg:h-full lg:w-[820px] lg:flex-shrink-0 lg:justify-end lg:gap-10 lg:px-[60px] lg:pb-[100px] lg:pt-[120px]">
          <div className="flex flex-col gap-7">
            <img
              src="/logos/ctr-food-works_primary-black.svg"
              alt="CTR Food Works"
              className="block w-full max-w-[460px]"
            />

            <div className="flex items-center gap-4">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              <span className="text-[12px] font-semibold tracking-[5px] uppercase text-[var(--primary)]">
                Opening Spring 2026
              </span>
            </div>

            <p className="font-display text-[26px] leading-[1.1] text-[var(--text-dark)] lg:text-[36px]">
              Downtown Atlanta&apos;s Food Hall.
            </p>

            <p className="max-w-[440px] text-[14px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
              11 chef-driven dining concepts and 1 extraordinary bar, inside the
              reimagined former CNN Center. Built for everyday dining,
              celebration, and discovery.
            </p>

            <div className="flex flex-col gap-1.5 pt-2">
              <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--text-muted-dark)]/70">
                Address
              </span>
              <span className="text-[13px] font-light text-[var(--text-dark)]">
                190 Marietta St. NW, Atlanta, GA 30303
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-px w-8 bg-[var(--primary)]" />
            <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--text-muted-dark)]">
              Scroll to explore
            </span>
          </div>
        </div>

        {/* Right panel — image + waitlist CTA */}
        <div className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--bg-dark)] lg:min-h-0 lg:flex-1">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 lg:opacity-30"
            style={{
              backgroundImage:
                "url('/images/260218 Food Hall Rendering_View_002 (1).webp')",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          <div className="relative flex h-full flex-col justify-end gap-8 px-6 pb-16 pt-24 lg:justify-center lg:px-[60px] lg:py-16">
            <span className="text-[10px] font-semibold tracking-[5px] uppercase text-white/55">
              Be the First to Know
            </span>

            <h2 className="max-w-[520px] font-display text-[56px] font-black leading-[0.88] text-white lg:text-[88px]">
              JOIN THE
              <br />
              WAITLIST.
            </h2>

            <div className="h-[2px] w-12 bg-[var(--primary)]" />

            <p className="max-w-[440px] text-[14px] font-light leading-[1.8] text-white/65">
              Get exclusive access to opening events, dining previews, and brand
              activations at Atlanta&apos;s reimagined landmark.
            </p>

            <WaitlistForm variant="dark" buttonLabel="Notify Me" />
          </div>
        </div>
      </div>
    </section>
  );
}
