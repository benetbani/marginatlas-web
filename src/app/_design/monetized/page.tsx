/**
 * /_design/monetized: preview of the Free vs Paid gated states.
 *
 * Admin-gated by ?key=<ADMIN_KEY>, same pattern as /_design. This is a SAFE
 * preview surface: it renders the v34 lock primitives over MOCK data so the
 * founder can see exactly how a free reader meets a gated stat (fog, ghost bar,
 * redaction, key cue) before any of it is wired onto the live cell page. The
 * live cell-page wiring is a separate, tested step (an earlier attempt broke the
 * page, see free_paid_map.ts).
 *
 * No em-dashes. On-brand cream / parchment / ink / atlas.
 */
import { notFound } from "next/navigation";
import { Key } from "@phosphor-icons/react/dist/ssr";
import { timingSafeEqualString } from "@/lib/rate_limit";
import {
  RedactedNumber,
  BlurredOverlay,
  LockPill,
  GhostBar,
  MoreDepthBanner,
} from "@/components/monetization";
import { FREE_PAID_MAP, type GatedFieldId } from "@/lib/monetization/free_paid_map";

function KeyCue() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-atlas-700 font-semibold align-middle"
      aria-hidden="true"
    >
      <Key size={13} weight="bold" />
      key
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-parchment bg-cream-50 p-5">
      <div className="text-[10px] uppercase tracking-[0.16em] text-atlas-700 font-semibold mb-3">
        {title}
      </div>
      {children}
    </section>
  );
}

