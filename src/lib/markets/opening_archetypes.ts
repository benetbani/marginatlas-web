/**
 * src/lib/markets/opening_archetypes.ts
 *
 * The MODELED "what it takes to open" checklist for the small-business
 * activities the site shows: alongside the one-time capital (see
 * startup_capital_archetypes.ts), the three things a would-be owner asks next.
 * How long from the decision to the doors opening, what the regulator's bill is
 * to be allowed to trade, and who you hire first. Each is a per-industry
 * archetype set in a BASELINE economy (cost-of-living index 100, the NYC anchor
 * the city list uses), so the figures read as one consistent signal everywhere,
 * exactly the way competition density and the entry capital do: a reader learns
 * the unit once and reads it on every page.
 *
 * These figures are directional, drawn from general industry knowledge of the
 * shape of each open: a clinical practice or a hotel is a long, heavily licensed,
 * staff-heavy build; a consultant or a cleaner is a short, lightly regulated,
 * near-solo start. They are NOT a quote or a permit schedule for any one place,
 * and the board says so on every modeled row. A sensible default covers the long
 * tail of activities without a specific entry, on the same scale.
 *
 * Three datasets, each keyed by the activity's URL slug (the canonical
 * industryToSlug output, the SAME key space the density and startup-capital
 * archetypes use, so all the modeled lookups agree on their keys):
 *
 *   1. TIME TO OPEN, integer WEEKS from the decision to open to opening day.
 *      PLACE-INVARIANT: time is the modeled archetype, not COL-adjusted (a
 *      permit queue is not faster in a cheaper town). Bounded 1 to 104 weeks.
 *   2. PERMITS AND LICENSING, the one-time regulatory cost in USD at the
 *      baseline. PLACE-ADJUSTED by the same capped place factor the entry
 *      capital uses, so the regulator's bill reads higher in a costly metro.
 *      The regulated-industry premium (a liquor licence, a pharmacy permit) is
 *      baked into the archetype itself. Bounded USD 100 to 80,000.
 *   3. FIRST HIRES, the typical starting headcount BEYOND the owner (integer),
 *      plus a short, warm role hint. PLACE-INVARIANT: the crew you need to open
 *      the doors is the shape of the work, not the cost of the town. Bounded
 *      0 to 50.
 *
 * A by-industry-id helper resolves the id to its slug first, so the cell board
 * (which holds cell.industry_id) and the leaderboards (which hold the slug) can
 * both reach every dataset.
 *
 * Pure module: static tables plus pure lookups. No Supabase, no fs, no runtime
 * side effects, so it stays trivially testable and cannot trip the layering
 * gate. Constraint-safe: no em-dashes, no source-agency names, USD-only money.
 */
import { industryToSlug } from "@/lib/taxonomy";

/** The cost-of-living index of the baseline economy the archetypes are set in. */
export const BASELINE_COST_OF_LIVING_INDEX = 100;

/* ============================================================================
 * 1. TIME TO OPEN (weeks, place-invariant)
 * ========================================================================== */

/**
 * The modeled typical weeks from the decision to open to opening day, keyed by
 * activity URL slug. Directional archetypes for a developed urban market, not a
 * per-place timeline. Grouped by the shape of the open; the comment on each
 * block is the reasoning, not a source. Place-invariant: no COL adjustment, a
 * licence queue is not shorter in a cheaper town.
 */
