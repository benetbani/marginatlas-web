/**
 * src/lib/home/beats.ts
 *
 * Server-side data builder for the three data-rich homepage beats that sit
 * where the old featured-tiles grid was:
 *
 *   1. Three editorial cards  - one real industry-in-place each, with the
 *      activity's typical revenue, after-tax owner take-home, a third money
 *      figure (break-even orders/day or net margin), and a one-line hook that
 *      names both the upside AND what eats it.
 *   2. A ranked leaderboard   - the US states where a gym keeps the most for
 *      its owner, ranked by after-tax take-home, with the SAME median-relative
 *      outlier fence the activity page uses.
 *   3. A surprising spread    - one verified cross-place pair where a humble
 *      business out-earns a prestigious one per owner.
 *
 * Every figure is REAL: typical revenue comes straight off the resolved cell,
 * and owner take-home is the modeled after-tax net profit from the same
 * tax-aware estimator the cell page and the activity "where it works" table
 * use, so the homepage, the cell page, and the activity page all agree on the
 * method. Nothing is invented; a beat we cannot resolve cleanly self-omits.
 *
 * Build-safe by construction: this is the ONLY place the homepage touches the
 * data layer, and every read is wrapped in withBudget(), so a slow or failed
 * Supabase query degrades the beat to null (the page renders without it) rather
 * than hanging or crashing the route. Supabase queries live in src/lib (never
 * in components), matching the project's data-access rule.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import {
  getCellBySlug,
  getSameIndustryAcrossStates,
  cellUrl,
  withBudget,
  type Cell,
} from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { clampMargin, clampNetMarginPct } from "@/lib/finance/margin_floor";
import { computeBreakeven } from "@/lib/economics/breakeven";
import { getCityTier } from "@/lib/cities/city_tier";
import { getLondonEntry } from "@/lib/scores/cell_board";
import {
  summarizeActivityPlaces,
  type ActivityPlaceInput,
} from "@/lib/scores/activity_board";

/** A finite, positive real. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/**
 * Typical revenue for a cell: the median-firm figure, exactly as the cell page
 * and the activity table read it.
 */
function typicalRevenueOf(cell: Cell): number | null {
  const r = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  return isPos(r) ? r : null;
}

/**
 * After-tax owner take-home and net margin (fraction) for a cell, computed the
 * same way the cell page and the activity "where it works" table do: prefer the
 * curated London economics when present (GB cells in the dataset), else the
 * tax-aware net-profit estimator, with the shared net-margin floor applied so a
 * sub-3% net can never surface. The larger-firm take-home floor is intentionally
 * not applied here (an all-sizes cell carries a null size band, so that floor
 * never fired on the cell page either), matching activityPlaceFromCell.
 */
function ownerEconomicsOf(
  cell: Cell,
): { takeHome: number | null; netMarginPct: number | null } {
  const revenue = typicalRevenueOf(cell);
  if (revenue == null) return { takeHome: null, netMarginPct: null };

  const london = getLondonEntry(cell)?.economics ?? null;
  if (london) {
    return {
      takeHome: isPos(london.owner_take_home) ? london.owner_take_home : null,
      netMarginPct: Number.isFinite(london.net_margin_pct)
        ? clampNetMarginPct(london.net_margin_pct, cell.industry_id ?? null)
        : null,
    };
  }

  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(),
    geoId: cell.geo_id || null,
    industryId: cell.industry_id || null,
    sectorId: cell.sector_id || null,
    grossRevenue: revenue,
    payroll: null,
  });
  const takeHome = isPos(net.net_profit) ? net.net_profit : null;
  const netMarginPct =
    net.net_margin != null
      ? clampMargin(net.net_margin, "net", cell.industry_id || null) * 100
      : null;
  return { takeHome, netMarginPct };
}

/** A resolved card stat (label + pre-format-ready USD/percent/order number). */
export type BeatStat =
  | { kind: "usd"; label: string; value: number; hint?: string }
  | { kind: "pct"; label: string; value: number; hint?: string }
  | { kind: "orders"; label: string; value: number; hint?: string };

