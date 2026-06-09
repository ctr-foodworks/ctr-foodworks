import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Runs as a Next.js server app on Vercel (SSR + route handlers + ISR).
  //
  // NOTE: no `trailingSlash` — with it on, Server Action / API POSTs to a
  // non-slash URL get 308-redirected, which breaks them with "An unexpected
  // response was received from the server."
  //
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
