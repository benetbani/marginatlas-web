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
import { spineCellSeed } from "@/lib/spine-seeds";
import { Box, Rail, Movement, usd, Band } from "@/components/spine/kit";
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
    <Box id="spread">
      <Rail icon="spread" kicker={COPY.tradeSpread.kicker} sample={s.sample} />
      {s.marks.length > 0 ? (
        <RangeStrip marks={s.marks} scale="linear" fmt={usd} basis={s.basis ?? ""} />
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
export function SpineCellBody({ data = X }: { data?: any } = {}) {
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
  const open = buildOpen(d);
  /* `05 split | 06 team` (turn-one.tsx): the split off the seed's one-builder
     net and the trade's lines, the team off the shard's roles and the
     country's median; both on every trade that holds a shard, so the band
     holds two children or does not draw (the same condition as `03 | 04`). */
  const split = buildSplit(d);
  const team = buildTeam(d.meta?.industry_id, d.meta?.iso2);
  /* `07 peers` (turn-one.tsx): the table builds on every resolving cell
     (the seed always names its place), with the slate's rows on a United
     States cell and the seated form off it, so the second full width stands
     on every trade page. */
  const peers = buildTradePeers(d);
  /* `08 clears | 09 lasts` (turn-two.tsx): the share off the engine where
     money is shown, else the shard; the survival triple off the shard; both
     on every trade that holds a shard, so the band holds two children or
     does not draw (the same condition as `03 | 04`). */
  const clears = buildClears(d);
  const lasts = buildLasts(d.meta?.industry_id);
  /* `11 mix` (turn-two.tsx): the donut off the shard's channels on every
     trade that holds a shard, seated in the exit beside `13 rivals` since
     2026-09-20 (`10 watch`, the seat that stood beside it, left the page that
     day: see the turn-two band's note). `12 market` (market.tsx): the four
     cells off the same shard, the cluster its own band. */
  const mix = buildMix(d.meta?.industry_id);
  /* The place goes with the id (2026-09-20 night): the rivals cell prints this city's own density beside the trade's typical where the city shard names the trade exactly. */
  const market = buildMarket(d.meta?.industry_id, "place", { iso2: d.meta?.iso2, slug: d.meta?.geo, tradeName: d.meta?.trade });
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
  const customers = buildTradeCustomers(d.meta?.industry_id);
  /* A5's two seats: the customers card in the exit only where the spread drew (it moved to the opening otherwise), the worth only as its strip. */
  const exitCustomers = spreadDrawn ? customers : null;
  const worthDrawn = worth && worth.state === "strip" ? worth : null;
  const doors = buildTradeCloseDoors(d);
  /* The turns, by whether a card stands under each: turn one holds the
     money cards and the peers (the peers only where a peer resolves, the
     band's note), turn two the share, the survival grid and the strip, turn
     three the bento and then the exit's pair. */
  const turnOne = !!(permits && open) || !!(split && team) || !!(peers && peers.peers > 0);
  const turnTwo = !!(clears && lasts);
  const turnThree = !!market;

  return (
    <div className="py-2" data-spine-body>
      {/* NO MAIN AND NO GUTTER OF ITS OWN (the goal's A13, 2026-09-24): every route that draws this body
         wraps it in SiteChrome, whose <main> is `max-w-content mx-auto px-6`; a second main here nested the
         landmark and doubled the gutter, 1024 of content at 1280 where the pages are built at 1072 and 295 at
         375 where they are built wider (measured on production). The harness wraps its renders the same way. */}
      {/* THE TRAIL BACK UP (Crumbs.tsx, 2026-09-22): country, place, this
          trade. Above the masthead, outside the levels, no figure. */}
      <Crumbs items={buildCellCrumbs(d.meta)} />
      {/* `00 take`, FULL WIDTH, the page's only 40 (8.6, loud one): the answer
          card draws its own hero band, the attribute the full-width gate reads. */}
      <Masthead d={d} />
      {/* `01 spread | 02 suits`, 1-1, the opening's one band (8.6): is the money
          in the range I pictured, and am I the kind of person this suits. The
          strip LEFT (the dot family's seat, M10), the notes RIGHT, both quiet.
          MEASURED at 1-1 after it was seated (the dispatch's report carries
          the numbers): 8.6's own expectation was that five notes would open
          air under the strip and the split would move to 2-3 with `02` wide;
          the card holds four notes, and the measurement decided the split. */}
      {/* WHERE THE SPREAD IS WITHHELD, WHAT A CUSTOMER SPENDS TAKES ITS SEAT
          (the goal's A5, 2026-09-24): the opening asks "is the money in the
          range I pictured", and where the trust gate withholds a year's
          takings (a filled London row without a curated entry) the card that
          still answers money coming in is a regular's year, the trade's own,
          which every page holds; it stood in the exit beside the worth, and
          the worth leaves with the spread (below), so nothing prints twice
          and no absence card stands. Money-shown pages keep the spread. */}
      {spreadDrawn ? (
        <Band split="1-2" stack="lg">
          <Spread d={d} />
          <Suits d={d} />
        </Band>
      ) : customers && hasSuits ? (
        <Band split="1-2" stack="lg">
          <CustomersCard customers={customers} />
          <Suits d={d} />
        </Band>
      ) : hasSpread || hasSuits ? (
        <Band split="1-2" stack="lg">
          <Spread d={d} />
          <Suits d={d} />
        </Band>
      ) : null}

      {/* CHAPTER TURN ONE (8.6, "What it costs to open, and to run", the site's
          string, M7): the kit's Movement, the muted index and one plain
          heading, no eyebrow and no icon (8.4). */}
      {turnOne ? (
        <>
          <Movement index="01" heading={COPY.tradeChapters.costs} />
          {/* `03 permits | 04 open`, the permits narrow LEFT and the cost to open
              wide RIGHT in all three of its states (8.6), AT 1-2, RULED BY
              MEASUREMENT 2026-09-18 (8.4 rule 1, the closed set): at 8.6's
              expected 2-3 the exemplar's held card stood 610 (nine setup lines
              as a table) against the four-cell licence grid's 268, a 376 by
              342 hole and 40 percent ink at 1280; with the bill's five biggest
              lines drawn and the rest stated (open_rows.ts) the card is 426,
              and at 1-2 the grid's labels wrap to its phone form, 316, so the
              air under it is 110, under the 120 floor, 0 holes at three
              widths; at 2-3 it would still be 133. The baseline and withheld
              states hold at either split (269 and 238 against the grid at
              2-3, measured). `stack="lg"` because without it the grid at a
              tablet's 344 stretched to the bill's height with 373 of air
              (measured). Both cards draw on every cell whose trade holds a
              shard. */}
          {permits && open ? (
            /* A FIGURE CARD TAKES THE NARROW THIRD (the goal's B12, 2026-09-24):
               the months to earn it back since A4, and now the lone total too,
               which sat in the wide two thirds with a blank of about 613 by 126
               round its figure on 40 London trades at 1280 (E7's sweep). THE
               KINDS-OF-SHOP LIST STANDS AT HALVES: at 1-2 the licences at a third
               wrapped to their phone grid and outgrew it, a 613 by 120 to 150
               blank round the list on 11 of its 41 pages; at 1-1 the licences
               widen and shorten, measured on the 41 (the numbers in the
               commit). The bill keeps the wide side (the 2026-09-18 reading). */
            <Band split={openForm(open) === "metric" ? "2-1" : openForm(open) === "list" ? "1-1" : "1-2"} stack="lg">
              <PermitsCard permits={permits} />
              <OpenCard open={open} />
            </Band>
          ) : null}
          {/* `05 split | 06 team`, the split wide LEFT (fill-bar two, M10) and the
              team narrow RIGHT (8.6), AT 3-2 as expected, RULED BY MEASUREMENT
              2026-09-18 (8.4 rule 1; the dispatch's report carries the numbers
              at three widths on the three story cells). `stack="lg"` because at
              a tablet's 344 the split's legend fell to one column and the
              seven-row table stood past it. Both cards draw on every cell whose
              trade holds a shard. */}
          {split && team ? (
            <Band split="3-2" stack="lg">
              <SplitCard split={split} />
              <TeamCard team={team} />
            </Band>
          ) : null}
          {/* `07 peers`, FULL WIDTH, the page's second of three (8.6, R1: the
              take, the peers, the close), closing turn one: the table on
              CompareTable, which draws its own `data-wide-table` wrapper, the
              sanction the full-width and lone-card gates read; the
              section-bands baseline for this page moved 0 to 1 with it, the
              city's precedent (its history entry says so). Quiet by table
              law, no colour; the rows never navigate (M23). */}
          {/* WITHHELD WHEN NO PEER RESOLVES (his word of 2026-09-19, "will you
              say not gathered yet?", verbatim in rules/FOUNDER-VERDICTS.md,
              over the 2026-09-08 seated reading): off the United States the
              table held the home row alone under "Not gathered yet: the same
              trade in other places", one row of a comparison, on the London
              page he is shown. The builder still builds the seated shape (its
              copy gate reads it, the sheet draws it as the form's own story);
              the page draws the table only where a peer stands in it, and it
              returns with the peers (DATA-REQUIREMENTS item 57). */}
          {peers && peers.peers > 0 ? <PeersCard peers={peers} /> : null}
        </>
      ) : null}

      {/* CHAPTER TURN TWO (8.6, "What it takes to keep it open"): does an
          ordinary day cover the costs, and do places like this last. */}
      {turnTwo ? (
        <>
          <Movement index="02" heading={COPY.tradeChapters.keep} />
          {/* `08 clears | 09 lasts`, 1-1 AS EXPECTED, the share LEFT (loud three
              in 8.6, the page's third and last accent, on BentoMetric while
              the ring waits for his click) and the survival grid RIGHT, quiet,
              ink. MEASURED 2026-09-18 at three widths on London, California
              and Mumbai cafes (the dispatch's report carries the numbers): a
              one-figure card against three cells, 0 holes. Both cards draw on
              every cell whose trade holds a shard. */}
          {/* RE-PAIRED 2026-09-20 UNDER HIS PAGE LAWS AND THE GOLD STANDARD (the
              loop's composition, reversible; the readings in
              scratchpad/step23 and the plan's log): `08 clears | 09 lasts | 14
              worth` AT THREE THIRDS, the kit's `1-1-1` (clause 50 allows
              three), the ring beside its words LEFT (the page's third accent),
              the survival cells in the middle, the two-mark strip RIGHT:
              221, 254 and 241 tall at a third, one level with no card
              short of its neighbour by more than the foot's 48, two visuals
              (the ring, the strip). `10 watch`, the drawn blocked seat, LEFT
              THE PAGE: no "not gathered yet" card in front of him (his word
              of 2026-09-19), its data 0 of 243 (item 53), and beside the
              donut it stretched to 271 and fell to 56 percent ink (the
              art-direction gate's E2 on the first render); it returns with
              its data as his B1 bars. `11 mix` moved down to the exit beside
              `13 rivals` (below). MEASURED ON THE WAY, the pairings refused:
              the ring beside the donut at 1-1 (the donut's card 50 taller,
              and stacked at 768 the ring's words left 255 by 180 of air); the
              donut beside the list at 1-2 with the list in two columns (the
              list 84 short); `14` alone at two thirds (LEVEL UNFILLED, 65
              percent); every 2 + 2 + 1 of five cards leaves one alone. */}
          {/* BACK TO THE PAIR the night of 2026-09-20: `14 worth` left this level
              for the exit's second pair beside `16 customers` (below), the
              section his "more sections" added; the ring beside the survival
              cells, 221 / 221 at 1280, measured on 2026-09-20. */}
          {clears && lasts ? (
            <Band split="1-1">
              <ClearsCard clears={clears} />
              <LastsCard lasts={lasts} />
            </Band>
          ) : null}
        </>
      ) : null}

      {/* CHAPTER TURN THREE (8.6, "What the trade is like"): the one-band turn,
          `12 market`, the bento, its own band with zero accent; the heading
          draws when the cluster does (every trade that holds a shard). */}
      {turnThree ? (
        <>
          <Movement index="03" heading={COPY.tradeChapters.trade} />
          <MarketBand market={market} />
        </>
      ) : null}

      {/* THE EXIT (no chapter break, PART 1). Until 2026-09-20 it was `13
          rivals | 14 worth` at 2-1, ruled by measurement on 2026-09-18 (air
          under `14` at 1-1, the list's two-column form on the wide seat;
          exit.tsx carries the four readings and the six-row residual); the
          strip now stands on turn two's level of three, and the list's
          partner is the donut. */}
      {/* `11 mix | 13 rivals` AT 1-2 (2026-09-20, the exit's new pair): the
          donut's card LEFT at a third, where the ring stands above its three
          rows (409 tall, measured), and the list of other trades RIGHT in ONE
          column (MarkList's `oneColumn`, 397 tall at 693 by the 2026-09-18
          reading): 12 apart, the closest pair on the page. The two-column
          form the list took beside the strip stood 308 and left 100 of air
          under it beside the donut. No `stack`: at a tablet's equal halves
          the donut stacks to 409 and the one-column list to 413, the same
          match. Under the chapter's own heading, "What the trade is like":
          how the money comes in, and what the other trades here keep. */}
      {mix && rivals ? (
        <Band split="1-2">
          <MixCard mix={mix} />
          <RivalsCard rivals={rivals} oneColumn />
        </Band>
      ) : (
        <>
          {mix ? <Band split="1-2" stack="lg"><MixCard mix={mix} /></Band> : null}
          {rivals ? <Band split="2-1" stack="lg"><RivalsCard rivals={rivals} /></Band> : null}
        </>
      )}
      {/* `16 customers | 14 worth` AT 1-1 (2026-09-20 night, his "more
          sections" from what the shard holds): what one regular customer is
          worth a year LEFT, the fact card with its computation at 30, and
          what the whole business sells for RIGHT, the two-mark strip, the
          level's visual; the exit's second pair, one reading of worth beside
          the other. Both draw on every trade holding a shard; a survivor
          stands alone at two thirds. Measured on London, the numbers in the
          commit. */}
      {/* THE WORTH DRAWS ONLY ITS STRIP (the goal's A5): its withheld state
          ("Not measured yet: the take-home here that a sale price is worked
          from.", 117 of the 138 live London trades) and its other-basis state
          ("Not worked out yet", 4) are absence cards, and they leave; the
          customers card stands here only where it did not move up. */}
      {exitCustomers && worthDrawn ? (
        <Band split="1-1">
          <CustomersCard customers={exitCustomers} />
          <WorthCard worth={worthDrawn} />
        </Band>
      ) : exitCustomers ? (
        <Band split="2-1" stack="lg"><CustomersCard customers={exitCustomers} /></Band>
      ) : worthDrawn ? (
        <Band split="2-1" stack="lg"><WorthCard worth={worthDrawn} /></Band>
      ) : null}
      {/* `15 close`, FULL WIDTH (8.6, R1), the page's third of three: the
          terminus on the hero band the old close stood on, the sanction the
          full-width gate, the lone-card rule and the section-bands baseline
          read on this page (exit.tsx says why it stays there). */}
      {doors.length > 0 ? (
        <div className="mt-6 mb-2">
          <Band hero><CloseCard doors={doors} /></Band>
        </div>
      ) : null}
    </div>
  );
}
