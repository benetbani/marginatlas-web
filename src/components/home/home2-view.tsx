/**
 * Home2View , rebuilt homepage BODY on the spine kit. Wave 2 Task 5 built the
 * masthead; Task 6 appends the spine-below chapters beneath it, each a
 * `Movement` chapter that renders only when it has something honest to show
 * (chapter numbering is dynamic , see makeChapterCounter, ported from
 * src/app/dev/spine-city/city-view.tsx , so an omitted chapter never leaves a
 * numbering gap).
 *
 * ONE white "lift" Box floats over the shell's skyline (see ./layout.tsx), holding, in
 * order: a POV eyebrow, the single server-rendered crawlable <h1> question, a one-line
 * subtitle, an optional real-data insight Chip (self-omits on null/empty, never a
 * fabricated stat), and the launcher.
 *
 * THE LAUNCHER preserves the "/api/go" no-JS contract verbatim: NavigatorForm is mounted
 * exactly as-is (its own <form action="/api/go" method="get"> + the four hidden inputs +
 * its client submit() are untouched , not reimplemented, wrapped, or forked). Beside it,
 * a plain server-rendered <a href="/decide"> is the prominent recommender entry point; a
 * real link works with JS off too. Two honest paths in: pick it yourself, or let the
 * Atlas pick for you.
 *
 * BELOW THE MASTHEAD (Task 6), in order:
 *  1. The 5-ways-in router , the five page archetypes (cell > industry > city > hood >
 *     country), each a real link. Always renders; every href is a verified real route.
 *  2. The Margin Index taste band , the top real-keep rows of the restaurants board,
 *     as RankBars, plus a link to the full /margin-index. Self-omits below 3 known rows.
 *  3. The myth / POV band , static editorial copy, no numbers, no place claims.
 *  4. The map, demoted , the existing real country picker (WorldMapClient), small and
 *     low-emphasis, NOT SpineMap (no city lat/lng exist here; inventing coordinates would
 *     fabricate data).
 *  5. Free-vs-paid , qualitative only, no price numbers (PRICING.md can drift).
 *  6. The blog strip , only real posts from getAllPosts(), never the old hardcoded
 *     BLOG_FALLBACK slugs. Self-omits below 3 real posts.
 *  7. Close , a CTA back to the recommender. No newsletter form here: the root layout's
 *     footer bar already owns the #newsletter anchor.
 */
import {
  Box,
  Bullets,
  Chip,
  Even,
  Full,
  Head,
  Movement,
  Narrow,
  Rail,
} from "@/components/spine/kit";
import { RankBars, type RankDatum } from "@/components/spine/kit-index";
import { AtlasIcon, type AtlasIconId } from "@/components/brand/icons";
import { AtlasMark, type AtlasMarkId } from "@/components/spine/marks";
import { WorldMapClient } from "@/components/home/WorldMapClient";
import { NavigatorForm } from "@/components/NavigatorForm";
import type { MarginIndexBoard, MarginIndexRow } from "@/lib/scores/margin_index";
import type { BlogPost } from "@/lib/blog";

/* ---- dynamic chapter numbering , ported verbatim from city-view.tsx ------ */
function makeChapterCounter() {
  let n = 0;
  return () => {
    n += 1;
    return String(n).padStart(2, "0");
  };
}

/* ================= CH1 , FIVE WAYS IN ================= */
/* One card per page archetype, in value order (cell > industry > city > hood > country).
 * No alt-industry mark exists, so the industry rung carries an AtlasIcon instead. Every
 * href below is a verified real route (see task-6-report.md for the check per link);
 * neutral by default, the per-card affordance only warms to terracotta on hover so five
 * peer choices never read as a wall of orange. */
