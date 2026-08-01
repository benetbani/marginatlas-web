/**
 * src/lib/cities/city_adapter.ts
 *
 * `CityFile` to a page model, the same shape `spine2_adapter.ts` gives the trade
 * page. One model per chapter, a SPINE constant, and numbering that is a
 * property of the SPINE rather than of the data.
 *
 * THAT LAST POINT IS THE WHOLE DESIGN. The trade adapter originally filtered its
 * spine to chapters that had data and renumbered what was left, so a place with
 * four unfilled sections rendered seventeen chapters numbered 01 to 17 and a
 * reader had no way to know four were missing. The founder overruled it on
 * 2026-07-27: a page is always complete and its shape never varies by place.
 *
 * So chapter 13 is chapter 13 in London and in the two hundredth city. What
 * varies is whether a chapter renders its figures or renders a stated gap, and
 * that decision belongs to the page, not to this file.
 */
import type {
  CityArchetype,
  CityDistrictMixRow,
  CityRankFigure,
  CityFile,
  CityScorecardRow,
  Figure,
  NullFigure,
  PointFigure,
} from "./city_spine2_types";
import { isNullFigure } from "./city_spine2_types";

/* ------------------- the trades a district favours ----------------------- */

/**
 * Which trades suit a district, DERIVED from who is there.
 *
 * Ratified 2026-07-31, decision 6: the page should not stop at "heavy on
 * students", it should say "which favours cafes, bars and gyms". The founder
 * wanted the conclusion drawn, because a first-time owner often cannot make
 * that leap from a population chart.
 *
 * IT IS DERIVED, NOT AUTHORED, and that is the load-bearing choice. Every
 * archetype already declares its `tradesThatIndexHigh` once, at city level.
 * Reading a district's favoured trades from its own top types means the two can
 * never disagree. Authoring them per district would create a second home for
 * the same claim, and a district could then recommend cafes while the
 * population strip beside it says nobody there buys coffee. The trade page
 * audit found several defects of exactly that shape.
 *
 * IT SCORES WHAT IS DISTINCTIVE, NOT WHAT IS COMMON, and this was learned by
 * looking at the output rather than reasoning about it. The obvious version
 * sums each type's raw share. Run against the London fixture it returned "gyms"
 * for five districts out of six, because young professionals and young renters
 * dominate most of London and both favour gyms. A mechanism that says the same
 * thing about every district cannot help anyone choose between them, which is
 * the entire job.
 *
 * So a type only contributes where the district is ABOVE the city on it, and it
 * contributes the DIFFERENCE. A district that is 30% students in a city that is
 * 8% students surfaces student trades hard; a district that is average on
 * everything surfaces little, which is itself the honest answer about a place
 * with no particular character.
 *
 * Still no formula in the sense the founder ruled out: it is one subtraction.
 *
 * Returns [] when the district has no mix or no type stands out, which the
 * renderer prints as a stated gap rather than inventing a recommendation.
 */
/**
 * How far above the city a district must sit, in accumulated points of share,
 * before we will name a trade for it. Below this the district is ordinary and
 * the honest output is nothing at all.
 *
 * A KNOWN LIMIT, recorded rather than tuned away. Each archetype declares only
 * about three favoured trades and the lists overlap heavily: the two commonest
 * London types both name gyms. So this discriminates well at the extremes,
 * where Mayfair returns boutiques and fine dining while Brixton returns barbers
 * and groceries, and poorly between four similar inner-city districts, which
 * all return some ordering of gyms, restaurants and salons. That is a thinness
 * in the archetype-to-trade vocabulary, not in the scoring, and no amount of
 * reweighting fixes it. Enriching those lists is the real work.
 */
const FAVOURED_TRADE_FLOOR = 5;

