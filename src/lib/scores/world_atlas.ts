/**
 * src/lib/scores/world_atlas.ts
 *
 * The world-page framing read (bible Section 5, the free-portal row that makes
 * the global atlas an entry point rather than a country list). This is the
 * world-altitude sibling of the country read (src/lib/scores/country_verdict)
 * and the sector-directory read (src/lib/scores/sector_economics).
 *
 * Same voice, straight from the bible (Section 25): blunt, practical, skeptical
 * of easy money. The thesis it carries is the one the whole atlas turns on: the
 * country sets the conditions, but the operator and the address decide whether a
 * given business actually clears a wage. So the page leads with where to start
 * reading, not with a flat grid of every flag.
 *
 * It invents NO numbers. It only restates the real coverage signal the page
 * already loads: how many countries carry usable data, how many distinct
 * activities are mapped, and per country how broad that activity coverage runs.
 * Breadth (the count of activities measured in a country) is the only per-country
 * figure surfaced, and it is a plain count, not a quality or confidence score.
 *
 * Pure module: no Supabase, no network, no other domain modules at runtime. It
 * consumes only the taxonomy and the pre-computed coverage report the page hands
 * it, so it is trivially testable and cannot trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { CoverageReport, CoverageCountry } from "@/lib/quality/coverage-report";

/** A covered country, ready to render: its code, display name, and how many
 *  distinct activities carry data for it (its breadth on the map). */
export interface AtlasCountry {
  iso2: string;
  name: string;
  /** Count of distinct activities measured in this country. A plain count. */
  activities: number;
}

/** The reading depth a country lands in, by how broad its activity coverage is.
 *  Not a verdict on the country, only on how much of the map is filled in. */
export type AtlasDepth = "deepest" | "broad" | "starter";

export interface AtlasRegion {
  /** Display name of the region. */
  name: string;
  /** Covered countries in this region, ordered broadest first. */
  countries: AtlasCountry[];
}

export interface WorldAtlas {
  /** How many countries carry usable data. A real total. */
  countriesCovered: number;
  /** How many distinct activities are mapped across the atlas. A real total. */
  activitiesMapped: number;
  /**
   * The handful of countries where the map is broadest, ordered first. This is
   * the guided entry: a reader starts where the data goes furthest, not at the
   * top of an alphabet.
   */
  deepest: AtlasCountry[];
  /** Every covered country grouped by region, ordered broadest first within. */
  regions: AtlasRegion[];
}

// ----------------------------------------------------------------------------
// region map. Loose geographic groupings so the page reads by place rather than
// by alphabet. Any covered country not named here falls into "Rest of world".
// Mirrors the grouping the page carried before, lifted here so the page stays a
// thin view over this module.
// ----------------------------------------------------------------------------

const REGIONS: Array<[string, string[]]> = [
  ["North America", ["US", "CA", "MX"]],
  [
    "Latin America and the Caribbean",
    ["BR", "AR", "CL", "CO", "PE", "EC", "UY", "PY", "VE", "BO",
     "CR", "PA", "DO", "GT", "HN", "SV", "NI", "JM", "TT", "BB", "BS"],
  ],
  [
    "Western Europe",
    ["GB", "FR", "DE", "IT", "ES", "NL", "BE", "LU", "IE", "PT",
     "CH", "AT", "DK", "SE", "NO", "FI", "IS", "MT", "CY", "GR",
     "AD", "MC", "LI", "SM", "VA"],
  ],
  [
    "Central and Eastern Europe",
    ["PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "EE", "LV", "LT",
     "AL", "MK", "BA", "ME", "RS", "RU", "UA", "BY", "MD"],
  ],
  [
    "Middle East and North Africa",
    ["IL", "TR", "SA", "AE", "QA", "KW", "BH", "OM", "JO", "LB",
     "EG", "MA", "TN", "DZ", "LY", "YE", "IQ", "IR"],
  ],
  [
    "Asia and the Pacific Rim",
    ["JP", "KR", "CN", "TW", "HK", "SG", "MY", "TH", "ID", "PH", "VN",
     "IN", "PK", "BD", "LK", "NP", "MM", "KH", "LA", "MN",
     "KZ", "UZ", "AZ", "GE", "AM", "KG", "TJ", "TM"],
  ],
  [
    "Sub-Saharan Africa",
    ["ZA", "NG", "KE", "ET", "GH", "SN", "CI", "CM", "TZ", "UG",
     "MZ", "ZW", "ZM", "MG", "RW", "AO"],
  ],
  ["Oceania", ["AU", "NZ", "FJ", "PG", "WS", "TO"]],
];

const REST_OF_WORLD = "Rest of world";

// ----------------------------------------------------------------------------
// depth bands. Read from the count of activities measured in a country. The
// thresholds are deliberately coarse: this sorts the map into "start here",
// "plenty to read", and "early days", nothing finer. A country near the top of
// the taxonomy (about four fifths of all activities) is as broad as the atlas
// gets; a country in single or low double digits is still filling in.
// ----------------------------------------------------------------------------

export function atlasDepth(activities: number): AtlasDepth {
  if (activities >= 50) return "deepest";
  if (activities >= 25) return "broad";
  return "starter";
}

