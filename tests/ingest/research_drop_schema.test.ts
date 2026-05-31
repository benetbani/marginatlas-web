/**
 * research_drop_schema.test.ts — offline test for the research-drop validator +
 * band/confidence helpers. No DB, no env. Run:
 *   npx tsx tests/ingest/research_drop_schema.test.ts
 */
import {
  validateResearchDrop,
  normalizeBand,
  confidenceToQuality,
} from "../../scripts/ingest/research_drop_schema";

const errors: string[] = [];
const check = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg);
};

const KNOWN = new Set(["restaurants", "hairdressers_beauty"]);

// 1. A clean drop passes (no errors).
{
  const good = {
    schema: "research-drop/v1",
    country_iso2: "IN",
    sector_cluster: "food_hospitality",
    captured_at: "2026-05-31",
    activities: [
      {
        industry_id: "restaurants",
        currency: "INR",
        fx_to_usd: 0.012,
        size_bands: [
          {
            band: "1-4",
            revenue_per_firm_local: 2500000,
            net_margin_pct_low: 3,
            net_margin_pct_high: 8,
            cost_structure_pct: { cogs: 35, labor: 25, rent: 12, utilities: 6, tax: 5, other: 17 },
            source: "NSS 2023",
          },
        ],
      },
    ],
  };
  const issues = validateResearchDrop(good, KNOWN);
  const errs = issues.filter((i) => i.level === "error");
  check(errs.length === 0, `clean drop should have 0 errors, got ${JSON.stringify(errs)}`);
}

// 2. Unknown industry_id is an error.
{
  const bad = {
    schema: "research-drop/v1",
    country_iso2: "IN",
    sector_cluster: "x",
    captured_at: "2026-05-31",
    activities: [
      { industry_id: "not_a_real_industry", currency: "INR", fx_to_usd: 0.012,
        size_bands: [{ band: "1-4", revenue_per_firm_local: 1, net_margin_pct_low: 1, net_margin_pct_high: 2, source: "x" }] },
    ],
  };
  const errs = validateResearchDrop(bad, KNOWN).filter((i) => i.level === "error");
  check(errs.some((e) => e.path.includes("industry_id")), "unknown industry_id must error");
}

// 3. Missing source is an error.
{
  const bad = {
    schema: "research-drop/v1", country_iso2: "IN", sector_cluster: "x", captured_at: "2026-05-31",
    activities: [{ industry_id: "restaurants", currency: "INR", fx_to_usd: 0.012,
      size_bands: [{ band: "1-4", revenue_per_firm_local: 1, net_margin_pct_low: 1, net_margin_pct_high: 2, source: "" }] }],
  };
  const errs = validateResearchDrop(bad, KNOWN).filter((i) => i.level === "error");
  check(errs.some((e) => e.path.includes("source")), "missing source must error");
}

// 4. margin low > high is an error.
{
  const bad = {
    schema: "research-drop/v1", country_iso2: "IN", sector_cluster: "x", captured_at: "2026-05-31",
    activities: [{ industry_id: "restaurants", currency: "INR", fx_to_usd: 0.012,
      size_bands: [{ band: "1-4", revenue_per_firm_local: 1, net_margin_pct_low: 9, net_margin_pct_high: 3, source: "x" }] }],
  };
  const errs = validateResearchDrop(bad, KNOWN).filter((i) => i.level === "error");
  check(errs.some((e) => e.path.includes("net_margin")), "low>high margin must error");
}

// 5. Bad ISO code is an error.
{
  const bad = {
    schema: "research-drop/v1", country_iso2: "india", sector_cluster: "x", captured_at: "2026-05-31",
    activities: [{ industry_id: "restaurants", currency: "INR", fx_to_usd: 0.012,
      size_bands: [{ band: "1-4", revenue_per_firm_local: 1, net_margin_pct_low: 1, net_margin_pct_high: 2, source: "x" }] }],
  };
  const errs = validateResearchDrop(bad, KNOWN).filter((i) => i.level === "error");
  check(errs.some((e) => e.path === "country_iso2"), "bad ISO must error");
}

// 6. band normalization + confidence mapping.
check(normalizeBand("solo") === "1-4", "solo -> 1-4");
check(normalizeBand("500+") === "100+", "500+ -> 100+");
check(normalizeBand("garbage") === null, "garbage band -> null");
check(confidenceToQuality("observed").quality_score === 70, "observed -> q70");
check(confidenceToQuality(undefined).coverage_tier === "X", "default -> tier X");

// 7. cost-structure sum far from 100 is a WARNING, not an error.
{
  const drop = {
    schema: "research-drop/v1", country_iso2: "IN", sector_cluster: "x", captured_at: "2026-05-31",
    activities: [{ industry_id: "restaurants", currency: "INR", fx_to_usd: 0.012,
      size_bands: [{ band: "1-4", revenue_per_firm_local: 1, net_margin_pct_low: 1, net_margin_pct_high: 2,
        cost_structure_pct: { cogs: 10, labor: 10 }, source: "x" }] }],
  };
  const issues = validateResearchDrop(drop, KNOWN);
  check(issues.some((i) => i.level === "warn" && i.path.includes("cost_structure")), "cost sum 20 should warn");
  check(issues.filter((i) => i.level === "error").length === 0, "cost sum warning must not be an error");
}

if (errors.length) {
  console.error(`FAIL: ${errors.length}`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("PASS: research_drop_schema");
