import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
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

      {/* Story — paired full-bleed. Text column anchors to right edge of its
          half (= screen midline on 4K) via flex justify-end + max-w-[640px]. */}
      <section className="grid w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex justify-start bg-[var(--bg-cream)] px-6 py-[80px] lg:justify-end lg:px-[60px] lg:py-[120px]">
          <div className="flex w-full flex-col gap-6 lg:max-w-[640px]">
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
          {/* Outbound CTA to the wider property site (per Thierry). External
              link → opens in a new tab. */}
          <a
            href="https://www.thectratlanta.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 inline-flex w-fit items-center gap-3 border border-[var(--text-dark)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
          >
            Explore the Building
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          </div>
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
