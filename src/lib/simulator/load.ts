/**
 * src/lib/simulator/load.ts , THE CALCULATOR'S ONE DATABASE READ (plan 2026-10-13 cost-simulator, Task 2): the place's trade cell through
 * getCellBySlug inside withBudget, so a slow or failing read leaves the defaults to the shards (the sales withheld where no register holds them,
 * the money to open built or the archetype's) and never breaks the page. Server only; the chain's tests never import this file
 * (src/lib/cells.ts builds the database client at import) and build bundles with defaults.ts directly.
 * ITS BLIND SPOT, stated: withBudget logs a timeout and nothing else, so a fast failure reads as a cell that holds nothing (CLAUDE.md, rule 2).
 */
import { getCellBySlug, withBudget } from "@/lib/cells";
import { cellFacts, type CellFacts } from "./cell_facts";
import { buildBundle } from "./defaults";
import type { Place } from "./place";
import type { SimBundle } from "./bundle";

const CELL_BUDGET_MS = 1500;

export async function loadSimulatorCell(place: Place): Promise<CellFacts | null> {
  if (!place.city) return null;
  const cell = await withBudget(getCellBySlug(place.country, place.city, place.trade).catch(() => null), null, CELL_BUDGET_MS, "calculator-cell");
  return cellFacts(cell, place);
}

export async function loadPlaceBundle(place: Place): Promise<SimBundle> {
  return buildBundle(place, { cell: await loadSimulatorCell(place) });
}
