/**
 * business_formation_smb_only.test.ts
 *
 * Regression test for data/legal/business_formation_costs_v1.json.
 *
 * Founder rule (Cities sec 6): the dataset must reflect actual SMB
 * legal-entity choices (restaurant, boutique, dental practice, print
 * shop). It must never include wealth-fund or hedge-fund vehicles
 * (Cayman, BVI, Bermuda, SOPARFI, ETVE, VCC, ICAV, trusts, fund LPs).
 *
 * Asserts:
 *   1. No tier row contains any banned substring (case-insensitive).
 *   2. Every tier row has complexity_score in [1, 5].
 *   3. Every tier row has setup_cost_usd >= 0 and setup_days >= 1.
 *   4. Every country code in the JSON appears in COUNTRIES master list
 *      (no orphan rows).
 *   5. Every row has a valid tier label.
 *
 * Run: npx tsx tests/sanity/business_formation_smb_only.test.ts
 */
import data from "../../data/legal/business_formation_costs_v1.json";
import { COUNTRIES } from "../../src/lib/taxonomy";

type TierRow = {
  tier: string;
  local_term: string;
  setup_cost_usd: number;
  setup_days: number;
  complexity_score?: number;
};

type FormationFile = {
  tier_definitions: Record<string, string>;
  countries: Record<string, TierRow[]>;
};

const FILE = data as FormationFile;

const BANNED_SUBSTRINGS = [
  "cayman",
  "bvi",
  "bermuda",
  "soparfi",
  "etve",
  "vcc",
  "icav",
  "trust",
  "channel islands",
  "isle of man",
];

const VALID_TIERS = new Set([
  "Freelancer",
  "Sole Trader",
  "LLC",
  "Joint-Stock",
]);

const VALID_COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));

const errors: string[] = [];

for (const [code, rows] of Object.entries(FILE.countries)) {
  // Rule 4: country code must exist in master list
  if (!VALID_COUNTRY_CODES.has(code)) {
    errors.push(`Orphan country code: ${code} is not in COUNTRIES master.`);
    continue;
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    errors.push(`${code}: empty or non-array tier list.`);
    continue;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const where = `${code} row ${i} (${row.tier} / ${row.local_term})`;

    // Rule 5: valid tier
    if (!VALID_TIERS.has(row.tier)) {
      errors.push(`${where}: invalid tier "${row.tier}".`);
    }

    // Rule 1: no banned substrings anywhere in tier or local_term
    const blob = `${row.tier} ${row.local_term}`.toLowerCase();
    for (const banned of BANNED_SUBSTRINGS) {
      if (blob.includes(banned)) {
        errors.push(
          `${where}: contains banned substring "${banned}". Wealth-fund and trust vehicles are not allowed.`
        );
      }
    }

    // Rule 2: complexity_score in [1, 5]
    if (
      typeof row.complexity_score !== "number" ||
      row.complexity_score < 1 ||
      row.complexity_score > 5
    ) {
      errors.push(
        `${where}: complexity_score missing or out of range (1 to 5). Got ${String(row.complexity_score)}.`
      );
    }

    // Rule 3: cost >= 0, days >= 1
    if (typeof row.setup_cost_usd !== "number" || row.setup_cost_usd < 0) {
      errors.push(
        `${where}: setup_cost_usd must be a non-negative number. Got ${String(row.setup_cost_usd)}.`
      );
    }
    if (typeof row.setup_days !== "number" || row.setup_days < 1) {
      errors.push(
        `${where}: setup_days must be >= 1. Got ${String(row.setup_days)}.`
      );
    }
  }
}

if (errors.length > 0) {
  console.error(
    `business_formation_smb_only: FAIL with ${errors.length} issue(s):`
  );
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

const totalCountries = Object.keys(FILE.countries).length;
const totalRows = Object.values(FILE.countries).reduce(
  (acc, rows) => acc + rows.length,
  0
);
console.log(
  `business_formation_smb_only: PASS. ${totalCountries} countries, ${totalRows} tier rows, no banned vehicles, all complexity scores in range.`
);
