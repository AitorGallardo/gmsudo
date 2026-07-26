// Play mode — a faithful port of the cardstock demo's physics engine
// (../../cardstock/src/main.ts) into the home page as an opt-in easter egg. On
// activate, every home row is pinned in place with position:fixed and handed to
// a 2D physics engine (matter-js, loaded lazily by the caller) as a fully
// DYNAMIC body. The engine runs in zero gravity (gravity.y = 0), so a piece
// spawned with zero velocity sits exactly in its layout slot indefinitely — the
// page still looks completely untouched (the only visible change is the
// border-beams). But every piece is LIVE from the first frame: grab any piece
// and drag it anywhere on the page, throw it and it caroms off the walls and off
// the other pieces, which get batted around too — chain reactions included, just
// like cardstock. Press 'g' to toggle real gravity on: everything falls and
// piles. On exit everything FLIPs back to its exact original layout slot and
// every trace is removed, so the page is pixel-identical to before.
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
// Grab spring — soft enough to feel weighty, damped enough not to oscillate.
const DRAG_STIFFNESS = 0.09;
const DRAG_DAMPING = 0.14;

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
  // Offset of this element's fixed-positioning containing block from the
  // viewport. Non-zero when an ancestor carries a transform/filter (the home
  // "reveal" stagger leaves an identity transform + blur(0) behind, both of
  // which relocate the containing block). We subtract it from left/top so a
  // pinned piece renders pixel-exact over its original layout slot.
  offX: number;
  offY: number;
}

