/**
 * City page , SPINE rebuild BODY (SpineCityBody).
 *
 * Body/route split (Phase B): this file holds the whole page body as the named export
 * SpineCityBody, so the live metropolis route (src/app/cities/[slug]/page.tsx) can mount
 * it with real data (buildSpineCitySeed) while the thin dev route (page.tsx) renders it
 * with the bundled illustrative seed. Next forbids arbitrary named exports + custom props
 * on a route file, so the body lives here (a plain module) and page.tsx re-exports it as
 * the default. The default binding is the bundled spine seed, so the dev route stays
 * byte-identical to the pre-split page.
 *
 * THE ORDER IS MODEL.md 8.3's (plan step 32, 2026-09-18, the first of six
 * dispatches): the opening full width, then the band `01 glance | 02
 * among-cities`; chapter turn one, what it costs to open and to run (the
 * premises bento, then living beside the rent-against-income ratio); turn
 * two, where to open it and what to open (what residents spend beside what
 * customers earn, then rent by district beside the trades with local
 * figures, then the peers table full width); turn three, what the place is
 * like (the people table, the locals seat, the neighbourhoods beside the
 * residents and visitors); the exit full width.
 * The country view's idiom, exactly: the builders built once at the top of
 * the body, a band seated only when a card exists, `Movement` with an index
 * and a heading and nothing else, no chapter title in any rail (the city
 * carries none). Three full widths, R1: the masthead, the peers, the close.
 *
 * THREE BLOCKS RETIRED BY THAT COMPOSITION, and their builders, copy and
 * stories with them: `lenses` (the quick-reads spectra grid; 8.3 has no such
 * block, and a percentile has no poles, R8), `verdict` (the section-level
 * AnswerCard whose basis "{dearest} rent, against {cheapest}" was the rent
 * verdict the composition dissolves into the masthead's answer: "The rent
 * verdict card is dissolved, not cut"), `risks` (not in 8.3; it drew for no
 * real city, the adapter omits the block for all 252), and the old chapter
 * "What to watch" they sat under. `LowestBar`, the July-3 "Lowest bar to
 * entry" card, went with them: it was unmounted dead code whose two Boxes the
 * census still counted as city sections, and it drew the break-in blend
 * ruling 30 bans (8.3's `10 easiest` is seated, blocked and unrendered until
 * that ruling lands; nothing stands in for it).
 *
 * TWO MORE RETIRED BY THE FOURTH DISPATCH (2026-09-18, the band `08 demand |
 * 07 earnings` and the one income builder): `IncomeCurve` in chapters.tsx
 * (the file is gone with it, it held nothing else), the strip that drew
 * London's three marks off the seed's `income` block, which was the city
 * list's mean times 0.42, 0.88 and 2.2 (`city_view.ts`, a stopgap sanctioned
 * for one city and deleted), the typical in terracotta, a fourth accent
 * under another name, and the country's typical alone on 251 cities under
 * the city's kicker; and `DemandSpend`, the `text-3xl` spend card off the
 * seed's `demand.spend_*` fields. Their seats are `Earnings` and `Demand`
 * below, built by the slug like the seats before them; the illustrative
 * London seed no longer carries `income` or the spend fields, and the
 * adapter composes neither. THE FOUR INCOME READERS ARE ONE (item 24): the
 * masthead's answer, this strip's typical, the runway's income and the peers'
 * income column all print `cityTypicalIncome(slug)` (city_income.ts), which
 * is `owner_col.median_salary_usd_mo` times twelve on every listed city;
 * London prints $48,756 in all four places where it printed 64,800, 57,000,
 * 64,800 and 48,756.
 *
 * THE SIXTH AND LAST DISPATCH (2026-09-18) SEATED TURN THREE AND CHECKED THE
 * CLOSE: `12 character-people` at full form off `buildCityPeopleTable`, the
 * state table gone from this page (8.3 names one character table; the
 * state reads are the country's `14`); `13 locals` as the drawn blocked seat
 * on every city (item 6); `14 neighbourhoods` on the card pager with no
 * image, or its seat on the 209 placeholder schemes; `15 season` as the
 * KvGrid pair off the shard's footfall field, the old stacked bar
 * (`SeasonSplit`, the page's I3) and the adapter's `demand` block retired
 * with it; `16 close` as built, the lightest-rent door gone. The
 * illustrative seed's `locals_intel` and `demand` blocks left with the code
 * that read them.
 *
 * NULL-GUARDS (real-data promotion): every section early-returns null when its data is
 * absent, so an omitted field renders NOTHING (never 0 / undefined / NaN / a broken
 * block). The chapter breaks are fixed "01", "02", "03" (8.3's own numbering); the
 * first two always have content (the premises bento draws on every listed city
 * whose shard loads, the spend card and the earnings strip build for 252), and
 * the third always draws too since the sixth dispatch, because the locals seat
 * stands on every city.
 *
 * 2026-07-11 reformation (rulebook v1): the derived per-district keep index, the
 * per-trade net-margin rail, the take-home bar list and the crowding column are DELETED
 * (§5, unknowable metrics); districts rank by RENT LOAD, lightest first (founder D1);
 * bars are rationed to three (§25); the seasonality month bars are reframed to the
 * who-is-here read (§7).
 *
 * NO first-year timeline (rulebook v1 §9): a first-year ramp is a TRADE-level concept
 * (how long THIS business takes to break even), and a city page is trade-agnostic, so any
 * such timeline here would necessarily invent a representative trade. There is no honest
 * anchor at city altitude, so the block was deleted rather than replaced (2026-07-10).
 */
