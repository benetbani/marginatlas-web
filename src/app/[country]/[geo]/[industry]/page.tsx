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
// Plan v30 Phase 1 — MarginWaterfall import removed; redundant with SmartWaterfall
import { Tooltip } from "@/components/Tooltip";
import { DimensionSwitcher } from "@/components/DimensionSwitcher";
import { TypicalFirmCard } from "@/components/TypicalFirmCard";
import { PostTaxToggle } from "@/components/PostTaxToggle";
import { NetProfitWaterfall } from "@/components/NetProfitWaterfall";
import { AcrossStatesStrip } from "@/components/AcrossStatesStrip";
import { CellPageNav } from "@/components/CellPageNav";
// Plan v30 Phase 1 — CellActions import removed (save/copy/CSV/embed buttons stripped)
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
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import { HeroBenchmark } from "@/components/HeroBenchmark";
import DenseCellHero from "@/components/DenseCellHero";
import { CityHero } from "@/components/CityHero";
import { ComparableCitiesRibbon } from "@/components/ComparableCitiesRibbon";
import { LocalContextCard } from "@/components/LocalContextCard";
// Plan v30 Phase 1 — TrendSparkline import removed; synthesized 5-year trend was too speculative
import { DistributionVisual } from "@/components/DistributionVisual";
import { NetProfitSummary } from "@/components/NetProfitSummary";
import { SmartWaterfall } from "@/components/SmartWaterfall";
import { CellFallbackBanner } from "@/components/CellFallbackBanner";
import { EstimatedBadge } from "@/components/EstimatedBadge";
import { CoverageIndicator, deriveCoverageTier } from "@/components/CoverageIndicator";
import { EditorialNote } from "@/components/EditorialNote";

type IndustryMarginRow = { gross_margin: number; operating_margin: number; asset_intensity?: number };
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

// Plan v19 Block A — S-100 implemented. The server page no longer reads
// searchParams; size/year selection is handled by the DimensionSwitcher
// client component via useSearchParams. This drops the
// DYNAMIC_SERVER_USAGE classification that R-003 caused and restores
// edge caching: Vercel was overriding our middleware Cache-Control
// header with `private, no-cache, no-store` because of force-dynamic.
// Now the route is ISR-friendly with a 6h revalidate, so first hit
// fills the edge cache and subsequent hits serve from CDN.
export const revalidate = 21600;
export const dynamicParams = true;
// Plan v26 follow-up — raise function timeout from 10s default to 60s
// so cold-start cells_master queries don't drop the request. After the
// index migration on regional_cells / cells_master this returns to <2s
// per request and the override becomes irrelevant.
export const maxDuration = 60;

type Params = { country: string; geo: string; industry: string };

/**
 * Plan v22 Block D1 — pre-render the top 200 highest-traffic cells at
 * build time. Doubled from 100. First visitors to these URLs pay no
 * Supabase cost; subsequent visitors get edge-cached responses.
 */
