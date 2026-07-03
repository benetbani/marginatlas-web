/**
 * NeighborhoodExplorer , the neighborhood-hub island (Leg 2 of the spine program),
 * refit to the Final Ascent Visual Dictionary. The signature object is a REAL CARTO
 * tile map (SpineMap, shared) for orientation, paired with a DIVERGENCE keep-strip
 * centered on the city baseline of 100 (the honest re-rank, read as deviation) and a
 * DISCIPLINED detail panel that opens to one decision and keeps its proof behind
 * single-open disclosures (the multiplier waterfall opens first: the proof of the
 * hero figure, not the paywall). The map column earns its pixels: tighter fit
 * padding + the selected district's trades / prime streets / who-is-here card fills
 * the space under the sticky map. Terracotta = the answer only (the #1 keeper, the
 * above-city pin side, the net keep figure); selection and CTAs are neutral ink.
 * All prose lives in the seed. Count-up-safe motion, reduced-motion safe.
 *
 * As-built chart dictionary (perceptual idiom census for this island, cap 2 each):
 *   divergence bar-list (deviation from 100): KeepStrip x1  , the page hero.
 *   real tile map (position + keep-encoded pins): SpineMap x1  , dot size = keep
 *     index, terracotta = above the city-100 baseline, ink = below (legended).
 *   multiplicative waterfall (running product): "Why the number moves" x1  , the
 *     raw->clipped line renders ONLY when the clip actually binds.
 *   marker-on-a-shared-scale: footfall two-marker x1 + walkability Meter x1 (cap 2);
 *     price tier is a DISCRETE 4-step band (a category, never a false-precise dot).
 *   editorial table with drawn in-cell scales (CellScaleBar): Compare x1  , keep row
 *     ticked at city 100, revenue row ticked at 0%, no hidden truncated baselines.
 *   rank slope (2-point): MythChapter x1  , revenue rank -> keep rank, 9 lines.
 */
"use client";
import * as React from "react";
import { Ico, Fig, Meter, Chip, Rail, Expand, TERRA } from "@/components/spine/kit";
import { LockVeil, LockPill, CellScaleBar } from "@/components/spine/kit-index";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";
import { keepIndex } from "./keep";

type District = {
  name: string; slug: string; character: string; tags?: string[];
  commuter_mult: number; tourism_mult: number; tag_mult: number; rent_mult: number;
  rev_vs_city_pct: number; walkability: string; price_tier: string; headline_trade: string;
  xy?: { x: number; y: number }; lat?: number; lng?: number; walk_score?: number; cell_count?: number; blurb?: string;
  verdict?: string; counterweight_above?: string; counterweight_below?: string;
  best_trades?: Array<{ name: string; why: string }>;
  prime_streets?: string[]; demographics?: string[];
  footfall?: { weekday: number; weekend: number };
  locals_know?: string[];
};
type Myth = { claim?: string; reality?: string; stat_label?: string; tell?: string };
type Rail2 = { kicker?: string; verdict?: string };

const walkWord: Record<string, number> = { low: 30, moderate: 58, high: 90 };
const footVal = (d: District) => d.footfall ?? { weekday: 50, weekend: 50 };
const walkVal = (d: District) => d.walk_score ?? walkWord[d.walkability] ?? 50;

/* ---- count-up-safe motion (mirrors the cell page format-picker pattern) ---- */
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
/* count toward target; RESTS at the real value (SSR / no-JS / reduced-motion / pre-view
 * all show the true number). `active` gates only the animation. */
