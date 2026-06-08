import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CookieNotice } from "@/components/CookieNotice";
import { WelcomeModal } from "@/components/WelcomeModal";

/**
 * Layout for the public marketing site — wraps every route except /admin and
 * /api. Holds the shared NavBar/Footer plus the first-visit WelcomeModal and
 * CookieNotice. (Route groups don't affect URLs, so paths are unchanged.)
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
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
