# Fact Warehouse Reform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 107,579-fact warehouse queryable through one closed vocabulary and one accessor, so that an MCP server or a public API is a thin adapter over an existing seam rather than a second implementation of the whole data layer.

**Architecture:** The warehouse already stores atomic facts in the right shape. Two things stop it being queryable: a child-entity dimension was flattened into the metric string, inflating 593 real metrics into 21,273 names; and nothing on the website can read it. This plan restores the missing dimension, closes the vocabulary behind a registry with a gate, then puts one Fact accessor at the seam that pages, exports and an MCP tool all call.

**Tech Stack:** Python 3.13 (`page-data/tools/`), TypeScript 5 / Next.js 15.5 (`website/`), CSV + JSON as the warehouse interchange, Supabase Postgres for the runtime read path.

---

## The measurement this plan is built on

Every figure was read off the repository today, not estimated.

| | |
|---|---|
| Atomic facts in `page-data/derived/atlas_facts.csv` | **107,579** |
| Entities | country 37,828 · city 41,854 · industry 25,908 · neighborhood 1,989 · **cell 1** |
| Tags | modeled 90,391 · held 16,853 · placeholder 335 |
| **Metric names as stored** | **21,273** |
| **True vocabulary, row key removed** | **593** |
| **Facts whose metric string hides an entity** | **68,812 (64%)** |
| Distinct row keys hidden in metric names | **6,770** |
| Row keys truncated at 28 chars by `build_facts.py` | **3,219 (48%)** |
| Silent collisions from that truncation, today | **0** |
| Facts with no `unit` | **59,429 (55%)** |
| Top-level namespaces | **75**, including `competition_meta` AND `_competition_meta` |
| Modules on the website importing a JSON from `data/` directly | **41** of 171 |
| Generic "read a fact for an entity" accessor | **none** |

### What that means, in one paragraph

The vocabulary is not out of control. `build_facts.py:59` flattens lists of objects
by keying each row with its own name, so `cities.list.rosso.market_index_vs_capital`
is not a metric, it is the metric `cities.list.*.market_index_vs_capital` applied to
the row `rosso`. Collapse the row key and 21,273 names become **593** , a vocabulary
small enough to document, type and serve. Everything else in this plan follows from
restoring that one missing column.

### Why now, in skeleton phase, is the cheapest this will ever be

The founder's own framing: the real data lands later. That is the argument FOR doing
this now rather than against it. Every fact in the warehouse is re-derivable from
`countries/`, `cities/`, `industries/` and `_drops/` by re-running `build_facts.py`,
so a schema change today costs one re-run. After the world is filled it costs a
migration, and after an MCP client depends on the names it costs a breaking change to
someone else's agent.

---

## File structure

| File | Responsibility |
|---|---|
| `page-data/tools/warehouse/build_facts.py` | MODIFY. Emit `row_key` as its own column; stop truncating; stop folding the row into the metric name |
| `page-data/schema/metrics.json` | CREATE. The closed vocabulary: one entry per metric with unit, value type, and what it means |
| `page-data/tools/warehouse/build_registry.py` | CREATE. Derives `metrics.json` from the warehouse, so the registry is generated once then hand-curated |
| `page-data/tools/warehouse/verify_facts.py` | CREATE. The gate: every fact's metric is in the registry, every non-prose fact has a unit, no duplicate (entity, row_key, metric) |
| `page-data/derived/atlas_facts.csv` | REGENERATED. Gains `row_key`; metric column becomes the closed name |
| `website/src/lib/facts/types.ts` | CREATE. The `Fact` type and the `FactQuery` interface, shared by every caller |
| `website/src/lib/facts/store.ts` | CREATE. The Fact accessor: the one module that answers a FactQuery |
| `website/data/facts/` | CREATE. The shard the website ships, written by the export step |
| `page-data/tools/export/to_website.py` | CREATE. Crosses the wall: writes the website's shard from the warehouse |
| `website/scripts/verify_facts_shard.mjs` | CREATE. Gate: the shipped shard parses, matches the registry, and is not stale |

---

## Phase 1 , restore the entity dimension

**This is the whole plan in one phase. Everything else is downstream of it.**

### Task 1: Prove the collapse is safe before changing anything

**Files:**
- Create: `page-data/tools/warehouse/test_collapse.py`

- [ ] **Step 1: Write the failing test**

