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
import { Band, Box, Fig, Rail, SampleTag, SpectraTable, usd } from "@/components/spine/kit";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { CardPager } from "@/components/spine/archetypes/CardPager";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
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
 * The character , the two ratified tables, rebuilt to the founder's second
 * 2026-08-30 batch: every row carries its TRAIT NAME again (the previous
 * build had dropped them, leaving generic pole words , half the fault he
 * named); the pole words are EXPLANATORY of their category ("you should make
 * the two words explanatory to the category that they are referring to");
 * best on the right, worst on the left, every row; the STATE table's dots are
 * INK and the PEOPLE table's dots TERRACOTTA ("that's the feeling"); the
 * state's icon is an institution (the bank glyph); foreign-owned firms sits
 * at the bottom of the state table and born abroad at the bottom of the
 * people table. The positions are the same published-index-anchored reads,
 * normalised exactly as before (government 0 to 10, culture 1 to 10).
 */
function Character({ character }: { character: any }) {
  const gov = character?.government;
  const cu = character?.culture;
  if (!gov && !cu) return null;
  const tagged = typeof character?._meta?.confidence === "string" && character._meta.confidence !== "measured";
  const norm10 = (v: unknown) => (isNum(v) ? Math.max(0, Math.min(1, v / 10)) : null);
  const norm1to10 = (v: unknown) => (isNum(v) ? Math.max(0, Math.min(1, (v - 1) / 9)) : null);
  const row = (pos: number | null, spectrum: string, rowName: string, left: string, right: string) =>
    pos == null ? null : { spectrum, name: rowName, left_label: left, right_label: right, position_0_1: pos };
  const govRows = gov
    ? [
        row(norm10(gov.tax_predictability), "tax", "Tax predictability", "Rules change yearly", "Set for years"),
        row(norm10(gov.low_bribery), "bribery", "Clean dealing", "Bribes expected", "By the book"),
        row(norm10(gov.task_efficiency), "tasks", "Getting things done", "Weeks of stamps", "Same-week answers"),
        row(norm10(gov.time_efficiency), "time", "Waiting time", "Queues for months", "Days, not months"),
        row(norm10(gov.judicial_impartiality), "courts", "Courts", "Connections decide", "Contracts hold"),
        row(norm10(gov.innovation_capacity), "new", "Openness to the new", "New ways resisted", "New ways welcomed"),
      ].filter(Boolean)
    : [];
  const cuRows = cu
    ? [
        row(norm1to10(cu.openness_to_foreigners), "open", "Openness", "Keep to themselves", "Quick to include you"),
        row(norm1to10(cu.innovation), "innovation", "Innovation", "The old way rules", "New ideas land"),
        row(norm1to10(cu.communication_directness), "direct", "Directness", "Read between the lines", "Said to your face"),
        row(norm1to10(cu.punctuality), "punctual", "Timekeeping", "Schedules drift", "Clocks are kept"),
        row(norm1to10(cu.corruption_rejection), "straight", "Straight dealing", "Corners get cut", "A word is kept"),
        row(norm1to10(cu.ambition_chest_beating), "ambition", "Ambition", "Kept quiet", "Worn openly"),
      ].filter(Boolean)
    : [];
  if (govRows.length === 0 && cuRows.length === 0) return null;
  return (
    <Band split="1-1">
      {govRows.length > 0 ? (
        <Box id="character">
          <Rail icon="bank" kicker="Dealing with the state" sample={tagged} />
          <SpectraTable rows={govRows} />
          {isNum(character?.foreign_owned_pct) ? (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-3">
              <span className="flex items-baseline gap-1.5">
                <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{character.foreign_owned_pct}%</Fig>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">of firms are foreign-owned</span>
              </span>
            </div>
          ) : null}
        </Box>
      ) : null}
      {cuRows.length > 0 ? (
        <Box {...(govRows.length === 0 ? { id: "character" } : {})}>
          <Rail icon="who-for" kicker="Dealing with people" sample={tagged} />
          <SpectraTable rows={cuRows} dot="terra" />
          {isNum(character?.foreign_born_pct) ? (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-3">
              <span className="flex items-baseline gap-1.5">
                <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{character.foreign_born_pct}%</Fig>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">born abroad</span>
              </span>
            </div>
          ) : null}
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
function Hiring({ hiring }: { hiring: any }) {
  const floor = hiring?.wage_floor_usd_year;
  const typical = hiring?.typical_pay_usd_year;
  const canDraw = isNum(floor) || isNum(typical);
  if (!canDraw) return null;
  const tagged = typeof hiring?._meta?.confidence === "string" && hiring._meta.confidence !== "measured";
  const max = Math.max(isNum(floor) ? floor : 0, isNum(typical) ? typical : 0) * 1.05;
  const bars: Array<[string, number, string]> = [];
  /* Terracotta, the founder's second-batch order ("there is a problem that
     you are removing the terracotta color from the bars"): the typical bar in
     the full accent fill, the floor in the lighter border tone so the two
     stay tellable apart at a glance. Accent register 5. */
  if (isNum(floor)) bars.push(["Wage floor", floor, "var(--terra-border)"]);
  if (isNum(typical)) bars.push(["Typical pay", typical, "var(--terra)"]);
  const addPct = hiring?.payroll_only_multiplier != null && isNum(hiring?.employer_payroll_pct)
    ? hiring.employer_payroll_pct
    : undefined;
  const labour = hiring?.labour_force_pct;
  const informal = hiring?.informal_share_pct;
  return (
    <Box id="hiring">
      <Rail icon="hiring" kicker="What staff cost" sample={tagged} />
      {/* C12, 2026-09-02. THE DECLARATION IS THE WHOLE FIX HERE, and saying so
          plainly is the point: two fills measured by length from ONE shared zero
          is what the catalogue calls a BAR SET in its own words, "rectangles
          compared by length from a common baseline", and the addendum already
          classified this exact markup, a fill inside a track from one common
          left edge, as I2 when it re-read the kit's Waterfall. Nothing about the
          drawing was wrong, so nothing about the drawing changed.
          IT IS TAGGED ON THE SET AND NOT ON EACH BAR, which is the rule B5, B7
          and B8 each settled in a different component: if a reader would call the
          SET one object, the set declares. Two tags here would have been two bar
          sets in one card, which is the arithmetic that binds a card.
          THE BUDGET, counted on the render: the page was I2 0 of 3 and is now 1
          of 3, and this is the page's only bar set. The blueprint's own condition
          holds too, that the hiring bars be "non-adjacent to any other bar user":
          the band above is the setup pips (I5) and the rent standing (I11), the
          card beside it draws nothing, and nothing else on the page is an I2.
          THE ACCENT IS UNTOUCHED. Register entry 5 names these bars and the
          founder's 2026-08-30 order put the colour back on them.
          THE ROW GAP GOES 10 TO 8, the slot rung, because ten sits between two
          rungs of the spacing ladder and step 7 forbids that outright. It is the
          twelfth off-ladder value this loop has found. The 12 INSIDE each row
          stays and the distinction is A4's: a label, its own bar and its own
          figure on one baseline are ONE object kerned, while the gap between the
          rows separates two of them. */}
      <div data-idea="I2" className="space-y-2">
        {bars.map(([label, v, fill]) => (
          <div key={label} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3">
            <span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{label}</span>
            <span className="relative block h-3 overflow-hidden rounded-full" style={{ background: "var(--c-soft)" }} role="img" aria-label={label + " " + usd(v) + " a year"}>
              <span aria-hidden className="absolute inset-y-0 left-0 rounded-full" style={{ width: ((v / max) * 100).toFixed(1) + "%", background: fill }} />
            </span>
            <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{usd(v)}</Fig>
          </div>
        ))}
      </div>
      {/* 16, THE CARD-PADDING RUNG, on both blocks below. Both were 12, which is
          between two rungs, and so was the 12 of padding above the last block's
          own rule. Thirteenth, fourteenth and fifteenth off-ladder values. */}
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

function LocalsKnow({ locals }: { locals: any }) {
  const items: any[] = Array.isArray(locals?.items) ? locals.items.slice(0, 5) : [];
  if (items.length === 0) return null;
  return (
    <Box>
      <Rail icon="locals-know" kicker="What locals know" sample />
      <div id="locals" className="divide-y divide-[var(--c-border)]">
        {items.map((it: any, i: number) => (
          <div key={i} className="py-2.5 first:pt-0 last:pb-0">
            <div className="text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">{it.label}</div>
            <div className="mt-0.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{it.fact}</div>
          </div>
        ))}
      </div>
    </Box>
  );
}

function Close({ meta }: { meta: any }) {
  const iso = typeof meta?.iso2 === "string" ? meta.iso2.toLowerCase() : undefined;
  return (
    <div data-terminus className="mt-8">
      <Box id="close">
        <h3 data-typography="custom" className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">Where to next</h3>
        <div className="mt-2 flex flex-col items-start gap-3 border-t border-[var(--c-border)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          {iso === "gb" ? (
            <a href="/cities/london" className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">Start in London, the deepest city &#8594;</a>
          ) : null}
          <a href="/industries" className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">See every trade measured here &#8594;</a>
          <a href="/pricing" className="rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-center text-[length:var(--t-body)] font-semibold text-white transition-colors hover:bg-[var(--terra-text)]">Compare this country with Pro &#8594;</a>
        </div>
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
        <Character character={d.character} />
        {d.setup?.tiers?.length || d.premises ? (
          <Band split="3-2">
            <Setup setup={d.setup} iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
            <Premises iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
          </Band>
        ) : null}
        {d.hiring || d.locals_know ? (
          <Band split="2-1">
            <Hiring hiring={d.hiring} />
            <LocalsKnow locals={d.locals_know} />
          </Band>
        ) : null}
        <Close meta={d.meta} />
      </main>
      <OnThisPage sections={RAIL_SECTIONS} />
    </>
  );
}

export default SpineCountryBody;
