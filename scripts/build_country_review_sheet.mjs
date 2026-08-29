#!/usr/bin/env node
/**
 * build_country_review_sheet , THE FOUNDER'S ONE FILE for the rebuilt UK page.
 *
 * Ten sections, each: the LEGACY section it replaces (one 1280 crop, labelled
 * BEFORE), the rebuilt section at 1280 and 375 (labelled AFTER), one
 * APPROVE / REJECT control with an optional reason. The Copy button emits:
 *
 *   country-new:<id>=A;country-new:<id>=R(reason);...
 *
 * Undecided sections are omitted from the string. Reasons are sanitized the
 * way the registry sheet sanitizes them (";" -> ",", parens -> brackets).
 *
 * The mapping from new section to the legacy section it answers comes from the
 * Task-8 inventory; a section with no legacy ancestor says so instead of
 * showing an unrelated BEFORE.
 *
 * Output: E:/atlas/design/COUNTRY-REVIEW-<date>.html, fully offline, images
 * inlined base64.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const CROPS = "E:/atlas/design/critique/crops";
const OUT = "E:/atlas/design";
const date = new Date().toISOString().slice(0, 10);

/** new-section id -> { title, before: legacy dossier node (2026-08-29 crops), note } */
const SECTIONS = [
  { id: "take", title: "The masthead , the government take", before: "country-gb-3", beforeNote: "the legacy masthead had no answer figure at all", after: "country-gb-new-0" },
  { id: "cities", title: "The cities, once, every card its link", before: "country-gb-12", beforeNote: "the legacy page showed the four cities twice and the cards were dead", after: "country-gb-new-1", mapNote: true },
  { id: "peers", title: "Against the peers", before: "country-gb-10", beforeNote: "minuscule flags, no character", after: "country-gb-new-2" },
  { id: "customers", title: "What customers earn + the lens grid (replaces the hexagon)", before: "country-gb-5", beforeNote: "the overloaded radar, full width", after: "country-gb-new-3" },
  { id: "money", title: "What an owner keeps, trade by trade", before: "country-gb-13", beforeNote: "a modeled 0-100 ease score on out-of-set trades", after: "country-gb-new-4" },
  { id: "character", title: "The character, the two ratified tables", before: "country-gb-14", beforeNote: "kept whole; newly sample-tagged", after: "country-gb-new-5" },
  { id: "setup", title: "Registering, by legal form + what premises cost", before: "country-gb-6", beforeNote: "the eleven-hundred-pixel one-step stepper", after: "country-gb-new-6" },
  { id: "hiring", title: "What staff cost (replaces the ground under you)", before: "country-gb-11", beforeNote: "the SHAKY-FIRM card nobody understood", after: "country-gb-new-7" },
  { id: "locals", title: "What locals know, structured", before: "country-gb-15", beforeNote: "the wall of text", after: "country-gb-new-8" },
  { id: "close", title: "Where to next", before: "country-gb-19", beforeNote: "one door and a gut-check card of fake checkboxes", after: "country-gb-new-9" },
];

const b64 = (p) => (existsSync(p) ? `data:image/png;base64,${readFileSync(p).toString("base64")}` : null);

