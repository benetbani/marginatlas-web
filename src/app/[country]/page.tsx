/**
 * Country landing page - /us, /gb, /de, /fr, /jp, etc.
 *
 * Rebuilt on the Atlas Page Kit (design-system 12.x) to the content-map reading
 * order (COUNTRY PAGE): an answer-first masthead, the consolidated DECISIVE READ
 * (tax + cost to register + payroll + time-to-start), the honest take, the
 * how-hard-to-hire read, the like-for-like NEIGHBOUR FACTS table (the page's
 * biggest gap and reason to exist, never a money rank across borders), then best
 * and worst city, country character, and the compare CTA. The United Kingdom is
 * the fully-filled exemplar; everywhere else fills from real data and self-omits.
 *
 * The pure view model lives in src/lib/countries/country_view.ts; this page does
 * the heavy data wiring (the snapshot, the tax regime, and the neighbour facts)
 * and hands the view to the kit. One seated-card shell throughout; no dash board.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopIndustriesForCountry, getCellBySlug, withBudget, slugify } from "@/lib/cells";
import { getCitiesForCountry } from "@/lib/cities";
import { COUNTRIES, industryToSlug } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { hasRegionalCoverage } from "@/lib/coverage/regional";
import { getAdmin1Regions } from "@/lib/coverage/admin1";
import { COUNTRY_PAGE_SECTIONS } from "@/lib/page-layout/section-order";
import { BusinessFormationCosts } from "@/components/cities/BusinessFormationCosts";
import {
  getCountryEconomicsSnapshot,
  type CountryEconomicsSnapshot,
} from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import { getBrainGdpPerCapitaByIso2 } from "@/lib/external/brain_data";
import { getSmbRegime, getVatRow, type SmbRegime } from "@/lib/tax/smb_effective_rates";
import { getCountryRates, getTypicalFormationCostUsd } from "@/lib/tax/country_rates";
import { CountryMastheadImage } from "@/components/countries/CountryMastheadImage";
import { CountryAtAGlance } from "@/components/CountryAtAGlance";
import { buildEasiestToBreakIn, type PlaceActivityCell } from "@/lib/scores/country_board";
import { EasiestToBreakIn } from "@/components/countries/EasiestToBreakIn";
import {
  HonestTakeBox,
  ComparisonTable,
  ComparisonBars,
  MinimumWage,
  WhatLocalsKnow,
  StickySectionNav,
  FreshnessStamp,
  FlagIt,
  BeatCard,
  GutCheck,
  SectionEmpty,
  LicenceList,
  VsWorld,
  OneThing,
  AddToWatch,
} from "@/components/kit";
import { CountryCharacter } from "@/components/countries/CountryCharacter";
import {
  buildCountryView,
  countryViewNav,
  NEIGHBOUR_GROUPS,
  type NeighbourFacts,
} from "@/lib/countries/country_view";

// Keep section-order constant referenced for type checking.
void COUNTRY_PAGE_SECTIONS;

export const revalidate = 86400;
export const dynamicParams = true;
export const maxDuration = 60;

type Params = { country: string };

const PRERENDER_COUNTRIES = [
  "US", "GB", "DE", "FR", "CA", "AU", "IT", "ES", "NL",
  "JP", "IN", "BR", "MX", "SE", "PL", "IE", "NZ", "SG",
];
export async function generateStaticParams(): Promise<Params[]> {
  const covered = new Set(COUNTRIES.map((c) => c.code));
  return PRERENDER_COUNTRIES.filter((code) => covered.has(code)).map(
    (code) => ({ country: code.toLowerCase() }),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  const c = COUNTRIES.find((c) => c.code === iso2);
  if (!c) return { title: "Country not found | Margin Atlas" };
  return {
    title: `${c.name}: small-business benchmarks | Margin Atlas`,
    description: `Typical revenue, employment, and wages for small businesses in ${c.name}.`,
    alternates: { canonical: `/${country.toLowerCase()}` },
  };
}

/** A country's set-up facts, gathered from the accessors the page already uses. */
function gatherFacts(iso2: string, name: string): NeighbourFacts {
  const snap = getCountryEconomicsSnapshot(iso2);
  const regime = getSmbRegime(iso2);
  const rates = getCountryRates(iso2);
  return {
    iso2,
    name,
    smbRate: regime?.effective_rate ?? null,
    payrollRate: rates.employerSocial ?? null,
    registrationCostUsd: getTypicalFormationCostUsd(iso2),
    daysToStart: snap.daysToStart,
    avgMonthlySalary: snap.avgMonthlySalary,
  };
}

