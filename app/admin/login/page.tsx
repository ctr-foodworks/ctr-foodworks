import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin · Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9f4f0] px-6 py-16">
      <div className="w-full max-w-[400px]">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <img
            src="/logos/ctr-food-works_primary-black.svg"
            alt="CTR Food Works"
            className="h-14 w-14"
          />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--primary)]">
              Events Admin
            </span>
            <h1 className="font-display text-[26px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]">
              Sign in
            </h1>
          </div>
        </div>

        {/* Card */}
        <div className="border border-[var(--text-dark)]/8 bg-white p-7 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)] lg:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-[11px] font-light tracking-[1px] text-[var(--text-muted-dark)]">
          CTR Food Works · Staff only
        </p>
      </div>
    </div>
  );
}
