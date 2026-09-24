/**
 * WhereToTrade: THE DISTRICT RANKING on the ranked-bars archetype (city:districts,
 * the build loop's run 25, 2026-09-07, rebased and rowed by task 13, unfeatured
 * by task 14, 2026-09-10). Seven ranked districts, so the archetype draws them
 * as a TABLE read top to bottom, not as columns (PART 5's district rows: six or
 * more is a table); each row is a district's name, its rent against the cheapest
 * district in the very next column, then a track. The cheapest leads
 * (the founder's D1, 2026-07-11: rank by rent, cheapest first, and rule 29A)
 * and is the row every figure is measured against, INCLUDING ITS OWN, which
 * reads 1.00x against itself.
 *
 * NO DISTRICT IS MARKED (`feature="none"`, his ruling of 2026-09-10: "there is
 * the featuring aspect of one neighborhood compared to the other neighborhoods
 * with no reason at all, just for the fact that it's cheaper. It is not
 * justifiable"). Being the base of the arithmetic is not being recommended,
 * and this card has no other claim to make until the engine can name a
 * district as genuinely the best place to trade in; district_rows.ts carries
 * the whole reasoning and what happens the day it can. The set's
 * dearest is the ceiling, named once at the head of the track column. The
 * multiples are marked modelled. The founder ratified vertical ranked bars
 * (ruling 5, 2026-09-04) and named horizontal bars the page's defect (G2,
 * 2026-07-11); the kit's lollipop this card drew until run 25 counted as the
 * same bar family by the kit's own idea I2, and the table form is the same
 * archetype, which is where the founder's ruling on it lives.
 *
 * WHAT WENT: the lollipop and its phone rows; the "What each district is"
 * list, and NOTHING replaced it , not in the archetype, not here, not in the
 * rows (his 2026-09-07 ruling on the invented one-word district summaries,
 * PART 5's district rows and PART 9 rule 19; RankedBars' own header carries
 * the quote); the door to the districts page, which the page's terminus
 * already carries ("Every district of London"), so one destination no longer
 * wears two doors; and the map wiring, which never drew for any city because
 * no district holds coordinates (DATA-REQUIREMENTS.md 16; the code is in the
 * file's history). The facts come from district_rows, so the stories draw the
 * same card.
 *
 * CHECKED AGAINST 8.3's LETTER on plan step 32's fifth dispatch (2026-09-18):
 * the table form, seven rows read top to bottom, the cheapest district the
 * named reference printing 1.00x on its own row, nobody featured, every bar
 * one neutral and every figure one ink, the set's own ceiling declared, the
 * head and the basis naming the reference, no foot (the row asks for none):
 * all as built. The one string that disagreed was the kicker, "By district",
 * which said the set and not the thing; it is 8.3's own title now, "Rent by
 * district" (copy.ts). The band is `03 | 09` at 2-1, this card left, the
 * trade rows right, measured in city-view.tsx.
 */
import * as React from "react";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { buildCityDistrictBars, rentMult } from "@/lib/spine/district_rows";
import { COPY } from "@/lib/spine/copy";

export function WhereToTrade({ d, id = "districts" }: { d: any; id?: string }) {
  const b = buildCityDistrictBars(d);
  if (!b) return null;
  return (
    <RankedBars
      id={id}
      kicker={COPY.cityDistricts.kicker}
      icon="best-areas"
      tagged={b.tagged}
      gloss={COPY.glossary.rentAgainst}
      basis={b.basis}
      withheldLine={b.clipLine ?? undefined}
      rows={b.rows}
      worldMax={b.worldMax}
      ceiling="set"
      feature="none"
      best="min"
      topLabel={COPY.cityDistricts.dearest}
      fmt={rentMult}
      phoneHead={b.phoneHead}
    />
  );
}
