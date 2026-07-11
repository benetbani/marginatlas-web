/**
 * NeighborhoodExplorer , the neighborhood-hub island (Leg 2 of the spine program),
 * rebuilt on RENT LOAD, the knowable seed input (rulebook v1 §5, founder 2026-07-11:
 * a per-district "what you keep" ranking has no statistical basis and never renders).
 * The signature object is a REAL CARTO tile map (SpineMap, shared) for orientation,
 * paired with a DIVERGENCE rent-strip centered on the city level of x1.00 (lighter
 * grows right, heavier grows left) and a DISCIPLINED detail panel that opens to one
 * decision; its proof rows (the multiplier readout, footfall scale, walkability/price
 * tier) stay PERMANENTLY VISIBLE, and only the Pro-gated locals-know list keeps a
 * single-open disclosure. The map column earns its pixels: tighter fit padding + the
 * selected district's trades / prime streets / who-is-here card fills the space under
 * the sticky map. Terracotta = the answer only (the lightest lease, the lighter-rent
 * pin side, the panel rent figure only when it runs below the city rate); selection
 * and CTAs are neutral ink.
 * All prose lives in the seed. Count-up-safe motion, reduced-motion safe.
 *
 * As-built chart dictionary (perceptual idiom census; bar budget per rulebook v1 §25:
 * the strip + the walkability Meter are this page's ONLY bar-family graphics):
 *   divergence bar-list (deviation from x1.00): RentStrip x1  , the page hero.
 *   real tile map (position + rent-encoded pins): SpineMap x1  , dot size = how
 *     light the rent runs, terracotta = lighter than the city, ink = heavier.
 *   multiplier readout (running product, printed figures, no tracks): "Why the
 *     number moves" x1  , the raw->clipped line renders ONLY when the clip binds.
 *   marker-on-a-shared-scale: footfall two-marker x1 + walkability Meter x1 (cap 2);
 *     price tier is a DISCRETE 4-step band (a category, never a false-precise dot).
 *   editorial table, plain figures, best-in-row bold: Compare x1 (no in-cell bars).
 *   rank slope (2-point): MythChapter x1  , revenue rank -> rent rank, 9 lines.
 */
"use client";
import * as React from "react";
import { Ico, Fig, Meter, Chip, Rail, Expand, TERRA, InfoTip, SampleTag } from "@/components/spine/kit";
import { LockVeil, LockPill } from "@/components/spine/kit-index";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";
import { isReviewBuild } from "@/lib/feature_flags";
import { AtlasMark } from "./marks";

type District = {
  name: string; slug: string; character: string; tags?: string[];
  commuter_mult: number; tourism_mult: number; tag_mult: number; rent_mult: number;
  rev_vs_city_pct: number; walkability: string; price_tier: string; headline_trade: string;
  xy?: { x: number; y: number }; lat?: number; lng?: number; walk_score?: number; cell_count?: number; blurb?: string; cell_href?: string;
  verdict?: string;
  best_trades?: Array<{ name: string; why: string }>;
  prime_streets?: string[]; demographics?: string[];
  footfall?: { weekday: number; weekend: number };
  locals_know?: string[];
};
type Myth = { claim?: string; reality?: string; stat_label?: string; tell?: string; slope_note?: string };
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
 * all show the true number). `active` gates only the animation. First reveal tweens
 * from 85% of the target (the sanctioned spine-city/motion pattern, P5): a mid-tween
 * capture must sit within rounding distance of the truth, never a near-zero transient. */
