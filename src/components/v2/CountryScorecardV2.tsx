// Country scorecard that tells a story: a flag + Newsreader name carry the page, a
// tier chip and one editorial paragraph frame what Atlas can and cannot answer here,
// and two parallel columns of deep-link rows let the visitor drop straight into depth.

import * as React from "react";

import { colors } from "@/lib/design-tokens";

type Tier = "deep" | "good" | "starter" | "modeled";

interface CountryScorecardV2Props {
  iso2: string;
  name: string;
  tier: Tier;
  cellCount: number;
  industriesCovered: number;
  citiesCovered: number;
  yearRange: [number, number];
  sampleIndustries: Array<{ name: string; cellCount: number; href: string }>;
  sampleCities: Array<{ name: string; href: string }>;
}

const TIER_META: Record<Tier, { label: string; dot: string }> = {
  deep:    { label: "Deep coverage",    dot: colors.tier.deep },
  good:    { label: "Good coverage",    dot: colors.tier.good },
  starter: { label: "Starter coverage", dot: colors.tier.starter },
  modeled: { label: "Modeled",          dot: colors.tier.modeled },
};

function iso2ToFlag(iso: string): string {
  if (!iso || iso.length !== 2) return "";
  const A = 0x1f1e6;
  const u = iso.toUpperCase();
  return String.fromCodePoint(
    A + u.charCodeAt(0) - 65,
    A + u.charCodeAt(1) - 65
  );
}

function makeBlurb(
  name: string,
  tier: Tier,
  industriesCovered: number,
  citiesCovered: number,
  yearRange: [number, number]
): string {
  const span = `${yearRange[0]}\u2013${yearRange[1]}`;
  switch (tier) {
    case "deep":
      return `Atlas has primary measurement for ${name} across ${citiesCovered} cities and ${industriesCovered} industries over ${span}. The window holds enough depth to compare neighborhoods inside a city, not only countries to each other.`;
    case "good":
      return `${name} carries full regional benchmarks across ${citiesCovered} cities and ${industriesCovered} industries from ${span}. Sub-city resolution outside the largest metros is still light.`;
    case "starter":
      return `${name} has country-level numbers for ${industriesCovered} industries between ${span}. Treat the figures as orientation; city-level depth is still ahead of us.`;
    case "modeled":
      return `Numbers for ${name} are extrapolated from peer-country measurement over ${span}. Useful for ballparking; not for committee.`;
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-sans text-[10px] uppercase tracking-wide text-cocoa-700">
        {label}
      </div>
      <div className="mt-1 font-sans tabular-nums font-semibold text-2xl leading-tight text-ink-900">
        {value}
      </div>
    </div>
  );
}

export default function CountryScorecardV2({
  iso2,
  name,
  tier,
  industriesCovered,
  citiesCovered,
  yearRange,
  sampleIndustries,
  sampleCities,
}: CountryScorecardV2Props) {
  const flag = iso2ToFlag(iso2);
  const tm = TIER_META[tier];
  const blurb = makeBlurb(name, tier, industriesCovered, citiesCovered, yearRange);

  return (
    /* No ground of its own, so the site frame reads through. Same change as
       CoverageHubV2: bg-white made sense when the page ground was the warm
       cream body, and since AtlasFrame it paints flat white over the
       photograph, leaving the picture in the gutters and a blank slab where the
       page is. The cards inside keep their white. */
    <section>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-3xl leading-none">
              {flag}
            </span>
            <h1
              className="font-display text-4xl font-medium text-ink-900 leading-tight"
              style={{ fontFamily: "Newsreader, serif" }}
            >
              {name}
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 border border-paper-350 rounded-full px-3 py-1.5 bg-white">
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: tm.dot }}
            />
            <span className="font-sans text-[11px] uppercase tracking-wide text-cocoa-700 font-medium">
              {tm.label}
            </span>
          </div>
        </div>

        {/* Editorial blurb */}
        <p className="mt-4 font-sans text-base text-cocoa-700 max-w-[62ch] leading-relaxed">
          {blurb}
        </p>

        {/* 3-stat row */}
        <div className="mt-8 grid grid-cols-3 gap-x-6 border-t border-paper-350 pt-5">
          {/* useless-tile-ok: dead v2 component, not mounted anywhere; pending deletion */}
          <Stat label="Industries covered" value={industriesCovered.toLocaleString()} />
          {/* useless-tile-ok: dead v2 component, not mounted anywhere; pending deletion */}
          <Stat label="Cities covered" value={citiesCovered.toLocaleString()} />
          <Stat
            label="Year range"
            value={`${yearRange[0]}\u2013${yearRange[1]}`}
          />
        </div>

        {/* Two-column deep links */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="font-sans text-xs uppercase tracking-wide text-cocoa-700">
              Top industries
            </div>
            <ul className="mt-3 divide-y divide-paper-350 border-y border-paper-350">
              {sampleIndustries.slice(0, 6).map((ind) => (
                <li key={ind.name}>
                  <a
                    href={ind.href}
                    className="flex items-center justify-between py-2.5 hover:bg-paper-100 -mx-2 px-2 transition-colors duration-150 no-underline"
                  >
                    <span className="font-sans text-sm text-ink-900 truncate pr-2">
                      {ind.name}
                    </span>
                    <span className="font-sans text-xs text-cocoa-700 tabular-nums shrink-0">
                      {ind.cellCount.toLocaleString()}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-sans text-xs uppercase tracking-wide text-cocoa-700">
              Top cities
            </div>
            <ul className="mt-3 divide-y divide-paper-350 border-y border-paper-350">
              {sampleCities.slice(0, 6).map((city) => (
                <li key={city.name}>
                  <a
                    href={city.href}
                    className="flex items-center justify-between py-2.5 hover:bg-paper-100 -mx-2 px-2 transition-colors duration-150 no-underline"
                  >
                    <span className="font-sans text-sm text-ink-900 truncate pr-2">
                      {city.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-sans text-xs text-cocoa-700 shrink-0"
                    >
                      &rarr;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-5 border-t border-paper-350">
          <a
            href="/methodology"
            className="font-sans text-sm text-atlas-700 hover:text-atlas-500 underline underline-offset-4 decoration-paper-350 hover:decoration-atlas-500 transition-colors"
          >
            How Atlas measures and tiers coverage
          </a>
        </div>
      </div>
    </section>
  );
}