const TIME_TO_OPEN_WEEKS: Record<string, number> = {
  // Food and drink venues: a full build, a fit-out, and a licence chain, so the
  // longest opens among the everyday trades. A bar's liquor permit stretches it.
  restaurants: 16,
  "sit-down-restaurants": 16,
  "fast-casual-restaurants": 12,
  pizzerias: 12,
  "chicken-shops": 12,
  "cafes-coffee-shops": 12,
  "tea-houses-matcha-bars": 12,
  "bars-nightclubs": 18,
  "pubs-taverns": 18,
  "wine-bars": 16,
  "bakeries-retail": 12,
  "artisan-bakery-wholesale": 14,
  "cake-shops-patisseries": 12,
  "pastry-dessert-shops": 12,
  "ice-cream-frozen-dessert-shops": 10,
  "food-trucks": 10,
  "coffee-roasters": 14,
  "breweries-taprooms-retail": 28,

  // Grooming and personal care: a small studio fit-out and the trade licence.
  // Quick at the barber end, a little longer for a clinical spa build.
  barbershops: 8,
  "hairdressers-beauty": 8,
  "hair-salons-full-service": 8,
  "nail-salons": 8,
  "brow-lash-studios": 8,
  "day-spas": 10,
  "med-spas-small": 16,
  "massage-therapy-clinics": 8,
  "tanning-salons": 8,
  "tattoo-piercing-studios": 8,

  // Retail: a leased shop, a fit-out, and an opening stock order. A pharmacy's
  // licensing and a grocery's scale stretch the timeline past a small boutique.
  "grocery-stores": 14,
  "specialty-grocers-delis": 12,
  "wine-liquor-stores": 14,
  "cosmetics-beauty-shops": 10,
  "pharmacies-health-stores": 20,
  "independent-pharmacies": 20,
  "florist-shops": 8,
  "pet-stores": 10,
  "hardware-stores-local": 12,
  "clothing-boutiques": 10,
  "clothing-shoe-stores": 10,
  "jewelry-stores": 12,
  "furniture-stores": 12,
  "book-retailing": 10,
  "eyewear-optical-retail": 14,
  "gas-stations": 24,

  // Trades and home services: a van, tools, and a trade registration. Among the
  // fastest opens, the asset is the operator, not a premises to fit out.
  electricians: 3,
  plumbers: 3,
  "hvac-services": 4,
  roofers: 4,
  "painters-residential": 2,
  "landscaping-lawn-care": 3,
  "cleaning-services": 2,
  "residential-cleaning-services": 2,
  "cleaning-carpet-upholstery": 3,
  "cleaning-building-industrial": 4,
  "pest-control-local": 6,
  locksmiths: 4,
  "junk-removal-small-moving": 3,
  "residential-construction": 4,
  "commercial-construction": 6,
  "specialty-construction-services": 4,
  "auto-repair-shops": 12,
  "auto-body-shops": 14,
  "automotive-electrical-services": 10,
  "electronics-phone-repair": 6,

  // Professional services: a desk, software, and credentials, so the timeline is
  // a registration, not a build. Consulting is near-instant; a regulated firm
  // (law, accounting) waits on admission paperwork.
  "legal-services": 3,
  "sole-practitioner-law-firms": 3,
  "accounting-tax": 3,
  "sole-practitioner-accountants": 3,
  "management-consulting": 2,
  "real-estate-agencies": 4,
  "independent-insurance-brokers": 6,
  "marketing-design-agencies": 3,
  "software-development": 3,
  "custom-software-contract-dev": 3,
  "it-services-msps-small": 3,
  "web-mobile-dev-shops": 3,
  "engineering-architecture": 4,

  // Clinical practices: a fit-out, the equipment, and a health licence, so a
  // long open by professional-services standards.
  "dental-practices": 24,
  "doctors-clinics": 24,
  "physical-therapy-clinics": 16,
  "chiropractic-clinics": 14,
  "optometry-vision-centers": 18,
  "veterinary-pet-care": 16,
  "mental-health-practices-small": 6,
  "nursing-elderly-care": 40,

  // Fitness, learning, leisure: a leased space and its kit, modest at the studio
  // end. Childcare is licensing-heavy, so it stretches well past a gym fit-out.
  "sports-fitness": 16,
  "yoga-pilates-studios": 12,
  "personal-training": 4,
  "martial-arts-dojos": 12,
  "dance-studios": 12,
  "tutoring-centers": 4,
  "music-schools-private-lessons": 4,
  "driving-schools": 8,
  "photography-studios": 3,
  "childcare-social-services": 20,
  "daycare-preschool": 20,
  "pet-daycare-boarding": 14,

  // Lodging and laundry: premises-heavy. A hotel is the single longest open the
  // site covers; a B&B and a laundry are a fraction of it.
  "hotels-lodging": 52,
  "independent-hotels-inns": 40,
  "bed-breakfasts": 20,
  "dry-cleaning-laundry": 10,
};

