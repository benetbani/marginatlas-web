/**
 * neighborhood_multipliers.ts
 *
 * Phase 1 of the commuter + tourism + anomaly-tag framework.
 * See docs/strategy/2026-05-25-COMMUTER-TOURISM-NEIGHBORHOOD-FRAMEWORK.md.
 *
 * Given an activity + a neighborhood, returns a final revenue
 * multiplier (relative to the city baseline) plus the breakdown:
 *   - commuter component (β_commuter * normalized intensity)
 *   - tourism component (β_tourism * log10 normalized intensity)
 *   - tag component (product of tag-specific multipliers, clipped)
 *
 * The data file is data/economics/neighborhood_intensity_v1.json,
 * which carries commuter_intensity + tourism_intensity + the tag
 * set for each (city.slug, neighborhood.slug) pair.
 *
 * Per the strategy memo, this is the engine that powers:
 *   - The "expected revenue here is X% vs city baseline" panel on
 *     the neighborhood hub
 *   - The future /decide/{activity}/{city} wizard
 *   - Eventually, the per-cell adjustment on every neighborhood page
 */
import intensityJson from "../../../data/economics/neighborhood_intensity_v1.json";
import { resolveIndustryIdExact } from "@/lib/taxonomy";

// ---------------------------------------------------------------------------
// Tag types
// ---------------------------------------------------------------------------

export type NeighborhoodTag =
  | "financial_cbd"
  | "tourist_zone"
  | "luxury_district"
  | "free_economic_zone"
  | "university_district"
  | "industrial_park"
  | "tech_corridor"
  | "embassy_quarter"
  | "medical_cluster"
  | "transit_hub"
  | "gentrifying_edge"
  | "nightlife_zone"
  | "religious_pilgrimage"
  | "residential_only";

// ---------------------------------------------------------------------------
// Data file shape
// ---------------------------------------------------------------------------

type IntensityRow = {
  commuter_intensity: number;
  tourism_intensity: number;
  tags: NeighborhoodTag[];
  primary_tag: NeighborhoodTag;
  year: number;
  source_quality: "A" | "B" | "C";
  notes?: string;
};

type CityDefault = {
  commuter_intensity: number;
  tourism_intensity: number;
};

type IntensityFile = {
  neighborhoods: Record<string, IntensityRow>;
  city_defaults: Record<string, CityDefault>;
};

const FILE = intensityJson as unknown as IntensityFile;

function key(citySlug: string, neighborhoodSlug: string): string {
  return `${citySlug}.${neighborhoodSlug}`;
}

// ---------------------------------------------------------------------------
// Commuter elasticity (β per activity).
// Values from the strategy memo §1.3. Positive = revenue grows with
// commuter intensity; negative = activity is suppressed in CBDs.
// ---------------------------------------------------------------------------

const ACTIVITY_COMMUTER_BETA: Record<string, number> = {
  cafes_coffee: 0.45,
  restaurants: 0.15,
  sit_down_restaurants: 0.15,
  fast_casual: 0.55,
  pizzerias: 0.1,
  bars_nightclubs: -0.2,
  pubs_taverns: -0.1,
  bakeries_retail: 0.2,
  pastry_dessert: 0.15,
  ice_cream_shops: 0.0,
  food_trucks: 0.5,
  catering: 0.3,
  pharmacies_drug_stores: 0.3,
  independent_pharmacy: 0.3,
  grocery_stores: -0.4,
  dry_cleaning_laundry: 0.5,
  barbershops: -0.1,
  nail_salons: -0.15,
  hair_salons_full: -0.05,
  hairdressers_beauty: -0.05,
  day_spas: -0.1,
  massage_therapy: 0.0,
  residential_cleaning: -0.6,
  cleaning_services: 0.2,
  janitorial_services: 0.5,
  landscaping_lawn: -0.3,
  auto_repair_shops: -0.3,
  auto_body_shops: -0.3,
  gas_stations: 0.1,
  electricians: 0.0,
  plumbers: 0.0,
  hvac_services: 0.0,
  doctors_clinics: -0.35,
  dental_practices: -0.4,
  optometry: -0.2,
  chiropractic: -0.2,
  physical_therapy: -0.15,
  pet_stores: -0.3,
  pet_daycare: -0.5,
  pet_walking_sitting: -0.4,
  pet_training: -0.3,
  veterinary_pet_care: -0.3,
  fitness_gyms: 0.2,
  sports_fitness: 0.1,
  martial_arts: -0.1,
  personal_training: 0.1,
  dance_studios: -0.1,
  daycare_preschool: -0.5,
  childcare_social: -0.5,
  tutoring_education: -0.1,
  music_schools: -0.2,
  language_schools: 0.0,
  driving_schools: -0.2,
  real_estate_agencies: -0.1,
  accounting_tax: 0.5,
  sole_accounting: 0.4,
  insurance_brokers: 0.3,
  legal_services: 0.4,
  sole_law_firms: 0.4,
  management_consulting: 0.6,
  marketing_design: 0.3,
  photography_studios: 0.1,
  it_services_hosting: 0.5,
  it_services_msp: 0.5,
  software_development: 0.4,
  custom_software_contract: 0.4,
  print_shops: 0.4,
  jewelry_stores: 0.1,
  clothing_stores: 0.2,
  boutique_clothing: 0.15,
  bookstores_indie: 0.15,
  hardware_stores: -0.2,
  florist_shops: 0.05,
  hotels_lodging: 0.2,
  independent_hotels: 0.2,
  bnbs: 0.1,
  travel_agencies: 0.3,
  event_production: 0.2,
  pest_control_local: -0.3,
  funeral_services: -0.2,
};

