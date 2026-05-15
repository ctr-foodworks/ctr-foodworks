import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { About } from "@/components/About";
import { SignupBreak } from "@/components/SignupBreak";
import { LogoBands } from "@/components/marketing/LogoBands";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { PullQuote } from "@/components/marketing/PullQuote";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Hero />
      <LogoBands />
      <Countdown />
      <PullQuote
        quote="A culinary destination built for everyday dining, celebration, and discovery — at the heart of Atlanta."
        attribution="CTR Food Works"
      />
      <About />
      <CTAStrip
        eyebrow="The Lineup"
        title={
          <>
            11 chef-driven kitchens.
            <br />
            1 extraordinary bar.
          </>
        }
        ctaHref="/food-and-drinks"
        ctaLabel="Meet the lineup"
        tone="grey"
      />
      <SignupBreak />
    </main>
  );
}
