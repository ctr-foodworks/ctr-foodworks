import "server-only";
import { asc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb, schema } from "./db";
import type { UserRow, UserRole } from "./db/schema";

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

/** Update a user's password by email (clears the must-change flag). */
export async function updatePassword(
  email: string,
  newPassword: string,
): Promise<void> {
  const db = getDb();
  const passwordHash = bcrypt.hashSync(newPassword, 12);
  await db
    .update(schema.users)
    .set({ passwordHash, mustChangePassword: false, updatedAt: new Date() })
    .where(eq(schema.users.email, normalizeEmail(email)));
}

// ── User management (RBAC) ───────────────────────────────────────────────────

export async function listUsers(): Promise<UserRow[]> {
  const db = getDb();
  return db.select().from(schema.users).orderBy(asc(schema.users.email));
}

export async function getUserById(id: number): Promise<UserRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return row;
}

/** Create an invited user with a temporary (already-hashed) password. */
export async function createUser(input: {
  email: string;
  name: string | null;
  role: UserRole;
  passwordHash: string;
}): Promise<UserRow> {
  const db = getDb();
  const [row] = await db
    .insert(schema.users)
    .values({
      email: normalizeEmail(input.email),
      name: input.name,
      role: input.role,
      passwordHash: input.passwordHash,
      mustChangePassword: true,
      updatedAt: new Date(),
    })
    .returning();
  return row;
}

export async function deleteUser(id: number): Promise<void> {
  const db = getDb();
  await db.delete(schema.users).where(eq(schema.users.id, id));
}

/** Reset a user's password to a new (hashed) temp and force a change. */
export async function resetUserPassword(
  id: number,
  passwordHash: string,
): Promise<void> {
  const db = getDb();
  await db
    .update(schema.users)
    .set({ passwordHash, mustChangePassword: true, updatedAt: new Date() })
    .where(eq(schema.users.id, id));
}

/** Update the signed-in user's display name / photo. */
export async function updateProfile(
  email: string,
  data: { name?: string | null; imageUrl?: string | null },
): Promise<void> {
  const db = getDb();
  await db
    .update(schema.users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.users.email, normalizeEmail(email)));
}
