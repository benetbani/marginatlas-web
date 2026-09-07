/**
 * WhereToTrade: THE DISTRICT RANKING on the ranked-bars archetype (city:districts,
 * the build loop's run 25, 2026-09-07). Every ranked district as a bar of its
 * rent load, heaviest to lightest, the lightest marked at the right as the
 * founder's D1 (2026-07-11, rank by rent load, lightest first) and rule 29A
 * ask; the set's heaviest as the top rule, named; what each district is
 * listed under the chart at the wide layout and beside its name on a phone;
 * the multiples marked modelled. The founder ratified vertical ranked bars
 * (ruling 5, 2026-09-04) and named horizontal bars the page's defect (G2,
 * 2026-07-11); the kit's lollipop this card drew until run 25 counted as the
 * same bar family by the kit's own idea I2.
 *
 * WHAT WENT: the lollipop and its phone rows; the "What each district is"
 * list, which the archetype now draws from the rows' notes; the door to the
 * districts page, which the page's terminus already carries ("Every district
 * of London"), so one destination no longer wears two doors; and the map
 * wiring, which never drew for any city because no district holds
 * coordinates (DATA-REQUIREMENTS.md 16; the code is in the file's history).
 * The facts come from district_rows, so the stories draw the same card.
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
      basis={COPY.cityDistricts.basis}
      rows={b.rows}
      worldMax={b.worldMax}
      best="min"
      topLabel={COPY.cityDistricts.heaviest}
      notesHead={COPY.cityDistricts.notesHead}
      fmt={rentMult}
      phoneHead={COPY.cityDistricts.phoneHead}
    />
  );
}
