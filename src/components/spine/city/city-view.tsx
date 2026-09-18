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
 * like (the character tables, then the season split); the exit full width.
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
 * NULL-GUARDS (real-data promotion): every section early-returns null when its data is
 * absent, so an omitted field renders NOTHING (never 0 / undefined / NaN / a broken
 * block). The chapter breaks are fixed "01", "02", "03" (8.3's own numbering); the
 * first two always have content (the premises bento draws on every listed city
 * whose shard loads, the spend card and the earnings strip build for 252), and
 * the third is drawn only when a card under it draws.
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
   modelled figure on this page is marked through the `sample` prop of Rail
   and Head, which draw the kit's SampleTag (hidden behind the one switch,
   MODEL.md, THE SAMPLE MARK IS BEHIND ONE SWITCH), and scripts/verify_sample_tags.ts
   proves the wiring by the reference, so the mark returns on every modelled
   card the day the switch is flipped. */
import { Movement, Box, Head, Rail, InlineDisclosure, SampleTag, Band, usd } from "@/components/spine/kit";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { buildCityCloseDoors } from "@/lib/spine/close_rows";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { buildCityCharacterTables } from "@/lib/spine/character_rows";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { buildCityPeerTable } from "@/lib/spine/peer_rows";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { buildCityGlance, type CityGlanceData } from "@/lib/spine/city_glance_rows";
import { buildCitySeat, type CitySeatData } from "@/lib/spine/city_seat_rows";
import { buildCityLiving, buildCityRunway, buildCityDemand, type CityLivingData, type CityRunwayData, type CityDemandData } from "@/lib/spine/fact_rows";
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

/* TradesHere , the funnel block §24 asks for: "higher pages (country, city) carry a
 * block of real clickable businesses funneling into the cell pages". It replaces the
 * ranked "what to open, and what you keep" chapter, which cannot be restored at this
 * altitude: cost-to-open per city is omitted upstream, per-city trade margin and
 * take-home are banned outright by §5, and the break-in score blends the banned
 * take-home with a term its own module labels "ROOM (crowding)", which §5 also bans.
 * So there is no ranking here, and there is no score. Only which trades this city
 * holds a real local measurement for, each linking to the page where those figures
 * are lawful. 8.3's `09 trades` (trade rows, a foot in the coverage form) is a later
 * dispatch's; this is today's card in the seat.
 *
 * Hover is INK, not the accent. §37: the accent marks answers and never appears on
 * hover. */
