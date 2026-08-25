#!/usr/bin/env node
/**
 * verify_universality , THE SAME COMPONENTS, RENDERED FOR CITIES THAT ARE NOT THE
 * EXEMPLAR.
 *
 * Rulebook v2 §21 requires every section to read correctly for Kinshasa, Dhaka,
 * Tirana and La Paz, not only for London. Nothing ran that test, and on
 * 2026-08-25 the first render that did produced "+4400" in the Lagos peer table
 * and "-100" for a city with no visitors. Both were arithmetically correct. The
 * form was wrong, and it only ever looked right on London because London's peers
 * happen to sit within a factor of two of it.
 *
 * WHAT THIS IS NOT. It is not work on a second vertical, which the current loop
 * forbids. It renders other cities to VALIDATE the London components and changes
 * nothing outside them. Measuring a thing is not building it.
 *
 * WHAT IT CHECKS. Figures whose magnitude is absurd for their unit. A
 * percentage-point difference past 200 is not a comparison a reader can hold; a
 * multiple past 100 is the same fault wearing a different unit; a percentage past
 * 1000 is arithmetic that escaped.
 *
 * BLIND SPOTS, both real:
 *   - It reads figures by their PRINTED unit, so a nonsense number carrying no
 *     unit passes. The units on these pages are pp, x and %.
 *   - A city that renders NO page cannot fail anything. La Paz and Kinshasa both
 *     returned nothing on 2026-08-25 and are counted separately for that reason,
 *     because a silent absence is not a pass.
 *
 * WHY IT IS NOT IN THE PREBUILD CHAIN. It builds real city seeds, and the adapter
 * constructs a database client at import time, so it needs the local environment.
 * The working method is explicit that the chain must never need a secret, because
 * a gate that can fail on a blip is a gate that gets switched off. So this runs on
 * demand and is named in the art direction's coverage list as such, rather than
 * being smuggled into the chain and quietly weakening it.
 *
 * Usage, from the website root, with the local environment loaded:
 *   set -a; . ./.env.local; set +a
 *   npx tsx --tsconfig scripts/tsconfig.harness.json  *     --require ./scripts/spikes/stub_next_font.cjs scripts/verify_universality.mjs
 */
