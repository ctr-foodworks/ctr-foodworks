import { MapPin } from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg-warm-white)] lg:h-[100svh] lg:min-h-[760px]">
      <div className="grid grid-cols-1 lg:h-full lg:grid-cols-[5fr_7fr]">
        {/* LEFT — statement panel */}
        <div className="relative flex min-h-[100svh] flex-col justify-between bg-[var(--bg-warm-white)] px-6 pb-10 pt-[110px] lg:min-h-0 lg:px-[60px] lg:pb-12 lg:pt-[140px] xl:px-[80px]">
          {/* Top — eyebrow */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-semibold tracking-[5px] uppercase text-[var(--primary)]">
              Opening Spring 2026
            </span>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
          </div>

          {/* Middle — headline + body + address */}
          <div className="flex flex-col gap-8 py-10 lg:gap-10 lg:py-0">
            <h1 className="font-display text-[64px] font-black leading-[0.9] tracking-[-2px] text-[var(--text-dark)] sm:text-[80px] lg:text-[96px] xl:text-[112px]">
              Downtown
              <br />
              Atlanta&rsquo;s
              <br />
              Food Hall.
            </h1>

            <p className="max-w-[420px] text-[15px] font-light leading-[1.7] text-[var(--text-muted-dark)] lg:text-[16px]">
              11 chef-driven dining concepts and 1 extraordinary bar, inside the reimagined former CNN Center.
            </p>

            <div className="flex items-start gap-3 border-t border-[var(--border-light)] pt-6">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
              <span className="text-[14px] font-light leading-[1.55] text-[var(--text-dark)]">
                190 Marietta St. NW,
                <br />
                Atlanta, GA 30303
              </span>
            </div>
          </div>

          {/* Bottom — logo mark */}
          <div className="flex items-end pt-4">
            <img
              src="/logos/ctr-food-works_primary-black.svg"
              alt="CTR Food Works"
              className="h-20 w-20 lg:h-24 lg:w-24"
            />
          </div>
        </div>

        {/* RIGHT — image + waitlist overlay */}
        <div className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--bg-dark)] lg:min-h-0">
          <img
            src="/images/260218 Food Hall Rendering_View_002 (1).webp"
            alt="CTR Food Works atrium rendering"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-center gap-7 px-6 py-20 lg:px-[60px] lg:py-16 xl:px-[80px]">
            <h2 className="font-display text-[64px] font-black leading-[0.92] tracking-[-1.5px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-[80px] lg:text-[88px] xl:text-[104px]">
              JOIN THE
              <br />
              WAITLIST.
            </h2>

            <p className="text-[18px] font-light text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] lg:text-[22px]">
              Be the first to know.
            </p>

            <div className="h-[3px] w-12 bg-[var(--primary)]" />

            <div className="mt-2">
              <WaitlistForm
                variant="light"
                buttonLabel="Notify Me"
                className="shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
