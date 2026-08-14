# @casauran-internal/virtualization

**Ownership:** windowing, measurement, anchoring and overscan.

## Contract

Create a one-dimensional axis with `createVirtualAxis`, query absolute windows with explicit item
overscan, update finite positive sizes through `measure`, and apply the returned logical
`scrollAdjustment` when preserving a stable-key anchor. `includeIndexes` keeps focused or active
items mounted without moving focus or owning selection. `createVirtualGrid` composes row and column
axes without allocating a cell matrix.

`createElementMeasurementObserver` accepts a browser `ResizeObserver` constructor explicitly and
begins only when called after mount. The package root is safe for SSR/RSC import and has no React
or runtime dependency. Counts are bounded at 2,000,000; offsets are logical, and DOM scrolling,
RTL normalization, rendering, semantics, loading, and event scheduling remain with components.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters
stay here when justified. The full contract, accessibility boundary, dynamic measurement and
performance scenario are specified in `specs/foundation/virtualization.md`.

F0.16 drag/drop and autoscroll are not implemented here.
