/**
 * THROWAWAY DRY-RUN — revenue plausibility-suppression threshold modeling (C1).
 *
 * Founder-review tool. NOT wired into the app, NOT a production helper.
 * Reads ONLY local JSON + lib constants. NEVER touches the database.
 *
 * Background
 * ----------
 * The live board renders per-firm revenue verbatim unless it exceeds the
 * industry plausibility ceiling `hi` by 10x (the only current revenue
 * defense, `applyPlausibilitySuppression`, nulls revenue only when
 * value > hi * REVENUE_CATASTROPHIC_MULTIPLIER, today = 10). Any revenue
 * in [hi*1, hi*10) prints as a wrong-looking "typical" number.
 *
 * The proposed C1 fix LOWERS that suppression threshold so clearly-
 * implausible revenue DASHES (honest missing, consistent with the board's
 * dash-for-missing rule) instead of rendering. We do NOT cap-and-show a
 * fake number; we dash it.
 *
 * What this script does
 * ---------------------
 *   - Loads data/quality/scale_anomalies_v1.json, filters to
 *     field === "revenue_per_firm" AND verdict === "too-high" (the cells
 *     that render a wrong-looking large number today).
 *   - For each, recomputes the ceiling `hi` by looking up industry_id in
 *     the LIVE REVENUE_PER_FIRM_BOUNDS constant (the same source and the
 *     same DEFAULT fallback the suppression path uses), and reconciles it
 *     against the JSON's stored bound_hi.
 *   - ratio = value / hi.
 *   - Buckets cells by ratio band: [1-2x), [2-3x), [3-5x), [5-10x),
 *     [>=10x already suppressed today].
 *   - For candidate NEW thresholds hi*2, hi*3, hi*5: counts cells that
 *     CURRENTLY render (1 <= ratio < 10) that would NEWLY dash
 *     (ratio >= threshold), and the count of plausible-looking cells just
 *     under each threshold left untouched.
 *   - Emits the bucket table, the newly-dashed counts, and the worst 30
 *     offenders. Writes a CSV to data/quality/.
 *   - Cells whose industry_id resolves to NO bounds entry are counted
 *     separately (they fall back to DEFAULT in the suppression path, but
 *     we report the "no explicit industry bound" count for transparency).
 *
 * Run: npx tsx scripts/audit/revenue_clamp_dryrun.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  REVENUE_PER_FIRM_BOUNDS,
  DEFAULT_REVENUE_BOUNDS,
} from "@/lib/qa/smb_bounds";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "quality");
const IN_FILE = resolve(OUT_DIR, "scale_anomalies_v1.json");

// The live catastrophe multiplier (today's only revenue defense).
const CURRENT_MULTIPLIER = 10;

// Candidate NEW (lower) suppression thresholds to model.
const CANDIDATES = [2, 3, 5];

type Anomaly = {
  table: string;
  country: string;
  geo_id: string;
  geo_name: string;
  industry_id: string;
  field: string;
  value: number;
  bound_lo: number | null;
  bound_hi: number | null;
  reason: string;
  verdict: string;
  severity: number;
};

type Row = {
  country: string;
  geo_id: string;
  geo_name: string;
  industry_id: string;
  value: number;
  hi: number; // recomputed from the live constant
  ratio: number;
  hasExplicitBound: boolean;
  json_bound_hi: number | null;
};

function fmtUsd(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function main() {
  if (!existsSync(IN_FILE)) {
    console.error(`Input not found: ${IN_FILE}`);
    process.exit(1);
  }
  const parsed = JSON.parse(readFileSync(IN_FILE, "utf-8")) as {
    generated_at?: string;
    total?: number;
    anomalies: Anomaly[];
  };
  const all = parsed.anomalies ?? [];

  // Filter to revenue-per-firm cells that RENDER A WRONG-LOOKING LARGE
  // number today: too-high revenue. (too-low is a separate floor concern,
  // already handled by revenueCatastropheFloor; C1 is about the ceiling.)
  const revHigh = all.filter(
    (a) => a.field === "revenue_per_firm" && a.verdict === "too-high",
  );

  let noHiCount = 0; // cells whose recomputed hi is unusable (should never happen)
  let noExplicitBoundCount = 0; // industry not in the explicit table (uses DEFAULT)
  let reconcileMismatch = 0; // JSON bound_hi != recomputed hi

  const rows: Row[] = [];
  for (const a of revHigh) {
    if (typeof a.value !== "number" || !isFinite(a.value)) continue;

    const explicit = Object.prototype.hasOwnProperty.call(
      REVENUE_PER_FIRM_BOUNDS,
      a.industry_id,
    );
    if (!explicit) noExplicitBoundCount++;

    // Same resolution the suppression path uses: explicit bound or DEFAULT.
    const bounds = REVENUE_PER_FIRM_BOUNDS[a.industry_id] ?? DEFAULT_REVENUE_BOUNDS;
    const hi = bounds.hi;

    if (!(typeof hi === "number" && isFinite(hi) && hi > 0)) {
      noHiCount++;
      continue;
    }

    if (a.bound_hi != null && a.bound_hi !== hi) reconcileMismatch++;

    const ratio = a.value / hi;
    // Guard: only keep cells that are actually at/above the ceiling.
    if (ratio < 1) continue;

    rows.push({
      country: a.country,
      geo_id: a.geo_id,
      geo_name: a.geo_name,
      industry_id: a.industry_id,
      value: a.value,
      hi,
      ratio,
      hasExplicitBound: explicit,
      json_bound_hi: a.bound_hi,
    });
  }

  // ---- Bucket distribution ----
  const buckets = {
    "[1-2x)": 0,
    "[2-3x)": 0,
    "[3-5x)": 0,
    "[5-10x)": 0,
    "[>=10x suppressed today]": 0,
  };
  for (const r of rows) {
    const x = r.ratio;
    if (x >= 10) buckets["[>=10x suppressed today]"]++;
    else if (x >= 5) buckets["[5-10x)"]++;
    else if (x >= 3) buckets["[3-5x)"]++;
    else if (x >= 2) buckets["[2-3x)"]++;
    else buckets["[1-2x)"]++; // x >= 1 guaranteed
  }

  // Cells that CURRENTLY render (not yet suppressed): 1 <= ratio < 10.
  const rendering = rows.filter((r) => r.ratio < CURRENT_MULTIPLIER);

  // ---- Candidate threshold effects ----
  // newlyDashed: currently-rendering cells with ratio >= threshold.
  // untouched: currently-rendering cells with ratio < threshold (still render).
  const candidateStats = CANDIDATES.map((t) => {
    const newlyDashed = rendering.filter((r) => r.ratio >= t).length;
    const untouched = rendering.filter((r) => r.ratio < t).length;
    return { threshold: t, newlyDashed, untouched };
  });

  // ---- Worst 30 offenders (highest ratio, among ALL too-high revenue) ----
  const worst = [...rows].sort((a, b) => b.ratio - a.ratio).slice(0, 30);

  // ---- Worst 30 offenders WITHIN the currently-rendering band (1<=ratio<10).
  // This is the population C1 actually changes: the wrong-looking numbers a
  // visitor sees on the board TODAY. The all-rows worst-30 is saturated by
  // already-suppressed >=10x cells, so this view is the decision-relevant one.
  const worstRendering = [...rendering]
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 30);

  // ---- CSV ----
  const csvLines: string[] = [];
  csvLines.push(
    "country,geo_id,geo_name,industry_id,displayed_revenue_usd,industry_hi_usd,ratio,has_explicit_bound,currently_rendering,would_dash_at_hi2,would_dash_at_hi3,would_dash_at_hi5",
  );
  for (const r of [...rows].sort((a, b) => b.ratio - a.ratio)) {
    const renderingNow = r.ratio < CURRENT_MULTIPLIER ? "yes" : "no(already suppressed)";
    csvLines.push(
      [
        r.country,
        r.geo_id,
        `"${r.geo_name.replace(/"/g, '""')}"`,
        r.industry_id,
        Math.round(r.value),
        Math.round(r.hi),
        r.ratio.toFixed(3),
        r.hasExplicitBound ? "yes" : "no(DEFAULT)",
        renderingNow,
        r.ratio >= 2 ? "yes" : "no",
        r.ratio >= 3 ? "yes" : "no",
        r.ratio >= 5 ? "yes" : "no",
      ].join(","),
    );
  }
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const csvPath = resolve(OUT_DIR, "revenue_clamp_dryrun.csv");
  writeFileSync(csvPath, csvLines.join("\n"), "utf-8");

  // ---- Print summary ----
  const L = (s = "") => console.log(s);
  L("=".repeat(78));
  L("REVENUE CLAMP DRY-RUN (C1) — modeling a LOWER suppression threshold");
  L("=".repeat(78));
  L(`Source: ${IN_FILE}`);
  L(`Source generated_at: ${parsed.generated_at ?? "(unknown)"}`);
  L("");
  L(`Total anomalies in file:                 ${all.length}`);
  L(`  revenue_per_firm + too-high:           ${revHigh.length}`);
  L(`  retained (ratio = value/hi >= 1):      ${rows.length}`);
  L(`  currently RENDER (1 <= ratio < 10):    ${rendering.length}`);
  L(`  already suppressed today (ratio >=10): ${buckets["[>=10x suppressed today]"]}`);
  L("");
  L(`Cells with NO explicit industry bound (fell back to DEFAULT hi=${fmtUsd(DEFAULT_REVENUE_BOUNDS.hi)}): ${noExplicitBoundCount}`);
  L(`Cells with NO resolvable hi (crashed-guard, excluded):              ${noHiCount}`);
  L(`Reconcile: JSON bound_hi != recomputed live hi:                     ${reconcileMismatch}`);
  L("");

  L("-".repeat(78));
  L("(a) BUCKET DISTRIBUTION — all too-high revenue cells by ratio band");
  L("-".repeat(78));
  L("  band                        count");
  for (const [k, v] of Object.entries(buckets)) {
    L(`  ${k.padEnd(28)}${String(v).padStart(6)}`);
  }
  L(`  ${"TOTAL".padEnd(28)}${String(rows.length).padStart(6)}`);
  L("");

  L("-".repeat(78));
  L("(b) CANDIDATE NEW THRESHOLDS — effect on currently-rendering cells");
  L(`    (currently-rendering pool = ${rendering.length} cells with 1 <= ratio < 10)`);
  L("-".repeat(78));
  L("  threshold   newly DASH   still render (untouched, just under)");
  for (const c of candidateStats) {
    L(
      `  hi*${c.threshold}        ${String(c.newlyDashed).padStart(8)}     ${String(c.untouched).padStart(8)}`,
    );
  }
  L("");
  L("  Note: 'newly DASH' = cells that render today (ratio<10) but would be");
  L("  nulled at the candidate threshold. Cells already >=10x are unchanged.");
  L("");

  L("-".repeat(78));
  L("(c) WORST 30 OFFENDERS (by ratio; includes already-suppressed >=10x)");
  L("-".repeat(78));
  L(
    [
      "#".padStart(2),
      "ISO".padEnd(3),
      "industry".padEnd(26),
      "displayed".padStart(10),
      "hi".padStart(8),
      "ratio".padStart(9),
      "verdict / action",
    ].join("  "),
  );
  worst.forEach((r, i) => {
    const dashAt =
      r.ratio >= CURRENT_MULTIPLIER
        ? "already dashes (>=10x)"
        : r.ratio >= 5
          ? "-> dash at hi*2, hi*3, hi*5"
          : r.ratio >= 3
            ? "-> dash at hi*2, hi*3"
            : r.ratio >= 2
              ? "-> dash at hi*2"
              : "renders at all candidates";
    L(
      [
        String(i + 1).padStart(2),
        r.country.padEnd(3),
        r.industry_id.slice(0, 26).padEnd(26),
        fmtUsd(r.value).padStart(10),
        fmtUsd(r.hi).padStart(8),
        r.ratio.toFixed(1).padStart(9),
        dashAt,
      ].join("  "),
    );
  });
  L("");

  L("-".repeat(78));
  L("(c2) WORST 30 OFFENDERS *AMONG CELLS THAT RENDER TODAY* (1 <= ratio < 10)");
  L("     — the wrong-looking numbers a visitor sees now; C1 acts on these.");
  L("-".repeat(78));
  L(
    [
      "#".padStart(2),
      "ISO".padEnd(3),
      "industry".padEnd(26),
      "displayed".padStart(10),
      "hi".padStart(8),
      "ratio".padStart(7),
      "action",
    ].join("  "),
  );
  worstRendering.forEach((r, i) => {
    const dashAt =
      r.ratio >= 5
        ? "-> dash at hi*2, hi*3, hi*5"
        : r.ratio >= 3
          ? "-> dash at hi*2, hi*3"
          : r.ratio >= 2
            ? "-> dash at hi*2"
            : "renders at all candidates";
    L(
      [
        String(i + 1).padStart(2),
        r.country.padEnd(3),
        r.industry_id.slice(0, 26).padEnd(26),
        fmtUsd(r.value).padStart(10),
        fmtUsd(r.hi).padStart(8),
        r.ratio.toFixed(1).padStart(7),
        dashAt,
      ].join("  "),
    );
  });
  L("");
  L(`CSV written: ${csvPath}`);
  L("=".repeat(78));
}

main();
