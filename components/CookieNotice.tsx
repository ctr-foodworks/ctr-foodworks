"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ctr-cookie-consent";
const FADE_OUT_MS = 450;

type Consent = "all" | "necessary";

export function CookieNotice() {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (existing) return;
    } catch {
      // localStorage unavailable (private mode, etc.) — still show the notice
    }
    const t = window.setTimeout(() => setMounted(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const accept = (level: Consent) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ level, ts: Date.now() })
      );
    } catch {
      // ignore
    }
    setLeaving(true);
    window.setTimeout(() => setMounted(false), FADE_OUT_MS);
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      aria-hidden={leaving}
      style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
      className={`fixed bottom-4 left-4 right-4 z-[60] transition-all ease-out sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-[420px] ${
        leaving
          ? "pointer-events-none translate-y-3 opacity-0"
          : "animate-[fadeUp_0.45s_ease-out] translate-y-0 opacity-100"
      }`}
    >
      <div className="relative overflow-hidden border border-[var(--text-dark)] bg-white text-[var(--text-dark)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 p-6 lg:p-7">
          <span
            id="cookie-title"
            className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--text-dark)]"
          >
            Privacy & Cookies
          </span>
          <p
            id="cookie-desc"
            className="text-[13px] font-light leading-[1.7] text-[var(--text-muted-dark)]"
          >
            We use cookies to enhance your visit, remember your preferences, and understand how you use the site. You&apos;re in control — choose what&apos;s right for you.
          </p>
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={() => accept("necessary")}
              disabled={leaving}
              className="h-[42px] flex-1 cursor-pointer border border-[var(--text-dark)] px-5 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white disabled:cursor-default"
            >
              Necessary only
            </button>
            <button
              type="button"
              onClick={() => accept("all")}
              disabled={leaving}
              className="h-[42px] flex-1 cursor-pointer bg-[var(--text-dark)] px-5 text-[11px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[var(--primary)] disabled:cursor-default"
            >
              Accept all
            </button>
          </div>
          <a
            href="#"
            className="self-start text-[11px] font-medium text-[var(--text-muted-dark)] underline decoration-[var(--text-dark)]/30 underline-offset-4 transition-colors hover:text-[var(--text-dark)]"
          >
            Read our privacy policy
          </a>
        </div>
      </div>
    </div>
  );
}
