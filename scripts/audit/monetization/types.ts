/**
 * Shared types for the v34 monetization-coverage audit framework.
 *
 * Five gates per page pattern (see docs/strategy/2026-05-25-
 * monetization-mega-plan-v34.md Part 5.4):
 *
 *   [A] lock primitives present
 *   [B] trust copy present
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
 *   - PENDING = the gate is not yet wired (no-op stub; not a fail)
 *
 * Phase 0Q ships every gate as PENDING. As Phases A through E
 * land, each gate flips to GREEN / RED.
 */

export type GateStatus = "GREEN" | "RED" | "PENDING";

export type GateName =
  | "A_lock_primitives"
  | "B_trust_copy"
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
  "B_trust_copy",
  "C_no_orphan_locks",
  "D_no_leaked_values",
  "E_four_thing_reveal",
];

export function pending(message = "not yet wired (Phase 0Q stub)"): GateResult {
  return { status: "PENDING", message };
}
