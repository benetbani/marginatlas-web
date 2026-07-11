"use client";
/**
 * FormatPicker + the money-chapter subtype context , the page's CONTROL ROOM and
 * its only client island. The masterplan's signature moment for the cell page:
 * the variance-via-subtypes thesis made physical. Picking a format
 * (fast-casual / full-service / fine-dining) does not just swap three tiles , the
 * chosen subtype PROPAGATES through the whole money chapter (owner-keeps waterfall,
 * break-even headroom, cost-to-open) via FormatContext.
 *
 * It is treated as a centerpiece, not a card: a connected segmented control with a
 * sliding marker, an explicit "the numbers below update" cue, and a one-time
 * count-up on the focal figures when the format changes. Reduced-motion safe.
 * Built inline (no kit modification); reuses Box/Rail/Fig/Stat/TERRA.
 */
import * as React from "react";
import { Box, Rail, Fig, usd } from "@/components/spine/kit";
import { isReviewBuild } from "@/lib/feature_flags";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

export type Subtype = {
  slug: string; name: string; size_band: string; keeps_pct: number;
  take_home_usd: number; break_in_0_100: number; cost_to_open_usd: number;
  /* per-format covers economy (seed _identity: rev = spend x covers/day x 365;
   * take = keeps% x rev; BE covers from contribution; payback = capex / take).
   * typical_covers_per_day is the break-even DENOMINATOR, so both ends of the
   * headroom bar propagate with the picker. */
  rev_p50_usd?: number; avg_spend_usd?: number; typical_covers_per_day?: number;
  break_even_covers_per_day: number; note: string;
};

/* ---- the money-chapter subtype context ---- */
type Ctx = { sel: Subtype; subs: Subtype[]; idx: number; setIdx: (i: number) => void };
const FormatContext = React.createContext<Ctx | null>(null);
export function useFormat() {
  return React.useContext(FormatContext);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* Count/draw the focal number toward its target. The RESTING value is always the real
 * target (SSR / no-JS / reduced-motion / not-yet-in-view all show the true number , never
 * a 0). `active` gates only the ANIMATION: pass a scroll-in flag for below-fold figures so
 * they show the real number until seen, then count up; above-fold callers leave it true.
 * First reveal tweens from 85% of the target (mirrors spine-city/motion, the sanctioned
 * pattern): a mid-tween capture must sit within rounding distance of the truth, never a
 * transient 0% beside settled context. Later target switches run prev -> target. */
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
      const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setV(a + (target - a) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { from.current = target; done.current = true; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, ms, active]);
  return v;
}

/* run a callback once when the element first scrolls into view (for count-up-on-scroll) */
export function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

/* ---- the provider: wraps the whole money chapter so children can read the subtype ---- */
export function FormatProvider({ d, children }: { d: any; children: React.ReactNode }) {
  const subs: Subtype[] = d.subtypes?.items ?? [];
  const defaultIdx = Math.max(0, subs.findIndex((s) => s.slug === "full-service"));
  const [idx, setIdx] = React.useState(defaultIdx === -1 ? 0 : defaultIdx);
  const sel = subs[idx];
  if (!sel) return <>{children}</>;
  return <FormatContext.Provider value={{ sel, subs, idx, setIdx }}>{children}</FormatContext.Provider>;
}

