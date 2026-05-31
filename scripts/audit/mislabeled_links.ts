/**
 * mislabeled_links.ts — find cards/links whose VISIBLE TEXT disagrees with
 * where they actually navigate. "Says X, sends you to Y."
 *
 * Static scan of src/ JSX. Catches the common card bugs:
 *   1. href hardcodes a different industry/geo than the card's label/title
 *      (copy-paste card where the link was not updated).
 *   2. <Link>/<a> with a slug in the text that does not appear in the href.
 *   3. Cards that link to "#" or "" (dead, say something, go nowhere).
 *
 * Heuristic + read-only. Emits suspects to review; not a hard gate (too many
 * legitimate cases where text and href legitimately differ). Run:
 *   npx tsx scripts/audit/mislabeled_links.ts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = "src";
type Hit = { file: string; line: number; kind: string; detail: string };

function walk(dir: string, acc: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

/** Slugify a human label the way the site does, for text-vs-href comparison. */
function slugifyText(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const hits: Hit[] = [];

for (const file of walk(SRC)) {
  const src = readFileSync(file, "utf-8");
  const lines = src.split("\n");
  const rel = relative(".", file);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Dead links: href="#" or href="" or href={`#`} on an anchor/Link.
    if (/\b(href|to)=(["'`])\s*#?\s*\2/.test(line) || /\bhref=["'`]#["'`]/.test(line)) {
      hits.push({ file: rel, line: i + 1, kind: "dead-link", detail: line.trim().slice(0, 100) });
    }

    // 2. Static href with a literal multi-segment path on a card. Pull the last
    //    path segment; if the SAME line or the next 3 lines contain visible text
    //    whose slug shares no token with that segment, flag as a possible
    //    say-X-go-Y mismatch. Only for clearly card-like hrefs (/[a-z-]+/...).
    const hrefMatch = line.match(/\bhref=(["'`])(\/[a-z0-9][a-z0-9/-]+)\1/);
    if (hrefMatch) {
      const href = hrefMatch[2];
      const lastSeg = href.split("/").filter(Boolean).pop() || "";
      if (lastSeg.length >= 4 && !lastSeg.includes("${")) {
        // gather visible text from this + next 3 lines (JSX children)
        const window = lines.slice(i, i + 4).join(" ");
        const textMatch = window.match(/>\s*([A-Z][A-Za-z &'-]{3,40})\s*</);
        if (textMatch) {
          const labelSlug = slugifyText(textMatch[1]);
          const hrefToks = new Set(lastSeg.split("-"));
          const labelToks = labelSlug.split("-").filter((t) => t.length >= 3);
          const overlap = labelToks.some((t) => hrefToks.has(t));
          if (labelToks.length > 0 && !overlap) {
            hits.push({
              file: rel,
              line: i + 1,
              kind: "text-href-mismatch",
              detail: `text "${textMatch[1].trim()}" -> href "${href}"`,
            });
          }
        }
      }
    }
  }
}

const dead = hits.filter((h) => h.kind === "dead-link");
const mismatch = hits.filter((h) => h.kind === "text-href-mismatch");

console.log(`Scanned ${walk(SRC).length} tsx files.`);
console.log(`\nDead links (say something, go nowhere): ${dead.length}`);
for (const h of dead.slice(0, 40)) console.log(`  ${h.file}:${h.line}  ${h.detail}`);
console.log(`\nText/href mismatches (say X, send to Y) [HEURISTIC, review]: ${mismatch.length}`);
for (const h of mismatch.slice(0, 60)) console.log(`  ${h.file}:${h.line}  ${h.detail}`);

console.log(`\nNote: mismatches are heuristic. Many are false positives (icon-only`);
console.log(`links, generic CTAs like "Learn more"). Review, do not auto-fix.`);
