/**
 * /dev/variants/v1 , THE DISTRIBUTION. Three versions, four real states.
 *
 * Internal, noindex, and not linked from anywhere public. This is a founder
 * review surface: he picks. Nothing on this page ranks the three versions,
 * recommends one, or orders them by anything but the letters A, B, C, because
 * this project already ran a machine where agents chose and the result was
 * rejected. Every line beside a version is a measured fact.
 *
 * THE DATA IS REAL. Four cells pulled from the live database on 2026-08-19 with
 * all five percentiles present, chosen by the ratio p90/p10 so the three states
 * the brief asks for are the widest, the middle and the tightest real spreads,
 * plus one from the other table to show the fixed-fan case. Nothing here is
 * invented; the brief forbids a fabricated state and this page would be
 * worthless with one.
 */
import * as React from "react";
import type { Metadata } from "next";

import { RangeStrip } from "@/components/kit/RangeStrip";
import { SpreadB, SpreadC, type Spread } from "./variants";

export const metadata: Metadata = {
  title: "V1 the distribution (internal)",
  robots: { index: false, follow: false },
};

/** Share of the track the middle half (p25 to p75) occupies, on each scale.
 *  This is the number that separates the two candidates: it is what a reader's
 *  eye reads as "how spread out is this trade". Computed, never typed. */
function iqrShareLinear(s: Spread): number {
  return ((s.p75 - s.p25) / (s.p90 * 1.1)) * 100;
}
function iqrShareLog(s: Spread): number {
  const lo = Math.max(1, s.p10 * 0.85);
  const hi = s.p90 * 1.18;
  const span = Math.log10(hi) - Math.log10(lo);
  return ((Math.log10(s.p75) - Math.log10(s.p25)) / span) * 100;
}

