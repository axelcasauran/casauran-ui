# @casauran/icons

**Ownership:** supported tree-shakeable SVG icon data.

## Status

The initial catalog is available for the Icon stage. `getIconDefinition(name)` returns immutable
tree-shakeable SVG path data for supported names, or `undefined` for an unknown name. It accepts no
raw SVG, URL, or external resource. Direct definition rendering remains the SVGIcon stage boundary.

## Boundary

Supported consumer package. Documented exports are public API.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
