/**
 * WHERE US RESTAURANTS GREW AND SHRANK ON THE HOME PAGE (plan 2026-10-08, home sections, section 3): the restaurants the leading metro
 * added, the card's one figure and one of the page's three loud moments (LOUD_SEATS, seat 3), then the five metros that added most
 * and the five that lost most, each its name and its two counts on the site's table of a name and two figures (TiersTable's figures
 * shape, the trade page's team). No new drawing: the reading is two absolutes a row, never a percent (PART 9 clause 15), and a table
 * holds that. Every count from src/lib/home/us_restaurants.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { COPY } from "@/lib/spine/copy";
import type { UsRestaurants, UsRestaurantsRow } from "@/lib/home/us_restaurants";

const figures = (rows: UsRestaurantsRow[]) => rows.map((r) => ({ key: r.key, name: r.name, a: r.a, b: r.b, aProv: r.aProv, bProv: r.bProv }));

export function HomeUsRestaurants({ us }: { us: UsRestaurants }) {
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
