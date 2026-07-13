"use server";

import { redirect } from "next/navigation";
import { getUserForResetToken, consumeResetTokens } from "@/lib/password-reset";
import { updatePassword } from "@/lib/users-db";
import { validatePassword } from "@/lib/validation";

/**
 * Complete a password reset. Re-verifies the token server-side (never trust the
 * page render alone), enforces the strong-password rule, updates the password,
 * then consumes the token so the link can't be reused.
 */
export async function resetPasswordAction(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const token = String(formData.get("token") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const user = await getUserForResetToken(token);
  if (!user) {
    return "This reset link is invalid or has expired. Request a new one.";
  }

  const pwError = validatePassword(next);
  if (pwError) return pwError;
  if (next !== confirm) return "Passwords don't match.";

  await updatePassword(user.email, next); // also clears mustChangePassword
  await consumeResetTokens(user.id);

  redirect("/dashboard/login?reset=1");
}
