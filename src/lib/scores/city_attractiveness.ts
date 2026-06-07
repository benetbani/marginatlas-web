/**
 * src/lib/scores/city_attractiveness.ts
 *
 * The CITY headline score: a SINGLE 0-100 number per city that answers one
 * question a would-be owner asks of a place, "how good a city is this to open a
 * small business in?". Higher is better. The founder chose that cities carry a
 * headline score; countries and industries do NOT, so this is the only
 * city-altitude score and a reader learns one scale.
 *
 * It is the city-altitude sibling of the cell's break-in rating
 * (src/lib/scores/break_in_rating.ts) and reuses its exact bands and band
 * thresholds, so the badge on the city masthead reads identically to the one on
 * the cell masthead (forgiving / manageable / demanding / brutal, same cutoffs).
 *
 * What the number rewards, blended with documented weights that sum to 1.0,
 * then passed through a documented contrast stretch (see EXPANSION_ANCHORS) so
 * the headline spans the scale instead of mean-reverting to the middle:
 *
 *   1. DEMAND depth (52%, the dominant term and the city's core draw). A blend
 *      of resident population, an income proxy (gross salary per year), and a
 *      footfall proxy (annual visitor arrivals). A big, rich, well-visited city
 *      is a deep market; a thin one is not. This is the only term we refuse to
 *      guess: when it is absent the whole score is null (see below).
 *   2. ROOM (20%): how much room a newcomer has, read off the local market
 *      structure inverted. The bare-city signal we hold broadly is the country
 *      self-employment / informality share: a highly self-employed, fragmented
 *      economy is a crowded, churn-heavy field with thin room; a more
 *      consolidated one leaves more room for a new structured operator.
 *   3. RENT pressure (18%, inverted): how heavy the cost of holding space is,
 *      read off the cost-of-living index (a leading metro indexes to 100). A low
 *      cost base is forgiving; a high one squeezes a new operator.
 *   4. SURVIVAL baseline (10%): how durable a typical local business is, read
 *      off the representative survival curve where we hold one (London today).
 *      Where we do not, this term sits at a neutral baseline so it never invents
 *      a survival figure yet never sinks an otherwise scorable city.
 *
 * MISSING-DATA DISCIPLINE (the founder no-wrong-numbers rule): DEMAND is the
 * only term we will not guess. If a city carries no demand signal at all (no
 * population, no income, no footfall) the function returns null and the masthead
 * shows no score rather than a confident wrong one. The three secondary terms
 * each fall back to a neutral baseline when their input is absent, so a missing
 * secondary nudges the score toward the middle rather than failing it.
 *
 * Pure module: pure functions over plain numbers. No Supabase, no fs, no React,
 * no runtime side effects, so it stays trivially testable and cannot trip the
 * layering gate. The caller (the city board / page) supplies the real-or-modeled
 * inputs and the math and banding live here. Constraint-safe: no em-dashes, no
 * source-agency names, USD-only money.
 */

import type { BreakInBand } from "./break_in_rating";

/**
 * The inputs the city score needs, all already resolved by the caller from the
 * city record and the country economics snapshot the city page holds. Every
 * field is nullable; the score degrades on missing inputs per the discipline
 * documented above (demand absent -> null; a secondary absent -> neutral).
 */
export interface CityAttractivenessInput {
  /** Metro resident population, in MILLIONS (the city record's native unit). */
  popM: number | null | undefined;
  /** Income proxy: average gross salary, USD per year (city, else country). */
  incomeProxyUsdYear: number | null | undefined;
  /** Footfall proxy: annual visitor arrivals, in MILLIONS. */
  touristArrivalsM: number | null | undefined;
  /** Cost-of-living index, leading metro at 100 (drives rent pressure). */
  costOfLivingIndex: number | null | undefined;
  /** Country self-employment / informality share, percent 0..100 (drives room). */
  selfEmploymentPct: number | null | undefined;
  /**
   * Representative one-year survival rate, percent 0..100, where the city holds
   * a curve (London today). Null elsewhere, where the survival term sits neutral.
   */
  survivalYr1Pct: number | null | undefined;
  /** True when ANY contributing input is modeled rather than a trusted-real figure. */
  restsOnModeled: boolean;
}

