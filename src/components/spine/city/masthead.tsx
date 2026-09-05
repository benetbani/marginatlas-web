/**
 * CityHero , the city masthead through the ANSWER-CARD ARCHETYPE (build loop
 * run 8, 2026-09-05). The identity (photograph, flag, name), one answer
 * figure in ink (the city blueprint keeps the page's one accent on the
 * verdict card), the support tiles as the key-value grid, and the provenance
 * line under them with its modelled mark, stated once. The old bespoke
 * masthead (the grey-gapped tile strip, the hand-sized focal) is gone; the
 * facts come from city_hero_facts, the drawing from the archetype, so every
 * city's masthead is one composition. The "All cities" door stays above.
 */
import * as React from "react";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { cityHeroFacts } from "@/lib/spine/city_hero_facts";
import { COPY } from "@/lib/spine/copy";

export function CityHero({ d }: { d: any }) {
  const f = cityHeroFacts(d);
  if (!f) return null;
  return (
    <div id="masthead">
      <a href="/cities" className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--c-line-strong)] hover:text-[var(--c-ink)]">&#8592; {COPY.cityHero.allCities}</a>
      <AnswerCard id="city-take" name={f.name} iso2={f.iso2} image={f.image} subtitle={f.subtitle} answer={f.answer} cells={f.cells} tone="ink" foot={f.foot} />
    </div>
  );
}
