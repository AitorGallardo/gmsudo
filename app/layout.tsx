import "@/styles/main.css";

import type { Metadata, Viewport } from "next";

import { Eggs } from "@/components/home/eggs";
import { Providers } from "@/components/providers";
import { OpenGraph } from "@/lib/og";

import clsx from "clsx";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  ...OpenGraph,
};

// viewport-fit=cover lets the page paint under the notch / home indicator so
// safe-area-inset-* has something to inset against; the theme-color pair keeps
// the iOS status bar and chrome matched to the page background (--gray-1) in
// each scheme so there is never a bright bar over the dark UI (or vice-versa).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(inter.className)} suppressHydrationWarning>
      {/* <head>
        <link rel="icon" href="/bbbookmarks-icon.svg" type="image/svg+xml" sizes="64x64" />
      </head> */}
      <body>
        <Providers>
          <main className="mx-auto max-w-screen-sm overflow-x-hidden px-6 py-16 sm:py-24 md:overflow-x-visible ">
            <article className="article">{children}</article>
          </main>
          <Eggs />
        </Providers>
      </body>
    </html>
  );
}
