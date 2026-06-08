"use client";

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
          <form action={adminSignOut}>
            <button
              type="submit"
              className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] transition-colors hover:text-[var(--primary)]"
            >
              Sign out
            </button>
          </form>
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
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-11 w-full items-center justify-center transition-colors ${
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
            </Link>
          );
        })}
      </aside>
    </>
  );
}
