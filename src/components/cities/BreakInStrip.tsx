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
    <section className="mb-12 md:mb-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Break-in spread
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
        How hard the everyday trades are to break into
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Each dot is one common trade in {cityName}, placed by how easy it is to
        break in and win. Further right is easier. Modeled from local business
        demography. Directional.
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
    </section>
  );
}
