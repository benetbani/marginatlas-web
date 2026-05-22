/**
 * Plan v24 Block 4 — manual supplement for friendly city aliases.
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
