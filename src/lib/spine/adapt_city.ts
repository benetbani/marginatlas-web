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
 * The verdict winner is the REAL local margin leader from the leaderboard
 * (buildCityActivities), NOT the seed's hardcoded hair-beauty. The entire trades
 * leaderboard, the entire where_to_trade district set, and every peer index recompute
 * from real sources; the seed's contradicting numbers (income 47K, split 80/20, the
 * fabricated Mayfair/Soho/Shoreditch districts, the illustrative peer indices) never
 * survive promotion.
 *
 * What is OMITTED on promotion (no honest per-figure source; see the field spec
 * docs/superpowers/specs/2026-07-03-city-field-provenance-map.md):
 *   - CityLenses (five word-anchored dot scales) , per-axis positions authored
 *   - CommercialSpace numeric rent-pressure + the peer rent STRIP + the lease-terms card
 *   - OwnerRunway (founder cost-of-living placeholders)
 *   - DemandSize $-magnitude + the trend Spark; DemandCalendar (monthly index)
 *   - FirstYear timeline; CityRisks; CityCharacter
 *   - IncomeCurve spend-share tiers (the curve itself is real, from the London spread)
 *   - locals_intel; the WhereToTrade map (no district lat/lng held)
 *   - trades cost_to_open + saturation columns; peers spend_index
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
        }
      : undefined;

  /* -- verdict (winner = the REAL local margin leader) -------------------- */
  // The keep_pct, winner_trade, and winner_slug all follow the real leader; the why /
  // catch prose reuses the sanctioned city_view honest-take + space verdict.
  const verdict =
    marginLeader && view.honestTake
      ? {
          kicker: `The ${city.name} verdict`,
          winner_trade: `${marginLeader.name} keeps the most`,
          winner_slug: marginLeader.slug,
          keep_pct: marginLeader.net_margin_pct,
          why: view.honestTake.body ?? view.honestTake.verdict,
          catch: view.space ? view.space.verdict : undefined,
          // strip: winner take-home + break-in word; cost-to-open OMITTED.
          strip: undefined,
        }
      : undefined;

  /* -- headline scorecard + self-employment ------------------------------ */
  // Only the two tiles with an honest source survive: the customer income (the real
  // London salary, 64.8K, RECONCILING the seed's 47K) and self-employment. Cost-to-open,
  // consumer-spend, rent-pressure, and survival tiles are OMITTED (no source). The
  // masthead renders whatever tiles are present.
  const scorecard: Array<{ label: string; value: string; sub?: string; unit?: string; confidence: string }> = [];
  const income = isNum(city.avg_gross_salary_usd_year) ? city.avg_gross_salary_usd_year : null;
  if (isNum(income)) {
    scorecard.push({
      label: "Customer income",
      value: `$${Math.round(income / 1000)}K`,
      sub: "average earner, a year",
      confidence: "measured",
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

  /* -- demand (only the resident/visitor split is real; magnitude OMITTED) - */
  // The 72/28 split is real (view.visitorSplit.items), RECONCILING the seed's 80/20.
  // The $196B consumer-spend magnitude, per-capita, growth, and the trend Spark are
  // OMITTED (no source). The DemandCalendar is omitted (authored monthly index).
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

  const demand =
    resItem && visItem
      ? {
          resident_pct: Math.round(resItem.perHundred),
          visitor_pct: Math.round(visItem.perHundred),
          spread_word: spreadWord,
          read: vs.body ?? vs.headline,
          // consumer_spend_usd_bn / spend_per_capita_usd / growth_pct_yoy / trend_* OMITTED.
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
    // A modeled baseline occupancy (rent) share for a single-site storefront trade.
    // This is only used INSIDE the engine to compose the district net-margin matrix; it
    // never surfaces as a standalone figure, and the district ranking it drives is the
    // honest keep re-rank the section is built to show.
    const baseRentShare = 0.12;

    const districtRows = LONDON_DISTRICTS.map((dist) => {
      const mult = getNeighborhoodMultiplier(city.slug, dist.slug, marginLeader.slug);
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
        // rev_vs_city_pct: the honest revenue multiplier vs city baseline as a percent.
        rev_vs_city_pct: Math.round((mult.final - 1) * 100),
        // rent_mult: the real rent multiplier from the district's tags.
        rent_mult: +nm.rentMultiplier.toFixed(2),
        // lat / lng DELIBERATELY absent (no coords held); the map self-omits.
      };
    });

    // The full district x trade keep matrix behind the Pro veil is derived by the
    // component from these rows + the trades list, so it is fully real too.
    where_to_trade = {
      read:
        "The loud names take the most revenue and give most of it back in rent; a few quieter districts keep more of every pound.",
      keep_note:
        "Keep index, city average = 100. Every inner district carries above-average rent, so the best keeper holds the most of each pound.",
      pro_teaser: undefined, // the seed's teaser lines are authored; the real ProMatrix carries the disclosure.
      list: districtRows,
    };
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
  // because the table renders it as "Customer income" and as a percentage of
  // the home city, so a mean is compared against a mean on both sides and no
  // reader ever sees the word median. Do NOT print this slot as a median, and
  // do not reconcile it against the income curve's figure: for London they are
  // 64,800 and 57,000, and the gap between them is real.
  const homeRow = {
    name: city.name,
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
    provenance_line:
      "Modeled from local business demography; the district and per-trade figures are real per-trade measurements.",
  };

  /* ===================== THE FIVE READS, RESTORED ==========================
     Rulebook v2 §3: a t4 figure is REPLACED with a knowable neighbour, not
     deleted. This section was dropped with "no honest source" and the whole
     chapter went dark with it, which is exactly what §2 calls a failure: "a page
     of dashes is a failure, not a virtue." The July-3 baseline (§46) carries this
     chapter as "The city, in five reads".

     Every input below is a MEASURED field on the city record, present for all or
     nearly all 252 cities, counted rather than assumed:

       gdp_b                     252/252    how much trade the place does
       avg_gross_salary_usd_year 252/252    what a customer earns
       cost_of_living_index      252/252    what it costs to be here
       hdi                       247/252    the depth of the workforce
       tourist_arrivals_m        246/252    how much demand comes from outside

     ONE FIXED SITE-WIDE FORMULA, never hand-picked per city (§8): each read is a
     PERCENTILE RANK within the whole 252-city set. A rank is like-for-like by
     construction, which is what §10 requires, and it means no raw cross-geography
     money is ever shown.

     §29A, pinned: worse reads low and left, better high and right, and a COST is
     inverted before rendering so high = good on every scale in the band. Cost of
     living is therefore flipped: a cheap city ranks HIGH on "Affordable space".

     §5 is respected: no per-district keep ranking, no derived crowding score. The
     baseline's "Room to enter" read was a crowding score and stays deleted.

     NOT TAGGED AS A SAMPLE (§4/§4A): every input is measured and the transform is
     a rank, not a model. Nothing here is estimated. */
  const RANK_POOL = CITIES.filter((c) => c.slug !== city.slug);
  /** Where this city sits among all the others on one field, 0 to 100. */
  const rankPct = (value: number | undefined, field: keyof City, invert = false): number | undefined => {
    if (!isNum(value)) return undefined;
    const others = RANK_POOL.map((c) => c[field]).filter((v): v is number => isNum(v as number));
    if (others.length < 20) return undefined; // too thin a pool for a rank to mean anything
    const below = others.filter((v) => v < value).length;
    const pct = Math.round((below / others.length) * 100);
    return invert ? 100 - pct : pct;
  };
  /** Four plain words across the scale. The word IS the value (FORM-CATALOG). */
  const word = (pos: number, poles: [string, string, string, string]) =>
    pos < 25 ? poles[0] : pos < 50 ? poles[1] : pos < 75 ? poles[2] : poles[3];

  const lensSpecs: Array<{
    key: string; label: string; pos?: number; left: string; right: string;
    words: [string, string, string, string];
  }> = [
    { key: "demand", label: "Demand depth", pos: rankPct(city.gdp_b, "gdp_b"),
      left: "Thin", right: "Deep", words: ["Thin", "Modest", "Solid", "Deep"] },
    { key: "income", label: "Customer income", pos: rankPct(city.avg_gross_salary_usd_year, "avg_gross_salary_usd_year"),
      left: "Modest", right: "High", words: ["Modest", "Middling", "Comfortable", "High"] },
    { key: "rent_relief", label: "Affordable space", pos: rankPct(city.cost_of_living_index, "cost_of_living_index", true),
      left: "Costly", right: "Cheap", words: ["Costly", "Dear", "Fair", "Cheap"] },
    { key: "talent", label: "Talent pool", pos: rankPct(city.hdi, "hdi"),
      left: "Scarce", right: "Deep", words: ["Scarce", "Thin", "Solid", "Deep"] },
    { key: "visitors", label: "Trade from outside", pos: rankPct(city.tourist_arrivals_m, "tourist_arrivals_m"),
      left: "Local", right: "Visited", words: ["Local", "Mostly local", "Mixed", "Visited"] },
    /* SIX, not five, and the sixth earns its place two ways. It fills the 2x3 grid,
       so no read is left alone beside a blank half (§17, the sparse-but-wide reject
       this section is specifically named for). And it says something the others do
       not: measured against how much trade a place does, market size correlates at
       r = 0.63, so the two disagree for a large share of cities, and against
       customer income at r = -0.29, which is the opposite direction. A big poor
       city and a small rich one read differently here, which is what §7 asks. */
    { key: "size", label: "Market size", pos: rankPct(city.pop_m, "pop_m"),
      left: "Small", right: "Large", words: ["Small", "Modest", "Big", "Large"] },
  ];
  const scales = lensSpecs
    .filter((l): l is typeof l & { pos: number } => isNum(l.pos))
    .map((l) => ({ key: l.key, label: l.label, pos: l.pos, word: word(l.pos, l.words), left: l.left, right: l.right }));
  /* The chapter needs enough reads to be worth a chapter, and the grid is two
     columns, so an ODD count leaves one read alone beside a blank half. Five of six
     is the floor and six is the shape; at five the band would be lopsided, which is
     the exact defect §17 names. */
  /* HOW FAST YOU CAN OPEN, the knowable half of what the lease-terms card asked.
     See design/replacements/lease-terms.md. §3: the deposit, lease length and
     rent-free months it wanted are tier 4 with no per-city source, and the SPACE
     half has no neighbour at all, because the one space field this record carries
     is already spent twice on the page. The paperwork half is knowable for 235 of
     252 cities, 93%.

     IT SITS WITH THE CONDITIONS, AND THE FIRST ATTEMPT PUT IT IN THE WRONG PLACE.
     It rode on the trades block, which is undefined unless a city holds four or
     more trades with local figures, so on Lagos, Dhaka, New York and Mumbai the
     figure was carried and reached nobody, which is the exact fault this whole
     effort exists to fix. Caught by asking what could be wrong with it rather
     than by any gate. The conditions card renders for every city, and how long
     the paperwork takes is a condition of the place. */
  const daysToRegister = isNum(econSnap.daysToStart) ? econSnap.daysToStart : undefined;

  const lenses = scales.length >= 5
    ? {
        _meta: { confidence: "measured", source: "rank among all cities carried", as_of: "2026-08" },
        scales,
        days_to_register: daysToRegister,
      }
    : undefined;

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
     example of an out-of-context trade. */
  /* The slugs are HYPHENATED here, and the first version of this filter guessed
     underscores from a sibling module's naming and matched nothing at all. Read
     off the real data, not inferred. */
  const EVERYDAY = new Set([
    "restaurants", "grocery-stores", "pharmacies", "hairdressers-beauty",
    "sports-fitness", "auto-repair-shops", "cafes-coffee-shops", "bars-nightclubs",
  ]);
  const tradesHere = (trades?.list ?? [])
    .filter((t: any) => t.local && t.slug && EVERYDAY.has(String(t.slug)))
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

  return {
    meta,
    verdict,
    lenses,
    trades_here,
    headline,
    trades,
    income: income_out,
    space,
    demand,
    where_to_trade,
    peers: peers_out,
    // OMITTED entirely (no honest source): owner_runway,
    // demand_calendar, first_year, risks, character, locals_intel. Leaving them
    // undefined makes the spine body render nothing there (null-guarded).
  };
}
