# Token Architecture

Primitive -> semantic -> component -> theme assignment.

## Authority and ownership

The versioned source of truth is `registry/tokens/foundation.json`, governed by `registry/schemas/token-contract.schema.json`. `@casauran/tokens` owns public data, types, names, and pure resolution helpers. Generated TypeScript is derived and drift-checked. The independent contract is `specs/foundation/tokens.md`.

## Layer rules

- Primitive tokens are independently authored reference values for color, dimensions, typography, elevation, motion, opacity, density, and stacking.
- Semantic tokens name durable intent and reference exactly one compatible primitive. Product code prefers this layer.
- Component tokens exist only when an implemented component needs a durable customization seam. They are not a mirror of every CSS declaration.
- Theme assignments map intent to visual families. CSS emission and runtime theme behavior are owned by F0.06, not the token data package.

All identifiers are globally unique. Primitive custom properties use `--csn-ref-*`; semantic properties use `--csn-*`. Published identifiers follow public API lifecycle governance.

## Change workflow

Edit the registry, run `pnpm generate:tokens`, review the generated API change, then run `pnpm validate:tokens`. Do not edit generated output directly. Additions must carry type, value/reference, stable CSS variable name, and an intent description. Removal, rename, type change, or material semantic reassignment requires compatibility and migration review.

Token values alone do not establish accessible contrast or theme completeness. Theme validation must exercise foreground/background pairs, forced colors, reduced motion, RTL-safe CSS use, and supported density modes when F0.06 assigns these names.
