/**
 * Cell page (a trade in a place) , SPINE rebuild, publish-ready flagship. Leg 3 and
 * the pattern-setter for the other four page types. The locked content-map order
 * re-presented to the shared spine kit, taken to the masterplan's publish bar:
 * answer-first hero, one dominant decision figure, progressive disclosure creating
 * the free/Pro seam, honest baselines, rationed terracotta, count-up + hover motion.
 *
 * As-built chart dictionary (rulebook 25 bar budget: max 3 bar-family graphics per
 * page, no two adjacent sections sharing the bar form). The THREE counted bars:
 *   BAR 1 , 100% stacked bar (legended): MoneySplit $100 split x1 (ch1)
 *   BAR 2 , ShareStack (the founder-blessed channel/how-they-pay share bar): Demand channels x1 (ch2)
 *   BAR 3 , PhaseBar (two-anchor open/break-even time axis): Ramp x1 (ch4)
 * FREE forms carry the rest of the variety (no budget cost):
 *   big figure at hero scale: masthead $43K (the ONE hero; the control-room trio
 *      restates it at sub-hero support scale by design, the seam's summary)
 *   discrete tier band (categorical Low/Mid/High pips, active inked): WhoSuits x1 (ch1)
 *   donut (a whole = donut; peak slice terracotta): Demand dayparts x1 (ch2)
 *   ranked figure list (label + right-aligned figure, no track): Demand catchment
 *   lollipop on a drawn track (thin, marker family, not a fill bar): CostToOpen line items x1
 *   line/area zero baseline: SurvivalSlope x1; zero-baseline monthly COLUMNS: Seasonality x1
 *   two-marker scale (break-even vs a typical day on one domain): BreakEven headroom x1
 *   editorial table (figures + bold-best, no in-cell bars): Nearby x1
 *   waterfall (gross -> labeled decrements -> net, from the $100 split): OwnerKeeps x1 (max 1)
 *   spread strip: masthead turnover p10/p50/p90 x1
 *   track-free range brackets (low/high ticks + mid dot): Wages x1
 *   segmented-control (selection chrome, ink): FormatPicker x1
 * REMOVED forms: Gauge, 3-pip meters, Dots, invented-ceiling break-even fill bar, the
 *   3-level "waterfall" bars (-> true stepped waterfall), min-floored seasonality area,
 *   the Related keep-% lollipops, the catchment IndexBars, the Nearby in-cell CellScaleBars;
 *   the WhoSuits continuous-track Meters (-> discrete categorical tier band, 2026-07-12).
 * Every modeled/placeholder figure block carries a visible SampleTag (rulebook 4A);
 * the masthead states provenance once as the page-level tag.
 * Width tiers per WI-4; the money chapter is weighted heaviest (control room + wide reads).
 */
import * as React from "react";
import { spineCellSeed, spineIndustrySeed } from "@/lib/spine-seeds";
import { timeToOpenWeeks } from "@/lib/markets/opening_archetypes";
import {
  Fig, Box, Rail, Movement, Row, Full, WideRail, Donut, StackBar, ShareStack, PhaseBar, InfoTip, StruckLine, TERRA, usd,
} from "@/components/spine/kit";
import { Masthead } from "./masthead";
import { FormatPicker, FormatProvider } from "./format-picker";
import { OwnerKeeps, BreakEven, CostToOpen } from "./money-chapter";
import { Nearby, Wages, Risks } from "./interactive";

const X: any = spineCellSeed;

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/* The .celltop terracotta top-edge hover motif is DELETED (rulebook v1 section 37,
 * founder G3, 2026-07-11): the accent never appears on hover. The quiet grey .hov
 * row wash (shell.tsx) remains the one hover mechanism. */

/* ================= CH1 , THE VERDICT ================= */
/* The old HonestTake half-card is GONE (founder D7 + rulebook v1 section 17,
 * 2026-07-11): after the 07-10 verdict deletions it was a lone n_firms figure
 * stretched across a half band. The count survives, reframed as what it is (how
 * many already trade here), as the masthead scorecard's third tile. */

/* MoneySplit , WI-3 brief (rulebook v2 corrections, 2026-07-10): the Rail verdict
 * and the two-sentence `read` are both DELETED; the 100%-stacked $100 bar plus its
 * kept-slice legend already carries "two thirds is gone before rent". The one
 * surviving line is a COMPUTED fact (the largest non-kept slice), not seed prose ,
 * schematic, not editorial.
 * decision: where the money goes. Number: the kept slice (7%). focal: the 100%-stacked $100 bar.
 * width: Full (T1, the canonical cost-stack). terracotta target: the kept slice only.
 * StackBar's default HONESTY SORT does the work: size-descending, kept slice pinned last
 * + terracotta, grey darkness remapped to magnitude, legend the visible carrier. */
