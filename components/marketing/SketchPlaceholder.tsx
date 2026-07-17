"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

type Aspect = "square" | "portrait" | "landscape";

type Props = {
  src: string;
  alt: string;
  prompt: string;
  aspect?: Aspect;
  className?: string;
};

const aspectClass: Record<Aspect, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
};

export function SketchPlaceholder({
  src,
  alt,
  prompt,
  aspect = "landscape",
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // The img's onError doesn't fire on a hydrated <img> that already broke
    // during SSR, so we check the broken state ourselves on mount.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  if (!failed) {
    return (
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`${aspectClass[aspect]} w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${aspectClass[aspect]} relative w-full overflow-hidden border border-dashed border-[var(--text-dark)]/40 bg-[var(--bg-cream)] ${className}`}
    >
      <div className="flex h-full flex-col gap-4 overflow-auto p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--text-dark)]/55">
            Missing sketch — paste this into your AI image model
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="flex flex-shrink-0 items-center gap-1.5 border border-[var(--text-dark)]/40 px-3 py-1.5 text-[10px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
            aria-label="Copy prompt"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy
              </>
            )}
          </button>
        </div>
        <div className="text-[10px] font-light tracking-[2px] uppercase text-[var(--text-dark)]/50">
          → save as <code className="font-mono normal-case tracking-normal text-[var(--text-dark)]/75">{src}</code>
        </div>
        <pre className="flex-1 whitespace-pre-wrap break-words font-mono text-[11px] leading-[1.6] text-[var(--text-dark)]/80 lg:text-[12px]">
          {prompt}
        </pre>
      </div>
    </div>
  );
}
