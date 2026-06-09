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
  callbacks: {
    // Gate /dashboard (and /api/admin) behind a session. The login page itself
    // stays public. Invited users (mustChangePassword) are forced to
    // /dashboard/set-password until they set a real password.
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const path = nextUrl.pathname;
      const isLogin = path.startsWith("/dashboard/login");
      const isProtected =
        path.startsWith("/dashboard") || path.startsWith("/api/admin");
      if (isLogin || !isProtected) return true;

      // Never redirect non-GET requests (Server Actions / API POSTs). Issuing a
      // redirect to a POST breaks the action with "An unexpected response was
      // received from the server." Those handlers enforce their own auth.
      if (request.method !== "GET") return true;

      if (!auth?.user) return false;

      const onSetPassword = path.startsWith("/dashboard/set-password");
      if (auth.user.mustChangePassword && !onSetPassword) {
        return Response.redirect(new URL("/dashboard/set-password", nextUrl));
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
      }
      // Allow in-place updates (e.g. clearing mustChangePassword after the
      // forced set-password) so the user stays logged in — no re-login needed.
      if (trigger === "update" && session) {
        const s = session as { user?: { mustChangePassword?: boolean } };
        if (typeof s.user?.mustChangePassword === "boolean") {
          token.mustChangePassword = s.user.mustChangePassword;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole | undefined;
        session.user.mustChangePassword = token.mustChangePassword as
          | boolean
          | undefined;
      }
      return session;
    },
  },
  providers: [], // real providers are added in auth.ts (Node runtime)
} satisfies NextAuthConfig;