import * as React from "react";
import { spineCitySeed } from "@/lib/spine-seeds";
/* SampleTag is imported and not called here, as in the country view: every
   modelled figure on this page is marked through the `sample` prop of Rail,
   which draws the kit's SampleTag (hidden behind the one switch,
   MODEL.md, THE SAMPLE MARK IS BEHIND ONE SWITCH), and scripts/verify_sample_tags.ts
   proves the wiring by the reference, so the mark returns on every modelled
   card the day the switch is flipped. */
import { Movement, Box, Rail, Ico, SampleTag, Band, usd } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { EVERYDAY_TRADES } from "@/lib/spine/adapt_city";
import { countWord } from "@/lib/spine/district_rows";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { buildCityCloseDoors } from "@/lib/spine/close_rows";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { buildCityPeopleTable, type CityPeopleTable } from "@/lib/spine/character_rows";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { CardPager } from "@/components/spine/archetypes/CardPager";
import { buildCityNeighbourhoods, type CityNeighbourhoodsData } from "@/lib/spine/hood_rows";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { buildCityPeerTable } from "@/lib/spine/peer_rows";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { buildCityGlance, type CityGlanceData } from "@/lib/spine/city_glance_rows";
import { buildCitySeat, type CitySeatData } from "@/lib/spine/city_seat_rows";
import { buildCityLiving, buildCityRunway, buildCityDemand, buildCitySeason, type CityLivingData, type CityRunwayData, type CityDemandData, type CitySeasonData } from "@/lib/spine/fact_rows";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { buildCityEarningsStrip, type CityEarningsData } from "@/lib/spine/range_rows";
import { CityHero } from "./masthead";
import { WhereToTrade } from "./where-to-trade";
import { buildCityDistrictBars } from "@/lib/spine/district_rows";
import { Premises } from "./premises";
import { buildPremisesBento } from "@/lib/spine/premises_bento_rows";
import { COPY } from "@/lib/spine/copy";

/* ================= THE OPENING ================= */
/**
 * At a glance, `01 glance` (MODEL.md 8.3; plan step 32, first dispatch,
 * 2026-09-18), the country's `01 glance` one altitude down (R8, clause 43:
 * the same form, the same cell rule). THE SEAT IS HELD BY KvGrid AS
 * CATALOGUED: the fact card with a focal (a first cell at 30 taking the
 * card's width) is candidate 1 of FORM-CATALOG's CANDIDATES AWAITING HIS
 * CLICK, and a form not in the catalogue is a candidate awaiting his click;
 * so the cells draw at the head rung, nothing at 30, and the FOCAL finding
 * on this card stands until he clicks. The census reads this Box as KvGrid,
 * which is the truth of it today.
 *
 * The rows come from city_glance_rows.ts, pure over the files, every
 * figure's file and field in its header: the visitor count where the city
 * counted it (45 cities; the country's count through a size divisor is
 * withheld with its line, item 20), the human development figure withheld on
 * every city (every row is the country's with a step), the days to clear the
 * city's own permits and the businesses per 10,000 residents off the city
 * shard, each marked with the shard's tag. Three of 8.3's seven print
 * elsewhere and never here (M1): the metro GDP and the cost of living on the
 * card beside, the average pay in the masthead. The withheld line names what
 * the card does not hold, with the count; the foot names the modelled cells
 * in words. The average pay left the masthead with the fourth dispatch: the
 * masthead prints the typical pay off the one income builder now, and the
 * mean prints nowhere on this page.
 */
function Glance({ glance }: { glance: CityGlanceData | null }) {
  if (!glance) return null;
  return (
    <Box id="glance">
      <Rail icon="scorecard" kicker={COPY.glance.kicker} sample={glance.confidence !== "measured"} />
      <KvGrid cells={glance.cells} />
      {glance.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{glance.withheld}</p> : null}
      {glance.basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{glance.basis}</p> : null}
      {glance.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{glance.foot}</p> : null}
    </Box>
  );
}

/**
 * Among the cities, `02 among-cities` (MODEL.md 8.3; the same dispatch), the
 * country's `02 world-seat` one altitude down. THE SEAT IS HELD BY KvGrid:
 * the composition's card is the placed-figures form, a figure with the
 * sentence "Higher than {n} cities in ten" under it, which is candidate 2 in
 * FORM-CATALOG's CANDIDATES AWAITING HIS CLICK and not clicked; the placement
 * sentences are not drawn, nothing is at 30 (the FOCAL finding is expected),
 * and the foot says the placement is not shown yet. The day he clicks, the
 * sentences come from placement.ts (`placementOf`, noun "cities"), the one
 * builder every page shares (R2), over the 252 rows of the city list. The
 * census reads this Box as KvGrid. The rows come from city_seat_rows.ts: the
 * metro GDP and the cost of living, 252 of 252, the GDP marked modelled on
 * every row (no row carries a source, item 31) and the cost of living
 * measured on the 13 city-level pulls, modelled on the 239 hand anchors.
 */
