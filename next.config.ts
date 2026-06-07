import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Runs as a Next.js server app on Vercel (SSR + route handlers + ISR) so the
  // events CMS, admin, auth, and form handlers work. (Previously this was a
  // static export — `output: "export"` — which has no server runtime.)
  //
  // `trailingSlash` is kept so existing folder-style URLs (/events/) don't break.
  trailingSlash: true,
};

export default nextConfig;
