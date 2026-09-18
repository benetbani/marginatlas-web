/**
 * Cell page (a trade in a place) , SPINE rebuild BODY (SpineCellBody).
 *
 * THE ORDER IS MODEL.md 8.6's (plan step 33, 2026-09-18, the first of six
 * dispatches): the opening full width (`00 take`), then the band `01 spread
 * | 02 suits`; chapter turn one, what it costs to open and to run (`03
 * permits | 04 open`, `05 split | 06 team`, `07 peers` full width); turn two,
 * what it takes to keep it open (`08 clears | 09 lasts`, `10 watch | 11
 * mix`); turn three, what the trade is like (`12 market`, the bento); the
 * exit (`13 rivals | 14 worth`, `15 close` full width). The country view's
 * idiom, exactly: the builders built once at the top of the body, a band
 * seated only when a card exists, `Movement` with an index and a heading and
 * nothing else, no rail (the trade page carries none). Three full widths,
 * R1: the take, the peers, the close.
 *
 * WHAT THE FIRST DISPATCH BUILT: `00 take` on the answer card (masthead.tsx,
 * the one net builder behind its companion), `01 spread` on the range strip
 * and `02 suits` on the note list (below). WHAT IT RETIRED: the old
 * masthead's client island, crumb, answer sentence, break-in word and docked
 * strip (masthead.tsx says which law each broke); the WhoSuits tier band
 * (`who_suits.scales`, never populated on the live route, a coined 0 to 100
 * read, clause 17; `02` answers the question in prose); and the imported
 * WhoItSuits card (`02` is its seat, on the archetype).
 *
 * WHAT THE SECOND DISPATCH BUILT (2026-09-18): the band `03 permits | 04
 * open` at 2-3 on turn-one.tsx, the permits on KvGrid over the shard's
 * licences (permits_rows.ts) and the cost to open in its three states
 * (open_rows.ts: RankedBars held, BentoMetric baseline and withheld), the
 * foot's months to break even and years to pay back off the shard on all
 * three. WHAT IT RETIRED: the ramp's phase bar (its figure lives in `04`'s
 * foot now, off the shard for 243 trades instead of the one bundled seed)
 * and the old cost to open on the LollipopColumn (five of nine lines drawn,
 * the rest behind a disclosure of justify-between rows, a payback derived
 * from the picker; `04` draws every line as one set with the shard's own
 * payback). LollipopColumn itself stays in forms-v2 for its other callers.
 *
 * WHAT STAYS MOUNTED UNTIL ITS OWN DISPATCH, each of today's cards in the
 * seat of the 8.6 block that absorbs it (SPINE.md PART A's inventory), and
 * retiring nothing a later block absorbs:
 *   split (MoneySplit)      -> `05 split`, IncomeBreakdown
 *   keeps (OwnerKeeps)      -> CUT at `05`'s dispatch (a second drawing of
 *                              the split's figures); stands alone after the
 *                              `05 | 06` band until then
 *   wages (Wages)           -> `06 team`, TiersTable
 *   peers (Nearby)          -> `07 peers`, CompareTable full width; in a
 *                              band until then, because a full width with no
 *                              wide-table sanction reds the section-bands
 *                              gate (its baseline for this page is 0)
 *   breakeven (BreakEven)   -> `08 clears`, the ring
 *   myth (Myth)             -> `09 lasts`, the survival KvGrid (R5)
 *   risks (Risks)           -> `10 watch`, his B1, data-blocked and seated
 *   week + catchment        -> `11 mix`, the donut (channels); the dayparts
 *   (Demand)                   donut is cut there; both self-omit on the
 *                              live route today
 *   seasonality             -> `12 market`, one cell of the bento; self-omits
 *                              on the live route today
 *   related (Related)       -> `13 rivals`, MarkList; self-omits on the live
 *                              route today
 *   format (FormatPicker)   -> CUT at the money chapter's dispatch (the
 *                              industry page's subject); self-omits on the
 *                              live route today (no subtypes)
 *   close (Close)           -> `15 close`, Terminus
 *
 * THE THIRD CHAPTER BREAK draws when a card stands under it (the city
 * view's own rule for its turn three): today `12 market` is not built and
 * seasonality and related self-omit on the live route, so on London the
 * heading would sit over nothing until `12` lands; a heading over empty
 * space is the fault the old body already guarded against. Turns one and
 * two always hold a card on a resolving cell.
 *
 * (The paragraph below is the old header, kept for the chart dictionary it
 * carries of the cards still mounted; the counted bars and free forms it
 * names retire card by card with the dispatches above.)
 *
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
 *   ClearanceRing (idea I7, area, cap 1: the ring closes AT break-even and the
 *      surplus takes a second lap outside it): BreakEven x1. It replaced a
 *      two-marker scale on 2026-09-02, subsection queue row A4.
 *   editorial table (figures + bold-best, no in-cell bars): Nearby x1
 *   waterfall (gross -> labeled decrements -> net, from the $100 split): OwnerKeeps x1 (max 1)
 *   spread strip: masthead turnover p10/p50/p90 x1
 *   pay table, three roles across a lowest / typical / highest (idea I8, free):
 *      Wages x1. It replaced three hand-rolled range brackets on a shared rail
 *      on 2026-09-02, subsection queue row A8, which also closes queue row C1.
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
import { spineCellSeed } from "@/lib/spine-seeds";
import {
  Fig, Box, Rail, Movement, Full, WideRail, Donut, StackBar, ShareStack, InfoTip, StruckLine, TERRA, usd, Band,
} from "@/components/spine/kit";
import { Masthead } from "./masthead";
import { FormatPicker, FormatProvider } from "./format-picker";
import { OwnerKeeps, BreakEven } from "./money-chapter";
import { PermitsCard, OpenCard } from "./turn-one";
import { buildPermits } from "@/lib/spine/permits_rows";
import { buildOpen } from "@/lib/spine/open_rows";
import { Nearby, Wages, Risks } from "./interactive";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { buildTradeSpread } from "@/lib/spine/trade_spread_rows";
import { buildSuits } from "@/lib/spine/suits_rows";
import { COPY } from "@/lib/spine/copy";

const X: any = spineCellSeed;

const money = usd; // ONE money grammar page-set-wide (kit usd: exact below $10,000, $426K, $1.4M)

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

  /* THE PRICE OF NORMALISING, paid here rather than left as a trap.
     Stretching the slices to fill the track is right for a one-point rounding
     drift and WRONG for a split that is genuinely broken: a stack summing to 70
     used to show an unmissable third of empty track, and normalised it would
     quietly draw as a full, confident, entirely false hundred dollars. So the
     bar is allowed to stretch only over a rounding-sized gap, and refuses to
     draw at all beyond that.
     The tolerance is four points against a measured worst case of one, so on
     today's pipeline this never fires. It is not for today's pipeline. It is
     for the day the upstream split changes shape and nothing else notices. */
  const total = segments.reduce((a, s) => a + (Number.isFinite(s.pct) ? s.pct : NaN), 0);
  if (!Number.isFinite(total) || Math.abs(total - 100) > 4) return null;
  return (
    <Box id="split">
      {/* sample: the kept 7% is a modeled cost-structure share, not a measured net
          margin by city (rulebook 4A/5); the tag marks it so it never reads as real. */}
      <Rail icon="cost-breakdown" kicker="Where each $100 of sales goes" sample />
      {/* NORMALISE. Measured 2026-08-22, not assumed: the five slices are scaled
          to sum to exactly 100 as decimals, then each is rounded on its own, and
          across 320 realistic splits that lands off 100 in 39% of cases. When it
          lands SHORT, and it does in 20% of cases, the bar stops before the end
          of its own track and leaves a pale notch, on a section whose entire
          claim is that these five parts ARE the hundred dollars. A gap reads as
          a sixth cost nobody named.
          The prediction that the over-100 case would CLIP the terracotta kept
          slice was wrong, and the browser said so: flex shrinks the row back to
          the track, so those cases were already correct. Only the short ones
          were broken. Widths change by at most one point; no printed figure
          moves. The legend still prints the caller's real numbers. */}
      <StackBar segments={segments} normalize ariaLabel={segments.map((p) => `${p.label} ${p.pct}%`).join(", ")} legend />
    </Box>
  );
}

