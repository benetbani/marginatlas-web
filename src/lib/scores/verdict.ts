/**
 * src/lib/scores/verdict.ts
 *
 * The hero verdict: the one opinionated paragraph at the top of an entity
 * page that tells the reader, in plain words, whether the business works
 * here and what would break it.
 *
 * Voice is straight from the bible (Section 25): blunt, practical, skeptical
 * of easy money. The hard rule: never call something a good opportunity
 * without saying what can kill it. So every verdict names an upside AND a
 * risk drawn from the actual scores, not generic filler.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { Cell } from "@/lib/cells";
import type { Score, ScoreId, ScoreSet } from "@/lib/scores";

export interface Verdict {
  /** Short, declarative headline. */
  headline: string;
  /** One or two sentences: the upside and the thing that can break it. */
  lead: string;
  /** Closing line tying the verdict to the revenue reality. */
  close: string;
}

function defaultUsd(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function headlineFor(band: string): string {
  switch (band) {
    case "strong":
      return "A business that can actually pay here";
    case "workable":
      return "Workable, if you run it tight";
    case "mixed":
      return "It can work, but it is not forgiving";
    case "weak":
      return "Hard to make this pay here";
    default:
      return "The numbers fight you here";
  }
}

const UPSIDE: Record<ScoreId, string> = {
  profitability: "the margins are genuinely healthy",
  rent: "rent stays out of the way",
  owner_take_home: "it can actually support an owner",
  market: "there is real room to enter",
  opportunity: "the overall economics hold up",
};

const RISK: Record<ScoreId, string> = {
  profitability: "the margins leave little room for mistakes",
  rent: "rent is the thing most likely to break it",
  owner_take_home: "the owner take is thin unless volume beats typical",
  market: "the market is already crowded",
  opportunity: "the economics are fragile",
};

/** A single-score fallback clause when there is nothing to contrast. */
function soloClause(s: Score): string {
  switch (s.band) {
    case "strong":
    case "workable":
      return cap(UPSIDE[s.id]) + ".";
    default:
      return cap(RISK[s.id]) + ".";
  }
}

export function generateVerdict(
  cell: Cell,
  scoreSet: ScoreSet,
  fmt: (n: number) => string = defaultUsd,
): Verdict {
  const components = scoreSet.scores;
  const anchor = scoreSet.opportunity ?? components[0] ?? null;
  const headline = headlineFor(anchor?.band ?? "mixed");

  // Best and worst component drive the upside / risk contrast.
  let lead: string;
  if (components.length >= 2) {
    const sorted = [...components].sort((a, b) => b.value - a.value);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    if (best.id === worst.id) {
      lead = soloClause(best);
    } else {
      lead = `${cap(UPSIDE[best.id])}, but ${RISK[worst.id]}.`;
    }
  } else if (components.length === 1) {
    lead = soloClause(components[0]);
  } else {
    lead = "The economics here are estimated from related markets, so treat them as a direction, not a promise.";
  }

  // Closing line: anchor the verdict to the revenue reality and the spread,
  // because on most of these pages the operator matters more than the place.
  const median = cell.rev_p50 ?? cell.revenue_per_firm ?? null;
  const p10 = cell.rev_p10 ?? null;
  const p90 = cell.rev_p90 ?? null;
  let close: string;
  if (median != null && Number.isFinite(median)) {
    const wideSpread =
      p10 != null && p90 != null && p10 > 0 && p90 / p10 >= 4;
    if (wideSpread) {
      close = `Typical revenue is about ${fmt(median)}, and the gap between the weakest and strongest operators is wide. Who runs it matters more than where it sits.`;
    } else {
      close = `Typical revenue is about ${fmt(median)}. The operator, not the average, decides where this lands.`;
    }
  } else {
    close = "The operator, not the average, decides where this lands.";
  }

  return { headline, lead, close };
}
