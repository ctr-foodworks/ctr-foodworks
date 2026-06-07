import { config } from "dotenv";
config({ path: ".env.local" });

import { getDb, schema } from "../lib/db";
import { events as seed } from "../lib/events";

/**
 * Loads the static seed events (lib/events.ts) into the database. Idempotent —
 * skips events whose slug already exists. Run once after provisioning Neon:
 *   npm run db:seed
 */
async function main() {
  const db = getDb();
  for (const e of seed) {
    await db
      .insert(schema.events)
      .values({
        slug: e.slug,
        title: e.title,
        category: e.category,
        date: e.date,
        endDate: e.endDate,
        time: e.time,
        description: e.description,
        imageUrl: e.imageUrl,
        ctaUrl: e.ctaUrl,
        ctaLabel: e.ctaLabel,
      })
      .onConflictDoNothing({ target: schema.events.slug });
  }
  console.log(`Seeded ${seed.length} events (existing slugs skipped).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