export type CityAttractivenessScore = {
  /** The single headline number, integer 0..100, higher = better city to open in. */
  score: number;
  /** Coarse band, the SAME scale and thresholds the cell break-in rating uses. */
  band: BreakInBand;
  /** The four sub-scores that fed the blend, each 0..100, for transparency. */
  components: {
    demand: number;
    room: number;
    rent: number;
    survival: number;
  };
  /** Echo of the caller's modeled flag, so the surface can mark it. */
  restsOnModeled: boolean;
};

/** A real, finite number we can compute on. */
function isNum(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/** Clamp x into [lo, hi]. */
function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** One anchor on a piecewise-linear curve: at input `x`, the score is `y`. */
type Anchor = { x: number; y: number };

/**
 * Interpolate through ascending-x anchors. Below the first returns the first y,
 * above the last returns the last y (clamp-at-ends); between two anchors,
 * linear. Every curve below is monotonic by construction.
 */
function interpolate(anchors: readonly Anchor[], x: number): number {
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (x <= first.x) return first.y;
  if (x >= last.x) return last.y;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (x >= a.x && x <= b.x) {
      const span = b.x - a.x;
      if (span <= 0) return a.y;
      const t = (x - a.x) / span;
      return a.y + t * (b.y - a.y);
    }
  }
  return last.y;
}

// --- normalization anchors, each chosen against the real city value ranges ---
//
// The anchors below were set by studying the actual spread across the ~250
// cities in the city record (population, salary, cost-of-living, tourism) and
// the country self-employment table. Each maps a real figure onto 0..100.

/**
 * POPULATION curve. Metro population in millions onto a depth score. The record
 * spans ~0.3M (small metros) to 37M (the largest), median ~3M, with the deepest
 * markets clustered above 10M. A sub-1M metro is a thin market (under 20), a 3M
 * metro is the middle (42), 6M is solid (60), 12M is deep (80), and 22M+ tops
 * out. The curve is set wide so a thin metro reads genuinely thin and a mega
 * metro reads genuinely deep.
 */
const POP_ANCHORS: readonly Anchor[] = [
  { x: 0.3, y: 6 },
  { x: 1, y: 20 },
  { x: 3, y: 42 },
  { x: 6, y: 60 },
  { x: 12, y: 80 },
  { x: 22, y: 95 },
  { x: 37, y: 100 },
];

/**
 * INCOME curve. Average gross salary, USD per year, onto a spending-power score.
 * The record spans ~$2.3k (low-income metros) to ~$100k, median ~$28k. An $8k
 * income market is thin spend (18), $30k is the middle (54), $45k is strong
 * (74), and $60k+ tops out toward the ceiling. Income lifts demand depth because
 * a richer resident base spends more per head; the curve is set wide so a poor
 * metro reads genuinely poor.
 */
const INCOME_ANCHORS: readonly Anchor[] = [
  { x: 4_000, y: 6 },
  { x: 8_000, y: 18 },
  { x: 15_000, y: 34 },
  { x: 30_000, y: 54 },
  { x: 45_000, y: 74 },
  { x: 60_000, y: 90 },
  { x: 80_000, y: 100 },
];

/**
 * FOOTFALL curve. Annual visitor arrivals in millions onto a footfall score. The
 * record spans 0 to ~27M, median ~2.6M, with the most-visited cities above 13M.
 * No tourism is a real "resident-only" reading (22, not zero, residents still
 * shop), 3M is a modest visitor base (52), 7M is well visited (72), and 13M+
 * tops out. Footfall is the lightest of the three demand legs (see DEMAND_MIX).
 */
const FOOTFALL_ANCHORS: readonly Anchor[] = [
  { x: 0, y: 22 },
  { x: 1, y: 36 },
  { x: 3, y: 52 },
  { x: 7, y: 72 },
  { x: 13, y: 90 },
  { x: 22, y: 100 },
];

