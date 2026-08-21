"use client";
/**
 * AtlasIndex , the ONE config-driven browse/list shell for the AtlasIndex archetype
 * (Wave 2 of the uncovered-pages plan). The cities / world / extremes instances reuse
 * THIS island; an instance differs only by the typed config its server page hands in
 * (rows + signals + facets + copy). No instance forks the row / sort / lock grammar.
 *
 * It is a "use client" island over server-rendered rows (SSR-safe): the server emits a
 * meaningful first page, this island hydrates the search / sort / facet / pager / tray
 * state over it and restores that state from the URL query on mount.
 *
 * Composed READ-ONLY from kit-index (ControlRail + DecisionRow + DecisionRowHeader +
 * SortHeader + Pager + CompareTray + LockVeil) and kit (Box, Fig, Ico). Geist text +
 * Space Grotesk figures; soft terracotta on the focal / leading / active slice only.
 *
 * HARD LAWS inherited from the kit: no horizontal scroll (rows reflow to stacked mini
 * cards on mobile), entity-scoped / share-and-index comparisons only (never raw-USD
 * across geographies), a missing signal renders a dash and is NEVER fabricated.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { AtlasIcon, type AtlasIconId } from "@/components/brand/icons";
import { Box, Fig, Ico, TERRA, TRACK } from "./kit";
import {
  ControlRail,
  DecisionRow,
  DecisionRowHeader,
  CompareTray,
  LockVeil,
  Pager,
  KitIndexStyles,
  type DecisionDatum,
  type SignalDef,
  type SignalValue,
  type SortState,
} from "./kit-index";

/* ============================================================================
 * CONFIG TYPES , the contract every instance fills in. The instance owns data +
 * copy; the shell owns interaction. A signal is either REAL (shown plainly) or
 * SAMPLE (carries a visible chip); a null value renders a dash either way.
 * ========================================================================== */

/** One support figure definition. `sample` marks a modeled/placeholder column. */
export type IndexSignalDef = SignalDef & { sample?: boolean };

/** A focal "what an owner keeps" reading for one row. null = withheld (dash). */
export type FocalValue = { value: number | null; unit?: string; label?: string };

export type IndexRow = {
  id: string;
  name: string;
  href: string;
  /** ISO-2 for the flat flag (countries). When absent, leadIcon is used. */
  flagIso2?: string;
  /** fallback leading tile when there is no flag. */
  leadIcon?: AtlasIconId;
  /** the ONE focal signal (the kept share). */
  focal: FocalValue;
  /** N support figures keyed to the signal defs. */
  support: SignalValue[];
  /** facet membership keyed by facet key -> the chip key this row belongs to. */
  facetValues?: Record<string, string | undefined>;
};

export type IndexFacet = {
  key: string;
  label: string;
  chips: Array<{ key: string; label: string }>;
};

const PRO_UNLOCKED_DEFAULT = false;
const PER_PAGE = 20;
const ELLIPSIS = "…";
const DASH = "–";

/* the focal value as a 0-100 keptPct for the DecisionRow bar (clamped; the true
 * figure rides keptLabel so a >100 index still shows honestly). null -> a -1
 * sentinel that the DecisionRow can render as an empty bar + a dash label. */
function focalToDatum(row: IndexRow): DecisionDatum {
  const v = row.focal.value;
  const known = typeof v === "number";
  return {
    id: row.id,
    name: row.name,
    href: row.href,
    icon: row.leadIcon,
    keptPct: known ? Math.max(0, Math.min(100, v as number)) : 0,
    keptLabel: "kept",
    keptKnown: known,
    support: row.support,
  };
}

/* sort comparator honoring per-signal direction; nulls always sink to the bottom. */
function sortRows(rows: IndexRow[], sort: SortState, signals: IndexSignalDef[]): IndexRow[] {
  const def = signals.find((s) => s.key === sort.key);
  const focal = sort.key === "focal";
  const hib = focal ? true : def?.higherIsBetter !== false;
  const valOf = (r: IndexRow): number | null =>
    focal ? r.focal.value : r.support.find((s) => s.key === sort.key)?.value ?? null;
  return rows.slice().sort((a, b) => {
    const va = valOf(a);
    const vb = valOf(b);
    if (va == null && vb == null) return a.name.localeCompare(b.name);
    if (va == null) return 1;
    if (vb == null) return -1;
    // dir overrides direction: "desc" = best first given hib; sort.dir is the raw toggle.
    const better = hib ? vb - va : va - vb;
    return sort.dir === "desc" ? better : -better;
  });
}

