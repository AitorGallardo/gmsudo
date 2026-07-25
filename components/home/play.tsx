"use client";

import type { PlayHandle } from "@/lib/play";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Bridges the "gmsudo:play" event to the lazily-loaded physics engine. Kept
// deliberately tiny: matter-js and the engine live in @/lib/play, imported only
// the first time play activates, so the home route's bundle stays untouched.
export const Play = () => {
  const pathname = usePathname();
  const handleRef = useRef<PlayHandle | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const onPlay = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const current = handleRef.current;
      if (current) {
        if (current.active) current.exit();
        return; // busy (live or mid-exit) — ignore repeat triggers
      }
      if (loadingRef.current) return;
      if (!document.querySelector("[data-play-body]")) return; // not the home page

      loadingRef.current = true;
      try {
        const mod = await import("@/lib/play");
        const handle = await mod.startPlay(() => {
          handleRef.current = null;
          (window as unknown as { __play?: PlayHandle }).__play = undefined;
        });
        handleRef.current = handle;
        (window as unknown as { __play?: PlayHandle }).__play = handle;
      } finally {
        loadingRef.current = false;
      }
    };

    window.addEventListener("gmsudo:play", onPlay);
    return () => window.removeEventListener("gmsudo:play", onPlay);
  }, []);

  // If the route changes while a session is live (e.g. a thrown link is
  // clicked), tear it down hard so scroll lock never leaks onto the next page.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger — cleanup runs on route change
  useEffect(() => {
    return () => {
      handleRef.current?.destroy();
    };
  }, [pathname]);

  return null;
};
