# Component Specification: Typography

## Provenance

Written from `specs/components/typography.reference-analysis.md` against pinned baseline
`6a05c926c4f08b89782c25336fc159fea3a3f26b`, snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`, resolved local-only. The
examined pages and the nine Casauran decisions taken in advance are recorded there. No competitor
source, CSS, theme value, class name, asset, or example file was used as implementation input.

## Purpose and scope

Typography is the platform's text primitive: one component that renders a text-bearing element with
a governed typographic role, so an application stops re-deriving font sizes, weights and rhythm per
view and a scale change lands in one place.

It solves three problems the platform otherwise leaves to per-application CSS:

- **The type scale is not a contract.** Without it, one screen's "section heading" is 18px semibold
  and another's is 20px medium, and neither is reachable from a token.
- **Document structure and visual size are conflated.** Choosing a heading element to get a size
  corrupts the document outline; choosing a size by hand-writing CSS on an `h2` duplicates the scale.
- **Text colour drifts off the semantic ramp.** Status text hard-codes a hex value that does not
  follow the dark theme or forced colours.

Non-goals, each owned elsewhere: interaction of any kind, links (an anchor belongs to the component
that owns navigation), labels for form controls (`1.05 Label`), rich text or markdown rendering
(`Editor`), layout of multiple blocks (`StackLayout`, `GridLayout`), truncation and line clamping
(not a documented capability of this family, and a genuine one requires a tooltip owner), and
localization of the text itself, which arrives already translated from the caller.

## Observable capabilities

1. **Typographic role (`variant`).** Eleven closed values naming a role rather than an element:
   `display`, `title`, `heading`, `subheading`, `body`, `body-small`, `caption`, `overline`, `code`,
   `code-block`, `quote`. Each binds a family, size, weight and line height, and `quote` and
   `code-block` additionally bind their block treatment.
2. **Rendered element (`as`).** Fourteen closed values: `h1`–`h6`, `p`, `span`, `div`, `strong`,
   `em`, `code`, `pre`, `blockquote`. The element is the document-structure decision and is never
   inferred from the visual role beyond the defaults below.
3. **Independent defaulting.** With neither prop, the component renders `<p>` with the `body` role.
   With only `as`, the role is derived from the element (`h1`→`title`, `h2`→`heading`,
   `h3`–`h6`→`subheading`, `code`→`code`, `pre`→`code-block`, `blockquote`→`quote`, `strong`/`em`→
   `body`, `span`/`div`/`p`→`body`). With only `variant`, the element is `p` except `code`→`code`,
   `code-block`→`pre`, `quote`→`blockquote`. With both, each is honoured exactly as given: this is
   how an `h2` carries `display` type, or a `span` carries `caption` type, without either choice
   dragging the other.
4. **Size override (`size`).** Seven steps, `xs` through `3xl`, sharing the platform vocabulary Icon
   and SVGIcon publish. Overrides the size the variant assigned and nothing else.
5. **Weight override (`weight`).** Four steps: `regular`, `medium`, `semibold`, `bold`, bound to the
   four governed weight primitives.
6. **Alignment (`align`).** Four logical values: `start`, `end`, `center`, `justify`.
7. **Casing (`transform`).** Four values: `none`, `uppercase`, `lowercase`, `capitalize`.
8. **Colour intent (`tone`).** Eight values: `inherit` (the default, `currentColor`), `default`
   (the theme's primary text colour), `muted`, `accent`, `positive`, `caution`, `critical`,
   `inverse`.
9. **Spacing (`spacing`).** Six named steps — `none`, `xs`, `sm`, `md`, `lg`, `xl` — bound to the
   governed space scale. The shorthand form applies the step to both block sides; the object form
   `{ blockStart, blockEnd, inlineStart, inlineEnd }` sets any of the four logical sides
   independently, and an omitted side gets no margin.
10. **Content.** Children only. Whitespace is preserved and wrapped for `code-block`, and that block
    scrolls horizontally rather than overflowing the page.
11. **Passthrough.** The non-conflicting native attributes of the rendered element — `id`, `style`,
    `title`, `lang`, `dir`, `data-*`, pointer and mouse handlers — plus a forwarded ref to that
    element and a `className` appended after the stable root hook.
12. **Reflected state.** `data-csn-component`, `data-variant`, `data-element`, `data-size`,
    `data-weight`, `data-align`, `data-transform`, `data-tone`, and one attribute per logical
    spacing side, so every resolved value is observable from a selector or a test.

## Anatomy and composition

One element. No wrapper, no nested span, no slot, no portal.

Typography composes no other public component and uses no internal engine: there is no overlay,
positioning, collection, virtualization, drag, animation, date, i18n message, focus, or state
requirement in the specification, so taking a dependency on any of those packages would be
speculative coupling rather than canonical reuse.

It renders native elements directly, which is correct under `COMPONENT_COMPOSITION_RULES.md`:
Typography _is_ the owner of the text primitive, and its element vocabulary deliberately excludes
every interactive element so it can never become a second owner of one. `composition.uses` is
therefore empty and no native interactive exception is required.

## State model

Typography owns no state. There is no controlled or uncontrolled value, no default or initial
state, no transition, no event, no async behaviour, no reset, and no disabled or read-only mode, so
`useControllableState` is not involved and there is no dual source of truth.

Every prop is a pure presentational input resolved during render. Two resolutions are derived
rather than stored — the element from the variant and the variant from the element — and both are
pure functions of the props, computed identically on the server and the client.

Invalid states are unreachable through types wherever practical: `as`, `variant`, `size`, `weight`,
`align`, `transform` and `tone` are closed unions; `spacing` is a closed union or an object of
closed unions; and `dangerouslySetInnerHTML`, `color`, `role`, `aria-level`, `children` as a markup
string, and the ARIA overrides that would contradict the rendered element are rejected by the type.

## Interaction model

None. Typography renders text, not a control. Pointer, touch, keyboard, focus, IME, clipboard,
drag, resize and scroll behaviour belong to the component that composes the text. Native handlers
pass through so a caller can integrate the element into its own interaction, but the component
never registers or handles one, and it never adds a tab stop.

The single scrollable surface it can produce — a `code-block` wider than its container — must be
keyboard reachable, because a scroll container that only a mouse can reach is a WCAG 2.1.1 failure.
That is satisfied by the element being focusable through the browser's own scroll-container
affordance rather than by the component assigning a tab index.

## Accessibility

- **Semantics come from the element, never from ARIA.** `as` selects a real element and the browser
  supplies its role: a heading level, a paragraph, a quotation, a code sample. The component adds no
  `role`, and rejects a passthrough `role` and `aria-level`, because either would contradict the
  element the caller selected.
- **Heading level is never invented.** No variant promotes an element to a heading. `display`,
  `title`, `heading` and `subheading` are sizes; a document outline exists only when the caller
  writes `as="h1"`–`as="h6"`. This is the specification's primary accessibility improvement over the
  analysed model, where selecting a size selected a level.
- **Accessible name.** The element's name is its text content. `transform` is a CSS presentation
  effect and does not change the accessible name; the documentation states this, because an author
  who needs uppercase _content_ must write uppercase content.
- **Keyboard.** No key model. Typography publishes no keyboard table rather than an empty one.
- **Focus.** Owns no focus, entry, exit, or restoration behaviour, and assigns no tab index.
- **Announcements.** None; it owns no live region.
- **Colour.** Every tone resolves to a semantic token with light and dark values. Meaning is never
  carried by colour alone: a `critical` or `caution` tone is a visual reinforcement, and the text
  itself must say what is wrong.
- **Contrast.** Each tone is bound to a text-role token that meets the WCAG 2.2 AA 4.5:1 baseline
  ADR-009 fixed for this platform against its intended surface; `inverse` is bound to the inverse
  text token and is intended only for an inverse surface.
- **Zoom, reflow and text scaling.** Every size is a `rem` value, so text scales with the user's
  font-size preference; no size is expressed in pixels. At 320 CSS pixels the component introduces
  no horizontal overflow, and the only element that could — a long `code-block` — scrolls within
  its own box.
- **Forced colours.** Text takes the system foreground; the `quote` rule's border takes a system
  colour so the block does not lose its structure.
- **Reduced motion.** No animation, transition, or transform of any kind.
- **RTL.** Direction is inherited from the ambient `dir`. Alignment is logical, so `start` follows
  the direction rather than fighting it, and the `quote` border and every spacing side use logical
  properties.
- **IME.** Not applicable: no text is entered.

## API requirements

Behavioural requirements; the exact names below are the approved surface.

- `as?: TypographyElement` — closed union of fourteen non-interactive text elements. Default derived.
- `variant?: TypographyVariant` — closed union of eleven roles. Default derived.
- `size?: TypographySize` — `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'`.
- `weight?: TypographyWeight` — `'regular' | 'medium' | 'semibold' | 'bold'`.
- `align?: TypographyAlign` — `'start' | 'end' | 'center' | 'justify'`.
- `transform?: TypographyTransform` — `'none' | 'uppercase' | 'lowercase' | 'capitalize'`.
- `tone?: TypographyTone` — `'inherit' | 'default' | 'muted' | 'accent' | 'positive' | 'caution' |
'critical' | 'inverse'`. Default `'inherit'`.
- `spacing?: TypographySpacing` — a `TypographySpace` step or a `TypographySpacingSides` object.
- `children?: ReactNode`.
- `className?: string` — appended after `.csn-typography`, which is never replaced.
- `ref` — forwarded to the rendered element as `HTMLElement`. No custom imperative handle: there is
  no durable imperative need, and `API_GOVERNANCE.md` restricts refs to those.

