#!/usr/bin/env node
/**
 * build_critique_sheet , ONE SURFACE FOR ONE CRITIQUE ROUND.
 *
 * Renders the dossier: every section and every subsection, with its picture at
 * three magnifications beside the measurements each of the nine dimensions needs,
 * and a verdict control per dimension.
 *
 * IT SHOWS EVIDENCE AND ASKS FOR A VERDICT. It never pre-fills one. A sheet that
 * suggests its own answer gets that answer back, which is a way of measuring
 * nothing while feeling thorough.
 *
 * CROPS ARE REFERENCED, NOT EMBEDDED. 119 nodes at three magnifications is far
 * past what one inlined file can carry, so the sheet lives beside its crops
 * folder and both move together. The four-page picture sheet stays the
 * self-contained artifact; this is the working surface.
 *
 * Usage: node scripts/build_critique_sheet.mjs [--date YYYY-MM-DD]
 * Reads:  design/critique/dossier-<date>.json  (+ crops/)
 * Writes: design/critique/CRITIQUE-<date>.html
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DIR = "E:/atlas/design/critique";
const argv = process.argv.slice(2);
const DATE = argv.includes("--date") ? argv[argv.indexOf("--date") + 1] : new Date().toISOString().slice(0, 10);

const DIMENSIONS = [
  ["D1", "Hierarchy", "Is the biggest thing the most important thing?"],
  ["D2", "Semantics", "Does the markup mean what the picture means?"],
  ["D3", "Spacing", "A ladder with distinct rungs, or a puddle?"],
  ["D4", "Principles", "Which written rules govern this, and does it obey them?"],
  ["D5", "Message", "What decision does this serve? Would a stranger get it?"],
  ["D6", "Form", "Right visual for this quantity? Would another say it better?"],
  ["D7", "Icon", "Does the icon mean THIS section, or any section?"],
  ["D8", "Relevance", "Anything here a reader would have to be told to ignore?"],
  ["D9", "Copy", "A fact per sentence, in the site's voice?"],
];

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const file = `${DIR}/dossier-${DATE}.json`;
if (!existsSync(file)) {
  console.log(`x no dossier at ${file}. Run build_section_dossier.mjs first.`);
  process.exit(1);
}
const dossier = JSON.parse(readFileSync(file, "utf8"));

/* The measurements each dimension reads, laid out as facts so a verdict has
   something to be checked against later. */
function evidence(n) {
  const rows = [];
  const sizes = n.typeSizes.map((t) => `${t.px}px x${t.n}`).join("  ");
  rows.push(["D1", `${n.typeSizes.length} type sizes: ${sizes || "none"}`]);
  rows.push(["D1", `largest text ${n.largestText.size}px: "${n.largestText.text}"`]);
  rows.push(["D2", `${n.semantic.realTable ? "real table" : "no table"}, ${n.semantic.realList ? "real list" : "no list"}, headings ${n.semantic.headings}, ${n.semantic.divs} divs, ${n.semantic.ariaLabelled} labelled for a reader`]);
  const g = n.spacing.distinctGaps;
  rows.push(["D3", `gaps ${g.length ? g.join(" / ") : "none"}   padding ${n.spacing.padTop}/${n.spacing.padRight}/${n.spacing.padBottom}/${n.spacing.padLeft}`]);
  rows.push(["D6", `${n.marks.n} drawn marks (${n.marks.accent} accented), sizes ${n.marks.sizes.join("/") || "none"}`]);
  rows.push(["C", `ink ${n.colour.ink}, muted ${n.colour.muted}, accent ${n.colour.accent}`]);
  rows.push(["D7", `icon ${n.icon || "none"}`]);
  rows.push(["D9", `${n.prose} chars of prose, ${n.sentences.length} sentence(s)`]);
  if (n.at375) {
    const drift = [];
    if (n.at375.typeSizes.join() !== n.typeSizes.map((t) => t.px).join()) drift.push("TYPE SIZES DIFFER at 375");
    if (n.at375.markSizes.join() !== n.marks.sizes.join()) drift.push("MARK SIZES DIFFER at 375");
    rows.push(["375", `${n.at375.w}x${n.at375.h}${drift.length ? "   " + drift.join("; ") : "   nothing scales"}`]);
  }
  return rows;
}

