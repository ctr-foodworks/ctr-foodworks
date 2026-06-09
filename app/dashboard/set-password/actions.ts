"use server";

import { redirect } from "next/navigation";
import { unstable_update } from "@/auth";
import { getCurrentUser } from "@/lib/current-user";
import { updatePassword, updateProfile } from "@/lib/users-db";
import { validatePassword } from "@/lib/validation";

/**
 * Plain form action (NOT useActionState) so signOut() works cleanly — calling
 * signOut inside a useActionState action triggers "An unexpected response was
 * received from the server." The form validates client-side first; this is the
 * server-side safety net.
 */
export async function setPasswordAction(formData: FormData): Promise<void> {
  const me = await getCurrentUser();
  if (!me) redirect("/dashboard/login");

  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (validatePassword(next) || next !== confirm) {
    redirect("/dashboard/set-password?error=1");
  }

  // Optional profile set during onboarding (photo already uploaded client-side).
  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const profile: { name?: string; imageUrl?: string } = {};
  if (name) profile.name = name;
  if (imageUrl) profile.imageUrl = imageUrl;
  if (Object.keys(profile).length) await updateProfile(me.email, profile);

  await updatePassword(me.email, next); // clears mustChangePassword in the DB
  // Update the session token in place so they stay logged in (no re-login).
  await unstable_update({ user: { mustChangePassword: false } });
  redirect("/dashboard");
}
