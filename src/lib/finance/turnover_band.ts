/**
 * src/lib/finance/turnover_band.ts
 *
 * Turnover band classifier. Maps a cell's
 * revenue_per_firm in USD onto one of three turnover bands defined
 * per sector in data/finance/turnover_bands_v1.json.
 *
 * The ATO benchmark framework segments by revenue, not headcount.
 * For a pre-launch operator, "what is my band?" is answered by
 * projected revenue. Once revenue exists, this band is more
 * actionable for "am I normal?" comparison than the existing
 * employee-count size_band.
 *
 * The classifier is sector-aware:
 *   - bakeries / restaurants under ~$300K USD are "small"
 *   - bricklaying under ~$150K USD is "small"
 *   - law firms under ~$500K USD are "small"
 * etc. Per-sector thresholds in the turnover_bands data file.
 *
 * Phase 6 ships sentinel data for 6 sectors. Phase 6b (the founder's
 * call) extends to all 25.
 */
import bandsJson from "../../../data/finance/turnover_bands_v1.json";
import industriesJson from "../taxonomy/industries.json";

export type TurnoverBand = "small" | "medium" | "large" | "unknown";

type BandRange = { min_usd: number; max_usd: number | null };
type SectorBands = { small: BandRange; medium: BandRange; large: BandRange };
type FileShape = {
  version: string;
  anchor: string;
  default_bands: SectorBands;
  by_sector: Record<string, SectorBands>;
};

const BANDS = bandsJson as FileShape;

const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of (industriesJson as { industries: Array<{ id: string; sector_id: string }> }).industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

function getBandsForSector(sectorId: string | null | undefined): SectorBands {
  if (!sectorId) return BANDS.default_bands;
  return BANDS.by_sector[sectorId] ?? BANDS.default_bands;
}

/**
 * Classify a USD revenue value into a turnover band given the
 * industry's parent sector.
 *
 * Returns "unknown" when revenue is null or non-finite.
 */
export function classifyTurnoverBand(
  revenueUsd: number | null | undefined,
  industryId: string | null | undefined
): TurnoverBand {
  if (revenueUsd == null || !isFinite(revenueUsd)) return "unknown";
  if (revenueUsd <= 0) return "unknown";
  const sector = industryId ? INDUSTRY_TO_SECTOR.get(industryId) : undefined;
  const bands = getBandsForSector(sector);
  if (revenueUsd < (bands.small.max_usd ?? Infinity)) return "small";
  if (revenueUsd < (bands.medium.max_usd ?? Infinity)) return "medium";
  return "large";
}

/** Human-readable label for a turnover band. */
export function labelTurnoverBand(band: TurnoverBand): string {
  switch (band) {
    case "small":
      return "Small";
    case "medium":
      return "Medium";
    case "large":
      return "Large";
    case "unknown":
      return "Unknown";
  }
}

/**
 * Return the band thresholds for an industry, used by the UI to
 * render the band boundaries. Returns the default thresholds if
 * the industry's sector has no per-sector overrides.
 */
export function getBandThresholds(industryId: string | null | undefined): SectorBands {
  const sector = industryId ? INDUSTRY_TO_SECTOR.get(industryId) : undefined;
  return getBandsForSector(sector);
}

/** Format a USD threshold for display. */
export function fmtBandThreshold(usd: number | null): string {
  if (usd == null) return "and above";
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}
