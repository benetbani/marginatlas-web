/**
 * scripts/lib/red.mjs , the one shape a gate's red takes.
 *
 * WHY. On 2026-09-17 a chain run printed "cream grew 5 to 6" and that line
 * cost a deploy and a search: which file, which line, which literal, and what
 * to write instead were all in the gate's memory and none of them reached the
 * page. The line that would have cost a minute is
 *
 *   x no-cream src/app/globals.css:1099: #fffaf8 in .focal. Remedy: use var(--c-card) or another token
 *
 * so every red prints in that one shape (plan-2026-09-17/02-ERRORS.md, step
 * 16: "Every red names a file, a line, a rule and a remedy"). A reader, or a
 * grep, finds the four parts at fixed positions:
 *
 *   x <rule> <file>:<line>: <detail>. Remedy: <remedy>
 *
 * The file is repo-relative with forward slashes whatever the caller passed.
 * The line is omitted only when the finding is about a whole file or a count,
 * and then the file still prints. An em dash never appears: the gate that
 * bans them reads gate output too, and the formatter turns one into a comma
 * rather than trusting every caller to remember.
 *
 * `redSummary` is the count line of a gate whose finding is a count ("6 cream
 * references, baseline 5"). It carries the rule and the remedy as well, so the
 * one line a twenty-line tail is sure to keep still says what to do; the
 * per-item lines above it carry the paths.
 *
 * WHY THIS IS AN .mjs WITH A .ts TWIN. The chain runs every gate under `npx
 * tsx`, where an .mjs may import a .ts (verify_country_seed_confidence.mjs
 * does), but several .mjs gates also document `node scripts/<gate>.mjs` as
 * their run line, and plain node cannot import a .ts by an extensionless
 * specifier. An .mjs implementation runs under both. `scripts/lib/red.ts`
 * re-exports it with the types, so a .ts gate imports `./lib/red` and an .mjs
 * gate imports `./lib/red.mjs`, and there is one implementation.
 *
 * Both functions PRINT (to stderr, where every gate's red already goes, so a
 * gate's lines stay in order) and RETURN the line. `formatRed` and
 * `formatRedSummary` only return it, for a gate that writes to stdout.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

/** The website repo root: this file is scripts/lib/red.mjs. */
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** A finding: the rule broken, where, what was found and what to do. */
/**
 * @typedef {object} Finding
 * @property {string} rule    the gate's name as the chain lists it (no-cream)
 * @property {string} file    the file the finding is in; absolute or relative, any slashes
 * @property {number | string | null} [line]  the line, or omitted for a whole-file or count finding
 * @property {string} detail  what was found, one clause (the literal, the count, the value)
 * @property {string} remedy  what to do, one clause, imperative
 */

/**
 * The repo-relative, forward-slash spelling of a path. An absolute path under
 * the repo is made relative to it; a relative path keeps its spelling with the
 * slashes fixed and a leading `./` dropped. An empty file prints as
 * `(no file)` so the omission is visible in the red rather than a crash in a
 * gate that was already failing.
 * @param {string | null | undefined} file
 * @returns {string}
 */
export function repoRelative(file) {
  let s = String(file ?? "").trim();
  if (s === "") return "(no file)";
  if (path.isAbsolute(s)) s = path.relative(ROOT, s);
  s = s.replace(/\\/g, "/").replace(/^\.\//, "");
  return s;
}

/** Em and en dashes become a comma; a trailing full stop or space goes. */
function clause(s) {
  return String(s ?? "")
    .replace(/\s*[–—]\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.\s]+$/, "");
}

/**
 * The canonical line for one finding, not printed.
 * @param {Finding} f
 * @returns {string}
 */
export function formatRed(f) {
  const hasLine = f.line !== undefined && f.line !== null && String(f.line).trim() !== "";
  const where = hasLine ? `${repoRelative(f.file)}:${String(f.line).trim()}` : repoRelative(f.file);
  return `x ${clause(f.rule)} ${where}: ${clause(f.detail)}. Remedy: ${clause(f.remedy)}`;
}

/**
 * Print one finding as one canonical line on stderr and return it.
 * @param {Finding} f
 * @returns {string}
 */
export function red(f) {
  const line = formatRed(f);
  console.error(line);
  return line;
}

/**
 * The count line of a gate whose finding is a count, not printed.
 * A number prints as `N finding(s)`; a string prints as given, so a gate can
 * say `6 cream references`. `detail` is an optional clause after the count,
 * for the baseline or the direction ("baseline 5").
 * @param {string} rule
 * @param {number | string} count
 * @param {string} remedy
 * @param {string} [detail]
 * @returns {string}
 */
export function formatRedSummary(rule, count, remedy, detail) {
  const n = typeof count === "number" ? `${count} finding${count === 1 ? "" : "s"}` : clause(count);
  const tail = detail ? `, ${clause(detail)}` : "";
  return `x ${clause(rule)} ${n}${tail}. Remedy: ${clause(remedy)}`;
}

/**
 * Print the count line on stderr and return it.
 * @param {string} rule
 * @param {number | string} count
 * @param {string} remedy
 * @param {string} [detail]
 * @returns {string}
 */
export function redSummary(rule, count, remedy, detail) {
  const line = formatRedSummary(rule, count, remedy, detail);
  console.error(line);
  return line;
}
