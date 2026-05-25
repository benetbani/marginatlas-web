/**
 * scan_city_alias_gaps.ts
 *
 * The Lyon-class scan. For every city in city_list_v1.json, checks
 * whether it resolves to a meaningful geo_id via the alias chain.
 * Cities whose lookup falls through to the upper-cased slug (e.g.
 * "lyon" -> "LYON") get no real DB match and render synthesized
 * country-level numbers mislabeled as the city. The founder reported
 * the symptom on Lyon; we scan for every other instance.
 *
 * Output: coverage/city_alias_gaps.csv
 * Run: npx tsx scripts/audit/scan_city_alias_gaps.ts
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const ROOT = process.cwd();

type City = { slug: string; name: string; iso2: string; tier: number };

const cityList = JSON.parse(
  readFileSync(resolve(ROOT, "data/cities/city_list_v1.json"), "utf-8"),
) as { cities: City[] };

const manualSrc = readFileSync(
  resolve(ROOT, "src/lib/cities/manual_city_aliases.ts"),
  "utf-8",
);
const autoSrc = readFileSync(
  resolve(ROOT, "src/lib/cities/city_aliases_generated.ts"),
  "utf-8",
);

type Alias = { geo_id: string; label?: string };
const MANUAL: Record<string, Record<string, Alias>> = {};

let currentCountry: string | null = null;
for (const line of manualSrc.split(/\r?\n/)) {
  const countryMatch = line.match(/^\s{2}([A-Z]{2}):\s*\[/);
  if (countryMatch) {
    currentCountry = countryMatch[1];
    MANUAL[currentCountry] ??= {};
    continue;
  }
  const closeMatch = line.match(/^\s{2}\],?\s*$/);
  if (closeMatch) {
    currentCountry = null;
    continue;
  }
  if (!currentCountry) continue;
  const aliasMatch = line.match(
    /\{\s*slug:\s*"([^"]+)"\s*,\s*geo_id:\s*"([^"]+)"(?:\s*,\s*label:\s*"([^"]+)")?\s*\}/,
  );
  if (aliasMatch) {
    const [, slug, geo_id, label] = aliasMatch;
    MANUAL[currentCountry][slug] = { geo_id, label };
  }
}

const AUTO: Record<string, Record<string, string>> = {};
let autoCountry: string | null = null;
for (const line of autoSrc.split(/\r?\n/)) {
  const countryMatch = line.match(/^\s+([A-Z]{2}):\s*\{/);
  if (countryMatch) {
    autoCountry = countryMatch[1];
    AUTO[autoCountry] ??= {};
    continue;
  }
  const closeMatch = line.match(/^\s+\},?\s*$/);
  if (closeMatch) {
    autoCountry = null;
    continue;
  }
  if (!autoCountry) continue;
  const m = line.match(/"([^"]+)":\s*"([^"]+)"/);
  if (m) {
    AUTO[autoCountry][m[1]] = m[2];
  }
}

type Row = {
  slug: string;
  iso2: string;
  tier: number;
  name: string;
  status: "OK" | "GAP";
  resolved_geo_id: string;
  source: "manual" | "auto" | "none";
};

const rows: Row[] = [];
for (const city of cityList.cities) {
  const iso = city.iso2.toUpperCase();
  const slug = city.slug.toLowerCase();
  const manual = MANUAL[iso]?.[slug];
  if (manual) {
    rows.push({
      slug, iso2: iso, tier: city.tier, name: city.name,
      status: "OK", resolved_geo_id: manual.geo_id, source: "manual",
    });
    continue;
  }
  const auto = AUTO[iso]?.[slug];
  if (auto) {
    rows.push({
      slug, iso2: iso, tier: city.tier, name: city.name,
      status: "OK", resolved_geo_id: auto, source: "auto",
    });
    continue;
  }
  rows.push({
    slug, iso2: iso, tier: city.tier, name: city.name,
    status: "GAP", resolved_geo_id: "", source: "none",
  });
}

const gaps = rows.filter((r) => r.status === "GAP");
const byTier: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
const gapByCountry: Record<string, number> = {};
for (const g of gaps) {
  byTier[g.tier] = (byTier[g.tier] ?? 0) + 1;
  gapByCountry[g.iso2] = (gapByCountry[g.iso2] ?? 0) + 1;
}

const reportPath = resolve(ROOT, "coverage/city_alias_gaps.csv");
mkdirSync(dirname(reportPath), { recursive: true });
const header = "slug,iso2,tier,name,status,resolved_geo_id,source";
const csv = [
  header,
  ...rows.map(
    (r) =>
      `${r.slug},${r.iso2},${r.tier},${JSON.stringify(r.name)},${r.status},${r.resolved_geo_id},${r.source}`,
  ),
].join("\n");
writeFileSync(reportPath, csv + "\n", "utf-8");

console.log(`scan_city_alias_gaps complete.`);
console.log(`  Total cities: ${rows.length}`);
console.log(`  OK: ${rows.length - gaps.length}`);
console.log(`  GAP: ${gaps.length}`);
console.log(`  By tier: T1=${byTier[1]} T2=${byTier[2]} T3=${byTier[3]}`);
console.log(`  Report: ${reportPath}`);
console.log("");
console.log("Top 20 gap countries (most cities missing aliases):");
Object.entries(gapByCountry)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([iso, n]) => console.log(`  ${iso}: ${n}`));
console.log("");
console.log("All tier-1 (global) and tier-2 (major regional) gaps:");
const priorityGaps = gaps.filter((g) => g.tier <= 2);
priorityGaps.forEach((g) => console.log(`  ${g.iso2}/${g.slug} (T${g.tier}): ${g.name}`));
