/**
 * THE FREE UK DATA PACK AT /data (his ruling of 2026-10-05 on PARKED P0.3, option (a): "free and public, cited, as the credibility
 * plan proposes"). The list in src/lib/data_pack.ts, the files under public/data/uk/<version>/, and the page /data agree.
 *
 * Holds: every listed file is published and linked from /data; nothing published is unlisted; the two files held back by the
 * credibility plan's free line (street-level joins, history) are not published and nothing on the page promises them; the README
 * carries the licence (CC BY 4.0 for our tables) and its file list names only what is published; the citation points at /data;
 * /data is a known top-level address, in the sitemap, linked from About the figures.
 *
 * Run: npx tsx tests/trust/data_pack.test.ts
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PACK_FILES, PACK_HELD_BACK, PACK_VERSION, packHref } from "../../src/lib/data_pack";
import { TOP_LEVEL_SEGMENTS } from "../../src/lib/routing/top_level_segments";
import { red, redSummary } from "../../scripts/lib/red";

(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "data-pack";
const FILE = "src/app/(site)/data/page.tsx";
const REMEDY = "publish the pack with scripts/data/publish_pack.ts and keep src/lib/data_pack.ts, public/data/uk/<version>/ and /data in step";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const DIR = `public/data/uk/${PACK_VERSION}`;
const published = existsSync(DIR) ? readdirSync(DIR) : [];
const listed = PACK_FILES.map((f) => f.file);
check(`every listed file is published (${listed.filter((f) => !published.includes(f)).join(", ") || "all"})`, listed.every((f) => published.includes(f)));
check(`nothing published is unlisted (${published.filter((f) => !listed.includes(f)).join(", ") || "none"})`, published.every((f) => listed.includes(f)));
check(`the held-back files are not published (${PACK_HELD_BACK.join(", ")})`, !PACK_HELD_BACK.some((f) => published.includes(f)));

const readme = existsSync(`${DIR}/README.md`) ? readFileSync(`${DIR}/README.md`, "utf8") : "";
check("the README offers our tables under CC BY 4.0", /CC BY 4\.0/.test(readme));
check("the README's file list names no held-back file as published", !PACK_HELD_BACK.some((h) => readme.includes(`- \`${h}\`:`)));
const cff = existsSync(`${DIR}/CITATION.cff`) ? readFileSync(`${DIR}/CITATION.cff`, "utf8") : "";
check("the citation names this version and points at /data", cff.includes(`version: "${PACK_VERSION}"`) && cff.includes("marginatlas.com/data"));

check("/data is a known top-level address", TOP_LEVEL_SEGMENTS.has("data"));
check("the sitemap lists /data", readFileSync("src/app/sitemap.ts", "utf8").includes("/data`"));
check("About the figures links to /data", readFileSync("src/app/(site)/about-data/page.tsx", "utf8").includes('href="/data"'));

(async () => {
  if (!existsSync(FILE)) { check("the page exists at /data", false); }
  else {
    const mod = (await import("../../" + FILE)) as { default: () => React.ReactElement; metadata?: { alternates?: { canonical?: string } } };
    const html = renderToStaticMarkup(mod.default());
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    check("the page is canonical at /data", mod.metadata?.alternates?.canonical === "/data");
    const unlinked = listed.filter((f) => !html.includes(`href="${packHref(f)}"`));
    check(`the page links every file (${unlinked.join(", ") || "all"})`, unlinked.length === 0);
    check("the page names the licence and the version", text.includes("CC BY 4.0") && text.includes(PACK_VERSION));
    check("the page promises nothing held back (no Pro download)", !/\bPro\b/.test(text) && !PACK_HELD_BACK.some((h) => html.includes(h)));
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("trust/data_pack: all pass");
})();
