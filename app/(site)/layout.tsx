import Script from "next/script";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CookieNotice } from "@/components/CookieNotice";
import { WelcomeModal } from "@/components/WelcomeModal";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteJsonLd } from "@/lib/business";

/**
 * Layout for the public marketing site — wraps every route except /dashboard and
 * /api. Holds the shared NavBar/Footer plus the first-visit WelcomeModal and
 * CookieNotice. (Route groups don't affect URLs, so paths are unchanged.)
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Sitewide FoodEstablishment + WebSite structured data. Scoped to the
          public site (this route group) so /dashboard stays schema-free. Events
          and vendor pages reference the #business @id emitted here. */}
      <JsonLd data={siteJsonLd()} />

      {/* Google tag (Google Ads AW-18316984603). Scoped to the public site so
          it doesn't run on the admin dashboard. The lead-form conversion event
          fires from ContactForm on a successful submit (the form is AJAX and
          shows an inline success, so there's no separate "thanks" page load). */}
      <Script
        id="gtag-js"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18316984603"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18316984603');`}
      </Script>

      {/* GA4 — renders only when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured. */}
      <GoogleAnalytics />

      <NavBar />
      {children}
      <Footer />
      {/* WelcomeModal renders first-visit only (localStorage-gated). Cookie
          notice still appears bottom-right after the modal is dismissed. */}
      <WelcomeModal />
      <CookieNotice />
    </>
  );
}
