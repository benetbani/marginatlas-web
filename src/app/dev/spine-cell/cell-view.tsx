/**
 * Cell page (a trade in a place) , SPINE rebuild, publish-ready flagship. Leg 3 and
 * the pattern-setter for the other four page types. The locked content-map order
 * re-presented to the shared spine kit, taken to the masterplan's publish bar:
 * answer-first hero, one dominant decision figure, progressive disclosure creating
 * the free/Pro seam, honest baselines, rationed terracotta, count-up + hover motion.
 *
 * As-built chart dictionary (Final Ascent Visual Dictionary census, cap 2 per family):
 *   #1 big figure at hero scale: masthead $43K (the ONE hero; the control-room trio
 *      restates it at sub-hero support scale by design, the seam's summary) = 1
 *   #2 100% stacked bar (legended): MoneySplit x1, channels x1 = 2 AT CAP
 *   #3 ranked labeled bars (values right-aligned): catchment x1, wages x1 = 2 AT CAP
 *      (dayparts = labeled share bars on a FIXED full-week axis, chronological not ranked)
 *   #4 dot plot on a shared labeled scale (EaseScale + endLabels): WhoSuits x1, Risks x1 = 2 AT CAP
 *   #5 lollipop on a drawn track: CostToOpen line items x1, Related trades (ref tick at 7%) x1 = 2 AT CAP
 *   #7 line/area (zero baseline): SurvivalSlope x1 = 1; zero-baseline monthly COLUMNS: Seasonality x1 = 1
 *   #8 phase bar (rulebook v2 S10, two-anchor open/break-even, replaces the placeholder
 *      month-by-month Timeline): Ramp x1 = 1
 *   #9 editorial table (in-cell bars on a DRAWN CellScaleBar domain): Nearby x1 = 1
 *   #12 waterfall (gross -> labeled decrements -> net, from the $100 split): OwnerKeeps x1 = 1 (max 1)
 *   #13 spread strip: masthead turnover p10/p50/p90 x1 = 1
 *   segmented-control (selection chrome, ink): FormatPicker x1 = 1
 * REMOVED forms: Gauge, Donut, 3-pip meters, Dots, invented-ceiling break-even bar,
 *   the 3-level "waterfall" bars (-> true stepped waterfall), min-floored seasonality area.
 * Width tiers per WI-4; the money chapter is weighted heaviest (control room + wide reads).
 */
import * as React from "react";
import { spineCellSeed, spineIndustrySeed } from "@/lib/spine-seeds";
import { timeToOpenWeeks } from "@/lib/markets/opening_archetypes";
import {
  Fig, Box, Rail, Movement, Row, Full, WideRail, EaseScale, StackBar, PhaseBar, InfoTip, IndexBar, StruckLine, TERRA, TRACK,
} from "@/components/spine/kit";
import { Masthead } from "./masthead";
import { FormatPicker, FormatProvider } from "./format-picker";
import { OwnerKeeps, BreakEven, CostToOpen } from "./money-chapter";
import { Nearby, Wages, Risks } from "./interactive";

const X: any = spineCellSeed;

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/* terracotta top-edge hover on every card/interactive row (reduced-motion safe). */
function CellStyles() {
  return (
    <style>{`.spine-scope .celltop{position:relative;transition:transform .15s ease-out,border-color .15s ease-out}
.spine-scope .celltop::before{content:"";position:absolute;left:14px;right:14px;top:0;height:2px;border-radius:9999px;background:${TERRA};opacity:0;transition:opacity .15s ease-out}
.spine-scope .celltop:hover::before{opacity:1}
@media (prefers-reduced-motion:reduce){.spine-scope .celltop{transition:none}}`}</style>
  );
}