// ---------------------------------------------------------------------------
// Tourism elasticity (β per activity).
// Values from strategy memo §2.3. Effect on revenue is
// β * log10(intensity + 1) so the marginal effect flattens at high tourism.
// ---------------------------------------------------------------------------

const ACTIVITY_TOURISM_BETA: Record<string, number> = {
  restaurants: 0.5,
  sit_down_restaurants: 0.55,
  fast_casual: 0.2,
  cafes_coffee: 0.4,
  ice_cream_shops: 0.8,
  pizzerias: 0.35,
  bakeries_retail: 0.3,
  pastry_dessert: 0.4,
  bars_nightclubs: 0.45,
  pubs_taverns: 0.4,
  pharmacies_drug_stores: 0.4,
  independent_pharmacy: 0.4,
  grocery_stores: -0.1,
  clothing_stores: 0.25,
  boutique_clothing: 0.4,
  jewelry_stores: 0.3,
  custom_jewelers: 0.4,
  florist_shops: -0.1,
  bookstores_indie: 0.2,
  photography_studios: 0.15,
  hair_salons_full: -0.2,
  hairdressers_beauty: -0.2,
  barbershops: -0.15,
  nail_salons: -0.1,
  dental_practices: -0.3,
  doctors_clinics: -0.3,
  auto_repair_shops: -0.4,
  hotels_lodging: 0.9,
  independent_hotels: 1.0,
  bnbs: 1.1,
  hostels: 1.0,
  guest_houses: 0.9,
  travel_agencies: 0.5,
  event_production: 0.2,
  catering: 0.1,
  pet_stores: -0.3,
  pet_daycare: -0.5,
  pet_walking_sitting: -0.4,
  childcare_daycare: -0.6,
  daycare_preschool: -0.6,
  residential_cleaning: -0.5,
  cleaning_services: -0.2,
  landscaping_lawn: -0.4,
  accounting_tax: -0.2,
  sole_accounting: -0.2,
  legal_services: -0.2,
  fitness_gyms: -0.1,
  real_estate_agencies: -0.1,
  print_shops: 0.0,
  dry_cleaning_laundry: 0.1,
  /* Explicit zero, not an omission. software_development is one of the twelve
     activities NeighborhoodOverview shows on every neighbourhood page, and it
     was the only one of them absent from this table, so its tourism multiplier
     came out of `?? 0` instead of out of a decision.

     The value is the same either way. What changes is that a reader of this
     table can now tell "a contract software firm does not get walk-in
     visitors" from "nobody has looked at this yet", which is a distinction the
     lookup itself cannot make: an absent key and a deliberate 0.0 produce an
     identical 1.000 multiplier. print_shops above is written out for the same
     reason, so this follows the convention rather than inventing one. */
  software_development: 0.0,
};

// ---------------------------------------------------------------------------
// Tag x activity revenue multipliers.
// Values from strategy memo §3. 1.0 = neutral, > 1 boost, < 1 suppression.
// Only activities with non-neutral effects per tag are listed; defaults to
// 1.0. The neutral default keeps the table compact + readable.
// ---------------------------------------------------------------------------

