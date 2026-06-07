/**
 * src/lib/open/buy_vs_start.ts
 *
 * Server-side data builder for the dedicated "is it smarter to BUY an existing
 * [business] in [place] or START one fresh?" page. ONE responsibility: assemble
 * a side-by-side BUY vs START picture for a single (country, geo, industry) URL
 * triple, reusing the EXACT live numbers the cost-to-open page already computes
 * so the START side can never disagree with the rest of the site.
 *
 * The START side is NOT re-derived here. It is read STRAIGHT OFF buildOpeningPage
 * (src/lib/open/opening_page.ts), which itself mirrors the cell page's resolution
 * exactly: the total one-time cost to open (capital + permits), the time to open
 * (modeled weeks), the break-in payback in years (off buildCellBoard), and the
 * owner take-home (the page's shared source of truth). So every START figure on
 * this page is byte-for-byte the cost-to-open page's, and through it the cell
 * page's. We add nothing to the START side; we only RE-FRAME it as one half of a
 * buy-or-build decision.
 *
 * The BUY side is MODELED and clearly labelled as such. There is no real
 * transactions feed on the site, so a typical small-business SALE PRICE is a
 * modeled earnings multiple (an SDE / owner-earnings multiple, the standard way
 * Main Street businesses change hands) applied to the cell's live annual owner
 * take-home:
 *
 *   sale price = owner take-home x per-industry SDE multiple
 *
 * The multiple map is per broad trade family (services lighter, clinical and
 * software heavier, food and trades in the middle), sanity-bounded, and the whole
 * sale price is bounded to a believable band as a second belt. An asset floor sits
 * under the price too: an established asset-heavy business (a hotel, a plant)
 * cannot trade for a tiny slice of its build cost however thin its earnings, so the
 * sale price is floored to a fraction of the START cost to open. Cash needed to buy
 * is the sale price itself (financing exists in reality, but we keep the headline
 * the all-cash figure and say so), so the two cash numbers compare like for like:
 * what you part with on day one.
 *
 * MISSING-DATA DISCIPLINE (the founder no-wrong-numbers rule): the BUY side is
 * meaningless without a real owner take-home to multiply, and the START side is
 * meaningless without a real cost to open. So the builder returns null when the
 * opening page is null (untrusted / unresolved cell) OR when its owner take-home
 * is missing OR when its total-to-open is missing, and the route notFound()s
 * rather than printing an invented sale price. Every shared number is reused, not
 * re-derived, so the two surfaces can never drift.
 *
 * Pure-ish: one await on buildOpeningPage (which owns all the Supabase work and
 * is fully budget-wrapped) plus pure arithmetic and copy. No direct Supabase, no
 * fs, no React. Constraint-safe: no em-dashes, no source-agency names, USD-only.
 */
import { buildOpeningPage } from "@/lib/open/opening_page";
import { industryToSlug } from "@/lib/taxonomy";

/** A real, finite, positive number. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/* ----------------------------------------------------------------------------
 * The modeled SDE / owner-earnings multiple per trade family.
 *
 * How small businesses actually change hands: a buyer pays a multiple of the
 * seller's discretionary earnings (the owner take-home the cell already shows).
 * The multiple is set by how transferable and how durable the cash flow is:
 *
 *   - Asset-light SERVICES that walk out the door with the owner (consulting,
 *     cleaning, a one-van trade) trade THIN, near 2.0 to 2.5x: the goodwill is
 *     mostly the operator, so a buyer pays less for earnings they may not keep.
 *   - FOOD and hospitality trade near 2.0x: real fit-out value, but fickle
 *     demand and thin margins cap what a buyer will pay.
 *   - RETAIL near 2.2x: inventory and a lease have value, but footfall is fragile.
 *   - TRADES near 2.2x: a book of work and kit, but operator-dependent.
 *   - HEALTH / clinical near 3.0x: licensed, sticky patient lists, recurring
 *     demand, so durable earnings command a higher multiple.
 *   - SOFTWARE / agency / recurring near 3.0x: contracts and retainers are the
 *     stickiest small-business cash flows, so they fetch the top of the band.
 *
 * Keyed by the activity's URL slug (the canonical industryToSlug output, the SAME
 * key space the startup-capital and density archetypes use). A by-industry-id
 * helper resolves the id to its slug first. The default (2.4x) is a moderate
 * Main-Street multiple for the long tail. Bounded to a sane band as a guardrail.
 *
 * These are DIRECTIONAL archetypes, not a valuation for any one business, and the
 * page says so on the row. The point is a believable order of magnitude for "what
 * would this cost to buy instead of build", not a quote.
 * ------------------------------------------------------------------------- */

