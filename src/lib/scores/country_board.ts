/**
 * src/lib/scores/country_board.ts
 *
 * Pure synthesis for the data board that leads the country page (/gb, /de, /jp).
 * It is the country-altitude sibling of cell_board.ts and follows the exact
 * same contract, so a reader who has learned the cell board reads this one for
 * free:
 *
 *   - Every section and every row is ALWAYS present, in a fixed order. A datum
 *     we do not hold is emitted as a null value, which the board's StatGrid
 *     renders as the MISSING dash. The board is a scaffold, not a data-shaped
 *     silhouette: its shape never depends on which figures exist, so a blank
 *     reads as "we do not have this field" rather than "this page is broken".
 *   - Honest dashes beat invented numbers. The country page holds only a small
 *     set of real country-level figures (the economics snapshot plus the two
 *     tax rates the page already loads); every row beyond those is null, never
 *     a fabricated stand-in.
 *   - Sections that lean on modeled / directional inputs carry `modeled: true`,
 *     which renders one quiet footnote per section, not a badge per row.
 *
 * Sections, in fixed order, ALWAYS emitted:
 *   climate    Tax and climate: corporate / small-business tax, registration, VAT
 *   friction   Institutional friction (modeled)
 *   labor      Labor and skills (modeled): wages, GDP per head, skills
 *   survival   Survival baseline (modeled): country-level business survival
 *   market     Market structure (modeled): informality, concentration
 *
 * Pure module: no Supabase, no fs, no runtime side effects. The board consumes
 * numbers the country page has already computed (the economics snapshot, the
 * SMB tax regime, the headline sales tax) and shapes them into rows; it does
 * not fetch. Kit types are type-only imports, exactly like cell_board.ts, so
 * this stays trivially testable and cannot trip the layering gate (which only
 * walks src/app + src/components). No chart is attached at the country level
 * today, so the module stays plain TypeScript with no React dependency.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { BoardSection } from "@/components/board/DataSection";
import type { StatRow } from "@/components/board/StatGrid";
import { fmtUSD, fmtPct } from "@/components/board/format";

/**
 * The country-level economics the board reads. This is the shape the country
 * page already holds from getCountryEconomicsSnapshot, narrowed to the fields
 * the board uses. Every field is nullable; a null becomes a dash.
 */
export interface CountryBoardEcon {
  /** GDP per capita, USD, latest year. */
  gdpPerCapita: number | null;
  /** Average gross monthly salary, USD. */
  avgMonthlySalary: number | null;
  /** Median net wealth per adult, USD. */
  netWealthPerAdult: number | null;
  /** Self-employment share of total employment, percent (0..100). */
  selfEmploymentPct: number | null;
  /** Typical days to register a sole-trader business. */
  daysToStart: number | null;
  /** CPI year-over-year, percent (e.g. 2.4 for 2.4%). */
  inflationPctYoy: number | null;
}

export interface CountryBoardInput {
  /** Country-economics snapshot, or null when the country has no entry. */
  econ: CountryBoardEcon | null;
  /**
   * Effective small-business / corporate income-tax burden as a share (0..1),
   * or null. This is the country-level analogue of the cell board's corporate
   * tax row: the rate the typical small business actually pays.
   */
  smbEffectiveRate: number | null;
  /** Standard VAT / sales-tax rate as a share (0..1), or null. */
  vatStandard: number | null;
}

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/** A present, non-empty qualitative string, else null (so the row blanks). */
function textOrNull(s: string | null | undefined): string | null {
  return typeof s === "string" && s.trim().length > 0 ? s : null;
}

/**
 * Build the full country board. Deterministic and side-effect free: the same
 * inputs always yield the same five sections, every section and every row
 * present, in the fixed order documented at the top of the file.
 */
