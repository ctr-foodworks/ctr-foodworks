import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the CTR Food Works website, including content, events, and third-party links.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="TERMS OF SERVICE"
        description="The terms that govern your use of this website."
      />
      <section className="w-full bg-white px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto max-w-[760px] space-y-8 text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
          <p>
            By using ctrfoodworks.com, you agree to these Terms of Service. If you
            do not agree, please do not use the site.
          </p>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Use of the site</h2>
            <p>
              This website is provided for general information about CTR Food Works,
              our kitchens, bar, and events. Content may change without notice, and
              we make no guarantee that information is complete or current at all
              times.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Events and bookings</h2>
            <p>
              Event details, hours, and vendor lineups are subject to change.
              Private-event and vendor inquiries submitted through the site are
              requests, not confirmed bookings, until we respond to arrange details.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Intellectual property</h2>
            <p>
              The CTR Food Works name, logos, and site content are our property or
              used with permission and may not be reproduced without consent.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Third-party links</h2>
            <p>
              Our site may link to third-party websites (such as vendor pages or
              social profiles). We are not responsible for the content or practices
              of those sites.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold text-[var(--text-dark)]">Contact</h2>
            <p>
              Questions about these terms? Reach us through our{" "}
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
