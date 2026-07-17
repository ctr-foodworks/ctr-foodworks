import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * Custom 404. Renders under the ROOT layout (not the (site) route group), so it
 * imports NavBar + Footer directly to keep site chrome and internal links on
 * unknown URLs. Real HTTP 404 status is preserved by Next.
 */
export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="flex w-full flex-col">
        <section className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-[var(--bg-cream)] px-6 py-[120px] pt-[160px] text-center lg:px-[60px]">
          <div className="flex max-w-[640px] flex-col items-center gap-6">
            <Eyebrow tone="primary">404 — Page Not Found</Eyebrow>
            <DisplayHeading size="lg" className="text-[var(--text-dark)]">
              THIS PAGE
              <br />
              WANDERED OFF.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)] lg:text-[16px]">
              The page you&apos;re after doesn&apos;t exist — or has moved. Head
              back to the hall and pick up where you left off.
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
              <Link
                href="/events"
                className="inline-flex w-fit items-center gap-3 border border-[var(--text-dark)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
              >
                Events
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
