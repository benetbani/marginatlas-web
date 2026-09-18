/**
 * src/lib/spine/fact_rows.ts
 *
 * THE THREE CARDS THE CITY FACT BANK FEEDS (2026-09-17, CITY-PROGRAMME step
 * 1a, research item 21): one person's living costs (`05 living`), a year of
 * one-bed rent against a year of typical income (`06 runway`), and what a
 * resident spends in a year (`08 demand`). The bank,
 * data/facts/city/<ISO2>-<slug>.json, held these figures for 252 cities for
 * thirty-three days while the three cards that wanted them self-omitted on
 * every city as "unsourced"; three research briefs re-diagnosed the same
 * wall from zero. This file is the standing answer. Server only: it reads
 * the bank through src/lib/facts/city_shard.ts, which reads the file
 * system, so it runs in the view (the two seats, as the glance and the
 * placement seat do) and in the adapter (the spend).
 *
 * THE TWO SEATS ARE KvGrid CARDS SINCE PLAN STEP 32's THIRD DISPATCH
 * (2026-09-18; MODEL.md 8.3, the band `05 | 06`, "the fact grid, and the
 * fact grid with a focal", R8's reading one level down from `01 | 02`).
 * Each builder returns the glance's shape (city_glance_rows.ts): the cells
 * with the shard's tag on each, a withheld line where a field is null, the
 * basis in a person's words, and a foot naming the modelled cells, because
 * the sample mark is switched off site-wide and the foot is the only line
 * left that can say it. NO CELL AT 30: the fact card with a focal (the
 * one-bed rent at 30, candidate 1 of FORM-CATALOG's CANDIDATES AWAITING HIS
 * CLICK) and the derived-ratio card (the percentage at 30 over one KvGrid
 * row, candidate 3) are both unclicked, so the cells draw at the head rung
 * and the FOCAL finding on both cards is expected until he clicks.
 *
 * `owner_runway.*` IS NEVER READ (plan step 41, 2026-09-17; DATA-REQUIREMENTS
 * item 23): London's five `owner_col` figures are held in the bank since
 * website 711555b0 (the regional private-rent index, a one-person basket,
 * the zones 1-2 travelcard, a cappuccino, the resident full-time median
 * take-home, sources and dates in the drop's `_meta`) and its
 * `owner_runway.*` placeholders are deleted; counted 2026-09-18, zero of
 * the 252 shards carry an `owner_runway` key. The fallback that read those
 * keys where `owner_col` was absent read a placeholder as a figure, and a
 * fill value is withheld, never printed (R11, clause 46), so the fallback is
 * gone with the placeholders.
 *
 * NULL UNDER AN HONEST MINIMUM, NEVER INVENTED. A negative reads as not
 * held; zero is a figure for the transport pass alone (city_shard.ts says
 * why: Belgrade and Richmond hold 0, tagged held, and both run fare-free
 * transit) and prints as the word, the site's rule for a zero fee. The
 * ratio needs a rent and a salary and is withheld above one hundred percent
 * with its line (the reason sits on the builder). The spend needs the one
 * figure.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityFigure, weakerTag, type BankFigure } from "@/lib/facts/city_shard";
import type { FactTag } from "@/lib/facts/types";
import { usd, usdCents } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";

type CityRow = { slug: string; name: string; iso2: string };
const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

/** The mark's own question, asked once: is this figure something a reader should doubt. */
const notHeld = (tag: FactTag) => tag !== "held";

/** The weakest tag across a set of figures. */
function weakest(tags: FactTag[]): FactTag {
  return tags.reduce((w, t) => weakerTag(w, t), "held" as FactTag);
}

/** The shard's four tags collapse to the cell's three: held is measured, placeholder stays, the rest are modelled (the glance's rule). */
const cellConfidence = (tag: FactTag): NonNullable<KvCell["confidence"]> => (tag === "held" ? "measured" : tag === "placeholder" ? "placeholder" : "modeled");

