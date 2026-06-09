"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { updatePassword, updateProfile } from "@/lib/users-db";
import { validatePassword } from "@/lib/validation";

/**
 * Sets the user's password (+ optional profile) and clears mustChangePassword in
 * the DB. The dashboard layout reads that flag from the DB, so a plain redirect
 * to /dashboard lands them logged in — no token refresh / re-login needed.
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
  redirect("/dashboard");
}
