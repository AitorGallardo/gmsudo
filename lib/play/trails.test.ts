import { describe, expect, it } from "bun:test";

import { computeTrailStamps, paintTrail } from "./trails";

describe("computeTrailStamps", () => {
  it("emits nothing below the speed threshold", () => {
    expect(computeTrailStamps({ x: 0, y: 0 }, { x: 3, y: 0 }, 6, 4)).toEqual([]);
  });

  it("emits a single pose just above threshold, starting at the previous pose", () => {
    const poses = computeTrailStamps({ x: 10, y: 10 }, { x: 17, y: 10 }, 6, 4);
    expect(poses).toHaveLength(1);
    expect(poses[0]).toEqual({ x: 10, y: 10 });
  });

  it("sub-samples a fast segment and caps at maxSub", () => {
    // 60px of travel at threshold 6 would be 10 stamps, capped to 4.
    const poses = computeTrailStamps({ x: 0, y: 0 }, { x: 60, y: 0 }, 6, 4);
    expect(poses).toHaveLength(4);
    expect(poses.map((p) => p.x)).toEqual([0, 15, 30, 45]);
    // Never includes the current pose (the live element already paints it).
    expect(poses.some((p) => p.x === 60)).toBe(false);
  });

  it("guards against non-finite travel", () => {
    expect(computeTrailStamps({ x: 0, y: 0 }, { x: Number.NaN, y: 0 }, 6, 4)).toEqual([]);
  });
});

describe("paintTrail", () => {
  it("draws one desaturated, faint stamp per pose via the detected method", () => {
    const calls: Array<{
      el: unknown;
      x: number;
      y: number;
      alpha: number;
      filter: string;
    }> = [];
    let alpha = 1;
    let filter = "none";
    const el = { tag: "piece" };
    const ctx = {
      save() {},
      restore() {},
      set globalAlpha(v: number) {
        alpha = v;
      },
      set filter(v: string) {
        filter = v;
      },
      drawElement(e: unknown, x: number, y: number) {
        calls.push({ el: e, x, y, alpha, filter });
      },
      drawElementImage() {},
      // biome-ignore lint/suspicious/noExplicitAny: minimal mock context for the draw path
    } as any;

    const poses = [
      { x: 5, y: 5 },
      { x: 9, y: 7 },
    ];
    paintTrail(ctx, "drawElement", el as unknown as Element, poses, 0.12);

    expect(calls).toHaveLength(2);
    expect(calls[0]).toMatchObject({ el, x: 5, y: 5, alpha: 0.12 });
    expect(calls[1]).toMatchObject({ el, x: 9, y: 7, alpha: 0.12 });
    // Every stamp is desaturated and within the ≤0.14 alpha budget.
    for (const c of calls) {
      expect(c.filter).toContain("grayscale");
      expect(c.alpha).toBeLessThanOrEqual(0.14);
    }
  });
});
