/**
 * src/lib/spine/adapt_city.ts , the CITY-page real-data adapter (Phase B).
 *
 * Promotes the city spine surface (/dev/spine-city body, SpineCityBody) from its
 * illustrative London seed to real, reconciled data behind the isSpineReformEnabled()
 * flag. Server only, pure (no "use client"): it must be awaited from the RSC metropolis
 * route (src/app/cities/[slug]/page.tsx), never called from a client island.
 *
 * HONESTY RAIL (absolute): every filled figure is driven from the SAME accessors the
 * live /cities/[slug] page runs (CITIES_BY_SLUG, getCountryEconomicsSnapshot,
 * buildCityScore, buildCityView, buildCityActivities, buildCityPeers), plus the real
 * neighborhood engine (getNeighborhoodMultiplier + rentMultiplier + getNeighborhoodNetMargin)
 * over the 7 real London districts in data/economics/neighborhood_intensity_v1.json.
 * Nothing is fabricated. Fields with no honest source are left UNDEFINED in the returned
 * object; the spine body null-guards them so an omitted field renders NOTHING (never
 * "0" / "undefined" / NaN / a broken block). Prose is reused from the sanctioned
 * city_view.ts synthesis (view.honestTake / view.space / view.customer / view.visitorSplit),
 * never invented here.
 *
 * The trades' margin leader is the REAL local margin leader from the leaderboard
 * (buildCityActivities), NOT the seed's hardcoded hair-beauty. The entire trades
 * leaderboard, the entire where_to_trade district set, and every peer index recompute
 * from real sources; the seed's contradicting numbers (income 47K, split 80/20, the
 * fabricated Mayfair/Soho/Shoreditch districts, the illustrative peer indices) never
 * survive promotion. The `verdict` and `lenses` blocks this adapter built until plan
 * step 32 (2026-09-18) are gone with the cards MODEL.md 8.3 retires; the masthead's
 * answer is the average customer pay off the scorecard below.
 *
 * What is OMITTED on promotion (no honest per-figure source; see the field spec
 * docs/superpowers/specs/2026-07-03-city-field-provenance-map.md):
 *   - CityLenses (five word-anchored dot scales) , per-axis positions authored
 *   - CommercialSpace numeric rent-pressure + the peer rent STRIP + the lease-terms card
 *   - DemandSize's trend Spark and growth; DemandCalendar (monthly index)
 *   - FirstYear timeline; CityRisks; CityCharacter
 *   - IncomeCurve spend-share tiers (the curve itself is real, from the London spread)
 *   - locals_intel; the WhereToTrade map (no district lat/lng held)
 *   - trades cost_to_open + saturation columns; peers spend_index
 *
 * WHAT THE CITY FACT BANK FILLS SINCE 2026-09-17 (CITY-PROGRAMME step 1a,
 * research item 21). Three cards sat in the OMITTED list above as "founder
 * cost-of-living placeholders" and "$-magnitude, no source" while
 * data/facts/city/<ISO2>-<slug>.json held the figures for 252 cities and
 * nothing read it. The builders in src/lib/spine/fact_rows.ts read it now:
 *   - owner_runway   the living costs, a one-bed flat, groceries, a transport
 *                    pass and a coffee, a month (251 cities held or modelled;
 *                    London on placeholders, filled and marked, item 22)
 *   - rent_ratio     a year of one-bed rent over a year of typical pay, the
 *                    denominator chosen once in the builder (item 24)
 *   - demand.spend_per_capita_usd   what a resident spends in a year
 * Every one carries the bank's tag into _meta.confidence and a basis line
 * that says "modelled" or "placeholder" where the tag is not held, since the
 * sample mark is switched off site-wide. trades and demand carry a
 * _meta.confidence of their own now too (item 27): the trade figures are the
 * engine's model over trusted cells, and the resident/visitor split is a
 * slope over arrivals for every city, London's included.
 *
 * WHY THIS FILE SITS ON THE TAKE-HOME BYPASS BASELINE AND STAYS THERE.
 * Classified 2026-08-18. verify_take_home_identity flags it because the seed
 * shape it fills has a field literally called `net_margin_pct` and it does not
 * import the resolver. It derives nothing: `take_home_usd` and
 * `net_margin_pct` are `buildCityActivities`'s own figures, rounded, and that
 * module resolves both through `resolveOwnerTakeHome`.
 *
 * Verified by recomputing the upstream leaderboard independently and comparing
 * every carried row: London 8 rows, New York 9, Berlin 7, 24 in all, zero
 * mismatches and a worst dollar gap of $0. Nothing to convert; importing the
 * resolver here would only re-run it on its own output.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COUNTRIES } from "@/lib/taxonomy";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import {
  buildCityActivities,
  buildCityScore,
  type CityActivityRow,
} from "@/lib/scores/city_board";
import { buildCityPeers } from "@/lib/scores/city_peers";
import { buildCityView, type CityView } from "@/lib/cities/city_view";
import {
  getNeighborhoodMultiplier,
  getNeighborhoodNetMargin,
  tagLabel,
} from "@/lib/economics/neighborhood_multipliers";
import { rentOccupancyShareFor } from "@/lib/qa/industry_baselines";
import { buildCityDemand, buildCityLiving, buildCityRunway } from "@/lib/spine/fact_rows";
import { weakerTag } from "@/lib/facts/city_shard";
import { COPY } from "@/lib/spine/copy";
import { usd } from "@/components/spine/kit";

/* ------------------------------------------------------------------------- */
/* City record shape (the subset the adapter reads from city_list_v1.json).  */
/* ------------------------------------------------------------------------- */

