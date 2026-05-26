/**
 * scripts/verify_cost_share_invariant.ts
 *
 * ATO Phase 1 — prebuild gate locking the cost-share invariant for
 * every sector and the default fallback.
 *
 * Invariant: cogs_share + labor_share + rent_share + energy_share +
 * marketing_share + software_share + insurance_share +
 * motor_vehicle_share + other_overhead_share + (typical net margin)
 * = ~1.0.
 *
 * Implied margin = 1.0 - sum_of_cost_shares. It must be a positive
 * number consistent with the sector's net_margin_typical_low/high
 * range (we allow margin to fall within net_margin_hard_cap).
 *
 * Run: npx tsx scripts/verify_cost_share_invariant.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FILE = path.resolve(ROOT, "data/finance/industry_cost_profile_v1.json");

type CostProfile = {
  cogs_share: number;
  labor_share: number;
  rent_share: number;
  energy_share: number;
  marketing_share: number;
  software_share: number;
  insurance_share: number;
  motor_vehicle_share: number;
  other_overhead_share: number;
  net_margin_hard_cap: number;
  [k: string]: unknown;
};

type FileShape = {
  default_fallback: CostProfile;
  sectors: Record<string, CostProfile>;
};

const data = JSON.parse(fs.readFileSync(FILE, "utf-8")) as FileShape;

const SHARE_KEYS = [
  "cogs_share",
  "labor_share",
  "rent_share",
  "energy_share",
  "marketing_share",
  "software_share",
  "insurance_share",
  "motor_vehicle_share",
  "other_overhead_share",
] as const;

const TOLERANCE = 0.005;
let failures = 0;
const messages: string[] = [];

function checkProfile(label: string, p: CostProfile): void {
  for (const k of SHARE_KEYS) {
    const v = (p as Record<string, unknown>)[k];
    if (typeof v !== "number") {
      messages.push(`[${label}] missing or non-numeric ${k}`);
      failures++;
      return;
    }
    if (v < 0 || v > 1) {
      messages.push(`[${label}] ${k}=${v} out of range [0,1]`);
      failures++;
    }
  }
  const sum = SHARE_KEYS.reduce((acc, k) => acc + (p[k] as number), 0);
  const impliedMargin = 1 - sum;
  if (impliedMargin < -TOLERANCE) {
    messages.push(
      `[${label}] cost shares sum to ${sum.toFixed(4)} (>1.0 + tol). No room for margin.`
    );
    failures++;
  }
  if (impliedMargin > p.net_margin_hard_cap + TOLERANCE) {
    messages.push(
      `[${label}] implied margin ${impliedMargin.toFixed(4)} exceeds net_margin_hard_cap=${p.net_margin_hard_cap}.`
    );
    failures++;
  }
}

console.log("=== verify_cost_share_invariant ===");
checkProfile("default_fallback", data.default_fallback);
for (const [sectorId, p] of Object.entries(data.sectors)) {
  checkProfile(sectorId, p);
}

const totalChecked = Object.keys(data.sectors).length + 1;
if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations across ${totalChecked} profiles)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log(`  ${totalChecked} cost profiles verified. Invariant holds within ${TOLERANCE} tolerance.`);
console.log("\n  GATE: PASS");
