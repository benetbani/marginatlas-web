/**
 * scripts/verify_doors.ts , THE DOORS LAND WHERE THEY PROMISE (plan-2026-09-17/
 * 04-PAGES.md step 39, 2026-09-19; MODEL.md PART 8's "THE DOORS" paragraphs on
 * 8.2, 8.3, 8.6, 8.7 and 8.8, M23, and the coherence check of 2026-09-16, whose
 * section 5 found the country's close naming a door that did not exist and
 * the trade page's peers carrying no href at all).
 *
 * WHAT IT ASSERTS. For every door on every page in scripts/harness/pages.json,
 * read off the chain's own renders (scripts/lib/page_renders.mjs; the
 * `pages-fresh` gate writes them first, and this never re-renders):
 *   (a) the href resolves to a route: a static route under src/app, or a
 *       dynamic route whose params this gate enumerates WITHOUT the network
 *       or a secret, by mirroring how each route decides `notFound()` in a
 *       pure function over the same files the route reads (the country list,
 *       the city list, the neighbourhoods file, the hub's admission gate, the
 *       taxonomy, the how-to builder, the regions table);
 *   (b) the target's masthead answers the door's promise: the door carries
 *       `data-lands="<kind>"`, declared once where it was built (Terminus's
 *       `Door.lands`, the city cards, the neighbourhood cards, the trade
 *       rows, the rivals and the visitor rows, the money card's rows), and the
 *       gate maps the href to a surface and reads that surface's declared
 *       answer from src/lib/spine/door_kinds.ts (`SURFACE_ANSWERS`, one
 *       declaration per surface), never from a render;
 *   (c) a table's rows carry no href, on every CompareTable in the renders
 *       (M23: the compare table is a reading everywhere);
 *   (d) no two doors of one terminus share a first word (the archetype's own
 *       law, checked again from outside);
 *   (e) every page-level masthead in the renders declares `data-answers`, and
 *       declares the kind the module holds for that render's surface.
 * A door is one of: a Terminus `<a data-door>`; a card's `<a data-card>` in
 * CityCards or CardPager; a MarkList row `<a data-row>` under
 * `data-doors="1"`; a TradesHere row `<a data-row>` under `data-form=
 * "trade-rows"`; a RankedBars row that navigates (the country's money card,
 * found by this gate on 2026-09-19 and not in the step's list). Every other
 * anchor inside a section card (the "every covered city" link, the "every
 * neighbourhood" link, the registering table's how-to door) is walked as a
 * LINK: (a) only, no promise, and the output says so.
 *
 * WHAT IT PRINTS: every door it walked with its verdict, page by page, and
 * the counts by page and by kind; the same lines are written to
 * scratchpad/harness/doors.txt so a person can read the walk after the chain.
 * Exits 1 on any red.
 *
 * THE BLIND SPOTS, stated before the first number is quoted.
 *  - THE TRADE PAGE'S ROUTE EXISTS ONLY WHERE THE DATABASE SAYS SO:
 *    src/app/[country]/[geo]/[industry]/page.tsx declares `dynamicParams =
 *    true` and decides `notFound()` off `buildSpineCellSeed`, which resolves
 *    the cell through getCellBySlug (src/lib/cells.ts); no file lists the
 *    cells that exist. This gate verifies a cell href against the route's own
 *    `generateStaticParams` list (the prerendered cells, read off the route
 *    file as text) and the sheet's exemplars (`CELL_INSTANCES` in
 *    src/lib/spine/trade_hero_facts.ts, the cells the harness renders), and
 *    every other cell href is UNVERIFIABLE: printed with `?`, counted, never
 *    a pass and never a red. The city's trade rows and the trade's rivals are
 *    such hrefs; both adapters round-trip them through the database at
 *    render time (adapt_city.ts `t.local`, related_links.ts `otherTradesHere`),
 *    which is the one instrument that proves them. This gate cannot
 *    distinguish "the cell exists" from "the database said so when the page
 *    was rendered".
 *  - A LEGACY HUB'S ANCHOR (`/cities/{slug}/neighborhoods#{district}`) is
 *    verified to the page, not to the fragment: the legacy hub is not
 *    rendered by the harness, so whether it plants `id={district}` is not
 *    read here.
 *  - THE PROMISE CHECK IS A DECLARATION AGAINST A DECLARATION: what a
 *    masthead leads with is read from the module, not from its words, so a
 *    view that declares the right kind over the wrong figure passes here and
 *    is the archetype harness's to catch (PROMISE, check_archetypes.mjs).
 *  - THE RENDERER MAPS ASSET PATHS TO FILE URLS (scripts/harness/
 *    render_page.tsx `mapAssets`): until 2026-09-19 it also rewrote
 *    `href="/cities/london"`, a door, into a `file:///` URL, so a render lied
 *    about every city door. It now maps an href only when it names a file; a
 *    `file:` href reaching this gate is a red naming that regression.
 *
 * PLANTED TWICE, 2026-09-19, and watched red both times (the loop's DEBUG row
 * carries the lines): a dead door (the country close's trades door pointed at
 * /gb/trades, a route the app folder does not hold; country-GB re-rendered,
 * red "not a route"), and a wrong promise (the city cards declared
 * `owner-keeps`; red "promises owner-keeps, the city page answers
 * customer-pay" on four cards). Both unplanted before the commit.
 *
 * Run: npx tsx scripts/verify_doors.ts [--out=<path>]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";
import { pageRenders, describeRenders, missingLine } from "./lib/page_renders.mjs";
import { red, redSummary } from "./lib/red";
import { DOOR_KINDS, SURFACE_ANSWERS, isDoorKind, type DoorKind, type LandingSurface } from "../src/lib/spine/door_kinds";
import { COUNTRIES, INDUSTRIES, industryToSlug, slugToIndustry } from "../src/lib/taxonomy";
import { getRegionsForCountry } from "../src/lib/regions/regions-by-country";
import { spineHoodDistrict, spineHoodDistricts, hasHoodScheme } from "../src/lib/spine/hood_scheme";
import { isSpineReformEnabledFor } from "../src/lib/feature_flags";
import { buildHowTo } from "../src/lib/spine/howto_rows";
import { CELL_INSTANCES } from "../src/lib/spine/trade_hero_facts";
import cityListJson from "../data/cities/city_list_v1.json";

const RULE = "doors";
const MODULE = "src/lib/spine/door_kinds.ts";
const CELL_ROUTE = "src/app/[country]/[geo]/[industry]/page.tsx";
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? "scratchpad/harness/doors.txt";

/* ------------------------------------------------------------------------ */
/* THE ROUTES, mirrored purely.                                              */
/* ------------------------------------------------------------------------ */

