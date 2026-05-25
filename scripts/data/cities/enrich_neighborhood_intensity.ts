/**
 * enrich_neighborhood_intensity.ts
 *
 * Generates heuristic commuter + tourism + tag data for every city in
 * city_list_v1.json that doesn't already have curated intensity.
 *
 * For cities without a neighborhood scheme in neighborhoods_v1.json, it
 * also synthesizes a default 5-zone alpha-auto scheme (central + 4
 * cardinal directions). All generated rows are flagged source_quality
 * "C" with a notes field explaining the derivation, so future curation
 * passes can spot them.
 *
 * The 10 hand-curated cities (NYC + London + Paris + Tokyo + Berlin +
 * HK + Singapore + Mumbai + São Paulo + Dubai) are NEVER overwritten;
 * every existing row is preserved as-is.
 *
 * Run: npx tsx scripts/data/cities/enrich_neighborhood_intensity.ts
 *
 * Founder spec 2026-05-26: expand coverage to all ~250 cities so the
 * neighborhood multiplier engine has data to operate on everywhere.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const CITY_LIST_PATH = resolve(ROOT, "data/cities/city_list_v1.json");
const NEIGHBORHOODS_PATH = resolve(ROOT, "data/cities/neighborhoods_v1.json");
const INTENSITY_PATH = resolve(ROOT, "data/economics/neighborhood_intensity_v1.json");

type City = { slug: string; name: string; iso2: string; tier: number; pop_m: number };
type Neighborhood = { slug: string; name: string; character: string; description?: string };
type NeighborhoodScheme = { scheme: string; neighborhoods: Neighborhood[] };

type Tag =
  | "financial_cbd"
  | "tourist_zone"
  | "luxury_district"
  | "free_economic_zone"
  | "university_district"
  | "industrial_park"
  | "tech_corridor"
  | "embassy_quarter"
  | "medical_cluster"
  | "transit_hub"
  | "gentrifying_edge"
  | "nightlife_zone"
  | "religious_pilgrimage"
  | "residential_only";

type IntensityRow = {
  commuter_intensity: number;
  tourism_intensity: number;
  tags: Tag[];
  primary_tag: Tag;
  year: number;
  source_quality: "A" | "B" | "C";
  notes?: string;
};

// ---------------------------------------------------------------------------
// Load existing data
// ---------------------------------------------------------------------------

const cityList = JSON.parse(readFileSync(CITY_LIST_PATH, "utf-8")) as {
  cities: City[];
};
const neighborhoods = JSON.parse(readFileSync(NEIGHBORHOODS_PATH, "utf-8")) as {
  cities: Record<string, NeighborhoodScheme>;
};
const intensity = JSON.parse(readFileSync(INTENSITY_PATH, "utf-8")) as {
  version: string;
  anchor: string;
  convention: Record<string, unknown>;
  tag_definitions: Record<string, string>;
  neighborhoods: Record<string, IntensityRow>;
  city_defaults: Record<string, { commuter_intensity: number; tourism_intensity: number }>;
};

// ---------------------------------------------------------------------------
// Heuristics
// ---------------------------------------------------------------------------

/**
 * City-tier baseline. Tier 1 = global cities (NYC, London, Tokyo).
 * Tier 2 = major regional capitals. Tier 3 = national-regional.
 */
const TIER_BASELINE: Record<number, { commuter: number; tourism: number }> = {
  1: { commuter: 1.5, tourism: 8 },
  2: { commuter: 1.2, tourism: 3 },
  3: { commuter: 1.0, tourism: 1.5 },
};

/**
 * Per-character offset multipliers. Applied to the city-tier baseline.
 */
const CHARACTER_OFFSET: Record<string, { commuter: number; tourism: number }> = {
  "central-business": { commuter: 2.2, tourism: 2.0 },
  "affluent-residential": { commuter: 0.8, tourism: 1.3 },
  "mid-residential": { commuter: 1.0, tourism: 0.7 },
  "working-residential": { commuter: 0.6, tourism: 0.3 },
  industrial: { commuter: 1.3, tourism: 0.2 },
  tourist: { commuter: 1.3, tourism: 4.0 },
  "mixed-urban": { commuter: 1.1, tourism: 1.0 },
  academic: { commuter: 1.2, tourism: 0.7 },
};

/**
 * Map neighborhood character to a tag set. Tier 1 cities get a
 * transit_hub or tourist_zone boost where appropriate.
 */
function tagsFromCharacter(character: string, tier: number): Tag[] {
  switch (character) {
    case "central-business":
      return tier === 1
        ? ["financial_cbd", "transit_hub", "tourist_zone"]
        : ["financial_cbd", "transit_hub"];
    case "affluent-residential":
      return ["luxury_district"];
    case "mid-residential":
      return ["residential_only"];
    case "working-residential":
      return ["residential_only"];
    case "industrial":
      return ["industrial_park"];
    case "tourist":
      return tier === 1 ? ["tourist_zone", "transit_hub"] : ["tourist_zone"];
    case "mixed-urban":
      return tier === 1
        ? ["gentrifying_edge", "nightlife_zone"]
        : ["gentrifying_edge"];
    case "academic":
      return ["university_district"];
    default:
      return ["residential_only"];
  }
}

