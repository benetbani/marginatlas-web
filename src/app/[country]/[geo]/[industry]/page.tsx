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
  listUsStates,
  withBudget,
} from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { INDUSTRIES, industryToSlug, isExcludedFromDiscovery } from "@/lib/taxonomy";
import { computeBreakeven } from "@/lib/economics/breakeven";
import { getCityTier, getCityPopulation, getCityCostOfLivingIndex } from "@/lib/cities/city_tier";
import { iso2ToName } from "@/lib/countries";
// RevenueTiles / RevenueDistribution / NetProfitWaterfall retired (WS3): the
// content-map stack (AnswerFirstMasthead + CellDecisionStack) replaces them.
import { DimensionSwitcher } from "@/components/DimensionSwitcher";
import { CellPageNav } from "@/components/CellPageNav";
// CellActions import removed (save/copy/CSV/embed buttons stripped)
// AtlasScore retired (2026-06-02): founder ruling that a single composite
// score in the open is too risky. The hero now shows a coverage-confidence
// word instead, and the cell page no longer renders an AtlasScore strip.
import { SmartImage } from "@/components/SmartImage";
import { AudienceCaveat } from "@/components/AudienceCaveat";
import { SECTOR_BY_ID, INDUSTRY_BY_ID, slugToIndustry, resolveToMeasuredIndustry, tradeNounFor } from "@/lib/taxonomy";
import { CellDataset, Breadcrumbs } from "@/components/StructuredData";
// RelatedIndustriesStrip was unmounted here on 2026-08-01: it built up to eight
// trade-page URLs straight from the taxonomy without checking that any of them
// held a row, which on a site that answers 200 for a wrong URL is a link that
// can never be seen to be dead. The verified equivalent is the "other trades in
// this place" category of the related tail below.
import {
  buildCellRelatedLinks,
  countryPagePath,
  fetchCellSiblings,
  resolveGeoPage,
} from "@/lib/cells/related_links";
import { CellRelatedLinks } from "@/components/cells/CellRelatedLinks";
import { getToneClass } from "@/lib/page-layout/section-order";
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
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { clampMargin } from "@/lib/finance/margin_floor";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { generateFAQs } from "@/lib/seo/faq_generator";
import { FAQSchema } from "@/components/FAQSchema";
import { getCellNarrative } from "@/lib/content/narratives";
import { getComparativeLead } from "@/lib/content/comparative_narratives";
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import { buildCellBoard, getLondonEntry } from "@/lib/scores/cell_board";
import { AnswerFirstMasthead, StickySectionNav, FreshnessStamp, FlagIt, HeroWash, ZoomControl, AddToWatch } from "@/components/kit";
import { buildCellView, cellViewNav } from "@/lib/cells/cell_view";
import { CellDecisionStack } from "@/components/cells/CellDecisionStack";
import { MakeItYoursPanel } from "@/components/cells/MakeItYoursPanel";
import { CityHero } from "@/components/CityHero";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { ComparableCitiesRibbon } from "@/components/ComparableCitiesRibbon";
import { LocalContextCard } from "@/components/LocalContextCard";
// TrendSparkline import removed; synthesized 5-year trend was too speculative
// Reverted 2026-05-25: QuartileMarkers + gateValue temporarily removed
// pending diagnosis of cell-page load failure. Re-add once the root
// cause is found and isolated.
// import { QuartileMarkers } from "@/components/monetization";
// import { gateValue } from "@/lib/monetization/viewer_tier";
import { CellFallbackBanner } from "@/components/CellFallbackBanner";
// Sanity-§8: EstimatedBadge purged. The standalone CoverageIndicator was
// retired in the density reform (2026-06-04): CoverageBadge now carries the
// only coverage read on the page, with its own "How we know this" link.
import { CoverageBadge } from "@/components/CoverageBadge";
// Industry deepening sections. Both self-suppress
// when their data isn't on the cell, so they're safe to mount before any
// cell has been deepened (Phase 1 will populate the data).
import { SetupCostBlock, hasSetupCostData } from "@/components/sections/SetupCostBlock";
import { AuPrimaryDataBadge } from "@/components/AuPrimaryDataBadge";
// Reverted: InlineMidArticle temporarily removed.
// import { InlineMidArticle } from "@/components/newsletter/NewsletterSignupVariants";
import { IfYouOpenedToday } from "@/components/sections/IfYouOpenedToday";
import {
  NeighborhoodOverview,
  findNeighborhoodContext,
} from "@/components/NeighborhoodOverview";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SpineShell } from "@/components/spine/shell";
import { SpineCellBody as SpineCell } from "@/components/spine/cell/cell-view";
import { buildSpineCellSeed } from "@/lib/spine/adapt_cell";
import { loadSpine2Cell } from "@/lib/cells/spine2_loader";
import { buildCellPage } from "@/lib/cells/spine2_adapter";
import { CellPage as Spine2CellPage } from "@/components/spine2/page/CellPage";
import { SiteChrome } from "@/components/SiteChrome";
/**
 * MEASURED COST OF THE IMPORT ABOVE (2026-07-26, Loop 2 I-8). Do not "optimise" it
 * without reading PROPOSALS.md F2 first; the obvious fix does not work.
 *
 * `CellPage` imports `@/styles/atlas-spine.css`. A CSS import is a build-time
 * side effect, so it lands in THIS route's stylesheet whether or not the flag
 * branch below ever runs. Measured on the live route with the flag OFF: the
 * route CSS chunk is 133KB carrying 1,104 `.av2` rules; without the spine
 * stylesheet it would be roughly 21KB.
 *
 * Nothing renders wrong. The stylesheet is scoped in full (951 selectors, every
 * one under `.av2`, and no `:root` block at all), so with no `.av2` element on
 * the page not a single rule matches. The cost is bytes, not pixels.
 *
 * It is also not transitional. This route serves every trade page with no
 * spine-2 file and every neighborhood-overview page, and those fall through to
 * the render below even when the flag is ON. One slug uses this stylesheet; the
 * rest carry it, and that ratio worsens as the lattice grows.
 *
 * A dynamic `await import()` inside the branch was tried and does NOT fix it:
 * `experimental.cssChunking` defaults to `true`, which per the Next.js docs
 * "will try to merge CSS files whenever possible ... to reduce the number of
 * chunks". The fix is architectural and is the founder's call (PROPOSALS.md F2,
 * which is the same question as backlog P5).
 */

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

