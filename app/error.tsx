"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary (Next.js `error.tsx` convention, client-side —
 * it works under `output: "export"` because the boundary lives in the client
 * bundle). The decorative WebGL rim has its own boundary in
 * components/home/metal-rim.tsx; this is the last line so that any other
 * runtime throw shows a quiet, on-brand page instead of a blank one.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }, [error]);

  return (
    <div className="stagger">
      <p className="font-mono text-muted text-small">aitor@gmsudo:~ $ something broke</p>
      <p className="mt-4">This page hit an error while rendering. Nothing you did — try again, or head home.</p>
      <p className="mt-4 flex gap-4">
        <button type="button" onClick={reset} className="underline decoration-gray-a6 underline-offset-2 transition-colors hover:decoration-gray-a10">
          Try again
        </button>
        <a href="/" className="underline decoration-gray-a6 underline-offset-2 transition-colors hover:decoration-gray-a10">
          Home
        </a>
      </p>
    </div>
  );
}
