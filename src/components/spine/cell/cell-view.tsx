/**
 * Cell page (a trade in a place) , SPINE rebuild BODY (SpineCellBody).
 *
 * THE ORDER IS MODEL.md 8.6's (plan step 33, 2026-09-18, the first of six
 * dispatches): the opening full width (`00 take`), then the band `01 spread
 * | 02 suits`; chapter turn one, what it costs to open and to run (`03
 * permits | 04 open`, `05 split | 06 team`, `07 peers` full width); turn two,
 * what it takes to keep it open (`08 clears | 09 lasts | 14 worth` at three
 * thirds since 2026-09-20; before that `08 | 09` and `10 watch | 11 mix`);
 * turn three, what the trade is like (`12 market`, the bento, then `11 mix |
 * 13 rivals` as the exit's pair since the same day; before that `13 rivals
 * | 14 worth`), `15 close` full width. The country view's
 * idiom, exactly: the builders built once at the top of the body, a band
 * seated only when a card exists, `Movement` with an index and a heading and
 * nothing else, no rail (the trade page carries none). Three full widths,
 * R1: the take, the peers, the close.
 *
 * WHAT THE FIRST DISPATCH BUILT: `00 take` on the answer card (masthead.tsx,
 * the one net builder behind its companion), `01 spread` on the range strip
 * and `02 suits` on the note list (below). WHAT IT RETIRED: the old
 * masthead's client island, crumb, answer sentence, break-in word and docked
 * strip (masthead.tsx says which law each broke); the WhoSuits tier band
 * (`who_suits.scales`, never populated on the live route, a coined 0 to 100
 * read, clause 17; `02` answers the question in prose); and the imported
 * WhoItSuits card (`02` is its seat, on the archetype).
 *
 * WHAT THE SECOND DISPATCH BUILT (2026-09-18): the band `03 permits | 04
 * open` at 2-3 on turn-one.tsx, the permits on KvGrid over the shard's
 * licences (permits_rows.ts) and the cost to open in its three states
 * (open_rows.ts: RankedBars held, BentoMetric baseline and withheld), the
 * foot's months to break even and years to pay back off the shard on all
 * three. WHAT IT RETIRED: the ramp's phase bar (its figure lives in `04`'s
 * foot now, off the shard for 243 trades instead of the one bundled seed)
 * and the old cost to open on the LollipopColumn (five of nine lines drawn,
 * the rest behind a disclosure of justify-between rows, a payback derived
 * from the picker; `04` draws every line as one set with the shard's own
 * payback). LollipopColumn itself stays in forms-v2 for its other callers.
 *
 * WHAT THE THIRD DISPATCH BUILT (2026-09-18): the band `05 split | 06 team`
 * on turn-one.tsx, the net profit margin on IncomeBreakdown (split_rows.ts:
 * the shard's held drivers or the sector profile, the residual named, the
 * net pinned last at 30 in ink, THE SAME FIGURE `00` prints, the plus with
 * fixed and variable costs at its foot) and what staff cost on TiersTable's
 * figures shape (team_rows.ts: the roles with a headcount and a year's pay
 * off the country's median). WHAT IT RETIRED: the $100 stack (MoneySplit,
 * which rescaled every cost to fit the net, the fabrication the residual law
 * forbids), the owner-keeps waterfall (a second drawing of the split's
 * figures), the wage table (three London roles on a lowest / typical /
 * highest the seed alone held; `06` draws the shard's roles on 243 trades),
 * and the format picker with its context (the subtype control room, never
 * populated on the live route; the industry page's subject). BreakEven reads
 * the seed alone now.
 *
 * WHAT THE FOURTH DISPATCH BUILT (2026-09-18): `07 peers` on CompareTable,
 * full width, closing turn one (turn-one.tsx PeersCard off
 * trade_peer_rows.ts: the United States' per-state slate, the seated table
 * with its stated line off the United States, never an invented peer); and
 * the band `08 clears | 09 lasts` on turn-two.tsx, the share of a typical
 * day at 30 in terracotta on BentoMetric (clears_rows.ts: the engine where
 * money is shown, else the shard; the ring is candidate 4 awaiting his
 * click, its mockup owed to the review sheet) and survival as a series on
 * KvGrid (lasts_rows.ts, the shard's triple, year five first, the focal
 * cell candidate 1). WHAT IT RETIRED: the Nearby table (a sortable client
 * island in interactive.tsx holding the four invented UK cities), the
 * break-even ring (money-chapter.tsx, the ClearanceRing off two rounded
 * covers, the file gone with it) and the Myth card below this header (the
 * London file's survival triple as a slope with "9 in 10 fail" struck
 * across it, both banned by R5), with the seed's `myth` block.
 *
 * WHAT THE FIFTH DISPATCH BUILT (2026-09-18): the band `10 watch | 11 mix`
 * on turn-two.tsx, the drawn blocked seat for what closes one (BlockedSeat
 * off the copy table: his B1 bars wait on DATA-REQUIREMENTS item 53, 0 of
 * 243) beside where sales come from on KvGrid (mix_rows.ts: the shard's
 * channels with their shares, the leader first; THE DONUT IS CANDIDATE 5
 * of FORM-CATALOG's CANDIDATES AWAITING HIS CLICK, its mockup owed to the
 * review sheet, and KvGrid holds the seat until then); and `12 market` on
 * market.tsx, the page's only bento, four cells tiled 2+1 over 1+2 off
 * market_rows.ts (the shard's competition triple and its seasonal swing),
 * zero accent, under chapter break 03, which now has a card to draw over.
 * WHAT IT RETIRED: the Risks dot plot (interactive.tsx, the file gone with
 * it: the London file's four titles authored for every storefront trade,
 * scored 8 / 6 / 3 by hand from two pressure words, never a held cause
 * with a share for one trade, so none of its rows is printed), the Demand
 * rail below this header (`#week`, the dayparts donut and the covers
 * figures off the dev seed alone, cut by 8.6's inventory and item 68;
 * `#catchment`, the channel ShareStack with its accented leader and the
 * catchment index list, item 49; neither ever drew on the live route), the
 * Seasonality columns (`#seasonality`, twelve zero-based monthly columns
 * off the London file's multipliers, London only, its reading now the
 * swing cell), and the adapter's `risks` and `seasonality` blocks that fed
 * the last two.
 *
 * WHAT THE SIXTH AND LAST DISPATCH BUILT (2026-09-18): the exit, on
 * exit.tsx. The band `13 rivals | 14 worth`: other trades to open on
 * MarkList with no marks, every row a door to the sibling trade's page here
 * (rivals_rows.ts: the siblings the adapter now resolves through
 * related_links.ts, the archetype's cost to open by key, a sibling on the
 * default withheld with the count; under four with a figure the structure
 * and the stated line, never a short list), beside what one sells for on
 * RangeStrip with two marks (worth_rows.ts: the shard's sale figures times
 * the take-home `00` prints, in currency; the stated line off `moneyShown`
 * and on the 38 operating-earnings shards); then `15 close` on Terminus,
 * three doors and the pill last (close_rows.ts buildTradeCloseDoors: the
 * industry page, the place's own page, the compare pill). WHAT IT RETIRED:
 * the Related links (`d.related`, never fed on the live route) and the old
 * Close below this header (the sibling door, the pricing pill), so nothing
 * of the old body remains mounted; the page draws 8.6's sixteen blocks.
 *
 * THE THIRD CHAPTER BREAK draws when a card stands under it (the city
 * view's own rule for its turn three): `12 market` builds on every trade
 * that holds a shard, so on every such cell the heading stands over the
 * bento; on a sector-average cell (no shard) nothing in turn three draws
 * and the heading waits with it, because a heading over empty space is the
 * fault the old body already guarded against. Turns one and two always
 * hold a card on a resolving cell.
 *
 * THE OLD HEADER'S CHART DICTIONARY LEFT WITH ITS LAST CARD (the sixth
 * dispatch): the counted bars and free forms it named (the PhaseBar, the
 * WhoSuits tier band, the LollipopColumn, the masthead's strip) retired
 * card by card across the six dispatches above, and the bar ledger is
 * 8.6's (M10): `04` held, `05`, `10`; the two strips `01` and `14` are the
 * dot family. The as-built order, the loud moments and the counts are the
 * model's rows, not this file's.
 *
 * THE SAMPLE MARK'S WIRING, said once for the render group: every card on
 * this page whose figures are modelled passes `sample` to the kit's `Rail`
 * (or `tagged` to MarkList, `sample` to BentoMetric), and the kit draws
 * `SampleTag` there, behind his switch (MODEL.md, THE SAMPLE MARK IS BEHIND
 * ONE SWITCH); the sample-tags gate reads this group for that name, and the
 * mechanism it names is the one every card here uses.
 */
