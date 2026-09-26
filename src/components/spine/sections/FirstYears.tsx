/**
 * FirstYears, WHO IS STILL TRADING, AND WHAT GETS IN THE WAY (2026-09-25; his message that night: "Decisive factors that decide
 * whether a business survives the 1st year"). Page-agnostic, keyed by country (sections/first_years.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the cohort's share still trading at the curve's last year, and the curve's last point is the one
 *    point drawn in the accent; the years before it print their share at their own point, the last does not (it is the figure).
 *  - THE CURVE is one cohort followed year by year: a line over an area whose accent gradient fades into the card (his "the
 *    gradient is barely used"), a start at the whole and a point a year. The area is SVG stretched to the box; every mark and
 *    label is HTML placed in percentages, so no text stretches, and a point at either end is pinned inside the box.
 *  - A LINE AND NOT COLUMNS, against the rule MonthBars.tsx states for a series ("a line interpolates"), because this series is
 *    the case that rule keeps the line for: the share of one cohort still trading is continuous in time (firms close on every day
 *    of a year, not on its last), the file samples it once a year, and the reader's question is its shape, how fast the cohort
 *    thins. A month's total has no value between two months; a cohort at two and a half years does.
 *  - THE REGIONS: the best and the worst region on the same last year as a span on a 0 to 100 track, the country's own share as
 *    a tick on it, the two ends named.
 *  - THE PLOT TAKES THE HEIGHT THE LEVEL LENDS THE CARD (`fill`): beside a taller card the curve grows, never a blank under the
 *    regions. What holds small firms back is its own card since 2026-09-25 (Obstacles.tsx), seated beside this one.
 *  - `data-archetype="survival-curve"`, `data-visual="1"`, `data-points`.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { SurvivalCurve } from "@/components/spine/interact/SurvivalCurve";
import { COPY } from "@/lib/spine/copy";
import type { Survival } from "@/lib/spine/sections/first_years";

export function FirstYears({ id = "first-years", data }: { id?: string; data: Survival }) {
  const C = COPY.firstYears;
  /* THE READER'S REGION (goal 2026-09-26, M3): the curve, the figure, the words and the strip are the region lever's
     (src/components/spine/interact/SurvivalCurve.tsx), the country's curve its default; this card holds the frame and the words. */
  const place = data.place ? data.place.charAt(0).toUpperCase() + data.place.slice(1) : C.countryFallback;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="first-year" kicker={C.kicker} />
      <SurvivalCurve
        id={id}
        country={data.points}
        regions={data.regionCurves}
        best={data.regions?.best ?? null}
        worst={data.regions?.worst ?? null}
        words={{ focal: C.focalWords, focalIn: C.focalWordsIn, start: C.start, year: C.year, regions: C.regions, choose: C.choose, country: place, kicker: C.kicker }}
      />
    </Box>
  );
}
