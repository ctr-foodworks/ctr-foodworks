import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Eyebrow } from "./ui/Eyebrow";
import { DisplayHeading } from "./ui/DisplayHeading";

export function Hero() {
  return (
    <section className="relative w-full bg-[var(--bg-warm-white)] lg:min-h-[100svh]">
      {/* Right-panel left edge aligns with the "Home" nav link above (~30% from
          viewport left at lg+). NavBar layout: logo at px-60, nav cluster
          centered via flex justify-between, "Home" is the first nav item. */}
      <div className="grid grid-cols-1 lg:min-h-[100svh] lg:grid-cols-[3fr_8fr]">
        {/* LEFT — statement panel. Inner cluster (max-w-[480px], ml-auto on lg+)
            anchors text to the RIGHT edge of this column so the headline sits
            close to the column boundary (= screen midline) on wide screens
            instead of drifting in the middle of the left third. */}
        <div className="relative flex min-h-[100svh] flex-col justify-between bg-[var(--bg-warm-white)] px-6 pb-14 pt-[110px] lg:min-h-0 lg:px-[60px] lg:pb-20 lg:pt-[140px] xl:px-[80px]">
          {/* Top — eyebrow */}
          <div className="flex flex-col gap-2 lg:ml-auto lg:w-full lg:max-w-[480px]">
            <Eyebrow tone="primary">Opening Spring 2026</Eyebrow>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
          </div>

          {/* Middle — headline + body + address */}
          <div className="flex flex-col gap-8 py-10 lg:ml-auto lg:w-full lg:max-w-[480px] lg:gap-10 lg:py-0">
            <DisplayHeading as="h1" size="lg">
              DOWNTOWN
              <br />
              ATLANTA&rsquo;S
              <br />
              FOOD HALL.
            </DisplayHeading>

            <p className="max-w-[440px] text-[15px] font-light leading-[1.7] text-[var(--text-muted-dark)] lg:text-[16px]">
              From morning coffee to evening cocktails, CTR Food Works brings together the city&apos;s best flavors and moments. More than a food hall, a place to gather and share.
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
          <div className="flex items-end pt-4 lg:ml-auto lg:w-full lg:max-w-[480px]">
            <img
              src="/logos/ctr-food-works_primary-black.svg"
              alt="CTR Food Works"
              className="h-20 w-20 lg:h-24 lg:w-24"
            />
          </div>
        </div>

        {/* RIGHT — image + waitlist CTA */}
        <div className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--bg-dark)] lg:min-h-0">
          <img
            src="/images/260218 Food Hall Rendering_View_002 (1).webp"
            alt="CTR Food Works atrium rendering"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Gradient — light at the very top (let the photo breathe) and
              heavy in the lower 60% where all the content lives so the
              headline + body copy read against the busy bar/dining area */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.9) 100%)",
            }}
          />

          <div className="relative z-10 flex h-full min-h-[100svh] flex-col justify-end gap-8 px-6 pt-[110px] pb-14 lg:min-h-0 lg:gap-10 lg:px-[60px] lg:pt-[140px] lg:pb-20 xl:px-[80px]">
            {/* Headline cluster — anchored to the bottom AND to the LEFT edge
                of this column (max-w-[560px]) so on 4K the JOIN US copy stays
                near the column boundary instead of drifting into the middle
                of the right two-thirds. */}
            <div className="flex flex-col gap-5 lg:w-full lg:max-w-[560px]">
              <Eyebrow tone="light">Opening Spring 2026</Eyebrow>
              <DisplayHeading
                as="h2"
                size="lg"
                className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              >
                JOIN US.
              </DisplayHeading>
              <div className="h-[2px] w-12 bg-[var(--primary)]" />
              <p className="max-w-[440px] text-[15px] font-normal leading-[1.7] text-white/95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] lg:text-[16px]">
                Get exclusive access to opening events, dining previews, and brand activations at Atlanta&apos;s reimagined landmark.
              </p>
            </div>

            {/* Single CTA button — scrolls to the SignupBreak section below */}
            <div className="lg:w-full lg:max-w-[560px]">
              <Link
                href="/#waitlist"
                className="group inline-flex items-center gap-3 bg-[var(--primary)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
              >
                Join Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
