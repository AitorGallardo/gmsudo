// Experimental HTML-in-canvas render path for play mode, ported from the
// sibling `cardstock` project.
//
// When Chrome's html-in-canvas API is present we re-parent the *live* physics
// elements into a fixed <canvas layoutsubtree> and paint them every frame via
// the detected draw method. Because layoutsubtree children still participate in
// layout and hit-testing, the same delegated pointer code keeps working — input
// flows through the DOM while pixels flow through the canvas.
//
// Every canvas call is wrapped: if the (still-moving) API signature is not what
// we expect and anything throws, we silently move the elements back to plain DOM
// and stay on the CSS-transform path. Nothing the visitor sees ever breaks.

import type { CanvasSupport } from "./htmlCanvas";

// Minimal shapes for the experimental html-in-canvas surface, so we can call it
// without leaning on `any` (which biome forbids). These live-paint the DOM.
type DrawCtx = CanvasRenderingContext2D & Record<"drawElement" | "drawElementImage", (el: Element, x: number, y: number) => void>;
type LayoutCanvas = HTMLCanvasElement & {
  layoutSubtree?: (el: Element) => void;
};

export class CanvasMirror {
  active = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private method: "drawElement" | "drawElementImage" = "drawElement";
  private els: HTMLElement[] = [];
  private homes = new Map<HTMLElement, { parent: Node; next: Node | null }>();

  constructor(private support: CanvasSupport) {}

  tryEnable(els: HTMLElement[]): boolean {
    if (!this.support.supported || !this.support.drawMethod) return false;
    try {
      this.method = this.support.drawMethod;
      const canvas = document.createElement("canvas");
      canvas.id = "play-canvas";
      canvas.setAttribute("layoutsubtree", "");
      canvas.style.cssText = "position:fixed;inset:0;z-index:29;pointer-events:none;";
      document.body.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no 2d context");
      this.canvas = canvas;
      this.ctx = ctx;
      this.resize();

      // Remember each element's original home so teardown can put it back.
      for (const el of els) {
        this.homes.set(el, {
          parent: el.parentNode as Node,
          next: el.nextSibling,
        });
        canvas.appendChild(el);
      }
      this.els = els;

      const layoutCanvas = canvas as LayoutCanvas;
      if (this.support.layoutMethod && typeof layoutCanvas.layoutSubtree === "function") {
        for (const el of els) layoutCanvas.layoutSubtree?.(el);
      }

      // Probe the draw signature once. Throws here => bail to CSS.
      const probe = els[0];
      if (probe) (ctx as DrawCtx)[this.method](probe, 0, 0);

      this.active = true;
      return true;
    } catch {
      this.disable();
      return false;
    }
  }

  // The loop passes each element's top-left position; the canvas draw handles
  // translation while rotation/scale stay on the element transform.
  draw(positions: Map<HTMLElement, { x: number; y: number }>): void {
    if (!this.active || !this.ctx || !this.canvas) return;
    try {
      const ctx = this.ctx as DrawCtx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (const el of this.els) {
        const p = positions.get(el);
        ctx[this.method](el, p ? p.x : 0, p ? p.y : 0);
      }
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

  // Move every element back to its original DOM home and drop the canvas.
  disable(): void {
    this.active = false;
    try {
      for (const el of this.els) {
        const home = this.homes.get(el);
        if (home) home.parent.insertBefore(el, home.next);
      }
      this.canvas?.remove();
    } catch {
      /* nothing else to do */
    }
    this.homes.clear();
    this.canvas = null;
    this.ctx = null;
  }
}