/** A pre-formatted compact USD string for the vs-the-world figures. */
function usdCompactDisplay(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

/**
 * The global median GDP per capita, computed once from the held brain GDP map.
 * A real reference figure (the median of every country's latest GDP per capita),
 * so the vs-the-world bar compares the country against a true global midpoint,
 * never a fabricated number. Memoized at module scope.
 */
let _globalMedianGdp: number | null | undefined;
function getGlobalMedianGdpPerCapita(): number | null {
  if (_globalMedianGdp !== undefined) return _globalMedianGdp;
  const values = Array.from(getBrainGdpPerCapitaByIso2().values())
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);
  if (values.length === 0) {
    _globalMedianGdp = null;
    return _globalMedianGdp;
  }
  const mid = Math.floor(values.length / 2);
  _globalMedianGdp =
    values.length % 2 === 0 ? Math.round((values[mid - 1] + values[mid]) / 2) : values[mid];
  return _globalMedianGdp;
}

/**
 * Three plain questions before committing, derived from the country's own held
 * facts. Each question is generic-but-true (about the market, the customer, and
 * the setup speed), never a fabricated specific. Always returns three.
 */
function buildCountryGutCheck(
  countryName: string,
  snapshot: CountryEconomicsSnapshot,
  regime: SmbRegime | null,
): string[] {
  const qs: string[] = [];
  qs.push(
    `Can the local customer in ${countryName} actually pay the price your numbers need, week in and week out?`,
  );
  if (regime != null) {
    qs.push(
      "After the business tax and the payroll on every wage, is there still a real margin left, or only one at hobby scale?",
    );
  } else {
    qs.push(
      "Do you know what the business tax and the payroll on-cost will take before you have signed anything?",
    );
  }
  if (
    snapshot.daysToStart != null &&
    Number.isFinite(snapshot.daysToStart) &&
    snapshot.daysToStart > 21
  ) {
    qs.push(
      "Registering here is not instant, so have you planned for the weeks of paperwork before you can legally trade?",
    );
  } else {
    qs.push(
      "Registering is the easy part; have you tested whether the demand is there before you commit a lease?",
    );
  }
  return qs;
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) notFound();

  const countryName = meta.name;
  const topIndustries = await getTopIndustriesForCountry(iso2, 18);

  // Coverage signals retained (a future regions view wraps on these).
  const showRegions = hasRegionalCoverage(iso2);
  void showRegions;
  const regions = getAdmin1Regions(iso2);
  void regions;

  // The data the country page already loads. No new query for the rebuild.
  const snapshot = getCountryEconomicsSnapshot(iso2);
  const smbRegime = getSmbRegime(iso2);
  const vatRow = getVatRow(iso2);
  const countryRates = getCountryRates(iso2);
  const registrationCostUsd = getTypicalFormationCostUsd(iso2);

  // The wage floor + typical pay for the MinimumWage block. Both come from the
  // same held profile row (annual USD, one currency basis), so they are strictly
  // like-for-like. getCountryProfile returns a generic fallback for countries it
  // does not hold, so we only trust a profile whose own iso2 matches this country
  // and never pass the fallback's figures (that would be a fabricated wage). When
  // not held, both stay null and the block shows its honest empty line.
  const profile = getCountryProfile(iso2);
  const profileHeld = profile.iso2.toUpperCase() === iso2;
  const minWageAnnualUsd =
    profileHeld && profile.minimum_wage_annual_usd > 0
      ? profile.minimum_wage_annual_usd
      : null;
  const typicalPayAnnualUsd =
    profileHeld && profile.median_wage_full_time_usd > 0
      ? profile.median_wage_full_time_usd
      : null;

  // The geo segment every cell-page link uses: California stands in for the US
  // (deepest state coverage), the country-name slug elsewhere.
  const placeGeo = iso2 === "US" ? "california" : slugify(meta.name);

  // The down-link target for the decisive read: the densest activity's cell page.
  const taxTopActivity = topIndustries[0]
    ? {
        name: topIndustries[0].industry_name,
        href: `/${iso2.toLowerCase()}/${placeGeo}/${industryToSlug(topIndustries[0].industry_id)}`,
      }
    : null;

  // Neighbour facts (the page's biggest gap): resolve a few comparable
  // neighbours' real set-up facts. Pure local-table reads, no Supabase, so this
  // adds no query cost. The view maps them into a like-for-like FACTS table with
  // noLeaderMark, so a raw figure is never crowned across price regimes.
  const neighbourCodes = (NEIGHBOUR_GROUPS[iso2] ?? [])
    .map((code) => COUNTRIES.find((c) => c.code === code))
    .filter((c): c is (typeof COUNTRIES)[number] => c != null)
    .slice(0, 4);
  const neighbourFacts: NeighbourFacts[] = neighbourCodes.map((c) =>
    gatherFacts(c.code, c.name),
  );
  const selfFacts = gatherFacts(iso2, countryName);

  // The view model: pure mapping of the resolved facts into kit props. The UK is
  // the fully-filled exemplar; everywhere else fills from real data, self-omits
  // the invented beats, and the 185 thin-coverage countries get an honest
  // thin-coverage line in place of the old shared anchor paragraph.
  const view = buildCountryView(
    {
      iso2,
      countryName,
      snapshot,
      regime: smbRegime,
      vat: vatRow,
      payrollRate: countryRates.employerSocial,
      registrationCostUsd,
      minWageAnnualUsd,
      typicalPayAnnualUsd,
      topActivity: taxTopActivity,
      selfFacts,
      neighbours: neighbourFacts,
    },
    meta.quality ?? null,
  );

  // "The easiest businesses to break into here" panel: ranks this country's own
  // activities by break-in rating, resolving the same destination cell each
  // business links to (a bounded, budgeted set of reads). Self-omits a thin
  // ranking. Preserved exactly from the prior page (data-sanity guard intact).
  const resolvedActivities: PlaceActivityCell[] = await Promise.all(
    topIndustries.map(async (ind) => ({
      industryId: ind.industry_id,
      industryName: ind.industry_name,
      cell: await withBudget(
        getCellBySlug(iso2.toLowerCase(), placeGeo, industryToSlug(ind.industry_id), {
          sizeBand: null,
          year: null,
        }),
        null,
        4_000,
        `easiest-break-in:${iso2}/${placeGeo}/${ind.industry_id}`,
      ),
    })),
  );
  const easiestBreakIn = buildEasiestToBreakIn({
    iso2,
    geo: placeGeo,
    activities: resolvedActivities,
    econ: { avgMonthlySalary: snapshot.avgMonthlySalary },
  });

  // Regions-and-cities nav: each region a non-link heading, its cities clickable.
  const allCities = getCitiesForCountry(iso2);
  const citiesByRegion = (() => {
    const groups = new Map<string, { name: string; slug: string }[]>();
    for (const c of allCities) {
      const region = c.region_name?.trim() || countryName;
      if (!groups.has(region)) groups.set(region, []);
      groups.get(region)!.push({ name: c.name, slug: c.slug });
    }
    return Array.from(groups.entries()).map(([region, cities]) => ({
      region,
      cities,
    }));
  })();

  // Cities render as UNIFORM, equal-weight cards (no good-vs-bad ranking), so
  // the page no longer scores cities; it only needs to know whether any city is
  // held to choose between the cards and the calm placeholder.
  const hasCities = citiesByRegion.length > 0;

  // Vs-the-world read: this country's GDP per capita (held figure preferred,
  // brain GDP otherwise) against the global median GDP per capita, computed once
  // from the held country profiles. Both are real figures; VsWorld self-omits to
  // its honest "not held yet" line if either is missing.
  const gdpProfile = getCountryProfile(iso2);
  const gdpProfileHeld = gdpProfile.iso2.toUpperCase() === iso2;
  const gdpPerCapita =
    gdpProfileHeld && gdpProfile.gdp_per_capita_usd_nominal > 0
      ? gdpProfile.gdp_per_capita_usd_nominal
      : snapshot.gdpPerCapita;
  const globalMedianGdpPerCapita = getGlobalMedianGdpPerCapita();

  // Gut check: three plain, country-derived questions before committing. Built
  // from the same held facts the decisive read uses, never fabricated specifics.
  const gutCheckQuestions = buildCountryGutCheck(countryName, snapshot, smbRegime);

  // The watch item for this country. A country is a place, so it rides the
  // "city" kind (which the tray labels "Place"); the iso2-keyed slug keeps it
  // distinct from any real city row, and the sub line names it a country so the
  // tray reads honestly. Links back to this same page.
  const watchItem = {
    kind: "city" as const,
    slug: `country-${iso2.toLowerCase()}`,
    label: countryName,
    href: `/${iso2.toLowerCase()}`,
    sub: "Country",
  };

  const nav = countryViewNav(
    view,
    true, // formation is folded into the decisive read (no own nav stop)
    easiestBreakIn.length > 0,
    hasCities,
  );

  return (
    <div className="xl:flex xl:gap-16">
      <div className="xl:min-w-0 xl:flex-1">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-ink-700/70">
          <a href="/" className="hover:text-atlas-600">Home</a>
          <span className="mx-2">/</span>
          <span className="inline-flex items-center gap-1">
            <CountryFlag iso2={iso2} className="w-4" />
            <span>{meta.name}</span>
          </span>
        </nav>

        {/* 1. Hero: the country photo as a faded background (no colour wash),
            the flag, the H1 = JUST the country name (keep id="headline"), and one
            fixed subtitle identical on every country. No opinion headline, no tax
            anchor here: the metrics live in the scorecard directly below. */}
        <section id="hero" className="relative mb-6 overflow-hidden rounded-2xl border border-parchment">
          <CountryMastheadImage iso2={iso2} countryName={meta.name} />
          <div className="relative px-5 pt-7 pb-6 md:px-8 md:pt-9 md:pb-7">
            <div className="mb-4 flex items-center gap-3">
              <CountryFlag iso2={iso2} className="w-9 md:w-11" />
              <SectionEyebrow size="md">Small-business economics</SectionEyebrow>
            </div>
            <h1
              id="headline"
              className="font-display text-3xl font-semibold tracking-tight text-balance text-ink-900 sm:text-4xl md:text-5xl"
            >
              {meta.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-700 md:text-lg">
              What it costs, what you keep, and how hard it is to run a small
              business here.
            </p>
            {/* Keep this country on the watch list. A client island; the page
                stays server-rendered, it flips in place with no navigation. */}
            <div className="mt-5 flex items-center gap-3">
              <AddToWatch item={watchItem} />
            </div>
          </div>
        </section>

        {/* 2. Scorecard: the eight headline facts, directly under the hero. Real
            where held, a clearly-tagged sample tile where a metric is not. */}
        <CountryAtAGlance iso2={iso2} />

        <div className="mt-6 space-y-6 md:space-y-8">
          {/* 3. The decisive read: tax + time-to-start + payroll, as steps, with
              the per-tier formation cost table folded directly beneath (its spec
              home), so the cost-to-register figure shows once with its tier
              breakdown rather than restated as a separate step and again two
              sections later. The page's lead data beat. */}
          {view.decisive ? (
            <BeatCard
              id="decisive"
              eyebrow="The decisive read"
              heading={view.decisive.heading}
              feature
            >
              {view.decisive.lede ? (
                <p className="max-w-2xl text-sm leading-relaxed text-graphite md:text-base">
                  {view.decisive.lede}
                </p>
              ) : null}
              <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {view.decisive.steps.map((s, i) => (
                  <div key={i}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                      {s.label}
                    </dt>
                    <dd className="mt-0.5 font-display text-2xl font-semibold tabular-nums tracking-tight text-ink-900">
                      {s.value}
                    </dd>
                    {s.hint ? (
                      <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-cocoa-700">
                        {s.hint}
                      </p>
                    ) : null}
                  </div>
                ))}
              </dl>
              {view.decisive.salesTaxNote ? (
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cocoa-700">
                  {view.decisive.salesTaxNote}
                </p>
              ) : null}
              {/* Folded-in: the legal-tier formation cost table. This is the one
                  place the cost-to-register figure appears, so it never doubles
                  with a standalone section below. */}
              <div className="mt-6 border-t border-parchment/60 pt-6">
                <BusinessFormationCosts countryIso2={iso2} countryName={meta.name} />
              </div>
              {view.decisive.downLink ? (
                <p className="mt-3 text-sm">
                  <a
                    href={view.decisive.downLink.href}
                    className="font-medium text-atlas-700 transition-colors hover:text-atlas-900"
                  >
                    {view.decisive.downLink.label}
                  </a>
                </p>
              ) : null}
            </BeatCard>
          ) : (
            <BeatCard
              id="decisive"
              eyebrow="The decisive read"
              heading={`What it costs to run a business in ${meta.name}`}
              feature
            >
              <div id="formation">
                <BusinessFormationCosts countryIso2={iso2} countryName={meta.name} />
              </div>
            </BeatCard>
          )}

          {/* 4. How hard it is to hire here: staff cost + typical pay + wage
              floor. Self-omits when no pay or payroll figure exists. */}
          {view.hire ? (
            <BeatCard id="hire" eyebrow="Hiring here" heading={view.hire.heading}>
              {view.hire.lede ? (
                <p className="max-w-2xl text-sm leading-relaxed text-graphite md:text-base">
                  {view.hire.lede}
                </p>
              ) : null}
              <ul className="mt-3 space-y-2.5">
                {view.hire.points.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-ink-900 md:text-base"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cocoa-500"
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {/* Beside the bullets, where two or more real payroll rates exist:
                  the employer on-cost across this country and its neighbours, as
                  a like-for-like bar read. noLeaderMark so no regime is crowned;
                  the home country is the lone tinted bar. Self-omits otherwise,
                  so the placeholder and the bullet-only read are untouched. */}
              {view.hire.payrollCompare ? (
                <div className="mt-6 border-t border-parchment/60 pt-5">
                  <ComparisonBars
                    label="Payroll on-cost, vs neighbours"
                    items={view.hire.payrollCompare.items.map((it) => ({
                      label: it.label,
                      value: it.pct,
                      highlight: it.home,
                    }))}
                    format={(n) => `${Math.round(n)}%`}
                    noLeaderMark
                    caveat={view.hire.payrollCompare.caveat}
                  />
                </div>
              ) : null}
            </BeatCard>
          ) : (
            <SectionEmpty
              id="hire"
              eyebrow="Hiring here"
              heading="How hard it is to hire here"
              place={meta.name}
            />
          )}

          {/* 4b. The wage floor beside typical pay, both on the same held basis
              (annual USD). MinimumWage owns its own eyebrow and its own internal
              <section>, so it rides a bare seated wrapper on the exact BeatCard
              surface (the same convention the break-in panel uses). The wrapper
              carries no section id: it is a flourish folded under the hire read,
              not a numbered skeleton band, so it stays out of the section gate and
              the sticky nav. The block renders its honest empty line when a real
              wage figure is not held, so it is always present. */}
          <div className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
            <MinimumWage
              eyebrow="Wage floor"
              floor={view.minWage.floor}
              real={view.minWage.real}
              unit={view.minWage.unit}
              period={view.minWage.period}
              note={view.minWage.note}
            />
          </div>

          {/* 5. Compare to neighbours: the like-for-like FACTS table. Never an
              ordinal money rank across borders, so the kit gets noLeaderMark.
              (Cost to open is no longer a standalone section here: the formation
              tier table is folded under the decisive read above, so the cost
              figure shows once.) */}
          {view.neighbours ? (
            <ComparisonTable
              id="neighbours"
              eyebrow="Vs neighbours"
              heading={view.neighbours.heading}
              lede={view.neighbours.lede}
              metricLabel="Set-up fact"
              // Cross-border, different price regimes: never crown a cell. The
              // home country wears the subject accent so the reader's own column
              // is unmistakable without a ranking.
              noLeaderMark
              columns={view.neighbours.columns.map((c) => ({
                key: c.key,
                label: c.label,
                sub: c.sub,
                subject: c.key === view.neighbours!.subjectKey,
              }))}
              rows={view.neighbours.rows.map((r) => ({
                label: r.label,
                hint: r.hint,
                display: r.cells,
                values: {},
                noLeader: true,
              }))}
              footnote={view.neighbours.footnote}
              // The neighbours section is required-always-present; keep the real
              // table even if a column is sparse (the view already guarantees
              // >= 2 columns and >= 2 filled rows) so the anchor never vanishes.
              keepWhenThin
            />
          ) : (
            <SectionEmpty
              id="neighbours"
              eyebrow="Vs neighbours"
              heading="How this country compares to its neighbours"
              place={meta.name}
            />
          )}

          {/* 6. Licences: what you need to open one here. A country-wide licence
              list is not held as data yet, so LicenceList renders its own honest
              empty line (it varies by council) as the skeleton, never a fabricated
              permit row. Wrapped in the shared seated surface with a plain
              heading so it always renders and reads as one hand with the rest. */}
          <section
            id="licences"
            className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
          >
            <LicenceList
              title={`What you need to open one in ${meta.name}`}
              emptyNote="The exact permits depend on the trade and the local authority, so they are not held as one country-wide list. Open a specific business to see what it needs."
            />
          </section>

          {/* 7. The easiest businesses to break into here (ranks ACTIVITIES, not
              cities). EasiestToBreakIn renders its own card-internal header
              ("Where it is easiest to get started in X"), so it rides a bare
              seated <section> rather than a BeatCard, which would stack a second
              eyebrow on top of the component's own. Same convention the city page
              uses for the header-owning CityPeers panel. The card class string
              here is exactly the BeatCard surface (rounded-lg + parchment border +
              cream-50 + shadow-subtle), so the grammar still reads as one hand. */}
          {easiestBreakIn.length > 0 ? (
            <section
              id="break-in"
              className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
            >
              <EasiestToBreakIn
                rows={easiestBreakIn}
                placeName={meta.name}
                showScores={easiestBreakIn.some((r) => r.openingHref != null)}
              />
            </section>
          ) : null}

          {/* 7. Cities: UNIFORM, equal-weight city cards grouped by region. The
              old best-city / toughest-city good-vs-bad ranking is gone (calling
              one city in a country good and another bad is self-defeating). Every
              card is the same size, plain heading, no corporate eyebrow. Always
              present: the calm placeholder shows when no city is held. */}
          {hasCities && citiesByRegion.length > 0 ? (
            <BeatCard id="cities" eyebrow="Cities" heading={`Cities of ${countryName}`}>
              <p className="max-w-2xl text-sm leading-relaxed text-graphite md:text-base">
                Step into a city for the local read on rent, pay, and what an
                owner keeps. Every place here is shown the same way, no ranking.
              </p>
              <div className="mt-5 space-y-6">
                {citiesByRegion.map((group) => (
                  <div key={group.region}>
                    <h3 className="text-sm font-semibold text-ink-900">
                      {group.region}
                    </h3>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {group.cities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/${iso2.toLowerCase()}/${city.slug}/restaurants`}
                          className="block rounded-lg border border-parchment bg-white px-4 py-3 text-sm font-medium text-ink-900 transition-colors hover:border-atlas-500 hover:text-atlas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500 focus-visible:ring-offset-2"
                        >
                          {city.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </BeatCard>
          ) : (
            <SectionEmpty
              id="cities"
              eyebrow="Cities"
              heading={`The cities of ${countryName}`}
              place={countryName}
            />
          )}

          {/* 8. Country character: demographics, culture, government, in a
              dedicated country-scale layout (KEEP AS IS). Always present
              (CountryCharacter renders the calm placeholder when no read held). */}
          <CountryCharacter iso2={iso2} countryName={meta.name} id="character" />

          {/* 9. What locals know: a SHORT visual list (exemplar-only invented
              detail; self-omits where not held). */}
          {view.whatLocals ? (
            <WhatLocalsKnow id="locals" notes={view.whatLocals} />
          ) : null}

          {/* 10. Vs the world: a small, honest one-glance read of this country's
              GDP per capita against the global median. Self-omits to its calm
              "not held yet" line when either figure is missing, so it always
              renders without a fabricated bar. */}
          <div className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
            <VsWorld
              id="vs-world"
              here={gdpPerCapita}
              world={globalMedianGdpPerCapita}
              metric="GDP per capita"
              hereLabel={meta.name}
              hereDisplay={gdpPerCapita != null ? usdCompactDisplay(gdpPerCapita) : null}
              worldDisplay={
                globalMedianGdpPerCapita != null
                  ? usdCompactDisplay(globalMedianGdpPerCapita)
                  : null
              }
              caveat="Not adjusted for local prices. A bigger number means a richer customer, not an easier market."
            />
          </div>

          {/* 11. The honest take: the brand through-line, kept SMALL and moved
              down here (not at the top). Always present: a thin-coverage country
              gets an honest line, a country with no read gets the placeholder. */}
          {view.honestTake ? (
            <HonestTakeBox
              id="honest-take"
              verdict={view.honestTake.verdict}
              points={view.honestTake.points}
            >
              {view.honestTake.body}
            </HonestTakeBox>
          ) : (
            <SectionEmpty
              id="honest-take"
              eyebrow="The honest take"
              heading={`The honest read on ${meta.name}`}
              place={meta.name}
            />
          )}

          {/* 12. Gut check: three plain questions before you commit, a small
              visual (renamed from the old contrarian beat's slot). Self-omits
              only if there is nothing to ask. */}
          <GutCheck
            id="gut-check"
            heading={`Three questions before you start in ${meta.name}`}
            questions={gutCheckQuestions}
          />

          {/* The one thing to remember: the page's last word, reused from the
              honest-take verdict. Shows its honest line when no read is held. */}
          <OneThing id="one-thing" lastChecked="June 2026">
            {view.honestTake ? view.honestTake.verdict : null}
          </OneThing>

          {/* 14. Related: the Compare CTA, the closing beat. On the shared card
              grammar (BeatCard). Carries the canonical "related" anchor. */}
          <BeatCard
            id="related"
            eyebrow="Next move"
            heading={`Put ${meta.name} against its peers`}
          >
            <p className="max-w-2xl text-sm leading-relaxed text-ink-800">
              Pick any activity and set {meta.name} side by side with up to three
              other countries: revenue, the cost stack, and what an owner keeps.
            </p>
            <a
              href="/compare"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-atlas-600 px-4 py-2 text-sm font-medium text-cream-50 transition hover:bg-atlas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500 focus-visible:ring-offset-2"
            >
              Open Compare
            </a>
          </BeatCard>

          {/* Closing furniture: the freshness stamp and the honest flag-it line. */}
          <div className="space-y-3 pt-1 pb-8">
            <FreshnessStamp updated="June 2026" tier={view.masthead.tier} />
            <FlagIt />
          </div>
        </div>
      </div>

      <StickySectionNav sections={nav} />
    </div>
  );
}
