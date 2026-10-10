/**
 * THE TERRACOTTA BAND, "READ FROM THE RECORD" (plan docs/superpowers/plans/2026-10-10-home-reform, Task 5; the spec
 * docs/superpowers/specs/2026-10-10-home-reform-design.md, decision 7 and section 5, and its critique, section 4). His request of
 * 2026-10-10: "add 1 section in terracotta background to signify some stats for the site". It stands between the proofs and the foot,
 * so the page reads the question, one case answered, how the site knows, how much it has read, then where to go next.
 *
 * A ZONE, NOT A CARD: it draws the zone's own markup, one level and one cell, as zones.tsx draws a wide zone, on the tone globals.css
 * gives `[data-zone][data-tone="terra"]` (THE ZONES); no Box, so no card law, no section count and no census row moves, and the page
 * laws' ZONE PAD and ZONE SPLIT read it as they read every zone. home-view.tsx lists it outside the tones' alternation. It is the
 * page's second loud moment by its ground (LOUD_SEATS seat 2, FIELD): every word and figure on it is ink, 7.06:1 on `--terra`, no grey
 * and no accent, its hierarchy size and weight alone.
 *
 * Its four figures are siblings at 30 (`data-sibling-figures`, PART 4's exemption for sibling figures; FOCAL reads cards and blocks,
 * and the band is neither), each through the kit's Fig with its builder's stamp, the trades' two with the pages served at 16 on the
 * figure's baseline. A definition list: each pair's term first in the markup and its figure first to the eye (flex-col-reverse), so a
 * screen reader hears the label, then the figure.
 *
 * Layout (critique section 4): from 1024 one row, the heading and line in the left quarter, the cells in the right three quarters,
 * each after the first behind a 1px `--band-rule` with 20 of air either side; under 1024 the heading and line on top, 32 above a two
 * by two grid, a rule between its columns and one above its second row, 24 inside each; a label keeps two lines' room so the cells end
 * level. The line's measure is the prose measure every paragraph takes (globals.css), half the page at 768. The zone's padding (64,
 * 48, 40) and its bleed edge to edge are THE ZONES' own.
 *
 * NO WORD LEFT ALONE (the reform's precedents: text-pretty on the worked example's lines, text-balance on the joins ring's caption; a
 * lone last word is read as a fault): the line and the four labels take text-pretty. Read in Chromium at 320, 360, 375, 414, 480, 640, 767, 768, 1023, 1024, 1080, 1280 and 1440
 * (scratchpad/home-reform/t5-widow-probe.txt and t5-label-probe.txt), the plain line left "2026." alone at 360 and 375 and the labels
 * left "limits", "sales" and "rates" alone at 320, 360, 375 and from 1024; with it no width leaves a word alone, and every width
 * that fit on one line still does.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { SiteCount, SiteCounts } from "@/lib/home/site_counts";

/* Each cell's place in the two grids, by its order: under 1024 the second column stands behind the vertical rule and the second row
   behind the horizontal, 24 inside each; from 1024 one row, every cell after the first behind its rule with 20 of air. */
const CELL = [
  "pb-6 pr-6 lg:pb-0 lg:pr-0",
  "border-l pb-6 pl-6 lg:pb-0 lg:pl-5",
  "border-t pr-6 pt-6 lg:border-l lg:border-t-0 lg:pl-5 lg:pr-0 lg:pt-0",
  "border-l border-t pl-6 pt-6 lg:border-t-0 lg:pl-5 lg:pt-0",
];
function RecordCount({ c, at }: { c: SiteCount; at: number }) {
  const C = COPY.home.record;
  return (
    <div data-count={c.key} className={`flex min-w-0 flex-col-reverse justify-end border-[var(--band-rule)] ${CELL[at] ?? CELL[3]}`}>
      <dt className="mt-2 min-h-10 text-pretty text-[length:var(--t-body)] font-medium leading-5 text-[var(--c-ink)]">{C.labels[c.key]}</dt>
      <dd className="leading-none text-[var(--c-ink)]">
        <Fig prov={c.prov} className="text-[length:var(--t-focal)] leading-none">
          {c.figure}
        </Fig>
        {c.of ? (
          <span data-of="" className="text-[length:var(--t-lead)] leading-none">
            {` ${C.of} `}
            <Fig prov={c.of.prov}>{c.of.figure}</Fig>
          </span>
        ) : null}
      </dd>
    </div>
  );
}

export function HomeRecord({ record }: { record: SiteCounts }) {
  const C = COPY.home.record;
  return (
    <section data-zone="wide" data-tone="terra" data-zone-label={C.label} id="record" aria-labelledby="record-title">
      <div data-zone-level="" className="grid grid-cols-1">
        <div data-zone-cell="" className="min-w-0">
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-x-16">
            <div>
              <h2 id="record-title" data-typography="custom" data-rail-title="" className="text-[length:var(--t-head)] font-semibold leading-7 tracking-tight text-[var(--c-ink)]">
                {C.title}
              </h2>
              <p className="mt-2 text-pretty text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">{C.line.replace("{month}", record.month)}</p>
            </div>
            <dl data-sibling-figures="" className="grid grid-cols-2 lg:grid-cols-4 lg:gap-x-5">
              {record.counts.map((c, i) => (
                <RecordCount key={c.key} c={c} at={i} />
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
