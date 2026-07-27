/**
 * Chapter 02 , the calculator.
 *
 * The config is built from the cell file, not from calc-config.ts, so the
 * defaults are the page's own five lines and the compute reproduces the
 * published take-home exactly. If it ever did not, Calc self-omits in
 * production and throws in dev: a calculator that contradicts its page is
 * worse than no calculator.
 */
import * as React from "react";

import { Calc } from "@/components/spine2/Calc";
import type { CalcConfig } from "@/components/spine2/calc-engine";
import type { CalculatorModel } from "@/lib/cells/spine2_adapter";

export function Ch02Calculator({ calculator }: { calculator: CalculatorModel }) {
  const config: CalcConfig = {
    trade: calculator.trade,
    days: calculator.days,
    vars: calculator.vars.map((v) => ({
      id: v.id,
      kind: v.kind,
      label: v.label,
      glyph: v.glyph as CalcConfig["vars"][number]["glyph"],
      min: v.min,
      max: v.max,
      step: v.step,
      defaultValue: v.defaultValue,
      format: v.format,
      leverage: v.leverage,
    })),
    notes: calculator.notes,
  };

  return (
    <>
      <Calc
        className="rise"
        config={config}
        published={{ ownerKeeps: calculator.publishedOwnerKeeps }}
      />
      <p className="note" style={{ marginTop: 12, fontSize: "12.5px" }}>
        Six variables, one answer. The bars on the right show what a single
        realistic step on each is worth to you, biggest first. Every default is
        the modelled room described above.
      </p>
    </>
  );
}
