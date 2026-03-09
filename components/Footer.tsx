import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-dark)] flex flex-col items-center gap-6 py-[60px] px-[120px]">
      <img
        src="/logos/ctr-inline-white.svg"
        alt="CTR Food Works"
        className="h-8 w-auto"
      />

      <span className="text-[13px] font-light tracking-[1px] text-[var(--text-muted-light)]">
        Atlanta&apos;s reimagined downtown landmark &mdash; Opening Spring 2026
      </span>

      <div className="w-10 h-px bg-white/20" />

      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[11px] font-medium tracking-[4px] text-white/40">HOURS</span>
        <span className="text-[12px] font-light text-[var(--text-muted-light)]">Sunday &ndash; Wednesday &nbsp;&middot;&nbsp; 11 AM &ndash; 9 PM</span>
        <span className="text-[12px] font-light text-[var(--text-muted-light)]">Thursday &ndash; Saturday &nbsp;&middot;&nbsp; 11 AM &ndash; 10 PM</span>
      </div>

      <div className="w-10 h-px bg-white/20" />

      <div className="flex items-center gap-6">
        <Instagram className="w-5 h-5 text-[var(--text-muted-light)]" />
        <Twitter className="w-5 h-5 text-[var(--text-muted-light)]" />
        <Facebook className="w-5 h-5 text-[var(--text-muted-light)]" />
      </div>

      <span className="text-[11px] font-light text-[var(--text-muted-light)]">
        &copy; 2026 The Center, Atlanta. All rights reserved.
      </span>
    </footer>
  );
}
