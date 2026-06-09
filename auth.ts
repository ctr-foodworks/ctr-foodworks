import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "./lib/users-db";

/**
 * Full Auth.js setup (Node runtime). Admin credentials live in the Neon
 * `users` table — verified via verifyCredentials. Seed/reset an admin with
 * `npm run admin:create`. No password material in env (only AUTH_SECRET).
 */
export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        try {
          const user = await verifyCredentials(email, password);
          if (!user) return null;
          return {
            id: String(user.id),
            email: user.email,
            name: user.name ?? user.email,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
          };
        } catch {
          // DB unavailable / not configured — fail closed.
          return null;
        }
      },
    }),
  ],
});
