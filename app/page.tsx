import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { About } from "@/components/About";
import { SneakPeek } from "@/components/SneakPeek";
import { SignupBreak } from "@/components/SignupBreak";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Hero />
      <Countdown />
      <About />
      <SneakPeek />
      <SignupBreak />
      <Footer />
    </main>
  );
}
