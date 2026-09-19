/**
 * scripts/lib/loud_seats.ts , THE SIX LOUD-MOMENTS DECLARATIONS, READ OFF THE
 * VIEWS' SOURCE (plan-2026-09-17/04-PAGES.md step 40, 2026-09-19; MODEL.md
 * PART 6 and PART 8's "THE THREE LOUD MOMENTS" seat tables). Shared by the
 * section census (scripts/harness/census.ts, which prints the ledger) and the
 * loud-seats gate (scripts/verify_loud_seats.ts, which holds the renders to
 * it), so the two cannot read a declaration two ways.
 *
 * WHAT IT READS. Every .tsx under src/components/spine/<page>/ (the archetypes
 * folder and the kit files skipped, the census's own walk) for an
 * `export const LOUD_SEATS = [ ... ]` and, in it, three object literals whose
 * values are numbers and double-quoted strings and nothing else; comments are
 * stripped first (scripts/lib/strip_comments), so a commented-out declaration
 * is not one. Each page in SPINE_PAGES must declare exactly once, with seats
 * 1, 2 and 3 each once, every state one of src/lib/spine/loud_seats.ts's three
 * words, and every LIT seat naming a card id (the block's word after its
 * two-digit number, or `id`). Anything else is a fault this module reports as
 * a list of lines naming the file; the caller reds and exits, never prints a
 * half-read ledger.
 *
 * WHY SOURCE AND NOT AN IMPORT. A view's module graph reaches the adapters,
 * which build the database client at import (src/lib/supabase.ts throws
 * without a URL), and the chain never needs a secret; the type module the
 * views `satisfies` against is pure and is not imported here either, so this
 * file's vocabulary is a literal copy of it, asserted equal by
 * verify_loud_seats.ts at startup (the way check_model_laws.mjs hand-keeps
 * EVEN_BY_RULING).
 *
 * BLIND SPOT: a declaration built from an expression, a template or a spread
 * is not read; it is reported as a fault, not silently skipped.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { stripCommentLines } from "./strip_comments";

export const SPINE_ROOT = "src/components/spine";
export const SPINE_PAGES = ["country", "howto", "city", "hood", "cell", "industry"] as const;
export type SpinePage = (typeof SPINE_PAGES)[number];
const SKIP_DIRS = new Set(["archetypes"]);
const SKIP_FILES = new Set(["kit.tsx", "shell.tsx", "marks.tsx", "forms-v2.tsx", "motion.tsx"]);

/** The vocabulary, a literal copy of src/lib/spine/loud_seats.ts's LOUD_STATES; the gate asserts the two equal. */
export const LOUD_STATES = ["LIT", "HELD EMPTY", "NO HONEST CANDIDATE"] as const;
export type LoudState = (typeof LOUD_STATES)[number];

export type LoudSeat = { seat: 1 | 2 | 3; card: string; figure: string; state: LoudState; condition: string; id?: string };
export type LoudDeclaration = { page: SpinePage; file: string; line: number; seats: LoudSeat[] };
export type LoudSeatsRead = { declarations: Map<SpinePage, LoudDeclaration>; faults: string[] };

const NL = String.fromCharCode(10);

/** Every view file the census reads, in the census's order (sorted names, folders walked). */
export function spineViewFiles(root = SPINE_ROOT): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name).replace(/\\/g, "/");
      if (statSync(full).isDirectory()) { if (!SKIP_DIRS.has(name)) walk(full); continue; }
      if (name.endsWith(".tsx") && !SKIP_FILES.has(name)) out.push(full);
    }
  };
  walk(root);
  return out;
}

/** The page a spine file belongs to: its folder, the how-to view its own page. */
export function pageOfSpineFile(file: string): string {
  const base = basename(file);
  if (base.startsWith("how-to")) return "howto";
  return file.replace(/\\/g, "/").split("/")[3];
}

