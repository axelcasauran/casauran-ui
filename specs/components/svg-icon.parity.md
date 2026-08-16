# SVGIcon Parity Audit

Outcome: **PASS**  
Stage: `1.03`  
Audit: 2026-08-16

## Provenance and clean-room review

The mandatory local-only preflight passed against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`. Every examined path — four
component pages, eight API pages, six package and styling pages, and six consumption, migration and
edge-case pages — is recorded in `svg-icon.reference-analysis.md`, together with the example
directories deliberately left unopened and the cross-cutting families searched and found to carry no
requirement. The implementation was produced from `svg-icon.spec.md`; no source, CSS, asset, path
data, bundle, private architecture, undocumented DOM, online fallback, competitor API, or runnable
example file was used as implementation input.

## Disposition vocabulary

Every materially relevant capability carries exactly one disposition: `IMPLEMENTED`,
`IMPLEMENTED_DIFFERENTLY`, `NOT_APPLICABLE`, `INTENTIONALLY_DIVERGED`,
`DEFERRED_TO_DECLARED_DEPENDENCY`, or `BLOCKED`. A silent omission and an unowned deferral are not
acceptable final states. Deferral names the owning stage.

## Observable capability audit

| #   | Capability                                                       | Disposition             | Casauran evidence and rationale                                                                                                                                                                                                                                                                                              |
| --- | ---------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Caller-owned definition rendering                                | IMPLEMENTED             | `icon` takes an `SVGIconDefinition` the caller owns; one `<span>` wraps one `<svg>` with one `<path>` per declared layer. Unit render cases, browser SSR case proving the artwork is in the server response, visual fixture, and the documentation overview topic                                                            |
| 2   | Drawing supplied as a raw SVG markup string                      | INTENTIONALLY_DIVERGED  | Rendering a markup string requires an `innerHTML`-class sink on a value the reference itself recommends loading from an arbitrary `.svg` file, and `SECURITY_ARCHITECTURE.md` classes SVG as untrusted. The Casauran definition carries geometry plus a closed paint vocabulary, so the same capability ships without a sink |
| 3   | Arbitrary inner SVG elements as children                         | INTENTIONALLY_DIVERGED  | This is the same escape hatch by a second route: any element, including `script`, `use`, `image` and `foreignObject`, would become renderable. `children` is rejected by the type, and per-layer paint plus multi-layer drawings cover the artwork this capability existed to express                                        |
| 4   | View box override                                                | IMPLEMENTED_DIFFERENTLY | The box describes the drawing, not the site that renders it, so it lives on the definition only. The reference exposes it in two places that can disagree; collapsing them removes a class of bug in which a shared definition renders correctly in one position and clipped in another                                      |
| 5   | Default 24×24 view box                                           | IMPLEMENTED             | `SVG_ICON_DEFAULT_VIEW_BOX` is applied when a definition omits one, matching the box the Casauran catalog is drawn on; unit case asserts the default and an explicit override                                                                                                                                                |
| 6   | Malformed or unusable definition behaviour                       | IMPLEMENTED             | Fails closed: `isSVGIconDefinition` rejects it, the element keeps its decorative semantics, and it renders no `<svg>` and no `data-icon-name`. Unit cases cover a null value, an empty drawing, a bad view box, an out-of-range opacity and an ungoverned variant key; a browser case proves it in production                |
| 7   | Size scale                                                       | IMPLEMENTED             | Seven steps, `xs` through `3xl`, each assigning `--csn-svg-icon-size` at the same specificity including the `md` default; unit attribute case, browser monotonic-and-square case, visual size panel, docs preview of every value                                                                                             |
| 8   | Custom size outside the scale                                    | IMPLEMENTED             | The `--csn-svg-icon-size` component token is the documented seam, overridden in the `overrides` cascade layer; the browser seam case proves the override beats an explicit size and tone alike                                                                                                                               |
| 9   | Semantic colour scale: inherit, success, warning, error, inverse | IMPLEMENTED             | `inherit`, `positive`, `caution`, `critical`, `inverse`, each bound to a semantic token with dark-theme values; the browser case asserts every tone resolves to a distinct colour                                                                                                                                            |
| 10  | Semantic colour `primary`                                        | IMPLEMENTED             | `tone="accent"`, the single brand ramp ADR-006 defines, matching Button's and Icon's vocabulary                                                                                                                                                                                                                              |
| 11  | Semantic colour `info`                                           | IMPLEMENTED_DIFFERENTLY | Informational artwork resolves to `tone="accent"`. Icon's revalidation removed a separate `info` value that resolved to the same custom property, because two public names for one colour cannot be told apart by a caller; SVGIcon adopts the corrected vocabulary rather than reintroducing the defect                     |
| 12  | Semantic colours `secondary` and `tertiary`                      | IMPLEMENTED_DIFFERENTLY | De-emphasis is `tone="muted"`, bound to the muted text token, rather than additional brand ramps. ADR-006 defines one brand ramp, and Button expresses the same idea through neutral tone plus appearance                                                                                                                    |
| 13  | Inheriting the surrounding colour by default                     | IMPLEMENTED             | `tone="inherit"` is the default and resolves to `currentColor`; a browser case pins the icon's computed colour to its container's and to a solid Button's label colour, so composed artwork cannot repeat the defect Icon's revalidation fixed                                                                               |
| 14  | Custom colour outside the scale                                  | IMPLEMENTED             | The `--csn-svg-icon-color` component token seam, documented with its cascade layer and proven by the browser seam case                                                                                                                                                                                                       |
| 15  | Mirroring through an axis                                        | IMPLEMENTED             | `flip` of `none`, `horizontal`, `vertical`, `both`; unit attribute case, browser computed-transform case for all four values, visual flip panel, docs preview of every value                                                                                                                                                 |
| 16  | Automatic mirroring by text direction                            | NOT_APPLICABLE          | Neither product mirrors artwork automatically, and neither should: most symbols keep their orientation in a right-to-left layout. Direction is inherited from the ambient `dir` and mirroring stays explicit, which the browser RTL case asserts by requiring an untransformed icon inside an RTL container                  |
| 17  | Drawing variants (solid, outline, duotone)                       | IMPLEMENTED             | `variants` on the definition and `variant` on the component; unit cases select each of the three, the browser case asserts a distinct rendered layer count per variant, and the docs appearance topic previews every value. This resolves the obligation Icon's audit deferred to this stage                                 |
| 18  | Variant fallback to the default drawing                          | IMPLEMENTED             | A variant the definition does not ship falls back to `paths`, and `data-variant` reports `default` so the fallback is observable rather than silent; unit and browser cases assert both the artwork and the reflected value                                                                                                  |
| 19  | Open keyspace of custom variant names                            | INTENTIONALLY_DIVERGED  | `SVGIconVariant` is a closed union, so a misspelled variant is a compile error instead of artwork that silently falls back to a different drawing. This is the same reasoning that made `IconName`, `tone` and `size` closed, and a caller needing a genuinely different symbol declares a second definition                 |
| 20  | Per-layer paint, weight and opacity                              | IMPLEMENTED             | `paint`, `strokeWidth`, `fillRule` and `opacity` are declared per layer, which is how filled, mixed-weight and duotone artwork is expressed without markup; unit cases assert each attribute reaches the rendered path and the browser case asserts a duotone layer renders at reduced opacity                               |
| 21  | Large bundled catalog with published churn                       | IMPLEMENTED_DIFFERENTLY | Casauran ships a small independently drawn catalog and makes caller-owned artwork a first-class supported surface, so an application is never blocked on the catalog growing. Copying a 500-icon set would mean reproducing another product's artwork and naming scheme, which the reference policy forbids outright         |
| 22  | Migration codemod for renamed icons                              | NOT_APPLICABLE          | The codemod exists to repair breakage caused by that catalog's own renames and removals. Casauran has published no icon API to break, and a caller-owned definition cannot be renamed out from under its owner, so there is nothing for a migration tool to rewrite                                                          |
| 23  | Decorative-by-default accessibility                              | IMPLEMENTED             | `aria-hidden` root and a permanently hidden, unfocusable nested SVG; unit and browser semantic cases assert both modes                                                                                                                                                                                                       |
| 24  | Accessible-image mode                                            | IMPLEMENTED_DIFFERENTLY | The reference documents only the hidden state, leaving a meaningful icon to caller ARIA that would contradict `aria-hidden`. `label` is Casauran's single typed escape and the only way to reach `role="img"`; a blank or whitespace-only label keeps the icon decorative instead of publishing an unnamed image             |
| 25  | Passthrough of `tabIndex`                                        | INTENTIONALLY_DIVERGED  | Reserved rather than forwarded. An element hidden from assistive technology but reachable by keyboard is an accessibility defect, and a labelled image is not an interaction either; artwork that participates in one belongs inside the control that owns it. Rejected by the type, with a compile-level guard              |
| 26  | Passthrough of identifier, class, style and events               | IMPLEMENTED             | Native `span` attributes, mouse and pointer handlers, `title`, `id`, `style` and `data-*` pass through unchanged; `role`, `aria-hidden`, `aria-label`, `children` and `color` are reserved because they would contradict owned semantics                                                                                     |
| 27  | Separate class and inline style for the inner element            | INTENTIONALLY_DIVERGED  | Publishing a styling target for the nested `<svg>` makes internal DOM a stable consumer contract, which `API_GOVERNANCE.md` and `CSS_ARCHITECTURE.md` both refuse. The governed seam is the root hook plus two component tokens, and everything a caller would style per drawing is already in the definition                |
| 28  | Component ref handle                                             | IMPLEMENTED_DIFFERENTLY | The forwarded ref is the native `HTMLSpanElement`. A custom handle would add a durable API surface with no capability the element does not already provide; `API_GOVERNANCE.md` restricts refs to durable imperative needs                                                                                                   |
| 29  | Class-replacement / unstyled mode                                | IMPLEMENTED_DIFFERENTLY | Casauran replaces class injection with two governed component tokens, a stable `.csn-svg-icon` root hook, reflected state attributes, and a fixed cascade order, so an application restyles without a provider or a second class vocabulary. ADR-003 forbids the runtime class-structure approach                            |
| 30  | Application-level icon provider context                          | INTENTIONALLY_DIVERGED  | ADR-014 makes canonical composition explicit: artwork is passed where it is used. An ambient registry makes rendering depend on invisible state and is a hydration hazard under RSC. With a supported definition surface, replacing a component's artwork is a slot the component exposes, not a global lookup               |
| 31  | Font-icon consumption mode and migration path                    | NOT_APPLICABLE          | ADR-003 rules out icon fonts, so Casauran has one consumption mode. There is nothing to switch between, nothing to migrate from, and no `font-src` allowance to remove — this component is the end state that migration was moving toward, not a step along it                                                               |
| 32  | Theme, swatch and density presentation                           | IMPLEMENTED             | Light and dark themes, comfortable and compact densities, and nested theme scopes come from the theme package; the visual matrix renders light comfortable, dark compact, inverse surface and RTL panels                                                                                                                     |
| 33  | Forced colours                                                   | IMPLEMENTED             | The artwork paints a system foreground with `forced-color-adjust: auto`, and layer opacity is flattened so a receded duotone layer cannot vanish against a two-colour palette; browser case under forced-colors emulation, which Chromium alone can emulate                                                                  |
| 34  | Right-to-left layout                                             | IMPLEMENTED             | Direction is inherited, layout uses logical properties, and the visual matrix renders an Arabic label and inline Arabic text; the browser case asserts computed direction and the absence of automatic mirroring                                                                                                             |
| 35  | Localization and message catalogue                               | IMPLEMENTED             | SVGIcon owns no message catalogue or formatter, matching the reference posture; a `label` arrives already localized from the caller, and the docs theming topic says so                                                                                                                                                      |
| 36  | Adaptive and responsive behaviour                                | NOT_APPLICABLE          | The reference's adaptive model is a breakpoint contract for controls that become modal on small screens, which a non-interactive drawing never does. The responsive obligation here is reflow, covered by a 320 px browser case that requires no horizontal overflow                                                         |
| 37  | React Server Component posture                                   | IMPLEMENTED_DIFFERENTLY | The reference shipped a separate experimental RSC distribution and discontinued it. Casauran treats the App Router as the primary supported host from one package: SVGIcon is server-renderable with no client boundary, no browser global, and no hydration state, verified in production Next hosts                        |
| 38  | Content-security-policy posture                                  | IMPLEMENTED             | No font file, external resource, request, markup parse, inline style injection, or dynamic code; the component adds no CSP allowance of its own, and unlike a markup-string drawing it needs no `unsafe-inline` relaxation to render caller artwork                                                                          |
| 39  | Keyboard model                                                   | NOT_APPLICABLE          | Neither product gives this component a key model, and the reference does not list it in the suite compliance table at all. A composed icon inherits the tab stop, focus ring and key handling of the control it sits inside; SVGIcon publishes no keyboard table rather than an empty one                                    |
| 40  | Automated and screen-reader accessibility testing                | IMPLEMENTED_DIFFERENTLY | Role, hidden state and accessible name are asserted against the real accessibility tree in a production browser, plus a recorded manual review. No third-party screen-reader certification matrix is claimed, because none was executed                                                                                      |
| 41  | Consumption by other components                                  | IMPLEMENTED_DIFFERENTLY | The reference gives each component its own definition-shaped property. Casauran composes an element into a slot instead, so one artwork contract serves every position; Button's `startContent`, `endContent` and icon-only geometry accept an `SVGIcon` element with no Button change, evidenced from both sides            |
| 42  | Catalog and caller-owned artwork interoperability                | IMPLEMENTED             | A catalog `IconDefinition` is structurally an `SVGIconDefinition`, so `getIconDefinition` output renders through SVGIcon unchanged and at the same stroke weight Icon paints it. Unit and browser cases assert the two components produce the same geometry for one definition                                               |
| 43  | Agent command registration                                       | NOT_APPLICABLE          | The reference exposes no icon command surface, and Casauran's `ai` capability is `planned` with no approved contract. A non-interactive drawing has no action for an agent to invoke; adoption would require a capability contract and an ADR, never a unilateral component API                                              |

Disposition counts: `IMPLEMENTED` 21, `IMPLEMENTED_DIFFERENTLY` 10,
`DEFERRED_TO_DECLARED_DEPENDENCY` 0, `NOT_APPLICABLE` 6, `INTENTIONALLY_DIVERGED` 6, `BLOCKED` 0.

## Enterprise dimension audit

| Dimension              | Result         | Evidence and applicability                                                                                                                                         |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Functionality          | pass           | Spec, public implementation, unit and browser cases, eleven documentation topics, playground, and visual fixture agree                                             |
| States                 | pass           | Default drawing, each variant, variant fallback, decorative, labelled, blank-label, and unusable-definition states are each rendered and asserted                  |
| Typing/API consistency | pass           | Closed variant, size, tone and flip unions; reserved props rejected by the type; `@ts-expect-error` cases lock every rejection                                     |
| Accessibility          | pass           | Decorative default, single labelling escape, blank-label guard, hidden unfocusable SVG, no tab stop, forced colours with opacity flattening, reflow, manual review |
| Interaction            | not-applicable | SVGIcon owns no pointer, activation, selection, drag, or scroll behaviour; native handlers pass through for caller-owned integration and it never handles one      |
| Keyboard/touch/IME     | not-applicable | No focus, no tab stop, no key handler, and no text entry, so there is no key model and no composition surface; `tabIndex` is rejected by the type                  |
| Security               | pass           | Structured geometry only, no markup parse or injection sink, no URL/network/storage/dynamic-code surface, validated definitions fail closed, negative tests        |
| Performance            | pass           | 1,000 caller-owned multi-layer server renders against a 500 ms ceiling, with the runtime, platform and architecture reported by the benchmark                      |
| Theming/density        | pass           | Two governed component tokens, uniform seam behaviour across defaults and explicit values, light/dark, nested density, visual snapshot                             |
| RTL/i18n               | pass           | Inherited direction, Arabic content, explicit-only mirroring, no component-owned messages or formats                                                               |
| SSR/hydration/RSC      | pass           | Server-renderable root export, no client boundary, no module-evaluation browser access, production Next builds                                                     |
| Responsive/adaptive    | pass           | 320 px reflow case with no horizontal overflow; no adaptive modal behaviour exists to implement                                                                    |
| Integration            | pass           | Public root and CSS exports, the `@casauran/icons` definition surface, Button composition evidence from both sides, Icon interoperability                          |
| Documentation          | pass           | Eleven-topic canonical route with a preview per enumerated value, API and styling-hook tables, playground, executable visual fixture                               |

`interaction` and `keyboard` are the two registry dimensions recorded as `not-applicable`; the rows
above state why, and capabilities 25 and 39 record the same conclusion against the reference.

## Deferrals owed to this stage by earlier stages

All three obligations recorded against `1.03` by earlier audits are resolved here, with the earlier
components unchanged.

- **`1.02 Icon`, capability 16 — drawing variants.** Resolved. Variants are a property of a
  definition, and the definition surface is what this stage introduces, so `variants` lives on
  `SVGIconDefinition` and `variant` on `SVGIcon`. The Casauran catalog deliberately does **not**
  gain variants: every catalog glyph ships one drawing, so `Icon` needs no variant selection and
  is unchanged. A caller who needs a second drawing of a symbol declares a definition and renders
  it through `SVGIcon`.
- **`1.02 Icon`, capability 17 — caller-supplied custom SVG definitions.** Resolved. This is the
  component. The boundary is revalidated in both directions: `Icon` still refuses caller artwork and
  still takes only a catalog name, and a catalog definition renders unchanged through `SVGIcon`.
- **`1.01 Button`, capability 19 — direct SVG icon definition.** Resolved without a Button change.
  An `SVGIcon` element composes into `startContent`, `endContent` and the icon-only geometry exactly
  as an `Icon` element does; browser and visual evidence covers a labelled icon-only Button, a
  leading-artwork Button, and colour inheritance from a solid Button's foreground.

## Manual accessibility and visual review

The rendered semantics and the Chromium visual baseline were inspected by hand. The review confirmed
that a decorative drawing is hidden and a labelled one is exposed as an image with its trimmed name;
that the nested SVG is hidden and unfocusable in both modes; that no drawing takes a tab stop; that a
duotone drawing keeps both layers legible under forced colours once opacity is flattened, which is
the defect the flattening rule exists to prevent; that a caller-owned drawing at the smallest step
stays legible; and that an unusable definition renders an empty decorative element rather than
broken markup. The review makes no claim of an external screen-reader certification matrix that was
not executed.

## Deliberate independent improvements

- The drawing is data, not markup, so the component has no injection sink to review, no
  content-security-policy relaxation to request, and no sanitizer to keep correct.
- Paint, weight, fill rule and opacity are per layer, so filled, mixed-weight and duotone artwork is
  expressible without reopening the markup surface.
- The variant vocabulary is closed, so a misspelled variant fails at compile time; when a fallback
  does occur, the drawing that rendered is reflected instead of being invisible.
- A definition that crossed a runtime boundary is validated rather than trusted, and an unusable one
  fails closed with the same shape Icon gives an unknown catalog name.
- Layer opacity is flattened under forced colours, so duotone artwork cannot lose half its shape
  against a collapsed palette.
- A catalog definition and a caller-owned definition are one contract, so the two icon components
  interoperate instead of forming two parallel worlds.

## Validation evidence

Recorded in `.agent/stages/1.03-svg-icon.md`, including an explicit statement of which browser
engines were and were not executed in the stage environment.

## Gaps, debt, and boundary

No in-scope parity gap, architecture debt, dependency debt, security exception, or unexplained
capability remains: every row above carries a disposition, no row defers, and every
`NOT_APPLICABLE` row names the owning subsystem and why SVGIcon is not that owner. Icon fonts, a
glyph class vocabulary, an ambient icon provider, a runtime class-replacement provider, a bundled
five-hundred-glyph catalog, migration codemods, loading orchestration, and agent command surfaces
remain outside this component.
