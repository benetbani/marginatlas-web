"use client";

import { useEffect, useState } from "react";

/**
 * A word that changes in place: the current word fades out and the next fades in, at the same spot (2026-10-07: no slide).
 * Tailwind transitions only, no animation library.
 */
type Props = {
  words: string[];
  /** ms between rotations */
  interval?: number;
  /** ms delay before the first rotation (use to offset two rotators) */
  offset?: number;
  className?: string;
};

export function RotatingWord({
  words,
  interval = 3500,
  offset = 0,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
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
          setIndex((i) => (i + 1) % words.length);
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
  }, [words.length, interval, offset]);

  /* THE WORD CHANGES IN PLACE (his ruling of 2026-10-07: the hero "keeps moving upwards in an unnatural way"). It slid down
     and rose from below every two seconds in each of the hero's two slots; it now only fades, so nothing in the headline moves. */
  const transform = phase === "in" ? "opacity-100" : "opacity-0";

  // CitiesFix2 sec 2: pick the widest candidate word once and use it as
  // the spacer so the static prefix and suffix never move horizontally
  // while the word rotates. The active word renders absolutely on top
  // of the invisible spacer.
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  // Founder direction 2026-05-26: add tiny breathing room on both
  // sides of the slot so longer cities (Mumbai, Shanghai) and longer
  // businesses (restaurant) don't visually collide with the
  // surrounding static text. 0.15em scales with the H1 font-size on
  // both mobile and desktop, keeping the gap proportional.
  return (
    <span className={`relative inline-block align-baseline ${className}`} style={{ paddingLeft: "0.15em", paddingRight: "0.15em" }}>
      {/* THE SPACER HOLDS NO TEXT (masterplan step 32): the widest word sized the slot as a text node, so a crawler and the page
          laws both read the h1 as "How much does a restaurant bakery make in Istanbul London?". Its width now comes from the
          same word drawn by a pseudo-element, which takes the space and is no text anyone reads. */}
      <span aria-hidden="true" data-w={widest} className="invisible before:content-[attr(data-w)]" />
      <span
        className={`absolute left-1/2 -translate-x-1/2 inline-block transition-all duration-300 ease-out ${transform}`}
      >
        {words[index]}
      </span>
    </span>
  );
}
