/**
 * Neighborhood cell page.
 *
 * URL: /[country]/[geo]/[industry]/[sub]
 *
 * Where `geo` is the city slug, `industry` is the neighborhood slug,
 * and `sub` is the actual industry slug. The unusual param naming is
 * a forced consequence of Next.js App Router refusing to have two
 * different param names at the same depth across sibling routes
 * (the depth-2 conflict was [city] vs [geo]; the depth-3 conflict
 * was [neighborhood] vs [industry]; this file consolidates the
 * neighborhood-cell route under the same param-name lineage as the
 * 3-segment cell page).
 *
 * Resolves the city-level cell via getCellBySlug, then applies the
 * (industry, neighborhood-character) multiplier to synthesize
 * neighborhood-level numbers.
 *
 * Unified onto the Atlas Page Kit (2026-06-13): this page now composes
 * the SAME answer-first masthead + decision stack the main cell page
 * uses (AnswerFirstMasthead + buildCellView + CellDecisionStack), so a
 * neighborhood cell reads in the exact content-map reading order as
 * every other business page, with a neighborhood-adjustment band sitting
 * above the masthead. London neighborhoods fill the curated exemplar
 * (the city cell is GB + the curated London entry resolves), so the
 * full stack renders; everywhere else the kit self-omits cleanly.
 */
import { notFound } from "next/navigation";
import { getCellBySlug } from "@/lib/cells";
import { iso2ToName } from "@/lib/countries";
import {
  industryToSlug,
  slugToIndustry,
  resolveToMeasuredIndustry,
} from "@/lib/taxonomy";
import {
  getNeighborhood,
  applyNeighborhoodMultiplier,
} from "@/lib/cities/neighborhoods";
import {
  getNeighborhoodMultiplier,
  hasNeighborhoodIntensity,
  tagLabel,
} from "@/lib/economics/neighborhood_multipliers";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CountryFlag } from "@/components/CountryFlag";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { computeBreakeven } from "@/lib/economics/breakeven";
import { getCityTier } from "@/lib/cities/city_tier";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { clampMargin } from "@/lib/finance/margin_floor";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import { getLondonEntry } from "@/lib/scores/cell_board";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { AnswerFirstMasthead, StickySectionNav, FreshnessStamp, FlagIt, HeroWash, ZoomControl, AddToWatch } from "@/components/kit";
import { buildCellView, cellViewNav } from "@/lib/cells/cell_view";
import { CellDecisionStack } from "@/components/cells/CellDecisionStack";
import { MakeItYoursPanel } from "@/components/cells/MakeItYoursPanel";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { SiteChrome } from "@/components/SiteChrome";

export const revalidate = 21600;
export const dynamicParams = true;
// Vercel Hobby defaults serverless function timeout to 10s, but cold
// cells_master queries can take 13-15s before warm-up. Raise to 60s.
export const maxDuration = 60;

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  asset_intensity?: number;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};
function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

function formatMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "-";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

/**
 * URL params: `geo` is the city slug, `industry` is the neighborhood
 * slug, `sub` is the actual industry slug. See file header for why.
 */
type Params = {
  country: string;
  geo: string;
  industry: string;
  sub: string;
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country, geo: city, industry: neighborhood, sub: industry } = await params;
  const ind = slugToIndustry(industry);
  if (!ind) return { title: "Page not found" };
  const cityName = city
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
  const nbName = neighborhood
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
  const title = `How much do ${ind.name.toLowerCase()} earn in ${nbName}, ${cityName}? | Margin Atlas`;
  const desc = `Typical revenue, what the owner keeps, and the spread for ${ind.name.toLowerCase()} in the ${nbName} area of ${cityName}, set against the city baseline.`;
  return {
    title,
    description: desc,
    alternates: {
      canonical: `/${country.toLowerCase()}/${city.toLowerCase()}/${neighborhood.toLowerCase()}/${industry.toLowerCase()}`,
    },
  };
}

