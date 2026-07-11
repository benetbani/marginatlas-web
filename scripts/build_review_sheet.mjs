#!/usr/bin/env node
// build_review_sheet.mjs
// Builds ONE self-contained founder review sheet from the design registries.
//
// Usage:
//   node build_review_sheet.mjs [page...] [--date YYYY-MM-DD]
//
// Default pages: every <page>.json found in E:/atlas/design/registry/.
// Output: E:/atlas/design/REVIEW-SHEET-<date>.html (crops inlined base64, fully offline).
//
// Verdict string grammar emitted by the sheet's Copy button:
//   <page>:<NN>=A;<page>:<NN>=R(<reason>);<page>:<NN>=R
//   NN = zero-padded section index. Undecided sections are omitted.
//   Reasons are sanitized in the sheet: ";" -> ",", "(" -> "[", ")" -> "]".

import fs from "node:fs";
import path from "node:path";

const REGISTRY_DIR = "E:/atlas/design/registry";
const CROPS_DIR = "E:/atlas/design/crops";
const OUT_DIR = "E:/atlas/design";

function localDate() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parseArgs(argv) {
  const pages = [];
  let date = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--date") {
      date = argv[++i];
    } else if (a.startsWith("--date=")) {
      date = a.slice("--date=".length);
    } else if (a.startsWith("--")) {
      console.warn(`[warn] unknown flag ${a}, ignored`);
    } else {
      pages.push(a.replace(/\.json$/i, ""));
    }
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`[error] --date must be YYYY-MM-DD, got: ${date}`);
    process.exit(1);
  }
  return { pages, date: date || localDate() };
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nn(section) {
  return String(section.index ?? 0).padStart(2, "0");
}

