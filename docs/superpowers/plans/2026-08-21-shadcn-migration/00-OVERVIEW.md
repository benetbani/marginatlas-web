# 00 — OVERVIEW. The library becomes the site.

**Date:** 2026-08-21
**Decision:** the founder's, this session, verbatim in substance: *"I think I'm
siding with the library over here rather than these custom components that you
have tried to create."*

**One sentence:** stop hand-rolling UI, put the site on the shadcn substrate it
already owns a licence for, and change **nothing a reader reads** while doing it.

---

## 1. What the founder said, and why he is right

> *"I purchased ShadCN components. Like, those are... that was a massive
> package, and I spent, like, one hundred forty dollars. And I have a feeling
> that we are completely avoiding that thing... You are unable to understand the
> wealth of resources you are sitting in... these sections, they are ready to
> use. They are fucking ready to use."*

And the reasoning he gave for siding with the library, which is the actual
argument and should govern every decision in this plan:

> *"your sections have been mediocre most of the times and prone to a lot of
> errors. So the standardization with this kind of components removes a lot of
> errors and pain. And furthermore, the code can be modified, and if there is
> some text that's needed, it can just be added to the code."*

He is not asking for a prettier site. He is asking to **stop paying the defect
tax on bespoke components**. That is a maintenance argument, and it is correct.

---

## 2. The four findings that make this cheap, all verified this session

This is not a rewrite. Almost all the plumbing is already in place and unused.

### Finding 1: the licence is wired up and has never been used

`components.json` registers the paid registry:

```json
"registries": {
  "@shadcnblocks": {
    "url": "https://www.shadcnblocks.com/r/{name}",
    "headers": { "Authorization": "Bearer ${SHADCNBLOCKS_API_KEY}" }
  }
}
```

`SHADCNBLOCKS_API_KEY` **is set** in `.env.local`. Number of references to
`shadcnblocks` anywhere in `src/`: **zero**. Nothing has ever been pulled.

> **CORRECTED 2026-08-21: THE WIRING IS RIGHT, THE CREDENTIAL IS NOT WORKING.**
> This section originally read the configuration as proof the licence was live.
> When Phase 7 actually tried to pull a block, both a raw request and the
> official CLI returned **401 Authentication failed**, identical with the key and
> without it. The `registry.json` index that looked like proof is **public**: it
> returns 200 with no key at all, so it proved the catalogue is readable and
> nothing about the licence. See `05-BLOCK-SHORTLIST.md` for the two-minute fix,
> which only the founder can perform.

### Finding 2: THE SKIN CONTRACT ALREADY EXISTS. This is the big one.

shadcn components are plain Tailwind plus `cn()`, and they read **semantic
tokens**: `bg-muted`, `text-foreground`, `border`, `bg-card`. They do not carry
their own colours.

Every one of those fifteen tokens is **already declared** in
`src/app/globals.css`:

```
--background --foreground --card --card-foreground --popover --primary
--secondary --muted --muted-foreground --accent --accent-foreground
--destructive --border --input --ring
```

**Therefore a shadcn component dropped into this repo wears the atlas skin on
arrival.** The re-skinning work that `FORM-CATALOG.md` warns about, "take only
the legibility, never their aesthetics", is *already done*, as a token bridge,
and nobody knew. This is the single fact that turns a rewrite into a swap.

### Finding 3: the substrate is half-installed already

| Present | Missing |
|---|---|
| `components.json`, correctly configured | 24 of 46 shadcn components |
| 22 files in `src/components/ui/` | the blocks library, entirely |
| Radix: accordion, separator, slot, tabs, tooltip | most other Radix primitives |
| `cva`, `tailwind-merge`, `lucide-react`, `cn()` | |
| recharts + `ui/chart.tsx` (installed 2026-08-21) | |

### Finding 4: the bespoke surface is large and is where the defects live

| | count |
|---|---|
| `.tsx` files under `src/components` | **319** |
| primitives in `src/components/ui/` | 22 |
| hand-rolled chart primitives in the spine kit | **16** |
| further chart files under `components/kit/charts` | 13 |
| graphics that mount nowhere (readiness ledger G34) | ~30 |
| duplicate surfaces (G33): percentile charts / money-flow / month charts / gauges / things named Waterfall | 6 / 5 / 5 / 9 / 3 |

The founder's "prone to a lot of errors" is measurable: nine gauge geometries and
six percentile charts that disagree on axis, two of them logarithmic.

---

## 3. The strategy, in one paragraph

**Replace the SUBSTRATE, keep the SECTIONS.** Every page keeps its sections, its
order, its words and its numbers. What changes is what those sections are *built
out of*: a shadcn `Table` instead of a hand-rolled `<table>`, a shadcn `Chart`
instead of inline SVG, a shadcn `Tabs` instead of a bespoke switcher. The reader
should not be able to tell a migration happened, except that things stop being
subtly broken.

**The founder's constraint, and it is the hardest rule in this plan:**

> *"this is a new design thing. The replacement of elements should not impose
> changes on the content unless they were all due to be changed beforehand."*

So: a swap may change how a thing **looks and behaves**. It may not change what
it **says** or what it **claims**. Where a component's content was already
scheduled to change by a prior ratified decision, that change proceeds; nothing
new gets invented under cover of a migration. `04-GUARDRAILS.md` makes this
mechanically checkable.

---

## 4. What this plan is NOT

- **Not a redesign.** The palette, the type ladder, the frame, the card
  treatment and the section order are all settled and stay settled.
- **Not a content edit.** See above. This is the rule most likely to be broken
  by accident, because a shadcn component often *invites* a caption or a footer
  that the old one did not have. Decline the invitation.
- **Not "delete the kit".** Several bespoke primitives have no shadcn
  equivalent and are genuinely good: the spectra table, the survival slope, the
  stepped waterfall of the money identity. `01-INVENTORY.md` marks those KEEP.
- **Not a excuse to ship the shadcn look.** Rounded candy bars, gradient hero
  cards, "Trending up 5.2%" footers and the default blue-violet chart palette
  are all forbidden and all arrive by default. Every import is a re-skin.

---

## 5. Read next

| File | What it settles |
|---|---|
| `01-INVENTORY.md` | Every bespoke surface, and its verdict: REPLACE, KEEP, or RETIRE |
| `02-SKIN-CONTRACT.md` | The token bridge, the type ladder, and what must never be taken from shadcn |
| `03-MIGRATION-PHASES.md` | The ordered work, smallest blast radius first |
| `04-GUARDRAILS.md` | The content-cannot-change rule, made mechanical, plus gates |
| `KICKSTART-PROMPT.md` | The paste-in prompt that starts the work |
