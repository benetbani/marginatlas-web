/**
 * CRUMB CUT, the one reading of "the trail back up is cut" (release 3 job C, 2026-10-16; the rhythm reform's final review,
 * Important 4). The crumb (src/components/spine/Crumbs.tsx) is one line that never wraps, never scrolls and never ends in an
 * ellipsis: a step that does not fit gives way whole. Before that rule the nav hid its overflow with no mark, so "United Kingdom /
 * London / Catering &" was cut mid-word on a phone, and the page laws' TEXT CUT, which reads ellipses and line clamps inside
 * cards, could not see it: the crumb stands outside every card and carries no ellipsis.
 *
 * THE READING, inside the browser: every text run of every visible `nav[aria-label="Breadcrumb"]` whose top stands on the nav's
 * visible line (above the nav's bottom edge) must lie wholly between the nav's left and right edges. A run that crosses an edge
 * is a label cut. A run whose top is at or under the bottom edge gave way whole (the wrapped line the nav hides) and is fine.
 * The visible runs must also stand on one line: two visible runs whose tops differ by more than half a line are a wrapped trail.
 *
 * WHAT THIS CANNOT SEE, stated: a label cut by an ancestor of the nav rather than by the nav itself (the nav's own box is the
 * measure), a run a transform or a clip-path hides, and whether the steps that gave way were the right ones (the page's own
 * step first is the component's law, read by its markup, not here). The nav's `scrollWidth` over its `clientWidth`, the
 * brief's first measure, is printed beside a red but not used to decide one: a unit wider than the line that already gave way
 * to the hidden second line raises `scrollWidth` with nothing visible cut (the Slovenian municipality's trail at 320).
 *
 * Self-contained: page.evaluate serialises this function, so it may close over nothing.
 */
export function crumbCutInPage() {
  /** @type {{ navs: number, runs: number, cuts: { trail: string, msg: string }[] }} */
  const out = { navs: 0, runs: 0, cuts: [] };
  for (const nav of document.querySelectorAll('nav[aria-label="Breadcrumb"]')) {
    if (!nav.getClientRects().length) continue;
    out.navs++;
    const box = nav.getBoundingClientRect();
    const shown = [];
    const walk = document.createTreeWalker(nav, NodeFilter.SHOW_TEXT);
    for (let t = walk.nextNode(); t; t = walk.nextNode()) {
      const txt = (t.textContent || "").trim();
      if (!txt) continue;
      const range = document.createRange();
      range.selectNodeContents(t);
      const r = range.getBoundingClientRect();
      if (!r.width) continue;
      if (r.top >= box.bottom - 0.5) continue;
      out.runs++;
      shown.push({ txt, r });
      if (r.left < box.left - 0.5 || r.right > box.right + 0.5) out.cuts.push({ trail: (nav.textContent || "").replace(/\s+/g, " ").trim(), msg: `"${txt}" is cut at the trail's edge: it runs ${Math.round(Math.max(r.right - box.right, box.left - r.left))}px past the nav's ${Math.round(box.width)}px (scrollWidth ${nav.scrollWidth} over clientWidth ${nav.clientWidth}); a step that does not fit gives way whole, a label is never cut` });
    }
    const tops = shown.map((s) => s.r.top);
    const lineH = parseFloat(getComputedStyle(nav).lineHeight) || 14;
    if (tops.length > 1 && Math.max(...tops) - Math.min(...tops) > lineH / 2) out.cuts.push({ trail: (nav.textContent || "").replace(/\s+/g, " ").trim(), msg: `the trail stands on ${new Set(tops.map((t) => Math.round(t))).size} lines; it is one line` });
  }
  return out;
}

/**
 * WHAT GAVE WAY IS SAID, AND OUT OF REACH (release 3: the rhythm-gates review, Important 2 and Minor 1; read after crumbFit,
 * src/lib/spine/crumb_fit.ts, has run on the nav). For every visible trail of three steps or more:
 *  - LONE STEP: the visible line shows the first step alone, with no mark ("...") beside it, so nothing says a trail stood after it;
 *  - HIDDEN LINK: a link on the hidden line that a keyboard can still reach (not inside an `inert` element, not display none);
 *  - SCROLLS: the nav's overflow is not `clip`, so focus or script could scroll the trail sideways.
 * WHAT THIS CANNOT SEE: a mark that some other text stands in for, and a trail whose script never ran (the static render; the probe runs
 * crumbFit itself before this reads).
 * Self-contained: page.evaluate serialises this function, so it may close over nothing.
 */
export function crumbWayInPage() {
  /** @type {{ navs: number, faults: { trail: string, msg: string }[] }} */
  const out = { navs: 0, faults: [] };
  for (const nav of document.querySelectorAll('nav[aria-label="Breadcrumb"]')) {
    if (!nav.getClientRects().length) continue;
    out.navs++;
    const trail = (nav.textContent || "").replace(/\s+/g, " ").trim();
    const box = nav.getBoundingClientRect();
    const cs = getComputedStyle(nav);
    if (cs.overflowX !== "clip" || cs.overflowY !== "clip") out.faults.push({ trail, msg: `SCROLLS: the nav's overflow is ${cs.overflowX}/${cs.overflowY}, not clip, so focus can scroll the trail` });
    const steps = Number(nav.getAttribute("data-crumbs") || "0");
    const shown = [];
    const walk = document.createTreeWalker(nav, NodeFilter.SHOW_TEXT);
    for (let t = walk.nextNode(); t; t = walk.nextNode()) {
      const txt = (t.textContent || "").trim();
      if (!txt) continue;
      const range = document.createRange();
      range.selectNodeContents(t);
      const r = range.getBoundingClientRect();
      if (!r.width || r.top >= box.bottom - 0.5) continue;
      shown.push(txt);
    }
    const words = shown.filter((s) => s !== "/");
    if (steps >= 3 && words.length === 1 && !shown.includes("...")) out.faults.push({ trail, msg: `LONE STEP: a trail of ${steps} steps shows "${words[0]}" alone, with no mark that a step gave way` });
    for (const a of nav.querySelectorAll("a[href]")) {
      const r = a.getBoundingClientRect();
      const gone = !a.getClientRects().length;
      if (gone || r.top < box.bottom - 0.5) continue;
      if (!a.closest("[inert]")) out.faults.push({ trail, msg: `HIDDEN LINK: "${(a.textContent || "").trim()}" gave way to the hidden line and a keyboard can still reach it` });
    }
  }
  return out;
}
