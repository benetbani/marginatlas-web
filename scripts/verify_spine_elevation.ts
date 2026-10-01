#!/usr/bin/env npx tsx
/**
 * verify_spine_elevation , the spine's shadows come from the elevation scale only.
 *
 * WHY (2026-10-01, the goal of that day, T1): the three critics the founder sent on
 * 2026-09-27 agree that a shadow is a token, not a default ("these Figma defaults
 * are way too harsh... I change the entire shadow colour"), and the live pages
 * measured two shadow colours on one page: the cards on the warm ink pair of the
 * elevation scale (src/lib/design-tokens.ts, `elevation`), and the readout panel,
 * the switch, the loan years and the world-range dot on Tailwind's stock
 * `shadow-md` and `shadow-sm`, which are black. The scale's own rule says what a
 * popover takes (`lift`) and what a resting mark takes (`subtle`); four call sites
 * had simply never been told.
 *
 * WHAT IT CHECKS: in src/components/spine, any Tailwind shadow utility that is not
 * one of the scale's names (`shadow-subtle`, `shadow-card`, `shadow-lift`,
 * `shadow-modal`), `shadow-none`, or an arbitrary value reading a variable. The
 * stock names (`shadow`, `shadow-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-inner`) red.
 * Comments are stripped with scripts/lib/strip_comments.
 *
 * BLIND SPOTS: a shadow written as an inline style or a CSS string (SpineMap's
 * marker styles are such strings, warm already) is not read; a class composed at
 * runtime is not read, and Tailwind would not emit it either.
 *
 * Not a ratchet: zero on the day it was written, and zero is the allowance.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { red, redSummary } from "./lib/red";
import { newCommentState, stripComments } from "./lib/strip_comments";

const ROOT = "src/components/spine";
const STOCK = /(?<![\w-])shadow(?:-(?:sm|md|lg|xl|2xl|inner))?(?![\w\[-])/g;

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry).replace(/\\/g, "/");
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(p)) acc.push(p);
  }
  return acc;
}

const files = walk(ROOT);
if (files.length === 0) {
  console.error(`[spine-elevation] no source under ${ROOT}. Refusing to pass vacuously.`);
  process.exit(1);
}
const hits: { file: string; line: number; cls: string }[] = [];
for (const file of files) {
  const state = newCommentState();
  readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .map((l) => stripComments(l, state))
    .forEach((line, i) => {
      for (const m of line.matchAll(STOCK)) hits.push({ file, line: i + 1, cls: m[0] });
    });
}
if (hits.length > 0) {
  /* Every red names its file, its line, its rule and its remedy (scripts/lib/red, plan step 16). */
  const remedy = "replace it with the elevation scale: shadow-lift on a popover or panel, shadow-subtle on a resting mark, shadow-card on a card";
  for (const h of hits) red({ rule: "spine-elevation", file: h.file, line: h.line, detail: `${h.cls}, a stock Tailwind shadow, black where the spine's are warm`, remedy });
  redSummary("spine-elevation", `${hits.length} stock shadow${hits.length === 1 ? "" : "s"}`, remedy);
  process.exit(1);
}
console.log(`[spine-elevation] PASS: every shadow in ${files.length} spine files is on the elevation scale.`);
