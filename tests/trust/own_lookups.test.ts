/**
 * A TABLE KEYED BY A WORD FROM THE ADDRESS IS READ FOR ITS OWN ENTRIES (2026-10-08; CLAUDE.md working-method rule 4: a ratified
 * rule becomes a gate in the same session). A plain object answers "constructor" with the Object function and "__proto__" with
 * Object.prototype, so `TABLE[word]` with a word the reader sent threw (/gb/constructor/restaurants answered 500) or moved the
 * request to a page named after a function's text (/gb/london/constructor answered 308). 7395d11d and 7d2503ba read the tables
 * through own() and hasOwn() (src/lib/own.ts); this holds that nobody writes the bracket again.
 *
 * WHAT IT DOES. It reads the code of every file under src/ (comments stripped by scripts/lib/strip_comments), finds each read of a
 * listed table written as a bracket (`TABLE[key]`, `TABLE?.[key]`, `TABLE![key]`, `(TABLE as T)[key]`) with a key that is not a
 * literal, and fails on it. A read through own(TABLE, key) or hasOwn(TABLE, key) has no bracket and passes. Two lists:
 * URL_KEYED_TABLES, every table the address keys, checked in all of src/; and ID_KEYED_TABLES, tables a row or the taxonomy keys
 * in dozens of readers that never see an address (INDUSTRY_BY_ID has about forty) but a query string also reaches, checked only
 * on the request-facing paths (src/app/api, the middleware, src/lib/routing).
 *
 * WHAT IT CANNOT SEE (stated before it is quoted). It reads text. It cannot tell a table read through an alias (`const t = TABLE;
 * t[word]`), through a destructured copy, or inside a function that is handed the table, from no read at all; it cannot tell a key
 * that is a request word from one that is an id, so a URL-keyed table is checked wherever it is read and an id-keyed one only
 * where a request word can arrive; and a `//` inside a string hides the rest of its line from the stripper (strip_comments says
 * so). It checks the names listed here, so a new table keyed by an address is covered only when it is added to the list; the last
 * checks of this file hold the list to the code (each listed table must still be read through own() somewhere) and the walk to
 * the files it is meant to read.
 *
 * Fixtures first: the scanner is run on planted text (a bracket, an optional bracket, a cast, a non-null bracket, a nested key;
 * own(), a literal key, a longer name, a comment) so it cannot go blind without a red.
 *
 * Run: npx tsx tests/trust/own_lookups.test.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "own-lookups";
const REMEDY = "read it with own(TABLE, key) from src/lib/own.ts";
const SELF = "tests/trust/own_lookups.test.ts";
let failed = 0;
const fail = (file: string, line: number | undefined, detail: string) => { failed++; red({ rule: RULE, file, line, detail, remedy: REMEDY }); };
const check = (file: string, label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } fail(file, undefined, label); };

/** Every table keyed by a word from the address (the path, a query string, a share link). Checked in all of src/. A dotted name
 *  is a table inside a module's data (TURNOVER.trades is the register slice's trade table). */
const URL_KEYED_TABLES = [
  /* the trade word: renames, retirements and the resolvers' tables (7395d11d) */
  "TAXONOMY_REDIRECTS", "RETIRED", "MERGES", "SLUG_TO_INDUSTRY", "INDUSTRY_SLUG_ALIASES", "PHRASE_TO_INDUSTRY",
  "LEGACY_SECTOR_ALIAS", "LEGACY_SLUG_TO_DB_ID", "LEGACY_DB_TO_TAXONOMY", "TAXONOMY_TO_LEGACY_DB",
  /* the trade word, in the UK register slices (7395d11d) */
  "TURNOVER.trades", "PREMISES.trade_category", "RECIPES", "SURVIVAL.trade_groups", "FAILURES.trades",
  /* the place word: the state slugs, the city aliases and their labels, the district aliases and the hub tables (7d2503ba, 7395d11d) */
  "SLUG_TO_GEO_ID", "MANUAL_FRIENDLY_TO_GEO_ID", "CITY_FRIENDLY_TO_GEO_ID", "MANUAL_DISPLAY_LABEL", "CITY_FRIENDLY_DISPLAY_LABEL",
  "NEIGHBORHOOD_ALIASES", "NEIGHBORHOOD_SLUGS", "HOOD_DISTRICT_SLUGS", "CITIES_BY_STATE", "REGIONS_BY_COUNTRY_AUTO",
];