type Exists = "yes" | "no" | "unverifiable";
/** Where an href lands: a surface with a declared answer, or a page outside the vocabulary (`answers: null`). */
type Landing = { surface: LandingSurface | "static" | "howto" | "across" | "dynamic"; answers: DoorKind | null; exists: Exists; why: string };

const CITY_SLUGS = new Set((cityListJson as { cities: Array<{ slug: string }> }).cities.map((c) => c.slug.toLowerCase()));
const COUNTRY_CODES = new Set((COUNTRIES as Array<{ code: string }>).map((c) => c.code.toUpperCase()));
const COUNTRY_NAME = new Map((COUNTRIES as Array<{ code: string; name: string }>).map((c) => [c.code.toUpperCase(), c.name]));
const PUBLISHED_SLUGS = new Set(INDUSTRIES.map((i) => industryToSlug(i.id)));

/** Every page.tsx under src/app as a path pattern, route groups dropped, one regex per route; and the static ones as exact paths. */
function routeTable(): { patterns: Array<{ re: RegExp; path: string }>; statics: Set<string> } {
  const patterns: Array<{ re: RegExp; path: string }> = [];
  const statics = new Set<string>();
  const walk = (dir: string, segs: string[]) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) { walk(full, name.startsWith("(") ? segs : [...segs, name]); continue; }
      if (name !== "page.tsx") continue;
      const path = "/" + segs.join("/");
      if (!segs.some((s) => s.startsWith("["))) statics.add(path);
      patterns.push({ path, re: new RegExp("^/" + segs.map((sg) => (sg.startsWith("[") ? "[^/]+" : sg.replace(/[.*+?^${}()|\\]/g, "\\$&"))).join("/") + "/?$") });
    }
  };
  walk("src/app", []);
  return { patterns, statics };
}
const ROUTES = routeTable();

