import type { Metadata } from "next";
import Link from "next/link";
import { getUserForResetToken } from "@/lib/password-reset";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Admin · New Password",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const user = token ? await getUserForResetToken(token) : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-[440px]">
        <div className="rounded-2xl border border-[#e4e8f1] bg-white p-8 lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />

          {user ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
                New Password
              </h1>
              <p className="mt-1 text-sm text-[#828b9e]">
                Choose a new password for{" "}
                <span className="font-medium text-[#1c2130]">
                  {user.email}
                </span>
                .
              </p>
              <div className="mt-7">
                <ResetPasswordForm token={token as string} />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
                Link expired
              </h1>
              <p className="mt-3 text-sm leading-[1.7] text-[#828b9e]">
                This password-reset link is invalid or has expired. Reset links
                are single-use and last one hour. Request a fresh one below.
              </p>
              <Link
                href="/dashboard/forgot-password"
                className="mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Request new link
              </Link>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#828b9e]">
          CTR Food Works · Staff access only
        </p>
      </div>
    </div>
  );
}
