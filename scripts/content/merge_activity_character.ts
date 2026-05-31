/**
 * merge_activity_character.ts — merge all data/content/char_batch_*.json into
 * src/lib/content/activity_character_generated.json, validated.
 *
 * Drops any entry that: is missing a required field, contains an em/en dash,
 * or whose id is not a real taxonomy id. Reports counts to a file (stdout is
 * unreliable in this environment). Run: npx tsx scripts/content/merge_activity_character.ts
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRY_BY_ID } from "../../src/lib/taxonomy";

type Entry = {
  id: string; hook: string; economics: string; watchOut: string; edge: string;
  categoryNote?: string;
};
const REQ: Array<keyof Entry> = ["id", "hook", "economics", "watchOut", "edge"];
const dir = resolve(process.cwd(), "data/content");
const files = readdirSync(dir).filter((f) => /^char_batch_\d+\.json$/.test(f));

const merged: Record<string, Entry> = {};
const dropped: string[] = [];
let seen = 0;
for (const f of files) {
  const obj = JSON.parse(readFileSync(resolve(dir, f), "utf-8")) as Record<string, Entry>;
  for (const [id, e] of Object.entries(obj)) {
    seen++;
    const missing = REQ.some((k) => !e[k] || String(e[k]).trim() === "");
    const blob = [e.hook, e.economics, e.watchOut, e.edge, e.categoryNote ?? ""].join(" ");
    const hasDash = blob.includes("—") || blob.includes("–");
    const realId = !!INDUSTRY_BY_ID[id];
    if (missing || hasDash || !realId) {
      dropped.push(`${id}: ${missing ? "missing-field " : ""}${hasDash ? "dash " : ""}${!realId ? "not-in-taxonomy" : ""}`.trim());
      continue;
    }
    merged[id] = {
      id, hook: e.hook, economics: e.economics, watchOut: e.watchOut, edge: e.edge,
      ...(e.categoryNote ? { categoryNote: e.categoryNote } : {}),
    };
  }
}

const out = resolve(process.cwd(), "src/lib/content/activity_character_generated.json");
writeFileSync(out, JSON.stringify(merged, null, 2) + "\n");

const report =
  `files=${files.length} seen=${seen} merged=${Object.keys(merged).length} ` +
  `dropped=${dropped.length}\n` + dropped.slice(0, 40).map((d) => "  - " + d).join("\n") + "\n";
writeFileSync(resolve(dir, "_merge_report.txt"), report);