function useCountUp(target: number, reduced: boolean, ms = 520, active = true) {
  const [v, setV] = React.useState(target);
  const from = React.useRef(0);
  const done = React.useRef(false);
  React.useEffect(() => {
    if (reduced || !active) { setV(target); from.current = target; return; }
    const start = performance.now();
    const a = done.current ? from.current : 0;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      setV(a + (target - a) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { from.current = target; done.current = true; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, ms, active]);
  return v;
}
function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

/* island-scoped hover language: a terracotta top-edge + faint lift on interactive
 * sub-blocks (panel accordions, map card, compare rows), reduced-motion safe. */
function NeStyles() {
  return (
    <style>{`.spine-scope .netop{position:relative;transition:transform .15s ease-out,border-color .15s ease-out}
.spine-scope .netop::before{content:"";position:absolute;left:12px;right:12px;top:0;height:2px;border-radius:9999px;background:${TERRA};opacity:0;transition:opacity .15s ease-out}
.spine-scope .netop:hover::before{opacity:1}
.spine-scope .nerow{transition:background-color .15s ease-out,transform .15s ease-out}
.spine-scope .nerow:hover{background:var(--c-soft);transform:translateY(-1px)}
@media (prefers-reduced-motion:reduce){.spine-scope .netop,.spine-scope .nerow{transition:none}.spine-scope .nerow:hover{transform:none}}`}</style>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{children}</div>;
}

/* ============================================================================
 * KEEP STRIP , the page hero. A DIVERGENCE bar-list centered on the city baseline
 * of 100: above-city grows RIGHT in terracotta, below-city grows LEFT in grey, so
 * the honest "who slid below the city" story reads in one glance. The 100 line is a
 * bold labeled gridline (the single most important reference on the page). Length
 * encodes deviation from 100 (Cleveland-McGill: position + length). Selection is a
 * neutral INK ring + bold name, never terracotta: the accent is fixed to the #1
 * keeper (the above-city answer) regardless of what the reader picks.
 * ========================================================================== */
function KeepStrip({ districts, selected, onSelect, reduced }: { districts: District[]; selected: string; onSelect: (s: string) => void; reduced: boolean }) {
  const rows = React.useMemo(
    () => districts.map((d) => ({ d, keep: keepIndex(d) })).sort((a, b) => b.keep - a.keep),
    [districts]
  );
  // symmetric deviation span so the 100 line is visually centered.
  const maxDev = Math.max(20, ...rows.map((r) => Math.abs(r.keep - 100)));
  const { ref, seen } = useInView<HTMLDivElement>();
  // mounted gate: SSR / no-JS render the bars at their REAL width (never empty);
  // only after hydration do we collapse-then-grow on scroll-in.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const aboveCount = rows.filter((r) => r.keep >= 100).length;
  const belowCount = rows.length - aboveCount;

  return (
    <div ref={ref} className="rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3.5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -12px rgba(43,28,22,0.10)" }}>
      <div className="mb-1 flex items-end justify-between gap-3">
        <SectionLabel>Ranked by what the owner keeps</SectionLabel>
        <span className="text-[10.5px] text-[var(--c-muted)]">
          <Fig className="text-[var(--c-ink)]">{aboveCount}</Fig> keep more than the city, <Fig className="text-[var(--c-ink)]">{belowCount}</Fig> keep less
        </span>
      </div>

      {/* axis header , labels the shared scale so the center line reads as the city baseline */}
      <div className="mb-1.5 grid grid-cols-[18px_130px_1fr_44px] items-center gap-3 px-0">
        <span />
        <span />
        <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          <span>Keeps less</span>
          <span className="text-[var(--c-ink2)]">City 100</span>
          <span>Keeps more</span>
        </div>
        <span />
      </div>

      {/* the divergence chart: each row carries its own centered baseline at 50% of the bar cell */}
      <div className="relative">
        <ol className="relative z-10">
          {rows.map(({ d, keep }, i) => {
            const sel = d.slug === selected;
            const above = keep >= 100;
            const dev = keep - 100;
            // the ONE terracotta bar: the #1 keeper, ALWAYS (terracotta = the answer).
            // Selection never moves the accent: a picked row gets the neutral ink ring
            // + bold name only, so the page's one color keeps one meaning.
            const focal = i === 0;
            // half-width of the track (each side gets 50% of it). The bar RESTS at its real
            // width (SSR / no-JS / reduced-motion): it only grows-from-center on scroll-in
            // by starting at 0 until `seen`, then transitioning via CSS (no per-row hook).
            const target = (Math.abs(dev) / maxDev) * 50;
            const animate = mounted && !reduced;
            // rest at the real width for SSR / no-JS / reduced-motion / already-seen;
            // collapse to 0 only while mounted + animating + not-yet-in-view.
            const w = animate && !seen ? 0 : target;
            return (
              <li key={d.slug}>
                <button
                  type="button" onClick={() => onSelect(d.slug)} aria-pressed={sel}
                  className="nerow -mx-2 grid w-[calc(100%+1rem)] grid-cols-[18px_130px_1fr_44px] items-center gap-3 rounded-md px-2 py-1.5 text-left"
                >
                  <Fig className={`text-[12px] ${focal ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{i + 1}</Fig>
                  <span className={`min-w-0 truncate text-[12.5px] ${sel ? "font-semibold text-[var(--c-ink)]" : "font-medium text-[var(--c-ink2)]"}`}>
                    {d.name}
                  </span>
                  <div className="relative h-[14px]" role="img" aria-label={`${d.name}: keep index ${keep}, ${above ? "above" : "below"} the city baseline of 100`}>
                    {/* mid track */}
                    <div className="absolute top-1/2 h-px w-full -translate-y-1/2" style={{ background: "#efeae6" }} />
                    {/* the city-100 baseline , the single most important reference on the page */}
                    <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2" style={{ background: "#b9b1ab" }} />
                    {/* divergence fill from the center */}
                    <div
                      className="absolute top-1/2 h-[9px] -translate-y-1/2 rounded-[2px]"
                      style={{
                        left: above ? "50%" : `${50 - w}%`,
                        width: `${w}%`,
                        background: focal ? TERRA : "#c8c2bd",
                        transition: animate ? "width .6s cubic-bezier(.2,.7,.2,1), left .6s cubic-bezier(.2,.7,.2,1)" : "none",
                      }}
                    />
                    {/* selection: a neutral ink ring at the bar tip */}
                    {sel ? (
                      <span
                        className="absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                        style={{ left: `${above ? 50 + w : 50 - w}%`, background: "#1b1b1a", boxShadow: "0 0 0 1px #e3e3e3", transition: animate ? "left .6s cubic-bezier(.2,.7,.2,1)" : "none" }}
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <Fig className={`text-right text-[13px] ${focal ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{keep}</Fig>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-[var(--c-muted)]">Bars read against the city baseline of 100: right of the line, more of each pound stays than the city average; left of it, rent has eaten the lift.</p>
    </div>
  );
}

/* (the explorer chip rail was REMOVED , Final Ascent audit "district-chips" merge
 * verdict: three redundant selectors for one state. The strip rows and the map pins
 * both select; the chapter-03 compare picker keeps the one chip rail on the page.) */

/* ============================================================================
 * WHY THE NUMBER MOVES , an explicit MULTIPLICATIVE waterfall. City starts at 1.00;
 * each factor multiplies the RUNNING total (not a parallel additive bar), and the net
 * is the product. Bars encode the running product on a shared 0..maxProduct axis so
 * the reader sees each step lift or trim the total. HONESTY: the raw->clipped line
 * renders ONLY when the clip actually binds (raw product ABOVE the net at display
 * precision); narrating a clip the numbers never show was the audit's logical major.
 * A near-flat district gets its own honest read instead of four identical bars left
 * unexplained. One use of this idiom on the page.
 * ========================================================================== */
function MultWaterfall({ d }: { d: District }) {
  const steps = [
    { label: "City average", mult: 1 },
    { label: "Commuter footfall", mult: d.commuter_mult },
    { label: "Visitor footfall", mult: d.tourism_mult },
    { label: "Area character", mult: d.tag_mult },
  ];
  // running product through the three factors
  let run = 1;
  const rows = steps.map((s, i) => {
    if (i === 0) return { label: s.label, mult: 1, running: 1, isCity: true };
    run *= s.mult;
    return { label: s.label, mult: s.mult, running: run, isCity: false };
  });
  const net = 1 + d.rev_vs_city_pct / 100; // the modeled result the city page ships
  const rawProduct = run;
  // the clip BINDS only when the raw product sits above the net at display precision;
  // otherwise the raw->clipped sentence is numerically inert (or, worse, "clips" up).
  const clipBinds = Number(rawProduct.toFixed(2)) > Number(net.toFixed(2));
  // near-flat district: every factor within 0.05 of the city norm , say so instead
  // of leaving four near-identical bars to answer "why the number moves" in silence.
  const nearFlat = [d.commuter_mult, d.tourism_mult, d.tag_mult].every((m) => Math.abs(m - 1) <= 0.05);
  const maxAxis = Math.max(net, rawProduct, 1) * 1.08;
  const barW = (v: number) => Math.max(2, (v / maxAxis) * 100);
  return (
    <div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[104px_1fr_52px] items-center gap-2.5">
            <span className={`text-[11px] ${r.isCity ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{r.label}</span>
            <div className="relative h-[9px] overflow-hidden rounded-full" style={{ background: "#efeae6" }} role="img" aria-label={`${r.label}: running ${r.running.toFixed(2)} times the city`}>
              <div className="h-full rounded-full" style={{ width: `${barW(r.running)}%`, background: r.isCity ? "#b9b1ab" : "#cdc6c0" }} />
            </div>
            <Fig className="text-right text-[11.5px] text-[var(--c-ink2)]">
              {r.isCity ? <>x1.00</> : <>x{r.mult.toFixed(2)}</>}
            </Fig>
          </div>
        ))}
        {/* net row , the clipped product, the single terracotta carrier */}
        <div className="mt-1 grid grid-cols-[104px_1fr_52px] items-center gap-2.5 border-t border-[var(--c-border)] pt-2">
          <span className="text-[11px] font-semibold text-[var(--c-ink)]">Net vs city</span>
          <div className="relative h-[11px] overflow-hidden rounded-full" style={{ background: "#f0eae7" }} role="img" aria-label={`net ${net.toFixed(2)} times the city, clipped`}>
            <div className="h-full rounded-full" style={{ width: `${barW(net)}%`, background: TERRA }} />
          </div>
          <Fig className="text-right text-[12px] text-[var(--terra-text)]">x{net.toFixed(2)}</Fig>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-[var(--c-muted)]">
        Each factor multiplies the running total, not adds to it.
        {clipBinds ? (
          <> The raw product reaches <Fig className="text-[var(--c-ink2)]">x{rawProduct.toFixed(2)}</Fig>; the model clips it to <Fig className="text-[var(--c-ink2)]">x{net.toFixed(2)}</Fig>, so no single district lifts a trade without limit.</>
        ) : nearFlat ? (
          <> Every factor here sits close to the city norm, so the number barely moves. The edge, if any, lives in the rent line below, not the takings.</>
        ) : null}
      </p>
    </div>
  );
}

/* FOOTFALL , two markers on ONE shared 0-100 intensity scale (weekday + weekend),
 * NOT a false part-of-whole share. Weekday and weekend are independent intensities,
 * so they read as two positions on the same axis. Terracotta on the busier marker. */
function FootfallScale({ d }: { d: District }) {
  const ff = footVal(d);
  const wd = ff.weekday, we = ff.weekend;
  const wdBusier = wd >= we;
  return (
    <div>
      <div className="relative h-9" role="img" aria-label={`weekday intensity ${wd}, weekend intensity ${we}, on a 0 to 100 scale`}>
        {/* the shared track */}
        <div className="absolute left-0 right-0 top-[22px] h-1.5 rounded-full" style={{ background: "linear-gradient(90deg,#ececec,#f4ded6)" }} />
        {/* weekday marker */}
        <Marker pos={wd} label="Weekday" value={wd} accent={wdBusier} above />
        {/* weekend marker */}
        <Marker pos={we} label="Weekend" value={we} accent={!wdBusier} />
      </div>
      <div className="mt-1 flex justify-between text-[9.5px] uppercase tracking-wide text-[var(--c-muted)]"><span>Quiet</span><span>Packed</span></div>
    </div>
  );
}
function Marker({ pos, label, value, accent, above }: { pos: number; label: string; value: number; accent: boolean; above?: boolean }) {
  return (
    <div className="absolute -translate-x-1/2" style={{ left: `${Math.max(4, Math.min(96, pos))}%`, top: above ? 0 : 26 }}>
      {above ? <span className="mb-0.5 block whitespace-nowrap text-center text-[10px] font-medium" style={{ color: accent ? "var(--terra-text)" : "var(--c-ink2)" }}>{label} <span className="fig">{value}</span></span> : null}
      <span className="mx-auto block h-3 w-3 rounded-full border-2 border-white" style={{ background: accent ? TERRA : "#8f8f8d", boxShadow: "0 0 0 1px #e3e3e3" }} />
      {!above ? <span className="mt-0.5 block whitespace-nowrap text-center text-[10px] font-medium" style={{ color: accent ? "var(--terra-text)" : "var(--c-ink2)" }}>{label} <span className="fig">{value}</span></span> : null}
    </div>
  );
}

/* PRICE TIER , a 4-word category (affordable / mid / expensive / luxury) rendered as
 * a DISCRETE 4-step band, active step inked. The old continuous Meter manufactured
 * false precision (a made-up 28/52/78/96 position for a categorical read). */
const PRICE_TIERS = ["affordable", "mid", "expensive", "luxury"] as const;
const PRICE_LABELS = ["Affordable", "Mid", "Expensive", "Luxury"] as const;
function PriceTierBand({ tier }: { tier: string }) {
  const idx = Math.max(0, PRICE_TIERS.indexOf(tier as (typeof PRICE_TIERS)[number]));
  return (
    <div role="img" aria-label={`price tier: ${PRICE_LABELS[idx]}`}>
      <div className="grid grid-cols-4 gap-1">
        {PRICE_TIERS.map((t, i) => (
          <span key={t} className="h-[7px] rounded-full" style={{ background: i === idx ? "var(--c-ink)" : "#e6e6e6" }} />
        ))}
      </div>
      <div className="mt-1 grid grid-cols-4 gap-1 text-center text-[9px] uppercase tracking-wide">
        {PRICE_LABELS.map((l, i) => (
          <span key={l} className={i === idx ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-muted)]"}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * DETAIL PANEL , disciplined. The SURFACE carries ONE decision: name + character +
 * blurb + the keep/revenue pair (keep is the hero, terracotta; revenue is grey
 * support) + the one-line counterweight + the CTA. The proof lives one click down
 * in single-open disclosures (kit Expand, name-grouped) , and the disclosure that
 * opens BY DEFAULT is "Why the number moves" (the proof of the hero figure), never
 * the Pro paywall. Trades / prime streets / who-is-here moved to the card under the
 * map (UnderMapCard) so the sticky map column earns its pixels. Count-up-safe hero
 * figure on district change. CTA chrome is ink (terracotta = answers only).
 * ========================================================================== */
function DetailPanel({ d, reduced }: { d: District; reduced: boolean }) {
  const up = d.rev_vs_city_pct >= 0;
  const keep = keepIndex(d);
  const above = keep >= 100;
  const keepShown = Math.round(useCountUp(keep, reduced, 460));
  const counter = above ? d.counterweight_above : d.counterweight_below;
  const grp = `ne-panel-${d.slug}`; // single-open group, reset per district

  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] lg:sticky lg:top-6"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -12px rgba(43,28,22,0.10)" }}>

      {/* HEADER STRIP , the decision. keep index is the hero (terracotta, largest); revenue is grey support. */}
      <div className="px-5 pt-4 pb-4" style={{ background: "linear-gradient(180deg,#fff7f4 0%,#ffffff 100%)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 data-typography="custom" className="text-[22px] font-bold tracking-tight text-[var(--c-ink)]">{d.name}</h3>
              <span className="text-[12px] text-[var(--c-muted)]">{d.character}</span>
            </div>
            <p className="mt-1.5 max-w-md text-[13px] leading-snug text-[var(--c-ink2)]">{d.blurb}</p>
          </div>
          {/* the ONE hero figure: keep index, count-up safe */}
          <div className="shrink-0 text-right">
            <Fig className="block text-[48px] leading-none text-[var(--terra-text)]">{keepShown}</Fig>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">keep index{above ? ", above city" : ", below city"}</div>
            <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">revenue <Fig className="text-[var(--c-ink2)]">{up ? "+" : ""}{d.rev_vs_city_pct}%</Fig> vs city</div>
          </div>
        </div>

        {/* the decision line: verdict + counterweight, plain-spoken, from the seed */}
        <p className="mt-3 border-t border-[var(--c-border)] pt-3 text-[13px] font-medium leading-snug text-[var(--c-ink)]">{d.verdict}</p>
        <p className="mt-1.5 text-[12px] leading-snug text-[var(--c-ink2)]">{counter}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {(d.tags ?? []).map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>

      {/* PROOF , the rest behind single-open disclosures. The one open by default is
          the proof of the hero figure, not the Pro veil (audit hierarchy fix). */}
      <div className="space-y-2 px-4 py-4">
        <Expand name={grp} title="Why the number moves" open right={<Fig className="text-[12px] text-[var(--c-ink)]">x{(1 + d.rev_vs_city_pct / 100).toFixed(2)}</Fig>}>
          <div className="pt-1"><MultWaterfall d={d} /></div>
        </Expand>

        <Expand name={grp} title="The rent counterweight" right={<Fig className="text-[12px] text-[var(--c-ink)]">x{d.rent_mult.toFixed(2)}</Fig>}>
          <p className="pt-1 text-[12.5px] leading-snug text-[var(--c-ink2)]">
            Rent runs <Fig className="text-[var(--c-ink)]">x{d.rent_mult.toFixed(2)}</Fig> the city rate. The keep index divides the revenue lift by this load, which is why {above ? "the lighter lease lets more of each pound stay put" : "the headline lift never reaches the till"}.
          </p>
        </Expand>

        <Expand name={grp} title="When the trade happens">
          <div className="pt-2"><FootfallScale d={d} /></div>
        </Expand>

        <Expand name={grp} title="Walkability and price tier">
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            <div><SectionLabel>Walkability</SectionLabel><Meter value={walkVal(d)} left="Car-led" right="Walk-led" /></div>
            <div><SectionLabel>Price tier</SectionLabel><PriceTierBand tier={d.price_tier} /></div>
          </div>
        </Expand>

        {/* WHAT LOCALS KNOW , the moat voice + the Pro seam. Free shows the first line;
            Pro unlocks the rest (the named side street, the licensing quirk, the rent
            delta). Real content stays in the DOM under the veil for SEO. */}
        {(d.locals_know ?? []).length ? (
          <Expand name={grp} title="What locals know" right={<LockPill label="Pro" />}>
            <div className="pt-1">
              <div className="mb-2 flex items-center gap-1.5">
                <Ico id="locals-know" tone="terra" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--terra-text)]">Ground truth</span>
              </div>
              <ul className="space-y-1.5">
                <li className="text-[12.5px] leading-snug text-[var(--c-ink2)]">{d.locals_know![0]}</li>
              </ul>
              {(d.locals_know ?? []).length > 1 ? (
                <div className="mt-2.5 pb-1">
                  <LockVeil headline="The rest of the local read" note="The named cheaper side street, the licensing quirk, the real rent delta operators trade on." cta="Unlock with Pro">
                    {/* min-height reserves room so the centered lock tile + CTA sits fully
                        inside the veil even when the hidden lines are short (no edge clip). */}
                    <ul className="min-h-[168px] space-y-1.5">
                      {d.locals_know!.slice(1).map((s, i) => (
                        <li key={i} className="text-[12.5px] leading-snug text-[var(--c-ink2)]">{s}</li>
                      ))}
                    </ul>
                  </LockVeil>
                </div>
              ) : null}
            </div>
          </Expand>
        ) : null}
      </div>

      {/* CTA , the call onward to the highest-value node (the cell page). Chrome is
          ink, never terracotta; dev route until promotion (then /{city}/{district}). */}
      <div className="flex items-center justify-between gap-3 border-t border-[var(--c-border)] px-5 py-3.5">
        {/* "covered", not "modeled": the page's one provenance line owns that word */}
        <div className="text-[12px] text-[var(--c-muted)]">
          <Fig className="text-[14px] text-[var(--c-ink)]">{d.cell_count ?? "?"}</Fig> trades covered in {d.name}
        </div>
        <a href="/dev/spine-cell" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--c-ink)" }}>
          Open a trade here <span aria-hidden>&#8594;</span>
        </a>
      </div>
    </div>
  );
}

/* ============================================================================
 * UNDER-MAP CARD , the selected district's trades + streets + people, filling the
 * dead space under the sticky map so the biggest element in chapter 01 carries
 * data below the tiles (audit: "the map column's pixels must earn"). Content moved
 * OUT of the panel disclosures (no fact appears twice). Terracotta only on the #1
 * trade numeral , the card's one answer.
 * ========================================================================== */
function UnderMapCard({ d }: { d: District }) {
  return (
    <div className="mt-4 rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] p-4"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -12px rgba(43,28,22,0.10)" }}>
      <SectionLabel>What works in {d.name}</SectionLabel>
      <ol className="space-y-2">
        {(d.best_trades ?? []).map((t, i) => (
          <li key={t.name} className="flex gap-3">
            <Fig className={`mt-px w-4 shrink-0 text-[13px] ${i === 0 ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{i + 1}</Fig>
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold text-[var(--c-ink)]">{t.name}</div>
              <div className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{t.why}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid grid-cols-1 gap-3 border-t border-[var(--c-border)] pt-3 sm:grid-cols-2">
        <div>
          <SectionLabel>Prime streets</SectionLabel>
          <div className="flex flex-wrap gap-1.5">{(d.prime_streets ?? []).map((s) => <Chip key={s}>{s}</Chip>)}</div>
        </div>
        <div>
          <SectionLabel>Who is here</SectionLabel>
          <ul className="space-y-1">
            {(d.demographics ?? []).map((s) => (
              <li key={s} className="flex items-center gap-2 text-[12px] text-[var(--c-ink2)]"><span className="h-1 w-1 shrink-0 rounded-full" style={{ background: "#8f8f8d" }} />{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * THE EXPLORER , the "01" movement body. Rail opener, the divergence keep-strip
 * (hero), the real map + under-map district card (orientation that earns its
 * pixels), and the disciplined panel. Two selectors only: strip rows + map pins.
 * ========================================================================== */
export function NeighborhoodExplorer({ districts, defaultSlug, rail, mapNote }: { districts: District[]; defaultSlug?: string; rail?: Rail2; mapNote?: string }) {
  const reduced = usePrefersReducedMotion();
  // ONE order page-wide: keep index descending (the strip's ranking).
  const ranked = React.useMemo(() => [...districts].sort((a, b) => keepIndex(b) - keepIndex(a)), [districts]);
  const initial = (defaultSlug && districts.some((d) => d.slug === defaultSlug) ? defaultSlug : ranked[0]?.slug) ?? "";
  const [selected, setSelected] = React.useState<string>(initial);
  const current = districts.find((d) => d.slug === selected) ?? ranked[0];

  // real map points: position = orientation, and the pins EARN their ink , dot size
  // scales with the keep index (normalized across the shown districts so the biggest
  // dot IS the biggest keeper), and tone encodes the side of the city-100 baseline:
  // terracotta = keeps more than the city (the answer side), ink = keeps less.
  const points: SpinePoint[] = React.useMemo(() => {
    const withGeo = districts.filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng));
    const keeps = withGeo.map((d) => keepIndex(d));
    const lo = Math.min(...keeps);
    const span = Math.max(1, Math.max(...keeps) - lo);
    return withGeo.map((d) => {
      const keep = keepIndex(d);
      return {
        name: d.name, slug: d.slug, lat: d.lat as number, lng: d.lng as number,
        signal: 20 + ((keep - lo) / span) * 80, // keep, normalized to the 0..100 dot-size scale
        signalLabel: `keep ${keep}`,
        sub: keep >= 100 ? "keeps more than the city" : "keeps less than the city",
        tone: keep >= 100 ? ("terra" as const) : ("ink" as const),
      };
    });
  }, [districts]);

  return (
    <div>
      <NeStyles />
      <Rail icon="best-areas" tone="terra" kicker={rail?.kicker ?? "Where in the city"} verdict={rail?.verdict} />

      {/* HERO , the divergence keep strip, full width */}
      <KeepStrip districts={districts} selected={selected} onSelect={setSelected} reduced={reduced} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-start">
        {/* Left: the real orientation map (tight fit so the districts fill the frame,
            not empty Southeast England) + the under-map card that makes the sticky
            column carry data. Selecting a pin drives the strip + panel. */}
        <div className="lg:sticky lg:top-6">
          <div className="netop overflow-hidden rounded-[14px]">
            <SpineMap
              points={points}
              fitPadding={36}
              ariaLabel="London district map"
              onSelect={(p) => p.slug && setSelected(p.slug)}
              legendLabel="Dot size = keep index; terracotta = keeps more than the city"
            />
          </div>
          {mapNote ? <p className="px-1 pt-2 text-[11px] leading-snug text-[var(--c-muted)]">{mapNote}</p> : null}
          <UnderMapCard d={current} />
        </div>
        <DetailPanel d={current} reduced={reduced} />
      </div>
    </div>
  );
}

/* ============================================================================
 * MYTH CHAPTER , promoted to its own full-width chapter (not column ballast). The
 * moat line at real size: the struck claim, the reality, and a RANK SLOPE as the
 * counter-evidence , every district's revenue rank on the left, keep rank on the
 * right, one line each (Visual Dictionary idiom #6). The loudest district's fall
 * is the ONE terracotta line; the other eight draw the whole re-ordering the prose
 * describes instead of restating one number a fourth time. Draw-on-scroll gated by
 * in-view; SSR / no-JS / reduced-motion render the lines at rest (fully drawn).
 * ========================================================================== */
function RankSlope({ districts, loudSlug, hidden, reduced }: { districts: District[]; loudSlug: string; hidden: boolean; reduced: boolean }) {
  const byRev = [...districts].sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct);
  const byKeep = [...districts].sort((a, b) => keepIndex(b) - keepIndex(a));
  const revRank = new Map(byRev.map((d, i) => [d.slug, i + 1] as const));
  const keepRank = new Map(byKeep.map((d, i) => [d.slug, i + 1] as const));
  const n = districts.length;
  const W = 400, rowH = 24, top = 30, H = top + n * rowH + 4;
  const xL = 128, xR = 272;
  const y = (rank: number) => top + (rank - 0.5) * rowH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`Rank slope: revenue rank against keep rank for ${n} districts. ${byRev[0]?.name} falls from revenue rank 1 to keep rank ${keepRank.get(byRev[0]?.slug ?? "") ?? n}.`}>
      {/* column headers , the two ends of the slope, named */}
      <text x={xL - 10} y={14} textAnchor="end" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>Revenue rank</text>
      <text x={xR + 10} y={14} textAnchor="start" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>Keep rank</text>
      {/* the two rank rails */}
      <line x1={xL} y1={top - 6} x2={xL} y2={H - 4} stroke="#e7e2df" strokeWidth={1} />
      <line x1={xR} y1={top - 6} x2={xR} y2={H - 4} stroke="#e7e2df" strokeWidth={1} />
      {districts.map((d) => {
        const loud = d.slug === loudSlug;
        const r1 = revRank.get(d.slug) ?? n, r2 = keepRank.get(d.slug) ?? n;
        const y1 = y(r1), y2 = y(r2);
        const stroke = loud ? TERRA : "#c9c4bf";
        const ink = loud ? "var(--terra-text)" : "#1b1b1a";
        return (
          <g key={d.slug}>
            <text x={xL - 10} y={y1 + 3.5} textAnchor="end" fontSize={11}>
              <tspan fill="#8c8c8a" fontSize={10} style={{ fontFamily: "var(--font-grotesk)" }}>{r1}  </tspan>
              <tspan fill={ink} fontWeight={loud ? 600 : 500}>{d.name}</tspan>
            </text>
            <line
              x1={xL} y1={y1} x2={xR} y2={y2}
              stroke={stroke} strokeWidth={loud ? 2.2 : 1.4} strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={hidden ? 1 : 0}
              style={{ transition: hidden || reduced ? "none" : `stroke-dashoffset .7s cubic-bezier(.2,.7,.2,1) ${(r1 - 1) * 45}ms` }}
            />
            <circle cx={xL} cy={y1} r={2.4} fill={loud ? TERRA : "#8f8f8d"} />
            <circle cx={xR} cy={y2} r={2.4} fill={loud ? TERRA : "#8f8f8d"} />
            <text x={xR + 10} y={y2 + 3.5} textAnchor="start" fontSize={11}>
              <tspan fill="#8c8c8a" fontSize={10} style={{ fontFamily: "var(--font-grotesk)" }}>{r2}  </tspan>
              <tspan fill={ink} fontWeight={loud ? 600 : 500}>{d.name}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MythChapter({ myth, loudest, districts = [] }: { myth: Myth; loudest: District; districts?: District[] }) {
  const reduced = usePrefersReducedMotion();
  const { ref, seen } = useInView<HTMLDivElement>();
  // SSR / no-JS render the slope fully drawn (rest state); only after hydration and
  // before scroll-in do the lines collapse, then draw on view (count-up contract).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const hidden = mounted && !reduced && !seen;
  return (
    <div ref={ref} className="overflow-hidden rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)]">
      <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:items-center md:p-8">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Ico id="myth-reality" tone="terra" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">Myth, busted</span>
          </div>
          <p className="text-[20px] font-semibold leading-snug text-[var(--c-ink)] md:text-[24px]">&ldquo;{myth.claim}&rdquo;</p>
          <p className="mt-3 max-w-prose text-[13.5px] leading-relaxed text-[var(--c-ink2)]">{myth.reality}</p>
          {myth.tell ? <p className="mt-3 text-[13px] font-semibold text-[var(--c-ink)]">{myth.tell}</p> : null}
        </div>
        {/* the counter-evidence: the whole re-ordering, drawn , not one number again */}
        <div className="rounded-[12px] border border-[var(--c-border)] bg-[var(--c-card)] p-4">
          <RankSlope districts={districts.length ? districts : [loudest]} loudSlug={loudest.slug} hidden={hidden} reduced={reduced} />
          <p className="mt-2 border-t border-[var(--c-border)] pt-2 text-[11px] leading-snug text-[var(--c-muted)]">The order flips almost exactly: the loudest takings slide to the bottom on keep, and the lightest rents climb to the top.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * DISTRICT-TO-DISTRICT COMPARE (Pro) , hold 2-3 side by side. Leads with an
 * AUTO-DERIVED verdict ("X keeps the most, Y takes the most but keeps the least"),
 * adds a metric NOT on the surface (weekday dependence: how lopsided the week is),
 * and gates the full differential behind a Pro veil so the free/Pro seam is concrete.
 * Metrics are rows, districts columns. In-cell bars run ONLY on drawn shared scales
 * (CellScaleBar: keep ticked at city 100, revenue ticked at 0%) , no hidden
 * truncated baselines. The row-best dot is legended in the caption and wears
 * terracotta on the keep row only. One multiplier notation page-set-wide (x2.05).
 * ========================================================================== */
type Metric = {
  key: string; label: string; hint: string;
  get: (d: District) => number; fmt: (d: District) => string;
  higherIsBetter: boolean;
  /** in-cell bar on a DRAWN shared scale (CellScaleBar: baseline tick at the domain
   * start, optional dark reference tick, e.g. city 100 / 0%). Hidden truncated
   * baselines were the audit's visual-choice major. Omit = figure-only row. */
  bar?: { domain: [number, number]; refValue?: number };
};

// weekday dependence: how lopsided the week is (100 = all weekday, 0 = all weekend).
// derived from the two intensity indices, honestly labeled a lean, not a share.
function weekdayLean(d: District) {
  const ff = footVal(d);
  const tot = ff.weekday + ff.weekend || 1;
  return Math.round((ff.weekday / tot) * 100);
}

const FREE_METRICS: Metric[] = [
  { key: "keep", label: "Keep index", hint: "what stays after rent", get: (d) => keepIndex(d), fmt: (d) => `${keepIndex(d)}`, higherIsBetter: true, bar: { domain: [60, 130], refValue: 100 } },
  { key: "rev", label: "Revenue vs city", hint: "headline takings", get: (d) => d.rev_vs_city_pct, fmt: (d) => `${d.rev_vs_city_pct >= 0 ? "+" : ""}${d.rev_vs_city_pct}%`, higherIsBetter: true, bar: { domain: [-10, 60], refValue: 0 } },
  { key: "rent", label: "Rent load", hint: "lower is lighter", get: (d) => d.rent_mult, fmt: (d) => `x${d.rent_mult.toFixed(2)}`, higherIsBetter: false },
];
const PRO_METRICS: Metric[] = [
  { key: "lean", label: "Weekday dependence", hint: "how lopsided the week is", get: (d) => weekdayLean(d), fmt: (d) => `${weekdayLean(d)}% weekday`, higherIsBetter: false, bar: { domain: [0, 100] } },
  { key: "walk", label: "Walkability", hint: "foot vs car-led", get: (d) => walkVal(d), fmt: (d) => `${walkVal(d)}`, higherIsBetter: true, bar: { domain: [0, 100] } },
  { key: "weekend", label: "Weekend footfall", hint: "trade intensity", get: (d) => footVal(d).weekend, fmt: (d) => `${footVal(d).weekend}`, higherIsBetter: true, bar: { domain: [0, 100] } },
];

/* the row-best dot: terracotta ONLY on the keep row (the page's deciding metric);
 * every other row's best wears neutral ink, so the accent never crowns the metric
 * the page just called the liar. Legend lives in the caption under the table. */
const dotColor = (m: Metric) => (m.key === "keep" ? TERRA : "#1b1b1a");
function bestFor(m: Metric, cols: District[]): string | null {
  if (cols.length < 2) return null;
  let bd = cols[0];
  cols.forEach((d) => { if (m.higherIsBetter ? m.get(d) > m.get(bd) : m.get(d) < m.get(bd)) bd = d; });
  return bd.slug;
}

function MetricRows({ metrics, cols }: { metrics: Metric[]; cols: District[] }) {
  return (
    <>
      {metrics.map((m) => {
        const best = bestFor(m, cols);
        return (
          <div key={m.key} className="grid items-center gap-3 border-b border-[var(--c-border)] px-4 py-2.5 last:border-0" style={{ gridTemplateColumns: `minmax(0,1.3fr) repeat(${cols.length}, minmax(0,1fr))` }}>
            <div className="min-w-0">
              <div className="text-[12.5px] font-medium text-[var(--c-ink2)]">{m.label}</div>
              <div className="text-[10.5px] text-[var(--c-muted)]">{m.hint}</div>
            </div>
            {cols.map((d) => {
              const win = best === d.slug && cols.length > 1;
              return (
                <div key={d.slug} className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {/* row-best dot: terracotta on keep only, ink elsewhere (legend in the caption) */}
                    {win ? <span className="inline-block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: dotColor(m) }} aria-label="best" /> : null}
                    <Fig className="text-[14px] text-[var(--c-ink)]">{m.fmt(d)}</Fig>
                  </div>
                  {/* in-cell bar ONLY on a drawn scale: baseline tick + reference tick visible */}
                  {m.bar ? <CellScaleBar value={m.get(d)} domain={m.bar.domain} refValue={m.bar.refValue} /> : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export function NeighborhoodCompare({ districts, compare, defaultSlugs }: { districts: District[]; compare?: Rail2; defaultSlugs?: string[] }) {
  const ranked = React.useMemo(() => [...districts].sort((a, b) => keepIndex(b) - keepIndex(a)), [districts]);
  const seed = (defaultSlugs && defaultSlugs.filter((s) => districts.some((d) => d.slug === s))) || [];
  const init = (seed.length >= 2 ? seed : [ranked[0]?.slug, ranked[1]?.slug, ranked[ranked.length - 1]?.slug]).filter(Boolean).slice(0, 3) as string[];
  const [picks, setPicks] = React.useState<string[]>(init);
  const cols = picks.map((s) => districts.find((d) => d.slug === s)).filter(Boolean) as District[];

  function toggle(slug: string) {
    setPicks((prev) => {
      if (prev.includes(slug)) return prev.length > 2 ? prev.filter((s) => s !== slug) : prev;
      if (prev.length >= 3) return [...prev.slice(1), slug];
      return [...prev, slug];
    });
  }

  // auto-derived verdict: who keeps the most vs who takes the most (§9 neighbours read).
  const derived = React.useMemo(() => {
    if (cols.length < 2) return null;
    const byKeep = [...cols].sort((a, b) => keepIndex(b) - keepIndex(a));
    const byRev = [...cols].sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct);
    const keepWinner = byKeep[0], revWinner = byRev[0];
    if (keepWinner.slug === revWinner.slug) {
      return `${keepWinner.name} both takes the most and keeps the most of the ${cols.length}, a rare case where the loud name is also the right one.`;
    }
    return `${keepWinner.name} keeps the most of each pound; ${revWinner.name} takes the most but keeps less, because its rent runs heavier. Rent, not revenue, sets the order.`;
  }, [cols]);

  return (
    <div>
      <Rail icon="compare" tone="terra" kicker={compare?.kicker ?? "Hold two or three side by side"} verdict={compare?.verdict} />

      {/* picker */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Pick up to three districts to compare">
        {ranked.map((d) => {
          const on = picks.includes(d.slug);
          return (
            <button
              key={d.slug} type="button" onClick={() => toggle(d.slug)} aria-pressed={on}
              className={`cityhov inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] ${on ? "border-transparent bg-[var(--c-ink)] text-white" : "border-[var(--c-border)] bg-[var(--c-card)] text-[var(--c-ink2)]"}`}
            >
              <span className="font-medium">{d.name}</span>
              <Fig className={`text-[11px] ${on ? "text-white/80" : "text-[var(--c-muted)]"}`}>{keepIndex(d)}</Fig>
            </button>
          );
        })}
        <span className="ml-1 text-[10.5px] text-[var(--c-muted)]">two to three, keep index shown</span>
      </div>

      {/* the auto-derived verdict , the read the comparison reveals, above the table */}
      {derived ? (
        <div className="mb-3 flex items-start gap-2 rounded-[10px] border border-[var(--terra-border)] bg-[var(--terra-soft)] px-3.5 py-2.5">
          <span className="mt-px shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">Verdict</span>
          <p className="text-[12.5px] leading-snug text-[var(--c-ink)]">{derived}</p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)]"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -12px rgba(43,28,22,0.10)" }}>

        {/* DESKTOP / TABLET */}
        <div className="hidden sm:block">
          <div className="grid items-end gap-3 border-b border-[var(--c-border)] px-4 py-3" style={{ gridTemplateColumns: `minmax(0,1.3fr) repeat(${cols.length}, minmax(0,1fr))` }}>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Metric</span>
            {cols.map((d) => (
              <div key={d.slug} className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-[var(--c-ink)]">{d.name}</div>
                <div className="truncate text-[11px] text-[var(--c-muted)]">{d.character}</div>
              </div>
            ))}
          </div>
          {/* free rows */}
          <MetricRows metrics={FREE_METRICS} cols={cols} />
          {/* Pro rows behind the veil , the differential you cannot get from the panel.
              min-height + pb keep the centered lock tile + CTA fully inside the card edge. */}
          <div className="border-t border-[var(--c-border)] p-3 pb-4">
            <LockVeil headline="The full differential" note="Weekday dependence, walkability and weekend intensity, side by side, so you can see which one survives a quiet week." cta="Compare with Pro">
              <div className="min-h-[172px] divide-y divide-[var(--c-border)]"><MetricRows metrics={PRO_METRICS} cols={cols} /></div>
            </LockVeil>
          </div>
        </div>

        {/* MOBILE , one stacked block per district */}
        <div className="divide-y divide-[var(--c-border)] sm:hidden">
          {cols.map((d) => (
            <div key={d.slug} className="px-4 py-3">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="text-[14px] font-semibold text-[var(--c-ink)]">{d.name}</span>
                <span className="text-[11px] text-[var(--c-muted)]">{d.character}</span>
              </div>
              <div className="space-y-2">
                {FREE_METRICS.map((m) => {
                  const win = bestFor(m, cols) === d.slug && cols.length > 1;
                  return (
                    <div key={m.key} className="grid grid-cols-[130px_1fr_auto] items-center gap-2.5">
                      <span className="min-w-0 truncate text-[11.5px] text-[var(--c-ink2)]">{m.label}</span>
                      {m.bar ? <span className="-mt-1 block"><CellScaleBar value={m.get(d)} domain={m.bar.domain} refValue={m.bar.refValue} /></span> : <span />}
                      <span className="flex w-16 items-center justify-end gap-1">
                        {win ? <span className="inline-block h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: dotColor(m) }} aria-label="best" /> : null}
                        <Fig className="text-right text-[12px] text-[var(--c-ink)]">{m.fmt(d)}</Fig>
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2.5 pb-1">
                <LockVeil headline="The full differential" note="Weekday dependence, walkability and weekend intensity." cta="Compare with Pro">
                  <div className="min-h-[172px] space-y-2">
                    {PRO_METRICS.map((m) => (
                      <div key={m.key} className="grid grid-cols-[130px_1fr_auto] items-center gap-2.5">
                        <span className="min-w-0 truncate text-[11.5px] text-[var(--c-ink2)]">{m.label}</span>
                        {m.bar ? <span className="-mt-1 block"><CellScaleBar value={m.get(d)} domain={m.bar.domain} refValue={m.bar.refValue} /></span> : <span />}
                        <Fig className="w-16 text-right text-[12px] text-[var(--c-ink)]">{m.fmt(d)}</Fig>
                      </div>
                    ))}
                  </div>
                </LockVeil>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* the table's legend + scale honesty note (covers desktop and mobile) */}
      <p className="mt-2 text-[11px] leading-snug text-[var(--c-muted)]">The dot marks each row&rsquo;s best, terracotta on keep, the metric that decides. In-cell bars run on drawn scales: the dark tick marks city 100 on the keep row and 0% on revenue.</p>
    </div>
  );
}
