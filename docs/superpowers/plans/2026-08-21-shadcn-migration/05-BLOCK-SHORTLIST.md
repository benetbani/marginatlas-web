# 05 — THE BLOCK SHORTLIST

**Date:** 2026-08-21
**Status:** shortlist ready, **installation BLOCKED on the founder**.

The founder's instruction on this was explicit: *"Which blocks. Shortlist
against surfaces the site genuinely lacks, and propose. Do not wait to be told."*
So the shortlist is below, ready to install the moment the blocker clears.

---

## THE BLOCKER, and only the founder can clear it

**The shadcnblocks API key is being rejected.** Confirmed by two independent
paths, so this is not a tooling quirk:

| path | result |
|---|---|
| raw request with the key | **401 Authentication failed** |
| raw request WITHOUT the key | **401**, byte-identical |
| the official `shadcn` CLI | **401**, "You are not authorized to access the item" |

The key is present and correctly wired: 40 characters, prefix `sk_l`, sitting in
`.env.local` as `SHADCNBLOCKS_API_KEY`, referenced from `components.json` in the
form the service's own error message documents. Nothing about the configuration
is wrong. **The credential itself is not being accepted.**

**A correction to an earlier claim in this plan.** `00-OVERVIEW.md` said the
licence "is wired up" on the evidence that `registry.json` returned HTTP 200
with 1.4MB. That index is **public**: it returns 200 with no key at all. The 200
proved the catalogue is readable, not that the licence is live. The wiring is
right; the credential is not working.

### What to do, roughly two minutes

1. Sign in at `https://shadcnblocks.com/dashboard/api`.
2. Check whether the key beginning `sk_l` is still listed and active.
3. If it is missing, expired or revoked, generate a new one.
4. Replace the value of `SHADCNBLOCKS_API_KEY` in `E:\atlas\website\.env.local`.

Nothing else changes. `components.json` is already correct.

---

## WHAT THE LICENCE ACTUALLY CONTAINS

**3,968 blocks.** Read from the public index, so this is a real count.

| family | n | relevance here |
|---|---|---|
| feature | 312 | |
| bento | 283 | |
| hero | 247 | homepage, the page he wants to wake up to |
| **chart** | **112** | **the weakest area on the site** |
| **pricing** | **96** | there is a pricing page today |
| footer | 44 | |
| **login** | **41** | **there is no auth UI at all** |
| blog | 39 | there is a blog |
| table | 38 | |
| contact | 30 | |
| stats | 29 | |

---

## THE SHORTLIST

Ordered by how much a verified weakness it answers. Every one still gets the
re-skin ritual in `02-SKIN-CONTRACT.md` on arrival: the five-hue palette, the
rounded candy bars, the legends, the "Trending up 5.2%" footers and the card
furniture are all refused.

### 1. `chart-card15`, a waterfall. **Install this first.**

*"A waterfall chart showing how an initial value changes through a series of
increases and decreases to reach a final total."*

This is the site's signature money moment: where each hundred of sales goes,
from takings down to what the owner keeps. `FORM-CATALOG.md` calls the stepped
waterfall the signature money moment under rule 31, and the site currently has
**two** separate components named `Waterfall` plus a `SteppedWaterfall`.

It is also the single chart the whole product is about, and it is hand-rolled.

### 2. `chart-card11`, a horizontal 100% stacked bar

*"A horizontal 100% stacked bar chart showing proportional breakdown across
categories."*

Replaces `ShareStack`, the lone 2-3 way percentage split. The 100%-normalised
form is exactly the local rule that segments must sum to a whole.

### 3. `chart-card17`, a half-circle gauge with a needle

*"A speedometer-style half-circle gauge with needle indicator and colored
performance zones."*

Matches the existing `Gauge` shape one for one. **The coloured performance zones
must be stripped**: this site has one accent and a zone system would put three
new hues on the page, which `02-SKIN-CONTRACT.md` treats as a structural defect
rather than a cosmetic one.

### 4. `chart-card16`, a circular progress ring

*"A circular progress ring showing percentage completion toward a goal with
centered value."*

Matches `MarginIndexBadge`, the score ring. Note its own local rule: it renders
nothing until the composite score exists, and never a fabricated zero.

### 5. `pricing100` or `pricing106`, a monthly/yearly switch

Both carry a period switch, which the current pricing page has no version of.
**Read `04-GUARDRAILS.md` first:** the block ships with its own tiers, prices and
feature lists, and none of those may land. If the block has three tiers and the
site has two, the block gets two. **The content does not bend to the block.**

### 6. `login1` through `login5`, for the auth plan. NOT NOW.

Listed because the founder raised accounts and the paid tier earlier this
session and there is no sign-in UI anywhere. `03-MIGRATION-PHASES.md` phase 6 is
explicit that sign-in is a separate plan and must not be built during this
migration. This entry exists so that plan starts from a block rather than from
another bespoke form.

---

## WHAT IS NOT ON THE SHORTLIST, and why

- **hero, bento, feature (842 blocks between them).** The homepage H1 is locked
  and the band order is ratified. A hero block would arrive wanting to replace
  both. If the founder wants the homepage reconsidered that is a design
  conversation with crops, not a block install.
- **footer, contact, blog.** No verified defect. `01-INVENTORY.md` marks the
  chrome KEEP.
- **stats-card family.** The site's own stat tiles are fine, and the ones with
  trend indicators and percentage-change badges would need a period-over-period
  comparison the atlas does not hold. A block that invites a figure the data
  cannot supply is a liability, not a shortcut.

---

## The order of work once the key is fixed

1. `chart-card15`, re-skinned, on the workshop route, photographed.
2. Founder looks. If the skin is right, the other three chart blocks follow the
   same path.
3. Pricing only after the chart blocks prove the re-skin ritual holds.
4. Auth blocks belong to the accounts plan, not this one.
