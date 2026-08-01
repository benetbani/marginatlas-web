/**
 * Country landing page - /us, /gb, /de, /fr, /jp, etc.
 *
 * Rewired to the engraved Section Constitution spine (docs/brand/section-
 * constitution.md, the COUNTRY page, organized by the nine judgment lenses).
 * The accepted hero block is kept exactly (the faded CountryMastheadImage + flag
 * + H1 = country name with id="headline" + the fixed subtitle + AddToWatch); the
 * BODY below the hero is rerendered in the engraved style, composed entirely from
 * the engraved component family in @/components/kit/engraved.
 *
 * Data-first, opinion-low: the scorecard, the country shape, the setup read, the
 * hire read, who-has-money, how-far-you-reach, the neighbours, the ground under
 * you, the cities, and the character all lead; the honest take and the gut check
 * sit low. Real data feeds every section an accessor holds; everywhere else the
 * engraved component shows its own honest SampleState (clearly tagged), never a
 * fabricated real-looking number.
 *
 * The section-gate contract (scripts/verify_page_sections.ts) requires these ids
 * to render literally: decisive, hire, neighbours, cities, character, related.
 * Each engraved section that maps to one is wrapped in a <section id="..."> so the
 * gate sees it. verify_section_order is satisfied because the page's literal
 * <section id=> blocks are a subsequence of COUNTRY_PAGE_SECTIONS.
 *
 * Tokens only, no raw hex/px/ms in the page (engraved color rides the components
 * + CSS vars), no em-dashes, no source-agency names.
 */

import * as React from "react";
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
  getCountryCostOfLivingIndex,
  type CountryEconomicsSnapshot,
} from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import { getBrainGdpPerCapitaByIso2, getBrainPopulationByIso2 } from "@/lib/external/brain_data";
import { getSmbRegime, getVatRow, type SmbRegime } from "@/lib/tax/smb_effective_rates";
import { getCountryRates, getTypicalFormationCostUsd } from "@/lib/tax/country_rates";
import { CountryMastheadImage } from "@/components/countries/CountryMastheadImage";
import { buildEasiestToBreakIn, type PlaceActivityCell } from "@/lib/scores/country_board";
import { EasiestToBreakIn } from "@/components/countries/EasiestToBreakIn";
import { StickySectionNav, FreshnessStamp, FlagIt, AddToWatch } from "@/components/kit";
import {
  Scorecard,
  type ScorecardMetric,
  CountryShape,
  type ShapeLens,
  SetupStepper,
  type SetupStep,
  HiringRead,
  TalentReality,
  WhoHasMoney,
  HowFarYouReach,
  type ReachIndicator,
  Neighbours,
  type NeighbourCountry,
  type NeighbourMetric,
  OpportunityGap,
  SameBusinessAbroad,
  SpecialZones,
  LicenceCheck,
  GroundUnderYou,
  type GroundFactor,
  CitiesGrid,
  type CityCard,
  CharacterPanel,
  type CharacterSpectrum,
  type CharacterStat,
  LocalsKnow,
  type LocalInsight,
  YourLifeHere,
  VsWorld,
  HonestTake,
  GutCheck,
  OneThing,
  AtlasDivider,
} from "@/components/kit/engraved";
import { getCountrySignature } from "@/lib/countries/country_signature";
import {
  buildCountryView,
  countryViewNav,
  NEIGHBOUR_GROUPS,
  type NeighbourFacts,
} from "@/lib/countries/country_view";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SpineShell } from "@/components/spine/shell";
import SpineCountry from "@/app/dev/spine/page";
import { SiteChrome } from "@/components/SiteChrome";

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
  // notFound() here, not a title. The page component calls notFound() too, but
  // by then src/app/loading.tsx has flushed the shell and the 200 is already on
  // the wire, so every wrong URL was a soft 404. Measured on production: the
  // skeleton lands at byte 8547 and the 404 content at 28567. generateMetadata
  // runs before the flush, so this is where the status can still be set.
  if (!c) notFound();
  const title = `${c.name}: small-business benchmarks | Margin Atlas`;
  const description = `Typical revenue, employment, and wages for small businesses in ${c.name}.`;
  const canonical = `/${country.toLowerCase()}`;
  const ogPath = `/og/country?country=${encodeURIComponent(country.toLowerCase())}`;
  return {
    title,
    description,
    alternates: { canonical },
    // title, description and images are all repeated below rather than
    // inherited. Next resolves metadata per KEY by replacement, not by deep
    // merge, so declaring openGraph at all discards the root layout's
    // openGraph, images included. Same for twitter. See the note in
    // src/app/layout.tsx.
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogPath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogPath],
    },
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

