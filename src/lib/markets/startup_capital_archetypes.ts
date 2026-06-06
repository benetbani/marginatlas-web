/**
 * src/lib/markets/startup_capital_archetypes.ts
 *
 * A MODELED "what it costs to open" for the small-business activities the site
 * shows: the typical ONE-TIME capital, in USD, to get the doors open for each
 * trade in a BASELINE economy (cost-of-living index 100, the NYC anchor the
 * city list uses). It exists so the entry figure reads as one consistent signal
 * everywhere, exactly the way competition density does: where a place holds a
 * trustworthy real startup or formation cost the board prefers that; where it
 * does not, the board falls back to the per-industry archetype here, adjusted
 * for how expensive the place is, clearly labelled modeled. The two never use a
 * different unit, so a reader learns the number once and reads it on every page.
 *
 * These figures are directional, drawn from general industry knowledge of the
 * up-front bill to open each kind of business: the fit-out, kit, deposits, and
 * working capital before the first customer. A full-service restaurant or a
 * dental surgery is a heavy build; a consultant or a cleaner can start from a
 * laptop and a van. They are NOT a quote for any one place, and the board says
 * so on the row. A sensible default covers the long tail of activities without
 * a specific entry.
 *
 * The figure is then PLACE-ADJUSTED (see placeAdjustedStartupCapital): the
 * baseline archetype is multiplied by how costly the place is relative to the
 * baseline, so opening a restaurant in New York costs more than in a cheaper
 * metro. The multiplier is CAPPED to a sane band (0.4x to 2.5x) so neither the
 * cheapest nor the priciest place can ever print an absurd entry figure, and
 * the whole result is bounded to a final floor/ceiling as a second belt.
 *
 * Keyed by the activity's URL slug (the canonical industryToSlug output, e.g.
 * "restaurants", "cafes-coffee-shops", "barbershops"), the SAME key space the
 * density archetype uses, so the two modeled lookups agree on their keys (every
 * key here is verified to exist in the taxonomy alongside the density keys). A
 * by-industry-id helper resolves the id to its slug first, so the cell board
 * (which holds cell.industry_id) and the leaderboards (which hold the slug) can
 * both reach it.
 *
 * Pure module: a static table plus pure lookups. No Supabase, no fs, no runtime
 * side effects, so it stays trivially testable and cannot trip the layering
 * gate. Constraint-safe: no em-dashes, no source-agency names, USD-only.
 */
import { industryToSlug } from "@/lib/taxonomy";

/**
 * The modeled typical startup capital, USD, to open the activity in a BASELINE
 * economy (cost-of-living index 100), keyed by activity URL slug. Directional
 * archetypes for a developed urban market, not a per-place quote. Grouped by the
 * shape of the up-front bill; the comment on each block is the reasoning, not a
 * source. Place adjustment is applied later, so these are the index-100 anchors.
 */