function primaryTagOf(tags: Tag[]): Tag {
  return tags[0] || "residential_only";
}

function deriveIntensity(
  character: string,
  tier: number,
  pop_m: number,
): IntensityRow {
  const base = TIER_BASELINE[tier] ?? TIER_BASELINE[3];
  const offset = CHARACTER_OFFSET[character] ?? CHARACTER_OFFSET["mid-residential"];

  // Round commuter to 0.1, tourism to 1.0 for readability.
  let commuter = Math.round(base.commuter * offset.commuter * 10) / 10;
  let tourism = Math.round(base.tourism * offset.tourism);

  // Mega-city bump: cities with pop > 8M nudge commuter a bit since CBDs
  // tend to be hotter in megacities.
  if (pop_m > 8 && character === "central-business") {
    commuter = Math.round(commuter * 1.15 * 10) / 10;
    tourism = Math.round(tourism * 1.2);
  }

  // Floor / ceiling to keep values plausible.
  commuter = Math.max(0.3, Math.min(6.0, commuter));
  tourism = Math.max(0, Math.min(60, tourism));

  const tags = tagsFromCharacter(character, tier);

  return {
    commuter_intensity: commuter,
    tourism_intensity: tourism,
    tags,
    primary_tag: primaryTagOf(tags),
    year: 2024,
    source_quality: "C",
    notes: `Heuristic from city tier ${tier} + character "${character}". Refine when ground truth is added.`,
  };
}

/**
 * Generate a default 5-zone alpha-auto scheme for cities without one.
 * Uses simple cardinal slugs ("central", "north", "south", "east",
 * "west") to match Tokyo's existing convention.
 */
function defaultScheme(cityName: string): NeighborhoodScheme {
  return {
    scheme: "alpha-auto",
    neighborhoods: [
      {
        slug: "central",
        name: `Central ${cityName}`,
        character: "central-business",
        description: "Central business district. Auto-generated; refine with local knowledge.",
      },
      {
        slug: "north",
        name: `North ${cityName}`,
        character: "mid-residential",
      },
      {
        slug: "south",
        name: `South ${cityName}`,
        character: "mid-residential",
      },
      {
        slug: "east",
        name: `East ${cityName}`,
        character: "working-residential",
      },
      {
        slug: "west",
        name: `West ${cityName}`,
        character: "affluent-residential",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

const stats = {
  citiesWithSchemeNew: 0,
  citiesWithIntensityNew: 0,
  neighborhoodsAdded: 0,
  preserved: 0,
};

// Step 1: ensure every city has a neighborhood scheme.
for (const city of cityList.cities) {
  if (!neighborhoods.cities[city.slug]) {
    neighborhoods.cities[city.slug] = defaultScheme(city.name);
    stats.citiesWithSchemeNew += 1;
  }
}

// Step 2: ensure every (city, neighborhood) pair has an intensity row.
for (const city of cityList.cities) {
  const scheme = neighborhoods.cities[city.slug];
  if (!scheme) continue;
  let cityGotNew = false;
  for (const nb of scheme.neighborhoods) {
    const key = `${city.slug}.${nb.slug}`;
    if (intensity.neighborhoods[key]) {
      stats.preserved += 1;
      continue;
    }
    intensity.neighborhoods[key] = deriveIntensity(nb.character, city.tier, city.pop_m);
    stats.neighborhoodsAdded += 1;
    cityGotNew = true;
  }
  if (cityGotNew) stats.citiesWithIntensityNew += 1;
}

// Step 3: ensure every city has a default in city_defaults.
for (const city of cityList.cities) {
  if (intensity.city_defaults[city.slug]) continue;
  const base = TIER_BASELINE[city.tier] ?? TIER_BASELINE[3];
  intensity.city_defaults[city.slug] = {
    commuter_intensity: base.commuter,
    tourism_intensity: base.tourism,
  };
}

// Step 4: bump versions + add provenance note.
intensity.version = "1.2.0";
intensity.anchor =
  intensity.anchor +
  " 2026-05-26: heuristic enrichment for all ~250 covered cities via scripts/data/cities/enrich_neighborhood_intensity.ts. Hand-curated rows preserved as source_quality A or B; generated rows marked source_quality C.";

// ---------------------------------------------------------------------------
// Write back
// ---------------------------------------------------------------------------

writeFileSync(
  NEIGHBORHOODS_PATH,
  JSON.stringify(neighborhoods, null, 2) + "\n",
  "utf-8",
);
writeFileSync(
  INTENSITY_PATH,
  JSON.stringify(intensity, null, 2) + "\n",
  "utf-8",
);

console.log("Enrichment complete.");
console.log(`  New default schemes added (cities): ${stats.citiesWithSchemeNew}`);
console.log(`  Cities receiving new intensity rows: ${stats.citiesWithIntensityNew}`);
console.log(`  Neighborhood intensity rows added: ${stats.neighborhoodsAdded}`);
console.log(`  Existing rows preserved untouched: ${stats.preserved}`);
console.log(
  `  Total cities covered now: ${Object.keys(neighborhoods.cities).length}`,
);
console.log(
  `  Total neighborhood intensity entries now: ${Object.keys(intensity.neighborhoods).length}`,
);
