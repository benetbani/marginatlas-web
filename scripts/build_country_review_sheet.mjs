#!/usr/bin/env node
/**
 * build_country_review_sheet , THE FOUNDER'S ONE FILE for the rebuilt UK page.
 *
 * THE PAIRING LAW (founder 2026-08-30, verbatim: "before and after, the
 * sections are just not the same. For before you just give the hexagon and
 * after you give the table, it doesn't really make sense"): a BEFORE/AFTER
 * pair must be the SAME reading in two states. A section whose replacement is
 * a different KIND of thing shows the AFTER alone, with one plain line naming
 * what it replaced , never an unlike photograph pretending to be its past.
 *
 * Verdict controls: APPROVE / REJECT with optional reason per section, one
 * open QUESTION row (the lens world-median anchor), Copy button emitting
 *   country-new:<id>=A;country-new:<id>=R(reason);...
 *
 * Output: E:/atlas/design/COUNTRY-REVIEW-<date>.html, fully offline.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const CROPS = "E:/atlas/design/critique/crops";
const OUT = "E:/atlas/design";
const date = new Date().toISOString().slice(0, 10);

/* after: crop indices on country-gb-new (today's dossier: 0 take, 1 cities,
   2 peers, 3 customers, 4 lenses, 5 money, 6+7 character, 8 setup,
   9 premises, 10 hiring, 11 locals, 12 close). */
const SECTIONS = [
  {
    id: "take",
    title: "The masthead , total effective tax burden",
    pair: true, before: "country-gb-3",
    beforeNote: "the same opening, as it stands live",
    after: [0],
    note: "Applied from your 2026-08-30 verdicts: the answer is what a small business effectively pays (20%, its regime named), not 'the government take'; the flag is back and the name appears once; no world-median line; the register/sales-tax facts are one quiet sentence, not cards. The honest price: the small-business rate is a conservative modeled read, so the page now carries the SAMPLE tag here.",
  },
  {
    id: "cities",
    title: "The cities, as cards",
    pair: true, before: "country-gb-12",
    beforeNote: "the same section live today (the doubled card rows)",
    after: [1],
    note: "The map is removed, per your verdict. Five cards a row; a country with more gets click arrows and a count; 'Every covered city' leads to the full list. The UK holds four covered cities, so no arrows render here.",
  },
  {
    id: "peers",
    title: "Against the peers",
    pair: true, before: "country-gb-10",
    beforeNote: "the same table live today (minuscule flags)",
    after: [2],
    note: "One basis across the whole table now: the effective small-business rate per country, the same procedure as the masthead answer. On a phone the table no longer slides sideways; each country becomes its own card. Both forms are photographed above.",
  },
  {
    id: "customers",
    title: "What customers earn + the lens tiles",
    pair: false,
    replaces: "This stands where the hexagon radar stood. No before photograph: the radar and these tiles are different kinds of thing, and pairing unlike sections is what you rejected on the last sheet.",
    after: [3, 4],
    note: "The pay spread is dark for now: you asked for the top and bottom ten percent, the data today holds only quarter marks, and relabelling those would be a lie. The typical figure stands alone until the ten-percent figures are researched in (that task is queued).",
  },
  {
    id: "money",
    title: "What an owner keeps, trade by trade",
    pair: false,
    replaces: "This stands where the modeled 0-100 'ease' scores stood. No before photograph: scores and kept-money rows are different kinds of thing.",
    after: [5],
    note: "Three trades (gym, grocery, auto repair) stay withheld because their figures fail the six-times-typical-pay screen; the page says so in one line. The upstream fix runs in your other session; the rows return when the figures hold.",
  },
  {
    id: "character",
    title: "The character, the two ratified tables",
    pair: true, before: "country-gb-14",
    beforeNote: "the same two tables live today",
    after: [6, 7],
  },
  {
    id: "setup",
    title: "Registering, by legal form + what premises cost",
    pair: true, before: "country-gb-6",
    beforeNote: "the same question live today (the eleven-hundred-pixel one-step stepper)",
    after: [8, 9],
  },
  {
    id: "hiring",
    title: "What staff cost",
    pair: false,
    replaces: "This stands where 'the ground under you' (the SHAKY-FIRM card) stood. No before photograph: a verdict card and a staff-cost table are different kinds of thing.",
    after: [10],
  },
  {
    id: "locals",
    title: "What locals know, structured",
    pair: true, before: "country-gb-15",
    beforeNote: "the same section live today (the block of text)",
    after: [11],
  },
  {
    id: "close",
    title: "Where to next",
    pair: true, before: "country-gb-19",
    beforeNote: "the same hand-off live today",
    after: [12],
  },
  {
    id: "lens-world-anchor",
    title: "AN OPEN QUESTION , the one remaining world-median figure",
    pair: false,
    question: true,
    after: [4],
    note: "You removed the masthead's world-median line ('a little bit disgusting'). One lens tile still reads x4.27 the world-median wage , customer purchasing power has no absolute form without some anchor. APPROVE keeps that tile; REJECT removes it (the tile disappears rather than being restated another way, and the section keeps its other tiles).",
  },
];

