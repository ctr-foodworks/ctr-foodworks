export function Countdown() {
  const stats = [
    { number: "3", label: "EXPERIENCES" },
    { number: "2", label: "WORLD EVENTS" },
    { number: "1", label: "LANDMARK" },
  ];

  return (
    <section className="w-full bg-[var(--bg-cream)] flex flex-col items-center gap-12 py-[80px] px-6 lg:gap-16 lg:py-[120px] lg:px-[120px]">
      <span className="text-[11px] font-medium tracking-[6px] text-[var(--text-muted-dark)]">
        SPRING 2026
      </span>

      <h2 className="font-display text-[36px] font-bold leading-[1.1] text-center text-[var(--text-dark)] max-w-[700px] lg:text-[48px]">
        Something extraordinary
        <br />
        is taking shape.
      </h2>

      <div className="w-10 h-px bg-[var(--primary)]" />

      <div className="flex items-center justify-center">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && (
              <div className="w-px h-[60px] bg-[var(--border-light)] mx-6 lg:mx-12 lg:h-[80px]" />
            )}
            <div className="flex flex-col items-center gap-2 w-[90px] lg:w-[140px]">
              <span className="font-primary text-[48px] font-extrabold tracking-[-2px] text-[var(--text-dark)] lg:text-[64px]">
                {stat.number}
              </span>
              <span className="text-[9px] font-medium tracking-[3px] text-[var(--text-muted-dark)] lg:text-[11px] lg:tracking-[4px]">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
