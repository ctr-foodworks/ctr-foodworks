import type { Metadata } from "next";
import { Building2, MapPin, PartyPopper, Accessibility } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { HoursTable } from "@/components/marketing/HoursTable";
import { DetailRow } from "@/components/marketing/DetailRow";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "190 Marietta St. NW, Atlanta, GA — inside the reimagined former CNN Center. Hours, getting here, private events, and accessibility.",
};

export default function VisitPage() {
  return (
    <main className="flex flex-col w-full">
      <PageHero
        eyebrow="Plan Your Visit"
        title={
          <>
            190 MARIETTA
            <br />
            ST. NW,
            <br />
            ATLANTA.
          </>
        }
        description="Inside the reimagined former CNN Center — at the heart of Atlanta's downtown sports, culture, and entertainment district."
        imageUrl="/images/S_Entry_02_hires-scaled.jpeg"
        imageAlt="CTR Food Works entrance rendering"
      />

      <section className="grid w-full grid-cols-1 lg:grid-cols-2">
        {/* Hours — dark */}
        <div className="flex flex-col gap-8 bg-[var(--bg-dark)] px-6 py-[80px] text-white lg:px-[60px] lg:py-[120px]">
          <Eyebrow tone="dark" className="!text-[var(--secondary-ochre)]">
            Hours
          </Eyebrow>
          <DisplayHeading size="md" className="text-white">
            OPEN LATE.
            <br />
            READY EARLY.
          </DisplayHeading>
          <HoursTable />
          <p className="max-w-[420px] text-[12px] font-light leading-[1.7] text-white/40">
            Individual vendor hours may vary. CTR Bar stays open after the hall on weekends. Kitchen hours subject to change — follow us on social for daily updates.
          </p>
        </div>

        {/* Address + details — light */}
        <div
          id="getting-here"
          className="flex flex-col gap-8 bg-[var(--bg-cream)] px-6 py-[80px] lg:px-[60px] lg:py-[120px]"
        >
          <Eyebrow tone="primary">Find Us</Eyebrow>
          <DisplayHeading size="md" className="text-[var(--text-dark)]">
            DOWNTOWN
            <br />
            ATLANTA.
          </DisplayHeading>
          <p className="text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
            190 Marietta St. NW, Atlanta, GA 30303
          </p>

          <div className="flex flex-col">
            <DetailRow
              icon={Building2}
              title="The Venue"
              body="Inside the reimagined former CNN Center — one of Atlanta's most iconic downtown landmarks, transformed into a culinary and entertainment destination."
            />
            <DetailRow
              icon={MapPin}
              title="Getting Here"
              body="Centrally located near I-75/I-85. Steps from Mercedes-Benz Stadium, State Farm Arena, and CNN Center MARTA station. Ride-share drop-off at the main entrance."
            />
            <div id="private-events">
              <DetailRow
                icon={PartyPopper}
                title="Private Events & Activations"
                body="Buyouts, brand activations, and special celebrations welcome. Ideal for game-day gatherings, corporate dinners, and milestone moments. Request early access."
              />
            </div>
            <div id="accessibility">
              <DetailRow
                icon={Accessibility}
                title="Accessibility"
                body="Fully ADA-accessible throughout — all entrances, restrooms, and vendor stations designed to welcome every guest."
              />
            </div>
          </div>
        </div>
      </section>

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