import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { chromium } from "playwright";
import { writeFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../src/lib/spine/adapt_industry";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../src/components/spine/industry/industry-view";
import { SpineShell } from "../src/components/spine/shell";

/* A deliberate spread: the exemplar, two very poor and very large, one small and
   European, one Latin American, and the two the rulebook names by hand. */
const CITIES = ["london", "lagos", "dhaka", "tirana", "mumbai", "sao-paulo", "la-paz", "kinshasa"];

/* THE TRADE PAGE CARRIES THE SAME RISK AS THE CITY PAGE and for the same reason:
   its comparisons are built from figures that vary by orders of magnitude across
   the world. The neighbourhood page is NOT covered, and that is not an oversight:
   counted 2026-08-25, London is the only city in the repository that carries
   districts at all, so there is no second case to test it against. */
const CELLS = [
  ["gb", "london", "restaurants"],
  ["ng", "lagos", "restaurants"],
  ["bd", "dhaka", "restaurants"],
  ["in", "mumbai", "cafes-coffee-shops"],
  ["br", "sao-paulo", "grocery-stores"],
  ["al", "tirana", "restaurants"],
];

/* The across-places page is per-trade rather than per-city, and measured the same
   day it renders 2,261 to 3,122 characters for every trade tried, so it is the one
   page type that is already universal. Included anyway, cheaply, because a form
   can break on a trade as easily as on a city. */
const INDUSTRIES = ["restaurants", "cafes-coffee-shops", "grocery-stores", "hairdressers-beauty", "auto-repair-shops"];

const ABSURD = [
  { unit: "pp", max: 200, why: "percentage points" },
  { unit: "x", max: 100, why: "a multiple" },
  { unit: "%", max: 1000, why: "a percentage" },
];

/* THE RENDERS ARE FULL PAGES, SHELL AND STYLESHEET AND ALL.
   They used to be bare markup with no CSS, which was enough to read figures out
   of and useless for anything about LAYOUT. That meant every art-direction check
   ran against four London pages and nothing else, which is the same blindness
   that let a "$0" headline and an internal marker sit on four trade pages
   unseen. The stylesheet is generated here for the same reason it is generated in
   the preview builder: a snapshot goes stale and then lies quietly. */
const shellPage = (body) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">` +
  `<style>${CSS}</style><style>.spine-frame-layer[style*="_skyline"]{background-image:url("${SKY}") !important}</style>` +
  `</head><body>${body}</body></html>`;

let CSS = "";
let SKY = "";

const run = async () => {
  /* THE DIRECTORY IS EMPTIED FIRST. Files from an earlier shape of this check sat
     alongside the new ones and were read as if they were current: bare markup with
     no stylesheet, which every layout measurement then reported as broken. A stale
     artifact that looks like a fresh one is the same fault as a stale stylesheet,
     and this loop has now paid for it twice. */
  rmSync("scratchpad/universality", { recursive: true, force: true });
  mkdirSync("scratchpad/universality", { recursive: true });
  execFileSync(
    process.execPath,
    ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", "scratchpad/pages/site.css", "--minify"],
    { stdio: "pipe" },
  );
  CSS = readFileSync("scratchpad/pages/site.css", "utf8");
  SKY = `data:image/jpeg;base64,${readFileSync("public/spine/_skyline.jpeg").toString("base64")}`;
  const rendered = [];
  const missing = [];
  /* THE RICHNESS SPREAD IS REPORTED, NEVER FAILED. How much a page carries for a
     place other than the exemplar is a SOURCING fact, not a design one, and this
     check has no business failing a build over it. It is printed because whoever
     runs this is exactly the person who should know that the same design produces
     a third of a page outside London. */
  const richness = {};
  const markers = [];
  const write = (name, html, kind) => {
    writeFileSync(`scratchpad/universality/${name}.html`, shellPage(html), "utf8");
    rendered.push(name);
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    (richness[kind] ??= []).push([name, text.length]);

    /* AN INTERNAL MARKER MUST NEVER REACH A READER, and this is checked on the
       rendered STRING rather than in the browser. These sentences are authored in
       the data, not in code, so the gate that catches internal notes scans source
       and walks straight past them: the Mumbai cafes page printed "Estimated from
       regional patterns | scrub:revenue-cap-2026-05-31".

       A first version asked the browser for document.body.innerText and found
       nothing with the fault sitting in the markup, twice. Rather than keep
       chasing why, it reads the text it just built, which is the same text and
       cannot be wrong about it. */
    for (const m of text.matchAll(/(?:^|\s)([a-z][\w-]*:[\w.\-]{3,})(?=\s|$)/g)) {
      if (/^https?:/.test(m[1])) continue;
      markers.push(`${name}: an internal marker reaches a reader, "${m[1]}"`);
    }
  };
  for (const slug of CITIES) {
    const d = await buildSpineCitySeed(slug).catch(() => null);
    if (!d) { missing.push(`city ${slug}`); continue; }
    write(`city-${slug}`, renderToStaticMarkup(React.createElement(SpineShell, null, React.createElement(SpineCityBody, { data: d }))), "city");
  }
  for (const [c, g, t] of CELLS) {
    const d = await buildSpineCellSeed(c, g, t).catch(() => null);
    if (!d) { missing.push(`trade ${g}/${t}`); continue; }
    write(`trade-${g}-${t}`, renderToStaticMarkup(React.createElement(SpineShell, null, React.createElement(SpineCellBody, { data: d }))), "trade");
  }
  for (const i of INDUSTRIES) {
    const d = await buildSpineIndustrySeed(i).catch(() => null);
    if (!d) { missing.push(`across ${i}`); continue; }
    write(`across-${i}`, renderToStaticMarkup(React.createElement(SpineShell, null, React.createElement(SpineIndustryBody, { data: d }))), "across");
  }

  const b = await chromium.launch();
  const fails = [...markers];

  /* TABLET IS CHECKED TOO, because 768 is the width where two-up switches on and
     nothing had ever looked at it. The first look found a chart squeezed into a
     229px sliver on three of the four London pages. Cheap to hold: no horizontal
     scroll, and no card under 260px, which is the floor below which a chart stops
     being a chart. */
  for (const slug of rendered) {
    const p = await b.newPage({ viewport: { width: 768, height: 1200 } });
    await p.goto(`file:///E:/atlas/website/scratchpad/universality/${slug}.html`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(200);
    const t = await p.evaluate(() => {
      const cards = [...document.querySelectorAll("div")].filter(
        (e) => getComputedStyle(e).backdropFilter !== "none",
      );
      const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
      return {
        over: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        cramped: outer
          .filter((c) => c.getBoundingClientRect().width < 260)
          .map((c) => (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 34)),
      };
    });
    if (t.over) fails.push(`${slug}: the page scrolls sideways at 768px`);
    for (const c of t.cramped) fails.push(`${slug}: a card is under 260px at 768px, "${c}"`);
    await p.close();
  }
  for (const slug of rendered) {
    const p = await b.newPage({ viewport: { width: 1440, height: 1200 } });
    await p.goto(`file:///E:/atlas/website/scratchpad/universality/${slug}.html`);
    const hits = await p.evaluate((rules) => {
      const out = [];
      /* THE UNIT LIVES IN THE ROW LABEL, NOT IN THE CELL. A first version of this
         looked for "4400pp" in one text node and the page prints "+4400" in the
         cell with "(pp)" in the row header, so it caught nothing and passed with
         the fault present. Negative-testing is the only reason that was found. */
      for (const tr of document.querySelectorAll("tbody tr")) {
        const head = (tr.querySelector("th")?.textContent || "").trim();
        const um = head.match(/\((pp|x|%)\)/);
        if (!um) continue;
        const rule = rules.find((r) => r.unit === um[1]);
        if (!rule) continue;
        for (const td of tr.querySelectorAll("td")) {
          const txt = (td.textContent || "").trim();
          const m = txt.match(/^[+-]?([\d,.]+)\s*(pp|x|%)?$/);
          if (!m) continue;
          const v = Math.abs(parseFloat(m[1].replace(/,/g, "")));
          if (v > rule.max) out.push(`"${head}" cell reads "${txt}", ${rule.why} past ${rule.max}`);
        }
      }
      /* And any figure that carries its unit in its own text, wherever it sits. */
      for (const e of document.querySelectorAll("*")) {
        const own = [...e.childNodes]
          .filter((x) => x.nodeType === 3 && x.textContent.trim())
          .map((x) => x.textContent.trim())
          .join(" ");
        if (!own) continue;
        for (const r of rules) {
          const m = own.match(new RegExp(`^[+-]?([\d,.]+)\s*${r.unit}$`));
          if (!m) continue;
          const v = Math.abs(parseFloat(m[1].replace(/,/g, "")));
          if (v > r.max) out.push(`"${own}" is ${r.why} past ${r.max}`);
        }
      }
      /* THE LAYOUT RULES, ACROSS EVERY PAGE RATHER THAN FOUR.
         The art-direction gate reads the four London pages and nothing else, which
         is the same blindness that let an asserted zero and an internal marker sit
         on four trade pages unseen. Two of its rules travel cheaply and are worth
         running everywhere: nothing but a chrome band may take the full column
         (D1), and a card may not cover less than 60% of its own content box (E2).
         Both found something the first time they ran here: a Sao Paulo trade page
         whose partner card does not render took the whole column. */
      {
        const cards = [...document.querySelectorAll("div")].filter(
          (e) => getComputedStyle(e).backdropFilter !== "none",
        );
        const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
        for (const c of outer) {
          const cb = c.getBoundingClientRect();
          if (cb.width > 1000 && !c.closest("[data-hero='1']")) {
            out.push(`a section takes the full column and is not a chrome band: "${(c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 36)}"`);
          }
          const cs = getComputedStyle(c);
          const inner = Math.max(1, cb.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom));
          let top = cb.bottom, bot = cb.top;
          for (const e of c.querySelectorAll("*")) {
            const st = getComputedStyle(e);
            const bb = e.getBoundingClientRect();
            const drawn =
              [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) ||
              e.tagName === "svg" ||
              st.backgroundColor !== "rgba(0, 0, 0, 0)";
            if (drawn && bb.height > 2) { top = Math.min(top, bb.top); bot = Math.max(bot, bb.bottom); }
          }
          if (Math.max(0, bot - top) / inner < 0.6) {
            out.push(`a card covers under 60% of its own box: "${(c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 36)}"`);
          }
        }
      }

      /* A DISPLAY FIGURE OF ZERO IS A MISSING MEASUREMENT ASSERTED AS A MEASURED
         NIL. Found on the same page: "$0 a year, after every cost is paid" in the
         largest type on it. Only display sizes are checked, because a zero inside
         a table or a scale can be a real reading. */
      for (const e of document.querySelectorAll("*")) {
        const own = [...e.childNodes]
          .filter((x) => x.nodeType === 3 && x.textContent.trim())
          .map((x) => x.textContent.trim())
          .join(" ");
        if (!/^[$£€]?0[a-zA-Z%]{0,2}$/.test(own)) continue;
        if (parseFloat(getComputedStyle(e).fontSize) < 28) continue;
        out.push(`a display figure reads "${own}", which asserts a measured nil`);
      }

      return [...new Set(out)];
    }, ABSURD);
    for (const h of hits) fails.push(`${slug}: ${h}`);
    await p.close();
  }
  await b.close();

  console.log(`
  ${rendered.length} pages rendered: ${CITIES.length} cities, ${CELLS.length} trades, ${INDUSTRIES.length} trade-across-places.`);
  for (const [kind, list] of Object.entries(richness)) {
    const sorted = [...list].sort((a, b) => b[1] - a[1]);
    const top = sorted[0], bottom = sorted[sorted.length - 1];
    const ratio = bottom[1] > 0 ? (top[1] / bottom[1]).toFixed(1) : "n/a";
    console.log(`  ${kind.padEnd(7)} richest ${top[0]} at ${top[1]} chars, thinnest ${bottom[0]} at ${bottom[1]}, a spread of ${ratio}x`);
  }
  if (missing.length) console.log(`  NO PAGE AT ALL: ${missing.join(", ")}  (a sourcing gap, not a failure of this check)`);
  if (fails.length) {
    console.log(`\nx verify_universality: ${fails.length} thing(s) a reader should never meet.\n`);
    fails.forEach((f) => console.log("     " + f));
    console.log("\n  A form that only reads correctly for the exemplar is the wrong form.\n");
    process.exit(1);
  }
  console.log("\nPASS verify_universality , no absurd magnitude, no asserted zero, no internal marker, no section taking the column, nothing cramped at tablet.\n");
};
void run();
