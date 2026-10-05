/**
 * ONE HIRE, ALL IN (milestone 2, masterplan step 23; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS item
 * 77, QUEUE country:hiring-plus). The third card of the staff level: what one worked hour of a minimum-wage hire costs the
 * business, all in, at the focal rung; under it, as ruled rows, what letting that hire go costs after one, three and ten years,
 * and the law's amounts the page prints nowhere else. Every figure from src/lib/spine/sections/hire_all_in.ts (the law engine),
 * stamped with where it came from: computed money in dollars, as the staff card prints its money, a law's own amounts in pounds.
 * The band page's form (2026-10-04): one figure at 30, its words, ruled rows, as the employment card beside it. The parting rows
 * take the wages glyph (pay owed when a hire leaves): the closing glyph draws a padlock, which beside a Pro lock reads as one.
 */
import * as React from "react";
import { Box, Rail, usd } from "@/components/spine/kit";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import type { HireAllIn as HireAllInData } from "@/lib/spine/sections/hire_all_in";
import { COPY } from "@/lib/spine/copy";
import { Focal } from "./focal";

export function HireAllIn({ data }: { data: HireAllInData | null }) {
  if (!data || data.perWorkedHour.usd == null) return null;
  const C = COPY.hireAllIn;
  const parting: FactRow[] = data.parting.flatMap((p) =>
    p.usd == null
      ? []
      : [{ key: `parting-${p.years}`, icon: "wages" as const, label: C.parting[p.years], value: usd(p.usd), note: p.redundancy > 0 ? C.partingNote : C.partingNoteNotice, prov: p.prov }],
  );
  return (
    <Box id="hire-all-in" className="flex flex-col">
      <Rail icon="min-wage" kicker={C.kicker} />
      <Focal figure={usd(data.perWorkedHour.usd)} words={C.words} prov={data.perWorkedHour.prov} />
      <FactRows rows={[...parting, ...data.extras]} />
    </Box>
  );
}
