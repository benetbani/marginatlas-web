/**
 * Cell page (a trade in a place) , SPINE rebuild BODY (SpineCellBody).
 *
 * THE ORDER IS MODEL.md 8.6's (plan step 33, 2026-09-18, the first of six
 * dispatches): the opening full width (`00 take`), then the band `01 spread
 * | 02 suits`; chapter turn one, what it costs to open and to run (`03
 * permits | 04 open`, `05 split | 06 team`, `07 peers` full width); turn two,
 * what it takes to keep it open (`08 clears | 09 lasts`, `10 watch | 11
 * mix`); turn three, what the trade is like (`12 market`, the bento); the
 * exit (`13 rivals | 14 worth`, `15 close` full width). The country view's
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
 * WHAT STAYS MOUNTED UNTIL ITS OWN DISPATCH, each of today's cards in the
 * seat of the 8.6 block that absorbs it (SPINE.md PART A's inventory), and
 * retiring nothing a later block absorbs:
 *   related (Related)       -> `13 rivals`, MarkList; self-omits on the live
 *                              route today
 *   close (Close)           -> `15 close`, Terminus
 *
 * THE THIRD CHAPTER BREAK draws when a card stands under it (the city
 * view's own rule for its turn three): `12 market` builds on every trade
 * that holds a shard, so on every such cell the heading stands over the
 * bento; on a sector-average cell (no shard) nothing in turn three draws
 * and the heading waits with it, because a heading over empty space is the
 * fault the old body already guarded against. Turns one and two always
 * hold a card on a resolving cell.
 *
 * (The paragraph below is the old header, kept for the chart dictionary it
 * carries of the cards still mounted; the counted bars and free forms it
 * names retire card by card with the dispatches above.)
 *
 * Cell page (a trade in a place) , SPINE rebuild, publish-ready flagship. Leg 3 and
 * the pattern-setter for the other four page types. The locked content-map order
 * re-presented to the shared spine kit, taken to the masterplan's publish bar:
 * answer-first hero, one dominant decision figure, progressive disclosure creating
 * the free/Pro seam, honest baselines, rationed terracotta, count-up + hover motion.
 *
 * As-built chart dictionary (rulebook 25 bar budget: max 3 bar-family graphics per
 * page, no two adjacent sections sharing the bar form). The THREE counted bars:
 *   BAR 3 , PhaseBar (two-anchor open/break-even time axis): Ramp x1 (ch4)
 *   (BAR 2, the ShareStack of the Demand channels, left on the fifth dispatch)
 * FREE forms carry the rest of the variety (no budget cost):
 *   big figure at hero scale: masthead $43K (the ONE hero; the control-room trio
 *      restates it at sub-hero support scale by design, the seam's summary)
 *   discrete tier band (categorical Low/Mid/High pips, active inked): WhoSuits x1 (ch1)
 *   lollipop on a drawn track (thin, marker family, not a fill bar): CostToOpen line items x1
 *   (the SurvivalSlope, the ClearanceRing and the Nearby table left on the
 *      fourth dispatch; the dayparts donut, the catchment list and the
 *      Seasonality columns on the fifth, above)
 *   spread strip: masthead turnover p10/p50/p90 x1
 * REMOVED forms: Gauge, 3-pip meters, Dots, invented-ceiling break-even fill bar, the
 *   3-level "waterfall" bars (-> true stepped waterfall), min-floored seasonality area,
 *   the Related keep-% lollipops, the catchment IndexBars, the Nearby in-cell CellScaleBars;
 *   the WhoSuits continuous-track Meters (-> discrete categorical tier band, 2026-07-12).
 * Every modeled/placeholder figure block carries a visible SampleTag (rulebook 4A);
 * the masthead states provenance once as the page-level tag.
 * Width tiers per WI-4; the money chapter is weighted heaviest (control room + wide reads).
 */
import * as React from "react";
import { spineCellSeed } from "@/lib/spine-seeds";
import { Fig, Box, Rail, Movement, usd, Band } from "@/components/spine/kit";
import { Masthead } from "./masthead";
import { PermitsCard, OpenCard, SplitCard, TeamCard, PeersCard } from "./turn-one";
import { ClearsCard, LastsCard, WatchSeat, MixCard } from "./turn-two";
import { MarketBand } from "./market";
import { buildPermits } from "@/lib/spine/permits_rows";
import { buildOpen } from "@/lib/spine/open_rows";
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

