/**
 * /admin/anomalies — internal dashboard surfacing the latest anomaly scan.
 *
 * Gated by ADMIN_KEY environment variable + matching ?key= query param.
 * No real auth yet (lands in Track II); this is a stopgap so the founder
 * can browse scan output in production without exposing it publicly.
 */
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { timingSafeEqualString } from "@/lib/rate_limit";

export const dynamic = "force-dynamic";

type ScanReport = {
  generated_at: string;
  tables: Record<
    string,
    {
      total_rows?: number;
      peer_groups?: number;
      counts?: Record<string, number>;
      samples?: Record<
        string,
        Array<{
          country?: string;
          geo_id?: string;
          industry_id?: string;
          size_band?: string;
          year?: number;
          issue?: string;
        }>
      >;
      error?: string;
    }
  >;
};

function loadReport(): ScanReport | null {
  /* In-repo paths only. The third candidate used to climb to
     "../delivery/quality/", which is the parent repository and is never
     present on a build server. It was harmless here because the first
     candidate resolves and the chain is wrapped in try/catch, but a dead
     path that reaches outside the repo is a template someone copies. The
     same shape, unguarded, has cost 49 deploys. */
  const candidates = [
    path.resolve(process.cwd(), "delivery/quality/anomaly_scan_v1.json"),
    path.resolve(process.cwd(), "data/quality/anomaly_scan_v1.json"),
  ];
  for (const p of candidates) {
    try {
      const raw = fs.readFileSync(p, "utf-8");
      return JSON.parse(raw) as ScanReport;
    } catch {
      continue;
    }
  }
  return null;
}

export default async function AnomaliesPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const sp = await searchParams;
  const required = process.env.ADMIN_KEY;
  if (!required || !timingSafeEqualString(sp.key ?? "", required)) {
    notFound();
  }

  const report = loadReport();
  if (!report) {
    return (
      <div className="py-16 max-w-3xl">
        <h1 className="text-3xl font-semibold text-ink-900">Anomaly scan</h1>
        <p className="mt-4 text-ink-700">
          No scan report on disk. Run{" "}
          <code className="px-1.5 py-0.5 rounded bg-parchment-100">
            python scripts/quality/scan_anomalies.py
          </code>{" "}
          to generate one.
        </p>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-5xl">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
        internal
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
        Anomaly scan
      </h1>
      <p className="mt-2 text-sm text-ink-700/70">
        Generated {report.generated_at}
      </p>

      {Object.entries(report.tables).map(([table, data]) => (
        /* The section is the card, not the count tiles inside it: the h2 and
           the scanned-rows line were bare type on the fixed page photograph,
           and .atlas-card's 16px radius on a 40px count tile is a worse
           drawing than the 8px it has. Converging a surface is not the same
           as converging a mark. */
        <section key={table} className="atlas-card mt-12 px-5 py-6 md:px-7 md:py-7">
          <h2 className="text-xl font-semibold text-ink-900">{table}</h2>
          {data.error ? (
            <p className="mt-2 text-sm text-clay-700">Error: {data.error}</p>
          ) : (
            <>
              <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-sm text-ink-700">
                <span>
                  rows scanned:{" "}
                  <strong className="text-ink-900">
                    {data.total_rows?.toLocaleString() ?? "-"}
                  </strong>
                </span>
                <span>
                  peer groups:{" "}
                  <strong className="text-ink-900">
                    {data.peer_groups?.toLocaleString() ?? "-"}
                  </strong>
                </span>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(data.counts ?? {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div
                      key={cat}
                      className="px-3 py-2 rounded-lg border border-ink-200 bg-white"
                    >
                      <div className="text-xs uppercase tracking-wide text-ink-700/70">
                        {cat}
                      </div>
                      <div className="text-xl font-semibold text-ink-900">
                        {count.toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>

              {Object.entries(data.samples ?? {}).map(([cat, samples]) =>
                samples && samples.length > 0 ? (
                  <details key={cat} className="mt-6">
                    <summary className="cursor-pointer text-sm font-medium text-ink-900">
                      Top {Math.min(50, samples.length)} {cat} samples
                    </summary>
                    <div className="mt-3 overflow-x-auto">
                      <table className="text-xs w-full border-collapse">
                        <thead>
                          <tr className="text-left text-ink-700/70 border-b border-ink-200">
                            <th className="py-1 pr-3">country</th>
                            <th className="py-1 pr-3">geo</th>
                            <th className="py-1 pr-3">industry</th>
                            <th className="py-1 pr-3">size</th>
                            <th className="py-1 pr-3">year</th>
                            <th className="py-1">issue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {samples.slice(0, 50).map((s, i) => (
                            <tr key={i} className="border-b border-ink-200/40">
                              <td className="py-1 pr-3">{s.country}</td>
                              <td className="py-1 pr-3 font-mono">
                                {s.geo_id}
                              </td>
                              <td className="py-1 pr-3">{s.industry_id}</td>
                              <td className="py-1 pr-3">{s.size_band}</td>
                              <td className="py-1 pr-3">{s.year}</td>
                              <td className="py-1 text-ink-700/80">
                                {s.issue}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                ) : null
              )}
            </>
          )}
        </section>
      ))}
    </div>
  );
}
