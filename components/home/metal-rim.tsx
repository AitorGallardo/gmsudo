"use client";

import type { MetalFxPreset, MetalFxVariant } from "metal-fx";
import type { ReactNode } from "react";

import { MetalFx, PRESETS } from "metal-fx";
import { useTheme } from "next-themes";
import { Component, useEffect, useRef, useState } from "react";

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

/**
 * Can this browser actually hand us a WebGL context?
 *
 * metal-fx creates its context lazily inside a React effect and throws
 * `metal-fx: WebGL not supported` when `getContext("webgl")` returns null —
 * which happens with hardware acceleration off, under some privacy/enterprise
 * policies, in a few embedded webviews, and on a GPU blocklist. A throw inside
 * an effect unmounts the entire React tree, so an unlucky visitor used to get
 * a blank page over a decorative ring. Probe once, up front, so those visitors
 * get the static gold ring and never touch the shader path.
 */
let webglSupport: boolean | null = null;

const supportsWebGL = () => {
  if (webglSupport !== null) return webglSupport;
  // Dev-only switch to eyeball the static rim in a browser that has WebGL:
  // append `?rim=static` to any page. Compiled out of the production export.
  if (process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("rim") === "static") {
    webglSupport = false;
    return webglSupport;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    webglSupport = !!gl;
    // Release the probe context immediately; browsers cap live contexts.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
};

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Static CSS stand-in for the shader ring: a hairline of warm gold around the
 * child, in the same `--gold` the rest of the site uses for its accents. It is
 * what visitors without WebGL (and those who asked for reduced motion) see,
 * and what everyone sees if the shader ever throws at runtime.
 */
const StaticRim = ({
  children,
  variant,
  className,
}: {
  children: ReactNode;
  variant: MetalFxVariant;
  className?: string;
}) => <span className={`metal-rim-static ${variant === "circle" ? "metal-rim-static-circle" : "metal-rim-static-button"}${className ?? ""}`}>{children}</span>;

interface RimBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

/**
 * Error boundary around the shader mount. Feature detection catches the
 * common "no WebGL at all" case before we ever render metal-fx; this catches
 * everything else — shader compile failures on odd drivers, a context that
 * exists but cannot allocate, a future metal-fx throw we did not predict —
 * and swaps in the static ring instead of taking the page down.
 */
class RimBoundary extends Component<RimBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") console.warn("metal-fx failed; using the static rim", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
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
 *
 * Without WebGL (or with reduced motion requested) the shader is never mounted
 * and a static CSS gold ring stands in — see `StaticRim` and `RimBoundary`.
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
  // metal-fx sizes its WebGL ring from the host's measured box and, at ≤2px,
  // hands the shader a negative <rect> (width/height -1) — a console error on
  // every load. We hold the plain child in a measuring host and only swap in
  // MetalFx once the box is comfortably larger than that degenerate range, so
  // the shader never mounts against a 0–2px layout (initial paint, a suspended
  // tab, or a not-yet-laid-out ancestor).
  const [sized, setSized] = useState(false);
  const [shader, setShader] = useState(false);
  const hostRef = useRef<HTMLSpanElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setShader(supportsWebGL() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || sized) return;
    const check = (w: number, h: number) => {
      if (w > 4 && h > 4) setSized(true);
    };
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        check(width, height);
      }
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    check(rect.width, rect.height);
    return () => ro.disconnect();
  }, [sized]);

  const fallback = (
    <StaticRim variant={variant} className={className}>
      {children}
    </StaticRim>
  );

  if (mounted && !shader) return fallback;

  if (!mounted || !sized)
    return (
      <span ref={hostRef} className={className} style={{ display: "inline-flex" }}>
        {children}
      </span>
    );

  return (
    <RimBoundary fallback={fallback}>
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
    </RimBoundary>
  );
};
