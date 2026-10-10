/**
 * THE HERO'S WORDS (plan docs/superpowers/plans/2026-10-10-home-reform, Task 2; the spec's decision 3; the critique's P0.2 and P0.3;
 * the ship audit's 3.6, 3.7 and 4.1, WCAG 2.2.2). One timer for both words: twelve ticks of 3.5 seconds, the last a fade back to
 * "restaurant" and "London", then still for good; still at once on the first pointerdown, keydown or focusin inside #search; paused
 * while the page is hidden; still from the start under reduced motion. The h1 on set lines: a phone's break after "How much does a"
 * (hidden from 640), a break after the business; each word at its slot's left; the "?" inside the city's slot against its word; each
 * slot as wide as its widest word DRAWN, measured here from the font's advances; the motion opacity only.
 *
 * The timer is proven by mounting the real component in jsdom with a clock this test drives in place of window.setTimeout (the
 * component schedules with window.setTimeout; React keeps Node's own timers, so act() is untouched). BLIND SPOT, stated: jsdom proves
 * the mechanism, not the pixels; the lines' fit is the font measure below and the photographs of the plan's Task 9.
 *
 * Run: npx tsx tests/home/hero_words.test.ts
 */
import { JSDOM } from "jsdom";
import { red, redSummary } from "../../scripts/lib/red";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { pretendToBeVisual: true });
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
/* globalThis.navigator is getter-only on modern Node; defineProperty wins. */
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
/* React ships `act` in its development build only and reads NODE_ENV when first evaluated (tests/spine/setup_tiers_expand.test.ts
   says why, and what it cost on a build server): set before the dynamic imports below. */
Object.assign(process.env, { NODE_ENV: "development" });

/* THE CLOCK: the component's window.setTimeout and window.clearTimeout, run only when the test advances time. */
type Timer = { id: number; at: number; fn: () => void };
let now = 0;
let seq = 0;
let timers: Timer[] = [];
Object.defineProperty(dom.window, "setTimeout", { configurable: true, writable: true, value: (fn: () => void, ms = 0) => { seq += 1; timers.push({ id: seq, at: now + ms, fn }); return seq; } });
Object.defineProperty(dom.window, "clearTimeout", { configurable: true, writable: true, value: (id: number) => { timers = timers.filter((t) => t.id !== id); } });
/* Reduced motion and a hidden page, each a switch the test throws (jsdom has no matchMedia, and its page is never hidden). */
let reduce = false;
let hidden = false;
Object.defineProperty(dom.window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: reduce && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }) });
Object.defineProperty(dom.window.document, "hidden", { configurable: true, get: () => hidden });

