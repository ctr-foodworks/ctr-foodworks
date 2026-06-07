"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="h-[48px] border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]">
          Password
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="h-[48px] border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
        />
      </label>

      {errorMessage && (
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-[48px] items-center justify-center bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
