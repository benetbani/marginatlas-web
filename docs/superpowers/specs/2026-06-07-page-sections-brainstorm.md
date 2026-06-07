# Page-Type Sections: Research + Brainstorm (2026-06-07)

Comprehensive per-page-type section brainstorm, grounded in the product bible (`docs/strategy/REFORMATION-BIBLE.md`, 26 sections, cited as S#), its per-page blueprint (`docs/strategy/PAGE-SKELETONS.md`, "PS §#"), the editorial style guide (`docs/specs/2026-05-19-site-editorial-style-guide.md`), and the latest taste (the 2026-06-07 update at the end of `docs/strategy/2026-06-06-VISION-AND-ROADMAP.md`: clean data tool not magazine; craft on cell pages; numbers lead; gated-premium-depth this year). For each of the 10 main page types: purpose, current sections (live), what the bible prescribes, and the open design decisions.

## Cross-cutting principles (apply to every page)
1. Decision-first: lead with the answer, not a description (S1/S5).
2. Dashboard-first: a stat-grid perceivable in seconds at the top; prose drops below; "numbers lead, a little prose" (S5/S14 + 2026-06-07).
3. Name-the-catch: never an upside without the thing that can kill it (S25).
4. Honest dashes / self-omit; never "coming soon", zeros, or "low confidence" badges (S9/S19).
5. No fake precision; when unsure show ONE clearly-tagged estimate (2026-06-07), modeled = one quiet methodology line per block, never per-row badges.
6. Scores 0-100, banded, no decimals, higher-better, shown only when defensible; the score suggests, not commands (S10 + 2026-06-07).
7. Margin and owner take-home are different stories, kept distinct (S5).
8. No whole-world averages; breadth-first browse hands off to depth (S1/S13).
9. No directory dumps; group by depth/sector/region (S14).
10. No source-agency names; no em-dashes; the site is a thing not a person, never signs anything.
11. Clean data tool, not magazine: warmth in words, restraint in design (2026-06-07).

---

## 1. Home (`/`)
**Purpose:** make a stranger understand the product in one screen and start a search. "Know if a business works before you risk your money." (S8, S25, S26, PS §1)
**Current sections:** Hero + Navigator search · World map "pick a country" · "What actually decides it" (8-forces thesis) · **Break-in rating beat** (easiest/hardest, the new lead data beat) · "Drilled to the neighborhood" cities panel (HARDCODED districts) · Money beats (3 editorial cards, gym leaderboard, surprise) · Editorial spine (ask-Atlas questions + how-numbers-built) · Blog rail.
**Bible-prescribed:** eyebrow claim → rotating H1 question → subtitle → search → world map → 8-forces strip → 6 featured live cells → ask-Atlas questions → editorial rail → trust line (PS §1).
**Open decisions:** what leads (search vs break-in rankings vs map); the hardcoded cities panel (replace with live / cut / keep); is the home a search launcher, a browse surface, a credibility explainer, or a shareable-stats front; how many editorial beats.

## 2. Cell page (`/[country]/[geo]/[industry]`) — THE flagship
**Purpose:** "Can this business make money here, and under what conditions?" The craft focus (2026-06-07). (S6 = 29-module blueprint, PS §2)
**Current sections:** breadcrumb · warning chips · dimension switcher · CityHero photo · **masthead + break-in score** · the A-J board (A numbers · "what it takes to open" + why-breakdown · B market · C pricing [mostly blank] · D deformation [mostly blank] · E tax · F friction [blank] · G demand · H rent · I labor · J survival) · meta row · narrative · setup-cost · "if you opened today" · local-context · across-states (US) · comparable-cities ribbon · failure cards · comparable cells · related industries · correction form · knowledge-base footer · right-rail TOC.
**Bible-prescribed (PS §2, decision-first reorg of S6):** Hero (verdict naming upside AND killer + score + revenue range) → DASHBOARD (numbers, market, survival, pricing/demand, cost-stack, setup/capital, climate, the 5 scores) → DEEP-DIVE (distribution, cost waterfall, break-even sensitivity, take-home detail, rent ceiling, tax wedge, deformation expert layer, failure cards, top-10% playbook, compare-elsewhere, related) → methodology.
**Open decisions:** the mostly-blank sections C/D/F (keep scaffold of dashes / cut until filled / collapse behind "show more" / merge); what leads below the score (money / market / cost-to-open / survival); the long tail of sections (prune vs keep); whether the deep-dive prose survives the "numbers lead" steer; the vestigial `#revenue-tiles` anchor + comment bloat (cleanup).

## 3. Cost-to-open (`/[country]/[geo]/[industry]/opening`)
**Purpose:** the entry number: total capital, time-to-open, permits, first hires. (vision-introduced; bible analogues S4 capex, S6 #25; the cleanest current page)
**Current sections:** OpeningHero (total-to-open + break-in score + verdict) · OpeningPayback · OpeningChecklist (capital/time/permits/first-hires) · OpeningComparisons (cheaper/dearer elsewhere + easier/harder here).
**Bible-derived additions possible:** working-capital months, deposits, fit-out/equipment detail, payback months explicit, a "do not open unless" line, permit-bottleneck friction.
**Open decisions:** what to add beyond the 4-part checklist; whether it stays a tight 4-section page or grows; the ordering (total-first is set).

## 4. Country (`/[country]`)
**Purpose:** a country's small-business operating climate, friction-adjusted not generic macro. (S5, PS §4)
**Current sections:** hero + country board (climate/friction[blank]/labor/survival[blank]/market) + anchor paragraph + at-a-glance · viability lede · country-stats strip · "where the money lands" top-industries grid · **easiest-to-break-in panel** · top-cities · regions (city chips) · tax-reality · signature panel (demographics/culture/government) · compare-countries CTA.
**Bible-prescribed (PS §4):** hero + friction-adjusted one-liner → climate dashboard + tax-reality + country-level friction + survival baseline → top activities (ranked, verdict each) → best/hardest businesses → top cities → compare peers → methodology.
**Open decisions:** the 100%-blank friction/survival board sections (cut / fill modeled / keep); the THREE overlapping tax/registration surfaces (consolidate); what leads (climate dashboard / top-industries / easiest-to-break-in / verdict); should the country carry a headline score.

## 5. City / region (`/[country]/[geo]` and `/cities/[slug]`)
**Purpose:** local opportunity, "best and hardest businesses in [city]." (S5, PS §5-6)
**Current sections (ARCHITECTURE SPLIT):** `/[country]/[geo]` = hand-built, NO data board (hero + best/hardest lede + city-character + neighborhoods + top-cities + top-industries[country-level!] + easiest-to-break-in). `/cities/[slug]` = the real city board (masthead + demand/location/market/survival board + ranked activities[London only] + signature panel + formation costs + decide CTA + industry mosaic + neighborhoods + curiosities + sister cities).
**Bible-prescribed (PS §6):** hero "best and hardest" → demand dashboard + rent-pressure + saturation → best businesses (segmented by founder type) → hardest → most profitable (margin vs take-home) → industry mosaic → neighborhoods + sister cities → character.
**Open decisions:** the architecture mismatch (`[country]/[geo]` has no board, `/cities/[slug]` does, two routes for "place") - unify / keep two / merge; region top-industries are country-level (same 9 everywhere) - fix region-specific / cut / caveat; what leads; segment-by-founder-type ranking or single rank; should a place carry a headline score.

## 6. Cities directory (`/cities`)
**Purpose:** local-discovery browse surface. (S14, PS §12)
**Current sections:** world map (top) · header + count · "the visitor economy" (visitor/resident ranked) · "the deepest markets" (city stat cards: visitors/salary/GDP).
**Bible-prescribed:** group by market depth, compact cards, hand depth to city pages, no alphabetical dump.
**Open decisions:** what to add (rankings, a "best cities to start X" angle); grouping axis (market depth / region / visitor-intensity); how prominent the map; whether to add a break-in/score angle.

## 7. Activity / industry (`/industries/[industry]`)
**Purpose:** the business-model anatomy of an activity, then "pick a place." Never a global average. (S5, PS §7)
**Current sections:** breadcrumb · hero + place-picker + across-cities CTA · "the shape before you pick a place" (structural margins + revenue range) · qualitative StatCard grid (market structure/pricing/labor/survival, mostly blank at world altitude) · "where it works" (places ranked by take-home) · "how it works" model lede · margin waterfall · "what kills weak operators" · country-chooser chips · related activities.
**Bible-prescribed (PS §7):** hero "how [activity] businesses make money" → anatomy dashboard (cost structure, capital intensity, labor intensity, survival, pricing archetype) → "now pick a place" (depth-signal, not a global number) → best/worst places → related activities.
**Open decisions:** "where it works" ranked table vs country-chooser chips (overlap, consolidate); the mostly-blank qualitative grid (keep/cut/collapse); what leads (anatomy / place-picker / waterfall); should the activity carry a headline attractiveness score.

## 8. Comparison (`/industries/[industry]/across`, `/compare`)
**Purpose:** decide between options, one activity across up to 3 places. (S5, S7, PS §8)
**Current sections:** breadcrumb · hero · "where to break in" (editorial verdict) · "easiest to break in" (score-ranked pick) · side-by-side table (metrics + break-in row + revenue spread) · back-to-activity card.
**Bible-prescribed:** side-by-side dashboard with honest p10-p90 spreads → the single biggest "where the margin goes" differential → curated city-vs-city SEO pairs.
**Open decisions:** the two adjacent break-in reads (verdict + score-pick) merge or keep; add the "where the margin goes" decisive-differential block; row set + ordering; place count (3 default).

## 9. Extremes hub (`/extremes`)
**Purpose:** addictive browsable leaderboard of surprising highs and lows. (vision-introduced; bible analogue = S5 ranking rows)
**Current sections:** hero · take-home leaderboards (default) · break-in block (easiest/hardest, leads the lenses) · density block · cost-to-open block · closing note.
**Bible-prescribed (S5 ranking rules):** rank by scenario not one score; margin vs take-home distinct; for "hardest" explain failure mechanics; caveats; link into cells.
**Open decisions:** which lens leads (take-home / break-in / density / cost-to-open); add more lenses (survival, rent, margin); how much editorial framing; is it the shareable front.

## 10. Decide / Check (`/decide`, `/check`)
**Purpose:** "What business should I start here?" (Decide, S21) + a free viability quick-check (Check, S8). 
**Current sections:** `/decide` = hero + founder-decision lede (best/hardest by take-home, founder-type contrast) + activity×city picker + worked examples (HARDCODED) + methodology. `/check` = header + in-browser form (20-industry subset, revenue, costs) + comparative verdict result + privacy note.
**Bible-prescribed:** lead with best-vs-hardest by net margin segmented by founder type; the opportunity score + components; a "do not open unless" line; the free idea-screener.
**Open decisions:** Decide vs Check vs Calculator overlap (3 tools, consolidate?); the hardcoded worked examples (live / keep); the 20-industry Check subset (expand to full taxonomy); founder-type segmentation depth; surface the Founder Opportunity score.

---

## The 30 questions (ordering + content decisions) will cover, roughly 3 per page type:
home lead + hardcoded panel + role; cell blank-sections + lead-below-score + tail-pruning; cost-to-open additions; country blanks + tax-consolidation + lead; city architecture + region-data + lead; cities-directory grouping + additions; activity table-vs-chips + blank-grid + lead; comparison merge-reads + differential; extremes lead-lens + additions; decide/check consolidation + scope; plus cross-cutting (scaffold-vs-cut, editorial amount, place/activity headline scores).
