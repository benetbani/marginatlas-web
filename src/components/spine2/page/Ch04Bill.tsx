/**
 * Chapter 04 , where a bill goes.
 *
 * The cascade is the model's five lines expressed per head, so the last bar
 * is exactly the keep share the cost column draws two chapters down. The
 * caption receives the derived kept share from the component itself (M7).
 */
import * as React from "react";

import { ShrinkBars } from "@/components/spine2/ShrinkBars";
import { Late } from "@/components/spine2/Late";
import type { BillModel } from "@/lib/cells/spine2_adapter";
import { More } from "./ChapterHead";

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

export function Ch04Bill({ bill }: { bill: BillModel }) {
  return (
    <div className="panel pad-lg rise">
      <ShrinkBars
        start={bill.spendPerHead}
        stages={bill.stages}
        variant="ramp"
        inBarFmt={(v) => (v >= 10 ? `$${Math.round(v)}` : `$${v.toFixed(2)}`)}
        note={(keptShare) => {
          const cents = Math.round(keptShare * 100);
          const word = WORDS[cents] ?? String(cents);
          return (
            <>
              Bar widths are exactly the money.{" "}
              {word.charAt(0).toUpperCase() + word.slice(1)} cents in the dollar
              is what reaches the owner.
            </>
          );
        }}
      />
      <More glyph="worked-example" summary="Show the same thing in plain words" count="4 steps">
        <Late style={{ marginTop: 2 }} items={bill.plainWords} />
      </More>
    </div>
  );
}
