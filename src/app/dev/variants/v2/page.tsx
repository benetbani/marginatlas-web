/**
 * /dev/variants/v2 , THE SINGLE SCORE. Three versions, real computed ratings.
 *
 * Internal, noindex, not linked publicly. The founder picks; nothing here ranks
 * the three versions or recommends one.
 *
 * THE SCORES ARE REAL AND COMPUTED AT RENDER, not copied. Every rating below
 * comes from `computeBreakInRating`, the same module the live surfaces call, fed
 * with London's curated owner take-home and the same modelled entry capital,
 * permits, weeks-to-open and density archetypes the cell masthead uses. Twenty
 * activities, so the peer set is the real distribution of London scores rather
 * than a chosen handful.
 *
 * WHAT THIS PAGE CANNOT DISTINGUISH, stated because the numbers get quoted: a
 * score whose sub-scores were computed from real inputs from one where an input
 * was unknown and fell back to the module's NEUTRAL_SUBSCORE of 50. The output
 * is a number either way and nothing on any of the three versions says which.
 */
import * as React from "react";
import type { Metadata } from "next";

import { ScoreBand } from "@/components/kit/charts/ScoreBand";
import { computeBreakInRating } from "@/lib/scores/break_in_rating";
import { LONDON_MARKET } from "@/lib/london/market";
import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";
import { placeAdjustedPermitsUsd, timeToOpenWeeks } from "@/lib/markets/opening_archetypes";
import { densityArchetypePer10k } from "@/lib/markets/density_archetypes";
import { getCityCostOfLivingIndex } from "@/lib/cities/city_tier";

import { BulletScore } from "./variants";

export const metadata: Metadata = {
  title: "V2 the single score (internal)",
  robots: { index: false, follow: false },
};

/** The four bands the rating module itself coarsens to. */
const BANDS = [
  { upTo: 39, word: "brutal" },
  { upTo: 59, word: "demanding" },
  { upTo: 74, word: "manageable" },
  { upTo: 100, word: "forgiving" },
];

/** Few caps qualitative ranges at five and prefers three. */
const BULLET_BANDS = [
  { upTo: 45, word: "hard to break into" },
  { upTo: 70, word: "middling" },
  { upTo: 100, word: "easier to break into" },
];

type Row = {
  slug: string;
  name: string;
  score: number;
  band: string;
  takeHome: number;
  restsOnModeled: boolean;
};

