"use client";

export const PaletteTrigger = () => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:palette"))}
    aria-label="Open command palette"
    title="try it"
    className="hidden cursor-pointer sm:inline-block"
  >
    <kbd className="!mx-0 text-gray-9 transition-colors hover:text-gray-11">⌘K</kbd>
  </button>
);
