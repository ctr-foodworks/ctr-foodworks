import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light" | "primary";
};

const toneClass: Record<NonNullable<Props["tone"]>, string> = {
  dark: "text-[var(--text-muted-dark)]",
  light: "text-white/55",
  primary: "text-[var(--primary)]",
};

export function Eyebrow({ children, className = "", tone = "dark" }: Props) {
  return (
    <span
      className={`text-[11px] font-semibold tracking-[5px] uppercase ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