Reserved and rejected by the type, each because it would contradict semantics the component owns:
`dangerouslySetInnerHTML` (the markup sink this API exists without), `color` (owned by `tone`),
`role` and `aria-level` (owned by `as`).

No prop is a third-party type, and the public surface exports only Casauran types.

## Styling/theming

- One stylesheet, `packages/react/src/components/typography/typography/typography.css`, published as
  the `@casauran/react/typography.css` entry point and retained in the package `sideEffects` list.
- Everything is authored inside `@layer components`, so the fixed cascade order
  `reset → tokens → base → components → utilities → overrides` holds and a consumer override written
  in `overrides` always wins.
- Five governed component tokens form the customization seam: `typography.font-family`,
  `typography.font-size`, `typography.font-weight`, `typography.line-height` and `typography.color`.
  Each is assigned by every enumerated value of the property that owns it — including the defaults —
  so an override behaves identically for a default and for an explicit value. This is the seam
  defect the Icon revalidation found, fixed in advance here.
- One new primitive token is required: `font.size.3xl` at `1.875rem`. The existing scale stops at
  `1.5rem`, which the `title` role already occupies, so `display` has no step to bind to. It is
  added at the token owner layer, `registry/tokens/foundation.json`, and regenerated.
- Spacing steps resolve from the governed space primitives (`space.0`, `space.1`, `space.2`,
  `space.4`, `space.6`, `space.10`) through per-side internal custom properties, applied with
  `margin-block-start`, `margin-block-end`, `margin-inline-start` and `margin-inline-end`.
