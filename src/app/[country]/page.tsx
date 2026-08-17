/**
 * Country landing page - /us, /gb, /de, /fr, /jp, etc.
 *
 * Rewired to the engraved Section Constitution spine (docs/brand/section-
 * constitution.md, the COUNTRY page, organized by the nine judgment lenses).
 * The hero block is the flag + H1 = country name with id="headline" + the fixed
 * subtitle + AddToWatch; the BODY below it is the engraved style, composed
 * entirely from the engraved component family in @/components/kit/engraved.
 *
 * SURFACES, 2026-08-17. Every section on this page is one .atlas-card and
 * nothing else: the hero, the twenty-two engraved sections, the break-in board.
 * That is the founder's rule read literally, "we put everything in those cards",
 * and it is also the only thing that makes this page visible. AtlasFrame paints
 * from fixed layers at z-index 0, so a static element is painted OVER by the
 * frame's opaque base; every section here was static. See the note on
 * EngravedSection for the measurement.
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
  type TalentSignal,
  WhoHasMoney,
  HowFarYouReach,
  type ReachIndicator,
  Neighbours,
  type NeighbourCountry,
  type NeighbourMetric,
  OpportunityGap,
  type OpportunityTrade,
  SameBusinessAbroad,
  type SameBusinessSide,
  SpecialZones,
  type SpecialZone,
  LicenceCheck,
  type LicenceItem,
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
  type LifeDimension,
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
 * The marker for a section input this atlas does not hold for any country.
 *
 * It returns null, and it exists so the declared type survives: a plain
 * `const x: T | null = null` is narrowed by the compiler to `null`, which turns
 * the section body that consumes it into dead code the type checker refuses to
 * read. Written this way, the section keeps its real prop types, self-omits
 * today, and starts rendering the moment a real value is returned here instead.
 * A section that self-omits is not a section that was deleted.
 */
