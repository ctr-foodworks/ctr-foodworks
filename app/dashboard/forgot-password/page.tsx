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
        <div className="rounded-2xl border border-[#e4e8f1] bg-white p-8 lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-[#828b9e]">
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <div className="mt-7">
            <ForgotPasswordForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#828b9e]">
          CTR Food Works · Staff access only
        </p>
      </div>
    </div>
  );
}