type WayCard = {
  mark?: AtlasMarkId;
  icon?: AtlasIconId;
  label: string;
  sub: string;
  href: string;
  cta: string;
};
const FIVE_WAYS: WayCard[] = [
  { mark: "alt-business", label: "A business, in one place", sub: "One trade, one city: what the owner actually keeps.", href: "/random", cta: "Open a random one" },
  { icon: "benchmark", label: "A whole trade", sub: "How one industry's economics compare, worldwide.", href: "/industries", cta: "Browse every trade" },
  { mark: "alt-city", label: "A city", sub: "Every trade a metro supports, ranked side by side.", href: "/cities", cta: "Browse cities" },
  { mark: "alt-district", label: "A neighborhood", sub: "Where inside a city a trade actually works best.", href: "/random", cta: "See an example" },
  { mark: "alt-country", label: "A country", sub: "The government's take, and where it eases up.", href: "/random", cta: "See an example" },
];
function FiveWaysRouter() {
  return (
    <Full>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {FIVE_WAYS.map((w) => (
          <a
            key={w.href}
            href={w.href}
            className="cityhov group flex flex-col gap-2 rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] p-4"
          >
            {w.mark ? (
              <AtlasMark id={w.mark} size={22} />
            ) : w.icon ? (
              <AtlasIcon id={w.icon} size={20} className="spine-ic" style={{ color: "var(--c-ink2)" }} />
            ) : null}
            <span className="text-[13px] font-semibold leading-snug text-[var(--c-ink)]">{w.label}</span>
            <span className="text-[11px] leading-snug text-[var(--c-muted)]">{w.sub}</span>
            <span className="mt-auto pt-1 text-[11px] font-semibold text-[var(--c-ink2)] transition group-hover:text-[var(--terra-text)]">
              {w.cta} <span aria-hidden="true">&rarr;</span>
            </span>
          </a>
        ))}
      </div>
    </Full>
  );
}

/* ================= CH2 , THE MARGIN INDEX TASTE BAND ================= */
/* Null-guard lives in Home2View (hasTasteCh): this component only ever receives rows
 * that already carry a real, known keepPct (never a dashed/unknown row), so RankBars
 * never draws a fabricated near-empty bar. */
function MarginTaste({ rows, subject }: { rows: (MarginIndexRow & { keepPct: number })[]; subject?: string }) {
  const rankRows: RankDatum[] = rows.map((r) => ({
    id: r.id,
    label: r.name,
    value: r.keepPct,
    href: r.href,
    display: `${r.keepPct}%`,
  }));
  const verdict = subject
    ? `A taste of the full board for ${subject}. Ranked by what the owner actually keeps, a share, never raw money across places.`
    : "A taste of the full board. Ranked by what the owner actually keeps, a share, never raw money across places.";
  return (
    <Full>
      <div className="space-y-3">
        <Box>
          <Rail icon="ranking" kicker="Kept, ranked" verdict={verdict} />
          <RankBars rows={rankRows} />
        </Box>
        <a href="/margin-index" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--terra-text)] hover:underline">
          Open the Margin Index <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </Full>
  );
}

/* ================= CH3 , THE MYTH / POV BAND ================= */
/* Static editorial copy only. No numbers, no named places, no invented detail: quiet
 * almanac voice, the same honesty bar as every real chapter. */
function MythBand() {
  return (
    <Narrow>
      <Box>
        <p className="text-[15px] font-medium leading-snug text-[var(--c-ink)]">
          The obvious trade in the obvious spot is rarely the one that keeps the most.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--c-ink2)]">
          A packed tourist street pays premium rent for footfall a steady trade never needed. A
          famous capital taxes and licenses harder than its own quieter regions. The honest
          margin tends to sit one rung down from the place everyone already assumes, not on it.
        </p>
      </Box>
    </Narrow>
  );
}

/* ================= CH4 , THE MAP, DEMOTED ================= */
/* Reuses the existing real country picker (WorldMapClient, "use client", no props) as a
 * plain browse affordance. Deliberately NOT SpineMap: SpineMap needs real lat/lng
 * SpinePoints, and the city lists here carry no coordinates , inventing them would
 * fabricate data. Narrow + a plain card keeps it visibly smaller and lower-emphasis
 * than the masthead. */