function notHeld<T>(): T | null {
  return null;
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
 * A reusable engraved section wrapper: an eyebrow + heading, then the content,
 * on ONE .atlas-card. `id` attaches the canonical anchor as a real
 * <section id="...">, which the section gates scan.
 *
 * IT WAS TWO SHAPES AND THE HEADING NEVER HAD A SURFACE. This took a `card`
 * flag: true wrapped the children in the flat cream hand-roll (a rounded-lg
 * parchment hairline over the cream-50 step, spelled out nowhere in this
 * comment because Tailwind's content scan does not strip comments and naming a
 * retired utility in prose re-emits it into the stylesheet, a trap this project
 * has already paid for once), false rendered them bare. Either way the eyebrow,
 * the h2 and the lede sat
 * OUTSIDE the plate, on whatever the page ground happened to be. That was fine
 * when the ground was paper. Since AtlasFrame paints a fixed photograph with no
 * centre plate it means dark type straight on a picture, above an opaque cream
 * rectangle that blocks the picture dead. The founder's rule is the literal
 * opposite: "we put everything in those cards."
 *
 * So: one card, always, holding the heading trio and the content. The flag is
 * gone rather than defaulted, because a section that opted out was opting out of
 * legibility. Components that draw their own inner chrome (the engraved score
 * grid, the city cards) are marks on this surface, not competing plates: their
 * fill is `--surface-card`, the same paint .atlas-card carries, so what reads is
 * their hairline structure and not a second ground.
 *
 * .atlas-card is also `position: relative`, which is load-bearing here and not
 * decoration. AtlasFrame paints from `position: fixed` layers at `z-index: 0`,
 * so a static element and everything inside it is painted OVER by the frame's
 * opaque base. Measured on a reproduction of the real layering: a static block
 * with a solid fill sampled identical to the empty gutter, i.e. gone, while the
 * same block set `relative` sampled its own colour. Every section on this page
 * was static.
 */
function EngravedSection({
  id,
  eyebrow,
  heading,
  sub,
  children,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  sub?: string | null;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={heading}
      className="atlas-card px-5 py-5 md:px-7 md:py-6"
    >
      <div className="mb-4">
        <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow>
        <h2 className="font-display text-lg font-medium tracking-tight text-balance text-ink-900 md:text-xl">
          {heading}
        </h2>
        {sub ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">
            {sub}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

async function CountryPageBody({ params }: { params: Promise<Params> }) {
  // Spine reform (flag-gated, default OFF). The spine body renders the bundled
  // GB seed regardless of `params`; that is intentional for this scaffold and
  // never ships live because the flag stays OFF until real-data adapters land.
  if (isSpineReformEnabledFor("country")) {
    return (
      <SpineShell>
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
    lenses.push({ key: "entry", label: "Ease of entry", score: entry, read: wordFromScore(entry) });
  }
  // People: can you afford a team, from the wage level (higher wages read as a
  // deeper, more capable labour pool but a costlier hire; here we read capability).
  // "Talent", not "People": he renamed it 2026-08-09 so the axis says what it
  // reads. Same for the two below.
  if (salaryScore != null) lenses.push({ key: "people", label: "Talent", score: salaryScore, read: wordFromScore(salaryScore) });
  // Purchasing power: is there money here, from GDP per capita + net wealth.
  const demandParts = [gdpScore, wealthScore].filter((s): s is number => s != null);
  if (demandParts.length > 0) {
    const demand = demandParts.reduce((a, b) => a + b, 0) / demandParts.length;
    lenses.push({ key: "demand", label: "Purchasing power", score: demand, read: wordFromScore(demand) });
  }
  /* EDGE IS GONE, ratified 2026-08-09 (option A of /dev/options/hexagon).
     It was clamp01(1 - selfEmploymentPct / 60), sold as "a less-crowded market
     leaves more room". It does not read that. High self-employment mostly means
     INFORMAL work, not an empty market, and it runs near 90% in low-income
     countries, so the lens scored highest where an economy is poorest , the
     opposite of the thing it claimed to measure.
     This project had already rejected a rule with the identical confound:
     firing 12 killed the wage-to-GDP band because a median wage describes wage
     earners while GDP divides across everyone. Nobody connected the two.
     selfEmploymentPct is still held and still used elsewhere; only this
     derivation goes. */
  // Risk: will the ground hold, from corruption perception + ease of business.
  const riskParts: number[] = [];
  if (isNum(corruptionIndex)) riskParts.push(clamp01(corruptionIndex / 100));
  if (easeScore != null) riskParts.push(easeScore);
  if (riskParts.length > 0) {
    const risk = riskParts.reduce((a, b) => a + b, 0) / riskParts.length;
    lenses.push({ key: "risk", label: "Risk", score: risk, read: wordFromScore(risk) });
  }
  /* MOMENTUM AND PATH ARE GONE, same ruling. Both were pushed at a hardcoded
     0.5 with sample:true because no trend data is held. The sample tag made
     them honest and did not make them informative: they were two sides of a
     polygon that moved for no country. When trend data lands they come back
     with a source, not with a placeholder. */
  /* No lens carries sample:true any more , the two that did were the ones
     removed , so this is now a plain count of real lenses. Kept at 3 of 6:
     a shape drawn from fewer than half its axes is a shape about nothing, and
     the honest sample state is better than a lopsided hexagon. */
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
  // Wage floor + typical pay + employer on-cost, all from held figures.
  //
  // WHAT WAS WRONG, measured 2026-08-17. This read demanded four inputs and one
  // of them, days-to-hire, is held for zero countries: no time-to-fill figure
  // exists anywhere in this repo (the typed slot in the spine contract is null
  // even in the hand-built exemplar). So the gauge could never render, for any
  // country, and the section fell through to three lines of prose that restate
  // the same wage numbers the gauge would have drawn.
  //
  // The two pay figures ARE held, by the same accessor this page already trusts
  // for the scorecard's minimum-wage and average-salary rows, so no new figure
  // enters the page: the read now DRAWS what the page was already printing as
  // prose. The gauge runs on them, drops its days dial, and drops the on-cost
  // sentence for the 65 countries that hold no employer rate.
  //
  // Coverage measured across all 195 taxonomy countries: 130 render the bars,
  // 65 fall back to the view model's prose read, and all 65 miss the same
  // input, the employer on-cost.
  const staffCostPct =
    isNum(countryRates.employerSocial) && countryRates.employerSocial > 0
      ? Math.round(countryRates.employerSocial * 100)
      : null;
  const hireHasBars = isNum(minWageAnnualUsd) && isNum(typicalPayAnnualUsd);

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
  // Delivery radius, online reach and urban density are held for no country.
  // The population figure below IS held, so the section keeps its real spine and
  // the gauge strip self-omits inside the component.
  const reachIndicators: ReachIndicator[] | null = null;

  /* ------------- THE SECTIONS THAT SELF-OMIT, AND WHY -----------------
     Measured 2026-08-17, per input, against every accessor this repo has.
     Each of these was rendering a tagged empty box on every country page, for
     every country, because its input is a literal null and nothing anywhere can
     fill it. An empty gauge that can never fill is worse than no gauge, so each
     section is now conditional on its own input: nothing renders today, and the
     whole section returns unchanged the moment a real set is assigned here.
     Nothing is estimated, derived, or filled with sample rows.

     talentSignals    Whether skilled people can be found and kept. The only
                      country-wide labour rows in the repo are modeled at
                      confidence 0.55 with zero held rows across 198 countries,
                      so using them would be an estimate printed as a fact.
                      Retention and turnover are not held even as estimates.
     opportunityGap   Money present against how few firms compete. Per-trade firm
                      density is a modeled archetype, not a measured count, and
                      the break-in panel already ranks the same activities from
                      the same inputs, so this would be a second opinion drawn
                      from one source.
     abroadPair       The same trade here versus the best comparable country.
                      Needs one trade resolved on both sides; no country-pair
                      take-home is held and none is loaded.
     specialZones     No zone data exists. The hand-built exemplar is explicitly
                      null with the reason that no zone moves the arithmetic for
                      a high-street trade.
     licenceItems     No country-wide permit set. One country carries five rows
                      and they are tagged as placeholders.
     lifeDimensions   Hours, safety, healthcare, schools, commute: none held.  */
  const talentSignals = notHeld<TalentSignal[]>();
  const opportunityTrades = notHeld<OpportunityTrade[]>();
  const abroadPair = notHeld<{
    trade: string;
    here: SameBusinessSide;
    abroad: SameBusinessSide;
  }>();
  const specialZones = notHeld<SpecialZone[]>();
  const licenceItems = notHeld<LicenceItem[]>();
  const lifeDimensions = notHeld<LifeDimension[]>();

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
  /* TWO SECTIONS OF SIX, RESTORED 2026-08-09 ON HIS INSTRUCTION.
     "There were two sections that should be close to each other: one related to
      the government, with five horizontal bars, and one related to the culture,
      again with five horizontal bars. That was either deleted, either
      fundamentally changed. I want those two sections back because they have
      great value."

     He is right, and what happened is worse than a redesign. country_signature
     holds SIX culture spectra and SIX government spectra. This block rendered
     four of the culture six and TWO of the government six, and pushed both into
     one flat array, so two sections of six became one undifferentiated list of
     six and half the data was silently dropped:

       culture     dropped corruption_rejection, ambition_chest_beating
       government  dropped task_efficiency, time_efficiency,
                   judicial_impartiality, innovation_capacity

     Nothing recorded the drop. That is exactly the failure his 2026-06-18
     ruling names: "NEVER drop or butcher agreed sections", and the country
     character is the section it names.

     Six each, not five. He said five; the data holds six and the original spec
     was two six-spectra tables. Six is kept and flagged here rather than
     trimmed to match a number said from memory. */
  const sig = getCountrySignature(iso2);
  const norm10 = (v: number | undefined) => (isNum(v) ? clamp01(v / 10) : null);
  const norm1to10 = (v: number | undefined) => (isNum(v) ? clamp01((v - 1) / 9) : null);

  const cultureSpectra: CharacterSpectrum[] = [];
  if (sig?.culture) {
    const cu = sig.culture;
    const push = (v: number | undefined, label: string, low: string, high: string) => {
      const n = norm1to10(v);
      if (n != null) cultureSpectra.push({ label, value: n, low, high });
    };
    push(cu.openness_to_foreigners, "Openness", "Insular", "Welcoming");
    push(cu.innovation, "Innovation", "Tradition-bound", "Embraces the new");
    push(cu.communication_directness, "Directness", "Indirect", "Direct");
    push(cu.punctuality, "Time", "Loose", "Strict");
    push(cu.corruption_rejection, "Straight dealing", "Tolerated", "Rejected");
    push(cu.ambition_chest_beating, "Ambition", "Understated", "Loud");
  }

  const governmentSpectra: CharacterSpectrum[] = [];
  if (sig?.government) {
    const gov = sig.government;
    const push = (v: number | undefined, label: string, low: string, high: string) => {
      const n = norm10(v);
      if (n != null) governmentSpectra.push({ label, value: n, low, high });
    };
    push(gov.tax_predictability, "Tax predictability", "Erratic", "Predictable");
    push(gov.low_bribery, "Clean dealing", "Greased", "Clean");
    push(gov.task_efficiency, "Getting things done", "Slow", "Efficient");
    push(gov.time_efficiency, "Waiting time", "Long", "Short");
    push(gov.judicial_impartiality, "Courts", "Partial", "Impartial");
    push(gov.innovation_capacity, "Openness to the new", "Resistant", "Receptive");
  }

  /* Kept for the callers below that still take one list. The two sections above
     are what renders; this is the union, in a stable order, never a substitute
     for them. */
  const charSpectra: CharacterSpectrum[] = [...governmentSpectra, ...cultureSpectra];
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

  const nav = countryViewNav(view, true, hasBreakIn, hasCities, licenceItems != null);

  return (
    <div className="xl:flex xl:gap-16">
      {/* `relative` is the stacking lift for everything in this column that is
          NOT a card: the breadcrumb, the six dividers, the one-thing block and
          the closing freshness stamp. AtlasFrame's fixed layers sit at z-index
          0, which paints them over any static sibling; one positioned ancestor
          puts the whole column back in front of the photograph. */}
      {/* `[&_[id]]:scroll-mt-24` is not decoration. The masthead is
          `sticky top-0` and 89px tall, and every anchor target on this page had
          scroll-margin-top: 0, so clicking any entry in the right-rail "On this
          page" landed the section's eyebrow and h2 UNDER the opaque bar and the
          reader arrived mid-sentence. Measured in the browser, not inferred:
          jumping to a section put its heading at y=0 with 89px of masthead over
          it. 24 (6rem, 96px) clears the bar with a little air, and is the step
          `scroll-mt-24` already used in seven places in this repo, so this is
          converging on the existing answer rather than inventing one. Applied
          once on the column instead of at ~20 call sites because the anchors
          are section, div and component alike. */}
      <div className="relative [&_[id]]:scroll-mt-24 xl:min-w-0 xl:flex-1">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-ink-700/70">
          <a href="/" className="hover:text-atlas-600">Home</a>
          <span className="mx-2">/</span>
          <span className="inline-flex items-center gap-1">
            <CountryFlag iso2={iso2} className="w-4" />
            <span>{meta.name}</span>
          </span>
        </nav>

        {/* 1. Hero: the flag, the H1 = JUST the country name (id="headline"),
            one fixed subtitle, and AddToWatch, on the site card.

            THE SECOND PHOTOGRAPH IS GONE. This block mounted
            <CountryMastheadImage>, a per-country hero photo, inside a bare
            rounded-2xl hairline frame with no fill. That was written when the
            page ground was paper and the photo was the deliberate exception to
            it. AtlasFrame now paints the founder's own skyline, fixed, behind
            every page on the site, so this was one picture laid over another,
            and the country page was the ONLY page type still doing it: the city
            and cell mastheads had already dropped theirs. Worse, the treatment
            it shares (board/MastheadImage) fades the photo out through
            rgba(255,247,230,...) at .55 to .97, which is cream, banned outright,
            and near-opaque by the bottom of the block.

            What replaces it is the surface every other masthead on the site now
            uses: one .atlas-card. Same paint as the city hero. The picture the
            founder wanted behind the page is the one that shows through. */}
        <section id="hero" className="atlas-card mb-6 px-5 pt-7 pb-6 md:px-8 md:pt-9 md:pb-7">
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
            /* Was: "A profile of this country's shape across the nine questions
               an owner runs through" plus what is left. The first sentence said
               the eyebrow and the heading again in longer words. The honesty
               half is the half that carries anything. */
            sub="A character read, never a score. Cities stay the only scored entity."
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
            /* The lede must not promise the on-cost where no employer rate is
               held, or it describes a line the card does not carry. Both
               branches opened on "Staff are the largest controllable cost in
               most small businesses", which is true of every country on the
               site and therefore says nothing about this one. */
            sub={
              view.hire?.lede ??
              (staffCostPct != null
                ? "What you pay, plus what the employer adds on top."
                : "The law sets the floor. Keeping someone good costs more.")
            }
          >
            {hireHasBars ? (
              // The three held figures lead, drawn rather than described. The
              // days dial is dropped by the component because nothing holds a
              // time-to-fill; it returns on its own the day one lands.
              <HiringRead
                floor={minWageAnnualUsd}
                typical={typicalPayAnnualUsd}
                daysToHire={null}
                staffCostPct={staffCostPct}
                currency="$"
                period="/yr"
              />
            ) : view.hire && view.hire.points.length > 0 ? (
              // No held wage profile for this country: the view model's own real
              // figures carry the read instead, with no contradictory sample.
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

          {/* 6. The talent reality. Self-omits until a held labour read lands. */}
          {talentSignals ? (
            <EngravedSection
              eyebrow="The talent reality"
              heading="Can you find and keep skilled people"
            >
              <TalentReality signals={talentSignals} culture={null} />
            </EngravedSection>
          ) : null}

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

          {/* 8. How far you can reach. The population figure is real; the gauge
              strip self-omits inside the component until an indicator is held. */}
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
              caveat="The whole country, not the customers you can serve. A shop reaches a street, so this is the ceiling, never the market."
            />
          </EngravedSection>

          <AtlasDivider variant="rosette" label="Comparison and edge" />

          {/* ================ COMPARISON + EDGE ================ */}

          {/* 9. Versus the neighbours. Carries the required "neighbours" id. */}
          <EngravedSection
            id="neighbours"
            eyebrow="Vs neighbours"
            heading={view.neighbours ? view.neighbours.heading : `How ${countryName} compares to its neighbours`}
            /* No lede. It said "the same set-up facts, side by side", which is
               what the table visibly is, and then made the not-a-ranking point
               that the caveat below makes again eight lines later, next to the
               figures it actually guards. One of the two had to go. */
          >
            <Neighbours
              metrics={hasNeighbours ? neighbourMetrics : null}
              countries={hasNeighbours ? neighbourColumns : null}
              homeKey={iso2.toLowerCase()}
              caveat="Tax and pay figures are not adjusted for local prices. Read each column on its own terms, not as a league table."
              sample={!hasNeighbours}
            />
          </EngravedSection>

          {/* 10. The opportunity gap. Self-omits: no measured per-trade density. */}
          {opportunityTrades ? (
            <EngravedSection
              eyebrow="The opportunity gap"
              heading="Where money is present and few firms compete"
            >
              <OpportunityGap trades={opportunityTrades} />
            </EngravedSection>
          ) : null}

          {/* 11. Same business, here vs abroad. Self-omits: no country-pair
              take-home is held for one trade on both sides. */}
          {abroadPair ? (
            <EngravedSection
              eyebrow="Here vs abroad"
              heading="The same business, here versus the best comparable country"
            >
              <SameBusinessAbroad
                trade={abroadPair.trade}
                here={abroadPair.here}
                abroad={abroadPair.abroad}
              />
            </EngravedSection>
          ) : null}

          {/* 12. Special zones. Self-omits: no zone data exists for any country. */}
          {specialZones ? (
            <EngravedSection
              eyebrow="Special zones"
              heading="Zones and structures that change the math"
            >
              <SpecialZones zones={specialZones} />
            </EngravedSection>
          ) : null}

          {/* 13. Licences. Self-omits: no country-wide permit set is held. The
              nav entry is gated on the same flag, so no anchor is advertised. */}
          {licenceItems ? (
            <EngravedSection
              id="licences"
              eyebrow="Licences"
              heading={`What you need to open one in ${countryName}`}
            >
              <LicenceCheck items={licenceItems} />
            </EngravedSection>
          ) : null}

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
            sub="Every place is shown the same way, no ranking."
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

          {/* The easiest businesses to break into here (ranks ACTIVITIES). The
              component owns its own header, so this is the site card and
              nothing else. Was the same flat cream hand-roll EngravedSection
              carried; converged for the same reason. */}
          {hasBreakIn ? (
            <section
              id="break-in"
              className="atlas-card px-5 py-5 md:px-7 md:py-6"
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
          >
            {/* TWO BLOCKS, ADJACENT, RESTORED 2026-08-09. His words: "there
                were two sections that should be close to each other, one
                related to the government and one related to the culture ...
                I want those two sections back because they have great value."

                They sit inside the one #character section rather than becoming
                two top-level sections, because that id is required by the
                section-order gate and by the page's own jumpsheet. Adjacent and
                separately headed is what he described; a second top-level id
                would be a new section, which is a thing this project does not
                add without him. */}
            {hasCharacter ? (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-cocoa-700 mb-4">
                    Dealing with the state
                  </h3>
                  <CharacterPanel spectra={governmentSpectra} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-cocoa-700 mb-4">
                    Dealing with people
                  </h3>
                  <CharacterPanel
                    spectra={cultureSpectra}
                    stats={charStats.length > 0 ? charStats : null}
                  />
                </div>
              </div>
            ) : (
              <CharacterPanel spectra={null} sample />
            )}
          </EngravedSection>

          {/* 17. What locals know: exemplar where curated, else the sample. */}
          <EngravedSection
            id="locals"
            eyebrow="What locals know"
            heading="A few things the figures do not say"
          >
            <LocalsKnow items={localInsights} sample={localInsights == null} />
          </EngravedSection>

          {/* 18. What your life looks like here. Self-omits: no life dimension
              (hours, safety, healthcare, schools, commute) is held. */}
          {lifeDimensions ? (
            <EngravedSection
              eyebrow="Your life here"
              heading="What the owner's day actually feels like"
            >
              <YourLifeHere dimensions={lifeDimensions} />
            </EngravedSection>
          ) : null}

          <AtlasDivider variant="rosette" label="The close" />

          {/* ===================== CLOSE ===================== */}

          {/* 19. Versus the world: real GDP per capita vs the global median. */}
          <EngravedSection
            id="vs-world"
            eyebrow="Vs the world"
            heading="This country against a global median"
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

          {/* 22. One thing to remember: the page's last word + freshness.

             IT WAS THE HONEST TAKE'S VERDICT, WORD FOR WORD, four sections
             above it. Found by diffing the rendered markup for repeated strings
             rather than by reading the source: on /gb the sentence "The United
             Kingdom is an easy place to start and a hard place to keep staff
             cheaply." was emitted twice, once as `.eng-take__verdict` and again
             as `.eng-onething__sentence`, and the same held on /us, /de and /nz
             with their own derived verdicts. A closing beat that restates the
             section above it is not a last word, it is an echo.

             `honestTake.body` is the fix and it was already being computed and
             thrown away: nothing rendered it. For the exemplar it is the wage
             read ("Most owners draw a wage closer to a senior employee than a
             business owner in year one..."), for a thin country it is the
             coverage admission. Both are the page's real last word.

             RESIDUAL, stated rather than hidden: `body` is null for the derived
             middle of the catalogue, so those countries still close on their
             verdict. Fixing that needs a second derived line in
             `country_view.ts`, which is a different file and a different call. */}
          <OneThing
            sentence={view.honestTake?.body ?? view.honestTake?.verdict ?? null}
            lastChecked="June 2026"
            sample={view.honestTake == null}
          />

          {/* 23. Related: the Compare CTA, the closing beat. Carries the
              required "related" id. */}
          <EngravedSection
            id="related"
            eyebrow="Next move"
            heading={`Put ${meta.name} against its peers`}
          >
            {/* Was a sentence that restated the heading and the button between
                which it sat: "pick any activity and set X side by side with up
                to three other countries". The heading says put it against its
                peers, the button says Open Compare. What survives is the only
                part neither of them carries: what you get to compare. */}
            <p className="max-w-2xl text-sm leading-relaxed text-ink-800">
              Revenue, the cost stack, and what an owner keeps, against up to
              three other countries.
            </p>
            <a
              href="/compare"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-atlas-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-atlas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500 focus-visible:ring-offset-2"
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
