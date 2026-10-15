/**
 * Country page, SPINE BODY (SpineCountryBody), BY THE VISITOR'S JOURNEY (plan 2026-10-13 country-page-journey, Task 4; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md; his direction of 2026-10-13).
 *
 * The live route (src/app/[country]/country_spine.tsx) mounts this with the real seed; the route wraps it in SpineShell. Every country
 * draws the same sixteen slots (and the ruled 5b, the trades' margins where the seed holds them) in the same seven stages, in the model's
 * order and types (src/lib/spine/country_slots.ts): the slots its data holds (src/lib/spine/slots/plan.ts), each drawn by its stage's
 * component (./slots/), composed into zones that pair only two neighbouring slots of one stage (src/lib/spine/slots/zones.ts). The masthead
 * and the close stand outside the chapters; stages 2 to 6 are chapters 01 to 05. The rail lists the slots drawn, so it links no slot the
 * page does not draw. A slot without its data omits itself: no seat, no "Not known yet". Under the zones, the UK's sources line, the report
 * line and the thin page's notify ask, as before.
 *
 * `locked`, the paywall's form of the page (UK pages alone, his ruling 27): every slot after its stage's first draws as its LockedSection,
 * the slot's stamps on it (src/lib/spine/slots/locks.ts), and where the trades' slot locks, its trade pages stand as free doors after the
 * close (his ruling of 2026-10-05 on PARKED P20.1), so locking cuts no path.
 * No em-dashes, no raw hex, tokens only.
 */
