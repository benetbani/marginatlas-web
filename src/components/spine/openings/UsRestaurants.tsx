/**
 * WHERE US RESTAURANTS GREW AND SHRANK, ON /new-businesses (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 5; first
 * drawn on the home by plan 2026-10-08, home sections, section 3, and re-homed by the home's spec of 2026-10-09, section 6): the
 * restaurants the leading metro added, the card's one figure and the page's first loud moment (LOUD_SEATS seat 1 in
 * openings-view.tsx), then the five metros that added most and the five that lost most, each its name and its two counts on the site's
 * table of a name and two figures. Two absolutes a row, never a percent (PART 9 clause 15). Every count from
 * src/lib/home/us_restaurants.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { COPY } from "@/lib/spine/copy";
import type { UsRestaurants as UsRestaurantsData, UsRestaurantsRow } from "@/lib/home/us_restaurants";

const figures = (rows: UsRestaurantsRow[]) => rows.map((r) => ({ key: r.key, name: r.name, a: r.a, b: r.b, aProv: r.aProv, bProv: r.bProv }));

export function UsRestaurants({ us }: { us: UsRestaurantsData }) {
  const C = COPY.home.usRestaurants;
  const heads = (name: string) => ({ name, a: String(us.from), b: String(us.to) });
  return (
    <Box id="us-restaurants" className="flex flex-col">
      <Rail icon="trade-restaurant" kicker={C.kicker.replace("{from}", String(us.from))} />
      <Focal figure={us.lead.figure} words={us.lead.words} prov={us.lead.prov} accent />
      <TiersTable heads={heads(C.added)} figures={figures(us.added)} />
      <div className="mt-6">
        <TiersTable heads={heads(C.lost)} figures={figures(us.lost)} />
      </div>
    </Box>
  );
}
