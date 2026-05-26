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
  /**
   * ATO Phase 3 — motor vehicle (vehicle + fuel + maintenance +
   * depreciation) as a fraction of revenue. Optional: present only
   * for trades / transport / mobile services where the vehicle is a
   * real operating line item. Office-based industries leave this
   * undefined and the renderer fully suppresses the row.
   */
  motor_vehicle?: number;
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
    motor_vehicle: 0.03, // shop trucks + tow + parts runs
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

  // Plan v32 Sprint G extension — 10 additional high-traffic SMB industries.

  dental_practices: {
    rent_occupancy: 0.08,
    payroll_total: 0.28, // dental hygienists + assistant + front desk
    cost_of_goods_sold: 0.06, // dental supplies / lab fees
    utilities: 0.02,
    marketing_acquisition: 0.04,
    insurance_professional: 0.06, // malpractice is real
    equipment_maintenance: 0.05, // chairs, X-ray, sterilization
    regulatory_licensing: 0.02,
    setup_registration_usd: 5000,
    setup_capital_usd: 500000, // dental chairs + X-ray + buildout
    working_capital_months: 4,
    source_note: "ADA Health Policy Institute economic surveys + dental practice benchmarking 2024.",
  },

  doctors_clinics: {
    rent_occupancy: 0.07,
    payroll_total: 0.40, // physician + nurses + admin
    cost_of_goods_sold: 0.07, // medical supplies
    utilities: 0.02,
    marketing_acquisition: 0.02,
    insurance_professional: 0.07, // malpractice insurance
    equipment_maintenance: 0.04,
    regulatory_licensing: 0.02,
    setup_registration_usd: 5000,
    setup_capital_usd: 350000,
    working_capital_months: 4,
    source_note: "MGMA Cost and Revenue Survey 2024 + AMA practice benchmarks.",
  },

  legal_services: {
    rent_occupancy: 0.10,
    payroll_total: 0.45, // associates + paralegals + admin dominate
    cost_of_goods_sold: 0.01,
    utilities: 0.02,
    marketing_acquisition: 0.04,
    insurance_professional: 0.05, // malpractice + LPL
    equipment_maintenance: 0.02,
    regulatory_licensing: 0.03, // bar dues + CLE
    setup_registration_usd: 4000,
    setup_capital_usd: 80000, // office buildout + furniture + IT
    working_capital_months: 4,
    source_note: "ABA Profile of the Legal Profession 2024 + Clio Legal Trends Report 2024.",
  },

  accounting_tax: {
    rent_occupancy: 0.09,
    payroll_total: 0.50, // accountants + staff dominate solo+ practices
    cost_of_goods_sold: 0.01,
    utilities: 0.02,
    marketing_acquisition: 0.03,
    insurance_professional: 0.04,
    equipment_maintenance: 0.03, // software subscriptions
    regulatory_licensing: 0.02, // CPA license + CPE
    setup_registration_usd: 3500,
    setup_capital_usd: 50000,
    working_capital_months: 3,
    source_note: "AICPA PCPS National Management of an Accounting Practice survey 2024.",
  },

  real_estate_agencies: {
    rent_occupancy: 0.08,
    payroll_total: 0.55, // commission splits to agents dominate
    cost_of_goods_sold: 0.02,
    utilities: 0.02,
    marketing_acquisition: 0.08, // listings, photography, online ads
    insurance_professional: 0.03, // E&O insurance
    equipment_maintenance: 0.02,
    regulatory_licensing: 0.02,
    setup_registration_usd: 3000,
    setup_capital_usd: 50000,
    working_capital_months: 4,
    source_note: "NAR Member Profile 2024 + REAL Trends 500 brokerage benchmarks.",
  },

  residential_construction: {
    rent_occupancy: 0.02,
    payroll_total: 0.25, // skilled trades, mix of own + sub
    cost_of_goods_sold: 0.50, // materials and subcontracts dominate
    utilities: 0.01,
    marketing_acquisition: 0.02,
    insurance_professional: 0.06, // GL + workers comp + bond
    equipment_maintenance: 0.03, // tools, equipment (vehicles broken out separately)
    motor_vehicle: 0.04, // crew trucks, vans, fuel, maintenance
    regulatory_licensing: 0.03, // contractor license + permits
    setup_registration_usd: 6000,
    setup_capital_usd: 150000, // trucks + tools + initial materials + office
    working_capital_months: 4,
    source_note: "NAHB Builder Cost survey 2024 + Construction Financial Management Association data.",
  },

  grocery_stores: {
    rent_occupancy: 0.05,
    payroll_total: 0.16, // grocery thin labor share
    cost_of_goods_sold: 0.72, // very high COGS, thin margins
    utilities: 0.02,
    marketing_acquisition: 0.01,
    insurance_professional: 0.01,
    equipment_maintenance: 0.02, // refrigeration is real
    regulatory_licensing: 0.01,
    setup_registration_usd: 4000,
    setup_capital_usd: 350000, // shelving + refrigeration + POS + initial stock
    working_capital_months: 2, // inventory turns fast
    source_note: "FMI The Food Industry Speaks 2024 + NACS Annual Survey 2024.",
  },

  clothing_stores: {
    rent_occupancy: 0.15, // retail rent very high
    payroll_total: 0.16,
    cost_of_goods_sold: 0.50, // wholesale cost of apparel
    utilities: 0.02,
    marketing_acquisition: 0.04,
    insurance_professional: 0.02,
    equipment_maintenance: 0.02,
    regulatory_licensing: 0.01,
    setup_registration_usd: 3000,
    setup_capital_usd: 200000, // build-out + fixtures + opening inventory
    working_capital_months: 3,
    source_note: "Retail Owners Institute 2024 + NRF small retailer surveys.",
  },

  sports_fitness: {
    rent_occupancy: 0.20, // gyms eat rent
    payroll_total: 0.28, // trainers + front desk
    cost_of_goods_sold: 0.05, // small retail + supplements
    utilities: 0.05, // heavy lighting + climate
    marketing_acquisition: 0.07,
    insurance_professional: 0.03,
    equipment_maintenance: 0.08, // gym equipment is expensive to maintain
    regulatory_licensing: 0.01,
    setup_registration_usd: 4000,
    setup_capital_usd: 350000, // equipment + buildout dominate
    working_capital_months: 4,
    source_note: "IHRSA Global Report 2024 + ClubIntel fitness operator survey.",
  },

  veterinary_pet_care: {
    rent_occupancy: 0.08,
    payroll_total: 0.40, // vets + techs + reception
    cost_of_goods_sold: 0.18, // pharmaceuticals + supplies + food retail
    utilities: 0.02,
    marketing_acquisition: 0.03,
    insurance_professional: 0.04, // malpractice + premises
    equipment_maintenance: 0.04, // X-ray, surgical, dental, lab
    regulatory_licensing: 0.02,
    setup_registration_usd: 5000,
    setup_capital_usd: 400000, // clinic buildout + equipment
    working_capital_months: 3,
    source_note: "AVMA Economic State of the Veterinary Profession 2024 + VPI/Nationwide cost surveys.",
  },
};
