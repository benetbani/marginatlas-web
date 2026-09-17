/**
 * src/lib/facts/country_shard.ts, the door the country page walks through
 * into the warehouse. The SECOND consumer of store.ts (2026-09-17, plan step
 * 31's third dispatch, the country page's `04 entry-bill`): for thirty-three
 * days data/facts/country/<ISO2>.json held the all-in registration bill and
 * the days until trading for 191 and 195 of the 195 countries while the
 * research brief that needed them (research/2026-09-11/country/04-entry-bill.md)
 * found DATA-REQUIREMENTS.md still calling them "not held".
 *
 * ONE COUNTRY AT A TIME, ON DEMAND, ADDED TO THE STORE, exactly as
 * city_shard.ts does it and for the same reasons: 198 files, a build under a
 * RAM cap, a synchronous read the builders never await across, the wrapper's
 * identity checked against the code it was asked for, and a missing or
 * unparseable file read once as "this country holds nothing". The two doors
 * are the same shape with a different folder and a different id, and they
 * fold into one loader the day a third entity kind reads the bank; today two
 * short files are cheaper than a third abstraction over them.
 *
 * SERVER ONLY. This reads the file system, so it belongs to builders the
 * server view calls (country-view.tsx carries no "use client") and to
 * scripts, never to a component that says "use client".
 *
 * Nothing here invents a fact.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { shardToFacts, type Shard } from "./shard";
import { allFacts, factValue, loadFacts } from "./store";
import type { FactTag } from "./types";

/** The entity id a country shard is filed under: its ISO2 code, upper case. */
export const countryEntityId = (iso2: string) => iso2.toUpperCase();

/** What each country's load came to: true when its facts are in the store. */
const LOADED = new Map<string, boolean>();

/** Reads one country's shard into the store, once. True when the country holds facts. */
export function loadCountryShard(iso2: string): boolean {
  const id = countryEntityId(iso2);
  const known = LOADED.get(id);
  if (known !== undefined) return known;
  let ok = false;
  try {
    const raw = readFileSync(resolve(process.cwd(), "data", "facts", "country", `${id}.json`), "utf8");
    const shard = JSON.parse(raw) as Shard;
    if (shard && shard.entityType === "country" && shard.entityId === id && Array.isArray(shard.facts)) {
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
export type CountryBankFigure = { value: number; tag: FactTag };

/**
 * One finite, non-negative scalar for one country, with its tag, or null. A
 * negative or non-numeric value is not a figure. ZERO IS RETURNED, and the
 * builder decides whether zero is honest for its own metric: Rwanda's
 * registration bill is 0 on file and prints as `$0`, a figure, never a word
 * (PART 5: a label never stands where a number goes).
 */
export function countryFigure(iso2: string, metric: string): CountryBankFigure | null {
  if (!loadCountryShard(iso2)) return null;
  const f = factValue(countryEntityId(iso2), metric);
  if (!f || typeof f.value !== "number" || !Number.isFinite(f.value) || f.value < 0) return null;
  return { value: f.value, tag: f.tag };
}
