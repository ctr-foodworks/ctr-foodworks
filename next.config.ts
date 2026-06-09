import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Runs as a Next.js server app on Vercel (SSR + route handlers + ISR) so the
  // events CMS, admin, auth, and form handlers work. (Previously this was a
  // static export — `output: "export"` — which has no server runtime.)
  //
  // `trailingSlash` is kept so existing folder-style URLs (/events/) don't break.
  trailingSlash: true,
  // The dashboard moved from /admin → /dashboard. Redirect old links/bookmarks
  // (and earlier invite emails) so they still land correctly.
  async redirects() {
    return [
      { source: "/admin", destination: "/dashboard", permanent: false },
      {
        source: "/admin/:path*",
        destination: "/dashboard/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
