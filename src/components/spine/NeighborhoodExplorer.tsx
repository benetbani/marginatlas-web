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
 * As-built chart dictionary (perceptual idiom census; the visual-idea budget of the
 * form catalogue, which replaced the bar budget of rulebook v1 §25):
 *   ranked columns from a drawn zero (I2, the only DECLARED idea on this page):
 *     DistrictRents x1  , the page hero, and A7 of the subsection queue. It was
 *     seven horizontal tracks and an undeclared I1 seven times over.
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
import { Ico, Fig, Chip, Rail, Expand, TERRA, InfoTip, InlineDisclosure, SampleTag, CARD_SURFACE, Band } from "@/components/spine/kit";
import { LollipopColumn } from "@/components/spine/forms-v2";
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
/* A CARD'S TITLE HAS TO BE A HEADING. Measured 2026-08-26 across the four pages:
   six cards carry a title that is a styled div, so the heading outline skips them
   entirely , a screen reader's heading list, a crawler's structure, any summary.
   Four of the six are on this page. The city page has none, which is what makes it
   an inconsistency rather than a house style.

   The prop exists because only SOME of these are card titles. "Walkability" and
   "Price tier" label blocks INSIDE a card and would be wrong as headings: they
   would announce sections that do not exist. So the element is chosen at the call
   site, and the default stays a div, which is what the inner labels want. */
