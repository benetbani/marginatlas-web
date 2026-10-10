"use client";

/**
 * NavLinks , the masthead's seven names from 1280, or from 1080 while accounts and the paywall are both off (barFrom, src/lib/nav.ts; plan 2026-10-10, the home reformed to ship, Task 1; the critique's section 5,
 * the ship audit's 1.5 and 1.14). One list (src/lib/nav.ts), each name a next/link, inside the bar's `<nav aria-label="Primary">`:
 * the bar's navigation had no name and nothing marked the page being read, and every click was a full document load.
 *
 * The page being read is marked for a screen reader (`aria-current="page"`) and for the eye: ink, a 2px ink underline 6px under the
 * words. Every other name is --c-ink2 and goes to ink with a 1px --c-line-strong underline on hover. Nothing here is terracotta
 * (MODEL.md PART 6: terracotta never marks a link or a hover; his ruling of 2026-07-11). A client island only because the page
 * being read comes from the address (usePathname).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, NAV_CURRENT, NAV_IDLE, barFrom, currentNav } from "@/lib/nav";

export function NavLinks() {
  const current = currentNav(usePathname());
  const bar = barFrom();
  return (
    /* 20px BETWEEN NAMES, NOT 24 (plan 2026-10-10 Task 9, the masthead photographed at 1280 with both switches on): the bar's content is
       1072 wide at every width from 1280, and the wordmark, the seven names at 24, Search, Account (the entry holds the longer word) and
       the Pricing pill filled it to the pixel, so "Atlas" touched "Countries" (measured 0px between them; 9px with "Sign in"). At 20 the
       six gaps free 24px, and SiteChrome's group gap at xl frees 12 more: 36px of air at the tightest. */
    <nav aria-label="Primary" className={`${bar.names} items-center gap-5 text-base`}>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={current === item.href ? "page" : undefined}
          className={current === item.href ? NAV_CURRENT : NAV_IDLE}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
