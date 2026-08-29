#!/usr/bin/env node
/**
 * build_section_dossier , THE EVIDENCE FOR ONE CRITIQUE ROUND.
 *
 * Enumerates every SECTION and every SUBSECTION across the seven pages a visitor
 * can actually reach (four rebuilt spine types plus the three live legacy routes:
 * home, the countries list, the GB country page), and across the country page
 * being rebuilt behind a shut flag, gathers the evidence each of the nine
 * critique dimensions needs, and captures each node as a picture at three
 * magnifications. Writes one dossier the critique sheet renders and the round
 * record is scored against.
 *
 * THE LEGACY THREE HAVE NO SPINE MARKUP. The four rebuilt pages carry glass
 * cards (backdrop-filter) as their section unit, and subsections fall out of a
 * card's direct children. Home, the countries list and the GB country page were
 * never rebuilt to that kit: their sections are plain `<section>`/`<article>`/
 * `<nav>` landmarks with backdrop-filter computing to none, so the card query
 * returns zero and harvest() falls back to walking those landmarks instead. See
 * the LEGACY PAGE FALLBACK block below for how a band is chosen and why
 * subsections are not attempted for these three.
 *
 * WHY SUBSECTIONS. Every previous round judged outermost cards and nothing else.
 * A card can pass while the labelled block inside it has no hierarchy, its own
 * spacing puddle and an icon that means nothing. That is where the work now is,
 * and it has never been looked at.
 *
 * WHY THREE MAGNIFICATIONS. At actual size a two-pixel wrongness is
 * indistinguishable from an intention: a chart line that stopped short of its own
 * last point survived months because truncation reads as a curve flattening out.
 * 1280 is the judging width, 375 is where scaling faults show, 3x is where
 * strokes, caps and hairlines confess.
 *
 * WHAT THIS DOES NOT DO. It does not judge. Every field is a measurement or a
 * capture, because a dossier that pre-judges is a dossier that argues with the
 * person reading it. The nine verdicts are recorded separately, against this.
 *
 * IT RUNS ITS OWN BROWSER rather than the shared page helper, because it needs a
 * device scale factor per capture and the helper takes one viewport. That is a
 * deliberate divergence, noted so the next person does not "fix" it.
 *
 * Usage:
 *   node scripts/build_section_dossier.mjs [--no-crops] [--page <slug>]
 * Writes:
 *   design/critique/dossier-<date>.json
 *   design/critique/crops/<node>-{1280,375,zoom}.png
 */
import { writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { chromium } from "playwright";

const OUT_DIR = "E:/atlas/design/critique";
const CROP_DIR = `${OUT_DIR}/crops`;
/* The seven a visitor can walk, plus `country-gb-new`, the country page being
   rebuilt behind a shut flag. It is captured from its first section rather than
   after its last: a section nobody has photographed is a section nobody has
   judged, and this rebuild replaces a page whose faults were all found in
   pictures. It renders as a spine page (glass cards), so it takes the same
   branch the four rebuilt types take, not the legacy landmark walk. */
const PAGES = [
  "city-london", "cell-london-restaurants", "industry-restaurants", "hood-london",
  "home", "countries-list", "country-gb", "country-gb-new",
];
const argv = process.argv.slice(2);
const CROPS = !argv.includes("--no-crops");
/* Comma-separated: a targeted run that crops two pages in one pass exists
   because the crops directory is wiped per run, and a run for page A used to
   silently delete page B's crops (it cost the review sheet its legacy
   photographs on 2026-08-30). */
const ONLY = argv.includes("--page") ? argv[argv.indexOf("--page") + 1].split(",") : null;

const DATE = new Date().toISOString().slice(0, 10);

/* Runs inside the page. Nothing from this scope is visible to it. */
function harvest() {
  const TERRA = ["rgb(251, 132, 105)", "rgb(194, 65, 12)"];
  const px = (v) => Math.round(parseFloat(v) * 10) / 10;
  const seen = new Set();

  function inDead(el) {
    const d = el.closest("details");
    return !!d && !d.open && !el.closest("summary");
  }

  /* A LABEL IS THE THING THAT STARTS A SUBSECTION. Micro or small type, uppercase
     or a real heading tag, carrying its own text. This is how the pages actually
     mark an inner block; there is no attribute to read. */
  function isLabel(el) {
    if (/^H[2-6]$/.test(el.tagName)) return true;
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize);
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own || size > 13) return false;
    return s.textTransform === "uppercase" && parseFloat(s.letterSpacing) > 0.3;
  }

  function measure(node, kind, path) {
    const b = node.getBoundingClientRect();
    if (b.width < 20 || b.height < 20) return null;

    const sizes = new Map();
    const weights = new Map();
    let prose = 0;
    let inkCount = 0, mutedCount = 0, accentCount = 0;
    let largestText = { size: 0, text: "" };
    const tags = new Map();
    const marks = [];
    let ariaLabelled = 0;

    for (const e of node.querySelectorAll("*")) {
      if (inDead(e)) continue;
      tags.set(e.tagName, (tags.get(e.tagName) || 0) + 1);
      if (e.getAttribute("aria-label") || e.getAttribute("role") === "img") ariaLabelled++;

      const s = getComputedStyle(e);
      const own = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(" ");
      const eb = e.getBoundingClientRect();

      if (own && eb.width > 0) {
        const size = px(s.fontSize);
        sizes.set(size, (sizes.get(size) || 0) + 1);
        weights.set(s.fontWeight, (weights.get(s.fontWeight) || 0) + 1);
        if (size > largestText.size) largestText = { size, text: own.slice(0, 44) };
        if (own.length >= 30 && /\s/.test(own)) prose += own.length;
        if (TERRA.includes(s.color)) accentCount++;
        else if (/rgb\(1[0-9]{2}|rgb\(2[0-9]{2}/.test(s.color) && !/rgb\(2[0-5]{2}, 2[0-5]{2}/.test(s.color)) mutedCount++;
        else inkCount++;
      }

      /* A drawn mark: a small painted element or an svg shape. AN ICON GLYPH IS
         CHROME, NOT A MARK , its paths are decoration inside a fourteen-pixel
         tile and counting them made a bare heading row report three data marks,
         one of them accented. The same exclusion the accent counter needed. */
      if (e.closest("svg.ma-glyph, .spine-ic")) continue;
      const painted = s.backgroundColor !== "rgba(0, 0, 0, 0)" && !own && !e.children.length;
      const svgShape = e.namespaceURI === "http://www.w3.org/2000/svg" && /^(rect|circle|path|line)$/.test(e.tagName);
      if ((painted || svgShape) && eb.width >= 1 && eb.height >= 1) {
        marks.push({
          tag: e.tagName.toLowerCase(),
          w: Math.round(eb.width * 10) / 10,
          h: Math.round(eb.height * 10) / 10,
          accent: TERRA.includes(s.backgroundColor) || TERRA.includes(s.fill) || TERRA.includes(s.stroke),
        });
      }
    }

    /* The vertical rhythm: gaps between direct children, in order. */
    const gaps = [];
    const kids = [...node.children].filter((k) => {
      const kb = k.getBoundingClientRect();
      return kb.height > 0 && kb.width > 0;
    });
    for (let i = 1; i < kids.length; i++) {
      const prev = kids[i - 1].getBoundingClientRect();
      const cur = kids[i].getBoundingClientRect();
      const g = Math.round((cur.top - prev.bottom) * 10) / 10;
      if (g >= 0 && g < 200) gaps.push(g);
    }
    const cs = getComputedStyle(node);

    /* THE ICON'S IDENTITY, NOT ITS CLASS NAME. Every glyph carries the same two
       classes, so reading className told us nothing and would have made D7's
       "could this be swapped with its neighbour" unanswerable. The signature is
       the geometry: the first path commands, rounded, which is stable across
       renders and differs between glyphs. */
    const glyph = node.querySelector("svg.ma-glyph, .spine-ic svg");
    let iconId = null;
    if (glyph) {
      const named = glyph.getAttribute("data-icon") || glyph.getAttribute("data-id");
      if (named) iconId = named;
      else {
        const d = [...glyph.querySelectorAll("path, circle, rect, line")]
          .map((s2) => (s2.getAttribute("d") || `${s2.tagName}${s2.getAttribute("cx") || ""}${s2.getAttribute("x") || ""}`))
          .join("|");
        let hash = 0;
        for (let k = 0; k < d.length; k++) hash = (hash * 31 + d.charCodeAt(k)) | 0;
        iconId = "glyph#" + (hash >>> 0).toString(36);
      }
    }

    const rail = node.querySelector("h2, h3, [class*=rail]");
    const heading = ((rail && rail.textContent) || "").trim().replace(/\s+/g, " ").slice(0, 60);

    /* Sentences, for the copy dimension. */
    const text = (node.textContent || "").replace(/\s+/g, " ").trim();
    const sentences = text.split(/(?<=[.?!])\s+/).filter((x) => x.length > 24 && /\s/.test(x)).map((x) => x.slice(0, 120));

    return {
      kind, path,
      heading,
      w: Math.round(b.width), h: Math.round(b.height),
      typeSizes: [...sizes.entries()].sort((a, c) => c[0] - a[0]).map(([s, n]) => ({ px: s, n })),
      weights: [...weights.entries()].sort().map(([w, n]) => ({ w, n })),
      largestText,
      prose,
      colour: { ink: inkCount, muted: mutedCount, accent: accentCount },
      tags: Object.fromEntries([...tags.entries()].sort((a, c) => c[1] - a[1]).slice(0, 14)),
      semantic: {
        realTable: (tags.get("TABLE") || 0) > 0,
        realList: (tags.get("UL") || 0) + (tags.get("OL") || 0) > 0,
        headings: ["H2", "H3", "H4", "H5"].filter((t) => tags.get(t)).join(",") || "none",
        divs: tags.get("DIV") || 0,
        ariaLabelled,
      },
      marks: { n: marks.length, accent: marks.filter((m) => m.accent).length, sizes: [...new Set(marks.map((m) => Math.min(m.w, m.h)))].sort((a, c) => a - c).slice(0, 8) },
      spacing: {
        gaps,
        distinctGaps: [...new Set(gaps)].sort((a, c) => a - c),
        padTop: px(cs.paddingTop), padBottom: px(cs.paddingBottom),
        padLeft: px(cs.paddingLeft), padRight: px(cs.paddingRight),
      },
      icon: iconId,
      /* WHAT THIS CAMERA CANNOT SEE, SAID OUT LOUD.
         The pages are photographed from server-rendered markup with no script of
         any kind, so a chart that draws itself in the browser leaves an empty box
         behind and this instrument photographs the box. On 2026-08-26 that
         produced TWELVE findings against one card of the trade page , the form is
         absent, the card is empty, nothing rendered to inspect , and every one of
         them was false. The card draws correctly for a real visitor: a six-step
         waterfall from a hundred dollars of sales down to what the owner keeps,
         confirmed on the live site.
         The failure was not the blindness. It was that a blind spot and a real
         hole looked identical in the output, which is the shape of mistake this
         project keeps paying for. A node holding an unfilled runtime chart now
         says so, and says how many, so no future round can mistake one for the
         other. */
      runtimeChartsUnrendered: [...node.querySelectorAll(".recharts-responsive-container")]
        .filter((c) => c.children.length === 0).length,
      sentences,
      box: { x: b.left + window.scrollX, y: b.top + window.scrollY, w: b.width, h: b.height },
    };
  }

  const out = [];

  /* LEGACY PAGE FALLBACK, keyed on structure, never on slug. The four rebuilt
     pages are bare spine bodies with no site chrome around them; the three live
     routes wrap in <SiteChrome>, which is <header> and <footer>. That wrap is
     the tell, not an empty card query: home.html DOES have a handful of stray
     `<div class="atlas-card">` panels nested inside its `<section>`s that would
     satisfy the old backdrop-filter query on their own and, read as "found some
     cards", would have sent this page down the spine branch with eleven of its
     twelve sections and its own chrome never seen. */
  const isLegacy = !!document.querySelector("header") && !!document.querySelector("footer");

  if (isLegacy) {
    const isDecor = (el) => el.getAttribute("aria-hidden") === "true";
    const isBand = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 20 && r.height > 20;
    };

    /* The candidate unit is a semantic landmark, not a styled card , these pages
       have no shared card class to lean on, only the tags the markup actually
       uses. `nav` catches the sticky table-of-contents rail beside the country
       page's sections, itself a band a reader sees and scrolls past. */
    const landmarks = [...document.querySelectorAll("header, footer, nav, section, article")]
      .filter((el) => !isDecor(el) && isBand(el));

    const landmarkChildren = (el) => landmarks.filter((o) => o !== el && el.contains(o)
      && !landmarks.some((m) => m !== el && m !== o && el.contains(m) && m.contains(o)));

    /* A LANDMARK THAT IS ALMOST ENTIRELY ITS OWN CHILDREN CARRIES NO BAND OF ITS
       OWN. The countries-list `<article>` is 4046px and 3807 of that is an inner
       `<header>` plus six `<section>`s , descend, or the whole page becomes one
       node, which is the failure this fallback exists to avoid. A single nested
       landmark is a different shape: a lens table nested inside its own country
       section is 338 of that section's 452px, and descending there would cut a
       real band in half rather than unwrap a see-through layout div. Two or more
       nested landmarks covering most of the parent is the wrapper signature;
       one nested landmark never is. */
    const bands = [];
    const visit = (el) => {
      const kids = landmarkChildren(el);
      const ownH = el.getBoundingClientRect().height;
      const kidsH = kids.reduce((a, k) => a + k.getBoundingClientRect().height, 0);
      if (kids.length >= 2 && kidsH >= ownH * 0.75) { kids.forEach(visit); return; }
      bands.push(el);
    };
    landmarks.filter((el) => !landmarks.some((o) => o !== el && o.contains(el))).forEach(visit);

    /* A VISIBLE BAND WITH NO SEMANTIC TAG AT ALL, e.g. the newsletter strip
       between main and the footer on all three of these pages. Only direct
       children of body or main qualify, so the layout div that wraps every
       section on the home page is never a candidate here , it CONTAINS a
       landmark and is excluded by `covered` below, leaving the sections inside
       it to be found on their own. */
    const covered = (el) => landmarks.some((l) => el.contains(l) || l.contains(el));
    const divBands = [];
    for (const root of [document.body, document.querySelector("main")]) {
      if (!root) continue;
      for (const el of [...root.children]) {
        if (el.tagName !== "DIV" || isDecor(el) || !isBand(el) || covered(el) || divBands.includes(el)) continue;
        divBands.push(el);
      }
    }

    const ordered = [...bands, ...divBands]
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    /* SUBSECTION DETECTION IS SKIPPED HERE. These pages carry no honest signal
       for it , no rail, no card composed of labelled blocks , so every band
       is kind "section" and nothing is kind "subsection" or "rail". */
    ordered.forEach((el, i) => {
      const sec = measure(el, "section", `${i}`);
      if (!sec) return;
      sec.label = sec.heading || `section ${i}`;
      out.push(sec);
    });
    return out;
  }

  const cards = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).backdropFilter !== "none");
  const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));

  outer.forEach((card, i) => {
    const sec = measure(card, "section", `${i}`);
    if (!sec) return;
    out.push(sec);
    seen.add(card);

    /* SUBSECTIONS ARE THE PARTS A CARD IS COMPOSED OF, not the blocks that labels
       open. Three attempts hunted labels and all three failed, for a reason worth
       keeping: a label sits ABOVE its content in a rail and BELOW it in a stat
       panel, so "the block a label introduces" has no single geometric meaning on
       these pages. Direct children do: a card is a rail plus a series of blocks,
       and those blocks are what a critique round has to look at.
       Single-child wrappers are unwrapped, because a div that exists to hold one
       div is not a part of anything. */
    const unwrap = (el) => {
      let cur = el, guard = 0;
      while (cur && cur.children.length === 1 && guard++ < 6) {
        const only = cur.children[0];
        const a = cur.getBoundingClientRect(), b2 = only.getBoundingClientRect();
        if (Math.abs(a.height - b2.height) > 12) break;
        cur = only;
      }
      return cur;
    };
    let j = 0;
    for (const raw of [...card.children]) {
      const block = unwrap(raw);
      if (!block || seen.has(block) || inDead(block)) continue;
      const bb2 = block.getBoundingClientRect();
      if (bb2.height < 24 || bb2.width < 40) continue;
      if (!(block.textContent || "").trim() && !block.querySelector("svg, [style*=background]")) continue;
      seen.add(block);
      /* A RAIL ROW IS NOT A PART TO CRITIQUE. It is the section's own title and
         icon, already judged as part of the section, and giving it its own nine
         verdicts would spend a third of the round on furniture. It is still
         emitted, because D7 reads the icon off it and a round that cannot see the
         icon cannot judge whether it fits. */
      const isRail = bb2.height < 40 && !!block.querySelector("svg.ma-glyph, .spine-ic");
      const sub = measure(block, isRail ? "rail" : "subsection", `${i}.${j}`);
      if (sub) {
        sub.ofSection = sec.heading;
        sub.ordinal = j + 1;
        sub.label = sub.heading || `${sec.heading || "section " + i} , block ${j + 1}`;
        out.push(sub);
        j++;
      }
    }
    sec.label = sec.heading || `section ${i}`;

    /* The old label walk, kept OFF: see the note above for why it never worked.
       Left as a comment rather than deleted so the fourth attempt does not
       rediscover it. */
    const labels = [];
    const cb = card.getBoundingClientRect();
    for (const l of labels) {
      const lb = l.getBoundingClientRect();
      /* CLIMB TO THE BLOCK THE LABEL INTRODUCES. Taking the label's immediate
         PARENT returned the rail row itself: 1030 by 28, one type size, no
         content, and three "marks" that were the icon's own paths. But requiring
         the parent to be the block instead threw away 57 of 65 subsections,
         because a label commonly sits in its own header row beside a tag. The
         block is the first ancestor meaningfully taller than the label , which is
         the label plus what it introduces , stopping before the card. */
      /* THE TEST IS SEMANTIC, NOT METRIC, and two metric attempts failed first.
         Requiring the parent to be the block threw away 57 of 65. Requiring the
         block to be 24px taller than the label's LINE stopped at the rail row,
         46px of icon tile and heading with nothing under it. A block is the thing
         a label introduces when it CONTAINS something besides the label: a second
         type size, or a drawn mark that is not the icon. */
      /* BELOW THE LABEL, not beside it. Testing the whole block stopped at the
         rail row every time, because a rail carries a sample tag and a tag is a
         painted element. A label introduces what comes AFTER it, so only
         descendants starting at or below the label's baseline count as its body. */
      const carriesBody = (el) => {
        if (!el) return false;
        const floor = l.getBoundingClientRect().bottom - 2;
        for (const e of el.querySelectorAll("*")) {
          if (e.closest("svg.ma-glyph, .spine-ic") || l.contains(e) || e.contains(l)) continue;
          const eb2 = e.getBoundingClientRect();
          if (eb2.top < floor || eb2.width < 2 || eb2.height < 2) continue;
          const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          const st = getComputedStyle(e);
          if (own) return true;
          if (!e.children.length && st.backgroundColor !== "rgba(0, 0, 0, 0)") return true;
          if (e.namespaceURI === "http://www.w3.org/2000/svg" && /^(rect|circle|path|line)$/.test(e.tagName)) return true;
        }
        return false;
      };
      let block = l.parentElement;
      while (block && block !== card && !carriesBody(block)) block = block.parentElement;
      void lb;
      if (!block || block === card || seen.has(block)) continue;
      const bb = block.getBoundingClientRect();
      if (bb.height > cb.height * 0.92) continue;
      seen.add(block);
      const sub = measure(block, "subsection", `${i}.${j}`);
      if (sub) { out.push(sub); j++; }
    }
  });
  return out;
}

