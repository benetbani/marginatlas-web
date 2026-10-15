/**
 * NO COUNT ON THE HOME (his ruling of 2026-10-07: no country, city or trade-list count on the home; plan
 * docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 1C; spec docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md,
 * sections 1 and 4). Three rules over the home's render, scratchpad/harness/pages/home-gb.html (pages-fresh writes it first in the chain):
 *   COUNT   a number beside one of the site's list nouns, in figures or in words ("195 countries", "five London trades", "hundreds of
 *           cities"), read block by block (a paragraph, a list item, a link, a heading, a cell, a label), the block's text nodes joined so a
 *           count split across tags is one phrase; the words are src/lib/home/list_counts.ts's;
 *   FIGURE  a stamped figure (`.fig`) anywhere but a trade row of the contents (MODEL PART 9: a trade row carries its own figure) and the
 *           Pro band (an offer, his decision of 2026-10-09);
 *   DIGIT   any digit in the band, which states and never counts.
 * Not read: a department's index (data-dept-index, "01" to "06"), a <time>, the stylesheet and scripts. The home's own strings in the copy
 * table are read with the same words. The rules are proven on fixtures first (Review Focus 5), then run on the render; a missing render, or
 * a main with no text, is a red, so the gate never passes having read nothing.
 * BLIND SPOT, stated: it reads the server's markup at no width, so a count a client component writes after hydration, a count drawn as a
 * mark, or a total with two words or more between it and its noun ("195 of the world's countries") is not seen.
 * Run: node node_modules/tsx/dist/cli.mjs tests/home/no_counts.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-no-counts";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const LIB = "src/lib/home/list_counts.ts";
const REMEDY = "say it without the count (a door names a list, never its size); a figure stands only in a trade row of the contents and in the Pro band; the band states and never counts";
let failed = 0;
const check = (label: string, ok: boolean, file = RENDER, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

type Finding = { rule: "COUNT" | "FIGURE" | "DIGIT"; text: string };
const BLOCKS = "p, li, a, h1, h2, h3, h4, dt, dd, td, th, label, button, figcaption, blockquote, summary, caption";
const SKIP = "style, script, template, noscript, time, [data-dept-index]";

/** The three rules over one parsed page, its count words read by `listCounts`. */
function readCounts(doc: Document, listCounts: (s: string) => string[]): { chars: number; findings: Finding[] } {
  const root = doc.querySelector("main") ?? doc.body;
  const groups = new Map<Element, string[]>();
  let chars = 0;
  const walker = doc.createTreeWalker(root, 4);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    const t = n.textContent ?? "";
    if (!el || !t.trim() || el.closest(SKIP)) continue;
    chars += t.replace(/\s/g, "").length;
    const host = el.closest(BLOCKS) ?? el;
    const list = groups.get(host) ?? [];
    list.push(t);
    groups.set(host, list);
  }
  const findings: Finding[] = [];
  for (const parts of groups.values()) for (const c of listCounts(parts.join(" "))) findings.push({ rule: "COUNT", text: c });
  for (const f of root.querySelectorAll(".fig")) if (!f.closest('[data-dept="trades"] [data-member]') && !f.closest("#pro")) findings.push({ rule: "FIGURE", text: (f.textContent ?? "").trim() });
  const band = root.querySelector("#band");
  if (band && /\d/.test(band.textContent ?? "")) findings.push({ rule: "DIGIT", text: (band.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60) });
  return { chars, findings };
}