/**
 * The modeled default weeks for any activity without a specific entry above. A
 * moderate small-business open: longer than a laptop trade, shorter than a full
 * venue. Keeps the long tail of activities on the same scale rather than dashing.
 */
export const TIME_TO_OPEN_DEFAULT_WEEKS = 10;

/** Final sanity bounds on the weeks figure. Nothing opens overnight, and even
 * the heaviest build lands inside two years. */
const TIME_TO_OPEN_FLOOR_WEEKS = 1;
const TIME_TO_OPEN_CEILING_WEEKS = 104;

/* ============================================================================
 * 2. PERMITS AND LICENSING (USD at baseline, place-adjusted)
 * ========================================================================== */

/**
 * The modeled one-time regulatory cost, USD, to be allowed to trade in a
 * BASELINE economy (cost-of-living index 100), keyed by activity URL slug. The
 * permits, licences, bonds, and registrations before the first customer, with
 * the regulated-industry premium baked in (a liquor licence, a pharmacy permit,
 * a childcare registration). Directional, not a per-place permit schedule.
 * Place adjustment is applied later, so these are the index-100 anchors.
 */
const PERMITS_ARCHETYPE_USD: Record<string, number> = {
  // Food and drink venues: a food-service licence plus, for the drink end, a
  // liquor licence that dominates the regulatory bill.
  restaurants: 8_000,
  "sit-down-restaurants": 8_000,
  "fast-casual-restaurants": 6_000,
  pizzerias: 6_000,
  "chicken-shops": 6_000,
  "cafes-coffee-shops": 5_000,
  "tea-houses-matcha-bars": 4_500,
  "bars-nightclubs": 15_000,
  "pubs-taverns": 15_000,
  "wine-bars": 12_000,
  "bakeries-retail": 5_000,
  "artisan-bakery-wholesale": 6_000,
  "cake-shops-patisseries": 4_500,
  "pastry-dessert-shops": 4_500,
  "ice-cream-frozen-dessert-shops": 4_000,
  "food-trucks": 6_000,
  "coffee-roasters": 5_000,
  "breweries-taprooms-retail": 25_000,

  // Grooming and personal care: a cosmetology or trade licence plus the
  // facility's health sign-off. Heavier for a clinical spa.
  barbershops: 2_000,
  "hairdressers-beauty": 2_000,
  "hair-salons-full-service": 2_000,
  "nail-salons": 2_000,
  "brow-lash-studios": 1_800,
  "day-spas": 2_500,
  "med-spas-small": 12_000,
  "massage-therapy-clinics": 2_500,
  "tanning-salons": 2_000,
  "tattoo-piercing-studios": 3_000,

  // Retail: a trade licence and a sign-off. Light for a shop, but a pharmacy is
  // among the most heavily licensed activities the site covers.
  "grocery-stores": 4_000,
  "specialty-grocers-delis": 3_500,
  "wine-liquor-stores": 9_000,
  "cosmetics-beauty-shops": 1_500,
  "pharmacies-health-stores": 20_000,
  "independent-pharmacies": 20_000,
  "florist-shops": 1_200,
  "pet-stores": 2_000,
  "hardware-stores-local": 2_000,
  "clothing-boutiques": 1_500,
  "clothing-shoe-stores": 1_500,
  "jewelry-stores": 2_500,
  "furniture-stores": 1_800,
  "book-retailing": 1_000,
  "eyewear-optical-retail": 5_000,
  "gas-stations": 18_000,

  // Trades and home services: a trade licence plus, for the heavier trades, a
  // surety bond and an environmental sign-off.
  electricians: 2_500,
  plumbers: 2_500,
  "hvac-services": 3_000,
  roofers: 3_000,
  "painters-residential": 800,
  "landscaping-lawn-care": 800,
  "cleaning-services": 600,
  "residential-cleaning-services": 600,
  "cleaning-carpet-upholstery": 900,
  "cleaning-building-industrial": 1_500,
  "pest-control-local": 4_000,
  locksmiths: 1_500,
  "junk-removal-small-moving": 1_500,
  "residential-construction": 5_000,
  "commercial-construction": 8_000,
  "specialty-construction-services": 4_000,
  "auto-repair-shops": 3_000,
  "auto-body-shops": 5_000,
  "automotive-electrical-services": 2_500,
  "electronics-phone-repair": 600,

  // Professional services: an admission, a registration, a practising
  // certificate. Light in dollars; the cost is the credential, not the permit.
  "legal-services": 1_000,
  "sole-practitioner-law-firms": 1_000,
  "accounting-tax": 800,
  "sole-practitioner-accountants": 800,
  "management-consulting": 500,
  "real-estate-agencies": 1_500,
  "independent-insurance-brokers": 1_500,
  "marketing-design-agencies": 500,
  "software-development": 300,
  "custom-software-contract-dev": 300,
  "it-services-msps-small": 400,
  "web-mobile-dev-shops": 300,
  "engineering-architecture": 1_200,

  // Clinical practices: a health-facility licence and professional registration,
  // so the heaviest regulatory bills outside the drink and pharmacy trades.
  "dental-practices": 10_000,
  "doctors-clinics": 15_000,
  "physical-therapy-clinics": 5_000,
  "chiropractic-clinics": 4_000,
  "optometry-vision-centers": 6_000,
  "veterinary-pet-care": 9_000,
  "mental-health-practices-small": 2_000,
  "nursing-elderly-care": 20_000,

  // Fitness, learning, leisure: a facility sign-off, modest for a studio.
  // Childcare's licensing is the heavy exception in this block.
  "sports-fitness": 2_500,
  "yoga-pilates-studios": 2_500,
  "personal-training": 600,
  "martial-arts-dojos": 2_000,
  "dance-studios": 2_000,
  "tutoring-centers": 600,
  "music-schools-private-lessons": 600,
  "driving-schools": 3_000,
  "photography-studios": 300,
  "childcare-social-services": 8_000,
  "daycare-preschool": 8_000,
  "pet-daycare-boarding": 4_000,

  // Lodging and laundry: a lodging licence and safety sign-offs at the top end;
  // a laundry's bill is mostly its environmental permit.
  "hotels-lodging": 25_000,
  "independent-hotels-inns": 20_000,
  "bed-breakfasts": 6_000,
  "dry-cleaning-laundry": 3_000,
};

