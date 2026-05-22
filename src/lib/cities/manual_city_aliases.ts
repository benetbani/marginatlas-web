/**
 * Plan v24 Block 4 — manual supplement for friendly city aliases.
 *
 * Founder reported `/de/frankfurt/...` rendering "How much does a
 * restaurant make in Hessen?" — Frankfurt was missing from the auto-
 * generated alias map. This file ships hand-curated additions for the
 * top ~50 European, Asian, and Latin American cities that the auto
 * pipeline missed.
 *
 * Loaded in src/lib/cells.ts on top of CITY_FRIENDLY_TO_GEO_ID and
 * CITY_FRIENDLY_DISPLAY_LABEL. Manual entries take precedence over the
 * auto-generated ones.
 */

export type ManualCityAlias = {
  slug: string;
  geo_id: string;
  label: string;
};

/** country (ISO-2 upper) → list of manual aliases. */
export const MANUAL_CITY_ALIASES: Record<string, ManualCityAlias[]> = {
  // Germany — NUTS-3 codes for major Kreisfreie Städte
  DE: [
    { slug: "frankfurt", geo_id: "de712", label: "Frankfurt am Main" },
    { slug: "hamburg", geo_id: "de600", label: "Hamburg" },
    { slug: "cologne", geo_id: "dea23", label: "Cologne" },
    { slug: "stuttgart", geo_id: "de111", label: "Stuttgart" },
    { slug: "dusseldorf", geo_id: "dea11", label: "Düsseldorf" },
    { slug: "dresden", geo_id: "ded21", label: "Dresden" },
    { slug: "leipzig", geo_id: "ded51", label: "Leipzig" },
    { slug: "hanover", geo_id: "de929", label: "Hanover" },
    { slug: "bremen", geo_id: "de501", label: "Bremen" },
    { slug: "nuremberg", geo_id: "de254", label: "Nuremberg" },
    { slug: "essen", geo_id: "dea13", label: "Essen" },
    { slug: "dortmund", geo_id: "dea52", label: "Dortmund" },
    { slug: "berlin", geo_id: "de300", label: "Berlin" },
    { slug: "munich", geo_id: "de212", label: "Munich" },
  ],
  // France — NUTS-3 codes for major départements
  FR: [
    { slug: "lyon", geo_id: "frk26", label: "Lyon" },
    { slug: "marseille", geo_id: "frl04", label: "Marseille" },
    { slug: "toulouse", geo_id: "frj23", label: "Toulouse" },
    { slug: "nice", geo_id: "frl03", label: "Nice" },
    { slug: "nantes", geo_id: "frg01", label: "Nantes" },
    { slug: "strasbourg", geo_id: "frf11", label: "Strasbourg" },
    { slug: "bordeaux", geo_id: "fri12", label: "Bordeaux" },
    { slug: "lille", geo_id: "fre11", label: "Lille" },
    { slug: "rennes", geo_id: "frh03", label: "Rennes" },
    { slug: "montpellier", geo_id: "frj13", label: "Montpellier" },
  ],
  // United Kingdom — LAU / NUTS-3 codes for major cities
  GB: [
    { slug: "birmingham", geo_id: "ukg31", label: "Birmingham" },
    { slug: "manchester", geo_id: "ukd33", label: "Manchester" },
    { slug: "liverpool", geo_id: "ukd72", label: "Liverpool" },
    { slug: "leeds", geo_id: "uke42", label: "Leeds" },
    { slug: "sheffield", geo_id: "uke32", label: "Sheffield" },
    { slug: "edinburgh", geo_id: "ukm75", label: "Edinburgh" },
    { slug: "glasgow", geo_id: "ukm82", label: "Glasgow" },
    { slug: "bristol", geo_id: "ukk11", label: "Bristol" },
    { slug: "newcastle", geo_id: "ukc22", label: "Newcastle upon Tyne" },
    { slug: "cardiff", geo_id: "ukl22", label: "Cardiff" },
    { slug: "belfast", geo_id: "ukn0a", label: "Belfast" },
  ],
  // Italy — NUTS-3 codes for major comuni
  IT: [
    { slug: "rome", geo_id: "iti43", label: "Rome" },
    { slug: "milan", geo_id: "itc4c", label: "Milan" },
    { slug: "naples", geo_id: "itf33", label: "Naples" },
    { slug: "turin", geo_id: "itc11", label: "Turin" },
    { slug: "palermo", geo_id: "itg12", label: "Palermo" },
    { slug: "genoa", geo_id: "itc33", label: "Genoa" },
    { slug: "bologna", geo_id: "ith55", label: "Bologna" },
    { slug: "florence", geo_id: "iti14", label: "Florence" },
    { slug: "venice", geo_id: "ith35", label: "Venice" },
  ],
  // Spain — NUTS-3 codes for major provincias
  ES: [
    { slug: "madrid", geo_id: "es300", label: "Madrid" },
    { slug: "barcelona", geo_id: "es511", label: "Barcelona" },
    { slug: "valencia", geo_id: "es523", label: "Valencia" },
    { slug: "seville", geo_id: "es618", label: "Seville" },
    { slug: "zaragoza", geo_id: "es243", label: "Zaragoza" },
    { slug: "malaga", geo_id: "es617", label: "Málaga" },
    { slug: "bilbao", geo_id: "es213", label: "Bilbao" },
    { slug: "alicante", geo_id: "es521", label: "Alicante" },
  ],
  // Netherlands — NUTS-3 codes
  NL: [
    { slug: "amsterdam", geo_id: "nl329", label: "Amsterdam" },
    { slug: "rotterdam", geo_id: "nl33c", label: "Rotterdam" },
    { slug: "the-hague", geo_id: "nl332", label: "The Hague" },
    { slug: "utrecht", geo_id: "nl310", label: "Utrecht" },
    { slug: "eindhoven", geo_id: "nl414", label: "Eindhoven" },
  ],
  // Belgium
  BE: [
    { slug: "brussels", geo_id: "be100", label: "Brussels" },
    { slug: "antwerp", geo_id: "be211", label: "Antwerp" },
    { slug: "ghent", geo_id: "be234", label: "Ghent" },
  ],
  // Switzerland
  CH: [
    { slug: "zurich", geo_id: "ch040", label: "Zurich" },
    { slug: "geneva", geo_id: "ch013", label: "Geneva" },
    { slug: "basel", geo_id: "ch031", label: "Basel" },
    { slug: "bern", geo_id: "ch021", label: "Bern" },
    { slug: "lausanne", geo_id: "ch011", label: "Lausanne" },
  ],
  // Austria
  AT: [
    { slug: "vienna", geo_id: "at130", label: "Vienna" },
    { slug: "graz", geo_id: "at221", label: "Graz" },
    { slug: "salzburg", geo_id: "at323", label: "Salzburg" },
    { slug: "linz", geo_id: "at312", label: "Linz" },
  ],
  // Poland — NUTS-3 codes
  PL: [
    { slug: "warsaw", geo_id: "pl911", label: "Warsaw" },
    { slug: "krakow", geo_id: "pl213", label: "Kraków" },
    { slug: "wroclaw", geo_id: "pl514", label: "Wrocław" },
    { slug: "gdansk", geo_id: "pl634", label: "Gdańsk" },
    { slug: "poznan", geo_id: "pl415", label: "Poznań" },
  ],
  // Portugal
  PT: [
    { slug: "lisbon", geo_id: "pt170", label: "Lisbon" },
    { slug: "porto", geo_id: "pt11a", label: "Porto" },
  ],
  // Sweden
  SE: [
    { slug: "stockholm", geo_id: "se110", label: "Stockholm" },
    { slug: "gothenburg", geo_id: "se232", label: "Gothenburg" },
    { slug: "malmo", geo_id: "se224", label: "Malmö" },
  ],
  // Denmark
  DK: [
    { slug: "copenhagen", geo_id: "dk011", label: "Copenhagen" },
    { slug: "aarhus", geo_id: "dk042", label: "Aarhus" },
  ],
  // Norway
  NO: [
    { slug: "oslo", geo_id: "no011", label: "Oslo" },
    { slug: "bergen", geo_id: "no051", label: "Bergen" },
  ],
  // Finland
  FI: [
    { slug: "helsinki", geo_id: "fi1b1", label: "Helsinki" },
  ],
  // Greece
  GR: [
    { slug: "athens", geo_id: "el301", label: "Athens" },
    { slug: "thessaloniki", geo_id: "el522", label: "Thessaloniki" },
  ],
  // Czech Republic
  CZ: [
    { slug: "prague", geo_id: "cz010", label: "Prague" },
    { slug: "brno", geo_id: "cz064", label: "Brno" },
  ],
  // Hungary
  HU: [
    { slug: "budapest", geo_id: "hu110", label: "Budapest" },
  ],
  // Romania
  RO: [
    { slug: "bucharest", geo_id: "ro321", label: "Bucharest" },
  ],
  // Turkey
  TR: [
    { slug: "istanbul", geo_id: "tr100", label: "Istanbul" },
    { slug: "ankara", geo_id: "tr510", label: "Ankara" },
    { slug: "izmir", geo_id: "tr310", label: "İzmir" },
  ],
  // Russia (city-overlay)
  RU: [
    { slug: "moscow", geo_id: "ru-city-moscow", label: "Moscow" },
    { slug: "saint-petersburg", geo_id: "ru-city-saint-petersburg", label: "Saint Petersburg" },
  ],
  // Ireland
  IE: [
    { slug: "dublin", geo_id: "ie061", label: "Dublin" },
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
