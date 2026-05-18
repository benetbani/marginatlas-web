# 24 · Track U — Quality Score 1-10 Refactor

> Founder direction: "keep track records for the quality of the data
> from one to ten, with ten being the highest quality and one being
> very low quality of super guessing."
>
> Current system: 0-100 integer in `quality_score` column. Refactor to
> 1-10 scale that's universally legible.

---

## 1 · Goal

Migrate from `quality_score` (0-100) to `quality_score_10` (1-10).
Update UI components to render 1-10 as a dot scale. Hide cells with
score < 4 from default UI; expose with explicit warning when accessed
directly.

---

## 2 · The mapping

Current 0-100 → New 1-10:

| 0-100 | 1-10 | Tier | Meaning |
|---|---|---|---|
| 95-100 | 10 | Excellent | Direct primary measurement, all fields populated |
| 85-94 | 9 | Excellent | Direct primary, minor gaps |
| 75-84 | 8 | Very High | Secondary published source (Eurostat-style) |
| 65-74 | 7 | High | Modeled from primary with strong fit |
| 55-64 | 6 | Good | City overlay from country extrapolation × population share |
| 45-54 | 5 | Medium | Proxy country × small scaling (well-fit) |
| 35-44 | 4 | Low | Proxy country × moderate scaling |
| 25-34 | 3 | Very Low | Proxy × heavy scaling — show warning |
| 15-24 | 2 | Unreliable | Distant proxy — hide from default UI |
| 0-14 | 1 | Pure guess | Reject; do not ship |

---

## 3 · Steps

### U.1 — Add `quality_10` column to all three tables

```sql
-- scripts/migrations/003_quality_10.sql
ALTER TABLE cells_master         ADD COLUMN IF NOT EXISTS quality_10 SMALLINT;
ALTER TABLE extrapolated_cells   ADD COLUMN IF NOT EXISTS quality_10 SMALLINT;
ALTER TABLE regional_cells       ADD COLUMN IF NOT EXISTS quality_10 SMALLINT;

UPDATE cells_master SET quality_10 = LEAST(10, GREATEST(1, ROUND(quality_score / 10.0)));
UPDATE extrapolated_cells SET quality_10 = LEAST(10, GREATEST(1, ROUND(quality_score / 10.0)));
UPDATE regional_cells SET quality_10 = LEAST(10, GREATEST(1, ROUND(quality_score / 10.0)));

CREATE INDEX IF NOT EXISTS idx_cells_master_quality_10 ON cells_master (quality_10);
CREATE INDEX IF NOT EXISTS idx_extrapolated_quality_10 ON extrapolated_cells (quality_10);
CREATE INDEX IF NOT EXISTS idx_regional_quality_10 ON regional_cells (quality_10);
```

Apply manually in Supabase SQL editor.

### U.2 — Update Cell type + normalizers

`src/lib/cells.ts`:
- Add `quality_10` to Cell type
- All `normalizeRow*` functions return it

### U.3 — New `QualityDots` component

`src/components/QualityDots.tsx`:

```tsx
type Props = { score: number };
export function QualityDots({ score }: Props) {
  const s = Math.max(1, Math.min(10, Math.round(score)));
  const COLORS = {
    10: "bg-moss-700", 9: "bg-moss-600", 8: "bg-moss-500",
    7: "bg-atlas-500", 6: "bg-atlas-400", 5: "bg-atlas-300",
    4: "bg-clay-300", 3: "bg-clay-500", 2: "bg-clay-700", 1: "bg-clay-900"
  };
  return (
    <div className="flex items-center gap-0.5" aria-label={`Quality ${s}/10`}>
      {Array.from({length: 10}).map((_, i) => (
        <div key={i} className={`w-1.5 h-3 rounded-sm ${i < s ? COLORS[s] : 'bg-cream-300'}`} />
      ))}
      <span className="ml-1.5 text-xs text-ink-700/80 tabular-nums">{s}/10</span>
    </div>
  );
}
```

### U.4 — Replace QualityBadge usages

Find every `<QualityBadge ...>` and add a small `<QualityDots score={cell.quality_10 ?? 5} />`
next to it (don't remove the star variant yet; both can coexist
during transition).

### U.5 — Default UI filter

Update `getCellBySlug` and `getTopRegionalCells`:
- When no explicit `?include_low_quality=1` query param, filter out
  cells with quality_10 < 4
- When directly requested via slug + missing data: show full cell
  with warning banner "Low-confidence estimate — interpret carefully"

### U.6 — Update verify_taxonomy.ts

Add invariant:
- No cell in regional_cells has quality_10 < 1 OR > 10

### U.7 — Update extrapolation scripts

For Wave 3 / Wave 4: compute `quality_10` per cell based on the
scaling factor between proxy and target:
- `|log(scale)| < 0.1` → 7
- `0.1 ≤ |log(scale)| < 0.4` → 5-6
- `0.4 ≤ |log(scale)| < 1.0` → 4
- `|log(scale)| ≥ 1.0` → 3 (warn) or skip

### U.8 — Country page quality summary

On `/[country]`, show: "Coverage quality: 7.2/10 average across N
cells" — average of all cells for that country.

---

## 4 · Steps + effort

| Step | Effort |
|---|---|
| U.1 SQL migration | 30 min (write + apply manually) |
| U.2 Cell type update | 30 min |
| U.3 QualityDots component | 30 min |
| U.4 Replace QualityBadge usages | 1 hr |
| U.5 Default UI filter | 1.5 hr |
| U.6 Verify_taxonomy invariant | 30 min |
| U.7 Extrapolation script quality computation | 1 hr |
| U.8 Country page quality summary | 30 min |
| **Total** | **~6 hr** |

---

## 5 · Verification gate

- All cells in regional_cells have quality_10 between 1 and 10
- QualityDots renders on every cell page next to the headline number
- Cells with quality_10 < 4 don't appear in default home tiles
- Cells with quality_10 < 4 accessed directly show warning banner

---

## 6 · What this unlocks

- Trust signal: users see at-a-glance the data confidence
- Sorting/filtering by quality becomes possible
- Founder's "1-10 quality tracking" directive realised
- Pre-requisite for Track R (extrapolation blitz needs quality scoring)
