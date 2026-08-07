#!/usr/bin/env node
/**
 * scripts/loop/prose.mjs , read a rendered page as a human reads it.
 *
 * WHY THIS EXISTS. On 2026-08-04 this technique found NINE defects that
 * TypeScript and 62 gates could not see. Gates found none of them. It needs no
 * Chromium, which matters on a box with 1.5GB free, and it catches the one
 * class of defect that is invisible in source: a page whose markup is valid,
 * whose types check, and whose text is wrong when laid out.
 *
 * WHAT IT CATCHES, and each of these is a real find:
 *
 *   FUSED WORDS      "Londonmeasured16,765" means a run of `.row` elements is
 *                    outside `.statblock` and got no grid. 125 of the city
 *                    page's 129 rows were like this on a page delivered as
 *                    complete.
 *   CLIPPED VALUES   "24% of hou", "Best in Shore". `--val-col` is 78px and a
 *                    longer string is cut mid-word with no ellipsis.
 *   LEAKED APPARATUS an agency name, an internal audit note, a TODO. Data
 *                    fields are not automatically publishable.
 *   BANNED COPY      first person, "coming soon", "net margin", an em dash.
 *   EMPTY PAGE       under ~800 characters means the route did not match and
 *                    Next rendered a bare layout. Three phantom dev routes
 *                    answered HTTP 200 with 594 characters for days.
 *
 * A ZERO-BYTE RESPONSE IS A DEAD SERVER, NOT A PASS. This exits non-zero on an
 * empty body for exactly that reason: a grep over an empty file prints nothing
 * and reads like success. That mistake produced a whole false finding once.
 *
 * USAGE
 *   node scripts/loop/prose.mjs /dev/home3
 *   node scripts/loop/prose.mjs /world --port 3210 --chars 4000
 *   node scripts/loop/prose.mjs https://www.marginatlas.com/world
 *   node scripts/loop/prose.mjs /world /industries /cities/london
 */

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};
const PORT = flag("port", "3210");
const CHARS = Number(flag("chars", 3000));
const QUIET = argv.includes("--quiet");
/**
 * UNDO GIT BASH'S PATH MANGLING BEFORE IT LOOKS LIKE A 404.
 *
 * Git Bash on Windows rewrites any argument beginning with `/` into a Windows
 * path rooted at its own install directory, so `/dev/home3` arrives here as
 * `C:/Program Files/Git/dev/home3`. This tool then fetched that, got the 404
 * page, and reported "very likely a route that does not exist" , which is the
 * single most misleading thing it can say, because it is the exact signature of
 * the three phantom dev routes that hid for days.
 *
 * The landmine was already written down in the plan. Reading it did not stop it.
 * So the defence goes in the tool, where it cannot be forgotten.
 */
function unmangle(a) {
  const m = a.match(/^[A-Za-z]:[\\/](?:Program Files[\\/])?Git[\\/](.*)$/i);
  return m ? "/" + m[1].replace(/\\/g, "/") : a;
}

const targets = argv.filter((a) => !a.startsWith("--") && !/^\d+$/.test(a)).map(unmangle);

if (!targets.length) {
  console.error("usage: node scripts/loop/prose.mjs <path-or-url> [more...] [--port 3210] [--chars 3000]");
  process.exit(1);
}

