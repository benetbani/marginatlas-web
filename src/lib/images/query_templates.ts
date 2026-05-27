/**
 * Country-industry image query templates.
 *
 * For each (country, industry) we have a search query that pulls back
 * AUTHENTIC photos. Generic "restaurant" queries return Italian pasta
 * shots regardless of country. We need country-specific cuisine,
 * architecture, signage, business types to come through.
 *
 * Templates resolve in priority order:
 *   1. Per-(country, industry) explicit override (most specific)
 *   2. Per-country broad theme for that industry's sector
 *   3. Per-industry generic fallback
 *   4. Bare industry name (last resort)
 *
 * Each template returns 2-5 alternate query strings. The image search
 * pipeline tries each in order until it finds a usable photo.
 */

export type ImageQuery = {
  /** OR-joined search terms used by Pexels / Wikimedia. */
  query: string;
  /** Keywords scored against returned image descriptions; higher score wins. */
  matchTerms: string[];
};

/** (iso2, industry_id) → query templates. */
const COUNTRY_INDUSTRY_OVERRIDES: Record<string, ImageQuery[]> = {
  // Japan
  "JP|restaurants": [
    { query: "izakaya tokyo interior", matchTerms: ["izakaya", "tokyo", "japanese", "lanterns"] },
    { query: "sushi restaurant counter japan", matchTerms: ["sushi", "japan", "counter", "chef"] },
    { query: "ramen shop japan", matchTerms: ["ramen", "noodle", "japan"] },
  ],
  "JP|cafes_coffee_shops": [
    { query: "kissaten japan", matchTerms: ["kissaten", "japan", "cafe"] },
    { query: "tokyo coffee shop", matchTerms: ["tokyo", "coffee", "modern"] },
  ],
  "JP|bakeries_pastries": [
    { query: "japanese bakery", matchTerms: ["japan", "bakery", "melon pan", "anpan"] },
  ],
  "JP|hotels_lodging": [
    { query: "ryokan japan interior", matchTerms: ["ryokan", "japan", "tatami"] },
  ],
  // Italy
  "IT|restaurants": [
    { query: "trattoria italy interior", matchTerms: ["trattoria", "italy", "italian"] },
    { query: "osteria italian restaurant", matchTerms: ["osteria", "italy"] },
    { query: "pizzeria napoli", matchTerms: ["pizzeria", "italy", "napoli"] },
  ],
  "IT|cafes_coffee_shops": [
    { query: "italian espresso bar", matchTerms: ["italy", "espresso", "bar", "rome"] },
  ],
  "IT|bakeries_pastries": [
    { query: "pasticceria italy", matchTerms: ["pasticceria", "italy", "italian"] },
  ],
  "IT|clothing_stores": [
    { query: "milan boutique shop", matchTerms: ["milan", "italy", "boutique", "fashion"] },
  ],
  "IT|jewelry_stores": [
    { query: "italian goldsmith jewelry", matchTerms: ["italy", "jewelry", "goldsmith"] },
  ],
  // Mexico
  "MX|restaurants": [
    { query: "taqueria mexico", matchTerms: ["taqueria", "mexico", "mexican"] },
    { query: "cantina mexican restaurant", matchTerms: ["cantina", "mexico"] },
  ],
  "MX|hotels_lodging": [
    { query: "cancun resort beach", matchTerms: ["cancun", "mexico", "beach", "resort"] },
  ],
  // France
  "FR|restaurants": [
    { query: "paris bistro interior", matchTerms: ["bistro", "paris", "france"] },
    { query: "french brasserie", matchTerms: ["brasserie", "france", "french"] },
  ],
  "FR|bakeries_pastries": [
    { query: "boulangerie paris", matchTerms: ["boulangerie", "paris", "france", "baguette"] },
    { query: "patisserie france", matchTerms: ["patisserie", "france", "macarons"] },
  ],
  "FR|cafes_coffee_shops": [
    { query: "paris cafe terrace", matchTerms: ["paris", "france", "cafe", "terrace"] },
  ],
  "FR|jewelry_stores": [
    { query: "place vendome jewelry", matchTerms: ["france", "paris", "jewelry"] },
  ],
  // Germany
  "DE|restaurants": [
    { query: "german beer garden", matchTerms: ["germany", "biergarten", "munich"] },
    { query: "berlin restaurant", matchTerms: ["berlin", "germany"] },
  ],
  "DE|fabricated_metal_mfg": [
    { query: "german metal workshop precision", matchTerms: ["germany", "metal", "workshop", "factory", "precision"] },
    { query: "mittelstand manufacturing", matchTerms: ["germany", "manufacturing", "mittelstand"] },
  ],
  "DE|machinery_mfg": [
    { query: "german industrial machinery", matchTerms: ["germany", "machinery", "industrial", "engineering"] },
  ],
  "DE|bakeries_pastries": [
    { query: "german bakery brot", matchTerms: ["germany", "bakery", "brot", "bread"] },
  ],
  // Spain
  "ES|restaurants": [
    { query: "barcelona tapas bar", matchTerms: ["barcelona", "spain", "tapas"] },
    { query: "madrid restaurant terrace", matchTerms: ["madrid", "spain", "terrace"] },
  ],
  "ES|cafes_coffee_shops": [
    { query: "madrid cafeteria", matchTerms: ["madrid", "spain", "cafe"] },
  ],
  "ES|hotels_lodging": [
    { query: "spanish parador hotel", matchTerms: ["spain", "parador", "hotel"] },
  ],
  // UK
  "GB|restaurants": [
    { query: "london gastropub", matchTerms: ["london", "gastropub", "uk"] },
  ],
  "GB|cafes_coffee_shops": [
    { query: "london coffee shop modern", matchTerms: ["london", "coffee", "uk"] },
  ],
  "GB|legal_services": [
    { query: "london barristers chambers", matchTerms: ["london", "legal", "barrister", "uk"] },
  ],
  // US
  "US|restaurants": [
    { query: "new york diner interior", matchTerms: ["new york", "diner", "usa"] },
  ],
  "US|software_development": [
    { query: "san francisco startup office", matchTerms: ["san francisco", "tech", "startup", "office"] },
  ],
  "US|sports_fitness": [
    { query: "los angeles gym fitness", matchTerms: ["los angeles", "gym", "fitness"] },
  ],
  // Brazil
  "BR|restaurants": [
    { query: "rio de janeiro restaurant", matchTerms: ["brazil", "rio", "sao paulo"] },
    { query: "brazilian churrascaria", matchTerms: ["brazil", "churrascaria"] },
  ],
  // India
  "IN|restaurants": [
    { query: "mumbai street food restaurant", matchTerms: ["india", "mumbai", "indian"] },
  ],
  "IN|software_development": [
    { query: "bangalore tech office", matchTerms: ["bangalore", "india", "tech"] },
  ],
  // China
  "CN|restaurants": [
    { query: "shanghai restaurant traditional", matchTerms: ["shanghai", "china", "chinese"] },
  ],
  // Korea
  "KR|restaurants": [
    { query: "korean bbq restaurant seoul", matchTerms: ["korea", "seoul", "korean"] },
  ],
  "KR|cafes_coffee_shops": [
    { query: "seoul cafe modern", matchTerms: ["seoul", "korea", "cafe"] },
  ],
  // Turkey
  "TR|restaurants": [
    { query: "istanbul restaurant traditional", matchTerms: ["istanbul", "turkey", "turkish"] },
  ],
  "TR|cafes_coffee_shops": [
    { query: "turkish coffee house istanbul", matchTerms: ["turkey", "istanbul", "coffee"] },
  ],
};

