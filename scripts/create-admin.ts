import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { getDb, schema } from "../lib/db";

/**
 * Create or reset an admin user in the database. Idempotent (upsert by email)
 * — also serves as a password reset / lockout recovery.
 *
 *   npm run admin:create -- "web@ctrfoodworks.com" "a-strong-password"
 */
async function main() {
  const email = process.argv[2]?.toLowerCase().trim();
  const password = process.argv[3];

  if (!email || !password) {
    console.error(
      'Usage: npm run admin:create -- "email@domain.com" "password"',
    );
    process.exit(1);
  }

  const db = getDb();
  const passwordHash = bcrypt.hashSync(password, 12);
  await db
    .insert(schema.users)
    .values({ email, passwordHash, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: { passwordHash, updatedAt: new Date() },
    });

  console.log(`Admin ready: ${email}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
