/**
 * scripts/lib/design_linter.mjs , THE DESIGN LINTER, one implementation.
 *
 * Extracted from audit_mockup.mjs so the same judgement runs against two
 * surfaces and can never drift between them:
 *
 *   scripts/audit_mockup.mjs          file:// mockups          (the frozen spec)
 *   scripts/verify_rendered_design.mjs  http:// rendered routes (the React port)
 *
 * The port is only worth anything if the rendered page is held to the standard
 * the mockups were beaten into. Two copies of these rules would diverge inside a
 * week, and the second country would quietly reintroduce every defect the design
 * run removed. So: one INPAGE function, two drivers.
 *
 * Everything in INPAGE needs real layout, which is the whole point: none of it
 * can be established by reading markup or JSX.
 *
 * INPAGE is serialised into the browser by Playwright, so it must stay
 * SELF-CONTAINED: no closure over module scope, no imports, every constant
 * declared inside it. Adding a module-level helper and calling it from INPAGE
 * will throw "x is not defined" inside the page, not at build time.
 *
 * Severity model (shared, so both drivers rank identically):
 *   BLOCKER  ships broken: overflow, unfilled render target, JS error,
 *            AA contrast failure, dead link, banned language.
 *   MAJOR    ships ugly or misleading: dead space, accent inflation, a
 *            decorative figure outranking the answer, four sections in one shape.
 *   MINOR    polish: glyph over-reuse, duplicated figures, long copy.
 */
import { existsSync } from "node:fs";

export const SEVERITY_RANK = { BLOCKER: 0, MAJOR: 1, MINOR: 2 };
export const SEVERITIES = ["BLOCKER", "MAJOR", "MINOR"];

/** Count findings by severity. */
export function tally(findings) {
  const t = { BLOCKER: 0, MAJOR: 0, MINOR: 0 };
  for (const f of findings) if (t[f.sev] !== undefined) t[f.sev]++;
  return t;
}

/** The ranked, human-readable block both drivers print per surface. */
export function formatReport(report, title) {
  const by = tally(report.findings);
  const lines = [];
  lines.push(
    `\n${"=".repeat(74)}\n${title}   ${report.stats?.docHeight ?? "?"}px   ` +
      `${by.BLOCKER} blocker / ${by.MAJOR} major / ${by.MINOR} minor\n${"=".repeat(74)}`,
  );
  report.findings
    .slice()
    .sort((a, b) => SEVERITY_RANK[a.sev] - SEVERITY_RANK[b.sev] || a.code.localeCompare(b.code))
    .forEach((f) => {
      lines.push(
        `  ${f.sev.padEnd(7)} ${f.code.padEnd(18)} ${String(f.section).padEnd(34).slice(0, 34)} ${f.msg}`,
      );
      if (f.chapters) f.chapters.forEach((c) => lines.push(`${" ".repeat(64)}- ${c}`));
      if (f.links) f.links.slice(0, 8).forEach((c) => lines.push(`${" ".repeat(64)}- ${c}`));
    });
  return lines.join("\n");
}

/** The one Chrome resolution both drivers use. Returns null if none found. */
export function findChrome() {
  if (process.env.CHROME_EXE && existsSync(process.env.CHROME_EXE)) return process.env.CHROME_EXE;
  for (const c of [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
  ]) if (c && existsSync(c)) return c;
  return null;
}

/* ===========================================================================
   The in-page pass.
   =========================================================================== */
