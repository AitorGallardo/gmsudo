import type { Metadata } from "next/types";

const title = "Aitor Gallardo — full-stack & AI engineer";
const description =
  "Aitor Gallardo (@gmsudo) ships products end-to-end. Currently building XSaved — a local-first, AI-organized bookmark manager for X across Chrome, iOS, and Mac.";

// `basePath` (next.config.mjs) is automatically prepended by Next.js when it resolves
// file-convention metadata routes (icon, opengraph-image) against `metadataBase`. Since
// NEXT_PUBLIC_SITE_URL already includes the basePath in its path (".../gmsudo/"), using it
// as-is here would double the segment (".../gmsudo/gmsudo/opengraph-image"). Use the origin
// only so Next can append the basePath itself, exactly once.
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : undefined;

export const OpenGraph: Metadata = {
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  title: {
    default: title,
    template: "%s",
  },
  description,
  keywords: ["Aitor Gallardo", "gmsudo", "Full-Stack Engineer", "AI Engineer", "XSaved", "TabKnight", "Portfolio"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title,
    description,
    siteName: "Aitor Gallardo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@gmsudo",
    creator: "@gmsudo",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
