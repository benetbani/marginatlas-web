"use client";

import { useEffect, useState } from "react";

/**
 * Slot-machine-style rotating word.
 * Drops the current word down + fades it out, then rises the next word
 * from below + fades it in. Tailwind transitions only — no animation lib.
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
  interval = 2000,
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

  const transform =
    phase === "in"
      ? "translate-y-0 opacity-100"
      : "translate-y-2 opacity-0";

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
      <span className="invisible">{widest}</span>
      <span
        className={`absolute left-1/2 -translate-x-1/2 inline-block transition-all duration-300 ease-out ${transform}`}
      >
        {words[index]}
      </span>
    </span>
  );
}
