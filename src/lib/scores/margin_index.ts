/**
 * src/lib/scores/margin_index.ts
 *
 * The Margin Index board: a keep-ranked, fully-free, crawlable leaderboard built
 * from the recommender resolver's rows. The recommender ranks by the composite;
 * the Margin Index ranks by HONEST KEEP (net margin, a share, cross-geo-safe)
 * while every row still carries its composite for the per-row MarginIndexBadge
 * (the ranking dimension and the badge are two different, both-real reads).
 *
 * Pure module: a re-sort + reshape over already-resolved rows. No I/O.
 */

import type { RecommendResult, RecommendRow } from "./recommend";
import type { CompositeScore } from "./composite";

export interface MarginIndexRow {
  id: string;
  /** Stable per-row DOM anchor for deep links (id-derived, "mi-<id>"). */
  anchor: string;
  name: string;
  href: string;
  keepPct: number | null;
  /** False when keepPct is null: the row dashes its keep, never shows 0%. */
  keepKnown: boolean;
  composite: CompositeScore | null;
}

export interface MarginIndexBoard {
  direction: "places-for-trade" | "trades-for-place";
  subject: string;
  rows: MarginIndexRow[];
}

function isNum(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/** Re-rank the recommender's rows by keep for the leaderboard; keep composites for badges. */
export function toMarginIndexBoard(result: RecommendResult): MarginIndexBoard {
  const rows: MarginIndexRow[] = result.rows
    // Omit a row only when it carries NEITHER a keep NOR a composite (nothing to show).
    .filter((r: RecommendRow) => isNum(r.keepPct) || r.composite !== null)
    .map((r: RecommendRow) => ({
      id: r.id,
      anchor: `mi-${r.id}`,
      name: r.name,
      href: r.href,
      keepPct: isNum(r.keepPct) ? r.keepPct : null,
      keepKnown: isNum(r.keepPct),
      composite: r.composite,
    }))
    // Keep descending; a null keep sinks below every real keep.
    .sort((a, b) => (b.keepPct ?? -1) - (a.keepPct ?? -1));

  return { direction: result.direction, subject: result.subject, rows };
}
