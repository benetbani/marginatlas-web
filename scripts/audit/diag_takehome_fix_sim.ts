/**
 * THROWAWAY SIMULATION — proposed owner-take-home fix, BEFORE/AFTER.
 *
 * Implements the PROPOSED fix locally (NOT in source) and prints a before/after
 * table across ~25 cells spanning countries, industries, and size bands. Proves:
 *   - the broken cells become plausible (not negative, not absurdly high),
 *   - currently-healthy cells barely move,
 *   - the break-in score lights up where it was null, without becoming uniform.
 *
 * THE PROPOSED FIX (two parts, both simulated here):
 *
 *  PART A — root-cause UNIT fix (would live in src/lib/cells/fill_defaults.ts,
 *  enforceSanity, lines ~419-427). The employee-affordability cap currently
 *  overwrites a region-TOTAL n_employees with a per-firm ceiling, which page.tsx
 *  then over-trusts as the per-firm headcount. The fix: derive TRUE per-firm
 *  employees FIRST when the value is a region total (n_employees > n_enterprises),
 *  i.e. perFirm = n_employees / n_enterprises, THEN apply the affordability cap to
 *  that per-firm figure. Here we simulate it at payroll-derivation time by
 *  recomputing payrollForMargin from the true per-firm employee count, reading the
 *  RAW total n_employees straight from the DB (getCellVariants, which skips the
 *  cap) so we reconstruct the per-firm figure the fixed pipeline would carry.
 *
 *  PART B — ONE consistent take-home with a defensible floor (would live in
 *  src/app/.../page.tsx where adjustedNetTakeHome is built, feeding BOTH the
 *  display row and the break-in rating). When the structural waterfall produces a
 *  take-home below the cell's own DISPLAYED net margin implies, floor the take-home
 *  to (clampMargin(net) * revenue): the exact dollars the already-shown net-margin
 *  percent stands for. This makes the take-home row and the net-margin row
 *  consistent, gives a thin/rent-heavy cell a marginal-but-plausible figure (not a
 *  fake-high one), and never inflates a healthy cell (already above the floor).
 *  The existing larger-firm 2x-income floor is preserved on 10+ bands.
 *
 * Run: npx tsx scripts/audit/diag_takehome_fix_sim.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

type CellLike = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  size_band: string | null;
  industry_id?: string | null;
  sector_id?: string | null;
  revenue_per_firm?: number | null;
  rev_p50?: number | null;
  n_enterprises?: number | null;
  n_employees?: number | null;
  payroll_per_employee?: number | null;
};

async function run(): Promise<void> {
  const { getCellBySlug, getCellVariants } = await import("../../src/lib/cells");
  const { estimateNetProfit } = await import("../../src/lib/finance/net_profit");
  const { clampMargin } = await import("../../src/lib/finance/margin_floor");
  const { getCountryEconomicsSnapshot } = await import("../../src/lib/economics/country_metrics");
  const { computeBreakInRating } = await import("../../src/lib/scores/break_in_rating");
  const { placeAdjustedStartupCapital } = await import("../../src/lib/markets/startup_capital_archetypes");
  const { timeToOpenWeeks, placeAdjustedPermitsUsd } = await import("../../src/lib/markets/opening_archetypes");
  const { densityArchetypePer10k } = await import("../../src/lib/markets/density_archetypes");
  const { getCityCostOfLivingIndex } = await import("../../src/lib/cities/city_tier");

  type T = { label: string; c: string; g: string; i: string; tag: "BROKEN" | "HEALTHY" | "MIXED" };
  const TARGETS: T[] = [
    // --- the broken set ---
    { label: "Paris cafe", c: "fr", g: "paris", i: "cafes-coffee-shops", tag: "BROKEN" },
    { label: "New York hotels", c: "us", g: "new-york", i: "hotels-lodging", tag: "BROKEN" },
    { label: "Berlin dental", c: "de", g: "berlin", i: "dental-practices", tag: "BROKEN" },
    { label: "Chicago auto repair", c: "us", g: "chicago", i: "auto-repair-shops", tag: "BROKEN" },
    { label: "LA hairdressers", c: "us", g: "los-angeles", i: "hairdressers-beauty", tag: "BROKEN" },
    { label: "Madrid cleaning", c: "es", g: "madrid", i: "cleaning-services", tag: "BROKEN" },
    // --- currently healthy / positive (should barely move) ---
    { label: "Tokyo software dev", c: "jp", g: "tokyo", i: "software-development", tag: "HEALTHY" },
    { label: "London restaurants", c: "gb", g: "london", i: "restaurants", tag: "HEALTHY" },
    { label: "Ohio auto repair (st)", c: "us", g: "ohio", i: "auto-repair-shops", tag: "HEALTHY" },
    { label: "Toronto accounting", c: "ca", g: "toronto", i: "accounting-bookkeeping", tag: "HEALTHY" },
    { label: "Sydney mgmt consult", c: "au", g: "sydney", i: "management-consulting", tag: "HEALTHY" },
    { label: "Texas law firms (st)", c: "us", g: "texas", i: "legal-services", tag: "HEALTHY" },
    // --- mixed bag: more cities, industries, US-states, world ---
    { label: "Madrid restaurants", c: "es", g: "madrid", i: "restaurants", tag: "MIXED" },
    { label: "Paris hair salons", c: "fr", g: "paris", i: "hairdressers-beauty", tag: "MIXED" },
    { label: "Berlin restaurants", c: "de", g: "berlin", i: "restaurants", tag: "MIXED" },
    { label: "Tokyo restaurants", c: "jp", g: "tokyo", i: "restaurants", tag: "MIXED" },
    { label: "Florida restaurants (st)", c: "us", g: "florida", i: "restaurants", tag: "MIXED" },
    { label: "California cafes (st)", c: "us", g: "california", i: "cafes-coffee-shops", tag: "MIXED" },
    { label: "NY dental (state)", c: "us", g: "new-york", i: "dental-practices", tag: "MIXED" },
    { label: "London cafes", c: "gb", g: "london", i: "cafes-coffee-shops", tag: "MIXED" },
    { label: "Mexico City restaurants", c: "mx", g: "mexico-city", i: "restaurants", tag: "MIXED" },
    { label: "Milan restaurants", c: "it", g: "milan", i: "restaurants", tag: "MIXED" },
    { label: "Amsterdam cafes", c: "nl", g: "amsterdam", i: "cafes-coffee-shops", tag: "MIXED" },
    { label: "Texas cleaning (st)", c: "us", g: "texas", i: "cleaning-services", tag: "MIXED" },
    { label: "Warsaw restaurants", c: "pl", g: "warsaw", i: "restaurants", tag: "MIXED" },
  ];

  type Row = {
    label: string; tag: string; band: string;
    rev: number | null;
    oldRawNet: number | null; oldDisp: number | null; newTH: number | null;
    oldScore: number | null; newScore: number | null;
  };
  const rows: Row[] = [];

  // Cache RAW totals (per geo+industry) from the variants path (skips the cap).
  async function rawTotalEmp(c: string, g: string, i: string): Promise<{ nEmp: number | null; nEnt: number | null }> {
    try {
      const vs = (await getCellVariants(c, g, i)) as CellLike[];
      // Prefer the "total" band, else the row with the largest n_enterprises.
      const totalRow =
        vs.find((v) => v.size_band === "total" && v.n_employees != null) ??
        vs.filter((v) => v.n_employees != null).sort((a, b) => (b.n_enterprises ?? 0) - (a.n_enterprises ?? 0))[0];
      if (totalRow) return { nEmp: totalRow.n_employees ?? null, nEnt: totalRow.n_enterprises ?? null };
    } catch { /* ignore */ }
    return { nEmp: null, nEnt: null };
  }

  for (const t of TARGETS) {
    let cell: CellLike;
    try {
      cell = (await getCellBySlug(t.c, t.g, t.i)) as CellLike;
    } catch {
      rows.push({ label: t.label, tag: t.tag, band: "?", rev: null, oldRawNet: null, oldDisp: null, newTH: null, oldScore: null, newScore: null });
      continue;
    }
    const iso2 = t.c.toUpperCase();
    const geoId = cell.geo_id || t.g;
    const rev = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
    const band = cell.size_band ?? "null";
    if (!rev || rev <= 0) {
      rows.push({ label: t.label, tag: t.tag, band, rev: null, oldRawNet: null, oldDisp: null, newTH: null, oldScore: null, newScore: null });
      continue;
    }

    // ---------- OLD (current production behavior) ----------
    // payrollForMargin EXACTLY as page.tsx does today (uses cell.n_employees,
    // which is the post-enforceSanity capped value).
    let oldPayroll: number | null = null;
    if (cell.payroll_per_employee != null && cell.n_employees != null) {
      const empPerFirm =
        cell.n_enterprises && cell.n_enterprises > 0
          ? cell.n_employees < cell.n_enterprises
            ? cell.n_employees
            : cell.n_employees / cell.n_enterprises
          : cell.n_employees;
      oldPayroll = cell.payroll_per_employee * Math.max(1, empPerFirm);
    }
    const oldWf = estimateNetProfit({
      iso2, geoId, industryId: cell.industry_id || null, sectorId: cell.sector_id || null,
      grossRevenue: rev, payroll: oldPayroll,
    });
    const oldRawNet = oldWf.net_profit;
    const econSnap = getCountryEconomicsSnapshot(iso2);
    const annualIncome = econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
    const isLargerFirm = !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
    const oldFloor = isLargerFirm && annualIncome ? annualIncome * 2 : null;
    const oldDisp = oldFloor != null && oldRawNet < oldFloor ? oldFloor : oldRawNet;

    // ---------- NEW (proposed fix) ----------
    // PART A: true per-firm employees. Use the page heuristic's per-firm value
    // when the returned n_employees is already a sane per-firm count, but when we
    // can see the RAW total (variants), reconstruct the true per-firm = total/ent,
    // which is exactly what the fixed enforceSanity would carry.
    const { nEmp: rawEmp, nEnt: rawEnt } = await rawTotalEmp(t.c, t.g, t.i);
    let truePerFirmEmp: number | null = null;
    if (rawEmp != null && rawEnt && rawEnt > 0 && rawEmp > rawEnt) {
      truePerFirmEmp = rawEmp / rawEnt; // region total -> per firm
    } else if (cell.n_employees != null && cell.n_enterprises && cell.n_enterprises > 0) {
      truePerFirmEmp = cell.n_employees < cell.n_enterprises ? cell.n_employees : cell.n_employees / cell.n_enterprises;
    } else if (cell.n_employees != null) {
      truePerFirmEmp = cell.n_employees;
    }
    // Apply the SAME affordability guard the fixed enforceSanity would, but on the
    // per-firm figure: cap so revenue / (perFirm*wage) >= 1.4 (prevents a still-
    // implausible per-firm headcount from re-introducing a blowup). Floor at 1.
    let newPayroll: number | null = null;
    if (cell.payroll_per_employee != null && truePerFirmEmp != null) {
      const wage = cell.payroll_per_employee;
      let epf = Math.max(1, truePerFirmEmp);
      if (rev / (epf * wage) < 1.4) epf = Math.max(1, Math.floor(rev / (wage * 1.4)));
      newPayroll = wage * epf;
    }
    const newWf = estimateNetProfit({
      iso2, geoId, industryId: cell.industry_id || null, sectorId: cell.sector_id || null,
      grossRevenue: rev, payroll: newPayroll,
    });
    let newTH = newWf.net_profit;
    // PART B: one consistent take-home with a defensible floor =
    // clampMargin(net) * revenue (the dollars the displayed net-margin stands for).
    const clampedNetMargin = clampMargin(newWf.net_margin, "net", cell.industry_id || null);
    const marginFloorUsd = clampedNetMargin * rev;
    if (newTH < marginFloorUsd) newTH = marginFloorUsd;
    // Preserve the existing larger-firm 2x-income floor on 10+ bands.
    if (oldFloor != null && newTH < oldFloor) newTH = oldFloor;
    newTH = Math.round(newTH);

    // ---------- Break-in scores (old vs new take-home; all else identical) ----------
    const col = getCityCostOfLivingIndex(t.g);
    const wageProxy = annualIncome; // country wage proxy fallback
    const startupCost = placeAdjustedStartupCapital({ industryId: cell.industry_id ?? null, costOfLivingIndex: col, avgYearlySalary: wageProxy });
    const permits = placeAdjustedPermitsUsd({ industryId: cell.industry_id ?? null, costOfLivingIndex: col, avgYearlySalary: wageProxy });
    const weeks = timeToOpenWeeks(cell.industry_id ?? null);
    const density = densityArchetypePer10k(cell.industry_id ?? null);
    const mkRating = (th: number | null) =>
      computeBreakInRating({
        startupCapitalUsd: startupCost, permitsUsd: permits, annualOwnerTakeHomeUsd: th,
        timeToOpenWeeks: weeks, densityPer10k: density, restsOnModeled: true,
      });
    const oldScore = mkRating(oldDisp)?.score ?? null;
    const newScore = mkRating(newTH)?.score ?? null;

    rows.push({ label: t.label, tag: t.tag, band, rev, oldRawNet, oldDisp, newTH, oldScore, newScore });
  }

  // ---- print ----
  const fmt = (n: number | null): string => (n == null ? "-" : (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US"));
  const sc = (n: number | null): string => (n == null ? "NULL" : String(n));
  const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));
  const padL = (s: string, n: number) => (s.length >= n ? s : " ".repeat(n - s.length) + s);

  const C = { label: 24, tag: 8, band: 7, rev: 12, old: 14, disp: 14, neu: 14, os: 5, ns: 5 };
  const header =
    pad("Cell", C.label) + "  " + pad("Tag", C.tag) + "  " + pad("Band", C.band) + "  " +
    padL("Revenue", C.rev) + "  " + padL("OLD raw net", C.old) + "  " + padL("OLD disp TH", C.disp) + "  " +
    padL("NEW TH", C.neu) + "  " + padL("oScr", C.os) + "  " + padL("nScr", C.ns);

  console.log("");
  console.log("OWNER TAKE-HOME FIX — before/after simulation (fix applied in this script only, NOT in source)");
  console.log("PART A: true per-firm payroll (n_employees/n_enterprises when a region total). PART B: take-home floored to clampMargin(net)*revenue, consistent with the displayed net-margin row.");
  console.log("=".repeat(header.length));
  console.log(header);
  console.log("-".repeat(header.length));
  let lastTag = "";
  for (const r of rows) {
    if (r.tag !== lastTag) { console.log("-- " + r.tag + " --"); lastTag = r.tag; }
    console.log(
      pad(r.label, C.label) + "  " + pad(r.tag, C.tag) + "  " + pad(r.band, C.band) + "  " +
      padL(fmt(r.rev), C.rev) + "  " + padL(fmt(r.oldRawNet), C.old) + "  " + padL(fmt(r.oldDisp), C.disp) + "  " +
      padL(fmt(r.newTH), C.neu) + "  " + padL(sc(r.oldScore), C.os) + "  " + padL(sc(r.newScore), C.ns),
    );
  }
  console.log("-".repeat(header.length));

  // ---- summary integrity checks ----
  const withRev = rows.filter((r) => r.rev != null);
  const oldNeg = withRev.filter((r) => (r.oldDisp ?? 0) < 0).length;
  const newNeg = withRev.filter((r) => (r.newTH ?? 0) < 0).length;
  const oldNullScore = withRev.filter((r) => r.oldScore == null).length;
  const newNullScore = withRev.filter((r) => r.newScore == null).length;
  const newScores = withRev.map((r) => r.newScore).filter((s): s is number => s != null);
  const distinctNew = new Set(newScores).size;
  // Healthy cells should barely move: |newTH - oldDisp| small relative to revenue.
  const healthyMoved = withRev
    .filter((r) => r.tag === "HEALTHY" && r.oldDisp != null && r.oldDisp > 0 && r.newTH != null)
    .map((r) => ({ label: r.label, deltaPctOfRev: Math.abs((r.newTH! - r.oldDisp!) / (r.rev || 1)) }))
    .filter((x) => x.deltaPctOfRev > 0.02);
  // Sanity: no NEW take-home absurdly high (> 60% of revenue is implausible net for SMB).
  const absurdHigh = withRev.filter((r) => r.newTH != null && r.rev != null && r.newTH > 0.6 * r.rev).map((r) => r.label);

  console.log(`Rows: ${rows.length} (${withRev.length} with revenue)`);
  console.log(`Negative displayed take-home: OLD ${oldNeg}  ->  NEW ${newNeg}`);
  console.log(`Null break-in score: OLD ${oldNullScore}  ->  NEW ${newNullScore}`);
  console.log(`NEW scores: ${newScores.length} present, ${distinctNew} distinct values (range ${Math.min(...newScores)}..${Math.max(...newScores)}) -> not uniform.`);
  console.log(`Healthy cells that moved > 2% of revenue: ${healthyMoved.length === 0 ? "none (healthy unchanged)" : healthyMoved.map((x) => `${x.label} (${(x.deltaPctOfRev * 100).toFixed(1)}%)`).join(", ")}`);
  console.log(`NEW take-home > 60% of revenue (implausibly high): ${absurdHigh.length === 0 ? "none" : absurdHigh.join(", ")}`);
  console.log("");
  console.log("DONE.");
}

run().catch((e) => { console.error(e); process.exit(1); });
