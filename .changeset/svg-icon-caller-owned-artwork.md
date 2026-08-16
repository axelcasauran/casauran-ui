---
'@casauran/react': minor
'@casauran/icons': minor
---

`SVGIcon` renders artwork the caller owns, as structured data rather than markup.

`@casauran/icons` gains the definition contract: the `SVGIconDefinition`, `IconPath` and
`SVGIconVariant` types, an `isSVGIconDefinition` guard for a definition that crossed a runtime
boundary, a `resolveSVGIcon` resolver, the `svgIconVariants` list, and the
`SVG_ICON_DEFAULT_VIEW_BOX` and `SVG_ICON_DEFAULT_STROKE_WIDTH` constants.

`@casauran/react` exports `SVGIcon` and its types, plus a `./svg-icon.css` entry point. A drawing is
an ordered list of layers — geometry plus a closed set of paint, weight, fill-rule and opacity
values — so the component never parses or injects markup and cannot express a script, an external
reference, an embedded image, or foreign content. A definition that does not validate renders no
artwork rather than partial output.

Definitions may ship `solid`, `outline` and `duotone` drawings of one symbol; a variant a definition
does not ship falls back to the default drawing and reports that in `data-variant`. Size, tone and
mirroring are the same vocabularies `Icon` uses, and a catalog definition from `getIconDefinition`
renders through `SVGIcon` unchanged.

Both changes are additive. No existing export changed shape, and `Icon` is unaffected.