function title(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildRows(): Row[] {
  const cost = getCityCostOfLivingIndex("london");
  const acts = (LONDON_MARKET as unknown as {
    activities: Record<string, { economics?: { owner_take_home?: number } }>;
  }).activities;

  const out: Row[] = [];
  for (const [slug, entry] of Object.entries(acts)) {
    const takeHome = entry?.economics?.owner_take_home;
    if (typeof takeHome !== "number" || !Number.isFinite(takeHome)) continue;
    const rating = computeBreakInRating({
      startupCapitalUsd: placeAdjustedStartupCapital({
        industryId: slug,
        costOfLivingIndex: cost,
        avgYearlySalary: null,
      }),
      permitsUsd: placeAdjustedPermitsUsd({
        industryId: slug,
        costOfLivingIndex: cost,
        avgYearlySalary: null,
      }),
      annualOwnerTakeHomeUsd: takeHome,
      timeToOpenWeeks: timeToOpenWeeks(slug),
      densityPer10k: densityArchetypePer10k(slug),
      restsOnModeled: true,
    });
    if (!rating) continue;
    out.push({
      slug,
      name: title(slug),
      score: rating.score,
      band: rating.band,
      takeHome,
      restsOnModeled: rating.restsOnModeled,
    });
  }
  return out.sort((a, b) => b.score - a.score);
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

export default function V2Page() {
  const rows = buildRows();
  const peers = rows.map((r) => r.score);
  const median = peers.length ? peers[Math.floor(peers.length / 2)] : null;
  const spread = peers.length ? `${peers[peers.length - 1]} to ${peers[0]}` : "none";

  const cases = [
    { state: "TYPICAL, a score in the middle of the pack", row: rows[Math.floor(rows.length / 2)] },
    { state: "EXTREME, the highest score in the set", row: rows[0] },
    { state: "EXTREME, the lowest score in the set", row: rows[rows.length - 1] },
  ].filter((c) => c.row);

  return (
    <div className="relative mx-auto max-w-[1400px] px-6 py-10">
      <header className="relative mb-8 border-b border-paper-400 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
          Variant review, V2
        </p>
        {/* typography-ok: review harness chrome, deliberately neutral so the page
            typography does not compete with the three candidates being judged */}
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">The single score</h1>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-700">
          Five surfaces on this site plot a score against a fixed scale and a band
          word, and none of them shows another place&rsquo;s score for the same
          thing, although the data exists. The decision is whether a score may
          stand alone.
        </p>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-700">
          All {rows.length} scores below are computed at render by the same module
          the live pages call, from London&rsquo;s curated owner take-home and the
          same modelled entry capital, permits, weeks and density the cell
          masthead uses. The peer set is every one of them, not a chosen handful.
          Observed range {spread}, median {median}.
        </p>
      </header>

      {cases.map(({ state, row }) => (
        <section key={row.slug} className="relative mb-12">
          <div className="mb-3">
            {/* typography-ok: harness chrome, see the note on the h1 above */}
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-900">
              {state}
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-700">
              {row.name}, London
              <span className="text-ink-600">
                {" · "}score {row.score} of 100 {"· "}band &ldquo;{row.band}&rdquo;
                {" · "}owner take-home ${row.takeHome.toLocaleString("en-US")}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Column
              letter="A"
              title="what ships today"
              facts={[
                "the score, a band word, and a fixed 0 to 100 scale",
                "no other place's score is shown",
                "a reader cannot answer “is that good” without leaving the component",
              ]}
            >
              <ScoreBand
                score={row.score}
                label="Break-in rating"
                outOf={100}
                bands={BANDS}
                eyebrow="How hard it is to get in"
              />
            </Column>

            <Column
              letter="B"
              title="the same component, peers passed"
              facts={[
                `${peers.length} peer scores drawn as hairlines on the same track`,
                "no new component: ScoreBand has always accepted this prop",
                `the peers observed run ${spread}`,
                "measured: A and B render at the same height, so the peers cost no extra space",
              ]}
            >
              <ScoreBand
                score={row.score}
                label="Break-in rating"
                outOf={100}
                bands={BANDS}
                peers={peers}
                eyebrow="How hard it is to get in"
              />
            </Column>

            <Column
              letter="C"
              title="bullet graph, three ranges, one marker"
              facts={[
                "three qualitative ranges as intensities of one hue, darkest hardest",
                `one perpendicular marker: the median of the ${peers.length}, at ${median}`,
                "the measure is a single bar from zero",
              ]}
            >
              <BulletScore
                score={row.score}
                outOf={100}
                label="Break-in rating"
                bands={BULLET_BANDS}
                comparative={median}
                comparativeLabel="the London median"
              />
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
            Whether a score was computed from real inputs or fell back to the
            module&rsquo;s neutral 50 for an unknown one. The output is a number
            either way and none of the three versions says which.
          </li>
          <li>
            The peers here are twenty trades in one city. A peer set of the same
            trade across cities would answer a different question, and this page
            does not show that one.
          </li>
          <li>
            Roughly a quarter of this score is the same in every city. Weeks to
            open is a per-trade constant carrying 24% of the weight, so a
            comparison across places is partly a comparison of a constant.
          </li>
          <li>
            On the middle row the score and the median are both 55, so C&rsquo;s
            marker lands exactly at the end of its own bar. That is a real
            coincidence of this data, not a drawing error, and it is what the
            comparison looks like when a place sits on the median.
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