export function favouredTrades(
  row: CityDistrictMixRow,
  archetypes: CityArchetype[],
  limit = 3,
): string[] {
  const byKey = new Map(archetypes.map((a) => [a.key, a]));
  /** The city baseline this district is measured against. */
  const cityShare = new Map(archetypes.map((a) => [a.key, a.sharePct]));
  const score = new Map<string, number>();

  for (const t of row.top) {
    const arch = byKey.get(t.key);
    if (!arch) continue; // a type absent from the city strip contributes nothing
    const lift = t.sharePct - (cityShare.get(t.key) ?? 0);
    if (lift <= 0) continue; // at or below the city average says nothing about this place
    for (const trade of arch.tradesThatIndexHigh) {
      score.set(trade, (score.get(trade) ?? 0) + lift);
    }
  }

  return [...score.entries()]
    .filter(([, lift]) => lift >= FAVOURED_TRADE_FLOOR)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([trade]) => trade);
}

/* ------------------------------ the spine -------------------------------- */

export type CityChapterId =
  | "hero"
  | "scorecard"
  | "incomeAndWealth"
  | "visitors"
  | "people"
  | "spaceCosts"
  | "tradeEconomics"
  | "districtRent"
  | "tradeFit"
  | "districts"
  | "direction"
  | "myths"
  | "peers"
  | "watch"
  | "voices"
  | "verdict"
  | "methodology"
  | "next";

/**
 * The eighteen chapters, in order, with the titles and icons the mockup uses.
 * Chapters 08 and 10 both render the district list; the mockup does this
 * deliberately (rent by district, then the districts themselves) and the
 * contract holds ONE list so the two cannot disagree.
 */
export const CITY_SPINE: Array<{ id: CityChapterId; title: string; icon: string }> = [
  { id: "hero", title: "The answer", icon: "skyline" },
  { id: "scorecard", title: "The city in seven numbers", icon: "scorecard" },
  { id: "incomeAndWealth", title: "Household income and wealth", icon: "bank" },
  { id: "visitors", title: "Visitors through the year", icon: "tourist" },
  { id: "people", title: "Who lives here, and what they can spend", icon: "spending-power" },
  { id: "spaceCosts", title: "What space costs", icon: "commercial-rent" },
  { id: "tradeEconomics", title: "What owners keep", icon: "owner-keeps" },
  { id: "districtRent", title: "Rent by district", icon: "neighborhood" },
  { id: "tradeFit", title: "Best area for each trade", icon: "best-areas" },
  { id: "districts", title: "The districts", icon: "district-mix" },
  { id: "direction", title: "Where the city is heading", icon: "trend" },
  { id: "myths", title: "Common myths", icon: "myth-reality" },
  { id: "peers", title: "Against peer cities", icon: "benchmark" },
  { id: "watch", title: "What to watch", icon: "watch" },
  { id: "voices", title: "What operators say", icon: "operator-voices" },
  { id: "verdict", title: "The verdict", icon: "honest-take" },
  { id: "methodology", title: "How we work this out", icon: "methodology" },
  { id: "next", title: "Where to go next", icon: "where-it-pays" },
];

export type CityChapter = {
  id: CityChapterId;
  num: string;
  title: string;
  icon: string;
  anchor: string;
};

/** Every chapter, always, numbered in order. Never filtered by data. */
export function numberCityChapters(): CityChapter[] {
  return CITY_SPINE.map((s, i) => ({
    id: s.id,
    num: String(i + 1).padStart(2, "0"),
    title: s.title,
    icon: s.icon,
    anchor: `ch-${String(i + 1).padStart(2, "0")}`,
  }));
}

/* ------------------------------ formatting ------------------------------- */

/**
 * Money, in the page's own register: `$22K`, `$1.1M`, `$620`.
 * Lifted in spirit from the trade adapter so the two page types round and
 * abbreviate identically. A city page that says $22K beside a trade page that
 * says $22,000 for the same quantity reads as two products.
 */
function money(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `$${(v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${Math.round(v)}`;
}

/**
 * A plain count: `21M`, `640K`, `9,700`.
 * Visitor counts run to eight digits and an unformatted one is unreadable at a
 * glance, which is the whole job of this column.
 */
function count(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) {
    const m = v / 1_000_000;
    return `${a >= 10_000_000 ? Math.round(m) : m.toFixed(1)}M`;
  }
  if (a >= 10_000) return `${Math.round(v / 1_000)}K`;
  return v.toLocaleString("en-GB");
}

