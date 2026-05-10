export type VendorAccent = "primary" | "ochre" | "navy" | "plum";

export type Vendor = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: VendorAccent;
  imageUrl: string;
};

export type HoursRow = {
  days: string;
  hours: string;
  emphasis?: boolean;
};
