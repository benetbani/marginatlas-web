/**
 * Country-page loading skeleton.
 *
 * Rewritten 2026-08-17 for the same two reasons the page itself was. It was a
 * bare, static <div> of warm cream blocks: nothing here carried a surface, so
 * AtlasFrame's fixed layers at z-index 0 painted over the whole skeleton and it
 * flashed as an empty photograph. And the blocks were the cream steps, which are
 * banned outright.
 *
 * It now mirrors what it stands in for: one card for the masthead, one for the
 * scorecard, one for the section stack, with the bars drawn in parchment, the
 * site hairline and a true neutral. A skeleton that does not match the shape it
 * precedes is a worse flash than no skeleton, so the three groups are the hero,
 * the four-up scorecard and the section run in that order.
 */
export default function CountryLoading() {
  return (
    <div className="relative animate-pulse space-y-6 md:space-y-8 py-6 md:py-8">
      <div className="atlas-card px-5 py-6 md:px-7 md:py-8">
        <div className="h-4 w-32 rounded bg-parchment mb-5" />
        <div className="h-9 w-9 rounded bg-parchment mb-4 md:h-11 md:w-11" />
        <div className="h-12 w-3/4 rounded bg-parchment mb-4" />
        <div className="h-5 w-2/3 max-w-xl rounded bg-parchment/60 mb-2" />
        <div className="h-5 w-1/2 max-w-md rounded bg-parchment/60" />
      </div>

      <div className="atlas-card px-5 py-5 md:px-7 md:py-6">
        <div className="h-5 w-40 rounded bg-parchment mb-4" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-parchment/60" />
          ))}
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="atlas-card px-5 py-5 md:px-7 md:py-6">
          <div className="h-5 w-56 rounded bg-parchment mb-4" />
          <div className="h-28 rounded-xl bg-parchment/60" />
        </div>
      ))}
    </div>
  );
}