/** Per-country broad theme for any industry not specifically mapped. */
const COUNTRY_THEMES: Record<string, string[]> = {
  US: ["united states", "american"],
  GB: ["united kingdom", "british", "london"],
  DE: ["germany", "german"],
  FR: ["france", "french"],
  IT: ["italy", "italian"],
  ES: ["spain", "spanish"],
  PT: ["portugal", "portuguese"],
  JP: ["japan", "japanese"],
  KR: ["korea", "korean"],
  CN: ["china", "chinese"],
  IN: ["india", "indian"],
  BR: ["brazil", "brazilian"],
  MX: ["mexico", "mexican"],
  AR: ["argentina"],
  CA: ["canada"],
  AU: ["australia"],
  TR: ["turkey", "turkish"],
  GR: ["greece", "greek"],
  PL: ["poland", "polish"],
  NL: ["netherlands", "dutch"],
  SE: ["sweden", "swedish"],
  NO: ["norway"],
  DK: ["denmark"],
  FI: ["finland"],
  CH: ["switzerland", "swiss"],
  AT: ["austria"],
  BE: ["belgium"],
  IE: ["ireland", "irish"],
  IL: ["israel"],
  AE: ["united arab emirates", "dubai"],
  EG: ["egypt"],
  ZA: ["south africa"],
  NG: ["nigeria"],
  KE: ["kenya"],
  MA: ["morocco"],
  TH: ["thailand", "thai"],
  VN: ["vietnam"],
  ID: ["indonesia"],
  PH: ["philippines"],
  MY: ["malaysia"],
  SG: ["singapore"],
  RU: ["russia"],
};

