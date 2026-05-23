/**
 * Plan v29 Phase 3-4 — Cost Structure Engine v2.
 *
 * For any (country, industry, size_band, gross_revenue) tuple, computes
 * a fully decomposed 13-line waterfall where each line carries:
 *   - dollar value
 *   - share of revenue
 *   - provenance string (the "why" sentence, shown as tooltip)
 *   - confidence rating A/B/C/D
 *
 * Engine architecture:
 *   1. Look up Country Economic Profile (CEP) — 196 countries.
 *   2. Look up Industry Cost Profile (ICP) — keyed by sector_id.
 *   3. Compute per-line modifiers from (CEP × ICP) interactions.
 *   4. Apply per-line clamps and produce waterfall.
 *   5. Aggregate per-page confidence score.
 *
 * Universal terms only — never use country-specific tax names in UI text.
 * R-002 compliant.
 */
import { getCountryProfile } from "@/lib/economic_profile";
import type { CountryEconomicProfile } from "@/lib/economic_profile/types";
import industriesJson from "@/lib/taxonomy/industries.json";
import icpJson from "../../../data/finance/industry_cost_profile_v1.json";

// ============ Types ============

export type WaterfallLine = {
  usd: number;
  share_of_revenue: number;
  provenance: string;
  confidence: "A" | "B" | "C" | "D";
};

export type CostStructureResult = {
  // Inputs
  iso2: string;
  industry_id: string;
  size_band: "small" | "medium" | "large";
  gross_revenue_usd: number;

  // Lines
  lines: {
    gross_revenue: WaterfallLine;
    cogs: WaterfallLine;
    gross_profit: WaterfallLine;
    direct_labor: WaterfallLine;
    employer_social: WaterfallLine;
    operating_profit_pre_overhead: WaterfallLine;
    rent: WaterfallLine;
    energy: WaterfallLine;
    insurance: WaterfallLine;
    software_tech: WaterfallLine;
    marketing: WaterfallLine;
    other_overhead: WaterfallLine;
    operating_profit: WaterfallLine;
    corporate_tax: WaterfallLine;
    net_profit: WaterfallLine;
  };

  // Aggregates
  net_margin: number;
  raw_net_margin: number;
  margin_clamped: boolean;
  margin_flagged: boolean;

  // Per-page confidence (0-100)
  confidence_score: number;
  confidence_tier: "A" | "B" | "C" | "D";
  weakest_line_key: string;

  // What-changes-here (top 3 divergent lines)
  notable_divergences: Array<{ line: string; vs_global_share_pp: number; reason: string }>;
};

type ICPFile = {
  default_fallback: SectorICP;
  sectors: Record<string, SectorICP>;
};

type SectorICP = {
  cogs_share: number;
  labor_share: number;
  rent_share: number;
  energy_share: number;
  marketing_share: number;
  software_share: number;
  insurance_share: number;
  other_overhead_share: number;
  cogs_import_dependency: number;
  labor_skill_intensity: number;
  rent_location_dependency: number;
  energy_intensity: number;
  capital_intensity: number;
  productivity_elasticity: number;
  sqm_per_fte: number;
  typical_employees_small: number;
  typical_employees_medium: number;
  typical_employees_large: number;
  smb_friendly: "yes" | "mixed" | "no";
  net_margin_typical_low: number;
  net_margin_typical_high: number;
  net_margin_hard_cap: number;
};

const ICP = icpJson as unknown as ICPFile;

const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of (industriesJson as { industries: Array<{ id: string; sector_id: string }> }).industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

function getSectorICP(industryId: string): SectorICP {
  const sector = INDUSTRY_TO_SECTOR.get(industryId);
  if (!sector) return ICP.default_fallback;
  return ICP.sectors[sector] || ICP.default_fallback;
}

// ============ Modifier functions ============

const GLOBAL_GDP_REFERENCE = 35000;
const GLOBAL_RENT_T1_REFERENCE = 400;
const GLOBAL_ELECTRICITY_REFERENCE = 0.13;
const GLOBAL_WAGE_REFERENCE = 30000;

