import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Newspaper,
  Briefcase,
  Handshake,
  Instagram,
  Facebook,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Get in touch with CTR Food Works — general inquiries, press, partnerships, and careers.",
};

type Contact = {
  icon: LucideIcon;
  label: string;
  detail: string;
  email: string;
};

const contacts: Contact[] = [
  {
    icon: Mail,
    label: "General",
    detail:
      "Questions about the hall, the vendors, the bar, or anything else — we read every note.",
    email: "hello@ctrfoodworks.com",
  },
  {
    icon: Newspaper,
    label: "Press",
    detail:
      "Stories, interviews, photo requests, and media credentials.",
    email: "press@ctrfoodworks.com",
  },
  {
    icon: Handshake,
    label: "Partnerships",
    detail:
      "Vendors, brand collaborations, sponsorships, and special activations.",
    email: "partners@ctrfoodworks.com",
  },
  {
    icon: Briefcase,
    label: "Careers",
    detail:
      "Opening-team roles across kitchens, the bar, and front-of-house.",
    email: "careers@ctrfoodworks.com",
  },
];

export default function ConnectPage() {
  return (
    <main className="flex flex-col w-full">
      {/* §1 — Hero */}
      <PageHero
        eyebrow="Connect"
        title={
          <>
            LET&rsquo;S TALK.
          </>
        }
        description="Press, partners, future teammates, and anyone with a question — here's how to reach us."
        imageUrl="/images/260218 Food Hall Rendering_View_002 (1).webp"
        imageAlt="CTR Food Works food hall rendering"
      />

      {/* §2 — Contact grid */}
      <section className="w-full bg-[#f9f4f0] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-12 lg:gap-16">
          <div className="flex flex-col gap-5 lg:max-w-[640px]">
            <Eyebrow tone="primary">Get in touch</Eyebrow>
            <DisplayHeading size="md" className="text-[var(--text-dark)]">
              FOUR WAYS IN.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
          </div>

          <ul className="grid grid-cols-1 gap-px bg-[var(--text-dark)]/15 sm:grid-cols-2">
            {contacts.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.label} className="bg-[#f9f4f0]">
                  <Link
                    href={`mailto:${c.email}`}
                    className="group flex h-full flex-col gap-4 p-8 lg:p-10"
                  >
                    <div className="flex h-11 w-11 items-center justify-center bg-[var(--bg-dark)] text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--text-muted-dark)]">
                        {c.label}
                      </span>
                      <h3 className="font-display text-[24px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)] lg:text-[28px]">
                        {c.email}
                      </h3>
                    </div>
                    <p className="text-[13px] font-light leading-[1.7] text-[var(--text-muted-dark)]">
                      {c.detail}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
                      Write
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* §3 — Socials */}
      <section className="w-full bg-[var(--bg-dark)] px-6 py-[80px] text-white lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1000px] flex flex-col gap-8 text-center">
          <Eyebrow tone="primary" className="self-center">
            Follow Along
          </Eyebrow>
          <DisplayHeading size="md" className="text-white">
            DAY ONE THROUGH OPENING.
          </DisplayHeading>
          <p className="mx-auto max-w-[520px] text-[15px] font-light leading-[1.8] text-white/65">
            Construction updates, vendor reveals, opening-event invitations, and the occasional behind-the-scenes from the team.
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex items-center gap-3 border border-white/30 px-6 py-3 transition-colors hover:bg-white hover:text-[var(--text-dark)]"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-[11px] font-semibold tracking-[3px] uppercase">
                Instagram
              </span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="group flex items-center gap-3 border border-white/30 px-6 py-3 transition-colors hover:bg-white hover:text-[var(--text-dark)]"
            >
              <Facebook className="h-5 w-5" />
              <span className="text-[11px] font-semibold tracking-[3px] uppercase">
                Facebook
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* §4 — Final CTA */}
      <CTAStrip
        eyebrow="Be the First to Know"
        title={
          <>
            Join the
            <br />
            list.
          </>
        }
        ctaHref="/#waitlist"
        ctaLabel="Join Us"
        tone="primary"
      />
    </main>
  );
}
