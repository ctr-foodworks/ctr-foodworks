import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { events, type Event } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Buyouts, brand activations, and the calendar of what's happening at CTR Food Works in downtown Atlanta.",
};

const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatDateBlock(iso: string) {
  // Parse YYYY-MM-DD safely in UTC to avoid local-tz shifts
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return {
    month: monthNames[(m ?? 1) - 1],
    day: String(d ?? 1).padStart(2, "0"),
    year: String(y ?? 2026),
  };
}

function sortByDateAsc(a: Event, b: Event) {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

/**
 * Groups events by YYYY-MM key, preserving chronological order. Used to render
 * the Public Events list with month headers (Thierry: "calendar of sorts" like
 * thectratlanta.com's downtown ticker).
 */
function groupByMonth(evts: Event[]): Array<[string, Event[]]> {
  const groups: Record<string, Event[]> = {};
  for (const e of evts) {
    const [y, m] = e.date.split("T")[0].split("-");
    const key = `${y}-${m}`;
    (groups[key] ??= []).push(e);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default function EventsPage() {
  const upcoming = [...events].sort(sortByDateAsc);
  const grouped = groupByMonth(upcoming);

  return (
    <main className="flex flex-col w-full">
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
            inside the page instead of via header dropdown) */}
      <nav
        aria-label="Events sections"
        className="w-full border-b border-[var(--border-light)] bg-[var(--bg-warm-white)] px-6 lg:px-[60px]"
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap gap-x-8 gap-y-3 py-5">
          <a
            href="#private-events"
            className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:text-[var(--primary)]"
          >
            Private Events
          </a>
          <a
            href="#public-events"
            className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:text-[var(--primary)]"
          >
            Public Events
          </a>
        </div>
      </nav>

      {/* §2 — Private Events */}
      <section
        id="private-events"
        className="w-full scroll-mt-24 bg-[#f9f4f0] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]"
      >
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="primary">Private Events</Eyebrow>
            <DisplayHeading size="md" className="text-[var(--text-dark)]">
              BOOK YOUR EVENT
              <br />
              IN THE CENTER
              <br />
              OF IT ALL.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="max-w-[520px] text-[15px] font-light leading-[1.9] text-[var(--text-muted-dark)] lg:text-[16px]">
              Game-day buyouts. Brand activations. Conference dinners. Wedding receptions where the cocktail hour <em className="italic">is</em> the food hall itself. Tell us what you&apos;re throwing and we&apos;ll build the room around it.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* TODO: swap href="#" for the Tripleseat booking URL once Thierry sends it. */}
              <Link
                href="#"
                aria-label="Book a private event"
                className="group inline-flex w-fit items-center gap-3 bg-[var(--primary)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
              >
                Book
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="mailto:events@ctrfoodworks.com"
                className="inline-flex w-fit items-center gap-3 border border-[var(--text-dark)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
              >
                Or email us
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:border-l lg:border-[var(--text-dark)]/10 lg:pl-12">
            <Eyebrow tone="primary">What we host</Eyebrow>
            <ul className="flex flex-col">
              {[
                "Full venue buyouts",
                "Brand activations & launches",
                "Corporate dinners & conferences",
                "Wedding receptions & rehearsal dinners",
                "Game-day & match-day takeovers",
                "Milestone celebrations",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-6 border-b border-[var(--text-dark)]/10 py-3 text-[14px] font-light text-[var(--text-dark)] last:border-b-0"
                >
                  <span>{item}</span>
                  <span className="text-[var(--primary)]">→</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* §3 — Public Events (formerly "Calendar"). Month-grouped list inspired
            by thectratlanta.com's downtown ticker — gives the calendar feel
            without an external embed. Source: lib/events.ts (static data) */}
      <section
        id="public-events"
        className="w-full scroll-mt-24 bg-[var(--bg-dark)] px-6 py-[80px] text-white lg:px-[60px] lg:py-[120px]"
      >
        <div className="mx-auto max-w-[1200px] flex flex-col gap-10 lg:gap-14">
          <div className="flex flex-col gap-5 lg:max-w-[640px]">
            <Eyebrow tone="primary">Public Events</Eyebrow>
            <DisplayHeading size="md" className="text-white">
              UPCOMING AT CTR.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="text-[15px] font-light leading-[1.8] text-white/65 lg:text-[16px]">
              Openings, brand activations, live music, watch parties, and what&apos;s happening around downtown Atlanta — month by month.
            </p>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-[15px] font-light text-white/55">
              More to come. Follow us for updates.
            </p>
          ) : (
            <div className="flex flex-col gap-14">
              {grouped.map(([key, evts]) => {
                const [y, m] = key.split("-").map(Number);
                const monthLabel = `${monthNames[(m ?? 1) - 1]} ${y}`;
                return (
                  <div key={key} className="flex flex-col">
                    <h3 className="mb-6 border-b border-white/20 pb-3 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
                      {monthLabel}
                    </h3>
                    <ul className="flex flex-col">
                      {evts.map((evt) => {
                        const date = formatDateBlock(evt.date);
                        return (
                          <li
                            key={evt.slug}
                            className="grid grid-cols-1 gap-6 border-t border-white/10 py-8 first:border-t-0 first:pt-0 lg:grid-cols-[160px_1fr_auto] lg:items-center lg:gap-10"
                          >
                            {/* Date block */}
                            <div className="flex flex-col">
                              <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
                                {date.month}
                              </span>
                              <span className="font-display text-[56px] font-black leading-[0.95] tracking-[-2px] text-white lg:text-[64px]">
                                {date.day}
                              </span>
                              {evt.time && (
                                <span className="text-[11px] font-light tracking-[1px] uppercase text-white/45">
                                  {evt.time}
                                </span>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/45">
                                {evt.category}
                              </span>
                              <h4 className="font-display text-[24px] font-black uppercase leading-[1] tracking-[-0.5px] text-white lg:text-[28px]">
                                {evt.title}
                              </h4>
                              <p className="max-w-[560px] text-[14px] font-light leading-[1.7] text-white/65">
                                {evt.description}
                              </p>
                            </div>

                            {/* Optional CTA */}
                            {evt.ctaUrl && (
                              <Link
                                href={evt.ctaUrl}
                                className="group inline-flex w-fit items-center gap-3 self-start border border-white/30 px-5 py-3 text-[11px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-white hover:text-[var(--text-dark)] lg:self-auto"
                              >
                                {evt.ctaLabel ?? "Details"}
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
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
