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
 *
 * A ZONE LIT BY ITS GROUND (plan 2026-10-10, the home reformed to ship, Task
 * 5; the spec's decision 7): the home's band is a zone painted the brand
 * terracotta (`[data-zone][data-tone="terra"]`, `--terra-full` since plan
 * 2026-10-13) whose words are the band's ink, white, a loud moment with no
 * accent text on it. The walk lists every such zone under
 * `fields` and says of each card in `ids` whether it is one (`field`), so the
 * loud-seats gate holds a FIELD seat to its zone. A zone is never an accent
 * figure: `accents` counts what it counted before, and so does the page
 * filter's ACCENT BUDGET; an accent drawn inside such a zone outside any card
 * is named by the zone's id, so the gate can say whose it is. A page with no
 * such zone reads exactly as it read before.
 */
export function accentWalk({ ids = [] } = {}) {
  const CLUSTER = "[data-archetype='bento-band'][id]";
  const CARD = '[data-card]';
  const FIELD = '[data-zone][data-tone="terra"]';
  const probe = (token) => { const d = document.createElement("div"); d.style.color = "var(" + token + ")"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
  const accentRgb = probe("--terra-text");
  const accentReadable = accentRgb !== probe("--no-such-token-xyz");
  /* A KIT PAGE'S ACCENT (the industry page v4, ported from the shared kit, his "Go" of 2026-10-21): its terracotta is the kit's
     (`--k-terra`, set on its `.kit4` root from design-tokens `kit`), so it is resolved there and counted beside `--terra-text`. A page
     with no `.kit4` root reads exactly as before. */
  const kitRoot = document.querySelector(".kit4");
  const kitRgb = kitRoot ? (() => { const d = document.createElement("div"); d.style.color = "var(--k-terra)"; kitRoot.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })() : null;
  /* ...and on KIT-VERSION 3 (the industry page v6, his "v6 is the approved industry target.", 2026-10-21) the kit's terracotta is
     version 3's token, `--color-terra` (design-tokens `kit3`), read on its `.kit3` root the same way. */
  const kit3Root = document.querySelector(".kit3");
  const kit3Rgb = kit3Root ? (() => { const d = document.createElement("div"); d.style.color = "var(--color-terra)"; kit3Root.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })() : null;
  const isAccent = (c) => c === accentRgb || (kitRgb !== null && c === kitRgb) || (kit3Rgb !== null && c === kit3Rgb);
  /* A SECTION'S FOCAL PART ON KIT-VERSION 3 is not a loud seat. Version 3 moved the page's terracotta onto each section's one focal
     part, marked `data-focal` (sheets/kit/v3/MOVING.md: "terracotta on each section's focal part inside data-focal, one a section
     (FOCAL)"; his FV 2109 and FV 2128, 2026-10-21), and the industry page v7 (FOUNDER-VERDICTS "v7 approved") puts it on figures as
     well as drawings (42.3%, the receipt's operating profit, 21.3 ...). Such a figure is read as its section's focal part, not an
     accent, only on a `.kit3` root and only where its section holds that one `data-focal`: a second focal part in a section, or a
     terracotta figure outside any, still counts. A page with no `.kit3` root reads exactly as before. */
  const kit3Focal = (el) => {
    const f = el.closest("[data-focal]");
    if (!f || !f.closest(".kit3")) return false;
    const card = f.closest(CARD);
    return !!card && card.querySelectorAll("[data-focal]").length === 1;
  };
  const accents = !accentReadable ? [] : [...document.querySelectorAll("main *")]
    .filter((el) => el.getClientRects().length && el.children.length === 0 && (el.textContent || "").trim() && !el.closest("[data-founder-accent]") && !kit3Focal(el) && isAccent(getComputedStyle(el).color))
    .map((el) => ({ card: el.closest(CARD)?.id || el.closest(CLUSTER)?.id || el.closest(FIELD)?.id || "card", text: (el.textContent || "").trim().slice(0, 16) }));
  const fields = [...document.querySelectorAll("main " + FIELD)].filter((z) => z.getClientRects().length).map((z) => ({ id: z.id || "", label: z.getAttribute("data-zone-label") || "" }));
  const cards = {};
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el || !el.getClientRects().length) { cards[id] = { present: false, withheld: false, field: false }; continue; }
    const withheld = el.matches("[data-blocked]") || el.querySelector('[data-state="no-answer"], [data-withheld-line="focal"], [data-withheld="1"]') != null;
    cards[id] = { present: true, withheld, field: el.matches(FIELD) };
  }
  return { accentReadable, accentRgb, accents, cards, fields };
}
