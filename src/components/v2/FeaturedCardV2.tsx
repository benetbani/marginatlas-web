// Design intent: a benchmark tile that reads top to bottom as industry, where, how much,
// with the headline being the Newsreader industry name (not the revenue figure). Sector,
// flag, and geo collapse into one quiet meta row so the eye lands on the serif first, the
// tabular revenue second, and the coverage tier last as a small trust signal.

import * as React from "react";
import type { Icon } from "@phosphor-icons/react";

import { colors } from "@/lib/design-tokens";

type CoverageTier = "measured" | "regional" | "estimated";

interface FeaturedCardV2Props {
  sector: string;
  sectorIcon: Icon;
  flagEmoji: string;
  geo: string;
  industry: string;
  typicalRevenue: number;
  coverageTier: CoverageTier;
  href: string;
}

// Sanity-§8: apologetic "Estimated" label removed. We keep the
// small colored dot as a quiet trust signal (and tooltip via title).
const COVERAGE: Record<
  CoverageTier,
  { dot: string; title: string }
> = {
  /* useless-tile-ok: tooltip text describing the coverage dot, not a count tile */
  measured: { dot: colors.tier.deep, title: "Measured from primary data" },
  regional: { dot: colors.tier.good, title: "Regional benchmark applied here" },
  estimated: { dot: colors.tier.starter, title: "Derived from country and industry averages" },
};

function formatRevenue(n: number): { prefix: string; value: string; suffix: string } {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    const str = v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "");
    return { prefix: "$", value: str, suffix: "M" };
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    const str = v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "");
    return { prefix: "$", value: str, suffix: "K" };
  }
  return { prefix: "$", value: String(n), suffix: "" };
}

export default function FeaturedCardV2({
  sector,
  sectorIcon: SectorIcon,
  flagEmoji,
  geo,
  industry,
  typicalRevenue,
  coverageTier,
  href,
}: FeaturedCardV2Props) {
  const rev = formatRevenue(typicalRevenue);
  const cov = COVERAGE[coverageTier];

  return (
    <a
      href={href}
      className="
        group
        flex flex-col
        w-[280px] h-[180px]
        bg-white hover:bg-cream-100
        border border-parchment hover:border-ink-700
        px-4 py-3
        transition-[background-color,border-color,box-shadow,transform] duration-150
        hover:shadow-[0_1px_0_0_rgba(0,0,0,0.08)]
        hover:-translate-y-px
        no-underline
      "
    >
      {/* Row 1: sector + flag + geo, one tight line */}
      <div className="flex items-center gap-1.5 min-w-0">
        <SectorIcon size={14} weight="fill" color={colors.atlas[500]} />
        <span className="font-sans text-xs uppercase tracking-wide text-ink-700 whitespace-nowrap">
          {sector}
        </span>
        <span className="text-ink-700">&middot;</span>
        <span className="text-sm leading-none" aria-hidden="true">
          {flagEmoji}
        </span>
        <span className="font-sans text-xs uppercase tracking-wide text-ink-700 truncate">
          {geo}
        </span>
      </div>

      {/* Row 2: industry headline, display serif, up to 2 lines */}
      <h3
        className="
          mt-2
          font-display text-lg font-medium leading-snug
          text-ink-900
          line-clamp-2
        "
      >
        {industry}
      </h3>

      {/* Row 3: hairline */}
      <div className="mt-auto h-px w-full bg-parchment" />

      {/* Row 4: typical revenue label + figure */}
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span
            className="
              font-sans text-[10px] uppercase tracking-wide
              text-ink-700 group-hover:text-atlas-600
              transition-colors duration-150
            "
          >
            Typical revenue
          </span>
          <span className="font-sans tabular-nums text-ink-900 leading-none mt-1">
            <span className="text-xl font-semibold align-baseline">{rev.prefix}</span>
            <span className="text-3xl font-semibold align-baseline">{rev.value}</span>
            {rev.suffix && (
              <span className="text-xl font-semibold align-baseline">{rev.suffix}</span>
            )}
          </span>
        </div>

        {/* Row 5: quiet coverage dot (Sanity-§8). No apologetic label. */}
        <div className="flex items-center pb-[2px] shrink-0" title={cov.title}>
          <span
            aria-label={cov.title}
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: cov.dot }}
          />
        </div>
      </div>
    </a>
  );
}
