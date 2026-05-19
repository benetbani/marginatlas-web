"use client";

import { useEffect, useState } from "react";

/**
 * Plan v13 Wave 4e — slot-machine-style rotating word.
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
    // Plan v14 6c: respect prefers-reduced-motion. Users with motion
    // reduction enabled get a single static pick and no rotation interval.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIndex(Math.floor(Math.random() * words.length));
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

  return (
    <span
      className={`inline-block transition-all duration-300 ease-out ${transform} ${className}`}
    >
      {words[index]}
    </span>
  );
}