/* ================= CH1 , THE VERDICT ================= */
/* HonestTake , WI-3 brief (rulebook v2 corrections, 2026-07-10): the break-in
 * VERDICT sentence and the crowded_line consequence are both DELETED (a Rail
 * verdict is now a dead prop; no section header states a conclusion). The market
 * density figure (n_firms) stands alone as the answer , how hard this trade is
 * to enter, in one number, no prose defending it.
 * focal: the n_firms figure. width: Even half. terracotta target: none (ink
 * evidence; the masthead owns screen one's accent budget). */
function HonestTake({ d }: { d: any }) {
  const n = d.headline?.n_firms;
  const tradeLower = (d.meta?.trade ?? "firms").toLowerCase();
  const hasN = typeof n === "number" && Number.isFinite(n);
  return (
    <Box className="celltop">
      <Rail icon="honest-take" kicker="How hard to break in" />
      {hasN ? (
        <div className="mt-1 flex items-baseline gap-2.5 border-t border-[var(--c-border)] pt-3">
          <Fig className="text-3xl text-[var(--c-ink)]">{n.toLocaleString()}</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{tradeLower} already trade here.</span>
        </div>
      ) : null}
    </Box>
  );
}

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
  const leading = [...items].filter((it) => !it.kept).sort((a, b) => b.pct - a.pct)[0];
  return (
    <Box className="celltop">
      <Rail icon="cost-breakdown" kicker="Where each $100 of sales goes" />
      <StackBar segments={segments} ariaLabel={segments.map((p) => `${p.label} ${p.pct}%`).join(", ")} legend />
      {leading ? (
        <p className="mt-2 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{leading.name} is the single biggest slice, at {leading.pct}% of every $100.</p>
      ) : null}
    </Box>
  );
}

/* WhoSuits , WI-3 brief:
 * decision: who this trade suits. Number: four operator demands on ONE shared LABELED scale
 * (Low -> High endpoints so the scale is never anonymous). focal: the dot rows.
 * width: Even half (audit: half the band, not a full-width strip of clustered dots).
 * terracotta target: none (ink markers; positions are the read, not an answer). */
function WhoSuits({ d }: { d: any }) {
  const w = d.who_suits ?? {};
  const rows: Array<[string, number, string, string?]> = (w.scales ?? []).map((s: any) => [s.label, s.pos, s.word, s.sub]);
  if (rows.length === 0) return null; // omitted on promotion: no honest numeric scale
  return (
    <Box className="celltop">
      <Rail icon="who-for" kicker="Who this suits" verdict={w.subtitle} />
      <div className="mt-1"><EaseScale rows={rows} plain endLabels={["Lighter demand", "Heavier demand"]} /></div>
    </Box>
  );
}

/* ================= CH2 , THE DEMAND ================= */
/* Demand , WI-4 brief:
 * decision: when the revenue actually lands. Number: covers/week + the dayparts split (weekend carries it).
 * focal: dayparts as labeled bars on a FIXED full-week axis (a 47% share must read as ~half,
 * never as a full track), channel split as a 100%-stacked share bar.
 * width: WideRail. terracotta target: the weekend daypart bar (chart) + dine-in channel slice (rail).
 * catchment: RANKED descending with right-aligned index values (a mute unsorted list is decoration). */
