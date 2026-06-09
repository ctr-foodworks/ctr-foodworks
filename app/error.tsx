"use client";

import { useEffect } from "react";

/**
 * App-level error boundary. Catches render errors in pages/segments and shows a
 * recoverable screen instead of the default "Application error" message.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the console for debugging (digest links to the server log).
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-warm-white)] px-6 text-center">
      <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-[40px] font-black uppercase leading-[0.95] tracking-[-1px] text-[var(--text-dark)]">
        Oops.
      </h1>
      <p className="mt-4 max-w-[420px] text-[14px] font-light leading-[1.7] text-[var(--text-muted-dark)]">
        An unexpected error occurred. Try again — if it keeps happening, refresh
        the page.
      </p>
      <div className="mt-7 flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-[48px] items-center justify-center bg-[var(--primary)] px-7 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
        >
          Try again
        </button>
        <a
          href="/"
          className="text-[12px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)] hover:text-[var(--text-dark)]"
        >
          Go home
        </a>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-[11px] text-[var(--text-muted-dark)]/60">
          ref: {error.digest}
        </p>
      )}
    </div>
  );
}
