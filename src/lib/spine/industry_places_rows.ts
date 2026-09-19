/**
 * src/lib/spine/industry_places_rows.ts
 *
 * WHERE THIS TRADE PAYS BEST, CITY BY CITY, the industry page's `06 places`
 * (MODEL.md 8.7; plan step 34's third dispatch, 2026-09-19): the page's one
 * table and its second full width (R1: the take, this table, the close), on
 * CompareTable (B7). One row per city of the curated slate where the trade
 * resolves to a measurement of its own, two columns in the table's own
 * units: take-home a year (the money column, whole currency, one unit) and
 * net margin (percent); the best cell of each column in ink with the tick,
 * as the archetype marks a better value wherever two rows hold one; NO home
 * row, because this page has no home (a trade is not in a place); rows never
 * navigate (M23); terracotta never enters a table. Take-home highest first,
 * because the section's question is where it pays best and the money column
 * is its answer.
 *
 * THE FEED IS `resolveAcrossColumns(id)` in src/lib/markets/across_cities.ts,
 * the same resolution `buildAcrossCities` runs for the across route: each
 * (city, trade) pair through `getCellBySlug` and the shared four-way trust
 * gate, then `takeHome` and `netMarginFraction` through the shared tax-aware
 * estimator over that cell's revenue. The old explorer gated on
 * `rent_load_pct`, a field the adapter never set, so this block never drew on
 * a live page; it reads the two fields that exist. THIS BUILDER IS PURE over
 * that result: the adapter awaits the resolution (the database) and hands
 * the columns down as `across`, and the builder, the stories, the copy gates
 * and the harness read the columns without a database. `undefined` is "no
 * lookup was made" (the bundled dev seed) and builds nothing; `null` is a
 * trade the taxonomy does not hold; an empty list is a trade the slate does
 * not measure anywhere, which is a count of zero and draws the seat.
 *
 * A ROW IS THE CITY'S OWN OR IT IS NOT A ROW, and this is the law the brief
 * did not predict, measured before it was written (READ THE MODULE THAT
 * PRODUCES A NUMBER). 8.7 carried the synthesis's count, "real, over 15
 * major cities; 106 of 243 clear four cities", and that count was taken on
 * the trust gate, which reads the row's tier and level and never the
 * figure. Counted 2026-09-19 over the 243 trades against the database
 * (scratchpad/step34c/places-count2.json): of 1,029 resolved rows holding
 * both figures, 577 share their revenue to the cent with another city of
 * the slate (101 of them the trade's global median in
 * data/quality/industry_medians_v1.json, on restaurants every European city
 * and Tokyo at 433,168.58), 332 sit on the clamp's 3% floor, and the rest
 * but New York's stand on one ladder of city constants (Amsterdam and
 * Toronto 725,000, Berlin 700,000, London 675,000, Paris 650,000, Tokyo
 * 600,000, Madrid and Barcelona 500,000; Paris over Tokyo at 1.0833 on 83 of
 * the 99 trades holding both) times a per-trade base: the headline revenue
 * `fillMissingFields` supplies from a per-industry, per-country anchor when
 * the row holds a firm count and no revenue of its own, marked
 * `_revenueFilled` on the cell (src/lib/cells/fill_defaults.ts; the site's
 * own coverage logic refuses "measured" for such a cell), which the across
 * builder's trust gate does not read. New York's rows (tier S, the state's
 * own revenue, 59 distinct values over the trades) are the one read source
 * in the slate. So the law, written as the model's own clauses: a figure
 * equal to a file's fill is withheld (clause 46, R11); a place figure that
 * is one constant under many names is not that place's (clause 38, the
 * capital ladder's precedent); a figure the clip floor cannot distinguish
 * is withheld (PART 5's own finding on the district floors; his 2026-09-04
 * finding that the smallest keeps were the floor times revenue). A row is
 * drawn when it holds both figures AND its headline revenue was read off the
 * row (`revenueFilled` false; or the curated London entry, whose take-home
 * and margin are the exemplar's own and rest on no revenue) AND its revenue
 * is not shared to the cent with another city of the slate AND its margin is
 * not the clamp's floor (`netMarginFloored`). Every other resolved city is
 * counted and the card says so once (the note under the table; the seat's
 * line says "own figures"). BLIND SPOT, stated: the shared-to-the-cent test
 * cannot distinguish a copied figure from a genuine tie to the cent between
 * two cities' median revenues; no such tie exists in the data today (every
 * shared value is a group of three or more, or the file's median), and a
 * genuine one would be withheld with the count said.
 *
 * WHAT THAT LEAVES TODAY: 0 of 243 trades hold four cities of their own, so
 * the block stands SEATED on every trade (the drawn blocked seat at the
 * table's full width, its line naming the count, its foot naming
 * DATA-REQUIREMENTS item 69, whose done-means now has to say "a row with a
 * revenue of its own", not "a trusted local cell"); restaurants hold two
 * (New York read, London curated). The table's code path is whole and gated
 * on fixtures shaped as the resolver's columns, so the day the data track
 * lands rows of their own the table draws with no change here.
 *
 * THE FIGURES ARE MODELLED, AND THE BASIS SAYS SO: the revenue a row holds is
 * read, and the take-home and the margin are the shared estimator's model
 * over it (the trade page's one net builder calls that branch "a model over
 * the cell's own revenue and payroll" and marks it modelled). The opener's
 * mark is on, behind his switch, and the basis line says modelled in words.
 *
 * TWO STATES, and the block ships in both (never dropped, R6's precedent):
 *   table    four or more cities of their own: the table, the heads said
 *            once, the best cell of each column ticked, the note counting
 *            the cities withheld.
 *   blocked  under four (`PLACES_FLOOR`, the model's four-member floor,
 *            PART 9 clause 22, held here beside the mark list's): the DRAWN
 *            BLOCKED SEAT (BlockedSeat, the country page's own seat for its
 *            peers table, at the table's full width under the table's own
 *            sanction) with its opener, one stated line in the site's idiom
 *            opening "Not gathered yet:" (M19) that names the count of own
 *            figures it holds and that a table needs four, no figure, and
 *            the foot naming item 69. Never a two-row table with an apology
 *            under it (clause 22), and never a filled sample: the
 *            per-country margin engine is ruled out as a source (8.7), and
 *            the slate's own fills are what this law withholds.
 *
 * BLIND SPOT, stated: this builder cannot tell "the slate holds no cell for
 * this trade in that city" from "the query did not answer in its four-second
 * budget": both arrive as a city absent from the columns. The adapter's
 * query ledger on stderr is the one instrument that tells them apart, and a
 * count taken on a slow database is a count to take again.
 */
