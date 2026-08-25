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
 * the rent strip is this page's ONLY fill-bar graphic):
 *   divergence bar-list (deviation from x1.00): RentStrip x1  , the page hero.
 *   real tile map (position + rent-encoded pins): SpineMap x1  , dot size = how
 *     light the rent runs, terracotta = lighter than the city, ink = heavier.
 *   multiplier readout (running product, printed figures, SampleTagged): "Why the
 *     number moves" x1  , self-omits when every factor rounds to x1.00.
 *   marker-on-a-shared-scale (neutral, no fill): footfall two-marker x1 + a single
 *     walkability marker (WalkTrack) x1; price tier is a DISCRETE 4-step band.
 *   editorial table, plain figures, color-marked row-best: Compare x1 (no in-cell bars).
 *   rank slope: MythChapter x1  , revenue rank -> rent rank, one line each, the myth
 *     struck on the chart as a dashed phantom line.
 */
"use client";
import * as React from "react";
import { Ico, Fig, Chip, Rail, Expand, TERRA, InfoTip, SampleTag, CARD_SURFACE, Band } from "@/components/spine/kit";
import { LockVeil, LockPill } from "@/components/spine/kit-index";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";
import { isReviewBuild } from "@/lib/feature_flags";

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
type Myth = { claim?: string; reality?: string; stat_label?: string; tell?: string; slope_note?: string; strike_label?: string };
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
/* Rulebook v1 §R1 (founder 2026-07-11, reverses S14): cards carry the SLIGHT July-3
 * drop shadow, composed with the inset paper top-highlight.
 *
 * IT IS NO LONGER COPIED HERE. This file used to hold its own duplicate of the
 * shadow string under a comment reading "matching Box in kit.tsx", and the two
 * stopped matching the first time Box changed: measured 2026-08-24, the city page
 * held ONE card surface and this page had drifted to SEVEN. A comment cannot keep
 * two constants equal, so the surface is imported from the kit. Rulebook v2 §36. */
const HoodCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function HoodCard({ className = "", style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] ${className}`}
      style={{ ...CARD_SURFACE, ...style }}
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
  const maxDev = Math.max(0.2, ...rows.map((r) => Math.abs(r.rent - 1)));
  /* THE AXIS SITS WHERE THE DATA IS, NOT ALWAYS IN THE MIDDLE.
     This is a divergence chart and it was drawn symmetrically whatever the
     numbers did: the city line at 50%, half the track for lighter-than-city and
     half for heavier. Every London district is heavier than the city rate, so
     every bar grew left, the right half of the hero chart was blank on all seven
     rows, and the word LIGHTER labelled a region no bar can ever reach.
     Rulebook v2 §17, and §2: reserving space for nothing is not restraint.

     When both sides are present the chart is unchanged. When they are all on one
     side the line moves to that edge and the bars get the whole width, which
     doubles the resolution of the comparison the page exists to make. */
  const hasLighter = rows.some((r) => r.rent < 1);
  const hasHeavier = rows.some((r) => r.rent > 1);
  const oneSided = hasLighter !== hasHeavier;
  const axis = !oneSided ? 50 : hasHeavier ? 100 : 0;
  const span = oneSided ? 100 : 50;
  const { ref, seen } = useInView<HTMLDivElement>();
  // mounted gate: SSR / no-JS render the bars at their REAL width (never empty);
  // only after hydration do we collapse-then-grow on scroll-in.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  /* THE SUMMARY IS THE SPREAD, NOT A TALLY OF WHICH SIDE OF THE CITY RATE.
     It used to read "<n> run lighter than the city, <n> heavier", and on London
     that printed "0 run lighter than the city, 7 heavier". A line whose first
     figure is zero has spent a reader's attention to tell them nothing, and it
     carried the same confusion the district chips did: the page above it leads
     with RENT RUNS LIGHTEST and then this said none of them were light.
     Rulebook v2 §7, §3.

     What replaces it is the one thing this strip shows that nothing else on the
     page states: how far apart the ends are. Both figures are already on screen,
     so this is arithmetic on the visible, not a new measurement (§0). It is
     never a zero, and it is different for every city. */
  const lightestRent = rows[0]?.rent;
  const heaviestRent = rows[rows.length - 1]?.rent;
  const spread =
    typeof lightestRent === "number" && typeof heaviestRent === "number" && lightestRent > 0 && rows.length > 1
      ? heaviestRent / lightestRent
      : null;

  return (
    <HoodCard ref={ref} className="px-4 py-3.5">
      <div className="mb-1 flex items-end justify-between gap-3">
        <SectionLabel>Ranked by rent load, lightest first</SectionLabel>
        {spread ? (
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">
            the heaviest lease runs <Fig className="text-[var(--c-ink)]">{spread.toFixed(1)}x</Fig> the lightest
          </span>
        ) : null}
      </div>

      {/* axis header , labels the shared scale so the center line reads as the city
          rent level. On mobile the bar column is too narrow for three captions (they
          overprint as one smear), so only the center CITY x1.00 caption survives below sm. */}
      <div className="mb-1.5 grid grid-cols-[16px_112px_1fr_44px] items-center gap-2 px-0 sm:grid-cols-[18px_130px_1fr_52px] sm:gap-3">
        <span />
        <span />
        <div className="flex items-center justify-center text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)] sm:justify-between">
          {hasHeavier ? <span className="hidden sm:inline">Heavier</span> : null}
          <span className="text-[var(--c-ink2)]">City x1.00</span>
          {hasLighter ? <span className="hidden sm:inline">Lighter</span> : null}
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
            const target = (Math.abs(dev) / maxDev) * span;
            const animate = mounted && !reduced;
            // rest at the real width for SSR / no-JS / reduced-motion / already-seen;
            // collapse to 0 only while mounted + animating + not-yet-in-view.
            const w = animate && !seen ? 0 : target;
            return (
              /* max-w-none, AND IT IS NOT COSMETIC. A global readability rule caps
                 every list item inside main at the prose measure, 68ch, which is
                 right for a paragraph and wrong for a chart row. Measured at 1280
                 on 2026-08-24: this strip lost 317px of a 1038px track to it, so a
                 third of the page's hero chart was unusable and the axis captions
                 sat well to the right of the axis they name. The rule has zero
                 specificity by design, so declaring a width here is the intended
                 way out. Prose lists on these pages keep the measure. */
              <li key={d.slug} className="max-w-none">
                <button
                  type="button" onClick={() => onSelect(d.slug)} aria-pressed={sel}
                  className="nerow -mx-2 grid w-[calc(100%+1rem)] grid-cols-[16px_112px_1fr_44px] items-center gap-2 rounded-md px-2 py-1.5 text-left sm:grid-cols-[18px_130px_1fr_52px] sm:gap-3"
                >
                  <Fig className={`text-[length:var(--t-body)] ${focal ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{i + 1}</Fig>
                  <span className={`min-w-0 truncate text-[length:var(--t-body)] ${sel ? "font-semibold text-[var(--c-ink)]" : "font-medium text-[var(--c-ink2)]"}`}>
                    {d.name}
                  </span>
                  <div className="relative h-[14px]" role="img" aria-label={`${d.name}: rent x${rent.toFixed(2)} the city rate, ${lighter ? "lighter than" : "heavier than"} the city`}>
                    {/* mid track */}
                    <div className="absolute top-1/2 h-px w-full -translate-y-1/2" style={{ background: "#efeae6" }} />
                    {/* the city x1.00 line , the single most important reference on the page */}
                    {/* CLAMPED AT THE ENDS. Moving the axis to an edge put a
                        centred mark half outside the box: the line lost half its
                        width at 100%, and the selection ring below lost 6.5 of
                        its 13px. Both are pinned inside instead of centred on
                        their own value. */}
                    <div
                      className="absolute inset-y-0 w-px"
                      style={{
                        left: `${axis}%`,
                        transform: `translateX(${axis >= 100 ? "-100%" : axis <= 0 ? "0" : "-50%"})`,
                        background: "#b9b1ab",
                      }}
                    />
                    {/* divergence fill from the center */}
                    <div
                      className="absolute top-1/2 h-[9px] -translate-y-1/2 rounded-[2px]"
                      style={{
                        left: lighter ? `${axis}%` : `${axis - w}%`,
                        width: `${w}%`,
                        background: focal ? TERRA : "#c8c2bd",
                        transition: animate ? "width .6s cubic-bezier(.2,.7,.2,1), left .6s cubic-bezier(.2,.7,.2,1)" : "none",
                      }}
                    />
                    {/* selection: a neutral ink ring at the bar tip */}
                    {sel ? (
                      <span
                        className="absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                        style={{
                          left: `clamp(6.5px, ${lighter ? axis + w : axis - w}%, 100% - 6.5px)`,
                          background: "#1b1b1a", boxShadow: "0 0 0 1px #e3e3e3",
                          transition: animate ? "left .6s cubic-bezier(.2,.7,.2,1)" : "none",
                        }}
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
    </HoodCard>
  );
}

