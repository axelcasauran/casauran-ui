# Typography reference analysis

## Provenance

The required local-only preflight passed on 2026-08-18 against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`, resolved through
`CASAURAN_KENDO_DOCS_PATH`. No online repository, live documentation site, search engine,
third-party tutorial, or model memory was used, and no fallback exists.

The stage ledger records the reference path as `docs/content/typography`, which does not exist in
the pinned corpus. The higher-authority registry entry records `docs/content/common/typography`,
which does; the ledger path is superseded exactly as it was for `1.02 Icon` and `1.03 SVGIcon`.

## Examined paths

Paths are relative to `docs/content`. Every path below was opened and read in this stage.

### Component pages

- `common/typography/index.md`
- `common/typography/appearance.md`

### API pages

- `common/api/Typography.md`
- `common/api/TypographyProps.md`
- `common/api/MarginEnum.md`
- `common/api/index.md`

### Package, styling and cross-cutting pages

- `common/index.md`
- `common/get-started.md`
- `styling/custom-css-styles.md`
- `styling/customizing.md`
- `styling/figma-ui-kits.md`
- `styling/tailwind-integration/getting-started.md`
- `styling/unstyled.md`

### Positioning, packaging and adjacent pages

- `getting-started-articles/free-vs-premium.md`
- `getting-started-articles/key-features.md`
- `index/index.md`
- `ai-tools/agentic-ui-generator/prompt-library.md`

### Searched and found to carry no Typography requirement

A corpus-wide case-insensitive search for the component name returned 23 files: 15 prose or API
pages, every one of which is listed above, and 8 runnable example modules — the seven Typography
example directories plus one unrelated drag-and-drop example that mentions the word in passing.
`common/api/MarginEnum.md` and `styling/unstyled.md` do not contain the word and were read anyway,
the first because the margin property's type resolves to it and the second because the icon
families publish a class-replacement contract there and this component might have too.

Five cross-cutting families were then searched by keyword and returned nothing that constrains this
component:

- `common-features/accessibility/accessibility-compliance.md` — the suite compliance table does not
  list Typography at all, and names no role, keyboard, or announcement obligation for it.
- `intl/l10n/rtl_support.md` — direction is enabled through the ambient `dir`; no text component is
  given direction-specific behaviour, and no automatic alignment mirroring is documented.
- `server-components/index.md` — the separate experimental server-component distribution is
  documented as discontinued and does not mention Typography.
- `common/adaptive-mode/index.md` — the adaptive contract is a breakpoint model for controls that
  become modal on small screens; a text element never does.
- `troubleshooting/csp.md` — the content-security-policy guidance concerns font files and inline
  styles injected by other families, not text rendering.

`styling/unstyled.md` was read in full and publishes no class structure, class-replacement contract,
or unstyled mode for this component, unlike the icon families.

### Deliberately not opened as implementation input

`common/examples/typography/**`. The seven runnable example directories were opened only far enough
to enumerate which public API surfaces they exercise — the element namespace and the six appearance
properties — because that enumeration is a public API concept and is stated in the prose pages as
well. No example file was used as implementation input, no wording or markup was carried across,
and §6 of the component-stage prompt forbids implementing from them.

## Extracted behavioral requirements

Observed facts, expressed as capability families rather than API shapes.

- **A design-system text primitive.** The stated purpose is to stop applications from re-deriving
  sizes and styles per view: one reusable component carries the type scale so a change lands in one
  place. The benefits recorded are efficiency, consistency, maintainability, and avoided duplication.
  Nothing in the family is interactive.
- **A namespace of document elements.** The component is consumed as a dotted namespace rather than
  as one component with an element property. The documented members are the six heading levels, the
  paragraph, the inline code element, and the preformatted block. The rendered element and the
  visual style are the same choice: selecting a heading level also selects its size and weight.
- **Theme-owned default styling.** Each member's default appearance comes from the theme's
  typography styles. The appearance properties are described as _overriding_ those theme styles
  rather than as the only source of type.
- **Font size override.** A five-step named scale — extra small through extra large — applied
  independently of the element.
- **Font weight override.** Three named steps: a light step at 300, a normal step at 400, and a
  bold step whose numeric value differs per theme (700 in two themes, 500 in a third).
- **Text alignment.** Four physical values — left, right, centre, justify — mapping directly onto
  the CSS physical keywords.
- **Text transformation.** Three values — lowercase, uppercase, capitalize — mapping directly onto
  the CSS keywords.
- **Theme colour.** Nine values: an inherit value that takes the current colour, five brand and
  neutral ramps (primary, secondary, tertiary, info, inverse), and three status ramps (success,
  warning, error). The documentation explicitly directs callers to the inline style property for
  any colour outside the scale.
- **Margin.** A named seven-step scale (extra small, small, medium, large, extra large, thin, hair)
  plus an unbounded numeric step from 0 to 24 whose physical meaning is theme-dependent — a
  multiplier of four pixels in two themes, a division by four into rem units in a third. The value
  may also be an object setting each of the four physical sides independently. The margin applies to
  all four sides.
- **Passthrough surface.** Children, class name, identifier, and an inline style object. The style
  property is named twice as the documented escape hatch, for colour and for anything else the
  named scales do not cover.
- **Raw markup as a content carrier.** The overview example fills the preformatted block by handing
  a code string to React's raw-markup escape hatch rather than by passing children, so a code block
  containing newlines is rendered by injecting markup.
- **Packaging and positioning.** The component ships in the same shared utilities package as the two
  icon components and the keyboard-navigation helpers, is free rather than premium, and is
  positioned as a utility rather than as a control.
- **No interaction, keyboard, accessibility, globalization, adaptive, forms, data, or performance
  documentation exists for this component.** Those families are absent from the corpus for
  Typography, not merely thin: the accessibility compliance table omits it, and there is no
  keyboard, event, forms, data-binding, virtualization, or edge-case page.

## Casauran decisions

Design decisions taken in response to the observed facts, recorded here in advance of the
specification so that a later divergence cannot be presented as an after-the-fact excuse.

1. **Separate document structure from visual style.** Fusing the element and the type step is the
   single largest defect in the observed model: an author who wants smaller text reaches for a
   deeper heading member and silently corrupts the document outline, and an author who needs an
   `h2` for the outline is forced to accept its size. Casauran splits them into `as` (the rendered
   element, the document-structure decision) and `variant` (the typographic role, the visual
   decision), each independently defaulting from the other so the common case stays one prop.
2. **A closed, non-interactive element vocabulary.** `as` accepts only text-bearing, non-interactive
   elements. Anchors, buttons, and form controls are excluded because `COMPONENT_COMPOSITION_RULES`
   assigns each native interactive primitive to the component that owns it; a text component that
   could render a `<button>` would be a second, unowned action surface.
3. **No dotted element namespace.** A namespace of eleven bound components publishes eleven public
   entry points that cannot be narrowed, typed, or extended together, and it is the mechanism that
   fuses structure with style. One component with a closed `as` union expresses the same set.
4. **Logical alignment.** `align` is `start`/`end`/`center`/`justify`, not `left`/`right`. Physical
   alignment keywords are a right-to-left defect: text aligned `left` in an Arabic layout is
   misaligned, and every Casauran stylesheet is already required to use logical properties.
5. **No light weight step.** The governed weight scale starts at regular (400); there is no 300
   token, and a 300 step in a system font stack is thin enough to fail legibility at body and
   caption sizes. De-emphasis is expressed with `tone="muted"` or a smaller variant.
6. **Block-oriented, scale-bound spacing.** The margin capability ships as `spacing`, bound to the
   governed space scale, expressed with logical sides. The shorthand sets the two block sides,
   because vertical rhythm is what margin on a text block is for; the object form reaches all four
   logical sides. The unbounded 0–24 numeric step is not adopted: it bypasses the spacing scale,
   means a different physical size per theme, and cannot be validated.
7. **No raw-markup content path.** `dangerouslySetInnerHTML` is rejected by the type. A code block
   is `variant="code-block"` with children and preserved whitespace, so multi-line code needs no
   markup injection. This is the same reasoning that made `SVGIcon` take structured geometry.
8. **The platform tone vocabulary, not a parallel one.** Colour intent reuses the vocabulary Button,
   Icon and SVGIcon already publish, extended with the `default` value a text component needs.
   Two public names that resolve to one colour — the defect the Icon revalidation removed — are not
   reintroduced.
9. **Uppercase is a caller decision, never a variant default.** The `overline` role sets tracking and
   weight but does not force `text-transform`, because casing rules are locale-specific and
   `capitalize` is wrong in many languages.
