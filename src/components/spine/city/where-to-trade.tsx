/**
 * WhereToTrade: THE DISTRICT RANKING on the ranked-bars archetype (city:districts,
 * the build loop's run 25, 2026-09-07, rebased and rowed by task 13,
 * 2026-09-10). Seven ranked districts, so the archetype draws them as a TABLE
 * read top to bottom, not as columns (PART 5's district rows: six or more is a
 * table); each row is a district's name, its rent against the cheapest
 * district in the very next column, then a track. The cheapest leads
 * (the founder's D1, 2026-07-11: rank by rent load, lightest first, and rule
 * 29A), and it is the row every figure is measured against, so it wears the
 * card's one pill on its NAME and prints no figure of its own. The set's
 * heaviest is the ceiling, named once at the head of the track column. The
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
 */
import * as React from "react";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { buildCityDistrictBars, rentMult } from "@/lib/spine/district_rows";
import { COPY } from "@/lib/spine/copy";

export function WhereToTrade({ d }: { d: any }) {
  const b = buildCityDistrictBars(d);
  if (!b) return null;
  return (
    <RankedBars
      id="districts"
      kicker={COPY.cityDistricts.kicker}
      icon="best-areas"
      tagged={b.tagged}
      basis={b.basis}
      rows={b.rows}
      worldMax={b.worldMax}
      ceiling="set"
      referenceKey={b.cheapestKey}
      best="min"
      topLabel={COPY.cityDistricts.heaviest}
      fmt={rentMult}
      phoneHead={COPY.cityDistricts.phoneHead}
    />
  );
}
