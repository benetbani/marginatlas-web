"use client";

/**
 * MobileNav , the masthead's sheet under 1280 (R5 Part 8; reformed to ship 2026-10-10, plan Task 1; the critique's section 5, the
 * ship audit's 1.2, 1.6, 1.7, 1.8 and 1.12). Under 1280 it is a phone's, a tablet's and a small laptop's only navigation, so it
 * carries what the bar carries, and the trust pages besides.
 *
 * THE TOGGLE: its name is "Menu", always, and `aria-expanded` says the state (the name used to flip between "Open menu" and "Close
 * menu" while aria-expanded changed too, two signals for one state). `aria-controls` names a panel that is always in the document
 * and `hidden` while shut (it named a node that did not exist while closed). The glyph swaps; nothing moves. The 44px target
 * reaches 14px into the gutter (-mr-3.5; critique pass 3, fix round D1, item P1.3): the 22px glyph's ink stops 13.75px inside its
 * box, so without it the three lines ended 22px short of the card's edge on a phone; with it they end on the content's edge.
 *
 * THE PANEL: under 768 a sheet, from 768 a 360px dropdown under its own button (BOX and PANEL below say how, critique pass 3, fix round D1,
 * item P1.4). The sheet: full width under the bar, white, a --c-border hairline under it and the card's shadow; its rows on the bar's own column
 * (`max-w-content` and the site's one gutter, GUTTER in src/lib/nav.ts; it was max-w-7xl, up to 80px off the wordmark between 1120 and 1279); its height
 * capped at the viewport less the bar and scrollable (a landscape phone and 200 percent zoom cut its last rows off, and the page
 * could not scroll them into reach because the sheet moves with the sticky bar). Rows are 48px: the seven names (src/lib/nav.ts);
 * then, quieter, About the figures and Who runs this; then Sign in or Account and Pricing, each only while its switch is on. No
 * Search row (critique pass 3, fix round D1, item P1.2): the bar carries Search on every page now, the home from its first paint, so
 * the open sheet showed it twice. The page being read is marked as the bar marks it, `aria-current="page"`, and for the eye: ink,
 * semibold, a 2px ink rule at the row's left.
 *
 * IT CLOSES on a row tap, on Escape (focus goes back to the toggle; it used to fall to the page, and the next Tab began again at
 * the top), on a tap outside it, and when the window grows to 1280, where the bar's own names take over. Inline SVG glyphs, tokens
 * only. No ring of its own: the site's focus floor (globals.css) draws every ring, 2px ink (the old ring here read 1.93:1).
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GUTTER, NAV, SHEET_TRUST, barFrom, currentNav } from "@/lib/nav";
import { isAuthEnabled } from "@/lib/feature_flags";
import { AuthLink } from "@/components/HeaderAuth";

/** The panel's id: the toggle's `aria-controls`. */
export const SHEET_ID = "site-menu";

const ROW = "flex min-h-12 items-center border-l-2 pl-3";
const ROW_MAIN = `${ROW} text-base font-medium`;
const ROW_QUIET = `${ROW} border-transparent text-sm text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]`;
const IDLE = "border-transparent text-[var(--c-ink)] underline-offset-[6px] hover:underline hover:decoration-1 hover:decoration-[var(--c-line-strong)]";
const CURRENT = "border-[var(--c-ink)] font-semibold text-[var(--c-ink)]";
const GROUP = "mt-2 border-t border-[var(--c-border)] pt-2";
/**
 * THE SHEET UNDER 768, THE PANEL FROM 768 (critique pass 3, fix round D1, item P1.4). Under 768 the box is the full-width white sheet it
 * was (hairline, the card's shadow, capped to the viewport less the bar, scrolling). From 768, where the sheet is a tablet's only navigation
 * (768 to 1079, to 1279 with a switch on), a phone's list in a tablet-wide slab left about 85 percent of the white empty, so the box turns
 * transparent and takes no pointer, and the <nav> inside it is the panel: 360px, on the content's right edge under its own button, white, a
 * hairline on three sides (its top is the bar's own), 12px under-corners, the card's shadow, scrolling within the viewport less the bar.
 * The page stays visible and live beside it. No scrim and no dim (his refusal of modals, 2026-09-22: a dropdown, not a dialog).
 */
const BOX = "absolute inset-x-0 top-full z-dropdown max-h-[calc(100dvh_-_var(--atlas-header-h))] overflow-y-auto overscroll-contain border-b border-[var(--c-border)] bg-white shadow-card md:pointer-events-none md:max-h-none md:overflow-visible md:border-b-0 md:bg-transparent md:shadow-none";
const PANEL = "py-2 md:ml-auto md:w-[22.5rem] md:pointer-events-auto md:max-h-[calc(100dvh_-_var(--atlas-header-h))] md:overflow-y-auto md:overscroll-contain md:rounded-b-xl md:border md:border-t-0 md:border-[var(--c-border)] md:bg-white md:px-3 md:shadow-card";

export function MobileNav({ pricing = false }: { pricing?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const current = currentNav(usePathname());
  const auth = isAuthEnabled();
  /* Where the bar's own names take over: ONE constant for the bar and this sheet (barFrom, src/lib/nav.ts), 1080 while accounts and the
     paywall are both off and 1280 otherwise. */
  const bar = barFrom();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia(bar.media);
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [open, bar.media]);

  const close = () => setOpen(false);

  return (
    /* `bar.sheet` (xl:hidden, or min-[1080px]:hidden while both switches are off), not md:hidden. Its sibling desktop nav in SiteChrome does not
       fit at md and wrapped the masthead to two rows across 768 to 1023, so
       this carried navigation up to lg; since 2026-10-01 up to xl, because at
       1024 the nav and the 40px lockup wrapped the lockup instead. The two
       breakpoints must always match: a gap leaves no nav at all, an overlap
       shows two. */
    <div ref={rootRef} className={bar.sheet}>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={SHEET_ID}
        onClick={() => setOpen((v) => !v)}
        className="-mr-3.5 inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--c-ink)]"
      >
        {open ? (
          // Close glyph.
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          // Hamburger glyph.
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <div
        id={SHEET_ID}
        hidden={!open}
        className={BOX}
      >
        <div className={`mx-auto max-w-content ${GUTTER}`}>
          <nav aria-label="Primary" className={PANEL}>
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={current === item.href ? "page" : undefined}
                    className={`${ROW_MAIN} ${current === item.href ? CURRENT : IDLE}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={GROUP}>
              {SHEET_TRUST.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className={ROW_QUIET}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {auth || pricing ? (
              <ul className={GROUP}>
                {auth ? (
                  <li>
                    <AuthLink onClick={close} className={`${ROW_MAIN} ${IDLE}`} />
                  </li>
                ) : null}
                {pricing ? (
                  <li>
                    <Link href="/pricing" onClick={close} className={`${ROW_MAIN} ${IDLE}`}>
                      Pricing
                    </Link>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </nav>
        </div>
      </div>
    </div>
  );
}
