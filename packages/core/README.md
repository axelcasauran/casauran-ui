# @casauran-internal/core

**Ownership:** stable IDs, controllable state, invariants and browser-safe utilities.

## State and ID foundation

The package supplies framework-neutral `StateUpdate`, controlled-value resolution, functional
update resolution, and deterministic scoped-ID normalization. React hooks remain in
`@casauran/react/state`; collection, overlay, form, and persistence state remain with their domain
owners.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
