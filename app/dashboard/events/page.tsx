import Link from "next/link";
import { Download } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import { getAllEventRows } from "@/lib/events-db";
import { DeleteButton } from "../delete-button";

// Admin data should always be current.
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isDbConfigured()) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
          Database not connected
        </h1>
        <p className="mt-1 text-sm text-[#828b9e]">Setup needed</p>
        <p className="mt-5 max-w-[640px] text-sm leading-[1.8] text-[#828b9e]">
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
    <main className="mx-auto max-w-[1100px] px-6 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
            All Events
          </h1>
          <p className="mt-1 text-sm text-[#828b9e]">Events</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/admin/export/events"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </a>
          <Link
            href="/dashboard/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            + New event
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-[#828b9e]">
          No events yet. Create your first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e4e8f1] bg-white">
          <ul className="flex flex-col">
            {events.map((e, i) => (
              <li
                key={e.id}
                className={`flex flex-wrap items-center gap-4 px-5 py-3.5 ${
                  i > 0 ? "border-t border-[#eef1f7]" : ""
                }`}
              >
                <span className="w-[110px] shrink-0 font-mono text-[13px] tabular-nums text-[#828b9e]">
                  {e.date}
                </span>
                <span className="min-w-[200px] flex-1 text-sm font-medium text-[#1c2130]">
                  {e.title}
                </span>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/${e.id}/edit`}
                    className="text-[13px] font-medium text-[var(--primary)] hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={e.id} title={e.title} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
