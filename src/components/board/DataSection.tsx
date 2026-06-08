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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StatGrid, type StatRow } from "./StatGrid";
import { ShowMore } from "./ShowMore";

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
}: {
  section: BoardSection;
  /** When set, blank rows recede further (used by the city board, which is
   *  mostly blanks off the flagship cities). Off for the cell + country boards. */
  muteEmpty?: boolean;
}) {
  const inline = section.rows.slice(0, INLINE_ROWS);
  const overflow = section.rows.slice(INLINE_ROWS);

  return (
    <section className="mt-8">
      <SectionEyebrow>{section.title}</SectionEyebrow>

      {section.dek ? (
        <p className="mt-1 text-sm text-cocoa-700">{section.dek}</p>
      ) : null}

      {section.chart ? <div className="mt-3">{section.chart}</div> : null}

      <div className="mt-3">
        <StatGrid rows={inline} muteEmpty={muteEmpty} />
      </div>

      {overflow.length > 0 ? (
        <ShowMore>
          <StatGrid rows={overflow} muteEmpty={muteEmpty} />
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
