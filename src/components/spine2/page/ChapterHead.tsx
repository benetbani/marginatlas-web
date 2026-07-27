/**
 * src/components/spine2/page/ChapterHead.tsx
 *
 * The chapter frame, verbatim from the frozen mockup:
 *   section.ch > .chhead > .hd > .itile + .chnum + h2
 *
 * The number is passed in, never counted here: chapters that self-omit are
 * gone before this renders, and the spine is renumbered so the reader never
 * sees a hole where a section had no data (spine2_adapter.numberChapters).
 */
import * as React from "react";

import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";

export type Chapter = {
  num: string;
  title: string;
  icon: string;
  anchor: string;
};

export function ChapterHead({ chapter }: { chapter: Chapter }) {
  return (
    <div className="chhead">
      <div className="hd">
        <span className="itile">
          <GlyphIcon id={chapter.icon as GlyphId} size={24} />
        </span>
        <span className="chnum">{chapter.num}</span>
        <h2>{chapter.title}</h2>
      </div>
    </div>
  );
}

/** section.ch with its head, the shape every chapter below the hero takes. */
export function ChapterSection({
  chapter,
  children,
}: {
  chapter: Chapter;
  children: React.ReactNode;
}) {
  return (
    <section className="ch" id={chapter.anchor}>
      <ChapterHead chapter={chapter} />
      {children}
    </section>
  );
}

/** The disclosure the mockup opens under a chart: details.more. */
export function More({
  glyph,
  summary,
  count,
  children,
}: {
  glyph: GlyphId;
  summary: string;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <details className="more">
      <summary>
        <GlyphIcon id={glyph} size={18} />
        {summary}
        <span className="ct">{count}</span>
        <span className="exp">
          <i />
        </span>
      </summary>
      <div className="body">{children}</div>
    </details>
  );
}
