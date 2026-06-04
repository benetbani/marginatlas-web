/**
 * MobileCellHero
 * ==============
 *
 * Mobile-first hero for the cell page. Companion to DenseCellHero, which
 * stays optimized for >= 1024px. This component owns 320px to 1024px.
 *
 * Layout differences from desktop:
 *   - Stacks vertically, never side-by-side.
 *   - Hero number lives at the visual center, not in a 7-col block.
 *   - Percentile range renders as three small chips BELOW the number.
 *   - Coverage chip moved below the H1 instead of the top-right corner
 *     so it stays in the thumb zone.
 *   - Sector tag drops the country-flag emoji to keep the row to one line.
 *   - A sticky bottom CTA bar appears once the user scrolls past the hero.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { HowWeKnowThis } from "@/components/HowWeKnowThis";

export type MobileCellHeroProps = {
  sectorId: string;
  sectorLabel: string;
  geoName: string;
  countryName: string;
  question: string;
  industrySubniches: string;
  typicalRevenue: number;
  p10Revenue: number;
  p90Revenue: number;
  coverageTier: "measured" | "regional" | "estimated" | "modeled";
  /** Where the sticky "Pick a different country" button points. */
  pickCountryHref?: string;
  /** Where the sticky "See all industries" button points. */
  browseIndustriesHref?: string;
};

// Sanity-§8: apologetic Estimated / Modeled pill labels removed.
// Only the methodology anchor remains so the inline link can deep-link.
const COVERAGE_ANCHOR: Record<MobileCellHeroProps["coverageTier"], string> = {
  measured: "measured",
  regional: "regional",
  estimated: "estimated",
  modeled: "modeled",
};

function splitRevenue(n: number): { sign: string; num: string; suffix: "" | "K" | "M" } {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    const num = v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.round(v).toString();
    return { sign: "$", num, suffix: "M" };
  }
  if (n >= 1_000) return { sign: "$", num: Math.round(n / 1_000).toString(), suffix: "K" };
  return { sign: "$", num: Math.round(n).toString(), suffix: "" };
}
function shortMoney(n: number): string {
  const r = splitRevenue(n);
  return `${r.sign}${r.num}${r.suffix}`;
}

export default function MobileCellHero({
  sectorLabel,
  geoName,
  question,
  industrySubniches,
  typicalRevenue,
  p10Revenue,
  p90Revenue,
  coverageTier,
  pickCountryHref = "/",
  browseIndustriesHref = "/industries",
}: MobileCellHeroProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      setStickyVisible(el.getBoundingClientRect().bottom < 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const covAnchor = COVERAGE_ANCHOR[coverageTier];
  const rev = splitRevenue(typicalRevenue);

  return (
    <>
      <section ref={ref} aria-labelledby="cell-hero-h1" className="bg-cream-50 px-5 pt-6 pb-7 sm:hidden">
        {/* Sector tag, geo flag intentionally omitted on mobile */}
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-atlas-700">
          <ForkKnife size={13} weight="regular" aria-hidden="true" />
          <span>{sectorLabel}</span>
          <span aria-hidden="true" className="text-parchment">·</span>
          <span>{geoName.toUpperCase()}</span>
        </div>

        {/* H1 */}
        <h1
          id="cell-hero-h1"
          className="font-display mt-3 text-2xl font-semibold tracking-tight text-balance text-ink-900 leading-[1.15] line-clamp-2"
        >
          {question}
        </h1>

        {/* Sanity-§8 — apologetic coverage chip replaced with a quiet
            methodology link under the H1. */}
        <div className="mt-3">
          <HowWeKnowThis anchor={covAnchor} />
        </div>

        {/* Subniches */}
        <p className="mt-3 text-sm italic text-cocoa-700/85">
          Includes: {industrySubniches}
        </p>

        {/* Hero number */}
        <div className="mt-7 flex flex-col items-center text-center">
          <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-cocoa-700/65">
            Typical annual revenue
          </p>
          <div
            className="mt-1 flex items-baseline gap-1"
            aria-label={`Typical annual revenue: ${shortMoney(typicalRevenue)} a year`}
          >
            <span className="font-display tabular-nums font-semibold leading-none text-3xl text-ink-900 tracking-[-0.02em]">
              {rev.sign}
            </span>
            <span className="font-display tabular-nums font-bold leading-none text-6xl text-ink-900 tracking-[-0.035em]">
              {rev.num}
            </span>
            {rev.suffix && (
              <span className="font-display tabular-nums font-semibold leading-none text-3xl text-ink-900 tracking-[-0.02em]">
                {rev.suffix}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm italic text-cocoa-700">a year</p>

          {/* Percentile chips below the number */}
          <div className="mt-5 grid grid-cols-3 gap-2 w-full">
            <PercChip kind="bottom"  label="Bottom 10%" value={shortMoney(p10Revenue)} />
            <PercChip kind="typical" label="Typical"    value={shortMoney(typicalRevenue)} />
            <PercChip kind="top"     label="Top 10%"    value={shortMoney(p90Revenue)} />
          </div>
        </div>
      </section>

      {/* Sticky bottom CTA. Position fixed so it stays visible across all
          subsequent sections, not just the hero. */}
      <div
        role="region"
        aria-label="Cell page actions"
        className="fixed bottom-0 inset-x-0 z-30 sm:hidden px-4 py-3 flex gap-2 transition-all duration-200 border-t border-parchment"
        style={{
          background: "rgba(254, 251, 246, 0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transform: stickyVisible ? "translateY(0)" : "translateY(100%)",
          opacity: stickyVisible ? 1 : 0,
          pointerEvents: stickyVisible ? "auto" : "none",
        }}
      >
        <Link
          href={pickCountryHref}
          className="flex-1 rounded-md py-3 text-sm font-semibold text-center bg-ink-900 text-white"
        >
          Pick a different country
        </Link>
        <Link
          href={browseIndustriesHref}
          className="flex-1 rounded-md py-3 text-sm font-semibold text-center text-cocoa-700 border border-cocoa-700/25"
        >
          See all industries
        </Link>
      </div>
    </>
  );
}

function PercChip({
  kind,
  label,
  value,
}: {
  kind: "bottom" | "typical" | "top";
  label: string;
  value: string;
}) {
  const bg =
    kind === "typical" ? "bg-amber-50 border-amber-200" : "bg-cream-100 border-parchment";
  const labelColor =
    kind === "typical" ? "text-atlas-700" : "text-cocoa-700/65";
  return (
    <div className={`rounded-md px-2 py-2 flex flex-col items-center border ${bg}`}>
      <span className={`text-[9px] tracking-[0.14em] uppercase font-semibold ${labelColor}`}>
        {label}
      </span>
      <span className="mt-0.5 text-sm font-semibold tabular-nums text-ink-900">{value}</span>
    </div>
  );
}
