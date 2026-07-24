import type { Metadata } from "next/types";

const title = "Aitor Gallardo — full-stack & AI engineer";
const description =
  "Aitor Gallardo (@gmsudo) ships products end-to-end. Currently building XSaved — a local-first, AI-organized bookmark manager for X across Chrome, iOS, and Mac.";

export const OpenGraph: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
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
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}images/xsaved-icon.png`],
    siteName: "Aitor Gallardo",
  },
  twitter: {
    card: "summary",
    site: "@gmsudo",
    creator: "@gmsudo",
    title,
    description,
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}images/xsaved-icon.png`],
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
