import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

/**
 * Full Auth.js setup (Node runtime). Single shared admin: credentials are
 * checked against ADMIN_EMAIL + ADMIN_PASSWORD_HASH (a bcrypt hash generated
 * with `npm run admin:hash`). No users table — one trusted login for the team.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password ?? "");

        const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();
        const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
        if (!adminEmail || !hash) return null;
        if (email !== adminEmail) return null;

        const ok = await bcrypt.compare(password, hash);
        if (!ok) return null;

        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],
});
