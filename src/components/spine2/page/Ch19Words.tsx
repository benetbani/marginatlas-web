/**
 * Chapter 19 , what these words mean.
 *
 * A glossary of the six terms this page uses in a way a reader could
 * reasonably read differently. A definition with no plain sentence does not
 * render, which is the Defs component's own rule.
 */
import * as React from "react";

import { Defs } from "@/components/spine2/Defs";
import type { Def } from "@/components/spine2/Defs";
import type { GlyphId } from "@/components/spine2/glyphs";

export function Ch19Words({
  words,
}: {
  words: Array<{ glyph: string; term: string; plain: string }>;
}) {
  const defs: Def[] = words.map((w) => ({
    glyph: w.glyph as GlyphId,
    term: w.term,
    plain: w.plain,
  }));
  return <Defs className="rise" defs={defs} />;
}
