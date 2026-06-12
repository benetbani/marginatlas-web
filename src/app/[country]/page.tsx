/**
 * Country landing page — /us, /de, /fr, /jp, etc.
 *
 * Flag + name + coverage tier, signature line,
 * top SMB-relevant industries, "Compare {country}" CTA.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopIndustriesForCountry, getCellBySlug, withBudget, slugify } from "@/lib/cells";
import { getCitiesForCountry } from "@/lib/cities";
import {
  COUNTRIES,
  industryToSlug,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { hasRegionalCoverage } from "@/lib/coverage/regional";
import { getAdmin1Regions } from "@/lib/coverage/admin1";
import { COUNTRY_PAGE_SECTIONS } from "@/lib/page-layout/section-order";
import { getCountryAnchor } from "@/lib/content/country-anchors";
import { fmtMoney } from "@/lib/format/money";
import { CountrySignaturePanel } from "@/components/countries/CountrySignaturePanel";
import { BusinessFormationCosts } from "@/components/cities/BusinessFormationCosts";
import { CountryViabilityLede } from "@/components/countries/CountryViabilityLede";
import { CountryTaxReality } from "@/components/countries/CountryTaxReality";
import { generateCountryVerdict } from "@/lib/scores/country_verdict";
import { getCountryEconomicsSnapshot, getCityEconBySlug } from "@/lib/economics/country_metrics";
import { getSmbRegime, getVatRow } from "@/lib/tax/smb_effective_rates";
import { getCountryRates, getTypicalFormationCostUsd } from "@/lib/tax/country_rates";
import { BoardHero } from "@/components/board/BoardHero";
import { BoardSectionTable } from "@/components/board/BoardSectionTable";
import { CountryMastheadImage } from "@/components/countries/CountryMastheadImage";
import { buildCountryBoard, buildEasiestToBreakIn, type PlaceActivityCell } from "@/lib/scores/country_board";
import { EasiestToBreakIn } from "@/components/countries/EasiestToBreakIn";
import { buildCityScore } from "@/lib/scores/city_board";

// Keep section-order constant referenced for type checking — sections render in this exact order below.
void COUNTRY_PAGE_SECTIONS;

export const revalidate = 86400;
export const dynamicParams = true;
// Country pages render on demand (generateStaticParams returns []), so give
// the getTopIndustriesForCountry read headroom on a cold or throttled DB: a
// first-hit render should not drop at the default function timeout.
export const maxDuration = 60;

type Params = { country: string };

// COUNTRY_SIGNATURE removed alongside the hero photo. The
// per-country tagline is now sourced from getCountryAnchor(), and the
// signature glyph is no longer used anywhere on the country page.

// Build-time prerender for the major economies (re-enabled 2026-06-06).
// Prerender was disabled 2026-06-04 because getTopIndustriesForCountry was an
// unindexed aggregate: firing it for many countries concurrently against the
// cold NANO DB blew Vercel's 300s per-route static-gen cap and the 45-minute
// build limit (deploy ks27agr69). The 2026-06-05 index
// (idx_extrapolated_country_quality) makes that read fast (tens of ms), so
// prerendering the highest-traffic countries is safe again: a couple dozen
// fast reads add a few seconds to the build, not minutes. The long tail still
// renders on demand (dynamicParams=true) and caches for `revalidate` seconds,
// so coverage is unchanged; only the popular pages get the static,
// zero-cold-start treatment. Codes are filtered against COUNTRIES so an
// uncovered code can never prerender a notFound page.
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

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) notFound();

  const topIndustries = await getTopIndustriesForCountry(iso2, 18);
  // Countries with only city-level data (e.g. Argentina)
  // must not advertise a sub-regional view. The flag is plumbed here so
  // any future Regions tab/section can be wrapped with `{showRegions ? ... : null}`.
  // Today the country page surfaces only cities + cell-page entrypoints,
  // neither of which depend on region-level coverage.
  const showRegions = hasRegionalCoverage(iso2);
  void showRegions;

  // Admin-1 sub-region navigation list. All 194 countries
  // (except SG) have admin1 data. The regions section now renders cities
  // grouped by region (see citiesByRegion below) rather than a flat admin-1
  // grid, so this list is retained only as a coverage signal for any future
  // use and is intentionally not rendered directly.
  const regions = getAdmin1Regions(iso2);
  void regions;
  const countryName = meta.name;

  // Country-level decision lede (bible Section 5, friction-adjusted view).
  // Pure synthesis from data the page already loads: the economics snapshot,
  // the small-business tax regime, the headline sales tax, and the densest
  // local activity. No new queries, no invented numbers. Each clause inside
  // the verdict self-omits when its input is missing, so low-coverage
  // countries get a short honest paragraph instead of a fabricated one.
  const snapshot = getCountryEconomicsSnapshot(iso2);
  const smbRegime = getSmbRegime(iso2);
  const vatRow = getVatRow(iso2);
  const countryRates = getCountryRates(iso2);
  const registrationCostUsd = getTypicalFormationCostUsd(iso2);
  const densestActivity = topIndustries[0]
    ? {
        name: topIndustries[0].industry_name,
        typicalRevenue: topIndustries[0].revenue_per_firm,
      }
    : null;
  const countryVerdict = generateCountryVerdict({
    countryName,
    snapshot,
    smbEffectiveRate: smbRegime?.effective_rate ?? null,
    vatStandard: vatRow?.standard ?? null,
    topActivity: densestActivity,
    fmt: (n) => fmtMoney(n),
  });
  // Mount the lede only when the synthesis produced real signal: at least one
  // qualitative signal tile, or a money sentence (a known densest activity).
  // Otherwise it would be the generic thin-coverage line, which we omit
  // rather than show as an apology.
  const showVerdict =
    countryVerdict.signals.length > 0 || densestActivity != null;

  // Country data board. Built from values the page already loads (the
  // economics snapshot, the small-business tax regime, the headline sales
  // tax); no new query, no invented number. Every section and every row is
  // always present, so a datum we do not hold shows as the board's dash and
  // the page shape never depends on the data. This is the country-altitude
  // sibling of the cell page's A-J board.
  const board = buildCountryBoard({
    econ: snapshot,
  });

  // The geo segment every cell-page link on this country page uses: California
  // stands in for the US (it has the deepest state coverage), the country-name
  // slug elsewhere. Hoisted here so the industries grid and the break-in panel
  // below resolve and link to the exact same destination cell, and the panel's
  // score therefore matches that cell's own masthead.
  const placeGeo = iso2 === "US" ? "california" : slugify(meta.name);

  // The down-link target for the set-up cost block: the densest activity's cell
  // page, where the after-tax "what an owner keeps" math actually lives.
  const taxTopActivity = topIndustries[0]
    ? {
        name: topIndustries[0].industry_name,
        href: `/${iso2.toLowerCase()}/${placeGeo}/${industryToSlug(topIndustries[0].industry_id)}`,
      }
    : null;

  // "The easiest businesses to break into here" panel. The flip side of the
  // across-cities comparison: it ranks THIS place's activities by the single
  // break-in rating (the same 0..100 score each business shows on its own
  // masthead). We resolve the destination cell for each top activity (a bounded,
  // budgeted set of reads, the same pattern the across comparison uses) and hand
  // them to the pure place-board builder, which scores each through the SAME
  // break-in path the masthead uses and drops any activity whose cell misrouted,
  // is synthesized, or carries no defensible take-home, so a row is never a wrong
  // number. The builder self-omits a thin ranking (fewer than a few scored), and
  // the section below renders nothing in that case. Each read is budgeted, so a
  // slow one degrades that one activity rather than the page.
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

  // Regions-and-cities nav (founder spec): each region is a non-link heading,
  // and the cities under it are clickable chips. We group the country's
  // curated cities by their region name; each chip links to the same city
  // route the rest of the site uses (the city's default-industry cell). Cities
  // carry a real region_name and display name, so no slug-to-label munging is
  // needed and the grouping works for every covered country. Regions with no
  // cities simply do not appear; the section omits when the country has none.
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

  // Best/worst city highlight. For each displayed city, build its Business
  // Climate Score using per-city salary and cost-of-living from city_list_v1
  // so the ranking reflects real per-city economics, not city size alone.
  // getCityEconBySlug looks up the city slug in city_list_v1.json and returns
  // nulls for cities absent from that list (score falls back to population +
  // country econ in those cases). buildCityScore returns null when the city
  // carries no usable demand signal; those cities are excluded. The highlight
  // self-omits when fewer than 2 cities produce a score.
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

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <span className="inline-flex items-center gap-1">
          <CountryFlag iso2={iso2} className="w-4" />
          <span>{meta.name}</span>
        </span>
      </nav>

      {/*
        SP2 section order (reform-v2/palette-brick):
        1. hero (masthead + data board + country-anchor paragraph)
        2. viability lede
        3. tax-overview + business formation costs (set-up and run area)
        4. easiest businesses to break into here
        5. cities (merged: best/worst highlight + regions list)
        6. country character panel (signature panel)
        7. related-countries CTA
      */}

      {/* 1. hero: rebuilt on the board kit to match the cell page. */}
      <section id="hero" className="pt-2 pb-6">
        <div className="relative overflow-hidden rounded-2xl">
          <CountryMastheadImage iso2={iso2} countryName={meta.name} />
          <div className="relative px-4 pt-4 pb-2 md:px-6 md:pt-6">
            <div className="flex items-center gap-3">
              <CountryFlag iso2={iso2} className="w-8 md:w-10" />
              <SectionEyebrow size="md">Local profit intelligence</SectionEyebrow>
            </div>
            <BoardHero title={meta.name} score={{ overall: null, parts: [] }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {board.map((s) => (
            <BoardSectionTable section={s} key={s.key} />
          ))}
        </div>

        <p className="mt-6 text-base md:text-lg text-ink-700 max-w-3xl leading-relaxed">
          {getCountryAnchor(iso2, meta.name)}
        </p>
      </section>

      {/* 2. Viability lede. Opinionated country-level read: where the money
         tends to be, the operating reality that gets in the way, and the
         condition under which a business actually clears a wage. Mounts only
         when the synthesis produced real signal. */}
      {showVerdict ? <CountryViabilityLede verdict={countryVerdict} /> : null}

      {/* 3. Tax and set-up area. The tax block is moved up to here so the
         "what does it cost to get started and what does the tax regime look
         like" question is answered before the activity ranking, not buried
         after it. The formation-costs block sits immediately under it as the
         natural companion: both are country-level legal facts, not per-city. */}
      {/* SaaS reformation 2026-06-12: country sections are seated cards on
          the app ground, matching the cell-page board language. */}
      <section
        id="tax-overview"
        className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
      >
        <CountryTaxReality
          countryName={meta.name}
          vat={vatRow}
          regime={smbRegime}
          topActivity={taxTopActivity}
          daysToRegister={snapshot.daysToStart}
          registrationCostUsd={registrationCostUsd}
          payrollRate={countryRates.employerSocial}
          fmt={(n) => fmtMoney(n)}
        />
      </section>
      <section className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
        <BusinessFormationCosts countryIso2={iso2} countryName={meta.name} />
      </section>

      {/* 4. Easiest businesses to break into here. Ranks this country's own
         activities by break-in rating. Self-omits when too few activities
         resolve a defensible score. */}
      {easiestBreakIn.length > 0 ? (
        <section className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <EasiestToBreakIn rows={easiestBreakIn} placeName={meta.name} />
        </section>
      ) : null}

      {/* 5. Cities: merged section. Replaces the old #top-cities +
         #regions pair. Leads with a best/worst city highlight (by Business
         Climate Score) when at least 2 cities score, then the full
         regions-and-cities list. The #top-cities section is removed from
         this page; its id is retained in section-order.ts for other pages. */}
      {(bestCity != null && worstCity != null) || citiesByRegion.length > 0 ? (
        <section
          id="regions"
          className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
        >
          <SectionEyebrow className="mb-3">Go local</SectionEyebrow>
          <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900 mb-4">
            Cities of {countryName}
          </h2>

          {/* Best/worst highlight. Only shown when at least 2 cities scored.
              Self-omits cleanly when cityScores.length < 2. */}
          {bestCity != null && worstCity != null ? (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/cities/${bestCity.slug}`}
                className="rounded-xl border border-parchment bg-cream-50 p-4 block hover:border-atlas-500 transition-colors"
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold text-moss-700 mb-1">
                  Easiest to start in
                </div>
                <div className="text-base font-semibold text-ink-900">
                  {bestCity.name}
                </div>
                <div className="text-sm text-cocoa-700 mt-0.5">
                  Business Climate Score: <strong className="text-ink-900">{bestCity.score}</strong>
                </div>
              </Link>
              <Link
                href={`/cities/${worstCity.slug}`}
                className="rounded-xl border border-parchment bg-cream-50 p-4 block hover:border-atlas-500 transition-colors"
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold text-clay-600 mb-1">
                  Hardest to start in
                </div>
                <div className="text-base font-semibold text-ink-900">
                  {worstCity.name}
                </div>
                <div className="text-sm text-cocoa-700 mt-0.5">
                  Business Climate Score: <strong className="text-ink-900">{worstCity.score}</strong>
                </div>
              </Link>
            </div>
          ) : null}

          {/* Regions-and-cities list. */}
          {citiesByRegion.length > 0 ? (
            <div className="space-y-6">
              {citiesByRegion.map((group) => (
                <div key={group.region}>
                  <h3 className="text-base font-semibold text-ink-900">
                    {group.region}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.cities.map((city) => (
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
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* 6. Country character panel. Demographics, culture spectrum, and
         government scores. Signature sectors are suppressed on the country
         page (showSectors=false via CountrySignaturePanel). Supporting
         demographic context, not a decision beat. */}
      <section className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
        <CountrySignaturePanel iso2={iso2} countryName={meta.name} />
      </section>

      {/* 7. related-countries: Compare CTA. Closing beat of the flow. */}
      <section id="related-countries" className="mt-5 mb-8">
        <div className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <SectionEyebrow className="mb-2">Next move</SectionEyebrow>
          <h2 className="text-lg font-semibold text-ink-900">
            Put {meta.name} against its peers
          </h2>
          <p className="mt-1 text-sm text-ink-800 max-w-2xl leading-relaxed">
            Pick any activity and set {meta.name} side by side with up to three
            other countries: revenue, the cost stack, and what an owner keeps.
          </p>
          <a
            href="/compare"
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-atlas-600 hover:bg-atlas-700 text-cream-50 text-sm font-medium transition"
          >
            Open Compare →
          </a>
        </div>
      </section>
    </div>
  );
}