/**
 * The modeled default permit cost, USD, for any activity without a specific
 * entry above. A moderate regulatory bill: more than a pure registration, less
 * than a licensed trade. Keeps the long tail on the same scale rather than
 * dashing.
 */
export const PERMITS_ARCHETYPE_DEFAULT_USD = 1_500;

/**
 * Final sanity bounds on the adjusted permit figure, USD. A second belt after
 * the multiplier cap: even the lightest registration carries a real fee, and the
 * heaviest licence at the top of the band stays inside a number a reader can
 * believe.
 */
const PERMITS_FLOOR_USD = 100;
const PERMITS_CEILING_USD = 80_000;

/* ============================================================================
 * 3. FIRST HIRES (count beyond the owner, place-invariant) + role hints
 * ========================================================================== */

/**
 * The modeled typical starting headcount BEYOND the owner, keyed by activity URL
 * slug. The crew it takes to open the doors, not the firm at maturity.
 * Directional, and place-invariant: the shape of the work, not the cost of the
 * town. Grouped by how staff-heavy the open is; the comment on each block is the
 * reasoning, not a source.
 */
const FIRST_HIRES_COUNT: Record<string, number> = {
  // Food and drink venues: a kitchen plus a service floor, the most staff-heavy
  // everyday opens. A full restaurant needs both lines from day one.
  restaurants: 8,
  "sit-down-restaurants": 8,
  "fast-casual-restaurants": 6,
  pizzerias: 5,
  "chicken-shops": 5,
  "cafes-coffee-shops": 4,
  "tea-houses-matcha-bars": 3,
  "bars-nightclubs": 5,
  "pubs-taverns": 5,
  "wine-bars": 4,
  "bakeries-retail": 4,
  "artisan-bakery-wholesale": 4,
  "cake-shops-patisseries": 3,
  "pastry-dessert-shops": 3,
  "ice-cream-frozen-dessert-shops": 3,
  "food-trucks": 2,
  "coffee-roasters": 3,
  "breweries-taprooms-retail": 6,

  // Grooming and personal care: a chair count. A barber can open near-solo; a
  // full salon or a spa staffs several stations.
  barbershops: 2,
  "hairdressers-beauty": 3,
  "hair-salons-full-service": 3,
  "nail-salons": 3,
  "brow-lash-studios": 2,
  "day-spas": 4,
  "med-spas-small": 4,
  "massage-therapy-clinics": 2,
  "tanning-salons": 2,
  "tattoo-piercing-studios": 2,

  // Retail: a shop floor and a till. A grocery staffs several shifts; a boutique
  // can run with one or two.
  "grocery-stores": 6,
  "specialty-grocers-delis": 4,
  "wine-liquor-stores": 3,
  "cosmetics-beauty-shops": 3,
  "pharmacies-health-stores": 3,
  "independent-pharmacies": 3,
  "florist-shops": 2,
  "pet-stores": 3,
  "hardware-stores-local": 3,
  "clothing-boutiques": 3,
  "clothing-shoe-stores": 3,
  "jewelry-stores": 2,
  "furniture-stores": 3,
  "book-retailing": 2,
  "eyewear-optical-retail": 3,
  "gas-stations": 4,

  // Trades and home services: a small crew or a near-solo van. The operator is
  // the firm; a hire or two carries the work.
  electricians: 2,
  plumbers: 2,
  "hvac-services": 2,
  roofers: 4,
  "painters-residential": 2,
  "landscaping-lawn-care": 3,
  "cleaning-services": 3,
  "residential-cleaning-services": 3,
  "cleaning-carpet-upholstery": 2,
  "cleaning-building-industrial": 4,
  "pest-control-local": 2,
  locksmiths: 1,
  "junk-removal-small-moving": 2,
  "residential-construction": 4,
  "commercial-construction": 6,
  "specialty-construction-services": 3,
  "auto-repair-shops": 2,
  "auto-body-shops": 3,
  "automotive-electrical-services": 2,
  "electronics-phone-repair": 1,

  // Professional services: the lightest opens, often the owner alone. A regulated
  // practice adds a paralegal or a bookkeeper, an agency a junior or two.
  "legal-services": 1,
  "sole-practitioner-law-firms": 1,
  "accounting-tax": 1,
  "sole-practitioner-accountants": 1,
  "management-consulting": 0,
  "real-estate-agencies": 1,
  "independent-insurance-brokers": 1,
  "marketing-design-agencies": 2,
  "software-development": 2,
  "custom-software-contract-dev": 2,
  "it-services-msps-small": 2,
  "web-mobile-dev-shops": 2,
  "engineering-architecture": 2,

  // Clinical practices: a small clinical team from day one, a clinician needs a
  // chair-side assistant and a front desk to open.
  "dental-practices": 3,
  "doctors-clinics": 4,
  "physical-therapy-clinics": 2,
  "chiropractic-clinics": 2,
  "optometry-vision-centers": 3,
  "veterinary-pet-care": 3,
  "mental-health-practices-small": 1,
  "nursing-elderly-care": 12,

  // Fitness, learning, leisure: a floor and a front desk, modest at the studio
  // end. Childcare is ratio-driven, so it staffs up fast.
  "sports-fitness": 3,
  "yoga-pilates-studios": 3,
  "personal-training": 0,
  "martial-arts-dojos": 2,
  "dance-studios": 2,
  "tutoring-centers": 1,
  "music-schools-private-lessons": 1,
  "driving-schools": 2,
  "photography-studios": 0,
  "childcare-social-services": 6,
  "daycare-preschool": 6,
  "pet-daycare-boarding": 3,

  // Lodging and laundry: a hotel runs the largest opening crew the site covers
  // (front desk, housekeeping, maintenance); a B&B and a laundry far fewer.
  "hotels-lodging": 20,
  "independent-hotels-inns": 12,
  "bed-breakfasts": 3,
  "dry-cleaning-laundry": 2,
};

