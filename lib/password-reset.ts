import "server-only";
import { randomBytes, createHash } from "crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb, schema } from "./db";
import { getUserByEmail } from "./users-db";
import type { UserRow } from "./db/schema";

/**
 * Password-reset tokens for the "forgot password" flow. The raw token goes in
 * the emailed link; only its SHA-256 hash is stored, so the DB never holds a
 * usable token. Tokens are single-use (usedAt) and expire after one hour.
 */

const TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Create a reset token for the email if a user exists. Returns the raw token
 *  (for the link) + the user, or null if there's no such user. Any previously
 *  outstanding tokens for that user are invalidated first (one active link). */
export async function createResetToken(
  email: string,
): Promise<{ token: string; user: UserRow } | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const db = getDb();
  await db
    .update(schema.passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(schema.passwordResetTokens.userId, user.id),
        isNull(schema.passwordResetTokens.usedAt),
      ),
    );

  const token = randomBytes(32).toString("base64url");
  await db.insert(schema.passwordResetTokens).values({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TTL_MS),
  });
  return { token, user };
}

/** Return the user for a valid (unused, unexpired) token, or null. */
export async function getUserForResetToken(
  token: string,
): Promise<UserRow | null> {
  if (!token) return null;
  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.passwordResetTokens)
    .where(
      and(
        eq(schema.passwordResetTokens.tokenHash, hashToken(token)),
        isNull(schema.passwordResetTokens.usedAt),
        gt(schema.passwordResetTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!row) return null;
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, row.userId))
    .limit(1);
  return user ?? null;
}

/** Mark all outstanding tokens for a user used (after a successful reset). */
export async function consumeResetTokens(userId: number): Promise<void> {
  const db = getDb();
  await db
    .update(schema.passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(schema.passwordResetTokens.userId, userId),
        isNull(schema.passwordResetTokens.usedAt),
      ),
    );
}
