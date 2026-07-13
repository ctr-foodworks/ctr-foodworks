import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Admin · Reset Password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-[440px]">
        <div className="rounded-2xl border border-[var(--text-dark)]/12 bg-white p-8 shadow-[0_2px_28px_rgba(0,0,0,0.06)] lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />
          <h1 className="font-display text-[34px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]">
            Reset Password
          </h1>
          <p className="mt-2 text-[14px] font-light text-[var(--text-muted-dark)]">
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <div className="mt-7">
            <ForgotPasswordForm />
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-light tracking-[1px] text-[var(--text-muted-dark)]">
          CTR Food Works · Staff access only
        </p>
      </div>
    </div>
  );
}
