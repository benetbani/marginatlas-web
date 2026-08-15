/**
 * src/lib/facts/shard.ts, the seam between a warehouse shard file and the
 * Fact accessor.
 *
 * WHY THIS MODULE EXISTS. A shard is one JSON object per entity: entityType
 * and entityId live ONCE on the wrapper, and every row underneath carries
 * only what varies, metric, value, rowKey, and so on. That is most of why
 * the shard files stay small. store.ts's Fact type is shaped for a QUERY
 * RESULT instead, and a query result mixes entities, so entityType and
 * entityId live on every fact there rather than once on a wrapper. Nothing
 * bridged that difference before this module: it widens a shard into the
 * per-fact shape the accessor holds, by copying the wrapper's identity onto
 * every row underneath it.
 *
 * WHY IT IS TRANSPORT-AGNOSTIC. shardToFacts takes an already-parsed shard
 * object and returns Fact[]. It does not read a file, fetch a URL, or query
 * a database. Whether shards eventually arrive as committed JSON, from an
 * API route, or from Supabase is still an open decision, and this module
 * must not prejudge it, so it stays a pure function of its input.
 */
import type { Fact, FactTag, EntityType } from "./types";

/**
 * The closed vocabularies from types.ts, mirrored here as runtime sets. A
 * TS union type is erased at runtime, so there is nothing to check an
 * untyped JSON value against without restating the members once, by hand.
 */
const KNOWN_ENTITY_TYPES: ReadonlySet<string> = new Set<EntityType>([
  "country",
  "city",
  "neighborhood",
  "industry",
  "cell",
]);
const KNOWN_TAGS: ReadonlySet<string> = new Set<FactTag>(["held", "modeled", "extrapolated", "placeholder"]);

/**
 * One row inside a shard's `facts` array. `tag` is a plain string, not yet
 * FactTag, because it arrives as parsed JSON and has not been checked
 * against the closed vocabulary yet.
 */
export type ShardFact = {
  rowKey: string;
  metric: string;
  value: number | string;
  unit: string | null;
  tag: string;
  c: number;
  period: string;
  methodId: string;
};

/**
 * The wrapper a warehouse run writes: one entity's identity, stated once,
 * plus its rows. `entityType` is a plain string for the same reason `tag`
 * is above, a JSON file carries no guarantee it names a kind we know.
 */
export type Shard = {
  entityType: string;
  entityId: string;
  facts: ShardFact[];
};

/**
 * Widen a shard into the Facts the accessor can hold alongside facts from
 * other entities' shards.
 *
 * Two rules protect a reader from a wrong, confident-sounding claim rather
 * than a visibly missing one.
 *
 * Rule 1: an unrecognised entityType returns an EMPTY array, never a
 * coerced one. A fact whose entity kind we do not understand cannot be
 * found by any query that narrows on entityType, so it would sit in the
 * store unreachable at best, or surface under a guessed, wrong kind at
 * worst. Neither is safe, so the whole shard is dropped instead of any one
 * fact in it being placed somewhere it does not belong.
 *
 * Rule 2: an unrecognised tag becomes "placeholder", never a guess at one
 * of the real tags. "placeholder" is the tag that already means treat this
 * value with the least trust, so mapping an unknown tag onto it is the one
 * mapping that cannot overstate a fact's reliability. A wrong confidence
 * claim is worse than a cautious one.
 */
export function shardToFacts(shard: Shard): Fact[] {
  if (!KNOWN_ENTITY_TYPES.has(shard.entityType)) {
    return [];
  }
  const entityType = shard.entityType as EntityType;
  const entityId = shard.entityId;

  return shard.facts.map((row) => ({
    entityType,
    entityId,
    rowKey: row.rowKey,
    metric: row.metric,
    value: row.value,
    unit: row.unit,
    tag: KNOWN_TAGS.has(row.tag) ? (row.tag as FactTag) : "placeholder",
    c: row.c,
    period: row.period,
    methodId: row.methodId,
  }));
}
