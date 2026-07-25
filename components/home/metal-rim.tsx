"use client";

import type { MetalFxPreset, MetalFxVariant } from "metal-fx";
import type { ReactNode } from "react";

import { MetalFx, PRESETS } from "metal-fx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Richen metal-fx's bundled `gold` preset into an unmistakable warm gold.
 *
 * The stock gold preset's dark block is dominated by pure black/white stops
 * (`#000000 #ffffff #ffffff #f7d488 #0d0d0d`) with a heavy vignette, so the
 * shader reads as dark chrome with only a hint of gold. The Plasma effect only
 * samples palette stops 1..5, so we replace those with a saturated amber→gold→
 * highlight ramp (keeping the light/dark metallic contrast that makes it read
 * as metal, but entirely inside the warm yellow/gold hue family) and lift the
 * vignette so the ring never darkens into a dull disc. Tuned to harmonize with
 * the warm gold perforated avatar image.
 *
 * `PRESETS` is a public export whose values `setSharedPreset` reads live, so
 * mutating it at module scope (before any MetalFx mounts) is the supported way
 * to override preset colors. Guarded so it only runs once.
 */
const GOLD_OVERRIDDEN = Symbol.for("gmsudo.metalGoldOverridden");
type GoldFlag = { [GOLD_OVERRIDDEN]?: boolean };

if (!(PRESETS.gold as GoldFlag)[GOLD_OVERRIDDEN]) {
  PRESETS.gold.modes.dark = {
    ...PRESETS.gold.modes.dark,
    colors: ["#7a4d00", "#ffe7a0", "#ffcf4d", "#f4b400", "#3d2800", "#fff3c4", "#ffffff"],
    alphas: [1, 1, 1, 1, 1, 1, 1],
    vignette: 0.2,
    vigOpacity: 0.28,
    shaderOpacity: 1,
  };
  PRESETS.gold.modes.light = {
    ...PRESETS.gold.modes.light,
    colors: ["#9a6412", "#ffdd83", "#fff0c2", "#efb42c", "#6f4d0f", "#fff6d6", "#ffffff"],
    alphas: [1, 1, 1, 1, 1, 1, 1],
    vignette: 0.2,
    vigOpacity: 0.2,
    shaderOpacity: 1,
  };
  (PRESETS.gold as GoldFlag)[GOLD_OVERRIDDEN] = true;
}

interface MetalRimProps {
  children: ReactNode;
  variant?: MetalFxVariant;
  preset?: MetalFxPreset;
  strength?: number;
  disableGlow?: boolean;
  borderRadius?: number;
  ringCssPx?: number;
  className?: string;
}

/**
 * Client-only wrapper around metal-fx's WebGL `MetalFx` ring.
 *
 * The shader is browser-only, so we render the plain child during SSR and the
 * first client paint (avoids hydration mismatches and gives us a graceful
 * pre-mount fallback), then mount the animated metallic rim once on the client.
 * The rim theme is driven by next-themes' resolved theme so it tracks the
 * manual dark/light toggle instead of the OS preference.
 *
 * metal-fx keeps its whole wrapper (including the wrapped child) at
 * `opacity: 0; visibility: hidden` until the shader paints its first frame.
 * That is fine for a decorative-only wrapper, but when the child is meaningful
 * content — an avatar — it must never be hidden while the shader warms up
 * (and in a throttled/suspended tab the first frame may never arrive). Callers
 * that wrap real content pass `!opacity-100 !visible` via `className` to defeat
 * that reveal gate; the opaque child then shows from first paint and only the
 * ring fades in once the shader is ready.
 */
export const MetalRim = ({
  children,
  variant = "button",
  preset = "gold",
  strength = 0.6,
  disableGlow = false,
  borderRadius,
  ringCssPx,
  className,
}: MetalRimProps) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  return (
    <MetalFx
      variant={variant}
      preset={preset}
      strength={strength}
      disableGlow={disableGlow}
      borderRadius={borderRadius}
      ringCssPx={ringCssPx}
      theme={resolvedTheme === "light" ? "light" : "dark"}
      className={className}
    >
      {children}
    </MetalFx>
  );
};
