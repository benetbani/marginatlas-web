/**
 * IndustryComparisonPage
 * ======================
 *
 * Page-level component for /compare/industries/[pair] (URL pattern:
 * restaurants-vs-coffee-shops). Split hero with two sector icons, a 4-up
 * stat strip, a 6-city divergent bar chart that shows how the gap varies
 * by city, an editorial paragraph, and a cross-link ribbon.
 */

import {
  SplitHero, DivergentBars, EditorialBlock, CrossLinkRibbon,
  shortMoney, pctText, pctDelta,
  type DivergentRow, type CrossLinkItem,
} from "./_primitives";
import type { Icon as PhIcon } from "@phosphor-icons/react";

export type IndustryProfile = {
  name: string;          // "Restaurants"
  short: string;         // "Restaurants" - used as bar labels
  icon: PhIcon;          // Phosphor icon component
  typicalRevenue: number;
  typicalWage: number;
  netMargin: number;     // 0..1
  employees: number;
};

export type IndustryComparisonPageProps = {
  industryA: IndustryProfile;
  industryB: IndustryProfile;
  /** 6 city rows for the "same two industries in 6 cities" chart. */
  cityRows: DivergentRow[];
  editorial: string;
  peers: CrossLinkItem[];
};

export default function IndustryComparisonPage({
  industryA,
  industryB,
  cityRows,
  editorial,
  peers,
}: IndustryComparisonPageProps) {
  const IconA = industryA.icon;
  const IconB = industryB.icon;
  return (
    <article>
      <SplitHero
        kind="Industry"
        title={`${industryA.name} vs ${industryB.name}.`}
        left={{
          eyebrow: "Industry",
          name: industryA.name,
          subtitle: `Median annual revenue ${shortMoney(industryA.typicalRevenue)} · ${pctText(industryA.netMargin)} margin`,
          flagOrIcon: (
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center rounded-xl border border-parchment bg-cream-50 text-atlas-700"
              style={{ width: 44, height: 44 }}
            >
              <IconA size={22} weight="regular" />
            </span>
          ),
        }}
        right={{
          eyebrow: "Industry",
          name: industryB.name,
          subtitle: `Median annual revenue ${shortMoney(industryB.typicalRevenue)} · ${pctText(industryB.netMargin)} margin`,
          flagOrIcon: (
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center rounded-xl border border-parchment bg-cream-50 text-atlas-700"
              style={{ width: 44, height: 44 }}
            >
              <IconB size={22} weight="regular" />
            </span>
          ),
        }}
      />

      {/* Stat strip: 4-up cards with both industries inside each card */}
      <section className="bg-cream-50 border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            The shape of each industry
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
            <PairStat label="Typical revenue" a={shortMoney(industryA.typicalRevenue)} b={shortMoney(industryB.typicalRevenue)} aWins={industryA.typicalRevenue > industryB.typicalRevenue} aLabel={industryA.short} bLabel={industryB.short} delta={`${pctDelta(industryA.typicalRevenue, industryB.typicalRevenue)} apart`} />
            <PairStat label="Typical wage"    a={shortMoney(industryA.typicalWage)}    b={shortMoney(industryB.typicalWage)}    aWins={industryA.typicalWage > industryB.typicalWage}       aLabel={industryA.short} bLabel={industryB.short} delta={`${pctDelta(industryA.typicalWage, industryB.typicalWage)} apart`} />
            <PairStat label="Typical margin"  a={pctText(industryA.netMargin)}         b={pctText(industryB.netMargin)}         aWins={industryA.netMargin > industryB.netMargin}           aLabel={industryA.short} bLabel={industryB.short} delta={`${Math.abs(Math.round((industryA.netMargin - industryB.netMargin) * 100))} pts apart`} />
            <PairStat label="Typical employees" a={String(industryA.employees)}        b={String(industryB.employees)}          aWins={industryA.employees > industryB.employees}           aLabel={industryA.short} bLabel={industryB.short} delta={`${Math.abs(industryA.employees - industryB.employees)} more people`} />
          </div>
        </div>
      </section>

      <DivergentBars
        title="The same two industries, in six different cities."
        lede="Median annual revenue per firm, in each city. The longer bar marks the industry that earns more there."
        leftLabel={`${industryA.short} revenue`}
        rightLabel={`${industryB.short} revenue`}
        rows={cityRows}
      />

      <EditorialBlock
        title="When restaurants beat coffee shops, and vice versa"
        body={editorial}
      />

      <CrossLinkRibbon
        title={`Other industries to compare with ${industryA.name}`}
        items={peers}
      />
    </article>
  );
}

function PairStat({
  label, a, b, aWins, aLabel, bLabel, delta,
}: {
  label: string; a: string; b: string; aWins: boolean; aLabel: string; bLabel: string; delta?: string;
}) {
  return (
    <div className="rounded-lg p-4 bg-cream-50 border border-parchment">
      <p className="text-[10px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/70">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-1">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-cocoa-700/55">{aLabel}</span>
          <span className={`tabular-nums font-semibold text-base ${aWins ? "text-atlas-700" : "text-ink-900"}`}>{a}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-cocoa-700/55">{bLabel}</span>
          <span className={`tabular-nums font-semibold text-base ${!aWins ? "text-atlas-700" : "text-ink-900"}`}>{b}</span>
        </div>
      </div>
      {delta && (
        <p className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cream-100 text-cocoa-700">
          {delta}
        </p>
      )}
    </div>
  );
}
