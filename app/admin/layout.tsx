import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
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
  const session = await auth();
  const signedIn = Boolean(session?.user);
  const counts = signedIn
    ? await getUnreadCounts()
    : { waitlist: 0, contact: 0 };

  return (
    <ToastProvider>
      <Suspense>
        <FlashToasts />
      </Suspense>
      <div className="min-h-screen bg-white text-[var(--text-dark)]">
        {signedIn && <AdminChrome counts={counts} />}
        <div className={signedIn ? "pl-[64px] pt-[60px]" : ""}>{children}</div>
      </div>
    </ToastProvider>
  );
}