function Demand({ d }: { d: any }) {
  const dm = d.demand ?? {};
  const dayparts: any[] = dm.dayparts ?? [];
  const dpPeak = dayparts.reduce((a, b) => (b.pct > a.pct ? b : a), dayparts[0])?.name;
  const channels: any[] = dm.channels ?? [];
  const chGreys = ["#a3a3a3", "#cbcbcb"]; let ci = 0;
  // seed order is already size-descending with the leading channel first , a semantic
  // mix order, so sort={false} (the kept-last cost-stack sort would misread here).
  const chSegs = channels.map((c, i) => ({ label: c.name, pct: c.pct, color: i === 0 ? TERRA : chGreys[(ci++) % chGreys.length] }));
  const cat: any[] = [...(dm.catchment ?? [])].sort((a, b) => b.pct - a.pct);
  return (
    <WideRail>
      <Box className="celltop">
        <Rail icon="daily-takings" kicker="When the revenue lands" />
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
          <Fig className="text-3xl text-[var(--c-ink)]">{(dm.covers_per_week ?? 0).toLocaleString()}</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">covers<InfoTip gloss="One cover is one customer served; a table of four is four covers." /> a week at about <Fig className="text-[var(--c-ink)]">${dm.avg_spend_usd}</Fig> a head.</span>
        </div>
        {/* dayparts , fixed 0-100% axis (the full week), zero baseline, value labels */}
        <div className="space-y-2">
          {dayparts.map((p) => (
            <div key={p.name} className="grid grid-cols-[120px_1fr_36px] items-center gap-3">
              <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{p.name}</span>
              <span className="h-2.5 overflow-hidden rounded-full" style={{ background: TRACK }}>
                <span className="block h-full rounded-full" role="img" aria-label={`${p.name} ${p.pct}%`} style={{ width: `${p.pct}%`, background: p.name === dpPeak ? TERRA : "#c8c8c6" }} />
              </span>
              <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{p.pct}%</Fig>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Share of the week's covers by daypart; the track is the full week.</div>
      </Box>
      <Box className="celltop">
        <Rail icon="catchment" kicker="Who comes in, and how" />
        <StackBar segments={chSegs} sort={false} h="h-7" ariaLabel={chSegs.map((s) => `${s.label} ${s.pct}%`).join(", ")} legend />
        {/* catchment , the shared kit IndexBar (kind index: a 100-baseline tick, no
            percent sign), so an index against a top-group baseline reads differently
            in FORM from the true-percentage daypart bars above, not just by a label. */}
        <div className="mt-4 border-t border-[var(--c-border)] pt-3">
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Where the covers come from <span className="font-normal normal-case">({dm.catchment_unit})</span></div>
          <div className="space-y-2">
            {cat.map((c) => (
              <div key={c.name} className="grid grid-cols-[130px_1fr] items-center gap-3">
                <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{c.name}</span>
                <IndexBar value={c.pct} kind="index" />
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
 * monthly COLUMNS + a faint index-100 reference rule. width: Even half. terracotta target: the December column only. */
function Seasonality({ d }: { d: any }) {
  const m: number[] = d.seasonality?.months ?? [];
  if (m.length < 2) return null;
  // HONEST AXIS: zero-based columns (never floored at the data min), scale drawn on-surface.
  const top = Math.max(100, ...m);
  const peak = m.indexOf(Math.max(...m)); // December in the seed (year-end peak)
  const W = 300, H = 110, padL = 22, padR = 6, padTop = 10, padBot = 18;
  const innerW = W - padL - padR;
  const slot = innerW / m.length;
  const Y = (v: number) => padTop + (1 - v / top) * (H - padTop - padBot);
  return (
    <Box className="celltop md:flex-[2]">
      <Rail icon="seasonality" kicker="Busy months and quiet months" />
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }} role="img" aria-label={`Monthly demand index, zero-based columns; ${MONTHS[peak] === "D" ? "December" : "the peak month"} is the highest at ${m[peak]}`} preserveAspectRatio="none">
        {/* index-100 reference rule, labeled */}
        <line x1={padL} y1={Y(100)} x2={W - padR} y2={Y(100)} stroke="#e0dedc" strokeWidth={0.75} strokeDasharray="3 3" />
        <text x={padL - 4} y={Y(100) + 2.5} textAnchor="end" fill="#8c8c8a" fontSize={7.5}>100</text>
        {/* zero-baseline columns, December accented */}
        {m.map((v, i) => {
          const x = padL + i * slot + slot * 0.18, bw = slot * 0.64;
          return <rect key={i} x={x.toFixed(1)} y={Y(v).toFixed(1)} width={bw.toFixed(1)} height={(Y(0) - Y(v)).toFixed(1)} rx={1.5} fill={i === peak ? TERRA : "#c9c9c7"} />;
        })}
        {/* the zero baseline, drawn */}
        <line x1={padL} y1={Y(0)} x2={W - padR} y2={Y(0)} stroke="#c9c9c7" strokeWidth={1} />
        {m.map((_, i) => <text key={i} x={padL + i * slot + slot / 2} y={H - 5} textAnchor="middle" fill="#8c8c8a" fontSize={8}>{MONTHS[i]}</text>)}
      </svg>
      <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">Monthly demand, indexed; the dashed rule marks 100. December peaks, January sags.</div>
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
    <Box className="celltop">
      <Rail kicker="Getting to break-even" />
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
    <Box className="celltop md:flex-[3]">
      {/* ink rail: the ONE accent in this box is the year-one survival node + figure. */}
      <Rail icon="myth-reality" kicker="Myth vs. reality" />
      {/* the evidence, first: a survival curve with the "9 in 10 fail" folklore struck
          ON it, not a restatement of the margin split. A downward slope reads
          "attrition over time"; terracotta marks the year-one figure only (the
          myth-buster), the later years stay ink. */}
      {survival.length >= 2 ? <SurvivalSlope points={survival} note={s.line} /> : null}
      {my.reality ? <p className="mt-3 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{my.reality}</p> : null}
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
function SurvivalSlope({ points, note }: { points: Array<[string, number]>; note?: string }) {
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
              <text x={X(i)} y={Y(v) - 9} textAnchor="middle" fontSize={12} style={{ fontFamily: "var(--font-grotesk)", fontWeight: lead ? 700 : 500 }} fill={lead ? "#c2410c" : "#1b1b1a"}>{v}%</text>
              <text x={X(i)} y={H - 8} textAnchor="middle" fontSize={9.5} fill="#8c8c8a">{label}</text>
            </g>
          );
        })}
        <StruckLine points={phantomPts} label={FOLKLORE_LABEL} />
      </svg>
      {note ? <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{note}</div> : null}
    </div>
  );
}

/* Related , WI-3 brief (enriched, Final Ascent):
 * decision: where to look next. Number: each trade's keep-% AGAINST a reference tick at what
 * restaurants keep here, so four links become one argument (everything nearby keeps more).
 * focal: a ranked lollipop list (idiom #5), sorted descending, shared drawn 0-max scale.
 * width: Even half. terracotta target: the leading trade's dot + figure only. */
function Related({ d }: { d: any }) {
  const arr: any[] = [...(d.related ?? [])].sort((a, b) => (b.keeps_pct ?? 0) - (a.keeps_pct ?? 0));
  if (arr.length === 0) return null; // omitted on promotion: no honest per-sibling keep-%
  const ref = d.subtypes?.baseline_keeps_pct ?? d.money_split?.items?.find((it: any) => it.kept)?.pct ?? 0;
  const max = Math.max(1, ref, ...arr.map((r) => r.keeps_pct ?? 0));
  const pos = (v: number) => (v / max) * 100;
  const allKeepMore = arr.length > 0 && arr.every((r) => (r.keeps_pct ?? 0) > ref);
  return (
    <Box className="celltop md:flex-[3]">
      {/* same section-opener treatment as sibling cards (Rail kicker, not a bold Head) */}
      <Rail icon="subtype" kicker="Related trades in this place" />
      <p className="mb-3 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">The same street, a different trade: what each one keeps of every $100 of sales.</p>
      <div className="space-y-1">
        {arr.map((r, i) => {
          const lead = i === 0;
          return (
            <a key={r.slug} href={`/gb/london/${r.slug}`} className="hov -mx-2 grid grid-cols-[110px_1fr_40px] items-center gap-3 rounded-md px-2 py-2">
              <span className="min-w-0">
                <span className="block truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{r.name}</span>
                {r.fact ? <span className="block truncate text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.fact}</span> : null}
              </span>
              <span className="relative block h-4" role="img" aria-label={`${r.name} keeps ${r.keeps_pct}% of sales; restaurants here keep ${ref}%`}>
                <span aria-hidden className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full" style={{ background: TRACK }} />
                <span aria-hidden className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ width: `${pos(r.keeps_pct)}%`, background: lead ? TERRA : "#9a9a98" }} />
                <span aria-hidden className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos(r.keeps_pct)}%`, background: lead ? TERRA : "#1b1b1a", boxShadow: "0 0 0 1px #e3e3e3" }} />
                {/* the reference: what restaurants keep here, drawn on the same scale */}
                <span aria-hidden className="absolute inset-y-0 w-px" style={{ left: `${pos(ref)}%`, background: "var(--c-ink2)" }} />
              </span>
              <Fig className={`text-right text-[length:var(--t-body)] ${lead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{r.keeps_pct}%</Fig>
            </a>
          );
        })}
      </div>
      <div className="mt-2 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        The ink tick marks what restaurants keep here ({ref}%).{allKeepMore ? " Every neighbouring trade keeps more." : ""}
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
  const trade = (d.meta?.trade ?? "this trade").toLowerCase();
  const hasSubtypes = Array.isArray(d.subtypes?.items) && d.subtypes.items.length > 0;
  // Every link carries a REAL destination or renders as a plain span with no arrow
  // (no fake affordance): the trade-across-markets read lives on the industry page,
  // the sibling-trade cell rides its seed slug, and the format-by-format read has no
  // page of its own yet (it lives in this page's money chapter , and only exists at
  // all when this cell actually has a format picker to point at).
  const links: Array<{ t: string; href?: string }> = [
    { t: `Compare ${trade} across nearby markets`, href: "/dev/spine-industry" },
    ...(rel[0]
      ? [{ t: `Look at ${rel[0].name.toLowerCase()} in ${city} instead`, href: rel[0].slug ? `/gb/london/${rel[0].slug}` : undefined }]
      : []),
    ...(hasSubtypes ? [{ t: "See what an owner keeps, format by format" }] : []),
  ];
  return (
    <Box className="celltop">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">The bottom line</div>
          {d.close?.bottom_line ? (
            <p className="text-[length:var(--t-lead)] font-medium leading-snug text-[var(--c-ink)]">{d.close.bottom_line}</p>
          ) : null}
          <p className="mt-1.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">
            {hasSubtypes
              ? "If the format fits your capital and your hours, the next question is where the same work keeps more."
              : "If this fits your capital and your hours, the next question is where the same work keeps more."}
          </p>
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
  const hasVerdict = !!d.verdict?.break_in_line;
  const showVerdictChapter = hasVerdict || hasWhoSuits || hasMoneySplit;

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
      <CellStyles />
      <Masthead d={d} />

      {/* The verdict , Even pair (break-in + who-suits at half width) then the canonical
          full-width $100 cost-stack (T1: a single stacked bar earns the full column). */}
      {showVerdictChapter ? (
        <>
          <Movement index={cn()} eyebrow="The verdict" heading="What it takes, and what it pays" icon="gut-check" />
          <div className="space-y-4">
            {hasVerdict || hasWhoSuits ? (
              <Row>{hasVerdict ? <HonestTake d={d} /> : null}{hasWhoSuits ? <WhoSuits d={d} /> : null}</Row>
            ) : null}
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
              {hasOwner || hasBreakEven ? (
                <WideRail>{hasOwner ? <OwnerKeeps d={d} /> : null}{hasBreakEven ? <BreakEven d={d} /> : null}</WideRail>
              ) : null}
              {hasSetup || hasWages ? (
                <Row>{hasSetup ? <CostToOpen d={d} /> : null}{hasWages ? <Wages d={d} /> : null}</Row>
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
