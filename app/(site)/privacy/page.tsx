import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CTR Food Works collects, uses, and protects the information you share through our website, contact forms, and newsletter.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="PRIVACY POLICY"
        description="How we handle the information you share with us."
      />
      <section className="w-full bg-white px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto max-w-[760px] space-y-8 text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
          <p>
            This Privacy Policy explains how CTR Food Works (&ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects and uses information
            when you visit ctrfoodworks.com or contact us.
          </p>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Information we collect</h2>
            <p>
              When you submit a contact or booking form or join our newsletter, we
              collect the details you provide — such as your name, email address,
              phone number, and message. We also collect standard, non-identifying
              analytics data (like pages visited and general location) to understand
              how the site is used.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">How we use your information</h2>
            <p>
              We use your information to respond to inquiries, process event and
              vendor requests, send updates you have asked to receive, and improve
              our website and events. We do not sell your personal information.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Cookies and analytics</h2>
            <p>
              We use cookies and analytics to measure traffic and improve the
              experience, and advertising cookies to measure our campaigns. You can
              control cookies through your browser settings.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Contact</h2>
            <p>
              Questions about this policy? Reach us through our{" "}
              <Link href="/connect" className="text-[var(--primary)] underline underline-offset-4">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
