import { NavigatorForm } from "@/components/NavigatorForm";
import { WorldMapSection } from "@/components/home/WorldMapSection";
import { WhatAtlasWeighs } from "@/components/home/WhatAtlasWeighs";
import { MoneyBeats } from "@/components/home/MoneyBeats";
import { loadHomepageBeats } from "@/lib/home/beats";
import HomepageEditorialBlocks, { type AtlasQuestion } from "@/components/HomepageEditorialBlocks";
import Image from "next/image";
import { RotatingWord } from "@/components/RotatingWord";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { getToneClass } from "@/lib/page-layout/section-order";
import { getAllPosts, type BlogPost } from "@/lib/blog";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * Full-bleed tone wrapper for homepage sections. The inner
 * content lives inside the layout's `max-w-7xl mx-auto px-6` constraint,
 * but the background color spans the full viewport via the same trick
 * the hero already uses (`left-1/2 right-1/2 -mx-[50vw] w-screen`).
 */
function ToneBand({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <div className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen ${getToneClass(tone)}`}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </div>
  );
}

export const revalidate = 86400; // 1 day

/**
 * Decision-first prompts for the editorial "What you can ask Atlas" block
 * (bible Section 25 voice: the questions a skeptical operator actually asks
 * before risking money, not feature marketing). Each lands on a live cell.
 */
const HOME_QUESTIONS: AtlasQuestion[] = [
  { text: "Can a restaurant in Barcelona actually pay its owner?", href: "/es/es511/restaurants" },
  { text: "Is software in San Francisco worth the cost base?",     href: "/us/california/software-development" },
  { text: "How crowded is the legal market in the UK?",            href: "/gb/gb/legal-services" },
  { text: "Do Cancún hotels make money once rent is paid?",        href: "/mx/mx-roo/hotels-lodging" },
  { text: "What does metal manufacturing in Bavaria really earn?", href: "/de/de21/fabricated-metal-mfg" },
  { text: "Where do California restaurant margins go?",            href: "/us/california/restaurants" },
];

/**
 * Blog rail. Pulls live posts when available, falls
 * back to curated placeholders so the rail always shows six cards.
 */
// Fallback gradient cover for placeholder blog posts (per the
// founder rule: every blog card must have an image).
function placeholderImage(slug: string): BlogPost["image"] {
  const palette = [
    "linear-gradient(135deg, #952509 0%, #C97347 100%)",
    "linear-gradient(135deg, #1F3D32 0%, #5B8770 100%)",
    "linear-gradient(135deg, #3A3A3A 0%, #6E6E6E 100%)",
    "linear-gradient(135deg, #4C2712 0%, #8B5E3C 100%)",
    "linear-gradient(135deg, #5C3A0A 0%, #B07A2C 100%)",
    "linear-gradient(135deg, #0F2A4A 0%, #2F5A8B 100%)",
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
  const { posts: blogPosts } = loadBlogRail();
  // Three data-rich beats (editorial cards, gym leaderboard, surprising spread)
  // resolved server-side at build/ISR time. Every read is budget-wrapped and
  // self-omits on a miss, so this never blocks or breaks the homepage render.
  const beats = await loadHomepageBeats();
  return (
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
      <ToneBand tone="home-hero">
        {/* White-reset 2026-06-06: hero rhythm tightened (pt / mb / mt cut by
            roughly a third) so the eyebrow, headline, and subtitle sit higher
            and the navigator lifts up into view on a clean white band. */}
        <section className="pt-4 pb-3 md:pt-7 md:pb-4 lg:pt-8">
          <div className="max-w-4xl mx-auto text-center">
            <SectionEyebrow size="md" className="mb-2.5 md:mb-3 text-center">
              The #1 atlas of local profit intelligence
            </SectionEyebrow>
            <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-ink-900 leading-[1.08] text-balance">
              How much does a{" "}
              <span className="text-atlas-700">
                <RotatingWord
                  words={HERO_BUSINESSES as unknown as string[]}
                  interval={2000}
                />
              </span>{" "}
              make in{" "}
              <span className="text-atlas-700">
                <RotatingWord
                  words={HERO_CITIES as unknown as string[]}
                  interval={2000}
                  offset={1000}
                />
              </span>
              ?
            </h1>
            <p className="mt-2.5 md:mt-4 max-w-2xl mx-auto text-base md:text-lg text-graphite leading-relaxed">
              Know if a business works before you risk your money.
            </p>
          </div>
          {/* Navigator sits inside the same band immediately under the
             hero copy. Tightened top spacing so it reads as one
             continuous section, not two stacked. relative z-30 lifts the
             form (and its ComboField dropdown, which extends below the
             card) above the following world-map band so the open list
             stays fully visible and scrollable. */}
          <div className="relative z-30 mt-4 md:mt-5 max-w-5xl mx-auto">
            <NavigatorForm />
          </div>
        </section>
      </ToneBand>

      {/* Plan v30 hotfix v3 - world map moved to the absolute top of
          the page, directly under the hero + navigator form. Founder
          wants it "just below the actual table at the start". */}
      <ToneBand tone="home-city-picker">
        <div id="pick-a-country" className="scroll-mt-20">
          <WorldMapSection />
        </div>
      </ToneBand>

      {/* Browse-by-sector retired: the SectorMasterMenu grid (a grid of
         /sectors/[id] tiles) was removed when sector pages were retired. A
         sector is too diluted to be a useful destination; the world map and
         the featured cells below carry the primary navigation. The sector
         taxonomy still groups activities elsewhere. */}

      {/* Decision-factors strip (bible Section 25/26). States the thesis
          plainly before the page shows any tile: the average margin is not
          the point; what eats it first is. Reuses the home-featured white
          tone so it reads as a clean editorial band between the navigation
          cluster above and the curated cells below. */}
      <ToneBand tone="home-featured">
        <WhatAtlasWeighs />
      </ToneBand>

      {/* Plan v32 Sprint B — ExploreCards removed. Was using Pexels stock
         photos (founder rule: no stock imagery), and the "By geography"
         + "By line of work" CTAs duplicate the World map + Sector menu
         that sit directly above. */}

      {/* Plan v31 — cities section anchored by a stylized cartographic
          rendering of central London. Vermillion-tinted streets, green
          parks, black Thames. Crops to a horizontal letterbox so the
          dense central area always shows. */}
      <ToneBand tone="home-cities-placeholder">
        <section className="py-10 md:py-14">
          <div className="rounded-2xl bg-white border border-ink-200 overflow-hidden">
            <div className="grid md:grid-cols-[1fr_minmax(0,640px)] gap-0 items-stretch">
              <div className="px-6 py-8 md:px-10 md:py-12">
                <SectionEyebrow size="md" className="mb-3">Top 200 cities</SectionEyebrow>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-ink-900">
                  Drilled to the neighborhood
                </h2>
                <p className="mt-3 md:mt-4 max-w-xl text-base md:text-lg text-cocoa-700 leading-relaxed">
                  Manhattan blocks. Central Tokyo wards. Paris arrondissements.
                  The same benchmarks at neighborhood resolution, rolling out
                  city by city.
                </p>
                <a
                  href="/cities"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-atlas-700 hover:text-atlas-500 transition-colors"
                >
                  Browse cities <span aria-hidden>→</span>
                </a>
              </div>
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
                <Image
                  src="/london-cities.png"
                  alt="Stylized cartographic rendering of central London showing parks, streets, and the Thames"
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="object-cover object-center"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </section>
      </ToneBand>

      {/* Three data-rich money beats (replaced the featured-tiles grid,
          2026-06-06): three editorial cards each carrying a real
          industry-in-place with its typical revenue, after-tax owner take-home,
          and a hook that names the upside and the killer; a ranked leaderboard
          of the US states where a gym keeps the most for its owner; and a
          verified surprising spread where a humble business out-earns a
          prestigious one. Every figure is resolved from real cells server-side
          (src/lib/home/beats), and each beat self-omits on a miss. */}
      <ToneBand tone="home-featured">
        <MoneyBeats beats={beats} />
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


      {/* Editorial spine: the skeptical questions a working operator asks
          (passed in from HOME_QUESTIONS, bible Section 25 voice) followed by
          the three-tier methodology pipeline that carries the trust message. */}
      <HomepageEditorialBlocks questions={HOME_QUESTIONS} />

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

      {/* Plan v32 Sprint B — homepage NewsletterSignup card removed.
         The page already ends with the FooterNewsletterBar (the
         parchment strip above the dark footer), so having a full card
         AND a bar back-to-back read as two pleas in a row. The bar
         is calmer and global; the card was duplicative. The /#newsletter
         anchor (linked from the footer) now points the user to the bar
         via the existing #newsletter id on the bar element. */}
    </div>
  );
}