export function buildCountryBoard(input: CountryBoardInput): BoardSection[] {
  const { econ, smbEffectiveRate, vatStandard } = input;

  // Avoid an unused-helper warning while keeping textOrNull available for the
  // qualitative rows that are null today and will carry words once curated.
  void textOrNull;

  // -- climate. Tax and climate. -------------------------------------------
  // The two tax rows are real country-level figures the page already loads;
  // everything else here is honestly blank until curated.
  const climateRows: StatRow[] = [
    {
      label: "Corporate tax rate",
      value: isNum(smbEffectiveRate)
        ? fmtPct(smbEffectiveRate, { fromFraction: true })
        : null,
      hint: "typical small business",
    },
    {
      label: "Days to register a business",
      value:
        econ && isNum(econ.daysToStart)
          ? `${Math.round(econ.daysToStart)} ${
              Math.round(econ.daysToStart) === 1 ? "day" : "days"
            }`
          : null,
    },
    {
      label: "Sales tax",
      value: isNum(vatStandard) ? fmtPct(vatStandard, { fromFraction: true }) : null,
    },
    { label: "Payroll tax", value: null },
    { label: "Effective tax wedge", value: null },
    { label: "Licensing cost", value: null },
  ];

  // -- friction. Institutional friction (modeled). -------------------------
  const frictionRows: StatRow[] = [
    { label: "Enforcing contracts", value: null },
    { label: "Bureaucracy", value: null },
    { label: "Permits", value: null },
    { label: "Bribery exposure", value: null },
    { label: "Inspection risk", value: null },
  ];

  // -- labor. Labor and skills (modeled). ----------------------------------
  // Average wage comes from the snapshot's monthly salary (annualized for the
  // yearly read); GDP per head is the snapshot figure. Skills availability is
  // a qualitative row we do not yet hold, so it blanks.
  const annualWage =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;
  const laborRows: StatRow[] = [
    {
      label: "Average wage",
      value: isNum(annualWage) ? fmtUSD(annualWage) : null,
      hint: "per year",
    },
    {
      label: "Monthly salary",
      value: econ && isNum(econ.avgMonthlySalary) ? fmtUSD(econ.avgMonthlySalary) : null,
    },
    {
      label: "GDP per capita",
      value: econ && isNum(econ.gdpPerCapita) ? fmtUSD(econ.gdpPerCapita) : null,
    },
    { label: "Skills availability", value: null },
    { label: "Hiring difficulty", value: null },
    { label: "Minimum-wage pressure", value: null },
  ];

  // -- survival. Survival baseline (modeled). ------------------------------
  // Country-level business survival is not held today; the rows are present so
  // the field is named, and blank so nothing is invented.
  const survivalRows: StatRow[] = [
    { label: "1-year survival", value: null },
    { label: "3-year", value: null },
    { label: "5-year", value: null },
    { label: "Closure rate", value: null },
  ];

  // -- market. Market structure (modeled). ---------------------------------
  // Informality reads off the snapshot's self-employment share (a broad but
  // correlated proxy); household savings depth is the snapshot figure;
  // concentration is a qualitative summary we do not yet hold.
  const marketRows: StatRow[] = [
    {
      label: "Informality",
      value:
        econ && isNum(econ.selfEmploymentPct)
          ? `${Math.round(econ.selfEmploymentPct)}% self-employed`
          : null,
    },
    {
      label: "Household savings",
      value: econ && isNum(econ.netWealthPerAdult) ? fmtUSD(econ.netWealthPerAdult) : null,
      hint: "per adult",
    },
    {
      label: "Price stability",
      value:
        econ && isNum(econ.inflationPctYoy)
          ? `${fmtPct(econ.inflationPctYoy)} inflation`
          : null,
    },
    { label: "Concentration", value: null },
    { label: "Chain share", value: null },
  ];

  return [
    { key: "climate", title: "Tax and climate", rows: climateRows, modeled: true },
    { key: "friction", title: "Institutional friction", rows: frictionRows, modeled: true },
    { key: "labor", title: "Labor and skills", rows: laborRows, modeled: true },
    { key: "survival", title: "Survival baseline", rows: survivalRows, modeled: true },
    { key: "market", title: "Market structure", rows: marketRows, modeled: true },
  ];
}
