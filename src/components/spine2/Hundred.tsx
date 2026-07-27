/**
 * src/components/spine2/Hundred.tsx
 *
 * Cell 03's signature: one hundred unit marks, each one business, partitioned
 * into three contiguous labelled blocks ("Dots are people. Histograms are
 * statistics."). A thin semantic layer over UnitGrid's blocks layout.
 *
 * The distribution model does NOT live here (BATCH-B): the page store
 * computes the three counts from (model, target) and this component renders
 * them. Any literal counts a static page passes must come from that same
 * derivation , never hand-counted (M5).
 *
 * Derived, never passed (M5/M7):
 * - block tones by kind: over = terracotta (the answer: rooms that pay the
 *   target), mid = n3, none = light , constants here, not data.
 * - the big count line ("27 in 100") derives from `count`; the caller only
 *   supplies the sentence, whose money figure comes from the same store.
 *
 * M9 self-omit: a group with count <= 0 omits its block (UnitGrid rule). A
 * partition that does not sum to `total` is a lie and renders nothing.
 */
import * as React from "react";

import { UnitGrid, type UnitGroup, type UnitTone } from "./UnitGrid";

export type HundredGroup = {
  kind: "over" | "mid" | "none";
  count: number;
  /** The block sentence ("pay their owner $95K or more"); figure from the store. */
  label: string;
};

export interface HundredProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: HundredGroup[];
  /** The fixed encoding sentence under the marks. */
  caption?: string | null;
  total?: number;
}

/** The tone rule , a constant of the component, never data (M5). */
const KIND_TONE: Record<HundredGroup["kind"], UnitTone> = {
  over: "terra",
  mid: "neutral",
  none: "faint",
};

const Hundred = React.forwardRef<HTMLDivElement, HundredProps>(
  ({ groups, caption, total = 100, ...props }, ref) => {
    const sum = groups.reduce((s, g) => s + Math.max(0, g.count), 0);
    if (sum !== total) {
      if (process.env.NODE_ENV !== "production")
        console.error(
          `Hundred: counts sum to ${sum}, not ${total}; a partition with a hole is a lie, rendering nothing.`,
        );
      return null;
    }

    const unitGroups: UnitGroup[] = groups.map((g) => ({
      count: g.count,
      tone: KIND_TONE[g.kind],
      label: { big: `${g.count} in ${total}`, small: g.label },
    }));

    return (
      <UnitGrid ref={ref} layout="blocks" total={total} groups={unitGroups} {...props}>
        {caption ? <div className="cap">{caption}</div> : null}
      </UnitGrid>
    );
  },
);
Hundred.displayName = "Hundred";

export { Hundred };
