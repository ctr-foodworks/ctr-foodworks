"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ctr-cookie-consent";

type Consent = "all" | "necessary";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (existing) return;
    } catch {
      // localStorage unavailable (private mode, etc.) — still show the notice
    }
    const t = window.setTimeout(() => setVisible(true), 600);
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
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed bottom-4 left-4 right-4 z-[60] animate-[fadeUp_0.45s_ease-out] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-[420px]"
    >
      <div className="relative overflow-hidden bg-[var(--bg-dark)] text-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)]">
        {/* Top accent rule */}
        <div className="h-[2px] w-full bg-[var(--primary)]" />

        <div className="flex flex-col gap-4 p-6 lg:p-7">
          <span
            id="cookie-title"
            className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--secondary-ochre)]"
          >
            Privacy & Cookies
          </span>
          <p
            id="cookie-desc"
            className="text-[13px] font-light leading-[1.7] text-white/70"
          >
            We use cookies to enhance your visit, remember your preferences, and understand how you use the site. You&apos;re in control — choose what&apos;s right for you.
          </p>
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={() => accept("necessary")}
              className="h-[42px] flex-1 cursor-pointer border border-white/25 px-5 text-[11px] font-semibold tracking-[3px] uppercase text-white/80 transition-colors hover:bg-white hover:text-[var(--text-dark)]"
            >
              Necessary only
            </button>
            <button
              type="button"
              onClick={() => accept("all")}
              className="h-[42px] flex-1 cursor-pointer bg-[var(--primary)] px-5 text-[11px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
            >
              Accept all
            </button>
          </div>
          <a
            href="#"
            className="self-start text-[11px] font-medium text-white/40 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/70"
          >
            Read our privacy policy
          </a>
        </div>
      </div>
    </div>
  );
}
