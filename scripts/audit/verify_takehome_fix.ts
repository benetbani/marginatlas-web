/**
 * verify_takehome_fix.ts
 *
 * Failing-check-first verification for the owner-take-home bug fix.
 *
 * The bug (two coordinated defects):
 *   PART A  enforceSanity (src/lib/cells/fill_defaults.ts) treated the
 *           region-TOTAL n_employees as a per-firm ceiling and overwrote it
 *           with floor(revenue / (wage * 1.4)) when the affordability ratio
 *           tripped. The cell page then saw a value < n_enterprises, decided it
 *           was "already per-firm", and multiplied it by the wage, overstating
 *           payroll 2x-5x and driving net profit negative on most affected cells.
 *   PART B  The page floored the displayed NET MARGIN to 3% (clampMargin) but
 *           the OWNER TAKE-HOME row and the break-in score read the unfloored
 *           dollar, so a card could show "3% net" and "-$250K take-home" and a
 *           null score at once.
 *
 * This script drives a broad cell set THROUGH THE REAL PAGE DERIVATION PATH:
 *   synthesizeCell -> (region-total n_employees injected, as real DB rows have)
 *   -> enforceSanity -> the page's payroll unit-detection -> estimateNetProfit
 *   -> the take-home floor -> computeBreakInRating.
 *
 * It computes, per cell, the displayed owner take-home and the break-in score
 * under BOTH behaviours in a single run:
 *   OLD  the current (buggy) enforceSanity employee cap, replicated locally,
 *        + the page's pre-fix take-home (structural net profit, no margin floor).
 *   NEW  the REAL post-fix enforceSanity (per-firm) + the PART B floored
 *        take-home (max of structural and margin-implied, then the larger-firm
 *        2x-income floor).
 *
 * Run: npx tsx scripts/audit/verify_takehome_fix.ts
 *
 * Constraint-safe: internal audit script, never shipped to a user surface.
 */
import {
  synthesizeCell,
  fillMissingFields,
  enforceSanity,
} from "../../src/lib/cells/fill_defaults";
import { estimateNetProfit } from "../../src/lib/finance/net_profit";
import { clampMargin } from "../../src/lib/finance/margin_floor";
import { getCountryEconomicsSnapshot } from "../../src/lib/economics/country_metrics";
import { computeBreakInRating } from "../../src/lib/scores/break_in_rating";
import {
  estimateEmployeesFromFirms,
  estimateWagePerEmployee,
} from "../../src/lib/extrapolations/fill_missing";
import { getLondonEntry } from "../../src/lib/scores/cell_board";
import industryMarginsJson from "../../src/lib/finance/industry_margins.json";
import {
  placeAdjustedStartupCapital,
} from "../../src/lib/markets/startup_capital_archetypes";
import {
  timeToOpenWeeks,
  placeAdjustedPermitsUsd,
} from "../../src/lib/markets/opening_archetypes";
import { densityArchetypePer10k } from "../../src/lib/markets/density_archetypes";
import type { Cell } from "../../src/lib/cells";

type MarginRow = { gross_margin: number; operating_margin: number };
const MARGINS = industryMarginsJson as unknown as {
  default_fallback: MarginRow;
  industries: Record<string, MarginRow>;
};
function lookupIndustryMargin(industryId: string | null | undefined): MarginRow {
  if (!industryId) return MARGINS.default_fallback;
  return MARGINS.industries[industryId] || MARGINS.default_fallback;
}