/** Per-industry generic fallback (used when country override is missing). */
const INDUSTRY_GENERIC: Record<string, string[]> = {
  restaurants: ["restaurant interior dining"],
  cafes_coffee_shops: ["coffee shop cafe interior"],
  bakeries_pastries: ["bakery bread fresh"],
  bars_pubs_clubs: ["bar pub interior"],
  hotels_lodging: ["boutique hotel lobby"],
  grocery_stores: ["grocery store fresh produce"],
  clothing_stores: ["clothing boutique shop"],
  jewelry_stores: ["jewelry store display"],
  hairdressers_beauty: ["hair salon interior"],
  hair_salons: ["hair salon interior"],
  nail_salons: ["nail salon manicure"],
  barbershops: ["barbershop vintage"],
  fitness_gyms: ["modern gym fitness equipment"],
  sports_fitness: ["gym fitness training"],
  legal_services: ["law firm office books"],
  management_consulting: ["consultants meeting office"],
  accounting_bookkeeping: ["accountant office desk"],
  software_development: ["software developer working laptop"],
  custom_software_contract: ["developers coding screens"],
  web_mobile_dev_shops: ["web design office team"],
  real_estate_agencies: ["real estate office property"],
  residential_construction: ["construction site house framing"],
  fabricated_metal_mfg: ["metal workshop welding"],
  primary_metal_mfg: ["steel factory industrial"],
  machinery_mfg: ["industrial machinery factory"],
  auto_repair_shops: ["auto repair shop mechanic"],
  motor_vehicles_mfg: ["car assembly factory"],
  doctors_clinics: ["doctor clinic office"],
  dental_practices: ["dental clinic chair"],
  veterinary_pet_care: ["veterinarian clinic dog"],
  pet_services: ["dog grooming pet store"],
  cleaning_services: ["cleaning service team"],
  freight_trucking: ["truck logistics highway"],
  food_mfg: ["food manufacturing factory"],
  beverage_mfg: ["beverage bottling line"],
  craft_beer_mfg: ["craft brewery tanks"],
  print_publishing: ["printing press workshop"],
  photography_studios: ["photography studio camera"],
  furniture_home_stores: ["furniture showroom"],
  health_beauty_stores: ["cosmetics shop"],
  pharmacies: ["pharmacy shelves"],
  chemical_pharma_mfg: ["pharmaceutical laboratory"],
  education_instruction: ["classroom education teacher"],
  transit_ground_passenger: ["city bus public transit"],
  florists: ["florist shop bouquet"],
  vegetable_fruit_farming: ["vegetable farm field"],
  grain_farming: ["wheat farm harvest"],
  livestock_farming: ["cattle ranch livestock"],
  forestry_logging: ["forestry logging trees"],
  fishing_aquaculture: ["fishing boat aquaculture"],
  hospitals: ["hospital corridor modern"],
  events_planning: ["wedding event venue"],
};

/**
 * Resolve a (iso2, industry_id) to an ordered list of search queries.
 * Most specific match first.
 */
export function resolveQueries(iso2: string, industryId: string): ImageQuery[] {
  const key = `${iso2.toUpperCase()}|${industryId}`;
  const direct = COUNTRY_INDUSTRY_OVERRIDES[key];
  if (direct) return direct;

  const countryTerms = COUNTRY_THEMES[iso2.toUpperCase()] || [iso2];
  const industryTerms = INDUSTRY_GENERIC[industryId] || [industryId.replace(/_/g, " ")];

  const out: ImageQuery[] = [];
  for (const ind of industryTerms) {
    for (const country of countryTerms) {
      out.push({
        query: `${country} ${ind}`,
        matchTerms: [...countryTerms, ...ind.split(" ")],
      });
    }
  }
  // Final generic fallback
  out.push({
    query: industryTerms[0] || industryId.replace(/_/g, " "),
    matchTerms: industryTerms[0]?.split(" ") || [],
  });
  return out;
}
