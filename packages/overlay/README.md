# @casauran-internal/overlay

**Ownership:** portal, dismissable layer and focus lifecycle.

## Overlay foundation

The package provides portal-host lifecycle with theme/density/direction scope synchronization,
token-safe ordered layers, top-layer Escape and pointer-outside dismissal, nested focus entry/trap/
restoration, and native-inert modal background isolation.

It is framework-neutral. Browser access begins only when a caller invokes a manager with an
existing document or element, so importing the package is server-safe. Positioning, animation,
open state, React bindings, component semantics, styling, content, and scroll locking remain with
their documented owners.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
