# Label reference analysis

## Provenance

The required local-only preflight passed on 2026-08-18 against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`, resolved through
`CASAURAN_KENDO_DOCS_PATH`. No online repository, live documentation site, search engine,
third-party tutorial, or model memory was used, and no fallback exists.

The stage ledger and the registry entry agree on the reference domain, `docs/content/labels`, and
that directory exists in the pinned corpus, so no path supersession was needed. Unlike `1.02`,
`1.03` and `1.04`, the domain holds four sibling components; only one of them, `Label`, is this
stage's contract.

## Examined paths

Paths are relative to `docs/content`. Every path below was opened and read in this stage.

### Component pages for this stage's component

- `labels/label/index.md`
- `labels/label/invalid-state.md`
- `labels/label/optional.md`
- `labels/label/without-form-element.md`

### API pages

- `labels/api/Label.md`
- `labels/api/LabelProps.md`
- `labels/api/index.md`
- `common/api/LabelClasses.md`
- `common/api/LabelsClassStructure.md`

### Package, cross-cutting and integration pages

- `labels/index.md`
- `labels/get-started.md`
- `labels/globalization.md`
- `form/labels.md`
- `styling/unstyled.md`
- `common-features/accessibility/accessibility-compliance.md`
- `common-features/accessibility/index.md`
- `intl/l10n/index.md`

### Sibling components in the same domain, read to fix this stage's boundary

Read to establish what belongs to `Label` and what does not, not as implementation input:

- `labels/hint/index.md`, `labels/hint/direction.md`, `labels/api/HintProps.md`
- `labels/error/index.md`, `labels/error/direction.md`, `labels/api/ErrorProps.md`
- `labels/floating-label/index.md`, `optional.md`, `invalid-state.md`, `with-placeholder.md`,
  `without-form-element.md`, `labels/api/FloatingLabelProps.md`

### Searched and found to carry no additional Label requirement

A corpus-wide case-insensitive search for the word returns 336 files, because almost every
component API table has an `aria-label`, `label`, `labelClassName` or similar property of its own.
Those are other components' properties, not capabilities of this component, and the four pages that
do constrain it are listed above. Four cross-cutting families were then searched by keyword:

- `common-features/accessibility/accessibility-compliance.md` — the suite compliance table lists
  `Label` with no WCAG level, no keyboard model and no accessibility page, exactly as it does for
  `FloatingLabel`, `Form` and `Input`. There is no documented role, name, state or key obligation.
- `intl/l10n/index.md` and `labels/globalization.md` — the only localizable string in the family is
  a single message key for the optional marker, resolved from an ambient localization provider.
- `styling/unstyled.md` — the family participates in the runtime class-replacement mode, whose
  per-state class shape is published as `LabelClasses` with four states.
- `form/labels.md` — the Form family composes these components rather than owning labelling, and
  states the two obligations that matter: the association must reach assistive technology, and a
  click on the label must reach the editor.

There is no keyboard, events, data, virtualization, adaptive, responsive, IME, security or
performance page for this component anywhere in the corpus.

### Deliberately not opened as implementation input

`labels/examples/**`. The example directories were opened only far enough to confirm which public
properties each page demonstrates; no example file was used as implementation input, no wording or
markup was carried across, and §6 of the component-stage prompt forbids implementing from them.

## Extracted behavioral requirements

Observed facts, expressed as capability families rather than API shapes.

- **A label is not standalone.** The stated purpose is to attach a caption to an editor, and the
  getting-started page says explicitly that the component is not intended to be used on its own.
  Its whole value is a relationship to something else.
- **Association through the native mechanism.** The editor's identifier is passed to the label,
  which sets it as the native `for` relationship on a `label` element. This is the documented
  primary path and it is what makes the browser forward activation.
- **Association for editors that are not form elements.** The native relationship only binds
  labelable elements. For a custom widget the documented path is the inverse: the label carries an
  identifier of its own and the widget points back at it with `aria-labelledby`.
- **Click forwarding to a custom editor.** For the same non-form case, a reference to the editor may
  be handed to the label; on click the label looks on that reference for a `focus` method, or for an
  active-element property whose `click` it then calls. The documentation notes this already works
  for the suite's own form components.
- **Optional marker.** A boolean renders an additional parenthesised word inside the label. The word
  is a localizable message resolved from an ambient localization provider under a single message
  key, and customising it means loading a message catalogue and wrapping the tree in that provider.
- **Invalid state.** A boolean expressing the _validity_ of the editor — false meaning invalid —
  recolours the label.
- **Disabled state.** A boolean expressing that the editor is disabled. It appears on the property
  table and in the published class shape, but no page demonstrates it.
- **Empty state.** The caption may be omitted deliberately, so that an editor with no label keeps
  the surrounding form layout. The published class shape carries a distinct state for it.
- **Published per-state class shape.** The class-replacement mode publishes four states for this
  component: main, disabled, invalid, empty.
- **Passthrough surface.** A class name, an inline style object, and an identifier.
- **Right-to-left.** The family has no direction property on this component; the documented path is
  to pass a direction through the inline style, while the sibling floating variant has a `dir`
  property and the hint and error siblings have a logical `direction` property that positions the
  message at the start or the end.
- **Family boundary.** The domain also ships a floating variant that wraps the editor and animates
  the caption, a hint message positioned after the editor and associated by description, and an
  error message with the same shape. Each is a separate component with its own page, its own
  property table and its own registry entry.
- **No interaction, keyboard, events, forms API, data, adaptive, responsive, performance or
  security documentation exists for this component.** The absence is systemic, not thin: the
  compliance table records no level and no keyboard model for it at all.

## Casauran decisions

Design decisions taken in response to the observed facts, recorded here in advance of the
specification so that a later divergence cannot be presented as an after-the-fact excuse.

1. **The native relationship is the API.** `htmlFor` is the React name for the `label` element's
   own association attribute, so a caller who knows HTML already knows the prop, and a caller who
   inspects the DOM sees exactly what was asked for. A second, differently named alias would add a
   public name for something the platform already names.
2. **Positive booleans, never an inverted one.** `invalid` and `disabled` replace a _validity_
   boolean whose meaningful value is `false`. A prop that must be read as a double negative is a
   defect factory, and every other Casauran state prop is positive.
3. **Both requirement markers, as one closed vocabulary.** The reference marks only the optional
   case. Marking a field _required_ is the more common convention and the one with a real
   accessibility contract behind it, so `requirement` is `none`, `optional` or `required`.
4. **The marker text is supplied, not resolved from ambient state.** Casauran has no React
   localization provider, and introducing one for a single word would add a client boundary and a
   hydration hazard to the most server-friendly component in the library. The type makes the text
   mandatory whenever a marker is requested, so an unlocalized marker cannot be shipped by accident
   and no catalogue has to be loaded to change one word.
5. **The marker is part of the accessible name, and the editor still owns the requirement.** The
   marker renders as text inside the `label`, so assistive technology announces it. The
   documentation states that it is a visual and textual convention only, and that the editor must
   still carry the native `required` state — a marker is not a substitute for it.
6. **No click forwarding through a foreign ref.** Looking on an arbitrary ref for a `focus` method
   or an active-element property is duck-typing another component's internals: it silently does
   nothing when the shape does not match, it forces a client boundary and a listener onto every
   label in an application, and `API_GOVERNANCE.md` restricts refs to durable imperative needs.
   Casauran keeps the naming relationship, which is the part assistive technology depends on, and
   leaves activation to the component that owns the widget — which is where the platform's
   composition rules already put interaction.
7. **Server-renderable, with no client boundary.** Following from 4 and 6, the component holds no
   state, no handler and no effect. It is the most common component in a form and must cost nothing
   on the client.
8. **The empty state is explicit and observable.** An omitted caption is a deliberate layout
   decision, so it is reflected as a state attribute rather than being invisible.
9. **Direction is inherited, never a style property.** Passing a direction through an inline style
   is a workaround for a component that does not use logical properties. Casauran's stylesheet is
   logical throughout, so a label inside a right-to-left region is correct with no property at all.
10. **One component, not four.** The floating variant, the hint and the error each own different
    semantics — a wrapper that animates, and two description-associated messages — and each has its
    own registry entry and its own stage. This stage ships `Label` only.
