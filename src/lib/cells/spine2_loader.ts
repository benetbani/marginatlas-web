/**
 * src/lib/cells/spine2_loader.ts
 *
 * The typed door onto the hand-filled spine-2 cell files (data/cells/*.json).
 *
 * Exactly one cell file exists today (restaurants in London). Every other
 * (country, geo, industry) triple in the lattice resolves to null, and the
 * route falls straight through to the render it has always had. That is the
 * launch state, not an edge case: the spine-2 page ships one cell at a time,
 * each only once its file is built, reconciled and gated.
 *
 * The domain layer owns this import so no page or component ever reaches into
 * data/*.json itself (the layering gate enforces exactly that).
 */
import restaurantsInLondon from "../../../data/cells/restaurants-in-london.json";

import type { CellFile } from "./spine2_types";

/**
 * The cell-file registry, keyed by the live route path. A key exists if and
 * only if a reconciled file exists; there is no placeholder entry.
 */
const CELL_FILES: Record<string, CellFile> = {
  "gb/london/restaurants": restaurantsInLondon as unknown as CellFile,
};

function key(country: string, geo: string, industry: string): string {
  return `${country}/${geo}/${industry}`.toLowerCase();
}

/** The cell file for a route triple, or null when none has been built yet. */
export function loadSpine2Cell(
  country: string,
  geo: string,
  industry: string,
): CellFile | null {
  return CELL_FILES[key(country, geo, industry)] ?? null;
}

/** True when a spine-2 file exists for this triple. */
export function hasSpine2Cell(
  country: string,
  geo: string,
  industry: string,
): boolean {
  return loadSpine2Cell(country, geo, industry) != null;
}

/** Every route triple that currently has a file; used by callers that enumerate. */
export function spine2CellRoutes(): Array<{
  country: string;
  geo: string;
  industry: string;
}> {
  return Object.keys(CELL_FILES).map((k) => {
    const [country, geo, industry] = k.split("/");
    return { country, geo, industry };
  });
}
