/**
 * Editorial voice layer.
 *
 * The "site feels like a dump" critique fix. Templated voice that
 * surfaces on cell pages, country pages, and the homepage. Each blurb
 * is one paragraph - calm, declarative, no marketing language.
 *
 * Selection logic: takes (industryId, countryIso2, sector_id) and
 * looks up the most specific blurb available. Falls back from
 * industry-specific → sector-by-continent → generic.
 */

type Blurb = string;

// Industry-level character notes. One per industry - these are the
// editorial "voice" of the site.
// Rewritten for the 18-year-old test. No "operating margins",
// no "capital intensity", no "EBITDA". One sentence each in plain English.
// What does this business actually look like for a normal owner?
const INDUSTRY_VOICE: Record<string, Blurb> = {
  restaurants: "Most restaurants barely break even. Rent, staff, and food eat almost everything. The ones that do well usually add a second thing on top of the meals: a bar, a catering side, or a steady takeaway flow.",
  coffee_shops: "A coffee shop lives or dies on foot traffic. The same shop a few minutes off the main street earns half as much. Strong shops sell more than coffee: beans, baked goods, light food, and gear.",
  hair_salons: "Most salons rent out chairs to independent stylists rather than employing them. It keeps costs flexible. The salons that pay the owner a real wage also sell shampoo, conditioner, and tools.",
  hotels_lodging: "Running a hotel is expensive: the building, the staff, and the slow months when no one books. The advertised revenue is much bigger than what the owner actually keeps. Boutique hotels do better than basic ones.",
  law_firms: "Small law firms are pure people-businesses. A handful of lawyers handle work for steady clients. Most of the money becomes the partners' pay, not the firm's profit.",
  software_dev_services: "Small software firms grow by hiring, and the profit per person drops as the team grows. The most profitable ones stay small, sell to a specific industry, and pick clients carefully.",
  construction_residential: "Construction looks bigger than it is: the headline price covers materials that get passed straight to the supplier. What the builder really keeps is the work on top. Bidding carefully matters more than anything else.",
  fitness_centers: "The old big-box gym at $20 a month is fading. The healthy operators today are small studios charging $100+ a month for yoga, Pilates, or CrossFit, where members know each other.",
  bakeries_pastries: "A bakery is two businesses at once: a kitchen that has to run cleanly, and a shop counter that depends on people walking by. Specialty bakeries (sourdough, gluten-free, ethnic) charge more and do better than generic ones.",
  plumbing_hvac: "Trades like plumbing and electrical have quietly become some of the best small businesses to run. Fewer young people are entering, so existing operators can raise prices. Steady service calls beat one-off installs.",
};

// Sector × continent voice - fallback when no industry-specific blurb exists.
const SECTOR_BY_CONTINENT: Record<string, Record<string, Blurb>> = {
  food_drink: {
    NA: "North American food service has been reshaped by delivery economics. Independent operators outside the top 50 metros have benefited from local-loyalty as customers rotate away from chain experiences.",
    EU: "European food culture sustains a denser small-operator economy than most regions. Margins are tight but failure rates are lower - landlords, regulations, and customer habits all favor incumbents.",
    Asia: "Asian food economies are bimodal: a vast number of micro-operators (street stalls, family restaurants) and a corporate tail of franchised concepts. The space between is thin.",
    SA: "South American food service runs on family operations. The numbers below capture the formal sector; informal operators add a multiple of activity that doesn't appear in any registry.",
    Africa: "African food service is dominated by informal operators. The benchmarks capture the formal-registered tier; the actual category is much larger.",
    MENA: "Middle Eastern food service skews toward larger, family-owned operations than other regions. The headline number per firm is often above global comparable cities.",
  },
  professional_services: {
    NA: "North American professional services run on billable-hour economics with a long tail of independent practitioners. The top quartile clears multiples of the median.",
    EU: "European professional services run more on relationship economics and salaried billing than the US. Hourly rates are lower; client retention is higher.",
    Asia: "Asian professional services are concentrated in tier-1 metros and dominated by either global firms or local incumbents. The independent middle is smaller than in other regions.",
    SA: "Latin American professional services are concentrated in capital cities. The independent tier is meaningful but the volume of activity sits with larger firms.",
    Africa: "African professional services concentrate heavily in the largest commercial centers. Outside those, the category is small and primarily local.",
    MENA: "Professional services in the Gulf states cluster around Dubai and Riyadh; in North Africa they concentrate in Cairo and Casablanca.",
  },
  retail_shops: {
    NA: "North American independent retail has consolidated since the pandemic. The survivors run tighter inventory and a meaningful online channel.",
    EU: "European independent retail has more institutional support than North American - protected rents in some cities, anchor-tenant programs in others. Margins are similar; survival is better.",
    Asia: "Asian retail is dense and diverse. Tier-1 cities run hot on premium concepts; tier-2 and tier-3 cities run on traditional general-merchandise stores.",
    SA: "South American retail combines a thin formal sector with very large informal markets. The benchmarks capture the formal tier.",
    Africa: "African retail is dominated by informal markets and small kiosks. Formal retail is a small but growing share of total commerce.",
    MENA: "Middle Eastern retail mixes mall-anchored formal retail with traditional souk economies. The split varies dramatically by country.",
  },
};

const GENERIC_FALLBACK = "Numbers in this band describe the typical small operator in the category. The spread is wide; the percentile bands show how the smallest 10% and largest 10% compare. Use the median as a sanity check, not a target.";

const COUNTRY_CONTINENT: Record<string, string> = {
  US: "NA", CA: "NA", MX: "NA",
  DE: "EU", FR: "EU", GB: "EU", IT: "EU", ES: "EU", NL: "EU", BE: "EU", PT: "EU", IE: "EU", AT: "EU", CH: "EU", SE: "EU", NO: "EU", DK: "EU", FI: "EU", IS: "EU", PL: "EU", CZ: "EU", HU: "EU", RO: "EU", BG: "EU", GR: "EU",
  JP: "Asia", CN: "Asia", KR: "Asia", TW: "Asia", HK: "Asia", SG: "Asia", MY: "Asia", TH: "Asia", ID: "Asia", PH: "Asia", VN: "Asia", IN: "Asia", BD: "Asia", PK: "Asia",
  BR: "SA", AR: "SA", CL: "SA", CO: "SA", PE: "SA", UY: "SA", VE: "SA",
  ZA: "Africa", NG: "Africa", KE: "Africa", ET: "Africa", GH: "Africa", TZ: "Africa", UG: "Africa", EG: "Africa", MA: "Africa", TN: "Africa", DZ: "Africa",
  AE: "MENA", SA: "MENA", QA: "MENA", KW: "MENA", BH: "MENA", OM: "MENA", IL: "MENA", JO: "MENA", LB: "MENA", IR: "MENA", IQ: "MENA", TR: "MENA",
  AU: "Asia", NZ: "Asia",
};

export function getEditorialBlurb(input: {
  industryId?: string | null;
  sectorId?: string | null;
  iso2?: string | null;
}): string {
  if (input.industryId && INDUSTRY_VOICE[input.industryId]) {
    return INDUSTRY_VOICE[input.industryId];
  }
  if (input.sectorId && input.iso2) {
    const continent = COUNTRY_CONTINENT[input.iso2.toUpperCase()];
    if (continent && SECTOR_BY_CONTINENT[input.sectorId]?.[continent]) {
      return SECTOR_BY_CONTINENT[input.sectorId][continent];
    }
  }
  return GENERIC_FALLBACK;
}
