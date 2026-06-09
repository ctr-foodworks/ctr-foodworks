"use client";

import { useActionState } from "react";
import { setPasswordAction } from "./actions";
import { PASSWORD_HINT } from "@/lib/validation";

const inputClass =
  "h-12 w-full rounded-lg border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]";
const labelClass =
  "text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)]";

export function SetPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    setPasswordAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className={labelClass}>New password</span>
        <input
          type="password"
          name="next"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Confirm new password</span>
        <input
          type="password"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>

      <p className="text-[11px] font-light leading-[1.5] text-[var(--text-muted-dark)]">
        {PASSWORD_HINT}
      </p>

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
        {isPending ? "Saving…" : "Set password"}
      </button>
    </form>
  );
}