/** Tables keyed by an id nearly everywhere and by a word from a query string in a few readers: checked only where a request word
 *  can reach them. The paths are from the repo root; a trailing slash is a folder. */
const REQUEST_FACING_PATHS = ["src/app/api/", "src/middleware.ts", "src/lib/routing/"];
const ID_KEYED_TABLES = ["INDUSTRY_BY_ID", "SECTOR_BY_ID"];

/* ---------------------------------------------------------------------------------------------------------------- the scanner */

const SOURCE = /\.(?:ts|tsx)$/;
const LITERAL_KEY = /^\s*(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`$\\]|\\.)*`|\d+)\s*$/;
const escapeName = (name: string) => name.split(".").map((p) => p.replace(/\$/g, "\\$&")).join("\\s*\\??\\.\\s*");

type Read = { line: number; table: string; key: string; text: string };

/** The bracket reads of `table` in one file's code whose key is not a literal. `lines` are the file's lines with comments already
 *  stripped, one per original line, so a line number here is the file's. */
function bracketReads(lines: string[], table: string): Read[] {
  const code = lines.join("\n");
  const name = escapeName(table);
  const forms = [
    new RegExp(`\\b${name}[ \\t]*!?[ \\t]*(?:\\?\\.)?[ \\t]*\\[`, "g"), //                    TABLE[  TABLE?.[  TABLE![
    new RegExp(`\\(\\s*${name}\\s+as\\s[^()]*\\)[ \\t]*!?[ \\t]*(?:\\?\\.)?[ \\t]*\\[`, "g"), // (TABLE as T)[
  ];
  const out: Read[] = [];
  const seen = new Set<number>();
  for (const re of forms) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(code))) {
      const open = m.index + m[0].length - 1;
      if (seen.has(open)) continue;
      seen.add(open);
      let depth = 0;
      let close = -1;
      for (let k = open; k < code.length; k++) {
        if (code[k] === "[") depth++;
        else if (code[k] === "]" && --depth === 0) { close = k; break; }
      }
      const key = code.slice(open + 1, close === -1 ? open + 80 : close);
      if (LITERAL_KEY.test(key)) continue;
      const line = code.slice(0, m.index).split("\n").length;
      out.push({ line, table, key: key.replace(/\s+/g, " ").trim(), text: lines[line - 1].trim().slice(0, 120) });
    }
  }
  return out;
}

const strip = (text: string) => stripCommentLines(text.split("\n"));

/* ---------------------------------------------------------------------------------------------------------------- fixtures */

const FIXTURES: Array<[text: string, table: string, want: number]> = [
  ["const v = TAB[word];", "TAB", 1],
  ["const v = TAB?.[word];", "TAB", 1],
  ["const v = TAB![word];", "TAB", 1],
  ["const v = TAB [word];", "TAB", 1],
  ["const v = TAB[\n  word\n];", "TAB", 1],
  ["const v = (TAB as Record<string, string>)[word];", "TAB", 1],
  ["const v = (TAB as Record<string, { id: string } | undefined>)?.[word];", "TAB", 1],
  ["const v = TAB[geo.toLowerCase()] ?? TAB[`${a}-${b}`];", "TAB", 2],
  ["const v = TAB[a[0]];", "TAB", 1],
  ["const v = TAB[\"a\" + word];", "TAB", 1],
  ["const v = TURNOVER.trades[slug];", "TURNOVER.trades", 1],
  ["const v = TURNOVER . trades?.[slug];", "TURNOVER.trades", 1],
  ["const v = own(TAB, word);", "TAB", 0],
  ["const v = own(own(TAB, c), word);", "TAB", 0],
  ["const v = hasOwn(TAB, word);", "TAB", 0],
  ["const v = own(TURNOVER.trades, slug);", "TURNOVER.trades", 0],
  ["const v = TAB[\"gb\"] ?? TAB['gb'] ?? TAB[`gb`] ?? TAB[0];", "TAB", 0],
  ["const v = MY_TAB[word] + TAB_OF[word] + TABS[word] + xTAB[word];", "TAB", 0],
  ["const v = TAB.gb + Object.keys(TAB).length + [TAB, word].length;", "TAB", 0],
  ["const v = other.TURNOVERS.trades[slug];", "TURNOVER.trades", 0],
];
const fixtureWrong = FIXTURES.flatMap(([text, table, want], i) => {
  const got = bracketReads(strip(text), table).length;
  return got === want ? [] : [`#${i + 1} wanted ${want} read(s) of ${table}, found ${got}: ${text.replace(/\n/g, " ").slice(0, 60)}`];
});
check(SELF, `the scanner finds a bracket, an optional bracket, a non-null bracket, a cast and a nested key, and passes own(), hasOwn(), a literal key, a longer name and a dotted access (${FIXTURES.length} planted texts)${fixtureWrong.length ? `: ${fixtureWrong.join("; ")}` : ""}`, fixtureWrong.length === 0);
const planted = ["// TAB[word]", "/* TAB[word]", " * TAB[word] */", "const x = 1; // TAB[word]", "{/* TAB[word] */}"];
check(SELF, `a read written inside a comment is not a read (${planted.length} planted comments)`, bracketReads(stripCommentLines(planted), "TAB").length === 0);

