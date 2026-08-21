/**
 * scripts/verify_content_unchanged.ts , the gate the shadcn migration lives or
 * dies by.
 *
 * ============================== THE RULE ===================================
 *
 * Founder, 2026-08-21, first statement:
 *
 *   "this is a new design thing. The replacement of elements should not impose
 *    changes on the content unless they were all due to be changed beforehand."
 *
 * And his amendment, later the same day, which reverses how strictly that binds:
 *
 *   "due to the fact that these components are proven and tested, you should
 *    really think whether we should remove the subtitles and their parts. The
 *    tendency should be to switch to suit the content that we have according to
 *    the structure of the new components."
 *
 * Together they give the rule this file enforces:
 *
 *   **STRUCTURE ADAPTS. SUBSTANCE DOES NOT.**
 *
 * A migration may move a string between slots, drop a subtitle a component has
 * no slot for, and reorder within a section. It may not add a claim, drop a
 * figure, or change what a number says.
 *
 * ========================= WHY THE CHECK IS ASYMMETRIC =====================
 *
 * | change            | verdict | why                                          |
 * |-------------------|---------|----------------------------------------------|
 * | figure altered    | FAIL    | that is the product                          |
 * | figure added      | FAIL    | a number nobody ratified                     |
 * | figure removed    | FAIL    | self-omission is a decision, not a side effect|
 * | string added      | FAIL    | this is how an invented verdict enters        |
 * | string removed    | REPORT  | now sanctioned; a human glances at the list   |
 * | reordered only    | PASS    | explicitly permitted by the amendment         |
 *
 * Losing a sentence is a judgement call the amendment allows. GAINING one is
 * the defect class this whole effort exists to remove: a shadcn card offers a
 * description slot, someone fills it to justify the slot, and the site now makes
 * a claim nobody approved. That asymmetry is the entire point of this file.
 *
 * ========================= WHY IT DRIVES A REAL BROWSER ====================
 *
 * It reads the page the way a reader gets it, hydrated. The static
 * server-render harness cannot see anything drawn in the browser, and the
 * migration it guards is mostly charts. A content diff blind to chart labels
 * would pass a chart that lost its axis.
 *
 * ============================== USAGE ======================================
 *
 *   npx tsx scripts/verify_content_unchanged.ts snapshot <url> <name>
 *   npx tsx scripts/verify_content_unchanged.ts check    <url> <name>
 *
 * Snapshot BEFORE touching a surface. Check after. A snapshot taken after the
 * change proves nothing about the change, which is why Phase 0 builds this
 * before Phase 2 starts.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = "data/content-snapshots";

interface Snapshot {
  url: string;
  takenAt: string;
  /** Every visible string, whitespace-collapsed. A multiset: repeats matter. */
  strings: string[];
  /** Every numeric token as it is PRINTED, including separators and unit. */
  figures: string[];
}

/**
 * A figure is captured AS PRINTED, not as parsed. `$86,000` and `$86000` are
 * different figures here, deliberately: one of them is a formatting regression
 * and this gate should see it. Parsing to a Number would hide exactly that.
 */
const FIGURE_RE = /[$£€¥]?\s?\d[\d,. ]*\d\s?(?:%|k|K|m|M|bn|BN)?|[$£€¥]?\s?\d\s?(?:%|k|K|m|M)?/g;

/**
 * STATIC MODE. Extract the same two sets straight out of server-rendered HTML,
 * with no browser at all.
 *
 * WHY IT EXISTS. Two reasons, and the second is the one that forced it.
 *
 *  1. It is CORRECT for server-rendered content, which is what the tables phase
 *     migrates. A table is fully present in the HTML; sending a browser to look
 *     at it buys nothing.
 *  2. Chromium could not launch. Measured on this machine: 506MB free of 8GB
 *     with the founder's own applications running. A verification path that
 *     needs a gigabyte to check a table is a verification path that stops
 *     working exactly when the machine is busy.
 *
 * BLIND SPOT, and it is the whole reason browser mode still exists: this sees
 * nothing drawn in the browser. Point it at a chart and it will report the
 * chart's container and none of its labels. **Use `--url` for anything with a
 * chart in it; use a file for server-rendered surfaces.**
 */
function captureStatic(file: string): Snapshot {
  const html = readFileSync(file, "utf8");

  /* Drop what a reader never sees. Order matters: script and style first, or
     their contents leak into the text as strings. */
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  const strings: string[] = [];
  /* Split on tags, keep the text between them. React inserts <!-- --> between
     adjacent text nodes, which the comment strip above already removed, so a
     sentence broken across those is rejoined here by the whitespace collapse. */
  for (const chunk of stripped.split(/<[^>]+>/)) {
    const t = chunk
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_m, d) => String.fromCharCode(Number(d)))
      .replace(/\s+/g, " ")
      .trim();
    if (t) strings.push(t);
  }

  const figures: string[] = [];
  for (const s2 of strings) {
    const m = s2.match(FIGURE_RE);
    if (m) figures.push(...m.map((x) => x.replace(/\s+/g, " ").trim()));
  }

  return { url: file, takenAt: new Date().toISOString(), strings, figures };
}

