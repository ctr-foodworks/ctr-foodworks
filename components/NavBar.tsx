"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { events } from "@/lib/events";

const monthShort = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/** Picks the earliest event for the nav-pill teaser. */
function pickNextEvent() {
  if (!events.length) return null;
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const [first] = sorted;
  const [y, m, d] = first.date.split("T")[0].split("-").map(Number);
  return {
    title: first.title,
    label: `${monthShort[(m ?? 1) - 1]} ${String(d ?? 1).padStart(2, "0")}`,
  };
}

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const nextEvent = pickNextEvent();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-[var(--bg-warm-white)] transition-shadow ${
          scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="flex h-[72px] items-center justify-between px-6 lg:h-[80px] lg:px-[60px]">
          <Link href="/" aria-label="CTR Food Works home" className="flex items-center">
            <img
              src="/logos/ctr-inline-black.svg"
              alt="CTR Food Works"
              className="h-4 w-auto lg:h-5"
            />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[11px] font-semibold tracking-[3px] uppercase transition-colors ${
                    active
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-dark)] hover:text-[var(--primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Event-of-the-day pill — fills the horizontal whitespace
                between the nav and the Join Us pill on wide viewports.
                Hidden below xl since lg gets cramped with 6 nav items. */}
            {nextEvent && (
              <Link
                href="/events"
                className="group hidden h-[40px] items-center gap-2.5 px-3 text-[10px] font-semibold tracking-[3px] uppercase text-[var(--primary)] transition-colors hover:text-[var(--text-dark)] xl:inline-flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>
                  Next · {nextEvent.title} · {nextEvent.label}
                </span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <Link
              href="/#waitlist"
              className="hidden h-[40px] items-center border border-[var(--text-dark)] bg-transparent px-5 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white lg:inline-flex"
            >
              Join Us
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center text-[var(--text-dark)] lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 top-[72px] z-40 flex flex-col bg-[var(--bg-warm-white)] lg:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b border-[var(--border-light)] px-6 py-5 text-[14px] font-semibold tracking-[3px] uppercase transition-colors ${
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-dark)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/#waitlist"
              className="border-t border-[var(--border-light)] bg-transparent px-6 py-5 text-[14px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
            >
              Join Us
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

/**
 * Returns true if `linkHref` matches the current pathname. Handles:
 *   · trailingSlash: true in next.config (pathname may be "/about/")
 *   · sub-routes (`/food-and-drinks/morellis` should highlight
 *     `/food-and-drinks`)
 *   · the home link `/` which should only match the home page exactly
 */
function isActive(pathname: string, linkHref: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  if (linkHref === "/") return normalized === "/";
  return normalized === linkHref || normalized.startsWith(linkHref + "/");
}