/* ================= THE OPENING BAND, `01 spread | 02 suits` ================= */
/**
 * A year's takings, `01 spread` (MODEL.md 8.6; plan step 33's first dispatch,
 * 2026-09-18): the range strip, three marks, linear, the typical the card's
 * one 30 in ink (the strip's `lead`, the city strip's precedent, M3), the
 * outer marks at 14, no accent (the opening's accent is spent on `00`). The
 * marks come from trade_spread_rows.ts off the seed's `headline`: on London
 * the three are fixed multipliers of the typical (0.5, 1, 1.8), a modelled
 * shape, and the basis says so in 8.6's own words; on a trusted local cell
 * off London the cell's own bottom and top tenth, measured. Off `moneyShown`
 * the card stands with its opener and the withheld line at the lead rung
 * where the figure would (the running-costs card's idiom; the builder's
 * header says why not a sample), and FOCAL names it until the data lands.
 * Dot family, off the bar ledger (M10), the LEFT seat of the band.
 */
function Spread({ d }: { d: any }) {
  const s = buildTradeSpread(d);
  if (!s) return null;
  return (
    <Box id="spread">
      <Rail icon="spread" kicker={COPY.tradeSpread.kicker} sample={s.sample} />
      {s.marks.length > 0 ? (
        <RangeStrip marks={s.marks} scale="linear" fmt={usd} basis={s.basis ?? ""} />
      ) : (
        <p data-withheld-line="spread" className="mt-2 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{s.withheld}</p>
      )}
    </Box>
  );
}

