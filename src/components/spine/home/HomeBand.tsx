/**
 * HomeBand, THE BAND: ONE SOLID STATEMENT (plan 2026-10-13 home-quiet-editorial, Task 5; spec docs/superpowers/specs/
 * 2026-10-13-home-quiet-editorial-design.md, section 2, item 4; his decision of 2026-10-13: "one solid statement: full-width brand
 * terracotta at full strength, white type, one sentence, a link to the method"). The page's one show-off and its one loud seat, lit by its
 * ground (LOUD_SEATS seat 2, FIELD). A ZONE, NOT A CARD, as the band before it was: the zone's own markup, one level and one cell, on the
 * tone globals.css gives `[data-zone][data-tone="terra"]` (THE ZONES: `--terra-full`, its words `--band-ink`, white), so no card law reads
 * it and the page laws' ZONE PAD and ZONE SPLIT read it as every zone. The sentence says how every figure on the site is made, in About the
 * figures' four words, at the section rung within half the page; the one link opens that page's reading section, underlined at rest
 * because a link on a coloured ground needs a mark besides its colour. No figure, no count, no digit (tests/home/band.test.ts,
 * tests/home/no_counts.test.ts).
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { ABOUT_THE_FIGURES } from "@/lib/home/contents";

export function HomeBand() {
  const C = COPY.home.band;
  return (
    <section data-zone="wide" data-tone="terra" data-zone-label={C.label} id="band" aria-labelledby="band-line">
      <div data-zone-level="" className="grid grid-cols-1">
        <div data-zone-cell="" className="min-w-0">
          <p id="band-line" className="max-w-[var(--measure-half)] text-pretty text-[length:var(--t-section)] font-semibold leading-9 tracking-tight text-[var(--band-ink)]">
            {C.line}
          </p>
          <a href={ABOUT_THE_FIGURES.href} className="tap-y mt-4 inline-flex min-h-11 items-center gap-1 text-[length:var(--t-lead)] font-medium leading-6 text-[var(--band-ink)] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80">
            <span>{ABOUT_THE_FIGURES.label}</span>
            <span aria-hidden>&#8594;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
