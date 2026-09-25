/**
 * Country page , SPINE rebuild BODY (SpineCountryBody).
 *
 * The body/route split every other spine page type already uses: the live route
 * (src/app/[country]/page.tsx) mounts this with the REAL seed from
 * buildSpineCountrySeed, so the country page stops rendering the bundled
 * illustrative GB sample the moment its flag is ever opened. Next forbids
 * arbitrary named exports and custom props on a route file, so the body lives
 * here as a plain module and the route imports it.
 *
 * TASK 10 BUILT THE MASTHEAD. Tasks 11 to 18 append the remaining sections, one
 * per task, each with its own form from the kit and its own entry in
 * RAIL_SECTIONS below. The flag stays shut until the page is whole: a page with
 * one section must never be reachable, and isSpineReformEnabledFor("country")
 * returns false with the master switch unable to open it.
 *
 * Null-guarded like its siblings: every section added here early-returns null
 * when its block is absent, so an omitted field renders NOTHING rather than a
 * zero, an "undefined" or a broken frame. The adapter self-omits whole blocks,
 * so those guards are load-bearing on every section from this one onward.
 *
 * Does NOT wrap itself in SpineShell; the route wraps it, matching the city
 * body. No em-dashes, no raw hex, tokens only.
 *
 * The honesty marker (rulebook 4A) is wired in the masthead below, so the
 * illustrative bundled country seeds (src/lib/spine-seeds/countries/*.json, all
 * "modeled" or "placeholder") now resolve to a file that actually carries it and
 * verify_sample_tags.ts passes on its own logic. The Task 9 `allow-unmarked`
 * exemption that recorded the gap is gone with the gap.
 */
import * as React from "react";
import { Band, Box, Fig, Ico, Movement, Rail, SampleTag, usd } from "@/components/spine/kit";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { CityCards } from "@/components/spine/archetypes/CityCards";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { CompanionRow } from "@/components/spine/archetypes/BentoBand";
import { buildCountryExit, exitMonthsText, type CountryExitData } from "@/lib/spine/country_exit_rows";
import { buildCountrySpend, SPEND_RESIDUAL, SPEND_WHOLE, SPEND_FOOD_IN, SPEND_FOOD_OUT, type CountrySpendData } from "@/lib/spine/country_spend_rows";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { buildCharacterTables } from "@/lib/spine/character_rows";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { buildLocalsNotes, type LocalsNotes } from "@/lib/spine/locals_rows";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { buildCloseDoors, buildCompareDoor } from "@/lib/spine/close_rows";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import { PayBars } from "@/components/spine/archetypes/PayBars";
import { buildPayBars } from "@/lib/spine/pay_rows";
import { buildCustomersStrip, type StripData } from "@/lib/spine/range_rows";
import { howToOpenDoor } from "@/lib/spine/setup_rows";
import { buildCityCards, type CityCards as CityCardsData } from "@/lib/spine/city_cards";
import { buildCitiesSeat, type CitiesSeat } from "@/lib/spine/country_cities_seat";
import { COPY } from "@/lib/spine/copy";
import { marginCardFromRows, type MarginCard } from "@/lib/spine/margin_rows";
import { buildPeerTable, type PeerTable } from "@/lib/spine/peer_rows";
import { buildHeroBoard } from "@/lib/spine/hero_board";
import { HeroBoard } from "@/components/spine/archetypes/HeroBoard";
import { SegmentBar } from "@/components/spine/archetypes/SegmentBar";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { KvGrid, type KvCell } from "@/components/spine/archetypes/KvGrid";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { buildEntryBill, buildEntryBillDetail, type EntryBillData } from "@/lib/spine/entry_bill_rows";
import { buildHowToSteps, type HowToStepsData } from "@/lib/spine/howto_steps_rows";
import { buildCountryLicences } from "@/lib/spine/country_licences_rows";
import { Stepper, STEPPER_MIN } from "@/components/spine/archetypes/Stepper";
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";
import { WorldRangeRows, type WorldRangeRow } from "@/components/spine/charts/WorldRange";
import { BarList } from "@/components/spine/charts/BarList";
import { DonutStat } from "@/components/spine/charts/DonutStat";
import { ShareBar } from "@/components/spine/archetypes/ShareBar";
import { RangePair } from "@/components/spine/charts/RangePair";
import { countryFigure } from "@/lib/facts/country_shard";
import { worldRange } from "@/lib/spine/world_stats";
import { getCountryProfile } from "@/lib/economic_profile";
import { usdCents } from "@/components/spine/kit";
import {
  buildCountryEmployment,
  buildCountryInsurance,
  buildCountryFinancing,
  buildCountryBanking,
  buildCountryPaperwork,
  buildCountryClosing,
  buildLondonTradeMargins,
  type DepthCard,
  type BankingCard,
  type InsuranceCard,
} from "@/lib/spine/country_depth_rows";
import { buildRunningCosts, type RunningCostsData } from "@/lib/spine/running_costs_rows";
import { cityScaleSpread } from "@/lib/economics/country_metrics";
import { FirstYears } from "@/components/spine/sections/FirstYears";
import { Obstacles } from "@/components/spine/sections/Obstacles";
import { AgeMix } from "@/components/spine/sections/AgeMix";
import { JobMarket } from "@/components/spine/sections/JobMarket";
import { buildSurvival, buildObstacles } from "@/lib/spine/sections/first_years";
import { buildAgeMix, listPeoplePlaces } from "@/lib/spine/sections/people";
import { buildJobMarket } from "@/lib/spine/sections/market_jobs";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * The on-this-page rail's entries, in page order, and the ONE list that says
 * what this page is made of. A section task appends its own entry here in the
 * same change that mounts the section, so the rail can never promise a section
 * that is not there (a dead in-page link fails to scroll and reads as missing
 * content, which is worse than a 404 because nothing tells the reader).
 *
 * THE ORDER IS MODEL.md 8.2's (plan step 31, 2026-09-17): the opening, then
 * what it costs to open and to run, then where to open it and what to open,
 * then what the place is like, then the exit. The two drawn blocked seats
 * (workforce, easiest) are listed because they are on the page, saying what
 * they do not hold; a rail that skipped them would promise a shorter page
 * than the one that renders.
 */
const RAIL_SECTIONS: Array<{ id: string; label: string }> = [
  { id: "take", label: "The tax burden" },
  { id: "setup", label: "Registering, by legal form" },
  { id: "entry-bill", label: "The bill to register" },
  { id: "running-costs", label: "Running costs" },
  { id: "hiring", label: "What staff cost" },
  { id: "peers", label: "Against the peers" },
  { id: "cities", label: "The cities" },
  { id: "customers", label: "What customers earn" },
  { id: "money", label: "Net profit margin" },
  { id: "locals", label: "What locals know" },
  { id: "character", label: "The character" },
  /* The two sections of 2026-09-23, in the order the page draws them. The
     exit's row is the one this list was missing the day it was built. */
  { id: "spend", label: "What households spend on" },
  { id: "exit", label: "How long it takes to sell" },
];

/**
 * THE THREE LOUD MOMENTS, declared where they are lit or held (MODEL.md 8.2's
 * seat table; plan step 40, 2026-09-19). Seat one is the masthead's AnswerCard
 * below (`tone` defaults to the accent), seat two the staff card's PayBars
 * (`Hiring`, the average's bar `--terra`, the minimum hatched), seat three the
 * money card's leader, unlit by his 2026-09-08 "quiet". The census prints this
 * ledger; the loud-seats gate holds every render to it. The table's word for
 * seat three, RESERVED, is this vocabulary's HELD EMPTY. Literals only, read
 * from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 take", figure: "the effective rate, 40", state: "LIT", condition: "8.2: the page's only 40, in `--terra-text`, before anything else is read; the regime is held for 58 of 195 and where it is not the card prints the state word and no accent (the AnswerCard's data-state no-answer), the withheld state the gate reads off the render" },
  { seat: 2, card: "08 hiring", figure: "the average salary; its bar `--terra`, the minimum bar hatched", state: "LIT", condition: "8.2: 195 pairs, 2 withheld (PayBars' data-withheld); the placement sentence beside each; the accent is the AVERAGE, not the wage floor" },
  { seat: 3, card: "12 money", figure: "the leading net margin", state: "HELD EMPTY", condition: "8.2: RESERVED, unlit, named; lit the day R7's one builder holds a per-country figure and he lifts his own 2026-09-08 'quiet' (DATA-REQUIREMENTS item 8); the budget is spent at two and openly short of three" },
] as const satisfies readonly LoudSeat[];

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/* THE PRIVATE COPY IS GONE AND THE KIT'S `usd` IS THE EXACT ONE (C29,
   2026-09-02). It was written here because the shared function abbreviated at a
   thousand: four of 198 countries carry a prime rent at or above one, Hong Kong
   at $1,850 printing "$2K", Monaco at $1,437 and Macao and Liechtenstein at about
   $1,200 all printing "$1K". Beside an edge rent of $278 that pair said 3.6 times
   where the truth is 5.2, and this card STATES the ratio, so a rounded figure put
   the drawing and the sentence in open disagreement. The founder ratified the
   grammar on 2026-09-02 and the kit carries it, so the premises card calls `usd`
   directly and no second name for money survives in this file. Every prime rent
   in the atlas is below $10,000, so the collapse changes no figure here. */


/**
 * The wayfinding rail, and the DEVIATION it carries is recorded rather than
 * silent. The plan asked for this in the shared shell "so every spine page
 * inherits it"; the shared shell also serves four founder-locked pages, and
 * this task must not change them, so the rail is built into the country body
 * alone. When a second page type wants one, it moves up to the shell then.
 *
 * Founder verdict 8 (2026-08-27) is the whole geometry: "it should be shifted a
 * little bit more to the right, and the content should be shifted more to the
 * center. Right now it's a little bit idiotic." Fixed to the viewport's right
 * edge, so it takes NO room from the reading column and the column stays
 * centred on the page rather than pushed left to make space, which is what it
 * did on the legacy page.
 *
 * IT APPEARS ONLY WHERE IT FITS WITHOUT INTRUDING. The column is 1120px; a
 * 1280px viewport leaves 80px of gutter on each side, which is less than this
 * rail needs, so at that width and below it does not render at all. 2xl (1536)
 * leaves 208px a side, and the rail's own right margin plus its measure clears
 * the column's edge with room to spare. There is no width at which it overlaps
 * a figure.
 */
