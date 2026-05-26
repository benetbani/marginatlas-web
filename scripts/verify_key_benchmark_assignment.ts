/**
 * scripts/verify_key_benchmark_assignment.ts
 *
 * ATO Phase 1 — prebuild gate that every sector has a valid
 * key_benchmark designation and that the designation resolves to
 * a non-trivial share in the underlying cost profile.
 *
 * Three rules enforced:
 *  R1. Every sector in industry_cost_profile_v1.json has
 *      key_benchmark in {cogs, labor, rent, motor_vehicle, total_expenses}.
 *  R2. The chosen ratio's underlying share is at least 0.01
 *      (no point making "rent" the headline if rent_share = 0.005).
 *  R3. The canonical mapping in key_benchmark_assignments_v1.json
 *      agrees with the inlined value on industry_cost_profile_v1.json.
 *
 * Run: npx tsx scripts/verify_key_benchmark_assignment.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PROFILE_PATH = path.resolve(ROOT, "data/finance/industry_cost_profile_v1.json");
const ASSIGN_PATH = path.resolve(ROOT, "data/finance/key_benchmark_assignments_v1.json");

const VALID_KB = new Set(["cogs", "labor", "rent", "motor_vehicle", "total_expenses"]);
const MIN_SHARE = 0.01;

type CostProfile = {
  cogs_share: number;
  labor_share: number;
  rent_share: number;
  motor_vehicle_share: number;
  key_benchmark?: string;
  key_benchmark_rationale?: string;
  [k: string]: unknown;
};

const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as {
  sectors: Record<string, CostProfile>;
};
const assignments = JSON.parse(fs.readFileSync(ASSIGN_PATH, "utf-8")) as {
  assignments_by_sector: Record<string, { key_benchmark: string; rationale: string }>;
};

let failures = 0;
const messages: string[] = [];

function underlyingShare(p: CostProfile, kb: string): number {
  switch (kb) {
    case "cogs": return p.cogs_share;
    case "labor": return p.labor_share;
    case "rent": return p.rent_share;
    case "motor_vehicle": return p.motor_vehicle_share;
    case "total_expenses": return 1; // total expenses is always meaningful
    default: return 0;
  }
}

console.log("=== verify_key_benchmark_assignment ===");
for (const [sectorId, p] of Object.entries(profile.sectors)) {
  const kb = p.key_benchmark;
  if (!kb || !VALID_KB.has(kb)) {
    messages.push(`[${sectorId}] missing or invalid key_benchmark: ${kb}`);
    failures++;
    continue;
  }
  if (!p.key_benchmark_rationale || p.key_benchmark_rationale.length < 10) {
    messages.push(`[${sectorId}] missing or too-short key_benchmark_rationale`);
    failures++;
  }
  const share = underlyingShare(p, kb);
  if (share < MIN_SHARE) {
    messages.push(
      `[${sectorId}] key_benchmark=${kb} but underlying share=${share} < ${MIN_SHARE}`
    );
    failures++;
  }
  const canonical = assignments.assignments_by_sector[sectorId];
  if (!canonical) {
    messages.push(`[${sectorId}] no canonical assignment in key_benchmark_assignments_v1.json`);
    failures++;
  } else if (canonical.key_benchmark !== kb) {
    messages.push(
      `[${sectorId}] mismatch: profile=${kb} canonical=${canonical.key_benchmark}`
    );
    failures++;
  }
}

const total = Object.keys(profile.sectors).length;
if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations across ${total} sectors)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log(`  ${total} sectors checked. All have valid key_benchmark with non-trivial underlying share.`);
console.log("\n  GATE: PASS");