function SectionLabel({ children, sample, as: Tag = "div" }: { children: React.ReactNode; sample?: boolean; as?: "div" | "h3" }) {
  return (
    <Tag data-typography="custom" className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">
      {children}
      {sample ? <span className="ml-1.5 inline-flex align-middle"><SampleTag /></span> : null}
    </Tag>
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
 * DISTRICT RENTS , the page's ranked reading, and A7 OF THE SUBSECTION QUEUE.
 *
 * WARRANT (procedure step 1). A visitor reads this to decide WHICH DISTRICT OF
 * THIS CITY TO GO LOOKING FOR A UNIT IN, given what they can carry in rent.
 * Without it they would have the lightest district from the masthead and nothing
 * about the six behind it, so they could not tell a city whose districts sit
 * close together from one that doubles in a step. London does the second: two
 * districts sit within a tenth of the cheapest and then the ladder jumps.
 *
 * WHAT WAS HERE, AND WHY IT HAD TO GO. Seven horizontal tracks, one per
 * district, each with a fill and a marker on it, hand-rolled inline so none
 * carried a data-idea and no budget could see them: the catalogue addendum's
 * "where the sameness actually lives", and the same drawing the city page shed
 * one altitude up on 2026-09-02 (A6). Seven against an I1 cap of two. A track is
 * the right drawing for a POSITION BETWEEN TWO NAMED POLES; this one had one
 * named end, the city rate, and its other end was whatever the widest deviation
 * happened to be, which is not a pole a district could reach.
 *
 * IT IS THE SAME FORM AS A6, ON PURPOSE (procedure step 9). The city page ranks
 * districts by rent load in a LollipopColumn, cheapest first, and a reader who
 * has learned that shape one altitude up meets it here meaning the same thing.
 * The stems rise from a TRUE ZERO, which a rent multiple has: x2.40 really is
 * twice x1.20, so a stem twice as tall is a true statement. Rule 29A is satisfied
 * by the ORDER rather than by an inversion, cheapest first (founder D1), so the
 * one accent lands on entry one, the lightest lease, the good end.
 *
 * THIS CARD IS ALSO THE PAGE'S PICKER, WHICH A6'S WAS NOT, and it is the one
 * thing A7 could not inherit. The card beside it reads "What works in
 * <district>" and the panel below it holds that district's detail, so the
 * ranking is how a reader changes them. The form takes the two props for it, and
 * the picked column gains no MARK: its name goes semibold ink, because every
 * mark in this drawing is a value and a selection ring would read as one more
 * (the strip this replaced had that exact fault corrected once already).
 *
 * WHAT THE CARD STATES AND WHAT IT DOES NOT. The masthead states the LIGHTEST
 * district and its multiple, so this card never restates it, which is the same
 * call A6 made against the city page's verdict card. What nothing else on the
 * page states is the far end: the masthead deliberately deleted its heaviest
 * panel because this card showed it. So the finding line names the heaviest
 * district and how many times the lightest lease it runs, which is one figure
 * and one name, both stated once on the page.
 * ========================================================================== */
function DistrictRents({ districts, selected, onSelect }: { districts: District[]; selected: string; onSelect: (s: string) => void }) {
  // ONE order page-wide: rent load ascending, lightest lease first (founder D1).
  const rows = React.useMemo(
    () => [...districts].sort((a, b) => a.rent_mult - b.rent_mult),
    [districts]
  );
  const lightest = rows[0];
  const heaviest = rows[rows.length - 1];
  /* THE FINDING IS THE SPREAD, and it is arithmetic on two figures already on
     screen rather than a new measurement. It is never a zero and it differs for
     every city, unlike the tally it replaced long ago ("0 run lighter than the
     city, 7 heavier"). It NAMES the heaviest district because this is now the
     only place on the page that does, and because at phone width the drawing
     shows five of seven and the two it drops are the dear end. */
  const spread =
    lightest && heaviest && lightest.rent_mult > 0 && rows.length > 1
      ? heaviest.rent_mult / lightest.rent_mult
      : null;

  const asMult = (v: number) => `x${v.toFixed(2)}`;
  const entries = rows.map((r) => ({ name: r.name, value: r.rent_mult }));
  const picked = rows.findIndex((r) => r.slug === selected);

  return (
    <HoodCard id="strip" className="p-4">
      {/* THE HEAD ROW, ONE BASELINE, EDGE TO EDGE: what the ranking is ordered by
          at the left, what it found at the right. The two share a baseline so the
          eye reads them as one line rather than as a title above a sentence, and
          together they span the card, which is what keeps the quietest row of the
          card from being a half-empty one.
          IT STACKS BELOW sm. At 343px the label runs three lines and the finding
          two, and side by side that is a column of caps beside a column of prose
          with a ragged gutter between them. Stacked, each takes the full measure
          and neither wraps more than twice. */}
      {/* THE GAPS ARE 16 AND NOT 12, and the card's padding is 16 and not 14.
          Both were off the spacing ladder, which runs 48 / 32 / 28-20-16 / 8 with
          no value between rungs, and both are the third and fourth instance of
          the same fault this loop has found in a form: StepLadder's rung gap was
          14 and ClearanceRing's caption gap was 12. Nearly-equal reads as a
          mistake rather than as a decision, which is the worse of the two. */}
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <SectionLabel as="h3">Ranked by rent load, lightest first</SectionLabel>
        {spread && heaviest ? (
          <span className="mb-2 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)] sm:mb-0 sm:shrink-0">
            {heaviest.name} runs <Fig className="font-semibold text-[var(--c-ink)]">{spread.toFixed(1)}</Fig> times the lightest lease
          </span>
        ) : null}
      </div>

      {/* FIVE COLUMNS BELOW lg, ALL SEVEN ABOVE IT, and the count is measured at
          THIS card's own width rather than copied from the city page's. At 375
          this card is 311px inside its padding: seven columns are 38px each and
          the word "London" alone is 46px, so every name would break mid-word.
          Five are 57px, which clears the longest word in the set. */}
      <LollipopColumn
        rows={entries}
        format={asMult}
        narrowCount={5}
        selectedIndex={picked >= 0 ? picked : undefined}
        onSelect={(i) => { const r = rows[i]; if (r) onSelect(r.slug); }}
        ariaLabel="Districts ranked by commercial rent, lightest first"
      />

      {/* THE FOOT IS ONE ROW, both halves chrome, one at each edge, spanning what
          the drawing above it spans. The unit rides here rather than in the head,
          which is where A6 put it, because this card's head row is already two
          objects and a third would crowd it; the words are the city page's words
          so a reader meets the same gloss in both places.
          WHAT EACH DISTRICT IS, kept rather than dropped: the character line used
          to sit under every track, and a column has one line of label, which
          belongs to the name. It is text and not a graphic, so a disclosure is
          where it is allowed to live (rulebook v2 S6). It also holds every
          district in order, which is the phone reader's route to the two the
          drawing drops. */}
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <InlineDisclosure name="districts" summary="What each district is" className="group min-w-0">
          <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
            {rows.map((r) => (
              <div key={r.slug} className="flex items-baseline justify-between gap-3 py-1.5">
                <span className="text-[length:var(--t-micro)] text-[var(--c-ink)]">{r.name}</span>
                <span className="text-[length:var(--t-micro)] text-[var(--c-ink2)]">{r.character}</span>
              </div>
            ))}
          </div>
        </InlineDisclosure>
        <span className="shrink-0 text-[length:var(--t-micro)] text-[var(--c-muted)]">
          rent, x the city level
          <InfoTip gloss="The district&#39;s commercial rent as a multiple of the city-average level; x1.00 is the city average." />
        </span>
      </div>
    </HoodCard>
  );
}

/* (the explorer chip rail was REMOVED , Final Ascent audit "district-chips" merge
 * verdict: three redundant selectors for one state. The ranking columns and the map pins
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
    /* HAIRLINE RULES BETWEEN ROWS (F3), because this is a table of labels and
       figures and it was drawn as bare flex rows. With the label hard left and
       the figure hard right and nothing bridging them, a 268 by 198 void opened
       down the middle of the district panel: the largest gathered hole left on
       any of the four pages. The sibling peer table has carried row rules all
       along, which is exactly why it never opened one. */
    <div className="divide-y divide-[var(--c-border)]">
      {steps.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-2.5 py-1.5">
          <span className={`text-[length:var(--t-micro)] ${r.isCity ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>
            {r.label}
            {r.label === "Area character" ? <InfoTip gloss="A modeled premium or discount from what the district is known for: nightlife, luxury, markets." /> : null}
          </span>
          <Fig className="text-right text-[length:var(--t-micro)] text-[var(--c-ink2)]">x{r.mult.toFixed(2)}</Fig>
        </div>
      ))}
      {/* net row , the modeled result, in ink: the panel header rent figure carries
          the accent, so the readout stays neutral proof */}
      <div className="flex items-center justify-between gap-2.5 pt-2">
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
    <HoodCard id="detail" data-editorial="1" className="overflow-hidden lg:sticky lg:top-6">

      {/* HEADER STRIP , the decision. Rent load is the hero (largest); it wears the
          panel's ONE terracotta only when it runs below the city x1.00 (terra keeps
          one meaning: the light-lease answer side), else ink. Revenue is grey support.
          Plain card surface, no warm wash (tokens only, §38). */}
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 data-typography="custom" className="text-[length:var(--t-head)] font-semibold tracking-tight text-[var(--c-ink)]">{d.name}</h3>
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
    <HoodCard id="works" className="mt-4 p-4">
      {trades.length > 0 ? (
        <>
          <SectionLabel as="h3">What works in {d.name}</SectionLabel>
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
                /* NO RANK NUMBER ON A LIST OF ONE. A numbered list holding a single
                   entry tells a reader there is an order to read, and there is not:
                   a lone "1" beside a lone trade promises a second place that never
                   arrives. The rank appears only when there is something to rank. */
                <li key={t.name} className="flex max-w-none gap-3">
                  {trades.length > 1 ? (
                    <Fig className={`mt-px w-4 shrink-0 text-[length:var(--t-body)] ${i === 0 ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{i + 1}</Fig>
                  ) : null}
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
                  /* THE MARKER BELONGS TO THE FIRST LINE. items-center put the dot beside
                     the MIDDLE line of a three-line entry, so a list of one item read as
                     a stray dot floating in a paragraph. The shared Bullets form pins
                     its marker to the first line and this one did not. */
                  <li key={s} className="flex max-w-none items-start gap-2 text-[length:var(--t-body)] text-[var(--c-ink2)]"><span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full" style={{ background: "#8f8f8d" }} />{s}</li>
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
 * THE EXPLORER , the "01" movement body. Rail opener, the ranked district rents
 * (hero), the real map + under-map district card (orientation that earns its
 * pixels), and the disciplined panel. Two selectors only: ranking columns + map
 * pins.
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

      {/* THE RANKING PAIRS WITH THE WHAT-WORKS CARD. It was the last full-width
          section on any of the four pages: seven ranked rows taking the whole
          column, which is the sweep the founder banned. The card also moves out
          of the map column, where it was only ever ballast. Art direction D1,
          D4, E2.

          THE PAIRING IS WHY THE RANKING IS STILL A PICKER. The card beside it is
          named for whichever district is picked, so a ranking with no affordance
          would leave it stranded on a default beside a set of seven. The
          alternative was to leave the page one selector, its map, which needs
          WebGL and a tile fetch before it can draw at all.

          THE SPLIT MOVED FROM 3-2 TO 2-1, AND A PHOTOGRAPH DECIDED IT. Seven
          columns in a 624px card are 79px each, which is one or two pixels under
          what "South London" and "City of London" need at the 12px read floor,
          so those two wrapped to a second line while their neighbours stayed on
          one and the name row went ragged. At 693px the columns are 91px and
          every district in the set sits on one line. The what-works card gives up
          68px for it and loses nothing: it holds a short list and one sentence.

          The map keeps the detail panel, which is the pairing that earns its
          keep: selecting a pin drives the panel, and both are tall. */}
      <Band split="2-1">
        <DistrictRents districts={districts} selected={selected} onSelect={setSelected} />
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
  /* THE DRAWING STRETCHES. THE WORDS DO NOT.

     This was one fixed 400-unit picture handed the card's full width with no
     height of its own, so it scaled UNIFORMLY to whatever it landed in and took
     its text and its dots with it. Measured 2026-08-25: the dots read 5.5px at
     1280 and 3.5px at 375, against a convention that says a dot is 6px at every
     size and that marks do not scale with the box. The column headings rendered
     near six pixels on a phone and the strike caption near five, and the code
     had already conceded the point by hiding five of the seven district names
     below the small breakpoint, because at that size they were smears.

     Same treatment the survival curve on the trade-across-places page was given
     for the same fault: the SVG holds the LINES ONLY and stretches freely with
     non-scaling strokes, the box keeps a true pixel height, and every readable
     thing is real text laid over it at its own size. The horizontal scale is the
     only one that moves, so a rank still lands exactly on its rail.

     What a reader gains beyond the sizes: all seven names come back on a phone.
     They were hidden because they were illegible, not because they were noise,
     and that reason is gone. The right-hand column still shows a rank alone
     except at the two anchors, which is the separate every-name-once decision
     and is untouched. */
  /* THE TWO RAILS ARE FIXED POSITIONS, NOT PLACED VALUES. Every dot sits on one
     of them, so nothing here is centred on a number that could run to the end of
     the scale and hang half outside the card, which is the most repeated visual
     fault in this codebase and has its own check. Naming the two positions once
     says that, and stops a structural rail reading as a placement. */
  const pct = (x: number) => (x / W) * 100;
  const railL = `${100 - pct(xL)}%`;
  const railR = `${pct(xR)}%`;
  const dotL = `${pct(xL)}%`;
  const dotR = railR;
  return (
    <div
      className="relative w-full"
      style={{ height: H }}
      role="img"
      aria-label={`Rank slope: revenue rank against rent rank for ${n} districts, rent rank 1 being the lightest lease. ${byRev[0]?.name} holds revenue rank 1 but rent rank ${rentRank.get(byRev[0]?.slug ?? "") ?? n}, so the myth that the top-revenue district is also the lightest lease is struck out.`}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {/* the two rank rails */}
      <line x1={xL} y1={top - 8} x2={xL} y2={H - 4} stroke="#e7e2df" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <line x1={xR} y1={top - 8} x2={xR} y2={H - 4} stroke="#e7e2df" strokeWidth={1} vectorEffect="non-scaling-stroke" />
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
          <line x1={xL} y1={y(1)} x2={xR} y2={y(1)} stroke="var(--c-line-strong)" strokeWidth={1.4} strokeDasharray="3 3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {/* THE STRIKE MUST NOT LOOK LIKE DATA. At the same weight and colour as
              a district's line it read as an eighth district running at a shallow
              angle, which is the opposite of cancelling something. It is shorter,
              steeper and inked now, so it crosses the claim rather than joining
              the chart. The caption that names it is no longer drawn in here: it
              is real text over the box, so it keeps its size on a phone. */}
          <line x1={(xL + xR) / 2 - 34} y1={y(1) + 9} x2={(xL + xR) / 2 + 34} y2={y(1) - 9} stroke="var(--c-ink)" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </g>
      ) : null}
      {/* solid lines, rendered at rest (no dash-offset draw-on-scroll: they must
          always show, or the chart reads as two disconnected rank lists) */}
      {districts.map((d) => {
        const loud = d.slug === loudSlug;
        const y1 = y(revRank.get(d.slug) ?? n), y2 = y(rentRank.get(d.slug) ?? n);
        return (
          <line key={d.slug} x1={xL} y1={y1} x2={xR} y2={y2} stroke={loud ? TERRA : "#c9c4bf"} strokeWidth={loud ? 2.2 : 1.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        );
      })}
      </svg>

      {/* column headers , the two ends of the slope, named */}
      <span className="absolute text-[length:var(--t-mark)] uppercase leading-none tracking-[0.06em] text-[var(--c-muted)]" style={{ right: `calc(${railL} + 10px)`, top: 8 }}>Revenue rank</span>
      <span className="absolute text-[length:var(--t-mark)] uppercase leading-none tracking-[0.06em] text-[var(--c-muted)]" style={{ left: `calc(${railR} + 10px)`, top: 8 }}>Rent rank</span>

      {strikeLabel ? (
        <span className="absolute -translate-x-1/2 whitespace-nowrap text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]" style={{ left: "50%", top: y(1) - 22 }}>{strikeLabel}</span>
      ) : null}

      {/* EVERY NAME ONCE. The left column is the reader's index and keeps rank plus
          name; the right column is the same districts re-ordered, so a rank alone
          says everything the line does not, and only the two anchors that carry the
          finding, the loudest takings and the lightest lease, keep a name there.
          Both columns once printed all seven, which made this one chart the source
          of fourteen of the page's repeats. Art direction H3, H4. */}
      {districts.map((d) => {
        const loud = d.slug === loudSlug;
        const r1 = revRank.get(d.slug) ?? n, r2 = rentRank.get(d.slug) ?? n;
        const y1 = y(r1), y2 = y(r2);
        const ink = loud ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]";
        const weight = loud ? "font-semibold" : "font-medium";
        const dot = loud ? TERRA : "#8f8f8d";
        const nameRight = loud || d.slug === lightestSlug;
        /* THE WHOLE NAME AT EVERY WIDTH. The first-word shortening was inherited
           from the version that drew its text inside the picture, where a full
           name at phone size was a smear. Applied to all seven rows it collides:
           West End and West London both read "West", South Bank and South London
           both read "South", which is a label reading identically for two
           different things (H3). Measured at 375 the rail leaves about 90px on
           each side and "South London" sets at roughly 72px, so the shortening
           buys nothing and costs the distinction. */
        const Name = <span className={weight}>{d.name}</span>;
        return (
          <React.Fragment key={d.slug}>
            <span className={`absolute flex -translate-y-1/2 items-baseline gap-1.5 whitespace-nowrap text-[length:var(--t-micro)] leading-none ${ink}`} style={{ right: `calc(${railL} + 10px)`, top: y1 }}>
              <Fig className="text-[length:var(--t-mark)] text-[var(--c-muted)]">{r1}</Fig>
              {Name}
            </span>
            {/* 6px at every size (G4), because it is a real element and not a shape
                inside a picture that stretches. */}
            <span aria-hidden className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: dotL, top: y1, background: dot }} />
            <span aria-hidden className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: dotR, top: y2, background: dot }} />
            <span className={`absolute flex -translate-y-1/2 items-baseline gap-1.5 whitespace-nowrap text-[length:var(--t-micro)] leading-none ${ink}`} style={{ left: `calc(${railR} + 10px)`, top: y2 }}>
              <Fig className="text-[length:var(--t-mark)] text-[var(--c-muted)]">{r2}</Fig>
              {nameRight ? Name : null}
            </span>
          </React.Fragment>
        );
      })}
    </div>
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
      {/* THE LABEL SITS ABOVE ITS FIGURE, NOT BESIDE IT. Side by side, these two
          reads fit while this card had a third of a full-width section. Paired on
          a phone they get about 148px each, and "Rent #6 of 7" broke across three
          lines with "of" and "7" alone on their own. A label over its figure is
          the same information in a shape that survives the narrow case, and it
          also puts the figure where B2 wants it: at the start of its own line,
          scanning down the column. */}
      <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <div className="text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">{k}</div>
            <Fig className="text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{v}</Fig>
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
    <div id="ranks" className="overflow-hidden rounded-[14px] border border-[var(--c-border)]" style={CARD_SURFACE}>
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
          <div className="grid grid-cols-2 gap-3">
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
    /* id="compare" sits on the SECTION, not on the table card: the picker and the
       rail are part of what a reader arriving here needs, and the card alone would
       drop both. `ranks` covers its own rail the same way, because there the rail
       is inside the card. */
    <div id="compare">
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
        {/* A CARD WITH NO TITLE. This opened straight onto its own column header,
            so the page outline skipped it and a reader scrolling past had nothing
            to name it by. It is not an invented title: the city page carries the
            identical form under "Peer cities, side by side", so this is the same
            naming already in use one altitude up. */}
        <h3 data-typography="custom" className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Districts, side by side</h3>

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
