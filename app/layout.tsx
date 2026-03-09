import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Center — Opening Soon",
  description: "Atlanta's reimagined downtown landmark — where world-class entertainment, vibrant retail, and a thriving business community converge. Opening Spring 2026.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full font-primary bg-[var(--bg-warm-white)]">
        {children}
      </body>
    </html>
  );
}