function MoneySplit({ d }: { d: any }) {
  const items: any[] = d.money_split?.items ?? [];
  if (items.length === 0) return null;
  const segments = items.map((it) => ({ label: it.name, pct: it.pct, color: it.kept ? TERRA : "#c8c8c6", kept: !!it.kept }));
  return (
    <Box>
      {/* sample: the kept 7% is a modeled cost-structure share, not a measured net
          margin by city (rulebook 4A/5); the tag marks it so it never reads as real. */}
      <Rail icon="cost-breakdown" kicker="Where each $100 of sales goes" sample />
      <StackBar segments={segments} ariaLabel={segments.map((p) => `${p.label} ${p.pct}%`).join(", ")} legend />
    </Box>
  );
}

/* WhoSuits , WI-3 brief (rulebook 28/29 + FORM-CATALOG Meter do-not, 2026-07-12):
 * the four operator demands are CATEGORICAL reads (Low / Mid / High), so they render
 * as a discrete stepped tier band (the ratified PriceTierBand idiom: discrete pips,
 * the active tier inked, labels aligned below), NOT a marker on a continuous track ,
 * a drawn position fakes a precision the coarse 20/50/80 honesty steps never had. The
 * vague words ("Real", "High", "Heavy", "Hands-on") are DROPPED for the honest tier
 * each hides; the concrete sub-phrase carries the specifics. Neutral: positions are
 * the read, no answer, no accent. width: Even half. */
const DEMAND_TIERS = ["Low", "Mid", "High"];
const tierOf = (pos: number): number => (pos >= 67 ? 2 : pos >= 34 ? 1 : 0);

function WhoSuits({ d }: { d: any }) {
  const w = d.who_suits ?? {};
  const rows: Array<{ label: string; tier: number; sub?: string }> = (w.scales ?? []).map((s: any) => ({ label: s.label, tier: tierOf(s.pos), sub: s.sub }));
  if (rows.length === 0) return null; // omitted on promotion: no honest tier read
  return (
    <Box>
      <Rail icon="who-for" kicker="Who this suits" sample />
      <div className="mt-1 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[150px_1fr] items-center gap-3">
            <span className="text-[length:var(--t-body)] leading-tight text-[var(--c-ink2)]">{r.label}{r.sub ? <span className="mt-0.5 block text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.sub}</span> : null}</span>
            <div className="grid grid-cols-3 gap-1" role="img" aria-label={`${r.label}: ${DEMAND_TIERS[r.tier]}`}>
              {DEMAND_TIERS.map((t, i) => (
                <span key={t} className="h-[7px] rounded-full" style={{ background: i === r.tier ? "var(--c-ink)" : "#e6e6e6" }} />
              ))}
            </div>
          </div>
        ))}
        {/* the shared Low / Mid / High axis, aligned to the three pip columns */}
        <div aria-hidden className="grid grid-cols-[150px_1fr] items-center gap-3">
          <span />
          <div className="grid grid-cols-3 gap-1 text-center text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">
            {DEMAND_TIERS.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      </div>
    </Box>
  );
}

/* ================= CH2 , THE DEMAND ================= */
/* Demand , WI-4 brief (rulebook 25/26 + M1 richness restore, 2026-07-12): the July-3
 * chapter carried three distinct reads and was stripped to three look-alike figure
 * lists (the sparse-but-wide failure M1 names). Richness is restored WITHOUT the bar
 * monotony G2 killed: the daypart split is a DONUT (a whole = donut, free), the channel
 * mix is the ONE share bar the founder blessed ("how customers pay... the horizontal bar
 * is perfect"), and the catchment index stays a ranked figure list. Three forms, none
 * alike (resolves INV cell 04, where the index bars read as the daypart % bars).
 * Title fixed: the box reads COVERS timing, so the kicker names covers, not revenue.
 * width: WideRail. terracotta target: the peak daypart slice (box 1) and the leading
 * channel (box 2, ShareStack's built-in leader accent) , one answer per box. */
const DP_GREYS = ["#c1c1bf", "#dcdbd9"];

