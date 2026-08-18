/**
 * Blog index - /blog.
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
 * It invents nothing. Every title, date and excerpt is the real thing the blog
 * library loads from content/blog. The subject of a post is the one thing the
 * frontmatter does not carry, so SUBJECT_OF_POST below assigns each slug by
 * hand; anything it does not name falls into a final bucket and is still
 * reachable, so a new post can never vanish from this page.
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
import { getAllPosts, type BlogPost } from "@/lib/blog";
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

/* THE SUBJECTS, and why they are a hand-written table rather than a pattern.
   The frontmatter carries title, date, excerpt and author and nothing else, so
   there is no tag to group on. A pattern match on the slug looks tempting and
   is wrong in both directions: `-overview` is a country read in
   `france-overview` and a sector read in `global-construction-overview`, and
   `us-small-business-overview` is a country while `global-software-deep-dive`
   is not. Every slug is therefore placed by reading what the post is, and a
   slug this table does not name lands in the fallback rather than being
   guessed at. */
/* HEADINGS ONLY, NO BLURBS, and the six that were written here were cut by
   applying the charter's own section 4 test rather than by taste: "a paragraph
   under a heading that repeats the heading goes entirely." Each of the six was
   restated either by its own heading ("One trade, worldwide" over "A sector
   across every country that publishes it") or, worse, by the rows immediately
   beneath it: "a bakery, a pharmacy, a plumber" sat directly above the bakery
   post, the pharmacy post and the plumber post. Six blurbs, 70 words, 240px at
   375 and no information. /cities' region cards carry a name and a count and
   nothing else, so this is the cohesive shape as well as the shorter one. */
const SUBJECTS = [
  { id: "countries", title: "One country at a time" },
  { id: "compared", title: "Places compared" },
  { id: "industries", title: "One trade, worldwide" },
  { id: "close-ups", title: "Inside one business" },
  { id: "reading", title: "Reading the numbers" },
  { id: "method", title: "How it was built, and what is missing" },
  /* THE FALLBACK, and it is load-bearing rather than defensive. A post added to
     content/blog tomorrow is not in the table above, and a page that silently
     omitted it would be dropping a URL to keep a number tidy. It renders only
     when it holds something, so today it does not render at all. */
  { id: "more", title: "More notes" },
] as const;

type SubjectId = (typeof SUBJECTS)[number]["id"];

const SUBJECT_OF_POST: Record<string, SubjectId> = {
  "argentina-overview": "countries",
  "australia-overview": "countries",
  "baltic-tech-rise": "countries",
  "brazil-overview": "countries",
  "canada-overview": "countries",
  "france-overview": "countries",
  "germany-mittelstand-overview": "countries",
  "greek-tourism-recovery": "countries",
  "italy-family-firms": "countries",
  "japan-overview": "countries",
  "netherlands-overview": "countries",
  "nordics-software-economy": "countries",
  "norway-overview": "countries",
  "poland-overview": "countries",
  "polish-construction-boom": "countries",
  "singapore-overview": "countries",
  "spain-overview": "countries",
  "switzerland-overview": "countries",
  "uk-overview": "countries",
  "us-margins-since-2018": "countries",
  "us-small-business-overview": "countries",

  "australian-vs-canadian-economy": "compared",
  "emerging-bric-services": "compared",
  "germany-vs-france-manufacturing": "compared",
  "italy-vs-spain-tourism": "compared",
  "japan-restaurants-density": "compared",
  "small-business-size-us-vs-germany": "compared",
  "us-vs-uk-small-business": "compared",

  "global-construction-overview": "industries",
  "global-finance-services": "industries",
  "global-hairdressers": "industries",
  "global-healthcare-economics": "industries",
  "global-manufacturing-overview": "industries",
  "global-professional-services": "industries",
  "global-real-estate": "industries",
  "global-restaurants-overview": "industries",
  "global-retail-shifts": "industries",
  "global-software-deep-dive": "industries",
  "global-transportation-logistics": "industries",

  "french-bakeries-profitability": "close-ups",
  "hairdressers-same-everywhere": "close-ups",
  "pharmacy-revenue-payroll-margin": "close-ups",
  "solo-plumbing-business": "close-ups",
  "typical-us-restaurant-earnings": "close-ups",
  "worlds-smallest-hotel-markets": "close-ups",

  "difference-between-firm-and-establishment": "reading",
  "how-medians-work": "reading",
  "how-to-benchmark-your-business": "reading",
  "how-to-read-a-cell-page": "reading",
  "industry-classification-different-meanings": "reading",
  "industry-classification-tour": "reading",
  "industry-classifications-decoded": "reading",
  "median-vs-average": "reading",
  "nace-vs-naics": "reading",
  "size-band-statistics-matter": "reading",
  "us-employer-vs-nonemployer": "reading",
  "us-state-fips-codes": "reading",
  "why-friendly-medians": "reading",

  "building-from-9-agencies": "method",
  "countries-with-worse-data": "method",
  "data-sources-tour": "method",
  "estimating-distributions-from-totals": "method",
  "hidden-economy-solo-proprietors": "method",
  "how-many-cells-do-you-have": "method",
  "how-we-built-the-taxonomy": "method",
  "reading-eurostat-sbs": "method",
  "shape-transfer-explained": "method",
  "v2-coming": "method",
  "what-we-omit": "method",
  "when-we-extrapolate": "method",
};

type SubjectGroup = {
  id: SubjectId;
  title: string;
  posts: BlogPost[];
};

/**
 * Partition the corpus into the subject cards. Every post lands in exactly one
 * group and no post is dropped: an unnamed slug goes to "more".
 *
 * WITHIN A GROUP THE ORDER IS THE LIBRARY'S OWN, newest first, and this reverses
 * an alphabetical sort written earlier in the same tick. The argument for
 * alphabetical was /cities, whose index was sorted by metro economy and read as
 * "indistinguishable from no order at all to a reader looking for Rome". That
 * precedent does not transfer, and the rendered page is what showed it: a city
 * entry is a NAME, so A-to-Z puts Rome under R, while a post entry is a
 * HEADLINE, so A-to-Z sorts on whatever word the headline opens with.
 *
 * Counted rather than eyeballed: 52 of the 70 titles begin with a generic word,
 * and the commonest openers are "Why" 8, "The" 7, "How" 6, "What" 4. Seen at
 * 1280, alphabetical filed Germany under T, for "The German Mittelstand", and
 * put three unrelated posts together under S because each opens "Small business
 * in". A reader looking for Germany was no better served than by no order, and
 * the date column beside it read 11, 12, 13, 14, 5, 13, 13, 11, 6 down the page.
 *
 * Newest first is the order getAllPosts already returns, so nothing is sorted
 * here at all and the page cannot disagree with the library. It also makes the
 * date column monotonic, which is the one scannable structure this corpus can
 * actually support: the subject card did the work of finding the right 21 posts,
 * and inside it the reader is looking at what is new.
 */
function groupPosts(posts: BlogPost[]): SubjectGroup[] {
  const byId = new Map<SubjectId, BlogPost[]>();
  for (const post of posts) {
    const id = SUBJECT_OF_POST[post.slug] ?? "more";
    const bucket = byId.get(id) ?? [];
    bucket.push(post);
    byId.set(id, bucket);
  }
  return SUBJECTS.map((s) => ({
    id: s.id,
    title: s.title,
    posts: byId.get(s.id) ?? [],
  })).filter((g) => g.posts.length > 0);
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
                    {group.posts.length} notes
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
