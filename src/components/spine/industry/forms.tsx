"use client";
/**
 * Industry-page-local chart FORMS , the shapes the shared kit does not carry, built
 * here so the kit stays untouched. Each is count-up / draw-on-scroll safe: figures
 * REST at their real value on SSR / no-JS / reduced-motion / not-yet-in-view, and
 * only the animation is gated by an in-view flag (the reference useCountUp contract).
 *
 * Forms defined here:
 *  - MarginLadder    , three descending stepped bars (gross -> operating -> net) so the
 *                       eye SEES 64 collapse to 7. Replaces three equal inline figures.
 *  - SurvivalCurve   , a stepped decay curve from 100% at open to the yr1/3/5 reads on a
 *                       ZERO baseline. Replaces three floored bars (honesty fix + new form).
 *  - SeasonRibbon    , a single straight area+line across Jan-Dec on a ZERO baseline. Replaces
 *                       twelve floored categorical bars (honesty fix + new form).
 *  - RangeBracket    , a labelled [lo | mid | hi] bracket for a single point-in-range
 *                       (payback). A distinct idiom from the benchmark's dot scale.
 *
 * Terracotta discipline: exactly one terracotta mark per form (the kept slice / the
 * marker / the peak node). All prose arrives from the seed via props.
 */
import * as React from "react";
import { Fig, TERRA } from "@/components/spine/kit";

/* subtype adapter (SubtypeRow + deriveSubtypes) moved to ./subtypes , a server-safe
 * module so the server page can call it without crossing the client boundary. */

/* ==== shared reduced-motion + in-view + count-up (mirrors spine-cell/format-picker) ==== */
function useReduced() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return r;
}
function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}
/* draw progress , P5 LAW: shapes REST fully drawn, ALWAYS. The old draw-on-scroll
 * collapsed the shape to 0 after hydration until the card scrolled in, so captures,
 * crawlers and fast scrolls saw gridlines with NO curve (and a clipped end-label).
 * p is now 1 unconditionally for every consumer (SurvivalCurve, SeasonRibbon,
 * MarginLadder); the signature stays so the call sites keep their (in-view,
 * reduced-motion) seam if a compliant above-fold-only reveal ever returns. */
function useDraw(_active: boolean, _reduced: boolean, _ms = 620) {
  return 1;
}
/* Count-up CONTRACT (mirrors spine-city/motion, the sanctioned pattern): the state
 * INITIALISES at the target, so SSR / no-JS / reduced-motion / not-yet-seen all REST
 * at the true value. `active` gates only the ANIMATION (pass the in-view flag); the
 * first reveal tweens from 85% of the target (NEVER 0 , a mid-tween capture must sit
 * within rounding distance of the truth), later switches run prev -> target. */