/** The card's own confidence: the weakest cell it prints. */
const cardConfidence = (cells: KvCell[]): "measured" | "modeled" | "placeholder" =>
  cells.some((c) => c.confidence === "placeholder") ? "placeholder" : cells.some((c) => c.confidence === "modeled") ? "modeled" : "measured";

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "a, b and c" from a list of names, so the foot reads as one sentence. */
const listOf = (names: string[]) => (names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`);

/** The foot: the modelled cells named in words, then the placeholder cells, each its own sentence; null when every cell is held. */
function footOf(modelled: string[], placeholders: string[], cityName: string): string | null {
  const parts: string[] = [];
  if (modelled.length) parts.push(capFirst(fill(COPY.cityLiving.footModelled, { what: listOf(modelled), verb: modelled.length === 1 ? "is" : "are" })));
  if (placeholders.length) parts.push(capFirst(fill(COPY.cityLiving.footPlaceholder, { what: listOf(placeholders), verb: placeholders.length === 1 ? "is" : "are", city: cityName })));
  return parts.length ? parts.join(" ") : null;
}

/** A shard figure above zero, or null; `zeroOk` keeps a zero (the transport pass). */
function figure(iso2: string, slug: string, metric: string, zeroOk = false): BankFigure | null {
  const fig = cityFigure(iso2, slug, metric);
  return fig && (zeroOk || fig.value > 0) ? fig : null;
}

/* ------------------------------------------------------------------------- */
/* 05 living: a one-bed flat, groceries, a transit pass, a coffee.            */
/* ------------------------------------------------------------------------- */

export type CityLivingData = {
  slug: string;
  iso2: string;
  name: string;
  cells: KvCell[];
  /** The raw figures behind the cells, null where withheld; the gates read these. */
  figures: { rent: number | null; groceries: number | null; transit: number | null; coffee: number | null };
  withheld: string | null;
  basis: string;
  foot: string | null;
  confidence: "measured" | "modeled" | "placeholder";
};

/** The count of cells the withheld line counts against. */
export const CITY_LIVING_CELLS = 4;

/**
 * WHAT LIVING HERE COSTS. Four cells, each with its file and field, all in
 * data/facts/city/<ISO2>-<slug>.json through cityFigure(), counted
 * 2026-09-18 over the 252 shards: 252 of 252 hold all four, 247 held and 5
 * modelled (Abuja, Kathmandu, Rosario, Tirana, Valparaiso), 0 null. The
 * one-bed rent `owner_col.rent_1bed_usd_mo`, groceries
 * `owner_col.groceries_usd_mo` and the transit pass
 * `owner_col.transit_pass_usd_mo`, each a month; a coffee
 * `owner_col.coffee_usd`, a cup, printed with its cents because a cup is the
 * one figure on the site where the cents are the figure. The unit sits in
 * the cell's own qualifier line, the mockup's markup, so his click on
 * candidate 1 changes the rung and nothing else. A missing field is
 * withheld with its line; the card draws nothing only when it holds no cell.
 * No year: no fact in the city bank carries one (item 26).
 */
export function buildCityLiving(slug: string): CityLivingData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const C = COPY.cityLiving;

  const cells: KvCell[] = [];
  const modelled: string[] = [];
  const placeholders: string[] = [];
  const missing: string[] = [];
  const mark = (key: keyof typeof C.footNames, tag: FactTag) => {
    const c = cellConfidence(tag);
    if (c === "modeled") modelled.push(C.footNames[key]);
    if (c === "placeholder") placeholders.push(C.footNames[key]);
    return c;
  };

  const rent = figure(iso2, slug, "owner_col.rent_1bed_usd_mo");
  if (rent) cells.push({ key: "rent", label: C.cells.rent, value: usd(rent.value), note: C.units.month, confidence: mark("rent", rent.tag) });
  else missing.push(C.reasons.rent);

  const groceries = figure(iso2, slug, "owner_col.groceries_usd_mo");
  if (groceries) cells.push({ key: "groceries", label: C.cells.groceries, value: usd(groceries.value), note: C.units.month, confidence: mark("groceries", groceries.tag) });
  else missing.push(C.reasons.groceries);

  /* A FARE-FREE CITY PRINTS THE WORD (COPY.free: a zero fee is the word, never $0). */
  const transit = figure(iso2, slug, "owner_col.transit_pass_usd_mo", true);
  if (transit) cells.push({ key: "transit", label: C.cells.transit, value: transit.value > 0 ? usd(transit.value) : COPY.free, note: C.units.month, confidence: mark("transit", transit.tag) });
  else missing.push(C.reasons.transit);

  const coffee = figure(iso2, slug, "owner_col.coffee_usd");
  if (coffee) cells.push({ key: "coffee", label: C.cells.coffee, value: usdCents(coffee.value), note: C.units.cup, confidence: mark("coffee", coffee.tag) });
  else missing.push(C.reasons.coffee);

  if (cells.length === 0) return null;

  return {
    slug,
    iso2,
    name: city.name,
    cells,
    figures: { rent: rent?.value ?? null, groceries: groceries?.value ?? null, transit: transit?.value ?? null, coffee: coffee?.value ?? null },
    withheld: missing.length ? fill(C.withheld, { n: String(missing.length), reasons: missing.join("; ") }) : null,
    basis: C.basis,
    foot: footOf(modelled, placeholders, city.name),
    confidence: cardConfidence(cells),
  };
}

/* ------------------------------------------------------------------------- */
/* 06 runway: a year of one-bed rent against a year of typical income.        */
/* ------------------------------------------------------------------------- */

export type CityRunwayData = {
  slug: string;
  iso2: string;
  name: string;
  cells: KvCell[];
  /** `pct` is the share printed, null where withheld; `overPct` is the ratio the card withheld for standing over 100, else null; the gates read these. */
  figures: { pct: number | null; overPct: number | null; incomeYr: number | null; rentMo: number | null };
  withheld: string | null;
  basis: string;
  foot: string | null;
  confidence: "measured" | "modeled" | "placeholder";
};

/**
 * RENT AGAINST INCOME. ONE ROW OF TWO CELLS: the share, a year of one-bed
 * rent over a year of typical income, as a whole percent; and the typical
 * income a year, the one absolute `05` does not hold (M1: the rent is never
 * printed twice in one band, so the rent is not here).
 *
 * THE DENOMINATOR, CHOSEN ONCE (research item 24): `owner_col.median_salary_usd_mo`
 * times twelve, and nothing else. It is the held figure (247 of 252, 5
 * modelled, 0 absent, counted 2026-09-18), it comes off the same key family
 * and the same research pass as the rent it is divided into, so both sides
 * share one basis and one tag, and a year of rent over a year of pay is the
 * question in a worker's own terms. The bank's `income.median_income_usd`,
 * which stood in for London alone while London held no salary, is not read
 * any more: London's salary is held since 2026-09-17, and a second
 * denominator on one city is a second reading of one figure (M1).
 *
 * "TYPICAL", NEVER "MEDIAN", in every string: the pay is a modelled figure
 * on 5 cities and one word serves every city (item 24). WHETHER THE INCOME
 * IS BEFORE OR AFTER TAX THE BASIS CANNOT SAY: the bank carries no marker on
 * the row (the shard's `methodId` is the blanket "researched" and the
 * drop's `_meta.method`, which does say, never reaches a shard: item 26),
 * and item 23 found the convention split (London, Edinburgh, Leeds and
 * Frankfurt net, Birmingham, Bristol, Glasgow and Manchester gross), so the
 * basis says "a typical income" and neither word, and item 24 carries the
 * requirement for a marker.
 *
 * WITHHELD ABOVE ONE HUNDRED PERCENT, with the line standing where the
 * share would (PART 5: a label never stands where a number goes; a cell
 * that cannot hold an honest figure is withheld with a stated line). A
 * share of a budget above all of it is not a share of anyone's budget.
 * Counted 2026-09-18 over the 252: 222 shares drawn (219 on two held
 * figures, 3 on two modelled), 30 withheld, Dakar at 425 (a one-bed at $726
 * a month, a typical pay of $171) down to Surabaya at 101; Nairobi sits at
 * exactly 100 and prints. Both figures in each of the thirty are tagged
 * held and are not doubted: the one-bed the bank priced is a flat let on the
 * formal market and the salary a median across the whole workforce, two
 * markets the ratio between them does not describe. The rent still prints
 * on the living card and the income here; only the composed figure is
 * withheld. The three like-for-like pairs found for Mexico City, Lima and
 * Medellín (item 24) wait for their own block and stay withheld here.
 */
export function buildCityRunway(slug: string): CityRunwayData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const C = COPY.cityRunway;

  const cells: KvCell[] = [];
  const modelled: string[] = [];
  const placeholders: string[] = [];
  const mark = (key: keyof typeof C.footNames, tag: FactTag) => {
    const c = cellConfidence(tag);
    if (c === "modeled") modelled.push(C.footNames[key]);
    if (c === "placeholder") placeholders.push(C.footNames[key]);
    return c;
  };

  const rent = figure(iso2, slug, "owner_col.rent_1bed_usd_mo");
  const salary = figure(iso2, slug, "owner_col.median_salary_usd_mo");
  const incomeYr = salary ? Math.round(salary.value * 12) : null;

  let pct: number | null = null;
  let overPct: number | null = null;
  let withheld: string | null = null;
  if (rent && salary && incomeYr) {
    const ratio = Math.round(((rent.value * 12) / incomeYr) * 100);
    if (ratio > 100) {
      overPct = ratio;
      withheld = C.withheld.over;
    } else {
      pct = ratio;
      cells.push({ key: "share", label: C.cells.share, value: `${pct}%`, confidence: cellConfidence(weakest([rent.tag, salary.tag])) });
      /* The share's inputs are named in the foot once each, whichever side is weak. */
      if (notHeld(rent.tag)) mark("rent", rent.tag);
    }
  } else if (salary && !rent) {
    withheld = C.withheld.noRent;
  }
  /* No typical income on file: no cell, and the card draws nothing (the glance's rule; no city today). */
  if (!salary || !incomeYr) return null;
  cells.push({ key: "income", label: C.cells.income, value: usd(incomeYr), note: C.units.year, confidence: mark("income", salary.tag) });

  return {
    slug,
    iso2,
    name: city.name,
    cells,
    figures: { pct, overPct, incomeYr, rentMo: rent?.value ?? null },
    withheld,
    basis: C.basis,
    foot: footOf(modelled, placeholders, city.name),
    confidence: cardConfidence(cells),
  };
}

/* ------------------------------------------------------------------------- */
/* The spending pool: what one resident spends in a year.                     */
/* ------------------------------------------------------------------------- */

export type CityDemand = {
  /** Spend per resident, a year. */
  spend: BankFigure;
  tag: FactTag;
  sample: boolean;
  basis: string;
};

/** The clause a basis gains when a tag is not held; empty when it is. Extrapolated reads as modelled here: neither is a measurement, and no spend fact carries it today. */
function weakClause(tag: FactTag, modelled: string, placeholder: string, cityName: string): string {
  if (tag === "held") return "";
  if (tag === "placeholder") return placeholder.replace("{city}", cityName);
  return modelled;
}

/** Null unless the bank holds the one figure, above zero. */
export function buildCityDemand(iso2: string, slug: string, cityName?: string): CityDemand | null {
  const spend = figure(iso2, slug, "demand.spend_per_capita_usd");
  if (!spend) return null;
  const basis = [COPY.cityDemand.basis, weakClause(spend.tag, COPY.cityDemand.modelled, COPY.cityDemand.placeholder, cityName ?? slug)]
    .filter(Boolean)
    .join(" ");
  return { spend, tag: spend.tag, sample: notHeld(spend.tag), basis };
}
