# Monetization Milestone 3: Premium Tools (Plan)

> Same constraints as M1/M2: commit on `reform-v2/palette-brick`, ship by
> fast-forward to main, per-file staging, secrets only in env. Everything builds
> **dormant** behind `NEXT_PUBLIC_GATING_ENABLED` + the tier check, so production
> is unchanged until activation (see `docs/handoff/2026-06-09-activation-runbook.md`).

**Goal:** the Premium ($77) tier earns its price with tools, not just deeper
numbers: richer exports, deeper neighborhood data, side-by-side comparison, and
alerts. All gated through the same `getSessionTier()` + authed-API pattern M2-3
established.

## Shipped (M3-1): export gating

`/api/export-csv` now tiers the export. The free single-row CSV (with its
watermark / citation header) stays free as a lead magnet and anti-scrape signal.
The **year-by-year history** block (`?history=1`) becomes a **Premium** unlock
when gating is on:

- Gate off (default): history is free for everyone, exactly as before.
- Gate on: a history request is resolved per-user (`getSessionTier()`), served
  only to Premium, and returned `private, no-store` so the shared edge cache can
  never serve one viewer's entitled export to another. Non-Premium gets the free
  rows plus a one-line "history is a Premium export" note.

This is the template for the rest of M3.

## Planned (M3-2 .. M3-4)

### M3-2: deeper neighborhood data (Premium)
The neighborhood micro-market pages carry street-level rent, average spend per
visit, and district day/night dynamics (curated flagships, modeled tail). Gate
the **deepest** of these (the per-street spend + the rhythm detail) behind
Premium with the same `GatedTakeHome`-style island: static page ships the
redacted placeholder, the entitled browser reveals via an authed
`/api/neighborhood-depth`. The headline multiplier and character stay free.
Effort: medium. New: one reveal route, one client island, gate ~2 fields.

### M3-3: side-by-side comparison (Premium)
The `/compare` grid is free for up to 3 cities. Premium unlocks **saved
comparisons** (persist a comparison set to the account) and a **4th/5th column**.
Reuse the saved-cells table shape from M1 for persistence; gate the extra columns
behind the tier check at render (the data already flows through
`/api/cell-lookup`, which already redacts the gated take-home).
Effort: medium. New: a `saved_comparisons` table + a small client control.

### M3-4: alerts on watched cells (Premium)
Email when a watched cell's numbers change materially. This is the largest piece:
needs a scheduled job (compare the latest cell figures against the last-notified
snapshot in `watchlist`/`recent_cells`) and an email sender. Build the watch +
snapshot capture first (credential-free), wire the email send last (needs the
sender configured, a founder-only step). Gate the "add alert" affordance behind
Premium.
Effort: large. New: a cron, a diff job, an email integration.

## Sequence
M3-1 (done) -> M3-2 -> M3-3 -> M3-4. Each ships dormant and is verified on a
flag-on preview (free state redacts, Premium state reveals) before the flag is
flipped. M3-4 is the only one with a founder-only external dependency (the email
sender); the rest are fully credential-free to build.