/**
 * Render a figure for display, or null when it is a hole.
 *
 * MATCHED AGAINST THE UNITS THE CONTRACT ACTUALLY USES, not against a guess.
 * The first version tested `unit === "x"` and the fixture says
 * `"x the country"`, so two multiples rendered as bare `2.1` and `1.3`, and a
 * visitor count rendered as `21000000`. None of that is visible in the markup;
 * it took looking at the page. The unit strings are prose by design (they are
 * shown to readers elsewhere), so this matches on their SHAPE.
 */
function display(f: Figure | undefined, unitOverride?: string): string | null {
  if (!f || isNullFigure(f)) return null;
  const p = f as PointFigure;
  if (typeof p.value !== "number") return null;
  const unit = (unitOverride ?? p.unit ?? "").trim();

  if (/^USD/i.test(unit)) return money(p.value);
  if (unit === "%" || /^percent/i.test(unit)) return `${p.value}%`;
  // "x the country", "x the UK", "x" , a multiple of some baseline.
  if (/^x\b/i.test(unit)) return `${p.value}x`;
  // "score of 100", "of 100" , the denominator is the column header's job.
  if (/^score\b|^of \d/i.test(unit)) return String(p.value);
  // Anything counted: "visitors/yr", "residents", "households".
  if (Number.isInteger(p.value) && Math.abs(p.value) >= 10_000) return count(p.value);
  return String(p.value);
}

/* -------------------------------- models --------------------------------- */

export type CityHeroModel = {
  city: string;
  country: string;
  headline: string;
  headlineLabel: string;
  /** The four glance rows. Each may be null; the row then states its gap. */
  glance: Array<{ label: string; sub?: string; value: string | null }>;
};

export type CityScorecardRowModel = {
  label: string;
  sub?: string;
  value: string | null;
  position: number;
};

export type CityScorecardModel = {
  baselineLabel: string;
  rows: CityScorecardRowModel[];
};

/**
 * Chapter 10, the districts, assembled from three separate figures that the
 * contract keeps apart on purpose: the district list (rent, character), the
 * wealth reading and the population mix. They are joined here rather than in
 * the file because each carries its own tier: rent is often measured where
 * wealth is only estimated, and a reader is owed that difference.
 *
 * `favours` is DERIVED from the mix, never authored. See favouredTrades.
 */
export type CityDistrictRowModel = {
  slug: string;
  name: string;
  blurb: string;
  icon: string | null;
  /** Rent against the city rate, e.g. "1.4x". Null when unpriced. */
  rent: string | null;
  /** Five plain steps against this city's own average. Never an index number,
   * and never comparable with another city. */
  resident: string | null;
  daytime: string | null;
  /** Top five population types, largest first, display names. */
  mix: Array<{ name: string; sharePct: number }>;
  /** Types notably thin here. The absence is half the point. */
  scarce: string[];
  /** Trades this district's population tilts towards. Empty when nothing
   * stands out, which is the honest answer for an ordinary district. */
  favours: string[];
};

export type CityDistrictsModel = {
  rows: CityDistrictRowModel[];
  /** The one quiet line the founder asked for (decision 4), or null when every
   * reading behind the section is measured. */
  note: string | null;
};

/** The five bands, in plain words. Ratified 2026-07-31 decision 1: bands, never
 * an index, because ~84% of income variance sits inside a small area and a
 * number would claim a precision that does not exist. */
const WEALTH_LABEL: Record<string, string> = {
  "well-above": "Well above average",
  above: "Above average",
  around: "Around average",
  below: "Below average",
  "well-below": "Well below average",
};