function AmongCities({ seat }: { seat: CitySeatData | null }) {
  if (!seat) return null;
  return (
    <Box id="among-cities">
      <Rail icon="vs-world" kicker={COPY.citySeat.kicker} sample={seat.confidence !== "measured"} />
      <KvGrid cells={seat.cells} />
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{seat.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{seat.foot}</p>
    </Box>
  );
}

/* ================= TURN ONE , WHAT IT COSTS TO OPEN, AND TO RUN ================= */
/* `04 premises` is ./premises.tsx: the bento cluster and the one function
   that composes its cells, which the story sheet reads too, so the story is
   the card and not a copy of it. */

/**
 * What living here costs, `05 living` (MODEL.md 8.3; plan step 32, third
 * dispatch, 2026-09-18), the fact card: the one-bed rent, groceries, a
 * transit pass, each a month, and a coffee. THE SEAT IS HELD BY KvGrid AS
 * CATALOGUED: the fact card with a focal (the one-bed rent at 30 taking the
 * card's width, the three smaller cells beside it) is candidate 1 of
 * FORM-CATALOG's CANDIDATES AWAITING HIS CLICK, drawn once in the 2026-09-16
 * mockup and unclicked; a form not in the catalogue is a candidate awaiting
 * his click. So the four cells draw at the head rung in one group (two rows
 * of two), nothing at 30, and the FOCAL finding on this card stands until he
 * clicks. The census reads this Box as KvGrid, which is the truth of it
 * today. The rows come from fact_rows.ts (`buildCityLiving`), pure over the
 * city list and the city shard: `owner_col.*` off data/facts/city, 252 of
 * 252 holding all four (247 held, 5 modelled), each cell marked with the
 * shard's tag; the foot names the modelled cells in words; the withheld line
 * names a missing field with the count (none today). `owner_runway.*` is
 * never read: London's placeholders are deleted (item 23). The old kit card
 * that held this seat (`OwnerRunway`, a summed monthly focal off the ladder
 * with the four figures behind a disclosure in justify-between rows, PART
 * 5's LABEL GAP finding) is retired with this dispatch.
 */
function Living({ living }: { living: CityLivingData | null }) {
  if (!living) return null;
  return (
    <Box id="living">
      <Rail icon="cost-breakdown" kicker={COPY.cityLiving.kicker} sample={living.confidence !== "measured"} />
      <KvGrid cells={living.cells} />
      {living.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{living.withheld}</p> : null}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{living.basis}</p>
      {living.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{living.foot}</p> : null}
    </Box>
  );
}

/**
 * Rent against income, `06 runway` (MODEL.md 8.3; the same dispatch): a year
 * of one-bed rent as a share of a year of typical income, and the typical
 * income a year, the one absolute `05` does not hold (M1: the rent is never
 * printed twice in one band). THE SEAT IS HELD BY KvGrid: the derived-ratio
 * card (the percentage at 30, its sentence, a hairline, then one KvGrid row
 * beneath, F2) is candidate 3 of FORM-CATALOG's CANDIDATES AWAITING HIS
 * CLICK, drawn once in the 2026-09-16 mockup and unclicked; until he clicks
 * the seat is one KvGrid row of two cells at the head rung, no bar, no
 * track, no placement line, nothing at 30, and the FOCAL finding on this
 * card is expected. The census reads this Box as KvGrid. The rows come from
 * fact_rows.ts (`buildCityRunway`): the denominator chosen once, the held
 * monthly salary times twelve (item 24), never "median"; the share is
 * WITHHELD with its line on the thirty cities where a year of rent is more
 * than a year of income (Dakar 425 down to Surabaya 101, counted 2026-09-18;
 * the three like-for-like pairs of item 24 wait for their own block and stay
 * withheld here), so on those the card prints the income alone under the
 * line and the band keeps its two children. WHAT THE BASIS CANNOT YET SAY:
 * whether the income is before or after tax. The bank carries no marker on
 * the row (item 26: the drop's method never reaches a shard), and item 23
 * found the convention split across the UK cities (London, Edinburgh and
 * Leeds net as Frankfurt is, Birmingham, Bristol, Glasgow and Manchester
 * gross), so the basis says "a typical income" and neither word, and item
 * 24 carries the requirement. The income is the one builder's figure
 * (city_income.ts, the fourth dispatch): the same $48,756 the masthead, the
 * earnings strip and the peers row print on London. The old kit card
 * (`RentAffordability`, a `text-3xl` percentage over two justify-between
 * rows that printed the rent a second time in the band) is retired with
 * this dispatch.
 */
function Runway({ runway }: { runway: CityRunwayData | null }) {
  if (!runway) return null;
  return (
    <Box id="runway">
      <Rail icon="commercial-rent" kicker={COPY.cityRunway.kicker} sample={runway.confidence !== "measured"} />
      <KvGrid cells={runway.cells} />
      {runway.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.withheld}</p> : null}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.basis}</p>
      {runway.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.foot}</p> : null}
    </Box>
  );
}

/* ================= TURN TWO , WHERE TO OPEN IT, AND WHAT TO OPEN ================= */
/**
 * What residents spend, `08 demand` (MODEL.md 8.3; plan step 32, fourth
 * dispatch, 2026-09-18): the plain figure (F3), BentoMetric standing as its
 * own card the way the country's `04 entry-bill` does, the spend per
 * resident a year at 30 IN INK, one basis line, no track, no second figure
 * (the millionaire count has no field, no source and no method, item 27).
 * QUIET: the card's old `text-3xl` terracotta was a defect (off the ladder,
 * and not on PART 6's city list), and its `text-3xl` ink was still off the
 * ladder; the figure sits at `--t-focal` now. The rows come from
 * fact_rows.ts (`buildCityDemand`): `demand.spend_per_capita_usd` off the
 * bank, 252 of 252, 3 held, 248 modelled (the foot says so), 1 placeholder,
 * London, WITHHELD with its line and never printed, so the exemplar's card
 * holds a line where its 30 would stand and reds FOCAL on purpose until
 * London's spend is researched (item 23). Left of the band, 8.3's column.
 *
 * THE CENSUS DOES NOT READ THIS CARD (the bill's own note): BentoMetric draws
 * its own Box, so the card is a block on the page (`data-block="demand"`,
 * BLOCK FLOOR counts it) that the census's city rows do not list; its form
 * to the checkers is `bento-metric`.
 */
