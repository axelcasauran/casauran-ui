# Foundation Token Contract

Stage: `F0.05`
Status: implemented

## Scope and ownership

`@casauran/tokens` owns the framework-neutral design vocabulary used by Casauran packages and applications. The canonical authored source is `registry/tokens/foundation.json`; `packages/tokens/src/generated.ts` is deterministic output and must not be edited by hand. This stage introduces no public React component, runtime dependency, stylesheet, theme selector, or provider.

## Token layers

The contract reserves four ordered layers: primitive, semantic, component, and theme. F0.05 implements primitive references and semantic intent aliases. Theme assignment belongs to F0.06.

The component layer is opened by F0.05 but populated only by the owning component stage that proves a durable customization seam. F0.05 itself shipped an empty component inventory; entries added later belong to their component's stage evidence, not to this contract.

Primitive coverage includes color, spacing, density, typography, radius, border width, elevation, motion, opacity, and stacking. Semantic names express product intent such as `surface.canvas`, `text.primary`, and `focus.ring`; consumers should prefer them over primitive values.

## Public API contract

The package exports generated `primitiveTokens`, `semanticTokens`, `componentTokens`, CSS-variable and reference maps, literal name unions, token definition types, and these lookup helpers:

- `getTokenDefinition(name)` returns the public definition;
- `resolveTokenValue(name)` resolves a primitive or a one-hop semantic alias;
- `getTokenCssVariable(name)` returns the stable `--csn-*` property name;
- `tokenVariable(name)` returns a CSS `var(...)` reference.

Names are compile-time unions. Unsupported JavaScript input throws `RangeError` with `CSN-TOKEN-001`. An unresolved generated semantic reference throws `CSN-TOKEN-002`; repository validation prevents that state from shipping.

## Naming and CSS variables

Token names use lowercase dot-separated domains with optional hyphenated intent suffixes. Primitive variables use the `--csn-ref-*` namespace; semantic variables use `--csn-*`. CSS variable names are API identifiers, not a promise that this package emits or assigns them. Renaming or removing a published name follows public API governance.

## Accessibility and theme obligations

The vocabulary provides focus, status, forced-color-adjacent semantic intent, readable typography, and motion alternatives. Individual values do not prove WCAG contrast: F0.06 theme assignments must test foreground/background pairs, forced colors, and reduced motion. Components must use semantic intent and retain visible focus; they must not infer accessibility from a primitive color alone.

## SSR, security, and performance

The package is static data plus pure lookups. It accesses no browser globals, DOM, locale, direction, network, storage, or user-controlled HTML and is safe at server module evaluation. Registry validation rejects malformed values, namespace drift, duplicate identifiers, unresolved references, and type mismatches. Lookup maps are initialized once per module; no universal performance claim is made.

## Compatibility and evolution

Additive primitive or semantic tokens are normally compatible. Removal, rename, type change, semantic repointing with material behavior impact, or CSS-variable rename requires API review and migration treatment. Component tokens may be added only with their owning component and evidence for the customization seam. The schema and `tokenContractVersion` version structural contract changes.

## F0.06 boundary

F0.06 owns CSS generation/emission, default and alternate theme assignments, density application, dark/high-contrast behavior, reduced-motion overrides, cascade layers, and runtime theme integration. F0.05 exports identifiers and fallback-resolvable authored values only. F0.06 remains not started after this stage closes.
