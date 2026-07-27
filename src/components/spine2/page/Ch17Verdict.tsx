/**
 * Chapter 17 , the verdict.
 *
 * The chips take figure ids, never free text: each one resolves against the
 * page's own figure registry, so a chip can only restate a number that
 * appears above it. An id the page does not carry does not render, and
 * console.errors in dev, which is why the mockup's "demanding to break in"
 * chip is gone: nothing on this page measures how hard it is to break in.
 */
import * as React from "react";

import { Take } from "@/components/spine2/Take";
import type { TakeChip } from "@/components/spine2/Take";
import type { GlyphId } from "@/components/spine2/glyphs";
import type { VerdictModel } from "@/lib/cells/spine2_adapter";

export function Ch17Verdict({
  verdict,
  figures,
  city,
  noun,
}: {
  verdict: VerdictModel;
  figures: Record<string, string>;
  city: string;
  noun: string;
}) {
  const chips: TakeChip[] = verdict.chips.map((c) => ({
    glyph: c.glyph as GlyphId,
    figureId: c.figureId,
  }));

  return (
    <Take
      className="rise"
      figures={figures}
      chips={chips}
      verdict={
        <>
          A {city} {noun} is <b>deep demand on a thin margin.</b> The room
          fills, the money moves, and about {verdict.keptCents} cents of every
          dollar reaches the owner. The rooms that pay their owner well mostly
          signed a cheaper lease and ran a shorter menu.
        </>
      }
    />
  );
}
