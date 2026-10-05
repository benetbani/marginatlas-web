/**
 * IF IT FAILS (milestone 2, masterplan step 29; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS item 76,
 * QUEUE country:collect-fail). Chapter 02's level after borrowing: the months until a bankrupt sole trader is freed from the
 * debts, at the focal rung; under it, as ruled rows, what failing costs the owner of a sole trade or a company (the home, the
 * Debt Relief Order's limit, a liquidation's fees and time, wrongful trading, the director ban, the guarantee, the director's
 * loan charge). Every figure from src/lib/spine/sections/if_it_fails.ts, stamped with where it came from; the strike-off stays
 * the paperwork card's.
 *
 * The band page's form, as the other three Pro sections. Item 76 seats it beside the collecting card (item 75), which is not
 * built, so it stands alone at two thirds by the zones' LONE rule.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import type { IfItFails as IfItFailsData } from "@/lib/spine/sections/if_it_fails";
import { COPY } from "@/lib/spine/copy";
import { Focal } from "./focal";

export function IfItFails({ data }: { data: IfItFailsData | null }) {
  if (!data || data.rows.length === 0) return null;
  const C = COPY.ifItFails;
  return (
    <Box id="if-it-fails" className="flex flex-col">
      <Rail icon="vacancy" kicker={C.kicker} />
      <Focal figure={`${data.focal.months} ${C.months}`} words={C.words} prov={data.focal.prov} />
      <FactRows rows={data.rows} />
    </Box>
  );
}
