/**
 * /margin-index , the fully-free, crawlable keep-ranked leaderboard.
 *
 * Wave 2 Task 4. New route, server component, ISR daily. Resolves a sensible
 * default board (restaurants, places-for-trade) via the recommender resolver
 * (rankPlacesForTrade, src/lib/scores/recommend.ts) reshaped by toMarginIndexBoard
 * (src/lib/scores/margin_index.ts), then renders the controls island + the SSR
 * view inside SpineShell. Server-rendered so the no-JS answer is present
 * (crawlable) and the flag is a soft pre-launch guard, not a hard requirement:
 * this is a new route with no live version to protect, so it defaults to
 * rendering.
 */
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpineShell } from "@/components/spine/shell";
import { isMarginIndexEnabled } from "@/lib/feature_flags";
import { rankPlacesForTrade, slugToIndustry } from "@/lib/scores/recommend";
import { toMarginIndexBoard } from "@/lib/scores/margin_index";
import { MarginIndexView } from "./margin-index-view";
import { MarginIndexControls } from "./margin-index-controls";

export const revalidate = 86400;

/* NO DESCRIPTION STOOD HERE, on the one route whose own header calls it "the
   fully-free, CRAWLABLE keep-ranked leaderboard". Next resolves metadata per
   top-level key, so with none declared this page inherited the root layout's
   description, which is the site's answer to "what is Margin Atlas" rather
   than this page's answer to "what is this page". Every other public route
   states its own; this was the only crawlable one that did not.

   The text below is the page's own opening paragraph, tightened. Keeping the
   two in step is deliberate: a description that promises something the first
   paragraph does not say is the same defect as a title that promises a PDF
   nobody has written.

   `openGraph` stays absent on purpose, for the reason the home page records:
   both og and twitter are declared on the root layout WITH an image, and
   resolution is by replacement rather than deep merge, so restating either
   here for a title alone would throw the social card image away. */
export const metadata: Metadata = {
  title: "The Margin Index: where small businesses keep the most",
  description:
    "Where a small business keeps the most of what it takes in, ranked place by place for the trade you pick. Free to read in full.",
  alternates: { canonical: "/margin-index" },
};

export default async function MarginIndexPage() {
  // New public route: renders by default. The flag is a pre-launch kill switch:
  // set NEXT_PUBLIC_MARGIN_INDEX to any off value (0/false/off/no) to dark it.
  const marginIndexFlag = process.env.NEXT_PUBLIC_MARGIN_INDEX;
  if (marginIndexFlag != null && marginIndexFlag !== "" && !isMarginIndexEnabled()) notFound();

  const ind = slugToIndustry("restaurants");
  const result = ind ? await rankPlacesForTrade(ind.id, { budgetUsd: null }) : null;

  return (
    <SpineShell>
      <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
        {/* THE PAGE HAD NO h1. Its only heading came from <Movement>, which
            emits an h2, and Movement lives inside MarginIndexView, so the
            heading existed only when the board resolved. On the fallback path
            this route rendered no heading at all: controls, and one unstyled
            sentence.

            The h1 sits here rather than in the view because the page is the
            Margin Index whether or not today's board resolved. The h2 below it
            names the board actually on screen ("Where restaurants keep the
            most"), which is a different and narrower statement, so the two do
            not restate each other. No eyebrow above it, per the rulebook. */}
        {/* text-2xl, not var(--t-h1): THERE IS NO --t-h1. The spine scale is
            micro/body/lead/sub and stops at 20px, deliberately, and globals.css
            spells out what happens if you reach past it: "a var that resolves
            nowhere makes font-size an invalid declaration, which the browser
            drops, silently falling back to the inherited size." The first
            version of this line did exactly that and typechecked cleanly.

            24px is one step above the 20px sub tier that Movement's h2 uses, so
            the page title reads above the board title without breaking a scale
            that is compressed on purpose. */}
        <h1
          data-typography="custom"
          className="text-2xl font-semibold tracking-tight text-[var(--c-ink)]"
        >
          The Margin Index
        </h1>
        <p className="mt-2 max-w-2xl text-[length:var(--t-body)] text-[var(--c-muted)]">
          Where a small business keeps the most of what it takes, ranked. Free,
          in full, for every trade and place the atlas has measured.
        </p>

        {/* SUSPENSE IS LOAD BEARING, same defect as /decide and the same cause.
            MarginIndexControls uses useUrlStateMap, which calls useSearchParams
            (src/lib/url_state.ts:64). Without a Suspense boundary that opts the
            WHOLE route into client-side rendering: Next still reports it as
            prerendered and the HTML it emits carries only the chrome plus the
            React payload.

            Measured on production before this fix: h1=0, h2=0, p=0, 20 divs,
            9 visible words. /compare in the same route group renders 831 words
            because it wraps its client in Suspense. */}
        <Suspense
          fallback={
            <div className="py-6 text-sm text-cocoa-500" role="status" aria-live="polite">
              Loading the controls
            </div>
          }
        >
          <MarginIndexControls />
        </Suspense>
        {result ? (
          <MarginIndexView board={toMarginIndexBoard(result)} />
        ) : (
          /* "The Margin Index is filling in. Check back soon." stood here: a
             bare unstyled paragraph, nine words, no onward link, and the
             coming-soon stub this repo bans by name.

             It is also the wrong diagnosis. The board is built from live cell
             reads, so this branch is what a reader sees when those reads come
             back empty or slow, not when the index is being populated. Telling
             them to check back soon describes a schedule nobody set. Say what
             is missing, and hand them a door. */
          <div className="mt-8 max-w-2xl">
            <p className="text-[length:var(--t-body)] text-[var(--c-ink)]">
              Today&apos;s ranking did not load.
            </p>
            <p className="mt-3 text-[length:var(--t-body)] text-[var(--c-muted)]">
              The board is built fresh from the benchmarks behind it, so this
              page is only as good as that read. Nothing has been lost: every
              number it ranks is on the trade and place pages themselves.
            </p>
            <p className="mt-5 text-[length:var(--t-body)]">
              <a
                href="/world"
                className="font-semibold text-[var(--terra-text)] hover:underline"
              >
                Browse by place instead
              </a>
            </p>
          </div>
        )}
      </main>
    </SpineShell>
  );
}
