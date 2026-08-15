"use client";

/**
 * src/components/extremes/LensFilter.tsx
 *
 * The one interactive sliver of the /extremes hub: a row of lens chips that
 * lets a reader narrow the page to a single way of looking at the data (what it
 * costs to get in, what an owner keeps, how hard it is to break in, how crowded
 * a trade is) or see them all at once. It is purely presentational: the server
 * still resolves and renders EVERY lens block; this component only shows the
 * chosen one and hides the rest, with an "All" default that shows everything.
 * No data is refetched and no number is recomputed here.
 *
 * Progressive enhancement, degrades without JS: the lens blocks are passed in as
 * already-rendered server children (one node per lens), so when JavaScript does
 * not run the page still shows every resolved block in order, and the chips are
 * simply inert. The default state is "all", so the hydrated and the
 * un-hydrated views agree on what is visible.
 *
 * A lens that did not resolve server-side is absent from `lenses`, so its chip
 * never appears: the filter only ever offers lenses the reader can actually
 * reach. When fewer than two lenses resolve there is nothing to filter between,
 * so the chip row hides itself and the single block stands alone.
 *
 * Accessibility: each chip is a real <button> with aria-pressed reflecting
 * whether its lens is the active view, wired as a tablist-style group with
 * arrow-key roving focus. Reuses the board's chip language (parchment hairline,
 * cream surface, atlas active state) rather than a bespoke control.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

/** The stable key of one lens, shared with the page that renders the blocks.
 *  "catalog" added 2026-08-09: the four home page collections, which land here
 *  because /extremes is already the interesting-subsets surface. */
export type LensKey = "catalog" | "cost" | "take-home" | "break-in" | "crowding";

/** "all" shows every resolved block; a LensKey narrows to that single block. */
type Selection = "all" | LensKey;

/** One resolved lens: its chip label and the already-rendered server block. */
export interface LensEntry {
  /** Stable lens key, used for selection state and the block's anchor. */
  key: LensKey;
  /** Short chip label, e.g. "Cost to open". */
  label: string;
  /** The pre-rendered server block for this lens. */
  node: React.ReactNode;
}

/** Ordered chips: "All" first, then one per resolved lens in page order. */
function chipSelections(lenses: LensEntry[]): Selection[] {
  return ["all", ...lenses.map((l) => l.key)];
}

export function LensFilter({ lenses }: { lenses: LensEntry[] }) {
  const [selected, setSelected] = React.useState<Selection>("all");

  // Nothing to filter between with a single block: render it bare, no chips.
  if (lenses.length < 2) {
    return <div className="space-y-12 md:space-y-16">{lenses.map((l) => l.node)}</div>;
  }

  const selections = chipSelections(lenses);
  const activeIndex = Math.max(0, selections.indexOf(selected));

  // Roving arrow-key focus across the chip group, wrapping at the ends.
  function onChipKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const delta = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (activeIndex + delta + selections.length) % selections.length;
    setSelected(selections[nextIndex]);
    const group = e.currentTarget.parentElement;
    const next = group?.querySelectorAll<HTMLButtonElement>("[data-lens-chip]")[
      nextIndex
    ];
    next?.focus();
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Filter the leaderboards by lens"
        className="mb-10 flex flex-wrap gap-2 md:mb-12"
      >
        {selections.map((sel) => {
          const label =
            sel === "all"
              ? "All"
              : (lenses.find((l) => l.key === sel)?.label ?? sel);
          const isActive = sel === selected;
          return (
            <button
              key={sel}
              type="button"
              data-lens-chip
              aria-pressed={isActive}
              tabIndex={sel === selected ? 0 : -1}
              onClick={() => setSelected(sel)}
              onKeyDown={onChipKeyDown}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-700 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 motion-reduce:transition-none",
                isActive
                  ? "border-atlas-700 bg-atlas-700 text-cream-50"
                  : "border-parchment bg-cream-50 text-cocoa-700 hover:border-atlas-300 hover:text-atlas-700",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="space-y-12 md:space-y-16">
        {lenses.map((l) => (
          <div key={l.key} hidden={selected !== "all" && selected !== l.key}>
            {l.node}
          </div>
        ))}
      </div>
    </div>
  );
}