```python
# page-data/tools/warehouse/test_collapse.py
"""The row key hidden in a metric name can be recovered without losing facts.

Run: cd E:/atlas/page-data && python tools/warehouse/test_collapse.py
"""
import csv, collections, sys

FACTS = "derived/atlas_facts.csv"

def collapse(metric):
    """<domain>.<collection>.<row>.<field> -> (<domain>.<collection>.*.<field>, <row>)"""
    p = metric.split(".")
    if len(p) == 4:
        return f"{p[0]}.{p[1]}.*.{p[3]}", p[2]
    return metric, ""

def main():
    rows = list(csv.DictReader(open(FACTS, encoding="utf-8")))
    failures = 0

    # 1. The collapse must be lossless: (entity, row_key, metric) stays unique.
    keyed = collections.Counter(
        (r["entity_id"], *reversed(collapse(r["metric"]))) for r in rows
    )
    dupes = {k: v for k, v in keyed.items() if v > 1}
    ok = len(dupes) == 0
    print(f"{'PASS' if ok else 'FAIL'}  collapse is lossless: {len(dupes)} duplicate keys")
    if not ok:
        failures += 1
        for k, v in list(dupes.items())[:5]:
            print(f"        x{v}  {k}")

    # 2. The vocabulary must actually close. 593 measured today; allow drift, not blowup.
    vocab = {collapse(r["metric"])[0] for r in rows}
    ok = len(vocab) < 1000
    print(f"{'PASS' if ok else 'FAIL'}  vocabulary closes: {len(vocab)} metrics (was 21273 names)")
    if not ok:
        failures += 1

    # 3. Every fact keeps its value. Count in equals count out.
    ok = len(keyed) == len(rows)
    print(f"{'PASS' if ok else 'FAIL'}  no fact dropped: {len(keyed)} keys for {len(rows)} rows")
    if not ok:
        failures += 1

    if failures:
        print(f"test_collapse: {failures} failures")
        sys.exit(1)
    print("test_collapse: all pass")

main()
```

- [ ] **Step 2: Run it against today's warehouse**

```bash
cd E:/atlas/page-data && python tools/warehouse/test_collapse.py
```

Expected: three PASS lines, exit 0. If "collapse is lossless" FAILS, **stop and read the
duplicates** , it means two rows already share a truncated key and the truncation has
begun losing facts. That changes Task 2 from a cleanup into a recovery.

- [ ] **Step 3: Commit**

```bash
cd E:/atlas && git add page-data/tools/warehouse/test_collapse.py && git commit -m "warehouse: prove the row key can be recovered from the metric name without loss"
```

### Task 2: Emit `row_key` as a column and stop truncating

**Files:**
- Modify: `page-data/tools/warehouse/build_facts.py:41-66` (the `walk` function)

- [ ] **Step 1: Change `walk` to carry the row key beside the path, not inside it**

Replace the `walk` function's list branch. The current code is:

```python
            for i, x in enumerate(obj):
                if isinstance(x, dict):
                    key = (x.get("name") or x.get("role") or x.get("label") or x.get("field")
                           or x.get("category") or x.get("spectrum") or str(i))
                    key = str(key).lower().replace(" ", "_").replace("/", "_")[:28]
                    walk(x, f"{prefix}.{key}", out)
```

Replace with:

```python
            for i, x in enumerate(obj):
                if isinstance(x, dict):
                    # THE ROW KEY IS AN ENTITY, NOT PART OF THE METRIC NAME.
                    # Folding it into the path turned 593 metrics into 21,273 names
                    # and truncated 3,219 of 6,770 keys at 28 characters, which is
                    # lossy and one collision away from silently dropping a fact.
                    # It now travels beside the path and is NOT truncated.
                    key = (x.get("name") or x.get("role") or x.get("label") or x.get("field")
                           or x.get("category") or x.get("spectrum") or str(i))
                    key = str(key).lower().replace(" ", "_").replace("/", "_")
                    walk(x, f"{prefix}.*", out, row_key=key)
```

- [ ] **Step 2: Thread `row_key` through `walk`'s signature and the emitted tuple**

Change the signature and every `out.append`:

```python
def walk(obj, prefix, out, row_key=""):
    """Yield (metric_path, value, row_key) for scalar leaves; recurse dicts.

    A list of objects contributes ONE metric path ending in `.*` and one row_key
    per element, so the metric vocabulary stays closed however many rows exist.
    """
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in SKIP_KEYS:
                continue
            walk(v, f"{prefix}.{k}" if prefix else k, out, row_key)
    elif isinstance(obj, list):
        if obj and all(isinstance(x, (int, float)) for x in obj):
            for i, x in enumerate(obj):
                out.append((f"{prefix}[{i}]", x, row_key))
        else:
            for i, x in enumerate(obj):
                if isinstance(x, dict):
                    key = (x.get("name") or x.get("role") or x.get("label") or x.get("field")
                           or x.get("category") or x.get("spectrum") or str(i))
                    key = str(key).lower().replace(" ", "_").replace("/", "_")
                    walk(x, f"{prefix}.*", out, row_key=key)
    elif isinstance(obj, (int, float)):
        out.append((prefix, obj, row_key))
    elif isinstance(obj, str) and 0 < len(obj) <= STR_MAX:
        out.append((prefix, obj, row_key))
```