function Demand({ d }: { d: any }) {
  const dm = d.demand ?? {};
  const dayparts: any[] = dm.dayparts ?? [];
  const channels: any[] = dm.channels ?? [];
  const cat: any[] = [...(dm.catchment ?? [])].sort((a, b) => b.pct - a.pct);
  // the peak daypart is the box's one answer (when the week fills up); rest neutral.
  const peakIdx = dayparts.reduce((best, p, i, a) => (p.pct > a[best].pct ? i : best), 0);
  const dpSegs: Array<[string, number, string]> = dayparts.map((p, i) => [p.name, p.pct, i === peakIdx ? TERRA : DP_GREYS[i % DP_GREYS.length]]);
  return (
    <WideRail>
      <Box className="flex flex-col">
        <Rail icon="daily-takings" kicker="When the week fills up" sample />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Donut segs={dpSegs} centerBig={(dm.covers_per_week ?? 0).toLocaleString()} centerSub="covers a week" />
          <div className="min-w-0 flex-1 space-y-1.5">
            {dayparts.map((p, i) => (
              <div key={p.name} className="flex items-baseline justify-between gap-3">
                <span className="inline-flex min-w-0 items-center gap-2 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]"><span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: i === peakIdx ? TERRA : DP_GREYS[i % DP_GREYS.length] }} />{p.name}</span>
                <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{p.pct}%</Fig>
              </div>
            ))}
          </div>
        </div>
        {/* covers unit-economics, anchored to the box base: fills the donut box to its
            taller neighbour's height (rulebook 17, no one-sided white space) and glosses
            "covers" at first textual use (rule 40), replacing the misplaced a-head tooltip. */}
        <div className="mt-auto grid grid-cols-2 gap-x-4 border-t border-[var(--c-border)] pt-3">
          <div>
            <Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">${dm.avg_spend_usd}</Fig>
            <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">a head</div>
          </div>
          <div>
            <Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">~{Math.round((dm.covers_per_week ?? 0) / 7)}</Fig>
            <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">covers<InfoTip gloss="One cover is one customer served; a table of four is four covers." /> a typical day</div>
          </div>
        </div>
      </Box>
      <Box>
        <Rail icon="catchment" kicker="Who comes in, and how" sample />
        {/* channel mix , the one share bar the founder blessed; the leading channel
            carries the accent (ShareStack pins terracotta on the largest slice). */}
        <div className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">How they order</div>
        <ShareStack segments={channels.map((c) => ({ label: c.name, pct: c.pct }))} />
        {/* catchment , ranked descending; the heading names the unit so a 100-baseline
            index never reads as a percentage. */}
        <div className="mt-4 border-t border-[var(--c-border)] pt-3">
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Where the covers come from <span className="font-normal normal-case">({dm.catchment_unit})</span></div>
          <div className="space-y-1.5">
            {cat.map((c) => (
              <div key={c.name} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{c.name}</span>
                <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{c.pct}</Fig>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </WideRail>
  );
}

/* ================= CH4 , RUNNING IT ================= */
/* Seasonality , WI-4 brief (re-visualed, Final Ascent; rulebook v2 corrections
 * 2026-07-10 drop the Rail verdict and the editorial "stays gentle" close , the
 * zero-baseline shape already reads modest, so the caption states only the axis
 * unit and the two named months, never a claim about the swing itself).
 * decision: how much the year swings. Number: the peak vs the trough. focal: 12 ZERO-baseline
 * monthly COLUMNS + a faint index-100 reference rule. width: Even half. terracotta target:
 * NONE (rulebook v1 section 37: a month can never be "featured"; all columns neutral,
 * the caption's two named months carry the read). */
function Seasonality({ d }: { d: any }) {
  const m: number[] = d.seasonality?.months ?? [];
  if (m.length < 2) return null;
  // HONEST AXIS: zero-based columns (never floored at the data min), scale drawn on-surface.
  const top = Math.max(100, ...m);
  const peak = m.indexOf(Math.max(...m)); // the busy month, data-derived (year-end in the seed)
  const trough = m.indexOf(Math.min(...m)); // the quiet month, data-derived
  const W = 300, H = 110, padL = 22, padR = 6, padTop = 10, padBot = 18;
  const innerW = W - padL - padR;
  const slot = innerW / m.length;
  const Y = (v: number) => padTop + (1 - v / top) * (H - padTop - padBot);
  return (
    <Box className="md:flex-[2]">
      <Rail icon="seasonality" kicker="Busy months and quiet months" sample />
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }} role="img" aria-label={`Monthly demand index, zero-based columns; ${MONTHS[peak] === "D" ? "December" : "the peak month"} is the highest at ${m[peak]}`} preserveAspectRatio="none">
        {/* index-100 reference rule, labeled */}
        <line x1={padL} y1={Y(100)} x2={W - padR} y2={Y(100)} stroke="#e0dedc" strokeWidth={0.75} strokeDasharray="3 3" />
        <text x={padL - 4} y={Y(100) + 2.5} textAnchor="end" fill="#8c8c8a" fontSize={7.5}>100</text>
        {/* zero-baseline columns, all neutral (no featured month) */}
        {m.map((v, i) => {
          const x = padL + i * slot + slot * 0.18, bw = slot * 0.64;
          return <rect key={i} x={x.toFixed(1)} y={Y(v).toFixed(1)} width={bw.toFixed(1)} height={(Y(0) - Y(v)).toFixed(1)} rx={1.5} fill="#c9c9c7" />;
        })}
        {/* the zero baseline, drawn */}
        <line x1={padL} y1={Y(0)} x2={W - padR} y2={Y(0)} stroke="#c9c9c7" strokeWidth={1} />
        {m.map((_, i) => <text key={i} x={padL + i * slot + slot / 2} y={H - 5} textAnchor="middle" fill="#8c8c8a" fontSize={8}>{MONTHS[i]}</text>)}
        {/* the busy + quiet months marked ON the visual (rulebook 26: the finding lives on
            the chart, not a caption): each carries its index value, neutral ink, never a
            terracotta-featured month (rule 37); both are data-derived so the read holds for
            any cell (rule 21), not the seed's Western year-end peak. */}
        {[peak, trough].map((idx) => (
          <text key={`mk-${idx}`} x={padL + idx * slot + slot / 2} y={Y(m[idx]) - 4} textAnchor="middle" fontSize={8.5} fill="#1b1b1a" style={{ fontFamily: "var(--font-grotesk)", fontWeight: 600 }}>{m[idx]}</text>
        ))}
      </svg>
      <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">Monthly demand, indexed; the dashed rule marks 100.</div>
    </Box>
  );
}