/**
 * The modeled default first-hires count for any activity without a specific
 * entry above. A small starting crew: a hire or two beyond the owner. Keeps the
 * long tail on the same scale rather than dashing.
 */
export const FIRST_HIRES_DEFAULT_COUNT = 2;

/** Final sanity bounds on the first-hires figure. A solo open is zero; even a
 * staff-heavy open lands well inside this ceiling. */
const FIRST_HIRES_FLOOR_COUNT = 0;
const FIRST_HIRES_CEILING_COUNT = 50;

/**
 * A short, warm one-line role hint per activity: who the first hires actually
 * are. Plain language, no jargon, no em-dashes. Covers the keyed activities
 * above; the long tail falls back to the generic default hint below.
 */
const FIRST_HIRES_ROLE_HINT: Record<string, string> = {
  // Food and drink venues.
  restaurants: "kitchen plus service",
  "sit-down-restaurants": "kitchen plus service",
  "fast-casual-restaurants": "line cooks and counter",
  pizzerias: "oven and counter",
  "chicken-shops": "fryers and counter",
  "cafes-coffee-shops": "baristas and counter",
  "tea-houses-matcha-bars": "counter and prep",
  "bars-nightclubs": "bar and door",
  "pubs-taverns": "bar and floor",
  "wine-bars": "bar and floor",
  "bakeries-retail": "bakers and counter",
  "artisan-bakery-wholesale": "bakers and packing",
  "cake-shops-patisseries": "pastry and counter",
  "pastry-dessert-shops": "pastry and counter",
  "ice-cream-frozen-dessert-shops": "scoopers and counter",
  "food-trucks": "cook and window",
  "coffee-roasters": "roaster and packing",
  "breweries-taprooms-retail": "brewing and taproom",

  // Grooming and personal care.
  barbershops: "a second chair",
  "hairdressers-beauty": "stylists and a desk",
  "hair-salons-full-service": "stylists and a desk",
  "nail-salons": "technicians and a desk",
  "brow-lash-studios": "a technician and a desk",
  "day-spas": "therapists and a desk",
  "med-spas-small": "clinicians and a desk",
  "massage-therapy-clinics": "a therapist and a desk",
  "tanning-salons": "an attendant and a desk",
  "tattoo-piercing-studios": "an artist and a desk",

  // Retail.
  "grocery-stores": "floor and tills",
  "specialty-grocers-delis": "counter and floor",
  "wine-liquor-stores": "floor and till",
  "cosmetics-beauty-shops": "floor and till",
  "pharmacies-health-stores": "a pharmacist and counter",
  "independent-pharmacies": "a pharmacist and counter",
  "florist-shops": "an arranger and counter",
  "pet-stores": "floor and till",
  "hardware-stores-local": "floor and till",
  "clothing-boutiques": "floor and till",
  "clothing-shoe-stores": "floor and till",
  "jewelry-stores": "a sales pair",
  "furniture-stores": "floor and delivery",
  "book-retailing": "a bookseller pair",
  "eyewear-optical-retail": "an optician and a desk",
  "gas-stations": "shift attendants",

  // Trades and home services.
  electricians: "a couple of techs",
  plumbers: "a couple of techs",
  "hvac-services": "a couple of techs",
  roofers: "a roofing crew",
  "painters-residential": "a painting pair",
  "landscaping-lawn-care": "a grounds crew",
  "cleaning-services": "a cleaning crew",
  "residential-cleaning-services": "a cleaning crew",
  "cleaning-carpet-upholstery": "a two-person crew",
  "cleaning-building-industrial": "a night crew",
  "pest-control-local": "a treatment pair",
  locksmiths: "a second locksmith",
  "junk-removal-small-moving": "a hauling pair",
  "residential-construction": "a build crew",
  "commercial-construction": "a site crew and a foreman",
  "specialty-construction-services": "a trade crew",
  "auto-repair-shops": "a couple of mechanics",
  "auto-body-shops": "panel and paint",
  "automotive-electrical-services": "a couple of techs",
  "electronics-phone-repair": "a repair tech",

  // Professional services.
  "legal-services": "a paralegal",
  "sole-practitioner-law-firms": "a paralegal",
  "accounting-tax": "a bookkeeper",
  "sole-practitioner-accountants": "a bookkeeper",
  "management-consulting": "owner-run to start",
  "real-estate-agencies": "an agent or coordinator",
  "independent-insurance-brokers": "an account handler",
  "marketing-design-agencies": "a designer or two",
  "software-development": "a developer pair",
  "custom-software-contract-dev": "a developer pair",
  "it-services-msps-small": "support engineers",
  "web-mobile-dev-shops": "a developer pair",
  "engineering-architecture": "a drafter and an engineer",

  // Clinical practices.
  "dental-practices": "hygienist, assistant, front desk",
  "doctors-clinics": "nurse, assistant, front desk",
  "physical-therapy-clinics": "an aide and a desk",
  "chiropractic-clinics": "an assistant and a desk",
  "optometry-vision-centers": "an optician and a desk",
  "veterinary-pet-care": "a tech and a desk",
  "mental-health-practices-small": "a front desk",
  "nursing-elderly-care": "care and night staff",

  // Fitness, learning, leisure.
  "sports-fitness": "trainers and a desk",
  "yoga-pilates-studios": "instructors and a desk",
  "personal-training": "owner-run to start",
  "martial-arts-dojos": "an instructor and a desk",
  "dance-studios": "an instructor and a desk",
  "tutoring-centers": "a tutor",
  "music-schools-private-lessons": "an instructor",
  "driving-schools": "an instructor pair",
  "photography-studios": "owner-run to start",
  "childcare-social-services": "carers to ratio",
  "daycare-preschool": "carers to ratio",
  "pet-daycare-boarding": "handlers and a desk",

  // Lodging and laundry.
  "hotels-lodging": "front desk and housekeeping",
  "independent-hotels-inns": "front desk and housekeeping",
  "bed-breakfasts": "housekeeping and breakfast",
  "dry-cleaning-laundry": "pressers and counter",
};

