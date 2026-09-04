/**
 * /dev/archetypes , the stories page. Every archetype drawn across its
 * instance set, for the founder to open and the harness to measure. Dev
 * surface only; never linked from the site.
 */
import * as React from "react";
import { AnswerCardStories } from "@/components/spine/archetypes/stories";

export const dynamic = "force-static";

export default function ArchetypesPage() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-10">
      <h1 data-typography="custom" className="mb-8 text-[length:var(--t-head)] font-semibold text-[var(--c-ink)]">Archetypes, the answer card</h1>
      <AnswerCardStories />
    </main>
  );
}
