/**
 * Country landing page — /us, /de, /fr, /jp, etc.
 *
 * Plan v3.0 §O.3. Shows: flag + name + coverage tier, signature line,
 * top SMB-relevant industries, "Compare {country}" CTA.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopIndustriesForCountry, slugify } from "@/lib/cells";
import {
  COUNTRIES,
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  industryToSlug,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { CountryCityShortcuts } from "@/components/CountryCityShortcuts";
import { CountryStatsStrip } from "@/components/CountryStatsStrip";
import { CountryAtAGlance } from "@/components/CountryAtAGlance";
import { hasRegionalCoverage } from "@/lib/coverage/regional";
import { getAdmin1Regions } from "@/lib/coverage/admin1";
import { COUNTRY_PAGE_SECTIONS, getToneClass } from "@/lib/page-layout/section-order";
import { getCountryAnchor } from "@/lib/content/country-anchors";
import { fmtMoney } from "@/lib/format/money";

// Keep section-order constant referenced for type checking — sections render in this exact order below.
void COUNTRY_PAGE_SECTIONS;

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { country: string };

// Plan v32 — COUNTRY_SIGNATURE removed alongside the hero photo. The
// per-country tagline is now sourced from getCountryAnchor(), and the
// signature glyph is no longer used anywhere on the country page.

// Plan v16: cap build-time static generation to the top 25 countries
// by traffic potential (G7 + major emerging markets + key SMB hubs).
// The remaining ~170 countries render on demand via dynamicParams=true.
// Previous behavior pre-built all 195, which timed out Vercel's per-page
// 60s budget on low-coverage entries that did long Supabase fallback walks.
const STATIC_COUNTRY_CODES = new Set([
  "US", "GB", "DE", "FR", "IT", "ES", "JP", "BR", "MX", "CA",
  "AU", "NL", "BE", "CH", "AT", "SE", "PL", "PT", "IE", "DK",
  "IN", "CN", "ID", "TR", "AE",
]);

export async function generateStaticParams(): Promise<Params[]> {
  return COUNTRIES
    .filter((c) => STATIC_COUNTRY_CODES.has(c.code))
    .map((c) => ({ country: c.code.toLowerCase() }));
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
  // Plan v13 Wave 1 — countries with only city-level data (e.g. Argentina)
  // must not advertise a sub-regional view. The flag is plumbed here so
  // any future Regions tab/section can be wrapped with `{showRegions ? ... : null}`.
  // Today the country page surfaces only cities + cell-page entrypoints,
  // neither of which depend on region-level coverage.
  const showRegions = hasRegionalCoverage(iso2);
  void showRegions;

  // Plan v13 Wave 4d — admin-1 sub-region navigation list. All 194 countries
  // (except SG) have admin1 data. Empty array → silent omission per Wave 4a
  // (D2): no "Regions not available" banner.
  const regions = getAdmin1Regions(iso2);
  const countryName = meta.name;

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

      {/* 1. hero: Plan v32 — photo removed (founder flagged photos as
         unprofessional). Hero now carries information, not decoration:
         compact title + tagline + a 5-stat at-a-glance row so the first
         frame tells the user the depth of coverage, the scale of typical
         businesses, the local SMB sector mix, and the after-CIT owner
         take in one glance. No background colour: the section sits on
         the site-wide atlas-paper pattern from layout.tsx. */}
      <section id="hero" className="pt-2 pb-6">
        <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
          Country
        </div>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-ink-900 flex items-center gap-3 flex-wrap">
          <span className="inline-flex pl-1">
            <CountryFlag iso2={iso2} className="w-10 md:w-14" />
          </span>
          <span>{meta.name}</span>
        </h1>
        <p className="mt-3 text-base md:text-lg text-ink-700 max-w-3xl leading-relaxed">
          {getCountryAnchor(iso2, meta.name)}
        </p>

        <CountryAtAGlance iso2={iso2} topIndustries={topIndustries} />
      </section>

      {/* 2. country-stats: Track FF.2 tax overlay tiles. The standalone
         quality-summary card was rolled up into the at-a-glance above. */}
      <section id="country-stats" className={`py-6 ${getToneClass("country-stats")}`}>
        <CountryStatsStrip iso2={iso2} />
      </section>

      {/* 3. industry-mix-grid: top activities in this country. Country-page
         rebuild §5 (2026-05-25): retitled to "What people actually run" to
         describe what the section actually is (a curated index of the
         densest local SMB activities), not a "biggest revenue" leaderboard.
         Section reads only if §3 returned >= 1 plausible activity. */}
      {topIndustries.length > 0 && (
        <section id="industry-mix-grid" className={getToneClass("industry-mix-grid")}>
          <div className="py-8">
            <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
              What people actually run in {meta.name}
            </h2>
            {/* useless-tile-ok: subtitle describes the ranking criterion, not a count of things we cover */}
            <p className="mt-1 text-sm text-ink-700/70">
              Activities ranked by how often they show up in the local small-business
              mix. Click any tile for the full benchmark.
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
                    className="block px-4 py-3 rounded-xl border border-cream-300 bg-white hover:border-atlas-600 hover:shadow-[0_6px_18px_rgba(120,53,15,0.08)] transition"
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

      {/* 5. regions: Plan v13 Wave 4d. Admin-1 sub-region navigation list
         for all 194 countries with admin1 data. Country-page rebuild §4
         (2026-05-25): tile chrome bumped to match the activities grid so
         the region tile READS as clickable (was visually subdued, founder
         flagged "regions are not even clickable" though the Link element
         was always present). */}
      {regions.length > 0 ? (
        <section id="regions" className={`py-8 ${getToneClass("regions")}`}>
          <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold mb-3">
            Regions of {countryName}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {regions.map((r) => (
              <Link
                key={r.admin1_code}
                href={`/${iso2.toLowerCase()}/${r.slug}`}
                className="group flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-cream-300 bg-white hover:border-atlas-600 hover:shadow-[0_6px_18px_rgba(120,53,15,0.08)] text-ink-900 transition"
              >
                <span className="font-medium">{r.name}</span>
                <span
                  aria-hidden="true"
                  className="text-atlas-700 opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 6. tax-overview: Plan v13 Wave 4a (D2): stub removed. The real
         tax panel will be added when the component exists; until then the
         section silently does not render. */}

      {/* 7. related-countries: Compare CTA. Kept because it's an evergreen
         navigation aid, not a data-dependent section. */}
      <section id="related-countries" className={`py-10 ${getToneClass("related-countries")}`}>
        <div className="card-cream">
          <h2 className="text-lg font-semibold text-ink-900">
            Compare {meta.name} to other countries
          </h2>
          <p className="mt-1 text-sm text-ink-800">
            Pick any industry and put {meta.name} side-by-side with up to three other countries.
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
