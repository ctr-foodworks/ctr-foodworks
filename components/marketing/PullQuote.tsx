type Props = {
  quote: string;
  attribution: string;
};

export function PullQuote({ quote, attribution }: Props) {
  return (
    <section className="w-full bg-[var(--secondary-plum)] px-6 py-[120px] text-white lg:px-[60px] lg:py-[180px] xl:py-[220px]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8 lg:gap-10">
        <div className="h-[3px] w-16 bg-[var(--primary)]" />
        <blockquote className="font-display text-[32px] font-medium italic leading-[1.3] text-white/90 lg:text-[52px] xl:text-[64px]">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <cite className="text-[11px] font-semibold not-italic tracking-[5px] uppercase text-white/45">
          — {attribution}
        </cite>
      </div>
    </section>
  );
}
