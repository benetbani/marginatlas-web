/**
 * scripts/lib/open_panels.mjs , THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5). `openPanels` runs
 * inside a page (a check hands it to Playwright; it reads nothing from this file's scope): it opens every closed <details> under main,
 * removing `name` first because grouped panels close one another, and returns how many it opened. A check reads the page as it arrives
 * (every panel closed, the state a reader meets) and then, where this opened any, reads it again; a finding only the second reading makes
 * is reported with OPENED after its detail. The readings that compare two sections' heights or count the page's levels stay closed: a
 * plus a reader opened is a state he chose.
 * ITS BLIND SPOT, stated: it opens native <details> only, the site's one disclosure; a panel a script draws on a click is not opened.
 */
export function openPanels() {
  let n = 0;
  for (const d of document.querySelectorAll("main details")) {
    d.removeAttribute("name");
    if (!d.open) { d.open = true; n++; }
  }
  return n;
}

export const OPENED = " (panels open)";
