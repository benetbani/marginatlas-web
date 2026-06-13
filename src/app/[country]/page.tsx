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
import { getCountryAnchor } from "@/lib/content/country-anchors";
import { BusinessFormationCosts } from "@/components/cities/BusinessFormationCosts";
import { getCountryEconomicsSnapshot, getCityEconBySlug } from "@/lib/economics/country_metrics";
import { getSmbRegime, getVatRow } from "@/lib/tax/smb_effective_rates";
import { getCountryRates, getTypicalFormationCostUsd } from "@/lib/tax/country_rates";
import { CountryMastheadImage } from "@/components/countries/CountryMastheadImage";
import { buildEasiestToBreakIn, type PlaceActivityCell } from "@/lib/scores/country_board";
import { EasiestToBreakIn } from "@/components/countries/EasiestToBreakIn";
import { buildCityScore } from "@/lib/scores/city_board";
import {
  AnswerFirstMasthead,
  HonestTakeBox,
  LikeForLikeTable,
  WhatLocalsKnow,
  ContrarianInsight,
  StickySectionNav,
  FreshnessStamp,
  FlagIt,
  BeatCard,
  SectionEmpty,
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

  // Best/worst city highlight: each city scored on real per-city economics.
  // Self-omits when fewer than 2 cities produce a score. Preserved exactly.
  const cityScores: { name: string; slug: string; score: number }[] = [];
  for (const c of allCities) {
    const eco = getCityEconBySlug(c.slug);
    const r = buildCityScore({
      city: {
        slug: c.slug,
        popM: c.population / 1_000_000,
        avgGrossSalaryUsdYear: eco.avgGrossSalaryUsdYear,
        costOfLivingIndex: eco.costOfLivingIndex,
        touristArrivalsM: null,
      },
      econ: {
        selfEmploymentPct: snapshot.selfEmploymentPct,
        avgMonthlySalary: snapshot.avgMonthlySalary,
        netWealthPerAdult: snapshot.netWealthPerAdult,
      },
    });
    if (r != null) {
      cityScores.push({ name: c.name, slug: c.slug, score: r.score });
    }
  }
  const bestCity =
    cityScores.length >= 2
      ? cityScores.reduce((a, b) => (b.score > a.score ? b : a))
      : null;
  const worstCity =
    cityScores.length >= 2
      ? cityScores.reduce((a, b) => (b.score < a.score ? b : a))
      : null;
  const hasCities =
    (bestCity != null && worstCity != null) || citiesByRegion.length > 0;

  const nav = countryViewNav(
    view,
    true, // formation costs section always renders
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

        {/* 1. Hero: the answer-first masthead, on the shared kit. The anchor is
            the typical small-business tax (a like-for-like-safe number), not a
            raw revenue figure that cannot be ranked across borders. */}
        <section id="hero" className="pt-1">
          <div className="relative mb-5 overflow-hidden rounded-2xl">
            <CountryMastheadImage iso2={iso2} countryName={meta.name} />
            <div className="relative px-4 pt-4 pb-3 md:px-6">
              <div className="flex items-center gap-3">
                <CountryFlag iso2={iso2} className="w-8 md:w-10" />
                <SectionEyebrow size="md">Small-business economics</SectionEyebrow>
              </div>
            </div>
          </div>

          <AnswerFirstMasthead
            eyebrow={view.masthead.eyebrow}
            tier={view.masthead.tier}
            title={view.masthead.title}
            answer={view.masthead.answer}
            anchor={view.masthead.anchor}
            stats={view.masthead.stats}
          />

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-700 md:text-lg">
            {getCountryAnchor(iso2, meta.name)}
          </p>
        </section>

        <div className="mt-6 space-y-5 md:space-y-6">
          {/* 2. The decisive read: tax + cost to register + payroll + time-to-
              start, as steps. The page's lead beat. */}
          {view.decisive ? (
            <BeatCard
              id="decisive"
              eyebrow="The decisive read"
              heading={view.decisive.heading}
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
                      <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-cocoa-700/80">
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
            <SectionEmpty
              id="decisive"
              eyebrow="The decisive read"
              heading="Setting up and running a business here"
              place={meta.name}
            />
          )}

          {/* 3. The honest take: unconditional. The 185 thin-coverage countries
              get an honest thin-coverage line, not the old shared anchor. */}
          {view.honestTake ? (
            <HonestTakeBox
              id="honest-take"
              verdict={view.honestTake.verdict}
              points={view.honestTake.points}
            >
              {view.honestTake.body}
            </HonestTakeBox>
          ) : null}

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
            </BeatCard>
          ) : (
            <SectionEmpty
              id="hire"
              eyebrow="Hiring here"
              heading="How hard it is to hire here"
              place={meta.name}
            />
          )}

          {/* 5. Cost to open: the legal-tier formation breakdown. */}
          <section
            id="formation"
            className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
          >
            <BusinessFormationCosts countryIso2={iso2} countryName={meta.name} />
          </section>

          {/* 6. Compare to neighbours: the like-for-like FACTS table. Never an
              ordinal money rank across borders, so the kit gets noLeaderMark. */}
          {view.neighbours ? (
            <LikeForLikeTable
              id="neighbours"
              eyebrow="Vs neighbours"
              heading={view.neighbours.heading}
              lede={view.neighbours.lede}
              noLeaderMark
              columns={view.neighbours.columns}
              rows={view.neighbours.rows}
              footnote={view.neighbours.footnote}
            />
          ) : (
            <SectionEmpty
              id="neighbours"
              eyebrow="Vs neighbours"
              heading="How this country compares to its neighbours"
              place={meta.name}
            />
          )}

          {/* 7. The easiest businesses to break into here. */}
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

          {/* 8. Cities: best + worst highlight, then the regions-and-cities list. */}
          {hasCities ? (
            <section
              id="cities"
              className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
            >
              <SectionEyebrow className="mb-3">Go local</SectionEyebrow>
              <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-ink-900 md:text-xl">
                Cities of {countryName}
              </h2>

              {bestCity != null && worstCity != null ? (
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href={`/cities/${bestCity.slug}`}
                    className="block rounded-xl border border-parchment bg-cream-50 p-4 transition-colors hover:border-atlas-500"
                  >
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-moss-700">
                      Easiest to start in
                    </div>
                    <div className="text-base font-semibold text-ink-900">
                      {bestCity.name}
                    </div>
                    <div className="mt-0.5 text-sm text-cocoa-700">
                      Business Climate Score:{" "}
                      <strong className="text-ink-900">{bestCity.score}</strong>
                    </div>
                  </Link>
                  <Link
                    href={`/cities/${worstCity.slug}`}
                    className="block rounded-xl border border-parchment bg-cream-50 p-4 transition-colors hover:border-atlas-500"
                  >
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-atlas-700">
                      Hardest to start in
                    </div>
                    <div className="text-base font-semibold text-ink-900">
                      {worstCity.name}
                    </div>
                    <div className="mt-0.5 text-sm text-cocoa-700">
                      Business Climate Score:{" "}
                      <strong className="text-ink-900">{worstCity.score}</strong>
                    </div>
                  </Link>
                </div>
              ) : null}

              {citiesByRegion.length > 0 ? (
                <div className="space-y-6">
                  {citiesByRegion.map((group) => {
                    // Dedup: the best and worst cities are already featured in
                    // the callout above, so drop them from the region list. No
                    // city ever appears twice on the page.
                    const cities = group.cities.filter(
                      (c) => c.slug !== bestCity?.slug && c.slug !== worstCity?.slug,
                    );
                    if (cities.length === 0) return null;
                    return (
                      <div key={group.region}>
                        <h3 className="text-base font-semibold text-ink-900">
                          {group.region}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {cities.map((city) => (
                            <Link
                              key={city.slug}
                              href={`/${iso2.toLowerCase()}/${city.slug}/restaurants`}
                              className="inline-flex items-center rounded-full border border-parchment bg-white px-3 py-1.5 text-sm font-medium text-ink-900 transition-colors hover:border-atlas-500 hover:text-atlas-700"
                            >
                              {city.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </section>
          ) : (
            <SectionEmpty
              id="cities"
              eyebrow="Go local"
              heading={`The cities of ${countryName}`}
              place={countryName}
            />
          )}

          {/* 9. What locals know (exemplar-only invented detail; self-omits). */}
          {view.whatLocals ? (
            <WhatLocalsKnow id="locals" notes={view.whatLocals} />
          ) : null}

          {/* 10. Against the grain (exemplar-only; self-omits). */}
          {view.contrarian ? (
            <ContrarianInsight
              id="contrarian"
              insight={view.contrarian.insight}
              body={view.contrarian.body}
            />
          ) : null}

          {/* 11. Country character: demographics, culture, government, in a
              dedicated country-scale layout. Replaces the old reused city
              signature panel (the "zombie"); always present (CountryCharacter
              renders the calm placeholder when we hold no character read). */}
          <CountryCharacter iso2={iso2} countryName={meta.name} id="character" />

          {/* 12. Related: the Compare CTA, the closing beat. */}
          <section
            id="related"
            className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
          >
            <SectionEyebrow className="mb-2">Next move</SectionEyebrow>
            <h2 className="text-lg font-semibold text-ink-900">
              Put {meta.name} against its peers
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-800">
              Pick any activity and set {meta.name} side by side with up to three
              other countries: revenue, the cost stack, and what an owner keeps.
            </p>
            <a
              href="/compare"
              className="mt-4 inline-block rounded-lg bg-atlas-600 px-4 py-2 text-sm font-medium text-cream-50 transition hover:bg-atlas-700"
            >
              Open Compare
            </a>
          </section>

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
