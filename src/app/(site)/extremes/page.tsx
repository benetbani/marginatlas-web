/**
 * /extremes - the Extremes hub.
 *
 * The addictive front-of-house: a browsable set of ranked leaderboards of the
 * surprising highs and lows across the small-business data. Each leaderboard is
 * a real "extreme" that rewards browsing, and every row carries a real number
 * and links to a live cell.
 *
 * This page also carries the brand's slightly warmer, more editorial voice: a
 * knowledgeable friend showing you something fascinating, away from the blunt
 * benchmark register. The hard rules stay exactly as everywhere else, though:
 * never imply an upside without naming the catch, and never a fake number. The
 * warmth is in the framing, not in the figures.
 *
 * All numbers are resolved server-side in src/lib/extremes/leaderboards, which
 * reuses the homepage beats' discipline: one bounded across-states read per
 * leaderboard, the activity-page outlier fence, the misroute + is_synthetic
 * guards, and the shared after-tax take-home estimator. Each leaderboard
 * self-omits below five clean rows, and the page itself renders nothing if too
 * few resolve, so the hub never shows a broken or short board.
 *
 * Server component, revalidated daily. Mobile-first, and every block sits on
 * the canonical .atlas-card surface, the same one StatCard and RankRow moved
 * to: translucent at .955 so the fixed page photograph reads through it.
 * Tokens only, no em-dashes, no source-agency names.
 */
import type { Metadata } from "next";
import { RankRow } from "@/components/board/RankRow";
import { fmtUSD, fmtNum } from "@/components/board/format";
import { CatalogCollections } from "@/components/extremes/CatalogCollections";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { LensFilter, type LensEntry } from "@/components/extremes/LensFilter";
import {
  loadExtremes,
  type ExtremeLeaderboard,
  type BreakInLeaderboard,
  type DensityLeaderboard,
  type StartupLeaderboard,
} from "@/lib/extremes/leaderboards";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "The extremes: small-business highs and lows | Margin Atlas",
  description:
    "The surprising edges of the small-business world: where owners keep the most, where the same business barely clears, and what the catch is. Real numbers, ranked, each linking to the full benchmark.",
  alternates: { canonical: "/extremes" },
};

/** Smallest number of clean leaderboards worth opening the hub for. */
const MIN_BOARDS = 3;

/**
 * One leaderboard section: a warm eyebrow + title, the editorial intro that
 * names the catch, then the ranked rows on the cream card surface. Each row is
 * a RankRow whose value is the after-tax owner take-home and whose texture is
 * the net margin, so the upside always sits next to the share that survives.
 */
