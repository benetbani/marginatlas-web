/**
 * Plan v10 Track UU — net profit waterfall.
 *
 * Builds the full 13-row breakdown from gross revenue → owner take.
 * Composes Track VV margins + Track TT fixed costs + sub-regional tax
 * helpers in src/lib/tax.ts.
 */
import { estimateFixedCosts, type FixedCostBreakdown } from "./fixed_costs";
import { getCountryTaxRates, getEffectiveCorporateTaxRate } from "../tax";
import marginsJson from "./industry_margins.json";
import marginCapsJson from "./margin_caps.json";
import industriesJson from "../taxonomy/industries.json";

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  asset_intensity: number;
  notes?: string;
};
type MarginsTable = {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};
type MarginCap = {
  typical_low: number;
  typical_high: number;
  investigate: number;
  hard_cap: number;
};
type CapsTable = {
  default_fallback: MarginCap;
  sectors: Record<string, MarginCap>;
};
const MARGINS = marginsJson as unknown as MarginsTable;
const CAPS = marginCapsJson as unknown as CapsTable;
const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of (industriesJson as { industries: Array<{ id: string; sector_id: string }> }).industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

function industryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return MARGINS.default_fallback;
  return MARGINS.industries[industryId] || MARGINS.default_fallback;
}

function marginCapFor(industryId: string | null | undefined): MarginCap {
  if (!industryId) return CAPS.default_fallback;
  const sector = INDUSTRY_TO_SECTOR.get(industryId);
  if (!sector) return CAPS.default_fallback;
  return CAPS.sectors[sector] || CAPS.default_fallback;
}

export type NetProfitWaterfall = {
  // Inputs
  iso2: string;
  geoId: string | null;
  industryId: string | null;
  sectorId: string | null;
  // Top of the waterfall
  gross_revenue: number;
  // Subtraction layer 1: COGS
  cogs: number;
  gross_profit: number;
  // Layer 2: payroll + social
  payroll: number;
  employer_social: number;
  operating_profit: number; // EBITDA proxy
  // Layer 3: fixed costs (Track TT)
  fixed_costs: FixedCostBreakdown;
  pre_tax_profit: number;
  // Layer 4: corporate income tax
  corporate_income_tax: number;
  effective_cit_rate: number;
  effective_cit_breakdown: string;
  // Bottom
  net_profit: number;
  net_margin: number; // net_profit / gross_revenue
  // Plan v28 Lane A — sanity flags
  margin_clamped: boolean; // true when the raw computed margin exceeded the hard cap and was reduced
  margin_flagged: boolean; // true when the raw margin exceeded the investigate threshold
  raw_net_margin: number;  // the uncapped value for internal audit
};

export type NetProfitInput = {
  iso2: string;
  geoId: string | null;
  industryId: string | null;
  sectorId: string | null;
  grossRevenue: number;
  payroll: number | null; // total annual payroll for typical firm; if null we infer from margins
};

export function estimateNetProfit(input: NetProfitInput): NetProfitWaterfall {
  const margin = industryMargin(input.industryId);
  const country = getCountryTaxRates(input.iso2);

  const cogs = input.grossRevenue * (1 - margin.gross_margin);
  const gross_profit = input.grossRevenue - cogs;

  // Payroll: use measured value if given, otherwise back it out from
  // operating margin (industry operating margin assumes payroll fully
  // included in operating expenses).
  const inferredPayroll = input.grossRevenue * (margin.gross_margin - margin.operating_margin);
  const payroll = input.payroll != null && input.payroll > 0 ? input.payroll : Math.max(inferredPayroll * 0.7, 0);
  const employer_social = payroll * country.employer_social;
  const operating_profit = gross_profit - payroll - employer_social;

  const fixed_costs = estimateFixedCosts({
    iso2: input.iso2,
    geoId: input.geoId,
    industryId: input.industryId,
    sectorId: input.sectorId,
    revenue: input.grossRevenue,
  });

  const pre_tax_profit = operating_profit - fixed_costs.total;

  const eff = getEffectiveCorporateTaxRate(input.iso2, input.geoId);
  const corporate_income_tax = pre_tax_profit > 0 ? pre_tax_profit * eff.rate : 0;
  const rawNetProfit = pre_tax_profit - corporate_income_tax;
  const rawNetMargin = input.grossRevenue > 0 ? rawNetProfit / input.grossRevenue : 0;

  // Plan v28 Lane A — sanity clamp. The pipeline can produce absurdly
  // high margins when US-anchored gross margins are applied to non-US
  // revenue minus low local payroll. Clamp to industry-realistic ranges.
  const cap = marginCapFor(input.industryId);
  let clamped_net_margin = rawNetMargin;
  let margin_clamped = false;
  let margin_flagged = false;
  if (rawNetMargin > cap.hard_cap) {
    // Squeeze the margin back into the typical band — not at the hard
    // cap (which is the absolute ceiling), but partway: cap.typical_high
    // + 1/3 of the headroom up to the hard cap.
    clamped_net_margin = cap.typical_high + (cap.hard_cap - cap.typical_high) / 3;
    margin_clamped = true;
    margin_flagged = true;
  } else if (rawNetMargin > cap.investigate) {
    margin_flagged = true;
  }

  const net_profit = clamped_net_margin * input.grossRevenue;
  // When clamped, back-derive what fixed_costs / pre_tax_profit would
  // have needed to be. We don't recompute the waterfall — the headline
  // net_margin / net_profit are authoritative for display.

  return {
    iso2: input.iso2,
    geoId: input.geoId,
    industryId: input.industryId,
    sectorId: input.sectorId,
    gross_revenue: Math.round(input.grossRevenue),
    cogs: Math.round(cogs),
    gross_profit: Math.round(gross_profit),
    payroll: Math.round(payroll),
    employer_social: Math.round(employer_social),
    operating_profit: Math.round(operating_profit),
    fixed_costs,
    pre_tax_profit: Math.round(pre_tax_profit),
    corporate_income_tax: Math.round(corporate_income_tax),
    effective_cit_rate: eff.rate,
    effective_cit_breakdown: eff.breakdown,
    net_profit: Math.round(net_profit),
    net_margin: clamped_net_margin,
    margin_clamped,
    margin_flagged,
    raw_net_margin: rawNetMargin,
  };
}
