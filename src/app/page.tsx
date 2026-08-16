import { NavigatorForm } from "@/components/NavigatorForm";
import { WorldMapSection } from "@/components/home/WorldMapSection";
import { AtlasLedger } from "@/components/home/AtlasLedger";
import { CatalogPlates } from "@/components/home/CatalogPlates";
import { ExampleTiles } from "@/components/home/ExampleTiles";
import { Specimen } from "@/components/home/Specimen";
import { loadSpecimen } from "@/lib/home/specimen";
import { loadExampleTiles } from "@/lib/home/example_tiles";
import { StateComparison } from "@/components/home/StateComparison";
import { loadStateComparisons } from "@/lib/home/state_comparison";
import { AudienceBand } from "@/components/home/AudienceBand";
import { UpgradeTeaser } from "@/components/home/UpgradeTeaser";
import { HomeNewsletter } from "@/components/home/HomeNewsletter";
import { WebSite } from "@/components/StructuredData";
import { getToneClass } from "@/lib/page-layout/section-order";
import { getAllPosts, type BlogPost } from "@/lib/blog";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { NeighborhoodCards } from "@/components/home/NeighborhoodCards";
import { loadNeighborhoodCards } from "@/lib/home/neighborhood_cards";
// Wave 2 Task 7 , the rebuilt-homepage gate (NEXT_PUBLIC_HOME_REFORM, default OFF).
// Mirrors src/components/home/home2-view.tsx, which holds the rebuilt body.
import { isHomeReformEnabled } from "@/lib/feature_flags";
import { SiteChrome } from "@/components/SiteChrome";
import { SpineShell } from "@/components/spine/shell";
import { Home2View } from "@/components/home/home2-view";
import { rankPlacesForTrade, slugToIndustry } from "@/lib/scores/recommend";
import { toMarginIndexBoard, deriveHomeInsight } from "@/lib/scores/margin_index";
import type { Metadata } from "next";

/**
 * The home page states its own title, description, and canonical URL.
 *
 * Until now it declared none of the three. Next resolves metadata down the
 * segment tree and replaces it per TOP-LEVEL KEY, so a page with no `metadata`
 * export does not render untitled: it takes the root layout's, and the root
 * layout in src/app/layout.tsx sets `alternates: { canonical: "/" }`. That is
 * harmless for this route, whose canonical genuinely is "/", and it was quietly
 * wrong for every other route that inherited it, which is the defect this pass
 * closes. Declaring it here makes the front door's canonical a fact stated by
 * the page rather than a fallback it happened to land on.
 *
 * The description is the site's own one-sentence answer to "what is this",
 * recorded in BRAND.md and spoken on the page itself. BRAND.md's instruction is
 * to keep the two in step: if the homepage opening line changes, this changes
 * with it.
 *
 * `openGraph` and `twitter` are deliberately absent. Both are declared on the
 * root layout with an image, and because resolution is by replacement rather
 * than deep merge, restating either one here for a title alone would discard
 * the social card image along with it.
 */
export const metadata: Metadata = {
  title: "Margin Atlas: what a small business earns, and what its owner keeps",
  description:
    "What a small business earns, and what its owner actually keeps, trade by trade and place by place.",
  alternates: { canonical: "/" },
};

/**
 * Full-bleed tone wrapper for homepage sections. The inner
 * content lives inside the layout's `max-w-7xl mx-auto px-6` constraint,
 * but the background color spans the full viewport via the same trick
 * the hero already uses (`left-1/2 right-1/2 -mx-[50vw] w-screen`).
 */
