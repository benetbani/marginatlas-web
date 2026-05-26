/**
 * scripts/data/augment_cost_profile_phase1.ts
 *
 * ATO Phase 1 — adds motor_vehicle_share, key_benchmark, and
 * key_benchmark_rationale to every sector + default_fallback in
 * industry_cost_profile_v1.json.
 *
 * motor_vehicle_share is carved OUT of other_overhead_share so the
 * cost-share invariant (sum to 1.0 - typical_net_margin) is preserved.
 *
 * Run once: npx tsx scripts/data/augment_cost_profile_phase1.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FILE = path.resolve(ROOT, "data/finance/industry_cost_profile_v1.json");

type KeyBenchmark = "cogs" | "labor" | "rent" | "motor_vehicle" | "total_expenses";

type CostProfile = {
  cogs_share: number;
  labor_share: number;
  rent_share: number;
  energy_share: number;
  marketing_share: number;
  software_share: number;
  insurance_share: number;
  other_overhead_share: number;
  motor_vehicle_share?: number;
  key_benchmark?: KeyBenchmark;
  key_benchmark_rationale?: string;
  [k: string]: unknown;
};

type FileShape = {
  version: string;
  anchor: string;
  convention: string;
  default_fallback: CostProfile;
  sectors: Record<string, CostProfile>;
};

const data = JSON.parse(fs.readFileSync(FILE, "utf-8")) as FileShape;

// ---------------------------------------------------------------------------
// Sector overrides. motor_vehicle_share is carved out of other_overhead_share.
// key_benchmark + rationale per the ATO framework.
// ---------------------------------------------------------------------------
const OVERRIDES: Record<string, { motor_vehicle_share: number; key_benchmark: KeyBenchmark; key_benchmark_rationale: string }> = {
  food_drink: {
    motor_vehicle_share: 0.012,
    key_benchmark: "cogs",
    key_benchmark_rationale: "Food and beverage cost moves directly with sales. The most predictive ratio for true turnover.",
  },
  hospitality: {
    motor_vehicle_share: 0.008,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Hotels and lodging carry split fixed and variable cost; total expense vs revenue is the cleanest read.",
  },
  beauty_wellness: {
    motor_vehicle_share: 0.003,
    key_benchmark: "labor",
    key_benchmark_rationale: "Stylists and therapists ARE the product. Labour share against revenue is the right gauge.",
  },
  retail_shops: {
    motor_vehicle_share: 0.006,
    key_benchmark: "cogs",
    key_benchmark_rationale: "Inventory cost tracks revenue directly. The classic retail benchmark.",
  },
  professional_services: {
    motor_vehicle_share: 0.005,
    key_benchmark: "labor",
    key_benchmark_rationale: "Lawyers, accountants, consultants sell time. Labour share answers whether you are charging enough.",
  },
  creative_media: {
    motor_vehicle_share: 0.005,
    key_benchmark: "labor",
    key_benchmark_rationale: "Designers, agencies, production houses bill labour. The labour ratio is the leverage gauge.",
  },
  software_tech: {
    motor_vehicle_share: 0.002,
    key_benchmark: "labor",
    key_benchmark_rationale: "Engineering payroll is the dominant line. Labour vs revenue is the unit-economics signal.",
  },
  construction: {
    motor_vehicle_share: 0.05,
    key_benchmark: "cogs",
    key_benchmark_rationale: "Materials and subcontractor passthrough drive the P&L. Cost of sales is the most accurate predictor.",
  },
  trades_home: {
    motor_vehicle_share: 0.06,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Mixed materials and labour; total expense vs revenue captures both sides cleanly.",
  },
  repair: {
    motor_vehicle_share: 0.04,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Parts plus labour in a roughly equal mix. Total expense is the most stable benchmark.",
  },
  health_clinics: {
    motor_vehicle_share: 0.005,
    key_benchmark: "labor",
    key_benchmark_rationale: "Practitioner payroll dominates the cost stack. Labour vs revenue gauges practice efficiency.",
  },
  education_instruction: {
    motor_vehicle_share: 0.005,
    key_benchmark: "labor",
    key_benchmark_rationale: "Instructor cost is the operational lever. Labour-to-revenue tracks teaching utilisation.",
  },
  events_entertainment: {
    motor_vehicle_share: 0.015,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Event costs are project-based and volatile. Total expense vs revenue is the cleanest aggregate.",
  },
  cultural: {
    motor_vehicle_share: 0.008,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Galleries, museums, performing arts run mixed economics. Total expense is the most stable cut.",
  },
  pet_services: {
    motor_vehicle_share: 0.03,
    key_benchmark: "labor",
    key_benchmark_rationale: "Groomers, trainers, walkers are paid for time. Labour vs revenue is the throughput gauge.",
  },
  real_estate: {
    motor_vehicle_share: 0.025,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Commission economics make any single ratio noisy. Total expense vs revenue is the cleanest aggregate.",
  },
  transport_small: {
    motor_vehicle_share: 0.20,
    key_benchmark: "motor_vehicle",
    key_benchmark_rationale: "The vehicle IS the business. Motor vehicle share vs revenue is the central operational ratio.",
  },
  manufacturing_artisan: {
    motor_vehicle_share: 0.015,
    key_benchmark: "cogs",
    key_benchmark_rationale: "Raw materials are the dominant input. Cost of sales tracks the production economics directly.",
  },
  heavy_industry: {
    motor_vehicle_share: 0.025,
    key_benchmark: "cogs",
    key_benchmark_rationale: "Material throughput drives revenue. Cost of sales is the most accurate turnover predictor.",
  },
  mining_energy: {
    motor_vehicle_share: 0.04,
    key_benchmark: "cogs",
    key_benchmark_rationale: "Extracted material valued at sales prices. Cost of sales is the natural benchmark.",
  },
  farming_food_production: {
    motor_vehicle_share: 0.04,
    key_benchmark: "cogs",
    key_benchmark_rationale: "Crop and livestock input costs drive the P&L. Cost of sales is the most reliable yield indicator.",
  },
  telecom_broadcasting: {
    motor_vehicle_share: 0.025,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Capex-heavy mixed economics. Total expense vs revenue is the cleanest single ratio.",
  },
  finance_corp: {
    motor_vehicle_share: 0.002,
    key_benchmark: "labor",
    key_benchmark_rationale: "Talent cost is the dominant lever. Labour vs revenue is the productivity benchmark.",
  },
  higher_ed_hospitals: {
    motor_vehicle_share: 0.005,
    key_benchmark: "labor",
    key_benchmark_rationale: "Faculty and clinician payroll dominate. Labour vs revenue tracks institutional efficiency.",
  },
  other_local: {
    motor_vehicle_share: 0.015,
    key_benchmark: "total_expenses",
    key_benchmark_rationale: "Mixed local services. Total expense vs revenue is the cleanest cross-industry benchmark.",
  },
};

// Default fallback gets a moderate motor_vehicle_share and total_expenses as key.
const DEFAULT_FALLBACK_AUGMENT: typeof OVERRIDES[string] = {
  motor_vehicle_share: 0.01,
  key_benchmark: "total_expenses",
  key_benchmark_rationale: "Mixed-economics fallback. Total expense vs revenue is the most stable cross-industry ratio.",
};

function applyAugment(profile: CostProfile, aug: typeof OVERRIDES[string], label: string): void {
  let needed = aug.motor_vehicle_share;
  // Carve preferentially from other_overhead_share (the catch-all bucket).
  const fromOther = Math.min(needed, profile.other_overhead_share - 0.01);
  profile.other_overhead_share = +(profile.other_overhead_share - fromOther).toFixed(4);
  needed = +(needed - fromOther).toFixed(4);
  // For vehicle-heavy sectors (transport, trades), pull the remainder from
  // energy_share (fuel is what we're calling out) then cogs_share.
  if (needed > 0) {
    const fromEnergy = Math.min(needed, profile.energy_share - 0.01);
    if (fromEnergy > 0) {
      profile.energy_share = +(profile.energy_share - fromEnergy).toFixed(4);
      needed = +(needed - fromEnergy).toFixed(4);
    }
  }
  if (needed > 0) {
    const fromCogs = Math.min(needed, profile.cogs_share - 0.05);
    if (fromCogs > 0) {
      profile.cogs_share = +(profile.cogs_share - fromCogs).toFixed(4);
      needed = +(needed - fromCogs).toFixed(4);
    }
  }
  if (needed > 0.001) {
    console.warn(
      `  ${label}: could not carve full ${aug.motor_vehicle_share}; ${needed.toFixed(4)} short, using available`
    );
  }
  profile.motor_vehicle_share = +(aug.motor_vehicle_share - needed).toFixed(4);
  profile.key_benchmark = aug.key_benchmark;
  profile.key_benchmark_rationale = aug.key_benchmark_rationale;
}

// Apply to default_fallback.
applyAugment(data.default_fallback, DEFAULT_FALLBACK_AUGMENT, "default_fallback");

// Apply to each sector.
let touched = 0;
for (const [sectorId, aug] of Object.entries(OVERRIDES)) {
  const profile = data.sectors[sectorId];
  if (!profile) {
    console.warn(`No sector ${sectorId} found, skipping`);
    continue;
  }
  applyAugment(profile, aug, sectorId);
  touched++;
}

// Update the convention string to mention the new fields.
data.convention =
  "All shares are decimals of revenue. cogs_share + labor_share + rent_share + energy_share + marketing_share + software_share + insurance_share + motor_vehicle_share + other_overhead_share + (typical net margin) = ~1.0. ATO Phase 1 adds motor_vehicle_share (carved from other_overhead_share), key_benchmark (which single ratio to surface as the headline answer for this sector), and key_benchmark_rationale. Industry-specific overrides take priority over sector defaults. flex parameters control how each line responds to country economic factors (see modifier matrix).";

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`Augmented ${touched} sectors + default_fallback.`);

// Audit: verify the invariant holds.
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
];
console.log("\nInvariant audit (cost shares + implied margin):");
for (const [k, v] of Object.entries(data.sectors)) {
  const sum = SHARE_KEYS.reduce((acc, key) => acc + ((v as CostProfile)[key] as number || 0), 0);
  const implied = +(1 - sum).toFixed(3);
  const ok = implied >= 0 && implied <= 0.35;
  console.log(
    `  ${k.padEnd(28)} shares=${sum.toFixed(3)}  margin=${implied.toFixed(3)}  ${ok ? "OK" : "X"}`
  );
}
