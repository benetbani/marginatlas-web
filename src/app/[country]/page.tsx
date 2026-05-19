/**
 * Country landing page — /us, /de, /fr, /jp, etc.
 *
 * Plan v3.0 §O.3. Shows: flag + name + coverage tier, signature line,
 * top SMB-relevant industries, "Compare {country}" CTA.
 */

import { notFound } from "next/navigation";
import { getTopIndustriesForCountry, slugify } from "@/lib/cells";
import {
  COUNTRIES,
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  industryToSlug,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { SmartImage } from "@/components/SmartImage";
import { AtlasHeroImage } from "@/components/AtlasHeroImage";
import { pickCountryHeroImage } from "@/lib/images";
import { CountryCityShortcuts } from "@/components/CountryCityShortcuts";
import { CountryStatsStrip } from "@/components/CountryStatsStrip";
import { CountryQualitySummary } from "@/components/CountryQualitySummary";
import { hasRegionalCoverage } from "@/lib/coverage/regional";

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { country: string };

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

const QUALITY_LABEL: Record<string, { label: string; tone: string }> = {
  A: { label: "Highest-quality coverage", tone: "bg-moss-100 text-moss-700 border-moss-300" },
  B: { label: "Strong coverage",           tone: "bg-atlas-100 text-atlas-800 border-atlas-300" },
  C: { label: "Partial coverage",          tone: "bg-cream-200 text-cocoa-700 border-cream-300" },
  D: { label: "Estimated only",            tone: "bg-clay-100 text-clay-700 border-clay-300" },
};

const COUNTRY_SIGNATURE: Record<string, { line: string; glyph: string }> = {
  US: { line: "America's small-business heartland — restaurants, real estate, software.", glyph: "🏬" },
  CA: { line: "Skilled trades, residential construction, and craft food across vast geography.", glyph: "🏗️" },
  AU: { line: "Cafés, hospitality, and small specialty trades from Sydney to Perth.", glyph: "☕" },
  DE: { line: "The Mittelstand — small to mid-size manufacturing and precision trades.", glyph: "🏭" },
  FR: { line: "Boutique food, fashion, cosmetics, and design at every scale.", glyph: "💄" },
  IT: { line: "Family-owned fashion, boutique food, and artisan craft.", glyph: "👗" },
  ES: { line: "Tourism, hospitality, and family hotels across coast and city.", glyph: "🏨" },
  NL: { line: "Small services, design studios, and craft food in compact cities.", glyph: "🚲" },
  PL: { line: "Skilled trades, small manufacturing, and growing services.", glyph: "🔧" },
  SE: { line: "Design studios, software shops, and small consultancies.", glyph: "🪑" },
  CH: { line: "Watches, precision instruments, boutique services.", glyph: "⌚" },
  NO: { line: "Maritime craft, fjord-side hospitality, small-scale fisheries.", glyph: "🐟" },
  FI: { line: "Design, software, and forestry-adjacent small business.", glyph: "🌲" },
  DK: { line: "Design, cycling, food craft, and small services.", glyph: "🚲" },
  GB: { line: "Boutique services, indie retail, hospitality, creative agencies.", glyph: "🛍️" },
  JP: { line: "Family-run restaurants, ateliers, and precision craft trades.", glyph: "🍣" },
  BR: { line: "Restaurants, craft beverages, fashion, agriculture.", glyph: "🍺" },
  IN: { line: "IT services, custom software, retail, family workshops.", glyph: "⚙️" },
  SG: { line: "Boutique hospitality, food, services, and IT firms.", glyph: "🍜" },
  AR: { line: "Restaurants, agriculture, leather goods, small retail.", glyph: "🥩" },
  AL: { line: "Cafés, hospitality on the Adriatic coast, small-batch agriculture, family-run construction.", glyph: "☕" },
  AD: { line: "Mountain hospitality, retail, financial services, ski tourism.", glyph: "🏔️" },
  AZ: { line: "Caspian energy services, hospitality in Baku, agriculture, retail.", glyph: "🌊" },
  GE: { line: "Tbilisi hospitality, wine, IT services, family-run trades.", glyph: "🍷" },
  IL: { line: "Software, security, biotech, boutique hospitality.", glyph: "🚀" },
  KZ: { line: "Oil services, agriculture, retail, Almaty professional services.", glyph: "🛢️" },
  LI: { line: "Precision manufacturing, financial services, niche family firms.", glyph: "🏔️" },
  MC: { line: "Hospitality, luxury retail, financial services.", glyph: "🎰" },
  MX: { line: "Restaurants, small manufacturing, retail, construction, professional services.", glyph: "🌮" },
  RU: { line: "Restaurants, retail, IT services, construction, agriculture across vast geography.", glyph: "🏛️" },
  SM: { line: "Tourism, retail, small-batch manufacturing.", glyph: "🏰" },
  // CC.3 — country-specific glyph + signature for newer additions
  CN: { line: "Restaurants, manufacturing, retail, services across China's massive metros.", glyph: "🐉" },
  KR: { line: "Cafés, design, software, family-run hospitality.", glyph: "🎴" },
  TH: { line: "Restaurants, hospitality, craft trades, cottage manufacturing.", glyph: "🍜" },
  VN: { line: "Cafés, restaurants, light manufacturing, fast-growing services.", glyph: "🍜" },
  ID: { line: "Restaurants, retail, craft trades, hospitality across the archipelago.", glyph: "🏝️" },
  PH: { line: "Restaurants, hospitality, business services, retail.", glyph: "🍱" },
  MY: { line: "Restaurants, hospitality, small manufacturing, professional services.", glyph: "🍜" },
  PK: { line: "Textiles, retail, restaurants, family-run manufacturing.", glyph: "🧵" },
  BD: { line: "Textiles, restaurants, retail, small manufacturing.", glyph: "🧵" },
  EG: { line: "Restaurants, hospitality, retail, family-run trades.", glyph: "🏺" },
  NG: { line: "Restaurants, retail, hospitality, small manufacturing in Lagos and beyond.", glyph: "🌍" },
  ZA: { line: "Restaurants, hospitality, retail, professional services.", glyph: "🦓" },
  KE: { line: "Restaurants, hospitality, retail, agribusiness.", glyph: "🦁" },
  AE: { line: "Hospitality, retail, professional services, luxury food.", glyph: "🐪" },
  SA: { line: "Hospitality, retail, restaurants, family-run trades.", glyph: "🕌" },
  TR: { line: "Restaurants, retail, hospitality, family-run small manufacturing.", glyph: "🥙" },
  CL: { line: "Restaurants, vineyards, retail, hospitality.", glyph: "🍷" },
  CO: { line: "Cafés, restaurants, retail, hospitality.", glyph: "☕" },
  PE: { line: "Restaurants, hospitality, retail, craft trades.", glyph: "🦙" },
  NZ: { line: "Cafés, hospitality, small farms, design studios.", glyph: "🥝" },
};

export async function generateStaticParams(): Promise<Params[]> {
  return COUNTRIES.map((c) => ({ country: c.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  const c = COUNTRIES.find((c) => c.code === iso2);
  if (!c) return { title: "Country not found | Margin Atlas" };
  return {
    title: `${c.name} — small-business benchmarks | Margin Atlas`,
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
  const sig = COUNTRY_SIGNATURE[iso2] || {
    line: "Small-business benchmarks across this country.",
    glyph: "🏬",
  };
  const qual = QUALITY_LABEL[meta.quality] || QUALITY_LABEL.C;
  // Plan v13 Wave 1 — countries with only city-level data (e.g. Argentina)
  // must not advertise a sub-regional view. The flag is plumbed here so
  // any future Regions tab/section can be wrapped with `{showRegions ? ... : null}`.
  // Today the country page surfaces only cities + cell-page entrypoints,
  // neither of which depend on region-level coverage.
  const showRegions = hasRegionalCoverage(iso2);
  void showRegions;

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

      {/* Hero */}
      <header className="py-8 lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:items-center">
        <div>
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
            Country
          </div>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold tracking-tight text-ink-900 flex items-center gap-3 flex-wrap">
            <CountryFlag iso2={iso2} className="w-12 md:w-16" />
            <span>{meta.name}</span>
          </h1>
          <p className="mt-4 text-lg text-ink-800/80 max-w-2xl leading-relaxed">
            {sig.line}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${qual.tone}`}
            >
              {qual.label}
            </span>
            <span className="text-xs text-cocoa-700/70">Coverage tier {meta.quality}</span>
            <a
              href={`/coverage/${iso2.toLowerCase()}`}
              className="ml-1 text-xs text-atlas-700 hover:text-atlas-900 font-medium"
            >
              See coverage scorecard →
            </a>
          </div>
        </div>
        <div className="hidden lg:block mt-6 lg:mt-0">
          {/* Plan v12 IM9 — real country hero photo when manifest has one. */}
          <AtlasHeroImage
            image={pickCountryHeroImage(iso2)}
            alt={`${meta.name} — country atlas hero`}
            glyph={sig.glyph}
            aspectRatio={1.5}
          />
        </div>
      </header>

      {/* Top cities — Track N (Wave 2) */}
      <CountryCityShortcuts iso2={iso2} />

      {/* Tax + headline stats — Track FF.2 */}
      <CountryStatsStrip iso2={iso2} />

      {/* Quality scorecard summary — Track FF.2 */}
      <CountryQualitySummary iso2={iso2} />

      {/* Top industries */}
      {topIndustries.length > 0 ? (
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
            Top small-business industries in {meta.name}
          </h2>
          <p className="mt-1 text-sm text-ink-700/70">
            Most-covered SMB categories. Click any tile for the full cell page —
            distribution, time series, neighbors.
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
                    <span>{sector?.name || "Industry"}</span>
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
        </section>
      ) : (
        <section className="py-10">
          <div className="card">
            <p className="text-sm text-ink-800">
              No SMB-relevant industries listed yet for {meta.name}. Try the{" "}
              <a href="/" className="text-atlas-700 underline">home navigator</a> or{" "}
              <a href="/compare" className="text-atlas-700 underline">Compare</a> to pick cells side-by-side.
            </p>
          </div>
        </section>
      )}

      {/* Compare CTA */}
      <section className="py-10">
        <div className="card-cream">
          <h2 className="text-lg font-semibold text-ink-900">
            Compare {meta.name} to other countries
          </h2>
          <p className="mt-1 text-sm text-ink-800">
            Pick any industry and put {meta.name} side-by-side with up to three other countries.
          </p>
          <a
            href="/compare"
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-atlas-600 hover:bg-atlas-700 text-white text-sm font-medium transition"
          >
            Open Compare →
          </a>
        </div>
      </section>
    </div>
  );
}
