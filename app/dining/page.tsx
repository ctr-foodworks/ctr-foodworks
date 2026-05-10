import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { VendorGrid } from "@/components/marketing/VendorGrid";
import { BarFeature } from "@/components/marketing/BarFeature";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { Ticker } from "@/components/marketing/Ticker";
import { vendors } from "@/lib/vendors";

export const metadata: Metadata = {
  title: "Dining",
  description:
    "Eleven chef-driven kitchens and one extraordinary bar. Meet the lineup at CTR Food Works.",
};

export default function DiningPage() {
  return (
    <main className="flex flex-col w-full">
      <PageHero
        eyebrow="The Dining Lineup"
        title={
          <>
            11 WAYS TO
            <br />
            BE HUNGRY.
          </>
        }
        description="Every kitchen at CTR Food Works is chef-driven, independently owned, and built around doing one thing better than anyone else."
        imageUrl="/images/CNN_Atrium Rendering_2026-01-09.jpg"
        imageAlt="CTR Food Works atrium rendering"
      />
      <Ticker />

      <section className="w-full bg-[var(--bg-dark)]">
        <VendorGrid vendors={vendors} columns={3} />
      </section>

      <BarFeature />

      <CTAStrip
        eyebrow="Plan Your Visit"
        title={
          <>
            Open late.
            <br />
            Ready early.
          </>
        }
        ctaHref="/visit"
        ctaLabel="Hours & Location"
        tone="plum"
      />
    </main>
  );
}
