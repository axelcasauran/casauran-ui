# Component Specification: Icon

## Scope and API

Icon is the non-interactive named-icon surface. It renders one `<span>` containing a known,
independently authored SVG definition from `@casauran/icons`; it does not parse SVG, fetch assets,
or implement SVGIcon's direct-definition API. `name` is required. `size` defaults to `md` and has
`xs | sm | md | lg | xl | 2xl | 3xl`; `tone` defaults to `inherit`; `flip` defaults to `none` and
supports horizontal, vertical, and both. Native span attributes, className, style, and ref remain
available. `label` is the only semantic-label API and changes the root to `role="img"`.

## Accessibility and interaction

Without `label`, the root is `aria-hidden`; the nested SVG is always hidden and unfocusable.
With `label`, the root is an image with that accessible name. Icon never owns focus, keyboard,
pointer activation, announcements, disabled/read-only state, IME, clipboard, drag, or target size.
Actions must compose Icon inside a semantic component such as Button. Logical layout inherits RTL;
forced colors use a system foreground.

## Rendering, security, and performance

The component is server-renderable with no client boundary, browser global, effect, observer,
listener, timer, random input, portal, network, or hydration state. Unknown names render no SVG.
Name is an attribute value escaped by React; there is no raw HTML/SVG/URL parser. The benchmark
scenario is 1,000 named server renders under 500 ms on the pinned Node runtime.

## Styling and verification

`@casauran/react/icon.css` consumes `--csn-icon-size` and `--csn-icon-color`, supports semantic
tones, light/dark/density scopes, RTL inheritance, reduced motion (no motion), forced colors, and
scoped overrides. Tests cover SSR, semantics, unknown names, typing, flip, RTL, themes, screenshot,
and production Next rendering. Manual review covers decorative versus labelled exposure, visible
glyphs, forced colors, narrow reflow, and composition boundary.
