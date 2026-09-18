/**
 * THE HARNESS CHECKS for the archetype stories, from the rendered page and its
 * photographs, at three widths. Each red names the instance, the width, the
 * element and the rule, in the founder's own failure words. Exit 1 on any red.
 *
 * Checks (HARNESS-SPEC 5, 6, 7, 8 as far as a static render can carry them):
 *  UNIVERSALITY: no element overflows its box, no page scroll sideways.
 *  LONE STAT / HOLE: no blank rectangle inside a card over a quarter of the
 *    card each way (E6), floored at 120px.
 *  UNEQUAL ROWS: in every key-value grid, cells in one row share their
 *    figure's top edge within 2px (ruling 8).
 *  NO HIERARCHY: each card has exactly one element at the answer size, at
 *    least 1.6x the next size (rule 16).
 *  LADDER: every font size on the ladder.
 *  ACCENT: at most one accent-coloured text element per card. A ranked-bars
 *    card's ROWS carry none , their one loud moment is a BLACK PILL on the row
 *    the card declares as the leader (`data-leader-key`), not a colour (task
 *    12, 2026-09-10), so its own law is stricter: zero accent text off the
 *    card's own focal slot (`[data-focal]`, the bill's total over its lines
 *    on the trade page's `04 open`, MODEL.md 8.6, plan step 33's second
 *    dispatch, 2026-09-18: the one accent figure a ranked card may hold, and
 *    at most one leaf in it), AT MOST one
 *    pill, and if there is one it sits on the leader's row. Whether that one
 *    exists is the card's own declaration, `data-feature`, read both ways: a
 *    card declaring "leader" must carry exactly one, so a mark cannot go
 *    missing by accident on a card that has an answer to give, and a card
 *    declaring "none" must carry none, so a mark cannot creep back onto a
 *    card deliberately left unfeatured. A ranking is not always an answer,
 *    and marking one member of a set is an editorial claim (widened, task 14,
 *    2026-09-10, the founder on the districts card: featuring one district
 *    "just for the fact that it's cheaper ... is not justifiable"). A card
 *    that declares nothing is read as "leader", the component's own default.
 *    Checked at every width because the pill is drawn in three forms (the bar
 *    figure, the wide table, the phone table) and only one of the three shows
 *    at a time.
 *  TRACKS ADRIFT / OUT OF ORDER: on a ranked card every track begins at one
 *    left edge and runs one length within a pixel, and the bars drawn in them
 *    rise in the order their values do. Both halves of one law, and one
 *    fault: a per-row column template let the reference row's track begin
 *    40px left of its siblings', so the cheapest district drew the longer bar
 *    (task 13 alignment fix, 2026-09-10).
 *  ROWS CUT: a drawing that declares its row count draws every row at every
 *    width (the sheet's copy of the page filter's rule; ranked bars declare
 *    both their forms since run 25).
 *  HEADLINE: an answer card at page level draws exactly one h1; at section
 *    level (a page's second answer, the city's verdict) none, so a page keeps
 *    one headline (city:verdict, run 23).
 *  PROMISE: a subtitle naming registration only when a registration cell
 *    renders.
 *  REPETITION: no micro label repeated inside one card.
 *  NOTES: a label on one line, a fact within four lines, at most five notes
 *    (the founder's wall-of-text verdict, 2026-08-27).
 *  TERMINUS: at most three doors, one pill, distinct first words, a door on
 *    one line from 768 up and within two on a phone.
 *  PAY BARS: every fill inside its track, the edge label inside the card, the
 *    two words present, a withheld pair drawing no bar; and PLACEMENT (plan
 *    step 31's sixth dispatch, 2026-09-18): a placement line beside every
 *    drawn bar in the bar's own column, none on a withheld pair or the
 *    one-figure form, every line in the one shape.
 *  KV GRID: when its groups sit side by side, their first figures share one
 *    top (the reserved heading line), and no group is left alone in a row.
 *  SPECTRA: rows one height, every dot inside its track (a read of 0 or 1
 *    at the ends, never clamped), pole words on one line, one dot colour a table.
 *  CITY CARDS (B11, 2026-09-10): UNEQUAL (cards in one row share a height,
 *    ruling 7, and by construction rather than by content luck), BOTCHED
 *    MOBILE (no city name clipped in either direction, measured off
 *    `data-city-name` so it survives a change of markup), NOT TALL (every card
 *    is drawn taller than it is wide by a clear margin, which is the whole
 *    point of the form he pointed at), NO HIERARCHY (nothing on a card is
 *    drawn larger than that city's own name), IMAGE (no card carries a
 *    photograph, his ruling of 2026-09-08).
 *  BENTO BAND (2026-09-10): CELL COUNT (three or four drawn, and the same
 *    number the cluster declares, at every width); TILING (the drawn cells
 *    cover their rectangle with no gap and no overlap, measured from the
 *    rendered boxes and never from the declared spans, because the
 *    declaration is what is under test); NO HOLE ON COLLAPSE (at each width
 *    the cells' areas add up to the rectangle they occupy, so a cluster that
 *    reflows into a ragged L is named as a collapse fault).
 *  MARK LIST (B3, 2026-09-10): the drawn row count matches the count the
 *    card declares at every width; every drawn row prints a figure and every
 *    member holding none is accounted for by the withheld line; the rows are
 *    one height AND no row's content runs past it; and where marks are drawn,
 *    every row carries one and every one of them is the same height AND the
 *    same WIDTH (the width half added 2026-09-11, reversing what this file used
 *    to assert; see the MARK SIZE note at the rule itself).
 *  INCOME BREAKDOWN: every drawn segment's share plus net sums to a hundred
 *    within a stated tolerance (task 11); no segment renders under six
 *    pixels wide (a sliver no hatch or swatch could carry); the legend names
 *    exactly the drawn segments, no fewer and no more.
 *  BLOCKED SEAT (MODEL.md 8.2, `07 workforce` and `11 easiest`; plan step 31,
 *    2026-09-17): exactly one stated line, under fifteen words; no `.fig` on
 *    the card and nothing drawn at 30 or 40, because a seat holds no figure
 *    by its law; and a foot naming the requirement it waits on. Planted by
 *    hand once (a Fig at the focal rung put on the seat) and watched go red
 *    at all three widths before the rule was trusted.
 * BLIND SPOT: it measures a static render with web fonts loaded from the
 * network if reachable and the fallback stack if not; a wrap that depends on
 * the exact font can differ by a line. It cannot judge taste.
 * usage: node scripts/harness/check_archetypes.mjs [--shots]
 *        node scripts/harness/check_archetypes.mjs --only=<kind>[/<key>] [--shots]
 *   THE TARGETED FORM (plan step 21, 2026-09-17) reads the one-kind render that
 *   render_archetypes.tsx --only wrote (archetypes-only.html, instances-only.json)
 *   and iterates only the stories the target names, so every rule above runs on
 *   them exactly as the full run runs it, at the same three widths. Two rules
 *   are about the sheet rather than a story and are handled thus: BOTCHED
 *   MOBILE's sideways-scroll clause still runs, on the one-kind page; INDEX is
 *   skipped and says so, because no index is rendered. Shots go to
 *   scratchpad/harness/shots/only-<kind>-<key>-<width>.jpeg, never over the
 *   sheet's own. A target the census does not hold stops with exit 2 and the
 *   census; the full sheet and its reds are untouched.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, the browser on disk, free memory printed; a wrong ground stops here with the remedy. */
preflight({ browser: true, name: "check_archetypes" });

const LADDER = new Set([10, 12, 14, 16, 20, 24, 30, 40]);
const WIDTHS = [1280, 768, 375];
const shots = process.argv.includes("--shots");
/* THE TARGET, when there is one: "<kind>" or "<kind>/<key>", read against the
   census the targeted render wrote beside its page. */
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice("--only=".length) ?? null;
const onlyKind = ONLY == null ? null : ONLY.includes("/") ? ONLY.slice(0, ONLY.indexOf("/")) : ONLY;
const onlyKey = ONLY == null || !ONLY.includes("/") ? null : ONLY.slice(ONLY.indexOf("/") + 1);
const file = ONLY == null ? "scratchpad/harness/archetypes.html" : "scratchpad/harness/archetypes-only.html";
const censusFile = ONLY == null ? "scratchpad/harness/instances.json" : "scratchpad/harness/instances-only.json";
const instancesByKind = JSON.parse(readFileSync(censusFile, "utf8"));
if (ONLY != null) {
  const held = (instancesByKind[onlyKind] ?? []).map((i) => i.iso2);
  const hit = onlyKey == null ? held.length > 0 : held.includes(onlyKey);
  if (!hit) {
    console.error(`check_archetypes --only=${ONLY}: the targeted render's census (${censusFile}) holds ${Object.keys(instancesByKind).join(", ") || "nothing"}${held.length ? `, keys ${held.join(", ")}` : ""}; render the target first (render_archetypes.tsx --only=${ONLY}).`);
    process.exit(2);
  }
}
const instances = Object.values(instancesByKind).flat().filter((i) => onlyKey == null || i.iso2 === onlyKey);
/* WHERE THE ITERATION STARTS: the stories the page walk reads. Every story on
   the sheet, or, targeted, the stories of one kind or the one story keyed. The
   attribute selector is built here and handed into the page, so a key with a
   colon in it ("london:districts") is quoted rather than parsed. */
const STORY_SELECTOR = ONLY == null ? "[data-story]" : `[data-stories="${onlyKind}"] [data-story${onlyKey == null ? "" : `="${onlyKey.replace(/"/g, '\\"')}"`}]`;
const reds = [];
const datas = [];
const red = (inst, w, rule, msg) => reds.push({ inst, w, rule, msg });
const data = (inst, rule, msg) => datas.push({ inst, rule, msg });

