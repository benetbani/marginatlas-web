/**
 * src/lib/spine/benchmark_rows.ts
 *
 * THE TRADES NEXT DOOR, the industry page's `02 benchmark` (MODEL.md 8.7;
 * plan step 34's first dispatch, 2026-09-18): is that keep high or low,
 * against the trades next door. RankedBars with `ceiling="set"`, the trade
 * itself and the highest of its sector, highest first, the basis naming the
 * sector's count; the leader may wear the ink pill because "keeps the most
 * of every $100" is a reason a reader accepts. Pure over the taxonomy and
 * the shards, synchronous, no database.
 *
 * FIVE ROWS, NOT TEN, RULED BY MEASUREMENT 2026-09-18 (8.4 rule 1 and its
 * equal-heights clause; the dispatch's report carries the numbers). 8.7's
 * row says "at most ten rows: the trade itself and the highest nine", and
 * its rhythm line calls the same card "bars" ("answer | facts · bars"), the
 * founder's own form for a net margin (ruling 6 of 2026-09-04, "net profit
 * margin in %, vertical bars"); RankedBars draws bars under six rows and a
 * table read top to bottom from six (PART 9 clause 20), so the two halves
 * of 8.7's own text meet only under six. Measured on the exemplar at 1280:
 * at ten rows the table stands 559 tall beside the survival grid's 215 of
 * content, a 307 by 324 blank at 1-2 and 480 by 336 at 1-1, 38 percent ink
 * of the card, under the art-direction gate's E2 floor of 60 at every split
 * in the closed set, because a three-cell grid cannot grow and a ten-row
 * table cannot shrink; at five rows the bars stand about 330 and the pair
 * holds (0 holes at three widths, the numbers in the report). So the card
 * draws THE TRADE AND THE HIGHEST FOUR OF THE REST, the basis says the rows
 * are the highest of the sector's count so the set's size is never hidden
 * (MarkList's own law for a top list), and the cap is one constant below;
 * the day `01` has a partner of the table's height, or the controller
 * re-pairs the band, `BENCHMARK_ROWS_CAP` goes back to ten and nothing else
 * moves. Recorded for the controller in the dispatch's queue row.
 *
 * THE SET: every trade sharing the trade's `sector_id` in
 * `src/lib/taxonomy/industries.json`, the 243 the shards are filed under
 * (ALL_INDUSTRIES; 25 sectors, 2 to 33 members, counted 2026-09-18). The
 * hardcoded `foodDrinkSiblings()` list in adapt_industry.ts (eight food ids,
 * 23 of 243 trades served, all with the same six rows) dies with this file.
 * The set is the taxonomy's whole and not the 138 in scope: 8.7 counts over
 * the 243 and names the four sectors under four members on that count; a
 * merged or retired member (nine of food and drink's 23) has a shard and a
 * ladder like any other, and the rows never navigate, so no reader is sent
 * to a page that redirects. Whether a trade should rank beside the formats
 * the founder merged into it (restaurants beside sit-down restaurants and
 * fast casual) is the composition round's to rule; recorded in the dispatch.
 *
 * EVERY MEMBER'S NET FROM THE ONE BUILDER (trade_net.ts, R7), with the
 * engine absent: a member on the shard's ladder is a row; a member on the
 * sector profile's residual (the 38 whose ladder is the 42 / 10 / 5 fill,
 * clause 46) holds the SECTOR'S figure and not its own, and one sector
 * figure on several rows would rank nothing, so it is WITHHELD with the
 * line, counted, never ranked on an invented figure. The trade itself, when
 * it sits on the profile, is withheld the same way and the line says so.
 *
 * THE STATES, counted 2026-09-18 over the 243 ids by `countBenchmarkStates`
 * (the gate re-counts):
 *   ranked    four or more members hold a figure: the card, the pill on the
 *             leader, the withheld line where any member is withheld.
 *   short     two or three hold one: RankedBars draws its two-column short
 *             table (name and figure, no track, every width) under the line
 *             naming the count against the floor of four, 8.7's own row for
 *             the four sectors under four and the country money card's
 *             instrument (clause 22 binds a ranking under four; the model's
 *             row prescribes drawing the members the sector has under the
 *             count, never a chart falling silently into a list).
 *   withheld  none or one holds one: RankedBars self-omits under two rows,
 *             so the card stands with its opener and the stated line where
 *             the rows would (the trade page's cost to open, withheld).
 * The floor is on members HOLDING A FIGURE, not on the sector's size: seven
 * sectors fall under it once the profile members are set aside (telecom and
 * broadcasting 0 of 2, higher ed and hospitals 1 of 2, mining and energy 1
 * of 4, finance 1 of 4, heavy industry 2 of 7, software 3 of 3, real estate
 * 3 of 3), 25 trades, where 8.7's count of ten read the sector sizes alone.
 *
 * THE ROWS: the trade's own row always among them when it holds a figure,
 * then the four highest of the rest (ties keep the taxonomy's order). The
 * ceiling is the set's own highest member (`ceiling="set"`), so the leader's
 * bar fills its track and the rule is named at its free end. The figure's
 * one form is the builder's whole percent (`netText`), the same string `00`
 * prints, so a trade never reads two nets on one page.
 *
 * BUILT ONCE PER ID IN A PROCESS (plan step 34's fourth dispatch,
 * 2026-09-19): the sector set resolves every member's net through the fact
 * store, whose lookup is a filter over every fact loaded in the process
 * (store.ts `queryFacts`), so on a gate that has loaded every country, city
 * and trade the same ranking cost 17 seconds for 243 ids against 2.5 in a
 * fresh process, and the archetype copy gate, which builds it for the
 * opening, the counts and the close, passed the chain's 120-second timeout.
 * The builder is pure over static files, so its result for an id is kept in
 * a map and returned frozen; nothing observable changes.
 */