/**
 * Who this suits, `02 suits` (MODEL.md 8.6; the same dispatch): THE PAGE'S
 * ONE PROSE SECTION (R9, `data-editorial="1"` through NoteList's default),
 * on NoteList's law: two notes off the trade's authored character (who does
 * well, think twice) and the two checks from the country's one string bank
 * phrased as questions (M20, R10), four notes on every trade, the
 * not-gathered row where a trade holds no character (no live trade today;
 * suits_rows.ts counts 243 of 243 and says why the brief's three was a
 * miscount). No figure on the card: the opening band's rest point. The
 * basis says whose words the notes are and that the questions score
 * nothing. The Rail's sample flag is on because the notes are authored, not
 * measured (the locals card's own idiom). The RIGHT seat of the band. The
 * old WhoSuits tier band (`who_suits.scales`, a coined 0 to 100 read never
 * populated on the live route) and the imported WhoItSuits card left with
 * this dispatch.
 */
function Suits({ d }: { d: any }) {
  const industryId: string | undefined = typeof d.meta?.industry_id === "string" ? d.meta.industry_id : undefined;
  const iso2: string | undefined = typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined;
  if (!industryId || !iso2) return null;
  const s = buildSuits(industryId, iso2);
  return (
    <Box id="suits">
      <Rail icon="who-for" kicker={COPY.tradeSuits.kicker} sample />
      <NoteList notes={s.rows} columns={2} />
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{s.basis}</p>
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
      <Box data-block="week" className="flex flex-col">
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
      <Box data-block="catchment">
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
  const PLOT = 78; // px of drawable column height, under a gutter that holds the two marks
  const MONTHS_ROW = 15; // the baseline rule plus the month initials beneath it, at the ladder floor
  const RULE = (100 / top) * PLOT + MONTHS_ROW; // the index-100 line, measured from the block bottom
  return (
    <Box data-block="seasonality" className="md:flex-[2]">
      <Rail icon="seasonality" kicker="Busy months and quiet months" sample />
      {/* DRAWN IN LAYOUT, NOT IN A STRETCHED PICTURE.
          This was a 300-unit wide drawing stretched to whatever width the card
          landed at, with aspect ratio preservation switched OFF and the height
          pinned. Every letter in it, the month initials, the axis mark, the two
          values, was therefore scaled HORIZONTALLY ONLY: squeezed narrow in a
          phone column and pulled wide in a full band. Not merely resized,
          distorted, because the horizontal and vertical scales differed by more
          than two and a half times at the wide end.
          Columns whose heights are percentages fix it outright: the bars stretch
          with the card and the text is real text at a real size that never
          moves. It also stays on the server with no JavaScript, which a chart
          library could not have done.
          THE PAID BLOCK WAS PULLED AND READ FIRST. It is a recharts bar chart in
          a card, and after refusing what it ships switched on, the rounded tops,
          the hover tooltip carrying the values, the axis ticks, the card heading
          duplicating the section heading above it, and terracotta on every
          single month against the rule that no month may ever be featured,
          nothing of it would have remained. */}
      {/* THE AXIS MARK AND ITS RULE ARE POSITIONED FROM THE SAME BOX.
          The first pass hung the "100" in a sibling column and the dashed rule
          inside the plot, so the two were measured from different bottoms and
          sat about eighteen pixels apart: an axis label pointing at nothing.
          Both now share one offset, so they cannot drift. Measured in a browser
          afterwards rather than trusted. */}
      <div
        className="relative mt-1 pl-6"
        role="img"
        aria-label={`Monthly demand index, zero-based columns. The busiest month reads ${m[peak]}, the quietest ${m[trough]}, against an index of 100.`}
      >
        <span
          aria-hidden
          className="absolute left-0 w-5 text-right text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]"
          style={{ bottom: `${RULE - 4}px` }}
        >
          100
        </span>
        <div
          aria-hidden
          className="absolute inset-x-0 left-6 border-t border-dashed border-[var(--c-border)]"
          style={{ bottom: `${RULE}px` }}
        />
        <div className="flex items-end" style={{ height: PLOT + 14 }}>
          {m.map((v, i) => (
            <div key={i} className="relative flex min-w-0 flex-1 flex-col items-center justify-end">
              {/* the busy and quiet months carry their value ON the column
                  (rulebook 26), neutral ink, never a featured month (rule 37) */}
              {i === peak || i === trough ? (
                <span
                  className="absolute inset-x-0 text-center leading-none"
                  style={{ bottom: `${(v / top) * PLOT + 3}px` }}
                >
                  <Fig className="text-[length:var(--t-mark)] text-[var(--c-ink)]">{v}</Fig>
                </span>
              ) : null}
              {/* 64% of its slot, which is the proportion the old drawing used.
                  A fixed pixel gap looked right in a phone column and turned the
                  wide band into a solid block of bars: caught by photographing
                  it, not by reading it. */}
              <div
                aria-hidden
                className="w-[64%] rounded-[1.5px]"
                style={{ height: `${(v / top) * PLOT}px`, background: "var(--chart-5)" }}
              />
            </div>
          ))}
        </div>
        {/* the zero baseline, drawn */}
        <div aria-hidden className="border-t border-[var(--chart-5)]" />
        <div className="mt-1 flex">
          {m.map((_, i) => (
            <span key={i} className="min-w-0 flex-1 text-center text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]">
              {MONTHS[i]}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">Monthly demand, indexed; the dashed rule marks 100.</div>
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
export function Myth({ d }: { d: any }) {
  const my = d.myth ?? {};
  const s = my.survival ?? {};
  const survival: Array<[string, number]> = [["Yr 1", s.year1_pct], ["Yr 3", s.year3_pct], ["Yr 5", s.year5_pct]]
    .filter(([, v]) => typeof v === "number") as Array<[string, number]>;
  return (
    <Box id="myth" className="md:flex-[3]">
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
  /* THE DRAWING STRETCHES. THE WORDS DO NOT.
     This was one fixed 320-unit picture given the card's full width with its
     height pinned and its aspect ratio LOCKED, which does not stretch it: it
     scales the whole thing to FIT, and with the height already at its limit the
     scale stays at one. So on any card wider than 320 the chart drew at its
     native size and sat centred with blank space either side, a half-width
     drawing floating in a full-width band.
     Unlocking the ratio alone would repeat the fault fixed on the year chart,
     where every letter got stretched sideways. So the SVG now holds the PATHS
     ONLY and stretches freely, while every readable thing, the three readings,
     the year names and the struck folklore words, is real text in the page laid
     over it. The horizontal scale is the only one that changes, so a percentage
     puts a DOM element exactly on its path point, and a viewBox unit stays a
     pixel vertically. */
  const W = 320, H = 110, padL = 8, padR = 8, padTop = 22, padBot = 26;
  const min = 0, max = 100;
  const X = (i: number) => padL + (i / (points.length - 1)) * (W - padL - padR);
  const Y = (v: number) => padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBot);
  const leftPct = (i: number) => (X(i) / W) * 100;
  /* THE END LABELS ANCHOR INWARD. Centring a label on its own point is right in
     the middle of a chart and wrong at either end: once the drawing filled the
     card, the first and last readings hung half outside it and "Yr 5" wrapped
     onto two lines. Caught by photographing the fix, not by writing it. The
     same anchor rule the break-even marker and the risk scale already use. */
  const anchor = (i: number) =>
    i === 0 ? "translateX(0)" : i === points.length - 1 ? "translateX(-100%)" : "translateX(-50%)";
  const coords = points.map(([, v], i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  const line = "M " + coords.join(" L ");
  const area = `M ${X(0).toFixed(1)},${(H - padBot).toFixed(1)} L ` + coords.join(" L ") + ` L ${X(points.length - 1).toFixed(1)},${(H - padBot).toFixed(1)} Z`;
  const phantomPts: Array<[number, number]> = [[X(0), Y(FOLKLORE_SURVIVAL_PCT)], [X(points.length - 1), Y(FOLKLORE_SURVIVAL_PCT)]];
  return (
    <div className="mt-3 border-t border-[var(--c-border)] pt-3">
      <div
        className="relative w-full"
        style={{ height: H }}
        role="img"
        aria-label={`Still trading: ${points.map(([l, v]) => `${l} ${v}%`).join(", ")}. Folklore claims 9 in 10 fail in the first year, struck out on the same chart.`}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {/* neutral fill: the line's carrier is grey, so the fill is too , the ONE accent
              in this box is the year-one node + figure (the myth being busted) */}
          <path d={area} fill="var(--chart-4)" opacity={0.08} />
          <path d={line} fill="none" stroke="var(--chart-5)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <StruckLine points={phantomPts} label={FOLKLORE_LABEL} hideLabel />
        </svg>
        {points.map(([label, v], i) => {
          const lead = i === 0;
          return (
            <React.Fragment key={label}>
              <span
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                style={{ left: `${leftPct(i)}%`, top: `${Y(v)}px`, width: lead ? 8 : 6, height: lead ? 8 : 6, background: "var(--c-ink)" }}
              />
              {/* INK ON THE YEAR-ONE NODE AND FIGURE (plan step 33's first dispatch,
                  2026-09-18): the page's loud moments are 8.6's three (`00`, `04`,
                  `08`) and PART 6 sends every other terracotta figure to ink; this
                  card is `09 lasts`'s seat until the survival grid replaces it. */}
              <span className="absolute leading-none" style={{ left: `${leftPct(i)}%`, top: `${Y(v) - 19}px`, transform: anchor(i) }}>
                <Fig className={`text-[length:var(--t-micro)] ${lead ? "font-semibold text-[var(--c-ink)]" : "font-medium text-[var(--c-ink)]"}`}>{v}%</Fig>
              </span>
              <span className="absolute whitespace-nowrap text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]" style={{ left: `${leftPct(i)}%`, top: `${H - 13}px`, transform: anchor(i) }}>
                {label}
              </span>
            </React.Fragment>
          );
        })}
        {/* THE CAPTION NAMES THE CLAIM, IT IS NOT A SECOND STRIKE. It carried a
            line through its own text while the dashed line it labels was already
            struck: one idea cancelled twice, which reads as a mistake rather than
            a finding, and it is the pile the founder described on 2026-08-25. */}
        <span
          aria-hidden
          className="absolute text-[length:var(--t-mark)] leading-none text-[var(--c-muted)]"
          style={{ right: `${100 - leftPct(points.length - 1)}%`, top: `${Y(FOLKLORE_SURVIVAL_PCT) - 15}px` }}
        >
          {FOLKLORE_LABEL}
        </span>
      </div>
      {/* one-line legend only (rulebook 26): names the two lines so the real curve reads
          against the struck folklore phantom. No sentence, no verdict, no "read". */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-[2px] w-4 rounded-full" style={{ background: "var(--chart-5)" }} />still trading</span>
        <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-0 w-4 border-t border-dashed" style={{ borderColor: "var(--c-line-strong)" }} />folklore</span>
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
    <Box data-block="related" className="md:flex-[3]">
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
    /* THE DESTINATION NOW MATCHES THE PROMISE. This row said "compare X across
       nearby markets" and went to the industries INDEX, a directory of trades,
       not a comparison of anywhere. The page it describes exists and this cell
       knows its own slug, so the link goes there. It falls back to the index only
       when the slug is missing, which is a real directory rather than a wrong one.
       AND IT NO LONGER STARTS WITH "COMPARE". The only other action in this
       section is "Compare this trade with Pro", so a reader met two doors whose
       first word was identical and had to read to the end of both to tell them
       apart. This one names where it goes. */
    { t: `See ${trade} in other cities`, href: d.meta?.industry ? `/industries/${d.meta.industry}` : "/industries" },
    ...(rel[0]
      ? [{ t: `Look at ${rel[0].name.toLowerCase()} in ${city} instead`, href: rel[0].slug && placePrefix ? `${placePrefix}/${rel[0].slug}` : undefined }]
      : []),
    ...(hasSubtypes ? [{ t: "See what an owner keeps, format by format" }] : []),
  ];
  return (
    <Box id="close">
      <div>
        <div className="max-w-2xl">
          {/* the asserted "bottom line" verdict paragraph and the forward "where the same
              work keeps more" line are BOTH deleted (rulebook 15/19: a section's data shows
              the conclusion, the copy never asserts it). This is a navigation terminus: the
              label points at the next steps below, it states no finding. */}
          <h3 data-typography="custom" className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">Where to next</h3>
        </div>
      </div>
      {/* THE DOORS SIT IN ONE ROW AND THE ROW HAS AS MANY COLUMNS AS IT HAS DOORS.
          Two faults, one shape. The row was fixed at three columns and this page
          resolves ONE link, so two thirds of it were empty. And the paid door was
          pinned to the far right of a header whose only other content was a
          nine-word label in micro caps, which left a dead band across the middle
          of a full-width card. Photographed at 1280: 1072 by 137, and most of it
          nothing.
          The paid door now sits with the others as the last item, which is what it
          is, and the column count follows the number of doors, so the row is full
          at one door or at four. */}
      {/* A ROW THAT DISTRIBUTES, RATHER THAN COLUMNS THAT ARE COUNTED.
          The first attempt at this picked a column count from the number of doors,
          which meant writing three different breakpoint layouts where there had
          been one, and the width gate refused it: this repo already carries
          fifty-odd grids whose second layout is pitched at a width no phone
          reaches and it will not take more. The gate was right, and the rewrite is
          better than what it rejected. A distributing row needs no arithmetic at
          all: it is full with one door and full with four, it wraps instead of
          leaving empty cells, and it removes a breakpoint layout rather than
          adding three. */}
      <div className="mt-4 flex flex-col items-start gap-3 border-t border-[var(--c-border)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
        {links.map((l, i) =>
          l.href ? (
            <a key={i} href={l.href} className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--terra-text)]">{l.t} &#8594;</a>
          ) : (
            <span key={i} className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)]">{l.t}</span>
          )
        )}
        <a href="/pricing" className="rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-center text-[length:var(--t-body)] font-semibold text-white transition-colors hover:bg-[var(--terra-text)]">
          Compare this trade with Pro &#8594;
        </a>
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

  /* WHO IS HOME, ASKED ONCE (the country view's idiom): each card's presence,
     so a band is drawn when a card exists and not otherwise, and a heading
     never sits over nothing. The opening's two cards build for every
     resolving cell (the strip stands withheld off `moneyShown`, the notes
     draw on every trade), so the band always holds two children. */
  const hasSpread = buildTradeSpread(d) != null;
  const hasSuits = typeof d.meta?.industry_id === "string" && typeof d.meta?.iso2 === "string";
  const hasMoneySplit = Array.isArray(d.money_split?.items) && d.money_split.items.length > 0;
  const hasDemand =
    Array.isArray(d.demand?.dayparts) ||
    Array.isArray(d.demand?.channels) ||
    Array.isArray(d.demand?.catchment);
  const hasSubtypes = Array.isArray(d.subtypes?.items) && d.subtypes.items.length > 0;
  /* `03 permits | 04 open` (turn-one.tsx): both builders on every resolving
     cell whose trade holds a shard (243), the permits off the licences and
     the cost to open in whichever of its three states the cell is in, so the
     band always holds two children; a sector-average cell (industry_id
     `default`, no shard) draws neither and the band does not draw. */
  const permits = buildPermits(d.meta?.industry_id);
  const open = buildOpen(d);
  const hasOwner = hasMoneySplit;
  const hasBreakEven = typeof d.break_even?.covers_per_day === "number";
  const hasWages = Array.isArray(d.wages?.roles) && d.wages.roles.length > 0;
  const hasSeasonality = Array.isArray(d.seasonality?.months) && d.seasonality.months.length >= 2;
  const hasRisks = Array.isArray(d.risks?.items) && d.risks.items.length > 0;
  const hasNearby = Array.isArray(d.nearby?.places) && d.nearby.places.length > 0;
  const hasMyth = !!d.myth?.claim;
  const hasRelated = Array.isArray(d.related) && d.related.length > 0;
  /* The turns, by whether a card stands under each (the header says why the
     third waits on `12 market`): turn one holds the money cards, turn two
     the ring, the survival curve and the risks, turn three the seasonality
     alone today. */
  const turnOne = !!(permits && open) || hasMoneySplit || hasWages || hasOwner || hasNearby || hasSubtypes;
  const turnTwo = hasBreakEven || hasMyth || hasRisks || hasDemand;
  const turnThree = hasSeasonality;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      {/* `00 take`, FULL WIDTH, the page's only 40 (8.6, loud one): the answer
          card draws its own hero band, the attribute the full-width gate reads. */}
      <Masthead d={d} />
      {/* `01 spread | 02 suits`, 1-1, the opening's one band (8.6): is the money
          in the range I pictured, and am I the kind of person this suits. The
          strip LEFT (the dot family's seat, M10), the notes RIGHT, both quiet.
          MEASURED at 1-1 after it was seated (the dispatch's report carries
          the numbers): 8.6's own expectation was that five notes would open
          air under the strip and the split would move to 2-3 with `02` wide;
          the card holds four notes, and the measurement decided the split. */}
      {hasSpread || hasSuits ? (
        <Band split="1-2" stack="lg">
          <Spread d={d} />
          <Suits d={d} />
        </Band>
      ) : null}

      {/* CHAPTER TURN ONE (8.6, "What it costs to open, and to run", the site's
          string, M7): the kit's Movement, the muted index and one plain
          heading, no eyebrow and no icon (8.4). */}
      {turnOne ? (
        <>
          <Movement index="01" heading={COPY.tradeChapters.costs} />
          {/* `03 permits | 04 open`, the permits narrow LEFT and the cost to open
              wide RIGHT in all three of its states (8.6), AT 1-2, RULED BY
              MEASUREMENT 2026-09-18 (8.4 rule 1, the closed set): at 8.6's
              expected 2-3 the exemplar's held card stood 610 (nine setup lines
              as a table) against the four-cell licence grid's 268, a 376 by
              342 hole and 40 percent ink at 1280; with the bill's five biggest
              lines drawn and the rest stated (open_rows.ts) the card is 426,
              and at 1-2 the grid's labels wrap to its phone form, 316, so the
              air under it is 110, under the 120 floor, 0 holes at three
              widths; at 2-3 it would still be 133. The baseline and withheld
              states hold at either split (269 and 238 against the grid at
              2-3, measured). `stack="lg"` because without it the grid at a
              tablet's 344 stretched to the bill's height with 373 of air
              (measured). Both cards draw on every cell whose trade holds a
              shard. */}
          {permits && open ? (
            <Band split="1-2" stack="lg">
              <PermitsCard permits={permits} />
              <OpenCard open={open} />
            </Band>
          ) : null}
          <FormatProvider d={d}>
            {hasSubtypes ? <Full><FormatPicker d={d} /></Full> : null}
            {/* `05 split | 06 team`, 3-2 in 8.6, the split wide LEFT (fill-bar one,
                M10) and the team narrow RIGHT. TODAY'S CARDS CANNOT SEAT THAT
                PAIR, MEASURED 2026-09-18 with the page filter and the
                art-direction gate: the $100 stack's card (a bar and a legend,
                about 93 inside) stretched to the three-row wage table's 243
                opened a 584 by 150 hole at 3-2, and at 2-3 and 1-2 alike stood
                at 51 percent ink against the gate's E2 floor of 60 (a card that
                cannot fill its partner's height is re-paired, never
                unstretched, 8.4). So the stack stands alone in `05`'s seat
                position at the survivor's two thirds (LONE CARD, expected), and
                the waterfall, a second drawing of the same split that `05`'s
                dispatch cuts, stands beside the wage table at the 3-2 the old
                body measured and shipped: the waterfall wide LEFT in `05`'s
                column, the team narrow RIGHT in `06`'s. */}
            {hasMoneySplit ? (
              <Band split="2-1">
                <MoneySplit d={d} />
              </Band>
            ) : null}
            {hasOwner || hasWages ? (
              <Band split="3-2">
                {hasOwner ? <OwnerKeeps d={d} /> : null}
                {hasWages ? <Wages d={d} /> : null}
              </Band>
            ) : null}
          </FormatProvider>
          {/* `07 peers`, FULL WIDTH in 8.6 on CompareTable, closing turn one; today's
              Nearby table in a band at the survivor's two thirds until its
              dispatch (the header says why not full width yet). */}
          {hasNearby ? (
            <Band split="2-1">
              <Nearby d={d} />
            </Band>
          ) : null}
        </>
      ) : null}

      {/* CHAPTER TURN TWO (8.6, "What it takes to keep it open"): does an
          ordinary day cover the costs, and do places like this last. */}
      {turnTwo ? (
        <>
          <Movement index="02" heading={COPY.tradeChapters.keep} />
          {/* `08 clears | 09 lasts`, 1-1, the ring LEFT (loud three in 8.6) and the
              survival figures RIGHT: today's break-even ring and the myth's
              survival curve in their seats. The ring still reads the format
              context, so the provider wraps it here too. */}
          {hasBreakEven || hasMyth ? (
            /* MEASURED 2026-09-18: at 1-1 the ring (a fixed 168 drawing) beside the
               survival curve opened a 150 by 246 hole to its right at 1280; a ring
               cannot fill a width, so the width comes to the ring (the old body's
               own finding on this card) and the interim pair sits at 1-2 until the
               ring is redrawn at `08`'s dispatch. */
            <Band split="1-2">
              {hasBreakEven ? <FormatProvider d={d}><BreakEven d={d} /></FormatProvider> : null}
              {hasMyth ? <Myth d={d} /> : null}
            </Band>
          ) : null}
          {/* `10 watch | 11 mix`, 1-1, the risks LEFT (his B1's seat) and the
              channels RIGHT (the donut's): today's risks card in a band, and the
              demand rail (dayparts, channels, catchment) after it where it
              renders, which on the live route is nowhere. */}
          {hasRisks ? (
            <Band split="1-1">
              <Risks d={d} />
            </Band>
          ) : null}
          {hasDemand ? <Demand d={d} /> : null}
        </>
      ) : null}

      {/* CHAPTER TURN THREE (8.6, "What the trade is like"): the one-band turn,
          `12 market`, the bento; today's seasonality columns hold the seat
          where they render, and the heading waits on a card. */}
      {turnThree ? (
        <>
          <Movement index="03" heading={COPY.tradeChapters.trade} />
          <Band split="2-1">
            <Seasonality d={d} />
          </Band>
        </>
      ) : null}

      {/* THE EXIT (no chapter break, PART 1): `13 rivals | 14 worth`, then `15
          close` full width. Today's related links hold `13`'s seat where they
          render; `14` is not built. */}
      {hasRelated ? (
        <Band split="2-1">
          <Related d={d} />
        </Band>
      ) : null}
      {/* `15 close`, FULL WIDTH (8.6, R1): the terminus, as built until its
          dispatch, on the hero band the full-width gate reads. */}
      <div className="mt-6 mb-2">
        <Band hero><Close d={d} /></Band>
      </div>
    </main>
  );
}
