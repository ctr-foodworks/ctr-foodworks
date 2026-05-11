import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { About } from "@/components/About";
import { SignupBreak } from "@/components/SignupBreak";
import { Ticker } from "@/components/marketing/Ticker";
import { FifaBanner } from "@/components/marketing/FifaBanner";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { PullQuote } from "@/components/marketing/PullQuote";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Hero />
      <Ticker />
      <Countdown />
      <PullQuote
        quote="A culinary destination built for everyday dining, celebration, and discovery — at the heart of Atlanta."
        attribution="CTR Food Works"
      />
      <About />
      <FifaBanner />
      <CTAStrip
        eyebrow="The Dining Lineup"
        title={
          <>
            11 chef-driven kitchens.
            <br />
            1 extraordinary bar.
          </>
        }
        ctaHref="/dining"
        ctaLabel="Meet the lineup"
        tone="grey"
      />
      <SignupBreak />
    </main>
  );
}
