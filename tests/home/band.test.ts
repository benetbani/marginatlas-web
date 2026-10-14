/**
 * THE BAND, ONE SOLID STATEMENT (plan docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Tasks 1B and 5; spec
 * docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 4; his decision of 2026-10-13: "one solid
 * statement: full-width brand terracotta at full strength, white type, one sentence, a link to the method"). Holds: the band a zone and
 * never a card, its one sentence and its one link and nothing else, no figure and no digit; the sentence true of the site, in the four words
 * the provenance stamp and About the figures use for how a figure is made; the colour the token --terra-full and the words --band-ink, white
 * at AA on it, ink on paper in print; the page laws reading the band's colour from the token; the render's one terracotta zone after the
 * contents and before the colophon. HomeBand loads with import() through a specifier held in a string, so the file runs (and typechecks)
 * before it exists and reds.
 * BLIND SPOT, stated: the contrast is computed from the tokens as written, not from pixels; check_readability measures the render.
 * Run: node node_modules/tsx/dist/cli.mjs tests/home/band.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { COPY } from "../../src/lib/spine/copy";
import { SHEET_TRUST } from "../../src/lib/nav";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-band";
const BAND = "src/components/spine/home/HomeBand.tsx";
/* HomeBand by a specifier held in a string: the file typechecks before the module exists, and the check below reds by name. */
const SPEC_BAND: string = "../../src/components/spine/home/HomeBand";
const CSS = "src/app/globals.css";
const COPYF = "src/lib/spine/copy.ts";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const REMEDY = "draw the band as plan 2026-10-13 Task 5 gives it: one zone on [data-tone=\"terra\"], one sentence and one link to About the figures, no figure and no digit, on --terra-full in --band-ink";
let failed = 0;
const check = (label: string, ok: boolean, file = BAND, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };
const read = (f: string) => (existsSync(f) ? readFileSync(f, "utf8") : "");
const copyAt = (path: string): string => { let v: unknown = COPY.home; for (const k of path.split(".")) v = v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined; return typeof v === "string" ? v : ""; };
const follows = (a: Element | null, b: Element | null) => !!a && !!b && (a.compareDocumentPosition(b) & 4) !== 0;

