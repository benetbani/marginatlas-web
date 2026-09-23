/**
 * CityHero , the city masthead through the ANSWER-CARD ARCHETYPE (build loop
 * run 8, 2026-09-05). The identity (photograph, flag, name), one answer
 * figure, the support tiles as the key-value grid, and the provenance line
 * under them with its modelled mark, stated once. The old bespoke masthead
 * (the grey-gapped tile strip, the hand-sized focal) is gone; the facts come
 * from city_hero_facts, the drawing from the archetype, so every city's
 * masthead is one composition. The "All cities" door stays above.
 *
 * THE ANSWER IS THE PAGE'S LOUD 1 SINCE PLAN STEP 32 (2026-09-18): MODEL.md
 * 8.3's `00 masthead`, "Average customer pay", the page's only 40, in
 * `--terra-text` (PART 6's city list: "the opening's customer pay"). It drew
 * in ink until then because the city blueprint kept the page's one accent on
 * the section-level verdict card, and that card is retired by the same
 * composition ("the rent verdict card is dissolved, not cut: its figure is
 * the masthead's answer"), so the accent it held comes up to the answer it
 * was dissolved into. The page's accent count is unchanged by the swap.
 */
import * as React from "react";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { cityHeroFacts } from "@/lib/spine/city_hero_facts";
import { COPY } from "@/lib/spine/copy";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";

export function CityHero({ d }: { d: any }) {
  const f = cityHeroFacts(d);
  if (!f) return null;
  return (
    <div id="masthead">
      <a href="/cities" className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--c-line-strong)] hover:text-[var(--c-ink)]">&#8592; {COPY.cityHero.allCities}</a>
      <AnswerCard id="city-take" name={f.name} iso2={f.iso2} image={f.image} subtitle={f.subtitle} answer={f.answer} cells={f.cells} tone="accent" foot={f.foot} answers={SURFACE_ANSWERS.city} />
    </div>
  );
}
