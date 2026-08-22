# 06 — WHAT HAPPENS THE MOMENT THE KEY WORKS

**Date:** 2026-08-21
**Status:** waiting on one credential. Everything below is ready to run.

---

## STEP 0. GET THE KEY (two minutes, founder only)

1. Go to **shadcnblocks.com** and sign in with the account that bought the licence.
2. Open **Dashboard**, then the **API** section. The address is
   `https://shadcnblocks.com/dashboard/api`.
3. If a key is listed, it is not working: **revoke it and generate a new one**.
   If none is listed, generate one. It looks like `sk_l...`.
4. Open `E:\atlas\website\.env.local`, find the line starting
   `SHADCNBLOCKS_API_KEY=`, and replace everything after the `=` with the new key.
   **Paste it yourself.** Nothing else in the file changes.

Then say "key is in" and the work below starts.

---

## THE TEST THAT SAYS IT WORKED

One command, ten seconds, no side effects. It either prints a block or prints
401:

```
npx shadcn@latest view @shadcnblocks/chart-card15
```

---

## THE RITUAL EVERY BLOCK GOES THROUGH

No block ships as it arrives. Each one runs the same five steps, and step 3 is
where most of the work is.

1. **Pull it to a workshop route.** Never straight onto a reader page.
2. **Photograph it untouched.** The "as bought" state, for comparison.
3. **Strip what the library ships on by default.** Every one of these arrives
   switched on and every one is refused:
   - the five-hue chart palette (this site has ONE accent, terracotta, and it
     marks the answer and nothing else)
   - rounded candy bars, which make short bars read as taller than they are
   - the legend, replaced by direct labels
   - the "Trending up 5.2%" footer, which is an invented figure
   - the card furniture, headings and descriptions that duplicate the section
     heading already above it
   - any font the block names for itself
4. **Photograph it re-skinned, beside the thing it replaces.**
5. **Founder looks.** Only then does it move to a reader page.

## THE ONE RULE THAT DECIDES ARGUMENTS

**Structure adapts. Substance does not.**

The block's shape wins: if it wants two columns and a period switch, the content
reflows into two columns with a period switch. The block's CONTENT never lands:
if a pricing block ships three tiers and the site sells two, the block gets two.
Sample prices, sample features, sample company names and sample percentages are
deleted on arrival, not "adjusted later".

---

## THE ORDER OF WORK

### 1. `chart-card15`, the waterfall. First, and it is a re-run.

The money identity is ALREADY on the chart library as of today, hand-built on
recharts, mounted on the cell page, with a duplicate deleted. So this block is
not needed to unblock anything. It gets pulled anyway, for one reason: to see
whether a professionally built waterfall does something the hand-built one does
not. If it does, the differences get taken. If it does not, that is a finding
worth having, and it is recorded rather than quietly dropped.

### 2. `chart-card11`, the 100% stacked bar

The site's share bar is currently a row of coloured divs. It is honest and it
self-omits when the segments fail to sum, so this is a straight comparison, not
a rescue.

### 3. `chart-card17`, the half-circle gauge

**Its coloured performance zones must be stripped.** Three new hues on a
one-accent site is a structural defect, not a cosmetic preference.

### 4. `chart-card16`, the progress ring

Compare against the score ring on the leaderboard. Note the likely outcome
before starting: the existing ring is 44px, renders on the server, and there are
dozens of them on one page. A charting library redraws each one in the browser.
If the block loses on that, it loses.

### 5. Pricing, `pricing100` or `pricing106`

Only after the chart blocks prove the ritual holds. These carry the monthly and
yearly switch the pricing page has no version of. **The block's tiers and prices
may not land.**

### 6. Sign-in blocks. NOT in this plan.

There is no sign-in surface anywhere on the site. That belongs to the accounts
work, not to a chart migration. Listed here only so that work starts from a
block instead of another hand-built form.

---

## WHAT IS DELIBERATELY NOT BEING TOUCHED

Of 3,968 blocks, 842 are heroes, bentos and feature sections. **None of them are
being used.** The homepage headline is locked and the band order is ratified, so
a hero block arrives wanting to replace both. If the homepage is to be
reconsidered, that is a design conversation with pictures, not a block install.

Also skipped: footers, contact forms and blog layouts, which have no verified
defect. And the stats-card family, whose trend badges and percentage-change
arrows need a period-over-period comparison this atlas does not hold. **A block
that invites a figure the data cannot supply is a liability, not a shortcut.**

---

## THE QUALITY CHECKS, RUN ON EVERY BLOCK

Not aspirations. Each one already exists and runs.

| check | what it catches |
|---|---|
| typecheck | broken imports, wrong prop shapes |
| the 114-gate chain | raw hex, off-ladder type, banned colours, em-dashes, layering |
| the content diff | any reader-visible word or figure the swap changed |
| a photograph at 320, 480 and 760 wide | text that scales with its box, labels that collide |
| identity checks on any chart that sums | a split that does not add back up to its total |

And the rule that outranks all of them, learned twice today: **a typecheck is
not a render.** Two real defects in the waterfall, colliding labels and a label
whose second line was silently cut off, were invisible to every automated check
and obvious the moment it was drawn. Nothing is called done until it has been
looked at.

---

## THE HONEST RISK

The machine is short of memory. The dev server died three times today at under
half a gigabyte free, so blocks are verified by rendering them to a standalone
sheet rather than photographing them in a live browser. That proves the drawing
and does not prove the browser. Where a block depends on real browser behaviour,
tabs, popovers, a period switch, that gap has to be closed before it ships, and
it will be named rather than glossed.
