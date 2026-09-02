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
 *
 * DENSITY PASS 2026-08-17. Rendered and counted: 116 words, of which 25 were a
 * lede reading "Every mark is a place or a trade we hold a figure for. The lit
 * ones are where the figures say something worth acting on." That is a legend
 * written as a sentence, and a legend is the thing a plate should have. It is
 * now two dots and two words beside the heading, which is how a chart labels
 * its own marks, and the 25 words are gone.
 *
 * WHAT WENT IN: one AtlasIcon per collection, from the existing manifest, and
 * the qualifying count set as a figure rather than as small grey text. The
 * heading dropped from 2xl/3xl to lg/xl for the same reason as the other bands
 * in this pass, small heading over large content.
 *
 * SECOND DENSITY PASS, same day, and it reversed a call made in the first.
 * That pass kept the four `claim` sentences and wrote down why: "Without them
 * 'Cheap to run, light to tax, 39 of 194' is a boast with no test attached, and
 * this site's whole position is that a claim carries its test." The principle
 * is right and the conclusion was wrong, because the claim is not the test.
 * Read them beside their own titles:
 *
 *   "Cheap to run, light to tax"   / "Below the world median on what the state
 *                                     takes and on what staff cost"
 *   "Growing fastest"              / "Where customers are arriving quicker than
 *                                     anywhere else"
 *   "What the trade itself keeps"  / "Trades whose margin survives before a
 *                                     single decision about place"
 *
 * Every one is its own title said again at length, which is the exact thing
 * this pass exists to cut. The TEST is the other field the collection already
 * carries, `rule`: "tax below 33.9% and labour cost below $11,500". It is
 * shorter, it is falsifiable, and it puts two figures on the page where there
 * were none. So the claims did not survive on the strength of the argument that
 * defended them; the rules did, and the rules are what the argument was
 * actually about. 43 prose words became 19, and the page gained two numbers.
 *
 * THE SENTENCES ARE NOT LOST FROM THE SITE. Every plate links to /extremes, and
 * src/components/extremes/CatalogCollections.tsx already prints `c.claim` as
 * the lede and `c.rule` beneath it. A reader who wants the collection defined
 * in words is standing on the page that defines it. Same disposal as the
 * `dont_miss` prose that left NeighborhoodCards in the first pass: the index
 * carries the test, the destination carries the sentence.
 *
 * THE FIGURES INSIDE THE RULE ARE SET AS FIGURES, in ink against the graphite
 * of the words around them, so "under 33.9%" reads as a threshold rather than
 * as more prose. By colour and by the number face, never by weight.
 *
 * AND THE MEMBERS ARE NAMED. This band printed "TL, SD, VU" as the concrete
 * examples of the countries that qualify. See displayMembers in
 * src/lib/home/catalog.ts.
 *
 * WHAT WAS MEASURED AND LEFT ALONE: the three members per plate. They are 13
 * words of pure inventory, which is the thing the founder's note asks for more
 * of, not less.
 */
import { getCatalogCollections, displayMembers, type CatalogCollection } from "@/lib/home/catalog";
import { AtlasIcon } from "@/components/brand/icons";
import type { AtlasIconId } from "@/components/brand/icons";
import { DotsSet } from "@/components/spine/kit";

const COLLECTIONS = getCatalogCollections();

/**
 * One mark per collection, from the existing icon manifest. Keyed by the
 * collection id rather than by position, so reordering the collections cannot
 * silently reassign the glyphs. An id with no entry falls back to the generic
 * benchmark mark rather than rendering a hole.
 */
const COLLECTION_MARKS: Record<string, AtlasIconId> = {
  "cheap-and-light": "taxes",
  growing: "trend",
  declining: "vacancy",
  "high-margin": "margin",
};

/** Plate geometry. The viewBox is unitless; the container decides real size. */
const W = 220;
const H = 104;
const PAD = 7;
/** Cap the marks drawn. Past this a field reads as texture and the count is
 *  carried by the figure beside it, not by counting dots. */
const MAX_MARKS = 260;

