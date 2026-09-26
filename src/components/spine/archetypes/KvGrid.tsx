/**
 * KvGrid , THE KEY-VALUE GRID ARCHETYPE. Label over figure over one qualifier,
 * no borders and no tiles (the founder's tile ban of 2026-08-30), a row
 * heading printed once for a group of cells (his repetition verdict: "said it
 * once at the top as a column"), and the law built in:
 *
 *  - EQUAL ROWS (ruling 8, 2026-09-04): below the wide layouts every label
 *    reserves two lines, so a label that wraps never drops its figure below
 *    its neighbour's; from lg up the labels are one line and the reserve
 *    is off. Figures in one row share a baseline by construction.
 *  - NO EMPTY SLOT, EVER: a cell without a value is not rendered; a grid
 *    without cells renders nothing. Rows appear as data lands.
 *  - COMPLETE ROWS (PART 9 clause 10, "three cells in a four-cell grid with
 *    a hole"; plan step 31's second dispatch, 2026-09-17, the first card to
 *    hand this grid five cells in one group): a group of an odd count above
 *    one never leaves a slot open in its last row. Its FIRST cell takes the
 *    width, the lone-cell law below applied inside a group, and the rest
 *    pair off beneath it. So five cells are one wide and two rows of two,
 *    three are one wide and one row of two, and no row is short. Which cell
 *    leads is the caller's order; the width marks nothing (same rung, same
 *    ink) and it is the silhouette the focal-cell candidate would take the
 *    day he clicks it, so only the rung would change then.
 *  - ONE ACCENT, NEVER HERE: cells are ink; the accent belongs to the answer.
 *  - A MODELLED CELL CARRIES ITS OWN TAG (rule 4A), beside its label.
 *  - AN ICON A CELL (the goal of 2026-09-26, M6; his message that afternoon:
 *    "The sections that lack icons, guiding elements and helping typography
 *    and hierarchy should be studied"): a cell may carry one glyph of the
 *    atlas set, drawn in the terracotta tile before its label (his
 *    2026-09-19 "the big missed chance is to put it at the icons"), so four
 *    cells read as four things at a glance before a word is read. The tile
 *    and the label are one line on the label's floor, so the label still
 *    touches its figure; the figure keeps the cell's full width.
 *  - THE COLUMNS FOLLOW THE GRID'S OWN WIDTH (build loop run 7, 2026-09-05):
 *    cells sit in GROUPS, a run of cells under one heading or none; inside a
 *    group two columns (one for a lone cell); when the grid is at least 900
 *    pixels wide the groups sit side by side, each heading over its own
 *    cells, so a wide card holds four cells across instead of two columns
 *    spread over it with air between (the how-to hero, run 5). Narrower, the
 *    groups stack as before, so the answer card's docked grid is unchanged.
 *    A container query, not a breakpoint: the grid decides, not the page.
 *
 * Programmatic by construction: the same component draws the masthead grid of
 * every country, the how-to hero, and any other label-over-figure set.
 */
import * as React from "react";
import { Fig, Ico, SampleTag } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";

export type KvCell = {
  key: string;
  label: string;
  value: React.ReactNode;
  note?: string;
  group?: string;
  confidence?: "measured" | "modeled" | "placeholder";
  /** The cell's glyph, before its label (the header's AN ICON A CELL). */
  icon?: AtlasIconId;
};

/* The container-query classes are written out in full below, never assembled from a constant: the stylesheet compiler scans source for literal class strings and generates nothing for a template. */

