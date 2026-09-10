/**
 * RankedBars , THE RANKED-BARS ARCHETYPE. Vertical bars from a zero baseline,
 * sorted low to high so the best stands high and right (rule 29A); the
 * figure at the lead rung above each bar, the name beneath as the link; a
 * hairline top rule at the WORLD'S HIGHEST value for the metric, so only the
 * world leader touches it (founder ruling 13, 2026-09-04); a basis line and
 * a withheld line in the practical register. Below 768 the phone gets a
 * two-column table, because six names cannot stand under six bars at 327px
 * without cutting.
 *
 * SIX OR MORE RANKED MEMBERS ARE A TABLE, NOT COLUMNS (task 13, 2026-09-10).
 * PART 5's district rows and PART 9 rule 20 both say it, in his words: a
 * ranking of six or more read left to right "is why the order read as
 * confusing". The district card was seven columns. It is now seven rows read
 * top to bottom, each row PART 5's own grid, `[minmax(0,22ch) auto 1fr]`,
 * name then the figure in the very next column then a track that absorbs the
 * leftover width. Two faults close with it. The first is his: at 768 the old
 * two-column table put a name at one edge of a 720px card and its figure at
 * the other ("the distance between the category and the word is very big,
 * which is a major mistake that you should have never done, because it makes
 * it unreadable"); the figure now sits against its name at every width over
 * 420px, and under 420 PART 5 prescribes the two-column form the phone table
 * already draws. The second is a hole: deleting the invented notes list left
 * the card 222px short of the tall card beside it, and a bar chart cannot
 * fill that, because a taller chart grows its own blank triangle over the
 * short bars (measured: 299x138 at 1280). Rows on `auto-rows-fr` share
 * whatever height the band hands them, which is PART 5's height law solving
 * the hole rather than a size tuned to one page.
 *
 * THE TRACK IS THE SET'S OWN, AND CARRIES NO `data-track`. It measures a
 * district against the heaviest district drawn three rows above it, not
 * against a world maximum, so PART 9 rule 5 (a figure on a WORLD track needs
 * its placement line beside it) is not in play and marking it as a world
 * track would be a false claim about what it compares. The short table keeps
 * two columns and no track for exactly this reason: there `top` can be a
 * world maximum the card never draws.
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
 * that change); the leader alone gets `data-pill` and the ink fill, so which
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
  /** The world's highest value for this metric, as the same unit as `value`. */
  worldMax: number;
  fmt: (v: number) => string;
  phoneHead: { name: string; value: string };
  /** "max": the highest value leads (a margin). "min": the lowest leads (a burden such as a rent load). */
  best?: "max" | "min";
  /** The words at the top rule; the world's best by default, the set's heaviest for a burden. */
  topLabel?: string;
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
const ROW = "grid grid-cols-[minmax(0,22ch)_auto_1fr] gap-x-3";

export function RankedBars({ id, kicker, icon, tagged, basis, withheldLine, rows, worldMax, fmt, phoneHead, best = "max", topLabel }: RankedBarsProps) {
  if (rows.length < 2) return null;
  const ascending = [...rows].sort((a, b) => a.value - b.value);
  /* THE LEADER IS ALWAYS THE RIGHT-MOST BAR: the highest for a margin, the lowest for a burden. */
  const sorted = best === "min" ? ascending.slice().reverse() : ascending;
  const leader = sorted[sorted.length - 1];
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
            const isLeader = r.key === leader.key;
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
                      data-pill={isLeader ? "1" : undefined}
                      className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 ${isLeader ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                    >
                      <Fig className="font-medium">{fmt(r.value)}</Fig>
                    </span>
                  </div>
                  <div aria-hidden="true" style={{ width: 28, height: h, background: isLeader ? "var(--terra)" : "var(--c-border)", backgroundImage: isLeader ? undefined : HATCH[0], borderRadius: "2px 2px 0 0" }} />
                </div>
                {/* THE UNDERLINE IS A LINK'S, so a name with no door wears none (the
                    district photograph of run 25 showed seven underlined names and
                    no destination, a promise the card could not keep). */}
                <div className={`text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-ink)] ${r.href ? "underline decoration-[var(--c-line-strong)] decoration-1 underline-offset-[3px]" : ""}`} style={{ paddingTop: 7, minHeight: NAME_H }}>{r.name}</div>
              </>
            );
            return (
              <li key={r.key} style={{ minWidth: 0 }} data-bar={r.key} data-row={r.key}>
                {r.href ? <a href={r.href} className="block no-underline">{inner}</a> : inner}
              </li>
            );
          })}
        </ol>
      </div> : null}
      {drawWide ? (
        <div className="mt-2.5 hidden flex-1 flex-col sm:flex" data-idea="I2">
          <div className={`${ROW} items-baseline pb-2`}>
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.name}</span>
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{phoneHead.value}</span>
            <span aria-hidden="true" />
          </div>
          <div className="grid flex-1 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={sorted.length} style={{ gridAutoRows: "minmax(2.5rem,1fr)" }}>
            {ranked.map((r) => {
              const isLeader = r.key === leader.key;
              const row = (
                <>
                  <span className="min-w-0 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{r.name}</span>
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
                      data-pill={isLeader ? "1" : undefined}
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${isLeader ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                    >
                      {fmt(r.value)}
                    </span>
                  </Fig>
                  <span aria-hidden="true" className="relative block h-3 overflow-hidden rounded-full bg-[var(--c-soft)]">
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(Math.max(0, Math.min(1, r.value / top)) * 100).toFixed(1)}%`, background: isLeader ? "var(--terra)" : "var(--c-border)", backgroundImage: isLeader ? undefined : HATCH[0] }} />
                  </span>
                </>
              );
              const cls = `${ROW} items-center`;
              return r.href ? <a key={r.key} href={r.href} className={cls} data-row={r.key}>{row}</a> : <div key={r.key} className={cls} data-row={r.key}>{row}</div>;
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
            const isLeader = r.key === leader.key;
            const row = (
              <>
                <span className="min-w-0 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{r.name}</span>
                <Fig className="text-right text-[length:var(--t-body)] font-semibold" >
                  {/* THE SAME RESERVED SLOT AS THE BAR FIGURE, above: every
                      row gets the rounded, padded span, only the leader's
                      gets the ink fill and `data-pill`, so a phone row is
                      never taller for being the one that leads. */}
                  <span
                    data-pill={isLeader ? "1" : undefined}
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${isLeader ? "bg-[var(--c-ink)] text-white" : "text-[var(--c-ink)]"}`}
                  >
                    {fmt(r.value)}
                  </span>
                </Fig>
              </>
            );
            const cls = "flex items-baseline justify-between gap-x-3 py-2.5";
            return r.href ? <a key={r.key} href={r.href} className={cls} data-row={r.key}>{row}</a> : <div key={r.key} className={cls} data-row={r.key}>{row}</div>;
          })}
        </div>
      </div>
    </Box>
  );
}