/**
 * The generic role hint for any activity without a specific one above. Warm and
 * honest about the long tail: a small crew, shaped by the work.
 */
export const FIRST_HIRES_DEFAULT_ROLE_HINT = "a small starting crew";

/* ============================================================================
 * Place factor (shared with the entry-capital path, copied to keep this module
 * self-contained and free of cross-imports between the two modeled tables)
 * ========================================================================== */

/**
 * The place-multiplier band. The baseline archetype is index-100; a place's own
 * cost factor (its cost-of-living index over 100, or an economy proxy) multiplies
 * the place-adjusted figures, but only within this band, so the cheapest place
 * can never shrink a figure below 0.4x and the priciest can never inflate it past
 * 2.5x. The cap is the core guardrail against an absurd value.
 */
export const PLACE_FACTOR_MIN = 0.4;
export const PLACE_FACTOR_MAX = 2.5;

/**
 * Clamp a raw place cost factor into the allowed multiplier band. A non-finite
 * or non-positive factor collapses to 1.0 (the baseline, no adjustment) before
 * clamping, so a missing or junk input never moves a figure the wrong way.
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
 * PLACE_FACTOR_MAX]. Argument shape matches the entry-capital path's placeFactor
 * exactly, so the board can pass the same place inputs to both.
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

/* ============================================================================
 * Accessors
 * ========================================================================== */