/* Honest break-even week for this cell's trade, counted from week 0 (never from
 * opening): the bundled industry seed's own ramp_to_breakeven_months, converted
 * to weeks. The cell seed carries no break-even figure of its own (its old
 * first_year block was a fully invented milestone list, scrapped under
 * rulebook v2 S10/D4); the industry altitude is the one honest source for this
 * figure, and ramp_to_breakeven_months is currently bundled for exactly ONE
 * trade (restaurants). The ramp figure is an industry-altitude fact and must
 * NEVER be borrowed across trades, so this cross-checks the cell's own
 * meta.industry against the seed it would borrow from and returns null on any
 * mismatch or on a cell with no honest ramp source , the same guard a real
 * dental-practice or auto-repair cell hits today (no ramp seed exists for them
 * yet), so the caller self-omits rather than show a different trade's number. */
function breakevenWeekFor(d: any): number | null {
  const industryId = d?.meta?.industry ?? null;
  if (!industryId || industryId !== spineIndustrySeed?.meta?.industry) return null;
  const rampMonths = spineIndustrySeed?.first_year?.ramp_to_breakeven_months;
  return typeof rampMonths === "number" && Number.isFinite(rampMonths) && rampMonths > 0
    ? Math.round(rampMonths * (52 / 12))
    : null;
}

/* Ramp , rulebook v2 S10/D4, founder decision a (2026-07-09): the placeholder
 * milestone-by-milestone launch Timeline is scrapped (its six weekly steps ,
 * a lease/licence step, a fit-out completion, a hiring step, a soft-opening
 * step, a break-even week, and a first-profit step , were all invented, none
 * measured). Replaced by the ratified PhaseBar, fed by the only two honest
 * anchors: the modeled time to open (opening_archetypes, place-invariant,
 * resolves for every trade) and the modeled break-even week (industry seed's
 * ramp_to_breakeven_months, from week 0). Self-omits when no break-even anchor
 * resolves for this cell's trade , never forces a tick. */
function Ramp({ d }: { d: any }) {
  const breakevenWeek = breakevenWeekFor(d);
  if (breakevenWeek == null) return null;
  const openWeek = timeToOpenWeeks(d.meta?.industry ?? null);
  return (
    <Box>
      <Rail icon="first-year" kicker="Getting to break-even" sample />
      <PhaseBar openWeek={openWeek} breakevenWeek={breakevenWeek} />
    </Box>
  );
}

/* ================= CH5 , PLACE AND RIVALS ================= */
/* Myth , WI-3 brief (rulebook v2 corrections, 2026-07-10; S12, the myth-busting
 * device was "a schematic cliche"): the "Myth, busted" kicker (a pre-asserted
 * conclusion) and the Rail verdict are both DELETED, retitled to a plain "Myth vs.
 * reality". The quoted claim box is ALSO gone , the folklore is now struck directly
 * ON the survival chart (StruckLine, a phantom grey dashed line), not asserted in a
 * text box beside it.
 * decision: bust the belief operators actually hold. Number: the real year-one survival rate (NEW, not restated).
 * focal: the survival curve with the folklore struck on it. width: Even half. terracotta target: the survival figure. */