/** Chapter 05. See CityPeopleModel for why one figure in the file is skipped. */
function buildPeople(file: CityFile): CityPeopleModel | null {
  const p = file.people;
  if (p == null) return null;

  const bands = isNullFigure(p.wealthBands)
    ? []
    : p.wealthBands.bands.map((b) => ({ label: b.label, sharePct: b.sharePct }));

  const types = isNullFigure(p.archetypes)
    ? []
    : [...p.archetypes.types]
        .sort((a, b) => b.sharePct - a.sharePct)
        .map((a) => ({
          key: a.key,
          name: a.name,
          icon: a.icon ?? null,
          sharePct: a.sharePct,
          spendingPower: a.spendingPowerLabel,
          income: Number.isFinite(a.incomeAfterTax) ? money(a.incomeAfterTax) : null,
          ageRange: a.ageRange,
          tenure: a.tenure,
          buys: a.buys,
          favours: a.tradesThatIndexHigh,
          accent: a.accent === true,
        }));

  if (!bands.length && !types.length && isNullFigure(p.residents)) return null;

  return { residents: display(p.residents), bands, types };
}

/**
 * Chapter 10. Joins the district list with the wealth reading, the population
 * mix and the derived favoured trades. Each of the three is optional and
 * independently tiered, so a city with rents but no wealth reading still
 * renders every district and simply says less about each.
 */
function buildDistricts(file: CityFile): CityDistrictsModel | null {
  const d = file.districts;
  if (d == null || isNullFigure(d.list)) return null;

  const wealthRows = isNullFigure(d.wealth) ? [] : d.wealth.rows;
  const mixRows = isNullFigure(d.mix) ? [] : d.mix.rows;
  const archetypes = isNullFigure(file.people.archetypes) ? [] : file.people.archetypes.types;
  const archName = new Map(archetypes.map((a) => [a.key, a.name]));

  const wealthBy = new Map(wealthRows.map((r) => [r.districtSlug, r]));
  const mixBy = new Map(mixRows.map((r) => [r.districtSlug, r]));

  const rows: CityDistrictRowModel[] = d.list.districts.map((row) => {
    const w = wealthBy.get(row.slug);
    const m = mixBy.get(row.slug);
    return {
      slug: row.slug,
      name: row.name,
      blurb: row.blurb,
      icon: row.icon ?? null,
      rent: Number.isFinite(row.rentMultiple) ? `${row.rentMultiple.toFixed(1)}x` : null,
      resident: w ? (WEALTH_LABEL[w.resident] ?? null) : null,
      daytime: w ? (WEALTH_LABEL[w.daytime] ?? null) : null,
      mix: m ? m.top.map((t) => ({ name: archName.get(t.key) ?? t.key, sharePct: t.sharePct })) : [],
      scarce: m ? m.scarce.map((k) => archName.get(k) ?? k) : [],
      favours: m && archetypes.length ? favouredTrades(m, archetypes) : [],
    };
  });

  /* Decision 4: one quiet line, once, where it matters. It appears only when
     something behind the section is not a measurement, so a city with real
     readings is not made to apologise for them. */
  const approximate =
    (!isNullFigure(d.wealth) && d.wealth.tier !== "measured") ||
    (!isNullFigure(d.mix) && d.mix.tier !== "measured");

  return {
    rows,
    note: approximate
      ? "Wealth and population readings here are approximate. They place a district against its own city, and cannot be compared with a district in another city."
      : null,
  };
}

/**
 * Chapter 05, the population types. This is POPs, ratified 2026-06-22 and named
 * by the founder as one of the most important upgrades the site has.
 *
 * It was already fully described in the contract and fully filled in the
 * fixture, and it still rendered as a stated gap, which is the worst of both:
 * the work was done and nobody could see it.
 *
 * `millionaireHouseholds` is deliberately NOT surfaced. The founder cut it by
 * name: it is evasive next to the other figures, and a count of millionaires
 * tells someone opening a cafe nothing they can act on. It stays in the file
 * because the file describes the city; the page decides what is worth printing.
 */
export type CityArchetypeModel = {
  key: string;
  name: string;
  icon: string | null;
  sharePct: number;
  spendingPower: string;
  /** After tax, per year. Null when unpriced. */
  income: string | null;
  ageRange: string;
  tenure: string;
  buys: string[];
  favours: string[];
  accent: boolean;
};

export type CityPeopleModel = {
  residents: string | null;
  /** The wealth spread, in the file's own order, poorest first. */
  bands: Array<{ label: string; sharePct: number }>;
  /** Population types, largest share first. */
  types: CityArchetypeModel[];
};

