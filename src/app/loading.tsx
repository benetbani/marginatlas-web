/**
 * Root loading skeleton (Track BB.7).
 *
 * Renders while a route below the root is still streaming. WHAT IT IS, said truly (plan 2026-10-10, the home reformed to ship,
 * Task 8; the ship audit's 5.10): it sits under the root layout and above every route group, and the site's chrome is drawn per
 * page (src/components/SiteChrome.tsx), so this draws no bar and no footer. It said its shape matched the page's chrome, and it
 * never did. It is a quiet block of grey bars in the page's column, its greys the paper ramp's true neutrals (paper-100,
 * paper-200) and the parchment hairline; the [country] tree streams under its own loading files.
 */
export default function Loading() {
  return (
    <div className="py-10 animate-pulse">
      <div className="h-3 w-24 bg-paper-200 rounded mb-3" />
      <div className="h-10 w-3/4 max-w-2xl bg-paper-200 rounded mb-3" />
      <div className="h-4 w-2/3 max-w-xl bg-paper-100 rounded mb-2" />
      <div className="h-4 w-1/2 max-w-md bg-paper-100 rounded" />

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-paper-100 border border-parchment"
          />
        ))}
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-paper-100 border border-parchment"
          />
        ))}
      </div>
    </div>
  );
}
