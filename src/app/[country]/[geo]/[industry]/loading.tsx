/**
 * Loading skeleton for cell pages.
 *
 * Mirrors the rough section heights of the real page so the layout
 * doesn't jump when content arrives.
 *
 * `relative` on the root, 2026-08-17: AtlasFrame paints from fixed layers at
 * z-index 0, which go above every in-flow non-positioned descendant, so this
 * whole skeleton was covered by the frame's opaque base and the page flashed as
 * a bare photograph. One positioned ancestor puts the column back in front.
 */
export default function CellLoading() {
  return (
    <div className="relative animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-64 bg-ink-200/60 rounded mb-4" />

      {/* Switcher bar */}
      <div className="h-11 w-full bg-ink-200/50 rounded mb-6" />

      {/* Hero */}
      <div className="py-8">
        <div className="h-3 w-40 bg-ink-200/60 rounded mb-3" />
        <div className="h-12 w-3/4 bg-ink-200/60 rounded mb-3" />
        <div className="h-12 w-2/3 bg-ink-200/60 rounded mb-4" />
        <div className="h-5 w-full max-w-2xl bg-ink-200/60 rounded mb-2" />
        <div className="h-5 w-3/4 max-w-2xl bg-ink-200/60 rounded" />
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="h-3 w-24 bg-ink-200/60 rounded mb-3" />
            <div className="h-7 w-20 bg-ink-200/60 rounded" />
          </div>
        ))}
      </div>

      {/* Typical-firm */}
      <div className="py-6">
        <div className="card">
          <div className="h-3 w-32 bg-ink-200/60 rounded mb-4" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-28 bg-ink-200/60 rounded mb-2" />
                <div className="h-5 w-20 bg-ink-200/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="py-6 grid lg:grid-cols-2 gap-4">
        <div className="card h-52" />
        <div className="card h-52" />
      </div>

      {/* Time series */}
      <div className="py-6 grid md:grid-cols-2 gap-4">
        <div className="card h-44" />
        <div className="card h-44" />
      </div>
    </div>
  );
}
