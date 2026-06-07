"use server";

import { auth } from "@/auth";
import { verifyCredentials, updatePassword } from "@/lib/users-db";

export type PasswordState = { error?: string; success?: boolean } | undefined;

export async function changePassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { error: "Not authorized." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (next !== confirm) {
    return { error: "New passwords don't match." };
  }

  const user = await verifyCredentials(email, current);
  if (!user) return { error: "Current password is incorrect." };

  await updatePassword(email, next);
  return { success: true };
}