// ---------------------------------------------------------------------------
// The cell set: broad spread of countries, industries, and size bands, in the
// TWO real DB shapes the read pipeline encounters.
//
//   - Region-TOTAL shape (the default, storedPerFirm omitted): n_employees is
//     the headcount across every firm (n_enterprises * truePerFirm). This is the
//     shape that triggers the bug: the OLD enforceSanity capped the total to a
//     per-firm ceiling without dividing first, so OLD and NEW disagree. Every
//     KNOWN_BROKEN cell and the broad blast-radius set use this shape.
//   - Already-per-firm shape (storedPerFirm: true): n_employees is the small
//     per-firm count, as some sources already store it. The bug never touched
//     this shape (n_employees <= n_enterprises, so the OLD cap and the NEW divide
//     both leave it as-is), so a structurally-healthy cell in this shape is
//     genuinely UNMOVED by the fix. The KNOWN_HEALTHY anchors use this shape and
//     are chosen so their structural net margin clears the 3% floor, meaning the
//     PART B margin-floor never lifts them either: they are healthy on the REAL
//     path, not floor-rescued, so "(b) healthy cells move < 1%" tests a true
//     no-op rather than an artifact.
//
// truePerFirm is the realistic per-firm headcount throughout.
// ---------------------------------------------------------------------------
type Spec = {
  iso2: string;
  geo: string;
  geoName: string;
  industry: string; // URL slug
  sizeBand: string | null;
  nEnterprises: number;
  truePerFirm: number; // realistic employees per firm
  /**
   * When true, n_employees is injected as the already-per-firm count
   * (truePerFirm) rather than the region total. This is the shape the bug never
   * touched, so a healthy cell in it is genuinely unmoved by the fix. Omit (the
   * default) for the region-total shape that reproduces the bug.
   */
  storedPerFirm?: boolean;
  note?: string;
};

const KNOWN_BROKEN = "previously-broken";
const KNOWN_HEALTHY = "known-healthy";

