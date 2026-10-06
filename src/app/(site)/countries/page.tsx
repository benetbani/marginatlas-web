/**
 * Countries hub at /countries.
 *
 * Founder spec 2026-05-25: the nav-bar "Countries" link points here.
 * Each country in the list links through to /[country], from which
 * the user can drill into the country's cities (via the existing
 * CountryCityShortcuts) and regions (via the admin1 region list).
 * Connected structure: nav -> countries -> country -> cities.
 *
 * Layout (his rulings of 2026-10-07): one folded card per continent,
 * North America and Europe first and open, the other four closed, so the
 * page does not print all 195 countries at once. Inside a card a country
 * is its flag and its name, nothing else.
 *
 * No client JS. A native <details> does the disclosure. Server-rendered,
 * revalidate 24h.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRIES } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import cityListJson from "../../../../data/cities/city_list_v1.json";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All countries | Margin Atlas",
  description:
    "Every country covered by Margin Atlas, by continent. Open a continent, then a country.",
  alternates: { canonical: "/countries" },
};

type CityListEntry = { slug: string; iso2: string; continent: string };
const CITY_LIST = (cityListJson as { cities: CityListEntry[] }).cities;

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
  AF: "Asia", BD: "Asia", BT: "Asia", BN: "Asia", KH: "Asia", TL: "Asia", MO: "Asia",
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

// His ruling of 2026-10-07: North America and Europe first, Africa last.
const CONTINENT_ORDER = [
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Oceania",
  "Africa",
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

  return (
    /* max-w-7xl mx-auto px-4 md:px-6 removed. SiteChrome already gives this
       route max-w-content mx-auto px-6, so the 1280 cap never applied and the
       second padding just doubled the gutter into a 1024 column inside the
       site's 1072: the cohesion audit's item 7. */
    <article className="py-10 md:py-14">
      {/* Header: an editorial masthead on a seated card, a faint survey-grid
         motif behind it, one plain line under the title. */}
      {/* Canonical surface: was "rounded-2xl border border-parchment
          bg-cream-50", a fully opaque hand-roll, and bg-cream-50 is #ffffff.
          AtlasFrame paints a fixed photograph behind every route with no
          centre plate, so an opaque fill blocks the picture dead where
          .atlas-card carries it at .955. .atlas-card already sets
          position:relative, which is what the survey-grid motif below needs
          to position against, and what keeps the card above the frame's own
          fixed layers. */}
      <header className="atlas-card overflow-hidden px-6 py-8 md:px-10 md:py-12 mb-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ backgroundImage: "url('/atlas-grid.svg')", backgroundSize: "34px 34px" }}
        />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.18em] text-atlas-700 font-semibold mb-2">
            Atlas coverage
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
            Every country with a page
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-cocoa-700/85 leading-relaxed">
            Open a continent, then a country.
          </p>
        </div>
      </header>

      {/* Continent sections, each a folded card on the warm app ground. The
          index is the continent's place in CONTINENT_ORDER, so which cards
          stand open does not move if a continent has no countries. */}
      <div className="space-y-5">
        {CONTINENT_ORDER.map((continent, i) => {
          const list = grouped.get(continent);
          if (!list || list.length === 0) return null;
          const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
          return (
            <details
              key={continent}
              open={i < 2}
              /* Same conversion as the header above. The country tiles
                 INSIDE this card are deliberately left on their own
                 rounded-lg: they sit on a card, not on the photograph, so
                 their fill is not what carries the picture, and .atlas-card's
                 16px radius on a 56px tile is a worse drawing than the 8px
                 they have. Converging a surface is not the same as converging
                 a mark. */
              className="group/continent atlas-card px-5 py-5 md:px-7 md:py-6"
            >
              {/* The summary is the click target and takes the keyboard by
                  default. The native marker is hidden and a chevron turns
                  when the card is open. The group is named because each
                  country tile below has its own `group` for its hover. */}
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 group-open/continent:mb-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-ink-900">
                  {continent}
                </h2>
                <span className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-ink-500 tabular-nums">
                    {sorted.length} countries
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 text-ink-500 transition-transform motion-reduce:transition-none group-open/continent:rotate-180"
                  >
                    <path d="M5 8l5 5 5-5" />
                  </svg>
                </span>
              </summary>
              {/* ONE COLUMN AT PHONE, measured rather than chosen. Two columns
                  inside a 327px card leave a name 68px, and 68px does not hold
                  "Cameroon" (69px), let alone "Madagascar" (83px): 27 names
                  still overflowed after they were allowed to wrap, because a
                  single word has nowhere to break. One column gives the name
                  219px and every country on the list fits, one name on one
                  line, except the longest, which wraps in two. Step 6's own
                  instruction: at phone width a wide thing reconfigures.
                  The ladder above phone moved down one rung with it, 1 / 2 / 3 /
                  4 / 5, because the old 3-at-640 and 4-at-768 were the two rungs
                  that still overflowed after the wrap: 88px of name at 768 does
                  not hold "Turkmenistan" or "Liechtenstein" (91px each), and a
                  single word has nowhere to break. Counted at eight widths after
                  the change, no name is cut at any of them. */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {sorted.map((country) => (
                  <Link
                    key={country.code}
                    href={`/${country.code.toLowerCase()}`}
                    className="group flex items-center gap-3 rounded-lg border border-parchment bg-white p-3 transition-all hover:-translate-y-px hover:border-atlas-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
                  >
                    {/* No radius class here, and none anywhere else that
                        draws a flag: CountryFlag strips one now, and the
                        note in that file says why. This tile carried
                        `rounded-sm` on all 194 of its flags. */}
                    <CountryFlag iso2={country.code} className="w-8 shrink-0" />
                    {/* A NAME WRAPS, IT NEVER CLIPS. `truncate` cut a
                        country's name at every width this page renders at:
                        measured on the render, 55 of 194 at 375, 20 at 768,
                        10 at 1280 and at 1440, and "Saint Vincent and the
                        Grenadines" needs 224px against the widest column
                        this grid ever gives a name, 125px, so it was cut on
                        every screen there is. A visitor comes here to find
                        the country they came for; a clipped name defeats
                        that. C6 settled the same fault the same way on the
                        trades card: wrap. `leading-snug` keeps the second
                        line tight to the first so the pair still reads as
                        one name. */}
                    <span className="min-w-0 block text-sm font-semibold leading-snug text-ink-900 group-hover:text-atlas-700">
                      {country.name}
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </article>
  );
}
