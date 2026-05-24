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

/**
 * Email-only waitlist signup. Submits via Netlify Forms (zero backend) —
 * Netlify detects the form at deploy time via `data-netlify="true"`. The
 * submission lands in the `waitlist` form bucket on the Netlify dashboard,
 * separate from the longer `contact` form on /connect. After submit the
 * user lands on /thanks/.
 *
 * Server-rendered (no "use client") — plain HTML form, no JS state.
 */
export function WaitlistForm({
  variant = "dark",
  className = "",
  buttonLabel = "Notify Me",
  showHelper = true,
}: Props) {
  return (
    <div className={`flex w-full max-w-[480px] flex-col gap-3 ${className}`}>
      <form
        name="waitlist"
        method="POST"
        action="/thanks/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
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
          className={`h-[52px] flex-1 rounded-l-[4px] border-none px-5 text-[14px] font-light outline-none ${inputClass[variant]}`}
        />
        <button
          type="submit"
          className="h-[52px] cursor-pointer rounded-r-[4px] bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[2px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
        >
          {buttonLabel}
        </button>
      </form>
      {showHelper ? (
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
