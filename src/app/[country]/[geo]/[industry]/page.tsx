import { notFound } from "next/navigation";
import {
  getCellBySlug,
  getCellVariants,
  getComparableCells,
  getTopCells,
  getSameIndustryAcrossStates,
  getNudgeNeighbor,
  cellUrl,
  slugify,
  distinctSizeBands,
  distinctYears,
  buildTimeSeries,
  listUsStates,
  withBudget,
} from "@/lib/cells";
import { INDUSTRIES, industryToSlug } from "@/lib/taxonomy";
import { computeBreakeven, fmtAov, fmtOrders } from "@/lib/economics/breakeven";
import { getCityTier } from "@/lib/cities/city_tier";
import { ProgressBar } from "@/components/ui/progress-bar";
import { iso2ToName } from "@/lib/countries";
import { CountryFlag } from "@/components/CountryFlag";
import { RevenueTiles } from "@/components/RevenueTiles";
import { RevenueDistribution } from "@/components/RevenueDistribution";
// MarginWaterfall import removed; redundant with SmartWaterfall
import { Tooltip } from "@/components/Tooltip";
import { DimensionSwitcher } from "@/components/DimensionSwitcher";
import { TypicalFirmCard } from "@/components/TypicalFirmCard";
import { PostTaxToggle } from "@/components/PostTaxToggle";
import { NetProfitWaterfall } from "@/components/NetProfitWaterfall";
import { AcrossStatesStrip } from "@/components/AcrossStatesStrip";
import { CellPageNav } from "@/components/CellPageNav";
// CellActions import removed (save/copy/CSV/embed buttons stripped)
import { AtlasScore } from "@/components/AtlasScore";
import { SmartImage } from "@/components/SmartImage";
import { AudienceCaveat } from "@/components/AudienceCaveat";
import { SECTOR_BY_ID, INDUSTRY_BY_ID, slugToIndustry, resolveToMeasuredIndustry } from "@/lib/taxonomy";
import { CellDataset, Breadcrumbs } from "@/components/StructuredData";
import { RelatedIndustriesStrip } from "@/components/RelatedIndustriesStrip";
import { getToneClass } from "@/lib/page-layout/section-order";
import { SectionEmpty } from "@/components/sections/SectionEmpty";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CellWarningChips } from "@/components/CellWarningChips";
// EmptyStateCard import removed; we degrade silently now.
// import { EmptyStateCard } from "@/components/EmptyStateCard";
// CorrectionForm is a heavy client form at the very
// bottom of every cell page. Maybe 0.1% of visitors ever click "Send a
// correction"; meanwhile its JS shipped with every cell page load.
// Dynamic import code-splits it into its own chunk that only loads if
// the section is reached. No visible behavior change.
import dynamic from "next/dynamic";
const CorrectionForm = dynamic(
  () => import("@/components/CorrectionForm").then((m) => ({ default: m.CorrectionForm })),
  { loading: () => null },
);
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { Money } from "@/components/Money";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { clampMargin } from "@/lib/finance/margin_floor";
import { generateFAQs } from "@/lib/seo/faq_generator";
import { FAQSchema } from "@/components/FAQSchema";
import { getCellNarrative } from "@/lib/content/narratives";
import { getComparativeLead } from "@/lib/content/comparative_narratives";
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import { HeroBenchmark } from "@/components/HeroBenchmark";
import DenseCellHero from "@/components/DenseCellHero";
import MobileCellHero from "@/components/mobile/MobileCellHero";
import { CityHero } from "@/components/CityHero";
import { ComparableCitiesRibbon } from "@/components/ComparableCitiesRibbon";
import { LocalContextCard } from "@/components/LocalContextCard";
// TrendSparkline import removed; synthesized 5-year trend was too speculative
import { DistributionVisual } from "@/components/DistributionVisual";
// Reverted 2026-05-25: QuartileMarkers + gateValue temporarily removed
// pending diagnosis of cell-page load failure. Re-add once the root
// cause is found and isolated.
// import { QuartileMarkers } from "@/components/monetization";
// import { gateValue } from "@/lib/monetization/viewer_tier";
import { NetProfitSummary } from "@/components/NetProfitSummary";
import { SmartWaterfall } from "@/components/SmartWaterfall";
import { CellFallbackBanner } from "@/components/CellFallbackBanner";
// Sanity-§8: EstimatedBadge purged; CoverageIndicator stays for its
// compact (HowWeKnowThis) variant only.
import { CoverageIndicator, deriveCoverageTier } from "@/components/CoverageIndicator";
import { EditorialNote } from "@/components/EditorialNote";
// Industry deepening sections. All three self-suppress
// when their data isn't on the cell, so they're safe to mount before any
// cell has been deepened (Phase 1 will populate the data).
import { SubIndustryPicker } from "@/components/sections/SubIndustryPicker";
import { SetupCostBlock } from "@/components/sections/SetupCostBlock";
import { AnnualCostStack } from "@/components/sections/AnnualCostStack";
// Plan v32 Sprint G Tier-1 features. Each self-suppresses when its
// supporting data is absent (industries without operating-units data,
// without failure-modes coverage, without setup_costs).
import { TangibleUnits } from "@/components/sections/TangibleUnits";
import { KeyBenchmarkBanner } from "@/components/sections/KeyBenchmarkBanner";
import { AuPrimaryDataBadge } from "@/components/AuPrimaryDataBadge";
import { FailureModes } from "@/components/sections/FailureModes";
// Reverted: InlineMidArticle temporarily removed.
// import { InlineMidArticle } from "@/components/newsletter/NewsletterSignupVariants";
import { IfYouOpenedToday } from "@/components/sections/IfYouOpenedToday";
import {
  NeighborhoodOverview,
  findNeighborhoodContext,
} from "@/components/NeighborhoodOverview";