const TAG_REVENUE_MULTIPLIER: Partial<Record<NeighborhoodTag, Record<string, number>>> = {
  financial_cbd: {
    cafes_coffee: 2.4,
    fast_casual: 2.8,
    sit_down_restaurants: 1.6,
    pharmacies_drug_stores: 2.2,
    independent_pharmacy: 2.2,
    grocery_stores: 0.5,
    bars_nightclubs: 0.8,
    accounting_tax: 2.5,
    sole_accounting: 2.4,
    legal_services: 2.6,
    sole_law_firms: 2.5,
    management_consulting: 2.7,
    it_services_msp: 2.3,
    print_shops: 2.4,
    dry_cleaning_laundry: 2.1,
    pet_stores: 0.4,
    pet_daycare: 0.3,
    pet_walking_sitting: 0.4,
    residential_cleaning: 0.4,
    daycare_preschool: 0.3,
    dental_practices: 0.6,
    doctors_clinics: 0.7,
    auto_repair_shops: 0.5,
  },
  tourist_zone: {
    restaurants: 1.8,
    sit_down_restaurants: 1.9,
    fast_casual: 1.4,
    ice_cream_shops: 2.5,
    cafes_coffee: 1.7,
    pizzerias: 1.6,
    pharmacies_drug_stores: 1.6,
    independent_pharmacy: 1.6,
    clothing_stores: 1.5,
    boutique_clothing: 1.7,
    jewelry_stores: 1.8,
    custom_jewelers: 1.9,
    bookstores_indie: 1.4,
    hotels_lodging: 2.0,
    independent_hotels: 2.0,
    bnbs: 2.2,
    travel_agencies: 1.8,
    pet_stores: 0.6,
    pet_daycare: 0.4,
    childcare_daycare: 0.5,
    daycare_preschool: 0.5,
    residential_cleaning: 0.5,
  },
  luxury_district: {
    jewelry_stores: 3.0,
    custom_jewelers: 3.2,
    designer_fashion: 2.8,
    boutique_clothing: 2.5,
    sit_down_restaurants: 2.0,
    pet_stores: 1.8,
    pet_daycare: 2.2,
    pet_walking_sitting: 2.0,
    veterinary_pet_care: 1.8,
    residential_cleaning: 1.6,
    day_spas: 2.4,
    massage_therapy: 2.2,
    hair_salons_full: 2.0,
    barbershops: 1.6,
    nail_salons: 1.7,
    real_estate_agencies: 2.2,
    accounting_tax: 1.5,
    legal_services: 1.6,
    photography_studios: 1.6,
    florist_shops: 2.2,
    bookstores_indie: 1.3,
    pharmacies_drug_stores: 1.5,
  },
  free_economic_zone: {
    accounting_tax: 2.0,
    legal_services: 2.2,
    management_consulting: 2.4,
    it_services_msp: 2.0,
    insurance_brokers: 1.8,
    sit_down_restaurants: 1.4,
    cafes_coffee: 1.3,
    grocery_stores: 0.6,
  },
  university_district: {
    cafes_coffee: 1.8,
    pizzerias: 2.0,
    fast_casual: 1.7,
    bars_nightclubs: 1.8,
    bookstores_indie: 2.0,
    print_shops: 1.6,
    residential_cleaning: 0.5,
    dental_practices: 0.7,
    pet_stores: 0.7,
    real_estate_agencies: 1.2,
  },
  industrial_park: {
    fast_casual: 2.0,
    food_trucks: 2.4,
    catering: 1.8,
    cafes_coffee: 1.5,
    auto_repair_shops: 1.6,
    hair_salons_full: 0.3,
    nail_salons: 0.3,
    pet_stores: 0.2,
    residential_cleaning: 0.2,
    childcare_daycare: 0.5,
    daycare_preschool: 0.5,
    jewelry_stores: 0.2,
  },
  tech_corridor: {
    cafes_coffee: 1.9,
    fast_casual: 1.7,
    sit_down_restaurants: 1.5,
    fitness_gyms: 1.6,
    pet_stores: 1.7,
    pet_daycare: 1.8,
    bars_nightclubs: 1.4,
    bnbs: 1.6,
    accounting_tax: 1.6,
    legal_services: 1.5,
    real_estate_agencies: 1.5,
  },
  embassy_quarter: {
    sit_down_restaurants: 1.7,
    cafes_coffee: 1.5,
    travel_agencies: 1.8,
    real_estate_agencies: 1.8,
    pet_stores: 1.4,
    boutique_clothing: 1.5,
    photography_studios: 1.4,
    grocery_stores: 1.6,
  },
  medical_cluster: {
    pharmacies_drug_stores: 1.8,
    independent_pharmacy: 2.0,
    cafes_coffee: 1.6,
    fast_casual: 1.5,
    sit_down_restaurants: 1.3,
    print_shops: 1.5,
    optometry: 1.6,
    physical_therapy: 1.7,
    pet_stores: 0.8,
    bars_nightclubs: 0.7,
  },
  transit_hub: {
    cafes_coffee: 2.0,
    fast_casual: 1.8,
    bakeries_retail: 1.6,
    pizzerias: 1.5,
    bookstores_indie: 1.5,
    print_shops: 1.4,
    pharmacies_drug_stores: 1.6,
    sit_down_restaurants: 0.7,
    hair_salons_full: 0.7,
    pet_stores: 0.5,
    residential_cleaning: 0.4,
  },
  gentrifying_edge: {
    cafes_coffee: 1.4,
    bars_nightclubs: 1.5,
    fitness_gyms: 1.4,
    pet_stores: 1.5,
    pet_daycare: 1.6,
    boutique_clothing: 1.4,
    bookstores_indie: 1.3,
    real_estate_agencies: 1.7,
    sit_down_restaurants: 1.2,
  },
  nightlife_zone: {
    bars_nightclubs: 2.5,
    pubs_taverns: 2.2,
    fast_casual: 1.8,
    pizzerias: 1.7,
    sit_down_restaurants: 1.5,
    cafes_coffee: 1.2,
    pharmacies_drug_stores: 1.3,
    residential_cleaning: 0.5,
    childcare_daycare: 0.5,
    daycare_preschool: 0.5,
  },
  religious_pilgrimage: {
    sit_down_restaurants: 1.7,
    bakeries_retail: 1.4,
    bookstores_indie: 1.5,
    bars_nightclubs: 0.3,
  },
  residential_only: {
    // Tag with neutral effect across the board; provides a typed
    // entry so call sites can include it in tag arrays without
    // checking for undefined.
  },
};

