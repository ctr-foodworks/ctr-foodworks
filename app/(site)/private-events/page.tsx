import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Users, Wine, Building2, PartyPopper, MapPin } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

const description =
  "Host private events at CTR Food Works in the former CNN Center in downtown Atlanta — game-day gatherings, corporate events, receptions, and brand activations with a full food hall and bar, steps from Mercedes-Benz Stadium and State Farm Arena.";

export const metadata: Metadata = {
  title: "Private Events & Venue Rental in Downtown Atlanta",
  description,
  openGraph: {
    title: "Private Events & Venue Rental · CTR Food Works",
    description,
  },
};

const occasions = [
  { icon: Trophy, title: "Game-Day Gatherings", copy: "Pre- and post-game parties a short walk from Mercedes-Benz Stadium and State Farm Arena." },
  { icon: Users, title: "Corporate & Team Events", copy: "Team dinners, offsites, and client gatherings in the heart of downtown." },
  { icon: Wine, title: "Receptions & Socials", copy: "Cocktail receptions and mixers with a full bar and food hall under one roof." },
  { icon: Building2, title: "Brand Activations", copy: "Launches and pop-ups in a landmark atrium built for energy and scale." },
  { icon: PartyPopper, title: "Celebrations", copy: "Birthdays, milestones, and get-togethers with something for every taste." },
  { icon: MapPin, title: "Central & Easy", copy: "A downtown address at the Centennial Park District that's simple for guests to reach." },
];

export default function PrivateEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Private Events · Downtown Atlanta"
        title={<>HOST IT<br />AT CTR.</>}
        description="From game-day parties to corporate receptions, CTR Food Works is a flexible private-event venue in the former CNN Center — the heart of downtown Atlanta's Centennial Park District."
        imageUrl="/images/CNN_Atrium Rendering_2026-01-09.jpg"
        imageAlt="The CTR Food Works atrium in the former CNN Center, downtown Atlanta"
      />

      <section className="w-full bg-white px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto max-w-[1440px] xl:max-w-[1600px]">
          <div className="flex max-w-[640px] flex-col gap-6">
            <Eyebrow tone="primary">Events We Host</Eyebrow>
            <DisplayHeading size="md" className="text-[var(--text-dark)]">
              BUILT FOR<br />A CROWD.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
              Tell us what you&apos;re bringing together, and we&apos;ll help make the
              space work for it.
            </p>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {occasions.map((o, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <o.icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[17px] font-semibold text-[var(--text-dark)]">{o.title}</h3>
                  <p className="text-[14px] font-light leading-[1.7] text-[var(--text-muted-dark)]">{o.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#e8e6e3] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20 xl:max-w-[1600px]">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="primary">The Space</Eyebrow>
            <DisplayHeading size="lg" className="text-[var(--text-dark)]">
              A LANDMARK<br />ATRIUM.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
          </div>
          <div className="flex flex-col gap-6 text-[var(--text-muted-dark)]">
            <p className="text-[17px] font-light leading-[1.7]">
              CTR Food Works sits inside the former CNN Center — the atrium that
              anchored decades of broadcast news is now a food hall and bar in the
              heart of downtown Atlanta. That scale and central location make it a
              natural fit for gatherings large and small.
            </p>
            <p className="text-[15px] font-light leading-[1.8]">
              Guests eat and drink from a full lineup of independent kitchens and a
              bar without leaving the room, and the Centennial Park District address
              keeps arrivals easy — a short walk from Mercedes-Benz Stadium, State
              Farm Arena, and the Georgia Aquarium.
            </p>
            <div className="pt-2">
              <Link
                href="/connect"
                className="inline-flex w-fit items-center justify-center bg-[var(--primary)] px-7 py-4 text-[12px] font-semibold uppercase tracking-[3px] text-white transition-opacity hover:opacity-90"
              >
                Request a Date
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[var(--bg-dark)] px-6 py-[80px] text-white lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 text-center xl:max-w-[1600px]">
          <DisplayHeading size="md" className="text-white">
            LET&apos;S PLAN<br />SOMETHING.
          </DisplayHeading>
          <p className="max-w-[520px] text-[15px] font-light leading-[1.8] text-white/55">
            Share the date, the headcount, and what you&apos;re going for, and
            we&apos;ll take it from there.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center justify-center border border-white px-7 py-4 text-[12px] font-semibold uppercase tracking-[3px] text-white transition-colors hover:bg-white hover:text-[var(--text-dark)]"
          >
            Start Your Inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
