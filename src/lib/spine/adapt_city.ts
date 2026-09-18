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
 *   - locals_intel; the WhereToTrade map (no district lat/lng held)
 *   - trades cost_to_open + saturation columns; peers spend_index
 *
 * WHAT THE CITY FACT BANK FILLS SINCE 2026-09-17 (CITY-PROGRAMME step 1a,
 * research item 21). Three cards sat in the OMITTED list above as "founder
 * cost-of-living placeholders" and "$-magnitude, no source" while
 * data/facts/city/<ISO2>-<slug>.json held the figures for 252 cities and
 * nothing read it. The builders in src/lib/spine/fact_rows.ts read it now,
 * and NONE OF THE THREE RIDES THIS SEED: the living costs (`05 living`) and
 * the rent-to-income share (`06 runway`) left with plan step 32's third
 * dispatch (2026-09-18) and the spend per resident (`08 demand`) with the
 * fourth; all three are seats the view builds by the seed's slug, exactly
 * as it builds the glance and the placement seat (`buildCityLiving(slug)`,
 * `buildCityRunway(slug)`, `buildCityDemand(slug)`), so no `owner_runway`,
 * `rent_ratio` or `spend_*` field is composed here and the kit cards that
 * read them are retired. `owner_runway.*` is read by nothing on the site:
 * London's placeholders are deleted from the bank (item 23). trades and
 * demand carry a _meta.confidence of their own (item 27): the trade figures
 * are the engine's model over trusted cells, and the resident/visitor split
 * is a slope over arrivals for every city, London's included.
 *
 * THE CITY'S INCOME IS ONE BUILDER'S (plan step 32's fourth dispatch,
 * 2026-09-18; DATA-REQUIREMENTS item 24): `cityTypicalIncome(slug)` in
 * src/lib/spine/city_income.ts feeds the masthead's answer and every row of
 * the peers' income column here, and the earnings strip and the runway card
 * in the view, so one city prints one typical pay wherever it prints one.
 * The `income` block this adapter built off `view.customer.incomeSpread`
 * (the city list's mean times 0.42, 0.88 and 2.2, London only, "sanctioned
 * invented-but-plausible") is gone with the invention (city_view.ts), and
 * the masthead no longer prints the list's `avg_gross_salary_usd_year`
 * (a mean; the label said "average" for one day and says "typical" now).
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
import { cityTypicalIncome } from "@/lib/spine/city_income";
import { COPY } from "@/lib/spine/copy";
import { inSentence } from "@/lib/spine/place_names";
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
  /* Added 2026-08-24 for the spending pool's replacement (a quartile word off
     it rode the old earnings strip). 234 of 252 carry it; read by nothing in
     this module since plan step 32's fourth dispatch (2026-09-18), and
     excluded from the city's cards by 8.3's `02` row. */
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
  // Only the two tiles with an honest source survive: the customer pay and
  // self-employment. Cost-to-open, consumer-spend, rent-pressure, and survival
  // tiles are OMITTED (no source). The masthead renders whatever tiles are
  // present, the first as its answer.
  /* THE ANSWER IS "TYPICAL CUSTOMER PAY" (MODEL.md 8.3, `00 masthead`; plan
     step 32's fourth dispatch, 2026-09-18), the one income builder's figure
     (city_income.ts: `owner_col.median_salary_usd_mo` times twelve off the
     city shard, 247 held, 5 modelled, on every listed city), the same figure
     the earnings strip, the runway card and the peers row print. The label
     says typical because the figure is a median; the first dispatch's
     "Average customer pay" named the city list's mean, which no card prints
     now (a mean is never printed under "typical"). The basis says the unit
     and neither "before tax" nor "take-home" (the shard carries no marker,
     item 24), and says "modelled" where the tag is not held, since the mark
     is off site-wide; where the builder falls back to the country's typical
     (no city today) the basis names the country. It prints through the kit's
     `usd` (C29, no private formatter). The masthead used to take the
     self-employment tile as its answer because this tile's label matched a
     lens grid row; the grid is retired and the tile leads. */
  const scorecard: Array<{ label: string; value: string; sub?: string; unit?: string; confidence: string }> = [];
  const typical = cityTypicalIncome(city.slug);
  if (typical) {
    scorecard.push({
      label: COPY.cityHero.answerLabel,
      value: usd(typical.value),
      sub:
        typical.from === "country"
          ? COPY.cityCustomers.countryBasis.replace("{country}", inSentence(typical.countryName)).replace("{city}", city.name)
          : typical.sample
            ? COPY.cityHero.answerBasisModelled
            : COPY.cityHero.answerBasis,
      confidence: typical.sample ? "modeled" : "measured",
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

  /* THE INCOME CURVE BLOCK LEFT ON PLAN STEP 32's FOURTH DISPATCH (2026-09-18).
     It carried London's bottom tenth, typical and top tenth off
     `view.customer.incomeSpread`, the city list's mean times three fixed
     multipliers, an invention sanctioned as a stopgap for one city, and left
     `income` undefined on the other 251 so the strip drew the country's
     figures under the city's kicker (M5). The earnings strip is built in the
     view by the slug now (`buildCityEarningsStrip`): the city's own typical
     from the one income builder between the country's measured deciles. */

  /* -- space (prose only; numeric rent-pressure + peer strip + terms OMITTED) */
  const space = view.space
    ? {
        read: view.space.verdict,
        peer_read: undefined, // the peer rent STRIP is omitted (no numeric source).
        terms_note: undefined,
        // rent_pressure_0_100 / deposit / lease / rent-free OMITTED.
      }
    : undefined;

  /* -- demand (the resident/visitor split) -------------------------------- */
  // The 72/28 split (view.visitorSplit.items) RECONCILES the seed's 80/20. The
  // $196B consumer-spend total is CUT by design, growth and the trend Spark are
  // OMITTED (no source), and the DemandCalendar is omitted (authored monthly index).
  // THE SPEND PER RESIDENT LEFT THIS BLOCK on plan step 32's fourth dispatch
  // (2026-09-18): `08 demand` is built in the view by the slug
  // (`buildCityDemand(slug)` in fact_rows.ts, the bank's figure or its
  // withheld line), as the living and runway seats are, so this block is the
  // season card's alone. THE SPREAD WORD WENT WITH THE STRIP THAT PRINTED IT:
  // a quartile word off the gini field ("Somewhat uneven") rode the old
  // earnings strip's extra slot; 8.3's `07` holds no extra, a one-word
  // summary of a place is banned (clause 19), and `02`'s row excludes gini.
  const vs = view.visitorSplit;
  const resItem = vs.items?.find((it) => it.kept);
  const visItem = vs.items?.find((it) => !it.kept);

  /* THE SPLIT IS A SLOPE, NOT A COUNT, FOR EVERY CITY (research item 28): a
     visitor share of arrivals over residents times fourteen, clamped, and for
     London a typed 72/28. So the split's own tag is modelled wherever it
     draws, and until item 27 it carried no tag at all: the old DemandSize's
     sample check read undefined for every city and 245 modelled splits
     shipped unmarked. */
  const hasSplit = !!(resItem && visItem);
  const splitConfidence: "modeled" | undefined = hasSplit ? "modeled" : undefined;
  const demand = hasSplit
    ? {
        resident_pct: Math.round(resItem!.perHundred),
        visitor_pct: Math.round(visItem!.perHundred),
        read: vs.body ?? vs.headline,
        split_confidence: splitConfidence,
        split_basis: COPY.cityDemand.seasonBasis,
        // consumer_spend_usd_bn (cut by design) / growth_pct_yoy / trend_* OMITTED.
        _meta: {
          confidence: splitConfidence,
          source: "the visitor share is a slope over arrivals and residents",
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
  // 100), median_income_usd <- the one income builder's figure for that city
  // (the fourth dispatch, 2026-09-18), visitors_m <- tourist_arrivals_m (real).
  // spend_index has NO source and is OMITTED (the CityPeers table drops that
  // row). The home city leads the list.
  //
  // THE FIELD NAME IS TRUE NOW. This slot is called median_income_usd, and for
  // one year what went in it was avg_gross_salary_usd_year, a MEAN, beside a
  // strip whose own median_income_usd was a median: two statistics under one
  // name, safe only because the table printed the mean as an absolute under
  // "Customer income". Every row is `cityTypicalIncome(slug)` now, the
  // salary median off each city's shard, the same figure the home city's
  // masthead prints, so the home row and the answer agree by construction
  // and one basis serves the column (PART 5; the caveat says "typical pay").
  // A city whose builder falls back to the country's figure prints a dash
  // here rather than a country's pay in a column of cities' (none today).
  const cityIncome = (slug: string): number | undefined => {
    const t = cityTypicalIncome(slug);
    return t && t.from === "city" ? t.value : undefined;
  };
  const homeRow = {
    name: city.name,
    // The slug and the country code, carried since run 22 for the peers table's row key and flag.
    slug: city.slug,
    iso2: city.iso2,
    home: true,
    rent_index: isNum(city.cost_of_living_index) ? Math.round(city.cost_of_living_index) : undefined,
    median_income_usd: cityIncome(city.slug),
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
        median_income_usd: cityIncome(p.slug),
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

  /* THE LIVING COSTS AND THE RENT SHARE ARE NOT ON THE SEED (plan step 32's
     third dispatch, 2026-09-18). For one day (2026-09-17) this block composed
     `owner_runway` and `rent_ratio` off the bank for the two kit cards; the
     two seats are built in the view by the slug now (the header says so),
     and the runway multiplication the old card was named for (a monthly
     burn times weeks to break-even) never returns: a city-level
     weeks-to-break-even has no honest anchor, a first-year ramp being a
     trade-level figure (city-view.tsx's header), and London's 38 was a
     placeholder. */

  return {
    meta,
    trades_here,
    headline,
    trades,
    space,
    demand,
    where_to_trade,
    peers: peers_out,
    // OMITTED entirely (no honest source): demand_calendar, first_year, risks,
    // character, locals_intel. Leaving them undefined makes the spine body
    // render nothing there (null-guarded).
  };
}
