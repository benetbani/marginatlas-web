/**
 * Fixed cost estimator.
 *
 * Given a Cell, returns a breakdown of typical annual fixed costs.
 * Pulls from the curated tables landed earlier in Plan v10:
 *  - industry_margins.json (asset_intensity)
 *  - property_tax_2024.json (commercial property tax rate)
 *  - commercial_rent_2024.json (USD/m²/year by city, country median fallback)
 *  - operating_cost_multipliers_2024.json (utilities/software/compliance)
 */
import marginsJson from "./industry_margins.json";
import propertyTaxJson from "./property_tax_2024.json";
import rentJson from "./commercial_rent_2024.json";
import multipliersJson from "./operating_cost_multipliers_2024.json";

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  asset_intensity: number;
  notes?: string;
};
type PropertyTaxRow = { commercial_property_tax_rate: number; notes?: string };
type RentRow = { usd_per_sqm_per_year: number; city: string; notes?: string };
type MultiplierRow = { utilities: number; software: number; compliance: number; notes?: string };

type MarginsTable = {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};
type PropertyTable = { default_fallback: PropertyTaxRow; rates: Record<string, PropertyTaxRow> };
type RentTable = {
  default_fallback_usd_per_sqm_per_year: number;
  country_medians: Record<string, number>;
  cities: Record<string, RentRow>;
};
type MultiplierTable = {
  default_fallback: MultiplierRow;
  multipliers: Record<string, MultiplierRow>;
};

const MARGINS = marginsJson as unknown as MarginsTable;
const PROPERTY = propertyTaxJson as unknown as PropertyTable;
const RENT = rentJson as unknown as RentTable;
const MULTIPLIERS = multipliersJson as unknown as MultiplierTable;

function industryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return MARGINS.default_fallback;
  return MARGINS.industries[industryId] || MARGINS.default_fallback;
}

function propertyTaxRate(iso2: string): number {
  const key = iso2.toUpperCase();
  return PROPERTY.rates[key]?.commercial_property_tax_rate
    ?? PROPERTY.default_fallback.commercial_property_tax_rate;
}

function rentUsdPerSqm(iso2: string, geoId: string | null | undefined): number {
  // Try city-specific first
  if (geoId) {
    const direct = RENT.cities[geoId];
    if (direct) return direct.usd_per_sqm_per_year;
    const upper = geoId.toUpperCase();
    if (RENT.cities[upper]) return RENT.cities[upper].usd_per_sqm_per_year;
  }
  // Fall back to country median
  return RENT.country_medians[iso2.toUpperCase()]
    ?? RENT.default_fallback_usd_per_sqm_per_year;
}

function multipliers(iso2: string): MultiplierRow {
  return MULTIPLIERS.multipliers[iso2.toUpperCase()] ?? MULTIPLIERS.default_fallback;
}

// Industry-typical floorplate (sqm) per typical SMB firm. Rough proxies; we
// pick a single representative size rather than scaling to employees so
// the layer stays interpretable.
const TYPICAL_SQM_BY_SECTOR: Record<string, number> = {
  food_drink: 150,
  retail_shops: 120,
  hospitality: 1200,
  beauty_wellness: 80,
  health_clinics: 180,
  professional_services: 120,
  software_tech: 100,
  creative_media: 90,
  real_estate: 70,
  events_entertainment: 200,
  trades_home: 120,
  other_local: 200,
  cultural: 350,
  education_instruction: 280,
  pet_services: 150,
  transport_small: 400,
  repair: 110,
  manufacturing_artisan: 600,
  construction: 200,
  farming_food_production: 900,
};
const DEFAULT_SQM = 200;

function typicalSqm(sectorId: string | null | undefined): number {
  if (!sectorId) return DEFAULT_SQM;
  return TYPICAL_SQM_BY_SECTOR[sectorId] ?? DEFAULT_SQM;
}

export type FixedCostBreakdown = {
  rent: number;
  property_tax: number;
  insurance: number;
  utilities: number;
  software: number;
  other_overhead: number;
  total: number;
};

export type FixedCostInput = {
  iso2: string;
  geoId: string | null;
  industryId: string | null;
  sectorId: string | null;
  revenue: number;
};

/** Estimate annual fixed costs for one typical firm in this cell. */
export function estimateFixedCosts(input: FixedCostInput): FixedCostBreakdown {
  const margin = industryMargin(input.industryId);
  const mult = multipliers(input.iso2);
  const sqm = typicalSqm(input.sectorId);

  // Rent — city/country rent × typical floor area
  const rent = sqm * rentUsdPerSqm(input.iso2, input.geoId);

  // Property tax — asset value (revenue × industry asset intensity) × commercial rate
  const assetValue = input.revenue * margin.asset_intensity;
  const property_tax = assetValue * propertyTaxRate(input.iso2);

  // Insurance — industry-typical fraction of revenue (~1% baseline)
  const insurance = input.revenue * 0.010;

  // Utilities — baseline 0.8% of revenue scaled by country multiplier
  const utilities = input.revenue * 0.008 * mult.utilities;

  // Software/subscriptions — baseline 0.6% of revenue scaled by country
  const software = input.revenue * 0.006 * mult.software;

  // Other overhead (accounting, legal filings, bank fees, professional
  // services) — baseline 1.2% of revenue scaled by compliance multiplier
  const other_overhead = input.revenue * 0.012 * mult.compliance;

  const total = rent + property_tax + insurance + utilities + software + other_overhead;
  return {
    rent: Math.round(rent),
    property_tax: Math.round(property_tax),
    insurance: Math.round(insurance),
    utilities: Math.round(utilities),
    software: Math.round(software),
    other_overhead: Math.round(other_overhead),
    total: Math.round(total),
  };
}
