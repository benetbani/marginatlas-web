/**
 * src/lib/check/verdict_engine.ts
 *
 * Pure-function verdict engine for /check.
 *
 * Inputs: an operator's self-reported numbers (industry, annual
 * revenue, annual rent, annual labour cost, optional motor vehicle
 * spend).
 *
 * Output: a per-ratio verdict (above / below / in-range) against the
 * industry's typical band, a top-line "your biggest deviation is X"
 * sentence, and a colour code for the UI.
 *
 * No I/O. No HTML. No source-agency names (R-002). The engine is
 * fully testable in isolation.
 */

import {
  getKeyBenchmarkForIndustry,
  labelKeyBenchmark,
  type KeyBenchmark,
} from "@/lib/cost_engine/engine";
import icpJson from "../../../data/finance/industry_cost_profile_v1.json";
import industriesJson from "@/lib/taxonomy/industries.json";
import { classifyTurnoverBand, type TurnoverBand } from "@/lib/finance/turnover_band";

export type CheckInput = {
  /** Industry id from src/lib/taxonomy/industries.json. */
  industryId: string;
  /** Annual revenue (turnover) in USD. */
  revenueUsd: number;
  /** Annual rent / occupancy cost in USD. Optional. */
  rentUsd?: number;
  /** Annual labour cost (wages + employer side) in USD. Optional. */
  labourUsd?: number;
  /** Annual cost of sales (variable inputs ex-labour) in USD. Optional. */
  cogsUsd?: number;
  /** Annual motor vehicle cost in USD. Optional. */
  motorVehicleUsd?: number;
};

export type RatioStatus = "below" | "in_range" | "above" | "unknown";

export type RatioVerdict = {
  ratio: KeyBenchmark | "rent" | "labor" | "cogs" | "motor_vehicle";
  label: string;
  /** Operator-supplied value as a 0-1 share of revenue. */
  yourShare: number | null;
  /** Typical range for this industry, as 0-1 shares. */
  range: { low: number; high: number };
  status: RatioStatus;
  /** One-sentence operator-facing message. */
  message: string;
  /**
   * True when the typical range is a sector-level read carried by a
   * generic profile rather than a profile measured for this specific
   * group. The UI marks these as an estimate so a soft number is never
   * read as a precise one.
   */
  estimated: boolean;
};

export type CheckVerdict = {
  industryId: string;
  industryLabel: string;
  band: TurnoverBand;
  bandLabel: string;
  /** Verdicts for every ratio we could compute. */
  ratios: RatioVerdict[];
  /** Top-line one-sentence summary. */
  headline: string;
  /** The key benchmark designation for this industry. */
  keyBenchmark: KeyBenchmark;
  /**
   * True when the comparison rests on a generic profile because no
   * profile was matched for this group. Every typical range in the
   * verdict is then an estimate.
   */
  estimated: boolean;
};

type ICP = {
  cogs_share: number;
  labor_share: number;
  rent_share: number;
  motor_vehicle_share: number;
};

const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of (industriesJson as { industries: Array<{ id: string; name: string; sector_id: string }> }).industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

const INDUSTRY_NAME = new Map<string, string>();
for (const ind of (industriesJson as { industries: Array<{ id: string; name: string }> }).industries) {
  INDUSTRY_NAME.set(ind.id, ind.name);
}

const ICP_FILE = icpJson as { default_fallback: ICP; sectors: Record<string, ICP> };

/**
 * Resolve the cost profile for an industry. Every industry resolves to
 * its parent group's profile; an unmatched group falls back to the
 * generic profile. `estimated` is true only on that generic fallback,
 * so the verdict can be marked as a soft read rather than a measured
 * one. A precise wrong number is never invented.
 */
function getICP(industryId: string): { icp: ICP; estimated: boolean } {
  const sector = INDUSTRY_TO_SECTOR.get(industryId);
  if (!sector) return { icp: ICP_FILE.default_fallback, estimated: true };
  const match = ICP_FILE.sectors[sector];
  if (!match) return { icp: ICP_FILE.default_fallback, estimated: true };
  return { icp: match, estimated: false };
}

const HALF_WIDTH = 0.04;

/**
 * Floor below which a ratio carries no usable benchmark for a group:
 * the typical share is so small that a +/- band would read as a wrong
 * number. When the operator did not supply that line either, the ratio
 * self-omits rather than show a misleading range.
 */
const BENCHMARK_FLOOR = 0.015;

function classify(share: number | null, range: { low: number; high: number }): RatioStatus {
  if (share == null || !isFinite(share)) return "unknown";
  if (share < range.low) return "below";
  if (share > range.high) return "above";
  return "in_range";
}

