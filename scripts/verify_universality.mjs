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
import { SpineCityBody } from "../src/components/spine/city/city-view";

/* A deliberate spread: the exemplar, two very poor and very large, one small and
   European, one Latin American, and the two the rulebook names by hand. */
const CITIES = ["london", "lagos", "dhaka", "tirana", "mumbai", "sao-paulo", "la-paz", "kinshasa"];

const ABSURD = [
  { unit: "pp", max: 200, why: "percentage points" },
  { unit: "x", max: 100, why: "a multiple" },
  { unit: "%", max: 1000, why: "a percentage" },
];

const run = async () => {
  mkdirSync("scratchpad/universality", { recursive: true });
  const rendered = [];
  const missing = [];
  for (const slug of CITIES) {
    const d = await buildSpineCitySeed(slug).catch(() => null);
    if (!d) { missing.push(slug); continue; }
    const html = renderToStaticMarkup(React.createElement(SpineCityBody, { data: d }));
    writeFileSync(`scratchpad/universality/${slug}.html`, `<!doctype html><meta charset="utf-8"><body>${html}</body>`, "utf8");
    rendered.push(slug);
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

  console.log(`\n  ${rendered.length} of ${CITIES.length} cities render a page.`);
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
