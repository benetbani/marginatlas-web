# 43 · Track MM — Localization + i18n + Currency

> Multi-language site. Localized number formats. Local currency option.
> Significant work but doubles or triples search traffic potential.

---

## 1 · Goal

Ship the site in 5 languages (en, es, de, fr, jp) with localized number
formats and an optional "show in local currency" toggle.

---

## 2 · Sub-tracks

### MM.1 — Next.js i18n routing

Configure Next.js i18n:
- Default locale: en
- Other locales: es, de, fr, jp
- URL prefix: `/en/...`, `/es/...` etc. (or accept-language detection)

`next.config.ts`:
```ts
i18n: {
  locales: ['en', 'es', 'de', 'fr', 'jp'],
  defaultLocale: 'en',
  localeDetection: true,
}
```

Effort: 2 hr.

### MM.2 — Translation files

`src/lib/i18n/[lang].json` — UI strings only (cell DATA stays in
original).

Coverage: navigation, page titles, button labels, tooltips, footer.

Strings: ~200 across the site.

Effort: 4-5 hr (writing the translations).

### MM.3 — Localized number formats

Use `Intl.NumberFormat` everywhere:
- `formatMoney(v, locale)` — varies by locale (USD $, EUR €, JPY ¥)
- `formatCount(v, locale)` — thousand separators per locale
- `formatPercent(v, locale)` — decimal separator per locale

Effort: 2 hr.

### MM.4 — Local currency option

User toggle on each cell page: "View in USD / local currency"

When local: convert revenue + payroll from USD to country's local
currency using current WB FX rate. Show currency symbol per locale.

Effort: 2 hr.

### MM.5 — Hreflang tags

Per Track DD.5 — add hreflang `<link>` tags pointing to localized
versions of each page.

Effort: included in DD.5.

### MM.6 — Right-to-left scaffolding

Even if Arabic/Hebrew aren't in v1 of languages, scaffold the layout
to handle `dir="rtl"`:
- Tailwind `rtl:` variants for spacing
- Mirror chevron icons
- Test with `<html dir="rtl">` toggle

Effort: 2 hr.

### MM.7 — Language picker in header

Small dropdown in header or footer for language selection.

Effort: 1 hr.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| MM.1 i18n routing | 2 hr |
| MM.2 Translation files (5 languages × 200 strings) | 4-5 hr |
| MM.3 Localized formats | 2 hr |
| MM.4 Local currency toggle | 2 hr |
| MM.5 Hreflang | included in DD |
| MM.6 RTL scaffolding | 2 hr |
| MM.7 Language picker | 1 hr |
| **Total** | **~13-14 hr** |

---

## 4 · Verification gate

- All 5 languages load correctly via /en, /es, /de, /fr, /jp
- Number formats correct per locale
- Local currency toggle converts correctly
- Hreflang tags validate
- RTL test with Arabic dummy data renders without layout breaks

---

## 5 · What this unlocks

- Search traffic capture in non-English markets (Spain, Mexico, France,
  Germany, Japan)
- Foundation for full RTL languages (Arabic, Hebrew)
- Per-country marketing localization possible
