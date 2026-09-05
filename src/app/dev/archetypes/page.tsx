/**
 * /dev/archetypes , the stories page. Every archetype drawn across its
 * instance set, for the founder to open and the harness to measure. Dev
 * surface only; never linked from the site.
 */
import * as React from "react";
import { AnswerCardStories, RankedBarsStories, CompareTableStories, CardPagerStories, TiersTableStories, RangeStripStories } from "@/components/spine/archetypes/stories";

export const dynamic = "force-static";

const h = "mb-8 mt-16 text-[length:var(--t-head)] font-semibold text-[var(--c-ink)] first:mt-0";

export default function ArchetypesPage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-10">
      <h1 data-typography="custom" className={h}>Archetypes, the answer card</h1>
      <AnswerCardStories />
      <h2 data-typography="custom" className={h}>The ranked bars</h2>
      <RankedBarsStories />
      <h2 data-typography="custom" className={h}>The comparison table</h2>
      <CompareTableStories />
      <h2 data-typography="custom" className={h}>The card pager</h2>
      <CardPagerStories />
      <h2 data-typography="custom" className={h}>The tiers table</h2>
      <TiersTableStories />
      <h2 data-typography="custom" className={h}>The range strip</h2>
      <RangeStripStories />
    </main>
  );
}