/** The `{ country, geo, industry }` tuples inside the cell route's generateStaticParams, read as text so nothing of the page is imported (the money-shown gate's reader). */
function prerenderedCells(): Set<string> {
  const src = readFileSync(CELL_ROUTE, "utf8");
  const start = src.indexOf("generateStaticParams");
  const body = start === -1 ? "" : src.slice(start);
  const end = body.indexOf("\n}\n");
  const fn = end === -1 ? body : body.slice(0, end);
  const out = new Set<string>();
  for (const m of fn.matchAll(/country:\s*"([^"]+)",\s*geo:\s*"([^"]+)",\s*industry:\s*"([^"]+)"/g)) out.add(`${m[1]}/${m[2]}/${m[3]}`.toLowerCase());
  return out;
}
const PRERENDERED = prerenderedCells();
const EXEMPLARS = new Set(Object.values(CELL_INSTANCES).map((i) => i.route.join("/").toLowerCase()));

const HOOD_ON = isSpineReformEnabledFor("hood");

function landingOf(rawHref: string): Landing {
  const href = rawHref.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return { surface: "static", answers: null, exists: "no", why: `not a route: a ${href.split(":")[0]}: URL${href.startsWith("file:") ? " (the renderer mapped a page link to a file; read render_page.tsx mapAssets)" : ""}` };
  if (!href.startsWith("/")) return { surface: "static", answers: null, exists: "no", why: "not a route: a relative or fragment-only href" };
  const path = href.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
  const segs = path === "/" ? [] : path.slice(1).split("/");

  if (ROUTES.statics.has(path)) {
    if (path === "/compare") return { surface: "compare", answers: SURFACE_ANSWERS.compare, exists: "yes", why: "a static route" };
    if (path === "/pricing") return { surface: "pricing", answers: SURFACE_ANSWERS.pricing, exists: "yes", why: "a static route" };
    return { surface: "static", answers: null, exists: "yes", why: "a static route" };
  }

  /* /industries/{slug}[/across]: the industry route resolves the slug through the taxonomy (canonical, alias, then a fuzzy match; a retired slug resolves to nothing). A door must carry the canonical slug of a published trade: an alias or a fuzzy match lands on a page named for another slug, and a merged or retired one answers a redirect. */
  if (segs[0] === "industries" && (segs.length === 2 || (segs.length === 3 && segs[2] === "across"))) {
    const slug = segs[1].toLowerCase();
    const surface = segs.length === 3 ? "across" : "industry";
    const answers = surface === "industry" ? SURFACE_ANSWERS.industry : null;
    if (PUBLISHED_SLUGS.has(slug)) return { surface, answers, exists: "yes", why: "the canonical slug of a published trade" };
    const resolved = slugToIndustry(slug);
    if (resolved) return { surface, answers, exists: "no", why: `not the page it names: "${slug}" resolves to ${resolved.id} only by alias or fuzzy match (canonical: /industries/${industryToSlug(resolved.id)})` };
    return { surface, answers, exists: "no", why: `no trade resolves for "${slug}" (retired, merged or unknown)` };
  }

  /* /cities/{slug}, the hub, a district page. */
  if (segs[0] === "cities" && segs.length >= 2 && segs.length <= 4) {
    const slug = segs[1].toLowerCase();
    if (segs.length === 2) return CITY_SLUGS.has(slug) ? { surface: "city", answers: SURFACE_ANSWERS.city, exists: "yes", why: "in data/cities/city_list_v1.json" } : { surface: "city", answers: SURFACE_ANSWERS.city, exists: "no", why: `no city "${slug}" in data/cities/city_list_v1.json` };
    if (segs[2] !== "neighborhoods") return { surface: "static", answers: null, exists: "no", why: "no such route under /cities" };
    if (segs.length === 3) {
      if (!hasHoodScheme(slug)) return { surface: "hub-legacy", answers: SURFACE_ANSWERS["hub-legacy"], exists: "no", why: `the hub route answers 404: no city "${slug}" with a scheme in data/cities/neighborhoods_v1.json` };
      const spine = HOOD_ON && spineHoodDistricts(slug) != null;
      return spine
        ? { surface: "hood", answers: SURFACE_ANSWERS.hood, exists: "yes", why: "the spine hub (the admission gate admits the city)" }
        : { surface: "hub-legacy", answers: SURFACE_ANSWERS["hub-legacy"], exists: "yes", why: "the legacy hub (the city holds a scheme; the gate does not admit it)" };
    }
    const district = segs[3].toLowerCase();
    if (!HOOD_ON) return { surface: "district", answers: SURFACE_ANSWERS.district, exists: "no", why: "the district route answers 404 with the neighbourhood spine off" };
    return spineHoodDistrict(slug, district)
      ? { surface: "district", answers: SURFACE_ANSWERS.district, exists: "yes", why: "an admitted district (hood_scheme.ts)" }
      : { surface: "district", answers: SURFACE_ANSWERS.district, exists: "no", why: `no admitted district "${district}" of "${slug}" (hood_scheme.ts)` };
  }

  /* /{iso2}, its trades index, its how-to page, a region, a trade cell. */
  if (segs.length >= 1 && /^[a-z]{2}$/i.test(segs[0])) {
    const iso2 = segs[0].toUpperCase();
    const known = COUNTRY_CODES.has(iso2);
    if (segs.length === 1) return known ? { surface: "country", answers: SURFACE_ANSWERS.country, exists: "yes", why: "a covered country (taxonomy COUNTRIES)" } : { surface: "country", answers: SURFACE_ANSWERS.country, exists: "no", why: `no country ${iso2} in the taxonomy` };
    if (segs.length === 2 && segs[1] === "industries") return known ? { surface: "trades-index", answers: SURFACE_ANSWERS["trades-index"], exists: "yes", why: "a covered country's trades index" } : { surface: "trades-index", answers: SURFACE_ANSWERS["trades-index"], exists: "no", why: `no country ${iso2} in the taxonomy` };
    if (segs.length === 2 && segs[1] === "how-to-open") return buildHowTo(iso2) ? { surface: "howto", answers: null, exists: "yes", why: "legal forms on file (howto_rows.ts)" } : { surface: "howto", answers: null, exists: "no", why: `the how-to page answers 404 for ${iso2}: no legal form on file` };
    if (segs.length === 2) {
      if (!known) return { surface: "region", answers: SURFACE_ANSWERS.region, exists: "no", why: `no country ${iso2} in the taxonomy` };
      const region = getRegionsForCountry(iso2, COUNTRY_NAME.get(iso2) ?? iso2).find((r) => r.value === segs[1].toLowerCase());
      return region ? { surface: "region", answers: SURFACE_ANSWERS.region, exists: "yes", why: `a region of ${iso2} (regions-by-country)` } : { surface: "region", answers: SURFACE_ANSWERS.region, exists: "no", why: `no region "${segs[1]}" of ${iso2} (regions-by-country)` };
    }
    if (segs.length === 3) {
      if (!known) return { surface: "cell", answers: SURFACE_ANSWERS.cell, exists: "no", why: `no country ${iso2} in the taxonomy` };
      if (!slugToIndustry(segs[2])) return { surface: "cell", answers: SURFACE_ANSWERS.cell, exists: "no", why: `no trade resolves for "${segs[2]}" (retired, merged or unknown)` };
      const key = segs.join("/").toLowerCase();
      if (PRERENDERED.has(key)) return { surface: "cell", answers: SURFACE_ANSWERS.cell, exists: "yes", why: `prerendered (generateStaticParams in ${CELL_ROUTE})` };
      if (EXEMPLARS.has(key)) return { surface: "cell", answers: SURFACE_ANSWERS.cell, exists: "yes", why: "a cell the harness renders (CELL_INSTANCES, trade_hero_facts.ts)" };
      return { surface: "cell", answers: SURFACE_ANSWERS.cell, exists: "unverifiable", why: "the cell route decides notFound() by a database read" };
    }
  }

  /* Anything else: a dynamic route this gate holds no mirror for, or nothing. */
  const hit = ROUTES.patterns.find((p) => p.re.test(path));
  if (hit) return { surface: "dynamic", answers: null, exists: "unverifiable", why: `matches ${hit.path}, a route this gate holds no pure mirror for` };
  return { surface: "static", answers: null, exists: "no", why: "no route under src/app matches" };
}

