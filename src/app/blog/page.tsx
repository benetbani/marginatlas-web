/**
 * Blog index - /blog.
 *
 * Reformation (bible Section 13, content strategy, and Section 25, the house
 * voice: blunt, practical, skeptical of easy money, slightly witty, never
 * corporate fluff). The page used to open with a one-line header and drop every
 * post into a flat two-column card grid, newest somewhere in the pile. It now
 * opens with a blunt read of what these notes are for, finding where the money
 * actually is and admitting where the data is thin, then leads the eye with the
 * newest post as a featured story and runs the rest as a warm editorial river.
 *
 * It invents nothing. Every post, title, date, and excerpt is the real thing
 * the blog library loads from content/blog; the featured slot is simply the
 * newest post (the library already sorts newest-first). A run with no posts
 * degrades to a quiet line, not an apology.
 *
 * URL, metadata, and revalidate are preserved. Every /blog/{slug} link is
 * unchanged.
 */
import { getAllPosts, type BlogPost, type BlogImage } from "@/lib/blog";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata = {
  title: "Blog | Margin Atlas",
  description: "Notes and deep-dives on small-business benchmarking.",
};

/** Long-format date for a post, e.g. "May 14, 2026". */
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * The post cover. Real image when the post carries one, otherwise the
 * deterministic gradient placeholder the library derives from the slug. The
 * `tall` flag gives the featured story a larger frame than the river rows.
 */
function BlogCover({ image, tall }: { image: BlogImage; tall?: boolean }) {
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

/**
 * The featured story: the newest post, given the most room. A real <h2> so the
 * page outline reads featured-then-list, not one undifferentiated grid.
 */
function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="atlas-card group block overflow-hidden md:grid md:grid-cols-2 md:items-stretch"
    >
      <BlogCover image={post.image} tall />
      <div className="flex flex-col justify-center p-6 md:p-8">
        <div className="text-xs uppercase tracking-[0.16em] text-cocoa-500">
          Latest
          <span className="mx-2 text-cocoa-300" aria-hidden>
            /
          </span>
          <span className="tabular-nums normal-case tracking-normal">
            {formatDate(post.date)}
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight group-hover:text-atlas-700 transition-colors">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="mt-3 text-base text-graphite leading-relaxed">
            {post.excerpt}
          </p>
        ) : null}
        <span className="mt-5 text-sm font-medium text-atlas-700">
          Read the note
        </span>
      </div>
    </a>
  );
}

/**
 * One post in the river: cover, date, title, excerpt. A real <h3> so the list
 * sits one level under the featured <h2>.
 */
function PostCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="atlas-card group flex flex-col overflow-hidden"
    >
      <BlogCover image={post.image} />
      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs text-cocoa-500 tabular-nums">
          {formatDate(post.date)}
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink-900 leading-snug group-hover:text-atlas-700 transition-colors">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-2 text-sm text-graphite leading-relaxed">
            {post.excerpt}
          </p>
        ) : null}
        <span className="mt-4 text-sm font-medium text-atlas-700">Read</span>
      </div>
    </a>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-cocoa-700/70 mb-6 pt-2">
        <a href="/" className="hover:text-atlas-700">
          Home
        </a>
        <span className="mx-2 text-cocoa-300">/</span>
        <span className="text-ink-900">Blog</span>
      </nav>

      <header className="max-w-3xl">
        <SectionEyebrow size="md" className="mb-3">
          Notes from the workshop
        </SectionEyebrow>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.3rem] font-semibold tracking-tight text-ink-900 leading-[1.04]">
          Where the money is, and where the data lies
        </h1>
        <p className="mt-5 text-lg md:text-xl text-graphite leading-relaxed">
          The working notes behind the atlas.{" "}
          <span className="text-ink-900">
            What a typical small business in a place actually keeps after rent,
            wages, and tax. Why two firms with the same revenue end up nothing
            alike. And the honest part: where the numbers are solid, and where
            they are a directional guess we would not bet the lease on.
          </span>{" "}
          No easy money, no league tables of dream businesses. Just the read,
          and what can kill it.
        </p>
      </header>

      {featured ? (
        <section aria-labelledby="featured-heading" className="mt-12 md:mt-16">
          <h2 id="featured-heading" className="sr-only">
            Latest note
          </h2>
          <FeaturedPost post={featured} />
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section aria-labelledby="more-heading" className="mt-14 md:mt-20">
          <div className="border-t border-parchment pt-8">
            <h2
              id="more-heading"
              className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
            >
              More from the notebook
            </h2>
            <p className="mt-3 max-w-2xl text-base text-graphite leading-relaxed">
              Country reads, method explainers, and the occasional argument
              about what a number is even worth. Newest first.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}

      {posts.length === 0 ? (
        <p className="mt-12 text-sm text-cocoa-700/70">
          No notes yet. They land here as they are written.
        </p>
      ) : null}
    </div>
  );
}
