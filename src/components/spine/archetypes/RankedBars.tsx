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
 * THE REFERENCE ROW WEARS THE PILL ON ITS NAME AND PRINTS NO FIGURE (task 13
 * fix wave, 2026-09-10). A set rebased onto one of its own members holds one
 * row whose figure is a multiple of ITSELF: 1, for every such set, forever, by
 * definition. PART 5 bans printing that in either shape , "any bare word
 * standing where a figure belongs" rules out the word "cheapest", rule 17
 * rules out "a baseline row written out", and "x1.00" is the string he struck
 * out to begin with ("then you say the city average times one which is the
 * baseline"). So `referenceKey` names that row: its figure cell renders a
 * reserved, empty slot, and the card's ONE pill moves onto its NAME, where an
 * ink pill reads as a reference marker instead of asserting a figure that is
 * not one. Every other row keeps its figure, and the card still carries
 * exactly one pill, which is what the archetype harness proves. A
 * `referenceKey` that is not the leading row is IGNORED on purpose: a row that
 * lost its figure without gaining the pill would read as missing data, and no
 * caller can cause that by accident. A second member tied exactly at the
 * reference prints its true "x1.00", which under a basis whose reference is
 * drawn, named and a few rows away is a claim the eye can check on the card
 * itself, not the invisible average he struck out.
 *
 * THE SHORT TABLE (fewer than four rows, and every phone) keeps two columns
 * and draws no track at all: there is no third column to absorb the leftover
 * width at 375, and `top` is the caller's ceiling whether or not the card
 * draws it.
 *
 * THE BLACK PILL, NOT THE ACCENT (task 12, 2026-09-10). Ported from mechanic
 * M2 (B2) of design/references/founder-2026-09-10.md: every member of a set
 * pale or hatched, exactly ONE saturated, that one member's value in a black
 * pill with white text. The leader's figure used to be terracotta TEXT , a
 * difference of hue at the same size and weight; it is now an ink pill , a
 * difference of FORM, the same size as every sibling figure so only the
 * container marks it out. It survives greyscale and a colourblind reader,
 * and it spends nothing from the page's accent budget (an ink pill is not
 * accent text). EVERY row, leader or not, renders the same pill-shaped slot
 * (`px-*.py-*` and `rounded-full`, background and colour the only things
 * that change); the leader alone gets `data-pill` and the ink fill, on its
 * figure, or on its NAME when it is also the reference row above, so which
 * row happens to lead never changes the row's height (ruling 8). The bar
 * itself still carries the hue: full terracotta for the leader (a filled bar
 * is a mark, not a figure), and for the rest a hatch in --c-border , reusing
 * the exact pattern IncomeBreakdown.tsx already draws rather than a second
 * hatch system , over a flat tint, so the non-leaders stay countable instead
 * of becoming grey ghosts.
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
import { COPY } from "./copy";
/* THE HATCH IS SHARED, NOT REINVENTED (task 12): IncomeBreakdown.tsx drew
 * the one repeating-line pattern this site uses for "not the answer, still
 * countable"; importing it here rather than writing a second one is the
 * whole point , two hatch systems would drift apart the first time either
 * one changed. */
import { HATCH } from "./IncomeBreakdown";