/* ------------------------------------------------------------------------ */
/* THE DOORS, read off a render.                                             */
/* ------------------------------------------------------------------------ */

type DoorClass = "terminus" | "city-card" | "neighbourhood-card" | "list-row" | "trade-row" | "bar-row" | "link";
type Walked = { page: string; cls: DoorClass; card: string; key: string; label: string; href: string; lands: string | null; landing: Landing };

const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\u2192/g, "").replace(/\s+/g, " ").trim();

function doorsOf(page: string, html: string): { doors: Walked[]; termini: Array<{ card: string; labels: string[] }>; tableAnchors: Array<{ card: string; href: string }>; mastheads: Array<{ card: string; answers: string | null; label: string }> } {
  /* The stylesheet is inlined and a megabyte; the DOM is what this reads. */
  const doc = new JSDOM(html.replace(/<style[\s\S]*?<\/style>/g, "")).window.document;
  const doors: Walked[] = [];
  const seen = new Set<Element>();
  const cardOf = (el: Element) => {
    const box = el.closest("[data-archetype],[data-form]");
    const id = box?.closest("[id]")?.id ?? "";
    return `${box?.getAttribute("data-archetype") ?? box?.getAttribute("data-form") ?? "?"}#${id}`;
  };
  const push = (a: Element, cls: DoorClass, key: string, label: string) => {
    if (seen.has(a)) return;
    seen.add(a);
    const href = a.getAttribute("href") ?? "";
    doors.push({ page, cls, card: cardOf(a), key, label, href, lands: a.getAttribute("data-lands"), landing: landingOf(href) });
  };
  for (const a of doc.querySelectorAll('[data-archetype="terminus"] a[data-door]')) push(a, "terminus", a.getAttribute("data-door") ?? "", text(a));
  for (const a of doc.querySelectorAll('[data-archetype="city-cards"] a[data-card]')) push(a, "city-card", a.getAttribute("data-card") ?? "", text(a.querySelector("[data-city-name]")));
  for (const a of doc.querySelectorAll('[data-archetype="card-pager"] a[data-card]')) push(a, "neighbourhood-card", a.getAttribute("data-card") ?? "", text(a.querySelector("span span")));
  for (const a of doc.querySelectorAll('[data-archetype="mark-list"][data-doors="1"] a[data-row]')) push(a, "list-row", a.getAttribute("data-row") ?? "", text(a.querySelector("[data-label]")));
  for (const a of doc.querySelectorAll('[data-form="trade-rows"] a[data-row]')) push(a, "trade-row", a.getAttribute("data-row") ?? "", text(a.querySelector("[data-label]")));
  for (const a of doc.querySelectorAll('[data-archetype="ranked-bars"] a[href]')) push(a, "bar-row", a.getAttribute("data-row") ?? a.closest("[data-row]")?.getAttribute("data-row") ?? "", text(a.querySelector("[data-label]") ?? a));
  /* Every other anchor inside a section card is a link: walked for its route alone. */
  for (const a of doc.querySelectorAll("[data-archetype] a[href], [data-form] a[href]")) if (!seen.has(a)) push(a, "link", "", text(a));
  const termini = [...doc.querySelectorAll('[data-archetype="terminus"]')].map((t) => ({ card: cardOf(t), labels: [...t.querySelectorAll("a[data-door]")].map((a) => text(a)) }));
  const tableAnchors = [...doc.querySelectorAll('[data-archetype="compare-table"] a[href]')].map((a) => ({ card: cardOf(a), href: a.getAttribute("href") ?? "" }));
  /* The country's masthead is the hero board since 2026-09-20 (HeroBoard.tsx, his design); it declares its answer and its markers the way the answer card does. */
  const mastheads = [...doc.querySelectorAll('[data-archetype="answer-card"][data-level="page"], [data-archetype="hero-board"][data-level="page"]')].map((m) => ({ card: `${m.getAttribute("data-archetype")}#${m.id}`, answers: m.getAttribute("data-answers"), label: text(m.querySelector("[data-answer] > div, [data-answer-absent] > div")) }));
  return { doors, termini, tableAnchors, mastheads };
}

