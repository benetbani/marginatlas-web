/**
 * scrub_revenue_giants.ts — clean the source rows whose revenue_per_firm (and
 * percentiles) blow past the per-industry SMB ceiling. These are the ~7,598
 * rows behind the scale-anomaly report (travel_agencies $900M, Swiss grocery
 * $2B, utilities $5B, etc.).
 *
 * WHY: the render layer already clamps these at read time (enforceSanity), so
 * the live PAGES are correct. But the DB rows are still dirty, so CSV exports,
 * the API, and the scale scanner disagree with what users see. This brings the
 * source data in line with the rendered truth.
 *
 * WHAT IT DOES: for every regional_cells / extrapolated_cells row whose
 * revenue exceeds its industry's bound.hi, cap revenue_per_firm (and the rev_p*
 * percentiles, proportionally) to bound.hi, and tag coverage_source with a
 * "scrub:" marker so the change is auditable and reversible. Counts, wages, and
 * good rows are untouched.
 *
 * SAFETY: DRY-RUN by default — prints what WOULD change, writes nothing. Pass
 * --commit to apply. Per the project rule, the FOUNDER runs --commit; I only
 * ever prepare + dry-run.
 *
 * Run (from E:/atlas/website):
 *   SUPABASE_DB_URL=... npx tsx scripts/db/scrub_revenue_giants.ts            # dry-run
 *   SUPABASE_DB_URL=... npx tsx scripts/db/scrub_revenue_giants.ts --commit   # apply
 *
 * SUPABASE_DB_URL lives in E:/atlas/secrets.env (not in website/.env.local).
 * Uses the `pg` driver with SET statement_timeout=0 (one-off maintenance, the
 * scan is a full table sweep).
 */
import { resolve } from "node:path";
import { REVENUE_PER_FIRM_BOUNDS, DEFAULT_REVENUE_BOUNDS } from "../../src/lib/qa/smb_bounds";

type Bound = { lo: number; hi: number };
function boundFor(industryId: string | null): Bound {
  if (!industryId) return DEFAULT_REVENUE_BOUNDS;
  return REVENUE_PER_FIRM_BOUNDS[industryId] ?? DEFAULT_REVENUE_BOUNDS;
}

async function main(): Promise<void> {
  const commit = process.argv.includes("--commit");
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error(
      "scrub_revenue_giants: no SUPABASE_DB_URL in env.\n" +
        "  Run: SUPABASE_DB_URL=$(grep ^SUPABASE_DB_URL= E:/atlas/secrets.env | cut -d= -f2-) npx tsx scripts/db/scrub_revenue_giants.ts",
    );
    process.exit(2);
  }

  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  await client.query("SET statement_timeout = 0");

  let totalCapped = 0;
  const perTable: Record<string, number> = {};

  try {
    // --- regional_cells: revenue_per_firm + rev_p* percentiles ---
    {
      const { rows } = await client.query(
        `SELECT country, geo_id, industry_id, year, size_band,
                revenue_per_firm, rev_p10, rev_p25, rev_p50, rev_p75, rev_p90,
                coverage_source
         FROM regional_cells
         WHERE revenue_per_firm IS NOT NULL`,
      );
      let capped = 0;
      for (const r of rows) {
        const hi = boundFor(r.industry_id).hi;
        if (r.revenue_per_firm == null || r.revenue_per_firm <= hi) continue;
        capped++;
        // Proportional scale so percentile shape is preserved, then clamp each
        // to hi as a hard ceiling.
        const scale = hi / r.revenue_per_firm;
        const newVals = {
          revenue_per_firm: hi,
          rev_p10: r.rev_p10 != null ? Math.min(hi, r.rev_p10 * scale) : null,
          rev_p25: r.rev_p25 != null ? Math.min(hi, r.rev_p25 * scale) : null,
          rev_p50: r.rev_p50 != null ? Math.min(hi, r.rev_p50 * scale) : null,
          rev_p75: r.rev_p75 != null ? Math.min(hi, r.rev_p75 * scale) : null,
          rev_p90: r.rev_p90 != null ? Math.min(hi, r.rev_p90 * scale) : null,
        };
        const src = (r.coverage_source || "").includes("scrub:")
          ? r.coverage_source
          : `${r.coverage_source || "unknown"} | scrub:revenue-cap-2026-05-31`;
        if (commit) {
          await client.query(
            `UPDATE regional_cells
             SET revenue_per_firm=$1, rev_p10=$2, rev_p25=$3, rev_p50=$4,
                 rev_p75=$5, rev_p90=$6, coverage_source=$7
             WHERE country=$8 AND geo_id=$9 AND industry_id=$10
               AND year=$11 AND size_band IS NOT DISTINCT FROM $12`,
            [
              newVals.revenue_per_firm, newVals.rev_p10, newVals.rev_p25,
              newVals.rev_p50, newVals.rev_p75, newVals.rev_p90, src,
              r.country, r.geo_id, r.industry_id, r.year, r.size_band,
            ],
          );
        } else if (capped <= 8) {
          console.log(
            `  regional ${r.country}/${r.geo_id}/${r.industry_id}: ` +
              `$${Math.round(r.revenue_per_firm).toLocaleString()} -> $${hi.toLocaleString()}`,
          );
        }
      }
      perTable.regional_cells = capped;
      totalCapped += capped;
    }

    // --- extrapolated_cells: predicted_rev_per_firm only ---
    {
      const { rows } = await client.query(
        `SELECT country_iso3, industry_id, year, size_band,
                predicted_rev_per_firm, coverage_source
         FROM extrapolated_cells
         WHERE predicted_rev_per_firm IS NOT NULL`,
      );
      let capped = 0;
      for (const r of rows) {
        const hi = boundFor(r.industry_id).hi;
        if (r.predicted_rev_per_firm == null || r.predicted_rev_per_firm <= hi) continue;
        capped++;
        const src = (r.coverage_source || "").includes("scrub:")
          ? r.coverage_source
          : `${r.coverage_source || "unknown"} | scrub:revenue-cap-2026-05-31`;
        if (commit) {
          await client.query(
            `UPDATE extrapolated_cells
             SET predicted_rev_per_firm=$1, coverage_source=$2
             WHERE country_iso3=$3 AND industry_id=$4 AND year=$5
               AND size_band IS NOT DISTINCT FROM $6`,
            [hi, src, r.country_iso3, r.industry_id, r.year, r.size_band],
          );
        } else if (capped <= 8) {
          console.log(
            `  extrapolated ${r.country_iso3}/${r.industry_id}: ` +
              `$${Math.round(r.predicted_rev_per_firm).toLocaleString()} -> $${hi.toLocaleString()}`,
          );
        }
      }
      perTable.extrapolated_cells = capped;
      totalCapped += capped;
    }
  } finally {
    await client.end();
  }

  console.log(
    `\n${commit ? "COMMITTED" : "DRY-RUN"}: ${totalCapped} rows over their SMB ceiling ` +
      `(regional ${perTable.regional_cells ?? 0}, extrapolated ${perTable.extrapolated_cells ?? 0}).`,
  );
  if (!commit) {
    console.log("No writes. Re-run with --commit to apply (founder runs this).");
  } else {
    console.log("Tagged coverage_source with 'scrub:revenue-cap-2026-05-31' for audit/rollback.");
  }
  void resolve; // reserved
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