import type { BarRow } from "@/components/spine/archetypes/RankedBars";
import { countWord } from "@/lib/spine/district_rows";
import { COPY } from "@/lib/spine/copy";
import { resolveTradeNet } from "@/lib/spine/trade_net";
import { sectorPhrase } from "@/lib/spine/industry_hero_facts";
import { ALL_INDUSTRIES, INDUSTRY_BY_ID } from "@/lib/taxonomy";

/** The rows the card holds at most: the trade and the highest four of its sector (the header says why not 8.7's ten). */
export const BENCHMARK_ROWS_CAP = 5;
/** A ranking needs four (PART 9 clause 22); below it the card draws what the sector has under the line. */
export const BENCHMARK_FLOOR = 4;

export type BenchmarkState = "ranked" | "short" | "withheld";

export type BenchmarkData = {
  industryId: string;
  sectorId: string;
  state: BenchmarkState;
  /** The rows RankedBars draws (empty when withheld), the trade's own among them when it holds a figure. */
  rows: BarRow[];
  /** The trade's own row key when it is ranked, else null (its keep is the sector's). */
  selfKey: string | null;
  /** Every member of the sector, the trade included. */
  members: number;
  /** How many members hold a figure of their own (the shard's ladder). */
  holding: number;
  /** The members on the sector profile, set aside. */
  withheldCount: number;
  /** The set's highest figure, the ceiling. */
  top: number;
  basis: string;
  /** The one line under the basis: the withheld count, the floor, or the not-gathered line; null when every member ranks. */
  line: string | null;
  confidence: "modeled";
};

const BUILT = new Map<string, BenchmarkData | null>();

export function buildBenchmark(industryId: string | null | undefined): BenchmarkData | null {
  if (!industryId) return null;
  const kept = BUILT.get(industryId);
  if (kept !== undefined) return kept;
  const built = buildBenchmarkOnce(industryId);
  BUILT.set(industryId, built);
  return built;
}

