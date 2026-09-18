/**
 * src/lib/spine/trade_peer_rows.ts
 *
 * AGAINST OTHER PLACES, the trade page's `07 peers` (MODEL.md 8.6; plan step
 * 33, fourth dispatch, 2026-09-18): the rows of the page's one table, on
 * CompareTable (B7). The home place first, tinted by the archetype, then the
 * same trade in other places, one figure column, a typical year's takings,
 * every cell an absolute in the column's one unit, an en dash for a hole
 * (PART 5). The rows never navigate, on this page or on any other (M23):
 * the way to another place is the close's industry door. Pure over the seed,
 * synchronous, so the stories, the copy gates and the harness build it
 * without the database.
 *
 * WHERE THE ROWS COME FROM, each figure with its file and field:
 *  - the home row: `meta.city` and `meta.iso2`, its figure
 *    `headline.rev_p50_usd`, the same figure the strip's typical mark and
 *    the masthead's takings companion print (M20), shown where
 *    `meta.money_shown` and withheld with a stated line otherwise;
 *  - the peers: `nearby.places`, which adapt_cell.ts fills from the United
 *    States' per-state slate (`getSameIndustryAcrossStates`, one row per
 *    state, biggest by firm count first, the home state excluded there),
 *    each with `rev_p50_usd` off cells_master's `revenue_per_firm`, real.
 *    Counted 2026-09-18 with California as the home state: 57 of 243 trades
 *    resolve peer states (47 of them the slate's nine), 113 trades carry no
 *    NAICS-3 group and 73 groups hold no rows; restaurants resolve seven.
 *    At most five peers are printed, so the table is six rows at most.
 *
 * NEVER AN INVENTED PEER. adapt_cell.ts passes `suppressInventedPeers: true`
 * to cell_view.ts and fills `nearby` from the slate alone, so London's four
 * synthesised UK cities (the London figure times four constants, "Invented
 * for the exemplar") never reach this builder; a seed carrying a place with
 * no name or a figure that is not a number prints a dash for the figure and
 * nothing for a nameless row. Off the United States no peer resolves
 * (DATA-REQUIREMENTS item 57), and the card is PRESENT with its real
 * structure: the heads said once, the home row printing its own real figure,
 * under the stated line "Not gathered yet: the same trade in other places."
 * (M19). Off `moneyShown` the home row's figure is withheld and its dash is
 * explained once, in the team card's idiom for a dashed column.
 *
 * NO WINNER OFF TWO FIGURES. The archetype marks a column's best value only
 * where two or more rows hold one, so the one-row table off the United
 * States carries no tick and no weight; the home row's only mark is its
 * tint and its semibold name (PART 5's home row).
 */
import { COPY } from "@/lib/spine/copy";
import type { CompareColumn, CompareRow } from "@/components/spine/archetypes/CompareTable";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The peers printed at most; the country's table holds five rows, the city's four. */
export const TRADE_PEERS_CAP = 5;

export type TradePeersData = {
  rows: CompareRow[];
  columns: CompareColumn[];
  entityHead: string;
  /** PART 7's basis, printed under the table as the archetype's caveat. */
  caveat: string;
  /** The stated line where no peer resolves (M19); null where peers print. */
  notGathered: string | null;
  /** The stated line for the home row's dash, off `moneyShown`; null where its figure prints. */
  homeWithheld: string | null;
  /** How many peer rows print. */
  peers: number;
  /** The home row's figure, or null where withheld. */
  homeFigure: number | null;
  /** The opener's mark: the home row's figure is the masthead's own (measured where money is shown); the peers' are cells_master's. */
  confidence: "measured" | "modeled";
};

const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Null only when the seed names no place: every resolving cell carries `meta.city`. */
export function buildTradePeers(seed: any): TradePeersData | null {
  const city = typeof seed?.meta?.city === "string" ? seed.meta.city.trim() : "";
  const iso2 = typeof seed?.meta?.iso2 === "string" ? seed.meta.iso2.toUpperCase() : "";
  if (!city || !iso2) return null;
  const moneyShown = seed?.meta?.money_shown === true;
  const takings = seed?.headline?.rev_p50_usd;
  const homeFigure = moneyShown && isNum(takings) && takings > 0 ? Math.round(takings) : null;
  const places: any[] = Array.isArray(seed?.nearby?.places) ? seed.nearby.places : [];
  const peerRows: CompareRow[] = places
    .filter((p) => p && typeof p.name === "string" && p.name.trim() && !p.home && p.name.trim() !== city)
    .slice(0, TRADE_PEERS_CAP)
    .map((p) => ({
      iso2,
      key: slugOf(String(p.name)),
      name: String(p.name).trim(),
      home: false,
      values: { takings: isNum(p.rev_p50_usd) && p.rev_p50_usd > 0 ? Math.round(p.rev_p50_usd) : null },
    }));
  const rows: CompareRow[] = [
    { iso2, key: slugOf(city), name: city, home: true, values: { takings: homeFigure } },
    ...peerRows,
  ];
  const columns: CompareColumn[] = [{ key: "takings", head: COPY.tradePeers.cols.takings, unit: "usd", best: "max" }];
  return {
    rows,
    columns,
    entityHead: COPY.tradePeers.cols.place,
    caveat: COPY.tradePeers.basis,
    notGathered: peerRows.length === 0 ? COPY.tradePeers.notGathered : null,
    homeWithheld: homeFigure == null ? COPY.tradePeers.homeWithheld : null,
    peers: peerRows.length,
    homeFigure,
    confidence: "measured",
  };
}
