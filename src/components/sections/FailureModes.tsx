/**
 * FailureModes — "Why these businesses fail" panel for cell pages.
 *
 * Reads cell.industry_id; renders 5 specific failure modes per
 * industry from src/lib/qa/industry_failure_modes.ts. Each mode names
 * a recognized operational misjudgment, when it typically hits, and
 * one sentence of explanation.
 *
 * Founder-research lens: every other benchmark site shows only the
 * median. We acknowledge the ditch. This is the single highest-value
 * piece of editorial content on the page for someone considering
 * opening a business.
 *
 * Self-suppresses when the industry has no entry.
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import { getFailureModes } from "@/lib/qa/industry_failure_modes";

type Props = {
  cell: Cell;
};

export function FailureModes({ cell }: Props) {
  if (!cell.industry_id) return null;
  const modes = getFailureModes(cell.industry_id);
  if (!modes || modes.length === 0) return null;

  return (
    <section
      aria-labelledby="failure-modes-heading"
      className="my-8 md:my-12 rounded-2xl border border-ink-200 bg-white overflow-hidden"
    >
      <div className="px-6 py-5 md:px-8 md:py-6 border-b border-ink-100">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700 mb-2">
          The unsexy truth
        </div>
        <h3
          id="failure-modes-heading"
          className="font-display text-xl md:text-2xl text-ink-900 leading-snug"
        >
          Five ways {cell.industry_name?.toLowerCase() ?? "businesses like this"} actually go under
        </h3>
        <p className="mt-2 text-sm md:text-base text-ink-700 leading-relaxed">
          Sourced from SBA survival data and industry trade-press
          post-mortems. Specific operational misjudgments that recur,
          not generic management failings.
        </p>
      </div>

      <ol className="divide-y divide-ink-100">
        {modes.map((mode, i) => (
          <li
            key={mode.label}
            className="px-6 py-5 md:px-8 md:py-6 flex gap-4 md:gap-6"
          >
            <div className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-cream-50 border border-parchment flex items-center justify-center text-sm font-semibold text-ink-700 tabular-nums">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="font-display text-base md:text-lg font-semibold text-ink-900 leading-tight">
                  {mode.label}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-ink-500 font-medium whitespace-nowrap">
                  {mode.when}
                </div>
              </div>
              <p className="mt-1.5 text-sm md:text-base text-ink-800 leading-relaxed">
                {mode.explanation}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
