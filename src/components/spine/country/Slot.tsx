/**
 * THE SLOT'S FRAME (plan 2026-10-13 country-page-journey, Task 3A; spec section 3): one section a slot, its parts in one order on every
 * country: the opener (the kit's Rail, the slot's heading and glyph), the lead figure at 30 (the kit's Focal, its signal beside it where
 * placed), the drawing (the stage component's, as children), the rows of the slot's type (FactRows), an instrument under them (`after`),
 * then each list of another type behind its own plus (DetailPanel's answer fold). Its Box is stamped data-slot, data-stage and data-answer, the replicability and answer-type
 * gates' reading, and carries the registry's DOM id.
 */
import * as React from "react";
import { Box, Rail, Focal } from "@/components/spine/kit";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import type { SlotModel, SlotRow } from "@/lib/spine/slots/types";

export const toFactRow = (r: SlotRow): FactRow => ({ key: r.key, label: r.label, value: r.value, note: r.note ?? null, prov: r.prov ?? null, placed: r.placed ?? null, signal: r.signal ?? null, noSignal: r.noSignal ?? null });

export function Slot({ model, children, after }: { model: SlotModel<unknown>; children?: React.ReactNode; /** An instrument under the slot's rows, open (plan 2026-10-13 country-page-journey, Q2, answer A): the hire's and the loan's levers. */ after?: React.ReactNode }) {
  const def = slotDef(model.id);
  const stage = stageOfSlot(model.id);
  return (
    <Box id={def.domId} data-slot={def.id} data-stage={String(stage.n)} data-answer={def.type} className="flex flex-col">
      <Rail icon={def.icon ?? undefined} kicker={def.heading} gloss={model.gloss ?? undefined} />
      {model.lead ? (
        <Focal figure={model.lead.figure} words={model.lead.words} placement={model.lead.placement ?? null} prov={model.lead.prov ?? null} placed={model.lead.placed ?? null} signal={model.lead.signal ?? null} noSignal={model.lead.noSignal ?? null} />
      ) : null}
      {children}
      {model.rows ? <FactRows answer={model.rows.type} rows={model.rows.rows.map(toFactRow)} /> : null}
      {after}
      {model.more.map((m) => (
        <DetailPanel key={m.key} name={`${def.id}-${m.key}`} summary={m.head} type={m.type} rows={m.rows.map((r) => ({ label: r.label, value: r.value, note: r.note ?? undefined, prov: r.prov ?? null, href: r.href }))} />
      ))}
    </Box>
  );
}
