/**
 * src/lib/facts/store.ts , THE seam onto the warehouse.
 *
 * WHY THIS IS ONE MODULE AND NOT FORTY-ONE. Before it, 41 modules imported a
 * page-shaped JSON from data/ directly and every page type had its own reader.
 * An MCP server or a public API would have needed a second implementation of all
 * of them. Everything now goes through one FactQuery, so a new consumer is an
 * adapter over this interface rather than a parallel data layer.
 *
 * The deletion test: removing this module does not move complexity, it
 * reappears in every caller. That is what earns its keep.
 *
 * It was put in place before any consumer existed, deliberately, so the first
 * consumer would not get to invent its own shape. THE FIRST CONSUMER ARRIVED
 * on 2026-09-17: src/lib/facts/city_shard.ts reads one city's shard into this
 * store on demand, and src/lib/spine/fact_rows.ts asks it, through factValue,
 * for the living costs, the rent-to-pay ratio and the spend per resident the
 * city page draws. Nothing else reads it yet.
 */
import type { Fact, FactQuery } from "./types";

let FACTS: Fact[] = [];

/** Replace the loaded set. Used by the shard loader and by tests. */
export function loadFacts(facts: Fact[]): void {
  FACTS = facts;
}

/** Every fact currently loaded. */
export function allFacts(): readonly Fact[] {
  return FACTS;
}

/**
 * Answer a query. Every field narrows; an omitted field means "any".
 * A metric ending in "." is a PREFIX and takes the whole domain under it.
 * Always returns an array: no caller ever has to null-check.
 */
export function queryFacts(q: FactQuery): Fact[] {
  return FACTS.filter((f) => {
    if (q.entityType && f.entityType !== q.entityType) return false;
    if (q.entityId && f.entityId !== q.entityId) return false;
    if (q.rowKey !== undefined && f.rowKey !== q.rowKey) return false;
    if (q.period && f.period !== q.period) return false;
    if (q.minConfidence != null && f.c < q.minConfidence) return false;
    if (q.metrics && q.metrics.length > 0) {
      const hit = q.metrics.some((m) =>
        m.endsWith(".") ? f.metric.startsWith(m) : f.metric === m,
      );
      if (!hit) return false;
    }
    return true;
  });
}

/** The single value for a scalar metric on one entity, or null. */
export function factValue(entityId: string, metric: string): Fact | null {
  const hits = queryFacts({ entityId, metrics: [metric], rowKey: "" });
  return hits.length > 0 ? hits[0] : null;
}
