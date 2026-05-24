export type VendorAccent = "primary" | "ochre" | "navy" | "plum";

export type Vendor = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: VendorAccent;
  imageUrl: string;
  /** Path under public/logos/vendors/. Optional — VendorLogo renders a
   *  styled placeholder if the file at this path doesn't exist yet. */
  logoUrl?: string;
  /** Optional wide/wordmark version of the logo for the detail-page
   *  About section. When set, the detail page uses this instead of the
   *  square logoUrl at natural aspect. The card-overlay always uses
   *  logoUrl regardless. */
  logoLargeUrl?: string;
  /** Optional larger photo for the vendor's detail-page hero.
   *  Falls back to imageUrl when not provided. */
  heroImage?: string;
  /** Instagram handle, without the leading @ */
  instagram?: string;
  /** Full vendor website URL */
  website?: string;
  /** Concept not finalized — card and detail page render placeholder
   *  copy + a 'Coming Soon' badge instead of the standard treatment. */
  comingSoon?: boolean;
  /** How `imageUrl` should be displayed inside the card image area.
   *  - "cover" (default): photograph fills the 4:3 tile via object-cover.
   *  - "logo": treat `imageUrl` as a brand logo — center it with padding
   *    via object-contain on a neutral background. Used for vendors that
   *    don't have a food photo yet (e.g. Rivalry Beef).
   */
  imageMode?: "cover" | "logo";
};

export type HoursRow = {
  days: string;
  hours: string;
  emphasis?: boolean;
};
