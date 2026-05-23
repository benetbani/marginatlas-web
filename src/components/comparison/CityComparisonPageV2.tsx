/**
 * CityComparisonPageV2
 * ====================
 *
 * Polished rewrite of the existing /compare/cities/[pair] route. Brings the
 * page to Smart Waterfall quality without abandoning the city-specific
 * affordances: photo-backed split hero, vs-anchored stat band with delta
 * chips, 10-sector divergent bars, and a "sister cities" ribbon at the foot.
 */

import {
  SplitHero, StatBand, DivergentBars,
  shortMoney, pctDelta,
  type DivergentRow,
} from "./_primitives";

export type CityProfile = {
  name: string;
  countryName: string;
  iso2: string;
  population: string;       // pre-formatted, e.g. "8.4M"
  medianWage: number;
  rent: number;             // monthly residential 2BR
  gdpPerCapita: number;
  smbRevenue: number;
  /**
   * Background image. Pass either a hosted image URL or a CSS gradient.
   * In production, Atlas uses Unsplash IDs pre-resolved to URLs here.
   */
  photoUrl?: string;
  /** Fallback CSS gradient if photo is not available. */
  photoGradient?: string;
};

export type SisterPair = {
  kind: string;             // "Same hemisphere", etc.
  left: string;             // "Chicago"
  right: string;            // "Manchester"
  subtitle?: string;
  href: string;
};

export type CityComparisonPageV2Props = {
  cityA: CityProfile;
  cityB: CityProfile;
  /** 10-sector divergent rows. */
  sectorRows: DivergentRow[];
  sisterCities: SisterPair[];
};

export default function CityComparisonPageV2({
  cityA,
  cityB,
  sectorRows,
  sisterCities,
}: CityComparisonPageV2Props) {
  const aPhoto = cityA.photoUrl
    ? `url(${JSON.stringify(cityA.photoUrl)}) center/cover no-repeat`
    : cityA.photoGradient ?? "linear-gradient(135deg, #952509 0%, #000000 100%)";
  const bPhoto = cityB.photoUrl
    ? `url(${JSON.stringify(cityB.photoUrl)}) center/cover no-repeat`
    : cityB.photoGradient ?? "linear-gradient(135deg, #3A3A3A 0%, #000000 100%)";

  return (
    <article>
      <SplitHero
        variant="photo"
        kind="City"
        title={`${cityA.name} vs ${cityB.name}.`}
        left={{
          eyebrow: cityA.countryName,
          name: cityA.name,
          subtitle: `${cityA.population} people · ${cityA.iso2}`,
          photo: aPhoto,
        }}
        right={{
          eyebrow: cityB.countryName,
          name: cityB.name,
          subtitle: `${cityB.population} people · ${cityB.iso2}`,
          photo: bPhoto,
        }}
      />

      <StatBand
        stats={[
          {
            label: "Median wage",
            valueLeft: shortMoney(cityA.medianWage),
            valueRight: shortMoney(cityB.medianWage),
            leftWins: cityA.medianWage > cityB.medianWage,
            deltaText: `${pctDelta(cityA.medianWage, cityB.medianWage)} higher`,
          },
          {
            label: "Median rent",
            valueLeft: `${shortMoney(cityA.rent)}/mo`,
            valueRight: `${shortMoney(cityB.rent)}/mo`,
            leftWins: cityA.rent > cityB.rent,
            deltaText: `${pctDelta(cityA.rent, cityB.rent)} more`,
            note: "Two-bedroom, city core",
          },
          {
            label: "GDP per capita",
            valueLeft: shortMoney(cityA.gdpPerCapita),
            valueRight: shortMoney(cityB.gdpPerCapita),
            leftWins: cityA.gdpPerCapita > cityB.gdpPerCapita,
            deltaText: `${pctDelta(cityA.gdpPerCapita, cityB.gdpPerCapita)} higher`,
          },
          {
            label: "Typical SMB revenue",
            valueLeft: shortMoney(cityA.smbRevenue),
            valueRight: shortMoney(cityB.smbRevenue),
            leftWins: cityA.smbRevenue > cityB.smbRevenue,
            deltaText: `${pctDelta(cityA.smbRevenue, cityB.smbRevenue)} more`,
          },
        ]}
      />

      <DivergentBars
        title="Industry mix differential, ten sectors"
        lede="Median annual revenue per firm. Where one city's bar runs longer, operators in that sector earn more there."
        leftLabel={`${cityA.name} revenue`}
        rightLabel={`${cityB.name} revenue`}
        rows={sectorRows}
      />

      <section className="bg-cream-100 border-t border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            Sister cities
          </p>
          <h2 className="font-display mt-2 text-xl sm:text-2xl leading-[1.18] tracking-[-0.015em] font-semibold text-ink-900">
            Three pairs with similar economic gravity.
          </h2>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sisterCities.map((p) => (
              <li key={`${p.left}-${p.right}`}>
                <a
                  href={p.href}
                  className="block rounded-lg p-4 bg-cream-50 border border-parchment text-ink-900 transition-shadow hover:bg-white hover:shadow-[0_1px_2px_rgba(26,26,26,0.04),_0_6px_16px_rgba(26,26,26,0.05)]"
                >
                  <p className="text-[10px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/70">
                    {p.kind}
                  </p>
                  <div className="mt-2 grid grid-cols-12 items-center gap-2">
                    <span className="col-span-5 font-display text-lg font-semibold">{p.left}</span>
                    <span className="col-span-2 text-center text-[10px] tracking-[0.16em] uppercase font-semibold text-atlas-700">
                      VS
                    </span>
                    <span className="col-span-5 text-right font-display text-lg font-semibold">{p.right}</span>
                  </div>
                  {p.subtitle && <p className="mt-1.5 text-xs text-cocoa-700">{p.subtitle}</p>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
