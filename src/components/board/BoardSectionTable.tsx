/**
 * src/components/board/BoardSectionTable.tsx
 *
 * Renders one BoardSection as a DISTINCT titled small table: a titled white
 * card with hairline label-left / value-right rows. It is the same board
 * section data DataSection consumes, but laid out as a self-contained card
 * in the StatCard language instead of an undifferentiated eyebrow-and-grid
 * stack.
 *
 * Why this exists: the country page (/gb, /de, /tr) carries five fixed board
 * sections (tax and climate, institutional friction, labor and skills,
 * survival baseline, market structure). Stacked as DataSections they read as
 * one long run of figures with faint eyebrows between them. The founder wants
 * each section to read as its own small structured table, clearly delineated,
 * so a country page scans as a SET of small tables sharing the site's table
 * language. This renderer is that treatment: drop a BoardSection in, get one
 * titled card out.
 *
 * Contract preserved from DataSection:
 *   - Every row the section carries is rendered, in order. A null value shows
 *     the one board dash (StatCard handles this), so a blank reads as "we do
 *     not hold this field", never as broken.
 *   - When `modeled`, a single quiet footnote marks the figures as
 *     directional. One note per card, not a badge per row.
 *
 * Server component. Tokens only, mobile-first. The card surface, hairlines,
 * and footnote tone all come from StatCard, so this stays purely a mapping
 * from the board's section shape onto the card's prop shape and adds no new
 * visual vocabulary.
 */
import * as React from "react";
import type { BoardSection } from "./DataSection";
import { StatCard, type StatCardStat } from "./StatCard";

/** The modeled-data note, kept identical in wording to DataSection's. */
const MODELED_NOTE = "Modeled from national business demography. Directional.";

export function BoardSectionTable({
  section,
  className,
}: {
  section: BoardSection;
  className?: string;
}) {
  // A board StatRow and a StatCardStat are the same label / value / hint
  // shape; map straight across so the card renders the section's rows as its
  // hairline list.
  const stats: StatCardStat[] = section.rows.map((row) => ({
    label: row.label,
    value: row.value,
    hint: row.hint,
  }));

  return (
    <StatCard
      title={section.title}
      stats={stats}
      footnote={section.modeled ? MODELED_NOTE : undefined}
      className={className}
    />
  );
}
