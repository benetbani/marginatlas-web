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
import { Band, Box, Fig, Rail, SampleTag, usd } from "@/components/spine/kit";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { CityCards } from "@/components/spine/archetypes/CityCards";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { buildCharacterTables } from "@/lib/spine/character_rows";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { buildLocalsNotes, type LocalsNotes } from "@/lib/spine/locals_rows";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { buildCloseDoors } from "@/lib/spine/close_rows";
import { PayBars } from "@/components/spine/archetypes/PayBars";
import { buildPayBars } from "@/lib/spine/pay_rows";
import { buildPremisesStrip, buildCustomersStrip, type StripData } from "@/lib/spine/range_rows";
import { howToOpenDoor } from "@/lib/spine/setup_rows";
import { buildCityCards, type CityCards as CityCardsData } from "@/lib/spine/city_cards";
import { COPY } from "@/lib/spine/copy";
import { marginCardFromRows, type MarginCard } from "@/lib/spine/margin_rows";
import { buildPeerTable } from "@/lib/spine/peer_rows";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { KvGrid, type KvCell } from "@/components/spine/archetypes/KvGrid";
import { buildGlance, type GlanceData } from "@/lib/spine/glance_rows";
import { buildWorldSeat, type WorldSeatData } from "@/lib/spine/world_seat_rows";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { buildEntryBill, type EntryBillData } from "@/lib/spine/entry_bill_rows";
import { buildRunningCosts, type RunningCostsData } from "@/lib/spine/running_costs_rows";

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
  { id: "glance", label: "At a glance" },
  { id: "world-seat", label: "Among the countries" },
  { id: "setup", label: "Registering, by legal form" },
  { id: "entry-bill", label: "The bill to register" },
  { id: "premises", label: "What premises cost" },
  { id: "running-costs", label: "What else the month costs" },
  { id: "workforce", label: "Who you can hire" },
  { id: "hiring", label: "What staff cost" },
  { id: "peers", label: "Against the peers" },
  { id: "cities", label: "The cities" },
  { id: "customers", label: "What customers earn" },
  { id: "money", label: "Net profit margin" },
  { id: "locals", label: "What locals know" },
  { id: "character", label: "The character" },
  { id: "footing", label: "The ground under you" },
  { id: "easiest", label: "Easiest to break in" },
];

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
      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">On this page</div>
      <ol className="mt-2 space-y-1.5">
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
    const facts = buildHeroFacts(iso2);
    return <AnswerCard id="take" name={name} iso2={iso2} subtitle={facts.subtitle} answer={facts.answer} cells={facts.cells} />;
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
    />
  );
}

/**
 * At a glance, `01 glance` (MODEL.md 8.2; plan step 31, second dispatch,
 * 2026-09-17). THE SEAT IS HELD BY KvGrid AS CATALOGUED: the fact card with a
 * focal (a first cell at 30 taking the card's width, complete rows beneath)
 * is candidate 1 of FORM-CATALOG's CANDIDATES AWAITING HIS CLICK, and a form
 * not in the catalogue is a candidate awaiting his click; so the cells draw
 * at the head rung, nothing at 30, and the FOCAL finding on this card stands
 * until he clicks. The census reads this Box as KvGrid, which is the truth
 * of it today.
 *
 * The rows come from glance_rows.ts, pure over the files, every figure's
 * file and field in its header: the published GDP snapshot with its year
 * (the profile only for TW and YE, step 42), the pay pair's average and
 * minimum from the staff-cost card's own builder (the minimum withheld
 * wherever it is the 0.45 fill or the row is not tier A, step 43, gated by
 * verify_min_wage_not_fill), the curated net wealth (the regional fill
 * withheld), and the hero's own LLC registration time. Five cells at most;
 * the withheld line names what the card does not hold, with the count. The
 * mark on the opener reads the weakest cell, which today draws nothing; the
 * foot says the year and names the modelled cells in words instead.
 */
