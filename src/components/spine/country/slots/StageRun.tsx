/**
 * STAGE 4, SLOTS 8 TO 11 (plan 2026-10-13 country-page-journey, Task 3F): running costs, credit (the lending rate's world track with its
 * peers and its reference, the loan's lever under the rows), filing deadlines in the slot's frame, and the peers' table stamped as slot 11.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { WorldRangeRows, type WorldRangeRow } from "@/components/spine/charts/WorldRange";
import { LoanLever } from "@/components/spine/interact/LoanLever";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { COPY } from "@/lib/spine/copy";
import { worldRange, worldValues } from "@/lib/spine/world_stats";
import { peerMarks } from "@/lib/spine/peer_marks";
import { slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { CreditDrawing, PeersDrawing } from "@/lib/spine/slots/run";

export function RunningCostsSlot({ model }: { model: SlotModel<null> }) {
  return <Slot model={model} />;
}

export function CreditSlot({ model }: { model: SlotModel<CreditDrawing> }) {
  const { iso2, rate, base, loan } = model.drawing;
  const F = "bank_lending_rate_pct";
  const range = worldRange(F);
  const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;
  /* THE STAGE'S ONE WORLD TRACK (Reading 9; clause 64), headless: the figure is the slot's lead, so the track prints it once there. */
  const rows: WorldRangeRow[] = range ? [{ key: "lending", label: COPY.ranged.lending, value: rate, display: pct(rate), range, fmt: pct, scale: "log", hairlines: worldValues(F), peers: peerMarks(iso2, F), peersWord: COPY.ranged.peers, refs: base ? [{ key: "base", label: COPY.financing.cells.base, value: base.share, display: base.display }] : null }] : [];
  return (
    <Slot model={model} after={loan ? <LoanLever min={loan.min} max={loan.max} rate={loan.rate} termMin={COPY.financing.startupTerm.min} termMax={COPY.financing.startupTerm.max} words={COPY.financing.loan} /> : null}>
      {rows.length ? <div className="mb-5"><WorldRangeRows rows={rows} headless ends={COPY.ranged.ends} /></div> : null}
    </Slot>
  );
}

export function FilingsSlot({ model }: { model: SlotModel<null> }) {
  return <Slot model={model} />;
}

export function PeersSlot({ model }: { model: SlotModel<PeersDrawing> }) {
  const def = slotDef("peers");
  const { table, caveat } = model.drawing;
  return <CompareTable id={def.domId} kicker={def.heading} icon={def.icon ?? "benchmark"} rows={table.rows} columns={table.columns} caveat={caveat} zone stamp={{ "data-slot": def.id, "data-stage": String(stageOfSlot("peers").n), "data-answer": def.type }} />;
}
