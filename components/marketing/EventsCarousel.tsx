"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import type { Event } from "@/lib/events";

/**
 * Full-bleed event carousel for the Public Events section. One slide per
 * event: a background image (or a branded placeholder until real art lands)
 * under the site's signature dark legibility gradient, with the date / title /
 * copy / CTA anchored bottom-left on the same 1440/1600 shell as the rest of
 * the page.
 *
 * Behaviour: drag/swipe on touch, prev/next + dash indicators on desktop,
 * gentle autoplay that pauses on hover/focus and yields to
 * prefers-reduced-motion. Off-screen slides are `inert` so their CTA links
 * stay out of the tab order.
 *
 * Placeholders are intentional — per Sebastian, real event photography drops
 * in later. To wire a real image, set `imageUrl` on the event in lib/events.ts
 * and it replaces the placeholder with no other change.
 */

const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatDate(iso: string) {
  // Parse YYYY-MM-DD in UTC so the day doesn't shift across local timezones.
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return {
    month: monthNames[(m ?? 1) - 1],
    day: String(d ?? 1).padStart(2, "0"),
    year: String(y ?? 2026),
  };
}

// Brand-tinted gradients cycled across placeholder slides so each reads as an
// intentional color-filled panel (not an empty black frame) until real event
// photography drops in. Vivid tint top-left → dark bottom, which also keeps
// the white headline legible. Cycle: navy, red, plum, ochre.
const placeholderTints = [
  "var(--secondary-navy)",
  "var(--primary)",
  "var(--secondary-plum)",
  "var(--secondary-ochre)",
];

function placeholderFill(tint: string) {
  return `linear-gradient(157deg, ${tint} 0%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.9) 100%)`;
}

// Extra bottom darkening for real photos so the copy always reads. Mirrors the
// PageHero / Hero gradients. (Placeholders already darken toward the bottom.)
const LEGIBILITY_GRADIENT =
  "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0.92) 100%)";

const AUTOPLAY_MS = 6500;
const SWIPE_THRESHOLD_PX = 40;

function PlaceholderBackground({ index }: { index: number }) {
  const tint = placeholderTints[index % placeholderTints.length];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0c0c0a]">
      {/* Brand-tinted fill — gives the slide a full, designed color field */}
      <div
        className="absolute inset-0"
        style={{ background: placeholderFill(tint) }}
      />
      {/* Faint dotted texture so the flat tint has some grain */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}

type Props = {
  events: Event[];
};

export function EventsCarousel({ events }: Props) {
  const count = events.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setActive(((i % count) + count) % count),
    [count],
  );
  const next = useCallback(() => goTo(active + 1), [goTo, active]);
  const prev = useCallback(() => goTo(active - 1), [goTo, active]);

  // Autoplay — pauses on hover/focus and bows out under reduced-motion.
  // `active` is a dependency so the timer resets after manual navigation.
  useEffect(() => {
    if (count <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, count]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  if (count === 0) return null;

  return (
    <div
      className="relative w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Upcoming public events"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      {/* Stage */}
      <div
        className="relative overflow-hidden bg-[#0c0c0a]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {events.map((evt, i) => {
            const d = formatDate(evt.date);
            return (
              <div
                key={evt.slug}
                className="relative h-[440px] w-full flex-shrink-0 md:h-[500px] lg:h-[560px]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${evt.title}`}
                inert={i !== active}
              >
                {/* Background — real photo when provided, else branded placeholder */}
                {evt.imageUrl ? (
                  <img
                    src={evt.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderBackground index={i} />
                )}

                {/* Legibility gradient (kept for real images too) */}
                <div
                  className="absolute inset-0"
                  style={{ background: LEGIBILITY_GRADIENT }}
                />

                {/* "Visual coming soon" chip — only while this slide is a
                    placeholder. Aligned to the page shell, top-left. */}
                {!evt.imageUrl && (
                  <div className="absolute inset-x-0 top-7 z-10 px-6 lg:top-8 lg:px-[60px]">
                    <div className="mx-auto max-w-[1440px] xl:max-w-[1600px]">
                      <span className="inline-flex items-center gap-2 border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-semibold tracking-[3px] uppercase text-white/65 backdrop-blur-sm">
                        <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Visual coming soon
                      </span>
                    </div>
                  </div>
                )}

                {/* Content — anchored bottom, aligned to the page shell */}
                <div className="relative z-10 flex h-full flex-col justify-end">
                  <div className="w-full px-6 pb-24 lg:px-[60px] lg:pb-28">
                    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 lg:gap-5 xl:max-w-[1600px]">
                      <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/55">
                        {evt.category}
                      </span>

                      {/* Date cluster — big day with stacked month/year + time */}
                      <div className="flex items-end gap-4">
                        <span className="font-display text-[60px] font-black leading-[0.8] tracking-[-2px] text-white lg:text-[80px]">
                          {d.day}
                        </span>
                        <div className="flex flex-col pb-1.5">
                          <span className="text-[12px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
                            {d.month} {d.year}
                          </span>
                          {evt.time && (
                            <span className="text-[11px] font-light tracking-[1px] uppercase text-white/55">
                              {evt.time}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="max-w-[800px] font-display text-[34px] font-black uppercase leading-[0.95] tracking-[-1px] text-white lg:text-[52px]">
                        {evt.title}
                      </h3>

                      <p className="max-w-[560px] text-[14px] font-light leading-[1.7] text-white/70 lg:text-[15px]">
                        {evt.description}
                      </p>

                      {evt.ctaUrl && (
                        <Link
                          href={evt.ctaUrl}
                          className="group mt-1 inline-flex w-fit items-center gap-3 border border-white/30 px-5 py-3 text-[11px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-white hover:text-[var(--text-dark)]"
                        >
                          {evt.ctaLabel ?? "Details"}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls — overlaid at the bottom, aligned to the same shell. The row
          itself is click-through (pointer-events-none) so only the buttons
          capture clicks, never the empty space over the slide content. */}
      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-20 px-6 lg:bottom-8 lg:px-[60px]">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 xl:max-w-[1600px]">
            {/* Dash indicators — echo the brand's h-[2px] accent rule */}
            <div className="pointer-events-auto flex items-center gap-2">
              {events.map((evt, i) => (
                <button
                  key={evt.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}: ${evt.title}`}
                  aria-current={i === active}
                  className="group flex h-4 items-center"
                >
                  <span
                    className={`block h-[2px] transition-all duration-300 ${
                      i === active
                        ? "w-10 bg-[var(--primary)]"
                        : "w-5 bg-white/30 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Counter + arrows */}
            <div className="pointer-events-auto flex items-center gap-4">
              <span className="text-[11px] font-semibold tabular-nums tracking-[3px] uppercase text-white/55">
                {String(active + 1).padStart(2, "0")}
                <span className="text-white/30"> / {String(count).padStart(2, "0")}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous event"
                  className="flex h-11 w-11 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white hover:text-[var(--text-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next event"
                  className="flex h-11 w-11 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white hover:text-[var(--text-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
