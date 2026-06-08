import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin · Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--secondary-navy)] px-6 py-16">
      <div className="w-full max-w-[440px]">
        {/* White wordmark above the card */}
        <div className="mb-8 flex justify-center">
          <img
            src="/logos/ctr-inline-white.svg"
            alt="CTR Food Works"
            className="h-6 w-auto lg:h-7"
          />
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] lg:p-10">
          <h1 className="font-display text-[34px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]">
            Sign In
          </h1>
          <p className="mt-2 text-[14px] font-light text-[var(--text-muted-dark)]">
            Access your events dashboard.
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-light tracking-[1px] text-white/40">
          CTR Food Works · Staff access only
        </p>
      </div>
    </div>
  );
}
