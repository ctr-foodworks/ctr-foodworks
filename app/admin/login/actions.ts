"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

/**
 * Server action for the admin login form. On success, signIn throws a redirect
 * to /admin (which must propagate). On bad credentials it returns an error
 * string for the form to display.
 */
export async function authenticate(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password.";
    }
    // Re-throw redirect (and any non-auth error) so Next can handle it.
    throw error;
  }
}
