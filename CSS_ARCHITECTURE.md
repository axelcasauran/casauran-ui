# CSS Architecture

## Cascade contract

Static CSS and custom properties are required by ADR-003. The fixed order is:

`reset -> tokens -> base -> components -> utilities -> overrides`

`@casauran/theme/theme.css` declares the full order so packages can contribute to their owning
layer without relying on import order. Foundation selectors use `:where(...)`; component selectors
remain low-specificity and expose only intentional `data-csn-*` hooks as public contract.

## Token and theme flow

Primitive values and semantic aliases originate in `@casauran/tokens`. The theme package emits
those variables once and assigns themeable semantic variables for light/dark, density, forced
colors, and reduced motion. Component CSS consumes semantic variables and justified component
tokens. Theme differences flow through variables before structural/style forks.

Generated CSS is derived from `registry/themes/foundation.json`; run `pnpm generate:theme` and
`pnpm validate:theme`. Runtime CSS-in-JS, hand-edited generated output, and raw visual constants
where an owned token exists are prohibited.

## Direction, adaptivity, and state

Use logical properties for inline/block spacing, placement, borders, and sizing. `dir` is the
platform direction contract; themes do not duplicate left-to-right/right-to-left styles. Honor
forced colors and reduced motion through the shared semantic variables. Responsive CSS uses
content/container needs rather than theme-specific DOM.

Stable state/anatomy hooks are explicitly documented. Arbitrary internal class names and generated
DOM are not consumer API.

## Scope, portals, and overrides

Custom properties inherit from `<html>` or nested `data-theme`/`data-density` scopes. A portal under
`<body>` inherits the root scope; a portal escaping a nested scope copies both attributes to its
container. Consumers override documented variables in `overrides` or a later consumer-owned layer.
Package manifests retain `**/*.css` as side effects.
