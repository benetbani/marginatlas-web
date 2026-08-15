/**
 * CatalogCollections , the destination for the home page catalog plates.
 *
 * WHY IT EXISTS. The plates on the home page make four claims and print a
 * figure for each, "39 of 194 countries". Until this shipped, clicking one
 * landed on /countries, a list of all 194. The page stated a number and then
 * sent the reader somewhere that could not show it, which is the same failure as
 * a headline with no article under it.
 *
 * WHY IT LIVES ON /extremes RATHER THAN A NEW ROUTE. That page already IS the
 * interesting-subsets surface: its existing lens blocks are "the cheapest
 * businesses to start", "the highest barriers to entry", "where a restaurant
 * barely clears". A collection is the same kind of object, so it belongs in the
 * same room. Adding a route would have split one idea across two pages and
 * created a page type this project does not add without the founder.
 *
 * EACH COLLECTION STATES ITS OWN MEMBERSHIP RULE. "Below the world median on tax
 * and on labour cost" is a claim a reader can disagree with; "top countries" is
 * not. That is the difference between an editorial collection and a filter, and
 * it is why the rule renders rather than sitting in a comment.
 *
 * A collection with nothing measured renders its gap in words instead of an
 * empty table. Districts have no decline metric yet.
 */
import { getCatalogCollections } from "@/lib/home/catalog";
import { COUNTRIES } from "@/lib/taxonomy";

/** ISO2 to a reader-facing country name. The EXPORT deliberately ships the code
 *  and not the name, so the site keeps one source of country naming and the two
 *  cannot drift; this is where it resolves. Anything not a country falls
 *  through unchanged, which is what city and trade rows want. */
const COUNTRY_NAME = new Map(COUNTRIES.map((c) => [c.code.toUpperCase(), c.name]));
function label(id: string, fallback: string): string {
  return COUNTRY_NAME.get(id.toUpperCase()) ?? fallback;
}

const num = (n: number) => n.toLocaleString("en-US");

export function CatalogCollections() {
  const collections = getCatalogCollections();

  return (
    <div className="space-y-12">
      {collections.map((c) => {
        const held = c.measured > 0;
        return (
          <section key={c.id} id={c.id} className="scroll-mt-24">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">
                {c.title}
              </h3>
              <span className="tabular-nums text-sm text-cocoa-700">
                {held ? `${c.qualifying} of ${num(c.measured)} ${c.unit}` : "not held yet"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-graphite">{c.claim}</p>
            <p className="mt-1 text-[13px] text-cocoa-700">
              How membership is decided: {c.rule}.
            </p>

            {held && c.detail.length > 0 ? (
              <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2">
                {c.detail.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-baseline justify-between gap-4 border-b border-parchment py-1.5"
                  >
                    <span className="text-[14px] text-ink-900">{label(d.id, d.name)}</span>
                    <span className="tabular-nums text-[13px] text-cocoa-700 shrink-0">
                      {d.a != null ? `${d.a}${c.columns[0] ? "" : ""}` : ""}
                      {d.b != null ? ` · ${num(d.b)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-cocoa-700">
                Nothing has been published on this yet. It needs a measure of how a
                district&apos;s trade is thinning over time, and no such figure is held.
                The collection is listed rather than hidden so the gap is visible.
              </p>
            )}

            {held && c.columns[0] ? (
              <p className="mt-2 text-[12.5px] text-cocoa-700">
                Figures are {c.columns.filter(Boolean).join(", then ")}.
                {c.qualifying > c.detail.length
                  ? ` Showing ${c.detail.length} of ${c.qualifying}.`
                  : ""}
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
