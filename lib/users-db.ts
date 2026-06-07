import "server-only";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb, schema } from "./db";
import type { UserRow } from "./db/schema";

/**
 * Admin user data access. Auth now lives in Neon (the `users` table) rather
 * than env vars, so the password can be changed from the admin UI without a
 * redeploy. Bootstrap/reset an admin with `npm run admin:create`.
 */

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function getUserByEmail(
  email: string,
): Promise<UserRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalizeEmail(email)))
    .limit(1);
  return row;
}

/** Verify a plaintext password against the stored hash for an email. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<UserRow | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

/** Update an existing user's password (used by the change-password page). */
export async function updatePassword(
  email: string,
  newPassword: string,
): Promise<void> {
  const db = getDb();
  const passwordHash = bcrypt.hashSync(newPassword, 12);
  await db
    .update(schema.users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(schema.users.email, normalizeEmail(email)));
}
