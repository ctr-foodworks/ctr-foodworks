import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "./db";
import { events as seedEvents, type Event } from "./events";
import type { EventRow, NewEventRow } from "./db/schema";

/**
 * Events data access layer.
 *
 * Reads fall back to the static seed (lib/events.ts) when DATABASE_URL is not
 * set, so the public site keeps working before Neon is provisioned. Once the
 * DB is live, reads + all writes go through it.
 *
 * Public-facing pages consume the lightweight `Event` shape (lib/events.ts);
 * the admin consumes full `EventRow`s (with id + timestamps).
 */

/** DB row → the public `Event` shape (nulls collapsed to undefined). */
function rowToEvent(row: EventRow): Event {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.date,
    endDate: row.endDate ?? undefined,
    time: row.time ?? undefined,
    description: row.description,
    imageUrl: row.imageUrl ?? undefined,
    ctaUrl: row.ctaUrl ?? undefined,
    ctaLabel: row.ctaLabel ?? undefined,
  };
}

function byDateAsc(a: Event, b: Event) {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

/** All events, chronological. Falls back to the static seed without a DB. */
export async function getAllEvents(): Promise<Event[]> {
  if (!isDbConfigured()) {
    return [...seedEvents].sort(byDateAsc);
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.events)
    .orderBy(asc(schema.events.date));
  return rows.map(rowToEvent);
}

/**
 * Public, upcoming events only, chronological — drives the "Upcoming at CTR"
 * carousel. Past events are filtered out so the open venue never shows a stale
 * calendar. "Today" is computed in the venue's timezone (America/New_York) and
 * compared against each event's end date (multi-day events stay listed until
 * they finish). Admin lists (getAllEventRows) are unaffected.
 */
export async function getPublicEvents(): Promise<Event[]> {
  const all = await getAllEvents();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  }); // YYYY-MM-DD
  return all.filter(
    (e) =>
      e.category === "public" && (e.endDate ?? e.date).slice(0, 10) >= today,
  );
}

// ── Admin (DB required) ──────────────────────────────────────────────────────

/** Full rows (with id + timestamps) for the admin dashboard. */
export async function getAllEventRows(): Promise<EventRow[]> {
  const db = getDb();
  return db.select().from(schema.events).orderBy(asc(schema.events.date));
}

export async function getEventRow(id: number): Promise<EventRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.events)
    .where(eq(schema.events.id, id))
    .limit(1);
  return row;
}

export async function createEvent(data: NewEventRow): Promise<EventRow> {
  const db = getDb();
  const [row] = await db
    .insert(schema.events)
    .values({ ...data, updatedAt: new Date() })
    .returning();
  return row;
}

export async function updateEvent(
  id: number,
  data: Partial<NewEventRow>,
): Promise<EventRow> {
  const db = getDb();
  const [row] = await db
    .update(schema.events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.events.id, id))
    .returning();
  return row;
}

export async function deleteEvent(id: number): Promise<void> {
  const db = getDb();
  await db.delete(schema.events).where(eq(schema.events.id, id));
}