/**
 * ROOM curve. Country self-employment / informality share, percent, onto a room
 * score where LOW self-employment = more room for a structured newcomer and HIGH
 * = a crowded, fragmented, churn-heavy field. The table runs from the low teens
 * (consolidated advanced economies) to 50%+ (highly informal economies). 10% is
 * roomy (78), 25% is the middle (52), 40% is crowded (30), 55%+ is packed.
 */
const ROOM_ANCHORS: readonly Anchor[] = [
  { x: 8, y: 92 },
  { x: 15, y: 78 },
  { x: 25, y: 56 },
  { x: 35, y: 36 },
  { x: 45, y: 20 },
  { x: 55, y: 8 },
];

/**
 * RENT curve. Cost-of-living index (leading metro at 100) onto a rent-pressure
 * score, INVERTED so a LOW cost base reads forgiving and a HIGH one reads
 * squeezed. The record spans 20 to ~135, median ~52. An index of 30 is a light
 * cost base (82), 55 is the middle (58), 75 is heavy (38), and 100+ is the
 * tightest (down toward 18).
 */
const RENT_ANCHORS: readonly Anchor[] = [
  { x: 25, y: 94 },
  { x: 35, y: 84 },
  { x: 50, y: 66 },
  { x: 65, y: 48 },
  { x: 80, y: 30 },
  { x: 100, y: 14 },
  { x: 130, y: 6 },
];

/**
 * SURVIVAL curve. Representative one-year survival rate, percent, onto a
 * durability score. A typical local SMB one-year survival sits in the 80s to low
 * 90s, so the curve is calibrated tight: 75% is shaky (30), 85% is typical (55),
 * 92% is durable (80), 96%+ tops out. Only cities that hold a real curve feed
 * this term; the rest sit at SURVIVAL_NEUTRAL.
 */
const SURVIVAL_ANCHORS: readonly Anchor[] = [
  { x: 70, y: 18 },
  { x: 78, y: 38 },
  { x: 85, y: 55 },
  { x: 90, y: 70 },
  { x: 94, y: 84 },
  { x: 98, y: 100 },
];

/**
 * The three legs of DEMAND, blended into the single demand sub-score. Population
 * is the heaviest leg (a market's raw size), income next (spending power per
 * head), footfall lightest (a real but supplementary draw). These sum to 1.0.
 */
const DEMAND_MIX = {
  population: 0.5,
  income: 0.32,
  footfall: 0.18,
};

/** Top-level blend weights. DEMAND dominates by design; the three secondaries
 * split the rest. They sum to 1.0. */
const WEIGHT_DEMAND = 0.52;
const WEIGHT_ROOM = 0.2;
const WEIGHT_RENT = 0.18;
const WEIGHT_SURVIVAL = 0.1;

/**
 * FINAL EXPANSION curve. The four components anti-correlate by nature (a deep
 * rich city carries high demand but high rent; a cheap city the reverse), so a
 * plain weighted blend mean-reverts: across the whole city record the raw blend
 * lands in a narrow ~36..76 band and never reaches the ends of the scale, which
 * would make every headline city read the same. This curve is a documented,
 * strictly monotonic contrast stretch from the raw blend onto the published 0-100
 * headline. It preserves ORDERING exactly (it only rescales), and it leaves the
 * genuine middle near 52 while pulling a strong blend up and a weak one down so
 * the badge differentiates. Anchors were set against the raw-blend distribution
 * over the full ~250-city record: raw 52 -> 52 (the true middle holds), raw 65
 * -> 76 (a strong city clears into manageable/forgiving), raw 72 -> 86 (a top
 * global metro reads forgiving), raw 44 -> 30 and raw 30 -> 14 (thin cities fall
 * into demanding/brutal). The band thresholds are then read on this expanded
 * headline, so they keep the cell rating's meaning.
 */
const EXPANSION_ANCHORS: readonly Anchor[] = [
  { x: 30, y: 14 },
  { x: 40, y: 30 },
  { x: 48, y: 44 },
  { x: 52, y: 52 },
  { x: 58, y: 64 },
  { x: 65, y: 76 },
  { x: 72, y: 86 },
  { x: 80, y: 96 },
];

/** Neutral baselines for secondary terms whose input is absent, so a missing
 * secondary nudges toward the middle rather than failing or skewing the score. */
