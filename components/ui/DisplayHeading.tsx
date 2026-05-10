import type { ElementType, ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl";

type Props = {
  children: ReactNode;
  as?: ElementType;
  size?: Size;
  className?: string;
};

const sizeClass: Record<Size, string> = {
  sm: "text-[36px] leading-[0.95] lg:text-[48px]",
  md: "text-[48px] leading-[0.92] lg:text-[64px]",
  lg: "text-[56px] leading-[0.9] lg:text-[80px]",
  xl: "text-[64px] leading-[0.88] lg:text-[104px]",
};

export function DisplayHeading({
  children,
  as: Tag = "h2",
  size = "md",
  className = "",
}: Props) {
  return (
    <Tag className={`font-display font-black ${sizeClass[size]} ${className}`}>
      {children}
    </Tag>
  );
}