/**
 * Each *_modifier returns a multiplicative factor applied to the ICP
 * base share. Clamps protect against extreme outliers.
 */
function cogsModifier(cep: CountryEconomicProfile, icp: SectorICP): number {
  // Higher import dependency × more-tradable industry → COGS up
  const tradeBump = (cep.imports_pct_of_gdp - 0.30) * icp.cogs_import_dependency * 0.4;
  // FX volatility adds a small input-cost premium
  const fxBump = cep.exchange_rate_volatility_pct * 0.3 * icp.cogs_import_dependency;
  return Math.max(0.7, Math.min(1.4, 1.0 + tradeBump + fxBump));
}

function laborWageBase(cep: CountryEconomicProfile, icp: SectorICP, sizeBand: "small" | "medium" | "large"): number {
  // Choose wage anchor by skill intensity. High-skill industries pay closer to P75.
  const skill = icp.labor_skill_intensity;
  const wage =
    cep.wage_p25_usd * (1 - skill) * 0.5
    + cep.median_wage_full_time_usd * 0.5
    + cep.wage_p75_usd * skill * 0.5;
  // Size bumps: large firms pay a small premium (more senior labor mix)
  const sizeBump = sizeBand === "large" ? 1.15 : sizeBand === "medium" ? 1.05 : 0.95;
  return wage * sizeBump;
}

function employerLoading(cep: CountryEconomicProfile): number {
  return cep.fully_loaded_labor_multiplier; // already 1 + (employer side adds)
}

function rentModifier(cep: CountryEconomicProfile, icp: SectorICP, cityTier: 1 | 2 | 3): number {
  const t1 = cep.commercial_rent_t1_usd_per_sqm_year;
  const t2 = cep.commercial_rent_t2_usd_per_sqm_year;
  const t3 = cep.commercial_rent_t3_usd_per_sqm_year;
  const localRent = cityTier === 1 ? t1 : cityTier === 2 ? t2 : t3;
  // Compare to global tier-1 reference, weight by location dependency.
  const ratio = localRent / GLOBAL_RENT_T1_REFERENCE;
  return Math.max(0.2, Math.min(4.0, Math.pow(ratio, icp.rent_location_dependency)));
}

function energyModifier(cep: CountryEconomicProfile, icp: SectorICP): number {
  const ratio = cep.electricity_usd_per_kwh_commercial / GLOBAL_ELECTRICITY_REFERENCE;
  return Math.max(0.3, Math.min(3.0, Math.pow(ratio, icp.energy_intensity)));
}

function marketingModifier(cep: CountryEconomicProfile, icp: SectorICP): number {
  // Higher-GDP markets have higher digital ad costs
  const ratio = cep.gdp_per_capita_usd_nominal / GLOBAL_GDP_REFERENCE;
  return Math.max(0.5, Math.min(2.2, Math.pow(ratio, 0.4)));
}

function softwareModifier(cep: CountryEconomicProfile): number {
  // SaaS prices are mostly USD-denominated; cheaper countries spend
  // proportionally MORE on software relative to revenue.
  const ratio = GLOBAL_GDP_REFERENCE / Math.max(cep.gdp_per_capita_usd_nominal, 1500);
  return Math.max(0.7, Math.min(1.8, Math.pow(ratio, 0.3)));
}

function insuranceModifier(cep: CountryEconomicProfile): number {
  // Higher CPI (cleaner governance) → more litigious → higher liability premium
  const cpiBump = 1.0 + (cep.corruption_perception_index - 50) * 0.006;
  return Math.max(0.6, Math.min(1.5, cpiBump));
}

// ============ Engine ============

