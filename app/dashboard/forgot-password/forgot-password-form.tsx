"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestResetAction } from "./actions";

const inputClass =
  "h-10 w-full rounded-xl border border-[#e4e8f1] bg-white px-3.5 text-sm text-[#1c2130] transition-colors placeholder:text-[#828b9e]/50 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25";
const labelClass =
  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#828b9e]";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestResetAction,
    undefined,
  );

  if (state?.done) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        <p className="text-sm leading-[1.7] text-[#828b9e]">
          If an account exists for that email, we&apos;ve sent a link to reset
          your password. It expires in one hour — check your inbox (and spam).
        </p>
        <Link
          href="/dashboard/login"
          className="text-[13px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@ctrfoodworks.com"
          className={inputClass}
        />
      </label>

      {state?.error && (
        <p className="text-[13px] text-[#e4524e]" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send reset link"}
      </button>

      <Link
        href="/dashboard/login"
        className="text-center text-[13px] font-medium text-[#828b9e] transition-colors hover:text-[#1c2130]"
      >
        Back to sign in
      </Link>
    </form>
  );
}
