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
import { Movement, Box, Rail, Ico, SampleTag, Band, usd, Fig } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { EVERYDAY_TRADES } from "@/lib/spine/adapt_city";
import { countWord } from "@/lib/spine/district_rows";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { buildCityCloseDoors } from "@/lib/spine/close_rows";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { MarkList } from "@/components/spine/archetypes/MarkList";
import { buildCityCrew, type CityCrewData } from "@/lib/spine/city_crew_rows";
import { buildCityTexture, type CityTextureData } from "@/lib/spine/city_texture_rows";
import { buildCityPeopleTable, type CityPeopleTable } from "@/lib/spine/character_rows";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { SegmentBar } from "@/components/spine/archetypes/SegmentBar";
import { Ring } from "@/components/spine/archetypes/Ring";
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
import { HeroBoard } from "@/components/spine/archetypes/HeroBoard";
import { buildCityHeroBoard } from "@/lib/spine/city_hero_board";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import { GatesCard, MarketCard } from "./opening";
import { buildCityGates } from "@/lib/spine/city_gates_rows";
import { buildCityMarket } from "@/lib/spine/city_market_rows";
import { buildCityCalendar, type CityCalendarData } from "@/lib/spine/city_calendar_rows";
import { MonthBars } from "@/components/spine/archetypes/MonthBars";
import { Crumbs } from "@/components/spine/Crumbs";
import { buildCityCrumbs } from "@/lib/spine/crumb_rows";
import { WhereToTrade } from "./where-to-trade";
import { buildCityDistrictBars } from "@/lib/spine/district_rows";
import { Premises } from "./premises";
import { buildPremisesBento } from "@/lib/spine/premises_bento_rows";
import { COPY } from "@/lib/spine/copy";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS, declared where they are lit or held (MODEL.md 8.3's
 * seat table, "Loud today: 2 of 3"; plan step 40, 2026-09-19). Seat one is the
 * masthead's AnswerCard in ./masthead.tsx (`id="city-take"`, `tone="accent"`),
 * seat two the premises cluster's rent cell in ./premises.tsx (the one
 * `accent` in the cluster, unlit where withheld), seat three turn two's, held
 * empty until a per-trade figure exists that is not a banned one. The table's
 * word for seat one, SPENT, is this vocabulary's LIT. The census prints this
 * ledger; the loud-seats gate holds the render to it. Literals only, read from
 * source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 masthead", id: "city-take", figure: "the average customer pay, 40", state: "LIT", condition: "8.3: SPENT; real for 252 of 252 (avg_gross_salary_usd_year, city_list_v1.json), the one figure every card under it is read against, the page's only 40" },
  { seat: 2, card: "04 premises", figure: "the prime shop rent cell, `--terra-text`", state: "LIT", condition: "8.3, M9: lit in the held and the modelled states by the role it plays (the shop's biggest cost, the turn's first figure), unlit only where withheld (the cell's data-withheld-line); one loud cell a cluster, the count cell accent={false}" },
  { seat: 3, card: "turn two, `03` or `09`", figure: "the leading trade figure", state: "HELD EMPTY", condition: "8.3: named; a per-trade figure that is not one of the banned ones, or ruling 30 lifting the ban; the day both figures exist one takes this seat and the other stays ink, decided then against the figures" },
] as const satisfies readonly LoudSeat[];

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
 *
 * THE COST OF LIVING IS THE SEGMENTED BAR ON THE CITY SCALE since the evening
 * of 2026-09-20 (plan step 4 of that evening): his ruling on the country's
 * running-costs card, "cost of living on a scale, the cheapest city 1, the
 * dearest 100, the city never named", applied at this altitude, where the
 * cell printed the raw index "where New York is 100". The same `SegmentBar`
 * the country card draws, the same words (`COPY.runningCosts`), the figure
 * off `costOfLivingOnCityScale` over the same file's ends; the metro GDP
 * stays the grid's one cell, under the bar (the bar first: the card's kind
 * to the checkers is its first archetype, and the drawing is what the card
 * is). The card is the level's visual (his clause 53: the glance beside it
 * is figures). Exported for the sheet, which draws the page's own card and
 * never a copy of its markup.
 */
