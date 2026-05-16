/**
 * verify_taxonomy.ts — Plan v4.0 Step 10.
 *
 * Run via `npm run verify:taxonomy` or implicitly via `prebuild`.
 * Fails the build if the taxonomy violates structural invariants.
 *
 * Invariants checked:
 *  1. Every industry's `sector_id` resolves to a real sector.
 *  2. Every sub-niche's `parent_id` resolves to a real industry.
 *  3. Every visible sector has at least 3 visible children (skip warning
 *     for the 5 Pro-only sectors).
 *  4. No visible sector has the word 'Banking' / 'Mining' / 'Energy' /
 *     'Pharma' / 'Telecom' (default mode).
 *  5. Each `legacy_aliases` entry from the v3 schema resolves to a v4 sector.
 *  6. Display_order is unique within visible sectors (no ties).
 *  7. The first three visible sectors are SMB-friendly anchors
 *     (food_drink, retail_shops, beauty_wellness).
 */

import {
  SECTORS,
  SECTOR_BY_ID,
  INDUSTRIES,
  INDUSTRY_BY_ID,
  visibleSectors,
  visibleIndustriesInSector,
  LEGACY_SECTOR_ALIAS,
} from "../src/lib/taxonomy";

type Issue = { code: string; level: "error" | "warn"; message: string };
const issues: Issue[] = [];

function err(code: string, msg: string) {
  issues.push({ code, level: "error", message: msg });
}
function warn(code: string, msg: string) {
  issues.push({ code, level: "warn", message: msg });
}

// (1)
for (const ind of INDUSTRIES) {
  if (!SECTOR_BY_ID[ind.sector_id]) {
    err("ORPHAN_INDUSTRY", `Industry "${ind.id}" → unknown sector "${ind.sector_id}"`);
  }
}

// (2)
for (const ind of INDUSTRIES) {
  if (ind.parent_id && !INDUSTRY_BY_ID[ind.parent_id]) {
    err("ORPHAN_PARENT", `Industry "${ind.id}" has parent_id "${ind.parent_id}" which does not exist`);
  }
}

// (3)
const defaultSectors = visibleSectors({});
for (const s of defaultSectors) {
  const visible = visibleIndustriesInSector(s.id, {});
  if (visible.length < 3) {
    warn("THIN_SECTOR", `Visible sector "${s.id}" has only ${visible.length} visible industries`);
  }
}

// (4)
const FORBIDDEN_WORDS = ["banking", "mining", "energy", "pharma", "telecom"];
for (const s of defaultSectors) {
  const lower = s.name.toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word)) {
      err("FORBIDDEN_WORD", `Default-visible sector "${s.id}" has forbidden word "${word}" in name: "${s.name}"`);
    }
  }
}

// (5)
const v3Sectors = new Set([
  "agriculture", "mining_energy", "manufacturing", "construction", "wholesale",
  "retail", "transport_logistics", "hotels_food", "information_media",
  "finance_real_estate", "professional_services", "admin_support", "education",
  "healthcare", "arts_entertainment", "personal_services",
]);
for (const v3 of v3Sectors) {
  const target = LEGACY_SECTOR_ALIAS[v3];
  if (!target) {
    warn("MISSING_LEGACY_ALIAS", `Legacy sector "${v3}" has no alias in any v4 sector's legacy_aliases — old URLs may 404`);
  } else if (!SECTOR_BY_ID[target]) {
    err("BROKEN_LEGACY_ALIAS", `Legacy "${v3}" maps to non-existent v4 sector "${target}"`);
  }
}

// (6)
const orderMap = new Map<number, string[]>();
for (const s of SECTORS) {
  const o = s.display_order ?? -1;
  if (o < 0) continue;
  if (!orderMap.has(o)) orderMap.set(o, []);
  orderMap.get(o)!.push(s.id);
}
for (const [order, ids] of orderMap.entries()) {
  if (ids.length > 1) {
    err("DUPLICATE_ORDER", `display_order ${order} is shared by ${ids.length} sectors: ${ids.join(", ")}`);
  }
}

// (7)
const expectedAnchors = ["food_drink", "retail_shops", "beauty_wellness"];
const firstThree = defaultSectors.slice(0, 3).map((s) => s.id);
for (let i = 0; i < expectedAnchors.length; i++) {
  if (firstThree[i] !== expectedAnchors[i]) {
    err("MISORDERED_ANCHORS",
      `Position ${i + 1} should be "${expectedAnchors[i]}", got "${firstThree[i] || "(missing)"}". ` +
      `First three visible sectors are currently: ${firstThree.join(", ")}`);
  }
}

// Report
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warn");

console.log("\n=== Taxonomy verification ===");
console.log(`  sectors total:        ${SECTORS.length}`);
console.log(`  sectors visible:      ${defaultSectors.length}`);
console.log(`  industries total:     ${INDUSTRIES.length}`);
const visibleCount = SECTORS.reduce(
  (n, s) => n + visibleIndustriesInSector(s.id, {}).length,
  0
);
console.log(`  industries visible:   ${visibleCount}`);
console.log(`  legacy aliases:       ${Object.keys(LEGACY_SECTOR_ALIAS).length}`);

if (warnings.length) {
  console.log(`\n  warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`    ⚠ ${w.code}: ${w.message}`);
}

if (errors.length) {
  console.log(`\n  errors (${errors.length}):`);
  for (const e of errors) console.log(`    ✗ ${e.code}: ${e.message}`);
  console.log("\n  ✗ Taxonomy verification FAILED\n");
  process.exit(1);
}

console.log("\n  ✓ Taxonomy verification passed\n");
