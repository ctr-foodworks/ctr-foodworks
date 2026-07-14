import { Download } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import { getWaitlistSignups } from "@/lib/submissions-db";
import { markWaitlistReadAction } from "../actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <Eyebrow tone="primary">Setup needed</Eyebrow>
        <h1 className="mt-3 font-display text-[32px] font-black uppercase leading-[1] tracking-[-0.5px]">
          Database not connected
        </h1>
        <p className="mt-4 text-[15px] font-light text-[var(--text-muted-dark)]">
          Set <code className="font-mono text-[13px]">DATABASE_URL</code> (see SETUP.md) to view submissions.
        </p>
      </main>
    );
  }

  const rows = await getWaitlistSignups();
  const unread = rows.filter((r) => !r.read).length;

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow tone="primary">Submissions</Eyebrow>
          <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
            Waitlist
            <span className="ml-3 align-middle text-[16px] font-medium text-[var(--text-muted-dark)]">
              {rows.length}
            </span>
          </h1>
          <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {unread > 0 && (
            <form action={markWaitlistReadAction}>
              <button
                type="submit"
                className="inline-flex h-[40px] items-center justify-center border border-[var(--text-dark)]/20 px-5 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
              >
                Mark all as read ({unread})
              </button>
            </form>
          )}
          <a
            href="/api/admin/export/waitlist"
            className="inline-flex h-[40px] items-center gap-2 border border-[var(--text-dark)]/20 px-5 text-[11px] font-semibold tracking-[2px] uppercase transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-[15px] font-light text-[var(--text-muted-dark)]">
          No signups yet.
        </p>
      ) : (
        <ul className="flex flex-col border-t border-[var(--text-dark)]/10">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-4 border-b border-[var(--text-dark)]/10 py-3"
            >
              <span
                className={`h-2 w-2 flex-shrink-0 rounded-full ${
                  r.read ? "bg-transparent" : "bg-[var(--primary)]"
                }`}
                title={r.read ? undefined : "Unread"}
              />
              <a
                href={`mailto:${r.email}`}
                className="min-w-[240px] flex-1 text-[14px] font-medium text-[var(--text-dark)] hover:text-[var(--primary)]"
              >
                {r.email}
              </a>
              {r.source && (
                <span className="shrink-0 bg-[var(--text-dark)]/10 px-2 py-1 text-[9px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)]">
                  {r.source}
                </span>
              )}
              <span className="w-[180px] shrink-0 text-right font-mono text-[12px] text-[var(--text-muted-dark)]">
                {fmt(r.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
