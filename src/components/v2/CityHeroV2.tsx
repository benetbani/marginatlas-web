// City hero with numbers on top: the Newsreader city name anchors the left, four
// tabular-nums stats sit on a hairline below it, and a square editorial photo on the
// right gets a subtle duotone instead of swallowing the whole first frame.

import * as React from "react";
import { HowWeKnowThis } from "@/components/HowWeKnowThis";

import { colors } from "@/lib/design-tokens";

type CoverageTier = "measured" | "regional" | "estimated";

interface CityHeroV2Props {
  cityName: string;
  countryName: string;
  iso2: string;
  population: string;
  metroGdp: string;
  medianWageUsd: number;
  typicalRevenueUsd: number;
  smbDensity: string;
  editorialBlurb: string;
  photoUrl?: string;
  coverageTier: CoverageTier;
}

// Sanity-§8: apologetic "Estimated" label removed. Quiet dot stays
// as a trust signal; the inline link below opens methodology.
const COVERAGE: Record<CoverageTier, { dot: string; anchor: string }> = {
  measured: { dot: colors.tier.deep, anchor: "measured" },
  regional: { dot: colors.tier.good, anchor: "regional" },
  estimated: { dot: colors.tier.starter, anchor: "estimated" },
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

function formatMoney(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return "$" + (v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "")) + "M";
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return "$" + (v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "")) + "K";
  }
  return "$" + n.toLocaleString();
}

function parseDensity(s: string): { head: string; tail: string } {
  const idx = s.toLowerCase().indexOf(" per ");
  if (idx >= 0) return { head: s.slice(0, idx).trim(), tail: s.slice(idx + 1).trim() };
  return { head: s, tail: "" };
}

function StylizedPlaceholder({ cityName }: { cityName: string }) {
  const heights = [0.45, 0.7, 0.55, 0.85, 0.6, 1.0, 0.4, 0.75, 0.5, 0.9, 0.55, 0.7, 0.45];
  return (
    <div className="absolute inset-0 bg-paper-100 overflow-hidden">
      {/* sun accent */}
      <div
        className="absolute rounded-full bg-atlas-500"
        style={{ top: "22%", right: "16%", width: "22%", paddingBottom: "22%", height: 0 }}
      />
      {/* skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-[58%] flex items-end gap-[2px] px-[6%]">
        {heights.map((h, i) => (
          <div key={i} className="flex-1 bg-ink-700" style={{ height: h * 100 + "%" }} />
        ))}
      </div>
      {/* ground */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-ink-900" />
      {/* corner label */}
      <div className="absolute top-3 left-3 font-sans text-[10px] uppercase tracking-wide text-ink-700">
        {cityName}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tail,
}: {
  label: string;
  value: string;
  tail?: string;
}) {
  return (
    <div>
      <div className="font-sans text-[10px] uppercase tracking-wide text-ink-700">{label}</div>
      <div className="mt-1 font-sans tabular-nums font-semibold text-2xl leading-tight text-black">
        {value}
      </div>
      {tail && (
        <div className="mt-0.5 font-sans text-[11px] text-ink-700">{tail}</div>
      )}
    </div>
  );
}

export default function CityHeroV2({
  cityName,
  countryName,
  iso2,
  population,
  metroGdp,
  medianWageUsd,
  typicalRevenueUsd,
  smbDensity,
  editorialBlurb,
  photoUrl,
  coverageTier,
}: CityHeroV2Props) {
  const flag = iso2ToFlag(iso2);
  const cov = COVERAGE[coverageTier];
  const density = parseDensity(smbDensity);

  return (
    /* No ground of its own, so the site frame reads through. Same change as
       CoverageHubV2: bg-white made sense when the page ground was the warm
       cream body, and since AtlasFrame it paints flat white over the
       photograph, leaving the picture in the gutters and a blank slab where the
       page is. The cards inside keep their white. */
    <section>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12 items-start">
          {/* LEFT */}
          <div className="order-2 md:order-1 flex flex-col">
            {/* country line */}
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-sm leading-none">{flag}</span>
              <span className="font-sans text-xs uppercase tracking-wide text-ink-700">
                {countryName}
              </span>
            </div>

            {/* city name */}
            {/* Mobile audit §6 fix (2026-05-26): added text-4xl base for
                <=375px so long city names ("San Francisco", "Buenos Aires")
                don't overflow the column at 320-375px viewports. */}
            <h1
              className="mt-2 font-display text-4xl sm:text-5xl font-medium leading-[1.05] text-black"
              style={{ fontFamily: "Newsreader, serif" }}
            >
              {cityName}
            </h1>

            {/* blurb */}
            <p className="mt-4 font-sans text-base text-ink-700 max-w-[58ch] leading-relaxed">
              {editorialBlurb}
            </p>

            {/* stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 border-t border-parchment pt-5">
              <Stat label="Population" value={population} />
              <Stat label="Metro GDP" value={metroGdp} />
              <Stat label="Median wage" value={formatMoney(medianWageUsd)} />
              <Stat label="SMB density" value={density.head} tail={density.tail} />
            </div>

            {/* typical revenue anchor + coverage chip */}
            <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-[10px] uppercase tracking-wide text-ink-700">
                  Typical SMB revenue
                </span>
                <span className="font-sans tabular-nums font-semibold text-black">
                  {formatMoney(typicalRevenueUsd)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cov.dot }}
                />
                <HowWeKnowThis anchor={cov.anchor} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="order-1 md:order-2">
            <div className="relative w-full aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-2xl border border-parchment bg-paper-100">
              {photoUrl ? (
                <>
                  <img
                    src={photoUrl}
                    alt={`Editorial photo of ${cityName}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "grayscale(1) contrast(1.04) brightness(0.96)" }}
                  />
                  {/* duotone: warm vermillion in shadows */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: colors.atlas[500], opacity: 0.14, mixBlendMode: "multiply" }}
                  />
                  {/* lift highlights */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: colors.paper[100], opacity: 0.08, mixBlendMode: "screen" }}
                  />
                </>
              ) : (
                <StylizedPlaceholder cityName={cityName} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
