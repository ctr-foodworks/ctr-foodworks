import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
          <p className="text-[13px] font-semibold text-[var(--primary)]">
            Access removed
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#1c2130]">
            Your account is no longer active.
          </h1>
          <p className="mt-3 max-w-[420px] text-sm text-[#828b9e]">
            Please sign out. Contact an administrator if you think this is a
            mistake.
          </p>
          <form action={adminSignOut} className="mt-7">
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Sign out
            </button>
          </form>
        </div>
      </ToastProvider>
    );
  }

  // Invited users must set a password first. Enforced from the DB (not the
  // token) using the real pathname from middleware — avoids redirect loops.
  if (me?.mustChangePassword) {
    const pathname = ((await headers()).get("x-pathname") || "").replace(
      /\/+$/,
      "",
    );
    if (pathname && pathname !== "/dashboard/set-password") {
      redirect("/dashboard/set-password");
    }
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
        <div className={me ? "pt-[60px] pb-[62px] sm:pb-0 sm:pl-[64px]" : ""}>
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
