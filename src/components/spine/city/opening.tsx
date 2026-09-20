/**
 * The two cards his "more sections" added to the city page on the late
 * evening of 2026-09-20, from what the city shard holds (MODEL.md 8.3 `17
 * gates` and `18 market`; MODEL PART 9 clause 63): the city's own permits,
 * gate by gate, and who is already trading here. They share one level in
 * chapter one, `17 | 18` at 1-1, the table LEFT and the bars RIGHT (the
 * level's visual), measured on London at three widths (the numbers in the
 * commit and the row brackets).
 *
 * `17 gates` (GatesCard): the tiers table's figures shape (the trade page's
 * team card, one form for named rows with two figures): each gate over its
 * wait and its fee, the required gates first, a gate the city does not
 * require saying so under its name with a dash in each column. The card's
 * one figure at 30 in INK is the fee total, labelled; the wait total is the
 * board's row. Quiet: turn one's accent is the bento's.
 *
 * `18 market` (MarketCard): his B1 bars (RankedBars, a set ceiling, no pill:
 * the densest trade is the ceiling and the figure says it) with each row's
 * trade tile, `data-look="icons"`, the difference clause 55 asks of the
 * page's two ranked-bars cards; the market in figures behind his plus at the
 * card's end. Quiet.
 *
 * Both draw where the shard holds their rows (London: five gates, six
 * trades); the view seats the band on both, a survivor alone at two thirds.
 */
import * as React from "react";
import { Box, Rail, Fig } from "@/components/spine/kit";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { usd } from "@/components/spine/kit";
import type { CityGatesData } from "@/lib/spine/city_gates_rows";
import type { CityMarketData } from "@/lib/spine/city_market_rows";
import { COPY } from "@/lib/spine/copy";

export function GatesCard({ id = "gates", gates }: { id?: string; gates: CityGatesData | null }) {
  if (!gates) return null;
  const C = COPY.cityGates;
  return (
    <Box id={id} data-text-form="table" className="flex h-full flex-col">
      <Rail icon="licence-specific" kicker={C.kicker} sample={gates.sample} />
      {gates.totalCost != null ? (
        <div className="mb-3">
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{C.focalLabel}</div>
          <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{usd(gates.totalCost)}</Fig>
        </div>
      ) : null}
      <div className="flex-1">
        <TiersTable heads={gates.heads} figures={gates.rows} />
      </div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{gates.basis}</p>
      {gates.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{gates.foot}</p> : null}
    </Box>
  );
}

const perTenThousand = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export function MarketCard({ id = "market", market }: { id?: string; market: CityMarketData | null }) {
  if (!market) return null;
  const C = COPY.cityMarket;
  return (
    <RankedBars
      id={id}
      kicker={C.kicker}
      icon="competition"
      tagged={market.sample}
      basis={`${market.focal ? C.basisWithFocal : market.basis}${market.foot ? ` ${market.foot}` : ""}`}
      focal={market.focal ? { figure: market.focal.figure } : undefined}
      rows={market.rows}
      worldMax={market.worldMax}
      ceiling="set"
      feature="none"
      topLabel={C.densest}
      fmt={perTenThousand}
      phoneHead={{ name: C.phoneHead.trade, value: C.phoneHead.value }}
      detail={market.detail ? <DetailPanel name={`${id}-figures`} summary={market.detail.summary} rows={market.detail.rows.map((r) => ({ label: r.label, value: r.value }))} /> : undefined}
    />
  );
}
