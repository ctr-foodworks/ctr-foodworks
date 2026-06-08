export type EventCategory = "public" | "private" | "recurring";

export type Event = {
  slug: string;
  title: string;
  category: EventCategory;
  /** ISO date (YYYY-MM-DD) or full ISO datetime */
  date: string;
  /** Optional end date for multi-day events */
  endDate?: string;
  /** Free-form time string for display, e.g. "11 AM – Late" */
  time?: string;
  /** Short editorial description for the card */
  description: string;
  /** Optional photo for the card */
  imageUrl?: string;
  /** Optional ticket / RSVP link */
  ctaUrl?: string;
  ctaLabel?: string;
};

/**
 * Upcoming events feed. Edited by Sebastian as Thierry/team emails updates.
 * Sorted ascending by `date` in the page component.
 */
export const events: Event[] = [
  {
    slug: "ctr-grand-opening-weekend",
    title: "The CTR Grand Opening Weekend",
    category: "public",
    date: "2026-06-12",
    description:
      "Three days at the heart of downtown Atlanta — every kitchen open, the bar pouring, live music across the atrium, and the city's first look inside the reimagined CNN Center.",
  },
  {
    slug: "spain-vs-cabo-verde",
    title: "Spain vs Cabo Verde",
    category: "public",
    date: "2026-06-15",
    description:
      "Match day at Mercedes-Benz Stadium, two blocks from CTR. Eat before, drink after — the bar pours through last call.",
  },
  {
    slug: "spain-vs-saudi-arabia",
    title: "Spain vs Saudi Arabia",
    category: "public",
    date: "2026-06-21",
    description:
      "Match day at Mercedes-Benz Stadium, two blocks from CTR. Pre-game bites, post-game drinks — walk over, walk back.",
  },
];
