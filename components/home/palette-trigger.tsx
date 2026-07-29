"use client";

import { MetalRim } from "@/components/home/metal-rim";

/**
 * ⌘K command-palette trigger — gilded, by request.
 *
 * The liquid-gold metal rim is back on the chip (the owner's call: the ⌘K is a
 * statement piece alongside the avatar, not a quiet utility). borderRadius pins
 * the ring to the small rounded-rect kbd shape so ring + chip read as one
 * object, and the tray keeps the cluster's shared height so it still aligns
 * with the theme switcher. Desktop-only (⌘K is a hardware-keyboard affordance).
 */
export const PaletteTrigger = () => (
  <MetalRim variant="button" preset="gold" strength={0.6} borderRadius={6} className="hidden sm:inline-flex">
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:palette"))}
      aria-label="Open command palette"
      title="try it"
      className="flex cursor-pointer items-center rounded-[6px] bg-gray-2 p-[2px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
    >
      <kbd className="!mx-0 flex h-6 items-center text-gray-10 transition-colors hover:text-gray-11">⌘K</kbd>
    </button>
  </MetalRim>
);
