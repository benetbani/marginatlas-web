import { notFound } from "next/navigation";
import {
  getCellBySlug,
  getCellVariants,
  getComparableCells,
  getTopCells,
  getSameIndustryAcrossStates,
  getSameIndustryAcrossCountries,
  getNudgeNeighbor,
  cellUrl,
  slugify,
  distinctSizeBands,
  distinctYears,
  buildTimeSeries,
  listUsStates,
} from "@/lib/cells";
import { INDUSTRIES, industryToSlug } from "@/lib/taxonomy";
import { iso2ToName } from "@/lib/countries";
import { CountryFlag } from "@/components/CountryFlag";
import { RevenueTiles } from "@/components/RevenueTiles";
import { RevenueDistribution } from "@/components/RevenueDistribution";
import { MarginWaterfall } from "@/components/MarginWaterfall";
import { Tooltip } from "@/components/Tooltip";
import { DimensionSwitcher } from "@/components/DimensionSwitcher";
import { TypicalFirmCard } from "@/components/TypicalFirmCard";
import { PostTaxToggle } from "@/components/PostTaxToggle";
import { NetProfitWaterfall } from "@/components/NetProfitWaterfall";
import { AcrossStatesStrip } from "@/components/AcrossStatesStrip";
import { CellPageNav } from "@/components/CellPageNav";
import { CellActions } from "@/components/CellActions";
import { AtlasScore } from "@/components/AtlasScore";
import { SmartImage } from "@/components/SmartImage";
import { AtlasHeroImage } from "@/components/AtlasHeroImage";
import { pickCellHeroImage } from "@/lib/images";
import { AudienceCaveat } from "@/components/AudienceCaveat";
import { AcrossCountriesStrip } from "@/components/AcrossCountriesStrip";
import { SECTOR_BY_ID, INDUSTRY_BY_ID, slugToIndustry, resolveToMeasuredIndustry } from "@/lib/taxonomy";
import { CellDataset, Breadcrumbs } from "@/components/StructuredData";
import { RelatedIndustriesStrip } from "@/components/RelatedIndustriesStrip";
import { getToneClass } from "@/lib/page-layout/section-order";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CellWarningChips } from "@/components/CellWarningChips";
// Plan v13 Wave 4a (D2) — EmptyStateCard import removed; we degrade silently now.
// import { EmptyStateCard } from "@/components/EmptyStateCard";
import { CorrectionForm } from "@/components/CorrectionForm";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { Money } from "@/components/Money";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { clampMargin } from "@/lib/finance/margin_floor";
import { generateFAQs } from "@/lib/seo/faq_generator";
import { FAQSchema } from "@/components/FAQSchema";
import { getCellNarrative } from "@/lib/content/narratives";

type IndustryMarginRow = { gross_margin: number; operating_margin: number; asset_intensity?: number };
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