/** The DOM id a LIT seat is matched by (the type module's `loudCardId`, copied so this file imports nothing under src). */
export function loudCardId(seat: Pick<LoudSeat, "card" | "id">): string | null {
  if (seat.id) return seat.id;
  const m = /^\d\d\s+([a-z][a-z0-9-]*)$/.exec(seat.card.trim());
  return m ? m[1] : null;
}

export function litCount(seats: readonly LoudSeat[]): number {
  return seats.filter((s) => s.state === "LIT").length;
}

/* THE LITERAL PARSER. Walks the source from `export const LOUD_SEATS` to the
   matching `]`, skipping string literals, then each `{ ... }` at depth one,
   then `key: value` pairs where the value is an integer or a double-quoted
   string (backslash escapes honoured). A value of any other kind is a fault
   naming the file and the line. */
function scanString(src: string, at: number): { value: string; end: number } | null {
  if (src[at] !== '"') return null;
  let i = at + 1; let out = "";
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") { const n = src[i + 1]; out += n === "n" ? NL : n; i += 2; continue; }
    if (ch === '"') return { value: out, end: i + 1 };
    if (ch === NL) return null;
    out += ch; i++;
  }
  return null;
}

/** The index just past the bracket that closes the one opened at `open`, strings skipped; -1 when unbalanced. */
function closeOf(src: string, open: number, openCh: string, closeCh: string): number {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === '"') { const s = scanString(src, i); if (!s) return -1; i = s.end - 1; continue; }
    if (ch === "'" || ch === "`") return -1;
    if (ch === openCh) depth++;
    else if (ch === closeCh) { depth--; if (depth === 0) return i + 1; }
  }
  return -1;
}

function lineAt(src: string, offset: number): number {
  return src.slice(0, offset).split(NL).length;
}

/**
 * Parse one file's declaration. `null` when the file declares none; otherwise
 * the seats, or the faults (each a sentence naming the file and line).
 */
