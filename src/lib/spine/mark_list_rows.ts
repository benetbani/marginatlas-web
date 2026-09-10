/**
 * src/lib/spine/mark_list_rows.ts
 *
 * THE MARK LIST'S ROWS (B3, 2026-09-10), for the MarkList archetype: one
 * headline figure for a whole set, then the highest few of its members, each
 * with a name and its own figure. His words on the reference: "pretty
 * universal but the use can be beyond the use of flags itself, universal
 * format." So this builder is written to serve more than one subject and it
 * already serves two of them, from two different files, through one shape:
 *
 *   cities:pay[:ISO2]   the covered cities, by what a customer earns there
 *   cities:visitors     the covered cities, by visitors in a year
 *   trade:<industry_id> every country the margin model measures, for one trade
 *
 * WHERE THE FIGURES COME FROM, and both files were read before this was
 * designed rather than after.
 *
 * `data/cities/city_list_v1.json` holds 252 covered cities with fourteen
 * fields each and a per-field source note on six of them. Coverage, counted:
 * name, iso2, continent, tier, pop_m, gdp_b, wealth_z, cost_of_living_index
 * and avg_gross_salary_usd_year at 252 of 252; unemployment_pct 251; hdi 247;
 * tourist_arrivals_m 246; gini 234. `city_cards.ts` already prints the pay
 * field on the country page and `adapt_city.ts` opens the city page with it,
 * so a list built on it promises what the pages behind it deliver. The
 * visitor field is the one with real gaps, which is why the withheld story is
 * built on it and not invented.
 *
 * `data/archetypes/net_margin_snapshot.json` is the engine run the money card
 * already draws (margin_rows.ts), with one credibility rule shared with it
 * (`isMarginCredible`): above the 3% floor and not clamped. Counted per trade,
 * of the countries the snapshot measures: sports_fitness 32 credible of 195,
 * grocery_stores 20 of 191, cafes_coffee 18 of 195, restaurants 13 of 193,
 * hairdressers_beauty 5 of 194, auto_repair_shops 4 of 188. The last of those
 * is exactly the model's floor of four, which is why it is the thin story.
 *
 * WHAT IS NOT DRAWN, AND WHY IT IS NOT INVENTED. His reference puts a small
 * DELTA PILL beside the headline. A delta needs a prior period to be honest
 * about and neither file holds one: the city list is a single undated
 * snapshot and the margin snapshot carries one `taken` date for the whole
 * run. A delta pill here would be a fabricated number wearing a real one's
 * costume, the same reasoning IncomeBreakdown.tsx already recorded for the
 * same pill. Written into DATA-REQUIREMENTS.md 19 rather than made up.
 *
 * AND ONE THING THE DRAWN CARD FOUND, written into DATA-REQUIREMENTS.md 20:
 * the visitor field is extrapolated for many cities by dividing the country's
 * arrivals by a tier constant, which puts Lyon and Marseille at 20.0M each
 * ABOVE Paris at 19.0M on the withheld story. The figures are the file's, the
 * card wears the sample mark, and the fault is the data's to fix.
 *
 * THE SAMPLE MARK IS ON, ALWAYS, and the ground is each file's own words.
 * `city_list_v1.json`'s convention line says of itself: "cross-reference of
 * public city statistics; not authoritative but consistent", and most of the
 * pay figures resolve to a modelled wage premium rather than a measured city
 * wage. The margin snapshot is an engine output, and the money card that
 * draws it is tagged for that reason. `tagged` stays a field rather than a
 * constant so a measured metric can turn it off the day one lands.
 *
 * THE HEADLINE IS THE SET'S MIDDLE, NEVER ITS TOP. The rows are the highest
 * few; the middle is the one reading they cannot give, and it is what makes
 * the rows mean anything (the ten highest-paying cities say little until you
 * know the ordinary one pays $29K). It is the LOWER median, so the figure is
 * always one a member actually holds rather than an average of two that
 * nobody does. BLIND SPOT, stated: the middle is taken over the members that
 * HOLD a figure, not over the whole set, because a member with no figure
 * cannot be placed in an order; on `cities:visitors` that is 246 of the 252
 * the basis line names.
 *
 * A ROW WITHOUT A FIGURE IS WITHHELD WITH A LINE, never drawn blank and never
 * dropped in silence (PART 5, and the country money card's own idiom).
 * Nothing about the set is unaccounted for: the rows are its highest few, the
 * withheld line counts the members that hold no figure and says why, and the
 * basis line names the size of the whole set so a reader knows the rest rank
 * below.
 *
 * FOUR IS THE FLOOR, and it is the model's, not this file's: PART 9 rule 22,
 * "a ranked comparison with fewer than four members". Under it the card draws
 * nothing rather than a short list with an apology under it. The floor lives
 * on the drawing (`MARK_LIST_FLOOR` in MarkList.tsx) and is imported here, so
 * the builder and the component cannot hold two different numbers.
 */