/* ---- the visible control ---- */
export function FormatPicker({ d }: { d: any }) {
  const ctx = useFormat();
  const reduced = usePrefersReducedMotion();
  const st = d.subtypes ?? {};
  if (!ctx) return null;
  const { sel, subs, idx, setIdx } = ctx;

  const breakWord = (b: number) => (b >= 45 ? "Manageable" : b >= 30 ? "Demanding" : "Brutal");

  // count-up on the hero take-home whenever the format changes
  const take = useCountUp(sel.take_home_usd, reduced, 480);
  const cost = useCountUp(sel.cost_to_open_usd, reduced, 480);
  const keep = useCountUp(sel.keeps_pct, reduced, 420);

  return (
    <Box className="relative overflow-hidden">
      {/* faint control-room wash so the centerpiece reads warmer/heavier than ordinary cards */}
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,241,237,0.5), rgba(255,255,255,0) 40%)" }} />
      <div className="relative">
        {/* chrome is ink: the rail icon, the hint pill and the tabs carry no terracotta ,
            the ONE accent in this box is the owner-keeps figure in the trio below. */}
        <Rail icon="subtype" kicker="Pick the format you mean" />
        <p className="-mt-1 mb-4 flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--c-ink2)]">
          <span>{st.hint}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--c-ink2)]">
            <span className="fig">&#8595;</span> the money below updates
          </span>
        </p>

        {/* connected segmented control with a sliding marker */}
        <div
          role="tablist"
          aria-label="restaurant format"
          className="relative grid grid-cols-3 rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] p-1"
        >
          <span
            aria-hidden
            className="absolute inset-y-1 rounded-full border border-[var(--c-line-strong)] bg-[var(--c-card)] shadow-[0_1px_2px_rgba(43,28,22,0.10)]"
            style={{
              width: `calc((100% - 0.5rem) / ${subs.length})`,
              left: `calc(0.25rem + ${idx} * (100% - 0.5rem) / ${subs.length})`,
              transition: reduced ? "none" : "left .28s cubic-bezier(.4,0,.2,1)",
            }}
          />
          {subs.map((s, i) => {
            const active = i === idx;
            return (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setIdx(i)}
                className={`relative z-10 rounded-full px-2 py-2 text-center text-[13px] font-semibold transition-colors ${active ? "text-[var(--c-ink)]" : "text-[var(--c-ink2)] hover:text-[var(--c-ink)]"}`}
              >
                {s.name}
                <span className="mt-0.5 block text-[9.5px] font-medium uppercase tracking-wide text-[var(--c-muted)]">{s.size_band}</span>
              </button>
            );
          })}
        </div>

        {/* the focal trio , swaps + counts on the selected format. Owner-keeps is the one terracotta figure. */}
        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-[var(--c-border)]" style={{ background: "var(--c-border)" }}>
          <div className="min-w-0 break-words bg-[var(--c-card)] px-3.5 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Owner keeps</div>
            <div className="fig text-[19px] leading-none text-[var(--terra-text)] md:text-[34px]">{money(take)}</div>
            <div className="mt-1 text-[11px] text-[var(--c-muted)]"><Fig className="text-[var(--c-ink2)]">{Math.round(keep)}%</Fig> of sales</div>
          </div>
          <div className="min-w-0 break-words bg-[var(--c-card)] px-3.5 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">To break in</div>
            <div className="fig text-[19px] leading-none text-[var(--c-ink)] md:text-[26px]">{breakWord(sel.break_in_0_100)}</div>
            <div className="mt-1 text-[11px] text-[var(--c-muted)]"><Fig className="text-[var(--c-ink2)]">{Math.round(sel.break_in_0_100 / 10)}/10</Fig> ease</div>
          </div>
          <div className="min-w-0 break-words bg-[var(--c-card)] px-3.5 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Cost to open</div>
            <div className="fig text-[19px] leading-none text-[var(--c-ink)] md:text-[26px]">{money(cost)}</div>
            <div className="mt-1 text-[11px] text-[var(--c-muted)]">doors-open spend</div>
          </div>
        </div>

        <p className="mt-3 text-[12px] leading-snug text-[var(--c-ink2)]">{sel.note}</p>

        {/* Pro seam , free lets you pick ONE format; Pro shows all three side by side.
            The real matrix stays in the DOM (crawlable); review builds render it plain
            (rulebook v1 section 45), production veils it behind a calm blur.
            Rendered as ONE deliberate full-width panel (header + preview + inline CTA bar),
            never a small card center-floated over ghost rows. */}
        <div className="mt-4 border-t border-[var(--c-border)] pt-4">
          <ComparePro subs={subs} />
        </div>
      </div>
    </Box>
  );
}

/* inline lock glyph (no padlock in the AtlasIcon set) , sized for the panel header + CTA.
 * Ink by default: the seam is chrome, and the box's one terracotta stays on the trio figure. */
