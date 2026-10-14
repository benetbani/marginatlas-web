/**
 * STAGE 3, TO OPEN (plan 2026-10-13 country-page-journey, Task 3D): slot 6 in the slot's frame (src/components/spine/country/Slot.tsx), the
 * legal forms table (TiersTable, his rulings 8 and 9 of 2026-09-04) as its drawing, the door to the how-to page in it.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { OpenDrawing } from "@/lib/spine/slots/open";

export function OpenSlot({ model }: { model: SlotModel<OpenDrawing> }) {
  const { setup, howTo } = model.drawing;
  return <Slot model={model}>{setup.length > 0 ? <TiersTable rows={setup} howTo={howTo} fill /> : null}</Slot>;
}
