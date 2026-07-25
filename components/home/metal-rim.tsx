"use client";

import type { MetalFxPreset, MetalFxVariant } from "metal-fx";
import type { ReactNode } from "react";

import { MetalFx } from "metal-fx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface MetalRimProps {
  children: ReactNode;
  variant?: MetalFxVariant;
  preset?: MetalFxPreset;
  strength?: number;
  disableGlow?: boolean;
  borderRadius?: number;
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
 */
export const MetalRim = ({ children, variant = "button", preset = "gold", strength = 0.6, disableGlow = false, borderRadius, className }: MetalRimProps) => {
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
      theme={resolvedTheme === "light" ? "light" : "dark"}
      className={className}
    >
      {children}
    </MetalFx>
  );
};
