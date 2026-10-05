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
 * per task, each with its own form from the kit and its own entry in the
 * rail list the composition builds beside its zones. The flag stays shut until the page is whole: a page with
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
import { Focal } from "./focal";
import { HireAllIn } from "./HireAllIn";
import { LeaseByLaw } from "./LeaseByLaw";
import { FromAbroad } from "./FromAbroad";
import { IfItFails } from "./IfItFails";
import { buildIfItFails } from "@/lib/spine/sections/if_it_fails";
import { buildFromAbroad } from "@/lib/spine/sections/from_abroad";
import { buildLeaseByLaw } from "@/lib/spine/sections/lease_by_law";
import { buildHireAllIn } from "@/lib/spine/sections/hire_all_in";
import { lockedLevelKeys } from "@/lib/monetization/levels";
import { lockedBody, type LockSpec } from "@/components/spine/LockedSection";
import { Box, Fig, Ico, Rail, SampleTag, usd } from "@/components/spine/kit";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
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
import { type KvCell } from "@/components/spine/archetypes/KvGrid";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import { ChangeRun } from "@/components/spine/archetypes/DatedChanges";
import { buildRuleChanges, buildPayments, latestChange, lawValue, nextChange, ruleAmount, ruleNote, ruleRows, ruleValue, type PaymentsCard } from "@/lib/spine/sections/country_rules";
import { convertToUsd } from "@/lib/finance/fx";
import type { ChangeRow } from "@/components/spine/archetypes/DatedChanges";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { buildEntryBill, buildEntryBillDetail, type EntryBillData } from "@/lib/spine/entry_bill_rows";
import { buildHowToSteps, type HowToStepsData } from "@/lib/spine/howto_steps_rows";
import { buildCountryLicences } from "@/lib/spine/country_licences_rows";
import { Stepper, STEPPER_MIN } from "@/components/spine/archetypes/Stepper";
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";
import { WorldRangeRows, type WorldRangeRow } from "@/components/spine/charts/WorldRange";
import { BarList } from "@/components/spine/charts/BarList";
import { DonutStat } from "@/components/spine/charts/DonutStat";
import { HireLever } from "@/components/spine/interact/HireLever";
import type { AtlasIconId } from "@/components/brand/icons";
import { Switch } from "@/components/spine/interact/Switch";
import { CoverPicker } from "@/components/spine/interact/CoverPicker";
import { LoanLever } from "@/components/spine/interact/LoanLever";
import { ShareBar } from "@/components/spine/archetypes/ShareBar";
import { RangePair } from "@/components/spine/charts/RangePair";
import { countryFigure } from "@/lib/facts/country_shard";
import { worldRange, worldValues } from "@/lib/spine/world_stats";
import { peerMarks } from "@/lib/spine/peer_marks";
import { getCountryProfile } from "@/lib/economic_profile";
import { usdCents } from "@/components/spine/kit";
import {
  buildCountryEmployment,
  buildCountryInsurance,
  buildCountryFinancing,
  buildCountryBanking,
  buildCountryPaperwork,
  buildCountryClosing,
  buildLondonTradeSales,
  londonMiddleSales,
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
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { checkedDateFor } from "@/lib/spine/checked";
import { DepthNotifyFoot } from "@/components/spine/DepthNotifyFoot";
import { countryPageTarget } from "@/lib/geo/page_targets";

/**
 * THE THREE LOUD MOMENTS, declared where they are lit or held (MODEL.md 8.2's
 * seat table; plan step 40, 2026-09-19). Seat one is the masthead's AnswerCard
 * below (`tone` defaults to the accent), seat two the staff card (`Hiring`),
 * held empty since his ruling 30 took the average's bar off it, seat three the
 * money card's leader, unlit by his 2026-09-08 "quiet". The census prints this
 * ledger; the loud-seats gate holds every render to it. The table's word for
 * seat three, RESERVED, is this vocabulary's HELD EMPTY. Literals only, read
 * from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 take", figure: "the effective rate, 40", state: "LIT", condition: "8.2: the page's only 40, in `--terra-text`, before anything else is read; the regime is held for 58 of 195 and where it is not the card prints the state word and no accent (the AnswerCard's data-state no-answer), the withheld state the gate reads off the render" },
  { seat: 2, card: "08 hiring", figure: "none: the average salary's bar left the card", state: "HELD EMPTY", condition: "his interview of 2026-09-26, answer 30 (milestone 1, M3): the header and the peers keep the salary; the card prints the wage floor and the hire's lever in ink; lit again only by a figure that answers the card. Before: 8.2: 195 pairs, 2 withheld (PayBars' data-withheld); the placement sentence beside each; the accent is the AVERAGE, not the wage floor" },
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
/* THE RAIL GROUPED BY CHAPTER, IN THE PAGE'S ORDER (2026-09-26, the United Kingdom's page at 1600): twenty-three names in one
   list at 12px read as a column of texture, with nothing to say where a chapter began, and four of them stood out of the page's
   order (borrowing and getting paid before the state and the paperwork, which the page draws first). A section may name its
   chapter; the rail then heads each run of sections with the chapter's number and heading, the page's own four turns, and the
   links keep their size. A list with no chapters draws flat, as before. */
type RailSection = { id: string; label: string; chapter?: string };
function OnThisPage({ sections, chapters }: { sections: RailSection[]; chapters?: Record<string, { index: string; heading: string }> }) {
  if (sections.length === 0) return null;
  const groups: Array<{ chapter?: string; items: RailSection[] }> = [];
  for (const s of sections) {
    const key = chapters && s.chapter && chapters[s.chapter] ? s.chapter : undefined;
    const last = groups[groups.length - 1];
    if (last && last.chapter === key) last.items.push(s);
    else groups.push({ chapter: key, items: [s] });
  }
  const link = (s: RailSection) => (
    <li key={s.id}>
      <a href={`#${s.id}`} className="block max-w-[18ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]">
        {s.label}
      </a>
    </li>
  );
  return (
    /* Never taller than the window: grouped, the UK's rail is 777px, inside a 1536 by 864 screen; a shorter window scrolls it. */
    <nav aria-label="On this page" className="fixed right-6 top-1/2 hidden max-h-[calc(100vh-2rem)] -translate-y-1/2 overflow-y-auto 2xl:block">
      <div className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">On this page</div>
      {groups.map((g, gi) =>
        g.chapter && chapters ? (
          <div key={`${g.chapter}-${gi}`} className="mt-4">
            <div className="flex max-w-[20ch] gap-2 text-[length:var(--t-micro)] font-semibold leading-snug text-[var(--c-ink)]">
              <span className="tabular-nums text-[var(--c-muted)]">{chapters[g.chapter].index}</span>
              <span>{chapters[g.chapter].heading}</span>
            </div>
            <ol className="mt-2 space-y-2">{g.items.map(link)}</ol>
          </div>
        ) : (
          <ol key={`flat-${gi}`} className={chapters ? "mt-3 space-y-2" : "mt-2 space-y-2"}>{g.items.map(link)}</ol>
        ),
      )}
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
          prevLabel={COPY.cities.prev}
          nextLabel={COPY.cities.next}
        />
      </Box>
    );
  }
  if (seat) return <BlockedSeat id="cities" icon="best-areas" kicker={COPY.blocked.cities.kicker} line={seat.line} foot={COPY.blocked.cities.foot} />;
  return null;
}