async function run() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  /* EMPTIED EVERY RUN. A stale crop that lags the page it depicts is worse than
     no crop, and this project has shipped that twice. */
  if (CROPS) {
    if (existsSync(CROP_DIR)) rmSync(CROP_DIR, { recursive: true, force: true });
    mkdirSync(CROP_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const dossier = { date: DATE, pages: [] };
  const pages = ONLY ? PAGES.filter((p) => ONLY.includes(p)) : PAGES;

  for (const slug of pages) {
    const url = `file:///E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`;
    const rec = { page: slug, nodes: [] };

    for (const [width, tag, dsf] of [[1280, "1280", 1], [375, "375", 1], [1280, "zoom", 3]]) {
      const p = await browser.newPage({ viewport: { width, height: 1100 }, deviceScaleFactor: dsf });
      try {
        await p.goto(url);
        await p.evaluate(() => document.fonts.ready);
        await p.waitForTimeout(450);
        const nodes = await p.evaluate(harvest);

        if (tag === "1280") {
          rec.nodes = nodes.map((n) => ({ ...n, at375: null, box: undefined, _box: n.box }));
        } else if (tag === "375") {
          nodes.forEach((n) => {
            const match = rec.nodes.find((x) => x.path === n.path);
            if (match) {
              match.at375 = {
                w: n.w, h: n.h,
                typeSizes: n.typeSizes.map((t) => t.px),
                markSizes: n.marks.sizes,
                gaps: n.spacing.distinctGaps,
              };
            }
          });
        }

        if (CROPS) {
          /* CLAMP EVERY CLIP INSIDE THE PAGE. A clip whose bottom runs past the
             document's own height is an error, not an empty image, and it killed
             this run twice: the process died mid-capture leaving 185 of 357 crops
             written, and a retry that happened to succeed said nothing about it.
             The page's real extent is read once per width and every clip is cut to
             fit, so a node at the very bottom captures what exists instead of
             asking for what does not. */
          const extent = await p.evaluate(() => ({
            h: document.documentElement.scrollHeight,
            w: document.documentElement.scrollWidth,
          }));
          for (const n of nodes) {
            /* EVERY NODE AT EVERY WIDTH. Skipping the phone capture for subsections
               saved 52 files and cost the sheet 52 broken pictures, which is the
               worse trade: a missing crop is indistinguishable from a section that
               renders nothing. */
            const id = `${slug}-${n.path}`.replace(/[^a-z0-9.-]+/gi, "-");
            const top = Math.max(0, n.box.y - 6);
            const clipH = Math.max(8, Math.min(n.box.h + 12, 1400, extent.h - top));
            await p.screenshot({
              path: `${CROP_DIR}/${id}-${tag}.png`,
              fullPage: true,
              clip: {
                x: Math.max(0, n.box.x - 6),
                y: top,
                width: Math.max(8, Math.min(width, n.box.w + 12, extent.w - Math.max(0, n.box.x - 6))),
                height: clipH,
              },
            });
          }
        }
      } finally {
        await p.close();
      }
    }

    rec.nodes.forEach((n) => { n.box = n._box; delete n._box; });
    dossier.pages.push(rec);
    const subs = rec.nodes.filter((n) => n.kind === "subsection").length;
    const rails = rec.nodes.filter((n) => n.kind === "rail").length;
    console.log(`  ${slug.padEnd(26)} ${rec.nodes.length - subs - rails} sections, ${subs} subsections, ${rails} rails`);
  }

  await browser.close();

  /* IT MUST PROVE ITS OWN OUTPUT BEFORE CLAIMING SUCCESS. This crashed once
     mid-capture on a page-load race and exited non-zero, leaving 185 of 357 crops
     missing; a retry succeeded and said nothing about the first attempt. A run
     that half-writes and a run that fully writes must not look alike, because the
     sheet built on the partial set renders 185 broken pictures and a round judged
     from it would be recording verdicts for nodes nobody could see. */
  if (CROPS) {
    const missing = [];
    for (const p of dossier.pages) {
      for (const n of p.nodes) {
        const id = `${p.page}-${n.path}`.replace(/[^a-z0-9.-]+/gi, "-");
        for (const tag of ["1280", "375", "zoom"]) {
          if (!existsSync(`${CROP_DIR}/${id}-${tag}.png`)) missing.push(`${id}-${tag}`);
        }
      }
    }
    if (missing.length) {
      console.log(`\nx ${missing.length} crop(s) were not written: ${missing.slice(0, 4).join(", ")}`);
      console.log("  The dossier is NOT written. Judging from a partial set is judging what you cannot see.");
      process.exit(1);
    }
  }

  const out = `${OUT_DIR}/dossier-${DATE}.json`;
  writeFileSync(out, JSON.stringify(dossier, null, 1) + "\n", "utf8");
  const total = dossier.pages.reduce((a, p) => a + p.nodes.length, 0);
  console.log(`\n  ${total} nodes across ${dossier.pages.length} pages`);
  /* A BLIND SPOT NOBODY READS IS A BLIND SPOT NOBODY ACTS ON, so it is printed
     beside the node count rather than buried in the file. */
  const blind = dossier.pages.flatMap((p) => p.nodes.filter((n) => (n.runtimeChartsUnrendered || 0) > 0).map((n) => `${p.page}-${n.path}`));
  if (blind.length) {
    console.log(`
  !! ${blind.length} node(s) hold a chart that draws in a browser and NOT in this capture.`);
    console.log("     They look empty here and are not empty for a reader. Do NOT judge them from these crops:");
    console.log(`     ${[...new Set(blind)].slice(0, 8).join(", ")}`);
  }
  console.log(`  wrote ${out}`);
  if (CROPS) console.log(`  crops in ${CROP_DIR} at 1280, 375 and 3x`);
}

run();
