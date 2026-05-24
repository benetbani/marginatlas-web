/**
 * Section registry (Plan v32, Sprint G).
 *
 * Every cell-page section is a typed entry. The page composer reads
 * the registry, filters by the cell's industry + the data the cell
 * actually has + the viewer's tier, and renders the surviving
 * sections in priority order.
 *
 * This file is the library: types, decision rules, no React. The
 * actual SectionDef[] catalog lives next to it; per-section React
 * components live under src/components/sections/.
 *
 * Phase 0 ships the library and the catalog as a parallel system to
 * the existing cell-page composition. Migration of the live cell page
 * to read from this registry is a follow-up; doing it as a single
 * commit is too risky given the 894-line cell page.
 */

import type { Cell } from "@/lib/cells";
import type { ComponentType } from "react";

// ---------------------------------------------------------------------------
// Tier model
// ---------------------------------------------------------------------------

export type Tier = "free" | "pro" | "professional";

/** Tier ranking — higher tier sees everything lower tiers see. */
export const TIER_RANK: Record<Tier, number> = {
  free: 0,
  pro: 1,
  professional: 2,
};

export function viewerHasAccess(viewer: Tier, required: Tier): boolean {
  return TIER_RANK[viewer] >= TIER_RANK[required];
}

// ---------------------------------------------------------------------------
// SectionDef
// ---------------------------------------------------------------------------

/**
 * Predicate that decides whether a section applies to a cell, given
 * its industry / sector / data state. Allow-lists are checked first,
 * then the optional `customPredicate` for rules that don't fit a list.
 */
export type SectionAppliesTo = {
  /** Allow-list of industry_ids. Empty / undefined means "all industries". */
  industries?: string[];
  /** Allow-list of sector_ids (broader). */
  sectors?: string[];
  /** Deny-list — explicit "don't render on these industries". */
  excludeIndustries?: string[];
  /**
   * Custom predicate for rules that don't fit a static allow/deny list.
   * Example: "render only when cell is in a capital-intensive industry."
   */
  customPredicate?: (cell: Cell) => boolean;
};

/**
 * Names of fields that must be present (non-null, non-undefined) on
 * the cell for the section to render. Empty array = no data
 * requirement. Field names are dot-paths into the Cell type, e.g.
 * "cost_stack.rent_occupancy", "setup_costs.capital.property_fitout".
 */
export type RequiresData = string[];

export type SectionDef = {
  /** Stable id for analytics, deep-linking, anchor URLs. */
  id: string;
  /** Display title; can be overridden per cell at render time. */
  title: string;
  /** When the section applies (predicate over cell metadata). */
  appliesTo: SectionAppliesTo;
  /** Cell fields the section needs to render. Suppressed otherwise. */
  requiresData: RequiresData;
  /** Render order. Lower = earlier in the page flow. */
  priority: number;
  /** Tier gate. */
  tier: Tier;
  /**
   * Mobile collapse behavior. Per founder: expanders (sliver visible,
   * tap to expand) is the default. Sections that should always render
   * inline regardless of viewport can opt-out with `mobileCollapse: false`.
   */
  mobileCollapse?: boolean;
  /** The React component for this section. */
  Component: ComponentType<{ cell: Cell }>;
};

// ---------------------------------------------------------------------------
// Resolver — pick the sections that apply to a given cell + viewer
// ---------------------------------------------------------------------------

/** Read a dot-path field from a Cell. Returns undefined if any segment is null/undefined. */
function readPath(cell: Cell, path: string): unknown {
  const segments = path.split(".");
  let current: unknown = cell;
  for (const segment of segments) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function matchesAppliesTo(section: SectionDef, cell: Cell): boolean {
  const { appliesTo } = section;
  if (appliesTo.excludeIndustries && cell.industry_id &&
      appliesTo.excludeIndustries.includes(cell.industry_id)) {
    return false;
  }
  if (appliesTo.industries && appliesTo.industries.length > 0) {
    if (!cell.industry_id || !appliesTo.industries.includes(cell.industry_id)) {
      return false;
    }
  }
  if (appliesTo.sectors && appliesTo.sectors.length > 0) {
    if (!cell.sector_id || !appliesTo.sectors.includes(cell.sector_id)) {
      return false;
    }
  }
  if (appliesTo.customPredicate && !appliesTo.customPredicate(cell)) {
    return false;
  }
  return true;
}

function hasRequiredData(section: SectionDef, cell: Cell): boolean {
  for (const path of section.requiresData) {
    const value = readPath(cell, path);
    if (value == null) return false;
  }
  return true;
}

/**
 * Resolve which sections apply to this cell for this viewer. Returns
 * the matching SectionDef[] sorted by priority ascending. The cell
 * page composer maps this array to JSX.
 */
export function resolveSections(
  registry: readonly SectionDef[],
  cell: Cell,
  viewer: Tier = "free",
): SectionDef[] {
  const matches: SectionDef[] = [];
  for (const section of registry) {
    if (!viewerHasAccess(viewer, section.tier)) continue;
    if (!matchesAppliesTo(section, cell)) continue;
    if (!hasRequiredData(section, cell)) continue;
    matches.push(section);
  }
  matches.sort((a, b) => a.priority - b.priority);
  return matches;
}

/**
 * Diagnostic: same resolver but returns rich info about WHY each
 * section did or didn't make the cut. Used by the admin review page
 * and the audit tooling. Do not call from a render path; it's slow
 * relative to resolveSections.
 */
export type SectionResolution = {
  section: SectionDef;
  status: "rendered" | "tier-locked" | "off-industry" | "missing-data";
  missingFields?: string[];
};

export function diagnoseSections(
  registry: readonly SectionDef[],
  cell: Cell,
  viewer: Tier = "free",
): SectionResolution[] {
  const out: SectionResolution[] = [];
  for (const section of registry) {
    if (!viewerHasAccess(viewer, section.tier)) {
      out.push({ section, status: "tier-locked" });
      continue;
    }
    if (!matchesAppliesTo(section, cell)) {
      out.push({ section, status: "off-industry" });
      continue;
    }
    const missing: string[] = [];
    for (const path of section.requiresData) {
      if (readPath(cell, path) == null) missing.push(path);
    }
    if (missing.length > 0) {
      out.push({ section, status: "missing-data", missingFields: missing });
      continue;
    }
    out.push({ section, status: "rendered" });
  }
  return out;
}