/** Multiple band: nothing trades below 1.5x SDE or above 4.0x on Main Street. */
const MULTIPLE_MIN = 1.5;
const MULTIPLE_MAX = 4.0;

/** The moderate default multiple for the long tail of activities. */
export const SDE_MULTIPLE_DEFAULT = 2.4;

/**
 * Per-activity SDE multiple, keyed by activity URL slug. Grouped by the trade
 * family; the comment on each block is the reasoning, not a source. Every key is
 * a canonical industryToSlug output that also appears in the startup-capital
 * archetype table, so the two modeled lookups share a key space.
 */
const SDE_MULTIPLE_BY_SLUG: Record<string, number> = {
  // Food and drink (~2.0x): real fit-out, fickle demand, thin margins.
  restaurants: 2.0,
  "sit-down-restaurants": 2.0,
  "fast-casual-restaurants": 2.0,
  pizzerias: 2.0,
  "chicken-shops": 2.0,
  "cafes-coffee-shops": 2.0,
  "tea-houses-matcha-bars": 2.0,
  "bars-nightclubs": 2.0,
  "pubs-taverns": 2.0,
  "wine-bars": 2.0,
  "bakeries-retail": 2.0,
  "artisan-bakery-wholesale": 2.2,
  "cake-shops-patisseries": 2.0,
  "pastry-dessert-shops": 2.0,
  "ice-cream-frozen-dessert-shops": 2.0,
  "food-trucks": 1.8,
  "coffee-roasters": 2.2,
  "breweries-taprooms-retail": 2.2,

  // Grooming and personal care (~2.2x): chair-based, somewhat operator-tied.
  barbershops: 2.0,
  "hairdressers-beauty": 2.2,
  "hair-salons-full-service": 2.2,
  "nail-salons": 2.2,
  "brow-lash-studios": 2.0,
  "day-spas": 2.4,
  "med-spas-small": 2.8,
  "massage-therapy-clinics": 2.2,
  "tanning-salons": 2.2,
  "tattoo-piercing-studios": 2.0,

  // Retail (~2.2x): inventory and a lease have value, footfall is fragile.
  "grocery-stores": 2.4,
  "specialty-grocers-delis": 2.2,
  "wine-liquor-stores": 2.4,
  "cosmetics-beauty-shops": 2.2,
  "pharmacies-health-stores": 3.0,
  "independent-pharmacies": 3.0,
  "florist-shops": 2.0,
  "pet-stores": 2.2,
  "hardware-stores-local": 2.4,
  "clothing-boutiques": 2.0,
  "clothing-shoe-stores": 2.0,
  "jewelry-stores": 2.4,
  "furniture-stores": 2.2,
  "book-retailing": 2.0,
  "eyewear-optical-retail": 2.8,
  "gas-stations": 2.6,

  // Trades and home services (~2.2x): a book of work and kit, operator-dependent.
  electricians: 2.2,
  plumbers: 2.2,
  "hvac-services": 2.4,
  roofers: 2.2,
  "painters-residential": 2.0,
  "landscaping-lawn-care": 2.2,
  "cleaning-services": 2.2,
  "residential-cleaning-services": 2.2,
  "cleaning-carpet-upholstery": 2.2,
  "cleaning-building-industrial": 2.6,
  "pest-control-local": 2.8,
  locksmiths: 2.0,
  "junk-removal-small-moving": 2.2,
  "auto-repair-shops": 2.4,
  "auto-body-shops": 2.4,
  "automotive-electrical-services": 2.4,
  "electronics-phone-repair": 2.0,

  // Construction and building trades (~2.2x): a pipeline and plant, but
  // project-based and operator-led.
  "residential-construction": 2.2,
  "commercial-construction": 2.4,
  "civil-engineering": 2.6,
  "specialty-construction-services": 2.2,
  "specialty-trades-mixed": 2.2,
  "bricklaying-services": 2.0,
  "blocklaying-services": 2.0,
  "cement-rendering-services": 2.0,
  "carpet-laying-services": 2.0,
  "carpentry-services": 2.2,
  "carpenters-finish-work": 2.2,
  "roofing-services": 2.2,
  "tiling-services": 2.0,
  "plastering-services": 2.0,
  "painting-services": 2.0,
  "plumbing-services": 2.2,
  "flooring-installers": 2.2,
  "cabinet-making": 2.4,

  // Manufacturing (~2.6x): real plant and a customer book, but capital-heavy and
  // cyclical, so a middle multiple rather than the services thin end.
  "textiles-fabric-manufacturing": 2.6,
  "apparel-manufacturing": 2.6,
  "custom-apparel-uniforms": 2.6,
  "small-leather-goods": 2.4,
  "paper-printing-manufacturing": 2.6,
  "print-shops-offset-digital": 2.4,
  "sign-shops-graphics-fab": 2.4,
  "custom-jewelers-mfg": 2.4,
  "soap-candle-makers": 2.4,
  "electronics-semiconductors": 3.0,
  "electrical-equipment": 2.8,
  "miscellaneous-manufacturing": 2.6,
  "food-manufacturing": 2.8,
  "beverage-manufacturing": 2.8,
  "craft-breweries-taprooms": 2.4,
  "specialty-food-production": 2.6,
  "wood-products-manufacturing": 2.6,
  "custom-furniture-makers": 2.4,
  "furniture-manufacturing": 2.6,
  "plastics-rubber-products": 2.8,
  "fabricated-metal-manufacturing": 2.8,
  "primary-metal-manufacturing": 2.8,
  "metal-fabrication-machine-shops": 2.8,
  "machinery-manufacturing": 3.0,
  "chemical-pharma-manufacturing": 3.0,
  "petroleum-coal-products": 3.0,
  "motor-vehicles-parts": 2.8,
  "aerospace-other-transport-mfg": 3.0,

  // Other capital-heavy plays: a fleet, a yard, a floor of inventory, recurring
  // demand. Durable assets and demand, so toward the upper band.
  "auto-dealers": 2.6,
  "equipment-rental-leasing": 3.0,
  "warehousing-storage": 3.2,
  "building-garden-supply-stores": 2.4,
  "garden-centers-nurseries": 2.2,
  "campgrounds-rv-parks": 3.0,
  "funeral-services": 3.2,
  "gambling-amusement": 2.8,
  "air-conditioning-refrigeration": 2.6,

  // Professional services (~2.5x): light to open but earnings can walk with the
  // owner, so a moderate multiple unless the cash flow is contracted.
  "legal-services": 2.4,
  "sole-practitioner-law-firms": 2.2,
  "accounting-tax": 3.0,
  "sole-practitioner-accountants": 2.8,
  "management-consulting": 2.2,
  "real-estate-agencies": 2.4,
  "independent-insurance-brokers": 3.2,
  "marketing-design-agencies": 3.0,
  "software-development": 3.0,
  "custom-software-contract-dev": 3.0,
  "it-services-msps-small": 3.2,
  "web-mobile-dev-shops": 3.0,
  "engineering-architecture": 2.6,

  // Clinical practices (~3.0x): licensed, sticky patient lists, recurring demand.
  "dental-practices": 3.0,
  "doctors-clinics": 3.0,
  "physical-therapy-clinics": 2.8,
  "chiropractic-clinics": 2.6,
  "optometry-vision-centers": 2.8,
  "veterinary-pet-care": 3.2,
  "mental-health-practices-small": 2.4,
  "nursing-elderly-care": 3.0,

  // Fitness, learning, leisure (~2.4x): membership and recurring lessons add
  // stickiness, but retention risk caps the multiple.
  "sports-fitness": 2.4,
  "yoga-pilates-studios": 2.4,
  "personal-training": 2.0,
  "martial-arts-dojos": 2.4,
  "dance-studios": 2.2,
  "tutoring-centers": 2.6,
  "music-schools-private-lessons": 2.4,
  "driving-schools": 2.4,
  "photography-studios": 2.0,
  "childcare-social-services": 3.0,
  "daycare-preschool": 3.0,
  "pet-daycare-boarding": 2.6,

  // Lodging and laundry (~3.0x): premises-heavy with recurring demand; a hotel's
  // real estate and a laundry's route book underpin durable cash flow.
  "hotels-lodging": 3.2,
  "independent-hotels-inns": 3.0,
  "bed-breakfasts": 2.6,
  "dry-cleaning-laundry": 2.6,
};