async function main(): Promise<void> {
  const L = await import("../../src/lib/home/list_counts").catch(() => null);
  check("the count words are there", !!L, LIB, "create src/lib/home/list_counts.ts as plan 2026-10-13 Task 1C gives it");
  if (L) {
    const RED = ["Explore 195 countries", "one hundred and thirty-eight trades", "Hundreds of cities, one atlas", "five London trades", "a dozen countries", "40+ countries", "1,234 businesses", "Over 9 sectors"];
    const CLEAN = ["Cities, city by city.", "What each trade keeps from its sales, after all costs.", "Contains public sector information licensed under the Open Government Licence v3.0.", "Checked 13 October 2026", "Each figure is counted, worked out, looked up or estimated.", "The reference atlas of small-business earnings.", "What it takes to run a business, country by country."];
    const missed = RED.filter((s) => L.listCounts(s).length === 0);
    const wrong = CLEAN.filter((s) => L.listCounts(s).length > 0);
    check(`a count in figures or in words is found (${RED.length - missed.length} of ${RED.length}${missed.length ? `; missed: ${missed.join(" | ")}` : ""})`, missed.length === 0, LIB);
    check(`a line with no count is left alone (${CLEAN.length - wrong.length} of ${CLEAN.length}${wrong.length ? `; wrongly: ${wrong.join(" | ")}` : ""})`, wrong.length === 0, LIB);
    const fx = (html: string) => readCounts(new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document, L.listCounts);
    const has = (r: { findings: Finding[] }, rule: Finding["rule"]) => r.findings.some((f) => f.rule === rule);
    check("a count split across tags is one phrase", has(fx('<a href="/x"><span>195</span> <span>countries</span></a>'), "COUNT"), "tests/home/no_counts.test.ts");
    check("a department's index beside its title is no count", fx('<div data-dept="countries"><div><span data-dept-index="">01</span><h2>Countries</h2></div></div>').findings.length === 0, "tests/home/no_counts.test.ts");
    check("a figure outside a trade row and Pro is found; a trade row's and Pro's are not", has(fx('<p><span class="fig" data-src="x" data-kind="counted">138</span></p>'), "FIGURE") && fx('<div data-dept="trades"><ul><li><a data-member="restaurants" href="/industries/restaurants"><span>Restaurants</span><span class="fig" data-src="x" data-kind="estimate">7%</span></a></li></ul></div>').findings.length === 0 && fx('<div id="pro"><span class="fig">$38</span></div>').findings.length === 0, "tests/home/no_counts.test.ts");
    check("a digit on the band is found; a date in a <time> is not", has(fx('<section id="band"><p>Read from 32 sources.</p></section>'), "DIGIT") && fx('<p>Checked <time datetime="2026-10-13">13 October 2026</time></p>').findings.length === 0, "tests/home/no_counts.test.ts");
    /* THE HOME'S OWN STRINGS IN THE COPY TABLE (they land task by task; until then none is read). */
    const H = COPY.home as unknown as Record<string, unknown>;
    const strings: string[] = [];
    const walk = (v: unknown): void => { if (typeof v === "string") strings.push(v); else if (v && typeof v === "object") for (const x of Object.values(v)) walk(x); };
    for (const k of ["positioning", "contents", "band", "colophon"]) walk(H[k]);
    const inCopy = strings.flatMap((s) => L.listCounts(s));
    check(`the home's own strings hold no count (${strings.length} read${inCopy.length ? `; ${inCopy.join(" | ")}` : ""})`, inCopy.length === 0, "src/lib/spine/copy.ts");
    if (!existsSync(RENDER)) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh), which renders home gb first in the chain");
    else {
      const r = readCounts(new JSDOM(readFileSync(RENDER, "utf8")).window.document, L.listCounts);
      const by = (rule: Finding["rule"]) => r.findings.filter((f) => f.rule === rule).map((f) => f.text);
      check(`the home's render was read (${r.chars} characters)`, r.chars > 0);
      check(`no count of a list on the home (${by("COUNT").join(" | ") || "none"})`, by("COUNT").length === 0);
      check(`no figure on the home but a trade row's and Pro's (${by("FIGURE").length}${by("FIGURE").length ? `: ${by("FIGURE").slice(0, 12).join(", ")}` : ""})`, by("FIGURE").length === 0);
      check(`no digit on the band (${by("DIGIT").join(" | ") || "none"})`, by("DIGIT").length === 0);
    }
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/no_counts: all pass");
}

main().catch((e) => { red({ rule: RULE, file: RENDER, detail: `the no-counts test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY }); process.exit(1); });
