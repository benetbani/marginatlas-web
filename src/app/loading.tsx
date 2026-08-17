/**
 * Root loading skeleton (Track BB.7).
 *
 * Renders while a route segment is still streaming. Shape mirrors the
 * typical page chrome so the perceived layout shift is minimal.
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
