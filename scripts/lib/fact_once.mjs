/**
 * scripts/lib/fact_once.mjs , EACH FACT PRINTS ONCE, READ INSIDE A PAGE (plan 2026-10-12 rhythm-air-inside, Task 1B; spec
 * E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, sections 2.3 and 3 item 2; MODEL 8.2 row 01's M1, "one figure prints
 * once on a page", and PART 9 clause 66, "an obvious thing repeated"). `factOnceInPage` runs inside a page (scripts/harness/check_fact_once.mjs
 * hands it to Playwright; tests/spine/fact_once.test.ts runs it in jsdom), so it reads nothing from this file's scope.
 *
 * A PRINTED FIGURE: a visible element carrying the `fig` class (the kit's Fig, the class the provenance ratchet reads), a `data-src` (a figure
 * that says where it came from) or `data-figure` (a figure printed in the body face: the hero board's row values), holding no such element
 * inside it, whose text holds a digit and is no date ("6 Apr 2026" is a when, not a quantity); its spaces and no-break spaces folded. Its
 * PROVENANCE is its data-src or none; its SECTION the outermost [data-block] round it, else "page"; it is FOCAL at 30px or more.
 * THE RULES, at the width the page is open at:
 *   SAME STAMP   one text twice under one data-src (the spec's own reading of one fact);
 *   ACROSS       one text in two sections, not shown to be two facts: both under one data-src, or either under none;
 *   FOCAL AGAIN  a section's focal figure and the same text again in that section, not shown to be two facts.
 * NEVER A RED: two printings under two different data-src values (a 7% net and a 7% growth); inside one section, two printings under the
 * focal rung and not under one data-src (a table's two members of one value, PART 5, each carrying its own data-src or none; a ledger's dates).
 * ITS BLIND SPOT, stated: a figure inside a sentence, or in an element carrying none of the three marks, is not read; a Fig that holds two
 * values ("£100, 1 day", "9 months, 1 day") reads as one text, so the "1 day" in it is never compared with a lone "1 day"; two facts that print
 * alike in two sections, neither stamped, read as one until one carries its data-src; a closed <details> is unread (R1 read the page so);
 * one width per call, so the gate opens 1280 and 375.
 */
export function factOnceInPage() {
  const MARKS = ".fig, [data-src], [data-figure]";
  const DATE = /^\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}$/;
  const fold = (s) => (s || "").replace(/[\s\u00a0]+/g, " ").trim();
  const hidden = (el) => {
    const d = el.closest("details");
    if (d && !d.open) {
      const sum = d.querySelector(":scope > summary");
      if (!sum || !sum.contains(el)) return true;
    }
    for (let a = el; a; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.display === "none" || s.visibility === "hidden") return true;
    }
    return !el.getClientRects().length;
  };
  const sectionOf = (el) => {
    let top = el.closest("[data-block]");
    while (top && top.parentElement && top.parentElement.closest("[data-block]")) top = top.parentElement.closest("[data-block]");
    return top ? top.getAttribute("data-block") : "page";
  };
  const figs = [...document.querySelectorAll("main .fig, main [data-src], main [data-figure]")]
    .filter((el) => !el.querySelector(MARKS) && !hidden(el))
    .map((el) => ({ text: fold(el.textContent), src: el.getAttribute("data-src") || null, section: sectionOf(el), focal: parseFloat(getComputedStyle(el).fontSize) >= 30 }))
    .filter((f) => /\d/.test(f.text) && !DATE.test(f.text));
  const byText = new Map();
  for (const f of figs) {
    if (!byText.has(f.text)) byText.set(f.text, []);
    byText.get(f.text).push(f);
  }
  const reds = [];
  const said = new Set();
  for (const [figure, list] of byText) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (a.src && b.src && a.src !== b.src) continue;
        const rule = a.src && a.src === b.src ? "SAME STAMP" : a.section !== b.section ? "ACROSS" : a.focal || b.focal ? "FOCAL AGAIN" : null;
        if (!rule) continue;
        const where = a.section === b.section ? a.section : [a.section, b.section].sort().join(" and ");
        const key = `${rule}|${figure}|${where}`;
        if (said.has(key)) continue;
        said.add(key);
        reds.push({ rule, figure, where, src: a.src || b.src || null });
      }
    }
  }
  return { figures: figs.length, reds };
}
