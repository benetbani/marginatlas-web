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
import { readFileSync } from "node:fs";
import { red, redSummary } from "./lib/red";

/**
 * THE RED NAMES THE JSON LINE (2026-09-17, plan-2026-09-17/02-ERRORS.md step
 * 16). The taxonomy is two data files, and every error is about one entry in
 * one of them, so each error carries the file and the id of the entry it is
 * about; the line is the line that declares that id, found when the report
 * prints. What is checked did not change; what a failure prints did.
 */
const SECTORS_FILE = "src/lib/taxonomy/sectors.json";
const INDUSTRIES_FILE = "src/lib/taxonomy/industries.json";
const RULE = "taxonomy";

type Where = { file: string; id?: string };
type Issue = { code: string; level: "error" | "warn"; message: string; where: Where; remedy: string };
const issues: Issue[] = [];

function err(code: string, msg: string, where: Where, remedy: string) {
  issues.push({ code, level: "error", message: msg, where, remedy });
}
function warn(code: string, msg: string) {
  issues.push({ code, level: "warn", message: msg, where: { file: SECTORS_FILE }, remedy: "" });
}

/** The line on which the entry with this id is declared, or undefined. */
const idLine = (() => {
  const cache = new Map<string, string[]>();
  return (file: string, id: string | undefined): number | undefined => {
    if (!id) return undefined;
    if (!cache.has(file)) cache.set(file, readFileSync(file, "utf8").split("\n"));
    const i = cache.get(file)!.findIndex((l) => l.includes(`"id": "${id}"`));
    return i === -1 ? undefined : i + 1;
  };
})();

// (1)
for (const ind of INDUSTRIES) {
  if (!SECTOR_BY_ID[ind.sector_id]) {
    err(
      "ORPHAN_INDUSTRY",
      `industry "${ind.id}" points at sector "${ind.sector_id}", which ${SECTORS_FILE} does not hold`,
      { file: INDUSTRIES_FILE, id: ind.id },
      `set sector_id to a sector in ${SECTORS_FILE}, or add the sector there`,
    );
  }
}

// (2)
for (const ind of INDUSTRIES) {
  if (ind.parent_id && !INDUSTRY_BY_ID[ind.parent_id]) {
    err(
      "ORPHAN_PARENT",
      `industry "${ind.id}" has parent_id "${ind.parent_id}", which no industry declares`,
      { file: INDUSTRIES_FILE, id: ind.id },
      "set parent_id to an existing industry id, or remove it",
    );
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
      err(
        "FORBIDDEN_WORD",
        `default-visible sector "${s.id}" has the forbidden word "${word}" in its name "${s.name}"`,
        { file: SECTORS_FILE, id: s.id },
        `rename the sector without "${word}", or set its audience_default to hidden`,
      );
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
    err(
      "BROKEN_LEGACY_ALIAS",
      `legacy sector "${v3}" is aliased to "${target}", which is not a v4 sector`,
      { file: SECTORS_FILE, id: target },
      `move "${v3}" into the legacy_aliases of a sector that exists`,
    );
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
    err(
      "DUPLICATE_ORDER",
      `display_order ${order} is shared by ${ids.length} sectors: ${ids.join(", ")}`,
      { file: SECTORS_FILE, id: ids[0] },
      `give each of ${ids.join(", ")} its own display_order`,
    );
  }
}

// (7)
const expectedAnchors = ["food_drink", "retail_shops", "beauty_wellness"];
const firstThree = defaultSectors.slice(0, 3).map((s) => s.id);
for (let i = 0; i < expectedAnchors.length; i++) {
  if (firstThree[i] !== expectedAnchors[i]) {
    err(
      "MISORDERED_ANCHORS",
      `position ${i + 1} of the visible sectors should be "${expectedAnchors[i]}" and is "${firstThree[i] || "(missing)"}"; the first three are ${firstThree.join(", ")}`,
      { file: SECTORS_FILE, id: expectedAnchors[i] },
      `set display_order so that ${expectedAnchors.join(", ")} come first and are visible`,
    );
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
  console.log("");
  for (const e of errors) {
    red({
      rule: RULE,
      file: e.where.file,
      line: idLine(e.where.file, e.where.id),
      detail: `${e.code}: ${e.message}`,
      remedy: e.remedy,
    });
  }
  redSummary(RULE, errors.length, `fix each entry named above in ${SECTORS_FILE} or ${INDUSTRIES_FILE}`, `${warnings.length} warnings besides`);
  process.exit(1);
}

console.log("\n  ✓ Taxonomy verification passed\n");