async function capture(url: string): Promise<Snapshot> {

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } } as never);
    await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
    /* Give client-drawn content a moment. A chart that has not drawn yet looks
       exactly like a chart that lost its labels. */
    await page.waitForTimeout(1500);

    const strings = await page.evaluate(() => {
      const out: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const el = n.parentElement;
        if (!el) continue;
        /* Skip what a reader cannot see. `offsetParent` is null for
           display:none, and the explicit checks catch the rest. */
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (el.closest("script,style,noscript")) continue;
        const t = (n.textContent ?? "").replace(/\s+/g, " ").trim();
        if (t) out.push(t);
      }
      return out;
    });

    const figures: string[] = [];
    for (const s of strings) {
      const m = s.match(FIGURE_RE);
      if (m) figures.push(...m.map((x) => x.replace(/\s+/g, " ").trim()));
    }

    return { url, takenAt: new Date().toISOString(), strings, figures };
  } finally {
    await browser.close();
  }
}

/** Multiset difference: what is in `a` that `b` does not cover. */
function missing(a: string[], b: string[]): string[] {
  const pool = new Map<string, number>();
  for (const x of b) pool.set(x, (pool.get(x) ?? 0) + 1);
  const out: string[] = [];
  for (const x of a) {
    const n = pool.get(x) ?? 0;
    if (n > 0) pool.set(x, n - 1);
    else out.push(x);
  }
  return out;
}

/* WRAPPED IN main(). tsx compiles .ts to CJS, where top-level await is a
   transform error. scripts/gen_presence_manifest.ts uses the same shape;
   this is the repo convention, not a workaround. */
async function main() {
  const [mode, url, name] = process.argv.slice(2);

  if (!mode || !url || !name) {
    console.error("usage: npx tsx scripts/verify_content_unchanged.ts <snapshot|check> <url-or-html-file> <name>");
    process.exit(2);
  }

  mkdirSync(DIR, { recursive: true });
  const path = join(DIR, `${name}.json`);

  /* An http target goes through a browser; anything else is a file on disk and
     is read directly. Server-rendered surfaces should use the file path. */
  const now = /^https?:\/\//.test(url) ? await capture(url) : captureStatic(url);

  if (mode === "snapshot") {
    writeFileSync(path, JSON.stringify(now, null, 2) + "\n");
    console.log(`  snapshot ${name}: ${now.strings.length} strings, ${now.figures.length} figures`);
    console.log(`  ${path}`);
    process.exit(0);
  }

  if (mode !== "check") {
    console.error(`unknown mode: ${mode}`);
    process.exit(2);
  }

  if (!existsSync(path)) {
    console.error(`  no snapshot for "${name}". Take one BEFORE the change:`);
    console.error(`    npx tsx scripts/verify_content_unchanged.ts snapshot ${url} ${name}`);
    process.exit(1);
  }

  const before = JSON.parse(readFileSync(path, "utf8")) as Snapshot;

  const figuresLost = missing(before.figures, now.figures);
  const figuresGained = missing(now.figures, before.figures);
  const stringsLost = missing(before.strings, now.strings);
  const stringsGained = missing(now.strings, before.strings);

  console.log(
    `\n  ${name}\n  before: ${before.strings.length} strings, ${before.figures.length} figures` +
      `\n  now:    ${now.strings.length} strings, ${now.figures.length} figures\n`,
  );

  let failed = 0;

  if (figuresLost.length || figuresGained.length) {
    failed++;
    console.log("  FAIL  the figures changed. Substance may not change.");
    figuresLost.slice(0, 12).forEach((f) => console.log(`        lost:   ${f}`));
    figuresGained.slice(0, 12).forEach((f) => console.log(`        gained: ${f}`));
    if (figuresLost.length + figuresGained.length > 24) {
      console.log(`        ... and ${figuresLost.length + figuresGained.length - 24} more`);
    }
  } else {
    console.log(`  ok    every figure survived, unchanged (${now.figures.length})`);
  }

  if (stringsGained.length) {
    failed++;
    console.log("  FAIL  strings were ADDED. That is a claim nobody ratified.");
    stringsGained.slice(0, 12).forEach((s) => console.log(`        + ${s.slice(0, 90)}`));
  } else {
    console.log("  ok    no string was added");
  }

  if (stringsLost.length) {
    /* REPORTED, NOT FAILED. The amendment sanctions dropping a subtitle a
       component has no slot for. A human reads this list; the build does not
       stop for it. */
    console.log(`\n  REVIEW  ${stringsLost.length} string(s) no longer appear. Sanctioned, but read them:`);
    stringsLost.slice(0, 20).forEach((s) => console.log(`        - ${s.slice(0, 90)}`));
    if (stringsLost.length > 20) console.log(`        ... and ${stringsLost.length - 20} more`);
  } else {
    console.log("  ok    no string was lost");
  }

  console.log(failed === 0 ? "\n  PASS\n" : `\n  ${failed} FAILED\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