/**
 * THE LABEL RESERVE, TWO WAYS (plan step 33's second dispatch, 2026-09-18,
 * the trade page's `03 permits`, MODEL.md 8.6). The default, "two-lines", is
 * the law above: two lines below lg, none from lg up, right for every label
 * a builder writes (four words at most). "row" is for a grid whose labels
 * are NAMES the caller may not shorten (a licence is what the shard calls
 * it, five to twelve words, "Food service or retail food establishment
 * permit"): a fixed reserve is either too short for those or too tall for
 * everything else, so the reserve becomes THE ROW'S OWN TALLEST LABEL. Each
 * cell is a column and its figure sits on the cell's floor; the grid row is
 * as tall as its tallest label; so every figure in a row shares one top by
 * construction, at every width, whatever the labels wrap to. Ruling 8 held
 * by a different mechanism, not relaxed: the archetype harness's UNEQUAL
 * rule reads the figures' tops and does not know which reserve drew them.
 * One limit, stated: a `note` under a figure lifts that figure off the
 * floor, so a "row" grid carries no notes (the permits cells carry none).
 */
export type KvLabelReserve = "two-lines" | "row";

/** `stack` (2026-09-24): the cells one under the other at every width, for a pair beside a taller neighbour (the answer card whose answer draws its share and whose companions are two: the industry hero with its cost withheld stood 480 by 162 of air beside the drawn answer, side by side). */
/** `under` (2026-09-25): the grid stands under the card's own figure at 30, so its figures take the lead rung, 16, and the ladder
 *  keeps its one gap between 16 and 30 (PART 4); the grid alone keeps the head rung. */
/** `fill` (2026-09-25): the grid takes the height the level lends its card (a taller neighbour) and its rows share it evenly, as
 *  the tables' and the share bar's `fill` do, instead of a blank under the last cell; a row never falls under its content. The
 *  caller's card is a flex column. */
/** `across` (2026-09-26): a group of exactly three cells stands three across from 440px of grid, its labels keeping their two-line
 *  reserve at every width so the three figures share one top; the caller asks for it where a lone lead cell would stand beside a
 *  blank (the borrowing card). */
