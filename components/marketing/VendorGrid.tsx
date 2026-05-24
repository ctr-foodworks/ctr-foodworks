import type { Vendor } from "@/lib/types";
import { VendorCard } from "./VendorCard";

type Props = {
  vendors: Vendor[];
  columns?: 1 | 2 | 3;
};

const colClass: Record<1 | 2 | 3, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
};

const gapClass: Record<1 | 2 | 3, string> = {
  1: "gap-y-16",
  2: "gap-x-10 gap-y-20 lg:gap-x-14 lg:gap-y-24",
  3: "gap-x-8 gap-y-16",
};

export function VendorGrid({ vendors, columns = 2 }: Props) {
  return (
    <div
      className={`grid grid-cols-1 ${colClass[columns]} ${gapClass[columns]}`}
    >
      {vendors.map((vendor, i) => (
        <VendorCard key={vendor.slug} vendor={vendor} index={i} />
      ))}
    </div>
  );
}
