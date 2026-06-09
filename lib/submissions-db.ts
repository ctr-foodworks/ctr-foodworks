import "server-only";
import { count, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "./db";
import type { WaitlistRow, ContactRow } from "./db/schema";

/**
 * Read access for form submissions surfaced in the admin. DB required — these
 * are only ever called from protected /admin pages.
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
