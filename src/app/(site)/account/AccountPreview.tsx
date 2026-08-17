/**
 * /account — the signed-in user's home. Saved cells, watchlist, recent
 * history, alert preferences, billing, and settings, behind six tabs.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookmarkSimple, Sparkle, Clock, Bell, CreditCard, Gear, Trash, ForkKnife,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";
import OnboardingChecklist from "@/components/billing/OnboardingChecklist";

export type Tier = "free" | "pro" | "team";

type Account = {
  name: string;
  email: string;
  tier: Tier;
  renewsOn?: string;
  /** Saved-cell cap appropriate for this tier. */
  savedCap: number;
  /** Whether to show the onboarding checklist (Pro, first 30 days). */
  showOnboarding?: boolean;
};

type Cell = {
  id: string;
  flag: string;
  sectorLabel: string;
  question: string;
  headline: string;
};

type WatchRow = {
  id: string;
  flag: string;
  label: string;
  condition: string;
  on: boolean;
};

type RecentRow = {
  id: string;
  flag: string;
  label: string;
  visitedAt: string;
  /** Cell or page URL to navigate back to when the user clicks "Open". */
  href: string;
};

const TABS: Array<{ id: TabId; label: string; icon: PhIcon }> = [
  { id: "saved",    label: "Saved cells", icon: BookmarkSimple },
  { id: "watch",    label: "Watchlist",   icon: Sparkle },
  { id: "recent",   label: "Recent",      icon: Clock },
  { id: "alerts",   label: "Alerts",      icon: Bell },
  { id: "billing",  label: "Billing",     icon: CreditCard },
  { id: "settings", label: "Settings",    icon: Gear },
];
type TabId = "saved" | "watch" | "recent" | "alerts" | "billing" | "settings";

/**
 * 2026-05-26 — auth not wired yet. The dummy-data design preview is
 * kept behind the NEXT_PUBLIC_ACCOUNT_PREVIEW flag so production
 * doesn't leak placeholder personas. Default behaviour: render a
 * "coming soon" placeholder.
 *
 * 2026-05-27 — feature-flag check centralised in
 * src/lib/feature_flags.ts (architecture audit refactor).
 */
import { isAccountPreviewEnabled } from "@/lib/feature_flags";
const SHOW_DESIGN_PREVIEW = isAccountPreviewEnabled();

