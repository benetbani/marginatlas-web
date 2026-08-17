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
  tradeNounFor,
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
import { countryPagePath, resolveGeoPage } from "@/lib/cells/related_links";
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
import { AnswerFirstMasthead, StickySectionNav, FreshnessStamp, FlagIt, ZoomControl, AddToWatch } from "@/components/kit";
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
    /* NOINDEX, 2026-08-08, founder's instruction, and the reason is measured.
       These 25,320 pages share 95% of their body text with their siblings: a
       trade in a district is the city figure times a district character score,
       so the number moves and the page does not. Google's own remedy for a
       site sitting in "Discovered, currently not indexed" is to eliminate
       duplicate content rather than duplicate URLs, and 8% of ours was
       getting discovered.
       The route still RESOLVES so nothing already linked 404s, and the content
       is not lost: it moves to a district section on the city page. When that
       ships these should 301 there instead, which is the correct end state and
       needs the destination to exist first.
       The canonical stays self-referential deliberately. Pointing it at the
       city page while the page still renders district-specific figures would
       claim the two are the same document, which they are not yet. */
    robots: { index: false, follow: true },
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
  /* `ind` rolls UP to the nearest industry that has measured data: cafes,
     bars and bakeries all resolve to their parent, restaurants. That roll-up
     is right for every DATA lookup below, and it was also being used for the
     page's own name.
     The result, live on 25,320 neighbourhood pages until 2026-08-08: every one
     of them carried the same <h1>, "What a restaurant in <district> really
     earns", whatever trade the reader had asked for, while generateMetadata
     above used `slugToIndustry` and titled the same page "How much do cafes &
     coffee shops earn". The tab and the headline named different trades.
     `rawInd` is what the reader asked for and what the URL and the title
     already say, so display follows it and data keeps following `ind`.
     Note: `2026-08-08-seo-lattice.md`. */
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

  /* THE COUNTRY STEP AND THE CITY STEP, resolved rather than assembled.
     Both are read from the related-links module, the one place on the site that
     decides whether a country or a place has a page of its own, so this trail,
     the trade page's trail and the related tail can never disagree.

     Until 2026-08-01 both steps here were built from the slug pattern and hoped
     over, and both were wrong on the pages this route mostly serves:

       the city step   the two-segment form of a trade URL is served by the
                       REGION route, which lists US states and a country's
                       admin1 entities and calls notFound() for anything else.
                       A city is in none of those, and this route's middle
                       segment is ALWAYS a city, so the step was dead on every
                       neighbourhood cell page: the US list holds 51 entries and
                       none is a city, the UK list holds its four nations. The
                       city page is the honest destination and resolveGeoPage
                       finds it where one is published.
       the country     the first segment is whatever code the statistics carry,
                       which is not always the ISO-2 code the country route
                       serves. Greek cells are stored under EL; COUNTRIES holds
                       Greece as GR.

     A null from either is a real answer and renders as trail text. This route
     emits no BreadcrumbList, so there is no structured-data twin to renumber;
     the visible trail is the whole surface. */
  const countryPage = countryPagePath(country);
  const cityPage = resolveGeoPage(country, city);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: iso2ToName(country) || country.toUpperCase(),
      href: countryPage?.href,
    },
    {
      label: cityName,
      href: cityPage?.href,
    },
    {
      label: nb.name,
      /* Was the assembled /{country}/{city}/{district}, which is the TRADE
         route with a district slug in the industry position: 191 of the 194
         district slugs 404 there and three serve a trade page at 200. The
         comment on the onward-nav city link below calls this "the same defect
         as the trail above"; the trail is this array, and it was still
         carrying it.
         It matters twice here. A breadcrumb stays in place whether or not it
         opens, so the crumb was always going to render, and this array is also
         what the BreadcrumbList JSON-LD is built from, so the wrong URL was
         being published to machines as well as offered to readers. */
      href: `/cities/${city.toLowerCase()}/neighborhoods`,
    },
    /* rawInd: the breadcrumb's last crumb is this page, and this page is the
       trade in the URL, not the parent its data rolls up to. */
    { label: rawInd.name },
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
  /* rawInd, not ind: the reader asked for this trade, the URL says it and the
     <title> says it. See the roll-up note where `ind` is derived. */
  const tradeName = rawInd.name;
  const tradeNoun = tradeNounFor(tradeName);
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
      {/* `relative` lifts the furniture in this column that is not a card:
          the breadcrumb, the zoom row and the closing stamp. AtlasFrame's fixed
          layers sit at z-index 0 and paint above any static sibling. */}
      <div className="relative xl:flex-1 xl:min-w-0">
        <Breadcrumb items={breadcrumbs} />

        {/* Neighborhood adjustment band: the one thing this page has that the
            city cell does not, sat above the masthead so the reader sees the
            local lift first, then the absolute numbers it produced below. The
            three components (commuter / tourism / tags) show what moved it. */}
        {fwMult && fwPct !== 0 ? (
          <section className="atlas-card mb-6 px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <SectionEyebrow className="mb-1.5">
                  Versus the {cityName} baseline
                </SectionEyebrow>
                {/* A figure sitting on the model's clip is not a measurement,
                    it is the bound. Five of seven sampled districts printed an
                    identical "+200%" on 2026-08-08, which is exactly the 3.0
                    ceiling, so three of them reading the same was an artifact
                    rather than a tie. "at least" is the honest word for it, and
                    "runs about" is wrong once the value is bounded.
                    Note: `2026-08-08-seo-lattice.md` measurement, FOUND.md item. */}
                <p className="font-display text-lg font-medium leading-snug text-balance text-ink-900 md:text-xl">
                  A {tradeNoun} in {nb.name} runs{" "}
                  {fwMult.clipped ? "at least" : "about"}{" "}
                  {/* THE GREEN IS GONE, 2026-08-17. This read
                      `fwPct > 0 ? "text-moss-700" : "text-atlas-700"`, so every
                      district above its city baseline printed its delta in
                      moss, a green, which section 8 of the charter bans
                      outright and verify_palette_membership names as the banned
                      hue.

                      The SIGNAL is kept, not deleted. What the colour carries
                      is which side of the city baseline this district sits on,
                      and that stays a two-state distinction: above reads in
                      terracotta, below in the muted step this band already uses
                      for its own labels. The direction of the pair is the
                      founder's ratified grammar rather than a fresh choice: the
                      diverging bars he ruled on 2026-08-09 fill every
                      above-average row in terracotta, and the same ruling took
                      the traffic light off CitySignaturePanel's score bars.
                      Terracotta on the premium is also what this band is FOR,
                      since it sits above the masthead precisely so the reader
                      sees the local lift first.

                      Nothing about the direction rests on the hue in any case:
                      the figure prints its own sign one character to the left. */}
                  <span
                    className={
                      fwPct > 0 ? "text-atlas-700" : "text-cocoa-700"
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
                        className="rounded-full border border-parchment bg-white px-2.5 py-0.5 text-[11px] font-medium text-cocoa-700"
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
        {/* THE WASH IS GONE, same removal as the parent cell page. .atlas-wash
            paints var(--atlas-surface-paper) opaque as its base layer under the
            radial tint, so it covered the site photograph across the whole
            column for the height of the masthead. .atlas-card is the surface the
            city and cell mastheads already use, and it is position:relative, so
            it is painted rather than covered by the frame's fixed layers. */}
        <div className="atlas-card px-5 py-5 md:px-7 md:py-6">
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
        </div>

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
            {/* THE SAME DEFECT THE COMMENT BELOW DESCRIBES, one link earlier.
                This assembled /{country}/{city}/{district}, and there is no
                district route: three segments is the TRADE route, so the
                district slug arrived where an industry belongs.

                Measured across all 194 district slugs: 191 answered 404, and
                three answered 200 with a trade page, which is the worse half.
                "Back to Garden District" opened building and garden supply
                stores. Business Bay opened office and business support.
                Short North opened short-term rental management. A reader is
                returned to a business they never asked about, on a page that
                renders perfectly.

                The districts of a city live on its neighborhoods hub, and this
                page only exists because that scheme holds this district, so
                the link is safe by construction. */}
            <a
              href={`/cities/${city.toLowerCase()}/neighborhoods`}
              className="transition-colors hover:text-atlas-700"
            >
              Back to {nb.name}
            </a>
            {/* The city step, resolved rather than assembled, and DROPPED
                outright when nothing resolves. Same defect as the trail above,
                and the same resolver closes it: this route's middle segment is
                always a city, the two-segment form is served by the region
                route, and a city is in no region list. Dropped rather than
                rendered as plain text because a crumb is a position in a trail
                and has to stay whether or not it can be opened, while this is a
                row of onward moves and a move you cannot make is not one.
                Note the wrongness this closes is not only a 404: a city and a
                region can share a slug, so on a New York neighbourhood page the
                assembled form answered 200 with the STATE's page. */}
            {cityPage ? (
              <>
                <span aria-hidden>·</span>
                <a
                  href={cityPage.href}
                  className="transition-colors hover:text-atlas-700"
                >
                  All of {cityName}
                </a>
              </>
            ) : null}
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
