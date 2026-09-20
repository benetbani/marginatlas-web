/**
 * RankedBars , THE RANKED-BARS ARCHETYPE. Under six members it is vertical
 * bars from a zero baseline, sorted low to high so the best stands high and
 * right (rule 29A), the figure at the lead rung above each bar and the name
 * beneath as the link; six or more it is a table read top to bottom (the
 * paragraph after next); a basis line and a withheld line in the practical
 * register in both. Below 768 the phone gets a two-column table, because six
 * names cannot stand under six bars at 327px without cutting.
 *
 * THE CEILING IS DRAWN AND NAMED IN BOTH FORMS (founder ruling 13,
 * 2026-09-04). The bars form rules it with a hairline across the top of the
 * chart, so only a member standing at the ceiling touches it, and names it at
 * the right. The table form draws the same ceiling as the far end of every
 * row's track, once per row, and names it once at the head of the track
 * column; `topLabel` is that name in both forms, and it was a dead prop in
 * the table form until the task 13 fix wave (2026-09-10) put it there.
 *
 * WHAT THE CEILING IS, THE CALLER DECLARES, because this file cannot tell
 * from the number. `top` is `Math.max(worldMax, the largest row)`: whatever
 * the caller passed, raised only if a row overshoots it. The country money
 * card passes a true world maximum (`worldMaxMargin()`,
 * src/lib/spine/margin_rows.ts) and its track IS a world track; the city
 * districts card passes the set's own heaviest district
 * (src/lib/spine/district_rows.ts), so there the track measures a district
 * against a district drawn a few rows above it. `ceiling` says which of the
 * two it is, and the table form stamps that word as `data-track`, so the
 * harness can see the track at all: it drew no attribute before the task 13
 * fix wave, and `check_model_laws.mjs`'s PLACEMENT rule iterates `[data-track]`,
 * so the whole form was invisible to it. PART 9 rule 5 (a figure on a WORLD
 * track needs its placement line beside it) reads that stamp now
 * (`check_model_laws.mjs`, commit `2c0af1bf`): a track declared
 * `data-track="set"` is skipped, since a set's own heaviest member is never
 * a world maximum; an undeclared track is still read exactly as before,
 * because silence must never buy an exemption a real declaration has to
 * earn. The districts card declares `"set"` and shows no PLACEMENT finding;
 * the tracks that still report one are the ones that declare nothing at
 * all. The default is "world", the noisier of the two on purpose: a caller
 * who forgets the prop gets a gate finding rather than silence.
 *
 * SIX OR MORE RANKED MEMBERS ARE A TABLE, NOT COLUMNS (task 13, 2026-09-10),
 * on the ground of MODEL.md PART 5's DISTRICT ROWS ruling, in its words:
 * "Six or more ranked members is a table read top to bottom, not left-to-right
 * columns, which is why the order read as confusing." The district card was
 * seven columns. It is now seven rows read top to bottom on PART 5's grid,
 * `[minmax(0,22ch) <the widest figure> minmax(0,1fr)]`, name then the figure
 * in the very next column then a track that absorbs the leftover width. ONE
 * SET OF COLUMNS FOR THE WHOLE CARD, head included, computed once (see
 * `wideColumns` below): while each row carried the template separately, the
 * middle column was `auto` and sized to that row's own figure, which put the
 * reference row's track 40px left of its siblings' and made the cheapest
 * district draw the longer bar. The grid itself is PART
 * 5's GEOMETRY clause, the clause MODEL.md itself calls "the mechanism that
 * ends 'the distance between the category and the word is very big'": a row is
 * NEVER justify-between across a card wider than 420px, and at 768 the old
 * two-column table was exactly that on a 720px card. HIS WORDS WERE "the
 * category and the word", not the category and the figure, and this file does
 * not claim to know which word he meant: he said it in the same breath as the
 * invented one-word district summaries, which went in the same task (below).
 * The two grounds above hold whichever he meant, which is why they are the
 * grounds given here. Under 420 PART 5 prescribes the two-column form the
 * phone table already draws. A second fault closes with the change, a hole:
 * deleting the invented notes list left
 * the card 222px short of the tall card beside it, and a bar chart cannot
 * fill that, because a taller chart grows its own blank triangle over the
 * short bars (measured: 299x138 at 1280). Rows on `auto-rows-fr` share
 * whatever height the band hands them, which is PART 5's height law solving
 * the hole rather than a size tuned to one page.
 *
 * EVERY ROW PRINTS ITS OWN FIGURE, AND A CARD MAY FEATURE NOBODY (task 14,
 * 2026-09-10, the founder on the districts card). Two rules that arrived
 * together because one defect wore both.
 *
 * The figure first. `referenceKey` lived here for one day: a set rebased onto
 * one of its own members holds a row whose figure is a multiple of ITSELF, and
 * this file answered that by printing NOTHING in the cell and moving the
 * card's pill onto the row's name. His words: "furthermore, the label replaces
 * the number, which is totally an idiotic thing out there." He is right, and
 * the phone made it plainer than the desk did , at 375 that row drew no
 * figure, no bar and a black pill alone on an otherwise empty line, which
 * reads as a page that failed to load. A reserved empty cell is not neutrality;
 * in a column of figures it is an assertion that this row's figure is unknown.
 * So the prop is gone, the reserved blank slot with it, and every row formats
 * its own value like every other row. What a one-times-itself figure MEANS is
 * the caller's business to say in its head and its basis line, where words go.
 *
 * The feature second. `feature="none"` draws a ranked card with NO pill and no
 * accent bar: every bar the same neutral, every figure in the same ink. It
 * exists because a ranking is not always an answer. The districts card ranks by
 * rent, so the row that would carry the mark is the cheapest one, and "it is
 * the cheapest" is not a reason to send anyone there: "there is the featuring
 * aspect of one neighborhood compared to the other neighborhoods with no reason
 * at all, just for the fact that it's cheaper. It is not justifiable." A card
 * that cannot name a member as genuinely best names none, and gets its order
 * across by the bars alone. The default is still "leader", so the country money
 * card , where the leading trade IS the answer , is untouched. The archetype
 * harness's ACCENT rule follows this: at most one pill, and if there is one it
 * sits on the row the card declares (`data-leader-key`); a card that declares
 * `data-feature="leader"` must still carry exactly one, so a pill cannot go
 * missing by accident on a card that has an answer to give.
 *
 * THE SHORT TABLE (fewer than four rows, and every phone) keeps two columns
 * and draws no track at all: there is no third column to absorb the leftover
 * width at 375, and `top` is the caller's ceiling whether or not the card
 * draws it.
 *
 * THE BLACK PILL, NOT THE ACCENT (task 12, 2026-09-10), on a card that
 * features a leader at all (`feature`, above). Ported from mechanic
 * B2 of design/references/founder-2026-09-10.md (there are no M-numbered
 * mechanics in that file, only A1, A2 and B1 to B12; "M2" here was a slip,
 * corrected 2026-09-17): every member of a set
 * pale or hatched, exactly ONE saturated, that one member's value in a black
 * pill with white text. The leader's figure used to be terracotta TEXT , a
 * difference of hue at the same size and weight; it is now an ink pill , a
 * difference of FORM, the same size as every sibling figure so only the
 * container marks it out. It survives greyscale and a colourblind reader,
 * and it spends nothing from the page's accent budget (an ink pill is not
 * accent text). EVERY row, leader or not, renders the same pill-shaped slot
 * (`px-*.py-*` and `rounded-full`, background and colour the only things
 * that change); the leader alone gets `data-pill` and the ink fill, on its
 * figure, so which row happens to lead never changes the row's height
 * (ruling 8). The bar itself still carries the hue: full terracotta for the
 * leader (a filled bar is a mark, not a figure), and for the rest a hatch in
 * --c-border , reusing the exact pattern IncomeBreakdown.tsx already draws
 * rather than a second hatch system , over a flat tint, so the non-leaders
 * stay countable instead of becoming grey ghosts. An UNFEATURED card
 * (`feature="none"`) draws every bar alike, and one step darker
 * (--c-line-strong, flat): the hatch is there to separate the rest FROM the
 * leader, so with no leader it is a texture saying nothing, and seven pale
 * hatched bars would be the grey-ghost card this project is corrected for.
 *
 * Self-omits below two rows. Never draws a value the caller marks withheld:
 * losses and floors arrive as a count and a sentence, never as a bar.
 *
 * A BURDEN RANKS THE OTHER WAY (city:districts, the build loop's run 25,
 * 2026-09-07): with `best="min"` the lowest value leads (a rent load), the
 * bars stand heaviest to lightest so the leader is still the right-most and
 * the accent still marks the good end (rule 29A), and the top rule is the
 * SET'S heaviest, named by `topLabel`, since a world's best for a burden
 * would be a rule at the floor. Both forms declare their row count
 * (`data-expect-rows`) and mark every drawn row (`data-row`), so the harness
 * and the page filter can prove that every row draws at every width.
 *
 * WHAT WENT, TASK 13 (2026-09-10, his three faults on the districts card):
 * the row NOTE, in both the places this file drew it, the list under the
 * chart and the second line beside a phone row's name. It carried what a
 * district "is" in one or two words, and those words came from a constant
 * table keyed by tag, not from anyone's knowledge of the place: "on the part
 * of the section which says what each district is, for example for South
 * London you have written gentrifying. And that's a major problem. You
 * should never do it for city districts, to just summarize them in one or
 * two words. It should never happen." NOTHING REPLACES IT (PART 5's district
 * rows, PART 9 rule 19). A city that one day holds authored district notes
 * gets a section built from that file, not a lookup dressed as knowledge.
 */
