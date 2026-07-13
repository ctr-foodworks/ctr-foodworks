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
        <div className="rounded-2xl border border-[var(--text-dark)]/12 bg-white p-8 shadow-[0_2px_28px_rgba(0,0,0,0.06)] lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />

          {user ? (
            <>
              <h1 className="font-display text-[34px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]">
                New Password
              </h1>
              <p className="mt-2 text-[14px] font-light text-[var(--text-muted-dark)]">
                Choose a new password for{" "}
                <span className="font-medium text-[var(--text-dark)]">
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
              <h1 className="font-display text-[30px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]">
                Link expired
              </h1>
              <p className="mt-3 text-[14px] font-light leading-[1.7] text-[var(--text-muted-dark)]">
                This password-reset link is invalid or has expired. Reset links
                are single-use and last one hour. Request a fresh one below.
              </p>
              <Link
                href="/dashboard/forgot-password"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
              >
                Request new link
              </Link>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] font-light tracking-[1px] text-[var(--text-muted-dark)]">
          CTR Food Works · Staff access only
        </p>
      </div>
    </div>
  );
}
