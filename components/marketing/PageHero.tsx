import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export function PageHero({ eyebrow, title, description, imageUrl, imageAlt }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg-dark)] pt-[72px] text-white lg:pt-[80px]">
      {imageUrl && (
        <>
          <div className="absolute inset-0 top-[72px] lg:top-[80px]">
            <img
              src={imageUrl}
              alt={imageAlt ?? ""}
              className="h-full w-full object-cover opacity-40"
            />
          </div>
          <div
            className="absolute inset-0 top-[72px] lg:top-[80px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)",
            }}
          />
        </>
      )}
      <div className="relative z-10 flex min-h-[420px] flex-col justify-end gap-6 px-6 py-20 lg:min-h-[520px] lg:px-[60px] lg:py-24">
        <Eyebrow tone="light" className="!text-[var(--secondary-ochre)]">
          {eyebrow}
        </Eyebrow>
        <DisplayHeading size="xl" as="h1" className="max-w-[800px] text-white">
          {title}
        </DisplayHeading>
        {description && (
          <p className="max-w-[560px] text-[15px] font-light leading-[1.8] text-white/65">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
