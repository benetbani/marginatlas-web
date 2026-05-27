/**
 * src/lib/economic_profile/au_primary_loader.ts
 *
 * Phase 1c — runtime loader that turns the parsed ATO benchmarks JSON
 * into a queryable per-(industry, turnover-band) primary-data anchor
 * for Australian cells.
 *
 * Behaviour:
 *   - When called for a cell whose country is "AU" and whose
 *     industry_id maps to an ATO entry via au_industry_map.ts:
 *     returns the ATO ratios (key benchmark + cost of sales + labour +
 *     rent + motor vehicle) for the appropriate turnover band.
 *   - Otherwise returns null.
 *
 * The loader is gated by NEXT_PUBLIC_AU_PRIMARY_DATA so we can flip
 * it off instantly if a value looks weird in production.
 *
 * Per docs/strategy/2026-05-26-ato-framework-execution-plan.md §3.1.
 */

import auBenchmarksJson from "../../../data/finance/au_primary_benchmarks_v1.json";
import { AU_TO_MA_INDUSTRY_MAP } from "./au_industry_map";
import { getRatePerUsd } from "@/lib/finance/fx";

// AUD per USD: read from the central FX registry
// (src/lib/finance/fx.ts) so the rate has one home, source metadata,
// and a quarterly review cadence. Falls back to 1.5384 if the FX
// module ever fails to register AUD (defensive; should never trigger
// in production).
const AUD_PER_USD = getRatePerUsd("AUD") ?? 1.5384;

type RatioRange = { low: number; high: number };
type BandRatio = { ranges: [RatioRange, RatioRange, RatioRange]; averages?: [number, number, number] };
type Band = { min_aud: number; max_aud: number | null };
type AustralianIndustry = {
  ato_name: string;
  last_updated: string;
  qc_id: string;
  description: string;
  key_benchmark: "total_expenses" | "cost_of_sales";
  bands: [Band, Band, Band];
  ratios: Partial<Record<"total_expenses" | "cost_of_sales" | "labour" | "rent" | "motor_vehicle", BandRatio>>;
};

type ParsedFile = {
  source_year: string;
  industries: Record<string, AustralianIndustry>;
};

const PARSED = auBenchmarksJson as unknown as ParsedFile;

/** Build the reverse index ma_id → AU slug once at module load. */
const MA_TO_AU_SLUG: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const [slug, entry] of Object.entries(AU_TO_MA_INDUSTRY_MAP)) {
    if (entry.ma_id) out[entry.ma_id] = slug;
  }
  return out;
})();

// Feature-flag accessor lives in the central registry as of
// 2026-05-27 architecture refactor. Re-exported here so existing
// `import { isAuPrimaryDataEnabled } from '@/lib/economic_profile/au_primary_loader'`
// callers keep working.
export { isAuPrimaryDataEnabled } from "@/lib/feature_flags";
import { isAuPrimaryDataEnabled as isAuPrimaryDataEnabledImpl } from "@/lib/feature_flags";

/**
 * Classify a USD revenue into an AU turnover band index for a given
 * industry. Returns 0, 1, 2 (small/medium/large) or null when no AU
 * data exists for that industry.
 */
export function classifyAuTurnoverBand(
  maIndustryId: string,
  revenueUsd: number,
): 0 | 1 | 2 | null {
  const auSlug = MA_TO_AU_SLUG[maIndustryId];
  if (!auSlug) return null;
  const entry = PARSED.industries[auSlug];
  if (!entry) return null;
  const revenueAud = revenueUsd * AUD_PER_USD;
  for (let i = 0; i < entry.bands.length; i++) {
    const b = entry.bands[i];
    if (b.max_aud == null) return i as 0 | 1 | 2;
    if (revenueAud >= b.min_aud && revenueAud < b.max_aud) return i as 0 | 1 | 2;
  }
  return null;
}

export type AuPrimaryAnchor = {
  /** The full ATO entry, kept for "primary data" badging on the cell page. */
  ato_name: string;
  last_updated: string;
  qc_id: string;
  source_year: string;
  /** Which ratio the ATO designates as the headline. */
  key_benchmark: "total_expenses" | "cost_of_sales";
  /** Band classification (small/medium/large index). */
  band_index: 0 | 1 | 2;
  /** Band thresholds in AUD (raw) and USD (converted). */
  band_aud: Band;
  band_usd: { min_usd: number; max_usd: number | null };
  /**
   * Ratios for the relevant band only (not all three).
   * Each value is a decimal fraction 0..1.
   */
  ratios: Partial<Record<"total_expenses" | "cost_of_sales" | "labour" | "rent" | "motor_vehicle", {
    low: number;
    high: number;
    /** Midpoint of low/high. Used by the cost-engine as the central anchor. */
    mid: number;
  }>>;
};

/**
 * Returns the AU primary-data anchor for a (industry, revenue) tuple.
 * null when:
 *   - Feature flag disabled.
 *   - Industry has no AU mapping.
 *   - Revenue doesn't classify into a band.
 */
export function getAuPrimaryAnchor(
  maIndustryId: string,
  revenueUsd: number,
): AuPrimaryAnchor | null {
  if (!isAuPrimaryDataEnabledImpl()) return null;
  const auSlug = MA_TO_AU_SLUG[maIndustryId];
  if (!auSlug) return null;
  const entry = PARSED.industries[auSlug];
  if (!entry) return null;
  const bandIndex = classifyAuTurnoverBand(maIndustryId, revenueUsd);
  if (bandIndex == null) return null;

  const ratios: AuPrimaryAnchor["ratios"] = {};
  for (const [key, br] of Object.entries(entry.ratios) as Array<[
    keyof AuPrimaryAnchor["ratios"],
    BandRatio,
  ]>) {
    const r = br.ranges[bandIndex];
    if (r) {
      ratios[key] = { low: r.low, high: r.high, mid: (r.low + r.high) / 2 };
    }
  }
  const band = entry.bands[bandIndex];
  return {
    ato_name: entry.ato_name,
    last_updated: entry.last_updated,
    qc_id: entry.qc_id,
    source_year: PARSED.source_year,
    key_benchmark: entry.key_benchmark,
    band_index: bandIndex,
    band_aud: band,
    band_usd: {
      min_usd: Math.round(band.min_aud / AUD_PER_USD),
      max_usd: band.max_aud == null ? null : Math.round(band.max_aud / AUD_PER_USD),
    },
    ratios,
  };
}

/** Count of AU primary entries available. For audit + badge logic. */
export function getAuPrimaryIndustryCount(): number {
  return Object.keys(PARSED.industries).length;
}

/** Source year for badge display. */
export function getAuSourceYear(): string {
  return PARSED.source_year;
}
