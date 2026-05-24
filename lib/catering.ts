/**
 * The CaTeRing Kitchen is a back-of-house service that runs out of CTR Food
 * Works — it isn't a public-facing kitchen on the lineup, so it doesn't live
 * in `vendors.ts`. The Events page surfaces it in the Private Events section
 * so guests inquiring about buyouts can also book catering and meal prep.
 */
export type CateringService = {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  /** Pre-routed through the shared inquiries inbox so Thierry can triage. */
  inquireMailto: string;
};

export const catering: CateringService = {
  name: "The CaTeRing Kitchen",
  tagline: "Catering & Meal Prep",
  description:
    "Located inside CTR Food Works, The CaTeRing Kitchen offers chef-driven catering for onsite events, corporate luncheons, private gatherings, and weekly meal prep services. Blending quality ingredients with seamless hospitality, our team delivers fresh, customizable menus designed to make every event — big or small — effortless and memorable.",
  logoUrl: "/logos/vendors/the-catering-kitchen.jpg",
  inquireMailto:
    "mailto:inquiries@ctrfoodworks.com?subject=Catering%20Inquiry",
};
