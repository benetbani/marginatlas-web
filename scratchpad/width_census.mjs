/**
 * Every width cap this site declares, comments stripped, split reader-facing
 * from workshop.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, sep } from "node:path";

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if ([".ts", ".tsx", ".css"].includes(extname(p))) files.push(p);
  }
})("src");

/* Crude but sufficient comment strip: whole-line // and /* blocks. The gate
   will use the shared lexer; this is a census. */
function strip(src) {
  let out = [], inBlock = false;
  for (const line of src.split("\n")) {
    let l = line;
    if (inBlock) { const i = l.indexOf("*/"); if (i === -1) { out.push(""); continue; } l = l.slice(i + 2); inBlock = false; }
    const t = l.trim();
    if (t.startsWith("//") || t.startsWith("*")) { out.push(""); continue; }
    const b = l.indexOf("/*");
    if (b !== -1) { const e2 = l.indexOf("*/", b); if (e2 === -1) { inBlock = true; l = l.slice(0, b); } else l = l.slice(0, b) + l.slice(e2 + 2); }
    out.push(l);
  }
  return out.join("\n");
}

const TW_PX = { "max-w-xs": 320, "max-w-sm": 384, "max-w-md": 448, "max-w-lg": 512,
  "max-w-xl": 576, "max-w-2xl": 672, "max-w-3xl": 768, "max-w-4xl": 896,
  "max-w-5xl": 1024, "max-w-6xl": 1152, "max-w-7xl": 1280, "max-w-prose": 448 };

const caps = new Map();
const chCaps = new Map();
const tiers = new Map();
const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);

for (const p of files) {
  const rel = p.split(sep).join("/");
  const src = strip(readFileSync(p, "utf8"));
  const reader = !rel.startsWith("src/app/dev/") && !rel.includes("/_design/");
  if (!reader) continue;
  for (const [cls] of Object.entries(TW_PX)) {
    const re = new RegExp(`(?:^|[\\s"'\`:])${cls}(?![\\w-])`, "g");
    for (const _ of src.matchAll(re)) bump(caps, cls);
  }
  for (const m of src.matchAll(/max-w-\[(\d+)ch\]/g)) bump(chCaps, `${m[1]}ch`);
  for (const m of src.matchAll(/max-w-content/g)) bump(caps, "max-w-content");
  for (const t of ["Full", "Even", "WideRail", "Triptych", "Narrow"]) {
    for (const _ of src.matchAll(new RegExp(`<${t}(?![\\w])`, "g"))) bump(tiers, t);
  }
}

const show = (title, m) => {
  console.log(`\n${title}`);
  [...m.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
};
show("PROSE / CONTAINER CAPS (reader-facing, comments stripped)", caps);
show("CHARACTER-BASED CAPS", chCaps);
show("WIDTH TIERS", tiers);

const totalCh = [...chCaps.values()].reduce((a, b) => a + b, 0);
console.log(`\n  ${caps.size + chCaps.size} competing width conventions; ${totalCh} use a real reading measure`);
