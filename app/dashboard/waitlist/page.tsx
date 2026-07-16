import { Download } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import { getWaitlistSignups } from "@/lib/submissions-db";
import { markWaitlistReadAction } from "../actions";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return new Date(d).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function WaitlistPage() {
  if (!isDbConfigured()) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
          Database not connected
        </h1>
        <p className="mt-1 text-sm text-[#828b9e]">Setup needed</p>
        <p className="mt-4 text-sm text-[#828b9e]">
          Set <code className="font-mono text-[13px]">DATABASE_URL</code> (see SETUP.md) to view submissions.
        </p>
      </main>
    );
  }

  const rows = await getWaitlistSignups();
  const unread = rows.filter((r) => !r.read).length;

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
            Waitlist
            <span className="ml-3 align-middle text-base font-medium text-[#828b9e]">
              {rows.length}
            </span>
          </h1>
          <p className="mt-1 text-sm text-[#828b9e]">Submissions</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {unread > 0 && (
            <form action={markWaitlistReadAction}>
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Mark all as read ({unread})
              </button>
            </form>
          )}
          <a
            href="/api/admin/export/waitlist"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </a>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-[#828b9e]">
          No signups yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e4e8f1] bg-white">
          <ul className="flex flex-col">
            {rows.map((r, i) => (
              <li
                key={r.id}
                className={`flex flex-wrap items-center gap-4 px-5 py-3.5 ${
                  i > 0 ? "border-t border-[#eef1f7]" : ""
                }`}
              >
                <span
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${
                    r.read ? "bg-transparent" : "bg-[var(--primary)]"
                  }`}
                  title={r.read ? undefined : "Unread"}
                />
                <a
                  href={`mailto:${r.email}`}
                  className="min-w-[240px] flex-1 text-sm font-medium text-[#1c2130] hover:text-[var(--primary)]"
                >
                  {r.email}
                </a>
                {r.source && (
                  <span className="shrink-0 rounded-full bg-[#eef1f7] px-2.5 py-0.5 text-[11px] font-semibold text-[#828b9e]">
                    {r.source}
                  </span>
                )}
                <span className="w-[180px] shrink-0 text-right font-mono text-[13px] tabular-nums text-[#828b9e]">
                  {fmt(r.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
