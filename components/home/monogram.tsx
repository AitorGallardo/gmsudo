"use client";

export const Monogram = () => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:terminal"))}
    aria-label="Open terminal"
    title="open a tiny terminal"
    className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-a3 font-medium text-gray-11 transition-colors hover:bg-gray-a4"
  >
    <span className="group-hover:hidden">ag</span>
    <span className="hidden font-mono text-small group-hover:inline">
      $<span className="cursor-blink">_</span>
    </span>
  </button>
);
