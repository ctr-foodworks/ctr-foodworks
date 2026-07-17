import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/business";
import { vendors } from "@/lib/vendors";

/**
 * XML sitemap for the public site. Excludes /thanks (noindex), /dashboard, and
 * /api. Events are carousel-only (no per-event URLs), so only /events is
 * listed. Every vendor detail route is enumerated from lib/vendors.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${SITE_URL}/food-and-drinks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/visit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/connect`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const vendorRoutes: MetadataRoute.Sitemap = vendors.map((v) => ({
    url: `${SITE_URL}/food-and-drinks/${v.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...vendorRoutes];
}