export function AmongCities({ seat, id = "among-cities" }: { seat: CitySeatData | null; id?: string }) {
  if (!seat) return null;
  const living = seat.figures.living;
  return (
    <Box id={id}>
      <Rail icon="vs-world" kicker={COPY.citySeat.kicker} sample={seat.confidence !== "measured"} />
      {/* No unit after the figure: "of 100" stands on the premises bento's empty-shops cell in the same first screen, and the art-direction gate's H4 reads a phrase twice there; the basis under the bar says the scale's ends. */}
      {living != null ? <SegmentBar label={COPY.runningCosts.rows.living} value={living} figure={String(living)} unit="" /> : null}
      {seat.cells.length > 0 ? <div className={living != null ? "mt-3" : ""}><KvGrid cells={seat.cells} /></div> : null}
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
/**
 * Rent against income, `06 runway`: THE SHARE IS THE RING since the evening of
 * 2026-09-20 (plan step 4 of that evening; Ring.tsx, his B4 and the gold
 * standard's B31): a year of one-bed rent as a share of a year's typical
 * income is a share of a whole, and his ruling of 2026-09-19 draws every
 * share of a whole. The ring in ink (quiet: the city's three accents are
 * spent above), the figure inside it, the typical income and its unit as
 * the words beside the ring with the basis and the foot under them; the
 * grid that held the two cells leaves this card (the page's fourth kv-grid,
 * clause 55's KIND REPEATED). Where the share is withheld (over 100, or no
 * rent on file) the card keeps the income cell on the grid under the line,
 * the builder's shape. The card is its level's visual (clause 53: the living
 * costs beside it are figures). Exported for the sheet.
 */
export function Runway({ runway, id = "runway" }: { runway: CityRunwayData | null; id?: string }) {
  if (!runway) return null;
  const pct = runway.figures.pct;
  const income = runway.cells.find((c) => c.key === "income");
  if (pct == null || !income) {
    return (
      <Box id={id}>
        <Rail icon="commercial-rent" kicker={COPY.cityRunway.kicker} sample={runway.confidence !== "measured"} />
        <KvGrid cells={runway.cells} />
        {runway.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.withheld}</p> : null}
        <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.basis}</p>
        {runway.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.foot}</p> : null}
      </Box>
    );
  }
  return (
    /* The spare height the level lends this card splits above and below the ring's row (the trade's `08 clears`, BentoMetric's rule), so the foot is never a blank. */
    <Box id={id} className="flex h-full flex-col [container-type:inline-size]">
      <Rail icon="commercial-rent" kicker={COPY.cityRunway.kicker} sample={runway.confidence !== "measured"} />
      <div className="grid flex-1 grid-cols-1 items-center gap-4 [@container(min-width:280px)]:grid-cols-[auto_minmax(0,1fr)]">
        <Ring value={pct} figure={`${pct}%`} caption={COPY.cityRunway.cells.share} />
        <div>
          <div data-row="income" className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{income.label}</div>
          <div className="fig mt-1 text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">
            {income.value}
            {income.note ? <span className="ml-1 text-[length:var(--t-micro)] font-normal normal-case tracking-normal text-[var(--c-muted)]">{income.note}</span> : null}
          </div>
          <p className="mt-3 max-w-[30ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.basis}</p>
          {runway.foot ? <p className="mt-1 max-w-[30ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{runway.foot}</p> : null}
        </div>
      </div>
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
 * BentoMetric draws its own Box, so the card is a block on the page
 * (`data-block="demand"`, BLOCK FLOOR counts it), which the census reads by
 * its id since 2026-09-24 (it read `<Box` alone before); its form to the
 * checkers is `bento-metric`.
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
    /* The strip centred in the height its level lends the card (the trade's worth card's composition, 2026-09-18): on the level of three it stands 211 in 253 at 1280, and the air splits above and below the strip instead of piling at the foot. */
    <Box id="earnings" className="flex h-full flex-col">
      <Rail icon="spread" kicker={COPY.cityCustomers.kicker} sample={strip.sample} />
      <div className="flex flex-1 flex-col justify-center">
        <RangeStrip marks={strip.marks} scale="linear" fmt={usd} basis={strip.basis} note={strip.note} extra={strip.extra} />
      </div>
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
/* A seat's line names the city, the way the neighbourhoods seat's does
   (hood_rows.ts): `{city}` filled from the seed's own display name, the
   masthead's. The seed always carries one on the spine (city_hero_facts
   returns null without it); the fallback keeps the line a sentence. */
const seatLine = (line: string, d: any) => line.replace("{city}", typeof d?.meta?.city === "string" && d.meta.city ? d.meta.city : "this city");
/* The two seats of the `03 | 09` band (QUEUE launch:city-seats-off-london,
   2026-09-19): the drawn cards' own ids, icons and kickers, so the block
   keeps one name whether it is drawn or seated; the line names the city. */
export const DistrictsSeat = ({ d }: { d: any }) => <BlockedSeat id="districts" icon="best-areas" kicker={COPY.blocked.cityDistricts.kicker} line={seatLine(COPY.blocked.cityDistricts.line, d)} foot={COPY.blocked.cityDistricts.foot} />;
export const TradesSeat = ({ d }: { d: any }) => <BlockedSeat id="trades" icon="high-street" kicker={COPY.blocked.cityTrades.kicker} line={seatLine(COPY.blocked.cityTrades.line, d)} foot={COPY.blocked.cityTrades.foot} />;
function TradesHere({ d }: { d: any }) {
  /* `lands` is the adapter's declaration of what each row promises (adapt_city.ts, the trade page's own answer), stamped here and never chosen here. */
  const list: Array<{ name: string; slug: string; href: string; lands?: string }> = d.trades_here?.list ?? [];
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
            data-lands={t.lands}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 no-underline transition hover:bg-[var(--c-soft)]"
          >
            <Ico id={TRADE_ICON[t.slug] ?? "high-street"} />
            <span data-label className="min-w-0 truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{t.name}</span>
            <span aria-hidden="true" className="pr-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">&#8594;</span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot}</p>
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
  return <CompareTable id="peers" kicker={COPY.cityPeers.kicker} icon="benchmark" entityHead={t.entityHead} rows={t.rows} columns={t.columns} caveat={t.caveat} inBand />;
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
/**
 * WHAT THE CREW COSTS, `20 crew` (city_crew_rows.ts, 2026-09-23, brief row Y3):
 * the five roles a small business hires and what each is paid a month here,
 * dearest first, with the set's own middle as the card's one figure at 30.
 *
 * THE FORM IS THE LIST AND NOT BARS, and the builder's header says why: this
 * page spends both of the ranked-bars seats (clause 55), and a ranking without
 * its bars keeps its order and its figures, which is the answer the drawing
 * brief's own third question prescribes when the right form is taken.
 *
 * No mark column and no door: a role is not a place and lands nowhere.
 */
export function Crew({ crew }: { crew: CityCrewData | null }) {
  if (!crew) return null;
  const C = COPY.cityCrew;
  return (
    <MarkList
      id="crew"
      kicker={C.kicker}
      icon="wages"
      tagged={crew.tag !== "held"}
      headline={{ label: crew.middle.label, value: crew.middle.value }}
      basis={crew.basis}
      head={{ name: C.head.name, value: C.head.value }}
      rows={crew.rows.map((r) => ({ key: r.key, name: r.name, value: r.value }))}
      fmt={usd}
      withheld={0}
      oneColumn
      foot={crew.week ? { items: [{ figure: crew.week.figure, words: crew.week.words }] } : null}
    />
  );
}

/**
 * HOW THIS CITY DOES BUSINESS, `21 texture` (city_texture_rows.ts, 2026-09-23):
 * five of the city's own six texture reads, each a dot between two named ends,
 * on the spectra form his character tables have used since 2026-08-30.
 *
 * THE SECOND SPECTRA TABLE ON THE PAGE, and it is allowed to be: clause 55 caps
 * a kind at two, clause 64 keeps a level between them, and this one sits three
 * levels above `14 character-people`. The two must LOOK different, which is the
 * same clause's second half, so this one takes the ink dot and the body scale
 * and the people's table keeps the terracotta dot it has by his exemption.
 * ITS SUBJECT IS THE CITY'S OWN, which the people's table is not on 217 of 252
 * cities (it resolves the country's reads); that is the strongest argument for
 * the pair standing together on one page at all.
 */
export function Texture({ texture }: { texture: CityTextureData | null }) {
  if (!texture) return null;
  return (
    <Box id="texture">
      <Rail icon="honest-take" kicker={COPY.cityTexture.kicker} sample={texture.tag !== "held"} />
      {/* THE CARD'S ONE FIGURE stands where the spend calendar's swing stands,
          over the drawing and under the opener: a spectrum holds no figure of
          its own, and PART 4 gives every section card exactly one. */}
      <div className="mb-4">
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{texture.visits.label}</div>
        <Fig className="mt-1 block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{texture.visits.figure}</Fig>
      </div>
      <SpectraTable rows={texture.rows} dot="ink" scale="lead" basis={texture.basis} />
    </Box>
  );
}

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
/** The seat the page held until 2026-09-20 (the band's note); kept for the sheet's blocked-seat story and the day the notes land. */
export function LocalsSeat() {
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
  /* THE PLACEHOLDER SCHEME DRAWS NOTHING SINCE 2026-09-24 (the goal's A4b):
     the seat's "Not gathered yet" line stood on 209 cities, Manchester,
     Birmingham and Leeds among them; the season card beside it stands alone
     at two thirds (the band's rule). NeighbourhoodsSeat keeps the drawing
     for the sheet and the day the curated names land (item 30). */
  if (!hoods.cards) return null;
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
/**
 * WHEN THIS CITY SPENDS, `19 calendar` (2026-09-23, brief NEW-SECTIONS row Y1;
 * the builder's header names the field and its coverage). Twelve columns from
 * the city's own demand calendar, modelled on 251 cities and drawn by nothing
 * until now, with the swing as the card's one focal; withheld on London,
 * whose twelve are the bank's one placeholder calendar (2026-09-23 night).
 *
 * SEATED AT 2-1 BESIDE THE EARNINGS STRIP since the afternoon of 2026-09-23.
 * The morning's seat, full width and outside a band, was his banned full
 * width (2026-08-25), counted by `verify_full_width_sitewide`; the level's
 * comment in the view carries the measurement.
 */
export function SpendCalendar({ calendar, id = "calendar" }: { calendar: CityCalendarData | null; id?: string }) {
  if (!calendar) return null;
  const C = COPY.cityCalendar;
  return (
    <Box id={id} className="[container-type:inline-size]">
      <Rail icon="seasonality" kicker={C.kicker} sample />
      {/* THE HEAD GOES TWO ABREAST, the swing on the left and the two lines of
          words on the right (2026-09-23 afternoon, the same move RankedBars
          made the same day for the country's spend card). Stacked they cost
          the card 48px of height it could not afford once it was paired: on
          its level the strip beside it wants 211 and the card wanted 331, and
          clause 52 reds a card whose ink stops more than 48px above its floor.
          Side by side the head fills the width and the two cards stand level.
          THE CARD'S OWN WIDTH DECIDES, never the window. */}
      <div className="mb-4 gap-x-8 [@container(min-width:560px)]:grid [@container(min-width:560px)]:grid-cols-[auto_minmax(0,1fr)] [@container(min-width:560px)]:items-start">
        <div>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{C.swingLabel}</div>
          <Fig className="mt-1 block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{calendar.swing.figure}</Fig>
        </div>
        <div className="mt-2 [@container(min-width:560px)]:mt-0">
          <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{calendar.basis}</p>
          <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{calendar.foot}</p>
        </div>
      </div>
      <MonthBars points={calendar.months} />
    </Box>
  );
}

export function Season({ season, id = "season" }: { season: CitySeasonData | null; id?: string }) {
  /* A SHARE OF A WHOLE IS DRAWN (his ruling of 2026-09-19 on this very card:
     "residents and visitors, you have just slapped a percentage thing, no
     visualization"): the year's footfall as one segmented bar of 100 (his
     gold standard's B27, SegmentBar.tsx), the residents filled in the
     accent, the visitors the rest, the visitors' share named under the bar.
     The two cells stay in the builder for the gates that count the feed;
     the card draws the bar where both shares are held and the withheld line
     where they are not. */
  if (!season) return null;
  const r = season.figures.resident, v = season.figures.visitor;
  const drawn = r != null && v != null && Number.isFinite(r) && Number.isFinite(v);
  return (
    <Box id={id}>
      <Rail icon="seasonality" kicker={COPY.citySeason.kicker} sample={season.confidence !== "measured"} />
      {drawn ? (
        <SegmentBar label={COPY.citySeason.cells.residents} value={r} figure={`${Math.round(r)}%`} unit={COPY.citySeason.unit} rest={`${COPY.citySeason.cells.visitors} ${Math.round(v)}%`} />
      ) : null}
      {season.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{season.withheld}</p> : null}
      {/* The basis sentence is the bar's own words now ("Residents 84% of footfall", "Visitors 16%"); it prints only where the bar does not (his law of labels over sentences). */}
      {season.basis && !drawn ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{season.basis}</p> : null}
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
  const cityBoard = slug ? buildCityHeroBoard(slug) : null;
  /* `17 gates | 18 market` (opening.tsx), the two sections his "more sections" added from the shard, 2026-09-20 late evening. */
  const gates = slug ? buildCityGates(slug) : null;
  const cityMarket = slug ? buildCityMarket(slug) : null;
  /* The glance and the seat are read for the gates' sake and drawn by nothing since the board took their figures (the masthead's note). */
  const glance = slug ? buildCityGlance(slug) : null;
  void glance;
  const seat = slug ? buildCitySeat(slug) : null;
  void seat;
  const premises = slug ? buildPremisesBento(slug) : null;
  const living = slug ? buildCityLiving(slug) : null;
  const runway = slug ? buildCityRunway(slug) : null;
  const demand = slug ? buildCityDemand(slug) : null;
  /* The spend card draws only with its figure (the band's note under chapter two); a withheld line is not a card in front of him. */
  const demandDrawn = !!demand && demand.figure != null;
  const earnings = slug ? buildCityEarningsStrip(slug) : null;
  const districts = buildCityDistrictBars(d) != null;
  const trades = hasTradesHere(d);
  const people = slug ? buildCityPeopleTable(slug) : null;
  /* The peers table draws where the seed holds two rows and a column (peer_rows.ts); the band under chapter three is gated on it and the people table together. */
  const peersDrawn = buildCityPeerTable(d) != null;
  const hoods = slug ? buildCityNeighbourhoods(slug) : null;
  const season = slug ? buildCitySeason(slug) : null;
  /* `19 calendar` (2026-09-23): the city's own twelve months, held by 252 of 252 and read by nothing before this. */
  const calendar = slug ? buildCityCalendar(slug) : null;
  /* `20 crew` and `21 texture` (2026-09-23 evening): the five roles' pay and the
     city's own six texture reads, both held by 252 of 252 and read by nothing
     before this; each builder's header names its fields and what withholds it. */
  const crew = slug ? buildCityCrew(slug) : null;
  const texture = slug ? buildCityTexture(slug) : null;
  /* WHERE THE CALENDAR AND THE SPEND CARD ARE BOTH WITHHELD, the earnings strip
     is the living level's third card, the composition London stood on before
     the calendar arrived (measured green on 2026-09-20 evening). London is that
     city: its calendar is the one placeholder of 252 and its spend the set's
     one placeholder (DATA-REQUIREMENTS 23), and without this the strip would
     stand alone at two thirds in chapter two, a level with air beside it
     (clause 52). Found 2026-09-23 night, when the calendar stopped printing a
     placeholder. */
  const earningsOnLiving = !calendar && !demandDrawn && !!living && !!runway && !!earnings;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      {/* THE TRAIL BACK UP (Crumbs.tsx, 2026-09-22): the real hierarchy, every step resolved through page_targets.ts, the last step the page itself. */}
      <Crumbs items={buildCityCrumbs(slug)} />
      {/* `00 masthead`, FULL WIDTH, the page's only 40 (8.3, loud 1). SINCE THE
          EVENING OF 2026-09-20 THE BOARD OF HIS DESIGN, the country's hero at
          the city altitude (HeroBoard.tsx, city_hero_board.ts; his word after
          the push: the pages "cohesive, fitting to each other", and the London
          masthead as served stood with its right half blank): the flag and
          the city's name, the typical customer pay as the main figure off the
          one income builder, the placeholder picture in the centre, five of
          the city's own figures placed among the covered cities on the right
          with a level chip each. `01 glance` and `02 among-cities` DISSOLVE
          INTO IT, the country's own precedent on his word ("at a glance is
          irrelevant; among the countries bundled by category"): the glance's
          three cells and the seat's two figures are the board's rows, so
          neither card draws; their components and builders stay for the
          sheet and the gates, and the old answer card stands where the
          board cannot build (a city off the list). */}
      {cityBoard ? <HeroBoard id="city-take" board={cityBoard} answers={SURFACE_ANSWERS.city} /> : <CityHero d={d} />}
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
      {/* `17 gates | 18 market` AT 1-1 (2026-09-20 late evening, his "more
          sections" from what the file holds; opening.tsx): the city's own
          permits gate by gate LEFT, the table with the fee total at 30 in
          ink, and who is already trading RIGHT, his bars with each trade's
          tile and the market's figures behind his plus, the level's one
          visual. Both draw on every city whose shard holds the rows (London:
          five gates, six trades); a survivor stands alone at two thirds.
          Measured on London: 490 beside 491 at 1280; `stack="lg"` because at
          a tablet's halves the bars' head ("Densest trade 9.1") ran 39px past
          a 344 card, so each stands full width there at its own height.
          SEATED BEFORE THE LIVING LEVEL since the night of 2026-09-20 (his
          words on the market bento, clause 64: two drawings of one sort
          keep a level between them): the market's bars stood on the level
          right above the districts' bars; the living level now stands
          between them. Where a person expects them (clause 66): what the
          city charges to open, then who is already there, then what living
          here costs. */}
      {gates && cityMarket ? (
        <Band split="1-1" stack="lg">
          <GatesCard gates={gates} />
          <MarketCard market={cityMarket} />
        </Band>
      ) : gates ? (
        <Band split="2-1" stack="lg"><GatesCard gates={gates} /></Band>
      ) : cityMarket ? (
        <Band split="2-1" stack="lg"><MarketCard market={cityMarket} /></Band>
      ) : null}
      {/* THE STRIP JOINS THIS LEVEL WHERE THE SPEND CARD IS WITHHELD (2026-09-20
          evening, his words on the London page: a card that is one withheld
          sentence, "The spend is withheld: the figure on file for London is a
          placeholder", is a bland section in front of him, and the seated
          reading of 2026-09-08 he overruled on 2026-09-19 covers a withheld
          line as it covers a "not gathered" one). Where `08 demand` holds no
          figure (London alone today, item 23) the card does not draw. THE
          THIRD SEAT, since 2026-09-23: on the 251 cities whose spend is a
          figure it is the spend card (the calendar level below takes the
          strip); where the spend AND the calendar are withheld (London alone,
          both the bank's one placeholder of 252) it is `07 earnings`, `05 | 06
          | 07` at the kit's three thirds: the living cells, the ring, the
          strip; two visuals (clause 53). Measured on the fresh render, the
          numbers in the commit. */}
      {living && runway && demandDrawn ? (
        <Band split="1-1-1">
          <Living living={living} />
          <Runway runway={runway} />
          <Demand demand={demand} />
        </Band>
      ) : earningsOnLiving ? (
        <Band split="1-1-1">
          <Living living={living} />
          <Runway runway={runway} />
          <Earnings strip={earnings} />
        </Band>
      ) : living || runway ? (
        <Band split="1-1">
          <Living living={living} />
          <Runway runway={runway} />
        </Band>
      ) : null}
      {/* `20 crew | 21 texture`, 1-1 (2026-09-23 evening, on his "continue with
          the city page sections"). What five roles are paid a month here, and
          how the city deals: the two sections the city bank still held that
          nothing drew, that carry no coined index, no placeholder on the
          exemplar and no figure the page already prints. The builders' headers
          name their fields and their coverage.
          THEY ARRIVE AS A PAIR because one card cannot be seated at all: this
          page's band cards come in pairs on every city, and the twelfth breaks
          the level (the brief's section 6, learned the hard way this
          afternoon). The level stands in the first chapter, after what living
          costs and what the money lasts, because what the crew costs is the
          same question and the texture is what a person meets in the same week.
          The two new kinds are free on this page: the list of figures spends no
          ranked-bars seat (both are taken), and the spectra table is the
          page's second, three levels clear of `14 character-people` (clause
          64), with the ink dot against that table's terracotta so the pair
          looks different (clause 55). */}
      {crew && texture ? (
        <Band split="1-1">
          <Crew crew={crew} />
          <Texture texture={texture} />
        </Band>
      ) : crew ? (
        <Band split="2-1"><Crew crew={crew} /></Band>
      ) : texture ? (
        <Band split="2-1"><Texture texture={texture} /></Band>
      ) : null}
      {/* `19 calendar | 07 earnings`, 2-1 (2026-09-23 afternoon). THE CALENDAR
          DOES NOT STAND FULL WIDTH, and the reason is his, twice: "for every
          subsection that stretches left to right full width, I think we should
          ban it except hero section" (2026-08-25, carried in
          verify_full_width_sitewide's own header). It shipped full width this
          morning and the sitewide gate counted it, which is how the rule was
          found again.
          THE LEVEL IS THE ONLY ONE AVAILABLE, and that is arithmetic, not
          taste: without the calendar this page's band cards come in pairs on
          every city, so a twelfth card cannot be added without breaking a
          level and re-pairing. The calendar's nearest partner by height is the
          earnings strip (331 against 254 at 1280 on London), so the two take
          one level, the twelve columns on the wide side by 8.4 rule 1, and the
          strip takes the slack inside its own card the way RankedBars' rows do.
          WHAT MOVED WITH IT: `08 demand` was the earnings strip's partner in
          chapter two on the 251 cities that hold a spend figure; it joins the
          living level as its third, where it is among the other money-of-the-
          city cards, and chapter two now opens on the districts and the trades,
          which is what "where to open it" means. ON LONDON THIS LEVEL DOES NOT
          DRAW (2026-09-23 night): the calendar's twelve months are the one
          placeholder of 252 and the builder withholds them, and the spend is
          withheld too (item 23), so the strip takes the living level's third
          seat, the composition London stood on before the calendar came
          (`earningsOnLiving` above). */}
      {calendar && earnings ? (
        <Band split="2-1" stack="lg">
          <SpendCalendar calendar={calendar} />
          <Earnings strip={earnings} />
        </Band>
      ) : calendar ? (
        /* A SURVIVOR STANDS ALONE AT TWO THIRDS, this page's own idiom for a
           card whose partner is absent, never at the full width. No city
           reaches this branch today: all 252 hold both. */
        <Band split="2-1" stack="lg"><SpendCalendar calendar={calendar} /></Band>
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
      {/* `08 demand` AND `07 earnings` BOTH LEFT THIS BAND on 2026-09-23 (the
          calendar's level above says why): the spend card stands third on the
          living level where it holds a figure, and the strip stands beside the
          calendar. Nothing is dropped; the two cards moved up one chapter, and
          this band draws only on a city with no calendar to seat the strip,
          which no city is today. */}
      {!calendar && earnings && !earningsOnLiving ? (
        /* The spend card is already on the living level where it draws, so the
           strip stands alone at two thirds here rather than beside a second
           copy of it. */
        <Band split="2-1"><Earnings strip={earnings} /></Band>
      ) : null}
      {/* `03 districts | 09 trades` (8.3): rent by district, the page's one
          fill-bar card, LEFT; the trades with local figures RIGHT, at 2-1
          (plan step 32, fifth dispatch, 2026-09-18; the measurements are in
          the dispatch's report and below). London alone draws `03` (8.3:
          LONDON ONLY); `09` draws on 101 of 252 cities (counted through the
          adapter's own path, 2026-09-18). THE BAND DRAWS ON EVERY CITY
          (QUEUE launch:city-seats-off-london, 2026-09-19): where a card's
          data is absent its seat stands in its place, the drawn blocked
          seat with its stated line and the item it waits on, the way the
          country page seats `07 workforce` (PART 4's idiom), so the block
          counts toward the floor and a reader is told what is missing
          instead of meeting nothing. Plan step 50's first run found
          Frankfurt and Abidjan at 14 of 17 because both blocks self-omitted
          here. On the cities under four local trades and off London the
          band is two seats, level at their own height (Frankfurt and
          Abidjan, 0 holes at three widths). Where ONE of the pair draws and
          the other is a seat (New York: six trade rows, no districts), the
          two cannot share a band: the seat stretched to the rows' height
          carried a 653 by 240 blank inside a 653 by 352 card, the page
          filter's WHITE SPACE red, MEASURED 2026-09-19; so each stands in
          its own band at the survivor's two thirds, the country's precedent
          for `12 money | 16 locals` and this page's own for `12 | 13`
          below, LONE CARD twice, expected. */}
      {/* THE SEATS LEFT THE PAGE ON 2026-09-24 (the goal's A4b; QUEUE
          city:uk-not-gathered-seats): his word of 2026-09-19 ("will you say
          not gathered yet?") took the seats off London on 2026-09-20, and the
          same two lines still stood on every city off London, three a page on
          Manchester, Birmingham and Leeds on production (the NEVER list's card
          on a UK page). Where both cards draw they share the band; where one
          draws it stands alone at two thirds (the band's rule, LONE CARD,
          expected); where neither draws the band leaves with them. The block
          floor (16, the spine where its data exists) is met on London and
          read short on a city that holds neither; the checker names the cause. */}
      {districts && trades ? (
        <Band split="2-1" stack="lg">
          <WhereToTrade d={d} />
          <TradesHere d={d} />
        </Band>
      ) : districts || trades ? (
        <Band split="2-1" stack="lg">{districts ? <WhereToTrade d={d} /> : <TradesHere d={d} />}</Band>
      ) : null}
      {/* CHAPTER TURN THREE (8.3, "What the place is like"): zero accent from
          here to the exit. The heading stands over the peers and the people
          since 2026-09-20 (below); the index stays "03" because the two turns
          above always draw. */}
      <Movement index="03" heading={COPY.chapters.place} />
      {/* `11 peers | 12 character-people` AT 1-1 SINCE THE EVENING OF 2026-09-20,
          his words on the London page as served: the comparison table "should
          just not be that wide for three columns", "the middle part is quite
          empty", and the lone people table under chapter three was "a strange
          blank space on the right of the section number three" (MODEL PART 9
          clauses 59 and 62). The table leaves its full width (8.3's seam, R1's
          second full width, both withdrawn by his word) for half the page,
          and takes SEVEN peers instead of three so eight rows fill the half
          beside the five-trait table (adapt_city.ts, comparable_cities.ts:
          the three roles first, then the nearest by similarity). Measured on
          the fresh render, the numbers in the commit and MODEL 8.3's brackets.
          Where only one of the two draws it stands alone at two thirds, the
          band's own rule. */}
      {people && peersDrawn ? (
        <Band split="1-1">
          <CityPeers d={d} />
          <CharacterPeople people={people} />
        </Band>
      ) : (
        <>
          {peersDrawn ? <Band split="2-1" stack="lg"><CityPeers d={d} /></Band> : null}
          {people ? (
            <Band split="2-1" stack="lg">
              <CharacterPeople people={people} />
            </Band>
          ) : null}
        </>
      )}
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
      {/* `13 locals` WITHHELD since the evening of 2026-09-20: the seat printed
          "Not gathered yet: what locals know about opening here." on the
          London page he is shown, the line he refused on 2026-09-19 ("will
          you say not gathered yet?", over the 2026-09-08 seated reading). The
          seat component stays for the sheet's story; the card returns with
          the notes (item 6), and the floor with it. The people table stands
          alone at two thirds until then (LEVEL UNFILLED, recorded for his
          corrections: no card on this page pairs with a 487-tall table by
          measurement, the plan's step 4 readings). */}
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
