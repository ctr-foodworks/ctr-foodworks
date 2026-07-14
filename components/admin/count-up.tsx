"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated number: counts 0 → `value` with an ease-out-cubic curve the first
 * time the element scrolls into view. Under prefers-reduced-motion (or after
 * the first reveal, e.g. on an auto-refresh) it renders the value directly.
 */
export function CountUp({
  value,
  duration = 1200,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  /** Animation length in ms. */
  duration?: number;
  decimals?: number;
  /** Rendered right after the number, e.g. "%". */
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Value changed after the initial reveal (auto-refresh) → snap, no replay.
    if (startedRef.current) {
      setDisplay(value);
      return;
    }

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      startedRef.current = true;
      setDisplay(value);
      return;
    }

    let frame = 0;
    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(value * eased);
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer?.disconnect();
            run();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(el);
    } else {
      run();
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(display) ? display : 0);

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
