/**
 * BlogCover - the cover for a post card. Real image when the post carries one,
 * otherwise the deterministic gradient the blog library derives from the slug.
 *
 * WHY IT LIVES HERE NOW. It was a private function inside
 * src/app/(site)/blog/page.tsx, so the homepage rail could not reach it and
 * rendered its six cards with no cover at all: a date, a title and a paragraph.
 * That is one page type solving a problem the other has already solved, which
 * is the cohesion test in the charter's section 7, and it also quietly broke a
 * standing rule. src/lib/blog.ts states it on the type itself: "Cover image.
 * Required by site convention (founder 2026-05-26)." The homepage was building
 * a cover for every fallback post through placeholderImage() and then throwing
 * it away.
 *
 * `tall` gives the featured story on /blog a wider frame than the river rows.
 * Both callers pass the same BlogImage, so a post looks like itself wherever it
 * appears.
 *
 * Presentational server component, tokens only. The gradient arrives as a value
 * on the image object rather than a class because it is derived per slug in the
 * library; there is no raw colour written here.
 */
import type { BlogImage } from "@/lib/blog";

export function BlogCover({ image, tall }: { image: BlogImage; tall?: boolean }) {
  const ratio = tall ? "aspect-[16/9] md:aspect-[2/1]" : "aspect-[16/9]";
  if (image.kind === "url") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        className={`w-full ${ratio} object-cover`}
        loading="lazy"
      />
    );
  }
  /* THE GIANT INITIAL IS GONE, and this codebase had already learned why.
     NeighborhoodCover's header records the identical failure, in its own words:
     "The earlier version drew a single giant faint initial bottom-right; a row
     of those read as spaced giant letters and looked like a broken
     placeholder." That lesson was applied to neighbourhood covers in June and
     never reached here, which is the charter's section 7 in miniature: two
     surfaces solving one problem, one of them already solved it.

     Seen on the rendered page, it was worse than merely plain. The letter is
     the first character of the SLUG, so it carries no meaning a reader could
     use, and it collides: "us-small-business-overview" and "uk-overview" both
     print a giant U, side by side on the homepage rail. Two identical letters
     on adjacent cards is the tell that it is an artifact and not a monogram.
     On the featured card it renders at text-7xl, where a single letter on a
     dark panel reads as a missing image rather than a design.

     What remains is the deterministic gradient, which is doing real work: six
     distinct on-brand covers, stable per post, terracotta-led since the palette
     fix earlier today. No texture or mark is layered back on. The site's
     rosette is dark ink at 5% opacity, built for light grounds, and would be
     invisible on these; inventing a second decorative language for one panel is
     how the icon vocabulary sprawled last time. */
  return (
    <div
      className={`w-full ${ratio}`}
      style={{ background: image.gradient }}
      aria-hidden="true"
    />
  );
}
