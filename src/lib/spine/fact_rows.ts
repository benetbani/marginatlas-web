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
 * system, so it runs in the view, by the seed's slug, as the glance and the
 * placement seat do (all three since plan step 32's fourth dispatch,
 * 2026-09-18; the spend rode the adapter's seed until then).
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
 * ratio needs a rent and a typical income and is withheld above one hundred
 * percent with its line (the reason sits on the builder). The spend needs
 * the one figure, and a placeholder is withheld, never printed.
 *
 * THE TYPICAL INCOME COMES FROM ONE BUILDER (plan step 32's fourth dispatch,
 * 2026-09-18): `cityTypicalIncome(slug)` in city_income.ts, the same call
 * the masthead, the earnings strip and the peers row make, so the runway's
 * income and the strip's middle mark are one figure (R7's discipline applied
 * to pay, 8.3's `06` row). The runway draws only on the city's OWN figure
 * (`from: "city"`, 252 of 252 today): a year of a city's rent over a year
 * of the country's pay would be a ratio between two places.
 *
 * THE SPEND IS A BentoMetric SINCE THE SAME DISPATCH (8.3's `08 demand`: the
 * plain figure, F3, standing as its own card the way the country's `04
 * entry-bill` does): `buildCityDemand` returns the cell's shape, a figure OR
 * a withheld line (never both, never neither: BentoBand.tsx throws on
 * either), the basis, and a foot saying "modelled" where the tag is not
 * held. The one placeholder in the set (London, item 23) is withheld with
 * its line: a fill value is never printed (R11, clause 46).
 *
 * THE FOURTH CARD, `15 season` (plan step 32's sixth dispatch, 2026-09-18):
 * `buildCitySeason` at the foot of this file, the shard's own footfall field
 * on a KvGrid pair, the slope over the city list where the shard holds no
 * row, the clamp withheld. Its header says the counts.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityFigure, weakerTag, type BankFigure } from "@/lib/facts/city_shard";
import { cityTypicalIncome } from "@/lib/spine/city_income";
import { visitorShareSlope } from "@/lib/cities/city_view";
import type { FactTag } from "@/lib/facts/types";
import { usd, usdCents } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";

type CityRow = { slug: string; name: string; iso2: string; tourist_arrivals_m?: number | null; pop_m?: number | null };
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
 * THE DENOMINATOR, CHOSEN ONCE (research item 24) AND READ THROUGH THE ONE
 * BUILDER (the fourth dispatch, 2026-09-18): `cityTypicalIncome(slug)`,
 * which is `owner_col.median_salary_usd_mo` times twelve on every listed
 * city (247 held, 5 modelled, 0 absent, counted 2026-09-18). It comes off
 * the same key family and the same research pass as the rent it is divided
 * into, so both sides share one basis and one tag, and a year of rent over
 * a year of pay is the question in a worker's own terms. The bank's
 * `income.median_income_usd` is not read: city_income.ts says why (on 35 of
 * the 51 cities holding it held, it is a household's or a per-head figure,
 * and the shard cannot say which). Where the builder falls back to the
 * country's typical (no city today) this card draws nothing rather than a
 * city's rent over a country's pay.
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
  const income = cityTypicalIncome(slug);
  /* No typical income of the city's own: no cell, and the card draws nothing (the glance's rule; no city today). */
  if (!income || income.from !== "city") return null;
  const incomeYr = income.value;

  let pct: number | null = null;
  let overPct: number | null = null;
  let withheld: string | null = null;
  if (rent) {
    const ratio = Math.round(((rent.value * 12) / incomeYr) * 100);
    if (ratio > 100) {
      overPct = ratio;
      withheld = C.withheld.over;
    } else {
      pct = ratio;
      cells.push({ key: "share", label: C.cells.share, value: `${pct}%`, confidence: cellConfidence(weakest([rent.tag, income.tag])) });
      /* The share's inputs are named in the foot once each, whichever side is weak. */
      if (notHeld(rent.tag)) mark("rent", rent.tag);
    }
  } else {
    withheld = C.withheld.noRent;
  }
  cells.push({ key: "income", label: C.cells.income, value: usd(incomeYr), note: C.units.year, confidence: mark("income", income.tag) });

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
/* 08 demand: what one resident spends in a year.                             */
/* ------------------------------------------------------------------------- */

export type CityDemandData = {
  slug: string;
  iso2: string;
  name: string;
  /** The spend per resident a year as printed, or null where withheld; the raw figure beside it for the gates. */
  figure: string | null;
  value: number | null;
  /** The stated line where the figure would stand (the placeholder, or nothing on file), or null where the figure prints. */
  withheld: string | null;
  /** Said only when a figure prints: a basis describes a printed figure. */
  basis: string | null;
  /** "modelled" in words where the tag is not held, since the mark is off site-wide; null on a held figure and under a withheld line. */
  foot: string | null;
  tag: FactTag | null;
  sample: boolean;
};

/**
 * WHAT RESIDENTS SPEND (MODEL.md 8.3, `08 demand`; plan step 32's fourth
 * dispatch, 2026-09-18): the plain figure, `demand.spend_per_capita_usd` off
 * the bank, counted 2026-09-18 over the 252 shards: 252 hold it, 3 held
 * (Nanjing, Shanghai, Shenzhen, city retail-sales statistics), 248 modelled
 * (a share of metro GDP, marked in the foot), 1 placeholder (London, whose
 * drop says "illustrative; to be researched", item 23). A placeholder is
 * WITHHELD with its line, never printed (R11, clause 46); a shard with no
 * figure is withheld with its own line (no city today), so the band `08 |
 * 07` keeps two children on every city and the card never self-omits. The
 * millionaire count is not on this card: no field, no source, no method
 * (item 27), and a fill for a figure with no method is an invented figure
 * (clause 32). No second figure today (8.3: "a second figure only in the
 * `RangeStrip.extra` idiom, and none today").
 */
export function buildCityDemand(slug: string): CityDemandData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const C = COPY.cityDemand;
  const spend = figure(iso2, slug, "demand.spend_per_capita_usd");
  const base = { slug, iso2, name: city.name };
  if (!spend) return { ...base, figure: null, value: null, withheld: C.withheld.notOnFile, basis: null, foot: null, tag: null, sample: false };
  if (spend.tag === "placeholder") return { ...base, figure: null, value: null, withheld: fill(C.withheld.placeholder, { city: city.name }), basis: null, foot: null, tag: spend.tag, sample: true };
  return {
    ...base,
    figure: usd(spend.value),
    value: Math.round(spend.value),
    withheld: null,
    basis: C.basis,
    foot: notHeld(spend.tag) ? C.footModelled : null,
    tag: spend.tag,
    sample: notHeld(spend.tag),
  };
}

/* ------------------------------------------------------------------------- */
/* 15 season: residents and visitors, two shares of a hundred.               */
/* ------------------------------------------------------------------------- */

export type CitySeasonData = {
  slug: string;
  iso2: string;
  name: string;
  cells: KvCell[];
  /** The two shares as printed, null where withheld; `from` names the feed the gates count. */
  figures: { resident: number | null; visitor: number | null };
  from: "shard" | "slope" | null;
  withheld: string | null;
  basis: string | null;
  foot: string | null;
  confidence: "measured" | "modeled" | "placeholder";
};

/**
 * RESIDENTS AND VISITORS (MODEL.md 8.3, `15 season`; plan step 32's sixth
 * dispatch, 2026-09-18): two shares of a year's footfall, the people who live
 * here and the people visiting, on a KvGrid pair in ink. THE FEED ORDER, and
 * the count that set it: the shard's own field first, `footfall.resident_pct`
 * and `footfall.visitor_pct` in data/facts/city/<ISO2>-<slug>.json, held for
 * 251 of 252 (12 held at c 0.9, 239 modelled at c 0.55; each row in the
 * drop carries its own source, year and method, and the 239 differ from the
 * slope on 231 cities, so they are a reading of that city and not a fill;
 * FORMS-HOMES finding 5 named this field as the split's own, unread until
 * today); then, where the shard holds no row, the slope over the city list's
 * `tourist_arrivals_m` and `pop_m` (`visitorShareSlope`, London alone: its
 * shard carries no footfall row, item 23), marked modelled in the foot; and a
 * slope value that is the mechanism's own floor or ceiling is WITHHELD with
 * its line (R11, clause 46: a value at the model's limit is not the city's
 * figure; 153 of the 246 slope values are clamps, which is why the shard
 * comes first), as is a city with no visitor count on file. Counted
 * 2026-09-18 over the 252: 12 measured, 240 modelled (239 shard, London on
 * the slope at 84 and 16), 0 withheld; both withheld lines are reachable by
 * the builder's shape and by no city today. NO CELL AT 30: a pair of siblings
 * takes the head rung (PART 4, the sibling-figure reading), and FOCAL's zero
 * finding on this card stands as it does on the glance. The pair sums to a
 * hundred by construction on the shard (251 of 251) and by arithmetic on the
 * slope. The basis says what the two figures are; "footfall" is the field's
 * own word and the trade's.
 */
export function buildCitySeason(slug: string): CitySeasonData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const C = COPY.citySeason;
  const base = { slug, iso2, name: city.name };
  const cellsOf = (resident: number, visitor: number, confidence: NonNullable<KvCell["confidence"]>): KvCell[] => [
    { key: "residents", label: C.cells.residents, value: `${resident}%`, confidence },
    { key: "visitors", label: C.cells.visitors, value: `${visitor}%`, confidence },
  ];

  const r = figure(iso2, slug, "footfall.resident_pct", true);
  const v = figure(iso2, slug, "footfall.visitor_pct", true);
  if (r && v && r.value + v.value > 0) {
    const tag = weakest([r.tag, v.tag]);
    const confidence = cellConfidence(tag);
    /* A placeholder is never printed (no shard row carries one today; the rule stands). */
    if (confidence === "placeholder") return { ...base, cells: [], figures: { resident: null, visitor: null }, from: null, withheld: C.withheld.noCount, basis: null, foot: null, confidence: "placeholder" };
    return {
      ...base,
      cells: cellsOf(Math.round(r.value), Math.round(v.value), confidence),
      figures: { resident: Math.round(r.value), visitor: Math.round(v.value) },
      from: "shard",
      withheld: null,
      basis: C.basis,
      foot: notHeld(tag) ? C.footModelled : null,
      confidence,
    };
  }

  const slope = visitorShareSlope(city.tourist_arrivals_m, city.pop_m);
  if (!slope) return { ...base, cells: [], figures: { resident: null, visitor: null }, from: null, withheld: C.withheld.noCount, basis: null, foot: null, confidence: "modeled" };
  if (slope.clamped) return { ...base, cells: [], figures: { resident: null, visitor: null }, from: null, withheld: C.withheld.clamp, basis: null, foot: null, confidence: "modeled" };
  return {
    ...base,
    cells: cellsOf(100 - slope.pct, slope.pct, "modeled"),
    figures: { resident: 100 - slope.pct, visitor: slope.pct },
    from: "slope",
    withheld: null,
    basis: C.basis,
    foot: C.footSlope,
    confidence: "modeled",
  };
}
