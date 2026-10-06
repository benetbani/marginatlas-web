/**
 * src/lib/own.ts
 *
 * A TABLE'S OWN ENTRY, NEVER A BUILT-IN (2026-10-06). Every table here keyed by a word from the address is a plain object, and a
 * plain object answers for the names it inherits too: `TAXONOMY_REDIRECTS["constructor"]` is the Object function and
 * `TAXONOMY_REDIRECTS["__proto__"]` is Object.prototype. Measured on production that day with a Chrome user agent:
 * `/gb/london/constructor` answered 308 to `/gb/london/function%20Object()%20%7B%20[native%20code]%20%7D` (a 404), and
 * `/gb/london/__proto__` 308 to `/gb/london/[object%20Object]`; the London register lookup threw a TypeError on the first. A word
 * that names nothing in the table is answered as nothing, whatever the language happens to keep on every object.
 *
 * Pure and tiny, so the edge middleware can read it.
 */

/** The table's own value for the key, or undefined when the key is missing or only an inherited name ("constructor",
 *  "__proto__", "hasOwnProperty", "toString", ...). */
export function own<T>(table: Readonly<Record<string, T>> | null | undefined, key: string | null | undefined): T | undefined {
  if (table == null || key == null) return undefined;
  return Object.hasOwn(table, key) ? table[key] : undefined;
}

/** True when the table holds the key as its own entry, the guarded form of `key in table`. */
export function hasOwn(table: object | null | undefined, key: string | null | undefined): boolean {
  return table != null && key != null && Object.hasOwn(table, key);
}
