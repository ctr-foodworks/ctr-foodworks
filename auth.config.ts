import type { NextAuthConfig } from "next-auth";

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
  pages: { signIn: "/admin/login" },
  callbacks: {
    // Gate /admin (and /api/admin) behind a session. The login page itself
    // stays public so users can get in.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const path = nextUrl.pathname;
      const isLogin = path.startsWith("/admin/login");
      const isProtected =
        path.startsWith("/admin") || path.startsWith("/api/admin");
      if (isLogin) return true;
      if (isProtected) return isLoggedIn;
      return true;
    },
  },
  providers: [], // real providers are added in auth.ts (Node runtime)
} satisfies NextAuthConfig;
