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
    slug: "opening-night",
    title: "Opening Night",
    category: "public",
    date: "2026-05-01",
    time: "5 PM – Late",
    description:
      "The doors open. All eleven kitchens plus the bar, live music, and the city's first look inside the reimagined CNN Center.",
  },
  {
    slug: "grand-opening-brunch",
    title: "Grand Opening Brunch",
    category: "public",
    date: "2026-05-03",
    time: "11 AM – 3 PM",
    description:
      "A long-table brunch across the hall with bottomless coffee, brunch from Eggflip, pastries from DessertBox, and a Bloody Mary bar.",
  },
  {
    slug: "private-events-inquiry",
    title: "Now Booking Private Events",
    category: "private",
    date: "2026-04-01",
    description:
      "Buyouts, brand activations, conference dinners, and milestone celebrations. Inquire early — opening-summer dates fill fast.",
    ctaUrl: "mailto:events@ctrfoodworks.com",
    ctaLabel: "Inquire",
  },
];
