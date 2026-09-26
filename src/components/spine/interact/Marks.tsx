"use client";

/**
 * Marks, A DRAWING'S PARTS ANSWER THE READER (goal 2026-09-26, mechanisms M1 and M2 of
 * E:/atlas/design/loop/build/goal-2026-09-26/PLAN.md).
 *
 * M1, THE READOUT. A mark that carries `data-readout-figure` (and `data-readout-words`) shows them in a two-line panel when the
 * pointer is over it, when the keyboard reaches it, or when a finger taps it. The panel is the gloss's (ink, the card's white
 * text), and it can only say what the server already wrote into the mark: a reading that is not the mark's own data cannot reach
 * it. A screen reader keeps the drawing's own label; the panel is also a polite live region, so the keyboard's walk is announced.
 *
 * M2, THE LINKED PARTS. Every element carrying `data-part-key` (a bar's band, a ring's wedge, a legend's entry, a list's row) is one
 * part of one whole. While a part is active every element of another part takes `data-dim` and fades to a third (his donut of
 * 2026-07-05: "hover highlights the segment"). No colour changes and nothing decorates a card or a row (his 2026-07-11 ruling on
 * hover highlights): the active part is simply the one left at full strength.
 *
 * ONE TAB STOP A DRAWING. The wrapper takes the focus; the arrow keys walk the readable marks in the page's order, Home and End
 * jump to the ends, Escape closes the panel. A tap opens a mark and a second tap on it, or a tap anywhere else, closes it. A mouse
 * leaving the drawing closes it.
 *
 * PROGRESSIVE. The server draws every mark and writes every reading into the marks' attributes; this component only listens. With
 * no script the drawing is whole and its label still reads every value.
 */
import * as React from "react";

type Active = { key: HTMLElement; figure: string; words: string; left: number; top: number; bottom: number; part: string | null };

/* The layout effect measures the panel before paint in a browser and is a plain effect on the server, which has nothing to measure. */
const useBrowserLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const MARK = "[data-readout-figure], [data-part-key]";
const READABLE = "[data-readout-figure]";
const GAP = 8;

/** The wrapper may BE the drawing's own root: its data attributes (`data-archetype`, `data-visual` and the rest) pass through, so
 *  the harness and the gates read the drawing exactly where they did. */
export function Marks({ label, children, className = "", ...rest }: { label: string; children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const root = React.useRef<HTMLDivElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<Active | null>(null);
  const [place, setPlace] = React.useState<{ shift: number; below: boolean }>({ shift: 0, below: false });

  const visible = (sel: string) => (root.current ? [...root.current.querySelectorAll<HTMLElement>(sel)].filter((el) => el.getClientRects().length > 0) : []);
  /* The keyboard walks the marks that carry a reading; a drawing whose parts carry none walks its parts. */
  const walk = () => { const r = visible(READABLE); return r.length ? r : visible("[data-part-key]"); };

  const show = React.useCallback((el: HTMLElement | null) => {
    const r = root.current;
    if (!r || !el) { setActive(null); return; }
    const rb = r.getBoundingClientRect(), eb = el.getBoundingClientRect();
    setActive({
      key: el,
      figure: el.getAttribute("data-readout-figure") ?? "",
      words: el.getAttribute("data-readout-words") ?? "",
      left: eb.left - rb.left + eb.width / 2,
      top: eb.top - rb.top,
      bottom: eb.bottom - rb.top,
      part: el.getAttribute("data-part-key"),
    });
  }, []);

  /* M2: every other part dims while one is active. */
  React.useEffect(() => {
    const r = root.current;
    if (!r) return;
    const part = active?.part ?? null;
    for (const el of r.querySelectorAll<HTMLElement>("[data-part-key]")) {
      if (part && el.getAttribute("data-part-key") !== part) el.setAttribute("data-dim", "");
      else el.removeAttribute("data-dim");
    }
  }, [active]);

  /* The panel stands above its mark, or below it when the drawing's top leaves no room, and inside the drawing's width. */
  useBrowserLayoutEffect(() => {
    const r = root.current, p = panel.current;
    if (!r || !p || !active) return;
    const half = p.offsetWidth / 2, w = r.clientWidth;
    const shift = active.left < half ? half - active.left : active.left > w - half ? w - half - active.left : 0;
    const below = active.top < p.offsetHeight + GAP;
    setPlace({ shift, below });
  }, [active]);

  /* A tap or a click anywhere outside the drawing closes the panel. */
  React.useEffect(() => {
    if (!active) return;
    const off = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setActive(null); };
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [active]);

  const markOf = (e: React.SyntheticEvent) => {
    const el = (e.target as Element).closest?.(MARK) as HTMLElement | null;
    return el && root.current?.contains(el) ? el : null;
  };

  const open = active && (active.figure || active.words);
  return (
    <div
      {...rest}
      ref={root}
      role="group"
      aria-roledescription="chart"
      aria-label={label}
      tabIndex={0}
      data-interactive="marks"
      className={`relative rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)] focus-visible:ring-offset-4 ${className}`}
      style={{ ...rest.style, position: "relative" }}
      onPointerOver={(e) => { if (e.pointerType === "mouse") { const el = markOf(e); if (el) show(el); } }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setActive(null); }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") return;
        const el = markOf(e);
        if (!el || active?.key === el) setActive(null);
        else show(el);
      }}
      onFocus={(e) => { if (e.target === root.current && !active) { const list = walk(); if (list.length) show(list[0]); } }}
      onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) setActive(null); }}
      onKeyDown={(e) => {
        if (e.key === "Escape") { setActive(null); return; }
        const list = walk();
        if (!list.length) return;
        const i = active ? list.indexOf(active.key) : -1;
        const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % list.length
          : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + list.length) % list.length
          : e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : -1;
        if (next >= 0) { e.preventDefault(); show(list[next]); }
      }}
    >
      {children}
      {/* The panel: an overlay (the page laws exempt it from TEXT OVERLAP), a polite live region, empty until a mark is active. */}
      <div
        ref={panel}
        role="status"
        aria-live="polite"
        data-overlay=""
        data-readout-panel=""
        className="max-w-[28ch] rounded-[8px] bg-[var(--c-ink)] px-3 py-2 text-left leading-snug text-[var(--c-card)] shadow-md"
        /* Position and the closed state inline, so the panel behaves wherever the component renders, stylesheet or none. */
        style={open
          ? { position: "absolute", zIndex: 20, pointerEvents: "none", left: active!.left + place.shift, top: place.below ? active!.bottom + GAP : active!.top - GAP, transform: place.below ? "translateX(-50%)" : "translate(-50%, -100%)" }
          : { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0 }}
      >
        {open ? (
          <>
            {active!.figure ? <span data-readout-figure-text="" className="fig block text-[length:var(--t-body)] font-semibold">{active!.figure}</span> : null}
            {active!.words ? <span className="block text-[length:var(--t-micro)] opacity-80">{active!.words}</span> : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
