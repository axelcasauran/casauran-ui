# SVGIcon reference analysis

## Provenance

The required local-only preflight passed on 2026-08-16 against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`, resolved through
`CASAURAN_KENDO_DOCS_PATH`. No online repository, live documentation site, search engine,
third-party tutorial, or model memory was used, and no fallback exists.

The stage ledger records the reference path as `docs/content/icons`, which does not exist in the
pinned corpus. The higher-authority registry entry records `docs/content/common/svgicon`, which
does; the ledger path is superseded exactly as it was for `1.02 Icon`.

## Examined paths

Paths are relative to `docs/content`. Every path below was opened and read in this stage.

### Component pages

- `common/svgicon/index.md`
- `common/svgicon/appearance.md`
- `common/svgicon/customization.md`
- `common/svgicon/accessibility/wai-aria-support.md`

### API pages

- `common/api/SvgIcon.md`
- `common/api/SvgIconProps.md`
- `common/api/IconVariant.md`
- `common/api/SVGIconClasses.md`
- `common/api/SvgClasses.md`
- `common/api/WrapperClasses.md`
- `common/api/IconsClassStructure.md`
- `common/api/IconsContextType.md`

### Package, styling and cross-cutting pages

- `common/index.md`
- `common/get-started.md`
- `styling/icons.md`
- `styling/unstyled.md`
- `styling/migrating-font-svg.md`
- `troubleshooting/csp.md`

### Consumption, migration and edge-case pages

- `buttons/button/icons.md`
- `inputs/rating/icon.md`
- `knowledge-base/custom-svg-from-file.md`
- `migration/available-codemods.md`
- `updates/breaking-changes/15-0-0.md`
- `updates/rendering-changes/8-0-0.md`

### Searched and found to carry no SVG-icon requirement

A corpus-wide search for the component name returned 129 files. Everything not listed above
mentions it only as a prop type on another component's API table — `startIcon`, `svgIcon`,
`endIcon` and similar — which is consumption, not a capability of this component. Four
cross-cutting families were searched by keyword and returned nothing that constrains an icon:
`intl/l10n/rtl_support.md` documents no automatic artwork mirroring, `server-components/index.md`
does not mention icons, `common/adaptive-mode/index.md` is a breakpoint model for components that
become modal, and `common-features/accessibility/*` does not list the component in its compliance
table.

### Deliberately not opened

`common/examples/svg-icon/**` and the other runnable example directories. They are competitor
implementation material rather than behavioral documentation, and §6 of the component-stage prompt
forbids implementing from them. Every behaviour recorded below comes from the prose and API pages
listed above.

## Extracted behavioral requirements

Observed facts, expressed as capability families rather than API shapes.

- **Caller-owned drawing.** The component's distinguishing capability is that the artwork is
  supplied rather than named: an object carrying a name, a drawing, and a view box. This is what
  separates it from the named-catalog icon component.
- **Raw markup as the drawing carrier.** The supplied object's drawing field is documented as "the
  entire SVG content of the icon" — a markup string. A knowledge-base article recommends importing
  `.svg` files as raw strings through a bundler loader and assigning them to that field.
- **Arbitrary inner elements.** Custom artwork may alternatively be supplied as children, described
  as "the inner SVG elements", with no documented restriction on which elements.
- **View box.** Defaults to a 24×24 box and is overridable, documented both on the definition
  object and as a separate component property.
- **Size scale.** Eight documented steps — a default plus xsmall through xxxlarge — described by
  explicit pixel box sizes from 12 to 48. Custom sizes go through inline style.
- **Theme colour scale.** Nine documented values: an inheriting default plus primary, secondary,
  tertiary, info, success, warning, error and inverse. Unset inherits the parent colour. `dark` and
  `light` were removed in v15. Custom colours go through inline style.
- **Mirroring.** Four documented values — a non-flipping default plus horizontal, vertical and
  both. Always explicit; nothing describes automatic mirroring by direction.
- **Drawing variants.** Solid, outline and duotone drawings of one symbol, selected by name, with a
  documented fallback to the default drawing when the requested variant is absent. Custom variant
  names are documented as supported when the definition declares them. Available only from icon
  package v5, where the default variant also changed to outline.
- **Catalog scale and churn.** The bundled set is documented as more than 500 icons, with a public
  changelog covering renames, consolidations, removals without replacement, removed aliases, and a
  changed default variant, plus a codemod that rewrites 167 renamed imports.
- **Passthrough surface.** Identifier, root class, root inline style, a separate class and inline
  style for the inner SVG element, and tab index. A ref resolves to a component handle type.
- **Accessibility posture.** One documented rule: the icon element and all its children are hidden
  from assistive technology. The component publishes no keyboard model. The accessibility page
  claims WCAG 2.2 AA, Section 508, axe automation, and a three-combination screen-reader matrix.
- **Application-level icon configuration.** A React context sets whether the suite renders font or
  SVG icons and can replace the glyph a built-in component renders, including with a definition
  object or a third-party icon.
- **Class-replacement customization.** An unstyled mode replaces the library's class vocabulary
  through a provider and a published class-structure object. This component is one of the few in
  the suite that supports it; the published structure exposes wrapper and svg class slots plus
  horizontal-flip, vertical-flip, name-prefix, size, svg-prefix and theme-colour slots.
- **Content-security-policy motivation.** SVG became the default icon type as a CSP improvement,
  because font icons need a `font-src` allowance that SVG icons do not.
- **Consumption by other components.** Other components accept a definition object directly through
  their own properties rather than composing the component, and the button page recommends the
  component for start and end slots.

## Casauran decisions

These are decisions, not observations. Each carries a disposition in
`specs/components/svg-icon.parity.md`.

- **The drawing is structured data, never markup.** `SECURITY_ARCHITECTURE.md` names SVG an
  untrusted input class and requires an explicit security review for SVG stages. A definition whose
  drawing is a markup string can only be rendered by injecting it, which means an
  `innerHTML`-class sink on a value that routinely arrives from a bundler loader, a CMS, or an
  upload. Casauran's definition therefore carries geometry — path data plus a closed set of paint
  instructions — and the component renders one `<path>` element per layer. The API cannot express a
  script, an external reference, an embedded image, or foreign content, so the property is
  structural rather than filtered.
- **No children.** Accepting arbitrary inner SVG elements would reopen exactly the surface the
  structured definition closes, and it is the same capability by a different route.
- **The view box belongs to the definition.** It describes the drawing, not the site that renders
  it, so there is one place to set it rather than two that can disagree.
- **Variants are a closed Casauran vocabulary.** `solid | outline | duotone`, typed as a union
  rather than an open string keyspace, so a misspelled variant is a compile error instead of
  artwork that silently falls back. This follows the same reasoning that made `IconName`, `tone`
  and `size` closed. The documented fallback to the default drawing is kept, and the drawing that
  actually rendered is reflected so the fallback is observable rather than invisible.
- **Size, tone and mirroring are Icon's vocabularies.** The two components differ in where the
  drawing comes from, not in how an icon is sized or coloured, so SVGIcon reuses `IconSize`,
  `IconTone` and `IconFlip` rather than declaring parallel scales.
- **Accessibility is inverted relative to the reference's single rule.** Decorative is the default
  and `label` is the only escape to `role="img"`. A blank label names nothing, so it stays
  decorative rather than publishing an unnamed image.
- **No `tabIndex`, `role`, `aria-hidden` or `aria-label` passthrough.** A focusable element hidden
  from assistive technology is an accessibility defect, and the other three would contradict
  semantics the component derives from `label`.
- **No second styling target for the inner element.** A class and inline style for the nested
  `<svg>` would make internal DOM a stable consumer contract, which `API_GOVERNANCE.md` and
  `CSS_ARCHITECTURE.md` both refuse. Customization is the governed component-token seam.
- **Stroke weight belongs to the layer.** Caller-owned artwork may be drawn at a weight other than
  the platform default, and one drawing may mix weights, so weight is a per-layer property of the
  definition rather than a theme-level CSS seam.
- **No icon font, no icon type switch, no ambient provider.** The frozen architecture ships SVG
  only, so there is no font mode to migrate from and no reason for a context that chooses between
  them. Artwork a component should let callers replace is a slot on that component, not a global
  registry read.
- **No class-replacement provider.** ADR-003 fixes a static cascade with a documented token seam;
  runtime class replacement is a different, rejected architecture.
- **No bundled catalog of hundreds of glyphs.** `@casauran/icons` ships a small, independently
  drawn catalog that grows when a Casauran surface needs a glyph. SVGIcon's purpose is that a
  caller does not need the catalog to grow in order to render their own artwork.
