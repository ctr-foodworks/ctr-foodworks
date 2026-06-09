import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/users-db";
import { getUnreadCounts } from "@/lib/submissions-db";
import { ToastProvider, FlashToasts } from "@/components/admin/toast";
import { AdminChrome } from "@/components/admin/sidebar";
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
  const me = session?.user?.email
    ? await getUserByEmail(session.user.email)
    : null;

  // Session exists but the user was deleted/disabled mid-session → block all
  // access and force a sign-out (the JWT is otherwise valid until it expires).
  if (session?.user && !me) {
    return (
      <ToastProvider>
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
            Access removed
          </p>
          <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[0.95] tracking-[-1px] text-[var(--text-dark)]">
            Your account is no longer active.
          </h1>
          <p className="mt-4 max-w-[420px] text-[14px] font-light text-[var(--text-muted-dark)]">
            Please sign out. Contact an administrator if you think this is a
            mistake.
          </p>
          <form action={adminSignOut} className="mt-7">
            <button
              type="submit"
              className="inline-flex h-[48px] items-center justify-center bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
            >
              Sign out
            </button>
          </form>
        </div>
      </ToastProvider>
    );
  }

  // Invited users must set a password first — clean, chrome-less screen.
  if (me?.mustChangePassword) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-white text-[var(--text-dark)]">
          {children}
        </div>
      </ToastProvider>
    );
  }

  const counts = me ? await getUnreadCounts() : { waitlist: 0, contact: 0 };

  return (
    <ToastProvider>
      <Suspense>
        <FlashToasts />
      </Suspense>
      <div className="min-h-screen bg-white text-[var(--text-dark)]">
        {me && (
          <AdminChrome
            counts={counts}
            user={{
              name: me.name,
              email: me.email,
              imageUrl: me.imageUrl,
              role: me.role,
            }}
          />
        )}
        <div className={me ? "pl-[64px] pt-[60px]" : ""}>{children}</div>
      </div>
    </ToastProvider>
  );
}