import * as React from "react";
import { lockedLevelKeys } from "@/lib/monetization/levels";
import { FreeDoors } from "@/components/spine/FreeDoors";
import { lockedBody, type LockSpec } from "@/components/spine/LockedSection";
import { spineCellSeed } from "@/lib/spine-seeds";
import { Box, Rail, usd } from "@/components/spine/kit";
import { Zone, type ZoneSplit } from "@/components/spine/zones";
import { Masthead } from "./masthead";
import { PermitsCard, OpenCard, SplitCard, TeamCard, PeersCard } from "./turn-one";
import { ClearsCard, LastsCard, MixCard } from "./turn-two";
import { MarketBand } from "./market";
import { RivalsCard, WorthCard, CloseCard, CustomersCard } from "./exit";
import { buildTradeCustomers } from "@/lib/spine/trade_customers_rows";
import { Crumbs } from "@/components/spine/Crumbs";
import { buildCellCrumbs } from "@/lib/spine/crumb_rows";
import { buildRivals } from "@/lib/spine/rivals_rows";
import { buildWorth } from "@/lib/spine/worth_rows";
import { buildTradeCloseDoors } from "@/lib/spine/close_rows";
import { buildPermits } from "@/lib/spine/permits_rows";
import { buildOpen, openForm } from "@/lib/spine/open_rows";
import { buildSplit } from "@/lib/spine/split_rows";
import { buildTeam } from "@/lib/spine/team_rows";
import { buildTradePeers } from "@/lib/spine/trade_peer_rows";
import { buildClears } from "@/lib/spine/clears_rows";
import { buildLasts } from "@/lib/spine/lasts_rows";
import { buildMix } from "@/lib/spine/mix_rows";
import { buildMarket } from "@/lib/spine/market_rows";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { buildTradeSpread } from "@/lib/spine/trade_spread_rows";
import { buildSuits } from "@/lib/spine/suits_rows";
import { COPY } from "@/lib/spine/copy";
import type { LoudSeat } from "@/lib/spine/loud_seats";
import { StockTiers } from "@/components/spine/sections/StockTiers";
import { Thresholds } from "@/components/spine/sections/Thresholds";
import { buildStockKit } from "@/lib/spine/sections/stock_kit";
import { buildThresholds } from "@/lib/spine/sections/thresholds";
import { LocalApps } from "@/components/spine/sections/LocalApps";
import { SpendByIncome } from "@/components/spine/sections/SpendByIncome";
import { buildLocalApps } from "@/lib/spine/sections/local_apps";
import { buildSpendByIncome } from "@/lib/spine/sections/spend_by_income";
import { MarketHold } from "@/components/spine/sections/MarketHold";
import { buildMarketHold, marketForTrade } from "@/lib/spine/sections/market_jobs";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { checkedDateForTrade } from "@/lib/spine/checked";
import { DepthNotifyFoot } from "@/components/spine/DepthNotifyFoot";
import { cityRegisterPlace } from "@/lib/uk/registers/register_city";
import { sayTradeTypical } from "@/lib/spine/uk_trade_typical";