/* (the explorer chip rail was REMOVED , Final Ascent audit "district-chips" merge
 * verdict: three redundant selectors for one state. The strip rows and the map pins
 * both select; the chapter-03 compare picker keeps the one chip rail on the page.) */

/* ============================================================================
 * WHY THE NUMBER MOVES , an explicit MULTIPLICATIVE readout. City starts at 1.00;
 * each factor multiplies the RUNNING total, and the net is the modeled result. The
 * printed multipliers carry it: the length-encoded tracks were dropped under the bar
 * ration (rulebook v1 §25 + §26, a lone number may stay a number). Schematic only, no
 * glued explanatory paragraph (§26); the block is SampleTagged and self-omits when
 * every factor sits at x1.00 (its caller gates on `factorsMove`), so a column of
 * x1.00s that says nothing never renders (§7).
 * ========================================================================== */
function MultWaterfall({ d }: { d: District }) {
  const steps = [
    { label: "City average", mult: 1, isCity: true },
    { label: "Commuter footfall", mult: d.commuter_mult, isCity: false },
    { label: "Visitor footfall", mult: d.tourism_mult, isCity: false },
    { label: "Area character", mult: d.tag_mult, isCity: false },
  ];
  const net = 1 + d.rev_vs_city_pct / 100; // the modeled result the city page ships
  return (
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
      {/* net row , the modeled result, in ink: the panel header rent figure carries
          the accent, so the readout stays neutral proof */}
      <div className="mt-1 flex items-center justify-between gap-2.5 border-t border-[var(--c-border)] pt-2">
        <span className="text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">Net vs city</span>
        <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">x{net.toFixed(2)}</Fig>
      </div>
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

/* WALKABILITY , a single NEUTRAL marker on a two-end labeled track (ink marker, grey
 * track, no fill). Walkability is support context, not the box's answer, so it never
 * wears the accent (rulebook v2 §37: terracotta on the rent figure only), and it reads
 * as a marker-on-a-track, not a filled bar that fakes an answer (FORM-CATALOG Meter
 * do-not; also keeps the page's ONE fill bar, the rent strip, within the §25 budget). */
function WalkTrack({ value }: { value: number }) {
  const pos = Math.max(4, Math.min(96, value));
  return (
    <div>
      <div className="relative h-2 rounded-full" role="img" aria-label={`walkability marker on a low to high foot-traffic scale`} style={{ background: "#e6e6e6" }}>
        <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: "var(--c-ink)", boxShadow: "0 0 0 1px #e3e3e3" }} />
      </div>
      <div className="mt-1 flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>Low foot traffic</span><span>High foot traffic</span></div>
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
  // self-omit the multiplier readout when every factor rounds to x1.00 (a column of
  // x1.00s says nothing, rulebook v2 §7); it renders only when a factor actually moves.
  const factorsMove = [d.commuter_mult, d.tourism_mult, d.tag_mult].some((m) => m.toFixed(2) !== "1.00");

  return (
    /* THE ONE EDITORIAL SECTION ON THIS PAGE (art direction E1). What a district
       is actually like, its markets and who has moved in, is a written read and
       not a measurement, and cutting it to the prose budget would cut the only
       human voice on a page made of multiples. Capped at one per page, so a
       second one here would fail rather than compound. */
    <HoodCard data-editorial="1" className="overflow-hidden lg:sticky lg:top-6">

      {/* HEADER STRIP , the decision. Rent load is the hero (largest); it wears the
          panel's ONE terracotta only when it runs below the city x1.00 (terra keeps
          one meaning: the light-lease answer side), else ink. Revenue is grey support.
          Plain card surface, no warm wash (tokens only, §38). */}
      <div className="px-5 pt-4 pb-4">
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

        {/* no verdict line: the finding lives on the visual (the 48px rent figure + its
            lighter/heavier word, rulebook v2 §14). The old derived conclusion is cut. */}
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
        {/* WHY THE NUMBER MOVES , the modeled multiplier readout (SampleTagged, §4).
            Self-omits when every factor rounds to x1.00 (nothing to explain, §7). */}
        {factorsMove ? (
          <div>
            <div className="mb-1 flex items-end justify-between gap-3">
              <SectionLabel sample>Why the number moves</SectionLabel>
              <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">x{(1 + d.rev_vs_city_pct / 100).toFixed(2)}</Fig>
            </div>
            <MultWaterfall d={d} />
          </div>
        ) : null}

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
                <div><SectionLabel>Walkability</SectionLabel><WalkTrack value={walkVal(d)} /></div>
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
          <Expand name={grp} title={<>What locals know <SampleTag /></>} right={isReviewBuild() ? undefined : <LockPill label="Pro" />}>
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
        <a href={d.cell_href} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[length:var(--t-body)] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--c-ink)" }}>
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

/* Trade wording -> a TRADE SLUG. Keyword match, no new taxonomy; a miss simply
 * renders no link.
 *
 * These were whole hardcoded paths, "/gb/london/dental-practices" and five
 * more, described by their own comment as "modeled London cell route". This
 * component renders on every city's neighbourhood page, so a reader looking at
 * the districts of Madrid or Osaka was told what works there and handed
 * London. The place arrives as a prop now, from the datum the page was built
 * from, and a card with no place does not link at all.
 *
 * cafes-coffee was an alias too; cafes-coffee-shops is the canonical slug. */
const TRADE_ROUTES: Array<[RegExp, string]> = [
  [/dental/i, "dental-practices"],
  [/gym|fitness/i, "sports-fitness"],
  [/grocer/i, "grocery-stores"],
  [/restaurant/i, "restaurants"],
  [/\bbar\b|nightclub/i, "bars-nightclubs"],
  [/cafe|coffee/i, "cafes-coffee-shops"],
];
const tradeHref = (name: string, placePrefix?: string | null) => {
  if (!placePrefix) return undefined;
  const slug = TRADE_ROUTES.find(([re]) => re.test(name))?.[1];
  return slug ? `${placePrefix}/${slug}` : undefined;
};

function UnderMapCard({ d, placePrefix }: { d: District; placePrefix?: string | null }) {
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
              const href = tradeHref(t.name, placePrefix);
              const body = (
                <div className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">
                  {t.name}
                  {href ? <span aria-hidden className="ml-1 text-[var(--c-muted)]">&#8594;</span> : null}
                </div>
              );
              return (
                <li key={t.name} className="flex max-w-none gap-3">
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
                  <li key={s} className="flex max-w-none items-center gap-2 text-[length:var(--t-body)] text-[var(--c-ink2)]"><span className="h-1 w-1 shrink-0 rounded-full" style={{ background: "#8f8f8d" }} />{s}</li>
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
export function NeighborhoodExplorer({ districts, defaultSlug, rail, mapNote, placePrefix }: { districts: District[]; defaultSlug?: string; rail?: Rail2; mapNote?: string; placePrefix?: string | null }) {
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
    /* THE SUB-LABEL IS THE DISTRICT'S PLACE IN THE RANKING, not its side of the
       city rate, and the reason is measured rather than stylistic.

       It used to read "rent runs lighter/heavier than the city". Every London
       district is above the city rate, so all seven chips read the SAME SEVEN
       WORDS, and London is the only city in the repository that carries
       districts at all: counted 2026-08-24, eleven other cities return none. So
       that label was identical for every district on every page it can appear
       on. Rulebook v2 §7, a grade that reads the same for everyone is noise.

       Worse, it contradicted the page around it. The masthead leads with "RENT
       RUNS LIGHTEST, x1.20 South London" and the strip beneath is "ranked by
       rent load, lightest first" , and then South London's own chip said rent
       runs HEAVIER. Both were true against different reference points and no
       reader can hold that.

       Rank is not a new metric (§0): it is the strip's own row number, which is
       already on the page directly above these chips. The multiple is not
       repeated here because the pin already carries it as its figure and the
       strip carries it for every row. */
    const order = [...districts].sort((a, b) => a.rent_mult - b.rent_mult).map((d) => d.slug);
    const total = order.length;
    const ordinal = (n: number) => {
      const t = n % 100;
      const suffix = t >= 11 && t <= 13 ? "th" : n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th";
      return `${n}${suffix}`;
    };
    return withGeo.map((d) => {
      const rent = d.rent_mult;
      const rank = order.indexOf(d.slug) + 1;
      const place =
        rank === 1 ? `lightest of ${total}`
        : rank === total ? `heaviest of ${total}`
        : `${ordinal(rank)} lightest`;
      return {
        name: d.name, slug: d.slug, lat: d.lat as number, lng: d.lng as number,
        signal: 20 + ((hi - rent) / span) * 80, // lightness of the lease, on the 0..100 dot-size scale
        signalLabel: `rent x${rent.toFixed(2)}`,
        sub: rank > 0 ? place : undefined,
        tone: rent < 1 ? ("terra" as const) : ("ink" as const),
      };
    });
  }, [districts]);

  return (
    <div>
      <NeStyles />
      <Rail icon="best-areas" tone="terra" kicker={rail?.kicker ?? "Where in the city"} verdict={rail?.verdict} />

      {/* THE STRIP PAIRS WITH THE WHAT-WORKS CARD. It was the last full-width
          section on any of the four pages: seven ranked rows taking the whole
          column, which is the sweep the founder banned. The two are close in
          height, 312px against 193px measured, so neither leaves a crater beside
          the other, and the card moves out of the map column where it was only
          ever ballast. Art direction D1, D4, E2.

          The map keeps the detail panel, which is the pairing that earns its
          keep: selecting a pin drives the panel, and both are tall. */}
      <Band split="3-2">
        <RentStrip districts={districts} selected={selected} onSelect={setSelected} reduced={reduced} />
        <UnderMapCard d={current} placePrefix={placePrefix} />
      </Band>

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
              /* THE LEGEND ONLY NAMES A COLOUR THAT IS ON THE MAP. Terracotta
                 marks a district below the city rate, and no London district is,
                 so the legend promised a colour a reader could never find. It is
                 built from the points rather than typed. */
              legendLabel={
                points.some((p) => p.tone === "terra")
                  ? "Dot size = how light the rent runs; terracotta = lighter than the city"
                  : "Dot size = how light the rent runs; the biggest dot is the lightest lease"
              }
            />
          </div>
          {mapNote ? <p className="max-w-[56ch] px-1 pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{mapNote}</p> : null}
        </div>
        <DetailPanel d={current} reduced={reduced} />
      </div>
    </div>
  );
}

/* ============================================================================
 * MYTH CHAPTER , its own chapter. The moat POV rendered the ratified way (rulebook
 * v2 §30): the myth is struck ON the chart, never in a text box beside it. A RANK
 * SLOPE carries the counter-evidence , every district's revenue rank on the left,
 * rent rank on the right (1 = lightest lease), one solid line each. The loudest
 * district's fall is the ONE terracotta line. A dashed, struck PHANTOM line draws
 * the myth's own assumption (top revenue would also be the lightest lease, flat at
 * rank 1) and crosses it out; the real terracotta line drops away from it. No prose
 * claim, no reality paragraph, no verdict footer (§14/§15/§19/§26). Lines render at
 * REST, fully drawn (no draw-on-scroll: a static capture must always show them).
 * ========================================================================== */
function RankSlope({ districts, loudSlug, strikeLabel }: { districts: District[]; loudSlug: string; strikeLabel?: string }) {
  const byRev = [...districts].sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct);
  const byRent = [...districts].sort((a, b) => a.rent_mult - b.rent_mult);
  const revRank = new Map(byRev.map((d, i) => [d.slug, i + 1] as const));
  const rentRank = new Map(byRent.map((d, i) => [d.slug, i + 1] as const));
  // the two lines a phone still names: the loudest (the myth's subject) + the lightest lease.
  const lightestSlug = byRent[0]?.slug;
  const n = districts.length;
  const W = 400, rowH = 24, top = 34, H = top + n * rowH + 4;
  const xL = 128, xR = 272;
  const y = (rank: number) => top + (rank - 0.5) * rowH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`Rank slope: revenue rank against rent rank for ${n} districts, rent rank 1 being the lightest lease. ${byRev[0]?.name} holds revenue rank 1 but rent rank ${rentRank.get(byRev[0]?.slug ?? "") ?? n}, so the myth that the top-revenue district is also the lightest lease is struck out.`}>
      {/* column headers , the two ends of the slope, named */}
      <text x={xL - 10} y={16} textAnchor="end" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>Revenue rank</text>
      <text x={xR + 10} y={16} textAnchor="start" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>Rent rank</text>
      {/* the two rank rails */}
      <line x1={xL} y1={top - 8} x2={xL} y2={H - 4} stroke="#e7e2df" strokeWidth={1} />
      <line x1={xR} y1={top - 8} x2={xR} y2={H - 4} stroke="#e7e2df" strokeWidth={1} />
      {/* THE MYTH, STRUCK ON THE CHART (§30): the flat line the myth assumes , top
          revenue would sit at rent rank 1 too , dashed, crossed out. The real
          terracotta line drops away from it. */}
      {strikeLabel ? (
        <g aria-hidden="true">
          {/* ONE STRIKE, ON ONE OBJECT. This carried THREE devices for a single
              idea: a dashed line, a diagonal slash across it, and a caption with a
              line through the text as well. Founder, 2026-08-25: "you just create
              like a text and you slap like a line on top of it, what the fuck is
              that." He was describing exactly that pile.

              §30 says strike the CLAIM on the chart. The claim here IS the dashed
              line, the flat rank-1 path the myth assumes, so the slash strikes the
              line and the caption NAMES it. A struck caption over a struck line
              strikes the same thing twice and reads as a mistake rather than a
              finding. The caption also moves off the middle of the plot, where it
              floated in whitespace with nothing to attach to, and sits at the end
              of the line it labels. */}
          <line x1={xL} y1={y(1)} x2={xR} y2={y(1)} stroke="var(--c-line-strong)" strokeWidth={1.4} strokeDasharray="3 3" strokeLinecap="round" />
          {/* THE STRIKE MUST NOT LOOK LIKE DATA. At the same weight and colour as
              a district's line it read as an eighth district running at a shallow
              angle, which is the opposite of cancelling something. It is shorter,
              steeper and inked now, so it crosses the claim rather than joining
              the chart. */}
          <line x1={(xL + xR) / 2 - 34} y1={y(1) + 9} x2={(xL + xR) / 2 + 34} y2={y(1) - 9} stroke="var(--c-ink)" strokeWidth={2} strokeLinecap="round" />
          <text x={(xL + xR) / 2} y={y(1) - 10} textAnchor="middle" fontSize={8.5} fill="var(--c-muted)">{strikeLabel}</text>
        </g>
      ) : null}
      {districts.map((d) => {
        const loud = d.slug === loudSlug;
        const r1 = revRank.get(d.slug) ?? n, r2 = rentRank.get(d.slug) ?? n;
        const y1 = y(r1), y2 = y(r2);
        const stroke = loud ? TERRA : "#c9c4bf";
        const ink = loud ? "var(--terra-text)" : "#1b1b1a";
        // below sm only the two lines that carry the story get a label (first-word
        // names at a readable 12px); the rest scale to ~4px smears at phone width,
        // so the dots + lines draw the flip and the labels carry the two anchors.
        const nameMobile = loud || d.slug === lightestSlug;
        const firstWord = d.name.split(" ")[0];
        return (
          <g key={d.slug}>
            <text className="hidden sm:block" x={xL - 10} y={y1 + 3.5} textAnchor="end" fontSize={11}>
              <tspan fill="#8c8c8a" fontSize={10} style={{ fontFamily: "var(--font-grotesk)", fontVariantNumeric: "tabular-nums" }}>{r1}  </tspan>
              <tspan fill={ink} fontWeight={loud ? 600 : 500}>{d.name}</tspan>
            </text>
            {nameMobile ? (
              <text className="sm:hidden" x={xL - 10} y={y1 + 4} textAnchor="end" fontSize={12} fill={ink} fontWeight={loud ? 600 : 500}>{firstWord}</text>
            ) : null}
            {/* solid line, rendered at rest (no dash-offset draw-on-scroll: it must
                always show, or the chart reads as two disconnected rank lists) */}
            <line x1={xL} y1={y1} x2={xR} y2={y2} stroke={stroke} strokeWidth={loud ? 2.2 : 1.4} strokeLinecap="round" />
            <circle cx={xL} cy={y1} r={2.4} fill={loud ? TERRA : "#8f8f8d"} />
            <circle cx={xR} cy={y2} r={2.4} fill={loud ? TERRA : "#8f8f8d"} />
            {/* EVERY NAME ONCE. Both columns printed all seven names, so this one
                chart supplied fourteen of the page's repeats and was most of the
                reason "South London" appeared ten times on it. The left column is
                the reader's index and keeps rank plus name; the right column is
                the same districts re-ordered, so a rank alone says everything the
                line does not, and only the two anchors that carry the finding, the
                loudest takings and the lightest lease, keep a name. Art direction
                H3, H4. */}
            <text className="hidden sm:block" x={xR + 10} y={y2 + 3.5} textAnchor="start" fontSize={11}>
              <tspan fill="#8c8c8a" fontSize={10} style={{ fontFamily: "var(--font-grotesk)", fontVariantNumeric: "tabular-nums" }}>{r2}</tspan>
              {nameMobile ? <tspan fill={ink} fontWeight={loud ? 600 : 500}>{"  " + d.name}</tspan> : null}
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

/* one anchor case for the myth chapter's right column: the district name + its two
 * ranks, schematic (labels + rank figures, §19), neutral (the chart carries the one
 * terracotta line). Names the two extremes the slope draws so the flip reads concretely. */
function AnchorCase({ label, name, rows }: { label: string; name: string; rows: Array<[string, string]> }) {
  return (
    <div className="rounded-[12px] border border-[var(--c-border)] bg-[var(--c-soft)] px-3.5 py-3">
      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{label}</div>
      <div className="mt-0.5 text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{name}</div>
      <div className="mt-2 flex items-center gap-5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-1.5">
            <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{k}</span>
            <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{v}</Fig>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MythChapter({ myth, loudest, districts = [] }: { myth: Myth; loudest: District; districts?: District[] }) {
  const list = districts.length ? districts : [loudest];
  // ranks computed once so the schematic anchor cases match the chart exactly.
  const byRev = [...list].sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct);
  const byRent = [...list].sort((a, b) => a.rent_mult - b.rent_mult);
  const n = list.length;
  const revRankOf = (slug: string) => byRev.findIndex((d) => d.slug === slug) + 1;
  const rentRankOf = (slug: string) => byRent.findIndex((d) => d.slug === slug) + 1;
  const lightest = byRent[0];
  const strikeLabel = myth.strike_label ?? "the loudest is the best place";
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--c-border)]" style={CARD_SURFACE}>
      <div className="p-5 md:p-6">
        <Rail icon="myth-reality" kicker="Revenue rank vs rent rank" sample />
        {/* THE STATS SIT UNDER THE CHART, NOT BESIDE IT. This card used to hold the
            whole column, so a 1.5-to-1 internal split still left the slope 620px.
            In a half band that same split leaves it 320px for nine labelled points
            and two rank rails, which is not a chart any more. The card's own width
            goes to the drawing and the two reads take a row beneath it, which is
            also the anatomy the art direction asks for: the visual, then what it
            says. */}
        <div className="grid gap-5">
          {/* the chart carries the takeaway silently: one line per district, the myth
              struck on it, the loudest district's real drop in terracotta */}
          {/* NO BOX INSIDE THE BOX. The chart sat in its own bordered, filled card
              inside the section's bordered, filled card: two edges around one
              drawing, which is the "you have just boxed it" defect (art direction
              A5). The chart keeps its padding and loses its frame. */}
          <div className="p-1">
            <RankSlope districts={list} loudSlug={loudest.slug} strikeLabel={strikeLabel} />
          </div>
          {/* the flip at the two extremes, schematic (the finding on the visual,
              §14). Side by side beneath the chart rather than stacked beside it:
              two short reads in a row read as a pair, and stacked in a narrow
              column they read as a list of two. */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AnchorCase label="Loudest takings" name={loudest.name} rows={[["Revenue", `#${revRankOf(loudest.slug)}`], ["Rent", `#${rentRankOf(loudest.slug)} of ${n}`]]} />
            <AnchorCase label="Lightest lease" name={lightest.name} rows={[["Rent", `#${rentRankOf(lightest.slug)}`], ["Revenue", `#${revRankOf(lightest.slug)} of ${n}`]]} />
          </div>
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
  /** modeled or footfall-derived , renders a SampleTag beside the row label (§4) */
  sample?: boolean;
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
  { key: "rev", label: "Revenue vs city", hint: "modeled takings", get: (d) => d.rev_vs_city_pct, fmt: (d) => `${d.rev_vs_city_pct >= 0 ? "+" : ""}${d.rev_vs_city_pct}%`, higherIsBetter: true, sample: true },
];
const PRO_METRICS: Metric[] = [
  // no higherIsBetter: a weekday-led week is not better or worse, so no best crown.
  { key: "lean", label: "Weekday dependence", hint: "how lopsided the week is", get: (d) => weekdayLean(d), fmt: (d) => `${weekdayLean(d)}% weekday`, sample: true },
  { key: "walk", label: "Walkability", hint: "low to high foot traffic", get: (d) => walkVal(d), fmt: (d) => `${walkVal(d)}`, higherIsBetter: true },
  { key: "weekend", label: "Weekend footfall", hint: "trade intensity", get: (d) => footVal(d).weekend, fmt: (d) => `${footVal(d).weekend}`, higherIsBetter: true, sample: true },
];

/* the row-best mark. The .fig class pins every figure to weight 600, so "bold" cannot
 * differentiate the winner (it is already 600); the winner is marked by COLOR instead,
 * solid ink (terracotta on the deciding rent-load row), while the losers of a crowned
 * metric dim to muted. A metric with no better direction (weekday lean) crowns nobody,
 * so all its cells stay ink. The legend under the table describes exactly this. */
const DECIDER_KEY = "rent";
function cellClass(m: Metric, win: boolean, crowned: boolean): string {
  if (win) return m.key === DECIDER_KEY ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]";
  return crowned ? "text-[var(--c-muted)]" : "text-[var(--c-ink)]";
}
function bestFor(m: Metric, cols: District[]): string | null {
  if (m.higherIsBetter == null || cols.length < 2) return null;
  let bd = cols[0];
  cols.forEach((d) => { if (m.higherIsBetter ? m.get(d) > m.get(bd) : m.get(d) < m.get(bd)) bd = d; });
  return bd.slug;
}

/* one pass per metric: label (+ SampleTag when modeled) + hint + plain figures, the
 * row-best marked by color. The old three-pass render (free rows with in-cell bars,
 * ungated bar-only Pro rows, veiled figure-only Pro rows) collapsed under rulebook v1
 * §25 (bar ration) + §22 (a table is skimmable at a glance). */
function MetricRows({ metrics, cols }: { metrics: Metric[]; cols: District[] }) {
  return (
    <>
      {metrics.map((m) => {
        const best = bestFor(m, cols);
        const crowned = best != null;
        return (
          <div key={m.key} className="grid items-center gap-3 border-b border-[var(--c-border)] px-4 py-2.5 last:border-0" style={{ gridTemplateColumns: `minmax(0,1.3fr) repeat(${cols.length}, minmax(0,1fr))` }}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)]">{m.label}</span>
                {m.sample ? <SampleTag /> : null}
              </div>
              <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{m.hint}</div>
            </div>
            {cols.map((d) => {
              const win = best === d.slug && cols.length > 1;
              return (
                <div key={d.slug} className="min-w-0">
                  <Fig className={`text-[length:var(--t-body)] ${cellClass(m, win, crowned)}`}>{m.fmt(d)}</Fig>
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
   * row-best figures (color-marked), never asserted above it. */

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
              {/* selection is the ink fill + white text only; no accent glyph on chrome (§37) */}
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
                {!isReviewBuild() ? <LockPill label="Pro" /> : null}
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
                  const best = bestFor(m, cols);
                  const win = best === d.slug && cols.length > 1;
                  return (
                    <div key={m.key} className="flex items-center justify-between gap-2.5">
                      <span className="flex min-w-0 items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]">{m.label}{m.sample ? <SampleTag /> : null}</span>
                      <Fig className={`text-right text-[length:var(--t-body)] ${cellClass(m, win, best != null)}`}>{m.fmt(d)}</Fig>
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
                    {!isReviewBuild() ? <LockPill label="Pro" /> : null}
                  </div>
                  <div className="pb-1 pt-1">
                    <LockVeil unlocked={isReviewBuild()} headline="The full differential" note={proNote} cta="Compare with Pro">
                      <div className="min-h-[172px] space-y-2">
                        {proMetrics.map((m) => {
                          const best = bestFor(m, cols);
                          const win = best === d.slug && cols.length > 1;
                          return (
                            <div key={m.key} className="flex items-center justify-between gap-2.5">
                              <span className="flex min-w-0 items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]">{m.label}{m.sample ? <SampleTag /> : null}</span>
                              <Fig className={`text-right text-[length:var(--t-body)] ${cellClass(m, win, best != null)}`}>{m.fmt(d)}</Fig>
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
    </div>
  );
}
