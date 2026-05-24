type Props = {
  quote: string;
  attribution: string;
};

export function PullQuote({ quote, attribution }: Props) {
  return (
    <section className="w-full bg-[var(--secondary-plum)] px-6 py-[80px] text-white lg:px-[60px] lg:py-[100px]">
      <div className="mx-auto flex max-w-[920px] flex-col gap-6">
        <div className="h-[3px] w-12 bg-[var(--primary)]" />
        <blockquote className="font-display text-[28px] font-medium italic leading-[1.4] text-white/90 lg:text-[40px]">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <cite className="text-[10px] font-semibold not-italic tracking-[4px] uppercase text-white/40">
          — {attribution}
        </cite>
      </div>
    </section>
  );
}
