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
      <PullQuote
        quote="A culinary destination built for everyday dining, celebration, and discovery — at the heart of Atlanta."
        attribution="CTR Food Works"
      />
      <About />
      <SignupBreak />
    </main>
  );
}