export const INPAGE = () => {
  const F = [];
  const add = (sev, code, section, msg, data) => F.push({ sev, code, section, msg, ...(data || {}) });
  const px = (n) => Math.round(n);

  /* ---- section index: everything is reported against a chapter ----
     The mockups wrap their chapters in .wrap > section. A rendered route may
     have no .wrap and no <section> at all (the component catalogs do not), so
     the index degrades: .wrap -> main -> body, sections -> any <section> in the
     subtree -> the page as one block. It must never throw, because a linter
     that crashes on an unfamiliar shape is a linter that silently stops
     guarding the pages it was written for. */
  const root =
    document.querySelector(".wrap") || document.querySelector("main") || document.body;
  let blocks = [...root.children].filter((n) => /^(SECTION|HEADER|FOOTER)$/.test(n.tagName));
  if (!blocks.length) blocks = [...root.querySelectorAll("section")];
  if (!blocks.length) blocks = [root];
  const secs = blocks.map((el, i) => {
    const num = el.querySelector(".chnum");
    const h = el.querySelector("h1,h2,h3");
    const r = el.getBoundingClientRect();
    return {
      i, el,
      id: num ? num.textContent.trim() : (el.tagName === "HEADER" ? "mast" : el.tagName === "FOOTER" ? "foot" : el === root ? "page" : "hero"),
      name: h ? h.textContent.trim().replace(/\s+/g, " ").slice(0, 52) : el.tagName.toLowerCase(),
      top: r.top + scrollY, height: r.height,
    };
  });
  const secOf = (el) => {
    const s = secs.find((s) => s.el.contains(el));
    return s ? `${s.id} ${s.name}` : "?";
  };

  /* ---- colour helpers: composite rgba up the ancestor chain ---- */
  const parse = (c) => {
    const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(c || "");
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const PAPER = { r: 247, g: 247, b: 248, a: 1 };
  function bgOf(el) {
    /* Walks THROUGH documentElement: the mockups paint the paper on <html>
       (html{background:var(--paper)}), and so does the app shell. Stopping at
       body made every measurement fall back to the hard-coded PAPER constant,
       which is right for the mockups by luck and wrong for anything else. */
    let stack = [], n = el, gradient = false;
    while (n) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") gradient = true;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      n = n.parentElement;
    }
    let base = PAPER;
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return { colour: base, gradient };
  }

  /* =====================================================================
     1. AA CONTRAST. White text on n3 or lighter is a legibility bug by
        construction, and the palette makes it easy to do by accident.
     ===================================================================== */
  /* Grouped by the COLOUR PAIR that fails, not by the element. Sixty rows
     saying "--muted on white" is one token decision, and a loop fed sixty
     near-identical blockers spends the night on symptoms. */
  let skippedGradient = 0;
  const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const cGroups = new Map();
  for (const el of document.querySelectorAll("body *")) {
    if (el.children.length && ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const text = (el.textContent || "").trim();
    if (!text || text.length > 220) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.opacity === "0" || cs.display === "none") continue;
    const fg = parse(cs.color); if (!fg) continue;
    const { colour: bg, gradient } = bgOf(el);
    if (gradient) { skippedGradient++; continue; }
    const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const got = ratio(over(fg, bg), bg);
    if (got >= need) continue;
    const key = `${hex(over(fg, bg))}|${hex(bg)}|${large ? "L" : "N"}`;
    if (!cGroups.has(key)) cGroups.set(key, { fg: hex(over(fg, bg)), bg: hex(bg), got, need, n: 0, where: new Set(), sizes: new Set() });
    const g = cGroups.get(key);
    g.n++; g.where.add(secOf(el)); g.sizes.add(`${px(size)}/${weight}`);
    if (text.length < 30) g.samples = [...new Set([...(g.samples || []), text])].slice(0, 4);
  }
  for (const g of [...cGroups.values()].sort((a, b) => a.got - b.got)) {
    // a near-miss is a token nudge; a third of the requirement is unreadable
    const sev = g.got < g.need * 0.75 ? "BLOCKER" : "MAJOR";
    add(sev, "CONTRAST", [...g.where][0] + (g.where.size > 1 ? ` +${g.where.size - 1} more` : ""),
      `${g.fg} on ${g.bg} = ${g.got.toFixed(2)}:1, needs ${g.need}:1 , ${g.n} places, ${[...g.sizes].join(" ")}` +
      (g.samples ? `  eg "${g.samples.join('", "')}"` : ""),
      { fg: g.fg, bg: g.bg, got: +g.got.toFixed(2), need: g.need, count: g.n, sections: [...g.where] });
  }

  /* =====================================================================
     2. DEAD SPACE. The founder's repeated complaint. Two shapes: slack at
        the bottom of a card, and a gap in the middle where margin-top:auto
        collects the slop.
     ===================================================================== */
  const CARDS = ".panel, .glass, .calc, .take, .eight, .readcol, .ledger, .method, .qa, .band, .statcluster";
  for (const card of document.querySelectorAll(CARDS)) {
    const cs = getComputedStyle(card);
    const r = card.getBoundingClientRect();
    if (r.height < 80) continue;
    const padB = parseFloat(cs.paddingBottom) || 0, padT = parseFloat(cs.paddingTop) || 0;
    const kids = [...card.children].map((k) => k.getBoundingClientRect()).filter((k) => k.height > 0 || k.width > 0);
    if (!kids.length) continue;
    const contentBottom = Math.max(...kids.map((k) => k.bottom));
    const slack = r.bottom - padB - contentBottom;
    if (slack > 56) {
      add("MAJOR", "VOID-BOTTOM", secOf(card),
        `${px(slack)}px of empty card below the last element (card ${px(r.height)}px, padding ${px(padB)}px)`,
        { slack: px(slack) });
    }
    const sorted = kids.slice().sort((a, b) => a.top - b.top);
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i].top - sorted[i - 1].bottom;
      if (gap > 90) {
        add("MAJOR", "VOID-MIDDLE", secOf(card),
          `${px(gap)}px gap inside a card between two elements`, { gap: px(gap) });
        break;
      }
    }
  }

  /* =====================================================================
     3. TERRACOTTA DISCIPLINE. It marks the answer. Once a section holds
        several accents it marks nothing. Counted as painted marks, not
        as source mentions, so hover rules and defaults are both caught.
     ===================================================================== */
  const isTerra = (c) => { const p = parse(c); return p && p.a > 0.35 && p.r > 130 && p.r - p.b > 45 && p.g < p.r - 40; };
  for (const s of secs) {
    if (s.id === "mast" || s.id === "foot") continue;
    const marks = [];
    for (const el of s.el.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) continue;
      const cs = getComputedStyle(el);
      const own = (el.textContent || "").trim();
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (hasText && isTerra(cs.color)) marks.push(`text:${own.slice(0, 18)}`);
      else if (!hasText && r.width * r.height > 220 && isTerra(cs.backgroundColor)) marks.push(`fill:${el.className || el.tagName}`.slice(0, 26));
    }
    // chapter number + rule are chrome, not data: allow two before counting
    const n = marks.length - 2;
    if (n > 6) add("MAJOR", "ACCENT-INFLATION", `${s.id} ${s.name}`,
      `${n} terracotta marks in one chapter, so none of them reads as the answer`, { count: n, sample: marks.slice(0, 8) });
  }

  /* =====================================================================
     4. VISUAL HIERARCHY. Inside a chapter, the biggest figure should be
        the answer. A decorative number set larger than the answer inverts
        the read.
     ===================================================================== */
  for (const s of secs) {
    if (s.id === "mast" || s.id === "foot") continue;
    const figs = [...s.el.querySelectorAll(".fig, .num, .v, .n, .big, .rn")]
      .map((el) => ({ el, size: parseFloat(getComputedStyle(el).fontSize), t: (el.textContent || "").trim().slice(0, 20), terra: isTerra(getComputedStyle(el).color) }))
      .filter((f) => f.t && f.size >= 18)
      .sort((a, b) => b.size - a.size);
    if (figs.length >= 2 && figs[0].size - figs[1].size < 2 && figs[0].size >= 26) {
      add("MINOR", "HIERARCHY-TIE", `${s.id} ${s.name}`,
        `two figures compete at the same size (${px(figs[0].size)}px): "${figs[0].t}" and "${figs[1].t}"`);
    }
    if (figs.length && !figs[0].terra && figs.some((f) => f.terra && f.size < figs[0].size - 6)) {
      add("MAJOR", "HIERARCHY-INVERTED", `${s.id} ${s.name}`,
        `the biggest figure "${figs[0].t}" (${px(figs[0].size)}px) is not the marked answer; the accent sits on a smaller one`);
    }
  }

  /* =====================================================================
     5. COHESION. Four chapters in one shape is the "page stops changing"
        defect. Fingerprint each chapter by its layout + component set.
     ===================================================================== */
  const VOCAB = ["statblock", "panel", "col-split", "roster", "ranked", "tiles", "eight", "readcol", "spec",
    "scale", "range", "worlds", "ctl", "late", "voices", "drain", "myth", "tang", "dwindle", "matrix",
    "tline", "quad", "reach", "hexwrap", "seasonband", "touryear", "hoodcards", "trendrow", "lensgrid",
    "wealth", "archetypes", "calc", "method", "defs", "qa", "ledger", "strip", "mini", "year", "band", "take", "sbar", "dots"];
  const fp = secs.map((s) => {
    if (s.id === "mast" || s.id === "foot") return null;
    const grid = s.el.querySelector(".grid");
    const g = grid ? [...grid.classList].find((c) => /^g\d/.test(c)) || "grid" : "flat";
    const comps = VOCAB.filter((v) => s.el.querySelector("." + v.replace(/ /g, ".")));
    return { s, sig: g + "|" + comps.sort().join(",") };
  });
  let run = [];
  const flushRun = () => {
    if (run.length >= 3) {
      add("MAJOR", "SHAPE-REPEAT", `${run[0].s.id}..${run[run.length - 1].s.id}`,
        `${run.length} consecutive chapters in an identical shape (${run[0].sig}); the page stops changing form`,
        { chapters: run.map((r) => `${r.s.id} ${r.s.name}`) });
    }
    run = [];
  };
  for (const f of fp) {
    if (!f) { flushRun(); continue; }
    if (run.length && run[run.length - 1].sig === f.sig) run.push(f);
    else { flushRun(); run = [f]; }
  }
  flushRun();

  /* =====================================================================
     6. LINKS. A dead href on a page whose whole product is the lattice.
        M2 in the port contract: a control that DOES something is a button,
        so href="#" is never the right answer in the port either.
     ===================================================================== */
  const links = [...document.querySelectorAll("a[href]")].map((a) => ({
    href: a.getAttribute("href"),
    text: (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
    section: secOf(a),
  }));
  const dead = links.filter((l) => l.href === "#" || l.href === "");
  if (dead.length) add("BLOCKER", "DEAD-LINK", dead[0].section,
    `${dead.length} links go nowhere (href="#")`, { links: dead.map((d) => `${d.section} :: ${d.text}`) });

  /* =====================================================================
     7. RENDER TARGETS + ERRORS the eye would miss
     ===================================================================== */
  /* An element can be empty because its renderer never ran, or because it IS
     the mark: a drawn baseline, a rule, a bar. The first is a bug, the second
     is the design. Distinguish by whether the element paints anything.

     Two things are never render targets, and on a rendered React route the
     framework emits both on every page: machinery (script, template, style,
     the streaming <script id="_R_">, the analytics tag) and deliberately
     hidden nodes (React's <div hidden id="S:0"> suspense buffers). Reporting
     them would paint every route permanently red for something no author can
     fix, which is how a gate gets switched off. */
  const emptyTargets = [...document.querySelectorAll("[id]")]
    .filter((el) => {
      if (el.children.length || el.textContent.trim()) return false;
      if (/^(INPUT|BUTTON|SVG|IMG|BR|HR|CANVAS|SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT|META|TITLE|BASE|IFRAME|SLOT)$/.test(el.tagName)) return false;
      if (el.hidden) return false;
      const csv = getComputedStyle(el);
      if (csv.display === "none" || csv.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      if (r.width * r.height === 0) return true;          // occupies nothing: never rendered
      const cs = getComputedStyle(el);
      const pseudo = ["::before", "::after"].some((p) => {
        const c = getComputedStyle(el, p).content;
        return c && c !== "none" && c !== "normal";
      });
      const painted = pseudo
        || (cs.backgroundColor && !/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(cs.backgroundColor))
        || (cs.backgroundImage && cs.backgroundImage !== "none")
        || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0;
      return !painted;                                     // paints nothing and holds nothing
    })
    .map((el) => "#" + el.id);
  for (const t of emptyTargets) {
    /* CSS.escape keeps a React-generated id with a colon in it (":r0:") from
       throwing an invalid-selector error and killing the whole pass. */
    const sel = "#" + CSS.escape(t.slice(1));
    add("BLOCKER", "EMPTY-TARGET", secOf(document.querySelector(sel)), `${t} was never filled by its renderer`);
  }

  const doc = document.documentElement;
  if (doc.scrollWidth > doc.clientWidth + 1) {
    const culprits = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > doc.clientWidth + 1 || r.left < -1)) culprits.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().slice(0, 40)}`);
    }
    add("BLOCKER", "OVERFLOW", "page",
      `document is ${doc.scrollWidth}px wide in a ${doc.clientWidth}px viewport`, { culprits: culprits.slice(0, 6) });
  }

  /* =====================================================================
     8. BANNED LANGUAGE, from the RENDERED text, so entities cannot hide.
        verify_lattice reads source and misses &mdash;.
     ===================================================================== */
  const body = document.body.innerText;
  const BAN = [[/\bturnover\b/i, "turnover (use revenue)"], [/\bcovers\b/i, "covers (use orders)"],
    [/\bpercentage points?\b/i, "percentage points (use %)"], [/\bpp\b/, "pp (use %)"],
    [/\bnet margin\b/i, "net margin (use what the owner keeps)"], [/—/, "em-dash"]];
  for (const [re, label] of BAN) {
    const m = re.exec(body);
    if (m) {
      const at = body.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, " ");
      add("BLOCKER", "LANGUAGE", "page", `renders ${label}  ...${at}...`);
    }
  }

  /* =====================================================================
     9. BLOAT + REPETITION, the cheap MINORs that add up
     ===================================================================== */
  const tallyGlyphs = {};
  document.querySelectorAll("[data-ico]").forEach((el) => {
    const k = el.getAttribute("data-ico"); tallyGlyphs[k] = (tallyGlyphs[k] || 0) + 1;
  });
  Object.entries(tallyGlyphs).filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1]).forEach(([k, n]) =>
    add("MINOR", "GLYPH-REUSE", "page", `"${k}" is used ${n} times, so it distinguishes nothing`, { glyph: k, count: n }));

  const figs = {};
  document.querySelectorAll(".fig, .v, .n, .num").forEach((el) => {
    const t = (el.textContent || "").trim();
    if (/^[$−-]?[\d.,]+[KMB%]?$/.test(t) && t.length > 1) figs[t] = (figs[t] || 0) + 1;
  });
  Object.entries(figs).filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([k, n]) =>
    add("MINOR", "FIGURE-REPEAT", "page", `"${k}" is printed ${n} times; a reader cannot tell which one is the point`));

  for (const p of document.querySelectorAll("p.note, p.texture")) {
    const t = (p.textContent || "").trim();
    if (t.length > 340) add("MINOR", "COPY-LONG", secOf(p), `${t.length} characters of prose in one note; the visual should carry it`);
  }

  return {
    findings: F,
    stats: {
      docHeight: doc.scrollHeight, sections: secs.length,
      glyphs: document.querySelectorAll("[data-ico]").length,
      links: links.length, deadLinks: dead.length,
      contrastSkippedGradient: skippedGradient,
      linkGraph: [...new Set(links.map((l) => l.href))].sort(),
    },
  };
};