import * as React from "react";
import { Zone, zoneTone } from "@/components/spine/zones";
import { STAGES, slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import { planCountry, type PlannedSlot } from "@/lib/spine/slots/plan";
import { composeZones } from "@/lib/spine/slots/zones";
import { marginCardFromRows } from "@/lib/spine/margin_rows";
import { lockedSlots, lockLineKey, SLOT_STAND_IN } from "@/lib/spine/slots/locks";
import { LockedSection } from "@/components/spine/LockedSection";
import { FreeDoors } from "@/components/spine/FreeDoors";
import { MastheadSlots } from "./slots/StageOrient";
import { CustomersSlot, SpendSlot, TradesSlot, MarginsSlot } from "./slots/StageMarket";
import { OpenSlot } from "./slots/StageOpen";
import { HireSlot } from "./slots/StageHire";
import { RunningCostsSlot, CreditSlot, FilingsSlot, PeersSlot } from "./slots/StageRun";
import { LastingSlot, ExitSlot } from "./slots/StageLast";
import { DealingsSlot, ChangesSlot, CloseSlot } from "./slots/StageRules";
import type { LoudSeat } from "@/lib/spine/loud_seats";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { checkedDateForCountry } from "@/lib/spine/checked";
import { DepthNotifyFoot } from "@/components/spine/DepthNotifyFoot";
import { countryPageTarget } from "@/lib/geo/page_targets";
import { COPY } from "@/lib/spine/copy";

/**
 * THE THREE LOUD MOMENTS, declared where they are lit or held (MODEL.md PART 6; read off this source by scripts/lib/loud_seats.ts). Seat one
 * is the masthead's answer at 40 in the accent, lit on every country since slot 1's thin state prints the company rate; seats two and three
 * are held: the hire's wage floor and the middle trade print at 30 in ink.
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 take", figure: "the tax on profit, 40", state: "LIT", condition: "spec 2026-10-13 section 3: the page's only 40, in --terra-text, on every country; where no regime is held the company rate stands under its own label" },
  { seat: 2, card: "07 hire", figure: "none: the wage floor at 30 in ink", state: "HELD EMPTY", condition: "his interview of 2026-09-26, answer 30 (milestone 1, M3): the wage floor and the hire's lever in ink; lit only by a figure that answers the slot" },
  { seat: 3, card: "05 trades", figure: "none: the middle trade at 30 in ink", state: "HELD EMPTY", condition: "his quiet of 2026-09-08 holds: the market's figures print in ink; the budget is spent at one" },
] as const satisfies readonly LoudSeat[];

/* THE WAYFINDING RAIL, BY CHAPTER, IN THE PAGE'S ORDER (2026-09-26): fixed to the viewport's right edge from 2xl, where it takes no room from
   the column. Its sections are the slots the page draws. */
type RailSection = { id: string; label: string; chapter?: string };
function OnThisPage({ sections, chapters }: { sections: RailSection[]; chapters?: Record<string, { index: string; heading: string }> }) {
  if (sections.length === 0) return null;
  const groups: Array<{ chapter?: string; items: RailSection[] }> = [];
  for (const s of sections) {
    const key = chapters && s.chapter && chapters[s.chapter] ? s.chapter : undefined;
    const last = groups[groups.length - 1];
    if (last && last.chapter === key) last.items.push(s);
    else groups.push({ chapter: key, items: [s] });
  }
  const link = (s: RailSection) => (
    <li key={s.id}>
      <a href={`#${s.id}`} className="block max-w-[18ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]">
        {s.label}
      </a>
    </li>
  );
  return (
    /* Never taller than the window: a shorter window scrolls it. */
    <nav aria-label="On this page" className="fixed right-6 top-1/2 hidden max-h-[calc(100vh-2rem)] -translate-y-1/2 overflow-y-auto 2xl:block">
      <div className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">On this page</div>
      {groups.map((g, gi) =>
        g.chapter && chapters ? (
          <div key={`${g.chapter}-${gi}`} className="mt-4">
            <div className="flex max-w-[20ch] gap-2 text-[length:var(--t-micro)] font-semibold leading-snug text-[var(--c-ink)]">
              <span className="tabular-nums text-[var(--c-muted)]">{chapters[g.chapter].index}</span>
              <span>{chapters[g.chapter].heading}</span>
            </div>
            <ol className="mt-2 space-y-2">{g.items.map(link)}</ol>
          </div>
        ) : (
          <ol key={`flat-${gi}`} className={chapters ? "mt-3 space-y-2" : "mt-2 space-y-2"}>{g.items.map(link)}</ol>
        ),
      )}
    </nav>
  );
}

/** Today's date as the page regenerates daily: the dated rows and the changes read it. */
const todayIso = () => new Date().toISOString().slice(0, 10);

/** One planned slot, drawn by its stage's component. */
function SlotView({ slot, iso2 }: { slot: PlannedSlot; iso2: string }) {
  switch (slot.id) {
    case "tax-on-profit": return <MastheadSlots iso2={iso2} />;
    case "customers": return <CustomersSlot model={slot.model} />;
    case "spend": return <SpendSlot model={slot.model} />;
    case "trades": return <TradesSlot model={slot.model} />;
    case "margins": return <MarginsSlot model={slot.model} />;
    case "open": return <OpenSlot model={slot.model} />;
    case "hire": return <HireSlot model={slot.model} />;
    case "running-costs": return <RunningCostsSlot model={slot.model} />;
    case "credit": return <CreditSlot model={slot.model} />;
    case "filings": return <FilingsSlot model={slot.model} />;
    case "peers": return <PeersSlot model={slot.model} />;
    case "lasting": return <LastingSlot model={slot.model} />;
    case "exit": return <ExitSlot model={slot.model} />;
    case "dealings": return <DealingsSlot model={slot.model} />;
    case "changes": return <ChangesSlot model={slot.model} />;
    case "close": return <CloseSlot model={slot.model} />;
  }
}

export function SpineCountryBody({ data, locked = false }: { data?: any; locked?: boolean }) {
  const d = data ?? {};
  const name: string | undefined = d.meta?.country_name;
  const iso2: string | undefined = typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined;
  if (!name || !iso2) return null;
  /* The page's own address from the resolver the country route checks (geo-link-construction): the notify ask's key. */
  const ownPath = countryPageTarget(iso2)?.href ?? null;
  /* THE TRADES' MARGINS FROM THE SEED (slot 5b, the controller's ruling on Q1): the money block's live rows, as the margin card read them. */
  const margins = { card: marginCardFromRows(Array.isArray(d.money?.list) ? d.money.list : []), tagged: typeof d.money?._meta?.confidence === "string" && d.money._meta.confidence !== "measured" };
  const plan = planCountry(iso2, name, todayIso(), margins);
  const locks = locked ? lockedSlots(plan.drawn) : null;
  const zones = composeZones(plan.drawn);
  const byId = new Map(plan.slots.map((s) => [s.id as string, s]));
  const chapters = Object.fromEntries(STAGES.filter((g) => g.index && g.heading).map((g) => [g.index as string, { index: g.index as string, heading: g.heading as string }]));
  const sections: RailSection[] = plan.drawn.filter((id) => id !== "where-it-stands").map((id) => ({ id: slotDef(id).domId, label: slotDef(id).heading, chapter: stageOfSlot(id).index ?? undefined }));
  return (
    <>
      {/* SIXTEEN PIXELS OF GUTTER ON A PHONE (research R2): the site's column holds 16 under 768, so a section's content is 343px wide at 375. */}
      <div data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split === "lone" ? "2-1" : z.split} label={z.label} chapter={z.chapter ?? undefined}>
            {z.slots.filter((id) => id !== "where-it-stands").map((id) => {
              const slot = byId.get(id);
              if (!slot) return null;
              const def = slotDef(id);
              return locks?.has(id) ? (
                <LockedSection key={id} id={def.domId} title={def.heading} icon={def.icon ?? "change"} kind={SLOT_STAND_IN[id]} lineKey={lockLineKey(id)} stamp={{ "data-slot": def.id, "data-stage": String(stageOfSlot(id).n), "data-answer": def.type }} />
              ) : (
                <SlotView key={id} slot={slot} iso2={iso2} />
              );
            })}
          </Zone>
        ))}
        {/* THE TRADES' PAGES, FREE (his ruling of 2026-10-05 on PARKED P20.1): where the trades' slot locks, every London trade page its bars and
            its plus open stands by name after the close, outside the chapters. */}
        {(() => {
          const trades = plan.slots.find((s) => s.id === "trades");
          if (!locks?.has("trades") || !trades || trades.id !== "trades") return null;
          const doors = [...trades.model.drawing.drawn.map((r) => ({ name: r.name, href: r.href ?? "" })), ...trades.model.more.flatMap((l) => l.rows).map((r) => ({ name: r.label, href: r.href ?? "" }))].filter((door) => door.href);
          return (
            <Zone key="trade-doors" tone={zoneTone(zones.length)} split="wide" label={COPY.londonSales.kicker}>
              <FreeDoors id="trades" title={COPY.londonSales.kicker} doors={doors} />
            </Zone>
          );
        })()}
      </div>
      {/* THE UK'S SOURCES, ONE LINE UNDER THE BANDS (plan 06, task B4): the licence's sentence and the link to the one sources page; nothing off the UK. */}
      <SourcesFoot iso2={iso2} />
      {/* REPORT A MISTAKE, AND CHECKED WHERE A DATE IS HELD (masterplan step 31): the page's own path to the correction page. */}
      <ReportFoot path={ownPath} checked={checkedDateForCountry(iso2)} />
      {/* THE THIN PAGE'S ONE ASK (milestone 1, M9): the notify-me form, only on a page the floor census counted under its floor outside the UK. */}
      {ownPath ? <DepthNotifyFoot path={ownPath} /> : null}
      <OnThisPage sections={sections} chapters={chapters} />
    </>
  );
}

export default SpineCountryBody;
