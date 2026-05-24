import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Tone = "dark" | "primary" | "plum" | "grey";

type Props = {
  eyebrow: string;
  title: ReactNode;
  ctaHref: string;
  ctaLabel: string;
  tone?: Tone;
};

type ToneStyle = {
  container: string;
  eyebrow: string;
  cta: string;
};

const toneStyles: Record<Tone, ToneStyle> = {
  dark: {
    container: "bg-[var(--bg-dark)] text-white",
    eyebrow: "text-white/55",
    cta: "border-white/30 text-white hover:bg-white hover:text-[var(--text-dark)]",
  },
  primary: {
    container: "bg-[var(--primary)] text-white",
    eyebrow: "text-white/65",
    cta: "border-white/40 text-white hover:bg-white hover:text-[var(--primary)]",
  },
  plum: {
    container: "bg-[var(--secondary-plum)] text-white",
    eyebrow: "text-white/55",
    cta: "border-white/30 text-white hover:bg-white hover:text-[var(--text-dark)]",
  },
  grey: {
    container: "bg-[#e8e6e3] text-[var(--text-dark)]",
    eyebrow: "text-[var(--text-muted-dark)]",
    cta: "border-[var(--text-dark)]/30 text-[var(--text-dark)] hover:bg-[var(--text-dark)] hover:text-white",
  },
};

export function CTAStrip({
  eyebrow,
  title,
  ctaHref,
  ctaLabel,
  tone = "dark",
}: Props) {
  const style = toneStyles[tone];
  return (
    <section className={`w-full py-14 lg:py-16 ${style.container}`}>
      {/* Inner content capped tighter than the global shell so the button
          stays clustered with the headline instead of drifting to the far
          right of a 2000px shell on wide monitors. */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-[60px] xl:max-w-[1600px]">
        <div className="flex flex-col gap-3 lg:max-w-[640px]">
          <span
            className={`text-[10px] font-semibold tracking-[5px] uppercase ${style.eyebrow}`}
          >
            {eyebrow}
          </span>
          <h3 className="font-display text-[36px] font-black leading-[0.95] tracking-[-0.5px] lg:text-[52px]">
            {title}
          </h3>
        </div>
        <Link
          href={ctaHref}
          className={`group inline-flex items-center gap-3 self-start border px-6 py-3 transition-colors lg:self-auto ${style.cta}`}
        >
          <span className="text-[11px] font-semibold tracking-[3px] uppercase">
            {ctaLabel}
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