export type BarRow = { key: string; name: string; href?: string; value: number; flagged?: boolean;
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
  /** The row every other figure is measured against, when the set is rebased on
   *  one of its own members: its figure cell prints nothing and the card's one
   *  pill moves to its name. Ignored unless it is the leading row (header). */
  referenceKey?: string;
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
   that happens to fit "x2.50". `ch` is the unit because it is the advance of
   "0" in the row's own font at the row's own size, and the figure is drawn in
   that same font at that same size (measured on this page: row 16px, figure
   16px), so n characters of figure occupy at most n ch whenever no glyph in
   the string is wider than a digit. THE BLIND SPOT, stated rather than
   assumed: this cannot distinguish a formatter whose glyphs are all digit
   width or narrower from one carrying a wider glyph (a "%" is wider than "0"
   in some faces). An overrun of a few pixels is absorbed by the 12px column
   gap before it reaches the track, and a real one is reported by the
   harness's own overflow rule, which reds a figure cell whose content is
   wider than its box. */
const wideColumns = (figChars: number): React.CSSProperties => ({
  gridTemplateColumns: `minmax(0,22ch) calc(${figChars}ch + 1rem) minmax(0,1fr)`,
});
/* THE PILL ON A NAME, the same shape as the pill on a figure so the card
   carries one mark and not two ideas of a mark. It goes ON the name element
   itself and NEVER in a span inside it: a district row with a second element
   inside its name cell is what an invented one-word descriptor looked like,
   and `check_model_laws.mjs`'s DISTRICT ADJECTIVE rule reads exactly that
   shape ("#districts [data-row] > span:first-child > span"). Measured, not
   assumed: the first cut of this pill nested a span and the rule reported the
   district's own NAME as free text on the row. `w-fit` keeps a stretched grid
   item hugging its name instead of pilling the whole column, and the two
   branches never both set a text colour, because which of two colour classes
   wins is decided by the order Tailwind emits them, not by this file. */
const PILL_NAME = "w-fit rounded-full bg-[var(--c-ink)] px-2 py-0.5 text-white";
/* EVERY NAME RESERVES THE PILL'S HEIGHT, exactly as every figure already
   reserves its own: `py-0.5` on all of them, the fill and the colour the only
   things that change, so which row happens to wear the pill can never decide
   how tall a row is (ruling 8). Only the HORIZONTAL padding belongs to the
   pill, which is why it is not in the base: the pill's left edge lands on the
   same column edge every other name starts at, and the name inside it is
   inset, which is what a pill looks like. Measured after the change, at all
   three widths: every row's CONTENT box is one height (55/40/45), and the
   border-box of the first row is 1px under its siblings' at 375 for a reason
   that has nothing to do with this , `divide-y` hangs its hairline on
   `> * + *`, so the first row's line is drawn by the container's own
   `border-t` instead. Positional, universal to every divided list in the kit,
   and there before any of this. */
const NAME_BASE = "min-w-0 py-0.5 text-[length:var(--t-body)] font-medium";
const nameCls = (isRef: boolean) => (isRef ? `${NAME_BASE} ${PILL_NAME}` : `${NAME_BASE} text-[var(--c-ink)]`);

/* THE RESERVED EMPTY SLOT (task 13 fix wave): the reference row's figure cell
   renders the same padded, rounded box as every other figure, holding a
   non-breaking space, so the row is exactly as tall as its siblings (ruling 8)
   and nothing prints where a figure would assert something untrue. `&nbsp;`
   as an entity, not a literal character, is how KvGrid already reserves a
   heading line, and it stays visible to whoever reads this file next; it also
   trims to "" for every gate that walks text, so no rule reads it as a word. */
const BLANK = <>&nbsp;</>;

export function RankedBars({ id, kicker, icon, tagged, basis, withheldLine, rows, worldMax, fmt, phoneHead, best = "max", topLabel, ceiling = "world", referenceKey }: RankedBarsProps) {
  if (rows.length < 2) return null;
  const ascending = [...rows].sort((a, b) => a.value - b.value);
  /* THE LEADER IS ALWAYS THE RIGHT-MOST BAR: the highest for a margin, the lowest for a burden. */
  const sorted = best === "min" ? ascending.slice().reverse() : ascending;
  const leader = sorted[sorted.length - 1];
  /* A REFERENCE THAT IS NOT THE LEADER IS IGNORED (see the header): no row ever
     loses its figure without gaining the card's pill in the same move. */
  const refKey = referenceKey && referenceKey === leader.key ? referenceKey : undefined;
  const top = Math.max(worldMax, ascending[ascending.length - 1].value);
  /* FEWER THAN FOUR ROWS RECONFIGURE TO THE TABLE AT EVERY WIDTH. Measured by
     the harness: two bars across a card leave a 480x144 hole (E6), the
     sparse-but-wide fault the founder names most often; the table holds two
     rows as honestly as six. The constitution recorded this rule in run 10. */
  const drawBars = sorted.length >= 4 && sorted.length < WIDE_ROWS;
  /* SIX OR MORE READ TOP TO BOTTOM AT EVERY WIDTH (rule 20), which is why
     this is not another breakpoint: the columns are wrong at 1280 as well. */
  const drawWide = sorted.length >= WIDE_ROWS;
  const ranked = [...sorted].reverse();
  /* THE WIDEST FIGURE THE CARD ACTUALLY DRAWS, counted once, in characters:
     the reference row contributes 1 for its reserved `&nbsp;`, every other row
     the length of its own formatted figure. See wideColumns above for why the
     count becomes a `ch` width and what that unit cannot see. */
  const figChars = Math.max(1, ...sorted.map((r) => (r.key === refKey ? 1 : fmt(r.value).length)));
  const GEO = wideColumns(figChars);
  return (
    <Box id={id} className={drawWide ? "flex flex-col" : ""} data-archetype="ranked-bars" data-leader-key={leader.key}>
      <Rail icon={icon} kicker={kicker} sample={tagged} />
      <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
      {withheldLine ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{withheldLine}</p> : null}
      {drawBars ? <div className="relative mt-2.5 hidden lg:block" data-idea="I2">
        <div aria-hidden="true" className="absolute inset-x-0 h-px bg-[var(--c-border)]" style={{ top: PILL }} />
        <div className="absolute right-0 text-[length:var(--t-micro)] text-[var(--c-muted)]" style={{ top: 8 }}>{topLabel ?? COPY.margin.worldBest} {fmt(top)}</div>
        <div aria-hidden="true" className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: H + PILL }} />
        <ol className="grid" data-expect-rows={sorted.length} style={{ listStyle: "none", margin: 0, padding: 0, gridAutoFlow: "column", gridAutoColumns: "minmax(0,1fr)", columnGap: 8 }}>
          {sorted.map((r) => {
            const isRef = r.key === refKey;
            const isLeader = r.key === leader.key;
            /* THE PILL IS THE CARD'S ONE MARK, and it sits on the leader's
               FIGURE unless that row is also the reference: there is no figure
               to sit on then, so it moves to the name. The bar keeps the
               leader's hue either way. */
            const figPill = isLeader && !isRef;
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
                      aria-hidden={isRef ? true : undefined}
                      className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 ${figPill ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                    >
                      <Fig className="font-medium">{isRef ? BLANK : fmt(r.value)}</Fig>
                    </span>
                  </div>
                  <div aria-hidden="true" style={{ width: 28, height: h, background: isLeader ? "var(--terra)" : "var(--c-border)", backgroundImage: isLeader ? undefined : HATCH[0], borderRadius: "2px 2px 0 0" }} />
                </div>
                {/* THE UNDERLINE IS A LINK'S, so a name with no door wears none (the
                    district photograph of run 25 showed seven underlined names and
                    no destination, a promise the card could not keep). */}
                <div className={`text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-ink)] ${r.href ? "underline decoration-[var(--c-line-strong)] decoration-1 underline-offset-[3px]" : ""}`} style={{ paddingTop: 7, minHeight: NAME_H }}>{isRef ? <span data-pill="1" className={`inline-block ${PILL_NAME}`}>{r.name}</span> : r.name}</div>
              </>
            );
            return (
              <li key={r.key} style={{ minWidth: 0 }} data-bar={r.key} data-row={r.key} data-value={r.value}>
                {r.href ? <a href={r.href} className="block no-underline">{inner}</a> : inner}
              </li>
            );
          })}
        </ol>
      </div> : null}
      {drawWide ? (
        <div className="mt-2.5 hidden flex-1 flex-col sm:flex" data-idea="I2">
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
              const isRef = r.key === refKey;
              const isLeader = r.key === leader.key;
              const figPill = isLeader && !isRef;
              const row = (
                <>
                  <span data-pill={isRef ? "1" : undefined} className={nameCls(isRef)}>{r.name}</span>
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
                      aria-hidden={isRef ? true : undefined}
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${figPill ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                    >
                      {isRef ? BLANK : fmt(r.value)}
                    </span>
                  </Fig>
                  {/* THE TRACK DECLARES ITS CEILING (task 13 fix wave): the
                      attribute is what the harness iterates, and its value is
                      whether the far end is the world's or this set's own. */}
                  <span aria-hidden="true" data-track={ceiling} className="relative block h-3 overflow-hidden rounded-full bg-[var(--c-soft)]">
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(Math.max(0, Math.min(1, r.value / top)) * 100).toFixed(1)}%`, background: isLeader ? "var(--terra)" : "var(--c-border)", backgroundImage: isLeader ? undefined : HATCH[0] }} />
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
                ? <a key={r.key} href={r.href} className={cls} style={GEO} data-row={r.key} data-value={r.value}>{row}</a>
                : <div key={r.key} className={cls} style={GEO} data-row={r.key} data-value={r.value}>{row}</div>;
            })}
          </div>
        </div>
      ) : null}
      <div className={drawBars ? "mt-2.5 lg:hidden" : drawWide ? "mt-2.5 sm:hidden" : "mt-2.5"}>
        <div className="flex items-baseline justify-between pb-2">
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.name}</span>
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.value}</span>
        </div>
        <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={sorted.length}>
          {[...sorted].reverse().map((r) => {
            const isRef = r.key === refKey;
            const isLeader = r.key === leader.key;
            const figPill = isLeader && !isRef;
            const row = (
              <>
                <span data-pill={isRef ? "1" : undefined} className={nameCls(isRef)}>{r.name}</span>
                <Fig className="text-right text-[length:var(--t-body)] font-semibold" >
                  {/* THE SAME RESERVED SLOT AS THE BAR FIGURE, above: every
                      row gets the rounded, padded span, only the leader's
                      gets the ink fill and `data-pill`, so a phone row is
                      never taller for being the one that leads, and the
                      reference row's holds a non-breaking space so it is
                      never SHORTER for having no figure to print. */}
                  <span
                    data-pill={figPill ? "1" : undefined}
                    aria-hidden={isRef ? true : undefined}
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${figPill ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                  >
                    {isRef ? BLANK : fmt(r.value)}
                  </span>
                </Fig>
              </>
            );
            const cls = "flex items-baseline justify-between gap-x-3 py-2.5";
            /* The phone row draws no bar and still declares its value, so the
               rule that reads drawn length against value keeps working the day
               this form grows one. */
            return r.href
              ? <a key={r.key} href={r.href} className={cls} data-row={r.key} data-value={r.value}>{row}</a>
              : <div key={r.key} className={cls} data-row={r.key} data-value={r.value}>{row}</div>;
          })}
        </div>
      </div>
    </Box>
  );
}
