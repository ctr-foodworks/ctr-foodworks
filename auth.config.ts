import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/db/schema";

/**
 * Edge-safe Auth.js config (no bcrypt / Node-only deps) so it can be imported
 * by middleware. The Credentials provider with bcrypt lives in auth.ts, which
 * runs in the Node runtime (route handler). This split keeps middleware on the
 * Edge runtime.
 */
export const authConfig = {
  trustHost: true,
  // JWT session that expires 1 hour after sign-in → admin is logged out
  // automatically. (maxAge < the default updateAge, so it's a hard 1h TTL.)
  session: { strategy: "jwt", maxAge: 60 * 60 },
  pages: { signIn: "/dashboard/login" },
  // Auth gating + the must-change-password redirect are handled in middleware.ts
  // and the dashboard layout (DB-based) — not via the token — to avoid
  // token/DB drift loops.
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole | undefined;
      }
      return session;
    },
  },
  providers: [], // real providers are added in auth.ts (Node runtime)
} satisfies NextAuthConfig;
