/**
 * src/lib/scores/index.ts
 *
 * The band vocabulary: a 0 to 100 score turned into one of five words.
 *
 * WHAT THIS FILE WAS, AND WHY IT SHRANK, 2026-08-20. It held `computeScores`,
 * the proprietary five-score blend from the Reformation bible, plus its value
 * functions, its blurb writers, its label map and the Founder Opportunity
 * blend: 408 lines. An architecture review established that `computeScores`
 * had **zero callers**. The cell page's own comment records why, at
 * `src/app/[country]/[geo]/[industry]/page.tsx:614`: the multi-part opportunity
 * strip "no longer feeds this page's masthead". It said the module "still
 * serves the surfaces that use it", and there were none.
 *
 * So roughly 380 lines served one dead function, and the whole live interface
 * of this module was one type and one five-line predicate, both consumed by a
 * single component. That is what remains below. Nothing else about the banding
 * changed.
 *
 * THE BAND RULE, carried from the bible unchanged: 80+ strong, 60-79 workable,
 * 40-59 mixed, 20-39 weak, below 20 avoid. Higher always means MORE FAVOURABLE
 * for the operator, which is why the bible's "Rent Pressure" and "Market
 * Saturation" were framed as "Rent headroom" and "Market room" wherever they
 * were computed: high score meant low pressure. Only the sign was ever fixed,
 * so the 80-is-strong banding stays internally consistent.
 *
 * WHAT WENT WITH IT, recorded so nobody looks for it: `computeScores`,
 * `bandWord`, the `Score` / `ScoreSet` / `ScoreContext` / `ScoreId` types, the
 * profitability, rent-headroom and owner-take-home value functions, the five
 * blurb writers, `LABELS`, `pushScore`, `blendOpportunity`, `clamp` and
 * `piecewise`. All had zero external references. The HIDE WEAKNESS rule they
 * implemented, that a score is returned only when it can be computed and is
 * omitted silently otherwise, is the same self-omission rule the rest of the
 * site follows and is not lost with them.
 *
 * The one consumer is `src/components/board/ScoreStrip.tsx`, which imports
 * exactly `{ bandOf, type ScoreBand }`.
 *
 * Pure module: no Supabase, no I/O, no imports at all now, so it stays
 * trivially testable and cannot trip the layering gate.
 */

/** The five words a score can read as. Higher is always more favourable. */
export type ScoreBand = "strong" | "workable" | "mixed" | "weak" | "avoid";

/**
 * Map a 0 to 100 score onto its band. Thresholds are the bible's and are not
 * a tuning knob: they are what makes "strong" mean the same thing on every
 * surface that prints it.
 */
export function bandOf(value: number): ScoreBand {
  if (value >= 80) return "strong";
  if (value >= 60) return "workable";
  if (value >= 40) return "mixed";
  if (value >= 20) return "weak";
  return "avoid";
}