function Myth({ d }: { d: any }) {
  const my = d.myth ?? {};
  const s = my.survival ?? {};
  const survival: Array<[string, number]> = [["Yr 1", s.year1_pct], ["Yr 3", s.year3_pct], ["Yr 5", s.year5_pct]]
    .filter(([, v]) => typeof v === "number") as Array<[string, number]>;
  return (
    <Box className="md:flex-[3]">
      {/* ink rail: the ONE accent in this box is the year-one survival node + figure. */}
      <Rail icon="myth-reality" kicker="Myth vs. reality" sample />
      {/* the evidence, ALONE: a survival curve with the "9 in 10 fail" folklore struck ON
          it (rulebook 30), terracotta on the year-one node only. The "survivors, not
          failures" caption read and the reality paragraph are BOTH deleted , the bust lives
          on the chart, never in prose glued beside it (rulebook 26/19). */}
      {survival.length >= 2 ? <SurvivalSlope points={survival} /> : null}
    </Box>
  );
}

/* The struck phantom line represents this page's one myth (myth.claim: "Nine in
 * ten restaurants fail in the first year"), read as a 10% year-one survival rate ,
 * the documented illustrative reading of that PROSE claim (rulebook v2 D4: a
 * modelled/illustrative figure must carry a visible label; StruckLine's own struck
 * caption is that label). It is the thing being debunked, not a data figure, so it
 * is fixed to this page's specific folklore rather than parsed out of myth.claim; a
 * future cell with a differently-worded myth would need this constant revisited. */
const FOLKLORE_SURVIVAL_PCT = 10; // "nine in ten fail" -> 10% survive
const FOLKLORE_LABEL = "folklore: 9 in 10 fail";

/* survival curve , the share still trading at year 1 / 3 / 5 as a descending line.
 * One accent: the year-one node + figure (the belief being busted). StruckLine draws
 * the folklore phantom INSIDE this same <svg>, projected through this chart's own
 * X()/Y() scale (a flat line at the folklore's implied survival level, spanning the
 * same x-span as the real curve, struck out) , the kit.tsx:598 contract. */
function SurvivalSlope({ points }: { points: Array<[string, number]> }) {
  const W = 320, H = 110, padL = 8, padR = 8, padTop = 22, padBot = 26;
  const min = 0, max = 100;
  const X = (i: number) => padL + (i / (points.length - 1)) * (W - padL - padR);
  const Y = (v: number) => padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBot);
  const coords = points.map(([, v], i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  const line = "M " + coords.join(" L ");
  const area = `M ${X(0).toFixed(1)},${(H - padBot).toFixed(1)} L ` + coords.join(" L ") + ` L ${X(points.length - 1).toFixed(1)},${(H - padBot).toFixed(1)} Z`;
  const phantomPts: Array<[number, number]> = [[X(0), Y(FOLKLORE_SURVIVAL_PCT)], [X(points.length - 1), Y(FOLKLORE_SURVIVAL_PCT)]];
  return (
    <div className="mt-3 border-t border-[var(--c-border)] pt-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }} role="img" aria-label={`Still trading: ${points.map(([l, v]) => `${l} ${v}%`).join(", ")}. Folklore claims 9 in 10 fail in the first year, struck out on the same chart.`}>
        {/* neutral fill: the line's carrier is grey, so the fill is too , the ONE accent
            in this box is the year-one node + figure (the myth being busted) */}
        <path d={area} fill="#9a9a98" opacity={0.08} />
        <path d={line} fill="none" stroke="#c8c8c6" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([label, v], i) => {
          const lead = i === 0;
          return (
            <g key={label}>
              <circle cx={X(i)} cy={Y(v)} r={lead ? 4 : 3} fill={lead ? TERRA : "#1b1b1a"} stroke="#fff" strokeWidth={1.5} />
              <text x={X(i)} y={Y(v) - 9} textAnchor="middle" fontSize={12} style={{ fontFamily: "var(--font-grotesk)", fontWeight: lead ? 600 : 500 }} fill={lead ? "#c2410c" : "#1b1b1a"}>{v}%</text>
              <text x={X(i)} y={H - 8} textAnchor="middle" fontSize={9.5} fill="#8c8c8a">{label}</text>
            </g>
          );
        })}
        <StruckLine points={phantomPts} label={FOLKLORE_LABEL} />
      </svg>
      {/* one-line legend only (rulebook 26): names the two lines so the real curve reads
          against the struck folklore phantom. No sentence, no verdict, no "read". */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-[2px] w-4 rounded-full" style={{ background: "#c8c8c6" }} />still trading</span>
        <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-0 w-4 border-t border-dashed" style={{ borderColor: "#b0b0ae" }} />folklore</span>
      </div>
    </div>
  );
}

