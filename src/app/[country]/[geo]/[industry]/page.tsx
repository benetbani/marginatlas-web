import { notFound } from "next/navigation";
import { getCellBySlug, getComparableCells, getTopCells, cellUrl, slugify } from "@/lib/cells";
import { industryToSlug } from "@/lib/taxonomy";
import { DistributionBars } from "@/components/DistributionBars";
import { QualityBadge } from "@/components/QualityBadge";
import { Tooltip } from "@/components/Tooltip";

// ISR: regenerate every 7 days (604800 seconds)
export const revalidate = 604800;
export const dynamicParams = true;

type Params = { country: string; geo: string; industry: string };

/** Pre-render the top 100 highest-traffic US cells at build time. */
export async function generateStaticParams(): Promise<Params[]> {
  try {
    const top = await getTopCells(100);
    const seen = new Set<string>();
    const params: Params[] = [];
    for (const c of top) {
      if (!c.geo_name || !c.industry_id) continue;
      const country = c.country.toLowerCase();
      const geo = slugify(c.geo_name);
      const ind = industryToSlug(c.industry_id);
      const key = `${country}/${geo}/${ind}`;
      if (seen.has(key)) continue;
      seen.add(key);
      params.push({ country, geo, industry: ind });
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) return { title: "Page not found" };
  const ind = cell.industry_name || cell.industry_description || industry;
  const geoName = cell.geo_name || geo;
  const title = `How much do ${ind.toLowerCase()} earn in ${geoName}? | Margin Atlas`;
  const median = cell.revenue_per_firm ? `~${formatMoney(cell.revenue_per_firm)} typical revenue` : "Revenue and employment numbers";
  const desc = `${median} for ${ind.toLowerCase()} in ${geoName}, ${cell.year}. Bottom-10%, typical, and top-10% spread. Source: ${cell.coverage_source}.`;
  return { title, description: desc, openGraph: { title, description: desc } };
}

export default async function CellPage({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) notFound();

  const comparables = await getComparableCells(cell.geo_name || "", cell.naics_6 || undefined, 6);

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
        <span className="capitalize">
          {cell.industry_name || industry.replace(/-/g, " ")}
        </span>
      </nav>

      {/* Hero */}
      <header className="py-8">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
          {cell.sector_name && <>{cell.sector_name} · </>}
          {cell.geo_name} · {cell.year}
        </div>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-ink-900">
          How much do <span className="text-atlas-600">{(cell.industry_name || "businesses").toLowerCase()}</span> earn in {cell.geo_name}?
        </h1>
        {cell.industry_examples && cell.industry_examples.length > 0 && (
          <p className="mt-2 text-sm text-ink-700/60">
            Includes: {cell.industry_examples.slice(0, 5).join(" · ")}
          </p>
        )}
        <p className="mt-4 text-lg text-ink-800/80 max-w-3xl leading-relaxed">
          A typical {(cell.industry_name || "firm").toLowerCase().replace(/s$/, "")} here brings in about{" "}
          <strong>{formatMoney(cell.revenue_per_firm)}</strong> per year. There are{" "}
          <strong>{cell.n_enterprises?.toLocaleString() || "—"}</strong> of them in {cell.geo_name}, employing roughly{" "}
          <strong>{cell.n_employees?.toLocaleString() || "—"}</strong> people.
        </p>
      </header>

      {/* Headline grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
        <Stat label="How many firms" value={cell.n_enterprises?.toLocaleString() || "—"} />
        <Stat label="People working" value={cell.n_employees?.toLocaleString() || "—"} />
        <Stat
          label="Typical yearly revenue"
          value={formatMoney(cell.revenue_per_firm)}
          tooltip="The middle firm — half make more, half make less. Often called the median."
        />
        <Stat
          label="Wage per employee"
          value={formatMoney(cell.payroll_per_employee)}
          tooltip="Average annual pay across all employees in this industry."
        />
      </section>

      {/* Distribution bars */}
      <section className="py-6">
        <DistributionBars
          p10={cell.rev_p10}
          p25={cell.rev_p25}
          p50={cell.rev_p50}
          p75={cell.rev_p75}
          p90={cell.rev_p90}
          currencySymbol="$"
        />
      </section>

      {/* Quality */}
      <section className="py-6">
        <QualityBadge
          qualityScore={cell.quality_score}
          coverageTier={cell.coverage_tier}
          coverageSource={cell.coverage_source}
        />
      </section>

      {/* Comparable cells */}
      {comparables.length > 0 && (
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
            Other industries in {cell.geo_name}
          </h2>
          <p className="text-sm text-ink-700/70 mt-1">
            See how this compares to other businesses in the same state.
          </p>
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {comparables.map((c) => (
              <a
                key={`${c.geo_id}-${c.naics_6}-${c.year}`}
                href={cellUrl(c)}
                className="block px-4 py-3 rounded-xl border border-slate-200/60 bg-white hover:border-atlas-500 transition"
              >
                <div className="text-sm font-medium text-ink-900 line-clamp-1">
                  {c.industry_name || c.industry_description || c.naics_6}
                </div>
                <div className="text-xs text-ink-700/70 mt-1">
                  {c.n_enterprises?.toLocaleString()} firms · {formatMoney(c.revenue_per_firm)} typical revenue
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Methodology link */}
      <section className="py-6 text-sm text-ink-700/70">
        <a href="/methodology" className="hover:text-atlas-600 underline">
          How we compute these numbers →
        </a>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip?: string;
}) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div className="mt-2 text-2xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}

function formatMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
