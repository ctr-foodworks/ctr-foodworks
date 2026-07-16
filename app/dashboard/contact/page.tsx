import { Download } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import {
  getContactMessages,
  getContactRepliesByMessageIds,
} from "@/lib/submissions-db";
import type { ContactReplyRow } from "@/lib/db/schema";
import { markContactReadAction } from "../actions";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return new Date(d).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function category(meta: unknown): string | null {
  if (meta && typeof meta === "object" && "category" in meta) {
    const c = (meta as { category?: unknown }).category;
    return typeof c === "string" ? c : null;
  }
  return null;
}

export default async function ContactMessagesPage() {
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

  const rows = await getContactMessages();
  const unread = rows.filter((r) => !r.read).length;

  // Group the conversation replies by message for the inline thread view.
  const replies = await getContactRepliesByMessageIds(rows.map((r) => r.id));
  const threads = new Map<number, ContactReplyRow[]>();
  for (const reply of replies) {
    const list = threads.get(reply.messageId) ?? [];
    list.push(reply);
    threads.set(reply.messageId, list);
  }

  const fmtTime = (d: Date) =>
    new Date(d).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1c2130]">
            Messages
            <span className="ml-3 align-middle text-base font-medium text-[#828b9e]">
              {rows.length}
            </span>
          </h1>
          <p className="mt-1 text-sm text-[#828b9e]">Submissions</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {unread > 0 && (
            <form action={markContactReadAction}>
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Mark all as read ({unread})
              </button>
            </form>
          )}
          <a
            href="/api/admin/export/contacts"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e8f1] bg-white px-4 text-[13px] font-medium text-[#1c2130] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </a>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-[#828b9e]">
          No messages yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((r) => {
            const cat = category(r.meta);
            return (
              <li
                key={r.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#e4e8f1] bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {!r.read && (
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--primary)]"
                      title="Unread"
                    />
                  )}
                  <span className="text-sm font-semibold text-[#1c2130]">
                    {r.name || "—"}
                  </span>
                  <a
                    href={`mailto:${r.email}`}
                    className="text-[13px] text-[#828b9e] hover:text-[var(--primary)]"
                  >
                    {r.email}
                  </a>
                  {cat && (
                    <span className="rounded-full bg-[#fbeeeb] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                      {cat}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      r.responded
                        ? "bg-[#e7f6ef] text-[#35b57c]"
                        : "bg-[#fdf1e3] text-[#b45309]"
                    }`}
                  >
                    {r.responded ? "Replied" : "Needs reply"}
                  </span>
                  <span className="ml-auto font-mono text-[13px] tabular-nums text-[#828b9e]">
                    {fmt(r.createdAt)}
                  </span>
                </div>
                {r.message && (
                  <p className="whitespace-pre-wrap text-sm leading-[1.7] text-[#1c2130]">
                    {r.message}
                  </p>
                )}

                {(threads.get(r.id)?.length ?? 0) > 0 && (
                  <div className="mt-1 flex flex-col gap-2 border-t border-[#eef1f7] pt-3">
                    {threads.get(r.id)!.map((t) => {
                      const staff = t.direction === "staff";
                      return (
                        <div
                          key={t.id}
                          className={`rounded-xl p-3.5 text-sm ${
                            staff ? "bg-[#fbeeeb]" : "bg-[#f4f6f9]"
                          }`}
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-[#828b9e]">
                              {staff ? "Team" : "Customer"}
                            </span>
                            <span className="font-mono text-[11px] tabular-nums text-[#828b9e]">
                              {fmtTime(t.createdAt)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-[1.6] text-[#1c2130]">
                            {t.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
