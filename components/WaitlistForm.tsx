"use client";

import { useState, type FormEvent } from "react";

type Variant = "dark" | "light";

type Props = {
  variant?: Variant;
  className?: string;
  buttonLabel?: string;
  showHelper?: boolean;
};

const inputClass: Record<Variant, string> = {
  dark: "bg-white/10 text-white placeholder:text-white/40",
  light:
    "bg-[var(--bg-warm-white)] text-[var(--text-dark)] placeholder:text-[var(--text-muted-dark)] border border-[var(--border-light)]",
};

export function WaitlistForm({
  variant = "dark",
  className = "",
  buttonLabel = "Notify Me",
  showHelper = true,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Try again?");
        return;
      }
      setStatus("success");
      setMessage("You're on the list. We'll be in touch.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again?");
    }
  }

  const helperColor =
    variant === "dark"
      ? status === "success"
        ? "text-[var(--primary)]"
        : "text-white/55"
      : status === "success"
        ? "text-[var(--primary)]"
        : "text-[var(--text-muted-dark)]";

  return (
    <div className={`flex w-full max-w-[480px] flex-col gap-3 ${className}`}>
      <form onSubmit={onSubmit} className="flex w-full">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          aria-label="Email address"
          className={`h-[52px] flex-1 rounded-l-[4px] border-none px-5 text-[14px] font-light outline-none ${inputClass[variant]}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-[52px] cursor-pointer rounded-r-[4px] bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[2px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : buttonLabel}
        </button>
      </form>
      {message ? (
        <p className={`text-[12px] font-light ${helperColor}`}>{message}</p>
      ) : showHelper ? (
        <p className={`text-[11px] font-light ${variant === "dark" ? "text-white/40" : "text-[var(--text-muted-dark)]"}`}>
          No spam. Unsubscribe any time. Opening events only.
        </p>
      ) : null}
    </div>
  );
}