const STARTUP_CAPITAL_ARCHETYPE_USD: Record<string, number> = {
  // Food and drink venues: a full build is the heaviest small-business open,
  // kitchen, fit-out, licences, deposits, before a single cover is served.
  restaurants: 300_000,
  "sit-down-restaurants": 350_000,
  "fast-casual-restaurants": 250_000,
  pizzerias: 200_000,
  "chicken-shops": 160_000,
  "cafes-coffee-shops": 180_000,
  "tea-houses-matcha-bars": 150_000,
  "bars-nightclubs": 350_000,
  "pubs-taverns": 300_000,
  "wine-bars": 220_000,
  "bakeries-retail": 150_000,
  "artisan-bakery-wholesale": 220_000,
  "cake-shops-patisseries": 130_000,
  "pastry-dessert-shops": 130_000,
  "ice-cream-frozen-dessert-shops": 120_000,
  "food-trucks": 90_000,
  "coffee-roasters": 160_000,
  "breweries-taprooms-retail": 450_000,

  // Grooming and personal care: a small studio fit-out plus chairs and kit,
  // light at the barber end, heavier for a full salon or a clinical spa.
  barbershops: 60_000,
  "hairdressers-beauty": 120_000,
  "hair-salons-full-service": 120_000,
  "nail-salons": 80_000,
  "brow-lash-studios": 50_000,
  "day-spas": 180_000,
  "med-spas-small": 300_000,
  "massage-therapy-clinics": 70_000,
  "tanning-salons": 90_000,
  "tattoo-piercing-studios": 60_000,

  // Retail: a leased shop, fit-out, and the opening stock. The inventory bill
  // is what separates a boutique from a full grocery or a jeweller.
  "grocery-stores": 250_000,
  "specialty-grocers-delis": 150_000,
  "wine-liquor-stores": 180_000,
  "cosmetics-beauty-shops": 120_000,
  "pharmacies-health-stores": 280_000,
  "independent-pharmacies": 320_000,
  "florist-shops": 70_000,
  "pet-stores": 120_000,
  "hardware-stores-local": 200_000,
  "clothing-boutiques": 120_000,
  "clothing-shoe-stores": 130_000,
  "jewelry-stores": 250_000,
  "furniture-stores": 200_000,
  "book-retailing": 120_000,
  "eyewear-optical-retail": 180_000,
  "gas-stations": 500_000,

  // Trades and home services: a van, tools, and a stock of materials. Low to
  // open relative to a storefront; the asset is the operator, not the premises.
  electricians: 30_000,
  plumbers: 30_000,
  "hvac-services": 60_000,
  roofers: 50_000,
  "painters-residential": 20_000,
  "landscaping-lawn-care": 50_000,
  "cleaning-services": 15_000,
  "residential-cleaning-services": 15_000,
  "cleaning-carpet-upholstery": 40_000,
  "cleaning-building-industrial": 50_000,
  "pest-control-local": 40_000,
  locksmiths: 25_000,
  "junk-removal-small-moving": 60_000,
  "auto-repair-shops": 180_000,
  "auto-body-shops": 250_000,
  "automotive-electrical-services": 120_000,
  "electronics-phone-repair": 40_000,

  // Construction and the building trades: a crew, plant, a yard, insurance, and
  // the working capital to float a job before the client pays. Far heavier than
  // a one-van home-service call: a residential builder runs equipment and
  // subcontractors, a commercial builder carries bonding and a bigger float, and
  // the specialty trades sit lower because the kit is narrower.
  "residential-construction": 120_000,
  "commercial-construction": 160_000,
  "civil-engineering": 180_000,
  "specialty-construction-services": 85_000,
  "specialty-trades-mixed": 85_000,
  "bricklaying-services": 60_000,
  "blocklaying-services": 60_000,
  "cement-rendering-services": 60_000,
  "carpet-laying-services": 45_000,
  "carpentry-services": 50_000,
  "carpenters-finish-work": 50_000,
  "roofing-services": 70_000,
  "tiling-services": 45_000,
  "plastering-services": 50_000,
  "painting-services": 25_000,
  "plumbing-services": 35_000,
  "flooring-installers": 50_000,
  "cabinet-making": 90_000,

  // Manufacturing: a small plant, not a one-room workshop. Even a light line
  // means a leased unit, machines, power, and a stock of raw material before the
  // first order ships, so none of these belong on the laptop-trade default. The
  // tiers track how heavy the kit is: light assembly, printing, and apparel sit
  // near the floor; food, wood, furniture, and plastics in the middle; metal,
  // machinery, and chemical lines are the heaviest small-plant opens.
  // Light assembly / printing / apparel / leather (~200k).
  "textiles-fabric-manufacturing": 200_000,
  "apparel-manufacturing": 200_000,
  "custom-apparel-uniforms": 200_000,
  "small-leather-goods": 200_000,
  "paper-printing-manufacturing": 200_000,
  "print-shops-offset-digital": 200_000,
  "sign-shops-graphics-fab": 200_000,
  "custom-jewelers-mfg": 200_000,
  "soap-candle-makers": 200_000,
  "electronics-semiconductors": 200_000,
  "electrical-equipment": 200_000,
  "miscellaneous-manufacturing": 200_000,
  // Food / wood / furniture / plastics (~300k).
  "food-manufacturing": 300_000,
  "beverage-manufacturing": 300_000,
  "craft-breweries-taprooms": 300_000,
  "specialty-food-production": 300_000,
  "wood-products-manufacturing": 300_000,
  "custom-furniture-makers": 300_000,
  "furniture-manufacturing": 300_000,
  "plastics-rubber-products": 300_000,
  // Metal / machinery / chemical (~400k).
  "fabricated-metal-manufacturing": 400_000,
  "primary-metal-manufacturing": 400_000,
  "metal-fabrication-machine-shops": 400_000,
  "machinery-manufacturing": 400_000,
  "chemical-pharma-manufacturing": 400_000,
  "petroleum-coal-products": 450_000,
  "motor-vehicles-parts": 400_000,
  "aerospace-other-transport-mfg": 450_000,

  // Other capital-heavy opens that were defaulting low: a facility, a yard, a
  // fleet, or a floor of inventory is the cost, not an operator with a laptop.
  // An auto dealer floors a lot of cars; a rental house buys the fleet it rents;
  // a warehouse and a campground are land-and-structure plays; a funeral home
  // carries premises, vehicles, and plant.
  "auto-dealers": 400_000,
  "equipment-rental-leasing": 250_000,
  "warehousing-storage": 250_000,
  "building-garden-supply-stores": 200_000,
  "garden-centers-nurseries": 150_000,
  "campgrounds-rv-parks": 250_000,
  "funeral-services": 300_000,
  "gambling-amusement": 300_000,
  "air-conditioning-refrigeration": 60_000,

  // Professional services: the lightest opens on the site. A desk, software,
  // and credentials; almost no capital plant. Consulting and software are the
  // floor; a clinical practice that needs equipment sits far higher (below).
  "legal-services": 40_000,
  "sole-practitioner-law-firms": 40_000,
  "accounting-tax": 25_000,
  "sole-practitioner-accountants": 25_000,
  "management-consulting": 15_000,
  "real-estate-agencies": 40_000,
  "independent-insurance-brokers": 30_000,
  "marketing-design-agencies": 20_000,
  "software-development": 25_000,
  "custom-software-contract-dev": 25_000,
  "it-services-msps-small": 40_000,
  "web-mobile-dev-shops": 25_000,
  "engineering-architecture": 35_000,

  // Clinical practices: a fit-out plus the chair, the imaging, the kit. Heavy
  // by the standards of professional services because the equipment is real.
  "dental-practices": 400_000,
  "doctors-clinics": 300_000,
  "physical-therapy-clinics": 120_000,
  "chiropractic-clinics": 100_000,
  "optometry-vision-centers": 200_000,
  "veterinary-pet-care": 350_000,
  "mental-health-practices-small": 30_000,
  "nursing-elderly-care": 400_000,

  // Fitness, learning, leisure: a leased space and its kit, modest at the studio
  // end, heavier for a floor of gym equipment.
  "sports-fitness": 200_000,
  "yoga-pilates-studios": 80_000,
  "personal-training": 30_000,
  "martial-arts-dojos": 70_000,
  "dance-studios": 80_000,
  "tutoring-centers": 50_000,
  "music-schools-private-lessons": 40_000,
  "driving-schools": 60_000,
  "photography-studios": 50_000,
  "childcare-social-services": 150_000,
  "daycare-preschool": 150_000,
  "pet-daycare-boarding": 200_000,

  // Lodging and laundry: premises-heavy. A hotel is the single largest open the
  // site covers; a laundry or a B&B is a fraction of it.
  "hotels-lodging": 2_000_000,
  "independent-hotels-inns": 1_500_000,
  "bed-breakfasts": 250_000,
  "dry-cleaning-laundry": 180_000,
};

