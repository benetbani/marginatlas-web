/**
 * BarList, A RANKED LIST OF BARS WITH A GRADIENT (2026-09-25; his "the gradient is barely used", and his shadcn blocks' horizontal
 * bar card, chart-card4, drawn on the server in the page's marks). Each row: the thing's glyph, its name (a door where it opens a
 * page), its figure in the very next column (PART 5), and the bar taking the rest of the row, filled with the accent's gradient
 * from its tint to the accent in proportion to the list's largest value. One colour family; the largest bar is simply the longest.
 * A badge word may stand after a name (a cover the law requires).
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import type { Provenance } from "@/lib/spine/provenance";
import type { AnswerType } from "@/lib/spine/country_slots";

export type BarItem = { key: string; label: string; value: number; display: string; href?: string; /** Drawn nowhere since plan 2026-10-12 rhythm-air-inside, Task 5; kept so a caller that passes one still compiles. */ icon?: AtlasIconId; badge?: string | null; /** Where the figure came from (plan 06, task B5). */ prov?: Provenance };

/** `look`, named for what it draws (plan 2026-10-12 rhythm-air-inside, Task 5, fix round 1: it was "icons" while a glyph stood before each
 *  name, and no glyph stands there since tiles on openers only): "slim", a list of things (trades), 10px bars and a 12px row gap; "plain"
 *  (the covers of one insurance), 16px bars and a 24px row gap. The bars and the gap are the two lists' difference, which the page laws
 *  read by the look. */
/** `mark` (2026-09-25, the chain's art direction, C2: a card marks its answer, at most two accent marks): the one bar in the
 *  accent's gradient, the item the card is about (the highest margin, the cover the law requires); every other bar in the neutral
 *  gradient, so the list still reads as a ranking at a glance and the answer is the one bar in colour. Defaults to the largest. */
/** `fill` (2026-09-25): the rows share the height a taller neighbour lends the card, so its foot never stands empty; without a lent
 *  height the rows keep their own. RULED SINCE 2026-09-26 (the United Kingdom's insurance card beside running costs): spread with
 *  `content-between`, four one-line rows stood 45px of nothing apart and read as four loose lines. Now each row takes its share
 *  of the height with its words and bar centred in it, and a hairline divides the rows, the key-value grid's ruled rows. */
/** `reference` (2026-09-26, the goal's M6 guide marks): one value drawn as a tick on every track and keyed once under the list, where
 *  the card's figure is a value the bars are read against (London's middle trade), so a reader sees which rows stand above it. */
/** `stacked` (plan 2026-10-12 rhythm-air-inside, Task 5, fix round 1): the narrow card's row at every width, the name and its figure on one
 *  line and the bar the row's full width 8 under them (a thing's own line, DISTANCES 4), stamped `data-form="stacked"`; for the city's market card, which stands beside the
 *  districts' table on one page and must not read as a second one (clause 55). Off, the bar takes the row's last column from 420px. */
/** `quiet` (plan 2026-10-09, home introduction: where new firms last on /gb, whose three loud moments are its own): the marked bar in
 *  ink2 and no bar in the accent, PART 6's mark for a card with no accent figure; off, the accent's gradient as before. */