function MapBrowse() {
  return (
    <Narrow>
      <Box>
        <Rail kicker="Or start from a place" verdict="Every country on the atlas. Pick one to see what small business actually looks like there." />
        <div className="mx-auto max-w-xl overflow-hidden rounded-[10px] border border-[var(--c-border)]">
          <WorldMapClient />
        </div>
      </Box>
    </Narrow>
  );
}

/* ================= CH5 , FREE VS PAID ================= */
/* Qualitative only, no price numbers (PRICING.md is the canonical source and can drift
 * independently of this page). Matches the ratified stance: all reading is free; a paid
 * plan is for going deeper on a decision, not for access to reading. */
function FreeVsPaid() {
  return (
    <Even>
      <Box>
        <Head>Free, always</Head>
        <Bullets
          items={[
            "Every page on the atlas: every business, every place.",
            "The recommender's number one answer, for any trade in any place.",
            "The whole Margin Index leaderboard, every row, ranked by what owners keep.",
          ]}
        />
      </Box>
      <Box>
        <Head>What a paid plan adds</Head>
        <Bullets
          items={[
            "The full ranked list behind that number one answer.",
            "Tuning: reweight what the recommender optimizes for.",
          ]}
        />
        <p className="mt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">
          A paid plan is for going deeper on a decision you are already leaning toward, not for
          reading.
        </p>
        <a href="/pricing" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--terra-text)] hover:underline">
          See plans <span aria-hidden="true">&rarr;</span>
        </a>
      </Box>
    </Even>
  );
}

/* ================= CH6 , THE BLOG STRIP ================= */
/* Real posts only (getAllPosts(), @/lib/blog). Deliberately does NOT use the live
 * homepage's BLOG_FALLBACK: those six placeholder slugs are hardcoded and may 404. The
 * self-omit guard (hasBlogCh in Home2View) already keeps this to >=3 real posts. */
function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}
function BlogStrip({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <Full>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {posts.map((p) => (
            <a key={p.slug} href={`/blog/${p.slug}`} className="cityhov flex flex-col rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] p-4">
              <span className="fig text-[10.5px] uppercase tracking-wide text-[var(--c-muted)]">{formatPostDate(p.date)}</span>
              <span className="mt-1.5 text-[14px] font-semibold leading-snug text-[var(--c-ink)]">{p.title}</span>
              {p.excerpt ? <span className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[var(--c-ink2)]">{p.excerpt}</span> : null}
            </a>
          ))}
        </div>
      </Full>
      <Full>
        <a href="/blog" className="text-[13px] font-semibold text-[var(--terra-text)] hover:underline">
          All posts <span aria-hidden="true">&rarr;</span>
        </a>
      </Full>
    </>
  );
}

/* ================= CH7 , CLOSE ================= */
/* A Narrow CTA back to the recommender. No newsletter form here and no id="newsletter":
 * the root layout's FooterNewsletterBar already owns that anchor site-wide; a second one
 * here would break its deep links. Mirrors the masthead's own CTA button styling, an
 * intentional bookend. */
function CloseCTA() {
  return (
    <Narrow>
      <Box elevation="lift">
        <div className="text-center">
          <p className="text-[15px] font-medium leading-snug text-[var(--c-ink)]">Not sure which trade fits, or where.</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--c-ink2)]">
            Answer two questions and the Atlas ranks the rest for you.
          </p>
          <a
            href="/decide"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--terra-border)] bg-[var(--terra-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--terra-text)] transition hover:bg-[var(--terra-border)]"
          >
            Let the Atlas pick for you
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </Box>
    </Narrow>
  );
}

