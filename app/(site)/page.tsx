import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { About } from "@/components/About";
import { SignupBreak } from "@/components/SignupBreak";
import { LogoBands } from "@/components/marketing/LogoBands";
import { PullQuote } from "@/components/marketing/PullQuote";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Hero />
      <LogoBands />
      <Countdown />
      <About />
      {/* Plum pull-quote sits between the navy About panel and the red
          SignupBreak panel — acts as a dark "exhale" between the two
          colored slabs and re-centers the page rhythm. */}
      <PullQuote
        quote="A culinary destination built for everyday dining, celebration, and discovery — at the heart of Atlanta."
        attribution="CTR Food Works"
      />
      <SignupBreak />
    </main>
  );
}
