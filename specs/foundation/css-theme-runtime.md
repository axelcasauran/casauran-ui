# CSS and Theme Runtime Contract

Status: approved and implemented by F0.06.

## Scope and ownership

`@casauran/theme` owns Casauran's supported static stylesheet, theme/density identifiers, server-compatible attribute helpers, cascade contract, and adaptive media assignments. The canonical authored mapping is `registry/themes/foundation.json`; `packages/theme/src/theme.css` is deterministic generated output. This stage adds no public React component, hook, provider, client script, runtime dependency, or accessibility engine.

## Theme and density contract

The required initial themes are `light` and `dark`; the required densities are `comfortable` and `compact`. Light/comfortable are explicit defaults. Theme scopes use `data-theme`; density scopes use `data-density`. Both attributes may be placed on `<html>` for an application default or on a nested container for an inherited scope. Every light/dark color and elevation assignment is complete, and every density assignment covers density scale plus control/content spacing.

Material-, Bootstrap-, and Fluent-inspired families remain planned product work and are not part of this contract. Adding a visual family requires the new-theme workflow and independent values; it does not copy proprietary sources, selectors, or assets.

## Public API and CSS imports

Consumers import `@casauran/theme/theme.css` once at an application stylesheet boundary. The package root exports `ThemeName`, `DensityName`, `ThemeOptions`, `ThemeAttributes`, identifier arrays/constants, `getThemeAttributes`, `getThemeSelector`, and `getDensitySelector`. `getThemeAttributes()` defaults to `{ 'data-theme': 'light', 'data-density': 'comfortable' }` and performs no environment detection.

The package exports no DOM mutator or pre-hydration script. Applications choose persisted/system preference at the server boundary when possible and render matching attributes. Client switching is a normal attribute update owned by the application; the same value must be used for server markup and first hydration render.

## Cascade, RTL, and portals

The fixed layer order is `reset, tokens, base, components, utilities, overrides`. Selectors use `:where(...)` to keep specificity low. Components consume semantic/component custom properties and logical CSS properties; theme differences do not fork component structure. The theme stylesheet itself has no directional physical spacing rules.

Custom properties inherit through normal descendants, including portals mounted under `<body>` when `<html>` owns the attributes. A portal mounted outside a nested themed subtree must copy the subtree's documented `data-theme` and `data-density` attributes to its portal container. Consumer overrides belong in the `overrides` layer or a later consumer layer.

## Accessibility and visual behavior

Authored foreground/background pairs meet at least 4.5:1 contrast for normal text in light and dark themes. Focus intent remains visible through `--csn-focus-ring`. `forced-colors: active` assigns system colors and removes decorative elevations. `prefers-reduced-motion: reduce` sets semantic motion durations to `0ms`. Density changes spacing, never hit-target semantics; owning component stages must still meet WCAG target-size and interaction requirements.

Visual evidence covers light/dark, comfortable/compact, nested scopes, runtime attribute switching, RTL logical spacing, reduced motion, forced colors, and deterministic screenshots. F0.07 owns reusable focus/keyboard/live-region primitives and is not implemented here.

## SSR, security, and performance

The package is static CSS plus pure string/object helpers and is safe at server module evaluation. It reads no browser globals, cookies, storage, locale, media query, DOM, or network. Attribute values are closed TypeScript unions; no HTML or CSS text injection API exists. A single static stylesheet and inherited custom properties avoid runtime CSS generation. No universal rendering or bundle-size claim is made.

## Compatibility and overrides

Theme/density names, attribute names, cascade order, public helpers, and published CSS custom-property identifiers are supported API. Removal or rename requires semver and migration treatment. Additive theme families use the governed workflow. Consumers may override documented custom properties without relying on internal class names; component-specific variables are introduced only by their owning component stages.

## F0.07 boundary

F0.07 remains responsible for focus management, roving focus, keyboard primitives, live regions, and other reusable accessibility behavior. F0.06 provides only static focus-color/motion/forced-color foundations. No public component or F0.07 capability is started by this stage.