function OnThisPage({ sections }: { sections: Array<{ id: string; label: string }> }) {
  if (sections.length === 0) return null;
  return (
    <nav aria-label="On this page" className="fixed right-6 top-1/2 hidden -translate-y-1/2 2xl:block">
      <div className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">On this page</div>
      <ol className="mt-2 space-y-2">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block max-w-[18ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The masthead , two-sided since the founder's second 2026-08-30 batch:
 * "those eight details that we put a little bit below, they can be put on the
 * right side of this section in two columns and four rows, something that
 * would look nice." LEFT: identity row (mark, flag, name , once), subtitle,
 * the label and the answer with its regime clause. RIGHT: a quiet grid, two
 * columns, no borders and no tiles (his tile ban stands): payroll on wages and
 * sales tax. The remaining slots are reserved for the upkeep and decile figures
 * when their data lands; nothing fills them speculatively.
 *
 * Everything the first batch settled still binds: the answer is the
 * small-business effective rate labelled "Total effective tax burden", the
 * name appears once with its flag, no world-median line, and the SMB rate's
 * modeled confidence keeps the honesty tag on the block.
 *
 * ========= C13, 2026-09-02: THE GRID GIVES UP THE TWO REGISTRATION CELLS =====
 *
 * IT HELD FOUR AND IT HOLDS TWO, and the two that went were stated twice more
 * on this same page. Read off the render: the masthead printed "Time to
 * register 1 day" and "Cost to register Free"; the peers table's home row
 * printed the same pair in its own two columns; the legal-form table's first
 * row printed it a third time. Both figures come from ONE place,
 * `data/legal/business_formation_costs_v1.json`, through
 * `getTypicalFormationCostUsd` and `DAYS_TO_START_BY_ISO2`, and both of those
 * pick the SOLE TRADER tier. So all three cards were printing one tier's pair.
 *
 * THAT LAST SENTENCE WAS TRUE OF THE UNITED KINGDOM AND FALSE OF EIGHT OTHER
 * COUNTRIES, and C31 (2026-09-03) is the row that found it: the two accessors
 * held two DIFFERENT pick orders, agreeing only where a Sole Trader tier
 * exists. On ES, MX, BE, GR, RO, AR, MA and TN the fee came off the limited
 * company and the filing time off the freelancer. There is one order now, in
 * `src/lib/tax/country_rates.ts` (`getTypicalFormationRow`), and the reasoning
 * for the cut below is unaffected: it turned on the pair being stated three
 * times, not on which tier it described.
 *
 * WHY THIS CARD IS THE ONE THAT YIELDS, per quantity and measured rather than
 * argued, which is C6's and C9's own test:
 *
 * - THE LEGAL-FORM TABLE CANNOT YIELD EITHER COLUMN. Counted on the file: the
 *   fee differs across tiers in 152 of 152 countries and the filing time in 149
 *   of 152, so both columns carry facts stated nowhere else on almost every
 *   page in the atlas. Its own warrant is what the wall costs, and the cheapest
 *   tier is the base that reading is taken from.
 * - THE PEERS TABLE CANNOT YIELD EITHER COLUMN EITHER, and its home row least
 *   of all: the four peers' fees and filing times appear nowhere else, and a
 *   comparison column with a hole where the reader's own country sits is not a
 *   comparison. It is also the one card on this page the founder praised
 *   unprompted.
 * - THIS GRID HELD NEITHER FACT IN A SET. Two bare figures, no peer beside
 *   them and no form named, which is step 1's duplicate exactly: without them
 *   a reader has to do nothing at all, because two later cards say it better.
 *
 * AND THEY WERE WORSE THAN A DUPLICATE, WHICH IS WHY BOTH WENT RATHER THAN ONE.
 * The band's answer is an ANNUAL burden, "what a small business effectively
 * pays the state", and the two surviving cells exist to stop a reader taking
 * 20% for the whole of it: payroll is a second burden the rate excludes, sales
 * tax is a burden the customer carries. A one-off fee and a filing wait qualify
 * that answer not at all. They also quietly advertise the trap the setup
 * chapter exists to warn against, because the tier they describe is the one
 * with NO liability wall: in Germany this grid would read "$50, 7 days" on a
 * page whose own table shows the company that gives you the wall at $1,500 and
 * three weeks, and the joint-stock form at $12,000 and sixty days.
 *
 * THE PAIR IS NOT SPLIT ACROSS TWO CARDS, and the reason is the grid's own
 * shape as well as the data: at three cells a two-column grid orphans one, so
 * a grid that must lose one of these loses both. The fee and the filing time
 * are also one reading, what it takes to get in the door, and half of it in a
 * band about annual tax is a question raised and not answered.
 *
 * THE SUBTITLE KEEPS ITS PROMISE and is now a POINTER rather than a
 * restatement: it still reads "and what it costs to register one", the page
 * still answers it in the setup chapter, and the on-this-page rail links there.
 * The adapter still emits both support facts, which is right: the hero's
 * confidence is composed from every fact it holds, and the subtitle branches on
 * them. What changed is what this band DRAWS.
 */
function Masthead({ name, iso2, hero }: { name: string; iso2?: string; hero: any }) {
  /* THE MASTHEAD IS THE ANSWER-CARD ARCHETYPE (the reset of 2026-09-04): one
     component drawn for every country, its facts built by hero_facts.ts from
     the same modules the adapter reads, the law inside the component (the
     name once, the subtitle composed from what resolved, the tag on the
     modelled figure, the grid docked at the half, the LLC's registration
     cells by the founder's rulings 1, 3 and 4, a state word when no regime
     row is held). The seed's hero block is kept for the page's provenance
     line; without a country code the facts cannot be built and the card
     falls back to the seed's answer alone. Gated by the archetype harness
     (scripts/harness) across nine countries at three widths. */
  if (iso2) {
    /* THE BOARD, his design of 2026-09-20 (HeroBoard.tsx, hero_board.ts):
       the flag and the name on one line, the total tax burden as the main
       figure, the placeholder image in the centre, the placed figures in one
       column on the right. The answer card stays the masthead of the other
       pages until he rules on theirs. */
    return <HeroBoard id="take" board={buildHeroBoard(iso2)} answers={SURFACE_ANSWERS.country} />;
  }
  const eb = hero?.effective_burden;
  const rate = isNum(eb?.rate_pct) ? eb.rate_pct : undefined;
  const regime = typeof eb?.regime_name === "string" && eb.regime_name.length > 0 ? eb.regime_name : undefined;
  return (
    <AnswerCard
      id="take"
      name={name}
      subtitle={rate != null ? "What a small business effectively pays the state." : null}
      answer={rate != null ? { label: "Total effective tax burden", value: `${rate}%`, regime: regime ?? null, confidence: "modeled" } : null}
      cells={[]}
      answers={SURFACE_ANSWERS.country}
    />
  );
}


/**
 * THE CITIES, through the city-cards archetype in its "field" look, since
 * 2026-09-11. The card pager that stood here from 2026-08-30 to 2026-09-11 drew
 * a 48px thumbnail slot on the left of a 155px track, and on this country three
 * cards in four had nothing to put in it: the photograph he ruled in on
 * 2026-09-11 was tried in that slot first and the harness measured three city
 * names clipped at 1280 and 768 plus a hole in the single-city form, twelve
 * design reds. The pager was the wrong vessel for a photograph, so it is
 * replaced rather than patched.
 *
 * TWO OF HIS RULINGS COLLIDE ON THIS CARD AND THE NEWER ONE IS FOLLOWED.
 * Ruling 2 of 2026-09-04 said a city card carries the city's own hero image,
 * "on its left or right", the same file the city's page shows. His reference
 * B11 of 2026-09-10 ("those coloured beautiful vertical cards of cities should
 * be used by us for cities too") is a tall card with the picture as the whole
 * field, and his word of 2026-09-11 ("the cities should have their placeholder
 * image ... blast the London in all of them ... not the map") put one
 * placeholder behind every card. A full-bleed field is what B11 is; a picture
 * beside the name is what he had on 2026-09-04 and called stale. The newest
 * ruling wins by his own standing rule, and it is the form he pointed at. The
 * "same image the city's hero shows" half of ruling 2 cannot hold today either
 * way: no covered city has a photograph on file, the stand-in is one picture for
 * all of them (city_cards.ts says which and why), and the city masthead draws no
 * picture until a real one lands.
 *
 * Two cards a row on phones ("on phones we should have two cities in a row
 * instead of one", 2026-08-30) and every card its own door (verdict 6) are the
 * archetype's own law and survive the swap. The unit is said once under the row.
 *
 * A BARE BOX SINCE PLAN STEP 31 (2026-09-17): the body seats it on the wide
 * side of a 3-2 beside what customers earn (MODEL.md 8.2, `10 cities | 13
 * customers`, the area band). It used to wrap itself in a Band of its own and
 * stand alone at two thirds with an empty third beside it, the lone card he
 * named on this very section. The cards come from the body, built once.
 *
 * THE SEAT WHERE NO CITY IS COVERED (MODEL.md 8.2's FLOOR bracket; plan step
 * 49, decided 2026-09-19 by the controller, option A, reversible by his
 * word): on the 90 countries the city list holds no row for, the block is
 * the drawn blocked seat in the cards' place, under the cards' own kicker,
 * with the one line country_cities_seat.ts composes ("Not gathered yet: any
 * city here. Nearby: Delhi, Dhaka and Mumbai." on Afghanistan, the three
 * largest covered cities of the country's region), no figure, no door, and
 * the foot naming item 82. `data-blocked="1"` on it, so BLOCK FLOOR counts
 * 21 of 21 where it counted 20 against 21; the seat comes from the body,
 * built once, like the cards. PART 7's "a country with no covered city
 * omits" is the older ground this bracket supersedes for this row.
 */
function Cities({ cards, seat }: { cards: CityCardsData | null; seat: CitiesSeat | null }) {
  if (cards) {
    return (
      /* A COLUMN, SO THE CARDS TAKE THE HEIGHT (2026-09-24): beside the locals' four notes the level lent this card 54 of air under
         its last link (the page laws' CARD FOOT BLANK, clause 52); the pager's row now grows into it (CityCards `fill`). */
      <Box id="cities" className="flex h-full flex-col">
        <Rail icon="best-areas" kicker={COPY.cities.kicker} />
        <CityCards
          fill
          cards={cards.cards}
          allHref={cards.allHref}
          allLabel={COPY.cities.allLabel}
          basis={COPY.cityCards.plain.basis}
          basisDrawn={COPY.cityCards.field.basis}
          look="field"
          prevLabel={COPY.cities.prev}
          nextLabel={COPY.cities.next}
        />
      </Box>
    );
  }
  if (seat) return <BlockedSeat id="cities" icon="best-areas" kicker={COPY.blocked.cities.kicker} line={seat.line} foot={COPY.blocked.cities.foot} />;
  return null;
}

function Peers({ table }: { table: PeerTable | null }) {
  /* THE COMPARISON-TABLE ARCHETYPE (the reset of 2026-09-04): rows built
     locally by peer_rows.ts from the same modules the masthead reads, with
     the LLC columns the founder ruled (3 and 4); the desktop table he praised
     kept whole, the phone form rebuilt with the heads said once (ruling 5).
     The table comes from the body, built once, so the body knows whether
     the block is drawn or seated.

     WHERE NO PEER TABLE RESOLVES (144 of 195 countries: no ratified peer
     group, or fewer than two rows; measured by verify_archetype_copy), THE
     DRAWN BLOCKED SEAT STANDS WHERE THE TABLE WOULD (MODEL.md 8.2, "THE THIN
     COUNTRY, SEATED"; plan step 31's seventh dispatch, 2026-09-18): the same
     kicker, the same tile, one stated line and the requirement in its foot,
     at the table's own full width and under the table's own sanction (the
     `data-wide-table` wrapper CompareTable draws, which the full-width gate
     reads and LONE CARD excludes), so the page keeps its three full widths
     (R1: the take, the peers, the close) whether the block is drawn or
     seated. A seat holds no figure by its law, so nothing here is at 30. */
  /* The caveat under the peers ("Countries of similar size and market, not neighbours") is not printed since 2026-09-25: a line
     explaining the choice of rows is the disclaimer his copy rulings bar, and the table reads without it. */
  if (table) return <CompareTable id="peers" kicker={COPY.peers.kicker} icon="benchmark" rows={table.rows} columns={table.columns} />;
  return (
    <div data-wide-table className="mt-8">
      <BlockedSeat id="peers" icon="benchmark" kicker={COPY.blocked.peers.kicker} line={COPY.blocked.peers.line} foot={COPY.blocked.peers.foot} />
    </div>
  );
}

/**
 * What customers earn. THE SPREAD IS DECILES (2026-08-30, notation N9),
 * founder verbatim: "we should seek to find the average, the top ten percent
 * and the bottom ten percent. Instead you are just saying the lower quarter or
 * the upper quarter... that's not very helpful."
 *
 * The drawing returns only for a country whose deciles were actually
 * researched (data/economics/wage_deciles_v1.json, pushed into the profile as
 * wage_p10_usd / wage_p90_usd). A country without them states the typical
 * figure alone, exactly as it did while the spread was dark, because the
 * quartile pair the profile still carries is a fixed multiple of the median
 * rather than a measurement, and relabelling it would be a fabricated
 * statistic. Quartile words never render again; the gate is
 * scripts/verify_no_quartile_words.mjs.
 *
 * THE LABELS DO NOT COLLIDE, and that is the whole reason the outer two wrap.
 * Pay distributions lean right, so the typical mark sits well left of centre
 * (about 29 percent of the span for the United Kingdom) while "Bottom ten
 * percent" is anchored at the left edge. Held on one line, those two blocks
 * overlap at every width the card is ever laid out at. Capped at 5rem the
 * outer labels take two short lines and clear the typical block at 1280 and at
 * 390 alike, with no invented breakpoint and nothing scrolling sideways (law
 * M).
 */
function Customers({ strip }: { strip: StripData | null }) {
  /* THE RANGE-STRIP ARCHETYPE (customers): the typical full-time pay with
     the bottom and top tenth where the deciles are researched; the typical
     alone, with the reason, where they are not. The strip comes from the
     body, built once, so the band can know whether it has a second child. */
  if (!strip) return null;
  return (
    <Box id="customers">
      <Rail icon="spread" kicker={COPY.customers.kicker} sample={strip.confidence !== "measured"} />
      <RangeStrip marks={strip.marks} scale="linear" fmt={usd} basis={COPY.customers.basis} note={strip.note} />
    </Box>
  );
}

/**
 * What an owner keeps , the repetition is out (founder, second batch: "for
 * each row you say kept a year and to open... you could have just said it
 * once at the top as a column and not repeated the same word six times in a
 * row"). Column headers ONCE; each row carries the trade, two figures and the
 * arrow, on one shared grid template so the headers sit over their columns.
 * Returns a bare Box: the body seats it on the left of the band beside what
 * locals know (MODEL.md 8.2, `12 money | 16 locals`, since plan step 31; it
 * stood beside the customers strip before). His standing note, recorded and
 * queued: "a little bit stale and without a lot of character."
 */
function Money({ money, card }: { money: any; card: MarginCard }) {
  /* THE RANKED-BARS ARCHETYPE (founder ruling 6, 2026-09-04): the net profit
     margin in percent as vertical bars, the track's top at the world's
     highest credible margin (ruling 13). A loss or a floored margin is
     withheld with its reason, never drawn; fewer than two credible rows and
     the card self-omits. The keep figures the old card printed are gone with
     it: four of the six were the 3% floor times revenue. The card's rows are
     built once in the body, which reads their count to seat the band. */
  const tagged = typeof money?._meta?.confidence === "string" && money._meta.confidence !== "measured";
  return (
    <RankedBars
      id="money"
      kicker={COPY.margin.kicker}
      icon="owner-keeps"
      tagged={tagged}
      basis={COPY.margin.basis}
      /* NO LINE OVER THE ROWS (2026-09-25): "4 trades left out: our figures for them aren't reliable" opened the card, the method
         disclaimer his correction of 2026-09-24 bans inside a card. The rows the engine cannot stand behind are simply not drawn. */
      withheldLine={null}
      rows={card.rows.map((r) => ({ key: r.key, name: r.name, href: r.href, lands: r.lands, value: r.margin, flagged: r.flagged }))}
      worldMax={card.worldMax}
      fmt={(v) => `${Math.round(v * 100)}%`}
      phoneHead={{ name: COPY.margin.phoneHead.trade, value: COPY.margin.phoneHead.value }}
    />
  );
}

/**
 * The character , the founder's two six-spectra tables (his personal keep
 * since 2026-06-18, his six orders of 2026-08-30 photographed in place on
 * 2026-09-03), through the spectra archetype: rows from character_rows, the
 * state's dots ink and the people's terracotta, a foot figure under each,
 * the sample tag because the reads are anchored to published indices and
 * not measured. A table with fewer than two reads is not drawn.
 */
/* THE TWO CHARACTER TABLES AS TWO CARDS (2026-09-25): where the country page seats them on different levels (his clause 64, two
   drawings of one kind keep a level between them), each is drawn by itself; the pair below stays for every other country. */
function CharacterCard({ iso2, which }: { iso2?: string; which: "state" | "people" }) {
  if (!iso2) return null;
  const t = buildCharacterTables(iso2);
  if (which === "state") {
    if (!t.state) return null;
    return (
      <Box id="character">
        <Rail icon="bank" kicker={COPY.character.state.kicker} sample />
        <SpectraTable rows={t.state.rows} dot={t.state.dot} foot={t.state.foot} />
      </Box>
    );
  }
  if (!t.people) return null;
  return (
    <Box id="character-people" data-block="character-people">
      <Rail icon="who-for" kicker={COPY.character.people.kicker} sample />
      <SpectraTable rows={t.people.rows} dot={t.people.dot} foot={t.people.foot} />
    </Box>
  );
}

/** THE CARD'S ONE FIGURE, at the focal rung, with the words that say what it is (PART 4: one figure at 30 a section card). */
function Focal({ figure, words }: { figure: string; words: string }) {
  return (
    <div className="mb-4">
      <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{figure}</div>
      <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{words}</p>
    </div>
  );
}

/* ===== THE UNITED KINGDOM'S CARDS ON THE NEW CHARTS (2026-09-25, his message of that day: "the numbers ... with no relation to
   each other", "the gradient is barely used", "the sections look dead"; his shadcn blocks as the pattern: the bullet chart, the
   bar card, the donut with its centre figure). Every figure that the world holds for every country is drawn on the world's
   range; the ranked lists are bars with the accent's gradient; a whole is a ring, or one bar cut into its parts. ===== */

/** RUNNING COSTS, WHERE THE UNITED KINGDOM STANDS: the business electricity price and diesel on the world's range, the cost of living on the city scale. */
function RunningCostsRanged({ iso2, costs }: { iso2: string; costs: RunningCostsData }) {
  const profile = getCountryProfile(iso2);
  const rows: WorldRangeRow[] = [];
  const kwh = profile.electricity_usd_per_kwh_commercial;
  const kwhRange = worldRange("electricity_usd_per_kwh_commercial");
  if (typeof kwh === "number" && kwh > 0 && kwhRange) rows.push({ key: "electricity", icon: "unit-economics", label: COPY.ranged.electricity, value: kwh, display: usdCents(kwh), unit: COPY.ranged.perKwh, range: kwhRange, fmt: usdCents, headless: true });
  const diesel = profile.diesel_usd_per_liter;
  const dieselRange = worldRange("diesel_usd_per_liter");
  /* NO WORLD TRACK FOR DIESEL (2026-09-25): the United Kingdom's pump price is the week of 21 September 2026 (195.5p), the other
     countries' figures are older, and the gap to the next country (26%) is the two dates, not the two countries. */
  void dieselRange;
  if (typeof diesel === "number" && diesel > 0) rows.push({ key: "diesel", icon: "transit", label: COPY.ranged.diesel, value: diesel, display: usdCents(diesel), unit: COPY.ranged.perLitre, range: null, fmt: usdCents });
  const livingSpread = cityScaleSpread();
  return (
    <Box id="running-costs" className="flex flex-col">
      <Rail icon="cost-breakdown" kicker={COPY.runningCosts.kicker} />
      {typeof kwh === "number" && kwh > 0 ? <Focal figure={usdCents(kwh)} words={COPY.ranged.electricityWords} /> : null}
      <WorldRangeRows rows={rows} medianWord={COPY.ranged.median} />
      {/* THE COST OF LIVING ON ITS SCALE'S OWN TRACK (2026-09-25): twenty blocks were the "cubic bars" he called a catastrophe in
          the hero, and they set a third drawing in one card beside the electricity's track; now the same track, 1 to 100 over the
          covered cities, the middle half shaded, the median city ticked, the ends never named (his ruling of 2026-09-20). Where the
          cities' spread cannot be read, the blocks stand as before. */}
      {costs.livingOnCityScale != null && livingSpread ? (
        <div className="mt-5 border-t border-[var(--c-border)] pt-4">
          <WorldRangeRows rows={[{ key: "living", icon: "spending-power", label: COPY.runningCosts.rows.living, value: costs.livingOnCityScale, display: String(costs.livingOnCityScale), unit: COPY.runningCosts.units.of100, range: livingSpread, fmt: (v) => String(Math.round(v)), level: costs.levels.living ? COPY.heroBoard.levels[costs.levels.living] : null }]} medianWord={COPY.runningCosts.medianCity} />
        </div>
      ) : costs.livingOnCityScale != null ? (
        <div className="mt-5 border-t border-[var(--c-border)] pt-4">
          <SegmentBar label={COPY.runningCosts.rows.living} value={costs.livingOnCityScale} figure={String(costs.livingOnCityScale)} unit={COPY.runningCosts.units.of100} chip={costs.levels.living ? COPY.heroBoard.levels[costs.levels.living] : undefined} />
        </div>
      ) : null}
    </Box>
  );
}

/** INSURANCE: the covers as a bar list of what each typically costs a year, the one the law requires marked, the law's minimum cover as the figure. */
function InsuranceBars({ card }: { card: InsuranceCard }) {
  const items = card.cells
    .map((c) => ({ key: c.key, label: c.label, value: Number(String(c.value).replace(/[^0-9.]/g, "")), display: `${String(c.value)} ${COPY.insurance.aYear}`, badge: c.note === COPY.insurance.requiredNote ? COPY.insurance.required : null }))
    .sort((a, b) => b.value - a.value);
  return (
    <Box id="insurance" className="flex flex-col">
      <Rail icon="safety" kicker={COPY.insurance.kicker} />
      <Focal figure={card.focal.figure} words={card.focal.words} />
      {/* The cover the law requires is the one bar in the accent (C2: the card's answer). */}
      <BarList items={items} look="plain" mark={items.find((i) => i.badge)?.key} fill />
    </Box>
  );
}

/** BORROWING: the rate on a new small-business loan as the figure and on the world's range; the central bank's rate, the government's loans and the grants as cells. */
function FinancingRanged({ iso2, card }: { iso2: string; card: DepthCard }) {
  const profile = getCountryProfile(iso2);
  const rate = profile.bank_lending_rate_pct;
  const range = worldRange("bank_lending_rate_pct");
  const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;
  const rows: WorldRangeRow[] = typeof rate === "number" && rate > 0 && range ? [{ key: "lending", label: COPY.ranged.lending, value: rate, display: pct(rate), range, fmt: pct }] : [];
  return (
    <Box id="financing" className="flex flex-col">
      <Rail icon="raise-money" kicker={COPY.financing.kicker} />
      <Focal figure={card.focal.figure} words={card.focal.words} />
      {rows.length ? <div className="mb-5"><WorldRangeRows rows={rows} medianWord={COPY.ranged.median} headless /></div> : null}
      <KvGrid cells={card.cells} under />
    </Box>
  );
}

/** GETTING PAID: how customers pay as a ring with its largest share in the middle, the card fee as the figure, the account as cells. */
function BankingRing({ card }: { card: BankingCard }) {
  const lead = [...card.parts].sort((a, b) => b.share - a.share)[0];
  return (
    <Box id="banking" className="flex flex-col [container-type:inline-size]">
      <Rail icon="payments" kicker={COPY.banking.kicker} />
      {/* THE RING'S CENTRE IS THE CARD'S ONE FIGURE (PART 4: one figure at 30 a card), and the card fee a cell beside it. */}
      {/* FROM 600px OF CARD (a tablet, where the card runs the row) the ring and the cells stand side by side, so neither leaves
          the other half of the card empty; narrower, the cells follow the ring. */}
      <div className="grid grid-cols-1 gap-5 [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:items-center">
        <DonutStat parts={card.parts} center={`${Math.round(lead.share)}%`} centerWords={COPY.banking.centerWords.replace("{part}", lead.name.toLowerCase())} aria={`${COPY.banking.donut}: ${card.parts.map((p) => `${p.name} ${p.share}%`).join(", ")}`} />
        <KvGrid cells={[{ key: "fee", label: COPY.banking.cells.fee, value: card.focal.figure, note: card.focal.words, confidence: "modeled" }, ...card.cells]} under />
      </div>
    </Box>
  );
}

/** LONDON'S MARGINS, TRADE BY TRADE, as a bar list with each trade's glyph; each name opens its London page. */
const SHOWN_MARGINS = 7;
function LondonMarginBars({ margins }: { margins: NonNullable<ReturnType<typeof buildLondonTradeMargins>> }) {
  const L = COPY.londonMargins;
  /* THE CARD'S ONE FIGURE, THE MIDDLE TRADE (2026-09-25, the model laws' FOCAL on the UK page): the median of every London trade
     the list holds, the eight drawn and the rest behind the plus, so each bar reads against it; a median of whole percents can
     fall on a half, printed as it falls, never rounded onto a row's own figure. It carries the unit, so the basis line under the
     list, "Net profit per $100 of sales.", leaves. */
  const sorted = margins.rows.map((r) => r.value * 100).sort((a, b) => a - b);
  const middle = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const middleText = `${Number.isInteger(Math.round(middle * 10) / 10) ? Math.round(middle) : (Math.round(middle * 10) / 10).toFixed(1)}%`;
  return (
    <Box id="money" className="flex flex-col">
      <Rail icon="owner-keeps" kicker={L.kicker} />
      <Focal figure={middleText} words={L.focalWords} />
      {/* SEVEN DRAWN, THE REST ON THE PLUS (his clause 58, parts behind a click): sixteen rows stood the card 717 tall beside a
          card of 300. Eight until the card took its figure (2026-09-25): the figure's 40px stretched the time-to-sell card beside
          it into a 153 by 120 hole (the chain's gathered-emptiness, E6), and the seventh row keeps the level at its old height.
          The bars share one scale, the list's highest, so the plus's rows read against the same top. */}
      <BarList items={margins.rows.slice(0, SHOWN_MARGINS).map((r) => ({ key: r.key, label: r.name, value: r.value, display: `${Math.round(r.value * 100)}%`, href: r.href, icon: r.icon }))} max={margins.worldMax} />
      {margins.rows.length > SHOWN_MARGINS ? <DetailPanel name="money-more" summary={L.more.replace("{n}", String(margins.rows.length - SHOWN_MARGINS))} rows={margins.rows.slice(SHOWN_MARGINS).map((r) => ({ label: r.name, value: `${Math.round(r.value * 100)}%` }))} /> : null}
    </Box>
  );
}

/** WHAT HOUSEHOLDS SPEND ON, as one bar of the budget's seven parts, the food question as the figure. */
function SpendBar({ spend }: { spend: CountrySpendData }) {
  return (
    <Box id="spend" className="flex flex-col">
      <Rail icon="spending-power" kicker={COPY.countrySpend.kicker} />
      <Focal figure={spend.out.figure} words={COPY.countrySpend.outWords} />
      {/* ONE HORIZONTAL BAR (2026-09-25, his word that night: "What households spend on could be a horizontal bar rather than that
          monstrosity", the treemap): the seven parts of a household's spending along one bar, eating out and groceries first and
          alone in colour, so the 39% is read off the bar as eating out's share of the coloured food block. */}
      <div className="mt-1 flex flex-1 flex-col">
        <ShareBar parts={spend.rows.map((r) => ({ key: r.key, name: r.name, share: r.value }))} lead={[SPEND_FOOD_OUT, SPEND_FOOD_IN]} residualKey={SPEND_RESIDUAL} tall fill />
      </div>
    </Box>
  );
}

function Character({ iso2 }: { iso2?: string }) {
  if (!iso2) return null;
  const t = buildCharacterTables(iso2);
  if (!t.state && !t.people) return null;
  return (
    <Band split="1-1">
      {t.state ? (
        <Box id="character">
          <Rail icon="bank" kicker={COPY.character.state.kicker} sample />
          <SpectraTable rows={t.state.rows} dot={t.state.dot} foot={t.state.foot} />
        </Box>
      ) : null}
      {t.people ? (
        /* The second table is a section card of its own (MODEL.md 8.2, `15
           character-people`) and carries no id while the first holds
           "character", so it names its block explicitly for BLOCK FLOOR. */
        <Box {...(t.state ? {} : { id: "character" })} data-block="character-people">
          <Rail icon="who-for" kicker={COPY.character.people.kicker} sample />
          <SpectraTable rows={t.people.rows} dot={t.people.dot} foot={t.people.foot} />
        </Box>
      ) : null}
    </Band>
  );
}

/**
 * Registering, by legal form , expandable since the founder's second batch
 * ("I've told you multiple times that this should be an expandable section").
 * The rows, the quiet local term and the terracotta complexity dots live in
 * the SetupTiers client component; this wrapper holds the section chrome.
 */
function Setup({ setup, iso2 }: { setup: any; iso2?: string }) {
  /* THE TIERS-TABLE ARCHETYPE (founder rulings 8 and 9, 2026-09-04): equal
     rows in every case, the heads said once at every width, a phone form of
     three lines a row, and the door to "How to open a business in [country]"
     the day that page exists. */
  const tiers: any[] = Array.isArray(setup?.tiers) ? setup.tiers : [];
  if (tiers.length === 0) return null;
  return (
    <Box id="setup" className="flex flex-col">
      {/* THE COUNTRY PAGE'S GLOSS (2026-09-24, the goal's B4): "legal form", the
          term a first-time owner meets here before any other; the money card
          takes none, because its basis line already says what net margin is
          and a gloss there would say it twice (clause 66). The how-to page's
          card of the same name carries the same sentence. */}
      <Rail icon="register-cost" kicker={COPY.tiers.kicker} gloss={COPY.glossary.legalForm} />
      <TiersTable rows={tiers} howTo={iso2 ? howToOpenDoor(iso2) : null} fill />
    </Box>
  );
}

/**
 * The bill to register, `04 entry-bill` (MODEL.md 8.2; plan step 31, third
 * dispatch, 2026-09-17, which closes plan step 44). BentoMetric standing as
 * its own card, the narrow side of the 3-2 beside the registering table, with
 * the two laws the composition names added to the cell (BentoBand.tsx): the
 * days until trading at 16 under a hairline, and the withheld line in PART
 * 5's shape wherever the guard withholds a figure. QUIET: the bill at 30 in
 * ink, no accent (PART 6 gives turn one's accent to the staff-cost card), no
 * bar, no track, nothing from the ledger. The figures and the guard are in
 * entry_bill_rows.ts: the shard's all-in bill and days (the two metrics that
 * file held for three weeks unread) checked against the SAME LLC row the
 * masthead and the glance print, so the band never shows a bill below the
 * table's fee or days fewer than its filing wait (100 of 148 countries would,
 * unguarded). No placement line yet: the bill's waits on the one site-wide
 * builder (R2) the `05 | 06` dispatch forces, and the days carry none by the
 * composition's own row.
 *
 * BentoMetric draws its own Box the way BlockedSeat and AnswerCard do, so the
 * bill is a block on the page (`data-block="entry-bill"`, BLOCK FLOOR counts
 * it), which the census reads by its id since 2026-09-24; the coverage gate
 * still reads `<Box` alone and does not list it. Its form to the checkers is
 * `bento-metric`.
 */
function EntryBill({ bill, steps, licences }: { bill: EntryBillData | null; steps?: HowToStepsData | null; licences?: DetailRow[] | null }) {
  /* THE PLUS (his correction 5 of 2026-09-20, "add some more context ... if a
     subsection can only have one number, it should not exist"): the LLC's
     own facts from the formation file behind a click, closed on arrival
     (entry_bill_rows.ts buildEntryBillDetail), so the card carries the bill,
     the days and the four rows that say what the LLC involves. */
  if (!bill) return null;
  /* THE BILL WITH ITS STEPS (2026-09-25), where the country's file lists the steps: the all-in bill as the card's one figure and,
     under it, the steps it is made of in order, each with its days and its cost (the how-to page's own builder and archetype, so
     the two pages print one sequence). The hero's "Days to trade" was this card's second figure; the steps now show where the days
     go (the United Kingdom's company is registered in a day, and the business bank account is the wait), so the card no longer
     prints the hero's count a second time. The plus holds what some trades need before they open. Elsewhere the card keeps its
     two-figure form below. */
  if (steps && steps.steps.length >= STEPPER_MIN && bill.figure) {
    /* WHY THE BILL EQUALS ONE FEE, SAID (2026-09-25, QUEUE country:register-fee-three-prints, the loop's ruling on his "idk-go"):
       where one step is the only one that costs money, the bill's figure is that step's fee, the same figure the hero and the
       legal-form table print, so its line says what the repetition means: the other steps are free. */
    const isFree = (c: string | null) => !!c && /^\$0(\.0+)?$/.test(c.trim());
    const paid = steps.steps.filter((s) => s.cost && !isFree(s.cost));
    const free = steps.steps.filter((s) => isFree(s.cost));
    const oneFee = paid.length === 1 && paid[0].cost === bill.figure && free.length > 0;
    return (
      <Box id="entry-bill" data-visual="1" className="flex flex-col">
        <Rail icon="startup-cost" kicker={COPY.entryBill.kicker} />
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{bill.figure}</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{oneFee ? COPY.entryBill.focalWordsOneFee.replace("{n}", String(free.length)) : COPY.entryBill.focalWords}</p>
        <div className="mt-5 flex-1">
          <Stepper steps={steps.steps} compact />
        </div>
        {licences && licences.length >= 2 ? <DetailPanel name="entry-bill-licences" summary={COPY.entryBill.licences.summary} rows={licences} /> : null}
      </Box>
    );
  }
  const rows = buildEntryBillDetail(bill.iso2);
  return (
    <BentoMetric
      id="entry-bill"
      icon="startup-cost"
      kicker={COPY.entryBill.kicker}
      sample={bill.sample}
      figure={bill.figure ?? undefined}
      withheld={bill.withheld ?? undefined}
      second={bill.second}
      basis={bill.basis ?? undefined}
      foot={bill.foot ?? undefined}
      lean
      detail={rows.length >= 2 ? <DetailPanel name="entry-bill" summary={COPY.entryBill.detailSummary} rows={rows} /> : undefined}
    />
  );
}

/**
 * Power and living costs, `06 running-costs` (MODEL.md 8.2; plan step 31,
 * fourth dispatch, 2026-09-18). THE SEAT IS HELD BY KvGrid AS CATALOGUED,
 * exactly as `01 glance` holds its own: the fact card with a focal (the
 * electricity cell at 30 taking the card's width) is candidate 1 of
 * FORM-CATALOG's CANDIDATES AWAITING HIS CLICK, and a form not in the
 * catalogue is a candidate awaiting his click; so the two cells draw at the
 * head rung, nothing at 30, and the FOCAL finding on this card stands until
 * he clicks. The composition's `data-placement` slot is owed too: the one
 * site-wide placement builder (R2) does not exist, so no cell carries
 * "Higher than {n} countries in ten" and nothing is stamped. The census
 * reads this Box as KvGrid, which is the truth of it today.
 *
 * The rows come from running_costs_rows.ts, pure over the files, every
 * figure's file and field in its header: the profile's commercial
 * electricity rate at two places (the kit's `usdCents`, the composition's
 * fourth missing law), WITHHELD wherever the row holds the file's fill value
 * 0.13 (52 countries, the seven tier A rows among them, R11; gated by
 * verify_electricity_not_fill), and the cost of living as the covered
 * cities' population-weighted reading, whole, modelled always, withheld on
 * the 90 countries with no covered city. The basis names a unit for each
 * printed cell; the foot names what is modelled and how many cities the
 * living figure stands on, in words, because the sample mark is off.
 *
 * WHERE NOTHING PRINTS (38 countries: the fill and no covered city), the
 * card still draws, opener and stated lines and no figure (PART 5:
 * withheld, never dropped), each line at the lead rung in ink2 where a
 * figure would stand, the drawn seat's and the bill's own idiom; beside a
 * printed cell the lines sit under the grid at the micro rung, the glance's.
 */
function RunningCosts({ costs }: { costs: RunningCostsData | null }) {
  /* RUNNING COSTS TO HIS CORRECTIONS 6 AND 7 OF 2026-09-20 (COUNTRY-PAGE-
     SECTIONS-PLAN-2026-09-20.md) AND HIS GOLD STANDARD (design/references/
     founder-2026-09-20-gold-standard-sections.md): the costs that are the
     same everywhere in the country, each placed among the countries with a
     level word, drawn to the gold standard's forms. Today two of them: the
     electricity price as a row with its level chip, and the cost of living as
     the segmented unit bar (B27) on the city scale, 1 at the cheapest covered
     city and 100 at the dearest, neither named (his ruling). The price of oil,
     insurance and the typical costs by category he asked for are the data
     track's (DATA-REQUIREMENTS items 83 and 84) and join as rows when held;
     a figure the file does not hold is not a row and not a "not gathered
     yet" line. The rent tiers left for the city page. */
  if (!costs) return null;
  const e = costs.cells.find((c) => c.key === "electricity") ?? null;
  const level = (l: "high" | "medium" | "low" | null) => (l ? <span data-level={l} className="rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]">{COPY.heroBoard.levels[l]}</span> : null);
  const bare = !e && costs.livingOnCityScale == null;
  return (
    <Box id="running-costs">
      <Rail icon="cost-breakdown" kicker={COPY.runningCosts.kicker} sample={costs.confidence !== "measured"} />
      {bare ? (
        costs.withheld.map((line) => (
          <p key={line} data-withheld-line="cell" className="mt-2 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{line}</p>
        ))
      ) : (
        <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {e ? (
            <div data-row="electricity" className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 py-2">
              <Ico id="unit-economics" tone="terra" />
              <span data-label className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{COPY.runningCosts.rows.electricity}</span>
              <span className="whitespace-nowrap text-right text-[length:var(--t-body)] font-medium tabular-nums text-[var(--c-ink)]">
                {e.value}
                <span className="ml-1 text-[length:var(--t-micro)] font-normal text-[var(--c-muted)]">{COPY.runningCosts.units.kwh}</span>
              </span>
              {level(costs.levels.electricity) ?? <span aria-hidden="true" />}
            </div>
          ) : null}
          {costs.livingOnCityScale != null ? (
            <SegmentBar label={COPY.runningCosts.rows.living} value={costs.livingOnCityScale} figure={String(costs.livingOnCityScale)} unit={COPY.runningCosts.units.of100} chip={level(costs.levels.living)} />
          ) : null}
        </div>
      )}
      {costs.withheld.length > 0 && !bare ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{costs.withheld.join(" ")}</p> : null}
      {costs.basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{costs.basis}</p> : null}
      {costs.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{costs.foot}</p> : null}
    </Box>
  );
}

/**
 * Sections 8, 9 and 10, built EXACTLY to design/blueprints/country.md, which
 * was written first. Where these components and that file disagree, one of
 * them is wrong and gets fixed the same day.
 *
 * 8 , WHAT STAFF COST: replaces the legacy "ground under you" (founder
 * verdict 5) with the staffing half of what it tried to say. The page's only
 * bar-family spend: TWO bars, one shared zero-based track, BOTH NEUTRAL,
 * because neither figure is an answer and the legacy version accenting the
 * higher cost was a rule-29A inversion fault.
 *
 * 9 , WHAT LOCALS KNOW: label-over-fact rows, never a wall of text (founder
 * verdict 9), capped at five, always sample-tagged (hand-written).
 *
 * 10 , WHERE TO NEXT: the terminus, the second sanctioned full width. Three
 * doors that LEAVE the page and share no first word. The legacy honest-take
 * SECTION is cut here under rule 41, credibility ground: hand-written verdict
 * prose presented as a read is the patronizing class the founder condemned.
 */
function Hiring({ hiring, iso2, foot = true, hireCost = false }: { hiring: any; iso2?: string; foot?: boolean; hireCost?: boolean }) {
  const pay = iso2 ? buildPayBars(iso2) : null;
  const addPct = hiring?.payroll_only_multiplier != null && isNum(hiring?.employer_payroll_pct) ? hiring.employer_payroll_pct : undefined;
  const labour = hiring?.labour_force_pct;
  const informal = hiring?.informal_share_pct;
  if (!pay && !isNum(addPct) && !isNum(labour) && !isNum(informal)) return null;
  const tagged = (pay && pay.confidence !== "measured") || (typeof hiring?._meta?.confidence === "string" && hiring._meta.confidence !== "measured");
  /* LEAN WHILE IT STANDS ALONE (plan step 31, 2026-09-17; kept by the sixth
     dispatch, 2026-09-18): the kit seats a lone card at two thirds, and at 693
     this card's world track ran on empty past its two short fills, the void
     the page filter names; at the narrow third, 347, the card carries none.
     The placement lines closed the staff card's own void at 520 (a 190 by 60
     blank there now), but the pair with the workforce seat still waits on the
     plus, because the seat stretched to this card's height is 57 percent ink
     against the art-direction gate's 60 (the band's comment in the body has
     the numbers). Under 420 the card draws PART 5's phone row: label and
     figure, the track at the card's full width under them, the placement
     line under the track. The declaration is inert the day the card has a
     partner again. */
  return (
    <Box id="hiring" data-lean="1">
      <Rail icon="hiring" kicker={COPY.pay.kicker} sample={tagged} />
      {/* THE PAY BARS through the archetype (founder rulings 13 and 14, 2026-09-04):
          minimum and average salary on one track that ends at the world's
          highest average, unnamed since his 2026-09-07 ruling; a pair under
          ten percent apart withheld. */}
      {/* THE ON-COST IS SEEN, NOT READ (section 9's plan of 2026-09-20, his
          corrections owed): what the employer adds on top of wages is a darker
          piece at the average bar's end, its words under the track, in place
          of the sentence that stood here. */}
      {pay ? <PayBars rows={pay.rows.map((r) => (r.key === "average" && isNum(addPct) ? { ...r, extra: { pct: addPct, label: COPY.pay.employerAdds.replace("{pct}", `${addPct}%`) } } : r))} worldMax={pay.worldMax} withheld={pay.withheld} fmt={usd} /> : null}
      {hireCost && pay ? <HireCost iso2={iso2 as string} pay={pay} rate={isNum(addPct) ? addPct : null} /> : null}
      {/* The labour force and the informal share move to the employment card where the page draws it (2026-09-25). */}
      {foot && (isNum(labour) || isNum(informal)) ? (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--c-border)] pt-4">
          {isNum(labour) ? (
            <span className="flex items-baseline gap-2">
              <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{labour}%</Fig>
              <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">of adults are in the labour force</span>
            </span>
          ) : null}
          {isNum(informal) ? (
            <span className="flex items-baseline gap-2">
              <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{informal}%</Fig>
              <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">of the economy runs informal</span>
            </span>
          ) : null}
        </div>
      ) : null}
    </Box>
  );
}

/**
 * WHAT A HIRE COSTS YOU (2026-09-25, his "numbers with no relation to each other"): the average salary and what the employer pays
 * on top of it, as one bar of its two parts and their sum. The employer's part is the rate on wages above the threshold where the
 * country's file holds one (the United Kingdom's National Insurance: 15% above the first $6.6K), the rate on the whole salary
 * otherwise. Every figure is the staff card's own or the shard's; the sum is arithmetic on them, never a new estimate.
 */
function HireCost({ iso2, pay, rate }: { iso2: string; pay: NonNullable<ReturnType<typeof buildPayBars>>; rate: number | null }) {
  const avg = pay.rows.find((r) => r.key === "average")?.value;
  if (!isNum(avg) || avg <= 0 || rate == null || rate <= 0) return null;
  const threshold = countryFigure(iso2, "employment.employer_ni_threshold_usd")?.value ?? 0;
  const onCost = Math.round((rate / 100) * Math.max(0, avg - threshold));
  const total = avg + onCost;
  const H = COPY.hireCost;
  return (
    <div data-hire-cost className="mt-5 border-t border-[var(--c-border)] pt-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{H.label}</span>
        <Fig className="text-[length:var(--t-head)] font-semibold text-[var(--c-ink)]">{usd(total)}</Fig>
        <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{H.unit}</span>
      </div>
      <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label={`${H.label}: ${usd(total)} ${H.unit}, ${usd(avg)} ${H.pay} and ${usd(onCost)} ${H.onCost}`}>
        <span aria-hidden style={{ width: `${(avg / total) * 100}%`, background: "var(--c-line-strong)" }} />
        {/* The employer's share in ink (ART-DIRECTION C2): the card's answer is the average salary, already in the accent above. */}
        <span aria-hidden style={{ width: `${(onCost / total) * 100}%`, backgroundColor: "var(--c-ink2)", backgroundImage: "linear-gradient(90deg, var(--c-muted), var(--c-ink2))" }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-line-strong)" }} />{H.salary}</span>
        <span className="inline-flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: "var(--c-ink2)" }} /><Fig className="font-semibold text-[var(--c-ink)]">{usd(onCost)}</Fig> {H.onCost}</span>
      </div>
      {threshold > 0 ? <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{H.rule.replace("{rate}", `${rate}%`).replace("{threshold}", usd(threshold))}</p> : null}
    </div>
  );
}

/**
 * What locals know, through the note-list archetype: authored notes from one
 * data file, a label over one fact, at most five, always sample-tagged
 * because they are written by hand and not derived from a dataset. A
 * country without notes draws nothing.
 */
function LocalsKnow({ notes }: { notes: LocalsNotes | null }) {
  if (!notes) return null;
  return (
    /* The id sits on the inner div, so the Box names its block explicitly
       (MODEL.md 8.2, `16 locals`); moving the id would change what `#locals`
       selects for every crop and gate that reads it. The notes come from the
       body, built once, so the band beside the money card knows its count. */
    <Box data-block="locals">
      <Rail icon="locals-know" kicker={COPY.locals.kicker} sample />
      <div id="locals">
        <NoteList notes={notes.notes} columns={2} />
      </div>
    </Box>
  );
}




/**
 * HOW LONG IT TAKES TO SELL, `17 exit` (2026-09-23, brief row C3; the
 * builder's header names every field, its coverage, and why the sale PRICE is
 * not on this card). Two marks on one track, the quick sale and the slow one,
 * with the buyers' market as a sentence beside them.
 *
 * WHY IT IS HERE AND NOT EARLIER: it is the last question a reader asks and
 * the one no free page answers. It sits after the character pair, two levels
 * clear of the earnings strip, because two tracks with marks on neighbouring
 * levels is the sameness his rule of 2026-09-20 refuses (clause 64).
 *
 * FULL WIDTH AND OUTSIDE A BAND (the peers precedent): there is no card left
 * on this page whose subject belongs beside an exit, and a lone card inside a
 * band is a level with air beside it.
 */
function ExitCard({ exit, closing, lean = false }: { exit: CountryExitData | null; closing?: DetailRow[] | null; lean?: boolean }) {
  if (!exit) return null;
  const C = COPY.countryExit;
  /* THE WORLD'S TWO FIGURES, from the builder (2026-09-23 afternoon): the
     usual band anywhere on file and how many countries can take longer, so
     the months on the track have something to stand against. The slot was an
     empty array from the morning, when the sale PRICE left the card; it holds
     the placement now instead of holding nothing. */
  const second = exit.second;
  /* THE LEAN FORM (2026-09-25, the United Kingdom's page, his "one supporting line"): the definition goes behind the kicker's "?",
     the world's count stays as the card's one line, the buyers become a label, and closing a company opens on the plus. The
     long form below stands on every other country until its own pass. */
  if (lean) {
    const longer = second.length > 1 ? second[1] : null;
    const buyers = exit.climateWord ? (C.buyers as Record<string, string>)[exit.climateWord] ?? null : null;
    return (
      <Box id="exit" className="flex flex-col [container-type:inline-size]">
        <Rail icon="sale-tag" kicker={C.kicker} gloss={C.basis} />
        {longer ? <Focal figure={longer.figure} words={C.world.longerLean} /> : null}
        {exit.usual ? (
          <div className="flex flex-1 flex-col">
            <RangePair
              fill
              spans={[
                { key: "here", label: C.here, lo: exit.marks[0].value, hi: exit.marks[exit.marks.length - 1].value, accent: true },
                { key: "usual", label: C.usualAnywhere, lo: exit.usual.lo, hi: exit.usual.hi },
              ]}
              max={Math.max(24, exit.usual.hi, exit.marks[exit.marks.length - 1].value)}
              fmt={(v) => String(Math.round(v))}
              unit={C.months}
              ticks={[0, 6, 12, 18, 24]}
              aria={C.kicker}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center">
            <RangeStrip marks={exit.marks} scale="linear" fmt={exitMonthsText} basis="" />
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--c-border)] pt-3">
          {buyers ? <span data-level="buyers" className="rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]">{buyers}</span> : null}
        </div>
      </Box>
    );
  }
  return (
    <Box id="exit" className="flex flex-col [container-type:inline-size]">
      <Rail icon="ranking" kicker={C.kicker} />
      {/* THE DRAWING TAKES THE SLACK (2026-09-23 afternoon, the band): a card
          in a band is stretched to its level's height, and clause 52 reds a
          card whose last ink stops more than 48px above its floor. RankedBars
          answers that by letting its rows share whatever height the band hands
          them (PART 5's height law); this card answers it the same way, with
          the strip centred in a slot that grows, so the slack is split above
          and below the drawing instead of sitting in one lump at the foot. */}
      <div className="flex flex-1 flex-col justify-center">
        <RangeStrip marks={exit.marks} scale="linear" fmt={exitMonthsText} basis="" />
      </div>
      {/* THE FOOT IN TWO EQUAL COLUMNS where the card is wide enough for them
          (measured: at 768 the sale's length and the buyers' sentence sat in
          the left half and left a 312 by 126 rectangle of nothing beside
          them). The container decides, not the window. EQUAL, not `auto`: with
          the world's two figures in the first column an `auto` track took the
          whole width on the stacked 720px card and squeezed the buyers'
          sentence into 20px, where it ran 34px past the card's own box (the
          page laws' TEXT OUT OF BOX on Afghanistan, clause 56). */}
      {second.length > 0 || exit.climate ? (
        <div className="mt-4 grid gap-x-8 gap-y-3 border-t border-[var(--c-border)] pt-3 [@container(min-width:520px)]:grid-cols-2">
          {second.length > 0 ? (
            <div data-second>
              <CompanionRow items={second} />
            </div>
          ) : null}
          {exit.climate ? <p className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{exit.climate}</p> : null}
        </div>
      ) : null}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{exit.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{exit.foot}</p>
    </Box>
  );
}

/**
 * WHAT HOUSEHOLDS SPEND ON, `18 spend` (country_spend_rows.ts, 2026-09-23,
 * brief NEW-SECTIONS-2026-09-23.md row C5). Seven parts of a hundred through
 * the ranked-bars archetype, biggest first, the leftover pinned last, on a
 * track whose far end is the whole budget.
 *
 * WHY IT IS HERE. Chapter three is what the place is like, and how a household
 * divides its money is the plainest portrait of a country this bank holds:
 * groceries are 11 of every 100 in the United Kingdom and 62 in Afghanistan.
 * It stands AFTER the character pair and BEFORE the exit, which puts two
 * levels between it and the money card, the other ranked-bars card on this
 * page: clause 64 keeps a level between two drawings of one kind, and clause
 * 55 caps the kind at two on a page and asks the pair to look different. They
 * do, and the difference is declared rather than eyeballed: the money card
 * features its leader (a black pill, a terracotta bar), this one features
 * nobody, `data-feature="leader"` against `data-feature="none"`, which is what
 * the page-laws checker reads.
 *
 * THE CARD IS QUIET ON PURPOSE. The page's three loud moments are spent (the
 * hero's answer, the hiring bar, the money card), so no accent stands here:
 * the focal is ink and every bar is one neutral.
 *
 * FULL WIDTH AND OUTSIDE A BAND, the exit's precedent directly above: a
 * seven-row table wants the width, and nothing on this page belongs beside it.
 */
export function SpendCard({ spend }: { spend: CountrySpendData | null }) {
  if (!spend) return null;
  const C = COPY.countrySpend;
  return (
    <RankedBars
      id="spend"
      kicker={C.kicker}
      icon="spending-power"
      tagged={spend.tag !== "held"}
      basis={spend.basis}
      rows={spend.rows.map((r) => ({ key: r.key, name: r.name, value: r.value }))}
      residualKey={SPEND_RESIDUAL}
      worldMax={SPEND_WHOLE}
      ceiling="whole"
      topLabel={C.topLabel}
      feature="none"
      focal={{ figure: spend.out.figure, words: C.outWords }}
      fmt={(v) => `${v}%`}
      phoneHead={{ name: C.phoneHead.name, value: C.phoneHead.value }}
    />
  );
}

/**
 * Where to next, through the terminus archetype: the doors from close_rows
 * (the largest covered city, the country's trades, the pricing page with the
 * promise it keeps today), the wrapper keeping data-terminus so the
 * full-width and blueprint gates read the sanction. No doors, no card.
 */
function Close({ meta, name }: { meta: any; name: string }) {
  /* THE EXIT IS ONE CARD (2026-09-20, the loop's composition under his page
     laws): the city door and the trades door, then the compare pill (M21: the
     pill on every page is the compare tool; `19 compare` no longer stands as
     its own card at two thirds of a level), the pricing pill gone to the
     chrome as the trade page's already is (8.6). `18 checks` LEFT THE PAGE
     the same evening: three questions and no figure, sentences where his law
     of 2026-09-20 wants labels ("if we write so many sentences, nobody will
     read them"); tried first as this card's plus, which opened a 183 by 132
     blank beside the summary row at 375 (the page filter). The question bank
     stays in code for the trade page's `02 suits`, which reads the same
     keys (M20). */
  const iso2 = typeof meta?.iso2 === "string" ? meta.iso2 : undefined;
  if (!iso2) return null;
  const doors = [...buildCloseDoors(iso2).filter((d) => d.kind !== "pill"), ...buildCompareDoor(name)];
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
 * The country spine page body. `data` is the seed from buildSpineCountrySeed.
 * Every block on it is optional by design, so read defensively.
 */
export function SpineCountryBody({ data }: { data?: any }) {
  const d = data ?? {};
  const name: string | undefined = d.meta?.country_name;
  if (!name) return null;
  const iso2: string | undefined = typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined;

  /* WHO IS HOME, ASKED ONCE, FROM THE BUILDERS THE CARDS DRAW FROM. A band is
     drawn when either of its cards exists and not otherwise, and a card that
     self-omits under its own floor (the margin card under two credible rows)
     must be asked, not its seed block guessed at: `d.money?.list` exists on
     173 countries whose margin card draws nothing, and a band opened on that
     guess would be an empty grid with a rung of air. So the cards whose
     presence seats a band are built here and handed down, once each. */
  const cities = iso2 ? buildCityCards(iso2) : null;
  /* THE CITIES SEAT (plan step 49, 2026-09-19): built only where no card
     draws, and the builder itself returns null for a country that holds a
     covered city, so the seat's line is never false. Since the card builder
     walks the covered list (QUEUE country:cities-covered-list, the same day)
     the cards draw on all 105 countries the list holds a city for, largest
     first, eight at most, the pager paging (the United Kingdom seven on two
     pages), and the seat on the 90 it holds none for; no country draws
     neither. */
  const citiesSeat = !cities && iso2 ? buildCitiesSeat(iso2) : null;
  const customers = iso2 ? buildCustomersStrip(iso2) : null;
  const margin = marginCardFromRows(Array.isArray(d.money?.list) ? d.money.list : []);
  const hasMoney = margin.rows.length >= 2;
  const locals = iso2 ? buildLocalsNotes(iso2) : null;
  const hasSetup = Array.isArray(d.setup?.tiers) && d.setup.tiers.length > 0;
  const bill = iso2 ? buildEntryBill(iso2) : null;
  const billSteps = iso2 ? buildHowToSteps(iso2) : null;
  const licences = iso2 ? buildCountryLicences(iso2) : null;
  const costs = iso2 ? buildRunningCosts(iso2) : null;
  const peers = iso2 ? buildPeerTable(iso2) : null;
  /* THE NEW SECTIONS (country_depth_rows.ts, 2026-09-25). Where the country holds all of them (the United Kingdom) the page takes
     the composition below the return that follows; everywhere else the page is drawn as it was. */
  const employment = iso2 ? buildCountryEmployment(iso2) : null;
  const insurance = iso2 ? buildCountryInsurance(iso2) : null;
  const financing = iso2 ? buildCountryFinancing(iso2) : null;
  const banking = iso2 ? buildCountryBanking(iso2) : null;
  const paperwork = iso2 ? buildCountryPaperwork(iso2) : null;
  const closing = iso2 ? buildCountryClosing(iso2) : null;
  const londonMargins = iso2 === "GB" ? buildLondonTradeMargins() : null;
  const exitData = buildCountryExit(iso2 ?? "");
  const spendData = buildCountrySpend(iso2 ?? "");
  const rich = !!(employment && insurance && financing && banking && paperwork && londonMargins && costs && hasSetup && locals && cities && exitData && spendData);
  /* FOUR OF THE PAGE-AGNOSTIC SECTIONS OF 2026-09-25, SEATED (his "you choose, push forward" of that night), each pair only where
     the country holds both halves, so no card stands alone on a level:
       - who lives here by age beside the job market: the people a shop sells to and hires from. The job market carries the
         unemployment rate drawn beside the capital's and the young's, so the employment card gives its cell up while the pair is
         seated (one figure, printed once), and the pair waits where the employment card's own figure is that rate.
       - who is still trading beside what holds small firms back, a fourth turn.
     The age card's comparison city is the people file's own for the country, never a name written here. Not seated, with the
     reasons in QUEUE sections:seats-2026-09-25: the born-abroad card (its figure is the people table's foot), the thresholds (the
     hero's VAT line and the hiring card's minimum salary on this page), the apps (a list wants a drawing beside it, and only the
     peers table stands the full width here), and the trip bar (a second bar cut into parts after what households spend on). */
  const peopleCity = iso2 ? listPeoplePlaces().find((p) => p.iso2 === iso2.toUpperCase())?.city : undefined;
  const ageMix = iso2 ? buildAgeMix(iso2, peopleCity, "country") : null;
  const jobs = iso2 ? buildJobMarket(iso2) : null;
  const seatPeople = !!(ageMix && jobs && employment?.leaveDays != null);
  const survival = iso2 ? buildSurvival(iso2) : null;
  const obstacles = iso2 ? buildObstacles(iso2) : null;
  const seatFirstYears = !!(survival && obstacles);
  if (rich) {
    /* THE UNITED KINGDOM'S PAGE (2026-09-25, his goal of that day; the plan goal-2026-09-24/PLAN-2026-09-25-uk-country.md). Four
       turns and ten levels, each level one or two drawings (his clause 53), the two bar cards and the two character tables each
       two levels apart (clause 64), the one donut, nothing wider than its information:
         01 what it costs to open and to run: registering | the bill; what staff cost | employing people; running costs | insurance;
            the peers table, full width;
         02 borrowing, banking and red tape: borrowing | getting paid; dealing with the state | legal and admin costs;
         03 what to open, and where: London's margins by trade | time to sell; who lives here by age | the job market; the cities |
            what locals know; what households spend on | dealing with people (the age bars and the spending bar, two wholes cut
            into parts, keep a level between them);
         04 the first years: who is still trading | what holds small firms back (two fifths and three: eight columns and their names
            need the wider card).
       What customers earn leaves this page: its three figures were the pay pair printed under a second name (the goal's A12). */
    const sections = [
      { id: "take", label: "The tax burden" },
      { id: "setup", label: COPY.tiers.kicker },
      { id: "entry-bill", label: COPY.entryBill.kicker },
      { id: "hiring", label: COPY.pay.kicker },
      { id: "employment", label: COPY.employment.kicker },
      { id: "running-costs", label: "Running costs" },
      { id: "insurance", label: COPY.insurance.kicker },
      { id: "peers", label: "Against the peers" },
      { id: "financing", label: COPY.financing.kicker },
      { id: "banking", label: COPY.banking.kicker },
      { id: "character", label: COPY.character.state.kicker },
      { id: "paperwork", label: COPY.paperwork.kicker },
      { id: "money", label: COPY.londonMargins.kicker },
      { id: "exit", label: COPY.countryExit.kicker },
      ...(seatPeople ? [{ id: "age-mix", label: COPY.people.age.kicker }, { id: "job-market", label: COPY.jobMarket.kicker }] : []),
      { id: "cities", label: "The cities" },
      { id: "locals", label: COPY.locals.kicker },
      { id: "spend", label: "What households spend on" },
      { id: "character-people", label: COPY.character.people.kicker },
      ...(seatFirstYears ? [{ id: "first-years", label: COPY.firstYears.kicker }, { id: "obstacles", label: COPY.firstYears.obstaclesKicker }] : []),
    ];
    return (
      <>
        <div className="py-2" data-spine-body data-composition="depth">
          <Masthead name={name} iso2={iso2} hero={d.hero} />
          <Movement index="01" heading={COPY.chapters.costs} />
          <Band split="3-2">
            <Setup setup={d.setup} iso2={iso2} />
            <EntryBill bill={bill} steps={billSteps} licences={licences} />
          </Band>
          <Band split="1-1" stack="lg">
            <Hiring hiring={d.hiring} iso2={iso2} foot={false} hireCost />
            {/* WRITTEN OUT, NOT THROUGH A WRAPPER (the chain's census, 2026-09-25): a Box with a literal id and its KvGrid in its own
                JSX, so the census and the coverage gate both read the block the page draws. */}
            <Box id="employment" className="flex flex-col">
              <Rail icon="staffing-rota" kicker={COPY.employment.kicker} />
              <Focal figure={employment.focal.figure} words={employment.focal.words} />
              <KvGrid cells={seatPeople ? employment.cells.filter((c) => c.key !== "out") : employment.cells} under fill />
            </Box>
          </Band>
          <Band split="1-1" stack="lg">
            <RunningCostsRanged iso2={iso2 as string} costs={costs} />
            <InsuranceBars card={insurance} />
          </Band>
          <Peers table={peers} />
          <Movement index="02" heading={COPY.chapters.money} />
          {/* RED TAPE FIRST, THEN THE MONEY (2026-09-25): the two cards drawn on the world's range (running costs above, borrowing
              here) keep a level between them (his clause 64), and the peers table between them is not a level. */}
          <Band split="1-1" stack="lg">
            <CharacterCard iso2={iso2} which="state" />
            <Box id="paperwork" className="flex flex-col">
              <Rail icon="red-tape" kicker={COPY.paperwork.kicker} />
              <Focal figure={paperwork.focal.figure} words={paperwork.focal.words} />
              <KvGrid cells={paperwork.cells} under fill />
            </Box>
          </Band>
          <Band split="1-1" stack="lg">
            <FinancingRanged iso2={iso2 as string} card={financing} />
            <BankingRing card={banking} />
          </Band>
          <Movement index="03" heading={COPY.chapters.open} />
          <Band split="2-1" stack="lg">
            <LondonMarginBars margins={londonMargins} />
            <ExitCard exit={exitData} lean />
          </Band>
          {seatPeople && ageMix && jobs ? (
            <Band split="1-1" stack="lg">
              <AgeMix id="age-mix" data={ageMix} />
              <JobMarket id="job-market" data={jobs} />
            </Band>
          ) : null}
          <Band split="2-1" stack="lg">
            <Cities cards={cities} seat={null} />
            <LocalsKnow notes={locals} />
          </Band>
          <Band split="2-1" stack="lg">
            <SpendBar spend={spendData} />
            <CharacterCard iso2={iso2} which="people" />
          </Band>
          {seatFirstYears ? <Movement index="04" heading={COPY.chapters.firstYears} /> : null}
          {seatFirstYears && survival && obstacles ? (
            <Band split="2-3" stack="lg">
              <FirstYears id="first-years" data={survival} />
              <Obstacles id="obstacles" data={obstacles} />
            </Band>
          ) : null}
          <Close meta={d.meta} name={name} />
        </div>
        <OnThisPage sections={sections} />
      </>
    );
  }

  /* THE THIN COUNTRY, SEATED (MODEL.md 8.2's paragraph of that name; plan
     step 31's seventh dispatch, 2026-09-18, measured on Afghanistan, which
     drew 16 of 21). Every block is present on every country, drawn or
     seated, and the one omission PART 7 allows is `10 cities` on a country
     with no covered city. Four blocks used to self-omit on thin data and
     now draw the blocked seat where the card would stand, pairing with the
     same partner, so LONE CARD closes rather than opens: `03 setup` on the
     43 with no legal form (`hasSetup`), `09 peers` where the table does not
     resolve (`peers`, above), `12 money` where the engine holds under two
     credible margins (`hasMoney`, 173) and `16 locals` where no notes are
     authored (`locals`, 194). The counts are verify_archetype_copy's,
     measured over the taxonomy every run. The seats' words are COPY.blocked's
     and their kickers the drawn cards' own. BlockedSeat draws its own Box
     the way BentoMetric and AnswerCard do, so the four are blocks on the page
     (`data-blocked="1"`, BLOCK FLOOR counts them), and the census prints
     each as its card's other state since 2026-09-24 ("RankedBars or
     BlockedSeat" on `money`); their form to the checkers is `blocked-seat`,
     exempt from FOCAL and NO LEAD by its law.

     AND THE FIFTH THIN-COUNTRY SEAT, `10 cities` (plan step 49, 2026-09-19,
     the FLOOR bracket's option A): PART 7's one omission is withdrawn for
     this row; on the 90 countries the city list holds no row for, the seat
     stands in the cards' band with its composed line (`citiesSeat`, above),
     so Afghanistan reads 21 blocks where it read 20. The census's `cities`
     row carries both states since 2026-09-24 ("CityCards or BlockedSeat"),
     like the four above. */

  /* THE ORDER AND THE PAIRS ARE MODEL.md 8.2's (plan step 31, 2026-09-17, the
     first of six dispatches), with the twelve blocks that exist today seated
     where the composition puts them: the opening full width; turn one,
     registering beside the bill to register (seated by the third dispatch
     the same day), premises beside power and living costs (seated by the
     fourth dispatch, 2026-09-18), the workforce seat beside what
     staff cost, then the peers table full width; turn two, the cities beside
     what customers earn, the margin beside what locals know; turn three, the
     two character tables, the footing beside the easiest seat; the close full
     width. Blocks 01 and 02 were seated by the second dispatch the same day;
     18 and 19, the exit's pair, by the fifth (2026-09-18); the three chapter
     breaks by the sixth (2026-09-18), which also re-measured `07 | 08` and
     left it unseated on the seat's ink share (its band's comment); the four
     thin-country seats by the seventh (2026-09-18, the comment above the
     return). A band
     whose partner is not built yet
     holds its one card in its own Band, unpadded: the LONE CARD finding on it
     is expected and temporary, and the kit's only-child rule gives the
     survivor two thirds so the composition reads as a choice meanwhile.
     Three full widths, R1: the take, the peers, the close. */
  return (
    <>
      <div className="py-2" data-spine-body>
        {/* NO MAIN AND NO GUTTER OF ITS OWN (the goal's A13, 2026-09-24): every route that draws this body
           wraps it in SiteChrome, whose <main> is `max-w-content mx-auto px-6`; a second main here nested the
           landmark and doubled the gutter, 1024 of content at 1280 where the pages are built at 1072 and 295 at
           375 where they are built wider (measured on production). The harness wraps its renders the same way. */}
        <Masthead name={name} iso2={iso2} hero={d.hero} />
        {/* `01 glance | 02 world-seat` LEFT THE PAGE on 2026-09-20 by his word
            (rules/FOUNDER-VERDICTS.md, that date; MODEL.md 8.2 row 00's
            bracket): "at a glance becomes irrelevant because we already put it
            at the hero section", and "among the countries" is not drawn as a
            card of unrelated figures; its rent goes to the city cards, its
            payroll on-cost is the staff card's, its lending rate waits on the
            financing section he asked for. The builders stay (glance_rows.ts,
            world_seat_rows.ts) because the copy gates read their strings and
            the board reads the same modules; the components below draw
            nothing today and are kept until his corrections on the rest of
            the page land, then retired with the others they take with them. */}
        {/* CHAPTER TURN ONE (8.2, "What it costs to open, and to run"; plan step
            31's sixth dispatch, 2026-09-18): the kit's Movement, the muted index
            and one plain heading, no eyebrow and no icon (8.4; the cell page
            passes both and the kit draws neither). It spaces itself: 48 above
            (the chapter rung) and 12 below, which the next Band's own 32
            absorbs by margin collapse, so the heading sits 32 over its first
            band. The opening above carries no break (PART 1). The rail does
            not list the turns: the cell page, the other page on Movement,
            carries no rail at all, so there is no idiom for it. */}
        <Movement index="01" heading={COPY.chapters.costs} />
        {/* `03 setup | 04 entry-bill`, 3-2, the registering table wide and the
            bill narrow (8.2; plan step 31, third dispatch). MEASURED BEFORE IT
            WAS PAIRED, on GB with the page filter at every width: 1280, the
            table 624 by 320 and the bill 416 by 320 on one level, the bill's
            own content about 210 at that width, so its 110px of air is
            distributed around the 30 (57px between the figure and the
            hairline, about as much above) and no blank reaches the filter's
            120 floor; 1024, 566 and 378 by 320; 768, equal halves 344 by 337;
            375, stacked, the bill 238 against the table's 421. Zero holes on
            18 cards at three widths. The filter's blind spot, stated: the
            focal is a block-level leaf, so its full-width box counts as ink
            and the air to the right of "$148" is not measured; it is the
            cell's own composition (B4, one number, big, alone, with room
            around it) and was judged by eye in the dispatch's photographs.
            The table draws on 152 countries and the bill on 195; on the 43
            with no legal form on file THE SETUP SEAT stands where the table
            would, beside the same bill (the seventh dispatch, 2026-09-18;
            8.2's "THE THIN COUNTRY, SEATED"), so LONE CARD closes, and the
            band is always drawn because the seat exists for every country.
            THE SEATED BAND TAKES 2-3, NOT THE TABLE'S 3-2, by 8.4 rule 1
            (the taller card takes the wide side), MEASURED ON AFGHANISTAN
            with the probe, the page filter and the art-direction gate: at
            1280 the bill (on a country with no LLC row the guard has nothing
            to check against, so it prints its $50 at 30 and 7 days at 16,
            marked modelled in its foot) wants 221 of height at 416 and at
            624 alike, and the seat wants 149 at 624 (one line) or 171 at
            416 (two); so at 3-2 the seat stretched to 222 carries 109 of
            ink in 182 inside, 59 percent against the gate's E2 floor of 60,
            the sixth dispatch's fault on the workforce seat in a second
            place; at 2-3 it carries 131 in 182, 72 percent, and the bill
            stands at its own height on the wide side with no hole (the
            filter: 0 holes on 20 cards at 1280, 768 and 375). At 768 the
            two take equal halves, 344 by 238, the seat's two lines 131 in
            198, 66 percent; at 375 they stack at their own heights. */}
        {/* 3-2 WITH THE STEPS COMPACT (2026-09-25, measured both ways): at 2-3 the table truncated "Private Limited Company" at
            416 and the steps spread across 624 with their names wrapped in a 146px column; at 3-2 with the steps' wide form they stood
            two lines each and the bill card ran 187 past the table. The compact steps (the Stepper's `compact`) keep the table's
            width and bring the two cards within a line of each other. */}
        <Band split={hasSetup ? "3-2" : "2-3"}>
          {hasSetup ? (
            <Setup setup={d.setup} iso2={iso2} />
          ) : (
            <BlockedSeat id="setup" icon="register-cost" kicker={COPY.blocked.setup.kicker} line={COPY.blocked.setup.line} foot={COPY.blocked.setup.foot} />
          )}
          {/* The steps only beside the registering table (2026-09-25): where the table is seated (43 countries with no legal form on
              file; Afghanistan measured) the seat is one line, and the bill's tall steps beside it opened a 376 by 126 blank in the
              seat's card; there the bill keeps its short form. */}
          <EntryBill bill={bill} steps={hasSetup ? billSteps : null} licences={hasSetup ? licences : null} />
        </Band>
        {/* `05 premises` LEFT THE PAGE on 2026-09-20 by his word (COUNTRY-PAGE-
            SECTIONS-PLAN-2026-09-20.md, correction 6: "premises" is the wrong
            word and the wrong concept for a country page; rent per square
            metre goes to the CITY cards; the country page holds the costs that
            are the same everywhere in the country). `06 running-costs` now
            holds those and pairs with `08 hiring` below. */}
        {/* `07 workforce | 08 hiring`, 1-1 in 8.2, the seat on the left and the
            loud staff card on the right (its order list, its rhythm line
            "blocked-seat · pay-bars", its ledger "08, band 4, right"). THE PAIR
            STILL CANNOT BE SEATED, re-measured on 2026-09-18 (plan step 31's
            sixth dispatch) the day 08's placement lines landed, which is the
            day the first dispatch named. That dispatch had measured a 150 by
            156 void on the staff card at 520 and left each card in its own
            band, the staff card lean at 347. WITH THE LINES the staff card's
            void is gone: at 1-1 and 1280 the card at 520 (480 inside) carries
            a 190 by 60 blank, under the page filter's 120 floor, and the seat
            stretched to the staff card's 232 a 480 by 102 one, also under it;
            at 768's equal halves the staff card takes PART 5's phone row and
            runs 301 tall and the seat stretched to it opens a 304 by 168
            blank, which stack="lg" would close. What does not hold is the
            art-direction gate's E2 on the seat: 133 of ink in a card
            stretched to 232 is 57 percent against its floor of 60, a baseline
            of 0 that never rises. The seat cannot gain ink (its law is one
            line and a foot), and the staff card cannot lose the 11px that
            would lift the seat to 60 except by 8.2's own next move for `08`:
            the on-cost sentence and the informal line (91px of the card's
            face) go behind the plus, closed on arrival, and the card falls to
            about 177 inside, where the seat's 133 is 75 percent. So each still
            stands in its own band in 8.2's order: the seat at the survivor's
            two thirds at its own height, the staff card lean at 347, where it
            draws PART 5's phone row (the card is under 420) with the
            placement line under each full-width track and carries an 89 by
            102 blank, under the floor. One Band at 1-1 the day the plus lands. */}
        {/* `06 running-costs | 08 hiring`, 1-1 (2026-09-20): what it costs to
            run beside what staff cost, the two cost cards on one level. The
            workforce seat (`07`) is off the page by his word of 2026-09-19 (no
            "not gathered yet" card in front of him; its three figures wait on
            DATA-REQUIREMENTS items 40 and 17 and the card returns with them,
            under a title he will name: "Who you can hire" is wrong, correction
            8). */}
        {/* ONE COLUMN UNTIL lg (2026-09-24): the running costs hold two rows and one line since the copy rewrite, and at 768's equal halves they stood 90 short of what staff cost (the page laws, CARD FOOT BLANK; Afghanistan's, one row and one line, 132). */}
        {costs ? (
          <Band split="1-1" stack="lg">
            <RunningCosts costs={costs} />
            <Hiring hiring={d.hiring} iso2={iso2} />
          </Band>
        ) : (
          <Band split="1-1">
            <Hiring hiring={d.hiring} iso2={iso2} />
          </Band>
        )}
        <Peers table={peers} />
        {/* CHAPTER TURN TWO (8.2, "Where to open it, and what to open"): the
            page's biggest volume jump, the break and the area band in one
            breath. */}
        <Movement index="02" heading={COPY.chapters.where} />
        {/* `10 cities | 13 customers`, 3-2 cities wide in 8.2: THE PAIR CANNOT BE
            SEATED TODAY, measured on 2026-09-17 (plan step 31) with the page
            filter at 1280 and every split tried. The four field cards need
            600px of inner width (CityCards' `minmax(9rem,1fr)` columns), and
            3-2 gives 584: the cards fold to three and one, a 389 by 210 hole.
            At 2-1 the cards sit four in a row at 693 and the strip beside them
            at 347 carries 132px of air, twelve over the filter's floor (the
            strip's content is 199 tall against the cards' 334; 8.2's own
            heights on file, 181 and 199, predate the photograph). 1-1 and 2-3
            fold the cards too. So each stands in its own band, in 8.2's
            order, unpadded, and the filter reports LONE CARD on both; the
            pair seats the day the strip gains its `reach` row (8.1, spending
            per citizen) or the composition re-decides it.
            THE SEAT TAKES THE CARDS' BAND (plan step 49, 2026-09-19): on the
            90 countries with no covered city the seat stands where the cards
            would, alone at the survivor's two thirds in 8.2's order, so LONE
            CARD fires on it as it fires on the cards (the same row GB carries
            on this band) and BLOCK FLOOR counts it. A seat needs no 600px, so
            `10 | 13` could pair on these 90 where the cards cannot; that is
            8.4 rule 1's to measure, not this dispatch's to guess. */}
        {/* THE SECOND TURN TO HIS PAGE LAWS OF 2026-09-20 (clauses 50 to 58) and
            the loop's own composition, since his corrections on sections 10
            to 21 are not in yet (DOCTRINE 16: the loop decides, records it as
            reversible, and never asks him to look). Three pairings were
            measured on the live render this evening and two refused: 8.2's
            `10 | 13` at 3-2 (the four city cards wrap in a 584px seat, 389 by
            216 of air; the strip beside them 376 by 366) and `13 | 16` at 1-1
            (the strip stretched to the notes' 323 carries 480 by 150). What
            holds: `10 cities | 16 locals` at 2-1, the four field cards wide
            beside the notes, which stand about as tall (the notes at 307
            inside, under half the page, clause 51); and `12 money | 13
            customers` at 2-1, the margin bars wide beside the strip in its
            phone form at the narrow third. Each level holds one visual card
            and one text card, or two visuals. Where a card is a seat the two
            stand in their own bands, the precedent for a drawn card beside a
            seat. */}
        {(cities || citiesSeat) && locals ? (
          <Band split="2-1" stack="lg">
            <Cities cards={cities} seat={citiesSeat} />
            <LocalsKnow notes={locals} />
          </Band>
        ) : (
          <>
            {cities || citiesSeat ? (
              <Band split="2-1">
                <Cities cards={cities} seat={citiesSeat} />
              </Band>
            ) : null}
            {locals ? (
              <Band split="2-3" stack="lg">
                <LocalsKnow notes={locals} />
              </Band>
            ) : (
              <Band split="2-3" stack="lg">
                <BlockedSeat id="locals" icon="locals-know" kicker={COPY.blocked.locals.kicker} line={COPY.blocked.locals.line} foot={COPY.blocked.locals.foot} />
              </Band>
            )}
          </>
        )}
        {hasMoney && customers ? (
          <Band split="2-1" stack="lg">
            <Money money={d.money} card={margin} />
            <Customers strip={customers} />
          </Band>
        ) : (
          <>
            {hasMoney ? (
              <Band split="2-1" stack="lg">
                <Money money={d.money} card={margin} />
              </Band>
            ) : (
              <Band split="2-1" stack="lg">
                <BlockedSeat id="money" icon="owner-keeps" kicker={COPY.blocked.money.kicker} line={COPY.blocked.money.line} foot={COPY.blocked.money.foot} />
              </Band>
            )}
            {customers ? (
              <Band split="2-1">
                <Customers strip={customers} />
              </Band>
            ) : null}
          </>
        )}
        {/* CHAPTER TURN THREE (8.2, "What the place is like"): the character
            pair, five traits each by his ruling of 2026-09-19, then the exit.
            `17 footing` LEFT THE PAGE on 2026-09-20: its two scores are the
            hero board's first two rows (clean dealing, admin ease), and a
            figure does not print twice on one page. `11 easiest` is off the
            page until its six figures exist (no "not gathered yet" card, his
            word of 2026-09-19). `18 checks` left the page (three sentences,
            no figure; the close card says why) and `19 compare` is the close
            card's pill (M21: the pill on every page is the compare tool), so
            the exit is one card. */}
        <Movement index="03" heading={COPY.chapters.place} />
        <Character iso2={iso2} />
        {/* `18 spend | 17 exit`, 2-1 (2026-09-23): where a household's money
            goes, seven parts of a hundred, beside how long a sale takes.
            NEITHER STANDS FULL WIDTH, and the reason is his, twice stated
            (2026-08-25, verify_section_bands' own header): "for every
            subsection that stretches left to right full width, I think we
            should ban it except hero section". The exit card shipped full
            width this morning and the gate counted it, which is how the rule
            was found again; the spend card was written the same way and both
            are paired here. The page's full widths stay the three the model
            allows: the opening, the peers table and the close.
            THE PAIR IS THE ONLY ONE AVAILABLE, and that is a measurement, not
            a preference: at 1280 the page's other short cards are the margin
            bars (235) and the earnings strip (211), and the exit is a range
            strip, which clause 64 keeps a level clear of the other strip. So
            the tall new card and the short new card take one level, the table
            on the wide side by 8.4 rule 1. */}
        <Band split="2-1" stack="lg">
          <SpendCard spend={buildCountrySpend(iso2 ?? "")} />
          <ExitCard exit={buildCountryExit(iso2 ?? "")} />
        </Band>
        <Close meta={d.meta} name={name} />
      </div>
      <OnThisPage sections={RAIL_SECTIONS} />
    </>
  );
}

export default SpineCountryBody;
