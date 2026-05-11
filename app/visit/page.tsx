import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { HoursTable } from "@/components/marketing/HoursTable";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { SketchPlaceholder } from "@/components/marketing/SketchPlaceholder";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "190 Marietta St. NW, Atlanta, GA — inside the reimagined former CNN Center. Hours, getting here, private events, and accessibility.",
};

const SKETCH_BUILDING_PROMPT = `Architectural pencil sketch of a large multi-story modern building exterior, the reimagined former CNN Center in downtown Atlanta. Glass and steel facade with horizontal banding, a wide atrium entrance, set against a clean white background. Fine pencil lines, structural shading on the facade, no human figures, no text, no signage, no color. Hand-drawn architectural rendering style, like a vintage architect's perspective sketch. White background. 4:5 portrait aspect.`;

const SKETCH_MAP_PROMPT = `Hand-drawn pencil illustration of a downtown Atlanta street map, top-down perspective, sparse linework on a white background. Show a grid of streets and blocks with four labeled landmarks rendered as small sketched icons: "Mercedes-Benz Stadium" (southwest corner), "State Farm Arena" (northwest), "Centennial Olympic Park" (center, drawn as a green square with the Olympic rings), and a star marked "CTR Food Works · 190 Marietta St. NW" near the center. Vintage cartographer / urban planner style, black pencil on white paper, fine linework, no color, no shading washes. 3:2 landscape.`;

const SKETCH_ATRIUM_PROMPT = `Architectural pencil sketch of a multi-level indoor atrium / food hall interior. Skylit ceiling, mezzanine balconies on two upper floors, large trees and hanging plants, scattered modern dining tables and chairs on the ground floor. Hand-drawn perspective from one corner looking across the space. Fine pencil linework with light structural shading on columns and railings. No people, no text, no signage, no color. White background. 3:2 landscape aspect, vintage architectural rendering style.`;

const SKETCH_ICON_PROMPT_BASE = `Single hand-drawn pencil icon on a clean white background, simple line art, no shading, no text, no color. Children's-book illustration simplicity, ~3-4 lines of contour only. Square aspect. Subject:`;

type TransitMode = {
  slug: string;
  label: string;
  detail: string;
  iconSubject: string;
};

const transitModes: TransitMode[] = [
  {
    slug: "walk",
    label: "Walk",
    detail:
      "Mercedes-Benz Stadium (8 min) · State Farm Arena (5 min) · Centennial Park (3 min)",
    iconSubject: "a pair of walking shoes mid-stride",
  },
  {
    slug: "marta",
    label: "MARTA",
    detail: "CNN Center / GWCC station, two blocks east",
    iconSubject: "a short train carriage on a single rail",
  },
  {
    slug: "rideshare",
    label: "Ride-share",
    detail: "Uber and Lyft drop off at the Marietta entrance",
    iconSubject: "a small sedan with the doors closed, three-quarter view",
  },
  {
    slug: "drive",
    label: "Drive",
    detail:
      "Parking decks at the Omni and across Centennial Olympic Park",
    iconSubject: "a parking sign with the letter P inside a circle",
  },
];

