"use client";

import { useEffect, useRef, useState } from "react";

type Size = "sm" | "lg";

type Props = {
  name: string;
  /** Path under public/, e.g. /logos/vendors/morellis.svg */
  logoUrl?: string;
  size?: Size;
  className?: string;
};

const sizeClass: Record<Size, string> = {
  sm: "h-12 w-12 text-[12px] lg:h-14 lg:w-14 lg:text-[13px]",
  lg: "h-20 w-20 text-[18px] lg:h-24 lg:w-24 lg:text-[20px]",
};

function initialsFor(name: string): string {
  // 2-letter monogram. Strip leading "The " so "The Sparrow" → "SP".
  const cleaned = name.replace(/^the\s+/i, "");
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  // Fallback: first two letters of the single word
  return cleaned.slice(0, 2).toUpperCase();
}

export function VendorLogo({
  name,
  logoUrl,
  size = "sm",
  className = "",
}: Props) {
  const [failed, setFailed] = useState(!logoUrl);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Detect SSR-broken images that don't fire onError on the client
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  const dims = sizeClass[size];

  if (failed || !logoUrl) {
    // Styled placeholder badge: warm cream disc, black border, vendor initials
    return (
      <div
        aria-label={`${name} logo placeholder`}
        className={`flex items-center justify-center rounded-full border border-[var(--text-dark)] bg-[#f9f4f0] font-display font-black tracking-[-0.5px] text-[var(--text-dark)] ${dims} ${className}`}
      >
        {initialsFor(name)}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={logoUrl}
      alt={`${name} logo`}
      onError={() => setFailed(true)}
      className={`rounded-full bg-[#f9f4f0] object-contain p-2 ${dims} ${className}`}
    />
  );
}
