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
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { PermitsData } from "@/lib/spine/permits_rows";
import type { OpenData } from "@/lib/spine/open_rows";

export function PermitsCard({ id = "permits", permits }: { id?: string; permits: PermitsData | null }) {
  if (!permits) return null;
  return (
    <Box id={id}>
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="licence-specific" kicker={COPY.tradePermits.kicker} sample />
      <KvGrid cells={permits.cells} labelReserve="row" />
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