function Demand({ demand }: { demand: CityDemandData | null }) {
  if (!demand) return null;
  return (
    <BentoMetric
      id="demand"
      icon="market-size"
      kicker={COPY.cityDemand.kicker}
      sample={demand.sample}
      figure={demand.figure ?? undefined}
      withheld={demand.withheld ?? undefined}
      basis={demand.basis ?? undefined}
      foot={demand.foot ?? undefined}
    />
  );
}

/**
 * What customers earn, `07 earnings` (MODEL.md 8.3; the same dispatch): the
 * range strip, linear, three marks: the country's bottom tenth and top tenth
 * as the outer marks, the city's own typical pay from the one income builder
 * as the middle mark, the lead, the card's 30 in ink (M3; the strip's own
 * law since this dispatch took its lead rung to the focal). The basis says
 * whose each figure is, M5's words. The rows come from range_rows.ts
 * (`buildCityEarningsStrip`), counted 2026-09-18: 152 cities draw the three
 * marks, 84 the typical alone over a country with no deciles (Abidjan), 16
 * the typical alone because it sits outside the country's deciles (the two
 * bases meeting, item 24), each with its note; a city with no typical of its
 * own would draw the country's whole strip and say so (none today). The
 * kicker is the country's words (M16). Right of the band: the dot family's
 * column (M10). Quiet: the accent the old strip's typical wore is gone.
 */
function Earnings({ strip }: { strip: CityEarningsData | null }) {
  if (!strip) return null;
  return (
    <Box id="earnings">
      <Rail icon="spread" kicker={COPY.cityCustomers.kicker} sample={strip.sample} />
      <RangeStrip marks={strip.marks} scale="linear" fmt={usd} basis={strip.basis} note={strip.note} extra={strip.extra} />
    </Box>
  );
}

/**
 * Trades with local figures, `09 trades` (MODEL.md 8.3; plan step 32, fifth
 * dispatch, 2026-09-18): THE TRADE ROWS, PART 5's own grammar for a trade
 * ("a 28px icon tile, the trade name at 14px weight 500, ... an arrow, a
 * hairline between rows, equal heights, seven rows maximum. Never a chip,
 * never a wrapped ragged row"; PART 9 clause 21 bans the wrapped chips this
 * card drew until today). One row per trade, full card width at every width:
 * the trade's own icon tile (the trade family of icons), its name, and the
 * arrow at the right edge with a `--c-soft` hover, because every row
 * navigates to the trade's page under this city (PART 5, LINKS LOOK LIKE
 * LINKS). NO FIGURE PER ROW: take-home and margin are stripped upstream by
 * the 2026-07-11 ban (adapt_city.ts maps the list down to name, slug and
 * href), so the row is wordless past its name and the landing page answers
 * (CROSS-PAGE-COHERENCE M23's handoff note). The one line is THE FOOT, in the
 * coverage form PART 7 puts there, the model's own words: "Local figures for
 * {n} trades. Which is easiest to open here is not yet known.", the count as
 * a word. No headline figure: the form holds none.
 *
 * SEVEN IS THE CAP AND THE SLATE HOLDS IT: the eight everyday trades
 * (adapt_city.ts EVERYDAY_TRADES) minus pharmacies, which resolve no cell on
 * any city (city_board.ts POPULAR_TRADES: "Pharmacies are intentionally
 * absent"), are seven, so no city can hand this card an eighth row today and
 * nothing here truncates. The day pharmacies resolve, "seven max" and "never
 * quietly shortened" (PART 7) meet on this card and the model decides; a
 * slice here would be the silent drop the model forbids. Under four trades
 * the card self-omits (8.3: "null under four trades elsewhere"; the adapter
 * leaves `trades_here` undefined under four too). COUNTED 2026-09-18 through
 * the adapter's own path on all 252 listed cities: 101 draw the card (51
 * with seven trades, 35 with six, 15 with five; 151 hold none), London 7 of
 * its 8 local rows, Berlin 7 of 7, New York 6 of 9; 8.3's "London 8, New
 * York 9, Berlin 7" are the local rows before the everyday filter.
 *
 * THE ORDER IS THE SLATE'S, the same on every city: the everyday set's own
 * order (restaurants, grocery, hairdressers, gym, auto repair, cafes, bars),
 * never the adapter's, which sorts by owner take-home, a figure this card may
 * not print; an order set by a banned figure is that figure leaking through
 * the row order, and a reader who cannot see the basis of an order reads it
 * as a ranking (the chips stood in take-home order for that reason without
 * anyone deciding it).
 *
 * EQUAL HEIGHTS BY CONSTRUCTION, and the rows share the band's height the way
 * RankedBars' table rows do (`flex-1` on the grid, rows on `minmax(2.75rem,
 * 1fr)`, MarkList's declared row): beside the districts table the seven rows
 * stretch to the partner's height and the hairlines spread with them, so the
 * card never stands short with a blank under its last row. The rows declare
 * their count (`data-expect-rows`) and mark every drawn row (`data-row`), so
 * ROWS CUT proves every row draws at every width; the name carries
 * `data-label` for ROW SENTENCE, which reads the taxonomy's "Cafés & coffee
 * shops" as four words here as it does on the country's money card (a copy
 * fault in the trade's own name, recorded, never shortened by this card).
 *
 * The opener is `Rail`, PART 7's one opener style; the `Head` this card wore
 * was the page's alternation between two opener styles inside one band.
 * Hover is INK on the name and `--c-soft` on the row, never the accent (§37).
 */
/* slug -> the trade's icon tile, the trade family (added 2026-07-08). Every
   everyday trade that resolves a cell has one; an unknown slug takes the
   street rather than no tile, so every row keeps one geometry. */