/** Strip everything a reader does not read, then collapse whitespace. */
function toProse(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsaquo;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A fused word is a lowercase letter or digit immediately followed by an
 * uppercase letter or a digit-then-letter boundary that no English word makes.
 * Deliberately narrow: it reports candidates for a human to read, not a verdict.
 */
function findFused(text) {
  const hits = new Set();
  for (const m of text.matchAll(/[a-z]{3,}[A-Z][a-z]{2,}/g)) hits.add(m[0]);
  for (const m of text.matchAll(/[a-z]{3,}\d[\d,.]*/g)) hits.add(m[0]);
  for (const m of text.matchAll(/\d[\d,.]*[a-z]{4,}/g)) hits.add(m[0]);
  return [...hits].filter((h) => !/^(https?|www)/i.test(h)).slice(0, 25);
}

/** Copy that must never reach a reader. Each one is a ratified rule. */
const BANNED = [
  [/\bcoming soon\b/i, "coming soon"],
  [/\bnet margin\b/i, "banned vocabulary: net margin"],
  [/\bturnover\b/i, "banned vocabulary: turnover"],
  [/\bpercentage points?\b/i, "banned vocabulary: percentage points"],
  [/[—]/, "em dash"],
  [/(?:^|[\s"'(])--(?:[\s"')]|$)/, "double hyphen used as a dash"],
  [/\b(?:we|us|our|ours)\b/i, "first person"],
  [/\bI\s+(?:think|believe|have|would)\b/, "first person"],
  [/\bTODO\b|\bFIXME\b|\bXXX\b/, "developer note"],
  [/\bundefined\b|\bNaN\b|\bnull\b/, "raw JS value rendered"],
  [/\[object Object\]/, "object rendered as text"],
];

/** Clipping is invisible in text. This flags the shapes it leaves behind. */
function findTruncated(text) {
  const hits = [];
  for (const m of text.matchAll(/\b\w+\s(?:of|in|per|the|a)\b(?=\s[A-Z])/g)) hits.push(m[0]);
  return hits.slice(0, 10);
}

let worst = 0;

for (const t of targets) {
  const url = /^https?:\/\//.test(t) ? t : `http://localhost:${PORT}${t.startsWith("/") ? t : "/" + t}`;
  console.log(`\n${"=".repeat(72)}\n${url}\n${"=".repeat(72)}`);

  let res, html;
  try {
    res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(120_000) });
    html = await res.text();
  } catch (e) {
    console.log(`  DEAD: ${e.message}`);
    console.log(`  If this is localhost, the dev server died. Restart it before trusting anything else.`);
    worst = Math.max(worst, 2);
    continue;
  }

  const bytes = Buffer.byteLength(html);
  console.log(`  HTTP ${res.status}   ${bytes} bytes`);

  /* The dead-server trap, stated loudly because it has already caused one
     false finding: an empty body greps clean and looks like a pass. */
  if (bytes === 0) {
    console.log(`  ZERO BYTES. The server is dead. This is NOT a pass.`);
    worst = Math.max(worst, 2);
    continue;
  }
  if (res.status !== 200) {
    console.log(`  Non-200. ${res.status === 403 ? "403 to a script is usually middleware, verify in a browser." : "Investigate."}`);
    if (res.status !== 403) worst = Math.max(worst, 2);
  }

  const text = toProse(html);
  if (text.length < 800) {
    console.log(`  ONLY ${text.length} CHARACTERS OF TEXT. Next renders the layout for an unmatched path,`);
    console.log(`  so this is very likely a route that does not exist. NOT a pass.`);
    worst = Math.max(worst, 2);
  }

  const fused = findFused(text);
  if (fused.length) {
    console.log(`\n  FUSED WORD CANDIDATES (${fused.length}) , a run of .row outside .statblock:`);
    for (const f of fused) console.log(`    ${f}`);
    worst = Math.max(worst, 1);
  }

  const trunc = findTruncated(text);
  if (trunc.length) {
    console.log(`\n  POSSIBLE CLIPPED VALUES (${trunc.length}) , the .v slot is 78px:`);
    for (const f of trunc) console.log(`    ...${f}...`);
  }

  const banned = BANNED.filter(([re]) => re.test(text)).map(([, label]) => label);
  if (banned.length) {
    console.log(`\n  BANNED COPY REACHED THE READER:`);
    for (const b of new Set(banned)) console.log(`    ${b}`);
    worst = Math.max(worst, 1);
  }

  if (!QUIET) {
    console.log(`\n  --- READ THIS AS PROSE. If a sentence is wrong, the page is wrong. ---\n`);
    console.log(text.slice(0, CHARS).replace(/(.{100}\s)/g, "$1\n  ").replace(/^/gm, "  "));
    if (text.length > CHARS) console.log(`\n  [${text.length - CHARS} more characters not shown]`);
  }
}

process.exit(worst);