export type CityPageModel = {
  meta: {
    city: string;
    citySlug: string;
    country: string;
    countrySlug: string;
    urlPath: string;
  };
  chapters: CityChapter[];
  hero: CityHeroModel | null;
  scorecard: CityScorecardModel | null;
  /** Chapters not yet ported. Present so the assembly can be written against
   *  the full spine today and filled in without touching it again. */
  incomeAndWealth: null;
  visitors: null;
  people: CityPeopleModel | null;
  spaceCosts: null;
  tradeEconomics: null;
  districtRent: null;
  tradeFit: null;
  districts: CityDistrictsModel | null;
  direction: null;
  myths: null;
  peers: null;
  watch: null;
  voices: null;
  verdict: null;
  methodology: null;
  next: null;
};

/**
 * "8th of 40 cities" , the qualifier beside the business-climate reading.
 *
 * Typed against `CityRankFigure` rather than cast through unknown shapes: the
 * rank and its denominator are a pair, and a rank printed without the size of
 * the field it ranks in is close to meaningless. Returns undefined when the
 * city has no rank, and the row then prints without a qualifier rather than
 * with an empty one.
 */
function rankSub(f: CityRankFigure | NullFigure): string | undefined {
  if (isNullFigure(f as Figure)) return undefined;
  const r = f as CityRankFigure;
  if (typeof r.rank !== "number" || typeof r.of !== "number") return undefined;
  return `${ordinal(r.rank)} of ${r.of}`;
}

/** 1 -> 1st, 2 -> 2nd, 11 -> 11th. The teens are the reason this is a function. */
function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  const rem10 = n % 10;
  return `${n}${rem10 === 1 ? "st" : rem10 === 2 ? "nd" : rem10 === 3 ? "rd" : "th"}`;
}

const row = (r: CityScorecardRow): CityScorecardRowModel => ({
  label: r.label,
  sub: r.sub,
  value: display(r.figure),
  position: r.position,
});

export function buildCityPage(file: CityFile): CityPageModel {
  const m = file.meta;

  /* The hero's headline is the same quantity as the scorecard's spend row. The
     contract says so explicitly and says the hero slot exists only for cities
     whose answer is a different number, so we prefer the hero's own figure and
     fall back to the scorecard rather than printing two different values for
     one fact. */
  const headline =
    display(file.hero.headline) ?? display(file.scorecard.spendPerResident.figure);

  const hero: CityHeroModel | null = headline
    ? {
        city: m.city.name,
        country: m.country.name,
        headline,
        headlineLabel: file.hero.headlineLabel,
        glance: [
          {
            label: "Business climate",
            sub: rankSub(file.hero.businessClimateRank),
            value: display(file.scorecard.businessClimate.figure),
          },
          { label: "Commercial rent", value: display(file.scorecard.commercialRent.figure) },
          { label: "Median pay", value: display(file.scorecard.medianPay.figure) },
          { label: "Visitors", value: display(file.scorecard.visitors.figure) },
        ],
      }
    : null;

  const scorecard: CityScorecardModel = {
    baselineLabel: file.scorecard.baselineLabel,
    rows: [
      row(file.scorecard.spendPerResident),
      row(file.scorecard.medianPay),
      row(file.scorecard.costOfLiving),
      row(file.scorecard.commercialRent),
      row(file.scorecard.visitors),
      row(file.scorecard.unemployment),
      row(file.scorecard.businessClimate),
    ],
  };

  return {
    meta: {
      city: m.city.name,
      citySlug: m.city.slug,
      country: m.country.name,
      countrySlug: m.country.slug,
      urlPath: m.urlPath,
    },
    chapters: numberCityChapters(),
    hero,
    scorecard,
    incomeAndWealth: null,
    visitors: null,
    people: buildPeople(file),
    spaceCosts: null,
    tradeEconomics: null,
    districtRent: null,
    tradeFit: null,
    districts: buildDistricts(file),
    direction: null,
    myths: null,
    peers: null,
    watch: null,
    voices: null,
    verdict: null,
    methodology: null,
    next: null,
  };
}

export type { NullFigure };