function ToneBand({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <div className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen ${getToneClass(tone)}`}>
      <div className="max-w-content mx-auto px-6">{children}</div>
    </div>
  );
}

export const revalidate = 86400; // 1 day

/**
 * Blog rail. Pulls live posts when available, falls
 * back to curated placeholders so the rail always shows six cards.
 */
// Fallback gradient cover for placeholder blog posts (per the
// founder rule: every blog card must have an image).
function placeholderImage(slug: string): BlogPost["image"] {
  // Token-anchored ramps, mirroring GRADIENT_PALETTE in src/lib/blog.ts
  // (conformed 2026-06-12; the navy pair retired for the sanctioned teal).
  // 2026-08-09: the moss and amber ramps replaced in place. See the note on
  // GRADIENT_PALETTE in src/lib/blog.ts , these two lists must stay identical.
  const palette = [
    "linear-gradient(135deg, #991600 0%, #f24e2f 100%)",
    "linear-gradient(135deg, #211810 0%, #534231 100%)",
    "linear-gradient(135deg, #463726 0%, #7d6c58 100%)",
    "linear-gradient(135deg, #534231 0%, #c3b39c 100%)",
    "linear-gradient(135deg, #e62200 0%, #f24e2f 100%)",
    "linear-gradient(135deg, #345a47 0%, #4d7c64 100%)",
  ];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xfffffff;
  const initial = (slug.replace(/[^a-z]/gi, "")[0] || "A").toUpperCase();
  return { kind: "gradient" as const, gradient: palette[h % palette.length], initial };
}

const BLOG_FALLBACK: BlogPost[] = [
  {
    slug: "tokyo-vs-paris-bakery-margins",
    title: "Why bakery margins in Tokyo are half what they are in Paris",
    excerpt: "Rent per square meter, flour pricing, and a labor market that punishes scale.",
    date: "2026-05-12",
    image: placeholderImage("tokyo-vs-paris-bakery-margins"),
  },
  {
    slug: "new-mid-market-services",
    title: "The new mid-market: services firms in 100-employee tiers",
    excerpt: "Where the headcount band stopped being a back-office detail and started shaping margin.",
    date: "2026-05-05",
    image: placeholderImage("new-mid-market-services"),
  },
  {
    slug: "reading-eurostat-sbs",
    title: "How to read a European business-statistics release without getting lost",
    excerpt: "The three tables that matter and the four columns most analysts misread.",
    date: "2026-04-28",
    image: placeholderImage("reading-eurostat-sbs"),
  },
  {
    slug: "ppp-vs-fx-for-margins",
    title: "PPP vs FX: which one belongs in a margin comparison",
    excerpt: "A short, opinionated case for using PPP when the question is about lived economics.",
    date: "2026-04-19",
    image: placeholderImage("ppp-vs-fx-for-margins"),
  },
  {
    slug: "quality-grades-explained",
    title: "What a B-grade benchmark actually means",
    excerpt: "Every number on Atlas has a grade. Here's the rubric, in plain language.",
    date: "2026-04-10",
    image: placeholderImage("quality-grades-explained"),
  },
  {
    slug: "establishment-vs-firm",
    title: "Establishment vs firm: the distinction that breaks comparisons",
    excerpt: "Two countries reporting the same NAICS code can be measuring two different things.",
    date: "2026-04-02",
    image: placeholderImage("establishment-vs-firm"),
  },
];

function loadBlogRail(): { posts: BlogPost[]; sourced: boolean } {
  try {
    const live = getAllPosts();
    if (live.length >= 6) return { posts: live.slice(0, 6), sourced: true };
  } catch {
    // fall through to placeholder
  }
  return { posts: BLOG_FALLBACK, sourced: false };
}

function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function HomePage() {
  // Wave 2 Task 7: gate the rebuilt homepage behind NEXT_PUBLIC_HOME_REFORM (default
  // OFF, see src/lib/feature_flags.ts). Renders src/components/home/home2-view.tsx's
  // data-loading exactly (the same Margin Index resolver run , slugToIndustry ->
  // rankPlacesForTrade -> toMarginIndexBoard , and the same keep-guarded insight
  // derivation), so the live route never re-derives it differently. The live route
  // wraps in SpineShell itself (the dev route gets it from its own layout.tsx), the
  // same pattern src/app/cities/[slug]/page.tsx uses for its spine branch. With the
  // flag OFF (the default) this whole block is skipped and the untouched body below
  // renders exactly as it does today.
  if (isHomeReformEnabled()) {
    const ind = slugToIndustry("restaurants");
    const result = ind ? await rankPlacesForTrade(ind.id, { budgetUsd: null }) : null;
    const marginIndexBoard = result ? toMarginIndexBoard(result) : null;

    // The one honest headline stat: derived centrally (never fabricated) in
    // src/lib/scores/margin_index.ts, tested in tests/scores/margin_index.test.ts.
    const insight = deriveHomeInsight(marginIndexBoard);

    // Real posts only. getAllPosts() already self-guards a missing content dir; the
    // try/catch is extra defense so a malformed post's frontmatter can never break
    // the route. Named distinctly from the flag-OFF path's own `blogPosts` below
    // (different block scope either way; the name just keeps the two paths visibly
    // separate on the page).
    let reformBlogPosts: ReturnType<typeof getAllPosts> = [];
    try {
      reformBlogPosts = getAllPosts();
    } catch {
      reformBlogPosts = [];
    }

    return (
      <SpineShell>
        <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
          <Home2View insight={insight} marginIndexBoard={marginIndexBoard} blogPosts={reformBlogPosts} />
        </main>
      </SpineShell>
    );
  }
  // flag OFF: everything below is the current homepage, untouched.

  const { posts: blogPosts } = loadBlogRail();
  // Neighborhood cards resolved from the real flavor data. A candidate with no
  // flavor entry is dropped, and the section self-omits below four cards, so the
  // homepage never shows a thin or fabricated panel.
  const neighborhoodCards = loadNeighborhoodCards();
  // Like-for-like US-states revenue comparison, resolved live and trusted-local
  // only (synthetic / extrapolated / national reads self-omit). Empty when
  // nothing resolves, which drops the section rather than showing fabricated rows.
  const stateComparisons = await loadStateComparisons();
  const exampleTiles = await loadExampleTiles();
  const specimen = await loadSpecimen();
  /* THE MASTHEAD, PUT BACK. The founder, 2026-08-09: "the page at this moment
     has no header. You have removed the header of the page, which is a massive
     mistake."

     It was never deleted. The masthead used to sit in the ROOT layout and wrap
     every route; it moved into <SiteChrome> because one URL,
     /[country]/[geo]/[industry], serves three different renders chosen at
     REQUEST TIME by data, and App Router layouts are keyed by path, not data.
     Routes that want chrome live under src/app/(site)/ or opt in per page. This
     file sits at the app root, in neither, so it was the one route that got
     neither , verified on production: zero <header>, zero role="banner".

     Do NOT "fix" this by moving the masthead back into the root layout. That
     re-breaks the cell route the move was made to protect.

     And it is a restoration, not a new choice: ToneBand's own comment forty
     lines up says its content "lives inside the layout's max-w-7xl mx-auto px-6
     constraint" and escapes it for the background only. This page was authored
     expecting the chrome's <main> and has been rendering without it. */
  return (
    <SiteChrome>
    <div>
      {/*
        Hero (Reformation v2): the rotating question is the headline again
        ("How much does a [business] make in [city]?"), with the fixed
        positioning line demoted to a one-line subtitle and the old
        "compare small-business..." subhead cut. The eyebrow carries the #1
        leadership claim. Hero + navigator share one band so they read as a
        single section; the navigator is the primary call-to-action and is
        preserved verbatim. The H1 server-renders a concrete question for
        crawlers; the words rotate client-side.
      */}
      {/* WebSite schema, home page only. It is what a search engine reads to
          learn the name to print above a result, and it looks for it here
          rather than site-wide. Organization is on the root layout and stays
          there: it describes the publisher, this marks the front door. */}
      <WebSite />

      <ToneBand tone="home-hero">
        {/* THE HERO-ONLY PHOTOGRAPH IS GONE, and it should never have been the
            answer. A copy of the skyline lived here, absolutely positioned,
            covering the hero and fading to paper under the navigator, because
            the live home page had no atmosphere and the flag-ON one did.

            The founder's verdict on seeing it: "you only put it at the hero
            section", and the background "should be totally visible on the edges
            of the whole site". He was describing a frame, and a frame is not
            something a single band can carry. It is now AtlasFrame, mounted in
            SiteChrome, fixed behind every page including this one.

            Leaving both would have been worse than either. Both drew the same
            picture at .32, so the hero alone would have come out at .54 with a
            hard seam where the block ended, and this one's gradient to cream-50
            would have painted over the site frame across its lower half. The
            exact artifact he objected to, doubled.

            The hero keeps its own rhythm below; the atmosphere is the site's. */}
        <div className="relative">
        {/* White-reset 2026-06-06: hero rhythm tightened (pt / mb / mt cut by
            roughly a third) so the eyebrow, headline, and subtitle sit higher
            and the navigator lifts up into view on a clean white band. */}
        <section className="relative pt-4 pb-3 md:pt-7 md:pb-4 lg:pt-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* THE "#1" EYEBROW IS GONE, on two grounds that agree.
                It read "The #1 atlas of local profit intelligence". Nothing
                supports the rank, and an unbacked claim is the one thing this
                site sells against: it spends every other page saying where it
                is thin.

                It is also the exact string the rulebook names when it banned
                eyebrows over an h1, as "a vaguer restatement of its heading, a
                second label carrying no information". That ruling was applied
                to the spine surface and never to this page.

                No reference this page is measured against opens on a
                self-awarded rank. They state a standard and let the reader
                check it, which is what the ledger band below now does with a
                figure instead of an adjective. */}
            {/* THE OPENING LINE IS THE ONE BRAND.md NAMES.
                This h1 ran two independent rotating words, so the question
                rewrote itself every two seconds: a barbershop in Lisbon, then a
                dental practice in Osaka. Three problems at the bar this page is
                being held to. Motion in the headline competes with the search
                for the eye, and the search is the instrument. A sentence that
                changes cannot be read as a claim. And none of the references
                does it: Airbnb, an airline and a premium rental all open on
                something stable and let the concrete work happen below.

                It also contradicted the brand document. BRAND.md states the
                sentence below and says in as many words: "That sentence is the
                homepage's opening line." A note twenty lines above this one
                repeats the instruction, to keep the metadata description and
                the opening line in step. They were not in step.

                The concreteness is not lost, it moved down one band, where it
                is real: ExampleTiles carries actual businesses in actual cities
                with actual figures, instead of a placeholder cycling through
                names. Terracotta marks the half nobody else publishes, which is
                the rulebook's rule for the accent: it goes on the answer. */}
            <h1 className="font-display text-[1.9rem] sm:text-4xl md:text-5xl font-medium tracking-tight text-ink-900 leading-[1.06] text-balance">
              What a small business earns, and{" "}
              <span className="text-atlas-700">what its owner actually keeps</span>.
            </h1>
            <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-base md:text-lg text-graphite leading-relaxed">
              Trade by trade, place by place. Know if one works before you risk
              your money.
            </p>
          </div>
          {/* Navigator sits inside the same band immediately under the
             hero copy. Tightened top spacing so it reads as one
             continuous section, not two stacked. relative z-30 lifts the
             form (and its ComboField dropdown, which extends below the
             card) above the following world-map band so the open list
             stays fully visible and scrollable. */}
          {/* The id is read by HeaderSearch. While this card is on screen the
              header keeps its search hidden, because two search affordances on
              one screen is what got the header one switched off here in the
              first place; once it scrolls away the header takes over. */}
          <div
            id="home-search-anchor"
            className="relative z-30 mt-4 md:mt-5 max-w-5xl mx-auto"
          >
            <NavigatorForm />
          </div>
        </section>
        </div>
      </ToneBand>

      {/* SHOW THE GOODS, before describing them. The founder: "conceptually it
          is still a disaster." The page had five ways of talking about the
          product and none of showing one, while every reference it is measured
          against opens with real inventory at real prices. This answers the h1
          once, in two real numbers, and the bar between them is the argument.
          Self-omits if the cell does not resolve trusted-local. */}
      <ToneBand tone="home-featured">
        <Specimen specimen={specimen} />
      </ToneBand>

      {/* Lead data hook: curated business-in-city example tiles with real
          headline numbers, the "open a real one" helper right under the search.
          Replaces the old pointed-question list. Self-omits below three.
          Follows the specimen deliberately: that one says "here is what an
          answer is", these say "pick another". */}
      <ToneBand tone="home-featured">
        <ExampleTiles tiles={exampleTiles} />
      </ToneBand>

      {/* THE FRONTISPIECE. What the atlas holds, and where it is thin.
          The founder's standing note on this page is that it "doesn't show the
          vision of the site, what it represents". Every premium reference
          answers that with a STANDARD rather than a slogan, and states it as a
          figure a reader can check.

          It sits here, after one concrete example and before the collections,
          because the question a data product has to answer second (the first
          being "can it answer mine?") is "how much of this is real". The
          closing line says two thirds of it sits in five countries, which is
          the least flattering fact available and the most useful one.

          Not a stats strip. That was removed from this page for being
          marketing copy formatted as numerical cards; this carries only
          derived figures, and every one links to the page that proves it. */}
      <ToneBand tone="home-ledger">
        <AtlasLedger />
      </ToneBand>

      {/* THE CATALOG, ratified 2026-08-09 (option A of /dev/options/catalog).
          His brief: four collections, and "this catalog concept should not be
          slammed like a list of elements". Each is a PLATE, one mark per
          measured entity with the qualifying set lit, so the collection reads as
          a field rather than as its members stacked up.

          It sits ABOVE the map deliberately. His other instruction in the same
          message was that the map "should be smaller", and the reason it reads
          as oversized is that it was the only thing on the page carrying visual
          weight. Giving the weight to something that states what the site is
          for is the first half of that fix; the map's own size is the second. */}
      <ToneBand tone="home-featured">
        <CatalogPlates />
      </ToneBand>

      {/* Plan v30 hotfix v3 - world map moved to the absolute top of
          the page, directly under the hero + navigator form. Founder
          wants it "just below the actual table at the start". */}
      <ToneBand tone="home-city-picker">
        <div id="pick-a-country" className="scroll-mt-20">
          <WorldMapSection />
        </div>
      </ToneBand>

      {/* Like-for-like US-states comparison (homepage v2 Pass A): the SAME trade
          across four large US states, real revenue resolved live and trusted-local
          only. Uses only the clean-resolving US slugs; a trade with fewer than
          three resolving states is dropped and the section self-omits when nothing
          resolves, so every number is real or the row is absent. */}
      <ToneBand tone="home-featured">
        <StateComparison comparisons={stateComparisons} />
      </ToneBand>

      {/* Browse-by-sector retired: the SectorMasterMenu grid (a grid of
         /sectors/[id] tiles) was removed when sector pages were retired. A
         sector is too diluted to be a useful destination; the world map and
         the featured cells below carry the primary navigation. The sector
         taxonomy still groups activities elsewhere. */}

      {/* Plan v32 Sprint B — ExploreCards removed. Was using Pexels stock
         photos (founder rule: no stock imagery), and the "By geography"
         + "By line of work" CTAs duplicate the World map + Sector menu
         that sit directly above. */}

      {/* Neighborhood cards (homepage v2 Pass A): six clickable cards built from
          the REAL deep flavor data (signature businesses, a specific not-on-Google
          detail, a price tier), each linking to that city's neighborhoods hub. A
          candidate with no flavor entry is dropped and the section self-omits below
          four cards, so nothing here is invented and the homepage always renders. */}
      <ToneBand tone="home-cities-placeholder">
        <NeighborhoodCards cards={neighborhoodCards} />
      </ToneBand>

      {/* ONE ROW, TWO PANELS. Who it is for, beside what it costs.
          Pure presentational, tokens only; the upgrade CTA points to /pricing
          (no checkout from the homepage).

          These were two stacked full-width bands. The ratified rule is bento
          two-up bands, never one section per row, and this page was eleven
          stacked bands, with the four lowest-density ones closing it. Every
          premium reference does the opposite: the tail of the page gets denser,
          not thinner.

          This pair went first because the layout was already asking for it. The
          pricing table is max-w-3xl inside a max-w-7xl container, so as a band
          it left roughly forty percent of the row empty, and the audience cards
          were four-across purely because they had a full row to fill. They also
          answer one question rather than two: a reader works out whether this
          is for them and what it costs in the same breath.

          Nothing is dropped. All four audiences and all six matrix rows render
          with the same words; only the grid changed. Five-seven rather than
          six-six because the table has four columns to fit and the audience
          list has none.

          AUDIENCE LEADS, which is both the original order of the two bands and
          the one that survives the collapse to a single column. On a phone this
          grid is one column, so whichever panel is first is simply what a
          reader meets first, and meeting the price before being told who the
          thing is for is the wrong way round. */}
      <ToneBand tone="home-audience">
        <div className="grid grid-cols-1 gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <AudienceBand variant="panel" />
          </div>
          <div className="lg:col-span-7">
            <UpgradeTeaser variant="panel" />
          </div>
        </div>
      </ToneBand>

      {/*
        *  - DidYouKnow: rotating factoid card. The blog rail covers
        *    the same editorial-curiosity slot more usefully.
        *  - CellOfTheWeek: was rendering a malformed headline
        *    ("United-States flag, then in") with no city, plus an
        *    unwanted vermillion corner gradient.
        *  - TaxOverlayTeaser: teases a feature instead of showing data.
        *  - AskWidget: would require live LLM infrastructure that
        *    isn't ready. Founder explicit: remove.
        *  - SectorMasterMenu duplicate mount: already lifted upstream
        *    under the world map in Sprint A3.
        * GlobalCoverageStrip was killed earlier (v31). Every remaining
        * section earns its place.
        */}

      {/* Plan v31 hotfix — bottom TopCitiesMosaic removed (founder: "just
         a dump"). The top mosaic up near the world map already shows the
         curated city set. */}

      {/* Plan v32 Sprint B — QualityLegend removed from the homepage. The
         legend is useful in context (next to a coverage chip on a cell
         page) but on the homepage it's a lecture before any context. The
         vocabulary lives at /about-data#coverage. */}

      {/* Plan v32 (audit Sprint A1) — Stats strip removed. The three
         tiles ("Worldwide", "Every SMB industry", "Free") were
         marketing copy formatted as numerical cards. Founder rule:
         cards that don't carry numbers should not look like numerical
         cards. The trust message they were trying to carry is already
         covered by the "From the notebook" rail and the footer copy. */}

      {/* Plan v32 Sprint B — homepage methodology paragraph removed. The
         3-step pipeline inside HomepageEditorialBlocks (Block B) directly
         above carries the same message visually; the paragraph form
         duplicated it. /about-data remains the canonical long version. */}

      {/* Plan v15 Block 3 - blog rail. */}
      <ToneBand tone="home-blog-rail">
        <section className="py-12 md:py-16">
          <SectionEyebrow size="md" className="mb-2">Writing</SectionEyebrow>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6 md:mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
              From the Atlas notebook
            </h2>
            <a
              href="/blog"
              className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
            >
              All posts →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {blogPosts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-md bg-white border border-parchment hover:border-atlas-500 transition-colors p-5 md:p-6 flex flex-col"
              >
                <div className="text-xs text-ink-500 tabular-nums">
                  {formatPostDate(post.date)}
                </div>
                <h3 className="mt-2 font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors leading-snug">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>
      </ToneBand>

      {/* Prominent free-report lead magnet (homepage reform SP2), above the
          global FooterNewsletterBar. No id="newsletter" here: the footer bar
          owns that anchor. */}
      <ToneBand tone="home-newsletter">
        <HomeNewsletter />
      </ToneBand>

      {/* Plan v32 Sprint B — homepage NewsletterSignup card removed.
         The page already ends with the FooterNewsletterBar (the
         parchment strip above the dark footer), so having a full card
         AND a bar back-to-back read as two pleas in a row. The bar
         is calmer and global; the card was duplicative. The /#newsletter
         anchor (linked from the footer) now points the user to the bar
         via the existing #newsletter id on the bar element. */}
    </div>
    </SiteChrome>
  );
}
