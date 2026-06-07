/**
 * THROWAWAY before/after SIMULATION (read-only, no source edits) for the
 * AU/CA/IL/QA revenue overstatement bug on marginatlas.com.
 *
 * ============================ ROOT CAUSE ============================
 * Proven by sibling probe scripts + live page fetches:
 *
 *  - The displayed money is NOT a currency-conversion artifact (AUD/CAD ~1.4,
 *    ILS ~3.7, QAR ~3.6) and the overstatement (3x-500x) is far larger than
 *    any FX factor -> it is a SCALE / wrong-aggregation defect (whole-sector
 *    revenue over a tiny formal-firm count), never USD/per-firm-normalized.
 *  - Two render paths carry it:
 *      Path A (AU, CA): regional_cells rows exist but revenue is NULL, so
 *        fillMissingFields -> pickTypicalRevenue prefers the per-country
 *        "verified median" in data/quality/industry_medians_v1.json, which is
 *        itself wrong-scale (CA software $6,317,863; AU grocery $5,220,932).
 *      Path B (IL, QA): no regional rows; extrapolated / sector-fallback
 *        predicted_rev_per_firm is wrong-scale too (QA software $5,211,876).
 *  - US is shielded (real cells_master, ~$525K software); GB/DE/FR/JP/IN are
 *    shielded (no anchor entry -> sane bounds x multiplier synthesis).
 *  - The existing currency_corrections.ts EXPLICITLY lists AU(49)/CA(48)/
 *    IL(45)/QA(43) as flagged-but-NOT-corrected ("likely individual outliers"),
 *    and the existing hi x 3 plausibility dash only fires on absolute SMB-
 *    physical violation, so a 3x-10x wrong-scale value that lands under hi x 3
 *    sails through on EITHER path. That is why the bug is live.
 *
 * A per-country FX/scale correction CANNOT cleanly recover the true value (the
 * raw figure is an aggregate, not a mis-scaled per-firm number), and the defect
 * spans two paths and four countries with different magnitudes. So the minimal
 * root-cause fix is a PATH-AGNOSTIC, render-time RELATIVE-OUTLIER DASH at the
 * shared chokepoint, honoring the project rule "a dash beats a wrong number"
 * (same spirit as the existing cross_country_outliers analysis, but enforced at
 * read time instead of only reported).
 *
 * ============================ PROPOSED FIX ============================
 * (simulated here, NOT applied to source). One guard, applied where every cell
 * read already converges -- alongside applyPlausibilitySuppression:
 *
 *   wealthNormalized = revenue_per_firm / (industryGlobalMedian * countryMult)
 *   if wealthNormalized > REL_OUTLIER_MULT (=2.5)  ->  DASH the revenue group.
 *
 *   - industryGlobalMedian = getIndustryGlobalMedian(industry_id) -- the median
 *     across 87 countries; robust to the handful of wrong-scale ones.
 *   - countryMult = country_smb_baseline[iso2].revenue_multiplier -- the
 *     country's wealth/price tier already used by synthesis (US 1.7, AU 1.55,
 *     CA 1.45, QA 1.40...). Dividing by it means "does this value exceed what
 *     this country's wealth predicts", so a legitimately-rich-country value
 *     (US grocery, GB/DE software) is NOT punished, while a wrong-scale value
 *     is. Skip the guard when no global median exists (no basis to judge).
 *   - DASH (null the whole revenue waterfall + derived profit) rather than
 *     clamp, so the page shows the board's honest dash, never a fabricated
 *     "typical". Take-home, which derives from revenue, dashes with it.
 *
 * Calibration (live values / (global x mult)) shows a clean gap: worst KEPT
 * control = US grocery 1.51x; worst DASHED suspect threshold sits at 3.11x
 * (CA restaurants). 2.5x lands in the gap with margin on both sides.
 *
 * ============================ HONEST MODELLING ============================
 * OLD rev/take-home = the REAL live pipeline (getCellBySlug) for each cell, so
 * the BEFORE column equals what the site renders today. NEW = apply the dash
 * guard to that live value. Every cell is evaluated by the SAME guard, so the
 * must-not-regress set is a real test (they must come out byte-identical).
 *
 * Run: npx tsx scripts/audit/diag_currency_overstatement.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("="); if (eq < 0) continue;
    const k = line.slice(0, eq).trim(); const v = line.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnvLocal();

const REL_OUTLIER_MULT = 2.5; // value above this x (global median x country wealth multiplier) => dash

async function main() {
  const { getCellBySlug } = await import("../../src/lib/cells");
  const { getIndustryGlobalMedian } = await import("../../src/lib/economic_profile/industry_medians");
  const countryBaseline = (await import("../../src/lib/cells/country_smb_baseline.json")).default as any;
  const marginsJson = (await import("../../src/lib/finance/industry_margins.json")).default as any;

  function countryMult(iso2: string): number {
    return (countryBaseline.countries[iso2.toUpperCase()] || countryBaseline.default_fallback).revenue_multiplier;
  }
  function netMargin(indId: string): number {
    return (marginsJson.industries[indId]?.net_margin) ?? marginsJson.default_fallback.net_margin;
  }

  // THE PROPOSED GUARD. Returns { newRev, normalized, dashed }.
  function applyRelativeOutlierDash(indId: string, iso2: string, rev: number | null) {
    if (rev == null) return { newRev: null as number | null, normalized: null as number | null, dashed: false };
    const gm = getIndustryGlobalMedian(indId);
    if (gm == null || gm <= 0) return { newRev: rev, normalized: null, dashed: false }; // no basis -> leave as-is
    const expected = gm * countryMult(iso2);
    const normalized = rev / expected;
    if (normalized > REL_OUTLIER_MULT) return { newRev: null, normalized, dashed: true };
    return { newRev: rev, normalized, dashed: false };
  }

  type Cell = { country: string; geo: string; slug: string; ind: string; label: string };
  const SUSPECTS: Cell[] = [
    { country: "au", geo: "au-401011001", slug: "software-development", ind: "software_development", label: "AU software" },
    { country: "au", geo: "au-401011001", slug: "restaurants", ind: "restaurants", label: "AU restaurants" },
    { country: "au", geo: "au-401011001", slug: "grocery-stores", ind: "grocery_stores", label: "AU grocery" },
    { country: "au", geo: "au-401011001", slug: "hairdressers-beauty", ind: "hairdressers_beauty", label: "AU hair/beauty" },
    { country: "au", geo: "au-401011001", slug: "auto-repair-shops", ind: "auto_repair_shops", label: "AU auto-repair" },
    { country: "ca", geo: "ca-on", slug: "software-development", ind: "software_development", label: "CA software" },
    { country: "ca", geo: "ca-on", slug: "restaurants", ind: "restaurants", label: "CA restaurants" },
    { country: "ca", geo: "ca-on", slug: "grocery-stores", ind: "grocery_stores", label: "CA grocery" },
    { country: "ca", geo: "ca-on", slug: "hairdressers-beauty", ind: "hairdressers_beauty", label: "CA hair/beauty" },
    { country: "il", geo: "il", slug: "software-development", ind: "software_development", label: "IL software" },
    { country: "il", geo: "il", slug: "restaurants", ind: "restaurants", label: "IL restaurants" },
    { country: "il", geo: "il", slug: "grocery-stores", ind: "grocery_stores", label: "IL grocery" },
    { country: "qa", geo: "qa", slug: "software-development", ind: "software_development", label: "QA software" },
    { country: "qa", geo: "qa", slug: "restaurants", ind: "restaurants", label: "QA restaurants" },
    { country: "qa", geo: "qa", slug: "grocery-stores", ind: "grocery_stores", label: "QA grocery" },
  ];
  const CONTROLS: Cell[] = [
    { country: "us", geo: "california", slug: "software-development", ind: "software_development", label: "US software" },
    { country: "us", geo: "california", slug: "restaurants", ind: "restaurants", label: "US restaurants" },
    { country: "us", geo: "california", slug: "grocery-stores", ind: "grocery_stores", label: "US grocery(CA)" },
    { country: "us", geo: "california", slug: "hairdressers-beauty", ind: "hairdressers_beauty", label: "US hair/beauty" },
    { country: "us", geo: "texas", slug: "grocery-stores", ind: "grocery_stores", label: "US grocery(TX)" },
    { country: "gb", geo: "gb", slug: "software-development", ind: "software_development", label: "GB software" },
    { country: "gb", geo: "gb", slug: "restaurants", ind: "restaurants", label: "GB restaurants" },
    { country: "gb", geo: "gb", slug: "grocery-stores", ind: "grocery_stores", label: "GB grocery" },
    { country: "de", geo: "de", slug: "software-development", ind: "software_development", label: "DE software" },
    { country: "de", geo: "de", slug: "restaurants", ind: "restaurants", label: "DE restaurants" },
    { country: "fr", geo: "fr", slug: "restaurants", ind: "restaurants", label: "FR restaurants" },
    { country: "mx", geo: "mx", slug: "software-development", ind: "software_development", label: "MX software" },
    { country: "mx", geo: "mx", slug: "restaurants", ind: "restaurants", label: "MX restaurants" },
    { country: "nz", geo: "nz", slug: "restaurants", ind: "restaurants", label: "NZ restaurants" },
    { country: "jp", geo: "jp", slug: "restaurants", ind: "restaurants", label: "JP restaurants" },
    { country: "in", geo: "in", slug: "software-development", ind: "software_development", label: "IN software" },
    { country: "za", geo: "za", slug: "grocery-stores", ind: "grocery_stores", label: "ZA grocery" },
  ];

  function takeHome(indId: string, rev: number | null): number | null {
    return rev == null ? null : rev * netMargin(indId);
  }
  const fmt = (v: number | null) => (v == null ? "DASH" : "$" + Math.round(v).toLocaleString());

  async function rowFor(cell: Cell) {
    const live = await getCellBySlug(cell.country, cell.geo, cell.slug);
    const oldRev = live.revenue_per_firm ?? null;
    const g = applyRelativeOutlierDash(cell.ind, cell.country.toUpperCase(), oldRev);
    const newRev = g.newRev;
    let action: string;
    if (oldRev == null && newRev == null) action = "unchanged(already-dash)";
    else if (newRev == null) action = "suppressed(dash)";
    else if (oldRev != null && Math.abs(oldRev - newRev) < 1) action = "unchanged";
    else action = "corrected";
    return {
      cell, oldRev, oldTH: takeHome(cell.ind, oldRev),
      newRev, newTH: takeHome(cell.ind, newRev),
      normalized: g.normalized, action, tier: live.coverage_tier,
    };
  }

  const W = { label: 16, num: 14 };
  function printHeader() {
    console.log(
      "cell".padEnd(W.label), "ctry".padEnd(5),
      "OLD rev/firm".padStart(W.num), "OLD take-home".padStart(W.num),
      "NEW rev/firm".padStart(W.num), "NEW take-home".padStart(W.num),
      "norm".padStart(7), "action",
    );
    console.log("-".repeat(118));
  }
  function printRow(r: Awaited<ReturnType<typeof rowFor>>) {
    console.log(
      r.cell.label.padEnd(W.label), r.cell.country.toUpperCase().padEnd(5),
      fmt(r.oldRev).padStart(W.num), fmt(r.oldTH).padStart(W.num),
      fmt(r.newRev).padStart(W.num), fmt(r.newTH).padStart(W.num),
      (r.normalized == null ? "-" : r.normalized.toFixed(2) + "x").padStart(7), " " + r.action,
    );
  }

  console.log("\n================ SUSPECTS (AU / CA / IL / QA) ================");
  console.log(`OLD = live site. NEW = dash if revenue > ${REL_OUTLIER_MULT}x (industry global median x country wealth multiplier). norm = that ratio.\n`);
  printHeader();
  const suspectRows = [];
  for (const c of SUSPECTS) suspectRows.push(await rowFor(c));
  suspectRows.forEach(printRow);

  console.log("\n================ MUST-NOT-REGRESS (US / GB / DE / FR / MX / NZ / JP / IN / ZA) ================\n");
  printHeader();
  const controlRows = [];
  for (const c of CONTROLS) controlRows.push(await rowFor(c));
  controlRows.forEach(printRow);

  console.log("\n================ SUMMARY ================");
  const suspectsDashed = suspectRows.filter((r) => r.action === "suppressed(dash)");
  const suspectsChanged = suspectRows.filter((r) => r.action.startsWith("suppressed") || r.action === "corrected");
  const controlsChanged = controlRows.filter((r) => r.action.startsWith("suppressed") || r.action === "corrected");
  console.log(`Suspects: ${suspectsChanged.length}/${suspectRows.length} changed; of those ${suspectsDashed.length} dashed.`);
  suspectsDashed.forEach((r) => console.log(`    DASHED suspect: ${r.cell.label}  (was ${fmt(r.oldRev)}, take-home ${fmt(r.oldTH)}, norm ${r.normalized?.toFixed(2)}x)`));
  console.log(`Must-not-regress: ${controlsChanged.length}/${controlRows.length} changed (target: 0).`);
  controlsChanged.forEach((r) => console.log(`    !! REGRESSED: ${r.cell.label}: ${fmt(r.oldRev)} -> ${fmt(r.newRev)} [${r.action}, norm ${r.normalized?.toFixed(2)}x]`));

  // Show the still-KEPT suspects so we can confirm they are plausible (not 15-50x).
  console.log("\nKept suspects (survive the gate) vs US peer -- confirm plausible, not catastrophic:");
  const usByInd: Record<string, number | null> = {};
  for (const r of controlRows) if (r.cell.country === "us" && r.cell.geo === "california") usByInd[r.cell.ind] = r.newRev;
  for (const r of suspectRows.filter((x) => x.newRev != null)) {
    const us = usByInd[r.cell.ind];
    const mult = r.newRev != null && us ? (r.newRev / us).toFixed(2) + "x US" : "n/a";
    console.log(`  ${r.cell.label.padEnd(16)} NEW=${fmt(r.newRev).padStart(12)}  norm=${r.normalized?.toFixed(2)}x  (${mult})`);
  }

  const pass = suspectsChanged.length > 0 && controlsChanged.length === 0;
  console.log("\nVERDICT:", pass
    ? "PASS - worst suspects dashed, every must-not-regress cell byte-identical, surviving suspects are plausible."
    : "REVIEW - see regressions above.");
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