/** The answer kind a render's own masthead must declare, by the harness surface and its slugs. */
function expectedAnswer(surface: string, slugs: string[]): DoorKind | null {
  switch (surface) {
    case "country": return SURFACE_ANSWERS.country;
    case "city": return SURFACE_ANSWERS.city;
    case "cell": return SURFACE_ANSWERS.cell;
    case "industry": return SURFACE_ANSWERS.industry;
    case "hood": return slugs.length > 1 ? SURFACE_ANSWERS.district : SURFACE_ANSWERS.hood;
    default: return null;
  }
}

/* ------------------------------------------------------------------------ */
/* THE WALK.                                                                 */
/* ------------------------------------------------------------------------ */

const out: string[] = [];
const say = (line = "") => { out.push(line); console.log(line); };
const reds: Array<{ file: string; detail: string; remedy: string }> = [];

const entries = pageRenders({ kinds: ["fresh"] });
say(`doors: the promise check over ${entries.length} renders, the kinds ${DOOR_KINDS.join(", ")} (${MODULE}); the cell route verified against ${PRERENDERED.size} prerendered cells and ${EXEMPLARS.size} harness exemplars, the rest unverifiable`);
say(`  ${RULE} ${describeRenders(entries)}`);

const byPage = new Map<string, { ok: number; red: number; unverifiable: number; links: number }>();
const byClass = new Map<DoorClass, number>();
let unverifiable = 0;
let walked = 0;