/** One editorial card: a real industry-in-place with real figures and a hook. */
export interface BeatCard {
  /** "{Business} in {Place}", headlined by the cell's ACTUAL resolved place. */
  title: string;
  href: string;
  eyebrow: string;
  stats: BeatStat[];
  /** One-line editorial hook naming the upside AND the killer. */
  hook: string;
}

/** One ranked leaderboard row. */
export interface BeatRankRow {
  name: string;
  href: string;
  takeHome: number;
  netMarginPct: number | null;
}

/** The leaderboard beat. */
export interface BeatLeaderboard {
  business: string;
  rows: BeatRankRow[];
}

/** The surprising-spread beat. */
export interface BeatSpread {
  humble: { label: string; href: string; takeHome: number };
  prestige: { label: string; href: string; takeHome: number };
}

/** The full payload the homepage renders (any field may be null / short). */
export interface HomepageBeats {
  cards: BeatCard[];
  leaderboard: BeatLeaderboard | null;
  spread: BeatSpread | null;
}

/** A card request: where to resolve, plus the hook builder fed real figures. */
interface CardSpec {
  country: string;
  geo: string;
  industry: string;
  eyebrow: string;
  /** The activity id we require the resolved cell to carry; guards misrouting. */
  expectIndustryId: string;
  /** Title business noun, e.g. "Restaurants" (place comes from the cell). */
  business: string;
  /** Build the card stats + hook from the resolved real numbers. */
  build: (ctx: {
    cell: Cell;
    place: string;
    revenue: number;
    takeHome: number | null;
    netMarginPct: number | null;
    breakevenDaily: number | null;
    typicalDaily: number | null;
  }) => { stats: BeatStat[]; hook: string } | null;
}

/**
 * Resolve one card spec to a real BeatCard, or null when the cell does not
 * resolve to the expected activity (the friendly-slug to NAICS mapping can
 * misroute some US white-collar slugs), is synthetic, or carries no usable
 * revenue. A null card is dropped by the caller; it is never rendered empty.
 */
async function resolveCard(spec: CardSpec): Promise<BeatCard | null> {
  const cell = await withBudget(
    getCellBySlug(spec.country, spec.geo, spec.industry, {
      sizeBand: null,
      year: null,
    }),
    null,
    4_000,
    `homeCard:${spec.geo}/${spec.industry}`,
  );
  if (!cell) return null;
  // Trust gate (shared with across-cities + extremes, src/lib/cells/trust.ts): a
  // card must be a real LOCAL measurement of the activity it claims. Beyond the
  // right-activity and not-synthetic checks this also excludes the extrapolated
  // tier (coverage_tier "X") and national aggregates resolved under a city slug
  // (geo_level "country"), so a poisoned cross-country read can never headline a
  // card. The curated Barcelona/London/Miami cards are real sub-national cells,
  // so they are unaffected.
  if (!isTrustedLocalCell(cell, spec.expectIndustryId)) return null;

  const revenue = typicalRevenueOf(cell);
  if (revenue == null) return null;

  const { takeHome, netMarginPct } = ownerEconomicsOf(cell);
  const tier = getCityTier(spec.geo);
  const be = cell.industry_id
    ? computeBreakeven(cell.industry_id, revenue, tier)
    : null;
  const place =
    cell.geo_name || cell.country.toUpperCase() || spec.geo;

  const built = spec.build({
    cell,
    place,
    revenue,
    takeHome,
    netMarginPct,
    breakevenDaily: be ? be.breakevenOrdersDaily : null,
    typicalDaily: be ? be.currentOrdersDaily : null,
  });
  if (!built) return null;

  return {
    title: `${spec.business} in ${place}`,
    href: cellUrl(cell),
    eyebrow: spec.eyebrow,
    stats: built.stats,
    hook: built.hook,
  };
}

/** Turn one cross-place Cell into the activity-board place input shape. */
function placeInputFromCell(cell: Cell): ActivityPlaceInput | null {
  const revenue = typicalRevenueOf(cell);
  if (revenue == null) return null;
  const { takeHome, netMarginPct } = ownerEconomicsOf(cell);
  const name = cell.geo_name || cell.country.toUpperCase();
  return {
    name,
    href: cellUrl(cell),
    typicalRevenue: revenue,
    takeHome,
    netMarginPct,
  };
}

