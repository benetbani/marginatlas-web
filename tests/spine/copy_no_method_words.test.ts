/**
 * NO METHOD WORD IN ANY CARD STRING, ON ANY PAGE (milestone 1, M11; his copy correction of 2026-09-24: "avoid words like
 * modelled, withheld"). The harness's plain-copy gate (scripts/harness/check_copy_plain.mjs) reads the nine harness renders only,
 * and on 2026-10-05 the photographs of milestone 1 caught "typical for the trade, modelled" on the London pizzerias header, a page
 * outside those nine: sixteen strings in COPY still carried a banned word, each printed only on pages the harness never renders (a
 * country whose pay figures disagree, a city with no visitor count, a list that drops a row). This walks every value COPY holds,
 * strings and the text of its templates, against the plain-copy gate's own list, read from that file so the two never drift.
 *
 * ITS BLIND SPOT: a string printed from outside COPY (an older component's own literal) is not read here; the harness gate still
 * reads the renders.
 *
 * Run: npx tsx tests/spine/copy_no_method_words.test.ts
 */
import { readFileSync } from "node:fs";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "copy-no-method-words";
const FILE = "src/lib/spine/copy.ts";
const REMEDY = "say it plainly (\"1 city left out: no pay figure yet.\", \"estimated\"), never a method word his correction of 2026-09-24 struck";
let failed = 0;

/* The plain-copy gate's list, parsed from its source: one `["name", /pattern/i],` per line inside inPage(). */
const gateSrc = readFileSync("scripts/harness/check_copy_plain.mjs", "utf8");
const BANNED: Array<[string, RegExp]> = [...gateSrc.matchAll(/^\s*\["([^"]+)", \/(.+)\/i\],\s*$/gm)].map((m) => [m[1], new RegExp(m[2], "i")]);
if (BANNED.length < 10 || !BANNED.some(([w]) => w === "modelled") || !BANNED.some(([w]) => w === "withheld")) {
  failed++;
  red({ rule: RULE, file: "scripts/harness/check_copy_plain.mjs", detail: `read ${BANNED.length} banned words from the plain-copy gate, expected its ten`, remedy: "keep the gate's list one `[\"word\", /pattern/i],` a line, or teach this parse its new shape" });
}

/* The line of a COPY path in copy.ts: each key found in turn, after the line of the one before it. */
const lines = readFileSync(FILE, "utf8").split("\n");
const lineOf = (path: string[]): number | undefined => {
  let from = 0;
  for (const key of path) {
    const re = new RegExp(`^\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:`);
    const i = lines.findIndex((l, n) => n >= from && re.test(l));
    if (i === -1) return undefined;
    from = i;
  }
  return from + 1;
};

let read = 0;
const walk = (v: unknown, path: string[]): void => {
  if (typeof v === "string" || typeof v === "function") {
    read++;
    const text = String(v);
    for (const [word, re] of BANNED) {
      if (!re.test(text)) continue;
      failed++;
      red({ rule: RULE, file: FILE, line: lineOf(path), detail: `COPY.${path.join(".")} says "${word}": ${JSON.stringify(text.replace(/\s+/g, " ").slice(0, 120))}`, remedy: REMEDY });
    }
    return;
  }
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, [...path, k]);
};
walk(COPY, []);

if (read < 500) {
  failed++;
  red({ rule: RULE, file: FILE, detail: `read only ${read} strings from COPY`, remedy: "check the walk still reaches every value COPY holds" });
}
if (failed > 0) { redSummary(RULE, failed, REMEDY, "COPY strings carry a method word"); process.exit(1); }
console.log(`PASS  ${read} COPY strings and templates, none carrying any of the plain-copy gate's ${BANNED.length} method words`);
