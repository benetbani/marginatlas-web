/* C19 SURVEY: the countries-list page, never opened by this loop.
   Counts, on the RENDER at 1280 and 375:
     - what it DECLARES (every data-idea, per card)
     - what it DRAWS (role=img, sized fills, multi-shape svgs, pip rows)
     - every flag mark with its computed radius, border and rendered height
     - every text node above 15px, with its Range-measured width (run 15's lesson)
     - the band/section skeleton with measured geometry
   Nothing is written; this only reports. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2] || "countries-list";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();

for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  const out = await p.evaluate(() => {
    const txt = (el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const rr = r.getBoundingClientRect();
      return { w: Math.round(rr.width), h: Math.round(rr.height) };
    };
    const maxR = (s) =>
      Math.max(
        ...[s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius].map(
          (c) => parseFloat(c) || 0,
        ),
      );

    /* DECLARED */
    const declared = [...document.querySelectorAll("[data-idea]")].map((el) => ({
      idea: el.getAttribute("data-idea"),
      cls: (el.getAttribute("class") || "").slice(0, 50),
    }));

    /* DRAWN candidates */
    const drawn = [];
    const seen = new Set();
    const push = (el, kind, note) => {
      if (seen.has(el)) return;
      seen.add(el);
      const r = el.getBoundingClientRect();
      drawn.push({
        kind,
        note,
        aria: (el.getAttribute("aria-label") || "").slice(0, 60),
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute("class") || "").slice(0, 60),
        idea: el.closest("[data-idea]")?.getAttribute("data-idea") ?? null,
        box: [Math.round(r.width), Math.round(r.height)],
      });
    };
    for (const el of document.querySelectorAll('[role="img"]')) push(el, "role=img", "");
    for (const el of document.querySelectorAll("[style]")) {
      const s = el.getAttribute("style") || "";
      if (/(^|;)\s*(width|height)\s*:\s*[\d.]+(%|px)/.test(s)) {
        const cls = el.getAttribute("class") || "";
        if (/bg-|border|rounded/.test(cls)) push(el, "sized-fill", s.slice(0, 60));
      }
    }
    for (const el of document.querySelectorAll("svg")) {
      const n = el.querySelectorAll("rect,circle,line,polyline,path,ellipse").length;
      if (n >= 2) push(el, "svg", `${n} shapes`);
    }

    /* FLAGS */
    const flags = [...document.querySelectorAll("img, svg")]
      .filter((el) => {
        const a = [
          el.getAttribute("src") || "",
          el.getAttribute("class") || "",
          el.getAttribute("aria-label") || "",
          el.getAttribute("alt") || "",
        ];
        return a.some((x) => /flag/i.test(x)) || /\/flags\//i.test(el.getAttribute("src") || "");
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const wrap = el.parentElement;
        return {
          w: Math.round(r.width * 10) / 10,
          h: Math.round(r.height * 10) / 10,
          radius: Math.round(maxR(s) * 100) / 100,
          wrapRadius: wrap ? Math.round(maxR(getComputedStyle(wrap)) * 100) / 100 : 0,
          border: s.borderTopWidth + " " + s.borderTopColor,
          cls: (el.getAttribute("class") || "").slice(0, 80),
        };
      });
    const flagAgg = {};
    for (const f of flags) {
      const k = `${f.w}x${f.h} r=${f.radius} wrapR=${f.wrapRadius} border=${f.border}`;
      flagAgg[k] = (flagAgg[k] || 0) + 1;
    }

    /* TYPE, everything above 15px */
    const big = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const done = new Set();
    let n;
    while ((n = walk.nextNode())) {
      const t = (n.textContent || "").trim();
      if (!t) continue;
      const el = n.parentElement;
      if (!el || done.has(el)) continue;
      done.add(el);
      const s = getComputedStyle(el);
      const fs = parseFloat(s.fontSize);
      if (fs < 15) continue;
      const m = txt(el);
      big.push({
        fs: Math.round(fs * 10) / 10,
        lh: s.lineHeight,
        wt: s.fontWeight,
        fam: s.fontFamily.split(",")[0].replace(/["']/g, ""),
        color: s.color,
        textW: m.w,
        colW: Math.round(el.getBoundingClientRect().width),
        text: t.slice(0, 46),
      });
    }

    /* SKELETON: top-level structure inside <article> */
    const art = document.querySelector("article");
    const skeleton = art
      ? [...art.children].map((c) => {
          const r = c.getBoundingClientRect();
          return {
            tag: c.tagName.toLowerCase(),
            cls: (c.getAttribute("class") || "").slice(0, 46),
            box: [Math.round(r.width), Math.round(r.height)],
            kids: c.children.length,
          };
        })
      : [];
    const sections = [...document.querySelectorAll("article section")].map((s) => {
      const r = s.getBoundingClientRect();
      const grid = s.querySelector("[class*='grid']");
      const gs = grid ? getComputedStyle(grid) : null;
      return {
        h2: s.querySelector("h2")?.textContent?.trim() ?? "",
        tiles: grid ? grid.children.length : 0,
        cols: gs ? gs.gridTemplateColumns : "",
        box: [Math.round(r.width), Math.round(r.height)],
      };
    });

    /* TILES: one sample tile's geometry, and the count of tiles that carry a
       second line vs those that do not. */
    const tiles = [...document.querySelectorAll("article section a")];
    let withSecond = 0;
    let benchLine = 0;
    let cityLine = 0;
    for (const a of tiles) {
      const spans = a.querySelectorAll("span > span");
      if (spans.length > 1) withSecond++;
      const t = a.textContent || "";
      if (/benchmark/.test(t)) benchLine++;
      else if (/citie|city/.test(t)) cityLine++;
    }
    const t0 = tiles[0];
    const tileBox = t0 ? (() => { const r = t0.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; })() : null;

    return {
      declared,
      drawn,
      flags: { count: flags.length, shapes: flagAgg },
      big: big.sort((a, b) => b.fs - a.fs),
      skeleton,
      sections,
      tiles: { total: tiles.length, withSecond, benchLine, cityLine, tileBox },
      pageH: Math.round(document.documentElement.scrollHeight),
    };
  });

  console.log(`\n================ ${slug} at ${w} ================`);
  console.log(`page height ${out.pageH}`);
  console.log(`DECLARED: ${out.declared.length}`, JSON.stringify(out.declared));
  console.log(`DRAWN candidates: ${out.drawn.length}`);
  for (const d of out.drawn) console.log(`   ${d.idea ? "[" + d.idea + "]" : "[UNDECLARED]"} ${d.kind} <${d.tag}> ${d.box.join("x")} "${d.aria}" ${d.cls} ${d.note}`);
  console.log(`FLAGS: ${out.flags.count}`);
  for (const [k, v] of Object.entries(out.flags.shapes)) console.log(`   ${v} x  ${k}`);
  console.log(`TYPE above 15px: ${out.big.length}`);
  for (const t of out.big) console.log(`   ${t.fs}px lh=${t.lh} wt=${t.wt} ${t.fam} ${t.color} textW=${t.textW} colW=${t.colW} "${t.text}"`);
  console.log(`SKELETON:`);
  for (const s of out.skeleton) console.log(`   <${s.tag}> ${s.box.join("x")} kids=${s.kids} ${s.cls}`);
  console.log(`SECTIONS:`);
  for (const s of out.sections) console.log(`   "${s.h2}" tiles=${s.tiles} ${s.box.join("x")} cols=${s.cols}`);
  console.log(`TILES: total=${out.tiles.total} withSecondLine=${out.tiles.withSecond} benchmarks=${out.tiles.benchLine} cities=${out.tiles.cityLine} sample=${out.tiles.tileBox}`);
  await p.close();
}
await b.close();