/**
 * Build the gym leaderboard from the US-state slate, ranked by owner take-home,
 * using the SAME median-relative outlier fence the activity page uses
 * (summarizeActivityPlaces clips garbage tails, then ranks). US-state cells come
 * from the trusted same-currency table, so the ranking is apples-to-apples.
 * Returns null when fewer than 4 places resolve cleanly with a take-home.
 */
async function resolveGymLeaderboard(): Promise<BeatLeaderboard | null> {
  const slate = await withBudget(
    getSameIndustryAcrossStates("sports-fitness", "US-00", 30),
    [],
    4_000,
    "homeLeaderboard:sports-fitness",
  );
  // Only states that genuinely carry the gym activity, via the shared trust gate
  // (src/lib/cells/trust.ts): right activity, not synthetic, not the
  // extrapolated tier, not a country aggregate. US-state cells are trusted
  // same-currency measurements, so in practice only the rare misroute drops.
  const inputs: ActivityPlaceInput[] = slate
    .filter((c) => isTrustedLocalCell(c, "sports_fitness"))
    .map(placeInputFromCell)
    .filter((p): p is ActivityPlaceInput => p !== null);

  const summary = summarizeActivityPlaces(inputs);
  const rows: BeatRankRow[] = summary.rows
    .filter((r): r is typeof r & { takeHome: number } => isPos(r.takeHome))
    .slice(0, 7)
    .map((r) => ({
      name: r.name,
      href: r.href,
      takeHome: r.takeHome,
      netMarginPct: r.netMarginPct,
    }));

  if (rows.length < 4) return null;
  return { business: "gym", rows };
}

/**
 * Build the surprising spread: a humble business that out-earns a prestigious
 * one for its owner. Both legs are resolved from real cells and BOTH must clear
 * the same guards as the cards (right activity, not synthetic, real take-home),
 * and the humble leg must genuinely out-earn the prestige leg, or the whole beat
 * self-omits. The verified pair: a Miami restaurant owner keeps more per year
 * than the typical London law-firm owner.
 */
async function resolveSpread(): Promise<BeatSpread | null> {
  const [humbleCell, prestigeCell] = await Promise.all([
    withBudget(
      getCellBySlug("us", "miami", "restaurants", { sizeBand: null, year: null }),
      null,
      4_000,
      "homeSpread:miami/restaurants",
    ),
    withBudget(
      getCellBySlug("gb", "london", "legal-services", {
        sizeBand: null,
        year: null,
      }),
      null,
      4_000,
      "homeSpread:london/legal",
    ),
  ]);
  if (!humbleCell || !prestigeCell) return null;
  // Both legs must clear the shared trust gate (src/lib/cells/trust.ts): right
  // activity, not synthetic, not the extrapolated tier, not a country aggregate.
  // Miami restaurants is a real US-state cell; London legal services is the
  // curated tier-P lad entry, so both pass.
  if (!isTrustedLocalCell(humbleCell, "restaurants")) return null;
  if (!isTrustedLocalCell(prestigeCell, "legal_services")) return null;

  const humbleTake = ownerEconomicsOf(humbleCell).takeHome;
  const prestigeTake = ownerEconomicsOf(prestigeCell).takeHome;
  if (!isPos(humbleTake) || !isPos(prestigeTake)) return null;
  // The whole point is the humble business winning. If it ever stops winning
  // (data shifts), the beat omits rather than printing a non-surprise.
  if (humbleTake <= prestigeTake) return null;

  return {
    humble: {
      label: `${humbleCell.geo_name || "Miami"} restaurant`,
      href: cellUrl(humbleCell),
      takeHome: humbleTake,
    },
    prestige: {
      label: `${prestigeCell.geo_name || "London"} law firm`,
      href: cellUrl(prestigeCell),
      takeHome: prestigeTake,
    },
  };
}

