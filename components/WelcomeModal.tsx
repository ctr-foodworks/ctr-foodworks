"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Eyebrow } from "./ui/Eyebrow";
import { WaitlistForm } from "./WaitlistForm";

/**
 * First-visit welcome modal — dims the page and offers a quick email
 * signup before the user explores. Modeled after thectratlanta.com's
 * "Sign Up & Tune In" popover. Brand colors (primary red on cream).
 *
 * Persistence: once dismissed (X / Escape / backdrop click / form submit)
 * we write a flag to localStorage so the modal never shows again for that
 * browser. No expiry — first-visit-only by design.
 *
 * Renders nothing during SSR + on subsequent visits to keep the page lean.
 */
const STORAGE_KEY = "ctr-welcome-dismissed";
// Small delay so the page has time to paint before the modal pops — avoids
// the modal feeling like an aggressive interstitial.
const SHOW_DELAY_MS = 900;
// Keep in sync with the welcome-fade-out / welcome-card-out keyframes below.
const EXIT_ANIMATION_MS = 280;

export function WelcomeModal() {
  // `mounted` defers any DOM/localStorage access to after hydration so the
  // server-rendered output is always empty (no flash, no hydration mismatch).
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  // `closing` lets the modal run an exit animation before unmounting so it
  // fades out smoothly rather than popping off the page.
  const [closing, setClosing] = useState(false);

  // Mount + initial localStorage check
  useEffect(() => {
    setMounted(true);
    let timer: number | undefined;
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
      }
    } catch {
      // Private browsing / storage disabled — fail silent, don't show modal
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    if (closing) return;
    // Persist the flag immediately so a page refresh during the exit
    // animation still counts as "dismissed."
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, EXIT_ANIMATION_MS);
  }

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Body scroll lock while modal is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
      // Form submit bubbles up — flag dismissed so we don't pester them when
      // they return from /thanks/. The form itself handles the actual POST
      // to Netlify Forms.
      onSubmit={() => {
        try {
          window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          // ignore
        }
      }}
    >
      {/* Backdrop (click to dismiss) */}
      <button
        type="button"
        aria-label="Close welcome dialog"
        onClick={dismiss}
        className={`welcome-modal-backdrop absolute inset-0 cursor-pointer bg-black/65 ${
          closing ? "welcome-modal-backdrop-exit" : ""
        }`}
      />

      {/* Card */}
      <div
        className={`welcome-modal-card relative z-10 flex w-full max-w-[920px] flex-col overflow-hidden bg-[var(--primary)] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] ${
          closing ? "welcome-modal-card-exit" : ""
        }`}
      >
        {/* X — top-right */}
        <button
          type="button"
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center text-white/85 transition-colors hover:bg-white/10 hover:text-white lg:right-5 lg:top-5"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 items-stretch lg:grid-cols-[1.3fr_1fr]">
          {/* Left — copy + form */}
          <div className="flex flex-col gap-5 p-8 lg:p-12">
            <Eyebrow tone="light">Now Open · Downtown Atlanta</Eyebrow>
            <h2
              id="welcome-modal-title"
              className="font-display text-[40px] font-black uppercase leading-[0.95] tracking-[-1px] text-white lg:text-[56px]"
            >
              JOIN US.
              <br />
              STAY TUNED.
            </h2>
            <div className="h-[2px] w-12 bg-white/50" />
            <p className="max-w-[440px] text-[14px] font-light leading-[1.7] text-white/85 lg:text-[15px]">
              Get first word on events, vendor news, and what&apos;s pouring at downtown Atlanta&apos;s newest food hall.
            </p>
            <WaitlistForm
              variant="dark"
              buttonLabel="Join"
              buttonTone="ink"
              showHelper={false}
              source="welcome-modal"
              onSuccess={dismiss}
            />
            <p className="text-[10px] font-light leading-[1.5] text-white/55">
              No spam. Unsubscribe any time.
            </p>
          </div>

          {/* Right — black accent panel with the stacked CTR logo. Black gives
              the card the contrast the flat red lacked. Shown on mobile as a
              bottom band (shorter) so the accent carries to small screens. */}
          <div className="flex items-center justify-center bg-[var(--bg-dark)] px-8 py-10 lg:p-12">
            <img
              src="/logos/ctr-stacked-white.svg"
              alt=""
              aria-hidden="true"
              className="h-auto w-[150px] opacity-95 lg:w-full lg:max-w-[240px]"
            />
          </div>
        </div>
      </div>

      {/* Animations scoped to this modal so they don't leak into other
          fixed/overlay components on the page. Exit classes take precedence
          when `closing` is true so the modal fades out gracefully before the
          parent unmounts it. */}
      <style>{`
        .welcome-modal-backdrop {
          animation: welcome-fade-in 280ms ease-out both;
        }
        .welcome-modal-card {
          animation: welcome-card-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .welcome-modal-backdrop-exit {
          animation: welcome-fade-out 280ms ease-in both;
        }
        .welcome-modal-card-exit {
          animation: welcome-card-out 280ms cubic-bezier(0.4, 0, 1, 1) both;
        }
        @keyframes welcome-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes welcome-card-in {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes welcome-fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes welcome-card-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-6px) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
