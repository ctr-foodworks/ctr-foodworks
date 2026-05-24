import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { PullQuote } from "@/components/marketing/PullQuote";
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
            ROOTED.
            <br />
            RESTORED.
            <br />
            ALIVE.
          </>
        }
        description="A historic landmark reimagined as a modern gathering place for food, culture, and community."
        imageUrl="/images/CNN_Atrium Rendering_2026-01-09.jpg"
        imageAlt="CTR Food Works atrium rendering"
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
            Located inside the <strong className="font-medium text-[var(--text-dark)]">reimagined former CNN Center</strong>, CTR Food Works transforms one of Atlanta&apos;s most recognizable landmarks into a lively culinary destination for locals and visitors alike. Developed in collaboration with <strong className="font-medium text-[var(--text-dark)]">CP Group</strong>, and led by the same visionary team behind <strong className="font-medium text-[var(--text-dark)]">Chattahoochee Food Works</strong> and its founder <strong className="font-medium text-[var(--text-dark)]">Robert Montwaid</strong>, CTR Food Works brings together a curated collection of chef-driven dining concepts, vibrant gathering spaces, and elevated hospitality experiences under one roof in the heart of downtown Atlanta.
          </p>
          <p className="max-w-[520px] text-[15px] font-light leading-[1.9] text-[var(--text-muted-dark)]">
            Guests can explore eleven diverse culinary concepts, meet friends at the bar, and experience the energy of Atlanta&apos;s evolving food scene in a dynamic destination designed for everyday dining, connection, celebration, and discovery.
          </p>
        </div>

        <div className="relative min-h-[400px] overflow-hidden lg:min-h-0">
          <img
            src="/images/S_Entry_02_hires-scaled.jpeg"
            alt="CTR Food Works entrance rendering"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <PullQuote
        quote="We’re taking a place that was once a symbol of Atlanta’s global voice and turning it into a platform for local talent, local flavor, and community connection. We’re honored to help with the transformation of this Atlanta landmark."
        attribution="Robert Montwaid"
      />

      <CTAStrip
        eyebrow="The Lineup"
        title={
          <>
            Meet the kitchens
            <br />
            and the bar.
          </>
        }
        ctaHref="/food-and-drinks"
        ctaLabel="See the Lineup"
        tone="dark"
      />
    </main>
  );
}