export function useCountUp(target: number, reduced: boolean, ms = 520, active = true) {
  const [v, setV] = React.useState(target);
  const from = React.useRef(0);
  const done = React.useRef(false);
  React.useEffect(() => {
    if (reduced || !active) { setV(target); from.current = target; return; }
    const start = performance.now();
    const a = done.current ? from.current : target * 0.85; // first reveal: 85% -> target; later switches: prev -> target
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      setV(a + (target - a) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { setV(target); from.current = target; done.current = true; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, ms, active]);
  return v;
}

/* CountFig , a focal .fig that counts up the first time it scrolls into view. Rests at real value. */
export function CountFig({ value, prefix = "", suffix = "", decimals = 0, className }: { value: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const reduced = useReduced();
  const { ref, seen } = useInView<HTMLSpanElement>();
  const v = useCountUp(value, reduced, 520, seen);
  return <span ref={ref} className={`fig ${className ?? ""}`}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

/* ============================================================================
 * MARGIN LADDER , gross -> operating -> net as three DESCENDING stepped bars on a
 * shared 0-100 vertical scale, so the collapse from 64 to 7 is seen, not just read.
 * Only the net (kept) bar is terracotta. Bars grow up from a zero baseline on scroll-in.
 * ========================================================================== */
export function MarginLadder({ gross, operating, net }: { gross: number; operating: number; net: number }) {
  const reduced = useReduced();
  const { ref, seen } = useInView<HTMLDivElement>();
  const p = useDraw(seen, reduced);
  const steps: Array<[string, number, boolean]> = [["Gross", gross, false], ["Operating", operating, false], ["Net / kept", net, true]];
  return (
    <div ref={ref}>
      <div className="flex items-end justify-between gap-3" style={{ height: 118 }} role="img" aria-label={`Gross ${gross}%, operating ${operating}%, net ${net}%`}>
        {steps.map(([label, val, kept]) => (
          <div key={label} className="flex flex-1 flex-col items-center justify-end gap-1.5" style={{ height: "100%" }}>
            {/* the kept BAR stays terracotta; its numeral reads ink so the $7 masthead
                focal is the band's only terra figure */}
            <Fig className="text-[15px] leading-none text-[var(--c-ink)]">{Math.round(val * p)}%</Fig>
            <div className="w-full max-w-[64px] rounded-t" style={{ height: `${val * p}%`, background: kept ? TERRA : "#cfcac6", transition: reduced ? "none" : undefined }} />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * SURVIVAL CURVE , a stepped decay from 100% at open to yr1/yr3/yr5, ZERO baseline,
 * area faintly filled. The line draws left-to-right on scroll-in. One terracotta end-dot.
 * curve = [{yr,pct}...] starting at yr 0 / 100%.
 * ========================================================================== */
export function SurvivalCurve({ curve, note }: { curve: Array<{ yr: number; pct: number }>; note?: string }) {
  const reduced = useReduced();
  const { ref, seen } = useInView<HTMLDivElement>();
  const p = useDraw(seen, reduced, 680);
  if (!curve.length) return null;
  /* THE DRAWING STRETCHES. THE WORDS DO NOT.
     This was one fixed 320-unit picture given the card's full width with no
     height of its own, so it scaled UNIFORMLY to whatever it landed in and took
     its text with it. The axis marks are set at eight and a half units: in a
     half-band they render near ten pixels, on a phone card near six. The same
     labels, three sizes apart, for no reason a reader could name.
     Same treatment as the survival curve on the trade-in-a-place page: the SVG
     holds the PATHS ONLY and stretches freely, every readable thing is real text
     laid over it, and the line keeps a true thickness while the box stretches.
     The horizontal scale is the only one that moves, so a percentage puts a mark
     exactly on its path point, and the height comes from the same constant the
     viewBox uses so the two cannot drift apart. */
  const W = 320, H = 150, padL = 30, padR = 14, padT = 22, padB = 24;
  const maxYr = Math.max(...curve.map((c) => c.yr)) || 1;
  const X = (yr: number) => padL + (yr / maxYr) * (W - padL - padR);
  const Y = (pct: number) => padT + (1 - pct / 100) * (H - padT - padB); // zero baseline
  const leftPct = (yr: number) => (X(yr) / W) * 100;
  const pts = curve.map((c) => [X(c.yr), Y(c.pct)] as const);
  const line = "M " + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ");
  const area = `M ${pts[0][0].toFixed(1)},${(H - padB).toFixed(1)} L ` + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ") + ` L ${pts[pts.length - 1][0].toFixed(1)},${(H - padB).toFixed(1)} Z`;
  /* THE LINE STOPPED SHORT OF ITS LAST POINT, and looked at three times size that
     is exactly what it did: the stroke ended just past year three with a rounded
     cap while the area fill and the 38% dot carried on to year five.

     A dash length was computed by summing the segments IN VIEWBOX UNITS and handed
     to a stroke drawn with non-scaling-stroke, which measures its dashes in SCREEN
     units. The box stretches horizontally and not vertically, so the rendered path
     is about half as long again as the sum that was measured, and the dash covered
     two thirds of it. Wider card, shorter line. It was a reveal animation that no
     longer animates: the draw fraction has been pinned at 1 for months so crawlers
     and fast scrolls could not catch a curve mid-draw. What was left was a dash
     that only ever truncated. */
  const lastVisibleIdx = Math.max(0, Math.min(curve.length - 1, Math.round(p * (curve.length - 1))));
  /* the end reading anchors inward so it cannot hang off the right-hand edge,
     the same rule three other charts on this site now use */
  const endYr = curve[lastVisibleIdx].yr;
  const endAnchor = leftPct(endYr) > 86 ? "translateX(-100%)" : "translateX(-50%)";
  return (
    <div ref={ref}>
      <div
        className="relative w-full"
        style={{ height: H }}
        role="img"
        aria-label={curve.map((c) => `year ${c.yr}: ${c.pct}% open`).join(", ")}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {/* ONE AXIS AND ONE REFERENCE, NOT A GRID (G2, G3). This drew a rule at
              0, 50 and 100. The 0 line is the axis and the 100 line is the
              reference the curve falls away from , every trade opens with all of
              its operators still trading, and the gap between that line and the
              curve IS the finding. The 50 line was neither: a gridline, which the
              conventions ban outright, earning its keep only by helping a reader
              guess a value its own label already states. The label stays and the
              rule goes, which is what "no gridlines" means. */}
          {[0, 100].map((g) => (
            <line
              key={g}
              x1={padL}
              y1={Y(g)}
              x2={W - padR}
              y2={Y(g)}
              stroke={g === 0 ? "var(--c-line-strong)" : "var(--c-soft2)"}
              strokeWidth={g === 0 ? 1.4 : 1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={area} fill={TERRA} opacity={0.1 * p} />
          <path d={line} fill="none" stroke={TERRA} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* TABULAR, BECAUSE THESE THREE STACK. F1 asks a figure that stacks with
            other figures to carry tabular numerals, and its own note says the check
            cannot tell a stacking figure from a standalone one, so a scale's two
            END labels get counted and are not really a fault. That exemption was
            being claimed for these, and they are not ends: 0%, 50% and 100% sit in
            one column at the same left edge, three deep, which is the exact case
            the rule exists for. Measured before believing the note. */}
        {[0, 50, 100].map((g) => (
          <span
            key={g}
            aria-hidden
            className="fig absolute w-6 text-right text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]"
            style={{ left: 0, top: `${Y(g) - 5}px` }}
          >
            {g}%
          </span>
        ))}
        {curve.map((c, i) => {
          const shown = i <= lastVisibleIdx || reduced;
          const isLast = c.yr === maxYr;
          if (!shown) return null;
          return (
            <React.Fragment key={c.yr}>
              <span
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${leftPct(c.yr)}%`,
                  top: `${Y(c.pct)}px`,
                  width: isLast ? 8 : 6,
                  height: isLast ? 8 : 6,
                  background: isLast ? TERRA : "#fff",
                  border: `1.6px solid ${isLast ? "#fff" : "var(--c-ink)"}`,
                }}
              />
              <span
                aria-hidden
                className="absolute -translate-x-1/2 whitespace-nowrap text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]"
                style={{ left: `${leftPct(c.yr)}%`, top: `${H - 12}px` }}
              >
                {c.yr === 0 ? "open" : `yr ${c.yr}`}
              </span>
            </React.Fragment>
          );
        })}
        <span
          aria-hidden
          className="absolute whitespace-nowrap text-[length:var(--t-micro)] font-semibold leading-none text-[var(--terra-text)]"
          style={{ left: `${leftPct(endYr)}%`, top: `${Y(curve[lastVisibleIdx].pct) - 18}px`, transform: endAnchor }}
        >
          {curve[lastVisibleIdx].pct}%
        </span>
      </div>
      {note ? <div className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{note}</div> : null}
    </div>
  );
}

/* ============================================================================
 * SEASON RIBBON , one STRAIGHT terracotta area+line across the twelve months on a
 * ZERO baseline (a shape-over-time read, not twelve magnitudes). Straight polyline,
 * never smoothed (rule 27); peak + trough nodes marked from the DATA in INK, so no
 * month wears the terracotta accent (rule 37). No glued caption (rule 26). Draws on scroll-in.
 * ========================================================================== */
const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
export function SeasonRibbon({ months }: { months: number[] }) {
  const reduced = useReduced();
  const { ref, seen } = useInView<HTMLDivElement>();
  const p = useDraw(seen, reduced, 700);
  if (months.length < 2) return null;
  const W = 640, H = 150, padL = 8, padR = 8, padT = 22, padB = 22;
  const maxV = Math.max(...months);
  const peak = months.indexOf(maxV);
  const trough = months.indexOf(Math.min(...months)); // derived, not hardcoded
  const X = (i: number) => padL + (i / (months.length - 1)) * (W - padL - padR);
  const Y = (v: number) => padT + (1 - v / maxV) * (H - padT - padB); // ZERO baseline (0..max)
  const pts = months.map((v, i) => [X(i), Y(v)] as const);
  // straight polyline through the twelve real monthly points (S11: no invented curvature between months)
  const path = "M " + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ");
  const area = `${path} L ${X(months.length - 1).toFixed(1)},${(H - padB).toFixed(1)} L ${X(0).toFixed(1)},${(H - padB).toFixed(1)} Z`;
  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="monthly demand across the year, zero baseline" preserveAspectRatio="none">
        {/* reveal via a growing clip from the left */}
        <defs><clipPath id="ribbon-clip"><rect x={0} y={0} width={reduced ? W : W * p} height={H} /></clipPath></defs>
        <line x1={0} y1={H - padB} x2={W} y2={H - padB} stroke="#d8d0cb" strokeWidth={1.2} />
        <g clipPath="url(#ribbon-clip)">
          <path d={area} fill={TERRA} opacity={0.12} />
          <path d={path} fill="none" stroke={TERRA} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="miter" />
        </g>
        {/* peak node , INK, a data-derived marker only. No month wears the terracotta
            accent (rule 37: a month can never be featured); the ribbon's SHAPE is the read */}
        <circle cx={X(peak)} cy={Y(months[peak])} r={4} fill="#1b1b1a" stroke="#fff" strokeWidth={1.6} />
        {/* trough node (ink, derived, hollow to distinguish it from the filled peak) */}
        <circle cx={X(trough)} cy={Y(months[trough])} r={3} fill="#fff" stroke="#1b1b1a" strokeWidth={1.6} />
        {/* month letters: peak + trough marked in INK only (no accent on any month) */}
        {MONTH_LABELS.map((m, i) => (
          <text key={i} x={X(i)} y={H - 6} textAnchor="middle" fill={i === trough || i === peak ? "#565654" : "#9a938e"} fontSize={9} fontWeight={i === trough || i === peak ? 600 : 400}>{m}</text>
        ))}
        <text x={X(peak)} y={Y(months[peak]) - 9} textAnchor="middle" fill="#565654" fontSize={9.5} fontWeight={600}>peak</text>
        <text x={X(trough)} y={Y(months[trough]) - 9} textAnchor="middle" fill="#6f6f6d" fontSize={9.5} fontWeight={600}>low</text>
      </svg>
    </div>
  );
}

/* ============================================================================
 * RANGE BRACKET , a labelled [ lo | mid | hi ] window for a single
 * point-in-range read (payback months). A capped end-tick bracket, NOT a dot on a
 * gradient track, so it stays distinct from the benchmark's dot scale. Neutral ink by
 * default (per the kit convention); `accent` opts the mid marker into terracotta. The
 * payback card puts its ONE terra accent on the "34" figure, so this stays neutral.
 * ========================================================================== */
export function RangeBracket({ lo, hi, mid, unit, midLabel, accent = false }: { lo: number; hi: number; mid: number; unit: string; midLabel?: string; accent?: boolean }) {
  const span = Math.max(1, hi - lo);
  const pos = Math.max(6, Math.min(94, ((mid - lo) / span) * 100));
  return (
    <div className="pt-4">
      <div className="relative h-6" role="img" aria-label={`${mid} ${unit}, range ${lo} to ${hi}`}>
        {/* bracket rail with end caps */}
        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: "#cfc8c3" }} />
        <div className="absolute top-1/2 left-0 h-3 w-px -translate-y-1/2" style={{ background: "#9a938e" }} />
        <div className="absolute top-1/2 right-0 h-3 w-px -translate-y-1/2" style={{ background: "#9a938e" }} />
        {/* mid marker: a slim stem + label above (terra only when accent) */}
        <div className="absolute -top-3.5 -translate-x-1/2" style={{ left: `${pos}%` }}>
          <span className="fig block whitespace-nowrap text-center text-[11px] font-semibold" style={{ color: accent ? "var(--terra-text)" : "var(--c-ink)" }}>{midLabel ?? `${mid} ${unit}`}</span>
        </div>
        <div className="absolute top-1/2 h-3.5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${pos}%`, background: accent ? TERRA : "#1a1a1a" }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-[var(--c-muted)]"><span>{lo} {unit}</span><span>{hi} {unit}</span></div>
    </div>
  );
}