function LockGlyph({ size = 16, color = "var(--c-ink2)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label="locked" style={{ color }}>
      <rect x={5} y={10.5} width={14} height={9.5} rx={2} stroke="currentColor" strokeWidth={1.8} />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={12} cy={15} r={1.4} fill="currentColor" />
    </svg>
  );
}

/* ComparePro , the free/Pro seam as ONE deliberate full-width panel. A composed
 * header states the value, the real matrix sits below it, and the CTA is a quiet
 * INK pill (Final Ascent: the seam never outguns the data , the old full-width
 * dark-terracotta bar was the largest colored element on the page). The header's
 * small lock tile is the panel's one quiet Pro cue. Rulebook v1 section 45
 * (founder G8, 2026-07-11): review builds render the matrix PLAIN , nothing
 * veiled or fogged in a founder review copy; the blur + white gradient apply
 * only in production, where the seam is live. */
function ComparePro({ subs }: { subs: Subtype[] }) {
  const unveiled = isReviewBuild();
  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--c-border)]" style={{ background: "var(--c-card)" }}>
      {/* header: states what Pro adds, fully inside the panel , ink chrome (the seam
          never carries the accent; the owner-keeps trio figure is the box's terracotta) */}
      <div className="flex items-center gap-2.5 border-b border-[var(--c-border)] px-4 py-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)]"><LockGlyph size={16} /></span>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[var(--c-ink)]">Compare all three formats side by side</div>
          <div className="text-[11.5px] leading-snug text-[var(--c-ink2)]">Fast casual, full service and fine dining, with the full cost stack for each.</div>
        </div>
      </div>
      {/* the real matrix. Review builds get it plain (G8); production keeps the
          calm blur + veil so the seam reads as a real preview, never a broken
          half-loaded skeleton. */}
      <div className="relative px-4 py-3.5">
        {unveiled ? (
          <ProCompare subs={subs} />
        ) : (
          <>
            <div aria-hidden className="pointer-events-none select-none" style={{ filter: "blur(4px)", opacity: 0.55 }}>
              <ProCompare subs={subs} />
            </div>
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.55))" }} />
          </>
        )}
      </div>
      {/* CTA row , a quiet ink pill, right-aligned; chrome stays ink */}
      <div className="flex items-center justify-end border-t border-[var(--c-border)] px-4 py-3">
        <button type="button" className="inline-flex items-center gap-1.5 rounded-full bg-[var(--c-ink)] px-5 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[var(--terra-text)]">
          <LockGlyph size={13} color="#fff" /> Compare with Pro
        </button>
      </div>
    </div>
  );
}

/* the all-formats matrix (kept in the DOM; plain in review builds, veiled in production) */
function ProCompare({ subs }: { subs: Subtype[] }) {
  const rows: Array<[string, (s: Subtype) => string]> = [
    ["Owner keeps", (s) => money(s.take_home_usd)],
    ["Keep %", (s) => `${s.keeps_pct}%`],
    ["Cost to open", (s) => money(s.cost_to_open_usd)],
    ["Break-even covers", (s) => `${s.break_even_covers_per_day}/day`],
  ];
  const cols = `minmax(0,1.1fr) repeat(${subs.length},minmax(0,1fr))`;
  return (
    <div>
      <div className="grid items-end gap-2 border-b border-[var(--c-border)] pb-1.5" style={{ gridTemplateColumns: cols }}>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Metric</span>
        {subs.map((s) => <span key={s.slug} className="text-right text-[11px] font-semibold text-[var(--c-ink)]">{s.name}</span>)}
      </div>
      <div className="divide-y divide-[var(--c-border)]">
        {rows.map(([label, get]) => (
          <div key={label} className="grid items-center gap-2 py-1.5" style={{ gridTemplateColumns: cols }}>
            <span className="text-[11px] text-[var(--c-ink2)]">{label}</span>
            {subs.map((s) => <Fig key={s.slug} className="text-right text-[12px] text-[var(--c-ink)]">{get(s)}</Fig>)}
          </div>
        ))}
      </div>
    </div>
  );
}
