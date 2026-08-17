/**
 * /_design — internal design-system catalog
 * =========================================
 *
 * The visual source of truth for every primitive shipped under the
 * 2026-05-27 design-system plan. If a primitive is not on this page,
 * it does not yet exist — engineers reach here before building
 * anything new.
 *
 * Gated by ?key=<ADMIN_KEY>. Same pattern as /admin/review, so the
 * catalog never leaks to public crawlers or competitors.
 *
 * Renders every primitive in every state side-by-side. Sections
 * mirror the design-system phases: tokens, state, core, motion,
 * existing ui/* shadcn primitives.
 *
 * Server component — no client interactivity needed.
 *
 * Design system Phase 5, 2026-05-27.
 */
import { notFound } from "next/navigation";
import { timingSafeEqualString } from "@/lib/rate_limit";
import {
  Compass,
  Hourglass,
  WarningCircle,
  Sparkle,
  Buildings,
  ChartLine,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Money } from "@/components/ui/money";
import { Percent } from "@/components/ui/percent";
import { Number as NumberDisplay } from "@/components/ui/number";
import { Pill } from "@/components/ui/pill";
import { InlineLink } from "@/components/ui/inline-link";
import { DisclosureIcon } from "@/components/ui/disclosure";
import { TierDot, type Tier } from "@/components/ui/tier-dot";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StatRow } from "@/components/ui/stat-row";
import { FadeIn } from "@/components/ui/motion/FadeIn";
import { SlideUp } from "@/components/ui/motion/SlideUp";
import { Stagger } from "@/components/ui/motion/Stagger";
import LoadingSkeleton from "@/components/LoadingSkeleton";

import { StatGrid, type StatRow as BoardStatRow } from "@/components/board/StatGrid";
import { DataSection, type BoardSection as BoardSectionData } from "@/components/board/DataSection";
import { ScoreStrip } from "@/components/board/ScoreStrip";
import { BoardHero } from "@/components/board/BoardHero";
import { FailureCards } from "@/components/board/FailureCards";
import { StatCard } from "@/components/board/StatCard";
import { RankRow } from "@/components/board/RankRow";
import { SpreadBar } from "@/components/board/charts/SpreadBar";
import { CostBar } from "@/components/board/charts/CostBar";
import { SurvivalCurve } from "@/components/board/charts/SurvivalCurve";
import { CrowdingGauge } from "@/components/board/charts/CrowdingGauge";
import { RentGauge } from "@/components/board/charts/RentGauge";
import {
  MISSING,
  fmtUSD,
  fmtPct,
  fmtInt,
  fmtNum,
  fmtUSDBillions,
  fmtMillions,
} from "@/components/board/format";

import { colors, fontFamily, fontSize, radius, elevation, duration, easing, z } from "@/lib/design-tokens";
import { AtlasIcon, ATLAS_ICONS } from "@/components/brand/icons";
import { AtlasPictogram, ATLAS_PICTOGRAMS } from "@/components/brand/pictograms";

// Wave 4 spine2 kit (the v2 visual system, scoped under .av2).
// The story itself lives in ./spine2-story.tsx and is ALSO mounted on the
// routable /dev/spine2 page, because _design is a Next private folder and
// never routes (dev_verification gotcha).
import { Spine2Story } from "./spine2-story";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Design system catalog | Margin Atlas",
  robots: { index: false, follow: false },
};

export default async function DesignCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const sp = await searchParams;
  const required = process.env.ADMIN_KEY;
  if (!required || !sp.key || !timingSafeEqualString(sp.key, required)) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <Header />
      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-16">
        <TokensSection />
        <ColorsSection />
        <TypographySection />
        <ButtonsSection />
        <PillsSection />
        <S1PrimitivesSection />
        <DataBoardSection />
        <FormFeedbackSection />
        <NumericSection />
        <LinksSection />
        <StateSection />
        <SkeletonsSection />
        <MotionSection />
        <BrandGlyphsSection />
        <ExistingPrimitivesSection />
        <Spine2Section />
      </main>
    </div>
  );
}

// =============================================================
// Layout helpers
// =============================================================

