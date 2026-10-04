/**
 * No world median on a world track (plan 06, task B2; MODEL.md PART 9 clause 46: a fill value or an interpolation is not a
 * statistic). The world's median was taken over a profile where 146 of 197 countries are interpolated and 52 hold one fill value
 * (electricity's 0.13), so the tick and its "World median" words printed a figure the world never measured. The track keeps its
 * two ends, the shaded middle and the countries' hairlines.
 *
 * The check renders the real component to markup with a median no other part of the row carries (777), so a median printed
 * anywhere, in a word, a mark or the drawing's label, is found.
 *
 * Run: npx tsx tests/spine/world_range_no_median.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { WorldRangeRows, type WorldRangeRow } from "../../src/components/spine/charts/WorldRange";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "world-range-no-median";
const FILE = "src/components/spine/charts/WorldRange.tsx";
const REMEDY = "draw the world's ends, the shaded middle and the hairlines only: no median tick, word or label on a world track";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const fmt = (v: number) => `$${Math.round(v)}`;
const row: WorldRangeRow = {
  key: "electricity",
  label: "Business electricity",
  display: "$300",
  value: 300,
  range: { min: 100, p25: 200, median: 777, p75: 800, max: 900, count: 197 },
  fmt,
  hairlines: [100, 150, 200, 777, 800, 900],
};

for (const headless of [false, true]) {
  const html = renderToStaticMarkup(React.createElement(WorldRangeRows, { rows: [row], headless, ends: { lowest: "Lowest", highest: "Highest" } }));
  const form = headless ? "headless" : "with its head";
  check(`${form}: no median word`, !/median/i.test(html));
  check(`${form}: no median mark`, !/data-track-median|data-mark="median"/.test(html));
  check(`${form}: the median's figure printed nowhere ($777)`, !html.includes("$777"));
  check(`${form}: the drawing's label names the world's ends only`, html.includes("the world from $100 to $900"));
  check(`${form}: the two ends stay`, /data-end="low"[^>]*>\$100</.test(html) && /data-end="high"[^>]*>\$900</.test(html));
  check(`${form}: the shaded middle stays`, html.includes("data-track-band"));
  check(`${form}: the countries' hairlines stay`, html.includes('data-track-hairlines="6"'));
}

/* No caller can ask for the median back: the prop is gone from the component and from the country page's three tracks. */
const src = (p: string) => readFileSync(p, "utf8");
check("the component takes no median word", !/medianWord/.test(src(FILE)));
check("the country page passes no median word", !/medianWord/.test(src("src/components/spine/country/country-view.tsx")));
check("the copy holds no world median words", !/World median|Median city/.test(src("src/lib/spine/copy.ts")));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/world_range_no_median: all pass");
