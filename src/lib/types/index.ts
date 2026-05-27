/**
 * src/lib/types/index.ts
 *
 * Central re-export of every domain type. Lets a newcomer answer
 * "where is the Cell shape defined?" with one `cmd-click` from any
 * file in the codebase.
 *
 * Convention: this module ONLY re-exports types. No new types should
 * be defined here. Each type's canonical home stays unchanged so
 * existing imports continue to work; this is a navigation index, not
 * a relocation.
 *
 * Added by the 2026-05-27 architecture audit
 * (docs/strategy/2026-05-27-architecture-audit.md, strategy C).
 */

// Cell shapes
export type { Cell, CellSelector } from "@/lib/cells";

// Deepening shapes (cost stack, setup costs, sub-industries, local aliases)
export type {
  CostStack,
  SetupCosts,
  SubIndustryRef,
  LocalAlias,
} from "@/lib/types/deepening";

// Country / economic profile
export type { CountryEconomicProfile } from "@/lib/economic_profile/types";

// Cost engine
export type { WaterfallLine, CostStructureResult, KeyBenchmark } from "@/lib/cost_engine/engine";

// Quality / plausibility
export type {
  PlausibilityFlag,
  PlausibilityFlags,
} from "@/lib/qa/plausibility_suppression";

// Check tool
export type {
  CheckInput,
  CheckVerdict,
  RatioVerdict,
  RatioStatus,
} from "@/lib/check/verdict_engine";

// AU primary data
export type { AuPrimaryAnchor } from "@/lib/economic_profile/au_primary_loader";

// Turnover band
export type { TurnoverBand } from "@/lib/finance/turnover_band";

// FX
export type { FxRate } from "@/lib/finance/fx";
