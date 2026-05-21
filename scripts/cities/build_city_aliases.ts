/**
 * Plan v22 Block E — build the public-facing city alias table.
 *
 * Input sources:
 *   - src/lib/cities/top100.json (curated, has region + tier + status)
 *   - src/lib/regions/regions_generated.ts (city-level entries from regional_cells)
 *
 * Output: src/lib/cities/city_aliases_generated.ts with two maps:
 *
 *   CITY_FRIENDLY_TO_GEO_ID  Record<country, Record<friendlySlug, geoId>>
 *   CITIES_BY_STATE          Record<country, Record<regionSlug, friendlySlug[]>>
 *
 * Friendly slug = lowercase-kebab city name (e.g. "Los Angeles" → "los-angeles").
 * State slug for US = lowercase state name (e.g. "California" → "california").
 *
 * Run: `npx tsx scripts/cities/build_city_aliases.ts`
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

type Top100Entry = {
  id: string;
  name: string;
  country: string;
  country_name: string;
  region: string;
  region_name: string;
  tier: 1 | 2 | 3;
  population: number;
  slug: string;
  geo_id: string;
  data_status: "measured" | "extrapolated" | "missing";
};

// US state code (e.g. "CA") → state slug ("california")
const US_STATE_CODE_TO_SLUG: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas",
  CA: "california", CO: "colorado", CT: "connecticut", DE: "delaware",
  DC: "district-of-columbia", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana",
  IA: "iowa", KS: "kansas", KY: "kentucky", LA: "louisiana",
  ME: "maine", MD: "maryland", MA: "massachusetts", MI: "michigan",
  MN: "minnesota", MS: "mississippi", MO: "missouri", MT: "montana",
  NE: "nebraska", NV: "nevada", NH: "new-hampshire", NJ: "new-jersey",
  NM: "new-mexico", NY: "new-york", NC: "north-carolina",
  ND: "north-dakota", OH: "ohio", OK: "oklahoma", OR: "oregon",
  PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina",
  SD: "south-dakota", TN: "tennessee", TX: "texas", UT: "utah",
  VT: "vermont", VA: "virginia", WA: "washington", WV: "west-virginia",
  WI: "wisconsin", WY: "wyoming",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function main() {
  const top100 = JSON.parse(
    readFileSync(resolve(ROOT, "src/lib/cities/top100.json"), "utf-8"),
  ) as { cities: Top100Entry[] };

  // Map: country → friendlySlug → geoId
  const aliasMap: Record<string, Record<string, string>> = {};
  // Map: country → stateSlug → [friendlySlug...]
  const stateMap: Record<string, Record<string, string[]>> = {};

  for (const city of top100.cities) {
    const c = city.country.toUpperCase();
    const friendlySlug = slugify(city.name);
    if (!aliasMap[c]) aliasMap[c] = {};
    aliasMap[c][friendlySlug] = city.geo_id.toLowerCase();

    // State mapping: only US for now (region is state code)
    if (c === "US") {
      const stateSlug = US_STATE_CODE_TO_SLUG[city.region];
      if (stateSlug) {
        if (!stateMap[c]) stateMap[c] = {};
        if (!stateMap[c][stateSlug]) stateMap[c][stateSlug] = [];
        if (!stateMap[c][stateSlug].includes(friendlySlug)) {
          stateMap[c][stateSlug].push(friendlySlug);
        }
      }
    } else {
      // Non-US: index by region_name slug
      const regionSlug = slugify(city.region_name || city.region);
      if (regionSlug) {
        if (!stateMap[c]) stateMap[c] = {};
        if (!stateMap[c][regionSlug]) stateMap[c][regionSlug] = [];
        if (!stateMap[c][regionSlug].includes(friendlySlug)) {
          stateMap[c][regionSlug].push(friendlySlug);
        }
      }
    }
  }

  // Also pull city-overlay entries from regions_generated to expand coverage.
  // Pattern: { value: "us-city-los-angeles", level: "city", ... }
  const regionsTs = readFileSync(
    resolve(ROOT, "src/lib/regions/regions_generated.ts"),
    "utf-8",
  );
  const cityOverlayRegex = /\{ value: "([a-z]{2})-city-([a-z0-9-]+)", label: "([^"]+)", level: "city", parent: [a-z"]+\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = cityOverlayRegex.exec(regionsTs)) !== null) {
    const iso2 = m[1].toUpperCase();
    const citySegment = m[2];
    const cityLabel = m[3];
    const friendly = slugify(cityLabel);
    if (!aliasMap[iso2]) aliasMap[iso2] = {};
    // Only add if not already present (top100 takes priority)
    if (!aliasMap[iso2][friendly]) {
      aliasMap[iso2][friendly] = `${iso2.toLowerCase()}-city-${citySegment}`;
    }
  }

  // Also build the friendly-slug → display-label map (for grammar fix).
  // From top100: use city.name. From overlay: use the label from regions.
  const labelMap: Record<string, Record<string, string>> = {};
  for (const city of top100.cities) {
    const c = city.country.toUpperCase();
    const friendlySlug = slugify(city.name);
    if (!labelMap[c]) labelMap[c] = {};
    labelMap[c][friendlySlug] = city.name;
  }
  // Re-scan regions_generated for city overlay labels
  const cityOverlayRegex2 = /\{ value: "([a-z]{2})-city-([a-z0-9-]+)", label: "([^"]+)", level: "city", parent: [a-z"]+\s*\}/g;
  let mm: RegExpExecArray | null;
  while ((mm = cityOverlayRegex2.exec(regionsTs)) !== null) {
    const iso2 = mm[1].toUpperCase();
    const cityLabel = mm[3];
    const friendly = slugify(cityLabel);
    if (!labelMap[iso2]) labelMap[iso2] = {};
    if (!labelMap[iso2][friendly]) {
      labelMap[iso2][friendly] = cityLabel;
    }
  }

  // Write the generated TS module.
  const lines: string[] = [];
  lines.push("/**");
  lines.push(" * AUTO-GENERATED by scripts/cities/build_city_aliases.ts");
  lines.push(" * Plan v22 Block E + v23 Part 1 — friendly city slug -> geo_id + display label.");
  lines.push(" * Re-run when adding new curated cities:");
  lines.push(" *   npx tsx scripts/cities/build_city_aliases.ts");
  lines.push(" */");
  lines.push("");
  lines.push("/** country (ISO-2 upper) -> friendly city slug -> underlying geo_id (lowercase) */");
  lines.push("export const CITY_FRIENDLY_TO_GEO_ID: Record<string, Record<string, string>> = {");
  for (const c of Object.keys(aliasMap).sort()) {
    lines.push(`  ${c}: {`);
    for (const slug of Object.keys(aliasMap[c]).sort()) {
      lines.push(`    ${JSON.stringify(slug)}: ${JSON.stringify(aliasMap[c][slug])},`);
    }
    lines.push("  },");
  }
  lines.push("};");
  lines.push("");
  lines.push("/** country (ISO-2 upper) → region/state slug → list of city friendly slugs */");
  lines.push("export const CITIES_BY_STATE: Record<string, Record<string, string[]>> = {");
  for (const c of Object.keys(stateMap).sort()) {
    lines.push(`  ${c}: {`);
    for (const state of Object.keys(stateMap[c]).sort()) {
      const cities = stateMap[c][state];
      lines.push(`    ${JSON.stringify(state)}: ${JSON.stringify(cities)},`);
    }
    lines.push("  },");
  }
  lines.push("};");

  // Emit the label map after the existing two maps
  lines.push("");
  lines.push("/** country (ISO-2 upper) -> friendly city slug -> canonical display label. */");
  lines.push("/** Used to override cell.geo_name when the URL used a friendly alias, so   */");
  lines.push("/** /es/barcelona/restaurants always renders 'Barcelona', never 'ES' or a   */");
  lines.push("/** malformed DB value like 'Tokoto'. Plan v23 Part 1 grammar fix.          */");
  lines.push("export const CITY_FRIENDLY_DISPLAY_LABEL: Record<string, Record<string, string>> = {");
  for (const c of Object.keys(labelMap).sort()) {
    lines.push(`  ${c}: {`);
    for (const slug of Object.keys(labelMap[c]).sort()) {
      lines.push(`    ${JSON.stringify(slug)}: ${JSON.stringify(labelMap[c][slug])},`);
    }
    lines.push("  },");
  }
  lines.push("};");

  const outPath = resolve(ROOT, "src/lib/cities/city_aliases_generated.ts");
  writeFileSync(outPath, lines.join("\n"));

  const totalAliases = Object.values(aliasMap).reduce((s, m) => s + Object.keys(m).length, 0);
  const totalStates = Object.values(stateMap).reduce(
    (s, m) => s + Object.keys(m).length,
    0,
  );
  console.log(`✓ Wrote ${outPath}`);
  console.log(`  ${Object.keys(aliasMap).length} countries`);
  console.log(`  ${totalAliases} friendly-slug aliases`);
  console.log(`  ${totalStates} regions/states with city lists`);
}

main();