- Light and dark themes, comfortable and compact densities, and nested theme scopes are inherited
  from `@casauran/theme` rather than re-implemented. Type sizes deliberately do not change with
  density: density governs control spacing on this platform, and rescaling body text by density
  would fight the user's own font-size preference.
- Adaptive behaviour: none is required. Text reflows; it does not change mode at a breakpoint.
- No competitor CSS, theme value, class name, or numeric constant was consulted or copied.

## Rendering

`serverRenderable: true`, `requiresClient: false`, `clientReasons: []`, `hydrationSensitive: false`.

Typography is a Server Component. It declares no `'use client'` boundary, reads no browser global at
module evaluation or during render, and holds no effect, observer, listener, timer, portal, random
value, current-time read, or generated identifier, so `useStableId` is not involved and server and
client markup are byte-identical. It contributes nothing to the client bundle and renders unchanged
inside a client component.

## Internationalization

Typography owns no message catalogue, number format, or date format: its content is supplied
already localized. Direction is inherited from the ambient `dir` and is never set by the component.
Alignment is logical so it follows direction. `lang` and `dir` pass through for a passage in another
language or direction inside a page.

`transform="capitalize"` and `transform="uppercase"` are locale-sensitive CSS operations — Turkish
dotted and dotless i, German eszett, and languages with no case at all — so the documentation states
that casing rules belong to the content where correctness matters, and no variant applies a
transform by default.

## Security

- **No markup sink.** `dangerouslySetInnerHTML` is rejected by the type. Content reaches the
  document only as React children, which React escapes. There is no sanitizer to keep correct
  because there is nothing to sanitize.
- **A code block is content, not markup.** The analysed model renders multi-line code through the
  raw-markup escape hatch. `variant="code-block"` preserves whitespace in CSS, so untrusted code —
  from a CMS, a diff, a log line, or model output — renders as text with no injection path.
- **No URL, network, storage, or dynamic-code surface.** The component fetches nothing, stores
  nothing, evaluates nothing, and introduces no content-security-policy allowance of its own.
- **`style` passthrough remains the caller's trust boundary.** It is a React `CSSProperties` object,
  not a string, so it cannot carry a declaration block; the documentation states that a caller
  building one from untrusted input owns that decision.