import type { CityColumn } from "@/lib/markets/across_cities";
/* The slate's size only, from the dependency-free module: importing it from
   across_cities.ts would load the database client into the copy gates, which
   run in the chain without an environment (major_cities.ts says so). */
import { MAJOR_CITIES } from "@/lib/markets/major_cities";
import type { CompareColumn, CompareRow } from "@/components/spine/archetypes/CompareTable";
import { MARK_LIST_FLOOR } from "@/components/spine/archetypes/MarkList";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The model's four-member floor (PART 9 clause 22), the mark list's own number and not a second copy of it. */
export const PLACES_FLOOR = MARK_LIST_FLOOR;

/** The fields of a column this builder reads; the resolver's columns carry them all. */
export type PlacesColumn = Pick<CityColumn, "slug" | "name" | "country" | "revenue" | "takeHome" | "netMarginFraction" | "revenueFilled" | "economics" | "netMarginFloored">;

/** Why a resolved city is not a row. */
export type PlacesWithheldReason = "missing" | "filled" | "shared" | "floored";

export type IndustryPlacesData = {
  industryId: string;
  state: "table" | "blocked";
  /** The cities of their own, take-home highest first; empty in the blocked state. */
  rows: CompareRow[];
  columns: CompareColumn[];
  entityHead: string;
  /** PART 7's basis, printed under the table as the archetype's caveat. */
  caveat: string;
  /** The stated line where the table would stand, in the blocked state; null where the table prints. */
  line: string | null;
  /** The seat's foot, naming the requirement; null where the table prints. */
  foot: string | null;
  /** The line under the table counting the resolved cities withheld; null when none. */
  note: string | null;
  /** How many cities of the slate resolve through the trust gate. */
  resolved: number;
  /** Of them, how many are the city's own (the rows). */
  holding: number;
  /** Of them, how many are withheld, and why each. */
  withheld: number;
  reasons: Record<PlacesWithheldReason, number>;
  /** The slate's size, for the line. */
  slate: number;
  /** The opener's mark: the take-home and the margin are the estimator's model over each city's read revenue. */
  confidence: "modeled";
};

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** A city holds both figures when each is finite and the take-home is above zero. */
export const holdsBoth = (c: Pick<PlacesColumn, "takeHome" | "netMarginFraction">): boolean => isNum(c.takeHome) && c.takeHome > 0 && isNum(c.netMarginFraction);