let cards = "";
for (const s of SECTIONS) {
  const before = b64(`${CROPS}/${s.before}-1280.png`);
  const after1280 = b64(`${CROPS}/${s.after}-1280.png`);
  const after375 = b64(`${CROPS}/${s.after}-375.png`);
  cards += `
  <section class="card" data-id="${s.id}">
    <h2>${s.title}</h2>
    <div class="pair">
      <figure>
        <figcaption>BEFORE , ${s.beforeNote}</figcaption>
        ${before ? `<img src="${before}" alt="before" />` : "<p class='miss'>no legacy crop held</p>"}
      </figure>
      <figure>
        <figcaption>AFTER , at desktop width</figcaption>
        ${after1280 ? `<img src="${after1280}" alt="after 1280" />` : "<p class='miss'>crop missing</p>"}
      </figure>
      <figure class="phone">
        <figcaption>AFTER , at phone width</figcaption>
        ${after375 ? `<img src="${after375}" alt="after 375" />` : "<p class='miss'>crop missing</p>"}
      </figure>
    </div>
    ${s.id === "cities" ? `<p class="note">THE MAP: its canvas draws only on the running site, never in these photographs, so the box above shows its one-line placeholder. The map's first real photograph comes from the preview deployment the moment the preview-only switch below is set. Judge the city list here; judge the map on the preview link.</p>` : ""}
    ${s.id === "money" ? `<p class="note">Three trades are deliberately withheld on this page (gym, grocery, auto repair) because their figures fail the six-times-typical-pay smell test you set; the page says so in one line. The upstream fix ran in your other session; the rows return when the figures hold up.</p>` : ""}
    <div class="verdict">
      <label><input type="radio" name="v-${s.id}" value="A" /> APPROVE</label>
      <label><input type="radio" name="v-${s.id}" value="R" /> REJECT</label>
      <input type="text" class="reason" placeholder="reason (optional, used on reject)" />
    </div>
  </section>`;
}

const html = `<!doctype html>
<html><head><meta charset="utf-8"/><title>United Kingdom , the rebuilt page, for your verdict</title>
<style>
  body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#faf8f6;color:#1b1b1a;}
  header{padding:28px 32px;border-bottom:1px solid #e3ded9;background:#fff;position:sticky;top:0;z-index:2;}
  h1{margin:0;font-size:22px;font-weight:600;}
  header p{margin:8px 0 0;color:#6b6560;font-size:14px;max-width:72ch;}
  .card{margin:28px 32px;background:#fff;border:1px solid #e3ded9;border-radius:14px;padding:20px;}
  h2{margin:0 0 14px;font-size:17px;font-weight:600;}
  .pair{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start;}
  figure{margin:0;flex:1 1 340px;min-width:280px;}
  figure.phone{flex:0 1 220px;min-width:180px;}
  figcaption{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#8a847e;margin-bottom:6px;font-weight:600;}
  img{width:100%;height:auto;border:1px solid #e9e4df;border-radius:8px;display:block;}
  .miss{color:#b0483a;font-size:13px;}
  .note{font-size:13px;color:#6b6560;background:#f6f1ec;border-radius:8px;padding:10px 12px;}
  .verdict{display:flex;gap:18px;align-items:center;margin-top:12px;border-top:1px solid #eee9e4;padding-top:12px;font-size:14px;}
  .reason{flex:1;border:1px solid #ddd6cf;border-radius:8px;padding:7px 10px;font-size:13px;}
  .bar{position:fixed;bottom:0;left:0;right:0;background:#1b1b1a;color:#fff;padding:12px 32px;display:flex;gap:16px;align-items:center;}
  .bar button{background:#fb8469;color:#1b1b1a;border:none;border-radius:999px;padding:9px 18px;font-weight:600;font-size:14px;cursor:pointer;}
  .bar code{font-size:12px;opacity:.85;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
  .steps{background:#fff;border:1px dashed #cfc8c1;border-radius:14px;margin:28px 32px;padding:20px;}
  .steps h2{font-size:15px;}
  .steps ol{margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.7;color:#3d3935;}
</style></head><body>
<header>
  <h1>The United Kingdom page, rebuilt , ten sections for your verdict</h1>
  <p>Every section: what stood before, what stands now, at desktop and phone width.
  Mark APPROVE or REJECT on each (a reject can carry a reason, or not), then press
  COPY THE VERDICTS at the bottom and paste the string back to me. Approving locks a
  section; rejecting requeues it with your reason on the record. Nothing goes live
  from this sheet , the page stays dark until you say otherwise.</p>
</header>
${cards}
<section class="steps">
  <h2>To see the live page yourself (including the map), two minutes in Vercel</h2>
  <ol>
    <li>vercel.com, your project, <b>Settings</b>, then <b>Environment Variables</b>.</li>
    <li><b>Add Environment Variable</b>: Type <b>Config</b>, Key <code>NEXT_PUBLIC_SPINE_REFORM_COUNTRY</code>, Value <code>1</code>.</li>
    <li>In the Environments dropdown pick <b>Preview only</b> , NOT Production. Save.</li>
    <li><b>Deployments</b>, newest one, <b>&#8943;</b>, <b>Redeploy</b>. Open the PREVIEW link it gives you and visit /gb.</li>
    <li>Production stays exactly as it is; only preview links show the new page.</li>
  </ol>
</section>
<div class="bar">
  <button onclick="copyV()">COPY THE VERDICTS</button>
  <code id="out">nothing marked yet</code>
</div>
<script>
function buildV(){
  const parts=[];
  document.querySelectorAll(".card").forEach(c=>{
    const id=c.dataset.id;
    const v=c.querySelector("input[type=radio]:checked");
    if(!v)return;
    if(v.value==="A"){parts.push("country-new:"+id+"=A");return;}
    let r=(c.querySelector(".reason").value||"").replaceAll(";",",").replaceAll("(","[").replaceAll(")","]").trim();
    parts.push("country-new:"+id+"=R"+(r?"("+r+")":""));
  });
  return parts.join(";");
}
function copyV(){
  const s=buildV();
  document.getElementById("out").textContent=s||"nothing marked yet";
  if(s)navigator.clipboard.writeText(s);
}
document.addEventListener("change",()=>{document.getElementById("out").textContent=buildV()||"nothing marked yet";});
</script>
</body></html>`;

const out = `${OUT}/COUNTRY-REVIEW-${date}.html`;
writeFileSync(out, html);
console.log(`wrote ${out} (${Math.round(html.length / 1024)}KB)`);
