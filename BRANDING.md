
# Casauran Brand Identity

## Canonical identity

- Umbrella brand: **Casauran**
- React UI product: **Casauran UI**
- Design-system name: **Casauran Design System**
- Public npm scope: **`@casauran/*`**
- Internal workspace scope: **`@casauran-internal/*`**
- CSS namespace: **`csn`**
- Public diagnostic/error namespace: **`CSN`**
- React component name prefix: **none**

## Public naming

Use:
- Casauran
- Casauran UI
- Casauran Design System
- Casauran React
- Casauran Icons
- Casauran Themes
- Casauran Grid
- Casauran Charts
- Casauran AI

Do not use previous working names, generic "Enterprise UI" branding, or competitor-oriented names in customer-facing material.

## npm package identity

Initial supported public packages:

- `@casauran/react`
- `@casauran/tokens`
- `@casauran/theme`
- `@casauran/icons`

Internal implementation packages use:

- `@casauran-internal/core`
- `@casauran-internal/accessibility`
- `@casauran-internal/data`
- and the corresponding domain-owned internal package names.

A future package becomes public only through an ADR and PUBLIC_API_POLICY.md review.

## React naming

Public React APIs remain concise:

```tsx
import { Button, DataGrid, DatePicker } from '@casauran/react';
```

Use `<Button />`, not `<CasauranButton />`.

Package context already carries the brand. Gratuitous brand prefixes in types, hooks, state objects, or engines are prohibited.

## CSS naming

Project-owned CSS custom properties use the short prefix:

```css
--csn-surface-canvas
--csn-text-primary
--csn-button-background
```

Intentionally public anatomy/state hooks may use:

```html
data-csn-component="button"
data-csn-part="trigger"
data-csn-state="open"
```

Internal implementation selectors are not stable public API unless explicitly documented.

## Diagnostics

Public development warnings may identify the product:

`Casauran UI: <message>`

Stable diagnostic codes may use:

`CSN001`
`CSN-GRID-001`

Error-code schemes must remain documented and must not expose sensitive data.

## Competitor references

Competitor names may appear only in:
- reference provenance,
- clean-room/reference policy,
- parity research,
- internal comparison/audit documents where attribution is necessary.

They must not appear in customer-facing product identity, API naming, package names, CSS namespaces, examples, or marketing documentation.

## Rename policy

Casauran is the frozen product identity. Renaming requires an ADR because it affects package names, documentation, CSS variables, generated assets, URLs, diagnostics, screenshots, and consumer expectations.
