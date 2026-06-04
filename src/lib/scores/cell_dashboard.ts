/**
 * src/lib/scores/cell_dashboard.ts
 *
 * Pure synthesis for the top-of-page cell dashboard. Turns the numbers the
 * cell page has already computed into an ordered set of tight label/value
 * tables ("sections"). The page renders these as scannable stat grids above
 * the prose, so the reader perceives the economics before reading a word.
 *
 * Sections, in fixed order:
 *   numbers   - the money (revenue, margins, take-home, break-even, headcount)
 *   market    - competitor count, density, and the London market-structure read
 *   survival  - modeled survival curve + churn (London dataset)
 *   pricing   - modeled pricing power, demand drivers, seasonality (London)
 *   cost      - where the money goes (cell.cost_structure shares)
 *   setup     - registration, fit-out, working capital, payback (cell.setup_costs)
 *   climate   - country economics + London rent/labor pressure
 *
 * HIDE WEAKNESS (founder rule): a row is pushed ONLY when its value is a real,
 * finite number (or a present qualitative string). A null / non-finite input
 * means the row is omitted, never faked. A section is pushed ONLY when it has
 * at least one row. We do NOT invent any figure here: every row is either real
 * cell/country data, or a value from the clearly-labeled, modeled London
 * dataset (data/london/london_market_v1.json), which the page footnotes as
 * directional.
 *
 * Pure module: no Supabase, no fs, no other runtime side effects. Cell is a
 * type-only import; the taxonomy helper and the static London JSON are pure
 * lookups, so this stays trivially unit-testable and cannot trip the layering
 * gate (which only walks src/app + src/components). The caller passes its own
 * money formatter so the dashboard matches the rest of the page exactly.
 */
import type { Cell } from "@/lib/cells";
import { industryToSlug } from "@/lib/taxonomy";
import type { SetupCosts } from "@/lib/types/deepening";
import londonJson from "../../../data/london/london_market_v1.json";

export type DashRow = { label: string; value: string | null; hint?: string };

export type DashSection = {
  key: string;
  title: string;
  /** Optional one-line provenance note rendered muted under the heading. */
  note?: string;
  rows: DashRow[];
};

export type CellDashboardData = { sections: DashSection[] };

/**
 * One curated London activity entry. Modeled from national business
 * demography (see the JSON's source_note); treated as directional on the page.
 */
export type LondonMarket = {
  typology: string;
  chain_share_pct: number;
  concentration: string;
  informality: string;
  survival: { yr1: number; yr3: number; yr5: number };
  churn_pct: number;
  pricing_power: string;
  demand_drivers: string[];
  seasonality: string;
  rent_pressure: string;
  labor_pressure: string;
};

type LondonFile = {
  activities: Record<string, LondonMarket>;
};

const LONDON = londonJson as LondonFile;

/**
 * Look up the curated London entry for a cell. Only GB cells qualify; the
 * activity is keyed by the cell industry's URL slug. Returns null for non-GB
 * cells and for GB activities not present in the dataset (self-omit upstream).
 */
export function getLondonEntry(cell: Cell): LondonMarket | null {
  if (cell.country !== "GB") return null;
  if (!cell.industry_id) return null;
  const slug = industryToSlug(cell.industry_id);
  return LONDON.activities[slug] ?? null;
}

export interface CellDashboardInput {
  cell: Cell;
  typicalRevenue: number | null;
  grossMarginPct: number | null; // 0..1
  netMarginPct: number | null; // 0..1
  ownerTakeHome: number | null;
  breakevenOrdersDaily: number | null;
  typicalOrdersDaily: number | null;
  peopleWorking: number | null;
  wagePerEmployee: number | null;
  cityPopulation: number | null; // residents, null if geo is not a city
  /** Country economics snapshot (getCountryEconomicsSnapshot). */
  econ: {
    gdpPerCapita: number | null;
    avgMonthlySalary: number | null;
    netWealthPerAdult: number | null;
    selfEmploymentPct: number | null;
    daysToStart: number | null;
    inflationPctYoy: number | null;
  } | null;
  /** cell.cost_structure: percent (0..100) or fraction (0..1) shares. */
  costStructure: { cogs: number; labor: number; rent: number; other: number } | null;
  /** cell.setup_costs (deepening SetupCosts). */
  setupCosts: SetupCosts | null;
  /** Curated London entry, or null (non-GB / not in dataset). */
  londonEntry: LondonMarket | null;
  fmtMoney: (n: number | null | undefined) => string; // the page's formatter
}

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/** A present, non-empty qualitative string. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/**
 * Normalise a cost share to a whole percent. The cell cost_structure may
 * arrive as percentages (0..100) or fractions (0..1); a value <= 1 is treated
 * as a fraction and scaled. Non-finite input returns null so the row omits.
 */
