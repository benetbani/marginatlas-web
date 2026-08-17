/**
 * scripts/spikes/count_country_surfaces.ts , a measurement, not a gate.
 *
 * Counts surface idioms in the country route tree and the engraved kit, with
 * comments stripped via scripts/lib/strip_comments, because a naive grep in
 * this repo counts a sweep's own explanatory prose as both conversions and
 * defects. Charter section 12 records that exact mistake.
 *
 * BLIND SPOT, stated before the numbers are quoted: this reads source text. It
 * cannot distinguish a class a component MENTIONS from a pixel a reader SEES,
 * and it cannot tell which of two overlapping grounds wins at paint time. For
 * "which idiom is written down" it is exact. For "what the page looks like" the
 * instrument is a render.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { newCommentState, stripComments } from "../lib/strip_comments";

const ROOTS = ["src/app/[country]", "src/components/kit/engraved"];

type Hit = { file: string; line: number; text: string; kind: string };

const PATTERNS: { kind: string; re: RegExp }[] = [
  { kind: "atlas-card", re: /\batlas-card\b/ },
  { kind: "atlas-wash", re: /\batlas-wash\b/ },
  { kind: "bg-cream", re: /\bbg-cream-\d+/ },
  { kind: "bg-white", re: /\bbg-white\b/ },
  { kind: "rounded+border+bg", re: /rounded-(?:lg|xl|2xl|md)[^"'`]*\bborder\b[^"'`]*\bbg-(?:white|cream-\d+)\b/ },
  { kind: "h2-scale", re: /<h2[^>]*className=/ },
  { kind: "text-xl-md-2xl", re: /text-xl[^"'`]*md:text-2xl/ },
  { kind: "font-display", re: /\bfont-display\b/ },
  { kind: "rounded-full", re: /\brounded-full\b/ },
];

function walk(dir: string, out: string[]) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e)) out.push(p);
  }
}

const files: string[] = [];
for (const r of ROOTS) walk(r, files);

const hits: Hit[] = [];
for (const f of files) {
  const st = newCommentState();
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((raw, i) => {
    const code = stripComments(raw, st);
    if (!code.trim()) return;
    for (const { kind, re } of PATTERNS) {
      if (re.test(code)) hits.push({ file: relative(process.cwd(), f), line: i + 1, text: code.trim().slice(0, 160), kind });
    }
  });
}

const byKind = new Map<string, Hit[]>();
for (const h of hits) {
  if (!byKind.has(h.kind)) byKind.set(h.kind, []);
  byKind.get(h.kind)!.push(h);
}

const want = process.argv[2];
for (const [kind, list] of [...byKind].sort()) {
  if (want && kind !== want) continue;
  console.log(`\n### ${kind}: ${list.length}`);
  if (want || list.length <= 40) {
    for (const h of list) console.log(`  ${h.file}:${h.line}  ${h.text}`);
  }
}
console.log(`\nfiles scanned: ${files.length}`);
