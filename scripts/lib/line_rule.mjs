/**
 * scripts/lib/line_rule.mjs , THE LINE RULE, READ INSIDE A PAGE (plan 2026-10-12 rhythm-air-inside, Task 2C; spec
 * E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, section 2.1; DISTANCES.md section 4's positional test, "the distance above a thing says
 * what it belongs to", ruled 2026-10-13; DISTANCES 2.1: the basis line to the foot is 12, a figure block to the detail panel under it is 12). `lineRuleInPage` runs
 * inside a page (scripts/harness/check_line_rule.mjs hands it to Playwright; tests/spine/line_rule.test.ts runs it in jsdom), so it reads nothing from this file's scope.
 *
 * A LINE: a visible element carrying `data-focal-words` (the kit's Focal: the words that are a figure's own line, src/components/spine/kit.tsx) or `data-basis` (the
 * kit's Basis: a card's line under its rows or drawing, src/components/spine/basis.tsx), inside a visible `main .spine-card` (the outermost one where cards nest, which
 * names the section: its id, else its data-block, else its title). A line carrying neither marker is not read.
 * THE GROUP ABOVE and THE GROUP BELOW a line: the nearest visible sibling in the flow (not absolutely positioned) that has a height, climbing to the parent's sibling
 * when the line is the first or the last child of its wrapper, never past the card. A figure's block is its words and, when the next sibling is a `data-placement`
 * sentence (kit.tsx Focal), that sentence too. Box to box. A FOOT is a group that is, or starts with, a `[data-foot]`, and a DETAIL PANEL one that is, or starts with, a
 * `[data-archetype="detail-panel"]` (DetailPanel.tsx); both stand 12 under a line, any other group 24.
 * THE RULES, at the width the page is open at (DISTANCES 4: a line directly under a figure and above its rows or drawing is the figure's own line, 8 under it, the next
 * group 24 below; a line under the rows or the drawing is the basis, 24 above it; a line under a figure with nothing under it is the card's basis and keeps its 24):
 *   WORDS ABOVE   a `[data-focal-words]` stands 8 under the figure before it;
 *   WORDS BELOW   the group under the figure's block stands 24 below it, 12 where it is a foot or a detail panel;
 *   BASIS ABOVE   a `[data-basis]` stands 24 under the group above it;
 *   BASIS BELOW   the group under a basis stands 24 below it, 12 where it is a foot or a detail panel;
 *   FIGURE ABOVE  a `[data-basis]` whose group above ends in a figure (a text run of 30px or more, the focal rung, on the group's last line) and that has a group under
 *                 it that is not a foot or a detail panel is the figure's own line drawn in the wrong face: it is read once, as this, never also as BASIS ABOVE;
 *   EMPTY LINE    a line with no text is 24 of air holding nothing (read as this alone).
 * TOLERANCE: a distance is rounded to the pixel and may stand 1px off the rule's value, so a line box of 16.5px, a baseline alignment or any other subpixel layout never
 * reds, and no value on the distance ladder (0, 2, 4, 8, 12, 16, 20, 24 ...) is taken for another of the rule's three (8, 12, 24).
 * NEVER A RED: a figure's words with nothing before them (no figure to stand under), a line that is the last thing in its card, a figure's words whose next group stands
 * beside them, the side of a line that stands beside another group, and a group of no height (an empty paragraph keeping 4px of margin). A ROW passes per side only: a line
 * with a group beside it is in a row whose arrangement gives the distance to that neighbour, so that side is not read, and FIGURE ABOVE reads nothing for it; the OPEN
 * side is read from the row's own edge, the far edge of the neighbour beside the line (a basis beside the figure's block, or the figure's words beside the figure: the
 * distance below is measured from the taller of the two, above from the higher of the two), because box to box would otherwise measure to the shorter line.
 * ITS BLIND SPOT, stated: this measurement cannot distinguish a gap made of margin from a gap that is padding inside the neighbouring box (box to box, so a wrapper's own
 * padding is part of the gap it prints); it cannot distinguish the arrangement of a row from any other (the gap between a line and the neighbour beside it is never read, and a
 * neighbour that stands beside a line by a CSS order or a grid row is read as beside); it cannot distinguish a figure drawn at the focal rung from any other run of 30px or more (FIGURE ABOVE reads the last line's size, not the
 * markup); it cannot distinguish a line drawn with neither marker (a hand-rolled foot, a link row under a basis, a caption) from no line at all, nor an empty paragraph
 * from nothing; it cannot distinguish a later sibling that a CSS order stands above an earlier one from a neighbour beside the line, and reads both as beside; a display:none
 * twin, an element with display:contents and the content of a closed <details> have no box (the details has one, its content does not), so they are skipped and what is
 * inside them is not climbed into. One width per call,
 * so the gate opens 1280, 768 and 375.
 */
