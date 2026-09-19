/**
 * Masthead, the trade page's `00 take` (MODEL.md 8.6; plan step 33's first
 * dispatch, 2026-09-18), through the ANSWER-CARD ARCHETYPE, the way the
 * country's and the city's mastheads are drawn: the identity (the flag, the
 * trade's name as the h1, the crumb naming the city and the country once
 * under it), one answer figure, the companions as the docked key-value
 * grid, the provenance line under them. The facts come from
 * trade_hero_facts.ts, the drawing from the archetype, so every trade's
 * masthead is one composition.
 *
 * WHAT LEFT WITH THE OLD CARD, and why: the client island (a count-up on
 * the figure; the country and city mastheads animate nothing and the
 * archetype is a server component); the uppercase crumb with three marks
 * above the title (an eyebrow above a title, clause 11; the crumb is one
 * body line under the h1 now); the h1 that was the view's answer SENTENCE
 * ("Strong revenue, thin take-home. The rent and the wages decide it, not
 * the dining room."), a conclusion in a header (clause 12); the "to break
 * in" tile, a word dressed as a figure off a coined 0 to 100 score (clause
 * 17, 8.6's "no ease score"); the spread strip docked in the masthead,
 * which is `01 spread`'s own card now, one band down; and the sample tag
 * carrying the provenance line, which is the archetype's foot.
 *
 * THE ANSWER IS THE PAGE'S LOUD ONE: the take-home at 40 in `--terra-text`,
 * the page's only 40 (8.6's seat ledger). Off `moneyShown` the state word
 * stands where it would, ink, and the page carries two loud moments.
 */
import * as React from "react";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { tradeHeroFacts } from "@/lib/spine/trade_hero_facts";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";

export function Masthead({ d }: { d: any }) {
  const f = tradeHeroFacts(d);
  if (!f) return null;
  return <AnswerCard id="take" name={f.name} iso2={f.iso2} crumb={f.crumb} subtitle={null} answer={f.answer} absent={f.absent} cells={f.cells} tone="accent" foot={f.foot} answers={SURFACE_ANSWERS.cell} />;
}