- **Untrusted text is still untrusted text.** The security topic states that Typography renders what
  it is given: it does not linkify, interpret, or transform content.

## Performance

One element, no state, no effect, and a resolution that is a handful of lookups. The governed
scenario is server rendering, because that is where a text primitive is used at volume: a page of
prose can hold hundreds of Typography elements and a data view can hold thousands.

Scenario: 5,000 server renders through `react-dom/server` after a production package build,
cycling the variant, size, tone and spacing surfaces so defaulting, overriding and the object
spacing form are all exercised. Ceiling: 500 ms. The result, with its Node version, platform and
architecture, is recorded in `.agent/performance-budgets.md`. This is a bounded regression guard,
not an unqualified speed claim.

## Edge cases

- **No children.** Renders an empty element rather than throwing; an empty paragraph is a legitimate
  placeholder and there is nothing to fail closed on.
- **Both `as` and `variant` given.** Both honoured; neither overrides the other.
- **A heading element with body type, and a span with display type.** Both supported and both
  documented, because that is the point of the separation.
- **`spacing` object with one side.** Only that side gets a margin; the others get none.
- **`spacing="none"` and a `none` side.** Resolves to a zero margin, which is distinct from omitting
  the prop only in that it defeats a `margin` inherited from a consumer stylesheet.
- **Very long unbroken content.** A `code-block` scrolls within its own box; other variants wrap.
- **Nested Typography.** Supported: an inline `code` or `strong` inside a `body` paragraph is the
  expected composition, and the inner element inherits colour when its tone is `inherit`.
- **Composed into Button.** A Typography element renders inside Button's content slots and takes the
  control's foreground through `tone="inherit"`.
- **Forms.** Typography participates in no form. It renders no control, no name, and no value.

## Test matrix

- **Unit** (`tests/unit/typography.test.tsx`): element and variant defaulting in all four
  combinations; every element value; every variant value; every size, weight, align, transform and
  tone value reflected; spacing shorthand and each object side; class-name append; ref forwarding;
  native attribute passthrough; server rendering through `react-dom/server`; empty children; and
  compile-level rejection of every reserved prop with `@ts-expect-error`.
- **Browser** (`tests/browser/typography.spec.ts`): production SSR content in the server response;
  the resolved computed font size, weight, line height and family per variant; monotonic size scale;
  every declared enumerated value rendered, driven from the registry; logical alignment under RTL;
  tone colours distinct and `inherit` following its context including inside a solid Button; the
  component token seam beating an explicit value; spacing applied to the correct logical sides;
  heading semantics and the absence of an invented heading role; code-block whitespace preservation
  and horizontal containment; 320 px reflow; forced colours; and the deterministic visual matrix.
- **Visual** (`apps/visual-tests/app/typography/` and the committed baseline): the type ramp, size
  scale, weight scale, alignment, transforms, tones, spacing, inverse surface, dark compact theme,
  and RTL.
- **Performance**: `benchmarks/typography.mjs` and `pnpm benchmark:typography`.
- **Security**: unit and browser cases proving code content renders as text, plus the compile-level
  rejection of `dangerouslySetInnerHTML`.

Nothing is duplicated across layers to inflate coverage: computed style, direction and layout are
asserted only in the browser, and pure resolution only in unit tests.

## Parity acceptance

| Dimension     | Evidence required                                                                        |
| ------------- | ---------------------------------------------------------------------------------------- |
| functionality | Every capability above implemented, unit and browser evidence, documentation topic       |
| states        | Every enumerated value of every property rendered and asserted                           |
| interaction   | `not-applicable`; the component owns no pointer, activation, or scroll behaviour         |
| keyboard      | `not-applicable`; no focus, tab stop, or key handler                                     |
| accessibility | Element-derived semantics, no invented heading level, contrast, reflow, forced colours   |
| responsive    | 320 px reflow with no horizontal overflow; the code block contains its own overflow      |
| i18n          | No component-owned messages or formats; casing caveat documented                         |
| rtl           | Inherited direction, logical alignment and spacing, browser assertion                    |
| theming       | Five component tokens with uniform seam behaviour, light/dark, density, visual matrix    |
| ssrNext       | Server-renderable root export, no client boundary, production Next hosts                 |
| performance   | Recorded scenario, ceiling, environment and observed result                              |
| security      | No markup sink, code-as-text evidence, compile-level rejection                           |
| docs          | Production route with a preview per enumerated value, API, accessibility and limitations |
