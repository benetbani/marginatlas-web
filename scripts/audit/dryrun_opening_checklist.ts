/**
 * THROWAWAY DRY-RUN — "What it takes to open" modeled checklist (opening layer).
 *
 * Founder-review tool. NOT wired into the app, NOT a production helper. Reads
 * ONLY local lib constants + the city cost-of-living list. NEVER touches the
 * database.
 *
 * What it does
 * ------------
 * For ~10 representative business x place combos, prints the four figures the
 * new "What it takes to open" board section shows, computed through the exact
 * production accessors:
 *   - Capital to start: place-adjusted modeled startup capital (no trusted real
 *     cost in a dry run, so this is always the modeled branch).
 *   - Time to open: place-invariant modeled weeks, formatted as the board does.
 *   - Permits: place-adjusted modeled regulatory cost.
 *   - First hires: place-invariant modeled headcount, plus the role hint.
 *
 * Each place's cost-of-living index is resolved by the SAME getCityCostOfLivingIndex
 * the cell page uses, keyed by the city's geo slug, so the place adjustment here
 * matches the live board. The index used is printed so a human can sanity-check.
 *
 * Run: npx tsx scripts/audit/dryrun_opening_checklist.ts
 */
import { getCityCostOfLivingIndex } from "@/lib/cities/city_tier";
import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";
import {
  timeToOpenWeeks,
  placeAdjustedPermitsUsd,
  firstHiresCount,
  firstHiresRoleHint,
} from "@/lib/markets/opening_archetypes";
import { fmtUSD, fmtWeeksToOpen, fmtInt } from "@/components/board/format";

type Combo = {
  label: string; // human label for the row
  industryId: string; // the cell's industry_id (resolves to the archetype slug)
  geoSlug: string; // the city's geo slug (resolves the COL index)
  // Optional hardcoded COL fallback if a slug ever stops resolving, with a note.
  colFallback?: number;
};

// The ten representative combos. industryId values are real taxonomy ids that
// resolve (via industryToSlug) to keyed archetypes; geoSlug values are real
// city slugs in data/cities/city_list_v1.json (each carries a COL index,
// NYC = 100). No colFallback is needed today (all ten resolve), but the slot is
// kept so a human can see exactly which index drove each row.
const COMBOS: Combo[] = [
  { label: "London restaurants", industryId: "restaurants", geoSlug: "london" },
  { label: "New York hotels", industryId: "hotels_lodging", geoSlug: "new-york" },
  { label: "Madrid cleaning services", industryId: "cleaning_services", geoSlug: "madrid" },
  { label: "Tokyo software development", industryId: "software_development", geoSlug: "tokyo" },
  { label: "Berlin dental practice", industryId: "dental_practices", geoSlug: "berlin" },
  { label: "Paris cafe", industryId: "cafes_coffee", geoSlug: "paris" },
  { label: "Sydney gym", industryId: "sports_fitness", geoSlug: "sydney" },
  { label: "Toronto law firm", industryId: "legal_services", geoSlug: "toronto" },
  { label: "Mumbai retail shop", industryId: "clothing_stores", geoSlug: "mumbai" },
  { label: "Dubai construction", industryId: "residential_construction", geoSlug: "dubai" },
];

// Declared bounds (mirror opening_archetypes.ts / startup_capital_archetypes.ts)
// so the script can flag any value that escapes them.
const BOUNDS = {
  capitalFloor: 4_000,
  capitalCeil: 6_000_000,
  weeksFloor: 1,
  weeksCeil: 104,
  permitsFloor: 100,
  permitsCeil: 80_000,
  hiresFloor: 0,
  hiresCeil: 50,
};

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}
function padL(s: string, n: number): string {
  return s.length >= n ? s : " ".repeat(n - s.length) + s;
}

const COLS = {
  combo: 26,
  col: 5,
  capital: 12,
  time: 12,
  permits: 12,
  hires: 7,
  role: 30,
};

const header =
  pad("Business x place", COLS.combo) +
  padL("COL", COLS.col) +
  "  " +
  padL("Capital", COLS.capital) +
  "  " +
  padL("Time", COLS.time) +
  "  " +
  padL("Permits", COLS.permits) +
  "  " +
  padL("Hires", COLS.hires) +
  "  " +
  pad("Role hint", COLS.role);

console.log("");
console.log("WHAT IT TAKES TO OPEN — modeled dry-run (place-adjusted where noted)");
console.log("=".repeat(header.length));
console.log(header);
console.log("-".repeat(header.length));

let outOfBounds = 0;

for (const c of COMBOS) {
  const resolved = getCityCostOfLivingIndex(c.geoSlug);
  const col = resolved ?? c.colFallback ?? null;
  const colNote = resolved == null && c.colFallback != null ? "*" : "";

  const capital = placeAdjustedStartupCapital({
    industryId: c.industryId,
    costOfLivingIndex: col,
    avgYearlySalary: null,
  });
  const weeks = timeToOpenWeeks(c.industryId);
  const permits = placeAdjustedPermitsUsd({
    industryId: c.industryId,
    costOfLivingIndex: col,
    avgYearlySalary: null,
  });
  const hires = firstHiresCount(c.industryId);
  const role = firstHiresRoleHint(c.industryId);

  // Bounds checks.
  if (capital < BOUNDS.capitalFloor || capital > BOUNDS.capitalCeil) outOfBounds++;
  if (weeks < BOUNDS.weeksFloor || weeks > BOUNDS.weeksCeil) outOfBounds++;
  if (permits < BOUNDS.permitsFloor || permits > BOUNDS.permitsCeil) outOfBounds++;
  if (hires < BOUNDS.hiresFloor || hires > BOUNDS.hiresCeil) outOfBounds++;

  console.log(
    pad(c.label, COLS.combo) +
      padL(col == null ? "n/a" : `${col}${colNote}`, COLS.col) +
      "  " +
      padL(fmtUSD(capital), COLS.capital) +
      "  " +
      padL(fmtWeeksToOpen(weeks), COLS.time) +
      "  " +
      padL(fmtUSD(permits), COLS.permits) +
      "  " +
      padL(fmtInt(hires), COLS.hires) +
      "  " +
      pad(role, COLS.role),
  );
}

console.log("-".repeat(header.length));
console.log(
  "Bounds: capital $4K..$6M | time 1..104 wk | permits $100..$80K | hires 0..50",
);
console.log(
  outOfBounds === 0
    ? "All values inside their declared bounds."
    : `WARNING: ${outOfBounds} value(s) escaped their bounds.`,
);
console.log("(* = COL hardcoded fallback used; none expected today)");
console.log("");
