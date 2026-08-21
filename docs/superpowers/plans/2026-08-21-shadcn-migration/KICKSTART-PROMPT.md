# KICKSTART PROMPT

Paste everything between the rules into a fresh session.

---

You are picking up a ratified migration on marginatlas.com. Working directory:
`E:\atlas\website`.

**The decision, made by the founder on 2026-08-21 and not open for
re-litigation:** the site moves onto the shadcn/ui substrate it already owns a
paid shadcnblocks licence for, and stops hand-rolling UI. His reasoning, which
should govern every judgement call you make:

> *"your sections have been mediocre most of the times and prone to a lot of
> errors. So the standardization with this kind of components removes a lot of
> errors and pain. And furthermore, the code can be modified, and if there is
> some text that's needed, it can just be added to the code."*

This is a maintenance argument, not an aesthetic one. He is buying fewer defects.

## Step 1 , read these, in this order, before touching anything

1. `docs/superpowers/plans/2026-08-21-shadcn-migration/00-OVERVIEW.md`
   , the decision, and the four findings that make it cheap
2. `docs/superpowers/plans/2026-08-21-shadcn-migration/01-INVENTORY.md`
   , every bespoke surface with a verdict: REPLACE, KEEP or RETIRE
3. `docs/superpowers/plans/2026-08-21-shadcn-migration/02-SKIN-CONTRACT.md`
   , the token bridge, the type ladder, and what to refuse from shadcn
4. `docs/superpowers/plans/2026-08-21-shadcn-migration/03-MIGRATION-PHASES.md`
   , the seven phases, in order
5. `docs/superpowers/plans/2026-08-21-shadcn-migration/04-GUARDRAILS.md`
   , structure adapts and substance does not, plus every trap already paid for

Then the standing authorities:

6. `E:\atlas\rules\DESIGN-RULEBOOK.md` , Rule 0 governs everything
7. `E:\atlas\rules\FORM-CATALOG.md` , the legal visual vocabulary. **It has
   named shadcn/ui, shadcnblocks and Recharts as sanctioned sources since
   2026-06-16.** A previous session read "take only their legibility, never
   their aesthetics" as "build it yourself" and hand-rolled 29 charts. Do not
   repeat that.
8. `docs/superpowers/specs/2026-08-21-founder-interview-decisions.md` , forty
   rulings from that day, including replace-never-cut and the review format
9. `CLAUDE.md` , working method and hard constraints

## Step 2 , the four facts you are starting from

All verified on 2026-08-21. Re-verify anything you intend to act on.

1. **The licence is wired up and has never been used.** `components.json`
   registers `@shadcnblocks` with a bearer token; `SHADCNBLOCKS_API_KEY` is set
   in `.env.local`; references to it in `src/`: **zero**.
2. **The skin contract already exists.** All fifteen shadcn semantic tokens
   (`--background`, `--card`, `--muted`, `--primary`, `--border` and the rest)
   are already declared in `src/app/globals.css`. **An imported shadcn component
   wears the atlas skin on arrival.** This is what turns a rewrite into a swap.
3. **The substrate is half-installed.** `cva`, `tailwind-merge`, `lucide-react`,
   `cn()`, 22 files in `src/components/ui/`, and Radix accordion / separator /
   slot / tabs / tooltip, four of which nothing imports. recharts and
   `ui/chart.tsx` were added 2026-08-21.
4. **The bespoke surface is 319 `.tsx` files**, including **29 chart
   implementations**, 9 gauge geometries, 6 percentile charts (2 logarithmic),
   5 month-of-year charts that disagree on baseline, and 3 things named
   `Waterfall`.

## Step 3 , START WITH PHASE 0. It is blocking.

**Do not migrate anything until a client component can be photographed.**

The screenshot instrument this project relies on renders routes with
`react-dom/server` into a static file. Client components do not run, so recharts
draws **nothing**. A bar chart built on 2026-08-21 is committed and **unverified**
for exactly this reason. The Playwright MCP, named in
`docs/verification-protocol.md` as the sanctioned instrument, disconnected
mid-session and did not return.

Also know: the dev server took **67 seconds** to serve the homepage on this
machine, which has 8GB total and was down to **777MB free** with the founder's
own applications running. Kill stray node processes before you start and expect
it to be slow.

Phase 0 delivers a working hydrated-page screenshot path, and writes down which
instrument is authoritative.