/**
 * The modeled default for any activity without a specific entry above. A
 * moderate small-business open: more than a laptop trade, less than a full
 * venue. Keeps the long tail of activities on the same scale rather than
 * dashing, the same discipline the density archetype's default follows.
 */
export const STARTUP_CAPITAL_ARCHETYPE_DEFAULT_USD = 80_000;

/**
 * The place-multiplier band. The baseline archetype is index-100; a place's
 * own cost factor (its cost-of-living index over 100, or an economy proxy)
 * multiplies it, but only within this band, so the cheapest place can never
 * shrink the open below 0.4x and the priciest can never inflate it past 2.5x.
 * The cap is the core guardrail against an absurd figure.
 */
export const PLACE_FACTOR_MIN = 0.4;
export const PLACE_FACTOR_MAX = 2.5;

/**
 * Final sanity bounds on the adjusted figure, USD. A second belt after the
 * multiplier cap: even a heavy archetype at the top of the band, or a light one
 * at the bottom, lands inside a band a reader can believe. Nothing on the site
 * opens for under a few thousand dollars all-in, and the heaviest open (a
 * hotel) at the top multiplier stays under this ceiling.
 */
const STARTUP_CAPITAL_FLOOR_USD = 4_000;
const STARTUP_CAPITAL_CEILING_USD = 6_000_000;

/** The cost-of-living index of the baseline economy the archetypes are set in. */
export const BASELINE_COST_OF_LIVING_INDEX = 100;

/**
 * Modeled baseline (index-100) startup capital for an activity URL slug, or the
 * moderate default when no specific archetype is held. Always returns a finite,
 * positive, directional number (never null): the whole point is that the
 * cost-to-open row stops dashing wherever we can reasonably estimate it.
 */
