/**
 * The industry page's places table links each place to that trade's page there (milestone 1, M5; his interview of 2026-09-26,
 * answer 35; QUEUE ui:industry-page-is-a-dead-end). The table draws only where four cities hold their own figures, which no trade
 * does today, so the rows are proven here on the builder and the component, not on a render.
 *
 * Run: npx tsx tests/spine/places_doors.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildIndustryPlaces, type PlacesColumn } from "../../src/lib/spine/industry_places_rows";
import { CompareTable } from "../../src/components/spine/archetypes/CompareTable";
import { SURFACE_ANSWERS } from "../../src/lib/spine/door_kinds";
import { red, redSummary } from "../../scripts/lib/red";

/* CountryFlag is written for Next's automatic JSX runtime and names no React; this runner compiles JSX to React.createElement, so
   the table's components read the one React this file lends them when they render. */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "places-doors";
const FILE = "src/lib/spine/industry_places_rows.ts";
const REMEDY = "each place in the industry page's table links to the trade's page in that city, declaring what it lands on";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const col = (slug: string, name: string, country: string, takeHome: number, margin: number, href: string | null): PlacesColumn =>
  ({ slug, name, country, href, revenue: takeHome * 8 + slug.length, takeHome, netMarginFraction: margin, revenueFilled: false, economics: "curated", netMarginFloored: false }) as unknown as PlacesColumn;
const across = [
  col("london", "London", "gb", 40_000, 0.08, "/gb/london/restaurants"),
  col("paris", "Paris", "fr", 38_000, 0.07, "/fr/paris/restaurants"),
  col("berlin", "Berlin", "de", 35_000, 0.06, "/de/berlin/restaurants"),
  col("madrid", "Madrid", "es", 30_000, 0.05, "/es/madrid/restaurants"),
  col("lisbon", "Lisbon", "pt", 25_000, 0.05, null),
];
const places = buildIndustryPlaces("restaurants", across);
check("four or more places draw the table", places?.state === "table");
const rows = places?.rows ?? [];
check("each place with a link is a door to that trade's page in that city", rows.filter((r) => r.key !== "lisbon").every((r) => r.href === `/${r.iso2.toLowerCase()}/${r.key}/restaurants`));
check("each door declares what it lands on (the trade page's answer)", rows.filter((r) => r.href).every((r) => r.lands === SURFACE_ANSWERS.cell));
check("a place the resolver gives no link stays a reading", rows.find((r) => r.key === "lisbon")?.href === undefined);

const html = renderToStaticMarkup(React.createElement(CompareTable, { id: "places", kicker: "Where it pays", rows, columns: places?.columns ?? [] }));
check("the table says its rows are doors", html.includes('data-doors="1"'));
check("the rows link with the list rows' arrow", html.includes('href="/gb/london/restaurants"') && html.includes("after:content-[&#x27;→&#x27;]"));
check("each link carries its promise for the doors gate", html.includes(`data-lands="${SURFACE_ANSWERS.cell}"`));
const plain = renderToStaticMarkup(React.createElement(CompareTable, { id: "peers", kicker: "Against the peers", rows: rows.map(({ href: _h, lands: _l, ...r }) => r), columns: places?.columns ?? [] }));
check("a table whose rows carry no link stays a reading (M23)", !plain.includes("data-doors") && !plain.includes("<a "));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/places_doors: all pass");
