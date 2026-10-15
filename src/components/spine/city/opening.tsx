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
 * `18 market` (MarketCard): his B1 bars, no pill (the largest trade is the
 * ceiling and the figure says it), drawn since Task 5's fix round 1 as the
 * kit's slim BarList, the country page's form for a list of trades, so it
 * stands unlike the page's one ranked-bars card, the districts' rents
 * (clause 55; the trade tiles that told the two apart are gone); the market
 * in figures behind his plus at the card's end. Quiet.
 *
 * Both draw where the shard holds their rows (London: five gates, six
 * trades); the view seats the band on both, a survivor alone at two thirds.
 */
import * as React from "react";
import { Basis, Box, Rail, Fig, Focal } from "@/components/spine/kit";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { BarList } from "@/components/spine/charts/BarList";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { usd } from "@/components/spine/kit";
import type { CityGatesData } from "@/lib/spine/city_gates_rows";
import { perTenThousand, type CityMarketData } from "@/lib/spine/city_market_rows";
import { COPY } from "@/lib/spine/copy";

export function GatesCard({ id = "gates", gates }: { id?: string; gates: CityGatesData | null }) {
  if (!gates) return null;
  const C = COPY.cityGates;
  return (
    <Box id={id} data-text-form="table" className="flex h-full flex-col">
      <Rail icon="licence-specific" kicker={C.kicker} sample={gates.sample} />
      {gates.totalCost != null ? (
        <div className="mb-6">
          <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{C.focalLabel}</div>
          <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{usd(gates.totalCost)}</Fig>
        </div>
      ) : null}
      <div className="flex-1">
        <TiersTable heads={gates.heads} figures={gates.rows} />
      </div>
      <Basis>{gates.basis}</Basis>
      {gates.foot ? <p data-line="" className="mt-1 text-[length:var(--t-body)] leading-snug text-[var(--c-muted)]">{gates.foot}</p> : null}
    </Box>
  );
}

/* A count of registered businesses, whole and grouped (the register's form of the card, plan 06, task B3). */
const businesses = (v: number) => Math.round(v).toLocaleString("en-US");

export function MarketCard({ id = "market", market }: { id?: string; market: CityMarketData | null }) {
  if (!market) return null;
  const C = COPY.cityMarket;
  const register = market.form === "register";
  const fmt = register ? businesses : perTenThousand;
  /* THE ONE LINE UNDER THE FOCAL IS THE FIGURE'S OWN (plan 2026-10-12 rhythm-air-inside, Task 2C; DISTANCES 4's positional test): with a focal it is the focal's words, 8 under the
     figure with the bars 24 below; with no focal it is the bars' basis under them. */
  const line = `${market.basis}${market.foot ? ` ${market.foot}` : ""}`;
  /* THE KIT'S BAR LIST, SLIM (plan 2026-10-12 rhythm-air-inside, Task 5, fix round 1; clause 55): the trade tile on each row was what told this
     card from the page's other ranking, the districts' rents (RankedBars' table: a head, hairlines, a track against the dearest). With the
     tiles gone the two drew one form, and the law passed on a stamp. A list of trades draws on the kit's bar list, slim and stacked: each
     trade's name and figure on one line and its 10px bar the full width 8 under them, no head and no hairline, the largest in ink2 and no
     accent (PART 6: a card with no accent figure marks its leader in ink2; still no pill, his B1). An open level stretches nothing, so the
     card's own height meets the gates card's: 428 against 485 at 1280 (LEVEL HEIGHT allows 97). */
  return (
    <Box id={id} className="flex h-full flex-col">
      <Rail icon="competition" kicker={C.kicker} sample={market.sample} />
      {market.focal ? <Focal figure={market.focal.figure} prov={market.focal.prov} words={line} /> : null}
      <BarList items={market.rows.map((r) => ({ key: r.key, label: r.name, value: r.value, display: fmt(r.value), prov: r.prov }))} max={market.worldMax} look="slim" quiet stacked />
      {market.focal ? null : <Basis>{line}</Basis>}
      {market.detail ? <DetailPanel name={`${id}-figures`} summary={market.detail.summary} rows={market.detail.rows.map((r) => ({ label: r.label, value: r.value }))} /> : null}
    </Box>
  );
}