// Starts a play session. `onDispose` fires once the session has fully torn down
// and the DOM is restored, so the caller can drop its reference.
export async function startPlay(onDispose: () => void): Promise<PlayHandle> {
  const Matter = (await import("matter-js")).default;
  const { Engine, Bodies, Body, Composite, Constraint } = Matter;

  const docEl = document.documentElement;
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-play-body]"));

  // A real pointer drag that starts on an anchor or image fires the browser's
  // native drag-and-drop: a translucent link/image ghost follows the cursor and
  // every pointermove goes dead, so the physics never sees the gesture. Marking
  // the pieces and their descendants non-draggable — plus the capturing
  // `dragstart` guard installed below — kills that path entirely. We also clear
  // any live text selection so a drag over paragraph copy throws instead of
  // highlighting.
  const dragDisabled: { el: HTMLElement; prev: string | null }[] = [];
  const disableNativeDrag = (root: HTMLElement) => {
    const mark = (node: HTMLElement) => {
      dragDisabled.push({ el: node, prev: node.getAttribute("draggable") });
      node.setAttribute("draggable", "false");
    };
    mark(root);
    for (const child of Array.from(root.querySelectorAll<HTMLElement>("a, img"))) mark(child);
  };
  window.getSelection?.()?.removeAllRanges();

  // Suppress native drag globally while play is live (capturing, so it wins
  // before an anchor's own handlers). Removed on teardown.
  const onDragStart = (e: DragEvent) => e.preventDefault();
  document.addEventListener("dragstart", onDragStart, true);

  // ---- lock scroll (compensating for the scrollbar so nothing shifts) -------
  const prevOverflow = docEl.style.overflow;
  const prevPaddingRight = docEl.style.paddingRight;
  const scrollbar = window.innerWidth - docEl.clientWidth;
  docEl.style.overflow = "hidden";
  if (scrollbar > 0) docEl.style.paddingRight = `${scrollbar}px`;

  const initialW = window.innerWidth;
  const initialH = window.innerHeight;

  // ---- engine ---------------------------------------------------------------
  // Zero-g by default (cardstock main.ts lines 19-21). With zero initial
  // velocity every dynamic piece stays put in its layout slot; 'g' toggles the
  // real fall on. gravity.scale scales the per-tick pull so the gravity-on feel
  // matches cardstock exactly.
  const engine = Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 0;
  engine.gravity.scale = 0.0011;
  const world = engine.world;

  let walls: MatterNamespace.Body[] = [];
  const buildWalls = () => {
    if (walls.length) Composite.remove(world, walls);
    const t = 240;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const opts = { isStatic: true, restitution: 0.6, friction: 0.05 };
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
  // Only pieces fully inside the CURRENT viewport at activation are converted.
  // The arena walls sit exactly on the viewport bounds (buildWalls above), so a
  // piece that is below/above the fold — or one that straddles a viewport edge —
  // would overlap a static wall at spawn and get shoved by the solver, drifting
  // with zero interaction and breaking the "page looks untouched" guarantee (the
  // home page is taller than a laptop viewport). Scroll is locked during play,
  // so off-screen pieces are unreachable anyway. Straddling pieces are EXCLUDED
  // rather than included-with-a-widened-wall: that keeps the wall box exactly
  // viewport-sized and guarantees every converted body spawns fully clear of
  // every wall, i.e. zero at-rest movement. Excluded pieces are left completely
  // untouched — no pin, spacer, body, drag-disable, or beam — so Esc needs to do
  // nothing for them. A later re-activation at a different scroll offset picks
  // the then-visible set.
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const slots: Slot[] = [];
  for (const el of targets) {
    const rect = el.getBoundingClientRect();
    if (rect.top < 0 || rect.left < 0 || rect.bottom > viewH || rect.right > viewW) continue;
    const cs = getComputedStyle(el);

    const spacer = document.createElement("div");
    spacer.setAttribute("data-play-spacer", "");
    spacer.style.height = `${rect.height}px`;
    spacer.style.marginTop = cs.marginTop;
    spacer.style.marginBottom = cs.marginBottom;
    el.parentNode?.insertBefore(spacer, el);

    const prevStyle = el.style.cssText;
    el.classList.add("play-body");
    disableNativeDrag(el);
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.setProperty("margin", "0", "important");

    // Cardstock's piece material, verbatim (main.ts lines 62-70). The body is
    // fully dynamic from creation — no static pinning. In zero-g with zero
    // initial velocity matter integrates nothing, so it sits pixel-exact in its
    // layout slot until a grab, a collision, or gravity moves it. No initial
    // tip/velocity, so the resting page looks untouched.
    const body = Bodies.rectangle(rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width, rect.height, {
      restitution: 0.55,
      friction: 0.08,
      frictionAir: 0.014,
      frictionStatic: 0.4,
      density: 0.0016,
      chamfer: { radius: 12 },
    });
    Composite.add(world, body);

    const slot: Slot = {
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
      offX: 0,
      offY: 0,
    };
    slots.push(slot);
  }

  // ---- border beams ---------------------------------------------------------
  // A faint animated border-beam on every separated content container: the
  // physics bodies plus the fixed header cluster. CSS-only; the element here is
  // a pointer-events:none overlay so it never touches layout, input, or the
  // FLIP restore. Durations and negative delays are randomised so laps don't
  // pulse in sync.
  // Beam only the pieces that were actually converted (off-screen pieces were
  // skipped above and their beams would be invisible anyway) plus the fixed
  // header cluster, which always stays on screen and functional during play.
  const beamTargets = [...slots.map((s) => s.el), ...Array.from(document.querySelectorAll<HTMLElement>("[data-play-beam]"))];
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

  // ---- containing-block compensation ----------------------------------------
  // On the CSS-transform path each piece stays in its original DOM parent, so a
  // transformed/filtered ancestor makes `position: fixed` resolve against that
  // ancestor's box rather than the viewport. We pin in viewport coordinates
  // (walls and physics live there), so we measure where each fixed element
  // actually lands and shift left/top by that offset — the piece then sits
  // pixel-exact over its layout slot. The canvas mirror re-parents pieces into
  // a viewport-anchored <canvas>, so it needs no compensation and is skipped.
  const applyPin = () => {
    if (mirror.active) return;
    for (const s of slots) {
      const prevTransform = s.el.style.transform;
      s.el.style.transform = "none";
      s.el.style.left = `${s.left}px`;
      s.el.style.top = `${s.top}px`;
      const r = s.el.getBoundingClientRect();
      s.offX = r.left - s.left;
      s.offY = r.top - s.top;
      if (s.offX || s.offY) {
        s.el.style.left = `${s.left - s.offX}px`;
        s.el.style.top = `${s.top - s.offY}px`;
      }
      s.el.style.transform = prevTransform;
    }
  };
  applyPin();

  // ---- hint -----------------------------------------------------------------
  const hint = document.createElement("div");
  hint.className = "play-hint";
  // Polite live region so a screen reader announces how to play and exit.
  hint.setAttribute("role", "status");
  const hintLine = document.createElement("div");
  hintLine.textContent = "grab anything · g toggles gravity · esc puts everything back";
  const engineLine = document.createElement("div");
  engineLine.className = "play-hint-engine";
  engineLine.textContent = `engine: ${engineText}`;
  hint.append(hintLine, engineLine);
  document.body.appendChild(hint);

  // ---- render step ----------------------------------------------------------
  const clampVelocity = (body: MatterNamespace.Body, max: number) => {
    const v = body.velocity;
    const s = Math.hypot(v.x, v.y);
    if (s > max) Body.setVelocity(body, { x: (v.x / s) * max, y: (v.y / s) * max });
  };

  const positions = new Map<HTMLElement, { x: number; y: number }>();
  const writeSlot = (s: Slot) => {
    const b = s.body;
    const target = s.grabbed ? 1 : 0;
    s.lift += (target - s.lift) * 0.18;

    const dx = b.position.x - s.width / 2 - s.left;
    const dy = b.position.y - s.height / 2 - s.top;
    const deg = (b.angle * 180) / Math.PI;

    // Velocity-based tilt for a pseudo-3D feel — cardstock's presentation,
    // verbatim (main.ts lines 245-249): stronger while lifted, ±9deg clamp.
    const tiltAmt = 0.35 + s.lift * 0.9;
    const tiltY = clamp(b.velocity.x * tiltAmt, -9, 9);
    const tiltX = clamp(-b.velocity.y * tiltAmt, -9, 9);
    const scale = 1 + s.lift * 0.045;
    const spin =
      `perspective(720px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) ` + `rotateZ(${deg.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

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
    for (const s of slots) {
      // Keep runaway bodies sane even without a grab (cardstock main.ts line
      // 240) — a hard carom or a wall bounce can never fling a piece offscreen.
      if (!s.grabbed) clampVelocity(s.body, 40);
      writeSlot(s);
    }
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
    constraint: MatterNamespace.Constraint | null;
    pointerId: number;
    startX: number;
    startY: number;
    active: boolean;
  } | null = null;
  let justDragged = false;
  // The element that was just thrown; click suppression is scoped to it so an
  // unrelated link clicked right after a throw still navigates immediately.
  let draggedEl: HTMLElement | null = null;
  let suppressTimer = 0;

  const onPointerDown = (e: PointerEvent) => {
    if (drag) return;
    if (e.button !== 0) return; // primary button only
    const el = (e.target as HTMLElement | null)?.closest(".play-body") as HTMLElement | null;
    if (!el) return;
    const slot = slots.find((s) => s.el === el);
    if (!slot) return;

    // Capture the pointer to the piece up front: a fast real drag can leave the
    // element's box between frames, and without capture the pointermove/up
    // events stop arriving mid-gesture (spring snaps, piece freezes or drops).
    // Capture does not block the click that follows a plain press, so link
    // navigation still works when the pointer never crosses the threshold.
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* capture not always allowed */
    }
    drag = {
      slot,
      constraint: null,
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
      // The spring is built only once the pointer has genuinely crossed the drag
      // threshold, so a plain click never engages it and leaves the piece exactly
      // where it sits (link fully navigable, position delta 0). Build the spring
      // HERE, at the pointer's current position, so pointB is the exact grab
      // point on the body: the piece tracks the cursor from this frame with no
      // jump, then the spring holds it so it never drifts between grab and move.
      const slot = drag.slot;
      slot.grabbed = true;
      slot.el.classList.add("play-lifted");
      // pointA is the world-space anchor the spring pulls toward — the live
      // cursor. It MUST be supplied to Constraint.create: with no bodyA, matter
      // 0.20 derives the constraint's rest length from `pointA` directly
      // (Vector.sub(pointA, pointB)), so leaving it undefined throws inside
      // create, the constraint is never built, and the spring pulls nothing.
      //
      // pointB is the grab offset in world coordinates, anchored to where the
      // pointer first went down (drag.startX/startY), NOT the current pointer.
      // The few px of travel that crossed the drag threshold are real cursor
      // motion away from the grabbed point, so seeding pointB from the down
      // position gives the spring that initial stretch and the piece tracks the
      // cursor from this frame. matter seeds the constraint's angleB to the
      // body's current angle at create time, so on the first solve pointB is
      // rotated by zero and added straight to body.position — i.e. the value we
      // pass is a world-frame offset (verified: pre-rotating it into local
      // space makes a piece grabbed at a nonzero angle swing to reorient — the
      // opposite of what we want). matter then keeps pointB attached to the
      // body as it spins from here.
      const constraint = Constraint.create({
        pointA: { x: e.clientX, y: e.clientY },
        bodyB: slot.body,
        pointB: {
          x: drag.startX - slot.body.position.x,
          y: drag.startY - slot.body.position.y,
        },
        stiffness: DRAG_STIFFNESS,
        damping: DRAG_DAMPING,
        length: 0,
      });
      drag.constraint = constraint;
      Composite.add(world, constraint);
    }
    if (drag.constraint) drag.constraint.pointA = { x: e.clientX, y: e.clientY };
    // Once engaged, stop the browser from turning the move into a scroll,
    // selection, or gesture. Not called on pointerdown, which would break the
    // click/focus a plain press still needs.
    e.preventDefault();
  };

  const endDrag = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    try {
      drag.slot.el.releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be gone */
    }
    if (drag.active) {
      if (drag.constraint) Composite.remove(world, drag.constraint);
      drag.slot.grabbed = false;
      drag.slot.el.classList.remove("play-lifted");
      // Keep the pointer-driven velocity as the throw impulse (matter carries it
      // from the spring following the cursor), just capped so a flick can't send
      // a piece across the room (cardstock main.ts line 180).
      clampVelocity(drag.slot.body, 26);
      justDragged = true;
      draggedEl = drag.slot.el;
      window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(() => {
        justDragged = false;
        draggedEl = null;
      }, 350);
    }
    drag = null;
  };

  // Swallow the click that follows a real drag, so a thrown link doesn't fire —
  // but only when the click lands on the piece that was just thrown. An
  // unrelated link clicked right after a throw must navigate immediately.
  const onClickCapture = (e: MouseEvent) => {
    if (!justDragged || !draggedEl) return;
    const target = e.target as Node | null;
    if (!target || !draggedEl.contains(target)) return;
    justDragged = false;
    draggedEl = null;
    e.preventDefault();
    e.stopPropagation();
  };

  // Safety net: if the browser revokes pointer capture mid-drag (lost capture,
  // or the window losing focus during a gesture), the pointerup/cancel that
  // would normally end the drag may never arrive — leaving `drag` set and
  // blocking every future grab. Run the endDrag cleanup so the session can
  // never strand itself. No throw impulse or click suppression: the gesture was
  // interrupted, not completed.
  const abortDrag = () => {
    if (!drag) return;
    try {
      drag.slot.el.releasePointerCapture(drag.pointerId);
    } catch {
      /* capture may already be gone */
    }
    if (drag.active) {
      if (drag.constraint) Composite.remove(world, drag.constraint);
      drag.slot.grabbed = false;
      drag.slot.el.classList.remove("play-lifted");
    }
    drag = null;
  };
  const onLostCapture = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    abortDrag();
  };
  const onBlur = () => abortDrag();

  // ---- gravity toggle -------------------------------------------------------
  // 'g' flips real gravity on/off (cardstock main.ts lines 202-216). On, every
  // piece falls and piles; off, back to the zero-g rest. gravity.scale (set on
  // the engine) shapes the fall so the feel matches cardstock. When turning on
  // we give each body a tiny downward nudge so nothing lingers weightless.
  let gravityOn = false;
  const setGravity = (on: boolean) => {
    gravityOn = on;
    engine.gravity.y = on ? 1 : 0;
    if (on)
      for (const s of slots)
        Body.applyForce(s.body, s.body.position, {
          x: 0,
          y: 0.0006 * s.body.mass,
        });
  };
  // A key event is "typing" when it targets a text input (cardstock's isTyping)
  // — and, our equivalent guard, whenever the command palette or terminal modal
  // is open (both render a role="dialog" and steal focus into an <input>).
  const isTyping = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
  };
  const modalOpen = () => !!document.querySelector('[role="dialog"]');

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      const t = document.activeElement as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      exit(true);
      return;
    }
    if (e.key.toLowerCase() === "g" && !isTyping(e) && !modalOpen()) setGravity(!gravityOn);
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
    // A resize can move the pieces' containing blocks, so re-measure the offset.
    applyPin();
    dirty = window.innerWidth !== initialW || window.innerHeight !== initialH;
  };

  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  window.addEventListener("lostpointercapture", onLostCapture);
  window.addEventListener("blur", onBlur);
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
    window.removeEventListener("lostpointercapture", onLostCapture);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("click", onClickCapture, true);
    document.removeEventListener("dragstart", onDragStart, true);
  };

  const hardRestore = () => {
    for (const { el, prev } of dragDisabled) {
      if (prev === null) el.removeAttribute("draggable");
      else el.setAttribute("draggable", prev);
    }
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
        drag.slot.el.releasePointerCapture(drag.pointerId);
      } catch {
        /* capture may already be gone */
      }
      if (drag.constraint) {
        try {
          Composite.remove(world, drag.constraint);
        } catch {
          /* already gone */
        }
      }
      drag.slot.grabbed = false;
      drag.slot.el.classList.remove("play-lifted");
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