**Phase 0 also delivers `scripts/verify_content_unchanged.ts`**, because the
founder's hardest constraint on this migration is:

> *"this is a new design thing. The replacement of elements should not impose
> changes on the content unless they were all due to be changed beforehand."*

A content diff written after a migration proves nothing about that migration.
Build it first. `04-GUARDRAILS.md` section 2 specifies it.

## Step 4 , then work the phases in order

```
0  verification path        BLOCKING
1  retire dead components   ~30 mount nowhere, 9 more only from a folder with no URL
2  tables                   13 files have a <table> with NO scope; 0 sticky headers;
                            the house tabular-figures rule is used ZERO times
3  interaction              start with the currency switcher: it is why the trade
                            page scrolls sideways at 375
4  charts, bars             [you decide the axis, see Step 5]
5  charts, the rest         9 gauges become 1
6  forms                    substrate only. Do NOT build sign-in here
7  blocks                   the purchase, finally used
```

**Stop at every phase boundary** and hand the founder a before/after file. His
ratified review format is one file he opens, both widths, full length.
`scripts/build_compare.mjs` builds it and is gated.

## Step 5 , SOLVE THESE. Do not hand them back.

**AMENDED 2026-08-21 by the founder, and this reverses the original step.** He
said, of the list that used to live here:

> *"you should just push forward and define solutions for their problems. Like,
> you should just find solutions and then push forward. That's your point.
> That's your problem. The percentile axis, I have no idea. I have no idea about
> that. You should try to understand. And that's the whole point. It's a major
> process, and you should move forward with it."*

So these are **yours to research and decide**, with the reasoning written down:

1. **The percentile axis.** Six percentile charts, two logarithmic. Read what
   each one plots and what a reader is meant to take from it, decide, and record
   why. A log axis is defensible when a spread runs over orders of magnitude and
   indefensible when it flatters a narrow one. **Measure the actual spreads
   before choosing.**
2. **Which blocks.** Shortlist against surfaces the site genuinely lacks, and
   propose. Do not wait to be told.
3. **The marks contradiction.** The August ADR is newer and wins by the
   rulebook's own tiebreak. Apply that, edit the July rule text to record the
   reversal, and rescope or retire the gate that still enforces it.

**The colour schema is NOT one of these, and it never was.** It is written down
in `docs/design-system/TOKENS.md` and in the ramp's own comments in
`src/lib/design-tokens.ts`. A session on 2026-08-21 reported a palette problem
that did not exist by reading a light tint as the primary accent. **Read the
guide first.**

## Step 6 , the rules you will break by accident if you do not re-read them

- **Never `shadcn add --overwrite`.** It clobbered the customised `card.tsx` on
  2026-08-21, losing the variant prop that maps to `.atlas-card`.
- **A typecheck is not a render.** A nested `<Bar>` for per-bar colour
  typechecks clean and draws a second series over the first. recharts types
  children loosely. Per-datum styling is `<Cell>`.
- **Inside `.av2`, padding must be inline.** `.av2, .av2 * { padding: 0 }` is
  specificity (0,1,1) and beats every Tailwind padding class. Cost twice in one
  hour.
- **Refuse, on every import:** the 5-hue chart palette, `radius={8}`, legends,
  "Trending up 5.2%" footers, `CardDescription` under every title, drop shadows,
  gradients, wholesale lucide icons, animated chart entry.
- **The type ladder is a ratchet that counts down only.** Ten steps, 10px to
  48px. An import that adds an off-ladder size fails the build. Seven of the ten
  steps are Tailwind defaults, so most shadcn sizes already land correctly.
- **One accent.** Terracotta on answers only. Distinguish series by lightness,
  never by adding a hue.

## Step 7 , how to report

Report about the **site**, never the code. No file paths, no function names, no
line numbers. He has said this twice and he means it.

Never push. Never deploy. Never run `npm run build`. Never raise a ratchet
baseline. Never fabricate a figure. Never touch the homepage H1.

## Step 8 , prove you are oriented before you start

Answer these in five to ten lines:

1. Why is Phase 0 blocking, and what specifically cannot be verified without it?
2. What is the token bridge, and why does it mean this is a swap rather than a
   rewrite?
3. What may a migration change, and what may it never change?
4. Name three things that arrive by default from shadcn and must be refused.
5. What are the three decisions that are the founder's and not yours?
6. Why does a clean typecheck not mean a chart renders?

Then stop and wait for his go.
