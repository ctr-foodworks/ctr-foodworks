"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordAction } from "./actions";
import { PasswordChecklist } from "@/components/admin/password-checklist";

const inputClass =
  "h-12 w-full rounded-lg border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/50 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";
const labelClass =
  "text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)]";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, formAction, isPending] = useActionState(
    resetPasswordAction,
    undefined,
  );
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />

      <label className="flex flex-col gap-2">
        <span className={labelClass}>New password</span>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name="next"
            required
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted-dark)] transition-colors hover:text-[var(--text-dark)]"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
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
        disabled={isPending}
        className="mt-1 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
