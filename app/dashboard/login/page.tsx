import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin · Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-[440px]">
        {/* Bordered card so it reads against the white page */}
        <div className="rounded-2xl border border-[var(--text-dark)]/12 bg-white p-8 shadow-[0_2px_28px_rgba(0,0,0,0.06)] lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />
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

        <p className="mt-6 text-center text-[11px] font-light tracking-[1px] text-[var(--text-muted-dark)]">
          CTR Food Works · Staff access only
        </p>
      </div>
    </div>
  );
}