function LeaderboardSection({ board }: { board: ExtremeLeaderboard }) {
  return (
    /* ONE CARD PER BOARD. The heading trio, the ranked rows and the note
       were three loose objects on the page separated by a border-t rule,
       and only the middle one had a surface. AtlasFrame paints a fixed
       photograph behind every route with no centre plate, so the eyebrow,
       the h2 and the note were dark type straight on a picture while the
       rows sat on an opaque hand-rolled plate. The board is one card now,
       which is both the legibility fix and the divider: cards separate
       themselves, so the rule goes. */
    <section className="atlas-card p-5 md:p-6">
      <SectionEyebrow size="md" className="mb-2">
        {board.eyebrow}
      </SectionEyebrow>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance text-ink-900 md:text-3xl">
        {board.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
        {board.intro}
      </p>

      {/* The inner hand-rolled plate is gone: the section above IS the
          card now, and an inline boxShadow beats the class anyway, so a
          second elevation here would have pinned this surface to a level
          nothing else on the site uses. */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-end">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
            {board.valueCaption}
          </span>
        </div>
        {board.rows.map((row, i) => (
          <RankRow
            key={row.href}
            rank={i + 1}
            label={row.name}
            href={row.href}
            value={fmtUSD(row.takeHome)}
            texture={
              row.netMarginPct != null
                ? `${Math.round(row.netMarginPct)}% net`
                : undefined
            }
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-cocoa-500">
        Owner take-home is after tax, for a typical single-site operator in each
        state. Same currency, same method, so the states sit side by side
        honestly. Modeled from local business demography. Directional.
      </p>
    </section>
  );
}

/**
 * One competition-density leaderboard: the same warm framing and cream card as
 * the take-home boards, but the ranked figure is firms per 10k residents (the
 * "room to enter" read) rather than a money value. Each row links to the full
 * cell for that place. The density is a real, local reading from the trusted
 * city set, sanity-capped, so a row is never a country aggregate or a stub.
 */
function DensityLeaderboardSection({ board }: { board: DensityLeaderboard }) {
  return (
    /* ONE CARD PER BOARD. The heading trio, the ranked rows and the note
       were three loose objects on the page separated by a border-t rule,
       and only the middle one had a surface. AtlasFrame paints a fixed
       photograph behind every route with no centre plate, so the eyebrow,
       the h2 and the note were dark type straight on a picture while the
       rows sat on an opaque hand-rolled plate. The board is one card now,
       which is both the legibility fix and the divider: cards separate
       themselves, so the rule goes. */
    <section className="atlas-card p-5 md:p-6">
      <SectionEyebrow size="md" className="mb-2">
        {board.eyebrow}
      </SectionEyebrow>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance text-ink-900 md:text-3xl">
        {board.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
        {board.intro}
      </p>

      {/* The inner hand-rolled plate is gone: the section above IS the
          card now, and an inline boxShadow beats the class anyway, so a
          second elevation here would have pinned this surface to a level
          nothing else on the site uses. */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-end">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
            {board.valueCaption}
          </span>
        </div>
        {board.rows.map((row, i) => (
          <RankRow
            key={row.href}
            rank={i + 1}
            label={row.name}
            href={row.href}
            value={fmtNum(row.densityPer10k)}
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-cocoa-500">
        Density is firms per 10k residents for a typical local operator, a real
        count over the resident population in each place. Lower is more room to
        enter, higher is a tighter market. Directional.
      </p>
    </section>
  );
}

/**
 * One startup-capital leaderboard: the same warm framing and cream card as the
 * boards above, but the ranked figure is the modeled one-time cost to open the
 * business in that place (the per-industry archetype scaled by the city's cost
 * of living, capped). Each row links to the full cell. The figure is a model,
 * not a per-place measurement, so the note labels it modeled.
 */
function StartupLeaderboardSection({ board }: { board: StartupLeaderboard }) {
  return (
    /* ONE CARD PER BOARD. The heading trio, the ranked rows and the note
       were three loose objects on the page separated by a border-t rule,
       and only the middle one had a surface. AtlasFrame paints a fixed
       photograph behind every route with no centre plate, so the eyebrow,
       the h2 and the note were dark type straight on a picture while the
       rows sat on an opaque hand-rolled plate. The board is one card now,
       which is both the legibility fix and the divider: cards separate
       themselves, so the rule goes. */
    <section className="atlas-card p-5 md:p-6">
      <SectionEyebrow size="md" className="mb-2">
        {board.eyebrow}
      </SectionEyebrow>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance text-ink-900 md:text-3xl">
        {board.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
        {board.intro}
      </p>

      {/* The inner hand-rolled plate is gone: the section above IS the
          card now, and an inline boxShadow beats the class anyway, so a
          second elevation here would have pinned this surface to a level
          nothing else on the site uses. */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-end">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
            {board.valueCaption}
          </span>
        </div>
        {board.rows.map((row, i) => (
          <RankRow
            key={row.href}
            rank={i + 1}
            label={row.name}
            href={row.href}
            value={fmtUSD(row.startupCostUsd)}
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-cocoa-500">
        Cost to open is the typical one-time capital to get the doors open: the
        fit-out, kit, deposits, and working capital before the first customer.
        Modeled from the trade and adjusted for how expensive the place is.
        Directional.
      </p>
    </section>
  );
}

/**
 * One break-in-rating leaderboard: the same warm framing and cream card as the
 * boards above, but the ranked figure is the single break-in rating (0-100,
 * higher = easier to break in), with the band word as the row texture. Each row
 * links to the full cell. The rating rests on a real local take-home and modeled
 * entry costs, which the note states plainly.
 */
function BreakInLeaderboardSection({ board }: { board: BreakInLeaderboard }) {
  return (
    /* ONE CARD PER BOARD. The heading trio, the ranked rows and the note
       were three loose objects on the page separated by a border-t rule,
       and only the middle one had a surface. AtlasFrame paints a fixed
       photograph behind every route with no centre plate, so the eyebrow,
       the h2 and the note were dark type straight on a picture while the
       rows sat on an opaque hand-rolled plate. The board is one card now,
       which is both the legibility fix and the divider: cards separate
       themselves, so the rule goes. */
    <section className="atlas-card p-5 md:p-6">
      <SectionEyebrow size="md" className="mb-2">
        {board.eyebrow}
      </SectionEyebrow>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance text-ink-900 md:text-3xl">
        {board.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
        {board.intro}
      </p>

      {/* The inner hand-rolled plate is gone: the section above IS the
          card now, and an inline boxShadow beats the class anyway, so a
          second elevation here would have pinned this surface to a level
          nothing else on the site uses. */}
      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-end">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
            {board.valueCaption}
          </span>
        </div>
        {board.rows.map((row, i) => (
          <RankRow
            key={row.href}
            rank={i + 1}
            label={row.name}
            href={row.href}
            value={String(row.score)}
            texture={row.band}
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-cocoa-500">
        The break-in rating is one number from 0 to 100, higher meaning easier to
        break in and win: fast to earn back, quick to open, and room to stand out.
        Based on real local earnings and modeled entry costs. Directional.
      </p>
    </section>
  );
}

/**
 * One lens block: the labelled wrapper that introduces a way of looking at the
 * data (its eyebrow, title, and intro) and then renders the ranked pair beneath
 * it. Every lens block shares this shape so the four reads sit as equals and the
 * filter can show or hide any one of them as a single unit. The leading
 * `border-t` is dropped (`first:border-t-0`) so a block reads cleanly whether it
 * is shown alone under the filter or stacked with the others under "All".
 */
function LensBlock({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-10 first:pt-0">
      {/* The lens heading gets its own card for the same reason the boards
          below do: it was bare type on the photograph. The border-t rule
          goes with it, since a stack of cards already separates itself. */}
      <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
        <SectionEyebrow size="md" className="mb-3">
          {eyebrow}
        </SectionEyebrow>
        <h2 className="max-w-3xl text-balance font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-cocoa-700 md:text-lg">
          {intro}
        </p>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

export default async function ExtremesPage() {
  const { leaderboards, breakInBoards, densityBoards, startupBoards } =
    await loadExtremes();

  // The hub is data-gated like every other surface: if too few leaderboards
  // resolve cleanly (a wide Supabase outage), render the hero and an honest
  // note rather than a thin or broken page. In normal operation all of them
  // resolve.
  const hasEnough = leaderboards.length >= MIN_BOARDS;
  // The break-in pair is shown only when BOTH the easiest and hardest boards
  // resolved cleanly, so the headline-rating block never appears one-sided.
  const hasBreakIn = breakInBoards.length >= 2;
  // The density pair is shown only when BOTH the crowded and still-room boards
  // resolved cleanly, so the "room to enter" block never appears one-sided.
  const hasDensity = densityBoards.length >= 2;
  // The startup pair is shown only when BOTH the cheapest and highest-barrier
  // boards resolved cleanly, so the "cost to open" block never appears
  // one-sided either.
  const hasStartup = startupBoards.length >= 2;

  // Assemble the lens blocks in the founder's reading order, COST-TO-OPEN
  // first, then take-home, break-in, and crowding. Each lens is included only
  // when it resolved (the same self-omit the blocks already carried), so the
  // filter offers exactly the lenses a reader can reach. The blocks are
  // server-rendered here and handed to the client filter as children, so the
  // page degrades to every block visible when JavaScript does not run.
  const lenses: LensEntry[] = [];
  if (hasStartup) {
  /* THE CATALOG LENS, added 2026-08-09, and it is the destination the home page
     plates were missing. Those plates state "39 of 194 countries" and, until
     this, linked to /countries: a list of all 194, which cannot show the claim.
     A headline with no article under it.

     It belongs here rather than on a new route because this page already IS the
     interesting-subsets surface. Its other lenses are "the cheapest businesses
     to start" and "where a restaurant barely clears"; a collection is the same
     kind of object and splitting them across two pages would split one idea.

     It leads the page deliberately. The existing lenses answer "which trade";
     these four answer "which place, and is it worth being there at all", which
     is the wider question and the one the home page just asked. */
  lenses.push({
    key: "catalog",
    label: "Collections",
    node: (
      <LensBlock
        eyebrow="What the atlas can see"
        title="Four collections"
        intro="Each of these is a claim about the world rather than a filter, and each states the rule that decides membership so you can disagree with it. Every figure is computed from the same measurements the rest of the atlas runs on."
      >
        <CatalogCollections />
      </LensBlock>
    ),
  });

    // Startup-capital lens: the "cost to open" read, ranked (cheapest to start /
    // highest barrier). Leads now: the entry figure is the first thing a reader
    // weighs, ahead of the running economics.
    lenses.push({
      key: "cost",
      label: "Cost to open",
      node: (
        <LensBlock
          eyebrow="What it costs to get in"
          title="Cost to open"
          intro="Before the first customer there is a bill: the fit-out, the kit, the deposits, the working capital to open the doors. It separates the trades you can start from a laptop from the ones that need a builder, and it shifts with how expensive the place is to set up in."
        >
          {startupBoards.map((board) => (
            <StartupLeaderboardSection key={board.key} board={board} />
          ))}
        </LensBlock>
      ),
    });
  }
  if (hasEnough) {
    // Take-home lens: the running economics, ranked. The take-home boards each
    // name their own catch, so this intro stays a short bridge.
    lenses.push({
      key: "take-home",
      label: "Take-home",
      node: (
        <LensBlock
          eyebrow="What an owner keeps"
          title="Owner take-home"
          intro="The running economics, ranked: where the same trade leaves its owner a comfortable living, and where rent, wages, and tax take nearly all of it. Each board names the catch, and every row carries the share of revenue that survives."
        >
          {leaderboards.map((board) => (
            <LeaderboardSection key={board.key} board={board} />
          ))}
        </LensBlock>
      ),
    });
  }
  if (hasBreakIn) {
    // Break-in lens: the single headline score made browsable (easiest to break
    // into / hardest), the one number the cell mastheads carry.
    lenses.push({
      key: "break-in",
      label: "Break-in",
      node: (
        <LensBlock
          eyebrow="How hard it is to break in"
          title="The break-in rating"
          intro="One number for the whole question a would-be owner actually asks: how easy is it to break in and win here? It rewards a fast payback above all, then a quick open and room to stand out. Here is where that door swings widest, and where it barely opens at all."
        >
          {breakInBoards.map((board) => (
            <BreakInLeaderboardSection key={board.key} board={board} />
          ))}
        </LensBlock>
      ),
    });
  }
  if (hasDensity) {
    // Crowding lens: the "room to enter" read (most crowded / still room), the
    // density sibling of the take-home boards.
    lenses.push({
      key: "crowding",
      label: "Crowding",
      node: (
        <LensBlock
          eyebrow="How much room is left"
          title="Competition density"
          intro="The other half of the decision is not what you keep, but who is already there. Density counts the operators per resident in a place, so you can see at a glance where a trade is thick on the ground and where there is still room to walk in."
        >
          {densityBoards.map((board) => (
            <DensityLeaderboardSection key={board.key} board={board} />
          ))}
        </LensBlock>
      ),
    });
  }

  return (
    <div className="pb-16">
      {/* Warm editorial hero. The eyebrow + a large serif H1 + one inviting
         paragraph establish the hub's warmer register: a curious tour of the
         data's edges, not a benchmark readout. The figures below stay exact. */}
      <header className="pt-8 pb-10 md:pt-10 md:pb-12">
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
        <SectionEyebrow size="md" className="mb-3">
          A field guide to the edges
        </SectionEyebrow>
        <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
          The extremes
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-cocoa-700 md:text-lg">
          Every small business has a best place and a worst place to run it, and
          the gap between them is wider than you would guess. These are the edges:
          where it costs the least to get in, where an owner keeps a surprising
          amount, and where the very same business barely clears once the rent,
          the staff, and the tax are paid. Browse them. Each line is a real
          number, and every name opens the full read for that place.
        </p>
        </div>
      </header>

      {/* The lens blocks, led by cost-to-open, behind a client-side filter. The
         filter is presentational only: the server renders every resolved block
         and the client component shows the chosen lens or all of them. With no
         JavaScript the chips are inert and every block stays visible. */}
      {lenses.length > 0 ? (
        <LensFilter lenses={lenses} />
      ) : (
        <p className="atlas-card px-5 py-6 md:px-7 md:py-7 max-w-2xl text-sm leading-relaxed text-cocoa-700">
          The leaderboards are refreshing right now. Check back in a moment, or
          browse the activities and cities in the meantime.
        </p>
      )}

      {/* Closing note: the one editorial line that ties the hub together and
         re-states the discipline, in the warmer voice. */}
      {hasEnough ? (
        <p className="atlas-card mt-12 px-5 py-6 md:px-7 md:py-7 max-w-2xl text-sm leading-relaxed text-cocoa-700">
          The lesson the edges keep teaching: revenue is the easy half of the
          story. What an owner actually keeps depends on where the business runs,
          and the same trade can be a comfortable living in one state and a
          knife-edge in another. That is the whole point of looking place by
          place.
        </p>
      ) : null}
    </div>
  );
}