for (const e of entries) {
  const tally = { ok: 0, red: 0, unverifiable: 0, links: 0 };
  byPage.set(e.name, tally);
  if (!e.exists) { reds.push({ file: e.path, detail: missingLine(RULE, e).replace(/^x doors /, ""), remedy: "run npx tsx scripts/verify_pages_fresh.mjs first" }); continue; }
  const { doors, termini, tableAnchors, mastheads } = doorsOf(e.name, readFileSync(e.path, "utf8"));
  say("");
  say(`== ${e.name}  (${doors.length} anchors in section cards: ${doors.filter((d) => d.cls !== "link").length} doors, ${doors.filter((d) => d.cls === "link").length} links)`);

  /* (e) the masthead's own declaration. */
  const expected = expectedAnswer(e.surface ?? "", e.slugs ?? []);
  for (const m of mastheads) {
    if (!m.answers) {
      reds.push({ file: e.path, detail: `${e.name} ${m.card}: the page-level masthead declares no data-answers`, remedy: `pass answers={SURFACE_ANSWERS.<surface>} to AnswerCard in the view (${MODULE})` });
      say(`  x  masthead ${m.card} "${m.label}": no data-answers`);
    } else if (expected && m.answers !== expected) {
      reds.push({ file: e.path, detail: `${e.name} ${m.card}: the masthead declares "${m.answers}", the module says a ${e.surface} page answers "${expected}"`, remedy: `one declaration per surface: read SURFACE_ANSWERS in ${MODULE}` });
      say(`  x  masthead ${m.card} "${m.label}": declares ${m.answers}, expected ${expected}`);
    } else {
      say(`  ok masthead ${m.card} "${m.label}": answers ${m.answers}`);
    }
  }
  if (expected && mastheads.length === 0) {
    reds.push({ file: e.path, detail: `${e.name}: no page-level masthead in the render`, remedy: "the surface's view must draw AnswerCard or HeroBoard at level page" });
    say(`  x  no page-level masthead`);
  }

  /* (c) M23 on every compare table. */
  for (const t of tableAnchors) {
    reds.push({ file: e.path, detail: `${e.name} ${t.card}: a compare table's row navigates (${t.href}); a table's rows never navigate (M23)`, remedy: "remove the href from the table's rows in its builder" });
    say(`  x  ${t.card}: a table row carries an href (${t.href}), M23`);
  }
  if (tableAnchors.length === 0) say(`  ok compare tables carry no href (M23)`);

  /* (d) the first-word law, per terminus. */
  for (const t of termini) {
    const firsts = t.labels.map((l) => l.split(/\s+/)[0]?.toLowerCase() ?? "");
    const dup = firsts.filter((f, i) => firsts.indexOf(f) !== i);
    if (dup.length) {
      reds.push({ file: e.path, detail: `${e.name} ${t.card}: two doors share a first word ("${dup[0]}"): ${t.labels.map((l) => `"${l}"`).join(", ")}`, remedy: "reword one door in the copy table so every door opens on its own word" });
      say(`  x  ${t.card}: doors share a first word "${dup[0]}"`);
    } else if (t.labels.length) {
      say(`  ok ${t.card}: ${t.labels.length} door${t.labels.length === 1 ? "" : "s"}, first words distinct (${firsts.join(", ")})`);
    }
  }

  /* (a) and (b), door by door. */
  for (const d of doors) {
    walked++;
    byClass.set(d.cls, (byClass.get(d.cls) ?? 0) + 1);
    const L = d.landing;
    const where = `${d.href} -> ${L.surface}${L.answers ? ` (answers ${L.answers})` : ""}`;
    if (d.cls === "link") {
      tally.links++;
      if (L.exists === "no") {
        tally.red++;
        reds.push({ file: e.path, detail: `${e.name} ${d.card}: link "${d.label}" points at ${d.href}: ${L.why}`, remedy: "repoint or remove the link in the builder that owns it" });
        say(`  x  link      ${d.card} "${d.label}" ${where}: ${L.why}`);
      } else if (L.exists === "unverifiable") {
        tally.unverifiable++; unverifiable++;
        say(`  ?  link      ${d.card} "${d.label}" ${where}: ${L.why}`);
      } else {
        tally.ok++;
        say(`  ok link      ${d.card} "${d.label}" ${where}: ${L.why} (no promise declared: a link, not a door)`);
      }
      continue;
    }
    const problems: string[] = [];
    if (L.exists === "no") problems.push(`dead: ${L.why}`);
    if (!d.lands) problems.push("no promise declared (data-lands missing)");
    else if (!isDoorKind(d.lands)) problems.push(`promises "${d.lands}", not a kind in ${MODULE}`);
    else if (L.exists !== "no") {
      if (!L.answers) problems.push(`promises ${d.lands}, but ${L.surface} (${d.href}) answers nothing in the vocabulary`);
      else if (L.answers !== d.lands) problems.push(`promises ${d.lands}, the ${L.surface} page answers ${L.answers}`);
    }
    if (problems.length) {
      tally.red++;
      reds.push({ file: e.path, detail: `${e.name} ${d.card}: ${d.cls} "${d.label}" (${d.href}): ${problems.join("; ")}`, remedy: "fix the door in the builder that owns it: repoint or remove a dead door, redeclare or repoint a wrong promise; never in a component" });
      say(`  x  ${d.cls.padEnd(9)} ${d.card} "${d.label}" ${where}: ${problems.join("; ")}`);
    } else if (L.exists === "unverifiable") {
      tally.unverifiable++; unverifiable++;
      say(`  ?  ${d.cls.padEnd(9)} ${d.card} "${d.label}" ${where}: promise ${d.lands} matches; route ${L.why}`);
    } else {
      tally.ok++;
      say(`  ok ${d.cls.padEnd(9)} ${d.card} "${d.label}" ${where}: promise ${d.lands} matches; ${L.why}`);
    }
  }
}