const SPECS: Spec[] = [
  // -- The named broken cells from the bug report --------------------------
  { iso2: "fr", geo: "paris", geoName: "Paris", industry: "cafes-coffee-shops", sizeBand: "5-9", nEnterprises: 3500, truePerFirm: 4, note: KNOWN_BROKEN },
  { iso2: "us", geo: "new-york", geoName: "New York", industry: "hotels-lodging", sizeBand: "20-49", nEnterprises: 700, truePerFirm: 35, note: KNOWN_BROKEN },
  { iso2: "de", geo: "berlin", geoName: "Berlin", industry: "dental-practices", sizeBand: "5-9", nEnterprises: 1800, truePerFirm: 6, note: KNOWN_BROKEN },
  { iso2: "us", geo: "chicago", geoName: "Chicago", industry: "auto-repair-shops", sizeBand: "1-4", nEnterprises: 2200, truePerFirm: 5, note: KNOWN_BROKEN },
  { iso2: "us", geo: "los-angeles", geoName: "Los Angeles", industry: "hairdressers-beauty", sizeBand: "1-4", nEnterprises: 5200, truePerFirm: 3, note: KNOWN_BROKEN },
  { iso2: "es", geo: "madrid", geoName: "Madrid", industry: "cleaning-services", sizeBand: "5-9", nEnterprises: 2600, truePerFirm: 7, note: KNOWN_BROKEN },

  // -- Known-healthy anchors (must move < 1%) ------------------------------
  // These use the already-per-firm shape (the bug never touched it) AND have a
  // structural net margin comfortably above the 3% floor (verified: software
  // ~12-23%, law firms ~27%), so neither the PART A employee fix nor the PART B
  // margin floor changes them. They are healthy on the REAL path, not rescued by
  // a floor, so a < 1% move here is a genuine no-op.
  { iso2: "jp", geo: "tokyo", geoName: "Tokyo", industry: "software-development", sizeBand: "10-19", nEnterprises: 4200, truePerFirm: 12, storedPerFirm: true, note: KNOWN_HEALTHY },
  { iso2: "us", geo: "california", geoName: "California", industry: "software-development", sizeBand: "10-19", nEnterprises: 9000, truePerFirm: 15, storedPerFirm: true, note: KNOWN_HEALTHY },
  { iso2: "us", geo: "texas", geoName: "Texas", industry: "law-firms", sizeBand: "10-19", nEnterprises: 4000, truePerFirm: 12, storedPerFirm: true, note: KNOWN_HEALTHY },
  { iso2: "us", geo: "new-york", geoName: "New York", industry: "law-firms", sizeBand: "5-9", nEnterprises: 5000, truePerFirm: 8, storedPerFirm: true, note: KNOWN_HEALTHY },

  // -- US-state cells (large + small) --------------------------------------
  // Ohio manufacturing is NOT labeled healthy: at this revenue/payroll its
  // structural margin is deeply negative and only the larger-firm 2x-income
  // floor keeps its take-home positive. It would be floor-rescued, not healthy,
  // so it stays in the set (region-total shape) to exercise zero-negatives /
  // people-sane / spread, but is not held to the < 1% healthy bar.
  { iso2: "us", geo: "ohio", geoName: "Ohio", industry: "manufacturing", sizeBand: "50-99", nEnterprises: 900, truePerFirm: 60 },
  { iso2: "us", geo: "texas", geoName: "Texas", industry: "restaurants", sizeBand: "10-19", nEnterprises: 8000, truePerFirm: 14 },
  { iso2: "us", geo: "florida", geoName: "Florida", industry: "hotels-lodging", sizeBand: "50-99", nEnterprises: 600, truePerFirm: 70 },
  { iso2: "us", geo: "chicago", geoName: "Chicago", industry: "restaurants", sizeBand: "5-9", nEnterprises: 5500, truePerFirm: 9 },
  { iso2: "us", geo: "los-angeles", geoName: "Los Angeles", industry: "grocery-stores", sizeBand: "10-19", nEnterprises: 3000, truePerFirm: 12 },
  { iso2: "us", geo: "seattle", geoName: "Seattle", industry: "bakeries-pastries", sizeBand: "1-4", nEnterprises: 800, truePerFirm: 5 },

  // -- World-city cells across industries + bands --------------------------
  { iso2: "fr", geo: "paris", geoName: "Paris", industry: "restaurants", sizeBand: "5-9", nEnterprises: 9000, truePerFirm: 9 },
  { iso2: "de", geo: "munich", geoName: "Munich", industry: "auto-repair-shops", sizeBand: "5-9", nEnterprises: 1500, truePerFirm: 6 },
  { iso2: "it", geo: "rome", geoName: "Rome", industry: "cafes-coffee-shops", sizeBand: "1-4", nEnterprises: 4000, truePerFirm: 3 },
  { iso2: "es", geo: "barcelona", geoName: "Barcelona", industry: "hotels-lodging", sizeBand: "20-49", nEnterprises: 500, truePerFirm: 30 },
  { iso2: "nl", geo: "amsterdam", geoName: "Amsterdam", industry: "restaurants", sizeBand: "5-9", nEnterprises: 3500, truePerFirm: 9 },
  { iso2: "gb", geo: "london", geoName: "London", industry: "hairdressers-beauty", sizeBand: "1-4", nEnterprises: 7000, truePerFirm: 3 },
  { iso2: "gb", geo: "manchester", geoName: "Manchester", industry: "bars-pubs-clubs", sizeBand: "5-9", nEnterprises: 1200, truePerFirm: 8 },
  { iso2: "ca", geo: "toronto", geoName: "Toronto", industry: "dental-practices", sizeBand: "5-9", nEnterprises: 2000, truePerFirm: 6 },
  { iso2: "au", geo: "sydney", geoName: "Sydney", industry: "cafes-coffee-shops", sizeBand: "5-9", nEnterprises: 3000, truePerFirm: 5 },
  { iso2: "jp", geo: "tokyo", geoName: "Tokyo", industry: "restaurants", sizeBand: "5-9", nEnterprises: 12000, truePerFirm: 7 },
  { iso2: "br", geo: "sao-paulo", geoName: "Sao Paulo", industry: "grocery-stores", sizeBand: "5-9", nEnterprises: 4000, truePerFirm: 7 },
  { iso2: "mx", geo: "mexico-city", geoName: "Mexico City", industry: "restaurants", sizeBand: "5-9", nEnterprises: 6000, truePerFirm: 8 },
  { iso2: "in", geo: "mumbai", geoName: "Mumbai", industry: "clothing-stores", sizeBand: "5-9", nEnterprises: 5000, truePerFirm: 6 },
  { iso2: "za", geo: "johannesburg", geoName: "Johannesburg", industry: "hairdressers-beauty", sizeBand: "1-4", nEnterprises: 2500, truePerFirm: 3 },
  { iso2: "ae", geo: "dubai", geoName: "Dubai", industry: "restaurants", sizeBand: "10-19", nEnterprises: 2000, truePerFirm: 16 },
  { iso2: "sg", geo: "singapore", geoName: "Singapore", industry: "software-development", sizeBand: "10-19", nEnterprises: 1500, truePerFirm: 14 },
  { iso2: "pl", geo: "warsaw", geoName: "Warsaw", industry: "cleaning-services", sizeBand: "5-9", nEnterprises: 1800, truePerFirm: 7 },
  { iso2: "se", geo: "stockholm", geoName: "Stockholm", industry: "dental-practices", sizeBand: "5-9", nEnterprises: 900, truePerFirm: 6 },
  { iso2: "ke", geo: "nairobi", geoName: "Nairobi", industry: "hairdressers-beauty", sizeBand: "1-4", nEnterprises: 3000, truePerFirm: 3 },
];

