import { z } from "zod";

/**
 * Strong-password rule shared by the set-password (first login) and
 * change-password flows.
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/[0-9]/, "Add a number.");

/** Human-readable requirement shown under password fields. */
export const PASSWORD_HINT =
  "At least 8 characters, with an uppercase letter, a lowercase letter, and a number.";

/** Returns the first failing requirement, or null if valid. */
export function validatePassword(pw: string): string | null {
  const result = passwordSchema.safeParse(pw);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "That password is too weak.";
}