const X: any = spineCellSeed;

/**
 * THE THREE LOUD MOMENTS, declared where they are lit or held (MODEL.md 8.6's
 * seat table; plan step 40, 2026-09-19). Seat one is the masthead's AnswerCard
 * in ./masthead.tsx (`tone="accent"`, the answer withheld off `moneyShown`),
 * seat two the open card in ./turn-one.tsx (`open.accent`, true in the held
 * and baseline states of open_rows.ts and false in the withheld one), seat
 * three the clears card in ./turn-two.tsx (`clears.accent`, always on). All
 * three lit on the exemplar, London restaurants; the two data-conditional
 * seats are unlit where their figure is withheld, which the loud-seats gate
 * reads off each render (the state markers, never a missing accent alone).
 * The census prints this ledger. Literals only, read from source
 * (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 take", figure: "the take-home, 40", state: "LIT", condition: "8.6: the page's only rung-40 figure where moneyShown (London's curated entry and trusted-local cells: 16 of the 31 walked routes, 87 of the slate's 3,670, under trust:revenue-filled 2026-09-19); off it the answer is withheld with a stated line (the AnswerCard's data-state no-answer) and the page carries two" },
  { seat: 2, card: "04 open", figure: "the total to open, 30; its biggest bar `--terra` where the bill is held; on the baseline the typical at 30 on WorkedFigure under its own kind of shop (2026-09-24, the goal's B10)", state: "LIT", condition: "8.6: LIT where held or baseline; UNLIT where withheld (a cell without setup_costs on the 90 trades on the 80,000 default: since 2026-09-24 the card earns it back, the months to break even at 30 in ink under 'Earning it back', and the stated line only where the trade holds no shard), and the page carries two; the accent never moves to 05's net or to 03's longest wait" },
  { seat: 3, card: "08 clears", figure: "the needed share of a day, the sweep `--terra`", state: "LIT", condition: "8.6: always on, 243 of 243 (computeBreakeven where moneyShown, else the shard's breakeven_utilization_pct); the Ring since 2026-09-20 (candidate 4, clicked by his gold standard), the share at 30 in `--terra-text` inside the sweep" },
] as const satisfies readonly LoudSeat[];

/* The .celltop terracotta top-edge hover motif is DELETED (rulebook v1 section 37,
 * founder G3, 2026-07-11): the accent never appears on hover. The quiet grey .hov
 * row wash (shell.tsx) remains the one hover mechanism. */

