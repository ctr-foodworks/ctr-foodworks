"use server";

import { signOut } from "@/auth";
import { getCurrentUser } from "@/lib/current-user";
import { updatePassword } from "@/lib/users-db";
import { validatePassword } from "@/lib/validation";

export type SetPasswordState = { error?: string } | undefined;

export async function setPasswordAction(
  _prev: SetPasswordState,
  formData: FormData,
): Promise<SetPasswordState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Not authorized." };

  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const pwError = validatePassword(next);
  if (pwError) return { error: pwError };
  if (next !== confirm) return { error: "Passwords don't match." };

  // Sets the password and clears mustChangePassword.
  await updatePassword(me.email, next);
  // Sign out so a fresh token (mustChangePassword=false) is issued on re-login.
  await signOut({ redirectTo: "/admin/login" });
}
