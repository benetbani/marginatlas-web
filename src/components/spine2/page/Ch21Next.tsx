/**
 * Chapter 21 , where to go next.
 *
 * The door and fact grammar (M1): a reading whose target page does not exist
 * keeps its figure and loses its affordance. What it cannot do is keep its
 * affordance and lose its figure, so at launch, with no sibling cell built,
 * the adapter hands this chapter nothing and the chapter never mounts. The
 * first sibling cell fills it without a line changing here.
 */
import * as React from "react";

import { Tiles } from "@/components/spine2/Tiles";
import type { ReadingData } from "@/components/spine2/Reading";
import type { GlyphId } from "@/components/spine2/glyphs";

export function Ch21Next({
  next,
}: {
  next: Array<{ glyph: string; label: string; figure: string | null; href?: string }>;
}) {
  const readings: ReadingData[] = next.map((r) => ({
    glyph: r.glyph as GlyphId,
    label: r.label,
    figure: r.figure,
    href: r.href,
  }));
  return <Tiles className="rise" readings={readings} />;
}