function nodeHtml(page, n) {
  const id = `${page}-${n.path}`.replace(/[^a-z0-9.-]+/gi, "-");
  const crop = (tag) => `crops/${id}-${tag}.png`;
  const ev = evidence(n).map(([k, v]) => `<tr><td class="k">${esc(k)}</td><td>${esc(v)}</td></tr>`).join("");
  const dims = DIMENSIONS.map(([code, name, q]) => `
      <div class="dim" data-node="${esc(id)}" data-dim="${code}">
        <div class="dim-head"><b>${code}</b> ${esc(name)}<span class="q">${esc(q)}</span></div>
        <div class="verdicts">
          <button type="button" data-v="good">good</button>
          <button type="button" data-v="weak">weak</button>
          <button type="button" data-v="wrong">wrong</button>
          <button type="button" data-v="unjudged">unjudged</button>
          <input type="text" class="note" placeholder="what exactly, and what would fix it">
        </div>
      </div>`).join("");

  const sentences = n.sentences.length
    ? `<div class="sent">${n.sentences.map((s) => `<p>${esc(s)}</p>`).join("")}</div>` : "";

  return `
  <article class="node ${n.kind}" id="${esc(id)}">
    <h3><span class="kind">${esc(n.kind)}</span> ${esc(n.label || n.heading || n.path)} <span class="dim-note">${n.w}x${n.h}</span></h3>
    ${n.ofSection ? `<div class="parent">inside , ${esc(n.ofSection)}</div>` : ""}
    <div class="shots">
      <figure><figcaption>1280</figcaption><img loading="lazy" src="${crop("1280")}" alt=""></figure>
      <figure><figcaption>375</figcaption><img loading="lazy" src="${crop("375")}" alt=""></figure>
      <figure class="zoom"><figcaption>3x , where strokes confess</figcaption><img loading="lazy" src="${crop("zoom")}" alt=""></figure>
    </div>
    <table class="ev">${ev}</table>
    ${sentences}
    ${n.kind === "rail" ? '<div class="dim-note">A rail is judged with its section. Shown here so its icon can be seen against its neighbours.</div>' : `<div class="dims">${dims}</div>`}
  </article>`;
}

const blocks = dossier.pages.map((p) => {
  const judged = p.nodes.filter((n) => n.kind !== "rail");
  return `
  <section class="page">
    <h2>${esc(p.page)} <span class="dim-note">${judged.length} to judge, ${p.nodes.length - judged.length} rails shown for their icons only</span></h2>
    ${p.nodes.map((n) => nodeHtml(p.page, n)).join("")}
  </section>`;
}).join("");

