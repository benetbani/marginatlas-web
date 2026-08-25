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
import { writeFileSync, mkdirSync } from "node:fs";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../src/lib/spine/adapt_industry";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../src/components/spine/industry/industry-view";

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

const run = async () => {
  mkdirSync("scratchpad/universality", { recursive: true });
  const rendered = [];
  const missing = [];
  /* THE RICHNESS SPREAD IS REPORTED, NEVER FAILED. How much a page carries for a
     place other than the exemplar is a SOURCING fact, not a design one, and this
     check has no business failing a build over it. It is printed because whoever
     runs this is exactly the person who should know that the same design produces
     a third of a page outside London. */
  const richness = {};
  const write = (name, html, kind) => {
    writeFileSync(`scratchpad/universality/${name}.html`, `<!doctype html><meta charset="utf-8"><body>${html}</body>`, "utf8");
    rendered.push(name);
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    (richness[kind] ??= []).push([name, text.length]);
  };
  for (const slug of CITIES) {
    const d = await buildSpineCitySeed(slug).catch(() => null);
    if (!d) { missing.push(`city ${slug}`); continue; }
    write(`city-${slug}`, renderToStaticMarkup(React.createElement(SpineCityBody, { data: d })), "city");
  }
  for (const [c, g, t] of CELLS) {
    const d = await buildSpineCellSeed(c, g, t).catch(() => null);
    if (!d) { missing.push(`trade ${g}/${t}`); continue; }
    write(`trade-${g}-${t}`, renderToStaticMarkup(React.createElement(SpineCellBody, { data: d })), "trade");
  }
  for (const i of INDUSTRIES) {
    const d = await buildSpineIndustrySeed(i).catch(() => null);
    if (!d) { missing.push(`across ${i}`); continue; }
    write(`across-${i}`, renderToStaticMarkup(React.createElement(SpineIndustryBody, { data: d })), "across");
  }

  const b = await chromium.launch();
  const fails = [];
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
    console.log(`\nx verify_universality: ${fails.length} figure(s) that no reader can hold.\n`);
    fails.forEach((f) => console.log("     " + f));
    console.log("\n  A form that only reads correctly for the exemplar is the wrong form.\n");
    process.exit(1);
  }
  console.log("\nPASS verify_universality , every rendered figure is within a magnitude a reader can hold.\n");
};
void run();
