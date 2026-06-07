import "server-only";
import { desc } from "drizzle-orm";
import { getDb, schema } from "./db";
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
