import { notFound } from "next/navigation";
import {
  getCellBySlug,
  getCellVariants,
  getComparableCells,
  getTopCells,
  getSameIndustryAcrossStates,
  getIndustryRankInState,
  cellUrl,
  slugify,
  distinctSizeBands,
  distinctYears,
  buildTimeSeries,
  listUsStates,
} from "@/lib/cells";
import { INDUSTRIES, industryToSlug } from "@/lib/taxonomy";
import { DistributionBars } from "@/components/DistributionBars";
import { DistributionHistogram } from "@/components/DistributionHistogram";
import { QualityBadge } from "@/components/QualityBadge";
import { Tooltip } from "@/components/Tooltip";
import { DimensionSwitcher } from "@/components/DimensionSwitcher";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import { TypicalFirmCard } from "@/components/TypicalFirmCard";
import { AcrossStatesStrip } from "@/components/AcrossStatesStrip";
import { CellPageNav } from "@/components/CellPageNav";
import { CellActions } from "@/components/CellActions";
import { AtlasScore } from "@/components/AtlasScore";
import { CellDataset, Breadcrumbs } from "@/components/StructuredData";

// ISR: regenerate every 7 days (604800 seconds)
export const revalidate = 604800;
export const dynamicParams = true;

type Params = { country: string; geo: string; industry: string };
type SearchParams = { size?: string; year?: string };

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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { country, geo, industry } = await params;
  const sp = await searchParams;
  const cell = await getCellBySlug(country, geo, industry, {
    sizeBand: sp.size || null,
    year: sp.year ? Number(sp.year) : null,
  });
  if (!cell) return { title: "Page not found" };
  const ind = cell.industry_name || cell.industry_description || industry;
  const geoName = cell.geo_name || geo;
  const title = `How much do ${ind.toLowerCase()} earn in ${geoName}? | Margin Atlas`;
  const median = cell.revenue_per_firm ? `~${formatMoney(cell.revenue_per_firm)} typical revenue` : "Revenue and employment numbers";
  const desc = `${median} for ${ind.toLowerCase()} in ${geoName}, ${cell.year}. Bottom-10%, typical, and top-10% spread across ${cell.n_enterprises?.toLocaleString() || "thousands of"} firms.`;
  return { title, description: desc, openGraph: { title, description: desc } };
}

