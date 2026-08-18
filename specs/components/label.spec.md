# Component Specification: Label

## Provenance

Written from `specs/components/label.reference-analysis.md` against pinned baseline
`6a05c926c4f08b89782c25336fc159fea3a3f26b`, snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`, resolved local-only. The
examined pages and the ten Casauran decisions taken in advance are recorded there. No competitor
source, CSS, theme value, class name, asset, or example file was used as implementation input.

## Purpose and scope

Label is the platform's form-caption primitive: a `<label>` element that names an editor, carries
the requirement and validity signals a form needs, and does so without costing anything on the
client.

It solves three problems an application otherwise re-solves per form:

- **The association is easy to get wrong.** A caption that is only visually adjacent to its editor
  names nothing for assistive technology, and does not enlarge the click target the way a real
  association does.
- **Requirement marking has no standard.** An asterisk glued into the caption string is invisible
  to a translator, inconsistent between screens, and frequently the only signal that a field is
  required.
- **State drifts from the editor.** Invalid and disabled editors need their captions to follow, and
  hand-written conditional class names diverge from the control they describe.

Non-goals, each owned elsewhere: the editor itself, and therefore `required`, `aria-required`,
`aria-invalid`, `aria-describedby` and `disabled` on it, which belong to the control
(`1.06 Input` onward); a floating or animated caption that wraps its editor (`FloatingLabel`); a
supporting hint message associated by description (`Hint`); a validation error message (`Error`);
form state, validation and submission (`Form`); layout of a field group (`StackLayout`,
`GridLayout`); and localization of the caption or the marker, which arrive already translated.

## Observable capabilities

1. **Native association (`htmlFor`).** Sets the `label` element's own `for` attribute. The browser
   then supplies the accessible name for any labelable control and forwards activation, so clicking
   the caption focuses, checks or toggles the control with no JavaScript.
2. **Association for a non-labelable editor (`id`).** The label carries an identifier and the
   widget points at it with `aria-labelledby`. This is the supported path for a custom widget that
   renders no native control, and it is documented as the inverse of capability 1.
3. **Requirement marker (`requirement`).** `none` (default), `optional`, or `required`. A value
   other than `none` renders the supplied marker text as part of the caption, after the text and
   separated by a literal space plus a governed visual gap. The space is required for correctness,
   not for appearance: accessible-name computation concatenates the text of inline descendants
   without inserting one, so a marker without it is announced joined to the field name.
4. **Supplied marker text (`requirementText`).** Mandatory whenever a marker is requested, and
   rejected when it is not, enforced by the prop type. The component ships no default word in any
   language and reads no ambient locale.
5. **Invalid state (`invalid`).** A positive boolean that recolours the caption to the critical
   text token.
6. **Disabled state (`disabled`).** A positive boolean that dims the caption and shows the
   not-allowed cursor.
7. **State precedence.** A disabled editor's caption reads as disabled even when it is also
   invalid, because an editor the user cannot change should not be presented as a problem to fix.
   Both states are still reflected separately.
8. **Empty caption (`children` omitted).** Renders a caption box of one line's height so a field
   with no visible label keeps the surrounding form's alignment, reflected as an explicit state.
9. **Reflected state.** `data-csn-component`, `data-requirement`, `data-invalid`, `data-disabled`
   and `data-empty`, so every resolved value is observable from a selector or a test.
10. **Passthrough.** The non-conflicting native attributes of a `label` — `id`, `style`, `title`,
    `lang`, `dir`, `data-*`, pointer and mouse handlers — plus a forwarded ref to the element and a
    `className` appended after the stable root hook.

## Anatomy and composition

```text
<label class="csn-label">
  caption text
  <span class="csn-label__requirement">marker text</span>   // only when requirement !== 'none'