export function Home2View({
  insight,
  marginIndexBoard,
  blogPosts = [],
}: {
  insight: string | null;
  marginIndexBoard?: MarginIndexBoard | null;
  blogPosts?: BlogPost[];
}) {
  const cn = makeChapterCounter();

  // Chapter 2 self-omit: only rows with a REAL, known keep share ever reach RankBars
  // (never a dashed/unknown row drawn as a fabricated near-empty bar). Below three such
  // rows there is nothing honest to rank, so the whole chapter (heading included) omits.
  const tasteRows = (marginIndexBoard?.rows ?? []).filter(
    (r): r is MarginIndexRow & { keepPct: number } => r.keepKnown && r.keepPct != null,
  ).slice(0, 5);
  const hasTasteCh = tasteRows.length >= 3;

  // Chapter 6 self-omit: real posts only, never the live homepage's hardcoded
  // BLOG_FALLBACK placeholders (those six slugs can 404). Below three real posts there
  // is nothing to show as a "strip", so the whole chapter omits.
  const posts = blogPosts.slice(0, 6);
  const hasBlogCh = posts.length >= 3;

  return (
    <>
      <section className="overflow-hidden py-8 md:py-12">
      <Full>
      <Box elevation="lift">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">
            The #1 atlas of local profit intelligence
          </div>
          {/* Server-rendered, place-neutral , no client-only word rotation, so a crawler
              sees a real question that holds for every place on the atlas (S13
              universality), never a single country pinned into the crawlable H1. The
              launcher directly below (NavigatorForm) carries its own rotating real
              example, so the concrete flavor still lands, just not in the H1. */}
          <h1
            data-typography="custom"
            className="mx-auto mt-2 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2.6rem]"
          >
            How much does a small business actually keep?
          </h1>
          <p className="mx-auto mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-[var(--c-ink2)] md:text-[15px]">
            Know if a business works before you risk your money.
          </p>
          {insight ? (
            <div className="mt-4 flex justify-center">
              <Chip>{insight}</Chip>
            </div>
          ) : null}
        </div>

        {/* The launcher. The recommender entry point sits above the concrete picker so
            both read as two honest doors in, not one buried inside the other. */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <a
            href="/decide"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--terra-border)] bg-[var(--terra-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--terra-text)] transition hover:bg-[var(--terra-border)]"
          >
            Or let the Atlas pick the place for you
            <span aria-hidden="true">&rarr;</span>
          </a>
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
            or search a place and a business directly
          </span>
        </div>

        {/* NavigatorForm mounted as-is: unmodified "/api/go" no-JS form + hidden inputs. */}
        <div className="mt-4">
          <NavigatorForm />
        </div>
      </Box>
      </Full>
      </section>

      {/* 1. Five ways in , always renders; every href is a verified real route. */}
      <Movement index={cn()} eyebrow="Five ways in" heading="Pick your altitude" icon="search" />
      <FiveWaysRouter />

      {/* 2. The Margin Index, a taste , self-omits below three known-keep rows. */}
      {hasTasteCh ? (
        <>
          <Movement
            index={cn()}
            eyebrow="The Margin Index"
            heading={marginIndexBoard?.subject ? `Where ${marginIndexBoard.subject} keep the most` : "Where the margin actually is"}
            icon="ranking"
          />
          <MarginTaste rows={tasteRows} subject={marginIndexBoard?.subject} />
        </>
      ) : null}

      {/* 3. The honest read , static editorial copy, always renders. */}
      <Movement index={cn()} eyebrow="The honest read" heading="Where the money actually is" icon="myth-reality" />
      <MythBand />

      {/* 4. The map, demoted , a browse affordance, always renders. */}
      <Movement index={cn()} eyebrow="Or just browse" heading="Pick a country instead" icon="vs-world" />
      <MapBrowse />

      {/* 5. Free vs paid , qualitative only, always renders. */}
      <Movement index={cn()} eyebrow="Free vs paid" heading="What's free, and what isn't" icon="scorecard" />
      <FreeVsPaid />

      {/* 6. The blog strip , self-omits below three real posts. */}
      {hasBlogCh ? (
        <>
          <Movement index={cn()} eyebrow="From the notebook" heading="Writing on the numbers" icon="operator-voices" />
          <BlogStrip posts={posts} />
        </>
      ) : null}

      {/* 7. Close , a CTA back to the recommender, always renders. */}
      <Movement index={cn()} eyebrow="Still deciding" heading="Let the Atlas pick" icon="verdict" />
      <CloseCTA />
    </>
  );
}