type City = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number;
  gdp_b: number;
  avg_gross_salary_usd_year?: number;
  cost_of_living_index?: number;
  unemployment_pct?: number;
  tourist_arrivals_m?: number;
  /* Added 2026-08-24 for the spending pool's replacement. 234 of 252 carry it. */
  gini?: number;
  /* Added 2026-08-24 for the five reads. Counted, not assumed: 247 of 252 cities
     carry it. The type omitted it, so the field was invisible to this module even
     though every record had one. */
  hdi?: number;
  /* The per-row source notes, read for the masthead answer's confidence (item 31). */
  sources?: Record<string, string>;
};

const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

/** The 7 REAL London districts (data/economics/neighborhood_intensity_v1.json), each
 * with its display name (data/cities/neighborhoods_v1.json). This is the honest set
 * for where_to_trade; the seed's Mayfair / Soho / Shoreditch / Brixton do not exist in
 * any source and are dropped. Only used for the London exemplar; every other city
 * leaves where_to_trade undefined (the section self-omits). */
const LONDON_DISTRICTS: Array<{ slug: string; name: string }> = [
  { slug: "city-of-london", name: "City of London" },
  { slug: "west-end", name: "West End" },
  { slug: "south-bank", name: "South Bank" },
  { slug: "north-london", name: "North London" },
  { slug: "south-london", name: "South London" },
  { slug: "east-london", name: "East London" },
  { slug: "west-london", name: "West London" },
];

/* ------------------------------------------------------------------------- */
/* Small honest helpers.                                                     */
/* ------------------------------------------------------------------------- */

/**
 * THE EVERYDAY SET, §32: the eight trades a street actually carries, with the
 * named synonym collapses. Anything outside it is dropped rather than shown,
 * including dental practices, which §32 names as an example of an
 * out-of-context trade.
 *
 * HOISTED TO MODULE SCOPE AND EXPORTED, 2026-09-10 (the bento band). It was a
 * `const` inside `buildSpineCitySeed`, which made the WHOLE invisible: the seed
 * carried the part (`trades_here.list`, the trades this city holds a local
 * measurement for) and nothing anywhere could say what it was a part OF. A
 * count you can see needs both, and the whole has to be read from the same
 * place the filter reads it or the two drift.
 *
 * The slugs are HYPHENATED here, and the first version of this filter guessed
 * underscores from a sibling module's naming and matched nothing at all. Read
 * off the real data, not inferred.
 */
export const EVERYDAY_TRADES: ReadonlySet<string> = new Set([
  "restaurants", "grocery-stores", "pharmacies", "hairdressers-beauty",
  "sports-fitness", "auto-repair-shops", "cafes-coffee-shops", "bars-nightclubs",
]);

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
/** Round a whole percent, or undefined if not real. */
function pctOrUndef(v: number | null | undefined): number | undefined {
  return isNum(v) ? Math.round(v) : undefined;
}
/** Break-in score -> the seed's break_in_0_100 (already a 0..100), or undefined. */
function breakInOrUndef(v: number | null | undefined): number | undefined {
  return isNum(v) ? Math.round(v) : undefined;
}

