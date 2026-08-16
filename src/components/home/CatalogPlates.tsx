/**
 * CatalogPlates , the home page catalog. Four collections, four plates.
 *
 * RATIFIED 2026-08-09, option A of /dev/options/catalog.
 *
 * His brief: "we should have some catalog concepts, high business climate and
 * low cost countries / booming cities / declining neighbourhoods of the most
 * famous cities of the world / high margin industries." And the constraint that
 * is the whole design problem: "but this catalog concept should not be slammed
 * like a list of elements."
 *
 * A PLATE IS NOT A MAP, and that matters because I argued against this option on
 * the grounds that trades have no geography. Wrong: the plate is an abstract
 * FIELD, one mark per measured entity, and the qualifying set picked out in
 * terracotta. Trades scatter as readily as countries. The objection was against
 * a version nobody drew.
 *
 * WHY IT ANSWERS THE LARGER COMPLAINT, "it doesn't show the vision of the site,
 * what it represents, its long term vision". A list of five country names says
 * the site knows five countries. A field of 194 marks with 39 lit says the site
 * measured 194 and formed a judgement about 39. **A page that lists what the
 * site contains is a directory. A page that shows what it can see is an atlas.**
 * That is carried by the drawing rather than by a sentence claiming it.
 *
 * THE SCATTER IS DETERMINISTIC. No Math.random: this renders on the server and
 * a random layout would differ between the server and the client, which React
 * reports as a hydration mismatch. A fixed irrational-ish step gives an even,
 * non-gridded field that is identical on every render.
 *
 * TAILWIND CLASSES, NOT SPINE TOKENS. The first version painted with --terra
 * and --n5. Those live in atlas-spine.css and the home page is not a spine
 * surface, so they would have resolved to nothing and the fallback hex would
 * have been the actual colour. The hardcoded-hex gate caught the fallbacks,
 * which is how the wrong-vocabulary mistake surfaced at all.
 *
 * A collection with nothing measured renders as a GAP, faded and labelled, never
 * as an empty plate pretending to be full. Districts have no decline metric yet.
 */
import { getCatalogCollections, type CatalogCollection } from "@/lib/home/catalog";

const COLLECTIONS = getCatalogCollections();

/** Plate geometry. The viewBox is unitless; the container decides real size. */
const W = 220;
const H = 104;
const PAD = 7;
/** Cap the marks drawn. Past this a field reads as texture and the count is
 *  carried by the figure beside it, not by counting dots. */
const MAX_MARKS = 260;

/**
 * An even, non-gridded scatter that is identical on every render.
 * Two coprime-ish steps walk the box without ever repeating a lattice.
 */
function markAt(i: number, n: number): { x: number; y: number } {
  const gx = (i * 0.6180339887) % 1;
  const gy = (i * 0.7548776662) % 1;
  return {
    x: PAD + gx * (W - PAD * 2),
    y: PAD + gy * (H - PAD * 2),
  };
}

function Plate({ c }: { c: CatalogCollection }) {
  const held = c.measured > 0;
  const n = Math.min(c.measured, MAX_MARKS);
  /* Which marks are lit, spread evenly through the field rather than clustered,
     so the eye reads a proportion instead of a corner. */
  const litEvery = c.qualifying > 0 ? Math.max(1, Math.round(n / c.qualifying)) : 0;

  return (
    <a
      href={c.href}
      className="group block no-underline"
      aria-label={`${c.title}. ${c.claim}. ${held ? `${c.qualifying} of ${c.measured} ${c.unit}` : "not held yet"}.`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-hidden="true"
        style={{ opacity: held ? 1 : 0.4 }}
      >
        <rect x="0" y="0" width={W} height={H} rx="3" className="fill-cream-300" />
        {held
          ? Array.from({ length: n }, (_, i) => {
              const { x, y } = markAt(i, n);
              const lit = litEvery > 0 && i % litEvery === 0;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={lit ? 2.6 : 1.4}
                  className={lit ? "fill-atlas-500" : "fill-cocoa-300"}
                  opacity={lit ? 1 : 0.75}
                />
              );
            })
          : /* The honest empty state: the field drawn, nothing lit. It shows the
               shape the collection WILL take without asserting a member. */
            Array.from({ length: 60 }, (_, i) => {
              const { x, y } = markAt(i, 60);
              return <circle key={i} cx={x} cy={y} r={1.4} className="fill-cocoa-300" opacity={0.5} />;
            })}
      </svg>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold text-ink-900 group-hover:text-atlas-600 transition-colors">
          {c.title}
        </span>
        <span className="tabular-nums text-[12.5px] text-cocoa-700 shrink-0">
          {held ? `${c.qualifying} of ${c.measured}` : "not held yet"}
        </span>
      </div>
      <p className="mt-1 text-[13px] leading-snug text-graphite">{c.claim}</p>
      {c.members.length > 0 ? (
        <p className="mt-1 text-[12.5px] text-cocoa-700">{c.members.slice(0, 3).join(", ")}</p>
      ) : null}
    </a>
  );
}

export function CatalogPlates() {
  return (
    <section aria-labelledby="catalog-heading" className="py-10 md:py-14">
      <h2 id="catalog-heading" className="text-2xl md:text-3xl font-display text-ink-900">
        What the atlas can see
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-graphite">
        Every mark is a place or a trade we hold a figure for. The lit ones are
        where the figures say something worth acting on.
      </p>
      {/* THE PLATES SIT ON A CARD NOW. The site frame's centre dropped from
          .82 to .35 so the photograph reads through the middle, per the
          founder's correction that the centre "is also visible, but with some
          level of opacity... like we use the style of those cards". These
          plates are drawn in faint marks on no ground at all, so they were the
          band most at risk of dissolving into the picture behind them. */}
      <div className="mt-8 rounded-xl border border-parchment bg-white px-5 py-6 md:px-8 md:py-8">
        <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
          {COLLECTIONS.map((c) => (
            <Plate key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