const RULE = "hero-words";
const REMEDY = "keep the hero's two words on HeroWords' one timer (src/lib/hero-words.ts): twelve ticks then the first words for good, still at once on a touch, key or focus inside #search, paused while hidden, still under reduced motion, each word at its slot's left, the \"?\" inside the city's slot";
let failed = 0;
const check = (label: string, ok: boolean, file: string, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

async function main() {
  const React = (await import("react")).default;
  const { act } = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { HeroWords } = await import("../../src/components/spine/home/HeroWords");
  const { RotatingWord } = await import("../../src/components/RotatingWord");
  const W = await import("../../src/lib/hero-words");
  const { COPY } = await import("../../src/lib/spine/copy");
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const HERO = "src/components/spine/home/HeroWords.tsx";
  const WORD = "src/components/RotatingWord.tsx";
  const WORDS = "src/lib/hero-words.ts";
  const props = { lead: COPY.home.h1.lead, middle: COPY.home.h1.middle, businesses: W.HERO_BUSINESSES, cities: W.HERO_CITIES };

  /* THE SET LINES, AS THE SERVER RENDERS THEM. */
  const html = renderToStaticMarkup(React.createElement(HeroWords, props));
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  check(`the h1 reads as one question ("${text}")`, text === "How much does a restaurant make in London?", HERO);
  check("a phone breaks after \"How much does a\"; from 640 the line runs on to the business", html.startsWith(`${COPY.home.h1.lead} <br class="sm:hidden"/>`), HERO, "put <br className=\"sm:hidden\" /> straight after the lead and its space");
  const spacers = [...html.matchAll(/data-w="([^"]*)"/g)].map((m) => m[1]);
  check(`two slots, the business's sized by "restaurant" and the city's by "Shanghai?" (read: ${spacers.join(", ") || "none"})`, JSON.stringify(spacers) === JSON.stringify(["restaurant", "Shanghai?"]), HERO);
  check("the business ends the first line: a break follows its slot, then \"make in\"", /restaurant<\/span><\/span><\/span> <br\/>make in <span class="text-atlas-700" data-founder-accent="">/.test(html), HERO);
  check("the \"?\" stands inside the city's slot against its word, no space before it, in ink", html.includes('>London<span class="text-[var(--c-ink)]">?</span></span>') && !/<\/span>\s*\?/.test(html), HERO);
  const wordClasses = [...html.matchAll(/<span class="(absolute [^"]*)">/g)].map((m) => m[1]);
  check(`each word stands at its slot's left, no padding and no translate, and fades by opacity alone (read: ${wordClasses.join(" | ")})`, wordClasses.length === 2 && wordClasses.every((c) => c === "absolute left-0 inline-block transition-opacity duration-300 ease-out opacity-100") && !/padding|translate|transition-all/.test(html), WORD);

  /* THE LIVE HOME'S WORD, UNCHANGED: centred, padded, sized by letters, when nothing else is asked. */
  const plain = renderToStaticMarkup(React.createElement(RotatingWord, { words: ["Paris", "Istanbul"] }));
  check("a word asked nothing else stays centred with its 0.15em and sizes by letters", /style="padding-left:0\.15em;padding-right:0\.15em"/.test(plain) && /data-w="Istanbul"/.test(plain) && /class="absolute left-1\/2 -translate-x-1\/2 inline-block transition-opacity duration-300 ease-out opacity-100"/.test(plain), WORD, "keep RotatingWord's default (align center) as the live home draws it: 0.15em either side, centred, the longest word by letters");

  /* THE WIDEST WORDS, BY DRAWN WIDTH (the ship audit's 3.6): Space Grotesk's advances at weight 500, in em, read on 2026-10-10 from the
     latin file the site serves (.next/static/media/36966cca54120369-s.p.woff2), less the h1's tight tracking (0.025em a letter). */
  const ADV: Record<string, number> = { "?": 0.579, B: 0.663, C: 0.643, D: 0.665, I: 0.254, L: 0.544, M: 0.874, P: 0.603, S: 0.609, T: 0.588, a: 0.577, b: 0.641, c: 0.592, d: 0.641, e: 0.584, g: 0.64, h: 0.615, i: 0.256, k: 0.551, l: 0.256, m: 0.857, n: 0.615, o: 0.615, p: 0.641, q: 0.641, r: 0.387, s: 0.525, t: 0.458, u: 0.614, y: 0.614 };
  const drawn = (s: string) => [...s].reduce((sum, c) => sum + (ADV[c] ?? Number.NaN) - 0.025, 0);
  const widest = (list: readonly string[], suffix = "") => list.reduce((a, b) => (drawn(b + suffix) > drawn(a + suffix) ? b : a));
  const unmeasured = [...new Set([...W.HERO_CITIES, ...W.HERO_BUSINESSES, "?"].join(""))].filter((c) => !(c in ADV));
  check(`every letter of the hero's words is measured${unmeasured.length ? `: not ${unmeasured.join(" ")}` : ""}`, unmeasured.length === 0, WORDS, "measure the new letter's advance at weight 500 from the site's Space Grotesk and add it to ADV in this test");
  check(`the cities' slot is the widest city drawn with its "?" (${W.HERO_WIDEST_CITY}, ${drawn(W.HERO_WIDEST_CITY + "?").toFixed(2)}em; measured widest: ${widest(W.HERO_CITIES, "?")})`, widest(W.HERO_CITIES, "?") === W.HERO_WIDEST_CITY, WORDS, "set HERO_WIDEST_CITY to the city that draws widest with its \"?\"");
  check(`the businesses' slot is the widest business drawn (${W.HERO_WIDEST_BUSINESS}, ${drawn(W.HERO_WIDEST_BUSINESS).toFixed(2)}em; measured widest: ${widest(W.HERO_BUSINESSES)})`, widest(W.HERO_BUSINESSES) === W.HERO_WIDEST_BUSINESS, WORDS, "set HERO_WIDEST_BUSINESS to the business that draws widest");
  check("the lap is the cities' (twelve ticks of 3.5 s, a quarter-second fade); after a tick the index is the tick, the first words from the last", W.HERO_TICKS === W.HERO_CITIES.length && W.HERO_TICKS === 12 && W.HERO_TICK_MS === 3500 && W.HERO_FADE_MS === 250 && [0, 1, 11, 12, 13].map(W.heroIndexAt).join() === "0,1,11,0,0", WORDS);

  /* THE TIMER, MOUNTED. */
  const container = document.getElementById("root")!;
  let root = createRoot(container);
  const mount = async () => {
    await act(async () => { root.unmount(); });
    timers = [];
    root = createRoot(container);
    await act(async () => {
      root.render(React.createElement("section", { id: "search" }, React.createElement("h1", null, React.createElement(HeroWords, props)), React.createElement("input", { id: "probe", "aria-label": "probe" })));
    });
  };
  const advance = async (ms: number) => {
    const end = now + ms;
    for (;;) {
      timers.sort((a, b) => a.at - b.at || a.id - b.id);
      const t = timers[0];
      if (!t || t.at > end) break;
      timers.shift();
      now = t.at;
      await act(async () => { t.fn(); });
    }
    now = end;
  };
  const words = () => [...container.querySelectorAll("span.absolute")].map((s) => `${(s.textContent ?? "").replace(/\?$/, "")}${s.classList.contains("opacity-0") ? " (fading)" : ""}`).join(" / ");
  const TICK = W.HERO_TICK_MS + W.HERO_FADE_MS;

  await mount();
  check(`the first words, and one timer waiting (${words()}, ${timers.length} timer)`, words() === "restaurant / London" && timers.length === 1, HERO);
  await advance(W.HERO_TICK_MS);
  check(`at 3.5 s both words fade out together (${words()})`, words() === "restaurant (fading) / London (fading)", HERO);
  await advance(W.HERO_FADE_MS);
  check(`a quarter of a second later both words are the next (${words()})`, words() === "bakery / Paris", HERO);
  await advance(TICK * 10);
  check(`after eleven ticks, the lap's last city (${words()})`, words() === "barber / Shanghai", HERO);
  await advance(TICK);
  check(`the twelfth tick is the last fade, back to the first words, and no timer is left (${words()}, ${timers.length} timer)`, words() === "restaurant / London" && timers.length === 0, HERO);
  await advance(60_000);
  check(`still a minute later (${words()})`, words() === "restaurant / London" && timers.length === 0, HERO);

  const acts: Array<[string, () => void]> = [
    ["pointerdown", () => { document.getElementById("search")!.dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })); }],
    ["keydown", () => { document.getElementById("probe")!.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "a", bubbles: true })); }],
    ["focusin", () => { (document.getElementById("probe") as HTMLInputElement).focus(); }],
  ];
  for (const [name, fire] of acts) {
    await mount();
    await advance(TICK);
    await act(async () => { fire(); });
    await advance(60_000);
    check(`a ${name} inside #search stops the words at once, where they are (${words()}, ${timers.length} timer)`, words() === "bakery / Paris" && timers.length === 0, HERO);
  }

  await mount();
  await advance(W.HERO_TICK_MS);
  await act(async () => { document.getElementById("search")!.dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })); });
  await advance(60_000);
  check(`a touch during a fade undoes it: the words on screen come back and stay (${words()})`, words() === "restaurant / London" && timers.length === 0, HERO);

  await mount();
  await advance(TICK);
  hidden = true;
  await act(async () => { document.dispatchEvent(new dom.window.Event("visibilitychange")); });
  await advance(60_000);
  check(`hidden, the words wait (${words()}, ${timers.length} timer)`, words() === "bakery / Paris" && timers.length === 0, HERO);
  hidden = false;
  await act(async () => { document.dispatchEvent(new dom.window.Event("visibilitychange")); });
  await advance(TICK);
  check(`shown again, they go on from where they were (${words()})`, words() === "pharmacy / Istanbul", HERO);

  reduce = true;
  await mount();
  await advance(60_000);
  check(`under reduced motion the first words, still, and no timer (${words()}, ${timers.length} timer)`, words() === "restaurant / London" && timers.length === 0, HERO);
  reduce = false;

  await act(async () => { root.unmount(); });
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/hero_words: all pass");
  process.exit(0);
}

main().catch((e) => {
  console.error("x hero-words crashed:", e);
  process.exit(1);
});
