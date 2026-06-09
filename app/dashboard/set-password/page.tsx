import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { SetPasswordForm } from "./set-password-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

export default async function SetPasswordPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/dashboard/login");
  // Already has a real password — no need for the forced flow.
  if (!me.mustChangePassword) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-[var(--text-dark)]/12 bg-white p-8 shadow-[0_2px_28px_rgba(0,0,0,0.06)] lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />
          <h1 className="font-display text-[30px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]">
            Finish setup
          </h1>
          <p className="mt-2 text-[14px] font-light text-[var(--text-muted-dark)]">
            Welcome{me.name ? `, ${me.name}` : ""}. Set a password and add your
            photo to finish setting up your account.
          </p>
          <div className="mt-7">
            <SetPasswordForm defaultName={me.name ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