async function main(): Promise<void> {
  const line = copyAt("band.line");
  const label = copyAt("band.label");
  check(`the band's words are one plain sentence of twelve words or fewer, no digit ("${line}")`, line !== "" && label !== "" && line.trim().split(/\s+/).length <= 12 && /^[A-Z]/.test(line) && line.endsWith(".") && (line.match(/[.!?]/g) ?? []).length === 1 && !/[;—–]/.test(line) && !/\b(we|our|modelled|withheld)\b|on file/i.test(line) && !/\d/.test(line), COPYF);
  const kinds = [...(/export type ProvenanceKind = ([^;]+);/.exec(read("src/lib/spine/provenance.ts"))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  check(`it names the four kinds a figure is, as the provenance stamp names them (${kinds.join(", ") || "none read"})`, kinds.length === 4 && kinds.every((k) => line.toLowerCase().includes(k === "estimate" ? "estimat" : k)), COPYF, "say how every figure is made in the stamp's four words: counted, worked out, looked up, estimated");
  (globalThis as unknown as { React: typeof React }).React = React;
  const { default: AboutDataPage } = await import("../../src/app/(site)/about-data/page");
  const aboutHtml = renderToStaticMarkup(React.createElement(AboutDataPage));
  const at = aboutHtml.indexOf('id="reading"');
  const reading = at < 0 ? "" : aboutHtml.slice(at, aboutHtml.indexOf("<h2", at + 1)).replace(/<[^>]+>/g, " ");
  check("the page its link opens, About the figures' #reading, names the same four kinds", at > 0 && ["Counted", "Worked out", "Looked up", "Estimate"].every((w) => reading.includes(w)), "src/app/(site)/about-data/page.tsx", "keep #reading's four kinds on About the figures");
  const about = SHEET_TRUST.find((n) => n.href.startsWith("/about-data"));
  const B = await import(SPEC_BAND).catch(() => null);
  check("HomeBand is there", !!B);
  if (B) {
    const doc = new JSDOM(`<!doctype html><body>${renderToStaticMarkup(React.createElement(B.HomeBand))}</body>`).window.document;
    const root = doc.body.firstElementChild;
    check("a zone, never a card: one level, one cell, on the terracotta tone, labelled by its sentence", root?.tagName === "SECTION" && root.getAttribute("data-zone") === "wide" && root.getAttribute("data-tone") === "terra" && root.id === "band" && root.getAttribute("aria-labelledby") === "band-line" && root.getAttribute("data-zone-label") === label && root.querySelectorAll(":scope > [data-zone-level] > [data-zone-cell]").length === 1 && !root.querySelector("[data-card], [data-block]"));
    const ps = root ? [...root.querySelectorAll("p")] : [];
    const links = root ? [...root.querySelectorAll("a")] : [];
    check(`one sentence and one link to the method, nothing else (${ps.length} paragraph(s), ${links.length} link(s), no heading)`, ps.length === 1 && ps[0].id === "band-line" && ps[0].textContent === line && links.length === 1 && !!about && links[0].getAttribute("href") === about.href && (links[0].textContent ?? "").includes(about.label) && !root?.querySelector("h1, h2, h3, h4"));
    check("no figure and no digit on the band", !!root && !root.querySelector(".fig") && !/\d/.test(root.textContent ?? ""));
  }
  const src = read(BAND);
  check("its words are the band's ink and nothing else: no ink, grey, red or figure of their own", /text-\[var\(--band-ink\)\]/.test(src) && !/--c-ink\b|--c-ink2|--c-muted|--terra-text|text-atlas-|<Fig\b/.test(src));
  const css = read(CSS);
  const terraBlock = /\[data-zone\]\[data-tone="terra"\] \{([^}]*)\}/.exec(css)?.[1] ?? "";
  const printBlock = /@media print \{\s*\[data-zone\]\[data-tone="terra"\] \{([^}]*)\}/.exec(css)?.[1] ?? "";
  const full = [...css.matchAll(/--terra-full:\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => m[1]);
  check(`the band's zone stands on --terra-full in --band-ink (read: ${terraBlock.replace(/\s+/g, " ").trim() || "no rule"})`, /--zone-bg:\s*var\(--terra-full\)/.test(terraBlock) && /--c-surface:\s*var\(--terra-full\)/.test(terraBlock) && /color:\s*var\(--band-ink\)/.test(terraBlock), CSS);
  check(`--terra-full is one colour, defined once (${full.join(", ") || "none"}); --band-ink is the card's white; the pale band's rule colour is gone`, full.length === 1 && /--band-ink:\s*var\(--c-card\)/.test(css) && !/--band-rule/.test(css), CSS);
  check("on paper the band is ink on white", /--zone-bg:\s*var\(--c-card\)/.test(printBlock) && /--band-ink:\s*var\(--c-ink\)/.test(printBlock), CSS);
  const lum = (hex: string) => { const [r, g, b] = [1, 3, 5].map((i) => { const s = parseInt(hex.slice(i, i + 2), 16) / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = full.length === 1 ? 1.05 / (lum(full[0]) + 0.05) : 0;
  check(`white on --terra-full reads ${ratio.toFixed(2)} to 1, AA for every size the band sets (4.5 or more)`, ratio >= 4.5, CSS, "keep --terra-full dark enough for white type at 4.5 to 1 (Q1's three choices all are)");
  const laws = read("scripts/harness/check_page_laws.mjs");
  check("the page laws read the band's colour from --terra-full, never a typed value", /var\(--terra-full\)/.test(laws) && !/rgb\(251, 132, 105\)/.test(laws), "scripts/harness/check_page_laws.mjs", "read TERRA in check_page_laws.mjs by probing var(--terra-full), as plan 2026-10-13 Task 5 gives it");
  const render = read(RENDER);
  if (!render) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh)");
  else {
    const doc = new JSDOM(render.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
    const terra = [...doc.querySelectorAll('main [data-tone="terra"]')];
    const bandEl = doc.getElementById("band");
    check(`the render's one terracotta zone is the band, after the contents and before the colophon (${terra.length} terracotta zone(s))`, terra.length === 1 && terra[0] === bandEl && follows(doc.querySelector("main [data-contents]"), bandEl) && follows(bandEl, doc.getElementById("colophon")), RENDER);
    check("no digit on the band as drawn", !!bandEl && !/\d/.test(bandEl.textContent ?? ""), RENDER);
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/band: all pass");
}

main().catch((e) => { red({ rule: RULE, file: BAND, detail: `the band test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY }); process.exit(1); });
