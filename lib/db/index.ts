import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Neon-backed Drizzle client.
 *
 * Uses the Neon HTTP driver — one-shot queries with no persistent connection,
 * which is ideal for Vercel serverless functions and ISR.
 *
 * The client is created lazily and memoized. Code paths that read data should
 * first check `isDbConfigured()` and fall back to static seed data when the DB
 * isn't provisioned yet (see lib/events-db.ts). Write paths call `getDb()`,
 * which throws a clear error if `DATABASE_URL` is missing.
 */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cached: Db | null = null;

export function getDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Provision Neon and add it to your environment " +
        "(see SETUP.md) before using the database.",
    );
  }
  if (!cached) {
    cached = drizzle(neon(url), { schema });
  }
  return cached;
}

export { schema };
