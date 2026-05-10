export function FifaBanner() {
  return (
    <section
      id="fifa"
      className="w-full bg-[var(--secondary-ochre)] text-[var(--text-dark)]"
    >
      <div className="flex flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:gap-10 lg:px-[60px] lg:py-7">
        <span className="flex-shrink-0 text-[10px] font-semibold tracking-[5px] uppercase text-black/55">
          FIFA World Cup 2026™
        </span>
        <p className="text-[14px] font-light leading-[1.7] lg:max-w-[860px]">
          <strong className="font-semibold">Atlanta is a FIFA World Cup 2026™ host city.</strong>{" "}
          CTR Food Works opens just in time — positioned at the center of downtown, surrounded by major sports venues and cultural landmarks. The perfect place to gather before the match, celebrate the win, and be part of history.
        </p>
      </div>
    </section>
  );
}