function pctShare(v: number | null | undefined): number | null {
  if (!isNum(v)) return null;
  const pct = v <= 1 ? v * 100 : v;
  return Math.round(pct);
}

/**
 * Build the dashboard sections for a cell. Deterministic and side-effect free:
 * same inputs always yield the same sections. Each row is pushed only when its
 * value is real; each section is pushed only when it has at least one row, in
 * the fixed order documented at the top of the file.
 */
export function buildCellDashboard(input: CellDashboardInput): CellDashboardData {
  const {
    cell,
    typicalRevenue,
    grossMarginPct,
    netMarginPct,
    ownerTakeHome,
    breakevenOrdersDaily,
    typicalOrdersDaily,
    peopleWorking,
    wagePerEmployee,
    cityPopulation,
    econ,
    costStructure,
    setupCosts,
    londonEntry,
    fmtMoney,
  } = input;

  const sections: DashSection[] = [];
  const pushSection = (s: DashSection) => {
    if (s.rows.length > 0) sections.push(s);
  };

  // -- 1. The numbers (money) ------------------------------------------------
  const numbers: DashRow[] = [];
  if (isNum(typicalRevenue)) {
    numbers.push({
      label: "Typical revenue",
      value: fmtMoney(typicalRevenue),
      hint: "median firm",
    });
  }
  if (isNum(grossMarginPct)) {
    numbers.push({ label: "Gross margin", value: `${Math.round(grossMarginPct * 100)}%` });
  }
  if (isNum(netMarginPct)) {
    numbers.push({ label: "Net margin", value: `${Math.round(netMarginPct * 100)}%` });
  }
  if (isNum(ownerTakeHome)) {
    numbers.push({ label: "Owner take-home", value: fmtMoney(ownerTakeHome) });
  }
  if (isNum(breakevenOrdersDaily)) {
    numbers.push({
      label: "Break-even",
      value: `${Math.round(breakevenOrdersDaily)} orders/day`,
      hint: isNum(typicalOrdersDaily)
        ? `vs ${Math.round(typicalOrdersDaily)} typical`
        : undefined,
    });
  }
  if (isNum(peopleWorking)) {
    numbers.push({ label: "People working", value: peopleWorking.toLocaleString() });
  }
  if (isNum(wagePerEmployee)) {
    numbers.push({ label: "Wage / employee", value: fmtMoney(wagePerEmployee) });
  }
  pushSection({ key: "numbers", title: "The numbers", rows: numbers });

  // -- 2. The market ---------------------------------------------------------
  const market: DashRow[] = [];
  const competitors = cell.n_enterprises;
  if (isNum(competitors)) {
    market.push({
      label: "Competitors",
      value: competitors.toLocaleString(),
      hint: "firms in this market",
    });
    if (isNum(cityPopulation) && cityPopulation > 0) {
      const per10k = Math.round((competitors / (cityPopulation / 10000)) * 10) / 10;
      if (isNum(per10k)) {
        market.push({ label: "Density", value: `${per10k} per 10k residents` });
      }
    }
  }
  if (londonEntry) {
    if (hasText(londonEntry.typology)) {
      market.push({ label: "Market structure", value: londonEntry.typology });
    }
    if (isNum(londonEntry.chain_share_pct)) {
      market.push({
        label: "Chains",
        value: `${londonEntry.chain_share_pct}% of the market`,
      });
    }
    if (hasText(londonEntry.concentration)) {
      market.push({ label: "Concentration", value: londonEntry.concentration });
    }
    if (hasText(londonEntry.informality)) {
      market.push({ label: "Informality", value: londonEntry.informality });
    }
  }
  pushSection({ key: "market", title: "The market", rows: market });

  // -- 3. Survival (modeled, London) -----------------------------------------
  const survival: DashRow[] = [];
  if (londonEntry) {
    if (isNum(londonEntry.survival?.yr1)) {
      survival.push({ label: "1-year", value: `${londonEntry.survival.yr1}%` });
    }
    if (isNum(londonEntry.survival?.yr3)) {
      survival.push({ label: "3-year", value: `${londonEntry.survival.yr3}%` });
    }
    if (isNum(londonEntry.survival?.yr5)) {
      survival.push({ label: "5-year", value: `${londonEntry.survival.yr5}%` });
    }
    if (isNum(londonEntry.churn_pct)) {
      survival.push({ label: "Annual churn", value: `${londonEntry.churn_pct}% per year` });
    }
  }
  pushSection({
    key: "survival",
    title: "Survival",
    note: "Modeled from national business demography",
    rows: survival,
  });

  // -- 4. Pricing and demand (modeled, London) -------------------------------
  const pricing: DashRow[] = [];
  if (londonEntry) {
    if (hasText(londonEntry.pricing_power)) {
      pricing.push({ label: "Pricing power", value: londonEntry.pricing_power });
    }
    if (Array.isArray(londonEntry.demand_drivers) && londonEntry.demand_drivers.length > 0) {
      pricing.push({ label: "Demand", value: londonEntry.demand_drivers.join(", ") });
    }
    if (hasText(londonEntry.seasonality)) {
      pricing.push({ label: "Seasonality", value: londonEntry.seasonality });
    }
  }
  pushSection({ key: "pricing", title: "Pricing and demand", rows: pricing });

  // -- 5. Where the money goes (cost structure) ------------------------------
  const cost: DashRow[] = [];
  if (costStructure) {
    const cogs = pctShare(costStructure.cogs);
    const labor = pctShare(costStructure.labor);
    const rent = pctShare(costStructure.rent);
    const other = pctShare(costStructure.other);
    if (cogs != null) cost.push({ label: "COGS", value: `${cogs}%` });
    if (labor != null) cost.push({ label: "Labor", value: `${labor}%` });
    if (rent != null) cost.push({ label: "Rent", value: `${rent}%` });
    if (other != null) cost.push({ label: "Other", value: `${other}%` });
  }
  pushSection({ key: "cost", title: "Where the money goes", rows: cost });

  // -- 6. Setup and capital (setup_costs) ------------------------------------
  const setup: DashRow[] = [];
  if (setupCosts) {
    const regTotal = setupCosts.registration?.total_estimated;
    const capTotal = setupCosts.capital?.total_estimated;
    const reserveMonths = setupCosts.capital?.working_capital_reserve_months;
    const payback = setupCosts.payback_months_estimate;
    if (isNum(regTotal)) {
      setup.push({ label: "Registration", value: fmtMoney(regTotal) });
    }
    if (isNum(capTotal)) {
      setup.push({ label: "Fit-out and equipment", value: fmtMoney(capTotal) });
    }
    if (isNum(reserveMonths)) {
      setup.push({ label: "Working capital", value: `${reserveMonths} months` });
    }
    if (isNum(payback)) {
      setup.push({ label: "Payback", value: `${payback} months` });
    }
  }
  pushSection({ key: "setup", title: "Setup and capital", rows: setup });

  // -- 7. Business climate (country econ + London pressure) ------------------
  const climate: DashRow[] = [];
  if (econ) {
    if (isNum(econ.gdpPerCapita)) {
      climate.push({ label: "GDP per capita", value: fmtMoney(econ.gdpPerCapita) });
    }
    if (isNum(econ.avgMonthlySalary)) {
      climate.push({
        label: "Average income",
        value: fmtMoney(econ.avgMonthlySalary * 12),
        hint: "per year",
      });
    }
    if (isNum(econ.netWealthPerAdult)) {
      climate.push({ label: "Net wealth per adult", value: fmtMoney(econ.netWealthPerAdult) });
    }
    if (isNum(econ.selfEmploymentPct)) {
      climate.push({
        label: "Self-employed",
        value: `${Math.round(econ.selfEmploymentPct)}% of workers`,
      });
    }
    if (isNum(econ.daysToStart)) {
      climate.push({
        label: "Days to register",
        value: `${Math.round(econ.daysToStart)} days`,
      });
    }
    if (isNum(econ.inflationPctYoy)) {
      climate.push({
        label: "Inflation",
        value: `${econ.inflationPctYoy.toFixed(1)}% per year`,
      });
    }
  }
  if (londonEntry) {
    if (hasText(londonEntry.rent_pressure)) {
      climate.push({ label: "Rent pressure", value: londonEntry.rent_pressure });
    }
    if (hasText(londonEntry.labor_pressure)) {
      climate.push({ label: "Labor pressure", value: londonEntry.labor_pressure });
    }
  }
  pushSection({ key: "climate", title: "Business climate", rows: climate });

  return { sections };
}