say("");
say("== the count");
for (const [name, t] of byPage) say(`  ${name.padEnd(30)} ok ${String(t.ok).padStart(3)}  unverifiable ${String(t.unverifiable).padStart(3)}  red ${String(t.red).padStart(3)}  (links among them ${t.links})`);
say(`  by kind: ${[...byClass].map(([k, n]) => `${k} ${n}`).join(", ")}`);
say(`  ${walked} anchors walked; ${unverifiable} unverifiable: ${unverifiable ? "the cell route decides notFound() by a database read (getCellBySlug, src/lib/cells.ts; dynamicParams = true), and this gate verifies a cell href only against the prerendered list and the harness exemplars; an unverifiable door is never counted as passing" : "none"}`);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out.join("\n") + "\n", "utf8");
say(`  the walk is written to ${OUT}`);

for (const r of reds) red({ rule: RULE, ...r });
if (reds.length) {
  redSummary(RULE, reds.length, `every door lands on a route that exists and on a masthead that answers what the door promises (${MODULE}; MODEL.md PART 8, THE DOORS)`, `${walked} anchors on ${entries.length} renders`);
  process.exit(1);
}
console.log(`ok doors: ${walked} anchors on ${entries.length} renders, every door on a route that exists and answering its promise (${unverifiable} unverifiable, said above)`);
