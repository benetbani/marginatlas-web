/**
 * src/lib/uk/pnl/kinds.ts
 *
 * The four kinds of figure (CREDIBILITY.md, section 2), and the one rule for the kind of a figure computed from others:
 *
 *   counted     taken straight from an official UK register
 *   looked up   a price or a rule read on a named page on a date
 *   worked out  arithmetic on counted or looked-up figures, the method stated
 *   estimate    our judgement where no register exists, the basis stated
 *
 *   kindOf(f(x1..xn)) = estimate      if any input is an estimate
 *                     = worked out    otherwise, once any arithmetic is done (two or more inputs, or a transformation)
 *                     = kind(x1)      when the figure is one input passed through untouched
 *
 * So a figure can never claim more than its weakest input, and arithmetic never launders an estimate into "worked out".
 */
export type Kind = "counted" | "looked up" | "worked out" | "estimate";

export function combineKinds(inputs: readonly Kind[], transformed = true): Kind {
  if (inputs.length === 0) throw new Error("combineKinds: a figure needs at least one input");
  if (inputs.includes("estimate")) return "estimate";
  if (inputs.length === 1 && !transformed) return inputs[0];
  return "worked out";
}
