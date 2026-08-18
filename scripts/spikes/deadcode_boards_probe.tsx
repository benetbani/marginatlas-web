/**
 * scripts/spikes/deadcode_boards_probe.tsx
 *
 * Deadness proof for buildActivityBoard / buildCityBoard / buildCountryBoard.
 *
 * WHAT THIS MEASURES, and why it is not the obvious thing. The three functions
 * under test have zero callers, so no render can possibly change when they are
 * deleted, and a before/after diff of a page that never called them proves
 * nothing on its own. The real risk of this deletion is COLLATERAL: each dead
 * function lives inside a module whose OTHER exports are live, and cutting it
 * means also cutting imports, helper functions and interfaces that the live
 * exports might share. So this harness exercises the LIVE SIBLINGS of each
 * deleted function, dumps the raw markup of the three routes those siblings
 * feed, and the proof is a byte-identical diff across the deletion.
 *
 *   activity_board  live siblings: getActivitySurvivalArchetype,
 *                   summarizeActivityPlaces  -> /industries/[industry]
 *   city_board      live siblings: buildCityScore, buildCityActivities
 *                   -> /cities/[slug]
 *   country_board   live siblings: ownerTakeHomeForCell, breakInForCell,
 *                   buildEasiestToBreakIn    -> /[country]
 *
 * BLIND SPOT, stated per the working method. This is an SSR pass only, so
 * anything that appears on hydration is invisible to it. It cannot distinguish
 * "the band rendered identically" from "the band self-omitted identically on
 * both runs": the charter records that the data bands self-omit locally when
 * cell lookups exceed the 4s budget from this machine to eu-west-1, so a
 * self-omitted band contributes an identical empty string before and after and
 * is NOT evidence that its figures are unchanged. Byte counts are printed per
 * route so a route that rendered empty is visible as such rather than passing
 * quietly as a match.
 */
import { Writable } from "node:stream";
import { mkdirSync, writeFileSync } from "node:fs";

import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";

// The repo's tsconfig uses the classic JSX runtime for these scripts, so the
// page modules compile to React.createElement and need React in global scope.
(globalThis as unknown as { React: typeof React }).React = React;

/** Render a tree to one HTML string, waiting for every async server component. */
function renderAll(el: React.ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
    });
    sink.on("finish", () => resolve(Buffer.concat(chunks).toString("utf8")));
    const { pipe, abort } = renderToPipeableStream(el, {
      onAllReady() {
        pipe(sink);
      },
      onError(e) {
        abort();
        reject(e);
      },
    });
  });
}

type Renderer = (p: { params: Promise<Record<string, string>> }) => Promise<React.ReactElement>;

async function main() {
  const outDir = process.argv[2];
  if (!outDir) {
    console.error("usage: deadcode_boards_probe <outDir>");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });

  const countryMod = await import("../../src/app/[country]/page");
  const cityMod = await import("../../src/app/(site)/cities/[slug]/page");
  const industryMod = await import("../../src/app/(site)/industries/[industry]/page");

  const routes: { name: string; run: () => Promise<React.ReactElement> }[] = [
    {
      name: "country-gb",
      run: () =>
        (countryMod.default as unknown as Renderer)({
          params: Promise.resolve({ country: "gb" }),
        }),
    },
    {
      name: "city-london",
      run: () =>
        (cityMod.default as unknown as Renderer)({
          params: Promise.resolve({ slug: "london" }),
        }),
    },
    {
      name: "industry-restaurants",
      run: () =>
        (industryMod.default as unknown as Renderer)({
          params: Promise.resolve({ industry: "restaurants" }),
        }),
    },
  ];

  for (const r of routes) {
    let html = "";
    try {
      html = await renderAll((await r.run()) as React.ReactElement);
    } catch (e) {
      html = `THREW: ${(e as Error).message}`;
    }
    writeFileSync(`${outDir}/${r.name}.html`, html, "utf8");
    console.log(`  ${r.name.padEnd(24)} ${String(html.length).padStart(9)} bytes`);
  }

  // --- direct exercise of the live siblings, independent of any page ---------
  // A page can self-omit a band and still look identical; calling the siblings
  // directly cannot. These are the pure ones, so they are deterministic and a
  // changed digit here is a real regression rather than a budget timeout.
  const act = await import("../../src/lib/scores/activity_board");
  const cty = await import("../../src/lib/scores/country_board");

  const probe: Record<string, unknown> = {};
  probe.survival_restaurants = act.getActivitySurvivalArchetype("restaurants");
  probe.survival_cafes = act.getActivitySurvivalArchetype("cafes-coffee-shops");
  probe.survival_unknown = act.getActivitySurvivalArchetype("not-a-real-activity");
  probe.places_summary = act.summarizeActivityPlaces([
    { name: "A", href: "/a", takeHome: 50000, typicalRevenue: 400000, netMarginPct: 12 },
    { name: "B", href: "/b", takeHome: 70000, typicalRevenue: 600000, netMarginPct: 14 },
    { name: "C", href: "/c", takeHome: 30000, typicalRevenue: 250000, netMarginPct: 9 },
    { name: "D", href: "/d", takeHome: 90000, typicalRevenue: 900000, netMarginPct: 16 },
    { name: "E", href: "/e", takeHome: 40000, typicalRevenue: 300000, netMarginPct: 10 },
  ] as Parameters<typeof act.summarizeActivityPlaces>[0]);
  probe.places_summary_thin = act.summarizeActivityPlaces([]);
  probe.ownerTakeHome_null = cty.ownerTakeHomeForCell(
    { revenue_per_enterprise: null } as unknown as Parameters<
      typeof cty.ownerTakeHomeForCell
    >[0],
    50000,
  );

  writeFileSync(`${outDir}/siblings.json`, JSON.stringify(probe, null, 2), "utf8");
  console.log(`  siblings.json            ${JSON.stringify(probe).length} bytes`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
