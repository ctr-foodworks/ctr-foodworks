"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  UserPlus,
  MessageSquare,
  BarChart3,
  UserCog,
  Users,
  ChevronDown,
  ExternalLink,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { adminSignOut } from "@/app/dashboard/actions";
import { canManageUsers } from "@/lib/roles";
import type { UserRole } from "@/lib/db/schema";

type Counts = { waitlist: number; contact: number };
type ChromeUser = {
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: UserRole;
};

type Item = {
  href: string;
  label: string;
  Icon: LucideIcon;
  isActive: (path: string) => boolean;
  countKey?: keyof Counts;
};

const items: Item[] = [
  {
    href: "/dashboard",
    label: "Events",
    Icon: CalendarDays,
    isActive: (p) =>
      p === "/dashboard" || p.startsWith("/dashboard/new") || /^\/dashboard\/\d+\/edit/.test(p),
  },
  {
    href: "/dashboard/waitlist",
    label: "Waitlist",
    Icon: UserPlus,
    isActive: (p) => p.startsWith("/dashboard/waitlist"),
    countKey: "waitlist",
  },
  {
    href: "/dashboard/contact",
    label: "Messages",
    Icon: MessageSquare,
    isActive: (p) => p.startsWith("/dashboard/contact"),
    countKey: "contact",
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    Icon: BarChart3,
    isActive: (p) => p.startsWith("/dashboard/reports"),
  },
  {
    href: "/dashboard/account",
    label: "Account",
    Icon: UserCog,
    isActive: (p) => p.startsWith("/dashboard/account"),
  },
];

// Shown only to roles that can manage users (super_admin / admin).
const usersItem: Item = {
  href: "/dashboard/users",
  label: "Users",
  Icon: Users,
  isActive: (p) => p.startsWith("/dashboard/users"),
};

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
export function AdminChrome({
  counts,
  user,
}: {
  counts: Counts;
  user: ChromeUser;
}) {
  const path = useActivePath();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navItems = canManageUsers(user.role) ? [...items, usersItem] : items;

  useEffect(() => {
    if (!confirmSignOut) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirmSignOut(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmSignOut]);

  // Close the user menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Top header — holds the logo, above the page */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-[var(--text-dark)]/10 bg-white px-5">
        <Link href="/dashboard" aria-label="CTR Food Works admin">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="h-5 w-auto"
          />
        </Link>
        {/* User menu — name to the far right, opens an animated dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-black/[0.04]"
          >
            {user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--text-dark)]/10 text-[11px] font-semibold uppercase text-[var(--text-dark)]">
                {(user.name || user.email).charAt(0)}
              </span>
            )}
            <span className="hidden max-w-[180px] truncate text-[13px] font-medium text-[var(--text-dark)] sm:inline">
              {user.name || user.email}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[var(--text-muted-dark)] transition-transform duration-150 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            role="menu"
            className={`absolute right-0 top-[calc(100%+10px)] w-60 origin-top-right rounded-xl border border-[var(--text-dark)]/10 bg-white py-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition duration-150 ease-out ${
              menuOpen
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            <div className="border-b border-[var(--text-dark)]/10 px-4 pb-3 pt-1">
              <p className="truncate text-[13px] font-semibold text-[var(--text-dark)]">
                {user.name || "—"}
              </p>
              <p className="truncate text-[12px] font-light text-[var(--text-muted-dark)]">
                {user.email}
              </p>
            </div>

            <Link
              href="/dashboard/account"
              onClick={() => setMenuOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--text-dark)] transition-colors hover:bg-black/[0.04]"
            >
              <UserCog className="h-4 w-4 text-[var(--text-muted-dark)]" />
              Profile
            </Link>
            <Link
              href="/events"
              target="_blank"
              onClick={() => setMenuOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--text-dark)] transition-colors hover:bg-black/[0.04]"
            >
              <ExternalLink className="h-4 w-4 text-[var(--text-muted-dark)]" />
              View site
            </Link>

            <div className="my-1 h-px bg-[var(--text-dark)]/10" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setConfirmSignOut(true);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Minimized icon rail (tablet/desktop) — labels show as tooltips on hover */}
      <aside className="fixed bottom-0 left-0 top-[60px] z-40 hidden w-[64px] flex-col gap-1 border-r border-[var(--text-dark)]/10 bg-white py-4 sm:flex">
        {navItems.map(({ href, label, Icon, isActive, countKey }) => {
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

      {/* Bottom nav bar — phones only */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[62px] items-stretch border-t border-[var(--text-dark)]/10 bg-white sm:hidden">
        {navItems.map(({ href, label, Icon, isActive, countKey }) => {
          const active = isActive(path);
          const n = countKey ? counts[countKey] : 0;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                active
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-dark)]/55"
              }`}
            >
              {active && (
                <span className="absolute inset-x-3 top-0 h-[3px] rounded-b-full bg-[var(--primary)]" />
              )}
              <span className="relative">
                <Icon className="h-[20px] w-[20px]" />
                <Badge n={n} />
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[1px]">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

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
