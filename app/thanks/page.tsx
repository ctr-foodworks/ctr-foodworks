import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export const metadata: Metadata = {
  title: "Thanks",
  description: "Your message landed at CTR Food Works — we'll be in touch.",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="flex w-full flex-col">
      <section className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-[var(--bg-cream)] px-6 py-[120px] text-center lg:px-[60px]">
        <div className="flex max-w-[640px] flex-col items-center gap-6">
          <Eyebrow tone="primary">Message Sent</Eyebrow>
          <DisplayHeading size="lg" className="text-[var(--text-dark)]">
            THANKS FOR
            <br />
            WRITING IN.
          </DisplayHeading>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)] lg:text-[16px]">
            Your note landed in our inbox. We&apos;ll get back to you within
            one business day — usually faster. In the meantime, take a look
            around.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-3 bg-[var(--primary)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
            >
              Back to Home
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/food-and-drinks"
              className="inline-flex w-fit items-center gap-3 border border-[var(--text-dark)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
            >
              See the Lineup
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
