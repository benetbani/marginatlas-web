/**
 * The trade page's two bands of turn two: `08 clears | 09 lasts` (MODEL.md
 * 8.6; plan step 33, fourth dispatch, 2026-09-18) and `10 watch | 11 mix`
 * (the fifth, below). Four cards, each drawn ONCE here and mounted by
 * cell-view.tsx on the page and by the archetype stories on the sheet, so
 * the card a story is judged on is the card the page draws (the
 * renderers-agree rule, plan step 25). The first band's question from two
 * sides: does an ordinary day cover the costs, and do places like this make
 * it past year one, three, five.
 *
 * `08 clears`, WHEN IT CLEARS COSTS: the needed share of a typical day's
 * takings, LOUD, the page's third and last accent (8.6's seat ledger: the
 * take at 40, the total to open at 30, this share at 30), so the loud card
 * changes form each turn (answer card, bars, and here a plain figure). THE
 * SEAT IS HELD BY BentoMetric AS CATALOGUED: the composition's form is the
 * single-share ring (B4's "week activity", the share as a closed sweep in
 * `--terra`), which is not in the archetypes folder, so it is candidate 4 of
 * FORM-CATALOG's CANDIDATES AWAITING HIS CLICK and a form not in the
 * catalogue is a candidate awaiting his click; its one-line mockup, drawn
 * once from BentoMetric's own cell markup with the sweep around the figure,
 * is owed to the review sheet and is NOT drawn on the page. Until his click
 * the share stands at 30 in `--terra-text` on the plain figure, the basis
 * saying what it is and the foot that it is the trade's, modelled. The
 * figure comes from clears_rows.ts: the engine's share where money is shown,
 * else the shard's (243 of 243), and the builder's header says why both are
 * the trade's figure. BentoMetric draws its own Box, so the census does not
 * read this card (the cost to open's note); it is a block on the page all
 * the same (`data-block="clears"`, BLOCK FLOOR counts it). The old
 * `#breakeven` card (the ClearanceRing off the seed's two rounded covers,
 * money-chapter.tsx) retired into this card.
 *
 * `09 lasts`, HOW MANY LAST: survival as a series on KvGrid, three cells,
 * still trading after five, one and three years, off the shard's triple
 * (lasts_rows.ts, 243 of 243), quiet, ink, no slope and no myth sentence
 * (R5). THE SEAT IS HELD BY KvGrid AS CATALOGUED: the composition's year
 * five at 30 in ink is the fact card with a focal, candidate 1 of
 * FORM-CATALOG's CANDIDATES AWAITING HIS CLICK, so every cell draws at the
 * head rung, nothing at 30, and the FOCAL finding on this card stands until
 * he clicks, exactly as the permits' and the country's and the city's seats
 * stand; the builder puts year five first, the silhouette the focal would
 * take (KvGrid's COMPLETE ROWS gives an odd group's first cell the width).
 * The census reads this Box as KvGrid. The old `#myth` card (the London
 * file's triple as a slope with "9 in 10 fail" struck across it, both
 * banned by R5) retired into this card.
 *
 * THE SECOND BAND OF TURN TWO, `10 watch | 11 mix` (plan step 33's fifth
 * dispatch, 2026-09-18), drawn here for the same reason. The band's question
 * from two sides: what actually closes one, and where the money that keeps
 * it open comes from.
 *
 * `10 watch`, WHAT CLOSES ONE: the DRAWN BLOCKED SEAT (BlockedSeat, 8.6's
 * "drawn with its structure and the stated line"), on every trade cell,
 * because his B1 bars (causes of closure with their shares) wait on
 * DATA-REQUIREMENTS item 53 and 0 of 243 trades hold one. The opener, one
 * stated line in the site's idiom, no figure, no sample, the foot naming
 * the item; it counts toward the block floor and is exempt from the focal
 * rung by its law (PART 4). The old `#risks` card (interactive.tsx, the
 * London file's four titles authored for every storefront trade and scored
 * 8 / 6 / 3 by hand from two pressure words, never a held cause with a
 * share for one trade) retired into this seat and is not printed: never the
 * four London titles, never churn dressed as a cause (8.6). The census
 * reads no Box here: BlockedSeat draws its own.
 *
 * `11 mix`, WHERE SALES COME FROM: the named parts of the trade's sales with
 * their shares on KvGrid, the leader first (mix_rows.ts, 243 of 243). THE
 * SEAT IS HELD BY KvGrid AS CATALOGUED: the composition's form is his B9
 * donut (one per page, the leader wedge `--c-ink2`, the leader's share the
 * card's 30 in ink), which is not in the archetypes folder, so it is
 * CANDIDATE 5 of FORM-CATALOG's CANDIDATES AWAITING HIS CLICK and its
 * mockup is owed to the review sheet; a form not in the catalogue is a
 * candidate awaiting his click. Until then every cell draws at the head
 * rung, nothing at 30, and the FOCAL finding on this card stands, exactly
 * as the permits' and the survival grid's seats stand. The labels are the
 * shard's own channel names on the "row" reserve (five to nine words, never
 * shortened). Where the parts do not make a whole the card stands with the
 * stated line where they would (no shard today). The census reads this Box
 * as KvGrid. The old Demand rail (`#week`, the dayparts donut off the dev
 * seed alone, cut by 8.6's inventory and item 68; `#catchment`, the channel
 * ShareStack with its accented leader and the catchment index list, item
 * 49) retired into this card; neither ever drew on the live route.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { COPY } from "@/lib/spine/copy";
import type { ClearsData } from "@/lib/spine/clears_rows";
import type { LastsData } from "@/lib/spine/lasts_rows";
import type { MixData } from "@/lib/spine/mix_rows";

export function ClearsCard({ id = "clears", clears }: { id?: string; clears: ClearsData | null }) {
  if (!clears) return null;
  return (
    <BentoMetric
      id={id}
      icon="break-even"
      kicker={COPY.tradeClears.kicker}
      sample={clears.sample}
      accent={clears.accent}
      figure={clears.figure}
      basis={clears.basis}
      foot={clears.foot}
    />
  );
}

export function LastsCard({ id = "lasts", lasts }: { id?: string; lasts: LastsData | null }) {
  if (!lasts) return null;
  return (
    <Box id={id}>
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="first-year" kicker={COPY.tradeLasts.kicker} sample />
      <KvGrid cells={lasts.cells} />
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{lasts.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{lasts.foot}</p>
    </Box>
  );
}

/** The seat holds no data, so it takes no builder: its three strings are the copy table's and the same on every trade. */
export function WatchSeat({ id = "watch" }: { id?: string }) {
  return <BlockedSeat id={id} icon="watch" kicker={COPY.blocked.watch.kicker} line={COPY.blocked.watch.line} foot={COPY.blocked.watch.foot} />;
}

export function MixCard({ id = "mix", mix }: { id?: string; mix: MixData | null }) {
  if (!mix) return null;
  return (
    <Box id={id}>
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="payments" kicker={COPY.tradeMix.kicker} sample />
      {mix.withheld ? (
        <p data-withheld-line="mix" className="text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{mix.withheld}</p>
      ) : (
        <KvGrid cells={mix.cells} labelReserve="row" />
      )}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{mix.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{mix.foot}</p>
    </Box>
  );
}