/**
 * Final sanity bounds on the modeled sale price, USD. A second belt after the
 * multiple band: even a high multiple on a high take-home stays inside a number a
 * reader can believe for a small-business acquisition, and the floor keeps a
 * tiny-earnings deal from reading as free.
 */
const SALE_PRICE_FLOOR_USD = 10_000;
const SALE_PRICE_CEILING_USD = 25_000_000;

/**
 * Asset floor on the modeled sale price, as a fraction of the START cost to open.
 * An established asset-heavy business (a hotel's real estate, a plant's machinery)
 * carries hard assets whose resale value sets a floor: it cannot trade for a tiny
 * slice of what it costs to build, however thin its earnings. So the sale price is
 * floored to ~40% of the build cost, which only ever LIFTS prices that an
 * earnings multiple on thin take-home drove implausibly low; service and software
 * businesses already clear it (their earnings price tops their low build cost).
 */
const ASSET_FLOOR_FRACTION = 0.4;

/**
 * The modeled SDE multiple for an activity URL slug, clamped to the band. The
 * moderate default covers the long tail. Always a finite, positive number inside
 * [MULTIPLE_MIN, MULTIPLE_MAX].
 */
export function sdeMultipleForSlug(slug: string | null | undefined): number {
  const raw =
    (slug ? SDE_MULTIPLE_BY_SLUG[slug.toLowerCase()] : undefined) ??
    SDE_MULTIPLE_DEFAULT;
  return Math.min(MULTIPLE_MAX, Math.max(MULTIPLE_MIN, raw));
}