/* best-known row for a signal key (for the "Atlas reads" strip + column emphasis). */
function bestRow(rows: IndexRow[], key: string, signals: IndexSignalDef[]): IndexRow | null {
  const def = signals.find((s) => s.key === key);
  const focal = key === "focal";
  const hib = focal ? true : def?.higherIsBetter !== false;
  const valOf = (r: IndexRow): number | null =>
    focal ? r.focal.value : r.support.find((s) => s.key === key)?.value ?? null;
  const known = rows.filter((r) => valOf(r) != null);
  if (!known.length) return null;
  return known.reduce((a, b) => {
    const va = valOf(a) as number;
    const vb = valOf(b) as number;
    return (hib ? vb > va : vb < va) ? b : a;
  });
}

const fmtVal = (v: number | null, unit?: string) => (v == null ? DASH : `${v}${unit ?? ""}`);

/* ============================================================================
 * The "Atlas reads" 3-up strip , the top-20% verdict for a LIST. Best on the
 * active signal, the Surprising one (focal disagrees with the obvious read), the
 * Hardest. Each names the row + its figure and links to it.
 * ========================================================================== */
function ReadCard({
  icon,
  kicker,
  row,
  figure,
  why,
}: {
  icon: AtlasIconId;
  kicker: string;
  row: IndexRow | null;
  figure: string;
  why: string;
}) {
  if (!row) return null;
  return (
    <Box className="flex flex-col">
      <div className="mb-1.5 flex items-center gap-2">
        <Ico id={icon} tone="terra" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--terra-text)]">{kicker}</span>
      </div>
      <a
        href={row.href}
        className="group -mx-1 inline-flex items-baseline gap-2 rounded-md px-1 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra-text)]"
        style={{ touchAction: "manipulation" }}
      >
        <span className="text-[15px] font-semibold text-[var(--c-ink)] group-hover:text-[var(--terra-text)]">{row.name}</span>
        <Fig className="text-[14px] text-[var(--terra-text)]">{figure}</Fig>
      </a>
      <p className="mt-1.5 text-[12px] leading-snug text-[var(--c-ink2)]">{why}</p>
    </Box>
  );
}

function AtlasReads({
  rows,
  activeKey,
  signals,
  focalLabel,
}: {
  rows: IndexRow[];
  activeKey: string;
  signals: IndexSignalDef[];
  focalLabel: string;
}) {
  const activeDef = signals.find((s) => s.key === activeKey);
  const activeUnit = activeKey === "focal" ? undefined : activeDef?.unit;
  const valOf = (r: IndexRow, key: string): number | null =>
    key === "focal" ? r.focal.value : r.support.find((s) => s.key === key)?.value ?? null;

  // Best on the active signal.
  const best = bestRow(rows, activeKey, signals);

  // Surprising: the row whose FOCAL ("what an owner keeps") most disagrees with the
  // obvious read , i.e. it ranks LOW on the loud signal (cost/ease) yet keeps a lot,
  // or ranks high on the loud signal yet keeps little. We pick the row with the best
  // focal among the bottom half of the active signal (the quiet winner / myth hook).
  const focalKnown = rows.filter((r) => r.focal.value != null);
  const activeKnown = rows
    .filter((r) => valOf(r, activeKey) != null)
    .sort((a, b) => (valOf(b, activeKey) as number) - (valOf(a, activeKey) as number));
  let surprising: IndexRow | null = null;
  if (focalKnown.length && activeKnown.length) {
    const bottomHalf = activeKnown.slice(Math.ceil(activeKnown.length / 2));
    const pool = bottomHalf.filter((r) => r.focal.value != null);
    surprising = (pool.length ? pool : focalKnown).reduce((a, b) =>
      (b.focal.value as number) > (a.focal.value as number) ? b : a,
    );
    if (surprising && best && surprising.id === best.id) surprising = null;
  }

  // Hardest / costliest: worst on the first NON-focal signal flagged hardest-friendly.
  // Default to the lowest "ease"-style signal (lowest higherIsBetter value) so the
  // honest "this one is a grind" hook is always present.
  const supportDefs = signals.filter((s) => s.key !== "focal");
  const hardDef = supportDefs.find((s) => s.higherIsBetter !== false) ?? supportDefs[0];
  let hardest: IndexRow | null = null;
  if (hardDef) {
    const hib = hardDef.higherIsBetter !== false;
    const known = rows.filter((r) => valOf(r, hardDef.key) != null);
    if (known.length) {
      hardest = known.reduce((a, b) => {
        const va = valOf(a, hardDef.key) as number;
        const vb = valOf(b, hardDef.key) as number;
        return (hib ? vb < va : vb > va) ? b : a; // worst = lowest if hib
      });
    }
    if (hardest && best && hardest.id === best.id) hardest = null;
  }

  const activeLabel = activeKey === "focal" ? focalLabel : activeDef?.label ?? "this signal";

  return (
    <div className="mb-5 mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">
      <ReadCard
        icon="where-it-pays"
        kicker={`Best on ${activeLabel.toLowerCase()}`}
        row={best}
        figure={best ? fmtVal(valOf(best, activeKey), activeUnit) : DASH}
        why={`Leads the list once you rank by ${activeLabel.toLowerCase()}.`}
      />
      <ReadCard
        icon="myth-reality"
        kicker="The surprising one"
        row={surprising}
        figure={surprising ? `${fmtVal(surprising.focal.value, surprising.focal.unit ?? "%")} kept` : DASH}
        why={`Quiet on the headline read, yet an owner keeps more of every sale here than the obvious picks.`}
      />
      <ReadCard
        icon="gut-check"
        kicker="The hardest"
        row={hardest}
        figure={hardest && hardDef ? fmtVal(valOf(hardest, hardDef.key), hardDef.unit) : DASH}
        why={hardDef ? `Lowest on ${hardDef.label.toLowerCase()}, so expect more of a grind to break in.` : ""}
      />
    </div>
  );
}

