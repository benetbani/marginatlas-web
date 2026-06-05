/**
 * Country landing page — /us, /de, /fr, /jp, etc.
 *
 * Flag + name + coverage tier, signature line,
 * top SMB-relevant industries, "Compare {country}" CTA.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopIndustriesForCountry, slugify } from "@/lib/cells";
import { getCitiesForCountry } from "@/lib/cities";
import {
  COUNTRIES,
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  industryToSlug,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { CountryCityShortcuts } from "@/components/CountryCityShortcuts";
import { CountryStatsStrip } from "@/components/CountryStatsStrip";
import { CountryAtAGlance } from "@/components/CountryAtAGlance";
import { hasRegionalCoverage } from "@/lib/coverage/regional";
import { getAdmin1Regions } from "@/lib/coverage/admin1";
import { COUNTRY_PAGE_SECTIONS, getToneClass } from "@/lib/page-layout/section-order";
import { getCountryAnchor } from "@/lib/content/country-anchors";
import { fmtMoney } from "@/lib/format/money";
import { CountrySignaturePanel } from "@/components/countries/CountrySignaturePanel";
import { CountryViabilityLede } from "@/components/countries/CountryViabilityLede";
import { CountryTaxReality } from "@/components/countries/CountryTaxReality";
import { generateCountryVerdict } from "@/lib/scores/country_verdict";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getSmbRegime, getVatRow } from "@/lib/tax/smb_effective_rates";
import { BoardHero } from "@/components/board/BoardHero";
import { DataSection } from "@/components/board/DataSection";
import { buildCountryBoard } from "@/lib/scores/country_board";

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

// Build-time prerender DISABLED (2026-06-04). Mirrors the region page
// (src/app/[country]/[geo]/page.tsx): getTopIndustriesForCountry is a heavy
// Supabase aggregate with no budget wrapper, and prerendering even the top 25
// countries fired 25 such reads concurrently against a cold (and recently
// spend-capped) DB. Each country page then exceeded Vercel's 300s per-route
// static-gen cap, retried 3x, and the build blew the 45-minute limit and
// failed the production deploy (build-log evidence, deploy ks27agr69).
// dynamicParams=true (above) means every country still renders on first
// request and is then cached for `revalidate` seconds, so visitors see no
// difference. Re-enable a small prerender list once the country
// top-industries read is materialized or the DB is bumped off NANO.
export async function generateStaticParams(): Promise<Params[]> {
  return [];
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
    smbEffectiveRate: smbRegime?.effective_rate ?? null,
    vatStandard: vatRow?.standard ?? null,
  });

  // Regions-and-cities nav (founder spec): each region is a non-link heading,
  // and the cities under it are clickable chips. We group the country's
  // curated cities by their region name; each chip links to the same city
  // route the rest of the site uses (the city's default-industry cell). Cities
  // carry a real region_name and display name, so no slug-to-label munging is
  // needed and the grouping works for every covered country. Regions with no
  // cities simply do not appear; the section omits when the country has none.
  const citiesByRegion = (() => {
    const groups = new Map<string, { name: string; slug: string }[]>();
    for (const c of getCitiesForCountry(iso2)) {
      const region = c.region_name?.trim() || countryName;
      if (!groups.has(region)) groups.set(region, []);
      groups.get(region)!.push({ name: c.name, slug: c.slug });
    }
    return Array.from(groups.entries()).map(([region, cities]) => ({
      region,
      cities,
    }));
  })();

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
        Plan v13 Wave 2b: canonical country page section order.
        Sections render in the exact order defined in COUNTRY_PAGE_SECTIONS.
        Sections degrade with an empty-state fallback rather than disappearing,
        so sister country pages always have identical structure.
      */}

      {/* 1. hero: rebuilt on the board kit to match the cell page. The heavy
         editorial masthead (big flag H1 + framing line) is replaced by the
         quiet BoardHero, with the country data board rendered immediately
         under it so the figures reach above the fold, exactly as on the cell
         page. The plain country name is the H1; the country page computes no
         single opportunity score, so the score strip is passed empty (overall
         null, no parts) and renders as a dash. The country's commercial
         character + the blunt "where the money is and what gets in the way"
         answer still follow in the viability lede directly below. The compact
         at-a-glance strip stays under the board as supporting context. */}
      <section id="hero" className="pt-2 pb-6">
        <div className="flex items-center gap-3">
          <CountryFlag iso2={iso2} className="w-8 md:w-10" />
          <SectionEyebrow size="md">Local profit intelligence</SectionEyebrow>
        </div>
        <BoardHero title={meta.name} score={{ overall: null, parts: [] }} />

        {/* The country data board. Five fixed sections the reader can learn
           once and read on every country, rendered immediately under the
           masthead. Each section always renders all of its rows; a datum we do
           not hold shows as the board's dash, so the page shape never depends
           on the data. */}
        <div className="mt-2">
          {board.map((s) => (
            <DataSection section={s} key={s.key} />
          ))}
        </div>

        <p className="mt-6 text-base md:text-lg text-ink-700 max-w-3xl leading-relaxed">
          {getCountryAnchor(iso2, meta.name)}
        </p>

        <CountryAtAGlance iso2={iso2} topIndustries={topIndustries} />
      </section>

      {/* 1.5. Viability lede (bible Section 5, friction-adjusted view). The
         opinionated country-level read: where the money tends to be, the
         operating reality that gets in the way, and the condition under
         which a business actually clears a wage. Pure synthesis from the
         economics snapshot + tax regime already loaded above; mounts only
         when that synthesis produced real signal (see showVerdict). */}
      {showVerdict ? <CountryViabilityLede verdict={countryVerdict} /> : null}

      {/* 2. country-stats: the business-climate signals (sales tax, the
         small-business regime, time to launch, inflation). This is the second
         beat in the decision flow: after the lede says whether a business can
         make money here, the climate strip says what the operating ground
         costs. The standalone quality-summary card was rolled up into the
         at-a-glance above. */}
      <section id="country-stats" className={`py-8 ${getToneClass("country-stats")}`}>
        <CountryStatsStrip iso2={iso2} />
      </section>

      {/* 3. industry-mix-grid: top activities in this country. Reformation
         (bible Section 5, "where the typical money lands"): the section leads
         with the densest local activities and the typical revenue each one
         turns over, framed as a starting point for a decision, not a "biggest
         revenue" leaderboard. The blunt caveat keeps revenue honest: it is
         not take-home. Section reads only if the query returned >= 1
         plausible activity. */}
      {topIndustries.length > 0 && (
        <section id="industry-mix-grid" className={getToneClass("industry-mix-grid")}>
          <div className="py-8">
            <SectionEyebrow className="mb-2">Where the money is</SectionEyebrow>
            <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
              Where the typical money lands in {meta.name}
            </h2>
            {/* useless-tile-ok: subtitle describes the ranking criterion, not a count of things we cover */}
            <p className="mt-1 text-sm text-graphite max-w-2xl leading-relaxed">
              The activities that fill the local small-business mix, ranked by how
              commonly they show up, with what the typical firm turns over.
              Revenue is the top line, not take-home. Open any one for the cost
              stack, the tax, and what is left for an owner.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topIndustries.map((ind) => {
                const indRecord = INDUSTRY_BY_ID[ind.industry_id];
                const sector = indRecord ? SECTOR_BY_ID[indRecord.sector_id] : null;
                const slug = industryToSlug(ind.industry_id);
                const geo = iso2 === "US" ? "california" : slugify(meta.name);
                return (
                  <a
                    key={ind.industry_id}
                    href={`/${iso2.toLowerCase()}/${geo}/${slug}`}
                    className="atlas-card block px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-atlas-700 font-semibold">
                      {sector && <span aria-hidden>{sector.icon}</span>}
                      <span>{sector?.name || "Activity"}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-ink-900">
                      {ind.industry_name}
                    </div>
                    <div className="mt-1.5 text-xs text-cocoa-700">
                      {ind.revenue_per_firm != null ? (
                        <>
                          Typical revenue:{" "}
                          <strong className="text-ink-900">{fmtMoney(ind.revenue_per_firm)}</strong>
                        </>
                      ) : (
                        <span className="text-ink-700/60">Open for full numbers →</span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. top-cities: Track N (Wave 2). CountryCityShortcuts handles its own silent omission. */}
      <section id="top-cities" className={`py-6 ${getToneClass("top-cities")}`}>
        <CountryCityShortcuts iso2={iso2} />
      </section>

      {/* 5. regions: founder spec. Each region is a non-link heading and the
         cities under it are clickable chips. Built by grouping the country's
         curated cities by region name (citiesByRegion above). The region label
         is plain text (an <h3>, deliberately not a link); the city chips link
         to the same city route the rest of the site uses. NO best/worst table
         here. Omits cleanly when the country has no curated cities. */}
      {citiesByRegion.length > 0 ? (
        <section id="regions" className={`py-8 ${getToneClass("regions")}`}>
          <SectionEyebrow className="mb-3">Go local</SectionEyebrow>
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900 mb-4">
            Regions and cities of {countryName}
          </h2>
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
        </section>
      ) : null}

      {/* 6. tax-overview: the friction-adjusted tax read (bible Section 5;
         Section 6 module 10, free-basic tier). Fills the registered
         tax-overview slot, previously empty since the Wave 4a stub was
         pulled. Pure restatement of the sales-tax row + small-business
         regime the page already loaded, with one honest worked figure
         tied to the densest activity. Self-omits when neither rate exists. */}
      <section id="tax-overview" className={`py-8 ${getToneClass("tax-overview")}`}>
        <CountryTaxReality
          countryName={meta.name}
          vat={vatRow}
          regime={smbRegime}
          topActivity={densestActivity}
          fmt={(n) => fmtMoney(n)}
        />
      </section>

      {/* 6.5. Country signature panel (demographics, signature sectors,
          culture spectrum, government scores). Moved below the decision
          flow: it is supporting demographic context, not one of the
          climate-to-industries decision beats, so it no longer interrupts
          the climate strip and the activities grid. No section id, so it
          stays out of the canonical skeleton order. Renders null when the
          country has no signature entry. */}
      <section className="py-6">
        <CountrySignaturePanel iso2={iso2} countryName={meta.name} />
      </section>

      {/* 7. related-countries: Compare CTA. The closing beat of the flow:
         once the read is formed, send the visitor sideways to put this
         country against its peers. Evergreen navigation, not data-dependent. */}
      <section id="related-countries" className={`py-10 ${getToneClass("related-countries")}`}>
        <div className="card-cream">
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