function inPage(storySelector) {
  const ladder = [10, 12, 14, 16, 20, 24, 30, 40];
  const out = [];
  const accentRgb = (() => { const d = document.createElement("div"); d.style.color = "var(--terra-text)"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })();
  /* THE STORIES THIS RUN READS: all of them, or the target's (the selector is built by the caller, see STORY_SELECTOR). */
  const stories = [...document.querySelectorAll(storySelector)];
  for (const story of stories) {
    const inst = story.closest("[data-stories]")?.getAttribute("data-stories") + ":" + story.getAttribute("data-story");
    const card = story.querySelector("[data-archetype]");
    const r = { inst, kind: card?.getAttribute("data-archetype") || "", overflow: [], sizes: [], accents: 0, focalAccents: 0, answerSizes: [], rows: [], labels: [], hole: null, subtitle: "", cells: [], state: "", bars: [], tableRows: [], selfOmit: !!story.querySelector("[data-self-omit]") };
    if (!card) { out.push(r); continue; }
    for (const el of card.querySelectorAll("*")) {
      if (el.getClientRects().length === 0) continue; // display:none at this width
      const cs = getComputedStyle(el);
      if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== "hidden" && cs.display !== "inline") r.overflow.push(el.className.toString().slice(0, 40));
      const txt = (el.textContent || "").trim();
      if (txt && el.children.length === 0) {
        const fs = parseFloat(cs.fontSize); r.sizes.push(fs);
        /* The card's own focal (`[data-focal]`, RankedBars since plan step 33's second dispatch) is counted apart from everything else: on a ranked card it is the one place accent text may stand. */
        if (cs.color === accentRgb) { r.accents++; if (el.closest("[data-focal]")) r.focalAccents++; }
      }
    }
    r.state = card.querySelector("[data-state]")?.getAttribute("data-state") || "";
    r.level = card.getAttribute("data-level") || ""; r.h1 = card.querySelectorAll("h1").length;
    const ans = card.querySelector("[data-answer] .fig");
    if (ans) r.answerSizes.push(parseFloat(getComputedStyle(ans).fontSize));
    const grid = card.querySelector("[data-archetype='kv-grid']");
    if (grid) {
      const cells = [...grid.querySelectorAll("[data-kv-cell]")];
      r.cells = cells.map((c) => c.getAttribute("data-kv-cell"));
      const figs = cells.map((c) => { const f = c.querySelector(".fig"); const b = f.getBoundingClientRect(); const cb = c.getBoundingClientRect(); return { top: Math.round(b.top), left: Math.round(cb.left), cellTop: Math.round(cb.top) }; });
      // group cells into rows by cellTop
      const rows = new Map(); for (const f of figs) { const k = Math.round(f.cellTop / 4); if (!rows.has(k)) rows.set(k, []); rows.get(k).push(f.top); }
      r.rows = [...rows.values()];
      r.labels = cells.map((c) => c.querySelector("div div")?.textContent?.trim() || "");
    }
    /* THE SUBTITLE, BY ITS OWN HOOK, NOT BY "the first p in the card". The
       old selector was `card.querySelector("p")`, which is the subtitle only
       while the card holds no other paragraph; a DetailPanel nested at the
       foot of an answer-card (the `detail` slot, built for that) put its
       withheld line , a `p` , earlier in document order than nothing at all,
       and PROMISE below started judging a sentence about registering as a
       subtitle promising registration. Planted and watched go red at all
       three widths on detail-panel:GB:nested, 2026-09-10. */
    r.subtitle = r.kind === "answer-card" ? (card.querySelector("[data-subtitle]")?.textContent || "") : "";
    if (r.kind === "ranked-bars") {
      const top = card.querySelector("[data-idea='I2'] > div:first-child");
      const topY = top ? top.getBoundingClientRect().top : null;
      r.bars = [...card.querySelectorAll("[data-bar]")].map((li) => { const bar = li.querySelector("div[aria-hidden]"); const b = bar.getBoundingClientRect(); return { key: li.getAttribute("data-bar"), top: Math.round(b.top), h: Math.round(b.height), ruleTop: topY == null ? null : Math.round(topY) }; });
      /* THE PILL LAW'S GROUND TRUTH (task 12): the card declares its own
         leader once, on the root (`data-leader-key`), independently of
         wherever the pill itself renders; comparing the two is what makes
         "a pill on a non-leader" a provable fault rather than a tautology.
         The pill's ROW comes from its `[data-row]` ancestor, so the check
         holds wherever inside that row the pill sits, its figure or its name
         (task 13 fix wave). Only the VISIBLE pill counts , at any width all
         but one of the three forms (bar figure, wide table, phone table) is
         display:none, exactly the same getClientRects() test the rest of this
         walk uses.
         THE CARD ALSO DECLARES WHETHER IT FEATURES ANYONE (task 14),
         `data-feature`, so "no pill" can be read as the card's stated
         intention on one card and as a mark that went missing on another.
         A card that declares nothing is read as "leader", matching the
         component's own default, so an older card cannot lose its mark by
         saying nothing. */
      r.leaderKey = card.getAttribute("data-leader-key") || "";
      r.feature = card.getAttribute("data-feature") || "leader";
      const pills = [...card.querySelectorAll("[data-pill]")].filter((el) => el.getClientRects().length > 0);
      r.pillCount = pills.length;
      r.pillKey = pills.length ? (pills[0].closest("[data-row]")?.getAttribute("data-row") || "") : "";
      /* THE DRAWN LENGTH BESIDE THE DECLARED VALUE (task 13 alignment fix,
         2026-09-10), for whichever of the three forms is visible at this
         width. A row's mark is the fill inside its `[data-track]` in the table
         form (a width) and the standing column in the bars form (a height);
         the phone form draws no mark and is dropped by the null below rather
         than counted as a zero-length bar. Only visible rows: at any width two
         of the three forms are display:none, the same getClientRects() test
         the rest of this walk uses. */
      r.ranked = [...card.querySelectorAll("[data-row][data-value]")]
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => {
          const track = el.querySelector("[data-track]");
          const fill = track ? track.firstElementChild : null;
          const column = el.querySelector("div[aria-hidden]");
          const tb = track ? track.getBoundingClientRect() : null;
          const fb = fill ? fill.getBoundingClientRect() : null;
          const cb3 = column ? column.getBoundingClientRect() : null;
          return {
            key: el.getAttribute("data-row"),
            value: Number(el.getAttribute("data-value")),
            trackLeft: tb ? +tb.left.toFixed(2) : null,
            trackW: tb ? +tb.width.toFixed(2) : null,
            drawn: fb ? +fb.width.toFixed(2) : cb3 ? +cb3.height.toFixed(2) : null,
          };
        })
        .filter((x) => x.drawn != null && Number.isFinite(x.value));
    }
    if (r.kind === "card-pager") {
      const cards = [...card.querySelectorAll("[data-card]")].filter((el) => el.getClientRects().length);
      const rowsMap = new Map(); for (const el of cards) { const b = el.getBoundingClientRect(); const k = Math.round(b.top / 4); if (!rowsMap.has(k)) rowsMap.set(k, []); rowsMap.get(k).push(Math.round(b.height)); }
      r.cardRows = [...rowsMap.values()];
      r.namesCut = cards.filter((el) => { const n = el.querySelector("span span"); return n && n.scrollWidth > n.clientWidth + 1; }).length;
      r.noImage = cards.filter((el) => !el.querySelector("img")).map((el) => el.getAttribute("data-card"));
      r.brokenImage = cards.filter((el) => { const im = el.querySelector("img"); return im && (!im.complete || im.naturalWidth === 0); }).map((el) => el.getAttribute("data-card"));
      r.imageCount = cards.length - r.noImage.length;
      /* THE PAGER DECLARES WHETHER IT CARRIES IMAGES (plan step 32's sixth
         dispatch, 2026-09-18): `data-images="none"` on the root is the city's
         neighbourhoods pager, which MODEL.md 8.3 draws with NO IMAGE by design,
         so the IMAGE MISSING data red below does not ask for a photograph the
         model forbids; an image drawn under that declaration is a fault. */
      r.images = card.getAttribute("data-images") || "left";
    }
    /* THE CITY CARDS (B11, 2026-09-10). Its own block and not the pager's,
       because the two laws differ where it matters: a pager card is a row and
       a city card is a TALL card whose name is the loudest thing on it, and
       neither of those is measurable from the pager's rules. */
    if (r.kind === "city-cards") {
      const cards = [...card.querySelectorAll("[data-card]")].filter((el) => el.getClientRects().length);
      const rowsMap = new Map(); for (const el of cards) { const b = el.getBoundingClientRect(); const k = Math.round(b.top / 4); if (!rowsMap.has(k)) rowsMap.set(k, []); rowsMap.get(k).push(Math.round(b.height)); }
      r.cityRows = [...rowsMap.values()];
      r.cityNamesCut = cards.filter((el) => { const n = el.querySelector("[data-city-name]"); return n && (n.scrollWidth > n.clientWidth + 1 || n.scrollHeight > n.clientHeight + 1); }).length;
      /* NOT TALL is asked of the GRID form only, and the component declares
         which form it drew. A country holding one or two covered cities cannot
         fill a row of tall cards without leaving the unfilled right edge he
         raised against this very section, so below three the component draws
         the model's own full-width rows; a row is not a card that failed to be
         tall. The declaration is checked in both directions below, so the wide
         form cannot creep onto a set that could have filled its row. */
      r.cityForm = card.getAttribute("data-form") || "";
      /* WHICH LOOK THIS STORY IS, read off the card rather than parsed out of
         the instance key: the photograph rule below differs by look. */
      r.cityLook = card.getAttribute("data-look") || "";
      r.cityCount = Number(card.getAttribute("data-count"));
      r.cityFlat = r.cityForm === "rows" ? [] : cards.map((el) => Math.round((el.getBoundingClientRect().height / el.getBoundingClientRect().width) * 100) / 100).filter((ratio) => ratio < 1.15);
      /* THE PHOTOGRAPH, 2026-09-11, and the rule inverted with the ruling: the
         "field" look must carry one on EVERY card, the other two looks on none.
         Read from the DOM, so "every card" is a count and not an assumption. */
      r.cityPhotos = cards.filter((el) => el.querySelector("img[data-photo]")).map((el) => el.getAttribute("data-card"));
      r.cityPhotoPlaceholders = cards.filter((el) => el.querySelector('img[data-photo="placeholder"]')).length;
      /* STRAY IMAGES: an `img` that is not the declared photograph. The old
         IMAGE rule banned every image on the card and so needed no such
         distinction; now that one image is sanctioned, anything else arriving
         on this card has to be named rather than absorbed. */
      r.cityStrayImages = cards.filter((el) => [...el.querySelectorAll("img")].some((i) => !i.hasAttribute("data-photo"))).map((el) => el.getAttribute("data-card"));
      /* THE NAME OVER THE PICTURE, MEASURED (WCAG AA, the 4.5 floor this repo
         holds). check_readability.mjs cannot do this one: its `behind()` walk
         composites ANCESTOR background-colours, and a full-bleed photograph
         plus two absolutely-positioned sibling overlays are none of those, so it
         reads the name's backdrop as the white card and reports a ratio that is
         not what a reader sees. So the stack is read here from the rendered
         layers (each overlay's own computed colour and opacity, in document
         order) and composited over the photograph's WORST pixel.
         THE ONE CONSTANT AND ITS PROVENANCE: the darkest pixel in
         /spine/_skyline.jpeg is rgb(0,0,0), measured 2026-09-11 by decoding the
         file into a canvas and walking all 1,116,717 pixels. Compositing over
         black bounds every region of the picture at once, which sampling a
         screenshot could not promise. IT IS A PROPERTY OF THE PICTURE, NOT OF
         THE MATHS: swap the photograph and this bound needs re-measuring, which
         is why the number is named here rather than buried. */
      const firstCard = cards[0];
      r.cityNameRatio = null;
      if (firstCard && firstCard.querySelector("img[data-photo]")) {
        const chan = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
        const lum = ([r1, g1, b1]) => 0.2126 * chan(r1) + 0.7152 * chan(g1) + 0.0722 * chan(b1);
        const rgbOf = (s) => { const m = String(s).match(/-?[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };
        const over = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));
        let backdrop = [0, 0, 0]; // the photograph's darkest pixel; see above
        for (const el of firstCard.querySelectorAll("[data-veil],[data-tint]")) {
          const cs = getComputedStyle(el);
          const c = rgbOf(cs.backgroundColor);
          const a = parseFloat(cs.opacity);
          if (c && Number.isFinite(a)) backdrop = over(c, backdrop, a);
        }
        const nameEl = firstCard.querySelector("[data-city-name]");
        const ink = nameEl ? rgbOf(getComputedStyle(nameEl).color) : null;
        if (ink) {
          const l1 = lum(ink);
          const l2 = lum(backdrop);
          r.cityNameRatio = Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
          r.cityBackdrop = backdrop.map((v) => Math.round(v));
        }
      }
      /* THE NAME IS THE LOUDEST THING, measured and not asserted: nothing on a
         card may be drawn larger than its own name. */
      r.cityNameLoud = cards.filter((el) => {
        const n = el.querySelector("[data-city-name]");
        if (!n) return true;
        const size = parseFloat(getComputedStyle(n).fontSize);
        return [...el.querySelectorAll("*")].some((e) => e !== n && e.getClientRects().length && e.children.length === 0 && (e.textContent || "").trim() && parseFloat(getComputedStyle(e).fontSize) > size + 0.5);
      }).length;
    }
    if (r.kind === "range-strip") {
      const labels = [...card.querySelectorAll("[data-mark-label]")].map((el) => el.getBoundingClientRect());
      const figs = [...card.querySelectorAll("[data-mark]")].map((el) => el.getBoundingClientRect());
      const overlaps = (rs) => { let n = 0; for (let a = 0; a < rs.length; a++) for (let b = a + 1; b < rs.length; b++) { const A = rs[a], B = rs[b]; if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) n++; } return n; };
      r.stripOverlaps = overlaps(labels) + overlaps(figs);
      const cb = card.getBoundingClientRect();
      r.stripOut = [...labels, ...figs].filter((b) => b.left < cb.left - 1 || b.right > cb.right + 1).length;
    }
    if (r.kind === "tiers-table") {
      const trs = [...card.querySelectorAll("[data-tier-row]")].filter((el) => el.getClientRects().length);
      r.tierRows = trs.map((el) => Math.round(el.getBoundingClientRect().height));
      /* THE HEADS ARE READ OFF THE DOM (plan step 33's third dispatch,
         2026-09-18): the table's heads are the caller's words since the
         figures shape landed (the trade's "How many" and "Pay a year" beside
         the country's "Fee", "Time", "Paperwork"), so the check reads every
         stamped `[data-head]`, the count the root declares in `data-heads`,
         and whether any head's text appears in more than one visible span
         of the card (said once, PART 5). The old literal regex would have
         counted the trade's card as a table with no heads. */
      const root = card.matches("[data-archetype='tiers-table']") ? card : card.querySelector("[data-archetype='tiers-table']");
      r.headsDeclared = root ? Number(root.getAttribute("data-heads") || "0") : 0;
      const heads = [...card.querySelectorAll("[data-head]")].filter((el) => el.getClientRects().length).map((el) => (el.textContent || "").trim());
      r.headsCount = heads.length;
      r.headsRepeated = heads.filter((h) => h && [...card.querySelectorAll("span")].filter((el) => el.getClientRects().length && (el.textContent || "").trim() === h).length > 1);
      /* THE DASHES: a figure cell printing an en dash, and whether the card
         says once what a dash means (PART 5 BLANKS; the team's no-median
         line). Read as text, since the line is the card's own words. */
      r.tierShape = root ? root.getAttribute("data-shape") : null;
      r.tierDashes = [...card.querySelectorAll("[data-col]")].filter((el) => el.getClientRects().length && (el.textContent || "").trim() === "–").length;
      /* The line is the card's, not the table's: the enclosing section card (the Box the table sits in), or the table when it stands alone. */
      const box = card.closest('[class*="rounded-[14px]"]') || card;
      r.tierDashLine = /dash/i.test(box.textContent || "");
    }
    if (r.kind === "spectra-table") {
      const trs = [...card.querySelectorAll("[data-spectrum-row]")].filter((el) => el.getClientRects().length);
      r.spectraRows = trs.map((el) => Math.round(el.getBoundingClientRect().height));
      r.dotsOut = 0; r.poleWraps = 0; const dotColors = new Set();
      for (const tr of trs) {
        const track = tr.querySelector("[data-track]"); const dot = tr.querySelector("[data-dot]");
        if (track && dot) { const t = track.getBoundingClientRect(), d = dot.getBoundingClientRect(); if (d.left < t.left - 0.5 || d.right > t.right + 0.5) r.dotsOut++; dotColors.add(getComputedStyle(dot).backgroundColor); }
        for (const p of tr.querySelectorAll("[data-pole]")) { const ps = getComputedStyle(p); const lh = parseFloat(ps.lineHeight) || parseFloat(ps.fontSize) * 1.25; if (p.getBoundingClientRect().height > lh * 1.5) r.poleWraps++; }
      }
      r.dotColors = dotColors.size;
    }
    if (r.kind === "note-list") {
      const lineOf = (el) => { const cs = getComputedStyle(el); return parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3; };
      r.noteCount = card.querySelectorAll("[data-note]").length;
      r.labelWraps = [...card.querySelectorAll("[data-note-label]")].filter((el) => el.getBoundingClientRect().height > lineOf(el) * 1.5).length;
      r.factLines = [...card.querySelectorAll("[data-note-fact]")].map((el) => Math.round(el.getBoundingClientRect().height / lineOf(el)));
    }
    if (r.kind === "terminus") {
      const doors = [...card.querySelectorAll("[data-door]")];
      r.doorCount = doors.length;
      r.pillCount = doors.filter((d) => d.getAttribute("data-door-kind") === "pill").length;
      r.doorFirstWords = doors.map((d) => (d.textContent || "").trim().split(/\s+/)[0].toLowerCase());
      r.doorLines = doors.map((d) => { const cs = getComputedStyle(d); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5; const inner = d.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom); return Math.round(inner / lh); });
    }
    if (r.kind === "pay-bars") {
      const root = card.querySelector("[data-archetype='pay-bars']");
      r.payWithheld = root?.getAttribute("data-withheld") === "1";
      r.payBars = [...card.querySelectorAll("[data-bar]")].length;
      r.payOut = [...card.querySelectorAll("[data-track]")].filter((t) => { const b = t.querySelector("[data-bar]"); if (!b) return false; const tb = t.getBoundingClientRect(), bb = b.getBoundingClientRect(); return bb.right > tb.right + 0.5 || bb.left < tb.left - 0.5; }).length;
      const edge = card.querySelector("[data-edge]"); const cb2 = card.getBoundingClientRect();
      r.payEdgeOut = edge ? (edge.getBoundingClientRect().right > cb2.right + 1 || edge.scrollWidth > edge.clientWidth + 1 ? 1 : 0) : 0;
      const txt = card.textContent || ""; r.payWords = (/Minimum salary/.test(txt) ? 1 : 0) + (/Average salary/.test(txt) ? 1 : 0);
      /* THE PLACEMENT LINES (plan step 31's sixth dispatch, 2026-09-18): every
         line on the card, how many drawn bars have one in their own column
         (the track's parent, the same element the PLACEMENT law in
         check_model_laws.mjs reads), and every line's text for the shape. */
      const lines = [...card.querySelectorAll("[data-placement]")].filter((el) => el.getClientRects().length);
      r.payPlacements = lines.length;
      r.payPlacementTexts = lines.map((el) => (el.textContent || "").trim());
      r.payBarsWithLine = [...card.querySelectorAll("[data-track]")].filter((t) => t.querySelector("[data-bar]") && t.parentElement && t.parentElement.querySelector("[data-placement]")).length;
    }
    if (r.kind === "kv-grid") {
      const gs = [...card.querySelectorAll("[data-kv-group]")].filter((g) => g.getClientRects().length);
      const tops = gs.map((g) => Math.round(g.getBoundingClientRect().top));
      const sideBySide = gs.length > 1 && Math.max(...tops) - Math.min(...tops) <= 2;
      r.kvSide = sideBySide;
      r.kvFirstFigTops = sideBySide ? gs.map((g) => { const f = g.querySelector("[data-kv-cell] .fig"); return f ? Math.round(f.getBoundingClientRect().top) : null; }).filter((t) => t != null) : [];
    }
    if (r.kind === "compare-table") {
      const visible = [...card.querySelectorAll("[data-row]")].filter((el) => el.getBoundingClientRect().height > 0);
      r.tableRows = visible.map((el) => Math.round(el.getBoundingClientRect().height));
    }
    if (r.kind === "income-breakdown") {
      r.incomeSegs = [...card.querySelectorAll("[data-seg-key]")].map((el) => ({
        key: el.getAttribute("data-seg-key"),
        share: parseFloat(el.getAttribute("data-seg-share")),
        widthPx: el.getBoundingClientRect().width,
      }));
      r.incomeLegendKeys = [...card.querySelectorAll("[data-legend-key]")].map((el) => el.getAttribute("data-legend-key"));
      /* THE WITHHELD STATE (plan step 33's third dispatch, 2026-09-18): the
         root declares it and the stated line stands where the bar would. */
      const root = card.matches("[data-archetype='income-breakdown']") ? card : card.querySelector("[data-archetype='income-breakdown']");
      r.incomeWithheld = !!root && root.getAttribute("data-withheld") === "1";
      r.incomeLine = [...card.querySelectorAll("[data-withheld-line]")].filter((el) => el.getClientRects().length && (el.textContent || "").trim()).length;
    }
    /* THE MARK LIST (B3, 2026-09-10). Read off the DRAWN boxes, except where
       the drawing is deliberately compared against the card's own declaration
       (the row count, the marks flag): a fault that only shows as "it stopped
       drawing at this width" cannot be named at all without both halves. */
    if (r.kind === "mark-list") {
      r.mlDeclared = Number(card.getAttribute("data-rows") || "0");
      r.mlMarksDeclared = card.getAttribute("data-marks") === "1";
      r.mlWithheld = Number(card.getAttribute("data-withheld") || "0");
      r.mlWithheldLine = !!card.querySelector("[data-withheld-line]");
      r.mlRows = [...card.querySelectorAll("[data-row]")].filter((el) => el.getClientRects().length).map((el) => {
        const b = el.getBoundingClientRect();
        const figEl = el.querySelector(".fig");
        /* ONLY A VISIBLE MARK COUNTS, the same getClientRects() test the rest
           of this walk uses. Found by planting: a mark hidden with
           `display:none` still answers querySelector and still has a (zero)
           rect, so an unfiltered read counted ten marks of height zero, called
           them all the same height and reported nothing. */
        const markEl = [...el.querySelectorAll("[data-mark]")].find((m) => m.getClientRects().length > 0) || null;
        return {
          key: el.getAttribute("data-row"),
          h: Math.round(b.height * 100) / 100,
          /* A DECLARED ROW HEIGHT MAKES EQUAL HEIGHTS TRIVIALLY TRUE, so this
             is the half of the law that can still fail: how far the row's own
             content runs past the box it was given. */
          spill: Math.max(0, el.scrollHeight - el.clientHeight),
          fig: figEl ? (figEl.textContent || "").trim() : "",
          /* THE MARK'S OWN BOX, never the cell holding it: that cell is a grid
             item stretched to the track and to the row, so measuring it would
             compare a constant against itself. */
          markH: markEl ? Math.round(markEl.getBoundingClientRect().height * 100) / 100 : null,
          /* AND ITS WIDTH, since 2026-09-11. This used to be deliberately
             unmeasured; see the MARK SIZE note below for why that reversed. */
          markW: markEl ? Math.round(markEl.getBoundingClientRect().width * 100) / 100 : null,
        };
      });
    }
    /* THE DRAWN BLOCKED SEAT (8.2; plan step 31). Read off the card: the
       stated lines it draws (one, by its law), the words on the first, every
       visible `.fig` (none, by its law; the 30/40 clause reads r.sizes, which
       the walk above already holds), and whether the foot that names the
       requirement is there. */
    if (r.kind === "blocked-seat") {
      const lines = [...card.querySelectorAll("[data-seat-line]")].filter((el) => el.getClientRects().length);
      r.seatLines = lines.length;
      r.seatWords = lines.length ? (lines[0].textContent || "").trim().split(/\s+/).filter(Boolean).length : 0;
      r.seatFigs = [...card.querySelectorAll(".fig")].filter((f) => f.getClientRects().length).length;
      r.seatFoot = [...card.querySelectorAll("[data-foot]")].some((f) => f.getClientRects().length && (f.textContent || "").trim());
    }
    /* THE BENTO CLUSTER, MEASURED FROM THE BOXES THE BROWSER DREW (2026-09-10).
       BentoBand.tsx proves its own DECLARED spans tile before it renders a
       thing, and that proof is worth nothing here: the declaration is the
       thing under test. Everything below is read off `getBoundingClientRect`,
       at every width, so a class that never reached the stylesheet, a
       breakpoint that fires at the wrong place, or a cell that stops drawing
       on a phone is caught by the geometry rather than by the intent.

       THE GUTTER IS NOT A HOLE. Cells sit 32px apart, the band's own rung of
       the spacing ladder, so the drawn boxes never touch and a naive coverage
       test would call every gutter a gap. The gutter is INFERRED from the
       drawing itself , the smallest positive distance from one cell's right
       edge to another's left, and the same vertically , and every rect is
       grown by half of it. A correct tiling then meets exactly; a real hole
       does not close. Inferring it rather than hardcoding 32 means the rule
       still holds the day the ladder changes. */
    if (r.kind === "bento-band") {
      const cellEls = [...card.querySelectorAll("[data-bento-cell]")].filter((el) => el.getClientRects().length);
      r.bentoDeclared = Number(card.getAttribute("data-bento-cells") || "0");
      r.bentoDrawn = cellEls.length;
      const raw = cellEls.map((el) => { const b = el.getBoundingClientRect(); return { key: el.getAttribute("data-bento-cell"), left: b.left, right: b.right, top: b.top, bottom: b.bottom }; });
      const minPositive = (vals) => { const p = vals.filter((v) => v > 0.5); return p.length ? Math.min(...p) : 0; };
      const gaps = [];
      const vgaps = [];
      for (const a of raw) for (const b of raw) { if (a === b) continue; gaps.push(b.left - a.right); vgaps.push(b.top - a.bottom); }
      const gx = minPositive(gaps) / 2;
      const gy = minPositive(vgaps) / 2;
      const grown = raw.map((b) => ({ key: b.key, left: b.left - gx, right: b.right + gx, top: b.top - gy, bottom: b.bottom + gy }));
      const uniq = (xs) => [...new Set(xs.map((x) => Math.round(x * 100) / 100))].sort((a, b) => a - b);
      const xs = uniq(grown.flatMap((g) => [g.left, g.right]));
      const ys = uniq(grown.flatMap((g) => [g.top, g.bottom]));
      const gapPatches = [];
      const overlapPatches = [];
      for (let i = 0; i < xs.length - 1; i++) {
        for (let j = 0; j < ys.length - 1; j++) {
          const w2 = xs[i + 1] - xs[i], h2 = ys[j + 1] - ys[j];
          if (w2 <= 1 || h2 <= 1) continue; // a sliver from subpixel rounding, not a patch
          const cx = (xs[i] + xs[i + 1]) / 2, cy = (ys[j] + ys[j + 1]) / 2;
          const hits = grown.filter((g) => cx > g.left && cx < g.right && cy > g.top && cy < g.bottom);
          if (hits.length === 0) gapPatches.push(`${Math.round(w2)}x${Math.round(h2)} at ${Math.round(cx)},${Math.round(cy)}`);
          if (hits.length > 1) overlapPatches.push(`${hits.map((h3) => h3.key).join(" and ")} share ${Math.round(w2)}x${Math.round(h2)}`);
        }
      }
      r.bentoGaps = gapPatches;
      r.bentoOverlaps = overlapPatches;
      /* THE OUTER EDGE, a second and different measurement of the same law: the
         cells' own areas must add up to the rectangle they occupy. The lattice
         test above finds a hole INSIDE the cluster; this finds a RAGGED one,
         a cluster whose union is an L because a row lost a cell when it
         reflowed. Both are needed: a shape can be locally sound and still not
         be a rectangle. */
      const union = grown.length ? { left: Math.min(...grown.map((g) => g.left)), right: Math.max(...grown.map((g) => g.right)), top: Math.min(...grown.map((g) => g.top)), bottom: Math.max(...grown.map((g) => g.bottom)) } : null;
      r.bentoArea = grown.reduce((a, g) => a + (g.right - g.left) * (g.bottom - g.top), 0);
      r.bentoUnionArea = union ? (union.right - union.left) * (union.bottom - union.top) : 0;
      r.bentoUnion = union ? `${Math.round(union.right - union.left)}x${Math.round(union.bottom - union.top)}` : "";
    }
    /* THE FOUNDER'S PLUS lives at the FOOT of another archetype's card once a
       real section adopts it (review finding 2, 2026-09-08): the outer card's
       kind then wins and is never "detail-panel", so gating collection on
       r.kind would stop seeing the panel the moment it is used as designed.
       Find it wherever it sits , `card` itself for the archetype's own
       standalone stories, or a descendant once it is nested , the same
       precedent as the kv-grid nested inside an answer card, above. */
    const panel = r.kind === "detail-panel" ? card : card.querySelector("[data-archetype='detail-panel']");
    r.hasDetailPanel = !!panel;
    if (panel) {
      const det = panel.querySelector("details");
      r.openOnLoad = !!det && det.hasAttribute("open");
      const sum = det && det.querySelector("summary");
      r.summaryHit = sum ? Math.round(sum.getBoundingClientRect().height) : 0;
      /* THE MEASUREMENT (review finding 1): a line count is the INNER box ,
         padding stripped , divided by the line-height, exactly as doorLines
         does it above; the full-box version reads padding as an extra line
         and reds a genuinely one-line summary as wrapped. */
      r.summaryLines = sum ? (() => {
        const scs = getComputedStyle(sum);
        const slh = parseFloat(scs.lineHeight) || parseFloat(scs.fontSize) * 1.5;
        const inner = sum.getBoundingClientRect().height - parseFloat(scs.paddingTop) - parseFloat(scs.paddingBottom);
        return Math.max(1, Math.round(inner / slh));
      })() : 1;
      r.panelGraphics = det ? det.querySelectorAll("svg, canvas, img, [data-archetype]").length : 0;
      /* THE OPENED PASS (review finding 3): a closed <details> reports zero
         client rects for every descendant, so the walk at the top of this
         loop never sees a row behind the plus , a wall of prose or an
         off-ladder size could hide there forever. Open it, fold the newly
         visible body into the SAME fields (sizes/overflow/accents) the rules
         below already read for every card regardless of kind, read the row
         count it declares against the rows it actually draws open, then put
         it back the way a reader found it. */
      if (det) {
        const wasOpen = det.open;
        det.open = true;
        /* NOT KEYED TO A dl (re-review, 2026-09-08). The panel's body is a
           definition list today, but the law this component serves is that a
           disclosure moves BULLET TEXT, so a future body could be a list. If
           this selector missed, the opened pass would walk nothing AND leave
           the row fields undefined, so ROWS CUT would stop too, and the whole
           finding it exists to close would return invisibly. Fall back to the
           details element itself, which always exists here. */
        const body = det.querySelector("dl") ?? det;
        if (body) {
          for (const el of [body, ...body.querySelectorAll("*")]) {
            if (el.getClientRects().length === 0) continue;
            const bcs = getComputedStyle(el);
            if (el.scrollWidth > el.clientWidth + 1 && bcs.overflowX !== "hidden" && bcs.display !== "inline") r.overflow.push(el.className.toString().slice(0, 40));
            const btxt = (el.textContent || "").trim();
            if (btxt && el.children.length === 0) {
              const bfs = parseFloat(bcs.fontSize); r.sizes.push(bfs);
              if (bcs.color === accentRgb) r.accents++;
            }
          }
          r.panelRowsExpect = Number(panel.getAttribute("data-rows") || "0");
          r.panelRowsDrawn = [...body.querySelectorAll("[data-detail-row]")].filter((row) => row.getClientRects().length).length;
        }
        det.open = wasOpen;
      }
    }
    // the largest empty rectangle inside the card (E6), on a 6px grid
    const cb = card.getBoundingClientRect(); const cs = getComputedStyle(card);
    const x0 = cb.left + parseFloat(cs.paddingLeft), x1 = cb.right - parseFloat(cs.paddingRight), y0 = cb.top + parseFloat(cs.paddingTop), y1 = cb.bottom - parseFloat(cs.paddingBottom);
    const W = x1 - x0, H = y1 - y0, COLS = 48, ROW = 6; const nRows = Math.max(1, Math.round(H / ROW));
    const grid2 = Array.from({ length: nRows }, () => new Uint8Array(COLS));
    const mark = (b) => {
      const c0 = Math.max(0, Math.floor((b.left - x0) / W * COLS)), c1 = Math.min(COLS - 1, Math.ceil((b.right - x0) / W * COLS) - 1);
      const r0 = Math.max(0, Math.floor((b.top - y0) / ROW)), r1 = Math.min(nRows - 1, Math.ceil((b.bottom - y0) / ROW) - 1);
      for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) grid2[rr][cc] = 1;
    };
    for (const el of card.querySelectorAll("*")) {
      if (el.getClientRects().length === 0) continue;
      const es = getComputedStyle(el);
      /* A HAIRLINE IS INK: a table's row rules and a list's dividers break the
         emptiness the eye would otherwise read as a hole, which is the same
         rule the site's own emptiness gate states. */
      const b0 = el.getBoundingClientRect();
      if (parseFloat(es.borderBottomWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(es.borderBottomColor)) mark({ left: b0.left, right: b0.right, top: b0.bottom - 2, bottom: b0.bottom + 2 });
      if (parseFloat(es.borderTopWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(es.borderTopColor)) mark({ left: b0.left, right: b0.right, top: b0.top - 2, bottom: b0.top + 2 });
      const txt = (el.textContent || "").trim(); const isLeaf = el.children.length === 0 || el.tagName === "svg" || el.tagName === "IMG";
      if (!isLeaf || (!txt && el.tagName !== "svg" && el.tagName !== "IMG" && !es.backgroundColor.match(/rgba?\((?!0, 0, 0, 0)/))) continue;
      const b = el.getBoundingClientRect(); if (b.width === 0 || b.height === 0) continue;
      const c0 = Math.max(0, Math.floor((b.left - x0) / W * COLS)), c1 = Math.min(COLS - 1, Math.ceil((b.right - x0) / W * COLS) - 1);
      const r0 = Math.max(0, Math.floor((b.top - y0) / ROW)), r1 = Math.min(nRows - 1, Math.ceil((b.bottom - y0) / ROW) - 1);
      for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) grid2[rr][cc] = 1;
    }
    // largest empty rectangle (histogram method)
    let best = { area: 0, w: 0, h: 0 }; const hts = new Array(COLS).fill(0);
    for (let rr = 0; rr < nRows; rr++) {
      for (let cc = 0; cc < COLS; cc++) hts[cc] = grid2[rr][cc] ? 0 : hts[cc] + 1;
      const st = [];
      for (let cc = 0; cc <= COLS; cc++) {
        const h = cc < COLS ? hts[cc] : 0;
        while (st.length && hts[st[st.length - 1]] >= h) { const top = st.pop(); const height = hts[top]; const width = st.length ? cc - st[st.length - 1] - 1 : cc; const area = height * width; if (area > best.area) best = { area, w: width, h: height }; }
        st.push(cc);
      }
    }
    r.hole = { wPx: Math.round(best.w / COLS * W), hPx: best.h * ROW, cardW: Math.round(W), cardH: Math.round(H) };
    out.push(r);
  }
  const cut = [...document.querySelectorAll("[data-stories] [data-expect-rows]")].filter((el) => el.getClientRects().length && stories.includes(el.closest("[data-story]"))).map((el) => { const expect = Number(el.getAttribute("data-expect-rows")); const drawn = [...el.querySelectorAll("[data-row]")].filter((r) => r.getClientRects().length).length; const story = el.closest("[data-story]"); const inst = story?.closest("[data-stories]")?.getAttribute("data-stories") + ":" + story?.getAttribute("data-story"); return { inst, expect, drawn }; }).filter((c) => c.drawn < c.expect);
  return { out, cut, pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
}

const browser = await chromium.launch();
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  /* Lazy images never enter a headless viewport; force them so a broken path
     is a red and a slow one is not. */
  await page.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* reported by the check */ } } });
  const { out, cut, pageScroll } = await page.evaluate(inPage, STORY_SELECTOR);
  /* A TARGETED RUN PROVES IT WALKED THE STORY. Zero reds on one story is
     also what a selector that matched nothing would report, so the walk must
     have found exactly the stories the census names, and says so per width. */
  if (ONLY != null) {
    if (out.length !== instances.length) {
      console.error(`check_archetypes --only=${ONLY}: the page holds ${out.length} stor${out.length === 1 ? "y" : "ies"} matching ${STORY_SELECTOR} and the census names ${instances.length}; the render and the census disagree, so nothing was judged.`);
      await browser.close();
      process.exit(2);
    }
    for (const r of out) console.log(`  ${r.inst}@${w}: measured, ${r.kind ? `card ${r.kind}, ${r.sizes.length} text leaves` : r.selfOmit ? "self-omits, no card" : "no card"}`);
  }
  for (const c of cut) red(c.inst, w, "ROWS CUT", `the drawing declares ${c.expect} rows and draws ${c.drawn}`);
  if (pageScroll) red("page", w, "BOTCHED MOBILE", "the page scrolls sideways");
  for (const r of out) {
    if (r.overflow.length) red(r.inst, w, "BOTCHED MOBILE", `overflowing: ${r.overflow.join(" | ")}`);
    for (const s of new Set(r.sizes)) if (!LADDER.has(Math.round(s))) red(r.inst, w, "LADDER", `font size ${s}px is not on the ladder`);
    if (r.kind === "answer-card") {
      if (r.level === "section" && r.h1 > 0) red(r.inst, w, "HEADLINE", `a section-level answer card draws ${r.h1} h1`);
      if (r.level === "page" && r.h1 !== 1) red(r.inst, w, "HEADLINE", `${r.h1} h1 on a page-level answer card`);
      /* The state word's cause is the page's: a country's answer card lacks a regime row; a trade cell's (keyed cell:<handle>:take since plan step 33, 2026-09-18) lacks trusted money for the cell (cell_view.ts `moneyShown`); an industry's (keyed industry:<handle>:take since plan step 34, 2026-09-18) lacks a net on both the shard's ladder and the sector profile (trade_net.ts; no trade today), so the note names the right gap for the data track. */
      if (r.state === "no-answer") { if (w === WIDTHS[0]) data(r.inst, "NO ANSWER", r.inst.includes(":cell:") ? "money is not shown for this cell (an untrusted read, trust.ts), so the take-home is withheld and the card shows the state word" : r.inst.includes(":industry:") ? "neither the shard's ladder nor the sector profile holds a net for this trade, so the keep is withheld and the card shows the state word" : "no small-business regime row is on file; the card shows the state word"); }
      else if (r.answerSizes.length !== 1) red(r.inst, w, "NO HIERARCHY", `${r.answerSizes.length} answer figures`);
      else { const next = Math.max(...r.sizes.filter((s) => s < r.answerSizes[0] - 0.5)); if (r.answerSizes[0] / next < 1.6) red(r.inst, w, "NO HIERARCHY", `answer ${r.answerSizes[0]} against ${next}, under 1.6x`); }
    }
    if (r.kind === "ranked-bars" && w === WIDTHS[0]) {
      for (const b of r.bars) if (b.ruleTop != null && b.top < b.ruleTop - 1) red(r.inst, w, "WORLD MAX", `bar ${b.key} rises above the world's-best rule`);
    }
    /* THE PILL LAW (task 12, 2026-09-10), replacing the old "exactly one
       accent text" rule: the card's one mark is a BLACK PILL now, not a
       colour, so a clean card carries ZERO accent text. EXACTLY ONE PILL PER
       CARD, ON THE REFERENCE MEMBER, WHETHER THAT PILL SITS ON THE NAME OR ON
       THE FIGURE (widened, task 13 fix wave): a set rebased onto one of its
       own members prints no figure for that member, so its pill moves to the
       name, and the rule follows the law rather than the reverse. It is not
       loosened by the move: both halves still hold, the count and the row it
       lands on, because the row is read from the pill's own `[data-row]`
       ancestor and compared against the card's declared leader. Checked at
       every width, not just 1280 like WORLD MAX above , the pill is drawn in
       every form (bar figure, wide table, phone table) and only one form is
       ever visible, so a fix that lands on one and forgets another must be
       caught at whichever width shows the broken one. */
    /* THE BARS AGREE WITH THEIR OWN NUMBERS (task 13 alignment fix,
       2026-09-10). Two halves of one law, because on this card they were one
       fault: every track on a ranked card starts at one left edge and runs one
       length, and the bars drawn in them rise in the order the values do. It
       is the check that was missing when each row carried the column template
       separately: the reference row's empty figure cell collapsed its middle
       column, its track began 40px left of its siblings' and ran 40px longer,
       and the CHEAPEST district drew a 150px bar against the 144px of a
       district that costs more , inverted, on a card that exists to be read by
       eye. Measured on the rendered page, not from the photograph.
       TOLERANCE: 1px, one device pixel. Every row is laid out from one
       template against one container width, so a genuine geometry difference
       is a whole column wide, tens of pixels (the fault above was 40), while
       the browser's own subpixel rounding of that one template is under a
       pixel; and an inversion under a pixel is not visible to the eye this
       rule protects. A tolerance loose enough to swallow a column would have
       let this defect through, which is the failure being closed.
       BLIND SPOT: `data-value` is the component's own declaration of what the
       bar draws, so this proves the DRAWING against the number the component
       holds, not against the figure the reader sees. A row whose declared
       value and printed figure disagreed would pass here; that is a data
       fault, and this is the geometry rule. */
    if (r.kind === "ranked-bars") {
      const RANK_TOL = 1;
      const rr = r.ranked || [];
      const tracked = rr.filter((x) => x.trackW != null);
      if (tracked.length > 1) {
        const lefts = tracked.map((x) => x.trackLeft), widths = tracked.map((x) => x.trackW);
        const dl = Math.max(...lefts) - Math.min(...lefts), dw = Math.max(...widths) - Math.min(...widths);
        if (dl > RANK_TOL || dw > RANK_TOL) red(r.inst, w, "TRACKS ADRIFT", `${tracked.length} tracks on one card at lefts ${Math.min(...lefts)}..${Math.max(...lefts)} and widths ${Math.min(...widths)}..${Math.max(...widths)}; one origin and one length, within ${RANK_TOL}px`);
      }
      const inverted = [];
      for (const a of rr) for (const b of rr) if (a.value > b.value && a.drawn < b.drawn - RANK_TOL) inverted.push(`${a.key} (${a.value}) draws ${a.drawn}px against ${b.key} (${b.value}) at ${b.drawn}px`);
      if (inverted.length) red(r.inst, w, "OUT OF ORDER", `${inverted.length} bar(s) drawn out of the order of their values: ${inverted[0]}`);
      /* THE FOCAL IS THE ONE EXCEPTION (plan step 33's second dispatch, 2026-09-18,
         MODEL.md 8.6 `04 open`): a ranked card may carry ONE accent figure of its
         own over the bars, the bill's total, the page's second loud moment, in
         the `[data-focal]` slot RankedBars draws for it; PART 6 then lights the
         leader's bar and hatches the rest, which is what a featured card already
         does. The rows' law is unchanged: accent text anywhere else on the card
         is still a row wearing colour, and the pill is still their one mark.
         Planted and watched go red the day it landed: the wide table's row
         figures in the accent colour on cell:london:open reddened "8
         accent-coloured text(s) off the focal" at 1280 and at 768 (the phone
         table is another span and was not planted), then restored. */
      if (r.accents - r.focalAccents > 0) red(r.inst, w, "ACCENT", `${r.accents - r.focalAccents} accent-coloured text(s) off the focal; the rows' one mark is a pill, not a colour`);
      if (r.focalAccents > 1) red(r.inst, w, "ACCENT", `${r.focalAccents} accent-coloured texts in the focal slot; a card holds one focal`);
      /* AT MOST ONE PILL, ON THE ROW THE CARD DECLARES (widened, task 14).
         Four clauses, in the order a fault is worth naming:
           a second pill is always a fault, whatever the card features , two
             marks are two answers;
           a pill on a row that is not the declared leader is always a fault,
             on either kind of card;
           a pill on a card that declares it features NOBODY is a fault, or
             the declaration would buy silence in one direction only;
           NO pill on a card that declares it features its leader is a fault.
         The loosening stops exactly there. "At most one" ALONE would let a
         card that has an answer quietly stop marking it, and would let a mark
         creep back onto a card that was deliberately unfeatured; the
         `data-feature` declaration is what makes both of those provable,
         and it is checked in BOTH directions so it cannot be used as an
         exemption. */
      if (r.pillCount > 1) red(r.inst, w, "ACCENT", `${r.pillCount} pills on the card; at most one, on the row it declares as its leader`);
      else if (r.pillCount === 1 && r.pillKey !== r.leaderKey) red(r.inst, w, "ACCENT", `the pill sits on "${r.pillKey}", not on the declared leader "${r.leaderKey}"`);
      else if (r.pillCount === 1 && r.feature === "none") red(r.inst, w, "ACCENT", `a pill on "${r.pillKey}" on a card that declares it features nobody; featuring one member of a set is a claim, and this card declares it has none to make`);
      else if (r.pillCount === 0 && r.feature === "leader") red(r.inst, w, "ACCENT", `no pill on a card that declares it features its leader ("${r.leaderKey}"); a card with no member to feature must say so (data-feature="none")`);
    }
    if (r.kind === "card-pager") {
      for (const row of r.cardRows || []) if (Math.max(...row) - Math.min(...row) > 2) red(r.inst, w, "UNEQUAL", `cards in one row at heights ${row.join(", ")}`);
      if (r.namesCut) red(r.inst, w, "BOTCHED MOBILE", `${r.namesCut} city name(s) cut`);
      if (r.brokenImage && r.brokenImage.length) red(r.inst, w, "IMAGE BROKEN", `image did not load: ${r.brokenImage.join(", ")}`);
      /* NO IMAGE BY DECLARATION (MODEL.md 8.3, `14 neighbourhoods`): a pager whose
         root says `data-images="none"` owes no photograph, and one drawn under
         that declaration is a red (planted once, 2026-09-18, by passing an
         image through a story with the component's guard lifted, and watched
         go red before the guard went back). The cities pager keeps the data
         red as it was. */
      if (r.images === "none") { if (r.imageCount > 0) red(r.inst, w, "IMAGE", `${r.imageCount} card(s) carry an image on a pager that declares it draws none`); }
      else if (w === WIDTHS[0] && r.noImage && r.noImage.length) data(r.inst, "IMAGE MISSING", `${r.noImage.length} card(s) without a photograph: ${r.noImage.join(", ")}`);
    }
    if (r.kind === "city-cards") {
      for (const row of r.cityRows || []) if (Math.max(...row) - Math.min(...row) > 2) red(r.inst, w, "UNEQUAL", `city cards in one row at heights ${row.join(", ")}`);
      if (r.cityNamesCut) red(r.inst, w, "BOTCHED MOBILE", `${r.cityNamesCut} city name(s) cut`);
      if (r.cityFlat && r.cityFlat.length) red(r.inst, w, "NOT TALL", `${r.cityFlat.length} card(s) drawn wider than tall enough to read as a vertical card: ratios ${r.cityFlat.join(", ")}`);
      if (r.cityForm === "rows" && r.cityCount >= 3) red(r.inst, w, "WRONG FORM", `${r.cityCount} cities drawn as wide rows; three or more fill a row of tall cards and must take it`);
      if (r.cityForm === "grid" && r.cityCount < 3) red(r.inst, w, "WRONG FORM", `${r.cityCount} city card(s) in the tall grid; below three they leave the unfilled right edge`);
      if (r.cityNameLoud) red(r.inst, w, "NO HIERARCHY", `${r.cityNameLoud} card(s) draw something larger than the city's own name`);
      /* IMAGE, INVERTED 2026-09-11. This rule read: "no city card carries an
         image; no page and no card on this site carries a photograph", his
         ruling of 2026-09-08. He reversed it for this card and this card only
         ("the cities should have their placeholder image ... blast the London in
         all of them"), so the rule now checks the same fact from the other side:
         the look he chose must carry one on EVERY card, and the two looks he did
         not choose must carry none, because a photograph behind the plate and
         the column would collapse three different questions into one. */
      const look = r.cityLook || "";
      const photos = r.cityPhotos || [];
      if (look === "field" && photos.length !== r.cityCount) red(r.inst, w, "IMAGE", `${photos.length} of ${r.cityCount} city card(s) carry a photograph; the field look carries one on every card (his ruling of 2026-09-11)`);
      if (look !== "field" && photos.length) red(r.inst, w, "IMAGE", `${photos.length} city card(s) carry a photograph in the "${look}" look; the photograph belongs to the field look alone`);
      if (r.cityStrayImages && r.cityStrayImages.length) red(r.inst, w, "IMAGE", `${r.cityStrayImages.length} city card(s) carry an image that is not the declared photograph: ${r.cityStrayImages.join(", ")}`);
      if (r.cityNameRatio != null && r.cityNameRatio < 4.5) red(r.inst, w, "CONTRAST", `the city name reads ${r.cityNameRatio} to 1 over the photograph's darkest region (backdrop rgb(${(r.cityBackdrop || []).join(", ")})), under the 4.5 floor; the veil and the wash over the picture are what set this`);
      /* FOR THE DATA TRACK, NOT THE DRAWING: the placeholder closes the hole on
         the page and must not close the open question. Counted at one width. */
      if (w === WIDTHS[0] && r.cityPhotoPlaceholders > 0) data(r.inst, "IMAGE MISSING", `${r.cityPhotoPlaceholders} of ${r.cityCount} card(s) show the stand-in photograph, not that city's own`);
    }
    if (r.kind === "range-strip") {
      if (r.stripOverlaps) red(r.inst, w, "NO HIERARCHY", `${r.stripOverlaps} overlapping label(s) on the strip`);
      if (r.stripOut) red(r.inst, w, "BOTCHED MOBILE", `${r.stripOut} strip label(s) outside the card`);
    }
    if (r.kind === "tiers-table") {
      const hs = r.tierRows || []; if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 2) red(r.inst, w, "UNEQUAL", `tier rows at heights ${hs.join(", ")}`);
      if (r.headsCount !== r.headsDeclared) red(r.inst, w, "REPETITION", `${r.headsCount} head(s) drawn against the ${r.headsDeclared} the table declares`);
      if ((r.headsRepeated || []).length) red(r.inst, w, "REPETITION", `a head said more than once: ${r.headsRepeated.join(", ")}`);
      /* The figures shape only: the registering shape prints a dash for a fee or a wait not held and its card carries no line saying so today (the country's `#setup`, a standing PART 5 finding recorded on plan step 33's third dispatch, not this rule's to open on a card it did not draw). */
      if (r.tierShape === "figures" && r.tierDashes > 0 && !r.tierDashLine) red(r.inst, w, "PROMISE", `${r.tierDashes} dash(es) in the figure columns and no line saying what a dash means`);
    }
    if (r.kind === "spectra-table") {
      const hs = r.spectraRows || []; if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 2) red(r.inst, w, "UNEQUAL", `spectrum rows at heights ${hs.join(", ")}`);
      if (r.dotsOut) red(r.inst, w, "OFF TRACK", `${r.dotsOut} dot(s) outside the track`);
      if (r.poleWraps) red(r.inst, w, "BOTCHED MOBILE", `${r.poleWraps} pole word(s) wrap to a second line`);
      if (r.dotColors > 1) red(r.inst, w, "ACCENT", `${r.dotColors} dot colours in one table`);
    }
    if (r.kind === "note-list") {
      if (r.labelWraps) red(r.inst, w, "WALL OF TEXT", `${r.labelWraps} label(s) wrap: a label that wraps is a sentence`);
      const walls = (r.factLines || []).filter((n) => n > 4).length; if (walls) red(r.inst, w, "WALL OF TEXT", `${walls} fact(s) run past four lines`);
      if (r.noteCount > 5) red(r.inst, w, "OVERLOAD", `${r.noteCount} notes, over five`);
    }
    if (r.kind === "terminus") {
      if (r.doorCount > 3) red(r.inst, w, "OVERLOAD", `${r.doorCount} doors, over three`);
      if (r.pillCount > 1) red(r.inst, w, "NO HIERARCHY", `${r.pillCount} pills; one door is the heavy one`);
      const fw = r.doorFirstWords || []; if (new Set(fw).size !== fw.length) red(r.inst, w, "REPETITION", `doors share a first word: ${fw.join(", ")}`);
      const cap = w >= 768 ? 1 : 2; const wrapped = (r.doorLines || []).filter((n) => n > cap).length; if (wrapped) red(r.inst, w, "BOTCHED MOBILE", `${wrapped} door(s) run past ${cap} line(s)`);
    }
    if (r.kind === "pay-bars") {
      if (r.payOut) red(r.inst, w, "WORLD MAX", `${r.payOut} fill(s) outside the track`);
      if (r.payEdgeOut) red(r.inst, w, "BOTCHED MOBILE", "the edge label is cut or outside the card");
      if (r.payWithheld && r.payBars) red(r.inst, w, "PROMISE", "a withheld pair draws a bar");
      if (!r.payWithheld && r.payBars === 2 && r.payWords !== 2) red(r.inst, w, "REPETITION", `the two words appear ${r.payWords} times, not twice`);
      /* PLACEMENT (MODEL.md PART 6 decision 2, PART 9 clauses 5 and 37; plan
         step 31's sixth dispatch, 2026-09-18): a placement line beside every
         drawn bar, in the bar's own column; none on a withheld pair and none
         on the one-figure form, which draw no track to place a figure on;
         and every line in the one shape, the same pattern
         tests/spine/placement.test.ts holds the builder to (nine tenths in
         words, the singular for one, the lowest tenth its own sentence).
         Planted once (the average's line withheld in PayBars.tsx) and seen
         red at all three widths before this was trusted. */
      const SHAPE = /^(Higher than (one (country|city)|(two|three|four|five|six|seven|eight|nine) (countries|cities)) in ten\.|Among the lowest tenth\.)$/;
      if (r.payBars > 0 && r.payBarsWithLine !== r.payBars) red(r.inst, w, "PLACEMENT", `a placement line beside ${r.payBarsWithLine} of ${r.payBars} drawn bars; every bar on a world track carries one in its own column`);
      if (r.payBars === 0 && r.payPlacements > 0) red(r.inst, w, "PLACEMENT", `${r.payPlacements} placement line(s) with no bar to sit beside${r.payWithheld ? " (a withheld pair)" : " (the one-figure form)"}`);
      for (const t of r.payPlacementTexts || []) if (!SHAPE.test(t)) red(r.inst, w, "PLACEMENT", `a placement line off the one shape: "${t}"`);
    }
    if (r.kind === "kv-grid" && r.kvSide) {
      const t = r.kvFirstFigTops || []; if (t.length > 1 && Math.max(...t) - Math.min(...t) > 2) red(r.inst, w, "UNEQUAL", `groups side by side with first figures at tops ${t.join(", ")}`);
    }
    if (r.kind === "compare-table" && r.tableRows.length > 1) {
      const hs = r.tableRows; if (Math.max(...hs) - Math.min(...hs) > 2) red(r.inst, w, "UNEQUAL", `table rows at heights ${hs.join(", ")}`);
    }
    if (r.kind === "blocked-seat") {
      /* One rule, its clauses the seat's own law (BlockedSeat.tsx's header):
         a seat states one line, under fifteen words, prints no figure at any
         rung, and names in its foot what it waits on. The 30/40 clause is
         what makes "no figure" measurable when a future edit reaches for a
         Fig-less loud number: a size on the focal or answer rung is a figure
         whatever the class says. */
      if (r.seatLines !== 1) red(r.inst, w, "BLOCKED SEAT", `${r.seatLines} stated lines; a seat states exactly one`);
      if (r.seatWords >= 15) red(r.inst, w, "BLOCKED SEAT", `the stated line runs ${r.seatWords} words; it is under fifteen`);
      if (r.seatFigs) red(r.inst, w, "BLOCKED SEAT", `${r.seatFigs} figure(s) on a seat whose law is no figure`);
      const loud = r.sizes.filter((s) => Math.abs(s - 30) < 0.5 || Math.abs(s - 40) < 0.5).length;
      if (loud) red(r.inst, w, "BLOCKED SEAT", `${loud} element(s) at 30 or 40 on a seat that holds no figure`);
      if (!r.seatFoot) red(r.inst, w, "BLOCKED SEAT", "no foot naming the requirement the seat waits on");
    }
    if (r.kind === "income-breakdown") {
      const segs = r.incomeSegs || [];
      // THE WITHHELD STATE, both ways: a withheld card draws no segment and
      // states its line; a card that is not withheld draws its segments and
      // states none. Planted once (the line withheld in IncomeBreakdown.tsx)
      // and seen red before this was trusted.
      if (r.incomeWithheld && segs.length) red(r.inst, w, "PROMISE", "a withheld breakdown draws segments");
      if (r.incomeWithheld && !r.incomeLine) red(r.inst, w, "PROMISE", "a withheld breakdown with no stated line where the bar would stand");
      if (!r.incomeWithheld && !segs.length) red(r.inst, w, "PROMISE", "a breakdown with no segments and no withheld line");
      if (!r.incomeWithheld && r.incomeLine) red(r.inst, w, "PROMISE", "a stated withheld line on a breakdown that draws its bar");
      // RULE 1, PLANTED FAULT PROVED (task-11-report.md): a segment set
      // summing to 130 was fed through a temporary story and reded here
      // before this line was trusted.
      const sum = segs.reduce((a, s) => a + (Number.isFinite(s.share) ? s.share : 0), 0);
      if (segs.length && Math.abs(sum - 100) > 0.5) red(r.inst, w, "DOES NOT ADD UP", `segments plus net sum to ${sum.toFixed(2)}, not 100`);
      // RULE 2 (the drawn count matching the declared count at every width)
      // is the shared ROWS CUT mechanism above, fed by this card's own
      // data-expect-rows/data-row pair; no separate rule needed here.
      // RULE 3, PLANTED FAULT PROVED: a segment forced to a 0.4-percent
      // share rendered under six pixels wide and reded here before this
      // line was trusted.
      const widths = segs.map((s) => s.widthPx).filter((n) => Number.isFinite(n));
      if (widths.length) { const thinnest = Math.min(...widths); if (thinnest < 6) red(r.inst, w, "SLIVER", `a segment renders ${thinnest.toFixed(1)}px wide, under 6`); }
      // RULE 4, PLANTED FAULT PROVED: a legend entry deleted by hand, and a
      // bar segment added with no legend entry, each reded here in turn
      // before this line was trusted.
      const segKeys = segs.map((s) => s.key).sort();
      const legKeys = (r.incomeLegendKeys || []).slice().sort();
      const missing = segKeys.filter((k) => !legKeys.includes(k));
      const extra = legKeys.filter((k) => !segKeys.includes(k));
      if (missing.length) red(r.inst, w, "LEGEND MISMATCH", `drawn but not named in the legend: ${missing.join(", ")}`);
      if (extra.length) red(r.inst, w, "LEGEND MISMATCH", `named in the legend but not drawn: ${extra.join(", ")}`);
    }
    /* THE MARK LIST'S FOUR RULES (B3, 2026-09-10). Each was written, then
       PLANTED with the fault it catches and watched go red with the card
       named, then the fault removed; the plantings are recorded in the task
       report. What is recorded here is what each one measures and what it
       cannot see.
         ROWS CUT , the drawn count against the count the card declares, in
           both directions, at every width.
         NO FIGURE , every drawn row prints one, and any member of the set
           that holds none is accounted for by the withheld line. Checked both
           ways, because a withheld member with no line is a silent drop and a
           line with nothing withheld is a card apologising for nothing.
         UNEQUAL , the rows are one height, AND no row's content runs past the
           height it was given. The second half is not decoration: the height
           is declared (`h-11`), so the first half is nearly always true by
           construction and a row spilling over its divider would pass it.
         MARK MISSING / MARK SIZE , if any row carries a mark then every row
           does, and every mark is drawn at one height AND one WIDTH.
           THE WIDTH HALF IS NEW, 2026-09-11, AND IT REVERSES WHAT THIS NOTE
           USED TO SAY. It read: "height and never width, a correct flag set
           has deliberately unequal widths (a square Swiss flag beside a 2:1
           British one) because CountryFlag.tsx sizes by height and lets width
           follow the flag's own ratio, so a width rule would red the component
           for obeying its own law." That was a faithful description of the law
           as it stood. The founder then changed the law:
           "all-flags-same-width-please-madatory-always". Width now comes from
           a token exactly as height does, the flag is fitted inside that box
           with `object-fit: contain` so nothing is stretched, and unequal
           widths became the fault rather than the proof of correctness. So the
           rule is inverted rather than dropped, and it runs at all three
           widths, which is where the page-level gate (verify_flag_marks,
           1280 only) cannot reach. BLIND SPOT, unchanged: a mark of the right
           box that failed to load draws an empty box of exactly the right
           size and passes here; a broken image is the IMAGE BROKEN rule's
           job. This measures the mark's BOX, which under `contain` is the
           uniform frame and not the painted flag inside it, so it proves one
           width and cannot prove the flag within it is undistorted , that is
           verify_flag_marks' `object-fit` clause. */
    if (r.kind === "mark-list") {
      const rr = r.mlRows || [];
      if (rr.length !== r.mlDeclared) red(r.inst, w, "ROWS CUT", `the card declares ${r.mlDeclared} rows and draws ${rr.length}`);
      const blank = rr.filter((x) => !x.fig);
      if (blank.length) red(r.inst, w, "NO FIGURE", `${blank.length} row(s) print no figure (${blank.slice(0, 3).map((x) => x.key).join(", ")}); a row that cannot hold one is withheld with a line, never drawn blank`);
      if (r.mlWithheld > 0 && !r.mlWithheldLine) red(r.inst, w, "NO FIGURE", `${r.mlWithheld} member(s) of the set hold no figure and no line says so`);
      if (r.mlWithheld === 0 && r.mlWithheldLine) red(r.inst, w, "NO FIGURE", "a withheld line on a card that withheld nothing");
      const hs = rr.map((x) => x.h);
      if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 1) red(r.inst, w, "UNEQUAL", `rows at heights ${[...new Set(hs)].join(", ")}`);
      const spilled = rr.filter((x) => x.spill > 1);
      if (spilled.length) red(r.inst, w, "UNEQUAL", `${spilled.length} row(s) hold content taller than the row: ${spilled.slice(0, 3).map((x) => `${x.key} by ${x.spill}px`).join(", ")}`);
      const marked = rr.filter((x) => x.markH != null);
      if (marked.length && marked.length !== rr.length) red(r.inst, w, "MARK MISSING", `${marked.length} mark(s) on ${rr.length} rows; a card that marks one row marks them all`);
      if (r.mlMarksDeclared !== (marked.length > 0)) red(r.inst, w, "MARK MISSING", `the card declares ${r.mlMarksDeclared ? "marks" : "no marks"} and draws ${marked.length}`);
      if (marked.length > 1) {
        const mh = marked.map((x) => x.markH);
        if (Math.max(...mh) - Math.min(...mh) > 0.5) red(r.inst, w, "MARK SIZE", `marks drawn at heights ${[...new Set(mh)].join(", ")}; every mark on a card is one height`);
        const mw = marked.map((x) => x.markW);
        if (Math.max(...mw) - Math.min(...mw) > 0.5) red(r.inst, w, "MARK SIZE", `marks drawn at widths ${[...new Set(mw)].join(", ")}; every mark on a card is one width too (his ruling of 2026-09-11), fitted into that box with air rather than stretched to it`);
      }
    }
    /* THE BENTO'S THREE RULES (2026-09-10), every one of them run at EVERY
       width and every one of them proved by planting the fault it catches and
       watching it red with the cluster named.

       CELL COUNT , three or four, and the same three or four at every width.
         The count is compared BOTH against the law's bounds and against the
         cluster's own declaration, so a cell that stops drawing when the grid
         reflows is a fault even though three is still a legal number.
       TILING , no gap and no overlap between the drawn cells.
       NO HOLE ON COLLAPSE , the cells' areas add up to the rectangle they
         occupy, so a cluster that reflows into an L is named as a collapse
         fault rather than as a generic gap. */
    /* EVERY ONE OF THE THREE WAS PLANTED AND WATCHED GO RED, 2026-09-10, then
       removed; a rule nobody has seen fire is a rule nobody knows is wired.
         TILING, a hole: the component's own tiling proof was commented out and
           the exemplar's tall cell dropped from two rows to one. Red at 1280
           and 768, `bento-band:exemplar`, "1 hole(s): 552x193". Silent at 375,
           correctly: one column, every cell 1x1, nothing to hole.
         TILING, an overlap: every cell forced to `lg:row-start-1`. Red on all
           three clusters at 1280, naming the pair, "cost and paperwork share
           552x161".
         CELL COUNT: the component's 3-to-4 guard temporarily widened to 5 and
           a fifth cell added to a cluster that STILL TILES (2+1+1+1+1 on a 3
           by 2 grid). Red at all three widths, "5 cells drawn", with TILING
           silent, which is what makes it an isolated proof of this rule rather
           than a second reading of the one below it.
         NO HOLE ON COLLAPSE: the `md:` placement classes dropped, so the
           cluster auto-flowed at tablet. Red at 768 ONLY, on the two clusters
           whose shape actually changes there, with 1280 and 375 clean: the
           fault this rule is named for, a cluster that tiles at the width it
           was designed at and goes ragged when it is narrowed. The component's
           own validator stayed silent through it, which is the point of
           measuring the drawn boxes.
       ONE THING STATED PLAINLY: on a fault that is both, TILING and NO HOLE ON
       COLLAPSE fire together, and they cannot be fully separated, because
       uncovered area and an uncovered patch are the same fact counted two
       ways. The area check earns its place as the checksum: the lattice test
       discards patches under a pixel to survive subpixel rounding, and the
       area does not. */
    if (r.kind === "bento-band") {
      const MIN = 3, MAX = 4;
      if (r.bentoDrawn < MIN || r.bentoDrawn > MAX) red(r.inst, w, "CELL COUNT", `${r.bentoDrawn} cells drawn; a cluster holds ${MIN} or ${MAX} (two is a band, five is a list)`);
      else if (r.bentoDeclared && r.bentoDrawn !== r.bentoDeclared) red(r.inst, w, "CELL COUNT", `${r.bentoDrawn} cells drawn against ${r.bentoDeclared} declared; a cell stopped drawing at this width`);
      if (r.bentoGaps && r.bentoGaps.length) red(r.inst, w, "TILING", `${r.bentoGaps.length} hole(s) between the drawn cells: ${r.bentoGaps.slice(0, 3).join("; ")}`);
      if (r.bentoOverlaps && r.bentoOverlaps.length) red(r.inst, w, "TILING", `${r.bentoOverlaps.length} overlap(s): ${r.bentoOverlaps.slice(0, 3).join("; ")}`);
      /* 1% of the union, which is about eight pixels of edge on a 1072 by 400
         cluster: looser than a device pixel because eight rects each grown by
         half an inferred gutter carry eight roundings, and far tighter than
         the smallest cell any legal cluster can hold (a quarter of the
         rectangle, 25%). */
      if (r.bentoUnionArea > 0 && Math.abs(r.bentoArea - r.bentoUnionArea) / r.bentoUnionArea > 0.01) {
        red(r.inst, w, "NO HOLE ON COLLAPSE", `the drawn cells cover ${Math.round(r.bentoArea).toLocaleString()} square pixels of the ${r.bentoUnion} rectangle they occupy (${Math.round(r.bentoUnionArea).toLocaleString()}); the cluster is not a rectangle at this width`);
      }
    }
    if (r.hasDetailPanel) {
      /* THE FOUNDER'S PLUS (2026-09-08): a panel is closed on arrival, its summary
         is one line of ink2 that says what opens, and what opens is rows of text.
         The type is the construction (DetailRow carries no children, so a
         drawing cannot reach this path); this is the measurement. Gated on the
         panel's own presence, not the outer card's kind (review finding 2), so
         these keep firing once a real section nests the panel at the foot of a
         ranked-bars or answer-card. */
      if (r.openOnLoad) red(r.inst, w, "OPEN ON LOAD", "a detail panel is open before anyone clicks it");
      if (r.summaryLines > 1) red(r.inst, w, "SUMMARY WRAP", `the summary takes ${r.summaryLines} lines; it is one line at every width`);
      if (r.panelGraphics) red(r.inst, w, "HIDDEN GRAPHIC", `${r.panelGraphics} drawing(s) inside a disclosure`);
      if (w === WIDTHS[2] && r.summaryHit < 44) red(r.inst, w, "BOTCHED MOBILE", `the plus target is ${r.summaryHit}px tall, under 44`);
      if (r.panelRowsExpect != null && r.panelRowsDrawn != null && r.panelRowsDrawn < r.panelRowsExpect) red(r.inst, w, "ROWS CUT", `the panel declares ${r.panelRowsExpect} rows and draws ${r.panelRowsDrawn} once open`);
    }
    if (r.kind !== "ranked-bars" && r.accents > 1) red(r.inst, w, "ACCENT", `${r.accents} accent texts in one card`);
    for (const row of r.rows) if (Math.max(...row) - Math.min(...row) > 2) red(r.inst, w, "UNEQUAL", `figures in one grid row at tops ${row.join(", ")}`);
    const dup = r.labels.filter((l, i) => l && r.labels.indexOf(l) !== i); if (dup.length) red(r.inst, w, "REPETITION", `label repeated: ${[...new Set(dup)].join(", ")}`);
    const promisesRegister = /register/i.test(r.subtitle); const hasRegister = r.cells.includes("llc-cost");
    if (r.kind === "answer-card" && promisesRegister && !hasRegister) red(r.inst, w, "PROMISE", `the subtitle promises registration and no registration cell renders`);
    if (r.hole && r.hole.wPx >= Math.max(120, r.hole.cardW / 4) && r.hole.hPx >= Math.max(120, r.hole.cardH / 4)) red(r.inst, w, "LONE STAT", `a blank rectangle ${r.hole.wPx}x${r.hole.hPx} inside a ${r.hole.cardW}x${r.hole.cardH} card`);
  }
  if (shots) {
    mkdirSync("scratchpad/harness/shots", { recursive: true });
    const shotName = ONLY == null ? "archetypes" : `only-${onlyKind}${onlyKey == null ? "" : `-${onlyKey.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}`;
    await page.screenshot({ path: `scratchpad/harness/shots/${shotName}-${w}.jpeg`, type: "jpeg", quality: 85, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
/* INDEX (sys:stories-index, run 21): every link in the stories index points at a
   story the sheet holds, and every story is listed. Read from the sheet's text,
   no browser needed; a rule here rather than a second script, because the chain's
   single-gate-chain gate forbids an npm script that names two gate scripts. */
if (ONLY != null) {
  console.log("index links: not checked in a targeted run; the index is drawn by the full sheet only");
} else {
  const html = readFileSync(file, "utf8");
  const links = [...html.matchAll(/href="#(story-[^"]+)"/g)].map((m) => m[1]);
  const ids = new Set([...html.matchAll(/<section id="(story-[^"]+)"/g)].map((m) => m[1]));
  const linked = new Set(links);
  for (const l of links) if (!ids.has(l)) red("index", "all", "INDEX", `a link to #${l} and no story with that id`);
  for (const id of ids) if (!linked.has(id)) red("index", "all", "INDEX", `the story ${id} is not in the index`);
  console.log(`index links: ${links.length} links, ${ids.size} stories; ${links.filter((l) => !ids.has(l)).length} dangling, ${[...ids].filter((id) => !linked.has(id)).length} unlisted`);
}
const byInst = {};
for (const r of reds) (byInst[`${r.inst}@${w(r)}`] ??= []).push(`${r.rule}: ${r.msg}`);
function w(r) { return r.w; }
console.log(`archetype harness${ONLY == null ? "" : ` (--only=${ONLY})`}: ${instances.length} instances x ${WIDTHS.length} widths, ${reds.length} design red(s), ${datas.length} data red(s)`);
for (const [k, v] of Object.entries(byInst)) console.log(`  ${k}\n    ${v.join("\n    ")}`);
if (datas.length) { console.log("  DATA, for the data track, not the drawing:"); for (const d of datas) console.log(`    ${d.inst}: ${d.rule}, ${d.msg}`); }

