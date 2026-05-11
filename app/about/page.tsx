import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { FifaBanner } from "@/components/marketing/FifaBanner";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { PullQuote } from "@/components/marketing/PullQuote";
import { Countdown } from "@/components/Countdown";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "CTR Food Works transforms the former CNN Center into a chef-driven food hall at the heart of downtown Atlanta.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col w-full">
      <PageHero
        eyebrow="About CTR Food Works"
        title={
          <>
            FOOD.
            <br />
            ENERGY.
            <br />
            CONNECTION.
          </>
        }
        description="A culinary destination built for everyday dining, celebration, and discovery — at the heart of Atlanta."
        imageUrl="/images/260218 Food Hall Rendering_View_002 (1).webp"
        imageAlt="CTR Food Works food hall rendering"
      />

      {/* Story */}
      <section className="grid w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col gap-6 bg-[var(--bg-cream)] px-6 py-[80px] lg:px-[60px] lg:py-[120px]">
          <Eyebrow tone="primary">The Story</Eyebrow>
          <DisplayHeading size="md" className="text-[var(--text-dark)]">
            A LANDMARK,
            <br />
            REIMAGINED.
          </DisplayHeading>
          <p className="max-w-[520px] text-[15px] font-light leading-[1.9] text-[var(--text-muted-dark)]">
            Located inside the <strong className="font-medium text-[var(--text-dark)]">reimagined former CNN Center</strong>, CTR Food Works transforms one of Atlanta&apos;s most recognizable landmarks into a lively culinary destination for locals and visitors alike.
          </p>
          <p className="max-w-[520px] text-[15px] font-light leading-[1.9] text-[var(--text-muted-dark)]">
            Guests can explore eleven diverse, chef-driven dining concepts, meet friends at the bar, and experience the energy of Atlanta&apos;s evolving food scene — all under one roof in the heart of downtown.
          </p>
          <p className="max-w-[520px] text-[15px] font-light leading-[1.9] text-[var(--text-muted-dark)]">
            With major events like the <strong className="font-medium text-[var(--text-dark)]">FIFA World Cup 2026™</strong> on the horizon, CTR Food Works is poised to become a central gathering place — a destination built for everyday dining, celebration, and discovery.
          </p>
        </div>

        <div className="relative min-h-[400px] overflow-hidden lg:min-h-0">
          <img
            src="/images/CNN_Atrium Rendering_2026-01-09.jpg"
            alt="Atrium rendering"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <Countdown />

      <PullQuote
        quote="A culinary destination built for everyday dining, celebration, and discovery — at the heart of Atlanta."
        attribution="CTR Food Works"
      />

      <FifaBanner />

      <CTAStrip
        eyebrow="The Lineup"
        title={
          <>
            Meet the kitchens
            <br />
            and the bar.
          </>
        }
        ctaHref="/dining"
        ctaLabel="See the Lineup"
        tone="dark"
      />
    </main>
  );
}
