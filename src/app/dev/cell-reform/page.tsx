/**
 * /dev/cell-reform - P1 prototype of the reformed London Restaurants cell page
 * (Reformation Phase 14). Internal, noindex. Static London data, the real
 * Foundation (Band / Lanes / SectionIndex + the chart kit + the tokens + the
 * type), composed into the six narrative bands of the Brand Design Constitution.
 *
 * This is the static-data prototype the founder reviews before the real route is
 * wired. The locked 18 sections are all present, in order, folded into the six
 * bands: Answer, Verdict, Economics, Operating Reality, Comparison, Trust.
 */
import * as React from "react";
import type { Metadata } from "next";
import {
  Band,
  Lanes,
  SectionIndex,
  RangeStrip,
  HonestTakeBox,
  PlainTerms,
  MoneyGoesBreakdown,
  BreakEvenLine,
  WagesByRole,
  Seasonality,
  RealisticFirstYear,
  SameBusinessNearby,
  RiskList,
  ScoreBand,
} from "@/components/kit";

export const metadata: Metadata = {
  title: "Cell reform prototype (internal)",
  robots: { index: false, follow: false },
};

const usd = (n: number): string =>
  !Number.isFinite(n)
    ? "–"
    : Math.abs(n) >= 1e6
      ? `$${(n / 1e6).toFixed(1)}M`
      : Math.abs(n) >= 1e3
        ? `$${Math.round(n / 1e3)}K`
        : `$${Math.round(n)}`;

const INDEX = [
  { id: "answer", label: "The answer" },
  { id: "verdict", label: "The verdict" },
  { id: "economics", label: "The economics" },
  { id: "operating", label: "Operating reality" },
  { id: "comparison", label: "In comparison" },
  { id: "trust", label: "Trust" },
];

function SourceCue({ tier, note }: { tier: string; note: string }) {
  return (
    <div className="hidden xl:block">
      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
        <span className="h-1.5 w-1.5 rounded-full bg-atlas-500" />
        {tier}
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-cocoa-700">{note}</p>
    </div>
  );
}