// ISR: regenerate every 6 hours (21600 seconds) — Track EE.1.
// Per-cell tiering (1h for quality_10>=8, 24h for 5-7, 7d for <5) is not
// possible without converting to dynamic rendering since Next App Router
// requires revalidate to be a static export. 6h is the compromise that
// catches Supabase refreshes within a working day while keeping CDN hit
// rates high.
export const revalidate = 21600;
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
}: {
  params: Promise<Params>;
}) {
  const { country, geo, industry } = await params;
  // No searchParams here — metadata uses the canonical cell (default
  // size band / latest year). This removes the Dynamic Server Usage
  // exception Next 15 was throwing during static-param generation,
  // which Sentry was reporting as a noisy false-positive error.
  const cell = await getCellBySlug(country, geo, industry, {
    sizeBand: null,
    year: null,
  });
  if (!cell) return { title: "Page not found" };
  const ind = cell.industry_name || cell.industry_description || industry;
  const geoName = cell.geo_name || geo;
  const title = `How much do ${ind.toLowerCase()} earn in ${geoName}? | Margin Atlas`;
  const median = cell.revenue_per_firm ? `~${formatMoney(cell.revenue_per_firm)} typical revenue` : "Revenue and employment numbers";
  const desc = `${median} for ${ind.toLowerCase()} in ${geoName}. Bottom-10%, typical, and top-10% benchmarks.`;
  const ogPath = `/og/cell?country=${encodeURIComponent(country)}&geo=${encodeURIComponent(geo)}&industry=${encodeURIComponent(industry)}`;
  const canonical = `/${country.toLowerCase()}/${geo.toLowerCase()}/${industry.toLowerCase()}`;
  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      images: [{ url: ogPath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogPath],
    },
  };
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

  // Fan out the remaining data fetches concurrently. None block the others.
  const isUsCell = country.toLowerCase() === "us";
  const [comparables, acrossStates, acrossCountries, nudge] = await Promise.all([
    getComparableCells(cell.geo_name || "", cell.naics_6 || undefined, 6),
    isUsCell ? getSameIndustryAcrossStates(industry, cell.geo_id, 10) : Promise.resolve([]),
    isUsCell ? Promise.resolve([]) : getSameIndustryAcrossCountries(industry, country, 10),
    getNudgeNeighbor(cell),
  ]);

  // Build region + industry option lists for switcher
  const regions = listUsStates();
  // Audience filter: switcher only shows SMB-relevant industries by default.
  const industryOpts = INDUSTRIES
    .filter((i) => {
      const a = i.audience || "smb_friendly";
      return a === "smb_core" || a === "smb_friendly";
    })
    .map((i) => ({
      id: i.id,
      name: i.name,
      slug: industryToSlug(i.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Caveat resolution: which industry record did the URL hit, and are we
  // displaying parent-fallback numbers?
  const requestedIndustry = slugToIndustry(industry);
  const measuredIndustry = resolveToMeasuredIndustry(requestedIndustry);
  const usingParentData = !!(
    requestedIndustry &&
    measuredIndustry &&
    requestedIndustry.id !== measuredIndustry.id
  );
  // Silence eslint unused — INDUSTRY_BY_ID may not be used directly here
  void INDUSTRY_BY_ID;

  // Margin waterfall inputs — gross + operating come from the industry
  // lookup, net comes from estimateNetProfit() so it reflects the
  // sub-regional tax + fixed-cost adjustments. clampMargin is applied
  // inside the MarginWaterfall component as a defensive floor.
  const marginRow = lookupIndustryMargin(cell.industry_id);
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const payrollForMargin =
    cell.payroll_per_employee != null && cell.n_employees != null && cell.n_enterprises
      ? (cell.payroll_per_employee * cell.n_employees) / cell.n_enterprises
      : null;
  const rawNetMargin =
    grossRevenueForMargin && grossRevenueForMargin > 0
      ? estimateNetProfit({
          iso2: country.toUpperCase(),
          geoId: cell.geo_id || geo,
          industryId: cell.industry_id || null,
          sectorId: cell.sector_id || null,
          grossRevenue: grossRevenueForMargin,
          payroll: payrollForMargin,
        }).net_margin
      : null;
  // Defensive floor — never let a sub-3% net margin reach the page.
  const computedNetMargin = rawNetMargin != null ? clampMargin(rawNetMargin, "net") : null;

  // Plan v14 Phase C.4 — FAQPage JSON-LD payload. The question text matches
  // the phrase universe (scripts/seo/build_phrase_universe.py), so any organic
  // search for "how much does a pharmacy make in California" surfaces this
  // page. Answers are derived live from the cell's revenue + margin numbers;
  // source-agency hygiene (R-002) is enforced inside the generator.
  const faqs = generateFAQs(cell, {
    gross_margin: marginRow.gross_margin,
    operating_margin: marginRow.operating_margin,
    net_margin: computedNetMargin,
  });

  // Plan v14 Phase B — per-cell editorial narrative (Haiku-generated bulk
  // with Sonnet quality pass on top-200). The cache keys use the FRIENDLY
  // industry id (e.g. "restaurants"), but US cells_master rows may have a
  // null industry_id with the friendly slug only derivable via NAICS. We
  // resolve the URL slug to a friendly id and fall back to cell.industry_id
  // so the lookup hits whether the cell was loaded from cells_master,
  // regional_cells, or extrapolated_cells.
  const resolvedIndustryForNarrative =
    slugToIndustry(industry)?.id || cell.industry_id;
  const narrative = resolvedIndustryForNarrative
    ? getCellNarrative(
        country,
        cell.geo_id || geo,
        resolvedIndustryForNarrative,
        cell.size_band || "total"
      )
    : null;

  const url = `https://www.marginatlas.com/${country}/${geo}/${industry}`;
  return (
    <div className="xl:flex xl:gap-6">
      <div className="xl:flex-1 xl:min-w-0">
      <CellDataset
        url={url}
        industryName={cell.industry_name || industry}
        geoName={cell.geo_name || geo}
        country={country.toUpperCase()}
        year={cell.year}
        medianRevenue={cell.revenue_per_firm}
        nEnterprises={cell.n_enterprises}
        nEmployees={cell.n_employees}
        wagePerEmployee={cell.payroll_per_employee}
        revP10={cell.rev_p10}
        revP90={cell.rev_p90}
        qualityScore={cell.quality_score}
        csvExportUrl={`https://www.marginatlas.com/api/export-csv?country=${country}&geo=${geo}&industry=${industry}`}
      />
      {/* Plan v14 Phase C.4: FAQPage JSON-LD. Five data-backed Q&As per cell,
         no visible DOM. Targets AI Overviews + Google People Also Ask. */}
      <FAQSchema faqs={faqs} />
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://www.marginatlas.com/" },
          { name: country.toUpperCase(), url: `https://www.marginatlas.com/${country}` },
          { name: cell.geo_name || geo, url: `https://www.marginatlas.com/${country}/${geo}` },
          { name: cell.industry_name || industry, url },
        ]}
      />
      {/* Visible adaptive breadcrumb (CC.10): distinct from the JSON-LD above.
         Plan v13 Wave 4a: country glyph is now an SVG <CountryFlag> via the
         iso2 field rather than the emoji glyph. */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: country.toUpperCase(),
            href: `/${country.toLowerCase()}`,
            iso2: country.toUpperCase(),
          },
          {
            label: cell.geo_name || geo,
            href: `/${country.toLowerCase()}/${geo}`,
          },
          { label: cell.industry_name || industry },
        ]}
      />

      {/* AA.6 staleness + AA.9 industry-mapping + Plan v10 WW cross-country chips */}
      <CellWarningChips
        year={cell.year}
        requestedIndustrySlug={industry}
        resolvedIndustryName={measuredIndustry?.name}
        resolvedIndustryUrl={
          measuredIndustry
            ? `/${country.toLowerCase()}/${geo}/${industryToSlug(measuredIndustry.id)}`
            : undefined
        }
        country={country.toUpperCase()}
        geoId={cell.geo_id}
        industryId={cell.industry_id}
        sizeBand={cell.size_band}
      />

      {/* Plan v13 Wave 4a (D2): EmptyStateCard removed. When a cell has no
         usable revenue metric, the data sections silently omit themselves
         (RevenueTiles, RevenueDistribution, MarginWaterfall all return null)
         and the nudge bar below still surfaces a stronger neighbor when one
         exists, so the page degrades without broadcasting brokenness. */}

      {/* Nudge bar: appears when coverage is weak and a stronger neighbor exists */}
      {nudge && cell.revenue_per_firm != null && (
        <div className="mb-4 rounded-xl border border-atlas-300 bg-atlas-100/60 px-4 py-2.5 text-sm flex items-center gap-2 flex-wrap">
          <span aria-hidden>🧭</span>
          <span className="text-ink-900">
            Stronger data for{" "}
            <strong>{cell.industry_name || industry.replace(/-/g, " ")}</strong> exists in{" "}
            <strong>{nudge.geo_name}</strong>.
          </span>
          <a
            href={nudge.url}
            className="ml-auto text-atlas-700 hover:text-atlas-900 font-medium"
          >
            See {nudge.geo_name} →
          </a>
        </div>
      )}

      {/* Audience caveat (sub-niche borrowing, mixed-bimodal, or corp_only) */}
      {(usingParentData ||
        requestedIndustry?.audience === "mixed_caution" ||
        requestedIndustry?.audience === "corp_only") && (
        <div className="mb-4">
          <AudienceCaveat industry={requestedIndustry} usingParentData={usingParentData} />
        </div>
      )}

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
        <a href={`/${country}`} className="hover:text-atlas-600 inline-flex items-center gap-1">
          <CountryFlag iso2={country} className="w-4" />
          <span>{iso2ToName(country)}</span>
        </a>
        <span className="mx-2">/</span>
        <a href={`/${country}/${geo}`} className="hover:text-atlas-600 capitalize">{geo.replace(/-/g, " ")}</a>
        <span className="mx-2">/</span>
        <span className="capitalize">
          {cell.industry_name || industry.replace(/-/g, " ")}
        </span>
      </nav>

      {/* In-page dimension switcher: region/industry/size/year */}
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

      {/* Hero: Plan v14 A.1 (T-A1.3): canonical ink-dark tone applied.
         Text colors flipped to cream/atlas-light variants so they remain
         legible on the bg-ink-900 surface. The accented industry name in
         the headline becomes atlas-300 (warmer, more visible on dark) and
         the "typical revenue" line keeps the same emphasis structure but
         in the cream family. Note: id="headline" preserved: CellPageNav
         still anchors against it. */}
      <section id="hero" className={`py-8 ${getToneClass("hero")}`}>
        <header id="headline" className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-8 lg:items-start">
          <div>
            <div className="text-xs uppercase tracking-wide text-cream-300/80 font-medium flex items-center gap-2">
              {cell.sector_name && <>{cell.sector_name} · </>}
              <CountryFlag iso2={country} className="w-5" />
              <span>{cell.geo_name || iso2ToName(country)}</span>
            </div>
            <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-cream-50">
              How much do <span className="text-atlas-300">{(cell.industry_name || "businesses").toLowerCase()}</span> earn in {cell.geo_name}?
            </h1>
            {cell.industry_examples && cell.industry_examples.length > 0 && (
              <p className="mt-2 text-sm text-cream-300/70">
                Includes: {cell.industry_examples.slice(0, 5).join(" · ")}
              </p>
            )}
            <p className="mt-4 text-lg text-cream-200/85 max-w-3xl leading-relaxed">
              A typical {(cell.industry_name || "firm").toLowerCase().replace(/s$/, "")} here brings in about{" "}
              <strong className="text-cream-50"><Money usd={cell.revenue_per_firm} /></strong> per year, employing roughly{" "}
              <strong className="text-cream-50">{cell.n_employees?.toLocaleString() || "-"}</strong> people in {cell.geo_name}.
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-cream-300/70">
              <span>Show numbers in:</span>
              <CurrencySwitcher />
            </div>
          </div>
          <div className="hidden lg:block">
            {/* Plan v12 IM8: real photo when manifest has one for this
                cell's (city, industry); falls back to SmartImage glyph. */}
            <AtlasHeroImage
              image={pickCellHeroImage(geo, cell.industry_id || null, cell.sector_id || null)}
              alt={`${cell.industry_name || "Industry"} in ${cell.geo_name}`}
              glyph={(cell.sector_id && SECTOR_BY_ID[cell.sector_id]?.icon) || "🏢"}
              caption={cell.sector_name || "Industry"}
              aspectRatio={1.5}
            />
          </div>
        </header>
      </section>

      {/* Plan v14 Phase B: per-cell editorial narrative. Renders only
         when a cached narrative exists for this cell (with fallback to
         the "total" size-band); otherwise the section silently omits
         itself (Wave 4a D2). 2 paragraphs, ~120-180 words, opens with
         the SEO keyphrase pattern. */}
      {narrative ? (
        <section id="narrative" className={`py-8 ${getToneClass("narrative")}`}>
          <div className="max-w-3xl">
            <p className="text-base md:text-lg leading-relaxed text-ink-900 whitespace-pre-line">
              {narrative}
            </p>
          </div>
        </section>
      ) : null}

      {/* Headline grid.
         Plan v14 A.1 (T-A1.4): legacy id="stats" renamed to canonical
         "revenue-tiles": direct SECTION_TONES lookup, no mapping layer. */}
      <section id="revenue-tiles" className={`grid grid-cols-1 md:grid-cols-3 gap-4 py-6 ${getToneClass("revenue-tiles")}`}>
        <Stat
          label="People working"
          value={cell.n_employees?.toLocaleString() || "-"}
          yoy={yoy.n_employees}
        />
        <Stat
          label="Typical yearly revenue"
          value={formatMoney(cell.revenue_per_firm)}
          tooltip="The middle firm: half make more, half make less. Often called the median."
          yoy={yoy.revenue_per_firm}
        />
        <Stat
          label="Wage per employee"
          value={formatMoney(cell.payroll_per_employee)}
          tooltip="Average annual pay across all employees in this industry."
          yoy={yoy.payroll_per_employee}
        />
      </section>

      {/* Atlas Score + Typical-firm biography card.
         Plan v14 A.1 (T-A1.4): legacy id="typical-firm" renamed to canonical
         "tax-and-cost-panel": section hosts PostTaxToggle +
         NetProfitWaterfall + MarginWaterfall. */}
      <section id="tax-and-cost-panel" className={`py-6 grid md:grid-cols-[1fr_2fr] gap-4 ${getToneClass("tax-and-cost-panel")}`}>
        <AtlasScore cell={cell} />
        <div>
          <TypicalFirmCard cell={cell} currencySymbol="$" />
          <PostTaxToggle
            country={country}
            regionId={cell.geo_id || geo}
            grossRevenue={cell.revenue_per_firm ?? cell.rev_p50 ?? null}
            payroll={
              cell.payroll_per_employee != null && cell.n_employees != null && cell.n_enterprises
                ? (cell.payroll_per_employee * cell.n_employees) / cell.n_enterprises
                : null
            }
          />
          {/* Plan v10 net-profit waterfall (TT + UU + ZZ) */}
          <NetProfitWaterfall
            iso2={country.toUpperCase()}
            geoId={cell.geo_id || geo}
            industryId={cell.industry_id || null}
            sectorId={cell.sector_id || null}
            grossRevenue={cell.revenue_per_firm ?? cell.rev_p50 ?? null}
            payroll={
              cell.payroll_per_employee != null && cell.n_employees != null && cell.n_enterprises
                ? (cell.payroll_per_employee * cell.n_employees) / cell.n_enterprises
                : null
            }
          />
          {/* Plan v13 Wave 2: profit waterfall integrity visual.
             Gross + operating from industry lookup, net from the
             estimateNetProfit() call above. All three pass through
             clampMargin inside the component. */}
          <MarginWaterfall
            grossMargin={marginRow.gross_margin ?? null}
            operatingMargin={marginRow.operating_margin ?? null}
            netMargin={computedNetMargin}
          />
        </div>
      </section>

      {/* Plan v13 Wave 2: Bottom 20% / Median / Top 10% revenue tiles +
         smooth log-normal distribution curve. Replaces the prior
         histogram + 5-bar tier view.
         Plan v14 A.1 (T-A1.4): legacy id="distribution" renamed to canonical
         "revenue-distribution". Tone stays mapped to "margin-waterfall"
         (cream-100) to extend the visible alternation across this band. */}
      <section id="revenue-distribution" className={`py-6 ${getToneClass("margin-waterfall")}`}>
        <RevenueTiles
          p10={cell.rev_p10 ?? null}
          p20={null}
          p50={cell.rev_p50 ?? null}
          p90={cell.rev_p90 ?? null}
          currencySymbol="$"
        />
        <RevenueDistribution
          p10={cell.rev_p10 ?? null}
          p25={cell.rev_p25 ?? null}
          p50={cell.rev_p50 ?? null}
          p75={cell.rev_p75 ?? null}
          p90={cell.rev_p90 ?? null}
          currencySymbol="$"
        />
      </section>

      {/* Plan v13 Wave 1: time series chart removed:
         multi-year coverage is too uneven across cells to display honestly. */}

      {/* Plan v13 Wave 1 follow-up: Data Quality section removed.
         The 10/10 confidence score and ★★★★★ rating exposed engineering
         provenance the founder explicitly said never to display. */}

      {/* Same industry across states (US) or countries (non-US) */}
      <div id="across-states" />
      {isUsCell && (
        <AcrossStatesStrip
          industryName={cell.industry_name || industry.replace(/-/g, " ")}
          currentGeoName={cell.geo_name || geo}
          cells={acrossStates}
        />
      )}
      {!isUsCell && (
        <AcrossCountriesStrip
          industryName={cell.industry_name || industry.replace(/-/g, " ")}
          currentCountryName={cell.geo_name || geo}
          cells={acrossCountries}
        />
      )}

      {/* Comparable cells.
         Plan v14 A.1 (T-A1.4): legacy id="comparable" renamed to canonical
         "related-cells". */}
      {comparables.length > 0 && (
        <section id="related-cells" className={`py-8 ${getToneClass("related-cells")}`}>
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
                className="block px-4 py-3 rounded-xl border border-parchment bg-white hover:border-atlas-500 transition"
              >
                <div className="text-sm font-medium text-ink-900 line-clamp-1">
                  {c.industry_name || c.industry_description || c.naics_6}
                </div>
                <div className="text-xs text-ink-700/70 mt-1">
                  {formatMoney(c.revenue_per_firm)} typical revenue
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Related industries (sibling sector links): DD.4 internal linking */}
      {measuredIndustry?.sector_id ? (
        <RelatedIndustriesStrip
          country={country}
          geo={geo}
          currentIndustryId={measuredIndustry.id}
          sectorId={measuredIndustry.sector_id}
        />
      ) : null}

      {/* Send a correction */}
      <CorrectionForm cellUrl={`/${country}/${geo}/${industry}`} />

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
        <span
          className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
            yoy >= 0
              ? "bg-moss-100 text-moss-700"
              : "bg-clay-100 text-clay-700"
          }`}
          title="Year-over-year change"
        >
          <span>{yoy >= 0 ? "▲" : "▼"}</span>
          <span>
            {yoy >= 0 ? "+" : ""}
            {(yoy * 100).toFixed(1)}% YoY
          </span>
        </span>
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
  if (v == null || isNaN(v)) return "-";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}
