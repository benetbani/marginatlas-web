"use client";

/**
 * HeaderSearch — the persistent search in the masthead.
 *
 * Every route gets it. The home page used to get nothing, and the reason had
 * expired:
 *
 *   "The homepage hero (Wave 4e) already mounts <GlobalSearch /> inside the
 *    rotating-headline card as the primary CTA; showing the header version
 *    simultaneously produced two visible search affordances on the same
 *    screen."
 *
 * Both halves of that stopped being true. The hero was rebuilt around
 * NavigatorForm, the three-field cascade, and the rotating-headline card is
 * gone. GlobalSearch is now mounted by this file and nowhere else, so the
 * duplicate it was avoiding could not occur.
 *
 * What the stale guard left behind was a real gap: the home page was the ONLY
 * route with no persistent search. Ten bands below the hero, a reader who
 * wanted to look something else up had to scroll back to the top, while every
 * other page on the site kept a search in reach.
 *
 * THE OBJECTION WAS STILL RIGHT AT THE TOP OF THE PAGE, though, and that is
 * why this is not simply deleted. With the navigator card on screen, a second
 * search in the header is exactly the redundancy the original note describes.
 * So the header search appears only once the navigator has scrolled away,
 * which is the behaviour of every reference this page is measured against: the
 * hero search is the instrument while you can see it, and the masthead takes
 * over when you cannot.
 *
 * HOW IT DECIDES. An IntersectionObserver on #home-search-anchor, the wrapper
 * around NavigatorForm. Watching the element itself rather than a scroll offset
 * means the threshold is wherever the card actually ends, at any viewport, with
 * no magic pixel number to go stale when the hero is edited again.
 *
 * Hidden is the initial state, so the server renders nothing and the first
 * client paint agrees with it. The reveal can only happen after a scroll, which
 * is after hydration, so there is no mismatch to reconcile.
 *
 * If the anchor is missing (the home page changed shape, or this mounts
 * somewhere unexpected), the observer never attaches and the search stays
 * hidden. Failing to the current behaviour rather than to two search boxes.
 */

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { GlobalSearch } from "@/components/GlobalSearch";

/** The home page's hero search wrapper, set in src/app/page.tsx. */
const HOME_ANCHOR_ID = "home-search-anchor";

export function HeaderSearch() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [heroSearchGone, setHeroSearchGone] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const anchor = document.getElementById(HOME_ANCHOR_ID);
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroSearchGone(!entry.isIntersecting),
      // A sliver still counts as present: the header should not appear while
      // the bottom edge of the navigator is still under it.
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [isHome]);

  if (isHome && !heroSearchGone) return null;
  return <GlobalSearch />;
}
