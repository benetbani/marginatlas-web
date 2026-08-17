/**
 * src/lib/london/take_home.ts
 *
 * Tiny typed accessor for the curated London owner take-home, read from the
 * London market dataset through its single loader (src/lib/london/market.ts,
 * which closes the revenue x net-margin identity the raw file broke on all
 * twenty activities). Lives in lib so presentation / API code never imports
 * data/ directly (the layering gate). Mirrors the cell board's London-first
 * preference (cell_board.getLondonEntry) so a revealed London figure matches
 * exactly what the board would have shown for that GB cell.
 */
import { industryToSlug } from "@/lib/taxonomy";
import type { Cell } from "@/lib/cells";
import { LONDON_MARKET } from "@/lib/london/market";

type LondonActivity = { economics?: { owner_take_home?: number } };
const ACTIVITIES = (
  LONDON_MARKET as { activities: Record<string, LondonActivity> }
).activities;

/**
 * Curated after-tax owner take-home (USD per year) for this GB cell's activity,
 * or null for non-GB cells and activities not present in the dataset. This is
 * the activity's curated revenue times its curated net margin, the same figure
 * every other London surface shows.
 */
export function londonOwnerTakeHome(cell: Cell): number | null {
  if (cell.country !== "GB" || !cell.industry_id) return null;
  const v = ACTIVITIES[industryToSlug(cell.industry_id)]?.economics?.owner_take_home;
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
