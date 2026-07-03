"use client";
/**
 * Decision-engine interactive island. Owns: the spine wizard (trade/place/budget/
 * format, synced to the URL query), the sort state for the full ranked table, the
 * single-open per-pick drilldown (keep Waterfall + deep link), the compare tray +
 * 2-up CompareTable, and the Pro lock toggle.
 *
 * The server computes the KEEP ranking and passes the rows in; this island re-ranks
 * + re-filters them live. The headline (WinnerCard + Podium + counterweight) tracks
 * the current top-KEEP district, so changing inputs updates the verdict in place.
 *
 * SSR-safe: a controlled component over server-rendered rows. Reads the URL on mount
 * (so a shared /dev/decide?trade=cafe&place=soho link restores state) and writes
 * back with replaceState (no scroll jump, no navigation).
 */
import * as React from "react";
import {
  Box,
  Rail,
  Gauge,
  Waterfall,
  Expand,
  MiniBar,
  Fig,
  Narrow,
  Full,
  Even,
  Movement,
} from "@/components/spine/kit";
import {
  WinnerCard,
  Podium,
  DecisionRow,
  DecisionRowHeader,
  CompareTable,
  CompareTray,
  LockVeil,
  KitIndexStyles,
  type DecisionDatum,
  type SignalDef,
  type SortState,
  type CompareRow,
  type CompareEntity,
  type PodiumDatum,
} from "@/components/spine/kit-index";

/* ============================================================================
 * THE GATE , one obvious boolean. Flip to true to preview the unlocked (post-Pro)
 * state; flip to false to ship the gated free state. This is the single switch the
 * whole product's paywall contract inherits. The #1 answer is NEVER behind it.
 * ========================================================================== */
const PRO_UNLOCKED_DEFAULT = false;

export type DistrictRow = {
  id: string;
  name: string;
  character: string;
  keep: number;
  revIndex: number;
  revVsCity: number;
  rentMult: number;
  rentLoad: number;
  footfall: number;
  walkability: number;
  priceTier: string;
  tags: string[];
  blurb: string;
  headlineTrade: string;
  href: string;
};

/** a ranked row carries the trade-fit-adjusted keep alongside the base figures. */
export type RankedRow = DistrictRow & { fitKeep: number };

/* The wizard vocabulary. The seed is a London-restaurant demo, so the trade/place
 * options are illustrative , picking a different trade nudges the ranking by a
 * trade-fit weight (heavier rent tolerance for high-ticket trades), which keeps the
 * "inputs change the answer" promise honest without inventing new figures. */
const TRADES = [
  { key: "restaurant", label: "Restaurant", rentTolerance: 1.0 },
  { key: "cafe", label: "Cafe", rentTolerance: 0.82 },
  { key: "bar", label: "Bar", rentTolerance: 0.92 },
  { key: "retail", label: "Retail", rentTolerance: 1.12 },
];
const BUDGETS = [
  { key: "any", label: "Any budget" },
  { key: "lean", label: "Lean", maxRentLoad: 150 },
  { key: "mid", label: "Mid", maxRentLoad: 210 },
];
const FORMATS = [
  { key: "any", label: "Any format" },
  { key: "small", label: "Small site" },
  { key: "flagship", label: "Flagship" },
];

const ease = (rentLoad: number): string =>
  rentLoad <= 125 ? "Forgiving" : rentLoad <= 175 ? "Manageable" : rentLoad <= 220 ? "Demanding" : "Brutal";

const SIGNALS: SignalDef[] = [
  { key: "keep", label: "Keep", unit: "idx", higherIsBetter: true },
  { key: "rev", label: "Revenue", unit: "idx", higherIsBetter: true },
  { key: "rent", label: "Rent", unit: "load", higherIsBetter: false },
  { key: "foot", label: "Footfall", unit: "/100", higherIsBetter: true },
];

const getSignal = (r: DistrictRow, key: string): number =>
  key === "rev" ? r.revIndex : key === "rent" ? r.rentLoad : key === "foot" ? r.footfall : r.keep;

function SampleTag() {
  return (
    <span className="rounded-full bg-[var(--c-soft2)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--c-muted)]">
      sample data
    </span>
  );
}

