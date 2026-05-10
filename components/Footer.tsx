import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { vendors } from "@/lib/vendors";
import { hours } from "@/lib/hours";

const visitLinks = [
  { href: "/visit", label: "Hours & Location" },
  { href: "/visit#getting-here", label: "Getting Here" },
  { href: "/visit#private-events", label: "Private Events" },
  { href: "/visit#accessibility", label: "Accessibility" },
];

const aboutLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/about#fifa", label: "FIFA World Cup 2026™" },
  { href: "/#waitlist", label: "Join the Waitlist" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-dark)] text-white">
      <div className="grid gap-12 px-6 py-[80px] lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10 lg:px-[60px]">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <img
            src="/logos/ctr-inline-white.svg"
            alt="CTR Food Works"
            className="h-7 w-auto"
          />
          <p className="max-w-[320px] text-[14px] font-light leading-[1.7] text-white/55">
            Downtown Atlanta&apos;s Food Hall. 11 chef-driven dining concepts and 1 extraordinary bar, inside the reimagined former CNN Center. Opening Spring 2026.
          </p>
          <p className="text-[12px] font-light leading-[1.8] text-white/35">
            190 Marietta St. NW
            <br />
            Atlanta, GA 30303
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-semibold tracking-[4px] uppercase text-white/35">
              Hours
            </span>
            <ul className="mt-3 flex flex-col gap-1.5">
              {hours.map((row) => (
                <li
                  key={row.days}
                  className={`text-[12px] font-light ${
                    row.emphasis ? "text-[var(--secondary-ochre)]" : "text-white/55"
                  }`}
                >
                  {row.days} · {row.hours}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FooterColumn
          title="Dining"
          items={vendors.slice(0, 7).map((v) => ({
            href: `/dining#${v.slug}`,
            label: v.name,
          }))}
        />

        <FooterColumn title="Visit" items={visitLinks} />

        <FooterColumn title="About" items={aboutLinks} />
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-6 text-[12px] text-white/35 lg:flex-row lg:items-center lg:justify-between lg:px-[60px]">
        <p className="font-light">
          © {new Date().getFullYear()} The Center Food Works, Atlanta. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="flex items-center gap-2 transition-colors hover:text-[var(--secondary-ochre)]"
          >
            <Instagram className="h-4 w-4" />
            <span className="text-[10px] font-semibold tracking-[3px] uppercase">
              Instagram
            </span>
          </a>
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            className="flex items-center gap-2 transition-colors hover:text-[var(--secondary-ochre)]"
          >
            <Facebook className="h-4 w-4" />
            <span className="text-[10px] font-semibold tracking-[3px] uppercase">
              Facebook
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

type ColumnProps = {
  title: string;
  items: { href: string; label: string }[];
};

function FooterColumn({ title, items }: ColumnProps) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-[10px] font-semibold tracking-[4px] uppercase text-white/35">
        {title}
      </span>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="text-[13px] font-light text-white/55 transition-colors hover:text-[var(--secondary-ochre)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
