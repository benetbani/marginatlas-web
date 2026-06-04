/**
 * src/lib/scores/sector_economics.ts
 *
 * The sector-directory economic read (bible Section 14, the Industry directory
 * row: "browse sectors" with key modules "sectors, margins, capital, survival",
 * whose stated thing-to-avoid is an "alphabetical dump only"). This is the
 * directory-altitude sibling of the activity-level read
 * (src/lib/scores/industry_verdict) and the country read
 * (src/lib/scores/country_verdict).
 *
 * Same voice, straight from the bible (Section 25): blunt, practical, skeptical
 * of easy money. It frames the directory so a reader can find where the money
 * is by sector, without an "alphabetical dump only".
 *
 * It invents NO numbers. It only reads the curated, cross-country-stable margin
 * structure that the activity pages already load (gross, operating, net, and
 * asset intensity), aggregates it across the visible activities inside a sector,
 * and restates the shape qualitatively. Where a sector has no readable margin
 * structure at all, its economic profile self-omits (returns null) and the
 * caller renders the sector as a plain row instead of a fabricated one.
 *
 * Pure module: no Supabase, no network. It consumes only the taxonomy and the
 * static industry-margins table, so it is trivially testable and cannot trip
 * the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { Industry } from "@/lib/taxonomy";
import { resolveToMeasuredIndustry } from "@/lib/taxonomy";
import industryMarginsJson from "@/lib/finance/industry_margins.json";

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  asset_intensity?: number;
};

const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

/**
 * The curated margin for one activity. Mirrors the activity page: try the
 * deepest measured ancestor, then a direct id hit, and only then fall back to
 * the conservative SMB default. Returns null when even the fallback is unfit
 * (it never is today, but the caller treats null as "no readable signal").
 */
function directMarginRow(industryId: string): IndustryMarginRow | null {
  return INDUSTRY_MARGINS.industries[industryId] ?? null;
}

