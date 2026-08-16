# Icon reference analysis

## Provenance

The required local-only preflight passed on 2026-08-14 and again on 2026-08-16 against snapshot
`2b68481b897ab216625fd264a10fb323fc0071c2a589f893c488d13e91ff4862`, resolved through
`CASAURAN_KENDO_DOCS_PATH`. No online repository, live documentation site, search engine,
third-party tutorial, or model memory was used, and no fallback exists.

The stage ledger's nonexistent `docs/content/icons` path was superseded by the higher-authority
registry/reference-map path `docs/content/common/icon`.

## Examined paths

Paths are relative to `docs/content`. The 2026-08-14 pass examined the first block; the 2026-08-16
capability revalidation added the second, because a component page is not the whole documented
capability surface and the original pass could not see the icon consumption model, the provider
surface, the customization posture, or the version history from `common/icon` alone.

### Component and API pages (2026-08-14)

- `common/icon/index.md`
- `common/icon/appearance.md`
- `common/icon/accessibility/wai-aria-support.md`
- `common/api/Icon.md`
- `common/api/IconProps.md`
- `common/api/IconSize.md`
- `common/api/IconThemeColor.md`
- `common/api/IconFlip.md`

### Package, provider, styling and cross-cutting pages (2026-08-16)

- `common/index.md`
- `common/get-started.md`
- `common/api/IconVariant.md`
- `common/api/IconsContext.md`
- `common/api/IconsContextType.md`
- `common/api/IconsClassStructure.md`
- `common/svgicon/index.md`
- `common/svgicon/appearance.md`
- `common/svgicon/customization.md`
- `common/svgicon/accessibility/wai-aria-support.md`
- `common/adaptive-mode/index.md`
- `common-features/accessibility/index.md`
- `common-features/accessibility/accessibility-compliance.md`
- `styling/index.md`
- `styling/icons.md`
- `styling/migrating-font-svg.md`
- `styling/unstyled.md`
- `styling/customizing.md`
- `server-components/index.md`
- `intl/l10n/rtl_support.md`
- `troubleshooting/csp.md`
- `updates/breaking-changes/15-0-0.md`
- `knowledge-base/custom-svg-from-file.md`

### Deliberately not opened

`common/examples/icon/**` and `common/examples/svg-icon/**`. The 2026-08-14 pass listed four of
those runnable example files. They are competitor implementation material rather than behavioral
documentation, and §6 of the component-stage prompt forbids implementing from them, so the
revalidation neither relies on them nor treats anything found in them as a requirement. Every
behaviour recorded below is sourced from the prose and API pages listed above.

`common/svgicon/**` is examined for boundary reasons only: it is the reference's direct-definition
component, owned in Casauran by stage `1.03 SVGIcon`. Nothing from it is implemented here.

## Extracted behavioral requirements

Observed facts, expressed as capability families rather than API shapes.

- **Named glyph rendering.** A named icon renders a catalog glyph. The name is an ordinary string;
  the reference documents no compile-time constraint on it.
- **Two consumption modes.** The reference splits named icons into a font-icon component and an
  SVG component. The font set is no longer shipped with the themes and must be installed and
  imported separately; SVG became the default icon type, and the migration page states the reason
  as content-security-policy improvement. The CSP page confirms font icons require a `font-src`
  allowance that SVG icons do not.
- **Size scale.** Eight documented steps — a default plus xsmall through xxxlarge — described in
  the documentation by explicit pixel box sizes from 12 to 48. Custom sizes are applied through
  `style`.
- **Theme colour scale.** Nine documented values: an inheriting default plus primary, secondary,
  tertiary, info, success, warning, error and inverse. When unset the icon inherits its parent's
  colour. `dark` and `light` were removed in v15. Custom colours are applied through `style`.
- **Mirroring.** Four documented values — a non-flipping default plus horizontal, vertical and
  both. Mirroring is always explicit; nothing in the localization or RTL documentation describes
  automatic mirroring of artwork by direction.
- **Variant.** Solid, outline and duotone drawings of one icon, with a documented fallback to the
  default drawing when a variant is absent. Documented on the SVG component only, and only from
  icon-package v5.
- **Passthrough surface.** Identifier, class, inline style, tab index, and a mouse-event family
  (click, double click, down, up, enter, leave, move, over, out). A ref resolves to a component
  handle type.
- **Accessibility posture.** One documented rule: the icon element and its children are hidden
  from assistive technology. The component publishes no keyboard model and does not appear in the
  suite compliance table at all; the icon accessibility pages claim WCAG 2.2 AA, Section 508, axe
  automation, and a three-combination screen-reader test matrix.
- **Application-level icon configuration.** A React context configures which icons the suite's own
  components render and whether the suite renders font or SVG icons, including replacing a built-in
  glyph inside another component.
- **Class-replacement customization.** An unstyled mode replaces the library's class vocabulary
  through a provider and a published class-structure object. The icons class structure covers the
  SVG component; the supported unstyled component list does not include the font-icon component.
- **Catalog scale and churn.** The SVG set is documented as more than 500 icons, with a public
  changelog covering renames, consolidations, removals without replacement, removed aliases, and a
  changed default variant, plus a codemod for the migration.
- **Loading indicator.** A dedicated icon class renders a busy indicator, sized and coloured like
  any other icon.
- **Adjacent rendering paths.** A glyph can also be produced with plain HTML plus a class, or with
  a custom class and a Unicode escape, without the component.
- **Server components.** A separate experimental distribution existed and was discontinued; the
  primary distribution is not documented as RSC-first.
- **Adaptive and responsive behaviour.** The suite's adaptive configuration is a breakpoint model
  for components that become modal on small screens. Nothing in it concerns icons.

## Casauran decisions

These are decisions, not observations, and each one is recorded with its disposition in
`specs/components/icon.parity.md`.

- The frozen architecture prohibits font icons, so Icon renders independently authored SVG path
  data from `@casauran/icons`. There is one consumption mode, not two, and therefore no icon-type
  switch and no migration path between modes.
- The catalog is deliberately small and grows when a Casauran surface needs a glyph. It is
  independently drawn; no third-party icon set, path data, or naming scheme is reused.
- `name` is typed as the catalog union rather than a free string, so a glyph that does not exist is
  a compile error. `isIconName` narrows a value that crossed a runtime boundary, and an unnarrowed
  unknown name still fails closed at render time.
- Accessibility is inverted relative to the reference's single rule: decorative is the default and
  `label` is the explicit, and only, escape to `role="img"`. A blank label names nothing, so it
  keeps the icon decorative rather than publishing an unnamed image.
- Icon does not accept `tabIndex`, `role`, `aria-hidden` or `aria-label`. A focusable element
  hidden from assistive technology is an accessibility defect, and the other three would contradict
  semantics the component derives from `label`.
- The tone vocabulary is Casauran's platform vocabulary and carries no second name for one colour
  ramp; informational artwork uses `accent`, exactly as Button does.
- Direct definition rendering is reserved for stage `1.03 SVGIcon`, and with it every capability
  that depends on the caller owning the drawing: custom glyphs, drawing variants, and replacing a
  built-in glyph inside another component.
- Customization is a governed component-token seam in a fixed cascade order rather than a runtime
  class-replacement provider, per ADR-003.
