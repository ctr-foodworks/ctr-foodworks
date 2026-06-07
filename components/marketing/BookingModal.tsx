"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TripleseatForm } from "./TripleseatForm";

/**
 * Trigger button + modal wrapper for the Tripleseat private-event form.
 *
 * The form used to render inline on /events; now it lives behind a button so
 * the page stays light and the heavy third-party embed only loads on intent.
 *
 * Once opened, the modal stays mounted (just hidden) — Tripleseat's script
 * injects the form DOM exactly once, so unmounting/remounting on every
 * open/close would risk it not re-injecting. We toggle visibility + `inert`
 * instead.
 */
type Props = {
  /** Trigger button label. */
  label?: string;
};

export function BookingModal({ label = "Start your booking" }: Props) {
  const [open, setOpen] = useState(false);
  // True once opened at least once — keeps the form mounted thereafter.
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openModal() {
    setMounted(true);
    setOpen(true);
  }
  function close() {
    setOpen(false);
    // Return focus to the trigger for keyboard users.
    triggerRef.current?.focus();
  }

  // Escape closes; move focus into the dialog on open.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        className="group inline-flex w-fit items-center gap-3 bg-[var(--primary)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      {mounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          inert={!open}
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ease-out lg:p-8 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close booking form"
            onClick={close}
            className="absolute inset-0 cursor-pointer bg-black/65"
          />

          {/* Card */}
          <div
            className={`relative z-10 flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden bg-[var(--bg-warm-white)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              open ? "translate-y-0" : "translate-y-3"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--text-dark)]/10 px-6 py-5 lg:px-10 lg:py-6">
              <div className="flex flex-col gap-2">
                <Eyebrow tone="primary">Book Your Event</Eyebrow>
                <h3
                  id="booking-modal-title"
                  className="font-display text-[24px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)] lg:text-[28px]"
                >
                  Tell us what you&apos;re planning.
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={close}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-[var(--text-dark)]/60 transition-colors hover:bg-[var(--text-dark)]/5 hover:text-[var(--text-dark)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body — the Tripleseat form lives here */}
            <div className="overflow-y-auto px-6 py-6 lg:px-10 lg:py-8">
              <TripleseatForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
