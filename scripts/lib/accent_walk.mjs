/**
 * scripts/lib/accent_walk.mjs , THE ONE ACCENT WALK (plan-2026-09-17/
 * 04-PAGES.md step 40, 2026-09-19). The page filter's ACCENT BUDGET count
 * (scripts/harness/check_page_holes.mjs, the founder's art-direction ruling of
 * 2026-09-07: at most three accent figures on a page) and the loud-seats gate
 * (scripts/verify_loud_seats.ts, MODEL.md PART 8's seat tables) must count the
 * same thing, so the walk is one function here and both call it through
 * `page.evaluate(accentWalk, { ids })` on a render at the widest width.
 *
 * IT RUNS INSIDE THE PAGE and is self-contained: Playwright serialises the
 * function's source, so it may reference nothing outside its own body.
 *
 * WHAT IT COUNTS: every visible text leaf under `main` whose computed colour
 * is the accent token `--terra-text`, named by the section card it sits in
 * (the card's id, else the bento cluster's, else "card"); a mark the founder
 * ruled, like the people table's dots, carries data-founder-accent and is not
 * counted. THE INSTRUMENT'S BLIND SPOT, stated before it is trusted: the
 * accent is read by resolving the token on a probe element, and an unresolved
 * token computes to the inherited ink, which would make every word on the
 * page an accent. A second probe with a token that cannot exist says what
 * unresolved looks like; when the two agree the count is not taken and
 * `accentReadable` is false, rather than a page of false accents.
 *
 * WHAT ELSE IT READS, for the gate: for each card id in `ids`, whether the
 * card is on the page and whether it stands in a WITHHELD state by the
 * archetypes' own markers (an AnswerCard's data-state="no-answer", a
 * BentoMetric's data-withheld-line="focal", PayBars' data-withheld="1", a
 * drawn blocked seat's data-blocked), so a LIT seat whose figure the data
 * withholds is told from a seat that lost its accent. This measurement
 * cannot distinguish the declared cell of a bento cluster withheld from a
 * neighbour cell withheld beside a figure that lost its colour; the clusters
 * draw all their cells on every page today (8.3's 252 of 252, 8.7's 243 of
 * 243), and BentoMetric throws on a cell with neither a figure nor a line.
 */
export function accentWalk({ ids = [] } = {}) {
  const CLUSTER = "[data-archetype='bento-band'][id]";
  const CARD = '[data-card]';
  const probe = (token) => { const d = document.createElement("div"); d.style.color = "var(" + token + ")"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
  const accentRgb = probe("--terra-text");
  const accentReadable = accentRgb !== probe("--no-such-token-xyz");
  const accents = !accentReadable ? [] : [...document.querySelectorAll("main *")]
    .filter((el) => el.getClientRects().length && el.children.length === 0 && (el.textContent || "").trim() && !el.closest("[data-founder-accent]") && getComputedStyle(el).color === accentRgb)
    .map((el) => ({ card: el.closest(CARD)?.id || el.closest(CLUSTER)?.id || "card", text: (el.textContent || "").trim().slice(0, 16) }));
  const cards = {};
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el || !el.getClientRects().length) { cards[id] = { present: false, withheld: false }; continue; }
    const withheld = el.matches("[data-blocked]") || el.querySelector('[data-state="no-answer"], [data-withheld-line="focal"], [data-withheld="1"]') != null;
    cards[id] = { present: true, withheld };
  }
  return { accentReadable, accentRgb, accents, cards };
}
