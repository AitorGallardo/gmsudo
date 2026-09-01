import type { Metadata } from "next/types";

const title = "Aitor Gallardo — product engineer, full-stack & AI";
const description =
  "Aitor Gallardo (@gmsudo) takes products from idea to shipped — design, frontend, backend, native apps, and the AI in between. Building XSaved: a local-first bookmark manager for X, live on Chrome and coming to iPhone.";

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
  keywords: ["Aitor Gallardo", "gmsudo", "Product Engineer", "Full-Stack Engineer", "AI Engineer", "iOS Developer", "XSaved", "TabKnight", "Portfolio"],
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
