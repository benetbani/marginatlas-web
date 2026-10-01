"use client";

/**
 * PhoneLockup , the masthead's lockup on a phone, which keeps the page's place (2026-10-01, the goal of that day, T5).
 *
 * WHY. The three critics the founder sent on 2026-09-27 end on the same move: "the product title transitions into the top
 * navigation and stays sticky. So, even when the user scrolls deeper into the page, they never lose context." Measured on the
 * live pages that day, the sticky bar held the brand and nothing else all the way down a thirteen-level page, and on a 375
 * screen it held it in 117px (the two words wrapped beside the search and the menu): 14% of the screen said "Margin Atlas"
 * and none of it said which page was being read.
 *
 * WHAT IT DOES. At the founder's mobile lockup, one line (28, the size that fits beside the search and the menu at 360), the
 * mark always; once the page's own h1 has scrolled under the bar, the two words fade out and the h1's words fade in where they
 * stood ("United Kingdom", "Barbershops", "London"), and scrolling back up returns the brand. Nothing moves: the bar keeps its
 * height and the name takes the words' place.
 *
 * HOW IT DECIDES. An IntersectionObserver on `main h1`, its top margin the bar's own height, so "under the bar" is wherever the
 * bar ends at any width (HeaderSearch.tsx's idiom: an element, never a scroll offset). The home page keeps the brand: its h1
 * is a sentence about the atlas, not a place. No h1, no name, the lockup as it was.
 *
 * The server renders the brand (no name yet), so the first paint agrees with it; the name can only arrive after hydration.
 */
import { usePathname } from "next/navigation";
import * as React from "react";

import { LogoWordmark } from "@/components/brand/LogoWordmark";

export function PhoneLockup() {
  const pathname = usePathname();
  const [place, setPlace] = React.useState<string | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    setPlace(null);
    setShown(false);
    if (pathname === "/") return;
    const h1 = document.querySelector("main h1");
    const name = h1?.textContent?.replace(/\s+/g, " ").trim();
    if (!h1 || !name) return;
    setPlace(name);
    const bar = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < bar),
      { rootMargin: `-${Math.round(bar)}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(h1);
    return () => observer.disconnect();
  }, [pathname]);

  return <LogoWordmark size={28} labeled={false} place={place} placeShown={shown} />;
}
