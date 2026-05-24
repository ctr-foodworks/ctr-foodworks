"use client";

import { useState, type FormEvent } from "react";

type Variant = "dark" | "light";
type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  variant?: Variant;
  className?: string;
  buttonLabel?: string;
  showHelper?: boolean;
  /** Fires once the submission lands successfully — used by WelcomeModal to
   *  auto-dismiss after a brief success state. */
  onSuccess?: () => void;
};

const inputClass: Record<Variant, string> = {
  dark: "bg-white/10 text-white placeholder:text-white/40",
  light:
    "bg-[var(--bg-warm-white)] text-[var(--text-dark)] placeholder:text-[var(--text-muted-dark)] border border-[var(--border-light)]",
};

/**
 * Email-only waitlist signup. Submits via Netlify Forms over AJAX so the
 * user never leaves the page — the form is replaced inline with a success
 * message on success. The plain <form> attributes (data-netlify, name,
 * hidden form-name) still ship in the static HTML so Netlify detects the
 * form at deploy time. For no-JS users the submission would just POST to
 * /thanks/ as a normal HTML form (the static fallback).
 */
export function WaitlistForm({
  variant = "dark",
  className = "",
  buttonLabel = "Notify Me",
  showHelper = true,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") body.append(key, value);
    }

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        // Give the user a beat to see the success state, then notify caller
        if (onSuccess) window.setTimeout(onSuccess, 1500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  // Success state — replace the form with an inline confirmation
  if (status === "success") {
    return (
      <div
        className={`flex w-full max-w-[480px] flex-col gap-3 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div
          className={`form-success-in flex h-[52px] items-center px-5 text-[13px] font-medium ${
            variant === "dark"
              ? "bg-white/15 text-white"
              : "bg-[var(--primary)] text-white"
          }`}
        >
          You&rsquo;re on the list. We&rsquo;ll be in touch.
        </div>
        <style>{`
          .form-success-in {
            animation: form-success-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
          }
          @keyframes form-success-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`flex w-full max-w-[480px] flex-col gap-3 ${className}`}>
      <form
        name="waitlist"
        method="POST"
        action="/thanks/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="flex w-full"
      >
        <input type="hidden" name="form-name" value="waitlist" />
        {/* Honeypot — hidden from real users */}
        <p className="hidden">
          <label>
            Don&apos;t fill this out if you&apos;re human:{" "}
            <input name="bot-field" />
          </label>
        </p>
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          aria-label="Email address"
          autoComplete="email"
          disabled={status === "submitting"}
          className={`h-[52px] flex-1 rounded-l-[4px] border-none px-5 text-[14px] font-light outline-none disabled:opacity-60 ${inputClass[variant]}`}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="h-[52px] cursor-pointer rounded-r-[4px] bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[2px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
        >
          {status === "submitting" ? "…" : buttonLabel}
        </button>
      </form>

      {status === "error" ? (
        <p
          className={`text-[12px] font-light ${
            variant === "dark" ? "text-white/85" : "text-[var(--primary)]"
          }`}
          role="alert"
        >
          Something went wrong. Try again?
        </p>
      ) : showHelper ? (
        <p
          className={`text-[11px] font-light ${
            variant === "dark"
              ? "text-white/40"
              : "text-[var(--text-muted-dark)]"
          }`}
        >
          No spam. Unsubscribe any time. Opening events only.
        </p>
      ) : null}
    </div>
  );
}
