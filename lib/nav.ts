export type NavChild = {
  href: string;
  label: string;
};

export type NavLink = {
  href: string;
  label: string;
  /** If present, the nav item gets a dropdown panel on desktop and
   *  an indented sub-list on mobile. */
  children?: NavChild[];
  /** If true, the Events dropdown also surfaces the next upcoming
   *  event from lib/events.ts as a featured row at the top. */
  showNextEvent?: boolean;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/food-and-drinks",
    label: "Food & Drinks",
    children: [
      { href: "/food-and-drinks", label: "All Kitchens" },
      { href: "/food-and-drinks#bar", label: "The Bar" },
    ],
  },
  {
    href: "/events",
    label: "Events",
    showNextEvent: true,
    children: [
      { href: "/events#private-events", label: "Private Events" },
      { href: "/events#calendar", label: "What's On" },
    ],
  },
  {
    href: "/visit",
    label: "Visit",
    children: [
      { href: "/visit", label: "Hours & Location" },
      { href: "/visit#getting-here", label: "Getting Here" },
      { href: "/visit#private-events", label: "Private Events" },
      { href: "/visit#accessibility", label: "Accessibility" },
    ],
  },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
];
