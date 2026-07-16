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
        <div className="rounded-2xl border border-[#e4e8f1] bg-white p-8 lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
            Finish setup
          </h1>
          <p className="mt-1 text-sm text-[#828b9e]">
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
