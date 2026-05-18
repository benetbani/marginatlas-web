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
import { flagFromIso2 } from "@/lib/countries";
import { SmartImage } from "@/components/SmartImage";
import { CountryCityShortcuts } from "@/components/CountryCityShortcuts";

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

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <span className="inline-flex items-center gap-1">
          <span className="flag" aria-hidden>{flagFromIso2(iso2)}</span>
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
            <span className="flag text-5xl md:text-6xl" aria-hidden>{flagFromIso2(iso2)}</span>
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
          </div>
        </div>
        <div className="hidden lg:block mt-6 lg:mt-0">
          <SmartImage
            alt={`${meta.name} — country atlas hero`}
            glyph={sig.glyph}
            aspectRatio={1.5}
            intent="hero"
            rounded="2xl"
          />
        </div>
      </header>

      {/* Top cities — Track N (Wave 2) */}
      <CountryCityShortcuts iso2={iso2} />

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