/* THE DATA SECTION IS WRITTEN TO THE DATA TRACK'S OWN FILE (plan step 17,
   2026-09-17). A data red never touches the exit code (the line above exits
   on design reds alone, since the fold of 2026-09-08), and it never affected
   anything else either: eleven standing lines printed under every run and
   were re-read by nobody. They are the data track's queue, so they go where
   that queue lives, E:/atlas/design/loop/build/DATA-REQUIREMENTS.md, in a
   block between two markers, rewritten only when the list changes and
   dated when it is. The parent repository is never present on a build
   server; the write is guarded by existsSync and skips with one line, the
   same discipline census.ts uses for PAGES.md. A full run only: a targeted
   run sees one story and must not overwrite the whole list with it. */
if (ONLY == null) {
  const DATA_REQ = "E:/atlas/design/loop/build/DATA-REQUIREMENTS.md";
  const START = "<!-- harness-data-reds:start -->", END = "<!-- harness-data-reds:end -->";
  const NL = String.fromCharCode(10);
  const lines = datas.map((d) => `- \`${d.inst}\`: ${d.rule}, ${d.msg}`).sort();
  const body = lines.length ? lines.join(NL) : "- none: every story holds its data";
  if (!existsSync(DATA_REQ)) {
    console.log(`  data section: ${DATA_REQ} is not on this machine (a build server); the list above is not written anywhere`);
  } else {
    const doc = readFileSync(DATA_REQ, "utf8");
    const i = doc.indexOf(START), j = doc.indexOf(END);
    const current = i !== -1 && j !== -1 ? doc.slice(i + START.length, j).split(NL).filter((l) => l.startsWith("- ")).join(NL) : null;
    if (current === body) {
      console.log(`  data section: unchanged, ${datas.length} standing data red(s) already in DATA-REQUIREMENTS.md`);
    } else {
      const stamp = new Date().toISOString().slice(0, 10);
      const head = [
        START,
        `## The archetype harness's standing data reds, written by check_archetypes.mjs on ${stamp}`,
        "",
        "One line per story whose data is missing, not its drawing (the harness exits on design reds alone). Rewritten by `npm run harness` whenever the list changes; do not edit between the markers.",
        "",
      ].join(NL);
      const block = head + NL + body + NL + END;
      const next = i !== -1 && j !== -1 ? doc.slice(0, i) + block + doc.slice(j + END.length) : doc.replace(/\s*$/, NL + NL) + block + NL;
      writeFileSync(DATA_REQ, next);
      console.log(`  data section: DATA-REQUIREMENTS.md rewritten, ${datas.length} standing data red(s) (was ${current == null ? "absent" : current.split(NL).filter(Boolean).length})`);
    }
  }
}
process.exit(reds.length ? 1 : 0);