async function CellPageBody({
  params,
}: {
  params: Promise<Params>;
}) {
  // Spine reform (flag-gated, default OFF). On promotion the body renders REAL,
  // reconciled data from buildSpineCellSeed (the same accessor + finance engines
  // the non-spine page uses), never the illustrative seed. When the adapter finds
  // no cell it returns undefined; we notFound() to match the non-spine page.
  if (isSpineReformEnabledFor("cell")) {
    const { country, geo, industry } = await params;
    // Spine 2 (the rebuilt trade page) serves only the slugs that have a
    // hand-filled, reconciled cell file. Everything else falls through to the
    // render below, unchanged.
    const spine2Cell = loadSpine2Cell(country, geo, industry);
    if (spine2Cell) {
      /* STRUCTURED DATA. This branch returns early, ~500 lines before the
         legacy page's <CellDataset>, <FAQSchema> and <Breadcrumbs>, so until
         2026-07-27 the v2 page emitted none of them , only the root layout's
         Organization. The legacy cell page emits all three. That was a live
         SEO regression on the one page the redesign exists to prove.

         Everything below comes from the reconciled cell file. Two fields the
         legacy branch passes are DELIBERATELY OMITTED rather than approximated:

         - revP10 / revP90. The component renders these as "Bottom 10% ... top
           10%". The spine-2 file carries QUARTILES (p25 / p75), not deciles.
           Passing quartiles here would state that the 25th percentile is the
           bottom tenth, which is a fabricated claim in machine-readable form ,
           the worst place to put one. Both are optional and the sentence
           self-omits.
         - qualityScore. Spine 2 grades provenance per figure (measured / built
           / thin), not as one page-level score. There is no honest number to
           put here.

         nEmployees, wagePerEmployee and csvExportUrl are omitted for the same
         reason: the file does not carry a trade-wide employee count or wage,
         and a CSV export is not proven to exist for a spine-2 slug. */
      const m = spine2Cell.meta;
      const pop = spine2Cell.population;
      /* The wider place and the country are resolved ONCE, here, and the same
         two answers feed the BreadcrumbList below and the page's own onward
         doors. That is the point of resolving them before the model is built
         rather than beside it: the trail and the door cannot come to different
         conclusions about which pages exist, because there is only one
         conclusion. Either may be null, and null means no destination is
         offered anywhere on the page. */
      const spine2GeoPage = resolveGeoPage(m.country.slug, m.city.slug);
      const spine2CountryPage = countryPagePath(m.country.slug);
      const model = buildCellPage(spine2Cell, {
        geoPage: spine2GeoPage,
        countryPage: spine2CountryPage,
      });
      const origin = "https://www.marginatlas.com";
      const url = `${origin}${m.urlPath}`;
      return (
        <>
          <CellDataset
            url={url}
            industryName={m.trade.name}
            geoName={m.city.name}
            country={m.country.slug.toUpperCase()}
            year={Number(m.freshness.slice(0, 4))}
            medianRevenue={pop.medianRevenue?.value ?? null}
            nEnterprises={pop.enterprises?.value ?? null}
          />
          <FAQSchema
            faqs={(model.questions ?? []).map((x) => ({
              question: x.q,
              answer: x.a,
            }))}
          />
          {/* The country and place steps are resolved, not assembled, for the
             reasons spelled out at the legacy branch's breadcrumb below: the
             two-segment form of a trade URL serves regions, so a city segment
             there is a 404, and a first segment carrying a statistical code the
             country route does not serve is a 404 too. Each item is omitted
             outright when nothing resolves, and BreadcrumbList positions
             renumber because the component numbers what it is handed. */}
          <Breadcrumbs
            items={[
              { name: "Home", url: `${origin}/` },
              ...(spine2CountryPage
                ? [{ name: m.country.name, url: `${origin}${spine2CountryPage.href}` }]
                : []),
              ...(spine2GeoPage
                ? [{ name: m.city.name, url: `${origin}${spine2GeoPage.href}` }]
                : []),
              { name: m.trade.name, url },
            ]}
          />
          <Spine2CellPage model={model} />
        </>
      );
    }
    const spineData = await buildSpineCellSeed(country, geo, industry);
    if (!spineData) notFound();
    return (
      <SpineShell bg="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=60" bgPosition="center 45%">
        <SpineCell data={spineData} />
      </SpineShell>
    );
  }

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

  // Fan out the remaining data fetches concurrently. None block the others.
  // Every one wrapped in withBudget so a single slow query cannot hang the
  // entire page render.
  const isUsCell = country.toLowerCase() === "us";
  // Country-page rebuild §8 (2026-05-25): the cross-country fetch was
  // dropped because AcrossCountriesStrip no longer renders. Within-US
  // state comparison stays (same currency, same wage scale, real
  // Census coverage). Comparable-cells stays (peer-city ribbon).
  const [comparables, acrossStates, nudge, cellSiblings] = await Promise.all([
    withBudget(
      // Fetch 200, render at most 6, and the gap between those two numbers is
      // the point. This used to ask for exactly the 6 it rendered. The related
      // tail now drops any trade excluded from discovery (solo-professional and
      // corporate-only activities), any whose slug does not name it back, and
      // any repeat, and a state's rows repeat heavily: one per year, size band
      // and grain, led by the broad roll-ups that carry no activity at all.
      // MEASURED on California, Montana and Ohio: a fetch of 24 yielded one or
      // two usable trades, 120 yielded four, 200 yields six to nine. 200 is
      // also exactly the row budget the across-states read on this same page
      // already runs against this same table, so it is a known-tolerable size
      // rather than a new one.
      getComparableCells(cell.geo_name || "", cell.naics_6 || undefined, 200),
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
    // The lattice siblings for the related tail: same trade elsewhere, other
    // trades here. Depends on nothing else in this fan-out, and budgets each of
    // its own two reads, so a slow one costs links rather than the page. Runs
    // no query at all on a US state page, whose siblings the two reads above
    // already carry.
    fetchCellSiblings(country, geo, industry),
  ]);

  // Build region + industry option lists for switcher
  const regions = listUsStates();
  // Audience filter: switcher only shows SMB-relevant industries by default,
  // and never the discovery-excluded (solo-professional or non-SMB) activities.
  const industryOpts = INDUSTRIES
    .filter((i) => {
      if (isExcludedFromDiscovery(i)) return false;
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
  // displaying different-industry numbers? Since the foundation fix
  // (2026-06-12) the CELL carries the industry it truly is (the validated
  // US lookup stamps it), so the honest comparison is request vs cell, not
  // request vs the static taxonomy collapse.
  const requestedIndustry = slugToIndustry(industry);
  const measuredIndustry = resolveToMeasuredIndustry(requestedIndustry);
  const displayedIndustry =
    (cell.industry_id && INDUSTRY_BY_ID[cell.industry_id]) || measuredIndustry;
  const usingParentData = !!(
    requestedIndustry &&
    displayedIndustry &&
    requestedIndustry.id !== displayedIndustry.id
  );
  // Type switcher group (2026-06-13): the sub-niches of this trade, from the
  // taxonomy children. If the URL's trade is a parent with children (or itself
  // a child of one), the bar offers a "Type" select listing the whole group
  // (the parent reads "All ...") so a reader can pivot e.g. restaurants ->
  // pizzerias. Each option is a real cell URL, so the switcher's router handles
  // navigation; no stub data needed.
  const typeRoot =
    requestedIndustry?.parent_id != null
      ? INDUSTRY_BY_ID[requestedIndustry.parent_id] ?? null
      : requestedIndustry ?? null;
  const typeChildren = typeRoot
    ? INDUSTRIES.filter((i) => i.parent_id === typeRoot.id)
    : [];
  const subTypes =
    typeRoot && typeChildren.length > 0
      ? [typeRoot, ...typeChildren].map((i) => ({
          id: i.id,
          name: i.name,
          slug: industryToSlug(i.id),
        }))
      : [];
  const currentTypeSlug = requestedIndustry
    ? industryToSlug(requestedIndustry.id)
    : industry;

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
  // Founder rule: a business big enough to employ 10 or more people should
  // clear at least twice the local average annual income for its owner. Below
  // that bar the owner would earn less than two salaried staff while carrying
  // all the risk, which signals the take-home estimate is too thin to believe.
  // So for 10+ employee bands we floor the absolute annual take-home at 2x the
  // country average income. This touches dollars only; the net margin percent
  // and every revenue figure stay exactly as computed. Firms with 9 or fewer
  // employees (1-4, 5-9) are never floored.
  const isLargerFirm =
    !!cell.size_band &&
    ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
  const annualIncome =
    econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  // Defensive floor — never let a sub-3% net margin reach the page. Still needed
  // for the margin row; the take-home floors consistently with this same shown
  // margin inside resolveOwnerTakeHome.
  const computedNetMargin = rawNetMargin != null ? clampMargin(rawNetMargin, "net", cell.industry_id || null) : null;
  // One owner take-home, shared by the take-home row AND the break-in score (and
  // the cost-to-open page), resolved by the single source of truth so the card
  // can never show a take-home that contradicts its own net-margin row (the bug
  // where a cell printed "3% net" and a negative take-home and a null score at
  // once). See src/lib/finance/owner_take_home.ts for the rule.
  const adjustedNetTakeHome = resolveOwnerTakeHome({
    structuralNetProfit: netTakeHome,
    rawNetMargin,
    revenue: grossRevenueForMargin,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });

  // City tier drives the break-even AOV adjustment and the cost-of-living place
  // signals below; resolve it once here and reuse it.
  //
  // The masthead's single headline score is now the break-in rating, computed
  // inside buildCellBoard from this cell's real annual owner take-home and its
  // real-or-modeled entry costs (see the BoardHero call below). The former
  // multi-part opportunity strip (computeScores / scoreSet) no longer feeds this
  // page's masthead, so it is not recomputed here; the computeScores module
  // itself is untouched and still serves the surfaces that use it.
  const cityTier = getCityTier(geo);

  // Top-of-page dashboard inputs. Hoisted here so each is computed ONCE and
  // reused both in the dashboard and in the deeper sections below (the
  // break-even section and the revenue-tiles anchor previously each recomputed
  // these inside their own IIFE).
  //
  // Break-even (orders/day to survive). Reused by the break-even detail section.
  const be = cell.industry_id
    ? computeBreakeven(
        cell.industry_id,
        cell.revenue_per_firm ?? cell.rev_p50 ?? null,
        cityTier,
      )
    : null;
  // People working + wage per employee, with the same extrapolation fallback
  // the headline tiles use (fill rule: never a blank figure when an estimate
  // is computable).
  const employeesEstimate =
    cell.n_employees ?? estimateEmployeesFromFirms(cell.industry_id, cell.n_enterprises);
  const wageEstimate =
    cell.payroll_per_employee ?? estimateWagePerEmployee(country, cell.industry_id, geo);
  // City population (residents) when the geo slug is a known city; null for
  // state/region slugs. Drives the market-density read.
  const cityPopulation = getCityPopulation(geo);
  // City cost-of-living index (NYC = 100) when the geo slug is a known city;
  // null for state/region slugs. Place-adjusts the modeled "Cost to open"
  // figure so the same business reads higher in a costly metro.
  const cityCostOfLivingIndex = getCityCostOfLivingIndex(geo);

  // The masthead atmosphere image was retired with BoardHero (WS3): the
  // AnswerFirstMasthead carries the faint survey-grid motif instead, and the
  // cinematic CityHero photo still renders above it for cities that have one.

  // Full A-J data board. Built from the values already computed above so no
  // figure is recomputed: the money rows reuse the tax-aware net numbers and
  // the floored take-home; the market/density rows reuse the city population;
  // the modeled qualitative reads come from the curated London dataset (GB
  // cells only, blanks elsewhere). Every section and every row is always
  // present; missing data renders as the board's dash. econSnap is the
  // country-economics snapshot already computed above for the take-home floor;
  // corporateTaxRate is the effective rate from the net-profit waterfall.
  // Only the break-in rating is still consumed (the masthead chip). The board's
  // dense reference rows were retired into the content-map sections (WS3), so
  // the section list itself is no longer rendered.
  const { breakInRating } = buildCellBoard({
    cell,
    typicalRevenue: cell.revenue_per_firm ?? cell.rev_p50 ?? null,
    revP10: cell.rev_p10 ?? null,
    revP90: cell.rev_p90 ?? null,
    grossMarginPct: marginRow.gross_margin ?? null,
    operatingMarginPct: marginRow.operating_margin ?? null,
    netMarginPct: computedNetMargin,
    ownerTakeHome: adjustedNetTakeHome,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    peopleWorking: employeesEstimate ?? null,
    wagePerEmployee: wageEstimate ?? null,
    cityPopulation,
    cityCostOfLivingIndex,
    econ: econSnap,
    corporateTaxRate: netProfitResult?.effective_cit_rate ?? null,
    costStructure: cell.cost_structure ?? null,
    londonEntry: getLondonEntry(cell),
    cellRef: { country, geo, industry },
  });

  // FailureCards ("why these fail") removed: the founder's content map rejects
  // it on business pages, so the failure-mode lookup is no longer computed.

  // Discovery cross-link into the dedicated opening page. The "What it takes to
  // open" board section gets a single quiet footer link to the full opening
  // guide (/[country]/[geo]/[industry]/opening), so a reader weighing the entry
  // cost can step straight into the deeper, comparison-rich view. Attached here
  // (not inside the pure board builder) so cell_board.ts stays free of route
  // slugs and the cells data layer. Every other section is untouched.
  //
  // The /opening (and the /buy-or-start it feeds) sub-pages only resolve for a
  // TRUSTED LOCAL cell: buildOpeningPage applies isTrustedLocalCell and
  // notFound()s otherwise, so a country-aggregate or extrapolated cell (which
  // still renders THIS page) would 404 on those sub-pages. Mirror that gate here,
  // and only surface the cross-link when the sub-page will actually resolve, so a
  // working cell page never links to a 404.
  const expectedIndustryId = requestedIndustry?.id ?? cell.industry_id ?? undefined;
  const opensTrusted = isTrustedLocalCell(cell, expectedIndustryId) && !!cell.industry_id;
  const openingHref = `/${country.toLowerCase()}/${geo.toLowerCase()}/${industry.toLowerCase()}/opening`;

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
  // Suppress the pre-generated narrative when the cell's revenue is dashed.
  // The cached prose is revenue-led ("brings in roughly $X in annual revenue")
  // and is frozen text, so on a cell whose revenue is suppressed (wrong-scale
  // outlier, or any null-revenue cell) it would leak a number the stats no
  // longer show. No revenue on the page, no revenue-citing narrative.
  const narrative =
    resolvedIndustryForNarrative && cell.revenue_per_firm != null
      ? getCellNarrative(
          country,
          cell.geo_id || geo,
          resolvedIndustryForNarrative,
          cell.size_band || "total"
        )
      : null;

  // -- WS3 content-map view model. Maps the figures already computed above into
  // the Atlas Page Kit's section props (the answer-first masthead + the decision
  // stack), fully filling the curated London exemplar and self-omitting
  // elsewhere. Pure data; the JSX below is a thin renderer.
  const londonEntry = getLondonEntry(cell);
  const Le = londonEntry?.economics ?? null;
  const trustedLocalCell = isTrustedLocalCell(cell, expectedIndustryId);
  const placeName =
    cell.geo_name || iso2ToName(country) || country.toUpperCase();
  const tradeName = cell.industry_name || industry.replace(/-/g, " ");
  const tradeNoun = tradeNounFor(tradeName);
  const viewRevenue = Le?.revenue ?? cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const viewNetMarginPct = Le
    ? Le.net_margin_pct
    : computedNetMargin != null
      ? computedNetMargin * 100
      : null;
  const viewTakeHome = Le?.owner_take_home ?? adjustedNetTakeHome ?? null;
  const viewFirms = Le?.firms ?? cell.n_enterprises ?? null;
  // Same business nearby: the across-states slate (same trade, comparable US
  // places, same currency). London fills its own UK peers in the view model.
  const nearbyPeers = (isUsCell ? acrossStates : [])
    .filter((c) => (c.geo_name || "") && (c.geo_name || "") !== (cell.geo_name || ""))
    .map((c) => ({
      name: c.geo_name || "",
      href: cellUrl(c),
      value: c.revenue_per_firm ?? c.rev_p50 ?? null,
    }));

  const cellView = buildCellView({
    cell,
    londonEntry,
    placeName,
    tradeName,
    tradeNoun,
    industrySlug: industry,
    typicalRevenue: viewRevenue,
    netMarginPct: viewNetMarginPct,
    ownerTakeHome: viewTakeHome,
    firms: viewFirms,
    breakInRating: breakInRating?.score ?? null,
    isTrustedLocal: trustedLocalCell,
    costStructure: cell.cost_structure ?? null,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    employees: employeesEstimate ?? null,
    wagePerEmployee: wageEstimate ?? null,
    peers: nearbyPeers,
    narrative,
  });
  const navSections = cellViewNav(cellView);

  // -- Interaction layer (Phase 2). The make-it-yours panel, the zoom ladder, and
  // the add-to-watch chip are client islands mounted inside this server page. Each
  // is HONEST: the panel mounts only with a real take-home + revenue, the zoom
  // only links altitudes that resolve from these params, the watch chip carries
  // the real cell coordinates.
  //
  // Canonical figures for the what-if come straight from the cell view (revenue,
  // owner take-home, net margin), all already shown on the page. The rent + staff
  // levers are the annual dollar lines the held cost split implies: the per-$100
  // cost shares scaled to the same typical revenue. Offered only where the split
  // is held; omitted otherwise (the lever self-hides). The owner-draw lever is the
  // monthly slice of the typical take-home, so the reader can sanity-check the pay
  // they intend against the typical owner figure.
  const makeItYoursRevenue = viewRevenue;
  const makeItYoursTakeHome = cellView.ownerKeeps?.takeHome ?? null;
  const makeItYoursMarginPct =
    cellView.ownerKeeps?.marginPct ??
    (viewNetMarginPct != null ? viewNetMarginPct : null);
  // Annual rent + payroll from the held cost split (shares of total cost scaled
  // to the costs portion of revenue). Only when a real split rides on the cell.
  const cs = cell.cost_structure ?? null;
  let leverRent: number | undefined;
  let leverStaff: number | undefined;
  if (
    cs &&
    makeItYoursRevenue != null &&
    makeItYoursTakeHome != null &&
    makeItYoursRevenue > 0
  ) {
    const shareSum = cs.cogs + cs.labor + cs.rent + cs.other;
    const costsTotal = Math.max(0, makeItYoursRevenue - makeItYoursTakeHome);
    if (shareSum > 0 && costsTotal > 0) {
      leverRent = Math.round((cs.rent / shareSum) * costsTotal);
      leverStaff = Math.round((cs.labor / shareSum) * costsTotal);
    }
  }
  const leverDraw =
    makeItYoursTakeHome != null && makeItYoursTakeHome > 0
      ? Math.round(makeItYoursTakeHome / 12)
      : undefined;
  const makeItYoursReady =
    makeItYoursRevenue != null &&
    makeItYoursRevenue > 0 &&
    makeItYoursTakeHome != null &&
    makeItYoursTakeHome > 0 &&
    makeItYoursMarginPct != null;

  // Zoom ladder hrefs. The current cell is the trade read at THIS place (the
  // "business" altitude). The only genuinely-different altitude these params
  // resolve is the whole country: the same trade at the country-root cell, valid
  // only when this geo is a sub-country place (so we are not already at it). The
  // city + neighbourhood altitudes do not resolve as distinct routes from a
  // 3-segment cell page, so they are omitted (honest: no link that 404s).
  const atCountryRoot = geo.toLowerCase() === country.toLowerCase();
  const countryZoomHref = atCountryRoot
    ? undefined
    : `/${country.toLowerCase()}/${country.toLowerCase()}/${industry.toLowerCase()}`;

  // The watch item for this cell: a stable id, a human label, the canonical href,
  // a take-home/revenue sub, and the compare coordinates the tray hands to the
  // grid. One per page.
  const watchHref = `/${country.toLowerCase()}/${geo.toLowerCase()}/${industry.toLowerCase()}`;
  const watchSub =
    makeItYoursTakeHome != null
      ? `Owner keeps about ${formatMoney(makeItYoursTakeHome)}`
      : viewRevenue != null
        ? `Typical ${formatMoney(viewRevenue)} revenue`
        : undefined;

  // The related-pages tail (content-map section 14), passed into the decision
  // stack so it renders at its content-map position. It is now the LATTICE tail:
  // the same trade in other places, other trades in this place, this place's own
  // page, and this country. Four onward moves where the page body previously
  // offered one.
  //
  // Every link is resolved from a row that exists and then round-tripped through
  // the destination route's own resolver before it is emitted, because this site
  // answers 200 for a wrong URL and so a dead internal link would never announce
  // itself. The whole gate lives in src/lib/cells/related_links.ts.
  //
  // What this REPLACED, and why. The old tail was a six-card grid of other
  // industries (US states only, since getComparableCells resolves a state by
  // name) plus RelatedIndustriesStrip, which built up to eight URLs straight
  // from the taxonomy with no check that any of them held data. Both are
  // subsumed here by the verified equivalents, and the unverified generator is
  // no longer mounted.
  const relatedLinks = buildCellRelatedLinks({
    cell,
    countrySlug: country,
    geoSlug: geo,
    industrySlug: industry,
    tradeName,
    placeName,
    siblings: cellSiblings,
    usSameTradeRows: acrossStates,
    usOtherTradeRows: comparables,
  });
  const relatedTail = relatedLinks.any ? (
    <CellRelatedLinks model={relatedLinks} />
  ) : null;

  // The pages that own this cell's PLACE and its COUNTRY, when they exist. Read
  // from the same module the related tail reads them from, so the tail's links
  // and the two breadcrumbs below cannot disagree about which of the two have a
  // page. Either can answer null, and null is rendered as a step with no
  // destination rather than as a step pointing nowhere.
  const geoPage = resolveGeoPage(country, geo);
  const countryPage = countryPagePath(country);

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
        /* The parameter is `region`, not `geo`. Written as `geo` this URL
           arrived with an empty region, failed the slug test and returned 400,
           while the human-facing download button in CellActions used `region`
           and worked. It goes into schema.org Dataset > distribution >
           contentUrl, which is the field a dataset crawler follows, so every
           trade page has been telling machines the data is downloadable at a
           URL that answered 400. Verified against production both ways on
           2026-07-30: geo= gave 400, region= gave 200. */
        csvExportUrl={`https://www.marginatlas.com/api/export-csv?country=${country}&region=${geo}&industry=${industry}`}
      />
      {/* Plan v14 Phase C.4: FAQPage JSON-LD. Five data-backed Q&As per cell,
         no visible DOM. Targets AI Overviews + Google People Also Ask. */}
      <FAQSchema faqs={faqs} />
      {/* THE COUNTRY STEP AND THE PLACE STEP. Both trails below get both
         destinations from the related-links module, the same resolvers the
         related tail uses, and both accept that either can answer nothing.

         THE COUNTRY STEP was unguarded until 2026-08-01. The first segment of a
         trade URL is whatever code the statistics carry, which is not always the
         ISO-2 code the country route serves: Greek cells are stored under EL and
         COUNTRIES holds Greece as GR, so the country route notFounds and every
         Greek trade page offered a first step into it, in the visible trail and
         in the BreadcrumbList both.

         Until 2026-08-01 both trails assembled the two-segment form of this
         URL instead. That route serves REGIONS: US states, admin1 entities where
         a manifest exists, otherwise one synthesized country slug. A CITY is in
         none of those, so the step 404d on every trade page whose geo is a city,
         which is the page type search traffic lands on. The JSON-LD carried the
         same URL, so the site was also telling crawlers its canonical trail runs
         through a dead end.

         Where nothing resolves the visible step drops its destination and the
         BreadcrumbList drops the ITEM. Positions stay contiguous because the
         component numbers what it is handed, so a dropped step renumbers rather
         than leaving a hole. */}
      <Breadcrumbs
        items={[
          { name: "Home", url: "https://www.marginatlas.com/" },
          ...(countryPage
            ? [
                {
                  name: country.toUpperCase(),
                  url: `https://www.marginatlas.com${countryPage.href}`,
                },
              ]
            : []),
          ...(geoPage
            ? [
                {
                  name: cell.geo_name || geo,
                  url: `https://www.marginatlas.com${geoPage.href}`,
                },
              ]
            : []),
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
            href: countryPage?.href,
            iso2: country.toUpperCase(),
          },
          {
            label: cell.geo_name || geo,
            href: geoPage?.href,
          },
          { label: cell.industry_name || industry },
        ]}
      />

      {/* AA.6 staleness + AA.9 industry-mapping + Plan v10 WW cross-country chips */}
      <CellWarningChips
        year={cell.year}
        requestedIndustrySlug={industry}
        resolvedIndustryName={displayedIndustry?.name}
        resolvedIndustryUrl={
          displayedIndustry
            ? `/${country.toLowerCase()}/${geo}/${industryToSlug(displayedIndustry.id)}`
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

      {/* Decision-first reform (2026-06-04): the duplicate hand-rolled
          breadcrumb nav was removed. The adaptive <Breadcrumb> above is the
          single canonical trail; a second one directly under it was pure
          repetition and added vertical noise before the hero. */}

      {/* In-page dimension switcher: region/industry/size/year */}
      <DimensionSwitcher
        country={country}
        geoSlug={geo}
        industrySlug={industry}
        industryName={cell.industry_name || industry.replace(/-/g, " ")}
        geoName={cell.geo_name || geo}
        regions={regions}
        industries={industryOpts}
        subTypes={subTypes}
        currentTypeSlug={currentTypeSlug}
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

      {/* Board masthead. Plain left-aligned H1 ("<activity> in <place>") plus
          the single break-in rating (one headline score). Deliberately quieter
          and shorter than the old VerdictHero so the data board reaches above
          the fold.
          The richer search-friendly phrasing stays in generateMetadata; the
          visible H1 is now plain.

          The masthead carries the same deliberate exception to the pure-white
          system the country + city pages do: a low-opacity duotone photo of
          the cell's city sits behind the title as atmosphere, then fades to
          white so the data board below reads on a clean surface. The image
          self-omits for state/region slugs and cities without a photo (see
          MastheadImage), so the masthead degrades to plain white. The inner
          layer keeps id="headline" so the right-rail TOC anchor resolves to the
          title block without registering an extra section id with the canonical
          skeleton gate, and sits in a relative layer above the image. */}
      {/* WS3 content-map masthead. Answer-first: the assertion headline, the
          one-line read, the anchor revenue number WITH its 7-gradation spread,
          a quiet stat row, and break-in demoted to a chip. Replaces the former
          BoardHero + A-J board wall; the board's reference rows now live inside
          the decision stack's content-map sections. */}
      {/* Zoom ladder + watch chip near the masthead. The zoom keeps the trade +
          place sticky and steps the resolution (only the altitudes that resolve
          from these params are linked); the watch chip keeps this one cell on the
          reader's shortlist. Both are client islands; the page stays server-rendered. */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ZoomControl
          trade={tradeName}
          place={placeName}
          altitude="business"
          sticky={false}
          hrefs={{
            country: countryZoomHref,
            business: watchHref,
          }}
          /* basis-full on a phone, not flex-1. The parent declares flex-wrap,
             but flex-1 sets flex-basis:0, so this never reached its wrap width.
             It just shrank to share the row with the watch chip and grew its own
             scrollbar. Measured on production at 375px: the zoom ladder was
             boxed to 217px holding 310px and 315px of content, clipping 93px and
             98px, including the "This trade here" marker that says where you
             are. Given the full row it needs 327px of 327px available, so both
             scrollbars disappear. Costs 25px of height, because the watch chip
             takes its own row below. Restored to the old behaviour at sm. */
          className="min-w-0 basis-full grow-0 sm:basis-0 sm:grow"
        />
        <AddToWatch
          item={{
            kind: "cell",
            slug: `${country.toLowerCase()}:${geo.toLowerCase()}:${industry.toLowerCase()}`,
            label: `${tradeName}, ${placeName}`,
            href: watchHref,
            sub: watchSub,
            compare: { country, industry, region: geo },
          }}
        />
      </div>

      <HeroWash category="business">
        <AnswerFirstMasthead
          id="headline"
          eyebrow={`${tradeName} · ${placeName} · ${
            iso2ToName(country) || country.toUpperCase()
          }`}
          tier={cellView.masthead.tier}
          title={cellView.masthead.title}
          answer={cellView.masthead.answer}
          anchor={cellView.masthead.anchor}
          spread={
            cellView.masthead.spread
              ? { ...cellView.masthead.spread, format: formatMoney }
              : null
          }
          stats={cellView.masthead.stats}
          breakIn={cellView.masthead.breakIn}
        />
      </HeroWash>

      {/* Make it yours: the marquee what-if calculator, mounted just below the
          masthead and ONLY when a real take-home + revenue are held. It is an
          extra interactive panel, not a content-map section, so it registers no
          gated section id. */}
      {makeItYoursReady ? (
        <div className="mt-6">
          <MakeItYoursPanel
            canonical={{
              revenue: makeItYoursRevenue!,
              takeHome: makeItYoursTakeHome!,
              marginPct: makeItYoursMarginPct!,
              rent: leverRent,
              staff: leverStaff,
              draw: leverDraw,
            }}
          />
        </div>
      ) : null}

      {/* The decision stack: the honest take, the money picture, the editorial
          beats, in the content-map reading order. The startup-cost block is
          slotted into its content-map position (after pay by role). London is
          fully filled; a thin cell shows a clean short page. */}
      <div className="mt-8">
        <CellDecisionStack
          view={cellView}
          place={placeName}
          startupCost={
            hasSetupCostData(cell) ? (
              <SetupCostBlock cell={cell} id="startup-cost" />
            ) : null
          }
          related={relatedTail}
        />
      </div>

      {/* Next step: the full opening guide, surfaced only when the sub-page will
          actually resolve for this cell (trusted local), so a working cell page
          never links to a 404. */}
      {opensTrusted ? (
        <div className="mt-6">
          <a
            href={openingHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-atlas-200 bg-atlas-50 px-4 py-2 text-sm font-medium text-atlas-700 transition-colors hover:bg-atlas-100"
          >
            See the full opening guide &rarr;
          </a>
        </div>
      ) : null}

      {/* One quiet meta row under the hero, merged from three former
          stripes (coverage badge + currency switcher + the compact
          coverage-indicator). Density reform 2026-06-04: the separate
          CoverageIndicator section was dropped because CoverageBadge
          already carries the "How we know this" methodology link, so a
          second coverage stripe read as duplicate apology. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-parchment/60 pb-5 mb-2">
        <CoverageBadge cell={cell} />
        <div className="flex items-center gap-2 text-xs text-cocoa-500">
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

      {/* Decision layer: the masthead now carries the single break-in rating as
          the one headline score, with its "why this rating" breakdown folded
          into the "What it takes to open" section above. The older standalone
          ScorePanel section was pure duplication and stays removed. */}

      {/* The sub-niche switcher moved into the DimensionSwitcher "Type" select
         (2026-06-13): the old SubIndustryPicker stub rendered non-navigating
         chips. The Type select drives real cell URLs from the taxonomy. */}

      {/* Editorial voice, tightened to ONE block (density reform
          2026-06-04). The standalone EditorialNote and the activity-
          character aside were removed: three stacked prose blocks read as
          filler. This single narrative carries the comparative-voice lead
          and the cached editorial prose with the drop-cap treatment.

          NUMBERS-ONLY (2026-06-07, founder): the editorial narrative section
          is no longer rendered. The cell page leads with figures, not prose.
          The block is kept verbatim, commented out, so reviving it is a
          one-block revert (uncomment). The narrative + getComparativeLead
          plumbing above stays intact for the same reason. */}
      {false && (() => {
        const lead = cell.industry_id ? getComparativeLead(cell.industry_id) : null;
        if (!narrative && !lead) return null;
        return (
          <section id="narrative" className={`py-8 md:py-10 ${getToneClass("narrative")}`}>
            <div className="max-w-prose">
              {lead && (
                <p className="text-base md:text-lg leading-[1.6] text-cocoa-700 mb-6 border-l-4 border-atlas-700 pl-4 italic">
                  {lead?.sentence}
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

      {/* Headline revenue tiles (People working / Typical revenue / Wage per
         employee) live in the top-of-page data board's "The numbers"
         section (A). The former zero-height sr-only revenue-tiles section
         marker was removed (2026-06-07): the canonical skeleton is a
         subsequence test, so an absent beat is legal and the empty
         sr-only anchor added nothing. The revenue-tiles beat stays
         registered in section-order.ts in case a real tiles section ever
         returns here. */}

      {/* AU Phase 1c — primary data badge. Shown only when:
         - country is AU
         - industry maps to a parsed ATO entry
         - revenue classifies into a turnover band
         - NEXT_PUBLIC_AU_PRIMARY_DATA=1
         Silently absent otherwise. */}
      <div className="my-2">
        <AuPrimaryDataBadge cell={cell} />
      </div>

      {/* COST TO OPEN (SetupCostBlock) now renders inside CellDecisionStack at
          its content-map position (after pay by role), so the standalone copy
          here was removed to avoid showing the cost-to-open block twice. */}

      {/* Plan v13 Wave 1: time series chart removed:
         multi-year coverage is too uneven across cells to display honestly. */}

      {/* Plan v13 Wave 1 follow-up: Data Quality section removed.
         The 10/10 confidence score and ★★★★★ rating exposed engineering
         provenance the founder explicitly said never to display. */}

      {/* Usefulness-ordered tail (2026-06-07, founder). The post-board
          sections run by decreasing decision value: first what kills weak
          operators (the screenshot-worthy warning), then the same business
          elsewhere (across-states + peer-city rails), then other businesses
          here (comparable cells), then sibling industries, then the
          knowledge-base footer. Each section keeps its own self-omit, so a
          thin cell still renders cleanly. */}

      {/* FailureCards ("why these fail") was REMOVED: the founder's content map
          rejects it on business pages. The across-states strip was also removed:
          it duplicated the decision stack's "same business nearby" section
          (content-map #13), which now carries the US-state peers. */}

      {/* Reformation idea #4 — comparable-cities ribbon. Sends users
         to 3 peer cities (similar scale, often different country)
         for the same industry. Renders only if seed city is in
         data/cities/city_list_v1.json (silent otherwise). */}
      <ComparableCitiesRibbon
        citySlug={geo}
        industrySlug={industry}
        industryName={cell.industry_name || undefined}
      />

      {/* The comparable-cells ("Other industries here") + sibling-sector strip
          now render inside the decision stack as the content-map "related"
          section (#14), via the relatedTail slot, so they are not repeated here. */}

      {/* Close furniture: when this read was last refreshed + an honest flag-it,
          per the brand layer. */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-parchment/60 pt-5">
        <FreshnessStamp updated={cell.year ? String(cell.year) : "this year"} />
        <FlagIt />
      </div>

      {/* Send a correction */}
      <CorrectionForm cellUrl={`/${country}/${geo}/${industry}`} />

      {/* Plan v30 quick-win — knowledge base footer link. Maps the
          industry to a relevant /learn/ article so visitors can dive
          deeper into the category context. */}
      {cell.industry_id ? (
        <section className="mt-5 mb-8 rounded-lg border border-parchment bg-cream-50 px-5 py-5 md:px-7 md:py-6">
          <SectionEyebrow size="md" className="mb-2">Read more</SectionEyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`/learn/how-much-does-a-${(cell.industry_name || cell.industry_id).toLowerCase().replace(/s$/, "").replace(/\s+/g, "-").replace(/-+/g, "-")}-make`}
              className="block rounded-md border border-parchment bg-white hover:shadow-lift hover:-translate-y-px p-4 transition"
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
              className="block rounded-md border border-parchment bg-white hover:shadow-lift hover:-translate-y-px p-4 transition"
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
      <StickySectionNav sections={navSections} />
    </div>
  );
}

function formatMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "-";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

/* THE ONE ROUTE THAT SOMETIMES RENDERS WITHOUT CHROME.

   This URL serves three renders chosen at REQUEST TIME by data: the spine-2
   page when a reconciled cell file exists, a neighborhood overview when the
   segment names a neighborhood, and the legacy cell page otherwise. App Router
   layouts are keyed by path, not by data, so no route group can express that
   split , which is why the chrome is a component and why this decision is made
   here, in the only file that has the data to make it.

   The spine-2 page carries its own masthead, breadcrumb, footer and chapter
   nav. Wrapped in the site chrome it produced two brand lockups, two
   unlabelled navigations, four font families of which two never rendered its
   content, a skyline that could not be full-bleed, and a watch-tray pill
   painting over its own chapter pill. So that branch renders bare and every
   other branch keeps the chrome exactly as before. */
export default async function CellPage(
  props: Parameters<typeof CellPageBody>[0],
) {
  const { country, geo, industry } = await props.params;
  const bare =
    isSpineReformEnabledFor("cell") &&
    loadSpine2Cell(country, geo, industry) != null;
  const body = <CellPageBody {...props} />;
  return bare ? body : <SiteChrome>{body}</SiteChrome>;
}
