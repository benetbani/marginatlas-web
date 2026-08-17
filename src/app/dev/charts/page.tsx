/**
 * /dev/charts - the Phase 0 viz-primitive showcase (R7 graphical reformation).
 *
 * Internal, noindex. Renders each reusable primitive in representative states on
 * real-shaped sample content, so the reformation can SEE them before they land on
 * the live pages. Not linked from the public nav.
 */
import * as React from "react";
import type { Metadata } from "next";
import {
  LikeForLikeBars,
  ThresholdGauge,
  TimelineRibbon,
  SeverityGlyph,
  TierBar,
  type SeverityLevel,
} from "@/components/kit";
import { fmtUsdCompact } from "@/components/kit/charts";

export const metadata: Metadata = {
  title: "Chart primitives (internal)",
  robots: { index: false, follow: false },
};

function ShowCard({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-parchment bg-white px-6 py-6 md:px-8 md:py-7">
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700">
        {eyebrow}
      </div>
      <h2 className="mb-5 font-display text-xl text-ink-900 md:text-2xl">{heading}</h2>
      {children}
    </section>
  );
}

const RISKS: { level: SeverityLevel; title: string; note: string }[] = [
  {
    level: "serious",
    title: "Rent resets on renewal",
    note: "A lease step-up can erase the margin overnight; plan for it.",
  },
  {
    level: "watch",
    title: "Staff turnover",
    note: "The wage floor keeps rising and good people cost more than the floor.",
  },
  {
    level: "rare",
    title: "Supplier shock",
    note: "A key input spikes. It rarely happens, but when it does it bites.",
  },
];

export default function ChartsShowcasePage() {
  return (
    <div className="space-y-8 py-10">
      <header className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700">
          R7 / Phase 0
        </div>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink-900">
          Chart primitives
        </h1>
        <p className="mt-3 text-base leading-relaxed text-cocoa-700">
          The five reusable shapes the section reformation composes to retire
          text-wall sections. Each carries a different character, tokens only,
          nullable-in / silence-out.
        </p>
      </header>

      <ShowCard eyebrow="LikeForLikeBars" heading="The same business nearby (subject + peers)">
        <LikeForLikeBars
          label="Typical revenue a year"
          items={[
            { label: "London", value: 720000, subject: true, href: "#" },
            { label: "Manchester", value: 410000, href: "#" },
            { label: "Birmingham", value: 380000, href: "#" },
            { label: "Bristol", value: 360000, href: "#" },
            { label: "Leeds", value: 340000, href: "#" },
          ]}
          format={fmtUsdCompact}
          caption="Like for like: the same trade at a comparable scale. London is the place you are reading."
        />
      </ShowCard>

      <ShowCard eyebrow="LikeForLikeBars (no subject, compact)" heading="Trades ranked by what the owner keeps">
        <LikeForLikeBars
          size="compact"
          items={[
            { label: "Dental practice", value: 138000 },
            { label: "Law office", value: 96000 },
            { label: "Pharmacy", value: 72000 },
            { label: "Cafe", value: 31000 },
            { label: "Bookshop", value: 18000 },
          ]}
          format={fmtUsdCompact}
        />
      </ShowCard>

      <ShowCard eyebrow="ThresholdGauge" heading="Break-even: when the lights stay on">
        <ThresholdGauge
          value={85}
          max={150}
          markerLabel="85 sales a day"
          belowLabel="Losing money"
          aboveLabel="Covering costs"
          caption="Below the line the day runs at a loss; above it, the business covers its costs."
        />
      </ShowCard>

      <ShowCard eyebrow="TimelineRibbon" heading="Your realistic first year">
        <TimelineRibbon
          milestones={[
            { at: "Mo 1-2", label: "Fit-out and ramp", note: "Cash goes out, little comes in." },
            { at: "Mo 3-5", label: "Find the rhythm", note: "Regulars start to repeat." },
            { at: "Mo 6", label: "Break-even", note: "Covering costs most weeks.", emphasis: true },
            { at: "Mo 9+", label: "Steady", note: "A normal month looks normal." },
          ]}
          caption="A modeled path, not a promise. Most owners reach break-even later than they hope."
        />
      </ShowCard>

      <ShowCard eyebrow="SeverityGlyph" heading="What to watch (severity meter per row)">
        <ul className="divide-y divide-parchment">
          {RISKS.map((r) => (
            <li key={r.title} className="flex items-start gap-3 py-3">
              <span className="mt-0.5">
                <SeverityGlyph level={r.level} />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink-900">{r.title}</div>
                <div className="text-sm leading-relaxed text-cocoa-700">{r.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </ShowCard>

      <ShowCard eyebrow="TierBar" heading="A value's position in its band (the dense-tile whisper)">
        <div className="grid gap-4 sm:grid-cols-2">
          <TierBar
            label="Average salary"
            value={58000}
            min={20000}
            max={90000}
            tone="good"
            format={fmtUsdCompact}
            tier="good"
          />
          <TierBar
            label="Cost of living index"
            value={78}
            min={40}
            max={120}
            tone="caution"
            format={(n) => `${Math.round(n)}`}
          />
          <TierBar
            label="Metro GDP"
            value={540}
            min={0}
            max={1000}
            format={(n) => `$${Math.round(n)}B`}
            tier="modeled"
          />
          <TierBar
            label="Coverage depth"
            value={12}
            min={0}
            max={40}
            format={(n) => `${Math.round(n)} cities`}
          />
        </div>
      </ShowCard>
    </div>
  );
}