export interface AtlasDepthMeta {
  id: AtlasDepth;
  /** Short label for the depth, in the house voice. */
  label: string;
}

export const ATLAS_DEPTH_META: Record<AtlasDepth, AtlasDepthMeta> = {
  deepest: { id: "deepest", label: "Broadest coverage" },
  broad: { id: "broad", label: "Plenty to read" },
  starter: { id: "starter", label: "Early days" },
};

// ----------------------------------------------------------------------------
// the editorial framing copy. Held here, not in the page, so the world page has
// a single source for its voice the same way the sector directory does. No
// numbers are baked in; the page interpolates the real totals around these.
// ----------------------------------------------------------------------------

export const ATLAS_COPY = {
  eyebrow: "The world",
  title: "Where small businesses make money around the world",
  /**
   * The thesis, stated plainly. The country is the weather, not the verdict.
   * Two sentences so the page opens with a point of view, not a legend.
   */
  lead:
    "This is the map of small-business economics by country. The country sets the conditions, taxes, wages, spending power, and how hard it is to get a business off the ground, but the operator and the address decide whether a given business actually clears a wage.",
  /** What to do with the map: read it as a starting point, then go local. */
  deepestBlurb:
    "Start where the map goes furthest. These are the countries with the most activities measured, so a plan can be checked against real ranges before it touches an alphabet of flags.",
  /** The honest note that the world is uneven, said without apology. */
  restNote:
    "The rest of the world, by region. Coverage is uneven by design: a country reads as far as its data goes and no further. Open one to see which activities carry numbers and which are still thin.",
  /** Closing cross-link framing toward the depth-first coverage view. */
  depthClose:
    "Breadth is how many activities a country covers. For how deep the numbers run inside a country, from neighborhood-level measurement to modeled estimates, read the coverage view.",
} as const;

// ----------------------------------------------------------------------------
// public entry point
// ----------------------------------------------------------------------------

/**
 * Build the world view from the coverage report and the set of real country
 * codes the page already validated. The page owns the taxonomy lookups (which
 * ISO2 codes are real, and their display names) and passes them in, so this
 * module stays free of taxonomy imports and trivially testable.
 *
 * @param report      the pre-computed coverage snapshot, or null when missing
 * @param validIso2   real ISO2 codes from the country taxonomy
 * @param nameOf      resolver from ISO2 to display name
 * @param activitiesTotal  distinct activities mapped across the atlas (real)
 */
export function buildWorldAtlas(
  report: CoverageReport | null,
  validIso2: Set<string>,
  nameOf: (iso2: string) => string,
  activitiesTotal: number,
): WorldAtlas {
  // Keep only real countries that actually carry usable data.
  const byIso2 = new Map<string, CoverageCountry>(
    (report?.countries || [])
      .filter((c) => validIso2.has(c.iso2))
      .map((c) => [c.iso2, c]),
  );

  /* Covered means CLASSIFIED cells, not allocated ones.
     regional_cells + extrapolated_cells counts slots. 169 rows in the report
     are an empty 44-industry x 6-band grid: 264 cells, no tier, no quality, no
     year, zero geographies. Six of them are valid ISO-2 codes and survive the
     validIso2 filter above, so this test was calling Andorra, Armenia, Bahrain,
     Kuwait, Montenegro and Paraguay covered, and crediting each with the 44
     activities the empty grid was shaped for.

     A tier is the evidence that a cell holds something. */
  const isCovered = (row: CoverageCountry): boolean =>
    Object.values(row.tiers || {}).reduce((a, b) => a + (b || 0), 0) > 0;

  const toAtlas = (iso2: string): AtlasCountry => ({
    iso2,
    name: nameOf(iso2),
    activities: byIso2.get(iso2)?.industries ?? 0,
  });

  const covered: AtlasCountry[] = [];
  for (const [iso2, row] of byIso2) {
    if (isCovered(row)) covered.push(toAtlas(iso2));
  }

  // Broadest first, with a stable name tiebreak so equal-breadth countries do
  // not reshuffle between renders.
  const byBreadth = (a: AtlasCountry, b: AtlasCountry): number =>
    b.activities - a.activities || a.name.localeCompare(b.name);

  // The guided entry: the broadest markets, capped so it stays a short, scannable
  // shelf rather than a second full grid.
  const deepest = [...covered].sort(byBreadth).slice(0, 8);

  // Regional grouping. A covered country lands in the first region that names it;
  // anything left over collects into "Rest of world" so nothing covered is lost.
  const coveredByIso = new Map(covered.map((c) => [c.iso2, c]));
  const placed = new Set<string>();
  const regions: AtlasRegion[] = [];

  for (const [name, codes] of REGIONS) {
    const here: AtlasCountry[] = [];
    for (const code of codes) {
      const c = coveredByIso.get(code);
      if (c) {
        here.push(c);
        placed.add(code);
      }
    }
    if (here.length > 0) {
      here.sort(byBreadth);
      regions.push({ name, countries: here });
    }
  }

  const rest = covered.filter((c) => !placed.has(c.iso2)).sort(byBreadth);
  if (rest.length > 0) {
    regions.push({ name: REST_OF_WORLD, countries: rest });
  }

  return {
    countriesCovered: covered.length,
    activitiesMapped: activitiesTotal,
    deepest,
    regions,
  };
}
