/**
 * THE INDUSTRY PAGE'S OPENING (MODEL.md 8.7; plan step 34's first dispatch,
 * 2026-09-18): `00 take` on the answer card, then the band `01 lasts | 02
 * benchmark`. The cards draw what their builders hand them and compose
 * nothing of their own; the view seats them (industry-view.tsx).
 *
 * `00 take` (Masthead): the AnswerCard archetype in its trade identity
 * variant (the trade's icon tile in the flag's seat, the sector as the crumb
 * under the h1), the net of every $100 at 40 in `--terra-text`, THE PAGE'S
 * ONLY 40 (8.7's seat one), off THE ONE NET BUILDER through
 * industry_hero_facts.ts (trade_net.ts with the engine absent, R7); the
 * three companions on the docked KvGrid; the foot the coverage line. The
 * old masthead (the keeps-per-$100 count-up off `margin_index`, the prose
 * sentence beside it, the margin ladder box `#ladder` off the margins file
 * with its own sample tag, the provenance line) left with this dispatch:
 * `00` prints the one builder's figure where the old card printed the
 * margins file's clamped net with a silent 5% default on 39 trades (8.7:
 * "the default branch in adapt_industry.ts dies").
 *
 * `01 lasts` is the trade page's own LastsCard (cell/turn-two.tsx) off the
 * same builder at the world altitude (lasts_rows.ts): one card, one builder,
 * two pages. The old Survival card (the SurvivalCurve off the London file's
 * archetype, `getActivitySurvivalArchetype`, 20 of 243) left with this
 * dispatch: R5 bans the slope, the shard holds the triple for 243, and
 * "never the 20-activity London file alone" is 8.7's own row.
 *
 * `02 benchmark` (BenchmarkCard): RankedBars with the set's own ceiling over
 * benchmark_rows.ts, the sector's members ranked on the one builder's net,
 * the trade among them, the pill on the leader; the withheld state (none or
 * one member holding a figure; twelve trades, every one retired, so no live
 * route reaches it) stands on BentoMetric with the stated line where the
 * rows would, the trade page's idiom for a withheld card. The old
 * Benchmark (`#kept`, the LollipopColumn over `foodDrinkSiblings()`'s eight
 * food ids with the atlas median as a dashed rule and a computed finding
 * sentence) left with this dispatch, and the hardcoded list with it.
 */
import * as React from "react";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { COPY } from "@/lib/spine/copy";
import { netText } from "@/lib/spine/trade_net";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import type { IndustryHeroFacts } from "@/lib/spine/industry_hero_facts";
import { placeText, type BenchmarkData } from "@/lib/spine/benchmark_rows";

export function Masthead({ id = "take", facts }: { id?: string; facts: IndustryHeroFacts | null }) {
  if (!facts) return null;
  return <AnswerCard id={id} name={facts.name} tile={facts.tile} crumb={facts.crumb} subtitle={null} answer={facts.answer} answerBar={facts.answerBar} absent={facts.absent} cells={facts.cells} tone="accent" foot={facts.foot} answers={SURFACE_ANSWERS.industry} />;
}

export function BenchmarkCard({ id = "benchmark", benchmark }: { id?: string; benchmark: BenchmarkData | null }) {
  if (!benchmark) return null;
  if (benchmark.state === "withheld") {
    /* The trade page's idiom for a card whose figure is withheld (`04 open`
       on the archetype's default): BentoMetric with the stated line at the
       lead rung where the figure would stand, unaccented, the basis under
       it; every shard figure is modelled (R12), so the opener's mark is on,
       behind his switch. */
    return <BentoMetric id={id} icon="benchmark" kicker={COPY.industryBenchmark.kicker} sample withheld={benchmark.line ?? undefined} basis={benchmark.basis} />;
  }
  return (
    <RankedBars
      id={id}
      icon="benchmark"
      kicker={COPY.industryBenchmark.kicker}
      tagged
      basis={benchmark.basis}
      withheldLine={benchmark.line}
      focal={benchmark.rank != null ? { figure: placeText(benchmark.rank), words: benchmark.rankWords ?? "" } : undefined}
      rows={benchmark.rows}
      worldMax={benchmark.top}
      ceiling="set"
      best="max"
      feature="leader"
      topLabel={COPY.industryBenchmark.topLabel}
      fmt={netText}
      phoneHead={{ name: COPY.margin.phoneHead.trade, value: COPY.margin.phoneHead.value }}
    />
  );
}
