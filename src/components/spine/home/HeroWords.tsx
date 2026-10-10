"use client";
/**
 * THE HERO'S TWO WORDS, ON ONE TIMER, ON SET LINES (plan docs/superpowers/plans/2026-10-10-home-reform, Task 2; the spec's decision 3;
 * the critique's P0.2 and P0.3). His h1 (2026-08-16, still since 2026-10-07): "How much does a restaurant make in London?", the
 * business and the city fading in place.
 *
 * THE LINES ARE SET, NOT LEFT TO WRAP (his open question of 2026-09-10, answered by the spec): "How much does a restaurant" / "make in
 * London?" from 640px, "How much does a" / "restaurant" / "make in London?" below. Each rotating word ends its line, so the room its
 * slot keeps for the widest word falls where nothing follows, and the "?" stands inside the city's slot against the word.
 *
 * ONE TIMER FOR BOTH WORDS, AND IT STOPS (WCAG 2.2.2): a tick every 3.5 seconds, twelve ticks, the last a fade back to the first words,
 * then still for good (src/lib/hero-words.ts); still at once on the first pointerdown, keydown or focusin inside #search, the hero's
 * section, so nothing moves while the visitor works the picker; paused while the page is hidden; under reduced motion the first
 * words, still. The server renders the first words. It schedules with window.setTimeout, which tests/home/hero_words.test.ts swaps
 * for a clock it drives.
 *
 * THE TWO WORDS ARE HIS H1'S RED, NOT AN ACCENT (the plan's amendment 1): --terra-text became #991600, the red these words have always
 * printed (text-atlas-700), so the accent walk (scripts/lib/accent_walk.mjs) would count both as accents and the home would read over
 * its budget. Each wrapper carries data-founder-accent, the walk's own exemption for a mark he ruled.
 */
import * as React from "react";
import { RotatingWord } from "@/components/RotatingWord";
import { HERO_FADE_MS, HERO_TICK_MS, HERO_TICKS, HERO_WIDEST_BUSINESS, HERO_WIDEST_CITY, heroIndexAt } from "@/lib/hero-words";

export function HeroWords({ lead, middle, businesses, cities }: { lead: string; middle: string; businesses: readonly string[]; cities: readonly string[] }) {
  const [tick, setTick] = React.useState(0);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let done = 0;
    let stopped = false;
    let timer: number | undefined;
    const clear = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const step = () => {
      done += 1;
      setTick(done);
      setFading(false);
      timer = undefined;
      if (done >= HERO_TICKS) stopped = true;
      else schedule();
    };
    const fadeOut = () => {
      setFading(true);
      timer = window.setTimeout(step, HERO_FADE_MS);
    };
    function schedule() {
      clear();
      if (!stopped && !document.hidden) timer = window.setTimeout(fadeOut, HERO_TICK_MS);
    }
    /* A fade under way when the visitor acts, or the page hides, is undone: the word on screen comes back and stays. */
    const stop = () => {
      stopped = true;
      clear();
      setFading(false);
    };
    const onVisibility = () => {
      if (document.hidden) {
        clear();
        setFading(false);
      } else schedule();
    };
    const host = document.getElementById("search");
    const acts = ["pointerdown", "keydown", "focusin"] as const;
    for (const a of acts) host?.addEventListener(a, stop);
    document.addEventListener("visibilitychange", onVisibility);
    schedule();
    return () => {
      stopped = true;
      clear();
      for (const a of acts) host?.removeEventListener(a, stop);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const index = heroIndexAt(tick);
  return (
    <>
      {lead}{" "}
      <br className="sm:hidden" />
      <span className="text-atlas-700" data-founder-accent="">
        <RotatingWord words={businesses} index={index} fading={fading} align="start" widest={HERO_WIDEST_BUSINESS} />
      </span>{" "}
      <br />
      {middle}{" "}
      <span className="text-atlas-700" data-founder-accent="">
        <RotatingWord words={cities} index={index} fading={fading} align="start" widest={HERO_WIDEST_CITY} suffix="?" />
      </span>
    </>
  );
}
