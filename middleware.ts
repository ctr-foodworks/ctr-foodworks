import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Auth gate + pathname propagation. We only redirect unauthenticated *GET*
 * page loads (never action POSTs — redirecting those breaks Server Actions).
 * The must-change-password gate is enforced in the dashboard layout against the
 * DB (not the token), so we expose the current pathname via a request header.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = Boolean(req.auth?.user);
  const isLogin = path.startsWith("/dashboard/login");
  const isProtected =
    path.startsWith("/dashboard") || path.startsWith("/api/admin");

  if (isProtected && !isLogin && req.method === "GET" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/login", nextUrl));
  }

  const headers = new Headers(req.headers);
  headers.set("x-pathname", path);
  return NextResponse.next({ request: { headers } });
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
