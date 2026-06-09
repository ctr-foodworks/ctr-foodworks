"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/current-user";
import { verifyCredentials, updatePassword, updateProfile } from "@/lib/users-db";
import { validatePassword } from "@/lib/validation";

export type ProfileState = { error?: string } | undefined;

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Not authorized." };
  const name = String(formData.get("name") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  await updateProfile(me.email, { name, imageUrl });
  revalidatePath("/dashboard", "layout"); // refresh header avatar/name
  redirect("/dashboard/account?flash=profile-updated");
}

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

  const pwError = validatePassword(next);
  if (pwError) return { error: pwError };
  if (next !== confirm) {
    return { error: "New passwords don't match." };
  }

  const user = await verifyCredentials(email, current);
  if (!user) return { error: "Current password is incorrect." };

  await updatePassword(email, next);
  redirect("/dashboard/account?flash=password-updated");
}
