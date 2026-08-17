// Coverage hub that absents what we can't yet measure: countries fold into four named
// tiers from deep to modeled, each section has its own one-sentence explainer, and
// chips show flag + name + cell count so the eye scans depth before geography.

import * as React from "react";

import { colors } from "@/lib/design-tokens";

type Tier = "deep" | "good" | "starter" | "modeled";

interface Country {
  iso2: string;
  name: string;
  tier: Tier;
  cellCount: number;
  lastRefreshed: string;
}

interface CoverageHubV2Props {
  countries: Country[];
}

const TIER_META: Record<Tier, { title: string; explainer: string; dot: string }> = {
  deep: {
    title: "Deep coverage",
    explainer:
      "Primary measurement with neighborhood-level depth. Cross-sectional comparison inside a city is supported.",
    dot: colors.tier.deep,
  },
  good: {
    title: "Good coverage",
    explainer:
      "Full regional benchmarks across the main metros. Sub-city resolution outside the largest cities is still light.",
    dot: colors.tier.good,
  },
  starter: {
    title: "Starter coverage",
    explainer:
      "Country-level numbers only, no city-level depth yet. Treat as orientation while we build out.",
    dot: colors.tier.starter,
  },
  modeled: {
    title: "Modeled",
    explainer:
      "Extrapolated from peer-country measurement. Useful for ballparking, not for committee.",
    dot: colors.tier.modeled,
  },
};

const TIER_ORDER: Tier[] = ["deep", "good", "starter", "modeled"];

function iso2ToFlag(iso: string): string {
  if (!iso || iso.length !== 2) return "";
  const A = 0x1f1e6;
  const u = iso.toUpperCase();
  return String.fromCodePoint(
    A + u.charCodeAt(0) - 65,
    A + u.charCodeAt(1) - 65
  );
}

function CountryChip({ country }: { country: Country }) {
  return (
    <a
      href={`/coverage/${country.iso2.toLowerCase()}`}
      className="
        group inline-flex items-center gap-2
        bg-white hover:bg-paper-100
        border border-paper-350 hover:border-ink-700
        px-3 py-1.5
        rounded-full
        transition-colors duration-150
        no-underline
      "
    >
      <span aria-hidden="true" className="text-sm leading-none">
        {iso2ToFlag(country.iso2)}
      </span>
      <span className="font-sans text-sm text-ink-900">{country.name}</span>
      <span className="font-sans text-xs text-cocoa-700 tabular-nums">
        {country.cellCount.toLocaleString()}
      </span>
    </a>
  );
}

export default function CoverageHubV2({ countries }: CoverageHubV2Props) {
  const nonZero = countries.filter((c) => c.cellCount > 0);
  const grouped: Record<Tier, Country[]> = {
    deep: [],
    good: [],
    starter: [],
    modeled: [],
  };
  for (const c of nonZero) grouped[c.tier].push(c);
  for (const t of TIER_ORDER) {
    grouped[t].sort((a, b) => b.cellCount - a.cellCount);
  }

  const totalCountries = nonZero.length;
  const totalCells = nonZero.reduce((s, c) => s + c.cellCount, 0);

  return (
    /* NO GROUND OF ITS OWN, so the site frame reads through.
       This was `bg-white`, which made sense when the page ground was the warm
       cream body and a section wanted to be crisper than it. Since AtlasFrame
       there is a photograph behind every page, muted to .82 across the content
       column, and an opaque section paints flat white straight over it: the
       reader gets the picture in the gutters and a blank slab where the page
       is, which is the seam the founder objected to on the home page.

       Dropping it leaves the frame's own ground, which is what the spine page
       types have always sat on. The cards below keep their white, so the
       "white cards floating over the atmosphere" reading is intact; it is only
       the slab between them that goes.

       EXEMPLAR. Six other surfaces do the same thing: CityHeroV2,
       CountryScorecardV2, /pricing, /download/2026-benchmarks,
       /industries/[industry] and /decide/[activity]/[city]. They are left alone
       deliberately, because changing seven page types' ground at once while the
       founder cannot see them is a redesign, not a fix. This one is the sample
       to judge from. */
    <section>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="mb-10">
          <div className="font-sans text-xs uppercase tracking-wide text-cocoa-700">
            Global coverage
          </div>
          <h1
            className="mt-2 font-display text-4xl font-medium text-ink-900 leading-tight"
            style={{ fontFamily: "Newsreader, serif" }}
          >
            Where Atlas reaches today
          </h1>
          <p className="mt-3 font-sans text-base text-cocoa-700 max-w-[60ch] leading-relaxed">
            {totalCountries} countries, {totalCells.toLocaleString()} industry-city cells.
            Below: every country grouped by how deep the numbers go. Countries we cannot
            speak to yet are absent on purpose.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {TIER_ORDER.map((t) => {
            const items = grouped[t];
            if (items.length === 0) return null;
            const meta = TIER_META[t];
            return (
              <div key={t}>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: meta.dot }}
                  />
                  <h2
                    className="font-display text-xl font-medium text-ink-900"
                    style={{ fontFamily: "Newsreader, serif" }}
                  >
                    {meta.title}
                  </h2>
                  <span className="ml-1 font-sans text-xs tabular-nums text-cocoa-700">
                    {items.length}
                  </span>
                </div>
                <p className="mt-1 font-sans text-sm text-cocoa-700 max-w-[64ch]">
                  {meta.explainer}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((c) => (
                    <CountryChip key={c.iso2} country={c} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
