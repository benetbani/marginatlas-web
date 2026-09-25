/**
 * BarList, A RANKED LIST OF BARS WITH A GRADIENT (2026-09-25; his "the gradient is barely used", and his shadcn blocks' horizontal
 * bar card, chart-card4, drawn on the server in the page's marks). Each row: the thing's glyph, its name (a door where it opens a
 * page), its figure in the very next column (PART 5), and the bar taking the rest of the row, filled with the accent's gradient
 * from its tint to the accent in proportion to the list's largest value. One colour family; the largest bar is simply the longest.
 * A badge word may stand after a name (a cover the law requires).
 */
import * as React from "react";
import { Fig, Ico } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";

export type BarItem = { key: string; label: string; value: number; display: string; href?: string; icon?: AtlasIconId; badge?: string | null };

/** `look`: "icons" draws each thing's glyph before its name (a list of trades); "plain" draws the name alone, for a list whose
 *  items share no glyph worth drawing (the covers of one insurance). The page laws read it as the two lists' difference. */
/** `mark` (2026-09-25, the chain's art direction, C2: a card marks its answer, at most two accent marks): the one bar in the
 *  accent's gradient, the item the card is about (the highest margin, the cover the law requires); every other bar in the neutral
 *  gradient, so the list still reads as a ranking at a glance and the answer is the one bar in colour. Defaults to the largest. */
/** `fill` (2026-09-25): the rows share the height a taller neighbour lends the card, so its foot never stands empty; without a lent
 *  height the rows keep their own. RULED SINCE 2026-09-26 (the United Kingdom's insurance card beside running costs): spread with
 *  `content-between`, four one-line rows stood 45px of nothing apart and read as four loose lines. Now each row takes its share
 *  of the height with its words and bar centred in it, and a hairline divides the rows, the key-value grid's ruled rows. */
export function BarList({ items, max, ariaUnit = "", look = "icons", mark, fill = false }: { items: BarItem[]; max?: number; ariaUnit?: string; look?: "icons" | "plain"; mark?: string; fill?: boolean }) {
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
    <ol data-archetype="bar-list" data-visual="1" data-look={look} data-rows={String(live.length)} className={`m-0 grid list-none items-center gap-x-3 p-0 ${fill ? "flex-1 gap-y-0 " : look === "icons" ? "gap-y-3 " : "gap-y-6 "}${look === "icons" ? "grid-cols-[auto_minmax(0,1fr)_auto] [@container(min-width:420px)]:grid-cols-[auto_minmax(0,24ch)_auto_minmax(0,1fr)]" : "grid-cols-[minmax(0,1fr)_auto] [@container(min-width:420px)]:grid-cols-[minmax(0,24ch)_auto_minmax(0,1fr)]"}`}>
      {live.map((i, idx) => {
        const w = top > 0 ? Math.max(2, (i.value / top) * 100) : 0;
        const name = i.href ? (
          <a href={i.href} className="text-[var(--c-ink)] underline-offset-2 transition-colors hover:text-[var(--terra-text)] hover:underline">{i.label}</a>
        ) : (
          <span className="text-[var(--c-ink)]">{i.label}</span>
        );
        return (
          <li key={i.key} data-row={i.key} className={`col-span-full grid max-w-none grid-cols-subgrid items-center${fill ? ` self-stretch content-center py-3${idx > 0 ? " border-t border-[var(--c-border)]" : " pt-0"}${idx === live.length - 1 ? " pb-0" : ""}` : ""}`}>
            {look === "icons" ? (i.icon ? <Ico id={i.icon} tone="terra" /> : <span aria-hidden />) : null}
            <span data-label className="min-w-0 truncate text-[length:var(--t-body)] leading-tight">
              {name}
              {i.badge ? <span className="ml-2 rounded border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 align-middle text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]">{i.badge}</span> : null}
            </span>
            <Fig className="text-right text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{i.display}</Fig>
            <span className={`relative col-span-full block rounded-full [@container(min-width:420px)]:col-span-1 ${look === "icons" ? "h-2.5" : "h-4"}`} role="img" aria-label={`${i.label}: ${i.display}${ariaUnit}`}>
              {/* The track is a painted leaf of its own, so it is ink to anything that measures the card. */}
              <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
              <span aria-hidden data-bar data-marked={isMarked(i) ? "1" : undefined} className="absolute inset-y-0 left-0 rounded-full" style={isMarked(i) ? { width: `${w}%`, backgroundColor: "var(--terra)", backgroundImage: "linear-gradient(90deg, var(--terra-border), var(--terra))" } : { width: `${w}%`, backgroundColor: "var(--c-line-strong)", backgroundImage: "linear-gradient(90deg, var(--c-border), var(--c-line-strong))" }} />
            </span>
          </li>
        );
      })}
    </ol>
    </div>
  );
}
