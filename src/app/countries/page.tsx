/**
 * Countries hub at /countries.
 *
 * Founder spec 2026-05-25: the nav-bar "Countries" link points here.
 * Each country in the list links through to /[country], from which
 * the user can drill into the country's cities (via the existing
 * CountryCityShortcuts) and regions (via the admin1 region list).
 * Connected structure: nav -> countries -> country -> cities.
 *
 * Layout: per-continent section with a heading, then a responsive
 * grid of compact country cards (flag + name + optional city count),
 * mirroring the /world CountryTile. Compact, no wasted whitespace.
 *
 * No client JS. Server-rendered, revalidate 24h.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRIES } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import cityListJson from "../../../data/cities/city_list_v1.json";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All countries | Margin Atlas",
  description:
    "Every country covered by Margin Atlas, grouped by continent. Open a country to see the small-business benchmark, regions, and cities inside.",
};

type CityListEntry = { slug: string; iso2: string; continent: string };
const CITY_LIST = (cityListJson as { cities: CityListEntry[] }).cities;

// Build a per-iso2 city count from the curated city list. Used to badge
// each country with the number of cities we cover inside it.
const CITY_COUNT_BY_ISO2 = new Map<string, number>();
for (const c of CITY_LIST) {
  const iso = (c.iso2 || "").toUpperCase();
  if (!iso) continue;
  CITY_COUNT_BY_ISO2.set(iso, (CITY_COUNT_BY_ISO2.get(iso) || 0) + 1);
}

// Continent assignment per iso2. Sourced from the city list (most
// countries we cover have at least one city, so we get the continent
// from there). Countries that have no city in the curated list fall
// back to a hand-curated map below.
const CONTINENT_BY_ISO2 = new Map<string, string>();
for (const c of CITY_LIST) {
  const iso = (c.iso2 || "").toUpperCase();
  if (!iso || CONTINENT_BY_ISO2.has(iso)) continue;
  CONTINENT_BY_ISO2.set(iso, c.continent);
}

// Fallback continent map for countries not covered by the city list.
// Six bucket scheme matches /cities exactly.
const FALLBACK_CONTINENT: Record<string, string> = {
  // Africa
  BJ: "Africa", BW: "Africa", BF: "Africa", BI: "Africa", CV: "Africa",
  CM: "Africa", CF: "Africa", TD: "Africa", KM: "Africa", CG: "Africa",
  CD: "Africa", DJ: "Africa", GQ: "Africa", ER: "Africa", SZ: "Africa",
  GA: "Africa", GM: "Africa", GN: "Africa", GW: "Africa", LS: "Africa",
  LR: "Africa", LY: "Africa", MG: "Africa", MW: "Africa", ML: "Africa",
  MR: "Africa", MU: "Africa", MZ: "Africa", NA: "Africa", NE: "Africa",
  RW: "Africa", ST: "Africa", SC: "Africa", SL: "Africa", SO: "Africa",
  SS: "Africa", SD: "Africa", TZ: "Africa", TG: "Africa", UG: "Africa",
  ZM: "Africa", ZW: "Africa",
  // Asia
  AF: "Asia", BD: "Asia", BT: "Asia", BN: "Asia", KH: "Asia", TL: "Asia",
  KZ: "Asia", KG: "Asia", LA: "Asia", MV: "Asia", MN: "Asia", MM: "Asia",
  NP: "Asia", KP: "Asia", PK: "Asia", LK: "Asia", TJ: "Asia", TM: "Asia",
  UZ: "Asia",
  // Europe
  AD: "Europe", AM: "Europe", AZ: "Europe", BY: "Europe", BA: "Europe",
  CY: "Europe", GE: "Europe", IS: "Europe", LI: "Europe", LU: "Europe",
  MT: "Europe", MD: "Europe", SM: "Europe", VA: "Europe", XK: "Europe",
  ME: "Europe", MK: "Europe",
  // North America (incl. Caribbean & Central America)
  AG: "North America", BS: "North America", BB: "North America",
  BZ: "North America", CU: "North America", DM: "North America",
  SV: "North America", GD: "North America", GT: "North America",
  HT: "North America", HN: "North America", JM: "North America",
  NI: "North America", KN: "North America", LC: "North America",
  VC: "North America", TT: "North America",
  // South America
  BO: "South America", EC: "South America", GY: "South America",
  PY: "South America", SR: "South America", UY: "South America",
  VE: "South America",
  // Oceania
  FJ: "Oceania", KI: "Oceania", MH: "Oceania", FM: "Oceania", NR: "Oceania",
  PW: "Oceania", PG: "Oceania", WS: "Oceania", SB: "Oceania", TO: "Oceania",
  TV: "Oceania", VU: "Oceania",
  // MENA (we bucket into Asia + Africa above; LB/JO/SY/IQ/IR fall here)
  BH: "Asia", IR: "Asia", IQ: "Asia", IL: "Asia", JO: "Asia", KW: "Asia",
  LB: "Asia", OM: "Asia", PS: "Asia", QA: "Asia", SA: "Asia", SY: "Asia",
  YE: "Asia",
  // Egypt, Morocco, Tunisia, Algeria fall to Africa above. UAE = Asia.
  EG: "Africa", MA: "Africa", TN: "Africa", DZ: "Africa",
};

const CONTINENT_ORDER = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

function continentFor(iso2: string): string {
  const upper = iso2.toUpperCase();
  return (
    CONTINENT_BY_ISO2.get(upper) || FALLBACK_CONTINENT[upper] || "Other"
  );
}

export default function CountriesHub() {
  const grouped = new Map<string, typeof COUNTRIES>();
  for (const c of COUNTRIES) {
    const continent = continentFor(c.code);
    if (!grouped.has(continent)) grouped.set(continent, []);
    grouped.get(continent)!.push(c);
  }

  const totalCountries = COUNTRIES.length;

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Countries
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
        Every country we cover
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-8 max-w-2xl">
        {totalCountries} countries grouped by continent. Open any country
        to see its small-business hero, top activities, regions, and the
        cities inside.
      </p>

      {/* Same big white card chrome as /cities. Whole index sits on one
         seated card so the body paper pattern stops fighting dense text. */}
      <div className="rounded-2xl bg-white border border-[rgba(76,39,18,0.10)] shadow-[0_2px_4px_rgba(76,39,18,0.05),_0_12px_28px_rgba(76,39,18,0.06)] px-4 md:px-8 py-6 md:py-10">

      {CONTINENT_ORDER.map((continent) => {
        const list = grouped.get(continent);
        if (!list || list.length === 0) return null;
        const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
        return (
          <section key={continent} className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 mb-5 pb-2 border-b-2 border-parchment">
              {continent}{" "}
              <span className="text-sm font-normal text-cocoa-700/60 tabular-nums">
                &middot; {sorted.length} countries
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sorted.map((country) => {
                const cityCount = CITY_COUNT_BY_ISO2.get(country.code) || 0;
                return (
                  <Link
                    key={country.code}
                    href={`/${country.code.toLowerCase()}`}
                    className="group flex items-baseline gap-2.5 rounded-lg border border-parchment bg-cream-50 p-3 transition-colors hover:border-atlas-500 hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
                  >
                    <CountryFlag
                      iso2={country.code}
                      className="w-7 shrink-0 translate-y-[2px]"
                    />
                    <span className="truncate text-sm font-semibold text-ink-900 group-hover:text-atlas-700">
                      {country.name}
                    </span>
                    {cityCount > 0 ? (
                      <span className="text-xs text-cocoa-700/60 tabular-nums">
                        {cityCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Close the big white card wrapper. */}
      </div>
    </article>
  );
}
