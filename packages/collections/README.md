# @casauran-internal/collections

**Ownership:** ordered/tree collections, active item and selection models.

## Collection engine

The package provides immutable ordered/tree snapshots, keyed registration, enabled active-item
movement, deterministic single/multiple/range selection, visible-tree projection, and caller-timed
typeahead. It is framework-neutral and server-safe.

Active identity, selected identity, disabled state, expanded state, and DOM focus are separate.
Components own keyboard mappings and APG semantics; accessibility owns focus mechanics; overlay,
virtualization, data, i18n, and persistence retain their domain responsibilities.

## Boundary

Implementation package that may be distributed transitively, but is not a supported consumer API unless promoted by ADR.

## Dependency discipline

No external runtime dependency without DEPENDENCY_POLICY review. Domain-owned contracts/adapters stay here when justified.