/**
 * The modeled SDE multiple for an industry id, resolving the id to its URL slug
 * first so callers that hold the id reach the same table. Returns the moderate
 * default (clamped) for an unknown id.
 */
export function sdeMultiple(industryId: string | null | undefined): number {
  if (!industryId) return SDE_MULTIPLE_DEFAULT;
  return sdeMultipleForSlug(industryToSlug(industryId));
}

/* ----------------------------------------------------------------------------
 * Public types
 * ------------------------------------------------------------------------- */

/** The START side: build it fresh, the live cost-to-open numbers, re-framed. */
export interface StartSide {
  /** Cash needed up front: the total one-time cost to open, USD (capital + permits). */
  cashNeededUsd: number;
  /** Modeled weeks from the decision to opening day. */
  timeToOpenWeeks: number;
  /**
   * Years to earn the entry cost back once open (the break-in payback), or null
   * when the cell has no defensible rating. This is the ramp AFTER opening.
   */
  paybackYears: number | null;
  /** True (the start cost is always at least partly modeled archetype). */
  modeled: true;
}

/** The BUY side: skip the build, buy the cash flow. Modeled, clearly labelled. */
export interface BuySide {
  /** The SDE / owner-earnings multiple applied to the take-home. */
  multiple: number;
  /** The cell's live annual owner take-home, USD, the earnings being bought. */
  ownerTakeHomeUsd: number;
  /** The modeled typical sale price, USD = take-home x multiple, bounded. */
  salePriceUsd: number;
  /**
   * Cash needed up front: the sale price (financing exists, but the headline is
   * the all-cash figure so the two sides compare like for like).
   */
  cashNeededUsd: number;
  /** Always true: the sale price is a modeled archetype, not a real listing. */
  modeled: true;
}

/** The honest catch on each side, named in plain language. */
export interface BuyVsStartCatch {
  /** The upside of starting fresh, one short clause. */
  startUpside: string;
  /** The catch on starting fresh (the ramp, the failure risk), one clause. */
  startCatch: string;
  /** The upside of buying (day-one cash flow), one short clause. */
  buyUpside: string;
  /** The catch on buying (goodwill, inherited problems), one short clause. */
  buyCatch: string;
}

/** The full BUY vs START picture for one (country, geo, industry). */
export interface BuyVsStart {
  /** Business (activity) display name, e.g. "Restaurants". */
  businessName: string;
  /** Canonical industry id of the resolved cell. */
  industryId: string;
  /** Place display name, e.g. "London". */
  placeName: string;
  /** ISO2 country slug (lowercased). */
  country: string;
  /** Link back to the full cell page for this business-and-place. */
  cellHref: string;
  /** Link to the cost-to-open page for this business-and-place (the START detail). */
  openingHref: string;