function Header() {
  return (
    <header className="bg-ink-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-xs uppercase tracking-[0.18em] text-atlas-200 font-semibold mb-3">
          Internal
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          Design system catalog
        </h1>
        <p className="mt-3 text-base text-paper-200 max-w-2xl leading-relaxed">
          Every primitive shipped under the 2026-05-27 design-system plan,
          rendered in every state. Read this before building any new
          component. If something is not here, it is not a primitive yet.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-parchment">
          <code className="bg-ink-800 px-2 py-1 rounded">docs/design-system/PLAN.md</code>
          <code className="bg-ink-800 px-2 py-1 rounded">docs/design-system/INVENTORY.md</code>
          <code className="bg-ink-800 px-2 py-1 rounded">docs/design-system/TOKENS.md</code>
          <code className="bg-ink-800 px-2 py-1 rounded">src/lib/design-tokens.ts</code>
        </div>
      </div>
    </header>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="border-b border-parchment pb-3">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-cocoa-700 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function SubSection({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h3 className="text-sm font-semibold text-ink-900 tracking-tight">{title}</h3>
        {caption && (
          <span className="text-[11px] text-cocoa-700/70 font-medium">{caption}</span>
        )}
      </div>
      <div className="rounded-lg border border-parchment bg-white p-6">{children}</div>
    </div>
  );
}

// =============================================================
// Sections
// =============================================================

function TokensSection() {
  return (
    <Section
      title="Tokens"
      description="The atomic values every primitive composes from. Source: src/lib/design-tokens.ts."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TokenCard label="Radius" entries={Object.entries(radius)} />
        <TokenCard label="Duration" entries={Object.entries(duration)} />
        <TokenCard label="Easing" entries={Object.entries(easing)} mono />
        <TokenCard label="Z-index" entries={Object.entries(z)} />
      </div>
      <SubSection title="Elevation (shadow scale)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(elevation).map(([name, val]) => (
            <div key={name} className="text-center">
              <div
                className="h-20 bg-white rounded-lg border border-parchment"
                style={{ boxShadow: val }}
              />
              <div className="text-xs font-semibold text-ink-900 mt-2">{name}</div>
              <div className="text-[10px] text-cocoa-700/70 mt-0.5">{val === "none" ? "(none)" : "shadow"}</div>
            </div>
          ))}
        </div>
      </SubSection>
    </Section>
  );
}

function TokenCard({
  label,
  entries,
  mono,
}: {
  label: string;
  entries: [string, string | number][];
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-parchment bg-white p-5">
      <h3 className="text-sm font-semibold text-ink-900 tracking-tight mb-3">{label}</h3>
      <dl className="space-y-1.5 text-sm">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <dt className="text-cocoa-700">{k}</dt>
            <dd className={mono ? "text-[10px] tabular-nums text-cocoa-700/80 truncate max-w-[60%]" : "tabular-nums text-ink-900"}>
              {String(v)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ColorsSection() {
  return (
    <Section
      title="Colors"
      description="The Atlas palette. Vermillion is the only loud color; everything else stays in the warm-neutral / cool-neutral family."
    >
      {/* "moss" left this list 2026-08-17, and note what it was doing here:
          this catalog is the page that TEACHES the palette, and it was
          advertising a banned green ramp as a member of it. `amber` was never
          listed, so the omission was already half made. Once the ramps go from
          design-tokens this read would be a type error rather than a silent
          blank, which is the good failure mode, but a catalog that names a
          colour is also an invitation to use it. */}
      {/* "teal" followed "moss" out of this list 2026-08-17, with the ramp. It
          measured h 149-150, which is green under a permitted name, and this is
          the page that TEACHES the palette: a catalog that names a colour is an
          invitation to use it. */}
      {(["atlas", "paper", "ink", "cocoa", "clay"] as const).map((family) => {
        const palette = colors[family];
        return (
          <SubSection key={family} title={family} caption={`colors.${family}`}>
            <div className="flex flex-wrap gap-3">
              {Object.entries(palette).map(([shade, hex]) => (
                <div key={shade} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border border-parchment"
                    style={{ background: hex }}
                  />
                  <div className="text-xs font-semibold text-ink-900 mt-1.5">{shade}</div>
                  <div className="text-[10px] text-cocoa-700/70 tabular-nums">{hex}</div>
                </div>
              ))}
            </div>
          </SubSection>
        );
      })}
    </Section>
  );
}

function TypographySection() {
  const scaleSamples: [keyof typeof fontSize, string][] = [
    ["xs", "Caption / fine print"],
    ["sm", "Secondary body / table cells"],
    ["base", "Body default"],
    ["lg", "Lead paragraphs"],
    ["xl", "Small headlines"],
    ["2xl", "Section headers"],
    ["3xl", "H2"],
    ["4xl", "H1 mobile"],
    ["5xl", "H1 desktop"],
  ];
  return (
    <Section
      title="Typography"
      description="Inter for body and numerals. Newsreader (display/serif) for H1–H3 and the single hero number per page."
    >
      <SubSection title="Font families">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-cocoa-700/70 mb-1.5">font-sans</div>
            <div className="text-2xl">The quick brown fox jumps over 1,234,567</div>
            <div className="text-[10px] text-cocoa-700/70 mt-1.5 truncate">{fontFamily.sans.join(", ")}</div>
          </div>
          <div>
            <div className="text-xs text-cocoa-700/70 mb-1.5">font-display / font-serif</div>
            <div className="font-display text-2xl">The quick brown fox jumps over 1,234,567</div>
            <div className="text-[10px] text-cocoa-700/70 mt-1.5 truncate">{fontFamily.display.join(", ")}</div>
          </div>
        </div>
      </SubSection>
      <SubSection title="Type scale">
        <div className="space-y-3">
          {scaleSamples.map(([size, useFor]) => (
            <div key={size} className="flex items-baseline justify-between gap-6 border-b border-parchment/60 pb-2 last:border-b-0">
              <span className={`text-${size}`}>{useFor}</span>
              <span className="text-[10px] text-cocoa-700/70 tabular-nums whitespace-nowrap">
                text-{size} ({(fontSize[size] as readonly [string, unknown])[0]})
              </span>
            </div>
          ))}
        </div>
      </SubSection>
    </Section>
  );
}

function ButtonsSection() {
  return (
    <Section
      title="Buttons"
      description="ui/button.tsx. Six variants, four sizes. Built on Radix Slot for asChild composition."
    >
      <SubSection title="Variants">
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </SubSection>
      <SubSection title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </SubSection>
      <SubSection title="States">
        <div className="flex flex-wrap gap-3">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button aria-busy>
            <Spinner size="sm" />
            Loading
          </Button>
        </div>
      </SubSection>
    </Section>
  );
}

function PillsSection() {
  const variants = ["neutral", "accent", "subtle", "success", "warning", "danger", "outline"] as const;
  return (
    <Section
      title="Pills"
      description="ui/pill.tsx, the canonical chip primitive. Seven semantic variants times three sizes."
    >
      <SubSection title="Variants (size md)">
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <Pill key={v} variant={v}>
              {v}
            </Pill>
          ))}
        </div>
      </SubSection>
      <SubSection title="Sizes (variant neutral)">
        <div className="flex flex-wrap items-center gap-2">
          <Pill size="sm">Small</Pill>
          <Pill size="md">Medium</Pill>
          <Pill size="lg">Large</Pill>
        </div>
      </SubSection>
    </Section>
  );
}