type IndustryMarginRow = { gross_margin: number; operating_margin: number; asset_intensity?: number };
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

// S-100 implemented. The server page no longer reads
// searchParams; size/year selection is handled by the DimensionSwitcher
// client component via useSearchParams. This drops the
// DYNAMIC_SERVER_USAGE classification that R-003 caused and restores
// edge caching: Vercel was overriding our middleware Cache-Control
// header with `private, no-cache, no-store` because of force-dynamic.
// Revalidate bumped from 6h to 24h. Cell data does
// not change hourly; bumping reduces ISR cold-start frequency by 4x
// and saves Supabase round-trips. After bulk cost-stack imports the
// data is even more stable so this is safe.
// Now the route is ISR-friendly with a 24h revalidate, so first hit
// fills the edge cache and subsequent hits serve from CDN.
export const revalidate = 86400;
export const dynamicParams = true;
// Raise function timeout from 10s default to 60s
// so cold-start cells_master queries don't drop the request. After the
// index migration on regional_cells / cells_master this returns to <2s
// per request and the override becomes irrelevant.
export const maxDuration = 60;

type Params = { country: string; geo: string; industry: string };

/**
 * Pre-render a curated ~20 highest-traffic cells at
 * build time. The v30 hotfix removed pre-rendering entirely to fix
 * an OOM during build. Vercel Pro + Supabase Pro now have enough
 * headroom to safely pre-render a small focused set without
 * triggering OOM. Everything else still ISR on demand.
 *
 * Selection rules:
 *   1. The six FEATURED tiles on the homepage (must be fast on
 *      homepage click-through).
 *   2. The most-likely top organic traffic targets: California /
 *      NYC / Texas / Florida restaurants, top EU countries
 *      restaurants, GB cafes, top pilot industries on California.
 *
 * Each pre-rendered URL serves instantly from the edge CDN with
 * zero Supabase round-trip on first visit. Every other cell is
 * ISR via revalidate above; first visit triggers a 1-3s render,
 * subsequent visits cached.
 */
