"use client";

import { MetalRim } from "@/components/home/metal-rim";

export const PaletteTrigger = () => (
  // borderRadius pins the metal ring to the small rounded-rect kbd chip instead
  // of the pill silhouette metal-fx would otherwise derive from a `rounded-full`
  // host — the button hugs the chip with ~2px of breathing room so ring + chip
  // read as one object. See metal-rim.tsx / the kbd rule in styles/main.css.
  <MetalRim variant="button" preset="gold" strength={0.6} borderRadius={6} className="hidden sm:inline-flex">
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:palette"))}
      aria-label="Open command palette"
      title="try it"
      className="hidden cursor-pointer rounded-[6px] p-0.5 sm:block"
    >
      <kbd className="!mx-0 text-gray-9 transition-colors hover:text-gray-11">⌘K</kbd>
    </button>
  </MetalRim>
);