export async function generateStaticParams(): Promise<Params[]> {
  try {
    const top = await getTopCells(200);
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
}: {
  params: Promise<Params>;
}) {
  const { country, geo, industry } = await params;
  // Plan v19 Block A / S-100 — server renders the default cell (no
  // size/year filter). The DimensionSwitcher (client component) reads
  // searchParams via useSearchParams and triggers a client-side data
  // refresh through /api/cell-lookup when the user picks a different
  // size or year. Server stays ISR-cacheable.
  const currentSize: string | null = null;
  const currentYear: number | null = null;

  const [cell, variants] = await Promise.all([
    getCellBySlug(country, geo, industry, {
      sizeBand: currentSize,
      year: currentYear,
    }),
    getCellVariants(country, geo, industry),
  ]);
  if (!cell) notFound();
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
  //
  // Plan v30 Phase 2 — unit-detection fix. cell.n_employees can be either
  // total employees across all firms in the region (so divide by
  // n_enterprises for per-firm) OR already per-firm (some data sources).
  // Detect by the ratio: if n_employees < n_enterprises, it's already
  // per-firm. Using the wrong unit drives payroll to near-zero, which
  // inflated net margin past the cap on hospitality pages.
  const marginRow = lookupIndustryMargin(cell.industry_id);
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  let payrollForMargin: number | null = null;
  if (cell.payroll_per_employee != null && cell.n_employees != null) {
    const empPerFirm =
      cell.n_enterprises && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises
          ? cell.n_employees // already per-firm
          : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    const effectiveEmpPerFirm = Math.max(1, empPerFirm);
    payrollForMargin = cell.payroll_per_employee * effectiveEmpPerFirm;
  }
  const netProfitResult =
    grossRevenueForMargin && grossRevenueForMargin > 0
      ? estimateNetProfit({
          iso2: country.toUpperCase(),
          geoId: cell.geo_id || geo,
          industryId: cell.industry_id || null,
          sectorId: cell.sector_id || null,
          grossRevenue: grossRevenueForMargin,
          payroll: payrollForMargin,
        })
      : null;
  const rawNetMargin = netProfitResult?.net_margin ?? null;
  const netTakeHome = netProfitResult?.net_profit ?? null;
  // Defensive floor — never let a sub-3% net margin reach the page.
  const computedNetMargin = rawNetMargin != null ? clampMargin(rawNetMargin, "net", cell.industry_id || null) : null;

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
    // Plan v25 Block 9 — wider gap between content and right TOC.
    // Was xl:gap-6 (24px). Founder: "shift more to the right".
    <div className="xl:flex xl:gap-16">
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

      {/* Plan v30 Phase 1 — CellActions (save / copy link / CSV / embed)
          removed. These features were shipped before the underlying data
          was trustworthy; reintroduce only when there's a defensible
          export and a working auth path for saved cells. */}

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

      {/* Reformation idea #1 — wide cinematic city photo (Unsplash),
         duotone-tinted to Atlas amber. Only renders for cities with a
         cached hero (Tier 1+2). Quiet fallthrough for others. */}
      <CityHero
        citySlug={geo}
        altOverride={`${cell.geo_name || geo} - ${cell.industry_name || industry}`}
      />

      {/* Plan v30 Phase 4 — DenseCellHero. Replaces the previous
          HeroBenchmark with a tight first frame packing every key data
          point above the fold. Coverage chip, sector tag, headline
          question, hero number, percentile band, and one-liner stats
          all in ~55vh on desktop and ~100vh on mobile. */}
      {(() => {
        const industryName = cell.industry_name || industry.replace(/-/g, " ");
        const subniches = (cell.industry_examples ?? []).slice(0, 4).join(" · ") || industryName;
        const question = `How much does a ${industryName.toLowerCase().replace(/s$/, "")} make in ${cell.geo_name || iso2ToName(country) || country.toUpperCase()}?`;
        const typical = cell.revenue_per_firm ?? cell.rev_p50 ?? 0;
        const p10 = cell.rev_p10 ?? typical * 0.32;
        const p90 = cell.rev_p90 ?? typical * 2.6;
        // Employee count: handle unit-detection (Plan v30 Phase 2).
        let empPerFirm = 1;
        if (cell.n_employees && cell.n_employees > 0) {
          if (cell.n_enterprises && cell.n_enterprises > 0 && cell.n_employees >= cell.n_enterprises) {
            empPerFirm = Math.max(1, Math.round(cell.n_employees / cell.n_enterprises));
          } else {
            empPerFirm = Math.max(1, Math.round(cell.n_employees));
          }
        }
        const heroCoverageTier = deriveCoverageTier(cell);
        const atlasScore = Math.max(0, Math.min(100, Math.round(cell.quality_score ?? 60)));
        return typical > 0 ? (
          <DenseCellHero
            industryName={industryName}
            industrySubniches={subniches}
            sectorId={cell.sector_id || "other_local"}
            sectorLabel={(cell.sector_name || "Industry").toUpperCase()}
            iso2={country.toUpperCase()}
            countryName={iso2ToName(country) || country.toUpperCase()}
            geoName={cell.geo_name || iso2ToName(country) || country.toUpperCase()}
            question={question}
            typicalRevenue={typical}
            p10Revenue={p10}
            p90Revenue={p90}
            employees={empPerFirm}
            medianWage={cell.payroll_per_employee ?? 30000}
            netMargin={computedNetMargin ?? 0.08}
            atlasScore={atlasScore}
            coverageTier={heroCoverageTier}
          />
        ) : (
          // Fallback to the legacy hero if revenue is missing entirely.
          <HeroBenchmark
            iso2={country.toUpperCase()}
            countryName={iso2ToName(country) || country.toUpperCase()}
            geoName={cell.geo_name || iso2ToName(country) || country.toUpperCase()}
            industryName={industryName}
            industryExamples={cell.industry_examples}
            sectorName={cell.sector_name || null}
            revenue={cell.revenue_per_firm ?? null}
            currencySymbol="$"
          />
        );
      })()}
      {/* Plan v30 Phase 1 — currency switcher only. The 5-year trend
          sparkline was removed: applying a synthesized CAGR to revenue
          gives the wrong impression of measured forecasting. Revive
          only when the trend model is calibrated against real data. */}
      <div className="bg-cream-100 pb-6 md:pb-8 -mt-2 flex items-center gap-4 flex-wrap text-xs text-cocoa-700/70">
        <div className="flex items-center gap-2">
          <span>Show numbers in:</span>
          <CurrencySwitcher />
        </div>
      </div>

      {/* Plan v24 Block 3 — substitution disclosure. Renders only when
          the PARENT_FALLBACK_MAP walked from the requested industry to
          a different one, so the user knows the numbers are from a
          comparable category, not direct measurement. */}
      {requestedIndustry && cell.industry_name && requestedIndustry.name.toLowerCase() !== cell.industry_name.toLowerCase() ? (
        <CellFallbackBanner
          requestedIndustryName={requestedIndustry.name}
          actualIndustryName={cell.industry_name}
          actualIndustryHref={cell.industry_id ? `/industries/${cell.industry_id.replace(/_/g, "-")}` : null}
        />
      ) : null}

      {/* Plan v27 Lane B — universal coverage indicator. Replaces the
          old EstimatedBadge; communicates one of four tiers (measured /
          regional / estimated / modeled) with a single vocabulary. */}
      <section className="py-2">
        <CoverageIndicator
          tier={deriveCoverageTier(cell)}
          variant="expanded"
          industryName={cell.industry_name}
          geoName={cell.geo_name}
        />
      </section>

      {/* Plan v28 Lane D — editorial voice. One paragraph of context
          between the headline and the data so the page reads like a
          narrative, not just a dump. */}
      <EditorialNote
        industryId={cell.industry_id}
        sectorId={cell.sector_id}
        iso2={country.toUpperCase()}
      />

      {/* Plan v23 Part 3 — narrative now reads as editorial prose. Drop
         cap on the first paragraph, looser line-height, max-w-prose. */}
      {narrative ? (
        <section id="narrative" className={`py-12 md:py-16 ${getToneClass("narrative")}`}>
          <div className="max-w-prose">
            <p className="text-lg md:text-xl leading-[1.7] text-ink-900 whitespace-pre-line first-letter:font-display first-letter:text-6xl md:first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-atlas-700">
              {narrative}
            </p>
          </div>
        </section>
      ) : null}

      {/* Plan v19 Block B — fill rule. Headline tiles fall back to
         extrapolations when source data is null. People-working uses
         n_enterprises × industry-typical headcount/firm. Wage uses
         country median × industry multiplier. Tiles only suppress
         themselves when even the extrapolation can't produce a number.
         No more blank "-" tiles per founder rule. */}
      {(() => {
        const employeesEstimate =
          cell.n_employees ?? estimateEmployeesFromFirms(cell.industry_id, cell.n_enterprises);
        const employeesIsEstimate = cell.n_employees == null && employeesEstimate != null;
        const wageEstimate =
          cell.payroll_per_employee ?? estimateWagePerEmployee(country, cell.industry_id);
        const wageIsEstimate = cell.payroll_per_employee == null && wageEstimate != null;
        return (
          <section id="revenue-tiles" className={`grid grid-cols-1 md:grid-cols-3 gap-4 py-6 ${getToneClass("revenue-tiles")}`}>
            {employeesEstimate != null ? (
              <Stat
                label={employeesIsEstimate ? "People working (estimate)" : "People working"}
                value={employeesEstimate.toLocaleString()}
                yoy={yoy.n_employees}
              />
            ) : null}
            <Stat
              label="Typical yearly revenue"
              value={formatMoney(cell.revenue_per_firm)}
              tooltip="The middle firm: half make more, half make less. Often called the median."
              yoy={yoy.revenue_per_firm}
            />
            {wageEstimate != null ? (
              <Stat
                label={wageIsEstimate ? "Wage per employee (estimate)" : "Wage per employee"}
                value={formatMoney(wageEstimate)}
                tooltip="Average annual pay across all employees in this industry."
                yoy={yoy.payroll_per_employee}
              />
            ) : null}
          </section>
        );
      })()}

      {/* Atlas Score + Typical-firm biography card.
         Plan v14 A.1 (T-A1.4): legacy id="typical-firm" renamed to canonical
         "tax-and-cost-panel": section hosts PostTaxToggle +
         NetProfitWaterfall + MarginWaterfall. */}
      {/* Plan v30 quick-win — AtlasScore demoted from full card to
          single-row chip-style strip. Frees the left rail; ATLAS
          composite score still visible but no longer dominating. */}
      <section id="tax-and-cost-panel" className={`py-6 ${getToneClass("tax-and-cost-panel")}`}>
        <div className="mb-4">
          <AtlasScore cell={cell} />
        </div>
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
          {/* Plan v23 Part 2 — collapsed by default. Single-line take-home
              figure. Expand to reveal the full waterfall on demand. */}
          <NetProfitSummary
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
            takeHome={netTakeHome}
          />
          {/* Plan v30 Phase 1 — legacy MarginWaterfall removed. It only
              surfaced a single gross-margin band, which was redundant
              and confusing alongside the SmartWaterfall below that
              decomposes every cost line with provenance. */}
        </div>
      </section>

      {/* Plan v29 Phase 4+7 — Smart Waterfall with per-line provenance,
          confidence ratings, and "what changes here" sidebar. Reads from
          the 196-country Country Economic Profile + Industry Cost Profile
          + Industry × Country modifier matrix. */}
      {cell.revenue_per_firm && cell.revenue_per_firm > 0 && cell.industry_id ? (
        <SmartWaterfall
          iso2={country.toUpperCase()}
          industryId={cell.industry_id}
          sizeBand="medium"
          grossRevenue={cell.revenue_per_firm}
        />
      ) : null}

      {/* Plan v23 Part 2 — single visual distribution band replaces the
         previous tile-grid + log-normal-curve combo. One image to look
         at instead of a number-slap. */}
      <section id="revenue-distribution" className={`py-6 ${getToneClass("margin-waterfall")}`}>
        <DistributionVisual
          p10={cell.rev_p10 ?? null}
          p50={cell.rev_p50 ?? null}
          p90={cell.rev_p90 ?? null}
        />
      </section>

      {/* Reformation idea #5 — local cost-of-living context anchor.
         Gives a frame for reading the revenue numbers against the
         local economy: median wage, price tier, currency, market
         type. Same data the synthesis engine uses (so estimated
         cells stay coherent). */}
      <LocalContextCard
        iso2={country.toUpperCase()}
        countryName={iso2ToName(country) || country.toUpperCase()}
      />

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

      {/* Reformation idea #4 — comparable-cities ribbon. Sends users
         to 3 peer cities (similar scale, often different country)
         for the same industry. Renders only if seed city is in
         data/cities/city_list_v1.json (silent otherwise). */}
      <ComparableCitiesRibbon
        citySlug={geo}
        industrySlug={industry}
        industryName={cell.industry_name || undefined}
      />

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

      {/* Plan v30 quick-win — knowledge base footer link. Maps the
          industry to a relevant /learn/ article so visitors can dive
          deeper into the category context. */}
      {cell.industry_id ? (
        <section className="py-8 border-t border-parchment mt-4">
          <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold mb-2">
            Read more
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`/learn/how-much-does-a-${(cell.industry_name || cell.industry_id).toLowerCase().replace(/s$/, "").replace(/\s+/g, "-").replace(/-+/g, "-")}-make`}
              className="block rounded-lg border border-parchment bg-cream-50 hover:bg-cream-100 p-4 transition-colors"
            >
              <div className="text-sm font-semibold text-ink-900">
                How much does a {(cell.industry_name || "business").toLowerCase().replace(/s$/, "")} make?
              </div>
              <div className="text-xs text-cocoa-700/70 mt-1">
                Read the explainer →
              </div>
            </a>
            <a
              href="/about-data"
              className="block rounded-lg border border-parchment bg-cream-50 hover:bg-cream-100 p-4 transition-colors"
            >
              <div className="text-sm font-semibold text-ink-900">
                How to read these numbers
              </div>
              <div className="text-xs text-cocoa-700/70 mt-1">
                Open the data guide →
              </div>
            </a>
          </div>
        </section>
      ) : (
        <section className="py-6 text-sm text-ink-700/70">
          <a href="/about-data" className="hover:text-atlas-600 underline">
            About how to read these numbers →
          </a>
        </section>
      )}
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
