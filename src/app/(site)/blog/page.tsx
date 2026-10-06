/**
 * Blog index - /blog.
 *
 * SINCE 2026-10-05 THE INDEX HOLDS THE POSTS HIS RULING ON PARKED P36.1 KEPT: the two kept and the seven rewritten on the UK
 * registers (2026-10-06), grouped by the category each names. The 58 retired redirect to their country page or the nearest
 * live page (data/blog/retired_posts.json, the gate blog-retired), and three method notes moved onto About the figures
 * (data/blog/moved_posts.json), so the counts of seventy below are the page's history.
 *
 * WHAT WAS WRONG, MEASURED 2026-08-18. The page was 32,114 rendered pixels at
 * 375x812, about 40 screens, and 11,821 at 1280. It is the same shape the
 * founder rejected on /cities in his own words: "it's just a big list of cities
 * which doesn't end, and it's executed completely, completely awful way."
 * Sixty-nine post cards in one flat grid under one heading, no grouping, no
 * ranking, no end. 29,823 of those 32,114 pixels were that one grid, 92.9% of
 * the page.
 *
 * The corpus cannot be navigated by DATE, which is what the old page offered.
 * All 70 posts fall inside 27 days (2026-04-18 to 2026-05-14) and five of them
 * share 2026-05-14, so "newest first" sorts a single batch and tells a reader
 * nothing about what is here. What the corpus does have is subject, so subject
 * is what the index is now built on.
 *
 * WHAT IT IS NOW, in three moves, the same three that fixed /cities:
 *   1. A carded header, its lede cut from 62 words to 14.
 *   2. The newest post as one featured card, keeping its full 16:9 cover. One
 *      instance, so it is the page's single large visual element rather than
 *      one of seventy.
 *   3. The complete index in six subject cards, as dense rows instead of a card
 *      wall. Every one of the 70 posts keeps its link and its /blog/{slug} URL,
 *      nothing sits behind a control, and nothing needs JavaScript to reach.
 *
 * THE COVERS ARE GONE FROM THE INDEX, and that is a measurement rather than a
 * preference. BlogCover's own header records why /blog kept them when the
 * homepage rail collapsed to a 6px bar: "there the cover is the post's identity
 * in a reading index and earns its size." That argument holds for the rail's six
 * posts and breaks at seventy. The gradient is chosen by hashing the slug into a
 * SIX-entry palette, so across 70 posts each cover is worn by 7 to 14 of them:
 * 13, 13, 10, 14, 13, 7. Photographed at 375, two adjacent cards in the river
 * were the identical neutral ramp. A plate that eleven other posts also wear is
 * not identity, and at 175px tall on a 385px card it was 45% of every row.
 * The featured post keeps its cover because at one instance there is nothing to
 * collide with.
 *
 * It invents nothing. Every title, date, excerpt and category is the real thing
 * the blog library loads from content/blog; a post that names no category
 * falls into a final bucket and is still reachable, so a new post can never
 * vanish from this page.
 *
 * URL, metadata canonical, and revalidate are unchanged. Every /blog/{slug}
 * link is unchanged.
 *
 * EVERY SURFACE HERE IS POSITIONED. AtlasFrame paints the page photograph from
 * FIXED layers at z-index 0, so a static background is drawn UNDER the picture
 * and reads as a washed patch of sky. `.atlas-card` is `position: relative`
 * itself; the two bare sections carry `relative` explicitly.
 */
import Link from "next/link";
import { BLOG_CATEGORIES, getAllPosts, type BlogPost } from "@/lib/blog";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { BlogCover } from "@/components/blog/BlogCover";

export const revalidate = 86400;

export const metadata = {
  title: "Blog | Margin Atlas",
  description: "Notes and deep-dives on small-business benchmarking.",
  alternates: { canonical: "/blog" },
};

/** Long-format date for the featured card, e.g. "May 14, 2026". */
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Short date for an index row, e.g. "May 14". The year is the same on all 70
 *  posts, so printing it 70 times spends a column and says nothing. */
function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* THE INDEX BY CATEGORY (P36.1, the rewrites of 2026-10-06; BLOG.md: "The blog, with different categories of articles"). Each
   post names its category in its frontmatter (src/lib/blog.ts, held by the gate blog-content), so the hand-written table that
   placed each slug by reading it is gone, and its subjects with it (they sorted seventy posts that no longer stand). The
   categories come in BLOG.md's order, each heading the reader's question in a plain label; a post without one still lands, under
   "More notes", so a URL never drops off the page. Within a group the order is the library's own, newest first, as before. */
type SubjectGroup = {
  id: string;
  title: string;
  posts: BlogPost[];
};

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function groupPosts(posts: BlogPost[]): SubjectGroup[] {
  const groups: SubjectGroup[] = BLOG_CATEGORIES.map((c) => ({ id: c, title: capital(c), posts: posts.filter((p) => p.category === c) }));
  groups.push({ id: "more", title: "More notes", posts: posts.filter((p) => !p.category) });
  return groups.filter((g) => g.posts.length > 0);
}

/** One hero figure: the number set large, its label quiet underneath. Same
 *  shape as the /cities hero, so the two directories read as one site. */