const TRADE_ICON: Record<string, AtlasIconId> = {
  "restaurants": "trade-restaurant",
  "grocery-stores": "trade-grocery",
  "pharmacies": "trade-retail",
  "hairdressers-beauty": "trade-salon",
  "sports-fitness": "trade-gym",
  "auto-repair-shops": "trade-auto",
  "cafes-coffee-shops": "trade-cafe",
  "bars-nightclubs": "trade-bar",
};
const SLATE_ORDER: string[] = [...EVERYDAY_TRADES];
const hasTradesHere = (d: any) => (d?.trades_here?.list?.length ?? 0) >= 4;
function TradesHere({ d }: { d: any }) {
  const list: Array<{ name: string; slug: string; href: string }> = d.trades_here?.list ?? [];
  if (list.length < 4) return null;
  const rank = (slug: string) => { const i = SLATE_ORDER.indexOf(slug); return i < 0 ? SLATE_ORDER.length : i; };
  const rows = list.slice().sort((a, b) => rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name));
  const foot = COPY.cityTrades.foot.replace("{n}", countWord(rows.length));
  return (
    <Box id="trades" data-form="trade-rows" className="flex flex-col">
      <Rail icon="high-street" kicker={COPY.cityTrades.kicker} />
      <div className="grid flex-1 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={rows.length} style={{ gridAutoRows: "minmax(2.75rem,1fr)" }}>
        {rows.map((t) => (
          <a
            key={t.slug}
            href={t.href}
            data-row={t.slug}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 no-underline transition hover:bg-[var(--c-soft)]"
          >
            <Ico id={TRADE_ICON[t.slug] ?? "high-street"} />
            <span data-label className="min-w-0 truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{t.name}</span>
            <span aria-hidden="true" className="pr-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">&#8594;</span>
          </a>
        ))}
      </div>
      <p className="mt-2.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot}</p>
    </Box>
  );
}

/* CityPeers: THE PEERS TABLE ON THE COMPARISON ARCHETYPE (city:peers, the build
   loop's run 22, 2026-09-06). The country page's form, the one the founder
   called one of the best versions he had seen (2026-08-30): the places as rows
   with a flag each, the measures as columns, the home row marked, the phone form
   stacked and never scrolling sideways. The city and its three peers (the peer
   set is three roles by his 2026-06-08 rule, a competitor, the rival and one
   abroad, so "four peers" resolve on no city and every listed city draws four
   rows; counted 2026-09-18, 252 of 252 with all three columns held), three
   columns: the cost of living (the absolute index, a leading metro at 100),
   the typical pay (the one income builder's figure since the fourth dispatch,
   the masthead's own), visitors a year. Full width by the wide-table sanction,
   as on the country page: 8.3's `11 peers`, the seam of turns two and three,
   the page's second full width (R1).

   THE WORDS ARE 8.3's, corrected in plan step 32's fifth dispatch (2026-09-18,
   copy.ts `cityPeers`): the kicker "Against other cities" (the live "Peer
   cities, side by side" was five words, over PART 7's cap), the column heads
   "Cost of living" (the comparative "Cheaper to live" went: the column prints
   the absolute index, and a comparison table never prints a comparison) and
   "Typical pay" (the label follows the figure the column has printed since the
   fourth dispatch). The rows never navigate (M23: CompareTable draws no href
   in either form, read before it was asserted; the trade rows above are the
   doors out of this turn). The better value by weight and a tick, terracotta
   never.

   THE CENSUS NOTE. His 2026-09-07 "two more metrics" has one honest candidate
   for a fourth column, prime shop rent a square metre a year off `realestate`
   (252 of 252, 133 held), the cost this table lacks; it is RECORDED here and
   NOT BUILT, the 11 brief's decision (8.3, the row's own words: "proposed to
   the 11 brief, not decided here"). THE NAME COLUMN IS THE 1.2-SHARE the laws
   list reads against PART 5's 22ch: CompareTable.tsx sizes it to 1.2 of a
   1.2-plus-columns share (28.6 percent with three columns, 295px of the
   1032px table at 1280, 194px of the 680 at 768) while the longest name in
   London's set, "Los Angeles" with its flag, needs 123px, so the first figure
   stands 386 to 432px from a short name at 1280 and 247px at 768, over the
   rule's third of the card (357 and 240). PART 5's `minmax(0,22ch)` on that
   column (158px at the table's 12px) would move every first figure 91px left
   at 1280 and 24px at 768 (the column gives up 137px and 36px, the three
   value columns gain a third of it each), so the same rows would read about
   295 to 341px and 223px, under the thresholds by 16 to 62px and by 17px,
   and change nothing a reader sees: a figure right-aligned under its head in
   a table three columns wide still sits far from a short name. Where
   a comparison table's figures stand under PART 5's row law (which was
   written for label, figure, track) is a form decision on a card shared with
   the country page and praised there, so the five rows are recorded for the
   controller with these numbers rather than moved by this dispatch. */
function CityPeers({ d }: { d: any }) {
  const t = buildCityPeerTable(d);
  if (!t) return null;
  return <CompareTable id="peers" kicker={COPY.cityPeers.kicker} icon="benchmark" entityHead={t.entityHead} rows={t.rows} columns={t.columns} caveat={t.caveat} />;
}

