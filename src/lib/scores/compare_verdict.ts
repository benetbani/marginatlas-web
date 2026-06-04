/**
 * src/lib/scores/compare_verdict.ts
 *
 * The comparison-page opinionated read (bible Section 5, the Comparison page
 * row: "[Industry] in [city A] vs [city B]", whose job is a DECISION, not two
 * columns of numbers, and whose distinctive move is to surface where the
 * margin goes rather than leave a generic table).
 *
 * This is the side-by-side sibling of the cell-page verdict
 * (src/lib/scores/verdict.ts) and the place verdict
 * (src/lib/scores/geo_verdict.ts). Same voice, straight from the bible
 * (Section 25): blunt, practical, skeptical of easy money. The hard rule
 * holds, never frame an option as the easy win without naming what the
 * headline number leaves out.
 *
 * It invents NO numbers. The compare page loads, per slot, only a compact
 * cell: typical (median) revenue, the bottom-ten / top-ten spread, the wage a
 * firm pays per employee, the headcount, and a data-quality score. There is no
 * cost structure and no net margin in that payload, so this module does NOT
 * fabricate a cost waterfall. Instead it reads the honest signal the data does
 * carry: which option turns over more at the typical firm, how much the typical
 * number hides (the bottom-to-top spread), and what each option pays its
 * staff. Every clause self-omits when its input is missing.
 *
 * Pure module: no Supabase, no other domain modules at runtime. Trivially
 * testable, and it cannot trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */

/** The slice of a compared option this module reasons over. */
export interface CompareSide {
  /** Stable index of the slot on the page, used only as a tiebreaker key. */
  index: number;
  /** Place label as the page shows it, e.g. "California" or "Texas". */
  place: string;
  /** Activity label, e.g. "Restaurants". */
  industry: string;
  /** Typical (median) annual revenue per firm in the display currency, or null. */
  typical: number | null;
  /** Bottom-ten-percent revenue per firm, or null. */
  p10: number | null;
  /** Top-ten-percent revenue per firm, or null. */
  p90: number | null;
  /** Annual wage a firm pays per employee, or null. */
  wagePerEmployee: number | null;
  /** Data-quality score 0 to 100, or null. */
  quality: number | null;
}

/** One labelled win, used to render the "who wins on what" strip. */
export interface CompareWin {
  /** Short metric label, e.g. "Typical revenue". */
  metric: string;
  /** The winning slot index. */
  winnerIndex: number;
  /** Plain place + activity name of the winner, for the copy line. */
  winnerName: string;
  /** One blunt clause of what the win means and what it does not. */
  reading: string;
}

export interface CompareVerdict {
  /** Short, declarative headline framing the decision. */
  headline: string;
  /**
   * One or two sentences naming which option leads on the figures that exist
   * and the caveat that revenue is not take-home.
   */
  lead: string;
  /** Closing line: the blunt condition that actually decides the call. */
  close: string;
  /** The per-metric wins that were computable (may be empty). */
  wins: CompareWin[];
}

// ----------------------------------------------------------------------------
// helpers
// ----------------------------------------------------------------------------

function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

function nameOf(s: CompareSide): string {
  return `${s.place} ${s.industry.toLowerCase()}`;
}

/** Spread ratio: how many times the top-ten firm out-earns the bottom-ten. */
function spreadRatio(s: CompareSide): number | null {
  if (!isNum(s.p10) || !isNum(s.p90) || s.p10 <= 0) return null;
  return s.p90 / s.p10;
}

/**
 * Pick the side that maximises a value, but only when the field is present on
 * at least two sides and the leader is meaningfully ahead (a few percent), so
 * we never crown a "winner" that is really a tie.
 */
function leaderBy(
  sides: CompareSide[],
  pick: (s: CompareSide) => number | null,
  edge = 0.04,
): { winner: CompareSide; runnerUp: CompareSide } | null {
  const present = sides
    .map((s) => ({ s, v: pick(s) }))
    .filter((r): r is { s: CompareSide; v: number } => isNum(r.v));
  if (present.length < 2) return null;
  present.sort((a, b) => b.v - a.v);
  const top = present[0];
  const next = present[1];
  if (top.v <= 0) return null;
  if ((top.v - next.v) / top.v < edge) return null;
  return { winner: top.s, runnerUp: next.s };
}

// ----------------------------------------------------------------------------
// public entry point
// ----------------------------------------------------------------------------