// ---------------------------------------------------------------------------
// OLD behaviour: replicate the current (buggy) enforceSanity employee cap.
//
// This mirrors enforceSanity's employee step EXACTLY as it stood before the
// fix: it overwrites n_employees with the per-firm affordability ceiling
// (floor(rev / (wage*1.4))) WITHOUT first dividing a region total down to
// per-firm. Everything else (revenue clamp, wage sanitise, margins) is shared
// with the real enforceSanity, so this isolates the one defective step.
// ---------------------------------------------------------------------------
function enforceSanityOLD(cell: Cell): Cell {
  // Run the real (fixed) enforceSanity first to get every OTHER field exactly
  // as production computes it (revenue clamp, wage sanitise, margins, profit
  // floor), then deliberately RE-INTRODUCE the old employee-unit defect on top
  // so the OLD column reflects the pre-fix n_employees the page would have seen.
  const out: Cell = { ...enforceSanity(cell) };
  // Re-derive the pre-fix n_employees from the raw inputs the old code used.
  const wage = cell.payroll_per_employee || out.payroll_per_employee || 0;
  const rev = out.revenue_per_firm || 0;
  const rawEmpl = cell.n_employees || 0; // the region TOTAL, as the DB row held it
  if (wage > 0 && rev > 0 && rawEmpl > 0) {
    const ratio = rev / (rawEmpl * wage);
    if (ratio < 1.4) {
      // OLD: overwrite the total with the per-firm ceiling (the defect).
      out.n_employees = Math.max(1, Math.floor(rev / (wage * 1.4)));
    } else {
      // OLD: total left as-is (ratio fine), which the page would then divide.
      out.n_employees = rawEmpl;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// The page's payroll unit-detection (identical to page.tsx L340-348).
// ---------------------------------------------------------------------------
function payrollForMargin(cell: Cell): number | null {
  if (cell.payroll_per_employee == null || cell.n_employees == null) return null;
  const empPerFirm =
    cell.n_enterprises && cell.n_enterprises > 0
      ? cell.n_employees < cell.n_enterprises
        ? cell.n_employees // already per-firm
        : cell.n_employees / cell.n_enterprises
      : cell.n_employees;
  const effectiveEmpPerFirm = Math.max(1, empPerFirm);
  return cell.payroll_per_employee * effectiveEmpPerFirm;
}

// The page's "People working" derivation (page.tsx L413-414).
function peopleWorking(cell: Cell): number | null {
  return (
    cell.n_employees ??
    estimateEmployeesFromFirms(cell.industry_id, cell.n_enterprises)
  );
}

// ---------------------------------------------------------------------------
// The take-home + score derivation, parameterised by whether the PART B floor
// is applied. partB=false reproduces the PRE-FIX page (structural net profit,
// larger-firm 2x floor only). partB=true is the post-fix page.
// ---------------------------------------------------------------------------
type Derived = {
  displayedTakeHome: number | null;
  score: number | null;
  people: number | null;
  netMarginPct: number | null;
};

function derive(
  cell: Cell,
  iso2: string,
  geo: string,
  partB: boolean,
): Derived {
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const payroll = payrollForMargin(cell);
  const netProfitResult =
    grossRevenueForMargin && grossRevenueForMargin > 0
      ? estimateNetProfit({
          iso2: iso2.toUpperCase(),
          geoId: cell.geo_id || geo,
          industryId: cell.industry_id || null,
          sectorId: cell.sector_id || null,
          grossRevenue: grossRevenueForMargin,
          payroll,
        })
      : null;
  const rawNetMargin = netProfitResult?.net_margin ?? null;
  const netTakeHome = netProfitResult?.net_profit ?? null;

  const isLargerFirm =
    !!cell.size_band &&
    ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const econSnap = getCountryEconomicsSnapshot(iso2.toUpperCase());
  const annualIncome =
    econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  const takeHomeFloor = isLargerFirm && annualIncome ? annualIncome * 2 : null;

  const computedNetMargin =
    rawNetMargin != null
      ? clampMargin(rawNetMargin, "net", cell.industry_id || null)
      : null;

  let ownerTakeHome: number | null;
  if (!partB) {
    // PRE-FIX page: structural net profit, then the larger-firm 2x floor only.
    ownerTakeHome =
      takeHomeFloor != null && netTakeHome != null && netTakeHome < takeHomeFloor
        ? takeHomeFloor
        : netTakeHome;
  } else {
    // POST-FIX page (PART B): a take-home that can never contradict the shown
    // (clamped) net margin, then still the larger-firm 2x floor on top.
    const takeHomeFromMargin =
      computedNetMargin != null && grossRevenueForMargin != null
        ? computedNetMargin * grossRevenueForMargin
        : null;
    let base: number | null = netTakeHome;
    if (takeHomeFromMargin != null) {
      base = base != null ? Math.max(base, takeHomeFromMargin) : takeHomeFromMargin;
    }
    ownerTakeHome =
      takeHomeFloor != null && base != null && base < takeHomeFloor
        ? takeHomeFloor
        : base;
  }

  // London override (matches cell_board.ts): for a GB cell carrying curated
  // London economics, the board DISPLAYS the curated owner take-home and feeds
  // it to the score, regardless of the computed value. Replicated here so the
  // London rows in this audit reflect what the page actually shows (and are
  // therefore correctly unaffected by this fix). Non-GB cells: LE is null.
  const london = getLondonEntry(cell);
  const LE = london?.economics ?? null;
  const displayedTakeHome =
    LE && Number.isFinite(LE.owner_take_home) ? LE.owner_take_home : ownerTakeHome;

  // The break-in score, fed the SAME resolved inputs the board uses. The city
  // cost-of-living index is left null here (state/region-style modeling); the
  // archetypes fall back to the country wage proxy, exactly as the board does
  // for a geo without a curated COL index.
  const cityCol = null;
  const countryWageProxy =
    econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  const startupCost = placeAdjustedStartupCapital({
    industryId: cell.industry_id ?? null,
    costOfLivingIndex: cityCol,
    avgYearlySalary: countryWageProxy,
  });
  const permitsUsd = placeAdjustedPermitsUsd({
    industryId: cell.industry_id ?? null,
    costOfLivingIndex: cityCol,
    avgYearlySalary: countryWageProxy,
  });
  const openWeeks = timeToOpenWeeks(cell.industry_id ?? null);
  const per10k = densityArchetypePer10k(cell.industry_id ?? null);
  const rating = computeBreakInRating({
    startupCapitalUsd: startupCost,
    permitsUsd,
    annualOwnerTakeHomeUsd: displayedTakeHome,
    timeToOpenWeeks: openWeeks,
    densityPer10k: per10k,
    restsOnModeled: true,
  });

  return {
    displayedTakeHome,
    score: rating?.score ?? null,
    people: peopleWorking(cell),
    netMarginPct: computedNetMargin,
  };
}

// ---------------------------------------------------------------------------
// Build a cell exactly as the read pipeline does for a real regional row:
// synthesize the base, inject the region-TOTAL n_employees + size band +
// enterprise count (the DB shape), then run the chosen enforceSanity.
// ---------------------------------------------------------------------------
function buildCell(spec: Spec, sanity: (c: Cell) => Cell): Cell {
  const base = synthesizeCell(spec.iso2, spec.industry, {
    geoSlug: spec.geo,
    geoName: spec.geoName,
  });
  // Overlay the regional-row shape: a real enterprise count, the size band, and
  // n_employees in the shape this spec models. The DEFAULT is a region TOTAL
  // headcount (n_enterprises * truePerFirm), which is what normalizeRegionalRow
  // produces before enforceSanity and the shape that triggers the unit collision.
  // A storedPerFirm spec instead injects the already-per-firm count (the shape
  // some sources store and the bug never touched), so a healthy cell in it is
  // genuinely unmoved by the fix.
  const nEmployees = spec.storedPerFirm
    ? spec.truePerFirm // already per-firm (bug-untouched shape)
    : spec.nEnterprises * spec.truePerFirm; // region TOTAL (bug-triggering shape)
  const regional: Cell = {
    ...base,
    size_band: spec.sizeBand,
    n_enterprises: spec.nEnterprises,
    n_employees: nEmployees,
    geo_level: "region",
  };
  // fillMissingFields is a no-op here (all fields present) but mirrors the real
  // getCellBySlug path: enforceSanity(fillMissingFields(real)).
  return sanity(fillMissingFields(regional));
}

function fmtMoney(v: number | null): string {
  if (v == null) return "      --";
  const sign = v < 0 ? "-" : "";
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000) return `${sign}$${(a / 1_000).toFixed(1)}K`;
  return `${sign}$${a.toFixed(0)}`;
}
function fmtScore(v: number | null): string {
  return v == null ? "null" : String(v);
}
function fmtPeople(v: number | null): string {
  return v == null ? "--" : String(Math.round(v));
}
function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}
function padL(s: string, n: number): string {
  return s.length >= n ? s : " ".repeat(n - s.length) + s;
}

// ---------------------------------------------------------------------------
// Run.
// ---------------------------------------------------------------------------
type Row = {
  spec: Spec;
  oldTH: number | null;
  newTH: number | null;
  oldPeople: number | null;
  newPeople: number | null;
  oldScore: number | null;
  newScore: number | null;
  newMargin: number | null;
};

const rows: Row[] = [];
for (const spec of SPECS) {
  const cellOld = buildCell(spec, enforceSanityOLD);
  const cellNew = buildCell(spec, enforceSanity);
  const oldD = derive(cellOld, spec.iso2, spec.geo, /*partB*/ false);
  const newD = derive(cellNew, spec.iso2, spec.geo, /*partB*/ true);
  rows.push({
    spec,
    oldTH: oldD.displayedTakeHome,
    newTH: newD.displayedTakeHome,
    oldPeople: oldD.people,
    newPeople: newD.people,
    oldScore: oldD.score,
    newScore: newD.score,
    newMargin: newD.netMarginPct,
  });
}

// -- Table ------------------------------------------------------------------
const H_CELL = 46;
console.log("");
console.log("OWNER TAKE-HOME FIX — differential (OLD = pre-fix page, NEW = post-fix page)");
console.log("=".repeat(120));
console.log(
  pad("cell", H_CELL) +
    padL("OLD TH", 10) +
    padL("NEW TH", 10) +
    padL("OLD ppl", 9) +
    padL("NEW ppl", 9) +
    padL("OLD scr", 9) +
    padL("NEW scr", 9),
);
console.log("-".repeat(120));
for (const r of rows) {
  const label = `${r.spec.iso2}/${r.spec.geo}/${r.spec.industry}`;
  console.log(
    pad(label, H_CELL) +
      padL(fmtMoney(r.oldTH), 10) +
      padL(fmtMoney(r.newTH), 10) +
      padL(fmtPeople(r.oldPeople), 9) +
      padL(fmtPeople(r.newPeople), 9) +
      padL(fmtScore(r.oldScore), 9) +
      padL(fmtScore(r.newScore), 9),
  );
}
console.log("-".repeat(120));

// -- Assertions -------------------------------------------------------------
const EPS = 0;
const oldNegativeCount = rows.filter((r) => r.oldTH != null && r.oldTH < EPS).length;
const newNegativeCount = rows.filter((r) => r.newTH != null && r.newTH < EPS).length;

// (a) zero negative displayed take-home after the fix.
const aPass = newNegativeCount === 0;

// (b) healthy cells move < 1%.
const healthy = rows.filter((r) => r.spec.note === KNOWN_HEALTHY);
let bPass = true;
const bDetail: string[] = [];
for (const r of healthy) {
  if (r.oldTH == null || r.newTH == null) {
    // A healthy cell should have a value in both; if not, flag it.
    bPass = false;
    bDetail.push(`${r.spec.iso2}/${r.spec.geo}/${r.spec.industry}: null take-home (old=${fmtMoney(r.oldTH)} new=${fmtMoney(r.newTH)})`);
    continue;
  }
  const denom = Math.abs(r.oldTH);
  const movePct = denom > 0 ? Math.abs(r.newTH - r.oldTH) / denom * 100 : 0;
  bDetail.push(`${r.spec.iso2}/${r.spec.geo}/${r.spec.industry}: ${movePct.toFixed(2)}% move`);
  if (movePct >= 1) bPass = false;
}

// (c) People-working per firm is sane (single-to-low-double digits for SMBs).
//     After the fix, NEW people should be small per-firm counts, not hundreds.
let cPass = true;
const cDetail: string[] = [];
for (const r of rows) {
  if (r.newPeople == null) continue;
  if (r.newPeople > 120) {
    cPass = false;
    cDetail.push(`${r.spec.iso2}/${r.spec.geo}/${r.spec.industry}: NEW people=${r.newPeople}`);
  }
}

// (d) break-in score non-null on previously-broken cells AND distribution not collapsed.
const broken = rows.filter((r) => r.spec.note === KNOWN_BROKEN);
const brokenNullBefore = broken.filter((r) => r.oldScore == null).length;
const brokenNullAfter = broken.filter((r) => r.newScore == null).length;
const newScores = rows.map((r) => r.newScore).filter((s): s is number => s != null);
const distinctNewScores = new Set(newScores).size;
const dPass = brokenNullAfter === 0 && distinctNewScores >= 3;

console.log("");
console.log("PREVALENCE (blast radius across this cell set):");
console.log(`  cells modeled: ${rows.length}`);
console.log(`  negative displayed take-home BEFORE fix: ${oldNegativeCount} / ${rows.length}`);
console.log(`  negative displayed take-home AFTER fix:  ${newNegativeCount} / ${rows.length}`);
console.log("");
console.log("ASSERTIONS:");
console.log(`  (a) zero negative take-home after fix .............. ${aPass ? "PASS" : "FAIL"} (after=${newNegativeCount})`);
console.log(`  (b) healthy cells move < 1% ....................... ${bPass ? "PASS" : "FAIL"}`);
for (const d of bDetail) console.log(`        ${d}`);
console.log(`  (c) people-working per firm sane (<=120) .......... ${cPass ? "PASS" : "FAIL"}`);
for (const d of cDetail) console.log(`        ${d}`);
console.log(`  (d) score non-null on broken + spread (>=3 distinct) ${dPass ? "PASS" : "FAIL"}`);
console.log(`        broken cells null score BEFORE: ${brokenNullBefore}/${broken.length}, AFTER: ${brokenNullAfter}/${broken.length}`);
console.log(`        distinct NEW scores: ${distinctNewScores}`);

// -- Failing-check-first proof ----------------------------------------------
// BEFORE relying on the fix, the bug MUST be visible in the OLD column. If the
// OLD column shows no negatives, the reproduction is wrong and the whole result
// is suspect, so this is asserted loudly.
console.log("");
console.log("FAILING-CHECK-FIRST PROOF:");
const reproOk = oldNegativeCount > 0;
console.log(`  bug reproduced in OLD column (>=1 negative): ${reproOk ? "YES" : "NO — REPRODUCTION INVALID"}`);

const allPass = aPass && bPass && cPass && dPass && reproOk;
console.log("");
console.log(`OVERALL: ${allPass ? "PASS" : "FAIL"}`);
process.exit(allPass ? 0 : 1);
