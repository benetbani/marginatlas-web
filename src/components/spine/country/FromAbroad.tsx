/**
 * OPENING FROM ABROAD (milestone 2, masterplan step 27; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS item
 * 74, QUEUE country:foreigner). Chapter 01's level after registering: the Innovator Founder route's fees for three years per
 * person at the focal rung, its weeks to a decision in its words; under it, as ruled rows, the walls a founder from abroad meets
 * in the research's order, each showing what it costs or takes where it is open, and "Depends" or "Closed" where it is not.
 * Every figure from src/lib/spine/sections/from_abroad.ts, stamped with where it came from.
 *
 * The band page's ruled rows rather than the registering table item 74 names: that table's figure cells carry no provenance and
 * its note line is cut to one line on a phone, and the hire and lease cards beside it use these rows.
 */
import * as React from "react";
import { Box, Rail, usd } from "@/components/spine/kit";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import type { FromAbroad as FromAbroadData, Wall } from "@/lib/spine/sections/from_abroad";
import { COPY } from "@/lib/spine/copy";
import { Focal } from "./focal";

const ICON: Record<string, NonNullable<FactRow["icon"]>> = {
  company: "register-cost",
  address: "commercial-rent",
  identity: "visa-permit",
  "tax-code": "taxes",
  bank: "payments",
  "founder-visa": "visa-permit",
  "youth-mobility": "visa-permit",
  hiring: "hiring",
};

/* What a wall's row prints: its cost in dollars where the law's money was summed, else its fee and its time as the law gives them,
   else the word for its state. */
function valueOf(w: Wall): string {
  const C = COPY.fromAbroad.state;
  if (w.usd != null) return usd(w.usd);
  const parts = [w.fee, w.time].filter((x): x is string => !!x);
  if (w.state === "open" && parts.length) return parts.join(", ");
  return w.state === "closed" ? C.closed : w.state === "conditional" ? C.conditional : parts.join(", ") || C.open;
}

export function FromAbroad({ data }: { data: FromAbroadData | null }) {
  if (!data || data.focal.usd == null || data.walls.length === 0) return null;
  const C = COPY.fromAbroad;
  const rows: FactRow[] = data.walls.map((w) => ({ key: w.key, icon: ICON[w.key] ?? "visa-permit", label: w.label, value: valueOf(w), note: w.note, prov: w.prov }));
  return (
    <Box id="from-abroad" className="flex flex-col">
      <Rail icon="visa-permit" kicker={C.kicker} />
      <Focal figure={usd(data.focal.usd)} words={C.words.replace("{weeks}", String(data.focal.weeks))} prov={data.focal.prov} />
      <FactRows rows={rows} />
    </Box>
  );
}