import * as React from "react";
import { Box, Rail, Fig } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import type { DoorKind } from "@/lib/spine/door_kinds";
import { COPY } from "./copy";
/* THE HATCH IS SHARED, NOT REINVENTED (task 12): IncomeBreakdown.tsx drew
 * the one repeating-line pattern this site uses for "not the answer, still
 * countable"; importing it here rather than writing a second one is the
 * whole point , two hatch systems would drift apart the first time either
 * one changed. */
import { HATCH } from "./IncomeBreakdown";
/* THE FOOT'S ROW IS SHARED TOO (plan step 33's second dispatch, 2026-09-18):
 * BentoMetric draws the companion row for the country's entry bill, and the
 * trade page's cost to open draws the same two-figure foot under its bars
 * in one state and under BentoMetric's figure in the other two (MODEL.md
 * 8.6 `04 open`); one function, imported, so the card's foot cannot differ
 * by state. */
import { CompanionRow, type Companion } from "./BentoBand";

export type BarRow = { key: string; name: string; href?: string;
  /** What a row that navigates promises: the kind its page's masthead answers (src/lib/spine/door_kinds.ts), set by the builder with the href and stamped as `data-lands` for the chain's `doors` gate (plan step 39, 2026-09-19). */
  lands?: DoorKind;
  value: number; flagged?: boolean;
  /** NO LONGER DRAWN ANYWHERE (task 13, 2026-09-10). The field stays on the
   * type so `scripts/verify_model_laws_copy.ts`'s DISTRICT ADJECTIVE ratchet
   * can keep reading `row.note` on every builder and prove it is unset;
   * delete the field and the ratchet stops compiling, which is how a
   * one-word place summary would creep back in unwatched. No caller may
   * set it: PART 5 and PART 9 rule 19 forbid the words it used to hold. */
  note?: string };