const X: any = spineCellSeed;

const money = usd; // ONE money grammar page-set-wide (kit usd: exact below $10,000, $426K, $1.4M)

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
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{s.basis}</p>
    </Box>
  );
}

/* ================= CH5 , PLACE AND RIVALS ================= */
/* The Myth card, its folklore constants and the SurvivalSlope stood here
 * until plan step 33's fourth dispatch (2026-09-18): the London file's
 * survival triple drawn as a descending line with "9 in 10 fail" struck
 * across it. Survival is a series on the metric row, quiet, fed by the 243
 * shards, with no slope and no myth sentence (R5, PART 9 clause 40); it is
 * `09 lasts` on turn-two.tsx now, off lasts_rows.ts. */

/* Related , rulebook v1 sections 5, 15 and 32 (founder G6/G7/G9, 2026-07-11): the
 * per-trade keep-% lollipop ranking and its computed "every neighbouring trade
 * keeps more" footer are DELETED , net margin by trade in a specific city is
 * structurally unknowable, and the cross-entity verdict footer is a banned copy
 * pattern. Related is now plain sibling links (the Close link-row form): name +
 * what one costs to open, a knowable entry figure (the seed carries the modeled
 * startup-capital anchor per trade). A sibling with no cost figure renders the
 * name alone , nothing is ever faked. The seed list is hospitality-adjacent,
 * cafe first; dental never surfaces on a restaurant page.
 * width: Even half. terracotta target: none (links are chrome). */
function Related({ d }: { d: any }) {
  const arr: any[] = d.related ?? [];
  if (arr.length === 0) return null; // omitted on promotion: no sibling-cell links
  /* THE PLACE COMES FROM THE DATUM. Every row here was hardcoded to
     `/gb/london/${r.slug}` under a heading that reads "Related trades in this
     place", so the heading and the href disagreed for every place that is not
     London.

     It has never reached a reader: adapt_cell leaves `related` undefined on the
     public route ("keep-% column has no honest per-sibling source"), so the
     guard above returns null and these links render only in the /dev sandbox,
     where the London seed makes them correct by accident.

     That accident is the problem. The day anyone gives `related` a source, this
     section starts sending readers from Madrid and Sydney to London, and the
     heading tells them they are still in their own city. Deriving the prefix
     from d.meta is identical for the seed (GB + london) and correct for
     everything else. No meta means no href, so a row renders as text rather
     than as somewhere else's page. */
  const iso2: string | undefined = d.meta?.iso2;
  const geo: string | undefined = d.meta?.geo;
  const placePrefix =
    iso2 && geo ? `/${String(iso2).toLowerCase()}/${String(geo).toLowerCase()}` : null;
  return (
    <Box data-block="related" className="md:flex-[3]">
      {/* same section-opener treatment as sibling cards (Rail kicker, not a bold Head) */}
      <Rail icon="subtype" kicker="Related trades in this place" sample />
      {/* the explanatory subtitle is DELETED (rulebook 14: most subtitles should not
          exist); the cost figure's unit is a direct column label, never a sentence (rule 26). */}
      <div className="mb-2 flex items-baseline justify-between border-b border-[var(--c-border)] pb-1.5">
        <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Trade</span>
        <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">To open</span>
      </div>
      <div className="space-y-1">
        {arr.map((r) => (
          <a key={r.slug} href={placePrefix ? `${placePrefix}/${r.slug}` : undefined} className="hov -mx-2 flex items-baseline justify-between gap-3 rounded-md px-2 py-1.5">
            <span className="min-w-0 truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{r.name} &#8594;</span>
            {typeof r.cost_to_open_usd === "number" ? (
              <Fig className="shrink-0 text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{money(r.cost_to_open_usd)}</Fig>
            ) : null}
          </a>
        ))}
      </div>
    </Box>
  );
}

