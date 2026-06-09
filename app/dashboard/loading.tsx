/**
 * Instant loading skeleton shown while an admin page's data loads (the header +
 * rail persist). Makes navigation between sections feel immediate even though
 * each page fetches from the DB.
 */
export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <div className="animate-pulse">
        <div className="h-3 w-24 bg-[var(--text-dark)]/10" />
        <div className="mt-4 h-9 w-64 bg-[var(--text-dark)]/10" />
        <div className="mt-3 h-[2px] w-12 bg-[var(--text-dark)]/15" />
        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-[var(--text-dark)]/[0.06]" />
          ))}
        </div>
      </div>
    </main>
  );
}
