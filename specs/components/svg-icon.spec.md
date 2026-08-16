# Component Specification: SVGIcon

## Provenance

Written from `specs/components/svg-icon.reference-analysis.md`, which records the pinned baseline
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862` and every examined public page.
No competitor source, CSS, asset, path data, or runnable example is an input to this specification.

## Purpose and scope

SVGIcon is the direct-definition icon surface: the caller owns the drawing. Icon (`1.02`) renders a
named glyph from the closed `@casauran/icons` catalog; SVGIcon renders a definition the caller
supplies, so an application ships its own artwork without waiting for the catalog to grow and
without a second icon system.

Non-goals: parsing or injecting SVG markup, accepting arbitrary child elements, fetching artwork,
icon fonts, an ambient icon provider, a runtime class-replacement mode, interaction of any kind, and
growing the Casauran catalog. Icon is not reimplemented, reskinned, or wrapped.

## Observable capabilities

A definition carries a `name`, an optional `viewBox`, a default drawing in `paths`, and optional
alternate drawings in `variants`. A drawing is an ordered list of layers; a layer is either a bare
geometry string or an object adding `paint`, `strokeWidth`, `fillRule` and `opacity`. Each layer
renders as one `<path>`, in order.

`variant` selects `solid`, `outline` or `duotone` from the definition's `variants`. A variant the
definition does not ship falls back to the default drawing, and the drawing that actually rendered is
reflected in `data-variant`, so the fallback is observable rather than silent.

`size` defaults to `md` across `xs | sm | md | lg | xl | 2xl | 3xl`; `tone` defaults to `inherit`
across `inherit | accent | muted | positive | caution | critical | inverse`; `flip` defaults to
`none` across `none | horizontal | vertical | both`. These are Icon's vocabularies, reused rather
than redeclared: the two components differ in where the drawing comes from, not in how an icon is
sized, coloured or mirrored.

A definition that does not satisfy `isSVGIconDefinition` renders no artwork. The element still
renders, keeps its decorative semantics, and omits `data-icon-name`, which is the same fail-closed
shape Icon gives an unknown catalog name.

## Anatomy and composition

One `<span>` root carrying the class, state attributes and semantics, wrapping at most one `<svg>`
that is always `aria-hidden` and `focusable="false"`, wrapping one `<path>` per layer.

SVGIcon composes no other component and owns no shared capability. The definition type, its runtime
narrowing guard, its resolver, and the platform view-box and stroke-weight constants live in
`@casauran/icons`, which `ARCHITECTURE.md` already names the owner of vector definitions; the
component owns rendering semantics and sizing. Extending that package is the shared-engine change
this stage makes, at the owner layer.

## State model

SVGIcon holds no state. It has no controlled or uncontrolled mode, no default value, no change
event, no reset, no async behaviour, and no disabled or read-only concept, so
`useControllableState` is not involved and there is no dual source of truth to avoid. Every rendered
state is a pure function of props: the default drawing, each variant, the fallback drawing,
decorative, labelled, blank-label, and unusable-definition.

## Interaction model

None. SVGIcon owns no pointer, touch, keyboard, IME, clipboard, drag, or scroll behaviour. Native
handlers pass through so a caller can integrate the element, but the component never handles one and
never becomes a target. Artwork that participates in an interaction belongs inside the control that
owns it.

## Accessibility

Decorative by default: the root is `aria-hidden` and the nested SVG is hidden and unfocusable in
every mode. A `label` that carries text promotes the root to `role="img"` with that name, trimmed of
surrounding whitespace. A blank or whitespace-only label names nothing, so it keeps the icon
decorative rather than publishing an image with an empty accessible name.

`role`, `aria-hidden`, `aria-label` and `tabIndex` are reserved by the type. The first three would
contradict semantics the component derives from `label`; `tabIndex` would let an element hidden from
assistive technology take a tab stop.

There is no keyboard table, because there is no key model — an empty table would imply otherwise.
Meaning is never carried by tone alone. Under forced colours the drawing paints a system foreground
and layer opacity is flattened to 1, so a receded duotone layer cannot disappear against a collapsed
palette. Reflow at 320 CSS pixels is required and asserted. There is no motion to reduce.

## API requirements

`icon` is required. `variant`, `size`, `tone`, `flip` and `label` are optional with the defaults
above. Native span attributes, `className`, `style` and `ref` remain available; `children` and
`color` are reserved because the artwork and its colour come from `icon` and `tone`.

The forwarded ref is the native `HTMLSpanElement`; no imperative handle is introduced. Every
enumerated value is a closed union, so a misspelled variant, size, tone or flip is a compile error.
`@casauran/icons` publishes the data surface: the `SVGIconDefinition`, `IconPath` and
`SVGIconVariant` types, the `isSVGIconDefinition` guard, the `resolveSVGIcon` resolver,
`svgIconVariants`, and the two platform constants.

## Styling/theming

`@casauran/react/svg-icon.css` consumes the governed `--csn-svg-icon-size` and
`--csn-svg-icon-color` component tokens. Every enumerated size and tone assigns them at the same
specificity, including the `md` and `inherit` defaults, so a consumer override written in the
`overrides` cascade layer behaves identically for a default and for an explicit value —
the defect Icon's revalidation found and fixed, avoided here by construction.

Stroke weight is deliberately **not** a CSS seam. It belongs to the drawing rather than the theme,
one drawing may mix weights, and a theme-level variable could not express that; it is a per-layer
property of the definition, defaulting to the platform weight Icon paints catalog artwork at. Only
the line joins are a stylesheet constant.

The stylesheet supports semantic tones, light and dark themes, comfortable and compact densities,
nested theme scopes, RTL through inherited direction and logical properties, forced colours, and
scoped consumer overrides. The nested `<svg>` is not a published styling target.

## Rendering

Server-renderable with no client boundary, no browser global at module evaluation, no effect,
observer, listener, timer, portal, random value, or current-time read, so server and client markup
are identical and the component contributes nothing to the client bundle. `useStableId` is not
needed because the component generates no identifier. Rendering it inside a client component works
unchanged.

## Internationalization

SVGIcon owns no message catalogue, number, or date formatting; a `label` arrives already localized.
Direction is inherited from the ambient `dir` and artwork is never mirrored automatically, because
most symbols keep their orientation in a right-to-left layout. There is no text entry, so there is no
IME surface.

## Security

Under `SECURITY_ARCHITECTURE.md` an SVG stage requires an explicit security review and negative
tests, and SVG is an untrusted input class. A definition is treated as untrusted data.

The trust boundary is the definition. It carries geometry strings and a closed set of scalar paint
instructions, all of which become attributes React escapes. The component never parses markup, never
uses `dangerouslySetInnerHTML` or any equivalent, and renders only `<path>` elements — so the API
cannot express a `script`, a `use` reference, an embedded `image`, a `foreignObject`, an event
attribute, an external URL, or a data URI, whatever the definition's origin. This is structural, not
a filter, and there is no escape hatch that reintroduces the sink.

`isSVGIconDefinition` validates a definition that crossed a runtime boundary, and `resolveSVGIcon`
applies the same rule so an unusable definition renders nothing rather than partial artwork. There is
no network, storage, clipboard, file, or dynamic-code surface, and the component adds no
content-security-policy allowance of its own.

## Performance

Scenario: 1,000 server renders of a caller-owned three-layer definition through `react-dom/server`
after a production package build, alternating variants so resolution and fallback are both exercised.
Ceiling 500 ms. `benchmarks/svg-icon.mjs` runs it through `pnpm benchmark:svg-icon` and prints the
observed result with the Node version, platform and architecture it measured. The recorded figure
lives in `.agent/performance-budgets.md`. This is a bounded regression guard, not a universal speed
claim.

## Edge cases

Null or non-object definition; empty `paths`; a layer with empty geometry; a malformed or
zero-extent `viewBox`; an out-of-range `opacity`; a non-positive `strokeWidth`; a `variants` key
outside the governed vocabulary; a variant requested but not shipped; a variant present but empty; a
blank or whitespace-only `label`; a catalog definition passed through unchanged; a definition reused
at several sizes, tones and directions at once.

## Test matrix

Unit (`tests/unit/svg-icon.test.tsx`): server rendering, definition resolution, every variant and the
fallback, per-layer paint/weight/fill-rule/opacity, view-box default and override, every size, tone
and flip attribute, decorative and labelled semantics, the blank-label guard, catalog interop, the
guard and resolver against every malformed input above, and `@ts-expect-error` cases for each
reserved prop and each closed union.

Browser (`tests/browser/svg-icon.spec.ts`): production SSR markup, accessibility-tree semantics,
square monotonic geometry across the size scale, distinct tone colours and inherited colour including
inside a solid Button, the component-token seam against defaults and explicit values, computed
transforms for all four flip values, RTL direction with no automatic mirroring, variant selection and
fallback, duotone layer opacity, forced colours with opacity flattening, 320 px reflow, the
deterministic screenshot matrix, and Button × SVGIcon composition.

Contract: the token-contract tests covering registry-resolved component slugs.

## Parity acceptance

`specs/components/svg-icon.parity.md` carries one governed disposition per capability with named
Casauran evidence, plus the enterprise dimension audit. `parity-verified` additionally requires the
three deferrals earlier stages recorded against `1.03` to be resolved and revalidated: Icon's drawing
variants, Icon's caller-supplied definitions, and Button's direct SVG icon definition.
