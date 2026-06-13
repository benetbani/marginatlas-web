import * as React from "react";
import type { BreakInBand } from "@/lib/scores/break_in_rating";

/** Band to a filled dot tone, reusing the break-in score's color grammar:
 *  forgiving = moss (easy), the workable middle = atlas, brutal = clay (hard). */
function dotTone(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "bg-moss-600";
    case "manageable":
    case "demanding":
      return "bg-atlas-500";
    case "brutal":
      return "bg-clay-700";
  }
}

/**
 * The city's break-in spread: one dot per everyday trade on a 0-100 difficulty
 * track (harder on the left, easier on the right), colored by band. The single
 * branded city signature visualization (founder 2026-06-09), the visual
 * companion to the Business Climate Score: it shows at a glance whether a city's
 * common businesses cluster easy or hard. Self-omits below three scored trades,
 * the same floor as the everyday-trades table. Server component, tokens only.
 *
 * Folded into the "What owners keep" section (R5, 2026-06-13): it no longer
 * carries its own section heading or top-level spacing, because it shows the same
 * break-in signal the table's per-row badges do. It renders as a compact strip
 * with a small caption, the visual header that sits above the everyday-trades
 * table inside one card.
 */
export function BreakInStrip({
  items,
  cityName,
}: {
  items: { name: string; score: number; band: BreakInBand }[];
  cityName: string;
}) {
  if (items.length < 3) return null;
  return (
    <div className="mb-6">
      <p className="mb-3 text-sm leading-relaxed text-cocoa-700 md:text-base">
        Each dot is one common trade in {cityName}, placed by how easy it is to
        break in and win. Further right is easier.
      </p>
      <div className="relative h-2 rounded-full bg-cream-100">
        {items.map((it) => (
          <span
            key={it.name}
            title={`${it.name}: ${it.score} out of 100`}
            className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream-50 ${dotTone(
              it.band,
            )}`}
            style={{ left: `${Math.max(0, Math.min(100, it.score))}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-cocoa-500">
        <span>Harder to break in</span>
        <span>Easier</span>
      </div>
    </div>
  );
}
