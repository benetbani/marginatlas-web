/**
 * THE COST SIMULATOR, /calculator (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, the page phone first). Its body is one client component
 * (CalculatorClient.tsx): the levers recompute in the browser, a place switch fetches its defaults from /api/calculator. Drawn by
 * src/app/(site)/calculator/page.tsx and the harness surface `calculator` (page `calculator-gb-london-restaurants`).
 */
import * as React from "react";
import { CalculatorClient } from "./CalculatorClient";
import type { CalculatorSeed } from "@/lib/simulator/seed";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE LOUD MOMENTS (MODEL.md PART 6; the spec's section 4 and R7 4.6): the sales to break even a month, the page's one 40, in terracotta; the sales
 * each 100 of fixed costs needs, at 30, the moves' focal, whose fill the largest move's bar follows; the money to open it holds no honest third.
 * Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "answer", id: "answer", figure: "the sales to break even a month, the page's one 40", state: "LIT", condition: "plan 2026-10-13 cost-simulator, Task 4B (spec section 4, item 2): `--terra-text` at 40 in the answer section; unlit where the break-even waits for an input, its reason standing in its place" },
  { seat: 2, card: "moves", id: "moves", figure: "the sales each 100 of fixed costs needs, at 30, beside the largest move's terracotta bar", state: "LIT", condition: "plan 2026-10-13 cost-simulator, Task 4B (R7 4.6, the largest bar the one other terracotta): RankedBars' focal accent, the leader's bar following it (PART 6); not drawn where no move can be worked out" },
  { seat: 3, card: "opening", figure: "none: the months to pay back rank nothing", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-13 cost-simulator, Task 4B: the payback is the reader's own arithmetic, not a measured standing; the page ends quiet (MODEL PART 6)" },
] as const satisfies readonly LoudSeat[];

export function SpineCalculatorBody({ data }: { data: CalculatorSeed }) {
  return <CalculatorClient seed={data} />;
}