/* Related , rulebook v1 sections 5, 15 and 32 (founder G6/G7/G9, 2026-07-11): the
 * per-trade keep-% lollipop ranking and its computed "every neighbouring trade
 * keeps more" footer are DELETED , net margin by trade in a specific city is
 * structurally unknowable, and the cross-entity verdict footer is a banned copy
 * pattern. Related is now plain sibling links (the Close link-row form): name +
 * what one costs to open, a knowable entry figure (the seed carries the modeled
 * startup-capital anchor per trade). A sibling with no cost figure renders the
 * name alone , nothing is ever faked. The seed list is hospitality-adjacent,
 * cafe first; dental never surfaces on a restaurant page.
 * width: Even half. terracotta target: none (links are chrome). */
function Related({ d }: { d: any }) {
  const arr: any[] = d.related ?? [];
  if (arr.length === 0) return null; // omitted on promotion: no sibling-cell links
  /* THE PLACE COMES FROM THE DATUM. Every row here was hardcoded to
     `/gb/london/${r.slug}` under a heading that reads "Related trades in this
     place", so the heading and the href disagreed for every place that is not
     London.

     It has never reached a reader: adapt_cell leaves `related` undefined on the
     public route ("keep-% column has no honest per-sibling source"), so the
     guard above returns null and these links render only in the /dev sandbox,
     where the London seed makes them correct by accident.

     That accident is the problem. The day anyone gives `related` a source, this
     section starts sending readers from Madrid and Sydney to London, and the
     heading tells them they are still in their own city. Deriving the prefix
     from d.meta is identical for the seed (GB + london) and correct for
     everything else. No meta means no href, so a row renders as text rather
     than as somewhere else's page. */
  const iso2: string | undefined = d.meta?.iso2;
  const geo: string | undefined = d.meta?.geo;
  const placePrefix =
    iso2 && geo ? `/${String(iso2).toLowerCase()}/${String(geo).toLowerCase()}` : null;
  return (
    <Box className="md:flex-[3]">
      {/* same section-opener treatment as sibling cards (Rail kicker, not a bold Head) */}
      <Rail icon="subtype" kicker="Related trades in this place" sample />
      {/* the explanatory subtitle is DELETED (rulebook 14: most subtitles should not
          exist); the cost figure's unit is a direct column label, never a sentence (rule 26). */}
      <div className="mb-2 flex items-baseline justify-between border-b border-[var(--c-border)] pb-1.5">
        <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Trade</span>
        <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">To open</span>
      </div>
      <div className="space-y-1">
        {arr.map((r) => (
          <a key={r.slug} href={placePrefix ? `${placePrefix}/${r.slug}` : undefined} className="hov -mx-2 flex items-baseline justify-between gap-3 rounded-md px-2 py-1.5">
            <span className="min-w-0 truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{r.name} &#8594;</span>
            {typeof r.cost_to_open_usd === "number" ? (
              <Fig className="shrink-0 text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{money(r.cost_to_open_usd)}</Fig>
            ) : null}
          </a>
        ))}
      </div>
    </Box>
  );
}

/* Close , the deliberate full-width end of the page. The recap PARAPHRASES the verdict
 * (an echo, never a verbatim copy of the hero or the break-in line), one ink CTA, and
 * ink next-step links (navigation is chrome; the accent never sits on chrome).
 * Rulebook v2 corrections (2026-07-10): the two "format" strings are gated on
 * hasSubtypes so a cell with no subtype picker (e.g. a dental or auto-repair cell)
 * never references a format it never showed. */