</label>
```

One element, plus one span that exists only when a marker is requested. No wrapper, no portal, no
slot.

Label composes no other public component and uses no internal engine. It renders `<label>`
directly, which is correct under `COMPONENT_COMPOSITION_RULES.md`: Label _is_ the owner of the
caption primitive, and `<label>` is not in the rule's interactive set — it is the element this
component exists to own. `composition.uses` is empty and no native interactive exception is
required.

Typography composes _inside_ a Label as ordinary children when a caption needs a second line or a
code fragment; the reverse is not supported, because the caption's element is the association and
must not be replaced.

## State model

Label owns no state. There is no controlled or uncontrolled value, no default or initial state, no
transition, no event, no async behaviour and no reset, so `useControllableState` is not involved and
there is no dual source of truth.

`invalid` and `disabled` are _reflections_ of the editor's state, not sources of it: Label never
disables anything and never marks anything invalid. The specification says so explicitly because the
opposite assumption is the likely misuse.

Every prop is a pure presentational input resolved during render. Emptiness is derived from the
`children` value — `undefined`, `null`, `''` and `false`, the values React itself renders as
nothing — and not from what the tree eventually produces; the documentation states that rule.

Invalid combinations are unreachable through types: `requirement` is a closed union, and the props
form a discriminated pair so that a marker without text and text without a marker are both compile
errors. `dangerouslySetInnerHTML`, `color` and `role` are rejected for the same reason.

## Interaction model

Label owns no interaction of its own. It registers no listener, holds no handler and adds no tab
stop.

The one interaction it participates in is the browser's: a `label` with a `for` attribute naming a
labelable control forwards a click to that control, focusing a text field, toggling a checkbox or
selecting a radio. That behaviour is native, works without JavaScript, works during server-only
rendering, and is exactly what capability 1 exists to obtain. Native handlers pass through so a
caller can integrate the element, but the component never handles one.

For a widget that is not labelable, activation belongs to the component that owns the widget. Label
supplies the naming relationship through `id`; it does not reach into a foreign ref.

## Accessibility

- **Semantics come from the element.** A real `<label>` is rendered, so the browser establishes the
  label relationship and computes the control's accessible name from the caption. No ARIA is added,
  and a passthrough `role` is rejected because it would contradict that.
- **Two supported association paths, and no third.** `htmlFor` for a labelable control;
  `id` plus the widget's `aria-labelledby` for anything else. The documentation states that a
  caption which is only visually adjacent names nothing.
- **The marker is announced, and announced separately.** The requirement text renders as text
  inside the label, so it becomes part of the control's accessible name, and a literal space
  separates it from the caption so the two are not run together — the CSS gap contributes nothing
  to a name. The documentation states that the marker is a convention and not the mechanism: the
  editor must still carry `required`/`aria-required`, and a bare glyph such as an asterisk is
  discouraged because it is announced inconsistently or not at all.
- **Invalid is never colour alone.** The critical colour is a reinforcement; the machine-readable
  signal is `aria-invalid` on the editor and the accompanying message. Under forced colours the
  colour distinction disappears entirely, which the documentation uses as the argument.
- **Disabled is presentation only.** Label dims the caption; the editor owns the `disabled` state
  that removes it from the tab order and from form submission.
- **Contrast.** The caption, the marker and the invalid colour are each bound to a text token
  meeting the WCAG 2.2 AA 4.5:1 baseline ADR-009 fixed for this platform. The dimmed disabled
  caption is exempt under WCAG 1.4.3, and the documentation says so rather than implying it passes.
- **Keyboard.** No key model. Label publishes no keyboard table rather than an empty one; the tab
  stop and key handling belong to the editor.
- **Focus.** Owns no focus, entry, exit or restoration behaviour and assigns no tab index.
- **Target size.** Associating the caption enlarges the effective activation area of a checkbox or
  radio, which helps WCAG 2.5.8; the documentation records it as a reason to associate.
- **Zoom, reflow and text scaling.** Sizes are `rem` values, so the caption scales with the user's
  font-size preference. At 320 CSS pixels a long caption wraps and the marker stays with it; no
  horizontal overflow is introduced.
- **Forced colours.** The caption paints a system foreground and the disabled caption a system
  grey, so both states survive a collapsed palette.
- **Reduced motion.** No animation, transition or transform of any kind.
- **RTL.** Direction is inherited from the ambient `dir`; the gap before the marker is a logical
  inline margin, so the marker follows the caption in both directions.
- **IME.** Not applicable: no text is entered.

## API requirements

Behavioural requirements; the exact names below are the approved surface.

- `htmlFor?: string` — the editor's identifier, set as the element's own `for` attribute.
- `children?: ReactNode` — the caption. Omitted deliberately for an unlabelled field.
- `requirement?: 'none' | 'optional' | 'required'` — default `'none'`.
- `requirementText?: string` — required when `requirement` is `'optional'` or `'required'`,
  rejected when it is `'none'` or omitted. Enforced as a discriminated union rather than by a
  runtime check, so the mistake cannot reach a running application.
- `invalid?: boolean` — default `false`.
- `disabled?: boolean` — default `false`.
- `className?: string` — appended after `.csn-label`, which is never replaced.
- `ref` — forwarded to the `HTMLLabelElement`. No custom imperative handle: there is no durable
  imperative need, and `API_GOVERNANCE.md` restricts refs to those.

Reserved and rejected by the type: `dangerouslySetInnerHTML` (a caption is children; the platform
ships no markup sink), `color` (a legacy presentational attribute; colour comes from state and
tokens) and `role` (semantics come from the element).

Deliberately absent, with reasons in the parity audit: an inverted validity boolean, an editor ref
for click forwarding, a size scale, a tone scale, and a direction property.

No prop is a third-party type, and the public surface exports only Casauran types.

## Styling/theming

- One stylesheet, `packages/react/src/components/labels/label/label.css`, published as the
  `@casauran/react/label.css` entry point and retained in the package `sideEffects` list.
- Authored inside `@layer components`, so the fixed cascade order
  `reset → tokens → base → components → utilities → overrides` holds and a consumer override written
  in `overrides` always wins.
- Nine governed component tokens form the customization seam: `label.color`, `label.font-family`,
  `label.font-size`, `label.font-weight`, `label.line-height`, `label.gap`,
  `label.requirement-color`, `label.invalid-color` and `label.disabled-opacity`. Each is
  assigned at one specificity, and each state assigns the token rather than the CSS property, so an
  override applies to a default and to an explicit state alike.
- The caption is normal inline text — not a flex container — so a long caption wraps naturally and
  the marker stays in the text flow. The gap before the marker is `margin-inline-start`, which is
  logical, and is visual separation only; the separator that reaches the accessible name is the
  literal space the component renders.
- The empty state reserves one line of height with
  `calc(var(--csn-label-font-size) * var(--csn-label-line-height))`, so an unlabelled field keeps
  its row alignment.
- Light and dark themes, comfortable and compact densities, and nested theme scopes are inherited
  from `@casauran/theme` rather than re-implemented. The caption does not rescale with density, for
  the reason `1.04 Typography` recorded: density governs control spacing, not the reader's text size.
- No competitor CSS, theme value, class name, or numeric constant was consulted or copied.

## Rendering

`serverRenderable: true`, `requiresClient: false`, `clientReasons: []`, `hydrationSensitive: false`.

Label is a Server Component. It declares no `'use client'` boundary, reads no browser global at
module evaluation or during render, and holds no effect, observer, listener, timer, portal, random
value, current-time read or generated identifier, so `useStableId` is not involved and server and
client markup are byte-identical. It contributes nothing to the client bundle and renders unchanged
inside a client component.

This is a deliberate consequence of the API: the two decisions that would have forced a client
boundary — resolving the marker word from an ambient locale, and forwarding a click through a
foreign ref — were both rejected in the reference analysis, in advance.

## Internationalization

Label owns no message catalogue, number format or date format. The caption and the marker text both
arrive already localized from the caller, and the type makes the marker text mandatory precisely so
that it passes through a translation pipeline instead of being a hidden default.

Direction is inherited from the ambient `dir` and never set by the component; the marker gap is a
logical inline margin. `lang` and `dir` pass through for a caption in another language or direction.

## Security

- **No markup sink.** `dangerouslySetInnerHTML` is rejected by the type. The caption and the marker
  reach the document only as React children, which React escapes. There is no sanitizer to keep
  correct because there is nothing to sanitize.
- **A caption is frequently untrusted.** Field names in a form built from a schema, a CMS row or
  model output are exactly the case where a markup path would be exploited; the security topic says
  so and shows a caption containing markup rendering as text.
- **No URL, network, storage or dynamic-code surface.** The component fetches nothing, stores
  nothing and evaluates nothing, and introduces no content-security-policy allowance of its own.
- **`htmlFor` is an identifier, not a URL.** It is written to an attribute and never dereferenced,
  fetched or used to build a selector, so a hostile value can only fail to match.
- **`style` remains the caller's trust boundary.** It is a `CSSProperties` object rather than a
  string, so it cannot carry a declaration block.

## Performance

One element, no state, no effect, and a resolution of a handful of values. The governed scenario is
server rendering, because a form of fifty fields renders fifty captions and an application renders
many such forms.

Scenario: 5,000 server renders through `react-dom/server` after a production package build, cycling
the requirement, invalid, disabled and empty surfaces so the marker path, both state paths and the
empty path are all exercised. Ceiling: 500 ms. The result, with its Node version, platform and
architecture, is recorded in `.agent/performance-budgets.md`. This is a bounded regression guard,
not an unqualified speed claim.

## Edge cases

- **No caption and no association.** Renders an empty, unassociated `<label>` — valid, and the
  documented way to hold a row's alignment. It names nothing, which the documentation states.
- **Caption present, no `htmlFor`.** Renders a caption that names nothing; the documentation is
  explicit that visual adjacency is not an association, and the docs show the two supported paths.
- **`htmlFor` pointing at nothing.** Renders unchanged; the browser simply forms no relationship.
  Nothing is dereferenced, so there is no failure mode beyond the missing association.
- **Both `invalid` and `disabled`.** Disabled presentation wins; both attributes are still
  reflected so a test or a consumer selector can see the full state.
- **Requirement marker with a whitespace-only text.** Rendered as given; the type demands a string
  and the component does not silently decide the caller meant nothing. The documentation asks for a
  word rather than a glyph.
- **Very long caption.** Wraps; the marker stays in the flow with it rather than being pushed onto
  a line of its own by a flex gap.
- **Nested interactive content in the caption.** Not supported and not prevented by the type: HTML
  forbids nesting a labelable element inside a `label` that already has a `for`. The limitations
  topic states it.
- **Composed into a form.** Label participates in no form state; it submits nothing and has no name
  or value.

## Test matrix

- **Unit** (`tests/unit/label.test.tsx`): the rendered element and its stable hook; `htmlFor`
  reaching the `for` attribute; the caption; every requirement value and its marker text; marker
  absence for `none`; invalid and disabled reflection; both together; the empty state across every
  value React renders as nothing; a non-empty caption not being empty; class-name append; native
  attribute passthrough; server rendering; escaping; determinism; ref typing; and compile-level
  rejection of every reserved prop and of both halves of the marker pair with `@ts-expect-error`.
- **Browser** (`tests/browser/label.spec.ts`): production SSR content in the server response; the
  registry-driven enumerated-value check; the accessible name a real association produces for a
  text field, a checkbox and a radio; a native click on the caption focusing a text field and
  toggling a checkbox; the non-labelable path naming a widget through `aria-labelledby`; the marker
  being part of the accessible name; invalid and disabled resolved colours; disabled precedence;
  the empty caption holding a line of height; the component token seam beating a state colour;
  inherited direction with the marker on the correct side; forced colours; text scaling; 320 px
  reflow with a long caption; and the deterministic visual matrix.
- **Visual** (`apps/visual-tests/app/label/` and the committed baseline): default, both markers,
  invalid, disabled, disabled-and-invalid, empty, long caption, composed with native controls,
  token override, dark compact theme, and RTL.
- **Performance**: `benchmarks/label.mjs` and `pnpm benchmark:label`.
- **Security**: unit and browser cases proving a caption containing markup renders as text, plus
  the compile-level rejection of the markup sink.

Nothing is duplicated across layers to inflate coverage: accessible names, computed colours,
activation and layout are asserted only in the browser; pure resolution only in unit tests.

## Parity acceptance

| Dimension     | Evidence required                                                                             |
| ------------- | --------------------------------------------------------------------------------------------- |
| functionality | Every capability above implemented, unit and browser evidence, documentation topic            |
| states        | Requirement, invalid, disabled, both, and empty each rendered and asserted                    |
| interaction   | Native label activation asserted in the browser for a text field and a checkbox               |
| keyboard      | `not-applicable`; no focus, tab stop, or key handler of its own                               |
| accessibility | Accessible name through both association paths, marker announcement, contrast, forced colours |
| responsive    | 320 px reflow with a long caption and no horizontal overflow                                  |
| i18n          | No component-owned messages; marker text mandatory and caller-supplied                        |
| rtl           | Inherited direction, logical marker gap, browser assertion                                    |
| theming       | Nine component tokens with uniform seam behaviour, light/dark, density, visual matrix         |
| ssrNext       | Server-renderable root export, no client boundary, production Next hosts                      |
| performance   | Recorded scenario, ceiling, environment and observed result                                   |
| security      | No markup sink, caption-as-text evidence, compile-level rejection                             |
| docs          | Production route with a preview per enumerated value, API, accessibility and limitations      |
