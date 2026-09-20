/**
 * The trade page's first band of turn one, `03 permits | 04 open` (MODEL.md
 * 8.6; plan step 33, second dispatch, 2026-09-18). Two cards, each drawn
 * ONCE here and mounted by cell-view.tsx on the page and by the archetype
 * stories on the sheet, so the card a story is judged on is the card the
 * page draws (the renderers-agree rule, plan step 25).
 *
 * `03 permits`, THE SEAT IS HELD BY KvGrid AS CATALOGUED: each licence a
 * label over its typical days, two columns, no group heading, on the
 * archetype's "row" reserve because a licence's name is the shard's and runs
 * to twelve words. The composition's longest wait at 30 in ink is the fact
 * card with a focal, candidate 1 of FORM-CATALOG's CANDIDATES AWAITING HIS
 * CLICK, and a form not in the catalogue is a candidate awaiting his click;
 * so every cell draws at the head rung, nothing at 30, and the FOCAL finding
 * on this card stands until he clicks, exactly as the country's and the
 * city's seats stand (permits_rows.ts puts the longest wait first, the
 * silhouette the focal would take). The census reads this Box as KvGrid.
 *
 * `04 open`, ONE CARD, THREE STATES BY DATA (open_rows.ts decides which):
 * held on RankedBars, vertical bars of the bill's five biggest lines with
 * the total as its focal over them, the biggest line lit (the line to raise
 * first) and the smaller lines stated with their count and sum (the builder
 * says why five); baseline and withheld on BentoMetric with the trade's
 * typical at 30 or the stated line at 16 where it would stand; and in every
 * state the two companions under a hairline at 16, months to break even and
 * years to pay back, one basis line naming them as the trade's where the
 * card prints a figure. The form to the checkers
 * is the body's `data-archetype`: `ranked-bars` held, `bento-metric` in the
 * other two. RankedBars and BentoMetric draw their own Box, so the census
 * does not read this card (the country's entry bill, the same note); it is
 * a block on the page all the same (`data-block="open"`, BLOCK FLOOR counts
 * it). LOUD in the held and baseline states, turn one's accent, the page's
 * second of three; unaccented where withheld, and the page carries two.
 *
 * THE SECOND BAND OF TURN ONE, `05 split | 06 team` (plan step 33's third
 * dispatch, 2026-09-18), drawn here for the same reason:
 *
 * `05 split`, THE NET PROFIT MARGIN on IncomeBreakdown (B6, R7): the cost
 * segments descending from split_rows.ts (the shard's held drivers or the
 * sector profile), the residual named as its own segment, the net pinned
 * last at 30 in ink, THE SAME FIGURE `00 take` prints (the one builder's,
 * carried on the seed); at its foot, closed on arrival, the plus with two
 * rows, fixed and variable costs. QUIET, his 2026-09-08 ruling: accenting
 * the net here would be one number wearing terracotta in two places (R7),
 * and on the 38 ladder-fill shards would sometimes mark a figure the file
 * invented (R11). The withheld state (the lines and the net over a hundred)
 * keeps the net at 30 and states its line where the bar would stand. The
 * page's second bar-family drawing (M10). The census reads this card as
 * IncomeBreakdown.
 *
 * `06 team`, WHAT STAFF COST on TiersTable's figures shape (not
 * CompareTable: with `07 peers` a CompareTable in the next section, two
 * adjacent sections would share a form, 8.4 rule 2): the roles in the name
 * block, two figure columns with one unit each, how many and pay a year,
 * the heads as props, dots, panel and door off, no winner mark because a
 * wage row has no best. Table figures at 14, the form table-family and
 * exempt from the focal rung by its own law. Where the country holds no
 * credible median the pay column prints dashes and the card says so once.
 * The census reads this card as TiersTable.
 *
 * THE TURN'S CLOSE, `07 peers` (plan step 33's fourth dispatch, 2026-09-18),
 * drawn here for the same reason: AGAINST OTHER PLACES on CompareTable
 * (B7), the page's one table and its second full width (R1: the take, the
 * peers, the close), quiet by table law, terracotta never. The home row
 * tinted, one figure column (a typical year's takings, the strip's own
 * figure) in one unit, an en dash for a hole, the rows never navigating
 * (M23). The rows come from trade_peer_rows.ts: the United States' per-state
 * slate where the trade holds one, at most five peers; off the United
 * States the card stands with its real structure, the heads said once and
 * the home row printing its own figure, under the stated line "Not gathered
 * yet: the same trade in other places." (M19, item 57), never an invented
 * peer; off `moneyShown` the home row's takings show a dash and the card
 * says so once. No flags: every row is in one country. CompareTable draws
 * its own Box inside the `data-wide-table` wrapper the full-width and
 * lone-card gates read, so the census does not read this card (the country's
 * peers table, the same note); it is a block on the page all the same
 * (`data-block="peers"`, BLOCK FLOOR counts it). The old Nearby table (a
 * sortable client island with the four invented UK cities) retired with it.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { IncomeBreakdown } from "@/components/spine/archetypes/IncomeBreakdown";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { PermitsData } from "@/lib/spine/permits_rows";
import type { OpenData } from "@/lib/spine/open_rows";
import type { SplitData } from "@/lib/spine/split_rows";
import type { TeamData } from "@/lib/spine/team_rows";
import type { TradePeersData } from "@/lib/spine/trade_peer_rows";

export function PermitsCard({ id = "permits", permits }: { id?: string; permits: PermitsData | null }) {
  if (!permits) return null;
  return (
    /* The spare height the level lends this card (the bill beside it stands
       431 to its 358 at 1280, measured 2026-09-20) splits above and below the
       grid, the basis and the foot on the floor (BentoMetric's rule, the
       ring card's composition), so the foot is never a blank of 73. */
    <Box id={id} className="flex h-full flex-col">
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="licence-specific" kicker={COPY.tradePermits.kicker} sample />
      <div className="flex flex-1 flex-col justify-center">
        <KvGrid cells={permits.cells} labelReserve="row" />
      </div>
      {permits.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{permits.withheld}</p> : null}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{permits.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{permits.foot}</p>
    </Box>
  );
}