/** Two revenues are one figure when they agree to the cent. */
const sameToTheCent = (a: number, b: number) => Math.abs(a - b) < 0.005;

/**
 * Why a resolved city is withheld, or null when it is the city's own: no
 * figure; the headline revenue supplied from an anchor (unless the
 * economics are the curated London entry's, which rest on no revenue); one
 * revenue shared to the cent with another city of the slate; the margin the
 * clamp's floor.
 */
export function withheldReason(c: PlacesColumn, all: PlacesColumn[]): PlacesWithheldReason | null {
  if (!holdsBoth(c)) return "missing";
  const curated = c.economics === "curated";
  if (!curated && c.revenueFilled) return "filled";
  if (!curated && isNum(c.revenue) && all.some((o) => o !== c && isNum(o.revenue) && sameToTheCent(o.revenue as number, c.revenue as number))) return "shared";
  if (c.netMarginFloored) return "floored";
  return null;
}

/**
 * Null when no id is given, when the taxonomy holds no such trade (`across`
 * null) or when no lookup was made (`across` undefined); otherwise the table
 * or the seat, never nothing.
 */
export function buildIndustryPlaces(industryId: string | undefined, across: PlacesColumn[] | null | undefined): IndustryPlacesData | null {
  if (!industryId || across == null) return null;
  const c = COPY.industryPlaces;
  const slate = MAJOR_CITIES.length;
  const reasons: Record<PlacesWithheldReason, number> = { missing: 0, filled: 0, shared: 0, floored: 0 };
  const own: PlacesColumn[] = [];
  for (const city of across) {
    const why = withheldReason(city, across);
    if (why) reasons[why]++; else own.push(city);
  }
  const withheld = across.length - own.length;
  const rows: CompareRow[] = [...own]
    .sort((a, b) => (b.takeHome as number) - (a.takeHome as number) || a.name.localeCompare(b.name))
    .map((city) => ({
      iso2: city.country.toUpperCase(),
      key: city.slug,
      name: city.name,
      home: false,
      values: { takeHome: Math.round(city.takeHome as number), netMargin: Math.round((city.netMarginFraction as number) * 100) },
    }));
  const columns: CompareColumn[] = [
    { key: "takeHome", head: c.cols.takeHome, unit: "usd", best: "max" },
    { key: "netMargin", head: c.cols.netMargin, unit: "pct", best: "max" },
  ];
  /* Digits in the note, the withheld lines' idiom ("6 cities withheld"). */
  const note = withheld === 0 ? null : withheld === 1 ? c.withheldOne : fill(c.withheldMany, { n: String(withheld) });
  const common = { industryId, columns, entityHead: c.cols.city, caveat: c.basis, note, resolved: across.length, holding: own.length, withheld, reasons, slate, confidence: "modeled" as const };
  if (own.length < PLACES_FLOOR) {
    const line = own.length === 0 ? fill(c.blocked.none, { slate: String(slate) }) : own.length === 1 ? fill(c.blocked.one, { slate: String(slate) }) : fill(c.blocked.some, { n: String(own.length), slate: String(slate) });
    return { ...common, state: "blocked", rows: [], line, foot: c.blocked.foot };
  }
  return { ...common, state: "table", rows, line: null, foot: null };
}

/** How a set of resolutions falls, for the gates and the record: the table on the ids holding four cities of their own, the seat on the rest, by the count each holds and the reasons the rest were withheld. */
export function countIndustryPlaces(resolutions: Array<{ id: string; across: PlacesColumn[] | null }>): { total: number; table: number; blocked: number; none: number; byHolding: Record<number, number>; withheld: number; reasons: Record<PlacesWithheldReason, number> } {
  const out = { total: 0, table: 0, blocked: 0, none: 0, byHolding: {} as Record<number, number>, withheld: 0, reasons: { missing: 0, filled: 0, shared: 0, floored: 0 } as Record<PlacesWithheldReason, number> };
  for (const r of resolutions) {
    const p = buildIndustryPlaces(r.id, r.across);
    if (!p) continue;
    out.total++;
    if (p.state === "table") out.table++; else out.blocked++;
    if (p.resolved === 0) out.none++;
    out.byHolding[p.holding] = (out.byHolding[p.holding] ?? 0) + 1;
    out.withheld += p.withheld;
    for (const k of Object.keys(p.reasons) as PlacesWithheldReason[]) out.reasons[k] += p.reasons[k];
  }
  return out;
}