/* ------------------------------------------------------------------------------------------------------- the walk of src/ */

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (SOURCE.test(name)) out.push(p.split("\\").join("/"));
  }
  return out;
}
const files = walk("src");
/* A second enumeration, by another call, so a walk that silently skips a directory (the bracket and parenthesis folders of the
   App Router are the ones a glob loses) is a red and not a gate that reports PASS about files it has not opened. */
const second = new Set((readdirSync("src", { recursive: true }) as string[]).map((p) => join("src", p).split("\\").join("/")).filter((p) => SOURCE.test(p)));
check("src", `the walk of src/ found the same ${second.size} source files as a second enumeration (${files.length} walked)`, files.length === second.size && files.every((f) => second.has(f)));
const SENTINELS = [
  "src/middleware.ts", "src/lib/own.ts", "src/lib/cells/geo.ts", "src/lib/taxonomy.ts", "src/app/api/cell-lookup/route.ts",
  "src/app/[country]/[geo]/[industry]/page.tsx", "src/app/(site)/compare/CompareClient.tsx",
];
const missing = SENTINELS.filter((s) => !files.includes(s));
check("src", `the walk reads the files it is meant to, bracket and parenthesis folders included (${SENTINELS.length} checked)${missing.length ? `: not found ${missing.join(", ")}` : ""}`, missing.length === 0);
const inPath = (file: string, p: string) => (p.endsWith("/") ? file.startsWith(p) : file === p);
const facing = (file: string) => REQUEST_FACING_PATHS.some((p) => inPath(file, p));
const emptyPaths = REQUEST_FACING_PATHS.filter((p) => !files.some((f) => inPath(f, p)));
check("src", `every request-facing path of the id-keyed rule holds source files (${REQUEST_FACING_PATHS.join(", ")})${emptyPaths.length ? `: empty ${emptyPaths.join(", ")}` : ""}`, emptyPaths.length === 0);

const code = new Map<string, string[]>(files.map((f) => [f, strip(readFileSync(f, "utf8"))]));

/* ----------------------------------------------------------------------------------------------------------- the real scan */

let bare = 0;
const scan = (tables: string[], inScope: (file: string) => boolean) => {
  for (const [file, lines] of code) {
    if (!inScope(file)) continue;
    for (const table of tables) {
      for (const r of bracketReads(lines, table)) {
        bare++;
        fail(file, r.line, `${table}[${r.key}] reads a table keyed by a word from the address as a bare bracket: ${r.text}`);
      }
    }
  }
};
scan(URL_KEYED_TABLES, () => true);
scan(ID_KEYED_TABLES, facing);
if (bare === 0) console.log(`PASS  no bare bracket read of any of ${URL_KEYED_TABLES.length} URL-keyed tables in the ${files.length} source files of src/, nor of ${ID_KEYED_TABLES.join(" and ")} on the request-facing paths`);

/* The list is the gate's only memory, so it is held to the code: a listed table that nothing reads through own() or hasOwn() any
   more is a stale entry (renamed, deleted, or moved to a Map), and a gate that lists it passes about nothing. */
const allCode = [...code.values()].map((l) => l.join("\n")).join("\n");
const guarded = (table: string) => new RegExp(`\\b(?:own|hasOwn)\\(\\s*(?:own\\(\\s*)?${escapeName(table)}\\b`).test(allCode);
const unguarded = [...URL_KEYED_TABLES, ...ID_KEYED_TABLES].filter((t) => !guarded(t));
check(SELF, `every listed table is still read through own() or hasOwn() somewhere in src/ (${URL_KEYED_TABLES.length + ID_KEYED_TABLES.length})${unguarded.length ? `: none for ${unguarded.join(", ")}; rename or remove the entry` : ""}`, unguarded.length === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("trust/own_lookups: all pass");
