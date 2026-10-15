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

export const toFactRow = (r: SlotRow): FactRow => ({ key: r.key, label: r.label, value: r.value, note: r.note ?? null, prov: r.prov ?? null, placed: r.placed ?? null, signal: r.signal ?? null, noSignal: r.noSignal ?? null, ...(r.confidence ? { confidence: r.confidence } : {}) });

export function Slot({ model, children, after }: { model: SlotModel<unknown>; children?: React.ReactNode; /** An instrument under the slot's rows, open (plan 2026-10-13 country-page-journey, Q2, answer A): the hire's and the loan's levers. */ after?: React.ReactNode }) {
  const def = slotDef(model.id);
  const stage = stageOfSlot(model.id);
  /* A THIN SLOT OF ONE FIGURE IS LEAN (Task 4's page holes, 768): its figure, its track or one row, nothing behind a plus. Standing alone
     on a level it took the column and left half the card blank beside its words; `data-lean` is the zones' own flag (zones.tsx LONE), so
     the air stands outside the card's edge: a half from 768, a third from 1024. Beside a partner the flag changes nothing. */
  const lean = model.thin && model.more.length === 0 && (model.rows?.rows.length ?? 0) <= 1 && !after;
  return (
    <Box id={def.domId} data-slot={def.id} data-stage={String(stage.n)} data-answer={def.type} {...(lean ? { "data-lean": "1" } : {})} className="flex flex-col">
      <Rail icon={def.icon ?? undefined} kicker={def.heading} gloss={model.gloss ?? undefined} sample={model.sample ?? false} />
      {model.lead ? (
        /* A PLUS STRAIGHT UNDER THE FIGURE'S BLOCK STANDS 12 BELOW IT (DISTANCES 2.1, the line rule's WORDS BELOW; Task 4): the block keeps
           12 where the next thing drawn is a fold, which then adds nothing (DetailPanel.tsx AnswerFold), so a slot whose drawing renders
           nothing is read by what the page draws. */
        <Focal figure={model.lead.figure} words={model.lead.words} placement={model.lead.placement ?? null} prov={model.lead.prov ?? null} placed={model.lead.placed ?? null} signal={model.lead.signal ?? null} noSignal={model.lead.noSignal ?? null} className="[&:has(+[data-archetype='detail-panel'])]:mb-3" />
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