/* ================= TURN THREE , WHAT THE PLACE IS LIKE ================= */
/**
 * Dealing with people, `12 character-people` (MODEL.md 8.3; plan step 32,
 * sixth dispatch, 2026-09-18): the spectra table at full form, six traits,
 * the poles pinned to the track, the terracotta dots his 2026-08-30
 * exemption (the archetype stamps `data-founder-accent`, uncounted). ONE
 * CHARACTER TABLE ON THE CITY PAGE: 8.3 names the people table alone, and
 * the state table (`#character`, which drew New York's own six state reads
 * and nothing on the other 251, since only that city's entry in the city
 * signature file holds government reads) left this page with this dispatch;
 * 8.2's `14 character-state` is the country's. The rows come from
 * character_rows.ts (`buildCityPeopleTable`): the city's own read where the
 * city file holds one, the country's where it does not, and the basis under
 * the rows says which and says modelled, because the sample mark is off
 * site-wide (counted 2026-09-18: 252 draw six rows; New York all its own,
 * 36 mixed, London three of six, 215 the country's throughout). The foot is
 * the city's own share born abroad where held (55 cities), never the
 * country's. Quiet: turn three carries zero accent.
 */
function CharacterPeople({ people }: { people: CityPeopleTable | null }) {
  if (!people) return null;
  return (
    <Box id="character-people">
      <Rail icon="who-for" kicker={COPY.character.people.kicker} sample />
      <SpectraTable rows={people.rows} dot={people.dot} foot={people.foot} basis={people.basis} />
    </Box>
  );
}

/**
 * What locals know, `13 locals` (MODEL.md 8.3; the same dispatch): THE
 * PAGE'S ONE PROSE SECTION (R9), and NO CITY HOLDS AUTHORED NOTES (the UK's
 * four are the country's, item 6), so the card ships present as the drawn
 * blocked seat on every city: the kicker, the one stated line in the site's
 * idiom (M19, the same three strings as the country's seat on 194
 * countries), the requirement in the foot, no figure, no sample. Never the
 * country's notes under the city's kicker. The old `Locals` (a `Head` over
 * a disclosure of `d.locals_intel`) drew nothing on any live city, because
 * the adapter omits the block for all 252; it printed the illustrative
 * seed's three London bullets on the dev route alone, and it is retired
 * with the seed's block. The day the notes land the NoteList takes this
 * seat with `editorial` on (`data-editorial="1"`).
 */
function LocalsSeat() {
  return <BlockedSeat id="locals" icon="locals-know" kicker={COPY.blocked.locals.kicker} line={COPY.blocked.locals.line} foot={COPY.blocked.locals.foot} />;
}

/**
 * The city's neighbourhoods, `14 neighbourhoods` (MODEL.md 8.3; the same
 * dispatch): the card pager, four a row, each card a name and an arrow to
 * the district's own page where one exists (London's seven since plan step
 * 35, 2026-09-19; hood_rows.ts says how) and to the city's neighbourhoods
 * page at the district's own anchor otherwise, NO IMAGE
 * (`images="none"`, and the harness asks for none), no sub-line, no
 * figure. The rows come from hood_rows.ts (`buildCityNeighbourhoods`) in
 * the file's own order. TWO STATES: the 43 cities on a curated scheme draw
 * the pager (London seven, New York ten); the 209 on the compass
 * placeholder draw the blocked seat, because a placeholder name never
 * prints (clause 32, R11), its line naming the city and its foot item 30.
 * The foot under the pager is the coverage form, the count as a word.
 */
function Neighbourhoods({ hoods }: { hoods: CityNeighbourhoodsData | null }) {
  if (!hoods) return null;
  if (!hoods.cards) {
    return <BlockedSeat id="neighbourhoods" icon="neighborhood" kicker={COPY.blocked.cityNeighbourhoods.kicker} line={hoods.seatLine ?? COPY.blocked.cityNeighbourhoods.line} foot={COPY.blocked.cityNeighbourhoods.foot} />;
  }
  return (
    <Box id="neighbourhoods">
      <Rail icon="neighborhood" kicker={COPY.cityNeighbourhoods.kicker} />
      <CardPager cards={hoods.cards} allHref={hoods.allHref} allLabel={COPY.cityNeighbourhoods.allLabel} prevLabel={COPY.cityNeighbourhoods.prev} nextLabel={COPY.cityNeighbourhoods.next} images="none" />
      {hoods.foot ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{hoods.foot}</p> : null}
    </Box>
  );
}

/**
 * Residents and visitors, `15 season` (MODEL.md 8.3; the same dispatch): the
 * KvGrid pair, two shares of a hundred in ink, NOT the proportion bar (a
 * fourth bar-family card, and R7 gives B6 no net-less mode). The kicker
 * changes from "How seasonal it is": an annual share is not a season (the
 * old name returns the day a month shape exists, item 29). The rows come
 * from fact_rows.ts (`buildCitySeason`): the shard's own footfall field
 * first (251 of 252: 12 held, 239 modelled, the foot saying so), the slope
 * over arrivals where the shard holds no row (London, 84 and 16, the foot
 * saying so), a clamp or a missing count withheld with its line (no city
 * today). No cell at 30: a pair of siblings takes the head rung, and FOCAL's
 * zero finding on this card stands as it does on the glance. The old
 * `SeasonSplit` (the stacked bar off the adapter's `demand` block, the
 * page's first I3) is retired with the block.
 */
function Season({ season }: { season: CitySeasonData | null }) {
  if (!season) return null;
  return (
    <Box id="season">
      <Rail icon="seasonality" kicker={COPY.citySeason.kicker} sample={season.confidence !== "measured"} />
      <KvGrid cells={season.cells} />
      {season.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{season.withheld}</p> : null}
      {season.basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{season.basis}</p> : null}
      {season.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{season.foot}</p> : null}
    </Box>
  );
}