export function KvGrid({ cells, className = "", labelReserve = "two-lines", stack = false, under = false, fill = false, across = false }: { cells: KvCell[]; className?: string; labelReserve?: KvLabelReserve; stack?: boolean; under?: boolean; fill?: boolean; across?: boolean }) {
  const byRow = labelReserve === "row";
  const live = cells.filter((c) => c.value != null && c.value !== "");
  if (live.length === 0) return null;
  const groups: Array<{ group?: string; cells: KvCell[] }> = [];
  for (const c of live) {
    const last = groups[groups.length - 1];
    if (last && last.group === c.group) last.cells.push(c);
    else groups.push({ group: c.group, cells: [c] });
  }
  const anyHeading = groups.some((g) => g.group);
  /* THE GRID'S TWO SHAPES, DECLARED (his clause 55, the page laws' KIND TWINS,
     2026-09-20): a group of an odd count above one leads with a cell across
     both columns ("lead"), an even count is a plain grid of pairs ("grid"), a
     lone cell takes the width ("one"). Two grids on one page are twins only
     when they are the same shape; the shape is read off the first group, the
     one the eye meets. */
  const first = groups[0].cells.length;
  const form = stack ? "stack" : first === 1 ? "one" : first % 2 === 1 ? "lead" : "grid";
  return (
    <div data-idea="I8" data-archetype="kv-grid" data-groups={String(groups.length)} data-form={form} className={`[container-type:inline-size] ${fill ? "flex flex-1 flex-col" : ""} ${className}`}>
      {/* THE GROUPS: stacked below 900px, side by side above it, equal widths. */}
      <div className={`grid gap-x-10 gap-y-4 [@container(min-width:900px)]:grid-flow-col [@container(min-width:900px)]:auto-cols-fr ${fill ? "flex-1" : ""}`}>
        {groups.map((g, gi) => (
          <div key={`${g.group ?? "cells"}-${gi}`} data-kv-group={g.group ?? ""} className={fill ? "grid gap-y-4" : "grid content-start gap-y-4"}>
            {g.group ? (
              <div className="-mb-2 text-[length:var(--t-body)] font-semibold text-[var(--c-ink2)]">{g.group}</div>
            ) : anyHeading ? (
              /* A GROUP WITHOUT A HEADING RESERVES THE HEADING'S LINE when the
                 groups sit side by side, so every figure in the row shares
                 one baseline; stacked, the reserve is hidden. */
              <div aria-hidden className="-mb-2 hidden text-[length:var(--t-body)] font-semibold [@container(min-width:900px)]:block">&nbsp;</div>
            ) : null}
            {/* A LONE CELL TAKES THE WIDTH. Measured by the harness on the three
                countries that hold one companion fact: a two-column grid with one
                cell left its second column as a 232x144 hole at 768 and 170x132
                at 375. The column count follows the cells, never the other way. */}
            {(() => {
              const cols = g.cells.length > 1 && !stack ? 2 : 1;
              const lead = cols === 2 && g.cells.length % 2 === 1;
              /* THREE CELLS STAND THREE ACROSS FROM 440px OF GRID where the caller asks (`across`, 2026-09-26: the page filter's
                 WHITE SPACE on the United Kingdom's borrowing card at 768, a 439 by 138 blank beside the lead cell alone on its row
                 once the icons grew its label line, and the chain's gathered-emptiness at 1280 and 1440, 160 by 126 beside the
                 same cell). Asked, not assumed: applied to every group of three it opened a 602 by 126 hole in the industry page's
                 answer card and dropped a district card's figure 18px under its neighbours. Three across the gap is 24px, so a
                 cell keeps 143px of a 478px grid. */
              const three = across && cols === 2 && g.cells.length === 3 && !byRow;
              /* THE ROWS SHARE THE HEIGHT AS ROWS, NOT AS GAPS (2026-09-26, the United Kingdom's legal and admin card beside the
                 five spectra). A filling grid's rows were stretched with the words pinned to each row's top, so the spare height
                 stood as a blank under every row, 50px and more. Now a filling grid draws its rows as rows: each row a unit, its
                 cells sharing one top line, the unit centred in its share of the height, and one hairline across the card between
                 rows, the spectra card's own rhythm. Centring each CELL instead (the first try, the same day) dropped a figure
                 with no note 10px under its neighbour that had one. Without spare height (a stacked card on a phone) a row is its
                 natural height, 12px of air each side of the hairline. */
              const ruledRows = fill && !byRow;
              const cellEl = (c: KvCell, ci: number) => (
                /* COMPLETE ROWS: in an odd group above one, the first cell spans both columns (a ruled row of one is its own row). */
                <div key={c.key} data-kv-cell={c.key} className={`${lead && ci === 0 && !ruledRows ? (three ? "col-span-2 [@container(min-width:440px)]:col-span-1" : "col-span-2") : ""} ${byRow ? "flex flex-col" : ""}`.trim() || undefined}>
                  {/* THE RESERVE IS EXACTLY TWO LINES BY CONSTRUCTION (plan step 31's
                      second dispatch, 2026-09-17, the first cards whose labels wrap at
                      375 and 768, "Net wealth per adult" and "Shop rent, major cities").
                      It read min-h 2.6em over an INHERITED line height of 1.5, so it
                      held 1.73 lines and a wrapped label pushed its figure 5px under
                      its neighbour's, measured on the rendered page; every earlier
                      caller had one-line labels, so the gap never showed. The label
                      now declares its line height, 1.3, and 2.6em is twice it. The
                      reserve itself is unchanged in size on purpose: raising it to
                      2.75em grew every one-line label by 1.8px and tipped a 118px
                      blank on the answer card's Fiji story at 768 over the 120 floor. */}
                  {/* THE LABEL IN SENTENCE CASE AT THE BODY RUNG (2026-09-25, his message: "These 2x2 stacks in sections with capital
                      letters etc have terrible legibility, almost unreadable and bad hierarchy"). Capitals at 12px, tracked and in bold,
                      stood as a band of texture as heavy as the figure under them, and the note beneath matched the label's size: three
                      lines of one weight. Now the question reads as words (14px, regular, muted), the answer is the one bold line in
                      ink (16 under a card's figure, 20 alone), and the note keeps 12px: three rungs, one order. */}
                  {/* THE RESERVE'S AIR ABOVE THE WORDS, NOT UNDER THEM (the same evening, on the phone photograph): a one-line label sat
                      at the top of its two-line box and stood a line's height away from its own figure, closer to the cell above.
                      The words sit on the box's floor, so a label touches its figure and the air joins the gap between rows. */}
                  {/* THE TILE ABOVE THE LABEL UNDER 400px OF GRID (2026-09-26, the phone photograph of the United Kingdom's page): beside
                      the label in a 127px cell the tile left the words 91px, "Government start-up loans" and "Foreign owner's account"
                      took three lines, and their figures dropped under their neighbours'. On a narrow grid the tile stands on its own
                      line INSIDE the reserve, which grows by the tile's 2rem, so the words keep the cell's width and two lines, and a
                      one-line label's spare line falls above its tile, never between the tile and its words. */}
                  <div className={`${byRow ? "" : c.icon ? (three ? "flex min-h-[calc(2.6em+2rem)] flex-col justify-end [@container(min-width:400px)]:min-h-[2.6em] " : "flex min-h-[calc(2.6em+2rem)] flex-col justify-end [@container(min-width:400px)]:min-h-[2.6em] lg:min-h-0 ") : three ? "flex min-h-[2.6em] flex-col justify-end " : "flex min-h-[2.6em] flex-col justify-end lg:min-h-0 "}text-[length:var(--t-body)] leading-[1.3] text-[var(--c-muted)]`}>
                    {c.icon ? <span aria-hidden className="mb-1 inline-flex [@container(min-width:400px)]:hidden"><Ico id={c.icon} tone="terra" /></span> : null}
                    {c.icon ? (
                      <span className="flex items-center gap-2">
                        <span aria-hidden className="hidden [@container(min-width:400px)]:inline-flex"><Ico id={c.icon} tone="terra" /></span>
                        <span className="min-w-0">{c.label}</span>
                      </span>
                    ) : (
                      c.label
                    )}
                  </div>
                  {/* On the "row" reserve the figure sits on the cell's floor (`mt-auto`), so a row's figures share one top whatever their labels wrap to. */}
                  <div className={`${byRow ? "mt-auto pt-1" : "mt-1"} flex flex-wrap items-baseline gap-x-2 gap-y-1`}>
                    <Fig className={`${under ? "text-[length:var(--t-lead)] font-semibold" : "text-[length:var(--t-head)]"} leading-none text-[var(--c-ink)]`}>{c.value}</Fig>
                    {c.confidence && c.confidence !== "measured" ? <SampleTag /> : null}
                  </div>
                  {c.note ? <div className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]" style={{ textWrap: "balance" }}>{c.note}</div> : null}
                </div>
              );
              if (!ruledRows) {
                return (
                  <div className={`grid ${three ? "grid-cols-2 gap-x-10 [@container(min-width:440px)]:grid-cols-3 [@container(min-width:440px)]:gap-x-6" : cols === 2 ? "grid-cols-2 gap-x-10" : "grid-cols-1 gap-x-10"} gap-y-4`}>
                    {g.cells.map((c, ci) => cellEl(c, ci))}
                  </div>
                );
              }
              const pairs = (a: KvCell[]) => {
                const out: KvCell[][] = [];
                a.forEach((c, i) => { if (i % 2 === 0) out.push([c]); else out[out.length - 1].push(c); });
                return out;
              };
              const rows: KvCell[][] = cols === 1 ? g.cells.map((c) => [c]) : lead ? [[g.cells[0]], ...pairs(g.cells.slice(1))] : pairs(g.cells);
              return (
                <div className="grid">
                  {rows.map((r, ri) => (
                    <div key={r[0].key} data-kv-row={ri} className={`flex flex-col justify-center py-3${ri > 0 ? " border-t border-[var(--c-border)]" : " pt-0"}${ri === rows.length - 1 ? " pb-0" : ""}`}>
                      <div className={`grid ${r.length === 2 ? "grid-cols-2" : "grid-cols-1"} items-start gap-x-10`}>
                        {r.map((c) => cellEl(c, g.cells.indexOf(c)))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
