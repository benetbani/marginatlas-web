"use client";
/**
 * Conveyor (WI-6) , the click-conveyor that replaces every horizontal-scroll
 * carousel. A fixed-width viewport (overflow-hidden, NEVER overflow-x-auto) holds a
 * track translateX-ed ONE PAGE at a time. A page = the whole cards that fit the
 * measured viewport (ResizeObserver). Prev/next chevrons, page dots or N / M counter,
 * pointer-drag commits to a page past a threshold, keyboard arrows. No scroll axis,
 * so no horizontal scrollbar exists anywhere. Obeys the bans (hairline border, pill
 * hover vocab, terracotta only on the active dot; no edge stripes, no gradients).
 */
import * as React from "react";

export function Conveyor({
  children,
  ariaLabel,
  itemMinPx = 188,
  gapPx = 12,
  wrap = false,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  itemMinPx?: number;
  gapPx?: number;
  wrap?: boolean;
}) {
  const items = React.Children.toArray(children);
  const n = items.length;

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [vw, setVw] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [drag, setDrag] = React.useState<{ startX: number; dx: number } | null>(null);

  // Measure the viewport; mobile peek means ~1.15 cards show below 640px.
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setVw(e.contentRect.width);
    });
    ro.observe(el);
    setVw(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const isMobile = vw > 0 && vw < 640;
  // card width: mobile = ~84% of viewport (peek); desktop = itemMinPx (cards keep their look).
  const cardW = isMobile ? Math.max(120, Math.round(vw * 0.84)) : itemMinPx;
  const stride = cardW + gapPx;
  // how many whole cards fit per page (>=1)
  const perPage = isMobile ? 1 : Math.max(1, Math.floor((vw + gapPx) / stride));
  const pageCount = Math.max(1, Math.ceil(n / perPage));

  React.useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [pageCount, page]);

  const pageWidth = perPage * stride; // distance to shift per page
  const baseOffset = -page * pageWidth;
  const dragOffset = drag ? drag.dx : 0;
  const trackX = baseOffset + dragOffset;

  const go = React.useCallback(
    (dir: number) => {
      setPage((p) => {
        let next = p + dir;
        if (wrap) next = (next + pageCount) % pageCount;
        else next = Math.max(0, Math.min(pageCount - 1, next));
        return next;
      });
    },
    [pageCount, wrap],
  );

  const atStart = !wrap && page === 0;
  const atEnd = !wrap && page === pageCount - 1;

  // pointer-drag: paged, commit past a 40px threshold, else spring back.
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setDrag({ startX: e.clientX, dx: 0 });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setDrag({ startX: drag.startX, dx: e.clientX - drag.startX });
  };
  const endDrag = () => {
    if (!drag) return;
    const THRESH = 40;
    if (drag.dx <= -THRESH) go(1);
    else if (drag.dx >= THRESH) go(-1);
    setDrag(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  const chevBtn =
    "hov inline-flex items-center justify-center rounded-full border border-[var(--c-border)] bg-[var(--c-card)] text-[var(--c-ink2)] hover:border-[var(--terra-border)] hover:text-[var(--terra-text)] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[var(--c-border)] disabled:hover:text-[var(--c-ink2)]";

  return (
    <div role="group" aria-label={ariaLabel} tabIndex={0} onKeyDown={onKeyDown} className="outline-none">
      <div
        ref={viewportRef}
        className="overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="flex"
          style={{
            gap: gapPx,
            transform: `translateX(${trackX}px)`,
            transition: drag ? "none" : "transform .32s cubic-bezier(.22,.61,.36,1)",
          }}
        >
          {items.map((child, i) => (
            <div key={i} style={{ width: cardW, flex: "0 0 auto" }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Previous"
            disabled={atStart}
            onClick={() => go(-1)}
            className={`${chevBtn} h-10 w-10 sm:h-8 sm:w-8`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          {pageCount <= 7 ? (
            <div className="flex items-center gap-1.5" role="tablist" aria-label="pages">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === page}
                  onClick={() => setPage(i)}
                  className="inline-flex h-11 w-5 items-center justify-center"
                >
                  <span
                    className="block rounded-full transition-all"
                    style={{
                      width: i === page ? 18 : 7,
                      height: 7,
                      background: i === page ? "var(--terra)" : "var(--c-line-strong)",
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <span className="fig text-[12px] text-[var(--c-muted)]">{page + 1} / {pageCount}</span>
          )}

          <button
            type="button"
            aria-label="Next"
            disabled={atEnd}
            onClick={() => go(1)}
            className={`${chevBtn} h-10 w-10 sm:h-8 sm:w-8`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
