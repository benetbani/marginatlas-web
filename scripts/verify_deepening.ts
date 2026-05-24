/**
 * Prebuild gate: deepening framework integrity (Plan v32 Sprint G, Phase 0f).
 *
 * Enforces:
 *
 *  1. Every sub-industry seed entry has a valid parent_industry_id
 *     (i.e. the parent exists in taxonomy.ts).
 *
 *  2. Sub-industry ids follow the convention `<parent_id>_<variant>`
 *     so the chip URLs and the analytics-event names stay predictable.
 *
 *  3. Fabrication policy: any seed entry with data_ready=true must
 *     reference a parent that actually exists, AND must have a
 *     non-empty description (so we don't ship a variant called
 *     "Quick service" with no human-readable explanation).
 *
 *  4. Sub-industry ids are globally unique.
 *
 *  5. The deepening type file and the section registry file both
 *     exist (sanity check; catches accidental deletion).
 *
 * Run: `npx tsx scripts/verify_deepening.ts`
 * Exit 1 on any violation.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const errors: string[] = [];

function fileExists(path: string): boolean {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

// 5. Required files
const REQUIRED_FILES = [
  "src/lib/types/deepening.ts",
  "src/lib/page-layout/section-registry.ts",
  "src/lib/taxonomy/sub_industries_seed.ts",
  "src/components/sections/SubIndustryPicker.tsx",
  "src/components/sections/AnnualCostStack.tsx",
  "src/components/sections/SetupCostBlock.tsx",
];

for (const rel of REQUIRED_FILES) {
  const full = resolve(ROOT, rel);
  if (!fileExists(full)) {
    errors.push(`missing required deepening file: ${rel}`);
  }
}

if (errors.length > 0) {
  console.error("\n✗ Deepening framework integrity check failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

// Now load the seed dynamically. Use require via tsx's runtime
// (this script runs under tsx so TS imports are fine).
import { SUB_INDUSTRIES_SEED } from "@/lib/taxonomy/sub_industries_seed";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";

const seenIds = new Set<string>();
for (const variant of SUB_INDUSTRIES_SEED) {
  // 4. Globally unique
  if (seenIds.has(variant.id)) {
    errors.push(`duplicate sub-industry id: ${variant.id}`);
  }
  seenIds.add(variant.id);

  // 1. Parent exists
  if (!INDUSTRY_BY_ID[variant.parent_industry_id]) {
    errors.push(
      `sub-industry ${variant.id}: parent_industry_id "${variant.parent_industry_id}" not in taxonomy`,
    );
  }

  // 2. Convention: id starts with parent_id + "_"
  if (!variant.id.startsWith(variant.parent_industry_id + "_")) {
    errors.push(
      `sub-industry ${variant.id}: id must start with "${variant.parent_industry_id}_" for URL / analytics consistency`,
    );
  }

  // 3. Fabrication policy when data_ready=true
  if (variant.data_ready) {
    if (!variant.description || variant.description.trim().length < 10) {
      errors.push(
        `sub-industry ${variant.id} is data_ready=true but description is missing or too short; readers need context before we show a variant publicly`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error("\n✗ Sub-industry seed validation failed:");
  for (const e of errors) console.error("  - " + e);
  console.error(
    "\n  Fabrication policy (founder, hard): a sub-industry variant",
  );
  console.error(
    "  ships only when sourced from real primary data. Pure parent-",
  );
  console.error(
    "  industry extrapolation does not qualify. Fix the seed entries",
  );
  console.error("  or revert data_ready to false.\n");
  process.exit(1);
}

console.log(
  `✓ Deepening framework OK: ${SUB_INDUSTRIES_SEED.length} sub-industries, ${SUB_INDUSTRIES_SEED.filter((v) => v.data_ready).length} ready to render.`,
);
