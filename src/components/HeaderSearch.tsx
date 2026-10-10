/**
 * HeaderSearch: the persistent search in the masthead.
 *
 * Every route gets it, the home from its first paint (critique pass 3, fix round D1, item P1.2). The home page used to get nothing, then
 * got a search that stayed invisible until the picker had scrolled away. Both rested on one reason, and it had expired:
 *
 *   "The homepage hero already mounts a search inside the rotating-headline card as the primary CTA; showing the header
 *    version simultaneously produced two visible search affordances on the same screen."
 *
 * Both halves stopped being true. The hero is a three-field picker for one case (a country, a city, a business), and the bar's
 * Search is a link to /search, a page that finds any page on the site; one does not stand in for the other. Meanwhile the invisible
 * slot cost the home's first screen its right edge: the seven names stopped 96px short of the content's edge at 1280 (99px at 1080),
 * a hole in the one element every page repeats, on the screen most visitors judge the site by. The slot is drawn and shown, as on
 * every other page, so the bar is balanced from the first paint and nothing moves on the first scroll.
 *
 * No box: the icon at 16 and the word from 768, --c-ink2, ink on hover, a 44 by 44 target (the icon-only form under 768 was 40
 * wide). A link and nothing else, so no client code runs for it: no observer, no state, no read of the address.
 *
 * A LINK, NOT A DIALOG (masterplan step 33; his refusals of 2026-09-22: no modal). The header's search once opened GlobalSearch,
 * a dialog over the page on a click or ⌘K; it goes to /search, a page that works without script, and the dialog is gone.
 */
export function HeaderSearch() {
  return (
    <a
      href="/search"
      aria-label="Search Margin Atlas"
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 text-base text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <span className="hidden md:inline">Search</span>
    </a>
  );
}
