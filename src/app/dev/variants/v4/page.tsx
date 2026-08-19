/**
 * /dev/variants/v4 , SEASONALITY. Three versions, one real series.
 *
 * Internal, noindex, not linked publicly. The founder picks; nothing here ranks
 * the three versions or recommends one.
 *
 * TWO THINGS THIS PAGE MUST SAY OUT LOUD, because the brief for this family was
 * written before either was known.
 *
 * 1. B IS ALREADY RATIFIED. `city2/CityYearStrip` draws deviation from the year
 *    average and its own header records the founder ratifying that shape on
 *    2026-08-08, with the reason: drawn from zero, twelve bars between 82 and
 *    118 are twelve near-identical bars. So this family is closer to a
 *    confirmation than an open choice, and the open part is whether the three
 *    level implementations converge onto it.
 *
 * 2. THERE IS ONE REAL SERIES IN THE REPO. Searched: the London market seed
 *    carries none, `activity_inputs.json` carries none, the narrative files
 *    carry none. Only `data/cells/restaurants-in-london.json` has a twelve-month
 *    index. The brief asks for a narrow-range trade to test the case where
 *    deviation becomes noise, and that case CANNOT be shown, because no such
 *    series exists here. It is not invented. That absence is itself the finding:
 *    one series, five components built to draw it.
 */
import * as React from "react";
import type { Metadata } from "next";

import { getLondonRestaurantsSeasonality } from "@/lib/seasonality/fixture";
import { SeasonA, SeasonB, SeasonC, type Month } from "./variants";

export const metadata: Metadata = {
  title: "V4 seasonality (internal)",
  robots: { index: false, follow: false },
};

/* The data access lives in src/lib, per verify_layering. The accessor carries
   the unit, the tier and the modelled flag so this page restates none of them. */
function readMonths(): { months: Month[]; unit: string; tier: string; modelled: boolean } {
  return getLondonRestaurantsSeasonality();
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

export default function V4Page() {
  const { months, unit, tier, modelled } = readMonths();
  const vals = months.map((m) => m.index);
  const lo = vals.length ? Math.min(...vals) : 0;
  const hi = vals.length ? Math.max(...vals) : 0;
  const peak = months.find((m) => m.index === hi);
  const trough = months.find((m) => m.index === lo);
  /* On a zero floor, the shortest column is this share of the tallest. The
     closer to 100%, the more the twelve columns look the same. */
  const sameness = hi ? (lo / hi) * 100 : 0;

  return (
    <div className="relative mx-auto max-w-[1400px] px-6 py-10">
      <header className="relative mb-8 border-b border-paper-400 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
          Variant review, V4
        </p>
        {/* typography-ok: review harness chrome, deliberately neutral so the page
            typography does not compete with the three candidates being judged */}
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Seasonality</h1>
        <p className="mt-2 max-w-[74ch] text-sm leading-relaxed text-ink-700">
          Five components in this repo draw a twelve-month shape and they disagree
          about the floor. Three draw the index from zero, two draw it as
          deviation from the year average. An identical column therefore means
          &ldquo;this much trade&rdquo; on one page and &ldquo;this much above
          normal&rdquo; on another, and a reader cannot tell which.
        </p>
        <p className="mt-2 max-w-[74ch] rounded border border-paper-400 bg-paper-200 px-3 py-2 text-sm leading-relaxed text-ink-700">
          <strong>Two things worth knowing before you look.</strong> B is already
          ratified: <code className="px-1 text-[12px]">CityYearStrip</code> draws
          this shape and its header records you approving it on 2026-08-08,
          because drawn from zero the twelve bars are near-identical. So this is
          closer to a confirmation than an open choice. And there is{" "}
          <strong>one real twelve-month series in the whole repo</strong>. The
          brief asked for a narrow-range trade to test where deviation becomes
          noise; no such series exists here, so it is not shown and it is not
          invented.
        </p>
      </header>

      <section className="relative mb-12">
        <div className="mb-3">
          {/* typography-ok: harness chrome, see the note on the h1 above */}
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-900">
            The only real series in the repo
          </h2>
          <p className="mt-0.5 text-[12px] text-ink-700">
            Restaurants, London
            <span className="text-ink-600">
              {" · "}
              {unit}
              {" · "}coverage {tier}
              {modelled ? " · modelled, not observed" : " · observed"}
            </span>
          </p>
          <ul className="mt-1 space-y-0.5">
            <li className="text-[11px] leading-snug text-ink-600">
              runs {lo} to {hi}, peak {peak?.month}, trough {trough?.month}
            </li>
            <li className="text-[11px] leading-snug text-ink-600">
              on a zero floor the shortest column is {sameness.toFixed(0)}% the
              height of the tallest, so eleven of the twelve differences live in
              the top {(100 - sameness).toFixed(0)}% of the drawing
            </li>
            <li className="text-[11px] leading-snug text-ink-600">
              the figures are an index, not money: no absolute monthly pounds
              exist anywhere in this repo to draw instead
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <Column
            letter="A"
            title="level, from zero"
            facts={[
              "the shape three of the five components use",
              `every column starts at zero, so ${sameness.toFixed(0)}% of each one carries no information`,
              `measured at 1280: the twelve columns span 33 to 49px of a 56px chart, so all twelve months differ inside a 16px band`,
              "modelled on kit/sections.tsx, which is div-based; the two other level charts distort with preserveAspectRatio none",
            ]}
          >
            <SeasonA months={months} />
          </Column>

          <Column
            letter="B"
            title="deviation from the year average"
            facts={[
              "the shape CityYearStrip uses, ratified 2026-08-08",
              "one hue both ways, darker the further from normal",
              "the whole drawing is the part that varies",
              "measured at 1280: the same twelve months span 1.2 to 38 units, using the full height rather than a sixteenth of it",
            ]}
          >
            <SeasonB months={months} />
          </Column>

          <Column
            letter="C"
            title="level, with the average drawn"
            facts={[
              "nothing in the repo does this today",
              "keeps the level reading and marks where normal sits",
              "the dashed line is the only accent",
            ]}
          >
            <SeasonC months={months} />
          </Column>
        </div>
      </section>

      <footer className="relative mt-4 border-t border-paper-400 pt-4">
        {/* typography-ok: harness chrome, see the note on the h1 above */}
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-900">
          What this page cannot show you
        </h2>
        <ul className="mt-2 max-w-[80ch] space-y-1 text-[12px] leading-relaxed text-ink-700">
          <li>
            A narrow-range trade, which is the case where B would be noise and A
            would be honest. No such series exists in this repo, so the strongest
            argument against B cannot be put on this page.
          </li>
          <li>
            Whether this series is true. It is marked modelled and thin by its own
            record: a trade seasonal shape, not an observation of these
            restaurants.
          </li>
          <li>
            The two level implementations this page does not reproduce both use
            <code className="px-1 text-[12px]">preserveAspectRatio=&quot;none&quot;</code>,
            which stretches the drawing on one axis. That is a defect already on
            the backlog, not a candidate, so A is modelled on the third.
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