const hasTradesHere = (d: any) => (d?.trades_here?.list?.length ?? 0) >= 4;
function TradesHere({ d }: { d: any }) {
  const list: Array<{ name: string; slug: string; href: string }> = d.trades_here?.list ?? [];
  if (list.length < 4) return null;
  return (
    <Box id="trades">
      {/* NOT a restatement of the chapter heading above it (§11, the double-title
          defect): the chapter says what the reader gets, this says what the set IS. */}
      <Head icon="honest-take">Trades with local figures</Head>
      {/* A WRAPPING ROW, NOT A GRID. These are equal links with no ranking, and a
          two-column grid leaves the odd one out beside a blank half whenever the
          count is odd, which is §17 and is the fault I had just fixed one section
          above. A wrap has no empty cell by construction. It is also a different
          form from the bands and tables either side of it (§25, §33: the rule is
          variety). */}
      <div className="flex flex-wrap gap-2">
        {list.map((t) => (
          <a
            key={t.slug}
            href={t.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2 text-[length:var(--t-body)] text-[var(--c-ink2)] transition hover:border-[var(--c-line-strong)] hover:text-[var(--c-ink)]"
          >
            {t.name}
            <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">&#8594;</span>
          </a>
        ))}
      </div>
      <div className="mt-3 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        Each of these has a real local measurement in {d.meta?.city}.
      </div>
    </Box>
  );
}

/* CityPeers: THE PEERS TABLE ON THE COMPARISON ARCHETYPE (city:peers, the build
   loop's run 22, 2026-09-06). The country page's form, the one the founder
   called one of the best versions he had seen (2026-08-30): the places as rows
   with a flag each, the measures as columns, the home row marked, the phone form
   stacked and never scrolling sideways. The city and up to four peers, three
   columns: cheaper to live (index points, higher is cheaper), customer income
   (percent of the home city's average pay), visitors (a multiple). The old kit
   table had the cities as columns and the measures as rows, and printed "pp", a
   word the doctrine bans, on the income row; the units are now in the caption
   in plain words. Full width by the wide-table sanction, as on the country page,
   so it no longer stands alone at two thirds: 8.3's `11 peers`, the seam of
   turns two and three, the page's second full width (R1). Its kicker and
   heads are the later peers dispatch's. */
function CityPeers({ d }: { d: any }) {
  const t = buildCityPeerTable(d);
  if (!t) return null;
  return <CompareTable id="peers" kicker={COPY.cityPeers.kicker} icon="benchmark" entityHead={t.entityHead} rows={t.rows} columns={t.columns} caveat={t.caveat} />;
}

/* ================= TURN THREE , WHAT THE PLACE IS LIKE ================= */
/* CityCharacter: THE CITY'S OWN CHARACTER TABLES on the spectra-table archetype
   (the build loop's run 14, 2026-09-06). Dealing with the state and dealing with
   people, the founder's kept form (ruling 14: named traits, explanatory poles,
   the better end on the right, ink dots for the state and terracotta for people,
   a foot figure under each, side by side on desktop). The reads are the city's
   own, from the per-city signature file, and never the country's under a city
   heading: a city with no reads of its own draws nothing here, and a city with
   one side's reads draws that one table alone. London holds three people reads
   and no state reads on 2026-09-06. 8.3 seats `12 character-people` beside `13
   locals` at 1-1; no city holds authored notes today (item 6), so the table
   stands alone in its band until the locals card ships at its real structure. */
function CityCharacter({ d }: { d: any }) {
  const t = buildCityCharacterTables(d?.meta?.slug);
  if (!t) return null;
  /* ONE TABLE ALONE STACKS UNTIL LG: photographed at 768 on run 14, a lone
     table took one of the two tablet columns and left the other half empty,
     the one-sided white space the splitting exists to prevent; the lone-child
     rule of the band reaches only lg. Two tables keep the tablet halves. */
  const lone = !(t.state && t.people);
  return (
    <Band split="1-1" stack={lone ? "lg" : undefined}>
      {t.state ? (
        <Box id="character">
          <Rail icon="bank" kicker={COPY.character.state.kicker} sample />
          <SpectraTable rows={t.state.rows} dot={t.state.dot} foot={t.state.foot} />
        </Box>
      ) : null}
      {t.people ? (
        /* A section card of its own (MODEL.md 8.3, `12 character-people`),
           unnamed while the first table holds "character": named for BLOCK FLOOR. */
        <Box {...(t.state ? {} : { id: "character" })} data-block="character-people">
          <Rail icon="who-for" kicker={COPY.character.people.kicker} sample />
          <SpectraTable rows={t.people.rows} dot={t.people.dot} foot={t.people.foot} />
        </Box>
      ) : null}
    </Band>
  );
}
/* Locals. Null-guards on d.locals_intel (omitted on real-data promotion for
   every city today: no city holds authored notes, item 6; 8.3's `13 locals`
   ships the card at its real structure with its not-gathered line in a later
   dispatch). */
function Locals({ d }: { d: any }) {
  const items = d.locals_intel ?? [];
  if (items.length === 0) return null;
  // The place-specific bullets move into a disclosure (§18/§19: invented prose out of the
  // first view; these are London-specific and fail the universality test in the open).
  return (
    <Box id="locals">
      <Head icon="locals-know">What locals know</Head>
      <InlineDisclosure name="locals" summary={`${items.length} things worth knowing before you sign`}>
        <div className="mt-2 space-y-3 border-t border-[var(--c-border)] pt-2.5">{items.map((it: any, i: number) => (
          <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span><span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}

/* SeasonSplit, `15 season`: the resident/visitor mix, the ONLY honest seasonal
 * signal held (founder C7: city seasonality reads as the tourism / commuter mix,
 * never an invented month index); the invented month-by-month prose box is
 * DELETED (§4/§21). Turn three's since plan step 32 (8.3: `14 neighbourhoods |
 * 15 season`, 2-1); the KvGrid pair the composition names for it, and the
 * kicker "Residents and visitors", are the sixth dispatch's. The box reads its
 * own figure's tag (split_confidence) and carries a basis line, because the
 * split is a slope over arrivals for every city (research item 28) and had
 * shipped unmarked on 245 of them (item 27).
 *
 * A WHOLE BAR IS A CLAIM THAT THE PARTS ACCOUNT FOR EVERYTHING, and nothing was
 * checking that they do. The two shares are rounded independently upstream, so
 * each carries up to half a point of error and the pair can land on 99 or 101.
 * At 99 a strip of bare card shows through the end of the bar; at 101 the last
 * segment is squeezed and the drawn widths stop matching the printed figures.
 * Reproduced in scripts/probe_split_identity.mjs. Within a point of 100 it is
 * rounding, so the WIDTHS are taken as proportions of the real total and the bar
 * closes; further out a slice has gone missing upstream and the card draws
 * NOTHING rather than a bar with a hole in it. Rounded to two decimals because
 * dividing by a total of exactly 100 does not give back the number you started
 * with: 28 came out as 28.000000000000004 and went into the markup. */
const seasonSplitOf = (d: any): { resident: number; visitor: number; total: number } | null => {
  const o = d?.demand;
  if (!o || o.resident_pct == null || o.visitor_pct == null) return null;
  const total = (o.resident_pct ?? 0) + (o.visitor_pct ?? 0);
  if (!(Math.abs(100 - total) <= 1 && total > 0)) return null;
  return { resident: o.resident_pct, visitor: o.visitor_pct, total };
};
export function SeasonSplit({ d }: { d: any }) {
  const split = seasonSplitOf(d);
  if (!split) return null;
  const o = d.demand;
  const notHeld = (t: unknown) => t === "placeholder" || t === "modeled" || t === "extrapolated";
  const splitSample = notHeld(o.split_confidence ?? o._meta?.confidence);
  /* THE TWO SEGMENTS WERE NEARLY THE SAME COLOUR. A line-strong against a
     border tint differ by so little that a 72 to 28 split had no visible
     boundary: the bar read as one bar. Both are CONTEXT greys, and the
     convention is that a data mark takes ink and grey is for context, so the
     larger share , the one the section is about , now carries ink and the
     other stays quiet. */
  const segs: Array<[string, number, string, string]> = [
    ["Residents", split.resident, "var(--c-ink2)", "steady"],
    ["Visitors", split.visitor, "var(--c-soft2)", "seasonal"],
  ];
  return (
    <Box id="seasonal">
      <Head icon="seasonality" sample={splitSample}>{COPY.cityDemand.seasonKicker}</Head>
      {/* DECLARED I3, WAVE C ROW C9, 2026-09-02. One bar divided into two named parts
          that sum to a whole is the catalogue's STACKED WHOLE. The kit's own StackBar
          was measured against it and refused: its on-bar label colour is chosen by
          parsing the segment's colour as hex, and these two segments are CSS
          variables, which it cannot read, so it would set white type on the light
          segment. The city page spends its first I3 of two here. 8.3 retires the
          bar for a KvGrid pair (a fourth bar-family card otherwise) in the sixth
          dispatch. */}
      <div data-idea="I3" className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${split.resident}% steady, visitors ${split.visitor}% seasonal`}>
        {/* THE FIGURES SIT ON THE BAR, NOT ONLY IN THE KEY: the number inside the
            length it describes. THE LEGEND KEEPS THE NAMES AND LOSES THE FIGURES,
            so the same number is not printed twice on one card. */}
        {segs.map(([n, pct, bg]) => {
          const w = Math.round((pct / split.total) * 10000) / 100;
          const onDark = bg === "var(--c-ink2)";
          return (
            <div key={n} className="flex h-full items-center justify-center" style={{ width: `${w}%`, background: bg }}>
              <span className={`fig text-[length:var(--t-micro)] font-semibold ${onDark ? "text-white" : "text-[var(--c-ink)]"}`}>{pct}%</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
        {segs.map(([n, pct, bg, tag]) => (
          <span key={n} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: bg }} /><span className="font-semibold text-[var(--c-ink)]">{n}</span>, {tag}</span>
        ))}
      </div>
      {o.split_basis ? <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{o.split_basis}</p> : null}
    </Box>
  );
}

/* ================= THE EXIT ================= */
/* CityClose: THE TERMINUS (city:close, the build loop's run 19, 2026-09-06).
   Up to three doors out of the page on the terminus archetype, the country
   page's own close: the lightest-rent district by name where the districts are
   ranked (the pick the old card named), else every district; the country page;
   and the compare page as the pill, since it puts the same business in up to
   three cities side by side. The old card reprinted the pick's name and its
   character, both already on the page, and hung a workbook veil no city ever
   filled. A closing card names the pick and opens a door; it does not recite
   the page. Every city has doors now, where the old card drew only for a city
   with ranked districts. 8.3's `16 close`, the page's third full width (R1). */
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
  const character = buildCityCharacterTables(d?.meta?.slug) != null;
  const locals = (d.locals_intel?.length ?? 0) > 0;
  const season = seasonSplitOf(d) != null;

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
          fill-bar card, LEFT; the trades with local figures RIGHT. London holds
          both; 249 cities hold neither and the band is absent together (8.3,
          "the sparse pair"). THE PAIR CANNOT BE SEATED TODAY, MEASURED on
          London with the probe and the page filter (plan step 32, first
          dispatch): alone at two thirds the ranking stands 693 by 437 (content
          436) and the trade chips 693 by 194 (content 193); paired at 2-1 the
          chips at 347 wrap to 381 of content inside a card stretched to 437,
          and the filter reds a 121 by 144 blank in it (WHITE SPACE, against a
          page-holes baseline of 0 that never rises); every wider seat for the
          chips shortens their wrap and deepens the blank, and 1-2 puts the
          ranking at 347, where its district names wrap (C9 measured six of
          seven wrapping at 520 already). So each stands in its own band, in
          8.3's order, the ranking at the survivor's two thirds (the width it
          has held since C9) and the chips likewise, stacked until lg; LONE
          CARD fires on both, expected, until `09` takes its trade-row form
          with a figure per row (a later dispatch) and the pair is re-measured. */}
      {districts ? (
        <Band split="2-1" stack="lg">
          <WhereToTrade d={d} />
        </Band>
      ) : null}
      {trades ? (
        <Band split="2-1" stack="lg">
          <TradesHere d={d} />
        </Band>
      ) : null}
      {/* `11 peers`, FULL WIDTH, the seam of turns two and three (8.3, R1). */}
      <CityPeers d={d} />
      {/* CHAPTER TURN THREE (8.3, "What the place is like"): zero accent from
          here to the exit. Drawn only when a card under it draws (the character
          tables hold reads on 19 of 252 cities; the season split on 241), so a
          city with neither shows no heading over nothing; the index stays "03"
          because the two turns above always draw. */}
      {character || locals || season ? (
        <>
          <Movement index="03" heading={COPY.chapters.place} />
          {/* `12 character-people | 13 locals`, 1-1 (8.3): the character tables
              draw their own band; no city holds authored notes today (item 6),
              so the locals card is absent and the table stands alone, LONE CARD
              expected until the locals card ships at its real structure. */}
          <CityCharacter d={d} />
          {locals ? (
            <Band split="1-1">
              <Locals d={d} />
            </Band>
          ) : null}
          {/* `14 neighbourhoods | 15 season`, 2-1 (8.3): no neighbourhood card
              exists in this view today (the CardPager form is the sixth
              dispatch's), so the season split stands alone in the band, at the
              survivor's two thirds, LONE CARD expected; the band is not seated
              as a pair because one of its cards does not exist. */}
          {season ? (
            <Band split="2-1" stack="lg">
              <SeasonSplit d={d} />
            </Band>
          ) : null}
        </>
      ) : null}
      {/* `16 close`, FULL WIDTH (8.3, R1): the exit carries no break (PART 1). */}
      <CityClose d={d} />
    </main>
  );
}
