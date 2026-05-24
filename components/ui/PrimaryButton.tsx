import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "solid" | "outline-light" | "outline-dark";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  solid:
    "bg-[var(--primary)] text-white hover:bg-[#a82d1d]",
  "outline-light":
    "border border-white/30 text-white hover:bg-white hover:text-[var(--text-dark)]",
  "outline-dark":
    "border border-[var(--text-dark)]/20 text-[var(--text-dark)] hover:bg-[var(--text-dark)] hover:text-white",
};

const baseClass =
  "inline-flex h-[48px] items-center justify-center px-7 text-[12px] font-semibold tracking-[2px] uppercase transition-colors cursor-pointer";

type LinkButtonProps = CommonProps & { href: string };

export function PrimaryLink({
  children,
  href,
  variant = "solid",
  className = "",
}: LinkButtonProps) {
  return (
    <Link href={href} className={`${baseClass} ${variantClass[variant]} ${className}`}>
      {children}
    </Link>
  );
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  children,
  variant = "solid",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button {...rest} className={`${baseClass} ${variantClass[variant]} ${className}`}>
      {children}
    </button>
  );
}