export type RankedBarsProps = {
  id: string;
  kicker: string;
  icon?: AtlasIconId;
  tagged?: boolean;
  basis: string;
  withheldLine?: string | null;
  rows: BarRow[];
  /** The track's far end, in the same unit as `value`: the world's highest value
   *  for this metric when `ceiling` is "world", this set's own heaviest member
   *  when it is "set". A row above it raises it (see `top`). */
  worldMax: number;
  fmt: (v: number) => string;
  phoneHead: { name: string; value: string };
  /** "max": the highest value leads (a margin). "min": the lowest leads (a burden such as a rent load). */
  best?: "max" | "min";
  /** The words at the top rule; the world's best by default, the set's heaviest for a burden. */
  topLabel?: string;
  /** WHAT THE CEILING IS, and the caller alone knows: "world" when `worldMax` is
   *  the world's highest value for the metric, "set" when it is this set's own
   *  heaviest member. The table form stamps it as `data-track`. Defaults to
   *  "world" so a caller who forgets it gets a gate finding, never silence. */
  ceiling?: "world" | "set";
  /** Whether this card MARKS its leading row (the black pill and the terracotta
   *  bar) or features nobody. "none" is for a ranking whose leading row is not
   *  an answer worth sending anyone to; see the header. Defaults to "leader",
   *  so a caller who says nothing keeps the mark. */
  feature?: "leader" | "none";
  /** THE CARD'S OWN FOCAL OVER THE BARS (MODEL.md 8.6 `04 open`, plan step 33's
   *  second dispatch, 2026-09-18): one figure at 30 between the opener and the
   *  basis, `--terra-text` when the card is one of the page's loud moments and
   *  ink otherwise. It is a figure the rows do not print (the bill's total over
   *  its lines), never a sum the bars are read to make (M2), and it is the ONE
   *  place accent text may stand on this card: the rows' one mark is still the
   *  pill (task 12), and check_archetypes.mjs reads the two apart by this slot's
   *  `data-focal`. Under PART 6 the fills follow it: the leader's bar `--terra`
   *  and the rest hatched, exactly as a featured card already draws. */
  focal?: { figure: string; accent?: boolean };
  /** THE FOOT, PART 7's fourth part, where earned: companion figures at 16
   *  under a hairline after the drawing (the cost to open's months to break
   *  even and years to pay back), then one micro line saying what they are.
   *  Drawn by BentoMetric's own CompanionRow so the trade card's foot is one
   *  markup in all three of its states. */
  foot?: { items: Companion[]; line?: string | null } | null;
};