/* ================= CH1 , THE VERDICT ================= */
/* The old HonestTake half-card is GONE (founder D7 + rulebook v1 section 17,
 * 2026-07-11): after the 07-10 verdict deletions it was a lone n_firms figure
 * stretched across a half band. The count survives, reframed as what it is (how
 * many already trade here), as the masthead scorecard's third tile. */

/* ================= THE OPENING BAND, `01 spread | 02 suits` ================= */
/**
 * A year's takings, `01 spread` (MODEL.md 8.6; plan step 33's first dispatch,
 * 2026-09-18): the range strip, three marks, linear, the typical the card's
 * one 30 in ink (the strip's `lead`, the city strip's precedent, M3), the
 * outer marks at 14, no accent (the opening's accent is spent on `00`). The
 * marks come from trade_spread_rows.ts off the seed's `headline`: on London
 * the three are fixed multipliers of the typical (0.5, 1, 1.8), a modelled
 * shape, and the basis says so in 8.6's own words; on a trusted local cell
 * off London the cell's own bottom and top tenth, measured. Off `moneyShown`
 * the card stands with its opener and the withheld line at the lead rung
 * where the figure would (the running-costs card's idiom; the builder's
 * header says why not a sample), and FOCAL names it until the data lands.
 * Dot family, off the bar ledger (M10), the LEFT seat of the band.
 */
function Spread({ d }: { d: any }) {
  const s = buildTradeSpread(d);
  if (!s) return null;
  return (
    <Box id="spread" className="flex flex-col">
      <Rail icon="spread" kicker={COPY.tradeSpread.kicker} sample={s.sample} />
      {s.marks.length > 0 ? (
        /* THE STRIP CENTRED IN A LENT HEIGHT (2026-09-26): beside "Who this suits", which the note glyphs made a line taller, the
           strip and its basis stood at the top and the spare height gathered at the foot (48px, clause 52); centred, the air
           stands above and below it, the metric cells' idiom. */
        <div className="flex flex-1 flex-col justify-center">
          <RangeStrip marks={s.marks} scale="linear" fmt={usd} basis={s.basis ?? ""} />
        </div>
      ) : (
        <p data-withheld-line="spread" className="mt-2 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{s.withheld}</p>
      )}
    </Box>
  );
}

/**
 * Who this suits, `02 suits` (MODEL.md 8.6; the same dispatch): THE PAGE'S
 * ONE PROSE SECTION (R9, `data-editorial="1"` through NoteList's default),
 * on NoteList's law: two notes off the trade's authored character (who does
 * well, think twice) and the two checks from the country's one string bank
 * phrased as questions (M20, R10), four notes on every trade, the
 * not-gathered row where a trade holds no character (no live trade today;
 * suits_rows.ts counts 243 of 243 and says why the brief's three was a
 * miscount). No figure on the card: the opening band's rest point. The
 * basis says whose words the notes are and that the questions score
 * nothing. The Rail's sample flag is on because the notes are authored, not
 * measured (the locals card's own idiom). The RIGHT seat of the band. The
 * old WhoSuits tier band (`who_suits.scales`, a coined 0 to 100 read never
 * populated on the live route) and the imported WhoItSuits card left with
 * this dispatch.
 */
function Suits({ d }: { d: any }) {
  const industryId: string | undefined = typeof d.meta?.industry_id === "string" ? d.meta.industry_id : undefined;
  const iso2: string | undefined = typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined;
  if (!industryId || !iso2) return null;
  const s = buildSuits(industryId, iso2);
  return (
    <Box id="suits">
      <Rail icon="who-for" kicker={COPY.tradeSuits.kicker} sample />
      <NoteList notes={s.rows} columns={2} />
      {s.basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{s.basis}</p> : null}
    </Box>
  );
}

/* THE EXIT'S CARDS live on exit.tsx since plan step 33's sixth dispatch
 * (2026-09-18): the Myth card, its folklore constants and the SurvivalSlope
 * stood here until the fourth dispatch (the London file's survival triple
 * drawn as a descending line with "9 in 10 fail" struck across it; survival
 * is `09 lasts` on turn-two.tsx now, off the shards, R5), and the Related
 * links and the old Close until the sixth (`13 rivals` and `15 close` on
 * exit.tsx now, off rivals_rows.ts and close_rows.ts). */

/**
 * The cell spine body. Parameterized on `data` (defaults to the bundled
 * illustrative seed) so the dev route renders the full seed unchanged, while the
 * live route passes a real, reconciled seed from buildSpineCellSeed(). Every
 * chapter and section guards on its own data: a field the adapter omitted (no
 * honest source) renders NOTHING here, never a "0"/undefined/broken block. On
 * the full seed every guard is satisfied, so /dev/spine-cell is byte-for-byte
 * what it was.
 */
