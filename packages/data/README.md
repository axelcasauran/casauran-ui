# @casauran-internal/data

**Ownership:** filter/sort/group/aggregate/page descriptors and processing.

## Foundation contract

The F0.12 implementation provides readonly filter/sort/group/aggregate/page descriptors, safe
own-property field access, deterministic immutable local processing, and provider-neutral state
that can also be sent to caller-owned server integrations.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.

The package has no runtime dependencies, React/client directive, browser global, timer, storage,
network, transport, persistence, virtualization, locale, or component ownership. See
`specs/foundation/data-engine.md` and `registry/data/foundation.json` for the complete processing
order, validation, trust, paging/grouping, and F0.13 boundaries.
