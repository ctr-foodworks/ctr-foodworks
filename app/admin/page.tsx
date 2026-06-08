import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getAllEventRows } from "@/lib/events-db";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DeleteButton } from "./delete-button";

// Admin data should always be current.
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isDbConfigured()) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <Eyebrow tone="primary">Setup needed</Eyebrow>
        <h1 className="mt-3 font-display text-[32px] font-black uppercase leading-[1] tracking-[-0.5px]">
          Database not connected
        </h1>
        <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
        <p className="mt-5 max-w-[640px] text-[15px] font-light leading-[1.8] text-[var(--text-muted-dark)]">
          Set <code className="font-mono text-[13px]">DATABASE_URL</code> (and the
          other env vars in <code className="font-mono text-[13px]">SETUP.md</code>),
          run <code className="font-mono text-[13px]">npm run db:push</code> and{" "}
          <code className="font-mono text-[13px]">npm run db:seed</code>, then reload.
        </p>
      </main>
    );
  }

  const events = await getAllEventRows();

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow tone="primary">Events</Eyebrow>
          <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
            All Events
          </h1>
          <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
        </div>
        <Link
          href="/admin/new"
          className="inline-flex h-[44px] items-center justify-center bg-[var(--primary)] px-6 text-[12px] font-semibold tracking-[3px] uppercase text-white transition-colors hover:bg-[#a82d1d]"
        >
          + New event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-[15px] font-light text-[var(--text-muted-dark)]">
          No events yet. Create your first one.
        </p>
      ) : (
        <ul className="flex flex-col border-t border-[var(--text-dark)]/10">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-center gap-4 border-b border-[var(--text-dark)]/10 py-4"
            >
              <span className="w-[110px] shrink-0 font-mono text-[13px] text-[var(--text-muted-dark)]">
                {e.date}
              </span>
              <span className="min-w-[200px] flex-1 text-[15px] font-medium text-[var(--text-dark)]">
                {e.title}
              </span>
              <div className="flex items-center gap-5">
                <Link
                  href={`/admin/${e.id}/edit`}
                  className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] hover:text-[var(--primary)]"
                >
                  Edit
                </Link>
                <DeleteButton id={e.id} title={e.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
