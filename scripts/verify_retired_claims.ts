/**
 * verify_retired_claims , a claim that was found false and deleted stays deleted.
 *
 * WHY THIS EXISTS. Twice in one session a false claim was corrected in a page's
 * body and left standing in its metadata, which is the half that reaches a
 * search result:
 *
 *   /download/2026-benchmarks said "It is still being put together" in the body
 *   while its <head> said "Get the 2026 small business benchmarks PDF" and
 *   described the contents as though someone had read them.
 *
 *   /tools corrected the calculator card away from "run your exact rent,
 *   payroll, and concept", wrote a comment explaining that the tool has five
 *   fields and MODELS rent and payroll rather than taking yours, and left the
 *   identical phrase in the page description one screen above it.
 *
 * Both corrections were real, reasoned, and recorded in a comment next to the
 * thing they fixed. Neither survived contact with the second copy of the same
 * sentence. A correction that lives only in prose gets applied to the instance
 * somebody was looking at.
 *
 * WHAT IT CHECKS. Each entry below is a sentence this project examined,
 * established was not true, and removed. The gate fails if one reappears in
 * code. It is not a style rule and not a banned-words list: every entry cites
 * the specific reason the claim is false and where that finding is recorded.
 *
 * COMMENTS ARE STRIPPED, and that is load-bearing rather than incidental. Every
 * one of these phrases appears in the repository right now inside the comment
 * that records its deletion, which is exactly where it should be. A gate
 * reading raw lines would fail on the documentation of the fix and the only way
 * to quiet it would be to delete the explanation. Uses scripts/lib/strip_comments
 * for the same reason two other gates in this chain do: a bare startsWith("//")
 * understands the first line of a block comment and none of the rest.
 *
 * THE BLIND SPOT, stated rather than discovered later. This reads source text,
 * so it catches a claim that is written down and cannot catch one that is
 * assembled: a phrase built from a variable, split across a template
 * interpolation, or produced by data will pass. It also does not know whether a
 * claim is true, only whether this project already ruled that it was not. A new
 * false claim in new words is invisible to it. It closes the specific hole that
 * opened twice, which is a correction applied to one of two copies.
 *
 * SCOPE: src only. Markdown in content/ has no comment syntax to strip, so
 * scanning it would fail on any post legitimately discussing a retired claim,
 * and the surfaces these claims damaged are all rendered from src.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const SRC = resolve(PROJECT_ROOT, "src");
const SELF = "scripts/verify_retired_claims.ts";

type RetiredClaim = {
  /** Matched against comment-stripped source. \s+ between words tolerates reflow. */
  pattern: RegExp;
  /** The claim, as it read. */
  claim: string;
  /** Why it is not true. */
  why: string;
  /** What to write instead. */
  instead: string;
};

