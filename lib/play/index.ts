// Play mode — the cardstock physics concept, ported into the home page as an
// opt-in easter egg. On activate, every home row is pinned in place with
// position:fixed and handed to a 2D physics engine (matter-js, loaded lazily by
// the caller). Rows tip, fall, pile up, and can be grabbed and thrown. On exit
// they FLIP back to their exact original slots and every trace is removed, so
// the page is pixel-identical to before.
//
// The engine module is dynamically imported the first time play activates, so
// the normal page never pays for matter-js in its bundle.

import type MatterNamespace from "matter-js";

import { CanvasMirror } from "./canvasMirror";
import { detectHtmlInCanvas, engineLabel } from "./htmlCanvas";

export interface PlayHandle {
  readonly active: boolean;
  exit: (animate?: boolean) => void;
  destroy: () => void;
  tick: (dt: number) => void;
}

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const EXIT_MS = 450;
const DRAG_THRESHOLD = 4;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

interface Slot {
  el: HTMLElement;
  spacer: HTMLElement;
  prevStyle: string;
  left: number;
  top: number;
  width: number;
  height: number;
  body: MatterNamespace.Body;
  lift: number;
  grabbed: boolean;
}

// Starts a play session. `onDispose` fires once the session has fully torn down
// and the DOM is restored, so the caller can drop its reference.
export async function startPlay(onDispose: () => void): Promise<PlayHandle> {
  const Matter = (await import("matter-js")).default;
  const { Engine, Bodies, Body, Composite, Constraint, Common } = Matter;

  const docEl = document.documentElement;
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-play-body]"));

  // ---- lock scroll (compensating for the scrollbar so nothing shifts) -------
  const prevOverflow = docEl.style.overflow;
  const prevPaddingRight = docEl.style.paddingRight;
  const scrollbar = window.innerWidth - docEl.clientWidth;
  docEl.style.overflow = "hidden";
  if (scrollbar > 0) docEl.style.paddingRight = `${scrollbar}px`;

  const initialW = window.innerWidth;
  const initialH = window.innerHeight;

  // ---- engine ---------------------------------------------------------------
  const engine = Engine.create();
  engine.gravity.y = 1; // light, calm fall
  const world = engine.world;

  let walls: MatterNamespace.Body[] = [];
  const buildWalls = () => {
    if (walls.length) Composite.remove(world, walls);
    const t = 240;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const opts = { isStatic: true, restitution: 0.2, friction: 0.4 };
    walls = [
      Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, opts),
      Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, opts),
      Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, opts),
      Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, opts),
    ];
    Composite.add(world, walls);
  };
  buildWalls();

  // ---- detach each row into a physics body ----------------------------------
  const slots: Slot[] = [];
  for (const el of targets) {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);

    const spacer = document.createElement("div");
    spacer.setAttribute("data-play-spacer", "");
    spacer.style.height = `${rect.height}px`;
    spacer.style.marginTop = cs.marginTop;
    spacer.style.marginBottom = cs.marginBottom;
    el.parentNode?.insertBefore(spacer, el);

    const prevStyle = el.style.cssText;
    el.classList.add("play-body");
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.setProperty("margin", "0", "important");

    const body = Bodies.rectangle(rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width, rect.height, {
      restitution: 0.16,
      friction: 0.18,
      frictionAir: 0.028,
      frictionStatic: 0.7,
      density: 0.0018,
      chamfer: { radius: 8 },
    });
    Body.setAngularVelocity(body, Common.random(-0.028, 0.028));
    Body.setVelocity(body, { x: Common.random(-0.6, 0.6), y: 0 });
    Composite.add(world, body);

    slots.push({
      el,
      spacer,
      prevStyle,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      body,
      lift: 0,
      grabbed: false,
    });
  }

  // ---- border beams ---------------------------------------------------------
  // A faint animated border-beam on every separated content container: the
  // physics bodies plus the fixed header cluster. CSS-only; the element here is
  // a pointer-events:none overlay so it never touches layout, input, or the
  // FLIP restore. Durations and negative delays are randomised so laps don't
  // pulse in sync.
  const beamTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-play-body], [data-play-beam]"));
  const beams: HTMLElement[] = [];
  for (const el of beamTargets) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const radius = Number.parseFloat(cs.borderTopLeftRadius) || 0;
    const rounded = radius >= Math.min(rect.width, rect.height) / 2 - 1;

    const beam = document.createElement("div");
    beam.className = "play-beam";
    beam.setAttribute("aria-hidden", "true");
    beam.style.borderRadius = rounded ? "9999px" : "8px";
    const dur = 3 + Math.random() * 3; // 3–6s per lap
    beam.style.setProperty("--play-beam-dur", `${dur.toFixed(2)}s`);
    beam.style.setProperty("--play-beam-delay", `-${(Math.random() * dur).toFixed(2)}s`);
    el.appendChild(beam);
    beams.push(beam);
  }
  // Commit the opacity:0 start state (a single reflow), then fade the beams in
  // together — reflow-triggered rather than rAF-triggered so the soft appear
  // still fires when rAF is throttled (e.g. a background tab).
  void document.body.offsetWidth;
  for (const b of beams) b.classList.add("play-beam-on");

  // ---- html-in-canvas engine (progressive enhancement) ----------------------
  // DOM + CSS transforms stay the source of truth for input and layout. When
  // Chrome's html-in-canvas API is present we live-paint the physics elements
  // through a canvas layer; any failure reverts silently to the CSS path.
  const support = detectHtmlInCanvas();
  const mirror = new CanvasMirror(support);
  mirror.tryEnable(slots.map((s) => s.el));
  let engineText = mirror.active ? engineLabel(support) : "css transforms";
  if (support.supported && !mirror.active) engineText = "css transforms (drawElement present, mirror off)";

  // ---- hint -----------------------------------------------------------------
  const hint = document.createElement("div");
  hint.className = "play-hint";
  const hintLine = document.createElement("div");
  hintLine.textContent = "esc puts everything back";
  const engineLine = document.createElement("div");
  engineLine.className = "play-hint-engine";
  engineLine.textContent = `engine: ${engineText}`;
  hint.append(hintLine, engineLine);
  document.body.appendChild(hint);

  // ---- render step ----------------------------------------------------------
  const positions = new Map<HTMLElement, { x: number; y: number }>();
  const writeSlot = (s: Slot) => {
    const b = s.body;
    const target = s.grabbed ? 1 : 0;
    s.lift += (target - s.lift) * 0.18;

    const dx = b.position.x - s.width / 2 - s.left;
    const dy = b.position.y - s.height / 2 - s.top;
    const deg = (b.angle * 180) / Math.PI;

    // Subtle velocity tilt — cardstock's feel, dialled way down.
    const tiltAmt = 0.22 + s.lift * 0.5;
    const tiltY = clamp(b.velocity.x * tiltAmt, -4, 4);
    const tiltX = clamp(-b.velocity.y * tiltAmt, -4, 4);
    const scale = 1 + s.lift * 0.018;
    const spin =
      `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) ` + `rotateZ(${deg.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

    if (mirror.active) {
      // Canvas draw handles translation; the element keeps only rotation/scale.
      s.el.style.transform = spin;
      positions.set(s.el, { x: s.left + dx, y: s.top + dy });
    } else {
      s.el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) ${spin}`;
    }
  };

  const step = (dt: number) => {
    Engine.update(engine, Math.min(dt, 1000 / 30));
    for (const s of slots) writeSlot(s);
    if (mirror.active) mirror.draw(positions);
  };
  // Place everything once so there is no flash before the first frame.
  for (const s of slots) writeSlot(s);

  let running = true;
  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    if (!running) return;
    const dt = now - last;
    last = now;
    step(dt);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  // ---- dragging (spring constraint, click-safe) -----------------------------
  let drag: {
    slot: Slot;
    constraint: MatterNamespace.Constraint;
    pointerId: number;
    startX: number;
    startY: number;
    active: boolean;
  } | null = null;
  let justDragged = false;
  let suppressTimer = 0;

  const clampVelocity = (body: MatterNamespace.Body, max: number) => {
    const v = body.velocity;
    const s = Math.hypot(v.x, v.y);
    if (s > max) Body.setVelocity(body, { x: (v.x / s) * max, y: (v.y / s) * max });
  };

  const onPointerDown = (e: PointerEvent) => {
    if (drag) return;
    const el = (e.target as HTMLElement | null)?.closest(".play-body") as HTMLElement | null;
    if (!el) return;
    const slot = slots.find((s) => s.el === el);
    if (!slot) return;

    const constraint = Constraint.create({
      pointA: { x: e.clientX, y: e.clientY },
      bodyB: slot.body,
      pointB: {
        x: e.clientX - slot.body.position.x,
        y: e.clientY - slot.body.position.y,
      },
      stiffness: 0.08,
      damping: 0.16,
      length: 0,
    });
    drag = {
      slot,
      constraint,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      active: false,
    };
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (!drag.active) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < DRAG_THRESHOLD) return;
      drag.active = true;
      drag.slot.grabbed = true;
      drag.slot.el.classList.add("play-lifted");
      Composite.add(world, drag.constraint);
      try {
        drag.slot.el.setPointerCapture(e.pointerId);
      } catch {
        /* capture not always allowed */
      }
    }
    drag.constraint.pointA = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  const endDrag = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.active) {
      Composite.remove(world, drag.constraint);
      drag.slot.grabbed = false;
      drag.slot.el.classList.remove("play-lifted");
      clampVelocity(drag.slot.body, 24);
      justDragged = true;
      window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(() => {
        justDragged = false;
      }, 350);
    }
    drag = null;
  };

  // Swallow the click that follows a real drag, so a thrown link doesn't fire.
  const onClickCapture = (e: MouseEvent) => {
    if (!justDragged) return;
    justDragged = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    const t = document.activeElement as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    exit(true);
  };

  let dirty = false;
  const onResize = () => {
    buildWalls();
    mirror.resize();
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const s of slots) {
      Body.setPosition(s.body, {
        x: clamp(s.body.position.x, 20, w - 20),
        y: clamp(s.body.position.y, 20, h - 20),
      });
    }
    dirty = window.innerWidth !== initialW || window.innerHeight !== initialH;
  };

  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);
  document.addEventListener("click", onClickCapture, true);

  // ---- teardown -------------------------------------------------------------
  let active = true;
  let torn = false;

  const removeListeners = () => {
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("click", onClickCapture, true);
  };

  const hardRestore = () => {
    for (const s of slots) {
      s.el.classList.remove("play-body", "play-lifted");
      s.el.style.cssText = s.prevStyle;
      s.spacer.remove();
    }
    for (const b of beams) b.remove();
    docEl.style.overflow = prevOverflow;
    docEl.style.paddingRight = prevPaddingRight;
    Composite.clear(world, false, true);
    Engine.clear(engine);
    onDispose();
  };

  const teardown = (animate: boolean) => {
    if (torn) return;
    torn = true;
    active = false;
    running = false;
    cancelAnimationFrame(raf);
    window.clearTimeout(suppressTimer);
    if (drag) {
      try {
        Composite.remove(world, drag.constraint);
      } catch {
        /* already gone */
      }
      drag = null;
    }
    removeListeners();

    // Return elements to the DOM before restoring; when the canvas path was
    // live we skip the transform animation to avoid a re-parent jump.
    const wasCanvas = mirror.active;
    mirror.disable();

    // Fade the beams out cleanly ahead of removal.
    for (const b of beams) b.classList.remove("play-beam-on");
    hint.remove();

    if (animate && !dirty && !wasCanvas) {
      for (const s of slots) {
        s.el.style.transition = `transform ${EXIT_MS}ms ${EASE}`;
        s.el.style.transform = "translate3d(0px, 0px, 0) rotateZ(0deg)";
      }
      window.setTimeout(hardRestore, EXIT_MS + 40);
    } else {
      hardRestore();
    }
  };

  const exit = (animate = true) => teardown(animate);
  const destroy = () => teardown(false);

  return {
    get active() {
      return active;
    },
    exit,
    destroy,
    tick: (dt: number) => {
      if (active) step(dt);
    },
  };
}