function loadRegistry(page) {
  const file = path.join(REGISTRY_DIR, `${page}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`[warn] registry not found, skipping page: ${file}`);
    return null;
  }
  let reg;
  try {
    reg = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.warn(`[warn] registry unreadable (${e.message}), skipping page: ${file}`);
    return null;
  }
  if (!Array.isArray(reg.sections)) {
    console.warn(`[warn] registry has no sections array, skipping page: ${file}`);
    return null;
  }
  return reg;
}

function cropDataUri(page, section) {
  const candidates = [];
  if (section.crop) candidates.push(section.crop);
  candidates.push(path.join(CROPS_DIR, page, `${section.id}.jpeg`));
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        return `data:image/jpeg;base64,${fs.readFileSync(c).toString("base64")}`;
      }
    } catch {
      // unreadable candidate, try the next one
    }
  }
  return null;
}

function sectionCardHtml(page, section) {
  const dataUri = cropDataUri(page, section);
  const img = dataUri
    ? `<img src="${dataUri}" alt="Crop of ${esc(section.id)}" loading="lazy">`
    : `<div class="missing">crop missing: ${esc(section.id)}.jpeg</div>`;
  const staleTag = section.stale ? `<span class="tag tag-stale">stale</span>` : "";
  const stateTag =
    section.state === "rejected" ? `<span class="tag tag-rej">previously rejected</span>` : "";
  return `
<article class="card" data-page="${esc(page)}" data-nn="${nn(section)}">
  <div class="card-head">
    <span class="sec-nn">${nn(section)}</span>
    <span class="sec-heading">${esc(section.heading || "(no heading)")}</span>
    <span class="sec-id">${esc(section.id || "")}</span>
    ${stateTag}${staleTag}
  </div>
  ${img}
  <div class="controls">
    <button type="button" class="btn btn-approve" aria-pressed="false">APPROVE</button>
    <button type="button" class="btn btn-reject" aria-pressed="false">REJECT</button>
    <input type="text" class="reason" placeholder="reject reason (one line)" disabled aria-label="Reject reason for ${esc(section.id || "")}">
  </div>
</article>`;
}

function lockedRowHtml(section) {
  return `
<div class="locked"><span class="tag">locked</span><span class="sec-nn">${nn(section)}</span> ${esc(
    section.heading || "(no heading)"
  )} <span class="sec-id">${esc(section.id || "")}</span></div>`;
}

function pageBlockHtml(page, reg) {
  const sections = [...reg.sections].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const rows = sections
    .map((s) => (s.state === "approved" ? lockedRowHtml(s) : sectionCardHtml(page, s)))
    .join("\n");
  const route = reg.route ? `<span class="route">${esc(reg.route)}</span>` : "";
  return `
<section class="page-block">
  <h2>${esc(page)}${route}</h2>
  ${rows}
</section>`;
}

const CSS = `
:root { --bg: #faf9f8; --ink: #1b1b1a; --acc: #c2410c; --line: #e6e2dd; --mut: #6b6660; }
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding: 28px 24px 130px;
}
.wrap { max-width: 980px; margin: 0 auto; }
h1 { font-size: 21px; margin: 0 0 4px; letter-spacing: -0.01em; }
.meta { color: var(--mut); font-size: 13px; margin: 0 0 8px; }
h2 {
  font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em;
  border-top: 2px solid var(--ink); padding-top: 10px; margin: 40px 0 12px;
}
h2 .route { color: var(--mut); font-weight: 400; text-transform: none; letter-spacing: 0; margin-left: 10px; font-size: 13px; }
.locked {
  font-size: 13px; color: var(--mut); padding: 7px 12px; margin: 6px 0;
  border: 1px solid var(--line); border-radius: 6px; background: #f3f1ee;
  display: flex; gap: 10px; align-items: baseline;
}
.tag { color: var(--acc); font-weight: 600; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; }
.tag-stale { color: var(--mut); border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; }
.tag-rej { color: var(--acc); }
.card { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 14px; margin: 16px 0; }
.card-head { display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; margin-bottom: 10px; }
.sec-nn { font-family: ui-monospace, Consolas, monospace; font-weight: 700; color: var(--acc); font-size: 13px; }
.sec-heading { font-weight: 600; font-size: 15px; }
.sec-id { font-family: ui-monospace, Consolas, monospace; font-size: 12px; color: var(--mut); }
.card img { max-width: 100%; height: auto; display: block; border: 1px solid var(--line); border-radius: 4px; }
.missing { padding: 30px; border: 1px dashed var(--line); border-radius: 4px; color: var(--mut); font-size: 13px; text-align: center; }
.controls { display: flex; gap: 10px; margin-top: 12px; align-items: center; flex-wrap: wrap; }
.btn {
  font: inherit; font-weight: 600; font-size: 14px; letter-spacing: 0.05em;
  padding: 11px 24px; border-radius: 6px; cursor: pointer; background: #fff;
}
.btn-approve { border: 1.5px solid var(--ink); color: var(--ink); }
.btn-reject { border: 1.5px solid var(--acc); color: var(--acc); }
.btn:focus-visible { outline: 3px solid #94a3b8; outline-offset: 2px; }
.btn-approve[aria-pressed="true"] { background: var(--ink); color: #fff; }
.btn-reject[aria-pressed="true"] { background: var(--acc); color: #fff; }
.reason {
  flex: 1; min-width: 220px; font: inherit; font-size: 14px; padding: 10px 12px;
  border: 1px solid var(--line); border-radius: 6px; background: #fff; color: var(--ink);
}
.reason:disabled { background: #f3f1ee; color: #a8a29c; }
.reason:focus-visible { outline: 3px solid #94a3b8; outline-offset: 1px; }
.bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 10;
  background: #fff; border-top: 2px solid var(--ink);
  padding: 10px 24px; display: flex; gap: 14px; align-items: center;
}
#count { font-weight: 600; font-size: 14px; min-width: 150px; }
#copy {
  font: inherit; font-weight: 600; font-size: 14px; padding: 10px 20px;
  border-radius: 6px; border: none; background: var(--acc); color: #fff; cursor: pointer;
}
#copy:focus-visible { outline: 3px solid #94a3b8; outline-offset: 2px; }
#out {
  flex: 1; height: 42px; resize: none; font-family: ui-monospace, Consolas, monospace;
  font-size: 12px; border: 1px solid var(--line); border-radius: 6px;
  padding: 8px 10px; background: var(--bg); color: var(--ink);
}
`;

// Client script: vanilla JS, no template literals (keeps this file's templating simple).
const CLIENT_JS = `
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var countEl = document.getElementById("count");
  var out = document.getElementById("out");
  var copyBtn = document.getElementById("copy");
  var total = cards.length;

  function verdictOf(card) { return card.getAttribute("data-verdict") || ""; }

  function update() {
    var n = 0;
    for (var i = 0; i < cards.length; i++) if (verdictOf(cards[i])) n++;
    countEl.textContent = n + " of " + total + " decided";
  }

  function setVerdict(card, v) {
    var next = verdictOf(card) === v ? "" : v;
    if (next) card.setAttribute("data-verdict", next);
    else card.removeAttribute("data-verdict");
    var ap = card.querySelector(".btn-approve");
    var rj = card.querySelector(".btn-reject");
    var reason = card.querySelector(".reason");
    ap.setAttribute("aria-pressed", next === "A" ? "true" : "false");
    rj.setAttribute("aria-pressed", next === "R" ? "true" : "false");
    reason.disabled = next !== "R";
    if (next === "R") reason.focus();
    update();
  }

  function cleanReason(s) {
    return s.replace(/;/g, ",").replace(/\\(/g, "[").replace(/\\)/g, "]").trim();
  }

  function buildString() {
    var parts = [];
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var v = verdictOf(c);
      if (!v) continue;
      var key = c.getAttribute("data-page") + ":" + c.getAttribute("data-nn");
      if (v === "A") {
        parts.push(key + "=A");
      } else {
        var r = cleanReason(c.querySelector(".reason").value);
        parts.push(r ? key + "=R(" + r + ")" : key + "=R");
      }
    }
    return parts.join(";");
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  copyBtn.addEventListener("click", function () {
    var text = buildString();
    out.value = text;
    var done = function () {
      copyBtn.textContent = "Copied";
      setTimeout(function () { copyBtn.textContent = "Copy verdict"; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  });

  cards.forEach(function (card) {
    card.querySelector(".btn-approve").addEventListener("click", function () { setVerdict(card, "A"); });
    card.querySelector(".btn-reject").addEventListener("click", function () { setVerdict(card, "R"); });
  });

  update();
})();
`;

function buildHtml({ date, blocks, decidable, locked, pageCount }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Review sheet ${esc(date)}</title>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
<header>
  <h1>Design review sheet</h1>
  <p class="meta">${esc(date)} &middot; ${pageCount} page${pageCount === 1 ? "" : "s"} &middot; ${decidable} to decide &middot; ${locked} locked</p>
  <p class="meta">Pick APPROVE or REJECT per section (click again to undo). Add a one-line reason on rejects. Then hit Copy verdict and paste the string back.</p>
</header>
<main>
${blocks.join("\n")}
</main>
</div>
<footer class="bar">
  <span id="count">0 of ${decidable} decided</span>
  <button type="button" id="copy">Copy verdict</button>
  <textarea id="out" readonly aria-label="Verdict string" placeholder="verdict string appears here after Copy"></textarea>
</footer>
<script>${CLIENT_JS}</script>
</body>
</html>
`;
}

function main() {
  const { pages: argPages, date } = parseArgs(process.argv.slice(2));

  let pages = argPages;
  if (pages.length === 0) {
    if (!fs.existsSync(REGISTRY_DIR)) {
      console.error(`[error] registry directory not found: ${REGISTRY_DIR}`);
      console.error("        Run crop_sections.mjs first to seed registries, or pass page names explicitly.");
      process.exit(1);
    }
    pages = fs
      .readdirSync(REGISTRY_DIR)
      .filter((f) => f.toLowerCase().endsWith(".json"))
      .map((f) => f.replace(/\.json$/i, ""))
      .sort();
    if (pages.length === 0) {
      console.error(`[error] no registry files in ${REGISTRY_DIR}`);
      process.exit(1);
    }
  }

  const blocks = [];
  let decidable = 0;
  let locked = 0;
  let missingCrops = 0;
  let loadedPages = 0;

  for (const page of pages) {
    const reg = loadRegistry(page);
    if (!reg) continue;
    loadedPages++;
    for (const s of reg.sections) {
      if (s.state === "approved") locked++;
      else {
        decidable++;
        if (!cropDataUri(page, s)) missingCrops++;
      }
    }
    blocks.push(pageBlockHtml(page, reg));
  }

  if (loadedPages === 0) {
    console.error("[error] no registries could be loaded, nothing to build");
    process.exit(1);
  }

  const html = buildHtml({ date, blocks, decidable, locked, pageCount: loadedPages });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `REVIEW-SHEET-${date}.html`);
  fs.writeFileSync(outFile, html);

  const kb = Math.round(fs.statSync(outFile).size / 1024);
  console.log(`[ok] wrote ${outFile} (${kb} KB)`);
  console.log(`     pages ${loadedPages}, sections to decide ${decidable}, locked ${locked}${missingCrops ? `, crops missing ${missingCrops}` : ""}`);
}

main();
