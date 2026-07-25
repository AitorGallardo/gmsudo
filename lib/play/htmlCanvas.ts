// Feature detection for Chrome's HTML-in-canvas API (origin trial, 2025-2026),
// ported from the sibling `cardstock` project so play mode can progressively
// enhance its physics render path.
//
// The surface is still moving: depending on the Chrome build the draw call is
// either `drawElement` or `drawElementImage`, and layout is opted-in via the
// `layoutsubtree` attribute (with a possible `layoutSubtree()` method form). We
// detect defensively and never assume one exact shape.
//
// Even when present the API is view-only today — the rasterised output does not
// receive input events, so the always-interactive layer stays the DOM (CSS
// transforms) and the canvas, when available, is a live paint mirror of it.

export type EngineKind = "drawElement" | "css-transforms";

export interface CanvasSupport {
  supported: boolean;
  drawMethod: "drawElement" | "drawElementImage" | null;
  layoutAttr: boolean;
  layoutMethod: boolean;
}

export function detectHtmlInCanvas(): CanvasSupport {
  const result: CanvasSupport = {
    supported: false,
    drawMethod: null,
    layoutAttr: false,
    layoutMethod: false,
  };

  try {
    const w = window as unknown as {
      CanvasRenderingContext2D?: { prototype: object };
      HTMLCanvasElement?: { prototype: Record<string, unknown> };
    };
    const ctxProto = w.CanvasRenderingContext2D?.prototype;
    const canvasProto = w.HTMLCanvasElement?.prototype;
    if (!ctxProto || !canvasProto) return result;

    if ("drawElement" in ctxProto) result.drawMethod = "drawElement";
    else if ("drawElementImage" in ctxProto) result.drawMethod = "drawElementImage";

    // `layoutsubtree` reflects as a property/attribute on the canvas element.
    result.layoutAttr = "layoutsubtree" in canvasProto || document.createElement("canvas").hasAttribute?.("layoutsubtree") === false;
    // Some builds expose an explicit layout method instead of the attribute.
    result.layoutMethod = typeof canvasProto.layoutSubtree === "function";

    // We only claim support when we actually have a draw method — that is the
    // load-bearing part. The layout opt-in is applied best-effort at runtime.
    result.supported = result.drawMethod !== null;
  } catch {
    // Any surprise here means we simply fall back. Never throw to the caller.
    return result;
  }

  return result;
}

export function engineLabel(support: CanvasSupport): string {
  if (support.supported && support.drawMethod) {
    return `${support.drawMethod} (html-in-canvas)`;
  }
  return "css transforms";
}
