import { accentVar } from "@/lib/accent";
import type { Vendor } from "@/lib/types";

type Props = {
  vendor: Vendor;
};

export function VendorCard({ vendor }: Props) {
  const accent = accentVar[vendor.accent];
  return (
    <article
      id={vendor.slug}
      className="group relative flex flex-col overflow-hidden bg-[#0c0c0a] transition-colors duration-300 hover:bg-[#161613]"
      style={{ borderColor: "rgba(242,238,230,0.06)" }}
    >
      <div className="relative h-[220px] overflow-hidden lg:h-[260px]">
        <img
          src={vendor.imageUrl}
          alt={vendor.name}
          className="h-full w-full object-cover saturate-[0.85] transition-all duration-500 group-hover:scale-[1.04] group-hover:saturate-100"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background:
              "linear-gradient(to top, rgba(12,12,10,0.92), rgba(12,12,10,0))",
          }}
        />
        <span
          className="absolute left-5 top-5 inline-block px-2 py-1 text-[9px] font-semibold tracking-[3px] uppercase text-white"
          style={{ backgroundColor: accent }}
        >
          {vendor.tagline.split("·")[0].trim()}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6 lg:p-7">
        <h3
          className="font-display text-[28px] font-black uppercase leading-[0.95] tracking-[-0.5px] text-white lg:text-[32px]"
        >
          {vendor.name}
        </h3>
        <span
          className="text-[10px] font-semibold tracking-[3px] uppercase"
          style={{ color: accent }}
        >
          {vendor.tagline}
        </span>
        <p className="text-[13px] font-light leading-[1.7] text-white/55">
          {vendor.description}
        </p>
      </div>

      <div
        className="h-[3px] w-0 transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: accent }}
      />
    </article>
  );
}
