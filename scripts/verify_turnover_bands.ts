/**
 * scripts/verify_turnover_bands.ts
 *
 * ATO Phase 6 — prebuild gate enforcing the structure of
 * data/finance/turnover_bands_v1.json.
 *
 * Rules:
 *   R1. default_bands present with all three keys (small/medium/large).
 *   R2. Each band has min_usd and max_usd; max can be null only on
 *       "large".
 *   R3. Thresholds are positive and monotonically non-decreasing
 *       (small.max <= medium.max <= large.max, with null treated as
 *       infinity).
 *   R4. Adjacent bands meet at the same threshold (small.max ===
 *       medium.min, medium.max === large.min).
 *   R5. by_sector entries follow the same rules.
 *   R6. Every sector referenced in by_sector exists in
 *       industry_cost_profile_v1.json's sectors map.
 *
 * Run: npx tsx scripts/verify_turnover_bands.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BANDS_PATH = path.resolve(ROOT, "data/finance/turnover_bands_v1.json");
const PROFILE_PATH = path.resolve(ROOT, "data/finance/industry_cost_profile_v1.json");

type Range = { min_usd: number; max_usd: number | null };
type SectorBands = { small: Range; medium: Range; large: Range };
type FileShape = {
  version: string;
  default_bands: SectorBands;
  by_sector: Record<string, SectorBands>;
};

const bands = JSON.parse(fs.readFileSync(BANDS_PATH, "utf-8")) as FileShape;
const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as {
  sectors: Record<string, unknown>;
};

let failures = 0;
const messages: string[] = [];

function checkBand(label: string, b: SectorBands): void {
  const required = ["small", "medium", "large"] as const;
  for (const key of required) {
    const r = b[key];
    if (!r) {
      messages.push(`[${label}] missing ${key} band`);
      failures++;
      continue;
    }
    if (typeof r.min_usd !== "number" || r.min_usd < 0) {
      messages.push(`[${label}] ${key}.min_usd invalid: ${r.min_usd}`);
      failures++;
    }
    if (key !== "large" && (typeof r.max_usd !== "number" || r.max_usd <= 0)) {
      messages.push(`[${label}] ${key}.max_usd must be positive number, got: ${r.max_usd}`);
      failures++;
    }
  }
  if (!b.small || !b.medium || !b.large) return;
  // R3 + R4: monotonic and meeting.
  if (b.small.max_usd != null && b.medium.max_usd != null) {
    if (b.small.max_usd > b.medium.max_usd) {
      messages.push(`[${label}] small.max (${b.small.max_usd}) > medium.max (${b.medium.max_usd})`);
      failures++;
    }
    if (b.medium.min_usd !== b.small.max_usd) {
      messages.push(`[${label}] medium.min (${b.medium.min_usd}) does not meet small.max (${b.small.max_usd})`);
      failures++;
    }
  }
  if (b.medium.max_usd != null && b.large.min_usd !== b.medium.max_usd) {
    messages.push(`[${label}] large.min (${b.large.min_usd}) does not meet medium.max (${b.medium.max_usd})`);
    failures++;
  }
  if (b.large.max_usd !== null) {
    messages.push(`[${label}] large.max_usd must be null (open-ended), got: ${b.large.max_usd}`);
    failures++;
  }
}

console.log("=== verify_turnover_bands ===");
checkBand("default_bands", bands.default_bands);
let sectorsChecked = 0;
for (const [sectorId, b] of Object.entries(bands.by_sector)) {
  checkBand(`by_sector.${sectorId}`, b);
  if (!profile.sectors[sectorId]) {
    messages.push(`[by_sector.${sectorId}] sector not found in industry_cost_profile_v1.json`);
    failures++;
  }
  sectorsChecked++;
}

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log(`  default_bands + ${sectorsChecked} per-sector overrides checked. Thresholds monotonic, contiguous, ranges meet.`);
console.log("\n  GATE: PASS");
