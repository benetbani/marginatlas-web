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
 * the trade's figure. The card is a Box holding the Ring since 2026-09-20
 * (it stood on BentoMetric before), and the census reads it; it is a block on
 * the page (`data-block="clears"`, BLOCK FLOOR counts it). The old
 * `#breakeven` card (the ClearanceRing off the seed's two rounded covers,
 * money-chapter.tsx) retired into this card.
 *
 * `09 lasts`, HOW MANY LAST: still trading after five, one and three years,
 * off the shard's triple (lasts_rows.ts, 243 of 243), quiet, ink, no slope
 * and no myth sentence (R5). ON THE WORKED FIGURE SINCE 2026-09-24 (the
 * goal's B1; FORM-CATALOG VERSION 6 names this card among the three that
 * move onto it): year five at 30 in ink, the composition's own answer, and
 * years one and three under the hairline at 16, a catalogued archetype and
 * not candidate 1, so no click is owed. The industry page's `01 lasts` is
 * this card at the world altitude and moves with it. Until that day the
 * seat was a KvGrid at the head rung with nothing at 30, the FOCAL finding
 * on both pages. The old `#myth` card (the London
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
import { WorkedFigure } from "@/components/spine/archetypes/WorkedFigure";
import { Donut } from "@/components/spine/archetypes/Donut";
import { Ring } from "@/components/spine/archetypes/Ring";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { COPY } from "@/lib/spine/copy";
import type { ClearsData } from "@/lib/spine/clears_rows";
import type { LastsData } from "@/lib/spine/lasts_rows";
import type { MixData } from "@/lib/spine/mix_rows";

export function ClearsCard({ id = "clears", clears }: { id?: string; clears: ClearsData | null }) {
  /* THE RING (his B4, the gold standard's B31; Ring.tsx, 2026-09-20): the
     share of a typical day that clears the costs as a sweep around a ring,
     the figure inside it in the accent (the page's third loud moment, 8.6),
     the basis as the caption under the ring, the foot under that. The metric
     card that held candidate 4's seat leaves; his gold standard shows the
     ring with its figure and asks for it to be replicated, which is the
     click the catalogue waited on. */
  if (!clears) return null;
  return (
    /* THE EMPTINESS IS DISTRIBUTED, NOT GATHERED (BentoMetric's own rule, the
       worth card's composition): the level stretches this card to its
       tallest neighbour (ruling 7), 34 over its content at 1280 and 49 at a
       tablet's halves (measured 2026-09-20), and piled at the foot the 49
       is the blank he names (clause 52's 48). The ring's row takes the
       spare height and centres in it, so the air splits above and below. */
    <Box id={id} className="flex h-full flex-col [container-type:inline-size]">
      <Rail icon="break-even" kicker={COPY.tradeClears.kicker} sample={clears.sample} />
      {/* THE RING BESIDE ITS WORDS from 280px of container, above them under it
          (the archetype harness's LONE STAT on the centred ring, 149 by 186 of
          air each side at 478; the gold standard's ring stands beside its
          row of cards, never alone in a field). 280 and not the donut's 440:
          the words wrap where the donut's part names cannot, so at a third of
          the column (336 at 1280 less the card's 40 of padding, 296 of
          container, the `08 | 09 | 14` level) the ring keeps its words beside
          it, 120 wide, and the card stands near the survival cells' height;
          stacked, it stood 333 and the level broke (a first cut at 300 missed
          the third by four pixels). The container query is written out in
          full, the kit's rule. */}
      <div className="grid flex-1 grid-cols-1 items-center gap-4 [@container(min-width:280px)]:grid-cols-[auto_minmax(0,1fr)]">
        <Ring value={clears.value} figure={clears.figure} accent={clears.accent} />
        <div>
          {clears.basis ? <p className="max-w-[28ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{clears.basis}</p> : null}
          {clears.foot ? <p className="mt-2 max-w-[28ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{clears.foot}</p> : null}
        </div>
      </div>
    </Box>
  );
}

export function LastsCard({ id = "lasts", lasts }: { id?: string; lasts: LastsData | null }) {
  if (!lasts) return null;
  const W = COPY.tradeLasts;
  return (
    /* The level lends this card its partner's height (the ring beside it on
       the trade page, the benchmark on the industry page): the figure takes
       the slack above and below it, the basis and the foot on the floor, so
       the foot is never a blank (the permits card's composition). */
    <Box id={id} className="flex h-full flex-col">
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="first-year" kicker={W.kicker} sample />
      <div className="flex flex-1 flex-col justify-center">
        <WorkedFigure
          label={W.cells.yr5}
          figure={`${lasts.values.yr5}%`}
          working={[
            { figure: `${lasts.values.yr1}%`, words: W.working.yr1 },
            { figure: `${lasts.values.yr3}%`, words: W.working.yr3 },
          ]}
        />
      </div>
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
        /* THE DONUT (his B9, the gold standard's B28; Donut.tsx, 2026-09-20): the
           parts as a ring, the leader's share in its centre as the card's
           figure, each part's share in a pill beside its name. The plain fact
           grid that held candidate 5's seat leaves: his gold standard of
           2026-09-20 shows the split donut beside its figure and asks for it
           to be replicated, which is the click the catalogue waited on. */
        <Donut parts={mix.parts} />
      )}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{mix.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{mix.foot}</p>
    </Box>
  );
}
