import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/business";

// Self-hosted display face (was a render-blocking Google Fonts <link>).
const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

// Self-hosted body face (was three manually-preloaded 135KB OTFs).
const arboria = localFont({
  src: [
    { path: "../public/fonts/Arboria-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Arboria-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Arboria-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-primary",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CTR Food Works — Downtown Atlanta's Food Hall",
    template: "%s · CTR Food Works",
  },
  description:
    "Now open in downtown Atlanta inside the former CNN Center — 11 chef-driven kitchens and the largest bar in Georgia at 190 Marietta St NW. See hours and the lineup.",
  // Self-referencing canonical + og:url. "./" resolves per-route against
  // metadataBase, giving every page a canonical to its own clean URL — which
  // also collapses gclid/utm ad-click variants onto the canonical.
  alternates: { canonical: "./" },
  openGraph: {
    // No title/description here: Next backfills og:title/og:description from
    // each page's own title/description, so every page gets accurate OG text.
    url: "./",
    siteName: "CTR Food Works",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  // Google Search Console verification — only emitted when the token is set.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
  // favicon.ico is auto-served from app/favicon.ico. The icons below are
  // declared explicitly so Next.js emits the <link> tags for the PNG /
  // apple-touch / Android sizes on every page.
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${arboria.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Vercel Blob is the origin for admin-uploaded event images shown in
            the public events carousel — warm the connection early. */}
        <link
          rel="preconnect"
          href="https://blob.vercel-storage.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full font-primary bg-[var(--bg-warm-white)]">
        {/* Site chrome (NavBar/Footer/WelcomeModal/CookieNotice) lives in the
            (site) route-group layout so /dashboard can have its own minimal shell. */}
        {children}
      </body>
    </html>
  );
}
