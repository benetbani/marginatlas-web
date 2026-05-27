/**
 * Manual supplement for friendly city aliases.
 *
 * Founder reported `/de/frankfurt/...` rendering "How much does a
 * restaurant make in Hessen?" — Frankfurt was missing from the auto-
 * generated alias map and falling back to the NUTS-1 Hessen region.
 *
 * Targets the finest geographic granularity actually present in
 * `regional_cells` per country. Block 4.4 probe found:
 *
 *   - DE / FR / IT / BE / PL / PT / SE / DK / NO / FI / CZ / HU / RO / IE:
 *     only NUTS-2 codes are stored. NUTS-3 doesn't exist yet.
 *   - GB: LAD codes (GB-E0XXXXXXX format).
 *   - ES: province codes (ES-XX format).
 *   - NL: municipality codes (NL-GMXXXX format).
 *   - CH / AT / TR / RU: city-overlay codes (CH-CITY-zurich format).
 *   - GR: no rows yet. Aliases dropped.
 *
 * Loaded in src/lib/cells.ts on top of CITY_FRIENDLY_TO_GEO_ID and
 * CITY_FRIENDLY_DISPLAY_LABEL. Manual entries take precedence over the
 * auto-generated ones, so /de/frankfurt resolves to DE71 (Darmstadt
 * NUTS-2 — the smallest region the data covers, which contains
 * Frankfurt am Main) and the hero displays "Frankfurt am Main".
 *
 * Future plan: when NUTS-3 or LAU-2 data lands, retarget the
 * appropriate aliases (e.g. frankfurt → DE712).
 */

export type ManualCityAlias = {
  slug: string;
  geo_id: string;
  label: string;
};

