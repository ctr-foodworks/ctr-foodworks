"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authenticate } from "./actions";

const inputClass =
  "h-10 w-full rounded-xl border border-[#e4e8f1] bg-white px-3.5 text-sm text-[#1c2130] transition-colors placeholder:text-[#828b9e]/50 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25";
const labelClass =
  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#828b9e]";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const [show, setShow] = useState(false);

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

      <label className="flex flex-col">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828b9e] transition-colors hover:text-[#1c2130]"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </label>

      <Link
        href="/dashboard/forgot-password"
        className="-mt-2 self-end text-[13px] font-medium text-[#828b9e] transition-colors hover:text-[var(--primary)]"
      >
        Forgot password?
      </Link>

      {errorMessage && (
        <p className="text-[13px] text-[#e4524e]" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
