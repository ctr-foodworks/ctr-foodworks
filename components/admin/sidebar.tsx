"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  UserPlus,
  MessageSquare,
  UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { adminSignOut } from "@/app/admin/actions";

type Counts = { waitlist: number; contact: number };

type Item = {
  href: string;
  label: string;
  Icon: LucideIcon;
  isActive: (path: string) => boolean;
  countKey?: keyof Counts;
};

const items: Item[] = [
  {
    href: "/admin",
    label: "Events",
    Icon: CalendarDays,
    isActive: (p) =>
      p === "/admin" || p.startsWith("/admin/new") || /^\/admin\/\d+\/edit/.test(p),
  },
  {
    href: "/admin/waitlist",
    label: "Waitlist",
    Icon: UserPlus,
    isActive: (p) => p.startsWith("/admin/waitlist"),
    countKey: "waitlist",
  },
  {
    href: "/admin/contact",
    label: "Messages",
    Icon: MessageSquare,
    isActive: (p) => p.startsWith("/admin/contact"),
    countKey: "contact",
  },
  {
    href: "/admin/account",
    label: "Account",
    Icon: UserCog,
    isActive: (p) => p.startsWith("/admin/account"),
  },
];

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[9px] font-bold leading-none text-white">
      {n > 9 ? "9+" : n}
    </span>
  );
}

function useActivePath() {
  const pathname = usePathname() ?? "/";
  // Normalize trailing slash (trailingSlash: true in next.config).
  return pathname.replace(/\/+$/, "") || "/";
}

/** Top header (logo + utility actions) + a minimized icon rail on the left. */
export function AdminChrome({ counts }: { counts: Counts }) {
  const path = useActivePath();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  useEffect(() => {
    if (!confirmSignOut) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirmSignOut(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmSignOut]);

  return (
    <>
      {/* Top header — holds the logo, above the page */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-[var(--text-dark)]/10 bg-white px-5">
        <Link href="/admin" aria-label="CTR Food Works admin">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="h-5 w-auto"
          />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/events"
            target="_blank"
            className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] transition-colors hover:text-[var(--primary)]"
          >
            View site ↗
          </Link>
          <button
            type="button"
            onClick={() => setConfirmSignOut(true)}
            className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] transition-colors hover:text-[var(--primary)]"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Minimized icon rail — labels show as tooltips on hover */}
      <aside className="fixed bottom-0 left-0 top-[60px] z-40 flex w-[64px] flex-col gap-1 border-r border-[var(--text-dark)]/10 bg-white py-4">
        {items.map(({ href, label, Icon, isActive, countKey }) => {
          const active = isActive(path);
          const n = countKey ? counts[countKey] : 0;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`group relative flex h-11 w-full items-center justify-center transition-colors ${
                active
                  ? "bg-[var(--primary)]/8 text-[var(--primary)]"
                  : "text-[var(--text-dark)]/55 hover:bg-black/[0.04] hover:text-[var(--primary)]"
              }`}
            >
              {active && (
                <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[var(--primary)]" />
              )}
              <span className="relative">
                <Icon className="h-[20px] w-[20px]" />
                <Badge n={n} />
              </span>
              {/* Instant tooltip (no native title delay) */}
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[var(--text-dark)] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-white opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-opacity duration-100 group-hover:opacity-100">
                {label}
              </span>
            </Link>
          );
        })}
      </aside>

      {/* Sign-out confirmation modal */}
      {confirmSignOut && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => setConfirmSignOut(false)}
            className="absolute inset-0 cursor-pointer bg-black/50"
          />
          <div className="relative z-10 w-full max-w-[380px] rounded-xl border border-[var(--text-dark)]/10 bg-white p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            <h2
              id="signout-title"
              className="font-display text-[24px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]"
            >
              Sign out?
            </h2>
            <p className="mt-2 text-[14px] font-light leading-[1.6] text-[var(--text-muted-dark)]">
              You&apos;ll need to log in again to manage events.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmSignOut(false)}
                className="inline-flex h-[44px] items-center justify-center rounded-lg border border-[var(--text-dark)]/20 px-5 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] transition-colors hover:bg-black/[0.04]"
              >
                Cancel
              </button>
              <form action={adminSignOut}>
                <button
                  type="submit"
                  className="inline-flex h-[44px] items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-[11px] font-semibold tracking-[2px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
