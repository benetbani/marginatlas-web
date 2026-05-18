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
const MARGINS = marginsJson as unknown as MarginsTable;

function industryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return MARGINS.default_fallback;
  return MARGINS.industries[industryId] || MARGINS.default_fallback;
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
  const net_profit = pre_tax_profit - corporate_income_tax;

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
    net_margin: input.grossRevenue > 0 ? net_profit / input.grossRevenue : 0,
  };
}
