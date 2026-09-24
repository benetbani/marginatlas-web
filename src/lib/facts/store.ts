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
 *
 * A PLACEHOLDER NEVER LEAVES THIS MODULE UNASKED (2026-09-23 night). The bank
 * tags a slot waiting on research `placeholder`; it is not a figure and the
 * site never prints one. Two new builders read one each as "modelled" in a
 * single evening, because each mapped every tag that is not `held` to
 * "modeled" and nothing here stopped them: London's twelve-month calendar,
 * printed on the exemplar and on production, and North Korea's household
 * budget, built but never served because /kp is a 404 (North Korea is not in
 * the site's country list), which was luck, not law. So the refusal lives at
 * the one seam every builder reads through: `queryFacts` drops a placeholder
 * unless the query asks with `placeholders: "include"`, and `factValue` and
 * every shard accessor inherit it. A caller asks only to withhold a figure
 * with the line that says what it is; `scripts/verify_placeholder_never_printed.ts`
 * holds every ask to a named list and proves the refusal on the real bank.
 */
import type { Fact, FactQuery, PlaceholderOption } from "./types";

let FACTS: Fact[] = [];

/* THE ENTITY INDEX (2026-09-24, the goal's E8). `queryFacts` scanned every
   loaded fact on every query, and a sweep that loads all 243 industry shards
   asks tens of thousands of queries: profiled, 294 of the archetype copy
   gate's 364 seconds were this scan (`queryFacts` and its filter), and the
   gate stood 349 s inside the chain against its 360 s budget. Every hot query
   names one entity, so the loaded set is indexed by `entityId`, each list in
   the set's own order, which keeps every answer identical to the full scan's.
   The shard loaders only ever append (`loadFacts(allFacts().concat(...))`),
   so a load that keeps the indexed prefix extends the index; any other load
   rebuilds it on the next query. */
let BY_ENTITY: Map<string, Fact[]> | null = null;
let INDEXED = 0;

/** Replace the loaded set. Used by the shard loader and by tests. */
export function loadFacts(facts: Fact[]): void {
  const keepsPrefix = BY_ENTITY !== null && INDEXED > 0 && facts.length >= INDEXED && facts[0] === FACTS[0] && facts[INDEXED - 1] === FACTS[INDEXED - 1];
  FACTS = facts;
  if (!keepsPrefix) {
    BY_ENTITY = null;
    INDEXED = 0;
  }
}

/** The index, extended over whatever was appended since it was last read. */
function entityIndex(): Map<string, Fact[]> {
  if (BY_ENTITY === null) {
    BY_ENTITY = new Map();
    INDEXED = 0;
  }
  for (; INDEXED < FACTS.length; INDEXED++) {
    const f = FACTS[INDEXED];
    const list = BY_ENTITY.get(f.entityId);
    if (list) list.push(f);
    else BY_ENTITY.set(f.entityId, [f]);
  }
  return BY_ENTITY;
}

/** Every fact currently loaded. */
export function allFacts(): readonly Fact[] {
  return FACTS;
}

/**
 * Answer a query. Every field narrows; an omitted field means "any", except
 * a placeholder, which is dropped unless the query carries
 * `placeholders: "include"` (the header says why).
 * A metric ending in "." is a PREFIX and takes the whole domain under it.
 * Always returns an array: no caller ever has to null-check.
 */
export function queryFacts(q: FactQuery): Fact[] {
  const withPlaceholders = q.placeholders === "include";
  const pool = q.entityId ? (entityIndex().get(q.entityId) ?? []) : FACTS;
  return pool.filter((f) => {
    if (!withPlaceholders && f.tag === "placeholder") return false;
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

/** The single value for a scalar metric on one entity, or null; a placeholder only when asked (queryFacts' law). */
export function factValue(entityId: string, metric: string, opts: PlaceholderOption = {}): Fact | null {
  const hits = queryFacts({ entityId, metrics: [metric], rowKey: "", ...opts });
  return hits.length > 0 ? hits[0] : null;
}
