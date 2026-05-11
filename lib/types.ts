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
  /** Optional larger photo for the vendor's detail-page hero.
   *  Falls back to imageUrl when not provided. */
  heroImage?: string;
  /** Instagram handle, without the leading @ */
  instagram?: string;
  /** Full vendor website URL */
  website?: string;
};

export type HoursRow = {
  days: string;
  hours: string;
  emphasis?: boolean;
};