  /** The start-fresh side, the live cost-to-open numbers re-framed. */
  start: StartSide;
  /** The buy-existing side, modeled and clearly labelled. */
  buy: BuySide;

  /** The honest two-sided catch. */
  catches: BuyVsStartCatch;

  /** A one-line honest verdict that names the catch on BOTH sides. */
  verdict: string;
}

export interface BuildBuyVsStartArgs {
  /** Country URL slug (iso2), e.g. "gb". */
  country: string;
  /** Geo URL slug, e.g. "london". */
  geo: string;
  /** Industry URL slug, e.g. "restaurants". */
  industry: string;
}

/* ----------------------------------------------------------------------------
 * Verdict + catch copy
 *
 * The honest verdict NAMES the catch on both sides every time: never "buy is
 * better" without the goodwill / inheritance catch, never "start is better"
 * without the ramp / failure catch. The lean is chosen by a simple, transparent
 * read of the two cash figures and the payback, but the sentence always carries
 * both catches so a reader is never sold one side blind.
 * ------------------------------------------------------------------------- */

/**
 * The fixed two-sided catch copy. Plain, warm, honest. No em-dashes. Same on
 * every page because the trade-off itself is the same: build cheap but wait
 * through a ramp, or buy cash flow but pay for goodwill and inherit the problems.
 */
function buildCatches(): BuyVsStartCatch {
  return {
    startUpside: "you build it your way and pay nothing for goodwill",
    startCatch:
      "you wait through the ramp, with no cash flow until you find your feet, and most of the failure risk sits in those first couple of years",
    buyUpside: "you skip the ramp and inherit cash flow from day one",
    buyCatch:
      "you pay for someone else's goodwill, and you inherit their problems, the stale lease, the tired kit, the reason they sold",
  };
}

/**
 * One honest one-line verdict that names BOTH catches and never states a cash
 * claim the numbers contradict. The lean is a transparent, FACT-CHECKED read:
 *
 *   - which side actually needs less cash up front (a hard comparison of the two
 *     cash figures, with a 15% dead-band so two close figures read as "close to
 *     the same" rather than picking a false winner), AND
 *   - how long the start ramp is (the break-in payback in years).
 *
 * The sentence ALWAYS carries both catches (the ramp / failure risk on starting,
 * the goodwill / inherited-problems risk on buying), so a reader is never sold
 * one side blind, and it only ever calls a side "cheaper" when it truly is.
 */
function buildVerdict(
  businessName: string,
  start: StartSide,
  buy: BuySide,
): string {
  const lower = businessName.toLowerCase();

  // Compare the two cash figures with a dead-band, so "close" never reads as a
  // false winner. Buying is meaningfully dearer / cheaper only past 15%.
  const startCash = start.cashNeededUsd;
  const buyCash = buy.cashNeededUsd;
  const ratio = startCash > 0 ? buyCash / startCash : 1;
  const buyDearer = ratio > 1.15;
  const buyCheaper = ratio < 0.85;

  const longRamp = isPos(start.paybackYears) && start.paybackYears >= 3;
  const shortRamp = isPos(start.paybackYears) && start.paybackYears < 1.5;

  // The catch clauses, carried in every branch so neither side is sold blind.
  const startCatch =
    "starting means no cash flow until you ramp, and most of the failure risk sits in the first couple of years";
  const buyCatch =
    "buying means paying for someone else's goodwill and inheriting their problems, so it only wins if that cash flow is real and stays";

  // Buying is the dearer path. Worth it only when the start ramp is long enough
  // that day-one cash flow earns back the premium; otherwise starting wins on
  // cash. Either way both catches are named.
  if (buyDearer) {
    if (longRamp) {
      return `Buying an existing ${lower} costs more cash up front but pays from day one, which can be worth it here because starting fresh means a long ramp before profit. Weigh it honestly: ${buyCatch}, while ${startCatch}.`;
    }
    return `Starting fresh costs less cash than buying in and the wait to profit is not long, so building usually wins on the numbers. Still weigh both sides: ${startCatch}, while ${buyCatch}.`;
  }

  // Buying is the cheaper path (a thin take-home can model a low sale price).
  // Say so plainly, but flag that a cheap buy is the moment to look hardest at
  // what you are inheriting. Both catches named.
  if (buyCheaper) {
    return `On these numbers buying in costs less cash than building from scratch, and it pays from day one, but a low price is exactly when to look hardest at what you are buying: ${buyCatch}. Start fresh instead and ${startCatch}.`;
  }

  // The cash is close to the same. The ramp breaks the tie, but gently, and both
  // catches are named.
  if (shortRamp) {
    return `The cash needed is close either way, so the wait breaks the tie: starting fresh pays back fast here, which tips it toward building. Even so, ${startCatch}, while ${buyCatch}.`;
  }
  return `It is close. The cash needed is similar either way, so it comes down to the ramp and the deal: ${startCatch}, while ${buyCatch}.`;
}

