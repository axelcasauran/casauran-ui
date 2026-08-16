# Component Specification: Icon

## Scope and API

Icon is the non-interactive named-icon surface. It renders one `<span>` containing a known,
independently authored SVG definition from `@casauran/icons`; it does not parse SVG, fetch assets,
or implement SVGIcon's direct-definition API.

`name` is required and typed as `IconName`, the union of the names the catalog ships, so a glyph
that does not exist is a compile error rather than an element that silently renders nothing. A name
that crossed a runtime boundary is narrowed with `isIconName`; an unnarrowed unknown name still
fails closed at render time. `size` defaults to `md` and has `xs | sm | md | lg | xl | 2xl | 3xl`;
`tone` defaults to `inherit` and has `inherit | accent | muted | positive | caution | critical |
inverse`; `flip` defaults to `none` and supports horizontal, vertical, and both. `label` is the only
semantic-label API and changes the root to `role="img"`.

Native span attributes, `className`, `style`, and `ref` remain available. Icon reserves `children`
and `color`, because the glyph and its colour come from `name` and `tone`; `role`, `aria-hidden` and
`aria-label`, because it derives those from `label` and a passthrough value would contradict them;
and `tabIndex`, because an element hidden from assistive technology must not be reachable by
keyboard and a labelled image is not an interaction either.

## Accessibility and interaction

Without `label`, the root is `aria-hidden`; the nested SVG is always hidden and unfocusable. With a
`label` that carries text, the root is an image with that name, trimmed of surrounding whitespace. A
blank or whitespace-only label names nothing, so it keeps the icon decorative rather than publishing
an unnamed image.

Icon never owns focus, keyboard, pointer activation, announcements, disabled/read-only state, IME,
clipboard, drag, or target size, and it publishes no keyboard table rather than an empty one.
Actions must compose Icon inside a semantic component such as Button, where the artwork inherits
that control's tab stop, focus ring, and key model. Meaning is never carried by tone alone. Logical
layout inherits RTL and artwork is never mirrored automatically; forced colors use a system
foreground.

## Rendering, security, and performance

The component is server-renderable with no client boundary, browser global, effect, observer,
listener, timer, random input, portal, network, or hydration state. Unknown names render no SVG.
Name is an attribute value escaped by React; there is no raw HTML/SVG/URL parser and no escape hatch
that would accept one, so the component adds no content-security-policy allowance of its own. The
benchmark scenario is 1,000 named server renders under 500 ms, and it reports the Node version,
platform, and architecture it measured.

## Styling and verification

`@casauran/react/icon.css` consumes the governed `--csn-icon-size` and `--csn-icon-color` component
tokens. Every enumerated size and tone assigns them at the same specificity, including the `md` and
`inherit` defaults, so a consumer override written in the `overrides` cascade layer behaves
identically for a default and for an explicit value. `tone="inherit"` resolves to `currentColor`, so
composed artwork takes the colour of the text around it. The stylesheet supports semantic tones,
light/dark and density scopes, RTL inheritance, reduced motion (there is no motion), forced colors,
and scoped overrides.

Tests cover SSR, semantics including the blank-label guard, unknown names, the typed name and the
reserved props, every size/tone/flip value, square monotonic geometry, inherited and composed
colour, the token seam, RTL, themes, forced colors, 320 px reflow, the screenshot matrix, and
production Next rendering. Manual review covers decorative versus labelled exposure, visible glyphs,
forced colors, narrow reflow, and the composition boundary.
