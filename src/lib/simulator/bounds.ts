/**
 * src/lib/simulator/bounds.ts , EACH LEVER'S RANGE (plan 2026-10-13 cost-simulator, Task 4A; spec section 3: "an unknown lever is ignored, one out of
 * range clamped"). In the base currency (pounds for a UK place, dollars elsewhere); shares as decimals. The profit goal and the owner's pay stop at
 * 250,000: the law's best company salary is searched in steps of 250 (take_home.ts), so the goal's search grows with it. 2,000 m2 at 5,000 a m2
 * puts a rateable value past the law's 500,000, which the engine answers with its rule, never a throw.
 */
import type { LeverKey } from "./bundle";

export const BOUNDS: Record<LeverKey, { min: number; max: number; step: number }> = {
  area: { min: 5, max: 2000, step: 1 },
  rent: { min: 0, max: 5000, step: 1 },
  service: { min: 0, max: 1000, step: 1 },
  oncost: { min: 0, max: 0.6, step: 0.005 },
  sales: { min: 0, max: 20_000_000, step: 1000 },
  ticket: { min: 0, max: 1000, step: 0.5 },
  goods: { min: 0, max: 0.95, step: 0.005 },
  runShare: { min: 0, max: 0.6, step: 0.005 },
  owner: { min: 0, max: 250_000, step: 500 },
  target: { min: 0, max: 250_000, step: 500 },
  loanAmount: { min: 0, max: 2_000_000, step: 500 },
  loanRate: { min: 0, max: 30, step: 0.1 },
  loanYears: { min: 1, max: 30, step: 1 },
  opening: { min: 0, max: 5_000_000, step: 500 },
};
export const HEADS_MAX = 50;
export const PAY_MAX = 300_000;

export const clampTo = (k: LeverKey, x: number): number => Math.min(BOUNDS[k].max, Math.max(BOUNDS[k].min, x));
