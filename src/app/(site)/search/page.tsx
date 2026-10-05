/**
 * /search: THE SITE'S SEARCH, WITHOUT A POP-UP (milestone 3, masterplan step 33; his refusals of 2026-09-22: no modal, no
 * pagination). The header's search used to open a dialog over the page (⌘K); it is now this page's link. A GET form that works
 * without script, then the matching pages as rows of doors: the UK first (its page, its cities, London's trade pages), then other
 * countries (src/lib/home/site_search.ts). Never indexed: a page of results is not a page to find.
 */
import { searchSite, type SearchRow } from "@/lib/home/site_search";

export const metadata = {
  title: "Search | Margin Atlas",
  description: "Find a place or a trade on Margin Atlas, the UK first.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

function Rows({ rows, heading }: { rows: SearchRow[]; heading: string }) {
  if (rows.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-ink-900">{heading}</h2>
      <ul className="mt-3 divide-y divide-paper-350 border-y border-paper-350">
        {rows.map((r) => (
          <li key={r.href}>
            <a href={r.href} className="flex min-h-11 items-center justify-between gap-4 py-3 text-base text-ink-900 hover:text-ink-700">
              <span>{r.label}</span>
              <span aria-hidden="true" className="text-ink-500">
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = String((await searchParams).q ?? "").slice(0, 80);
  const { uk, world } = searchSite(q);
  const asked = q.trim().length >= 2;
  return (
    <article className="atlas-card mx-auto my-12 max-w-2xl px-6 py-8 md:px-9 md:py-10">
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">Search</h1>
      <form method="get" action="/search" role="search" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="search-q" className="sr-only">
          A place or a trade
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="A place or a trade: London, restaurants"
          className="min-h-11 flex-1 rounded-lg border border-paper-350 bg-white px-3 py-2 text-base text-ink-900"
        />
        <button type="submit" className="min-h-11 rounded-full bg-ink-900 px-5 text-sm font-semibold text-white hover:bg-ink-800">
          Search
        </button>
      </form>
      {asked ? (
        uk.length + world.length > 0 ? (
          <>
            <Rows rows={uk} heading="In the UK" />
            <Rows rows={world} heading="Elsewhere" />
          </>
        ) : (
          <p className="mt-8 text-base text-ink-700">Nothing matches that. Try a city or a trade.</p>
        )
      ) : null}
    </article>
  );
}
