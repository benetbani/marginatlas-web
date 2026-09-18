/**
 * src/lib/facts/industry_shard.ts, the door the trade page walks through
 * into the warehouse. The THIRD consumer of store.ts (2026-09-18, plan step
 * 33's first dispatch, the trade page's `00 take`): for a fortnight
 * data/facts/industry/<id>.json held a margin ladder, a cost stack, a survival
 * triple and a payback for every one of the 243 trades (MODEL.md PART 9
 * clause 47, R12: "243 shards holding demand, survival, a cost stack, a
 * margin ladder and payback for every trade") while store.ts's own header
 * said "NOTHING CONSUMES IT YET" of the whole bank.
 *
 * ONE TRADE AT A TIME, ON DEMAND, ADDED TO THE STORE, exactly as
 * city_shard.ts and country_shard.ts do it and for the same reasons: 243
 * files, a build under a RAM cap, a synchronous read the builders never
 * await across, the wrapper's identity checked against the id it was asked
 * for, and a missing or unparseable file read once as "this trade holds
 * nothing". The three doors are one shape with a different folder and a
 * different id, and they fold into one loader the day a fourth entity kind
 * reads the bank; today three short files are cheaper than an abstraction
 * over them.
 *
 * THE ID IS THE TAXONOMY'S, never the URL slug. A trade's shard is filed
 * under its `industries.json` id (`restaurants`, `cafes_coffee`,
 * `accounting_tax`: 243 of 243 match, counted 2026-09-12 in the trade spine's
 * PART 0), which is underscored where the route's slug is hyphenated; a
 * caller resolves the slug through `slugToIndustry()` first, the trap
 * adapt_cell.ts already names on the character lookup.
 *
 * EVERY FIGURE OFF THIS DOOR IS MODELLED ON THE PAGE, whatever its tag.
 * DATA-REQUIREMENTS item 61 measured the held tag on 2026-09-18 at 57
 * percent against an 80 percent floor, so a shard's "held" is a tag and not
 * a verification (R12), and a builder reading this door writes "modelled"
 * in its basis line. The tag still comes back with the figure, so the day
 * the data track raises the rate the builders can read it.
 *
 * SERVER ONLY. This reads the file system, so it belongs to builders the
 * server view calls and to scripts, never to a component that says
 * "use client". Nothing here invents a fact.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { shardToFacts, type Shard } from "./shard";
import { allFacts, factValue, loadFacts, queryFacts } from "./store";
import type { Fact, FactTag } from "./types";

/** The entity id a trade shard is filed under: the taxonomy's industry id, as is. */
export const industryEntityId = (industryId: string) => industryId;

/** What each trade's load came to: true when its facts are in the store. */
const LOADED = new Map<string, boolean>();

/** Reads one trade's shard into the store, once. True when the trade holds facts. */
export function loadIndustryShard(industryId: string): boolean {
  const id = industryEntityId(industryId);
  const known = LOADED.get(id);
  if (known !== undefined) return known;
  let ok = false;
  try {
    const raw = readFileSync(resolve(process.cwd(), "data", "facts", "industry", `${id}.json`), "utf8");
    const shard = JSON.parse(raw) as Shard;
    if (shard && shard.entityType === "industry" && shard.entityId === id && Array.isArray(shard.facts)) {
      const facts = shardToFacts(shard);
      if (facts.length > 0) {
        loadFacts(allFacts().concat(facts));
        ok = true;
      }
    }
  } catch {
    ok = false;
  }
  LOADED.set(id, ok);
  return ok;
}

/** A figure off the bank with the trust the bank puts in it. */
export type IndustryBankFigure = { value: number; tag: FactTag };

/**
 * One finite, non-negative scalar for one trade, with its tag, or null. A
 * negative or non-numeric value is not a figure. ZERO IS RETURNED, and the
 * builder decides whether zero is honest for its own metric (a spend per head
 * of 0 on seven business-to-business trades is the trade spine's own finding
 * and is that builder's to withhold, not this door's).
 */
export function industryFigure(industryId: string, metric: string): IndustryBankFigure | null {
  if (!loadIndustryShard(industryId)) return null;
  const f = factValue(industryEntityId(industryId), metric);
  if (!f || typeof f.value !== "number" || !Number.isFinite(f.value) || f.value < 0) return null;
  return { value: f.value, tag: f.tag };
}

/** Every row of one collection metric on one trade (`roles.list.*.role`, a prefix ending in "."), in the shard's order; empty when the trade holds nothing under it. */
export function industryRows(industryId: string, metricPrefix: string): Fact[] {
  if (!loadIndustryShard(industryId)) return [];
  return queryFacts({ entityId: industryEntityId(industryId), metrics: [metricPrefix] });
}
