#!/usr/bin/env npx tsx
/**
 * verify_token_steps_exist , a colour class that resolves to nothing.
 *
 * WHY THIS EXISTS NOW AND NOT BEFORE. Until 2026-08-17 `tailwind.config.ts`
 * used `theme.extend.colors`, so Tailwind's own twenty-two families sat
 * underneath the project's and almost any colour class resolved to SOMETHING.
 * The palette is now REPLACED rather than extended, which was the right fix and
 * which sharpens this failure mode considerably:
 *
 *     a class naming a ramp step that does not exist emits NO RULE AT ALL.
 *
 * No build error. No tsc complaint. No visual gap either, because the element
 * simply inherits whatever its parent had. It looks fine and it is wrong.
 *
 * FOUND BY MEASUREMENT, NOT THEORY. On the day this was written, `cocoa` held
 * steps 50/100/300/500/700/900 and the repo referenced `cocoa-400` eighteen
 * times and `cocoa-200` once. All nineteen emitted nothing. Sixteen of them
 * were `text-cocoa-400` on MISSING-DATA markers, the em-dash placeholders and
 * `fmtUSD(null)` cells, so the one thing on the page whose whole job is to look
 * absent was rendering in ordinary body colour.
 *
 * That is the shape of this bug in general: it removes a distinction rather
 * than breaking a layout, so it survives every visual review that is not
 * looking for it, and it lands hardest on quiet states.
 *
 * IT IS ALSO THE PREDICTABLE RESIDUE OF DELETING RAMPS. Four ramps were removed
 * this session (moss, amber, teal, and two paper steps collapsed onto `white`
 * and `parchment`). Every deletion checked its own call sites, but a step that
 * was ALREADY missing before the deletion had nothing to check it. This gate
 * closes that permanently.
 *
 * WHAT IT CHECKS: for every colour ramp the Tailwind config actually publishes,
 * any `<family>-<ramp>-<step>` class in src whose step is not a key of that
 * ramp. It deliberately does NOT try to validate unknown ramp names: telling a
 * colour class from `border-2` or `text-lg` by pattern alone is guesswork, and
 * a gate that guesses gets switched off. Known ramps, exact steps, no
 * inference.
 *
 * BLIND SPOTS, stated so the number is not over-trusted:
 *   - Class strings built at runtime (`text-${ramp}-${n}`) are invisible here,
 *     and Tailwind cannot see them either, so they are broken for a different
 *     reason this gate is not the right place to catch.
 *   - It reads source, so it counts a class a component MENTIONS, not a pixel a
 *     reader sees. A dead class behind an off flag counts here and paints
 *     nothing either way.
 *   - It says a class resolves; it cannot say the value is the RIGHT one.
 *
 * Not a ratchet. There is no legitimate reason to reference a step that does
 * not exist, so the allowed count is zero and stays zero.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";
import { tailwindColors } from "../src/lib/design-tokens";

const ROOTS = ["src"];
const SELF = "scripts/verify_token_steps_exist.ts";

/** Every Tailwind utility family that takes a colour. */
const FAMILIES = [
  "bg", "text", "border", "fill", "stroke", "from", "via", "to", "ring",
  "ring-offset", "divide", "outline", "shadow", "decoration", "accent",
  "caret", "placeholder",
].join("|");

/** Ramps published to Tailwind that are objects with steps, not flat values. */
const RAMPS: Record<string, Set<string>> = {};
for (const [name, value] of Object.entries(tailwindColors as Record<string, unknown>)) {
  if (value && typeof value === "object") {
    RAMPS[name] = new Set(Object.keys(value as Record<string, unknown>));
  }
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry).replace(/\\/g, "/");
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx?|css)$/.test(p)) acc.push(p);
  }
  return acc;
}

const names = Object.keys(RAMPS);
if (names.length === 0) {
  console.error("[token-steps] no colour ramps found in tailwindColors. Refusing to pass vacuously.");
  process.exit(1);
}
const CLASS_RE = new RegExp(`\\b(?:${FAMILIES})-(${names.join("|")})-([a-z0-9]+)\\b`, "g");

const dead: string[] = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (file.endsWith(SELF)) continue;
    const state = newCommentState();
    const code = readFileSync(file, "utf-8")
      .split(/\r?\n/)
      .map((l) => stripComments(l, state));
    code.forEach((line, i) => {
      CLASS_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = CLASS_RE.exec(line))) {
        const [cls, ramp, step] = m;
        if (!RAMPS[ramp].has(step)) dead.push(`${file}:${i + 1}  ${cls}  (${ramp} has no step ${step})`);
      }
    });
  }
}

if (dead.length > 0) {
  console.error(`[token-steps] FAIL: ${dead.length} colour class(es) resolve to nothing:\n`);
  for (const d of dead) console.error(`  ${d}`);
  console.error(
    `\n  These emit NO CSS. The element inherits its parent's colour, so the` +
      `\n  page looks plausible and the distinction the class existed to make is` +
      `\n  gone. Since tailwind.config.ts replaces the default palette rather` +
      `\n  than extending it, there is no stock ramp underneath to catch them.` +
      `\n\n  Move each to a step the ramp actually publishes. Do NOT add a step to` +
      `\n  the ramp to satisfy a call site: that is a colour decision arrived at` +
      `\n  by typo.`,
  );
  process.exit(1);
}

const stepCount = Object.values(RAMPS).reduce((a, s) => a + s.size, 0);
console.log(
  `[token-steps] PASS: every colour class resolves ` +
    `(${names.length} ramps, ${stepCount} steps).`,
);
