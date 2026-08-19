/**
 * /dev/variants/v3 , THE TABLE. Three versions, three real row counts.
 *
 * Internal, noindex, not linked publicly. The founder picks; nothing here ranks
 * the three versions or recommends one.
 *
 * THE ROWS ARE REAL. Twenty London activities from the curated market seed, each
 * carrying its own revenue, net margin, owner take-home and firm count. The seed
 * closes the take-home identity at load, so the three money columns agree with
 * each other by construction rather than by coincidence.
 *
 * ON THE TAKE-HOME GATE. This file reads owner_take_home rather than calling
 * resolveOwnerTakeHome, and verify_take_home_identity flags that shape, which is
 * correct of it. This file derives nothing: LONDON_MARKET closes the identity at
 * load, and measured 2026-08-19 across all 20 curated activities the worst gap
 * between the stored take-home and revenue times margin is 0 USD. The three
 * money columns printed here therefore agree with each other by construction
 * upstream and cannot contradict the cell page. Recorded with that measurement
 * in the gate's reviewed bucket, which is the purpose that bucket was built for,
 * and NOT by adding an entry to silence it.
 *
 * WHAT THIS PAGE CANNOT DISTINGUISH: a table that is well formed from one that
 * is well formed AND receives rows in production. These three all receive rows
 * here because the data is a static seed. A shipping table fed by a query that
 * times out looks identical in source and renders empty.
 */
import * as React from "react";
import type { Metadata } from "next";

import { LONDON_MARKET } from "@/lib/london/market";
import { TableA, TableB, TableC, type Row } from "./variants";

export const metadata: Metadata = {
  title: "V3 the table (internal)",
  robots: { index: false, follow: false },
};

function title(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildRows(): Row[] {
  const acts = (LONDON_MARKET as unknown as {
    activities: Record<
      string,
      { economics?: { revenue?: number; net_margin_pct?: number; owner_take_home?: number; firms?: number } }
    >;
  }).activities;
  const out: Row[] = [];
  for (const [slug, entry] of Object.entries(acts)) {
    const e = entry?.economics;
    if (!e || typeof e.revenue !== "number" || typeof e.owner_take_home !== "number") continue;
    out.push({
      name: title(slug),
      revenue: e.revenue,
      marginPct: typeof e.net_margin_pct === "number" ? e.net_margin_pct : 0,
      takeHome: e.owner_take_home,
      firms: typeof e.firms === "number" ? e.firms : 0,
    });
  }
  return out.sort((a, b) => b.takeHome - a.takeHome);
}

function Column({ letter, title: t, facts, children }: {
  letter: string;
  title: string;
  facts: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-ink-900">{letter}</span>
        <span className="text-[12px] text-ink-700">{t}</span>
      </div>
      {children}
      <ul className="mt-2 space-y-0.5">
        {facts.map((f) => (
          <li key={f} className="text-[11px] leading-snug text-ink-600">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function V3Page() {
  const all = buildRows();
  const cases = [
    { state: `THIN, 2 rows`, rows: all.slice(0, 2) },
    { state: `TYPICAL, 8 rows`, rows: all.slice(0, 8) },
    { state: `EXTREME, all ${all.length} rows`, rows: all },
  ];

  return (
    <div className="relative mx-auto max-w-[1500px] px-6 py-10">
      <header className="relative mb-8 border-b border-paper-400 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
          Variant review, V3
        </p>
        {/* typography-ok: review harness chrome, deliberately neutral so the page
            typography does not compete with the three candidates being judged */}
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">The table</h1>
        <p className="mt-2 max-w-[74ch] text-sm leading-relaxed text-ink-700">
          Three things were measured across this repo and none of them is a
          matter of taste. The house rule for lining figures up, written into
          <code className="px-1 text-[12px]">globals.css</code> line 12, is used
          zero times. No table anywhere has a header row that stays put when the
          table is long. And thirteen files contain a table with no{" "}
          <code className="px-1 text-[12px]">scope</code> on any header cell,
          while the kit primitives that get it right are barely used. The
          decision is how much structure a financial table here should carry.
        </p>
        <p className="mt-2 max-w-[74ch] text-sm leading-relaxed text-ink-700">
          A reproduces the shipping pattern rather than importing it, because
          every table that ships is welded to its own data and none can be handed
          different rows. Its classes are copied verbatim from{" "}
          <code className="px-1 text-[12px]">BusinessFormationCosts.tsx</code>,
          which does ship. All {all.length} rows are real London activities.
        </p>
      </header>

      {cases.map(({ state, rows }) => (
        <section key={state} className="relative mb-14">
          <div className="mb-3">
            {/* typography-ok: harness chrome, see the note on the h1 above */}
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-900">
              {state}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <Column
              letter="A"
              title="the shipping pattern"
              facts={[
                "headers left aligned, including the four numeric ones",
                "no scope on any header cell",
                "no lining figures, so digits do not stack in a column",
                "the unit is repeated inside every cell",
                "no sticky header",
              ]}
            >
              <TableA rows={rows} />
            </Column>

            <Column
              letter="B"
              title="the properties, nothing else"
              facts={[
                "numeric columns right aligned with lining figures",
                "scope on every header cell, and the trade name is a row header",
                "the unit moved to the header, once instead of per cell",
                `header stays put while ${rows.length} rows scroll`,
                "no bars, no colour, no restyle",
              ]}
            >
              <TableB rows={rows} />
            </Column>

            <Column
              letter="C"
              title="B, plus a bar in each numeric cell"
              facts={[
                "one bar per numeric column, scaled to that column's largest value",
                "the value is still printed; the bar does not replace it",
                "one accent, and the bar grows from the right so it meets the figure",
              ]}
            >
              <TableC rows={rows} />
            </Column>
          </div>
        </section>
      ))}

      <footer className="relative mt-4 border-t border-paper-400 pt-4">
        {/* typography-ok: harness chrome, see the note on the h1 above */}
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-900">
          What this page cannot show you
        </h2>
        <ul className="mt-2 max-w-[80ch] space-y-1 text-[12px] leading-relaxed text-ink-700">
          <li>
            Whether a well-formed table receives rows in production. These three
            all fill because the data is a static seed; a shipping table fed by a
            query that times out looks identical in source and renders empty.
          </li>
          <li>
            The two-row case is the one to look at for the sticky header. A header
            that stays put is doing nothing when the table is shorter than the
            screen, and the decision is whether it sticks always or only past some
            number of rows.
          </li>
          <li>
            A keeps the brown header tone because A shows what ships. B and C do
            not use it: it is banned, and the graphics review found it acting as a
            data tone rather than only as text.
          </li>
          <li>
            Whether a reader prefers any of these. This page carries no ranking and
            no recommendation on purpose.
          </li>
        </ul>
      </footer>
    </div>
  );
}
