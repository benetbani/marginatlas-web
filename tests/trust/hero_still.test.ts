/**
 * THE HERO HOLDS STILL (his ruling of 2026-10-07: scrolling the home's hero, it "keeps moving upwards in an unnatural way").
 * Measured on production: the page scrolled evenly, but the headline's two rotating words slid down and rose from below every
 * two seconds, offset by one, and every h1 rose 8px on load. The word now fades in place, both change together, and the
 * entrance is a fade. Since plan 2026-10-10 (home reform, Task 2) the rebuilt home's two words are drawn by
 * src/components/spine/home/HeroWords.tsx on its one timer (tests/home/hero_words.test.ts proves the timer), and only the
 * word's opacity transitions. Run: npx tsx tests/trust/hero_still.test.ts
 */
import { readFileSync } from "node:fs";

let failed = 0;
const check = (name: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const word = readFileSync("src/components/RotatingWord.tsx", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");
const homes = ["src/app/page.tsx", "src/components/spine/home/home-view.tsx", "src/components/spine/home/HeroWords.tsx"].map((f) => readFileSync(f, "utf8"));
check("the rotating word does not slide (no translate-y in its phases)", !/translate-y-|translateY/.test(word));
check("the hero's two words change together (no offset)", homes.every((src) => !/<RotatingWord[^>]*\boffset=/.test(src)));
check("the rebuilt home's two words take one index from one timer", (homes[2].match(/<RotatingWord[^>]*\bindex=\{index\}[^>]*\bfading=\{fading\}/g) ?? []).length === 2);
check("only the word's opacity transitions (transition-opacity, never transition-all)", /transition-opacity/.test(word) && !/transition-all/.test(word));
const rise = /@keyframes hero-rise\s*\{([\s\S]*?)\n  \}/.exec(css)?.[1] ?? "";
check("the h1 entrance is a fade, not a rise", rise.length > 0 && !/translate/.test(rise));
if (failed > 0) { console.error(`trust/hero_still: ${failed} failure(s). Remedy: keep src/components/RotatingWord.tsx to an opacity change (transition-opacity), drop offset= from the hero's RotatingWord calls (src/app/page.tsx, src/components/spine/home/home-view.tsx, src/components/spine/home/HeroWords.tsx), pass both of HeroWords' words index={index} and fading={fading}, and keep @keyframes hero-rise in src/app/globals.css to opacity, then run npx tsx tests/trust/hero_still.test.ts`); process.exit(1); }
console.log("trust/hero_still: all pass");