function Peers({ table, zone = false }: { table: PeerTable | null; zone?: boolean }) {
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
  if (table) return <CompareTable id="peers" kicker={COPY.peers.kicker} icon="benchmark" rows={table.rows} columns={table.columns} zone={zone} />;
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
function CharacterCard({ iso2, which, zone = false }: { iso2?: string; which: "state" | "people"; zone?: boolean }) {
  if (!iso2) return null;
  const t = buildCharacterTables(iso2);
  if (which === "state") {
    if (!t.state) return null;
    return (
      <Box id="character">
        <Rail icon="bank" kicker={COPY.character.state.kicker} sample />
        {/* AT THE BODY RUNG ON THE BAND PAGE (2026-10-04; his rule 34, "text too small", and research R2: a row reads at 14): the
            trait names and the poles at 14, the poles in ink2. Every other country keeps the micro rung he kept on 2026-08-30. */}
        <SpectraTable rows={t.state.rows} dot={t.state.dot} foot={t.state.foot} scale={zone ? "body" : "micro"} />
      </Box>
    );
  }
  if (!t.people) return null;
  return (
    <Box id="character-people" data-block="character-people">
      <Rail icon="who-for" kicker={COPY.character.people.kicker} sample />
      <SpectraTable rows={t.people.rows} dot={t.people.dot} foot={t.people.foot} scale={zone ? "body" : "micro"} />
    </Box>
  );
}


/* ===== THE UNITED KINGDOM'S CARDS ON THE NEW CHARTS (2026-09-25, his message of that day: "the numbers ... with no relation to
   each other", "the gradient is barely used", "the sections look dead"; his shadcn blocks as the pattern: the bullet chart, the
   bar card, the donut with its centre figure). Every figure that the world holds for every country is drawn on the world's
   range; the ranked lists are bars with the accent's gradient; a whole is a ring, or one bar cut into its parts. ===== */

/** RUNNING COSTS, WHERE THE UNITED KINGDOM STANDS: the business electricity price and diesel on the world's range, the cost of living on the city scale. */
function RunningCostsRanged({ iso2, costs, rates = null }: { iso2: string; costs: RunningCostsData; rates?: FactRow[] | null }) {
  const profile = getCountryProfile(iso2);
  const rows: WorldRangeRow[] = [];
  const kwh = profile.electricity_usd_per_kwh_commercial;
  const kwhRange = worldRange("electricity_usd_per_kwh_commercial");
  /* THE WORLD AND THE PEERS ON THE TRACK (2026-10-04, the UK page reform): every country's price a hairline (the fill left out,
     world_stats.ts), the comparison table's four peers as hollow marks named in a key line (peer_marks.ts). */
  if (typeof kwh === "number" && kwh > 0 && kwhRange) rows.push({ key: "electricity", icon: "unit-economics", label: COPY.ranged.electricity, value: kwh, display: usdCents(kwh), unit: COPY.ranged.perKwh, range: kwhRange, fmt: usdCents, headless: true, hairlines: worldValues("electricity_usd_per_kwh_commercial"), peers: peerMarks(iso2, "electricity_usd_per_kwh_commercial"), peersWord: COPY.ranged.peers });
  const diesel = profile.diesel_usd_per_liter;
  const dieselRange = worldRange("diesel_usd_per_liter");
  /* NO WORLD TRACK FOR DIESEL (2026-09-25): the United Kingdom's pump price is the week of 21 September 2026 (195.5p), the other
     countries' figures are older, and the gap to the next country (26%) is the two dates, not the two countries. */
  void dieselRange;
  /* WHERE THE PREMISES RULES STAND UNDER THE TRACK, DIESEL IS THEIR FIRST ROW (2026-10-04): a headed row of its own set its figure
     beside its label while the rules' figures stood on the right edge under it, two alignments in one section (the phone photo
     of the running costs); in the ruled list its figure shares their edge. */
  const dieselRow: FactRow | null = typeof diesel === "number" && diesel > 0 ? { key: "diesel", icon: "transit", label: COPY.ranged.diesel, value: `${usdCents(diesel)}${COPY.ranged.perLitre}`, note: COPY.ranged.dieselNote } : null;
  if (dieselRow && !(rates && rates.length)) rows.push({ key: "diesel", icon: "transit", label: COPY.ranged.diesel, value: diesel as number, display: usdCents(diesel as number), unit: COPY.ranged.perLitre, range: null, fmt: usdCents });
  const livingSpread = cityScaleSpread();
  return (
    <Box id="running-costs" className="flex flex-col">
      <Rail icon="cost-breakdown" kicker={COPY.runningCosts.kicker} />
      {typeof kwh === "number" && kwh > 0 ? <Focal figure={usdCents(kwh)} words={COPY.ranged.electricityWords} /> : null}
      <WorldRangeRows rows={rows} ends={COPY.ranged.ends} />
      {/* THE COST OF LIVING ON ITS SCALE'S OWN TRACK (2026-09-25): twenty blocks were the "cubic bars" he called a catastrophe in
          the hero, and they set a third drawing in one card beside the electricity's track; now the same track, 1 to 100 over the
          covered cities, the middle half shaded, no median ticked (plan 06, task B2), the ends never named (his ruling of 2026-09-20). Where the
          cities' spread cannot be read, the blocks stand as before. */}
      {/* THE PREMISES TAX IN PLACE OF THE COST-OF-LIVING SCALE (2026-10-04; research R4 and R5): "41/100" was a scale the site built
          over its covered cities and read as a score (clause 17); where the country's rules hold its business rates, the relief
          and the multipliers a small shop pays stand here instead, in the law's own units. */}
      {rates && rates.length ? (
        <div className="mt-5 border-t border-[var(--c-border)] pt-1">
          <FactRows rows={dieselRow ? [dieselRow, ...rates] : rates} />
        </div>
      ) : costs.livingOnCityScale != null && livingSpread ? (
        <div className="mt-5 border-t border-[var(--c-border)] pt-4">
          <WorldRangeRows rows={[{ key: "living", icon: "spending-power", label: COPY.runningCosts.rows.living, value: costs.livingOnCityScale, display: String(costs.livingOnCityScale), unit: COPY.runningCosts.units.of100, range: livingSpread, fmt: (v) => String(Math.round(v)), level: costs.levels.living ? COPY.heroBoard.levels[costs.levels.living] : null }]} ends={COPY.ranged.ends} />
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
  const I = COPY.insurance;
  /* THE COVERS TICK (goal 2026-09-26, M3; src/components/spine/interact/CoverPicker.tsx): the figure is what the ticked covers cost
     a year, where it was the law's minimum cover ($6.6M), which read as a cost; the minimum is the required row's words now. */
  const required = card.covers.find((c) => c.required);
  return (
    <Box id="insurance" className="flex flex-col">
      <Rail icon="safety" kicker={I.kicker} />
      <CoverPicker
        covers={card.covers}
        fill
        words={{
          focal: I.tickedWords,
          required: I.required,
          minimum: required && card.minCover ? I.minimumWords.replace("{cover}", usd(card.minCover)) : null,
          aYear: I.aYear,
          tick: I.tick,
        }}
      />
    </Box>
  );
}

/** BORROWING: the rate on a new small-business loan as the figure and on the world's range; the central bank's rate, the government's loans and the grants as cells. */
function FinancingRanged({ iso2, card, cells = null }: { iso2: string; card: DepthCard; cells?: KvCell[] | null }) {
  const profile = getCountryProfile(iso2);
  const rate = profile.bank_lending_rate_pct;
  const range = worldRange("bank_lending_rate_pct");
  const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;
  /* THE CENTRAL BANK'S RATE ON THE TRACK, NOT A ROW UNDER IT (2026-10-04): the rate lenders start from, read against what a small
     firm pays, is the track's own reference (a triangle above it, named in the key); its row would print the figure twice. */
  /* The profile holds the lending rate as a share (0.0661) and the shard the central bank's as a percent (3.75): one unit on the
     track, the share. A rate outside the world's range is not placed (the track would pin it to an end). */
  const baseShare = typeof card.baseRate === "number" && card.baseRate > 0 ? card.baseRate / 100 : null;
  const base = baseShare != null && range && baseShare >= range.min && baseShare <= range.max ? baseShare : null;
  const rows: WorldRangeRow[] = typeof rate === "number" && rate > 0 && range ? [{ key: "lending", label: COPY.ranged.lending, value: rate, display: pct(rate), range, fmt: pct, scale: "log", hairlines: worldValues("bank_lending_rate_pct"), peers: peerMarks(iso2, "bank_lending_rate_pct"), peersWord: COPY.ranged.peers, refs: base != null ? [{ key: "base", label: COPY.financing.cells.base, value: base, display: String(card.cells.find((c) => c.key === "base")?.value ?? "") || undefined }] : null }] : [];
  /* THE SCHEME'S OWN RANGE IN POUNDS (rules.json, financing): the dollar range is the site's comparison figure, the note says what
     the scheme itself lends ("£500 to £25,000, 7.5% fixed"). */
  const loMin = ruleValue(iso2, "financing", "start-up-loan-min");
  const loMax = ruleValue(iso2, "financing", "start-up-loan-max");
  const rest = (cells ?? card.cells)
    .filter((c) => !(base != null && c.key === "base"))
    .map((c) => (c.key === "startup" && loMin && loMax && card.loan ? { ...c, note: COPY.financing.notes.startupLocal.replace("{min}", loMin).replace("{max}", loMax).replace("{rate}", `${card.loan.rate}%`) } : c));
  return (
    <Box id="financing" className="flex flex-col">
      <Rail icon="raise-money" kicker={COPY.financing.kicker} />
      <Focal figure={card.focal.figure} words={card.focal.words} />
      {rows.length ? <div className="mb-5"><WorldRangeRows rows={rows} headless ends={COPY.ranged.ends} /></div> : null}
      <FactRows rows={rest} />
      {/* THE LOAN'S MONTHLY COST (goal 2026-09-26, M3): the start-up loan's own amounts, rate and term, the repayment a month. */}
      {card.loan ? <LoanLever min={card.loan.min} max={card.loan.max} rate={card.loan.rate} termMin={COPY.financing.startupTerm.min} termMax={COPY.financing.startupTerm.max} words={COPY.financing.loan} /> : null}
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
      {/* THE CELLS TAKE THE SPARE HEIGHT (2026-09-26): beside the borrowing card and its loan lever the ring's card stood 144px
          taller than its content; in one column the cells' row takes what is left and draws ruled rows (FactRows). */}
      <div className="grid flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-5 [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:grid-rows-none [@container(min-width:600px)]:items-center">
        <DonutStat parts={card.parts} center={`${Math.round(lead.share)}%`} centerWords={COPY.banking.centerWords.replace("{part}", lead.name.toLowerCase())} aria={`${COPY.banking.donut}: ${card.parts.map((p) => `${p.name} ${p.share}%`).join(", ")}`} />
        <FactRows rows={[{ key: "fee", icon: "sale-tag", label: COPY.banking.cells.fee, value: card.focal.figure, note: card.focal.words, confidence: "modeled" }, ...card.cells]} />
      </div>
    </Box>
  );
}

/* ===== THE COUNTRY'S OWN CONTEXT (2026-10-04, the UK page reform; his words that day: "there has to be some context below, there
   has to be some hot stuff, some gold nuggets ... but we should avoid going and making each section with a line of sentences
   below"). Each section below reads the sourced files of research R6 through country_rules.ts and prints label and figure rows,
   never a sentence. ===== */

/** The dated changes a lead set opens with (country_rules.ts): the ones a person opening a small business meets first. */
/* The changes a person opening a small business meets first; the run shows as many as the coming run holds (levelShown), so the
   two stand level on a desktop. The start-up loan rate and the rates multipliers wait behind the plus because their sections print
   them already (the borrowing rows, the running costs rows); the minimum wage leads although the staff rows print £12.71, because
   the change itself (from £12.21, in April) is the news. */
const CHANGES_LEAD = ["minimum-wage-21", "sick-pay-start", "incorporation-fee", "employer-ni"];
const todayIso = () => new Date().toISOString().slice(0, 10);
/* THE TWO RUNS STAND LEVEL (2026-10-04; his ruling of 2026-09-20, blank space is a fault): side by side from 768, the recent run
   shows as many rows as the coming run (four at the least, never more than its lead rows), so neither column ends 140px above
   the other; a rate and its threshold are never cut apart by the plus. */
function levelShown(rows: ChangeRow[], lead: number, coming: number): number {
  let n = Math.min(lead, Math.max(4, coming), rows.length);
  const base = (k: string) => k.replace(/-(rate|threshold)$/, "");
  if (n > 0 && n < rows.length && base(rows[n].key) === base(rows[n - 1].key)) n += 1;
  return n;
}

/** RULE CHANGES COMING and RECENT RULE CHANGES: two sections side by side, each a run of dated changes, a date, the item and its
 *  two values (DatedChanges.tsx `ChangeRun`). The changes come from the body, built once. */
function RuleChangesComing({ rows }: { rows: ChangeRow[] }) {
  if (rows.length === 0) return null;
  return (
    <Box id="changes-coming" className="flex flex-col">
      <Rail icon="change" kicker={COPY.changes.comingKicker} />
      <ChangeRun rows={rows} />
    </Box>
  );
}
function RuleChangesMade({ rows, shown }: { rows: ChangeRow[]; shown: number }) {
  /* `moreOne`: a single hidden change reads "1 more change", never "1 more changes". */
  if (rows.length === 0) return null;
  return (
    <Box id="changes" className="flex flex-col">
      <Rail icon="freshness" kicker={COPY.changes.madeKicker} />
      {/* The newest of the lead rows show, as many as the coming run holds (levelShown), the rest wait behind the plus. */}
      <ChangeRun rows={rows} shown={shown} more={COPY.changes.more} moreOne={COPY.changes.moreOne} />
    </Box>
  );
}

/** INSURANCE, WHAT THE LAW REQUIRES: the minimum cover as the figure, the fines as rows. No premium prints: no insurer or broker
 *  publishes a typical small-business premium (research R6), so the four prices the seed held left with their sum. */
function InsuranceRules({ iso2 }: { iso2: string }) {
  const cover = ruleValue(iso2, "insurance", "employers-liability-cover");
  const rows = ruleRows(iso2, "insurance", [
    { key: "employers-liability-fine", icon: "red-tape" },
    { key: "certificate-fine", icon: "filings" },
  ]);
  if (!cover || !rows) return null;
  return (
    <Box id="insurance" className="flex flex-col">
      <Rail icon="safety" kicker={COPY.insurance.kicker} />
      <Focal figure={cover} words={COPY.rulesRows.insuranceWords} />
      <FactRows rows={rows} />
    </Box>
  );
}

/** GETTING PAID, FROM THE SOURCED SPLIT: how shoppers pay (a retail survey, by number of payments) as the ring, its largest share at
 *  the centre; the card readers' fees, their payouts, cash across all payments then and now, and the law on late payment as rows. */
function PaymentsRing({ iso2, card }: { iso2: string; card: PaymentsCard }) {
  const P = COPY.rulesRows.payments;
  const lead = [...card.parts].sort((a, b) => b.share - a.share)[0];
  /* As the source prints it: a fee of 1.69% is never 1.7% (the readers' price pages print two places). */
  const pct = (v: number) => `${v}%`;
  const rows: FactRow[] = [];
  if (card.feeLow != null && card.feeHigh != null) rows.push({ key: "readers", icon: "sale-tag", label: P.readers, value: card.feeLow === card.feeHigh ? pct(card.feeLow) : `${pct(card.feeLow)} to ${pct(card.feeHigh)}`, note: P.readersNote });
  if (card.payoutDays != null) rows.push({ key: "payout", icon: "freshness", label: P.payout, value: card.payoutDays === 1 ? P.payoutDay : P.payoutDays.replace("{n}", String(card.payoutDays)), note: card.payoutFast ? P.payoutNote : null });
  if (card.cash) rows.push({ key: "cash", icon: "currency-stability", label: P.cash, value: pct(card.cash.now), note: P.cashNote.replace("{then}", pct(card.cash.then)).replace("{thenYear}", card.cash.thenYear) });
  const law = ruleRows(iso2, "paying", [
    { key: "statutory-interest", icon: "red-tape" },
    { key: "default-payment-period", icon: "payments" },
  ], 1);
  if (law) rows.push(...law);
  return (
    <Box id="banking" className="flex flex-col [container-type:inline-size]">
      <Rail icon="payments" kicker={COPY.banking.kicker} />
      <div className="grid grid-cols-1 gap-5 [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:items-start">
        {/* THE RING'S BASIS IS ITS CAPTION, ABOVE IT (2026-10-04): at the section's foot, and then under the ring, the ring's "Cash 19%"
            (shop sales) and the row's "Cash, all payments 8%" still read as one figure twice (the design review); read first, the
            caption says what the ring counts before the eye reaches a share. */}
        <div className="min-w-0">
          <p data-basis="" className="mb-3 text-[length:var(--t-micro)] font-medium leading-4 text-[var(--c-ink2)]">{P.basis.replace("{period}", card.period)}</p>
          <DonutStat parts={card.parts} center={pct(lead.share)} centerWords={P.centerWords.replace("{part}", lead.name.toLowerCase())} aria={`${COPY.banking.donut}: ${card.parts.map((p) => `${p.name} ${p.share}%`).join(", ")}`} />
        </div>
        <FactRows rows={rows} />
      </div>
    </Box>
  );
}

/** WHAT LONDON'S TRADES TAKE, TRADE BY TRADE (plan 06, task B3b): the register's typical yearly sales as a bar list with each trade's
 *  glyph; each name opens its London page, whose head prints the same figure. */
const SHOWN_MARGINS = 7;
function LondonSalesBars({ sales }: { sales: NonNullable<ReturnType<typeof buildLondonTradeSales>> }) {
  const L = COPY.londonSales;
  /* THE CARD'S ONE FIGURE, THE MIDDLE TRADE (2026-09-25, the model laws' FOCAL on the UK page): the median of every London trade
     the list holds, the seven drawn and the rest behind the plus, so each bar reads against it. With an even count it is the
     midpoint of the two middle trades, printed in the rows' own notation. */
  const middle = londonMiddleSales(sales);
  const middleText = usd(middle);
  return (
    <Box id="money" className="flex flex-col">
      <Rail icon="owner-keeps" kicker={L.kicker} />
      <Focal figure={middleText} words={L.focalWords} />
      {/* SEVEN DRAWN, THE REST ON THE PLUS (his clause 58, parts behind a click): sixteen rows stood the card 717 tall beside a
          card of 300. Eight until the card took its figure (2026-09-25): the figure's 40px stretched the time-to-sell card beside
          it into a 153 by 120 hole (the chain's gathered-emptiness, E6), and the seventh row keeps the level at its old height.
          The bars share one scale, the list's highest, so the plus's rows read against the same top. */}
      {/* THE MIDDLE DRAWN (goal 2026-09-26, M6): the figure is the middle trade's, so every track carries a tick at it and the key
          under the list names it; a reader sees which trades keep more than the middle without reading a percent. */}
      <BarList items={sales.rows.slice(0, SHOWN_MARGINS).map((r) => ({ key: r.key, label: r.name, value: r.value, display: usd(r.value), href: r.href, icon: r.icon, prov: r.prov }))} max={sales.worldMax} reference={{ value: middle, label: L.middleKey }} />
      {sales.rows.length > SHOWN_MARGINS ? <DetailPanel name="money-more" summary={L.more.replace("{n}", String(sales.rows.length - SHOWN_MARGINS))} rows={sales.rows.slice(SHOWN_MARGINS).map((r) => ({ label: r.name, value: usd(r.value) }))} /> : null}
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
        {/* THE FOOD MONEY BRACKETED (goal 2026-09-26, M6): the figure is eating out's share of the food money, so the two parts
            that make the food money carry a bracket named "Food". */}
        <ShareBar parts={spend.rows.map((r) => ({ key: r.key, name: r.name, share: r.value }))} lead={[SPEND_FOOD_OUT, SPEND_FOOD_IN]} residualKey={SPEND_RESIDUAL} tall fill bracket={COPY.countrySpend.bracket} />
      </div>
    </Box>
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
    /* THE FEE IN THE LAW'S POUNDS BESIDE THE PAGE'S DOLLARS (the design review, 2026-10-04: "Incorporation fee £50 to £100" in the
       changes and "$133" here read as two fees): where the change file holds the fee in force, the line says what the $133 is. */
    const localFee = oneFee ? latestChange(bill.iso2, "incorporation-fee", todayIso())?.from ?? null : null;
    return (
      <Box id="entry-bill" data-visual="1" className="flex flex-col">
        <Rail icon="startup-cost" kicker={COPY.entryBill.kicker} />
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{bill.figure}</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{oneFee ? (localFee ? COPY.entryBill.focalWordsLocalFee.replace("{fee}", localFee).replace("{n}", String(free.length)) : COPY.entryBill.focalWordsOneFee.replace("{n}", String(free.length))) : COPY.entryBill.focalWords}</p>
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
function Hiring({ hiring, iso2, foot = true, hireCost = false, rules = null }: { hiring: any; iso2?: string; foot?: boolean; hireCost?: boolean; rules?: FactRow[] | null }) {
  const pay = iso2 ? buildPayBars(iso2) : null;
  const addPct = hiring?.payroll_only_multiplier != null && isNum(hiring?.employer_payroll_pct) ? hiring.employer_payroll_pct : undefined;
  const labour = hiring?.labour_force_pct;
  const informal = hiring?.informal_share_pct;
  if (!pay && !isNum(addPct) && !isNum(labour) && !isNum(informal)) return null;
  const tagged = (pay && pay.confidence !== "measured") || (typeof hiring?._meta?.confidence === "string" && hiring._meta.confidence !== "measured");
  /* The hire's cost draws where HireCost itself draws: an average salary and an employer's rate above zero. */
  const hireDrawn = hireCost && !!pay && isNum(addPct) && addPct > 0 && (pay.rows.find((r) => r.key === "average")?.value ?? 0) > 0;
  /* THE AVERAGE LEAVES THE STAFF CARD (milestone 1, M3; his interview of 2026-09-26, answer 30): the header and the peers keep the
     salary, so the card's one figure (PART 4) is the wage floor's cost of a full-time year, in ink (the accent was the average's and
     leaves with it), and the hire's lever keeps the average as its starting pay. Where no lever draws, the employer's share, which
     rode on the average's bar, stands as its own figure. A pair the builder withholds still says why. */
  const floorRow = pay && !pay.withheld ? pay.rows.find((r) => r.key === "minimum" && r.value > 0) ?? null : null;
  const shareAlone = !hireDrawn && isNum(addPct) && addPct > 0;
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
      {/* THE EMPLOYER'S SHARE SAID ONCE (2026-09-26, the United Kingdom's staff card): where the hire's cost is drawn below, the
          average bar carries no on-cost piece and no "Employer adds 15%" line, which the hire's own rule line said again. */}
      {floorRow ? <Focal figure={usd(floorRow.value)} words={COPY.pay.focalWords} /> : pay?.withheld ? <PayBars rows={[]} worldMax={pay.worldMax} withheld={pay.withheld} fmt={usd} /> : null}
      {shareAlone ? (
        <span data-pay="employer-share" className="mt-3 flex items-baseline gap-2">
          <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{addPct}%</Fig>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{COPY.pay.employerShare}</span>
        </span>
      ) : null}
      {/* THE LAW BEHIND THE COST (2026-10-04, the UK page reform): the hourly wage floor in the law's own pounds, the allowance off
          the employer's bill and the pension minimums, as ruled rows between the bars and the hire's lever (rules.json). */}
      {rules && rules.length ? <FactRows rows={rules} className="mt-4" /> : null}
      {hireDrawn && pay ? <HireCost iso2={iso2 as string} pay={pay} rate={isNum(addPct) ? addPct : null} /> : null}
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
 * LEGAL AND ADMIN COSTS, TWO SUBJECTS ONE AT A TIME (goal 2026-09-26, M4). The card read as one grid of six: three costs of
 * running the company beside closing it and the owner's liability, which is not a cost at all, so a reader scanning "what does
 * it cost me to run" met "6 to 12 months" and "Limited" in the same rows. "To run" keeps the yearly statement as its figure over
 * the admin hours, the filings and the one-off name change; "To close" leads with striking off a company with no debts, over
 * winding one up with debts and what the owner answers for. The cells are the builder's own, split by their keys.
 */
const CLOSING_KEYS = new Set(["strike", "wind-up", "liability"]);
/** `words` (2026-10-04): the two views' own words where the country's rules stand in the rows, and their figures in the law's
 *  currency (the company statement's £50 and the strike-off's £13, where the seed's dollar figure stood over a pound sign in the words). */
function PaperworkCard({ paperwork, run = null, close = null, words = null }: { paperwork: DepthCard; run?: FactRow[] | null; close?: FactRow[] | null; words?: { run: string; close: string; runFigure?: string | null; closeFigure?: string | null } | null }) {
  /* The heaviest burden first. */
  const RUN_ORDER = ["hours", "filings", "rename"];
  const rank = (key: string) => { const i = RUN_ORDER.indexOf(key); return i < 0 ? RUN_ORDER.length : i; };
  /* THE SOURCED CALENDAR WHERE THE COUNTRY HOLDS ONE (2026-10-04; research R6): the admin hours and the filings count were the
     layout seed's numbers, never measured (the tax office has not counted the hours since 2015, and there is no fixed count of
     filings), so where rules.json holds the deadlines and the penalties those rows stand in their place; closing keeps the
     official strike-off and its notice, and the seed's "6 to 12 months" and the liability word leave. */
  const yearly = run ?? paperwork.cells.filter((c) => !CLOSING_KEYS.has(c.key)).sort((a, b) => rank(a.key) - rank(b.key));
  const closing = paperwork.cells.filter((c) => CLOSING_KEYS.has(c.key));
  const strike = closing.find((c) => c.key === "strike");
  const closingRest = close ?? closing.filter((c) => c.key !== "strike");
  const twoViews = yearly.length >= 2 && !!strike && closingRest.length >= 1;
  return (
    <Box id="paperwork" className="flex flex-col">
      <Rail icon="red-tape" kicker={COPY.paperwork.kicker} />
      {twoViews ? (
        <Switch
          id="paperwork-views"
          label={COPY.paperwork.kicker}
          className="flex-1"
          views={[
            {
              key: "year",
              label: COPY.paperwork.views.year,
              panel: (
                <>
                  <Focal figure={words?.runFigure ?? paperwork.focal.figure} words={words?.run ?? paperwork.focal.words} />
                  {/* THE YEAR'S FACTS STACKED, AS THE CLOSING VIEW'S ARE (2026-09-26): beside the five spectra the card stands 124px
                      taller than its words, and a lone first cell over a pair left that air beside it (a 350 by 132 blank) or at the
                      card's foot; three ruled rows share it in three even pieces. */}
                  <FactRows rows={yearly} />
                </>
              ),
            },
            {
              key: "close",
              label: COPY.paperwork.views.close,
              panel: (
                <>
                  <Focal figure={words?.closeFigure ?? String(strike!.value)} words={words?.close ?? COPY.closing.focalWords} />
                  {/* Stacked: two ruled rows share the card's height where one row of two stood in the middle of 300px of air. */}
                  <FactRows rows={closingRest} />
                </>
              ),
            },
          ]}
        />
      ) : (
        <>
          <Focal figure={paperwork.focal.figure} words={paperwork.focal.words} />
          <FactRows rows={paperwork.cells} />
        </>
      )}
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
  const min = pay.rows.find((r) => r.key === "minimum")?.value;
  if (!isNum(avg) || avg <= 0 || rate == null || rate <= 0) return null;
  const threshold = countryFigure(iso2, "employment.employer_ni_threshold_usd")?.value ?? 0;
  const H = COPY.hireCost;
  /* A FIRST HIRE BY THE COUNTRY'S OWN RULES (2026-10-04): where rules.json holds the employer's yearly allowance and the pension
     minimum, the lever takes them, in dollars at the site's one pound rate (fx.ts, the rate every UK figure was converted at). */
  const gbp = (topic: string, key: string) => {
    const a = ruleAmount(iso2, topic, key)?.gbp;
    return typeof a === "number" ? convertToUsd("GBP", a) : null;
  };
  const allowance = gbp("employing", "employment-allowance");
  const pRate = ruleAmount(iso2, "employing", "pension-employer")?.pct;
  const pLower = gbp("employing", "pension-band-lower");
  const pUpper = gbp("employing", "pension-band-upper");
  const pTrigger = gbp("employing", "pension-trigger");
  const pension = typeof pRate === "number" && pLower != null && pUpper != null && pUpper > pLower ? { rate: pRate, lower: pLower, upper: pUpper, trigger: pTrigger ?? 0 } : null;
  const first = (allowance ?? 0) > 0 || pension != null;
  /* THE RULES UNDER THE LEVER IN THE LAW'S POUNDS (the design review's first finding: "$6,632 ... is the £5,000 threshold" read
     as a made-up figure): the lever's own figures stay in the page's dollars, the law it applies is printed as the law states it. */
  const lb = (topic: string, key: string) => {
    const a = ruleAmount(iso2, topic, key)?.gbp;
    return typeof a === "number" ? lawValue({ gbp: a }) : null;
  };
  const niGbp = lb("employing", "employer-ni-threshold");
  const eaGbp = lb("employing", "employment-allowance");
  const lowGbp = lb("employing", "pension-band-lower");
  const highGbp = lb("employing", "pension-band-upper");
  const notes = first
    ? [
        ...(niGbp && eaGbp ? [{ label: H.niLabel, text: H.niRule.replace("{rate}", `${rate}%`).replace("{threshold}", niGbp).replace("{allowance}", eaGbp) }] : []),
        ...(pension && lowGbp && highGbp ? [{ label: H.pensionLabel, text: H.pensionRule.replace("{rate}", `${pension.rate}%`).replace("{lower}", lowGbp).replace("{upper}", highGbp) }] : []),
      ]
    : null;
  /* THE PAY IS THE READER'S (goal 2026-09-26, M3): the block the card drew at the average salary is a lever from the minimum
     salary up, its default the average the card prints above; the rule is unchanged (src/components/spine/interact/HireLever.tsx). */
  return (
    <HireLever
      pay={avg}
      min={isNum(min) && min > 0 ? min : Math.round(avg / 2)}
      rate={rate}
      threshold={threshold}
      allowance={allowance ?? 0}
      pension={pension}
      notes={notes}
      words={{ label: first ? H.labelFirst : H.label, unit: H.unit, salary: H.salary, onCost: H.onCost, rule: H.rule, lever: H.lever, pension: H.pension, ni: H.ni }}
    />
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
        {/* THE ANSWER IS THE MONTHS (goal 2026-09-26, the sense fix): the figure was the count of countries where selling takes
            longer ("182 of 198"), which a reader had to turn round to read; the months to sell are the answer, the count their
            words, and the plot's own row for here draws its span without printing the months again. */}
        {/* ONE PLACEMENT WORDING (2026-10-04): the months' words say what they are, and where the slow end stands among the
            countries is the site's one sentence ("Among the lowest tenth." for the United Kingdom), never "quicker than in 182". */}
        <Focal figure={`${exitMonthsText(exit.marks[0].value).replace(/ months?$/, "")} to ${exitMonthsText(exit.marks[exit.marks.length - 1].value)}`} words={exit.placement ? C.monthsLeanAlone : longer ? C.monthsLean.replace("{rank}", longer.figure) : C.monthsLeanAlone} placement={exit.placement} />
        {exit.usual ? (
          <div className="flex flex-1 flex-col">
            <RangePair
              fill
              spans={[
                { key: "here", label: C.here, lo: exit.marks[0].value, hi: exit.marks[exit.marks.length - 1].value, accent: true, quiet: true },
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
function Close({ meta, name, zone = false }: { meta: any; name: string; zone?: boolean }) {
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
    <div data-terminus className={zone ? undefined : "mt-8"}>
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
export function SpineCountryBody({ data, locked = false }: { data?: any; locked?: boolean }) {
  const d = data ?? {};
  const name: string | undefined = d.meta?.country_name;
  if (!name) return null;
  const iso2: string | undefined = typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined;
  /* The page's own address from the resolver the country route checks (geo-link-construction): the notify ask's key. */
  const ownPath = iso2 ? countryPageTarget(iso2)?.href ?? null : null;

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
  const londonSales = iso2 === "GB" ? buildLondonTradeSales() : null;
  const exitData = buildCountryExit(iso2 ?? "");
  const spendData = buildCountrySpend(iso2 ?? "");
  /* The exit card is not a condition of the rich page since masterplan step 04 (2026-10-05): on the UK's page it holds nothing
     sourced and is withheld (country_exit_rows.ts), and the sales bars then stand their band's width alone. */
  const rich = !!(employment && insurance && financing && banking && paperwork && londonSales && costs && hasSetup && locals && cities && spendData);
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
         03 what to open, and where: London's trades by their typical sales (plan 06, task B3b) | time to sell; who lives here by age | the job market; the cities |
            what locals know; what households spend on | dealing with people (the age bars and the spending bar, two wholes cut
            into parts, keep a level between them);
         04 the first years: who is still trading | what holds small firms back (two fifths and three: eight columns and their names
            need the wider card).
       What customers earn leaves this page: its three figures were the pay pair printed under a second name (the goal's A12). */
    /* ONE HIRE, ALL IN (masterplan step 23): the law engine's worked hour and parting bill, the UK's alone. */
    const hireAllIn = iso2 === "GB" ? buildHireAllIn({ allowance: true }) : null;
    /* THE LEASE, BY LAW (masterplan step 25): the law of a shop's lease in England and Wales, the UK's alone. */
    const lease = iso2 === "GB" ? buildLeaseByLaw() : null;
    /* OPENING FROM ABROAD (masterplan step 27): the walls a founder from abroad meets, the UK's alone. */
    const fromAbroad = iso2 === "GB" ? buildFromAbroad() : null;
    /* IF IT FAILS (masterplan step 29): what failing costs the owner in England and Wales, the UK's alone. */
    const ifItFails = iso2 === "GB" ? buildIfItFails() : null;
    /* In the order the body draws them, each under the chapter it stands in (the rail heads each run with its chapter). */
    const sections: RailSection[] = [
      { id: "take", label: "The tax burden" },
      { id: "setup", label: COPY.tiers.kicker, chapter: "01" },
      { id: "entry-bill", label: COPY.entryBill.kicker, chapter: "01" },
      ...(fromAbroad ? [{ id: "from-abroad", label: COPY.fromAbroad.kicker, chapter: "01" }] : []),
      { id: "hiring", label: COPY.pay.kicker, chapter: "01" },
      { id: "employment", label: COPY.employment.kicker, chapter: "01" },
      ...(hireAllIn ? [{ id: "hire-all-in", label: COPY.hireAllIn.kicker, chapter: "01" }] : []),
      { id: "running-costs", label: "Running costs", chapter: "01" },
      { id: "insurance", label: COPY.insurance.kicker, chapter: "01" },
      ...(lease ? [{ id: "lease-by-law", label: COPY.leaseByLaw.kicker, chapter: "01" }] : []),
      { id: "peers", label: "Against the peers", chapter: "01" },
      { id: "character", label: COPY.character.state.kicker, chapter: "02" },
      { id: "paperwork", label: COPY.paperwork.kicker, chapter: "02" },
      { id: "financing", label: COPY.financing.kicker, chapter: "02" },
      { id: "banking", label: COPY.banking.kicker, chapter: "02" },
      ...(ifItFails ? [{ id: "if-it-fails", label: COPY.ifItFails.kicker, chapter: "02" }] : []),
      { id: "money", label: COPY.londonSales.kicker, chapter: "03" },
      { id: "exit", label: COPY.countryExit.kicker, chapter: "03" },
      ...(seatPeople ? [{ id: "age-mix", label: COPY.people.age.kicker, chapter: "03" }, { id: "job-market", label: COPY.jobMarket.kicker, chapter: "03" }] : []),
      { id: "cities", label: "The cities", chapter: "03" },
      { id: "locals", label: COPY.locals.kicker, chapter: "03" },
      { id: "spend", label: "What households spend on", chapter: "03" },
      { id: "character-people", label: COPY.character.people.kicker, chapter: "03" },
      ...(seatFirstYears ? [{ id: "first-years", label: COPY.firstYears.kicker, chapter: "04" }, { id: "obstacles", label: COPY.firstYears.obstaclesKicker, chapter: "04" }] : []),
    ];
    /* WHAT A LOCKED LEVEL DRAWS (masterplan step 16; his rulings 18 and 22): each card of a level Pro opens, by the key the body
       gives it, as a locked section under its rail list label, with the icon its own rail draws and the stand-in nearest its
       drawing. Only the cards of levels after a chapter's first are here; the step 20 gate holds the drawn locks to the levels. */
    const railLabel = (id: string) => sections.find((s) => s.id === id)?.label ?? id;
    const countryLocks: Record<string, LockSpec> = Object.fromEntries(
      (
        [
          ["hiring", "hiring", "hiring", "bars"],
          ["employment", "employment", "staffing-rota", "rows"],
          ["hire", "hire-all-in", "min-wage", "rows"],
          ["lease", "lease-by-law", "commercial-rent", "rows"],
          ["abroad", "from-abroad", "visa-permit", "rows"],
          ["running", "running-costs", "cost-breakdown", "track"],
          ["insurance", "insurance", "safety", "rows"],
          ["peers", "peers", "benchmark", "table"],
          ["financing", "financing", "raise-money", "track"],
          ["banking", "banking", "payments", "rows"],
          ["fail", "if-it-fails", "vacancy", "rows"],
          ["age", "age-mix", "who-for", "bars"],
          ["jobs", "job-market", "hiring", "rows"],
          ["cities", "cities", "best-areas", "grid"],
          ["locals", "locals", "locals-know", "rows"],
          ["spend", "spend", "spending-power", "bars"],
          ["people", "character-people", "who-for", "table"],
        ] as const
      ).map(([key, id, icon, kind]) => [key, { id, title: railLabel(id), icon, kind }]),
    );
    const railChapters = {
      "01": { index: "01", heading: COPY.chapters.costs },
      "02": { index: "02", heading: COPY.chapters.money },
      "03": { index: "03", heading: COPY.chapters.open },
      "04": { index: "04", heading: COPY.chapters.firstYears },
    };
    /* THE BAND PAGE (2026-10-04, his words that day: "abandon the bento in favor of a more traditional thing where the sections
       have alternating background colors maybe just by a little bit"). Each level of the composition above is one ZONE, a
       full-width band (src/components/spine/zones.tsx; the colours, the full bleed and the open sections in globals.css, THE
       ZONES); the zones alternate tint and paper from the masthead down, each chapter's number and title at the top of its
       first zone. The pairs are the levels of 2026-09-25, chosen by topic, so the reader still meets two related readings side
       by side from 768px and one under the other, parted by a hairline, on a phone.
       THE CARDS THAT STAY (research R3, 3.7: a card earns its box when the reader operates something in it or it is a door):
       his masthead board, the sortable peers table, the hire and loan levers and the city cards. Everything
       read rather than operated stands open on the band. Only the zones that draw are listed, so the alternation counts the
       zones the reader sees. */
    /* THE COUNTRY'S OWN CONTEXT, BUILT ONCE (2026-10-04; research R6's sourced files through country_rules.ts): the dated changes,
       the law behind the staff, premises, filings and payments figures, the sourced payment split. A piece the files do not hold
       for a country is null and its section keeps what it drew before. */
    const today = todayIso();
    const ruleChanges = iso2 ? buildRuleChanges(iso2, today, CHANGES_LEAD) : null;
    const hasChanges = !!ruleChanges && ruleChanges.coming.length + ruleChanges.inForce.length >= 3;
    /* A ZONE OF ONE RUN TAKES THE COLUMN as a wide zone would; the split is the zone's only when both runs draw. */
    const staffRules = iso2 ? ruleRows(iso2, "employing", [
      { key: "minimum-wage-21", icon: "min-wage" },
      { key: "employment-allowance", icon: "hiring" },
      { key: "pension-employer", icon: "wages" },
      { key: "pension-total", icon: "wages" },
    ]) : null;
    /* The change file's own key for the qualifying period (changes.json "unfair-dismissal-period"; "unfair-dismissal" is the
       rules file's, and matched nothing there, so the note never named 1 January 2027). */
    const dismissalNext = iso2 ? nextChange(iso2, "unfair-dismissal-period", today) : null;
    /* ON THE DAY THE LAW CHANGES THE ROW CHANGES (the code review of 2026-10-04): the page regenerates daily, and from 1 January
       2027 the change list would read "2 years to 6 months" over a row still printing "2 years". */
    const dismissalNow = iso2 ? latestChange(iso2, "unfair-dismissal-period", today) : null;
    /* THE LAW'S FIGURES IN THE LAW'S CURRENCY (2026-10-04): where the rules file holds sick pay and maternity pay, the row prints
       the pound figure the law sets (the world shard's dollar conversion, "$163", stood beside "£12.71 an hour" in the same
       zone) and the weekly maternity rate rides the weeks' note. */
    const sickLaw = iso2 ? ruleValue(iso2, "employing", "sick-pay") : null;
    const maternityFirst = iso2 ? ruleValue(iso2, "employing", "maternity-pay-first") : null;
    const maternityWeekly = iso2 ? ruleValue(iso2, "employing", "maternity-pay-weekly") : null;
    const employmentBase = (seatPeople ? employment.cells.filter((c) => c.key !== "out") : employment.cells).map((c) =>
      c.key === "dismissal" && (dismissalNext || dismissalNow)
        ? {
            ...c,
            value: dismissalNow ? dismissalNow.from : c.value,
            note: dismissalNext
              ? COPY.rulesRows.dismissalNote.replace("{from}", dismissalNext.from).replace("{date}", dismissalNext.dateText)
              : COPY.rulesRows.dismissalSince.replace("{date}", dismissalNow!.dateText),
          }
        : c.key === "sick" && sickLaw
          ? { ...c, value: sickLaw, note: COPY.rulesRows.sickNote, confidence: "measured" as const }
          : c.key === "maternity" && maternityFirst && maternityWeekly
            ? { ...c, note: COPY.rulesRows.maternityNote.replace("{weekly}", maternityWeekly) }
            : c,
    );
    /* THE LAW'S OWN DETAIL UNDER THE EMPLOYER'S DUTIES (rules.json, research R6): the notice an employer gives, the bank holidays
       and how long sick pay runs, the details a first employer asks about and the old card never held. */
    const employingMore = iso2 ? ruleRows(iso2, "employing", [
      { key: "notice-2-to-12-years", icon: "flag", label: "Notice to give", note: COPY.rulesRows.noticeNote },
      { key: "sick-pay-length", icon: "first-year", label: "Sick pay lasts", note: null },
    ], 1) : null;
    /* The year the count is for, from the file's own note ("bank holidays in 2026"): Scotland's 10 in 2026 holds a one-off holiday,
       so the row names its year rather than a count that goes stale in January. */
    const holidayYear = iso2 ? (ruleNote(iso2, "holidays", "england-wales") ?? "").match(/20\d\d/)?.[0] ?? null : null;
    const holidays = iso2 && holidayYear ? ruleRows(iso2, "holidays", [{ key: "england-wales", icon: "seasonality", label: "Bank holidays", note: COPY.rulesRows.holidaysNote.replace("{year}", holidayYear) }], 1) : null;
    const employmentCells = [...employmentBase, ...(employingMore ?? []), ...(holidays ?? [])];
    const premisesRules = iso2 ? ruleRows(iso2, "premises", [
      { key: "full-relief-limit", icon: "commercial-rent", label: "Full rates relief", note: COPY.rulesRows.reliefNote },
      { key: "small-multiplier", icon: "taxes", label: "Business rates", note: COPY.rulesRows.ratesNote },
      { key: "small-retail-multiplier", icon: "high-street", label: "Shops and cafés", note: COPY.rulesRows.retailNote },
    ]) : null;
    const lateLow = iso2 ? ruleValue(iso2, "filings", "late-accounts-1") : null;
    const lateHigh = iso2 ? ruleValue(iso2, "filings", "late-accounts-4") : null;
    const filingRows = iso2 ? ruleRows(iso2, "filings", [
      { key: "accounts-deadline", icon: "filings" },
      { key: "tax-return-deadline", icon: "calculator" },
      { key: "corporation-tax-payment", icon: "taxes" },
      { key: "vat-return-deadline", icon: "payments" },
    ]) : null;
    const runRows: FactRow[] | null = filingRows
      ? [
          ...filingRows,
          ...(lateLow && lateHigh ? [{ key: "late-accounts", icon: "red-tape" as const, label: "Late accounts", value: `${lateLow} to ${lateHigh}`, note: COPY.rulesRows.lateAccountsNote }] : []),
        ]
      : null;
    const closeRows = iso2 ? ruleRows(iso2, "closing", [
      { key: "strike-off-notice", icon: "closing" },
      { key: "no-trading-period", icon: "freshness" },
    ]) : null;
    const payments = iso2 ? buildPayments(iso2) : null;
    const financingCells = financing.cells.filter((c) => !c.key.startsWith("grant-"));
    const zones: Array<{ key: string; split: ZoneSplit; label: string; chapter?: { index: string; heading: string }; outside?: boolean; body: React.ReactNode[] }> = [
      { key: "take", split: "wide", label: "The tax burden", outside: true, body: [<Masthead key="take" name={name} iso2={iso2} hero={d.hero} />] },
      /* THE HOT STUFF FIRST (his word of 2026-10-04): what changed for a small firm here and what is coming, sourced and dated,
         right under the answer, before the costs it changes. */
      ...(hasChanges && ruleChanges
        ? [{ key: "changes", split: "1-1" as ZoneSplit, label: COPY.changes.kicker, outside: true, body: [<RuleChangesComing key="coming" rows={ruleChanges.coming} />, <RuleChangesMade key="made" rows={ruleChanges.inForce} shown={levelShown(ruleChanges.inForce, ruleChanges.inForceLead, ruleChanges.coming.length)} />].filter((_, i) => (i === 0 ? ruleChanges.coming.length > 0 : ruleChanges.inForce.length > 0)) }]
        : []),
      {
        key: "setup",
        split: "3-2",
        label: COPY.tiers.kicker,
        chapter: { index: "01", heading: COPY.chapters.costs },
        body: [<Setup key="setup" setup={d.setup} iso2={iso2} />, <EntryBill key="bill" bill={bill} steps={billSteps} licences={licences} />],
      },
      /* OPENING FROM ABROAD, ITS OWN LEVEL AFTER REGISTERING (masterplan step 27; item 74's twin of the registering card): the
         walls a founder from abroad meets, alone at two thirds by the zones' LONE rule. */
      ...(fromAbroad ? [{ key: "abroad", split: "2-1" as ZoneSplit, label: COPY.fromAbroad.kicker, body: [<FromAbroad key="abroad" data={fromAbroad} />] }] : []),
      {
        key: "staff",
        /* ONE HIRE, ALL IN, THE LEVEL'S THIRD CARD (masterplan step 23; item 77's "08 hiring | 08b commits"): the worked hour and
           the parting bill beside the wage floor and the rules of employing. */
        split: hireAllIn ? "1-1-1" : "1-1",
        label: COPY.pay.kicker,
        body: [
          <Hiring key="hiring" hiring={d.hiring} iso2={iso2} foot={false} hireCost rules={staffRules} />,
          /* WRITTEN OUT, NOT THROUGH A WRAPPER (the chain's census, 2026-09-25): a Box with a literal id and its rows in its own
             JSX, so the census and the coverage gate both read the block the page draws. */
          <Box key="employment" id="employment" className="flex flex-col">
            <Rail icon="staffing-rota" kicker={COPY.employment.kicker} />
            <Focal figure={employment.focal.figure} words={employment.focal.words} />
            <FactRows rows={employmentCells} />
          </Box>,
          ...(hireAllIn ? [<HireAllIn key="hire" data={hireAllIn} />] : []),
        ],
      },
      {
        key: "running",
        /* THREE FIFTHS FOR THE COSTS (2026-10-04): at 1280 their four rows split into two lists side by side (FactRows from 600px)
           and the track runs wider, so the costs end level with the insurance beside them instead of 260px below it. */
        split: "3-2",
        label: COPY.runningCosts.kicker,
        body: [
          <RunningCostsRanged key="running" iso2={iso2 as string} costs={costs} rates={premisesRules} />,
          ruleValue(iso2 as string, "insurance", "employers-liability-cover") ? <InsuranceRules key="insurance" iso2={iso2 as string} /> : <InsuranceBars key="insurance" card={insurance} />,
        ],
      },
      /* THE LEASE, BY LAW, ITS OWN LEVEL AFTER THE RUNNING COSTS (masterplan step 25; item 73's twin of the premises card): alone at
         two thirds, the zones' LONE rule, no partner in the chapter being free to stand beside it. */
      ...(lease ? [{ key: "lease", split: "2-1" as ZoneSplit, label: COPY.leaseByLaw.kicker, body: [<LeaseByLaw key="lease" data={lease} />] }] : []),
      { key: "peers", split: "wide", label: COPY.peers.kicker, body: [<Peers key="peers" table={peers} zone />] },
      {
        key: "state",
        split: "1-1",
        label: COPY.character.state.kicker,
        chapter: { index: "02", heading: COPY.chapters.money },
        body: [
          <CharacterCard key="state" iso2={iso2} which="state" zone />,
          <PaperworkCard key="paperwork" paperwork={paperwork} run={runRows} close={closeRows} words={runRows ? { run: COPY.rulesRows.statementWords, close: COPY.rulesRows.strikeWords, runFigure: ruleValue(iso2 as string, "filings", "confirmation-statement-fee"), closeFigure: ruleValue(iso2 as string, "closing", "strike-off-fee") } : null} />,
        ],
      },
      {
        key: "money",
        split: "1-1",
        label: COPY.financing.kicker,
        body: [
          <FinancingRanged key="financing" iso2={iso2 as string} card={financing} cells={financingCells} />,
          payments ? <PaymentsRing key="banking" iso2={iso2 as string} card={payments} /> : <BankingRing key="banking" card={banking} />,
        ],
      },
      /* IF IT FAILS, ITS OWN LEVEL AFTER BORROWING (masterplan step 29; item 76): alone at two thirds by the zones' LONE rule, its
         partner in item 76, the collecting card (item 75), not built. */
      ...(ifItFails ? [{ key: "fail", split: "2-1" as ZoneSplit, label: COPY.ifItFails.kicker, body: [<IfItFails key="fail" data={ifItFails} />] }] : []),
      {
        key: "trades",
        /* TWO THIRDS EVEN WHEN THE EXIT CARD IS WITHHELD (PART 9 clause 59, the zones' LONE rule): a level whose partner
           self-omits keeps two thirds, its band running on beside it; full width is the hero's alone (section-bands). */
        split: "2-1",
        label: COPY.londonSales.kicker,
        chapter: { index: "03", heading: COPY.chapters.open },
        body: exitData ? [<LondonSalesBars key="money" sales={londonSales} />, <ExitCard key="exit" exit={exitData} lean />] : [<LondonSalesBars key="money" sales={londonSales} />],
      },
      ...(seatPeople && ageMix && jobs
        ? [{ key: "people", split: "1-1" as ZoneSplit, label: COPY.people.age.kicker, body: [<AgeMix key="age" id="age-mix" data={ageMix} />, <JobMarket key="jobs" id="job-market" data={jobs} />] }]
        : []),
      { key: "cities", split: "2-1", label: COPY.cities.kicker, body: [<Cities key="cities" cards={cities} seat={null} />, <LocalsKnow key="locals" notes={locals} />] },
      { key: "spend", split: "2-1", label: COPY.countrySpend.kicker, body: [<SpendBar key="spend" spend={spendData} />, <CharacterCard key="people" iso2={iso2} which="people" zone />] },
      ...(seatFirstYears && survival && obstacles
        ? [
            {
              key: "years",
              split: "3-2" as ZoneSplit,
              label: COPY.firstYears.kicker,
              chapter: { index: "04", heading: COPY.chapters.firstYears },
              body: [<FirstYears key="years" id="first-years" data={survival} />, <Obstacles key="obstacles" id="obstacles" data={obstacles} />],
            },
          ]
        : []),
      { key: "close", split: "wide", label: COPY.close.kicker, outside: true, body: [<Close key="close" meta={d.meta} name={name} zone />] },
    ];
    /* THE LOCK (masterplan step 16; his ruling 18): told the page is locked, each chapter's first level stays open and every later
       level of the chapter draws its cards locked; the answer, the changes and the close stand outside the chapters. Untold, the
       page is exactly what it was. */
    const lockedZones = locked ? lockedLevelKeys(zones.map((z) => ({ key: z.key, chapter: z.chapter?.index ?? null, outside: z.outside }))) : null;
    return (
      <>
        {/* SIXTEEN PIXELS OF GUTTER ON A PHONE (research R2: Material, iOS and the NHS hold 16; the site's column holds 24): the
            zones reach 8px into the column's padding below 768, so a section's content is 343px wide at 375, the width every
            phone table on the page is laid out for. The bands' colour runs edge to edge either way. */}
        <div className="-mx-2 md:mx-0" data-spine-body data-composition="zones">
          {zones.map((z, i) => (
            <Zone key={z.key} tone={zoneTone(i)} split={z.split} label={z.label} chapter={z.chapter}>
              {lockedZones?.has(z.key) ? lockedBody(z.body, countryLocks) : z.body}
            </Zone>
          ))}
        </div>
        {/* THE UK'S SOURCES, ONE LINE UNDER THE BANDS (plan 06, task B4): the licence's sentence and the link to the one sources page; nothing off the UK. */}
        <SourcesFoot iso2={iso2 as string} />
        {/* REPORT A MISTAKE, AND CHECKED WHERE A DATE IS HELD (masterplan step 31): the page's own path to the correction page. */}
        <ReportFoot path={ownPath} checked={checkedDateFor(iso2)} />
        {/* THE THIN PAGE'S ONE ASK (milestone 1, M9): the notify-me form, only on a page the floor census counted under its floor outside the UK. */}
        {ownPath ? <DepthNotifyFoot path={ownPath} /> : null}
        <OnThisPage sections={sections} chapters={railChapters} />
      </>
    );
  }

  /* EVERY OTHER COUNTRY ON THE BAND PAGE (2026-10-04, his "push forward man" the same day the United Kingdom's band page went
     live; his message of that morning: "abandon the bento in favor of a more traditional thing where the sections have
     alternating background colors"). The page draws the same fifteen blocks it drew as a bento (every country draws all fifteen,
     a block without its data standing as its seat: measured on twenty-one countries that day), now as zones (zones.tsx; MODEL.md
     PART 10), one level a zone, alternating tint and paper from the masthead down, each chapter's number and title at the top of
     its first zone:
       the masthead;
       01 what it costs to open, and to run: registering | the bill (3-2; the seat 2-3), running costs | what staff cost, the
          peers table (wide);
       02 where to open it, and what to open: the cities | what customers earn (2-1; 1-1 where the cities are a seat), the margins
          | what locals know (1-1; the three seats side by side where the margins, the notes and the peers are all seats);
       03 what the place is like: dealing with the state | dealing with people; what households spend on | the time to sell;
       the close (wide).
     A block that holds nothing draws nothing and its zone takes only what draws; the seats stay, because the page's floor of
     blocks is his clause 63 ("a main page with too few sections"). The old bento composition and its measurements are in git
     (this file before 2026-10-04). */
  const charTables = iso2 ? buildCharacterTables(iso2) : null;
  /* A SEAT NEVER HOLDS A BAND ALONE (2026-10-04, Afghanistan at 1280: "Against the peers" took a whole band for one sentence):
     where the peer table does not resolve its seat leaves chapter 01's full-width zone and stands under what locals know, the
     two seats one cell beside the margins (or their seat), parted as stacked sections are, a hairline with 24 either side. */
  const peersSeat = !peers;
  const seatOf = (id: "setup" | "locals" | "money", icon: AtlasIconId) => (
    <BlockedSeat key={id} id={id} icon={icon} kicker={COPY.blocked[id].kicker} line={COPY.blocked[id].line} foot={COPY.blocked[id].foot} />
  );
  /* A SEAT IS ONE LINE, SO IT NEVER TAKES THE WIDE SIDE (2026-10-04, Afghanistan and Germany at 1280): the cities' seat stood in
     two thirds of its band with one sentence, and a two-column margins table stretched to two thirds with its figures 300px
     from their trades (his "a section that has no information can only be so wide"). The cities' seat takes a half beside what
     customers earn; the margins take a half beside the notes or their seat; and where the margins, the notes and the peers are
     all seats, the three stand side by side in thirds, one line each, rather than one seat beside two stacked. */
  const citiesAsSeat = !cities && !!citiesSeat;
  const threeSeats = !hasMoney && !locals && peersSeat;
  const generalZonesAll: Array<{ key: string; split: ZoneSplit; label: string; chapter?: { index: string; heading: string }; body: React.ReactNode[] }> = [
    { key: "take", split: "wide", label: "The tax burden", body: [<Masthead key="take" name={name} iso2={iso2} hero={d.hero} />] },
    {
      key: "setup",
      split: hasSetup ? "3-2" : "2-3",
      label: COPY.tiers.kicker,
      chapter: { index: "01", heading: COPY.chapters.costs },
      body: [
        hasSetup ? <Setup key="setup" setup={d.setup} iso2={iso2} /> : seatOf("setup", "register-cost"),
        /* The steps only beside the registering table: where the table is a seat the bill keeps its short form. */
        <EntryBill key="bill" bill={bill} steps={hasSetup ? billSteps : null} licences={hasSetup ? licences : null} />,
      ],
    },
    {
      key: "running",
      split: "1-1",
      label: COPY.pay.kicker,
      body: [costs ? <RunningCosts key="running" costs={costs} /> : null, <Hiring key="hiring" hiring={d.hiring} iso2={iso2} />].filter(Boolean) as React.ReactNode[],
    },
    { key: "peers", split: "wide", label: "Against the peers", body: peersSeat ? [] : [<Peers key="peers" table={peers} zone />] },
    {
      key: "cities",
      split: citiesAsSeat ? "1-1" : "2-1",
      label: "The cities",
      chapter: { index: "02", heading: COPY.chapters.where },
      body: [cities || citiesSeat ? <Cities key="cities" cards={cities} seat={citiesSeat} /> : null, customers ? <Customers key="customers" strip={customers} /> : null].filter(Boolean) as React.ReactNode[],
    },
    {
      key: "money",
      split: threeSeats ? "1-1-1" : "1-1",
      label: COPY.blocked.money.kicker,
      body: threeSeats ? [
        seatOf("money", "owner-keeps"),
        seatOf("locals", "locals-know"),
        <BlockedSeat key="peers" id="peers" icon="benchmark" kicker={COPY.blocked.peers.kicker} line={COPY.blocked.peers.line} foot={COPY.blocked.peers.foot} />,
      ] : [
        hasMoney ? <Money key="money" money={d.money} card={margin} /> : seatOf("money", "owner-keeps"),
        peersSeat ? (
          /* Each seat in its own cell, so the hairline between them belongs to the stack (the zones' open-section rule takes a
             section box's own border away, as it does in a pair). */
          <div key="seats" data-zone-stack="" className="flex flex-col gap-6 [&>*+*]:border-t [&>*+*]:border-[var(--c-border)] [&>*+*]:pt-6">
            <div className="min-w-0">{locals ? <LocalsKnow notes={locals} /> : seatOf("locals", "locals-know")}</div>
            <div className="min-w-0">
              <BlockedSeat id="peers" icon="benchmark" kicker={COPY.blocked.peers.kicker} line={COPY.blocked.peers.line} foot={COPY.blocked.peers.foot} />
            </div>
          </div>
        ) : locals ? (
          <LocalsKnow key="locals" notes={locals} />
        ) : (
          seatOf("locals", "locals-know")
        ),
      ],
    },
    {
      key: "character",
      split: "1-1",
      label: COPY.character.state.kicker,
      chapter: { index: "03", heading: COPY.chapters.place },
      body: [charTables?.state ? <CharacterCard key="state" iso2={iso2} which="state" zone /> : null, charTables?.people ? <CharacterCard key="people" iso2={iso2} which="people" zone /> : null].filter(Boolean) as React.ReactNode[],
    },
    {
      key: "spend",
      split: "2-1",
      label: "What households spend on",
      body: [spendData ? <SpendCard key="spend" spend={spendData} /> : null, exitData ? <ExitCard key="exit" exit={exitData} /> : null].filter(Boolean) as React.ReactNode[],
    },
    { key: "close", split: "wide", label: "Where to next", body: [<Close key="close" meta={d.meta} name={name} zone />] },
  ];
  const generalZones = generalZonesAll.filter((z) => z.body.length > 0);
  /* The rail lists what the page draws, in its order, each under its chapter. */
  const generalSections: RailSection[] = [
    { id: "take", label: "The tax burden" },
    { id: "setup", label: COPY.tiers.kicker, chapter: "01" },
    { id: "entry-bill", label: COPY.entryBill.kicker, chapter: "01" },
    ...(costs ? [{ id: "running-costs", label: "Running costs", chapter: "01" }] : []),
    { id: "hiring", label: COPY.pay.kicker, chapter: "01" },
    ...(peersSeat ? [] : [{ id: "peers", label: "Against the peers", chapter: "01" }]),
    ...(cities || citiesSeat ? [{ id: "cities", label: "The cities", chapter: "02" }] : []),
    ...(customers ? [{ id: "customers", label: "What customers earn", chapter: "02" }] : []),
    { id: "money", label: "Net profit margin", chapter: "02" },
    { id: "locals", label: COPY.locals.kicker, chapter: "02" },
    ...(peersSeat ? [{ id: "peers", label: "Against the peers", chapter: "02" }] : []),
    ...(charTables?.state ? [{ id: "character", label: COPY.character.state.kicker, chapter: "03" }] : []),
    ...(charTables?.people ? [{ id: "character-people", label: COPY.character.people.kicker, chapter: "03" }] : []),
    ...(spendData ? [{ id: "spend", label: "What households spend on", chapter: "03" }] : []),
    ...(exitData ? [{ id: "exit", label: "How long it takes to sell", chapter: "03" }] : []),
  ];
  const generalChapters = {
    "01": { index: "01", heading: COPY.chapters.costs },
    "02": { index: "02", heading: COPY.chapters.where },
    "03": { index: "03", heading: COPY.chapters.place },
  };
  return (
    <>
      {/* The same frame as the United Kingdom's: 16px of phone gutter, the bands' colour edge to edge. */}
      <div className="-mx-2 md:mx-0" data-spine-body data-composition="zones">
        {generalZones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split} label={z.label} chapter={z.chapter}>
            {z.body}
          </Zone>
        ))}
      </div>
      <SourcesFoot iso2={iso2 as string} />
      <ReportFoot path={ownPath} checked={checkedDateFor(iso2)} />
      {/* THE THIN PAGE'S ONE ASK (milestone 1, M9): the notify-me form, only on a page the floor census counted under its floor outside the UK. */}
      {ownPath ? <DepthNotifyFoot path={ownPath} /> : null}
      <OnThisPage sections={generalSections} chapters={generalChapters} />
    </>
  );
}

export default SpineCountryBody;