/* ----------------------------------------------------------------------------
 * The builder
 * ------------------------------------------------------------------------- */

/**
 * Assemble the BUY vs START picture for one (country, geo, industry), or null
 * when the START side cannot be trusted. The START side is read straight off
 * buildOpeningPage (which mirrors the cell page exactly and self-gates on trust),
 * so this returns null whenever that does, AND whenever the owner take-home or
 * the total-to-open is missing (no defensible BUY price without a take-home to
 * multiply, no defensible START cash without a cost to open). Every shared number
 * is reused, never re-derived, so the two surfaces cannot drift.
 */
export async function buildBuyVsStart(
  args: BuildBuyVsStartArgs,
): Promise<BuyVsStart | null> {
  const { country, geo, industry } = args;

  // The START side is the cost-to-open page's numbers, resolved through the same
  // trust-gated builder. Null here means the cell did not resolve or is not a
  // trusted local measurement, so we notFound() exactly as that page does.
  const opening = await buildOpeningPage({ country, geo, industry });
  if (!opening) return null;

  // No-wrong-numbers gate. The BUY price multiplies the owner take-home, so a
  // missing take-home means no defensible sale price: return null rather than
  // invent one. The START cash is the total to open, so a missing/non-positive
  // total is equally undefensible.
  const takeHome = opening.takeHomeUsd;
  if (!isPos(takeHome)) return null;
  if (!isPos(opening.totalToOpenUsd)) return null;

  const industryId = opening.industryId;

  // START side: re-frame the live cost-to-open numbers. The payback (the ramp
  // after opening) rides off the break-in rating, null when the cell is unscored.
  const start: StartSide = {
    cashNeededUsd: Math.round(opening.totalToOpenUsd),
    timeToOpenWeeks: opening.time.value,
    paybackYears:
      opening.breakIn && isPos(opening.breakIn.paybackYears)
        ? opening.breakIn.paybackYears
        : null,
    modeled: true,
  };

  // BUY side: the modeled sale price = take-home x the per-industry SDE multiple,
  // bounded to a believable acquisition band. Cash needed is the sale price (the
  // all-cash headline; financing exists but we keep the comparison like-for-like).
  const multiple = sdeMultiple(industryId);
  const earningsMultiplePrice = takeHome * multiple;
  // Asset floor: a built business cannot sell for a tiny slice of what it costs to
  // build, so its hard assets set a minimum that thin earnings cannot undercut.
  // This only lifts asset-heavy rows (hotels, manufacturing) whose earnings price
  // reads implausibly low; service/software already clear the floor unchanged.
  const assetFloorPrice = ASSET_FLOOR_FRACTION * start.cashNeededUsd;
  const flooredSalePrice = Math.max(earningsMultiplePrice, assetFloorPrice);
  const salePriceUsd = Math.round(
    Math.min(SALE_PRICE_CEILING_USD, Math.max(SALE_PRICE_FLOOR_USD, flooredSalePrice)),
  );
  const buy: BuySide = {
    multiple,
    ownerTakeHomeUsd: Math.round(takeHome),
    salePriceUsd,
    cashNeededUsd: salePriceUsd,
    modeled: true,
  };

  const catches = buildCatches();
  const verdict = buildVerdict(opening.businessName, start, buy);

  // The cost-to-open page lives at the cell's /opening path; link the START
  // detail there so a reader can drill into the full opening breakdown.
  const openingHref = `${opening.cellHref}/opening`;

  return {
    businessName: opening.businessName,
    industryId,
    placeName: opening.placeName,
    country: opening.country,
    cellHref: opening.cellHref,
    openingHref,
    start,
    buy,
    catches,
    verdict,
  };
}