export default function VisitPage() {
  return (
    <main className="flex flex-col w-full">
      {/* §1 — Hero */}
      <PageHero
        eyebrow="Find Us · Downtown Atlanta"
        title={
          <>
            190 MARIETTA
            <br />
            ST. NW,
            <br />
            ATLANTA.
          </>
        }
        description="Inside the reimagined former CNN Center — at the corner of Marietta and Centennial Olympic Park Drive. Walk in from the world."
        imageUrl="/images/S_Entry_02_hires-scaled.jpeg"
        imageAlt="CTR Food Works entrance rendering"
      />

      {/* §2 — The Building (cream, image left + text right) */}
      <section className="grid w-full grid-cols-1 bg-[var(--bg-cream)] lg:grid-cols-2">
        <div className="order-1 p-6 lg:order-1 lg:p-[60px] lg:py-[120px]">
          <SketchPlaceholder
            src="/images/sketches/building-exterior.png"
            alt="Hand-drawn sketch of the CTR Food Works building exterior"
            prompt={SKETCH_BUILDING_PROMPT}
            aspect="portrait"
          />
        </div>
        <div className="order-2 flex flex-col justify-center gap-6 px-6 pb-[80px] lg:order-2 lg:px-[60px] lg:py-[120px]">
          <Eyebrow tone="primary">The Building</Eyebrow>
          <DisplayHeading size="md" className="text-[var(--text-dark)]">
            A LANDMARK
            <br />
            REOPENED
            <br />
            FOR EATING.
          </DisplayHeading>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="max-w-[480px] text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
            The former CNN Center hosted presidents, prime ministers, and a quarter-century of breaking news. The atrium that anchored 30 years of broadcast journalism is now the dining room you came for.
          </p>
        </div>
      </section>

      {/* §3 — Hours (dark) */}
      <section className="w-full bg-[var(--bg-dark)] px-6 py-[80px] text-white lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="dark" className="!text-[var(--secondary-ochre)]">
              Hours
            </Eyebrow>
            <DisplayHeading size="md" className="text-white">
              OPEN LATE.
              <br />
              READY EARLY.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="max-w-[420px] text-[14px] font-light leading-[1.7] text-white/55">
              Individual kitchens may vary. The bar pours through last call on weekends. Follow us on social for daily updates.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <HoursTable />
          </div>
        </div>
      </section>

      {/* §4 — Getting Here (grey, 4-up grid) */}
      <section
        id="getting-here"
        className="w-full bg-[#e8e6e3] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:gap-16">
          <div className="flex flex-col gap-5 lg:max-w-[640px]">
            <Eyebrow tone="primary">Getting Here</Eyebrow>
            <DisplayHeading size="md" className="text-[var(--text-dark)]">
              EVERY WAY IN.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
          </div>

          <div className="grid grid-cols-1 gap-px bg-[var(--text-dark)]/15 sm:grid-cols-2 lg:grid-cols-4">
            {transitModes.map((mode) => (
              <article
                key={mode.slug}
                className="flex flex-col gap-5 bg-[#e8e6e3] p-6 lg:p-8"
              >
                <div className="aspect-square w-[100px] lg:w-[120px]">
                  <SketchPlaceholder
                    src={`/images/sketches/getting-here-${mode.slug}.png`}
                    alt={`Hand-drawn icon: ${mode.label}`}
                    prompt={`${SKETCH_ICON_PROMPT_BASE} ${mode.iconSubject}.`}
                    aspect="square"
                    className="!bg-transparent border-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-[24px] font-black uppercase leading-[0.95] tracking-[-0.5px] text-[var(--text-dark)] lg:text-[28px]">
                    {mode.label}
                  </h3>
                  <p className="text-[13px] font-light leading-[1.6] text-[var(--text-muted-dark)]">
                    {mode.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* §5 — The Neighborhood (cream, text left + map right) */}
      <section className="grid w-full grid-cols-1 bg-[var(--bg-cream)] lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center gap-6 px-6 pb-[80px] lg:order-1 lg:px-[60px] lg:py-[120px]">
          <Eyebrow tone="primary">The Neighborhood</Eyebrow>
          <DisplayHeading size="md" className="text-[var(--text-dark)]">
            AT THE
            <br />
            CENTER OF
            <br />
            IT ALL.
          </DisplayHeading>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="max-w-[480px] text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
            World Cup matches. NBA playoffs. SEC championships. Concerts at State Farm Arena. CTR sits inside the cluster — order food, walk out, catch the game, walk back.
          </p>
        </div>
        <div className="order-1 p-6 lg:order-2 lg:p-[60px] lg:py-[120px]">
          <SketchPlaceholder
            src="/images/sketches/downtown-map.png"
            alt="Hand-drawn map of downtown Atlanta showing CTR Food Works and nearby landmarks"
            prompt={SKETCH_MAP_PROMPT}
            aspect="landscape"
          />
        </div>
      </section>

      {/* §6 — Private Events (dark, text left + atrium sketch right) */}
      <section
        id="private-events"
        className="grid w-full grid-cols-1 bg-[var(--bg-dark)] text-white lg:grid-cols-2"
      >
        <div className="order-2 flex flex-col justify-center gap-6 px-6 pb-[80px] lg:order-1 lg:px-[60px] lg:py-[120px]">
          <Eyebrow tone="light" className="!text-[var(--secondary-ochre)]">
            Private Events
          </Eyebrow>
          <DisplayHeading size="md" className="text-white">
            BUY OUT
            <br />
            THE WHOLE
            <br />
            DAMN PLACE.
          </DisplayHeading>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="max-w-[480px] text-[15px] font-light leading-[1.8] text-white/65">
            Game-day buyouts. Brand activations. Conference dinners. Wedding receptions where the cocktail hour <em className="italic">is</em> the food hall itself. Tell us what you&apos;re throwing and we&apos;ll build the room around it.
          </p>
          <Link
            href="mailto:events@ctrfoodworks.com"
            className="group inline-flex w-fit items-center gap-3 border border-white/30 px-6 py-3 transition-colors hover:bg-white hover:text-[var(--text-dark)]"
          >
            <span className="text-[11px] font-semibold tracking-[3px] uppercase">
              Inquire about events
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="order-1 p-6 lg:order-2 lg:p-[60px] lg:py-[120px]">
          <SketchPlaceholder
            src="/images/sketches/atrium-interior.png"
            alt="Hand-drawn sketch of the CTR Food Works atrium interior"
            prompt={SKETCH_ATRIUM_PROMPT}
            aspect="landscape"
          />
        </div>
      </section>

      {/* §7 — Accessibility (grey, simpler) */}
      <section
        id="accessibility"
        className="w-full bg-[#e8e6e3] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]"
      >
        <div className="mx-auto flex max-w-[860px] flex-col gap-6">
          <Eyebrow tone="primary">Accessibility</Eyebrow>
          <DisplayHeading size="md" className="text-[var(--text-dark)]">
            EVERY GUEST.
            <br />
            EVERY ENTRANCE.
          </DisplayHeading>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="max-w-[640px] text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
            ADA-accessible throughout — every entrance, restroom, kitchen, and seating section. If you need anything specific to make your visit work, let us know in advance and we&apos;ll arrange it.
          </p>
        </div>
      </section>

      {/* §8 — Final CTA */}
      <CTAStrip
        eyebrow="Be the First to Know"
        title={
          <>
            Join the
            <br />
            waitlist.
          </>
        }
        ctaHref="/#waitlist"
        ctaLabel="Get Early Access"
        tone="primary"
      />
    </main>
  );
}