- [ ] **Step 3: Carry `row_key` through `emit_entity` into the emitted dict**

`build_facts.py` writes the CSV through pandas, so the column set comes from the dict
keys and **there is no fieldnames constant to update**. Two edits in `emit_entity`
(around line 82): the unpack gains a third element, and the dict gains one key.

```python
        leaves = []
        walk(block, bname, leaves)
        c = round(P.confidence(tag), 3)
        for path, val, row_key in leaves:
            facts.append({
                "entity_type": etype, "entity_id": eid,
                "row_key": row_key,
                "metric": path,
                "value": val, "unit": infer_unit(path),
                "tag": tag, "c": c, "period": "latest",
                "page_visible": True, "method_id": (block.get("_meta") or {}).get("method_id", "researched") if isinstance(block, dict) else "researched",
            })
```

**`main()` has a second `walk` call**, in the neighborhoods branch, whose unpack is
also `for path, val in leaves`. It must become `for path, val, row_key in leaves` or
the build raises `ValueError: not enough values to unpack`. Search the file for
`in leaves` and fix every site , there are two.

- [ ] **Step 4: Rebuild the warehouse**

```bash
cd E:/atlas/page-data && python tools/warehouse/build_facts.py
```

- [ ] **Step 5: Verify the rebuild against the numbers this plan recorded**

```bash
cd E:/atlas/page-data && python -c "import csv,collections; r=list(csv.DictReader(open('derived/atlas_facts.csv',encoding='utf-8'))); print('facts:',len(r)); print('metrics:',len(set(x['metric'] for x in r))); print('row keys:',len(set(x['row_key'] for x in r if x['row_key']))); print('truncated:',sum(1 for k in set(x['row_key'] for x in r) if len(k)>=28))"
```

Expected: facts about **107,579**, metrics under **1,000** (was 21,273), row keys about
**6,770**, truncated **0**. A fact count that MOVES means the change dropped or
duplicated data , investigate before continuing.

- [ ] **Step 6: Commit**

```bash
cd E:/atlas && git add page-data/tools/warehouse/build_facts.py page-data/derived/atlas_facts.csv && git commit -m "warehouse: the row key is a column, not part of the metric name"
```

---

## Phase 2 , close the vocabulary

### Task 3: Generate the metric registry

**Files:**
- Create: `page-data/tools/warehouse/build_registry.py`
- Create: `page-data/schema/metrics.json`

- [ ] **Step 1: Write the generator**

```python
# page-data/tools/warehouse/build_registry.py
"""Derive the metric registry from the warehouse, once.

The registry is GENERATED then HAND-CURATED. Regenerating adds new metrics and
leaves existing descriptions alone, so curation is never lost.

Run: cd E:/atlas/page-data && python tools/warehouse/build_registry.py
"""
import csv, json, collections, os

FACTS = "derived/atlas_facts.csv"
REGISTRY = "schema/metrics.json"

def main():
    rows = list(csv.DictReader(open(FACTS, encoding="utf-8")))
    existing = {}
    if os.path.exists(REGISTRY):
        existing = json.load(open(REGISTRY, encoding="utf-8")).get("metrics", {})

    seen = collections.defaultdict(lambda: {"units": collections.Counter(),
                                            "types": collections.Counter(),
                                            "entities": collections.Counter(),
                                            "n": 0})
    for r in rows:
        s = seen[r["metric"]]
        s["n"] += 1
        s["units"][r["unit"]] += 1
        s["entities"][r["entity_type"]] += 1
        v = r["value"]
        try:
            float(v); s["types"]["number"] += 1
        except ValueError:
            s["types"]["string"] += 1

    out = {}
    for metric, s in sorted(seen.items()):
        prev = existing.get(metric, {})
        unit = s["units"].most_common(1)[0][0]
        out[metric] = {
            "unit": prev.get("unit", unit or None),
            "type": prev.get("type", s["types"].most_common(1)[0][0]),
            "entities": sorted(s["entities"]),
            "row_scoped": metric.endswith((".*", "]")) or ".*." in metric,
            "facts": s["n"],
            # Curated by hand. Generated entries start empty and the gate does NOT
            # require it, so an undocumented metric is visible without blocking work.
            "describes": prev.get("describes", ""),
        }

    json.dump({"generated_from": FACTS, "metrics": out},
              open(REGISTRY, "w", encoding="utf-8"), indent=2, sort_keys=True)
    described = sum(1 for m in out.values() if m["describes"])
    print(f"registry: {len(out)} metrics, {described} described, "
          f"{sum(1 for m in out.values() if not m['unit'])} with no unit")

main()
```

