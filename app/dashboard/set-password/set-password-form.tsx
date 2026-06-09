"use client";

import { useState, type FormEvent } from "react";
import { setPasswordAction } from "./actions";
import { PasswordChecklist } from "@/components/admin/password-checklist";
import { validatePassword } from "@/lib/validation";

const inputClass =
  "h-12 w-full rounded-lg border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]";
const labelClass =
  "text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)]";

export function SetPasswordForm() {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const pwError = validatePassword(next);
    if (pwError) {
      e.preventDefault();
      setError(pwError);
      return;
    }
    if (next !== confirm) {
      e.preventDefault();
      setError("Passwords don't match.");
      return;
    }
    setError(undefined);
    setSubmitting(true); // valid → let the server action run (signs out)
  }

  return (
    <form
      action={setPasswordAction}
      onSubmit={onSubmit}
      className="flex flex-col gap-5"
    >
      <label className="flex flex-col gap-2">
        <span className={labelClass}>New password</span>
        <input
          type="password"
          name="next"
          required
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
      </label>

      <PasswordChecklist value={next} />

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Confirm new password</span>
        <input
          type="password"
          name="confirm"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </label>

      {error && (
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Set password"}
      </button>
    </form>
  );
}
