/**
 * crumbFit , WHAT GAVE WAY IN THE TRAIL BACK UP, SAID AND TAKEN OUT OF REACH (release 3: the rhythm-gates review, Important 2 and Minor 1;
 * the controller's ruling). src/components/spine/Crumbs.tsx draws the trail as one line that wraps into a hidden second line, so a step
 * that does not fit gives way whole, the page's own step first. Two things CSS alone cannot do, done here on the nav after layout:
 *  - A MIDDLE STEP THAT GAVE WAY SHOWS THE MARK. When a step between the first and the page's own leaves the visible line, it and the
 *    middle steps after it collapse to the mark ("/ ..."), as the trail over four steps already does, so the reader never sees a lone
 *    first step with no sign of what stood after it; the page's own step then comes back if it fits. (The review's option (a). Its option
 *    (b), the mark drawn as a unit sorted before the middle, would print the mark beside a middle step that fits; drawing it under the
 *    middle step needs a background guessed per page.)
 *  - A STEP THAT GAVE WAY LEAVES THE TAB ORDER (`inert`), so a keyboard never lands on a link the reader cannot see.
 * The nav itself is `overflow-clip`, so focus can never scroll it.
 * Run by CrumbFit (Crumbs.tsx's client child) after layout and on every resize, and by scripts/harness/check_crumb_trails.ts in the page.
 * Self-contained, with no inner function: the probe hands it to the browser as written.
 * BLIND SPOT: it runs after the first paint, so until the script runs a lone first step can show; a mark that does not fit beside the
 * steps before it gives way too, and is not replaced.
 */
export function crumbFit(nav: HTMLElement): { steps: number; collapsed: boolean; away: number } {
  const units = Array.prototype.slice.call(nav.querySelectorAll("[data-crumb-step]")) as HTMLElement[];
  const mark = nav.querySelector("[data-crumb-gap]") as HTMLElement | null;
  /* THE TRAIL AS DRAWN, every step back and in order: the first step 0, each unit after it 2, 4, 6..., the mark between two of them. */
  for (let i = 0; i < units.length; i++) {
    units[i].style.display = "";
    units[i].style.order = String(2 * (i + 1));
    units[i].removeAttribute("inert");
  }
  if (mark) { mark.style.display = "none"; mark.style.order = "0"; }
  let bottom = nav.getBoundingClientRect().bottom - 0.5;
  let firstAway = -1;
  for (let i = 0; i < units.length; i++) {
    if (units[i].hasAttribute("data-crumb-last")) break;
    if (units[i].hasAttribute("data-crumb-mark")) { firstAway = -2; break; }
    if (units[i].getBoundingClientRect().top >= bottom) { firstAway = i; break; }
  }
  /* A MIDDLE STEP GAVE WAY (and no drawn mark already stands before it): it and the middle after it give way to the mark. */
  const collapsed = firstAway >= 0 && mark !== null;
  if (collapsed && mark) {
    for (let i = firstAway; i < units.length; i++) if (!units[i].hasAttribute("data-crumb-last")) units[i].style.display = "none";
    mark.style.display = "flex";
    mark.style.order = String(2 * (firstAway + 1) - 1);
  }
  /* WHAT STILL STANDS ON THE HIDDEN LINE LEAVES THE TAB ORDER. */
  bottom = nav.getBoundingClientRect().bottom - 0.5;
  let away = 0;
  for (let i = 0; i < units.length; i++) {
    if (units[i].style.display === "none") { away++; continue; }
    if (units[i].getBoundingClientRect().top >= bottom) { units[i].setAttribute("inert", ""); away++; }
  }
  return { steps: units.length + 1, collapsed, away };
}