export function lineRuleInPage() {
  const TOLERANCE = 1;
  const FOCAL_PX = 30;
  const OWN = 8;
  const GROUP = 24;
  const STEP = 12;
  const FOOT_OR_PANEL = '[data-foot], [data-archetype="detail-panel"]';
  const fold = (s) => (s || "").replace(/[\s\u00a0]+/g, " ").trim();
  const box = (el) => el.getBoundingClientRect();
  const shown = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
  const isGroup = (el) => shown(el) && getComputedStyle(el).position !== "absolute" && box(el).height >= 1;
  const sibling = (el, dir) => {
    let n = dir > 0 ? el.nextElementSibling : el.previousElementSibling;
    while (n && !isGroup(n)) n = dir > 0 ? n.nextElementSibling : n.previousElementSibling;
    return n;
  };
  const climb = (el, stop, dir) => {
    for (let c = el; c && c !== stop; c = c.parentElement) {
      const n = sibling(c, dir);
      if (n) return n;
    }
    return null;
  };
  const firstGroup = (el) => {
    for (const k of Array.from(el.children)) if (isGroup(k)) return k;
    return null;
  };
  const startsWith = (el, sel) => {
    for (let c = el; c; c = firstGroup(c)) if (c.matches(sel)) return true;
    return false;
  };
  const outerCard = (el) => {
    let s = el.closest(".spine-card");
    while (s && s.parentElement && s.parentElement.closest(".spine-card")) s = s.parentElement.closest(".spine-card");
    return s;
  };
  const nameOf = (card) => {
    const id = card.id || card.getAttribute("data-block");
    if (id) return `#${id}`;
    const title = card.querySelector("[data-rail-title]");
    return title ? `"${fold(title.textContent).slice(0, 24)}"` : "(a card with no id)";
  };
  /* A group ends in a figure when a run of the focal rung stands on its last line: the lowest text run, and every run whose box overlaps its own. */
  const endsInFigure = (root) => {
    const runs = [];
    const walker = document.createTreeWalker(root, 4);
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (!fold(t.textContent)) continue;
      const el = t.parentElement;
      if (!el || !shown(el)) continue;
      const bb = box(el);
      if (bb.height <= 0) continue;
      runs.push({ top: bb.top, bottom: bb.bottom, size: parseFloat(getComputedStyle(el).fontSize) || 0 });
    }
    if (!runs.length) return false;
    const low = runs.reduce((a, b) => (b.bottom > a.bottom ? b : a));
    return runs.some((x) => x.bottom > low.top && x.size >= FOCAL_PX);
  };
  const px = (n) => Math.round(n);
  const off = (got, want) => Math.abs(got - want) > TOLERANCE;
  const reds = [];
  let lines = 0;
  let outside = 0;
  for (const el of document.querySelectorAll("main [data-focal-words], main [data-basis]")) {
    if (!shown(el)) continue;
    const card = outerCard(el);
    if (!card) { outside++; continue; }
    if (!shown(card)) continue;
    lines++;
    const isBasis = el.hasAttribute("data-basis");
    const text = fold(el.textContent);
    const bb = box(el);
    const flag = (rule, read, got, want) => reds.push({ rule, section: nameOf(card), line: isBasis ? "basis" : "words", text: text.slice(0, 40), read, got, want });
    if (!isBasis) {
      const fig = sibling(el, -1);
      const figBeside = !!fig && box(fig).bottom > bb.top + 1;
      const above = fig ? (figBeside ? "beside" : px(bb.top - box(fig).bottom)) : "-";
      const next = el.nextElementSibling;
      const last = next && next.hasAttribute("data-placement") && isGroup(next) ? next : el;
      const lastBottom = figBeside ? Math.max(box(last).bottom, box(fig).bottom) : box(last).bottom;
      const dn = climb(last, card, 1);
      const below = dn ? (box(dn).top < lastBottom - 1 ? "beside" : px(box(dn).top - lastBottom)) : "-";
      const read = `${above}|${below}`;
      if (!text) { flag("EMPTY LINE", read, null, null); continue; }
      if (typeof above === "number" && off(above, OWN)) flag("WORDS ABOVE", read, above, OWN);
      const want = dn && startsWith(dn, FOOT_OR_PANEL) ? STEP : GROUP;
      if (typeof below === "number" && off(below, want)) flag("WORDS BELOW", read, below, want);
      continue;
    }
    const up = climb(el, card, -1);
    const dn = climb(el, card, 1);
    const upBeside = !!up && box(up).bottom > bb.top + 1;
    const dnBeside = !!dn && box(dn).top < bb.bottom - 1;
    const rowTop = dnBeside ? Math.min(bb.top, box(dn).top) : bb.top;
    const rowBottom = upBeside ? Math.max(bb.bottom, box(up).bottom) : bb.bottom;
    const above = up ? (upBeside ? "beside" : px(rowTop - box(up).bottom)) : "-";
    const below = dn ? (dnBeside ? "beside" : px(box(dn).top - rowBottom)) : "-";
    const read = `${above}|${below}`;
    if (!text) { flag("EMPTY LINE", read, null, null); continue; }
    const toFoot = !!dn && startsWith(dn, FOOT_OR_PANEL);
    if (!upBeside && !dnBeside && up && dn && !toFoot && endsInFigure(up)) { flag("FIGURE ABOVE", read, null, null); continue; }
    if (typeof above === "number" && off(above, GROUP)) flag("BASIS ABOVE", read, above, GROUP);
    const want = toFoot ? STEP : GROUP;
    if (typeof below === "number" && off(below, want)) flag("BASIS BELOW", read, below, want);
  }
  return { lines, outside, reds };
}
