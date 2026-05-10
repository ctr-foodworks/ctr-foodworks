import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { About } from "@/components/About";
import { SignupBreak } from "@/components/SignupBreak";
import { Ticker } from "@/components/marketing/Ticker";
import { FifaBanner } from "@/components/marketing/FifaBanner";
import { VendorGrid } from "@/components/marketing/VendorGrid";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { featuredVendors } from "@/lib/vendors";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Hero />
      <Ticker />
      <Countdown />
      <About />
      <FifaBanner />

      <section className="w-full bg-[var(--bg-dark)] text-white">
        <div className="flex flex-col gap-6 px-6 pt-[80px] lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-[60px] lg:pt-[120px]">
          <div className="flex flex-col gap-4 lg:max-w-[640px]">
            <Eyebrow tone="dark" className="!text-[var(--secondary-ochre)]">
              The Dining Lineup
            </Eyebrow>
            <DisplayHeading size="lg" className="text-white">
              11 WAYS TO
              <br />
              BE HUNGRY.
            </DisplayHeading>
          </div>
          <p className="max-w-[360px] text-[14px] font-light leading-[1.8] text-white/55">
            Every kitchen at CTR Food Works is chef-driven, independently owned, and built around doing one thing better than anyone else. Here&apos;s a taste of the lineup.
          </p>
        </div>

        <div className="mt-12 px-0 lg:mt-16">
          <VendorGrid vendors={featuredVendors} columns={3} />
        </div>

        <div className="flex justify-center px-6 py-16 lg:py-20">
          <Link
            href="/dining"
            className="group inline-flex items-center gap-3 border border-white/30 px-7 py-4 transition-colors hover:bg-white hover:text-[var(--text-dark)]"
          >
            <span className="text-[11px] font-semibold tracking-[3px] uppercase">
              See All 12 Kitchens & The Bar
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <SignupBreak />
    </main>
  );
}
