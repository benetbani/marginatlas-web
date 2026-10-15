/**
 * src/lib/spine/owner_direction.ts , WHICH WAY IS EASIER FOR AN OWNER, ONCE PER MEASURE (plan 2026-10-13 country-page-journey, Task 1A;
 * spec E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md, section 4; his ruling of 2026-10-13 on the signal).
 *
 * The signal (src/lib/spine/signal.ts, src/components/spine/signal/Signal.tsx) draws beside a figure placed among the countries whose
 * measure is named here with a direction: "lower" (lower is easier: fewer days, lower fees and tax, cheaper power and credit, less
 * bribery and waiting) or "higher" (higher is easier: more firms lasting, easier hiring, a cleaner score). "none" draws no mark (salary,
 * customer pay, the wage floor: no single owner direction). A measure the page places and this table does not name is a red of the
 * signal-marks gate: it is named here, with its reading, before it prints. `spec` quotes the line of the spec's table each row reads.
 */
export type OwnerDirection = "lower" | "higher" | "none";

export const OWNER_DIRECTION = {
  "tax-on-profit": { direction: "lower", spec: "Tax on profit: lower" },
  "employer-oncost": { direction: "lower", spec: "employer on-cost share: lower" },
  "register-cost": { direction: "lower", spec: "cost to register: lower" },
  "card-fees": { direction: "lower", spec: "card fees: lower" },
  "lending-rate": { direction: "lower", spec: "lending rate: lower" },
  electricity: { direction: "lower", spec: "electricity and diesel prices: lower" },
  diesel: { direction: "lower", spec: "electricity and diesel prices: lower" },
  "register-days": { direction: "lower", spec: "Days to register: fewer, shorter" },
  "time-to-sell": { direction: "lower", spec: "time to sell a business: fewer, shorter" },
  "time-to-discharge": { direction: "lower", spec: "time to be freed after a failure: fewer, shorter" },
  "enforce-days": { direction: "lower", spec: "days to enforce a contract: fewer, shorter" },
  "firms-year-five": { direction: "higher", spec: "Firms still trading at year five: more" },
  "hiring-ease": { direction: "higher", spec: "Hiring ease: easier" },
  "tax-predictability": { direction: "higher", spec: "tax predictability: more predictable" },
  bribery: { direction: "lower", spec: "Bribery met in dealings: less" },
  "official-wait": { direction: "lower", spec: "waiting time with officials: less" },
  "clean-dealing": { direction: "higher", spec: "Bribery met in dealings: less, read on the clean-dealing score, where 100 is clean, so a higher score is less bribery" },
  "customer-pay": { direction: "none", spec: "Customer pay: no mark (no single owner direction)" },
  salary: { direction: "none", spec: "salaries: no mark (no single owner direction)" },
  "wage-floor": { direction: "none", spec: "the wage floor: no mark (no single owner direction)" },
  "household-spend": { direction: "none", spec: "household spend shares: no mark (no single owner direction)" },
  population: { direction: "none", spec: "population: no mark (no single owner direction)" },
  "admin-ease": { direction: "higher", spec: "not in the spec's table: higher is easier for an owner, his reading of 2026-10-13 (plan 2026-10-13 country-page-journey, Q3), as hiring ease and tax predictability read" },
  "cost-of-living": { direction: "none", spec: "not in the spec's table: no mark, no single owner direction (plan 2026-10-13 country-page-journey, Q3, ruled 2026-10-13)" },
} as const satisfies Record<string, { direction: OwnerDirection; spec: string }>;

export type MeasureKey = keyof typeof OWNER_DIRECTION;

export function directionOf(measure: MeasureKey): OwnerDirection {
  return OWNER_DIRECTION[measure].direction;
}
