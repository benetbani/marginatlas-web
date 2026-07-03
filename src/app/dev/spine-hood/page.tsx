/**
 * Neighborhood HUB , SPINE rebuild (dev surface), publish-ready. Leg 2 of the program.
 * The page that proves the whole product's thesis: same trade, same city, very
 * different outcomes , revenue is the liar, what the owner keeps is the truth. Built
 * to the masterplan publish bar: answer-first two-figure masthead, one dominant keep
 * figure per chapter, a REAL orientation map, a divergence keep-strip on the city
 * baseline, progressive disclosure in the panel (the free/Pro seam), a full-width myth
 * chapter, and a Pro-gated compare with an auto-derived verdict. Wrapped in SpineShell
 * (0.32 atmosphere, cards on clean white); composed from the shared kit + the explorer
 * island. All prose lives in the seed.
 *
 * As-built chart dictionary (page-level idiom census, cap 2 each):
 *   real tile map (position): SpineMap x1  , keep-encoded pins (size = keep index,
 *     terracotta = keeps more than the city, ink = keeps less), legended on the map.
 *   divergence bar-list (deviation from 100): KeepStrip x1  , the page hero.
 *   marker-on-a-shared-scale (position): footfall two-marker x1, walkability + price Meter (paired) x1.
 *   multiplicative waterfall (running product): "Why the number moves" x1.
 *   horizontal bar-list (length): Compare bars x1.
 *   two-figure headline (no chart): masthead + myth counter-figure.
 * Terracotta is rationed to one hero figure per chapter + one accent; selection is ink.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Movement } from "@/components/spine/kit";
import { SpineShell } from "@/components/spine/shell";
import { NeighborhoodExplorer, NeighborhoodCompare, MythChapter } from "@/components/spine/NeighborhoodExplorer";
import { keepIndex } from "@/components/spine/keep";
import { HoodMasthead } from "./masthead";

export const dynamic = "force-static";
const N: any = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/cities/GB-london-neighborhoods.json"), "utf8"));

// A London street motif for the hood atmosphere (opacity-only 0.32, set in SpineShell).
const HOOD_BG = "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1920&q=60";

export default function SpineHoodPage() {
  const d = N;
  const districts: any[] = d.districts ?? [];
  // the loudest (highest-revenue) district , the myth's counter-subject.
  const loudest = districts.slice().sort((a: any, b: any) => b.rev_vs_city_pct - a.rev_vs_city_pct)[0];

  return (
    <SpineShell bg={HOOD_BG} bgPosition="center 40%">
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        {/* MASTHEAD , answer-first two-figure honest headline (keeps-the-most vs the loud one). */}
        <HoodMasthead d={d} />

        {/* 01 , THE MOVEMENT: where the money actually stays. Keep strip + real map + panel. */}
        <Movement index="01" icon="best-areas" eyebrow="Where the money stays" heading="Rank by what the owner keeps" />
        <NeighborhoodExplorer
          districts={districts}
          defaultSlug={d.meta?.default_slug}
          citySlug={d.meta?.slug ?? "london"}
          rail={d.meta?.rail}
          mapNote={d.meta?.map_note}
        />

        {/* 02 , THE MYTH: promoted to its own full-width chapter, the honesty moat at real size. */}
        <Movement index="02" icon="myth-reality" eyebrow="The belief to bust" heading="Revenue is the liar" />
        {d.meta?.myth && loudest ? <MythChapter myth={d.meta.myth} loudest={loudest} districts={districts} /> : null}

        {/* 03 , COMPARE (Pro): hold two or three side by side, with an auto-derived verdict. */}
        <Movement index="03" icon="compare" eyebrow="Compare districts" heading="Two or three, line for line" />
        <NeighborhoodCompare districts={districts} compare={d.meta?.compare} />

        {/* the single, quiet provenance line for the whole page (stated once). */}
        <p className="mt-8 text-[11px] leading-snug text-[var(--c-muted)]">Keep index is derived from revenue and rent load against a city baseline of 100. Multipliers are modeled and clipped, so no district lifts or sinks a trade without limit. Figures are illustrative until wired to live neighborhood data.</p>
      </main>
    </SpineShell>
  );
}
