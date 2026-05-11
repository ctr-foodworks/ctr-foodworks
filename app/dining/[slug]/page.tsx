import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Instagram, ExternalLink, MapPin, Clock } from "lucide-react";
import { CTAStrip } from "@/components/marketing/CTAStrip";
import { VendorLogo } from "@/components/marketing/VendorLogo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { vendors } from "@/lib/vendors";
import { hours } from "@/lib/hours";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return vendors.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = vendors.find((v) => v.slug === slug);
  if (!vendor) return { title: "Not Found" };
  return {
    title: vendor.name,
    description: vendor.description,
  };
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const vendor = vendors.find((v) => v.slug === slug);
  if (!vendor) notFound();

  const heroSrc = vendor.heroImage ?? vendor.imageUrl;
  const websiteHost = vendor.website
    ? vendor.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <main className="flex flex-col w-full">
      {/* §1 — Hero */}
      <section className="relative w-full overflow-hidden bg-[var(--bg-dark)] pt-[72px] text-white lg:pt-[80px]">
        <div className="absolute inset-0 top-[72px] lg:top-[80px]">
          <img
            src={heroSrc}
            alt={vendor.name}
            className="h-full w-full object-cover opacity-50"
          />
        </div>
        <div
          className="absolute inset-0 top-[72px] lg:top-[80px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        <div className="relative z-10 flex min-h-[520px] flex-col px-6 py-12 lg:min-h-[620px] lg:px-[60px] lg:py-16">
          <Link
            href="/dining"
            className="group inline-flex w-fit items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-white/65 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to the lineup
          </Link>

          <div className="mt-auto flex flex-col gap-5">
            <Eyebrow tone="primary">{vendor.tagline}</Eyebrow>
            <DisplayHeading size="xl" as="h1" className="max-w-[860px] text-white">
              {vendor.name.toUpperCase()}
            </DisplayHeading>
          </div>
        </div>
      </section>

      {/* §2 — About + Find Us */}
      <section className="w-full bg-[#f9f4f0] px-6 py-[80px] text-[var(--text-dark)] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          {/* Left — Logo + About */}
          <div className="flex flex-col gap-7">
            {vendor.logoLargeUrl ? (
              // Wide / wordmark logo — render at natural aspect, capped height
              <img
                src={vendor.logoLargeUrl}
                alt={`${vendor.name} logo`}
                className="h-20 w-auto max-w-[420px] object-contain lg:h-24"
              />
            ) : (
              <VendorLogo
                name={vendor.name}
                logoUrl={vendor.logoUrl}
                size="lg"
              />
            )}
            <Eyebrow tone="primary">About</Eyebrow>
            <DisplayHeading size="md" className="text-[var(--text-dark)]">
              {vendor.name.toUpperCase()}
            </DisplayHeading>
            <div className="h-[2px] w-12 bg-[var(--primary)]" />
            <p className="max-w-[560px] text-[15px] font-light leading-[1.9] text-[var(--text-muted-dark)] lg:text-[16px]">
              {vendor.description}
            </p>
          </div>

          {/* Right — Find Us sidebar */}
          <aside className="flex flex-col gap-6 lg:border-l lg:border-[var(--text-dark)]/10 lg:pl-12">
            <Eyebrow tone="primary">Find Us</Eyebrow>

            <div className="flex flex-col gap-5">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]">
                    Inside CTR Food Works
                  </span>
                  <span className="text-[14px] font-light leading-[1.55] text-[var(--text-dark)]">
                    190 Marietta St. NW
                    <br />
                    Atlanta, GA 30303
                  </span>
                </div>
              </div>

              {/* Hours — defaults to hall hours */}
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]">
                    Hours
                  </span>
                  <ul className="flex flex-col gap-1">
                    {hours.map((row) => (
                      <li
                        key={row.days}
                        className={`text-[13px] leading-[1.5] ${
                          row.emphasis
                            ? "font-medium text-[var(--primary)]"
                            : "font-light text-[var(--text-dark)]"
                        }`}
                      >
                        {row.days} · {row.hours}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instagram (if set) */}
              {vendor.instagram && (
                <a
                  href={`https://instagram.com/${vendor.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <Instagram className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]">
                      Instagram
                    </span>
                    <span className="text-[14px] font-light text-[var(--text-dark)] underline decoration-[var(--text-dark)]/30 underline-offset-4 transition-colors group-hover:text-[var(--primary)] group-hover:decoration-[var(--primary)]">
                      @{vendor.instagram}
                    </span>
                  </div>
                </a>
              )}

              {/* Website (if set) */}
              {vendor.website && websiteHost && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold tracking-[3px] uppercase text-[var(--text-muted-dark)]">
                      Website
                    </span>
                    <span className="text-[14px] font-light text-[var(--text-dark)] underline decoration-[var(--text-dark)]/30 underline-offset-4 transition-colors group-hover:text-[var(--primary)] group-hover:decoration-[var(--primary)]">
                      {websiteHost}
                    </span>
                  </div>
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* §3 — CTA back to /dining */}
      <CTAStrip
        eyebrow="The rest of the lineup"
        title={
          <>
            Meet the other
            <br />
            ten kitchens.
          </>
        }
        ctaHref="/dining"
        ctaLabel="Back to the lineup"
        tone="primary"
      />
    </main>
  );
}