function buildBenchmarkOnce(industryId: string): BenchmarkData | null {
  const ind = INDUSTRY_BY_ID[industryId];
  if (!ind) return null;
  const sector = ALL_INDUSTRIES.filter((i) => i.sector_id === ind.sector_id);
  const holding: Array<{ id: string; name: string; pct: number }> = [];
  let withheldCount = 0;
  let selfWithheld = false;
  for (const m of sector) {
    const n = resolveTradeNet(m.id, { moneyShown: false, netMarginPct: null });
    if (n && n.branch === "shard") holding.push({ id: m.id, name: m.name, pct: n.pct });
    else { withheldCount++; if (m.id === industryId) selfWithheld = true; }
  }
  /* Highest first, a stable sort, so a tie keeps the taxonomy's order. */
  const ranked = [...holding].sort((a, b) => b.pct - a.pct);
  const self = ranked.find((r) => r.id === industryId) ?? null;
  const others = ranked.filter((r) => r.id !== industryId).slice(0, self ? BENCHMARK_ROWS_CAP - 1 : BENCHMARK_ROWS_CAP);
  const chosen = [...(self ? [self] : []), ...others].sort((a, b) => b.pct - a.pct);
  const rows: BarRow[] = chosen.map((r) => ({ key: r.id, name: r.name, value: r.pct }));
  const state: BenchmarkState = holding.length >= BENCHMARK_FLOOR ? "ranked" : holding.length >= 2 ? "short" : "withheld";
  const B = COPY.industryBenchmark;
  let line: string | null = null;
  if (state === "withheld") {
    line = holding.length === 0 ? B.noRows.replace("{members}", countWord(sector.length)) : B.oneRow.replace("{members}", countWord(sector.length));
  } else if (state === "short") {
    line = holding.length === sector.length
      ? B.underFloorAll.replace("{rows}", countWord(holding.length))
      : B.underFloor.replace("{rows}", cap(countWord(holding.length))).replace("{members}", countWord(sector.length));
  } else if (withheldCount > 0) {
    line = selfWithheld
      ? (withheldCount === 1 ? B.withheldSelf : B.withheldSelfAmong.replace("{n}", String(withheldCount)))
      : (withheldCount === 1 ? B.withheldOne : B.withheldMany.replace("{n}", String(withheldCount)));
  }
  return Object.freeze({
    industryId,
    sectorId: ind.sector_id,
    state,
    rows: state === "withheld" ? [] : rows,
    selfKey: state !== "withheld" && self ? self.id : null,
    members: sector.length,
    holding: holding.length,
    withheldCount,
    top: ranked.length ? ranked[0].pct : 0,
    basis: B.basis.replace("{n}", String(sector.length)).replace("{sector}", sectorPhrase(ind.sector_id)),
    line,
    confidence: "modeled",
  }) as BenchmarkData;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The states over a list of ids, counted rather than remembered, for the gates and the record. */
export function countBenchmarkStates(ids: string[]): { total: number; ranked: number; short: number; withheld: number; selfWithheld: number; anyWithheld: number; tenRows: number; shortIds: string[]; withheldIds: string[] } {
  const out = { total: ids.length, ranked: 0, short: 0, withheld: 0, selfWithheld: 0, anyWithheld: 0, tenRows: 0, shortIds: [] as string[], withheldIds: [] as string[] };
  for (const id of ids) {
    const b = buildBenchmark(id);
    if (!b) continue;
    if (b.state === "ranked") out.ranked++;
    else if (b.state === "short") { out.short++; out.shortIds.push(id); }
    else { out.withheld++; out.withheldIds.push(id); }
    if (b.state !== "withheld" && !b.selfKey) out.selfWithheld++;
    if (b.withheldCount > 0) out.anyWithheld++;
    if (b.rows.length === BENCHMARK_ROWS_CAP) out.tenRows++;
  }
  return out;
}
