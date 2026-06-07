"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * "What We Host" — the private-event types CTR Food Works takes on, laid out
 * as a vertical timeline. A sticky heading sits on the left while the timeline
 * scrolls on the right; each entry fades up into view as it's reached.
 *
 * Renders only the two-column grid — it's dropped inside the padded Private
 * Events section, so it inherits that section's shell margins (no full-bleed).
 * Text-forward by design; add an image per entry later if desired.
 */
type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: "Full Venue Buyouts",
    description:
      "Take the whole hall for the night — every kitchen, the largest bar in Georgia, and the atrium under one roof. A turnkey canvas that scales from a few hundred guests to the full building.",
  },
  {
    title: "Brand Activations & Launches",
    description:
      "Product launches, press dinners, pop-ups, and experiential takeovers. Photogenic spaces, built-in energy, and a downtown address that puts your brand in the center of it all.",
  },
  {
    title: "Corporate Dinners & Conferences",
    description:
      "Board dinners, team offsites, and conference receptions. Flexible rooms and chef-driven menus from a dozen kitchens — no single caterer required.",
  },
  {
    title: "Weddings & Receptions",
    description:
      "Receptions and rehearsal dinners where the cocktail hour is the food hall itself. Globe-spanning menus and a room that already feels like a celebration.",
  },
  {
    title: "Game-Day Takeovers",
    description:
      "Two blocks from Mercedes-Benz Stadium. Pre-game spreads, watch parties, and post-game pours — gather your crew where the whole city is already headed.",
  },
  {
    title: "Milestone Celebrations",
    description:
      "Birthdays, anniversaries, retirements, and the moments in between. Bring the people; we handle the food, the drinks, and the room.",
  },
];

function TimelineItem({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);
  const number = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`relative pb-14 pl-10 last:pb-0 transition-all duration-700 ease-out lg:pb-16 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {/* Node on the timeline */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-[3px] h-[15px] w-[15px] rounded-full border-2 border-[var(--primary)] bg-[#f9f4f0]"
      />
      <span className="text-[11px] font-semibold tracking-[4px] uppercase text-[var(--primary)]">
        {number}
      </span>
      <h3 className="mt-3 font-display text-[28px] font-black uppercase leading-[1] tracking-[-0.5px] text-[var(--text-dark)] lg:text-[36px]">
        {feature.title}
      </h3>
      <p className="mt-3 max-w-[560px] text-[15px] font-light leading-[1.9] text-[var(--text-muted-dark)] lg:text-[16px]">
        {feature.description}
      </p>
    </li>
  );
}

export function HostingShowcase() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16 xl:gap-24">
      {/* Left — sticky heading */}
      <div className="flex flex-col gap-5 lg:sticky lg:top-[100px] lg:self-start">
        <Eyebrow tone="primary">What We Host</Eyebrow>
        <DisplayHeading size="md" className="text-[var(--text-dark)]">
          ANY OCCASION,
          <br />
          ANY SCALE.
        </DisplayHeading>
        <div className="h-[2px] w-12 bg-[var(--primary)]" />
        <p className="max-w-[420px] text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)] lg:text-[16px]">
          From intimate dinners to full-building takeovers — a look at what the hall can become.
        </p>
      </div>

      {/* Right — timeline */}
      <ol className="relative flex flex-col">
        {/* Connecting line, behind the nodes */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-px bg-[var(--text-dark)]/15"
        />
        {features.map((feature, i) => (
          <TimelineItem key={feature.title} feature={feature} index={i} />
        ))}
      </ol>
    </div>
  );
}
