import { cuisineLabels } from "./cuisines";

/**
 * Single source of truth for the business NAP + canonical host, shared by the
 * metadata layer, JSON-LD structured data, robots.ts, and sitemap.ts.
 *
 * Production canonicalizes to the www host (apex 301s to www), so every
 * absolute URL / @id / sameAs value derives from SITE_URL = www.
 */
export const SITE_URL = "https://www.ctrfoodworks.com";

/** Absolute URL for a site-relative path, encoded so filenames with spaces
 *  (e.g. the hero renderings) stay valid in metadata / JSON-LD. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${encodeURI(path)}`;
}

export const BUSINESS = {
  name: "CTR Food Works",
  url: SITE_URL,
  logo: `${SITE_URL}/android-chrome-512x512.png`,
  /** Real hero photo used as the entity image. */
  image: absoluteUrl("/images/CNN_Atrium Rendering_2026-01-09.jpg"),
  description:
    "Downtown Atlanta's food hall inside the former CNN Center — 11 chef-driven kitchens and the largest bar in Georgia.",
  address: {
    streetAddress: "190 Marietta St NW",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    postalCode: "30303",
    addressCountry: "US",
  },
  /** Verified from the site's own Google Maps short link (visit page). */
  geo: { latitude: 33.7577928, longitude: -84.3949137 },
  hasMap: "https://maps.app.goo.gl/jLpHdXxgj1179wXZ7",
  priceRange: "$$",
  /** Only real, owned social profiles (Instagram). The Footer's facebook.com
   *  href is a placeholder homepage link, deliberately excluded from sameAs. */
  sameAs: ["https://www.instagram.com/ctrfoodworks/"],
  /** Machine-readable hours mirroring lib/hours.ts (display strings). */
  openingHours: [
    { days: ["Sunday", "Monday", "Tuesday", "Wednesday"], opens: "11:00", closes: "21:00" },
    { days: ["Thursday", "Friday", "Saturday"], opens: "11:00", closes: "23:00" },
  ],
} as const;

/** PostalAddress node reused across the FoodEstablishment / Restaurant graphs. */
function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.streetAddress,
    addressLocality: BUSINESS.address.addressLocality,
    addressRegion: BUSINESS.address.addressRegion,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.addressCountry,
  };
}

/** Stable @id for the hall entity, referenced by Event.location and each
 *  vendor Restaurant's containedInPlace. */
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * The sitewide @graph: a FoodEstablishment (which also anchors the brand's
 * Organization identity + logo, being a subtype of Organization) plus a WebSite
 * node. No SearchAction — the site has no on-site search.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FoodEstablishment",
        "@id": BUSINESS_ID,
        name: BUSINESS.name,
        url: SITE_URL,
        logo: BUSINESS.logo,
        image: BUSINESS.image,
        description: BUSINESS.description,
        address: postalAddress(),
        geo: {
          "@type": "GeoCoordinates",
          latitude: BUSINESS.geo.latitude,
          longitude: BUSINESS.geo.longitude,
        },
        hasMap: BUSINESS.hasMap,
        servesCuisine: [...cuisineLabels],
        priceRange: BUSINESS.priceRange,
        openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [...h.days],
          opens: h.opens,
          closes: h.closes,
        })),
        sameAs: [...BUSINESS.sameAs],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: BUSINESS.name,
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  };
}

export { postalAddress };
