/**
 * scripts/spikes/validate_worldpop_foursquare.ts
 *
 * Wave 3 spike — tests whether WorldPop population grids + Foursquare
 * OS Places POI density can reproduce the 21 hand-curated A-quality
 * neighborhood records.
 *
 * See docs/strategy/2026-05-26-wave3-spike-worldpop-foursquare.md for
 * the methodology, decision rules, and pass/fail criteria.
 *
 * Required env:
 *   FSQ_PLACES_API_KEY     # Foursquare developer key (free 50k req/day)
 *   WORLDPOP_API_KEY       # optional; only needed for heavy queries
 *
 * Required input:
 *   data/spike/neighborhood_polygons_v1.json (GeoJSON for each of the
 *   21 A-quality neighborhoods). Not yet built — see "Polygon
 *   extraction" section of the spike methodology doc.
 *
 * Run when ready: npx tsx scripts/spikes/validate_worldpop_foursquare.ts
 *
 * Output:
 *   data/spike/wave3_validation_results_v1.json
 *   data/spike/wave3_validation_REPORT.md
 *
 * 2026-05-26 — stub. Requires polygon extraction + API integration
 * before it produces real numbers. Decision rules + scoring logic
 * are implemented today; data fetchers are stubs.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INTENSITY_PATH = path.resolve(
  ROOT,
  "data/economics/neighborhood_intensity_v1.json",
);
const POLYGONS_PATH = path.resolve(
  ROOT,
  "data/spike/neighborhood_polygons_v1.json",
);

// 13-tag system from neighborhood_multipliers.ts.
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

type IntensityRecord = {
  commuter_intensity: number;
  tourism_intensity: number;
  tags: Tag[];
  primary_tag: Tag;
  year: number;
  source_quality: "A" | "B" | "C";
  notes?: string;
};

type IntensityFile = {
  neighborhoods: Record<string, IntensityRecord>;
};

type PolygonRecord = {
  city: string;
  neighborhood: string;
  geojson: object; // GeoJSON Polygon or MultiPolygon
  area_km2: number;
  iso2: string;
};

type PolygonsFile = {
  polygons: Record<string, PolygonRecord>;
};

// Manual whitelists for tags that POI data can't reliably detect.
const FREE_ECONOMIC_ZONES = new Set([
  "dubai.business-bay",
  "dubai.difc",
  "singapore.central-area",
  "shenzhen.qianhai",
  "hong-kong.central-admiralty",
]);

const RELIGIOUS_PILGRIMAGE = new Set([
  "mecca.holy-mosque-district",
  "vatican.vatican-city",
  "lourdes.sanctuary",
  "varanasi.ghats",
]);

// ---------------------------------------------------------------------------
// Stub data fetchers — replace with real API calls.
// ---------------------------------------------------------------------------

type WorldPopMeasurements = {
  daytime_population: number;
  nighttime_population: number;
  area_km2: number;
};

async function fetchWorldPop(_polygon: PolygonRecord): Promise<WorldPopMeasurements | null> {
  // TODO: integrate WorldPop REST API.
  // Endpoint: https://www.worldpop.org/rest/data/pop/wpgp
  // Need: aggregate `ppp_2020_constrained` (residential) and a daytime
  // dataset (GHSL `GHS_POP_E2030_GLOBE_R2023A_54009_100`) over the
  // neighborhood polygon. Return raw counts.
  return null;
}

type FoursquareCategoryCounts = {
  office: number;
  hotel: number;
  museum_landmark: number;
  luxury_retail: number;
  bar_nightclub: number;
  hospital: number;
  pharmacy: number;
  university: number;
  embassy: number;
  warehouse_industrial: number;
  tech_coworking: number;
  transit_major: number;
};

async function fetchFoursquareCategories(_polygon: PolygonRecord): Promise<FoursquareCategoryCounts | null> {
  // TODO: integrate Foursquare OS Places.
  // Endpoint: https://api.foursquare.com/v3/places/search
  // For each category we care about, query within the polygon (use the
  // polygon's bbox) and count results. Foursquare categories are:
  //   - Office: 11058 (Office Space) + 11050 (Corporate Office)
  //   - Hotel: 19014 (Hotel) + 19020 (Bed & Breakfast)
  //   - Museum/Landmark: 10027 (Museum) + 10001 (Historic Site)
  //   - Luxury Retail: 17029 (Designer Apparel) + 17127 (Jewelry Store)
  //   - Bar/Nightclub: 13003 (Bar) + 10032 (Nightclub)
  //   - etc.
  return null;
}

// ---------------------------------------------------------------------------
// Decision rules (from the spike methodology doc).
// ---------------------------------------------------------------------------

function applyTagRules(
  key: string,
  wp: WorldPopMeasurements,
  fsq: FoursquareCategoryCounts,
): { commuter: number; tourism: number; tags: Tag[] } {
  const commuter = wp.daytime_population / Math.max(1, wp.nighttime_population);

  // Tourism: hotel rooms × 250 visitors/year + landmark boost.
  const visitorsFromHotels = fsq.hotel * 60 * 250; // assume avg 60 rooms/hotel
  const landmarkBoost = 1 + 0.15 * fsq.museum_landmark;
  const residents = Math.max(100, wp.nighttime_population);
  const tourism = (visitorsFromHotels * landmarkBoost) / residents;

  const tags: Tag[] = [];
  const density = (count: number) => count / Math.max(0.1, wp.area_km2);

  if (density(fsq.office) > 50 && commuter > 3.5) tags.push("financial_cbd");
  if (tourism > 15 || fsq.museum_landmark > 8) tags.push("tourist_zone");
  if (density(fsq.luxury_retail) > 15) tags.push("luxury_district");
  if (FREE_ECONOMIC_ZONES.has(key)) tags.push("free_economic_zone");
  if (fsq.university > 0 && density(fsq.bar_nightclub) > 10) tags.push("university_district");
  if (density(fsq.warehouse_industrial) > 20) tags.push("industrial_park");
  if (density(fsq.tech_coworking) > 8) tags.push("tech_corridor");
  if (fsq.embassy > 5) tags.push("embassy_quarter");
  if (fsq.hospital > 3 && density(fsq.pharmacy) > 30) tags.push("medical_cluster");
  if (fsq.transit_major > 0) tags.push("transit_hub");
  if (density(fsq.bar_nightclub) > 25) tags.push("nightlife_zone");
  if (RELIGIOUS_PILGRIMAGE.has(key)) tags.push("religious_pilgrimage");
  if (commuter >= 1.2 && commuter <= 1.8) tags.push("gentrifying_edge");
  if (tags.length === 0 && commuter < 1.4) tags.push("residential_only");

  return { commuter, tourism, tags };
}

// ---------------------------------------------------------------------------
// Scoring vs the hand-curated A records.
// ---------------------------------------------------------------------------

type ValidationResult = {
  key: string;
  curated: { commuter: number; tourism: number; tags: Tag[] };
  derived: { commuter: number; tourism: number; tags: Tag[] };
  tag_match_pct: number;
  false_positive_pct: number;
  false_negative_pct: number;
  commuter_within_25pct: boolean;
  tourism_within_25pct: boolean;
};

function score(
  curated: IntensityRecord,
  derived: { commuter: number; tourism: number; tags: Tag[] },
): Omit<ValidationResult, "key" | "curated" | "derived"> {
  const curatedTags = new Set(curated.tags);
  const derivedTags = new Set(derived.tags);
  const matched = [...curatedTags].filter((t) => derivedTags.has(t)).length;
  const falsePos = [...derivedTags].filter((t) => !curatedTags.has(t)).length;
  const falseNeg = [...curatedTags].filter((t) => !derivedTags.has(t)).length;
  const total = Math.max(1, curatedTags.size);
  const tag_match_pct = (matched / total) * 100;
  const false_positive_pct = (falsePos / Math.max(1, derivedTags.size)) * 100;
  const false_negative_pct = (falseNeg / total) * 100;
  const commuterDelta = Math.abs(derived.commuter - curated.commuter_intensity) / Math.max(0.1, curated.commuter_intensity);
  const tourismDelta = Math.abs(derived.tourism - curated.tourism_intensity) / Math.max(0.1, curated.tourism_intensity);
  return {
    tag_match_pct,
    false_positive_pct,
    false_negative_pct,
    commuter_within_25pct: commuterDelta <= 0.25,
    tourism_within_25pct: tourismDelta <= 0.25,
  };
}

// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------

async function main() {
  console.log("Wave 3 spike — WorldPop + Foursquare validation\n");

  const intensity = JSON.parse(fs.readFileSync(INTENSITY_PATH, "utf-8")) as IntensityFile;
  const aRecords = Object.entries(intensity.neighborhoods).filter(
    ([, v]) => v.source_quality === "A",
  );
  console.log(`Found ${aRecords.length} hand-curated A-quality records to validate.\n`);

  let polygons: PolygonsFile | null = null;
  try {
    polygons = JSON.parse(fs.readFileSync(POLYGONS_PATH, "utf-8")) as PolygonsFile;
  } catch {
    console.error(
      "✗ data/spike/neighborhood_polygons_v1.json not found.\n" +
        "  This spike needs GeoJSON polygons for each of the 21 A-records\n" +
        "  before it can fetch WorldPop + Foursquare data.\n" +
        "  See the spike methodology doc for polygon extraction notes.\n",
    );
    process.exit(0);
  }

  if (!process.env.FSQ_PLACES_API_KEY) {
    console.error(
      "✗ FSQ_PLACES_API_KEY not set in .env.local. Aborting before API calls.\n",
    );
    process.exit(0);
  }

  const results: ValidationResult[] = [];
  for (const [key, curated] of aRecords) {
    const polygon = polygons.polygons[key];
    if (!polygon) {
      console.log(`  ${key.padEnd(35)} SKIP (no polygon)`);
      continue;
    }
    const wp = await fetchWorldPop(polygon);
    const fsq = await fetchFoursquareCategories(polygon);
    if (!wp || !fsq) {
      console.log(`  ${key.padEnd(35)} SKIP (API stub returned null)`);
      continue;
    }
    const derived = applyTagRules(key, wp, fsq);
    const s = score(curated, derived);
    results.push({
      key,
      curated: {
        commuter: curated.commuter_intensity,
        tourism: curated.tourism_intensity,
        tags: curated.tags,
      },
      derived,
      ...s,
    });
    console.log(
      `  ${key.padEnd(35)} tag-match=${s.tag_match_pct.toFixed(0)}%  fp=${s.false_positive_pct.toFixed(0)}%  fn=${s.false_negative_pct.toFixed(0)}%`,
    );
  }

  if (results.length === 0) {
    console.log("\nNo results — exiting without writing output.");
    return;
  }

  // Aggregate.
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const aggregateTagMatch = avg(results.map((r) => r.tag_match_pct));
  const aggregateFp = avg(results.map((r) => r.false_positive_pct));
  const aggregateFn = avg(results.map((r) => r.false_negative_pct));
  const commuterPct = (results.filter((r) => r.commuter_within_25pct).length / results.length) * 100;
  const tourismPct = (results.filter((r) => r.tourism_within_25pct).length / results.length) * 100;

  // Pass/fail.
  const passed = aggregateTagMatch >= 80 && aggregateFp <= 15;

  console.log(`\n=== Aggregate ===`);
  console.log(`  tag match:           ${aggregateTagMatch.toFixed(1)}%  (target >= 80%)`);
  console.log(`  false positive:      ${aggregateFp.toFixed(1)}%  (target <= 15%)`);
  console.log(`  false negative:      ${aggregateFn.toFixed(1)}%`);
  console.log(`  commuter ±25%:       ${commuterPct.toFixed(1)}% of cells`);
  console.log(`  tourism ±25%:        ${tourismPct.toFixed(1)}% of cells`);
  console.log(`\n  VERDICT: ${passed ? "PASS — scale to top 50" : "FAIL — stay with hand-curation"}`);

  // Write outputs.
  const outDir = path.resolve(ROOT, "data/spike");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "wave3_validation_results_v1.json"),
    JSON.stringify(
      {
        ran_at: new Date().toISOString(),
        aggregate: {
          tag_match_pct: aggregateTagMatch,
          false_positive_pct: aggregateFp,
          false_negative_pct: aggregateFn,
          commuter_within_25pct: commuterPct,
          tourism_within_25pct: tourismPct,
          verdict: passed ? "PASS" : "FAIL",
        },
        per_cell: results,
      },
      null,
      2,
    ),
  );
  console.log(`\n→ ${path.join(outDir, "wave3_validation_results_v1.json")}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
