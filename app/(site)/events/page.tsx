import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { EventsCarousel } from "@/components/marketing/EventsCarousel";
import { HostingShowcase } from "@/components/marketing/HostingShowcase";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { getPublicEvents } from "@/lib/events-db";
import { catering } from "@/lib/catering";
import { BookingModal } from "@/components/marketing/BookingModal";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_URL,
  BUSINESS,
  BUSINESS_ID,
  absoluteUrl,
  postalAddress,
} from "@/lib/business";

export const metadata: Metadata = {
  title: "Events & Private Event Venue, Downtown Atlanta",
  description:
    "A private event venue and public event calendar at CTR Food Works in downtown Atlanta — full buyouts, game-day takeovers, brand activations, and private dining.",
};

// Rebuild at most every 5 minutes; the admin also calls revalidatePath('/events')
// on every save, so edits appear within seconds rather than waiting for this.
export const revalidate = 300;

export default async function EventsPage() {
  // Public events drive the carousel (fetched from the DB, or the static seed
  // when the DB isn't provisioned yet). Private inquiries live in their own
  // section below (with the Tripleseat booking form).
  const publicEvents = await getPublicEvents();

  // Event structured data — one node per upcoming public event, located at the
  // hall (referencing the FoodEstablishment @id from the site layout). Free-form
  // time strings aren't machine-parseable, so startDate is the (all-day) date to
  // avoid emitting a wrong UTC offset. Offers appear only when a ticket/RSVP URL
  // exists.
  const eventsJsonLd =
    publicEvents.length > 0
      ? {
          "@context": "https://schema.org",
          "@graph": publicEvents.map((evt) => ({
            "@type": "Event",
            name: evt.title,
            startDate: evt.date,
            ...(evt.endDate ? { endDate: evt.endDate } : {}),
            description: evt.description,
            ...(evt.imageUrl
              ? {
                  image: evt.imageUrl.startsWith("http")
                    ? evt.imageUrl
                    : absoluteUrl(evt.imageUrl),
                }
              : {}),
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "FoodEstablishment",
              "@id": BUSINESS_ID,
              name: BUSINESS.name,
              address: postalAddress(),
            },
            organizer: {
              "@type": "Organization",
              name: BUSINESS.name,
              url: SITE_URL,
            },
            ...(evt.ctaUrl
              ? {
                  offers: {
                    "@type": "Offer",
                    url: evt.ctaUrl,
                    availability: "https://schema.org/InStock",
                  },
                }
              : {}),
          })),
        }
      : null;

  return (
    <main className="flex flex-col w-full">
      {eventsJsonLd && <JsonLd data={eventsJsonLd} />}
      {/* §1 — Hero */}
      <PageHero
        eyebrow="Events · Atlanta"
        title={
          <>
            GATHER.
            <br />
            HOST.
            <br />
            CELEBRATE.
          </>
        }
        description="Private buyouts. Game-day takeovers. Brand activations. And a running calendar of what's happening inside the hall."
        imageUrl="/images/S_Entry_02_hires-scaled.jpeg"
        imageAlt="CTR Food Works entrance rendering"
      />

      {/* §1b — In-page sub-nav (Thierry: navigate between the two sections
            inside the page instead of via header dropdown). Public first,
            matching the section order below. */}
      <nav
        aria-label="Events sections"
        className="w-full border-b border-[var(--border-light)] bg-[var(--bg-warm-white)] px-6 lg:px-[60px]"
      >
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-3 py-5 xl:max-w-[1600px]">
          <a
            href="#public-events"
            className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:text-[var(--primary)]"
          >
            Public Events
          </a>
          <a
            href="#private-events"
            className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:text-[var(--primary)]"
          >
            Private Events
          </a>
        </div>
      </nav>

      {/* §2 — Public Events. Carousel of background-image slides, one per
            event (data: lib/events.ts, category === "public"). The carousel
            bleeds full width but self-aligns its content to the same shell
            margin as the hero. */}
      <section
        id="public-events"
        className="w-full scroll-mt-24 bg-[var(--bg-warm-white)] pt-[80px] text-[var(--text-dark)] lg:pt-[120px]"
      >
        {/* Header — padding on the outer wrapper, shell centered inside (no
            inner padding) so the left edge matches the hero / sub-nav exactly. */}
        <div className="px-6 lg:px-[60px]">
          <div className="mx-auto max-w-[1440px] xl:max-w-[1600px]">
            <div className="mb-10 flex max-w-[640px] flex-col gap-5 lg:mb-14">
              <Eyebrow tone="primary">Public Events</Eyebrow>
              <DisplayHeading size="md" className="text-[var(--text-dark)]">
                UPCOMING AT CTR.
              </DisplayHeading>
              <div className="h-[2px] w-12 bg-[var(--primary)]" />
              <p className="text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)] lg:text-[16px]">
                Openings, brand activations, live music, watch parties, and what&apos;s happening around downtown Atlanta — month by month.
              </p>
            </div>
          </div>
        </div>

        {publicEvents.length === 0 ? (
          <div className="px-6 lg:px-[60px]">
            <div className="mx-auto max-w-[1440px] xl:max-w-[1600px]">
              <p className="text-[15px] font-light text-[var(--text-muted-dark)]">
                More to come. Follow us for updates.
              </p>
            </div>
          </div>
        ) : (
          <EventsCarousel events={publicEvents} />
        )}
      </section>

      {/* §3 — Private Events. Padding lives on the section; the inner shell is
            centered with no own padding so content aligns to the hero margin. */}
      <section
        id="private-events"
        className="w-full scroll-mt-24 bg-[#f9f4f0] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]"
      >
        <div className="mx-auto max-w-[1440px] xl:max-w-[1600px]">
          {/* Intro — pitch + CTAs */}
          <div className="flex max-w-[760px] flex-col gap-6">
            <Eyebrow tone="primary">Private Events</Eyebrow>
            <h2 className="font-display text-[48px] font-black uppercase leading-[0.95] tracking-[-1px] text-[var(--text-dark)] lg:text-[72px] xl:text-[88px]">
              BOOK YOUR EVENT
              <br />
              IN THE CENTER
              <br />
              OF IT ALL.
            </h2>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="max-w-[560px] text-[16px] font-light leading-[1.9] text-[var(--text-muted-dark)] lg:text-[17px] xl:text-[18px]">
              Game-day buyouts. Brand activations. Conference dinners. Wedding receptions where the cocktail hour <em className="italic">is</em> the food hall itself. Tell us what you&apos;re throwing and we&apos;ll build the room around it.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Opens the Tripleseat booking form in a modal (form loads on
                  intent, not inline on the page). */}
              <BookingModal label="Book" />
              {/* Routes to the /connect contact form (Netlify-backed) instead
                  of opening the visitor's mail client. Per Thierry — both
                  secondary CTAs across the site should land in a form. */}
              <Link
                href="/connect#contact"
                className="inline-flex w-fit items-center gap-3 border border-[var(--text-dark)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
              >
                Or send a message
              </Link>
            </div>
          </div>

          {/* What We Host — sticky heading + scroll-revealed timeline */}
          <div className="mt-16 border-t border-[var(--text-dark)]/10 pt-12 lg:mt-24 lg:pt-20">
            <HostingShowcase />
          </div>

          {/* Catering Kitchen — back-of-house service, surfaced here so
              private-event inquirers can also book catering (lib/catering.ts). */}
          <div className="mt-16 border-t border-[var(--text-dark)]/10 pt-12 lg:mt-24 lg:pt-16">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:items-center lg:gap-16">
              <div className="flex items-center justify-center bg-white p-5 lg:p-6">
                <img
                  src={catering.logoUrl}
                  alt={`${catering.name} logo`}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full max-w-[180px]"
                />
              </div>
              <div className="flex flex-col gap-5">
                <Eyebrow tone="primary">Also Available</Eyebrow>
                <h3 className="font-display text-[28px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)] lg:text-[36px]">
                  {catering.name}
                </h3>
                <div className="h-[2px] w-12 bg-[var(--primary)]" />
                <p className="max-w-[640px] text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
                  {catering.description}
                </p>
                <Link
                  href={catering.inquireMailto}
                  className="group inline-flex w-fit items-center gap-3 border border-[var(--text-dark)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
                >
                  Inquire about catering
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* §4 — Final CTA */}
      <CTAStrip
        eyebrow="Stay in the Loop"
        title={
          <>
            Be first to hear
            <br />
            what&apos;s next.
          </>
        }
        ctaHref="/#waitlist"
        ctaLabel="Join Us"
        tone="primary"
      />
    </main>
  );
}
