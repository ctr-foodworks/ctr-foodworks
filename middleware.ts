import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge middleware built from the edge-safe config. The `authorized` callback
// (auth.config.ts) decides access; unauthorized /dashboard requests are redirected
// to the login page.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  // Protect the admin UI and the admin API. (Login page is allowed through by
  // the authorized() callback.)
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
