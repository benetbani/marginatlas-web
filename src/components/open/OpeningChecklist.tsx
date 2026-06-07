/**
 * src/components/open/OpeningChecklist.tsx
 *
 * The four entry parts a would-be owner asks about, rendered as the board's
 * StatGrid so they read in the same visual language as the cell page's "What it
 * takes to open" section. The labels, the formatters, and the quiet "modeled"
 * hints all match that section verbatim (Capital to start, Time to open, Permits
 * and licensing, First hires), so a reader who knows the board reads this with
 * no relearning. The four values come straight off the data builder, which
 * computed them the SAME way the board does, so the two surfaces never disagree.
 *
 * First hires carries the warm role hint as its supporting text, with the
 * "modeled" marker riding alongside it exactly as the board row does.
 *
 * One quiet section footnote marks the figures as directional (the same honesty
 * note the board uses), rather than a badge per row.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StatGrid, type StatRow } from "@/components/board/StatGrid";
import { fmtUSD, fmtInt, fmtWeeksToOpen } from "@/components/board/format";
import type { OpeningPage } from "@/lib/open/opening_page";

export function OpeningChecklist({ page }: { page: OpeningPage }) {
  const rows: StatRow[] = [
    {
      label: "Capital to start",
      value: fmtUSD(page.capital.value),
      hint: page.capital.modeled ? "modeled" : undefined,
    },
    {
      label: "Time to open",
      value: fmtWeeksToOpen(page.time.value),
      hint: page.time.modeled ? "modeled" : undefined,
    },
    {
      label: "Permits and licensing",
      value: fmtUSD(page.permits.value),
      hint: page.permits.modeled ? "modeled" : undefined,
    },
    {
      label: "First hires",
      value: fmtInt(page.hires.value),
      // The role hint is the row's supporting text; the "modeled" marker rides
      // alongside it so the figure stays honest about being an archetype.
      hint: page.hires.roleHint
        ? `${page.hires.roleHint}, modeled`
        : page.hires.modeled
          ? "modeled"
          : undefined,
    },
  ];

  return (
    <section className="mt-10">
      <SectionEyebrow>The checklist</SectionEyebrow>
      <p className="mt-1 text-sm text-cocoa-700">
        The cost, the calendar, and the crew before your first customer. Modeled
        estimates, shaped by the trade and the local cost of doing business.
      </p>
      <div className="mt-3">
        <StatGrid rows={rows} />
      </div>
      <p className="mt-3 text-[11px] text-cocoa-500">
        Modeled from national business demography. Directional.
      </p>
    </section>
  );
}
