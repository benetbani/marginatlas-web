/**
 * src/lib/seasonality/fixture.ts , the typed accessor for the ONE real
 * twelve-month series in this repo.
 *
 * WHY IT EXISTS. `verify_layering` forbids a page importing from `data/`
 * directly, and it is right to: a page that reaches into the data folder makes
 * the shape of that file part of the page's contract, and nothing then catches a
 * rename. Created 2026-08-20 when the V4 variant harness tripped that gate, which
 * is the migrate-when-touched behaviour CLAUDE.md asks for rather than a new
 * allowlist entry.
 *
 * WHAT THE SERIES IS, and every consumer should carry this forward. It is an
 * INDEX, not money: its own unit field reads "revenue index, year average = 100".
 * It is marked `fromModel: true` and `tier: "thin"`, so it is a trade seasonal
 * shape rather than an observation of these restaurants. No absolute monthly
 * figures exist anywhere in this repo.
 *
 * BLIND SPOT. This is the only twelve-month series here. Searched 2026-08-20: the
 * London market seed carries none, `data/content/activity_inputs.json` carries
 * none, and neither narrative file carries one. Any consumer that needs a second
 * series to compare against does not have one and must say so rather than
 * deriving a second shape from this one.
 */
import fixture from "../../../data/cells/restaurants-in-london.json";

export type SeasonalMonth = { month: string; index: number };

export type SeasonalSeries = {
  months: SeasonalMonth[];
  /** The series' own unit string, carried rather than restated. */
  unit: string;
  /** Coverage tier as recorded on the figure. */
  tier: string;
  /** True when the figure is modelled rather than observed. */
  modelled: boolean;
};

type RawSeries = {
  series?: { x: string; value: number }[];
  unit?: string;
  tier?: string;
  fromModel?: boolean;
};

/**
 * The London restaurants monthly index. Returns an empty `months` array rather
 * than throwing if the shape ever changes, so a consumer self-omits instead of
 * crashing, which is this repo's standing rule for a missing figure.
 */
export function getLondonRestaurantsSeasonality(): SeasonalSeries {
  const raw = (fixture as unknown as { seasonality?: { monthlyIndex?: RawSeries } })
    ?.seasonality?.monthlyIndex;
  return {
    months: (raw?.series ?? [])
      .filter((p) => typeof p?.x === "string" && Number.isFinite(p?.value))
      .map((p) => ({ month: p.x, index: p.value })),
    unit: raw?.unit ?? "unknown",
    tier: raw?.tier ?? "unknown",
    modelled: raw?.fromModel === true,
  };
}