/* Close , the deliberate full-width end of the page. The recap PARAPHRASES the verdict
 * (an echo, never a verbatim copy of the hero or the break-in line), one ink CTA, and
 * ink next-step links (navigation is chrome; the accent never sits on chrome).
 * The "format by format" door left with the format picker (plan step 33's third
 * dispatch, 2026-09-18): there is no format read on the page to point at. */
function Close({ d }: { d: any }) {
  const rel: any[] = d.related ?? [];
  const city = d.meta?.city ?? "this market";
  /* The same hardcoded London as Related above, in the same file, one function
     down. This one is louder: the row it builds reads "Look at X in {city}
     instead", so the label named the reader's own city while the href went to
     London. Derived from the datum, and null when the datum cannot say, in
     which case the row renders without a link rather than with a wrong one. */
  const iso2: string | undefined = d.meta?.iso2;
  const geo: string | undefined = d.meta?.geo;
  const placePrefix =
    iso2 && geo ? `/${String(iso2).toLowerCase()}/${String(geo).toLowerCase()}` : null;
  const trade = (d.meta?.trade ?? "this trade").toLowerCase();
  // Every link carries a REAL destination or renders as a plain span with no arrow
  // (no fake affordance): the trade-across-markets read lives on the industry page,
  // and the sibling-trade cell rides its seed slug.
  const links: Array<{ t: string; href?: string }> = [
    /* THE DESTINATION NOW MATCHES THE PROMISE. This row said "compare X across
       nearby markets" and went to the industries INDEX, a directory of trades,
       not a comparison of anywhere. The page it describes exists and this cell
       knows its own slug, so the link goes there. It falls back to the index only
       when the slug is missing, which is a real directory rather than a wrong one.
       AND IT NO LONGER STARTS WITH "COMPARE". The only other action in this
       section is "Compare this trade with Pro", so a reader met two doors whose
       first word was identical and had to read to the end of both to tell them
       apart. This one names where it goes. */
    { t: `See ${trade} in other cities`, href: d.meta?.industry ? `/industries/${d.meta.industry}` : "/industries" },
    ...(rel[0]
      ? [{ t: `Look at ${rel[0].name.toLowerCase()} in ${city} instead`, href: rel[0].slug && placePrefix ? `${placePrefix}/${rel[0].slug}` : undefined }]
      : []),
  ];
  return (
    <Box id="close">
      <div>
        <div className="max-w-2xl">
          {/* the asserted "bottom line" verdict paragraph and the forward "where the same
              work keeps more" line are BOTH deleted (rulebook 15/19: a section's data shows
              the conclusion, the copy never asserts it). This is a navigation terminus: the
              label points at the next steps below, it states no finding. */}
          <h3 data-typography="custom" className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">Where to next</h3>
        </div>
      </div>
      {/* THE DOORS SIT IN ONE ROW AND THE ROW HAS AS MANY COLUMNS AS IT HAS DOORS.
          Two faults, one shape. The row was fixed at three columns and this page
          resolves ONE link, so two thirds of it were empty. And the paid door was
          pinned to the far right of a header whose only other content was a
          nine-word label in micro caps, which left a dead band across the middle
          of a full-width card. Photographed at 1280: 1072 by 137, and most of it
          nothing.
          The paid door now sits with the others as the last item, which is what it
          is, and the column count follows the number of doors, so the row is full
          at one door or at four. */}
      {/* A ROW THAT DISTRIBUTES, RATHER THAN COLUMNS THAT ARE COUNTED.
          The first attempt at this picked a column count from the number of doors,
          which meant writing three different breakpoint layouts where there had
          been one, and the width gate refused it: this repo already carries
          fifty-odd grids whose second layout is pitched at a width no phone
          reaches and it will not take more. The gate was right, and the rewrite is
          better than what it rejected. A distributing row needs no arithmetic at
          all: it is full with one door and full with four, it wraps instead of
          leaving empty cells, and it removes a breakpoint layout rather than
          adding three. */}
      <div className="mt-4 flex flex-col items-start gap-3 border-t border-[var(--c-border)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
        {links.map((l, i) =>
          l.href ? (
            <a key={i} href={l.href} className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--terra-text)]">{l.t} &#8594;</a>
          ) : (
            <span key={i} className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)]">{l.t}</span>
          )
        )}
        <a href="/pricing" className="rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-center text-[length:var(--t-body)] font-semibold text-white transition-colors hover:bg-[var(--terra-text)]">
          Compare this trade with Pro &#8594;
        </a>
      </div>
    </Box>
  );
}

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
  const hasSpread = buildTradeSpread(d) != null;
  const hasSuits = typeof d.meta?.industry_id === "string" && typeof d.meta?.iso2 === "string";
  /* `03 permits | 04 open` (turn-one.tsx): both builders on every resolving
     cell whose trade holds a shard (243), the permits off the licences and
     the cost to open in whichever of its three states the cell is in, so the
     band always holds two children; a sector-average cell (industry_id
     `default`, no shard) draws neither and the band does not draw. */
  const permits = buildPermits(d.meta?.industry_id);
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
  /* `10 watch | 11 mix` (turn-two.tsx): the seat stands on every cell (it
     holds no data), the mix off the shard's channels on every trade that
     holds a shard; the band is gated on the mix alone so it holds two
     children or does not draw, and a sector-average cell never seats a lone
     card beside nothing. `12 market` (market.tsx): the four cells off the
     same shard, the cluster its own band. */
  const mix = buildMix(d.meta?.industry_id);
  const market = buildMarket(d.meta?.industry_id);
  const hasRelated = Array.isArray(d.related) && d.related.length > 0;
  /* The turns, by whether a card stands under each: turn one holds the
     money cards and the peers, turn two the share, the survival grid, the
     seat and the mix, turn three the bento. */
  const turnOne = !!(permits && open) || !!(split && team) || !!peers;
  const turnTwo = !!(clears && lasts) || !!mix;
  const turnThree = !!market;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
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
      {hasSpread || hasSuits ? (
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
            <Band split="1-2" stack="lg">
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
          {peers ? <PeersCard peers={peers} /> : null}
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
          {clears && lasts ? (
            <Band split="1-1">
              <ClearsCard clears={clears} />
              <LastsCard lasts={lasts} />
            </Band>
          ) : null}
          {/* `10 watch | 11 mix`, the drawn blocked seat LEFT (his B1's seat
              until item 53 lands, the page's visual floor beside the fullest
              quiet card in its band) and the parts of the trade's sales RIGHT
              on KvGrid (the donut's seat, candidate 5 awaiting his click), AT
              1-2, RULED BY MEASUREMENT 2026-09-18 (8.4 rule 1: the taller card
              takes the wide side): at 8.6's expected 1-1 the seat stood 520
              by 222 with 149 of content against the mix's 221 on London, 0
              holes at three widths, but 59 percent ink of its 222, one under
              the art-direction gate's E2 floor of 60 (a seat beside a taller
              card, the precedent the country's seats measured), and the
              five-part mix stands taller still; at 1-2 the seat's line wraps
              to two at 347 (171 of content, 130 of ink) and the seat reads 71
              percent beside a two-row mix (222 tall on London, California and
              Mumbai cafes, 0 holes at three widths), 98 beside the one-row
              two-part mix (barbershops, 172), and 54 beside the three-row
              five-part mix (nail salons, 278; 25 of 243 trades), which no
              split in the closed set mends because a seat cannot be narrower
              than a third; that residual is in the dispatch's report, not in
              a padded seat. `stack="lg"` because at a tablet's equal halves
              the five-part mix stands 357 and opened a 304 by 186 hole under
              the seat's 171 (measured; the `03 | 04` precedent); stacked,
              the seat stands at its own 172. The seat draws on every cell;
              the band is gated on the mix so it never holds one child. */}
          {mix ? (
            <Band split="1-2" stack="lg">
              <WatchSeat />
              <MixCard mix={mix} />
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

      {/* THE EXIT (no chapter break, PART 1): `13 rivals | 14 worth`, then `15
          close` full width. Today's related links hold `13`'s seat where they
          render; `14` is not built. */}
      {hasRelated ? (
        <Band split="2-1">
          <Related d={d} />
        </Band>
      ) : null}
      {/* `15 close`, FULL WIDTH (8.6, R1): the terminus, as built until its
          dispatch, on the hero band the full-width gate reads. */}
      <div className="mt-6 mb-2">
        <Band hero><Close d={d} /></Band>
      </div>
    </main>
  );
}
