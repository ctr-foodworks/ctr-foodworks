import "server-only";
import { and, asc, eq, isNotNull, lt, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb, schema } from "./db";
import type { UserRow, UserRole } from "./db/schema";

/** How long a deactivated account is retained before it is permanently
 *  purged from the database (GDPR-style right to erasure). */
export const DEACTIVATED_RETENTION_DAYS = 90;

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
  // Deactivated accounts cannot sign in.
  if (user.deactivatedAt) return null;
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

/** Logical deactivation: block sign-in without losing the record. Never
 *  touches super_admins. */
export async function deactivateUser(id: number): Promise<void> {
  const db = getDb();
  await db
    .update(schema.users)
    .set({ deactivatedAt: new Date(), updatedAt: new Date() })
    .where(
      and(eq(schema.users.id, id), ne(schema.users.role, "super_admin")),
    );
}

/** Reverse a logical deactivation. */
export async function reactivateUser(id: number): Promise<void> {
  const db = getDb();
  await db
    .update(schema.users)
    .set({ deactivatedAt: null, updatedAt: new Date() })
    .where(eq(schema.users.id, id));
}

/**
 * Permanently delete accounts that have been deactivated longer than the
 * retention window. Super_admins are never purged. Best-effort: callers run
 * this opportunistically (e.g. when the Users page loads) so no cron is needed.
 * Returns the number of rows removed.
 */
export async function purgeExpiredDeactivated(
  retentionDays: number = DEACTIVATED_RETENTION_DAYS,
): Promise<number> {
  const db = getDb();
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const removed = await db
    .delete(schema.users)
    .where(
      and(
        isNotNull(schema.users.deactivatedAt),
        lt(schema.users.deactivatedAt, cutoff),
        ne(schema.users.role, "super_admin"),
      ),
    )
    .returning({ id: schema.users.id });
  return removed.length;
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
