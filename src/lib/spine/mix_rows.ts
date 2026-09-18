/**
 * src/lib/spine/mix_rows.ts
 *
 * WHERE SALES COME FROM, the trade page's `11 mix` (MODEL.md 8.6; plan step
 * 33, fifth dispatch, 2026-09-18): the named parts of a trade's sales with
 * their shares, two to five parts summing to 100, the leader first. The
 * composition's form is his B9 donut, one per page, the leader wedge in
 * `--c-ink2` and the leader's share the card's 30 in ink; the donut is not in
 * the archetypes folder, so it is CANDIDATE 5 of FORM-CATALOG's CANDIDATES
 * AWAITING HIS CLICK and its mockup is owed to the review sheet. Until his
 * click the SEAT is the nearest catalogued form, a plain KvGrid of the parts
 * with their shares (cell/turn-two.tsx MixCard), every cell at the head
 * rung and no 30, the FOCAL finding on the card standing until he clicks,
 * exactly as the permits' and the survival grid's seats stand. Pure over the
 * shard, synchronous, so the stories, the copy gates and the harness build
 * it without the database.
 *
 * Each figure with its file and field: `channel_mix.channels.*.name` and
 * `channel_mix.channels.*.pct_of_revenue` in data/facts/industry/<id>.json,
 * through src/lib/facts/industry_shard.ts. Counted 2026-09-18 over the 243
 * shards: 243 of 243 hold channels, 53 tagged held on every part; 148 hold
 * four parts, 69 three, 25 five, 1 two (barbershops); every file sums to 100
 * exactly, no part at zero, no name printed twice on one shard. The names
 * are the shard's own and are never shortened: 706 of the 926 run past
 * three words ("Third-party and own delivery"), so the card draws them on
 * KvGrid's "row" reserve, the permits' rule for names the caller may not
 * cut. Every shard figure is modelled on the page (R12, item 61), and the
 * foot says so in words because the sample mark is behind his switch.
 *
 * THE LEADER LEADS THE CELLS, then the rest by share, largest first, a tie
 * keeping the shard's own order (one tie today, pizzerias at 35 / 35 / 30).
 * On an odd count KvGrid's COMPLETE ROWS gives the first cell the card's
 * width, the silhouette the donut's leader wedge and its 30 would take;
 * `leader` names it so the view can raise it the day the click lands.
 *
 * THE PARTS ARE A WHOLE OR THEY ARE NOT DRAWN. A shard whose parts sum
 * outside 95 to 105 of 100 does not hold a whole to divide, so the card
 * stands with its opener and the stated line where the parts would (PART 5:
 * withheld with a line, never filled, never clipped to fit); no shard takes
 * that path today. A part with no name or no share is not a part and is
 * dropped from the sum before it is judged. Null only where the trade holds
 * no shard (a sector-average cell), which draws none of turn two's cards.
 */
import { industryRows } from "@/lib/facts/industry_shard";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import { COPY } from "@/lib/spine/copy";

export const MIX_METRICS = { name: "channel_mix.channels.*.name", share: "channel_mix.channels.*.pct_of_revenue" } as const;

/** The whole, and how far a file's parts may stray from it before the card withholds them. */
export const MIX_WHOLE = 100;
export const MIX_SUM_TOLERANCE = 5;

export type MixPart = { key: string; name: string; share: number };

export type MixData = {
  industryId: string;
  /** The leader first, then the rest by share; empty where the parts are withheld. */
  cells: KvCell[];
  parts: MixPart[];
  /** The candidate's focal, named for the day of his click; null where withheld. */
  leader: MixPart | null;
  /** The parts' sum as read off the file, before rounding. */
  sum: number;
  /** The stated line where the parts would stand, when they do not make a whole; null when they print. */
  withheld: string | null;
  basis: string;
  foot: string;
  confidence: "modeled";
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function buildMix(industryId: string | undefined): MixData | null {
  if (!industryId) return null;
  const names = industryRows(industryId, MIX_METRICS.name);
  if (names.length === 0) return null;
  const shares = new Map(industryRows(industryId, MIX_METRICS.share).map((f) => [f.rowKey, f.value] as const));
  const parts: MixPart[] = [];
  for (const n of names) {
    const name = typeof n.value === "string" ? n.value.trim() : "";
    const share = shares.get(n.rowKey);
    if (!name || !isNum(share) || share <= 0) continue;
    parts.push({ key: n.rowKey, name, share });
  }
  if (parts.length === 0) return null;
  const sum = parts.reduce((a, p) => a + p.share, 0);
  const whole = Math.abs(sum - MIX_WHOLE) <= MIX_SUM_TOLERANCE;
  /* Largest share first, a stable sort, so a tie keeps the file's order. */
  const ordered = [...parts].sort((a, b) => b.share - a.share);
  const cells: KvCell[] = whole ? ordered.map((p) => ({ key: p.key, label: p.name, value: `${Math.round(p.share)}%`, confidence: "modeled" })) : [];
  return {
    industryId,
    cells,
    parts: ordered,
    leader: whole ? ordered[0] : null,
    sum,
    withheld: whole ? null : COPY.tradeMix.withheld,
    basis: COPY.tradeMix.basis,
    foot: COPY.tradeMix.foot,
    confidence: "modeled",
  };
}