/**
 * WHICH MARKS ARE LIT, AND WHY IT IS NOT `i % k`.
 *
 * It was `litEvery = round(n / qualifying)` and `i % litEvery === 0`, whose own
 * comment claimed the lit marks were "spread evenly through the field rather
 * than clustered, so the eye reads a proportion instead of a corner". The
 * photograph said otherwise and the arithmetic explains it. Lighting every k-th
 * mark of a golden-ratio walk moves each lit mark by a CONSTANT step,
 * `frac(k * 0.618)` across and `frac(k * 0.755)` down, so the lit set is a
 * straight line whenever that step is small. Measured on the shipped values:
 *
 *   countries  k=5   step (0.090, 0.774)   pairs
 *   cities     k=10  step (0.180, 0.549)   spread
 *   trades     k=8   step (0.944, 0.039)   a step of (-0.056, +0.039)
 *
 * The trades plate drew THREE long diagonal stripes, and 27 of its 30 lit marks
 * sat within 25 viewBox units of the one before it. A reader looking at that
 * sees three groups of high-margin trades. There are no groups. The drawing was
 * asserting a structure the data does not hold, which is the same fault class as
 * a smoothed curve between two known points.
 *
 * AND IT DREW ONE MARK TOO MANY. `ceil(243 / 8)` is 31, so the trades plate lit
 * 31 marks while the figure beside it read "30 of 243". The picture and the
 * number disagreed by one on the most-read surface on the site.
 *
 * BOTH ARE FIXED BY STRATIFYING INSTEAD OF STRIDING. The field is cut into
 * exactly `qualifying` equal stretches and ONE mark is lit in each, so the count
 * is exact by construction and the spread is even by construction. Which mark
 * inside a stretch comes from an integer hash of the stretch's own number, so
 * the step from one lit mark to the next is never constant and no line can form.
 * Integers only, no `Math.random`: this renders on the server and a layout that
 * differed on the client is a hydration mismatch.
 */
function litIndices(n: number, qualifying: number): Set<number> {
  const out = new Set<number>();
  if (n <= 0 || qualifying <= 0) return out;
  const q = Math.min(qualifying, n);
  for (let j = 0; j < q; j++) {
    const lo = Math.floor((j * n) / q);
    const hi = Math.max(lo + 1, Math.floor(((j + 1) * n) / q));
    let h = Math.imul(j + 1, 2654435761) >>> 0;
    h ^= h >>> 15;
    h = Math.imul(h, 2246822519) >>> 0;
    h ^= h >>> 13;
    out.add(lo + (h % (hi - lo)));
  }
  return out;
}

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

/**
 * The membership rule, with its figures set as figures.
 *
 * Splits on a numeric token and returns alternating plain and numeric parts, so
 * "tax below 33.9% and labour cost below $11,500" arrives as four pieces and the
 * two thresholds can carry the number face and the ink colour while the words
 * stay graphite. A rule with no digits ("top tenth of net margin") comes back as
 * one plain piece and renders exactly as it reads today.
 *
 * NOT BOLD. The rulebook bans weight as an emphasis device here, and it would be
 * the wrong tool anyway: the point is that a threshold is a number, which colour
 * and a tabular face say better than heaviness does.
 *
 * The split is read by INDEX PARITY, not by re-testing each piece. String.split
 * with one capture group interleaves the captures at the odd positions, so odd
 * IS the figure, by construction. Re-testing would have meant calling .test on a
 * /g regex, which carries lastIndex between calls and therefore answers a
 * different question every other time it is asked.
 */
const FIGURE = /(\$?\d[\d,]*(?:\.\d+)?%?)/g;