/**
 * Modeled time to open for an activity URL slug, in weeks, or the moderate
 * default when no specific archetype is held. Place-invariant. Always a finite,
 * positive integer inside the weeks bounds, so the row stops dashing wherever we
 * can estimate it (everywhere) and never shows an absurd duration.
 */
export function timeToOpenWeeksForSlug(slug: string | null | undefined): number {
  const raw =
    (slug ? TIME_TO_OPEN_WEEKS[slug.toLowerCase()] : undefined) ??
    TIME_TO_OPEN_DEFAULT_WEEKS;
  return Math.round(
    Math.min(TIME_TO_OPEN_CEILING_WEEKS, Math.max(TIME_TO_OPEN_FLOOR_WEEKS, raw)),
  );
}

/**
 * Modeled time to open for an industry id (e.g. "restaurants", "cafes_coffee"),
 * resolving the id to its URL slug first so the cell board (which holds the id)
 * and the leaderboards (which hold the slug) reach the same table. Returns the
 * moderate default for an unknown id.
 */
export function timeToOpenWeeks(industryId: string | null | undefined): number {
  if (!industryId) return TIME_TO_OPEN_DEFAULT_WEEKS;
  return timeToOpenWeeksForSlug(industryToSlug(industryId));
}

/** Modeled baseline (index-100) permit cost for an activity URL slug, USD, or
 * the moderate default when no specific archetype is held. Pre-adjustment. */