/** country (ISO-2 upper) → list of manual aliases. */
export const MANUAL_CITY_ALIASES: Record<string, ManualCityAlias[]> = {
  // Germany — NUTS-2 codes (smallest region with data; contains the city)
  DE: [
    { slug: "frankfurt", geo_id: "de71", label: "Frankfurt am Main" },
    { slug: "hamburg", geo_id: "de60", label: "Hamburg" },
    { slug: "cologne", geo_id: "dea2", label: "Cologne" },
    { slug: "stuttgart", geo_id: "de11", label: "Stuttgart" },
    { slug: "dusseldorf", geo_id: "dea1", label: "Düsseldorf" },
    { slug: "dresden", geo_id: "ded2", label: "Dresden" },
    { slug: "leipzig", geo_id: "ded5", label: "Leipzig" },
    { slug: "hanover", geo_id: "de92", label: "Hanover" },
    { slug: "bremen", geo_id: "de50", label: "Bremen" },
    { slug: "nuremberg", geo_id: "de25", label: "Nuremberg" },
    { slug: "essen", geo_id: "dea1", label: "Essen" },
    { slug: "dortmund", geo_id: "dea5", label: "Dortmund" },
    { slug: "berlin", geo_id: "de30", label: "Berlin" },
    { slug: "munich", geo_id: "de21", label: "Munich" },
  ],
  // France — NUTS-2 codes
  FR: [
    { slug: "paris", geo_id: "fr10", label: "Paris" },
    { slug: "lyon", geo_id: "frk2", label: "Lyon" },
    { slug: "marseille", geo_id: "frl0", label: "Marseille" },
    { slug: "toulouse", geo_id: "frj2", label: "Toulouse" },
    { slug: "nice", geo_id: "frl0", label: "Nice" },
    { slug: "nantes", geo_id: "frg0", label: "Nantes" },
    { slug: "strasbourg", geo_id: "frf1", label: "Strasbourg" },
    { slug: "bordeaux", geo_id: "fri1", label: "Bordeaux" },
    { slug: "lille", geo_id: "fre1", label: "Lille" },
    { slug: "rennes", geo_id: "frh0", label: "Rennes" },
    { slug: "montpellier", geo_id: "frj1", label: "Montpellier" },
  ],
  // United Kingdom — LAD codes (city-level)
  GB: [
    { slug: "london", geo_id: "gb-e09000001", label: "London" },
    { slug: "birmingham", geo_id: "gb-e08000025", label: "Birmingham" },
    { slug: "manchester", geo_id: "gb-e08000003", label: "Manchester" },
    { slug: "liverpool", geo_id: "gb-e08000012", label: "Liverpool" },
    { slug: "leeds", geo_id: "gb-e08000035", label: "Leeds" },
    { slug: "sheffield", geo_id: "gb-e08000019", label: "Sheffield" },
    { slug: "newcastle", geo_id: "gb-e08000021", label: "Newcastle upon Tyne" },
    { slug: "cardiff", geo_id: "ukl22", label: "Cardiff" },
    { slug: "belfast", geo_id: "ukn0", label: "Belfast" },
    { slug: "bristol", geo_id: "ukk1", label: "Bristol" },
    { slug: "glasgow", geo_id: "ukm8", label: "Glasgow" },
  ],
  // Italy — NUTS-2 codes
  IT: [
    { slug: "rome", geo_id: "iti4", label: "Rome" },
    { slug: "milan", geo_id: "itc4", label: "Milan" },
    { slug: "naples", geo_id: "itf3", label: "Naples" },
    { slug: "turin", geo_id: "itc1", label: "Turin" },
    { slug: "palermo", geo_id: "itg1", label: "Palermo" },
    { slug: "genoa", geo_id: "itc3", label: "Genoa" },
    { slug: "bologna", geo_id: "ith5", label: "Bologna" },
    { slug: "florence", geo_id: "iti1", label: "Florence" },
    { slug: "venice", geo_id: "ith3", label: "Venice" },
  ],
  // Spain — province codes (finer than NUTS-2)
  ES: [
    { slug: "madrid", geo_id: "es-28", label: "Madrid" },
    { slug: "barcelona", geo_id: "es-08", label: "Barcelona" },
    { slug: "valencia", geo_id: "es-46", label: "Valencia" },
    { slug: "seville", geo_id: "es-41", label: "Seville" },
    { slug: "zaragoza", geo_id: "es-50", label: "Zaragoza" },
    { slug: "malaga", geo_id: "es-29", label: "Málaga" },
    { slug: "bilbao", geo_id: "es-48", label: "Bilbao" },
    { slug: "alicante", geo_id: "es-03", label: "Alicante" },
  ],
  // Netherlands — municipality codes
  NL: [
    { slug: "amsterdam", geo_id: "nl-gm0363", label: "Amsterdam" },
    { slug: "rotterdam", geo_id: "nl-gm0599", label: "Rotterdam" },
    { slug: "the-hague", geo_id: "nl-gm0518", label: "The Hague" },
    { slug: "utrecht", geo_id: "nl-gm0344", label: "Utrecht" },
    { slug: "eindhoven", geo_id: "nl-gm0772", label: "Eindhoven" },
  ],
  // Belgium — NUTS-2 codes
  BE: [
    { slug: "brussels", geo_id: "be10", label: "Brussels" },
    { slug: "antwerp", geo_id: "be21", label: "Antwerp" },
    { slug: "ghent", geo_id: "be23", label: "Ghent" },
  ],
  // Switzerland — city-overlay codes
  CH: [
    { slug: "zurich", geo_id: "ch-city-zurich", label: "Zurich" },
    { slug: "geneva", geo_id: "ch-city-geneva", label: "Geneva" },
    { slug: "basel", geo_id: "ch-city-basel", label: "Basel" },
    { slug: "bern", geo_id: "ch-city-bern", label: "Bern" },
    { slug: "lausanne", geo_id: "ch-city-lausanne", label: "Lausanne" },
  ],
  // Austria — city-overlay codes
  AT: [
    { slug: "vienna", geo_id: "at-city-vienna", label: "Vienna" },
    { slug: "graz", geo_id: "at-city-graz", label: "Graz" },
    { slug: "salzburg", geo_id: "at-city-salzburg", label: "Salzburg" },
    { slug: "linz", geo_id: "at-city-linz", label: "Linz" },
  ],
  // Poland — NUTS-2 codes
  PL: [
    { slug: "warsaw", geo_id: "pl91", label: "Warsaw" },
    { slug: "krakow", geo_id: "pl21", label: "Kraków" },
    { slug: "wroclaw", geo_id: "pl51", label: "Wrocław" },
    { slug: "gdansk", geo_id: "pl63", label: "Gdańsk" },
    { slug: "poznan", geo_id: "pl41", label: "Poznań" },
  ],
  // Portugal — NUTS-2 codes
  PT: [
    { slug: "lisbon", geo_id: "pt17", label: "Lisbon" },
    { slug: "porto", geo_id: "pt11", label: "Porto" },
  ],
  // Sweden — NUTS-2 codes
  SE: [
    { slug: "stockholm", geo_id: "se11", label: "Stockholm" },
    { slug: "gothenburg", geo_id: "se23", label: "Gothenburg" },
    { slug: "malmo", geo_id: "se22", label: "Malmö" },
  ],
  // Denmark — NUTS-2 codes
  DK: [
    { slug: "copenhagen", geo_id: "dk01", label: "Copenhagen" },
    { slug: "aarhus", geo_id: "dk04", label: "Aarhus" },
  ],
  // Norway — NUTS-2 codes
  NO: [
    { slug: "oslo", geo_id: "no08", label: "Oslo" },
    { slug: "bergen", geo_id: "no0a", label: "Bergen" },
  ],
  // Finland — NUTS-2 codes
  FI: [
    { slug: "helsinki", geo_id: "fi1b", label: "Helsinki" },
  ],
  // Czech Republic — NUTS-2 codes
  CZ: [
    { slug: "prague", geo_id: "cz01", label: "Prague" },
    { slug: "brno", geo_id: "cz06", label: "Brno" },
  ],
  // Hungary — NUTS-2 codes
  HU: [
    { slug: "budapest", geo_id: "hu11", label: "Budapest" },
  ],
  // Romania — NUTS-2 codes
  RO: [
    { slug: "bucharest", geo_id: "ro32", label: "Bucharest" },
  ],
  // Turkey — city-overlay codes
  TR: [
    { slug: "istanbul", geo_id: "tr-city-istanbul", label: "Istanbul" },
    { slug: "ankara", geo_id: "tr-city-ankara", label: "Ankara" },
    { slug: "izmir", geo_id: "tr-city-izmir", label: "İzmir" },
  ],
  // Russia — city-overlay codes
  RU: [
    { slug: "moscow", geo_id: "ru-city-moscow", label: "Moscow" },
    { slug: "saint-petersburg", geo_id: "ru-city-saint-petersburg", label: "Saint Petersburg" },
  ],
  // Ireland — NUTS-2 codes
  IE: [
    { slug: "dublin", geo_id: "ie06", label: "Dublin" },
  ],
  // United States — county FIPS for top metros the auto-generated map
  // missed. Lyon-class scan 2026-05-26: these tier-2 cities were
  // falling through alias chain to upper-cased slugs, rendering
  // synthesized country-level data labeled as the city. Each maps to
  // the principal county containing the city (or the independent city
  // FIPS where applicable).
  US: [
    { slug: "baltimore", geo_id: "us-24-510", label: "Baltimore" },
    { slug: "buffalo", geo_id: "us-36-029", label: "Buffalo" },
    { slug: "charlotte", geo_id: "us-37-119", label: "Charlotte" },
    { slug: "cincinnati", geo_id: "us-39-061", label: "Cincinnati" },
    { slug: "cleveland", geo_id: "us-39-035", label: "Cleveland" },
    { slug: "columbus", geo_id: "us-39-049", label: "Columbus" },
    { slug: "indianapolis", geo_id: "us-18-097", label: "Indianapolis" },
    { slug: "kansas-city", geo_id: "us-29-095", label: "Kansas City" },
    { slug: "milwaukee", geo_id: "us-55-079", label: "Milwaukee" },
    { slug: "nashville", geo_id: "us-47-037", label: "Nashville" },
    { slug: "oklahoma-city", geo_id: "us-40-109", label: "Oklahoma City" },
    { slug: "pittsburgh", geo_id: "us-42-003", label: "Pittsburgh" },
    { slug: "raleigh", geo_id: "us-37-183", label: "Raleigh" },
    { slug: "richmond", geo_id: "us-51-760", label: "Richmond" },
    { slug: "sacramento", geo_id: "us-06-067", label: "Sacramento" },
    { slug: "salt-lake-city", geo_id: "us-49-035", label: "Salt Lake City" },
    { slug: "san-diego", geo_id: "us-06-073", label: "San Diego" },
    { slug: "san-jose", geo_id: "us-06-085", label: "San Jose" },
    { slug: "st-louis", geo_id: "us-29-510", label: "St. Louis" },
    { slug: "memphis", geo_id: "us-47-157", label: "Memphis" },
    { slug: "louisville", geo_id: "us-21-111", label: "Louisville" },
    { slug: "new-orleans", geo_id: "us-22-071", label: "New Orleans" },
    // Tier-3 metros — county FIPS
    { slug: "detroit", geo_id: "us-26-163", label: "Detroit" },
    { slug: "honolulu", geo_id: "us-15-003", label: "Honolulu" },
    { slug: "las-vegas", geo_id: "us-32-003", label: "Las Vegas" },
    { slug: "minneapolis", geo_id: "us-27-053", label: "Minneapolis" },
    { slug: "orlando", geo_id: "us-12-095", label: "Orlando" },
    { slug: "san-antonio", geo_id: "us-48-029", label: "San Antonio" },
    { slug: "tampa", geo_id: "us-12-057", label: "Tampa" },
  ],
  // Brazil — state codes (BR-XX)
  BR: [
    { slug: "sao-paulo", geo_id: "br-sp", label: "São Paulo" },
    { slug: "rio-de-janeiro", geo_id: "br-rj", label: "Rio de Janeiro" },
    { slug: "brasilia", geo_id: "br-df", label: "Brasília" },
    { slug: "belo-horizonte", geo_id: "br-mg", label: "Belo Horizonte" },
    { slug: "salvador", geo_id: "br-ba", label: "Salvador" },
    { slug: "fortaleza", geo_id: "br-ce", label: "Fortaleza" },
    { slug: "porto-alegre", geo_id: "br-rs", label: "Porto Alegre" },
  ],
  // Colombia — department codes (CO-XX)
  CO: [
    { slug: "bogota", geo_id: "co-dc", label: "Bogotá" },
    { slug: "medellin", geo_id: "co-ant", label: "Medellín" },
    { slug: "cali", geo_id: "co-vac", label: "Cali" },
  ],
  // Japan — prefecture codes for cities the auto map missed
  JP: [
    { slug: "nagoya", geo_id: "jp-23", label: "Nagoya" },
    { slug: "sapporo", geo_id: "jp-01", label: "Sapporo" },
    { slug: "fukuoka", geo_id: "jp-40", label: "Fukuoka" },
    { slug: "hiroshima", geo_id: "jp-34", label: "Hiroshima" },
    { slug: "sendai", geo_id: "jp-04", label: "Sendai" },
    { slug: "kobe", geo_id: "jp-28", label: "Kobe" },
  ],
  // Australia — state/territory codes (AU-XXX)
  AU: [
    { slug: "perth", geo_id: "au-wa", label: "Perth" },
    { slug: "adelaide", geo_id: "au-sa", label: "Adelaide" },
    { slug: "canberra", geo_id: "au-act", label: "Canberra" },
    { slug: "brisbane", geo_id: "au-qld", label: "Brisbane" },
  ],
  // Country-level fallback for capitals without sub-national data.
  // Better than the upper-cased slug pretending to be a region.
  IQ: [
    { slug: "baghdad", geo_id: "iq", label: "Baghdad" },
  ],
  AR: [
    { slug: "buenos-aires", geo_id: "ar-c", label: "Buenos Aires" },
    { slug: "cordoba", geo_id: "ar-x", label: "Córdoba" },
  ],
  SI: [
    { slug: "ljubljana", geo_id: "si", label: "Ljubljana" },
  ],
  CY: [
    { slug: "nicosia", geo_id: "cy", label: "Nicosia" },
  ],
  KH: [
    { slug: "phnom-penh", geo_id: "kh", label: "Phnom Penh" },
  ],
  NP: [
    { slug: "kathmandu", geo_id: "np", label: "Kathmandu" },
  ],
  TW: [
    { slug: "taipei", geo_id: "tw", label: "Taipei" },
    { slug: "kaohsiung", geo_id: "tw", label: "Kaohsiung" },
  ],
  SK: [
    { slug: "bratislava", geo_id: "sk", label: "Bratislava" },
  ],
  MD: [
    { slug: "chisinau", geo_id: "md", label: "Chișinău" },
  ],
  XK: [
    { slug: "pristina", geo_id: "xk", label: "Pristina" },
  ],
  ME: [
    { slug: "podgorica", geo_id: "me", label: "Podgorica" },
  ],
  RS: [
    { slug: "belgrade", geo_id: "rs", label: "Belgrade" },
  ],
  // Other tier-3 city capitals + secondary cities — country-level fallback.
  MK: [{ slug: "skopje", geo_id: "mk", label: "Skopje" }],
  BG: [{ slug: "sofia", geo_id: "bg", label: "Sofia" }],
  HR: [{ slug: "zagreb", geo_id: "hr", label: "Zagreb" }],
  BA: [{ slug: "sarajevo", geo_id: "ba", label: "Sarajevo" }],
  IS: [{ slug: "reykjavik", geo_id: "is", label: "Reykjavik" }],
  EE: [{ slug: "tallinn", geo_id: "ee", label: "Tallinn" }],
  LV: [{ slug: "riga", geo_id: "lv", label: "Riga" }],
  LT: [{ slug: "vilnius", geo_id: "lt", label: "Vilnius" }],
  MT: [{ slug: "valletta", geo_id: "mt", label: "Valletta" }],
  MN: [{ slug: "ulaanbaatar", geo_id: "mn", label: "Ulaanbaatar" }],
  LA: [{ slug: "vientiane", geo_id: "la", label: "Vientiane" }],
  MM: [{ slug: "yangon", geo_id: "mm", label: "Yangon" }],
  CR: [{ slug: "san-jose-cr", geo_id: "cr", label: "San José" }],
  CL: [{ slug: "valparaiso", geo_id: "cl", label: "Valparaíso" }],
  // China — province codes (was: 0 aliases in original file)
  CN: [
    { slug: "wuhan", geo_id: "cn-42", label: "Wuhan" },
    { slug: "xian", geo_id: "cn-61", label: "Xi'an" },
    { slug: "nanjing", geo_id: "cn-32", label: "Nanjing" },
    { slug: "dongguan", geo_id: "cn-44", label: "Dongguan" },
  ],
  // India — state codes
  IN: [
    { slug: "hyderabad", geo_id: "in-tg", label: "Hyderabad" },
    { slug: "ahmedabad", geo_id: "in-gj", label: "Ahmedabad" },
    { slug: "jaipur", geo_id: "in-rj", label: "Jaipur" },
    { slug: "surat", geo_id: "in-gj", label: "Surat" },
  ],
};

/**
 * Build the lookup maps once at module init from the manual list.
 */
export const MANUAL_FRIENDLY_TO_GEO_ID: Record<string, Record<string, string>> = (() => {
  const out: Record<string, Record<string, string>> = {};
  for (const [country, entries] of Object.entries(MANUAL_CITY_ALIASES)) {
    out[country] = {};
    for (const e of entries) {
      out[country][e.slug] = e.geo_id;
    }
  }
  return out;
})();

export const MANUAL_DISPLAY_LABEL: Record<string, Record<string, string>> = (() => {
  const out: Record<string, Record<string, string>> = {};
  for (const [country, entries] of Object.entries(MANUAL_CITY_ALIASES)) {
    out[country] = {};
    for (const e of entries) {
      out[country][e.slug] = e.label;
    }
  }
  return out;
})();
