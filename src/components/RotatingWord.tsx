"use client";

import * as React from "react";

/**
 * A word that changes in place: the current word fades out and the next fades in, at the same spot (2026-10-07: no slide).
 * Tailwind transitions only, no animation library. It runs one of two ways: on its own timer (the live home behind its switch), or
 * driven by a parent that owns one timer for both of the hero's words and stops it (`index` and `fading`: the rebuilt home's
 * HeroWords, plan 2026-10-10, home reform, Task 2).
 */
type Props = {
  words: readonly string[];
  /** ms between rotations, on its own timer */
  interval?: number;
  /** ms delay before the first rotation (use to offset two rotators) */
  offset?: number;
  className?: string;
  /** Driven: the word shown is `words[index % words.length]`, and no timer of its own runs. */
  index?: number;
  /** Driven: the word is faded out while true. */
  fading?: boolean;
  /** "start": the word stands at the slot's left edge with no padding, for a word that ends its line, so the slot's leftover falls
   *  after it where nothing follows; "center" (the default): centred, with 0.15em either side. */
  align?: "start" | "center";
  /** The word that sizes the slot, chosen by drawn width (src/lib/hero-words.ts); by default the longest by letters. */
  widest?: string;
  /** What the slot draws after its word, in ink, fading with it: the hero's "?", so it stands against the city with no gap. */
  suffix?: string;
};

export function RotatingWord({
  words,
  interval = 3500,
  offset = 0,
  className = "",
  index,
  fading = false,
  align = "center",
  widest,
  suffix = "",
}: Props) {
  const [ownIndex, setOwnIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<"in" | "out">("in");
  const driven = typeof index === "number";

  React.useEffect(() => {
    // A driven word runs no timer of its own: its parent owns the one timer.
    if (driven) return;
    // Respect prefers-reduced-motion. Users with motion
    // reduction enabled get a single static pick and no rotation interval.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return;
    }

    let mounted = true;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const startTimer = setTimeout(() => {
      const tick = () => {
        if (!mounted) return;
        setPhase("out");
        setTimeout(() => {
          if (!mounted) return;
          setOwnIndex((i) => (i + 1) % words.length);
          setPhase("in");
        }, 250);
      };
      intervalId = setInterval(tick, interval);
    }, offset);

    return () => {
      mounted = false;
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [driven, words.length, interval, offset]);

  const at = typeof index === "number" ? index : ownIndex;
  const shown = words[((at % words.length) + words.length) % words.length];
  const out = typeof index === "number" ? fading : phase === "out";

  /* THE WORD CHANGES IN PLACE (his ruling of 2026-10-07: the hero "keeps moving upwards in an unnatural way"). It slid down
     and rose from below every two seconds in each of the hero's two slots; it now only fades, so nothing in the headline moves.
     Only the opacity transitions (the ship audit's 3.7: the transition named every property, for a change of one). */
  const opacity = out ? "opacity-0" : "opacity-100";

  // CitiesFix2 sec 2: the widest candidate word is the spacer, so the static prefix and suffix never move horizontally while the
  // word rotates; the active word renders absolutely on top of the invisible spacer. The hero names its widest word by drawn width
  // (`widest`); counting letters chose "Istanbul" over the wider "Shanghai" (the ship audit's 3.6).
  const spacer = (widest ?? words.reduce((a, b) => (b.length > a.length ? b : a), "")) + suffix;
  const start = align === "start";

  // Founder direction 2026-05-26: tiny breathing room on both sides of a centred slot so longer cities and businesses don't
  // visually collide with the surrounding static text; 0.15em scales with the h1. A slot aligned to its start ends its line (the
  // hero's set lines, plan 2026-10-10), so it takes none: its spacer is its widest word drawn, which no word can overrun.
  return (
    <span className={`relative inline-block align-baseline ${className}`} style={start ? undefined : { paddingLeft: "0.15em", paddingRight: "0.15em" }}>
      {/* THE SPACER HOLDS NO TEXT (masterplan step 32): the widest word sized the slot as a text node, so a crawler and the page
          laws both read the h1 as "How much does a restaurant bakery make in Istanbul London?". Its width now comes from the
          same word drawn by a pseudo-element, which takes the space and is no text anyone reads. */}
      <span aria-hidden="true" data-w={spacer} className="invisible before:content-[attr(data-w)]" />
      <span
        className={`absolute ${start ? "left-0" : "left-1/2 -translate-x-1/2"} inline-block transition-opacity duration-300 ease-out ${opacity}`}
      >
        {shown}
        {suffix ? <span className="text-[var(--c-ink)]">{suffix}</span> : null}
      </span>
    </span>
  );
}
