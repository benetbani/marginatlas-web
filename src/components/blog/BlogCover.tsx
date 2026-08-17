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
  return (
    <div
      className={`w-full ${ratio} flex items-center justify-center`}
      style={{ background: image.gradient }}
      aria-hidden="true"
    >
      <span
        className={`font-display font-semibold text-white/85 ${
          tall ? "text-6xl md:text-7xl" : "text-5xl"
        }`}
      >
        {image.initial}
      </span>
    </div>
  );
}