export function AccountPreview() {
  const [tab, setTab] = useState<TabId>("saved");

  if (!SHOW_DESIGN_PREVIEW) {
    return (
      /* THE DEFAULT BRANCH, and the only one a reader has ever seen: the flag
         above is off in production. It was bare centred text on the page, and
         AtlasFrame paints a fixed photograph behind every route with no centre
         plate, so this whole placeholder was dark type sitting on a picture.
         One .atlas-card, translucent at .955, position:relative so it sits
         above the frame's fixed layers rather than sinking behind them. */
      <article className="atlas-card max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-3">
          Account
        </div>
        <h1 className="font-display text-3xl md:text-5xl tracking-tight text-ink-900 leading-[1.1] mb-4">
          Coming soon
        </h1>
        <p className="text-base md:text-lg text-cocoa-700 leading-relaxed mb-6 max-w-xl mx-auto">
          Sign-in, saved cells, watchlist, and billing are in build.
          Margin Atlas is fully usable without an account today; you
          can browse, compare, and run the comparator with no
          friction.
        </p>
        <a
          href="/check"
          className="inline-block px-4 py-2 rounded-lg bg-atlas-700 hover:bg-atlas-800 text-cream-50 text-sm font-semibold transition"
        >
          Open the comparator
        </a>
      </article>
    );
  }

  // Design preview (NEXT_PUBLIC_ACCOUNT_PREVIEW=1). Dummy data; intended
  // for local design work only.
  const account: Account = {
    name: "Anika López",
    email: "anika@example.com",
    tier: "pro",
    renewsOn: "Jun 14, 2026",
    savedCap: 50,
    showOnboarding: true,
  };
  const savedCells: Cell[] = [];
  const watchlist: WatchRow[] = [];
  const recent: RecentRow[] = [];

  return (
    <article>
      {/* Both section grounds are gone and the masthead is a card instead.
          bg-cream-50 is #ffffff and fully opaque, so these two bands covered
          the photograph for the height of the page. A band is not a card.
          The mx-auto max-w-6xl px-6 goes with them: SiteChrome already gives
          this route max-w-content mx-auto px-6, so it was a 1024 column inside
          the site's 1072 with a doubled gutter. */}
      <section className="pt-10 pb-6">
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">Account</p>
              <h1 className="font-display mt-2 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900">
                {account.name}
              </h1>
              <p className="text-sm mt-1 text-cocoa-700">{account.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <TierChip tier={account.tier} />
              {account.tier === "pro" && account.renewsOn && (
                <span className="text-xs text-cocoa-700">Renews {account.renewsOn}</span>
              )}
            </div>
          </div>

          <nav role="tablist" className="mt-6 -mx-1 flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-semibold whitespace-nowrap ${
                    active
                      ? "bg-ink-900 text-white border border-ink-900"
                      : "bg-transparent text-cocoa-700 border border-transparent"
                  }`}
                >
                  <Icon size={13} aria-hidden="true" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* THE TAB PANEL IS ONE CARD. Each tab opens with an h2 and a line of
          copy that were bare on the page once the band came off, and the
          panels' own surfaces are cards inside it, so the panel is the natural
          place for the one translucent fill. Everything nested below therefore
          takes .atlas-card-soft: two translucent fills stacked only muddy the
          picture under both. */}
      <section className="py-8">
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
          {account.showOnboarding && tab === "saved" && (
            <OnboardingChecklist />
          )}

          {tab === "saved"    && <SavedCells cells={savedCells} cap={account.savedCap} />}
          {tab === "watch"    && <Watchlist rows={watchlist} />}
          {tab === "recent"   && <Recent rows={recent} />}
          {tab === "alerts"   && <Alerts />}
          {tab === "billing"  && <Billing account={account} />}
          {tab === "settings" && <Settings account={account} />}
        </div>
      </section>
    </article>
  );
}

function TierChip({ tier }: { tier: Tier }) {
  const map = {
    free: "bg-cream-100 border-parchment text-cocoa-700",
    pro:  "bg-atlas-50 border-atlas-200 text-atlas-700",
    team: "bg-ink-900 border-ink-900 text-white",
  } as const;
  const label = tier === "free" ? "Free" : tier === "pro" ? "Pro" : "Team";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 ${map[tier]}`}>
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
function SavedCells({ cells, cap }: { cells: Cell[]; cap: number }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink-900">Your saved cells</h2>
        <span className="inline-flex items-center gap-2 rounded-full text-xs font-semibold px-2.5 py-1 bg-cream-100 border border-parchment text-cocoa-700">
          <span className="tabular-nums text-ink-900">{cells.length} of {cap}</span> saved
        </span>
      </div>
      {cells.length === 0 ? (
        <p className="mt-6 text-sm text-cocoa-700">Star any cell to save it here.</p>
      ) : (
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cells.map((c) => (
            <li key={c.id}>
              <article className="atlas-card-soft p-5 h-full">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold text-atlas-700">
                    <span aria-hidden="true" className="text-base">{c.flag}</span>
                    <span className="text-cocoa-700">{c.sectorLabel}</span>
                  </span>
                  <button type="button" aria-label={`Remove ${c.question}`} className="w-8 h-8 flex items-center justify-center rounded-md text-cocoa-700/55">
                    <Trash size={14} aria-hidden="true" />
                  </button>
                </div>
                <p className="font-display mt-3 text-base font-semibold leading-snug tracking-[-0.01em] text-ink-900">{c.question}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display tabular-nums text-2xl font-bold leading-none tracking-[-0.02em] text-ink-900">{c.headline}</span>
                  <span className="text-xs text-cocoa-700">typical revenue</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Watchlist({ rows }: { rows: WatchRow[] }) {
  return (
    <>
      <h2 className="font-display text-xl font-semibold text-ink-900">Cells you're watching</h2>
      <p className="text-sm mt-1 text-cocoa-700">
        You'll get an email when these cells refresh or when a threshold you set is crossed.
      </p>
      <ul className="atlas-card-soft mt-5">
        {rows.map((r, i) => (
          <li key={r.id} className={`flex items-center justify-between gap-3 px-4 py-3 ${i > 0 ? "border-t border-parchment" : ""}`}>
            <div className="flex items-center gap-3 min-w-0">
              <span aria-hidden="true" className="text-lg">{r.flag}</span>
              <div className="min-w-0">
                <p className="font-medium truncate text-ink-900">{r.label}</p>
                <p className="text-xs text-cocoa-700">{r.condition}</p>
              </div>
            </div>
            <Toggle defaultOn={r.on} ariaLabel={`Notifications for ${r.label}`} />
          </li>
        ))}
      </ul>
    </>
  );
}

function Recent({ rows }: { rows: RecentRow[] }) {
  return (
    <>
      <h2 className="font-display text-xl font-semibold text-ink-900">Recently visited</h2>
      <ul className="atlas-card-soft mt-5">
        {rows.map((r, i) => (
          <li key={r.id} className={`flex items-center justify-between gap-3 px-4 py-3 ${i > 0 ? "border-t border-parchment" : ""}`}>
            <div className="flex items-center gap-3 min-w-0">
              <span aria-hidden="true" className="text-lg">{r.flag}</span>
              <div>
                <p className="font-medium text-ink-900">{r.label}</p>
                <p className="text-xs text-cocoa-700">{r.visitedAt}</p>
              </div>
            </div>
            <Link href={r.href} className="text-sm font-semibold text-atlas-700">Open</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function Alerts() {
  return (
    <>
      <h2 className="font-display text-xl font-semibold text-ink-900">Alert preferences</h2>
      <p className="text-sm mt-1 text-cocoa-700">
        Pick the cadence and the kinds of changes worth interrupting you for.
      </p>
      <div className="atlas-card-soft mt-5 p-5 space-y-4">
        {[
          { label: "Weekly digest email",         desc: "Monday morning, summary of moves in your watchlist." },
          { label: "Cell refresh emails",         desc: "Send when any saved cell is refreshed." },
          { label: "Threshold breach emails",     desc: "Send when a watched metric crosses a threshold you set." },
          { label: "Methodology updates",          desc: "Quarterly, when a sourcing or method change is published." },
        ].map((row, i) => (
          <div key={row.label} className={`flex items-center justify-between gap-4 ${i > 0 ? "border-t border-parchment pt-4" : ""}`}>
            <div>
              <p className="font-medium text-ink-900">{row.label}</p>
              <p className="text-xs text-cocoa-700">{row.desc}</p>
            </div>
            <Toggle defaultOn={i < 2} ariaLabel={row.label} />
          </div>
        ))}
      </div>
    </>
  );
}

function Billing({ account }: { account: Account }) {
  return (
    <>
      <h2 className="font-display text-xl font-semibold text-ink-900">Billing</h2>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="atlas-card-soft p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/70">Current plan</p>
          <p className="font-display mt-1 text-xl font-semibold text-ink-900">Pro · $19/mo</p>
          <p className="text-sm mt-1 text-cocoa-700">
            {account.renewsOn ? `Renews ${account.renewsOn}.` : "Renews monthly."} Cancel anytime.
          </p>
          <Link href="/pricing" className="inline-block mt-3 text-sm font-semibold text-atlas-700">Change plan</Link>
        </div>
        <div className="atlas-card-soft p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/70">Payment method</p>
          <p className="font-mono mt-1 tabular-nums text-ink-900">•••• 4242</p>
          <p className="text-sm mt-1 text-cocoa-700">Visa ending 4242 · expires 09/27</p>
          <span className="inline-block mt-3 text-sm font-semibold text-cocoa-700/50">Update card</span>
        </div>
      </div>

      {/* THE BILLING TAB IS A MOCKUP AND ITS CONTROLS NOW LOOK LIKE ONE.
          "Update card", "Download all" and the per-row "PDF" were <Link>s to
          /billing/card and /billing/invoices/<id>. There is no /billing route
          at all, so every one of them was a dead link dressed as an action, and
          the invoice rows below are hardcoded: three dates, three IDs and three
          $19.00 charges nobody was ever billed.

          They are spans now, in muted ink, so the layout the founder designed
          survives while nothing in it offers to do something it cannot.

          This whole component only renders when NEXT_PUBLIC_ACCOUNT_PREVIEW is
          set, which it is not by default, so none of it has been public. It is
          cleared because the flag exists to be flipped. */}
      <div className="atlas-card-soft mt-5">
        <div className="px-5 py-3 flex items-center justify-between border-b border-parchment">
          <p className="font-semibold text-ink-900">Invoices</p>
          <span className="text-sm font-semibold text-cocoa-700/50">Download all</span>
        </div>
        <ul>
          {[
            { date: "May 2026", amount: "$19.00", id: "INV-2026-0005" },
            { date: "Apr 2026", amount: "$19.00", id: "INV-2026-0004" },
            { date: "Mar 2026", amount: "$19.00", id: "INV-2026-0003" },
          ].map((i, idx) => (
            <li key={i.id} className={`px-5 py-3 flex items-center justify-between ${idx > 0 ? "border-t border-parchment" : ""}`}>
              <div>
                <p className="text-sm font-medium text-ink-900">{i.date}</p>
                <p className="text-xs font-mono text-cocoa-700">{i.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm tabular-nums text-ink-900">{i.amount}</span>
                <span className="text-sm font-semibold text-cocoa-700/50">PDF</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Settings({ account }: { account: Account }) {
  return (
    <>
      <h2 className="font-display text-xl font-semibold text-ink-900">Settings</h2>
      <form className="mt-5 max-w-xl space-y-5">
        <Field label="Name"     defaultValue={account.name}  />
        <Field label="Email"    defaultValue={account.email} type="email" />
        <Field label="Password" type="password" placeholder="••••••••" />
        <div className="pt-5 border-t border-parchment">
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/70">Danger zone</p>
          <p className="mt-1 text-sm text-cocoa-700">
            Deleting your account removes saved cells and history. Billing stops at the end of the current cycle.
          </p>
          <button type="button" className="mt-3 text-sm font-semibold text-atlas-700 underline-offset-4 hover:underline">
            Delete account
          </button>
        </div>
      </form>
    </>
  );
}

function Field({ label, defaultValue, type = "text", placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/70">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full px-3 h-10 rounded-md text-sm bg-cream-50 border border-parchment text-ink-900"
      />
    </label>
  );
}

function Toggle({ defaultOn, ariaLabel }: { defaultOn?: boolean; ariaLabel?: string }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => setOn((v) => !v)}
      className={`inline-flex items-center ${on ? "bg-atlas-600" : "bg-ink-200"}`}
      style={{
        width: 40,
        height: 22,
        borderRadius: 999,
        padding: 2,
        transition: "background 160ms ease",
      }}
    >
      <span
        className="block bg-white"
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          transform: on ? "translateX(18px)" : "translateX(0)",
          transition: "transform 160ms ease",
          boxShadow: "0 1px 2px rgba(26,26,26,0.15)",
        }}
      />
    </button>
  );
}
