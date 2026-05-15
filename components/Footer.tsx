import Link from "next/link";
import { Instagram, Facebook, MapPin } from "lucide-react";
import { vendors } from "@/lib/vendors";
import { hours } from "@/lib/hours";

const visitLinks = [
  { href: "/visit", label: "Hours & Location" },
  { href: "/visit#getting-here", label: "Getting Here" },
  { href: "/visit#private-events", label: "Private Events" },
  { href: "/visit#accessibility", label: "Accessibility" },
];

const connectLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/events", label: "Events" },
  { href: "/connect", label: "Contact" },
  { href: "/#waitlist", label: "Join Us" },
  { href: "mailto:press@ctrfoodworks.com", label: "Press Inquiries" },
];

const diningLinks = [
  ...vendors.map((v) => ({ href: `/food-and-drinks/${v.slug}`, label: v.name })),
  { href: "/food-and-drinks#bar", label: "CTR Bar" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-dark)] text-white">
      {/* Top accent strip */}
      <div className="border-b border-white/10 px-6 py-5 lg:px-[60px]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[10px] font-semibold tracking-[4px] uppercase text-white/75">
            Opening Spring 2026 · Downtown Atlanta
          </span>
          <span className="text-[10px] font-light tracking-[3px] uppercase text-white/35">
            190 Marietta St. NW · Atlanta, GA 30303
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-12 px-6 py-[80px] lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-14 lg:px-[60px] lg:py-[100px]">
        {/* Brand */}
        <div className="flex flex-col gap-7">
          <img
            src="/logos/ctr-inline-white.svg"
            alt="CTR Food Works"
            className="h-7 w-auto"
          />
          <p className="max-w-[340px] text-[14px] font-light leading-[1.7] text-white/55">
            Downtown Atlanta&apos;s Food Hall. 11 chef-driven dining concepts and 1 extraordinary bar, inside the reimagined former CNN Center.
          </p>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-[4px] uppercase text-white/35">
              Address
            </span>
            <p className="flex items-start gap-2.5 text-[13px] font-light leading-[1.7] text-white/75">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[var(--primary)]" />
              <span>
                190 Marietta St. NW
                <br />
                Atlanta, GA 30303
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-[4px] uppercase text-white/35">
              Hours
            </span>
            <ul className="flex flex-col gap-1.5">
              {hours.map((row) => (
                <li
                  key={row.days}
                  className={`text-[12px] leading-[1.5] ${
                    row.emphasis
                      ? "font-medium text-white"
                      : "font-light text-white/55"
                  }`}
                >
                  {row.days} · {row.hours}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FooterColumn title="Food & Drinks" items={diningLinks} />
        <FooterColumn title="Visit" items={visitLinks} />
        <FooterColumn title="Connect" items={connectLinks} />
      </div>

      {/* Big wordmark — architectural signature */}
      <div
        className="overflow-hidden border-t border-white/[0.08] px-6 py-10 lg:px-[60px] lg:py-14"
        aria-hidden="true"
      >
        <img
          src="/logos/ctr-inline-white.svg"
          alt=""
          className="block w-full opacity-[0.06]"
        />
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col gap-5 border-t border-white/[0.08] px-6 py-6 text-[11px] font-light text-white/35 lg:flex-row lg:items-center lg:justify-between lg:px-[60px]">
        <p>
          © {new Date().getFullYear()} The Center Food Works, Atlanta. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="tracking-[1px] transition-colors hover:text-white/75"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="tracking-[1px] transition-colors hover:text-white/75"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="tracking-[1px] transition-colors hover:text-white/75"
          >
            Sitemap
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="transition-colors hover:text-white"
          >
            <Instagram className="h-[18px] w-[18px]" />
          </a>
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            className="transition-colors hover:text-white"
          >
            <Facebook className="h-[18px] w-[18px]" />
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
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="text-[13px] font-light leading-[1.5] text-white/60 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