/* ================= THE EXIT ================= */
/* CityClose: THE TERMINUS (city:close, the build loop's run 19, 2026-09-06;
   MODEL.md 8.3's `16 close`, checked against the row on plan step 32's sixth
   dispatch, 2026-09-18). Three doors out of the page on the terminus
   archetype, as built in close_rows.ts (M21): every district of the city, to
   its neighbourhoods page; the country page, up one altitude, "Open a
   business in {country}"; and the compare pill, "Compare {city} with other
   cities". No pricing door (the row's own words). WHAT CHANGED AGAINST THE
   ROW: the first door named the lightest-rent district on London ("Start in
   {district}"), the cheapest member featured for being the cheapest, his
   2026-09-10 ruling's fault in a door; it reads "Every district of {city}" on
   every city now. WHAT THE ROW NAMES AND THE SITE DOES NOT HOLD: the
   last-checked line and the report-an-error link "on one row under a
   hairline" (8.1's furniture, restored on the country's `20` the same way):
   no city fact carries a year (item 26) and no route exists for a correction
   (the old kit's `OneThing` printed "Last checked" and "Flag it." from props
   no caller ever passed), so neither is drawn here or on the country's close,
   and both wait on the controller. The page's third full width (R1). */
function CityClose({ d }: { d: any }) {
  const doors = buildCityCloseDoors(d);
  if (doors.length === 0) return null;
  return (
    <div data-terminus className="mt-8">
      <Box id="close">
        <Terminus kicker={COPY.close.kicker} doors={doors} />
      </Box>
    </div>
  );
}

/**
 * The city spine page body. `data` defaults to the bundled illustrative seed so the dev
 * route (page.tsx) renders it unchanged; the live metropolis route passes the real-data
 * seed from buildSpineCitySeed. Every section null-guards its own data, so an omitted
 * field renders nothing.
 */
