import type { ElementType, ReactNode } from "react";

type Tone = "cream" | "white" | "dark" | "navy" | "plum" | "primary";

type Props = {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  as?: ElementType;
  className?: string;
  bleed?: boolean;
};

const toneClass: Record<Tone, string> = {
  cream: "bg-[var(--bg-cream)] text-[var(--text-dark)]",
  white: "bg-white text-[var(--text-dark)]",
  dark: "bg-[var(--bg-dark)] text-white",
  navy: "bg-[var(--secondary-navy)] text-white",
  plum: "bg-[var(--secondary-plum)] text-white",
  primary: "bg-[var(--primary)] text-white",
};

export function Section({
  children,
  tone = "white",
  id,
  as: Tag = "section",
  className = "",
  bleed = false,
}: Props) {
  const padding = bleed
    ? ""
    : "px-6 py-[80px] lg:px-[60px] lg:py-[120px]";
  return (
    <Tag id={id} className={`w-full ${toneClass[tone]} ${padding} ${className}`}>
      {children}
    </Tag>
  );
}
