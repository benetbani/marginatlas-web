/**
 * src/lib/facts/city_shard.ts, the door the city page walks through into the
 * warehouse. The FIRST consumer of store.ts (2026-09-17, CITY-PROGRAMME step
 * 1a, research item 21): for thirty-three days the city fact bank held real
 * cost-of-living, income and spending figures for 252 cities and nothing
 * under src/ imported the store that answers for them.
 *
 * ONE CITY AT A TIME, ON DEMAND, ADDED TO THE STORE. The bank is 6.9MB across
 * 252 files and the build runs under a RAM cap, so the whole set is never
 * read up front the way the 120KB country profile is. A city's shard is read
 * the first time a builder asks for that city, widened by shardToFacts, and
 * ADDED to whatever the store already holds, never replacing it: two cities
 * rendered in one process both stay answerable. The read is synchronous and
 * the builders that call it never await between loading and asking, so a
 * concurrent render of a second city cannot interleave a half-loaded store.
 *
 * SERVER ONLY. This reads the file system, so it belongs to the adapter
 * (buildSpineCitySeed) and to scripts, and must never be imported by a
 * component that says "use client"; the city chapters read what the adapter
 * puts on the seed.
 *
 * THE WRAPPER'S IDENTITY IS CHECKED against the name it was asked for. A file
 * named for one city whose wrapper names another would have its facts filed
 * under the wrapper's id and found by nobody, which is the silent kind of
 * gap; here it is a miss with the file named.
 *
 * A missing file, a file that will not parse, or a wrapper of the wrong kind
 * all read as "this city holds nothing", once, and are not re-read. Nothing
 * here invents a fact.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { shardToFacts, type Shard } from "./shard";
import { allFacts, factValue, loadFacts } from "./store";
import type { FactTag, PlaceholderOption } from "./types";

/** The entity id a city shard is filed under: the country code and the slug. */
export const cityEntityId = (iso2: string, slug: string) => `${iso2.toUpperCase()}-${slug}`;

/** What each city's load came to: true when its facts are in the store. */
const LOADED = new Map<string, boolean>();

/** Reads one city's shard into the store, once. True when the city holds facts. */
export function loadCityShard(iso2: string, slug: string): boolean {
  const id = cityEntityId(iso2, slug);
  const known = LOADED.get(id);
  if (known !== undefined) return known;
  let ok = false;
  try {
    const raw = readFileSync(resolve(process.cwd(), "data", "facts", "city", `${id}.json`), "utf8");
    const shard = JSON.parse(raw) as Shard;
    if (shard && shard.entityType === "city" && shard.entityId === id && Array.isArray(shard.facts)) {
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
export type BankFigure = { value: number; tag: FactTag };

/**
 * One finite, non-negative scalar for one city, with its tag, or null. A
 * negative or non-numeric value is not a figure. ZERO IS RETURNED, and each
 * builder decides whether zero is honest for its own metric: a rent, a
 * grocery bill, a pay or a spend figure is never honestly zero and would be a
 * division by nothing one builder down, but a transport pass can be (Belgrade
 * and Richmond both hold 0, tagged held, and both cities run fare-free
 * transit), and a guard here that read zero as "not held" dropped two whole
 * cities from the living card over the one figure that was true.
 * A PLACEHOLDER COMES BACK ONLY WHEN ASKED (store.ts's law, 2026-09-23
 * night): `opts` passes the ask through to the store, and the chain holds
 * every caller that makes it to a named list.
 */
export function cityFigure(iso2: string, slug: string, metric: string, opts: PlaceholderOption = {}): BankFigure | null {
  if (!loadCityShard(iso2, slug)) return null;
  const f = factValue(cityEntityId(iso2, slug), metric, opts);
  if (!f || typeof f.value !== "number" || !Number.isFinite(f.value) || f.value < 0) return null;
  return { value: f.value, tag: f.tag };
}

/** The tags from most to least trusted, so two figures can be compared on trust. */
const TRUST: readonly FactTag[] = ["held", "modeled", "extrapolated", "placeholder"];

/** The less trusted of two tags: what a figure composed from both is worth. */
export function weakerTag(a: FactTag, b: FactTag): FactTag {
  return TRUST.indexOf(a) >= TRUST.indexOf(b) ? a : b;
}
