import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { adminSignOut } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#f9f4f0] text-[var(--text-dark)]">
      {session?.user && (
        <header className="border-b border-[var(--text-dark)]/10 bg-white">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/admin"
                className="font-display text-[18px] font-black uppercase tracking-[-0.5px] text-[var(--text-dark)]"
              >
                CTR Admin
              </Link>
              <nav className="flex items-center gap-5">
                <Link
                  href="/admin"
                  className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] hover:text-[var(--primary)]"
                >
                  Events
                </Link>
                <Link
                  href="/admin/waitlist"
                  className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] hover:text-[var(--primary)]"
                >
                  Waitlist
                </Link>
                <Link
                  href="/admin/contact"
                  className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] hover:text-[var(--primary)]"
                >
                  Messages
                </Link>
                <Link
                  href="/admin/account"
                  className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] hover:text-[var(--primary)]"
                >
                  Account
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/events"
                target="_blank"
                className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--primary)]"
              >
                View site ↗
              </Link>
              <form action={adminSignOut}>
                <button
                  type="submit"
                  className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--primary)]"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
