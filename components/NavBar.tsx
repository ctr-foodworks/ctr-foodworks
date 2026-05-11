"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/nav";

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
            <Link
              href="/#waitlist"
              className="hidden h-[40px] items-center bg-[var(--primary)] px-5 text-[11px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] lg:inline-flex"
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-[var(--border-light)] px-6 py-5 text-[14px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#waitlist"
              className="bg-[var(--primary)] px-6 py-5 text-[14px] font-semibold tracking-[3px] uppercase text-white"
            >
              Join Us
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
