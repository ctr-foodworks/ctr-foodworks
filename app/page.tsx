import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { About } from "@/components/About";
import { SignupBreak } from "@/components/SignupBreak";
import { Ticker } from "@/components/marketing/Ticker";
import { FifaBanner } from "@/components/marketing/FifaBanner";
import { CTAStrip } from "@/components/marketing/CTAStrip";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Hero />
      <Ticker />
      <Countdown />
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
        tone="dark"
      />
      <SignupBreak />
    </main>
  );
}
