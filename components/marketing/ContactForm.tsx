"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

const INQUIRIES_INBOX = "inquiries@ctrfoodworks.com";
const CATEGORIES = ["General", "Press", "Partnerships", "Careers"] as const;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Connect page contact form. Submits via Netlify Forms over AJAX so the
 * user stays on /connect instead of navigating to /thanks/. On success the
 * form is replaced with an inline confirmation card. Falls back to a plain
 * POST → /thanks/ if JS is disabled (the static HTML attributes are still
 * present, which is also what Netlify's deploy-time scanner needs).
 */
export function ContactForm() {
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
      name="contact"
      method="POST"
      action="/thanks/"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 bg-white p-8 lg:p-10"
    >
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot — hidden from real users, catches naive bots */}
      <p className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human:{" "}
          <input name="bot-field" />
        </label>
      </p>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-name"
          className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)]"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          disabled={status === "submitting"}
          className="border border-[var(--text-dark)]/20 bg-white px-4 py-3 text-[14px] font-light text-[var(--text-dark)] outline-none transition-colors placeholder:text-[var(--text-muted-dark)]/60 focus:border-[var(--primary)] disabled:opacity-60"
          placeholder="Your full name"
        />
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
          defaultValue="General"
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