/* The bar band's MINIMUM height, and the figure rung reserved above the
   tallest bar. Both are floors now, not fixed sizes: see the chart-fills-its-
   card note above. NAME_H is fixed rather than a minimum because the zero
   line is drawn from the chart's foot and has to know where the names start;
   2.75em at --t-micro holds every two-line district name at 95px of column. */
const H = 150;
const PILL = 26;
const NAME_H = "calc(7px + 2.75em)";
/* Rule 20's threshold, his: "a ranking of six or more drawn as left-to-right
   columns" is a fault, so six is where the card turns into rows. */
const WIDE_ROWS = 6;
/* PART 5's row: the label, the figure in the VERY NEXT column, and a third
   column that absorbs every pixel of leftover width. Under 420px of card the
   same law prescribes two columns, which is what the short table below
   draws. 22ch is his figure, not a rounded guess at one. */
/* NO align-items HERE, on purpose: two class names that both set it would
   collide, and which one won would be decided by the order Tailwind emits
   its rules in, not by the order they are written in the attribute. The
   head row baselines its two words; a data row centres, because a 12px
   track has no baseline worth aligning text to. */
const ROW = "grid gap-x-3";
/* THE COLUMNS ARE THE CARD'S, NOT EACH ROW'S (task 13 alignment fix,
   2026-09-10). ROW above used to carry `grid-cols-[minmax(0,22ch)_auto_1fr]`,
   and because the class is on every row SEPARATELY, every row was its own
   grid: the `auto` middle column sized to THAT row's own figure. The
   reference row prints a reserved `&nbsp;` and nothing else, so its middle
   column collapsed to 20px against its siblings' 60px, the `1fr` track column
   swallowed the slack, and that row's track began 40px left of theirs and ran
   40px longer. Measured at 1280 on the rendered city page, not eyeballed: the
   CHEAPEST district drew a 150px bar and the next-cheapest, which costs more,
   drew 144px , the card's one purpose, comparing rents by eye, inverted. Rows
   two through seven agreed with each other only by the accident that "x1.08"
   and "x2.50" are the same number of characters; a formatter whose strings
   differ in length (the country money card's percentages) would have splayed
   all seven.

   `display:contents` on the rows would also share one geometry and is
   FORBIDDEN here: several harness rules call getBoundingClientRect() on
   `[data-row]` and measure row heights against founder ruling 8, and a
   contents-display row has no box for them to measure. This project has been
   burned six times by a check that cannot see the thing it checks.

   So the template is computed ONCE for the card and set identically on every
   row and on the head. The middle column is `figChars` characters wide plus
   the pill's own horizontal padding (`px-2` twice, which is exactly 1rem), so
   it is derived from the widest figure THIS card draws rather than a constant
   that happens to fit "x2.50".

   `ch` IS THE ROW'S UNIT, NOT THE FIGURE'S, AND SINCE 2026-09-11 THOSE ARE TWO
   DIFFERENT FACES. `ch` is the advance of "0" in THIS GRID ELEMENT'S font,
   which is the body sans; the figure inside is drawn in the display face
   (globals.css `--font-num`, via `.fig`). The sentence that stood here said
   they were the same font and that is no longer true, so here is the measured
   relation instead: Geist's tabular "0" is 0.600em, Space Grotesk's is
   0.620em, so a figure of n characters occupies at most n x 1.034 ch, a 3.4%
   overrun on the digits alone. The `+ 1rem` is the pill's own `px-2` padding
   and covers it with room left at every figure length this card draws (widest
   measured: 69px of figure in a 69px column, no overflow at 375, 768 or 1280
   on the city and country pages).

   THE BLIND SPOT, stated rather than assumed: this cannot distinguish a
   formatter whose glyphs are all digit width or narrower from one carrying a
   wider glyph (a "%" is wider than "0" in some faces), and it does not
   re-measure when the face changes. An overrun of a few pixels is absorbed by
   the 12px column gap before it reaches the track, and a real one is reported
   by the harness's own overflow rule (check_archetypes.mjs BOTCHED MOBILE),
   which reds a figure cell whose content is wider than its box. */
