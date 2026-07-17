import Link from "next/link";
import { accentVar } from "@/lib/accent";
import type { Vendor } from "@/lib/types";
import { VendorLogo } from "./VendorLogo";

type Props = {
  vendor: Vendor;
  index: number;
};

export function VendorCard({ vendor, index }: Props) {
  const accent = accentVar[vendor.accent];
  const number = String(index + 1).padStart(2, "0");
  const isComingSoon = vendor.comingSoon === true;
  // imageMode: "logo" — used when the vendor doesn't have a food photo yet
  // (e.g. Rivalry Beef). The brand logo IS the card image; render it
  // centered with padding so the square logo isn't crop-mangled by 4:3.
  const isLogoImage = vendor.imageMode === "logo";

  return (
    <Link
      id={vendor.slug}
      href={`/food-and-drinks/${vendor.slug}`}
      aria-label={`${vendor.name} — ${vendor.tagline}`}
      className="group flex flex-col gap-7 bg-[var(--bg-dark)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-dark)] lg:gap-8"
    >
      <article className="contents">
        {/* Image with logo overlay */}
        <div
          className={`relative aspect-[4/3] overflow-hidden ${
            isLogoImage ? "bg-[#1a1a17]" : "bg-[#0c0c0a]"
          }`}
        >
          <img
            src={vendor.imageUrl}
            alt={vendor.name}
            loading="lazy"
            decoding="async"
            className={
              isLogoImage
                ? "absolute inset-0 h-full w-full object-contain p-10 lg:p-14"
                : `absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                    isComingSoon
                      ? "opacity-50 grayscale"
                      : "saturate-[0.9] group-hover:saturate-100"
                  }`
            }
          />
          {/* Coming Soon badge — top-left */}
          {isComingSoon && (
            <div className="absolute left-4 top-4 lg:left-5 lg:top-5">
              <span className="inline-flex items-center bg-[#f9f4f0] px-3 py-1.5 text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-dark)] shadow-[0_6px_18px_rgba(0,0,0,0.5)]">
                Coming Soon
              </span>
            </div>
          )}
          {/* Logo overlay — top-right. Skipped on comingSoon cards AND on
              logo-mode cards (the main image already IS the logo). */}
          {!isComingSoon && !isLogoImage && (
            <div className="absolute right-4 top-4 drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)] lg:right-5 lg:top-5">
              <VendorLogo
                name={vendor.name}
                logoUrl={vendor.logoUrl}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 px-1 pb-2 lg:gap-4 lg:px-2">
          <div className="flex items-baseline gap-4">
            <span
              className="text-[12px] font-semibold tracking-[3px] uppercase"
              style={{ color: accent }}
            >
              {number}
            </span>
            <span className="text-[10px] font-semibold tracking-[3px] uppercase text-white/55">
              {vendor.tagline}
            </span>
          </div>

          <div className="relative inline-flex flex-col items-start gap-0">
            <h3 className="font-display text-[32px] font-black uppercase leading-[0.95] tracking-[-0.5px] text-white lg:text-[40px]">
              {vendor.name}
            </h3>
            <span
              className="mt-2 block h-[2px] w-0 transition-all duration-500 ease-out group-hover:w-16"
              style={{ backgroundColor: accent }}
            />
          </div>

          <p className="max-w-[460px] text-[14px] font-light leading-[1.7] text-white/60 lg:text-[15px]">
            {vendor.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
