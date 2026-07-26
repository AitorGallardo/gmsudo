// Play mode — a faithful port of the cardstock demo's physics engine
// (../../cardstock/src/main.ts) into the home page as an opt-in easter egg. On
// activate, EVERY home row (all 19 [data-play-body] pieces, regardless of fold)
// is pinned in DOCUMENT coordinates with position:absolute inside a body-level
// overlay, and handed to a 2D physics engine (matter-js, loaded lazily by the
// caller) as a fully DYNAMIC body. The physics world spans the whole document —
// walls sit at the document's top/bottom/left/right — and NATIVE SCROLL STAYS
// ENABLED, so you can drag a piece across the entire page. The engine runs in
// zero gravity by default, so a piece spawned with zero velocity sits exactly in
// its layout slot indefinitely — the page looks completely untouched (the only
// visible change is the border-beams). But every piece is LIVE from the first
// frame: grab any piece and drag it anywhere, throw it and it caroms off the
// walls and the other pieces. Press 'g' to toggle real gravity on: everything
// falls to the document bottom and piles. On exit everything FLIPs back to its
// exact original layout slot (in document coordinates, so it works after any
// scroll) and every trace is removed, so the page is pixel-identical to before.
//
// The engine module is dynamically imported the first time play activates, so
// the normal page never pays for matter-js in its bundle.

import type MatterNamespace from "matter-js";

import { CanvasMirror } from "./canvasMirror";
import { detectHtmlInCanvas, engineLabel } from "./htmlCanvas";
import { TrailLayer, computeTrailStamps } from "./trails";

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

// Edge auto-scroll while dragging: within this many px of a viewport edge the
// page scrolls in that direction, speed ramping to the cap at the very edge.
const EDGE_ZONE = 48;
const EDGE_MAX = 14;

// Magnetic home-dock: while dragging slowly this near the home slot, a gentle
// pull toward it; release inside the zone eases the piece exactly home.
const DOCK_RADIUS = 44;
const DOCK_SLOW = 3; // px/tick spring speed under which docking engages
const DOCK_PULSE_MS = 600;

// Ghost trails: a piece moving faster than this (px/tick) smears afterimages.
const TRAIL_SPEED = 6;
const TRAIL_MAX_SUB = 4; // sub-stamps per piece per frame
const TRAIL_CAP = 8; // total stamps per frame across all pieces

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

interface Slot {
  el: HTMLElement;
  spacer: HTMLElement;
  prevStyle: string;
  beam: HTMLElement | null;
  // Home slot in DOCUMENT coordinates (top-left), captured at activation.
  left: number;
  top: number;
  width: number;
  height: number;
  body: MatterNamespace.Body;
  lift: number;
  grabbed: boolean;
  docking: boolean;
  // Previous body centre (document coords) — for per-frame trail speed.
  prevX: number;
  prevY: number;
}