export function parseLoudSeats(src: string, file: string): { seats: LoudSeat[]; line: number; faults: string[] } | null {
  const code = stripCommentLines(src.split(String.fromCharCode(13)).join("").split(NL)).join(NL);
  const head = /export\s+const\s+LOUD_SEATS\b[^=]*=\s*\[/.exec(code);
  if (!head) return null;
  const open = head.index + head[0].length - 1;
  const line = lineAt(code, head.index);
  const faults: string[] = [];
  const fault = (at: number, what: string) => faults.push(`${file}:${lineAt(code, at)}: ${what}`);
  const end = closeOf(code, open, "[", "]");
  if (end === -1) { fault(open, "LOUD_SEATS opens `[` and the closing `]` cannot be found with strings skipped (a single quote, a backtick or an unterminated string inside)"); return { seats: [], line, faults }; }
  const body = code.slice(open + 1, end - 1);
  const seats: LoudSeat[] = [];
  let i = 0;
  const base = open + 1;
  while (i < body.length) {
    const ch = body[i];
    if (/\s|,/.test(ch)) { i++; continue; }
    if (ch !== "{") { fault(base + i, `LOUD_SEATS holds something that is not an object literal at \`${body.slice(i, i + 24).trim()}\`; three literal entries and nothing else`); return { seats, line, faults }; }
    const objEnd = closeOf(body, i, "{", "}");
    if (objEnd === -1) { fault(base + i, "an entry's `{` has no closing `}` with strings skipped"); return { seats, line, faults }; }
    const obj = body.slice(i + 1, objEnd - 1);
    const entry: Record<string, string | number> = {};
    let j = 0;
    while (j < obj.length) {
      const c = obj[j];
      if (/\s|,/.test(c)) { j++; continue; }
      const key = /^([A-Za-z_]\w*)\s*:\s*/.exec(obj.slice(j));
      if (!key) { fault(base + i + 1 + j, `an entry holds \`${obj.slice(j, j + 24).trim()}\` where a \`key: value\` pair should be`); break; }
      j += key[0].length;
      const num = /^-?\d+(?![\w.])/.exec(obj.slice(j));
      if (num) { entry[key[1]] = Number(num[0]); j += num[0].length; continue; }
      const str = scanString(obj, j);
      if (str) { entry[key[1]] = str.value; j = str.end; continue; }
      fault(base + i + 1 + j, `\`${key[1]}\` holds \`${obj.slice(j, j + 24).trim()}\`, which is not a number or a double-quoted string; the declaration is literals only, so the census can read it without importing the view`);
      break;
    }
    const seat = entry.seat, card = entry.card, figure = entry.figure, state = entry.state, condition = entry.condition, id = entry.id;
    if (![1, 2, 3].includes(seat as number)) fault(base + i, `an entry's seat is ${JSON.stringify(seat ?? null)}; a seat is 1, 2 or 3`);
    for (const k of ["card", "figure", "state", "condition"] as const) if (typeof entry[k] !== "string" || (entry[k] as string).trim() === "") fault(base + i, `seat ${String(seat)} has no \`${k}\` string`);
    if (typeof state === "string" && !(LOUD_STATES as readonly string[]).includes(state)) fault(base + i, `seat ${String(seat)} has state "${state}"; the states are ${LOUD_STATES.map((s) => `"${s}"`).join(", ")}`);
    if (id !== undefined && (typeof id !== "string" || !/^[a-z][a-z0-9-]*$/.test(id))) fault(base + i, `seat ${String(seat)} has an id ${JSON.stringify(id)} that is not a DOM id`);
    const built: LoudSeat = { seat: seat as 1 | 2 | 3, card: String(card ?? ""), figure: String(figure ?? ""), state: state as LoudState, condition: String(condition ?? "") };
    if (typeof id === "string") built.id = id;
    if (built.state === "LIT" && !loudCardId(built)) fault(base + i, `seat ${String(seat)} is LIT and names no card id: its card "${built.card}" is not "<nn> <id>" and it gives no \`id\``);
    seats.push(built);
    i = objEnd;
  }
  seats.sort((a, b) => a.seat - b.seat);
  if (seats.length !== 3 || seats.some((s, k) => s.seat !== k + 1)) fault(head.index, `LOUD_SEATS declares seats ${seats.map((s) => s.seat).join(", ") || "none"}; a page declares seats 1, 2 and 3, once each (MODEL.md PART 6: three loud moments or fewer)`);
  return { seats, line, faults };
}

/**
 * Every page's declaration, read off the views. `faults` is empty when each
 * of SPINE_PAGES declares exactly once and every declaration parses.
 */
export function readLoudSeats(root = SPINE_ROOT): LoudSeatsRead {
  const declarations = new Map<SpinePage, LoudDeclaration>();
  const faults: string[] = [];
  for (const file of spineViewFiles(root)) {
    const parsed = parseLoudSeats(readFileSync(file, "utf8"), file);
    if (!parsed) continue;
    const page = pageOfSpineFile(file) as SpinePage;
    faults.push(...parsed.faults);
    if (!(SPINE_PAGES as readonly string[]).includes(page)) { faults.push(`${file}:${parsed.line}: LOUD_SEATS declared under "${page}", which is not a spine page (${SPINE_PAGES.join(", ")})`); continue; }
    const have = declarations.get(page);
    if (have) { faults.push(`${file}:${parsed.line}: a second LOUD_SEATS for the ${page} page; the first is ${have.file}:${have.line}; one declaration per page`); continue; }
    declarations.set(page, { page, file, line: parsed.line, seats: parsed.seats });
  }
  for (const page of SPINE_PAGES) if (!declarations.has(page)) faults.push(`${SPINE_ROOT}/${page === "howto" ? "country/how-to-view.tsx" : page}: no LOUD_SEATS declared for the ${page} page; its view exports the three seats (MODEL.md PART 8's seat table for it)`);
  return { declarations, faults };
}
