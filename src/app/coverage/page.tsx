/**
 * /coverage — worldwide coverage page.
 *
 * Plan v32 rewrite. The previous page framed itself as a "trust signal /
 * honest accounting of strong vs weak vs missing" and had a literal
 * "Most-needed countries" section that publicly named the weakest entries.
 * Founder removed that framing: coverage pages describe scope and depth,
 * not gaps. Column labels reworded for the same reason.
 */
import Link from "next/link";
import { COUNTRIES } from "@/lib/taxonomy";
import {
  getCoverageReport,
  type CoverageCountry,
} from "@/lib/quality/coverage-report";

export const revalidate = 21600; // 6 hours

function depthClass(q: number): string {
  // Higher = darker / more solid. No red.
  if (q >= 8.5) return "bg-ink-900 text-cream-50";
  if (q >= 7.0) return "bg-ink-700 text-cream-50";
  if (q >= 5.0) return "bg-ink-200 text-ink-900";
  return "bg-ink-100 text-ink-700";
}

function countryName(iso2: string): string {
  return COUNTRIES.find((c) => c.code === iso2)?.name || iso2;
}

export const metadata = {
  title: "Worldwide coverage: Margin Atlas",
  description:
    "Countries, industries, and benchmark depth covered today in Margin Atlas.",
  alternates: { canonical: "/coverage" },
};

export default async function CoveragePage() {
  const report = getCoverageReport();

  if (!report) {
    // Fallback — preserves a useful page even if the snapshot is missing.
    return (
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          Worldwide coverage
        </h1>
        <p className="mt-4 text-ink-700">
          The latest coverage snapshot is being refreshed. The browse page
          stays available in the meantime:{" "}
          <Link href="/browse" className="text-atlas-700 hover:text-atlas-900">
            browse the atlas →
          </Link>
        </p>
      </div>
    );
  }

  const sortedByDepth: CoverageCountry[] = [...report.countries].sort(
    (a, b) => (b.avg_quality_10 ?? 0) - (a.avg_quality_10 ?? 0)
  );
  const sortedByCells: CoverageCountry[] = [...report.countries].sort(
    (a, b) =>
      (b.regional_cells + b.extrapolated_cells) -
      (a.regional_cells + a.extrapolated_cells)
  );
  const headlineCountries = sortedByDepth.slice(0, 12);
  const totalBenchmarks =
    (report.totals?.regional_cells_total ?? 0) +
    (report.totals?.extrapolated_cells_total ?? 0);

  return (
    <div className="py-8">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
          Coverage
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          Worldwide coverage at a glance
        </h1>
        <p className="mt-3 text-ink-700 leading-relaxed">
          What Margin Atlas covers today: countries, industries, and benchmark
          depth. Pick any country for the full per-industry scorecard. Last
          refresh:{" "}
          <time className="font-medium text-ink-900">
            {(report.generated_at ?? "").slice(0, 10) || "rolling"}
          </time>
          .
        </p>
      </header>

      <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          [(report.totals?.countries ?? report.countries.length).toLocaleString(), "countries covered"],
          [totalBenchmarks.toLocaleString(), "industry benchmarks"],
          [
            (report.totals?.regional_cells_total ?? 0).toLocaleString(),
            "sub-national cells",
          ],
          [
            (report.totals?.industries_covered ?? 0).toLocaleString(),
            "industries",
          ],
        ].map(([n, label]) => (
          <div
            key={label}
            className="rounded-2xl bg-white border border-ink-200 p-5"
          >
            <div className="text-3xl font-semibold text-ink-900 tabular-nums">
              {n}
            </div>
            <div className="text-sm text-ink-700 mt-1">{label}</div>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="text-xl font-semibold text-ink-900">
            Deepest country coverage
          </h2>
          <span className="text-xs text-ink-700/60">
            ranked by benchmark depth, 1 to 10
          </span>
        </div>
        <p className="text-sm text-ink-700 mb-4">
          The 12 countries with the deepest per-industry detail.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {headlineCountries.map((c) => (
            <Link
              key={c.iso2}
              href={`/coverage/${c.iso2.toLowerCase()}`}
              className="block p-4 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-ink-900 text-sm truncate">
                  {countryName(c.iso2)}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium tabular-nums ${depthClass(
                    c.avg_quality_10 ?? 0
                  )}`}
                >
                  {(c.avg_quality_10 ?? 0).toFixed(1)}
                </span>
              </div>
              <div className="mt-1 text-xs text-ink-700/70">
                {(c.regional_cells + c.extrapolated_cells).toLocaleString()}{" "}
                benchmarks · {c.industries} industries
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="text-xl font-semibold text-ink-900">
            All countries
          </h2>
          <span className="text-xs text-ink-700/60">
            sorted by total benchmarks
          </span>
        </div>
        <p className="text-sm text-ink-700 mb-4">
          Click any row for the full country scorecard.
        </p>
        <div className="overflow-x-auto rounded-xl border border-ink-200">
          <table className="w-full text-sm bg-white">
            <thead className="bg-ink-100 text-ink-900">
              <tr className="text-left">
                <th className="py-2 px-3">Country</th>
                <th className="py-2 px-3 text-right">Sub-national</th>
                <th className="py-2 px-3 text-right">Modeled</th>
                <th className="py-2 px-3 text-right">Industries</th>
                <th className="py-2 px-3 text-right">Depth</th>
              </tr>
            </thead>
            <tbody>
              {sortedByCells.map((c) => (
                <tr key={c.iso2} className="border-t border-ink-200/40">
                  <td className="py-1.5 px-3">
                    <Link
                      href={`/coverage/${c.iso2.toLowerCase()}`}
                      className="text-ink-900 hover:text-atlas-700"
                    >
                      {countryName(c.iso2)}{" "}
                      <span className="text-ink-700/60 font-mono text-xs">
                        {c.iso2}
                      </span>
                    </Link>
                  </td>
                  <td className="py-1.5 px-3 text-right tabular-nums">
                    {c.regional_cells.toLocaleString()}
                  </td>
                  <td className="py-1.5 px-3 text-right tabular-nums">
                    {c.extrapolated_cells.toLocaleString()}
                  </td>
                  <td className="py-1.5 px-3 text-right tabular-nums">
                    {c.industries}
                  </td>
                  <td className="py-1.5 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium tabular-nums ${depthClass(
                        c.avg_quality_10 ?? 0
                      )}`}
                    >
                      {(c.avg_quality_10 ?? 0).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-700/60 leading-relaxed max-w-3xl">
          Sub-national cells are benchmarks pinned to a specific region or city
          inside a country. Modeled cells fill the rest of the country grid by
          extending the local sub-national pattern across the same industry.
          Depth blends both into a 1-to-10 score per country.
        </p>
      </section>
    </div>
  );
}
