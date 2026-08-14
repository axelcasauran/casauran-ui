# @casauran-internal/events

**Ownership:** event composition and normalized project event contracts.

## Cancellable composition

`composeEventHandlers` runs a consumer handler before component-owned behavior and skips the owner
handler when the consumer calls `preventDefault()`. This keeps cancellation consistent without
introducing a global event bus or hiding native React events.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
