import type { Metadata } from "next";
import {
  Mail,
  Newspaper,
  Briefcase,
  Handshake,
  Instagram,
  Facebook,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Get in touch with CTR Food Works — general inquiries, press, partnerships, and careers.",
};

// Category legend on the left of the contact section. The form itself
// (ContactForm, client component) handles the submission via AJAX to
// Netlify Forms so the user never leaves the page.
type Category = {
  icon: LucideIcon;
  label: string;
  detail: string;
};

const categories: Category[] = [
  {
    icon: Mail,
    label: "General",
    detail:
      "Questions about the hall, the vendors, the bar, or anything else — we read every note.",
  },
  {
    icon: Newspaper,
    label: "Press",
    detail: "Stories, interviews, photo requests, and media credentials.",
  },
  {
    icon: Handshake,
    label: "Partnerships",
    detail:
      "Vendors, brand collaborations, sponsorships, and special activations.",
  },
  {
    icon: Briefcase,
    label: "Careers",
    detail:
      "Opening-team roles across kitchens, the bar, and front-of-house.",
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

      {/* §2 — Contact form (Netlify Forms) + category legend */}
      <section className="w-full bg-[#f9f4f0] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto flex max-w-[1440px] xl:max-w-[1600px] flex-col gap-12 lg:gap-16">
          <div className="flex flex-col gap-5 lg:max-w-[640px]">
            <Eyebrow tone="primary">Get in touch</Eyebrow>
            <DisplayHeading size="md" className="text-[var(--text-dark)]">
              FOUR WAYS IN.
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)] lg:text-[16px]">
              One inbox, one quick reply. Pick a category and tell us what&apos;s on your mind — we read every note.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            {/* Left — category legend */}
            <ul className="flex flex-col gap-7">
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-[var(--bg-dark)] text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]">
                        {c.label}
                      </span>
                      <p className="text-[13px] font-light leading-[1.6] text-[var(--text-muted-dark)]">
                        {c.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Right — contact form, AJAX'd to Netlify Forms so submission
                stays on this page. See components/marketing/ContactForm.tsx. */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* §3 — Socials */}
      <section className="w-full bg-[var(--bg-dark)] px-6 py-[80px] text-white lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1440px] xl:max-w-[1600px] flex flex-col gap-8 text-center">
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
              href="https://www.instagram.com/ctrfoodworks/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CTR Food Works on Instagram"
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