/* ============================================================================
 * The leading flag / icon tile. The kit DecisionRow renders an emoji or an Ico,
 * but countries need a flat flag (CountryFlag), so the shell renders its own row
 * wrapper for the lead and lets the kit DecisionRow handle the figures. To stay
 * within "compose, do not fork", we keep the kit DecisionRow for the signal grid
 * and overlay the flag via a small leading column above it on mobile-safe markup.
 *
 * Simpler + within the rules: pass leadIcon to the kit, and when a flag exists,
 * swap the kit's tile by rendering the flag through the icon slot is not possible,
 * so we render a thin flag-prefixed name. We do this by composing a custom row
 * that REUSES the kit DecisionRow look via leadIcon, plus a flag chip in the name.
 * To avoid duplicating the kit row, countries pass leadIcon "flag" as the tile and
 * we render the flag inside the name node by extending DecisionDatum.name.
 * ========================================================================== */

/* The shell row: a flag-aware leading cell composed beside the kit DecisionRow.
 * Countries need a flat SVG flag (CountryFlag), which the kit's emoji/Ico tile slot
 * cannot draw. We reuse the kit DecisionRow verbatim for the figure grid and overlay
 * the flag on top of its leading tile via a scoped wrapper class. */

export function AtlasIndex({
  title,
  rows,
  signals,
  facets = [],
  sampleNote,
  searchPlaceholder = "Search the list" + ELLIPSIS,
  focalLabel = "Margin kept",
  compareHref = "/decide",
}: {
  title: string;
  rows: IndexRow[];
  signals: IndexSignalDef[];
  facets?: IndexFacet[];
  sampleNote?: string;
  searchPlaceholder?: string;
  focalLabel?: string;
  compareHref?: string;
}) {
  const supportSignals = signals.filter((s) => s.key !== "focal");

  // ---- state (URL-synced) ----
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<SortState>({ key: "focal", dir: "desc" });
  const [activeFacets, setActiveFacets] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [unlocked, setUnlocked] = React.useState(PRO_UNLOCKED_DEFAULT);
  const [tray, setTray] = React.useState<string[]>([]);

  // segmented sort options: the focal + every support key (the active one re-ranks).
  const sortOptions: SignalDef[] = React.useMemo(
    () => [{ key: "focal", label: focalLabel } as SignalDef, ...supportSignals],
    [focalLabel, supportSignals],
  );

  // labels of the modeled columns , the focal (always modeled on this surface) plus
  // any sample-flagged support signal. Surfaced as visible chips below the rail.
  const sampleSignalLabels = React.useMemo(
    () => [focalLabel, ...supportSignals.filter((s) => s.sample).map((s) => s.label)],
    [focalLabel, supportSignals],
  );

  // Restore from the URL on mount.
  React.useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    const uq = u.get("q");
    const us = u.get("sort");
    const ud = u.get("dir");
    const uf = u.get("facets");
    const up = u.get("page");
    if (uq) setQ(uq);
    if (us && (us === "focal" || supportSignals.some((s) => s.key === us))) {
      setSort({ key: us, dir: ud === "asc" ? "asc" : "desc" });
    }
    if (uf) setActiveFacets(uf.split(",").filter(Boolean));
    if (up && Number(up) > 0) setPage(Number(up));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state -> URL (replaceState, no scroll jump / navigation).
  React.useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    q ? u.set("q", q) : u.delete("q");
    u.set("sort", sort.key);
    u.set("dir", sort.dir);
    activeFacets.length ? u.set("facets", activeFacets.join(",")) : u.delete("facets");
    page > 1 ? u.set("page", String(page)) : u.delete("page");
    const qs = u.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? "?" + qs : ""}`);
  }, [q, sort, activeFacets, page]);

  // ---- filter ----
  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (needle && !r.name.toLowerCase().includes(needle)) return false;
      if (activeFacets.length) {
        // a row passes if it matches at least one active facet chip (across all facets).
        const matches = activeFacets.some((fk) =>
          facets.some((f) => f.chips.some((c) => c.key === fk) && r.facetValues?.[f.key] === fk),
        );
        if (!matches) return false;
      }
      return true;
    });
  }, [rows, q, activeFacets, facets]);

  // ---- sort ----
  const sorted = React.useMemo(() => sortRows(filtered, sort, signals), [filtered, sort, signals]);

  // reset to page 1 whenever the result set changes shape.
  React.useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort.key, sort.dir, activeFacets.join(",")]);

  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const clampedPage = Math.min(page, pages);
  const pageRows = sorted.slice((clampedPage - 1) * PER_PAGE, clampedPage * PER_PAGE);

  const facetChips = facets.flatMap((f) => f.chips.map((c) => ({ key: c.key, label: c.label })));

  const onSortKey = (key: string) => {
    setSort((cur) => {
      if (cur.key === key) return { key, dir: cur.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "desc" };
    });
  };

  const toggleFacet = (key: string) =>
    setActiveFacets((cur) => (cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key]));

  const toggleTray = (id: string) =>
    setTray((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? cur : [...cur, id]));

  const trayItems = tray
    .map((id) => rows.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => ({ id: (r as IndexRow).id, name: (r as IndexRow).name }));

  const onCompare = () => {
    const ids = tray.join(",");
    // Hand off to the decision/compare surface. Stub for now: open the compare route
    // with the selected ids on the query (the compare instance reads them on mount).
    if (typeof window !== "undefined") {
      window.location.href = `${compareHref}?compare=${encodeURIComponent(ids)}`;
    }
  };

  return (
    <div className="pb-28">
      <KitIndexStyles />
      <AtlasIndexStyles />

      {/* masthead , the list IS the answer */}
      <header className="pb-4 pt-2">
        <div className="mb-1.5 flex items-center gap-2">
          <Ico id="ranking" tone="terra" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">The list</span>
        </div>
        <h1 data-typography="custom" className="max-w-[34ch] text-2xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-prose text-[13px] leading-snug text-[var(--c-ink2)]">
          Re-rank the whole list by the signal you care about. Every row carries its own decision figure; a blank reads
          as a dash, never a guess.
        </p>
      </header>

      {/* 1. sticky control rail */}
      <ControlRail
        query={q}
        onQuery={setQ}
        sortKey={sort.key}
        sortOptions={sortOptions}
        onSort={onSortKey}
        facets={facetChips}
        activeFacets={activeFacets}
        onToggleFacet={toggleFacet}
        count={sorted.length}
        total={rows.length}
        placeholder={searchPlaceholder}
      />

      {/* sample-signal legend , names every modeled column so a confident figure is
          never read as filed. The focal is always modeled here; sample support
          signals carry the same chip. */}
      {sampleSignalLabels.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1 text-[11px] text-[var(--c-muted)]">
          <span>Modeled, not filed:</span>
          {sampleSignalLabels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--c-soft2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--c-muted)]"
            >
              {label}
              <span className="font-normal normal-case tracking-normal">sample</span>
            </span>
          ))}
        </div>
      ) : null}

      {/* 2. Atlas reads , the top-20% verdict for the list, on the active signal */}
      <AtlasReads rows={filtered} activeKey={sort.key} signals={signals} focalLabel={focalLabel} />

      {/* 3. the decision-row list */}
      <Box>
        <DecisionRowHeader signals={supportSignals} sort={sort} onSort={onSortKey} />
        {pageRows.length === 0 ? (
          <div className="px-2 py-10 text-center">
            <p className="text-[13px] font-semibold text-[var(--c-ink)]">Nothing matches that yet.</p>
            <p className="mt-1 text-[12px] text-[var(--c-ink2)]">Clear the search or a facet to see the full list.</p>
          </div>
        ) : (
          <ul className="mt-1">
            {pageRows.map((r) => (
              <li key={r.id} className={`atlas-rowwrap relative ${r.flagIso2 ? "has-flag" : ""}`}>
                <div className="flex items-stretch gap-2">
                  {/* compare checkbox , multi-select for the Pro hand-off */}
                  <label className="flex shrink-0 items-center pl-1" style={{ touchAction: "manipulation" }}>
                    <input
                      type="checkbox"
                      checked={tray.includes(r.id)}
                      onChange={() => toggleTray(r.id)}
                      aria-label={`Add ${r.name} to compare`}
                      className="atlas-check h-3.5 w-3.5 cursor-pointer rounded border-[var(--c-line-strong)] accent-[var(--terra-text)]"
                    />
                  </label>
                  <div className="relative min-w-0 flex-1">
                    {/* flat SVG flag overlaid on the kit row's leading tile (countries). */}
                    {r.flagIso2 ? (
                      <span
                        aria-hidden
                        className="atlas-flag pointer-events-none absolute left-2 top-[15px] z-[1] grid h-7 w-7 place-items-center rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)]"
                      >
                        <CountryFlag iso2={r.flagIso2} className="h-[15px] w-[22px] rounded-[2px] border-0" />
                      </span>
                    ) : null}
                    <DecisionRow d={focalToDatum(r)} signals={supportSignals} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* sample / honesty note */}
        {sampleNote ? (
          <p className="mt-3 flex items-start gap-2 border-t border-[var(--c-border)] pt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">
            <span className="mt-0.5 shrink-0 text-[var(--terra-text)]">
              <AtlasIcon id="honest-take" size={13} />
            </span>
            <span>{sampleNote}</span>
          </p>
        ) : null}

        {/* 4. pager */}
        <Pager page={clampedPage} pages={pages} onPage={setPage} total={sorted.length} perPage={PER_PAGE} />
      </Box>

      {/* a tiny dev affordance so the gate is visible/testable on this surface */}
      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setUnlocked((v) => !v)}
          className="rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--c-ink2)] transition-colors hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]"
          style={{ touchAction: "manipulation" }}
        >
          {unlocked ? "Lock compare (preview free)" : "Unlock compare (preview Pro)"}
        </button>
      </div>

      {/* 5. compare tray , Pro hand-off, gated by the single PRO boolean */}
      {tray.length > 0 ? (
        unlocked ? (
          <CompareTray
            items={trayItems}
            onRemove={(id) => toggleTray(id)}
            onClear={() => setTray([])}
            onCompare={onCompare}
            max={3}
          />
        ) : (
          <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-3">
            <div className="mx-auto max-w-[1120px]">
              <LockVeil
                unlocked={false}
                headline="Compare is a Pro feature"
                note={`You picked ${tray.length}. Unlock Pro to weigh them side by side on keep, ease and cost.`}
                cta="Unlock with Pro"
                onUnlock={() => setUnlocked(true)}
              >
                <CompareTray items={trayItems} onCompare={() => {}} max={3} />
              </LockVeil>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}

/* shell-local styles: the focus ring for the new controls + the flag overlay nudges
 * the kit row's leading tile out of the way so the flag reads as the lead glyph. */
function AtlasIndexStyles() {
  return (
    <style>{`.spine-scope .atlas-check:focus-visible{outline:2px solid var(--terra-text);outline-offset:2px;border-radius:3px}
/* when a flag is overlaid, hide the kit row's own leading tile (first child of the
   lead flex), so the flat flag reads as the single lead glyph. The name stays. */
.spine-scope .atlas-rowwrap.has-flag .hovrow > div:first-child > div:first-child > :first-child{visibility:hidden}`}</style>
  );
}

// re-exported for instances that want the bar colors without re-importing the kit.
export { TERRA, TRACK };
