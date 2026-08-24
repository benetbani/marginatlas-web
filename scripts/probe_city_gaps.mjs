/**
 * probe_city_gaps , what does the city page want, what is it missing, and what
 * knowable figure could stand in its place?
 *
 * Rulebook v2 §3: a t4 figure is REPLACED with a knowable neighbour, not deleted.
 * That rule was never applied, and 23 of 48 sections went dark. This lists what
 * the CITY RECORD actually carries, which is the pool every replacement has to be
 * drawn from.
 */
import { readFileSync } from "node:fs";
const { cities } = JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8"));
const n = cities.length;
const fields = new Map();
for (const c of cities) for (const k of Object.keys(c)) fields.set(k, (fields.get(k) ?? 0) + (c[k] != null ? 1 : 0));
console.log(`\n  ${n} cities. Every field, and how many carry it:\n`);
for (const [k, v] of [...fields.entries()].sort((a, b) => b[1] - a[1])) {
  const pct = Math.round((v / n) * 100);
  console.log(`    ${String(pct).padStart(3)}%  ${String(v).padStart(3)}/${n}  ${k}`);
}
