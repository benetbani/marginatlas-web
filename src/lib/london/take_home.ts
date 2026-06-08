/**
 * src/lib/london/take_home.ts
 *
 * Tiny typed accessor for the curated London owner take-home, read from the
 * London market dataset. Lives in lib so presentation / API code never imports
 * data/ directly (the layering gate). Mirrors the cell board's London-first
 * preference (cell_board.getLondonEntry) so a revealed London figure matches
 * exactly what the board would have shown for that GB cell.
 */
import { industryToSlug } from "@/lib/taxonomy";
import type { Cell } from "@/lib/cells";
import londonJson from "../../../data/london/london_market_v1.json";

type LondonActivity = { economics?: { owner_take_home?: number } };
const ACTIVITIES = (londonJson as { activities: Record<string, LondonActivity> })
  .activities;

/**
 * Curated after-tax owner take-home (USD per year) for this GB cell's activity,
 * or null for non-GB cells and activities not present in the dataset.
 */
export function londonOwnerTakeHome(cell: Cell): number | null {
  if (cell.country !== "GB" || !cell.industry_id) return null;
  const v = ACTIVITIES[industryToSlug(cell.industry_id)]?.economics?.owner_take_home;
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