const ROOM_NEUTRAL = 50;
const RENT_NEUTRAL = 50;
const SURVIVAL_NEUTRAL = 55;

/** Band cutoffs, IDENTICAL to the cell break-in rating so the badge reads the
 * same on both mastheads: forgiving clears 78, manageable runs the 60s and low
 * 70s, demanding sits mid-scale (40s and 50s), brutal falls below 40. */
function bandFor(score: number): BreakInBand {
  if (score >= 78) return "forgiving";
  if (score >= 60) return "manageable";
  if (score >= 40) return "demanding";
  return "brutal";
}

/**
 * Compute the city attractiveness score for one city, or null when the city
 * carries NO demand signal at all (no population, no income, no footfall). The
 * three secondary terms each fall back to a neutral baseline when absent.
 * Deterministic and side-effect free: the same inputs always yield the same
 * score.
 */
export function cityAttractivenessScore(
  input: CityAttractivenessInput,
): CityAttractivenessScore | null {
  const {
    popM,
    incomeProxyUsdYear,
    touristArrivalsM,
    costOfLivingIndex,
    selfEmploymentPct,
    survivalYr1Pct,
    restsOnModeled,
  } = input;

  // -- DEMAND (dominant). Blend the legs we hold, re-weighting over the present
  // legs so a missing footfall (say) does not drag demand down toward zero; it
  // just drops out of the mix. No-wrong-numbers gate: if NO demand leg is
  // present at all, refuse to score.
  const legs: Array<{ weight: number; score: number }> = [];
  if (isNum(popM) && popM > 0) {
    legs.push({
      weight: DEMAND_MIX.population,
      score: interpolate(POP_ANCHORS, popM),
    });
  }
  if (isNum(incomeProxyUsdYear) && incomeProxyUsdYear > 0) {
    legs.push({
      weight: DEMAND_MIX.income,
      score: interpolate(INCOME_ANCHORS, incomeProxyUsdYear),
    });
  }
  if (isNum(touristArrivalsM) && touristArrivalsM >= 0) {
    legs.push({
      weight: DEMAND_MIX.footfall,
      score: interpolate(FOOTFALL_ANCHORS, touristArrivalsM),
    });
  }
  if (legs.length === 0) return null;
  const legWeight = legs.reduce((s, l) => s + l.weight, 0);
  const demand = clamp(
    Math.round(legs.reduce((s, l) => s + l.weight * l.score, 0) / legWeight),
    0,
    100,
  );

  // -- ROOM (market structure inverted). Neutral when the self-employment share
  // is absent for the city's country.
  const room =
    isNum(selfEmploymentPct) && selfEmploymentPct >= 0
      ? clamp(Math.round(interpolate(ROOM_ANCHORS, selfEmploymentPct)), 0, 100)
      : ROOM_NEUTRAL;

  // -- RENT (cost of holding space, inverted). Neutral when no cost index.
  const rent =
    isNum(costOfLivingIndex) && costOfLivingIndex > 0
      ? clamp(Math.round(interpolate(RENT_ANCHORS, costOfLivingIndex)), 0, 100)
      : RENT_NEUTRAL;

  // -- SURVIVAL (durability baseline). Neutral where we hold no real curve.
  const survival =
    isNum(survivalYr1Pct) && survivalYr1Pct > 0
      ? clamp(Math.round(interpolate(SURVIVAL_ANCHORS, survivalYr1Pct)), 0, 100)
      : SURVIVAL_NEUTRAL;

  // Blend, demand dominant, into the raw composite.
  const raw =
    WEIGHT_DEMAND * demand +
    WEIGHT_ROOM * room +
    WEIGHT_RENT * rent +
    WEIGHT_SURVIVAL * survival;

  // Expand the raw blend onto the published headline so the badge differentiates
  // (the blend mean-reverts; see EXPANSION_ANCHORS). The stretch is monotonic, so
  // ordering is identical to the raw blend; the band is read on the headline.
  const score = clamp(Math.round(interpolate(EXPANSION_ANCHORS, raw)), 0, 100);

  return {
    score,
    band: bandFor(score),
    components: { demand, room, rent, survival },
    restsOnModeled,
  };
}