export function permitsArchetypeForSlug(slug: string | null | undefined): number {
  return (
    (slug ? PERMITS_ARCHETYPE_USD[slug.toLowerCase()] : undefined) ??
    PERMITS_ARCHETYPE_DEFAULT_USD
  );
}

/** Modeled baseline (index-100) permit cost for an industry id, USD, resolving
 * the id to its slug first. Returns the moderate default for an unknown id. */
export function permitsArchetype(industryId: string | null | undefined): number {
  if (!industryId) return PERMITS_ARCHETYPE_DEFAULT_USD;
  return permitsArchetypeForSlug(industryToSlug(industryId));
}

/**
 * The MODELED, place-adjusted permits and licensing cost for an industry in a
 * place, USD. Takes the index-100 archetype for the industry, multiplies by the
 * place cost factor (already capped to the multiplier band), and bounds the
 * result to the final floor/ceiling as a second belt. Argument shape matches the
 * entry-capital path. Always a finite, positive figure, so the permits row never
 * dashes on a modeled value and never shows an absurd one.
 */
export function placeAdjustedPermitsUsd(input: {
  industryId: string | null | undefined;
  costOfLivingIndex?: number | null;
  avgYearlySalary?: number | null;
}): number {
  const base = permitsArchetype(input.industryId);
  const factor = placeFactor({
    costOfLivingIndex: input.costOfLivingIndex,
    avgYearlySalary: input.avgYearlySalary,
  });
  const adjusted = base * factor;
  return Math.min(PERMITS_CEILING_USD, Math.max(PERMITS_FLOOR_USD, adjusted));
}

/**
 * Modeled first-hires count for an activity URL slug, or the moderate default
 * when no specific archetype is held. Place-invariant. Always a finite, integer
 * count inside the bounds, so the row reads plausibly everywhere.
 */
export function firstHiresCountForSlug(slug: string | null | undefined): number {
  const raw =
    (slug ? FIRST_HIRES_COUNT[slug.toLowerCase()] : undefined) ??
    FIRST_HIRES_DEFAULT_COUNT;
  return Math.round(
    Math.min(FIRST_HIRES_CEILING_COUNT, Math.max(FIRST_HIRES_FLOOR_COUNT, raw)),
  );
}

/**
 * Modeled first-hires count for an industry id, resolving the id to its slug
 * first. Returns the moderate default for an unknown id.
 */
export function firstHiresCount(industryId: string | null | undefined): number {
  if (!industryId) return FIRST_HIRES_DEFAULT_COUNT;
  return firstHiresCountForSlug(industryToSlug(industryId));
}

/** Warm one-line role hint for an activity URL slug, or the generic default. */
export function firstHiresRoleHintForSlug(slug: string | null | undefined): string {
  return (
    (slug ? FIRST_HIRES_ROLE_HINT[slug.toLowerCase()] : undefined) ??
    FIRST_HIRES_DEFAULT_ROLE_HINT
  );
}

/**
 * Warm one-line role hint for an industry id, resolving the id to its slug
 * first. Returns the generic default for an unknown id.
 */
export function firstHiresRoleHint(industryId: string | null | undefined): string {
  if (!industryId) return FIRST_HIRES_DEFAULT_ROLE_HINT;
  return firstHiresRoleHintForSlug(industryToSlug(industryId));
}
