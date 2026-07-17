import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { VendorGrid } from "@/components/marketing/VendorGrid";
import { BarFeature } from "@/components/marketing/BarFeature";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { Ticker } from "@/components/marketing/Ticker";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { vendors } from "@/lib/vendors";

export const metadata: Metadata = {
  title: "Food Hall & Restaurants in Downtown Atlanta",
  description:
    "Eleven chef-driven restaurants and the largest bar in Georgia under one roof in downtown Atlanta — from fried chicken and tacos to sushi, Szechuan, Cuban, and Italian.",
};

export default function DiningPage() {
  return (
    <main className="flex flex-col w-full">
      {/* §1 — Hero */}
      <PageHero
        eyebrow="The Dining Lineup"
        title={
          <>
            11 WAYS TO
            <br />
            BE HUNGRY.
          </>
        }
        description="Every kitchen at CTR Food Works is chef-driven and built around doing one thing better than anyone else."
        imageUrl="/images/CNN_Atrium Rendering_2026-01-09.jpg"
        imageAlt="CTR Food Works atrium rendering"
      />

      {/* §2 — Ticker */}
      <Ticker />

      {/* §3 — The Lineup intro. 2-col grid weighted slightly toward the
          right text column so body copy doesn't feel undersized next to the
          big display headline. */}
      <section className="w-full bg-[var(--bg-cream)] px-6 py-[80px] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-24 xl:max-w-[1600px] xl:gap-32">
          <div className="flex flex-col gap-5">
            <Eyebrow tone="primary">The Lineup</Eyebrow>
            <DisplayHeading size="md" className="text-[var(--text-dark)]">
              ELEVEN INDEPENDENT
              <br />
              KITCHENS.
              <br />
              ONE EXTRAORDINARY
              <br />
              BAR.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
          </div>
          <div className="flex flex-col justify-center gap-6 text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)] lg:text-[17px] xl:text-[18px]">
            <p>
              No franchises. No generic concepts. No food-court compromises. Every kitchen at CTR Food Works is selected for quality, personality, and craftsmanship — a collection of concepts ranging from hamburgers and cheesesteaks to comfort food, cocktails, and desserts.
            </p>
            <p>
              Order from one or all eleven. Stay for a quick bite or settle in for the night. CTR Food Works is built to be experienced your way.
            </p>
          </div>
        </div>
      </section>

      {/* §4 — The Grid */}
      <section className="w-full bg-[var(--bg-dark)] px-6 py-[80px] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto max-w-[1440px] xl:max-w-[1600px]">
          <VendorGrid vendors={vendors} columns={2} />
        </div>
      </section>

      {/* §5 — The Bar */}
      <BarFeature />

      {/* §6 — Curation principle. Wider container + larger type so this
          closing block feels substantial instead of lost in cream. */}
      <section className="w-full bg-[#e8e6e3] px-6 py-[100px] text-[var(--text-dark)] lg:px-[60px] lg:py-[140px] xl:py-[160px]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 xl:max-w-[1600px]">
          <Eyebrow tone="primary">Why these eleven</Eyebrow>
          <h2 className="font-display text-[48px] font-black uppercase leading-[0.95] tracking-[-1px] text-[var(--text-dark)] lg:text-[72px] xl:text-[88px]">
            ONE STANDARD.
            <br />
            ELEVEN ANSWERS.
          </h2>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="max-w-[820px] text-[16px] font-light leading-[1.8] text-[var(--text-muted-dark)] lg:text-[18px] xl:text-[20px]">
            Atlanta&apos;s food story is too big and too good to be told by one kitchen. So we picked eleven operators who already do their one thing better than almost anyone in the city — and gave them a stage with a great bar, a big room, and a downtown front door.
          </p>
        </div>
      </section>

      {/* §7 — CTA → visit */}
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
        tone="primary"
      />
    </main>
  );
}