export async function generateStaticParams(): Promise<Params[]> {
  return [
    // The 6 FEATURED tiles from the homepage. Kept in sync manually
    // with src/app/page.tsx FEATURED array.
    { country: "us", geo: "california", industry: "software-development" },
    { country: "gb", geo: "gb",         industry: "legal-services" },
    { country: "de", geo: "de21",       industry: "fabricated-metal-mfg" },
    { country: "es", geo: "es511",      industry: "restaurants" },
    { country: "mx", geo: "mx-roo",     industry: "hotels-lodging" },
    { country: "us", geo: "california", industry: "restaurants" },

    // Top US states x highest-traffic industries.
    { country: "us", geo: "new-york",   industry: "restaurants" },
    { country: "us", geo: "texas",      industry: "restaurants" },
    { country: "us", geo: "florida",    industry: "restaurants" },
    { country: "us", geo: "california", industry: "cafes-coffee" },
    { country: "us", geo: "california", industry: "hairdressers-beauty" },
    { country: "us", geo: "california", industry: "auto-repair-shops" },
    { country: "us", geo: "california", industry: "hotels-lodging" },
    { country: "us", geo: "california", industry: "legal-services" },

    // Top non-US countries x restaurants (cross-country compare destinations).
    { country: "gb", geo: "gb",         industry: "restaurants" },
    { country: "gb", geo: "gb",         industry: "cafes-coffee" },
    { country: "de", geo: "de",         industry: "restaurants" },
    { country: "fr", geo: "fr",         industry: "restaurants" },
    { country: "it", geo: "it",         industry: "restaurants" },
    { country: "jp", geo: "jp",         industry: "restaurants" },
  ];
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

  // Neighborhood-overview dispatch.
  //
  // The URL /[country]/[geo]/[industry] is also the home of the
  // neighborhood-landing page (e.g. /us/los-angeles/santa-monica).
  // Next.js App Router refuses to have two different param names at
  // the same depth, so a single route file handles both shapes and
  // dispatches based on a fast in-memory lookup.
  //
  // If (country, geo, industry) matches a known (country, city,
  // neighborhood) triple in neighborhoods_v1.json, render the
  // overview UI and skip the cell-page DB chain entirely. Otherwise
  // fall through to the normal cell lookup below.
  const nbCtx = findNeighborhoodContext(country, geo, industry);
  if (nbCtx) {
    return <NeighborhoodOverview country={country} city={nbCtx.city} nb={nbCtx.nb} />;
  }
  // Server renders the default cell (no
  // size/year filter). The DimensionSwitcher (client component) reads
  // searchParams via useSearchParams and triggers a client-side data
  // refresh through /api/cell-lookup when the user picks a different
  // size or year. Server stays ISR-cacheable.
  const currentSize: string | null = null;
  const currentYear: number | null = null;

  // v34 sanity §3 cell-page hang fix. Every secondary fetch is now
  // wrapped in withBudget(). If any Supabase query is slow, the page
  // still renders with empty data for that section instead of hanging
  // the whole route until Vercel kills it at maxDuration=60s.
  const [cell, variants] = await Promise.all([
    getCellBySlug(country, geo, industry, {
      sizeBand: currentSize,
      year: currentYear,
    }),
    withBudget(getCellVariants(country, geo, industry), [], 5_000, "getCellVariants"),
  ]);
  if (!cell) notFound();
  const availableSizes = distinctSizeBands(variants);
  const availableYears = distinctYears(variants);
  const timeSeries = buildTimeSeries(variants);

  // YoY change for headline stats. Compares current year to prior year on the
  // same series.
  const yoy = computeYoY(timeSeries, cell.year);

  // Fan out the remaining data fetches concurrently. None block the others.
  // Every one wrapped in withBudget so a single slow query cannot hang the
  // entire page render.
  const isUsCell = country.toLowerCase() === "us";
  // Country-page rebuild §8 (2026-05-25): the cross-country fetch was
  // dropped because AcrossCountriesStrip no longer renders. Within-US
  // state comparison stays (same currency, same wage scale, real
  // Census coverage). Comparable-cells stays (peer-city ribbon).
  const [comparables, acrossStates, nudge] = await Promise.all([
    withBudget(
      getComparableCells(cell.geo_name || "", cell.naics_6 || undefined, 6),
      [],
      4_000,
      "getComparableCells",
    ),
    isUsCell
      ? withBudget(
          getSameIndustryAcrossStates(industry, cell.geo_id, 10),
          [],
          4_000,
          "getSameIndustryAcrossStates",
        )
      : Promise.resolve([]),
    withBudget(getNudgeNeighbor(cell), null, 4_000, "getNudgeNeighbor"),
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

  // Sub-project 1.2 (no dead sections): the revenue-distribution section is a
  // registered skeleton beat, so it must never render as an empty toned band.
  // DistributionVisual needs all three of p10/p50/p90 to draw a spread; when
  // any is missing we render SectionEmpty with onward links to cells that DO
  // have the full distribution (drawn from the already-fetched comparables).
  const hasDistribution =
    cell.rev_p10 != null && cell.rev_p50 != null && cell.rev_p90 != null;
  const distributionSuggestions = comparables.slice(0, 3).map((c) => ({
    label: `${c.industry_name ?? "Similar"} in ${c.geo_name ?? "nearby"}`,
    href: cellUrl(c),
  }));

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
  // Unit-detection fix. cell.n_employees can be either
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

  // FAQPage JSON-LD payload. The question text matches
  // the phrase universe (scripts/seo/build_phrase_universe.py), so any organic
  // search for "how much does a pharmacy make in California" surfaces this
  // page. Answers are derived live from the cell's revenue + margin numbers;
  // source-agency hygiene (R-002) is enforced inside the generator.
  const faqs = generateFAQs(cell, {
    gross_margin: marginRow.gross_margin,
    operating_margin: marginRow.operating_margin,
    net_margin: computedNetMargin,
  });

  // Per-cell editorial narrative (Haiku-generated bulk
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
    // Wider gap between content and right TOC.
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
          <>
            {/* Plan v30 Bundle 1 — mobile-specific hero rendered below md;
                desktop DenseCellHero rendered from md up. Both compiled,
                Tailwind shows/hides per viewport. */}
            <div className="md:hidden">
              <MobileCellHero
                sectorId={cell.sector_id || "other_local"}
                sectorLabel={(cell.sector_name || "Industry").toUpperCase()}
                geoName={cell.geo_name || iso2ToName(country) || country.toUpperCase()}
                countryName={iso2ToName(country) || country.toUpperCase()}
                question={question}
                industrySubniches={subniches}
                typicalRevenue={typical}
                p10Revenue={p10}
                p90Revenue={p90}
                coverageTier={heroCoverageTier}
                pickCountryHref="/world"
                browseIndustriesHref="/sectors"
              />
            </div>
            <div className="hidden md:block">
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
            </div>
          </>
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

      {/* Sanity-§8 — apologetic expanded CoverageIndicator banner
          removed. We now surface only a quiet inline methodology link
          via the compact variant; the hero already shows a coverage
          dot, so an additional banner reads as apology. */}
      <section className="py-2">
        <CoverageIndicator tier={deriveCoverageTier(cell)} variant="compact" />
      </section>

      {/* Plan v32 Sprint G — sub-industry picker. Renders only when the
         parent industry has at least one data_ready variant. Otherwise
         returns null and the page reads as before. */}
      <SubIndustryPicker cell={cell} />

      {/* Plan v28 Lane D — editorial voice. One paragraph of context
          between the headline and the data so the page reads like a
          narrative, not just a dump. */}
      <EditorialNote
        industryId={cell.industry_id}
        sectorId={cell.sector_id}
        iso2={country.toUpperCase()}
      />

      {/* Plan v32 Sprint G Tier-1 — "If you opened today" composition.
         Computes literal calendar dates for opening, first revenue,
         break-even, payback. Self-suppresses when setup_costs is
         absent (consultants etc.). */}
      <IfYouOpenedToday cell={cell} />

      {/* Plan v32 Sprint G — setup-cost block. Two boxes (registration
         + capital fit-out) shown above the revenue tiles. Renders only
         when the cell has setup_costs populated; consultants and
         single-shape independents naturally suppress themselves. */}
      <SetupCostBlock cell={cell} />

      {/* Plan v23 Part 3 — narrative now reads as editorial prose. Drop
         cap on the first paragraph, looser line-height, max-w-prose.
         Backend Phase 5 (2026-05-26): a comparative-voice lead is
         prepended above the cached prose, sourced from the
         comparative_narratives generator. The lead frames the section
         in the new voice ("Watch your X. Typical range is Y to Z.");
         the existing prose carries the wider context. The cached
         JSON is not regenerated, existing editorial content is
         preserved. */}
      {(() => {
        const lead = cell.industry_id ? getComparativeLead(cell.industry_id) : null;
        if (!narrative && !lead) return null;
        return (
          <section id="narrative" className={`py-12 md:py-16 ${getToneClass("narrative")}`}>
            <div className="max-w-prose">
              {lead && (
                <p className="text-base md:text-lg leading-[1.6] text-cocoa-700 mb-6 border-l-4 border-atlas-700 pl-4 italic">
                  {lead.sentence}
                </p>
              )}
              {narrative && (
                <p className="text-lg md:text-xl leading-[1.7] text-ink-900 whitespace-pre-line first-letter:font-display first-letter:text-6xl md:first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-atlas-700">
                  {narrative}
                </p>
              )}
            </div>
          </section>
        );
      })()}

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
        // Goldmines Wave 2 — pass the geo slug so cells in cities
        // covered by city_wage_premium_v1 use city-specific wages
        // instead of the country average. Cells in regions or states
        // ignore the city lookup and fall back to country.
        const wageEstimate =
          cell.payroll_per_employee ?? estimateWagePerEmployee(country, cell.industry_id, geo);
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

      {/* ATO Phase 2 — Key Benchmark banner. Surfaces ONE ratio per
         industry as the headline answer to "am I normal?". Sits at
         the top of the body so the reader sees the headline ratio
         before the distribution chart. */}
      <KeyBenchmarkBanner cell={cell} />

      {/* AU Phase 1c — primary data badge. Shown only when:
         - country is AU
         - industry maps to a parsed ATO entry
         - revenue classifies into a turnover band
         - NEXT_PUBLIC_AU_PRIMARY_DATA=1
         Silently absent otherwise. */}
      <div className="my-2">
        <AuPrimaryDataBadge cell={cell} />
      </div>

      {/* Plan v32 Sprint G Tier-1 — tangible units. Translates revenue
         into daily transactions + average ticket + texture note. */}
      <TangibleUnits cell={cell} />

      {/* Plan v32 Sprint G — annual cost stack. Eight-line breakdown of
         what the typical firm in this cell pays per year (rent, payroll,
         COGS, etc.). Suppressed when cost_stack is absent. */}
      <AnnualCostStack cell={cell} />

      {/* Distribution band. Moved above the tax/cost story (2026-05-30) so the
         page is distribution-first, matching the canonical cell skeleton
         (CELL_PAGE_SECTIONS in section-order.ts).
         Sub-project 1.2 (no dead sections): when the spread is missing,
         render an honest "not yet, see nearby" state instead of an empty
         toned band. DistributionVisual needs p10+p50+p90 to render. */}
      <section id="revenue-distribution" className={`py-6 ${getToneClass("revenue-distribution")}`}>
        {hasDistribution ? (
          <DistributionVisual
            p10={cell.rev_p10 ?? null}
            p50={cell.rev_p50 ?? null}
            p90={cell.rev_p90 ?? null}
          />
        ) : (
          <SectionEmpty
            title="Full distribution coming for this cell"
            body={`We have a typical figure but not yet the full bottom-to-top spread for ${cell.industry_name ?? "this business"}${cell.geo_name ? ` in ${cell.geo_name}` : ""}. These nearby cells already show it.`}
            suggestions={distributionSuggestions}
          />
        )}
      </section>

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

          {/* Founder-spec AOV + breakeven panel (2026-05-26). The
             operator question "how many sales a day to break even"
             is more concrete than the abstract margin %. Computes
             from cell revenue + industry baselines + AOV table. */}
          {(() => {
            // Wave 2 AOV city-tier (2026-05-26): when geo is a known
            // city slug, scale AOV by the city's tier. When geo is a
            // state/region (most US/EU cells), pass null and the AOV
            // stays at the global baseline.
            const cityTier = getCityTier(geo);
            const be = cell.industry_id
              ? computeBreakeven(
                  cell.industry_id,
                  cell.revenue_per_firm ?? cell.rev_p50 ?? null,
                  cityTier,
                )
              : null;
            if (!be) return null;
            const coveragePct = Math.round((be.coverageRatio - 1) * 100);
            const coverageColor =
              be.coverageRatio >= 1.3
                ? "#14532D"
                : be.coverageRatio >= 1.0
                  ? "#16A34A"
                  : be.coverageRatio >= 0.7
                    ? "#CA8A04"
                    : "#7F1D1D";
            return (
              <section className="atlas-card p-4 md:p-5 mt-6">
                <div className="text-[10px] uppercase tracking-[0.16em] text-atlas-700 font-semibold mb-3">
                  Breakeven, in orders per day
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-cocoa-700/70 font-semibold">
                      Avg order
                    </div>
                    <div className="font-display text-xl md:text-2xl font-semibold text-ink-900 tabular-nums leading-tight mt-1">
                      {fmtAov(be.aov)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-cocoa-700/70 font-semibold">
                      Orders / day to break even
                    </div>
                    <div className="font-display text-xl md:text-2xl font-semibold text-atlas-700 tabular-nums leading-tight mt-1">
                      {fmtOrders(be.breakevenOrdersDaily)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-cocoa-700/70 font-semibold">
                      Typical daily orders
                    </div>
                    <div className="font-display text-xl md:text-2xl font-semibold text-ink-900 tabular-nums leading-tight mt-1">
                      {fmtOrders(be.currentOrdersDaily)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-cocoa-700/70 font-semibold">
                      Margin of safety
                    </div>
                    <div
                      className="font-display text-xl md:text-2xl font-semibold tabular-nums leading-tight mt-1"
                      style={{ color: coverageColor }}
                    >
                      {coveragePct >= 0 ? "+" : ""}
                      {coveragePct}%
                    </div>
                    {/* Visual gauge: how far above breakeven (0% = at
                        breakeven; bar fills to 100% at double breakeven).
                        When under water, render an empty bar so the
                        absence is loud. Tone tracks coveragePct. */}
                    <ProgressBar
                      className="mt-2"
                      value={Math.max(0, coveragePct)}
                      max={100}
                      size="sm"
                      tone={
                        coveragePct >= 30
                          ? "success"
                          : coveragePct >= 0
                            ? "default"
                            : coveragePct >= -30
                              ? "warning"
                              : "danger"
                      }
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-cocoa-700/70 leading-relaxed">
                  Breakeven holds fixed costs (rent + payroll + utilities
                  + insurance + regulatory) constant at the typical
                  revenue level and asks: at $
                  {fmtAov(be.aov).replace("$", "")} per order and a{" "}
                  {Math.round(be.grossMargin * 100)}% gross margin, how
                  many orders a day cover those costs?
                  {be.cityTierMultiplier !== 1 ? (
                    <>
                      {" "}Order value is tier-adjusted for this metro
                      ({be.cityTierMultiplier > 1 ? "+" : ""}
                      {Math.round((be.cityTierMultiplier - 1) * 100)}%
                      vs the global average of{" "}
                      {fmtAov(be.baselineAov)}).
                    </>
                  ) : null}
                </p>
              </section>
            );
          })()}
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
          costStackOverride={cell.cost_stack ?? null}
          geoId={cell.geo_id ?? null}
        />
      ) : null}

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

      {/* Same activity across US states. Within-country comparison
         only: same currency, same wage scale, same Census source.
         Country-page rebuild §8 (2026-05-25): cross-country
         AcrossCountriesStrip was removed because the inter-country
         revenue dispersion is dominated by wrong-aggregation tails
         (India carpenters $11.6M next to Germany at $118K). The
         within-US version is preserved. */}
      <div id="across-states" />
      {isUsCell && (
        <AcrossStatesStrip
          industryName={cell.industry_name || industry.replace(/-/g, " ")}
          currentGeoName={cell.geo_name || geo}
          cells={acrossStates}
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

      {/* Plan v32 Sprint G Tier-1 — "Why these businesses fail" panel.
         Five specific failure modes per industry; sourced from SBA
         survival data + industry trade press. Self-suppresses for
         industries without curated entries. */}
      <FailureModes cell={cell} />

      {/* v34 Phase G: inline email capture after the failure-modes
         section. High-intent placement: users who scrolled this far
         are reading carefully. Posts to /api/newsletter (Supabase
         newsletter_signups table). Sender swap to ConvertKit happens
         in a follow-up once Tesseract Research sender is configured. */}
      {/* <InlineMidArticle /> reverted with v34 Phase G */}

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
