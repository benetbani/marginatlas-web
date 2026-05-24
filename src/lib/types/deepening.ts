/**
 * Industry-deepening type definitions (Plan v32, Sprint G).
 *
 * Foundation for the four interlocking systems in the master plan:
 *   1. Sub-industry variants
 *   2. Per-cell annual cost stack
 *   3. One-time setup-cost block
 *   4. Dynamic section registry (see ../page-layout/section-registry.ts)
 *
 * Every type here is OPTIONAL on the existing Cell. Phase 0 adds the
 * shapes without requiring any field to be populated; Phase 1 starts
 * populating them per (industry, country) as primary-source data
 * lands. Until populated, the corresponding page sections suppress
 * themselves.
 *
 * Fabrication policy (founder, hard line): a variant or cost-stack
 * entry ships ONLY when sourced from primary data. Pure extrapolation
 * from the parent industry leaves the variant hidden. Enforced by
 * prebuild gate verify_deepening.
 */

// ---------------------------------------------------------------------------
// Sub-industry variants
// ---------------------------------------------------------------------------

/**
 * A sub-shape inside a parent industry. Surfaced as a chip selector on
 * the cell page when at least one variant has data_ready=true for the
 * cell's country.
 */
export type SubIndustry = {
  /** Stable id, e.g. "barbershops_mens", "auto_dealers_used". */
  id: string;
  /** The parent industry's id this variant belongs to. */
  parent_industry_id: string;
  /** Display name. Plain English; no caveat suffixes here. */
  name: string;
  /** Optional one-line clarifier surfaced under the chip. */
  description?: string;
  /**
   * If true, the variant is wired in code AND has real primary-source
   * data for at least one country. If false, the variant is a stub:
   * Phase 1 will flip this when real data arrives. Variants with
   * data_ready=false do NOT render on the live site.
   */
  data_ready: boolean;
  /**
   * Set when the variant is country-prevalent rather than universal.
   * Variant is offered on cells of these countries only. Empty / undefined
   * means "applies everywhere the parent does."
   */
  prevalent_in?: string[];
};

/**
 * Per-cell sub-industry pick. Lives in the cells_master / regional_cells
 * row (added by the SQL migration). When null, the cell is the parent
 * industry's roll-up; when set, the cell is the specific variant.
 */
export type SubIndustryRef = {
  sub_industry_id: string;
  /** "primary": original source uses this granularity. "modeled": derived. */
  source_kind: "primary" | "modeled";
};

// ---------------------------------------------------------------------------
// Annual cost stack (eight canonical lines)
// ---------------------------------------------------------------------------

/**
 * Canonical eight-line annual cost stack. Every field is USD per
 * typical firm per year. Optional means "no primary-source data for
 * this (industry, country) yet."
 *
 * Sum of populated fields approximates the annual operating cost; the
 * gap from revenue is the operating margin (handled in the existing
 * waterfall, no change there).
 */
export type CostStack = {
  rent_occupancy?: number;
  payroll_total?: number; // wages + employer-side social contributions
  cost_of_goods_sold?: number;
  utilities?: number;
  marketing_acquisition?: number;
  insurance_professional?: number;
  equipment_maintenance?: number;
  regulatory_licensing?: number;
  /**
   * ISO date the cost stack was last refreshed. Drives the freshness
   * indicator on the page and the prebuild gate's staleness check.
   */
  refreshed_at?: string;
  /** Where the numbers came from. Free-text, audit-trail. */
  source_note?: string;
  /** Quality grade: A primary, B mixed, C mostly extrapolated, D modeled. */
  grade?: "A" | "B" | "C" | "D";
};

// ---------------------------------------------------------------------------
// Setup-cost block (two boxes shown above revenue tiles)
// ---------------------------------------------------------------------------

/**
 * Box 1 — registration + licensing (the legal floor for opening this
 * business in this country). All USD.
 */
export type SetupRegistration = {
  business_registration_fee?: number;
  industry_licenses_fee?: number;
  professional_license_fee?: number; // bar exam, CPA, MD, etc.
  insurance_bond_initial?: number;
  certifications_initial?: number; // food handler, OSHA, HACCP, etc.
  total_estimated?: number; // sum, but provided explicitly to support country adjustments
  source_note?: string;
};

/**
 * Box 2 — capital fit-out + equipment + opening reserves (where the
 * big numbers live). All USD.
 */
export type SetupCapital = {
  property_fitout?: number;
  equipment_initial?: number;
  initial_inventory?: number;
  working_capital_reserve_months?: number; // typically 3-6
  lease_deposit?: number;
  pre_opening_marketing?: number;
  total_estimated?: number;
  source_note?: string;
};

/**
 * Combined setup-cost block. Suppressed entirely on the cell page when
 * BOTH halves are missing, OR when the industry is on the "no setup
 * cost" allow-list (consultants, freelance writers, etc.).
 */
export type SetupCosts = {
  registration?: SetupRegistration;
  capital?: SetupCapital;
  /** Quick break-even estimate, months. Derived from setup ÷ (revenue × margin). */
  payback_months_estimate?: number;
  refreshed_at?: string;
  grade?: "A" | "B" | "C" | "D";
};

// ---------------------------------------------------------------------------
// Local-name flavor layer
// ---------------------------------------------------------------------------

/**
 * Per-(industry, country) local-name alias used in the display layer
 * only. URLs, sitemap, OG titles stay in the global vocabulary so SEO
 * doesn't fragment.
 */
export type LocalAlias = {
  industry_id: string;
  country_iso2: string;
  local_name: string;
  local_name_translit?: string;
  pronunciation_hint?: string;
};

// ---------------------------------------------------------------------------
// Combined cell extensions
// ---------------------------------------------------------------------------

/**
 * Fields added to the existing Cell type by the deepening work. All
 * optional. The actual Cell type lives in src/lib/cells.ts; this is
 * the contract the new fields follow.
 */
export type CellDeepening = {
  sub_industry?: SubIndustryRef;
  cost_stack?: CostStack;
  setup_costs?: SetupCosts;
  /**
   * Country-specific local name override. Comes from local_aliases
   * table; nullable when the cell uses the global industry name.
   */
  local_alias?: LocalAlias;
};
