# Icon Parity Audit

Outcome: **PASS**  
Stage: `1.02`  
Original audit: 2026-08-14  
Capability-completeness revalidation: 2026-08-16
(`.agent/reviews/2026-08-16-icon-revalidation.md`)

## Provenance and clean-room review

The mandatory local-only preflight passed against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862` on both audit dates. Every
examined path — the original eight component and API pages and the twenty-three package, provider,
styling and cross-cutting pages added by the revalidation — is recorded in
`icon.reference-analysis.md`, together with the example directories deliberately left unopened. The
implementation was produced from `icon.spec.md`; no source, CSS, asset, path data, bundle, private
architecture, undocumented DOM, online fallback, competitor API, or runnable example file was used
as implementation input.

## Disposition vocabulary

Every materially relevant capability carries exactly one disposition: `IMPLEMENTED`,
`IMPLEMENTED_DIFFERENTLY`, `NOT_APPLICABLE`, `INTENTIONALLY_DIVERGED`,
`DEFERRED_TO_DECLARED_DEPENDENCY`, or `BLOCKED`. A silent omission and an unowned deferral are not
acceptable final states. Deferral names the owning stage.

## Observable capability audit

| #   | Capability                                                       | Disposition                     | Casauran evidence and rationale                                                                                                                                                                                                                                                                              |
| --- | ---------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Named catalog glyph rendering                                    | IMPLEMENTED                     | One `<span>` wrapping an independently authored SVG definition resolved from `@casauran/icons`; unit catalog case renders every definition, browser SSR case proves the glyph is in the server response                                                                                                      |
| 2   | Untyped string icon name                                         | IMPLEMENTED_DIFFERENTLY         | `name` is the `IconName` catalog union, so a glyph that does not exist is a compile error rather than an element that silently renders nothing — the exact defect this revalidation found in Casauran's own documentation. `isIconName` narrows a value that crossed a runtime boundary                      |
| 3   | Unknown name behaviour                                           | IMPLEMENTED                     | Fails closed: the element renders with no child SVG, keeps its decorative semantics, and reflects the requested name only as an escaped attribute; unit and browser cases                                                                                                                                    |
| 4   | Font-icon consumption mode                                       | INTENTIONALLY_DIVERGED          | ADR-003 fixed static CSS and independently authored SVG before implementation began and rules out icon fonts, so there is no glyph class, ligature, or Unicode escape. The reference itself moved its default to SVG for content-security-policy reasons, and Casauran starts where that migration ends      |
| 5   | Icon-type switch between font and SVG                            | NOT_APPLICABLE                  | The capability exists only to reconcile two consumption modes. Casauran ships one mode by architectural decision, so there is nothing to switch between and a provider for it would add API surface with no capability behind it                                                                             |
| 6   | Size scale                                                       | IMPLEMENTED                     | Seven steps, `xs` through `3xl`, each assigning `--csn-icon-size` at the same specificity including the `md` default; unit attribute case, browser monotonic-and-square case, visual size panel, docs size preview of every value                                                                            |
| 7   | Custom size outside the scale                                    | IMPLEMENTED                     | The `--csn-icon-size` component token is the documented seam, overridden in the `overrides` cascade layer; browser seam case proves the override beats an explicit size and tone alike                                                                                                                       |
| 8   | Semantic colour scale: inherit, success, warning, error, inverse | IMPLEMENTED                     | `inherit`, `positive`, `caution`, `critical`, `inverse`, each bound to a semantic token with dark-theme values; browser case asserts every tone resolves to a distinct colour                                                                                                                                |
| 9   | Semantic colour `primary`                                        | IMPLEMENTED                     | `tone="accent"`, the single brand ramp ADR-006 defines, matching Button's vocabulary                                                                                                                                                                                                                         |
| 10  | Semantic colour `info`                                           | IMPLEMENTED_DIFFERENTLY         | Informational artwork resolves to `tone="accent"`. Icon previously exposed an `info` value that resolved to the same custom property as `accent`, which is two public names for one colour with no way for a caller to tell them apart; the revalidation removed it so Icon and Button share one vocabulary  |
| 11  | Semantic colours `secondary` and `tertiary`                      | IMPLEMENTED_DIFFERENTLY         | De-emphasis is `tone="muted"`, bound to the muted text token, rather than additional brand ramps; ADR-006 defines one brand ramp and Button expresses the same idea through neutral tone plus appearance                                                                                                     |
| 12  | Inheriting the surrounding colour by default                     | IMPLEMENTED                     | Fixed by this revalidation: `tone="inherit"` now resolves to `currentColor`. It previously painted the theme's primary text colour, so composed artwork ignored its context; a browser case pins the icon's computed colour to its container's and to a solid Button's label colour                          |
| 13  | Custom colour outside the scale                                  | IMPLEMENTED                     | The `--csn-icon-color` component token seam, documented with its cascade layer and proven by the browser seam case                                                                                                                                                                                           |
| 14  | Mirroring through an axis                                        | IMPLEMENTED                     | `flip` of `none`, `horizontal`, `vertical`, `both`; unit attribute case, browser computed-transform case for all four values, visual flip panel, docs preview of every value                                                                                                                                 |
| 15  | Automatic mirroring by text direction                            | NOT_APPLICABLE                  | Neither product mirrors artwork automatically, and neither should: most symbols keep their orientation in a right-to-left layout. Direction is inherited from the ambient `dir` and mirroring stays explicit, which the browser RTL case asserts by requiring an untransformed icon inside an RTL container  |
| 16  | Drawing variants (solid, outline, duotone)                       | DEFERRED_TO_DECLARED_DEPENDENCY | Owner: stage `1.03 SVGIcon`. A variant is a property of a definition, and the definition surface is what `1.03` introduces; deciding a variant vocabulary here would fix the shape of a contract that stage owns. `1.03` must revalidate whether the catalog gains variants and, if so, how Icon selects one |
| 17  | Caller-supplied custom SVG definitions                           | DEFERRED_TO_DECLARED_DEPENDENCY | Owner: stage `1.03 SVGIcon`, which introduces the supported direct-definition surface. Icon needs no change to coexist with it, so the obligation on `1.03` is to add the definition API and revalidate the boundary, not to reimplement Icon                                                                |
| 18  | Replacing a built-in glyph inside another component              | DEFERRED_TO_DECLARED_DEPENDENCY | Owner: stage `1.03 SVGIcon` for the definition half. Casauran's composition rules already make artwork a caller-supplied slot rather than an ambient lookup, so no component reads a global icon registry; what `1.03` adds is the ability for the caller to supply a definition it owns                     |
| 19  | Application-level icon provider context                          | INTENTIONALLY_DIVERGED          | ADR-014 makes canonical composition explicit: artwork is passed where it is used. An ambient registry makes a component's rendering depend on invisible state, is a hydration hazard under RSC, and is not needed once every artwork position is a slot. Recorded in advance, in the docs limitations topic  |
| 20  | Large catalog with published churn                               | IMPLEMENTED_DIFFERENTLY         | Casauran ships a small independently drawn catalog that grows with demonstrated need, and `iconNames` is the authoritative list at any version. Copying a 500-icon set would mean reproducing another product's artwork and naming scheme, which the reference policy forbids outright                       |
| 21  | Loading indicator glyph                                          | NOT_APPLICABLE                  | In the reference this is a themed class with its own animation, not Icon behaviour. Busy state belongs to the control that is busy and to the animation foundation (`F0.11`); Icon would only be the artwork inside it, which it already is                                                                  |
| 22  | Glyph without the component (class or Unicode escape)            | NOT_APPLICABLE                  | Both documented paths are font-icon techniques, which follows capability 4. Casauran has no glyph class vocabulary to expose, and inventing one would make internal DOM a compatibility promise, which `API_GOVERNANCE.md` forbids                                                                           |
| 23  | Decorative-by-default accessibility                              | IMPLEMENTED                     | `aria-hidden` root and a permanently hidden, unfocusable nested SVG; unit and browser semantic cases                                                                                                                                                                                                         |
| 24  | Accessible-image mode                                            | IMPLEMENTED_DIFFERENTLY         | The reference documents only the hidden state, leaving a meaningful icon to caller ARIA that would contradict `aria-hidden`. `label` is Casauran's single, typed escape and is the only way to reach `role="img"`; a blank or whitespace-only label keeps the icon decorative instead of naming nothing      |
| 25  | Passthrough of `tabIndex`                                        | INTENTIONALLY_DIVERGED          | Reserved rather than forwarded. A decorative element that is hidden from assistive technology but reachable by keyboard is an accessibility defect, and a labelled image is not an interaction either; an icon that participates in one belongs inside the control that owns it. Rejected by the type        |
| 26  | Passthrough of identifier, class, style and events               | IMPLEMENTED                     | Native `span` attributes, mouse and pointer handlers, `title`, `id`, `style` and `data-*` pass through unchanged; `role`, `aria-hidden`, `aria-label`, `children` and `color` are reserved because they would contradict owned semantics                                                                     |
| 27  | Component ref handle                                             | IMPLEMENTED_DIFFERENTLY         | The forwarded ref is the native `HTMLSpanElement`. A custom handle would add a durable API surface with no capability the element does not already provide; `API_GOVERNANCE.md` restricts refs to durable imperative needs                                                                                   |
| 28  | Class-replacement / unstyled mode                                | IMPLEMENTED_DIFFERENTLY         | Casauran replaces class injection with two governed component tokens, a stable `.csn-icon` root hook, reflected state attributes, and a fixed cascade order, so an application restyles without a provider or a second class vocabulary. ADR-003 forbids the runtime class-structure approach                |
| 29  | Theme, swatch and density presentation                           | IMPLEMENTED                     | Light and dark themes, comfortable and compact densities, and nested theme scopes come from the theme package; visual matrix renders light comfortable, dark compact, inverse surface and RTL panels                                                                                                         |
| 30  | Forced colours                                                   | IMPLEMENTED                     | The glyph paints a system foreground with `forced-color-adjust: auto`; browser case asserts the labelled icon stays exposed and visible under forced-colors emulation, which Chromium alone can emulate                                                                                                      |
| 31  | Right-to-left layout                                             | IMPLEMENTED                     | Direction is inherited, layout uses logical properties, and the visual matrix renders an Arabic label and inline Arabic text; browser case asserts computed direction and absence of automatic mirroring                                                                                                     |
| 32  | Localization and message catalogue                               | IMPLEMENTED                     | Icon owns no message catalogue or formatter, matching the reference posture; a `label` arrives already localized from the caller, and the docs theming topic says so                                                                                                                                         |
| 33  | Adaptive and responsive behaviour                                | NOT_APPLICABLE                  | The reference's adaptive model is a breakpoint contract for controls that become modal on small screens, which a non-interactive glyph never does. Icon's responsive obligation is reflow, covered by a 320 px browser case that requires no horizontal overflow                                             |
| 34  | React Server Component posture                                   | IMPLEMENTED_DIFFERENTLY         | The reference shipped a separate experimental RSC distribution and discontinued it. Casauran treats the App Router as the primary supported host from one package: Icon is server-renderable with no client boundary, no browser global, and no hydration state, verified in four production Next hosts      |
| 35  | Content-security-policy posture                                  | IMPLEMENTED                     | No font file, external resource, request, inline style injection, or dynamic code; the component adds no CSP allowance of its own, which is the end state the reference's own migration was moving toward                                                                                                    |
| 36  | Keyboard model                                                   | NOT_APPLICABLE                  | Neither product gives Icon a key model, and the reference does not list it in the suite compliance table at all. A composed icon inherits the tab stop, focus ring and key handling of the control it sits inside; Icon publishes no keyboard table rather than an empty one                                 |
| 37  | Automated and screen-reader accessibility testing                | IMPLEMENTED_DIFFERENTLY         | Role, hidden state and accessible name are asserted against the real accessibility tree in production browsers, plus a recorded manual review. No third-party screen-reader certification matrix is claimed, because none was executed                                                                       |
| 38  | Agent command registration                                       | NOT_APPLICABLE                  | The reference exposes no icon command surface, and Casauran's `ai` capability is `planned` with no approved contract. A non-interactive glyph has no action for an agent to invoke; adoption would require a capability contract and an ADR, never a unilateral component API                                |

Disposition counts: `IMPLEMENTED` 16, `IMPLEMENTED_DIFFERENTLY` 9,
`DEFERRED_TO_DECLARED_DEPENDENCY` 3, `NOT_APPLICABLE` 7, `INTENTIONALLY_DIVERGED` 3, `BLOCKED` 0.

## Enterprise dimension audit

| Dimension              | Result         | Evidence and applicability                                                                                                                                  |
| ---------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functionality          | pass           | Spec, public implementation, unit and browser cases, ten documentation topics, playground, and visual fixture agree                                         |
| Typing/API consistency | pass           | `name` is the catalog union; reserved props are rejected by the type; nine `@ts-expect-error` cases lock the rejections                                     |
| Accessibility          | pass           | Decorative default, single labelling escape, blank-label guard, hidden unfocusable SVG, no tab stop, forced colours, reflow, manual review                  |
| Interaction            | not-applicable | Icon owns no pointer, activation, selection, drag, or scroll behaviour; native handlers pass through for caller-owned integration and it never handles one  |
| Keyboard/touch/IME     | not-applicable | No focus, no tab stop, no key handler, and no text entry, so there is no key model and no composition surface; `tabIndex` is rejected by the type           |
| Security               | pass           | Closed catalog, no raw SVG/HTML/URL/parser/network/storage/dynamic-code sink, React-escaped name, unknown names fail closed                                 |
| Performance            | pass           | 1,000 named server renders against a 500 ms ceiling; the benchmark now reports its own runtime, platform and architecture                                   |
| Theming/density        | pass           | Two governed component tokens, uniform seam behaviour across defaults and explicit values, light/dark, nested density, visual snapshot                      |
| RTL/i18n               | pass           | Inherited direction, Arabic content, explicit-only mirroring, no component-owned messages or formats                                                        |
| SSR/hydration/RSC      | pass           | Server-renderable root export, no client boundary, no module-evaluation browser access, four production Next builds                                         |
| Responsive/adaptive    | pass           | 320 px reflow case with no horizontal overflow; no adaptive modal behaviour exists to implement                                                             |
| Integration            | pass           | Public root and CSS exports, `@casauran/icons` data surface, Button composition evidence from both sides                                                    |
| Documentation          | pass           | Ten-topic canonical route with a preview per enumerated value, corrected API and styling-hook tables, playground, package README, executable visual fixture |

`interaction` and `keyboard` are the two registry dimensions recorded as `not-applicable`; the rows
above state why, and capabilities 25 and 36 record the same conclusion against the reference.

## Manual accessibility and visual review

Both passes inspected the rendered semantics and the Chromium visual baseline by hand. The
2026-08-14 pass confirmed the decorative and labelled exposure and the forced-colours foreground.
The 2026-08-16 pass found three defects that automation had not been asked about: a whitespace-only
`label` published an image with an empty accessible name; the default tone painted the theme's
primary text colour rather than its context, so an icon composed into a solid Button rendered dark
artwork on a saturated fill; and the component accepted `tabIndex`, allowing an `aria-hidden`
element to take a tab stop. Each is now fixed and each has a browser or type-level guard. The review
makes no claim of an external screen-reader certification matrix that was not executed.

## Deliberate independent improvements

- The catalog is the type: an unknown glyph is a compile error, and `isIconName` is the supported
  way to narrow a name that arrived from data.
- Decorative is the default and labelling is a single typed escape, so an icon cannot end up with
  two competing accessible names or an empty one.
- The component refuses the props that would contradict its own semantics instead of silently
  discarding them.
- Every enumerated size and tone assigns its component token at the same specificity, so a consumer
  override behaves identically for a default and for an explicit value.
- The performance benchmark reports the runtime it actually ran on, so no recorded figure can claim
  an environment it did not measure.

## Validation evidence

The 2026-08-14 closure evidence stands in `.agent/stages/1.02-icon.md`. The revalidation was
validated as recorded in that ledger's revalidation section and in
`.agent/reviews/2026-08-16-icon-revalidation.md`, including an explicit statement of which browser
engines were and were not executed in the revalidation environment.

## Gaps, debt, and boundary

No in-scope parity gap, architecture debt, dependency debt, security exception, or unexplained
capability remains: every row above carries a disposition, all three deferrals name stage `1.03`,
and every `NOT_APPLICABLE` row names the owning subsystem and why Icon is not that owner. Direct SVG
definitions, drawing variants, built-in glyph replacement, icon fonts, a glyph class vocabulary, an
ambient icon provider, loading orchestration, and agent command surfaces remain outside this
component.

## Integration revalidation — stage `1.03 SVGIcon`, 2026-08-16

The three obligations this audit deferred to `1.03` are resolved there. Nothing above is rewritten;
this note records the outcome and where its evidence lives.

- **Capability 16, drawing variants.** Resolved without an Icon change. Variants are a property of a
  definition, and `1.03` introduced the definition surface, so `variants` lives on
  `SVGIconDefinition` and `variant` on `SVGIcon`. The Casauran catalog deliberately does not gain
  variants — every catalog glyph ships one drawing — so Icon needs no variant selection and keeps
  its current API.
- **Capability 17, caller-supplied custom SVG definitions.** Resolved by `SVGIcon`. The boundary was
  revalidated in both directions: Icon still accepts only a catalog `IconName` and still refuses
  caller artwork, and a catalog definition now renders unchanged through `SVGIcon` at the same
  stroke weight Icon paints it, asserted by unit and browser cases.
- **Capability 18, replacing a built-in glyph inside another component.** Resolved by the same
  surface. Artwork remains a caller-supplied slot rather than an ambient registry read; what `1.03`
  adds is the ability for the caller to supply a definition it owns to that slot.

Evidence: `specs/components/svg-icon.parity.md`, `tests/unit/svg-icon.test.tsx`,
`tests/browser/svg-icon.spec.ts`, and `.agent/stages/1.03-svg-icon.md`.
