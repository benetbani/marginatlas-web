/**
 * Masthead, the trade page's `00 take` (MODEL.md 8.6; plan step 33's first
 * dispatch, 2026-09-18), through the ANSWER-CARD ARCHETYPE, the way the
 * country's and the city's mastheads are drawn: the identity (the flag and
 * the trade's name as the h1; the trail above the card names the city and the
 * country, and the crumb line that said them again under the h1 left on his
 * ruling 40 of 2026-09-26, 2026-10-01), one answer figure, the companions as the docked key-value
 * grid, the provenance line under them. The facts come from
 * trade_hero_facts.ts, the drawing from the archetype, so every trade's
 * masthead is one composition.
 *
 * WHAT LEFT WITH THE OLD CARD, and why: the client island (a count-up on
 * the figure; the country and city mastheads animate nothing and the
 * archetype is a server component); the uppercase crumb with three marks
 * above the title (an eyebrow above a title, clause 11; it became one body
 * line under the h1, and that line left too, see above); the h1 that was the view's answer SENTENCE
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
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { tradeHeroFacts } from "@/lib/spine/trade_hero_facts";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";

export function Masthead({ d }: { d: any }) {
  const f = tradeHeroFacts(d);
  if (!f) return null;
  /* Under the plus, a London money trade's company keeps beside the sole trader's (his ruling of 2026-10-04). */
  const detail = f.detail ? <DetailPanel name="take-forms" summary={f.detail.summary} rows={f.detail.rows} /> : undefined;
  return <AnswerCard id="take" name={f.name} iso2={f.iso2} subtitle={null} answer={f.answer} absent={f.absent} cells={f.cells} tone="accent" foot={f.foot} answers={SURFACE_ANSWERS.cell} detail={detail} />;
}