/* The reusable body , accepts `data` (the bundled seed by default, or the real
 * adapter output from the live route). NOT the route's default export, because a
 * Next page component must conform to PageProps and cannot take a custom prop. */
/* WHAT A LOCKED LEVEL OF A TRADE PAGE DRAWS (masterplan step 16; his rulings 18 and 22): each card that can stand at a level Pro
   opens, by the key the body gives it, with the title and icon its own rail draws and the stand-in nearest its drawing. The split
   card's open title prints "$100", a figure a locked card never carries, so it takes its level's own name. Two ids mean another
   section on another page (a trade's peers, its market hold), so their lines are keyed apart. */
const CELL_LOCKS: Record<string, LockSpec> = {
  stock: { id: "stock", title: COPY.stock.kicker, icon: "startup-cost", kind: "table" },
  hold: { id: "market-hold", title: COPY.marketHold.kicker, icon: "competition", kind: "bars" },
  thresholds: { id: "thresholds", title: COPY.thresholds.kicker, icon: "taxes", kind: "rows" },
  split: { id: "split", title: "Where the money goes", icon: "cost-breakdown", kind: "bars" },
  team: { id: "team", title: COPY.tradeTeam.kicker, icon: "wages", kind: "table" },
  peers: { id: "peers", title: COPY.tradePeers.kicker, icon: "benchmark", kind: "table", lineKey: "trade-peers" },
  mix: { id: "mix", title: COPY.tradeMix.kicker, icon: "payments", kind: "bars" },
  rivals: { id: "rivals", title: COPY.tradeRivals.kicker, icon: "subtype", kind: "rows" },
  apps: { id: "apps", title: COPY.localApps.kicker, icon: "supplier", kind: "grid" },
  spend: { id: "spend-income", title: COPY.spendByIncome.kicker, icon: "spending-power", kind: "bars" },
  customers: { id: "customers", title: COPY.tradeCustomers.kicker, icon: "spending-power", kind: "rows" },
  worth: { id: "worth", title: COPY.tradeWorth.kicker, icon: "sale-tag", kind: "track" },
};