const RETIRED: RetiredClaim[] = [
  {
    pattern: /exact\s+rent,\s*payroll/i,
    claim: "run your exact rent, payroll, and concept",
    why:
      "the calculator has five fields (country, region, industry, size band, " +
      "annual revenue) and MODELS rent and payroll from the trade's cost " +
      "structure. That is the opposite of exact and the opposite of yours, and " +
      "there is no concept field at all.",
    instead:
      "the promise the calculator's own h1 makes: find your break-even, and " +
      "whether the owner gets paid.",
  },
  {
    pattern: /38\s+pages/i,
    claim: "Free PDF - 38 pages",
    why:
      "there is no PDF. A page count can only be read as a fact about a " +
      "document somebody has seen, and no number is the right number for a " +
      "document that does not exist.",
    instead: "nothing. Describe what it will contain, never how long it is.",
  },
  {
    pattern: /unsubscribe\s+with\s+one\s+click/i,
    claim: "Unsubscribe with one click",
    why:
      "one-click unsubscribe means a link in an email, and this project has no " +
      "email provider at all: no resend, nodemailer, sendgrid, postmark or SES " +
      "in package.json. No message is ever sent, so there is no link to click, " +
      "and there is no unsubscribe route, handler or token anywhere in the app.",
    instead:
      "the line that is true and is already in use: \"No spam, no shilling. " +
      "Ask and you are off the list.\", pointing at /contact, which works.",
  },
  {
    pattern: /(just\s+)?sent\s+the\s+PDF/i,
    claim: "We just sent the PDF to {email}. Check your inbox.",
    why:
      "nothing was sent. There is no email provider, no PDF, and no PDF " +
      "library to build one with. This told a reader to go hunting in their " +
      "spam folder for a message that was never sent.",
    instead:
      "what actually happened: the address is on the list, and the document " +
      "comes when it exists.",
  },
  {
    pattern: /105\s+countries/i,
    claim: "105 countries",
    why:
      "it matched nothing. The picker offers 195 and the atlas holds " +
      "benchmarks in 94. It was a figure from an earlier shape of the data, " +
      "left on the homepage, which is the surface where a wrong number costs " +
      "most.",
    instead:
      "getAtlasLedger(), which derives the count from the same source the page " +
      "it links to is built from. If the atlas genuinely reaches 105 one day, " +
      "derive it, do not type it.",
  },
  {
    pattern: /245\s+cities/i,
    claim: "245 cities across the atlas",
    why: "the atlas has 252 city pages. The 404 page was stating a stale count.",
    instead:
      "no count, or one derived from the city list. A number typed on a page " +
      "that nobody maintains is a number that goes stale silently.",
  },
];

type Hit = { file: string; line: number; claim: RetiredClaim; text: string };

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

/**
 * Comment-stripped source as one string, plus a character-index to line-number
 * map.
 *
 * Flattening rather than testing line by line is what lets a pattern match a
 * claim that has been reflowed across two source lines, which is the normal
 * state of a long description in this codebase. The map exists so the failure
 * can still name the line the claim starts on.
 */
function flatten(src: string): { text: string; lineAt: (i: number) => number } {
  const state = newCommentState();
  const stripped = src.split("\n").map((l) => stripComments(l, state));
  const starts: number[] = [];
  let offset = 0;
  for (const line of stripped) {
    starts.push(offset);
    offset += line.length + 1; // +1 for the newline
  }
  return {
    text: stripped.join("\n"),
    lineAt: (i: number) => {
      let lo = 0;
      let hi = starts.length - 1;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (starts[mid] <= i) lo = mid;
        else hi = mid - 1;
      }
      return lo + 1;
    },
  };
}

const hits: Hit[] = [];
let scanned = 0;

for (const file of walk(SRC)) {
  const rel = file.replace(PROJECT_ROOT, "").replace(/^[\\/]/, "").replace(/\\/g, "/");
  if (rel === SELF) continue;
  let src: string;
  try {
    src = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  scanned++;
  const { text, lineAt } = flatten(src);
  for (const claim of RETIRED) {
    const re = new RegExp(claim.pattern.source, claim.pattern.flags.replace("g", ""));
    const m = re.exec(text);
    if (!m) continue;
    hits.push({
      file: rel,
      line: lineAt(m.index),
      claim,
      text: m[0].replace(/\s+/g, " "),
    });
  }
}

if (hits.length === 0) {
  console.log(
    `[verify_retired_claims] PASS: none of the ${RETIRED.length} retired claims ` +
      `have come back (${scanned} files scanned, comments excluded)`,
  );
  process.exit(0);
}

console.error(
  `[verify_retired_claims] FAIL: ${hits.length} retired claim(s) back in code:`,
);
for (const h of hits) {
  console.error(`\n  ${h.file}:${h.line}  matched "${h.text}"`);
  console.error(`    the claim : ${h.claim.claim}`);
  console.error(`    why it went: ${h.claim.why}`);
  console.error(`    instead    : ${h.claim.instead}`);
}
console.error(
  "\nEach of these was examined, found untrue, and deleted. If one is now " +
    "\ntrue, that is a change in the product and the entry belongs in this " +
    "\ngate's table with the finding that made it true, not simply removed.",
);
process.exit(1);
