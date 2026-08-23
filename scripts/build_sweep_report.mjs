/**
 * build_sweep_report , one sheet carrying all six sweep results.
 *
 *   node scripts/build_sweep_report.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/sweeps/SWEEP-REPORT-2026-08-23.html";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const read = (n) => esc(readFileSync(`scratchpad/sweeps/${n}.txt`, "utf8").replace(/^\s*\n/, ""));

const SECTIONS = [
  [
    "1. Sections that reach no reader",
    "dead_sections",
    `<b>23 of the 48 sections in the site reach none of the fifteen real pages I rendered.</b>
     Just under half. A card whose figures are dropped before the page is built omits
     itself, which is correct behaviour; the point is how many do it. Eleven of these had
     been found one at a time, an iteration each. This found the rest in one run, including
     six that are open items on my list and six that were never on it at all.`,
  ],
  [
    "2. Chapter headings that open onto nothing",
    "empty_chapters",
    `Four, all of them the closing chapter of a city page. <b>The useful part is the
     negative:</b> the trade pages, the trade-across-places pages and the neighbourhood page
     have none at all, so this fault lives in exactly one place. Seven more chapters are
     thin rather than empty, all the same one, and they are listed separately so the two are
     never confused.`,
  ],
  [
    "3. The same figure printed twice on one page",
    "repeated_figures",
    `<b>The pay ladder is printed twice, back to back, on every trade page.</b> A note in that
     card defends the repeat by saying that removing it would take a figure off the page.
     Measured: the bundled sample carries five pay roles, so on the sample that defence
     holds. Every real page carries exactly three, so the two blocks are identical and
     removing the top one takes nothing away. Everything else on this list is innocent and
     is marked as such.`,
  ],
  [
    "4. The same claim disagreeing between two pages",
    "cross_page_figures",
    `<b>Nothing, and the reason is the result.</b> Of fifteen pages, only two places are
     described by more than one page. Zero claims disagree, zero agree, and eight could not
     be compared because only one page prints them. <b>The pages cannot contradict each other
     because they never make the same claim twice.</b> Kept as an early warning for when more
     sections start reaching readers.`,
  ],
  [
    "5. Marks that can fall outside their box",
    "scale_ends",
    `Fifteen files, around twenty-six places. This is the fault I have now fixed on four
     separate scales by hand: a dot or a label centred on its own value at the very end of a
     scale, with half of it hanging outside the card. <b>These are candidates, not verdicts</b>
     , a scale whose numbers never reach an end is safe without protection.`,
  ],
  [
    "6. Drawings that stretch their own geometry",
    "scaling_svg",
    `<b>Zero, and that one is finished.</b> Of 71 fixed-size drawings, 51 are icons that are
     meant to scale, one is a full-bleed cover, and not one stretches a measurement. Three
     charts were rebuilt during this work for exactly this fault and there are none left.`,
  ],
];

const html = `<!doctype html>
<meta charset="utf-8">
<title>Six sweeps across the whole site</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:32px 18px 64px;background:#fafaf9;color:#1b1b1a;
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:23px;font-weight:500;letter-spacing:-.01em;margin:0 0 10px}
  h2{font-size:16px;font-weight:500;margin:36px 0 6px}
  p{color:#57575b;margin:0 0 10px;max-width:72ch}
  pre{background:#fff;border:1px solid #e7e2df;border-radius:10px;padding:12px 14px;
      overflow-x:auto;font-size:11.5px;line-height:1.5;
      font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#3a3a38}
  .headline{background:#fff;border:1px solid #e7e2df;border-radius:12px;padding:14px 16px;margin:14px 0 6px}
  .headline p{margin:0 0 6px}
  .headline p:last-child{margin:0}
  b{color:#1b1b1a}
  footer{margin-top:44px;font-size:12px;color:#8c8c8a;max-width:72ch}
</style>
<h1>Six sweeps across the whole site</h1>

<p><b>These look for the faults that reading one section at a time cannot see.</b>
That pass reads a single surface per turn, on purpose, so anything that only shows
up across a whole page, or between two pages, has been found by accident until
now. Four such faults were one glance away from shipping.</p>

<div class="headline">
<p><b>The two findings worth your time are the first and the third.</b></p>
<p><b>Just under half the sections on the site reach nobody</b> , 23 of 48. Not
broken: they correctly hide themselves because the numbers behind them were never
sourced. But it means a reader gets a much thinner page than the design describes,
and it tells me six of the sections still on my list need no work at all.</p>
<p><b>The pay ladder is printed twice, one block directly above the other, on every
trade page.</b> The note in that card says removing the repeat would cost a figure.
That was true of the bundled sample, which has five pay roles. Every real page has
three, so the two blocks are word for word identical.</p>
</div>

<p><b>Every list below is candidates, not verdicts</b>, and each sweep states in its
own words what it cannot tell apart. Four carry a calibration: they are pointed at
a fault already confirmed by hand, and if they miss it their zeroes mean nothing.
<b>Every one of the six needed its first result thrown away</b> , the first draft of
a sweep is always too forgiving, and one of them reported a reassuring "one file"
where the honest answer was fifteen.</p>

${SECTIONS.map(([title, file, blurb]) => `<h2>${title}</h2>\n<p>${blurb}</p>\n<pre>${read(file)}</pre>`).join("\n")}

<footer>Nothing on this sheet is published anywhere. Every figure in it was
produced by rendering the real pages through the real data modules: eight cities
across four continents, three trade pages, three trade-across-places pages and one
neighbourhood page. A fault that only appears on one unusual city would be missed,
and each sweep says so in its own output.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