import { usd } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { MARK_LIST_FLOOR } from "@/components/spine/archetypes/MarkList";
import { COPY } from "@/lib/spine/copy";
import { countWord } from "@/lib/spine/district_rows";
import { isMarginCredible } from "@/lib/spine/margin_rows";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { iso2ToName } from "@/lib/countries";
import cityListJson from "../../../data/cities/city_list_v1.json";
import snapshotJson from "../../../data/archetypes/net_margin_snapshot.json";

/** At most ten rows: past that the card stops being a list the eye takes in
 *  and becomes a table, which is a different archetype's job. The basis line
 *  says the set is larger, so the cap hides nothing. */
export const MARK_LIST_CAP = 10;

/** One row of the list: a name, its figure, and the country whose flag can
 *  stand as the row's mark. `iso2` is DATA, not a drawing: the builder never
 *  renders a flag, and a caller that wants no marks simply ignores it. */
export type MarkListRow = { key: string; name: string; value: number; iso2?: string };

export type MarkListCard = {
  rows: MarkListRow[];
  /** The set's middle, in the same unit as every row (see the header). */
  middle: number;
  /** The whole set the list is drawn from, rows plus withheld plus the rest. */
  universe: number;
  /** Members of that set holding no figure at all. */
  withheld: number;
  withheldLine: string | null;
  kicker: string;
  icon: AtlasIconId;
  /** The words over the headline figure. */
  middleLabel: string;
  basis: string;
  head: { name: string; value: string };
  /** One notation for the headline and every row, so a column cannot hold two. */
  fmt: (v: number) => string;
  tagged: boolean;
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Visitors, in the site's one notation for a count in millions: the same
 *  `${v.toFixed(1)}M` CompareTable.tsx prints for its own visitors column. A
 *  second notation for the same quantity is how two cards start disagreeing. */
export const visitorsM = (v: number) => `${v.toFixed(1)}M`;
/** A net margin, in the money card's own notation (RankedBars' call site). */
export const netPct = (v: number) => `${Math.round(v * 100)}%`;

/** The LOWER median: with an even count this is the lower of the two middle
 *  members, so the headline is always a figure some member actually holds. */
function middleOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

type CityEntry = {
  slug: string;
  name: string;
  iso2: string;
  avg_gross_salary_usd_year?: number;
  tourist_arrivals_m?: number;
};
const CITIES = (cityListJson as unknown as { cities: CityEntry[] }).cities;

type SnapRow = { name: string; margin: number; revenue: number; flagged: boolean; clamped: boolean };
const SNAP = snapshotJson as unknown as { taken: string; countries: Record<string, Record<string, SnapRow>> };

/** The two city metrics this file can read today, each with the field it
 *  reads, its notation, its icon and its own words. A third metric is one
 *  entry here, which is the point of the archetype. */
const CITY_METRICS = {
  pay: { field: "avg_gross_salary_usd_year", fmt: usd, icon: "spending-power" as AtlasIconId, copy: COPY.markList.pay },
  visitors: { field: "tourist_arrivals_m", fmt: visitorsM, icon: "tourist" as AtlasIconId, copy: COPY.markList.visitors },
} as const;

function fill(text: string, n: number, universe: number, country?: string): string {
  return text
    .replace("{n}", countWord(n))
    .replace("{universe}", String(universe))
    .replace("{country}", country ?? "");
}

/** The words over the headline. "Middle city" while the list is a slice of a
 *  bigger set; "Middle of the four" once the list IS every member that holds a
 *  figure, because then the middle is the middle of what is printed and
 *  nothing else, and a label claiming a world middle over four countries is a
 *  claim nobody measured. */
function middleLabelFor(drawn: number, held: number, subject: string): string {
  return drawn >= held ? COPY.markList.middleOfDrawn.replace("{n}", countWord(held)) : subject;
}

function withheldLine(n: number, one: string, many: string): string | null {
  if (n <= 0) return null;
  return n === 1 ? one : many.replace("{n}", String(n));
}

/** The covered cities, by one of their measured fields. `scope` narrows the
 *  set to one country's cities, which is where the floor bites: a country
 *  holding three covered cities draws no card at all. */
function citiesCard(metric: keyof typeof CITY_METRICS, scope?: string): MarkListCard | null {
  const m = CITY_METRICS[metric];
  const iso2 = scope ? scope.toUpperCase() : null;
  const pool = iso2 ? CITIES.filter((c) => String(c.iso2).toUpperCase() === iso2) : CITIES;
  if (!pool.length) return null;
  const valueOf = (c: CityEntry) => (c as unknown as Record<string, unknown>)[m.field];
  /* ABOVE ZERO, NOT MERELY PRESENT, and the guard is the data's doing rather
     than tidiness: `tourist_arrivals_m` is absent for six cities and a literal
     0 for five more (Chisinau, Dhaka, Kyiv, Pristina, Yangon), every one of
     those five an extrapolation that rounded down. Dhaka plainly has
     visitors, so drawing 0.0M for it would be a visibly wrong number, which is
     the one thing this site does not ship. Both shapes of gap are therefore
     withheld, and the withheld line says "above zero" so its reason is true of
     both. Counted, not assumed: no city's pay figure is zero or missing. */
  const held = pool.filter((c) => isNum(valueOf(c)) && (valueOf(c) as number) > 0);
  const rows: MarkListRow[] = [...held]
    .sort((a, b) => (valueOf(b) as number) - (valueOf(a) as number))
    .slice(0, MARK_LIST_CAP)
    .map((c) => ({ key: c.slug, name: c.name, value: valueOf(c) as number, iso2: String(c.iso2).toUpperCase() }));
  if (rows.length < MARK_LIST_FLOOR) return null;
  const country = iso2 ? iso2ToName(iso2) ?? iso2 : undefined;
  return {
    rows,
    middle: middleOf(held.map((c) => valueOf(c) as number)),
    universe: pool.length,
    withheld: pool.length - held.length,
    withheldLine: withheldLine(pool.length - held.length, m.copy.withheldOne, m.copy.withheldMany),
    kicker: country ? `${m.copy.kicker}, ${country}` : m.copy.kicker,
    icon: m.icon,
    middleLabel: middleLabelFor(rows.length, held.length, m.copy.middle),
    basis: fill(country ? m.copy.basisIn : m.copy.basis, rows.length, pool.length, country),
    head: m.copy.head,
    fmt: m.fmt,
    tagged: true,
  };
}

/** One trade across every country the snapshot measures, on the money card's
 *  own credibility rule: a loss, a floor or a clamped figure is not a row, it
 *  is a withheld one with the reason stated. */
function tradeCard(industryId: string): MarkListCard | null {
  const trade = INDUSTRY_BY_ID[industryId];
  if (!trade) return null;
  const pool: Array<{ iso2: string; r: SnapRow }> = [];
  for (const [iso2, byTrade] of Object.entries(SNAP.countries ?? {})) {
    const r = byTrade?.[industryId];
    if (r && isNum(r.margin)) pool.push({ iso2: iso2.toUpperCase(), r });
  }
  if (!pool.length) return null;
  const held = pool.filter((x) => isMarginCredible(x.r.margin, x.r.clamped));
  const rows: MarkListRow[] = [...held]
    .sort((a, b) => b.r.margin - a.r.margin)
    .slice(0, MARK_LIST_CAP)
    .map((x) => ({ key: x.iso2.toLowerCase(), name: iso2ToName(x.iso2) ?? x.iso2, value: x.r.margin, iso2: x.iso2 }));
  if (rows.length < MARK_LIST_FLOOR) return null;
  const c = COPY.markList.trade;
  return {
    rows,
    middle: middleOf(held.map((x) => x.r.margin)),
    universe: pool.length,
    withheld: pool.length - held.length,
    withheldLine: withheldLine(pool.length - held.length, c.withheldOne, c.withheldMany),
    /* THE TRADE IS NAMED BESIDE THE METRIC, the same way the money card names
       its country beside it, and the metric's name is the one constant both
       cards read so the two can never call it different things. */
    kicker: `${c.kicker}, ${trade.name}`,
    icon: "where-it-pays",
    middleLabel: middleLabelFor(rows.length, held.length, c.middle),
    basis: fill(c.basis, rows.length, pool.length),
    head: c.head,
    fmt: netPct,
    tagged: true,
  };
}

/**
 * The one entry point. Null is an honest self-omit, and it has three causes,
 * all of them the data's: a set the files do not hold, a set whose members
 * hold no figure, and a set under the floor of four.
 */
export function buildMarkList(key: string): MarkListCard | null {
  const parts = String(key).split(":");
  if (parts[0] === "cities") {
    const metric = parts[1];
    if (metric !== "pay" && metric !== "visitors") return null;
    return citiesCard(metric, parts[2]);
  }
  if (parts[0] === "trade" && parts[1]) return tradeCard(parts[1]);
  return null;
}
