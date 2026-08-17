/**
 * src/components/board/DataSection.tsx
 *
 * One labeled block of the board: an eyebrow title, an optional chart, and a
 * stat grid. This is the unit pages stack to compose a board, so its
 * guarantees matter:
 *
 *   - The section ALWAYS renders, even when every value in it is blank. The
 *     board is a fixed scaffold the reader can learn once; a section that
 *     vanished when empty would make the page shape depend on data and break
 *     that contract. Blanks show as dashes (see StatGrid), which is honest.
 *   - The first eight rows render immediately. Any beyond that fold into a
 *     small client-side ShowMore toggle, so a long section stays scannable
 *     above the fold without losing its data.
 *   - When `modeled`, a single quiet footnote marks the figures as directional.
 *     One note per section, not a badge per row (show the number plainly).
 *
 * Server component. The only client code is the ShowMore toggle, isolated in
 * its own file. Chart nodes are passed in already built (each chart is its own
 * client/server decision and returns null when its core data is absent).
 */
import * as React from "react";
import { StatGrid, type StatRow } from "./StatGrid";
import { ShowMore } from "./ShowMore";
import { AtlasIcon } from "@/components/brand/icons";
import type { AtlasIconId } from "@/components/brand/icons";

// Quiet ma- mark per board section, keyed by the section key the builders use
// (cell / city / country boards share these). A recurring section always reads
// with the same glyph, the design-system "one mark per recurring concept" rule.
const SECTION_ICON: Record<string, AtlasIconId> = {
  numbers: "revenue",
  opening: "startup-cost",
  market: "competition",
  pricing: "spending-power",
  deformation: "compare",
  tax: "taxes",
  friction: "red-tape",
  demand: "best-areas",
  location: "commercial-rent",
  labor: "wages",
  survival: "first-year",
};

/**
 * One section of the board. `rows` is rendered in full (first eight inline,
 * the rest behind ShowMore). `modeled` flags directional figures. `chart` is
 * an optional visual rendered above the grid. `dek` is an optional short warm
 * line under the title that frames the section before its numbers. `footer` is
 * an optional quiet node rendered at the foot of the section (e.g. a subtle
 * cross-link to a deeper page); it sits below the modeled footnote so it never
 * crowds the figures.
 */
export type BoardSection = {
  key: string;
  title: string;
  rows: StatRow[];
  modeled?: boolean;
  chart?: React.ReactNode;
  dek?: string;
  footer?: React.ReactNode;
};

/** How many rows render before the ShowMore fold. */
const INLINE_ROWS = 8;

export function DataSection({
  section,
  muteEmpty = false,
  variant = "grid",
}: {
  section: BoardSection;
  /** When set, blank rows recede further (used by the city board, which is
   *  mostly blanks off the flagship cities). Off for the cell + country boards. */
  muteEmpty?: boolean;
  /** "ruled" gives the city board hairline row separators, a larger title, and
   *  "?" tooltips; "grid" is the original cell + country look. Opt-in, so the
   *  cell and country boards are unchanged. */
  variant?: "grid" | "ruled";
}) {
  const inline = section.rows.slice(0, INLINE_ROWS);
  const overflow = section.rows.slice(INLINE_ROWS);

  return (
    // SaaS reformation 2026-06-12 (founder direction): each board section is
    // a seated white card on the warm app ground, not a hairline stripe on a
    // flat sheet. The section title is a real serif heading (a scanning
    // anchor), with the old eyebrow treatment kept above it as the quiet
    // category voice. One surface per section; the ground breathes between.
    // Canonical surface: was "rounded-lg border border-parchment bg-cream-50".
    <section className="atlas-card mt-5 px-5 py-5 md:px-7 md:py-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink-900 md:text-xl">
        {SECTION_ICON[section.key] ? (
          <AtlasIcon
            id={SECTION_ICON[section.key]}
            size={19}
            className="shrink-0 text-atlas-700/80"
          />
        ) : null}
        {section.title}
      </h3>

      {section.dek ? (
        <p className="mt-1.5 text-sm leading-relaxed text-cocoa-700">{section.dek}</p>
      ) : null}

      {section.chart ? <div className="mt-4">{section.chart}</div> : null}

      <div className="mt-4">
        <StatGrid rows={inline} muteEmpty={muteEmpty} variant={variant} />
      </div>

      {overflow.length > 0 ? (
        <ShowMore>
          <StatGrid rows={overflow} muteEmpty={muteEmpty} variant={variant} />
        </ShowMore>
      ) : null}

      {section.modeled ? (
        <p className="mt-3 text-[11px] text-cocoa-500">
          Modeled from national business demography. Directional.
        </p>
      ) : null}

      {section.footer ? <div className="mt-3">{section.footer}</div> : null}
    </section>
  );
}
