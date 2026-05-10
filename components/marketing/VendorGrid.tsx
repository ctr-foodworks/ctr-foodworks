import type { Vendor } from "@/lib/types";
import { VendorCard } from "./VendorCard";

type Props = {
  vendors: Vendor[];
  columns?: 2 | 3 | 4;
};

const colClass: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function VendorGrid({ vendors, columns = 3 }: Props) {
  return (
    <div className={`grid grid-cols-1 gap-px bg-[#1c1c19] ${colClass[columns]}`}>
      {vendors.map((vendor) => (
        <VendorCard key={vendor.slug} vendor={vendor} />
      ))}
    </div>
  );
}