export default function CellReformPrototype() {
  return (
    <div className="mx-auto max-w-[1180px] px-7 pb-32">
      {/* ============ BAND 1 - THE ANSWER ============ */}
      <Band id="answer" first>
        <Lanes
          left={<SectionIndex items={INDEX} />}
          center={
            <div>
              <div className="flex items-start justify-between gap-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-atlas-700">
                  Food &amp; drink &middot; London &middot; United Kingdom
                </span>
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-cocoa-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-atlas-500" /> Regional benchmark
                </span>
              </div>
              <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.05] tracking-tight text-ink-900">
                How much does a restaurant make in London?
              </h1>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-800">
                A typical London restaurant turns over about{" "}
                <strong className="font-semibold text-ink-900">$720K</strong> a year and keeps
                roughly <strong className="font-semibold text-moss-700">5%</strong> of it. The owner
                takes home what is left after the stock, the wages, the rent and tax.
              </p>
              <div className="mt-7">
                <RangeStrip
                  p10={360000}
                  p50={720000}
                  p90={1300000}
                  format={usd}
                  caption="Most London restaurants cluster in the middle; the tails are real and wider than people assume."
                />
              </div>
            </div>
          }
          right={
            <div className="rounded-xl border border-cream-300 bg-cream-50 p-5 shadow-subtle">
              <div className="text-[11px] font-bold uppercase tracking-wider text-cocoa-500">
                Make it yours
              </div>
              <div className="mt-3 font-display text-3xl font-medium tabular-nums text-ink-900">
                $720K
              </div>
              <div className="relative mt-3 h-1.5 rounded-full bg-cream-300">
                <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-atlas-300" />
                <span className="absolute -top-[5px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-cream-50 bg-atlas-500" />
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-cocoa-700">
                Slide your revenue; take-home tracks to about{" "}
                <strong className="text-moss-700">$48K</strong>.
              </p>
              <dl className="mt-4 space-y-2 border-t border-cream-300 pt-3 text-[13px]">
                {[
                  ["Employees", "4"],
                  ["Median wage", "$34K"],
                  ["Net margin", "5%"],
                  ["Owner take-home", "$48K"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between">
                    <dt className="text-cocoa-700">{k}</dt>
                    <dd className="font-display tabular-nums text-ink-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          }
        />
      </Band>

      {/* ============ BAND 2 - THE VERDICT ============ */}
      <Band id="verdict" label="The verdict">
        <Lanes
          left={<SourceCue tier="Honest take" note="The structural read behind the number, before the detail." />}
          center={
            <HonestTakeBox
              verdict="The headline revenue is real, but a London restaurant is a wages-and-rent business, not a high-margin one."
              points={[
                "Rent takes a bigger bite here than almost anywhere else in the country.",
                "Skilled staff are hard to keep and the wage floor keeps rising.",
                "Pricing power is real: the right room can charge for it.",
              ]}
              gauge={
                <ScoreBand
                  eyebrow="Break-in"
                  label="How easy to get started"
                  score={42}
                  bands={[
                    { upTo: 39, word: "Hard", tone: "caution" },
                    { upTo: 66, word: "Doable", tone: "neutral" },
                    { upTo: 100, word: "Easier", tone: "positive" },
                  ]}
                  hint="Higher is easier. It weighs the cost to open, the competition, and how long until a name carries the room."
                />
              }
            >
              A typical London restaurant brings in around $720K a year. After the stock, the staff,
              the rent and tax, a typical owner keeps about $48K of it.
            </HonestTakeBox>
          }
        />
        <div className="mt-6">
          <PlainTerms
            items={[
              { label: "Covers a day", value: "about 21" },
              { label: "Average spend each", value: "$107" },
              { label: "People on the payroll", value: "4" },
            ]}
          />
        </div>
      </Band>

      {/* ============ BAND 3 - THE ECONOMICS ============ */}
      <Band id="economics" label="The economics">
        <Lanes
          left={<SourceCue tier="The money" note="Where every $100 of sales goes, and the sliver the owner keeps." />}
          center={
            <MoneyGoesBreakdown
              heading="Every $100 of sales"
              lede="Where each $100 a typical firm takes in actually goes; the kept slice is what is left for the owner."
              items={[
                { label: "Cost of goods", perHundred: 30, hint: "Food, drink, packaging" },
                { label: "Payroll", perHundred: 34, hint: "Wages and on-costs" },
                { label: "Rent and premises", perHundred: 15 },
                { label: "Everything else", perHundred: 16 },
                { label: "What the owner keeps", perHundred: 5, kept: true },
              ]}
            />
          }
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-subtle">
            <div className="text-[11px] font-bold uppercase tracking-wider text-atlas-700">
              What moves the cost
            </div>
            <h3 className="mt-1 font-display text-xl font-medium text-ink-900">
              The three levers that set the margin
            </h3>
            <div className="mt-4 space-y-3">
              {[
                ["Labour", "34% of revenue", 100, "Managed daily: rota, hours, productivity."],
                ["Food & drink", "30% of revenue", 88, "Managed daily: menu, portioning, waste."],
                ["Rent", "15% of revenue", 44, "Fixed at the lease, the one you cannot move later."],
              ].map(([name, share, w, note]) => (
                <div key={name as string} className="flex items-center gap-3.5">
                  <div className="w-28 shrink-0">
                    <div className="text-sm font-medium text-ink-900">{name}</div>
                    <div className="text-[11px] text-cocoa-500">{share}</div>
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200">
                    <span className="block h-full rounded-full bg-chart-primary" style={{ width: `${w}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] italic text-cocoa-700">Two you pull every day; one you commit to once.</p>
          </div>
          <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-subtle">
            <div className="text-[11px] font-bold uppercase tracking-wider text-atlas-700">
              What the owner keeps
            </div>
            <div className="mt-3 font-display text-5xl font-medium tabular-nums text-ink-900">$48K</div>
            <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-cocoa-700">
              A year, for a typical single-site owner, after everything but their own time.
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-[10.5px] uppercase tracking-wide text-cocoa-500">
                <span>Lowest <strong className="font-display text-ink-900">$26K</strong></span>
                <span>Highest <strong className="font-display text-ink-900">$77K</strong></span>
              </div>
              <div className="relative mt-1.5 h-2 rounded-full bg-gradient-to-r from-moss-100 via-moss-300 to-moss-500">
                <span className="absolute -top-1 h-4 w-[3px] rounded bg-ink-900" style={{ left: "36%" }} />
              </div>
              <p className="mt-2 text-[12px] text-cocoa-700">You land mid-pack: most owners keep $26K to $77K.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <BreakEvenLine
            headline="You cover your costs at about 16 covers a day."
            detail="A typical day runs nearer 21 a day, so the gap above break-even is where the owner's pay comes from."
            value={16}
            typical={21}
            unit="covers a day"
          />
        </div>
      </Band>

      {/* ============ BAND 4 - THE OPERATING REALITY ============ */}
      <Band id="operating" label="The operating reality">
        <Lanes
          left={<SourceCue tier="What it takes" note="What you watch, what you pay, what it costs, and how the year runs." />}
          center={
            <div className="rounded-xl border border-cream-300 bg-cream-50 px-6 py-5 shadow-subtle">
              <RiskList
                title="What to watch"
                risks={[
                  { severity: "serious", title: "Rent resets on renewal", note: "A lease step-up at review can take a year's margin overnight." },
                  { severity: "watch", title: "Holding good staff", note: "Skilled people are hard to keep; the wage floor keeps climbing." },
                  { severity: "rare", title: "A supplier or energy shock", note: "Input prices can jump with little warning. Rare, but it bites here." },
                ]}
              />
            </div>
          }
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <WagesByRole
            roles={[
              { role: "Head chef", low: 44000, median: 60000, high: 78000 },
              { role: "Server", low: 26000, median: 31000, high: 38000 },
              { role: "Kitchen porter", low: 22000, median: 24000, high: 30000 },
            ]}
            format={usd}
            note="A guide to local pay before on-costs. The right people cost more than the floor, and keep the doors open."
          />
          <Seasonality
            monthly={[26, 34, 48, 58, 66, 92, 84, 80, 70, 64, 72, 88]}
            note="Summer and December carry it; a quiet January can undo a thin-margin autumn."
          />
        </div>
        <div className="mt-6">
          <RealisticFirstYear
            headline="Plan to run at a loss for the first months, and fund it before you open."
            bullets={[]}
            milestones={[
              { at: "Mo 1-3", label: "Fit-out and open", note: "The build cost lands before the first cover." },
              { at: "Mo 3-6", label: "The fragile months", note: "About 11 in 100 do not make it past here." },
              { at: "Mo 6-9", label: "Break-even", note: "Covering costs most weeks.", emphasis: true },
              { at: "Mo 9+", label: "A steady room", note: "The name and the regulars carry it." },
            ]}
          />
        </div>
      </Band>

      {/* ============ BAND 5 - THE COMPARISON FIELD ============ */}
      <Band id="comparison" label="In comparison">
        <SameBusinessNearby
          rows={[
            { name: "London", value: 720000 },
            { name: "Edinburgh", value: 590000 },
            { name: "Bristol", value: 562000 },
            { name: "Manchester", value: 504000 },
            { name: "Birmingham", value: 490000 },
          ]}
          format={usd}
          valueLabel="Typical revenue a year."
        />
        <div className="mt-6 rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-subtle">
          <div className="text-[11px] font-bold uppercase tracking-wider text-atlas-700">Versus the world</div>
          <h3 className="mt-1 font-display text-xl font-medium text-ink-900">How London compares</h3>
          <div className="mt-4 space-y-4">
            {[
              ["Typical revenue", "London $720K", 78, "World median $560K", 62],
              ["Profit kept", "London 5%", 42, "World median 9%", 74],
            ].map(([t, hl, hw, wl, ww]) => (
              <div key={t as string}>
                <div className="text-[13px] text-ink-900">{t}</div>
                <div className="mt-1.5 flex items-center gap-2 text-[11.5px] text-cocoa-700">
                  <span className="h-2 rounded bg-chart-primary" style={{ width: `${hw}%` }} /> {hl}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11.5px] text-cocoa-700">
                  <span className="h-2 rounded bg-cocoa-300" style={{ width: `${ww}%` }} /> {wl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Band>

      {/* ============ BAND 6 - THE TRUST LAYER ============ */}
      <Band id="trust" label="Trust">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-subtle">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cocoa-500">Operator voices</div>
            <p className="mt-3 text-[13.5px] italic leading-relaxed text-cocoa-700">
              Illustrative, typical of what London operators say (not attributed to a real named
              person): &ldquo;The rent review is the night I lose sleep over, not a quiet Tuesday.&rdquo;
            </p>
            <span className="mt-3 inline-block rounded-full border border-cream-300 bg-cream-100 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-cocoa-700">
              Illustrative
            </span>
          </div>
          <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-subtle">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cocoa-500">Methodology</div>
            <h3 className="mt-1 font-display text-lg font-medium text-ink-900">How this cell is built</h3>
            <dl className="mt-3 space-y-2 text-[12.5px]">
              {[
                ["Coverage tier", "Regional benchmark"],
                ["Firms in scope", "~13,000"],
                ["Confidence", "B+"],
                ["Last updated", "June 2026"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-cream-200 pb-1.5">
                  <dt className="text-cocoa-700">{k}</dt>
                  <dd className="font-display text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-8 max-w-[60ch]">
          <p className="font-display text-lg leading-relaxed text-cocoa-700">
            A London restaurant is one of the hardest small businesses to run well, and one of the
            most rewarding to get right. The revenue is rarely the problem; the rent and the wages
            are. Hold those tight, find a room people return to, and the model works.
          </p>
        </div>
        <div className="mt-8 border-l-2 border-atlas-300 pl-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-atlas-700">One thing to remember</div>
          <p className="mt-2 max-w-[60ch] font-display text-2xl font-medium leading-snug text-ink-900">
            A London restaurant can pay its owner well, but only with the costs held tight. The
            revenue is never the question; the rent and the wages are.
          </p>
        </div>
      </Band>
    </div>
  );
}