export function BarList({ items, max, ariaUnit = "", look = "slim", mark, fill = false, stacked = false, reference, quiet = false, answer }: { items: BarItem[]; max?: number; ariaUnit?: string; look?: "slim" | "plain"; mark?: string; fill?: boolean; stacked?: boolean; reference?: { value: number; label: string }; quiet?: boolean; /** The list's answer type (plan 2026-10-13 country-page-journey): stamped data-answer for the answer-type gate. */ answer?: AnswerType }) {
  const live = items.filter((i) => i && Number.isFinite(i.value) && i.value >= 0);
  if (live.length < 2) return null;
  const top = max ?? Math.max(...live.map((i) => i.value));
  /* THE LARGEST, AND EVERY ONE TIED WITH IT (2026-09-25): London's barbers and accountants both keep 22%, and one bar in the accent
     named a single leader the figures do not. A `mark` the caller names is still the one. */
  const topValue = Math.max(...live.map((i) => i.value));
  const isMarked = (i: BarItem) => (mark && live.some((x) => x.key === mark) ? i.key === mark : i.value === topValue);
  return (
    /* THE ROW FOLLOWS THE CARD, NOT THE WINDOW: from 420px of card the bar takes the row's last column; under it (a phone, a third
       of a desktop) the name keeps its column and the bar runs the row's full width on a line of its own, never squeezed to zero. */
    <div className={`[container-type:inline-size] ${fill ? "flex flex-1 flex-col" : ""}`}>
    <ol data-archetype="bar-list" data-visual="1" data-look={look} {...(stacked ? { "data-form": "stacked" } : {})} data-rows={String(live.length)} {...(answer ? { "data-answer": answer } : {})} className={`m-0 grid list-none items-center gap-x-3 p-0 ${fill ? "flex-1 gap-y-0 " : look === "slim" ? "gap-y-3 " : "gap-y-6 "}grid-cols-[minmax(0,1fr)_auto]${stacked ? "" : " [@container(min-width:420px)]:grid-cols-[minmax(0,24ch)_auto_minmax(0,1fr)]"}`}>
      {live.map((i, idx) => {
        const w = top > 0 ? Math.max(2, (i.value / top) * 100) : 0;
        const name = i.href ? (
          <a href={i.href} className="tap-y inline-block text-[var(--c-ink)] underline-offset-2 transition-colors hover:text-[var(--terra-text)] hover:underline">{i.label}</a>
        ) : (
          <span className="text-[var(--c-ink)]">{i.label}</span>
        );
        return (
          <li key={i.key} data-row={i.key} className={`col-span-full grid max-w-none grid-cols-subgrid items-center${stacked ? " gap-y-2" : ""}${fill ? ` self-stretch content-center py-3${idx > 0 ? " border-t border-[var(--c-border)]" : " pt-0"}${idx === live.length - 1 ? " pb-0" : ""}` : ""}`}>
            <span data-label className="min-w-0 truncate text-[length:var(--t-body)] leading-tight">
              {name}
              {/* The badge is the page's one chip shape (the level pill on the ranges, the buyers on the sale card), 2026-09-26. */}
              {i.badge ? <>{" "}<span className="ml-1 rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 align-middle text-[length:var(--t-body)] font-semibold text-[var(--c-ink2)]">{i.badge}</span></> : null}
            </span>
            {/* The figure stamped for the answer-type gate (plan 2026-10-13 country-page-journey), its wrapper no box, so the Fig stays the grid's item. */}
            <span data-value="" className="contents"><Fig className="text-right text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]" prov={i.prov}>{i.display}</Fig></span>
            <span className={`relative col-span-full block rounded-full ${stacked ? "" : "[@container(min-width:420px)]:col-span-1 "}${look === "slim" ? "h-2.5" : "h-4"}`} role="img" aria-label={`${i.label}: ${i.display}${ariaUnit}`}>
              {/* The track is a painted leaf of its own, so it is ink to anything that measures the card. */}
              <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
              {reference && top > 0 ? <span aria-hidden data-ref-tick className="absolute -bottom-1 -top-1 z-10 w-0.5 rounded-full bg-[var(--c-ink2)]" style={{ left: `calc(${Math.min(100, (reference.value / top) * 100)}% - 1px)` }} /> : null}
              <span aria-hidden data-bar data-marked={isMarked(i) ? "1" : undefined} className="absolute inset-y-0 left-0 rounded-full" style={isMarked(i) ? (quiet ? { width: `${w}%`, backgroundColor: "var(--c-ink2)" } : { width: `${w}%`, backgroundColor: "var(--terra)", backgroundImage: "linear-gradient(90deg, var(--terra-border), var(--terra))" }) : { width: `${w}%`, backgroundColor: "var(--c-line-strong)", backgroundImage: "linear-gradient(90deg, var(--c-border), var(--c-line-strong))" }} />
            </span>
          </li>
        );
      })}
    </ol>
    {reference ? (
      <div data-ref-key className="mt-3 flex items-center gap-2 text-[length:var(--t-body)] text-[var(--c-muted)]">
        <span aria-hidden className="h-3 w-0.5 rounded-full bg-[var(--c-ink2)]" />
        {reference.label}
      </div>
    ) : null}
    </div>
  );
}
