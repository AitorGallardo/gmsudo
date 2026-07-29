"use client";

/**
 * ⌘K command-palette trigger — the quiet twin of the theme switcher.
 *
 * Design: the two header utilities read as one control system. Each is a
 * gray-2 "tray" (same surface, height and 6px radius) holding a key: the theme
 * tray holds the moon/sun keycaps, this tray holds a single ⌘K keycap. Gold is
 * the identity colour reserved for the avatar, so it appears here only as
 * interaction — a subtle gold hover border and a gold focus-visible ring — with
 * no static gold. The metal-fx rim that used to gild this chip is gone; it now
 * lives only on the avatar. Desktop-only (⌘K is a hardware-keyboard affordance).
 */
export const PaletteTrigger = () => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:palette"))}
    aria-label="Open command palette"
    title="try it"
    className="group hidden cursor-pointer items-center rounded-[6px] border border-transparent bg-gray-2 p-[2px] outline-none transition-colors hover:border-[var(--gold)] focus-visible:border-[var(--gold)] focus-visible:ring-2 focus-visible:ring-[var(--gold)] sm:inline-flex"
  >
    <kbd className="!mx-0 flex h-6 items-center text-gray-10 transition-colors group-hover:text-gray-11">⌘K</kbd>
  </button>
);
