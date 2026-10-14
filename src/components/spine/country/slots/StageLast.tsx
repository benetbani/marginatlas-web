/**
 * STAGE 5, TO LAST (plan 2026-10-13 country-page-journey, Task 3G): slot 12 draws the survival curve (its figure, words and region lever its
 * own, as FirstYears.tsx drew it); slot 13 draws the usual span beside the country's (RangePair, the lean exit card's), or nothing on the
 * UK, whose answer is its rows.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { SurvivalCurve } from "@/components/spine/interact/SurvivalCurve";
import { RangePair } from "@/components/spine/charts/RangePair";
import { COPY } from "@/lib/spine/copy";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { ExitDrawing, LastingDrawing } from "@/lib/spine/slots/last";

export function LastingSlot({ model }: { model: SlotModel<LastingDrawing> }) {
  const data = model.drawing.survival;
  const C = COPY.firstYears;
  const place = data.place ? data.place.charAt(0).toUpperCase() + data.place.slice(1) : C.countryFallback;
  return (
    <Slot model={model}>
      <SurvivalCurve id="lasting" country={data.points} regions={data.regionCurves} best={data.regions?.best ?? null} worst={data.regions?.worst ?? null} start={data.start} words={{ focal: C.focalWords, focalIn: C.focalWordsIn, start: C.start, year: C.year, regions: C.regions, choose: C.choose, country: place, kicker: C.kicker }} />
    </Slot>
  );
}

export function ExitSlot({ model }: { model: SlotModel<ExitDrawing> }) {
  const exit = model.drawing.exit;
  const C = COPY.countryExit;
  const lo = exit?.marks[0].value ?? 0;
  const hi = exit?.marks[exit.marks.length - 1].value ?? 0;
  return (
    <Slot model={model}>
      {exit?.usual ? (
        <div className="flex flex-1 flex-col">
          <RangePair fill spans={[{ key: "here", label: C.here, lo, hi, accent: true, quiet: true }, { key: "usual", label: C.usualAnywhere, lo: exit.usual.lo, hi: exit.usual.hi }]} max={Math.max(24, exit.usual.hi, hi)} fmt={(v) => String(Math.round(v))} unit={C.months} ticks={[0, 6, 12, 18, 24]} aria={C.kicker} />
        </div>
      ) : null}
    </Slot>
  );
}