export default async function CellPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { country, geo, industry } = await params;
  const sp = await searchParams;
  const currentSize = sp.size || null;
  const currentYear = sp.year ? Number(sp.year) : null;

  const cell = await getCellBySlug(country, geo, industry, {
    sizeBand: currentSize,
    year: currentYear,
  });
  if (!cell) notFound();

  // Fetch siblings for the dimension switcher (one round-trip, capped at 200 rows).
  const variants = await getCellVariants(country, geo, industry);
  const availableSizes = distinctSizeBands(variants);
  const availableYears = distinctYears(variants);
  const timeSeries = buildTimeSeries(variants);

  // YoY change for headline stats — compares current year to prior year on the
  // same series.
  const yoy = computeYoY(timeSeries, cell.year);

  // Fan out the remaining three data fetches concurrently. None block the others.
  const [comparables, acrossStates, rank] = await Promise.all([
    getComparableCells(cell.geo_name || "", cell.naics_6 || undefined, 6),
    getSameIndustryAcrossStates(industry, cell.geo_id, 10),
    getIndustryRankInState(cell.geo_id, cell.naics_6 || null),
  ]);

  // Build region + industry option lists for switcher
  const regions = listUsStates();
  const industryOpts = INDUSTRIES.map((i) => ({
    id: i.id,
    name: i.name,
    slug: industryToSlug(i.id),
  })).sort((a, b) => a.name.localeCompare(b.name));

  const url = `https://marginatlas.com/${country}/${geo}/${industry}`;
  return (
    <div className="xl:flex xl:gap-6">
      <div className="xl:flex-1 xl:min-w-0">
      <CellDataset
        url={url}
        industryName={cell.industry_name || industry}
        geoName={cell.geo_name || geo}
        year={cell.year}
        medianRevenue={cell.revenue_per_firm}
        nEnterprises={cell.n_enterprises}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://marginatlas.com/" },
          { name: country.toUpperCase(), url: `https://marginatlas.com/${country}` },
          { name: cell.geo_name || geo, url: `https://marginatlas.com/${country}/${geo}` },
          { name: cell.industry_name || industry, url },
        ]}
      />

      {/* Actions: save / copy link / CSV / embed */}
      <CellActions
        country={country}
        geo={geo}
        industry={industry}
        industryName={cell.industry_name || industry.replace(/-/g, " ")}
        geoName={cell.geo_name || geo}
      />

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

      {/* In-page dimension switcher — region/industry/size/year */}
      <DimensionSwitcher
        country={country}
        geoSlug={geo}
        industrySlug={industry}
        industryName={cell.industry_name || industry.replace(/-/g, " ")}
        geoName={cell.geo_name || geo}
        regions={regions}
        industries={industryOpts}
        sizeBands={availableSizes}
        years={availableYears}
        currentSize={currentSize}
        currentYear={currentYear}
      />

      {/* Hero */}
      <header id="headline" className="py-8">
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
        {rank && (
          <p className="mt-3 text-sm text-ink-700/70">
            Ranks <strong className="text-ink-900">#{rank.rank}</strong> out of{" "}
            <strong className="text-ink-900">{rank.total}</strong> industries
            in {cell.geo_name} by firm count.
          </p>
        )}
      </header>

      {/* Headline grid */}
      <section id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
        <Stat
          label="How many firms"
          value={cell.n_enterprises?.toLocaleString() || "—"}
          yoy={yoy.n_enterprises}
        />
        <Stat
          label="People working"
          value={cell.n_employees?.toLocaleString() || "—"}
          yoy={yoy.n_employees}
        />
        <Stat
          label="Typical yearly revenue"
          value={formatMoney(cell.revenue_per_firm)}
          tooltip="The middle firm — half make more, half make less. Often called the median."
          yoy={yoy.revenue_per_firm}
        />
        <Stat
          label="Wage per employee"
          value={formatMoney(cell.payroll_per_employee)}
          tooltip="Average annual pay across all employees in this industry."
          yoy={yoy.payroll_per_employee}
        />
      </section>

      {/* Atlas Score + Typical-firm biography card */}
      <section id="typical-firm" className="py-6 grid md:grid-cols-[1fr_2fr] gap-4">
        <AtlasScore cell={cell} />
        <TypicalFirmCard cell={cell} currencySymbol="$" />
      </section>

      {/* Distribution — histogram + 5-bar tier view side by side */}
      <section id="distribution" className="py-6 grid lg:grid-cols-2 gap-4">
        <DistributionHistogram
          p10={cell.rev_p10}
          p25={cell.rev_p25}
          p50={cell.rev_p50}
          p75={cell.rev_p75}
          p90={cell.rev_p90}
          currencySymbol="$"
        />
        <DistributionBars
          p10={cell.rev_p10}
          p25={cell.rev_p25}
          p50={cell.rev_p50}
          p75={cell.rev_p75}
          p90={cell.rev_p90}
          currencySymbol="$"
        />
      </section>

      {/* Time series */}
      {timeSeries.length >= 2 && (
        <section id="timeseries" className="py-6 grid md:grid-cols-2 gap-4">
          <TimeSeriesChart
            data={timeSeries}
            metric="revenue_per_firm"
            label="Typical revenue per firm"
            currencySymbol="$"
          />
          <TimeSeriesChart
            data={timeSeries}
            metric="n_enterprises"
            label="Number of firms"
          />
        </section>
      )}

      {/* Quality */}
      <section id="quality" className="py-6">
        <QualityBadge
          qualityScore={cell.quality_score}
          coverageTier={cell.coverage_tier}
          coverageSource={cell.coverage_source}
        />
      </section>

      {/* Same industry, other states */}
      <div id="across-states" />
      <AcrossStatesStrip
        industryName={cell.industry_name || industry.replace(/-/g, " ")}
        currentGeoName={cell.geo_name || geo}
        cells={acrossStates}
      />

      {/* Comparable cells */}
      {comparables.length > 0 && (
        <section id="comparable" className="py-8">
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

      {/* About the data link */}
      <section className="py-6 text-sm text-ink-700/70">
        <a href="/about-data" className="hover:text-atlas-600 underline">
          About how to read these numbers →
        </a>
      </section>
      </div>
      <CellPageNav />
    </div>
  );
}

function Stat({
  label,
  value,
  tooltip,
  yoy,
}: {
  label: string;
  value: string;
  tooltip?: string;
  yoy?: number | null;
}) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div className="mt-2 text-2xl font-semibold text-ink-900">{value}</div>
      {yoy != null && isFinite(yoy) && (
        <div
          className={`mt-1 text-xs font-medium ${
            yoy >= 0 ? "text-emerald-700" : "text-rose-700"
          }`}
          title="Year-over-year change"
        >
          {yoy >= 0 ? "▲" : "▼"} {yoy >= 0 ? "+" : ""}
          {(yoy * 100).toFixed(1)}% YoY
        </div>
      )}
    </div>
  );
}

type YoYResult = {
  n_enterprises: number | null;
  n_employees: number | null;
  revenue_per_firm: number | null;
  payroll_per_employee: number | null;
};

function computeYoY(
  series: { year: number; revenue_per_firm: number | null; n_enterprises: number | null; n_employees: number | null; payroll_per_employee: number | null }[],
  currentYear: number
): YoYResult {
  const out: YoYResult = {
    n_enterprises: null,
    n_employees: null,
    revenue_per_firm: null,
    payroll_per_employee: null,
  };
  const curr = series.find((p) => p.year === currentYear);
  if (!curr) return out;
  // Find most recent prior year
  const priors = series.filter((p) => p.year < currentYear).sort((a, b) => b.year - a.year);
  const prev = priors[0];
  if (!prev) return out;
  function ratio(a: number | null, b: number | null): number | null {
    if (a == null || b == null || b === 0) return null;
    return (a - b) / b;
  }
  out.n_enterprises = ratio(curr.n_enterprises, prev.n_enterprises);
  out.n_employees = ratio(curr.n_employees, prev.n_employees);
  out.revenue_per_firm = ratio(curr.revenue_per_firm, prev.revenue_per_firm);
  out.payroll_per_employee = ratio(curr.payroll_per_employee, prev.payroll_per_employee);
  return out;
}

function formatMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
