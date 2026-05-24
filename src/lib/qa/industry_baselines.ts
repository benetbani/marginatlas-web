/**
 * Industry baseline ratios for the cost-stack generator.
 *
 * For each pilot industry, the 8 cost lines as a share of revenue
 * (rent_occupancy + payroll + COGS + utilities + marketing +
 * insurance + equipment + regulatory). Sums to roughly 0.80-0.95 of
 * revenue; the residual is operating margin before depreciation /
 * interest / owner draw.
 *
 * Sources: 2024 industry benchmarks per Phase 1 research notes
 * (US Phase 1 cells). These ratios apply to any country with
 * acceptable accuracy because cost-share patterns within an industry
 * are remarkably stable cross-country; absolute numbers vary because
 * revenue varies. The generator scales each ratio against the cell's
 * own revenue_per_firm, so a low-cost-country cell automatically
 * produces lower absolute cost lines.
 *
 * Setup-cost block baselines are in USD for the US baseline. The
 * bulk SQL generators apply a per-country construction-cost
 * multiplier on top.
 */

export type IndustryBaseline = {
  // Cost stack ratios (fraction of revenue)
  rent_occupancy: number;
  payroll_total: number;
  cost_of_goods_sold: number;
  utilities: number;
  marketing_acquisition: number;
  insurance_professional: number;
  equipment_maintenance: number;
  regulatory_licensing: number;
  // Setup-cost USD baselines (US)
  setup_registration_usd: number;
  setup_capital_usd: number;
  // Working-capital reserve in months of operating cost
  working_capital_months: number;
  // Source citation (used in source_note on every generated cell)
  source_note: string;
};

export const INDUSTRY_BASELINES: Record<string, IndustryBaseline> = {
  restaurants: {
    rent_occupancy: 0.06,
    payroll_total: 0.36,
    cost_of_goods_sold: 0.32,
    utilities: 0.04,
    marketing_acquisition: 0.03,
    insurance_professional: 0.04,
    equipment_maintenance: 0.04,
    regulatory_licensing: 0.01,
    setup_registration_usd: 4500,
    setup_capital_usd: 325000,
    working_capital_months: 4,
    source_note: "NRA 2024 Operations Survey ratios.",
  },

  cafes_coffee: {
    rent_occupancy: 0.12,
    payroll_total: 0.35,
    cost_of_goods_sold: 0.29,
    utilities: 0.03,
    marketing_acquisition: 0.02,
    insurance_professional: 0.04,
    equipment_maintenance: 0.05,
    regulatory_licensing: 0.01,
    setup_registration_usd: 3000,
    setup_capital_usd: 175000,
    working_capital_months: 4,
    source_note: "Toast POS Coffee Report 2024 + Specialty Coffee Association ratios.",
  },

  hairdressers_beauty: {
    rent_occupancy: 0.12,
    payroll_total: 0.45, // commissions dominate
    cost_of_goods_sold: 0.12, // back-bar + retail
    utilities: 0.03,
    marketing_acquisition: 0.03,
    insurance_professional: 0.04,
    equipment_maintenance: 0.02,
    regulatory_licensing: 0.02, // cosmetology
    setup_registration_usd: 2500,
    setup_capital_usd: 100000,
    working_capital_months: 3,
    source_note: "Hair salon industry benchmarks 2024 (Homebase, FinancialModelsLab, BusinessDojo).",
  },

  barbershops: {
    rent_occupancy: 0.14, // higher rent share, lower ticket
    payroll_total: 0.42, // commissions + tips
    cost_of_goods_sold: 0.06, // minimal product
    utilities: 0.03,
    marketing_acquisition: 0.02,
    insurance_professional: 0.03,
    equipment_maintenance: 0.02,
    regulatory_licensing: 0.02,
    setup_registration_usd: 2000,
    setup_capital_usd: 75000,
    working_capital_months: 3,
    source_note: "Barbershop industry benchmarks 2024 (Booksy, Bookedin).",
  },

  auto_repair_shops: {
    rent_occupancy: 0.07,
    payroll_total: 0.25,
    cost_of_goods_sold: 0.35, // parts dominate
    utilities: 0.03,
    marketing_acquisition: 0.03,
    insurance_professional: 0.05, // liability heavy
    equipment_maintenance: 0.04, // lifts, diagnostic tools
    regulatory_licensing: 0.02,
    setup_registration_usd: 3500,
    setup_capital_usd: 200000, // lifts + diagnostic + tools + signage
    working_capital_months: 3,
    source_note: "Auto repair industry benchmarks 2024 (Sharpsheets 3,300+ businesses).",
  },

  hotels_lodging: {
    rent_occupancy: 0.08,
    payroll_total: 0.32,
    cost_of_goods_sold: 0.12, // F&B + room supplies
    utilities: 0.07, // heavy energy
    marketing_acquisition: 0.06,
    insurance_professional: 0.05,
    equipment_maintenance: 0.06,
    regulatory_licensing: 0.01,
    setup_registration_usd: 10000,
    setup_capital_usd: 5000000, // mid-market hotel ~30 rooms x ~$165K/room
    working_capital_months: 6,
    source_note: "AHLA / STR 2024 industry benchmarks + hospitality cost studies (CBRE 2024).",
  },
};
