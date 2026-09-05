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
import { CardPager } from "@/components/spine/archetypes/CardPager";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { buildCharacterTables } from "@/lib/spine/character_rows";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { buildLocalsNotes } from "@/lib/spine/locals_rows";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { buildCloseDoors } from "@/lib/spine/close_rows";
import { PayBars } from "@/components/spine/archetypes/PayBars";
import { buildPayBars } from "@/lib/spine/pay_rows";
import { buildPremisesStrip, buildCustomersStrip } from "@/lib/spine/range_rows";
import { howToOpenDoor } from "@/lib/spine/setup_rows";
import { buildCityCards } from "@/lib/spine/city_cards";
import { COPY } from "@/lib/spine/copy";
import { marginCardFromRows } from "@/lib/spine/margin_rows";
import { buildPeerTable } from "@/lib/spine/peer_rows";
import { buildHeroFacts } from "@/lib/spine/hero_facts";

/**
 * The on-this-page rail's entries, in page order, and the ONE list that says
 * what this page is made of. A section task appends its own entry here in the
 * same change that mounts the section, so the rail can never promise a section
 * that is not there (a dead in-page link fails to scroll and reads as missing
 * content, which is worse than a 404 because nothing tells the reader).
 */
const RAIL_SECTIONS: Array<{ id: string; label: string }> = [
  { id: "take", label: "The tax burden" },
  { id: "cities", label: "The cities" },
  { id: "peers", label: "Against the peers" },
  { id: "money", label: "Net profit margin" },
  { id: "customers", label: "What customers earn" },
  { id: "character", label: "The character" },
  { id: "setup", label: "Registering, by legal form" },
  { id: "premises", label: "What premises cost" },
  { id: "hiring", label: "What staff cost" },
  { id: "locals", label: "What locals know" },
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
 * The cities as a card pager (the map removed by the first 2026-08-30 batch).
 * Second batch: TWO CARDS PER ROW on phones ("on phones we should have two
 * cities in a row instead of one"), and the terminal link deep-links to this
 * country's own cities ("the redirection should put him immediately at the
 * section of the page that has to do with the specific country"). Verdict 6
 * still binds: every card IS its link; a city without a page renders nothing.
 */
function Cities({ iso2 }: { iso2?: string }) {
  /* THE CARD-PAGER ARCHETYPE (founder ruling 2, 2026-09-04): each city card
     carries the city's photograph on its left, the same file its own hero
     shows, from the image manifest; a city without one draws no slot. The
     cards are built locally by city_cards.ts from the same index the adapter
     reads. */
  if (!iso2) return null;
  const c = buildCityCards(iso2);
  if (!c) return null;
  return (
    <Band>
      <Box id="cities">
        <Rail icon="best-areas" kicker={COPY.cities.kicker} />
        <CardPager cards={c.cards} allHref={c.allHref} allLabel={COPY.cities.allLabel} prevLabel={COPY.cities.prev} nextLabel={COPY.cities.next} />
      </Box>
    </Band>
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
function Customers({ iso2 }: { iso2?: string }) {
  /* THE RANGE-STRIP ARCHETYPE (customers): the typical full-time pay with
     the bottom and top tenth where the deciles are researched; the typical
     alone, with the reason, where they are not. */
  if (!iso2) return null;
  const d = buildCustomersStrip(iso2);
  if (!d) return null;
  return (
    <Box id="customers">
      <Rail icon="spread" kicker={COPY.customers.kicker} sample={d.confidence !== "measured"} />
      <RangeStrip marks={d.marks} scale="linear" fmt={usd} basis={COPY.customers.basis} note={d.note} />
    </Box>
  );
}

/**
 * What an owner keeps , the repetition is out (founder, second batch: "for
 * each row you say kept a year and to open... you could have just said it
 * once at the top as a column and not repeated the same word six times in a
 * row"). Column headers ONCE; each row carries the trade, two figures and the
 * arrow, on one shared grid template so the headers sit over their columns.
 * Returns a bare Box: the body composes it into the 2-1 band beside the
 * customers card. His standing note, recorded and queued: "a little bit stale
 * and without a lot of character."
 */
function Money({ money }: { money: any }) {
  /* THE RANKED-BARS ARCHETYPE (founder ruling 6, 2026-09-04): the net profit
     margin in percent as vertical bars, the track's top at the world's
     highest credible margin (ruling 13). A loss or a floored margin is
     withheld with its reason, never drawn; fewer than two credible rows and
     the card self-omits. The keep figures the old card printed are gone with
     it: four of the six were the 3% floor times revenue. */
  const list: any[] = Array.isArray(money?.list) ? money.list : [];
  const card = marginCardFromRows(list);
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
        <Box {...(t.state ? {} : { id: "character" })}>
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
 * The electricity rate keeps its own quiet line beneath.
 */
function Premises({ iso2 }: { iso2?: string }) {
  /* THE RANGE-STRIP ARCHETYPE (premises, founder rulings 10 to 12 of
     2026-09-04): rent for a square metre of shop a year, by address, on one
     log scale with the figure over each mark and the name under it, in
     practical words, no conclusion sentence; the electricity rate under a
     hairline. The profile holds three national tiers today; the five metrics
     he named are a data requirement the strip is built to hold. */
  if (!iso2) return null;
  const d = buildPremisesStrip(iso2);
  if (!d) return null;
  return (
    <Box id="premises">
      <Rail icon="commercial-rent" kicker={COPY.premises.kicker} sample={d.confidence !== "measured"} />
      <RangeStrip marks={d.marks} scale="log" fmt={usd} basis={COPY.premises.basis} extra={d.extra} />
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
  return (
    <Box id="hiring">
      <Rail icon="hiring" kicker={COPY.pay.kicker} sample={tagged} />
      {/* THE PAY BARS through the archetype (founder rulings 13 and 14, 2026-09-04):
          minimum and average salary on one track that ends at the world's
          highest average, named; a pair under ten percent apart withheld. */}
      {pay ? <PayBars rows={pay.rows} worldMax={pay.worldMax} withheld={pay.withheld} fmt={usd} edgeLabel={(name, figure) => COPY.pay.edge.replace("{name}", name).replace("{figure}", figure)} /> : null}
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
function LocalsKnow({ iso2 }: { iso2?: string }) {
  if (!iso2) return null;
  const d = buildLocalsNotes(iso2);
  if (!d) return null;
  return (
    <Box>
      <Rail icon="locals-know" kicker={COPY.locals.kicker} sample />
      <div id="locals">
        <NoteList notes={d.notes} columns={2} />
      </div>
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

  return (
    <>
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        <Masthead name={name} iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} hero={d.hero} />
        <Cities iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
        <Peers iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
        {/* The money grid takes the wide side and the customers card the narrow;
            the lens grid that stood here is retired, every tile by his own words.
            THE SPLIT MOVED 2-1 TO 3-2 IN C11, and a measurement decided it rather
            than taste. At 347 the bracket's own left label, "Bottom ten percent",
            needs 103px in a 100px column and wrapped to two lines while the two
            beside it stayed on one, so a row of three labels went ragged. At 416
            each column is 141px and every label sits on one line with room for a
            wider middle figure than any country in the file holds. The money grid
            gives up 69px and loses nothing: its name column falls 419 to 352 and
            its longest trade name is about 140. D3 also reads better afterwards,
            because 2-1 stood at three bands on this page and now stands at two. */}
        {Array.isArray(d.money?.list) || isNum(d.customers?.median_usd) ? (
          <Band split="3-2">
            <Money money={d.money} />
            <Customers iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
          </Band>
        ) : null}
        <Character iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
        {d.setup?.tiers?.length || d.premises ? (
          <Band split="3-2">
            <Setup setup={d.setup} iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
            <Premises iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
          </Band>
        ) : null}
        {/* 1-2, not 2-1, since 2026-09-05: the staff-cost card is short and the
            note list tall, and the equal-heights rule left the wide salaries card
            three fifths blank ("massive white space"). The notes take the wide
            side in two columns and the two come close to one height. */}
        {d.hiring || d.locals_know ? (
          <Band split="1-2" stack="lg">
            <Hiring hiring={d.hiring} iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
            <LocalsKnow iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
          </Band>
        ) : null}
        <Close meta={d.meta} />
      </main>
      <OnThisPage sections={RAIL_SECTIONS} />
    </>
  );
}

export default SpineCountryBody;
