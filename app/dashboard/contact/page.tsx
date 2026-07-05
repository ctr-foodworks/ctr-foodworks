import { isDbConfigured } from "@/lib/db";
import {
  getContactMessages,
  getContactRepliesByMessageIds,
} from "@/lib/submissions-db";
import type { ContactReplyRow } from "@/lib/db/schema";
import { markContactReadAction } from "../actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow tone="primary">Submissions</Eyebrow>
          <h1 className="mt-3 font-display text-[36px] font-black uppercase leading-[1] tracking-[-0.5px]">
            Messages
            <span className="ml-3 align-middle text-[16px] font-medium text-[var(--text-muted-dark)]">
              {rows.length}
            </span>
          </h1>
          <div className="mt-3 h-[2px] w-12 bg-[var(--primary)]" />
        </div>
        {unread > 0 && (
          <form action={markContactReadAction}>
            <button
              type="submit"
              className="inline-flex h-[40px] items-center justify-center border border-[var(--text-dark)]/20 px-5 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--text-dark)] transition-colors hover:bg-[var(--text-dark)] hover:text-white"
            >
              Mark all as read ({unread})
            </button>
          </form>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-[15px] font-light text-[var(--text-muted-dark)]">
          No messages yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((r) => {
            const cat = category(r.meta);
            return (
              <li
                key={r.id}
                className={`flex flex-col gap-3 border border-[var(--text-dark)]/10 bg-white p-5 ${
                  r.read ? "" : "border-l-2 border-l-[var(--primary)]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  {!r.read && (
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--primary)]"
                      title="Unread"
                    />
                  )}
                  <span className="text-[14px] font-semibold text-[var(--text-dark)]">
                    {r.name || "—"}
                  </span>
                  <a
                    href={`mailto:${r.email}`}
                    className="text-[13px] font-light text-[var(--text-muted-dark)] hover:text-[var(--primary)]"
                  >
                    {r.email}
                  </a>
                  {cat && (
                    <span className="bg-[var(--primary)] px-2 py-1 text-[9px] font-semibold tracking-[2px] uppercase text-white">
                      {cat}
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-[9px] font-semibold tracking-[2px] uppercase ${
                      r.responded
                        ? "bg-[#16a34a]/10 text-[#16a34a]"
                        : "bg-[var(--text-dark)]/5 text-[var(--text-muted-dark)]"
                    }`}
                  >
                    {r.responded ? "Responded" : "Awaiting reply"}
                  </span>
                  <span className="ml-auto font-mono text-[12px] text-[var(--text-muted-dark)]">
                    {fmt(r.createdAt)}
                  </span>
                </div>
                {r.message && (
                  <p className="whitespace-pre-wrap text-[14px] font-light leading-[1.7] text-[var(--text-dark)]">
                    {r.message}
                  </p>
                )}

                {(threads.get(r.id)?.length ?? 0) > 0 && (
                  <div className="mt-1 flex flex-col gap-2 border-t border-[var(--text-dark)]/10 pt-3">
                    {threads.get(r.id)!.map((t) => {
                      const staff = t.direction === "staff";
                      return (
                        <div
                          key={t.id}
                          className={`rounded-md px-3 py-2 ${
                            staff
                              ? "bg-[var(--primary)]/5"
                              : "bg-[var(--text-dark)]/[0.03]"
                          }`}
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text-muted-dark)]">
                              {staff ? "Team" : "Customer"}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--text-muted-dark)]">
                              {fmtTime(t.createdAt)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-[13px] font-light leading-[1.6] text-[var(--text-dark)]">
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
