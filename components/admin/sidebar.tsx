"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  UserPlus,
  MessageSquare,
  UserCog,
  ExternalLink,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { adminSignOut } from "@/app/admin/actions";

type Counts = { waitlist: number; contact: number };

type Item = {
  href: string;
  label: string;
  Icon: LucideIcon;
  isActive: (path: string) => boolean;
  /** Which unread count (if any) drives this item's badge. */
  countKey?: keyof Counts;
};

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[9px] font-bold leading-none text-white">
      {n > 9 ? "9+" : n}
    </span>
  );
}

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

function useActivePath() {
  const pathname = usePathname() ?? "/";
  // Normalize trailing slash (trailingSlash: true in next.config).
  return pathname.replace(/\/+$/, "") || "/";
}

export function AdminSidebar({ counts }: { counts: Counts }) {
  const path = useActivePath();

  return (
    <>
      {/* Desktop — fixed left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[228px] flex-col border-r border-[var(--text-dark)]/10 bg-white lg:flex">
        <div className="flex items-center border-b border-[var(--text-dark)]/10 px-6 py-5">
          <Link href="/admin" aria-label="CTR Food Works admin">
            <img
              src="/logos/ctr-inline-black.svg"
              alt="CTR Food Works"
              className="h-5 w-auto"
            />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {items.map(({ href, label, Icon, isActive, countKey }) => {
            const active = isActive(path);
            const n = countKey ? counts[countKey] : 0;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[11px] font-semibold tracking-[2px] uppercase transition-colors ${
                  active
                    ? "bg-[var(--primary)]/8 text-[var(--primary)]"
                    : "text-[var(--text-dark)]/65 hover:bg-black/[0.03] hover:text-[var(--primary)]"
                }`}
              >
                {active && (
                  <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-full bg-[var(--primary)]" />
                )}
                <span className="relative flex-shrink-0">
                  <Icon className="h-[18px] w-[18px]" />
                  <Badge n={n} />
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-1 border-t border-[var(--text-dark)]/10 p-3">
          <Link
            href="/events"
            target="_blank"
            title="View site"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] transition-colors hover:bg-black/[0.03] hover:text-[var(--primary)]"
          >
            <ExternalLink className="h-[18px] w-[18px] flex-shrink-0" />
            <span>View site</span>
          </Link>
          <form action={adminSignOut}>
            <button
              type="submit"
              title="Sign out"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] transition-colors hover:bg-black/[0.03] hover:text-[var(--primary)]"
            >
              <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
              <span>Sign out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile — sticky top bar with icon links */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[var(--text-dark)]/10 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" aria-label="CTR Food Works admin">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="h-4 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-1">
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
                className={`relative flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                  active
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--text-dark)]/65 hover:text-[var(--primary)]"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <Badge n={n} />
              </Link>
            );
          })}
          <form action={adminSignOut}>
            <button
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-muted-dark)] transition-colors hover:text-[var(--primary)]"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </form>
        </nav>
      </header>
    </>
  );
}
