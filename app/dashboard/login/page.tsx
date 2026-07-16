import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin · Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-[440px]">
        {/* Bordered card so it reads against the white page */}
        <div className="rounded-2xl border border-[#e4e8f1] bg-white p-8 lg:p-10">
          <img
            src="/logos/ctr-inline-black.svg"
            alt="CTR Food Works"
            className="mb-8 h-6 w-auto"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
            Sign In
          </h1>
          <p className="mt-1 text-sm text-[#828b9e]">
            Access your events dashboard.
          </p>
          {reset && (
            <p className="mt-5 rounded-xl bg-[#e7f6ef] px-4 py-3 text-[13px] font-medium text-[#35b57c]">
              Password updated. Sign in with your new password.
            </p>
          )}
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#828b9e]">
          CTR Food Works · Staff access only
        </p>
      </div>
    </div>
  );
}
