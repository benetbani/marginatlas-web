/**
 * AtlasLedger , the frontispiece band. What this atlas holds, and where it is thin.
 *
 * THE GAP IT FILLS. The founder's note on the homepage was that it "doesn't
 * show the vision of the site, what it represents, its long term vision". Every
 * premium reference solves that with a standard rather than a slogan: a rental
 * marketplace says what share of homes it rejects, an airline states the size
 * of its network. The claim is a figure, and the figure is checkable.
 *
 * WHY IT IS NOT FOUR CARDS. A stats strip was removed from this page before,
 * and the reason was recorded: the tiles read "Worldwide", "Every SMB industry",
 * "Free", which is marketing copy formatted as numerical cards. The ratified
 * rule out of that is that cards which do not carry numbers must not look like
 * numerical cards. So this is the inverse and keeps the rule: nothing here is a
 * card, every figure is real, and each one links to the page that proves it.
 *
 * THE LAST LINE IS THE DESIGN. Two thirds of the benchmarks sit in five
 * countries. Printing that directly under the totals is the whole difference
 * between a boast and a map, and it is the site's own stated position: name the
 * gap, never fill it. A reader who learns the shape of the coverage from the
 * homepage does not have to discover it from a thin page later.
 *
 * Server component. Figures come from lib/home/atlas_ledger, derived from the
 * same sources the linked pages are built from, so a claim cannot drift from
 * its proof. No icons, no bars, no boxes.
 */
import Link from "next/link";

import { getAtlasLedger } from "@/lib/home/atlas_ledger";

/** One figure and the page that proves it. */
function Entry({
  figure,
  label,
  note,
  href,
  accent,
}: {
  figure: string;
  label: string;
  note: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block px-5 py-5 md:px-7 md:py-6 transition-colors hover:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40"
    >
      <div
        className={`font-display text-[2rem] md:text-[2.75rem] leading-none tracking-tight tabular-nums ${
          accent ? "text-atlas-700" : "text-ink-900"
        }`}
      >
        {figure}
      </div>
      <div className="mt-2 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-cocoa-700/70 transition-colors group-hover:text-atlas-700">
        {label}
      </div>
      <div className="mt-1 text-[11px] md:text-xs leading-snug text-cocoa-700/55">
        {note}
      </div>
    </Link>
  );
}

/** Serial commas, and "and" before the last, so five names read as a sentence. */
function nameList(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function AtlasLedger() {
  const l = getAtlasLedger();

  return (
    <section className="py-10 md:py-14">
      {/* IN A CARD NOW, because the frame stopped covering for it.
          The site frame used to paint .82 white across the content column, so a
          bare band sat on what was effectively a white page. The founder's
          correction: the centre "is also visible, but with some level of
          opacity... like we use the style of those cards, we put everything in
          those cards." The plate is down to .35 and the photograph reads
          through the middle, so anything not in a card is now sitting on it.

          Eight of the ten homepage bands already put their content in a card.
          This was one of the two that did not. */}
      <div className="rounded-xl border border-parchment bg-white px-5 py-6 md:px-8 md:py-7">
        <div className="border-t border-parchment pt-5 md:pt-6">
        {/* An h2, not a div, and it looks exactly the same.
            Every other band on this page contributes a heading to the document
            outline and this one did not, so the site's own coverage claim,
            which is the most checkable thing on the page, was structurally
            invisible: absent from the outline a screen reader navigates by and
            from the structure a crawler reads.

            Nothing moves. Tailwind's preflight resets heading font-size,
            weight and margin to inherit, and the classes here set all three
            explicitly, so the rendered result is identical to the div. */}
        {/* The typography gate caught this the moment the div became a
            heading, which is the gate working rather than the gate in the way:
            a display h2 at 10px would be real drift. This one is 10px because
            it labels a ruled manifest line whose figures carry the size. */}
        {/* typography-ok: band label promoted to h2 for the outline,
            deliberately not display-sized */}
        <h2 className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-cocoa-700/60">
          What the atlas holds
        </h2>

        {/* Two up on a phone, four across from md. The dividers are hairlines
            between columns rather than borders around them: a manifest line,
            not a row of tiles. */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 border-t border-parchment">
          <div className="border-b border-parchment md:border-b-0 md:border-r">
            <Entry
              figure={l.benchmarks.toLocaleString()}
              label="Benchmarks"
              note="each one measured, not filled in"
              href="/coverage"
              accent
            />
          </div>
          <div className="border-b border-l border-parchment md:border-b-0 md:border-r">
            <Entry
              figure={String(l.countriesMeasured)}
              label="Countries"
              note={`of ${l.countriesTotal} with a page`}
              href="/countries"
            />
          </div>
          <div className="border-parchment md:border-r">
            <Entry
              figure={String(l.cities)}
              label="Cities"
              note={`${l.districts.toLocaleString()} districts inside them`}
              href="/cities"
            />
          </div>
          <div className="border-l border-parchment md:border-l-0">
            <Entry
              figure={String(l.trades)}
              label="Trades"
              note="from restaurants to metal fabrication"
              href="/industries"
            />
          </div>
        </div>

        {/* The honest half, given the same weight as the totals rather than
            tucked under them as fine print. */}
        <p className="mt-5 md:mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-graphite">
          <span className="text-ink-900">
            {l.topFiveShare}% of those benchmarks sit in five countries:
          </span>{" "}
          {nameList(l.topFive)}. Everywhere else is thinner, and the page says
          which it is before you lean on a number rather than after.
        </p>
        </div>
      </div>
    </section>
  );
}