export function SpineCellBody({ data = X, locked = false }: { data?: any; locked?: boolean } = {}) {
  const d = data;

  /* WHO IS HOME, ASKED ONCE (the country view's idiom): each card's presence,
     so a band is drawn when a card exists and not otherwise, and a heading
     never sits over nothing. The opening's two cards build for every
     resolving cell (the strip stands withheld off `moneyShown`, the notes
     draw on every trade), so the band always holds two children. */
  const spreadData = buildTradeSpread(d);
  const hasSpread = spreadData != null;
  /* THE SPREAD DRAWS ONLY WHERE MONEY IS SHOWN (the goal's A5, 2026-09-24): off
     `moneyShown` it printed "Not measured yet: a year's takings for this trade
     in this city." (120 of the 138 live London trades), the absence card he
     refused; there `16 customers` takes its seat below. */
  const spreadDrawn = (spreadData?.marks.length ?? 0) > 0;
  const hasSuits = typeof d.meta?.industry_id === "string" && typeof d.meta?.iso2 === "string";
  /* `03 permits | 04 open` (turn-one.tsx): both builders on every resolving
     cell whose trade holds a shard (243), the permits off the licences and
     the cost to open in whichever of its three states the cell is in, so the
     band always holds two children; a sector-average cell (industry_id
     `default`, no shard) draws neither and the band does not draw. */
  const permits = buildPermits(d.meta?.industry_id, d.meta?.iso2);
  const openBuilt = buildOpen(d);
  /* `05 split | 06 team` (turn-one.tsx): the split off the seed's one-builder
     net and the trade's lines, the team off the shard's roles and the
     country's median; both on every trade that holds a shard, so the band
     holds two children or does not draw (the same condition as `03 | 04`). */
  const splitBuilt = buildSplit(d);
  const teamBuilt = buildTeam(d.meta?.industry_id, d.meta?.iso2);
  /* `07 peers` (turn-one.tsx): the table builds on every resolving cell
     (the seed always names its place), with the slate's rows on a United
     States cell and the seated form off it, so the second full width stands
     on every trade page. */
  const peers = buildTradePeers(d);
  /* `08 clears | 09 lasts` (turn-two.tsx): the share off the engine where
     money is shown, else the shard; the survival triple off the shard; both
     on every trade that holds a shard, so the band holds two children or
     does not draw (the same condition as `03 | 04`). */
  const clearsBuilt = buildClears(d);
  const lasts = buildLasts(d.meta?.industry_id, "place", { iso2: d.meta?.iso2, slug: d.meta?.industry });
  /* `11 mix` (turn-two.tsx): the donut off the shard's channels on every
     trade that holds a shard, seated in the exit beside `13 rivals` since
     2026-09-20 (`10 watch`, the seat that stood beside it, left the page that
     day: see the turn-two band's note). `12 market` (market.tsx): the four
     cells off the same shard, the cluster its own band. */
  const mixBuilt = buildMix(d.meta?.industry_id);
  /* The place goes with the id (2026-09-20 night): the rivals cell prints this city's own density beside the trade's typical where the city shard names the trade exactly. */
  const marketBuilt = buildMarket(d.meta?.industry_id, "place", { iso2: d.meta?.iso2, slug: d.meta?.geo, tradeName: d.meta?.trade });
  /* `13 rivals` and `14 worth` (exit.tsx): the rivals off the seed's siblings
     on every resolving cell (the list where four or more hold a figure, the
     structure and the line otherwise), the worth off the shard's sale
     figures and the take-home on every trade that holds a shard (the strip,
     or the line off `moneyShown` and on the operating-earnings shards). Since
     2026-09-20 the worth stands on turn two's level of three and the rivals
     beside the donut; each band is gated on both its cards so it holds its
     children or does not draw, and a sector-average cell (no shard) never
     seats a lone `13`. `15 close`: the doors off the meta, on every resolving
     cell. */
  const rivals = buildRivals(d);
  const worth = buildWorth(d);
  /* `16 customers` (exit.tsx): one regular customer's year off the shard's spend and visits, on every trade holding either (2026-09-20 night). */
  const customersBuilt = buildTradeCustomers(d.meta?.industry_id);
  /* A PAGE HELD TO A REGISTER REGION (a London trade page; masterplan step 04, the labels audit's item 10): each card printing
     the trade's figure says so in its one line, the market drops the metro density and takes the UK's insolvencies. */
  const builtCards = { split: splitBuilt, team: teamBuilt, clears: clearsBuilt, mix: mixBuilt, customers: customersBuilt, open: openBuilt, market: marketBuilt };
  const { split, team, clears, mix, customers, open, market } = cityRegisterPlace(String(d.meta?.iso2 ?? ""), String(d.meta?.geo ?? "")) ? sayTradeTypical(builtCards, typeof d.meta?.industry === "string" ? d.meta.industry : null) : builtCards;
  /* A5's two seats: the customers card in the exit only where the spread drew (it moved to the opening otherwise), the worth only as its strip. */
  const exitCustomers = spreadDrawn ? customers : null;
  const worthDrawn = worth && worth.state === "strip" ? worth : null;
  const doors = buildTradeCloseDoors(d);
  /* THE KIT AT FOUR BUDGETS BESIDE THE LINES TO CROSS (2026-09-25, two of his page-agnostic sections of that night, seated on his
     "you choose, push forward"): the trade's own kit where the kit file holds the trade in the country (the United Kingdom's
     barbershops and cafes today), beside the lines a first year crosses there. Neither card's figures stand anywhere else on a
     trade page, and the lines read against the page's own sales: a barbershop's year runs across the VAT line. Both or neither,
     so the level never holds one card. */
  const kit = typeof d.meta?.iso2 === "string" && typeof d.meta?.industry === "string" ? buildStockKit(d.meta.iso2, d.meta.industry) : null;
  /* WHO HOLDS THE MARKET (2026-09-25), where the trade sells in a market the file measures (the UK's grocery trades): it takes
     the kit's seat beside the lines to cross on a trade the kit file does not hold, so the level is the same question asked of
     a shop that does not fit out chairs: what stands in the way in the first year. */
  const holdMarket = !kit && typeof d.meta?.iso2 === "string" && typeof d.meta?.industry === "string" ? marketForTrade(d.meta.iso2, d.meta.industry) : null;
  const hold = holdMarket && typeof d.meta?.iso2 === "string" ? buildMarketHold(d.meta.iso2, holdMarket) : null;
  const lines = (kit || hold) && typeof d.meta?.iso2 === "string" ? buildThresholds(d.meta.iso2) : null;
  /* THE APPS THE TRADE RUNS ON BESIDE WHO SPENDS ON IT, BY INCOME (2026-09-25, two more of his sections of that night): the
     country's apps by job, the booking job only for the trades it serves, beside a household's week on the trade's item by
     income tenth. Both or neither. */
  const spendIncome = typeof d.meta?.iso2 === "string" && typeof d.meta?.industry === "string" ? buildSpendByIncome(d.meta.iso2, d.meta.industry) : null;
  const apps = spendIncome && typeof d.meta?.iso2 === "string" ? buildLocalApps(d.meta.iso2, d.meta.industry) : null;
  /* The turns, by whether a card stands under each: turn one holds the
     money cards and the peers (the peers only where a peer resolves, the
     band's note), turn two the share, the survival grid and the strip, turn
     three the bento and then the exit's pair. */
  /* Either card holds the opening level (plan 06, task A6): a UK page's cost to open stands alone where the licence list is withheld. */
  const turnOne = !!(permits || open) || !!((kit || hold) && lines) || !!(split && team) || !!(peers && peers.peers > 0);
  /* Either card holds the level (plan 06, task A2): a UK trade with no single survival group keeps covering the costs, alone. */
  const turnTwo = !!(clears || lasts);
  const turnThree = !!market;

  /* THE BAND PAGE (2026-10-04, his "push forward man" after the United Kingdom's band page went live; MODEL.md PART 10): each level
     a zone, the tone by its place, the sections open on it, each chapter's number and title on the first level of the chapter that
     draws. The levels, their pairs, their splits and the tablet's stacking are the bento's, each measured there (this file before
     2026-10-04 carries the numbers): the answer; the spread (or the customers) beside who it suits; 01 the permits beside opening,
     the stock or the market's hold beside the thresholds, the split beside the team, the peers table (the whole column); 02 what
     clears beside how long it lasts; 03 the market's cluster, the mix beside the other trades, the apps beside spending by income,
     the customers beside what it is worth; the close. A level whose partner self-omits keeps the kit's two thirds (zones.tsx). */
  type CellZone = { key: string; split: ZoneSplit; stack?: "lg"; chapter?: "01" | "02" | "03"; outside?: boolean; label: string; body: React.ReactNode[] };
  const CHAPTERS = { "01": COPY.tradeChapters.costs, "02": COPY.tradeChapters.keep, "03": COPY.tradeChapters.trade } as const;
  const keep = (xs: React.ReactNode[]) => xs.filter(Boolean);
  const opening: React.ReactNode[] = spreadDrawn
    ? [<Spread key="spread" d={d} />, <Suits key="suits" d={d} />]
    : customers && hasSuits
      ? [<CustomersCard key="customers" customers={customers} />, <Suits key="suits" d={d} />]
      : keep([hasSpread ? <Spread key="spread" d={d} /> : null, hasSuits ? <Suits key="suits" d={d} /> : null]);
  const openSplit: ZoneSplit = open ? (openForm(open) === "metric" ? "2-1" : openForm(open) === "list" ? "1-1" : "1-2") : "1-2";
  const cellZonesAll: CellZone[] = [
    { key: "take", split: "wide", label: "The answer", outside: true, body: [<Masthead key="take" d={d} />] },
    { key: "opening", split: "1-2", stack: "lg", label: "Is the money in it", outside: true, body: opening },
    { key: "permits", split: openSplit, stack: "lg", chapter: "01", label: COPY.tradeChapters.costs, body: turnOne ? keep([permits ? <PermitsCard key="permits" permits={permits} top={!!open && openForm(open) === "list"} /> : null, open ? <OpenCard key="open" open={open} /> : null]) : [] },
    {
      key: "stock",
      split: kit && lines ? "3-2" : "2-3",
      stack: "lg",
      chapter: "01",
      label: "Stock",
      body: turnOne && lines ? (kit ? [<StockTiers key="stock" id="stock" kit={kit} />, <Thresholds key="thresholds" id="thresholds" data={lines} fill />] : hold ? [<MarketHold key="hold" id="market-hold" data={hold} />, <Thresholds key="thresholds" id="thresholds" data={lines} fill />] : []) : [],
    },
    { key: "split", split: "3-2", stack: "lg", chapter: "01", label: "Where the money goes", body: turnOne && split && team ? [<SplitCard key="split" split={split} />, <TeamCard key="team" team={team} />] : [] },
    { key: "peers", split: "wide", chapter: "01", label: COPY.tradePeers.kicker, body: turnOne && peers && peers.peers > 0 ? [<PeersCard key="peers" peers={peers} zone />] : [] },
    { key: "clears", split: "1-1", chapter: "02", label: COPY.tradeChapters.keep, body: turnTwo ? keep([clears ? <ClearsCard key="clears" clears={clears} /> : null, lasts ? <LastsCard key="lasts" lasts={lasts} /> : null]) : [] },
    { key: "market", split: "wide", chapter: "03", label: COPY.tradeChapters.trade, body: turnThree ? [<MarketBand key="market" market={market} />] : [] },
    { key: "mix", split: "1-2", stack: mix && rivals ? undefined : "lg", chapter: "03", label: "The mix", body: keep([mix ? <MixCard key="mix" mix={mix} /> : null, rivals ? <RivalsCard key="rivals" rivals={rivals} oneColumn={!!mix} /> : null]) },
    { key: "apps", split: "3-2", stack: "lg", chapter: "03", label: "Paying here", body: apps && spendIncome ? [<LocalApps key="apps" id="apps" data={apps} />, <SpendByIncome key="spend" id="spend-income" data={spendIncome} />] : [] },
    { key: "exit", split: "1-1", stack: exitCustomers && worthDrawn ? undefined : "lg", chapter: "03", label: "The way out", body: keep([exitCustomers ? <CustomersCard key="customers" customers={exitCustomers} /> : null, worthDrawn ? <WorthCard key="worth" worth={worthDrawn} /> : null]) },
    /* THE EXIT ON THE HERO BAND THE BENTO'S CLOSE STOOD ON (`Band hero`, exit.tsx says why): the page's third full width, the
       sanction the full-width gates and the section-bands baseline read on this page. */
    { key: "close", split: "wide", label: "Where to next", outside: true, body: doors.length > 0 ? [<div key="close" data-hero="1"><CloseCard doors={doors} /></div>] : [] },
  ];
  const cellZones = cellZonesAll.filter((z) => z.body.length > 0);
  /* THE LOCK (masterplan step 16; his ruling 18): told the page is locked, each chapter's first level that draws stays open and
     every later one draws its cards locked; the answer, the opening pair and the close stand outside the chapters. Untold,
     nothing changes. */
  const lockedZones = locked ? lockedLevelKeys(cellZones.map((z) => ({ key: z.key, chapter: z.chapter ?? null, outside: z.outside }))) : null;
  /* THE FREE DOORS (his ruling of 2026-10-05 on PARKED P20.1): where "The mix" locks, the other trades it names, by name only, in
     a zone of their own after the close, outside the chapters, so a free reader keeps every trade the open page links. */
  const rivalDoors = (rivals?.rows ?? []).filter((r) => typeof r.href === "string" && r.href).map((r) => ({ name: String(r.name), href: String(r.href) }));
  const doorsTitle = COPY.freeDoors.trades.replace("{city}", String(d.meta?.city ?? d.meta?.geo_name ?? "this city"));
  const shownZones: CellZone[] = lockedZones?.has("mix") && rivalDoors.length > 0
    ? [...cellZones, { key: "doors", split: "wide", label: doorsTitle, outside: true, body: [<FreeDoors key="doors" id="trades" title={doorsTitle} doors={rivalDoors} />] }]
    : cellZones;
  /* The chapter's number and title stand on the first level of the chapter that draws. */
  const headed = new Set<string>();
  return (
    <>
      {/* NO MAIN AND NO GUTTER OF ITS OWN (the goal's A13, 2026-09-24): every route that draws this body wraps it in SiteChrome. */}
      <Crumbs items={buildCellCrumbs(d.meta)} />
      <div className="-mx-2 md:mx-0" data-spine-body data-composition="zones">
        {shownZones.map((z) => {
          const chapter = z.chapter && !headed.has(z.chapter) ? (headed.add(z.chapter), { index: z.chapter, heading: CHAPTERS[z.chapter] }) : undefined;
          return (
            <Zone key={z.key} split={z.split} stack={z.stack} label={z.label} chapter={chapter}>
              {lockedZones?.has(z.key) ? lockedBody(z.body, CELL_LOCKS) : z.body}
            </Zone>
          );
        })}
      </div>
      {/* THE UK'S SOURCES, ONE LINE UNDER THE BANDS (plan 06, task B4): the licence's sentence and the link to the one sources page; nothing off the UK. */}
      <SourcesFoot iso2={d.meta?.iso2} />
      {/* REPORT A MISTAKE, AND CHECKED WHERE A DATE IS HELD (masterplan step 31): the page's own path to the correction page. */}
      <ReportFoot path={d.meta?.iso2 && d.meta?.geo && d.meta?.industry ? `/${String(d.meta.iso2).toLowerCase()}/${String(d.meta.geo).toLowerCase()}/${String(d.meta.industry).toLowerCase()}` : null} checked={checkedDateForTrade(d.meta?.iso2, d.meta?.geo != null ? String(d.meta.geo) : null, d.meta?.industry != null ? String(d.meta.industry) : null)} />
      {/* THE THIN PAGE'S ONE ASK (milestone 1, M9): the notify-me form, only on a page the floor census counted under its floor outside the UK. */}
      {d.meta?.iso2 && d.meta?.geo && d.meta?.industry ? <DepthNotifyFoot path={`/${String(d.meta.iso2).toLowerCase()}/${String(d.meta.geo).toLowerCase()}/${String(d.meta.industry).toLowerCase()}`} /> : null}
    </>
  );
}