function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl md:text-3xl font-semibold tabular-nums leading-none text-ink-900">
        {value.toLocaleString("en-US")}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-cocoa-500">
        {label}
      </div>
    </div>
  );
}

/**
 * The featured story: the newest post, given the most room and the only cover
 * on the page. A real <h2> so the outline reads featured-then-index.
 */
function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
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
    </Link>
  );
}

/**
 * One index row: the title, its date, and at lg the excerpt on a second line.
 *
 * THE EXCERPT IS WIDTH-GATED, measured rather than assumed. Printed at every
 * width it is 70 paragraphs of prose on one page, which is the "bloated with
 * text" the founder named; suppressed everywhere it costs a reader the one
 * line that says what a post argues, since a title like "Shape transfer,
 * explained" does not. At lg each of the two columns is roughly 500px and one
 * clamped line fits beside the title without a second row of height. Below lg
 * the title and date carry the row alone.
 */
function PostRow({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      /* `break-inside-avoid` so a multi-column box never splits a title from
         its date across a column boundary. */
      className="group block break-inside-avoid rounded-md px-1.5 py-2 transition-colors hover:bg-atlas-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40"
    >
      <span className="flex items-baseline gap-3">
        <span className="min-w-0 flex-1 text-sm text-ink-900 leading-snug group-hover:text-atlas-700">
          {post.title}
        </span>
        <span className="shrink-0 text-xs tabular-nums text-cocoa-500">
          {formatShortDate(post.date)}
        </span>
      </span>
      {post.excerpt ? (
        <span className="mt-0.5 hidden truncate text-xs text-cocoa-700 lg:block">
          {post.excerpt}
        </span>
      ) : null}
    </Link>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  /* THE FEATURED POST IS STILL IN THE INDEX. It leads the page as the newest
     note and it also sits under its own subject, because a reader who came for
     "One trade, worldwide" should find every one of them there. Nothing is
     shown twice by accident; this is the one deliberate repeat. */
  const groups = groupPosts(posts);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="relative text-sm text-cocoa-700/70 mb-6 pt-2">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span className="mx-2 text-cocoa-300">/</span>
        <span className="text-ink-900">Blog</span>
      </nav>

      {/* ON A CARD, like every other hero on the site. The five-line lede was
          painting straight onto the photograph and its longest line ran to
          x=940, over the cliffside town. It is now one line of 14 words: the
          old one spent 62 saying the same thing twice. */}
      <header className="atlas-card px-5 py-6 md:px-7 md:py-7">
        <SectionEyebrow size="md" className="mb-3">
          Notes from the workshop
        </SectionEyebrow>
        <h1 className="max-w-3xl font-display text-4xl md:text-5xl lg:text-[3.3rem] font-semibold tracking-tight text-ink-900 leading-[1.04]">
          Where the money is, and where the data lies
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-graphite leading-relaxed">
          What a business in a place actually keeps, and where the numbers are a
          directional guess.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
          <HeroStat value={posts.length} label="notes" />
          <HeroStat value={groups.length} label="subjects" />
        </div>
      </header>

      {featured ? (
        <section aria-labelledby="featured-heading" className="relative mt-8 md:mt-10">
          <h2 id="featured-heading" className="sr-only">
            Latest note
          </h2>
          <FeaturedPost post={featured} />
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section
          className="relative mt-10 md:mt-14"
          aria-labelledby="index-heading"
        >
          <SectionEyebrow className="mb-1.5">Every note</SectionEyebrow>
          <h2
            id="index-heading"
            className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
          >
            The index, by subject
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            {groups.map((group) => (
              <section
                key={group.id}
                className="atlas-card px-4 py-4 md:px-6 md:py-5"
              >
                <div className="flex items-baseline justify-between gap-3 border-b border-parchment pb-3">
                  <h3 className="min-w-0 font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
                    {group.title}
                  </h3>
                  <span className="shrink-0 text-xs uppercase tracking-wide text-cocoa-500 tabular-nums">
                    {group.posts.length} {group.posts.length === 1 ? "note" : "notes"}
                  </span>
                </div>
                {/* CSS COLUMNS, NOT A GRID, and the difference is what keeps
                    the ordering legible. A two-column grid flows ACROSS its
                    rows, so a newest-first list reads 1st 2nd on the first line
                    and 3rd 4th on the second, and the date column beside it
                    zigzags. Multi-column boxes flow DOWN each column and then
                    across, so the dates fall monotonically down column one and
                    then down column two, which is the structure the order is
                    for. Same reasoning /cities gives for its A-to-Z index.

                    ONE COLUMN UNTIL lg, unlike /cities, and the reason is the
                    payload rather than the width. A city entry is one short
                    name; a post title runs 40 to 66 characters, and at 375 a
                    two-column split gives each 139px, where "Lawyers,
                    accountants, consultants: professional services worldwide"
                    is nine lines. Two columns arrive at 1024, where each is
                    about 500px and a title is one or two lines. Measured: 0 of
                    70 titles clip at 375, 768 or 1280. */}
                <div className="mt-2 lg:columns-2 lg:gap-x-8">
                  {group.posts.map((p) => (
                    <PostRow key={p.slug} post={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {posts.length === 0 ? (
        <p className="relative mt-12 text-sm text-cocoa-700/70">
          No notes yet. They land here as they are written.
        </p>
      ) : null}
    </div>
  );
}