function Glance({ glance }: { glance: GlanceData | null }) {
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
 * Among the countries, `02 world-seat` (MODEL.md 8.2; the same dispatch).
 * THE SEAT IS HELD BY KvGrid: the composition's card is the placed-figures
 * form, a figure with the sentence "Higher than {n} countries in ten" under
 * it, which is candidate 1 in FORM-CATALOG's CANDIDATES AWAITING HIS CLICK
 * (the placement line under a fact) and not clicked; the placement sentences
 * are not drawn, nothing is at 30 (the FOCAL finding is expected), and the
 * foot says the placement is not shown yet. The census reads this Box as
 * KvGrid. The rows come from world_seat_rows.ts: the major-cities shop rent
 * (the profile's second tier, the composition's "major cities") and the
 * hero's own payroll rate (the rates file, 130 of 195, withheld on 65); the
 * bank lending rate is held for every country and printed for none, because
 * DATA-REQUIREMENTS item 38 says in its own words that the field has no
 * published definition, and the withheld line says so.
 */
function WorldSeat({ seat }: { seat: WorldSeatData | null }) {
  if (!seat) return null;
  return (
    <Box id="world-seat">
      <Rail icon="vs-world" kicker={COPY.worldSeat.kicker} sample={seat.confidence !== "measured"} />
      <KvGrid cells={seat.cells} />
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{seat.withheld}</p>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{seat.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{seat.foot}</p>
    </Box>
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
 */
function Cities({ cards }: { cards: CityCardsData | null }) {
  if (!cards) return null;
  return (
    <Box id="cities">
      <Rail icon="best-areas" kicker={COPY.cities.kicker} />
      <CityCards
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

function Peers({ iso2 }: { iso2?: string }) {
  /* THE COMPARISON-TABLE ARCHETYPE (the reset of 2026-09-04): rows built
     locally by peer_rows.ts from the same modules the masthead reads, with
     the LLC columns the founder ruled (3 and 4); the desktop table he praised
     kept whole, the phone form rebuilt with the heads said once (ruling 5). */
  if (!iso2) return null;
  const t = buildPeerTable(iso2);
  if (!t) return null;
  return <CompareTable id="peers" kicker={COPY.peers.kicker} icon="benchmark" rows={t.rows} columns={t.columns} caveat={t.caveat} />;
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
      withheldLine={card.withheldLine}
      rows={card.rows.map((r) => ({ key: r.key, name: r.name, href: r.href, value: r.margin, flagged: r.flagged }))}
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
    <Box id="setup">
      <Rail icon="register-cost" kicker={COPY.tiers.kicker} />
      <TiersTable rows={tiers} howTo={iso2 ? howToOpenDoor(iso2) : null} />
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
 * THE CENSUS DOES NOT READ THIS CARD. census.ts (and the coverage gate) read
 * `<Box` in this file, and BentoMetric draws its own Box the way BlockedSeat
 * and AnswerCard do, so the bill joins the two seats as a block on the page
 * (`data-block="entry-bill"`, BLOCK FLOOR counts it) that the census's twelve
 * country rows do not list. Its form to the checkers is `bento-metric`.
 */
function EntryBill({ bill }: { bill: EntryBillData | null }) {
  if (!bill) return null;
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
    />
  );
}

/**
 * What premises cost , a STANDING of the address tiers since C11 (2026-09-02).
 *
 * WHAT WAS HERE, AND WHY IT WAS A REPLACEMENT RATHER THAN A DECLARATION. The
 * three rents sat as ticks on one hairline, which is an undeclared I1 horizontal
 * track on a page already at the I1 cap of two, and the track was wrong twice
 * over. Its two ends are the BOTTOM AND TOP OF AN ORDER, which A1 and C10 both
 * settled is not a position between two named poles. And the axis was LOGARITHMIC
 * with nothing in the drawing saying so: measured on the render, the middle mark
 * stood at 41.7 percent of the way between the outer two where the true linear
 * fraction of those same figures is 20.0 percent, so the picture published DOUBLE
 * the distance the data holds. That is C10's invented-position fault class, in a
 * card that had no other reading: nothing in it was larger than 14px, so there
 * was no first thing to see and no ratio to state (C6's measurement, here again).
 *
 * WHAT THE INFORMATION IS: a ranking of named things, three of them, one figure
 * each. NOT a spread, which is the customers card two bands up: "Ordinary street"
 * is not the typical of a distribution, it is a third named place, and a tenant
 * chooses a tier rather than landing at a percentile.
 *
 * EVERY DRAWN FORM WAS ELIMINATED BEFORE THE TYPOGRAPHIC ONE WAS TAKEN, which is
 * A8's own path through step 3. I1 is at cap and is the wrong drawing, above. I2
 * LollipopColumn refuses fewer than four entries in code, verified rather than
 * assumed, and the card directly below this one in reading order is the hiring
 * bar set, so an I2 here would also breach rule 25. I3 StackBar asserts a total,
 * and three rents do not sum to a quantity. I4 is a level reached or a running
 * total and this is neither. I5 is a count of identical marks, and the setup card
 * beside it already draws pips. I6 OptionCards needs 478px of inner width (run 7
 * measured it) and this card has 396, and the band cannot widen because B8
 * measured 624 as the narrowest width its own table stays a table at. I7 has
 * nothing to clear. I12 is spent two bands up on a different information type,
 * and drawing three entities as a span would be the fuse this loop is forbidden.
 * So the catalogue holds NO drawn form for a three-entry ranking on this page,
 * and RankedTiles is the form its index names for a ranking that is few.
 *
 * WHICH LEAVES THE FOUNDER'S OWN OBJECTION TO ANSWER, "this is just a list of
 * numbers, so it doesn't feel well at all" (second batch). What he rejected was
 * figures with no reading, and the tick scale answered it with a drawing that
 * lies. The card answers it instead with the reading itself: a computed finding
 * at the section rung saying how many times the dearest address costs the
 * cheapest, with the standing beneath it as its evidence. The finding is COMPUTED
 * and never typed, which is C6's rule and matters here for C6's reason: the tiers
 * and their spread differ in every country.
 *
 * NO ACCENT ANYWHERE. The accent register closed by the founder on 2026-08-30 is
 * exhaustive and this card is not in it, so RankedTiles takes `accent={false}`;
 * the order, the numerals and the leader's semibold name carry the rank, which is
 * A3's own settled reading for a form whose colour is turned off.
 *
 * THE ELECTRICITY LINE CAME OFF THIS CARD on plan step 31's fourth dispatch
 * (2026-09-18): MODEL.md 8.2's row for `05` says its `extra` comes off
 * because `06 running-costs` carries the reading, and PART 5's bento clause
 * names the fault of a band saying one thing twice. The builder still
 * returns `extra` for the city's premises strip, which draws it until the
 * city's own `04 premises` bento retires that strip (8.3); this card does
 * not pass it.
 */
function Premises({ strip }: { strip: StripData | null }) {
  /* THE RANGE-STRIP ARCHETYPE (premises, founder rulings 10 to 12 of
     2026-09-04): rent for a square metre of shop a year, by address, on one
     log scale with the figure over each mark and the name under it, in
     practical words, no conclusion sentence. The profile holds three
     national tiers today; the five metrics he named are a data requirement
     the strip is built to hold. The strip comes from the body, built once,
     so its band is drawn only when it is. */
  if (!strip || strip.marks.length === 0) return null;
  return (
    <Box id="premises">
      <Rail icon="commercial-rent" kicker={COPY.premises.kicker} sample={strip.confidence !== "measured"} />
      <RangeStrip marks={strip.marks} scale="log" fmt={usd} basis={COPY.premises.basis} />
    </Box>
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
  if (!costs) return null;
  const bare = costs.cells.length === 0;
  return (
    <Box id="running-costs">
      <Rail icon="cost-breakdown" kicker={COPY.runningCosts.kicker} sample={costs.confidence !== "measured"} />
      {bare ? (
        costs.withheld.map((line) => (
          <p key={line} data-withheld-line="cell" className="mt-2 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{line}</p>
        ))
      ) : (
        <>
          <KvGrid cells={costs.cells} />
          {costs.withheld.length > 0 ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{costs.withheld.join(" ")}</p> : null}
        </>
      )}
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
function Hiring({ hiring, iso2 }: { hiring: any; iso2?: string }) {
  const pay = iso2 ? buildPayBars(iso2) : null;
  const addPct = hiring?.payroll_only_multiplier != null && isNum(hiring?.employer_payroll_pct) ? hiring.employer_payroll_pct : undefined;
  const labour = hiring?.labour_force_pct;
  const informal = hiring?.informal_share_pct;
  if (!pay && !isNum(addPct) && !isNum(labour) && !isNum(informal)) return null;
  const tagged = (pay && pay.confidence !== "measured") || (typeof hiring?._meta?.confidence === "string" && hiring._meta.confidence !== "measured");
  /* LEAN WHILE IT STANDS ALONE (plan step 31, 2026-09-17): the kit seats a lone
     card at two thirds, and at 693 this card's world track runs on empty past
     its two short fills, the void the page filter names; at the narrow third,
     347, the card is exactly what it has been since 2026-09-05 and carries no
     void. The declaration is inert the day the card has a partner again. */
  return (
    <Box id="hiring" data-lean="1">
      <Rail icon="hiring" kicker={COPY.pay.kicker} sample={tagged} />
      {/* THE PAY BARS through the archetype (founder rulings 13 and 14, 2026-09-04):
          minimum and average salary on one track that ends at the world's
          highest average, unnamed since his 2026-09-07 ruling; a pair under
          ten percent apart withheld. */}
      {pay ? <PayBars rows={pay.rows} worldMax={pay.worldMax} withheld={pay.withheld} fmt={usd} /> : null}
      {isNum(addPct) ? (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">On top of gross pay, employers add</span>
          <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">+{addPct}%</Fig>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">(pension auto-enrolment and insurance sit on top)</span>
        </div>
      ) : null}
      {isNum(labour) || isNum(informal) ? (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-4">
          {isNum(labour) ? (
            <span className="flex items-baseline gap-1.5">
              <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{labour}%</Fig>
              <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">of adults are in the labour force</span>
            </span>
          ) : null}
          {isNum(informal) ? (
            <span className="flex items-baseline gap-1.5">
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
 * The ground under you, `17 footing` (MODEL.md 8.2). THE SEAT IS HELD BY
 * KvGrid: the calibrated linear meter 8.2 draws for this block (a straight 0
 * to 100 track, a marker and the whole number, two readings on one card) is a
 * form he has not clicked, and a form not in the catalogue is a candidate
 * awaiting his click; so the catalogued form nearest it holds the seat, two
 * cells on one row, until the meter is his. The census reads this Box as
 * KvGrid, which is the truth of it today. No 30 in it: the FOCAL finding on
 * this card stands until his click, and `footing` joins EVEN_BY_RULING the
 * day the meter is built, not before.
 *
 * DATA, by file and field: `ground` in src/lib/spine/adapt_country.ts (the
 * block at its lines 1086 to 1108), computed since task 17 and read by
 * nothing until this card: `corruption_perception_index` and
 * `ease_of_doing_business_index` from
 * data/economic_indicators/country_profile_v2.json through getCountryProfile,
 * 197 of 197, 50 measured (the hand-anchored tier A) and 147 interpolated.
 * `prof()` hands a figure over only when this country's own row is held, and
 * profileConfidence tags the block measured for tier A and modeled otherwise;
 * each cell carries that tag, so an interpolated row is marked modelled
 * (the mark draws nothing behind his switch, and the basis line says it in
 * words instead). Both print as WHOLE NUMBERS, 0 to 100: the adapter rounds
 * the second reading to one decimal and the first to a whole number, the
 * precision mismatch 8.2 names on 112 countries, fixed here where it is
 * drawn rather than in the adapter this dispatch does not touch.
 */
function Footing({ ground }: { ground: any }) {
  const clean = isNum(ground?.clean_dealing_0_100) ? Math.round(ground.clean_dealing_0_100) : undefined;
  const admin = isNum(ground?.easy_admin_0_100) ? Math.round(ground.easy_admin_0_100) : undefined;
  if (clean == null && admin == null) return null;
  const confidence: KvCell["confidence"] = ground?._meta?.confidence === "measured" ? "measured" : "modeled";
  const cells: KvCell[] = [];
  if (clean != null) cells.push({ key: "clean", label: COPY.footing.cells.clean, value: String(clean), confidence });
  if (admin != null) cells.push({ key: "admin", label: COPY.footing.cells.admin, value: String(admin), confidence });
  return (
    <Box id="footing">
      <Rail icon="ease-of-business" kicker={COPY.footing.kicker} sample={confidence !== "measured"} />
      <KvGrid cells={cells} />
      <p className="mt-3 text-[length:var(--t-micro)] text-[var(--c-muted)]">{COPY.footing.basis}</p>
    </Box>
  );
}

/**
 * Where to next, through the terminus archetype: the doors from close_rows
 * (the largest covered city, the country's trades, the pricing page with the
 * promise it keeps today), the wrapper keeping data-terminus so the
 * full-width and blueprint gates read the sanction. No doors, no card.
 */
function Close({ meta }: { meta: any }) {
  const iso2 = typeof meta?.iso2 === "string" ? meta.iso2 : undefined;
  if (!iso2) return null;
  const doors = buildCloseDoors(iso2);
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
  const customers = iso2 ? buildCustomersStrip(iso2) : null;
  const margin = marginCardFromRows(Array.isArray(d.money?.list) ? d.money.list : []);
  const hasMoney = margin.rows.length >= 2;
  const locals = iso2 ? buildLocalsNotes(iso2) : null;
  const premises = iso2 ? buildPremisesStrip(iso2) : null;
  const hasSetup = Array.isArray(d.setup?.tiers) && d.setup.tiers.length > 0;
  const glance = iso2 ? buildGlance(iso2) : null;
  const seat = iso2 ? buildWorldSeat(iso2) : null;
  const bill = iso2 ? buildEntryBill(iso2) : null;
  const costs = iso2 ? buildRunningCosts(iso2) : null;
  const hasPremises = premises != null && premises.marks.length > 0;

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
     18 and 19 and the three chapter breaks come in later dispatches and are
     not seated here. A band whose partner is not built yet
     holds its one card in its own Band, unpadded: the LONE CARD finding on it
     is expected and temporary, and the kit's only-child rule gives the
     survivor two thirds so the composition reads as a choice meanwhile.
     Three full widths, R1: the take, the peers, the close. */
  return (
    <>
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        <Masthead name={name} iso2={iso2} hero={d.hero} />
        {/* `01 glance | 02 world-seat`, 1-1, the opening's one band (8.2; plan
            step 31, second dispatch): what the country is in figures, and what
            it charges a shop against the world, both quiet, both on KvGrid
            while their clicked forms wait. Both cards exist for every country
            in the taxonomy (the GDP has a profile fallback and the rent is held
            for all 195), so the band holds two children; a country missing one
            would show the survivor alone, honestly, as LONE CARD. */}
        {glance || seat ? (
          <Band split="1-1">
            <Glance glance={glance} />
            <WorldSeat seat={seat} />
          </Band>
        ) : null}
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
            The table draws on 152 countries and the bill on 195, so on the 43
            with no legal form on file the bill stands alone in the band,
            honestly, as LONE CARD, on the narrow column by its own
            `data-lean` (the kit's rule for a one-figure survivor); which
            partner re-pairs it there is the composition's decision (the
            brief's section 5), not this dispatch's. */}
        {hasSetup || bill ? (
          <Band split="3-2">
            <Setup setup={d.setup} iso2={iso2} />
            <EntryBill bill={bill} />
          </Band>
        ) : null}
        {/* `05 premises | 06 running-costs`, 1-1 (8.2; plan step 31, fourth
            dispatch, 2026-09-18). MEASURED BEFORE IT WAS PAIRED. */}
        {hasPremises || costs ? (
          <Band split="1-1">
            <Premises strip={premises} />
            <RunningCosts costs={costs} />
          </Band>
        ) : null}
        {/* `07 workforce | 08 hiring`, 1-1 in 8.2, the seat on the left and the
            loud staff card on the right (its order list, its rhythm line
            "blocked-seat · pay-bars", its ledger "08, band 4, right"). THE PAIR
            CANNOT BE SEATED TODAY, measured on 2026-09-17 (plan step 31) at
            every split in the closed set, with the two cards as they are:
            at 1-1 the staff card is 520 wide and the page filter finds a 150
            by 156 void on it, the long empty world track past two short fills
            and the on-cost sentence stopping short (the same numbers the
            2026-09-11 stash recorded at that width; the 08 dispatch's
            placement sentences and plus are what fill it); with the seat on
            the wide side (3-2 or 2-1) the staff card at 416 or 347 is clean
            and the seat, stretched to its 264, is half air, 48 percent ink to
            the art-direction gate's floor of 60, or a blank of exactly 120 to
            the filter's floor of 120 with the foot pinned to the base. The set
            cannot give the seat 520 and the staff card 416 at once. So each
            stands in its own band in 8.2's order: the seat at the survivor's
            two thirds at its own height, the staff card declared lean so it
            keeps the 347 it has held since 2026-09-05, where it has no void.
            One Band at 1-1 again the day 08's placement lines land. */}
        <Band split="1-1">
          <BlockedSeat id="workforce" icon="staffing-rota" kicker={COPY.blocked.workforce.kicker} line={COPY.blocked.workforce.line} foot={COPY.blocked.workforce.foot} />
        </Band>
        <Band split="1-1">
          <Hiring hiring={d.hiring} iso2={iso2} />
        </Band>
        <Peers iso2={iso2} />
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
            per citizen) or the composition re-decides it. */}
        {cities ? (
          <Band split="2-1">
            <Cities cards={cities} />
          </Band>
        ) : null}
        {customers ? (
          <Band split="2-1">
            <Customers strip={customers} />
          </Band>
        ) : null}
        {/* `12 money | 16 locals`, 1-1 until `npm run probe:page` decides
            (8.2's own note on the split); money on the left either way. */}
        {hasMoney || locals ? (
          <Band split="2-3" stack="lg">
            <Money money={d.money} card={margin} />
            <LocalsKnow notes={locals} />
          </Band>
        ) : null}
        <Character iso2={iso2} />
        {/* `17 footing | 11 easiest`, 2-1, the footing wide because it is the
            band's only live content (8.4 rule 1), the easiest seat narrow. */}
        <Band split="2-1">
          <Footing ground={d.ground} />
          <BlockedSeat id="easiest" icon="where-it-pays" kicker={COPY.blocked.easiest.kicker} line={COPY.blocked.easiest.line} foot={COPY.blocked.easiest.foot} />
        </Band>
        <Close meta={d.meta} />
      </main>
      <OnThisPage sections={RAIL_SECTIONS} />
    </>
  );
}

export default SpineCountryBody;
