/**
 * src/lib/spine/open_rows.ts
 *
 * THE COST TO OPEN, the trade page's `04 open` (MODEL.md 8.6; plan step 33,
 * second dispatch, 2026-09-18). ONE CARD, THREE STATES BY DATA, and one
 * function returns whichever the cell is in, so the view never composes a
 * state of its own:
 *
 *  HELD, where the cell holds setup lines that name their country (`cell.setup_costs`
 *    through setup_items.ts, one bill per country, printed as its estimate; item 56 counts the cells): the
 *    lines as members of one set for RankedBars, biggest first, the total at
 *    30 over them as the card's focal and never as a sum the bars are read
 *    to make (M2: the sum reading is `05`'s), the biggest line the leader
 *    because it is the line to raise first (a reason a reader accepts, PART
 *    5), LOUD: turn one's accent, the second of the page's three.
 *    THE SET IS THE FIVE BIGGEST LINES, AND THE REST ARE STATED. 8.6 names
 *    the card's form vertical ("the two bar forms (vertical RankedBars,
 *    horizontal B1)", the rhythm line; the bar mass "sits right here and left
 *    in the next band"), and the archetype's own law draws vertical bars
 *    under six members and a table at six or more (PART 9 clause 20). The
 *    composition never counted the lines (item 56, "uncounted"); measured on
 *    2026-09-18, every held London cell carries nine (the adapter maps ten
 *    fields), so the whole set drew as a nine-row table 610px tall against a
 *    four-cell licence grid of 268, a 342px hole at 1280 that no split in the
 *    closed set closes, and four of the nine rows drew an empty track ($20,
 *    $500, $1,500, $2,000 against $250K: under the archetype's 2px floor, a
 *    bar saying nothing). So the builder hands RankedBars the five biggest
 *    lines (99.1 percent of the exemplar's bill) and states the rest in one
 *    line with their count and their sum (COPY.tradeOpen.tailMany), the
 *    MarkList precedent (a cap with the whole set named), never a silent
 *    drop; a cell with five lines or fewer draws them all and no line.
 *  WITHHELD, no setup lines: no total; where the trade's shard holds its two
 *    first-year figures the card earns it back instead (below); else the
 *    stated line stands where the focal would, at 16, so the card's height
 *    does not collapse; UNACCENTED, and turn one goes quiet on those pages,
 *    the page carrying two loud moments (8.6 says so plainly).
 *
 * NO TYPED COST TO OPEN (2026-10-15, release 2 job A). A BASELINE state stood
 * between these two until that day: no setup lines and the trade keyed in
 * src/lib/markets/startup_capital_archetypes.ts, a table typed by hand with no
 * source ("directional, drawn from general industry knowledge"), printed at 30
 * as the trade's typical cost to open, times the city's cost-of-living factor,
 * stamped with the table's own name as its source; and, from 2026-09-24, the
 * kinds of shop worked from that figure (`subtypes.list.*.capital_delta_pct`
 * times the typed base). It printed on up to 94 of the 138 London trade pages.
 * The law is that every figure comes from held data, so the state left: every
 * trade now takes the state the 44 unkeyed trades already shipped, the months
 * to break even and the years to pay back under "Earning it back", and the
 * kinds of shop leave with the base they were worked from (their own net
 * margins stand on `07 formats`).
 *
 * THE WITHHELD STATE EARNS IT BACK (2026-09-24, the goal's A4): it
 * printed "Not gathered yet: what it costs to open here." on 44 of the 138
 * live trades in London (counted on the renders of every one) and on the same
 * trades in every other British city, the NEVER list's card on a UK page.
 * What the card holds there is the foot's two figures, the months to break
 * even and the years to pay back, both the trade's, on all 243 shards; so
 * the card leads with them under its own opener ("Earning it back") and
 * says nothing about a cost it does not hold (`recover`). A cell whose trade
 * holds no shard (a retired trade on the `default` cell) keeps the old state.
 *
 * In every state the foot is two companion figures under a hairline at 16,
 * months to break even and years to pay back, from the trade's shard
 * (`first_year.ramp_to_breakeven_months`, `first_year.payback_years`, 243 of
 * 243, 3 held, every one printed as modelled, R12), and a foot line saying
 * so in words because the sample mark is behind his switch. A cell whose
 * trade holds no shard (a sector-average cell resolving to the `default` id)
 * takes the withheld foot line instead, never an empty hairline.
 *
 * Pure over the seed and the files, synchronous, no database: the stories,
 * the copy gate and the harness build every state from a seed.
 */