function Rule({ text }: { text: string }) {
  const parts = text.split(FIGURE);
  return (
    <p className="mt-1 text-[14px] leading-snug text-graphite">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="tabular-nums text-ink-900">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

function Plate({ c }: { c: CatalogCollection }) {
  const held = c.measured > 0;
  const members = displayMembers(c);
  const n = Math.min(c.measured, MAX_MARKS);
  /* The field is capped at MAX_MARKS, so the LIT count is scaled with it or the
     drawn share would over-state the collection. A no-op on today's data, where
     194, 252 and 243 all sit under the cap and this is exactly `c.qualifying`;
     it is the guard for the day a collection passes it. */
  const q = held ? Math.round((c.qualifying * n) / c.measured) : 0;
  const lit = litIndices(n, q);

  return (
    <a
      href={c.href}
      className="group block no-underline"
      aria-label={`${c.title}. ${held ? `${c.qualifying} of ${c.measured} ${c.unit}, ${c.rule}` : "not held yet"}.`}
    >
      {/* AN UNHELD COLLECTION KEEPS ITS FRAME AND DRAWS NOTHING IN IT.
          It used to draw SIXTY marks, "the field drawn, nothing lit", to show
          the shape the collection will take. That is a fabricated figure: this
          collection's `measured` is 0, so sixty marks assert sixty measured
          districts on the most-read surface on the site, and the repo's rule is
          to return nothing rather than a placeholder when a figure is absent.
          An empty frame says the same thing truthfully, and says it better: the
          reader sees the atlas's own hole at the size of the thing that will
          fill it.
          THE FRAME STAYS RATHER THAN THE PANEL COLLAPSING, and that was measured
          rather than argued. Dropping the field made the cell 29px of content in
          a 304px grid row, a 459 by 275 empty rectangle at 1280, which is step
          7's own test failed and the largest void on the page. Four panels of a
          small multiple are equal panels; one that shrinks is a hole in the
          grid, wherever it is ordered. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-hidden="true"
        style={{ opacity: held ? 1 : 0.4 }}
      >
        <rect x="0" y="0" width={W} height={H} rx="3" className="fill-parchment" />
        {Array.from({ length: n }, (_, i) => {
          const { x, y } = markAt(i, n);
          const on = lit.has(i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={on ? 2.6 : 1.4}
              className={on ? "fill-atlas-500" : "fill-cocoa-300"}
              opacity={on ? 1 : 0.75}
            />
          );
        })}
      </svg>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="flex items-baseline gap-2 min-w-0">
          <AtlasIcon
            id={COLLECTION_MARKS[c.id] ?? "benchmark"}
            size={16}
            className="shrink-0 translate-y-px text-atlas-700"
          />
          <span className="text-[16px] font-semibold text-ink-900 group-hover:text-atlas-600 transition-colors">
            {c.title}
          </span>
        </span>
        {/* The count set as a figure, not as grey mouse-type. The qualifying
            half is the answer, so it carries the accent and the size; the
            measured half is the denominator and stays quiet. */}
        {/* ON THE LADDER, 2026-09-02. This row carried 15, 17 and 12.5px, none
            of them a rung, and the panel therefore spoke three sizes no other
            card on the site uses. They are the lead, head and micro rungs now:
            20 over 16 is 1.25x inside the label row, and the panel's first
            object is still the field above it. */}
        <span className="shrink-0 tabular-nums text-[12px] text-cocoa-700">
          {held ? (
            <>
              <span className="font-display text-[20px] text-atlas-700">{c.qualifying}</span>
              {` of ${c.measured}`}
            </>
          ) : (
            "not held yet"
          )}
        </span>
      </div>
      {/* The rule, only when there is a measured set for it to be a rule ABOUT.
          An unheld collection's rule reads "no decline metric is held yet",
          which the count beside the title has already said in the same three
          words, so printing it would restate a restatement. */}
      {held ? <Rule text={c.rule} /> : null}
      {members.length > 0 ? (
        <p className="mt-1 text-[12px] text-cocoa-700">{members.join(", ")}</p>
      ) : null}
    </a>
  );
}

/** The plate's own key, in place of the sentence that used to explain it. */
function Legend() {
  return (
    <span className="flex items-center gap-4 text-[12px] text-cocoa-700">
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden className="h-2 w-2 rounded-full bg-atlas-500" />
        qualifying
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cocoa-300" />
        measured
      </span>
    </span>
  );
}

export function CatalogPlates() {
  return (
    <section aria-labelledby="catalog-heading">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <h2 id="catalog-heading" className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900">
          What the atlas can see
        </h2>
        <Legend />
      </div>
      {/* THE PLATES SIT ON A CARD NOW. The site frame's centre dropped from
          .82 to .35 so the photograph reads through the middle, per the
          founder's correction that the centre "is also visible, but with some
          level of opacity... like we use the style of those cards". These
          plates are drawn in faint marks on no ground at all, so they were the
          band most at risk of dissolving into the picture behind them. */}
      {/* AND IT IS NOW THE CANONICAL CARD. It was `relative rounded-xl border
          border-parchment bg-white`, .atlas-card written out by hand: a flat
          opaque white at a 12px radius with no seating shadow, where the token
          surface is rgba(255,255,255,.955) at --radius with --atlas-elev-1.
          The translucency is the whole point once the frame stops painting a
          centre plate, since an opaque white is a hole punched in the
          photograph rather than a sheet laid on it.

          `position: relative` was carried by hand here for a good reason,
          written out at length in the commit that added it: AtlasFrame paints
          the photograph from position:fixed layers at z-index 0, so a
          position:static card with a background paints in an earlier phase and
          lands UNDER the picture. .atlas-card sets position: relative itself,
          so that requirement now travels with the class instead of depending on
          the next person reading a comment. */}
      {/* THE FOUR FIELDS ARE ONE DRAWING AND THEY DECLARE ONCE.
          Every plate draws a count of identical marks with no continuous scale,
          which is the budget's own words for I5, and four of them sat inside
          ONE `.atlas-card`. Declared per plate that is four of one idea in one
          bordered box, past the form-variety gate's per-card threshold of three
          and past I5's own page cap of three, and the honest way to pass a cap
          is never to declare a different idea than the one you drew.

          A READER WOULD CALL THIS ONE OBJECT, which is the test the loop has now
          applied five times (SpectraTable, KV, the legal-form pip column, Dots,
          and this). The tell is in the picture rather than in the markup: ONE
          legend at the top right labels all four fields, so they share an
          encoding, and four panels sharing one legend and one encoding are a
          small multiple, not four charts. They stay four panels rather than
          becoming one shared scale on purpose: a mark means a country in one and
          a trade in another, and putting incomparable units on one axis would
          invite the cross-geography ranking rule 10 forbids.

          `DotsSet` is the kit's own wrapper, built one run ago for exactly this
          row. It sets no type, no size, no colour and no spacing, so it moves
          nothing here, and it means home declares a set in the same word the
          spine does. */}
      <div className="atlas-card mt-5 px-5 py-6 md:px-8 md:py-8">
        <DotsSet className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
          {COLLECTIONS.map((c) => (
            <Plate key={c.id} c={c} />
          ))}
        </DotsSet>
      </div>
    </section>
  );
}