export function SpineCityBody({ data = spineCitySeed }: { data?: any } = {}) {
  const d = data ?? spineCitySeed;
  const slug: string | undefined = typeof d.meta?.slug === "string" ? d.meta.slug : undefined;

  /* WHO IS HOME, ASKED ONCE, FROM THE BUILDERS THE CARDS DRAW FROM (the
     country view's idiom). A band is drawn when either of its cards exists and
     not otherwise, so a card that self-omits never leaves an empty grid with a
     rung of air behind it. The two seats read the city list and the city shard
     by the seed's slug; the strips, the districts, the peers and the character
     tables read the seed the adapter built. */
  const glance = slug ? buildCityGlance(slug) : null;
  const seat = slug ? buildCitySeat(slug) : null;
  const premises = slug ? buildPremisesBento(slug) : null;
  const living = slug ? buildCityLiving(slug) : null;
  const runway = slug ? buildCityRunway(slug) : null;
  const demand = slug ? buildCityDemand(slug) : null;
  const earnings = slug ? buildCityEarningsStrip(slug) : null;
  const districts = buildCityDistrictBars(d) != null;
  const trades = hasTradesHere(d);
  const people = slug ? buildCityPeopleTable(slug) : null;
  const hoods = slug ? buildCityNeighbourhoods(slug) : null;
  const season = slug ? buildCitySeason(slug) : null;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      {/* `00 masthead`, FULL WIDTH, the page's only 40 (8.3, loud 1): the answer
          "Average customer pay" off the city list's mean, the archetype's own hero
          band carrying the attribute the full-width gate reads. */}
      <CityHero d={d} />
      {/* `01 glance | 02 among-cities`, 1-1, the opening's one band (8.3; plan
          step 32, first dispatch): what the city is in figures, and where it
          stands among the cities, both quiet, both on KvGrid while their
          clicked forms wait. Both cards exist for every covered city (the
          permit days, the business count, the metro GDP and the cost of living
          are held for all 252), so the band holds two children; a city missing
          one would show the survivor alone, honestly, as LONE CARD. */}
      {glance || seat ? (
        <Band split="1-1">
          <Glance glance={glance} />
          <AmongCities seat={seat} />
        </Band>
      ) : null}
      {/* CHAPTER TURN ONE (8.3, "What it costs to open, and to run"): the kit's
          Movement, the muted index and one plain heading, no eyebrow and no icon
          (8.4). 48 above and 12 below, the next Band's own 32 absorbing the 12
          by margin collapse. The opening above carries no break (PART 1). */}
      <Movement index="01" heading={COPY.chapters.costs} />
      {/* `04 premises`, the bento, its own band, loud 2 on the prime rent cell
          (8.3): the cluster IS the band, never a child of Band, four cells
          tiling 3 by 2 at 1280, 2 by 3 at 768, one column under. It stands
          between the two fact-grid bands, so no two adjacent bands share a
          form (M1). Built for every listed city whose shard loads, 252 today. */}
      <Premises bento={premises} />
      {/* `05 living | 06 runway`, 1-1 (8.3; plan step 32, third dispatch): the
          page's second one-form-two-readings band, under the same R8 reading
          as `01 | 02` (the fact grid, and the fact grid with a focal), both
          on KvGrid while their clicked forms (candidates 1 and 3) wait, both
          quiet, ink. What living here costs beside a year of one-bed rent as
          a share of a year of typical income, the income the one absolute the
          living card does not hold (M1). Both cards exist for every covered
          city (252 of 252 hold the four living figures and the salary); on
          the thirty cities where the share is withheld the ratio card prints
          the income under its withheld line, so the band holds two children
          everywhere. MEASURED after it was seated, on London, Frankfurt and
          Abidjan with the probe and the page filter: at 1280 the band stands
          level at 520 by 243 (the living card's two rows of cells want 242,
          the ratio card's one row 166, or 211 under Abidjan's withheld
          line), at 768's equal halves 344 by 274 (273 against 198 or 243),
          at 375 each card at its own height, 274 and 199 (Abidjan 244); the
          ratio card's stretch is 77 pixels at most, under the filter's 120
          floor, and the filter finds no hole in either card at any width.
          The old kit cards stood level at 244, so the band's height did not
          move. */}
      {living || runway ? (
        <Band split="1-1">
          <Living living={living} />
          <Runway runway={runway} />
        </Band>
      ) : null}
      {/* CHAPTER TURN TWO (8.3, "Where to open it, and what to open"): the market
          sized before the street is picked. */}
      <Movement index="02" heading={COPY.chapters.where} />
      {/* `08 demand | 07 earnings`, 1-1, demand LEFT and the strip RIGHT
          (8.3: `07` is the dot family, right column, M10; plan step 32, fourth
          dispatch, 2026-09-18): what the whole city spends beside what one
          customer earns, the market sized before the street is picked, both
          quiet, both cards built for every listed city (the spend is held or
          withheld with its line for 252, the typical for 252), so the band
          holds two children everywhere. THE PAIR HOLDS, MEASURED after it was
          seated on London, Frankfurt and Abidjan with the page filter and a
          band probe at 1280, 768 and 375: at 1280 both cards stand level at
          520 by 212 on London and Frankfurt (the strip's own height: a Rail,
          the 116 of a strip holding a lead, the basis) and 520 by 174 on
          Abidjan (the strip's typical alone, its two notes); at 768's equal
          halves 344 by 212, 212 and 192; at 375 each card at its own height,
          the spend card 136 (London's withheld line), 159 and 159 under the
          strip's 212, 212 and 192. Zero holes in either card at any width on
          the three cities. The old spend card could not be seated at any
          split because its one figure sat in the top left corner of a
          stretched box with three quarters of it empty; BentoMetric puts the
          opener at the top, the basis at the foot and the 30 centred in what
          is left (Frankfurt's air at 1280: 26 above the opener, 21 under the
          foot), so the stretched card reads as composed. */}
      {demand || earnings ? (
        <Band split="1-1">
          <Demand demand={demand} />
          <Earnings strip={earnings} />
        </Band>
      ) : null}
      {/* `03 districts | 09 trades` (8.3): rent by district, the page's one
          fill-bar card, LEFT; the trades with local figures RIGHT, at 2-1
          (plan step 32, fifth dispatch, 2026-09-18; the measurements are in
          the dispatch's report and below). London alone draws `03` (8.3:
          LONDON ONLY); `09` draws on 101 of 252 cities (counted through the
          adapter's own path, 2026-09-18), so on 100 cities the band is the
          trade rows alone at the survivor's two thirds, LONE CARD by the
          rule, and on 151 it is absent. 8.3's "absent together on 249" was
          written before the count existed; the controller holds the pairing
          on those 100. */}
      {districts && trades ? (
        <Band split="2-1" stack="lg">
          <WhereToTrade d={d} />
          <TradesHere d={d} />
        </Band>
      ) : districts ? (
        <Band split="2-1" stack="lg">
          <WhereToTrade d={d} />
        </Band>
      ) : trades ? (
        <Band split="2-1" stack="lg">
          <TradesHere d={d} />
        </Band>
      ) : null}
      {/* `11 peers`, FULL WIDTH, the seam of turns two and three (8.3, R1). */}
      <CityPeers d={d} />
      {/* CHAPTER TURN THREE (8.3, "What the place is like"): zero accent from
          here to the exit. It draws whenever a card under it draws, and one
          always does: the locals seat stands on every city (item 6), so the
          heading never sits over nothing; the index stays "03" because the
          two turns above always draw. */}
      <Movement index="03" heading={COPY.chapters.place} />
      {/* `12 character-people | 13 locals`, 1-1 in 8.3 (plan step 32, sixth
          dispatch, 2026-09-18): the people table at full form beside the
          locals seat. THE PAIR CANNOT BE SEATED, MEASURED on London with the
          probe and the page filter at the 1-1 split: the six-row table
          stands 572 tall at 1280 (content 571) and the seat, a Rail, one
          line and a foot, wants 149, so stretched level it carries a 480 by
          420 blank inside its 480 by 532 card, the filter's WHITE SPACE red
          and the art-direction gate's E2 floor of 60 percent ink missed by
          forty points; no split in the closed set holds a 149-tall seat
          level with a 572-tall table (the seat's foot sits under its line by
          the seat's own law, so the air falls below it at any width). So
          each stands in its own band, the country's precedent for `12 money
          | 16 locals` on the 21 countries holding a drawn card beside a
          seated one: the table at the survivor's two thirds (693 by 572 at
          1280), the seat at two thirds at its own 150, LONE CARD twice,
          expected, until the notes land (item 6) or the composition
          re-decides the split; both bands stack until lg. */}
      {people ? (
        <Band split="2-1" stack="lg">
          <CharacterPeople people={people} />
        </Band>
      ) : null}
      <Band split="2-1" stack="lg">
        <LocalsSeat />
      </Band>
      {/* `14 neighbourhoods | 15 season`, 2-1, the neighbourhoods wide (8.3):
          the pager or its seat beside the two shares. Both cards exist for
          every listed city (the scheme for 252, the shares for 252), so the
          band holds two children everywhere; stacked until lg so the pager's
          cards keep a row of four at the wide side and the pair is never
          two slivers at 768. MEASURED after it was seated, the numbers in
          the dispatch's report. */}
      {hoods || season ? (
        <Band split="2-1" stack="lg">
          <Neighbourhoods hoods={hoods} />
          <Season season={season} />
        </Band>
      ) : null}
      {/* `16 close`, FULL WIDTH (8.3, R1): the exit carries no break (PART 1). */}
      <CityClose d={d} />
    </main>
  );
}
