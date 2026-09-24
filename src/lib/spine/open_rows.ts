/**
 * src/lib/spine/open_rows.ts
 *
 * THE COST TO OPEN, the trade page's `04 open` (MODEL.md 8.6; plan step 33,
 * second dispatch, 2026-09-18). ONE CARD, THREE STATES BY DATA, and one
 * function returns whichever the cell is in, so the view never composes a
 * state of its own:
 *
 *  HELD, where the cell holds real setup lines (`cell.setup_costs`, real,
 *    through adapt_cell.ts's `setup.items`; item 56 counts the cells): the
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
 *  BASELINE, no setup lines and the trade keyed in the archetype table
 *    (`startupCapitalArchetypeKeyed`, 153 of the 243 shard ids): the trade's
 *    typical cost to open at 30, marked modelled, never as this city's own
 *    figure (R3), LOUD: the accent marks the role the figure plays in the
 *    turn, not whether it was measured that day.
 *  WITHHELD, no setup lines and the trade on the 80,000 default (90 of 243;
 *    a fill value is never printed, R11) or a cell whose trade the table and
 *    the shards do not know: no total; the stated line stands where the
 *    focal would, at 16, so the card's height does not collapse; UNACCENTED,
 *    and turn one goes quiet on those pages, the page carrying two loud
 *    moments (8.6 says so plainly).
 *
 * THE BASELINE STATE NAMES THE KINDS OF SHOP (2026-09-24, the goal's B10).
 * One centred total stood in a card the licences beside it made 362 tall:
 * on London barbershops a blank 476 by 132 at 1280 and 1440 (the
 * gathered-emptiness gate, E6) and the level's no-visual row. Every shard
 * holds its formats with `subtypes.list.*.capital_delta_pct`, each format's
 * opening cost against the trade's typical (243 of 243, four or five a trade,
 * modelled), and the formats card's own header gives the only reason it never
 * printed them: "its base, the cost to open, is withheld on 90 of the 243" (a
 * figure worked from the default would stand on a fill). In THIS state the
 * base is the keyed table's figure, not the fill, so each format's cost is the
 * typical times one plus its difference, printed as an absolute (clause 15),
 * the format at nought the lead under its own name (the typical IS that shop),
 * the others the working, dearest first (`formats`). Under two other formats,
 * or with no format at nought, the card keeps the one total.
 *
 * THE WITHHELD STATE EARNS IT BACK INSTEAD (the same day, the goal's A4): it
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
import { industryFigure, industryRows } from "@/lib/facts/industry_shard";
import { startupCapitalArchetypeKeyed } from "@/lib/markets/startup_capital_archetypes";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

export const OPEN_METRICS = { ramp: "first_year.ramp_to_breakeven_months", payback: "first_year.payback_years" } as const;
/** The formats' names and their opening cost against the trade's typical, in percent (the shard's own fields). */
export const OPEN_FORMAT_METRICS = { name: "subtypes.list.*.name", delta: "subtypes.list.*.capital_delta_pct" } as const;
/** The working's floor: WorkedFigure draws its working from two items (its WORKING_MIN); fewer and the card keeps the one total. */
export const OPEN_FORMATS_WORKING_MIN = 2;

/** One kind of shop and what it costs to open: the typical times one plus its difference, rounded to the dollar. */
export type OpenFormat = { key: string; name: string; delta: number; value: number; figure: string };

export type OpenState = "held" | "baseline" | "withheld";

/** How many lines the held card draws as bars: the archetype's vertical form holds under six. */
export const DRAWN_LINES_CAP = 5;

