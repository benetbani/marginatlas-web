/**
 * DenseCellHero
 * =============
 *
 * Above-the-fold hero for Margin Atlas cell pages.
 * URL pattern: /{country}/{geo}/{industry}.
 *
 * Server component. Static, no client JS. All formatting happens at render.
 *
 * Density principles:
 *   - One screenful of real information on first paint (typical revenue,
 *     percentile band, headcount, wage, margin, score, coverage tier).
 *   - Display serif lives only on H1 and the hero number. Every other number
 *     is sans + tabular-nums for skimmability.
 *   - Stays under 55vh on 1440x900 desktop and under 100vh on 390x844 mobile.
 *
 * No em-dashes anywhere.
 */

import {
  ForkKnife, Bed, Storefront, Briefcase, Hammer, Wrench, Sparkle,
  FirstAid, Code,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";
import { HowWeKnowThis } from "./HowWeKnowThis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type CoverageTier = "measured" | "regional" | "estimated" | "modeled";

export type DenseCellHeroProps = {
  industryName: string;          // "Restaurants"
  industrySubniches: string;     // "cafés · bistros · fast food · fine dining"
  sectorId: string;              // "food_drink"
  sectorLabel: string;           // "FOOD & DRINK"
  iso2: string;                  // "ES"
  countryName: string;           // "Spain"
  geoName: string;               // "Madrid"
  question: string;              // "How much does a restaurant make in Madrid?"
  typicalRevenue: number;        // 387000
  p10Revenue: number;            // 97000
  p90Revenue: number;            // 1320000
  employees: number;             // 4
  medianWage: number;            // 32000
  netMargin: number;             // 0.12
  atlasScore: number;            // 77
  coverageTier: CoverageTier;
};

// ---------------------------------------------------------------------------
// Sector icon registry. Extend with the remaining 25 sectors as they ship.
// ---------------------------------------------------------------------------
const SECTOR_ICONS: Record<string, PhIcon> = {
  food_drink: ForkKnife,
  hospitality: Bed,
  retail_shops: Storefront,
  professional_services: Briefcase,
  construction: Hammer,
  trades_home: Wrench,
  beauty_wellness: Sparkle,
  health_clinics: FirstAid,
  software_tech: Code,
};

// ---------------------------------------------------------------------------
// Coverage anchor metadata. Sanity-§8 removed the user-visible
// "Estimated" / "Modeled" pill labels; we keep the anchor so the
// inline HowWeKnowThis link can deep-link to the right section.
// ---------------------------------------------------------------------------
const COVERAGE_ANCHOR: Record<CoverageTier, string> = {
  measured: "measured",
  regional: "regional",
  estimated: "estimated",
  modeled: "modeled",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function splitRevenue(n: number): { sign: string; num: string; suffix: "" | "K" | "M" } {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    const decimals = v < 10 ? 2 : v < 100 ? 1 : 0;
    return { sign: "$", num: v.toFixed(decimals), suffix: "M" };
  }
  if (n >= 1_000) {
    return { sign: "$", num: Math.round(n / 1_000).toString(), suffix: "K" };
  }
  return { sign: "$", num: Math.round(n).toString(), suffix: "" };
}

function fmtRevenue(n: number): string {
  const r = splitRevenue(n);
  return `${r.sign}${r.num}${r.suffix}`;
}

function fmtPct(n: number): string {
  if (Math.abs(n) < 0.01) return `${(n * 100).toFixed(1)}%`;
  return `${Math.round(n * 100)}%`;
}

function flagEmoji(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "";
  const A = 0x1F1E6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(
    A + iso2.toUpperCase().charCodeAt(0) - a,
    A + iso2.toUpperCase().charCodeAt(1) - a
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DenseCellHero(props: DenseCellHeroProps) {
  const {
    industrySubniches, sectorId, sectorLabel,
    iso2, countryName, geoName, question,
    typicalRevenue, p10Revenue, p90Revenue,
    employees, medianWage, netMargin, atlasScore,
    coverageTier,
  } = props;

  const SectorIcon = SECTOR_ICONS[sectorId] ?? Briefcase;
  const covAnchor = COVERAGE_ANCHOR[coverageTier];

  // Log-positioned typical marker on the percentile band.
  const typicalPos = (() => {
    const lo = Math.log(p10Revenue);
    const hi = Math.log(p90Revenue);
    const n = (Math.log(typicalRevenue) - lo) / (hi - lo);
    return Math.max(0.08, Math.min(0.92, n));
  })();

  const rev = splitRevenue(typicalRevenue);

  return (
    <section
      aria-labelledby="cell-hero-h1"
      className="w-full bg-cream-50 text-ink-900"
    >
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-10 sm:pt-10 sm:pb-12">
        {/* Row 1: sector tag + coverage chip */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs uppercase tracking-wide sm:tracking-[0.14em] font-semibold text-atlas-700">
            <SectorIcon size={16} weight="regular" className="hidden sm:inline" />
            <SectorIcon size={14} weight="regular" className="sm:hidden" />
            <span>{sectorLabel}</span>
            <span aria-hidden="true" className="text-parchment">·</span>
            <span aria-hidden="true">{flagEmoji(iso2)}</span>
            <span>{geoName.toUpperCase()}</span>
            <span aria-hidden="true" className="text-parchment">·</span>
            <span>{countryName.toUpperCase()}</span>
          </div>
          <HowWeKnowThis anchor={covAnchor} />

        </div>

        {/* Row 2: H1 */}
        <h1
          id="cell-hero-h1"
          className="font-display mt-5 sm:mt-6 text-3xl sm:text-5xl leading-[1.05] tracking-tight font-medium text-balance text-ink-900 max-w-2xl sm:max-w-3xl line-clamp-2 sm:line-clamp-none"
        >
          {question}
        </h1>

        {/* Row 3: subniches */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-base italic text-cocoa-700/80 max-w-2xl sm:max-w-3xl">
          Includes: {industrySubniches}
        </p>

        {/* Row 4: hero number + percentile band */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 sm:items-end">
          {/* Left: hero number */}
          <div className="sm:col-span-7 flex flex-col items-center sm:items-start">
            <p className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold text-cocoa-700/70 mb-1.5 sm:mb-2">
              Typical annual revenue
            </p>
            <div
              className="flex items-baseline gap-1 sm:gap-2"
              aria-label={`Typical annual revenue: ${fmtRevenue(typicalRevenue)} a year`}
            >
              {/* Plan v31 hotfix - shrunk from text-7xl giant to text-5xl
                  per founder critique: "the gigantic numbers should be
                  removed from all pages." Still the visual anchor, just
                  not screen-dominating. */}
              <span className="font-display font-medium tabular-nums leading-none text-2xl sm:text-3xl text-ink-900">
                {rev.sign}
              </span>
              <span className="font-display font-medium tabular-nums leading-none text-4xl sm:text-5xl text-ink-900 tracking-tight">
                {rev.num}
              </span>
              {rev.suffix && (
                <span className="font-display font-medium tabular-nums leading-none text-2xl sm:text-3xl text-ink-900">
                  {rev.suffix}
                </span>
              )}
              <span className="font-display italic font-normal leading-none text-sm sm:text-lg text-cocoa-700 ml-1 sm:ml-2 whitespace-nowrap">
                a year
              </span>
            </div>
          </div>

          {/* Right: percentile band */}
          <div className="sm:col-span-5 sm:pb-1.5">
            <div
              aria-label={`Revenue range: bottom 10% ${fmtRevenue(p10Revenue)}, typical ${fmtRevenue(typicalRevenue)}, top 10% ${fmtRevenue(p90Revenue)}`}
            >
              <div className="relative h-[38px]">
                <div className="absolute left-0 top-0 text-left">
                  <div className="text-[10px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/70">Bottom 10%</div>
                  <div className="text-sm sm:text-base font-semibold tabular-nums text-ink-900">{fmtRevenue(p10Revenue)}</div>
                </div>
                <div
                  className="absolute top-0 text-center"
                  style={{ left: `${typicalPos * 100}%`, transform: "translateX(-50%)" }}
                >
                  <div className="text-[10px] tracking-[0.16em] uppercase font-semibold text-atlas-700">Typical</div>
                  <div className="text-sm sm:text-base font-semibold tabular-nums text-ink-900">{fmtRevenue(typicalRevenue)}</div>
                </div>
                <div className="absolute right-0 top-0 text-right">
                  <div className="text-[10px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/70">Top 10%</div>
                  <div className="text-sm sm:text-base font-semibold tabular-nums text-ink-900">{fmtRevenue(p90Revenue)}</div>
                </div>
              </div>

              <div className="relative mt-2.5 rounded-full border border-parchment bg-parchment h-6 sm:h-6">
                <div
                  className="absolute inset-y-0 rounded-full"
                  style={{
                    left: "8%",
                    right: "8%",
                    background:
                      "linear-gradient(to right, #EFE0BD 0%, rgba(212, 119, 6, 0.8) 50%, #EFE0BD 100%)",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute"
                  style={{
                    left: `${typicalPos * 100}%`,
                    top: -4,
                    bottom: -4,
                    width: 3,
                    background: "#A55C00",
                    transform: "translateX(-50%)",
                    borderRadius: 2,
                    boxShadow: "0 0 0 2px #FFFFFF",
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 sm:mt-8 h-px bg-parchment opacity-70" aria-hidden="true" />

        {/* Row 5: stats */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-medium text-cocoa-700">
          <span aria-label={`${employees} employees`}>
            <span className="tabular-nums font-semibold text-ink-900">{employees}</span>
            <span className="ml-1">employees</span>
          </span>
          <span aria-hidden="true" className="text-parchment">·</span>
          <span aria-label={`${fmtRevenue(medianWage)} median wage`}>
            <span className="tabular-nums font-semibold text-ink-900">{fmtRevenue(medianWage)}</span>
            <span className="ml-1">median wage</span>
          </span>
          <span aria-hidden="true" className="text-parchment">·</span>
          <span aria-label={`${fmtPct(netMargin)} profit kept`}>
            <span className="tabular-nums font-semibold text-ink-900">{fmtPct(netMargin)}</span>
            <span className="ml-1">profit kept</span>
          </span>
          <span aria-hidden="true" className="text-parchment">·</span>
          <span aria-label={`Atlas Score ${atlasScore} out of 100`}>
            <span className="tabular-nums font-semibold text-ink-900">{atlasScore}/100</span>
            <span className="ml-1">Atlas Score</span>
          </span>
        </div>
      </div>
    </section>
  );
}
