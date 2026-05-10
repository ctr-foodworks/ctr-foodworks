import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  ctaHref: string;
  ctaLabel: string;
  tone?: "dark" | "primary" | "plum";
};

const toneClass: Record<NonNullable<Props["tone"]>, string> = {
  dark: "bg-[var(--bg-dark)] text-white",
  primary: "bg-[var(--primary)] text-white",
  plum: "bg-[var(--secondary-plum)] text-white",
};

export function CTAStrip({
  eyebrow,
  title,
  ctaHref,
  ctaLabel,
  tone = "dark",
}: Props) {
  return (
    <section className={`w-full ${toneClass[tone]}`}>
      <div className="flex flex-col gap-6 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-[60px] lg:py-16">
        <div className="flex flex-col gap-3 lg:max-w-[560px]">
          <span className="text-[10px] font-semibold tracking-[5px] uppercase text-white/55">
            {eyebrow}
          </span>
          <h3 className="font-display text-[36px] font-black leading-[0.95] tracking-[-0.5px] lg:text-[52px]">
            {title}
          </h3>
        </div>
        <Link
          href={ctaHref}
          className="group inline-flex items-center gap-3 self-start border border-white/30 px-6 py-3 transition-colors hover:bg-white hover:text-[var(--text-dark)] lg:self-auto"
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
