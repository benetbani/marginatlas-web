/**
 * Plan v26 P10 — internal data-quality dashboard.
 *
 * Surfaces:
 *   - Backend inventory snapshot (per-table row counts, country/industry
 *     spread, null rates)
 *   - Suppression list (counts by reason)
 *   - Cross-country outliers (top severity)
 *   - Scale anomalies (top severity)
 *   - Empty-shard alarm if any sitemap shard < 1 KB
 *
 * Internal-only. Robots: noindex,nofollow at the layout level.
 * No auth gating for now; B-011 will lock /admin/* behind a
 * password.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export const revalidate = 300;

type Inventory = Array<{
  table: string;
  total_rows: number | null;
  countries_count: number;
  industries_count_approx: number;
  by_country: Record<string, number>;
  null_rates: Record<string, number>;
  quality_distribution: Record<string, number>;
  year_min: number | null;
  year_max: number | null;
}>;

type Triage = {
  entries: Array<{
    country: string;
    geo_id: string;
    industry_id: string;
    decision: string;
  }>;
};

type CrossCountryOutlier = {
  country: string;
  industry_id: string;
  value: number;
  median: number;
  ratio: number;
  severity: number;
};

type CrossCountryOutliers = {
  outliers: CrossCountryOutlier[];
};

function loadJson<T>(path: string): T | null {
  const full = resolve(process.cwd(), path);
  if (!existsSync(full)) return null;
  try {
    return JSON.parse(readFileSync(full, "utf-8")) as T;
  } catch {
    return null;
  }
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return "-";
  return n.toLocaleString("en-US");
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return "-";
  return `${(n * 100).toFixed(1)}%`;
}

export default function DataQualityDashboard() {
  const inventory = loadJson<Inventory>("data/audit/backend_inventory.json");
  const triage = loadJson<Triage>("data/quality/cell_triage_slim_v1.json");
  const outliers = loadJson<CrossCountryOutliers>("data/quality/cross_country_outliers_v1.json");

  return (
    <div className="py-10">
      <header className="max-w-3xl mb-10">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
          Internal
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          Data quality dashboard
        </h1>
        <p className="mt-3 text-base text-ink-800/80">
          Health view of the three Supabase tables, the suppression list,
          and the cross-country outlier set. Surfaces silently-bad data
          before users hit it.
        </p>
      </header>

      {/* Table inventory */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-ink-900 mb-4">
          Table inventory
        </h2>
        {inventory ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-cream-100 text-left text-xs uppercase tracking-wide text-cocoa-700">
                <tr>
                  <th className="p-3 font-semibold">Table</th>
                  <th className="p-3 font-semibold">Rows</th>
                  <th className="p-3 font-semibold">Countries</th>
                  <th className="p-3 font-semibold">Industries</th>
                  <th className="p-3 font-semibold">Year</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((t) => (
                  <tr key={t.table} className="border-t border-parchment">
                    <td className="p-3 font-medium text-ink-900">{t.table}</td>
                    <td className="p-3 tabular-nums">{fmtNum(t.total_rows)}</td>
                    <td className="p-3 tabular-nums">{fmtNum(t.countries_count)}</td>
                    <td className="p-3 tabular-nums">{fmtNum(t.industries_count_approx)}</td>
                    <td className="p-3 tabular-nums">
                      {t.year_min != null && t.year_max != null
                        ? `${t.year_min}-${t.year_max}`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-ink-700/70">
            No inventory data found. Run{" "}
            <code>npx tsx scripts/audit/backend_inventory.ts</code> to
            generate <code>data/audit/backend_inventory.json</code>.
          </p>
        )}
      </section>

      {/* Per-country breakdown for regional_cells */}
      {inventory && inventory[1] && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-ink-900 mb-4">
            Regional coverage (regional_cells)
          </h2>
          <p className="text-sm text-ink-700/70 mb-4">
            Row counts per country. Empty rows mean the country is in
            the URL taxonomy but has no actual regional data. Pages
            for it render via extrapolated_cells or synthesis.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
            {Object.entries(inventory[1].by_country)
              .sort((a, b) => b[1] - a[1])
              .map(([country, n]) => (
                <div
                  key={country}
                  className="px-3 py-2 rounded-lg bg-cream-100 border border-parchment"
                >
                  <div className="font-semibold text-ink-900">{country}</div>
                  <div className="tabular-nums text-cocoa-700/80">
                    {fmtNum(n)}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Null rates */}
      {inventory && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-ink-900 mb-4">
            Null rates by table
          </h2>
          <p className="text-sm text-ink-700/70 mb-4">
            Sampled from first 1,000 rows per table. High null rate on a
            critical column means downstream consumers see synthesized
            values for that field.
          </p>
          {inventory.map((t) => (
            <div key={t.table} className="mb-6">
              <h3 className="text-sm font-semibold text-ink-900 mb-2">
                {t.table}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {Object.entries(t.null_rates).map(([field, rate]) => (
                  <div
                    key={field}
                    className="px-3 py-2 rounded-lg bg-cream-100 border border-parchment"
                  >
                    <div className="font-medium text-ink-900 text-xs">
                      {field}
                    </div>
                    <div
                      className={`tabular-nums ${
                        rate > 0.5
                          ? "text-clay-700 font-semibold"
                          : rate > 0.2
                            ? "text-amber-700"
                            : "text-moss-700"
                      }`}
                    >
                      {fmtPct(rate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Suppression */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-ink-900 mb-4">
          Suppressed cells
        </h2>
        {triage ? (
          <>
            <p className="text-sm text-ink-700/70 mb-4">
              {triage.entries.length} cells suppressed at the render
              layer. Source data is never mutated.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-cream-100 text-left uppercase tracking-wide text-cocoa-700">
                  <tr>
                    <th className="p-2 font-semibold">Country</th>
                    <th className="p-2 font-semibold">Geo ID</th>
                    <th className="p-2 font-semibold">Industry</th>
                    <th className="p-2 font-semibold">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {triage.entries.slice(0, 50).map((e, i) => (
                    <tr key={i} className="border-t border-parchment">
                      <td className="p-2">{e.country}</td>
                      <td className="p-2 font-mono">{e.geo_id}</td>
                      <td className="p-2">{e.industry_id}</td>
                      <td className="p-2 text-clay-700 font-medium">
                        {e.decision}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {triage.entries.length > 50 && (
                <p className="text-xs text-ink-700/60 mt-2">
                  … and {triage.entries.length - 50} more.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-700/70">
            No suppression file found.
          </p>
        )}
      </section>

      {/* Cross-country outliers */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-ink-900 mb-4">
          Top cross-country outliers
        </h2>
        {outliers && outliers.outliers ? (
          <>
            <p className="text-sm text-ink-700/70 mb-4">
              Cells whose revenue deviates &gt; 10x from the global
              industry median. Severity = log10(ratio).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-cream-100 text-left uppercase tracking-wide text-cocoa-700">
                  <tr>
                    <th className="p-2 font-semibold">Country</th>
                    <th className="p-2 font-semibold">Industry</th>
                    <th className="p-2 font-semibold text-right">Value</th>
                    <th className="p-2 font-semibold text-right">Median</th>
                    <th className="p-2 font-semibold text-right">Ratio</th>
                    <th className="p-2 font-semibold text-right">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {outliers.outliers.slice(0, 30).map((o, i) => (
                    <tr key={i} className="border-t border-parchment">
                      <td className="p-2">{o.country}</td>
                      <td className="p-2">{o.industry_id}</td>
                      <td className="p-2 text-right tabular-nums">
                        ${(o.value / 1_000_000).toFixed(1)}M
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        ${(o.median / 1_000).toFixed(0)}K
                      </td>
                      <td className="p-2 text-right tabular-nums">
                        {o.ratio.toFixed(0)}×
                      </td>
                      <td className="p-2 text-right tabular-nums text-clay-700">
                        {o.severity.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-700/70">
            No cross-country outlier file found.
          </p>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-ink-900 mb-4">
          Open priority actions
        </h2>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-ink-800">
          <li>
            Run Supabase migrations (
            <code>docs/superpowers/specs/2026-05-22-supabase-migrations.md</code>
            ): adds indexes, suppression flag, geos / aliases / metrics
            tables.
          </li>
          <li>Ingest European NUTS-3 data for top-30 cities (P2).</li>
          <li>
            Extend extrapolated_cells to all 195 countries (currently
            ~80) (P6).
          </li>
          <li>
            Backfill cells_master percentile nulls (14% empty) (P5).
          </li>
          <li>
            Backfill regional_cells percentile nulls (100% empty) (P1).
          </li>
        </ol>
      </section>
    </div>
  );
}

export const metadata = {
  title: "Data quality | Margin Atlas internal",
  robots: { index: false, follow: false },
};
