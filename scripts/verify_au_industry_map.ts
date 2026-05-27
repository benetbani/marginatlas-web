/**
 * scripts/verify_au_industry_map.ts
 *
 * Phase 1b prebuild gate. Enforces:
 *
 *   R1. Every ATO industry parsed in the JSON has an entry in
 *       src/lib/economic_profile/au_industry_map.ts (or vice versa,
 *       no orphans on either side).
 *   R2. Every non-null ma_id resolves to a real MA industry in the
 *       taxonomy. (Catches typos and stale references after taxonomy
 *       changes.)
 *   R3. Every entry has a `confidence` value.
 *
 * Run: npx tsx scripts/verify_au_industry_map.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const JSON_PATH = path.resolve(ROOT, "data/finance/au_primary_benchmarks_v1.json");
const MAP_PATH = path.resolve(ROOT, "src/lib/economic_profile/au_industry_map.ts");
const TAXONOMY_PATH = path.resolve(ROOT, "src/lib/taxonomy/industries.json");

type ParsedFile = { industries: Record<string, unknown> };
type Taxonomy = { industries: Array<{ id: string }> };

const parsed = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8")) as ParsedFile;
const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, "utf-8")) as Taxonomy;
const mapSrc = fs.readFileSync(MAP_PATH, "utf-8");
const maIds = new Set(taxonomy.industries.map((i) => i.id));

// Extract slug -> ma_id pairs from the AU_TO_MA_INDUSTRY_MAP body.
// Match either `slug: { ma_id: "value", ... }` or `slug: { ma_id: null, ... }`.
const mapEntries: Array<{ slug: string; maId: string | null; hasConfidence: boolean }> = [];
const reEntry = /^\s+([a-z0-9_]+):\s*\{[\s\S]*?\}\s*,\s*$/gm;
const reMaId = /ma_id:\s*("([^"]+)"|null)/;
const reConfidence = /confidence:\s*"(exact|close|approximate|none)"/;
let m: RegExpExecArray | null;
while ((m = reEntry.exec(mapSrc)) !== null) {
  const slug = m[1];
  const body = m[0];
  const idMatch = body.match(reMaId);
  if (!idMatch) continue;
  const maId = idMatch[2] ?? null;
  const hasConfidence = reConfidence.test(body);
  mapEntries.push({ slug, maId, hasConfidence });
}

let failures = 0;
let warnings = 0;
const messages: string[] = [];

console.log("=== verify_au_industry_map ===");
console.log(`  ATO parsed: ${Object.keys(parsed.industries).length} industries`);
console.log(`  Map entries: ${mapEntries.length}`);

const mapSlugs = new Set(mapEntries.map((e) => e.slug));
const parsedSlugs = new Set(Object.keys(parsed.industries));

// R1: bidirectional coverage.
const inParsedNotMap: string[] = [];
const inMapNotParsed: string[] = [];
for (const s of parsedSlugs) if (!mapSlugs.has(s)) inParsedNotMap.push(s);
for (const s of mapSlugs) if (!parsedSlugs.has(s)) inMapNotParsed.push(s);
if (inParsedNotMap.length > 0) {
  for (const s of inParsedNotMap.slice(0, 20))
    messages.push(`ATO slug "${s}" parsed but not mapped`);
  failures += inParsedNotMap.length;
}
if (inMapNotParsed.length > 0) {
  for (const s of inMapNotParsed.slice(0, 20))
    messages.push(`Map slug "${s}" not found in parsed JSON (stale entry?)`);
  failures += inMapNotParsed.length;
}

// R2: every non-null ma_id resolves.
const exactCount: Record<string, number> = { exact: 0, close: 0, approximate: 0, none: 0 };
for (const { slug, maId, hasConfidence } of mapEntries) {
  if (!hasConfidence) {
    messages.push(`[${slug}] missing confidence field`);
    failures++;
  }
  if (maId !== null && !maIds.has(maId)) {
    messages.push(`[${slug}] ma_id "${maId}" not in taxonomy/industries.json`);
    failures++;
  }
  // Don't count individual confidence levels in this pass.
}

// Confidence distribution (informational).
const reEntryFull = /^\s+([a-z0-9_]+):\s*\{[\s\S]*?confidence:\s*"(exact|close|approximate|none)"[\s\S]*?\}\s*,\s*$/gm;
let cMatch: RegExpExecArray | null;
while ((cMatch = reEntryFull.exec(mapSrc)) !== null) {
  exactCount[cMatch[2]] = (exactCount[cMatch[2]] || 0) + 1;
}
console.log(`  Confidence distribution: exact=${exactCount.exact}, close=${exactCount.close}, approximate=${exactCount.approximate}, none=${exactCount.none}`);

// Coverage summary.
const nullCount = mapEntries.filter((e) => e.maId === null).length;
const mappedCount = mapEntries.length - nullCount;
console.log(`  Mapped to MA: ${mappedCount},  null (no MA equivalent): ${nullCount}`);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const msg of messages.slice(0, 30)) console.log("  - " + msg);
  process.exit(1);
}
if (warnings > 0) console.log(`  ${warnings} warnings.`);
console.log("\n  GATE: PASS");
