/**
 * scripts/spikes/probe_rendered_cell_strings.mjs
 *
 * The reader-facing strings the affected trade routes render, straight from
 * loadCellView (the one call chain both the legacy page and the spine page
 * run; the components are thin renderers over this view, per cell_view.ts's
 * own contract). Used as rendered-output verification for the 2026-08-29
 * take-home fix where a dev server cannot run (the box holds 1GB free and a
 * Next dev server OOMs at startup).
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_rendered_cell_strings.mjs
 */
import { loadCellView } from "@/lib/spine/adapt_cell";

const SUBJECTS = [
  ["gb", "united-kingdom", "sports-fitness"],
  ["gb", "united-kingdom", "grocery-stores"],
  ["gb", "united-kingdom", "auto-repair-shops"],
  ["td", "chad", "sports-fitness"],
  ["al", "albania", "sports-fitness"],
];

// The wrong figures that were live: any of these appearing in a rendered
// string is a FAIL.
const FORBIDDEN = ["$513K", "$324K", "$293K", "$231K", "$234K", "$2.5M", "$3.1M", "$1.7M", "$1.1M"];

let fails = 0;

for (const [country, geo, industry] of SUBJECTS) {
  const loaded = await loadCellView(country, geo, industry);
  console.log(`\n=============== /${country}/${geo}/${industry} ===============`);
  if (!loaded) {
    console.log("  (route resolves no cell)");
    continue;
  }
  const v = loaded.cellView;
  const strings = [
    ["masthead.title", v.masthead.title],
    ["masthead.answer", v.masthead.answer],
    ...v.masthead.stats.map((s) => [`stat: ${s.label}`, s.value]),
    ["narrative", v.narrative],
    [
      "ownerKeeps",
      v.ownerKeeps
        ? `takeHome=$${Math.round(v.ownerKeeps.takeHome ?? 0).toLocaleString("en-US")} margin=${v.ownerKeeps.marginPct}%`
        : "(self-omitted)",
    ],
    ["masthead.anchor", v.masthead.anchor ? `${v.masthead.anchor.label}: $${v.masthead.anchor.value.toLocaleString("en-US")}` : "(self-omitted)"],
  ];
  for (const [label, value] of strings) {
    const text = value == null ? "(null)" : String(value);
    const hit = FORBIDDEN.find((f) => text.includes(f));
    if (hit) {
      fails += 1;
      console.log(`  FAIL ${label}: contains forbidden ${hit}: ${text}`);
    } else {
      console.log(`  ok   ${String(label).padEnd(22)} ${text}`);
    }
  }
}

console.log(fails === 0 ? "\nRENDERED STRINGS CLEAN: none of the wrong figures appear." : `\n${fails} FORBIDDEN figure(s) still render.`);
process.exit(fails === 0 ? 0 : 1);
