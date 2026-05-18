/**
 * Country-page loading skeleton (BB.7).
 */
export default function CountryLoading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="h-4 w-32 bg-cream-200 rounded mb-4" />
      <div className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:items-center">
        <div>
          <div className="h-3 w-24 bg-cream-200 rounded mb-3" />
          <div className="h-14 w-3/4 bg-cream-200 rounded mb-4" />
          <div className="h-5 w-2/3 max-w-xl bg-cream-100 rounded mb-2" />
          <div className="h-5 w-1/2 max-w-md bg-cream-100 rounded" />
        </div>
        <div className="hidden lg:block">
          <div className="h-48 rounded-2xl bg-cream-100 border border-parchment" />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-cream-100 border border-parchment"
          />
        ))}
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-cream-100 border border-parchment"
          />
        ))}
      </div>
    </div>
  );
}
