# 00 , Ideology and design law (the visual upgrade)

The law every page in this upgrade obeys. Read before touching a page spec. The
per-page specs (02-07) tell you WHAT goes where; this file tells you HOW it must
look, feel, and behave, and what is non-negotiable.

## 0. The mandate
A full visual upgrade of all page types to the highest grade we can produce.
The role is LEAD DESIGNER on a high-stakes product, not a parts-assembler. The
output of each page must survive four questions, asked out loud, before it ships:

1. Does it make sense at a glance (answer first, one clear focal point)?
2. Is it cringe (generic, busy, try-hard, "AI made that")?
3. Does the typography work (scale, hierarchy, rhythm, measure, tabular figures)?
4. Can it be made quieter, cleaner, better? If yes, do that, then ask again.

If any answer fails, it is not done.

## 1. The thesis (the look)
Premium COMMERCIAL SAAS. The reference pole is Stripe / Linear-grade craft:
confident, spacious, calm, sales-aware, expensive-feeling. Big confident type,
generous whitespace, one loud accent, restrained color, real numbers doing the
talking.

It is explicitly NOT:
- data-journalism / almanac density (the founder rejected Levels / OWID / Numbeo
  as targets: free non-profit tools with hundreds of contributors; we are a
  commercial product and must read like one),
- a dense wall of sections,
- flashy / animated / "design-engineer eye-candy" (no meteors, beams, sparkles,
  gradient text, glassmorphism).

"Less dense" is achieved by whitespace, fewer-but-bigger sections, and collapsing
unheld sections into one calm strip, NEVER by dropping a required section.

## 2. The lead-designer QA bar (run on every section AND every page)
- One focal point per screen. The eye lands on the answer first.
- It breathes: section rhythm varies, padding is generous, nothing is crammed.
- Type: Newsreader (display) for the page headline and the single hero number;
  Inter (sans) for all else. Steps differ by >= 1.25 ratio. Tabular lining
  figures on every number. Body measure 65-75ch. No flat scales.
- Color strategy: Restrained-to-Committed. Atlas terracotta is the ONE loud
  accent; moss only for kept/positive; amber caution-only; neutrals (cream/ink/
  cocoa) do the work. Never a second loud color.
- Motion: minimal, ease-out only, the shared `ds-slide-up` under `motion-safe`.
  No bounce, no decorative animation.
- Absolute bans (impeccable): no side-stripe accent borders, no gradient text,
  no glassmorphism-by-default, no lazy hero-metric template, no identical card
  grids repeated, no modal-as-first-thought.
- Web-interface basics: WCAG AA contrast, visible focus states, 44px tap
  targets, legible at 375px with NO horizontal scroll, real empty/loading/error
  states.
- The AI-slop test: if someone could say "AI made that" without doubt, redo it.

## 3. Tokens (the only colors, sizes, motion that exist)
Source of truth: `src/lib/design-tokens.ts`. Warm Atlas palette:
- `atlas` terracotta = the one loud accent (atlas-600 surfaces, atlas-700 text).
- `cream` = warm paper ground (cream-75 page, cream-50 card, cream-300 hairline).
- `ink` = warm near-black text ladder (ink-900 headline, ink-600/500 body/muted).
- `cocoa` = muted neutral mass.
- `moss` = kept / positive only. `amber` = caution only. `teal` < 5% if at all.
Fonts: Newsreader (`--font-display`), Inter (`--font-sans`).
No raw hex / px / ms / font-name in any component. The Atlas-to-shadcn token map
that themes the whole block library lives in `01-component-and-chart-system.md`.

## 4. The honesty boundary (LOCKED, non-negotiable)
Carried verbatim from the constitution and the data model (`cell_view.ts`):
- Real data where held. London / UK is the ONE founder-sanctioned filled
  exemplar (rich verdicts, risks, wages, seasonality, first-year, locals).
- Everywhere else: real where it exists, else a calm, clearly-tagged
  "still filling in" / SectionEmpty / SAMPLE placeholder. NEVER a real-looking
  invented number. NEVER a blank. Long runs of unheld sections collapse into ONE
  calm strip.
- `moneyShown = isLondon || isTrustedLocal` gates the cell anchor / spread /
  take-home / per-$100 split / plain-terms / break-even.
- Trusted-local link-gate on the /opening cross-link (291 broken links withheld).
- NEVER rank across business x geography. Cities are the ONLY scored entity
  (Business Climate Score). A country never ranks its own cities. Districts are
  never compared to whole cities. Never badmouth an industry. Consulting / PE are
  clients, not subjects.
- No em-dashes in user-visible copy. No source-agency names. No URL slug renames.

## 5. What is LOCKED vs what we change
LOCKED (do not touch): the per-page-type SECTION ORDERS. Authority is
`docs/brand/section-constitution.md`; machine-enforced by
`src/lib/page-sections.ts` + `src/lib/page-layout/section-order.ts` and the gates
`verify_page_sections` + `verify_section_order`. Every required section stays,
in order. A required section is never dropped, renamed, or reordered without
changing the constitution doc first.

WE CHANGE: the look, spacing, typography, the component used per section, the
chart treatment, the density. The visual grade, not the information architecture.

## 6. Delivery format
Deliverables for founder review are STATIC, SELF-CONTAINED HTML mockups, one per
page type, openable by double-click (no server, no browser automation, ever , see
the no-browser-automation memory). They are built from the real component
vocabulary (shadcnblocks blocks + the re-skinned visx chart kit), on the warm
token map, with real or exemplar data, to the highest grade. Format precedent:
`E:\atlas\london-prototype-v1.html`. After the founder approves the direction,
the same compositions are ported into the real Next.js app (on the Supastarter
shell, Tailwind v4 + shadcn), which is bought a little later.

## 7. The operating pivot (still in force)
The founder approves WHOLE PAGES, not 48 per-section decisions. The AI composes
each page from the vetted block + chart vocabulary (the vocabulary IS the design;
the AI does not invent a new visual language) and tones it to this law. The
founder reacts: closer / off, bolder / quieter. We iterate on whole pages.