async function NeighborhoodCellPageBody({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, geo: city, industry: neighborhood, sub: industry } = await params;

  // Resolve the neighborhood. Unknown city/neighborhood 404s.
  const nb = getNeighborhood(city, neighborhood);
  if (!nb) notFound();

  // Resolve the industry. Unknown industry 404s.
  const rawInd = slugToIndustry(industry);
  if (!rawInd) notFound();
  const ind = resolveToMeasuredIndustry(rawInd) || rawInd;

  // Get the city-level cell (always returns something via the synthesis
  // fallback in getCellBySlug), then apply the neighborhood-character
  // multiplier to scale revenue + percentiles + firm count.
  const cityCell = await getCellBySlug(country, city, industry);
  const cell = applyNeighborhoodMultiplier(cityCell, ind.id, nb.character);

  // Always-synthetic: even if the city cell was real, the neighborhood
  // multiplier introduces estimation, so this page is always modeled.
  cell.is_synthetic = true;
  cell.coverage_tier = "X";
  cell.coverage_source = `Estimated from ${cityCell.geo_name || city} city averages, adjusted for neighborhood character`;

  const cityName =
    cityCell.geo_name ||
    city
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" ");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: iso2ToName(country) || country.toUpperCase(),
      href: `/${country.toLowerCase()}`,
    },
    {
      label: cityName,
      href: `/${country.toLowerCase()}/${city.toLowerCase()}`,
    },
    {
      label: nb.name,
      href: `/${country.toLowerCase()}/${city.toLowerCase()}/${neighborhood.toLowerCase()}`,
    },
    { label: ind.name },
  ];

  // The neighborhood-vs-city revenue adjustment for this trade, when the
  // area carries a curated intensity row. Drives the adjustment band above
  // the masthead. Null for an uncurated neighborhood (then the band omits).
  const fwHasData = hasNeighborhoodIntensity(city, neighborhood);
  const fwMult = fwHasData
    ? getNeighborhoodMultiplier(city, neighborhood, ind.id)
    : null;
  const fwPct = fwMult ? Math.round((fwMult.final - 1) * 100) : 0;

  // -- The shared cell view-model inputs, computed exactly as the main cell
  // page computes them so the masthead + decision stack read identically.
  const marginRow = lookupIndustryMargin(cell.industry_id);
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  let payrollForMargin: number | null = null;
  if (cell.payroll_per_employee != null && cell.n_employees != null) {
    const empPerFirm =
      cell.n_enterprises && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises
          ? cell.n_employees
          : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    payrollForMargin = cell.payroll_per_employee * Math.max(1, empPerFirm);
  }
  const netProfitResult =
    grossRevenueForMargin && grossRevenueForMargin > 0
      ? estimateNetProfit({
          iso2: country.toUpperCase(),
          geoId: cell.geo_id || city,
          industryId: cell.industry_id || ind.id,
          sectorId: cell.sector_id || ind.sector_id || null,
          grossRevenue: grossRevenueForMargin,
          payroll: payrollForMargin,
        })
      : null;
  const rawNetMargin = netProfitResult?.net_margin ?? null;
  const netTakeHome = netProfitResult?.net_profit ?? null;
  const computedNetMargin =
    rawNetMargin != null ? clampMargin(rawNetMargin, "net", cell.industry_id || null) : null;

  const isLargerFirm =
    !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
  const annualIncome =
    econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  const adjustedNetTakeHome = resolveOwnerTakeHome({
    structuralNetProfit: netTakeHome,
    rawNetMargin,
    revenue: grossRevenueForMargin,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });

  // Break-even orders/day, place-adjusted by city tier.
  const cityTier = getCityTier(city);
  const be = cell.industry_id
    ? computeBreakeven(
        cell.industry_id,
        cell.revenue_per_firm ?? cell.rev_p50 ?? null,
        cityTier,
      )
    : null;
  const employeesEstimate =
    cell.n_employees ?? estimateEmployeesFromFirms(cell.industry_id, cell.n_enterprises);
  const wageEstimate =
    cell.payroll_per_employee ?? estimateWagePerEmployee(country, cell.industry_id, city);

  // The curated London exemplar resolves for GB cells whose industry has a
  // London activity entry; everywhere else this is null and the kit
  // self-omits the invented editorial. Same source the main cell page reads.
  const londonEntry = getLondonEntry(cell);
  const Le = londonEntry?.economics ?? null;
  // Trusted-local gate, mirrored from the main cell page: the modeled
  // neighborhood scaling means a non-London cell is never trusted-local
  // here, so the money sections only show when the London exemplar is on.
  const trustedLocalCell = isTrustedLocalCell(cell, ind.id);

  // Avoid a doubled place name when the district label already carries the city
  // (e.g. "City of London" beside "London" read as "City of London, London").
  const placeName = nb.name.includes(cityName) ? nb.name : `${nb.name}, ${cityName}`;
  const tradeName = ind.name;
  const tradeNoun = tradeName.toLowerCase().replace(/s$/, "");
  const viewRevenue = Le?.revenue ?? cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const viewNetMarginPct = Le
    ? Le.net_margin_pct
    : computedNetMargin != null
      ? computedNetMargin * 100
      : null;
  const viewTakeHome = Le?.owner_take_home ?? adjustedNetTakeHome ?? null;
  // A district carries no honest district-level firm count and must never borrow
  // the parent city's (a square-mile district is not the city's whole firm
  // count). The masthead "Firms in {place}" stat dashes instead.

  // Same business nearby: a district is NOT compared to whole cities. We pass no
  // peers AND suppress the London invented city-peers fallback, because scaling a
  // square-mile district against Manchester or Edinburgh is a like-for-like
  // category error. The cross-district read lives on the neighborhood OVERVIEW
  // page (the adjacent-district like-for-like), which stays on a single model.
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
    firms: null,
    breakInRating: null,
    isTrustedLocal: trustedLocalCell,
    costStructure: cell.cost_structure ?? null,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    employees: employeesEstimate ?? null,
    wagePerEmployee: wageEstimate ?? null,
    peers: [],
    narrative: null,
    suppressInventedPeers: true,
  });
  const navSections = cellViewNav(cellView);

  // -- Interaction layer (Phase 2). The same three client islands the main cell
  // page mounts, sharing the MakeItYoursPanel component. Each stays HONEST: the
  // panel mounts only with a real take-home + revenue (so it appears on a filled
  // London district and self-omits on a modeled one), the zoom links only the
  // altitudes that resolve from these params, the watch chip carries the real
  // neighbourhood-cell coordinates.
  const makeItYoursRevenue = viewRevenue;
  const makeItYoursTakeHome = cellView.ownerKeeps?.takeHome ?? null;
  const makeItYoursMarginPct =
    cellView.ownerKeeps?.marginPct ??
    (viewNetMarginPct != null ? viewNetMarginPct : null);
  // Annual rent + payroll from the held cost split, scaled to the costs portion
  // of revenue. Only when a real split rides on the cell; the levers self-hide
  // otherwise (a modeled district carries none, so the what-if shows the draw
  // lever alone).
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

  // Zoom ladder hrefs. Here the current cell is the trade in ONE neighbourhood
  // (the most specific altitude). The genuinely-different altitudes that resolve
  // from these params, broad to specific: the whole country (same trade at the
  // country-root cell), the whole city (the city-level cell for this trade), and
  // this trade here (the city cell is the "business" read of the place). City is
  // always a sub-country place, so the country link is always valid.
  // Note: in this route the actual industry slug is the `sub` param, renamed to
  // `industry` in the destructure above (the param-name lineage workaround). The
  // `neighborhood` variable is the `industry` param. Build the cell URLs from the
  // real slugs accordingly.
  const cellSlug = industry.toLowerCase();
  const cityCellHref = `/${country.toLowerCase()}/${city.toLowerCase()}/${cellSlug}`;
  const neighbourhoodHref = `/${country.toLowerCase()}/${city.toLowerCase()}/${neighborhood.toLowerCase()}/${cellSlug}`;
  const countryZoomHref = `/${country.toLowerCase()}/${country.toLowerCase()}/${cellSlug}`;

  // The watch item for this neighbourhood cell: stable id, label, canonical href,
  // a take-home/revenue sub, and the compare coordinates. One per page.
  const watchSub =
    makeItYoursTakeHome != null
      ? `Owner keeps about ${formatMoney(makeItYoursTakeHome)}`
      : viewRevenue != null
        ? `Typical ${formatMoney(viewRevenue)} revenue`
        : undefined;

  return (
    <div className="xl:flex xl:gap-16">
      <div className="xl:flex-1 xl:min-w-0">
        <Breadcrumb items={breadcrumbs} />

        {/* Neighborhood adjustment band: the one thing this page has that the
            city cell does not, sat above the masthead so the reader sees the
            local lift first, then the absolute numbers it produced below. The
            three components (commuter / tourism / tags) show what moved it. */}
        {fwMult && fwPct !== 0 ? (
          <section className="mb-6 rounded-lg border border-parchment bg-cream-100 px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <SectionEyebrow className="mb-1.5">
                  Versus the {cityName} baseline
                </SectionEyebrow>
                <p className="font-display text-lg font-medium leading-snug text-balance text-ink-900 md:text-xl">
                  A {tradeNoun} in {nb.name} runs about{" "}
                  <span
                    className={
                      fwPct > 0 ? "text-moss-700" : "text-atlas-700"
                    }
                  >
                    {fwPct > 0 ? "+" : ""}
                    {fwPct}%
                  </span>{" "}
                  on revenue against the rest of the city.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {fwMult.appliedTags
                    .filter((t) => t !== "residential_only")
                    .map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-parchment bg-cream-50 px-2.5 py-0.5 text-[11px] font-medium text-cocoa-700"
                      >
                        {tagLabel(t)}
                      </span>
                    ))}
                </div>
              </div>
              <dl className="flex shrink-0 gap-x-7 gap-y-3">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                    Commuter
                  </dt>
                  <dd className="mt-0.5 font-display text-lg font-medium tabular-nums text-ink-900">
                    {fwMult.commuter.toFixed(2)}x
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                    Tourism
                  </dt>
                  <dd className="mt-0.5 font-display text-lg font-medium tabular-nums text-ink-900">
                    {fwMult.tourism.toFixed(2)}x
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                    Local tags
                  </dt>
                  <dd className="mt-0.5 font-display text-lg font-medium tabular-nums text-ink-900">
                    {fwMult.tags.toFixed(2)}x
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        ) : null}

        {/* Zoom ladder + watch chip near the masthead. This is the most specific
            altitude (the trade in one neighbourhood); the ladder steps up to the
            city cell, the whole city, and the whole country, keeping the trade +
            place sticky. The watch chip keeps this district cell on the reader's
            shortlist. Both are client islands; the page stays server-rendered. */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <ZoomControl
            trade={tradeName}
            place={placeName}
            altitude="neighbourhood"
            sticky={false}
            hrefs={{
              country: countryZoomHref,
              city: cityCellHref,
              neighbourhood: neighbourhoodHref,
            }}
            /* Same squeeze as the trade page, and worse here: this ladder
               carries three zoom levels rather than two, so it clips more.
               See the note on that page for the measurement. */
            className="min-w-0 basis-full grow-0 sm:basis-0 sm:grow"
          />
          <AddToWatch
            item={{
              kind: "cell",
              slug: `${country.toLowerCase()}:${city.toLowerCase()}:${neighborhood.toLowerCase()}:${cellSlug}`,
              label: `${tradeName}, ${placeName}`,
              href: neighbourhoodHref,
              sub: watchSub,
              compare: { country, industry: cellSlug, region: city },
            }}
          />
        </div>

        {/* Answer-first masthead, the exact band the main cell page opens with:
            the assertion headline, the one-line read, the anchor revenue WITH
            its 7-gradation spread, the quiet stat row. The eyebrow carries the
            neighborhood coordinate so the reader knows the scope is the area,
            not the whole city. */}
        <HeroWash category="business">
          <AnswerFirstMasthead
            id="headline"
            eyebrow={`${tradeName} · ${nb.name} · ${cityName}`}
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
            masthead and ONLY when a real take-home + revenue are held (so a
            filled London district shows it, a modeled one self-omits). An extra
            interactive panel, not a content-map section, so no gated section id. */}
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

        {/* The decision stack: the honest take, the money picture, the
            editorial beats, in the content-map reading order. London is fully
            filled (the curated entry resolves); a modeled neighborhood cell
            shows a clean short page that leads with its honest take. */}
        <div className="mt-8">
          <CellDecisionStack view={cellView} />
        </div>

        {/* The quiet close: a freshness stamp (this is a modeled neighborhood
            read) and the honest flag-it invitation, then onward links. */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-parchment/60 pb-5">
          <FreshnessStamp updated="June 2026" tier="modeled" />
          <FlagIt />
        </div>

        {/* Onward navigation. */}
        <section className="mt-6 text-sm text-cocoa-700/80">
          <div className="flex flex-wrap items-center gap-3">
            <CountryFlag iso2={country.toUpperCase()} className="w-4" />
            <a
              href={`/${country.toLowerCase()}/${city.toLowerCase()}/${neighborhood.toLowerCase()}`}
              className="transition-colors hover:text-atlas-700"
            >
              Back to {nb.name}
            </a>
            <span aria-hidden>·</span>
            <a
              href={`/${country.toLowerCase()}/${city.toLowerCase()}`}
              className="transition-colors hover:text-atlas-700"
            >
              All of {cityName}
            </a>
            <span aria-hidden>·</span>
            <a
              href={`/industries/${industryToSlug(ind.id)}`}
              className="transition-colors hover:text-atlas-700"
            >
              {ind.name} worldwide
            </a>
          </div>
        </section>
      </div>
      <StickySectionNav sections={navSections} />
    </div>
  );
}

/* Chrome is opted into, not inherited. The site masthead, <main> and footer
   moved out of the root layout into <SiteChrome> so that the spine-2 trade
   page , which carries its own , can render without them. This tree sits
   outside src/app/(site)/ because it holds both kinds of route, so each page
   here asks for the chrome explicitly. */
export default function NeighborhoodCellPage(props: Parameters<typeof NeighborhoodCellPageBody>[0]) {
  return (
    <SiteChrome>
      <NeighborhoodCellPageBody {...props} />
    </SiteChrome>
  );
}