import type { BarRow } from "@/components/spine/archetypes/RankedBars";
import type { Companion } from "@/components/spine/archetypes/BentoBand";
import { industryFigure } from "@/lib/facts/industry_shard";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { Provenance } from "@/lib/spine/provenance";
import { own } from "@/lib/own";

export const OPEN_METRICS = { ramp: "first_year.ramp_to_breakeven_months", payback: "first_year.payback_years" } as const;
export type OpenState = "held" | "withheld";

/** How many lines the held card draws as bars: the archetype's vertical form holds under six. */
export const DRAWN_LINES_CAP = 5;

export type OpenData = {
  state: OpenState;
  /** Where the focal figure came from (plan 06, task B5): set on the held bill, its country's estimate (plan 2026-10-11). Absent elsewhere. */
  prov?: Provenance;
  /** HELD ONLY: whose bill it is, the label under the total (COPY.tradeOpen.heldScope). */
  focalWords?: string;
  /** The setup lines as RankedBars rows (held only): the biggest DRAWN_LINES_CAP of them; RankedBars sorts them. */
  rows: BarRow[];
  /** The lines past the cap (held only): their count and their sum, stated under the basis; null when every line draws. */
  tail: { count: number; sum: number } | null;
  /** The stated line for the tail, or null. */
  tailLine: string | null;
  /** Every line the cell holds, biggest first, before the cap (the gates read it). */
  lines: BarRow[];
  /** The leader: the biggest line's key (held only). */
  biggestKey: string | null;
  /** The card's focal as printed (held: the total), or null when withheld. */
  figure: string | null;
  /** The focal's value in dollars, or null when withheld. */
  value: number | null;
  /** The stated line where the focal would stand (withheld only). */
  withheld: string | null;
  /** The basis, null in the withheld state (no printed figure to describe). */
  basis: string | null;
  /** The two companions, months to break even and years to pay back; empty when the trade holds no shard. */
  foot: Companion[];
  /** The line under the companions: null where the basis already names the foot's figures as the trade's (held); the withheld line where there are none; the modelled sentence in the withheld state, which has no basis to carry it. */
  footLine: string | null;
  /** True in the held state: the total is the page's second loud moment. */
  accent: boolean;
  /** True when the printed figures are estimates: the held bill (one figure for a whole country) and the trade's two first-year figures. */
  sample: boolean;
  /** WITHHELD ONLY: the card leads with the foot's two figures under "Earning it back" and prints no stated line; false where the trade holds no shard (the old withheld state stands). */
  recover: boolean;
  confidence: "measured" | "modeled";
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
/** The tail's count in words, the way a person says it; a count past nine prints as digits. */
const WORDS: Record<number, string> = { 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine" };

/** "6 months", "1 month": the ramp's own unit, whole months as the file holds them. */
export const monthsFigure = (m: number) => (Math.round(m) === 1 ? "1 month" : `${Math.round(m)} months`);
/** "2.5 years", "1 year", "0.8 years": one decimal where the file holds one, the payback's own unit. */
export const yearsFigure = (y: number) => {
  const r = Math.round(y * 10) / 10;
  return r === 1 ? "1 year" : `${Number.isInteger(r) ? r : r.toFixed(1)} years`;
};

/** Where a trade's shard figure was read: the file and the key, an estimate. */
export const shardProv = (industryId: string, metric: string): Provenance => ({ src: `data/facts/industry/${industryId}.json:${metric}`, kind: "estimate" });

/** The foot's two companions off the trade's shard, in the order 8.6 names them. */
export function buildOpenFoot(industryId: string | null | undefined): Companion[] {
  if (!industryId) return [];
  const out: Companion[] = [];
  /* Each figure stamped with the shard file and its key, an estimate (2026-10-15, release 2 job A): the same two on the trade page, on /opening and on /buy-or-start. */
  const ramp = industryFigure(industryId, OPEN_METRICS.ramp);
  if (ramp && ramp.value > 0) out.push({ figure: monthsFigure(ramp.value), words: COPY.tradeOpen.breakEven, prov: shardProv(industryId, OPEN_METRICS.ramp) });
  const pay = industryFigure(industryId, OPEN_METRICS.payback);
  if (pay && pay.value > 0) out.push({ figure: yearsFigure(pay.value), words: COPY.tradeOpen.payBack, prov: shardProv(industryId, OPEN_METRICS.payback) });
  return out;
}

/**
 * THE FORM THE CARD DRAWS, SAID ONCE (the goal's B12, 2026-09-24): the bars for
 * the bill, and the figure card (BentoMetric) for the months to earn it back and
 * for the stated line. (The list for the kinds of shop left on 2026-10-15 with the
 * typed base it was worked from.) `OpenCard` branches on
 * it and the view seats by it: a figure card takes the band's narrow third
 * beside the licences, the list and the bill the wide two thirds. Measured by
 * E7's sweep: the lone total sat in the wide two thirds on 40 of the 138 London
 * trades at 1280, stretched to the licence grid's height with a blank of about
 * 613 by 126 above and below its figure (craft breweries).
 */
export type OpenForm = "bill" | "metric";
export function openForm(open: OpenData): OpenForm {
  if (open.recover) return "metric";
  if (open.state === "held") return "bill";
  return "metric";
}

export function buildOpen(seed: any): OpenData | null {
  const meta = seed?.meta ?? {};
  const industryId: string | null = typeof meta.industry_id === "string" ? meta.industry_id : null;
  const slug: string | null = typeof meta.industry === "string" ? meta.industry : null;
  if (!industryId && !slug) return null;
  const foot = buildOpenFoot(industryId);
  const footLine = foot.length > 0 ? COPY.tradeOpen.foot : COPY.tradeOpen.footWithheld;

  /* HELD: a bill that names its country, printed as that country's estimate (plan 2026-10-11, uk:held-bill-provenance): one bill for every row of a country,
     never the place's own; a bill naming no country with words prints nothing. Rounded once here so the printed figure and the drawn bar are one number. */
  const scope: string | null = typeof seed?.setup?.scope === "string" ? seed.setup.scope : null;
  const scopeWords = own(COPY.tradeOpen.heldScope, scope);
  const heldProv: Provenance = { src: `setup_costs:${industryId ?? slug}:${scope}`, kind: "estimate" };
  const items: Array<{ name?: unknown; usd?: unknown }> = scopeWords && Array.isArray(seed?.setup?.items) ? seed.setup.items : [];
  const rows: BarRow[] = items
    .map((it, i) => ({ key: `line-${i}-${String(it.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: String(it.name ?? "").trim(), value: isNum(it.usd) ? Math.round(it.usd) : 0, prov: heldProv }))
    .filter((r) => r.name && r.value > 0);
  if (rows.length > 0) {
    const total = rows.reduce((a, r) => a + r.value, 0);
    const lines = [...rows].sort((a, b) => b.value - a.value);
    const drawn = lines.slice(0, DRAWN_LINES_CAP);
    const rest = lines.slice(DRAWN_LINES_CAP);
    const tail = rest.length > 0 ? { count: rest.length, sum: rest.reduce((a, r) => a + r.value, 0) } : null;
    const tailLine = tail ? (tail.count === 1 ? COPY.tradeOpen.tailOne.replace("{sum}", usd(tail.sum)) : COPY.tradeOpen.tailMany.replace("{n}", WORDS[tail.count] ?? String(tail.count)).replace("{sum}", usd(tail.sum))) : null;
    /* ONE BASIS, AS IN THE BASELINE STATE: it names the total, the bars and the
       foot's two modelled figures in one line, and the foot is the companions
       alone; where the trade holds no shard the total's own line stands and the
       foot is withheld with its own. */
    const basis = foot.length > 0 ? (tail ? COPY.tradeOpen.basisHeldCapped : COPY.tradeOpen.basisHeld) : (tail ? COPY.tradeOpen.basisHeldCappedAlone : COPY.tradeOpen.basisHeldAlone);
    return {
      state: "held", rows: drawn, tail, tailLine, lines, biggestKey: lines[0].key, figure: usd(total), value: total, withheld: null,
      prov: heldProv, focalWords: scopeWords,
      basis, foot, footLine: foot.length > 0 ? null : COPY.tradeOpen.footWithheld, accent: true, sample: true, confidence: "modeled",
      recover: false,
    };
  }

  /* EARNING IT BACK where the foot holds both figures (see the header); the old stated line only where the trade holds no shard. */
  if (foot.length === 2) {
    return {
      state: "withheld", rows: [], tail: null, tailLine: null, lines: [], biggestKey: null, figure: null, value: null, withheld: null,
      basis: COPY.tradeOpen.basisRecover, foot, footLine: null, accent: false, sample: true, confidence: "modeled",
      recover: true,
    };
  }
  return {
    state: "withheld", rows: [], tail: null, tailLine: null, lines: [], biggestKey: null, figure: null, value: null, withheld: COPY.tradeOpen.withheld,
    basis: null, foot, footLine, accent: false, sample: false, confidence: "modeled",
    recover: false,
  };
}
