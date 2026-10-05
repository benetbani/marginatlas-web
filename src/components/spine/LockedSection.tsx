/**
 * THE LOCKED SECTION (milestone 2, masterplan step 15; his interview of 2026-09-26: 18, half of every UK chapter behind Pro;
 * 22, "title and icon, the drawing blurred behind, one line, one button; no pop-up").
 *
 * The drawing behind is a stand-in of the section's kind, never the section itself: the page is cached for every reader, so a
 * real figure here would be readable in the page source (src/lib/monetization/viewer_tier.ts, "no leaked values"). The section
 * keeps its id, so its anchor and its block hold (BLOCK FLOOR counts `[data-block]`), and stamps `data-locked` and the class the
 * locked-section structured data selects (`.pro-locked`). A kept card: the reader operates its button (MODEL 10.4). The blur is
 * 6px, the v34 research's bound (rule 12 of scripts/verify_v34_research_rules.ts). The button is the close's pill door
 * (Terminus), to the pricing page.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { PRICING_HREF } from "@/components/monetization/paywall_copy";
import { COPY } from "@/lib/spine/copy";

/** The stand-in nearest a section's drawing: bars for ranked and pay bars, track for tracks and ranges, rows for fact rows and
 *  key-value grids, grid for unit grids, table for tables and spectra. */
export type StandInKind = "bars" | "track" | "rows" | "grid" | "table";

function StandIn({ kind }: { kind: StandInKind }) {
  const fill = "var(--c-line-strong)";
  const shapes: Record<StandInKind, React.ReactNode> = {
    bars: [0, 1, 2, 3].map((i) => <rect key={i} x="0" y={i * 22} width={[220, 170, 120, 80][i]} height="12" rx="3" fill={fill} />),
    track: [<rect key="t" x="0" y="34" width="260" height="8" rx="4" fill={fill} />, <rect key="m" x="90" y="26" width="70" height="24" rx="4" fill={fill} />],
    rows: [0, 1, 2, 3].map((i) => <rect key={i} x="0" y={i * 22} width="260" height="10" rx="3" fill={fill} />),
    grid: Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i % 10) * 26} y={Math.floor(i / 10) * 22} width="18" height="14" rx="3" fill={fill} />),
    table: [0, 1, 2, 3, 4].map((i) => <rect key={i} x="0" y={i * 18} width={i === 0 ? 260 : 200} height="8" rx="2" fill={fill} />),
  };
  return (
    /* The drawing spans the card as the section's own would (preserveAspectRatio none): kept at its 260 by 90 it stood small in the
       middle of a wide card with blank space either side. */
    <svg viewBox="0 0 260 90" width="100%" height="90" preserveAspectRatio="none" aria-hidden="true" focusable="false" data-stand-in={kind} style={{ filter: "blur(6px)" }}>
      {shapes[kind]}
    </svg>
  );
}

/** What a view knows about one card it may draw locked (masterplan step 16): the section's id, the title its rail prints, the icon
 *  its rail draws, the stand-in nearest its drawing, and the copy key of its line when the id means another section elsewhere. */
export type LockSpec = { id: string; title: string; icon: AtlasIconId; kind: StandInKind; lineKey?: string };

/** A LOCKED LEVEL'S CARDS (masterplan step 16): each card of the level, found by the React key its view gives it, drawn as the
 *  locked section its view's table names, in the same order inside the same zone. A card the table does not name is not drawn
 *  at all, never drawn open: the paywall-shape gate (step 20) holds the locked ids to the levels that lock. */
export function lockedBody(body: React.ReactNode[], table: Record<string, LockSpec>): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  for (const el of body) {
    const key = React.isValidElement(el) && el.key != null ? String(el.key) : null;
    const spec = key ? table[key] : undefined;
    if (spec) out.push(<LockedSection key={key} id={spec.id} title={spec.title} icon={spec.icon} kind={spec.kind} lineKey={spec.lineKey} />);
  }
  return out;
}

export function LockedSection({ id, title, icon, kind, lineKey = id }: { id: string; title: string; icon: AtlasIconId; kind: StandInKind; lineKey?: string }) {
  const line = (COPY.locked.lines as Record<string, string>)[lineKey];
  return (
    /* Stamped as a form (`data-archetype`) so the archetype sheet measures the card at three widths; the census and the coverage
       gate read their archetypes from the archetype folders, and no page gate reads a locked render (step 20 renders its own). */
    <Box id={id} keep data-locked="1" data-archetype="locked-section" className="pro-locked">
      <Rail icon={icon} kicker={title} />
      <div className="mt-3">
        <StandIn kind={kind} />
      </div>
      {line ? <p className="mt-3 text-[length:var(--t-body)] text-[var(--c-ink2)]">{line}</p> : null}
      <a
        href={PRICING_HREF}
        className="tap-y mt-4 inline-flex w-full justify-center rounded-full bg-[var(--c-ink)] px-5 py-2 text-[length:var(--t-body)] font-semibold text-white transition-colors hover:bg-[var(--c-ink2)] sm:w-auto"
      >
        {COPY.locked.button}
      </a>
    </Box>
  );
}
