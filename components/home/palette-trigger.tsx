"use client";

import { MetalRim } from "@/components/home/metal-rim";

export const PaletteTrigger = () => (
  <MetalRim variant="button" preset="gold" strength={0.6} className="hidden sm:inline-flex">
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:palette"))}
      aria-label="Open command palette"
      title="try it"
      className="hidden cursor-pointer rounded-full px-2.5 py-1 sm:block"
    >
      <kbd className="!mx-0 text-gray-9 transition-colors hover:text-gray-11">⌘K</kbd>
    </button>
  </MetalRim>
);
