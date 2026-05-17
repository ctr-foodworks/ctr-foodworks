"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { navLinks, type NavLink } from "@/lib/nav";
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

function pickNextEvent() {
  if (!events.length) return null;
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const [first] = sorted;
  const [, m, d] = first.date.split("T")[0].split("-").map(Number);
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
          <Link
            href="/"
            aria-label="CTR Food Works home"
            className="flex items-center"
          >
            <img
              src="/logos/ctr-inline-black.svg"
              alt="CTR Food Works"
              className="h-4 w-auto lg:h-5"
            />
          </Link>

          {/* Desktop nav with hover-dropdown panels */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <DesktopNavItem
                key={link.href}
                link={link}
                pathname={pathname}
                nextEvent={link.showNextEvent ? nextEvent : null}
              />
            ))}
          </nav>

          <div className="flex items-center gap-3">
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
        <div className="fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-[var(--bg-warm-white)] lg:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <MobileNavItem key={link.href} link={link} pathname={pathname} />
            ))}
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

/* ────────────────────────── desktop ────────────────────────── */

function DesktopNavItem({
  link,
  pathname,
  nextEvent,
}: {
  link: NavLink;
  pathname: string;
  nextEvent: { title: string; label: string } | null;
}) {
  const active = isActive(pathname, link.href);
  const hasDropdown = !!link.children?.length || !!nextEvent;

  if (!hasDropdown) {
    return (
      <Link
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
  }

  return (
    <div className="group relative">
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 text-[11px] font-semibold tracking-[3px] uppercase transition-colors ${
          active
            ? "text-[var(--primary)]"
            : "text-[var(--text-dark)] hover:text-[var(--primary)]"
        }`}
      >
        {link.label}
        <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
      </Link>

      {/* Invisible bridge so the dropdown doesn't close when the cursor
          crosses the gap between trigger and panel */}
      <div
        aria-hidden="true"
        className="invisible absolute left-1/2 top-full h-3 w-[200px] -translate-x-1/2 group-hover:visible"
      />

      <div className="invisible absolute right-0 top-[calc(100%+12px)] z-10 min-w-[260px] origin-top-right -translate-y-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="overflow-hidden border border-[var(--border-light)] bg-[var(--bg-warm-white)] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.18)]">
          {nextEvent && (
            <Link
              href="/events"
              className="group/eotd flex items-center gap-3 border-b border-[var(--border-light)] bg-[#f9f4f0] px-5 py-4 transition-colors hover:bg-[var(--primary)]"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--primary)] group-hover/eotd:bg-white" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[9px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)] group-hover/eotd:text-white/80">
                  Next event
                </span>
                <span className="truncate text-[12px] font-semibold tracking-[1px] uppercase text-[var(--text-dark)] group-hover/eotd:text-white">
                  {nextEvent.title} · {nextEvent.label}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[var(--primary)] transition-transform group-hover/eotd:translate-x-0.5 group-hover/eotd:text-white" />
            </Link>
          )}

          <ul className="flex flex-col py-2">
            {link.children?.map((child) => (
              <li key={child.href + child.label}>
                <Link
                  href={child.href}
                  className="flex items-center px-5 py-2.5 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--bg-cream)] hover:text-[var(--primary)]"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── mobile ────────────────────────── */

function MobileNavItem({
  link,
  pathname,
}: {
  link: NavLink;
  pathname: string;
}) {
  const active = isActive(pathname, link.href);
  return (
    <div className="flex flex-col border-b border-[var(--border-light)]">
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`px-6 py-5 text-[14px] font-semibold tracking-[3px] uppercase transition-colors ${
          active
            ? "bg-[var(--primary)] text-white"
            : "text-[var(--text-dark)]"
        }`}
      >
        {link.label}
      </Link>
      {link.children?.length ? (
        <ul className="flex flex-col bg-[#f9f4f0] pb-2">
          {link.children.map((child) => (
            <li key={child.href + child.label}>
              <Link
                href={child.href}
                className="block px-6 py-3 pl-10 text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)] transition-colors hover:text-[var(--primary)]"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ────────────────────────── helpers ────────────────────────── */

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
