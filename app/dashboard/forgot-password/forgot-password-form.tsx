"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestResetAction } from "./actions";

const inputClass =
  "h-12 w-full rounded-lg border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/50 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";
const labelClass =
  "text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)]";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestResetAction,
    undefined,
  );

  if (state?.done) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        <p className="text-[14px] font-light leading-[1.7] text-[var(--text-muted-dark)]">
          If an account exists for that email, we&apos;ve sent a link to reset
          your password. It expires in one hour — check your inbox (and spam).
        </p>
        <Link
          href="/dashboard/login"
          className="text-[12px] font-semibold tracking-[2px] uppercase text-[var(--primary)] underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
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
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send reset link"}
      </button>

      <Link
        href="/dashboard/login"
        className="text-center text-[12px] font-light text-[var(--text-muted-dark)] transition-colors hover:text-[var(--text-dark)]"
      >
        Back to sign in
      </Link>
    </form>
  );
}
