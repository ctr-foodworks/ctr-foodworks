export type NavChild = {
  href: string;
  label: string;
};

export type NavLink = {
  href: string;
  label: string;
  /** If present, the nav item gets a dropdown panel on desktop and
   *  a click-to-expand sub-list on mobile. */
  children?: NavChild[];
  /** If true, suppress the dropdown on desktop (children still appear on
   *  mobile as an expand-to-anchor list). Used for /events where Thierry
   *  wants the desktop link to go straight to the page, but mobile users
   *  still benefit from quick anchor jumps to Private / Public Events. */
  desktopFlat?: boolean;
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
    desktopFlat: true,
    children: [
      { href: "/events#private-events", label: "Private Events" },
      { href: "/events#public-events", label: "Public Events" },
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