// Starts a play session. `onDispose` fires once the session has fully torn down
// and the DOM is restored, so the caller can drop its reference.
export async function startPlay(onDispose: () => void): Promise<PlayHandle> {
  const Matter = (await import("matter-js")).default;
  const { Engine, Bodies, Body, Composite, Constraint } = Matter;

  const docEl = document.documentElement;
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-play-body]"));

  // Document geometry helpers. Physics lives in document space; pointers map in
  // as client + scroll. Native scroll stays enabled the whole session.
  const docWidth = () => docEl.clientWidth;
  const docHeight = () => Math.max(docEl.scrollHeight, window.innerHeight);

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

  const initialW = window.innerWidth;
  const initialH = window.innerHeight;

  // ---- document-space overlay -----------------------------------------------
  // Pieces are re-parented into this body-level overlay and positioned with
  // position:absolute in DOCUMENT coordinates. Appending to <body> (which has no
  // transform/filter) means absolute left/top resolve against the initial
  // containing block, so there is NO transformed-ancestor containing-block skew
  // to compensate for — the obsolete pin-offset dance from the fixed-position
  // era is gone. The overlay is zero-size and pointer-transparent; each piece
  // re-enables its own pointer events, so empty space still clicks through to the
  // page (header, section titles, footer stay live).
  const overlay = document.createElement("div");
  overlay.setAttribute("data-play-overlay", "");
  overlay.style.cssText = "position:absolute;top:0;left:0;width:0;height:0;z-index:30;pointer-events:none;";
  document.body.appendChild(overlay);
  const orect = overlay.getBoundingClientRect();
  const originX = orect.left + window.scrollX; // ≈ 0 (body margin:0), measured for safety
  const originY = orect.top + window.scrollY;

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

  // Walls span the whole document. Thick (t) so a hard carom or flick can't
  // tunnel a body through at high speed; the per-tick velocity clamp is the
  // second line of defence.
  let walls: MatterNamespace.Body[] = [];
  const buildWalls = () => {
    if (walls.length) Composite.remove(world, walls);
    const t = 400;
    const w = docWidth();
    const h = docHeight();
    const opts = { isStatic: true, restitution: 0.6, friction: 0.05 };
    walls = [
      Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, opts), // top
      Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, opts), // bottom
      Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, opts), // left
      Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, opts), // right
    ];
    Composite.add(world, walls);
  };
  buildWalls();

  // ---- detach each row into a physics body ----------------------------------
  // ALL pieces convert, above and below the fold — the walls sit at the document
  // bounds, not the viewport, so every piece spawns fully clear of every wall
  // (zero at-rest movement) and native scroll reaches every one of them. The
  // spacer left behind preserves layout flow; it also marks the exact restore
  // slot for teardown.
  const slots: Slot[] = [];
  for (const el of targets) {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;

    const spacer = document.createElement("div");
    spacer.setAttribute("data-play-spacer", "");
    spacer.style.height = `${rect.height}px`;
    spacer.style.marginTop = cs.marginTop;
    spacer.style.marginBottom = cs.marginBottom;
    el.parentNode?.insertBefore(spacer, el);

    const prevStyle = el.style.cssText;
    el.classList.add("play-body");
    disableNativeDrag(el);
    el.style.left = `${left - originX}px`;
    el.style.top = `${top - originY}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.setProperty("margin", "0", "important");
    overlay.appendChild(el);

    // Cardstock's piece material, verbatim (main.ts lines 62-70). Fully dynamic
    // from creation — in zero-g with zero initial velocity matter integrates
    // nothing, so it sits pixel-exact in its layout slot until a grab, a
    // collision, or gravity moves it.
    const body = Bodies.rectangle(left + rect.width / 2, top + rect.height / 2, rect.width, rect.height, {
      restitution: 0.55,
      friction: 0.08,
      frictionAir: 0.014,
      frictionStatic: 0.4,
      density: 0.0016,
      chamfer: { radius: 12 },
    });
    Composite.add(world, body);

    slots.push({
      el,
      spacer,
      prevStyle,
      beam: null,
      left,
      top,
      width: rect.width,
      height: rect.height,
      body,
      lift: 0,
      grabbed: false,
      docking: false,
      prevX: body.position.x,
      prevY: body.position.y,
    });
  }

  // ---- border beams ---------------------------------------------------------
  // A faint animated border-beam on every converted piece plus the fixed header
  // cluster. CSS-only; a pointer-events:none overlay child so it never touches
  // layout, input, or the FLIP restore. Durations/delays randomised so laps
  // don't pulse in sync.
  const beams: HTMLElement[] = [];
  const makeBeam = (el: HTMLElement): HTMLElement => {
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
    return beam;
  };
  for (const s of slots) s.beam = makeBeam(s.el);
  for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-play-beam]"))) makeBeam(el);
  // Commit the opacity:0 start state (a single reflow), then fade the beams in
  // together — reflow-triggered rather than rAF-triggered so the soft appear
  // still fires when rAF is throttled (e.g. a background tab).
  void document.body.offsetWidth;
  for (const b of beams) b.classList.add("play-beam-on");

  // Fire one soft accent pulse on a docked piece's beam as confirmation.
  const pulseBeam = (s: Slot) => {
    const b = s.beam;
    if (!b) return;
    b.classList.remove("play-beam-dock");
    void b.offsetWidth; // restart the one-shot animation
    b.classList.add("play-beam-dock");
    window.setTimeout(() => b.classList.remove("play-beam-dock"), DOCK_PULSE_MS + 40);
  };

  // ---- html-in-canvas engines (progressive enhancement) ---------------------
  // DOM + CSS transforms stay the source of truth for input and layout. When
  // Chrome's html-in-canvas API is present we (a) live-paint the physics
  // elements through a mirror canvas and (b) smear ghost trails; any failure
  // reverts silently to the CSS path. On stable Chrome (no drawElement) neither
  // enables and nothing extra runs.
  const support = detectHtmlInCanvas();
  const mirror = new CanvasMirror(support);
  mirror.tryEnable(slots.map((s) => s.el));
  const trails = new TrailLayer(support);
  trails.enable();
  let engineText = mirror.active ? engineLabel(support) : "css transforms";
  if (support.supported && !mirror.active) engineText = "css transforms (drawElement present, mirror off)";

  // ---- hint -----------------------------------------------------------------
  // Touch devices have no Esc key and no `g`, so the hint doubles as the exit
  // control there: the top line becomes a real tap target that puts everything
  // back. Pointer devices keep the original keyboard-worded, non-interactive
  // hint. Wired to `exit` further down, once it is defined.
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const hint = document.createElement("div");
  hint.className = "play-hint";
  hint.setAttribute("role", "status");
  const hintLine = document.createElement("div");
  const engineLine = document.createElement("div");
  engineLine.className = "play-hint-engine";
  engineLine.textContent = `engine: ${engineText}`;
  if (coarse) {
    hintLine.className = "play-hint-tap";
    hintLine.setAttribute("role", "button");
    hintLine.setAttribute("tabindex", "0");
    hintLine.textContent = "drag anything around · tap here to put it all back";
  } else {
    hintLine.textContent = "grab anything · g toggles gravity · esc puts everything back";
  }
  hint.append(hintLine, engineLine);
  document.body.appendChild(hint);

  // ---- render step ----------------------------------------------------------
  const clampVelocity = (body: MatterNamespace.Body, max: number) => {
    const v = body.velocity;
    const s = Math.hypot(v.x, v.y);
    if (s > max) Body.setVelocity(body, { x: (v.x / s) * max, y: (v.y / s) * max });
  };

  const positions = new Map<HTMLElement, { x: number; y: number }>();
  const writeSlot = (s: Slot, sx: number, sy: number) => {
    const b = s.body;
    const target = s.grabbed ? 1 : 0;
    s.lift += (target - s.lift) * 0.18;

    // Displacement of the body from the piece's pinned document slot.
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
      // Canvas (fixed viewport) draw handles translation in client space; the
      // element keeps only rotation/scale.
      s.el.style.transform = spin;
      positions.set(s.el, { x: s.left + dx - sx, y: s.top + dy - sy });
    } else {
      // Absolute in document space: translate off the pinned slot. The element
      // scrolls with the page natively, so no scroll term is needed here.
      s.el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) ${spin}`;
    }
  };

  // Ease a docking piece exactly home (position + zero rotation), then confirm.
  const advanceDock = (s: Slot) => {
    const b = s.body;
    const hx = s.left + s.width / 2;
    const hy = s.top + s.height / 2;
    const nx = b.position.x + (hx - b.position.x) * 0.25;
    const ny = b.position.y + (hy - b.position.y) * 0.25;
    const na = b.angle * 0.75;
    Body.setVelocity(b, { x: 0, y: 0 });
    Body.setAngularVelocity(b, 0);
    Body.setPosition(b, { x: nx, y: ny });
    Body.setAngle(b, na);
    if (Math.hypot(hx - nx, hy - ny) < 0.5 && Math.abs(na) < 0.005) {
      Body.setPosition(b, { x: hx, y: hy });
      Body.setAngle(b, 0);
      s.docking = false;
    }
  };

  // Edge auto-scroll + spring re-target while dragging. Runs inside the frame so
  // the page keeps scrolling (and the piece keeps tracking) even when the
  // pointer is held stationary at an edge.
  const dragFrame = () => {
    if (!drag || !drag.active || !drag.constraint) return;
    // Auto-scroll near the top/bottom viewport edges.
    const y = lastClientY;
    let dv = 0;
    if (y < EDGE_ZONE) dv = -EDGE_MAX * (1 - Math.max(0, y) / EDGE_ZONE);
    else if (y > window.innerHeight - EDGE_ZONE) dv = EDGE_MAX * (1 - Math.max(0, window.innerHeight - y) / EDGE_ZONE);
    if (dv) window.scrollBy(0, dv);
    // Re-target the spring in DOCUMENT coords from the last client pointer, so
    // the grabbed piece tracks correctly across an auto-scroll.
    drag.constraint.pointA = {
      x: lastClientX + window.scrollX,
      y: lastClientY + window.scrollY,
    };
    // Magnetic home-dock: a gentle pull toward the slot when moving slowly near
    // home. Only under slow+near, so it never fights an ordinary drag.
    const b = drag.slot.body;
    const spd = Math.hypot(b.velocity.x, b.velocity.y);
    if (spd < DOCK_SLOW) {
      const hx = drag.slot.left + drag.slot.width / 2;
      const hy = drag.slot.top + drag.slot.height / 2;
      const gx = hx - b.position.x;
      const gy = hy - b.position.y;
      const dist = Math.hypot(gx, gy);
      if (dist < DOCK_RADIUS && dist > 0.001) {
        Body.setVelocity(b, {
          x: b.velocity.x + gx * 0.03,
          y: b.velocity.y + gy * 0.03,
        });
      }
    }
  };

  const step = (dt: number) => {
    Engine.update(engine, Math.min(dt, 1000 / 30));
    dragFrame();
    const sx = window.scrollX;
    const sy = window.scrollY;
    if (trails.active) trails.beginFrame();
    for (const s of slots) {
      if (s.docking) advanceDock(s);
      else if (!s.grabbed) clampVelocity(s.body, 40);
      writeSlot(s, sx, sy);
      if (trails.active) {
        const b = s.body;
        const spd = Math.hypot(b.position.x - s.prevX, b.position.y - s.prevY);
        if (spd > TRAIL_SPEED) {
          const prevTL = {
            x: s.prevX - s.width / 2 - sx,
            y: s.prevY - s.height / 2 - sy,
          };
          const curTL = {
            x: b.position.x - s.width / 2 - sx,
            y: b.position.y - s.height / 2 - sy,
          };
          trails.stamp(s.el, computeTrailStamps(prevTL, curTL, TRAIL_SPEED, TRAIL_MAX_SUB), TRAIL_CAP);
        }
      }
      s.prevX = s.body.position.x;
      s.prevY = s.body.position.y;
    }
    if (mirror.active) mirror.draw(positions);
  };
  // Place everything once so there is no flash before the first frame.
  for (const s of slots) writeSlot(s, window.scrollX, window.scrollY);

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
    startX: number; // client coords at pointerdown (for the drag threshold)
    startY: number;
    active: boolean;
  } | null = null;
  let lastClientX = 0;
  let lastClientY = 0;
  let justDragged = false;
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
    // events stop arriving mid-gesture. Capture does not block the click that
    // follows a plain press, so link navigation still works.
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* capture not always allowed */
    }
    lastClientX = e.clientX;
    lastClientY = e.clientY;
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
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    if (!drag.active) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < DRAG_THRESHOLD) return;
      drag.active = true;
      // Build the spring only once the pointer has genuinely crossed the drag
      // threshold, so a plain click never engages it. pointA (world/document
      // anchor the spring pulls toward) is the live cursor in document coords;
      // pointB is the grab offset in world coords, seeded from the down point so
      // the piece tracks from this frame with no jump. (matter seeds angleB to
      // the body's current angle, so pointB is applied as a world-frame offset;
      // pre-rotating it makes a piece grabbed at an angle swing — verified.)
      const slot = drag.slot;
      slot.grabbed = true;
      slot.docking = false;
      slot.el.classList.add("play-lifted");
      const downDocX = drag.startX + window.scrollX;
      const downDocY = drag.startY + window.scrollY;
      const constraint = Constraint.create({
        pointA: {
          x: e.clientX + window.scrollX,
          y: e.clientY + window.scrollY,
        },
        bodyB: slot.body,
        pointB: {
          x: downDocX - slot.body.position.x,
          y: downDocY - slot.body.position.y,
        },
        stiffness: DRAG_STIFFNESS,
        damping: DRAG_DAMPING,
        length: 0,
      });
      drag.constraint = constraint;
      Composite.add(world, constraint);
    }
    if (drag.constraint)
      drag.constraint.pointA = {
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
      };
    // Once engaged, stop the browser from turning the move into a scroll,
    // selection, or gesture. Not called on pointerdown, which would break the
    // click/focus a plain press still needs.
    e.preventDefault();
  };

  const finishDrag = (slot: Slot) => {
    slot.grabbed = false;
    slot.el.classList.remove("play-lifted");
  };

  const endDrag = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const slot = drag.slot;
    try {
      slot.el.releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be gone */
    }
    if (drag.active) {
      if (drag.constraint) Composite.remove(world, drag.constraint);
      finishDrag(slot);
      // Magnetic dock: released slowly and near home → ease exactly home + pulse.
      const b = slot.body;
      const hx = slot.left + slot.width / 2;
      const hy = slot.top + slot.height / 2;
      const dist = Math.hypot(hx - b.position.x, hy - b.position.y);
      const spd = Math.hypot(b.velocity.x, b.velocity.y);
      if (dist < DOCK_RADIUS && spd < DOCK_SLOW) {
        slot.docking = true;
        pulseBeam(slot);
      } else {
        // Keep the pointer-driven velocity as the throw impulse, just capped so a
        // flick can't send a piece across the room (cardstock main.ts line 180).
        clampVelocity(b, 26);
      }
      justDragged = true;
      draggedEl = slot.el;
      window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(() => {
        justDragged = false;
        draggedEl = null;
      }, 350);
    }
    drag = null;
  };

  // Swallow the click that follows a real drag, so a thrown link doesn't fire —
  // but only when the click lands on the piece that was just thrown.
  const onClickCapture = (e: MouseEvent) => {
    if (!justDragged || !draggedEl) return;
    const target = e.target as Node | null;
    if (!target || !draggedEl.contains(target)) return;
    justDragged = false;
    draggedEl = null;
    e.preventDefault();
    e.stopPropagation();
  };

  // Safety net: if the browser revokes pointer capture mid-drag, the
  // pointerup/cancel may never arrive — leaving `drag` set and blocking every
  // future grab. Run cleanup so the session can never strand itself. No throw
  // impulse or click suppression: the gesture was interrupted, not completed.
  const abortDrag = () => {
    if (!drag) return;
    try {
      drag.slot.el.releasePointerCapture(drag.pointerId);
    } catch {
      /* capture may already be gone */
    }
    if (drag.active) {
      if (drag.constraint) Composite.remove(world, drag.constraint);
      finishDrag(drag.slot);
    }
    drag = null;
  };
  const onLostCapture = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    abortDrag();
  };
  const onBlur = () => abortDrag();

  // ---- gravity toggle -------------------------------------------------------
  let gravityOn = false;
  const setGravity = (on: boolean) => {
    gravityOn = on;
    engine.gravity.y = on ? 1 : 0;
    if (on)
      for (const s of slots) {
        s.docking = false;
        Body.applyForce(s.body, s.body.position, {
          x: 0,
          y: 0.0006 * s.body.mass,
        });
      }
  };
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
    trails.resize();
    const w = docWidth();
    const h = docHeight();
    // Re-clamp bodies inside the new document bounds (prefer re-clamp over a hard
    // restore). Home slots and the FLIP target are re-derived from the spacers
    // at exit, so a reflow can't strand the restore.
    for (const s of slots) {
      Body.setPosition(s.body, {
        x: clamp(s.body.position.x, 20, w - 20),
        y: clamp(s.body.position.y, 20, h - 20),
      });
    }
    // A viewport size change reflows the page, moving every home slot; the FLIP
    // animation would chase stale coords, so mark dirty → exit hard-restores
    // (which lands every piece exactly home from the live spacers regardless).
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
      // Re-home the piece exactly where the spacer holds its place, then drop the
      // spacer — the piece flows back into its original slot (correct even after
      // a scroll or resize). Scroll position is deliberately left untouched.
      s.spacer.parentNode?.insertBefore(s.el, s.spacer);
      s.spacer.remove();
    }
    for (const b of beams) b.remove();
    overlay.remove();
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
      finishDrag(drag.slot);
      drag = null;
    }
    removeListeners();

    // Return elements to the overlay before restoring; when the canvas mirror was
    // live we skip the transform animation to avoid a re-parent jump.
    const wasCanvas = mirror.active;
    mirror.disable();
    trails.disable();

    // Fade the beams out cleanly ahead of removal.
    for (const b of beams) b.classList.remove("play-beam-on");
    hint.remove();

    if (animate && !dirty && !wasCanvas) {
      // FLIP each piece home in DOCUMENT coords: translate off its pinned slot to
      // wherever its spacer currently sits (0,0 when nothing reflowed), so the
      // restore is exact from anywhere on the page — including after scrolling.
      const sx = window.scrollX;
      const sy = window.scrollY;
      for (const s of slots) {
        s.docking = false;
        const sr = s.spacer.getBoundingClientRect();
        const tx = sr.left + sx - s.left;
        const ty = sr.top + sy - s.top;
        s.el.style.transition = `transform ${EXIT_MS}ms ${EASE}`;
        s.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) perspective(720px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)`;
      }
      window.setTimeout(hardRestore, EXIT_MS + 40);
    } else {
      hardRestore();
    }
  };

  const exit = (animate = true) => teardown(animate);
  const destroy = () => teardown(false);

  // Touch exit: tapping (or activating with Enter/Space) the hint puts the page
  // back — the mobile equivalent of Esc.
  if (coarse) {
    const tapExit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      exit(true);
    };
    hintLine.addEventListener("click", tapExit);
    hintLine.addEventListener("keydown", (e) => {
      const key = (e as KeyboardEvent).key;
      if (key === "Enter" || key === " ") tapExit(e);
    });
  }

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