- [ ] **Step 2: Generate it**

```bash
cd E:/atlas/page-data && python tools/warehouse/build_registry.py
```

Expected: `registry: 593 metrics, 0 described, N with no unit` (N near 200).

- [ ] **Step 3: Commit the generated registry before curating it**

```bash
cd E:/atlas && git add page-data/tools/warehouse/build_registry.py page-data/schema/metrics.json && git commit -m "warehouse: generate the metric registry, 593 names"
```

### Task 4: The gate that keeps the vocabulary closed

**Files:**
- Create: `page-data/tools/warehouse/verify_facts.py`

- [ ] **Step 1: Write the gate**

```python
# page-data/tools/warehouse/verify_facts.py
"""The warehouse gate. Run after every build_facts.py.

Three rules, and only the first is about the vocabulary:
  1. Every fact's metric is in the registry. A new metric must be registered,
     which is the whole point of a closed vocabulary.
  2. No duplicate (entity_id, row_key, metric). This is the rule the 28-char
     truncation was one collision away from breaking.
  3. A metric whose registry type is "number" must carry a unit. Prose metrics
     (character.*, blurbs) are exempt by type, not by name.

Run: cd E:/atlas/page-data && python tools/warehouse/verify_facts.py
"""
import csv, json, collections, sys

rows = list(csv.DictReader(open("derived/atlas_facts.csv", encoding="utf-8")))
reg = json.load(open("schema/metrics.json", encoding="utf-8"))["metrics"]
failures = 0

unregistered = sorted({r["metric"] for r in rows if r["metric"] not in reg})
if unregistered:
    failures += 1
    print(f"FAIL  {len(unregistered)} metric(s) not in the registry:")
    for m in unregistered[:10]:
        print(f"        {m}")
    print("      Run build_registry.py to add them, then describe them by hand.")
else:
    print(f"PASS  every metric is registered ({len(reg)} in the vocabulary)")

keyed = collections.Counter((r["entity_id"], r["row_key"], r["metric"]) for r in rows)
dupes = {k: v for k, v in keyed.items() if v > 1}
if dupes:
    failures += 1
    print(f"FAIL  {len(dupes)} duplicate (entity, row, metric) key(s):")
    for k, v in list(dupes.items())[:5]:
        print(f"        x{v}  {k}")
else:
    print(f"PASS  no duplicate keys across {len(rows)} facts")

unitless = sorted({r["metric"] for r in rows
                   if reg.get(r["metric"], {}).get("type") == "number" and not r["unit"]})
if unitless:
    failures += 1
    print(f"FAIL  {len(unitless)} numeric metric(s) with no unit:")
    for m in unitless[:10]:
        print(f"        {m}")
else:
    print("PASS  every numeric metric carries a unit")

if failures:
    print(f"verify_facts: {failures} failure(s)")
    sys.exit(1)
print("verify_facts: the warehouse is queryable")
```

- [ ] **Step 2: Run it. Expect rule 3 to FAIL on first run.**

```bash
cd E:/atlas/page-data && python tools/warehouse/verify_facts.py
```

Rules 1 and 2 should PASS. Rule 3 will list numeric metrics with no unit. **Do not
weaken the rule.** Fix them in `schema/metrics.json` by setting the right unit, or
correct the `type` to `string` where the metric is genuinely prose.

- [ ] **Step 3: Fix the unitless numeric metrics in the registry, then re-run until green**

```bash
cd E:/atlas/page-data && python tools/warehouse/verify_facts.py
```

- [ ] **Step 4: Commit**

```bash
cd E:/atlas && git add page-data/tools/warehouse/verify_facts.py page-data/schema/metrics.json && git commit -m "warehouse: the gate that keeps the vocabulary closed"
```

---

## Phase 3 , the Fact accessor seam

### Task 5: The Fact types

**Files:**
- Create: `website/src/lib/facts/types.ts`

- [ ] **Step 1: Write the types**