const total = dossier.pages.reduce((a, p) => a + p.nodes.filter((n) => n.kind !== "rail").length, 0);

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Critique round , ${esc(DATE)}</title>
<style>
 :root { color-scheme: light; --line:#e6e2dd; --mut:#6b6660; --acc:#c2410c; }
 *{box-sizing:border-box}
 body{margin:0;background:#faf9f8;color:#1b1b1a;font:15px/1.5 ui-sans-serif,system-ui,"Segoe UI",sans-serif;padding:26px 22px 140px}
 .wrap{max-width:1180px;margin:0 auto}
 h1{font-size:21px;margin:0 0 4px}
 .meta{color:var(--mut);font-size:13px;margin:0 0 22px;max-width:70ch}
 h2{font-size:14px;text-transform:uppercase;letter-spacing:.06em;border-top:2px solid #1b1b1a;padding-top:9px;margin:38px 0 10px}
 .dim-note{color:var(--mut);font-weight:400;text-transform:none;letter-spacing:0;font-size:12px}
 .node{border:1px solid var(--line);border-radius:10px;background:#fff;padding:14px;margin:12px 0}
 .node.rail{opacity:.6}
 .node.subsection{margin-left:26px;border-left:3px solid var(--line)}
 h3{font-size:14px;margin:0 0 3px;font-weight:600}
 .kind{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);border:1px solid var(--line);border-radius:4px;padding:1px 5px;margin-right:6px}
 .parent{font-size:12px;color:var(--mut);margin-bottom:8px}
 .shots{display:grid;grid-template-columns:1fr 300px;gap:12px;margin:10px 0}
 .shots .zoom{grid-column:1 / -1}
 figure{margin:0;border:1px solid var(--line);border-radius:8px;padding:8px;background:#fbfbfa;overflow:hidden}
 figcaption{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--mut);margin-bottom:6px}
 img{display:block;width:100%;height:auto;border-radius:4px}
 table.ev{border-collapse:collapse;width:100%;margin:8px 0;font-size:12.5px}
 table.ev td{border-bottom:1px solid #f2efec;padding:4px 8px;vertical-align:top}
 table.ev td.k{color:var(--mut);width:44px;font-weight:600;font-size:11px}
 .sent{font-size:12.5px;color:#4a4a48;margin:6px 0;padding-left:10px;border-left:2px solid var(--line)}
 .sent p{margin:3px 0}
 .dims{margin-top:10px;border-top:1px solid var(--line);padding-top:8px}
 .dim{display:grid;grid-template-columns:230px 1fr;gap:10px;align-items:center;padding:4px 0}
 .dim-head{font-size:12.5px}
 .dim-head .q{display:block;color:var(--mut);font-size:11px}
 .verdicts{display:flex;gap:5px;align-items:center;flex-wrap:wrap}
 .verdicts button{font:inherit;font-size:11.5px;padding:3px 9px;border:1px solid var(--line);border-radius:20px;background:#fff;cursor:pointer}
 .verdicts button[aria-pressed=true][data-v=good]{background:#1b1b1a;color:#fff;border-color:#1b1b1a}
 .verdicts button[aria-pressed=true][data-v=weak]{background:#8a6a2f;color:#fff;border-color:#8a6a2f}
 .verdicts button[aria-pressed=true][data-v=wrong]{background:var(--acc);color:#fff;border-color:var(--acc)}
 .verdicts button[aria-pressed=true][data-v=unjudged]{background:#6b6660;color:#fff;border-color:#6b6660}
 .note{flex:1;min-width:220px;font:inherit;font-size:12px;padding:4px 8px;border:1px solid var(--line);border-radius:5px}
 .bar{position:fixed;left:0;right:0;bottom:0;background:#1b1b1a;color:#fff;padding:9px 20px;display:flex;gap:14px;align-items:center;font-size:13px}
 .bar button{font:inherit;font-weight:600;padding:7px 16px;border:0;border-radius:6px;background:#fff;color:#1b1b1a;cursor:pointer}
 #out{flex:1;font:inherit;font-size:11px;padding:6px 8px;border-radius:5px;border:0;background:#2b2b2a;color:#fff;font-family:ui-monospace,monospace}
</style></head><body><div class="wrap">
 <h1>Critique round , ${esc(DATE)}</h1>
 <p class="meta">${total} nodes to judge on nine dimensions each. Every picture was taken from the current build. The evidence under each picture is measured, not asserted. Rails are shown greyed because their icons are judged with their section, not on their own. Nothing here is pre-filled: a sheet that suggests its own answer gets that answer back.</p>
 ${blocks}
</div>
<div class="bar">
  <span id="count">0 recorded</span>
  <input id="out" readonly value="">
  <button type="button" id="copy">Copy verdict string</button>
</div>
<script>
(function(){
  var dims = Array.prototype.slice.call(document.querySelectorAll('.dim'));
  function build(){
    var parts = [];
    dims.forEach(function(d){
      var on = d.querySelector('button[aria-pressed=true]');
      if(!on) return;
      var note = d.querySelector('.note').value.trim().replace(/[;()]/g,',');
      parts.push(d.getAttribute('data-node') + ':' + d.getAttribute('data-dim') + '=' + on.getAttribute('data-v') + (note ? '(' + note + ')' : ''));
    });
    document.getElementById('out').value = parts.join(';');
    document.getElementById('count').textContent = parts.length + ' recorded';
  }
  dims.forEach(function(d){
    d.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        var was = b.getAttribute('aria-pressed') === 'true';
        d.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed','false'); });
        b.setAttribute('aria-pressed', was ? 'false' : 'true');
        build();
      });
    });
    d.querySelector('.note').addEventListener('input', build);
  });
  document.getElementById('copy').addEventListener('click', function(){
    var o = document.getElementById('out');
    o.select(); try { document.execCommand('copy'); } catch(e) {}
  });
})();
</script>
</body></html>`;

const out = `${DIR}/CRITIQUE-${DATE}.html`;
writeFileSync(out, html, "utf8");
console.log(`  wrote ${out}  (${Math.round(html.length / 1024)}KB)`);
console.log(`  ${total} nodes to judge on ${DIMENSIONS.length} dimensions = ${total * DIMENSIONS.length} verdicts`);
