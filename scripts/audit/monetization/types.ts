/**
 * Shared types for the v34 monetization-coverage audit framework.
 *
 * Five gates per page pattern (see docs/strategy/2026-05-25-
 * monetization-mega-plan-v34.md Part 5.4):
 *
 *   [A] lock primitives present
 *   [B] no pop-up (his ruling 22 of 2026-09-26; masterplan step 13)
 *   [C] no orphan locks (every lock has a defined click handler)
 *   [D] no leaked values (gated numbers don't appear as plain
 *       text in the rendered DOM)
 *   [E] four-thing reveal complete (what / when / why / why-credible)
 *
 * Each page-check returns a PageCheckResult; the orchestrator
 * aggregates them into CoverageReport and the prebuild gate
 * fails if any gate is RED.
 *
 * Status semantics:
 *   - GREEN  = the page passes the gate
 *   - RED    = the page fails the gate (hard block)
 *   - PENDING = the gate cannot judge the page (the prebuild gate fails
 *               on it since 2026-10-06; it was a passing stub in Phase 0Q)
 *
 * Phase 0Q shipped every gate as PENDING. As Phases A through E
 * landed, each gate flipped to GREEN / RED; the last ten stubs were
 * given rules on 2026-10-06.
 */

export type GateStatus = "GREEN" | "RED" | "PENDING";

export type GateName =
  | "A_lock_primitives"
  | "B_no_popup"
  | "C_no_orphan_locks"
  | "D_no_leaked_values"
  | "E_four_thing_reveal";

export type GateResult = {
  status: GateStatus;
  message: string;
  evidence?: string;
};

export type PageCheckResult = {
  pageId: string;
  pagePattern: string;
  /** The page's source file, repo-relative, when the check read one; the red names it. */
  sourceFile?: string;
  gates: Record<GateName, GateResult>;
};

export type CoverageReport = {
  generatedAt: string;
  planVersion: "v34";
  pages: PageCheckResult[];
  totals: {
    green: number;
    red: number;
    pending: number;
  };
};

export const ALL_GATES: GateName[] = [
  "A_lock_primitives",
  "B_no_popup",
  "C_no_orphan_locks",
  "D_no_leaked_values",
  "E_four_thing_reveal",
];

export function pending(message = "not yet wired (Phase 0Q stub)"): GateResult {
  return { status: "PENDING", message };
}