export function estimateCostStructure(input: {
  iso2: string;
  industryId: string;
  sizeBand: "small" | "medium" | "large";
  grossRevenue: number;
  cityTier?: 1 | 2 | 3;
}): CostStructureResult {
  const cep = getCountryProfile(input.iso2);
  const icp = getSectorICP(input.industryId);
  const cityTier = input.cityTier ?? 2;
  const rev = Math.max(input.grossRevenue, 0);

  // Per-line modifiers
  const cogsMod = cogsModifier(cep, icp);
  const rentMod = rentModifier(cep, icp, cityTier);
  const energyMod = energyModifier(cep, icp);
  const marketingMod = marketingModifier(cep, icp);
  const softwareMod = softwareModifier(cep);
  const insuranceMod = insuranceModifier(cep);

  // COGS
  const cogsShare = Math.max(0.04, Math.min(0.78, icp.cogs_share * cogsMod));
  const cogsUsd = rev * cogsShare;
  const grossProfit = rev - cogsUsd;

  // Labor — derive from labor SHARE (country-adjusted), not from fixed
  // employee count. The intuition: revenue is already country-scaled
  // (upstream extrapolation accounts for GDP/wage levels); labor share
  // should stay within the industry's typical band regardless of country.
  // The country wage level affects how many people that share supports,
  // not the share itself.
  const wagePerFte = laborWageBase(cep, icp, input.sizeBand);
  const loadedWagePerFte = wagePerFte * employerLoading(cep);

  // Country labor share modifier: high-employer-social countries push
  // the social line up; low-skill labor markets compress the wage line.
  const laborShareCountry = icp.labor_share;
  const totalLaborShare = Math.max(0.08, Math.min(0.65, laborShareCountry * employerLoading(cep)));
  const totalLaborUsd = rev * totalLaborShare;
  // Split into direct labor vs employer-side
  const employerShareOfTotal = (employerLoading(cep) - 1.0) / employerLoading(cep);
  let socialUsd = totalLaborUsd * employerShareOfTotal;
  const directLaborUsd = totalLaborUsd - socialUsd;

  // Implied employee count (for display in provenance)
  const impliedEmpCount = Math.max(1, Math.round(directLaborUsd / wagePerFte));

  const opPreOverhead = grossProfit - directLaborUsd - socialUsd;

  // Overhead lines (each a share of revenue, modified)
  const rentShare = Math.max(0.005, Math.min(0.30, icp.rent_share * rentMod));
  const rentUsd = rev * rentShare;
  const energyShare = Math.max(0.001, Math.min(0.18, icp.energy_share * energyMod));
  const energyUsd = rev * energyShare;
  const insuranceShare = Math.max(0.003, Math.min(0.08, icp.insurance_share * insuranceMod));
  const insuranceUsd = rev * insuranceShare;
  const softwareShare = Math.max(0.003, Math.min(0.10, icp.software_share * softwareMod));
  const softwareUsd = rev * softwareShare;
  const marketingShare = Math.max(0.005, Math.min(0.20, icp.marketing_share * marketingMod));
  const marketingUsd = rev * marketingShare;
  const otherShare = icp.other_overhead_share;
  const otherUsd = rev * otherShare;

  const totalOverhead = rentUsd + energyUsd + insuranceUsd + softwareUsd + marketingUsd + otherUsd;
  const opProfit = opPreOverhead - totalOverhead;

  // Corporate tax
  const taxRate = cep.effective_corporate_tax_pct;
  const taxUsd = opProfit > 0 ? opProfit * taxRate : 0;
  const rawNet = opProfit - taxUsd;
  const rawMargin = rev > 0 ? rawNet / rev : 0;

  // Margin clamp — both ceiling and floor.
  // Below the typical_low band, the model is over-deducting overhead
  // (common in high-cost cities). Clamp UP to typical_low; flag for audit.
  // Above the hard_cap, the model is over-crediting profit. Clamp DOWN.
  let netUsd = rawNet;
  let netMargin = rawMargin;
  let clamped = false;
  let flagged = false;
  if (rawMargin > icp.net_margin_hard_cap) {
    netMargin = icp.net_margin_typical_high + (icp.net_margin_hard_cap - icp.net_margin_typical_high) / 3;
    netUsd = netMargin * rev;
    clamped = true;
    flagged = true;
  } else if (rawMargin > icp.net_margin_typical_high) {
    flagged = true;
  } else if (rawMargin < icp.net_margin_typical_low * 0.5) {
    // Below half of typical_low: model says the business is unviable.
    // For benchmark display, clamp UP to typical_low; flag for review.
    netMargin = icp.net_margin_typical_low;
    netUsd = netMargin * rev;
    clamped = true;
    flagged = true;
  } else if (rawMargin < icp.net_margin_typical_low) {
    flagged = true;
  }

  // Provenance strings (universal terms — no country-specific tax names)
  const cogsProv = icp.cogs_import_dependency > 0.4
    ? `${(cogsShare * 100).toFixed(0)}% of revenue. ${cep.name}'s import dependency (${(cep.imports_pct_of_gdp * 100).toFixed(0)}% of GDP) raises input costs for this category.`
    : `${(cogsShare * 100).toFixed(0)}% of revenue. Typical for this industry; ${cep.name} sources most inputs locally.`;

  const laborProv = `Roughly ${impliedEmpCount} full-time-equivalent employees at $${Math.round(wagePerFte).toLocaleString()} median wage. Implied from the typical labor share for this category, scaled by ${cep.name}'s wage level.`;

  const socialProv = `Employer-side social contributions add ${((cep.fully_loaded_labor_multiplier - 1) * 100).toFixed(1)}% on top of gross wage in ${cep.name}.`;

  const rentProv = cityTier === 1
    ? `Tier-1 commercial rent in ${cep.name} averages $${Math.round(cep.commercial_rent_t1_usd_per_sqm_year)}/sqm/year. This industry's ${icp.rent_location_dependency > 0.6 ? "high" : icp.rent_location_dependency > 0.3 ? "moderate" : "low"} location-dependency drives the share.`
    : cityTier === 2
    ? `Tier-2 city commercial rent in ${cep.name} averages $${Math.round(cep.commercial_rent_t2_usd_per_sqm_year)}/sqm/year.`
    : `Tier-3 city commercial rent in ${cep.name} averages $${Math.round(cep.commercial_rent_t3_usd_per_sqm_year)}/sqm/year.`;

  const energyProv = `Commercial electricity in ${cep.name} runs $${cep.electricity_usd_per_kwh_commercial.toFixed(3)}/kWh; this category's energy intensity is ${icp.energy_intensity > 0.6 ? "high" : icp.energy_intensity > 0.3 ? "moderate" : "low"}.`;

  const insuranceProv = `Liability premium reflects ${cep.name}'s governance profile and litigation environment.`;

  const softwareProv = `SaaS and tech overhead is largely USD-denominated; lower-income countries spend proportionally more relative to revenue.`;

  const marketingProv = `Customer acquisition cost in ${cep.name} scales with the local digital-ad market.`;

  const otherProv = `Accounting, banking, supplies, and miscellaneous overhead. Industry-typical share.`;

  const taxProv = `Effective corporate income tax in ${cep.name}: ${(taxRate * 100).toFixed(1)}%. Below the statutory ${(cep.corporate_income_tax_combined_pct * 100).toFixed(1)}% rate after standard deductions.`;

  const netProv = clamped
    ? `Net margin clamped to the realistic ceiling for this category (${(icp.net_margin_hard_cap * 100).toFixed(0)}% hard cap).`
    : flagged
    ? `Net margin in the upper band for this category; orientation only.`
    : `Net margin within the typical band for this category in ${cep.name}.`;

  // Confidence per line
  const baseConf: "A" | "B" | "C" | "D" = cep.tier === "A" ? "A" : cep.tier === "B" ? "B" : "C";
  const lineConf = (k: string): "A" | "B" | "C" | "D" => {
    if (clamped && (k === "net_profit" || k === "corporate_tax")) return "C";
    return baseConf;
  };

  // Score (0-100)
  const tierScores: Record<"A" | "B" | "C" | "D", number> = { A: 90, B: 70, C: 50, D: 30 };
  const baseScore = tierScores[baseConf];
  const confidenceScore = clamped ? Math.max(40, baseScore - 15) : baseScore;
  const confidenceTier: "A" | "B" | "C" | "D" =
    confidenceScore >= 85 ? "A" : confidenceScore >= 65 ? "B" : confidenceScore >= 45 ? "C" : "D";

  // Notable divergences
  const globalShares: Record<string, number> = {
    cogs: ICP.default_fallback.cogs_share,
    labor: ICP.default_fallback.labor_share,
    rent: ICP.default_fallback.rent_share,
    energy: ICP.default_fallback.energy_share,
  };
  const actualShares: Record<string, number> = {
    cogs: cogsShare,
    labor: (directLaborUsd + socialUsd) / Math.max(rev, 1),
    rent: rentShare,
    energy: energyShare,
  };
  const divergences = Object.keys(globalShares)
    .map((k) => ({ line: k, actual: actualShares[k], global: globalShares[k] }))
    .map((d) => ({ line: d.line, diff_pp: (d.actual - d.global) * 100 }))
    .sort((a, b) => Math.abs(b.diff_pp) - Math.abs(a.diff_pp))
    .slice(0, 3);

  const notable = divergences.map((d) => ({
    line: d.line,
    vs_global_share_pp: Math.round(d.diff_pp * 10) / 10,
    reason: d.diff_pp > 0
      ? `${(Math.abs(d.diff_pp)).toFixed(1)}pp higher than the global industry mean — driven by ${cep.name}'s economic profile`
      : `${(Math.abs(d.diff_pp)).toFixed(1)}pp lower than the global industry mean — ${cep.name}'s structural advantage in this line`,
  }));

  const result: CostStructureResult = {
    iso2: input.iso2.toUpperCase(),
    industry_id: input.industryId,
    size_band: input.sizeBand,
    gross_revenue_usd: rev,
    lines: {
      gross_revenue: { usd: rev, share_of_revenue: 1.0, provenance: `Median typical-firm revenue for this category in ${cep.name}.`, confidence: lineConf("gross_revenue") },
      cogs: { usd: cogsUsd, share_of_revenue: cogsShare, provenance: cogsProv, confidence: lineConf("cogs") },
      gross_profit: { usd: grossProfit, share_of_revenue: grossProfit / Math.max(rev, 1), provenance: "Revenue minus cost of goods sold.", confidence: lineConf("gross_profit") },
      direct_labor: { usd: directLaborUsd, share_of_revenue: directLaborUsd / Math.max(rev, 1), provenance: laborProv, confidence: lineConf("direct_labor") },
      employer_social: { usd: socialUsd, share_of_revenue: socialUsd / Math.max(rev, 1), provenance: socialProv, confidence: lineConf("employer_social") },
      operating_profit_pre_overhead: { usd: opPreOverhead, share_of_revenue: opPreOverhead / Math.max(rev, 1), provenance: "Gross profit minus labor and employer-side contributions.", confidence: lineConf("operating_profit_pre_overhead") },
      rent: { usd: rentUsd, share_of_revenue: rentShare, provenance: rentProv, confidence: lineConf("rent") },
      energy: { usd: energyUsd, share_of_revenue: energyShare, provenance: energyProv, confidence: lineConf("energy") },
      insurance: { usd: insuranceUsd, share_of_revenue: insuranceShare, provenance: insuranceProv, confidence: lineConf("insurance") },
      software_tech: { usd: softwareUsd, share_of_revenue: softwareShare, provenance: softwareProv, confidence: lineConf("software_tech") },
      marketing: { usd: marketingUsd, share_of_revenue: marketingShare, provenance: marketingProv, confidence: lineConf("marketing") },
      other_overhead: { usd: otherUsd, share_of_revenue: otherShare, provenance: otherProv, confidence: lineConf("other_overhead") },
      operating_profit: { usd: opProfit, share_of_revenue: opProfit / Math.max(rev, 1), provenance: "Pre-tax profit after all costs.", confidence: lineConf("operating_profit") },
      corporate_tax: { usd: taxUsd, share_of_revenue: taxUsd / Math.max(rev, 1), provenance: taxProv, confidence: lineConf("corporate_tax") },
      net_profit: { usd: netUsd, share_of_revenue: netMargin, provenance: netProv, confidence: lineConf("net_profit") },
    },
    net_margin: netMargin,
    raw_net_margin: rawMargin,
    margin_clamped: clamped,
    margin_flagged: flagged,
    confidence_score: confidenceScore,
    confidence_tier: confidenceTier,
    weakest_line_key: clamped ? "net_profit" : "cogs",
    notable_divergences: notable,
  };

  return result;
}
