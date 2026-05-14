import { notFound } from "next/navigation";
import { getCellBySlug, getComparableCells } from "@/lib/cells";

// ISR: regenerate every 7 days (604800 seconds = 86400 * 7)
export const revalidate = 604800;

// Don't pre-render at build time; let pages generate on-demand.
// Top cells can be pre-rendered later via generateStaticParams.
export const dynamicParams = true;

type Params = {
  country: string;
  geo: string;
  industry: string;
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) return { title: "Cell not found" };
  const ind = cell.industry_description || cell.naics_6 || industry;
  const title = `${ind} margins in ${cell.geo_name || geo} | Margin Atlas`;
  const desc = `Revenue, employment, and payroll percentiles for ${ind} firms in ${cell.geo_name}. Median ${formatUSD(cell.revenue_per_firm)} per firm. Source: ${cell.coverage_source}.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
  };
}

export default async function CellPage({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) notFound();

  const comparables = await getComparableCells(
    cell.geo_name || "",
    cell.naics_6 || undefined,
    6
  );

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <a href={`/${country}`} className="hover:text-atlas-600">{country.toUpperCase()}</a>
        <span className="mx-2">/</span>
        <a href={`/${country}/${geo}`} className="hover:text-atlas-600 capitalize">{geo.replace(/-/g, " ")}</a>
        <span className="mx-2">/</span>
        <span className="capitalize">{industry.replace(/-/g, " ")}</span>
      </nav>

      {/* Hero */}
      <header className="py-8">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
          {cell.country} · {cell.geo_name} · {cell.year}
        </div>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-ink-900">
          {cell.industry_description || cell.naics_6} margins in <span className="text-atlas-600">{cell.geo_name}</span>
        </h1>
        <p className="mt-4 text-lg text-ink-800/80 max-w-3xl leading-relaxed">
          {cell.n_enterprises?.toLocaleString()} firms · {cell.n_employees?.toLocaleString()} employees ·
          median {formatUSD(cell.revenue_per_firm)} revenue per firm.
        </p>
      </header>

      {/* Headline grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
        <Stat label="Firms" value={cell.n_enterprises?.toLocaleString() || "—"} />
        <Stat label="Employees" value={cell.n_employees?.toLocaleString() || "—"} />
        <Stat label="Rev / firm (p50)" value={formatUSD(cell.revenue_per_firm)} />
        <Stat label="Wage / employee" value={formatUSD(cell.payroll_per_employee)} />
      </section>

      {/* Source + quality */}
      <section className="py-6">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium mb-2">
            Source & quality
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-ink-700/60">Source</div>
              <div className="text-ink-900 mt-1">{cell.coverage_source || "—"}</div>
            </div>
            <div>
              <div className="text-ink-700/60">Tier</div>
              <div className="text-ink-900 mt-1">{cell.coverage_tier || "—"}</div>
            </div>
            <div>
              <div className="text-ink-700/60">Quality score</div>
              <div className="text-ink-900 mt-1">{cell.quality_score || "—"} / 100</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparable cells */}
      <section className="py-8">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">Comparable cells</h2>
        <p className="text-sm text-ink-700/70 mt-1">
          Other industries in {cell.geo_name} with similar coverage.
        </p>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {comparables.map((c) => {
            const indSlug = (c.industry_description || c.naics_6 || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
            return (
              <a
                key={`${c.geo_id}-${c.naics_6}-${c.year}`}
                href={`/${country}/${geo}/${indSlug}`}
                className="block px-4 py-3 rounded-xl border border-slate-200/60 bg-white hover:border-atlas-500 transition"
              >
                <div className="text-sm font-medium text-ink-900 line-clamp-1">
                  {c.industry_description || c.naics_6}
                </div>
                <div className="text-xs text-ink-700/70 mt-1">
                  {c.n_enterprises?.toLocaleString()} firms · {formatUSD(c.revenue_per_firm)} / firm
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Methodology link */}
      <section className="py-6 text-sm text-ink-700/70">
        <a href="/methodology" className="hover:text-atlas-600 underline">
          How we compute these numbers →
        </a>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}

function formatUSD(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
