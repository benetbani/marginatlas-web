#!/usr/bin/env node
/**
 * scripts/verify_no_silent_db_errors.mjs
 *
 * THE GATE FOR THE FAILURE THAT COST THREE MONTHS.
 *
 * On 2026-08-08 the Supabase service-role key turned out to have been rotated
 * around May. Every server-side read had been failing since, every page had been
 * quietly falling back to synthesised figures, the sitemap's cell shards had
 * been shipping 110 bytes, and nothing anywhere said a word. The cause was one
 * line of code repeated across the data layer:
 *
 *     if (error || !data) return [];
 *
 * which makes a REJECTED QUERY and an EMPTY TABLE identical to the caller.
 * `withBudget` logs when it TIMES OUT, so a query that fails FAST is silent on
 * every path. Three separate rounds of diagnosis blamed a build-time timeout,
 * because that is the only failure the logs could describe.
 *
 * The fix was not the diagnosis. It was making the failure speak: one
 * console.warn turned three firings of guesswork into one line of build log.
 *
 * SO THIS GATE EXISTS TO STOP IT COMING BACK. It finds every place the data
 * layer destructures a Supabase `error` and checks that the guard consuming it
 * routes through dbFailed(), which logs before falling back. It does NOT
 * require anyone to stop failing soft: a slow or broken table must never take a
 * page down, and that is deliberate. Only the silence is banned.
 *
 * WHY A SOURCE SCAN RATHER THAN A UNIT TEST. Importing the data layer pulls in
 * src/lib/supabase.ts, which throws at module load without credentials. A gate
 * in the prebuild chain must never need a secret or a network, so this reads the
 * text instead. Stated plainly because it is this check's blind spot: it can see
 * that dbFailed is called, not that it was called with the right label.
 *
 * Measured clean on 2026-08-09 (five swallow sites fixed in the same commit),
 * so this is a HARD gate rather than a ratchet.
 *
 *   node scripts/verify_no_silent_db_errors.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src/lib/cells.ts", "src/lib/cells"];
/* How many lines after the STATEMENT ENDS the guard may appear in.
   Measured from the end of the statement, not from the destructure, and the
   first version of this gate got that wrong. A chained query spans its own
   several lines:
       const { data, error } = await supabaseAdmin
         .from("regional_cells")
         .select(...)
         .gte(...)
         .limit(limit);
   so counting from the destructure spent the whole window inside the query and
   reported getTopRegionalCells as silent when it logs four lines later. A check
   that cannot see the thing it is checking reports the thing absent. */
const WINDOW = 8;

function files() {
  const out = [];
  for (const r of ROOTS) {
    if (!fs.existsSync(r)) continue;
    const st = fs.statSync(r);
    if (st.isFile()) out.push(r);
    else for (const e of fs.readdirSync(r)) if (e.endsWith(".ts")) out.push(path.join(r, e).replace(/\\/g, "/"));
  }
  return out;
}

const offenders = [];
let checked = 0;

for (const f of files()) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    // A destructure that binds `error` off an awaited query.
    if (!/const\s*\{[^}]*\berror\b[^}]*\}\s*=/.test(lines[i])) continue;
    // Skip the helper's own signature and anything inside a comment block.
    if (/^\s*\*/.test(lines[i])) continue;
    checked++;
    // Walk to the end of the statement first, so a multi-line chained query
    // does not consume the window it is supposed to be measured against.
    let end = i;
    while (end < lines.length - 1 && !/;\s*(\/\/.*)?$/.test(lines[end])) end++;
    const window = lines.slice(end + 1, end + 1 + WINDOW).join("\n");
    const speaks = /dbFailed\s*\(/.test(window) || /console\.(warn|error)\s*\(/.test(window);
    // A destructure whose `error` is never consumed at all is not a swallow,
    // it is dead, and TypeScript's unused-var rules own that case.
    const consumed = /\berror\b/.test(window);
    if (consumed && !speaks) {
      offenders.push({ file: f, line: i + 1, text: lines[i].trim() });
    }
  }
}

console.log(`no-silent-db-errors: ${checked} error destructure(s) in the data layer`);

if (offenders.length > 0) {
  console.error(
    `\nx ${offenders.length} place(s) consume a database error without saying anything:\n`,
  );
  for (const o of offenders) console.error(`  ${o.file}:${o.line}  ${o.text}`);
  console.error(
    `\n  Route the guard through dbFailed("<functionName>", error). It logs and\n` +
      `  returns true, so the fail-soft return is unchanged and only the silence\n` +
      `  goes. An errored query and an empty table must not look the same: that\n` +
      `  exact ambiguity hid a three-month outage.`,
  );
  process.exit(1);
}

console.log("no-silent-db-errors: every database error speaks before it falls back");
process.exit(0);
