---
'@casauran/react': minor
'@casauran/tokens': minor
'@casauran/theme': minor
---

Add the `Typography` component, the platform's text primitive.

`Typography` renders one text-bearing element with a governed typographic role, and keeps the two
decisions separable: `as` selects the element and therefore the document semantics, while `variant`
selects the visual role. Each defaults from the other, so the common case is a single prop, and each
is honoured independently when both are given — so a heading can be set smaller without deepening
its level, and a large number never invents one.

It ships fourteen non-interactive elements, eleven typographic roles, a seven-step size override, a
four-step weight override, logical alignment, visual casing, eight semantic tones, and a
scale-bound block spacing prop with a per-side logical object form. Content is always children:
`variant="code-block"` preserves whitespace in CSS, so multi-line code needs no markup path and the
component has no injection sink.

`@casauran/tokens` and `@casauran/theme` gain one primitive, `font.size.3xl`, and the five
`typography.*` component tokens that form the customization seam.

New public exports: `Typography`, and the `TypographyAlign`, `TypographyElement`,
`TypographyProps`, `TypographySize`, `TypographySpace`, `TypographySpacing`,
`TypographySpacingSides`, `TypographyTone`, `TypographyTransform`, `TypographyVariant` and
`TypographyWeight` types. New CSS entry point: `@casauran/react/typography.css`.
