import "server-only";
import { count, desc, eq, inArray } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "./db";
import type { WaitlistRow, ContactRow, ContactReplyRow } from "./db/schema";

/**
 * Read access for form submissions surfaced in the admin. DB required — these
 * are only ever called from protected /dashboard pages.
 */
export async function getWaitlistSignups(): Promise<WaitlistRow[]> {
  const db = getDb();
  return db
    .select()
    .from(schema.waitlistSignups)
    .orderBy(desc(schema.waitlistSignups.createdAt));
}

export async function getContactMessages(): Promise<ContactRow[]> {
  const db = getDb();
  return db
    .select()
    .from(schema.contactMessages)
    .orderBy(desc(schema.contactMessages.createdAt));
}

/** Unread counts for the sidebar badges. Returns zeros without a DB. */
export async function getUnreadCounts(): Promise<{
  waitlist: number;
  contact: number;
}> {
  if (!isDbConfigured()) return { waitlist: 0, contact: 0 };
  const db = getDb();
  // Run both counts concurrently to halve the round-trip latency.
  const [[w], [c]] = await Promise.all([
    db
      .select({ n: count() })
      .from(schema.waitlistSignups)
      .where(eq(schema.waitlistSignups.read, false)),
    db
      .select({ n: count() })
      .from(schema.contactMessages)
      .where(eq(schema.contactMessages.read, false)),
  ]);
  return { waitlist: Number(w?.n ?? 0), contact: Number(c?.n ?? 0) };
}

export async function markWaitlistRead(): Promise<void> {
  const db = getDb();
  await db
    .update(schema.waitlistSignups)
    .set({ read: true })
    .where(eq(schema.waitlistSignups.read, false));
}

export async function markContactRead(): Promise<void> {
  const db = getDb();
  await db
    .update(schema.contactMessages)
    .set({ read: true })
    .where(eq(schema.contactMessages.read, false));
}

// ── Inbound relay (Model A) ──────────────────────────────────────────────────

/** Find the contact thread a reply belongs to, by its embedded token. */
export async function getContactByToken(
  token: string,
): Promise<ContactRow | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.contactMessages)
    .where(eq(schema.contactMessages.replyToken, token))
    .limit(1);
  return row ?? null;
}

/** Mark a thread as responded (a staff reply came back through the relay). */
export async function markResponded(id: number): Promise<void> {
  const db = getDb();
  await db
    .update(schema.contactMessages)
    .set({ responded: true, respondedAt: new Date() })
    .where(eq(schema.contactMessages.id, id));
}

/** Flip a thread back to "needs reply" — the customer wrote back after we
 *  replied, so the ball is in our court again. */
export async function markNeedsReply(id: number): Promise<void> {
  const db = getDb();
  await db
    .update(schema.contactMessages)
    .set({ responded: false })
    .where(eq(schema.contactMessages.id, id));
}

/** Append one message to a thread. */
export async function addContactReply(input: {
  messageId: number;
  direction: "staff" | "customer";
  fromAddr: string;
  body: string;
  providerId: string | null;
}): Promise<void> {
  const db = getDb();
  await db.insert(schema.contactReplies).values(input);
}

/** Have we already processed this inbound provider message id? (retry-safe) */
export async function hasSeenInbound(providerId: string): Promise<boolean> {
  const db = getDb();
  const [row] = await db
    .select({ id: schema.contactReplies.id })
    .from(schema.contactReplies)
    .where(eq(schema.contactReplies.providerId, providerId))
    .limit(1);
  return Boolean(row);
}

/** All replies for the given messages, oldest-first (for the dashboard thread). */
export async function getContactRepliesByMessageIds(
  ids: number[],
): Promise<ContactReplyRow[]> {
  if (!ids.length) return [];
  const db = getDb();
  return db
    .select()
    .from(schema.contactReplies)
    .where(inArray(schema.contactReplies.messageId, ids))
    .orderBy(schema.contactReplies.createdAt);
}