export function DecideClient({ rows, city, myth }: { rows: DistrictRow[]; city: string; myth: any }) {
  // ---- wizard state (URL-synced) ----
  const [trade, setTrade] = React.useState("restaurant");
  const [place, setPlace] = React.useState(city.toLowerCase());
  const [budget, setBudget] = React.useState("any");
  const [format, setFormat] = React.useState("any");
  // ---- table + interaction state ----
  const [sort, setSort] = React.useState<SortState>({ key: "keep", dir: "desc" });
  const [unlocked, setUnlocked] = React.useState(PRO_UNLOCKED_DEFAULT);
  const [tray, setTray] = React.useState<string[]>([]);
  const [showCompare, setShowCompare] = React.useState(false);

  // Restore from the URL on mount, then keep the URL in sync (trade, place, budget).
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get("trade");
    const b = q.get("budget");
    const p = q.get("place");
    if (t && TRADES.some((x) => x.key === t)) setTrade(t);
    if (b && BUDGETS.some((x) => x.key === b)) setBudget(b);
    if (p) setPlace(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    q.set("trade", trade);
    q.set("place", place);
    q.set("budget", budget);
    const next = `${window.location.pathname}?${q.toString()}`;
    window.history.replaceState(null, "", next);
  }, [trade, place, budget]);

  const tradeDef = TRADES.find((t) => t.key === trade) ?? TRADES[0];
  const budgetDef = BUDGETS.find((b) => b.key === budget) ?? BUDGETS[0];

  // ---- the live re-rank ----
  // Trade fit re-weights keep by how well a district's rent load is tolerated by the
  // trade (high-ticket trades earn back heavy rent; lean trades punish it). Budget is
  // a hard constraint chip that filters out districts whose rent load exceeds the cap.
  const ranked = React.useMemo(() => {
    const scored = rows.map((r) => {
      const rentPenalty = (r.rentLoad - 100) / 100; // 0 at city baseline
      const fitKeep = Math.round(r.keep * (1 - rentPenalty * (1 - tradeDef.rentTolerance) * 0.6));
      return { ...r, fitKeep };
    });
    const filtered = budgetDef.maxRentLoad
      ? scored.filter((r) => r.rentLoad <= (budgetDef.maxRentLoad as number))
      : scored;
    const base = filtered.length ? filtered : scored; // never strand the user with an empty board
    return base
      .slice()
      .sort((a, b) => {
        const k = sort.key;
        const va = k === "keep" ? a.fitKeep : getSignal(a, k);
        const vb = k === "keep" ? b.fitKeep : getSignal(b, k);
        return sort.dir === "asc" ? va - vb : vb - va;
      });
  }, [rows, tradeDef, budgetDef, sort]);

  // The verdict always tracks the top KEEP district (not the active sort, which the
  // user may flip to revenue). The loudest-revenue district is the counterweight.
  const byKeep = React.useMemo(() => ranked.slice().sort((a, b) => b.fitKeep - a.fitKeep), [ranked]);
  const winner = byKeep[0];
  const loudest = ranked.slice().sort((a, b) => b.revIndex - a.revIndex)[0];
  const tradeLabel = tradeDef.label.toLowerCase();

  if (!winner) return null;

  const podium: PodiumDatum[] = byKeep.slice(0, 3).map((r) => ({
    id: r.id,
    name: r.name,
    keptPct: r.fitKeep,
    sub: "keep index",
    href: r.href,
  }));

  // Empty-state guard for the podium (need three to fill it; pad defensively).
  const podiumTriad =
    podium.length >= 3
      ? (podium.slice(0, 3) as [PodiumDatum, PodiumDatum, PodiumDatum])
      : (podium as PodiumDatum[]);

  // The full ranked list as DecisionRows. keptPct = the keep index scaled to a 0-100
  // bar (keep can exceed 100, so we clamp the bar but show the true figure).
  const toDatum = (r: (typeof ranked)[number], rank: number): DecisionDatum => ({
    id: r.id,
    name: `${rank}. ${r.name}`,
    href: r.href,
    icon: "neighborhood",
    keptPct: Math.min(100, r.fitKeep),
    keptLabel: `keep ${r.fitKeep}`,
    support: [
      { key: "rev", value: r.revIndex, display: `${r.revIndex}` },
      { key: "rent", value: r.rentLoad, display: `${r.rentLoad}` },
      { key: "foot", value: r.footfall, display: `${r.footfall}` },
    ],
  });
  const tableSignals = SIGNALS.filter((s) => s.key !== "keep");
  const topThree = ranked.slice(0, 3);
  const tail = ranked.slice(3);

  // ---- compare ----
  const trayItems = tray
    .map((id) => ranked.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => ({ id: (r as DistrictRow).id, name: (r as DistrictRow).name }));
  const toggleTray = (id: string) =>
    setTray((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? cur : [...cur, id]));
  const compareEntities: CompareEntity[] = tray
    .map((id) => ranked.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => ({ id: (r as DistrictRow).id, name: (r as DistrictRow).name }));
  const compareRows: CompareRow[] = [
    {
      key: "keep",
      label: "Keep index",
      unit: "idx",
      higherIsBetter: true,
      values: Object.fromEntries(ranked.map((r) => [r.id, r.fitKeep])),
    },
    {
      key: "rent",
      label: "Rent load",
      unit: "idx",
      higherIsBetter: false,
      values: Object.fromEntries(ranked.map((r) => [r.id, r.rentLoad])),
    },
    {
      key: "foot",
      label: "Footfall",
      unit: "/100",
      higherIsBetter: true,
      values: Object.fromEntries(ranked.map((r) => [r.id, r.footfall])),
    },
    {
      key: "walk",
      label: "Walkability",
      unit: "/100",
      higherIsBetter: true,
      values: Object.fromEntries(ranked.map((r) => [r.id, r.walkability])),
    },
  ];

  return (
    <div className="pb-24">
      <KitIndexStyles />
      <WizardStyles />

      {/* ============ MASTHEAD , the verdict (FREE) ============ */}
      <section className="overflow-hidden py-6 md:py-8">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">
          <span>Open a {tradeLabel} &middot; {city}</span>
          <SampleTag />
        </div>
        <WinnerCard
          kicker="The recommendation"
          winner={`Open your ${tradeLabel} in ${winner.name}`}
          keptPct={winner.fitKeep}
          keptLabel="keep index"
          why={`${winner.name} keeps the most of every pound. ${winner.blurb}`}
          catch={
            winner.id === loudest.id
              ? `Even the loudest district keeps the most here, but watch the rent: a heavy lease still eats the lift before it reaches the till.`
              : `${loudest.name} takes the highest revenue (index ${loudest.revIndex}), yet keeps less. The loudest district is rarely the best place to open.`
          }
          strip={[
            { value: `${winner.fitKeep}`, label: "keep index" },
            { value: `${winner.rentLoad}`, label: "rent load" },
            { value: ease(winner.rentLoad), label: "to break in" },
          ]}
          icon="verdict"
        />
      </section>

      {/* ============ PODIUM , top 3 by keep (FREE) ============ */}
      <Movement index="01" eyebrow="The shortlist" heading="The three that keep the most" icon="ranking" sample />
      <Podium items={podiumTriad} keptLabel="keep index" />

      {/* ============ WHY + COUNTERWEIGHT , paired Even (FREE) ============ */}
      <Movement index="02" eyebrow="The read" heading="Why this one, and the catch" icon="honest-take" sample />
      <Even>
        <WhyWins winner={winner} loudest={loudest} />
        <Counterweight winner={winner} loudest={loudest} myth={myth} />
      </Even>

      {/* ============ THE FULL RANKED TABLE , top 3 free, tail Pro (PRO) ============ */}
      <Movement index="03" eyebrow="The full board" heading={`All ${ranked.length} districts, ranked by keep`} icon="best-areas" sample />
      <Full>
        <Box>
          <DecisionRowHeader signals={tableSignals} sort={sort} onSort={onSortKey(sort, setSort)} />
          <div className="mt-1">
            {topThree.map((r, i) => (
              <DecisionRow key={r.id} d={toDatum(r, i + 1)} signals={tableSignals} />
            ))}
          </div>
          {tail.length > 0 ? (
            <div className="mt-1">
              <LockVeil
                unlocked={unlocked}
                headline="See the full ranked tail"
                note={`${tail.length} more districts, every keep figure, with sort by revenue, rent and footfall.`}
                cta="Unlock with Pro"
                onUnlock={() => setUnlocked(true)}
              >
                <div>
                  {tail.map((r, i) => (
                    <DecisionRow key={r.id} d={toDatum(r, i + 4)} signals={tableSignals} />
                  ))}
                </div>
              </LockVeil>
            </div>
          ) : null}
          <ProLine unlocked={unlocked} onToggle={() => setUnlocked((v) => !v)} />
        </Box>
      </Full>

      {/* ============ DRILL INTO A PICK , single-open Expand (PRO) ============ */}
      <Movement index="04" eyebrow="Go deeper" heading="Drill into a district" icon="owner-keeps" sample />
      <Full>
        <Box>
          <Rail icon="owner-keeps" kicker="Where the pound goes" verdict="Open a district to see revenue fall to rent, and what is kept." />
          <LockVeil
            unlocked={unlocked}
            headline="Per-district drilldown"
            note="The full keep waterfall for every district, plus a link into its neighborhood page."
            cta="Unlock with Pro"
            onUnlock={() => setUnlocked(true)}
          >
            <div className="space-y-2">
              {ranked.map((r) => (
                <Expand
                  key={r.id}
                  name="decide-drill"
                  title={r.name}
                  right={<Fig className="text-[13px] text-[var(--terra-text)]">keep {r.fitKeep}</Fig>}
                >
                  <KeepWaterfall r={r} />
                  <a
                    href={r.href}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--c-ink2)] transition-colors hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]"
                    style={{ touchAction: "manipulation" }}
                  >
                    See {r.name} in full &#8594;
                  </a>
                </Expand>
              ))}
            </div>
          </LockVeil>
        </Box>
      </Full>

      {/* ============ COMPARE TWO , multi-select tray (PRO) ============ */}
      <Movement index="05" eyebrow="Head to head" heading="Compare two districts" icon="compare" sample />
      <Full>
        <Box>
          <Rail icon="compare" kicker="Side by side" verdict="Pick two or three districts to weigh keep, rent, footfall and walkability." />
          <LockVeil
            unlocked={unlocked}
            headline="Side-by-side compare"
            note="Select districts below and weigh them on keep, rent, footfall and walkability."
            cta="Unlock with Pro"
            onUnlock={() => setUnlocked(true)}
          >
            <div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {ranked.map((r) => {
                  const on = tray.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleTray(r.id)}
                      aria-pressed={on}
                      className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                        on
                          ? "border-[var(--terra-border)] bg-[var(--terra-soft)] text-[var(--terra-text)]"
                          : "border-[var(--c-border)] bg-[var(--c-soft)] text-[var(--c-ink2)] hover:bg-[var(--c-soft2)]"
                      }`}
                      style={{ touchAction: "manipulation" }}
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>
              {showCompare && compareEntities.length >= 2 ? (
                <CompareTable entities={compareEntities} rows={compareRows} caption="Best in each metric is bold. Shares and indices only, compared like for like." />
              ) : (
                <p className="text-[12.5px] text-[var(--c-ink2)]">
                  {tray.length < 2 ? "Pick at least two districts to compare." : "Open the compare tray below to see them side by side."}
                </p>
              )}
            </div>
          </LockVeil>
        </Box>
      </Full>

      {/* ============ CHANGE THE INPUTS , the wizard (FREE) ============ */}
      <Movement index="06" eyebrow="Change the inputs" heading="Re-rank for your plan" icon="gut-check" sample />
      <Full>
        <Box>
          <Rail icon="gut-check" kicker="The query" verdict={`The headline re-ranks live. Right now: a ${tradeLabel} in ${city}.`} />
          <div className="space-y-3">
            <Segmented label="Trade" options={TRADES} value={trade} onChange={setTrade} />
            <Segmented
              label="Place"
              options={[{ key: city.toLowerCase(), label: city }]}
              value={place}
              onChange={setPlace}
            />
            <Segmented label="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
            <Segmented label="Format" options={FORMATS} value={format} onChange={setFormat} />
          </div>
          <p className="mt-3 text-[11.5px] text-[var(--c-muted)]">
            Trade and budget re-rank the board; the verdict above updates to the new top-keep district. Format is a future
            constraint on the seed.
          </p>
        </Box>
      </Full>

      {/* ============ METHOD + HONESTY , prose (FREE) ============ */}
      <Movement index="07" eyebrow="Method" heading="What the keep index is" icon="methodology" />
      <Narrow>
        <Box>
          <div className="space-y-3 text-[12.5px] leading-relaxed text-[var(--c-ink2)]">
            <p>
              The <span className="font-semibold text-[var(--c-ink)]">keep index</span> combines two things: how a
              district&rsquo;s typical revenue compares to the city average, and how heavy its rent runs. An index of{" "}
              <Fig className="text-[var(--c-ink)]">100</Fig> means a district keeps the same share of each pound as the
              city as a whole. Above 100, cheaper rent more than pays for any shortfall in takings; below 100, a fat lease
              eats the lift before it reaches the owner.
            </p>
            <p>
              This is a <span className="font-semibold text-[var(--c-ink)]">structural guide, not a local quote</span>.
              It ranks where the model says a pound is most likely to survive, not what any single site will rent or earn.
              Treat the order as a shortlist to verify on the ground, never as a lease valuation.
            </p>
            <p className="flex items-center gap-2 text-[11.5px] text-[var(--c-muted)]">
              <SampleTag /> District figures are illustrative and derived from modeled intensity multipliers; filing is
              deferred. On promotion the engine wires to the real recommender joins.
            </p>
          </div>
        </Box>
      </Narrow>

      {/* compare tray , sticky multi-select hand-off */}
      <CompareTray
        items={trayItems}
        onRemove={(id) => toggleTray(id)}
        onClear={() => {
          setTray([]);
          setShowCompare(false);
        }}
        onCompare={() => setShowCompare(true)}
        max={3}
      />
    </div>
  );
}

/* sort handler , flips direction on the active key, defaults to the signal's
 * preferred direction otherwise (keep/rev/foot desc, rent asc). */
function onSortKey(sort: SortState, set: (s: SortState) => void) {
  return (key: string) => {
    if (sort.key === key) {
      set({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      set({ key, dir: key === "rent" ? "asc" : "desc" });
    }
  };
}

/* ---- WHY THIS ONE WINS , Rail + MiniBar drivers (FREE) ---- */
function WhyWins({ winner, loudest }: { winner: RankedRow; loudest: DistrictRow }) {
  const revLift = winner.revVsCity;
  const rentDrag = winner.rentLoad - 100;
  return (
    <Box>
      <div className="relative">
        <div className="absolute right-0 top-0">
          <SampleTag />
        </div>
        <Rail icon="where-it-pays" kicker="Why this one wins" verdict={`${winner.name} clears the highest keep because its rent drag is light for the revenue it pulls.`} />
      </div>
      <div className="space-y-3">
        <Driver label="Revenue vs city" value={`${revLift >= 0 ? "+" : ""}${revLift}%`} pct={Math.min(100, 50 + revLift)} />
        <Driver label="Rent load" value={`${winner.rentLoad}`} pct={Math.min(100, winner.rentLoad / 2.6)} muted />
        <Driver label="Net keep index" value={`${winner.fitKeep}`} pct={Math.min(100, winner.fitKeep)} />
      </div>
      <p className="mt-3 text-[11.5px] leading-snug text-[var(--c-ink2)]">
        {loudest.name} pulls a higher revenue index ({loudest.revIndex}) but a rent load of {loudest.rentLoad} drags its
        keep below {winner.name}.
      </p>
    </Box>
  );
}
function Driver({ label, value, pct, muted = false }: { label: string; value: string; pct: number; muted?: boolean }) {
  return (
    <div className="grid grid-cols-[120px_1fr_48px] items-center gap-3">
      <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{label}</span>
      <div style={muted ? { filter: "grayscale(1)", opacity: 0.85 } : undefined}>
        <MiniBar pct={pct} />
      </div>
      <Fig className={`text-right text-[13px] ${muted ? "text-[var(--c-ink)]" : "text-[var(--terra-text)]"}`}>{value}</Fig>
    </div>
  );
}

/* ---- THE HONEST COUNTERWEIGHT , one Gauge + myth-bust (FREE) ---- */
function Counterweight({ winner, loudest, myth }: { winner: RankedRow; loudest: DistrictRow; myth: any }) {
  // Gauge reads ease-of-entry for the winner (lighter rent = easier). 0-100, higher = easier.
  const easeScore = Math.max(0, Math.min(100, Math.round(100 - (winner.rentLoad - 100) / 1.8)));
  return (
    <Box>
      <div className="relative">
        <div className="absolute right-0 top-0">
          <SampleTag />
        </div>
        <Rail icon="myth-reality" kicker="The counterweight" verdict="The highest-revenue district is rarely the best place to open." />
      </div>
      <div className="flex items-center gap-5">
        <div className="shrink-0">
          <Gauge value={easeScore} endLabels={["Brutal", "Easy"]} sub="Ease of entry" />
        </div>
        <div className="text-[12.5px] leading-snug text-[var(--c-ink2)]">
          {loudest.name} takes the loudest revenue, yet its heavy rent means the owner keeps less of each pound.{" "}
          {myth?.tell ?? "Rank districts by what stays, not by what comes in."}
        </div>
      </div>
    </Box>
  );
}

/* ---- KEEP WATERFALL , revenue -> rent -> kept for the drilldown (PRO) ---- */
function KeepWaterfall({ r }: { r: DistrictRow }) {
  // Express the keep story as shares of the revenue index: revenue at the top, the
  // rent bite, and the kept remainder (the keep index, clamped to the bar).
  const rev = r.revIndex;
  const rentBite = Math.min(rev, Math.round((r.rentMult - 1) * 60)); // illustrative rent drag in index points
  const kept = Math.max(0, Math.min(100, r.keep));
  const rows: Array<[string, number, boolean?]> = [
    ["Revenue index", Math.min(100, rev)],
    ["Rent drag", Math.min(100, rentBite)],
    ["Kept (keep index)", kept, true],
  ];
  return (
    <div>
      <Waterfall rows={rows} />
      <p className="mt-2 text-[11.5px] text-[var(--c-muted)]">{r.blurb}</p>
    </div>
  );
}

/* ---- the dev-only Pro toggle line (so the gate is visible + testable) ---- */
function ProLine({ unlocked, onToggle }: { unlocked: boolean; onToggle: () => void }) {
  return (
    <div className="mt-3 flex items-center justify-between border-t border-[var(--c-border)] pt-3">
      <span className="text-[11px] text-[var(--c-muted)]">
        Free shows the top three. The full board, drilldown and compare are Pro.
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--c-ink2)] transition-colors hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]"
        style={{ touchAction: "manipulation" }}
      >
        {unlocked ? "Lock (preview free)" : "Unlock (preview Pro)"}
      </button>
    </div>
  );
}

/* ---- Segmented , a spine chip-group control for the wizard ---- */
function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ key: string; label: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <span className="w-16 shrink-0 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</span>
      <div className="inline-flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange(o.key)}
              aria-pressed={on}
              className={`seg rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                on
                  ? "border-[var(--terra-border)] text-white"
                  : "border-[var(--c-border)] bg-[var(--c-soft)] text-[var(--c-ink2)] hover:bg-[var(--c-soft2)]"
              }`}
              style={{ touchAction: "manipulation", ...(on ? { background: "var(--terra-text)" } : {}) }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* shared focus-visible ring for the bespoke controls in this island (the kit rows
 * already carry their own affordances; these are the new buttons). */
function WizardStyles() {
  return (
    <style>{`.spine-scope .seg:focus-visible,.spine-scope [aria-pressed]:focus-visible{outline:2px solid var(--terra-text);outline-offset:2px}`}</style>
  );
}
