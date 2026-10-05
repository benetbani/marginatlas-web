/**
 * src/components/open/OpeningChecklist.tsx
 *
 * The four entry parts a would-be owner asks about, rendered as the board's
 * StatGrid so they read in the same visual language as the cell page's "What it
 * takes to open" section (Capital to start, Time to open, Permits and licensing,
 * First hires). The four values come straight off the data builder, which
 * computed them the SAME way the board does, so the two surfaces never disagree.
 *
 * Each estimated row says "estimated" as its hint, the word milestone 1 (M11)
 * gave the struck "modeled" (his copy correction of 2026-09-24; masterplan step
 * 02), and First hires carries the role hint beside it. One supporting line.
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
      hint: page.capital.modeled ? "estimated" : undefined,
    },
    {
      label: "Time to open",
      value: fmtWeeksToOpen(page.time.value),
      hint: page.time.modeled ? "estimated" : undefined,
    },
    {
      label: "Permits and licensing",
      value: fmtUSD(page.permits.value),
      hint: page.permits.modeled ? "estimated" : undefined,
    },
    {
      label: "First hires",
      value: fmtInt(page.hires.value),
      // The role hint is the row's supporting text; "estimated" rides beside it.
      hint: page.hires.roleHint
        ? `${page.hires.roleHint}, estimated`
        : page.hires.modeled
          ? "estimated"
          : undefined,
    },
  ];

  return (
    <section className="mt-10">
      <SectionEyebrow>The checklist</SectionEyebrow>
      <p className="mt-1 text-sm text-cocoa-700">
        The cost, the calendar and the crew before your first customer.
      </p>
      <div className="mt-3">
        <StatGrid rows={rows} />
      </div>
    </section>
  );
}