function statusMessage(label: string, status: RatioStatus): string {
  switch (status) {
    case "below":
      return `${label} is below typical. You may be running unusually lean; verify the saving is sustainable and not a reporting gap.`;
    case "above":
      return `${label} is above typical. Investigate whether you are paying for something peers are not, or whether your model has structural drag.`;
    case "in_range":
      return `${label} sits within typical range. No flag here.`;
    case "unknown":
      return `${label} not supplied.`;
  }
}

function ratioRange(centerShare: number): { low: number; high: number } {
  return {
    low: Math.max(0, centerShare - HALF_WIDTH),
    high: Math.min(1, centerShare + HALF_WIDTH),
  };
}

export function computeVerdict(input: CheckInput): CheckVerdict {
  const { icp, estimated } = getICP(input.industryId);
  const { kb } = getKeyBenchmarkForIndustry(input.industryId);
  const band = classifyTurnoverBand(input.revenueUsd, input.industryId);
  const industryLabel = INDUSTRY_NAME.get(input.industryId) ?? input.industryId;
  const bandLabel = band === "unknown" ? "Unknown band" : `${band} band`;

  const cogsShare = input.cogsUsd && input.revenueUsd ? input.cogsUsd / input.revenueUsd : null;
  const labourShare = input.labourUsd && input.revenueUsd ? input.labourUsd / input.revenueUsd : null;
  const rentShare = input.rentUsd && input.revenueUsd ? input.rentUsd / input.revenueUsd : null;
  const motorShare = input.motorVehicleUsd && input.revenueUsd ? input.motorVehicleUsd / input.revenueUsd : null;

  // Candidate ratios. Each carries the benchmark center for this group
  // and the operator-supplied share. A ratio self-omits when its
  // benchmark center is below the floor AND the operator left that line
  // blank: there is no usable typical to compare against, so we show
  // nothing rather than a misleading band.
  type Candidate = {
    ratio: RatioVerdict["ratio"];
    label: string;
    center: number;
    yourShare: number | null;
  };
  const candidates: Candidate[] = [
    { ratio: "cogs", label: "Cost of sales", center: icp.cogs_share, yourShare: cogsShare },
    { ratio: "labor", label: "Labour", center: icp.labor_share, yourShare: labourShare },
    { ratio: "rent", label: "Rent", center: icp.rent_share, yourShare: rentShare },
    { ratio: "motor_vehicle", label: "Motor vehicle", center: icp.motor_vehicle_share, yourShare: motorShare },
  ];

  const ratios: RatioVerdict[] = [];
  for (const c of candidates) {
    const hasBenchmark = c.center >= BENCHMARK_FLOOR;
    // Self-omit: no usable benchmark and nothing supplied for the line.
    if (!hasBenchmark && c.yourShare == null) continue;
    const range = ratioRange(c.center);
    ratios.push({
      ratio: c.ratio,
      label: c.label,
      yourShare: c.yourShare,
      range,
      status: classify(c.yourShare, range),
      message: "",
      // A ratio is an estimate when the whole profile is a generic
      // fallback, or when this specific line has no usable benchmark
      // yet the operator supplied a value we still want to place.
      estimated: estimated || !hasBenchmark,
    });
  }
  for (const r of ratios) {
    r.message = statusMessage(r.label, r.status);
  }

  // Headline: the largest absolute deviation among supplied ratios.
  let maxDeviationLabel = "";
  let maxDeviationMagnitude = -Infinity;
  let maxDeviationStatus: RatioStatus = "unknown";
  for (const r of ratios) {
    if (r.yourShare == null) continue;
    const mid = (r.range.low + r.range.high) / 2;
    const dev = Math.abs(r.yourShare - mid);
    if (dev > maxDeviationMagnitude) {
      maxDeviationMagnitude = dev;
      maxDeviationLabel = r.label;
      maxDeviationStatus = r.status;
    }
  }
  let headline: string;
  if (!maxDeviationLabel) {
    headline = "Supply at least one cost line to see a comparative verdict.";
  } else if (maxDeviationStatus === "in_range") {
    headline = `${industryLabel} numbers look within typical range. Your biggest movement is ${maxDeviationLabel.toLowerCase()}, but it is inside the band.`;
  } else if (maxDeviationStatus === "above") {
    headline = `Your biggest signal is ${maxDeviationLabel.toLowerCase()}, which is above typical for ${industryLabel.toLowerCase()} in this band. Worth understanding why.`;
  } else if (maxDeviationStatus === "below") {
    headline = `Your biggest signal is ${maxDeviationLabel.toLowerCase()}, which is below typical for ${industryLabel.toLowerCase()} in this band. Worth confirming the saving is real.`;
  } else {
    headline = "Verdict ready.";
  }

  void labelKeyBenchmark; // keep import live for future enhancement
  return {
    industryId: input.industryId,
    industryLabel,
    band,
    bandLabel,
    ratios,
    headline,
    keyBenchmark: kb,
    estimated,
  };
}