// ---------------------------------------------------------------------------
// The activity boundary (bug:district-revenue-dead, 2026-09-17).
//
// Every table above is keyed by UNDERSCORE id (dental_practices). The site's
// URL slugs are HYPHENATED and built from names (dental-practices,
// cafes-coffee-shops), and adapt_city passed those straight in. Every lookup
// missed, every `?? 0` and `?? 1.0` below answered "neutral", and every
// London district's revenue printed as exactly +0% while the rent side, keyed
// by tag rather than by activity, kept varying. Proved before the fix in
// scratchpad/slug-before.txt: the hyphen form returned 1.000 in all seven
// districts, the underscore form 0.400 to 0.841 for the same trade.
//
// The fix sits HERE, at the boundary, so no caller has to know which spelling
// a table wants: every entry point that takes an activity resolves it through
// resolveEngineActivity first. Order: the engine's own vocabulary as written
// (pharmacies_drug_stores is a key here and not a taxonomy id); then the
// taxonomy's EXACT resolver (canonical slug, alias, hyphenated id; never its
// fuzzy tier, which would hand one trade another trade's betas); then a bare
// hyphen swap for an engine-only id spelled with hyphens.
//
// A MISS IS NOT A 1.0. It used to be: an unknown activity fell through to the
// same neutral multiplier as a trade whose betas happen to be zero, and no
// caller could tell the two apart. Now a miss (a) warns once per string, so
// a build log names every activity the engine has no model for, and (b) is
// carried on the result as activityKnown=false with activityId=null, which a
// caller must withhold on rather than print. The arithmetic still runs to a
// neutral 1.0 so no caller receives NaN, but the number is tagged as absence,
// not measurement. Not a throw: the neighbourhood page runs twelve activities
// on every one of its pages, and this repo's honesty rail is "omit, never
// crash" (CLAUDE.md), so a throw would take the page down for one trade's
// missing coefficient. A throw is also the one behaviour a static build cannot
// withhold on.
// ---------------------------------------------------------------------------

/** Every activity id at least one table above holds a coefficient for. Built
 *  from the tables themselves so it cannot drift from them. Exported for the
 *  boundary gate, which needs a membership test that does not warn. */
export const KNOWN_ACTIVITY_IDS: ReadonlySet<string> = (() => {
  const s = new Set<string>(Object.keys(ACTIVITY_COMMUTER_BETA));
  for (const k of Object.keys(ACTIVITY_TOURISM_BETA)) s.add(k);
  for (const table of Object.values(TAG_REVENUE_MULTIPLIER)) {
    for (const k of Object.keys(table ?? {})) s.add(k);
  }
  return s;
})();

export type ActivityResolution =
  | { known: true; id: string; input: string }
  | { known: false; id: null; input: string };

/** Strings already warned about, so a build log carries each unknown once. */
const WARNED_UNKNOWN = new Set<string>();

/**
 * Resolve any spelling of an activity to the id the tables are keyed by, or
 * to a tagged miss. Idempotent: an id the engine knows passes straight
 * through, so the component functions can call it on an already-resolved id
 * at the cost of one Set lookup.
 */
export function resolveEngineActivity(input: string): ActivityResolution {
  const raw = String(input ?? "").trim();
  if (KNOWN_ACTIVITY_IDS.has(raw)) return { known: true, id: raw, input: raw };
  const viaTaxonomy = resolveIndustryIdExact(raw);
  if (viaTaxonomy && KNOWN_ACTIVITY_IDS.has(viaTaxonomy)) {
    return { known: true, id: viaTaxonomy, input: raw };
  }
  const swapped = raw.toLowerCase().replace(/-/g, "_");
  if (KNOWN_ACTIVITY_IDS.has(swapped)) return { known: true, id: swapped, input: raw };
  if (!WARNED_UNKNOWN.has(raw)) {
    WARNED_UNKNOWN.add(raw);
    console.warn(
      `[neighborhood_multipliers] no activity model for "${raw}": its district multipliers are a neutral 1.0 by absence, not by measurement. Withhold on activityKnown=false.`,
    );
  }
  return { known: false, id: null, input: raw };
}