function Close({ d }: { d: any }) {
  const rel: any[] = d.related ?? [];
  const city = d.meta?.city ?? "this market";
  /* The same hardcoded London as Related above, in the same file, one function
     down. This one is louder: the row it builds reads "Look at X in {city}
     instead", so the label named the reader's own city while the href went to
     London. Derived from the datum, and null when the datum cannot say, in
     which case the row renders without a link rather than with a wrong one. */
  const iso2: string | undefined = d.meta?.iso2;
  const geo: string | undefined = d.meta?.geo;
  const placePrefix =
    iso2 && geo ? `/${String(iso2).toLowerCase()}/${String(geo).toLowerCase()}` : null;
  const trade = (d.meta?.trade ?? "this trade").toLowerCase();
  const hasSubtypes = Array.isArray(d.subtypes?.items) && d.subtypes.items.length > 0;
  // Every link carries a REAL destination or renders as a plain span with no arrow
  // (no fake affordance): the trade-across-markets read lives on the industry page,
  // the sibling-trade cell rides its seed slug, and the format-by-format read has no
  // page of its own yet (it lives in this page's money chapter , and only exists at
  // all when this cell actually has a format picker to point at).
  const links: Array<{ t: string; href?: string }> = [
    { t: `Compare ${trade} across nearby markets`, href: "/industries" },
    ...(rel[0]
      ? [{ t: `Look at ${rel[0].name.toLowerCase()} in ${city} instead`, href: rel[0].slug && placePrefix ? `${placePrefix}/${rel[0].slug}` : undefined }]
      : []),
    ...(hasSubtypes ? [{ t: "See what an owner keeps, format by format" }] : []),
  ];
  return (
    <Box>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          {/* the asserted "bottom line" verdict paragraph and the forward "where the same
              work keeps more" line are BOTH deleted (rulebook 15/19: a section's data shows
              the conclusion, the copy never asserts it). This is a navigation terminus: the
              label points at the next steps below, it states no finding. */}
          <div className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">Where to next</div>
        </div>
        <a href="/pricing" className="shrink-0 self-start rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-[length:var(--t-body)] font-semibold text-white transition-colors hover:bg-[var(--terra-text)] md:self-auto">
          Compare this trade with Pro &#8594;
        </a>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-4 sm:grid-cols-3">
        {links.map((l, i) =>
          l.href ? (
            <a key={i} href={l.href} className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--terra-text)]">{l.t} &#8594;</a>
          ) : (
            <span key={i} className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)]">{l.t}</span>
          )
        )}
      </div>
    </Box>
  );
}

/**
 * The cell spine body. Parameterized on `data` (defaults to the bundled
 * illustrative seed) so the dev route renders the full seed unchanged, while the
 * live route passes a real, reconciled seed from buildSpineCellSeed(). Every
 * chapter and section guards on its own data: a field the adapter omitted (no
 * honest source) renders NOTHING here, never a "0"/undefined/broken block. On
 * the full seed every guard is satisfied, so /dev/spine-cell is byte-for-byte
 * what it was.
 */
/* The reusable body , accepts `data` (the bundled seed by default, or the real
 * adapter output from the live route). NOT the route's default export, because a
 * Next page component must conform to PageProps and cannot take a custom prop. */