export function startupCapitalArchetypeForSlug(
  slug: string | null | undefined,
): number {
  return (
    (slug ? STARTUP_CAPITAL_ARCHETYPE_USD[slug.toLowerCase()] : undefined) ??
    STARTUP_CAPITAL_ARCHETYPE_DEFAULT_USD
  );
}

/**
 * Modeled baseline (index-100) startup capital for an industry id (e.g.
 * "restaurants", "cafes_coffee"), resolving the id to its URL slug first so
 * callers that hold the id (the cell board) and callers that hold the slug (the
 * leaderboards) reach the same table. Returns the moderate default for an
 * unknown id.
 */
export function startupCapitalArchetype(
  industryId: string | null | undefined,
): number {
  if (!industryId) return STARTUP_CAPITAL_ARCHETYPE_DEFAULT_USD;
  return startupCapitalArchetypeForSlug(industryToSlug(industryId));
}

/**
 * Clamp a raw place cost factor into the allowed multiplier band. A non-finite
 * or non-positive factor collapses to 1.0 (the baseline, no adjustment) before
 * clamping, so a missing or junk input never moves the figure the wrong way.
 */
export function clampPlaceFactor(factor: number | null | undefined): number {
  const f =
    typeof factor === "number" && Number.isFinite(factor) && factor > 0
      ? factor
      : 1;
  return Math.min(PLACE_FACTOR_MAX, Math.max(PLACE_FACTOR_MIN, f));
}

/**
 * Resolve the place cost factor for a cell from the best signal available, in
 * priority order, each already capped to the multiplier band:
 *
 *   1. the cell city's cost-of-living index over the baseline (index 100): the
 *      most direct and most local signal, present for every covered city;
 *   2. else a proxy from country economics, the average yearly wage relative to
 *      a baseline high-income wage, which tracks local cost reasonably for a
 *      state or region slug that is not a known city;
 *   3. else 1.0 (the baseline, no adjustment), so a place with no signal at all
 *      simply shows the baseline archetype rather than a guess.
 *
 * The result is always a finite factor inside [PLACE_FACTOR_MIN,
 * PLACE_FACTOR_MAX]. The country proxy uses a yearly wage; the cell board
 * passes the snapshot's avgMonthlySalary annualized.
 */
export function placeFactor(input: {
  /** City cost-of-living index (NYC = 100), or null for a non-city slug. */
  costOfLivingIndex?: number | null;
  /** Average gross yearly salary for the country, USD, or null. */
  avgYearlySalary?: number | null;
}): number {
  const { costOfLivingIndex, avgYearlySalary } = input;
  // 1. City cost-of-living index: the local, direct signal.
  if (
    typeof costOfLivingIndex === "number" &&
    Number.isFinite(costOfLivingIndex) &&
    costOfLivingIndex > 0
  ) {
    return clampPlaceFactor(costOfLivingIndex / BASELINE_COST_OF_LIVING_INDEX);
  }
  // 2. Country wage proxy: a state/region slug has no city index, so fall back
  // to how the country's pay compares with a baseline high-income wage. The
  // baseline (USD 60,000/yr) is roughly the wage that pairs with a cost-of-
  // living index near 100, so a richer economy reads above 1.0 and a poorer one
  // below, before the band cap. Directional, and the cap keeps it sane.
  if (
    typeof avgYearlySalary === "number" &&
    Number.isFinite(avgYearlySalary) &&
    avgYearlySalary > 0
  ) {
    const BASELINE_YEARLY_WAGE_USD = 60_000;
    return clampPlaceFactor(avgYearlySalary / BASELINE_YEARLY_WAGE_USD);
  }
  // 3. No signal: baseline, no adjustment.
  return 1;
}

/**
 * The MODELED, place-adjusted startup capital for an industry in a place, USD.
 * Takes the index-100 archetype for the industry, multiplies by the place cost
 * factor (already capped to the multiplier band), and bounds the result to the
 * final floor/ceiling as a second belt. Always a finite, positive figure, so
 * the cost-to-open row never dashes on a modeled value and never shows an
 * absurd one.
 */
export function placeAdjustedStartupCapital(input: {
  industryId: string | null | undefined;
  costOfLivingIndex?: number | null;
  avgYearlySalary?: number | null;
}): number {
  const base = startupCapitalArchetype(input.industryId);
  const factor = placeFactor({
    costOfLivingIndex: input.costOfLivingIndex,
    avgYearlySalary: input.avgYearlySalary,
  });
  const adjusted = base * factor;
  return Math.min(
    STARTUP_CAPITAL_CEILING_USD,
    Math.max(STARTUP_CAPITAL_FLOOR_USD, adjusted),
  );
}
