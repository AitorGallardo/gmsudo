"use client";

import { MetalRim } from "@/components/home/metal-rim";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const Monogram = () => (
  <MetalRim variant="circle" preset="gold" strength={0.6}>
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:terminal"))}
      aria-label="Open terminal"
      title="open a tiny terminal"
      data-play-beam
      className="group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full"
    >
      <img src={`${basePath}/images/gmsudo-avatar.jpg`} alt="gmsudo" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
      <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/55 font-mono text-small text-white group-hover:flex">
        $<span className="cursor-blink">_</span>
      </span>
    </button>
  </MetalRim>
);
