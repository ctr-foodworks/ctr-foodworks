import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
import { ToastProvider, FlashToasts } from "@/components/admin/toast";
import { AdminSidebar } from "@/components/admin/sidebar";

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

  return (
    <ToastProvider>
      <Suspense>
        <FlashToasts />
      </Suspense>
      <div className="min-h-screen bg-white text-[var(--text-dark)]">
        {signedIn && <AdminSidebar />}
        <div className={signedIn ? "lg:pl-[228px]" : ""}>{children}</div>
      </div>
    </ToastProvider>
  );
}
