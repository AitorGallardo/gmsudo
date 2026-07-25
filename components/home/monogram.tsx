"use client";

import { MetalRim } from "@/components/home/metal-rim";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The avatar is the header's statement piece: a warm gold liquid-metal ring
 * around the gold perforated avatar.
 *
 * - The image is inset with ~3px of transparent padding so the shader ring has
 *   room to read as a distinct gold band (metal-fx draws its ring on a canvas
 *   *behind* the child, so an edge-to-edge child would hide it).
 * - `!opacity-100 !visible !bg-transparent` on the rim defeats metal-fx's
 *   reveal gate, which otherwise hides the whole wrapper — avatar included —
 *   until the shader's first frame. The opaque image now shows from first
 *   paint and is never dimmed; only the decorative ring fades in once the
 *   shader warms up.
 */
export const Monogram = () => (
  <MetalRim variant="circle" preset="gold" strength={0.95} ringCssPx={3} className="!visible !bg-transparent !opacity-100 rounded-full">
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("gmsudo:terminal"))}
      aria-label="Open terminal"
      title="open a tiny terminal"
      data-play-beam
      className="group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full p-[3px]"
    >
      <span className="relative block h-full w-full overflow-hidden rounded-full">
        <img src={`${basePath}/images/gmsudo-avatar.jpg`} alt="gmsudo" width={38} height={38} className="h-full w-full rounded-full object-cover" />
        <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/55 font-mono text-small text-white group-hover:flex">
          $<span className="cursor-blink">_</span>
        </span>
      </span>
    </button>
  </MetalRim>
);
