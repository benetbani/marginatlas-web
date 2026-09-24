/**
 * src/lib/spine/margin_rows.ts
 *
 * THE NET-MARGIN CARD'S ROWS, from either source that can carry a margin:
 * the adapter's live trade rows (each with `net_margin` from netMarginForCell)
 * or the harness's local snapshot (data/archetypes/net_margin_snapshot.json,
 * the same engine run over every country, refreshed by a script). One
 * credibility rule for both, so the site and the stories cannot disagree:
 *
 *   A margin is CREDIBLE when it is above the display floor (3%) and the
 *   engine did not clamp it. A loss, a floor or a clamp is WITHHELD with the
 *   reason on the card, never drawn (the 2026-09-04 finding: floors times
 *   revenue had been printed as keeps).
 *
 * The top rule is the world's highest credible margin among the everyday
 * trades (founder ruling 13: the track's edge is the world's highest value),
 * read from the snapshot's per-trade maxima.
 */
import snapshotJson from "../../../data/archetypes/net_margin_snapshot.json";
import { COPY } from "@/lib/spine/copy";
import { industryToSlug, tradeRowName } from "@/lib/taxonomy";
import type { DoorKind } from "@/lib/spine/door_kinds";

export const MARGIN_FLOOR = 0.03;

type SnapRow = { name: string; margin: number; revenue: number; flagged: boolean; clamped: boolean };
type Snapshot = { taken: string; world_max: Record<string, { margin: number; iso2: string }>; countries: Record<string, Record<string, SnapRow>> };
const SNAP = snapshotJson as unknown as Snapshot;

/** `lands`: what a row that navigates promises (door_kinds.ts), carried from the adapter's row with its href (plan step 39, 2026-09-19); the snapshot's rows carry neither. */
export type MarginRow = { key: string; name: string; href?: string; lands?: DoorKind; margin: number; flagged: boolean };
export type MarginCard = {
  rows: MarginRow[];
  withheld: number;
  /** The world's highest credible margin among the everyday trades, as a fraction. */
  worldMax: number;
  withheldLine: string | null;
};

export function isMarginCredible(margin: number | null | undefined, clamped = false): boolean {
  return typeof margin === "number" && Number.isFinite(margin) && margin > MARGIN_FLOOR && !clamped;
}

/** The world maximum across the everyday trades, from the snapshot. */
export function worldMaxMargin(): number {
  const vals = Object.values(SNAP.world_max ?? {}).map((v) => v.margin).filter((m) => Number.isFinite(m));
  return vals.length ? Math.max(...vals) : 0.25;
}

function withheldLine(n: number): string | null {
  if (n <= 0) return null;
  return n === 1 ? COPY.margin.withheldOne : COPY.margin.withheldMany.replace("{n}", String(n));
}

/** Rows from live trade rows that carry `net_margin` (the adapter's money block). */
export function marginCardFromRows(rows: Array<{ slug?: string; name?: string; href?: string; lands?: DoorKind; net_margin?: number | null; net_margin_clamped?: boolean; net_margin_flagged?: boolean }>): MarginCard {
  const credible: MarginRow[] = [];
  let withheld = 0;
  for (const r of rows) {
    /* The bar's label is the trade's row name, three words at most (the goal's A11; taxonomy.ts `tradeRowName`); the page's sentences keep the full name. */
    if (isMarginCredible(r.net_margin, !!r.net_margin_clamped)) credible.push({ key: r.slug ?? String(r.name), name: tradeRowName(r.slug, String(r.name ?? r.slug)), href: r.href, lands: r.lands, margin: r.net_margin as number, flagged: !!r.net_margin_flagged });
    else withheld++;
  }
  credible.sort((a, b) => a.margin - b.margin);
  return { rows: credible, withheld, worldMax: worldMaxMargin(), withheldLine: withheldLine(withheld) };
}

/** Rows for one country from the harness snapshot (local, no network). */
export function marginCardFromSnapshot(iso2: string): MarginCard | null {
  const c = SNAP.countries?.[iso2.toUpperCase()];
  if (!c) return null;
  const rows = Object.entries(c).map(([industryId, r]) => ({ slug: industryToSlug(industryId), name: r.name, href: undefined, net_margin: r.margin, net_margin_clamped: r.clamped, net_margin_flagged: r.flagged }));
  return marginCardFromRows(rows);
}

export function snapshotCountries(): string[] {
  return Object.keys(SNAP.countries ?? {});
}
export const SNAPSHOT_TAKEN = SNAP.taken;