const wideColumns = (figChars: number): React.CSSProperties => ({
  gridTemplateColumns: `minmax(0,22ch) calc(${figChars}ch + 1rem) minmax(0,1fr)`,
});
/* THE NAME IS A NAME (task 14, 2026-09-10). `PILL_NAME` and the `nameCls`
   branch that fed it left with `referenceKey`: they existed ONLY so the
   reference row could wear the card's mark where its figure should have been,
   and nothing else in this file or any other ever set them. Checked before
   deleting, not assumed , `grep -rn "PILL_NAME\|nameCls"` over src and
   scripts returns this file and, for the bare word `nameCls`, one unrelated
   local of the same name inside kit.tsx's own component. A pill riding on a
   name may be wanted by some later archetype; it is not wanted here, and a
   dead branch in this file is how the last one got shipped.
   THE ONE THING THAT SURVIVES IT is `py-0.5` on every name, kept for the
   reason it was written: a name and a figure that reserve the same vertical
   padding hold one row height whatever either of them says (ruling 8).
   Measured after the change at all three widths, in the report. */
const NAME_CLS = "min-w-0 py-0.5 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]";
/* THE BAR'S FILL, ONE FUNCTION FOR BOTH FORMS (the standing column and the
   track's fill), so a featured card and an unfeatured one cannot drift apart
   in one form and agree in the other. Three cases and no fourth: the leader's
   full terracotta, the rest of a featured set hatched in --c-border over their
   flat tint, and EVERY row of an unfeatured card one step darker and flat.
   The hatch exists to separate the rest FROM a leader; with no leader it is a
   texture saying nothing, and seven pale hatched bars are the grey-ghost card
   this project has already been corrected for. */
const barFill = (isLeader: boolean, marks: boolean): React.CSSProperties =>
  marks
    ? { background: isLeader ? "var(--terra)" : "var(--c-border)", backgroundImage: isLeader ? undefined : HATCH[0] }
    : { background: "var(--c-line-strong)" };

