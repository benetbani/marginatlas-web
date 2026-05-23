/**
 * CountryComparisonPage
 * =====================
 *
 * Page-level component for /compare/countries/[pair] (URL pattern:
 * us-vs-germany). Two countries on a shared editorial canvas: split hero
 * with flags, stat band at a glance, 10-industry divergent bar chart,
 * one editorial paragraph passed in by the route, and a cross-link block.
 */

import {
  SplitHero, StatBand, DivergentBars, EditorialBlock, CrossLinkRibbon,
  flagEmoji, shortMoney, pctDelta,
  type DivergentRow, type CrossLinkItem,
} from "./_primitives";

export type CountryProfile = {
  iso2: string;
  name: string;
  population: string;          // pre-formatted, e.g. "335M"
  gdpPerCapitaShort: string;   // pre-formatted, e.g. "$76K"
  medianWage: number;
  topIndustry: string;
  commercialRent: number;      // /m² in USD
  easeScore: number;           // 0..100
  smbPer1k: number;            // SMBs per 1k working-age
};

export type CountryComparisonPageProps = {
  countryA: CountryProfile;
  countryB: CountryProfile;
  /** 10 industry rows: median annual revenue per firm, side by side. */
  industryRows: DivergentRow[];
  /** "What this means" editorial paragraph. Pass pre-written copy. */
  editorial: string;
  /** Cross-link suggestions for the bottom ribbon. */
  peers: CrossLinkItem[];
};

export default function CountryComparisonPage({
  countryA,
  countryB,
  industryRows,
  editorial,
  peers,
}: CountryComparisonPageProps) {
  return (
    <article>
      <SplitHero
        kind="Country"
        title={`${countryA.name} vs ${countryB.name}: small-business shape, side by side.`}
        left={{
          eyebrow: "Country",
          name: countryA.name,
          subtitle: `${countryA.population} people · ${countryA.gdpPerCapitaShort} GDP per capita`,
          flagOrIcon: (
            <span aria-hidden="true" className="text-4xl leading-none">
              {flagEmoji(countryA.iso2)}
            </span>
          ),
        }}
        right={{
          eyebrow: "Country",
          name: countryB.name,
          subtitle: `${countryB.population} people · ${countryB.gdpPerCapitaShort} GDP per capita`,
          flagOrIcon: (
            <span aria-hidden="true" className="text-4xl leading-none">
              {flagEmoji(countryB.iso2)}
            </span>
          ),
        }}
      />

      <StatBand
        stats={[
          {
            label: "Median wage",
            valueLeft: shortMoney(countryA.medianWage),
            valueRight: shortMoney(countryB.medianWage),
            leftWins: countryA.medianWage > countryB.medianWage,
            deltaText: `${pctDelta(countryA.medianWage, countryB.medianWage)} higher`,
          },
          {
            label: "Top industry",
            valueLeft: countryA.topIndustry,
            valueRight: countryB.topIndustry,
            sameish: countryA.topIndustry === countryB.topIndustry,
            deltaText:
              countryA.topIndustry === countryB.topIndustry
                ? "Same leader"
                : "Different leader",
            leftWins: null,
          },
          {
            label: "Avg commercial rent",
            valueLeft: `${shortMoney(countryA.commercialRent)}/m²`,
            valueRight: `${shortMoney(countryB.commercialRent)}/m²`,
            leftWins: countryA.commercialRent > countryB.commercialRent,
            deltaText: `${pctDelta(countryA.commercialRent, countryB.commercialRent)} more`,
            note: "Median across measured cities",
          },
          {
            label: "Ease of business",
            valueLeft: `${countryA.easeScore}/100`,
            valueRight: `${countryB.easeScore}/100`,
            leftWins: countryA.easeScore > countryB.easeScore,
            deltaText: `${Math.abs(countryA.easeScore - countryB.easeScore)} pts ahead`,
          },
          {
            label: "SMB density",
            valueLeft: `${countryA.smbPer1k}/1k`,
            valueRight: `${countryB.smbPer1k}/1k`,
            leftWins: countryA.smbPer1k > countryB.smbPer1k,
            deltaText: `${pctDelta(countryA.smbPer1k, countryB.smbPer1k)} more density`,
            note: "Firms with under 50 employees",
          },
        ]}
      />

      <DivergentBars
        title={`Typical small-business revenue, ten industries`}
        lede="Median annual revenue per firm, side by side. The longer bar marks the country where operators in that industry are bringing in more."
        leftLabel={`${countryA.name} revenue`}
        rightLabel={`${countryB.name} revenue`}
        rows={industryRows}
      />

      <EditorialBlock title="What this means" body={editorial} />

      <CrossLinkRibbon
        title={`Other countries to compare with ${countryA.name}`}
        items={peers}
      />
    </article>
  );
}
