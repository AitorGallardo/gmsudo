// Ghost trails — the html-in-canvas signature effect for play mode. When a
// piece moves fast, we stamp decaying, desaturated afterimages of the *live*
// element into a viewport-fixed canvas via Chrome's html-in-canvas draw method
// (drawElement / drawElementImage). The canvas fades globally every frame so the
// ghosts dissolve over ~400-600ms — a long-exposure-photography look.
//
// This is the drawElement showcase: where the API is absent (e.g. stable
// Chrome), the layer never enables and no trail work runs at all — the engine
// hint line already tells the visitor which render path is live. The pure
// geometry helpers below are exported so the stamp math is unit-testable with a
// mock context, independent of any real DOM.

import type { CanvasSupport } from "./htmlCanvas";

type DrawCtx = CanvasRenderingContext2D & Record<"drawElement" | "drawElementImage", (el: Element, x: number, y: number) => void>;

export interface Pt {
  x: number;
  y: number;
}

// Given an element's previous and current top-left in viewport (client) space,
// return the intermediate poses to stamp this frame. Below `threshold` px of
// travel there is nothing to smear. Above it we sub-sample the segment so a fast
// piece leaves a continuous streak rather than a dotted line, capped at `maxSub`
// stamps so a single teleport can't explode the stamp budget. Poses run from the
// previous pose up to (but not including) the current one — the live element
// already paints the current frame.
export function computeTrailStamps(prev: Pt, cur: Pt, threshold: number, maxSub: number): Pt[] {
  const dx = cur.x - prev.x;
  const dy = cur.y - prev.y;
  const dist = Math.hypot(dx, dy);
  if (!Number.isFinite(dist) || dist < threshold) return [];
  const n = Math.min(maxSub, Math.max(1, Math.round(dist / threshold)));
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    out.push({ x: prev.x + dx * t, y: prev.y + dy * t });
  }
  return out;
}

// Paint a set of poses of one element into a draw-capable context. Monochrome
// and faint (alpha ≤ 0.14) so the effect reads as elegant long exposure, never
// flashy. Isolated in its own save/restore so it never leaks state.
export function paintTrail(ctx: DrawCtx, method: "drawElement" | "drawElementImage", el: Element, poses: Pt[], alpha: number): void {
  for (const p of poses) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.filter = "grayscale(1) opacity(0.9)";
    ctx[method](el, p.x, p.y);
    ctx.restore();
  }
}

const STAMP_ALPHA = 0.12; // ≤ 0.14 per the design
const FADE_ALPHA = 0.11; // destination-out per frame → ~500ms dissolve at 60fps

export class TrailLayer {
  active = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private method: "drawElement" | "drawElementImage" = "drawElement";
  private stamps = 0;

  constructor(private support: CanvasSupport) {}

  enable(): boolean {
    if (!this.support.supported || !this.support.drawMethod) return false;
    try {
      this.method = this.support.drawMethod;
      const canvas = document.createElement("canvas");
      canvas.id = "play-trails";
      canvas.setAttribute("layoutsubtree", "");
      // Sits just under the live pieces (overlay z-index 30) and the live mirror
      // (29), fixed to the viewport, pointer-transparent.
      canvas.style.cssText = "position:fixed;inset:0;z-index:28;pointer-events:none;";
      document.body.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no 2d context");
      this.canvas = canvas;
      this.ctx = ctx;
      this.resize();
      this.active = true;
      return true;
    } catch {
      this.disable();
      return false;
    }
  }

  // Fade the whole canvas a notch, then reset the per-frame stamp budget. Called
  // once at the top of every frame while any piece is fast.
  beginFrame(): void {
    this.stamps = 0;
    if (!this.active || !this.ctx || !this.canvas) return;
    try {
      const ctx = this.ctx;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1;
      ctx.filter = "none";
      ctx.fillStyle = `rgba(0,0,0,${FADE_ALPHA})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
    } catch {
      this.disable();
    }
  }

  // Stamp one element's recent poses (viewport/client top-left coords). `cap`
  // bounds total stamps this frame so the effect stays cheap under a scatter.
  stamp(el: HTMLElement, poses: Pt[], cap: number): void {
    if (!this.active || !this.ctx || poses.length === 0) return;
    if (this.stamps >= cap) return;
    const room = cap - this.stamps;
    const use = poses.length > room ? poses.slice(poses.length - room) : poses;
    try {
      paintTrail(this.ctx as DrawCtx, this.method, el, use, STAMP_ALPHA);
      this.stamps += use.length;
    } catch {
      this.disable();
    }
  }

  resize(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerHeight * dpr);
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  disable(): void {
    this.active = false;
    try {
      this.canvas?.remove();
    } catch {
      /* nothing else to do */
    }
    this.canvas = null;
    this.ctx = null;
  }
}