export function RankedBars({ id, kicker, icon, tagged, basis, withheldLine, rows, worldMax, fmt, phoneHead, best = "max", topLabel, ceiling = "world", feature = "leader", focal, foot }: RankedBarsProps) {
  if (rows.length < 2) return null;
  const ascending = [...rows].sort((a, b) => a.value - b.value);
  /* THE LEADER IS ALWAYS THE RIGHT-MOST BAR: the highest for a margin, the lowest for a burden. */
  const sorted = best === "min" ? ascending.slice().reverse() : ascending;
  const leader = sorted[sorted.length - 1];
  /* WHETHER THE LEADING ROW IS MARKED AT ALL. The card still KNOWS its leader
     and still declares it on the root, because the harness's widened ACCENT
     rule reads that declaration to prove a pill, when there is one, sits on
     the right row. An unfeatured card simply draws none. */
  const marks = feature === "leader";
  const top = Math.max(worldMax, ascending[ascending.length - 1].value);
  /* FEWER THAN FOUR ROWS RECONFIGURE TO THE TABLE AT EVERY WIDTH. Measured by
     the harness: two bars across a card leave a 480x144 hole (E6), the
     sparse-but-wide fault the founder names most often; the table holds two
     rows as honestly as six. The constitution recorded this rule in run 10. */
  const drawBars = sorted.length >= 4 && sorted.length < WIDE_ROWS;
  /* SIX OR MORE READ TOP TO BOTTOM AT EVERY WIDTH (rule 20), which is why
     this is not another breakpoint: the columns are wrong at 1280 as well. */
  const drawWide = sorted.length >= WIDE_ROWS;
  /* THE BARS CARD'S MIDDLE FORM (plan step 33's second dispatch, 2026-09-18).
     The bars stand from lg; below it the card drew the PHONE list, whose rows
     are `[1fr auto]` justify-between, which PART 5 licenses only on a card of
     420px or under. That held while every bars card sat in an equal-halves
     band at 768 (352 wide); the trade page's cost to open sits in a band that
     stacks until lg (`stack="lg"`), so at 768 the card is 720 wide and its five
     phone rows were five LABEL GAP rows (measured: 477 to 575px between a name
     and its figure, and the justify-between clause). So between sm and lg a
     bars card draws the same row grid the six-or-more table draws (PART 5's
     three columns, the track absorbing the leftover width), and the phone
     list stays for the phone. The Box is flex-col for this form too, so the
     table can take a stretched card's height as the wide form already does. */
  const drawMidTable = drawBars;
  const ranked = [...sorted].reverse();
  /* THE WIDEST FIGURE THE CARD ACTUALLY DRAWS, counted once, in characters:
     every row contributes the length of its own formatted figure, because
     every row now prints one. See wideColumns above for why the count becomes
     a `ch` width and what that unit cannot see. */
  const figChars = Math.max(1, ...sorted.map((r) => fmt(r.value).length));
  const GEO = wideColumns(figChars);
  return (
    <Box id={id} className={drawWide || drawMidTable ? "flex flex-col" : ""} data-archetype="ranked-bars" data-leader-key={leader.key} data-feature={feature}>
      <Rail icon={icon} kicker={kicker} sample={tagged} />
      {/* THE FOCAL, when the card holds one: the only element on this card
          above 16, and the only one that may wear the accent (see the prop). */}
      {focal ? (
        /* The slot is a div because the kit's Fig carries no data attributes; the checkers read `[data-focal]` on the slot. */
        <div data-focal="1" className="mb-2">
          <Fig className={`block text-[length:var(--t-focal)] font-semibold leading-none ${focal.accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{focal.figure}</Fig>
        </div>
      ) : null}
      {/* THE BASIS AND THE WITHHELD LINE SIDE BY SIDE FROM md (his clause 51,
          2026-09-20): each is a block of text and lives in one half; stacked,
          the two at the half measure stood four lines tall under the opener
          on the country's money card at 768 and left 312 by 120 of air beside
          them (the page filter). One column on a phone, where the card is the
          page's half. */}
      <div className={withheldLine ? "md:grid md:grid-cols-2 md:gap-x-6" : undefined}>
        <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
        {withheldLine ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)] md:mt-0">{withheldLine}</p> : null}
      </div>
      {drawBars ? <div className="relative mt-2.5 hidden lg:block" data-idea="I2">
        <div aria-hidden="true" className="absolute inset-x-0 h-px bg-[var(--c-border)]" style={{ top: PILL }} />
        {/* THE CEILING'S NAME STANDS AT THE END NO MEMBER TOUCHES (plan step 33's
            second dispatch, 2026-09-18, the first bars card with a SET ceiling:
            the trade page's cost to open). A set's own heaviest member touches
            the rule by this file's law, and its pill sat on the name at the
            right end (measured on cell:london:open at 1280: "$250K" over "The
            biggest line $250K"); the leader stands at the right for "max" and
            at the left for "min", so the name takes the other end. A world
            ceiling keeps the right, since no member stands on it. */}
        <div className={`absolute ${ceiling === "set" && best === "max" ? "left-0" : "right-0"} text-[length:var(--t-micro)] text-[var(--c-muted)]`} style={{ top: 8 }}>{topLabel ?? COPY.margin.worldBest} {fmt(top)}</div>
        <div aria-hidden="true" className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: H + PILL }} />
        <ol className="grid" data-expect-rows={sorted.length} style={{ listStyle: "none", margin: 0, padding: 0, gridAutoFlow: "column", gridAutoColumns: "minmax(0,1fr)", columnGap: 8 }}>
          {sorted.map((r) => {
            const isLeader = r.key === leader.key;
            /* THE PILL IS THE CARD'S ONE MARK, on the leader's FIGURE, and
               only on a card that features a leader at all. */
            const figPill = isLeader && marks;
            const h = Math.max(2, Math.round((H * r.value) / top));
            const inner = (
              <>
                <div style={{ height: H + PILL, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                  <div className="relative bg-[var(--c-card)] px-1 text-[length:var(--t-lead)] leading-none" style={{ marginBottom: 6 }}>
                    {/* THE PILL'S SLOT IS RESERVED ON EVERY ROW (task 12): the
                        same rounded, padded span renders whether this row
                        leads or not, so the leader's ink fill and white text
                        never add height a plain row lacks , only `data-pill`
                        and the two colours change. */}
                    <span
                      data-pill={figPill ? "1" : undefined}
                      className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 ${figPill ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                    >
                      <Fig className="font-medium">{fmt(r.value)}</Fig>
                    </span>
                  </div>
                  <div aria-hidden="true" style={{ width: 28, height: h, borderRadius: "2px 2px 0 0", ...barFill(isLeader, marks) }} />
                </div>
                {/* THE UNDERLINE IS A LINK'S, so a name with no door wears none (the
                    district photograph of run 25 showed seven underlined names and
                    no destination, a promise the card could not keep). */}
                <div data-label className={`text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-ink)] ${r.href ? "underline decoration-[var(--c-line-strong)] decoration-1 underline-offset-[3px]" : ""}`} style={{ paddingTop: 7, minHeight: NAME_H }}>{r.name}</div>
              </>
            );
            return (
              <li key={r.key} style={{ minWidth: 0 }} data-bar={r.key} data-row={r.key} data-value={r.value}>
                {r.href ? <a href={r.href} data-lands={r.lands} className="block no-underline">{inner}</a> : inner}
              </li>
            );
          })}
        </ol>
      </div> : null}
      {drawWide || drawMidTable ? (
        <div className={drawWide ? "mt-2.5 hidden flex-1 flex-col sm:flex" : "mt-2.5 hidden flex-1 flex-col sm:flex lg:hidden"} data-idea="I2">
          {/* THE HEAD STANDS ON THE SAME COLUMNS AS THE ROWS (task 13
              alignment fix): same `GEO`, so its first two cells begin exactly
              where every name and every figure below them begins. Its own two
              remaining words then SPAN columns two and three, because the
              figure column is a figure wide and "Times the cheapest" is not: a
              head cell held inside that column would overflow it, which is
              what the old per-row `auto` column was hiding by growing the head
              instead: the ceiling's own column then began 72px right of the
              tracks it names (measured at 1280: cell at 514, tracks at 442),
              though its printed words were right-aligned to the card's edge
              either way, so the photograph showed nothing. The BOX lied, not
              the ink, which is why this half of the fault needed measuring
              rather than looking. Spanning is the honest way to say a label is
              wider than its column. Inside the span the pair sits at the two ends, so the
              value head lands over the figures and the ceiling's right edge
              lands on the far end of every track, which is what the ceiling
              IS. This is not the justify-between PART 5 bans: that clause is
              about a label and its figure held apart across a wide card, and
              `check_model_laws.mjs` reads it as such (a row draws a `.fig` or
              carries `[data-row]`); these are two column names and the head
              carries neither. Put a figure in this head and the rule fires,
              correctly. */}
          <div className={`${ROW} items-baseline pb-2`} style={GEO}>
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.name}</span>
            <div className="col-span-2 flex items-baseline justify-between gap-x-3">
              <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.value}</span>
              {/* THE CEILING, NAMED ONCE, over the column whose far end it is
                  (ruling 13). Not a column head: it is the same micro muted line
                  the bars form prints beside its hairline, in the same words, so
                  the two forms say the ceiling identically. Right aligned,
                  because the ceiling is the right end of every track below. */}
              <span className="text-right text-[length:var(--t-micro)] text-[var(--c-muted)]">{topLabel ?? COPY.margin.worldBest} {fmt(top)}</span>
            </div>
          </div>
          <div className="grid flex-1 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={sorted.length} style={{ gridAutoRows: "minmax(2.5rem,1fr)" }}>
            {ranked.map((r) => {
              const isLeader = r.key === leader.key;
              const figPill = isLeader && marks;
              const row = (
                <>
                  <span data-label className={NAME_CLS}>{r.name}</span>
                  {/* --t-lead, THE WHOLE COLUMN, not the leader alone. PART 5
                      allows 16px for "the card's naming figure" and in the
                      same breath requires every figure in a column to share
                      one size, so the lead cannot be spent on one cell: at
                      14px throughout, the card's largest word equalled its
                      median and the page filter reported NO LEAD, nothing for
                      the eye to start on. The chart form this table replaced
                      drew its figures at the same 16. */}
                  <Fig className="text-[length:var(--t-lead)] font-semibold">
                    <span
                      data-pill={figPill ? "1" : undefined}
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${figPill ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                    >
                      {fmt(r.value)}
                    </span>
                  </Fig>
                  {/* THE TRACK DECLARES ITS CEILING (task 13 fix wave): the
                      attribute is what the harness iterates, and its value is
                      whether the far end is the world's or this set's own. */}
                  <span aria-hidden="true" data-track={ceiling} className="relative block h-3 overflow-hidden rounded-full bg-[var(--c-soft)]">
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(Math.max(0, Math.min(1, r.value / top)) * 100).toFixed(1)}%`, ...barFill(isLeader, marks) }} />
                  </span>
                </>
              );
              const cls = `${ROW} items-center`;
              /* THE ROW DECLARES THE VALUE ITS BAR DRAWS (task 13 alignment
                 fix): `check_archetypes.mjs` compares the drawn length against
                 this number, row by row, so a bar that contradicts its own
                 figure is a red instead of a photograph nobody re-measured.
                 The attribute is the component's own declaration, which is the
                 rule's blind spot and is stated where the rule is written. */
              return r.href
                ? <a key={r.key} href={r.href} data-lands={r.lands} className={cls} style={GEO} data-row={r.key} data-value={r.value}>{row}</a>
                : <div key={r.key} className={cls} style={GEO} data-row={r.key} data-value={r.value}>{row}</div>;
            })}
          </div>
        </div>
      ) : null}
      <div className={drawBars || drawWide ? "mt-2.5 sm:hidden" : "mt-2.5"}>
        <div className="flex items-baseline justify-between pb-2">
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.name}</span>
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.value}</span>
        </div>
        <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={sorted.length}>
          {[...sorted].reverse().map((r) => {
            const isLeader = r.key === leader.key;
            const figPill = isLeader && marks;
            const row = (
              <>
                <span data-label className={NAME_CLS}>{r.name}</span>
                <Fig className="text-right text-[length:var(--t-body)] font-semibold" >
                  {/* THE SAME RESERVED SLOT AS THE BAR FIGURE, above: every
                      row gets the rounded, padded span, only the leader's
                      gets the ink fill and `data-pill`, so a phone row is
                      never taller for being the one that leads. This form is
                      where the reserved BLANK read worst (task 14): with no
                      bar to carry the eye, a row that printed nothing left a
                      pill floating alone on an empty line, which reads as a
                      page that failed to load rather than as a reference. */}
                  <span
                    data-pill={figPill ? "1" : undefined}
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${figPill ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                  >
                    {fmt(r.value)}
                  </span>
                </Fig>
              </>
            );
            const cls = "flex items-baseline justify-between gap-x-3 py-2.5";
            /* The phone row draws no bar and still declares its value, so the
               rule that reads drawn length against value keeps working the day
               this form grows one. */
            return r.href
              ? <a key={r.key} href={r.href} data-lands={r.lands} className={cls} data-row={r.key} data-value={r.value}>{row}</a>
              : <div key={r.key} className={cls} data-row={r.key} data-value={r.value}>{row}</div>;
          })}
        </div>
      </div>
      {/* THE FOOT, where the caller earns one: the companions on one hairline
          row at 16, then the micro line that says what they are. After every
          form, so the table's `flex-1` still takes the card's spare height
          above it and the foot sits on the card's floor. */}
      {foot && foot.items.length > 0 ? (
        <div data-foot className="mt-3 border-t border-[var(--c-border)] pt-3">
          <CompanionRow items={foot.items} />
          {foot.line ? <p className="mt-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot.line}</p> : null}
        </div>
      ) : foot && foot.line ? (
        <p data-foot className="mt-3 border-t border-[var(--c-border)] pt-3 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{foot.line}</p>
      ) : null}
    </Box>
  );
}
