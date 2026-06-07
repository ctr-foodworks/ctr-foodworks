import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin · Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f4f0] px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col gap-3">
          <Eyebrow tone="primary">CTR Food Works</Eyebrow>
          <h1 className="font-display text-[32px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)]">
            Events Admin
          </h1>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
        </div>
        <div className="bg-white p-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.3)] lg:p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