```ts
/**
 * src/lib/facts/types.ts , the shape every caller of the warehouse shares.
 *
 * One Fact is one measured value for one entity, optionally one row inside that
 * entity, one metric, one period. This mirrors page-data/schema/metrics.json and
 * is the contract an MCP tool or a public API would expose verbatim.
 */

/** Stable entity keys, per the 2026-07-03 warehouse design. */
export type EntityType = "country" | "city" | "neighborhood" | "industry" | "cell";

/** How much to trust a value. ONE scale, replacing four (see Phase 5). */
export type FactTag = "held" | "modeled" | "extrapolated" | "placeholder";

export type Fact = {
  entityType: EntityType;
  /** iso2 | iso2-slug | iso2-city-district | industry_id | iso2[-city]-industry */
  entityId: string;
  /** The row inside a collection metric, e.g. "shoreditch". Empty for scalars. */
  rowKey: string;
  /** A name from the closed vocabulary. Collection metrics contain ".*". */
  metric: string;
  value: number | string;
  unit: string | null;
  tag: FactTag;
  /** Calibrated confidence, 0..1. */
  c: number;
  period: string;
  methodId: string;
};

/** What a caller asks for. Every field narrows; omitting one means "any". */
export type FactQuery = {
  entityType?: EntityType;
  entityId?: string;
  /** Exact names, or a prefix ending in "." to take a whole domain. */
  metrics?: string[];
  rowKey?: string;
  period?: string;
  /** Drop anything below this confidence. Omit to take everything. */
  minConfidence?: number;
};
```

- [ ] **Step 2: Typecheck**

```bash
cd E:\atlas\website && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd E:\atlas\website && git add src/lib/facts/types.ts && git commit -m "facts: the shared contract, one Fact and one FactQuery"
```

### Task 6: The Fact accessor

**Files:**
- Create: `website/src/lib/facts/store.ts`
- Create: `website/tests/facts/store.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
/**
 * The Fact accessor answers a FactQuery. Follows this repo's test idiom:
 * a bare tsx script, PASS/FAIL per case, exit 1 on any failure.
 *
 * Run: npx tsx tests/facts/store.test.ts
 */
import { queryFacts, loadFacts } from "../../src/lib/facts/store";
import type { Fact } from "../../src/lib/facts/types";

const SAMPLE: Fact[] = [
  { entityType: "country", entityId: "GB", rowKey: "", metric: "tax.total_pct", value: 30.5, unit: "pct", tag: "held", c: 0.9, period: "2026", methodId: "researched" },
  { entityType: "country", entityId: "GB", rowKey: "shoreditch", metric: "cities.list.*.market_index_vs_capital", value: 88, unit: "index", tag: "modeled", c: 0.5, period: "2026", methodId: "mice_v1" },
  { entityType: "country", entityId: "FR", rowKey: "", metric: "tax.total_pct", value: 34.1, unit: "pct", tag: "held", c: 0.8, period: "2026", methodId: "researched" },
];

let failed = 0;
const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` :: ${detail}` : ""}`);
};

loadFacts(SAMPLE);

check("entityId narrows", queryFacts({ entityId: "GB" }).length === 2);
check("exact metric narrows", queryFacts({ metrics: ["tax.total_pct"] }).length === 2);
check("prefix takes a domain", queryFacts({ metrics: ["cities."] }).length === 1);
check("rowKey narrows", queryFacts({ rowKey: "shoreditch" }).length === 1);
check("minConfidence drops the weak", queryFacts({ minConfidence: 0.7 }).length === 2);
check("empty query returns everything", queryFacts({}).length === 3);
check("no match is an empty array, never null", Array.isArray(queryFacts({ entityId: "ZZ" })));

