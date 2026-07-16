"use client";

import { useActionState, useState } from "react";
import { changePassword } from "./actions";
import { PasswordChecklist } from "@/components/admin/password-checklist";

const inputClass =
  "h-10 w-full max-w-[420px] rounded-xl border border-[#e4e8f1] bg-white px-3.5 text-sm text-[#1c2130] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25";
const labelClass =
  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#828b9e]";

export function AccountForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    undefined,
  );
  const [next, setNext] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col">
        <span className={labelClass}>Current password</span>
        <input
          type="password"
          name="current"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col">
        <span className={labelClass}>New password</span>
        <input
          type="password"
          name="next"
          required
          minLength={8}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="max-w-[420px]">
        <PasswordChecklist value={next} />
      </div>

      <label className="flex flex-col">
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

      {state?.error && (
        <p className="text-[13px] text-[#e4524e]" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