export type OpenData = {
  state: OpenState;
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
  /** The card's focal as printed (held: the total; baseline: the trade's typical), or null when withheld. */
  figure: string | null;
  /** The focal's value in dollars, or null when withheld. */
  value: number | null;
  /** The stated line where the focal would stand (withheld only). */
  withheld: string | null;
  /** The basis, null in the withheld state (no printed figure to describe). */
  basis: string | null;
  /** The two companions, months to break even and years to pay back; empty when the trade holds no shard. */
  foot: Companion[];
  /** The line under the companions: null where the basis already names the foot's figures as the trade's (held, baseline); the withheld line where there are none; the modelled sentence in the withheld state, which has no basis to carry it. */
  footLine: string | null;
  /** True in the held and baseline states: the total is the page's second loud moment. */
  accent: boolean;
  /** True when the printed focal is modelled (baseline); the held total is the cell's own. */
  sample: boolean;
  /** BASELINE ONLY: the format at nought first (the typical under its own name), then the others dearest first; empty elsewhere and where fewer than OPEN_FORMATS_WORKING_MIN others can be worked. */
  formats: OpenFormat[];
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

/** The foot's two companions off the trade's shard, in the order 8.6 names them. */
export function buildOpenFoot(industryId: string | null | undefined): Companion[] {
  if (!industryId) return [];
  const out: Companion[] = [];
  const ramp = industryFigure(industryId, OPEN_METRICS.ramp);
  if (ramp && ramp.value > 0) out.push({ figure: monthsFigure(ramp.value), words: COPY.tradeOpen.breakEven });
  const pay = industryFigure(industryId, OPEN_METRICS.payback);
  if (pay && pay.value > 0) out.push({ figure: yearsFigure(pay.value), words: COPY.tradeOpen.payBack });
  return out;
}

/**
 * The kinds of shop off the trade's shard, worked from the typical total the
 * baseline state prints: the format whose difference is nought leads (the first
 * in the file's order where two are), the rest follow dearest first. Empty where
 * the shard holds no format at nought or fewer than two others with a figure.
 */
export function buildOpenFormats(industryId: string | null | undefined, typical: number): OpenFormat[] {
  if (!industryId || !(typical > 0)) return [];
  const names = industryRows(industryId, OPEN_FORMAT_METRICS.name);
  const deltas = new Map(industryRows(industryId, OPEN_FORMAT_METRICS.delta).map((f) => [f.rowKey, f.value] as const));
  const all: OpenFormat[] = [];
  for (const n of names) {
    const delta = deltas.get(n.rowKey);
    const name = typeof n.value === "string" ? n.value.trim() : "";
    if (!name || !isNum(delta)) continue;
    const value = Math.round(typical * (1 + delta / 100));
    if (!(value > 0)) continue;
    all.push({ key: String(n.rowKey), name, delta, value, figure: usd(value) });
  }
  const lead = all.find((f) => f.delta === 0);
  if (!lead) return [];
  const rest = all.filter((f) => f !== lead).sort((a, b) => b.value - a.value);
  return rest.length >= OPEN_FORMATS_WORKING_MIN ? [lead, ...rest] : [];
}

/**
 * THE FORM THE CARD DRAWS, SAID ONCE (the goal's B12, 2026-09-24): the list for
 * the kinds of shop, the bars for the bill, and the figure card (BentoMetric)
 * for the months to earn it back and for a lone total. `OpenCard` branches on
 * it and the view seats by it: a figure card takes the band's narrow third
 * beside the licences, the list and the bill the wide two thirds. Measured by
 * E7's sweep: the lone total sat in the wide two thirds on 40 of the 138 London
 * trades at 1280, stretched to the licence grid's height with a blank of about
 * 613 by 126 above and below its figure (craft breweries).
 */
export type OpenForm = "list" | "bill" | "metric";
export function openForm(open: OpenData): OpenForm {
  if (open.state === "baseline" && open.formats.length > 0) return "list";
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

  /* HELD: the cell's own lines. Rounded once here so the printed figure and the drawn bar are one number. */
  const items: Array<{ name?: unknown; usd?: unknown }> = Array.isArray(seed?.setup?.items) ? seed.setup.items : [];
  const rows: BarRow[] = items
    .map((it, i) => ({ key: `line-${i}-${String(it.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: String(it.name ?? "").trim(), value: isNum(it.usd) ? Math.round(it.usd) : 0 }))
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
      basis, foot, footLine: foot.length > 0 ? null : COPY.tradeOpen.footWithheld, accent: true, sample: false, confidence: "measured",
      formats: [], recover: false,
    };
  }

  /* BASELINE: the trade's keyed figure. WITHHELD: the default, or no key at all. */
  const keyed = startupCapitalArchetypeKeyed(slug);
  if (keyed != null) {
    /* One sentence for the three figures where the companions print (all of them the trade's, modelled); the total's own sentence and the withheld foot where they do not. */
    const formats = buildOpenFormats(industryId, keyed);
    return {
      state: "baseline", rows: [], tail: null, tailLine: null, lines: [], biggestKey: null, figure: usd(keyed), value: keyed, withheld: null,
      basis: formats.length > 0 ? (foot.length > 0 ? COPY.tradeOpen.basisFormats : COPY.tradeOpen.basisFormatsAlone) : foot.length > 0 ? COPY.tradeOpen.basisBaseline : COPY.tradeOpen.basisBaselineAlone,
      foot, footLine: foot.length > 0 ? null : COPY.tradeOpen.footWithheld, accent: true, sample: true, confidence: "modeled",
      formats, recover: false,
    };
  }
  /* EARNING IT BACK where the foot holds both figures (see the header); the old stated line only where the trade holds no shard. */
  if (foot.length === 2) {
    return {
      state: "withheld", rows: [], tail: null, tailLine: null, lines: [], biggestKey: null, figure: null, value: null, withheld: null,
      basis: COPY.tradeOpen.basisRecover, foot, footLine: null, accent: false, sample: true, confidence: "modeled",
      formats: [], recover: true,
    };
  }
  return {
    state: "withheld", rows: [], tail: null, tailLine: null, lines: [], biggestKey: null, figure: null, value: null, withheld: COPY.tradeOpen.withheld,
    basis: null, foot, footLine, accent: false, sample: false, confidence: "modeled",
    formats: [], recover: false,
  };
}

/**
 * THE COUNT OVER THE 243 SHARD IDS, the two states a trade can be in before
 * any cell's own lines are read: keyed (the baseline state off a cell with no
 * lines) or on the default (the withheld state). The held state is a cell's,
 * not a trade's, and is counted over the cells the harness renders (item 56).
 */
export function countOpenStates(ids: string[], slugOf: (id: string) => string): { total: number; keyed: number; default: number } {
  let keyed = 0;
  for (const id of ids) if (startupCapitalArchetypeKeyed(slugOf(id)) != null) keyed++;
  return { total: ids.length, keyed, default: ids.length - keyed };
}