function useCountUp(target: number, reduced: boolean, ms = 520, active = true) {
  const [v, setV] = React.useState(target);
  const from = React.useRef(0);
  const done = React.useRef(false);
  React.useEffect(() => {
    if (reduced || !active) { setV(target); from.current = target; return; }
    const start = performance.now();
    const a = done.current ? from.current : target * 0.85;
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

/* island-scoped hover language: the quiet grey row wash + faint lift only (rulebook
 * v1 §37, founder 2026-07-11: no terracotta motif on hover), reduced-motion safe. */
function NeStyles() {
  return (
    <style>{`.spine-scope .nerow{transition:background-color .15s ease-out,transform .15s ease-out}
.spine-scope .nerow:hover{background:var(--c-soft);transform:translateY(-1px)}
@media (prefers-reduced-motion:reduce){.spine-scope .nerow{transition:none}.spine-scope .nerow:hover{transform:none}}`}</style>
  );
}

/* `sample` marks a block whose figures have no honest source (adapt_hood.ts omits
 * them on promotion: footfall, prime streets, what-locals-know), so whenever the
 * illustrative seed DOES fill it, it never presents as real (rulebook v2 D4). */
function SectionLabel({ children, sample }: { children: React.ReactNode; sample?: boolean }) {
  return (
    <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">
      {children}
      {sample ? <span className="ml-1.5 inline-flex align-middle"><SampleTag /></span> : null}
    </div>
  );
}

/* the ONE card chrome for this island's four framed blocks (rent strip, detail panel,
 * under-map card, compare table): rounded-[14px] hairline + the inset-highlight shadow,
 * extracted so the chrome is declared once (zero visual change). */
/* Rulebook v1 §R1 (founder 2026-07-11, reverses S14): cards carry the SLIGHT July-3 drop
 * shadow again , the exact pair the ratified baseline renders shipped with, composed with
 * the inset paper top-highlight, matching Box in kit.tsx. */
const HOOD_CARD_SHADOW = "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -12px rgba(43,28,22,0.10)";
const HoodCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function HoodCard({ className = "", style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] ${className}`}
      style={{ boxShadow: HOOD_CARD_SHADOW, ...style }}
      {...rest}
    />
  );
});

/* ============================================================================
 * RENT STRIP , the page hero, and its ONE ranked bar graphic (rulebook v1 §25).
 * A DIVERGENCE bar-list centered on the city rent level of x1.00: lighter-than-city
 * grows RIGHT in terracotta, heavier grows LEFT in grey, so "who signs the light
 * lease" reads in one glance. The x1.00 line is a bold labeled gridline (the single
 * most important reference on the page). Length encodes deviation from x1.00
 * (Cleveland-McGill: position + length). Selection is a neutral INK ring + bold
 * name, never terracotta: the accent is fixed to the lightest lease (the answer)
 * regardless of what the reader picks. Ranked ascending, lightest first (D1).
 * ========================================================================== */
function RentStrip({ districts, selected, onSelect, reduced }: { districts: District[]; selected: string; onSelect: (s: string) => void; reduced: boolean }) {
  const rows = React.useMemo(
    () => districts.map((d) => ({ d, rent: d.rent_mult })).sort((a, b) => a.rent - b.rent),
    [districts]
  );
  // symmetric deviation span so the x1.00 line is visually centered.
  const maxDev = Math.max(0.2, ...rows.map((r) => Math.abs(r.rent - 1)));
  const { ref, seen } = useInView<HTMLDivElement>();
  // mounted gate: SSR / no-JS render the bars at their REAL width (never empty);
  // only after hydration do we collapse-then-grow on scroll-in.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const lighterCount = rows.filter((r) => r.rent <= 1).length;
  const heavierCount = rows.length - lighterCount;

  return (
    <HoodCard ref={ref} className="px-4 py-3.5">
      <div className="mb-1 flex items-end justify-between gap-3">
        <SectionLabel>Ranked by rent load, lightest first</SectionLabel>
        <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">
          <Fig className="text-[var(--c-ink)]">{lighterCount}</Fig> run lighter than the city, <Fig className="text-[var(--c-ink)]">{heavierCount}</Fig> heavier
        </span>
      </div>

      {/* axis header , labels the shared scale so the center line reads as the city
          rent level. On mobile the bar column is too narrow for three captions (they
          overprint as one smear), so only the center CITY x1.00 caption survives below sm. */}
      <div className="mb-1.5 grid grid-cols-[16px_88px_1fr_44px] items-center gap-2 px-0 sm:grid-cols-[18px_130px_1fr_52px] sm:gap-3">
        <span />
        <span />
        <div className="flex items-center justify-center text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)] sm:justify-between">
          <span className="hidden sm:inline">Heavier</span>
          <span className="text-[var(--c-ink2)]">City x1.00</span>
          <span className="hidden sm:inline">Lighter</span>
        </div>
        <span />
      </div>

      {/* the divergence chart: each row carries its own centered baseline at 50% of the bar cell */}
      <div className="relative">
        <ol className="relative z-10">
          {rows.map(({ d, rent }, i) => {
            const sel = d.slug === selected;
            const lighter = rent <= 1;
            const dev = 1 - rent;
            // the ONE terracotta bar: the lightest lease, ALWAYS (terracotta = the answer).
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
                  className="nerow -mx-2 grid w-[calc(100%+1rem)] grid-cols-[16px_88px_1fr_44px] items-center gap-2 rounded-md px-2 py-1.5 text-left sm:grid-cols-[18px_130px_1fr_52px] sm:gap-3"
                >
                  <Fig className={`text-[length:var(--t-body)] ${focal ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{i + 1}</Fig>
                  <span className={`min-w-0 truncate text-[length:var(--t-body)] ${sel ? "font-semibold text-[var(--c-ink)]" : "font-medium text-[var(--c-ink2)]"}`}>
                    {d.name}
                  </span>
                  <div className="relative h-[14px]" role="img" aria-label={`${d.name}: rent x${rent.toFixed(2)} the city rate, ${lighter ? "lighter than" : "heavier than"} the city`}>
                    {/* mid track */}
                    <div className="absolute top-1/2 h-px w-full -translate-y-1/2" style={{ background: "#efeae6" }} />
                    {/* the city x1.00 line , the single most important reference on the page */}
                    <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2" style={{ background: "#b9b1ab" }} />
                    {/* divergence fill from the center */}
                    <div
                      className="absolute top-1/2 h-[9px] -translate-y-1/2 rounded-[2px]"
                      style={{
                        left: lighter ? "50%" : `${50 - w}%`,
                        width: `${w}%`,
                        background: focal ? TERRA : "#c8c2bd",
                        transition: animate ? "width .6s cubic-bezier(.2,.7,.2,1), left .6s cubic-bezier(.2,.7,.2,1)" : "none",
                      }}
                    />
                    {/* selection: a neutral ink ring at the bar tip */}
                    {sel ? (
                      <span
                        className="absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                        style={{ left: `${lighter ? 50 + w : 50 - w}%`, background: "#1b1b1a", boxShadow: "0 0 0 1px #e3e3e3", transition: animate ? "left .6s cubic-bezier(.2,.7,.2,1)" : "none" }}
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <Fig className={`text-right text-[length:var(--t-body)] ${focal ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>x{rent.toFixed(2)}</Fig>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">Right of the line, rent runs lighter than the city; left of it, heavier.</p>
    </HoodCard>
  );
}

/* (the explorer chip rail was REMOVED , Final Ascent audit "district-chips" merge
 * verdict: three redundant selectors for one state. The strip rows and the map pins
 * both select; the chapter-03 compare picker keeps the one chip rail on the page.) */

/* ============================================================================
 * WHY THE NUMBER MOVES , an explicit MULTIPLICATIVE readout. City starts at 1.00;
 * each factor multiplies the RUNNING total (not an addition), and the net is the
 * product. The printed multipliers carry it: the length-encoded tracks were dropped
 * under the bar ration (rulebook v1 §25 + §26, a lone number may stay a number).
 * HONESTY: the raw->clipped line renders ONLY when the clip actually binds (raw
 * product ABOVE the net at display precision); narrating a clip the numbers never
 * show was the audit's logical major. A near-flat district gets its own honest read
 * instead of four near-identical rows left unexplained.
 * ========================================================================== */
function MultWaterfall({ d }: { d: District }) {
  const steps = [
    { label: "City average", mult: 1, isCity: true },
    { label: "Commuter footfall", mult: d.commuter_mult, isCity: false },
    { label: "Visitor footfall", mult: d.tourism_mult, isCity: false },
    { label: "Area character", mult: d.tag_mult, isCity: false },
  ];
  const net = 1 + d.rev_vs_city_pct / 100; // the modeled result the city page ships
  const rawProduct = d.commuter_mult * d.tourism_mult * d.tag_mult;
  // the clip BINDS only when the raw product sits above the net at display precision;
  // otherwise the raw->clipped sentence is numerically inert (or, worse, "clips" up).
  const clipBinds = Number(rawProduct.toFixed(2)) > Number(net.toFixed(2));
  // near-flat district: every factor within 0.05 of the city norm , say so instead
  // of leaving four near-identical rows to answer "why the number moves" in silence.
  const nearFlat = [d.commuter_mult, d.tourism_mult, d.tag_mult].every((m) => Math.abs(m - 1) <= 0.05);
  return (
    <div>
      <div className="space-y-1.5">
        {steps.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-2.5">
            <span className={`text-[length:var(--t-micro)] ${r.isCity ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>
              {r.label}
              {r.label === "Area character" ? <InfoTip gloss="A modeled premium or discount from what the district is known for: nightlife, luxury, markets." /> : null}
            </span>
            <Fig className="text-right text-[length:var(--t-micro)] text-[var(--c-ink2)]">x{r.mult.toFixed(2)}</Fig>
          </div>
        ))}
        {/* net row , the clipped product, in ink: the panel header rent figure carries
            the accent, so the readout stays neutral proof */}
        <div className="mt-1 flex items-center justify-between gap-2.5 border-t border-[var(--c-border)] pt-2">
          <span className="text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">Net vs city</span>
          <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">x{net.toFixed(2)}</Fig>
        </div>
      </div>
      <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
        Each factor is a modeled multiplier on the running total, not an addition.
        {clipBinds ? (
          <> The raw product reaches <Fig className="text-[var(--c-ink2)]">x{rawProduct.toFixed(2)}</Fig>; the model clips it to <Fig className="text-[var(--c-ink2)]">x{net.toFixed(2)}</Fig>, so no single district lifts a trade without limit.</>
        ) : nearFlat ? (
          <> Every factor here sits close to the city norm, so the number barely moves. The edge, if any, lives in the rent load, not the takings.</>
        ) : null}
      </p>
    </div>
  );
}

/* FOOTFALL , two markers on ONE shared 0-100 intensity scale (weekday + weekend),
 * NOT a false part-of-whole share. Weekday and weekend are independent intensities,
 * so they read as two positions on the same axis. Both markers are ink; the busier
 * label is only bolded (busier is a fact, not an answer, so it never wears the accent). */
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
        <Marker pos={wd} label="Weekday" value={wd} busier={wdBusier} above />
        {/* weekend marker */}
        <Marker pos={we} label="Weekend" value={we} busier={!wdBusier} />
      </div>
      <div className="mt-1 flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>Quiet</span><span>Packed</span></div>
    </div>
  );
}
function Marker({ pos, label, value, busier, above }: { pos: number; label: string; value: number; busier: boolean; above?: boolean }) {
  // edge shift (the exemplar's pattern): a label near either end slides inward so it
  // never clips outside the track on a narrow screen.
  const shift = pos < 12 ? "0" : pos > 88 ? "-100%" : "-50%";
  const lbl = (
    <span
      className={`${above ? "mb-0.5" : "mt-0.5"} block w-max whitespace-nowrap text-[length:var(--t-micro)] ${busier ? "font-semibold" : "font-medium"}`}
      style={{ transform: `translateX(${shift})`, color: "var(--c-ink2)" }}
    >
      {label} <span className="fig">{value}</span>
    </span>
  );
  return (
    <div className="absolute" style={{ left: `${Math.max(4, Math.min(96, pos))}%`, top: above ? 0 : 26 }}>
      {above ? lbl : null}
      <span className="block h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white" style={{ background: "var(--c-ink)", boxShadow: "0 0 0 1px #e3e3e3" }} />
      {!above ? lbl : null}
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
      <div className="mt-1 grid grid-cols-4 gap-1 text-center text-[length:var(--t-micro)] uppercase tracking-wide">
        {PRICE_LABELS.map((l, i) => (
          <span key={l} className={i === idx ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-muted)]"}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * DETAIL PANEL , disciplined. The SURFACE carries ONE decision: name + character +
 * blurb + the rent/revenue pair (rent load is the hero, terracotta when it runs
 * lighter than the city; revenue is grey support) + one verdict line + the CTA.
 * The rent figure is the knowable seed input (rulebook v1 §5: the derived keep
 * index never renders). The proof rows stay permanently visible; only the
 * Pro-gated locals-know list keeps a single-open disclosure (kit Expand,
 * name-grouped). Trades / prime streets / who-is-here moved to the card under
 * the map (UnderMapCard) so the sticky map column earns its pixels. Count-up-safe
 * hero figure on district change. CTA chrome is ink (terracotta = answers only).
 * ========================================================================== */
function DetailPanel({ d, reduced }: { d: District; reduced: boolean }) {
  const up = d.rev_vs_city_pct >= 0;
  const rent = d.rent_mult;
  const lighter = rent < 1;
  // the 3-way verdict word: lighter / at / heavier than the city rent level of x1.00.
  const dirWord = rent < 1 ? "lighter than city" : rent > 1 ? "heavier than city" : "at city rate";
  const rentShown = useCountUp(rent, reduced, 460);
  const grp = `ne-panel-${d.slug}`; // single-open group, reset per district

  return (
    <HoodCard className="overflow-hidden lg:sticky lg:top-6">

      {/* HEADER STRIP , the decision. Rent load is the hero (largest); it wears the
          panel's ONE terracotta only when it runs below the city x1.00 (terra keeps
          one meaning: the light-lease answer side), else ink. Revenue is grey support. */}
      <div className="px-5 pt-4 pb-4" style={{ background: "linear-gradient(180deg,#fff7f4 0%,#ffffff 100%)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 data-typography="custom" className="text-[length:var(--t-sub)] font-semibold tracking-tight text-[var(--c-ink)]">{d.name}</h3>
              <span className="text-[length:var(--t-body)] text-[var(--c-muted)]">{d.character}</span>
            </div>
            <p className="mt-1.5 max-w-md text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{d.blurb}</p>
          </div>
          {/* the ONE hero figure: rent load, count-up safe; terra only below city x1.00 */}
          <div className="shrink-0 text-right">
            <Fig className={`block text-[48px] leading-none ${lighter ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>x{rentShown.toFixed(2)}</Fig>
            <div className="mt-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">rent, {dirWord}</div>
            <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">revenue <Fig className="text-[var(--c-ink2)]">{up ? "+" : ""}{d.rev_vs_city_pct}%</Fig> vs city</div>
          </div>
        </div>

        {/* the decision line , verdict only (final-form: three prose beats to two;
            the counterweight paragraph is cut, since the 48px rent figure above,
            plus its lighter/heavier word, already carries that same number). */}
        <p className="mt-3 border-t border-[var(--c-border)] pt-3 text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink)]">{d.verdict}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {(d.tags ?? []).map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>

      {/* PROOF , the proof rows stay permanently visible (rulebook v1 §18: never hide
          a graphic behind a disclosure). Only the Pro-gated locals-know TEXT list
          keeps a disclosure; the old rent-counterweight row folded into the hero
          figure above (its number IS the hero now, and its keep-index prose is
          banned by §5). */}
      <div className="space-y-4 px-4 py-4">
        {/* WHY THE NUMBER MOVES , the proof of the revenue support figure, always
            visible (was the single-open group's default-open row; promoting it
            removes the need for a default at all). */}
        <div>
          <div className="mb-1 flex items-end justify-between gap-3">
            <SectionLabel>Why the number moves</SectionLabel>
            <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">x{(1 + d.rev_vs_city_pct / 100).toFixed(2)}</Fig>
          </div>
          <MultWaterfall d={d} />
        </div>

        {/* footfall timing omits on the real page (no honest source); it renders on the
            illustrative seed, which carries footfall. */}
        {d.footfall ? (
          <div>
            <SectionLabel sample>When the trade happens</SectionLabel>
            <FootfallScale d={d} />
          </div>
        ) : null}

        {/* walkability (categorical, real from flavor) + price tier (real from flavor);
            each sub-block self-omits, and the whole block omits, when absent. */}
        {d.walkability || d.walk_score != null || d.price_tier ? (
          <div>
            <SectionLabel>Walkability and price tier</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {d.walkability || d.walk_score != null ? (
                <div><SectionLabel>Walkability</SectionLabel><Meter value={walkVal(d)} left="Low foot traffic" right="High foot traffic" /></div>
              ) : null}
              {d.price_tier ? (
                <div><SectionLabel>Price tier</SectionLabel><PriceTierBand tier={d.price_tier} /></div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* WHAT LOCALS KNOW , the moat voice + the Pro seam. Free shows the first line;
            Pro unlocks the rest (the named side street, the licensing quirk, the rent
            delta). Real content stays in the DOM under the veil for SEO. */}
        {(d.locals_know ?? []).length ? (
          <Expand name={grp} title={<>What locals know <SampleTag /></>} right={<LockPill label="Pro" />}>
            <div className="pt-1">
              {/* ink kicker: the LockPill on the summary already carries the Pro cue */}
              <div className="mb-2 flex items-center gap-1.5">
                <Ico id="locals-know" />
                <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-ink2)]">Ground truth</span>
              </div>
              <ul className="space-y-1.5">
                <li className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{d.locals_know![0]}</li>
              </ul>
              {(d.locals_know ?? []).length > 1 ? (
                <div className="mt-2.5 pb-1">
                  {/* rulebook v1 §45 (G8): review builds render everything unveiled */}
                  <LockVeil unlocked={isReviewBuild()} headline="The rest of the local read" note="The named cheaper side street, the licensing quirk, the real rent delta operators trade on." cta="Unlock with Pro">
                    {/* min-height reserves room so the centered lock tile + CTA sits fully
                        inside the veil even when the hidden lines are short (no edge clip). */}
                    <ul className="min-h-[168px] space-y-1.5">
                      {d.locals_know!.slice(1).map((s, i) => (
                        <li key={i} className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{s}</li>
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
        {/* trades-covered count omits on the real page (no per-district source); the
            empty cell keeps the CTA to the right. */}
        <div className="text-[length:var(--t-body)] text-[var(--c-muted)]">
          {d.cell_count != null ? (
            <><Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{d.cell_count}</Fig> trades covered in {d.name}</>
          ) : null}
        </div>
        <a href={d.cell_href ?? "/dev/spine-cell"} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[length:var(--t-body)] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--c-ink)" }}>
          Open a trade here <span aria-hidden>&#8594;</span>
        </a>
      </div>
    </HoodCard>
  );
}

/* ============================================================================
 * UNDER-MAP CARD , the selected district's trades + streets + people, filling the
 * dead space under the sticky map so the biggest element in chapter 01 carries
 * data below the tiles (audit: "the map column's pixels must earn"). Content moved
 * OUT of the panel disclosures (no fact appears twice). Terracotta only on the #1
 * trade numeral , the card's one answer. A trade row links into its cell page where
 * the trade maps onto a modeled activity (the funnel to the highest-value node);
 * unmapped trades stay plain text.
 * ========================================================================== */

/* trade wording -> modeled London cell route. Keyword match, no new taxonomy; a miss
 * simply renders no link. */
const TRADE_ROUTES: Array<[RegExp, string]> = [
  [/dental/i, "/gb/london/dental-practices"],
  [/gym|fitness/i, "/gb/london/sports-fitness"],
  [/grocer/i, "/gb/london/grocery-stores"],
  [/restaurant/i, "/gb/london/restaurants"],
  [/\bbar\b|nightclub/i, "/gb/london/bars-nightclubs"],
  [/cafe|coffee/i, "/gb/london/cafes-coffee"],
];
const tradeHref = (name: string) => TRADE_ROUTES.find(([re]) => re.test(name))?.[1];

function UnderMapCard({ d }: { d: District }) {
  const trades = d.best_trades ?? [];
  const streets = d.prime_streets ?? [];
  const demos = d.demographics ?? [];
  const hasBottom = streets.length > 0 || demos.length > 0;
  // all three sources omitted: render nothing rather than an empty shell.
  if (trades.length === 0 && !hasBottom) return null;
  return (
    <HoodCard className="mt-4 p-4">
      {trades.length > 0 ? (
        <>
          <SectionLabel>What works in {d.name}</SectionLabel>
          <ol className="space-y-2">
            {trades.map((t, i) => {
              const href = tradeHref(t.name);
              const body = (
                <>
                  <div className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">
                    {t.name}
                    {href ? <span aria-hidden className="ml-1 text-[var(--c-muted)]">&#8594;</span> : null}
                  </div>
                  <div className="text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{t.why}</div>
                </>
              );
              return (
                <li key={t.name} className="flex gap-3">
                  <Fig className={`mt-px w-4 shrink-0 text-[length:var(--t-body)] ${i === 0 ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{i + 1}</Fig>
                  {href ? (
                    <a href={href} className="nerow -mx-1 min-w-0 rounded-md px-1">{body}</a>
                  ) : (
                    <div className="min-w-0">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      ) : null}
      {hasBottom ? (
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${trades.length > 0 ? "mt-3 border-t border-[var(--c-border)] pt-3" : ""}`}>
          {streets.length > 0 ? (
            <div>
              <SectionLabel sample>Prime streets</SectionLabel>
              <div className="flex flex-wrap gap-1.5">{streets.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            </div>
          ) : null}
          {demos.length > 0 ? (
            <div>
              <SectionLabel>Who is here</SectionLabel>
              <ul className="space-y-1">
                {demos.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-[length:var(--t-body)] text-[var(--c-ink2)]"><span className="h-1 w-1 shrink-0 rounded-full" style={{ background: "#8f8f8d" }} />{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </HoodCard>
  );
}

/* ============================================================================
 * THE EXPLORER , the "01" movement body. Rail opener, the divergence rent-strip
 * (hero), the real map + under-map district card (orientation that earns its
 * pixels), and the disciplined panel. Two selectors only: strip rows + map pins.
 * ========================================================================== */
export function NeighborhoodExplorer({ districts, defaultSlug, rail, mapNote }: { districts: District[]; defaultSlug?: string; rail?: Rail2; mapNote?: string }) {
  const reduced = usePrefersReducedMotion();
  // ONE order page-wide: rent load ascending, lightest first (the strip's ranking, D1).
  const ranked = React.useMemo(() => [...districts].sort((a, b) => a.rent_mult - b.rent_mult), [districts]);
  const initial = (defaultSlug && districts.some((d) => d.slug === defaultSlug) ? defaultSlug : ranked[0]?.slug) ?? "";
  const [selected, setSelected] = React.useState<string>(initial);
  const current = districts.find((d) => d.slug === selected) ?? ranked[0];

  // real map points: position = orientation, and the pins EARN their ink , dot size
  // scales with how LIGHT the rent runs (normalized across the shown districts so the
  // biggest dot IS the lightest lease, the answer), and tone encodes the side of the
  // city x1.00 line: terracotta = lighter than the city, ink = heavier.
  const points: SpinePoint[] = React.useMemo(() => {
    const withGeo = districts.filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng));
    const rents = withGeo.map((d) => d.rent_mult);
    const hi = Math.max(...rents);
    const span = Math.max(0.01, hi - Math.min(...rents));
    return withGeo.map((d) => {
      const rent = d.rent_mult;
      return {
        name: d.name, slug: d.slug, lat: d.lat as number, lng: d.lng as number,
        signal: 20 + ((hi - rent) / span) * 80, // lightness of the lease, on the 0..100 dot-size scale
        signalLabel: `rent x${rent.toFixed(2)}`,
        sub: rent < 1 ? "rent runs lighter than the city" : rent > 1 ? "rent runs heavier than the city" : "rent runs at the city rate",
        tone: rent < 1 ? ("terra" as const) : ("ink" as const),
      };
    });
  }, [districts]);

  return (
    <div>
      <NeStyles />
      <Rail icon="best-areas" tone="terra" kicker={rail?.kicker ?? "Where in the city"} verdict={rail?.verdict} />

      {/* HERO , the divergence rent strip, full width */}
      <RentStrip districts={districts} selected={selected} onSelect={setSelected} reduced={reduced} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-start">
        {/* Left: the real orientation map (tight fit so the districts fill the frame,
            not empty Southeast England) + the under-map card that makes the sticky
            column carry data. Selecting a pin drives the strip + panel. */}
        <div className="lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-[14px]">
            <SpineMap
              points={points}
              fitPadding={36}
              ariaLabel="District map"
              onSelect={(p) => p.slug && setSelected(p.slug)}
              legendLabel="Dot size = how light the rent runs; terracotta = lighter than the city"
            />
          </div>
          {mapNote ? <p className="px-1 pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{mapNote}</p> : null}
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
 * counter-evidence , every district's revenue rank on the left, rent rank on the
 * right (1 = lightest lease; the honest half of the same flip story, rulebook v1
 * §5), one line each (Visual Dictionary idiom #6). The loudest district's fall is
 * the ONE terracotta line; the other lines draw the whole re-ordering the prose
 * describes instead of restating one number a fourth time. Draw-on-scroll gated by
 * in-view; SSR / no-JS / reduced-motion render the lines at rest (fully drawn).
 * The internal kicker stays a plain "Revenue rank vs rent rank" label in neutral
 * ink, never terracotta (terracotta stays reserved for the answer); the standalone
 * `tell` one-liner stays cut, since the chart's own caption below carries that
 * same point alone, once, not a fourth time.
 * ========================================================================== */
function RankSlope({ districts, loudSlug, hidden, reduced }: { districts: District[]; loudSlug: string; hidden: boolean; reduced: boolean }) {
  const byRev = [...districts].sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct);
  const byRent = [...districts].sort((a, b) => a.rent_mult - b.rent_mult);
  const revRank = new Map(byRev.map((d, i) => [d.slug, i + 1] as const));
  const rentRank = new Map(byRent.map((d, i) => [d.slug, i + 1] as const));
  // the two lines a phone still names: the loudest (the myth's subject) + the lightest lease.
  const lightestSlug = byRent[0]?.slug;
  const n = districts.length;
  const W = 400, rowH = 24, top = 30, H = top + n * rowH + 4;
  const xL = 128, xR = 272;
  const y = (rank: number) => top + (rank - 0.5) * rowH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`Rank slope: revenue rank against rent rank for ${n} districts, rent rank 1 being the lightest lease. ${byRev[0]?.name} holds revenue rank 1 and rent rank ${rentRank.get(byRev[0]?.slug ?? "") ?? n}.`}>
      {/* column headers , the two ends of the slope, named */}
      <text x={xL - 10} y={14} textAnchor="end" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>Revenue rank</text>
      <text x={xR + 10} y={14} textAnchor="start" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>Rent rank</text>
      {/* the two rank rails */}
      <line x1={xL} y1={top - 6} x2={xL} y2={H - 4} stroke="#e7e2df" strokeWidth={1} />
      <line x1={xR} y1={top - 6} x2={xR} y2={H - 4} stroke="#e7e2df" strokeWidth={1} />
      {districts.map((d) => {
        const loud = d.slug === loudSlug;
        const r1 = revRank.get(d.slug) ?? n, r2 = rentRank.get(d.slug) ?? n;
        const y1 = y(r1), y2 = y(r2);
        const stroke = loud ? TERRA : "#c9c4bf";
        const ink = loud ? "var(--terra-text)" : "#1b1b1a";
        // below sm only the two lines that carry the story get a label (first-word
        // names at a readable 12px); the rest scale to ~4px smears at phone width,
        // so the dots + lines draw the flip and the prose carries it.
        const nameMobile = loud || d.slug === lightestSlug;
        const firstWord = d.name.split(" ")[0];
        return (
          <g key={d.slug}>
            <text className="hidden sm:block" x={xL - 10} y={y1 + 3.5} textAnchor="end" fontSize={11}>
              <tspan fill="#8c8c8a" fontSize={10} style={{ fontFamily: "var(--font-grotesk)" }}>{r1}  </tspan>
              <tspan fill={ink} fontWeight={loud ? 600 : 500}>{d.name}</tspan>
            </text>
            {nameMobile ? (
              <text className="sm:hidden" x={xL - 10} y={y1 + 4} textAnchor="end" fontSize={12} fill={ink} fontWeight={loud ? 600 : 500}>{firstWord}</text>
            ) : null}
            <line
              x1={xL} y1={y1} x2={xR} y2={y2}
              stroke={stroke} strokeWidth={loud ? 2.2 : 1.4} strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={hidden ? 1 : 0}
              style={{ transition: hidden || reduced ? "none" : `stroke-dashoffset .7s cubic-bezier(.2,.7,.2,1) ${(r1 - 1) * 45}ms` }}
            />
            <circle cx={xL} cy={y1} r={2.4} fill={loud ? TERRA : "#8f8f8d"} />
            <circle cx={xR} cy={y2} r={2.4} fill={loud ? TERRA : "#8f8f8d"} />
            <text className="hidden sm:block" x={xR + 10} y={y2 + 3.5} textAnchor="start" fontSize={11}>
              <tspan fill="#8c8c8a" fontSize={10} style={{ fontFamily: "var(--font-grotesk)" }}>{r2}  </tspan>
              <tspan fill={ink} fontWeight={loud ? 600 : 500}>{d.name}</tspan>
            </text>
            {nameMobile ? (
              <text className="sm:hidden" x={xR + 10} y={y2 + 4} textAnchor="start" fontSize={12} fill={ink} fontWeight={loud ? 600 : 500}>{firstWord}</text>
            ) : null}
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
            <Ico id="myth-reality" />
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">Revenue rank vs rent rank</span>
          </div>
          <p className="text-[length:var(--t-sub)] font-semibold leading-snug text-[var(--c-ink)] md:text-[length:var(--t-sub)]">&ldquo;{myth.claim}&rdquo;</p>
          <p className="mt-3 max-w-prose text-[length:var(--t-body)] leading-relaxed text-[var(--c-ink2)]">{myth.reality}</p>
        </div>
        {/* the counter-evidence: the whole re-ordering, drawn , not one number again */}
        <div className="rounded-[12px] border border-[var(--c-border)] bg-[var(--c-card)] p-4">
          <RankSlope districts={districts.length ? districts : [loudest]} loudSlug={loudest.slug} hidden={hidden} reduced={reduced} />
          <p className="mt-2 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{myth?.slope_note ?? "The order flips end to end: the loudest names carry the heaviest leases, and the lightest leases sit far from the top of the takings."}</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * DISTRICT-TO-DISTRICT COMPARE (Pro) , hold 2-3 side by side. Adds a metric NOT
 * on the surface (weekday dependence: how lopsided the week is) and gates the
 * full differential behind a Pro veil so the free/Pro seam is concrete (review
 * builds render it unveiled, rulebook v1 §45). Metrics are rows, districts
 * columns; one pass per metric, plain figures, no in-cell bars (rulebook v1 §25
 * bar ration + §22 skimmable tables). The row-best figure is bold, terracotta
 * on the rent-load row only (the deciding metric); legend in the caption. One
 * multiplier notation page-set-wide (x2.05).
 * ========================================================================== */
type Metric = {
  key: string; label: string; hint: string;
  get: (d: District) => number; fmt: (d: District) => string;
  /** omit when the metric has no universal better direction , no best is crowned */
  higherIsBetter?: boolean;
};

// weekday dependence: how lopsided the week is (100 = all weekday, 0 = all weekend).
// derived from the two intensity indices, honestly labeled a lean, not a share.
function weekdayLean(d: District) {
  const ff = footVal(d);
  const tot = ff.weekday + ff.weekend || 1;
  return Math.round((ff.weekday / tot) * 100);
}

/* the deciding row leads: rent load, the knowable input the whole page ranks on
 * (rulebook v1 §5: the derived keep index never renders). */
const FREE_METRICS: Metric[] = [
  { key: "rent", label: "Rent load", hint: "lower is lighter", get: (d) => d.rent_mult, fmt: (d) => `x${d.rent_mult.toFixed(2)}`, higherIsBetter: false },
  { key: "rev", label: "Revenue vs city", hint: "headline takings", get: (d) => d.rev_vs_city_pct, fmt: (d) => `${d.rev_vs_city_pct >= 0 ? "+" : ""}${d.rev_vs_city_pct}%`, higherIsBetter: true },
];
const PRO_METRICS: Metric[] = [
  // no higherIsBetter: a weekday-led week is not better or worse, so no best crown.
  { key: "lean", label: "Weekday dependence", hint: "how lopsided the week is", get: (d) => weekdayLean(d), fmt: (d) => `${weekdayLean(d)}% weekday` },
  { key: "walk", label: "Walkability", hint: "low to high foot traffic", get: (d) => walkVal(d), fmt: (d) => `${walkVal(d)}`, higherIsBetter: true },
  { key: "weekend", label: "Weekend footfall", hint: "trade intensity", get: (d) => footVal(d).weekend, fmt: (d) => `${footVal(d).weekend}`, higherIsBetter: true },
];

/* the row-best crown: bold everywhere, terracotta ONLY on the rent-load row (the
 * page's deciding metric). Legend lives in the caption under the table. */
const DECIDER_KEY = "rent";
const bestClass = (m: Metric) =>
  m.key === DECIDER_KEY ? "font-semibold text-[var(--terra-text)]" : "font-semibold text-[var(--c-ink)]";
function bestFor(m: Metric, cols: District[]): string | null {
  if (m.higherIsBetter == null || cols.length < 2) return null;
  let bd = cols[0];
  cols.forEach((d) => { if (m.higherIsBetter ? m.get(d) > m.get(bd) : m.get(d) < m.get(bd)) bd = d; });
  return bd.slug;
}

/* one pass per metric: label + hint + plain figures, the row-best bold (terracotta
 * on the rent-load row only). The old three-pass render (free rows with in-cell
 * bars, ungated bar-only Pro rows, veiled figure-only Pro rows) collapsed under
 * rulebook v1 §25 (bar ration) + §22 (a table is skimmable at a glance). */
function MetricRows({ metrics, cols }: { metrics: Metric[]; cols: District[] }) {
  return (
    <>
      {metrics.map((m) => {
        const best = bestFor(m, cols);
        return (
          <div key={m.key} className="grid items-center gap-3 border-b border-[var(--c-border)] px-4 py-2.5 last:border-0" style={{ gridTemplateColumns: `minmax(0,1.3fr) repeat(${cols.length}, minmax(0,1fr))` }}>
            <div className="min-w-0">
              <div className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)]">{m.label}</div>
              <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{m.hint}</div>
            </div>
            {cols.map((d) => {
              const win = best === d.slug && cols.length > 1;
              return (
                <div key={d.slug} className="min-w-0">
                  <Fig className={`text-[length:var(--t-body)] ${win ? bestClass(m) : "text-[var(--c-ink)]"}`}>{m.fmt(d)}</Fig>
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
  // ONE order page-wide: rent load ascending, lightest first (the strip's ranking, D1).
  const ranked = React.useMemo(() => [...districts].sort((a, b) => a.rent_mult - b.rent_mult), [districts]);
  const seed = (defaultSlugs && defaultSlugs.filter((s) => districts.some((d) => d.slug === s))) || [];
  const init = (seed.length >= 2 ? seed : [ranked[0]?.slug, ranked[1]?.slug, ranked[ranked.length - 1]?.slug]).filter(Boolean).slice(0, 3) as string[];
  const [picks, setPicks] = React.useState<string[]>(init);
  const cols = picks.map((s) => districts.find((d) => d.slug === s)).filter(Boolean) as District[];

  // footfall has no source on the real page, so its Pro rows (weekday dependence,
  // weekend footfall) drop; walkability, which is real, stays. The dev seed carries
  // footfall, so all three still show there.
  const hasFootfall = districts.some((d) => d.footfall != null);
  const proMetrics = hasFootfall ? PRO_METRICS : PRO_METRICS.filter((m) => m.key === "walk");
  // substance gate: a veil hiding a single row sells nothing. Below two Pro rows the
  // leftover metric ships as a fourth free row and the veil (and its note) omit.
  const veiled = proMetrics.length >= 2;
  const freeMetrics = veiled ? FREE_METRICS : [...FREE_METRICS, ...proMetrics];
  const proNote = "Weekday dependence, walkability and weekend intensity, side by side, so you can see which one survives a quiet week.";

  function toggle(slug: string) {
    setPicks((prev) => {
      if (prev.includes(slug)) return prev.length > 2 ? prev.filter((s) => s !== slug) : prev;
      if (prev.length >= 3) return [...prev.slice(1), slug];
      return [...prev, slug];
    });
  }

  /* the auto-derived verdict callout is DELETED (rulebook v1 §15, founder 2026-07-11:
   * no cross-entity revenue-vs-keep verdict footers); the finding lives on the table's
   * bold row-best figures, never asserted above it. */

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
              className={`cityhov inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[length:var(--t-body)] ${on ? "border-transparent bg-[var(--c-ink)] text-white" : "border-[var(--c-border)] bg-[var(--c-card)] text-[var(--c-ink2)]"}`}
            >
              {/* the hold state, marked: saved bookmark on a held chip, empty on the rest */}
              <AtlasMark id={on ? "bookmark-saved" : "bookmark"} size={13} />
              <span className="font-medium">{d.name}</span>
              <Fig className={`text-[length:var(--t-micro)] ${on ? "text-white/80" : "text-[var(--c-muted)]"}`}>x{d.rent_mult.toFixed(2)}</Fig>
            </button>
          );
        })}
        <span className="ml-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">two to three, rent load shown</span>
      </div>

      <HoodCard className="overflow-hidden">

        {/* DESKTOP / TABLET */}
        <div className="hidden sm:block">
          <div className="grid items-end gap-3 border-b border-[var(--c-border)] px-4 py-3" style={{ gridTemplateColumns: `minmax(0,1.3fr) repeat(${cols.length}, minmax(0,1fr))` }}>
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Metric</span>
            {cols.map((d) => (
              <div key={d.slug} className="min-w-0">
                <div className="truncate text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{d.name}</div>
                <div className="truncate text-[length:var(--t-micro)] text-[var(--c-muted)]">{d.character}</div>
              </div>
            ))}
          </div>
          {/* free rows (plus any Pro leftovers when the veil fails the substance gate) */}
          <MetricRows metrics={freeMetrics} cols={cols} />
          {/* Pro rows , the differential you cannot get from the panel. ONE pass per
              metric (rulebook v1 §22); the veil renders unveiled on review builds
              (§45). min-height + pb keep the centered lock tile + CTA fully inside
              the card edge when the production seam is on. */}
          {veiled ? (
            <div className="border-t border-[var(--c-border)]">
              <div className="flex items-center justify-between gap-2 px-4 pb-1 pt-3">
                <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Pro metrics</span>
                <LockPill label="Pro" />
              </div>
              <div className="p-3 pb-4">
                <LockVeil unlocked={isReviewBuild()} headline="The full differential" note={proNote} cta="Compare with Pro">
                  <div className="min-h-[172px]"><MetricRows metrics={proMetrics} cols={cols} /></div>
                </LockVeil>
              </div>
            </div>
          ) : null}
        </div>

        {/* MOBILE , one stacked block per district */}
        <div className="divide-y divide-[var(--c-border)] sm:hidden">
          {cols.map((d) => (
            <div key={d.slug} className="px-4 py-3">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{d.name}</span>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{d.character}</span>
              </div>
              <div className="space-y-2">
                {freeMetrics.map((m) => {
                  const win = bestFor(m, cols) === d.slug && cols.length > 1;
                  return (
                    <div key={m.key} className="flex items-center justify-between gap-2.5">
                      <span className="min-w-0 truncate text-[length:var(--t-micro)] text-[var(--c-ink2)]">{m.label}</span>
                      <Fig className={`text-right text-[length:var(--t-body)] ${win ? bestClass(m) : "text-[var(--c-ink)]"}`}>{m.fmt(d)}</Fig>
                    </div>
                  );
                })}
              </div>
              {veiled ? (
                <div className="mt-2.5">
                  {/* Pro rows, ONE pass per metric (rulebook v1 §22); the veil renders
                      unveiled on review builds (§45). */}
                  <div className="flex items-center justify-between gap-2 border-t border-[var(--c-border)] pb-1 pt-2.5">
                    <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Pro metrics</span>
                    <LockPill label="Pro" />
                  </div>
                  <div className="pb-1 pt-1">
                    <LockVeil unlocked={isReviewBuild()} headline="The full differential" note={proNote} cta="Compare with Pro">
                      <div className="min-h-[172px] space-y-2">
                        {proMetrics.map((m) => {
                          const win = bestFor(m, cols) === d.slug && cols.length > 1;
                          return (
                            <div key={m.key} className="flex items-center justify-between gap-2.5">
                              <span className="min-w-0 truncate text-[length:var(--t-micro)] text-[var(--c-ink2)]">{m.label}</span>
                              <Fig className={`text-right text-[length:var(--t-body)] ${win ? bestClass(m) : "text-[var(--c-ink)]"}`}>{m.fmt(d)}</Fig>
                            </div>
                          );
                        })}
                      </div>
                    </LockVeil>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </HoodCard>

      {/* the table's legend (covers desktop and mobile) */}
      <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">Bold marks each row&rsquo;s best, terracotta on rent load, the metric that decides.</p>
    </div>
  );
}
