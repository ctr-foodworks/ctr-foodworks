"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

const INQUIRIES_INBOX = "inquiries@ctrfoodworks.com";
const CATEGORIES = ["General", "Press", "Partnerships", "Careers"] as const;
type Category = (typeof CATEGORIES)[number];

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Connect page contact form. Submits JSON to /api/contact over AJAX so the
 * user stays on /connect. On success the form is replaced with an inline
 * confirmation card.
 *
 * Also reads `?category=Press` (etc.) from the URL on mount so links from
 * the Footer ("Press Inquiries") and the Events page can deep-link straight
 * to the right category without the user having to re-select it.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [category, setCategory] = useState<Category>("General");

  useEffect(() => {
    // Read ?category= from the URL on mount. Case-insensitive match against
    // the known CATEGORIES; unknown values fall back to the default.
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("category");
    if (!raw) return;
    const match = CATEGORIES.find(
      (c) => c.toLowerCase() === raw.toLowerCase(),
    );
    if (match) setCategory(match);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      category: String(formData.get("category") ?? ""),
      message: String(formData.get("message") ?? ""),
      botField: String(formData.get("bot-field") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        // Google Ads conversion — "Submit lead form". Fired here (not on a
        // separate thank-you page) because this form succeeds inline via AJAX.
        window.gtag?.("event", "conversion", {
          send_to: "AW-18316984603/v8w3CNOk5c4cEJuCnJ5E",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  // Success state — replace form with inline confirmation
  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="contact-form-success flex flex-col gap-5 bg-white p-8 lg:p-10"
      >
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
            Message Sent
          </span>
          <h3 className="font-display text-[28px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)] lg:text-[36px]">
            Thanks for writing in.
          </h3>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
        </div>
        <p className="text-[14px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
          Your note landed in our inbox. We&rsquo;ll get back to you within
          one business day &mdash; usually faster.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="self-start text-[11px] font-semibold tracking-[3px] uppercase text-[var(--primary)] underline-offset-4 transition-colors hover:underline"
        >
          Send another
        </button>
        <style>{`
          .contact-form-success {
            animation: contact-form-success 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
          }
          @keyframes contact-form-success {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 bg-white p-8 lg:p-10"
    >
      {/* Honeypot — hidden from real users, catches naive bots */}
      <p className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human:{" "}
          <input name="bot-field" />
        </label>
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-first-name"
            className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]"
          >
            First name
          </label>
          <input
            id="contact-first-name"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            disabled={status === "submitting"}
            className="border border-[var(--text-dark)]/20 bg-white px-4 py-3 text-[14px] font-light text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/60 focus:border-[var(--primary)] disabled:opacity-60"
            placeholder="First name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-last-name"
            className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]"
          >
            Last name
          </label>
          <input
            id="contact-last-name"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            disabled={status === "submitting"}
            className="border border-[var(--text-dark)]/20 bg-white px-4 py-3 text-[14px] font-light text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/60 focus:border-[var(--primary)] disabled:opacity-60"
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-email"
          className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={status === "submitting"}
          className="border border-[var(--text-dark)]/20 bg-white px-4 py-3 text-[14px] font-light text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/60 focus:border-[var(--primary)] disabled:opacity-60"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-category"
          className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]"
        >
          Category
        </label>
        <select
          id="contact-category"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          disabled={status === "submitting"}
          className="border border-[var(--text-dark)]/20 bg-white px-4 py-3 text-[14px] font-light text-[var(--text-dark)] outline-none transition-colors focus:border-[var(--primary)] disabled:opacity-60"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          disabled={status === "submitting"}
          className="border border-[var(--text-dark)]/20 bg-white px-4 py-3 text-[14px] font-light text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/60 focus:border-[var(--primary)] disabled:opacity-60"
          placeholder="Tell us what's on your mind…"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-2 inline-flex items-center justify-center gap-3 self-start bg-[var(--primary)] px-7 py-4 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d] disabled:cursor-wait disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
        {status !== "submitting" && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>

      {status === "error" ? (
        <p className="text-[12px] font-medium text-[var(--primary)]" role="alert">
          Something went wrong. Try again, or email us at {INQUIRIES_INBOX}.
        </p>
      ) : (
        <p className="text-[11px] font-light leading-[1.5] text-[var(--text-muted-dark)]">
          Replies land in {INQUIRIES_INBOX}.
        </p>
      )}
    </form>
  );
}
