/**
 * THE LEASE, BY LAW (milestone 2, masterplan step 25; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS item
 * 73, QUEUE country:lease). Chapter 01's level after the running costs: the least notice a landlord must give to end a protected
 * lease, at the focal rung; under it, as ruled rows, the lease's clauses in plain words and the stamp duty on a 5- and a 10-year
 * lease of an 80 square metre London shop at its valuation. Every figure from src/lib/spine/sections/lease_by_law.ts, stamped
 * with where it came from: the law's own words and amounts as the law gives them, the computed tax in dollars. The band page's
 * form (2026-10-04), as the hire card and the employment card.
 */
import * as React from "react";
import { Box, Rail, usd } from "@/components/spine/kit";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import type { LeaseByLaw as LeaseByLawData } from "@/lib/spine/sections/lease_by_law";
import { COPY } from "@/lib/spine/copy";
import { Focal } from "./focal";

export function LeaseByLaw({ data }: { data: LeaseByLawData | null }) {
  if (!data || data.rows.length === 0) return null;
  const C = COPY.leaseByLaw;
  /* The first tax row names the shop; the second says only what is new (clause 66: never the same line twice in a card). */
  const tax: FactRow[] = data.tax.flatMap((t, i) =>
    t.usd == null
      ? []
      : [{ key: `tax-${t.years}`, icon: "taxes" as const, label: C.taxLabel[t.years], value: usd(t.usd), note: i > 0 && t.dueDays != null ? C.taxNoteDue.replace("{days}", String(t.dueDays)) : C.taxNote, prov: t.prov }],
  );
  return (
    <Box id="lease-by-law" className="flex flex-col">
      <Rail icon="commercial-rent" kicker={C.kicker} />
      <Focal figure={`${data.focal.months} ${C.months}`} words={C.words} prov={data.focal.prov} />
      <FactRows rows={[...data.rows, ...tax]} />
    </Box>
  );
}