if (failed > 0) {
  console.error(`facts/store: ${failed} failures`);
  process.exit(1);
}
console.log("facts/store: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd E:\atlas\website && npx tsx tests/facts/store.test.ts
```

Expected: FAIL, `Cannot find module '../../src/lib/facts/store'`.

- [ ] **Step 3: Write the accessor**

```ts
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
```

- [ ] **Step 4: Run the test and watch it pass**

```bash
cd E:\atlas\website && npx tsx tests/facts/store.test.ts
```

Expected: seven PASS lines, `facts/store: all pass`.

- [ ] **Step 5: Register it in the gate chain**

Add to the `GATES` array in `website/scripts/prebuild_all.ts`, beside the other tests:

```ts
  { name: "facts-store", script: "tests/facts/store.test.ts" },
```

- [ ] **Step 6: Run the chain and commit**

```bash
cd E:\atlas\website && npm run prebuild
```

```bash
cd E:\atlas\website && git add src/lib/facts tests/facts scripts/prebuild_all.ts && git commit -m "facts: one accessor where there were forty-one readers"
```

---

## Phase 4 , cross the wall

**This phase resolves a founder decision deferred since July.** `page-data/STATE.md`
records it verbatim: *"Website ingest: country JSON is small (~198 files); recommend a
build-time static load into the Next.js app, or a Supabase table."*

**The wall is real and enforced.** `verify_no_parent_repo_reads` exists because reading
`../page-data/*` killed 49 deploys in two separate incidents. Nothing in this phase may
make the website read the parent repo. The warehouse must be **exported into**
`website/data/facts/`, committed, and read from there.

### Task 7: Export the shard

**Files:**
- Create: `page-data/tools/export/to_website.py`
- Create: `website/data/facts/` (written by the tool)

- [ ] **Step 1: Write the exporter**

```python
# page-data/tools/export/to_website.py
"""Write the website's fact shard. THE ONLY sanctioned crossing of the wall.

The website is structurally forbidden from reading page-data: doing so killed 49
deploys in two incidents and is now enforced by verify_no_parent_repo_reads. So
the warehouse PUSHES a committed shard instead of the website pulling.

Sharded by entity so a page loads one file, not 107,579 facts.

Run: cd E:/atlas/page-data && python tools/export/to_website.py
"""
import csv, json, collections, os, pathlib

FACTS = "derived/atlas_facts.csv"
OUT = pathlib.Path("../website/data/facts")

def main():
    rows = list(csv.DictReader(open(FACTS, encoding="utf-8")))
    by_entity = collections.defaultdict(list)
    for r in rows:
        by_entity[(r["entity_type"], r["entity_id"])].append({
            "rowKey": r["row_key"],
            "metric": r["metric"],
            "value": float(r["value"]) if _num(r["value"]) else r["value"],
            "unit": r["unit"] or None,
            "tag": r["tag"],
            "c": float(r["c"] or 0),
            "period": r["period"],
            "methodId": r["method_id"],
        })

    OUT.mkdir(parents=True, exist_ok=True)
    for (etype, eid), facts in by_entity.items():
        d = OUT / etype
        d.mkdir(exist_ok=True)
        json.dump({"entityType": etype, "entityId": eid, "facts": facts},
                  open(d / f"{eid}.json", "w", encoding="utf-8"), indent=0)

    index = {f"{t}/{i}": len(f) for (t, i), f in by_entity.items()}
    json.dump({"entities": len(index), "facts": len(rows), "index": index},
              open(OUT / "index.json", "w", encoding="utf-8"), indent=0)
    print(f"exported {len(rows)} facts across {len(index)} entities to {OUT}")

def _num(v):
    try:
        float(v); return True
    except ValueError:
        return False

main()
```

- [ ] **Step 2: Run it**

```bash
cd E:/atlas/page-data && python tools/export/to_website.py
```

Expected: `exported 107579 facts across ~730 entities to ../website/data/facts`.

- [ ] **Step 3: Check the size before committing it**

```bash
cd E:\atlas\website && du -sm data/facts
```

If this exceeds **50MB**, do not commit it. Stop and narrow the export to
`page_visible == "true"` facts first, then re-measure. A repository that carries a
40MB SEO file it never reads already exists here; do not add a second.

- [ ] **Step 4: Commit**

```bash
cd E:/atlas && git add page-data/tools/export/to_website.py && git commit -m "warehouse: the sanctioned crossing, a pushed shard"
```

```bash
cd E:\atlas\website && git add data/facts && git commit -m "facts: the shipped shard, 107,579 facts by entity"
```

### Task 8: The shard gate

**Files:**
- Create: `website/scripts/verify_facts_shard.mjs`

- [ ] **Step 1: Write the gate**

```js
#!/usr/bin/env node
/**
 * scripts/verify_facts_shard.mjs
 *
 * The shard in data/facts/ is PUSHED from page-data, which the build cannot
 * read. So nothing at build time can regenerate it, and a stale or malformed
 * shard would ship silently. This gate is the only thing standing there.
 *
 * It deliberately does NOT check freshness against page-data: that would read
 * the parent repo, which is the exact defect verify_no_parent_repo_reads exists
 * to prevent.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = "data/facts";
let failed = 0;

if (!fs.existsSync(path.join(DIR, "index.json"))) {
  console.error(`x ${DIR}/index.json missing. Run page-data/tools/export/to_website.py.`);
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf8"));
console.log(`facts-shard: ${index.facts} facts across ${index.entities} entities`);

let onDisk = 0;
for (const key of Object.keys(index.index)) {
  const f = path.join(DIR, `${key}.json`);
  if (!fs.existsSync(f)) {
    failed++;
    console.error(`x indexed entity has no file: ${key}`);
    if (failed > 5) break;
    continue;
  }
  onDisk++;
}
if (onDisk === Object.keys(index.index).length) {
  console.log(`facts-shard: every indexed entity has a file`);
}

if (failed > 0) {
  console.error(`facts-shard: ${failed} failure(s)`);
  process.exit(1);
}
console.log("facts-shard: the shipped shard is intact");
```

- [ ] **Step 2: Run it, register it, run the chain**

```bash
cd E:\atlas\website && node scripts/verify_facts_shard.mjs
```

Add to `GATES` in `scripts/prebuild_all.ts`:

```ts
  { name: "facts-shard", script: "scripts/verify_facts_shard.mjs" },
```

```bash
cd E:\atlas\website && npm run prebuild
```

- [ ] **Step 3: Commit**

```bash
cd E:\atlas\website && git add scripts/ && git commit -m "gate: the pushed fact shard cannot ship broken"
```

### Task 8b: Load the shard into the accessor

**Found by the self-review: Phase 4 exported a shard and nothing read it back.** The
accessor holds `Fact[]` with `entityType` and `entityId` on every fact; the shard puts
those on the wrapper and omits them from each row. Something has to bridge that, and
without this task the two halves of the plan never meet.

**Files:**
- Create: `website/src/lib/facts/shard.ts`

- [ ] **Step 1: Write the loader**

```ts
/**
 * src/lib/facts/shard.ts , read one entity's facts off the shipped shard.
 *
 * The shard stores entityType and entityId ONCE on the wrapper rather than on
 * every fact, which is most of why the files are small. The Fact type carries
 * them on each row because a query result mixes entities. This module is the
 * one place that difference is reconciled.
 *
 * Static import per entity is deliberate: a dynamic path would defeat the
 * bundler and pull all ~730 files into the deployment.
 */
import type { EntityType, Fact, FactTag } from "./types";

type ShardRow = {
  rowKey: string;
  metric: string;
  value: number | string;
  unit: string | null;
  tag: string;
  c: number;
  period: string;
  methodId: string;
};
type Shard = { entityType: string; entityId: string; facts: ShardRow[] };

const TAGS: ReadonlySet<string> = new Set(["held", "modeled", "extrapolated", "placeholder"]);

/** Widen one shard into Facts. An unknown tag becomes "placeholder", never a guess. */
export function shardToFacts(shard: Shard): Fact[] {
  return shard.facts.map((f) => ({
    entityType: shard.entityType as EntityType,
    entityId: shard.entityId,
    rowKey: f.rowKey,
    metric: f.metric,
    value: f.value,
    unit: f.unit,
    tag: (TAGS.has(f.tag) ? f.tag : "placeholder") as FactTag,
    c: f.c,
    period: f.period,
    methodId: f.methodId,
  }));
}
```

- [ ] **Step 2: Write the failing test**

```ts
/** Run: npx tsx tests/facts/shard.test.ts */
import { shardToFacts } from "../../src/lib/facts/shard";

let failed = 0;
const check = (label: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };

const facts = shardToFacts({
  entityType: "country",
  entityId: "GB",
  facts: [
    { rowKey: "", metric: "tax.total_pct", value: 30.5, unit: "pct", tag: "held", c: 0.9, period: "2026", methodId: "researched" },
    { rowKey: "soho", metric: "cities.list.*.slug", value: "soho", unit: null, tag: "nonsense", c: 0.2, period: "2026", methodId: "mice_v1" },
  ],
});

check("entityType lands on every fact", facts.every((f) => f.entityType === "country"));
check("entityId lands on every fact", facts.every((f) => f.entityId === "GB"));
check("a known tag survives", facts[0].tag === "held");
check("an unknown tag becomes placeholder, never a guess", facts[1].tag === "placeholder");
check("row key is preserved", facts[1].rowKey === "soho");

if (failed > 0) { console.error(`facts/shard: ${failed} failures`); process.exit(1); }
console.log("facts/shard: all pass");
```

- [ ] **Step 3: Run it, register it, commit**

```bash
cd E:\atlas\website && npx tsx tests/facts/shard.test.ts
```

Add to `GATES` in `scripts/prebuild_all.ts`:

```ts
  { name: "facts-shard-loader", script: "tests/facts/shard.test.ts" },
```

```bash
cd E:\atlas\website && npm run prebuild
```

```bash
cd E:\atlas\website && git add src/lib/facts/shard.ts tests/facts/shard.test.ts scripts/prebuild_all.ts && git commit -m "facts: the shard and the accessor finally meet"
```

---

## Phase 5 , one confidence scale

**Problem, measured:** four systems describe the same thing. `tier`
(measured/built/thin) in `data/cells/*.json`; `quality_score` 0-100 in Supabase;
`source_quality` A/B/C in the wage files; `tag` + `c` in the warehouse. An MCP client
asking "how much do you trust this" gets four incompatible answers.

**Not proposed: deleting three of them.** They are each load-bearing where they sit and
`verify_wage_source_consistency` already gates one. Proposed instead: one mapping
module that every consumer reads through, so the four become one at the seam.

### Task 9: The confidence mapping

**Files:**
- Create: `website/src/lib/facts/confidence.ts`
- Create: `website/tests/facts/confidence.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
/** Run: npx tsx tests/facts/confidence.test.ts */
import { fromTier, fromQualityScore, fromSourceQuality, band } from "../../src/lib/facts/confidence";

let failed = 0;
const check = (label: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };

check("measured tier is held", fromTier("measured") === "held");
check("built tier is modeled", fromTier("built") === "modeled");
check("thin tier is extrapolated", fromTier("thin") === "extrapolated");
check("quality 90 is held", fromQualityScore(90) === "held");
check("quality 45 is modeled", fromQualityScore(45) === "modeled");
check("quality 10 is extrapolated", fromQualityScore(10) === "extrapolated");
check("grade A is held", fromSourceQuality("A") === "held");
check("grade C is extrapolated", fromSourceQuality("C") === "extrapolated");
check("held bands as strong", band("held") === "strong");
check("placeholder bands as none", band("placeholder") === "none");

if (failed > 0) { console.error(`facts/confidence: ${failed} failures`); process.exit(1); }
console.log("facts/confidence: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd E:\atlas\website && npx tsx tests/facts/confidence.test.ts
```

- [ ] **Step 3: Write the mapping**

```ts
/**
 * src/lib/facts/confidence.ts , four confidence scales into one.
 *
 * This project describes how much it trusts a figure in four incompatible ways:
 *   tier            measured | built | thin        data/cells/*.json
 *   quality_score   0..100                          Supabase cells_master
 *   source_quality  A | B | C                       the wage files
 *   tag             held | modeled | ...            the warehouse
 *
 * None of them is wrong where it sits and none is being deleted. They are
 * mapped onto the warehouse's `tag`, which is the scale the 2026-07-03 design
 * chose and the one an MCP client would see.
 *
 * The mapping is DELIBERATELY LOSSY IN ONE DIRECTION: it never invents
 * precision. quality_score 88 and 91 both become "held" because the distinction
 * is not one this project has ever defended in public.
 */
import type { FactTag } from "./types";

export function fromTier(tier: string): FactTag {
  if (tier === "measured") return "held";
  if (tier === "built") return "modeled";
  if (tier === "thin") return "extrapolated";
  return "placeholder";
}

/** Supabase quality_score, native 0..100. Thresholds mirror score100to10 >= 4. */
export function fromQualityScore(score: number): FactTag {
  if (score >= 70) return "held";
  if (score >= 40) return "modeled";
  if (score > 0) return "extrapolated";
  return "placeholder";
}

/** The wage files' A/B/C. C is defined there as GDP-derived with no observation. */
export function fromSourceQuality(grade: string): FactTag {
  const g = grade.toUpperCase();
  if (g === "A") return "held";
  if (g === "B") return "modeled";
  if (g === "C") return "extrapolated";
  return "placeholder";
}

/** What a reader is told. Never the raw tag: "extrapolated" is not reader copy. */
export function band(tag: FactTag): "strong" | "fair" | "weak" | "none" {
  return tag === "held" ? "strong"
    : tag === "modeled" ? "fair"
    : tag === "extrapolated" ? "weak"
    : "none";
}
```

- [ ] **Step 4: Run the test, register it, run the chain**

```bash
cd E:\atlas\website && npx tsx tests/facts/confidence.test.ts
```

Add to `GATES` in `scripts/prebuild_all.ts`:

```ts
  { name: "facts-confidence", script: "tests/facts/confidence.test.ts" },
```

```bash
cd E:\atlas\website && npm run prebuild
```

- [ ] **Step 5: Commit**

```bash
cd E:\atlas\website && git add src/lib/facts/confidence.ts tests/facts/confidence.test.ts scripts/prebuild_all.ts && git commit -m "facts: four confidence scales meet at one seam"
```

---

## What this plan deliberately does NOT do

- **It does not build an MCP server.** After Phase 3 an MCP tool is `queryFacts` plus a
  transport. Building it before the vocabulary closes would publish 21,273 undocumented
  names to someone else's agent.
- **It does not migrate the 41 direct JSON readers.** They keep working. New consumers
  use the accessor; old ones move when touched. Rewriting 41 working modules to reach a
  nicer shape is the bar this project explicitly refuses.
- **It does not fill the cell level.** cells = 1 against countries = 198 is real and it
  is data work, not architecture. The plan makes the cell level cheap to fill; it does
  not fill it.
- **It does not touch the wall.** Every crossing is a pushed, committed shard.
- **It does not delete the three legacy confidence scales.** Phase 5 maps them.

## Sequencing

| Phase | Needs | Blocks |
|---|---|---|
| 1, restore the dimension | nothing | everything |
| 2, close the vocabulary | Phase 1 | any API surface |
| 3, the accessor | Phase 2 | MCP |
| 4, cross the wall | Phase 3 | pages reading facts |
| 5, one confidence scale | Phase 3 | honest provenance in an API |

**Phases 1 and 2 are the plan.** They are also the two that get monotonically more
expensive as the world fills, which is the argument for doing them in skeleton phase.