function marginForIndustry(ind: Industry): IndustryMarginRow | null {
  const measured = resolveToMeasuredIndustry(ind) ?? ind;
  return (
    directMarginRow(measured.id) ??
    directMarginRow(ind.id) ??
    (ind.parent_id ? directMarginRow(ind.parent_id) : null)
  );
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const a = [...values].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

// ----------------------------------------------------------------------------
// qualitative bands
// ----------------------------------------------------------------------------

/** Direction for tone: a higher-keep / lighter-capital read leans moss. */
export type SectorSignalTone = "good" | "flat" | "bad";

/**
 * The "what the owner keeps" band, read from the sector's median net margin.
 * Mirrors the activity-level keep bands so the directory and the activity page
 * tell the same story.
 */
export interface KeepBand {
  /** Qualitative word: "thin", "workable", "healthy". */
  word: string;
  tone: SectorSignalTone;
}

function keepBand(medianNet: number | null): KeepBand | null {
  if (medianNet == null || !Number.isFinite(medianNet)) return null;
  if (medianNet >= 0.15) return { word: "healthy", tone: "good" };
  if (medianNet >= 0.08) return { word: "workable", tone: "flat" };
  return { word: "thin", tone: "bad" };
}

/**
 * The capital-to-start band, read from the sector's median asset intensity
 * (fixed assets per dollar of revenue). Light means most of the money goes
 * into running it, not building it; heavy means real money on the floor before
 * the first sale.
 */
export interface CapitalBand {
  /** Qualitative word: "light", "moderate", "heavy". */
  word: string;
  tone: SectorSignalTone;
}

function capitalBand(medianAsset: number | null): CapitalBand | null {
  if (medianAsset == null || !Number.isFinite(medianAsset)) return null;
  if (medianAsset >= 0.9) return { word: "heavy", tone: "bad" };
  if (medianAsset >= 0.45) return { word: "moderate", tone: "flat" };
  return { word: "light", tone: "good" };
}

// ----------------------------------------------------------------------------
// the public profile
// ----------------------------------------------------------------------------

/** A named activity with its readable net margin, used for the high/low anchor. */
export interface SectorAnchor {
  id: string;
  name: string;
  netMargin: number;
}

export interface SectorEconomics {
  /** How many activities fed the read (those with a readable margin row). */
  measuredCount: number;
  /** Median net margin across the sector's measured activities (a share). */
  medianNet: number | null;
  /** Median asset intensity across the sector's measured activities. */
  medianAsset: number | null;
  /** What the owner typically keeps, as a qualitative band. */
  keep: KeepBand | null;
  /** What it takes to start, as a qualitative band. */
  capital: CapitalBand | null;
  /** The strongest-margin activity in the sector (the bright spot). */
  best: SectorAnchor | null;
  /** The weakest-margin activity in the sector (the warning). */
  worst: SectorAnchor | null;
  /**
   * Spread between the best and worst activity, as a share. A wide spread means
   * the sector name hides very different businesses; a tight one means they
   * mostly rhyme.
   */
  spread: number | null;
}

/**
 * Build the economic profile for one sector from its visible activities. The
 * caller passes the already-filtered, already-ordered activity list (so this
 * module owns no visibility policy). Returns null when no activity in the
 * sector has a readable margin row, so a thin sector degrades to a plain row.
 */
export function buildSectorEconomics(industries: Industry[]): SectorEconomics | null {
  const rows: { ind: Industry; m: IndustryMarginRow }[] = [];
  for (const ind of industries) {
    const m = marginForIndustry(ind);
    if (m && Number.isFinite(m.net_margin)) rows.push({ ind, m });
  }
  if (rows.length === 0) return null;

  const nets = rows.map((r) => r.m.net_margin);
  const assets = rows
    .map((r) => r.m.asset_intensity)
    .filter((a): a is number => a != null && Number.isFinite(a));

  const medianNet = median(nets);
  const medianAsset = median(assets);

  const sortedByNet = [...rows].sort((a, b) => b.m.net_margin - a.m.net_margin);
  const top = sortedByNet[0];
  const bottom = sortedByNet[sortedByNet.length - 1];

  const best: SectorAnchor | null = top
    ? { id: top.ind.id, name: top.ind.name, netMargin: top.m.net_margin }
    : null;
  const worst: SectorAnchor | null =
    bottom && bottom.ind.id !== top?.ind.id
      ? { id: bottom.ind.id, name: bottom.ind.name, netMargin: bottom.m.net_margin }
      : null;

  const spread =
    best && worst ? Math.max(0, best.netMargin - worst.netMargin) : null;

  return {
    measuredCount: rows.length,
    medianNet,
    medianAsset,
    keep: keepBand(medianNet),
    capital: capitalBand(medianAsset),
    best,
    worst,
    spread,
  };
}

// ----------------------------------------------------------------------------
// directory tiers: the editorial grouping that replaces the alphabetical dump
// ----------------------------------------------------------------------------

/**
 * The three reading groups the directory sorts sectors into, by where the money
 * actually tends to land. This is the spine that makes the page a guided index
 * rather than a list: a reader scanning for "where is the money" reads the
 * groups top to bottom and stops where the economics fit the plan.
 */
export type SectorTier = "keeps_the_most" | "real_but_earned" | "thin_or_heavy";

export interface SectorTierMeta {
  id: SectorTier;
  /** Short label for the group heading. */
  title: string;
  /** One blunt line of what unites the group, in the house voice. */
  blurb: string;
}

export const SECTOR_TIERS: Record<SectorTier, SectorTierMeta> = {
  keeps_the_most: {
    id: "keeps_the_most",
    title: "Where the owner keeps the most",
    blurb:
      "Service and advisory work, mostly. Little stock to buy, light fixed costs, and a margin that survives to the owner. The catch is that the owner is usually the product, so growth means hiring people you can bill out for more than they cost.",
  },
  real_but_earned: {
    id: "real_but_earned",
    title: "Real money, but you earn it",
    blurb:
      "Workable economics that reward a tight operator and punish a loose one. The margin is there on a good day, but volume, throughput, and cost discipline decide whether you actually see it.",
  },
  thin_or_heavy: {
    id: "thin_or_heavy",
    title: "Thin margins or heavy capital",
    blurb:
      "High volume on a few cents per dollar, or a lot of money on the floor before the first sale. These can work, but the room for error is small and a single bad call can erase the year.",
  },
};

export const SECTOR_TIER_ORDER: SectorTier[] = [
  "keeps_the_most",
  "real_but_earned",
  "thin_or_heavy",
];

/**
 * Sort a sector into a reading group from its economic profile. A sector with
 * no readable economics lands in the middle group by default: it is shown, not
 * hidden, and not editorialised beyond what the data supports.
 *
 * The rule pairs how much survives to the bottom line (median net) with how
 * much capital the model needs up front (median asset intensity). A capital
 * heavy sector drops a group even when its paper margin looks fine, because the
 * money is at risk earlier.
 */
export function classifySector(econ: SectorEconomics | null): SectorTier {
  if (!econ || econ.medianNet == null) return "real_but_earned";
  const net = econ.medianNet;
  const asset = econ.medianAsset ?? 0;

  if (asset >= 0.9) return "thin_or_heavy"; // capital-heavy beats a nice paper margin
  if (net >= 0.13) return "keeps_the_most";
  if (net < 0.07) return "thin_or_heavy";
  return "real_but_earned";
}
