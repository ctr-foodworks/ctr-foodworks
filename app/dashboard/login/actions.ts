"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/lib/users-db";

/**
 * Server action for the login form. Signs in, then redirects in a single hop to
 * the right place — set-password for invited users, otherwise the dashboard.
 * (Avoids the layout having to re-redirect, which caused a blank first paint.)
 */
export async function authenticate(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const email = String(formData.get("email") ?? "");
  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password.";
    }
    throw error;
  }

  const user = await getUserByEmail(email);
  redirect(user?.mustChangePassword ? "/dashboard/set-password" : "/dashboard/reports");
}