const b64 = (p) => (existsSync(p) ? `data:image/png;base64,${readFileSync(p).toString("base64")}` : null);

let missing = 0;
let cards = "";
for (const s of SECTIONS) {
  const afterImgs = s.after.map((n) => ({
    d1280: b64(`${CROPS}/country-gb-new-${n}-1280.png`),
    d375: b64(`${CROPS}/country-gb-new-${n}-375.png`),
  }));
  const before = s.pair ? b64(`${CROPS}/${s.before}-1280.png`) : null;
  if (s.pair && !before) missing++;
  for (const a of afterImgs) if (!a.d1280) missing++;

  let figures = "";
  if (s.pair) {
    figures += `
      <figure>
        <figcaption>BEFORE , ${s.beforeNote}</figcaption>
        ${before ? `<img src="${before}" alt="before" />` : "<p class='miss'>legacy crop missing</p>"}
      </figure>`;
  }
  afterImgs.forEach((a, i) => {
    figures += `
      <figure>
        <figcaption>${s.question ? "AS IT STANDS" : "AFTER"} , desktop${afterImgs.length > 1 ? " (" + (i + 1) + " of " + afterImgs.length + ")" : ""}</figcaption>
        ${a.d1280 ? `<img src="${a.d1280}" alt="after 1280" />` : "<p class='miss'>crop missing</p>"}
      </figure>`;
  });
  if (afterImgs[0]?.d375 && !s.question) {
    figures += `
      <figure class="phone">
        <figcaption>${"AFTER , phone"}</figcaption>
        <img src="${afterImgs[0].d375}" alt="after 375" />
      </figure>`;
  }

  cards += `
  <section class="card" data-id="${s.id}">
    <h2>${s.title}</h2>
    ${s.replaces ? `<p class="replaces">${s.replaces}</p>` : ""}
    <div class="pair">${figures}
    </div>
    ${s.note ? `<p class="note">${s.note}</p>` : ""}
    <div class="verdict">
      <label><input type="radio" name="v-${s.id}" value="A" /> ${s.question ? "KEEP IT" : "APPROVE"}</label>
      <label><input type="radio" name="v-${s.id}" value="R" /> ${s.question ? "REMOVE IT" : "REJECT"}</label>
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
  header p{margin:8px 0 0;color:#6b6560;font-size:14px;max-width:76ch;}
  .card{margin:28px 32px;background:#fff;border:1px solid #e3ded9;border-radius:14px;padding:20px;}
  h2{margin:0 0 12px;font-size:17px;font-weight:600;}
  .replaces{margin:0 0 12px;font-size:13px;color:#6b6560;border-left:3px solid #e3ded9;padding-left:10px;}
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
  .steps{background:#fff;border:1px dashed #cfc8c1;border-radius:14px;margin:28px 32px 96px;padding:20px;}
  .steps h2{font-size:15px;}
  .steps ol{margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.7;color:#3d3935;}
</style></head><body>
<header>
  <h1>The United Kingdom page, rebuilt , for your verdict</h1>
  <p>Every one of your 2026-08-30 corrections is applied and photographed below.
  Where the new section is the SAME reading as the live one, you see before and
  after; where it replaced a different kind of thing, you see only what stands
  now, with one line naming what it replaced , no more unlike pairings. Mark
  each section, press COPY THE VERDICTS, paste me the string. Nothing goes live
  from this sheet.</p>
</header>
${cards}
<section class="steps">
  <h2>To see the live page yourself, two minutes in Vercel (optional)</h2>
  <ol>
    <li>vercel.com, your project, <b>Settings</b>, then <b>Environment Variables</b>.</li>
    <li><b>Add Environment Variable</b>: Type <b>Config</b>, Key <code>NEXT_PUBLIC_SPINE_REFORM_COUNTRY</code>, Value <code>1</code>.</li>
    <li>In the Environments dropdown pick <b>Preview only</b> , NOT Production. Save.</li>
    <li><b>Deployments</b>, newest one, <b>&#8943;</b>, <b>Redeploy</b>. Open the PREVIEW link it gives you and visit /gb.</li>
    <li>Production stays exactly as it is; only preview links show the new page. (The map is gone, so nothing on this page needs the live site to draw; this step is only if you want to walk it.)</li>
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
console.log(`wrote ${out} (${Math.round(html.length / 1024)}KB), missing crops: ${missing}`);