function S1PrimitivesSection() {
  const tiers: Tier[] = ["deep", "good", "starter", "modeled"];
  return (
    <Section
      title="Tier, eyebrow, stat row"
      description="2026-06-02 additions. One warm tier-color token plus three primitives that raise every surface at once. Source: design-tokens.ts tier scale, ui/tier-dot.tsx, ui/section-eyebrow.tsx, ui/stat-row.tsx."
    >
      <SubSection title="Tier color token" caption="colors.tier (saturation reads as confidence)">
        <div className="flex flex-wrap gap-3">
          {Object.entries(colors.tier).map(([name, hex]) => (
            <div key={name} className="text-center">
              <div className="w-16 h-16 rounded-lg border border-parchment" style={{ background: hex }} />
              <div className="text-xs font-semibold text-ink-900 mt-1.5">{name}</div>
              <div className="text-[10px] text-cocoa-700/70 tabular-nums">{hex}</div>
            </div>
          ))}
        </div>
      </SubSection>
      <SubSection title="TierDot" caption="ui/tier-dot.tsx">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {tiers.map((t) => (
              <TierDot key={t} tier={t} showLabel />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {tiers.map((t) => (
              <TierDot key={t} tier={t} size="lg" />
            ))}
          </div>
        </div>
      </SubSection>
      <SubSection title="SectionEyebrow" caption="ui/section-eyebrow.tsx">
        <div className="space-y-4">
          <div>
            <SectionEyebrow>Where the money goes</SectionEyebrow>
            <h3 className="font-display text-2xl font-semibold text-ink-900 mt-1">
              A typical restaurant in Munich
            </h3>
          </div>
          <div>
            <SectionEyebrow tone="muted" size="md">Coverage</SectionEyebrow>
            <h3 className="font-display text-2xl font-semibold text-ink-900 mt-1">
              Regional benchmark
            </h3>
          </div>
        </div>
      </SubSection>
      <SubSection title="StatRow" caption="ui/stat-row.tsx">
        <div className="max-w-sm">
          <StatRow label="Typical revenue" value="$420,000" />
          <StatRow label="People working" value="4" />
          <StatRow label="Wage per person" value="$52,000" />
          <StatRow label="Profit kept" value="12%" />
          <StatRow label="Multi-year trend" value={null} divider={false} />
        </div>
      </SubSection>
    </Section>
  );
}

function DataBoardSection() {
  // A full section: real, formatted values plus a chart above the grid.
  const fullSection: BoardSectionData = {
    key: "numbers",
    title: "The numbers",
    chart: (
      <SpreadBar p10={180_000} median={420_000} p90={1_250_000} />
    ),
    rows: [
      { label: "Typical revenue", value: fmtUSD(420_000), hint: "per firm" },
      { label: "Bottom tenth", value: fmtUSD(180_000) },
      { label: "Top tenth", value: fmtUSD(1_250_000) },
      { label: "Net margin", value: fmtPct(0.12, { fromFraction: true }) },
      { label: "People working", value: fmtInt(4) },
      { label: "Wage per person", value: fmtUSD(52_000) },
    ],
  };

  // An all-blank section: every value is null, so the grid shows dashes and the
  // section still renders. Proves "never filter, blanks are information".
  const blankSection: BoardSectionData = {
    key: "blank",
    title: "Survival (no data yet)",
    rows: [
      { label: "Year 1", value: null },
      { label: "Year 3", value: null },
      { label: "Year 5", value: fmtUSD(null) },
      { label: "Closures", value: MISSING },
    ],
  };

  // A long section: more than eight rows, so rows 9+ fold into ShowMore. Also
  // marked modeled to show the directional footnote.
  const longSection: BoardSectionData = {
    key: "market",
    title: "The market",
    modeled: true,
    rows: [
      { label: "Firms in market", value: fmtInt(12_400) },
      { label: "Per 100k people", value: fmtNum(38.5) },
      { label: "New per year", value: fmtInt(820) },
      { label: "Closed per year", value: fmtInt(640) },
      { label: "Net change", value: fmtInt(180) },
      { label: "Avg headcount", value: fmtInt(4) },
      { label: "Median age", value: "9 yrs" },
      { label: "Franchise share", value: fmtPct(18) },
      { label: "Single-site share", value: fmtPct(71) },
      { label: "VAT-registered", value: fmtPct(64) },
      { label: "Employer firms", value: fmtPct(52) },
    ],
  };

  // Score sample, shaped like the proprietary score set.
  const scoreParts = [
    { label: "Profit", score: 72 },
    { label: "Rent", score: 48 },
    { label: "Owner pay", score: 61 },
    { label: "Market", score: 33 },
  ];

  const failureCards = [
    {
      title: "Rent creep",
      body: "A lease renewal that resets rent above the margin can sink an otherwise fine operator inside a year.",
    },
    {
      title: "Thin pricing",
      body: "Competing on price in a crowded field leaves no room for a slow month. The first bad quarter ends it.",
    },
    {
      title: "Undercapitalised",
      body: "Opening without a runway for the first lean year means borrowing at the worst possible time.",
    },
    {
      title: "Owner burnout",
      body: "When the take barely clears a wage, the owner is working two jobs for one income. Few last five years.",
    },
  ];

  return (
    <Section
      title="Data board"
      description="The board primitive kit. Every data page composes only from these: format helpers, StatGrid, DataSection, ScoreStrip, BoardHero, the five charts, and FailureCards. Source: src/components/board/."
    >
      <SubSection title="format helpers" caption="board/format.ts (MISSING = plain hyphen)">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-3">
          <div className="text-cocoa-700">fmtUSD(1_250_000)</div>
          <div className="tabular-nums text-ink-900">{fmtUSD(1_250_000)}</div>
          <div className="text-cocoa-700">fmtUSD(340_000)</div>
          <div className="tabular-nums text-ink-900">{fmtUSD(340_000)}</div>
          <div className="text-cocoa-700">fmtUSD(12_000)</div>
          <div className="tabular-nums text-ink-900">{fmtUSD(12_000)}</div>
          <div className="text-cocoa-700">fmtPct(0.42, fromFraction)</div>
          <div className="tabular-nums text-ink-900">{fmtPct(0.42, { fromFraction: true })}</div>
          <div className="text-cocoa-700">fmtPct(42)</div>
          <div className="tabular-nums text-ink-900">{fmtPct(42)}</div>
          <div className="text-cocoa-700">fmtInt(1_234_567)</div>
          <div className="tabular-nums text-ink-900">{fmtInt(1_234_567)}</div>
          <div className="text-cocoa-700">fmtNum(3141.59)</div>
          <div className="tabular-nums text-ink-900">{fmtNum(3141.59)}</div>
          <div className="text-cocoa-700">fmtUSDBillions(680)</div>
          <div className="tabular-nums text-ink-900">{fmtUSDBillions(680)}</div>
          <div className="text-cocoa-700">fmtUSDBillions(2000)</div>
          <div className="tabular-nums text-ink-900">{fmtUSDBillions(2000)}</div>
          <div className="text-cocoa-700">fmtMillions(12.4)</div>
          <div className="tabular-nums text-ink-900">{fmtMillions(12.4)}</div>
          <div className="text-cocoa-700">fmtUSD(null)</div>
          <div className="tabular-nums text-cocoa-500">{fmtUSD(null)}</div>
          <div className="text-cocoa-700">fmtPct(NaN)</div>
          <div className="tabular-nums text-cocoa-500">{fmtPct(NaN)}</div>
        </div>
      </SubSection>

      <SubSection title="StatGrid" caption="board/StatGrid.tsx (renders every row, dashes for blanks)">
        <StatGrid
          rows={[
            { label: "Typical revenue", value: fmtUSD(420_000), hint: "per firm" },
            { label: "Net margin", value: fmtPct(0.12, { fromFraction: true }) },
            { label: "People working", value: fmtInt(4) },
            { label: "Wage per person", value: fmtUSD(52_000) },
            { label: "Multi-year trend", value: null },
            { label: "Closures", value: MISSING },
          ] satisfies BoardStatRow[]}
        />
      </SubSection>

      <SubSection title="DataSection (full, with chart)" caption="board/DataSection.tsx">
        <DataSection section={fullSection} />
      </SubSection>

      <SubSection title="DataSection (all blank)" caption="renders anyway, all dashes">
        <DataSection section={blankSection} />
      </SubSection>

      <SubSection title="DataSection (>8 rows + modeled)" caption="rows 9+ fold into ShowMore">
        <DataSection section={longSection} />
      </SubSection>

      <SubSection title="ScoreStrip (with parts)" caption="board/ScoreStrip.tsx (native details disclosure)">
        <ScoreStrip overall={58} parts={scoreParts} />
      </SubSection>

      <SubSection title="ScoreStrip (no parts, and null overall)">
        <div className="flex flex-wrap items-start gap-12">
          <ScoreStrip overall={81} parts={[]} />
          <ScoreStrip overall={null} parts={[]} />
        </div>
      </SubSection>

      <SubSection title="BoardHero" caption="board/BoardHero.tsx (plain h1 + score + switcher slot)">
        <BoardHero
          title="Independent coffee shops in Lisbon"
          score={{ overall: 58, parts: scoreParts }}
          switcher={
            <Pill variant="outline">Portugal · all sizes</Pill>
          }
        />
      </SubSection>

      <SubSection title="Charts" caption="board/charts/* (visx, compact, null-safe)">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-wide text-cocoa-500">SpreadBar</div>
            <SpreadBar p10={180_000} median={420_000} p90={1_250_000} />
          </div>
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-wide text-cocoa-500">CostBar</div>
            <CostBar
              shares={[
                { label: "Labour", pct: 32 },
                { label: "Rent", pct: 14 },
                { label: "Goods", pct: 28 },
                { label: "Other", pct: 14 },
                { label: "Profit", pct: 12 },
              ]}
            />
          </div>
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-wide text-cocoa-500">SurvivalCurve</div>
            <SurvivalCurve yr1={82} yr3={58} yr5={44} />
          </div>
          <div className="flex gap-8">
            <div className="w-32">
              <div className="mb-2 text-[11px] uppercase tracking-wide text-cocoa-500">CrowdingGauge</div>
              <CrowdingGauge value={71} />
            </div>
            <div className="w-32">
              <div className="mb-2 text-[11px] uppercase tracking-wide text-cocoa-500">RentGauge</div>
              <RentGauge value={38} />
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title="FailureCards" caption="board/FailureCards.tsx">
        <FailureCards cards={failureCards} />
      </SubSection>

      <SubSection
        title="StatCard"
        caption="board/StatCard.tsx (titled white card, label-left / value-right, null shows the dash)"
      >
        <div className="max-w-sm">
          <StatCard
            title="Tokyo"
            href="#"
            stats={[
              { label: "Visitors", hint: "per year", value: fmtMillions(11) },
              { label: "Average salary", value: fmtUSD(34_800) },
              { label: "Metro GDP", value: fmtUSDBillions(2000) },
            ]}
            footnote="Approximate and modeled to stay consistent across cities."
          />
        </div>
      </SubSection>

      <SubSection
        title="RankRow"
        caption="board/RankRow.tsx (rank badge, label, right-aligned value, optional texture)"
      >
        <div className="max-w-md">
          <RankRow rank={1} label="Nantes" href="#" value="12.5x visitors vs residents" texture="overwhelming" />
          <RankRow rank={2} label="Nice" href="#" value="12.5x visitors vs residents" texture="overwhelming" />
          <RankRow rank={3} label="Edinburgh" href="#" value="12.3x visitors vs residents" texture="overwhelming" />
        </div>
      </SubSection>
    </Section>
  );
}

function FormFeedbackSection() {
  return (
    <Section
      title="Badges"
      description="ui/badge.tsx, the older shadcn badge primitive. Pill replaces most use cases. Badge remains for cases that want shadcn's exact variant semantics."
    >
      <div className="rounded-lg border border-parchment bg-white p-6">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>
    </Section>
  );
}

function NumericSection() {
  return (
    <Section
      title="Numeric primitives"
      description="Money / Percent / Number. All tabular-nums by default so digits line up in tables and waterfalls."
    >
      <SubSection title="Money" caption="ui/money.tsx">
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-wide text-cocoa-700/70">
            <tr>
              <th className="pb-2 font-semibold">Use</th>
              <th className="pb-2 font-semibold">Visual</th>
              <th className="pb-2 font-semibold">SR label</th>
            </tr>
          </thead>
          <tbody className="text-ink-900">
            <tr className="border-t border-parchment/60"><td className="py-2 text-cocoa-700">Compact billions</td><td className="py-2"><Money value={3_200_000_000} /></td><td className="py-2 text-cocoa-700/70 text-xs">$3,200,000,000</td></tr>
            <tr className="border-t border-parchment/60"><td className="py-2 text-cocoa-700">Millions</td><td className="py-2"><Money value={2_450_000} /></td><td className="py-2 text-cocoa-700/70 text-xs">$2,450,000</td></tr>
            <tr className="border-t border-parchment/60"><td className="py-2 text-cocoa-700">Thousands</td><td className="py-2"><Money value={48_500} /></td><td className="py-2 text-cocoa-700/70 text-xs">$48,500</td></tr>
            <tr className="border-t border-parchment/60"><td className="py-2 text-cocoa-700">Small</td><td className="py-2"><Money value={324} /></td><td className="py-2 text-cocoa-700/70 text-xs">$324</td></tr>
            <tr className="border-t border-parchment/60"><td className="py-2 text-cocoa-700">Negative</td><td className="py-2"><Money value={-18_500} /></td><td className="py-2 text-cocoa-700/70 text-xs">-$18,500</td></tr>
            <tr className="border-t border-parchment/60"><td className="py-2 text-cocoa-700">Other currency</td><td className="py-2"><Money value={4_800_000} symbol="£" /></td><td className="py-2 text-cocoa-700/70 text-xs">£4,800,000</td></tr>
            <tr className="border-t border-parchment/60"><td className="py-2 text-cocoa-700">Null</td><td className="py-2"><Money value={null} /></td><td className="py-2 text-cocoa-700/70 text-xs">(falls back)</td></tr>
          </tbody>
        </table>
      </SubSection>
      <SubSection title="Percent" caption="ui/percent.tsx">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
          <div className="text-cocoa-700">Plain</div><div><Percent value={0.32} /></div>
          <div className="text-cocoa-700">Plain (negative)</div><div><Percent value={-0.18} /></div>
          <div className="text-cocoa-700">Signed</div><div><Percent value={0.32} mode="signed" /></div>
          <div className="text-cocoa-700">Signed-color positive</div><div><Percent value={0.32} mode="signed-color" /></div>
          <div className="text-cocoa-700">Signed-color negative</div><div><Percent value={-0.18} mode="signed-color" /></div>
          <div className="text-cocoa-700">Whole input</div><div><Percent value={42} asWhole /></div>
          <div className="text-cocoa-700">Two decimals</div><div><Percent value={0.0345} fractionDigits={2} /></div>
          <div className="text-cocoa-700">Null</div><div><Percent value={null} /></div>
        </div>
      </SubSection>
      <SubSection title="Number" caption="ui/number.tsx">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
          <div className="text-cocoa-700">Locale separators</div><div><NumberDisplay value={1_234_567} /></div>
          <div className="text-cocoa-700">With unit</div><div><NumberDisplay value={12_400} unit="firms" /></div>
          <div className="text-cocoa-700">Compact</div><div><NumberDisplay value={1_240_000} compact /></div>
          <div className="text-cocoa-700">Two decimals</div><div><NumberDisplay value={3.14159} fractionDigits={2} /></div>
          <div className="text-cocoa-700">Null</div><div><NumberDisplay value={null} /></div>
        </div>
      </SubSection>
    </Section>
  );
}

function LinksSection() {
  return (
    <Section
      title="Links + disclosure"
      description="Inline-link auto-detects external URLs and adds the outbound affordance. Disclosure wraps a Radix tooltip with the Atlas provenance pattern."
    >
      <SubSection title="InlineLink tones">
        <div className="space-y-2 text-base text-ink-900 leading-relaxed">
          <p>
            Accent tone for editorial copy:{" "}
            <InlineLink href="/coverage">see Atlas coverage</InlineLink>.
          </p>
          <p>
            Body tone with persistent underline:{" "}
            <InlineLink href="/methodology" tone="body">read the methodology</InlineLink>.
          </p>
          <p>
            Muted tone for footer / secondary:{" "}
            <InlineLink href="/about-data" tone="muted">about the data</InlineLink>.
          </p>
          <p>
            External URL (auto-detected):{" "}
            <InlineLink href="https://example.com">example.com</InlineLink>.
          </p>
        </div>
      </SubSection>
      <SubSection title="DisclosureIcon">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-cocoa-700">Revenue per firm</span>
          <DisclosureIcon content="Country median revenue per firm, USD, rolled forward to 2024 using country-specific CPI. Source covers national business statistics." />
          <span className="ml-6 text-cocoa-700">Hover or focus the info icon.</span>
        </div>
      </SubSection>
    </Section>
  );
}

function StateSection() {
  return (
    <Section
      title="State primitives"
      description="EmptyState (3 variants × 2 sizes), ErrorState (default + inline), Spinner."
    >
      <SubSection title="EmptyState (default)" caption="ui/empty-state.tsx">
        <EmptyState
          icon={<Compass size={28} weight="regular" />}
          title="No data for this combination yet"
          body="Atlas is still mapping coverage for this corner. We expect to publish numbers in the next quarterly refresh."
          suggestions={[
            { label: "Browse other industries", href: "/industries" },
            { label: "See nearby cities", href: "/cities" },
            { label: "Try a different country", href: "/world" },
          ]}
        />
      </SubSection>
      <SubSection title="EmptyState (hatched)">
        <EmptyState
          variant="hatched"
          icon={<WarningCircle size={28} weight="regular" />}
          /* useless-tile-ok: catalog sample, not user-facing copy */
          title="Intentionally not measured"
          body="This sector is dominated by multinational corporates, which is not what Atlas measures. SMB numbers here would mislead more than they would inform."
        />
      </SubSection>
      <SubSection title="EmptyState (compact, grid placeholder)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Country profile for Liechtenstein", "Industry profile for Geothermal", "City profile for Tórshavn"].map((d) => (
            <EmptyState
              key={d}
              size="compact"
              noLeftRule
              icon={<Hourglass size={16} weight="regular" />}
              title="Coming soon"
              body={d}
              className="opacity-70 rounded-2xl"
            />
          ))}
        </div>
      </SubSection>
      <SubSection title="ErrorState (default)" caption="ui/error-state.tsx">
        <ErrorState
          title="That fetch failed."
          body="The data layer returned an error. The rest of the page is still good; this one panel will recover when you retry."
          retryHref="?key=ADMIN_KEY"
        />
      </SubSection>
      <SubSection title="ErrorState (inline)">
        <ErrorState
          variant="inline"
          title="Sidebar widget unavailable"
          body="The peer-cells fetch timed out. The cell page itself is fine."
          retryHref="#"
        />
      </SubSection>
      <SubSection title="Spinner" caption="ui/spinner.tsx">
        <div className="flex items-center gap-6 text-cocoa-700">
          <div className="flex items-center gap-2">
            <Spinner size="sm" /> <span className="text-sm">sm</span>
          </div>
          <div className="flex items-center gap-2 text-atlas-700">
            <Spinner size="md" /> <span className="text-sm">md (tinted)</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="lg" /> <span className="text-sm">lg</span>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

function SkeletonsSection() {
  return (
    <Section
      title="Skeletons"
      description="ui/skeleton.tsx low-level shapes + LoadingSkeleton high-level page layouts."
    >
      <SubSection title="Low-level shapes">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-xs w-16 text-cocoa-700/70">text</span>
            <Skeleton variant="text" width="60%" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-16 text-cocoa-700/70">block</span>
            <Skeleton variant="block" height={64} className="flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-16 text-cocoa-700/70">circle</span>
            <Skeleton variant="circle" width={48} height={48} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-16 text-cocoa-700/70">chart</span>
            <Skeleton variant="chart" className="flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-16 text-cocoa-700/70">card</span>
            <Skeleton variant="card" width={240} />
          </div>
        </div>
      </SubSection>
      <SubSection title="LoadingSkeleton (card-grid layout)">
        <div className="bg-white -mx-6 px-0 py-2 rounded-md">
          <LoadingSkeleton variant="card-grid" />
        </div>
      </SubSection>
    </Section>
  );
}

function BrandGlyphsSection() {
  const iconGroups = [...new Set(ATLAS_ICONS.map((d) => d.group))];
  const pictoGroups = [...new Set(ATLAS_PICTOGRAMS.map((d) => d.group))];
  return (
    <Section
      title="Brand glyphs (ma- family)"
      description="The 40 UI icons and 64 trade/venue pictograms ported from the design export (Fable P1-05). One family: 32-unit grid, 1.6 stroke, currentColor ink, at most one vermillion accent per glyph. Decorative usage is aria-hidden; icon-only controls need aria-label."
    >
      <SubSection title="AtlasIcon (40, by group, at 24px)">
        <div className="space-y-6">
          {iconGroups.map((g) => (
            <div key={g}>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                {g.replace(/-/g, " ")}
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
                {ATLAS_ICONS.filter((d) => d.group === g).map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-col items-center gap-1.5 rounded-md border border-parchment bg-white px-2 py-3 text-center"
                  >
                    <AtlasIcon id={d.id} size={24} className="text-ink-700" />
                    <span className="text-[10px] leading-tight text-cocoa-700">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>
      <SubSection title="AtlasPictogram (64, by trade family, at 32px)">
        <div className="space-y-6">
          {pictoGroups.map((g) => (
            <div key={g}>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                {g.replace(/-/g, " ")}
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
                {ATLAS_PICTOGRAMS.filter((d) => d.group === g).map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-col items-center gap-1.5 rounded-md border border-parchment bg-white px-2 py-3 text-center"
                  >
                    <AtlasPictogram id={d.id} size={32} className="text-ink-700" />
                    <span className="text-[10px] leading-tight text-cocoa-700">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>
      <SubSection title="Sizes and states">
        <div className="flex flex-wrap items-end gap-6">
          {[16, 20, 24].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <AtlasIcon id="owner-keeps" size={s} className="text-ink-700" />
              <span className="text-[10px] text-cocoa-700">{s}px</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1">
            <AtlasIcon id="owner-keeps" size={24} className="text-ink-900" />
            <span className="text-[10px] text-cocoa-700">ink-900 (hover)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <AtlasIcon id="owner-keeps" size={24} className="text-atlas-700" />
            <span className="text-[10px] text-cocoa-700">atlas-700 (active)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <AtlasIcon
              id="search"
              size={24}
              className="text-ink-700"
              aria-label="Search"
            />
            <span className="text-[10px] text-cocoa-700">icon-only (labeled)</span>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

function MotionSection() {
  return (
    <Section
      title="Motion"
      description="Entrance primitives. Pure CSS animation (no framer-motion). Every primitive respects prefers-reduced-motion."
    >
      <SubSection title="FadeIn / SlideUp / Stagger" caption="reload to see them mount">
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["First", "Second", "Third", "Fourth", "Fifth", "Sixth"].map((s) => (
            <FadeIn key={s}>
              <div className="rounded-lg border border-parchment bg-paper-100 px-4 py-3 text-sm font-semibold text-ink-900">
                {s}
              </div>
            </FadeIn>
          ))}
        </Stagger>
        <div className="mt-6">
          <SlideUp>
            <div className="rounded-lg border border-parchment bg-paper-100 px-4 py-3 text-sm text-ink-900">
              SlideUp on mount (8px translate + fade, 300ms ease-out).
            </div>
          </SlideUp>
        </div>
      </SubSection>
    </Section>
  );
}

function ExistingPrimitivesSection() {
  return (
    <Section
      title="Existing primitives"
      description="Already-shipped shadcn-style primitives. Documented here so engineers see the full set before reaching for something new."
    >
      <SubSection title="Card" caption="ui/card.tsx">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkle size={16} className="text-atlas-700" />
              <CardTitle>Card title</CardTitle>
            </div>
            <CardDescription>Description copy below the title.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cocoa-700 leading-relaxed">
              Body content. The card primitive composes Header / Title /
              Description / Content / Footer subparts.
            </p>
          </CardContent>
          <CardFooter className="text-xs text-cocoa-700/70">
            <Buildings size={14} className="mr-1.5" />
            Footer hint
          </CardFooter>
        </Card>
      </SubSection>
      <SubSection title="Pills as data-presentation icons">
        <div className="flex flex-wrap gap-2">
          <Pill variant="success">
            <ChartLine size={12} weight="bold" />
            YoY up 12%
          </Pill>
          <Pill variant="danger">
            <WarningCircle size={12} weight="bold" />
            Low-coverage cell
          </Pill>
          <Pill variant="subtle">AU primary data</Pill>
          <Pill variant="outline">small turnover band</Pill>
        </div>
      </SubSection>
    </Section>
  );
}

// =============================================================
// Wave 4 , the spine2 foundation kit (v2 visual system)
// =============================================================

function Spine2Section() {
  return (
    <Section
      title="Spine2 foundation (v2 visual system)"
      description="The Wave 4 kit: scoped stylesheet, atoms (Fig, SwatchLegend, TierPill, Reading, GlyphIcon, fmt) and the RowLattice family (Statblock, Ledger). Scoped under .av2; source of truth is design/mockups/atlas.css via scripts/scope_atlas_css.mjs. Also mounted at /dev/spine2 (this private folder never routes)."
    >
      <Spine2Story />
    </Section>
  );
}
