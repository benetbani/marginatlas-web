/**
 * Editorial beats - the opinion layer (design-system 9.3, content-map).
 *
 * The short, human, found-nowhere-else reads that make an Atlas page worth
 * staying on: who it is really for, the hard truth, what locals know, the
 * contrarian angle, the myths. They all share ONE card grammar (BeatCard) so
 * the page reads as one hand, not a patchwork, and each beat self-omits when it
 * has nothing to say. A spot illustration appears on the signature beats only
 * (restraint: brand moments, not decoration on every section).
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { AtlasSpot } from "@/components/brand/spots";
import type { AtlasSpotId } from "@/components/brand/spots";

function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}
function clean(items: Array<string | null | undefined> | null | undefined): string[] {
  return (items ?? []).filter(hasText) as string[];
}

/* ------------------------------------------------------------------ */
/* The shared shell: one card grammar for every editorial beat.        */
/* ------------------------------------------------------------------ */

export type BeatCardProps = {
  eyebrow: string;
  heading?: string | null;
  /** A spot illustration, hosted top-right. Use sparingly. */
  spot?: AtlasSpotId | null;
  /**
   * Lead/feature surface: a slightly stronger ink hairline (R7 engraved-card
   * reskin) marks the section a page should read first, instead of elevation.
   * Leave false for the resting beats.
   */
  feature?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function BeatCard({
  eyebrow,
  heading,
  spot,
  feature = false,
  id,
  className,
  children,
}: BeatCardProps) {
  return (
    <section
      id={id}
      aria-label={heading || eyebrow}
      className={[
        // Engraved-card reskin (R7 A.5): flat hairline cards, no soft shadow, to
        // match the engraved scorecard surface. The feature/lead card keeps its
        // emphasis via a slightly stronger ink hairline (close to --hairline-strong)
        // instead of elevation, so the working pages read engraved, not SaaS.
        "rounded-lg border bg-cream-50",
        feature ? "border-ink-900/15" : "border-parchment",
        "px-5 py-5 md:px-7 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow>
          {hasText(heading) ? (
            <h2 className="font-display text-xl font-medium tracking-tight text-balance text-ink-900 md:text-2xl">
              {heading}
            </h2>
          ) : null}
          <div className={hasText(heading) ? "mt-3" : "mt-2"}>{children}</div>
        </div>
        {spot ? (
          <div className="hidden shrink-0 text-cocoa-500/80 sm:block">
            <AtlasSpot id={spot} width={120} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* GutCheck - three honest questions before you commit.                */
/* ------------------------------------------------------------------ */

export function GutCheck({
  questions,
  eyebrow = "Gut check",
  heading = "Three questions before you sign a lease",
  id,
}: {
  questions: Array<string | null | undefined>;
  eyebrow?: string;
  heading?: string;
  id?: string;
}) {
  const qs = clean(questions);
  if (qs.length === 0) return null;
  return (
    <BeatCard eyebrow={eyebrow} heading={heading} id={id}>
      <ul className="space-y-2.5">
        {qs.map((q, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-900 md:text-base">
            <span
              aria-hidden="true"
              className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-atlas-300 text-[11px] font-semibold tabular-nums text-atlas-700"
            >
              {i + 1}
            </span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* RealityCheck - the hard truth the headline number hides.            */
/* ------------------------------------------------------------------ */

export function RealityCheck({
  truth,
  body,
  eyebrow = "Reality check",
  id,
}: {
  truth?: string | null;
  body?: string | null;
  eyebrow?: string;
  id?: string;
}) {
  if (!hasText(truth) && !hasText(body)) return null;
  return (
    <BeatCard eyebrow={eyebrow} spot="reality-check" id={id}>
      {hasText(truth) ? (
        <p className="font-display text-lg font-medium leading-snug text-balance text-ink-900 md:text-xl">
          {truth}
        </p>
      ) : null}
      {hasText(body) ? (
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-graphite md:text-base">
          {body}
        </p>
      ) : null}
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* RightForWrongFor - who this suits, and who it does not.             */
/* ------------------------------------------------------------------ */

export function RightForWrongFor({
  rightFor,
  wrongFor,
  eyebrow = "Right for, wrong for",
  heading = "Who this business suits",
  id,
}: {
  rightFor: Array<string | null | undefined>;
  wrongFor: Array<string | null | undefined>;
  eyebrow?: string;
  heading?: string;
  id?: string;
}) {
  const right = clean(rightFor);
  const wrong = clean(wrongFor);
  if (right.length === 0 && wrong.length === 0) return null;
  return (
    <BeatCard eyebrow={eyebrow} heading={heading} id={id}>
      <div className="grid gap-5 sm:grid-cols-2">
        {right.length > 0 ? (
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-moss-700">
              A good fit if
            </div>
            <ul className="space-y-2">
              {right.map((r, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-cocoa-700">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-500" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {wrong.length > 0 ? (
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-atlas-700">
              Think twice if
            </div>
            <ul className="space-y-2">
              {wrong.map((w, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-cocoa-700">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-atlas-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* WhatLocalsKnow - the things you only learn on the ground.           */
/* ------------------------------------------------------------------ */

export function WhatLocalsKnow({
  notes,
  eyebrow = "What locals know",
  heading,
  id,
}: {
  notes: Array<string | null | undefined>;
  eyebrow?: string;
  heading?: string | null;
  id?: string;
}) {
  const items = clean(notes);
  if (items.length === 0) return null;
  return (
    <BeatCard eyebrow={eyebrow} heading={heading} spot="what-locals-know" id={id}>
      <ul className="space-y-3">
        {items.map((n, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-900 md:text-base">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cocoa-500" />
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* ContrarianInsight - the take that runs against the grain.           */
/* ------------------------------------------------------------------ */

export function ContrarianInsight({
  insight,
  body,
  eyebrow = "Against the grain",
  id,
}: {
  insight?: string | null;
  body?: string | null;
  eyebrow?: string;
  id?: string;
}) {
  if (!hasText(insight) && !hasText(body)) return null;
  return (
    <BeatCard eyebrow={eyebrow} id={id}>
      {hasText(insight) ? (
        <p className="border-l-2 border-atlas-300 pl-4 font-display text-lg font-medium leading-snug text-balance text-ink-900 md:text-xl">
          {insight}
        </p>
      ) : null}
      {hasText(body) ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite md:text-base">
          {body}
        </p>
      ) : null}
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* MythVsReality - the assumptions worth correcting.                   */
/* ------------------------------------------------------------------ */

export type MythPair = { myth?: string | null; reality?: string | null };

export function MythVsReality({
  pairs,
  eyebrow = "Myth versus reality",
  heading = "What people get wrong",
  id,
}: {
  pairs: MythPair[];
  eyebrow?: string;
  heading?: string;
  id?: string;
}) {
  const rows = (pairs ?? []).filter(
    (p) => hasText(p.myth) && hasText(p.reality),
  ) as Array<{ myth: string; reality: string }>;
  if (rows.length === 0) return null;
  return (
    <BeatCard eyebrow={eyebrow} heading={heading} id={id}>
      <ul className="divide-y divide-parchment border-y border-parchment">
        {rows.map((p, i) => (
          <li key={i} className="grid gap-1 py-3 sm:grid-cols-2 sm:gap-6">
            <p className="text-sm leading-relaxed text-cocoa-700">
              <span className="mr-1.5 text-[11px] font-semibold uppercase tracking-wider text-cocoa-700">
                Myth
              </span>
              {p.myth}
            </p>
            <p className="text-sm leading-relaxed text-ink-900">
              <span className="mr-1.5 text-[11px] font-semibold uppercase tracking-wider text-moss-700">
                Really
              </span>
              {p.reality}
            </p>
          </li>
        ))}
      </ul>
    </BeatCard>
  );
}
