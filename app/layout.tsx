import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ctrfoodworks.com"),
  title: {
    default: "CTR Food Works — Downtown Atlanta's Food Hall",
    template: "%s · CTR Food Works",
  },
  description:
    "Downtown Atlanta's Food Hall. 11 chef-driven dining concepts and 1 extraordinary bar inside the reimagined former CNN Center. Opening Spring 2026.",
  openGraph: {
    title: "CTR Food Works — Downtown Atlanta's Food Hall",
    description:
      "11 chef-driven dining concepts and 1 extraordinary bar inside the reimagined former CNN Center. Opening Spring 2026.",
    siteName: "CTR Food Works",
    type: "website",
  },
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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Arboria-Light.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Arboria-Medium.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Arboria-Bold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap"
          rel="stylesheet"
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
