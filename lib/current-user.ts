import "server-only";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/users-db";
import type { UserRow } from "@/lib/db/schema";

/**
 * Resolves the current admin user from the session + DB. Authorization (role)
 * and profile (name/photo/mustChangePassword) are read fresh from the database
 * rather than trusted from the token — more secure and never stale.
 */
export async function getCurrentUser(): Promise<UserRow | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  const user = await getUserByEmail(email);
  return user ?? null;
}
