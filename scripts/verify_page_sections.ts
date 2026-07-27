/**
 * verify_page_sections - prebuild gate (strict section completeness, 2026-06-13).
 *
 * THE RULE THE FOUNDER SET: every section a page type should have (from his
 * content-map quiz, docs/superpowers/specs/2026-06-11-page-content-map.md) is
 * ALWAYS present on every instance, filled or a calm placeholder, NEVER removed.
 * After whole sections were found self-omitting on thin pages, this gate locks
 * the contract in.
 *
 * For each page type it asserts:
 *   1. the manifest in src/lib/page-sections.ts still covers the canonical id
 *      set below (no section silently dropped from the contract); and
 *   2. the page renders every section, either by mapping its manifest with the
 *      SectionEmpty always-present fallback, or by carrying each id literally.
 *
 * Run: npx tsx scripts/verify_page_sections.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { PAGE_SECTION_MANIFESTS } from "../src/lib/page-sections";

const ROOT = process.cwd();
const rel = (p: string) => p.replace(/\\/g, "/");

// The canonical id set per page type (the contract). The manifest must cover
// these; the page must render them.
const CANONICAL: Record<string, string[]> = {
  cell: [
    "honest-take", "narrative", "plain-terms", "money", "owner-take-home",
    "break-even", "wages", "startup-cost", "seasonality", "first-year",
    "nearby", "related",
  ],
  country: ["decisive", "hire", "neighbours", "cities", "character", "related"],
  city: [
    "customer", "space", "visitors", "owners-keep", "best-areas",
    "neighbourhoods", "changing", "peers",
  ],
  industry: ["typical-operator", "where-it-earns", "margin-waterfall", "related-links"],
  neighbourhood: ["thrives", "who", "operating-cost", "adjacent", "businesses-here"],
  learn: ["pnl", "explanation", "other-businesses", "benchmarks"],
  compare: ["compare-pickers", "compare-grid", "where-each-wins"],
};

// Where each page type renders its sections, and the manifest constant name it
// is expected to map (when it uses the map-the-manifest pattern).
const PAGE_FILE: Record<string, { file: string; constName: string }> = {
  cell: { file: "src/components/cells/CellDecisionStack.tsx", constName: "CELL_SECTIONS" },
  country: { file: "src/app/[country]/page.tsx", constName: "COUNTRY_SECTIONS" },
  city: { file: "src/app/(site)/cities/[slug]/page.tsx", constName: "CITY_SECTIONS" },
  industry: { file: "src/app/(site)/industries/[industry]/page.tsx", constName: "INDUSTRY_SECTIONS" },
  neighbourhood: { file: "src/components/NeighborhoodOverview.tsx", constName: "NEIGHBOURHOOD_SECTIONS" },
  learn: { file: "src/app/(site)/learn/[slug]/page.tsx", constName: "LEARN_SECTIONS" },
  compare: { file: "src/app/(site)/compare/CompareClient.tsx", constName: "COMPARE_SECTIONS" },
};

const failures: string[] = [];

for (const [type, ids] of Object.entries(CANONICAL)) {
  // 1. The manifest covers the canonical ids.
  const manifest = PAGE_SECTION_MANIFESTS[type] ?? [];
  const manifestIds = new Set(manifest.map((s) => s.id));
  for (const id of ids) {
    if (!manifestIds.has(id)) {
      failures.push(
        `[${type}] manifest in src/lib/page-sections.ts is missing required section "${id}"`,
      );
    }
  }

  // 2. The page renders every section.
  const { file, constName } = PAGE_FILE[type];
  const abs = resolve(ROOT, file);
  if (!existsSync(abs)) {
    failures.push(`[${type}] page file missing: ${file}`);
    continue;
  }
  const src = readFileSync(abs, "utf-8");

  // Pattern A: the page renders the manifest with the always-present empty
  // fallback (presence is structural). Two equivalent forms qualify:
  //   - it maps the manifest and renders a per-section SectionEmpty fallback; or
  //   - it passes the manifest to groupSectionStack, which maps it internally and
  //     collapses long runs of empties into StillFillingIn while keeping every
  //     section's anchor (round 5).
  const usesGroupedHelper =
    src.includes(constName) && src.includes("groupSectionStack");
  const mapsManifest =
    src.includes(constName) &&
    src.includes(".map(") &&
    (src.includes("SectionEmpty") || src.includes("StillFillingIn"));

  if (usesGroupedHelper || mapsManifest) continue; // covered structurally

  // Pattern B: the page carries each id literally (bespoke sections). Every
  // canonical id must appear as "<id>" somewhere in the file.
  const missing = ids.filter((id) => !src.includes(`"${id}"`));
  if (missing.length > 0) {
    failures.push(
      `[${type}] ${rel(file)} neither maps ${constName} with a SectionEmpty fallback ` +
        `nor renders these ids literally: ${missing.join(", ")}`,
    );
  }
}

if (failures.length === 0) {
  console.log(
    "[verify_page_sections] PASS: every page type renders its full content-map " +
      "section set (filled or placeholder, never dropped).",
  );
  process.exit(0);
}

console.error(`[verify_page_sections] FAIL: ${failures.length} issue(s):`);
for (const f of failures) console.error(`  ${f}`);
console.error(
  "\nEvery required section must ALWAYS render: map the page-sections manifest " +
    "with a SectionEmpty placeholder for empty data, or carry each id literally. " +
    "Do not self-omit a required section.",
);
process.exit(1);