// ---------------------------------------------------------------------------
// Pure math helpers
// ---------------------------------------------------------------------------

function clip(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * THE CLIP BOUNDS, named and exported so a check can read them instead of
 * retyping them. A figure that sits ON one of these is the bound, not a
 * reading, and two districts on the same bound print the same figure while
 * nothing about them is alike.
 *   REVENUE_CLIP_*: the final revenue multiplier for a CURATED district.
 *   DEFAULT_CLIP_*: the final multiplier on the city-default fallback path.
 *   RENT_CLIP_*:    the composed rent multiplier over a district's tags.
 *   MARGIN_CLIP_*:  the district net margin (decimal) out of getNeighborhoodNetMargin.
 * The component multipliers (commuter, tourism) clip at 0.5 to 2.0 and the
 * tag product at 0.3 to 2.5; those stay inline where they are applied.
 */
export const REVENUE_CLIP_LO = 0.4;
export const REVENUE_CLIP_HI = 3.0;
export const DEFAULT_CLIP_LO = 0.5;
export const DEFAULT_CLIP_HI = 2.0;
export const RENT_CLIP_LO = 0.5;
export const RENT_CLIP_HI = 3.0;
export const MARGIN_CLIP_LO = -0.2;
export const MARGIN_CLIP_HI = 0.5;

/**
 * Commuter multiplier on an activity given a daytime/resident intensity.
 * Formula: 1 + β * (clip(intensity, 0.3, 5.0) - 1.0) / 1.5
 * Normalized so intensity = 1.0 yields 1.0× (neutral) and intensity = 4.0
 * yields a strong effect (β * 2.0). Clipped tight: 0.5 to 2.0.
 */
export function commuterMultiplier(
  activityId: string,
  intensity: number,
): number {
  /* Resolved at the boundary (see above). A bare-number entry point cannot
     carry the activityKnown tag; an unknown activity warns once and reads
     neutral here, so prefer getNeighborhoodMultiplier, which tags it. */
  const id = resolveEngineActivity(activityId).id;
  const beta = id ? (ACTIVITY_COMMUTER_BETA[id] ?? 0) : 0;
  const normalized = (clip(intensity, 0.3, 5.0) - 1.0) / 1.5;
  return clip(1 + beta * normalized, 0.5, 2.0);
}

/**
 * Tourism multiplier on an activity given annual visitors per resident.
 * Formula: 1 + β * log10(clip(intensity, 0.1, 100) + 1)
 * Log because marginal effect flattens at high tourism. Clipped tight: 0.5 to 2.0.
 */
export function tourismMultiplier(
  activityId: string,
  intensity: number,
): number {
  const id = resolveEngineActivity(activityId).id;
  const beta = id ? (ACTIVITY_TOURISM_BETA[id] ?? 0) : 0;
  const eff = Math.log10(clip(intensity, 0.1, 100) + 1);
  return clip(1 + beta * eff, 0.5, 2.0);
}

/**
 * Composed tag multiplier with damping.
 *
 * Product of per-tag effects, BUT with logarithmic damping when 3+ active
 * tags compound. The damping reflects conceptual overlap: a Manhattan-Midtown
 * tagged financial_cbd + tourist_zone + transit_hub + luxury_district has
 * tag effects that are not statistically independent (the financial workers
 * AND tourists eat at the same restaurants). Damping prevents 4 strong
 * positive tags from multiplying naively to 8x+ when the joint effect is
 * realistically ~2-3x.
 *
 * Formula:
 *   raw_log = sum(log(tag_mult))
 *   damped_log = raw_log / sqrt(max(1, n_active))
 *   M = exp(damped_log)
 *
 * Clipped to 0.3 - 2.5.
 */
export function tagMultiplier(
  activityId: string,
  tags: NeighborhoodTag[],
): number {
  const id = resolveEngineActivity(activityId).id;
  if (!id) return 1.0;
  let logSum = 0;
  let nActive = 0;
  for (const t of tags) {
    const tm = TAG_REVENUE_MULTIPLIER[t]?.[id] ?? 1.0;
    if (tm !== 1.0) {
      logSum += Math.log(tm);
      nActive += 1;
    }
  }
  if (nActive === 0) return 1.0;
  const dampedLog = logSum / Math.sqrt(Math.max(1, nActive));
  return clip(Math.exp(dampedLog), 0.3, 2.5);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type NeighborhoodMultiplierBreakdown = {
  /** Final revenue multiplier vs city baseline. */
  final: number;
  commuter: number;
  tourism: number;
  tags: number;
  /** Tags applied. */
  appliedTags: NeighborhoodTag[];
  /** Raw inputs for the explanation panel. */
  commuterIntensity: number;
  tourismIntensity: number;
  /** Source quality for transparency. */
  sourceQuality: "A" | "B" | "C" | "default";
  /** Indicator: is this row hand-curated, or did we fall back to defaults? */
  isCurated: boolean;
  /** The id the tables were read under, or null when no table knows the activity. */
  activityId: string | null;
  /**
   * False when the engine holds NO coefficient for this activity, in any
   * spelling. Every figure on this result is then a neutral 1.0 by absence,
   * not by measurement, and a caller must withhold rather than print it as
   * "+0% vs the city". See the boundary note above resolveEngineActivity.
   */
  activityKnown: boolean;
  /**
   * Did the final clip bite? A figure sitting on a bound is not a measurement,
   * it is the bound, and a reader cannot tell the difference from the number.
   *
   * Measured on production 2026-08-08: FIVE of seven sampled districts printed
   * an identical "+200%", which is exactly the 3.0 ceiling. City of London,
   * West End and South Bank, as FOUND.md recorded, and also Manhattan FiDi and
   * Manhattan Midtown, which it did not. All five are ABOVE 3.0 and the clip is
   * hiding by how much, so three of them reading the same is an artifact of the
   * bound rather than a tie in the data.
   *
   * The ceiling itself is load bearing across every city and activity and is
   * NOT changed here. The display is the defect; this flag lets the display
   * say so.
   */
  clipped: boolean;
};

/**
 * Compute the full multiplier breakdown for one (city, neighborhood, activity).
 * Falls back to city defaults when the neighborhood is not curated yet.
 *
 * IS A PER-DISTRICT KEEP OR NET-MARGIN FIGURE HONEST ENOUGH TO PRINT FOR
 * LONDON? Measured 2026-09-17, after the boundary fix above and with each
 * trade's own sourced rent share, in scratchpad/rows-21.txt: the winner trade
 * (dental practices, the real leaderboard's margin leader at 18%), a cafe and
 * a barbershop, across the seven curated districts, 21 rows.
 *
 *   revenue multiplier ON a bound:  6 of 21 (2 on the 0.4 floor, 4 on the 3.0 ceiling)
 *   rent multiplier ON a bound:     3 of 21 (West End, 3.0, for every trade)
 *   net margin ON a bound:          3 of 21 (all on the -20% floor)
 *   any bound at all:               8 of 21
 *
 * By count the rows are mostly off the clips, so the figures CAN carry a
 * modelled mark. But the test is not the count, it is whether two districts
 * that share a bound print the same figure while nothing about them is
 * alike, and they do, in exactly the rows a reader looks at first:
 *
 *   dental, City of London and West End: both 0.400 (the floor), both print
 *     "-60% takings" and "-20.0% margin", with different tag sets and rents
 *     of 2.96 and 3.00. The floor is hiding how far apart they are.
 *   cafe, City of London, West End, South Bank, East London: all 3.000 (the
 *     ceiling), all print "+200%". Four of seven rows tie, and the two cafe
 *     "leaders" by margin (East London 14.3%, South Bank 12.3%) are computed
 *     FROM that ceiling, so the cafe ranking is an artifact of the bound.
 *
 * SO: NO for a card that prints a figure in every row for the winner trade
 * (two of its seven rows are the same floor) and NO for the cafe (four of
 * seven are the same ceiling), until the 0.4 to 3.0 range is justified or
 * widened by the data track. The range is asserted in the comment below
 * ("Manhattan-vs-Bronx for pharmacies should be ~2.5x"), not derived from
 * any measured district. YES, marked modelled, for rows off every clip:
 * dental would lead with South London 14.6%, North London 11.3%, East London
 * 6.9%; barbershops with South London 10.1%, North London 7.3% (all seven
 * barbershop revenue rows read). Not a card change here: that decision is
 * the next dispatch's, on these numbers. See DATA-REQUIREMENTS.md for the
 * clip-range requirement.
 *
 * One more thing the live revenue half changed: with revenue dead at 1.0 the
 * rent share alone decided the sign of the rows (at 0.08 none negative, at
 * 0.12 two, at 0.20 four). With revenue running, dental is a trade the model
 * SUPPRESSES in loud districts (commuter beta -0.4, tourism -0.3, financial
 * CBD tag 0.6), so at the sourced 0.08 four of seven are negative and two sit
 * on the margin floor. The sign is now the revenue side's, not the share's.
 */
export function getNeighborhoodMultiplier(
  citySlug: string,
  neighborhoodSlug: string,
  activityId: string,
): NeighborhoodMultiplierBreakdown {
  /* Resolved ONCE here; the component functions accept the resolved id and
     pass it through on a single Set lookup. An unknown activity is carried
     as activityKnown=false and the maths runs neutral (see the boundary note). */
  const act = resolveEngineActivity(activityId);
  const id = act.id ?? act.input;
  const row = FILE.neighborhoods[key(citySlug, neighborhoodSlug)];
  if (row) {
    const cm = commuterMultiplier(id, row.commuter_intensity);
    const tm = tourismMultiplier(id, row.tourism_intensity);
    const gm = tagMultiplier(id, row.tags);
    // Final clip: REVENUE_CLIP_LO to REVENUE_CLIP_HI (0.4 to 3.0). Bigger range
    // than individual components (which clip at 0.5-2.0) so a clear premium
    // neighborhood can land at ~2.5x and a depressed one at ~0.6x.
    // Manhattan-vs-Bronx for pharmacies should be ~2.5x in this model,
    // matching reality.
    const raw = cm * tm * gm;
    const final = clip(raw, REVENUE_CLIP_LO, REVENUE_CLIP_HI);
    return {
      final,
      commuter: cm,
      tourism: tm,
      tags: gm,
      appliedTags: row.tags,
      commuterIntensity: row.commuter_intensity,
      tourismIntensity: row.tourism_intensity,
      sourceQuality: row.source_quality,
      isCurated: true,
      activityId: act.id,
      activityKnown: act.known,
      clipped: raw !== final,
    };
  }

  // Fallback path: use city defaults, no tags.
  const cityDef =
    FILE.city_defaults[citySlug] || FILE.city_defaults["default"];
  const cm = commuterMultiplier(id, cityDef.commuter_intensity);
  const tm = tourismMultiplier(id, cityDef.tourism_intensity);
  /* The fallback path clips tighter, 0.5 to 2.0, and can sit on its bound too. */
  const rawDefault = cm * tm;
  const final = clip(rawDefault, DEFAULT_CLIP_LO, DEFAULT_CLIP_HI);
  return {
    final,
    commuter: cm,
    tourism: tm,
    tags: 1.0,
    appliedTags: [],
    commuterIntensity: cityDef.commuter_intensity,
    tourismIntensity: cityDef.tourism_intensity,
    sourceQuality: "default",
    isCurated: false,
    activityId: act.id,
    activityKnown: act.known,
    clipped: rawDefault !== final,
  };
}

/** Convenience: just the final multiplier. */
export function neighborhoodRevenueMultiplier(
  citySlug: string,
  neighborhoodSlug: string,
  activityId: string,
): number {
  return getNeighborhoodMultiplier(citySlug, neighborhoodSlug, activityId).final;
}

/** Check whether a neighborhood is in the curated set. */
export function hasNeighborhoodIntensity(
  citySlug: string,
  neighborhoodSlug: string,
): boolean {
  return !!FILE.neighborhoods[key(citySlug, neighborhoodSlug)];
}

/** Get the raw row for a neighborhood (or null). */
export function getNeighborhoodRow(
  citySlug: string,
  neighborhoodSlug: string,
): IntensityRow | null {
  return FILE.neighborhoods[key(citySlug, neighborhoodSlug)] ?? null;
}

// ---------------------------------------------------------------------------
// RENT multiplier per neighborhood tag.
//
// Independent of revenue: rent is largely set by the land market, not the
// activity. Same tag set, single number per tag (no activity dimension).
// Used by getNeighborhoodNetMargin to convert revenue uplift into actual
// profit uplift. Honors the rent-dominates-tourism-revenue finding in the
// commuter+tourism+anomaly framework strategy doc.
// ---------------------------------------------------------------------------

const TAG_RENT_MULTIPLIER: Record<NeighborhoodTag, number> = {
  luxury_district: 2.6,
  financial_cbd: 2.3,
  tourist_zone: 1.9,
  free_economic_zone: 1.6,
  tech_corridor: 1.6,
  transit_hub: 1.5,
  embassy_quarter: 1.4,
  medical_cluster: 1.3,
  nightlife_zone: 1.3,
  gentrifying_edge: 1.2,
  university_district: 1.1,
  religious_pilgrimage: 1.1,
  industrial_park: 0.6,
  residential_only: 1.0,
};

/**
 * Composed rent multiplier across a tag set. Same sqrt(n) damping as
 * revenue tags to reflect tag overlap. Clipped 0.5 - 3.0.
 */
export function rentMultiplier(tags: NeighborhoodTag[]): number {
  let logSum = 0;
  let nActive = 0;
  for (const t of tags) {
    const tm = TAG_RENT_MULTIPLIER[t] ?? 1.0;
    if (tm !== 1.0) {
      logSum += Math.log(tm);
      nActive += 1;
    }
  }
  if (nActive === 0) return 1.0;
  const dampedLog = logSum / Math.sqrt(Math.max(1, nActive));
  return clip(Math.exp(dampedLog), RENT_CLIP_LO, RENT_CLIP_HI);
}

// ---------------------------------------------------------------------------
// Net margin composition: revenue uplift minus rent drag.
// ---------------------------------------------------------------------------

export type NetMarginBreakdown = {
  /** True when revenueMultiplier is the clip ceiling, not a reading. */
  revenueClipped?: boolean;
  /** True when rentMultiplier sits on RENT_CLIP_LO or RENT_CLIP_HI. */
  rentClipped: boolean;
  /** True when neighborhoodNetMargin sits on MARGIN_CLIP_LO or MARGIN_CLIP_HI. */
  marginClipped: boolean;
  /** False when the engine holds no coefficient for the activity: the revenue
   *  half of this result is then absence, not measurement. Withhold on it. */
  activityKnown: boolean;
  /** Revenue multiplier vs city baseline (from getNeighborhoodMultiplier). */
  revenueMultiplier: number;
  /** Rent multiplier vs city baseline. */
  rentMultiplier: number;
  /** Baseline net margin (decimal, e.g. 0.10 = 10%) for the activity. */
  baselineNetMargin: number;
  /** Baseline rent occupancy share (decimal). */
  baselineRentShare: number;
  /** Effective net margin AT THIS NEIGHBORHOOD (decimal). */
  neighborhoodNetMargin: number;
  /** Profit multiplier vs city baseline (revenue uplift x margin compression). */
  profitMultiplier: number;
  /** Applied tags for explainability. */
  appliedTags: NeighborhoodTag[];
};

/**
 * Compute the neighborhood-adjusted net margin for an activity.
 *
 * Math:
 *   neighborhoodRev = baselineRev * revenueMult
 *   neighborhoodRent = baselineRent * rentMult
 *   neighborhoodMargin = baseline - (rentShare * (rentMult - 1) / revenueMult)
 *                        ^ rent uplift divided by revenue uplift; if revenue
 *                          climbs proportionally with rent, margin stays;
 *                          if rent outpaces revenue, margin compresses.
 *   profitMult = (revenueMult * neighborhoodMargin) / baseline
 *
 * This is the actual "should I open here" answer — accounts for both
 * revenue uplift AND rent drag, not just revenue. Net margins in the
 * 8-20% range are typical SMB territory.
 */
export function getNeighborhoodNetMargin(
  citySlug: string,
  neighborhoodSlug: string,
  activityId: string,
  baselineNetMargin: number,
  baselineRentShare: number,
): NetMarginBreakdown {
  const mult = getNeighborhoodMultiplier(citySlug, neighborhoodSlug, activityId);
  const rentMult = rentMultiplier(mult.appliedTags);

  // Effective rent share at the neighborhood: baseline rent share scaled by
  // (rentMult / revenueMult). If rent and revenue both 2x, share unchanged.
  // If rent 3x and revenue 1.5x, share doubles (margin gets crushed).
  const effectiveRentShare =
    (baselineRentShare * rentMult) / Math.max(0.5, mult.final);

  const rawMargin = baselineNetMargin - (effectiveRentShare - baselineRentShare);
  const neighborhoodNetMargin = clip(rawMargin, MARGIN_CLIP_LO, MARGIN_CLIP_HI);

  const baselineProfit = baselineNetMargin; // per unit revenue
  const neighborhoodProfit = mult.final * neighborhoodNetMargin;
  const profitMult = baselineProfit > 0 ? neighborhoodProfit / baselineProfit : 1;

  return {
    revenueMultiplier: mult.final,
    /* Carried, not dropped. mult.clipped says the revenue multiplier is the
       model's 3.0 ceiling rather than a reading, and this function used to
       discard it, so every caller printed a bound as a measurement with no way
       to know. 43 of the 1,266 districts sit there, and they are the ones
       people look at: Manhattan FiDi, Midtown, SoHo/Tribeca, the City of
       London, the West End. */
    revenueClipped: mult.clipped,
    rentClipped: rentMult === RENT_CLIP_LO || rentMult === RENT_CLIP_HI,
    marginClipped: rawMargin !== neighborhoodNetMargin,
    activityKnown: mult.activityKnown,
    rentMultiplier: rentMult,
    baselineNetMargin,
    baselineRentShare,
    neighborhoodNetMargin,
    profitMultiplier: profitMult,
    appliedTags: mult.appliedTags,
  };
}

/** Human-readable label for a tag, suitable for chips. */
export function tagLabel(tag: NeighborhoodTag): string {
  const labels: Record<NeighborhoodTag, string> = {
    financial_cbd: "Financial CBD",
    tourist_zone: "Tourist zone",
    luxury_district: "Luxury district",
    free_economic_zone: "Free zone",
    university_district: "University district",
    industrial_park: "Industrial park",
    tech_corridor: "Tech corridor",
    embassy_quarter: "Embassy quarter",
    medical_cluster: "Medical cluster",
    transit_hub: "Transit hub",
    gentrifying_edge: "Gentrifying",
    nightlife_zone: "Nightlife",
    religious_pilgrimage: "Pilgrimage",
    residential_only: "Residential",
  };
  return labels[tag];
}
