"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authenticate } from "./actions";

const inputClass =
  "h-12 w-full rounded-lg border border-[var(--border-light)] bg-white px-4 text-[14px] text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/50 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";
const labelClass =
  "text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)]";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const [show, setShow] = useState(false);

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

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Password</span>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••"
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

      {errorMessage && (
        <p className="text-[13px] font-light text-[var(--primary)]" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
