/**
 * A PLACE WORD THAT NAMES A BUILT-IN NAMES NO PLACE (2026-10-08). The middle part of /{country}/{place}/{trade} is a word from
 * the address, and the cell route reads plain-object tables with it: the manual and generated city aliases, their display labels,
 * the United States' state slugs and the district aliases. A plain object answers "constructor" with the Object function and
 * "__proto__" with Object.prototype, so /gb/constructor/restaurants, /gb/__proto__/restaurants, /us/constructor/restaurants and
 * /fr/constructor/restaurants answered 500 on production (measured 2026-10-08; `TypeError: manual.includes is not a function`
 * from regionalSlugToGeoId). The middleware does not judge the place segment, a place being the database's to name, so the word
 * reached getCellBySlug. Commit 7395d11d closed the trade word the same way; this holds the place word.
 *
 * Three parts. (1) The pure resolvers, for every held country code and every Object.prototype name, as written, lowercased and
 * uppercased: no throw, and the answer is the one a made-up word gets (nothing, or the word upper-cased as a geo id), never a
 * function or an object. (2) The same with a built-in name in the COUNTRY slot too, and the names a function carries ("name",
 * "length"), which a table lookup would answer with a string. (3) The cell route's own readers, getCellBySlug, getCellVariants,
 * fetchCellSiblings and resolveGeoPage, with the database pointed nowhere and every query answered "no rows" by a stub (no
 * network and no secret, as the chain requires): a built-in place word resolves exactly as a made-up one does, to an estimated
 * cell with no row behind it.
 *
 * Run: npx tsx tests/routing/place_word_keys.test.ts
 */
import { COUNTRIES } from "../../src/lib/taxonomy";
import { regionalSlugToGeoId, geoNameFromSlug } from "../../src/lib/cells/geo";
import { lookupNeighborhoodGeoId } from "../../src/lib/cities";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "place-word-keys";
const REMEDY = "read a table keyed by a place word from the address with own() (src/lib/own.ts), never table[word]";
let failed = 0;
const check = (file: string, label: string, wrong: string[]) => {
  if (wrong.length === 0) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: `${label}: ${wrong.slice(0, 6).join("; ")}${wrong.length > 6 ? `; and ${wrong.length - 6} more` : ""}`, remedy: REMEDY });
};

/** What a call answered, in one short phrase: nothing, a plain string, another kind of value, or the error it threw. */
const answer = (f: () => unknown): string => {
  try {
    const v = f();
    return v === null ? "null" : v === undefined ? "undefined" : typeof v === "string" ? JSON.stringify(v) : `${typeof v === "object" ? "an" : "a"} ${typeof v}`;
  } catch (e) {
    return `throws ${e instanceof Error ? e.message : String(e)}`.slice(0, 70);
  }
};

/* Every name every object inherits; "__proto__" is among them, and is written out too in case an engine stops listing it. */
const NAMES = [...new Set([...Object.getOwnPropertyNames(Object.prototype), "__proto__"])];
/* As written, lowercased (the form a route's resolver reads after .toLowerCase()) and uppercased (the form the country slot is read in). */
const KEYS = [...new Set(NAMES.flatMap((k) => [k, k.toLowerCase(), k.toUpperCase()]))];
/* What a function carries on its own: a table that is the Object function answers these with strings and numbers. */
const FUNCTION_NAMES = ["name", "length", "prototype", "caller", "arguments", "call", "apply", "bind"];
const CODES = COUNTRIES.map((c) => c.code);
const MADE_UP = "zzzzzzzz";

const GEO = "src/lib/cells/geo.ts";
const CITIES = "src/lib/cities.ts";

/* (1) EVERY HELD COUNTRY AGAINST EVERY BUILT-IN NAME, in the place slot. */
const wrongRegional: string[] = [];
const wrongName: string[] = [];
const wrongHood: string[] = [];
const nameOfMadeUp = (code: string) => answer(() => geoNameFromSlug(code, MADE_UP));
const hoodOfMadeUp = (code: string) => answer(() => lookupNeighborhoodGeoId(code, MADE_UP));
for (const code of CODES) {
  for (const country of [code, code.toLowerCase()]) {
    const nameWant = nameOfMadeUp(country);
    const hoodWant = hoodOfMadeUp(country);
    for (const k of KEYS) {
      const regional = answer(() => regionalSlugToGeoId(country, k));
      if (regional !== JSON.stringify(k.toUpperCase())) wrongRegional.push(`${country} ${k} (${regional})`);
      const name = answer(() => geoNameFromSlug(country, k));
      if (name !== nameWant) wrongName.push(`${country} ${k} (${name})`);
      const hood = answer(() => lookupNeighborhoodGeoId(country, k));
      if (hood !== hoodWant) wrongHood.push(`${country} ${k} (${hood})`);
    }
  }
}
const calls = CODES.length * 2 * KEYS.length;
check(GEO, `regionalSlugToGeoId answers any built-in place word as a made-up one (its upper case, no throw): ${CODES.length} held countries x ${KEYS.length} names (${calls} calls)`, wrongRegional);
check(GEO, `geoNameFromSlug names no place for any built-in word, as for a made-up one (${calls} calls)`, wrongName);
check(CITIES, `lookupNeighborhoodGeoId names no district for any built-in word, as for a made-up one (${calls} calls)`, wrongHood);