/** A pre-formatted compact population string for the reach figure. */
function popCompactDisplay(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${Math.round(n)}`;
}

const isNum = (v: number | null | undefined): v is number =>
  v != null && Number.isFinite(v);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

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
 * A 0..1 goodness score from a value against an ordered set of break points,
 * each carrying its own 0..1 goodness. Mirrors the guiding-word break tables so
 * the scorecard tint reads on the same scale as the rest of the site, without
 * fabricating anything: a null value returns null and the cell stays unscored.
 */
type Band = { upTo: number; score: number };
function bandScore(value: number | null, bands: Band[]): number | null {
  if (!isNum(value)) return null;
  for (const b of bands) if (value <= b.upTo) return b.score;
  return bands[bands.length - 1]?.score ?? null;
}

/* Per-metric 0..1 bands for the scorecard tint. Higher always reads better for
 * an operator. Inverted metrics (days, cost of living) are pre-flipped here. The
 * neutral size metrics (population, minimum wage) are intentionally left without
 * a band so the cell shows the figure with no good/bad colour. */
const BAND_GDP: Band[] = [
  { upTo: 3000, score: 0.1 }, { upTo: 10000, score: 0.35 },
  { upTo: 25000, score: 0.6 }, { upTo: 50000, score: 0.8 }, { upTo: Infinity, score: 1 },
];
const BAND_SALARY: Band[] = [
  { upTo: 6000, score: 0.1 }, { upTo: 18000, score: 0.35 },
  { upTo: 35000, score: 0.6 }, { upTo: 60000, score: 0.8 }, { upTo: Infinity, score: 1 },
];
const BAND_WEALTH: Band[] = [
  { upTo: 3000, score: 0.1 }, { upTo: 15000, score: 0.35 },
  { upTo: 50000, score: 0.6 }, { upTo: 120000, score: 0.8 }, { upTo: Infinity, score: 1 },
];
const BAND_DAYS: Band[] = [
  { upTo: 1, score: 1 }, { upTo: 7, score: 0.8 },
  { upTo: 21, score: 0.55 }, { upTo: 60, score: 0.3 }, { upTo: Infinity, score: 0.1 },
];
const BAND_EASE: Band[] = [
  { upTo: 45, score: 0.1 }, { upTo: 60, score: 0.35 },
  { upTo: 72, score: 0.55 }, { upTo: 83, score: 0.8 }, { upTo: Infinity, score: 1 },
];
const BAND_COL: Band[] = [
  { upTo: 40, score: 1 }, { upTo: 60, score: 0.8 },
  { upTo: 85, score: 0.55 }, { upTo: 120, score: 0.3 }, { upTo: Infinity, score: 0.1 },
];

/* Word reads for the scorecard, on the same direction as the bands. */
function wordFromScore(score: number | null): string | null {
  if (score == null) return null;
  const i = Math.max(0, Math.min(4, Math.round(score * 4)));
  return ["Weak", "Modest", "Fair", "Strong", "Excellent"][i];
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

/**
 * A reusable engraved section wrapper: an eyebrow + heading, then the content.
 * `card` seats the content on the shared engraved card surface (for components
 * that render bare content); leave it false for components that already carry
 * their own card chrome, so the page never double-frames them. `id` attaches the
 * canonical anchor as a real <section id="...">, which the section gates scan.
 */
function EngravedSection({
  id,
  eyebrow,
  heading,
  sub,
  card = false,
  children,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  sub?: string | null;
  card?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-label={heading}>
      <div className="mb-3">
        <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow>
        <h2 className="font-display text-xl font-medium tracking-tight text-balance text-ink-900 md:text-2xl">
          {heading}
        </h2>
        {sub ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite md:text-base">
            {sub}
          </p>
        ) : null}
      </div>
      {card ? (
        <div className="rounded-lg border border-parchment bg-cream-50 px-5 py-5 md:px-7 md:py-6">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

async function CountryPageBody({ params }: { params: Promise<Params> }) {
  // Spine reform (flag-gated, default OFF). The spine body renders the bundled
  // GB seed regardless of `params`; that is intentional for this scaffold and
  // never ships live because the flag stays OFF until real-data adapters land.
  if (isSpineReformEnabledFor("country")) {
    return (
      <SpineShell bg="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=60">
        <SpineCountry />
      </SpineShell>
    );
  }

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
  const costOfLiving = getCountryCostOfLivingIndex(iso2);
  const population = getBrainPopulationByIso2().get(iso2) ?? null;

  // The wage floor + typical pay. Both come from the same held profile row
  // (annual USD, one currency basis), so they are strictly like-for-like.
  // getCountryProfile returns a generic fallback for countries it does not hold,
  // so we only trust a profile whose own iso2 matches this country and never pass
  // the fallback's figures (that would be a fabricated wage). When not held, both
  // stay null and the engraved sections show their honest sample state.
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
  const avgSalaryAnnual = typicalPayAnnualUsd;
  const easeOfDoingBusiness =
    profileHeld && profile.ease_of_doing_business_index > 0
      ? profile.ease_of_doing_business_index
      : null;
  const corruptionIndex =
    profileHeld && profile.corruption_perception_index > 0
      ? profile.corruption_perception_index
      : null;
  // Held GDP per capita: the profile figure where held, brain GDP otherwise.
  const gdpPerCapita =
    profileHeld && profile.gdp_per_capita_usd_nominal > 0
      ? profile.gdp_per_capita_usd_nominal
      : snapshot.gdpPerCapita;

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
  // neighbours' real set-up facts. Pure local-table reads, no Supabase.
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
  // the invented beats, and the thin-coverage countries get an honest line.
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
  const hasBreakIn = easiestBreakIn.length > 0;

  // Regions-and-cities: each region a heading, its cities clickable. Cities
  // render as UNIFORM, equal-weight cards (no good-vs-bad ranking).
  const allCities = getCitiesForCountry(iso2);
  const cityCards: CityCard[] = allCities.slice(0, 8).map((c) => ({
    name: c.name,
    meta: c.region_name?.trim() || countryName,
    // Uniform equal weight: every card reads the same dot level, never a
    // good-vs-bad city ranking (a country never scores its own cities).
    climate: 3,
  }));
  const cityLinks = allCities.slice(0, 8);
  const hasCities = cityCards.length > 0;

  const globalMedianGdpPerCapita = getGlobalMedianGdpPerCapita();

  // Gut check: three plain, country-derived questions before committing.
  const gutCheckQuestions = buildCountryGutCheck(countryName, snapshot, smbRegime);

  // The watch item for this country. A country rides the "city" kind (the tray
  // labels it "Place"); the iso2-keyed slug keeps it distinct from a real city.
  const watchItem = {
    kind: "city" as const,
    slug: `country-${iso2.toLowerCase()}`,
    label: countryName,
    href: `/${iso2.toLowerCase()}`,
    sub: "Country",
  };

  /* ---------------------- the engraved scorecard ----------------------- */
  // The eight headline facts. Real where held; a not-held cell shows the dash
  // and "not held" rather than a fabricated number (Scorecard's own honest cell).
  const gdpScore = bandScore(gdpPerCapita, BAND_GDP);
  const salaryScore = bandScore(avgSalaryAnnual, BAND_SALARY);
  const wealthScore = bandScore(snapshot.netWealthPerAdult, BAND_WEALTH);
  const daysScore = bandScore(snapshot.daysToStart, BAND_DAYS);
  const easeScore = bandScore(easeOfDoingBusiness, BAND_EASE);
  const colScore = bandScore(costOfLiving, BAND_COL);
  const scorecardMetrics: ScorecardMetric[] = [
    {
      label: "GDP per capita", glyph: "bank",
      value: isNum(gdpPerCapita) ? usdCompactDisplay(gdpPerCapita) : null,
      score: gdpScore, read: wordFromScore(gdpScore),
    },
    {
      label: "Average salary", glyph: "coin",
      value: isNum(avgSalaryAnnual) ? usdCompactDisplay(avgSalaryAnnual) : null,
      score: salaryScore, read: wordFromScore(salaryScore),
    },
    {
      label: "Net wealth / adult", glyph: "wallet",
      value: isNum(snapshot.netWealthPerAdult) ? usdCompactDisplay(snapshot.netWealthPerAdult) : null,
      score: wealthScore, read: wordFromScore(wealthScore),
    },
    {
      label: "Days to start", glyph: "clock",
      value: isNum(snapshot.daysToStart) ? `${Math.round(snapshot.daysToStart)}` : null,
      unit: isNum(snapshot.daysToStart) ? (Math.round(snapshot.daysToStart) === 1 ? "day" : "days") : null,
      score: daysScore, read: wordFromScore(daysScore),
    },
    {
      label: "Ease of business", glyph: "doc",
      value: isNum(easeOfDoingBusiness) ? `${Math.round(easeOfDoingBusiness)}` : null,
      unit: isNum(easeOfDoingBusiness) ? "/100" : null,
      score: easeScore, read: wordFromScore(easeScore),
    },
    {
      label: "Minimum wage", glyph: "scale",
      value: isNum(minWageAnnualUsd) ? usdCompactDisplay(minWageAnnualUsd) : null,
      unit: isNum(minWageAnnualUsd) ? "/yr" : null,
      // Neutral level (a floor is protective for workers, a cost for owners), no
      // good/bad tint: pass no score so the read row stays a quiet level.
      score: null, read: null,
    },
    {
      label: "Population", glyph: "people",
      value: isNum(population) ? popCompactDisplay(population) : null,
      // Neutral size, no good/bad tint.
      score: null, read: null,
    },
    {
      label: "Cost of living", glyph: "basket",
      value: isNum(costOfLiving) ? `${Math.round(costOfLiving)}` : null,
      unit: isNum(costOfLiving) ? "/100" : null,
      score: colScore, read: wordFromScore(colScore),
    },
  ];
  const hasAnyScorecard = scorecardMetrics.some((m) => m.value != null);

  /* --------------------- the nine-lens country shape ------------------- */
  // Each lens is a 0..1 read derived from held metrics. A lens with no held
  // input is dropped (the radar collapses that spoke to the hub, no claim).
  // Momentum + path arrive as a tagged sample until trend data lands.
  const lenses: ShapeLens[] = [];
  // Reward: the take-home signal. Lower business-tax + payroll load reads as more
  // kept. Built from the held effective small-business rate and payroll on-cost.
  const taxLoad =
    (smbRegime?.effective_rate ?? null) != null || countryRates.employerSocial != null
      ? clamp01(
          1 -
            ((smbRegime?.effective_rate ?? 0.25) + (countryRates.employerSocial ?? 0.15)) / 0.7,
        )
      : null;
  if (taxLoad != null) lenses.push({ key: "reward", label: "Reward", score: taxLoad, read: wordFromScore(taxLoad) });
  // Cost: the cost signature, read from the cost-of-living index (cheaper to
  // operate reads stronger). Pre-inverted via BAND_COL.
  if (colScore != null) lenses.push({ key: "cost", label: "Cost", score: colScore, read: wordFromScore(colScore) });
  // Entry: how hard to get in and stay legal, from days-to-start + ease.
  const entryParts = [daysScore, easeScore].filter((s): s is number => s != null);
  if (entryParts.length > 0) {
    const entry = entryParts.reduce((a, b) => a + b, 0) / entryParts.length;
    lenses.push({ key: "entry", label: "Entry", score: entry, read: wordFromScore(entry) });
  }
  // People: can you afford a team, from the wage level (higher wages read as a
  // deeper, more capable labour pool but a costlier hire; here we read capability).
  if (salaryScore != null) lenses.push({ key: "people", label: "People", score: salaryScore, read: wordFromScore(salaryScore) });
  // Demand: is there money here, from GDP per capita + net wealth.
  const demandParts = [gdpScore, wealthScore].filter((s): s is number => s != null);
  if (demandParts.length > 0) {
    const demand = demandParts.reduce((a, b) => a + b, 0) / demandParts.length;
    lenses.push({ key: "demand", label: "Demand", score: demand, read: wordFromScore(demand) });
  }
  // Edge: a simple read. A less-crowded market (lower self-employment density)
  // leaves more room; built from the held self-employment share where present.
  if (isNum(snapshot.selfEmploymentPct)) {
    const edge = clamp01(1 - snapshot.selfEmploymentPct / 60);
    lenses.push({ key: "edge", label: "Edge", score: edge, read: wordFromScore(edge) });
  }
  // Risk: will the ground hold, from corruption perception + ease of business.
  const riskParts: number[] = [];
  if (isNum(corruptionIndex)) riskParts.push(clamp01(corruptionIndex / 100));
  if (easeScore != null) riskParts.push(easeScore);
  if (riskParts.length > 0) {
    const risk = riskParts.reduce((a, b) => a + b, 0) / riskParts.length;
    lenses.push({ key: "risk", label: "Risk", score: risk, read: wordFromScore(risk) });
  }
  // Momentum + path: not held as trend data yet, so they ride a tagged sample
  // mid-scale read rather than implying a measured value.
  lenses.push({ key: "momentum", label: "Momentum", score: 0.5, read: "Steady", sample: true });
  lenses.push({ key: "path", label: "Path", score: 0.5, read: "Open", sample: true });
  const hasShape = lenses.filter((l) => l.sample !== true).length >= 3;

  /* -------------------------- the setup read --------------------------- */
  // SetupStepper is the register-a-business route. We hold the total days and the
  // total government fee, not a confirmed per-step split, so we render one honest
  // station carrying the held totals rather than fabricating intermediate steps.
  const setupSteps: SetupStep[] =
    isNum(snapshot.daysToStart) && snapshot.daysToStart > 0
      ? [
          {
            label: "Register and start trading",
            days: Math.round(snapshot.daysToStart),
            fee: isNum(registrationCostUsd) ? Math.round(registrationCostUsd) : null,
          },
        ]
      : [];
  const hasSetup = setupSteps.length > 0;

  /* --------------------------- the hire read --------------------------- */
  // Wage floor + typical pay + employer on-cost, all from held figures. The
  // engraved HiringRead needs all of floor, typical, daysToHire, and staffCostPct;
  // days-to-hire is not held, so the read self-omits to its honest sample unless a
  // full set lands. We pass the real floor / typical / on-cost; daysToHire stays
  // null so the component shows its sample state rather than inventing a number.
  const staffCostPct =
    isNum(countryRates.employerSocial) && countryRates.employerSocial > 0
      ? Math.round(countryRates.employerSocial * 100)
      : null;
  // The engraved gauge needs all four inputs (floor, typical, days-to-hire, on-
  // cost). Days-to-hire is not held, so we render the gauge only when the full
  // set lands; otherwise the real wage figures (floor, typical, on-cost) lead via
  // the held bullets below, and no "not held yet" sample box contradicts them.
  const hireDaysToHire: number | null = null; // not held
  const hireHasFull =
    isNum(minWageAnnualUsd) &&
    isNum(typicalPayAnnualUsd) &&
    isNum(hireDaysToHire) &&
    isNum(staffCostPct);

  /* --------------------------- who has money -------------------------- */
  // Spending power, blended from net wealth, salary, and cost of living (real).
  const powerParts = [wealthScore, salaryScore].filter((s): s is number => s != null);
  const spendingPower =
    powerParts.length > 0
      ? (() => {
          let s = powerParts.reduce((a, b) => a + b, 0) / powerParts.length;
          // A pricier place thins the same wallet; nudge the read down where the
          // cost of living is held and high (colScore is already inverted).
          if (colScore != null) s = clamp01(s * 0.7 + colScore * 0.3);
          const rung = ["Thin", "Modest", "Mid", "Comfortable", "Deep"][
            Math.max(0, Math.min(4, Math.round(s * 4)))
          ];
          return {
            score: s,
            value: rung,
            read:
              "Blended from net wealth, typical pay, and the local cost of living. A deeper wallet means a customer who can pay more, not an easier market.",
          };
        })()
      : null;

  /* -------------------------- how far you reach ----------------------- */
  const reachIndicators: ReachIndicator[] | null = null; // sample (not held)

  /* ------------------------ the ground under you ---------------------- */
  // Corruption perception + ease of business are real; stability and currency
  // are tagged samples until held. Higher always reads as safer ground.
  const groundFactors: GroundFactor[] = [];
  if (isNum(corruptionIndex)) {
    groundFactors.push({
      label: "Low corruption",
      score: clamp01(corruptionIndex / 100),
      note: "How little a small operator is quietly taxed by graft. Higher is cleaner.",
    });
  }
  if (easeScore != null) {
    groundFactors.push({
      label: "Ease of operating",
      score: easeScore,
      note: "How friendly the day-to-day admin is for a one-person shop.",
    });
  }
  groundFactors.push({ label: "Political stability", score: 0.5, note: null, sample: true });
  groundFactors.push({ label: "Currency", score: 0.5, note: null, sample: true });
  const hasGround = groundFactors.some((f) => f.sample !== true);

  /* --------------------------- the neighbours ------------------------- */
  // The like-for-like FACTS strip from the resolved neighbour facts. Home
  // country tinted for orientation, never crowned. Pre-format every cell.
  const allFacts = [selfFacts, ...neighbourFacts.filter((n) => n && n.iso2 && n.name)];
  const neighbourColumns: NeighbourCountry[] = allFacts.map((f) => ({
    key: f.iso2.toLowerCase(),
    label: f.iso2 === iso2 ? countryName : f.name,
    iso2: f.iso2,
  }));
  const pctWord = (d: number) => `${Math.round(d * 100)}%`;
  const daysWord = (d: number) => {
    const n = Math.round(d);
    if (n <= 1) return "1 day";
    if (n <= 14) return `${n} days`;
    if (n <= 60) return `${Math.round(n / 7)} wks`;
    return `${Math.round(n / 30)} mo`;
  };
  const factCell = (
    pick: (f: NeighbourFacts) => string | null,
  ): Record<string, string | null> => {
    const out: Record<string, string | null> = {};
    for (const f of allFacts) out[f.iso2.toLowerCase()] = pick(f);
    return out;
  };
  const neighbourMetricsAll: NeighbourMetric[] = [
    {
      label: "Business tax", glyph: "coin",
      values: factCell((f) => (isNum(f.smbRate) ? pctWord(f.smbRate) : null)),
    },
    {
      label: "Payroll on staff", glyph: "people",
      values: factCell((f) => (isNum(f.payrollRate) ? pctWord(f.payrollRate) : null)),
    },
    {
      label: "Cost to register", glyph: "stamp",
      values: factCell((f) =>
        isNum(f.registrationCostUsd)
          ? f.registrationCostUsd === 0
            ? "Free"
            : usdCompactDisplay(f.registrationCostUsd)
          : null,
      ),
    },
    {
      label: "Time to register", glyph: "clock",
      values: factCell((f) => (isNum(f.daysToStart) ? daysWord(f.daysToStart) : null)),
    },
  ];
  const neighbourMetrics: NeighbourMetric[] = neighbourMetricsAll.filter((m) =>
    Object.values(m.values).some((v) => v != null),
  );
  const hasNeighbours =
    neighbourColumns.length >= 2 && neighbourMetrics.length >= 2;

  /* --------------------------- the character -------------------------- */
  // From country_signature: culture + government spectrums + the people stats.
  const sig = getCountrySignature(iso2);
  const charSpectra: CharacterSpectrum[] = [];
  if (sig?.culture) {
    const cu = sig.culture;
    const norm = (v: number | undefined) => (isNum(v) ? clamp01((v - 1) / 9) : null);
    const pushSpec = (
      v: number | undefined,
      label: string,
      low: string,
      high: string,
    ) => {
      const n = norm(v);
      if (n != null) charSpectra.push({ label, value: n, low, high });
    };
    pushSpec(cu.openness_to_foreigners, "Openness", "Insular", "Welcoming");
    pushSpec(cu.innovation, "Innovation", "Tradition-bound", "Embraces the new");
    pushSpec(cu.communication_directness, "Directness", "Indirect", "Direct");
    pushSpec(cu.punctuality, "Time", "Loose", "Strict");
  }
  if (sig?.government) {
    const gov = sig.government;
    const norm10 = (v: number | undefined) => (isNum(v) ? clamp01(v / 10) : null);
    const pushGov = (v: number | undefined, label: string, low: string, high: string) => {
      const n = norm10(v);
      if (n != null) charSpectra.push({ label, value: n, low, high });
    };
    pushGov(gov.tax_predictability, "Tax predictability", "Erratic", "Predictable");
    pushGov(gov.low_bribery, "Clean dealing", "Greased", "Clean");
  }
  const charStats: CharacterStat[] = [];
  if (isNum(sig?.foreign_born_pct)) charStats.push({ k: "Born abroad", v: `${sig!.foreign_born_pct}`, u: "%" });
  if (isNum(sig?.foreign_owned_pct)) charStats.push({ k: "Foreign-owned firms", v: `${sig!.foreign_owned_pct}`, u: "%" });
  const hasCharacter = charSpectra.length > 0;

  /* ------------------------- what locals know ------------------------- */
  const localInsights: LocalInsight[] | null = view.whatLocals
    ? view.whatLocals.map((t, i) => ({
        glyph: (["doc", "wallet", "pin", "people"] as const)[i % 4],
        text: t,
      }))
    : null;

  const nav = countryViewNav(view, true, hasBreakIn, hasCities);

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

        {/* 1. Hero (KEPT EXACTLY): the country photo as a faded background, the
            flag, the H1 = JUST the country name (id="headline"), one fixed
            subtitle, and AddToWatch. Only the body below is rerendered. */}
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
            <div className="mt-5 flex items-center gap-3">
              <AddToWatch item={watchItem} />
            </div>
          </div>
        </section>

        <div className="space-y-8 md:space-y-10">
          {/* ============ OPENING: scorecard + the country shape ============ */}

          {/* 2. Scorecard: the eight headline facts, engraved. */}
          <EngravedSection id="scorecard" eyebrow="At a glance" heading={`${countryName} at a glance`}>
            <Scorecard metrics={scorecardMetrics} sample={!hasAnyScorecard} />
          </EngravedSection>

          {/* 3. The country shape: the nine-lens profile, a qualitative read. */}
          <EngravedSection
            eyebrow="The country shape"
            heading="The nine lenses, at a glance"
            sub="A profile of this country's shape across the nine questions an owner runs through. A character read, never a score; cities stay the only scored entity."
          >
            <CountryShape lenses={lenses} sample={!hasShape} />
          </EngravedSection>

          <AtlasDivider variant="rosette" label="Reward and cost" />

          {/* ================= REWARD + COST + ENTRY ================= */}

          {/* 4. Cost and rules to set up (the decisive read). Carries the
              required "decisive" id. The engraved stepper holds the real
              register route; the held tax / payroll / time figures and the
              per-tier formation cost table sit beneath it. */}
          <EngravedSection
            id="decisive"
            eyebrow="The decisive read"
            heading={view.decisive ? view.decisive.heading : `What it costs to run a business in ${countryName}`}
            sub={view.decisive?.lede ?? null}
            card
          >
            <SetupStepper steps={setupSteps} sample={!hasSetup} />
            {view.decisive && view.decisive.steps.length > 0 ? (
              <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
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
            ) : null}
            {view.decisive?.salesTaxNote ? (
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cocoa-700">
                {view.decisive.salesTaxNote}
              </p>
            ) : null}
            <div className="mt-6 border-t border-parchment/60 pt-6">
              <BusinessFormationCosts countryIso2={iso2} countryName={meta.name} />
            </div>
            {view.decisive?.downLink ? (
              <p className="mt-3 text-sm">
                <a
                  href={view.decisive.downLink.href}
                  className="font-medium text-atlas-700 transition-colors hover:text-atlas-900"
                >
                  {view.decisive.downLink.label}
                </a>
              </p>
            ) : null}
          </EngravedSection>

          <AtlasDivider variant="contour" label="People" />

          {/* ===================== PEOPLE ===================== */}

          {/* 5. Hiring and the cost of a team. Carries the required "hire" id. */}
          <EngravedSection
            id="hire"
            eyebrow="Hiring here"
            heading={view.hire ? view.hire.heading : `How hard it is to hire in ${countryName}`}
            sub={view.hire?.lede ?? "Staff are the largest controllable cost in most small businesses. What you pay, plus what the employer adds on top, sets the real cost of a hire."}
            card
          >
            {hireHasFull ? (
              // Full set held: the engraved gauge leads.
              <HiringRead
                floor={minWageAnnualUsd}
                typical={typicalPayAnnualUsd}
                daysToHire={hireDaysToHire}
                staffCostPct={staffCostPct}
                currency="$"
                period="/yr"
              />
            ) : view.hire && view.hire.points.length > 0 ? (
              // Real wage figures held but not the full gauge set (days-to-hire is
              // not held): lead with the real held facts, no contradictory sample.
              <ul className="space-y-2.5">
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
            ) : (
              // Nothing held: the engraved component's honest sample state.
              <HiringRead sample />
            )}
          </EngravedSection>

          {/* 6. The talent reality: not held, so the engraved sample state. */}
          <EngravedSection
            eyebrow="The talent reality"
            heading="Can you find and keep skilled people"
          >
            <TalentReality signals={null} culture={null} />
          </EngravedSection>

          <AtlasDivider variant="contour" label="Demand" />

          {/* ===================== DEMAND ===================== */}

          {/* 7. Who has money to spend: the spending-power read (real) + a
              sample spend mix. */}
          <EngravedSection
            eyebrow="Who has money"
            heading={`Who has money to spend in ${countryName}`}
          >
            <WhoHasMoney spendingPower={spendingPower} mix={null} sample={spendingPower == null} />
          </EngravedSection>

          {/* 8. How far you can reach: population real, reach indicators sample. */}
          <EngravedSection
            eyebrow="How far you reach"
            heading="The market you can reach from here"
          >
            <HowFarYouReach
              population={
                isNum(population)
                  ? { value: popCompactDisplay(population), label: "people, the home market" }
                  : null
              }
              reach={reachIndicators}
              caveat="Population is the home market. Delivery and online reach are added as each is confirmed."
            />
          </EngravedSection>

          <AtlasDivider variant="rosette" label="Comparison and edge" />

          {/* ================ COMPARISON + EDGE ================ */}

          {/* 9. Versus the neighbours. Carries the required "neighbours" id. */}
          <EngravedSection
            id="neighbours"
            eyebrow="Vs neighbours"
            heading={view.neighbours ? view.neighbours.heading : `How ${countryName} compares to its neighbours`}
            sub="The same set-up facts, side by side. These are different price regimes, so a figure here is a fact about each country, never a ranking across them."
            card
          >
            <Neighbours
              metrics={hasNeighbours ? neighbourMetrics : null}
              countries={hasNeighbours ? neighbourColumns : null}
              homeKey={iso2.toLowerCase()}
              caveat="Tax and pay figures are not adjusted for local prices. Read each column on its own terms, not as a league table."
              sample={!hasNeighbours}
            />
          </EngravedSection>

          {/* 10. The opportunity gap: trade-level density not held, so sample. */}
          <EngravedSection
            eyebrow="The opportunity gap"
            heading="Where money is present and few firms compete"
          >
            <OpportunityGap trades={null} sample />
          </EngravedSection>

          {/* 11. Same business, here vs abroad: like-for-like trade pair not
              held, so the honest sample. */}
          <EngravedSection
            eyebrow="Here vs abroad"
            heading="The same business, here versus the best comparable country"
          >
            <SameBusinessAbroad trade={null} here={null} abroad={null} sample />
          </EngravedSection>

          {/* 12. Special zones: none curated for most, so it self-omits to the
              honest sample. */}
          <EngravedSection
            eyebrow="Special zones"
            heading="Zones and structures that change the math"
          >
            <SpecialZones zones={null} />
          </EngravedSection>

          {/* 13. Licences: no country-wide licence dataset held, so sample. */}
          <EngravedSection
            id="licences"
            eyebrow="Licences"
            heading={`What you need to open one in ${countryName}`}
          >
            <LicenceCheck items={null} />
          </EngravedSection>

          <AtlasDivider variant="contour" label="Risk" />

          {/* ===================== RISK ===================== */}

          {/* 14. The ground under you: corruption + ease real, stability +
              currency sample. */}
          <EngravedSection
            eyebrow="The ground under you"
            heading="How solid the footing is for a small shop"
          >
            <GroundUnderYou
              factors={groundFactors}
              summary={
                hasGround
                  ? "Two factors read off held figures; stability and currency fill in as they are confirmed."
                  : null
              }
            />
          </EngravedSection>

          <AtlasDivider variant="rosette" label="The place" />

          {/* ===================== THE PLACE ===================== */}

          {/* 15. Cities: uniform, equal-weight cards. Carries the required
              "cities" id. The engraved grid shows the read; the links below
              step into each city. */}
          <EngravedSection
            id="cities"
            eyebrow="Cities"
            heading={`The cities of ${countryName}`}
            sub="Step into a city for the local read on rent, pay, and what an owner keeps. Every place is shown the same way, no ranking."
            card
          >
            <CitiesGrid cities={hasCities ? cityCards : null} sample={!hasCities} />
            {cityLinks.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {cityLinks.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${iso2.toLowerCase()}/${city.slug}/restaurants`}
                    className="inline-flex items-center rounded-lg border border-parchment bg-white px-3 py-1.5 text-sm font-medium text-ink-900 transition-colors hover:border-atlas-500 hover:text-atlas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500 focus-visible:ring-offset-2"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </EngravedSection>

          {/* The easiest businesses to break into here (ranks ACTIVITIES). Rides
              a bare seated section, the component owns its own header. */}
          {hasBreakIn ? (
            <section
              id="break-in"
              className="rounded-lg border border-parchment bg-cream-50 px-5 py-5 md:px-7 md:py-6"
            >
              <EasiestToBreakIn
                rows={easiestBreakIn}
                placeName={meta.name}
                showScores={easiestBreakIn.some((r) => r.openingHref != null)}
              />
            </section>
          ) : null}

          {/* 16. Character. Carries the required "character" id. From the
              country signature, rendered in the engraved CharacterPanel. */}
          <EngravedSection
            id="character"
            eyebrow="Character"
            heading={`What makes ${countryName} distinct`}
            card
          >
            <CharacterPanel
              spectra={hasCharacter ? charSpectra : null}
              stats={charStats.length > 0 ? charStats : null}
              sample={!hasCharacter}
            />
          </EngravedSection>

          {/* 17. What locals know: exemplar where curated, else the sample. */}
          <EngravedSection
            id="locals"
            eyebrow="What locals know"
            heading="A few things the figures do not say"
          >
            <LocalsKnow items={localInsights} sample={localInsights == null} />
          </EngravedSection>

          {/* 18. What your life looks like here: not held, so the sample. */}
          <EngravedSection
            eyebrow="Your life here"
            heading="What the owner's day actually feels like"
          >
            <YourLifeHere dimensions={null} sample />
          </EngravedSection>

          <AtlasDivider variant="rosette" label="The close" />

          {/* ===================== CLOSE ===================== */}

          {/* 19. Versus the world: real GDP per capita vs the global median. */}
          <EngravedSection
            id="vs-world"
            eyebrow="Vs the world"
            heading="This country against a global median"
            card
          >
            <VsWorld
              metric="GDP per capita"
              here={gdpPerCapita}
              world={globalMedianGdpPerCapita}
              format={(v) => usdCompactDisplay(v)}
              hereLabel={meta.name}
              caveat="Not adjusted for local prices. A bigger number means a richer customer, not an easier market."
              sample={!isNum(gdpPerCapita) || !isNum(globalMedianGdpPerCapita)}
            />
          </EngravedSection>

          {/* 20. The honest take: SMALL and low, data-first. */}
          <EngravedSection
            id="honest-take"
            eyebrow="The honest take"
            heading={`The honest read on ${countryName}`}
          >
            <HonestTake
              verdict={view.honestTake?.verdict ?? null}
              ticks={view.honestTake?.points && view.honestTake.points.length > 0 ? view.honestTake.points : null}
              sample={view.honestTake == null}
            />
          </EngravedSection>

          {/* 21. Gut check: three plain questions as a small visual. */}
          <EngravedSection
            id="gut-check"
            eyebrow="Gut check"
            heading={`Three questions before you start in ${countryName}`}
          >
            <GutCheck prompts={gutCheckQuestions} />
          </EngravedSection>

          {/* 22. One thing to remember: the page's last word + freshness. */}
          <OneThing
            sentence={view.honestTake?.verdict ?? null}
            lastChecked="June 2026"
            sample={view.honestTake == null}
          />

          {/* 23. Related: the Compare CTA, the closing beat. Carries the
              required "related" id. */}
          <EngravedSection
            id="related"
            eyebrow="Next move"
            heading={`Put ${meta.name} against its peers`}
            card
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
          </EngravedSection>

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

/* Chrome is opted into, not inherited. The site masthead, <main> and footer
   moved out of the root layout into <SiteChrome> so that the spine-2 trade
   page , which carries its own , can render without them. This tree sits
   outside src/app/(site)/ because it holds both kinds of route, so each page
   here asks for the chrome explicitly. */
export default function CountryPage(props: Parameters<typeof CountryPageBody>[0]) {
  return (
    <SiteChrome>
      <CountryPageBody {...props} />
    </SiteChrome>
  );
}
