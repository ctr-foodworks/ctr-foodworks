import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

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
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