export default async function MonetizedPreview({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const sp = await searchParams;
  const required = process.env.ADMIN_KEY;
  if (!required || !sp.key || !timingSafeEqualString(sp.key, required)) {
    notFound();
  }

  const tiers: Array<{ tier: "free" | "basic" | "premium"; ids: GatedFieldId[] }> = [
    { tier: "free", ids: [] },
    { tier: "basic", ids: [] },
    { tier: "premium", ids: [] },
  ];
  (Object.keys(FREE_PAID_MAP) as GatedFieldId[]).forEach((id) => {
    const t = FREE_PAID_MAP[id].required;
    tiers.find((x) => x.tier === t)!.ids.push(id);
  });

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="font-display text-3xl md:text-4xl font-medium text-ink-900">
        Free vs Paid, the gated states
      </h1>
      <p className="mt-2 text-sm text-cocoa-700 max-w-2xl leading-relaxed">
        How a free reader meets a paid stat: the interface stays visible, covered
        by fog or marked with a key, so the reader sees that more exists without
        the number leaking. Mock data. Nothing here is wired onto a live cell page
        yet.
      </p>

      {/* Free vs paid, the same stat group */}
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        <Panel title="Free reader sees">
          <div className="space-y-2 text-sm text-ink-900">
            <div className="flex justify-between"><span>Typical revenue</span><span className="font-semibold tabular-nums">$387K</span></div>
            <div className="flex justify-between"><span>People working</span><span className="font-semibold tabular-nums">4</span></div>
            <div className="flex justify-between"><span>Profit kept</span><span className="font-semibold tabular-nums">12%</span></div>
            <div className="flex justify-between text-cocoa-700">
              <span>Inner quartiles (p25, p75) <KeyCue /></span>
              <span><RedactedNumber tier="basic" entry="cell_distribution_p25_p75" ariaLabel="Inner quartiles, unlock with Basic" /></span>
            </div>
            <div className="flex justify-between text-cocoa-700">
              <span>Full cost breakdown <KeyCue /></span>
              <LockPill tier="basic" entry="cell_peers" ariaLabel="Full cost breakdown, unlock with Basic" />
            </div>
          </div>
        </Panel>
        <Panel title="Paid reader sees">
          <div className="space-y-2 text-sm text-ink-900">
            <div className="flex justify-between"><span>Typical revenue</span><span className="font-semibold tabular-nums">$387K</span></div>
            <div className="flex justify-between"><span>People working</span><span className="font-semibold tabular-nums">4</span></div>
            <div className="flex justify-between"><span>Profit kept</span><span className="font-semibold tabular-nums">12%</span></div>
            <div className="flex justify-between"><span>Inner quartiles (p25, p75)</span><span className="font-semibold tabular-nums">$210K . $640K</span></div>
            <div className="flex justify-between"><span>Full cost breakdown</span><span className="font-semibold tabular-nums">13 lines</span></div>
          </div>
        </Panel>
      </div>

      {/* Fog over a block */}
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        <Panel title="Fog treatment (full cost stack, Basic)">
          <BlurredOverlay tier="basic" entry="cell_peers" cta="See the full breakdown" headline="Where the money goes, line by line">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Materials</span><span className="tabular-nums">$143K</span></div>
              <div className="flex justify-between"><span>Labor</span><span className="tabular-nums">$96K</span></div>
              <div className="flex justify-between"><span>Rent</span><span className="tabular-nums">$42K</span></div>
              <div className="flex justify-between"><span>Utilities</span><span className="tabular-nums">$18K</span></div>
              <div className="flex justify-between"><span>Tax</span><span className="tabular-nums">$22K</span></div>
            </div>
          </BlurredOverlay>
        </Panel>
        <Panel title="Ghost bars (inner quartiles, Basic)">
          <p className="text-xs text-cocoa-700 mb-2">
            p10, p50, p90 stay readable; p25 and p75 are ghosted with a key cue. <KeyCue />
          </p>
          <svg viewBox="0 0 300 90" className="w-full" role="img" aria-label="Distribution with ghosted inner quartiles">
            <rect x="20" y="50" width="24" height="30" fill="#D47706" opacity="0.85" rx="2" />
            <GhostBar x={80} y={35} width={24} height={45} tier="basic" entry="cell_distribution_p25_p75" ariaLabel="p25, unlock with Basic" />
            <rect x="140" y="20" width="24" height="60" fill="#c03d2b" rx="2" />
            <GhostBar x={200} y={35} width={24} height={45} tier="basic" entry="cell_distribution_p25_p75" ariaLabel="p75, unlock with Basic" />
            <rect x="260" y="55" width="24" height="25" fill="#D47706" opacity="0.85" rx="2" />
            <text x="32" y="88" fontSize="8" textAnchor="middle" fill="#5A3A1A">p10</text>
            <text x="152" y="88" fontSize="8" textAnchor="middle" fill="#5A3A1A">p50</text>
            <text x="272" y="88" fontSize="8" textAnchor="middle" fill="#5A3A1A">p90</text>
          </svg>
        </Panel>
      </div>

      {/* Banner */}
      <div className="mt-8">
        <MoreDepthBanner headline="Compare this cell against every state, ranked" entry="compare_side_by_side" tier="basic" />
      </div>

      {/* The full plan */}
      <h2 className="mt-12 font-display text-2xl font-medium text-ink-900">The visibility plan</h2>
      <p className="mt-1 text-sm text-cocoa-700">Source of truth: <code className="text-xs">src/lib/monetization/free_paid_map.ts</code></p>
      <div className="mt-4 space-y-6">
        {tiers.map(({ tier, ids }) => (
          <div key={tier}>
            <div className="text-xs uppercase tracking-wide font-semibold text-atlas-700 mb-2">
              {tier} {tier === "free" ? "(always open)" : "(gated)"}
            </div>
            <div className="rounded-lg border border-parchment overflow-hidden">
              {ids.map((id, i) => (
                <div
                  key={id}
                  className={`flex items-baseline gap-3 px-4 py-2.5 text-sm ${i % 2 ? "bg-cream-50" : "bg-white"}`}
                >
                  <code className="text-xs text-ink-900 w-56 shrink-0">{id}</code>
                  <span className="text-[10px] uppercase tracking-wide text-cocoa-700/70 w-20 shrink-0">
                    {FREE_PAID_MAP[id].treatment}
                  </span>
                  <span className="text-cocoa-700">{FREE_PAID_MAP[id].note}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