export function generateCompareVerdict(rawSides: CompareSide[]): CompareVerdict {
  // Only sides that carry a typical revenue are real comparands; a slot with
  // no revenue is an empty picker, not an option.
  const sides = rawSides.filter((s) => isNum(s.typical));

  const wins: CompareWin[] = [];

  // --- where the money is: typical revenue ---
  const revLead = leaderBy(sides, (s) => s.typical);
  if (revLead) {
    const w = revLead.winner;
    const ratio =
      isNum(w.typical) && isNum(revLead.runnerUp.typical) && revLead.runnerUp.typical > 0
        ? w.typical / revLead.runnerUp.typical
        : null;
    const by =
      ratio != null && ratio >= 1.15
        ? `about ${ratio >= 2 ? Math.round(ratio) : ratio.toFixed(1)}x the next option`
        : "the most of any option here";
    wins.push({
      metric: "Typical revenue",
      winnerIndex: w.index,
      winnerName: nameOf(w),
      reading: `Turns over ${by} at the typical firm. More top line, not more take-home: the cost stack still decides what an owner keeps.`,
    });
  }

  // --- what it pays staff: wage per employee ---
  const wageLead = leaderBy(sides, (s) => s.wagePerEmployee, 0.06);
  if (wageLead) {
    const w = wageLead.winner;
    wins.push({
      metric: "Pays staff",
      winnerIndex: w.index,
      winnerName: nameOf(w),
      reading: `Pays the most per employee. Good for hiring, heavier on payroll, so the wage bill eats more of each sale.`,
    });
  }

  // --- how predictable the typical number is: the narrower spread "wins" ---
  // A tighter bottom-to-top spread means the median is a more honest guide;
  // a wide one means the typical figure hides a lot. Lower ratio is better, so
  // we lead on the negated ratio.
  const tightLead = leaderBy(
    sides,
    (s) => {
      const r = spreadRatio(s);
      return r != null ? -r : null;
    },
    0.08,
  );
  if (tightLead) {
    const w = tightLead.winner;
    wins.push({
      metric: "Most predictable",
      winnerIndex: w.index,
      winnerName: nameOf(w),
      reading: `The gap between the weakest and strongest firms is narrower here, so the typical number is a safer guide to what you would actually see.`,
    });
  }

  // --- headline + lead ---
  let headline: string;
  let lead: string;
  if (revLead) {
    const w = revLead.winner;
    const sameWinnerEverywhere =
      wins.length >= 2 && wins.every((x) => x.winnerIndex === w.index);
    headline = sameWinnerEverywhere
      ? `${w.place} leads, but read the catch`
      : "No clean winner. It depends what you optimise for";
    if (sameWinnerEverywhere) {
      lead = `On the numbers that exist, ${nameOf(
        w,
      )} comes out ahead on more than one front. That still does not make it the safe pick: a bigger top line and a fatter wage bill can leave an owner with less than a quieter option on a lighter cost base.`;
    } else {
      lead = `${nameOf(
        w,
      )} turns over the most, but the option that pays best or reads most predictably is not the same one. Pick for the thing that decides your year, not the biggest revenue number.`;
    }
  } else if (sides.length >= 2) {
    headline = "Too close to call on revenue";
    lead = `These options turn over within a hair of each other at the typical firm. The deciding factor is not the top line: it is what each one pays, how wide the spread runs, and the cost base you bring to it.`;
  } else if (sides.length === 1) {
    headline = "Only one option has data so far";
    lead = `Pick a second country and activity above to put a real choice next to this one. A single column is a fact, not a decision.`;
  } else {
    headline = "Nothing to compare yet";
    lead = `Choose a country and an activity for at least two of the slots above, and the decision shows up here.`;
  }

  // --- close: the blunt condition that decides it ---
  let close: string;
  if (sides.length >= 2) {
    const anyWideSpread = sides.some((s) => {
      const r = spreadRatio(s);
      return r != null && r >= 4;
    });
    if (anyWideSpread) {
      close = `On at least one of these, the strongest firms out-earn the weakest several times over. That much spread means who runs it matters more than which option you pick. Treat the typical number as a starting line, not a promise.`;
    } else {
      close = `None of this is automatic. The same activity rewards a disciplined operator on a sensible rent and quietly punishes one who overpays for the lease. Pick the option for the margin you can hold, not the revenue you can imagine.`;
    }
  } else {
    close = `Open either full page below for the cost stack and the spread that exist behind the headline number.`;
  }

  return { headline, lead, close, wins };
}
