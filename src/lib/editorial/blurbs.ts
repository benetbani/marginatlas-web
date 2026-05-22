/**
 * Plan v28 Lane D — editorial voice layer.
 *
 * The "site feels like a dump" critique fix. Templated voice that
 * surfaces on cell pages, country pages, and the homepage. Each blurb
 * is one paragraph — calm, declarative, no marketing language.
 *
 * Selection logic: takes (industryId, countryIso2, sector_id) and
 * looks up the most specific blurb available. Falls back from
 * industry-specific → sector-by-continent → generic.
 */

type Blurb = string;

// Industry-level character notes. One per industry — these are the
// editorial "voice" of the site.
const INDUSTRY_VOICE: Record<string, Blurb> = {
  restaurants: "Restaurants run thin. The middle firm in this category clears low single-digit margins after rent, labor, and food cost; the operators who do well are usually the ones who pay attention to a third revenue line beyond the table — bar, catering, or a tight delivery channel.",
  coffee_shops: "Coffee economics live or die on traffic density. The same cup of coffee in a high-foot-traffic location can support a healthy business; a hundred meters off the main street it can't. The healthiest independent coffee shops layer retail attachment (bags, equipment, light food) on top of the cup.",
  hair_salons: "Salons run a chair-rental model more often than a payroll model — it keeps the owner's cost variable and the operators independent. Retail product attachment is the line that separates a salon that pays the rent from one that pays its owner a real wage.",
  hotels_lodging: "Hospitality is a capital-heavy business with thin operating margins. The headline revenue is usually larger than the operator takes home; financing terms and seasonality drive the bottom line more than nightly rate. Boutique formats outperform commodity ones.",
  law_firms: "Small law firms run on partner leverage and practice mix. Transactional and litigation books look different at the same revenue level. Owner draw is typically a larger share of revenue than in any other professional service.",
  software_dev_services: "Small software shops scale on people, not product. Margins compress as headcount grows; the highest-margin engagements are usually senior solo operators or 3-5 person teams with a tight specialty.",
  construction_residential: "Residential construction lives on bid discipline and cash flow. The headline revenue includes pass-through materials cost; the operator's real margin is what's left on labor and overhead. Cost-plus contracts protect margin; fixed-price contracts test it.",
  fitness_centers: "Boutique formats have eaten into the traditional gym category. The healthiest independent operators charge $80-180 per month per member, not $20-30, and run smaller spaces with denser member relationships.",
  bakeries_pastries: "A retail bakery is a hybrid: kitchen discipline behind the counter, foot-traffic economics in front of it. Specialty positioning (sourdough, gluten-free, ethnic) supports the price points the commodity bakery cannot.",
  plumbing_hvac: "The trades have been quietly the strongest small business category of the last decade. Pricing power has tilted to operators because fewer licensed tradespeople are entering than retiring. Service work outperforms new-construction installation.",
};

// Sector × continent voice — fallback when no industry-specific blurb exists.
const SECTOR_BY_CONTINENT: Record<string, Record<string, Blurb>> = {
  food_drink: {
    NA: "North American food service has been reshaped by delivery economics. Independent operators outside the top 50 metros have benefited from local-loyalty as customers rotate away from chain experiences.",
    EU: "European food culture sustains a denser small-operator economy than most regions. Margins are tight but failure rates are lower — landlords, regulations, and customer habits all favor incumbents.",
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
    EU: "European independent retail has more institutional support than North American — protected rents in some cities, anchor-tenant programs in others. Margins are similar; survival is better.",
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
