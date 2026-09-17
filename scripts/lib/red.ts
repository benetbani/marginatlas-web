/**
 * scripts/lib/red.ts , the typed face of scripts/lib/red.mjs.
 *
 * One implementation, in the .mjs, because plain `node` runs several .mjs
 * gates and cannot import a .ts; this file exists so a .ts gate gets the
 * `Finding` type and a compile error for a missing field, which is the whole
 * point of a fixed shape. The header of red.mjs holds the reasoning and the
 * format. Import `./lib/red` from a .ts gate; `./lib/red.mjs` from an .mjs one.
 */
import {
  formatRed as formatRedJs,
  formatRedSummary as formatRedSummaryJs,
  red as redJs,
  redSummary as redSummaryJs,
  repoRelative as repoRelativeJs,
} from "./red.mjs";

/** A finding: the rule broken, where, what was found and what to do. */
export type Finding = {
  /** The gate's name as the chain lists it, e.g. `no-cream`. */
  rule: string;
  /** The file the finding is in; absolute or repo-relative, any slashes. */
  file: string;
  /** The line; omitted for a whole-file or count finding, and then the file still prints. */
  line?: number | string | null;
  /** What was found, one clause: the literal, the count, the value. */
  detail: string;
  /** What to do, one clause, imperative. */
  remedy: string;
};

/** `x <rule> <file>:<line>: <detail>. Remedy: <remedy>`, printed on stderr and returned. */
export function red(f: Finding): string {
  return redJs(f);
}

/** The same line, returned and not printed, for a gate that writes to stdout. */
export function formatRed(f: Finding): string {
  return formatRedJs(f);
}

/** The count line of a gate whose finding is a count, printed on stderr and returned. */
export function redSummary(rule: string, count: number | string, remedy: string, detail?: string): string {
  return redSummaryJs(rule, count, remedy, detail);
}

/** The count line, returned and not printed. */
export function formatRedSummary(rule: string, count: number | string, remedy: string, detail?: string): string {
  return formatRedSummaryJs(rule, count, remedy, detail);
}

/** The repo-relative, forward-slash spelling of a path. */
export function repoRelative(file: string | null | undefined): string {
  return repoRelativeJs(file);
}