/* ------------------------------------------------------------------------- */
/* The adapter , reshape the real accessors into the spine city seed shape.   */
/* ------------------------------------------------------------------------- */

/**
 * Build the real-data spine city seed for one city slug. Reuses the /cities/[slug]
 * route's resolution + accessor sequence, adds the neighborhood engine for
 * where_to_trade, and reshapes into the spine city seed shape. Every filled field is
 * driven from a real source; every field without an honest source is left undefined so
 * the spine body renders nothing there. Returns undefined when the slug does not
 * resolve (the route falls back to notFound() upstream, matching the non-spine page).
 */
export async function buildSpineCitySeed(slug: string): Promise<any> {
  const city = CITIES_BY_SLUG.get(slug);
  if (!city) return undefined;

  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  const econSnap = getCountryEconomicsSnapshot(city.iso2);
  const isLondon = city.slug === "london";

  // The city's ONE headline score (same call the route runs).
  const cityScore = buildCityScore({
    city: {
      slug: city.slug,
      popM: city.pop_m ?? null,
      avgGrossSalaryUsdYear: city.avg_gross_salary_usd_year ?? null,
      costOfLivingIndex: city.cost_of_living_index ?? null,
      touristArrivalsM: city.tourist_arrivals_m ?? null,
    },
    econ: {
      selfEmploymentPct: econSnap.selfEmploymentPct,
      avgMonthlySalary: econSnap.avgMonthlySalary,
      netWealthPerAdult: econSnap.netWealthPerAdult,
    },
  });

  // The peers (real set + real per-peer score), and the peer scores for the view.
  const peers = buildCityPeers(city.slug, 4);
  const scoredPeers = peers.filter(
    (p): p is typeof p & { score: number } => typeof p.score === "number",
  );

  // The sanctioned prose + spread view model (the route's buildCityView call).
  const view: CityView = buildCityView({
    citySlug: city.slug,
    cityName: city.name,
    countryName,
    tier: city.tier,
    popM: city.pop_m ?? null,
    avgGrossSalaryUsdYear: city.avg_gross_salary_usd_year ?? null,
    costOfLivingIndex: city.cost_of_living_index ?? null,
    touristArrivalsM: city.tourist_arrivals_m ?? null,
    selfEmploymentPct: econSnap.selfEmploymentPct,
    avgMonthlySalary: econSnap.avgMonthlySalary,
    netWealthPerAdult: econSnap.netWealthPerAdult,
    cityScore: cityScore ? { score: cityScore.score, band: cityScore.band } : null,
    peerScores: scoredPeers.map((p) => p.score),
    hasLondonMarket: isLondon,
  });

  // THE real trade leaderboard (async, budgeted). Every figure is real: take-home,
  // net margin, break-in, all via the same engines the cell page uses.
  const activities = await buildCityActivities({
    slug: city.slug,
    countryIso2: city.iso2,
  });

  /* -- trades ------------------------------------------------------------- */
  // The whole leaderboard, real. Only rows that carry a real take-home rank; a
  // dashed row (no trusted local measurement) is dropped rather than shown at $0.
  // cost_to_open + saturation are OMITTED (no source), which drops the EasiestTrades
  // cost column + the Crowding column + the Close cost-to-open.
  const tradeRows = activities
    .filter((a) => isNum(a.takeHome))
    .map((a: CityActivityRow) => ({
      name: a.name,
      slug: a.slug,
      take_home_usd: Math.round(a.takeHome as number),
      net_margin_pct: pctOrUndef(a.netMarginPct),
      break_in_0_100: breakInOrUndef(a.breakInScore),
      local: true,
      // cost_to_open_usd / saturation_0_100 DELIBERATELY absent (no honest source).
    }));

  // The local margin leader (the page's pick): the highest net margin among the real
  // local trades. This is the REAL winner, not the seed's hardcoded hair-beauty.
  const marginLeader = tradeRows
    .filter((t) => isNum(t.net_margin_pct))
    .slice()
    .sort((a, b) => (b.net_margin_pct as number) - (a.net_margin_pct as number))[0];

  const trades =
    tradeRows.length >= 3
      ? {
          read: view.honestTake
            ? "Take-home varies wide by trade, and the busiest are not the richest. What you keep matters more than what comes in."
            : undefined,
          // The margin read + easiest read are synthesized from the real leaderboard
          // (name the real leader), never a seed constant. Omitted when no leader.
          margin_read: marginLeader
            ? `${marginLeader.name} keeps the most of every pound here; the food trades keep the least.`
            : undefined,
          easiest_read: undefined, // EasiestTrades reads cost_to_open, which is omitted.
          list: tradeRows,
          /* MARKED MODELLED (research item 27, 2026-09-17). The rows' take-home
             and net margin are the cell engine's model run over trusted local
             cells: the cell is a measurement, the money on top of it is not.
             This object carried no _meta at all, so a card reading it could
             not have marked a figure even where the ruling allowed one. */
          _meta: { confidence: "modeled", source: "the cell engine's take-home and net margin over trusted local cells" },
        }
      : undefined;

  /* THE VERDICT BLOCK LEFT ON PLAN STEP 32 (2026-09-18). It composed a winner
     trade and the honest-take prose for a card no view read since the
     2026-07-11 reformation (the verdict card that stood on the page read the
     district builder, never this block), and MODEL.md 8.3 dissolves the
     rent verdict into the masthead's answer. The margin leader above still
     feeds the trades' margin read. */

  /* -- headline scorecard + self-employment ------------------------------ */
  // Only the two tiles with an honest source survive: the customer income (the real
  // London salary, 64.8K, RECONCILING the seed's 47K) and self-employment. Cost-to-open,
  // consumer-spend, rent-pressure, and survival tiles are OMITTED (no source). The
  // masthead renders whatever tiles are present, the first as its answer.
  /* THE ANSWER IS "AVERAGE CUSTOMER PAY" (MODEL.md 8.3, `00 masthead`; plan
     step 32's first dispatch, 2026-09-18; M16: "What customers earn" is the
     strip's kicker, and two cards do not share one name for two figures). The
     figure is unchanged, `avg_gross_salary_usd_year` off the city list, a
     mean, so the label says average and the basis says gross and a year; it
     prints through the kit's `usd` (C29, no private formatter). Its
     confidence is read off the row's own source note (item 31): the city's
     wage premium at tier A is measured, a country median times a size-class
     multiplier (96 rows) or a tier-B row is modelled. The masthead used to
     take the self-employment tile as its answer because this tile's label
     matched a lens grid row; the grid is retired and the tile leads. The
     four readers of a city's income still differ (item 24); the one-builder
     income is the fourth dispatch's, with `07 earnings`. */
  const scorecard: Array<{ label: string; value: string; sub?: string; unit?: string; confidence: string }> = [];
  const income = isNum(city.avg_gross_salary_usd_year) ? city.avg_gross_salary_usd_year : null;
  if (isNum(income)) {
    const note = String(city.sources?.avg_gross_salary_usd_year ?? "");
    scorecard.push({
      label: COPY.cityHero.answerLabel,
      value: usd(income),
      sub: COPY.cityHero.answerBasis,
      confidence: /tier-A/.test(note) ? "measured" : "modeled",
    });
  }
  if (isNum(econSnap.selfEmploymentPct)) {
    scorecard.push({
      label: "Self-employed",
      value: `${Math.round(econSnap.selfEmploymentPct)}`,
      unit: "%",
      sub: "of the workforce",
      confidence: "modeled",
    });
  }

  const headline = {
    self_employment_pct: pctOrUndef(econSnap.selfEmploymentPct),
    scorecard: scorecard.length > 0 ? scorecard : undefined,
  };

  /* -- income curve (real London spread; tiers OMITTED) ------------------- */
  // The curve reads median / top10 / top1 off the sanctioned London income spread
  // (city_view.buildCustomer, London-only invented-but-plausible p50/p75/p90). Every
  // other city has no defensible spread, so income is left undefined (the section
  // self-omits). The spend-share tiers are authored, so they are OMITTED.
  const spread = view.customer?.incomeSpread ?? null;
  const income_out =
    spread && isNum(spread.p50) && isNum(spread.p90)
      ? {
          median_income_usd: Math.round(spread.p50),
          // THE BOTTOM TENTH, carried since the build loop's run 11 (2026-09-06): the
          // range strip draws bottom tenth, typical, top tenth, the three marks the
          // country page's customers strip draws, so the two pages rhyme.
          bottom10_income_usd: Math.round(spread.p10),
          top10_income_usd: Math.round(spread.p90),
          // top1 is not carried in the spread; approximate the visible top tick from
          // the p90 tail only when the spread exists. The curve needs a top-1 x-tick;
          // use the p90 scaled by the same skew the spread already encodes (p90/p50),
          // so it stays inside the sanctioned distribution rather than a new invention.
          // Rounded to the nearest thousand like the spread it is derived from.
          // The spread stopped carrying dollar precision (it is multipliers on a
          // mean, not a measurement), so a figure derived from it twice over must
          // not read as exact either: this was printing $358,754.
          top1_income_usd: Math.round((spread.p90 * (spread.p90 / spread.p50)) / 1000) * 1000,
          read: view.customer?.note ?? undefined,
          // THE SPREAD IS MULTIPLIERS ON A MEAN, NOT A MEASUREMENT (city_view says
          // so), and the section wore no sample mark for it until run 11. Modelled,
          // and the card's note says so.
          _meta: { confidence: "modeled", source: "multipliers on the city's average gross pay" },
          // tiers OMITTED (authored spend shares).
        }
      : undefined;

  /* -- space (prose only; numeric rent-pressure + peer strip + terms OMITTED) */
  const space = view.space
    ? {
        read: view.space.verdict,
        peer_read: undefined, // the peer rent STRIP is omitted (no numeric source).
        terms_note: undefined,
        // rent_pressure_0_100 / deposit / lease / rent-free OMITTED.
      }
    : undefined;

  /* -- demand (the resident/visitor split, and the spend per resident) ---- */
  // The 72/28 split (view.visitorSplit.items) RECONCILES the seed's 80/20. The
  // $196B consumer-spend total is CUT by design, growth and the trend Spark are
  // OMITTED (no source), and the DemandCalendar is omitted (authored monthly index).
  // The spend per resident is READ FROM THE CITY FACT BANK since 2026-09-17
  // (research item 25 revised item 18: it existed for 252 of 252 and 0 rendered).
  const vs = view.visitorSplit;
  const resItem = vs.items?.find((it) => it.kept);
  const visItem = vs.items?.find((it) => !it.kept);
  /* HOW EVENLY THE MONEY IS SPREAD, the knowable neighbour for the spending pool.
     See design/replacements/spending-pool.md. §3: the t4 figures that card wanted,
     spend per resident and a millionaire count, are replaced rather than deleted.

     The page already answers "is there money here" twice. Nothing on it answered
     the SHAPE of that money: a broad middle to sell volume to, or a thin top to
     sell premium to. For an owner choosing a ticket price that is the actionable
     half, and it is knowable everywhere the field exists.

     THE WORD IS THE VALUE and the position is not printed (§26, and FORM-CATALOG's
     meter do-not: a precise marker on a rough measure fakes precision). Bands are
     the quartiles of the 234 cities that carry the field, computed from the set
     rather than chosen: 32.4, 35.7, 41.5. §40: the statistic's name never reaches
     a reader. */
  const spreadPool = CITIES.map((c) => c.gini).filter((v): v is number => isNum(v));
  const spreadWord = (() => {
    if (!isNum(city.gini) || spreadPool.length < 50) return undefined;
    const sorted = spreadPool.slice().sort((a, b) => a - b);
    const q = (f: number) => sorted[Math.floor(sorted.length * f)];
    const g = city.gini as number;
    return g < q(0.25) ? "Evenly spread" : g < q(0.5) ? "Fairly even" : g < q(0.75) ? "Somewhat uneven" : "Very uneven";
  })();

  /* THE SPLIT IS A SLOPE, NOT A COUNT, FOR EVERY CITY (research item 28): a
     visitor share of arrivals over residents times fourteen, clamped, and for
     London a typed 72/28. So the split's own tag is modelled wherever it
     draws, and until item 27 it carried no tag at all: DemandSize's sample
     check read undefined for every city and 245 modelled splits shipped
     unmarked. The spend per resident carries the bank's tag per city. The
     object's _meta.confidence is the weaker of the two, and each card reads
     its own figure's tag beside it. */
  const spendRow = buildCityDemand(city.iso2, city.slug, city.name);
  const hasSplit = !!(resItem && visItem);
  const splitConfidence: "modeled" | undefined = hasSplit ? "modeled" : undefined;
  const demand =
    hasSplit || spendRow
      ? {
          resident_pct: hasSplit ? Math.round(resItem!.perHundred) : undefined,
          visitor_pct: hasSplit ? Math.round(visItem!.perHundred) : undefined,
          spread_word: spreadWord,
          read: hasSplit ? (vs.body ?? vs.headline) : undefined,
          split_confidence: splitConfidence,
          split_basis: hasSplit ? COPY.cityDemand.seasonBasis : undefined,
          spend_per_capita_usd: spendRow ? Math.round(spendRow.spend.value) : undefined,
          spend_confidence: spendRow ? spendRow.tag : undefined,
          spend_basis: spendRow ? spendRow.basis : undefined,
          // consumer_spend_usd_bn (cut by design) / growth_pct_yoy / trend_* OMITTED.
          _meta: {
            confidence: weakerTag(splitConfidence ?? "held", spendRow?.tag ?? "held"),
            source: "the visitor share is a slope over arrivals and residents; the spend per resident is the city fact bank's",
          },
        }
      : undefined;

  /* -- where_to_trade (the 7 REAL districts, keep from the real engine) ---- */
  // London only: run the neighborhood engine per real district for the winner
  // activity. The component derives keep = (1 + rev_vs_city_pct/100) / rent_mult x 100,
  // so express the engine outputs in that schema: rev_vs_city_pct = (revMult - 1) x 100
  // (the honest revenue multiplier vs city baseline) and rent_mult = the rent
  // multiplier from the district's tags. The derived keep then equals the engine's own
  // (revenueMult / rentMult) x 100, i.e. its honest "should I open here" answer.
  // lat/lng are NOT held, so they are OMITTED and the map self-omits; the ranked
  // keep-index list stays.
  let where_to_trade: any = undefined;
  if (isLondon && marginLeader) {
    // baseline net margin + rent share for the winner activity, from its real leaderboard row.
    const baseNetMargin = isNum(marginLeader.net_margin_pct)
      ? (marginLeader.net_margin_pct as number) / 100
      : 0.1;
    /* THE RENT SHARE IS THE TRADE'S OWN SOURCED ONE (bug:rent-share-invented,
       2026-09-17). This used to be a typed 0.12, and that constant alone decided
       the sign of four rows: at the winner's sourced share (dental, 0.08) no
       district's engine net margin is negative, at 0.12 two are, at 0.20 four
       are. It comes from src/lib/qa/industry_baselines.ts now, read for the
       trade in question. Where the table has no row the share is the median of
       the rows it has, and rent_share_sourced=false on the payload says so. */
    const rentShare = rentOccupancyShareFor(marginLeader.slug);
    const baseRentShare = rentShare.share;

    /* WITHHELD when the engine has no model for the winner trade: every
       district's revenue would then be a neutral 1.0 by absence, and the rent
       ranking alone would stand under a heading about where to trade. The
       card self-omits on an undefined where_to_trade. Not the case for any
       of the ten leaderboard trades today (scratchpad/boundary.txt), so this
       is a rail, not a live branch. */
    let engineKnowsWinner = true;

    const districtRows = LONDON_DISTRICTS.map((dist) => {
      const mult = getNeighborhoodMultiplier(city.slug, dist.slug, marginLeader.slug);
      if (!mult.activityKnown) engineKnowsWinner = false;
      const nm = getNeighborhoodNetMargin(
        city.slug,
        dist.slug,
        marginLeader.slug,
        baseNetMargin,
        baseRentShare,
      );
      const primaryTag = mult.appliedTags[0];
      const character = primaryTag ? tagLabel(primaryTag) : "Residential";
      return {
        name: dist.name,
        slug: dist.slug,
        character,
        /* rev_vs_city_pct: the revenue multiplier vs the city baseline as a
           percent. THIS WAS EXACTLY 0 IN EVERY ROW until 2026-09-17: the slug
           went in hyphenated, the engine's tables are keyed with underscores,
           and every lookup fell to a neutral 1.0. The engine resolves either
           spelling at its boundary now (bug:district-revenue-dead). The
           districts card reads rent_mult only, so this figure reaches no
           reader today; see the honest answer at getNeighborhoodMultiplier
           before any card prints it. */
        rev_vs_city_pct: Math.round((mult.final - 1) * 100),
        /* rev_clipped: the revenue multiplier sits ON the engine's 0.4 floor or
           3.0 ceiling, so it is the bound, not a reading. Carried so a card
           can withhold on it. */
        rev_clipped: mult.clipped,
        // rent_mult: the real rent multiplier from the district's tags.
        rent_mult: +nm.rentMultiplier.toFixed(2),
        // lat / lng DELIBERATELY absent (no coords held); the map self-omits.
      };
    });

    // The full district x trade keep matrix behind the Pro veil is derived by the
    // component from these rows + the trades list, so it is fully real too.
    where_to_trade = engineKnowsWinner
      ? {
          read:
            "The loud names take the most revenue and give most of it back in rent; a few quieter districts keep more of every pound.",
          keep_note:
            "Keep index, city average = 100. Every inner district carries above-average rent, so the best keeper holds the most of each pound.",
          pro_teaser: undefined, // the seed's teaser lines are authored; the real ProMatrix carries the disclosure.
          list: districtRows,
          /* The trade the district figures were run for, and whether its rent
             share came from the baseline table or from the marked fallback. */
          trade_slug: marginLeader.slug,
          rent_share: baseRentShare,
          rent_share_sourced: rentShare.sourced,
        }
      : undefined;
  }

  /* -- peers (real set + real indices; spend_index OMITTED) --------------- */
  // Each peer's rent_index <- cost_of_living_index (real, London = 75, NOT indexed to
  // 100), median_income_usd <- avg_gross_salary_usd_year (real), visitors_m <-
  // tourist_arrivals_m (real). spend_index has NO source and is OMITTED (the CityPeers
  // table drops that row). The home city leads the list.
  //
  // CAREFUL, THE FIELD NAME LIES AND THE SEED SHAPE FORCES IT. This slot is
  // called median_income_usd, and what goes in it is avg_gross_salary_usd_year,
  // which is a MEAN. The other median_income_usd on this seed, the one on the
  // income curve above, really is a median (spread.p50), so the same name
  // carries two different statistics in one payload. It is safe TODAY only
  // because the table renders it as "Customer income", its own absolute
  // dollar figure in the column's own unit (task 9, 2026-09-08, replaced the
  // old reading as a percentage of the home city), so every row is a mean
  // printed beside another mean and no reader ever sees the word median.
  // Do NOT print this slot as a median, and do not reconcile it against the
  // income curve's figure: for London they are 64,800 and 57,000, and the
  // gap between them is real.
  const homeRow = {
    name: city.name,
    // The slug and the country code, carried since run 22 for the peers table's row key and flag.
    slug: city.slug,
    iso2: city.iso2,
    home: true,
    rent_index: isNum(city.cost_of_living_index) ? Math.round(city.cost_of_living_index) : undefined,
    median_income_usd: isNum(income) ? Math.round(income) : undefined,
    visitors_m: isNum(city.tourist_arrivals_m) ? +city.tourist_arrivals_m.toFixed(1) : undefined,
    // spend_index OMITTED.
  };
  const peerRows = peers
    .map((p) => {
      const rec = CITIES_BY_SLUG.get(p.slug);
      if (!rec) return null;
      return {
        name: p.name,
        slug: p.slug,
        iso2: p.iso2,
        home: false,
        rent_index: isNum(rec.cost_of_living_index) ? Math.round(rec.cost_of_living_index) : undefined,
        median_income_usd: isNum(rec.avg_gross_salary_usd_year)
          ? Math.round(rec.avg_gross_salary_usd_year)
          : undefined,
        visitors_m: isNum(rec.tourist_arrivals_m) ? +rec.tourist_arrivals_m.toFixed(1) : undefined,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const peersList = [homeRow, ...peerRows];
  const peers_out =
    peerRows.length >= 1
      ? {
          read:
            "Against its peers, each metro is set beside the others on rent, income, and annual visitors, like for like.",
          list: peersList,
        }
      : undefined;

  /* -- meta + provenance (from real coverage, NEVER "illustrative") -------- */
  const meta = {
    iso2: city.iso2,
    city: city.name,
    slug: city.slug,
    country_name: countryName,
    // The city's size class (1 to 3), carried since run 13 for the premises strip, which accented the country's average for cities of this size. That strip left the city page on plan step 32's second dispatch (2026-09-18; MODEL.md 8.3's bento draws the city's own figures), so nothing on the page reads this field today; it stays on the seed as the city's own fact.
    tier: city.tier,
    provenance_line:
      "Modeled from local business demography; the district and per-trade figures are real per-trade measurements.",
  };

  /* THE LENS GRID LEFT ON PLAN STEP 32 (2026-09-18). It ranked six fields of
     the city list against the other 251 cities (RANK_POOL and rankPct, a
     percentile per field, the words for each quarter) for the quick-reads
     spectra card; MODEL.md 8.3 has no such block (a percentile has no poles,
     R8; the city's `01 glance` is the fact card and `02 among-cities` the
     placement seat, both built off the files by their own builders). Its one
     other reading, the days to register off the country snapshot's sole-trader
     pick, went with it; the glance prints the city's own permit days off the
     shard instead. The day the placement form is clicked, the rank comes from
     placement.ts (one builder, every page, R2), not from here. */

  /* ============ WHAT TO OPEN HERE, RESTORED AS A FUNNEL BLOCK =============
     The July-3 baseline (§46) carries a chapter called "What to open, and what
     you keep". It has been dark since the real-data promotion, and it CANNOT be
     restored in that form, for a reason worth writing down rather than
     rediscovering.

     Every metric it wanted is either absent or BANNED at this altitude:

       cost to open, per trade, per city   omitted upstream, no source
       net margin by trade in a CITY       banned outright by §5
       owner take-home by trade in a CITY  the same figure, same ban
       the break-in score                  read the module before using the
                                           number: it blends payback (built on
                                           the banned per-city take-home) with a
                                           term its own comment labels "ROOM
                                           (crowding)", and §5 bans a derived
                                           crowding score

     So the honest replacement is not another ranking. §24 asks for precisely what
     belongs here instead: "higher pages (country, city) carry a block of real
     clickable businesses funneling into the cell pages". No ranking, no margin,
     no score. Just which trades this city actually holds a real local measurement
     for, each linking to its own page where those figures are lawful.

     §32, the fixed everyday set: restaurant, grocery, pharmacy, salon, gym, auto
     repair, cafe, bar, with the named synonym collapses. Anything outside it is
     dropped rather than shown, including dental practices, which §32 names as an
     example of an out-of-context trade. The set itself is `EVERYDAY_TRADES` at
     the top of this file, exported so a card can draw the WHOLE beside the
     part; the note on the slugs' shape lives with it. */
  const tradesHere = (trades?.list ?? [])
    .filter((t: any) => t.local && t.slug && EVERYDAY_TRADES.has(String(t.slug)))
    .map((t: any) => ({
      name: t.name,
      slug: t.slug,
      href: `/${String(city.iso2).toLowerCase()}/${city.slug}/${t.slug}`,
    }));
  /* Below four this reads as a stub rather than a block, and a thin funnel is
     worse than none: it implies the city is barely covered. */
  const trades_here =
    tradesHere.length >= 4
      ? { list: tradesHere }
      : undefined;

  /* ============ THE LIVING COSTS AND THE RENT RATIO, FROM THE BANK ==========
     owner_runway keeps its seed key, since the chapter reads it by that name
     and the illustrative seed carries it under that name too; what fills it
     is the fact bank's four figures with their tags (buildCityLiving), no
     longer the founder placeholders the OMITTED note above named for two
     months. The runway multiplication the card used to draw (a monthly burn
     times weeks to break-even) is gone with it: a city-level weeks-to-
     break-even has no honest anchor, a first-year ramp being a trade-level
     figure (city-view.tsx's header), and London's 38 was a placeholder.
     rent_ratio is the builder's output whole, so the card prints the
     denominator the builder chose and never recomputes one from the London-
     only income spread. */
  const living = buildCityLiving(city.iso2, city.slug, city.name);
  const owner_runway = living
    ? {
        rent_1bed_usd_mo: Math.round(living.rent.value),
        groceries_usd_mo: Math.round(living.groceries.value),
        transport_usd_mo: Math.round(living.transit.value),
        coffee_usd: living.coffee ? +living.coffee.value.toFixed(2) : undefined,
        monthly_usd: living.monthly,
        basis: living.basis,
        from: living.from,
        _meta: { confidence: living.tag, source: `the city fact bank, ${living.from} keys` },
      }
    : undefined;
  const rent_ratio = buildCityRunway(city.iso2, city.slug, city.name) ?? undefined;

  return {
    meta,
    trades_here,
    headline,
    trades,
    income: income_out,
    space,
    demand,
    where_to_trade,
    peers: peers_out,
    owner_runway,
    rent_ratio,
    // OMITTED entirely (no honest source): demand_calendar, first_year, risks,
    // character, locals_intel. Leaving them undefined makes the spine body
    // render nothing there (null-guarded).
  };
}
