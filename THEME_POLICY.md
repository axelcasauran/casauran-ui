# Theme Policy

## Supported foundation contract

`@casauran/theme` owns the supported static theme surface. The canonical authored assignments are
`registry/themes/foundation.json`; the independent API/behavior contract is
`specs/foundation/css-theme-runtime.md`. Generated `packages/theme/src/theme.css` must match those
contracts exactly.

The initial supported matrix is:

- themes: `light`, `dark`;
- densities: `comfortable`, `compact`;
- adaptive modes: `forced-colors: active`, `prefers-reduced-motion: reduce`;
- direction: inherited platform `dir` with logical component CSS;
- scope: `data-theme` and `data-density` on `<html>` or an inherited container.

Light and comfortable are explicit defaults. Theme selection is application state: applications
resolve it at the server boundary when practical and render identical attributes for hydration.
The package does not read cookies, storage, DOM, or media queries and does not inject a blocking
script.

## Assignment and contrast rules

Themes assign every semantic color and elevation token. Densities assign the density scale and
control/content spacing contract. Authored normal-text foreground/background pairs must meet at
least 4.5:1 contrast. Forced colors use system colors and remove decorative elevation; reduced
motion sets semantic motion durations to zero.

Density must not shrink component semantics or bypass later target-size requirements. A component
introduces a component token only when its own stage proves a durable customization need.

## Switching, nesting, and portals

Theme changes are attribute updates, not CSS reinjection. Descendants inherit custom properties.
Portals under `<body>` inherit an `<html>` theme. A portal escaping a nested scope copies both theme
and density attributes to its container. This rule will be consumed by the later overlay owner; no
overlay implementation belongs here.

## Visual families and compatibility

Material-, Bootstrap-, and Fluent-inspired interpretations are planned but not shipped by F0.06.
They require the new-theme workflow, complete mappings, contrast/visual evidence, and independently
chosen values. Proprietary source, selectors, values, assets, or private implementation behavior
must not be copied.

Published theme/density names, attributes, cascade order, helpers, and CSS custom-property names
follow public API lifecycle governance. Consumer overrides use documented variables and an
`overrides` or later consumer cascade layer, never internal class-name assumptions.