/* (2) A BUILT-IN NAME IN THE COUNTRY SLOT, and the names a function carries in the place slot (`Object["name"]` is "Object"). */
const wrongCountry: string[] = [];
for (const country of KEYS) {
  for (const k of [...KEYS, ...FUNCTION_NAMES]) {
    const regional = answer(() => regionalSlugToGeoId(country, k));
    if (regional !== JSON.stringify(k.toUpperCase())) wrongCountry.push(`regionalSlugToGeoId(${country}, ${k}) (${regional})`);
    const name = answer(() => geoNameFromSlug(country, k));
    if (name !== "undefined") wrongCountry.push(`geoNameFromSlug(${country}, ${k}) (${name})`);
    const hood = answer(() => lookupNeighborhoodGeoId(country, k));
    if (hood !== "null") wrongCountry.push(`lookupNeighborhoodGeoId(${country}, ${k}) (${hood})`);
  }
}
check(GEO, `a built-in name in the country slot, against every built-in name and every name a function carries, names nothing (${KEYS.length * (KEYS.length + FUNCTION_NAMES.length) * 3} calls)`, wrongCountry);

/* (3) THE ROUTE'S OWN READERS, offline. src/lib/supabase.ts builds its client when first imported and needs a URL, so the
   environment is set and fetch replaced BEFORE the import below; every query then answers an empty table. */
async function routePart() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://offline.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "offline";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  globalThis.fetch = (async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } })) as typeof fetch;
  const { getCellBySlug, getCellVariants } = await import("../../src/lib/cells");
  const { fetchCellSiblings, resolveGeoPage } = await import("../../src/lib/cells/related_links");
  const RELATED = "src/lib/cells/related_links.ts";
  const CELLS = "src/lib/cells.ts";

  const brief = (c: { geo_name: string | null; geo_level: string; is_synthetic?: boolean; geo_id: unknown }) =>
    JSON.stringify([c.geo_name, c.geo_level, c.is_synthetic === true, typeof c.geo_id]);
  const wrongCell: string[] = [];
  const wrongVariants: string[] = [];
  const wrongSiblings: string[] = [];
  const wrongPage: string[] = [];
  const PLACES = ["constructor", "__proto__", "hasOwnProperty", "toString"];
  for (const country of ["gb", "us", "fr", "de"]) {
    const control = await getCellBySlug(country, MADE_UP, "restaurants", { sizeBand: null, year: null });
    for (const place of PLACES) {
      const addr = `/${country}/${place}/restaurants`;
      try {
        const cell = await getCellBySlug(country, place, "restaurants", { sizeBand: null, year: null });
        if (brief(cell) !== brief(control)) wrongCell.push(`${addr} (${brief(cell)}, a made-up word's is ${brief(control)})`);
      } catch (e) { wrongCell.push(`${addr} (throws ${e instanceof Error ? e.message : String(e)})`.slice(0, 120)); }
      try {
        const variants = await getCellVariants(country, place, "restaurants");
        if (!Array.isArray(variants) || variants.length !== 0) wrongVariants.push(`${addr} (${Array.isArray(variants) ? variants.length : typeof variants} rows)`);
      } catch (e) { wrongVariants.push(`${addr} (throws ${e instanceof Error ? e.message : String(e)})`.slice(0, 120)); }
      try {
        const sib = await fetchCellSiblings(country, place, "restaurants");
        if (sib.sameTradeElsewhere.length !== 0 || sib.otherTradesHere.length !== 0) wrongSiblings.push(`${addr} (siblings from nothing)`);
      } catch (e) { wrongSiblings.push(`${addr} (throws ${e instanceof Error ? e.message : String(e)})`.slice(0, 120)); }
      try {
        const page = resolveGeoPage(country, place);
        if (page !== null) wrongPage.push(`${addr} (a place page: ${JSON.stringify(page)})`);
      } catch (e) { wrongPage.push(`${addr} (throws ${e instanceof Error ? e.message : String(e)})`.slice(0, 120)); }
    }
  }
  check(CELLS, "getCellBySlug resolves /{gb,us,fr,de}/{constructor,__proto__,hasOwnProperty,toString}/restaurants as it does a made-up place, never a throw", wrongCell);
  check(CELLS, "getCellVariants finds no variants for a built-in place word and throws nothing", wrongVariants);
  check(RELATED, "fetchCellSiblings finds no siblings for a built-in place word and throws nothing", wrongSiblings);
  check(RELATED, "resolveGeoPage names no page for a built-in place word and throws nothing", wrongPage);
}

routePart().then(
  () => {
    if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
    console.log("routing/place_word_keys: all pass");
    process.exit(0);
  },
  (e) => {
    failed++;
    red({ rule: RULE, file: "tests/routing/place_word_keys.test.ts", detail: `the route part could not run: ${e instanceof Error ? e.stack ?? e.message : String(e)}`.slice(0, 400), remedy: REMEDY });
    redSummary(RULE, failed, REMEDY, "checks failed");
    process.exit(1);
  },
);