export function OpenCard({ id = "open", open }: { id?: string; open: OpenData | null }) {
  if (!open) return null;
  if (open.state === "held") {
    return (
      <RankedBars
        id={id}
        icon="startup-cost"
        kicker={COPY.tradeOpen.kicker}
        tagged={open.sample}
        basis={open.basis ?? ""}
        withheldLine={open.tailLine}
        rows={open.rows}
        worldMax={Math.max(...open.rows.map((r) => r.value))}
        ceiling="set"
        best="max"
        feature="leader"
        topLabel={COPY.tradeOpen.biggest}
        fmt={(v) => usd(v)}
        phoneHead={COPY.tradeOpen.phoneHead}
        focal={open.figure ? { figure: open.figure, accent: open.accent } : undefined}
        foot={{ items: open.foot, line: open.footLine }}
      />
    );
  }
  return (
    <BentoMetric
      id={id}
      icon="startup-cost"
      kicker={COPY.tradeOpen.kicker}
      sample={open.sample}
      accent={open.accent}
      figure={open.figure ?? undefined}
      withheld={open.withheld ?? undefined}
      second={open.foot.length > 0 ? open.foot : { withheld: open.footLine ?? COPY.tradeOpen.footWithheld }}
      basis={open.basis ?? undefined}
      foot={open.foot.length > 0 && open.footLine ? open.footLine : undefined}
    />
  );
}

export function SplitCard({ id = "split", split }: { id?: string; split: SplitData | null }) {
  if (!split) return null;
  return (
    <IncomeBreakdown
      id={id}
      icon="cost-breakdown"
      kicker={COPY.tradeSplit.kicker}
      netLabel={split.netLabel}
      netPct={split.netPct}
      segments={split.segments}
      basis={split.basis}
      withheld={split.withheld}
      foot={split.foot}
      detail={split.detail ? <DetailPanel name={`detail-${id}`} summary={split.detail.summary} rows={split.detail.rows} /> : null}
    />
  );
}

export function TeamCard({ id = "team", team }: { id?: string; team: TeamData | null }) {
  if (!team) return null;
  return (
    <Box id={id}>
      {/* Every figure is modelled (R12): the roles are the shard's and the pay an index times the country's median; the mark is on, behind his switch. */}
      <Rail icon="wages" kicker={COPY.tradeTeam.kicker} sample />
      <TiersTable heads={team.heads} figures={team.rows} />
      {team.noMedian ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{team.noMedian}</p> : null}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{team.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{team.foot}</p>
    </Box>
  );
}

export function PeersCard({ id = "peers", peers }: { id?: string; peers: TradePeersData | null }) {
  if (!peers) return null;
  return (
    <CompareTable
      id={id}
      icon="benchmark"
      kicker={COPY.tradePeers.kicker}
      entityHead={peers.entityHead}
      rows={peers.rows}
      columns={peers.columns}
      withheld={peers.notGathered ?? undefined}
      note={peers.homeWithheld ?? undefined}
      caveat={peers.caveat}
      flags={false}
      sample={peers.confidence !== "measured"}
    />
  );
}
