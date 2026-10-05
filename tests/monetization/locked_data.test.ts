/**
 * THE LOCKED PARTS, SAID TO SEARCH ENGINES (milestone 2, masterplan step 19; his interview of 2026-09-26, "contradictions
 * reconciled": the closed half carries isAccessibleForFree false, so it is not read as cloaking). One JSON-LD script naming the
 * page as not wholly free and its locked parts by the class every locked section stamps. Whether a route draws it only when
 * locked is read off the rendered pages by step 20's gate (the routes need the database to render).
 *
 * Run: npx tsx tests/monetization/locked_data.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { ProLockedData } from "../../src/components/spine/ProLockedData";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "locked-data";
const FILE = "src/components/spine/ProLockedData.tsx";
const REMEDY = "say isAccessibleForFree false for the page and for its .pro-locked parts, in one JSON-LD script";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const html = renderToStaticMarkup(React.createElement(ProLockedData));
const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
check("one JSON-LD script", scripts.length === 1);
let data: { "@type"?: string; isAccessibleForFree?: unknown; hasPart?: Array<Record<string, unknown>> } = {};
try { data = JSON.parse(scripts[0] ?? "{}"); } catch { check("the script is JSON", false); }
check("the page is a WebPage not wholly free", data["@type"] === "WebPage" && data.isAccessibleForFree === false);
const part = data.hasPart?.[0];
check("its locked part is a WebPageElement, not free, selected by .pro-locked", data.hasPart?.length === 1 && part?.["@type"] === "WebPageElement" && part?.isAccessibleForFree === false && part?.cssSelector === ".pro-locked");
check("the selector is the class every locked section stamps", /className="pro-locked"/.test(readFileSync("src/components/spine/LockedSection.tsx", "utf8")));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/locked_data: all pass");
