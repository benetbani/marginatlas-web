/**
 * STAGES 6 AND 7 (plan 2026-10-13 country-page-journey, Task 3H): the dealings' two spectra under one switch (the Switch the paperwork card
 * used), the coming and recent change runs under their small heads, the terminus stamped as slot 16 inside its full-width sanction.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { Box } from "@/components/spine/kit";
import { Switch } from "@/components/spine/interact/Switch";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { ChangeRun } from "@/components/spine/archetypes/DatedChanges";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { COPY } from "@/lib/spine/copy";
import { slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { ChangesDrawing, CloseDrawing, DealingsDrawing } from "@/lib/spine/slots/rules";

const J = COPY.journey;

export function DealingsSlot({ model }: { model: SlotModel<DealingsDrawing> }) {
  const { state, people } = model.drawing;
  const table = (t: NonNullable<DealingsDrawing["state"]>) => <SpectraTable rows={t.rows} dot={t.dot} foot={null} scale="body" />;
  return (
    <Slot model={model}>
      {state && people ? (
        <Switch id="dealings-views" label={slotDef("dealings").heading} views={[{ key: "state", label: J.views.state, panel: table(state) }, { key: "people", label: J.views.people, panel: table(people) }]} />
      ) : state ? table(state) : people ? table(people) : null}
    </Slot>
  );
}

export function ChangesSlot({ model }: { model: SlotModel<ChangesDrawing> }) {
  const { coming, recent, shown } = model.drawing;
  /* A RUN'S HEAD IS A LABEL, NOT A SUPPORTING LINE (the integration merge of 2026-10-15): it carries no data-line, the mark the plain-copy
     law counts a lifted line by (scripts/harness/check_copy_plain.mjs, LINES), or "Recent" under "Coming" reads as a card's second line. */
  const head = (words: string) => <p className="mt-4 text-[length:var(--t-body)] font-medium leading-5 text-[var(--c-ink2)] first:mt-0">{words}</p>;
  return (
    <Slot model={model}>
      {coming.length ? <>{head(J.runs.coming)}<ChangeRun rows={coming} /></> : null}
      {recent.length ? <>{head(J.runs.recent)}<ChangeRun rows={recent} shown={shown} more={COPY.changes.more} moreOne={COPY.changes.moreOne} /></> : null}
    </Slot>
  );
}

export function CloseSlot({ model }: { model: SlotModel<CloseDrawing> }) {
  const def = slotDef("close");
  return (
    <div data-terminus>
      <Box id={def.domId} data-slot={def.id} data-stage={String(stageOfSlot("close").n)} data-answer={def.type}>
        <Terminus kicker={def.heading} doors={model.drawing.doors} />
      </Box>
    </div>
  );
}