/** Hook + stat builders for the three cards, fed the resolved real figures. */
const CARD_SPECS: CardSpec[] = [
  {
    country: "es",
    geo: "barcelona",
    industry: "restaurants",
    eyebrow: "The crowded one",
    expectIndustryId: "restaurants",
    business: "Restaurants",
    build: ({ revenue, takeHome, breakevenDaily, typicalDaily }) => {
      const stats: BeatStat[] = [
        { kind: "usd", label: "Typical revenue", value: revenue, hint: "median firm" },
      ];
      if (isPos(takeHome)) {
        stats.push({ kind: "usd", label: "Owner take-home", value: takeHome, hint: "after tax" });
      }
      if (isPos(breakevenDaily)) {
        stats.push({
          kind: "orders",
          label: "Break-even",
          value: breakevenDaily,
          hint: isPos(typicalDaily)
            ? `vs about ${Math.round(typicalDaily)} typical`
            : undefined,
        });
      }
      if (!isPos(takeHome)) return null;
      return {
        stats,
        hook:
          `A Barcelona dining room can gross well, but rent and a packed market ` +
          `leave the typical owner about ${money(takeHome)} a year. The winners own ` +
          `their location. The rest churn out by year three.`,
      };
    },
  },
  {
    country: "gb",
    geo: "london",
    industry: "legal-services",
    eyebrow: "The respectable one",
    expectIndustryId: "legal_services",
    // Headlined by the ACTUAL resolved place (London), not the loose UK ask:
    // accuracy over the brief. London data must never read under a UK label.
    business: "Legal services",
    build: ({ revenue, takeHome, netMarginPct }) => {
      const stats: BeatStat[] = [
        { kind: "usd", label: "Typical revenue", value: revenue, hint: "median firm" },
      ];
      if (isPos(takeHome)) {
        stats.push({ kind: "usd", label: "Owner take-home", value: takeHome, hint: "after tax" });
      }
      if (isPos(netMarginPct)) {
        stats.push({ kind: "pct", label: "Net margin", value: netMarginPct });
      }
      if (!isPos(takeHome)) return null;
      return {
        stats,
        hook:
          `A London practice keeps about ${money(takeHome)} for its owner, far above ` +
          `the restaurant down the street. The catch: you are the firm. Lose two ` +
          `senior clients and the same fixed cost base turns on you fast.`,
      };
    },
  },
  {
    country: "us",
    geo: "miami",
    industry: "sports-fitness",
    eyebrow: "The deceptive one",
    expectIndustryId: "sports_fitness",
    business: "Gyms",
    build: ({ revenue, takeHome, breakevenDaily, typicalDaily }) => {
      const stats: BeatStat[] = [
        { kind: "usd", label: "Typical revenue", value: revenue, hint: "median firm" },
      ];
      if (isPos(takeHome)) {
        stats.push({ kind: "usd", label: "Owner take-home", value: takeHome, hint: "after tax" });
      }
      if (isPos(breakevenDaily)) {
        stats.push({
          kind: "orders",
          label: "Break-even",
          value: breakevenDaily,
          hint: isPos(typicalDaily)
            ? `vs about ${Math.round(typicalDaily)} typical`
            : undefined,
        });
      }
      if (!isPos(takeHome)) return null;
      const beClause = isPos(breakevenDaily)
        ? `But it needs roughly ${Math.round(breakevenDaily)} paying members through ` +
          `the door every day just to cover the lease. Empty treadmills in January ` +
          `are how these close.`
        : `But it lives or dies on volume: members who sign up in January and stop ` +
          `showing up by March are how these quietly close.`;
      return {
        stats,
        hook:
          `A Miami gym looks like a cash machine at ${money(revenue)} of revenue and ` +
          `${money(takeHome)} to the owner. ${beClause}`,
      };
    },
  },
];

/** Compact USD for inline prose (mirrors the board's compact USD grain). */
function money(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${trim(abs / 1_000_000)}M`;
  if (abs >= 100_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}
function trim(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

/**
 * Build the full homepage beats payload. Resolves the three cards, the gym
 * leaderboard, and the surprising spread concurrently; every piece self-omits
 * on a miss. The page renders only the cards that resolved (it requires at least
 * two), the leaderboard when it has four or more clean places, and the spread
 * only when the humble business genuinely wins.
 */
export async function loadHomepageBeats(): Promise<HomepageBeats> {
  const [cardResults, leaderboard, spread] = await Promise.all([
    Promise.all(CARD_SPECS.map(resolveCard)),
    resolveGymLeaderboard(),
    resolveSpread(),
  ]);
  const cards = cardResults.filter((c): c is BeatCard => c !== null);
  return { cards, leaderboard, spread };
}