export function SpineCellBody({ data = X }: { data?: any } = {}) {
  const d = data;

  // Chapter/section presence , each is true only when the adapter (or the seed)
  // carries an honest source for it. A whole Movement is suppressed when its
  // chapter has no content, so a promoted-but-thinner page never shows a bare
  // heading over empty space.
  const hasWhoSuits = Array.isArray(d.who_suits?.scales) && d.who_suits.scales.length > 0;
  const hasMoneySplit = Array.isArray(d.money_split?.items) && d.money_split.items.length > 0;
  // The break-in density figure now lives in the masthead scorecard (founder D7),
  // so the chapter no longer keys on the old verdict block.
  const showVerdictChapter = hasWhoSuits || hasMoneySplit;

  const hasDemand =
    Array.isArray(d.demand?.dayparts) ||
    Array.isArray(d.demand?.channels) ||
    Array.isArray(d.demand?.catchment);

  const hasSubtypes = Array.isArray(d.subtypes?.items) && d.subtypes.items.length > 0;
  const hasSetup = Array.isArray(d.setup?.items) && d.setup.items.length > 0;
  // OwnerKeeps draws the gross-to-net waterfall from the $100 split, so it needs
  // the money split (the hero take-home lives once in the masthead, not here).
  const hasOwner = hasMoneySplit;
  const hasBreakEven = typeof d.break_even?.covers_per_day === "number";
  const hasWages = Array.isArray(d.wages?.roles) && d.wages.roles.length > 0;
  const showMoneyChapter = hasSubtypes || hasOwner || hasBreakEven || hasSetup || hasWages;

  const hasSeasonality = Array.isArray(d.seasonality?.months) && d.seasonality.months.length >= 2;
  const hasRisks = Array.isArray(d.risks?.items) && d.risks.items.length > 0;
  const hasRamp = breakevenWeekFor(d) != null;
  const showRunningChapter = hasSeasonality || hasRisks || hasRamp;

  const hasNearby = Array.isArray(d.nearby?.places) && d.nearby.places.length > 0;
  const hasMyth = !!d.myth?.claim;
  const hasRelated = Array.isArray(d.related) && d.related.length > 0;
  const showPlaceChapter = hasNearby || hasMyth || hasRelated;

  // Chapter numbers count only the chapters that actually render, so an omitted
  // chapter (e.g. Demand on promotion) never leaves a gap in the 01/02/03 sequence.
  // Each cn() is evaluated inside its chapter's conditional, so it advances in
  // source order for present chapters only.
  let chapCount = 0;
  const cn = () => String(++chapCount).padStart(2, "0");
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <Masthead d={d} />

      {/* The verdict , the who-suits scale band (the break-in count folded into the
          masthead scorecard, founder D7) then the canonical full-width $100
          cost-stack (T1: a single stacked bar earns the full column). */}
      {showVerdictChapter ? (
        <>
          <Movement index={cn()} eyebrow="The verdict" heading="What it takes, and what it pays" icon="gut-check" />
          <div className="space-y-4">
            {hasWhoSuits ? <Row><WhoSuits d={d} /></Row> : null}
            {hasMoneySplit ? <Full><MoneySplit d={d} /></Full> : null}
          </div>
        </>
      ) : null}

      {/* Demand , a single WideRail band: dayparts + channels + catchment. Omitted on
          promotion (no honest per-figure source); rendered on the full seed. */}
      {hasDemand ? (
        <>
          <Movement index={cn()} eyebrow="The demand" heading="Where the revenue comes from" icon="footfall" />
          <Demand d={d} />
        </>
      ) : null}

      {/* THE MONEY , the heaviest chapter. FormatProvider wraps it so the chosen subtype propagates
          through OwnerKeeps, BreakEven and CostToOpen. FormatPicker is the staged centerpiece.
          When no subtypes ride on the data, FormatProvider renders children unchanged and the
          money cards read the single cell's numbers. */}
      {showMoneyChapter ? (
        <>
          <Movement index={cn()} eyebrow="The money" heading="What it earns, what it keeps" icon="owner-keeps" />
          <FormatProvider d={d}>
            <div className="space-y-4">
              {hasSubtypes ? <Full><FormatPicker d={d} /></Full> : null}
              {/* Re-tier (rulebook 17, no one-sided white space): the tall signature
                  waterfall pairs with the tall pay plot so both fill the band; break-even
                  and cost-to-open are the shorter entry-threshold reads, paired together so
                  break-even is no longer stretched ~half-empty beside the waterfall. */}
              {hasOwner || hasWages ? (
                <WideRail>{hasOwner ? <OwnerKeeps d={d} /> : null}{hasWages ? <Wages d={d} /> : null}</WideRail>
              ) : null}
              {hasBreakEven || hasSetup ? (
                <Row>{hasBreakEven ? <BreakEven d={d} /> : null}{hasSetup ? <CostToOpen d={d} /> : null}</Row>
              ) : null}
            </div>
          </FormatProvider>
        </>
      ) : null}

      {/* Running it , Even (cost calendar reads) then Full phase bar. London exemplar
          only; each section also self-omits on absent data. */}
      {showRunningChapter ? (
        <>
          <Movement index={cn()} eyebrow="Running it" heading="The first year" icon="first-year" />
          <div className="space-y-4">
            {hasSeasonality || hasRisks ? (
              <Row>{hasSeasonality ? <Seasonality d={d} /> : null}{hasRisks ? <Risks d={d} /> : null}</Row>
            ) : null}
            {hasRamp ? <Full><Ramp d={d} /></Full> : null}
          </div>
        </>
      ) : null}

      {/* Place and rivals , Full leaderboard then Even (myth + related close). */}
      {showPlaceChapter ? (
        <>
          <Movement index={cn()} eyebrow="Place and rivals" heading="Place and rivals" icon="best-areas" />
          <div className="space-y-4">
            {hasNearby ? <Full><Nearby d={d} /></Full> : null}
            {hasMyth || hasRelated ? (
              <Row>{hasMyth ? <Myth d={d} /> : null}{hasRelated ? <Related d={d} /> : null}</Row>
            ) : null}
          </div>
        </>
      ) : null}

      {/* The close , a deliberate full-width terminus so the page ends on a CTA band,
          not dead background-photo margin. Reads only meta + related, both guarded. */}
      <div className="mt-6 mb-2">
        <Full><Close d={d} /></Full>
      </div>
    </main>
  );
}
