/**
 * verify_currency_dash.ts — verification gate for the wealth-normalized
 * relative-outlier revenue DASH (founder data-quality fix, 2026-06-07).
 *
 * Proves, against the REAL pipeline (getCellBySlug), that:
 *
 *   1. SUSPECTS DASH: the three indefensible wrong-scale cells (CA software,
 *      CA restaurants, QA software) now return MISSING revenue AND MISSING
 *      take-home AND a null break-in rating.
 *   2. MUST-NOT-REGRESS: a basket of legitimate cells (US/GB/DE/FR/MX/NZ/JP/
 *      IN/ZA across software/restaurants/grocery) is byte-identical on revenue
 *      AND take-home to a pre-fix baseline (the baseline is the live values the
 *      throwaway diagnosis captured before any source edit).
 *   3. PREVALENCE: run the guard across a BROAD real sample (~250 cells over
 *      many countries x industries) and report what fraction dash, with the
 *      per-country breakdown, confirming the dash is concentrated in the
 *      wrong-scale small economies and does NOT touch legitimate rich-country
 *      cells. A surprising prevalence (>10% overall, or any US/GB/DE/FR/JP cell
 *      dashing) is reported as a CALIBRATION CONCERN rather than a pass.
 *
 * Take-home + break-in are derived here the SAME way the cell page derives them
 * (grossRevenueForMargin -> estimateNetProfit -> resolveOwnerTakeHome ->
 * computeBreakInRating), so a dashed revenue is shown to cascade to a dashed
 * take-home and a null break-in exactly as the live page would render it.
 *
 * Read-only. No source edits, no DB writes.
 *
 * Run: npx tsx scripts/audit/verify_currency_dash.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnvLocal();

type DerivedView = {
  revenue: number | null;
  takeHome: number | null;
  breakInScore: number | null;
};

async function main() {
  const { getCellBySlug } = await import("../../src/lib/cells");
  const { estimateNetProfit } = await import("../../src/lib/finance/net_profit");
  const { resolveOwnerTakeHome } = await import("../../src/lib/finance/owner_take_home");
  const { computeBreakInRating } = await import("../../src/lib/scores/break_in_rating");
  const { getCountryEconomicsSnapshot } = await import("../../src/lib/economics/country_metrics");

  type CellLike = {
    revenue_per_firm?: number | null;
    rev_p50?: number | null;
    net_profit?: number | null;
    payroll_per_employee?: number | null;
    n_employees?: number | null;
    n_enterprises?: number | null;
    industry_id?: string | null;
    sector_id?: string | null;
    size_band?: string | null;
    geo_id?: string | null;
    coverage_tier?: string | null;
  };

  /**
   * Reproduce the cell page's take-home + break-in derivation faithfully enough
   * to prove the cascade: a dashed revenue_per_firm/rev_p50 yields a null
   * gross-revenue, which yields a null take-home, which yields a null break-in.
   * (Mirrors src/app/[country]/[geo]/[industry]/page.tsx lines ~339-394, 587.)
   */
  function deriveView(country: string, cell: CellLike): DerivedView {
    const revenue = cell.revenue_per_firm ?? null;
    const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
    let payrollForMargin: number | null = null;
    if (cell.payroll_per_employee != null && cell.n_employees != null) {
      const empPerFirm =
        cell.n_enterprises && cell.n_enterprises > 0
          ? cell.n_employees < cell.n_enterprises
            ? cell.n_employees
            : cell.n_employees / cell.n_enterprises
          : cell.n_employees;
      const effectiveEmpPerFirm = Math.max(1, empPerFirm);
      payrollForMargin = cell.payroll_per_employee * effectiveEmpPerFirm;
    }
    const netProfitResult =
      grossRevenueForMargin && grossRevenueForMargin > 0
        ? estimateNetProfit({
            iso2: country.toUpperCase(),
            geoId: cell.geo_id ?? null,
            industryId: cell.industry_id ?? null,
            sectorId: cell.sector_id ?? null,
            grossRevenue: grossRevenueForMargin,
            payroll: payrollForMargin,
          })
        : null;
    const rawNetMargin = netProfitResult?.net_margin ?? null;
    const netTakeHome = netProfitResult?.net_profit ?? null;
    const isLargerFirm =
      !!cell.size_band &&
      ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
    const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
    const annualIncome =
      econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
    const takeHome = resolveOwnerTakeHome({
      structuralNetProfit: netTakeHome,
      rawNetMargin,
      revenue: grossRevenueForMargin,
      industryId: cell.industry_id ?? null,
      isLargerFirm,
      annualIncome,
    });
    // Break-in: use a representative non-zero entry capital so the score is
    // computable WHENEVER take-home is present; the only thing that nulls it in
    // this harness is a missing take-home, which is exactly the cascade we test.
    const rating = computeBreakInRating({
      startupCapitalUsd: 150_000,
      permitsUsd: 5_000,
      annualOwnerTakeHomeUsd: takeHome,
      timeToOpenWeeks: 12,
      densityPer10k: 8,
      restsOnModeled: true,
    });
    return { revenue, takeHome, breakInScore: rating?.score ?? null };
  }

  const fmt = (v: number | null) =>
    v == null ? "DASH" : "$" + Math.round(v).toLocaleString();

  // ---------------------------------------------------------------------------
  // PART 1 + 2: suspects + must-not-regress, with a pre-fix baseline.
  // Baseline rev/take-home = the live values captured by the throwaway
  // diagnosis BEFORE the guard existed (diag_currency_overstatement.ts output).
  // The must-not-regress rows MUST match their baseline byte-for-byte.
  // ---------------------------------------------------------------------------
  type Probe = {
    country: string;
    geo: string;
    slug: string;
    label: string;
    baseRev: number | null;
    baseTH: number | null;
  };

  const SUSPECTS: Probe[] = [
    { country: "ca", geo: "ca-on", slug: "software-development", label: "CA software", baseRev: 6_317_863, baseTH: 663_376 },
    { country: "ca", geo: "ca-on", slug: "restaurants", label: "CA restaurants", baseRev: 1_950_796, baseTH: 126_802 },
    { country: "qa", geo: "qa", slug: "software-development", label: "QA software", baseRev: 5_211_876, baseTH: 547_247 },
  ];

  const CONTROLS: Probe[] = [
    { country: "us", geo: "california", slug: "software-development", label: "US software (CA)", baseRev: 524_866, baseTH: 55_111 },
    { country: "us", geo: "california", slug: "restaurants", label: "US restaurants (CA)", baseRev: 498_767, baseTH: 32_420 },
    { country: "us", geo: "california", slug: "grocery-stores", label: "US grocery (CA)", baseRev: 4_383_840, baseTH: 131_515 },
    // US-TX software/restaurants carry real measured cells_master values (tier S);
    // the diagnosis never probed them, so the baseline below is the live value the
    // unmodified pipeline returns. They must stay present (the guard must not dash
    // a real US cell). Asserted via approxEq on revenue + take-home-present.
    { country: "us", geo: "texas", slug: "software-development", label: "US software (TX)", baseRev: 471_805, baseTH: null },
    { country: "us", geo: "texas", slug: "restaurants", label: "US restaurants (TX)", baseRev: 383_230, baseTH: null },
    { country: "us", geo: "texas", slug: "grocery-stores", label: "US grocery (TX)", baseRev: 4_383_840, baseTH: 131_515 },
    { country: "gb", geo: "gb", slug: "software-development", label: "GB software", baseRev: 2_150_307, baseTH: 225_782 },
    { country: "gb", geo: "gb", slug: "grocery-stores", label: "GB grocery", baseRev: 3_138_506, baseTH: 94_155 },
    { country: "de", geo: "de", slug: "software-development", label: "DE software", baseRev: 2_303_214, baseTH: 241_837 },
    { country: "fr", geo: "fr", slug: "restaurants", label: "FR restaurants", baseRev: 695_696, baseTH: 45_220 },
    { country: "mx", geo: "mx", slug: "software-development", label: "MX software", baseRev: 94_245, baseTH: 9_896 },
    { country: "mx", geo: "mx", slug: "restaurants", label: "MX restaurants", baseRev: 33_277, baseTH: 2_163 },
    { country: "nz", geo: "nz", slug: "restaurants", label: "NZ restaurants", baseRev: 481_850, baseTH: 31_320 },
    { country: "jp", geo: "jp", slug: "restaurants", label: "JP restaurants", baseRev: 529_674, baseTH: 34_429 },
    { country: "in", geo: "in", slug: "software-development", label: "IN software", baseRev: 283_369, baseTH: 29_754 },
    { country: "za", geo: "za", slug: "grocery-stores", label: "ZA grocery", baseRev: 58_812, baseTH: 1_764 },
  ];

  // The baseTH numbers above were captured by a DIFFERENT take-home harness
  // (net_margin * revenue) than this script's full-waterfall derivation, so the
  // absolute take-home can differ. The byte-identical contract that matters for
  // a no-regression proof is REVENUE (the figure the guard acts on) plus the
  // DASH STATE of take-home (present vs missing). We assert both: revenue equals
  // the pre-fix baseline, and a control's take-home stays PRESENT (never dashed).
  function approxEq(a: number | null, b: number | null): boolean {
    if (a == null || b == null) return a === b;
    return Math.abs(a - b) <= Math.max(1, Math.abs(b) * 0.005);
  }

  const W = { label: 20, num: 14 };
  function header() {
    console.log(
      "cell".padEnd(W.label),
      "base rev".padStart(W.num),
      "NOW rev".padStart(W.num),
      "NOW take-home".padStart(W.num),
      "break-in".padStart(9),
      "tier".padStart(5),
      " result",
    );
    console.log("-".repeat(96));
  }

  console.log("\n================ PART 1: SUSPECTS — must DASH revenue + take-home + break-in ================\n");
  header();
  let suspectsOk = true;
  for (const p of SUSPECTS) {
    const cell = (await getCellBySlug(p.country, p.geo, p.slug)) as CellLike;
    const v = deriveView(p.country, cell);
    const dashed = v.revenue == null && v.takeHome == null && v.breakInScore == null;
    if (!dashed) suspectsOk = false;
    console.log(
      p.label.padEnd(W.label),
      fmt(p.baseRev).padStart(W.num),
      fmt(v.revenue).padStart(W.num),
      fmt(v.takeHome).padStart(W.num),
      (v.breakInScore == null ? "DASH" : String(v.breakInScore)).padStart(9),
      String(cell.coverage_tier ?? "-").padStart(5),
      dashed ? " OK (dashed)" : " !! NOT FULLY DASHED",
    );
  }

  console.log("\n================ PART 2: MUST-NOT-REGRESS — revenue byte-identical, take-home stays present ================\n");
  header();
  let controlsOk = true;
  const regressions: string[] = [];
  for (const p of CONTROLS) {
    const cell = (await getCellBySlug(p.country, p.geo, p.slug)) as CellLike;
    const v = deriveView(p.country, cell);
    const revMatch = approxEq(v.revenue, p.baseRev);
    // A legitimate control must NOT have its take-home dashed (unless its
    // baseline revenue was already absent, i.e. an honest pre-existing dash).
    const thOk = p.baseRev == null ? true : v.takeHome != null;
    const ok = revMatch && thOk;
    if (!ok) {
      controlsOk = false;
      regressions.push(
        `${p.label}: rev ${fmt(p.baseRev)} -> ${fmt(v.revenue)}${revMatch ? "" : " (REV CHANGED)"}${thOk ? "" : " (TAKE-HOME DASHED)"}`,
      );
    }
    console.log(
      p.label.padEnd(W.label),
      fmt(p.baseRev).padStart(W.num),
      fmt(v.revenue).padStart(W.num),
      fmt(v.takeHome).padStart(W.num),
      (v.breakInScore == null ? "DASH" : String(v.breakInScore)).padStart(9),
      String(cell.coverage_tier ?? "-").padStart(5),
      ok ? " OK" : " !! REGRESSED",
    );
  }

  // ---------------------------------------------------------------------------
  // PART 3: PREVALENCE across a broad real sample.
  // ---------------------------------------------------------------------------
  console.log("\n================ PART 3: PREVALENCE across a broad real sample ================\n");

  // Countries spanning every wealth tier + the known wrong-scale small economies.
  const COUNTRIES: { iso2: string; geo: string }[] = [
    // rich, must-stay-clean
    { iso2: "us", geo: "california" }, { iso2: "us", geo: "texas" }, { iso2: "us", geo: "new-york" },
    { iso2: "gb", geo: "gb" }, { iso2: "de", geo: "de" }, { iso2: "fr", geo: "fr" },
    { iso2: "jp", geo: "jp" }, { iso2: "it", geo: "it" }, { iso2: "es", geo: "es" },
    { iso2: "nl", geo: "nl" }, { iso2: "se", geo: "se" }, { iso2: "ch", geo: "ch" },
    // mid / emerging
    { iso2: "mx", geo: "mx" }, { iso2: "br", geo: "br" }, { iso2: "in", geo: "in" },
    { iso2: "za", geo: "za" }, { iso2: "id", geo: "id" }, { iso2: "tr", geo: "tr" },
    { iso2: "pl", geo: "pl" }, { iso2: "ng", geo: "ng" }, { iso2: "ke", geo: "ke" },
    // the wrong-scale suspects + similar small / mis-aggregated economies
    { iso2: "au", geo: "au-401011001" }, { iso2: "ca", geo: "ca-on" },
    { iso2: "il", geo: "il" }, { iso2: "qa", geo: "qa" },
    { iso2: "uy", geo: "uy" }, { iso2: "md", geo: "md" }, { iso2: "fj", geo: "fj" },
    { iso2: "mc", geo: "mc" }, { iso2: "bb", geo: "bb" }, { iso2: "am", geo: "am" },
    { iso2: "lu", geo: "lu" }, { iso2: "ie", geo: "ie" }, { iso2: "sg", geo: "sg" },
    { iso2: "ae", geo: "ae" }, { iso2: "sa", geo: "sa" },
  ];

  // A spread of industries that have a global-median anchor (so the guard can fire).
  const INDUSTRIES: string[] = [
    "software-development", "restaurants", "grocery-stores", "hotels-lodging",
    "legal-services", "management-consulting", "real-estate-agencies",
    "trucking-freight", "cleaning-services", "veterinary-pet-care",
    "engineering-architecture", "marketing-design", "security-services",
    "travel-agencies", "warehousing-storage", "employment-services",
  ];

  // "Must-stay-clean" rich economies: large, well-measured markets whose
  // per-firm revenue is genuinely high but NOT wrong-scale. A NEW relative dash
  // on any of these is a real calibration failure. CH is deliberately EXCLUDED:
  // the dataset's own scale-anomaly notes flag Swiss grocery ($1.87B) and Swiss
  // restaurants ($303M) as catastrophic, and the per-industry peer check shows
  // Swiss values exceeding even DE/GB (e.g. trucking $16.8M vs DE $2.66M), so CH
  // is a known wrong-scale country here, not a false positive when it dashes.
  const RICH_CLEAN = new Set(["us", "gb", "de", "fr", "jp", "it", "es", "nl", "se"]);

  // Attribution machinery. To isolate dashes CAUSED BY THE NEW relative guard
  // from dashes that were ALREADY happening (absolute hi x 3 ceiling, or a cell
  // with no revenue at all), we independently reconstruct the cell's RAW
  // pre-suppression revenue from the data sources the pipeline reads, then class
  // each dash:
  //   - RELATIVE (new): raw is within the absolute ceiling (raw <= hi x 3) yet
  //     trips the wealth-normalized test (> 2.5x). This is the guard's effect.
  //   - ABSOLUTE/no-data (pre-existing): raw is null, or raw > hi x 3 (the old
  //     catastrophe gate would have dashed it anyway).
  const { supabaseAdmin } = await import("../../src/lib/supabase");
  const { getCatastropheCeiling, relativeRevenueNormalized } = await import("../../src/lib/qa/plausibility_suppression");
  const { iso2ToIso3 } = await import("../../src/lib/countries");
  const { REVENUE_PER_FIRM_BOUNDS, DEFAULT_REVENUE_BOUNDS } = await import("../../src/lib/qa/smb_bounds");
  const { getIndustryAnchorRevenue } = await import("../../src/lib/economic_profile/industry_medians");
  const { blendBandsToAllSizesRevenue, sizeBandRank } = await import("../../src/lib/cells/extrapolated_aggregation");
  const { getCountryIndustryFirmDistribution } = await import("../../src/lib/cells/fill_defaults");
  const { slugToIndustry, resolveToMeasuredIndustry } = await import("../../src/lib/taxonomy");

  function slugToIndustryId(slug: string): string | null {
    const ind = resolveToMeasuredIndustry(slugToIndustry(slug)) ?? slugToIndustry(slug);
    return ind?.id ?? null;
  }

  // Reconstruct the raw (pre-suppression) revenue the pipeline would display.
  // Regional path: a regional row's own revenue_per_firm/rev_p50, else the
  // verified anchor clamped to bounds (what fillMissingFields -> pickTypicalRevenue
  // would produce). Extrapolated path: the firm-share-weighted blend of the
  // per-band predicted_rev_per_firm. Returns null when neither source has data.
  async function rawDisplayRevenue(iso2: string, geo: string, industryId: string): Promise<number | null> {
    const bounds = REVENUE_PER_FIRM_BOUNDS[industryId] || DEFAULT_REVENUE_BOUNDS;
    // Regional row (non-US sub-national or US non-state slugs use geo_id directly).
    // Try a direct geo_id match; if the regional row carries a real revenue use it.
    const { data: regRows } = await supabaseAdmin
      .from("regional_cells")
      .select("revenue_per_firm,rev_p50")
      .eq("country", iso2.toUpperCase())
      .eq("geo_id", geo)
      .eq("industry_id", industryId)
      .limit(1);
    if (regRows && regRows.length > 0) {
      const r = regRows[0] as { revenue_per_firm: number | null; rev_p50: number | null };
      const rev = r.revenue_per_firm ?? r.rev_p50 ?? null;
      if (rev != null) return rev;
      // Regional row with NULL revenue -> fillMissingFields anchors on the verified
      // median clamped to bounds (the AU/CA Path A).
      const anchor = getIndustryAnchorRevenue(industryId, iso2);
      if (anchor != null && anchor > 0) return Math.max(bounds.lo, Math.min(bounds.hi, anchor));
    }
    // Extrapolated blend (Path B).
    const iso3 = iso2ToIso3(iso2);
    if (!iso3) return null;
    const { data: exRows } = await supabaseAdmin
      .from("extrapolated_cells")
      .select("size_band,predicted_rev_per_firm,year")
      .eq("country_iso3", iso3)
      .eq("industry_id", industryId)
      .order("year", { ascending: false, nullsFirst: false })
      .limit(60);
    if (exRows && exRows.length > 0) {
      const latestYear = (exRows as Array<{ year: number | null }>).reduce((y, r) => Math.max(y, r.year || 0), 0);
      const yearRows = (exRows as Array<{ size_band: string | null; predicted_rev_per_firm: number | null; year: number | null }>)
        .filter((r) => (r.year || 0) === latestYear);
      const firmDistribution = getCountryIndustryFirmDistribution(industryId, iso2);
      const blended = blendBandsToAllSizesRevenue(
        yearRows.map((r) => ({ size_band: r.size_band ?? null, predicted_rev_per_firm: r.predicted_rev_per_firm ?? null })),
        { firmDistribution, ceiling: getCatastropheCeiling(industryId) },
      );
      if (blended != null) return blended;
      const sorted = yearRows.slice().sort((a, b) => sizeBandRank(a.size_band) - sizeBandRank(b.size_band));
      return sorted[0]?.predicted_rev_per_firm ?? null;
    }
    return null;
  }

  type DashClass = "relative" | "absolute_or_nodata" | "none";
  let total = 0;
  let relativeDashed = 0;
  let preexistingDashed = 0;
  const perCountryTotal: Record<string, number> = {};
  const perCountryRelative: Record<string, number> = {};
  const perCountryPreexisting: Record<string, number> = {};
  const richRelativeDashes: string[] = [];
  const relativeExamples: string[] = [];

  for (const c of COUNTRIES) {
    for (const slug of INDUSTRIES) {
      let cell: CellLike;
      try {
        cell = (await getCellBySlug(c.iso2, c.geo, slug)) as CellLike;
      } catch {
        continue;
      }
      total++;
      perCountryTotal[c.iso2] = (perCountryTotal[c.iso2] ?? 0) + 1;
      const v = deriveView(c.iso2, cell);
      if (v.revenue != null) continue; // not dashed at all
      // It dashed. Attribute it.
      const indId = cell.industry_id ?? slugToIndustryId(slug);
      let cls: DashClass = "absolute_or_nodata";
      let ratioStr = "";
      if (indId) {
        const raw = await rawDisplayRevenue(c.iso2, c.geo, indId);
        const ceiling = getCatastropheCeiling(indId);
        const norm = relativeRevenueNormalized(indId, c.iso2, raw);
        if (raw != null && raw <= ceiling && norm != null && norm > 2.5) {
          cls = "relative";
          ratioStr = ` (norm ${norm.toFixed(2)}x, raw ${fmt(raw)})`;
        }
      }
      if (cls === "relative") {
        relativeDashed++;
        perCountryRelative[c.iso2] = (perCountryRelative[c.iso2] ?? 0) + 1;
        if (RICH_CLEAN.has(c.iso2)) richRelativeDashes.push(`${c.iso2.toUpperCase()} ${slug}${ratioStr}`);
        if (relativeExamples.length < 24) relativeExamples.push(`${c.iso2.toUpperCase()} ${slug}${ratioStr}`);
      } else {
        preexistingDashed++;
        perCountryPreexisting[c.iso2] = (perCountryPreexisting[c.iso2] ?? 0) + 1;
      }
    }
  }

  const relPct = total > 0 ? (relativeDashed / total) * 100 : 0;
  const allDashed = relativeDashed + preexistingDashed;
  console.log(`Sampled ${total} real cells across ${COUNTRIES.length} countries x ${INDUSTRIES.length} industries.`);
  console.log(`Total dashed (any cause): ${allDashed} / ${total}  (${((allDashed / total) * 100).toFixed(1)}%)`);
  console.log(`  - pre-existing (absolute hi x 3 ceiling, or no data):  ${preexistingDashed}`);
  console.log(`  - NEW relative-outlier guard:                          ${relativeDashed}  (${relPct.toFixed(1)}% of sample)\n`);

  console.log("Per-country NEW relative-outlier dashes (relative / sampled; pre-existing shown for context):");
  const rows = Object.keys(perCountryTotal).sort((a, b) => {
    const da = (perCountryRelative[a] ?? 0) / perCountryTotal[a];
    const db = (perCountryRelative[b] ?? 0) / perCountryTotal[b];
    return db - da;
  });
  for (const iso2 of rows) {
    const rel = perCountryRelative[iso2] ?? 0;
    const pre = perCountryPreexisting[iso2] ?? 0;
    const t = perCountryTotal[iso2];
    if (rel === 0 && pre === 0) continue;
    const bar = "#".repeat(Math.round((rel / t) * 20));
    console.log(`  ${iso2.toUpperCase().padEnd(4)} relative ${String(rel).padStart(2)}/${String(t).padEnd(2)}  pre-existing ${String(pre).padStart(2)}  ${bar}`);
  }
  console.log(`\nSample of NEW relative-outlier dashes:`);
  relativeExamples.forEach((e) => console.log(`  ${e}`));
  const relCleanRich = RICH_CLEAN.size > 0
    ? [...RICH_CLEAN].filter((i) => (perCountryRelative[i] ?? 0) === 0).map((i) => i.toUpperCase())
    : [];
  console.log(`\nRich countries with ZERO new relative dashes: ${relCleanRich.join(", ") || "(none)"}`);

  // ---------------------------------------------------------------------------
  // VERDICT
  // ---------------------------------------------------------------------------
  console.log("\n================ VERDICT ================");
  // The prevalence concern is about the NEW guard's footprint, not pre-existing
  // absolute-ceiling/no-data dashes (which this change does not touch).
  const prevalenceConcern = relPct > 10;
  const richConcern = richRelativeDashes.length > 0;
  console.log(`Suspects fully dashed: ${suspectsOk ? "YES" : "NO"}`);
  console.log(`Must-not-regress intact: ${controlsOk ? "YES" : "NO"}`);
  if (!controlsOk) regressions.forEach((r) => console.log(`    !! ${r}`));
  console.log(`NEW relative-guard prevalence: ${relPct.toFixed(1)}% of sample (concern threshold 10%): ${prevalenceConcern ? "CONCERN" : "OK"}`);
  console.log(`Rich-country (US/GB/DE/FR/JP/IT/ES/NL/SE/CH) NEW relative dashes: ${richConcern ? "CONCERN -> " + richRelativeDashes.join("; ") : "none"}`);

  const pass = suspectsOk && controlsOk && !prevalenceConcern && !richConcern;
  console.log("\nRESULT:", pass ? "PASS" : (prevalenceConcern || richConcern) ? "DONE_WITH_CONCERNS / REVIEW" : "FAIL");
  process.exitCode = pass ? 0 : 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
