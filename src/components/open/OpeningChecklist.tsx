/**
 * src/components/open/OpeningChecklist.tsx
 *
 * The licences a would-be owner needs before the first customer, rendered as
 * the board's StatGrid: each licence is a label over its typical wait in days,
 * its fee band as the hint. The rows are the trade page's own `03 permits`
 * cells (buildPermits, src/lib/spine/permits_rows.ts), longest wait first, so
 * the two pages print one list; each wait carries its stamp (data-src names
 * the shard file and the licence's key, data-kind says estimate).
 *
 * WHAT STOOD HERE UNTIL 2026-10-15 (release 2 job A): capital to start, time
 * to open, permits in dollars and first hires, four figures from two tables
 * typed by hand with no source, the 80,000, 10-week, $1,500 and 2-hire fills
 * on the trades the tables did not key. The licences are what the shard holds
 * in their place. A place that prints no licence list (a UK page) prints the
 * stated line, never an empty section.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StatGrid, type StatRow } from "@/components/board/StatGrid";
import { provAttrs } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import type { OpeningPage } from "@/lib/open/opening_page";

export function OpeningChecklist({ page }: { page: OpeningPage }) {
  const C = COPY.opening;
  const rows: StatRow[] = (page.permits?.cells ?? []).map((c) => ({
    label: c.label,
    value: null,
    node: <span {...provAttrs(c.prov)}>{c.value}</span>,
    hint: c.note,
  }));

  return (
    <section className="mt-10">
      <SectionEyebrow>{C.licencesHead}</SectionEyebrow>
      <p className="mt-1 text-sm text-cocoa-700">
        {rows.length > 0 ? C.licencesLine : C.noLicences}
      </p>
      {rows.length > 0 ? (
        <div className="mt-3">
          <StatGrid rows={rows} />
        </div>
      ) : null}
      {page.permits?.withheld ? (
        <p className="mt-2 text-[11px] text-cocoa-500">{page.permits.withheld}</p>
      ) : null}
    </section>
  );
}
