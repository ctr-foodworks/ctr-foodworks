import Script from "next/script";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CookieNotice } from "@/components/CookieNotice";
import { WelcomeModal } from "@/components/WelcomeModal";

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