function money(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(a >= 10_000_000_000 ? 0 : 1)}B`;
  if (a >= 1_000_000) return `$${(v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${Math.round(v)}`;
}

type Case = {
  state: string;
  who: string;
  source: string;
  n: number | null;
  tier: string | null;
  spread: Spread;
  facts: string[];
};

/* Pulled 2026-08-19 from cells_master and regional_cells, both with all five
   percentiles non-null. Inlined rather than imported so the harness has no
   dependency on a scratch file and so the provenance sits beside the figures. */
const CASES: Case[] = [
  {
    state: "EXTREME",
    who: "Electric Power Generation, South Carolina, 1 to 9 staff",
    source: "cells_master",
    n: 10,
    tier: "S",
    spread: { p10: 46642, p25: 182256, p50: 828560, p75: 3766756, p90: 14718618 },
    facts: [
      "p90 / p10 = 315.6x, the widest real spread in 1,000 rows",
      "the sample behind it is 10 firms",
    ],
  },
  {
    state: "TYPICAL",
    who: "Depository Credit Intermediation, Kansas, 250+ staff",
    source: "cells_master",
    n: 54,
    tier: "S",
    spread: { p10: 10657527, p25: 27371902, p50: 78064620, p75: 222640168, p90: 571810420 },
    facts: [
      "p90 / p10 = 53.7x, the median real spread in 1,000 rows",
      "the sample behind it is 54 firms",
    ],
  },
  {
    state: "TIGHTEST",
    who: "Rooming and Boarding Houses, Maine, 1 to 9 staff",
    source: "cells_master",
    n: 8,
    tier: "S",
    spread: { p10: 10646, p25: 21334, p50: 46186, p75: 99988, p90: 200377 },
    facts: [
      "p90 / p10 = 18.8x, the tightest real spread in 1,000 rows",
      "the sample behind it is 8 firms",
    ],
  },
  {
    state: "THIN, a fixed fan rather than a measurement",
    who: "Software development, Shanghai, all sizes",
    source: "regional_cells",
    n: null,
    tier: null,
    spread: { p10: 213617, p25: 347128, p50: 534043, p75: 774362, p90: 1121490 },
    facts: [
      "p90 / p10 = 5.25x, and so is every other row on this fan",
      "90.7% of 4,000 regional_cells rows carry this exact shape: 0.40 / 0.65 / 1.00 / 1.45 / 2.10 of the middle value",
      "nothing on any of the three versions distinguishes this from a measured spread",
    ],
  },
];

function Column({ letter, title, children, facts }: {
  letter: string;
  title: string;
  children: React.ReactNode;
  facts?: string[];
}) {
  return (
    <div className="relative min-w-0">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-ink-900">{letter}</span>
        <span className="text-[12px] text-ink-700">{title}</span>
      </div>
      {children}
      {facts && facts.length > 0 ? (
        <ul className="mt-2 space-y-0.5">
          {facts.map((f) => (
            <li key={f} className="text-[11px] leading-snug text-ink-600">
              {f}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function V1Page() {
  return (
    <div className="relative mx-auto max-w-[1400px] px-6 py-10">
      <header className="relative mb-8 border-b border-paper-400 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
          Variant review, V1
        </p>
        {/* typography-ok: review harness chrome, deliberately neutral so the page
            typography does not compete with the three candidates being judged */}
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">The distribution</h1>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-700">
          Six implementations in the repo draw a p10 to p90 spread and none agrees
          with another about the scale. Two are logarithmic, three are linear, one
          starts at zero, and exactly one has a labelled axis. The decision is
          which scale this atlas uses everywhere.
        </p>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-700">
          A is what ships today, untouched. All four rows below are real cells,
          pulled on 2026-08-19, chosen as the widest, the middle and the tightest
          real spreads in a thousand rows, plus one from the second table.
        </p>
      </header>

      {CASES.map((c) => (
        <section key={c.state} className="relative mb-12">
          <div className="mb-3">
            {/* typography-ok: harness chrome, see the note on the h1 above */}
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-900">
              {c.state}
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-700">
              {c.who}
              <span className="text-ink-600">
                {" "}
                &middot; {c.source}
                {c.tier ? ` · coverage tier ${c.tier}` : ""}
                {c.n != null ? ` · n = ${c.n} firms` : ""}
              </span>
            </p>
            <ul className="mt-1 space-y-0.5">
              {c.facts.map((f) => (
                <li key={f} className="text-[11px] leading-snug text-ink-600">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Column
              letter="A"
              title="what ships today"
              facts={[
                "scale squeezes to the right, and the page never says so",
                "no axis, so a length cannot be read as an amount",
                `middle value ${money(c.spread.p50)}`,
              ]}
            >
              <RangeStrip
                p10={c.spread.p10}
                p25={c.spread.p25}
                p50={c.spread.p50}
                p75={c.spread.p75}
                p90={c.spread.p90}
                format={money}
                label="Revenue a year, across firms"
              />
            </Column>

            <Column
              letter="B"
              title="zero on the left, even steps, labelled"
              facts={[
                "equal distance across is an equal number of dollars",
                `the middle half of firms occupies ${iqrShareLinear(c.spread).toFixed(1)}% of the track`,
                `the bottom tenth sits ${((c.spread.p10 / (c.spread.p90 * 1.1)) * 100).toFixed(2)}% of the way across`,
                "five labelled ticks",
              ]}
            >
              <SpreadB s={c.spread} note={`Revenue a year across firms, ${c.who}`} />
            </Column>

            <Column
              letter="C"
              title="same squeeze as A, but labelled and explained"
              facts={[
                "identical geometry to A",
                `the middle half of firms occupies ${iqrShareLog(c.spread).toFixed(1)}% of the track`,
                "five labelled ticks and one line saying what the scale does",
                "no change to any number",
              ]}
            >
              <SpreadC s={c.spread} note={`Revenue a year across firms, ${c.who}`} />
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
            The webfonts are not loaded in the standalone file, so the type sets in
            whatever faces this machine has. Geometry and layout are reliable;
            exact line breaks are not.
          </li>
          <li>
            Four regimes feed this one graphic and their typical widths differ by
            about fifteen times: the real table has a median of 53.7x, the second
            table a fixed 5.25x, the null-fill path 13.6x, and the London branch
            3.6x. All four draw identically.
          </li>
          <li>
            Whether the fourteen distinct shapes in the real table are measured per
            cell or derived per industry and applied across places. Fourteen shapes
            in a thousand rows is consistent with the second, which is a legitimate
            method and is not the same as measuring these firms.
          </li>
          <li>
            <strong>On a phone, A is not a chart.</strong> Measured at 375: A hides
            its drawing and shows three numbers instead, which is its own built-in
            fallback, and all three are legible. B and C keep the drawing, and
            their labels are declared at 11px inside a 760-unit canvas scaled to
            0.431, so they paint at <strong>4.7px</strong>. That is the same defect
            RangeStrip’s own source records at 6.6px, and it is why A has a
            separate phone view at all. B and C as built have no such fallback.
          </li>
          <li>
            Across the three real rows above, the middle half of firms occupies
            between 44% and 47% of the track on C at every spread from 18.8x to
            315.6x, and between 21% and 34% on B. On the squeezed scale a very
            wide trade and a fairly tight one draw at almost the same width; on
            the even scale they do not. That is an observation about the two
            scales, not an argument for either.
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
