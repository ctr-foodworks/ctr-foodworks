import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/current-user";
import { getUnreadCounts } from "@/lib/submissions-db";
import { ToastProvider, FlashToasts } from "@/components/admin/toast";
import { AdminChrome } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();

  // Invited users must set a password first — render a clean, chrome-less
  // screen (the set-password page) until they do.
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
